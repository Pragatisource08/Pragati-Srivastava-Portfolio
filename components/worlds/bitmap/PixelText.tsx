import type { CSSProperties } from "react";
import { BAYER4, ROWS, layoutWord } from "./glyphs";

type Props = {
  text: string;
  /** CSS size class that sets --u (the pixel unit) per breakpoint. */
  size: string;
  /** Gap between pixels, in grid units. Pick it so gap x unit is a whole pixel at every size. */
  gap?: number;
  /** Develop the word pixel by pixel in Bayer order on first paint. */
  develop?: boolean;
  /** Extra delay for develop, in ms. */
  delay?: number;
  className?: string;
  style?: CSSProperties;
  /** Keep words on one line. */
  nowrap?: boolean;
  /** Too small to trace: in smooth mode, show the words as real text instead. */
  small?: boolean;
};

function rect(x: number, y: number, g: number) {
  const s = 1 - g;
  const o = g / 2;
  return `M${x + o} ${y + o}h${s}v${s}h${-s}z`;
}

/** Bitmap text drawn as SVG pixels. Decorative: pair it with real text for assistive tech. */
export function PixelText({ text, size, gap = 0, develop, delay = 0, className, style, nowrap, small }: Props) {
  const words = text.split(/\s+/).filter(Boolean);
  return (
    <span
      aria-hidden="true"
      className={`bmpx ${size}${nowrap ? " bmpx-nowrap" : ""}${develop ? " bmpx-dev" : ""}${small ? " bmpx-small" : ""}${className ? ` ${className}` : ""}`}
      style={style}
    >
      {words.map((w, wi) => {
        const { cols, pixels } = layoutWord(w);
        let body;
        if (develop) {
          const levels: string[] = Array.from({ length: 16 }, () => "");
          pixels.forEach(([x, y]) => {
            levels[BAYER4[y % 4][(x + wi) % 4]] += rect(x, y, gap);
          });
          body = levels.map((d, i) =>
            d ? (
              <path
                key={i}
                d={d}
                style={{ animationDelay: `${delay + wi * 70 + i * 34}ms` }}
              />
            ) : null
          );
        } else {
          body = <path d={pixels.map(([x, y]) => rect(x, y, gap)).join("")} />;
        }
        return (
          <svg
            key={`${w}-${wi}`}
            viewBox={`0 0 ${cols} ${ROWS}`}
            shapeRendering="crispEdges"
            style={{ width: `calc(${cols} * var(--u))`, height: `calc(${ROWS} * var(--u))` }}
          >
            <g className="bmpx-g">{body}</g>
          </svg>
        );
      })}
      {small ? <span className="bmpx-alt">{text}</span> : null}
    </span>
  );
}

/** The smooth-outline filter: blur the bitmap, then threshold its alpha into a traced contour. */
export function SmoothFilterDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true" style={{ position: "absolute" }} focusable="false">
      <defs>
        <filter id="bm-smooth" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
          {/* Close the visible gaps between pixels first, so strokes trace as one contour. */}
          <feMorphology operator="dilate" radius="0.14" />
          <feGaussianBlur stdDeviation="0.4" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="9" intercept="-4.6" />
          </feComponentTransfer>
        </filter>
      </defs>
    </svg>
  );
}
