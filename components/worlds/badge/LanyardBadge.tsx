"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent, type MouseEvent, type PointerEvent } from "react";
import { Icon } from "@/components/icons";
import { links, profile } from "@/lib/content";
import { encodeQr, qrPath } from "./qr";

// Geometry in CSS px, origin at the stage's horizontal centre and top edge.
// The same numbers are mirrored as CSS custom properties in badge.css.
type Geom = {
  spread: number; // half the gap between the two lanyard strands at the top edge
  anchorY: number; // strands start above the top edge
  drop: number; // y of the crimp where both strands meet
  clip: number; // crimp to card slot (metal clip length)
  cardW: number;
  cardH: number;
  slotY: number; // slot centre, from the card's top edge
  ribbon: number; // ribbon width
};
const WIDE: Geom = { spread: 36, anchorY: -70, drop: 214, clip: 46, cardW: 300, cardH: 440, slotY: 26, ribbon: 22 };
const NARROW: Geom = { spread: 26, anchorY: -50, drop: 66, clip: 34, cardW: 216, cardH: 318, slotY: 20, ribbon: 16 };
const NARROW_QUERY = "(max-width: 899px)";

const SEGMENTS = 12;
const GRAVITY = 2400; // px/s²
const STEP = 1 / 120;
const ITERATIONS = 14;
const DAMPING = 0.993;
const PRINT = "PRAGATI SRIVASTAVA · BACKEND · TEAM LEAD · ";

type Pt = { x: number; y: number; px: number; py: number; w: number };
type Link = { a: number; b: number; len: number; slack: boolean };
type Sim = { pts: Pt[]; links: Link[]; strands: number[][]; c: number; a: number; b: number; geom: Geom };

function strandLength(g: Geom) {
  return Math.hypot(g.spread, g.drop - g.anchorY);
}

function buildSim(g: Geom): Sim {
  const pts: Pt[] = [];
  const linksArr: Link[] = [];
  const strands: number[][] = [];
  const seg = strandLength(g) / SEGMENTS;
  const c = SEGMENTS * 2;
  for (const side of [-1, 1]) {
    const ax = side * g.spread;
    const idx: number[] = [];
    for (let i = 0; i < SEGMENTS; i++) {
      const t = i / SEGMENTS;
      const x = ax * (1 - t);
      const y = g.anchorY + (g.drop - g.anchorY) * t;
      idx.push(pts.length);
      pts.push({ x, y, px: x, py: y, w: i === 0 ? 0 : 1 });
    }
    strands.push(idx);
  }
  pts.push({ x: 0, y: g.drop, px: 0, py: g.drop, w: 0.6 });
  const ay = g.drop + g.clip;
  const by = ay + (g.cardH - g.slotY);
  pts.push({ x: 0, y: ay, px: 0, py: ay, w: 0.2 });
  pts.push({ x: 0, y: by, px: 0, py: by, w: 0.2 });
  for (const idx of strands) {
    const chain = [...idx, c];
    for (let i = 0; i < chain.length - 1; i++) linksArr.push({ a: chain[i], b: chain[i + 1], len: seg, slack: true });
  }
  linksArr.push({ a: c, b: c + 1, len: g.clip, slack: false });
  linksArr.push({ a: c + 1, b: c + 2, len: g.cardH - g.slotY, slack: false });
  return { pts, links: linksArr, strands, c, a: c + 1, b: c + 2, geom: g };
}

