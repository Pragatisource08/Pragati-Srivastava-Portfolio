"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icons";
import { createRng } from "@/lib/games/rng";
import { CACHE_DISCLAIMER, lookup, SEED_CACHE, THRESHOLD, type CacheEntry, type Lookup } from "@/lib/games/similarity";
import { GameEnd } from "./Contact";
import { SEED } from "./field";
import { drawCloud, drawFlower, INK, sizeCanvas } from "./render";
import styles from "./styles";

const ROUNDS = 3;
const SUGGESTIONS = ["reset my password please", "support hours on sunday?", "delete my account", "export data as csv"];
const HELPFUL_ANSWER = "Sample answer from Gemini, kept because a visitor marked it helpful.";

type Fall = {
  query: string;
  result: Lookup;
  x: number;
  y: number;
  vx: number;
  vy: number;
  t: number;
  trail: [number, number][];
  done: boolean;
};

type Geo = { w: number; h: number; cloud: [number, number]; flower: [number, number]; moon: [number, number]; ground: number; ring: number; s: number };

function geo(w: number, h: number): Geo {
  const s = Math.min(w, h * 1.6);
  return {
    w,
    h,
    s,
    cloud: [w * 0.2, h * 0.16],
    flower: [w * 0.36, h * 0.64],
    moon: [w * 0.86, h * 0.17],
    ground: h * 0.9,
    ring: s * 0.11,
  };
}

function orbitPos(g: Geo, i: number, n: number, t: number): [number, number] {
  const a = t * 0.6 + (i / Math.max(1, n)) * Math.PI * 2;
  const r = g.ring * (1 + (i % 2) * 0.22);
  return [g.flower[0] + Math.cos(a) * r, g.flower[1] + Math.sin(a) * r * 0.48];
}

