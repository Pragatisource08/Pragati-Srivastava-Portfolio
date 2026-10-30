"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { links } from "@/lib/content";
import { Icon } from "@/components/icons";
import { SmoothFilterDefs } from "./PixelText";
import "./bitmap.css";

type WorldState = { smooth: boolean; full: boolean };
const WorldContext = createContext<WorldState>({ smooth: false, full: false });
export const useWorld = () => useContext(WorldContext);

export const SHEETS = [
  { id: "work", label: "Work" },
  { id: "projects", label: "Projects" },
  { id: "source", label: "Source" },
  { id: "record", label: "Record" },
  { id: "viva", label: "Viva" },
  { id: "contact", label: "Contact" },
] as const;

function Switch({ on, onChange, label, hint }: { on: boolean; onChange: (v: boolean) => void; label: string; hint: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      title={hint}
      onClick={() => onChange(!on)}
      className="bm-switch"
    >
      <span className="bm-switch-track" aria-hidden="true">
        <span className="bm-switch-knob" />
      </span>
      <span className="bm-switch-label">{label}</span>
    </button>
  );
}

export function BitmapWorld({ children }: { children: ReactNode }) {
  const [smooth, setSmooth] = useState(false);
  const [full, setFull] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [announce, setAnnounce] = useState("");

  useEffect(() => {
    const els = SHEETS.map((s) => document.getElementById(s.id)).filter((e): e is HTMLElement => !!e);
    const hero = document.getElementById("pragati");
    const seen = new Map<string, boolean>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => seen.set(e.target.id, e.isIntersecting));
        const current = [...SHEETS].reverse().find((s) => seen.get(s.id));
        setActive(seen.get("pragati") && !current ? null : current?.id ?? null);
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    els.forEach((el) => io.observe(el));
    if (hero) io.observe(hero);
    return () => io.disconnect();
  }, []);

  return (
    <WorldContext.Provider value={{ smooth, full }}>
      <div className="bm bitmap-root" data-render={smooth ? "smooth" : "bitmap"} data-setting={full ? "text" : "display"}>
        <SmoothFilterDefs />
        <a href="#main" className="bm-skip">
          Skip to content
        </a>
        <header className="bm-mast">
          <nav aria-label="Specimen sheets" className="bm-nav">
            <ul>
              {SHEETS.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} aria-current={active === s.id ? "location" : undefined}>
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="bm-mast-main">
            <a href="#pragati" className="bm-wordmark">
              Pragati.
            </a>
            <div className="bm-switches">
              <Switch
                on={smooth}
                onChange={(v) => {
                  setSmooth(v);
                  setAnnounce(v ? "Smooth rendering on. Pixels traced into outlines." : "Bitmap rendering on. Every pixel shown.");
                }}
                label="Smooth"
                hint="Off: bitmap, every pixel shown. On: pixels traced into smooth outlines."
              />
              <Switch
                on={full}
                onChange={(v) => {
                  setFull(v);
                  setAnnounce(v ? "Full text setting. Every detail is shown." : "Display setting. The short read.");
                }}
                label="Full text"
                hint="Off: display setting, the short read. On: text setting, every detail."
              />
            </div>
            <a href={links.mailto} className="bm-mast-mail">
              <Icon name="mail" size={18} />
              <span>Email Pragati</span>
            </a>
          </div>
        </header>
        <p className="sr-only" aria-live="polite">
          {announce}
        </p>
        <main id="main" tabIndex={-1}>
          {children}
        </main>
      </div>
    </WorldContext.Provider>
  );
}