function smoothPath(points: { x: number; y: number }[]): string {
  let d = `M${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
  for (let i = 1; i < points.length - 1; i++) {
    const p = points[i];
    const n = points[i + 1];
    d += ` Q${p.x.toFixed(1)} ${p.y.toFixed(1)} ${((p.x + n.x) / 2).toFixed(1)} ${((p.y + n.y) / 2).toFixed(1)}`;
  }
  const last = points[points.length - 1];
  return d + ` L${last.x.toFixed(1)} ${last.y.toFixed(1)}`;
}

/** Left strand runs top to crimp, right strand runs crimp to top: the print reads round the loop. */
function strandPoints(sim: Sim, side: 0 | 1) {
  const chain = [...sim.strands[side], sim.c].map((i) => sim.pts[i]);
  return side === 0 ? chain : chain.reverse();
}

function restPaths(g: Geom): [string, string] {
  const sim = buildSim(g);
  return [smoothPath(strandPoints(sim, 0)), smoothPath(strandPoints(sim, 1))];
}

const QR = encodeQr(`mailto:${links.email}`);
const QR_D = qrPath(QR);
const QR_N = QR.length;

type LanyardRefs = {
  paths: (SVGPathElement | null)[]; // per strand: shadow, edge, face, weave(ref'd by textPath)
  clip: SVGGElement | null;
};

function Lanyard({ g, kind }: { g: Geom; kind: "wide" | "narrow" }) {
  const uid = useId().replace(/:/g, "");
  const [dl, dr] = restPaths(g);
  const restAngle = 0;
  const print = PRINT.repeat(8);
  const strands = [dl, dr];
  return (
    <>
      <svg className="badge-ropes" data-kind={kind} aria-hidden="true" width="1" height="1">
        <defs>
          <pattern id={`weave-${uid}`} width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
            <rect width="4" height="2" fill="rgba(11,31,58,0.10)" />
          </pattern>
          <filter id={`soft-${uid}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>
        {strands.map((d, i) => (
          <g key={i}>
            <path
              data-strand={i}
              data-layer="0"
              d={d}
              transform="translate(4 6)"
              stroke="rgba(2,8,20,0.55)"
              strokeWidth={g.ribbon}
              fill="none"
              filter={`url(#soft-${uid})`}
            />
            <path
              data-strand={i}
              data-layer="1"
              d={d}
              stroke="#C94F08"
              strokeWidth={g.ribbon}
              fill="none"
            />
            <path
              data-strand={i}
              data-layer="2"
              d={d}
              stroke="#FF6A13"
              strokeWidth={g.ribbon - 4}
              fill="none"
            />
            <path
              id={`strand-${uid}-${i}`}
              data-strand={i}
              data-layer="3"
              d={d}
              stroke={`url(#weave-${uid})`}
              strokeWidth={g.ribbon - 4}
              fill="none"
            />
            <text className="badge-rope-print" fontSize={g.ribbon * 0.46} dy={g.ribbon * 0.16}>
              <textPath href={`#strand-${uid}-${i}`} startOffset={i === 0 ? 4 : 12}>
                {print}
              </textPath>
            </text>
          </g>
        ))}
      </svg>
      <svg className="badge-clip" data-kind={kind} aria-hidden="true" width="1" height="1">
        <defs>
          <linearGradient id={`metal-${uid}`} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#7C8794" />
            <stop offset="0.35" stopColor="#E9EDF1" />
            <stop offset="0.6" stopColor="#B7C0CA" />
            <stop offset="1" stopColor="#5E6976" />
          </linearGradient>
        </defs>
        <g
          data-clip-group=""
          transform={`translate(0 ${g.drop}) rotate(${restAngle})`}
        >
          <ClipShape g={g} metal={`url(#metal-${uid})`} />
        </g>
      </svg>
    </>
  );
}

/** Crimp end, swivel, and a bulldog clip whose tongue passes through the card slot. */
function ClipShape({ g, metal }: { g: Geom; metal: string }) {
  const k = g.clip;
  const w = g.ribbon * 1.5;
  const crimpH = k * 0.28;
  return (
    <g>
      <rect x={-w / 2} y={-crimpH * 0.7} width={w} height={crimpH} rx={2} fill={metal} stroke="#3E4955" strokeWidth={0.8} />
      <line x1={-w / 2 + 3} x2={w / 2 - 3} y1={-crimpH * 0.2} y2={-crimpH * 0.2} stroke="#5E6976" strokeWidth={0.8} />
      <circle cx={0} cy={crimpH * 0.55} r={k * 0.1} fill="none" stroke={metal} strokeWidth={2.4} />
      <circle cx={0} cy={crimpH * 0.55} r={k * 0.1} fill="none" stroke="#3E4955" strokeWidth={0.6} />
      <path
        d={`M${-k * 0.17} ${k * 0.42} h${k * 0.34} l${k * 0.06} ${k * 0.42} q0 ${k * 0.14} ${-k * 0.12} ${k * 0.14} h${-k * 0.22} q${-k * 0.12} 0 ${-k * 0.12} ${-k * 0.14} z`}
        fill={metal}
        stroke="#3E4955"
        strokeWidth={0.8}
      />
      <rect x={-k * 0.09} y={k * 0.86} width={k * 0.18} height={k * 0.2} rx={1} fill="#4B5662" />
    </g>
  );
}