export function CacheGame() {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const geoRef = useRef<Geo | null>(null);
  const fallRef = useRef<Fall | null>(null);
  const cacheRef = useRef<CacheEntry[]>(SEED_CACHE);
  const highlightRef = useRef<{ query: string; until: number } | null>(null);
  const timeRef = useRef(0);
  const reducedRef = useRef(false);
  const kickRef = useRef<() => void>(() => {});
  const drawRef = useRef<() => void>(() => {});
  const fontRef = useRef("system-ui, sans-serif");

  const [cache, setCache] = useState<CacheEntry[]>(SEED_CACHE);
  const [query, setQuery] = useState("");
  const [rounds, setRounds] = useState<{ query: string; result: Lookup }[]>([]);
  const [falling, setFalling] = useState(false);
  const [planted, setPlanted] = useState<string | null>(null);

  const last = rounds[rounds.length - 1];
  const over = rounds.length >= ROUNDS && !falling;
  const hits = rounds.filter((r) => r.result.kind === "hit").length;

  useEffect(() => {
    cacheRef.current = cache;
    drawRef.current();
  }, [cache]);

  const draw = useCallback(() => {
    const ctx = ctxRef.current;
    const g = geoRef.current;
    if (!ctx || !g) return;
    const t = timeRef.current;
    ctx.clearRect(0, 0, g.w, g.h);
    // ground
    ctx.strokeStyle = "#4a5a51";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, g.ground);
    ctx.lineTo(g.w, g.ground);
    ctx.stroke();
    // moon
    const mr = g.s * 0.05;
    ctx.fillStyle = "rgba(236,223,174,0.1)";
    ctx.beginPath();
    ctx.arc(g.moon[0], g.moon[1], mr * 1.9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ecdfae";
    ctx.beginPath();
    ctx.arc(g.moon[0], g.moon[1], mr, 0, Math.PI * 2);
    ctx.fill();
    // client cloud
    drawCloud(ctx, { x: g.cloud[0], y: g.cloud[1], color: "clear", tilt: 0 }, g.s * 1.3, false);
    // flower + orbiting cached answers (behind half, then front half)
    const entries = cacheRef.current;
    const hl = highlightRef.current;
    const orbit = entries.map((e, i) => ({ e, p: orbitPos(g, i, entries.length, t) }));
    const paintOrbit = (front: boolean) => {
      for (const { e, p } of orbit) {
        if (p[1] >= g.flower[1] !== front) continue;
        const lit = hl && hl.query === e.query;
        ctx.fillStyle = lit ? "#ecdfae" : INK.clear;
        ctx.beginPath();
        ctx.arc(p[0], p[1], lit ? 5 : 3.2, 0, Math.PI * 2);
        ctx.fill();
        if (lit) {
          ctx.strokeStyle = "rgba(236,223,174,0.6)";
          ctx.beginPath();
          ctx.arc(p[0], p[1], 10, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
    };
    ctx.strokeStyle = "rgba(230,239,232,0.18)";
    ctx.beginPath();
    ctx.ellipse(g.flower[0], g.flower[1], g.ring * 1.1, g.ring * 0.53, 0, 0, Math.PI * 2);
    ctx.stroke();
    paintOrbit(false);
    drawFlower(ctx, { x: g.flower[0], y: g.flower[1], capture: g.s * 0.07, ring: g.ring, orbiting: 0 }, g.ground);
    paintOrbit(true);

    // labels, level here: this is the instrument panel of the game
    ctx.font = `600 12px ${fontRef.current}`;
    ctx.fillStyle = "#c6d0c7";
    ctx.textAlign = "center";
    ctx.fillText("client", g.cloud[0], g.cloud[1] - g.s * 0.07);
    ctx.fillText("cache (Pinecone)", g.flower[0], g.ground + 16 > g.h - 4 ? g.ground - 6 : g.ground + 16);
    ctx.fillText("Gemini", g.moon[0], g.moon[1] + mr + 18);

    const f = fallRef.current;
    if (f) {
      const col = f.result.kind === "hit" ? INK.clear : INK.blue;
      ctx.strokeStyle = col;
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      f.trail.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
      ctx.stroke();
      ctx.globalAlpha = 1;
      if (!f.done) {
        ctx.fillStyle = col;
        ctx.beginPath();
        ctx.moveTo(f.x, f.y - 7);
        ctx.quadraticCurveTo(f.x + 5, f.y, f.x, f.y + 4);
        ctx.quadraticCurveTo(f.x - 5, f.y, f.x, f.y - 7);
        ctx.fill();
        const label = f.query.length > 26 ? `${f.query.slice(0, 25)}...` : f.query;
        ctx.textAlign = f.x > g.w * 0.6 ? "right" : "left";
        ctx.fillStyle = "#edf0e8";
        ctx.fillText(label, f.x + (f.x > g.w * 0.6 ? -10 : 10), f.y + 4);
      }
    }
  }, []);
  useEffect(() => {
    drawRef.current = draw;
  }, [draw]);

  const land = useCallback(() => {
    const f = fallRef.current;
    if (!f || f.done) return;
    f.done = true;
    if (f.result.kind === "hit") highlightRef.current = { query: f.result.entry.query, until: timeRef.current + 4 };
    setFalling(false);
  }, []);

  // Advance the falling drop one step through the little field.
  const advance = useCallback(
    (dt: number) => {
      const g = geoRef.current;
      const f = fallRef.current;
      timeRef.current += dt;
      if (!g || !f || f.done) return;
      f.t += dt;
      const toF = [g.flower[0] - f.x, g.flower[1] - f.y];
      const dF = Math.hypot(toF[0], toF[1]) || 1;
      let ax = 0;
      let ay = 260;
      if (f.result.kind === "hit") {
        if (f.t > 0.35) {
          ax += (toF[0] / dF) * 520;
          ay += (toF[1] / dF) * 520 - 200;
        }
        if (dF < g.ring * 1.05) land();
      } else {
        // The cache does not hold it: the drop skims past and the moon takes it.
        if (f.t > 0.55 || dF < g.ring * 1.6) {
          const toM = [g.moon[0] - f.x, g.moon[1] - f.y];
          const dM = Math.hypot(toM[0], toM[1]) || 1;
          ax = (toM[0] / dM) * 900;
          ay = (toM[1] / dM) * 900;
          if (dM < g.s * 0.05) land();
        }
      }
      f.vx = (f.vx + ax * dt) * 0.985;
      f.vy = (f.vy + ay * dt) * 0.985;
      const sp = Math.hypot(f.vx, f.vy);
      if (sp > 520) {
        f.vx *= 520 / sp;
        f.vy *= 520 / sp;
      }
      f.x += f.vx * dt;
      f.y += f.vy * dt;
      f.trail.push([f.x, f.y]);
      if (f.trail.length > 26) f.trail.shift();
      if (f.t > 4) land();
    },
    [land]
  );

  useEffect(() => {
    const el = wrap.current;
    const c = canvas.current;
    if (!el || !c) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedRef.current = mq.matches;
    // Canvas cannot read CSS variables: resolve the display face once.
    const fam = getComputedStyle(el).getPropertyValue("--font-garden-display").trim();
    if (fam) fontRef.current = `${fam}, system-ui, sans-serif`;
    let visible = false;
    let raf = 0;
    let lastT = 0;
    const resize = () => {
      const r = el.getBoundingClientRect();
      const w = Math.round(r.width);
      const h = Math.round(r.height);
      if (!w || !h) return;
      ctxRef.current = sizeCanvas(c, w, h);
      geoRef.current = geo(w, h);
      draw();
    };
    const loop = (t: number) => {
      raf = 0;
      if (!visible || document.hidden || reducedRef.current) return;
      const dt = lastT ? Math.min(0.05, (t - lastT) / 1000) : 1 / 60;
      lastT = t;
      advance(dt);
      draw();
      raf = requestAnimationFrame(loop);
    };
    const kick = () => {
      if (raf || reducedRef.current) {
        draw();
        return;
      }
      lastT = 0;
      raf = requestAnimationFrame(loop);
    };
    kickRef.current = kick;
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    resize();
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) kick();
    });
    io.observe(el);
    const onVis = () => !document.hidden && kick();
    document.addEventListener("visibilitychange", onVis);
    const onMq = () => {
      reducedRef.current = mq.matches;
      kick();
    };
    mq.addEventListener("change", onMq);
    return () => {
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      mq.removeEventListener("change", onMq);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [advance, draw]);

  const drop = (raw: string) => {
    const q = raw.trim().slice(0, 80);
    if (!q || falling || rounds.length >= ROUNDS) return;
    const result = lookup(cacheRef.current, q);
    const g = geoRef.current;
    const rng = createRng(SEED + rounds.length);
    setRounds((r) => [...r, { query: q, result }]);
    setPlanted(null);
    setQuery("");
    if (!g) return;
    fallRef.current = {
      query: q,
      result,
      x: g.cloud[0] + (rng() - 0.5) * 20,
      y: g.cloud[1] + 14,
      vx: 50 + rng() * 40,
      vy: 30,
      t: 0,
      trail: [],
      done: false,
    };
    if (reducedRef.current) {
      // Calm path: no flight. The drop is placed where it ends.
      fallRef.current.done = true;
      if (result.kind === "hit") highlightRef.current = { query: result.entry.query, until: Infinity };
      draw();
      return;
    }
    setFalling(true);
    kickRef.current();
  };

  const markHelpful = () => {
    if (!last || last.result.kind !== "miss" || planted === last.query) return;
    const next = [...cacheRef.current, { query: last.query, answer: HELPFUL_ANSWER }];
    setCache(next);
    setPlanted(last.query);
    highlightRef.current = { query: last.query, until: Infinity };
  };

  const reset = () => {
    setRounds([]);
    setCache(SEED_CACHE);
    setPlanted(null);
    setQuery("");
    fallRef.current = null;
    highlightRef.current = null;
    drawRef.current();
  };

  const settled = last && !falling;

  return (
    <div className="rounded-[26px] border border-[var(--g-mist)] bg-[var(--g-ground-deep)] p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className={`${styles.display} text-2xl font-semibold`}>Ask the garden</h3>
        <p className={`${styles.num} text-sm text-[var(--g-ink-faint)]`}>
          Drop {Math.min(rounds.length + (over ? 0 : 1), ROUNDS)} of {ROUNDS}
        </p>
      </div>
      <p className="mt-1 max-w-[60ch] text-[var(--g-ink-soft)]">
        Type a question and let it fall. If it lands near the black flower, Cloud 9 answers from its cache with no new API call. If not, it routes on to the Gemini moon. Land two of three in the cache.
      </p>

      <div ref={wrap} className="relative mt-4 h-[260px] w-full sm:h-[300px]">
        <canvas ref={canvas} aria-hidden="true" className="absolute inset-0 h-full w-full" />
      </div>

      {!over ? (
        <form
          className="mt-4 flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            drop(query);
          }}
        >
          <label htmlFor="garden-query" className="text-sm font-bold text-[var(--g-ink-faint)]">
            Your question
          </label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              id="garden-query"
              type="text"
              value={query}
              maxLength={80}
              autoComplete="off"
              onChange={(e) => setQuery(e.target.value)}
              placeholder="how do I reset my password"
              className="min-w-0 flex-1 rounded-2xl border border-[var(--g-mist)] bg-[var(--g-ground)] px-4 py-3 text-[var(--g-ink)] placeholder:text-[var(--g-ink-faint)]"
            />
            <button
              type="submit"
              disabled={!query.trim() || falling}
              className={`${styles.press} inline-flex items-center justify-center gap-2 rounded-full bg-[var(--g-clear)] px-5 py-3 font-semibold text-[var(--g-black)] hover:bg-white disabled:cursor-not-allowed disabled:opacity-45`}
            >
              <Icon name="arrowDown" size={18} />
              {falling ? "Falling" : "Let it fall"}
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-[var(--g-ink-faint)]">Or try:</span>
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                disabled={falling}
                onClick={() => drop(s)}
                className={`${styles.press} rounded-full border border-[var(--g-mist)] px-3 py-1.5 text-sm text-[var(--g-ink-soft)] hover:border-[var(--g-ink-faint)] hover:text-[var(--g-ink)] disabled:opacity-45`}
              >
                {s}
              </button>
            ))}
          </div>
        </form>
      ) : null}

      <div aria-live="polite" className="mt-5">
        {settled && (
          <div className="border-t border-[var(--g-mist)] pt-4">
            {last.result.kind === "hit" ? (
              <>
                <p className={`${styles.display} text-xl font-semibold text-[var(--g-clear)]`}>Served from the cache.</p>
                <p className="mt-1 text-[var(--g-ink-soft)]">
                  &ldquo;{last.query}&rdquo; landed beside the cached question &ldquo;{last.result.entry.query}&rdquo;.
                </p>
                <p className="mt-2 text-[var(--g-ink)]">{last.result.entry.answer}</p>
              </>
            ) : (
              <>
                <p className={`${styles.display} text-xl font-semibold text-[var(--g-moon)]`}>Routed to the Gemini moon.</p>
                <p className="mt-1 text-[var(--g-ink-soft)]">
                  {last.result.best
                    ? <>The nearest cached question was &ldquo;{last.result.best.query}&rdquo;, not close enough. A new API call answers it.</>
                    : <>Nothing in the cache shares a word with it. A new API call answers it.</>}
                </p>
                {!over && (
                  <button
                    type="button"
                    onClick={markHelpful}
                    disabled={planted === last.query}
                    className={`${styles.press} mt-3 inline-flex items-center gap-2 rounded-full border border-[var(--g-mist)] px-4 py-2 text-sm font-semibold text-[var(--g-ink-soft)] hover:border-[var(--g-ink-faint)] hover:text-[var(--g-ink)] disabled:opacity-60`}
                  >
                    <Icon name={planted === last.query ? "check" : "layers"} size={16} />
                    {planted === last.query ? "Stored in the cache. Ask it again and it lands." : "Mark the answer helpful (store it)"}
                  </button>
                )}
              </>
            )}
            <p className={`${styles.num} mt-2 text-sm text-[var(--g-ink-faint)]`}>
              lookup() similarity {last.result.score.toFixed(2)} {last.result.kind === "hit" ? "≥" : "<"} threshold {THRESHOLD.toFixed(2)}
            </p>
          </div>
        )}
      </div>

      {over && (
        <div className="mt-5 border-t border-[var(--g-mist)] pt-5">
          <GameEnd
            title={hits >= 2 ? `The cache held: ${hits} of ${ROUNDS} served.` : `The moon took most of it: ${hits} of ${ROUNDS} from the cache.`}
            line={
              hits >= 2
                ? "That is the saving Pragati built into Cloud 9: similar questions answered from Pinecone instead of a new Gemini call. Ask her how it works."
                : "In Cloud 9, an answer is stored only when a user marks it helpful, so the cache fills with what people need. Ask Pragati how she built it."
            }
            cta="Email Pragati about Cloud 9"
            onAgain={reset}
          />
        </div>
      )}

      <details className="mt-5 text-sm text-[var(--g-ink-soft)]">
        <summary className="cursor-pointer font-semibold text-[var(--g-ink-faint)] hover:text-[var(--g-ink)]">
          What is orbiting the flower ({cache.length})
        </summary>
        <ul className="mt-2 flex flex-col gap-1.5">
          {cache.map((c) => (
            <li key={c.query} className="flex items-start gap-2">
              <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--g-clear)]" />
              {c.query}
            </li>
          ))}
        </ul>
      </details>
      <p className="mt-3 text-xs text-[var(--g-ink-faint)]">{CACHE_DISCLAIMER}</p>
    </div>
  );
}
