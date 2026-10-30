import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Hedvig_Letters_Serif, Schibsted_Grotesk } from "next/font/google";
import "./standard.css";

const display = Hedvig_Letters_Serif({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--std-display",
  display: "swap",
});

const text = Schibsted_Grotesk({
  subsets: ["latin"],
  variable: "--std-text",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pragati Srivastava · Backend engineer",
  description:
    "Pragati Srivastava builds Python backends, REST APIs, and applied AI. Experience, projects, merged pull requests, and a way to reach her.",
};

export default function StandardLayout({ children }: { children: ReactNode }) {
  return <div className={`${display.variable} ${text.variable} contents`}>{children}</div>;
}
