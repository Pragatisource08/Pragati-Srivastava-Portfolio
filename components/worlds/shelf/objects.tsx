import Image from "next/image";
import type { ReactNode } from "react";
import { profile } from "@/lib/content";
import { C } from "./palette";

// Authored objects for the shelves. Flat mineral colour, an ink outline on every shape,
// no shadows. Top faces are drawn in reverse perspective: wider at the back.

const line = { stroke: C.ink, strokeWidth: 1.4, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

function Obj({ vb, children, className }: { vb: string; children: ReactNode; className?: string }) {
  return (
    <svg viewBox={vb} className={`shelf-obj ${className ?? ""}`} aria-hidden="true" focusable="false">
      <g {...line}>{children}</g>
    </svg>
  );
}

/** A top face in reverse perspective: front edge (x0..x1 at y) flares to a wider back edge. */
function topFace(x0: number, x1: number, y: number, depth: number, flare: number) {
  return `${x0},${y} ${x1},${y} ${x1 + flare},${y - depth} ${x0 - flare},${y - depth}`;
}

function Stitches({ x0, x1, y0, y1, n = 4, color = C.bone }: { x0: number; x1: number; y0: number; y1: number; n?: number; color?: string }) {
  const xs = Array.from({ length: n }, (_, i) => x0 + ((x1 - x0) * (i + 1)) / (n + 1));
  return (
    <g stroke={color} strokeWidth={1.6}>
      {xs.map((x) => (
        <line key={x} x1={x} y1={y0} x2={x} y2={y1} />
      ))}
    </g>
  );
}

const BOOK_COLORS: Record<string, [string, string, string]> = {
  bharatritu: [C.cin, C.cinLt, C.mal],
  airquality: [C.az, C.azLt, C.och],
  finances: [C.mal, C.malLt, C.cin],
};

/** A project as a book lying flat, its name on the spine, on top of a plain volume. */
export function BookObject({ slug, name }: { slug: string; name: string }) {
  const [cover, face, under] = BOOK_COLORS[slug] ?? [C.mal, C.malLt, C.och];
  const fs = Math.min(12, 118 / (name.length * 0.56));
  return (
    <Obj vb="0 0 160 96">
      <polygon points={topFace(14, 146, 70, 12, 7)} fill={C.ochLt} />
      <rect x={14} y={70} width={132} height={18} fill={under} />
      <Stitches x0={14} x1={146} y0={70} y1={88} n={5} />
      <polygon points={topFace(6, 154, 40, 20, 6)} fill={face} />
      <g stroke={C.ink} strokeWidth={1.2}>
        {[0.2, 0.4, 0.6, 0.8].map((k) => (
          <line key={k} x1={6 + 148 * k} y1={40} x2={0 + 160 * k} y2={20} strokeOpacity={0.35} />
        ))}
      </g>
      <rect x={6} y={40} width={148} height={30} fill={cover} />
      <rect x={20} y={44} width={120} height={22} fill={C.bone} />
      <text
        x={80}
        y={55.5}
        textAnchor="middle"
        dominantBaseline="middle"
        stroke="none"
        fill={C.ink}
        fontSize={fs}
        className="shelf-svg-display"
      >
        {name}
      </text>
    </Obj>
  );
}

/** The internship: a plain celadon jar with a paper tag. */
export function VesselObject() {
  return (
    <Obj vb="0 0 130 120">
      <path
        d="M50 18 C50 25 43 29 33 35 C15 46 15 76 33 95 C38 101 42 104 44 110 L86 110 C88 104 92 101 97 95 C115 76 115 46 97 35 C87 29 80 25 80 18 Z"
        fill={C.malLt}
      />
      <ellipse cx={65} cy={17} rx={15} ry={4.5} fill={C.malDk} />
      <path d="M36 40 C55 46 75 46 94 40" fill="none" strokeOpacity={0.6} />
      <path d="M26 82 C52 90 78 90 104 82" fill="none" strokeOpacity={0.6} />
      <rect x={44} y={108} width={42} height={5} fill={C.mal} />
      <path d="M56 24 L36 52" fill="none" stroke={C.cin} strokeWidth={1.6} />
      <rect x={8} y={50} width={46} height={20} fill={C.bone} />
      <text x={31} y={60.5} textAnchor="middle" dominantBaseline="middle" stroke="none" fill={C.ink} fontSize={10} className="shelf-svg-display">
        Cloud 9
      </text>
    </Obj>
  );
}

/** A merged pull request: a sealed letter, the seal stamped with its number. */
export function LetterObject({ number, tilt = 0 }: { number: number; tilt?: number }) {
  return (
    <Obj vb="0 0 150 100">
      <g transform={`rotate(${tilt} 75 55)`}>
        <rect x={14} y={22} width={122} height={66} fill={C.bone} />
        <path d="M14 22 L75 60 L136 22" fill="none" />
        <path d="M14 88 L60 52 M136 88 L90 52" fill="none" strokeOpacity={0.45} />
        <circle cx={75} cy={58} r={17} fill={C.cin} />
        <circle cx={75} cy={58} r={12.5} fill="none" stroke={C.bone} strokeWidth={1.2} />
        <text x={75} y={59} textAnchor="middle" dominantBaseline="middle" stroke="none" fill={C.bone} fontSize={10} fontWeight={700} className="shelf-svg-mono">
          {number}
        </text>
      </g>
    </Obj>
  );
}

/** Recognition: a medal on a ribbon beside two tied scrolls. */
export function MedalObject() {
  return (
    <Obj vb="0 0 160 100">
      <rect x={66} y={62} width={84} height={18} fill={C.bone} />
      <ellipse cx={66} cy={71} rx={4.5} ry={9} fill={C.och} />
      <ellipse cx={150} cy={71} rx={4.5} ry={9} fill={C.och} />
      <line x1={110} y1={62} x2={110} y2={80} stroke={C.cin} strokeWidth={2.4} />
      <rect x={74} y={44} width={70} height={18} fill={C.ochLt} />
      <ellipse cx={74} cy={53} rx={4.5} ry={9} fill={C.mal} />
      <ellipse cx={144} cy={53} rx={4.5} ry={9} fill={C.mal} />
      <line x1={104} y1={44} x2={104} y2={62} stroke={C.cin} strokeWidth={2.4} />
      <polygon points="22,6 36,6 44,48 30,58" fill={C.cin} />
      <polygon points="50,6 36,6 30,48 44,58" fill={C.az} />
      <circle cx={37} cy={70} r={20} fill={C.och} />
      <circle cx={37} cy={70} r={13} fill={C.ochLt} />
      <circle cx={37} cy={70} r={6} fill={C.och} />
    </Obj>
  );
}

/** Skills: a brush pot with one brush per skill group. */
export function BrushesObject({ count = 5 }: { count?: number }) {
  const tips: [number, number, string][] = [
    [26, 26, C.och],
    [42, 14, C.mal],
    [60, 8, C.cin],
    [78, 14, C.az],
    [94, 26, C.och],
  ];
  return (
    <Obj vb="0 0 120 124">
      {tips.slice(0, count).map(([x, y, color], i) => {
        const bx = 50 + i * 5;
        const by = 66;
        const ang = (Math.atan2(y - by, x - bx) * 180) / Math.PI + 90;
        return (
          <g key={i}>
            <line x1={bx} y1={by} x2={x} y2={y} stroke={C.ink} strokeWidth={6} />
            <line x1={bx} y1={by} x2={x} y2={y} stroke={color} strokeWidth={3.4} />
            <ellipse cx={x} cy={y - 4} rx={3.6} ry={8} fill={C.well} transform={`rotate(${ang} ${x} ${y - 4})`} />
          </g>
        );
      })}
      <polygon points={topFace(34, 86, 66, 9, 5)} fill={C.well} />
      <path d="M34 66 L34 114 Q60 120 86 114 L86 66 Z" fill={C.bone} />
      <rect x={34} y={74} width={52} height={7} fill={C.cin} />
      <rect x={34} y={100} width={52} height={4} fill={C.mal} />
    </Obj>
  );
}

/** Education: a stacked set of string-bound volumes. */
export function VolumesObject() {
  const books: [number, number, string][] = [
    [8, 146, C.mal],
    [12, 140, C.az],
    [6, 144, C.och],
    [14, 138, C.cin],
  ];
  return (
    <Obj vb="0 0 152 104">
      {books.map(([x0, x1, color], i) => {
        const y = 86 - i * 15;
        return (
          <g key={i}>
            <rect x={x0} y={y} width={x1 - x0} height={15} fill={color} />
            <Stitches x0={x0} x1={x1} y0={y} y1={y + 15} n={4} />
          </g>
        );
      })}
      <polygon points={topFace(14, 138, 41, 18, 6)} fill={C.cinLt} />
      <rect x={54} y={26} width={44} height={12} fill={C.bone} />
      <text x={76} y={32.5} textAnchor="middle" dominantBaseline="middle" stroke="none" fill={C.ink} fontSize={8.5} className="shelf-svg-display">
        B.Tech
      </text>
    </Obj>
  );
}

/** Contact: a document box holding a letter, three seals beside it. */
export function LetterBoxObject() {
  return (
    <Obj vb="0 0 160 104">
      <rect x={48} y={10} width={52} height={46} fill={C.bone} transform="rotate(-6 74 33)" />
      <circle cx={74} cy={30} r={7} fill={C.cin} />
      <polygon points={topFace(22, 124, 56, 14, 8)} fill={C.well} />
      <rect x={22} y={56} width={102} height={38} fill={C.och} />
      <rect x={30} y={63} width={86} height={24} fill="none" strokeOpacity={0.5} />
      {[132, 146].map((x, i) => (
        <g key={x}>
          <rect x={x - 6} y={64 + i * 8} width={12} height={30 - i * 8} fill={i ? C.az : C.mal} />
          <rect x={x - 6} y={58 + i * 8} width={12} height={6} fill={C.ochLt} />
        </g>
      ))}
      <rect x={128} y={94} width={22} height={4} fill={C.cin} />
    </Obj>
  );
}

/** Port Hunt: a puzzle box of ten drawers, some already taken. */
export function PuzzleBoxObject() {
  const held = new Set([0, 2, 3, 5, 7, 8]);
  return (
    <Obj vb="0 0 150 104">
      <polygon points={topFace(14, 136, 30, 16, 8)} fill={C.ochLt} />
      <rect x={14} y={30} width={122} height={66} fill={C.och} />
      {Array.from({ length: 10 }, (_, i) => {
        const col = i % 5;
        const row = Math.floor(i / 5);
        const x = 20 + col * 23.2;
        const y = 36 + row * 29;
        return (
          <g key={i}>
            <rect x={x} y={y} width={19} height={24} fill={held.has(i) ? C.cinLt : C.bone} />
            <circle cx={x + 9.5} cy={y + 12} r={2.2} fill={C.ink} />
          </g>
        );
      })}
    </Obj>
  );
}

/** Viva: a hand scroll, half unrolled, written in lines. */
export function ScrollObject() {
  return (
    <Obj vb="0 0 160 104">
      <rect x={34} y={30} width={104} height={52} fill={C.bone} />
      <g strokeOpacity={0.55}>
        {[40, 50, 60, 70].map((y, i) => (
          <line key={y} x1={46} y1={y} x2={i % 2 ? 108 : 124} y2={y} />
        ))}
      </g>
      <rect x={112} y={64} width={14} height={14} fill={C.cin} />
      <rect x={20} y={24} width={14} height={64} fill={C.mal} />
      <ellipse cx={27} cy={24} rx={9} ry={3.5} fill={C.och} />
      <ellipse cx={27} cy={88} rx={9} ry={3.5} fill={C.och} />
      <rect x={138} y={28} width={10} height={56} fill={C.malLt} />
      <path d="M20 56 C10 62 12 74 6 80" fill="none" stroke={C.cin} strokeWidth={1.8} />
    </Obj>
  );
}

/** Credibility: seal stamps and a stamped report slip. */
export function StampsObject() {
  return (
    <Obj vb="0 0 160 104">
      <rect x={10} y={56} width={84} height={38} fill={C.bone} />
      <g strokeOpacity={0.5}>
        <line x1={18} y1={66} x2={56} y2={66} />
        <line x1={18} y1={76} x2={50} y2={76} />
        <line x1={18} y1={86} x2={54} y2={86} />
      </g>
      <rect x={62} y={63} width={24} height={24} fill="none" stroke={C.cin} strokeWidth={2.4} />
      <rect x={68} y={69} width={12} height={12} fill={C.cin} stroke="none" />
      <polygon points={topFace(104, 126, 40, 8, 4)} fill={C.malLt} />
      <rect x={104} y={40} width={22} height={54} fill={C.mal} />
      <rect x={104} y={86} width={22} height={8} fill={C.cin} />
      <polygon points={topFace(132, 150, 54, 7, 3)} fill={C.azLt} />
      <rect x={132} y={54} width={18} height={40} fill={C.az} />
      <rect x={132} y={86} width={18} height={8} fill={C.cin} />
    </Obj>
  );
}

/** Her portrait as a hanging scroll. The photo never exceeds 200 CSS px. */
export function HangingScroll({ size }: { size: number }) {
  const w = size + 28;
  return (
    <span className="shelf-hanging" style={{ width: w }}>
      <svg viewBox={`0 0 ${w} 22`} width={w} height={22} aria-hidden="true" focusable="false">
        <g {...line}>
          <path d={`M${w / 2 - 16} 13 L${w / 2} 2 L${w / 2 + 16} 13`} fill="none" />
          <rect x={4} y={12} width={w - 8} height={6} fill={C.och} />
          <rect x={0} y={11} width={6} height={8} fill={C.well} />
          <rect x={w - 6} y={11} width={6} height={8} fill={C.well} />
        </g>
      </svg>
      <span className="shelf-hanging-silk">
        <Image
          src={profile.photo}
          alt={`Portrait of ${profile.name}`}
          width={size}
          height={size}
          sizes={`${size}px`}
          className="shelf-hanging-photo"
        />
      </span>
      <svg viewBox={`0 0 ${w} 14`} width={w} height={14} aria-hidden="true" focusable="false">
        <g {...line}>
          <rect x={6} y={3} width={w - 12} height={8} fill={C.malDk} />
          <rect x={0} y={1} width={8} height={12} fill={C.och} />
          <rect x={w - 8} y={1} width={8} height={12} fill={C.och} />
        </g>
      </svg>
    </span>
  );
}
