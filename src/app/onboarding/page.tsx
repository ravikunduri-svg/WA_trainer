"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";

const BACKGROUNDS = [
  "Teacher / Trainer",
  "Data Entry / Back Office",
  "BPO / Customer Support",
  "Fresher (No experience)",
  "IT Support / Helpdesk",
  "Finance / Accounts",
  "Other non-IT",
];

const TOOLS = [
  { id: "AUTOSYS", label: "AutoSys/WCC", desc: "Broadcom CA — JIL, BOX jobs, EEM, WCC", cls: "badge-autosys" },
  { id: "CONTROL_M", label: "Control-M", desc: "BMC — Job flows, BIM, Self Service, Helix", cls: "badge-control_m" },
  { id: "AIRFLOW", label: "Apache Airflow", desc: "DAGs, Operators, Executors, XComs, Kubernetes", cls: "badge-airflow" },
  { id: "DSERIES", label: "dSeries", desc: "Broadcom — Agent, Broker, Job Streams, REST API", cls: "badge-dseries" },
  {
    id: "DOLLAR_UNIVERSE",
    label: "Dollar Universe",
    desc: "Uproc, Session, JDENET — completely separate from dSeries",
    cls: "badge-dollar_universe",
  },
];

const LEVELS = [
  { id: "L1", label: "Entry Level", desc: "0–2 years experience · Fresher-friendly" },
  { id: "L2", label: "Mid Level", desc: "2–5 years experience · Switching tools" },
  { id: "L3", label: "Senior Level", desc: "5+ years · Upskilling or migrating" },
];

const slideVariants = {
  enter: { opacity: 0, x: 30 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -30 },
};

export default function OnboardingPage() {
  const { user } = useUser();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [background, setBackground] = useState("");
  const [tool, setTool] = useState("");
  const [level, setLevel] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleFinish() {
    if (!user) return;
    setSaving(true);
    try {
      await fetch("/api/users/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ background, primaryTool: tool, targetLevel: level }),
      });
      router.push("/dashboard");
    } catch {
      setSaving(false);
    }
  }

  const steps = [
    {
      title: "What's your background?",
      subtitle: "We'll tailor your learning path accordingly",
      content: (
        <div className="grid sm:grid-cols-2 gap-3 mt-6">
          {BACKGROUNDS.map((b) => (
            <button
              key={b}
              onClick={() => { setBackground(b); setStep(1); }}
              className={`text-left p-4 rounded-lg border transition-all duration-150 ${
                background === b
                  ? "border-accent bg-accent/10 text-white"
                  : "border-border hover:border-slate-500 text-slate-300"
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      ),
    },
    {
      title: "Which tool do you want to learn?",
      subtitle: "You can add more tools later",
      content: (
        <div className="flex flex-col gap-3 mt-6">
          {TOOLS.map((t) => (
            <button
              key={t.id}
              onClick={() => { setTool(t.id); setStep(2); }}
              className={`flex items-start gap-4 text-left p-4 rounded-lg border transition-all duration-150 ${
                tool === t.id
                  ? "border-accent bg-accent/10"
                  : "border-border hover:border-slate-500"
              }`}
            >
              <span className={`badge ${t.cls} shrink-0`}>{t.label}</span>
              <span className="text-sm text-slate-400">{t.desc}</span>
            </button>
          ))}
        </div>
      ),
    },
    {
      title: "Your target level?",
      subtitle: "Sets the difficulty of interview questions and job matches",
      content: (
        <div className="flex flex-col gap-3 mt-6">
          {LEVELS.map((l) => (
            <button
              key={l.id}
              onClick={() => setLevel(l.id)}
              className={`text-left p-4 rounded-lg border transition-all duration-150 ${
                level === l.id
                  ? "border-accent bg-accent/10 text-white"
                  : "border-border hover:border-slate-500 text-slate-300"
              }`}
            >
              <div className="font-medium">{l.label}</div>
              <div className="text-sm text-slate-500 mt-0.5">{l.desc}</div>
            </button>
          ))}
          {level && (
            <button
              onClick={handleFinish}
              disabled={saving}
              className="btn-accent mt-2 py-3 text-base"
            >
              {saving ? "Setting up your profile…" : "Enter the platform →"}
            </button>
          )}
        </div>
      ),
    },
  ];

  const current = steps[step];

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="w-full max-w-xl">
        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                i <= step ? "bg-accent" : "bg-border"
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25 }}
          >
            <h2 className="font-heading text-2xl font-bold text-white">{current.title}</h2>
            <p className="text-slate-500 mt-1">{current.subtitle}</p>
            {current.content}
          </motion.div>
        </AnimatePresence>

        {step > 0 && (
          <button
            onClick={() => setStep(step - 1)}
            className="mt-4 text-sm text-slate-500 hover:text-slate-300 transition-colors"
          >
            ← Back
          </button>
        )}
      </div>
    </div>
  );
}
