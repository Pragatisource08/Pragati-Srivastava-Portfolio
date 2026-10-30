// Gravity-rain field: a fixed-step vector-field simulation.
// Clouds are clients, drops are requests, the black flower is the cache,
// the far moon is Gemini. Same seed + same action log = same rain.

import { createRng, type Rng } from "@/lib/games/rng";

export const SEED = 9;
export const DT = 1 / 60;

export type Gravity = "blue" | "red" | "clear";
export type PlantKind = "stone" | "flower";

export type Cloud = { id: number; x: number; y: number; color: Gravity; tilt: number; user: boolean; acc: number };
export type Body = { kind: "fox" | "stone"; x: number; y: number; r: number };
export type Flower = { x: number; y: number; capture: number; ring: number; orbiting: number };
export type Pond = { x: number; y: number; rx: number; ry: number };
export type Moon = { x: number; y: number; r: number };

type DropState = "free" | "orbit" | "spark";
export type Drop = {
  x: number;
  y: number;
  px: number;
  py: number;
  vx: number;
  vy: number;
  gx: number;
  gy: number;
  color: Gravity;
  state: DropState;
  flower: number;
  angle: number;
  radius: number;
  life: number;
  born: number;
};
export type Ripple = { x: number; y: number; t: number; color: Gravity; flat: number };

export type Action =
  | { frame: number; kind: "cloud"; nx: number; ny: number; color: Gravity; tilt: number }
  | { frame: number; kind: "tilt"; cloudId: number; tilt: number }
  | { frame: number; kind: "plant"; what: PlantKind; nx: number; ny: number };

export type Variant = "wide" | "compact";

export type Scene = {
  w: number;
  h: number;
  s: number;
  variant: Variant;
  groundY: number;
  clouds: Cloud[];
  bodies: Body[];
  flowers: Flower[];
  ponds: Pond[];
  moon: Moon;
  drops: Drop[];
  ripples: Ripple[];
  frame: number;
  cached: number;
  gemini: number;
  maxDrops: number;
  nextCloudId: number;
  rng: Rng;
  version: number;
};

const G = 250; // px/s^2, base pull

/** Size unit of a cloud, shared by painting, hit tests and labels. */
export function cloudK(s: number) {
  return Math.max(12, s * 0.024);
}
const RATE = 7; // drops per second per cloud
const MAX_ORBIT = 16;
const MAX_CLOUDS = 9;
const MAX_PLANTS = 8;

// Normalized layout of the default garden.
const LAYOUTS: Record<Variant, {
  ground: number;
  moon: [number, number];
  pond: [number, number];
  blue: [number, number];
  clear: [number, number];
  flower: [number, number];
  red: [number, number];
  fox: [number, number];
}> = {
  wide: {
    ground: 0.87,
    moon: [0.935, 0.12],
    pond: [0.69, 0.16],
    blue: [0.69, 0.7],
    clear: [0.5, 0.23],
    flower: [0.55, 0.57],
    red: [0.86, 0.37],
    fox: [0.865, 0.87],
  },
  compact: {
    ground: 0.88,
    moon: [0.9, 0.09],
    pond: [0.6, 0.15],
    blue: [0.6, 0.68],
    clear: [0.17, 0.2],
    flower: [0.26, 0.58],
    red: [0.85, 0.36],
    fox: [0.85, 0.88],
  },
};

