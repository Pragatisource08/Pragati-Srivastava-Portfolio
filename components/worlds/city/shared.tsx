"use client";

import { createContext, useContext, useEffect, useRef, useState, type RefObject } from "react";
import { links } from "@/lib/content";
import { Icon } from "@/components/icons";
import { s } from "./cls";

export type Hour = "blue" | "night" | "rain" | "dawn";
export type Depth = "express" | "all";

export const HOURS: { id: Hour; label: string; short: string }[] = [
  { id: "blue", label: "Blue hour", short: "Blue" },
  { id: "night", label: "Night", short: "Night" },
  { id: "rain", label: "Rain", short: "Rain" },
  { id: "dawn", label: "Dawn", short: "Dawn" },
];

export const CityContext = createContext<{ hour: Hour; depth: Depth }>({ hour: "blue", depth: "express" });
export const useCity = () => useContext(CityContext);

/** True when the user asks for reduced motion. Starts false on the server. */
export function useReducedMotionPref() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

/** True while the element is on screen and the tab is visible. */
export function useActive(ref: RefObject<Element | null>, margin = "120px") {
  const [onScreen, setOnScreen] = useState(false);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), { rootMargin: margin });
    io.observe(el);
    const onVis = () => setVisible(document.visibilityState === "visible");
    onVis();
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [ref, margin]);
  return onScreen && visible;
}

/** requestAnimationFrame loop that runs only while `active`. Passes clamped dt in ms. */
export function useFrame(active: boolean, cb: (dt: number, now: number) => void) {
  const cbRef = useRef(cb);
  useEffect(() => {
    cbRef.current = cb;
  });
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(100, now - last);
      last = now;
      cbRef.current(dt, now);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [active]);
}

/** The end of every game: email Pragati, or play again. */
export function EndCall({
  line,
  emailLabel = "Email Pragati",
  onAgain,
  againLabel = "Play again",
}: {
  line: string;
  emailLabel?: string;
  onAgain: () => void;
  againLabel?: string;
}) {
  return (
    <div className={s.endCall}>
      <p className={s.endLine}>{line}</p>
      <div className={s.endActions}>
        <a className={s.btnAmber} href={links.mailto}>
          <Icon name="mail" size={18} />
          {emailLabel}
        </a>
        <button type="button" className={s.btnGhost} onClick={onAgain}>
          <Icon name="replay" size={18} />
          {againLabel}
        </button>
      </div>
    </div>
  );
}

/** Small authored icons for the hour control (24px grid, same stroke as components/icons). */
export function HourIcon({ hour, size = 18 }: { hour: Hour; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  if (hour === "blue")
    return (
      <svg {...common}>
        <path d="M3 16h18" />
        <path d="M7 16a5 5 0 0 1 10 0" />
        <path d="M5 20h14" />
      </svg>
    );
  if (hour === "night")
    return (
      <svg {...common}>
        <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" />
      </svg>
    );
  if (hour === "rain")
    return (
      <svg {...common}>
        <path d="M17 13a4 4 0 0 0-1-7.9A5.5 5.5 0 0 0 5.6 7.5 3.5 3.5 0 0 0 6.5 13" />
        <path d="m8 16-1 3" />
        <path d="m12 15-1.5 5" />
        <path d="m16 16-1 3" />
      </svg>
    );
  return (
    <svg {...common}>
      <path d="M12 3v3" />
      <path d="m5.6 6.6 2 2" />
      <path d="m18.4 6.6-2 2" />
      <path d="M2 17h20" />
      <path d="M7 17a5 5 0 0 1 10 0" />
      <path d="M8 21h8" />
    </svg>
  );
}

export function ContactLinks({ large = false }: { large?: boolean }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(links.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(false);
    }
  };
  return (
    <div className={large ? `${s.contact} ${s.contactLarge}` : s.contact}>
      <a href={links.mailto} className={s.btnAmber}>
        <Icon name="mail" size={large ? 22 : 18} />
        Email Pragati
      </a>
      <ul className={s.contactLinks}>
        <li>
          <a href={links.linkedin} className={s.iconLink} target="_blank" rel="noreferrer">
            <Icon name="linkedin" size={18} />
            LinkedIn
          </a>
        </li>
        <li>
          <a href={links.github} className={s.iconLink} target="_blank" rel="noreferrer">
            <Icon name="github" size={18} />
            GitHub
          </a>
        </li>
        <li>
          <a href={links.resume} className={s.iconLink} target="_blank" rel="noreferrer">
            <Icon name="resume" size={18} />
            Resume PDF
          </a>
        </li>
        <li>
          <button type="button" className={s.iconLink} onClick={copy}>
            <Icon name={copied ? "check" : "copy"} size={18} />
            {copied ? "Address copied" : "Copy address"}
          </button>
        </li>
      </ul>
      <span className={s.srOnly} aria-live="polite">
        {copied ? "Email address copied to the clipboard." : ""}
      </span>
    </div>
  );
}
