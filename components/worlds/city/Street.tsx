"use client";

import { useEffect, useRef, useState } from "react";
import { recognition, skills } from "@/lib/content";
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
import { EndCall, HOURS, useCity } from "./shared";
import { s } from "./cls";

const BLADE: Record<string, string> = {
  "NASA Space Apps Challenge": "NASA",
  "Smart India Hackathon": "SIH",
  LeetCode: "LeetCode",
};

export function Street() {
  return (
    <section id="street" className={s.section} aria-labelledby="street-h">
      <div className={s.wrap}>
        <h2 id="street-h" className={s.h2}>
          Reports from the street
        </h2>
        <p className={s.lede}>
          BharatRitu lets citizens report the weather where they stand, then decides which reports to trust. Check
          tonight’s reports the way her engine does.
        </p>
        <WeatherReports />

        <div className={s.streetGrid}>
          <div>
            <h3 className={s.h3}>Signs over the street</h3>
            <ul className={s.blades}>
              {recognition.map((r) => (
                <li key={r.title} className={s.blade}>
                  <span className={s.bladeSign} aria-hidden="true">
                    {BLADE[r.title] ?? r.title}
                  </span>
                  <div>
                    <p className={s.bladeTitle}>{r.title}</p>
                    <p>{r.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className={s.h3}>Lobby directory</h3>
            <dl className={s.directory}>
              {Object.entries(skills).map(([group, items]) => (
                <div key={group} className={s.dirRow}>
                  <dt>{group}</dt>
                  <dd>
                    <ul>
                      {items.map((it) => (
                        <li key={it}>{it}</li>
                      ))}
                    </ul>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}

function WeatherReports() {
  const { hour } = useCity();
  const hourLabel = HOURS.find((h) => h.id === hour)?.label ?? "Night";
  const [game, setGame] = useState<CredibilityState | null>(null);
  const endRef = useRef<HTMLHeadingElement>(null);
  const report = game ? currentReport(game) : null;
  const last = game?.answers[game.answers.length - 1];

  useEffect(() => {
    if (game?.done) endRef.current?.focus();
  }, [game?.done]);

  const start = () => setGame(createCredibility(createRng(Date.now())));
  const choose = (v: Verdict) => setGame((g) => (g ? stamp(g, v) : g));

  return (
    <div className={s.kiosk} data-hour={hour}>
      <div className={s.kioskGlass} aria-hidden="true" />
      <div className={s.kioskHead}>
        <h3 className={s.h4}>Verify the report</h3>
        <p className={s.kioskWeather}>
          Street weather now: <strong>{hourLabel}</strong>. Change it from the hour control at the top; BharatRitu
          checks every report against live weather from Open-Meteo.
        </p>
      </div>

      {!game && (
        <div className={s.kioskIdle}>
          <p>
            {ROUNDS} citizen reports. Read the four signals, then stamp each one Verified, Under Review, or Flagged.
          </p>
          <button type="button" className={s.btnAmber} onClick={start}>
            <Icon name="play" size={16} />
            Read tonight’s reports
          </button>
        </div>
      )}

      {game && report && (
        <div className={s.report}>
          <p className={s.reportCount}>
            Report <span className={s.num}>{game.index + 1}</span> of <span className={s.num}>{game.reports.length}</span>
          </p>
          <p className={s.reportEvent}>{report.event}</p>
          <p className={s.reportWhere}>
            {report.place} · <span className={s.num}>{report.time}</span>
          </p>
          <ul className={s.signals}>
            {SIGNALS.map((sig) => (
              <li key={sig.key}>
                <span className={s.sigLabel}>
                  {sig.label}
                  <span className={s.allStops}> · weight {ILLUSTRATIVE_WEIGHTS[sig.key].toFixed(2)}</span>
                </span>
                <span className={s.meter} aria-hidden="true">
                  <span style={{ transform: `scaleX(${report.signals[sig.key]})` }} />
                </span>
                <span className={s.num}>{report.signals[sig.key].toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className={s.stamps} role="group" aria-label="Your verdict">
            {VERDICTS.map((v) => (
              <button key={v} type="button" className={s.stamp} data-verdict={v} onClick={() => choose(v)}>
                {v}
              </button>
            ))}
          </div>
        </div>
      )}

      <p aria-live="polite" className={s.reportFeedback}>
        {last
          ? `${last.guess === last.actual ? "Matched." : "Not quite."} You stamped ${last.guess}; the engine says ${last.actual} at ${last.score.toFixed(2)}.`
          : ""}
      </p>

      {game?.done && (
        <div className={s.gameEnd}>
          <h4 ref={endRef} tabIndex={-1} className={s.endHead}>
            You matched the engine on {correctCount(game)} of {game.reports.length} reports.
          </h4>
          <EndCall
            line={
              correctCount(game) >= 4
                ? "You read the signals like the engine does. She built the real one: four weighted signals, three verdicts."
                : "The engine weighs live-weather match highest. She can walk you through the scoring herself."
            }
            onAgain={start}
          />
        </div>
      )}
      <p className={s.disclaimer}>{DISCLAIMER}</p>
    </div>
  );
}
