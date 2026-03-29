"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn, TOOL_LABELS, TOOL_BADGE_CLASS } from "@/lib/utils";
import Link from "next/link";

const TOOLS = ["AUTOSYS", "CONTROL_M", "AIRFLOW", "DSERIES", "DOLLAR_UNIVERSE"] as const;

type Topic = {
  id: string;
  tool: string;
  order: number;
  title: string;
  description: string;
  hasLab: boolean;
  labType: string | null;
  quizGate: number;
  completed?: boolean;
  quizScore?: number | null;
};

export default function LearnPage() {
  const [activeTool, setActiveTool] = useState<string>("AUTOSYS");
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/learn/topics?tool=${activeTool}`)
      .then((r) => r.json())
      .then((d) => { setTopics(d.topics ?? []); setLoading(false); });
  }, [activeTool]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="font-heading text-3xl font-bold text-white">Learning Tracks</h1>
        <p className="text-slate-400 text-sm mt-1">5 tools · 8 topics each · 70% quiz gate to advance</p>
      </div>

      {/* Tool tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {TOOLS.map((t) => (
          <button
            key={t}
            onClick={() => setActiveTool(t)}
            className={cn(
              "badge border transition-all",
              activeTool === t
                ? cn(TOOL_BADGE_CLASS[t], "scale-105")
                : "bg-surface border-border text-slate-400 hover:text-white"
            )}
          >
            {TOOL_LABELS[t]}
          </button>
        ))}
      </div>

      {(activeTool === "DSERIES" || activeTool === "DOLLAR_UNIVERSE") && (
        <div className="border border-warning/30 bg-warning/5 text-warning text-sm px-4 py-2 rounded mb-4">
          {activeTool === "DSERIES"
            ? "dSeries (Broadcom) content — completely separate from Dollar Universe. No shared terminology."
            : "Dollar Universe content — completely separate from dSeries. Uproc/JDENET are Dollar Universe concepts only."}
        </div>
      )}

      {loading ? (
        <div className="text-center py-20 text-slate-500">Loading topics…</div>
      ) : (
        <div className="space-y-3">
          {topics.map((topic, i) => {
            const unlocked = i === 0 || (topics[i - 1]?.completed && (topics[i - 1]?.quizScore ?? 0) >= topic.quizGate);
            return (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={cn("card flex items-center gap-4", !unlocked && "opacity-50")}
              >
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0",
                  topic.completed ? "bg-success text-white" : "bg-border text-slate-400"
                )}>
                  {topic.completed ? "✓" : topic.order}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-white">{topic.title}</h3>
                    {topic.hasLab && (
                      <span className="badge bg-accent/20 text-accent border-accent/30 text-xs">Lab</span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500 mt-0.5">{topic.description}</p>
                  {topic.quizScore != null && (
                    <p className="text-xs text-slate-600 mt-0.5">Quiz score: {topic.quizScore}%</p>
                  )}
                </div>
                {unlocked ? (
                  <Link
                    href={`/learn/${topic.id}`}
                    className="btn-ghost text-sm px-3 py-1.5 shrink-0"
                  >
                    {topic.completed ? "Review" : "Start →"}
                  </Link>
                ) : (
                  <span className="text-xs text-slate-600 shrink-0">🔒 Complete prev topic (70%)</span>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
