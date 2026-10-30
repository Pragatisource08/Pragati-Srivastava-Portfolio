"use client";

import { animate, useMotionValue, useReducedMotion } from "motion/react";
import { useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import { experience, openSource, profile, projects, recognition } from "@/lib/content";
import { EmailAction, SealLinks } from "./Actions";
import { FrameSvg } from "./FrameSvg";
import {
  BookObject,
  BrushesObject,
  HangingScroll,
  LetterBoxObject,
  LetterObject,
  MedalObject,
  PuzzleBoxObject,
  ScrollObject,
  StampsObject,
  VesselObject,
  VolumesObject,
} from "./objects";
import { EASE } from "./palette";
import {
  ContactPanel,
  EducationPanel,
  InternshipPanel,
  PortraitPanel,
  PrPanel,
  ProjectPanel,
  RecognitionPanel,
  SkillsPanel,
  type Depth,
} from "./panels";
import { ShelfBox, type BoxKind } from "./ShelfBox";
import { CredibilityGame } from "./games/CredibilityGame";
import { PortHuntGame } from "./games/PortHuntGame";
import { VivaGame } from "./games/VivaGame";
import "./shelf.css";

type BoxDef = {
  id: string;
  kind: Exclude<BoxKind, "empty">;
  title: string;
  sub: ReactNode;
  more?: ReactNode;
  object: ReactNode;
  panel: (depth: Depth) => ReactNode;
};

const [bharat, air, fin] = projects;
const [pr906, pr845] = openSource.prs;

const BOXES: BoxDef[] = [
  {
    id: "portrait",
    kind: "content",
    title: profile.name,
    sub: `${profile.role}: ${profile.focus}`,
    more: `${profile.degree}, ${profile.years}.`,
    object: <HangingScroll size={64} />,
    panel: (d) => <PortraitPanel depth={d} />,
  },
  {
    id: "internship",
    kind: "content",
    title: experience.company,
    sub: `${experience.role}, ${experience.dates}`,
    more: `Built the backend for ${experience.product}.`,
    object: <VesselObject />,
    panel: (d) => <InternshipPanel depth={d} />,
  },
  ...[bharat, air].map(
    (p): BoxDef => ({
      id: p.slug,
      kind: "content",
      title: p.name,
      sub: p.context,
      more: p.tagline,
      object: <BookObject slug={p.slug} name={p.name} />,
      panel: (d) => <ProjectPanel project={p} depth={d} />,
    })
  ),
  {
    id: fin.slug,
    kind: "content",
    title: fin.name,
    sub: `${fin.context}: Flask, SQLAlchemy, Chart.js`,
    more: fin.tagline,
    object: <BookObject slug={fin.slug} name={fin.name} />,
    panel: (d) => <ProjectPanel project={fin} depth={d} />,
  },
  {
    id: "pr906",
    kind: "content",
    title: `PR #${pr906.number}, ${pr906.status.toLowerCase()}`,
    sub: `${pr906.title} in ${openSource.repo}`,
    more: "Port fallback across 8888–8897.",
    object: <LetterObject number={pr906.number} tilt={-3} />,
    panel: (d) => <PrPanel index={0} depth={d} />,
  },
  {
    id: "pr845",
    kind: "content",
    title: `PR #${pr845.number}, ${pr845.status.toLowerCase()}`,
    sub: `${pr845.title} in ${openSource.repo}`,
    more: "A select component that broke in dark mode.",
    object: <LetterObject number={pr845.number} tilt={4} />,
    panel: (d) => <PrPanel index={1} depth={d} />,
  },
  {
    id: "porthunt",
    kind: "game",
    title: "Boot the server",
    sub: "A puzzle box of ten ports, from PR #906",
    object: <PuzzleBoxObject />,
    panel: () => <PortHuntGame />,
  },
  {
    id: "recognition",
    kind: "content",
    title: "Recognition",
    sub: "NASA Space Apps Global Nominee; Smart India Hackathon Team Lead",
    more: recognition[2].detail,
    object: <MedalObject />,
    panel: () => <RecognitionPanel />,
  },
  {
    id: "skills",
    kind: "content",
    title: "Skills",
    sub: "Python, C++, TypeScript, JavaScript; Flask, Next.js; Pinecone",
    more: "Google Gemini API, vector embeddings, AWS EC2.",
    object: <BrushesObject />,
    panel: () => <SkillsPanel />,
  },
  {
    id: "education",
    kind: "content",
    title: "Education",
    sub: `B.Tech CSE, ${profile.years}`,
    more: `${profile.university}. CGPA ${profile.cgpa}.`,
    object: <VolumesObject />,
    panel: () => <EducationPanel />,
  },
  {
    id: "viva",
    kind: "game",
    title: "Viva voce",
    sub: "Six questions, all answered on these shelves",
    object: <ScrollObject />,
    panel: () => <VivaGame />,
  },
  {
    id: "credibility",
    kind: "game",
    title: "Verify the report",
    sub: "Press BharatRitu's seals on five sample slips",
    object: <StampsObject />,
    panel: () => <CredibilityGame />,
  },
  {
    id: "contact",
    kind: "content",
    title: "Write to Pragati",
    sub: "Email, LinkedIn, GitHub, Resume",
    object: <LetterBoxObject />,
    panel: () => <ContactPanel />,
  },
];

const CONTENT_IDS = BOXES.filter((b) => b.kind === "content").map((b) => b.id);

function subscribeCols(cb: () => void) {
  const mqs = [window.matchMedia("(min-width: 600px)"), window.matchMedia("(min-width: 1000px)")];
  mqs.forEach((m) => m.addEventListener("change", cb));
  return () => mqs.forEach((m) => m.removeEventListener("change", cb));
}
function getCols() {
  if (window.matchMedia("(min-width: 1000px)").matches) return 4;
  if (window.matchMedia("(min-width: 600px)").matches) return 3;
  return 2;
}

function Crown({ cols, depth, setDepth }: { cols: number; depth: Depth; setDepth: (d: Depth) => void }) {
  const flare = useMotionValue(0);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) {
      flare.set(1);
      return;
    }
    const c = animate(flare, 1, { duration: 1.1, ease: EASE });
    return () => c.stop();
  }, [flare, reduce]);
  const compact = cols <= 2;
  const s = compact ? 12 : 30;
  const t = compact ? 14 : 24;

  return (
    <header className="shelf-crown" style={{ paddingTop: t, paddingLeft: s, paddingRight: s }}>
      <div className="shelf-crown-inner">
        <div className="shelf-crown-id">
          <h1 className="shelf-name">{profile.name}</h1>
          <p className="shelf-role">
            {profile.role}: {profile.focus}.
          </p>
          <p className="shelf-summary">{profile.summary}</p>
        </div>
        <div className="shelf-crown-actions">
          <EmailAction size="lg" />
          <SealLinks />
          <div className="shelf-depth" role="group" aria-label="How much of each shelf to show">
            <span className="shelf-depth-label">Read the shelves by</span>
            <span className="shelf-depth-switch">
              <button type="button" aria-pressed={depth === "spines"} onClick={() => setDepth("spines")}>
                Spines
              </button>
              <button type="button" aria-pressed={depth === "pages"} onClick={() => setDepth("pages")}>
                Pages
              </button>
            </span>
            <span className="shelf-depth-note">
              {depth === "spines" ? "Labels only. Open one box at a time." : "Every box open, full detail."}
            </span>
          </div>
        </div>
      </div>
      <FrameSvg s={s} t={t} flare={flare} crown />
    </header>
  );
}