export function createScene(w: number, h: number, variant: Variant, maxDrops: number): Scene {
  const L = LAYOUTS[variant];
  const s = Math.min(w, h * 1.4);
  const groundY = h * L.ground;
  const foxR = s * 0.05;
  const scene: Scene = {
    w,
    h,
    s,
    variant,
    groundY,
    clouds: [],
    bodies: [{ kind: "fox", x: L.fox[0] * w, y: groundY - foxR * 0.55, r: foxR }],
    flowers: [makeFlower(L.flower[0] * w, L.flower[1] * h, s)],
    ponds: [{ x: L.pond[0] * w, y: L.pond[1] * h, rx: s * 0.1, ry: s * 0.026 }],
    moon: { x: L.moon[0] * w, y: L.moon[1] * h, r: Math.max(14, s * 0.026) },
    drops: [],
    ripples: [],
    frame: 0,
    cached: 0,
    gemini: 0,
    maxDrops,
    nextCloudId: 1,
    rng: createRng(SEED),
    version: 0,
  };
  addCloud(scene, L.blue[0] * w, L.blue[1] * h, "blue", 0, false);
  addCloud(scene, L.clear[0] * w, L.clear[1] * h, "clear", 0, false);
  addCloud(scene, L.red[0] * w, L.red[1] * h, "red", 0, false);
  return scene;
}

function makeFlower(x: number, y: number, s: number): Flower {
  return { x, y, capture: s * 0.034, ring: s * 0.05, orbiting: 0 };
}

function addCloud(scene: Scene, x: number, y: number, color: Gravity, tilt: number, user: boolean): Cloud {
  const cloud: Cloud = { id: scene.nextCloudId++, x, y, color, tilt, user, acc: 0 };
  scene.clouds.push(cloud);
  const users = scene.clouds.filter((c) => c.user);
  if (users.length > MAX_CLOUDS) scene.clouds.splice(scene.clouds.indexOf(users[0]), 1);
  scene.version++;
  return cloud;
}

export function applyAction(scene: Scene, a: Action): number | null {
  if (a.kind === "cloud") {
    return addCloud(scene, a.nx * scene.w, a.ny * scene.h, a.color, a.tilt, true).id;
  }
  if (a.kind === "tilt") {
    const c = scene.clouds.find((x) => x.id === a.cloudId);
    if (c) {
      c.tilt = a.tilt;
      scene.version++;
    }
    return a.cloudId;
  }
  const x = a.nx * scene.w;
  const y = Math.min(a.ny * scene.h, scene.groundY - 4);
  if (a.what === "stone") {
    const stones = scene.bodies.filter((b) => b.kind === "stone");
    if (stones.length >= MAX_PLANTS) scene.bodies.splice(scene.bodies.indexOf(stones[0]), 1);
    scene.bodies.push({ kind: "stone", x, y, r: scene.s * 0.03 });
  } else {
    if (scene.flowers.length > MAX_PLANTS) {
      // Retire the oldest planted flower (index 1; index 0 is the garden's own).
      scene.flowers.splice(1, 1);
      for (const d of scene.drops) {
        if (d.state !== "orbit") continue;
        if (d.flower === 1) {
          d.state = "spark";
          d.life = 1;
        } else if (d.flower > 1) d.flower--;
      }
    }
    scene.flowers.push(makeFlower(x, y, scene.s));
  }
  scene.version++;
  return null;
}

/** Unit pull of a cloud: blue rises, red and clear fall, then the tilt rotates it. */
export function pullOf(cloud: Pick<Cloud, "color" | "tilt">): [number, number] {
  const baseY = cloud.color === "blue" ? -1 : 1;
  const t = cloud.tilt;
  // rotate (0, baseY) by t
  return [-Math.sin(t) * baseY, Math.cos(t) * baseY];
}

function emit(scene: Scene, cloud: Cloud) {
  const { rng } = scene;
  const spread = cloudK(scene.s) * 1.5;
  const [ux, uy] = pullOf(cloud);
  const x = cloud.x + (rng() - 0.5) * spread * 2;
  const y = cloud.y + uy * cloudK(scene.s) * 0.9 + (rng() - 0.5) * 6;
  const side = cloud.color === "clear" ? (rng() < 0.5 ? -1 : 1) * (40 + rng() * 40) : (rng() - 0.5) * 20;
  scene.drops.push({
    x,
    y,
    px: x,
    py: y,
    vx: ux * 60 + side,
    vy: uy * 60,
    gx: ux * G,
    gy: uy * G,
    color: cloud.color,
    state: "free",
    flower: -1,
    angle: 0,
    radius: 0,
    life: 1,
    born: scene.frame,
  });
}

