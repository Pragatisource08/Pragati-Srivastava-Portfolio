"use client";

import { useEffect, useRef, type RefObject } from "react";
import { createRng } from "@/lib/games/rng";
import { useActive, useFrame, useReducedMotionPref, type Hour } from "./shared";

// Time-indexed city: windows switch on and off by a hash of (window, time slot),
// trains run on the river bridge, and the river band mirrors the skyline band.
// Colours are read every frame from the page root's registered custom properties,
// so a change of hour cross-fades here exactly as it does in the CSS.

type Tower = {
  x: number;
  w: number;
  h: number;
  layer: 0 | 1;
  roof: number;
  seed: number;
  silver: boolean;
};

type Palette = {
  skyHi: string;
  skyLo: string;
  tower: string;
  towerFar: string;
  window: string;
  silver: string;
  water: string;
  rail: string;
  lit: number;
  rain: number;
  dawn: number;
  reflect: number;
};

const INTRO_MS = 2600;
const BRIDGE = 12; // px from the bottom of the skyline band to the deck

function hash(n: number) {
  let x = Math.imul((n | 0) ^ 0x9e3779b9, 0x85ebca6b);
  x ^= x >>> 13;
  x = Math.imul(x, 0xc2b2ae35);
  x ^= x >>> 16;
  return (x >>> 0) / 4294967296;
}

function buildCity(W: number, H: number, compact: boolean): Tower[] {
  const rng = createRng(2026);
  const out: Tower[] = [];
  const usable = H - BRIDGE;
  const scale = compact ? 0.7 : 1;
  let seed = 1;
  for (let x = -20; x < W + 20; ) {
    const w = (26 + rng() * 54) * scale;
    out.push({ x, w, h: usable * (0.3 + rng() * 0.42), layer: 0, roof: rng(), seed: seed++, silver: false });
    x += w * (0.65 + rng() * 0.5);
  }
  for (let x = -10; x < W + 10; ) {
    const w = (34 + rng() * 64) * scale;
    out.push({ x, w, h: usable * (0.16 + rng() * 0.4), layer: 1, roof: rng(), seed: seed++, silver: false });
    x += w + rng() * 16 * scale;
  }
  // The eastern facade that turns silver before dawn.
  // On wide screens the station board covers the east side, so the silver tower stands
  // in the gap between the rooftop sign and the board.
  const target = compact ? W * 0.86 : W * 0.545;
  let best: Tower | null = null;
  for (const t of out) {
    if (t.layer !== 1) continue;
    if (!best || Math.abs(t.x + t.w / 2 - target) < Math.abs(best.x + best.w / 2 - target)) best = t;
  }
  if (best) {
    best.silver = true;
    best.h = Math.max(best.h, usable * 0.62);
    best.w = Math.max(best.w, 64 * scale);
    best.roof = 0.1;
  }
  return out;
}

function readPalette(root: Element): Palette {
  const cs = getComputedStyle(root);
  const v = (n: string) => cs.getPropertyValue(n).trim();
  const num = (n: string, d: number) => {
    const p = parseFloat(v(n));
    return Number.isFinite(p) ? p : d;
  };
  return {
    skyHi: v("--c-sky-hi") || "#0e2a78",
    skyLo: v("--c-sky-lo") || "#2c56b8",
    tower: v("--c-tower") || "#04060c",
    towerFar: v("--c-tower-far") || "#0b1430",
    window: v("--c-window") || "#f3b552",
    silver: v("--c-silver") || "#10141e",
    water: v("--c-water") || "#081028",
    rail: v("--c-rail") || "#1a2030",
    lit: num("--n-lit", 0.4),
    rain: num("--n-rain", 0),
    dawn: num("--n-dawn", 0),
    reflect: num("--n-reflect", 0.5),
  };
}

