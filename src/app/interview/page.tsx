"use client";

import { useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn, TOOL_LABELS } from "@/lib/utils";

type Question = {
  id: string;
  text: string;
  source: string;
  tool: string;
  level: string;
  tags: string[];
};

type Feedback = {
  score: number;
  accuracy: "high" | "medium" | "low";
  hallucination_detected: boolean;
  hallucination_details: string | null;
  strengths: string[];
  improvements: string[];
  ideal_answer_points: string[];
  likely_follow_up: string;
};

const TOOLS = ["AUTOSYS", "CONTROL_M", "AIRFLOW", "DSERIES", "DOLLAR_UNIVERSE"] as const;
const LEVELS = ["L1", "L2", "L3"] as const;

// Layer 1: client-side hallucination regex
const CROSS_TOOL_TERMS: Record<string, RegExp[]> = {
  AUTOSYS: [/\buproc\b/i, /\bjdenet\b/i, /\bjob\s+stream\b/i, /\bbroker\b/i, /\bdag\b/i],
  DSERIES: [/\buproc\b/i, /\bjdenet\b/i, /\bjil\b/i, /\bbox\s+job\b/i, /\bdag\b/i],
  DOLLAR_UNIVERSE: [/\bjil\b/i, /\bbox\s+job\b/i, /\bautostatus\b/i, /\bdag\b/i],
  AIRFLOW: [/\buproc\b/i, /\bjil\b/i, /\bbox\s+job\b/i, /\bbroker\b/i],
  CONTROL_M: [/\buproc\b/i, /\bjdenet\b/i, /\bjil\b/i, /\bdag\b/i],
};

