import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const tool = searchParams.get("tool") || undefined;
  const level = searchParams.get("level") || undefined;

  const jobs = await prisma.job.findMany({
    where: {
      isActive: true,
      ...(tool && { tool: tool as never }),
      ...(level && { level: level as never }),
    },
    orderBy: { postedAt: "desc" },
    take: 50,
  });

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  const readiness = (user?.readinessScore ?? {}) as Record<string, number>;

  const result = jobs.map((job: typeof jobs[number]) => ({
    ...job,
    matchPct: readiness[job.tool] ?? 0,
    readinessGate: (readiness[job.tool] ?? 0) >= 50,
  }));

  return NextResponse.json({ jobs: result });
}
