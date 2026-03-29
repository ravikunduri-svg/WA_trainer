"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const tools = [
  { name: "AutoSys/WCC", tag: "AUTOSYS", cls: "badge-autosys", jobs: "12 live jobs" },
  { name: "Control-M", tag: "CONTROL_M", cls: "badge-control_m", jobs: "8 live jobs" },
  { name: "Apache Airflow", tag: "AIRFLOW", cls: "badge-airflow", jobs: "15 live jobs" },
  { name: "dSeries", tag: "DSERIES", cls: "badge-dseries", jobs: "6 live jobs" },
  { name: "Dollar Universe", tag: "DOLLAR_UNIVERSE", cls: "badge-dollar_universe", jobs: "4 live jobs" },
];

const features = [
  {
    icon: "🔍",
    title: "Live Job Scanner",
    desc: "Scrapes Naukri, LinkedIn & Indeed every 6 hours. See your readiness match % before you apply.",
  },
  {
    icon: "🎤",
    title: "AI Mock Interviews",
    desc: "Verified questions from Glassdoor/AmbitionBox — AI scores your answers 1–10 with hallucination detection.",
  },
  {
    icon: "📚",
    title: "Learning Tracks",
    desc: "5 tools × 8 topics each. Monaco JIL editor, quiz gates (70%), portfolio from completed labs.",
  },
  {
    icon: "📄",
    title: "ATS Resume Builder",
    desc: "Honest resume: lab experience labelled correctly, non-IT background reframed as WA strengths.",
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-bg text-slate-200">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-border max-w-7xl mx-auto">
        <span className="font-heading font-bold text-xl text-white">
          WA<span className="text-accent">Careers</span>
        </span>
        <div className="flex gap-3">
          <Link href="/sign-in" className="btn-ghost text-sm">Sign In</Link>
          <Link href="/sign-up" className="btn-accent text-sm">Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-24 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="badge bg-accent/20 text-accent border border-accent/30 mb-4">
            Built for Women in Tech · Hyderabad
          </span>
          <h1 className="font-heading text-5xl font-bold text-white mt-4 mb-6 leading-tight">
            Land your first<br />
            <span className="text-accent">Workload Automation</span> job
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-8">
            From zero to consultant. Live job scanner, AI mock interviews, verified learning tracks,
            and an ATS resume builder — all in one platform.
          </p>
          <Link href="/sign-up" className="btn-accent text-base px-8 py-3">
            Start for free →
          </Link>
        </motion.div>
      </section>

      {/* Tools */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <p className="text-center text-slate-500 text-sm mb-4 font-medium uppercase tracking-widest">5 Tools Covered</p>
        <div className="flex flex-wrap justify-center gap-3">
          {tools.map((t) => (
            <motion.div
              key={t.tag}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="card flex flex-col items-center gap-2 px-6 py-4 min-w-[140px]"
            >
              <span className={`badge ${t.cls}`}>{t.name}</span>
              <span className="text-xs text-slate-500">{t.jobs}</span>
            </motion.div>
          ))}
        </div>
        <p className="text-center text-xs text-slate-600 mt-3">
          dSeries and Dollar Universe are completely separate courses. Zero shared content.
        </p>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="grid sm:grid-cols-2 gap-4">
          {features.map((f) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="card"
            >
              <div className="text-2xl mb-2">{f.icon}</div>
              <h3 className="font-heading font-semibold text-white mb-1">{f.title}</h3>
              <p className="text-sm text-slate-400">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border py-6 text-center text-xs text-slate-600">
        WA Careers Platform · Hyderabad, India
      </footer>
    </main>
  );
}
