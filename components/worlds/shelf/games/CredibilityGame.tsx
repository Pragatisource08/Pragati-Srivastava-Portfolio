"use client";

import { useState } from "react";
import { Icon } from "@/components/icons";
import {
  DISCLAIMER,
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
import { GameEnd } from "../Actions";

const SEAL_CLASS: Record<Verdict, string> = {
  Verified: "is-verified",
  "Under Review": "is-review",
  Flagged: "is-flagged",
};

// BharatRitu's four signals as a report slip; the reader presses one of three seals.
export function CredibilityGame() {
  const [state, setState] = useState<CredibilityState | null>(null);

  const start = () => setState(createCredibility(createRng(Date.now())));

  if (!state) {
    return (
      <div className="shelf-game shelf-cred">
        <p className="shelf-game-rules">
          BharatRitu reads four signals on every citizen weather report and marks it Verified, Under Review, or Flagged.
          Read {ROUNDS} report slips and press the seal you think the engine would.
        </p>
        <p className="shelf-game-note">{DISCLAIMER}</p>
        <button type="button" className="shelf-btn shelf-btn-primary" onClick={start}>
          <Icon name="play" size={15} />
          <span>Take the first slip</span>
        </button>
      </div>
    );
  }

  const report = currentReport(state);
  const last = state.answers.at(-1);

  return (
    <div className="shelf-game shelf-cred">
      <p className="shelf-game-note">{DISCLAIMER}</p>
      <div aria-live="polite" className="shelf-cred-last">
        {last ? (
          <p>
            You pressed <strong>{last.guess}</strong>. The engine scored it{" "}
            <span className="shelf-num">{last.score.toFixed(2)}</span>: <strong>{last.actual}</strong>.
          </p>
        ) : null}
      </div>
      {report ? (
        <>
          <p className="shelf-game-status shelf-num">
            <span>
              Slip <strong>{state.index + 1}</strong> of {ROUNDS}
            </span>
            <span>
              Matched <strong>{correctCount(state)}</strong>
            </span>
          </p>
          <div className="shelf-cred-slip">
            <p className="shelf-cred-event">
              {report.event}, {report.place}, {report.time}
            </p>
            <dl className="shelf-cred-signals">
              {SIGNALS.map((s) => (
                <div key={s.key}>
                  <dt>{s.label}</dt>
                  <dd className="shelf-num">
                    <span className="shelf-cred-bar" aria-hidden="true">
                      <span style={{ width: `${Math.round(report.signals[s.key] * 100)}%` }} />
                    </span>
                    {report.signals[s.key].toFixed(2)}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="shelf-cred-seals" role="group" aria-label="Press a seal">
            {VERDICTS.map((v) => (
              <button key={v} type="button" className={`shelf-cred-seal ${SEAL_CLASS[v]}`} onClick={() => setState(stamp(state, v))}>
                {v}
              </button>
            ))}
          </div>
        </>
      ) : (
        <GameEnd
          headline={`${correctCount(state)} of ${ROUNDS} seals matched the engine.`}
          line="The real engine weighs live-weather match, source trust, corroboration, and location confidence, and never lets a slow weather API block a report."
          ask="Write and ask her how the weights were chosen."
          onReplay={start}
        />
      )}
    </div>
  );
}