function drawSky(ctx: CanvasRenderingContext2D, W: number, H: number, towers: Tower[], p: Palette, t: number, dpr: number) {
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, p.skyHi);
  g.addColorStop(1, p.skyLo);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  const base = H - BRIDGE;
  const intro = Math.min(1, t / INTRO_MS);

  for (const layer of [0, 1] as const) {
    for (const tw of towers) {
      if (tw.layer !== layer) continue;
      const top = base - tw.h;
      ctx.fillStyle = layer === 0 ? p.towerFar : tw.silver ? p.silver : p.tower;
      ctx.fillRect(tw.x, top, tw.w, tw.h);
      // Rooflines: setback, water tank, or mast.
      if (tw.roof > 0.72) {
        ctx.fillRect(tw.x + tw.w * 0.2, top - tw.h * 0.08, tw.w * 0.6, tw.h * 0.08 + 1);
      } else if (tw.roof > 0.55) {
        ctx.fillRect(tw.x + tw.w * 0.55, top - 9, 10, 9);
      } else if (tw.roof < 0.18) {
        ctx.fillRect(tw.x + tw.w / 2 - 1, top - tw.h * 0.16, 2, tw.h * 0.16);
      }
      if (tw.silver && p.dawn > 0.01) {
        const sg = ctx.createLinearGradient(tw.x, 0, tw.x + tw.w, 0);
        sg.addColorStop(0, `rgba(255,255,255,${0.05 * p.dawn})`);
        sg.addColorStop(0.62, `rgba(255,255,255,${0.55 * p.dawn})`);
        sg.addColorStop(1, `rgba(255,255,255,${0.12 * p.dawn})`);
        ctx.fillStyle = sg;
        ctx.fillRect(tw.x, top, tw.w, tw.h);
      }

      // Windows: lit by a hash of (window, time slot). Far towers get smaller, dimmer windows.
      const cw = layer === 0 ? 5 : 7;
      const ch = layer === 0 ? 7 : 9;
      const cols = Math.floor((tw.w - 6) / cw);
      const rows = Math.floor((tw.h - 8) / ch);
      if (cols < 1 || rows < 1) continue;
      ctx.fillStyle = p.window;
      ctx.globalAlpha = layer === 0 ? 0.5 : tw.silver ? 0.35 * (1 - p.dawn) + 0.1 : 0.95;
      const density = p.lit * (tw.silver ? 0.6 : 1);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const k = tw.seed * 4096 + r * 64 + c;
          const h1 = hash(k);
          if (h1 > intro) continue;
          const period = 5000 + h1 * 14000;
          const slot = Math.floor((t + h1 * period) / period);
          if (hash(k * 31 + slot) >= density) continue;
          ctx.fillRect(tw.x + 4 + c * cw, base - tw.h + 6 + r * ch, layer === 0 ? 2 : 3, layer === 0 ? 3 : 4);
        }
      }
      ctx.globalAlpha = 1;
    }
  }

  // Embankment under the deck, then the deck with posts.
  ctx.fillStyle = p.water;
  ctx.fillRect(0, base, W, H - base);
  ctx.fillStyle = p.rail;
  ctx.fillRect(0, base, W, 3);
  ctx.fillRect(0, base - 9, W, 1);
  for (let x = 0; x < W; x += 22) ctx.fillRect(x, base - 9, 1, 9);

  // Trains: amber stitches drawn across the river.
  const trains = [
    { speed: 0.062, dir: 1, cars: 7, phase: 0.1, y: base - 7 },
    { speed: 0.041, dir: -1, cars: 5, phase: 0.62, y: base - 5 },
  ];
  for (const tr of trains) {
    const carW = 26;
    const len = tr.cars * (carW + 2);
    const span = W + len + 240;
    const pos = (((t * tr.speed + tr.phase * span) % span) + span) % span - len - 120;
    const x0 = tr.dir === 1 ? pos : W - pos - len;
    for (let c = 0; c < tr.cars; c++) {
      const cx = x0 + c * (carW + 2);
      ctx.fillStyle = p.tower;
      ctx.fillRect(cx, tr.y - 6, carW, 7);
      ctx.fillStyle = p.window;
      for (let wx = 3; wx < carW - 3; wx += 5) ctx.fillRect(cx + wx, tr.y - 4, 3, 2);
    }
    ctx.fillStyle = "#fff4d8";
    ctx.fillRect(tr.dir === 1 ? x0 + len - 2 : x0, tr.y - 3, 2, 2);
  }

  drawRain(ctx, W, H, p, t, 0);
}

function drawRain(ctx: CanvasRenderingContext2D, W: number, H: number, p: Palette, t: number, salt: number) {
  if (p.rain < 0.02) return;
  const n = Math.floor((W / 1440) * 170 * p.rain);
  ctx.strokeStyle = `rgba(206,218,238,${0.32 * p.rain})`;
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let i = 0; i < n; i++) {
    const x = hash(i + salt) * (W + 40);
    const speed = 0.7 + hash(i * 3 + salt) * 0.5;
    const y = ((hash(i * 7 + salt) * (H + 40) + t * speed) % (H + 40)) - 20;
    ctx.moveTo(x, y);
    ctx.lineTo(x - 4, y + 13);
  }
  ctx.stroke();
}

