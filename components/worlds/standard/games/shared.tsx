"use client";

import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { Icon } from "@/components/icons";
import { links } from "@/lib/content";

/** A fresh seed for a new run. Call it only from event handlers. */
export function freshSeed() {
  return Date.now();
}

/** True while the element is on screen and the tab is visible. */
export function useLoopActive(ref: RefObject<HTMLElement | null>) {
  const [onScreen, setOnScreen] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    const onVis = () => setTabVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [ref]);
  return onScreen && tabVisible;
}

/** Move focus to a target only when focus was already inside the game, so a timeout never yanks the page. */
export function focusIfInside(container: HTMLElement | null, target: HTMLElement | null) {
  if (!container || !target) return;
  const active = document.activeElement;
  if (active === document.body || (active && container.contains(active))) {
    target.focus({ preventScroll: true });
  }
}

export function GameEnd({
  title,
  children,
  onReplay,
  containerRef,
}: {
  title: string;
  children: ReactNode;
  onReplay: () => void;
  containerRef: RefObject<HTMLElement | null>;
}) {
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    focusIfInside(containerRef.current, heading.current);
  }, [containerRef]);

  return (
    <div className="std-panel-body">
      <h4 ref={heading} tabIndex={-1} className="std-end-title std-display text-[1.375rem] leading-tight [font-variation-settings:'opsz'_24]">
        {title}
      </h4>
      <div className="mt-3 max-w-[56ch] text-[0.9375rem]">{children}</div>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <a href={links.mailto} className="std-btn std-btn-primary">
          <Icon name="mail" size={18} />
          Email Pragati
          <Icon name="arrowRight" size={16} className="std-btn-arrow" />
        </a>
        <button type="button" onClick={onReplay} className="std-btn std-btn-quiet">
          <Icon name="replay" size={16} />
          Play again
        </button>
      </div>
    </div>
  );
}