function toSpark(scene: Scene, d: Drop) {
  d.state = "spark";
  d.life = 1;
  scene.gemini++;
}

function inPond(p: Pond, x: number, y: number) {
  const dx = (x - p.x) / p.rx;
  const dy = (y - p.y) / p.ry;
  return dx * dx + dy * dy < 1;
}

export function step(scene: Scene) {
  const { rng } = scene;
  scene.frame++;

  // Emission
  for (const c of scene.clouds) {
    c.acc += RATE * DT;
    while (c.acc >= 1) {
      c.acc -= 1;
      const free = scene.drops.length;
      if (free < scene.maxDrops) emit(scene, c);
      else rng(); // keep the stream of numbers stable whatever the cap does
    }
  }

  const margin = 40;
  for (const d of scene.drops) {
    d.px = d.x;
    d.py = d.y;
    if (d.state === "free") {
      let ax = 0;
      let ay = 0;
      if (d.color === "clear") {
        const f = nearestFlower(scene, d.x, d.y);
        if (f) {
          const dx = f.x - d.x;
          const dy = f.y - d.y;
          const dist = Math.hypot(dx, dy) || 1;
          ax += (dx / dist) * 320;
          ay += (dy / dist) * 320;
        } else {
          ax += d.gx;
          ay += d.gy;
        }
      } else {
        ax += d.gx;
        ay += d.gy;
        // Ponds pull blue rain in when close.
        if (d.color === "blue") {
          for (const p of scene.ponds) {
            const dx = p.x - d.x;
            const dy = p.y - d.y;
            const dist = Math.hypot(dx, dy) || 1;
            if (dist < p.rx * 2.4) {
              ax += (dx / dist) * 160;
              ay += (dy / dist) * 160;
            }
          }
        }
      }
      // Every flower draws nearby rain a little: drops that land near it are served from the cache.
      for (const f of scene.flowers) {
        const dx = f.x - d.x;
        const dy = f.y - d.y;
        const dist = Math.hypot(dx, dy) || 1;
        if (dist < f.ring * 3) {
          ax += (dx / dist) * 200;
          ay += (dy / dist) * 200;
        }
      }
      // Sleeping bodies push rain around them.
      for (const b of scene.bodies) {
        const dx = d.x - b.x;
        const dy = d.y - b.y;
        const dist = Math.hypot(dx, dy) || 1;
        const R = b.r * 2.6;
        if (dist < R) {
          const k = 1900 * (1 - dist / R);
          ax += (dx / dist) * k;
          ay += (dy / dist) * k;
        }
      }
      d.vx = (d.vx + ax * DT) * 0.994;
      d.vy = (d.vy + ay * DT) * 0.994;
      const sp = Math.hypot(d.vx, d.vy);
      const max = 420;
      if (sp > max) {
        d.vx *= max / sp;
        d.vy *= max / sp;
      }
      d.x += d.vx * DT;
      d.y += d.vy * DT;
      // Hard contact: slide around a body.
      for (const b of scene.bodies) {
        const dx = d.x - b.x;
        const dy = d.y - b.y;
        const dist = Math.hypot(dx, dy) || 1;
        if (dist < b.r) {
          const nx = dx / dist;
          const ny = dy / dist;
          d.x = b.x + nx * b.r;
          d.y = b.y + ny * b.r;
          const vn = d.vx * nx + d.vy * ny;
          if (vn < 0) {
            d.vx -= vn * nx;
            d.vy -= vn * ny;
          }
        }
      }
      // Destinations
      let done = false;
      for (let i = 0; i < scene.flowers.length && !done; i++) {
        const f = scene.flowers[i];
        if (Math.hypot(d.x - f.x, d.y - f.y) < f.capture) {
          captureInto(scene, d, i);
          done = true;
        }
      }
      if (done) continue;
      for (const p of scene.ponds) {
        if (inPond(p, d.x, d.y)) {
          scene.ripples.push({ x: d.x, y: p.y, t: 0, color: d.color, flat: 0.28 });
          toSpark(scene, d);
          done = true;
          break;
        }
      }
      if (done) continue;
      if (d.y >= scene.groundY) {
        d.y = scene.groundY;
        scene.ripples.push({ x: d.x, y: scene.groundY, t: 0, color: d.color, flat: 0.22 });
        toSpark(scene, d);
      } else if (d.x < -margin || d.x > scene.w + margin || d.y < -margin || scene.frame - d.born > 60 * 14) {
        toSpark(scene, d);
      }
    } else if (d.state === "orbit") {
      const f = scene.flowers[d.flower];
      if (!f) {
        d.state = "spark";
        d.life = 1;
        continue;
      }
      const target = f.ring + ((d.born % 3) - 1) * f.ring * 0.18;
      d.radius += (target - d.radius) * 0.04;
      d.angle += (1.5 * f.ring) / Math.max(d.radius, 1) * DT;
      d.x = f.x + Math.cos(d.angle) * d.radius;
      d.y = f.y + Math.sin(d.angle) * d.radius * 0.5;
      if (d.life < 1) {
        d.life -= DT * 1.5;
      }
    } else {
      // Spark: routed to the Gemini moon at a steady speed.
      const m = scene.moon;
      const dx = m.x - d.x;
      const dy = m.y - d.y;
      const dist = Math.hypot(dx, dy) || 1;
      const stepLen = Math.min(dist, 520 * DT);
      d.x += (dx / dist) * stepLen;
      d.y += (dy / dist) * stepLen;
      d.life -= DT * 0.25;
    }
  }

  // Cull
  scene.drops = scene.drops.filter((d) => {
    if (d.state === "spark") return d.life > 0 && Math.hypot(d.x - scene.moon.x, d.y - scene.moon.y) > scene.moon.r * 0.6;
    if (d.state === "orbit") return d.life > 0;
    return true;
  });
  // Recount orbiters (a flower can be replaced)
  for (const f of scene.flowers) f.orbiting = 0;
  for (const d of scene.drops) if (d.state === "orbit" && scene.flowers[d.flower]) scene.flowers[d.flower].orbiting++;

  for (const r of scene.ripples) r.t += DT;
  scene.ripples = scene.ripples.filter((r) => r.t < 0.7);
}

