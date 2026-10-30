"use client";

import { useEffect, useState, useSyncExternalStore, type RefObject } from "react";
import { negativeFromImageData, type Negative } from "./model";

const cache = new Map<number, Promise<Negative>>();

/** Load the portrait once per pixel size and turn it into a grayscale negative. */
export function loadNegative(src: string, size: number): Promise<Negative> {
  const hit = cache.get(size);
  if (hit) return hit;
  const p = new Promise<Negative>((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = c.height = size;
      const ctx = c.getContext("2d", { willReadFrequently: true });
      if (!ctx) return reject(new Error("no 2d context"));
      ctx.drawImage(img, 0, 0, size, size);
      resolve(negativeFromImageData(ctx.getImageData(0, 0, size, size)));
    };
    img.onerror = () => reject(new Error("portrait failed to load"));
    img.src = src;
  });
  cache.set(size, p);
  return p;
}

export function useNegative(src: string, size: number) {
  const [neg, setNeg] = useState<Negative | null>(null);
  useEffect(() => {
    let live = true;
    loadNegative(src, size).then((n) => live && setNeg(n)).catch(() => {});
    return () => {
      live = false;
    };
  }, [src, size]);
  return neg;
}

function subscribeVisibility(cb: () => void) {
  document.addEventListener("visibilitychange", cb);
  return () => document.removeEventListener("visibilitychange", cb);
}

/** True while the element is on screen and the tab is visible: loops run only then. */
export function useActive(ref: RefObject<Element | null>) {
  const [inView, setInView] = useState(false);
  const visible = useSyncExternalStore(
    subscribeVisibility,
    () => document.visibilityState === "visible",
    () => true
  );
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
  return inView && visible;
}

const noopSubscribe = () => () => {};

/** Canvas backing size for a CSS size, capped by the 400 px source. */
export function useBackingSize(cssSize: number) {
  const dpr = useSyncExternalStore(
    noopSubscribe,
    () => Math.min(2, window.devicePixelRatio || 1),
    () => 1
  );
  return Math.min(400, Math.round(cssSize * dpr));
}

function subscribeMotion(cb: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

/** Reduced-motion preference; null during server render and hydration. */
export function useReducedMotionPref(): boolean | null {
  return useSyncExternalStore<boolean | null>(
    subscribeMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => null
  );
}