function InterviewContent() {
  const searchParams = useSearchParams();
  const jobId = searchParams.get("jobId");

  const [tool, setTool] = useState<string>("AUTOSYS");
  const [level, setLevel] = useState<string>("L1");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState<"setup" | "interview" | "done">("setup");
  const [hallucWarning, setHallucWarning] = useState<string | null>(null);
  const [startError, setStartError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Layer 1: keystroke hallucination detection
  function handleAnswerChange(val: string) {
    setAnswer(val);
    const patterns = CROSS_TOOL_TERMS[tool] ?? [];
    const found = patterns.find((p) => p.test(val));
    if (found) {
      setHallucWarning(
        `⚠️ "${found.source}" appears to be terminology from a different WA tool. Check your answer.`
      );
    } else {
      setHallucWarning(null);
    }
  }

  async function startSession() {
    setLoading(true);
    setStartError(null);
    try {
      const res = await fetch("/api/interview/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool, level, ...(jobId && { jobId }) }),
      });
      const data = await res.json();
      if (!res.ok) {
        const err = data.error;
        setStartError(typeof err === "string" ? err : `Validation error: ${JSON.stringify(err)}`
        );
      } else if (data.sessionId) {
        setSessionId(data.sessionId);
        setQuestions(data.questions);
        setQIndex(0);
        setPhase("interview");
      } else {
        setStartError("Unexpected response from server. Try again.");
      }
    } catch {
      setStartError("Network error. Is the server running?");
    }
    setLoading(false);
  }

  async function submitAnswer() {
    if (!sessionId || !answer.trim()) return;
    setLoading(true);
    const q = questions[qIndex];
    const res = await fetch("/api/interview/evaluate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        question: q.text,
        qSource: q.source,
        tool,
        answer,
      }),
    });
    const data = await res.json();
    setFeedback(data.feedback);
    setLoading(false);
  }

  function nextQuestion() {
    if (qIndex + 1 >= questions.length) {
      setPhase("done");
    } else {
      setQIndex(qIndex + 1);
      setAnswer("");
      setFeedback(null);
      setHallucWarning(null);
    }
  }

  const scoreColor = (s: number) =>
    s >= 8 ? "text-success" : s >= 5 ? "text-yellow-400" : "text-danger";

  if (phase === "setup") {
    return (
      <div className="max-w-xl mx-auto">
        <h1 className="font-heading text-3xl font-bold text-white mb-2">AI Mock Interview</h1>
        <p className="text-slate-400 mb-6">
          Choose your tool and level. Claude will evaluate your answers for accuracy, score them 1–10,
          and detect hallucinations.
        </p>
        <div className="card space-y-4">
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Tool</label>
            <select
              value={tool}
              onChange={(e) => setTool(e.target.value)}
              className="w-full bg-bg border border-border text-white rounded px-3 py-2 focus:outline-none focus:border-accent"
            >
              {TOOLS.map((t) => (
                <option key={t} value={t}>{TOOL_LABELS[t]}</option>
              ))}
            </select>
            {(tool === "DSERIES" || tool === "DOLLAR_UNIVERSE") && (
              <p className="text-xs text-warning mt-1">
                Note: dSeries and Dollar Universe are completely separate. Questions will not overlap.
              </p>
            )}
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Level</label>
            <div className="flex gap-2">
              {LEVELS.map((l) => (
                <button
                  key={l}
                  onClick={() => setLevel(l)}
                  className={cn(
                    "flex-1 py-2 rounded border text-sm transition-colors",
                    level === l ? "border-accent bg-accent/10 text-white" : "border-border text-slate-400 hover:border-slate-500"
                  )}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
          {startError && (
            <div className="border border-red-500/40 bg-red-500/10 text-red-400 text-sm px-3 py-2 rounded">
              {startError}
            </div>
          )}
          <button onClick={startSession} disabled={loading} className="btn-accent w-full py-3">
            {loading ? "Loading questions…" : "Start Interview →"}
          </button>
        </div>
      </div>
    );
  }

  if (phase === "done") {
    return (
      <div className="max-w-xl mx-auto text-center">
        <div className="card">
          <div className="text-4xl mb-3">🎉</div>
          <h2 className="font-heading text-2xl font-bold text-white mb-2">Interview Complete</h2>
          <p className="text-slate-400 mb-4">
            You answered {questions.length} questions. Your readiness score has been updated.
          </p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => { setPhase("setup"); setFeedback(null); setAnswer(""); }} className="btn-ghost">
              Practice Again
            </button>
            <a href="/dashboard" className="btn-accent">Back to Dashboard</a>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[qIndex];

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="flex gap-2 mb-6">
        {questions.map((_, i) => (
          <div
            key={i}
            className={cn("h-1.5 flex-1 rounded-full", i < qIndex ? "bg-success" : i === qIndex ? "bg-accent" : "bg-border")}
          />
        ))}
      </div>

      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-slate-500">Question {qIndex + 1} of {questions.length}</span>
        <span className="text-xs text-slate-600">Source: {currentQ.source}</span>
      </div>

      <div className="card mb-4">
        <p className="text-white leading-relaxed">{currentQ.text}</p>
        <div className="flex gap-1.5 mt-2">
          {currentQ.tags.map((tag) => (
            <span key={tag} className="badge bg-slate-700/30 text-slate-500 border-slate-700 text-xs">{tag}</span>
          ))}
        </div>
      </div>

      {!feedback ? (
        <div>
          {hallucWarning && (
            <div className="border border-warning/40 bg-warning/10 text-warning text-sm px-3 py-2 rounded mb-3">
              {hallucWarning}
            </div>
          )}
          <textarea
            ref={textareaRef}
            value={answer}
            onChange={(e) => handleAnswerChange(e.target.value)}
            placeholder="Type your answer here… Be specific. Avoid guessing version numbers."
            className="w-full bg-surface border border-border text-slate-200 rounded-lg p-4 min-h-[160px] focus:outline-none focus:border-accent text-sm resize-none"
            disabled={loading}
          />
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-slate-600">{answer.length}/2000</span>
            <button
              onClick={submitAnswer}
              disabled={loading || !answer.trim()}
              className="btn-accent px-6"
            >
              {loading ? "Evaluating…" : "Submit Answer"}
            </button>
          </div>
        </div>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card space-y-4"
          >
            <div className="flex items-center gap-4">
              <div className={cn("font-heading text-4xl font-bold", scoreColor(feedback.score))}>
                {feedback.score}/10
              </div>
              <div>
                <div className="text-sm text-slate-400">Accuracy: <span className="text-white">{feedback.accuracy}</span></div>
                {feedback.hallucination_detected && (
                  <div className="text-xs text-danger mt-0.5">
                    ⚠️ Hallucination detected: {feedback.hallucination_details}
                  </div>
                )}
              </div>
            </div>

            {feedback.strengths.length > 0 && (
              <div>
                <p className="text-xs font-medium text-success mb-1">Strengths</p>
                <ul className="text-sm text-slate-300 space-y-0.5">
                  {feedback.strengths.map((s, i) => <li key={i}>✓ {s}</li>)}
                </ul>
              </div>
            )}

            {feedback.improvements.length > 0 && (
              <div>
                <p className="text-xs font-medium text-warning mb-1">Improvements</p>
                <ul className="text-sm text-slate-300 space-y-0.5">
                  {feedback.improvements.map((s, i) => <li key={i}>→ {s}</li>)}
                </ul>
              </div>
            )}

            {feedback.ideal_answer_points.length > 0 && (
              <div>
                <p className="text-xs font-medium text-slate-500 mb-1">Ideal Answer Points</p>
                <ul className="text-sm text-slate-400 space-y-0.5">
                  {feedback.ideal_answer_points.map((s, i) => <li key={i}>• {s}</li>)}
                </ul>
              </div>
            )}

            {feedback.likely_follow_up && (
              <div className="border-t border-border pt-3">
                <p className="text-xs text-slate-500">Likely follow-up question:</p>
                <p className="text-sm text-slate-300 mt-0.5 italic">&ldquo;{feedback.likely_follow_up}&rdquo;</p>
              </div>
            )}

            <button onClick={nextQuestion} className="btn-accent w-full">
              {qIndex + 1 >= questions.length ? "See Results" : "Next Question →"}
            </button>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}

export default function InterviewPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-slate-500">Loading…</div>}>
      <InterviewContent />
    </Suspense>
  );
}
