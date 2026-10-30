import type { Metadata } from "next";
import type { ReactNode } from "react";
import localFont from "next/font/local";
import "@/components/worlds/bbs/bbs.css";

// IBM VGA 8x16 from The Ultimate Oldschool PC Font Pack (VileR, CC BY-SA 4.0).
// The medium of this world is a CP437 character grid, so the whole page sets in it.
const vga = localFont({
  src: "../../../public/worlds/bbs/WebPlus_IBM_VGA_8x16.woff",
  variable: "--bbs-vga",
  display: "block",
  preload: true,
  fallback: ["ui-monospace", "Consolas", "monospace"],
});

export const metadata: Metadata = {
  title: "Pragati Srivastava · ANSI Nightboard",
  description:
    "Pragati Srivastava, backend engineer (Python, APIs, applied AI), as a dial-up bulletin board: work log, files, merged PRs, door games, and mail to the sysop.",
};

export default function BbsLayout({ children }: { children: ReactNode }) {
  return <div className={`${vga.variable} bbs-fontscope`}>{children}</div>;
}
