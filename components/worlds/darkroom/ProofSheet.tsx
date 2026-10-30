"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icons";
import { links } from "@/lib/content";
import { grade, VIVA } from "@/lib/games/viva";
import s from "./cls";

/** The viva, as a proof sheet: six frames, circle the right one in grease pencil. */
export function ProofSheet() {
  const [started, setStarted] = useState(false);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [marks, setMarks] = useState<boolean[]>([]);

  const framesRef = useRef<HTMLDivElement>(null);
  const [moved, setMoved] = useState(0);

  // After "Next strip" or "Play again", put focus on the new strip's first frame.
  useEffect(() => {
    if (moved > 0) framesRef.current?.querySelector("button")?.focus();
  }, [moved]);

  const finished = i >= VIVA.length;
  const q = VIVA[Math.min(i, VIVA.length - 1)];
  const correct = marks.filter(Boolean).length;

  const choose = (k: number) => {
    if (picked !== null) return;
    setPicked(k);
    setMarks((m) => [...m, k === q.answer]);
  };

  const next = () => {
    setPicked(null);
    setI((v) => v + 1);
    setMoved((m) => m + 1);
  };

  const reset = () => {
    setStarted(true);
    setI(0);
    setPicked(null);
    setMarks([]);
    setMoved((m) => m + 1);
  };

  const g = grade(correct);

  return (
    <div className={s.game} aria-labelledby="proof-title">
      <div className={s.gameHead}>
        <h3 id="proof-title" className={s.gameTitle}>
          Proof sheet
        </h3>
        <p className={s.gameLede}>
          Six questions, every answer somewhere on this page. Circle one frame per strip.
        </p>
      </div>

      <ol className={s.proofMarks} aria-label="Your marks so far">
        {VIVA.map((v, k) => (
          <li key={v.id} data-mark={marks[k] === undefined ? undefined : marks[k] ? "ok" : "miss"}>
            <span className="sr-only">
              Question {k + 1}: {marks[k] === undefined ? "not answered" : marks[k] ? "right" : "wrong"}
            </span>
            {marks[k] !== undefined && <Icon name={marks[k] ? "check" : "x"} size={14} strokeWidth={2.5} />}
          </li>
        ))}
      </ol>

      {!started && (
        <button type="button" className={s.btnInk} onClick={reset}>
          <Icon name="play" size={16} />
          Start the proof sheet
        </button>
      )}

      {started && !finished && (
        <fieldset className={s.proofQ}>
          <legend className={s.proofPrompt}>
            <span className={s.num}>{i + 1}/6</span> {q.prompt}
          </legend>
          <div className={s.frames} ref={framesRef}>
            {q.options.map((o, k) => (
              <button
                key={o}
                type="button"
                className={s.frame}
                onClick={() => choose(k)}
                aria-pressed={picked === k}
                data-state={picked === null ? undefined : k === q.answer ? "answer" : picked === k ? "wrong" : "dim"}
                disabled={picked !== null && picked !== k && k !== q.answer}
              >
                {o}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      <div aria-live="polite" className={s.stack}>
        {started && !finished && picked !== null && (
          <>
            <p>
              <b>{picked === q.answer ? "Right frame." : "Not that one."}</b> {q.explain}
            </p>
            <button type="button" className={s.btnEnamel} onClick={next}>
              {i + 1 < VIVA.length ? "Next strip" : "See the sheet"}
              <Icon name="arrowRight" size={16} />
            </button>
          </>
        )}
        {finished && (
          <>
            <p className={s.verdict}>
              {g.label}: {correct}/6
            </p>
            <p>{g.line}</p>
            <div className={s.actions}>
              <a href={links.mailto} className={s.btnInk}>
                <Icon name="mail" size={18} />
                Email Pragati
              </a>
              <button type="button" className={s.btnEnamel} onClick={reset}>
                <Icon name="replay" size={16} />
                Play again
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
