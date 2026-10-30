"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { profile } from "@/lib/content";
import { EmailButton, ProfileLinks } from "./Contact";
import { DepthToggle } from "./Depth";

export const SECTIONS = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "open-source", label: "Open source" },
  { id: "background", label: "Background" },
  { id: "play", label: "Play" },
  { id: "contact", label: "Contact" },
] as const;

const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

/** Index of the section whose top has crossed a line one third down the viewport. */
function useActiveSection() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const line = window.innerHeight * 0.34;
      let idx = 0;
      SECTIONS.forEach((s, i) => {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= line) idx = i;
      });
      const doc = document.documentElement;
      if (window.innerHeight + window.scrollY >= doc.scrollHeight - 4) idx = SECTIONS.length - 1;
      setActive(idx);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);
  return active;
}

function SectionNav() {
  const active = useActiveSection();
  return (
    <nav aria-label="Sections" className="std-nav" style={{ "--active": active } as CSSProperties}>
      <span className="std-nav-rail std-in-draw" style={d(420)} aria-hidden="true" />
      <span className="std-nav-indicator" aria-hidden="true" />
      <ol>
        {SECTIONS.map((s, i) => (
          <li key={s.id} className="std-in" style={d(460 + i * 45)}>
            <a href={`#${s.id}`} className="std-nav-item" aria-current={active === i ? "true" : undefined}>
              {s.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function Identity() {
  return (
    <header className="std-aside flex flex-col pt-14 pb-12 sm:pt-20 lg:py-[clamp(40px,8vh,88px)]">
      <div className="flex min-h-0 flex-1 flex-col">
        {/* eslint-disable-next-line @next/next/no-img-element -- 400px source, fixed small render */}
        <img
          src={profile.photo}
          alt="Portrait of Pragati Srivastava"
          width={72}
          height={72}
          className="std-portrait std-in-portrait h-[72px] w-[72px]"
        />
        <h1 className="std-display std-name mt-6 overflow-hidden pb-1">
          <span className="std-in-mask" style={d(90)}>
            {profile.name}
          </span>
        </h1>
        <p className="std-in mt-3 text-[1.125rem] font-medium text-[color:var(--ink)]" style={d(220)}>
          {profile.role}
        </p>
        <p className="std-in mt-1 max-w-[30ch] text-[1.0625rem] leading-snug" style={d(270)}>
          I build {profile.focus}.
        </p>

        <div className="std-in mt-7 flex flex-col items-start gap-4" style={d(340)}>
          <EmailButton />
          <ProfileLinks />
        </div>

        <DepthToggle className="std-in mt-7" />

        <div className="mt-auto hidden pt-10 lg:block">
          <SectionNav />
        </div>
      </div>
    </header>
  );
}

/** Compact bar for small screens once the identity block has scrolled away. */
export function MobileBar() {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const sentinel = document.getElementById("std-identity-end");
    if (!sentinel) return;
    const io = new IntersectionObserver(([entry]) => setShown(entry.boundingClientRect.top < 0), {
      threshold: 0,
    });
    io.observe(sentinel);
    return () => io.disconnect();
  }, []);
  return (
    <div className="std-mobilebar" data-shown={shown} inert={!shown}>
      <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between gap-3 px-5">
        <a href="#about" className="std-display truncate text-[1.125rem] text-[color:var(--ink)]">
          {profile.name}
        </a>
        <EmailButton size="sm" />
      </div>
    </div>
  );
}
