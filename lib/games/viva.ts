// "Viva voce" — a quiz whose answers are all on the page.

export type VivaQuestion = {
  id: string;
  prompt: string;
  options: string[];
  answer: number;
  explain: string;
};

export const VIVA: VivaQuestion[] = [
  {
    id: "ports",
    prompt: "Pragati's merged PR #906 falls back across which port range?",
    options: ["3000–3009", "8080–8089", "8888–8897", "5000–5009"],
    answer: 2,
    explain: "It pre-checks each port with a socket and takes the first free one in 8888–8897.",
  },
  {
    id: "errors",
    prompt: "Which startup errors does that fallback catch?",
    options: ["404 and 500", "EADDRINUSE and WinError 10048", "ECONNRESET only", "SIGKILL"],
    answer: 1,
    explain: "EADDRINUSE on Linux and macOS, WinError 10048 on Windows: the same 'port taken' crash.",
  },
  {
    id: "pinecone",
    prompt: "In Cloud 9, when does a Gemini answer get stored in Pinecone?",
    options: ["Always", "Only when a user marks it helpful", "Only when it errors", "Never — it is cached in memory"],
    answer: 1,
    explain: "Helpful answers become vector embeddings; negative-feedback answers are discarded.",
  },
  {
    id: "signals",
    prompt: "How many signals does BharatRitu's credibility engine combine?",
    options: ["Two", "Three", "Four", "Seven"],
    answer: 2,
    explain: "Live-weather match, source trust, corroboration, and location confidence.",
  },
  {
    id: "timeout",
    prompt: "What happens in BharatRitu when the Open-Meteo API is slow?",
    options: [
      "The report submission waits until it answers",
      "A 5-second timeout, then a fail-soft fallback",
      "The report is rejected",
      "It retries forever",
    ],
    answer: 1,
    explain: "A third-party outage never blocks a citizen's report.",
  },
  {
    id: "nasa",
    prompt: "AirQuality was a NASA Space Apps Global Nominee out of how many participants?",
    options: ["1,150+", "11,500+", "115,000+", "500+"],
    answer: 1,
    explain: "11,500+ participants across 167+ countries.",
  },
];

export function grade(correct: number, total = VIVA.length): { label: string; line: string } {
  const ratio = correct / total;
  if (ratio === 1) return { label: "Distinction", line: "Full marks. You read the whole file." };
  if (ratio >= 0.66) return { label: "First division", line: "Strong. The rest is one email away." };
  if (ratio >= 0.33) return { label: "Pass", line: "Fair. Ask her the rest in person." };
  return { label: "Re-appear", line: "No problem. She can explain it better herself." };
}
