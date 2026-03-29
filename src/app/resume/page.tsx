"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TOOL_LABELS } from "@/lib/utils";

const TOOLS = ["AUTOSYS", "CONTROL_M", "AIRFLOW", "DSERIES", "DOLLAR_UNIVERSE"] as const;

type ResumeData = {
  name: string;
  email: string;
  phone: string;
  background: string;
  targetTool: string;
  targetLevel: string;
  priorExperience: string;
  completedTopics: string;
  strengths: string;
};

const INITIAL: ResumeData = {
  name: "",
  email: "",
  phone: "",
  background: "",
  targetTool: "AUTOSYS",
  targetLevel: "L1",
  priorExperience: "",
  completedTopics: "",
  strengths: "",
};

export default function ResumePage() {
  const [form, setForm] = useState<ResumeData>(INITIAL);
  const [resume, setResume] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function set(field: keyof ResumeData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function generateResume() {
    setLoading(true);
    const res = await fetch("/api/resume/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setResume(data.resume ?? null);
    setLoading(false);
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="font-heading text-3xl font-bold text-white">ATS Resume Builder</h1>
        <p className="text-slate-400 text-sm mt-1">
          Honest resume — lab experience labelled correctly, non-IT background reframed as WA strengths.
          Never fabricates production experience.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Form */}
        <div className="card space-y-4">
          <h2 className="font-heading font-semibold text-white">Your Details</h2>

          {[
            { label: "Full Name", field: "name" as const, placeholder: "Priya Sharma" },
            { label: "Email", field: "email" as const, placeholder: "priya@email.com" },
            { label: "Phone", field: "phone" as const, placeholder: "+91 98765 43210" },
          ].map(({ label, field, placeholder }) => (
            <div key={field}>
              <label className="text-xs text-slate-400 mb-1 block">{label}</label>
              <input
                type="text"
                value={form[field]}
                onChange={(e) => set(field, e.target.value)}
                placeholder={placeholder}
                className="w-full bg-bg border border-border text-white rounded px-3 py-2 text-sm focus:outline-none focus:border-accent"
              />
            </div>
          ))}

          <div>
            <label className="text-xs text-slate-400 mb-1 block">Prior Background</label>
            <input
              type="text"
              value={form.background}
              onChange={(e) => set("background", e.target.value)}
              placeholder="e.g. School teacher, 5 years"
              className="w-full bg-bg border border-border text-white rounded px-3 py-2 text-sm focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-1 block">Target Tool</label>
            <select
              value={form.targetTool}
              onChange={(e) => set("targetTool", e.target.value)}
              className="w-full bg-bg border border-border text-white rounded px-3 py-2 text-sm focus:outline-none focus:border-accent"
            >
              {TOOLS.map((t) => (
                <option key={t} value={t}>{TOOL_LABELS[t]}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-1 block">
              Topics Completed (from Learning Tracks)
            </label>
            <textarea
              value={form.completedTopics}
              onChange={(e) => set("completedTopics", e.target.value)}
              placeholder="e.g. JIL Fundamentals (Lab-certified), BOX Jobs & Dependencies, AutoSys Commands"
              className="w-full bg-bg border border-border text-white rounded px-3 py-2 text-sm focus:outline-none focus:border-accent min-h-[80px] resize-none"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-1 block">Key Strengths / Skills</label>
            <textarea
              value={form.strengths}
              onChange={(e) => set("strengths", e.target.value)}
              placeholder="e.g. attention to detail, process orientation, stakeholder communication"
              className="w-full bg-bg border border-border text-white rounded px-3 py-2 text-sm focus:outline-none focus:border-accent min-h-[80px] resize-none"
            />
          </div>

          <button
            onClick={generateResume}
            disabled={loading || !form.name || !form.targetTool}
            className="btn-accent w-full py-2.5"
          >
            {loading ? "Generating resume…" : "Generate ATS Resume →"}
          </button>
        </div>

        {/* Output */}
        <div>
          {resume ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="card h-full"
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-heading font-semibold text-white">Your Resume</h2>
                <button
                  onClick={() => {
                    const blob = new Blob([resume], { type: "text/plain" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "resume.txt";
                    a.click();
                  }}
                  className="btn-ghost text-xs px-3 py-1.5"
                >
                  Download .txt
                </button>
              </div>
              <pre className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed overflow-y-auto max-h-[600px] font-mono">
                {resume}
              </pre>
            </motion.div>
          ) : (
            <div className="card h-full flex items-center justify-center text-slate-600 text-sm">
              Fill the form and click Generate →
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