export function LanyardBadge() {
  const [flipped, setFlipped] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const frontBtnRef = useRef<HTMLButtonElement>(null);
  const backFirstRef = useRef<HTMLAnchorElement>(null);
  const simRef = useRef<Sim | null>(null);
  const wakeRef = useRef<() => void>(() => {});
  const motionRef = useRef(false);
  const dragRef = useRef<{ id: number; t: number; tx: number; ty: number; sx: number; sy: number; moved: boolean } | null>(
    null
  );
  const suppressClickRef = useRef(false);
  const firstFlip = useRef(true);

  // Physics loop: builds the sim for the active breakpoint, sleeps when settled,
  // pauses off-screen or in a hidden tab, and never runs under reduced motion.
  useEffect(() => {
    const stage = stageRef.current;
    const card = cardRef.current;
    if (!stage || !card) return;
    const narrowMq = window.matchMedia(NARROW_QUERY);
    const reduceMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;
    let last = 0;
    let acc = 0;
    let still = 0;
    let visible = true;
    let running = false;

    const collect = (kind: "wide" | "narrow"): LanyardRefs => {
      const paths: SVGPathElement[] = [];
      stage.querySelectorAll<SVGPathElement>(`.badge-ropes[data-kind="${kind}"] path[data-strand]`).forEach((el) => {
        paths[Number(el.dataset.strand) * 4 + Number(el.dataset.layer)] = el;
      });
      return { paths, clip: stage.querySelector<SVGGElement>(`.badge-clip[data-kind="${kind}"] [data-clip-group]`) };
    };
    const wideRefs = collect("wide");
    const narrowRefs = collect("narrow");
    const activeRefs = () => (narrowMq.matches ? narrowRefs : wideRefs);

    const render = () => {
      const sim = simRef.current;
      if (!sim) return;
      const g = sim.geom;
      const A = sim.pts[sim.a];
      const B = sim.pts[sim.b];
      const C = sim.pts[sim.c];
      const ang = Math.atan2(B.y - A.y, B.x - A.x) - Math.PI / 2;
      card.style.transform = `translate3d(${A.x.toFixed(2)}px, ${(A.y - (g.drop + g.clip)).toFixed(2)}px, 0) rotate(${ang.toFixed(4)}rad)`;
      card.style.setProperty("--badge-tilt", `${((ang * 180) / Math.PI).toFixed(1)}`);
      const r = activeRefs();
      const angC = (Math.atan2(A.y - C.y, A.x - C.x) - Math.PI / 2) * (180 / Math.PI);
      r.clip?.setAttribute("transform", `translate(${C.x.toFixed(2)} ${C.y.toFixed(2)}) rotate(${angC.toFixed(2)})`);
      for (const side of [0, 1] as const) {
        const d = smoothPath(strandPoints(sim, side));
        for (let k = 0; k < 4; k++) r.paths[side * 4 + k]?.setAttribute("d", d);
      }
    };

    const step = (sim: Sim) => {
      const g = sim.geom;
      for (const p of sim.pts) {
        if (p.w === 0) continue;
        let vx = (p.x - p.px) * DAMPING;
        let vy = (p.y - p.py) * DAMPING;
        const sp = Math.hypot(vx, vy);
        if (sp > 36) {
          vx *= 36 / sp;
          vy *= 36 / sp;
        }
        p.px = p.x;
        p.py = p.y;
        p.x += vx;
        p.y += vy + GRAVITY * STEP * STEP;
      }
      const drag = dragRef.current;
      for (let it = 0; it < ITERATIONS; it++) {
        for (const l of sim.links) {
          const a = sim.pts[l.a];
          const b = sim.pts[l.b];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const d = Math.hypot(dx, dy) || 0.0001;
          if (l.slack && d <= l.len) continue;
          const wsum = a.w + b.w;
          if (wsum === 0) continue;
          const diff = (d - l.len) / d / wsum;
          a.x += dx * diff * a.w;
          a.y += dy * diff * a.w;
          b.x -= dx * diff * b.w;
          b.y -= dy * diff * b.w;
        }
        if (drag) {
          const A = sim.pts[sim.a];
          const B = sim.pts[sim.b];
          const t = drag.t;
          // Keep the target within reach of the lanyard.
          const reach = strandLength(g) + g.clip + t * (g.cardH - g.slotY) + 12;
          let tx = drag.tx;
          let ty = drag.ty;
          const ox = tx;
          const oy = ty - g.anchorY;
          const od = Math.hypot(ox, oy);
          if (od > reach) {
            tx = (ox / od) * reach;
            ty = g.anchorY + (oy / od) * reach;
          }
          const gx = A.x + (B.x - A.x) * t;
          const gy = A.y + (B.y - A.y) * t;
          const k = 1 / ((1 - t) * (1 - t) + t * t);
          const dx = (tx - gx) * k;
          const dy = (ty - gy) * k;
          A.x += dx * (1 - t);
          A.y += dy * (1 - t);
          B.x += dx * t;
          B.y += dy * t;
        }
      }
    };

    const frame = (now: number) => {
      const sim = simRef.current;
      if (!sim) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      acc += dt;
      let moved = 0;
      while (acc >= STEP) {
        step(sim);
        acc -= STEP;
      }
      for (const p of sim.pts) moved = Math.max(moved, Math.abs(p.x - p.px) + Math.abs(p.y - p.py));
      render();
      still = moved < 0.02 && !dragRef.current ? still + 1 : 0;
      if (still > 90 || !visible || document.hidden) {
        running = false;
        return;
      }
      raf = requestAnimationFrame(frame);
    };

    const wake = () => {
      if (!motionRef.current || running || !visible || document.hidden) return;
      running = true;
      still = 0;
      last = performance.now();
      acc = 0;
      raf = requestAnimationFrame(frame);
    };
    wakeRef.current = wake;

    const setup = (entrance: boolean) => {
      cancelAnimationFrame(raf);
      running = false;
      const g = narrowMq.matches ? NARROW : WIDE;
      simRef.current = buildSim(g);
      motionRef.current = !reduceMq.matches;
      // Reset both lanyards to rest, then draw the active one.
      for (const [r, geo] of [
        [wideRefs, WIDE],
        [narrowRefs, NARROW],
      ] as const) {
        const [dl, dr] = restPaths(geo);
        for (let k = 0; k < 4; k++) {
          r.paths[k]?.setAttribute("d", dl);
          r.paths[4 + k]?.setAttribute("d", dr);
        }
        r.clip?.setAttribute("transform", `translate(0 ${geo.drop}) rotate(0)`);
      }
      render();
      if (entrance && motionRef.current) {
        // Signature moment: the badge has just been hung on the hook and swings out, then settles.
        const sim = simRef.current;
        const kick = g === WIDE ? 4.2 : 2.6;
        sim.pts[sim.b].px -= kick;
        sim.pts[sim.a].px -= kick * 0.3;
        sim.pts[sim.c].px -= kick * 0.15;
        wake();
      }
    };

    setup(true);
    const onBreakpoint = () => setup(false);
    const onReduce = () => setup(false);
    narrowMq.addEventListener("change", onBreakpoint);
    reduceMq.addEventListener("change", onReduce);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) wake();
    });
    io.observe(stage);
    const onVis = () => {
      if (!document.hidden) wake();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      cancelAnimationFrame(raf);
      narrowMq.removeEventListener("change", onBreakpoint);
      reduceMq.removeEventListener("change", onReduce);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  const localPoint = (clientX: number, clientY: number) => {
    const origin = stageRef.current!.querySelector(".badge-origin")!.getBoundingClientRect();
    return { x: clientX - origin.left, y: clientY - origin.top };
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    const sim = simRef.current;
    if (!sim || !motionRef.current || e.button !== 0) return;
    if ((e.target as HTMLElement).closest("a")) return;
    const p = localPoint(e.clientX, e.clientY);
    const A = sim.pts[sim.a];
    const B = sim.pts[sim.b];
    const abx = B.x - A.x;
    const aby = B.y - A.y;
    const t = Math.min(1, Math.max(0, ((p.x - A.x) * abx + (p.y - A.y) * aby) / (abx * abx + aby * aby)));
    dragRef.current = { id: e.pointerId, t, tx: p.x, ty: p.y, sx: e.clientX, sy: e.clientY, moved: false };
    e.currentTarget.setPointerCapture(e.pointerId);
    e.currentTarget.dataset.dragging = "true";
    wakeRef.current();
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== e.pointerId) return;
    const p = localPoint(e.clientX, e.clientY);
    drag.tx = p.x;
    drag.ty = p.y;
    if (Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy) > 6) drag.moved = true;
    wakeRef.current();
  };

  const endDrag = (e: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== e.pointerId) return;
    suppressClickRef.current = drag.moved;
    dragRef.current = null;
    delete e.currentTarget.dataset.dragging;
    wakeRef.current();
  };

  const flip = useCallback(() => {
    setFlipped((f) => !f);
    const sim = simRef.current;
    if (sim && motionRef.current) {
      // A flip by hand gives the card a small twist on its clip.
      sim.pts[sim.b].px += 2.2;
      wakeRef.current();
    }
  }, []);

  const onClick = (e: MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("a")) return;
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }
    flip();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const sim = simRef.current;
    if (!sim || !motionRef.current) return;
    const push: Record<string, [number, number]> = {
      ArrowLeft: [-4, 0],
      ArrowRight: [4, 0],
      ArrowUp: [0, -6],
      ArrowDown: [0, 3],
    };
    const v = push[e.key];
    if (!v) return;
    e.preventDefault();
    const B = sim.pts[sim.b];
    const A = sim.pts[sim.a];
    B.px -= v[0];
    B.py -= v[1];
    A.px -= v[0] * 0.4;
    A.py -= v[1] * 0.6;
    wakeRef.current();
  };

  useEffect(() => {
    if (firstFlip.current) {
      firstFlip.current = false;
      return;
    }
    if (flipped) backFirstRef.current?.focus({ preventScroll: true });
    else frontBtnRef.current?.focus({ preventScroll: true });
  }, [flipped]);

  return (
    <div className="badge-stage" ref={stageRef}>
      <div className="badge-origin">
        <Lanyard g={WIDE} kind="wide" />
        <Lanyard g={NARROW} kind="narrow" />
        <div
          ref={cardRef}
          className="badge-card"
          data-flipped={flipped}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onClick={onClick}
          onKeyDown={onKeyDown}
        >
          <div className="badge-card-inner">
            <div className="badge-face badge-front" inert={flipped}>
              <button
                ref={frontBtnRef}
                type="button"
                className="badge-front-btn"
                aria-label={`${profile.name}, ${profile.role}. Team Lead, Smart India Hackathon 2026. Press Enter to flip the badge to contact links.`}
              >
                <span className="badge-band-top" aria-hidden="true">
                  <span className="badge-slot" />
                  <span className="badge-band-row">
                    <span className="badge-band-mark">Pragati.</span>
                    <span className="badge-band-handle">@Pragatisource08</span>
                  </span>
                </span>
                <span className="badge-photo-row">
                  <Image
                    src={profile.photo}
                    alt=""
                    width={140}
                    height={140}
                    className="badge-photo"
                    loading="eager"
                    fetchPriority="high"
                    draggable={false}
                  />
                  <span className="badge-foil" aria-hidden="true" />
                </span>
                <span className="badge-first">Pragati</span>
                <span className="badge-last">Srivastava</span>
                <span className="badge-role">{profile.role}</span>
                <span className="badge-event">Team Lead<span className="badge-dot" aria-hidden="true" />Smart India Hackathon 2026</span>
                <span className="badge-access" aria-hidden="true">
                  <span className="badge-access-label">Access</span>
                  {["A", "B", "C", "D", "E", "F", "G", "H"].map((z) => (
                    <span key={z} className="badge-access-box">
                      {z}
                    </span>
                  ))}
                </span>
              </button>
            </div>
            <div className="badge-face badge-back" inert={!flipped}>
              <span className="badge-band-top" aria-hidden="true">
                <span className="badge-slot" />
              </span>
              <p className="badge-back-title">If found, return to Pragati</p>
              <div className="badge-qr">
                <svg viewBox={`-2 -2 ${QR_N + 4} ${QR_N + 4}`} role="img" aria-label="QR code that opens an email to Pragati">
                  <rect x={-2} y={-2} width={QR_N + 4} height={QR_N + 4} fill="#F2F4F7" />
                  <path d={QR_D} fill="#0B1F3A" shapeRendering="crispEdges" />
                </svg>
                <span>Scan to email</span>
              </div>
              <a ref={backFirstRef} className="badge-back-email" href={links.mailto}>
                <Icon name="mail" size={18} />
                Email Pragati
              </a>
              <ul className="badge-back-links">
                <li>
                  <a href={links.linkedin} target="_blank" rel="noreferrer">
                    <Icon name="linkedin" size={18} />
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a href={links.github} target="_blank" rel="noreferrer">
                    <Icon name="github" size={18} />
                    GitHub
                  </a>
                </li>
                <li>
                  <a href={links.resume} target="_blank" rel="noreferrer">
                    <Icon name="resume" size={18} />
                    Resume
                  </a>
                </li>
              </ul>
              <button type="button" className="badge-back-flip">
                <Icon name="replay" size={16} />
                Show the front
              </button>
            </div>
          </div>
        </div>
      </div>
      <p className="badge-hint">
        <span className="badge-hint-motion">Drag the badge or nudge it with the arrow keys. </span>
        Click it, or press Enter, to flip it for contact links.
      </p>
    </div>
  );
}
