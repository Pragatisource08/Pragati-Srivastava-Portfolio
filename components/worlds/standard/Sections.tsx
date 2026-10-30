"use client";

import type { ReactNode } from "react";
import { Icon } from "@/components/icons";
import { experience, links, openSource, profile, projects, recognition, skills } from "@/lib/content";
import { CopyEmail, EmailButton, ProfileLinks } from "./Contact";
import { Detail } from "./Depth";
import { MergeIcon } from "./glyphs";

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="std-section pt-20 first:pt-0 lg:pt-24">
      <h2 id={`${id}-h`} className="std-display std-h2">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Pills({ items, label }: { items: readonly string[]; label: string }) {
  return (
    <ul className="std-pills mt-4" aria-label={label}>
      {items.map((s) => (
        <li key={s} className="std-pill">
          {s}
        </li>
      ))}
    </ul>
  );
}

export function About() {
  return (
    <Section id="about" title="About">
      <div className="std-prose max-w-[62ch] text-[1.0625rem]">
        <p>
          I&rsquo;m a computer science undergraduate building <span className="std-strong">production Python backends and REST APIs</span>. During
          a Generative AI internship at <a href="#experience">CSRBOX</a>, I built a Gemini-powered pipeline with Pinecone
          similarity search that serves live traffic from AWS EC2.
        </p>
        <p>
          I led my team at the Smart India Hackathon 2026 with <a href="#projects">BharatRitu</a>, a weather-report
          service that scores every citizen report before anyone trusts it. My <a href="#projects">AirQuality</a> globe
          was a NASA Space Apps Challenge 2025 Global Nominee, and I have{" "}
          <a href="#open-source">merged pull requests</a> in open source.
        </p>
        <p>
          I study {profile.degree.replace("B.Tech, ", "")} at {profile.university}, {profile.years}.
        </p>
      </div>
    </Section>
  );
}

export function Experience() {
  const e = experience;
  return (
    <Section id="experience" title="Experience">
      <article className="grid gap-x-8 gap-y-1 sm:grid-cols-[8.5rem_minmax(0,1fr)]">
        <p className="std-meta std-num pt-0.5">{e.dates}</p>
        <div>
          <h3 className="std-h3">
            {e.role} <span className="font-normal text-[color:var(--ink-3)]">at</span> {e.company}
          </h3>
          <p className="std-meta mt-0.5">
            {e.product} · {e.location}
          </p>
          <p className="mt-3 max-w-[62ch]">{e.summary}</p>
          <Detail>
            <ul className="std-points max-w-[62ch]">
              {e.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </Detail>
          <Pills items={e.stack} label="Stack" />
        </div>
      </article>
      <p className="mt-10">
        <a className="std-link" href={links.resume} target="_blank" rel="noreferrer">
          <Icon name="resume" size={17} />
          View the full résumé
          <span className="sr-only"> (PDF)</span>
          <Icon name="arrowUpRight" size={15} />
        </a>
      </p>
    </Section>
  );
}

export function Projects() {
  return (
    <Section id="projects" title="Projects">
      <ul className="std-rows">
        {projects.map((p) => (
          <li key={p.slug} className="std-row">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h3 className="std-h3 text-[1.0625rem]">
                <a href={p.link.url} target="_blank" rel="noreferrer" className="std-row-link">
                  {p.name}
                  <span className="sr-only">, {p.link.label.toLowerCase()} (opens in a new tab)</span>
                  <Icon name="arrowUpRight" size={16} className="std-row-arrow" />
                </a>
              </h3>
              <span className="std-meta">{p.link.label}</span>
            </div>
            <p className="std-meta mt-0.5">{p.context}</p>
            <p className="mt-2.5 max-w-[60ch]">{p.tagline}</p>
            <Detail>
              <p className="max-w-[60ch] pt-3 text-[0.9375rem]">
                <span className="std-strong">Aim.</span> {p.aim}
              </p>
              <ul className="std-points max-w-[60ch]">
                {p.points.map((pt) => (
                  <li key={pt}>{pt}</li>
                ))}
              </ul>
            </Detail>
            <Pills items={p.stack} label={`${p.name} stack`} />
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function OpenSource() {
  return (
    <Section id="open-source" title="Open source">
      <p className="max-w-[62ch]">
        Two merged pull requests to{" "}
        <a className="std-inline-link" href={openSource.repoUrl} target="_blank" rel="noreferrer">
          {openSource.repo}
        </a>
        , a {openSource.language} project, in {openSource.date}.
      </p>
      <ul className="std-rows mt-5">
        {openSource.prs.map((pr) => (
          <li key={pr.number} className="std-row grid grid-cols-[3.5rem_minmax(0,1fr)] gap-x-4 sm:grid-cols-[4.5rem_minmax(0,1fr)]">
            <span className="std-mono pt-[0.2rem] text-[0.9375rem] text-[color:var(--ink-3)]">#{pr.number}</span>
            <div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <h3 className="std-h3 text-[1.0625rem]">
                  <a href={pr.url} target="_blank" rel="noreferrer" className="std-row-link">
                    {pr.title}
                    <span className="sr-only">, pull request {pr.number} on GitHub</span>
                    <Icon name="arrowUpRight" size={16} className="std-row-arrow" />
                  </a>
                </h3>
                <span className="std-badge">
                  <MergeIcon size={13} />
                  {pr.status}
                </span>
              </div>
              <p className="mt-2 max-w-[60ch]">{pr.summary}</p>
              <Detail>
                <p className="max-w-[60ch] pt-3 text-[0.9375rem]">
                  <span className="std-strong">Detail.</span> {pr.detail}
                </p>
              </Detail>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}

function DefRow({ term, children }: { term: ReactNode; children: ReactNode }) {
  return (
    <div className="grid gap-x-8 gap-y-1 py-4 sm:grid-cols-[8.5rem_minmax(0,1fr)]">
      <dt className="std-meta pt-0.5">{term}</dt>
      <dd>{children}</dd>
    </div>
  );
}

export function Background() {
  return (
    <Section id="background" title="Background">
      <h3 className="std-h3">Recognition</h3>
      <dl className="std-rule-list mt-2">
        {recognition.map((r) => (
          <DefRow key={r.title} term={r.title}>
            {r.detail}
          </DefRow>
        ))}
      </dl>

      <h3 className="std-h3 mt-12">Education</h3>
      <dl className="std-rule-list mt-2">
        <DefRow term={<span className="std-num">{profile.years}</span>}>
          <span className="std-strong">{profile.degree}</span>
          <br />
          {profile.university}
          <span className="std-meta block mt-0.5">CGPA {profile.cgpa}</span>
        </DefRow>
      </dl>

      <h3 className="std-h3 mt-12">Skills</h3>
      <dl className="std-rule-list mt-2">
        {Object.entries(skills).map(([group, list]) => (
          <DefRow key={group} term={group}>
            {list.join(", ")}
          </DefRow>
        ))}
      </dl>
    </Section>
  );
}

export function ContactSection() {
  return (
    <Section id="contact" title="Contact">
      <p className="std-display max-w-[30ch] text-[1.5rem] leading-[1.3] text-[color:var(--ink)] [font-variation-settings:'opsz'_24]">
        Have a role, a project, or a question about any of this work? Email is the fastest way to reach me.
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <EmailButton />
        <CopyEmail />
      </div>
      <ProfileLinks className="mt-6" />
    </Section>
  );
}
