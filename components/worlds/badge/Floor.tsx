import type { CSSProperties, ReactNode } from "react";
import { Icon } from "@/components/icons";
import { experience, links, openSource, profile, projects, recognition, skills } from "@/lib/content";
import { CopyAddress, PassToggle } from "./BadgeWorld";
import { DemoBooth } from "./DemoBooth";
import { JudgingRound } from "./JudgingRound";

export const ZONES = [
  { id: "check-in", letter: "A", title: "Experience", place: "Check-in desk", tone: "orange" },
  { id: "expo", letter: "B", title: "Projects", place: "Expo hall", tone: "teal" },
  { id: "merge-desk", letter: "C", title: "Open source", place: "Merge desk", tone: "orange" },
  { id: "demo-booth", letter: "D", title: "Demo-day booth", place: "Game: boot the server", tone: "teal" },
  { id: "recognition", letter: "E", title: "Recognition", place: "Wristband table", tone: "orange" },
  { id: "skills", letter: "F", title: "Skills", place: "Sticker table", tone: "teal" },
  { id: "registration", letter: "G", title: "Education", place: "Registration", tone: "orange" },
  { id: "judging", letter: "H", title: "Judging round", place: "Game: six questions", tone: "teal" },
] as const;

type ZoneId = (typeof ZONES)[number]["id"];

function Zone({ id, children, wide }: { id: ZoneId; children: ReactNode; wide?: boolean }) {
  const z = ZONES.find((x) => x.id === id)!;
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="badge-zone" data-wide={wide ? "true" : undefined}>
      <div className="badge-sign-hang">
        <div className="badge-sign" data-tone={z.tone}>
          <span className="badge-sign-letter" aria-hidden="true">
            {z.letter}
          </span>
          <span className="badge-sign-text">
            <h2 id={`${id}-h`}>{z.title}</h2>
            <span className="badge-sign-place">
              Zone {z.letter}
              <span className="badge-dot" aria-hidden="true" />
              {z.place}
            </span>
          </span>
        </div>
      </div>
      {children}
    </section>
  );
}

/** Splits "a · b" and prints the separator as a drawn dot (the body face's middot sits off-centre). */
function Dotted({ text }: { text: string }) {
  const parts = text.split(" · ");
  return (
    <>
      {parts.map((part, i) => (
        <span key={part}>
          {i > 0 ? <span className="badge-dot" aria-hidden="true" /> : null}
          {i > 0 ? <span className="badge-sr">, </span> : null}
          {part}
        </span>
      ))}
    </>
  );
}

function Chips({ items, tone = "ink" }: { items: readonly string[]; tone?: "ink" | "light" }) {
  return (
    <ul className="badge-chips" data-tone={tone}>
      {items.map((s) => (
        <li key={s}>{s}</li>
      ))}
    </ul>
  );
}

export function Directory() {
  return (
    <nav className="badge-directory" aria-labelledby="directory-h">
      <div className="badge-directory-head">
        <h2 id="directory-h">Venue directory</h2>
        <p>
          Every zone is open on your badge. Pick a pass: the visitor pass is the two-minute read, all-access adds the
          engineering detail everywhere.
        </p>
        <PassToggle label="Reading depth for the whole page" />
      </div>
      <ul className="badge-directory-list">
        {ZONES.map((z) => (
          <li key={z.id}>
            <a href={`#${z.id}`}>
              <span className="badge-dir-letter" data-tone={z.tone} aria-hidden="true">
                {z.letter}
              </span>
              <span className="badge-dir-text">
                <span className="badge-dir-title">{z.title}</span>
                <span className="badge-dir-place">{z.place}</span>
              </span>
              <Icon name="arrowDown" size={18} className="badge-dir-arrow" />
            </a>
          </li>
        ))}
        <li>
          <a href="#help-desk">
            <span className="badge-dir-letter" data-tone="white" aria-hidden="true">
              <Icon name="mail" size={18} />
            </span>
            <span className="badge-dir-text">
              <span className="badge-dir-title">Contact</span>
              <span className="badge-dir-place">Help desk, by the exit</span>
            </span>
            <Icon name="arrowDown" size={18} className="badge-dir-arrow" />
          </a>
        </li>
      </ul>
    </nav>
  );
}

