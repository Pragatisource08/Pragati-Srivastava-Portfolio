"use client";

import { useRef, useState } from "react";
import { Icon } from "@/components/icons";
import { VIVA, grade } from "@/lib/games/viva";
import { GameEnd } from "../Actions";

// The viva as a hand scroll: one question unrolls at a time. Every answer is on these shelves.
export function VivaGame() {
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const questionRef = useRef<HTMLParagraphElement>(null);

  const done = index >= VIVA.length;
  const q = done ? null : VIVA[index];

  const restart = () => {
    setStarted(true);
    setIndex(0);
    setPicked(null);
    setCorrect(0);
    requestAnimationFrame(() => questionRef.current?.focus());
  };

  const choose = (i: number) => {
    if (!q || picked !== null) return;
    setPicked(i);
    if (i === q.answer) setCorrect((c) => c + 1);
  };

  const next = () => {
    setPicked(null);
    setIndex((n) => n + 1);
    requestAnimationFrame(() => questionRef.current?.focus());
  };

  if (!started) {
    return (
      <div className="shelf-game shelf-viva">
        <p className="shelf-game-rules">
          Six questions. Every answer is written on a shelf in this cabinet: open the books and letters if you get stuck.
        </p>
        <button type="button" className="shelf-btn shelf-btn-primary" onClick={restart}>
          <Icon name="play" size={15} />
          <span>Unroll the first question</span>
        </button>
      </div>
    );
  }

  if (done) {
    const g = grade(correct);
    return (
      <div className="shelf-game shelf-viva" aria-live="polite">
        <GameEnd
          headline={`${g.label}: ${correct} of ${VIVA.length}.`}
          line={g.line}
          ask="Bring her the question the scroll did not ask."
          onReplay={restart}
        />
      </div>
    );
  }

  return (
    <div className="shelf-game shelf-viva">
      <p className="shelf-game-status shelf-num">
        <span>
          Question <strong>{index + 1}</strong> of {VIVA.length}
        </span>
        <span>
          Correct <strong>{correct}</strong>
        </span>
      </p>
      <p className="shelf-viva-q" tabIndex={-1} ref={questionRef}>
        {q!.prompt}
      </p>
      <div className="shelf-viva-options" role="group" aria-label="Answers">
        {q!.options.map((opt, i) => {
          const state = picked === null ? "" : i === q!.answer ? " is-right" : i === picked ? " is-wrong" : " is-dim";
          return (
            <button
              key={opt}
              type="button"
              className={`shelf-viva-opt${state}`}
              onClick={() => choose(i)}
              aria-disabled={picked !== null}
            >
              <span>{opt}</span>
              {picked !== null && i === q!.answer ? <Icon name="check" size={16} title="Correct answer" /> : null}
              {picked !== null && i === picked && i !== q!.answer ? <Icon name="x" size={16} title="Your answer" /> : null}
            </button>
          );
        })}
      </div>
      <div aria-live="polite">
        {picked !== null ? (
          <div className="shelf-viva-explain">
            <p>
              <strong>{picked === q!.answer ? "Right." : "Not this one."}</strong> {q!.explain}
            </p>
            <button type="button" className="shelf-btn shelf-btn-primary" onClick={next}>
              <Icon name="arrowRight" size={15} />
              <span>{index + 1 === VIVA.length ? "See the grade" : "Next question"}</span>
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
