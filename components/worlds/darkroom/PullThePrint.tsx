"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icons";
import { links, profile } from "@/lib/content";
import { createRng, pick } from "@/lib/games/rng";
import { buildLut, formatClock, judge, STANDARD_DEV, STEPS, type Negative, type Verdict } from "./model";
import { CurvePlot } from "./CurvePlot";
import { PrintCanvas } from "./PrintCanvas";
import { useActive, useNegative, useReducedMotionPref } from "./hooks";
import s from "./cls";

const SPEED = 10; // developer seconds per real second
const LIMIT = 240; // the sheet is ruined by then; the game pulls it for you
const OFFSETS = [-0.3, -0.15, 0, 0.15, 0.3] as const; // how dense this round's negative is

type Phase = "idle" | "strip" | "developing" | "done";

/** Five half-stop bands across one sheet, each developed for the standard time. */
function TestStrip({ neg, negOffset, t }: { neg: Negative | null; negOffset: number; t: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c || !neg) return;
    const n = neg.size;
    c.width = n;
    c.height = Math.round(n * 0.5);
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const out = ctx.createImageData(n, c.height);
    const top = Math.round(n * 0.2); // a band across the face
    const luts = STEPS.map((sec) => buildLut(sec, negOffset, t));
    const band = n / STEPS.length;
    for (let y = 0; y < c.height; y++) {
      for (let x = 0; x < n; x++) {
        const lut = luts[Math.min(STEPS.length - 1, Math.floor(x / band))];
        const j = neg.lum[(y + top) * n + x] * 3;
        const o = (y * n + x) * 4;
        out.data[o] = lut[j];
        out.data[o + 1] = lut[j + 1];
        out.data[o + 2] = lut[j + 2];
        out.data[o + 3] = 255;
      }
    }
    ctx.putImageData(out, 0, 0);
  }, [neg, negOffset, t]);
  return (
    <canvas
      ref={ref}
      width={2}
      height={1}
      className={s.strip}
      role="img"
      aria-label="Test strip: the same band of the portrait at 4, 5.6, 8, 11 and 16 seconds of exposure, left to right, each developed for 1:30."
    />
  );
}

