"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Icon } from "@/components/icons";
import { links } from "@/lib/content";
import { VIVA, grade } from "@/lib/games/viva";
import { useFile } from "../FileState";
import { Cross, Signature, Tick } from "../Ink";
import { s } from "../styles";

export function VivaPractical() {
  const { sign, signed, check } = useFile();
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = VIVA[i];
  const answered = picked !== null;
  const result = grade(score);

  function choose(idx: number) {
    if (answered) return;
    setPicked(idx);
    if (idx === q.answer) setScore((n) => n + 1);
  }

  function next() {
    if (i + 1 >= VIVA.length) {
      setDone(true);
      check(7);
      return;
    }
    setI(i + 1);
    setPicked(null);
  }

  function restart() {
    setI(0);
    setPicked(null);
    setScore(0);
    setDone(false);
  }

  return (
    <div data-local-keys className="max-w-[760px]">
      <AnimatePresence mode="wait" initial={false}>
        {!done ? (
          <motion.fieldset
            key={q.id}
            initial={{ x: 24, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -24, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <legend className={s.label}>
              Question {i + 1} of {VIVA.length}
            </legend>
            <p className="mt-2 text-[1.35rem] font-semibold leading-snug sm:text-[1.5rem]">{q.prompt}</p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {q.options.map((opt, idx) => {
                const isAnswer = idx === q.answer;
                const isPicked = idx === picked;
                return (
                  <li key={opt}>
                    <button
                      type="button"
                      onClick={() => choose(idx)}
                      disabled={answered}
                      aria-pressed={isPicked}
                      className={`flex w-full items-center justify-between gap-3 rounded-[3px] border-[1.5px] px-3.5 py-3 text-left text-[1rem] transition-colors ${
                        answered && isAnswer
                          ? "border-[var(--ink)] bg-[#eef3fc]"
                          : answered && isPicked
                            ? "border-[var(--margin)] bg-[#fdf0ee]"
                            : "border-[var(--line)] bg-white hover:border-[var(--ink)] hover:bg-[#f5f8fe] disabled:hover:bg-white"
                      }`}
                    >
                      <span>{opt}</span>
                      {answered && isAnswer && <Tick show size={24} />}
                      {answered && isPicked && !isAnswer && <Cross show size={20} />}
                    </button>
                  </li>
                );
              })}
            </ul>
            <div className="mt-4 min-h-[3.25rem]" aria-live="polite">
              {answered && (
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className={`${s.hand} text-[1.1rem]`} style={{ color: picked === q.answer ? "var(--ink)" : "var(--red-ink)" }}>
                    {picked === q.answer ? "Correct. " : "Not quite. "}
                    {q.explain}
                  </p>
                  <button type="button" onClick={next} className={`${s.btn} ${s.btnInk}`} autoFocus>
                    {i + 1 >= VIVA.length ? "Finish the viva" : "Next question"}
                    <Icon name="arrowRight" size={16} />
                  </button>
                </div>
              )}
            </div>
          </motion.fieldset>
        ) : (
          <motion.div
            key="remarks"
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-5"
            role="status"
          >
            <div className="flex flex-wrap items-end gap-x-6 gap-y-2">
              <p className={`${s.stamp} text-[1.4rem]`}>{result.label}</p>
              <p className="text-[1.05rem] tabular-nums">
                {score} / {VIVA.length} correct
              </p>
            </div>
            <p className={`${s.hand} -rotate-1 text-[1.5rem]`} style={{ color: "var(--red-ink)" }}>
              Remarks: {result.line}
            </p>

            <div className="flex flex-wrap items-end gap-6">
              <div className="w-[260px]">
                <Signature show={signed} className="h-[90px] w-[260px]" />
                <p className={`${s.label} border-t-[1.5px] border-[var(--line)] pt-1`}>Examiner&apos;s signature</p>
              </div>
              {!signed && (
                <button type="button" onClick={sign} className={`${s.btn} ${s.btnInk}`}>
                  Sign the file
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <motion.a
                href={links.mailto}
                className={`${s.redStamp} text-[1.15rem]`}
                animate={signed ? { scale: [1.18, 1], rotate: [-6, -1.5] } : { scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 480, damping: 20, delay: signed ? 1.3 : 0 }}
              >
                <Icon name="mail" size={20} strokeWidth={2} />
                Call her for the interview
              </motion.a>
              <button type="button" onClick={restart} className={s.btn}>
                <Icon name="replay" size={16} />
                Sit the viva again
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
