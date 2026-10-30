"use client";

import { createContext, useContext } from "react";

// Two reads of the same garden: Drizzle (the short recruiter read) and
// Downpour (every point, stack, and detail for engineers).
export type Depth = "drizzle" | "downpour";

export const DepthContext = createContext<Depth>("drizzle");

export function useDepth() {
  return useContext(DepthContext);
}

export function Deep({ children }: { children: React.ReactNode }) {
  return useDepth() === "downpour" ? <>{children}</> : null;
}
