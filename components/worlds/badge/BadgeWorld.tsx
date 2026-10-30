"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { Icon } from "@/components/icons";
import { links } from "@/lib/content";

type Pass = "visitor" | "all";
const PassContext = createContext<{ pass: Pass; setPass: (p: Pass) => void }>({
  pass: "visitor",
  setPass: () => {},
});

/** Page root. Holds the reading depth: Visitor pass (short) or All-access (engineer detail). */
export function BadgeWorld({ className, children }: { className: string; children: ReactNode }) {
  const [pass, setPass] = useState<Pass>("visitor");
  return (
    <PassContext.Provider value={{ pass, setPass }}>
      <div className={`badge-root ${className}`} data-pass={pass}>
        {children}
        <p className="badge-sr" aria-live="polite">
          {pass === "all"
            ? "All-access pass: engineering detail is now shown in every zone."
            : "Visitor pass: the short read is shown."}
        </p>
      </div>
    </PassContext.Provider>
  );
}

export function PassToggle({ label }: { label: string }) {
  const { pass, setPass } = useContext(PassContext);
  return (
    <div className="badge-pass" role="group" aria-label={label}>
      <button type="button" aria-pressed={pass === "visitor"} onClick={() => setPass("visitor")}>
        <span className="badge-pass-swatch" data-kind="visitor" aria-hidden="true" />
        <span className="badge-pass-name">Visitor pass</span>
        <span className="badge-pass-hint">short read</span>
      </button>
      <button type="button" aria-pressed={pass === "all"} onClick={() => setPass("all")}>
        <span className="badge-pass-swatch" data-kind="all" aria-hidden="true" />
        <span className="badge-pass-name">All-access</span>
        <span className="badge-pass-hint">engineer detail</span>
      </button>
    </div>
  );
}

export function CopyAddress({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(links.email);
      setState("copied");
    } catch {
      setState("failed");
    }
    window.setTimeout(() => setState("idle"), 2400);
  }, []);
  return (
    <button type="button" className="badge-copy" data-tone={tone} onClick={copy}>
      <Icon name={state === "copied" ? "check" : "copy"} size={16} />
      <span aria-live="polite">
        {state === "copied" ? "Address copied" : state === "failed" ? "Copy blocked: use Email Pragati" : "Copy address"}
      </span>
    </button>
  );
}
