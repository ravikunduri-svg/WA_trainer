import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  tool: z.enum(["AUTOSYS", "CONTROL_M", "AIRFLOW", "DSERIES", "DOLLAR_UNIVERSE"]),
  level: z.enum(["L1", "L2", "L3"]),
  jobId: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { tool, level, jobId } = parsed.data;

  // Get questions for this tool/level
  const questions = await prisma.question.findMany({
    where: { tool: tool as never, level: level as never },
    take: 5,
    orderBy: { createdAt: "asc" },
  });

  if (questions.length === 0) {
    return NextResponse.json({ error: "No questions available for this tool/level" }, { status: 404 });
  }

  const session = await prisma.interviewSession.create({
    data: {
      userId: user.id,
      tool: tool as never,
      level: level as never,
      ...(jobId && { jobId }),
    },
  });

  return NextResponse.json({ sessionId: session.id, questions });
}
