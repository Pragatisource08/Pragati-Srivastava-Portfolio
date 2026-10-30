"use client";

import { useEffect, type ComponentType } from "react";
import { Annexure, BackCover } from "./Annexure";
import { FileStateProvider, useFile } from "./FileState";
import { archivo, kalam } from "./fonts";
import { CachePractical } from "./practicals/CachePractical";
import { CredibilityPractical } from "./practicals/CredibilityPractical";
import { PortsPractical } from "./practicals/PortsPractical";
import { VivaPractical } from "./practicals/VivaPractical";
import { Record as RecordSheet } from "./Record";
import { records, type Practical } from "./records";
import { EXTRA_ROWS, Spread } from "./Spread";
import { TopBar } from "./TopBar";
import { s } from "./styles";

const PRACTICALS: { [K in Practical]: ComponentType } = {
  cache: CachePractical,
  credibility: CredibilityPractical,
  ports: PortsPractical,
  viva: VivaPractical,
};

export function PracticalFile() {
  return (
    <FileStateProvider>
      <div className={`${s.root} ${archivo.variable} ${kalam.variable}`}>
        <Keys />
        <TopBar />
        <main>
          <Spread />
          <div className="mx-auto max-w-[1088px] space-y-12 px-4 pb-6 pt-6 sm:space-y-16 sm:px-6">
            {records.map((r) => {
              const Practical = r.practical ? PRACTICALS[r.practical] : null;
              return (
                <RecordSheet key={r.id} record={r}>
                  {Practical ? <Practical /> : null}
                </RecordSheet>
              );
            })}
            <Annexure />
          </div>
        </main>
        <BackCover />
      </div>
    </FileStateProvider>
  );
}

function Keys() {
  const { setCopy } = useFile();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.defaultPrevented) return;
      const el = e.target as HTMLElement;
      if (el.closest?.("input, textarea, select, [contenteditable], [data-local-keys]")) return;
      const key = e.key.toLowerCase();
      if (/^[1-9]$/.test(key)) {
        const n = Number(key);
        const id = n <= records.length ? records[n - 1].id : EXTRA_ROWS.find((r) => r.no === n)?.href.slice(1);
        const target = id ? document.getElementById(id) : null;
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ block: "start" });
          target.focus({ preventScroll: true });
        }
      } else if (key === "f") setCopy("fair");
      else if (key === "r") setCopy("rough");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setCopy]);
  return null;
}
