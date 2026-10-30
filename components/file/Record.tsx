"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { Icon } from "@/components/icons";
import { useFile } from "./FileState";
import { Tick } from "./Ink";
import type { FileRecord } from "./records";
import { s } from "./styles";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Record({ record, children }: { record: FileRecord; children?: ReactNode }) {
  const { copy, setCopy, checked, check } = useFile();
  const sheetRef = useRef<HTMLElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const procedureRef = useRef<HTMLDivElement>(null);
  const onDesk = useInView(sheetRef, { once: true, margin: "-12% 0px" });
  const read = useInView(resultRef, { once: true, amount: 0.9 });
  const isChecked = checked.has(record.no);
  const rough = copy === "rough";
  const graph = record.paper === "graph";

  useEffect(() => {
    if (read && record.kind !== "viva") check(record.no);
  }, [read, record.no, record.kind, check]);

  // Switch to Rough work without losing the reader's place while the sheet grows above them.
  function showRoughWork() {
    const anchor = procedureRef.current;
    if (!anchor) return setCopy("rough");
    const start = anchor.getBoundingClientRect().top;
    setCopy("rough");
    const until = performance.now() + 500;
    const hold = () => {
      window.scrollBy(0, anchor.getBoundingClientRect().top - start);
      if (performance.now() < until) requestAnimationFrame(hold);
    };
    requestAnimationFrame(hold);
  }

  const observation = record.procedure[0];
  const extra = record.procedure.slice(1);

  return (
    <motion.article
      ref={sheetRef}
      id={record.id}
      tabIndex={-1}
      aria-labelledby={`${record.id}-title`}
      initial={false}
      animate={onDesk ? { y: 0, rotate: record.no % 2 ? -0.35 : 0.35 } : { y: 28, rotate: record.no % 2 ? -1.2 : 1.2 }}
      transition={{ duration: 0.8, ease: EASE }}
      className={`${s.sheet} ${graph ? s.graph : ""} ${
        record.half === "left" ? "lg:mr-auto lg:w-[78%]" : record.half === "right" ? "lg:ml-auto lg:w-[78%]" : ""
      } w-full scroll-mt-20 pb-8 pl-[3.6rem] pr-4 pt-7 [--margin-x:2.6rem] sm:pb-10 sm:pl-[6rem] sm:pr-10 sm:pt-9 sm:[--margin-x:4.4rem]`}
    >
      <PunchHoles />
      {!graph && (
        <motion.span
          className={s.marginLine}
          initial={false}
          animate={{ scaleY: onDesk ? 1 : 0 }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.15 }}
          aria-hidden
        />
      )}

      <div className="flex flex-col-reverse gap-x-8 gap-y-3 sm:flex-row sm:items-start sm:justify-between">
        <h2 id={`${record.id}-title`} className={`${s.printed} max-w-[20ch] text-[clamp(2.1rem,4.6vw,3.6rem)]`}>
          {record.title}
        </h2>
        <div className="flex shrink-0 items-center gap-4 sm:flex-col sm:items-end sm:gap-1.5 sm:pt-1">
          <dl className="flex gap-4 sm:flex-col sm:items-end sm:gap-0.5">
            <div className="flex items-baseline gap-1.5">
              <dt className={s.label}>{record.kind === "training" ? "Report" : "Expt. No."}</dt>
              <dd className={`${s.hand} text-[1.05rem]`}>{record.kind === "training" ? "Training" : record.no}</dd>
            </div>
            <div className="flex items-baseline gap-1.5">
              <dt className={s.label}>Date</dt>
              <dd className={`${s.hand} text-[1.05rem]`}>{record.date}</dd>
            </div>
          </dl>
          {record.kind !== "viva" && (
            <div className="flex h-8 items-center gap-1" aria-live="polite">
              <Tick show={isChecked} size={30} />
              <span className={`${s.hand} text-base`} style={{ color: "var(--red-ink)" }}>
                {isChecked ? "Checked" : ""}
              </span>
            </div>
          )}
        </div>
      </div>

      {record.kind !== "viva" ? (
        <div className={`${graph ? "" : s.ruled} ${s.writing} mt-8 grid gap-x-10 lg:grid-cols-[1fr_15rem]`}>
          <div className="max-w-[68ch] text-[1.04rem]">
            <Field label="Aim">
              <p>{record.aim}</p>
            </Field>

            <AnimatePresence initial={false}>
              {rough && record.apparatus.length > 0 && (
                <Collapse key="apparatus">
                  <Field label="Apparatus">
                    <ul className="flex flex-wrap gap-x-1.5 gap-y-1 py-0.5">
                      {record.apparatus.map((a) => (
                        <li key={a} className={`${s.chip} h-7 !py-0 !leading-7`}>
                          {a}
                        </li>
                      ))}
                    </ul>
                  </Field>
                </Collapse>
              )}
            </AnimatePresence>

            <div ref={procedureRef}>
              <Field label={rough ? "Procedure" : "Observation"}>
                {rough ? (
                  <ol className="list-none">
                    {record.procedure.map((p, i) => (
                      <li key={i} className="grid grid-cols-[1.6rem_1fr]">
                        <span className={`${s.hand} text-lg`}>{i + 1}.</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p>{observation}</p>
                )}
              </Field>
            </div>

            {!rough && extra.length > 0 && (
              <button
                type="button"
                onClick={showRoughWork}
                className={`${s.hand} text-[1.02rem] underline decoration-[var(--rule)] underline-offset-4 hover:decoration-[var(--ink)]`}
              >
                + {extra.length} more step{extra.length > 1 ? "s" : ""} in Rough work
              </button>
            )}
          </div>

          <div ref={resultRef} className="mt-8 lg:mt-0">
            <p className={s.label}>Result</p>
            <p className="font-semibold">{record.result}</p>
            {record.stamp && (
              <div className="flex h-16 items-center">
                <motion.p
                  className={`${s.stamp} max-w-full text-[0.95rem]`}
                  initial={false}
                  animate={onDesk ? { scale: 1, rotate: -5, opacity: 1 } : { scale: 1.4, rotate: -12, opacity: 0 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 520, damping: 24 }}
                >
                  {record.stamp}
                </motion.p>
              </div>
            )}
            {record.evidence && (
              <p>
                <a
                  href={record.evidence.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => check(record.no)}
                  className={`${s.inkLink} inline-flex items-center gap-1`}
                >
                  {record.evidence.label}
                  <Icon name="arrowUpRight" size={16} />
                </a>
              </p>
            )}
          </div>
        </div>
      ) : null}

      {children && <div className="mt-8">{children}</div>}
    </motion.article>
  );
}

// The file's binding: two punched holes on the left edge show the kraft cover behind.
export function PunchHoles() {
  return (
    <>
      <span className="absolute left-3 top-[22%] h-3.5 w-3.5 rounded-full border-[1.5px] border-[var(--line)] bg-[var(--kraft)] sm:left-5" aria-hidden />
      <span className="absolute bottom-[22%] left-3 h-3.5 w-3.5 rounded-full border-[1.5px] border-[var(--line)] bg-[var(--kraft)] sm:left-5" aria-hidden />
    </>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="mb-8">
      <p className={s.label}>{label}</p>
      {children}
    </div>
  );
}

function Collapse({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.35, ease: EASE }}
      className="overflow-hidden"
    >
      {children}
    </motion.div>
  );
}