function drawRiver(
  ctx: CanvasRenderingContext2D,
  src: HTMLCanvasElement,
  W: number,
  H: number,
  p: Palette,
  t: number,
  dpr: number,
) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = 1;
  ctx.fillStyle = p.water;
  ctx.fillRect(0, 0, W * dpr, H * dpr);
  const sh = src.height;
  const step = Math.max(1, Math.round(2 * dpr));
  const stretch = 1 + p.rain * 0.7;
  const rows = H * dpr;
  for (let y = 0; y < rows; y += step) {
    const depth = y / rows;
    const srcY = Math.floor(sh - BRIDGE * dpr + 2 * dpr - 1 - y * stretch);
    if (srcY < 0) break;
    const amp = (1.2 + depth * 6 + p.rain * 5) * dpr;
    const dx = Math.sin(y / dpr / 5.5 + t * 0.0021) * amp + Math.sin(y / dpr / 13 - t * 0.0013) * amp * 0.5;
    ctx.globalAlpha = Math.max(0, p.reflect * (1 - depth * 0.9));
    ctx.drawImage(src, 0, srcY, src.width, step, dx, y, W * dpr, step);
  }
  ctx.globalAlpha = 1;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  // Slow horizontal ripples catching the sky.
  ctx.fillStyle = p.skyLo;
  for (let i = 0; i < 14; i++) {
    const y = ((hash(i + 500) * H + t * 0.004 * (1 + i % 3)) % H);
    const x = ((hash(i + 900) * W + t * 0.01) % (W + 200)) - 100;
    ctx.globalAlpha = 0.18 * (1 - y / H);
    ctx.fillRect(x, y, 60 + hash(i) * 160, 1);
  }
  ctx.globalAlpha = 1;
  drawRain(ctx, W, H, p, t, 77);
}

export function useSkyline(
  sectionRef: RefObject<HTMLElement | null>,
  skyRef: RefObject<HTMLCanvasElement | null>,
  riverRef: RefObject<HTMLCanvasElement | null>,
  hour: Hour,
) {
  const reduced = useReducedMotionPref();
  const active = useActive(sectionRef) && !reduced;
  const state = useRef<{ towers: Tower[]; W: number; H: number; RW: number; RH: number; dpr: number; t0: number }>({
    towers: [],
    W: 0,
    H: 0,
    RW: 0,
    RH: 0,
    dpr: 1,
    t0: 0,
  });

  const draw = (t: number) => {
    const sky = skyRef.current;
    const river = riverRef.current;
    const st = state.current;
    if (!sky || !st.W) return;
    const root = sky.closest("[data-city-root]") ?? document.documentElement;
    const p = readPalette(root);
    const ctx = sky.getContext("2d");
    if (!ctx) return;
    drawSky(ctx, st.W, st.H, st.towers, p, t, st.dpr);
    if (river && st.RW) {
      const rctx = river.getContext("2d");
      if (rctx) drawRiver(rctx, sky, st.RW, st.RH, p, t, st.dpr);
    }
  };
  const drawRef = useRef(draw);
  useEffect(() => {
    drawRef.current = draw;
  });

  useEffect(() => {
    state.current.t0 = performance.now();
    const sky = skyRef.current;
    const river = riverRef.current;
    if (!sky) return;
    const fit = () => {
      const st = state.current;
      st.dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      st.W = sky.clientWidth;
      st.H = sky.clientHeight;
      sky.width = Math.round(st.W * st.dpr);
      sky.height = Math.round(st.H * st.dpr);
      if (river) {
        st.RW = river.clientWidth;
        st.RH = river.clientHeight;
        river.width = Math.round(st.RW * st.dpr);
        river.height = Math.round(st.RH * st.dpr);
      }
      st.towers = buildCity(st.W, st.H, st.W < 820);
      drawRef.current(performance.now() - st.t0);
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(sky);
    if (river) ro.observe(river);
    return () => ro.disconnect();
  }, [skyRef, riverRef]);

  // Static frame for reduced motion or when the loop is paused: redraw once the hour settles.
  useEffect(() => {
    if (active) return;
    const st = state.current;
    const t = reduced ? 9000 : performance.now() - st.t0;
    let raf = requestAnimationFrame(() => {
      drawRef.current(t);
      raf = requestAnimationFrame(() => drawRef.current(t));
    });
    // Repaint a few times so the frame catches the settled colours however the
    // hour transition is timed (instant under reduced motion, 1.1 s otherwise).
    const timers = [60, 250, 600, 1250].map((ms) => window.setTimeout(() => drawRef.current(t), ms));
    return () => {
      cancelAnimationFrame(raf);
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, [active, reduced, hour]);

  const acc = useRef(0);
  useFrame(active, (dt, now) => {
    // About 30 frames a second is enough for windows and trains.
    acc.current += dt;
    if (acc.current < 32) return;
    acc.current = 0;
    drawRef.current(now - state.current.t0);
  });
}