export function PullThePrint() {
  const neg = useNegative(profile.photo, 400);
  const root = useRef<HTMLDivElement>(null);
  const pullBtn = useRef<HTMLButtonElement>(null);
  const active = useActive(root);
  const reduced = useReducedMotionPref();

  const [phase, setPhase] = useState<Phase>("idle");
  const [negOffset, setNegOffset] = useState(0);
  const [step, setStep] = useState(2);
  const [stripT, setStripT] = useState(0);
  const [t, setT] = useState(0);
  const [verdict, setVerdict] = useState<Verdict | null>(null);

  // Test strip previews emerge in real time (instantly under reduced motion).
  const stripRunning = phase === "strip" && active && !reduced && stripT < STANDARD_DEV;
  useEffect(() => {
    if (!stripRunning) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      setStripT((v) => Math.min(STANDARD_DEV, v + dt * 60));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [stripRunning]);

  // The developer clock. It stops while the game is off screen or the tab is hidden.
  const devRunning = phase === "developing" && active;
  useEffect(() => {
    if (!devRunning) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      setT((v) => Math.min(LIMIT, v + dt * SPEED));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [devRunning]);

  const pull = (at: number) => {
    if (!neg) return;
    setVerdict(judge(neg, STEPS[step], negOffset, at));
    setPhase("done");
  };

  // Left in the tray to the limit: the sheet fogs and the game pulls it.
  if (phase === "developing" && t >= LIMIT && neg) {
    setVerdict(judge(neg, STEPS[step], negOffset, LIMIT));
    setPhase("done");
  }

  useEffect(() => {
    if (phase === "developing") pullBtn.current?.focus({ preventScroll: true });
  }, [phase]);

  const start = () => {
    const rng = createRng(Date.now());
    setNegOffset(pick(rng, OFFSETS));
    setStep(2);
    setStripT(0);
    setT(0);
    setVerdict(null);
    setPhase("strip");
  };

  const expose = () => {
    setT(0);
    setPhase("developing");
  };

  const stripShown = reduced ? STANDARD_DEV : stripT;
  const printT = phase === "idle" || phase === "strip" ? 0 : t;

  return (
    <div ref={root} className={s.game} aria-labelledby="pull-title">
      <div className={s.gameHead}>
        <h3 id="pull-title" className={s.gameTitle}>
          Pull the print
        </h3>
        <p className={s.gameLede}>
          Choose an exposure from the test strip, then pull her portrait out of the developer at the
          right second. The paper follows a real characteristic curve: pull early and the blacks stay
          gray; leave it and fog creeps into the whites. Exposing the sheet is final.
        </p>
      </div>

      <div className={s.bench}>
        <div className={s.benchTray}>
          <div className={s.trayMini} data-agitate={devRunning && !reduced ? "true" : undefined}>
            <div className={s.sheet}>
              <PrintCanvas
                neg={neg}
                seconds={STEPS[step]}
                negOffset={negOffset}
                t={printT}
                className={s.gamePrint}
                label={
                  phase === "done"
                    ? "Your pulled print of the portrait"
                    : phase === "developing"
                      ? "The print developing in the tray"
                      : "A blank sheet of paper in the tray"
                }
              />
            </div>
          </div>
          <div className={s.timer}>
            <span className={s.timerFace} aria-hidden="true">
              {formatClock(printT)}
            </span>
            <span className={s.timerNote}>{phase === "developing" ? "in the developer" : phase === "done" ? "pulled" : "timer"}</span>
          </div>
        </div>

        <div className={s.benchControls}>
          {phase === "idle" && (
            <div className={s.stack}>
              <p className={s.pencil}>One sheet. One negative. One chance.</p>
              <button type="button" className={s.btnInk} onClick={start} disabled={!neg}>
                <Icon name="play" size={16} />
                Load a sheet
              </button>
            </div>
          )}

          {phase === "strip" && (
            <div className={s.stack}>
              <div className={s.stripWrap}>
                <TestStrip neg={neg} negOffset={negOffset} t={stripShown} />
                <div className={s.stripMarks} aria-hidden="true">
                  {STEPS.map((sec) => (
                    <span key={sec}>{sec}</span>
                  ))}
                </div>
              </div>
              <fieldset className={s.steps}>
                <legend className={s.stepsLegend}>Exposure under the enlarger</legend>
                {STEPS.map((sec, i) => (
                  <label key={sec} className={s.stepOpt}>
                    <input
                      type="radio"
                      name="exposure"
                      value={sec}
                      checked={step === i}
                      onChange={() => setStep(i)}
                    />
                    <span>{sec} s</span>
                  </label>
                ))}
              </fieldset>
              <p className={s.small}>
                Pick the band with deep blacks in the hair and a face that still holds detail. The
                negative changes every round.
              </p>
              <button type="button" className={s.btnInk} onClick={expose}>
                Expose at {STEPS[step]} s and develop
              </button>
            </div>
          )}

          {phase === "developing" && neg && (
            <div className={s.stack}>
              <CurvePlot
                t={t}
                seconds={STEPS[step]}
                negOffset={negOffset}
                shadowL={neg.shadowL}
                highlightL={neg.highlightL}
              />
              <button ref={pullBtn} type="button" className={s.btnPull} onClick={() => pull(t)}>
                Pull the print
              </button>
              <p className={s.small}>Space or Enter pulls it. The bottle says 1:30 to 2:00.</p>
            </div>
          )}

          <div aria-live="polite" className={s.stack}>
            {phase === "done" && verdict && (
              <>
                <p className={s.verdict}>{verdict.headline}</p>
                <p>{verdict.reason}</p>
                <dl className={s.readout}>
                  <div>
                    <dt>Pulled at</dt>
                    <dd>{formatClock(Math.min(t, LIMIT))}</dd>
                  </div>
                  <div>
                    <dt>Exposure</dt>
                    <dd>{STEPS[step]} s</dd>
                  </div>
                  <div>
                    <dt>Blacks</dt>
                    <dd>D {verdict.shadowD.toFixed(2)}</dd>
                  </div>
                  <div>
                    <dt>Whites</dt>
                    <dd>D {verdict.highlightD.toFixed(2)}</dd>
                  </div>
                </dl>
                <p className={s.pencil}>
                  {verdict.keeper
                    ? "Timing like that is the whole job. Pragati would like to hear from you."
                    : "That sheet is gone. The person who gets it right is one email away."}
                </p>
                <div className={s.actions}>
                  <a href={links.mailto} className={s.btnInk}>
                    <Icon name="mail" size={18} />
                    Email Pragati
                  </a>
                  <button type="button" className={s.btnEnamel} onClick={start}>
                    <Icon name="replay" size={16} />
                    Play again
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
