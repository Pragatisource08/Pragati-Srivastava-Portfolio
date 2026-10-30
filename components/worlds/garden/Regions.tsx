"use client";

import { Icon } from "@/components/icons";
import { experience, openSource, profile, projects, recognition, skills, type Project } from "@/lib/content";
import { BentHeading } from "./BentLabel";
import { CacheGame } from "./CacheGame";
import { CopyAddress, EmailButton, SecondaryLinks } from "./Contact";
import { Deep } from "./depth";
import { PortPond } from "./PortPond";
import styles from "./styles";

export const COLORS = {
  clear: "#e6efe8",
  red: "#f0907a",
  blue: "#8cc4f0",
  moon: "#ecdfae",
  seed: "#b4cf9f",
  root: "#d4b38a",
} as const;

export const REGIONS = [
  { id: "cache-bed", name: "Experience", place: "The cache bed", color: COLORS.clear },
  { id: "three-beds", name: "Projects", place: "Three beds", color: COLORS.red },
  { id: "port-pond", name: "Open source", place: "The port pond", color: COLORS.blue },
  { id: "moon-terrace", name: "Recognition", place: "The moon terrace", color: COLORS.moon },
  { id: "seed-bank", name: "Skills", place: "The seed bank", color: COLORS.seed },
  { id: "root-bed", name: "Education", place: "The root bed", color: COLORS.root },
  { id: "gate", name: "Contact", place: "The garden gate", color: COLORS.blue },
] as const;

type RegionId = (typeof REGIONS)[number]["id"];

