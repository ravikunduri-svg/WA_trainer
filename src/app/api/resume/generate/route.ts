import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { groqChat } from "@/lib/groq";
import { z } from "zod";
import { TOOL_LABELS } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string(),
  background: z.string(),
  targetTool: z.string(),
  targetLevel: z.string(),
  completedTopics: z.string(),
  strengths: z.string(),
});

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const d = parsed.data;
  const toolName = TOOL_LABELS[d.targetTool] ?? d.targetTool;

  const prompt = `You are an ATS-optimised resume writer for Workload Automation roles in Hyderabad, India.

Candidate details:
- Name: ${d.name}
- Email: ${d.email}
- Phone: ${d.phone}
- Prior background: ${d.background}
- Target tool: ${toolName}
- Target level: ${d.targetLevel}
- Completed training topics: ${d.completedTopics || "None specified"}
- Key strengths: ${d.strengths || "None specified"}

STRICT RULES — you MUST follow these:
1. NEVER fabricate production experience. If the candidate has none, do not imply they do.
2. Label all training/lab experience explicitly as "Lab-certified" or "Training project".
3. Reframe non-IT background as relevant strengths for WA (e.g. teaching → process documentation and training delivery; BPO → SLA adherence and escalation management).
4. Use ATS-friendly formatting with clear section headers.
5. Include a Skills section with only the tool and skills they actually mentioned.
6. Keep the resume to one page worth of content.
7. Add a note at the bottom: "Note: All tool experience is lab/training-based. Open to entry-level roles with on-the-job mentoring."

Generate a professional plain-text resume now. Use this format:
[NAME]
[Contact line: email | phone | Hyderabad, India]

PROFESSIONAL SUMMARY
[2–3 sentences]

SKILLS
[Tool-specific skills based on completed topics]

WORKLOAD AUTOMATION TRAINING (Self-Study + Lab)
[List completed topics with "Lab-certified" label where applicable]

PROFESSIONAL EXPERIENCE
[Prior non-IT experience reframed with WA-relevant skills]

EDUCATION
[Leave blank — candidate to fill in]

[Note about entry-level openness]`;

  try {
    const resume = await groqChat(
      [{ role: "user", content: prompt }],
      { maxTokens: 1500 }
    );
    return NextResponse.json({ resume });
  } catch {
    return NextResponse.json({ error: "Failed to generate resume" }, { status: 500 });
  }
}
