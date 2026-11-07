"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icons";
import { fallbacks } from "@/lib/content";

const ADVANCE_MS = 5200;

// The hero's proof: each failure is struck through and her real fallback takes over.
export function PlanB() {
  const [active, setActive] = useState(0);
  const [held, setHeld] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (held || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let onScreen = true;
    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
    });
    if (rootRef.current) io.observe(rootRef.current);
    const timer = window.setInterval(() => {
      if (onScreen && !document.hidden) setActive((i) => (i + 1) % fallbacks.length);
    }, ADVANCE_MS);
    return () => {
      window.clearInterval(timer);
      io.disconnect();
    };
  }, [held]);

  return (
    <div
      className="badge-planb"
      ref={rootRef}
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={() => setHeld(false)}
    >
      <ul className="badge-sr">
        {fallbacks.map((f) => (
          <li key={f.source}>
            {f.failure}: {f.recovery}. From {f.source}.
          </li>
        ))}
      </ul>

      <div className="badge-planb-stack" aria-hidden="true">
        {fallbacks.map((f, i) => (
          <div key={f.source} className="badge-planb-case" data-active={i === active}>
            <p className="badge-planb-line" data-plan="a">
              <span className="badge-planb-tag">Plan A</span>
              <span className="badge-planb-fail">{f.failure}</span>
            </p>
            <p className="badge-planb-line" data-plan="b">
              <span className="badge-planb-tag">Plan B</span>
              <span className="badge-planb-fix">
                {f.recovery}
                <a href={f.href} tabIndex={i === active ? 0 : -1}>
                  {f.source}
                </a>
              </span>
            </p>
          </div>
        ))}
      </div>

      <button type="button" className="badge-planb-next" onClick={() => setActive((i) => (i + 1) % fallbacks.length)}>
        <Icon name="replay" size={16} />
        Break something else
      </button>
    </div>
  );
}
