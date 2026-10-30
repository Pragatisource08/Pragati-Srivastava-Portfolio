import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Gowun_Dodum, Hahmlet, Nanum_Gothic_Coding } from "next/font/google";

// Hahmlet: a Korean-designed variable serif whose Latin carries a brushed, carved
// stroke; Gowun Dodum: a calm humanist text face from the same tradition.
const display = Hahmlet({ subsets: ["latin"], variable: "--shelf-display", display: "swap" });
const body = Gowun_Dodum({ subsets: ["latin"], weight: "400", variable: "--shelf-body", display: "swap" });
const mono = Nanum_Gothic_Coding({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--shelf-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pragati Srivastava, backend engineer: the shelf",
  description:
    "Pragati Srivastava builds Python backends, REST APIs, and applied AI. Her work, set out as objects on a painted bookshelf screen.",
};

export default function ShelfLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`${display.variable} ${body.variable} ${mono.variable}`} style={{ width: "100%", flex: 1 }}>
      {children}
    </div>
  );
}
