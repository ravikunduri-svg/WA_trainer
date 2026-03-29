"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn, TOOL_LABELS, TOOL_BADGE_CLASS, LEVEL_LABELS, formatSalary, readinessColor } from "@/lib/utils";

type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  tool: string;
  level: string;
  salaryMin: number | null;
  salaryMax: number | null;
  shift: string | null;
  jdText: string;
  applyUrl: string;
  source: string;
  postedAt: string;
  matchPct: number;
  readinessGate: boolean;
};

const TOOLS = ["", "AUTOSYS", "CONTROL_M", "AIRFLOW", "DSERIES", "DOLLAR_UNIVERSE"];
const LEVELS = ["", "L1", "L2", "L3"];
const SOURCE_BADGE: Record<string, string> = {
  NAUKRI: "bg-red-900/30 text-red-300 border-red-800",
  LINKEDIN: "bg-blue-900/30 text-blue-300 border-blue-800",
  INDEED: "bg-indigo-900/30 text-indigo-300 border-indigo-800",
  SEEDED: "bg-slate-700/30 text-slate-400 border-slate-600",
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [toolFilter, setToolFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams();
    if (toolFilter) params.set("tool", toolFilter);
    if (levelFilter) params.set("level", levelFilter);
    setLoading(true);
    fetch(`/api/jobs?${params}`)
      .then((r) => r.json())
      .then((d) => { setJobs(d.jobs ?? []); setLoading(false); });
  }, [toolFilter, levelFilter]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-3xl font-bold text-white">Live Jobs</h1>
          <p className="text-slate-400 text-sm mt-1">Updated every 6 hours · Hyderabad</p>
        </div>
        <div className="flex gap-2">
          <select
            value={toolFilter}
            onChange={(e) => setToolFilter(e.target.value)}
            className="bg-surface border border-border text-slate-300 text-sm rounded px-3 py-1.5 focus:outline-none focus:border-accent"
          >
            <option value="">All Tools</option>
            {TOOLS.slice(1).map((t) => (
              <option key={t} value={t}>{TOOL_LABELS[t]}</option>
            ))}
          </select>
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="bg-surface border border-border text-slate-300 text-sm rounded px-3 py-1.5 focus:outline-none focus:border-accent"
          >
            <option value="">All Levels</option>
            {LEVELS.slice(1).map((l) => (
              <option key={l} value={l}>{LEVEL_LABELS[l]}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-500">Loading jobs…</div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-20 text-slate-500">No jobs found for this filter.</div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="card"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className={cn("badge", TOOL_BADGE_CLASS[job.tool])}>{TOOL_LABELS[job.tool]}</span>
                    <span className="badge bg-slate-700/40 text-slate-400 border-slate-600">{LEVEL_LABELS[job.level]}</span>
                    <span className={cn("badge border", SOURCE_BADGE[job.source])}>{job.source}</span>
                  </div>
                  <h3 className="font-heading font-semibold text-white">{job.title}</h3>
                  <p className="text-sm text-slate-400">{job.company} · {job.location}</p>
                  <p className="text-sm text-slate-500 mt-0.5">{formatSalary(job.salaryMin, job.salaryMax)}</p>
                  {job.shift && <p className="text-xs text-slate-600 mt-0.5">Shift: {job.shift}</p>}
                </div>

                {/* Match meter */}
                <div className="text-right shrink-0">
                  <div className="text-xl font-bold text-white">{job.matchPct}%</div>
                  <div className="text-xs text-slate-500">match</div>
                  <div className="readiness-bar w-16 mt-1">
                    <div className={cn("readiness-fill", readinessColor(job.matchPct))} style={{ width: `${job.matchPct}%` }} />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 mt-4 pt-3 border-t border-border">
                <button
                  onClick={() => setExpanded(expanded === job.id ? null : job.id)}
                  className="text-xs text-slate-400 hover:text-white transition-colors"
                >
                  {expanded === job.id ? "Hide JD ▲" : "View JD ▼"}
                </button>
                <a href={`/interview?jobId=${job.id}`} className="text-xs text-accent hover:underline">
                  Practice Interview
                </a>
                {job.readinessGate ? (
                  <a
                    href={job.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto btn-accent text-xs px-3 py-1.5"
                  >
                    Apply →
                  </a>
                ) : (
                  <div className="ml-auto">
                    <span className="text-xs text-warning">
                      Reach 50% readiness to unlock Apply
                    </span>
                    <a href="/learn" className="ml-2 text-xs text-accent hover:underline">
                      Start Learning
                    </a>
                  </div>
                )}
              </div>

              {/* JD expand */}
              {expanded === job.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-3 pt-3 border-t border-border"
                >
                  <pre className="text-xs text-slate-400 whitespace-pre-wrap font-body leading-relaxed max-h-64 overflow-y-auto">
                    {job.jdText}
                  </pre>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
