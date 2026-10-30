"use client";

import { motion } from "motion/react";

const PEN = [0.65, 0, 0.35, 1] as const;

export function Tick({ show, size = 28, label }: { show: boolean; size?: number; label?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      role={label ? "img" : undefined}
      aria-label={show ? label : undefined}
      aria-hidden={label ? undefined : true}
    >
      <motion.path
        d="M4 17.5c2.6 1.8 5 4.4 7 7.6C15.4 16.4 21 9.2 28.5 4"
        stroke="var(--margin)"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={false}
        animate={{ pathLength: show ? 1 : 0, opacity: show ? 1 : 0 }}
        transition={{ pathLength: { duration: 0.45, ease: PEN }, opacity: { duration: 0.05 } }}
      />
    </svg>
  );
}

export function Cross({ show, size = 24 }: { show: boolean; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden>
      <motion.path
        d="M6 6.5c6.5 6 13 12.6 20 19.5M25.5 6C18.6 12 12.6 18.7 6.5 26"
        stroke="var(--margin)"
        strokeWidth={3}
        strokeLinecap="round"
        initial={false}
        animate={{ pathLength: show ? 1 : 0, opacity: show ? 1 : 0 }}
        transition={{ pathLength: { duration: 0.4, ease: PEN }, opacity: { duration: 0.05 } }}
      />
    </svg>
  );
}

// Authored examiner's signature: a quick looped scrawl.
export function Signature({ show, className }: { show: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 260 90" fill="none" className={className} aria-hidden>
      <motion.path
        d="M10 62c14-30 30-48 38-44 9 5-14 46-6 50 9 4 22-34 30-32 7 2-5 26 2 28 8 2 15-20 22-19 6 1 1 17 7 17 7 0 12-14 19-14 8 0 3 13 10 13 9 0 18-17 28-17 9 0 4 15 13 15 10 0 20-12 30-13M40 74c40-6 110-10 190-6"
        stroke="var(--margin)"
        strokeWidth={2.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={false}
        animate={{ pathLength: show ? 1 : 0, opacity: show ? 1 : 0 }}
        transition={{ pathLength: { duration: 1.4, ease: PEN }, opacity: { duration: 0.05 } }}
      />
    </svg>
  );
}

// A steel staple seen from the front: crown, highlight, and the two legs entering the paper.
export function Staple({ className }: { className?: string }) {
  return (
    <svg width="40" height="12" viewBox="0 0 40 12" className={className} aria-hidden>
      <path d="M4.5 6h31" stroke="#5f656c" strokeWidth="3.4" strokeLinecap="round" />
      <path d="M6 5.1h28" stroke="#d3d8de" strokeWidth="0.9" strokeLinecap="round" />
      <path d="M3.6 3.4v5.2M36.4 3.4v5.2" stroke="#2f3338" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
