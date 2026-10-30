"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

export type Copy = "fair" | "rough";

type FileState = {
  copy: Copy;
  setCopy: (c: Copy) => void;
  checked: ReadonlySet<number>;
  check: (no: number) => void;
  signed: boolean;
  sign: () => void;
};

const Ctx = createContext<FileState | null>(null);

export function FileStateProvider({ children }: { children: ReactNode }) {
  const [copy, setCopy] = useState<Copy>("fair");
  const [checked, setChecked] = useState<ReadonlySet<number>>(new Set());
  const [signed, setSigned] = useState(false);

  const check = useCallback((no: number) => {
    setChecked((prev) => (prev.has(no) ? prev : new Set(prev).add(no)));
  }, []);
  const sign = useCallback(() => setSigned(true), []);

  const value = useMemo(
    () => ({ copy, setCopy, checked, check, signed, sign }),
    [copy, checked, check, signed, sign]
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useFile() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useFile must be used inside FileStateProvider");
  return v;
}
