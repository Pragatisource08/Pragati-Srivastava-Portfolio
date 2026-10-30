"use client";

import { motion } from "motion/react";
import { Icon } from "@/components/icons";
import { links, profile } from "@/lib/content";
import { useFile, type Copy } from "./FileState";
import { records } from "./records";
import { s } from "./styles";

const OPTIONS: { value: Copy; label: string; hint: string }[] = [
  { value: "fair", label: "Fair copy", hint: "The short read" },
  { value: "rough", label: "Rough work", hint: "Every detail" },
];

export function TopBar() {
  const { copy, setCopy, checked, signed } = useFile();

  return (
    <header className="sticky top-0 z-40 border-b-[1.5px] border-[var(--line)] bg-[var(--kraft)]">
      <div className="mx-auto flex h-14 max-w-[1320px] items-center justify-between gap-3 px-4 sm:px-6">
        <a href="#top" className={`${s.printed} text-[1.6rem] text-[var(--kraft-ink)]`}>
          {profile.shortName}
          <span className="text-[var(--red)]">.</span>
        </a>

        <p className="hidden items-center gap-2 text-sm text-[var(--kraft-ink)] md:flex" aria-live="polite">
          <span className={s.label} style={{ color: "var(--kraft-ink)" }}>
            Examiner
          </span>
          <span className="font-semibold">
            {signed ? "Signed" : `${checked.size} of ${records.length} checked`}
          </span>
        </p>

        <div className="flex items-center gap-2">
          <div
            role="radiogroup"
            aria-label="Reading depth"
            className="relative flex rounded-[4px] border-[1.5px] border-[var(--line)] bg-[var(--paper)] p-0.5"
          >
            {OPTIONS.map((o) => {
              const active = copy === o.value;
              return (
                <button
                  key={o.value}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  title={`${o.hint} (press ${o.value === "fair" ? "F" : "R"})`}
                  onClick={() => setCopy(o.value)}
                  className={`relative z-10 whitespace-nowrap rounded-[3px] px-2.5 py-1.5 text-[0.82rem] font-semibold transition-colors sm:px-3 ${
                    active ? "text-white" : "text-[var(--print-soft)] hover:text-[var(--ink)]"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="copy-switch"
                      className="absolute inset-0 -z-10 rounded-[3px] bg-[var(--ink)]"
                      transition={{ type: "spring", stiffness: 500, damping: 38 }}
                    />
                  )}
                  {o.label}
                </button>
              );
            })}
          </div>

          <a
            href={links.mailto}
            aria-label="Email Pragati"
            title="Email Pragati"
            className="grid h-9 w-9 place-items-center rounded-[4px] border-[1.5px] border-[var(--line)] bg-[var(--red)] text-white transition-colors hover:bg-[var(--red-press)]"
          >
            <Icon name="mail" size={18} />
          </a>
        </div>
      </div>
    </header>
  );
}
