"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Icon } from "@/components/icons";
import {
  DISCLAIMER,
  ROUNDS,
  SIGNALS,
  VERDICTS,
  correctCount,
  createCredibility,
  currentReport,
  score,
  stamp,
  verdictFor,
  type CredibilityState,
  type Verdict,
} from "@/lib/games/credibility";
import { createRng } from "@/lib/games/rng";
import { Cross, Tick } from "../Ink";
import { EndCard, PracticalFrame } from "./Frame";
import { s } from "../styles";

const KEYS: Record<string, Verdict> = { v: "Verified", u: "Under Review", f: "Flagged" };

export function CredibilityPractical() {
  const [game, setGame] = useState<CredibilityState | null>(null);
  const [revealed, setRevealed] = useState(false);

  const report = game ? currentReport(game) : null;
  const last = game?.answers.at(-1);

  function start() {
    setGame(createCredibility(createRng(Date.now())));
    setRevealed(false);
  }

  function choose(v: Verdict) {
    if (!game || revealed || !report) return;
    setGame(stamp(game, v));
    setRevealed(true);
  }

  function next() {
    setRevealed(false);
  }

  useEffect(() => {
    if (!game || game.done) return;
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (!el.closest?.("#credibility-game") || e.metaKey || e.ctrlKey || e.altKey) return;
      const v = KEYS[e.key.toLowerCase()];
      if (v && !revealed) {
        e.preventDefault();
        choose(v);
      } else if (e.key === "Enter" && revealed) {
        e.preventDefault();
        next();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const shown = revealed && last ? game!.reports[game!.index - 1] : report;

  return (
    <PracticalFrame id="cred-title" title="Perform it: verify the reports" note={DISCLAIMER}>
      <div id="credibility-game">
        {!game ? (
          <div className="space-y-3">
            <p className="max-w-[62ch] text-[0.98rem] leading-relaxed">
              Five citizen reports arrive. Read the four signals and stamp each one Verified, Under Review, or Flagged. Then see
              what the engine decided.
            </p>
            <button type="button" onClick={start} className={`${s.btn} ${s.btnInk}`}>
              <Icon name="play" size={15} />
              Start verifying
            </button>
          </div>
        ) : game.done && !revealed ? (
          <EndCard
            remark={`You agreed with the engine on ${correctCount(game)} of ${ROUNDS}.`}
            detail="Pragati designed the real engine: four weighted signals, three outcomes, and a weather API that can never block a submission."
            cta="Email Pragati about BharatRitu"
            onReplay={start}
          />
        ) : shown ? (
          <div className="grid gap-5 md:grid-cols-[1fr_15rem]">
            <div>
              <p className={s.label}>
                Report {Math.min(game.index + (revealed ? 0 : 1), ROUNDS)} of {ROUNDS}
              </p>
              <p className={`${s.hand} mt-1 text-[1.45rem] leading-tight`}>
                {shown.event} — {shown.place}, {shown.time}
              </p>
              <dl className="mt-4 space-y-2.5">
                {SIGNALS.map((sig) => {
                  const v = shown.signals[sig.key];
                  return (
                    <div key={sig.key} className="grid grid-cols-[9.5rem_1fr_2.6rem] items-center gap-3 text-[0.92rem]">
                      <dt>{sig.label}</dt>
                      <dd className="h-3 border-[1.25px] border-[var(--line)] bg-white">
                        <motion.span
                          className="block h-full bg-[var(--ink)]"
                          initial={{ width: 0 }}
                          animate={{ width: `${v * 100}%` }}
                          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        />
                      </dd>
                      <dd className="text-right tabular-nums">{v.toFixed(2)}</dd>
                    </div>
                  );
                })}
              </dl>
            </div>

            <div className="flex flex-col gap-2" aria-live="polite">
              {!revealed ? (
                <>
                  <p className={s.label}>Your stamp (V / U / F)</p>
                  {VERDICTS.map((v) => (
                    <button key={v} type="button" onClick={() => choose(v)} className={`${s.btn} justify-between`}>
                      {v}
                      <kbd className="text-[0.75rem] text-[var(--print-soft)]">{v[0]}</kbd>
                    </button>
                  ))}
                </>
              ) : last ? (
                <div className="space-y-2">
                  <p className="flex items-center gap-2 font-semibold">
                    {last.guess === last.actual ? <Tick show size={26} /> : <Cross show size={22} />}
                    You stamped {last.guess}
                  </p>
                  <p className={`${s.stamp} text-[0.95rem]`}>Engine: {verdictFor(shown.signals)}</p>
                  <p className="text-[0.9rem] tabular-nums">Weighted score {score(shown.signals).toFixed(2)}</p>
                  <button type="button" onClick={next} className={`${s.btn} ${s.btnInk} mt-1`} autoFocus>
                    {game.done ? "See remarks" : "Next report"}
                    <Icon name="arrowRight" size={16} />
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </PracticalFrame>
  );
}
