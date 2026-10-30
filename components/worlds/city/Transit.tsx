"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { experience, openSource } from "@/lib/content";
import { CACHE_DISCLAIMER, SEED_CACHE, THRESHOLD, lookup, type CacheEntry, type Lookup } from "@/lib/games/similarity";
import { Icon } from "@/components/icons";
import { EndCall, useActive, useFrame, useReducedMotionPref } from "./shared";
import { PlatformsGame } from "./PlatformsGame";
import { s } from "./cls";

export function Transit() {
  return (
    <section id="transit" className={s.section} aria-labelledby="transit-h">
      <div className={s.wrap}>
        <h2 id="transit-h" className={s.h2}>
          The Cloud 9 line
        </h2>
        <div className={s.transitGrid}>
          <div className={s.prose}>
            <p className={s.timetable}>
              <span className={s.ttRole}>{experience.role}</span>
              <span>
                {experience.company} · {experience.dates} · {experience.location}
              </span>
            </p>
            <p className={s.lede}>
              {experience.summary} On this map, every query is a train: it runs from the station to Gemini, or it
              stops early at the Pinecone depot when a similar answer is already stored.
            </p>
            <ul className={`${s.points} ${s.allStops}`}>
              {experience.points.map((pt) => (
                <li key={pt}>{pt}</li>
              ))}
            </ul>
            <ul className={s.plates} aria-label="Stack">
              {experience.stack.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
          <DepotLine />
        </div>

        <div className={s.openSource}>
          <h3 className={s.h3}>Platforms 8888–8897</h3>
          <p className={s.lede}>
            Two merged pull requests in <a href={openSource.repoUrl} target="_blank" rel="noreferrer">{openSource.repo}</a>,
            a {openSource.language} project, in {openSource.date}.
          </p>
          <ol className={s.departures}>
            {openSource.prs.map((pr) => (
              <li key={pr.number} className={s.departure}>
                <span className={s.depNum}>#{pr.number}</span>
                <div className={s.depBody}>
                  <p className={s.depTitle}>{pr.title}</p>
                  <p>{pr.summary}</p>
                  <p className={s.allStops}>{pr.detail}</p>
                </div>
                <span className={s.depStatus}>
                  <Icon name="check" size={16} />
                  {pr.status}
                </span>
                <a className={s.door} href={pr.url} target="_blank" rel="noreferrer">
                  View PR <span className={s.num}>#{pr.number}</span>
                  <Icon name="arrowUpRight" size={16} />
                </a>
              </li>
            ))}
          </ol>
          <PlatformsGame />
        </div>
      </div>
    </section>
  );
}

type Route = "gemini" | "depot";
type Station = { x: number; y: number; label: readonly string[]; dx: number; dy: number; anchor: "start" | "middle" };

const GEO = {
  wide: {
    vb: "0 0 720 250",
    gemini: "M60 96 H660",
    depot: "M60 96 H300 C360 96 380 196 440 196 H600",
    st: {
      query: { x: 60, y: 96, label: ["Your query"], dx: 0, dy: 40, anchor: "middle" },
      pipe: { x: 300, y: 96, label: ["Python pipeline", "AWS EC2"], dx: 0, dy: -46, anchor: "middle" },
      gemini: { x: 660, y: 96, label: ["Google Gemini"], dx: 0, dy: -30, anchor: "middle" },
      depot: { x: 600, y: 196, label: ["Pinecone depot", "helpful answers only"], dx: 0, dy: 34, anchor: "middle" },
    },
  },
  tall: {
    vb: "0 0 340 430",
    gemini: "M50 36 V396",
    depot: "M50 36 V160 C50 230 190 220 190 280 V330",
    st: {
      query: { x: 50, y: 36, label: ["Your query"], dx: 24, dy: 5, anchor: "start" },
      pipe: { x: 50, y: 160, label: ["Python pipeline", "AWS EC2"], dx: 24, dy: -4, anchor: "start" },
      gemini: { x: 50, y: 396, label: ["Google Gemini"], dx: 24, dy: 5, anchor: "start" },
      depot: { x: 190, y: 330, label: ["Pinecone depot", "helpful answers only"], dx: 24, dy: -4, anchor: "start" },
    },
  },
} as const;

const SUGGESTIONS = ["How can I export my data to CSV?", "When are support hours?", "How do I delete my account?"];

function DepotLine() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trainRef = useRef<SVGGElement>(null);
  const pathRefs = useRef<Record<Route, SVGPathElement | null>>({ gemini: null, depot: null });
  const [tall, setTall] = useState(false);
  const reduced = useReducedMotionPref();
  const active = useActive(wrapRef) && !reduced;

  const [cache, setCache] = useState<CacheEntry[]>(SEED_CACHE);
  const [query, setQuery] = useState("");
  const [asked, setAsked] = useState<{ q: string; res: Lookup } | null>(null);
  const [feedback, setFeedback] = useState<"helpful" | "discarded" | null>(null);
  const run = useRef<{ route: Route; start: number } | null>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setTall(e.contentRect.width < 560));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const place = (route: Route, p: number) => {
    const path = pathRefs.current[route];
    const g = trainRef.current;
    if (!path || !g) return;
    const L = path.getTotalLength();
    const a = path.getPointAtLength(Math.max(0, Math.min(1, p)) * L);
    const b = path.getPointAtLength(Math.min(1, p + 0.01) * L);
    const c = path.getPointAtLength(Math.max(0, p - 0.01) * L);
    const ang = (Math.atan2(b.y - c.y, b.x - c.x) * 180) / Math.PI;
    g.setAttribute("transform", `translate(${a.x} ${a.y}) rotate(${ang})`);
  };

  useFrame(active, (_dt, now) => {
    const r = run.current;
    if (r) {
      place(r.route, easeOut(Math.min(1, (now - r.start) / 2400)));
      return;
    }
    // Idle timetable: alternate Gemini and depot runs, time-indexed.
    const cycle = 5200;
    const n = Math.floor(now / cycle);
    const p = Math.min(1, (now % cycle) / 3600);
    place(n % 2 ? "depot" : "gemini", easeInOut(p));
  });

  // Static placement when the loop is not running.
  useEffect(() => {
    if (active) return;
    const id = requestAnimationFrame(() => {
      if (asked) place(asked.res.kind === "hit" ? "depot" : "gemini", 1);
      else place("gemini", 0);
    });
    return () => cancelAnimationFrame(id);
  }, [active, asked, tall]);

  const send = (q: string) => {
    const text = q.trim();
    if (!text) return;
    const res = lookup(cache, text);
    setAsked({ q: text, res });
    setFeedback(null);
    run.current = { route: res.kind === "hit" ? "depot" : "gemini", start: performance.now() };
  };
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    send(query);
  };
  const reset = () => {
    setAsked(null);
    setFeedback(null);
    setQuery("");
    run.current = null;
  };
  const markHelpful = () => {
    if (!asked) return;
    setCache((c) => [...c, { query: asked.q, answer: "The Gemini reply to this question, stored after a rider marked it helpful." }]);
    setFeedback("helpful");
  };

  const g = tall ? GEO.tall : GEO.wide;
  const target: Route | null = asked ? (asked.res.kind === "hit" ? "depot" : "gemini") : null;

  return (
    <div className={s.lineCard} ref={wrapRef}>
      <svg className={s.lineMap} viewBox={g.vb} role="img" aria-labelledby="line-title">
        <title id="line-title">
          Cloud 9 route map: a query runs through the Python pipeline on AWS EC2 to Google Gemini, or branches to the
          Pinecone depot when a similar answer is stored.
        </title>
        <path
          ref={(el) => {
            pathRefs.current.gemini = el;
          }}
          d={g.gemini}
          className={s.track}
          data-lit={target === "gemini" ? "" : undefined}
        />
        <path
          ref={(el) => {
            pathRefs.current.depot = el;
          }}
          d={g.depot}
          className={s.track}
          data-lit={target === "depot" ? "" : undefined}
        />
        {Object.entries(g.st as Record<string, Station>).map(([k, st]) => (
          <g key={k} className={s.station} data-dest={(k === "depot" && target === "depot") || (k === "gemini" && target === "gemini") ? "" : undefined}>
            <circle cx={st.x} cy={st.y} r={k === "depot" ? 11 : 9} />
            <text x={st.x + st.dx} y={st.y + st.dy} textAnchor={st.anchor}>
              {st.label.map((l, li) => (
                <tspan key={l} x={st.x + st.dx} dy={li ? 18 : 0} className={li ? s.stationSub : undefined}>
                  {l}
                </tspan>
              ))}
            </text>
          </g>
        ))}
        <g ref={trainRef} className={s.mapTrain} transform={`translate(${g.st.query.x} ${g.st.query.y})`}>
          <rect x="-15" y="-6" width="30" height="12" rx="4" />
          <rect x="-10" y="-2" width="4" height="4" className={s.mapTrainWin} />
          <rect x="-2" y="-2" width="4" height="4" className={s.mapTrainWin} />
          <rect x="6" y="-2" width="4" height="4" className={s.mapTrainWin} />
        </g>
      </svg>

      <div className={s.depot}>
        <h3 className={s.h4}>Send a query down the line</h3>
        <form onSubmit={onSubmit} className={s.depotForm}>
          <label htmlFor="depot-q" className={s.srOnly}>
            A support question
          </label>
          <input
            id="depot-q"
            className={s.input}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a support question"
            autoComplete="off"
          />
          <button type="submit" className={s.btnAmber} disabled={!query.trim()}>
            <Icon name="arrowRight" size={18} />
            Send the train
          </button>
        </form>
        <div className={s.chips}>
          {SUGGESTIONS.map((q) => (
            <button
              key={q}
              type="button"
              className={s.chip}
              onClick={() => {
                setQuery(q);
                send(q);
              }}
            >
              {q}
            </button>
          ))}
        </div>
        <div aria-live="polite" className={s.depotResult}>
          {asked && asked.res.kind === "hit" && (
            <>
              <p className={s.resultHead}>Served from the Pinecone depot. No Gemini call.</p>
              <p>
                Similarity <span className={s.num}>{asked.res.score.toFixed(2)}</span> clears the{" "}
                <span className={s.num}>{THRESHOLD.toFixed(2)}</span> threshold against “{asked.res.entry.query}”.
              </p>
              <p className={s.answer}>{asked.res.entry.answer}</p>
            </>
          )}
          {asked && asked.res.kind === "miss" && (
            <>
              <p className={s.resultHead}>No stored answer is close enough. This train runs on to Gemini.</p>
              <p>
                Best similarity <span className={s.num}>{asked.res.score.toFixed(2)}</span>, needs{" "}
                <span className={s.num}>{THRESHOLD.toFixed(2)}</span>. A reply is stored in the depot only if the
                rider marks it helpful.
              </p>
              {feedback === null && (
                <div className={s.endActions}>
                  <button type="button" className={s.btnGhost} onClick={markHelpful}>
                    <Icon name="check" size={18} />
                    Mark the reply helpful
                  </button>
                  <button type="button" className={s.btnGhost} onClick={() => setFeedback("discarded")}>
                    <Icon name="x" size={18} />
                    Not helpful
                  </button>
                </div>
              )}
              {feedback === "helpful" && <p>Stored. Ask a similar question and the train stops at the depot.</p>}
              {feedback === "discarded" && <p>Discarded. Negative-feedback replies never reach the depot.</p>}
            </>
          )}
        </div>
        {asked && (
          <EndCall
            line="That is the Cloud 9 pattern she built and deployed. Want her on your backend?"
            onAgain={reset}
            againLabel="Ask again"
          />
        )}
        <p className={s.disclaimer}>{CACHE_DISCLAIMER}</p>
      </div>
    </div>
  );
}

function easeOut(p: number) {
  return 1 - Math.pow(2, -10 * p);
}
function easeInOut(p: number) {
  return p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
}
