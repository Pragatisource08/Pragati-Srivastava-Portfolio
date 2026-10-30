import { shuffle, type Rng } from "./rng";

// "Verify the report" — based on BharatRitu's credibility engine. The four signals
// are real; the weights, thresholds, and reports below are illustrative sample data.

export const SIGNALS = [
  { key: "weatherMatch", label: "Live-weather match" },
  { key: "sourceTrust", label: "Source trust" },
  { key: "corroboration", label: "Corroboration" },
  { key: "locationConfidence", label: "Location confidence" },
] as const;

export type SignalKey = (typeof SIGNALS)[number]["key"];
export type Verdict = "Verified" | "Under Review" | "Flagged";
export const VERDICTS: Verdict[] = ["Verified", "Under Review", "Flagged"];

export const ILLUSTRATIVE_WEIGHTS: Record<SignalKey, number> = {
  weatherMatch: 0.35,
  sourceTrust: 0.25,
  corroboration: 0.25,
  locationConfidence: 0.15,
};

export const DISCLAIMER = "Sample reports and illustrative weights, not production data.";

export type Report = {
  id: string;
  event: string;
  place: string;
  time: string;
  signals: Record<SignalKey, number>;
};

const SAMPLE_REPORTS: Report[] = [
  { id: "r1", event: "Hailstorm", place: "Lucknow, Gomti Nagar", time: "4:10 pm", signals: { weatherMatch: 0.92, sourceTrust: 0.81, corroboration: 0.88, locationConfidence: 0.9 } },
  { id: "r2", event: "Flash flood", place: "Guwahati, Zoo Road", time: "7:45 am", signals: { weatherMatch: 0.71, sourceTrust: 0.32, corroboration: 0.4, locationConfidence: 0.66 } },
  { id: "r3", event: "Snowfall", place: "Chennai, Marina Beach", time: "2:00 pm", signals: { weatherMatch: 0.02, sourceTrust: 0.2, corroboration: 0.05, locationConfidence: 0.85 } },
  { id: "r4", event: "Heavy rain", place: "Mumbai, Andheri East", time: "6:30 pm", signals: { weatherMatch: 0.88, sourceTrust: 0.55, corroboration: 0.93, locationConfidence: 0.78 } },
  { id: "r5", event: "Dust storm", place: "Jaipur, Malviya Nagar", time: "5:15 pm", signals: { weatherMatch: 0.6, sourceTrust: 0.48, corroboration: 0.35, locationConfidence: 0.4 } },
  { id: "r6", event: "Heatwave, 47 °C", place: "Nagpur, Sitabuldi", time: "1:30 pm", signals: { weatherMatch: 0.95, sourceTrust: 0.7, corroboration: 0.62, locationConfidence: 0.92 } },
  { id: "r7", event: "Tornado", place: "Bengaluru, Indiranagar", time: "11:00 am", signals: { weatherMatch: 0.08, sourceTrust: 0.6, corroboration: 0.1, locationConfidence: 0.7 } },
  { id: "r8", event: "Dense fog", place: "Delhi, ITO", time: "6:05 am", signals: { weatherMatch: 0.52, sourceTrust: 0.45, corroboration: 0.58, locationConfidence: 0.35 } },
];

export function score(signals: Record<SignalKey, number>): number {
  return SIGNALS.reduce((sum, s) => sum + signals[s.key] * ILLUSTRATIVE_WEIGHTS[s.key], 0);
}

export function verdictFor(signals: Record<SignalKey, number>): Verdict {
  const s = score(signals);
  if (s >= 0.7) return "Verified";
  if (s >= 0.4) return "Under Review";
  return "Flagged";
}

export const ROUNDS = 5;

export type CredibilityState = {
  reports: Report[];
  index: number;
  answers: { reportId: string; guess: Verdict; actual: Verdict; score: number }[];
  done: boolean;
};

export function createCredibility(rng: Rng): CredibilityState {
  return { reports: shuffle(rng, SAMPLE_REPORTS).slice(0, ROUNDS), index: 0, answers: [], done: false };
}

export function currentReport(state: CredibilityState): Report | null {
  return state.done ? null : state.reports[state.index];
}

export function stamp(state: CredibilityState, guess: Verdict): CredibilityState {
  const report = currentReport(state);
  if (!report) return state;
  const answers = [
    ...state.answers,
    { reportId: report.id, guess, actual: verdictFor(report.signals), score: score(report.signals) },
  ];
  const index = state.index + 1;
  return { ...state, answers, index, done: index >= state.reports.length };
}

export function correctCount(state: CredibilityState): number {
  return state.answers.filter((a) => a.guess === a.actual).length;
}
