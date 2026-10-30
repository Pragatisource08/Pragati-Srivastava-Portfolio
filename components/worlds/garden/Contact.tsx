"use client";

import { useState } from "react";
import { Icon, type IconName } from "@/components/icons";
import { links } from "@/lib/content";
import styles from "./styles";

export function EmailButton({ label = "Email Pragati", large = false }: { label?: string; large?: boolean }) {
  return (
    <a
      href={links.mailto}
      className={`${styles.press} inline-flex items-center gap-2.5 rounded-full bg-[var(--g-blue)] font-semibold text-[var(--g-blue-deep)] no-underline hover:bg-[#a9d4f5] ${
        large ? "px-7 py-4 text-lg" : "px-5 py-3 text-base"
      }`}
    >
      <Icon name="mail" size={large ? 22 : 19} strokeWidth={2} />
      {label}
    </a>
  );
}

const secondary: { name: IconName; label: string; href: string; external: boolean }[] = [
  { name: "linkedin", label: "LinkedIn", href: links.linkedin, external: true },
  { name: "github", label: "GitHub", href: links.github, external: true },
  { name: "resume", label: "Resume PDF", href: links.resume, external: true },
];

export function SecondaryLinks() {
  return (
    <ul className="flex flex-wrap items-center gap-x-1 gap-y-1">
      {secondary.map((l) => (
        <li key={l.name}>
          <a
            href={l.href}
            target="_blank"
            rel="noreferrer"
            className={`${styles.press} inline-flex items-center gap-2 rounded-full px-3 py-2 text-[15px] font-semibold text-[var(--g-ink-soft)] no-underline hover:bg-white/5 hover:text-[var(--g-ink)]`}
          >
            <Icon name={l.name} size={18} />
            {l.label}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

export function CopyAddress() {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(links.email);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 2200);
        } catch {
          setCopied(false);
        }
      }}
      className={`${styles.press} inline-flex items-center gap-2 rounded-full border border-[var(--g-mist)] px-3.5 py-2 text-sm font-semibold text-[var(--g-ink-soft)] hover:border-[var(--g-ink-faint)] hover:text-[var(--g-ink)]`}
    >
      <Icon name={copied ? "check" : "copy"} size={16} />
      <span aria-live="polite">{copied ? "Address copied" : "Copy address"}</span>
    </button>
  );
}

/** The ending every game shares: the rain reaches Pragati. */
export function GameEnd({
  title,
  line,
  cta,
  onAgain,
}: {
  title: string;
  line: string;
  cta: string;
  onAgain: () => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className={`${styles.display} text-2xl font-medium text-[var(--g-ink)]`}>{title}</p>
        <p className="mt-1 max-w-[52ch] text-[var(--g-ink-soft)]">{line}</p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <EmailButton label={cta} />
        <button
          type="button"
          onClick={onAgain}
          className={`${styles.press} inline-flex items-center gap-2 rounded-full border border-[var(--g-mist)] px-4 py-2.5 font-semibold text-[var(--g-ink-soft)] hover:border-[var(--g-ink-faint)] hover:text-[var(--g-ink)]`}
        >
          <Icon name="replay" size={17} />
          Play again
        </button>
      </div>
    </div>
  );
}