/** A river bend that carries the water path from one region to the next. */
function River({ color, flip = false }: { color: string; flip?: boolean }) {
  return (
    <svg aria-hidden="true" className={styles.river} viewBox="0 0 1200 44" preserveAspectRatio="none">
      <path
        d={flip ? "M0 30 C 220 30 300 8 520 12 S 900 38 1200 14" : "M0 14 C 260 10 360 36 600 32 S 980 8 1200 26"}
        fill="none"
        stroke={color}
        strokeOpacity="0.45"
        strokeWidth="1.5"
        strokeDasharray="1 7"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

function Region({
  id,
  pull,
  line,
  deep = false,
  children,
}: {
  id: RegionId;
  pull: "rise" | "fall" | "orbit";
  line: string;
  deep?: boolean;
  children: React.ReactNode;
}) {
  const r = REGIONS.find((x) => x.id === id)!;
  const idx = REGIONS.findIndex((x) => x.id === id);
  return (
    <section
      id={id}
      aria-labelledby={`${id}-h`}
      className={`scroll-mt-20 ${deep ? "bg-[var(--g-ground-deep)]" : ""}`}
    >
      <River color={r.color} flip={idx % 2 === 1} />
      <div className="mx-auto max-w-[1280px] px-5 pb-20 pt-8 sm:px-8 lg:px-12 lg:pb-28">
        <BentHeading id={`${id}-h`} text={r.name} pull={pull} color={r.color} />
        <p className="mt-2 max-w-[60ch] text-[var(--g-ink-soft)]">
          <span className={`${styles.display} font-semibold`} style={{ color: r.color }}>
            {r.place}.
          </span>{" "}
          {line}
        </p>
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}

function Seeds({ items }: { items: readonly string[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {items.map((s) => (
        <li key={s} className="rounded-full border border-[var(--g-mist)] px-2.5 py-0.5 text-sm text-[var(--g-ink-soft)]">
          {s}
        </li>
      ))}
    </ul>
  );
}

function OutLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1.5 font-semibold text-[var(--g-blue)] underline decoration-[var(--g-blue)]/40 hover:decoration-[var(--g-blue)]"
    >
      {children}
      <Icon name="arrowUpRight" size={16} />
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

/* ------------------------------------------------------------------ */

export function ExperienceRegion() {
  return (
    <Region id="cache-bed" pull="orbit" line="Clear rain orbits the black flower here: the questions Cloud 9 can already answer.">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
        <div>
          <h3 className={`${styles.display} text-[1.7rem] font-semibold leading-tight`}>{experience.role}</h3>
          <p className="mt-2 text-lg text-[var(--g-ink)]">
            {experience.company} <span className="text-[var(--g-ink-faint)]">·</span> {experience.dates}{" "}
            <span className="text-[var(--g-ink-faint)]">·</span> {experience.location}
          </p>
          <p className="mt-1 text-[var(--g-ink-soft)]">Product: {experience.product}</p>
          <p className="mt-5 max-w-[62ch] text-[1.05rem] leading-relaxed text-[var(--g-ink)]">{experience.summary}</p>
          <Deep>
            <ul className="mt-6 flex max-w-[62ch] flex-col gap-4">
              {experience.points.map((p) => (
                <li key={p} className="flex gap-3 leading-relaxed text-[var(--g-ink-soft)]">
                  <DropMark color={COLORS.clear} />
                  {p}
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <Seeds items={experience.stack} />
            </div>
          </Deep>
        </div>
        <CacheGame />
      </div>
    </Region>
  );
}

function DropMark({ color }: { color: string }) {
  return (
    <svg aria-hidden="true" width="10" height="13" viewBox="0 0 10 13" className="mt-[0.45em] shrink-0">
      <path d="M5 0.6 C 5 0.6 9.2 6 9.2 8.4 A 4.2 4.2 0 0 1 0.8 8.4 C 0.8 6 5 0.6 5 0.6 Z" fill={color} />
    </svg>
  );
}

/* ------------------------------------------------------------------ */

function Motif({ slug }: { slug: string }) {
  if (slug === "bharatritu") {
    // Reports fall as rain; each lands with a verdict: verified, under review, flagged.
    return (
      <svg aria-hidden="true" viewBox="0 0 140 90" className="h-20 w-auto">
        <path d="M6 78 H134" stroke="#4a5a51" />
        {[
          [28, "#e6efe8", true],
          [70, "#ecdfae", false],
          [112, "#f0907a", false],
        ].map(([x, c, filled], i) => (
          <g key={i}>
            <path d={`M${x} ${14 + i * 6} v ${26 - i * 4}`} stroke={c as string} strokeDasharray="2 4" strokeLinecap="round" />
            <path
              d={`M${x} ${48} c 0 0 7 9 7 13 a 7 7 0 0 1 -14 0 c 0 -4 7 -13 7 -13 z`}
              fill={filled ? (c as string) : "none"}
              stroke={c as string}
              strokeWidth="1.5"
              strokeDasharray={i === 2 ? "3 2" : undefined}
            />
          </g>
        ))}
      </svg>
    );
  }
  if (slug === "airquality") {
    return (
      <svg aria-hidden="true" viewBox="0 0 140 90" className="h-20 w-auto">
        <circle cx="70" cy="45" r="30" fill="none" stroke="#8cc4f0" strokeWidth="1.5" />
        <ellipse cx="70" cy="45" rx="12" ry="30" fill="none" stroke="#8cc4f0" strokeOpacity="0.6" />
        <path d="M40 45 H100 M44 30 H96 M44 60 H96" stroke="#8cc4f0" strokeOpacity="0.45" />
        <ellipse cx="70" cy="45" rx="56" ry="14" fill="none" stroke="#ecdfae" strokeOpacity="0.7" transform="rotate(-14 70 45)" />
        <circle cx="122" cy="33" r="3.5" fill="#ecdfae" />
      </svg>
    );
  }
  return (
    <svg aria-hidden="true" viewBox="0 0 140 90" className="h-20 w-auto">
      <path d="M6 78 H134" stroke="#4a5a51" />
      {[22, 40, 30, 52, 34, 46].map((hgt, i) => {
        const x = 18 + i * 21;
        return (
          <g key={i}>
            <path d={`M${x} 78 V ${78 - hgt}`} stroke="#b4cf9f" strokeWidth="1.5" strokeLinecap="round" />
            <ellipse cx={x + 5} cy={78 - hgt + 6} rx="5" ry="2.4" fill="#b4cf9f" transform={`rotate(-30 ${x + 5} ${78 - hgt + 6})`} />
          </g>
        );
      })}
    </svg>
  );
}

function Bed({ p, i }: { p: Project; i: number }) {
  return (
    <article className={`grid gap-6 border-t border-dashed border-[var(--g-mist)] py-10 first:border-t-0 first:pt-0 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)] lg:gap-14 ${i === 1 ? "lg:pl-[6%]" : i === 2 ? "lg:pl-[12%]" : ""}`}>
      <div>
        <Motif slug={p.slug} />
        <h3 className={`${styles.display} mt-3 text-[2rem] font-semibold leading-tight`}>{p.name}</h3>
        <p className="mt-1 text-[var(--g-ink-soft)]">{p.context}</p>
      </div>
      <div className="max-w-[66ch]">
        <p className={`${styles.display} text-xl leading-snug text-[var(--g-ink)] sm:text-[1.4rem]`}>{p.tagline}</p>
        <p className="mt-3 leading-relaxed text-[var(--g-ink-soft)]">{p.aim}</p>
        <Deep>
          <ul className="mt-5 flex flex-col gap-3.5">
            {p.points.map((pt) => (
              <li key={pt} className="flex gap-3 leading-relaxed text-[var(--g-ink-soft)]">
                <DropMark color={COLORS.red} />
                {pt}
              </li>
            ))}
          </ul>
        </Deep>
        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
          <Seeds items={p.stack} />
          <OutLink href={p.link.url}>{p.link.label}</OutLink>
        </div>
      </div>
    </article>
  );
}

export function ProjectsRegion() {
  return (
    <Region id="three-beds" pull="fall" deep line="Red rain falls on three beds, and bends around whatever sleeps in each one.">
      <div>
        {projects.map((p, i) => (
          <Bed key={p.slug} p={p} i={i} />
        ))}
      </div>
    </Region>
  );
}

/* ------------------------------------------------------------------ */

export function OpenSourceRegion() {
  return (
    <Region id="port-pond" pull="rise" line="Blue rain rises into a floating pond. Two merged fixes live here, and a game about the first.">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
        <div>
          <p className="text-lg">
            <a href={openSource.repoUrl} target="_blank" rel="noreferrer" className={`${styles.mono} font-semibold text-[var(--g-blue)] underline decoration-[var(--g-blue)]/40 hover:decoration-[var(--g-blue)]`}>
              {openSource.repo}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </p>
          <p className="mt-1 text-[var(--g-ink-soft)]">
            {openSource.language} · {openSource.date}
          </p>
          <ol className="mt-8 flex flex-col gap-9">
            {openSource.prs.map((pr) => (
              <li key={pr.number}>
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`${styles.mono} text-lg font-semibold text-[var(--g-blue)]`}>#{pr.number}</span>
                  <h3 className={`${styles.display} text-[1.45rem] font-semibold leading-tight`}>{pr.title}</h3>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[var(--g-seed)]/15 px-2.5 py-0.5 text-sm font-semibold text-[var(--g-seed)]">
                    <Icon name="check" size={14} strokeWidth={2.25} />
                    {pr.status}
                  </span>
                </div>
                <p className="mt-2 max-w-[60ch] leading-relaxed text-[var(--g-ink)]">{pr.summary}</p>
                <Deep>
                  <p className="mt-2 max-w-[60ch] leading-relaxed text-[var(--g-ink-soft)]">{pr.detail}</p>
                </Deep>
                <p className="mt-3">
                  <OutLink href={pr.url}>Read PR #{pr.number}</OutLink>
                </p>
              </li>
            ))}
          </ol>
        </div>
        <PortPond />
      </div>
    </Region>
  );
}

/* ------------------------------------------------------------------ */

function Phase({ k }: { k: number }) {
  // A moon in three phases, one per terrace.
  const off = [0, 9, 16][k];
  return (
    <svg aria-hidden="true" width="44" height="44" viewBox="0 0 44 44" className="shrink-0">
      <defs>
        <mask id={`garden-phase-${k}`}>
          <rect width="44" height="44" fill="white" />
          <circle cx={22 + off} cy={22 - off * 0.3} r="16" fill="black" />
        </mask>
      </defs>
      <circle cx="22" cy="22" r="16" fill="#ecdfae" fillOpacity="0.12" />
      <circle cx="22" cy="22" r="16" fill="#ecdfae" mask={k === 0 ? undefined : `url(#garden-phase-${k})`} />
    </svg>
  );
}

export function RecognitionRegion() {
  return (
    <Region id="moon-terrace" pull="orbit" deep line="Three terraces under the moon, each one a step down the hill.">
      <ol className="flex flex-col gap-8">
        {recognition.map((r, i) => (
          <li key={r.title} className={`flex items-start gap-5 ${i === 1 ? "sm:ml-[10%]" : i === 2 ? "sm:ml-[20%]" : ""}`}>
            <Phase k={i} />
            <div className="border-b border-[var(--g-mist)] pb-6">
              <h3 className={`${styles.display} text-[1.6rem] font-semibold leading-tight`}>{r.title}</h3>
              <p className="mt-1 max-w-[56ch] text-lg text-[var(--g-ink-soft)]">{r.detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </Region>
  );
}

export function SkillsRegion() {
  return (
    <Region id="seed-bank" pull="fall" line="Every seed here has grown into something above.">
      <dl className="grid gap-x-10 gap-y-6 sm:grid-cols-[minmax(0,180px)_minmax(0,1fr)]">
        {Object.entries(skills).map(([group, items]) => (
          <div key={group} className="contents">
            <dt className={`${styles.display} pt-0.5 text-lg font-semibold text-[var(--g-seed)]`}>{group}</dt>
            <dd className="-mt-4 sm:mt-0">
              <Seeds items={items} />
            </dd>
          </div>
        ))}
      </dl>
    </Region>
  );
}

export function EducationRegion() {
  return (
    <Region id="root-bed" pull="rise" deep line="Where the roots go down.">
      <div className="grid gap-6 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-end sm:gap-12">
        <div>
          <h3 className={`${styles.display} text-[1.8rem] font-semibold leading-tight`}>{profile.degree}</h3>
          <p className="mt-1 text-lg text-[var(--g-ink-soft)]">{profile.university}</p>
        </div>
        <dl className={`${styles.num} flex gap-10`}>
          <div>
            <dt className="text-sm text-[var(--g-ink-faint)]">Years</dt>
            <dd className="text-xl font-semibold">{profile.years}</dd>
          </div>
          <div>
            <dt className="text-sm text-[var(--g-ink-faint)]">CGPA</dt>
            <dd className="text-xl font-semibold">{profile.cgpa}</dd>
          </div>
        </dl>
      </div>
    </Region>
  );
}

export function GateRegion() {
  return (
    <Region id="gate" pull="rise" line="Every drop in this garden finds its way here.">
      <div className="flex flex-col items-start gap-6">
        <p className={`${styles.display} max-w-[22ch] text-[clamp(1.9rem,4vw,3rem)] font-medium leading-[1.08] tracking-[-0.02em] text-balance`}>
          Ask about Cloud 9, the port fix, or anything that grows here.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <EmailButton large />
          <CopyAddress />
        </div>
        <div className="-ml-3">
          <SecondaryLinks />
        </div>
      </div>
    </Region>
  );
}
