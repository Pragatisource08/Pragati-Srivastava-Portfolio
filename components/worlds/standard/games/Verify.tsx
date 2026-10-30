"use client";

import { useRef, useState } from "react";
import { Icon } from "@/components/icons";
import {
  DISCLAIMER,
  ILLUSTRATIVE_WEIGHTS,
  ROUNDS,
  SIGNALS,
  VERDICTS,
  correctCount,
  createCredibility,
  currentReport,
  stamp,
  type CredibilityState,
  type Verdict,
} from "@/lib/games/credibility";
import { createRng } from "@/lib/games/rng";
import { useDepth } from "../Depth";
import { GameEnd, focusIfInside, freshSeed } from "./shared";

export function Verify() {
  const root = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const next = useRef<HTMLButtonElement>(null);
  const { depth } = useDepth();
  const [state, setState] = useState<CredibilityState>(() => createCredibility(createRng(2026)));
  const [revealing, setRevealing] = useState(false);

  const last = state.answers[state.answers.length - 1];
  // While revealing, keep showing the report that was just judged.
  const shown = revealing ? state.reports[state.index - 1] : currentReport(state);

  function judge(v: Verdict) {
    if (revealing) return;
    setState(stamp(state, v));
    setRevealing(true);
    requestAnimationFrame(() => focusIfInside(root.current, next.current));
  }

  function proceed() {
    setRevealing(false);
    if (!state.done) requestAnimationFrame(() => focusIfInside(root.current, heading.current));
  }

  function restart() {
    setState(createCredibility(createRng(freshSeed())));
    setRevealing(false);
    requestAnimationFrame(() => focusIfInside(root.current, heading.current));
  }

  if (state.done && !revealing) {
    const n = correctCount(state);
    return (
      <div ref={root}>
        <GameEnd
          title={`${n} of ${ROUNDS} matched the engine.`}
          onReplay={restart}
          containerRef={root}
        >
          <p>
            BharatRitu makes this call for every citizen report: it weighs live-weather match, source trust,
            corroboration, and location confidence, then marks the report Verified, Under Review, or Flagged. Pragati led
            the team and built the scoring engine at the Smart India Hackathon 2026.
          </p>
          <p className="std-meta mt-3">{DISCLAIMER}</p>
        </GameEnd>
      </div>
    );
  }

  if (!shown) return null;

  return (
    <div ref={root}>
      <div className="flex items-center justify-between gap-4">
        <p className="std-meta std-num">
          Report {Math.min(state.index + (revealing ? 0 : 1), ROUNDS)} of {ROUNDS}
        </p>
        <p className="std-meta std-num">{correctCount(state)} matched</p>
      </div>
      <div className="std-steps mt-2" aria-hidden="true">
        {state.reports.map((r, i) => (
          <span
            key={r.id}
            data-state={i < state.index - (revealing ? 1 : 0) ? "done" : i === state.index - (revealing ? 1 : 0) ? "now" : undefined}
          />
        ))}
      </div>

      <div key={shown.id} className="std-panel-body mt-5 grid gap-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] sm:gap-8">
        <div>
          <h4 ref={heading} tabIndex={-1} className="std-end-title std-display text-[1.375rem] leading-tight">
            {shown.event}
          </h4>
          <p className="std-meta mt-1">
            {shown.place} · {shown.time}
          </p>
          <p className="mt-4 text-[0.9375rem]">How should the engine mark this report?</p>
        </div>
        <dl className="grid gap-3">
          {SIGNALS.map((s) => {
            const v = shown.signals[s.key];
            return (
              <div key={s.key}>
                <div className="flex items-baseline justify-between gap-3 text-[0.875rem]">
                  <dt className="text-[color:var(--ink-2)]">
                    {s.label}
                    <span className="std-only-engineer std-meta std-mono"> × {ILLUSTRATIVE_WEIGHTS[s.key].toFixed(2)}</span>
                  </dt>
                  <dd className="std-mono text-[color:var(--ink)]">{v.toFixed(2)}</dd>
                </div>
                <div className="std-meter mt-1.5" aria-hidden="true">
                  <span style={{ transform: `scaleX(${v})` }} />
                </div>
              </div>
            );
          })}
        </dl>
      </div>

      <p className="sr-only" aria-live="polite">
        {revealing && last
          ? `${last.guess === last.actual ? "Match." : "Different call."} The engine scored it ${last.score.toFixed(2)} and marked it ${last.actual}.`
          : ""}
      </p>
      <div className="mt-6">
        {revealing && last ? (
          <div className="flex flex-wrap items-end justify-between gap-4">
            <p className="max-w-[50ch] text-[0.9375rem]">
              <span className="std-strong">
                {last.guess === last.actual ? "Match." : "Different call."}
              </span>{" "}
              The engine scored it <span className="std-mono text-[color:var(--ink)]">{last.score.toFixed(2)}</span> and
              marked it <span className="std-strong">{last.actual}</span>
              {last.guess === last.actual ? "." : `; you said ${last.guess}.`}
            </p>
            <button ref={next} type="button" onClick={proceed} className="std-btn std-btn-quiet std-btn-sm">
              {state.done ? "See result" : "Next report"}
              <Icon name="arrowRight" size={15} />
            </button>
          </div>
        ) : (
          <div className="grid gap-2 sm:grid-cols-3" role="group" aria-label="Verdict">
            {VERDICTS.map((v) => (
              <button key={v} type="button" onClick={() => judge(v)} className="std-option justify-center font-medium">
                {v}
              </button>
            ))}
          </div>
        )}
      </div>

      <p className="std-meta mt-4">
        {DISCLAIMER}
        {depth === "engineer" ? " Illustrative thresholds: Verified at 0.70 and above, Under Review at 0.40 and above." : ""}
      </p>
    </div>
  );
}
