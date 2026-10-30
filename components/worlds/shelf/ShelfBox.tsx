"use client";

import { animate, motion, useMotionValue, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Icon } from "@/components/icons";
import { FrameSvg } from "./FrameSvg";
import { EASE } from "./palette";

export type BoxKind = "content" | "game" | "empty";

export type ShelfBoxProps = {
  id: string;
  kind: BoxKind;
  open: boolean;
  /** Spines mode: the one active box spills furthest toward the viewer. */
  active: boolean;
  onToggle?: () => void;
  title?: string;
  sub?: ReactNode;
  object?: ReactNode;
  children?: ReactNode;
  order: number;
  cols: number;
};

function insets(open: boolean, compact: boolean) {
  if (compact) return open ? { s: 16, t: 18 } : { s: 10, t: 13 };
  return open ? { s: 30, t: 28 } : { s: 17, t: 19 };
}

/** The painted back of the cabinet: a double border and a plain lozenge, nothing more. */
function EmptyBack() {
  return (
    <svg className="shelf-empty-back" viewBox="0 0 200 140" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <rect x="8" y="8" width="184" height="124" />
      <rect x="14" y="14" width="172" height="112" />
      <path d="M100 26 L168 70 L100 114 L32 70 Z" />
      <path d="M100 44 L140 70 L100 96 L60 70 Z" />
      <path d="M14 14 L32 70 L14 126 M186 14 L168 70 L186 126 M100 26 V14 M100 114 V126" />
    </svg>
  );
}

export function ShelfBox({ id, kind, open, active, onToggle, title, sub, object, children, order, cols }: ShelfBoxProps) {
  const reduce = useReducedMotion();
  const flare = useMotionValue(0);
  const [hover, setHover] = useState(false);
  const loaded = useRef(false);
  const wasOpen = useRef(open);
  const btnRef = useRef<HTMLButtonElement>(null);
  const boxRef = useRef<HTMLElement>(null);
  const compact = cols <= 2;
  const { s, t } = insets(open, compact);
  const target = open ? (active ? 1.4 : 1.12) : hover ? 1.22 : 1;

  useEffect(() => {
    // First paint: every board unfolds from a flat front, a diagonal wave from the top-left.
    if (!loaded.current) {
      loaded.current = true;
      if (reduce) {
        flare.set(target);
        return;
      }
      const row = Math.floor(order / Math.max(cols, 1));
      const col = order % Math.max(cols, 1);
      const c = animate(flare, target, { delay: 0.12 + (row + col) * 0.07, duration: 1.1, ease: EASE });
      return () => c.stop();
    }
    const opening = open && !wasOpen.current;
    wasOpen.current = open;
    if (reduce) {
      flare.set(target);
      return;
    }
    if (opening) flare.set(0.35);
    const c = animate(flare, target, { duration: opening ? 0.8 : 0.35, ease: EASE });
    return () => c.stop();
    // order/cols only shape the first wave.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, open, reduce, flare]);

  useEffect(() => {
    if (!open || kind === "empty" || !boxRef.current) return;
    const el = boxRef.current;
    const id = window.setTimeout(() => {
      const r = el.getBoundingClientRect();
      if (r.top < 0 || r.top > window.innerHeight * 0.6) {
        el.scrollIntoView({ block: "start", behavior: reduce ? "auto" : "smooth" });
      }
    }, 60);
    return () => window.clearTimeout(id);
    // Only when this box is opened by the reader, not on depth switches.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open && active]);

  const panelId = `shelf-panel-${id}`;
  const headId = `shelf-head-${id}`;

  return (
    <motion.section
      ref={boxRef}
      layout="position"
      transition={{ layout: { duration: 0.55, ease: EASE } }}
      data-box={id}
      className={`shelf-box shelf-box-${kind}${open ? " is-open" : ""}${active ? " is-active" : ""}${hover ? " is-hover" : ""}`}
      style={{ paddingTop: t, paddingLeft: s, paddingRight: s }}
      aria-labelledby={kind === "empty" ? undefined : headId}
      aria-hidden={kind === "empty" ? true : undefined}
      onKeyDown={(e) => {
        if (e.key === "Escape" && open && onToggle) {
          e.stopPropagation();
          onToggle();
          btnRef.current?.focus();
        }
      }}
    >
      <div className="shelf-opening">
        {kind === "empty" ? (
          <EmptyBack />
        ) : (
          <>
            <button
              ref={btnRef}
              type="button"
              id={headId}
              className="shelf-box-btn"
              aria-expanded={open}
              aria-controls={panelId}
              onClick={onToggle}
              onPointerEnter={() => setHover(true)}
              onPointerLeave={() => setHover(false)}
              onFocus={() => setHover(true)}
              onBlur={() => setHover(false)}
            >
              <span className="shelf-slip">
                <span className="shelf-slip-title">{title}</span>
                {sub ? <span className="shelf-slip-sub">{sub}</span> : null}
              </span>
              <span className="shelf-box-object">{object}</span>
              <span className="shelf-box-hint" aria-hidden="true">
                <Icon name={open ? "x" : kind === "game" ? "play" : "layers"} size={14} />
                <span>{open ? "Close" : kind === "game" ? "Play" : "Open"}</span>
              </span>
            </button>
            <div id={panelId} hidden={!open} className="shelf-panel-wrap">
              {open ? (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.12, ease: EASE }}
                >
                  {children}
                </motion.div>
              ) : null}
            </div>
          </>
        )}
      </div>
      <FrameSvg s={s} t={t} flare={flare} />
    </motion.section>
  );
}
