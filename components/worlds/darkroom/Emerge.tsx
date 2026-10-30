"use client";

import { useEffect, useRef, type ReactNode } from "react";
import s from "./cls";

/**
 * The develop station's reveal: the prints inside come up out of blank paper in
 * one continuous emergence the first time they reach the viewport, and stay
 * developed. Without script, or under reduced motion, they are simply there.
 */
export function Emerge({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const box = el.getBoundingClientRect();
    if (box.top < window.innerHeight * 0.9) return; // already on screen: never hide it
    el.dataset.latent = "true";
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        el.dataset.latent = "developing";
        io.disconnect();
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`${s.emerge} ${className ?? ""}`}>
      {children}
    </div>
  );
}
