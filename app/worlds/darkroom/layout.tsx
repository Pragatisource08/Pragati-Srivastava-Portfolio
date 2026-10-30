import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pragati Srivastava, backend engineer · Darkroom",
  description:
    "Pragati Srivastava builds Python backends, REST APIs, and applied AI. Her portfolio, printed under safelight: internship, projects, merged open-source fixes, and a print you can pull yourself.",
};

export default function DarkroomLayout({ children }: LayoutProps<"/worlds/darkroom">) {
  return children;
}
