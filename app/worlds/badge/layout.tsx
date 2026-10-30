import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Archivo, Overpass, Overpass_Mono } from "next/font/google";
import "@/components/worlds/badge/badge.css";

// Archivo's width axis gives the condensed print of event badges and the wide face of zone signage.
const display = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--badge-display", display: "swap" });
// Overpass descends from Highway Gothic, the wayfinding face: right for a venue floor.
const body = Overpass({ subsets: ["latin"], variable: "--badge-body", display: "swap" });
const mono = Overpass_Mono({ subsets: ["latin"], variable: "--badge-mono", display: "swap" });

export const metadata: Metadata = {
  title: "Pragati Srivastava — The Hackathon Badge",
  description:
    "Pragati Srivastava, backend engineer: Python backends, REST APIs, and applied AI. Team Lead at Smart India Hackathon 2026.",
};

export default function BadgeLayout({ children }: { children: ReactNode }) {
  return <div className={`badge-fonts ${display.variable} ${body.variable} ${mono.variable}`}>{children}</div>;
}
