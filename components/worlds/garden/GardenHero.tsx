"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icons";
import { profile } from "@/lib/content";
import { CopyAddress, EmailButton, SecondaryLinks } from "./Contact";
import {
  applyAction,
  cloudK,
  createScene,
  DT,
  pullOf,
  replayTo,
  step,
  type Action,
  type Gravity,
  type PlantKind,
  type Scene,
  type Variant,
} from "./field";
import { drawRain, drawStatic, INK, sizeCanvas } from "./render";
import styles from "./styles";

const STATIC_FRAMES = 420;

type NewAction = Action extends infer A ? (A extends Action ? Omit<A, "frame"> : never) : never;

type Tool = { kind: "cloud"; color: Gravity } | { kind: "plant"; what: PlantKind };

type Label = { id: string; text: string; d: string; color: string };

type Pt = [number, number];

/** A curve through three points, slid sideways to stay inside the garden. */
function curve(w: number, pts: [Pt, Pt, Pt]): string {
  const xs = pts.map((p) => p[0]);
  const lo = Math.min(...xs);
  const hi = Math.max(...xs);
  const shift = lo < 6 ? 6 - lo : hi > w - 6 ? w - 6 - hi : 0;
  const [a, m, b] = pts.map(([x, y]) => [x + shift, y] as Pt);
  // Control point chosen so the quadratic passes through m.
  const cx = 2 * m[0] - (a[0] + b[0]) / 2;
  const cy = 2 * m[1] - (a[1] + b[1]) / 2;
  const f = (n: number) => n.toFixed(1);
  return `M ${f(a[0])} ${f(a[1])} Q ${f(cx)} ${f(cy)} ${f(b[0])} ${f(b[1])}`;
}

const textLen = (t: string) => t.length * 7.4;

function labelsFor(scene: Scene): Label[] {
  const out: Label[] = [];
  const { w } = scene;
  const add = (id: string, text: string, color: string, pts: [Pt, Pt, Pt]) => out.push({ id, text, color, d: curve(w, pts) });

  // Labels rise or fall toward the thing they name; only the legend stays level.
  const compact = scene.variant === "compact";
  const m = scene.moon;
  if (compact) {
    const mt = "Gemini moon";
    const hw = textLen(mt) * 0.62;
    add("moon", mt, "#ecdfae", [
      [m.x - hw, m.y + m.r * 1.7],
      [m.x, m.y + m.r * 2.7],
      [m.x + hw, m.y + m.r * 1.7],
    ]);
  } else {
    const mt = "Gemini, the far moon";
    const ml = textLen(mt);
    add("moon", mt, "#ecdfae", [
      [m.x - ml - m.r * 1.2, m.y + m.r * 2.6],
      [m.x - ml * 0.45 - m.r * 1.2, m.y + m.r * 2.3],
      [m.x - m.r * 1.1, m.y + m.r * 0.9],
    ]);
  }

  const p = scene.ponds[0];
  const pt = "the floating pond";
  const phw = Math.max(p.rx, textLen(pt) * 0.62);
  add("pond", pt, INK.blue, [
    [p.x - phw, p.y - p.ry - 8],
    [p.x, p.y - p.ry - 24],
    [p.x + phw, p.y - p.ry - 8],
  ]);

  const fox = scene.bodies.find((b) => b.kind === "fox");
  if (fox) {
    const ft = "a sleeping fox";
    const hw = Math.max(fox.r * 1.8, textLen(ft) * 0.6);
    add("fox", ft, INK.red, [
      [fox.x - hw, fox.y - fox.r * 0.4],
      [fox.x, fox.y - fox.r * 2.1],
      [fox.x + hw, fox.y - fox.r * 0.4],
    ]);
  }

  const f = scene.flowers[0];
  const flt = "the cache flower";
  const fhw = Math.max(f.ring * 1.5, textLen(flt) * 0.6);
  add("flower", flt, INK.clear, [
    [f.x - fhw, f.y + f.ring * 1.0],
    [f.x, f.y + f.ring * 1.7],
    [f.x + fhw, f.y + f.ring * 1.0],
  ]);

  const k = cloudK(scene.s);
  for (const c of scene.clouds.filter((x) => !x.user)) {
    const verb = c.color === "blue" ? "rain rises" : c.color === "red" ? "rain bends" : "rain orbits";
    const text = compact ? verb : `${c.color} cloud: ${verb}`;
    const len = textLen(text);
    const pts: [Pt, Pt, Pt] =
      compact
        ? [
            [c.x - len * 0.6, c.y - k * 1.8],
            [c.x, c.y - k * 3.4],
            [c.x + len * 0.6, c.y - k * 1.8],
          ]
        : c.color === "blue"
        ? [
            [c.x - len * 1.05, c.y + k * 3.8],
            [c.x - len * 0.4, c.y + k * 3.5],
            [c.x + k * 0.2, c.y + k * 1.9],
          ]
        : c.color === "red"
          ? [
              [c.x - len * 1.08 - k, c.y - k * 3.6],
              [c.x - len * 0.45 - k, c.y - k * 3.4],
              [c.x - k * 0.8, c.y - k * 1.9],
            ]
          : [
              [c.x - len * 0.58, c.y - k * 1.7],
              [c.x, c.y - k * 3.3],
              [c.x + len * 0.58, c.y - k * 1.7],
            ];
    add(`cloud-${c.id}`, text, INK[c.color], pts);
  }
  return out;
}

