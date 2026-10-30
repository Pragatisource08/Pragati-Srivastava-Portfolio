"use client";

import { useEffect, useState } from "react";
import { Icon, type IconName } from "@/components/icons";
import { links } from "@/lib/content";

export function EmailAction({ label = "Email Pragati", size = "md" }: { label?: string; size?: "md" | "lg" }) {
  return (
    <a href={links.mailto} className={`shelf-email shelf-email-${size}`}>
      <span className="shelf-email-seal" aria-hidden="true">
        <Icon name="mail" size={size === "lg" ? 22 : 18} />
      </span>
      <span>{label}</span>
    </a>
  );
}

const SEALS: { name: IconName; label: string; href: string; external: boolean }[] = [
  { name: "linkedin", label: "LinkedIn", href: links.linkedin, external: true },
  { name: "github", label: "GitHub", href: links.github, external: true },
  { name: "resume", label: "Resume", href: links.resume, external: false },
];

export function SealLinks() {
  return (
    <ul className="shelf-seals">
      {SEALS.map((s) => (
        <li key={s.name}>
          <a
            href={s.href}
            className="shelf-seal"
            {...(s.external ? { target: "_blank", rel: "noopener noreferrer" } : { target: "_blank" })}
          >
            <span className="shelf-seal-stamp" aria-hidden="true">
              <Icon name={s.name} size={16} />
            </span>
            <span>
              {s.label}
              {s.name === "resume" ? <span className="shelf-sr"> (PDF)</span> : null}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

export function CopyAddress() {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 2200);
    return () => window.clearTimeout(t);
  }, [copied]);
  return (
    <span className="shelf-copy-wrap">
      <button
        type="button"
        className="shelf-copy"
        onClick={() => {
          navigator.clipboard?.writeText(links.email).then(
            () => setCopied(true),
            () => setCopied(false)
          );
        }}
      >
        <Icon name={copied ? "check" : "copy"} size={15} />
        <span>{copied ? "Address copied" : "Copy address"}</span>
      </button>
      <span className="shelf-sr" aria-live="polite">
        {copied ? "Email address copied to clipboard" : ""}
      </span>
    </span>
  );
}

/** Every game ends here: a line in the shelf's voice, the letter to Pragati, and play again. */
export function GameEnd({
  headline,
  line,
  ask,
  onReplay,
}: {
  headline: string;
  line: string;
  ask: string;
  onReplay: () => void;
}) {
  return (
    <div className="shelf-game-end">
      <p className="shelf-game-end-head">{headline}</p>
      <p>{line}</p>
      <div className="shelf-game-end-actions">
        <EmailAction label="Email Pragati" />
        <button type="button" className="shelf-btn" onClick={onReplay}>
          <Icon name="replay" size={16} />
          <span>Play again</span>
        </button>
      </div>
      <p className="shelf-game-end-ask">{ask}</p>
    </div>
  );
}
