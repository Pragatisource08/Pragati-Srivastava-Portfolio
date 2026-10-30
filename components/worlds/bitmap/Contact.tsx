"use client";

import { useEffect, useState } from "react";
import { links } from "@/lib/content";
import { Icon, type IconName } from "@/components/icons";

export function EmailButton({ label = "Email Pragati", className = "" }: { label?: string; className?: string }) {
  return (
    <a href={links.mailto} className={`bm-btn bm-btn-primary ${className}`}>
      <Icon name="mail" size={20} />
      <span>{label}</span>
    </a>
  );
}

const OTHER: { icon: IconName; label: string; href: string; note: string; external: boolean }[] = [
  { icon: "linkedin", label: "LinkedIn", href: links.linkedin, note: "Profile", external: true },
  { icon: "github", label: "GitHub", href: links.github, note: "Pragatisource08", external: true },
  { icon: "resume", label: "Resume", href: links.resume, note: "PDF", external: true },
];

export function CopyAddress() {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 2200);
    return () => window.clearTimeout(t);
  }, [copied]);
  return (
    <button
      type="button"
      className="bm-copy"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(links.email);
          setCopied(true);
        } catch {
          window.location.href = links.mailto;
        }
      }}
    >
      <Icon name={copied ? "check" : "copy"} size={16} />
      <span aria-live="polite">{copied ? "Address copied" : "Copy address"}</span>
    </button>
  );
}

export function ContactLinks({ className = "" }: { className?: string }) {
  return (
    <ul className={`bm-links ${className}`}>
      {OTHER.map((l) => (
        <li key={l.label}>
          <a href={l.href} target={l.external ? "_blank" : undefined} rel={l.external ? "noopener noreferrer" : undefined}>
            <Icon name={l.icon} size={18} />
            <span className="bm-links-label">{l.label}</span>
            <span className="bm-links-note">{l.note}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
