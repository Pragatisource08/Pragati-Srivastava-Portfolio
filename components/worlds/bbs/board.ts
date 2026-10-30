"use client";

import { createContext, useContext, type RefObject } from "react";

export const SCREENS = [
  "main",
  "sysop",
  "work",
  "files",
  "messages",
  "fame",
  "doors",
  "mail",
  "toolbox",
  "school",
  "letter",
  "goodbye",
  "porthunt",
  "credchek",
  "viva",
] as const;

export type ScreenId = (typeof SCREENS)[number];

export function isScreen(v: string): v is ScreenId {
  return (SCREENS as readonly string[]).includes(v);
}

export type BoardEventKind = "presence" | "mail" | "post" | "info";
export type BoardEvent = { id: number; kind: BoardEventKind; text: string };

export type Board = {
  screen: ScreenId;
  go: (id: ScreenId) => void;
  // Reading mode: Quickscan (short, the recruiter read) or Full text (the engineer read).
  full: boolean;
  toggleFull: () => void;
  post: (kind: BoardEventKind, text: string) => void;
  headingRef: RefObject<HTMLHeadingElement | null>;
};

export const BoardContext = createContext<Board | null>(null);

export function useBoard(): Board {
  const b = useContext(BoardContext);
  if (!b) throw new Error("useBoard outside Nightboard");
  return b;
}
