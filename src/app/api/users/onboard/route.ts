import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  background: z.string().min(1),
  primaryTool: z.enum(["AUTOSYS", "CONTROL_M", "AIRFLOW", "DSERIES", "DOLLAR_UNIVERSE"]),
  targetLevel: z.enum(["L1", "L2", "L3"]),
});

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { background, primaryTool, targetLevel } = parsed.data;

  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses[0]?.emailAddress ?? "";
  const name = [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(" ") || email;

  const user = await prisma.user.upsert({
    where: { clerkId: userId },
    create: {
      clerkId: userId,
      name,
      email,
      background,
      primaryTool,
      targetLevel,
      onboardingDone: true,
      readinessScore: { [primaryTool]: 0 },
    },
    update: {
      background,
      primaryTool,
      targetLevel,
      onboardingDone: true,
      readinessScore: { [primaryTool]: 0 },
    },
  });

  return NextResponse.json({ user });
}
