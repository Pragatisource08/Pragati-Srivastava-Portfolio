// "Cache hit" — a toy version of Cloud 9's Pinecone cache. Real systems compare
// vector embeddings; this demo compares word overlap so it runs in the browser.

export const CACHE_DISCLAIMER = "Toy demo: word-overlap similarity stands in for real embeddings. Sample answers.";
export const THRESHOLD = 0.5;

export type CacheEntry = { query: string; answer: string };

export const SEED_CACHE: CacheEntry[] = [
  { query: "how do I reset my password", answer: "Open Settings, then Account, then Reset password." },
  { query: "what are your support hours", answer: "Support runs 9 am to 6 pm IST, Monday to Saturday." },
  { query: "how can I export my data as csv", answer: "Go to Reports and choose Export as CSV." },
  { query: "can I change my registered email address", answer: "Yes. Settings, Account, Email, then verify the new address." },
];

const STOP = new Set(["a", "an", "the", "i", "my", "me", "to", "is", "are", "do", "can", "how", "what", "of", "as", "your", "you", "in", "on", "for", "it"]);

function tokens(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t && !STOP.has(t))
    .map((t) => t.replace(/(ing|ed|es|s)$/, ""));
}

export function similarity(a: string, b: string): number {
  const ta = tokens(a);
  const tb = tokens(b);
  if (!ta.length || !tb.length) return 0;
  const fa = new Map<string, number>();
  const fb = new Map<string, number>();
  ta.forEach((t) => fa.set(t, (fa.get(t) ?? 0) + 1));
  tb.forEach((t) => fb.set(t, (fb.get(t) ?? 0) + 1));
  let dot = 0;
  fa.forEach((v, k) => (dot += v * (fb.get(k) ?? 0)));
  const norm = (m: Map<string, number>) => Math.sqrt([...m.values()].reduce((s, v) => s + v * v, 0));
  return dot / (norm(fa) * norm(fb));
}

export type Lookup =
  | { kind: "hit"; entry: CacheEntry; score: number }
  | { kind: "miss"; best: CacheEntry | null; score: number };

export function lookup(cache: CacheEntry[], query: string): Lookup {
  let best: CacheEntry | null = null;
  let bestScore = 0;
  for (const entry of cache) {
    const s = similarity(query, entry.query);
    if (s > bestScore) {
      best = entry;
      bestScore = s;
    }
  }
  return bestScore >= THRESHOLD && best
    ? { kind: "hit", entry: best, score: bestScore }
    : { kind: "miss", best, score: bestScore };
}
