"use client";

import { useState } from "react";
import { links, profile } from "@/lib/content";
import { Icon } from "@/components/icons";
import { DropSwatch } from "./BentLabel";
import { DepthContext, type Depth } from "./depth";
import { GardenHero } from "./GardenHero";
import {
  EducationRegion,
  ExperienceRegion,
  GateRegion,
  OpenSourceRegion,
  ProjectsRegion,
  RecognitionRegion,
  REGIONS,
  SkillsRegion,
} from "./Regions";
import styles from "./styles";

function DepthToggle({ depth, setDepth }: { depth: Depth; setDepth: (d: Depth) => void }) {
  const opt = (d: Depth, name: string, hint: string) => (
    <button
      type="button"
      aria-pressed={depth === d}
      onClick={() => setDepth(d)}
      className={`${styles.press} flex items-baseline gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold ${
        depth === d ? "bg-[var(--g-moon)] text-[#1b201d]" : "text-[var(--g-ink-soft)] hover:text-[var(--g-ink)]"
      }`}
    >
      {name}
      <span className={`hidden font-normal xl:inline ${depth === d ? "text-[#3b3a2c]" : "text-[var(--g-ink-faint)]"}`}>{hint}</span>
    </button>
  );
  return (
    <div role="group" aria-label="How much rain: Drizzle is the short read, Downpour shows every detail" className="flex shrink-0 rounded-full border border-[var(--g-mist)] p-1">
      {opt("drizzle", "Drizzle", "short read")}
      {opt("downpour", "Downpour", "every detail")}
    </div>
  );
}

export function GardenWorld() {
  const [depth, setDepth] = useState<Depth>("drizzle");
  return (
    <DepthContext.Provider value={depth}>
      <div className={`${styles.root} min-h-screen w-full overflow-x-clip`}>
        <a
          href="#cache-bed"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-[var(--g-moon)] focus:px-4 focus:py-2 focus:text-[#1b201d]"
        >
          Skip to the garden regions
        </a>
        <header className="relative z-20 border-b border-[var(--g-mist)]/70 bg-[#323e38] lg:sticky lg:top-0">
          <div className="mx-auto flex max-w-[1600px] items-center gap-4 px-5 py-3 sm:px-8 lg:h-16 lg:px-12 lg:py-0">
            <a href="#top" className={`${styles.display} text-xl font-semibold text-[var(--g-ink)] no-underline`}>
              {profile.shortName}.
            </a>
            <nav aria-label="Garden regions" className="hidden min-w-0 flex-1 justify-center lg:flex">
              <ul className="flex items-center gap-1">
                {REGIONS.map((r) => (
                  <li key={r.id}>
                    <a
                      href={`#${r.id}`}
                      className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[14px] font-semibold text-[var(--g-ink-soft)] no-underline hover:bg-white/5 hover:text-[var(--g-ink)]"
                    >
                      <DropSwatch color={r.color} size={8} />
                      {r.name}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <DepthToggle depth={depth} setDepth={setDepth} />
              <a
                href={links.mailto}
                aria-label="Email Pragati"
                className={`${styles.press} hidden h-9 w-9 items-center justify-center rounded-full bg-[var(--g-blue)] text-[var(--g-blue-deep)] sm:inline-flex`}
              >
                <Icon name="mail" size={17} strokeWidth={2} />
              </a>
            </div>
          </div>
        </header>
        <main id="top">
          <GardenHero />
          <nav aria-label="Garden regions" className="border-t border-[var(--g-mist)]/60 lg:hidden">
            <ul className="flex flex-wrap gap-1 px-4 py-4 sm:px-7">
              {REGIONS.map((r) => (
                <li key={r.id}>
                  <a
                    href={`#${r.id}`}
                    className="flex items-center gap-1.5 rounded-full border border-[var(--g-mist)] px-3 py-1.5 text-sm font-semibold text-[var(--g-ink-soft)] no-underline"
                  >
                    <DropSwatch color={r.color} size={8} />
                    {r.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <ExperienceRegion />
          <ProjectsRegion />
          <OpenSourceRegion />
          <RecognitionRegion />
          <SkillsRegion />
          <EducationRegion />
          <GateRegion />
        </main>
        <footer className="border-t border-[var(--g-mist)]/60 px-5 pb-24 pt-8 text-sm text-[var(--g-ink-faint)] sm:px-8 lg:px-12">
          <p className="mx-auto max-w-[1280px]">
            {profile.name}. The rain on this page replays the same way every time: seed 9.
          </p>
        </footer>
      </div>
    </DepthContext.Provider>
  );
}
