"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { Icon } from "@/components/icons";
import { VIVA, grade } from "@/lib/games/viva";
import { GameEnd, focusIfInside } from "./shared";

const LETTERS = ["A", "B", "C", "D"];

export function Viva() {
  const root = useRef<HTMLDivElement>(null);
  const prompt = useRef<HTMLHeadingElement>(null);
  const next = useRef<HTMLButtonElement>(null);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const [done, setDone] = useState(false);

  const q = VIVA[index];
  const answered = picked !== null;

  function choose(i: number) {
    if (answered) return;
    setPicked(i);
    if (i === q.answer) setCorrect((c) => c + 1);
    requestAnimationFrame(() => focusIfInside(root.current, next.current));
  }

  function advance() {
    if (index + 1 >= VIVA.length) {
      setDone(true);
      return;
    }
    setIndex(index + 1);
    setPicked(null);
    requestAnimationFrame(() => focusIfInside(root.current, prompt.current));
  }

  function restart() {
    setIndex(0);
    setPicked(null);
    setCorrect(0);
    setDone(false);
    requestAnimationFrame(() => focusIfInside(root.current, prompt.current));
  }

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (done || answered || e.metaKey || e.ctrlKey || e.altKey) return;
    const k = e.key.toUpperCase();
    const i = LETTERS.indexOf(k) >= 0 ? LETTERS.indexOf(k) : Number(k) - 1;
    if (Number.isInteger(i) && i >= 0 && i < q.options.length) {
      e.preventDefault();
      choose(i);
    }
  }

  if (done) {
    const g = grade(correct);
    return (
      <div ref={root}>
        <GameEnd title={`${g.label}: ${correct} of ${VIVA.length}`} onReplay={restart} containerRef={root}>
          <p>{g.line} Every answer is somewhere on this page, and Pragati can go deeper on any of them.</p>
        </GameEnd>
      </div>
    );
  }

  return (
    <div ref={root} onKeyDown={onKeyDown}>
      <div className="flex items-center justify-between gap-4">
        <p className="std-meta std-num">
          Question {index + 1} of {VIVA.length}
        </p>
        <p className="std-meta std-num">{correct} correct</p>
      </div>
      <div className="std-steps mt-2" aria-hidden="true">
        {VIVA.map((v, i) => (
          <span key={v.id} data-state={i < index ? "done" : i === index ? "now" : undefined} />
        ))}
      </div>

      <div key={q.id} className="std-panel-body">
        <h4
          ref={prompt}
          tabIndex={-1}
          className="std-end-title mt-5 text-[1.0625rem] font-semibold leading-snug text-[color:var(--ink)]"
        >
          {q.prompt}
        </h4>
        <ul className="mt-4 grid gap-2">
          {q.options.map((opt, i) => {
            const state = !answered ? undefined : i === q.answer ? "right" : i === picked ? "wrong" : undefined;
            return (
              <li key={opt}>
                <button
                  type="button"
                  className="std-option"
                  disabled={answered}
                  data-state={state}
                  onClick={() => choose(i)}
                >
                  <kbd className="std-kbd std-mono" aria-hidden="true">
                    {LETTERS[i]}
                  </kbd>
                  {opt}
                  {state === "right" ? (
                    <Icon name="check" size={18} className="std-option-mark" title="Correct answer" />
                  ) : state === "wrong" ? (
                    <Icon name="x" size={18} className="std-option-mark" title="Your answer" />
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>

        <p className="sr-only" aria-live="polite">
          {answered ? `${picked === q.answer ? "Correct." : "Not quite."} ${q.explain}` : ""}
        </p>
        <div className="mt-4">
          {answered ? (
            <div className="flex flex-wrap items-end justify-between gap-4">
              <p className="max-w-[52ch] text-[0.9375rem]">
                <span className="std-strong">{picked === q.answer ? "Correct." : "Not quite."}</span> {q.explain}
              </p>
              <button ref={next} type="button" onClick={advance} className="std-btn std-btn-quiet std-btn-sm">
                {index + 1 >= VIVA.length ? "See result" : "Next question"}
                <Icon name="arrowRight" size={15} />
              </button>
            </div>
          ) : (
            <p className="std-meta">
              Press <kbd className="std-kbd std-mono">A</kbd>–<kbd className="std-kbd std-mono">D</kbd> or choose an
              answer.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
