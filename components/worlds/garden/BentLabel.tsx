"use client";

import { useEffect, useId, useRef } from "react";
import styles from "./styles";

type Pull = "rise" | "fall" | "orbit";

/**
 * A short label whose baseline bends along local gravity. The text pours
 * along its curve once when it enters view; the real heading text is
 * kept for assistive tech in a visually hidden span.
 */
export function BentHeading({
  id,
  text,
  pull,
  color,
  as: Tag = "h2",
  size = 44,
}: {
  id: string;
  text: string;
  pull: Pull;
  color: string;
  as?: "h2" | "h3";
  size?: number;
}) {
  const pathId = useId().replace(/:/g, "");
  const tp = useRef<SVGTextPathElement>(null);
  const width = Math.round(text.length * size * 0.56 + size * 1.6);
  const height = Math.round(size * 2.1);
  const base = height - size * 0.45;
  const bend = size * 0.55;
  const d =
    pull === "rise"
      ? `M 2 ${base} C ${width * 0.35} ${base} ${width * 0.65} ${base - bend * 0.4} ${width - size * 0.9} ${base - bend * 1.25}`
      : pull === "fall"
        ? `M 2 ${base - bend * 1.1} C ${width * 0.3} ${base - bend * 1.2} ${width * 0.6} ${base - bend * 0.2} ${width - size * 0.9} ${base}`
        : `M 2 ${base - bend * 0.2} Q ${width * 0.45} ${base - bend * 1.6} ${width - size * 0.9} ${base - bend * 0.2}`;
  // Where the label's cloud sits: at the end the text bends toward.
  const cx = width - size * 0.55;
  const cy = pull === "rise" ? base - bend * 1.25 - size * 0.25 : pull === "fall" ? base + size * 0.05 - size * 0.9 : base - bend * 0.6;

  useEffect(() => {
    const el = tp.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const run = (t: number) => {
          const k = Math.min(1, (t - t0) / 1100);
          const e = 1 - Math.pow(2, -10 * k); // expo out
          el.setAttribute("startOffset", `${(1 - e) * 14}%`);
          if (k < 1) raf = requestAnimationFrame(run);
        };
        raf = requestAnimationFrame(run);
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <Tag id={id} className={styles.bent}>
      <span className="sr-only">{text}</span>
      <svg
        aria-hidden="true"
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="block h-auto max-w-full overflow-visible"
      >
        <path id={pathId} d={d} fill="none" stroke={color} strokeOpacity="0.28" strokeWidth="1" strokeDasharray="2 6" />
        <text fill="var(--g-ink)" fontSize={size} className={styles.bentText}>
          <textPath ref={tp} href={`#${pathId}`} startOffset="0%">
            {text}
          </textPath>
        </text>
        <CloudGlyph x={cx} y={cy} r={size * 0.17} color={color} pull={pull} />
      </svg>
    </Tag>
  );
}

function CloudGlyph({ x, y, r, color, pull }: { x: number; y: number; r: number; color: string; pull: Pull }) {
  if (pull === "orbit") {
    return (
      <g>
        <circle cx={x} cy={y} r={r * 0.9} fill="#0b0e0c" stroke={color} strokeWidth="1" />
        <ellipse cx={x} cy={y} rx={r * 2} ry={r * 0.9} fill="none" stroke={color} strokeOpacity="0.7" strokeWidth="1" />
        <circle cx={x + r * 2} cy={y} r="2" fill={color} />
      </g>
    );
  }
  return (
    <g fill={color} fillOpacity="0.35" stroke={color} strokeWidth="1">
      <circle cx={x - r * 1.1} cy={y + r * 0.2} r={r * 0.8} />
      <circle cx={x} cy={y - r * 0.25} r={r} />
      <circle cx={x + r * 1.05} cy={y + r * 0.15} r={r * 0.75} />
    </g>
  );
}

/** A small rain-drop swatch, used as a region's cloud colour. */
export function DropSwatch({ color, size = 12 }: { color: string; size?: number }) {
  return (
    <svg aria-hidden="true" width={size} height={size * 1.3} viewBox="0 0 10 13" className="shrink-0">
      <path d="M5 0.6 C 5 0.6 9.2 6 9.2 8.4 A 4.2 4.2 0 0 1 0.8 8.4 C 0.8 6 5 0.6 5 0.6 Z" fill={color} />
    </svg>
  );
}