function captureInto(scene: Scene, d: Drop, i: number) {
  const f = scene.flowers[i];
  d.state = "orbit";
  d.flower = i;
  d.color = "clear";
  d.angle = Math.atan2((d.y - f.y) * 2, d.x - f.x);
  d.radius = Math.hypot(d.x - f.x, (d.y - f.y) * 2);
  d.life = 1;
  scene.cached++;
  // Oldest orbiter fades out when the flower is full.
  const orbiting = scene.drops.filter((x) => x.state === "orbit" && x.flower === i && x.life >= 1);
  if (orbiting.length > MAX_ORBIT) orbiting[0].life = 0.999;
}

function nearestFlower(scene: Scene, x: number, y: number): Flower | null {
  let best: Flower | null = null;
  let bd = Infinity;
  for (const f of scene.flowers) {
    const d = Math.hypot(f.x - x, f.y - y);
    if (d < bd) {
      bd = d;
      best = f;
    }
  }
  return best;
}

/** Rebuild a scene and run it forward to `frames`, applying the log on its frames. */
export function replayTo(
  w: number,
  h: number,
  variant: Variant,
  maxDrops: number,
  log: Action[],
  frames: number,
  onStep?: (scene: Scene) => void
): Scene {
  const scene = createScene(w, h, variant, maxDrops);
  let i = 0;
  for (let f = 0; f < frames; f++) {
    while (i < log.length && log[i].frame <= scene.frame) applyAction(scene, log[i++]);
    step(scene);
    onStep?.(scene);
  }
  while (i < log.length) applyAction(scene, log[i++]);
  return scene;
}
