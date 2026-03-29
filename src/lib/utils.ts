import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const TOOL_LABELS: Record<string, string> = {
  AUTOSYS: "AutoSys/WCC",
  CONTROL_M: "Control-M",
  AIRFLOW: "Apache Airflow",
  DSERIES: "dSeries",
  DOLLAR_UNIVERSE: "Dollar Universe",
}

export const TOOL_BADGE_CLASS: Record<string, string> = {
  AUTOSYS: "badge-autosys",
  CONTROL_M: "badge-control_m",
  AIRFLOW: "badge-airflow",
  DSERIES: "badge-dseries",
  DOLLAR_UNIVERSE: "badge-dollar_universe",
}

export const LEVEL_LABELS: Record<string, string> = {
  L1: "Entry (0–2 yrs)",
  L2: "Mid (2–5 yrs)",
  L3: "Senior (5+ yrs)",
}

export function formatSalary(min?: number | null, max?: number | null): string {
  if (!min && !max) return "Salary not disclosed"
  const fmt = (n: number) =>
    n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` : `₹${n.toLocaleString("en-IN")}`
  if (min && max) return `${fmt(min)} – ${fmt(max)} PA`
  if (min) return `${fmt(min)}+ PA`
  return `Up to ${fmt(max!)} PA`
}

export function readinessColor(pct: number): string {
  if (pct >= 75) return "bg-success"
  if (pct >= 50) return "bg-yellow-500"
  return "bg-accent"
}
