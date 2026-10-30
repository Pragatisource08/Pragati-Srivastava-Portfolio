"use client";

import { createContext, useContext, useId, type ReactNode } from "react";

export type Depth = "recruiter" | "engineer";

type DepthValue = { depth: Depth; setDepth: (d: Depth) => void };

export const DepthContext = createContext<DepthValue>({ depth: "recruiter", setDepth: () => {} });

export function useDepth() {
  return useContext(DepthContext);
}

const HINT: Record<Depth, string> = {
  recruiter: "The short version: who, what, and where.",
  engineer: "Adds implementation notes, PR details, and scoring weights.",
};

export function DepthToggle({ className = "", showHint = true }: { className?: string; showHint?: boolean }) {
  const { depth, setDepth } = useDepth();
  const labelId = useId();
  return (
    <div className={className}>
      <div className="flex items-center gap-3">
        <span id={labelId} className="std-meta shrink-0">
          Read as
        </span>
        <div className="std-seg" role="group" aria-labelledby={labelId}>
          <span className="std-seg-thumb" aria-hidden="true" />
          <button type="button" aria-pressed={depth === "recruiter"} onClick={() => setDepth("recruiter")}>
            Recruiter
          </button>
          <button type="button" aria-pressed={depth === "engineer"} onClick={() => setDepth("engineer")}>
            Engineer
          </button>
        </div>
      </div>
      {showHint ? (
        <p className="std-meta mt-2" aria-live="polite">
          {HINT[depth]}
        </p>
      ) : null}
    </div>
  );
}

/** Content that only appears in the engineer read. Collapses to zero height and leaves the tab order. */
export function Detail({ children, className = "" }: { children: ReactNode; className?: string }) {
  const { depth } = useDepth();
  const open = depth === "engineer";
  return (
    <div className={`std-detail ${className}`}>
      <div inert={!open}>{children}</div>
    </div>
  );
}
