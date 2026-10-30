"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { profile } from "@/lib/content";
import { BAYER8 } from "./glyphs";

const N = 64; // dither resolution; shown at x3 (192 px) or x2 (128 px), never resampled

export function Portrait() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const [photo, setPhoto] = useState(false);

  useEffect(() => {
    let alive = true;
    const img = new window.Image();
    img.src = profile.photo;
    img.onload = () => {
      const c = canvas.current;
      const ctx = c?.getContext("2d", { willReadFrequently: true });
      if (!c || !ctx || !alive) return;
      c.width = N;
      c.height = N;
      ctx.imageSmoothingQuality = "high";
      // Crop to the face so 64 px of dither still reads as her.
      ctx.drawImage(img, 55, 55, 270, 270, 0, 0, N, N);
      const data = ctx.getImageData(0, 0, N, N);
      const px = data.data;
      const lum = new Float32Array(N * N);
      for (let i = 0; i < N * N; i++) lum[i] = 0.2126 * px[i * 4] + 0.7152 * px[i * 4 + 1] + 0.0722 * px[i * 4 + 2];
      // Stretch levels between the 3rd and 97th percentile so the dither keeps her face legible.
      const sorted = Array.from(lum).sort((a, b) => a - b);
      const lo = sorted[Math.floor(N * N * 0.03)];
      const hi = sorted[Math.floor(N * N * 0.97)];
      const ink = [13, 13, 11];
      const paper = [242, 240, 232];
      for (let y = 0; y < N; y++) {
        for (let x = 0; x < N; x++) {
          const i = y * N + x;
          const v = Math.min(1, Math.max(0, (lum[i] - lo) / Math.max(1, hi - lo)));
          const t = (BAYER8[y % 8][x % 8] + 0.5) / 64;
          const c2 = Math.pow(v, 0.8) > t ? paper : ink;
          px[i * 4] = c2[0];
          px[i * 4 + 1] = c2[1];
          px[i * 4 + 2] = c2[2];
          px[i * 4 + 3] = 255;
        }
      }
      ctx.putImageData(data, 0, 0);
      setReady(true);
    };
    return () => {
      alive = false;
    };
  }, []);

  const showPhoto = photo || !ready;

  return (
    <figure className="bm-portrait">
      <div className="bm-portrait-frame">
        <Image
          src={profile.photo}
          alt={showPhoto ? "Portrait of Pragati Srivastava" : ""}
          width={192}
          height={192}
          className="bm-portrait-img"
          hidden={!showPhoto}
          priority
        />
        <canvas
          ref={canvas}
          className="bm-portrait-dither"
          hidden={showPhoto}
          role="img"
          aria-label="Portrait of Pragati Srivastava, ordered-dither halftone"
        />
      </div>
      <figcaption>
        <button type="button" className="bm-chip" aria-pressed={photo} onClick={() => setPhoto((p) => !p)} disabled={!ready}>
          {photo ? "Show dither" : "Show photo"}
        </button>
        <span className="bm-portrait-note num">{photo ? "400 px source" : "64 x 64, Bayer 8"}</span>
      </figcaption>
    </figure>
  );
}