export function Shelf() {
  const cols = useSyncExternalStore(subscribeCols, getCols, () => 4);
  const [depth, setDepthState] = useState<Depth>("spines");
  const [open, setOpen] = useState<string[]>([]);

  const setDepth = (d: Depth) => {
    setDepthState(d);
    setOpen((prev) => {
      const games = prev.filter((id) => !CONTENT_IDS.includes(id));
      return d === "pages" ? [...CONTENT_IDS, ...games] : games.slice(-1);
    });
  };

  const toggle = (id: string) =>
    setOpen((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      return depth === "spines" ? [id] : [...prev, id];
    });

  const span = Math.min(2, cols);
  const cells = BOXES.reduce((n, b) => n + (open.includes(b.id) ? span : 1), 0);
  const fillers = (cols - (cells % cols)) % cols;

  return (
    <div className="shelf-root">
      <a className="shelf-skip" href="#shelf-cabinet">
        Skip to the shelves
      </a>
      <div className="shelf-cabinet-wrap">
        <Crown cols={cols} depth={depth} setDepth={setDepth} />
        <main id="shelf-cabinet" className="shelf-cabinet" data-depth={depth} aria-label="Cabinet of work">
          {BOXES.map((b, i) => {
            const isOpen = open.includes(b.id);
            return (
              <ShelfBox
                key={b.id}
                id={b.id}
                kind={b.kind}
                open={isOpen}
                active={isOpen && depth === "spines"}
                onToggle={() => toggle(b.id)}
                title={b.title}
                sub={
                  <>
                    {b.sub}
                    {depth === "pages" && b.more && !isOpen ? <span className="shelf-slip-more">{b.more}</span> : null}
                  </>
                }
                object={b.object}
                order={i}
                cols={cols}
              >
                {b.panel(depth)}
              </ShelfBox>
            );
          })}
          {Array.from({ length: fillers }, (_, i) => (
            <ShelfBox key={`empty-${i}`} id={`empty-${i}`} kind="empty" open={false} active={false} order={BOXES.length + i} cols={cols} />
          ))}
        </main>
        <footer className="shelf-plinth">
          <div className="shelf-plinth-board">
            <p>
              <strong>{profile.name}</strong>, {profile.role.toLowerCase()}. Every shelf above is real work.
            </p>
            <EmailAction />
          </div>
          <svg className="shelf-feet" viewBox="0 0 1000 28" preserveAspectRatio="none" aria-hidden="true" focusable="false">
            <path d="M8 0 H92 L80 26 H22 Z M908 0 H992 L978 26 H920 Z" className="shelf-foot" vectorEffect="non-scaling-stroke" />
          </svg>
        </footer>
      </div>
    </div>
  );
}
