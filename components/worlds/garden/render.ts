// Canvas painting for the garden. The static layer holds sky, ground and objects;
// the rain layer fades a little each frame so drops leave rivers behind them.

import { createRng } from "@/lib/games/rng";
import { cloudK, pullOf, type Body, type Cloud, type Flower, type Gravity, type Moon, type Pond, type Scene } from "./field";

export const INK: Record<Gravity, string> = {
  blue: "#8cc4f0",
  red: "#f0907a",
  clear: "#e6efe8",
};

const CLOUD_FILL: Record<Gravity, string> = {
  blue: "rgba(140,196,240,0.30)",
  red: "rgba(240,144,122,0.30)",
  clear: "rgba(230,239,232,0.20)",
};

export function sizeCanvas(c: HTMLCanvasElement, w: number, h: number) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  c.width = Math.round(w * dpr);
  c.height = Math.round(h * dpr);
  const ctx = c.getContext("2d")!;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return ctx;
}

export function drawStatic(ctx: CanvasRenderingContext2D, scene: Scene, selected: number | null) {
  const { w, h, groundY } = scene;
  ctx.clearRect(0, 0, w, h);

  // Ground band with grass tufts
  const g = ctx.createLinearGradient(0, groundY - 30, 0, h);
  g.addColorStop(0, "rgba(28,36,32,0)");
  g.addColorStop(0.35, "#1f2723");
  g.addColorStop(1, "#1a211e");
  ctx.fillStyle = g;
  ctx.fillRect(0, groundY - 30, w, h - groundY + 30);
  ctx.strokeStyle = "#4a5a51";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, groundY);
  ctx.lineTo(w, groundY);
  ctx.stroke();
  const rng = createRng(31);
  ctx.strokeStyle = "rgba(122,148,128,0.55)";
  ctx.lineCap = "round";
  for (let x = 4; x < w; x += 9 + rng() * 14) {
    const hh = 4 + rng() * 11;
    const lean = (rng() - 0.5) * 6;
    ctx.beginPath();
    ctx.moveTo(x, groundY);
    ctx.quadraticCurveTo(x + lean * 0.3, groundY - hh * 0.6, x + lean, groundY - hh);
    ctx.stroke();
  }

  drawMoon(ctx, scene.moon);
  for (const p of scene.ponds) drawPond(ctx, p);
  for (const f of scene.flowers) drawFlower(ctx, f, groundY);
  for (const b of scene.bodies) drawBody(ctx, b);
  for (const c of scene.clouds) drawCloud(ctx, c, scene.s, c.id === selected);
}

