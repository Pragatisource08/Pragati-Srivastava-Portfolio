import { density, logExposure } from "./model";
import s from "./cls";

const W = 280;
const H = 150;
const PAD = { l: 30, r: 10, t: 10, b: 26 };
const X0 = -1.1;
const X1 = 1.0;
const DMAX = 2.3;

const px = (x: number) => PAD.l + ((x - X0) / (X1 - X0)) * (W - PAD.l - PAD.r);
const py = (d: number) => H - PAD.b - (d / DMAX) * (H - PAD.t - PAD.b);

/**
 * The paper's characteristic curve at the current second in the developer, with
 * the two tones the verdict reads marked on it.
 */
export function CurvePlot({
  t,
  seconds,
  negOffset,
  shadowL,
  highlightL,
}: {
  t: number;
  seconds: number;
  negOffset: number;
  shadowL: number;
  highlightL: number;
}) {
  const pts: string[] = [];
  for (let i = 0; i <= 60; i++) {
    const x = X0 + ((X1 - X0) * i) / 60;
    pts.push(`${i ? "L" : "M"}${px(x).toFixed(1)},${py(density(x, t)).toFixed(1)}`);
  }
  const xs = logExposure(shadowL, seconds, negOffset);
  const xh = logExposure(highlightL, seconds, negOffset);
  const ds = density(xs, t);
  const dh = density(xh, t);

  return (
    <figure className={s.curve}>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-labelledby="curve-cap">
        {/* targets: blacks at or above 1.65, whites at or below 0.32 */}
        <line x1={PAD.l} x2={W - PAD.r} y1={py(1.65)} y2={py(1.65)} className={s.curveTarget} />
        <line x1={PAD.l} x2={W - PAD.r} y1={py(0.32)} y2={py(0.32)} className={s.curveTarget} />
        <text x={W - PAD.r} y={py(1.65) - 4} textAnchor="end" className={s.curveText}>
          black target 1.65
        </text>
        <text x={W - PAD.r} y={py(0.32) - 4} textAnchor="end" className={s.curveText}>
          white limit 0.32
        </text>
        <line x1={PAD.l} x2={PAD.l} y1={PAD.t} y2={H - PAD.b} className={s.curveAxis} />
        <line x1={PAD.l} x2={W - PAD.r} y1={H - PAD.b} y2={H - PAD.b} className={s.curveAxis} />
        <text x={PAD.l - 6} y={py(2) + 4} textAnchor="end" className={s.curveText}>
          2.0
        </text>
        <text x={PAD.l - 6} y={py(1) + 4} textAnchor="end" className={s.curveText}>
          1.0
        </text>
        <text x={PAD.l - 6} y={py(0) + 4} textAnchor="end" className={s.curveText}>
          0
        </text>
        <text x={(W + PAD.l) / 2} y={H - 6} textAnchor="middle" className={s.curveText}>
          log exposure
        </text>
        <path d={pts.join("")} className={s.curveLine} />
        <circle cx={px(xs)} cy={py(ds)} r={4.5} className={s.curveDot} />
        <circle cx={px(xh)} cy={py(dh)} r={4.5} className={s.curveDotHollow} />
      </svg>
      <figcaption id="curve-cap" className={s.curveCap}>
        Density against log exposure, now. Filled dot: her darkest tone, D {ds.toFixed(2)}. Ring: her
        brightest, D {dh.toFixed(2)}.
      </figcaption>
    </figure>
  );
}