function tiltFromDrag(color: Gravity, dx: number, dy: number) {
  const len = Math.hypot(dx, dy);
  if (len < 14) return 0;
  const t = color === "blue" ? Math.atan2(dx, -dy) : Math.atan2(-dx, dy);
  return Math.max(-1.3, Math.min(1.3, t));
}

export function GardenHero() {
  const wrap = useRef<HTMLDivElement>(null);
  const staticRef = useRef<HTMLCanvasElement>(null);
  const rainRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<Scene | null>(null);
  const logRef = useRef<Action[]>([]);
  const cursorRef = useRef(0);
  const reducedRef = useRef(false);
  const visibleRef = useRef(true);
  const selectedRef = useRef<number | null>(null);
  const drawnRef = useRef({ version: -1, selected: -2 as number | null });
  const sizeRef = useRef({ w: 0, h: 0, variant: "compact" as Variant, max: 110 });
  const ctxRef = useRef<{ s: CanvasRenderingContext2D; r: CanvasRenderingContext2D } | null>(null);
  const kickRef = useRef<() => void>(() => {});

  const [tool, setTool] = useState<Tool>({ kind: "cloud", color: "blue" });
  const [selected, setSelected] = useState<{ id: number; color: Gravity } | null>(null);
  const [tilt, setTilt] = useState(0);
  const [counts, setCounts] = useState({ cached: 0, gemini: 0 });
  const [labels, setLabels] = useState<Label[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [cursor, setCursor] = useState<{ nx: number; ny: number } | null>(null);
  const [drag, setDrag] = useState<{ x0: number; y0: number; x: number; y: number } | null>(null);
  const [replaying, setReplaying] = useState(false);
  const [note, setNote] = useState("");

  const paintStatic = useCallback((force = false) => {
    const scene = sceneRef.current;
    const ctx = ctxRef.current;
    if (!scene || !ctx) return;
    const sel = selectedRef.current;
    if (!force && drawnRef.current.version === scene.version && drawnRef.current.selected === sel) return;
    drawStatic(ctx.s, scene, sel);
    drawnRef.current = { version: scene.version, selected: sel };
  }, []);

  /** Under reduced motion: rebuild deterministically and paint one calm frame. */
  const paintStill = useCallback(() => {
    const { w, h, variant, max } = sizeRef.current;
    const ctx = ctxRef.current;
    if (!w || !ctx) return;
    ctx.r.clearRect(0, 0, w, h);
    const scene = replayTo(w, h, variant, max, logRef.current, STATIC_FRAMES, (s) => drawRain(ctx.r, s, 0.05));
    sceneRef.current = scene;
    cursorRef.current = logRef.current.length;
    paintStatic(true);
    setCounts({ cached: scene.cached, gemini: scene.gemini });
  }, [paintStatic]);

  const rebuild = useCallback(() => {
    const { w, h, variant, max } = sizeRef.current;
    const ctx = ctxRef.current;
    if (!w || !ctx) return;
    if (reducedRef.current) {
      paintStill();
    } else {
      sceneRef.current = createScene(w, h, variant, max);
      cursorRef.current = 0;
      ctx.r.clearRect(0, 0, w, h);
      paintStatic(true);
    }
    setLabels(labelsFor(sceneRef.current!));
  }, [paintStatic, paintStill]);

  // Size, observe, loop.
  useEffect(() => {
    const el = wrap.current;
    const sc = staticRef.current;
    const rc = rainRef.current;
    if (!el || !sc || !rc) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedRef.current = mq.matches;

    const resize = () => {
      const r = el.getBoundingClientRect();
      const w = Math.round(r.width);
      const h = Math.round(r.height);
      if (!w || !h || (w === sizeRef.current.w && h === sizeRef.current.h)) return;
      const variant: Variant = w >= 1000 ? "wide" : "compact";
      sizeRef.current = { w, h, variant, max: w < 700 ? 110 : 230 };
      ctxRef.current = { s: sizeCanvas(sc, w, h), r: sizeCanvas(rc, w, h) };
      setSize({ w, h });
      rebuild();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    resize();

    let raf = 0;
    let last = 0;
    let acc = 0;
    let lastCount = 0;
    const loop = (t: number) => {
      raf = 0;
      const scene = sceneRef.current;
      const ctx = ctxRef.current;
      if (!scene || !ctx || reducedRef.current || !visibleRef.current || document.hidden) return;
      const dt = last ? Math.min(0.1, (t - last) / 1000) : DT;
      last = t;
      acc += dt;
      let n = 0;
      const log = logRef.current;
      while (acc >= DT && n < 3) {
        while (cursorRef.current < log.length && log[cursorRef.current].frame <= scene.frame) {
          applyAction(scene, log[cursorRef.current++]);
        }
        step(scene);
        acc -= DT;
        n++;
      }
      if (n === 3) acc = 0;
      paintStatic();
      drawRain(ctx.r, scene);
      if (t - lastCount > 300) {
        lastCount = t;
        setCounts((c) => (c.cached === scene.cached && c.gemini === scene.gemini ? c : { cached: scene.cached, gemini: scene.gemini }));
        setReplaying(cursorRef.current < log.length);
      }
      raf = requestAnimationFrame(loop);
    };
    const kick = () => {
      if (raf || reducedRef.current) return;
      last = 0;
      raf = requestAnimationFrame(loop);
    };
    kickRef.current = kick;

    const io = new IntersectionObserver(([e]) => {
      visibleRef.current = e.isIntersecting;
      if (e.isIntersecting) kick();
    });
    io.observe(el);
    const onVis = () => !document.hidden && kick();
    document.addEventListener("visibilitychange", onVis);
    const onMq = () => {
      reducedRef.current = mq.matches;
      rebuild();
      kick();
    };
    mq.addEventListener("change", onMq);
    kick();
    return () => {
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      mq.removeEventListener("change", onMq);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [rebuild, paintStatic]);

  const act = useCallback(
    (a: NewAction) => {
      const scene = sceneRef.current;
      if (!scene) return null;
      const log = logRef.current;
      // Acting during a replay branches the timeline here.
      if (cursorRef.current < log.length) log.length = cursorRef.current;
      const action = { ...a, frame: reducedRef.current ? 0 : scene.frame } as Action;
      log.push(action);
      if (log.length > 400) log.shift();
      cursorRef.current = log.length;
      let id: number | null = null;
      if (reducedRef.current) {
        paintStill();
        if (action.kind === "cloud") id = sceneRef.current!.clouds[sceneRef.current!.clouds.length - 1]?.id ?? null;
        else if (action.kind === "tilt") id = action.cloudId;
      } else {
        id = applyAction(scene, action);
        paintStatic();
      }
      return id;
    },
    [paintStatic, paintStill]
  );

  const select = useCallback(
    (id: number | null) => {
      selectedRef.current = id;
      const c = sceneRef.current?.clouds.find((x) => x.id === id);
      setSelected(c ? { id: c.id, color: c.color } : null);
      setTilt(c ? Math.round((c.tilt * 180) / Math.PI) : 0);
      paintStatic(true);
    },
    [paintStatic]
  );

  const applyToolAt = useCallback(
    (x: number, y: number, dx = 0, dy = 0) => {
      const scene = sceneRef.current;
      if (!scene) return;
      const { w, h } = sizeRef.current;
      if (tool.kind === "cloud") {
        const k = cloudK(scene.s);
        const hit = Math.hypot(dx, dy) < 8 ? scene.clouds.find((c) => Math.hypot(c.x - x, (c.y - y) * 1.4) < k * 2) : undefined;
        if (hit) {
          select(hit.id);
          setNote(`Selected the ${hit.color} cloud. Use the tilt control or the [ and ] keys to turn its pull.`);
          return;
        }
        const t = tiltFromDrag(tool.color, dx, dy);
        const id = act({ kind: "cloud", nx: x / w, ny: y / h, color: tool.color, tilt: t });
        select(id);
        setNote(`Painted a ${tool.color} cloud. Its rain ${tool.color === "blue" ? "rises" : tool.color === "red" ? "falls and bends" : "orbits the nearest black flower"}.`);
      } else {
        act({ kind: "plant", what: tool.what, nx: x / w, ny: y / h });
        setNote(tool.what === "flower" ? "Planted a black flower. Rain that lands near it is served from the cache." : "Planted a stone. Rain bends around it.");
      }
    },
    [tool, act, select]
  );

  const changeTilt = useCallback(
    (deg: number) => {
      const id = selectedRef.current;
      if (id == null) return;
      const v = Math.max(-75, Math.min(75, deg));
      setTilt(v);
      act({ kind: "tilt", cloudId: id, tilt: (v * Math.PI) / 180 });
    },
    [act]
  );

  const replay = () => {
    select(null);
    if (reducedRef.current) {
      paintStill();
      setNote("Replayed. Same seed, same clouds, same rain.");
      return;
    }
    rebuild();
    setReplaying(logRef.current.length > 0);
    setNote("Replaying from the first drop. Same seed, same clouds, same rain.");
    kickRef.current();
  };

  const clear = () => {
    logRef.current = [];
    select(null);
    rebuild();
    setNote("The garden is back to its first three clouds.");
    kickRef.current();
  };

  const local = (e: React.PointerEvent) => {
    const r = wrap.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const sel = selected;

  return (
    <section aria-labelledby="hero-name" className={`${styles.sky} relative isolate overflow-hidden`}>
      <div className="relative mx-auto grid max-w-[1600px] lg:static lg:min-h-[calc(100svh-64px)] lg:grid-cols-[minmax(0,600px)_1fr]">
        {/* The level legend: who she is and how to reach her. */}
        <div className="relative z-10 flex flex-col px-5 pt-6 sm:px-8 lg:px-12 lg:pt-10 lg:pb-8">
          <div className="flex items-center gap-4 sm:gap-5">
            <Image
              src={profile.photo}
              alt="Portrait of Pragati Srivastava"
              width={96}
              height={96}
              priority
              className="h-[72px] w-[72px] shrink-0 rounded-full object-cover ring-1 ring-[var(--g-clear)]/40 ring-offset-4 ring-offset-[#38453f] sm:h-24 sm:w-24"
            />
            <h1 id="hero-name" className={`${styles.display} text-[clamp(2.3rem,5vw,3.9rem)] font-medium leading-[0.98] tracking-[-0.025em] text-balance`}>
              {profile.name}
            </h1>
          </div>
          <p className={`${styles.display} mt-5 text-[1.35rem] font-semibold leading-snug text-[var(--g-ink)] sm:text-2xl`}>
            {profile.role}
            <span className="font-normal text-[var(--g-ink-soft)]"> for {profile.focus}.</span>
          </p>
          <p className="mt-3 max-w-[54ch] text-[1.02rem] leading-relaxed text-[var(--g-ink-soft)]">{profile.summary}</p>
          <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-3">
            <EmailButton />
            <CopyAddress />
          </div>
          <div className="mt-3 -ml-3">
            <SecondaryLinks />
          </div>

          <Legend
            className="mt-auto hidden pt-6 lg:block"
            tool={tool}
            setTool={setTool}
            sel={sel ? { color: sel.color } : null}
            tilt={tilt}
            changeTilt={changeTilt}
            counts={counts}
            replay={replay}
            clear={clear}
            replaying={replaying}
          />
        </div>

        {/* The garden. Desktop: full-bleed behind the legend. Mobile: its own plot. */}
        <div
          ref={wrap}
          tabIndex={0}
          aria-label="Gravity-rain garden. Click or tap to paint a cloud or plant, drag while painting to tilt the cloud's pull. With the keyboard, arrow keys move the trowel, Enter paints or plants, and the [ and ] keys tilt the selected cloud."
          className={`${styles.canvasWrap} relative mt-6 h-[440px] w-full sm:h-[480px] lg:absolute lg:inset-0 lg:mt-0 lg:h-auto`}
          onPointerDown={(e) => {
            if (e.button !== 0) return;
            (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
            const p = local(e);
            setDrag({ x0: p.x, y0: p.y, x: p.x, y: p.y });
          }}
          onPointerMove={(e) => {
            if (!drag) return;
            const p = local(e);
            setDrag({ ...drag, x: p.x, y: p.y });
          }}
          onPointerUp={() => {
            if (!drag) return;
            applyToolAt(drag.x0, drag.y0, drag.x - drag.x0, drag.y - drag.y0);
            setDrag(null);
          }}
          onPointerCancel={() => setDrag(null)}
          onFocus={() => setCursor((c) => c ?? { nx: sizeRef.current.variant === "wide" ? 0.7 : 0.5, ny: 0.4 })}
          onBlur={() => setCursor(null)}
          onKeyDown={(e) => {
            const stepN = 0.035;
            const c = cursor ?? { nx: 0.5, ny: 0.4 };
            const move = (dx: number, dy: number) => {
              e.preventDefault();
              setCursor({ nx: Math.max(0.02, Math.min(0.98, c.nx + dx)), ny: Math.max(0.04, Math.min(0.9, c.ny + dy)) });
            };
            if (e.key === "ArrowLeft") move(-stepN, 0);
            else if (e.key === "ArrowRight") move(stepN, 0);
            else if (e.key === "ArrowUp") move(0, -stepN);
            else if (e.key === "ArrowDown") move(0, stepN);
            else if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              applyToolAt(c.nx * size.w, c.ny * size.h, 0, 0);
            } else if (e.key === "[") changeTilt(tilt - 10);
            else if (e.key === "]") changeTilt(tilt + 10);
          }}
        >
          <canvas ref={staticRef} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" />
          <canvas ref={rainRef} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" />
          {size.w > 0 && (
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
              viewBox={`0 0 ${size.w} ${size.h}`}
            >
              {labels.map((l) => (
                <g key={l.id}>
                  <path id={`gl-${l.id}`} d={l.d} fill="none" />
                  <text fill={l.color} fontSize="13" className={styles.bentText} style={{ fontWeight: 600, letterSpacing: "0.02em" }}>
                    <textPath href={`#gl-${l.id}`} startOffset="50%" textAnchor="middle">
                      {l.text}
                    </textPath>
                  </text>
                </g>
              ))}
              {drag && tool.kind === "cloud" && Math.hypot(drag.x - drag.x0, drag.y - drag.y0) > 14 && (
                <PullPreview x={drag.x0} y={drag.y0} color={tool.color} tilt={tiltFromDrag(tool.color, drag.x - drag.x0, drag.y - drag.y0)} />
              )}
              {cursor && (
                <g transform={`translate(${cursor.nx * size.w} ${cursor.ny * size.h})`} stroke="#ecdfae" strokeWidth="1.5" fill="none">
                  <circle r="14" strokeDasharray="3 4" />
                  <path d="M -22 0 H -8 M 8 0 H 22 M 0 -22 V -8 M 0 8 V 22" />
                </g>
              )}
            </svg>
          )}
        </div>

        <Legend
          className="relative z-10 px-5 pb-10 pt-6 sm:px-8 lg:hidden"
          tool={tool}
          setTool={setTool}
          sel={sel ? { color: sel.color } : null}
          tilt={tilt}
          changeTilt={changeTilt}
          counts={counts}
          replay={replay}
          clear={clear}
          replaying={replaying}
        />
      </div>
      <p className="sr-only" aria-live="polite">
        {note}
      </p>
    </section>
  );
}

function PullPreview({ x, y, color, tilt }: { x: number; y: number; color: Gravity; tilt: number }) {
  const [ux, uy] = pullOf({ color, tilt });
  return (
    <g stroke={INK[color]} strokeWidth="1.5" fill="none">
      <circle cx={x} cy={y} r="16" strokeDasharray="3 4" />
      <path d={`M ${x} ${y} L ${x + ux * 70} ${y + uy * 70}`} strokeDasharray="4 5" />
      <circle cx={x + ux * 70} cy={y + uy * 70} r="3" fill={INK[color]} />
    </g>
  );
}

// Rounded so server and client print the same numbers.
const PETALS = [0, 1, 2, 3, 4, 5].map((i) => [
  Math.round((7 + Math.cos((i * Math.PI) / 3) * 3.4) * 100) / 100,
  Math.round((7 + Math.sin((i * Math.PI) / 3) * 3.4) * 100) / 100,
]);

const CLOUD_CHOICES: { color: Gravity; name: string; rule: string }[] = [
  { color: "blue", name: "Blue cloud", rule: "rain rises toward the floating pond" },
  { color: "red", name: "Red cloud", rule: "rain falls and bends around what sleeps below" },
  { color: "clear", name: "Clear cloud", rule: "rain orbits the black flower and never lands" },
];

function Legend({
  className,
  tool,
  setTool,
  sel,
  tilt,
  changeTilt,
  counts,
  replay,
  clear,
  replaying,
}: {
  className: string;
  tool: Tool;
  setTool: (t: Tool) => void;
  sel: { color: Gravity } | null;
  tilt: number;
  changeTilt: (d: number) => void;
  counts: { cached: number; gemini: number };
  replay: () => void;
  clear: () => void;
  replaying: boolean;
}) {
  const chip = (active: boolean) =>
    `${styles.press} inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[13.5px] font-semibold ${
      active ? "border-[var(--g-moon)] bg-[var(--g-moon)]/12 text-[var(--g-ink)]" : "border-[var(--g-mist)] text-[var(--g-ink-soft)] hover:border-[var(--g-ink-faint)]"
    }`;
  return (
    <div className={className}>
      <div className="max-w-[520px] rounded-[22px] border border-[var(--g-mist)] bg-[#28312d] px-5 py-4">
        <p className={`${styles.display} text-[1.05rem] font-semibold text-[var(--g-ink)]`}>Legend: every cloud is a client</p>
        <p className="mt-0.5 text-sm leading-snug text-[var(--g-ink-soft)]">
          Each drop is a request. Near a black flower it is served from the cache; anywhere else it routes to the far Gemini moon. Paint a cloud (drag to tilt its pull) or plant something.
        </p>
        <fieldset className="mt-3">
          <legend className="sr-only">Paint a cloud or plant</legend>
          <div className="flex flex-wrap gap-1.5">
            {CLOUD_CHOICES.map((c) => (
              <button
                key={c.color}
                type="button"
                aria-pressed={tool.kind === "cloud" && tool.color === c.color}
                title={`${c.name}: ${c.rule}`}
                onClick={() => setTool({ kind: "cloud", color: c.color })}
                className={chip(tool.kind === "cloud" && tool.color === c.color)}
              >
                <svg aria-hidden="true" width="18" height="12" viewBox="0 0 18 12">
                  <g fill={INK[c.color]} fillOpacity="0.4" stroke={INK[c.color]}>
                    <circle cx="5" cy="7" r="3.5" />
                    <circle cx="9.5" cy="5" r="4.2" />
                    <circle cx="13.6" cy="7.2" r="3.2" />
                  </g>
                </svg>
                {c.name.replace(" cloud", "")}
                <span className="sr-only"> cloud</span>
              </button>
            ))}
            <button type="button" title="Black flower: a cache; rain that lands near it is served from the cache" aria-pressed={tool.kind === "plant" && tool.what === "flower"} onClick={() => setTool({ kind: "plant", what: "flower" })} className={chip(tool.kind === "plant" && tool.what === "flower")}>
              <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14">
                <g fill="#0b0e0c" stroke="#c8d6cc" strokeWidth="0.7">
                  {PETALS.map(([x, y], i) => (
                    <ellipse key={i} cx={x} cy={y} rx="2.8" ry="1.5" transform={`rotate(${i * 60} ${x} ${y})`} />
                  ))}
                </g>
              </svg>
              <span className="sr-only">Plant a </span>Black flower
            </button>
            <button type="button" title="Stone: rain bends around it" aria-pressed={tool.kind === "plant" && tool.what === "stone"} onClick={() => setTool({ kind: "plant", what: "stone" })} className={chip(tool.kind === "plant" && tool.what === "stone")}>
              <svg aria-hidden="true" width="14" height="12" viewBox="0 0 14 12">
                <ellipse cx="7" cy="6.5" rx="6" ry="4.8" fill="#77837b" />
              </svg>
              <span className="sr-only">Plant a </span>Stone
            </button>
          </div>
        </fieldset>
        <label className="mt-3 flex items-center gap-3 text-sm font-semibold text-[var(--g-ink-soft)]">
          <span className="shrink-0">{sel ? `Tilt the ${sel.color} cloud` : "Tilt (select a cloud)"}</span>
          <input
            type="range"
            min={-75}
            max={75}
            step={5}
            value={tilt}
            disabled={!sel}
            onChange={(e) => changeTilt(Number(e.target.value))}
            className={`${styles.range} min-w-0 flex-1 disabled:opacity-40`}
            aria-valuetext={sel ? `${tilt} degrees` : "Select a cloud first"}
          />
          <span className={`${styles.num} w-10 text-right`}>{sel ? `${tilt}°` : "--"}</span>
        </label>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--g-mist)] pt-3">
          <dl className={`${styles.num} flex gap-5 text-sm`}>
            <div className="flex items-baseline gap-2">
              <dt className="text-[var(--g-ink-faint)]">From the cache</dt>
              <dd className="text-base font-semibold text-[var(--g-clear)]">{counts.cached}</dd>
            </div>
            <div className="flex items-baseline gap-2">
              <dt className="text-[var(--g-ink-faint)]">To Gemini</dt>
              <dd className="text-base font-semibold text-[var(--g-moon)]">{counts.gemini}</dd>
            </div>
          </dl>
          <div className="flex gap-1.5">
            <button type="button" onClick={replay} className={chip(replaying)}>
              <Icon name="replay" size={15} />
              {replaying ? "Replaying" : "Replay"}
            </button>
            <button type="button" onClick={clear} className={chip(false)}>
              <Icon name="x" size={15} />
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
