"use client";

import { useState, type CSSProperties } from "react";
import { DepthContext, type Depth } from "./Depth";
import { Identity, MobileBar } from "./Identity";
import { Play } from "./Play";
import { About, Background, ContactSection, Experience, OpenSource, Projects } from "./Sections";

export function StandardWorld() {
  const [depth, setDepth] = useState<Depth>("recruiter");

  return (
    <DepthContext value={{ depth, setDepth }}>
      <div className="std-root" data-depth={depth}>
        <a href="#content" className="std-skip">
          Skip to content
        </a>
        <MobileBar />
        <div className="mx-auto w-full max-w-[1200px] px-6 sm:px-10 lg:grid lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1fr)] lg:gap-20 lg:px-14 xl:gap-28">
          <Identity />
          <span id="std-identity-end" aria-hidden="true" className="block h-px lg:hidden" />
          <main
            id="content"
            tabIndex={-1}
            className="std-in-main pb-28 pt-6 outline-none lg:py-[clamp(40px,8vh,88px)]"
            style={{ "--d": "520ms" } as CSSProperties}
          >
            <About />
            <Experience />
            <Projects />
            <OpenSource />
            <Background />
            <section id="play" aria-labelledby="play-h" className="std-section pt-20 lg:pt-24">
              <h2 id="play-h" className="std-display std-h2">
                Play
              </h2>
              <p className="mb-6 max-w-[60ch]">
                Three small games built from Pragati&rsquo;s real work. Each takes about a minute, and each ends with a
                way to reach her.
              </p>
              <Play />
            </section>
            <ContactSection />
            <footer className="std-meta mt-24 border-t border-[color:var(--rule)] pt-6 pb-16 lg:pb-0">
              <p>
                Pragati Srivastava. Set in Hedvig Letters Serif and Schibsted Grotesk, built with Next.js.
              </p>
            </footer>
          </main>
        </div>
      </div>
    </DepthContext>
  );
}
