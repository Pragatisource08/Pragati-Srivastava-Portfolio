"use client";

import { useEffect, useState, type ReactNode } from "react";
import s from "./cls";

export const STATIONS = [
  { id: "compose", name: "Compose", plain: "About" },
  { id: "expose", name: "Expose", plain: "Internship" },
  { id: "develop", name: "Develop", plain: "Projects" },
  { id: "fix", name: "Fix", plain: "Open source" },
  { id: "wash", name: "Wash", plain: "Skills" },
  { id: "dry", name: "Dry", plain: "Recognition" },
] as const;

type Depth = "strip" | "full";

/**
 * Page root. Holds the reading depth (test strip or full print) as one whole-page
 * state, and the station strip, whose cells darken as each station is reached and
 * never lighten again.
 */
export function Shell({ fontClass, children }: { fontClass: string; children: ReactNode }) {
  const [depth, setDepth] = useState<Depth>("strip");
  const [current, setCurrent] = useState<string>("compose");
  const [reached, setReached] = useState<number>(0);

  useEffect(() => {
    const els = STATIONS.map((st) => document.getElementById(st.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const idx = STATIONS.findIndex((st) => st.id === e.target.id);
          setCurrent(e.target.id);
          setReached((r) => Math.max(r, idx));
        }
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className={`${s.root} ${fontClass}`} data-depth={depth}>
      <a href="#main" className={s.skip}>
        Skip to content
      </a>
      <header className={s.bar}>
        <a href="#compose" className={s.logo} aria-label="Pragati, back to top">
          Pragati.
        </a>
        <nav aria-label="Stations" className={s.stationNav}>
          <ol className={s.stationStrip}>
            {STATIONS.map((st, i) => (
              <li key={st.id}>
                <a
                  href={`#${st.id}`}
                  className={s.cell}
                  data-reached={i <= reached ? "true" : undefined}
                  data-step={i}
                  aria-current={current === st.id ? "location" : undefined}
                >
                  <span className={s.cellName}>{st.name}</span>
                  <span className={s.cellPlain}>{st.plain}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <div className={s.depth} role="group" aria-label="Reading depth">
          <button
            type="button"
            aria-pressed={depth === "strip"}
            onClick={() => setDepth("strip")}
            title="The short read: who she is and what she shipped"
          >
            Test strip
          </button>
          <button
            type="button"
            aria-pressed={depth === "full"}
            onClick={() => setDepth("full")}
            title="Every detail: how each system works"
          >
            Full print
          </button>
        </div>
      </header>
      <main id="main">{children}</main>
    </div>
  );
}
