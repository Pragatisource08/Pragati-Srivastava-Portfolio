"use client";

import { useEffect, useRef, type RefObject } from "react";

/** requestAnimationFrame loop that runs only while `running`, the element is on screen, and the tab is visible. */
export function useVisibleLoop(ref: RefObject<HTMLElement | null>, running: boolean, onFrame: (dtMs: number) => void) {
  const cb = useRef(onFrame);
  useEffect(() => {
    cb.current = onFrame;
  });

  useEffect(() => {
    if (!running) return;
    const el = ref.current;
    let onScreen = true;
    let raf = 0;
    let last = 0;
    const frame = (t: number) => {
      const dt = last ? Math.min(100, t - last) : 0;
      last = t;
      if (dt) cb.current(dt);
      raf = requestAnimationFrame(frame);
    };
    const sync = () => {
      const go = onScreen && document.visibilityState === "visible";
      if (go && !raf) {
        last = 0;
        raf = requestAnimationFrame(frame);
      } else if (!go && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };
    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting;
      sync();
    });
    if (el) io.observe(el);
    document.addEventListener("visibilitychange", sync);
    sync();
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [running, ref]);
}
