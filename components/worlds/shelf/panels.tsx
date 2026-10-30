import { Icon } from "@/components/icons";
import { experience, openSource, profile, projects, recognition, skills, type Project } from "@/lib/content";
import { CopyAddress, EmailAction, SealLinks } from "./Actions";
import { HangingScroll } from "./objects";

export type Depth = "spines" | "pages";

function Out({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a className="shelf-link" href={href} target="_blank" rel="noopener noreferrer">
      {children}
      <Icon name="arrowUpRight" size={15} />
    </a>
  );
}

function Stack({ items, label }: { items: readonly string[]; label: string }) {
  return (
    <ul className="shelf-tags" aria-label={label}>
      {items.map((s) => (
        <li key={s}>{s}</li>
      ))}
    </ul>
  );
}

function Points({ items }: { items: string[] }) {
  return (
    <ul className="shelf-points">
      {items.map((p) => (
        <li key={p}>{p}</li>
      ))}
    </ul>
  );
}

export function PortraitPanel({ depth }: { depth: Depth }) {
  return (
    <div className="shelf-panel shelf-panel-portrait">
      <HangingScroll size={150} />
      <div className="shelf-panel-text">
        <p className="shelf-panel-lead">
          {profile.role}. {profile.focus}.
        </p>
        <p>{profile.summary}</p>
        {depth === "pages" ? (
          <p className="shelf-meta">
            {profile.degree}, {profile.university}, {profile.years}.
          </p>
        ) : null}
        <div className="shelf-panel-actions">
          <EmailAction />
          <SealLinks />
        </div>
      </div>
    </div>
  );
}

export function InternshipPanel({ depth }: { depth: Depth }) {
  return (
    <div className="shelf-panel">
      <p className="shelf-panel-lead">{experience.product}.</p>
      <p className="shelf-meta">
        {experience.company} · {experience.location}
      </p>
      <p>{experience.summary}</p>
      {depth === "pages" ? <Points items={experience.points} /> : null}
      <Stack items={experience.stack} label="Stack" />
    </div>
  );
}

export function ProjectPanel({ project, depth }: { project: Project; depth: Depth }) {
  return (
    <div className="shelf-panel">
      <p className="shelf-panel-lead">{project.tagline}</p>
      <p>{project.aim}</p>
      {depth === "pages" ? <Points items={project.points} /> : <p>{project.points[0]}</p>}
      <Stack items={project.stack} label="Stack" />
      <p>
        <Out href={project.link.url}>
          {project.link.label}: {project.name}
        </Out>
      </p>
    </div>
  );
}

export function PrPanel({ index, depth }: { index: number; depth: Depth }) {
  const pr = openSource.prs[index];
  return (
    <div className="shelf-panel">
      <p className="shelf-meta">
        <span className="shelf-mono">#{pr.number}</span> · {pr.status} into{" "}
        <a className="shelf-link" href={openSource.repoUrl} target="_blank" rel="noopener noreferrer">
          {openSource.repo}
        </a>{" "}
        · {openSource.language} · {openSource.date}
      </p>
      <p className="shelf-panel-lead">{pr.title}</p>
      <p>{pr.summary}</p>
      {depth === "pages" ? <p>{pr.detail}</p> : null}
      <p>
        <Out href={pr.url}>Read PR #{pr.number} on GitHub</Out>
      </p>
    </div>
  );
}

export function RecognitionPanel() {
  return (
    <div className="shelf-panel">
      <dl className="shelf-ledger">
        {recognition.map((r) => (
          <div key={r.title}>
            <dt>{r.title}</dt>
            <dd>{r.detail}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function SkillsPanel() {
  return (
    <div className="shelf-panel">
      <dl className="shelf-ledger shelf-ledger-skills">
        {Object.entries(skills).map(([group, items]) => (
          <div key={group}>
            <dt>{group}</dt>
            <dd>
              <Stack items={items} label={group} />
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function EducationPanel() {
  return (
    <div className="shelf-panel">
      <p className="shelf-panel-lead">{profile.degree}</p>
      <dl className="shelf-ledger">
        <div>
          <dt>University</dt>
          <dd>{profile.university}</dd>
        </div>
        <div>
          <dt>Years</dt>
          <dd className="shelf-num">{profile.years}</dd>
        </div>
        <div>
          <dt>CGPA</dt>
          <dd className="shelf-num">{profile.cgpa}</dd>
        </div>
      </dl>
    </div>
  );
}

export function ContactPanel() {
  return (
    <div className="shelf-panel">
      <p className="shelf-panel-lead">The letter is already addressed. Open it and write.</p>
      <div className="shelf-panel-actions">
        <EmailAction size="lg" />
        <CopyAddress />
      </div>
      <SealLinks />
    </div>
  );
}

export { projects };
