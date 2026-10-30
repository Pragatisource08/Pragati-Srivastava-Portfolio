"use client";

import { useEffect, useRef, useState } from "react";
import { links, profile } from "@/lib/content";
import { VIVA, grade } from "@/lib/games/viva";
import { Icon } from "@/components/icons";
import { ContactLinks, EndCall } from "./shared";
import { s } from "./cls";

export function River() {
  return (
    <section id="river" className={`${s.section} ${s.riverSection}`} aria-labelledby="river-h">
      <div className={s.wrap}>
        <h2 id="river-h" className={s.h2}>
          The river mirror
        </h2>
        <div className={s.riverGrid}>
          <div>
            <h3 className={s.h3}>Education</h3>
            <table className={s.ferry}>
              <caption className={s.srOnly}>Education</caption>
              <tbody>
                <tr>
                  <th scope="row">University</th>
                  <td>{profile.university}</td>
                </tr>
                <tr>
                  <th scope="row">Degree</th>
                  <td>{profile.degree}</td>
                </tr>
                <tr>
                  <th scope="row">Years</th>
                  <td className={s.num}>{profile.years}</td>
                </tr>
                <tr>
                  <th scope="row">CGPA</th>
                  <td className={s.num}>{profile.cgpa}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <Viva />
        </div>
      </div>

      <div className={s.finalSign}>
        <a href={links.mailto} className={s.bigSign}>
          <Icon name="mail" size={40} strokeWidth={2} />
          <span>Email Pragati</span>
        </a>
        <span className={s.bigSignMirror} aria-hidden="true">
          Email Pragati
        </span>
        <div className={s.finalLinks}>
          <ContactLinks />
        </div>
      </div>
    </section>
  );
}

function Viva() {
  const [idx, setIdx] = useState(0);
  const [picks, setPicks] = useState<number[]>([]);
  const endRef = useRef<HTMLHeadingElement>(null);
  const qRef = useRef<HTMLParagraphElement>(null);
  const done = picks.length === VIVA.length && idx >= VIVA.length;
  const q = VIVA[Math.min(idx, VIVA.length - 1)];
  const chosen = picks.length > idx ? picks[idx] : null;
  const correct = picks.filter((p, i) => p === VIVA[i].answer).length;
  const g = grade(correct);
  const started = useRef(false);

  useEffect(() => {
    if (done) endRef.current?.focus();
    else if (started.current) qRef.current?.focus();
  }, [done, idx]);

  const choose = (k: number) => {
    if (chosen !== null) return;
    setPicks((p) => [...p, k]);
  };
  const next = () => {
    started.current = true;
    setIdx((i) => i + 1);
  };
  const again = () => {
    started.current = true;
    setPicks([]);
    setIdx(0);
  };

  return (
    <div className={s.viva} aria-labelledby="viva-h">
      <h3 id="viva-h" className={s.h3}>
        Read the reflection
      </h3>
      <p className={s.vivaIntro}>Six questions. Every answer is upstream on this page.</p>

      {!done && (
        <div className={s.vivaCard}>
          <p className={s.reportCount}>
            Question <span className={s.num}>{idx + 1}</span> of <span className={s.num}>{VIVA.length}</span>
          </p>
          <p className={s.vivaQ} ref={qRef} tabIndex={-1}>
            {q.prompt}
          </p>
          <div className={s.vivaOptions} role="group" aria-label="Answers">
            {q.options.map((o, k) => {
              const state =
                chosen === null ? undefined : k === q.answer ? "right" : k === chosen ? "wrong" : "out";
              return (
                <button
                  key={o}
                  type="button"
                  className={s.vivaOpt}
                  data-state={state}
                  aria-disabled={chosen !== null}
                  onClick={() => choose(k)}
                >
                  {state === "right" && <Icon name="check" size={18} />}
                  {state === "wrong" && <Icon name="x" size={18} />}
                  <span>{o}</span>
                </button>
              );
            })}
          </div>
          <p aria-live="polite" className={s.vivaExplain}>
            {chosen !== null ? `${chosen === q.answer ? "Right." : "Not this one."} ${q.explain}` : ""}
          </p>
          {chosen !== null && (
            <button type="button" className={s.btnGhost} onClick={next}>
              <Icon name="arrowRight" size={18} />
              {idx + 1 < VIVA.length ? "Next question" : "See the result"}
            </button>
          )}
        </div>
      )}

      {done && (
        <div className={s.gameEnd}>
          <h4 ref={endRef} tabIndex={-1} className={s.endHead}>
            {g.label}: <span className={s.num}>{correct}</span> of {VIVA.length}
          </h4>
          <EndCall line={g.line} onAgain={again} againLabel="Ask again" />
        </div>
      )}
    </div>
  );
}
