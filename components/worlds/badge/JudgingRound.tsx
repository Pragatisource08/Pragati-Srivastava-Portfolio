"use client";

import { useRef, useState } from "react";
import { Icon } from "@/components/icons";
import { links } from "@/lib/content";
import { VIVA, grade } from "@/lib/games/viva";

// A judge's scorecard on a clipboard. Six questions; every answer is somewhere on this page.
export function JudgingRound() {
  const [index, setIndex] = useState(0);
  const [picks, setPicks] = useState<number[]>([]);
  const questionRef = useRef<HTMLHeadingElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const endRef = useRef<HTMLHeadingElement>(null);

  const done = index >= VIVA.length;
  const q = done ? null : VIVA[index];
  const picked = picks[index];
  const answered = picked !== undefined;
  const correct = picks.filter((p, i) => p === VIVA[i].answer).length;
  const result = grade(correct);

  const choose = (option: number) => {
    if (answered || done) return;
    setPicks((p) => [...p, option]);
    requestAnimationFrame(() => nextRef.current?.focus({ preventScroll: true }));
  };

  const next = () => {
    setIndex((i) => i + 1);
    requestAnimationFrame(() => {
      if (index + 1 >= VIVA.length) endRef.current?.focus({ preventScroll: true });
      else questionRef.current?.focus({ preventScroll: true });
    });
  };

  const restart = () => {
    setIndex(0);
    setPicks([]);
    requestAnimationFrame(() => questionRef.current?.focus({ preventScroll: true }));
  };

  return (
    <div className="badge-judging">
      <div className="badge-clipboard">
        <span className="badge-clipboard-clip" aria-hidden="true" />
        <div className="badge-scorecard">
          <div className="badge-score-head">
            <span>Judge&rsquo;s scorecard</span>
            <span className="badge-num">
              {done ? VIVA.length : index + 1} / {VIVA.length}
            </span>
          </div>
          <ol className="badge-score-boxes" aria-label="Scores so far">
            {VIVA.map((v, i) => {
              const p = picks[i];
              const state = p === undefined ? "open" : p === v.answer ? "right" : "wrong";
              return (
                <li key={v.id} data-state={state} aria-label={`Question ${i + 1}: ${state === "open" ? "not answered" : state}`}>
                  {state === "right" ? <Icon name="check" size={14} strokeWidth={2.5} /> : null}
                  {state === "wrong" ? <Icon name="x" size={14} strokeWidth={2.5} /> : null}
                </li>
              );
            })}
          </ol>

          {q ? (
            <div className="badge-question">
              <h3 ref={questionRef} tabIndex={-1}>
                {q.prompt}
              </h3>
              <ul className="badge-options">
                {q.options.map((opt, i) => {
                  const state = !answered ? undefined : i === q.answer ? "right" : i === picked ? "wrong" : "dim";
                  return (
                    <li key={opt}>
                      <button
                        type="button"
                        onClick={() => choose(i)}
                        aria-disabled={answered}
                        data-state={state}
                        aria-describedby={answered ? `viva-explain-${q.id}` : undefined}
                      >
                        <span className="badge-option-mark" aria-hidden="true">
                          {state === "right" ? <Icon name="check" size={14} strokeWidth={2.5} /> : null}
                          {state === "wrong" ? <Icon name="x" size={14} strokeWidth={2.5} /> : null}
                        </span>
                        {opt}
                        {state === "right" ? <span className="badge-sr"> (correct answer)</span> : null}
                        {state === "wrong" ? <span className="badge-sr"> (your pick, wrong)</span> : null}
                      </button>
                    </li>
                  );
                })}
              </ul>
              <div className="badge-explain" aria-live="polite" id={`viva-explain-${q.id}`}>
                {answered ? (
                  <>
                    <p>
                      <strong>{picked === q.answer ? "Correct." : "Not quite."}</strong> {q.explain}
                    </p>
                    <button ref={nextRef} type="button" className="badge-btn-ink" onClick={next}>
                      {index + 1 >= VIVA.length ? "Hand in the scorecard" : "Next question"}
                      <Icon name="arrowRight" size={16} />
                    </button>
                  </>
                ) : null}
              </div>
            </div>
          ) : (
            <div className="badge-verdict" aria-live="polite">
              <p className="badge-stamp" aria-hidden="true">
                {result.label}
              </p>
              <h3 ref={endRef} tabIndex={-1}>
                {correct} of {VIVA.length}: {result.label}
              </h3>
              <p>{result.line}</p>
              <div className="badge-end-actions">
                <a className="badge-btn-primary" href={links.mailto}>
                  <Icon name="mail" size={18} />
                  Email Pragati your questions
                </a>
                <button type="button" className="badge-btn-ink-ghost" onClick={restart}>
                  <Icon name="replay" size={16} />
                  Play again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
