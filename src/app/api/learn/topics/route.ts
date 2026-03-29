import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { searchParams } = new URL(req.url);
  const tool = (searchParams.get("tool") || "AUTOSYS") as never;

  const topics = await prisma.topic.findMany({
    where: { tool },
    orderBy: { order: "asc" },
    include: {
      progress: { where: { userId: user.id } },
    },
  });

  const result = topics.map((t: typeof topics[number]) => ({
    id: t.id,
    tool: t.tool,
    order: t.order,
    title: t.title,
    description: t.description,
    hasLab: t.hasLab,
    labType: t.labType,
    quizGate: t.quizGate,
    completed: t.progress[0]?.completed ?? false,
    quizScore: t.progress[0]?.quizScore ?? null,
  }));

  return NextResponse.json({ topics: result });
}
