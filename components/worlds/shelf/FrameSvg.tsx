"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { MotionValue } from "motion/react";

// Draws one compartment in reverse perspective. The front opening is the padded content
// area; the back edge of every board lies further OUT than its front edge, so the box
// flares toward the viewer instead of receding. flare = 0 is a flat front, 1 fills the
// cell, above 1 the back spills past the cell, toward you.
export function frameGeometry(w: number, h: number, s: number, t: number, f: number) {
  const L = s;
  const R = w - s;
  const T = t;
  const B = h;
  const bl = s * (1 - f);
  const br = w - bl;
  const bt = t * (1 - f);
  const rise = Math.min(s * 1.1, h * 0.09) * f;
  const sb = h - rise;
  const pt = (x: number, y: number) => `${x.toFixed(1)},${y.toFixed(1)}`;
  const top = [pt(L, T), pt(R, T), pt(br, bt), pt(bl, bt)].join(" ");
  const left = [pt(L, T), pt(bl, bt), pt(bl, sb), pt(L, B)].join(" ");
  const right = [pt(R, T), pt(br, bt), pt(br, sb), pt(R, B)].join(" ");
  let grain = "";
  // Painted grain lines run front-to-back and diverge: the tell of reverse perspective.
  for (const k of [0.2, 0.4, 0.6, 0.8]) {
    grain += `M${pt(L + (R - L) * k, T)}L${pt(bl + (br - bl) * k, bt)}`;
  }
  for (const k of [1 / 3, 2 / 3]) {
    grain += `M${pt(L, T + (B - T) * k)}L${pt(bl, bt + (sb - bt) * k)}`;
    grain += `M${pt(R, T + (B - T) * k)}L${pt(br, bt + (sb - bt) * k)}`;
  }
  return { top, left, right, grain, opening: `M${pt(L, T)}H${R.toFixed(1)}V${B.toFixed(1)}H${L.toFixed(1)}Z` };
}

export function FrameSvg({
  s,
  t,
  flare,
  crown = false,
}: {
  s: number;
  t: number;
  flare: MotionValue<number>;
  crown?: boolean;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const topRef = useRef<SVGPolygonElement>(null);
  const leftRef = useRef<SVGPolygonElement>(null);
  const rightRef = useRef<SVGPolygonElement>(null);
  const grainRef = useRef<SVGPathElement>(null);
  const openRef = useRef<SVGPathElement>(null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const r = entries[0].contentRect;
      setSize((prev) =>
        prev && Math.abs(prev.w - r.width) < 0.5 && Math.abs(prev.h - r.height) < 0.5
          ? prev
          : { w: r.width, h: r.height }
      );
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useLayoutEffect(() => {
    if (!size) return;
    const draw = (f: number) => {
      const g = frameGeometry(size.w, size.h, s, t, f);
      topRef.current?.setAttribute("points", g.top);
      leftRef.current?.setAttribute("points", g.left);
      rightRef.current?.setAttribute("points", g.right);
      grainRef.current?.setAttribute("d", g.grain);
      openRef.current?.setAttribute("d", g.opening);
    };
    draw(flare.get());
    return flare.on("change", draw);
  }, [size, s, t, flare]);

  return (
    <svg
      ref={svgRef}
      className="shelf-frame"
      viewBox={size ? `0 0 ${size.w} ${size.h}` : undefined}
      aria-hidden="true"
      focusable="false"
    >
      {size ? (
        <>
          <polygon ref={leftRef} className={crown ? "shelf-board-crown" : "shelf-board-left"} />
          <polygon ref={rightRef} className={crown ? "shelf-board-crown" : "shelf-board-right"} />
          <polygon ref={topRef} className="shelf-board-top" />
          <path ref={grainRef} className="shelf-grain" />
          <path ref={openRef} className="shelf-opening-edge" />
        </>
      ) : null}
    </svg>
  );
}
