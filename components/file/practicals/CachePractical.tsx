"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Icon } from "@/components/icons";
import { links } from "@/lib/content";
import { CACHE_DISCLAIMER, SEED_CACHE, THRESHOLD, lookup, type CacheEntry, type Lookup } from "@/lib/games/similarity";
import { PracticalFrame } from "./Frame";
import { s } from "../styles";

const SUGGESTIONS = ["I forgot my password, how to reset it", "when is support open", "export data to csv"];
const SIMULATED = "(Simulated) Gemini writes a fresh answer here. That costs one API call.";
const STORED = "(Simulated) The Gemini answer you marked helpful, now served from Pinecone for free.";

type Turn = { query: string; result: Lookup; stored: boolean };

export function CachePractical() {
  const [cache, setCache] = useState<CacheEntry[]>(SEED_CACHE);
  const [query, setQuery] = useState("");
  const [turn, setTurn] = useState<Turn | null>(null);
  const [calls, setCalls] = useState(0);
  const [hits, setHits] = useState(0);

  function ask(q: string) {
    const text = q.trim();
    if (!text) return;
    const result = lookup(cache, text);
    if (result.kind === "hit") setHits((h) => h + 1);
    else setCalls((c) => c + 1);
    setTurn({ query: text, result, stored: false });
    setQuery("");
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    ask(query);
  }

  function markHelpful() {
    if (!turn || turn.result.kind !== "miss" || turn.stored) return;
    setCache((c) => [...c, { query: turn.query, answer: STORED }]);
    setTurn({ ...turn, stored: true });
  }

  return (
    <PracticalFrame id="cache-title" title="Perform it: ask Cloud 9" note={CACHE_DISCLAIMER}>
      <form onSubmit={onSubmit} className="flex flex-wrap gap-2">
        <label htmlFor="cache-q" className="sr-only">
          Your question
        </label>
        <input
          id="cache-q"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask a support question…"
          autoComplete="off"
          className="min-w-0 flex-1 rounded-[3px] border-[1.5px] border-[var(--line)] bg-white px-3 py-2 text-[1rem] placeholder:text-[#6d6a62]"
        />
        <button type="submit" className={`${s.btn} ${s.btnInk}`} disabled={!query.trim()}>
          Ask
          <Icon name="arrowRight" size={16} />
        </button>
      </form>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-[0.9rem]">
        <span className="text-[var(--print-soft)]">Try:</span>
        {SUGGESTIONS.map((q) => (
          <button key={q} type="button" onClick={() => ask(q)} className={`${s.chip} hover:border-[var(--ink)] hover:text-[var(--ink)]`}>
            {q}
          </button>
        ))}
      </div>

      <div className="mt-5 min-h-[7.5rem]" aria-live="polite">
        <AnimatePresence mode="wait">
          {turn ? (
            <motion.div
              key={turn.query + turn.stored}
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-2"
            >
              <p className="text-[0.95rem]">
                <span className={s.label}>Query</span> <span className={s.hand}>“{turn.query}”</span>
              </p>
              {turn.result.kind === "hit" ? (
                <>
                  <p className={`${s.stamp} text-[0.85rem]`}>Served from Pinecone · no Gemini call</p>
                  <p className="text-[0.95rem]">
                    Matched <span className={s.hand}>“{turn.result.entry.query}”</span> at similarity{" "}
                    <strong className="tabular-nums">{turn.result.score.toFixed(2)}</strong> (threshold {THRESHOLD}).
                  </p>
                  <p className="text-[0.95rem]">{turn.result.entry.answer}</p>
                </>
              ) : (
                <>
                  <p className={`${s.stamp} text-[0.85rem]`}>
                    Cache miss · routed to Gemini
                  </p>
                  <p className="text-[0.95rem]">
                    Best match was {turn.result.score.toFixed(2)}, under the {THRESHOLD} threshold. {SIMULATED}
                  </p>
                  <button type="button" onClick={markHelpful} disabled={turn.stored} className={s.btn}>
                    <Icon name="check" size={16} />
                    {turn.stored ? "Stored in Pinecone. Ask something similar." : "Mark helpful: store it in Pinecone"}
                  </button>
                </>
              )}
            </motion.div>
          ) : (
            <p className="text-[0.95rem] text-[var(--print-soft)]">
              Ask anything. Similar questions are answered from the cache; new ones cost a Gemini call, and only answers marked
              helpful are stored.
            </p>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-dashed border-[var(--line)] pt-3">
        <p className="text-[0.95rem] tabular-nums">
          Gemini calls: <strong>{calls}</strong>
          <span className="mx-2 text-[var(--rule)]">/</span>
          Served from cache: <strong>{hits}</strong>
        </p>
        <a href={links.mailto} className={`${s.inkLink} inline-flex items-center gap-1.5 text-[0.95rem]`}>
          <Icon name="mail" size={16} />
          Ask Pragati how the real pipeline works
        </a>
      </div>
    </PracticalFrame>
  );
}
