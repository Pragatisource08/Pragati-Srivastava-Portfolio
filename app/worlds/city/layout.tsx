import type { Metadata } from "next";
import { Barlow, Barlow_Semi_Condensed, Big_Shoulders } from "next/font/google";

// Big Shoulders: condensed, built from Chicago's street and transit signage.
// Barlow: grotesk modelled on California highway and transit lettering.
const display = Big_Shoulders({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-city-display",
  display: "swap",
});

const body = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-city-body",
  display: "swap",
});

const sign = Barlow_Semi_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-city-sign",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pragati Srivastava — Backend engineer · Rain-Night City",
  description:
    "Pragati Srivastava builds Python backends, REST APIs, and applied AI. A night city where her pipelines run as transit lines and each lit tower is a project.",
};

export default function CityLayout({ children }: LayoutProps<"/worlds/city">) {
  return <div className={`${display.variable} ${body.variable} ${sign.variable} contents`}>{children}</div>;
}
