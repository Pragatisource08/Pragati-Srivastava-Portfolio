// A small photographic-paper model: an H&D characteristic curve (density against
// log exposure) whose height, speed, and fog depend on time in the developer.
// Everything here is pure, so the hero tray and the game share one chemistry.

export const PAPER = {
  dBase: 0.04, // paper base plus unavoidable fog
  dMax: 2.05, // deepest black the paper can reach
  gamma: 5.2, // slope of the toe-to-shoulder rise
  xMid: 0.12, // log exposure at half density, at full development
  induction: 8, // seconds before any image appears
  tau: 26, // development rate constant (s)
};

export const STANDARD_DEV = 90; // seconds: the time printed on the bottle
export const FOG_ONSET = 120; // past this, the developer starts fogging the whites

/** Exposure steps on the test strip, in seconds (half-stop apart). */
export const STEPS = [4, 5.6, 8, 11, 16] as const;

/** A negative's density for a positive-image luminance L (0 = black, 1 = white). */
export function negDensity(L: number, negOffset: number) {
  return 0.25 + negOffset + 1.1 * L;
}

function sigmoid(v: number) {
  return 1 / (1 + Math.exp(-v));
}

/** Fog the developer adds to every tone after the safe window. */
export function fogAt(t: number) {
  const over = Math.max(0, (t - FOG_ONSET) / 120);
  return 0.38 * over ** 1.5;
}

/**
 * Print density at time t (seconds in the developer) for a tone that received
 * log exposure x. Shadows (high x) develop fast; highlights lag behind, which is
 * why the face gathers out of the dark areas first.
 */
export function density(x: number, t: number) {
  if (t <= PAPER.induction) return PAPER.dBase;
  const speed = 0.16 * Math.log10(Math.max(t, 1) / STANDARD_DEV);
  const s = sigmoid(PAPER.gamma * (x + speed - PAPER.xMid));
  const rate = PAPER.tau * (1 + 0.9 * (1 - s));
  const reached = 1 - Math.exp(-(t - PAPER.induction) / rate);
  return PAPER.dBase + fogAt(t) + (PAPER.dMax - PAPER.dBase) * s * reached;
}

/** Log exposure of a tone with luminance L printed for `seconds` through a negative. */
export function logExposure(L: number, seconds: number, negOffset: number) {
  return Math.log10(seconds) - negDensity(L, negOffset);
}

// Paper under amber safelight, and the deepest silver black.
const PAPER_RGB = [246, 216, 164] as const;
const BLACK_RGB = [20, 11, 4] as const;

/** Reflectance to an on-screen colour, on the safelit paper tone. */
export function densityToRgb(d: number): [number, number, number] {
  const refl = Math.pow(10, -d);
  const k = Math.pow(refl, 1 / 2.2);
  return [
    Math.round(BLACK_RGB[0] + (PAPER_RGB[0] - BLACK_RGB[0]) * k),
    Math.round(BLACK_RGB[1] + (PAPER_RGB[1] - BLACK_RGB[1]) * k),
    Math.round(BLACK_RGB[2] + (PAPER_RGB[2] - BLACK_RGB[2]) * k),
  ];
}

/** A 256-entry colour table: one entry per 8-bit luminance of the source image. */
export function buildLut(seconds: number, negOffset: number, t: number) {
  const lut = new Uint8ClampedArray(256 * 3);
  for (let i = 0; i < 256; i++) {
    const d = density(logExposure(i / 255, seconds, negOffset), t);
    const [r, g, b] = densityToRgb(d);
    lut[i * 3] = r;
    lut[i * 3 + 1] = g;
    lut[i * 3 + 2] = b;
  }
  return lut;
}

/** Grayscale source, one byte per pixel. */
export type Negative = { size: number; lum: Uint8Array; shadowL: number; highlightL: number };

export function negativeFromImageData(data: ImageData): Negative {
  const { width, height } = data;
  const lum = new Uint8Array(width * height);
  const hist = new Uint32Array(256);
  for (let i = 0; i < lum.length; i++) {
    const r = data.data[i * 4];
    const g = data.data[i * 4 + 1];
    const b = data.data[i * 4 + 2];
    const v = Math.round(0.2126 * r + 0.7152 * g + 0.0722 * b);
    lum[i] = v;
    hist[v]++;
  }
  // The tones the verdict reads: deep shadow (3rd percentile), bright highlight (97th).
  const pct = (p: number) => {
    const target = lum.length * p;
    let acc = 0;
    for (let i = 0; i < 256; i++) {
      acc += hist[i];
      if (acc >= target) return i / 255;
    }
    return 1;
  };
  return { size: width, lum, shadowL: pct(0.03), highlightL: pct(0.97) };
}

/** Paint the print into an ImageData-sized buffer. */
export function paint(out: ImageData, neg: Negative, lut: Uint8ClampedArray) {
  const px = out.data;
  const lum = neg.lum;
  for (let i = 0; i < lum.length; i++) {
    const j = lum[i] * 3;
    const o = i * 4;
    px[o] = lut[j];
    px[o + 1] = lut[j + 1];
    px[o + 2] = lut[j + 2];
    px[o + 3] = 255;
  }
}

export type Verdict = {
  keeper: boolean;
  shadowD: number;
  highlightD: number;
  score: number;
  headline: string;
  reason: string;
};

/** Judge a pulled print the way a printer would: real blacks, clean whites. */
export function judge(neg: Negative, seconds: number, negOffset: number, t: number): Verdict {
  const shadowD = density(logExposure(neg.shadowL, seconds, negOffset), t);
  const highlightD = density(logExposure(neg.highlightL, seconds, negOffset), t);
  const blackGap = Math.max(0, 1.65 - shadowD); // want 1.65+ in the shadows
  const whiteGap = Math.max(0, highlightD - 0.32); // want 0.32 or less in the highlights
  const score = Math.max(0, Math.round(100 - blackGap * 120 - whiteGap * 160));
  const keeper = blackGap === 0 && whiteGap === 0;
  const fogged = fogAt(t) > 0.06;
  const early = t < 60;
  let headline = "A keeper.";
  let reason = "Rich blacks and clean whites. Into the stop bath it goes.";
  if (!keeper) {
    if (whiteGap > 0 && fogged) {
      headline = "Fogged.";
      reason = "Left in the developer too long: gray crept into the whites.";
    } else if (whiteGap > 0) {
      headline = "Too dark.";
      reason = "Too much exposure: the face went muddy before the blacks were done.";
    } else if (early) {
      headline = "Pulled too early.";
      reason = "The blacks never reached full density. That sheet is spent.";
    } else {
      headline = "Too thin.";
      reason = "Not enough exposure: no time in the tray can make those blacks.";
    }
  }
  return { keeper, shadowD, highlightD, score, headline, reason };
}

export function formatClock(seconds: number) {
  const s = Math.max(0, Math.floor(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}
