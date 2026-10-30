"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { profile } from "@/lib/content";
import { formatClock } from "./model";
import { PrintCanvas } from "./PrintCanvas";
import { useActive, useNegative, useReducedMotionPref } from "./hooks";
import s from "./cls";

const PULL_AT = 100; // seconds in the developer for the hero print
const SPEED = 12; // developer seconds per real second

/** The signature: her portrait gathering out of blank paper while the timer runs. */
export function Tray() {
  const neg = useNegative(profile.photo, 400);
  const root = useRef<HTMLDivElement>(null);
  const active = useActive(root);
  const reduced = useReducedMotionPref();
  const [t, setT] = useState(0);

  const running = reduced === false && active && neg !== null && t < PULL_AT;

  useEffect(() => {
    if (!running) return;
    let raf = 0;
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      setT((v) => Math.min(PULL_AT, v + dt * SPEED));
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [running]);

  const shown = reduced ? PULL_AT : t;
  const done = shown >= PULL_AT;

  return (
    <div ref={root} className={s.trayWrap}>
      <div className={s.tray} data-agitate={running ? "true" : undefined}>
        <span className={s.trayTag} aria-hidden="true">
          DEV
        </span>
        <div className={s.sheet}>
          <PrintCanvas
            neg={neg}
            seconds={8}
            negOffset={0}
            t={shown}
            className={s.heroPrint}
            label={`Portrait of ${profile.name}${done ? "" : ", developing in the tray"}`}
          />
          <noscript>
            <Image src={profile.photo} alt={`Portrait of ${profile.name}`} width={200} height={200} className={s.heroPrint} />
          </noscript>
        </div>
      </div>
      <div className={s.timer} aria-hidden="true">
        <span className={s.timerFace}>{formatClock(shown)}</span>
        <span className={s.timerNote}>{done ? "pulled at 1:40, into the stop" : "dev 1:30 – 2:00 · 20°C"}</span>
      </div>
    </div>
  );
}