export function CheckIn() {
  return (
    <Zone id="check-in">
      <div className="badge-desk">
        <div className="badge-desk-top" aria-hidden="true" />
        <div className="badge-desk-front">
          <div className="badge-tent">
            <span className="badge-tent-company">{experience.company}</span>
            <span className="badge-tent-meta">
              {experience.dates}
              <span className="badge-dot" aria-hidden="true" />
              {experience.location}
            </span>
          </div>
          <article className="badge-sheet">
            <h3>{experience.role}</h3>
            <p className="badge-sheet-product">{experience.product}</p>
            <p className="badge-sheet-summary">{experience.summary}</p>
            <div className="badge-all">
              <ul className="badge-points">
                {experience.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              <Chips items={experience.stack} />
            </div>
          </article>
        </div>
      </div>
    </Zone>
  );
}

const BANNER_TONE: Record<string, string> = { bharatritu: "orange", airquality: "teal", finances: "navy" };

function BannerArt({ slug }: { slug: string }) {
  if (slug === "bharatritu") {
    return (
      <ul className="badge-art-stamps" aria-label="Verdicts the engine assigns">
        <li data-v="ok">Verified</li>
        <li data-v="mid">Under Review</li>
        <li data-v="bad">Flagged</li>
      </ul>
    );
  }
  if (slug === "airquality") {
    return (
      <svg className="badge-art-globe" viewBox="0 0 120 120" aria-hidden="true">
        <circle cx="60" cy="60" r="52" />
        <ellipse cx="60" cy="60" rx="22" ry="52" />
        <ellipse cx="60" cy="60" rx="42" ry="52" />
        <path d="M8 60h104M14 34h92M14 86h92" />
        <circle className="badge-art-dot" cx="78" cy="40" r="4" />
        <circle className="badge-art-dot" cx="38" cy="70" r="3" />
        <circle className="badge-art-dot" cx="70" cy="82" r="3.5" />
      </svg>
    );
  }
  return (
    <svg className="badge-art-ledger" viewBox="0 0 120 80" aria-hidden="true">
      <path d="M6 10h108M6 30h108M6 50h108M6 70h108M40 4v72" />
    </svg>
  );
}

export function Expo() {
  return (
    <Zone id="expo" wide>
      <div className="badge-expo">
        {projects.map((p) => (
          <article key={p.slug} className="badge-banner" data-slug={p.slug} data-tone={BANNER_TONE[p.slug]}>
            <div className="badge-banner-sheet">
              <div className="badge-banner-head">
                <p className="badge-banner-context">
                  <Dotted text={p.context} />
                </p>
                <h3>{p.name}</h3>
              </div>
              <div className="badge-banner-body">
                <p className="badge-banner-tagline">{p.tagline}</p>
                <BannerArt slug={p.slug} />
                <p className="badge-banner-aim">{p.aim}</p>
                <div className="badge-all">
                  <ul className="badge-points">
                    {p.points.map((pt) => (
                      <li key={pt}>{pt}</li>
                    ))}
                  </ul>
                </div>
                <Chips items={p.stack} />
                <a className="badge-banner-link" href={p.link.url} target="_blank" rel="noreferrer">
                  {p.link.label}
                  <span className="badge-sr"> for {p.name}</span>
                  <Icon name="arrowUpRight" size={16} />
                </a>
              </div>
            </div>
            <div className="badge-banner-base" aria-hidden="true" />
          </article>
        ))}
      </div>
    </Zone>
  );
}

export function MergeDesk() {
  return (
    <Zone id="merge-desk">
      <p className="badge-zone-lede">
        Two pull requests merged into{" "}
        <a href={openSource.repoUrl} target="_blank" rel="noreferrer">
          {openSource.repo}
        </a>{" "}
        ({openSource.language}, {openSource.date}).
      </p>
      <div className="badge-tickets">
        {openSource.prs.map((pr) => (
          <article key={pr.number} className="badge-ticket">
            <div className="badge-ticket-paper">
            <div className="badge-ticket-stub">
              <span className="badge-ticket-kind">Token</span>
              <span className="badge-ticket-num badge-num">#{pr.number}</span>
              <span className="badge-ticket-status">
                <Icon name="check" size={14} strokeWidth={2.5} />
                {pr.status}
              </span>
            </div>
            <div className="badge-ticket-body">
              <h3>{pr.title}</h3>
              <p>{pr.summary}</p>
              <p className="badge-all badge-ticket-detail">{pr.detail}</p>
              <a href={pr.url} target="_blank" rel="noreferrer">
                Read PR #{pr.number}
                <Icon name="arrowUpRight" size={16} />
              </a>
            </div>
            </div>
          </article>
        ))}
      </div>
    </Zone>
  );
}

export function Booth() {
  return (
    <Zone id="demo-booth" wide>
      <DemoBooth />
    </Zone>
  );
}

const BAND_TONE = ["teal", "orange", "white"] as const;

export function Wristbands() {
  return (
    <Zone id="recognition">
      <ul className="badge-bands">
        {recognition.map((r, i) => (
          <li key={r.title} className="badge-band" data-tone={BAND_TONE[i % 3]}>
            <span className="badge-band-strap">
              <span className="badge-band-title">{r.title}</span>
              <span className="badge-band-detail">{r.detail}</span>
            </span>
            <span className="badge-band-snap" aria-hidden="true" />
          </li>
        ))}
      </ul>
    </Zone>
  );
}

const STICKER_TONE = ["orange", "teal", "navy", "white", "sky"] as const;

export function Stickers() {
  return (
    <Zone id="skills">
      <div className="badge-stickersheet">
        {Object.entries(skills).map(([group, items], gi) => (
          <div key={group} className="badge-sticker-group">
            <h3>{group}</h3>
            <ul>
              {items.map((item, i) => (
                <li
                  key={item}
                  className="badge-sticker"
                  data-tone={STICKER_TONE[gi % STICKER_TONE.length]}
                  data-shape={(i + gi) % 3}
                  style={{ "--r": `${((i * 37 + gi * 11) % 7) - 3}deg` } as CSSProperties}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Zone>
  );
}

export function Registration() {
  const rows: [string, string][] = [
    ["Name", profile.name],
    ["Institution", profile.university],
    ["Programme", profile.degree],
    ["Batch", profile.years],
    ["CGPA", profile.cgpa],
  ];
  return (
    <Zone id="registration">
      <div className="badge-regform">
        <p className="badge-regform-title">Participant registration</p>
        <dl>
          {rows.map(([k, v]) => (
            <div key={k} className="badge-reg-row">
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Zone>
  );
}

export function Judging() {
  return (
    <Zone id="judging" wide>
      <div className="badge-judging-intro">
        <p>
          You are on the panel. Six questions about Pragati&rsquo;s work, and every answer is printed somewhere on this
          floor. Score the round, then send her the ones you want to hear in person.
        </p>
      </div>
      <JudgingRound />
    </Zone>
  );
}

export function HelpDesk() {
  return (
    <footer id="help-desk" className="badge-help" aria-labelledby="help-h">
      <div className="badge-help-inner">
        <h2 id="help-h">Want Pragati on your team?</h2>
        <p>
          A backend internship, a question about a project, a follow-up on a PR: the badge says where to find her.
          Email is the fastest way in.
        </p>
        <div className="badge-help-actions">
          <a className="badge-btn-primary badge-btn-lg" href={links.mailto}>
            <Icon name="mail" size={22} />
            Email Pragati
          </a>
          <CopyAddress />
        </div>
        <ul className="badge-help-links">
          <li>
            <a href={links.linkedin} target="_blank" rel="noreferrer">
              <Icon name="linkedin" size={18} />
              LinkedIn
            </a>
          </li>
          <li>
            <a href={links.github} target="_blank" rel="noreferrer">
              <Icon name="github" size={18} />
              GitHub
            </a>
          </li>
          <li>
            <a href={links.resume} target="_blank" rel="noreferrer">
              <Icon name="resume" size={18} />
              Resume (PDF)
            </a>
          </li>
        </ul>
      </div>
      <p className="badge-colophon">
        <Dotted text={`${profile.name} · ${profile.role} · ${profile.focus}`} />
      </p>
    </footer>
  );
}
