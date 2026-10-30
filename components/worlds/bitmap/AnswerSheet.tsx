"use client";

import { useEffect, useRef, useState } from "react";
import { VIVA, grade } from "@/lib/games/viva";
import { Icon } from "@/components/icons";
import { PixelText } from "./PixelText";
import { EmailButton } from "./Contact";

const LETTERS = ["A", "B", "C", "D"];

export function AnswerSheet() {
  const [answers, setAnswers] = useState<(number | null)[]>(() => VIVA.map(() => null));
  const [handedIn, setHandedIn] = useState(false);
  const [sheet, setSheet] = useState(1);
  const result = useRef<HTMLDivElement>(null);
  const top = useRef<HTMLFormElement>(null);

  const answered = answers.filter((a) => a !== null).length;
  const correct = answers.filter((a, i) => a === VIVA[i].answer).length;
  const g = grade(correct);

  useEffect(() => {
    if (handedIn) result.current?.focus({ preventScroll: false });
  }, [handedIn]);

  const reset = () => {
    setAnswers(VIVA.map(() => null));
    setHandedIn(false);
    setSheet((s) => s + 1);
    requestAnimationFrame(() => top.current?.querySelector<HTMLInputElement>("input")?.focus());
  };

  return (
    <form
      ref={top}
      className="bm-game bm-sheet-form"
      data-handed={handedIn}
      onSubmit={(e) => {
        e.preventDefault();
        setHandedIn(true);
      }}
    >
      <div className="bm-answer-head">
        <h3 className="bm-game-title">Answer sheet</h3>
        <dl className="bm-answer-meta">
          <div>
            <dt>Subject</dt>
            <dd>Pragati Srivastava</dd>
          </div>
          <div>
            <dt>Sheet</dt>
            <dd className="num">{String(sheet).padStart(3, "0")}</dd>
          </div>
          <div>
            <dt>Marked</dt>
            <dd className="num">
              {answered}/{VIVA.length}
            </dd>
          </div>
        </dl>
        <p className="bm-game-rules">Six questions. Every answer is printed somewhere on this page. Fill one square per row, then hand it in.</p>
      </div>

      <ol className="bm-questions">
        {VIVA.map((q, qi) => {
          const chosen = answers[qi];
          const right = chosen === q.answer;
          return (
            <li key={q.id} className="bm-q" data-result={handedIn ? (right ? "right" : "wrong") : undefined}>
              <fieldset disabled={handedIn}>
                <legend>
                  <span className="bm-q-n num">{qi + 1}</span>
                  <span>{q.prompt}</span>
                </legend>
                <div className="bm-opts">
                  {q.options.map((o, oi) => (
                    <label
                      key={oi}
                      className="bm-opt"
                      data-key={handedIn && oi === q.answer ? "true" : undefined}
                      data-miss={handedIn && chosen === oi && !right ? "true" : undefined}
                    >
                      <input
                        type="radio"
                        name={`viva-${sheet}-${q.id}`}
                        checked={chosen === oi}
                        onChange={() => setAnswers((a) => a.map((v, i) => (i === qi ? oi : v)))}
                      />
                      <span className="bm-bubble" aria-hidden="true">
                        {LETTERS[oi]}
                      </span>
                      <span className="bm-opt-text">{o}</span>
                    </label>
                  ))}
                </div>
                {handedIn ? (
                  <p className="bm-q-explain">
                    <Icon name={right ? "check" : "x"} size={16} />
                    <span>
                      <span className="sr-only">{right ? "Correct. " : chosen === null ? "Not answered. " : "Wrong. "}</span>
                      {q.explain}
                    </span>
                  </p>
                ) : null}
              </fieldset>
            </li>
          );
        })}
      </ol>

      <div className="bm-answer-foot" aria-live="polite">
        {handedIn ? (
          <div ref={result} tabIndex={-1} className="bm-end" data-outcome={correct >= 4 ? "won" : "lost"}>
            <p className="bm-end-title">
              <span className="sr-only">
                {g.label}, {correct} of {VIVA.length}.
              </span>
              <PixelText text={g.label} size="bm-u-grade" gap={0.25} />
              <span className="bm-end-score num" aria-hidden="true">
                {correct}/{VIVA.length}
              </span>
            </p>
            <p className="bm-end-line">{g.line}</p>
            <div className="bm-end-actions">
              <EmailButton label={correct === VIVA.length ? "Email Pragati: book the interview" : "Email Pragati the rest"} />
              <button type="button" className="bm-btn" onClick={reset}>
                <Icon name="replay" size={18} />
                <span>New sheet</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="bm-end-actions">
            <button type="submit" className="bm-btn bm-btn-primary" disabled={answered === 0}>
              <Icon name="check" size={18} />
              <span>Hand in the sheet</span>
            </button>
            <span className="bm-answer-note">
              {answered === 0 ? "Mark at least one square." : answered < VIVA.length ? `${VIVA.length - answered} rows blank. Blank rows score zero.` : "All rows marked."}
            </span>
          </div>
        )}
      </div>
    </form>
  );
}
