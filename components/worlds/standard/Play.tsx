"use client";

import { useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import { PortHunt } from "./games/PortHunt";
import { Verify } from "./games/Verify";
import { Viva } from "./games/Viva";

const GAMES = [
  { id: "boot", label: "Boot the server", meta: "From PR #906 · 30 seconds", Game: PortHunt },
  { id: "viva", label: "Viva", meta: "Six questions · answers are on this page", Game: Viva },
  { id: "verify", label: "Verify a report", meta: "From BharatRitu · five reports", Game: Verify },
] as const;

export function Play() {
  const [current, setCurrent] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const [bar, setBar] = useState({ x: 0, w: 0 });

  useLayoutEffect(() => {
    const measure = () => {
      const el = tabs.current[current];
      if (el) setBar({ x: el.offsetLeft, w: el.offsetWidth });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [current]);

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const last = GAMES.length - 1;
    let to: number | null = null;
    if (e.key === "ArrowRight") to = current === last ? 0 : current + 1;
    if (e.key === "ArrowLeft") to = current === 0 ? last : current - 1;
    if (e.key === "Home") to = 0;
    if (e.key === "End") to = last;
    if (to === null) return;
    e.preventDefault();
    setCurrent(to);
    tabs.current[to]?.focus();
  }

  const g = GAMES[current];

  return (
    <div className="std-panel">
      <div role="tablist" aria-label="Games" className="std-tabs" onKeyDown={onKeyDown}>
        {GAMES.map((game, i) => (
          <button
            key={game.id}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            id={`std-tab-${game.id}`}
            role="tab"
            type="button"
            aria-selected={current === i}
            aria-controls={`std-tabpanel-${game.id}`}
            tabIndex={current === i ? 0 : -1}
            onClick={() => setCurrent(i)}
            className="std-tab"
          >
            {game.label}
          </button>
        ))}
        <span
          className="std-tab-indicator"
          aria-hidden="true"
          style={{ width: bar.w, transform: `translateX(${bar.x}px)` }}
        />
      </div>
      <div
        id={`std-tabpanel-${g.id}`}
        role="tabpanel"
        aria-labelledby={`std-tab-${g.id}`}
        className="p-5 sm:p-7"
      >
        <p className="std-meta mb-4">{g.meta}</p>
        <div key={g.id} className="std-panel-body">
          <g.Game />
        </div>
      </div>
    </div>
  );
}
