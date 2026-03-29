import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { groqChat } from "@/lib/groq";
import { z } from "zod";

const schema = z.object({
  sessionId: z.string(),
  question: z.string(),
  qSource: z.string(),
  tool: z.string(),
  answer: z.string().min(1).max(2000),
});

// Server-side cross-product term detection (Layer 2)
const CROSS_TOOL_TERMS: Record<string, string[]> = {
  AUTOSYS: ["uproc", "jdenet", "job stream", "broker", "dag", "operator", "xcom"],
  DSERIES: ["uproc", "jdenet", "jil", "box job", "dag", "xcom", "sendevent"],
  DOLLAR_UNIVERSE: ["jil", "box job", "autostatus", "dag", "xcom", "job stream"],
  AIRFLOW: ["uproc", "jil", "box job", "autostatus", "broker", "event rule"],
  CONTROL_M: ["uproc", "jdenet", "jil", "dag", "xcom", "sendevent"],
};

function detectCrossToolTerms(tool: string, answer: string): string[] {
  const lower = answer.toLowerCase();
  return (CROSS_TOOL_TERMS[tool] ?? []).filter((t) => lower.includes(t));
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { sessionId, question, qSource, tool, answer } = parsed.data;
  const crossToolTerms = detectCrossToolTerms(tool, answer);

  const systemPrompt = `You are an expert Workload Automation interviewer evaluating a candidate's answer for a ${tool} interview question.

Your job:
1. Score the answer 1–10 for technical accuracy
2. Detect hallucinations: wrong version numbers, cross-product terminology (e.g. using Uproc/JDENET in AutoSys context, using JIL in dSeries context), fabricated features
3. Provide structured feedback

CRITICAL RULES:
- dSeries and Dollar Universe are completely separate products. Never blend their terminology.
- AutoSys uses JIL; dSeries uses Job Streams/Event Rules; Dollar Universe uses Uprocs/JDENET
- Flag any version numbers you cannot verify as potentially hallucinated

Respond ONLY with valid JSON — no markdown, no explanation, just the JSON object:
{
  "score": <number 1-10>,
  "accuracy": <"high"|"medium"|"low">,
  "hallucination_detected": <boolean>,
  "hallucination_details": <string or null>,
  "strengths": [<string>, ...],
  "improvements": [<string>, ...],
  "ideal_answer_points": [<string>, ...],
  "likely_follow_up": <string>
}`;

  const userMsg = `Tool: ${tool}
Question: ${question}
Source: ${qSource}
${crossToolTerms.length > 0 ? `\nWARNING: Possible cross-product terms detected: ${crossToolTerms.join(", ")}` : ""}

Candidate's Answer:
${answer}`;

  let feedback: Record<string, unknown>;
  try {
    const text = await groqChat(
      [{ role: "user", content: userMsg }],
      { system: systemPrompt, maxTokens: 1024 }
    );
    // Strip markdown code fences if model wraps JSON
    const clean = text.replace(/^```json?\s*/i, "").replace(/```\s*$/i, "").trim();
    feedback = JSON.parse(clean);
  } catch {
    feedback = {
      score: 0,
      accuracy: "low",
      hallucination_detected: false,
      hallucination_details: null,
      strengths: [],
      improvements: ["Could not evaluate answer — please try again"],
      ideal_answer_points: [],
      likely_follow_up: "",
    };
  }

  const score = typeof feedback.score === "number" ? feedback.score : 0;

  await prisma.answer.create({
    data: {
      sessionId,
      userId: user.id,
      question,
      qSource,
      answer,
      score,
      feedback: feedback as import("@prisma/client").Prisma.InputJsonValue,
    },
  });

  const allAnswers = await prisma.answer.findMany({ where: { sessionId } });
  const avgScore = allAnswers.reduce((sum: number, a: { score: number }) => sum + a.score, 0) / allAnswers.length;
  await prisma.interviewSession.update({ where: { id: sessionId }, data: { avgScore } });

  const currentReadiness = (user.readinessScore ?? {}) as Record<string, number>;
  const currentScore = currentReadiness[tool] ?? 0;
  const delta = ((score / 10) * 100 - currentScore) * 0.05;
  const newScore = Math.min(100, Math.max(0, Math.round(currentScore + delta)));
  await prisma.user.update({
    where: { id: user.id },
    data: { readinessScore: { ...currentReadiness, [tool]: newScore } },
  });

  return NextResponse.json({ feedback, score, newReadiness: newScore });
}
