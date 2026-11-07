import type { Metadata } from "next";
import { Archivo, Overpass, Overpass_Mono } from "next/font/google";
import "./globals.css";
import "@/components/badge/badge.css";
import "@/components/badge/hand-booth.css";

// Archivo's width axis gives the condensed print of event badges and the wide face of zone signage.
const display = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--badge-display", display: "swap" });
// Overpass descends from Highway Gothic, the wayfinding face: right for a venue floor.
const body = Overpass({ subsets: ["latin"], variable: "--badge-body", display: "swap" });
const mono = Overpass_Mono({ subsets: ["latin"], variable: "--badge-mono", display: "swap" });

export const metadata: Metadata = {
  title: "Pragati Srivastava — Backend Engineer & Developer",
  description:
    "Pragati Srivastava, backend engineer: Python backends, REST APIs, and applied AI. Team Lead at Smart India Hackathon 2026.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <div className={`badge-fonts ${display.variable} ${body.variable} ${mono.variable}`}>{children}</div>
      </body>
    </html>
  );
}
