"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icons";
import { links } from "@/lib/content";

export function EmailButton({ size = "md", className = "" }: { size?: "md" | "sm"; className?: string }) {
  return (
    <a
      href={links.mailto}
      className={`std-btn std-btn-primary ${size === "sm" ? "std-btn-sm" : ""} ${className}`}
    >
      <Icon name="mail" size={size === "sm" ? 16 : 18} />
      Email Pragati
      {size === "md" ? <Icon name="arrowRight" size={16} className="std-btn-arrow" /> : null}
    </a>
  );
}

export function ProfileLinks({ className = "" }: { className?: string }) {
  return (
    <ul className={`std-link-row ${className}`} aria-label="Profiles">
      <li>
        <a className="std-link" href={links.linkedin} target="_blank" rel="noreferrer">
          <Icon name="linkedin" size={17} />
          LinkedIn
        </a>
      </li>
      <li>
        <a className="std-link" href={links.github} target="_blank" rel="noreferrer">
          <Icon name="github" size={17} />
          GitHub
        </a>
      </li>
      <li>
        <a className="std-link" href={links.resume} target="_blank" rel="noreferrer">
          <Icon name="resume" size={17} />
          Résumé
          <span className="sr-only"> (PDF)</span>
        </a>
      </li>
    </ul>
  );
}

export function CopyEmail() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(links.email);
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = links.mailto;
    }
  }

  return (
    <button type="button" onClick={copy} className="std-btn std-btn-quiet">
      <Icon name={copied ? "check" : "copy"} size={16} />
      <span aria-live="polite">{copied ? "Address copied" : "Copy address"}</span>
    </button>
  );
}
