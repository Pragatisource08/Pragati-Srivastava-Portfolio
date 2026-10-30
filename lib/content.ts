export const profile = {
  name: "Pragati Srivastava",
  shortName: "Pragati",
  role: "Backend engineer",
  focus: "Python backends, REST APIs, and applied AI",
  summary:
    "Computer science undergraduate building production Python backends and REST APIs. I built a Gemini-powered pipeline with Pinecone similarity search during a Generative AI internship, and I have merged pull requests in open source.",
  degree: "B.Tech, Computer Science & Engineering",
  university: "Dr. A.P.J. Abdul Kalam Technical University",
  years: "2024 – 2028",
  cgpa: "7.3 / 10",
  photo: "/pragati.jpg",
  photoSize: 400,
};

export const links = {
  email: "pragatisrivastava9a@gmail.com",
  mailto:
    "mailto:pragatisrivastava9a@gmail.com?subject=Hello%20Pragati%20%E2%80%94%20from%20your%20portfolio",
  linkedin: "https://www.linkedin.com/in/pragati-srivastava-283431321/",
  github: "https://github.com/Pragatisource08",
  resume: "/Pragati-Srivastava-Resume.pdf",
};

export type Experience = {
  company: string;
  role: string;
  dates: string;
  location: string;
  product: string;
  summary: string;
  points: string[];
  stack: string[];
};

export const experience: Experience = {
  company: "CSRBOX",
  role: "Generative AI and Cloud Computing Intern",
  dates: "June – August 2026",
  location: "Remote",
  product: "Cloud 9, an AI assistant",
  summary:
    "Built the backend for Cloud 9: a Python pipeline that routes user queries to Google Gemini, with a Pinecone knowledge base that learns from feedback.",
  points: [
    "Designed and deployed a Python backend pipeline that routes user queries to Google Gemini and serves live traffic from an AWS EC2 instance.",
    "Built a feedback-driven knowledge base in Pinecone: a Gemini response is stored as a vector embedding only when a user marks it helpful, and negative-feedback responses are discarded to keep the store clean.",
    "Implemented embedding-based similarity search so repeated or similar queries are answered from Pinecone instead of a new API call, cutting redundant external calls and lowering latency.",
  ],
  stack: ["Python", "Google Gemini", "Pinecone", "Vector embeddings", "AWS EC2", "REST APIs"],
};

export type Project = {
  slug: string;
  name: string;
  tagline: string;
  context: string;
  aim: string;
  points: string[];
  stack: string[];
  link: { label: string; url: string };
};

export const projects: Project[] = [
  {
    slug: "bharatritu",
    name: "BharatRitu",
    tagline: "Crowd-sourced weather reports, checked before anyone trusts them.",
    context: "Smart India Hackathon 2026 · Team Lead",
    aim: "Let citizens report weather events, and decide automatically which reports to trust.",
    points: [
      "Built REST endpoints (GET, POST, PATCH) with Next.js Route Handlers and TypeScript. Each citizen report is validated, geocoded, and passed through a multi-stage verification pipeline.",
      "Designed a weighted credibility-scoring engine that combines four signals: live-weather match, source trust, corroboration, and location confidence. It marks each report Verified, Under Review, or Flagged.",
      "Integrated the Open-Meteo weather API with a 5-second timeout and a fail-soft fallback, so a third-party outage never blocks a report submission.",
    ],
    stack: ["Next.js", "TypeScript", "REST APIs", "Open-Meteo API"],
    link: { label: "View source", url: "https://github.com/Pragatisource08/BharatRitu" },
  },
  {
    slug: "airquality",
    name: "AirQuality",
    tagline: "Real air-quality data on an interactive 3D globe.",
    context: "NASA Space Apps Challenge 2025 · Global Nominee",
    aim: "Make global air-quality data explorable by anyone, in real time.",
    points: [
      "Integrated real-world AQI datasets into a CesiumJS 3D globe with interactive controls for global exploration.",
      "Designed and delivered the project presentation deck.",
      "Selected as a Global Nominee out of 11,500+ participants across 167+ countries.",
    ],
    stack: ["CesiumJS", "JavaScript"],
    link: { label: "Live demo", url: "https://air-quality-chi.vercel.app/" },
  },
  {
    slug: "finances",
    name: "Track Your Finances",
    tagline: "A personal finance tracker with filters, export, and charts.",
    context: "Full-stack project",
    aim: "Record expenses and see where the money goes.",
    points: [
      "Built Flask routes and blueprints for expense submission, retrieval, and filtering across the full request-response cycle, backed by a relational SQLite schema through SQLAlchemy.",
      "Implemented CSV export and Chart.js charts for interactive, filterable spending breakdowns by category and time period.",
    ],
    stack: ["Python", "Flask", "SQLAlchemy", "SQLite", "Jinja2", "Chart.js"],
    link: {
      label: "View source",
      url: "https://github.com/Pragatisource08/Personal-Finance-Tracker-",
    },
  },
];

export type PullRequest = {
  number: number;
  title: string;
  summary: string;
  detail: string;
  url: string;
  status: "Merged";
};

export const openSource = {
  repo: "pocketpaw/pocketpaw",
  repoUrl: "https://github.com/pocketpaw/pocketpaw",
  language: "Python",
  date: "April 2026",
  prs: [
    {
      number: 906,
      title: "Reliable port fallback",
      summary:
        "Automatic port fallback across 8888–8897 with socket-level pre-checks, so the app no longer crashes at startup when a port is taken.",
      detail:
        "Catches EADDRINUSE and WinError 10048 to remove cross-platform startup crashes.",
      url: "https://github.com/pocketpaw/pocketpaw/pull/906",
      status: "Merged",
    },
    {
      number: 845,
      title: "Dark-mode dropdown fix",
      summary:
        "Fixed a select dropdown that rendered wrongly in dark mode, restoring consistent theming across the app.",
      detail: "A rendering bug in a select component.",
      url: "https://github.com/pocketpaw/pocketpaw/pull/845",
      status: "Merged",
    },
  ] satisfies PullRequest[],
};

export const recognition = [
  {
    title: "NASA Space Apps Challenge",
    detail: "Global Nominee, 2025 — out of 11,500+ participants across 167+ countries.",
  },
  { title: "Smart India Hackathon", detail: "Team Lead, 2026." },
  { title: "LeetCode", detail: "30+ problems solved, practising DSA consistently." },
];

export const skills = {
  Languages: ["Python", "C++", "TypeScript", "JavaScript"],
  "Backend & web": ["Flask", "Next.js", "REST APIs", "SQLAlchemy", "Jinja2", "HTML", "CSS", "Chart.js", "CesiumJS"],
  Databases: ["SQLite", "MySQL", "Pinecone"],
  "AI / LLM": ["Google Gemini API", "Vector embeddings", "Similarity search"],
  Tools: ["Git", "GitHub", "VS Code", "AWS EC2"],
} as const;
