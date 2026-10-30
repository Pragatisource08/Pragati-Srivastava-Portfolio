"use client";

import { useState } from "react";
import { Icon } from "@/components/icons";
import { links } from "@/lib/content";
import s from "./cls";

/** The contact row: email first, then LinkedIn, GitHub and the resume. */
export function Contact({ tone = "amber", copy = false }: { tone?: "amber" | "dark"; copy?: boolean }) {
  const [copied, setCopied] = useState(false);

  const doCopy = async () => {
    try {
      await navigator.clipboard.writeText(links.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className={s.contact} data-tone={tone}>
      <a href={links.mailto} className={s.btnMail}>
        <Icon name="mail" size={20} />
        Email Pragati
      </a>
      <a href={links.linkedin} className={s.btnLink} target="_blank" rel="noreferrer">
        <Icon name="linkedin" size={18} />
        LinkedIn
      </a>
      <a href={links.github} className={s.btnLink} target="_blank" rel="noreferrer">
        <Icon name="github" size={18} />
        GitHub
      </a>
      <a href={links.resume} className={s.btnLink} target="_blank" rel="noreferrer">
        <Icon name="resume" size={18} />
        Resume (PDF)
      </a>
      {copy && (
        <button type="button" className={s.btnCopy} onClick={doCopy}>
          <Icon name={copied ? "check" : "copy"} size={16} />
          <span aria-live="polite">{copied ? "Address copied" : "Copy email address"}</span>
        </button>
      )}
    </div>
  );
}
