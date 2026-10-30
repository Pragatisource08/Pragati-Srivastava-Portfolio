import type { ReactNode, Ref } from "react";
import { Icon, type IconName } from "@/components/icons";
import type { Seg } from "./art";
import { PORTRAIT } from "./portraitArt";

// Every primitive here sizes itself in character cells (1 cell = 0.5em wide, 1em tall),
// so the DOM stays real, selectable text that always lands on the 80x25 (or 40-column) grid.

export function cls(fg?: number, bg?: number) {
  return [fg !== undefined && fg >= 0 ? `bbs-c${fg}` : "", bg !== undefined && bg >= 0 ? `bbs-bg${bg}` : ""]
    .filter(Boolean)
    .join(" ");
}

export function Art({ rows, className = "", label }: { rows: Seg[][]; className?: string; label?: string }) {
  return (
    <div
      className={`bbs-art ${className}`}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {rows.map((row, i) => (
        <div key={i} className="bbs-art-row">
          {row.map(([t, f, b], j) => (
            <span key={j} className={cls(f, b)}>
              {t}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

export function Portrait({ className = "" }: { className?: string }) {
  return (
    <Art
      rows={PORTRAIT}
      className={`bbs-portrait ${className}`}
      label="ANSI block-art portrait of Pragati Srivastava, smiling, lit in cyan"
    />
  );
}

// A run of a box-drawing glyph that stretches to fill its row, clipped on a cell boundary.
const FILL_LEN = 240;
export function Fill({ ch = "═" }: { ch?: string }) {
  return (
    <span className="bbs-fill" aria-hidden>
      {ch.repeat(FILL_LEN)}
    </span>
  );
}

const VBAR_DOUBLE = "║\n".repeat(600);
const VBAR_SINGLE = "│\n".repeat(600);

type BoxProps = {
  title?: ReactNode;
  color?: number;
  titleColor?: number;
  single?: boolean;
  level?: 2 | 3;
  headingRef?: Ref<HTMLHeadingElement>;
  className?: string;
  children: ReactNode;
};

export function Box({ title, color = 3, titleColor = 15, single, level = 2, headingRef, className = "", children }: BoxProps) {
  const g = single
    ? { tl: "┌", tr: "┐", bl: "└", br: "┘", h: "─", v: VBAR_SINGLE }
    : { tl: "╔", tr: "╗", bl: "╚", br: "╝", h: "═", v: VBAR_DOUBLE };
  const H = level === 2 ? "h2" : "h3";
  return (
    <section className={`bbs-box bbs-c${color} ${className}`}>
      <div className="bbs-edge">
        <span aria-hidden>{g.tl + g.h}</span>
        {title ? (
          <>
            <span aria-hidden>{"[ "}</span>
            <H ref={headingRef} tabIndex={-1} className={`bbs-box-title bbs-c${titleColor}`}>
              {title}
            </H>
            <span aria-hidden>{" ]"}</span>
          </>
        ) : null}
        <Fill ch={g.h} />
        <span aria-hidden>{g.tr}</span>
      </div>
      <div className="bbs-box-body">
        <span className="bbs-vbar bbs-vbar-l" aria-hidden>
          {g.v}
        </span>
        <div className="bbs-box-inner">{children}</div>
        <span className="bbs-vbar bbs-vbar-r" aria-hidden>
          {g.v}
        </span>
      </div>
      <div className="bbs-edge" aria-hidden>
        <span>{g.bl}</span>
        <Fill ch={g.h} />
        <span>{g.br}</span>
      </div>
    </section>
  );
}

// A one-row rule with an optional label set into it: ──[ label ]────────
export function Rule({ label, color = 3, labelColor = 11, ch = "─" }: { label?: ReactNode; color?: number; labelColor?: number; ch?: string }) {
  return (
    <div className={`bbs-edge bbs-c${color}`}>
      {label ? (
        <>
          <span aria-hidden>{ch + ch + " "}</span>
          <span className={`bbs-c${labelColor}`}>{label}</span>
          <span aria-hidden>{" "}</span>
        </>
      ) : null}
      <Fill ch={ch} />
    </div>
  );
}

type KeyProps = {
  k: string; // the e.key it answers to: "1", "Q", "Escape"
  label: ReactNode;
  onClick?: () => void;
  href?: string;
  external?: boolean;
  download?: boolean;
  icon?: IconName;
  tone?: "menu" | "primary" | "plain";
  pressed?: boolean;
  disabled?: boolean;
  className?: string;
  describedBy?: string;
};

export function keyLabel(k: string) {
  return k === "Escape" ? "Esc" : k;
}

export function Key({ k, label, onClick, href, external, download, icon, tone = "menu", pressed, disabled, className = "", describedBy }: KeyProps) {
  const inner = (
    <>
      <span className="bbs-key" aria-hidden>
        [<span className="bbs-key-k">{keyLabel(k)}</span>]
      </span>{" "}
      {icon ? <Icon name={icon} className="bbs-icon" strokeWidth={2.25} /> : null}
      {icon ? " " : null}
      <span className="bbs-key-label">{label}</span>
      {external ? (
        <>
          {" "}
          <Icon name="arrowUpRight" className="bbs-icon bbs-icon-ext" strokeWidth={2.25} />
          <span className="bbs-sr"> (opens in a new tab)</span>
        </>
      ) : null}
    </>
  );
  const common = {
    "data-key": k,
    "aria-keyshortcuts": k,
    className: `bbs-btn bbs-btn-${tone} ${className}`,
    "aria-describedby": describedBy,
  };
  if (href) {
    return (
      <a
        {...common}
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        download={download || undefined}
      >
        {inner}
      </a>
    );
  }
  return (
    <button {...common} type="button" onClick={onClick} aria-pressed={pressed} disabled={disabled}>
      {inner}
    </button>
  );
}

// Inline link without a key binding, for links inside running text.
export function TextLink({ href, children, external = true }: { href: string; children: ReactNode; external?: boolean }) {
  return (
    <a
      className="bbs-link"
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
    >
      {children}
      {external ? (
        <>
          {" "}
          <Icon name="arrowUpRight" className="bbs-icon bbs-icon-ext" strokeWidth={2.25} />
          <span className="bbs-sr"> (opens in a new tab)</span>
        </>
      ) : null}
    </a>
  );
}

// A horizontal bar meter of block glyphs: value 0..1 over `width` cells.
export function Meter({ value, width, fg = 11, empty = 8 }: { value: number; width: number; fg?: number; empty?: number }) {
  const on = Math.round(Math.max(0, Math.min(1, value)) * width);
  return (
    <span aria-hidden className="bbs-meter">
      <span className={cls(fg)}>{"█".repeat(on)}</span>
      <span className={cls(empty)}>{"░".repeat(width - on)}</span>
    </span>
  );
}
