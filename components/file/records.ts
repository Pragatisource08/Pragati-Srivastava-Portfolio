import { experience, openSource, projects } from "@/lib/content";

export type Practical = "cache" | "credibility" | "ports" | "viva";

export type FileRecord = {
  no: number;
  id: string;
  kind: "training" | "experiment" | "viva";
  title: string;
  indexTitle: string;
  date: string;
  aim: string;
  apparatus: string[];
  procedure: string[];
  result: string;
  stamp: string;
  evidence?: { label: string; url: string };
  practical?: Practical;
  paper?: "ruled" | "graph";
  half?: "left" | "right";
};

const [bharatRitu, airQuality, finances] = projects;
const [pr906, pr845] = openSource.prs;

export const records: FileRecord[] = [
  {
    no: 1,
    id: "training",
    kind: "training",
    title: `Summer training: ${experience.company}`,
    indexTitle: "Cloud 9 backend (CSRBOX)",
    date: experience.dates,
    aim: experience.summary,
    apparatus: experience.stack,
    procedure: experience.points,
    result: `${experience.role} · ${experience.location}`,
    stamp: "Deployed",
    practical: "cache",
  },
  {
    no: 2,
    id: bharatRitu.slug,
    kind: "experiment",
    title: bharatRitu.name,
    indexTitle: "BharatRitu credibility engine",
    date: "2026",
    aim: bharatRitu.aim,
    apparatus: bharatRitu.stack,
    procedure: bharatRitu.points,
    result: bharatRitu.tagline,
    stamp: "Team Lead · SIH 2026",
    evidence: bharatRitu.link,
    practical: "credibility",
  },
  {
    no: 3,
    id: `pr-${pr906.number}`,
    kind: "experiment",
    title: `${pr906.title} — PR #${pr906.number}`,
    indexTitle: `Port fallback (PR #${pr906.number})`,
    date: openSource.date,
    aim: "Stop pocketpaw from crashing at startup when its port is already taken.",
    apparatus: [openSource.language, "sockets", openSource.repo],
    procedure: [pr906.summary, pr906.detail],
    result: "Merged into pocketpaw.",
    stamp: pr906.status,
    evidence: { label: "View pull request", url: pr906.url },
    practical: "ports",
  },
  {
    no: 4,
    id: `pr-${pr845.number}`,
    kind: "experiment",
    title: `${pr845.title} — PR #${pr845.number}`,
    indexTitle: `Dark-mode fix (PR #${pr845.number})`,
    date: openSource.date,
    aim: "Make the select dropdown follow the dark theme like the rest of the app.",
    apparatus: [openSource.repo, "UI theming"],
    procedure: [pr845.summary],
    result: "Merged into pocketpaw.",
    stamp: pr845.status,
    evidence: { label: "View pull request", url: pr845.url },
    half: "right",
  },
  {
    no: 5,
    id: airQuality.slug,
    kind: "experiment",
    title: airQuality.name,
    indexTitle: "AirQuality 3D globe",
    date: "2025",
    aim: airQuality.aim,
    apparatus: airQuality.stack,
    procedure: airQuality.points,
    result: airQuality.tagline,
    stamp: "Global Nominee",
    evidence: airQuality.link,
    paper: "graph",
    half: "left",
  },
  {
    no: 6,
    id: finances.slug,
    kind: "experiment",
    title: finances.name,
    indexTitle: "Track Your Finances",
    date: "—",
    aim: finances.aim,
    apparatus: finances.stack,
    procedure: finances.points,
    result: finances.tagline,
    stamp: finances.context,
    evidence: finances.link,
    half: "right",
  },
  {
    no: 7,
    id: "viva",
    kind: "viva",
    title: "Viva voce",
    indexTitle: "Viva voce",
    date: "Today",
    aim: "Six questions. Every answer is somewhere in this file.",
    apparatus: [],
    procedure: [],
    result: "",
    stamp: "",
    practical: "viva",
  },
];
