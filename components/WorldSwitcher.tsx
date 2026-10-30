"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { worlds } from "@/lib/worlds";
import { Icon } from "./icons";

// Review-only control for comparing the nine directions. Remove once one is chosen.
export function WorldSwitcher() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => {
      if (panel.current && !panel.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  return (
    <div
      ref={panel}
      style={{ fontFamily: "system-ui, sans-serif" }}
      className="fixed bottom-4 right-4 z-[1000] text-[13px] leading-tight"
    >
      {open && (
        <nav
          aria-label="Design directions"
          className="mb-2 w-60 overflow-hidden rounded-lg border border-black/15 bg-white text-neutral-900 shadow-[0_8px_30px_rgba(0,0,0,0.18)]"
        >
          <ul>
            {worlds.map((w, i) => {
              const active = w.href === pathname;
              return (
                <li key={w.slug}>
                  <Link
                    href={w.href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-3 px-3 py-2 outline-none hover:bg-neutral-100 focus-visible:bg-neutral-100 ${
                      active ? "font-semibold" : ""
                    }`}
                  >
                    <span className="w-4 text-right tabular-nums text-neutral-500">{i + 1}</span>
                    {w.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="ml-auto flex items-center gap-2 rounded-full border border-black/15 bg-white px-3.5 py-2 text-neutral-900 shadow-[0_4px_16px_rgba(0,0,0,0.16)] outline-none hover:bg-neutral-50 focus-visible:ring-2 focus-visible:ring-black"
      >
        <Icon name="layers" size={16} />
        Compare directions
      </button>
    </div>
  );
}
