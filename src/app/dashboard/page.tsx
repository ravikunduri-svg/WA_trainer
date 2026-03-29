import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { TOOL_LABELS, LEVEL_LABELS, readinessColor } from "@/lib/utils";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: {
      sessions: { take: 3, orderBy: { createdAt: "desc" } },
      progress: { where: { completed: true } },
    },
  });
  if (!user) redirect("/sign-in");

  const readiness = user.readinessScore as Record<string, number>;
  const primaryScore = readiness[user.primaryTool ?? ""] ?? 0;

  const recentJobs = await prisma.job.findMany({
    where: { isActive: true, tool: user.primaryTool ?? undefined },
    take: 3,
    orderBy: { postedAt: "desc" },
  });

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-white">
          Welcome back, {user.name.split(" ")[0]} 👋
        </h1>
        <p className="text-slate-400 mt-1">
          {user.primaryTool ? TOOL_LABELS[user.primaryTool] : "No tool selected"} ·{" "}
          {LEVEL_LABELS[user.targetLevel]}
        </p>
      </div>

      {/* Readiness score */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-heading font-semibold text-white">
            {user.primaryTool ? TOOL_LABELS[user.primaryTool] : "—"} Readiness
          </h2>
          <span className="text-2xl font-bold text-white">{primaryScore}%</span>
        </div>
        <div className="readiness-bar">
          <div
            className={`readiness-fill ${readinessColor(primaryScore)}`}
            style={{ width: `${primaryScore}%` }}
          />
        </div>
        <p className="text-xs text-slate-500 mt-2">
          Complete learning topics and mock interviews to raise your score
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Mock Interviews", value: user.sessions.length },
          { label: "Topics Completed", value: user.progress.length },
          { label: "Jobs Available", value: recentJobs.length + "+" },
        ].map((s) => (
          <div key={s.label} className="card text-center">
            <div className="font-heading text-2xl font-bold text-white">{s.value}</div>
            <div className="text-xs text-slate-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Recent jobs */}
      {recentJobs.length > 0 && (
        <div className="card">
          <h2 className="font-heading font-semibold text-white mb-4">Recent Jobs for You</h2>
          <div className="space-y-3">
            {recentJobs.map((job: typeof recentJobs[number]) => (
              <div key={job.id} className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium text-white">{job.title}</p>
                  <p className="text-xs text-slate-500">{job.company} · {job.location}</p>
                </div>
                <a href="/jobs" className="text-xs text-accent hover:underline">View →</a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
