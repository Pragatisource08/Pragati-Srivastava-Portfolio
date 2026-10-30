import type { Metadata } from "next";
import { Nunito, Quicksand } from "next/font/google";

// Quicksand: a light, rounded display voice for labels that bend with gravity.
// Nunito: a rounded body face that stays level and readable at length.
const display = Quicksand({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-garden-display",
});

const body = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-garden-body",
});

export const metadata: Metadata = {
  title: "Pragati Srivastava — Gravity-Rain Garden",
  description:
    "Pragati Srivastava, backend engineer for Python backends, REST APIs, and applied AI. A garden where every drop of rain is a request.",
};

export default function GardenLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${display.variable} ${body.variable} flex flex-1 flex-col`}>{children}</div>;
}
