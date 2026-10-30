"use client";

import { useState, useSyncExternalStore, type CSSProperties } from "react";
import { PixelText } from "./PixelText";
import { lineCols } from "./glyphs";
import { useWorld } from "./BitmapWorld";

const WORD = "PRAGATI";
const COLS = lineCols(WORD);
const STEPS = [8, 16, 24, 32] as const;

// Largest whole-pixel unit that fits, mirroring the .bm-u-hero media queries in bitmap.css.
function maxUnit(): number {
  const w = window.innerWidth;
  if (w >= 1440) return 32;
  if (w >= 1056) return 24;
  if (w >= 720) return 16;
  return 8;
}
const subscribe = (cb: () => void) => {
  window.addEventListener("resize", cb);
  return () => window.removeEventListener("resize", cb);
};

function HeadlineInner({ smoothDefault }: { smoothDefault: boolean }) {
  const max = useSyncExternalStore(subscribe, maxUnit, () => 0);
  const [pick, setPick] = useState<number | null>(null);
  const [split, setSplit] = useState(smoothDefault ? 0 : COLS);
  const unit = max ? Math.min(pick ?? max, max) : 0;

  const style = {
    "--u-pick": pick ? `${pick}px` : undefined,
    "--split": split,
    "--cols": COLS,
  } as CSSProperties;

  return (
    <div className="bm-headline bm-u-hero" style={style}>
      <h1 className="bm-h1">
        <span className="sr-only">Pragati Srivastava</span>
        <span className="bm-compare">
          <span className="bm-layer bm-layer-bit">
            <PixelText text={WORD} size="bm-u-hero" gap={0.125} develop nowrap />
          </span>
          <span className="bm-layer bm-layer-smooth">
            <PixelText text={WORD} size="bm-u-hero" gap={0.125} nowrap className="bmpx-traced" />
          </span>
          {split > 0 && split < COLS ? <span className="bm-split" aria-hidden="true" /> : null}
        </span>
      </h1>
      <div className="bm-headline-controls">
        <div className="bm-scale" role="group" aria-label="Headline size, in whole pixels">
          <span className="bm-ctl-label">Pixel</span>
          {STEPS.map((s) => {
            const fits = max === 0 || s <= max;
            return (
              <button
                key={s}
                type="button"
                className="bm-chip num"
                aria-pressed={unit === s}
                disabled={!fits}
                title={fits ? `Set each pixel to ${s} px` : "Needs a wider window"}
                onClick={() => setPick(s)}
              >
                {s}
              </button>
            );
          })}
        </div>
        <label className="bm-comparer">
          <span className="bm-ctl-label">Bitmap</span>
          <input
            type="range"
            min={0}
            max={COLS}
            step={1}
            value={split}
            onChange={(e) => setSplit(Number(e.target.value))}
            aria-label="Compare: columns of the headline shown as bitmap; the rest are traced smooth"
            aria-valuetext={`${split} of ${COLS} columns bitmap`}
          />
          <span className="bm-ctl-label">Smooth</span>
        </label>
      </div>
    </div>
  );
}

export function Headline() {
  const { smooth } = useWorld();
  return <HeadlineInner key={smooth ? "s" : "b"} smoothDefault={smooth} />;
}
