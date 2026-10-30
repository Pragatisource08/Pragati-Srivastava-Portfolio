import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Schibsted_Grotesk, Silkscreen } from "next/font/google";

const pixel = Silkscreen({ weight: ["400", "700"], subsets: ["latin"], variable: "--bm-pixel", display: "swap" });
const text = Schibsted_Grotesk({ subsets: ["latin"], variable: "--bm-text", display: "swap" });

export const metadata: Metadata = {
  title: "Pragati Srivastava: a bitmap type specimen",
  description:
    "Pragati Srivastava, backend engineer: Python backends, REST APIs, and applied AI. Set as a bitmap type specimen.",
};

export default function BitmapLayout({ children }: { children: ReactNode }) {
  return <div className={`${pixel.variable} ${text.variable} bm-fontroot`}>{children}</div>;
}
