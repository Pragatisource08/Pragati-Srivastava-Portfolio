"use client";

import { useEffect, useRef } from "react";
import { buildLut, paint, type Negative } from "./model";

type Props = {
  neg: Negative | null;
  seconds: number;
  negOffset: number;
  t: number;
  className?: string;
  label: string;
};

/** One sheet of paper in the tray: repaints whenever the clock or exposure changes. */
export function PrintCanvas({ neg, seconds, negOffset, t, className, label }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const buf = useRef<ImageData | null>(null);

  useEffect(() => {
    const c = ref.current;
    if (!c || !neg) return;
    if (c.width !== neg.size) c.width = c.height = neg.size;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    if (!buf.current || buf.current.width !== neg.size) buf.current = ctx.createImageData(neg.size, neg.size);
    paint(buf.current, neg, buildLut(seconds, negOffset, t));
    ctx.putImageData(buf.current, 0, 0);
  }, [neg, seconds, negOffset, t]);

  return <canvas ref={ref} width={2} height={2} className={className} role="img" aria-label={label} />;
}
