"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { experience, openSource, profile, projects } from "@/lib/content";
import { CityContext, ContactLinks, HOURS, HourIcon, type Depth, type Hour } from "./shared";
import { useSkyline } from "./useSkyline";
import { Skyline } from "./Skyline";
import { Transit } from "./Transit";
import { Street } from "./Street";
import { River } from "./River";
import { s } from "./cls";
import "./city.css";

const STOPS = [
  { id: "signal", name: "Signal", gloss: "Pragati" },
  { id: "skyline", name: "Skyline", gloss: "Projects" },
  { id: "transit", name: "Transit", gloss: "Internship, PRs" },
  { id: "street", name: "Street", gloss: "Reports, skills" },
  { id: "river", name: "River", gloss: "Quiz, contact" },
] as const;

export function CityWorld() {
  const [hour, setHour] = useState<Hour>("blue");
  const [depth, setDepth] = useState<Depth>("express");
  return (
    <CityContext.Provider value={{ hour, depth }}>
      <div className={s.root} data-hour={hour} data-depth={depth} data-city-root="">
        <CityNav hour={hour} setHour={setHour} depth={depth} setDepth={setDepth} />
        <main>
          <Hero hour={hour} />
          <Skyline />
          <Transit />
          <Street />
          <River />
        </main>
        <footer className={s.footer}>
          <a href="#signal" className={s.logo}>
            Pragati.
          </a>
          <p>Built as a night city: each lit tower a project, each transit line a pipeline.</p>
        </footer>
      </div>
    </CityContext.Provider>
  );
}

function CityNav({
  hour,
  setHour,
  depth,
  setDepth,
}: {
  hour: Hour;
  setHour: (h: Hour) => void;
  depth: Depth;
  setDepth: (d: Depth) => void;
}) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const els = STOPS.map((st) => document.getElementById(st.id)).filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(STOPS.findIndex((st) => st.id === e.target.id));
        }
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <header className={s.nav}>
      <a href="#signal" className={s.logo} aria-label="Pragati, back to the top">
        Pragati.
      </a>
      <nav aria-label="City stops" className={s.route}>
        <ol className={s.routeList}>
          {STOPS.map((st, i) => (
            <li key={st.id}>
              <a href={`#${st.id}`} className={s.stop} aria-current={active === i ? "location" : undefined}>
                <span className={s.stopDot} aria-hidden="true" />
                <span className={s.stopName}>{st.name}</span>
                <span className={s.stopGloss}>{st.gloss}</span>
              </a>
            </li>
          ))}
        </ol>
        <span className={s.routeTrain} style={{ transform: `translateX(${active * 100}%)` }} aria-hidden="true">
          <svg width="34" height="10" viewBox="0 0 34 10">
            <rect x="0.5" y="0.5" width="33" height="9" rx="3" fill="var(--c-tower)" stroke="var(--c-amber)" />
            <rect x="5" y="3.5" width="4" height="3" fill="var(--c-amber)" />
            <rect x="12" y="3.5" width="4" height="3" fill="var(--c-amber)" />
            <rect x="19" y="3.5" width="4" height="3" fill="var(--c-amber)" />
            <rect x="26" y="3.5" width="4" height="3" fill="var(--c-amber)" />
          </svg>
        </span>
      </nav>
      <div className={s.controls}>
        <div role="group" aria-label="Hour and weather. Recolours the whole city." className={s.seg}>
          {HOURS.map((h) => (
            <button
              key={h.id}
              type="button"
              className={s.segBtn}
              aria-pressed={hour === h.id}
              aria-label={h.label}
              title={h.label}
              onClick={() => setHour(h.id)}
            >
              <HourIcon hour={h.id} />
              <span className={s.segText}>{h.label}</span>
            </button>
          ))}
        </div>
        <div
          role="group"
          aria-label="Reading depth: Express is the short read, All stops adds engineering detail"
          className={s.seg}
        >
          {(
            [
              ["express", "Express"],
              ["all", "All stops"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={s.segBtn}
              aria-pressed={depth === id}
              title={id === "express" ? "Short read for recruiters" : "Every detail, for engineers"}
              onClick={() => setDepth(id)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}

function Hero({ hour }: { hour: Hour }) {
  const sectionRef = useRef<HTMLElement>(null);
  const skyRef = useRef<HTMLCanvasElement>(null);
  const riverRef = useRef<HTMLCanvasElement>(null);
  useSkyline(sectionRef, skyRef, riverRef, hour);
  const words = profile.name
    .toUpperCase()
    .split(" ")
    .map((w, wi, all) => {
      const start = all.slice(0, wi).join("").length;
      return { w, letters: w.split("").map((ch, k) => ({ ch, i: start + k })) };
    });

  return (
    <section id="signal" ref={sectionRef} className={s.hero} aria-labelledby="hero-name">
      <div className={s.skyBand}>
        <canvas ref={skyRef} className={s.canvas} aria-hidden="true" />
        <div className={s.signTower}>
          <div className={s.rooftopSign}>
            <h1 id="hero-name" className={s.signName}>
              <span className={s.srOnly}>{profile.name}</span>
              {words.map(({ w, letters }) => (
                <span key={w} className={s.signLine} aria-hidden="true">
                  {letters.map(({ ch, i }) => (
                    <span key={i} className={s.lamp} style={{ ["--i" as string]: i }}>
                      {ch}
                    </span>
                  ))}
                </span>
              ))}
            </h1>
            <p className={s.signRole}>{profile.role}</p>
          </div>
          <div className={s.truss} aria-hidden="true" />
          <div className={s.signTowerBody} aria-hidden="true" />
        </div>
      </div>

      <div className={s.boardSlot}>
        <StationBoard />
      </div>

      <div className={s.riverBand} aria-hidden="true">
        <canvas ref={riverRef} className={s.canvas} />
        <p className={s.signMirror}>
          {profile.name.split(" ").map((w) => (
            <span key={w}>{w}</span>
          ))}
        </p>
      </div>
    </section>
  );
}

function StationBoard() {
  return (
    <div className={s.board}>
      <div className={s.boardHead}>
        <Image
          src={profile.photo}
          width={88}
          height={88}
          alt="Portrait of Pragati Srivastava"
          className={s.portrait}
          priority
        />
        <p className={s.boardFocus}>Builds {profile.focus}.</p>
      </div>
      <p className={s.boardSummary}>{profile.summary}</p>
      <ContactLinks />
      <table className={s.boardTable}>
        <caption className={s.srOnly}>At a glance</caption>
        <tbody>
          <tr>
            <th scope="row">Studying</th>
            <td>
              B.Tech CSE, AKTU · <span className={s.num}>{profile.years}</span>
            </td>
          </tr>
          <tr>
            <th scope="row">Interned</th>
            <td>
              {experience.company} · Generative AI and Cloud
            </td>
          </tr>
          <tr>
            <th scope="row">Merged</th>
            <td>
              {openSource.repo}{" "}
              {openSource.prs.map((p, k) => (
                <span key={p.number} className={s.num}>
                  {k ? ", " : ""}#{p.number}
                </span>
              ))}
            </td>
          </tr>
          <tr>
            <th scope="row">Built</th>
            <td>{projects.map((p) => p.name).join(", ")}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