function drawMoon(ctx: CanvasRenderingContext2D, m: Moon) {
  ctx.save();
  ctx.fillStyle = "rgba(236,223,174,0.07)";
  ctx.beginPath();
  ctx.arc(m.x, m.y, m.r * 1.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ecdfae";
  ctx.beginPath();
  ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(160,146,98,0.35)";
  for (const [dx, dy, r] of [
    [-0.3, -0.2, 0.22],
    [0.28, 0.25, 0.16],
    [0.05, 0.42, 0.1],
  ] as const) {
    ctx.beginPath();
    ctx.arc(m.x + dx * m.r, m.y + dy * m.r, r * m.r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawPond(ctx: CanvasRenderingContext2D, p: Pond) {
  ctx.save();
  const g = ctx.createLinearGradient(p.x, p.y - p.ry, p.x, p.y + p.ry);
  g.addColorStop(0, "#9fd0f2");
  g.addColorStop(1, "#4f86b4");
  // Underside: the pond is a lens of water with a soil skirt
  ctx.fillStyle = "#3a4a42";
  ctx.beginPath();
  ctx.ellipse(p.x, p.y + p.ry * 0.25, p.rx * 0.96, p.ry * 1.05, 0, 0, Math.PI);
  ctx.quadraticCurveTo(p.x, p.y + p.ry * 4.2, p.x + p.rx * 0.96, p.y + p.ry * 0.25);
  ctx.fill();
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.ellipse(p.x, p.y, p.rx, p.ry, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(230,245,255,0.55)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.ellipse(p.x - p.rx * 0.2, p.y - p.ry * 0.2, p.rx * 0.45, p.ry * 0.35, 0, Math.PI * 1.1, Math.PI * 1.7);
  ctx.stroke();
  ctx.restore();
}

export function drawFlower(ctx: CanvasRenderingContext2D, f: Flower, groundY: number) {
  const r = f.capture * 0.75;
  ctx.save();
  // stem
  ctx.strokeStyle = "#4f6457";
  ctx.lineWidth = Math.max(2, r * 0.12);
  ctx.lineCap = "round";
  if (groundY > f.y + r) {
    ctx.beginPath();
    ctx.moveTo(f.x, f.y + r * 0.6);
    ctx.bezierCurveTo(f.x - r * 0.8, f.y + (groundY - f.y) * 0.4, f.x + r * 0.6, f.y + (groundY - f.y) * 0.7, f.x, groundY);
    ctx.stroke();
    // a leaf
    ctx.fillStyle = "#3f5347";
    const ly = f.y + (groundY - f.y) * 0.62;
    ctx.beginPath();
    ctx.ellipse(f.x + r * 0.7, ly, r * 0.7, r * 0.22, -0.5, 0, Math.PI * 2);
    ctx.fill();
  }
  // rim light so black reads on dusk ground
  ctx.fillStyle = "rgba(230,239,232,0.14)";
  ctx.beginPath();
  ctx.arc(f.x, f.y, r * 1.55, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#0b0e0c";
  ctx.strokeStyle = "rgba(200,214,204,0.55)";
  ctx.lineWidth = 0.8;
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * Math.PI * 2 - Math.PI / 2;
    ctx.beginPath();
    ctx.ellipse(f.x + Math.cos(a) * r * 0.75, f.y + Math.sin(a) * r * 0.75, r * 0.62, r * 0.3, a, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
  ctx.fillStyle = "#151a17";
  ctx.beginPath();
  ctx.arc(f.x, f.y, r * 0.38, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(230,239,232,0.75)";
  ctx.beginPath();
  ctx.arc(f.x - r * 0.1, f.y - r * 0.1, r * 0.08, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawBody(ctx: CanvasRenderingContext2D, b: Body) {
  ctx.save();
  if (b.kind === "stone") {
    ctx.fillStyle = "#59645d";
    ctx.beginPath();
    ctx.ellipse(b.x, b.y, b.r, b.r * 0.8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(230,239,232,0.12)";
    ctx.beginPath();
    ctx.ellipse(b.x - b.r * 0.25, b.y - b.r * 0.3, b.r * 0.45, b.r * 0.22, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    return;
  }
  // Sleeping fox, curled. Body, tucked head, tail wrapped round the front.
  const r = b.r;
  const x = b.x;
  const y = b.y;
  ctx.fillStyle = "#b8694a";
  ctx.beginPath();
  ctx.ellipse(x, y + r * 0.12, r * 1.05, r * 0.62, 0, 0, Math.PI * 2);
  ctx.fill();
  // head
  ctx.beginPath();
  ctx.ellipse(x + r * 0.62, y - r * 0.05, r * 0.42, r * 0.34, 0.2, 0, Math.PI * 2);
  ctx.fill();
  // ears
  ctx.beginPath();
  ctx.moveTo(x + r * 0.5, y - r * 0.3);
  ctx.lineTo(x + r * 0.58, y - r * 0.7);
  ctx.lineTo(x + r * 0.72, y - r * 0.33);
  ctx.closePath();
  ctx.moveTo(x + r * 0.76, y - r * 0.28);
  ctx.lineTo(x + r * 0.92, y - r * 0.62);
  ctx.lineTo(x + r * 0.98, y - r * 0.22);
  ctx.closePath();
  ctx.fill();
  // tail
  ctx.fillStyle = "#c9774f";
  ctx.beginPath();
  ctx.moveTo(x - r * 0.95, y + r * 0.1);
  ctx.bezierCurveTo(x - r * 1.5, y + r * 0.8, x + r * 0.2, y + r * 0.95, x + r * 0.95, y + r * 0.45);
  ctx.bezierCurveTo(x + r * 0.2, y + r * 0.62, x - r * 0.7, y + r * 0.55, x - r * 0.95, y + r * 0.1);
  ctx.fill();
  ctx.fillStyle = "#efe6d6";
  ctx.beginPath();
  ctx.ellipse(x + r * 0.9, y + r * 0.44, r * 0.16, r * 0.1, -0.3, 0, Math.PI * 2);
  ctx.fill();
  // closed eye
  ctx.strokeStyle = "#3a2117";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(x + r * 0.72, y - r * 0.06, r * 0.08, 0.2, Math.PI - 0.2);
  ctx.stroke();
  ctx.restore();
}

export function drawCloud(ctx: CanvasRenderingContext2D, c: Pick<Cloud, "x" | "y" | "color" | "tilt">, s: number, selected: boolean) {
  const k = cloudK(s);
  ctx.save();
  ctx.fillStyle = CLOUD_FILL[c.color];
  ctx.strokeStyle = INK[c.color];
  ctx.lineWidth = 1.25;
  ctx.beginPath();
  for (const [dx, dy, r] of [
    [-1.3, 0.25, 0.85],
    [-0.45, -0.25, 1.15],
    [0.55, -0.1, 1.0],
    [1.35, 0.3, 0.75],
  ] as const) {
    ctx.moveTo(c.x + dx * k + r * k, c.y + dy * k);
    ctx.arc(c.x + dx * k, c.y + dy * k, r * k, 0, Math.PI * 2);
  }
  ctx.fill();
  ctx.globalAlpha = 0.85;
  ctx.stroke();
  ctx.globalAlpha = 1;
  // The pull: a short tapered stroke in the cloud's gravity direction.
  const [ux, uy] = pullOf(c);
  const len = k * 2.6;
  const sx = c.x + ux * k * 1.2;
  const sy = c.y + uy * k * 1.2;
  ctx.strokeStyle = INK[c.color];
  ctx.lineWidth = 1.5;
  ctx.setLineDash([3, 4]);
  ctx.beginPath();
  ctx.moveTo(sx, sy);
  ctx.lineTo(sx + ux * len, sy + uy * len);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.arc(sx + ux * len, sy + uy * len, 2.2, 0, Math.PI * 2);
  ctx.fillStyle = INK[c.color];
  ctx.fill();
  if (selected) {
    ctx.strokeStyle = "#ecdfae";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.ellipse(c.x, c.y, k * 2.6, k * 1.7, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}

/** Fade the rain layer, then paint the current drops on top. */
export function drawRain(ctx: CanvasRenderingContext2D, scene: Scene, fade = 0.14) {
  const { w, h } = scene;
  ctx.save();
  ctx.globalCompositeOperation = "destination-out";
  ctx.fillStyle = `rgba(0,0,0,${fade})`;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();

  ctx.save();
  ctx.lineCap = "round";
  for (const d of scene.drops) {
    if (d.state === "spark") {
      ctx.fillStyle = `rgba(236,223,174,${0.6 * Math.max(0, Math.min(1, d.life))})`;
      ctx.beginPath();
      ctx.arc(d.x, d.y, 1.1, 0, Math.PI * 2);
      ctx.fill();
      continue;
    }
    const col = INK[d.color];
    ctx.strokeStyle = col;
    ctx.globalAlpha = d.state === "orbit" ? 0.9 * Math.max(0, Math.min(1, d.life)) : 0.95;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(d.px, d.py);
    ctx.lineTo(d.x, d.y);
    ctx.stroke();
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.arc(d.x, d.y, d.state === "orbit" ? 1.8 : 1.6, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  for (const r of scene.ripples) {
    const k = r.t / 0.7;
    ctx.strokeStyle = INK[r.color];
    ctx.globalAlpha = 0.5 * (1 - k);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(r.x, r.y, 3 + k * 12, (3 + k * 12) * r.flat, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}
