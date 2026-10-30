"use client";

import { useEffect, useRef, useState } from "react";
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
import { Icon } from "@/components/icons";
import { PixelText } from "./PixelText";
import { EmailButton } from "./Contact";

const SEGMENTS = 20;

export function ProofDesk() {
  const [state, setState] = useState<CredibilityState>(() => createCredibility(createRng(2026)));
  const [started, setStarted] = useState(false);
  const result = useRef<HTMLDivElement>(null);
  const firstStamp = useRef<HTMLButtonElement>(null);
  const report = currentReport(state);
  const last = state.answers[state.answers.length - 1];
  const right = correctCount(state);

  useEffect(() => {
    if (state.done) result.current?.focus({ preventScroll: true });
  }, [state.done]);

  const begin = () => {
    setState(createCredibility(createRng(Date.now())));
    setStarted(true);
    requestAnimationFrame(() => firstStamp.current?.focus());
  };

  return (
    <div className="bm-game bm-proof">
      <div className="bm-game-head">
        <h3 className="bm-game-title">Proof the report</h3>
        <p className="bm-game-rules">
          BharatRitu weighs four signals before it trusts a citizen&rsquo;s weather report. Read the signals, then stamp each of {ROUNDS} reports
          Verified, Under Review, or Flagged.
        </p>
        <p className="bm-disclaimer">{DISCLAIMER}</p>
      </div>

      {!started ? (
        <div className="bm-end-actions">
          <button type="button" className="bm-btn bm-btn-primary" onClick={begin}>
            <Icon name="play" size={18} />
            <span>Open the first report</span>
          </button>
        </div>
      ) : state.done ? (
        <div ref={result} tabIndex={-1} className="bm-end" data-outcome={right >= 3 ? "won" : "lost"} aria-live="polite">
          <p className="bm-end-title">
            <span className="sr-only">
              {right} of {ROUNDS} stamped correctly.
            </span>
            <PixelText text={`${right}/${ROUNDS} PROOFED`} size="bm-u-grade" gap={0.25} />
          </p>
          <ol className="bm-proof-tally">
            {state.answers.map((a) => {
              const r = state.reports.find((x) => x.id === a.reportId)!;
              return (
                <li key={a.reportId} data-ok={a.guess === a.actual}>
                  <Icon name={a.guess === a.actual ? "check" : "x"} size={14} />
                  <span>
                    {r.event}, {r.place}: engine said {a.actual} <span className="num">({a.score.toFixed(2)})</span>
                    {a.guess !== a.actual ? `, you stamped ${a.guess}` : ""}
                  </span>
                </li>
              );
            })}
          </ol>
          <p className="bm-end-line">
            {right >= 4
              ? "You read signals the way the engine does. Pragati wrote the engine."
              : "Weighing four signals by eye is hard. That is why Pragati wrote the engine to do it."}
          </p>
          <div className="bm-end-actions">
            <EmailButton label="Email Pragati: verified" />
            <button type="button" className="bm-btn" onClick={begin}>
              <Icon name="replay" size={18} />
              <span>Play again</span>
            </button>
          </div>
        </div>
      ) : report ? (
        <div className="bm-proof-card">
          <div className="bm-proof-report">
            <p className="bm-proof-n num">
              Report {state.index + 1} of {ROUNDS}
            </p>
            <p className="bm-proof-event">{report.event}</p>
            <p className="bm-proof-place">
              {report.place}, {report.time}
            </p>
            <dl className="bm-signals">
              {SIGNALS.map((s) => {
                const v = report.signals[s.key];
                const on = Math.round(v * SEGMENTS);
                return (
                  <div key={s.key}>
                    <dt>
                      {s.label} <span className="num bm-weight">x{ILLUSTRATIVE_WEIGHTS[s.key].toFixed(2)}</span>
                    </dt>
                    <dd>
                      <span className="bm-meter" aria-hidden="true">
                        {Array.from({ length: SEGMENTS }, (_, i) => (
                          <span key={i} data-on={i < on} />
                        ))}
                      </span>
                      <span className="num">{v.toFixed(2)}</span>
                    </dd>
                  </div>
                );
              })}
            </dl>
          </div>
          <div className="bm-stamps" role="group" aria-label="Stamp this report">
            {VERDICTS.map((v: Verdict) => (
              <button key={v} ref={v === "Verified" ? firstStamp : undefined} type="button" className="bm-stamp" data-verdict={v} onClick={() => setState((s) => stamp(s, v))}>
                {v}
              </button>
            ))}
            <p className="bm-proof-last" aria-live="polite">
              {last
                ? `${last.guess === last.actual ? "Right" : "Not quite"}: the last one scored ${last.score.toFixed(2)}, ${last.actual}.`
                : "Verified at 0.70 and up. Under Review from 0.40. Flagged below."}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
