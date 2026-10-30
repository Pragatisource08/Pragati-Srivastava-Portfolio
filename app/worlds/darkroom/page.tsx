import { Archivo, Covered_By_Your_Grace } from "next/font/google";
import type { CSSProperties } from "react";
import { Icon } from "@/components/icons";
import { experience, openSource, profile, projects, recognition, skills } from "@/lib/content";
import { Contact } from "@/components/worlds/darkroom/Contact";
import { Emerge } from "@/components/worlds/darkroom/Emerge";
import { PortBench } from "@/components/worlds/darkroom/PortBench";
import { ProofSheet } from "@/components/worlds/darkroom/ProofSheet";
import { PullThePrint } from "@/components/worlds/darkroom/PullThePrint";
import { Shell } from "@/components/worlds/darkroom/Shell";
import { Tray } from "@/components/worlds/darkroom/Tray";
import s from "@/components/worlds/darkroom/cls";
import "@/components/worlds/darkroom/darkroom.css";

// Archivo's width axis gives the condensed bottle-label voice and the plain body
// from one family; Covered By Your Grace is the grease pencil on trays and strips.
const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--dr-font-label" });
const pencil = Covered_By_Your_Grace({ subsets: ["latin"], weight: "400", variable: "--dr-font-pencil" });

function StationHeading({ id, station, plain }: { id: string; station: string; plain: string }) {
  return (
    <h2 className={s.h2} id={`${id}-title`}>
      <span className={s.station}>{station}</span>
      <span className="sr-only">: </span>
      <span className={s.h2Plain}>{plain}</span>
    </h2>
  );
}

function Hanger() {
  return (
    <svg className={s.clip} width="26" height="34" viewBox="0 0 26 34" aria-hidden="true">
      <path d="M13 0v6" stroke="currentColor" strokeWidth="2" />
      <rect x="5" y="6" width="16" height="22" rx="3" fill="currentColor" />
      <path d="M8 14h10M8 19h10" stroke="#F7E8CC" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M7 28l-1 6M19 28l1 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function DarkroomPage() {
  const [lead, ...rest] = projects;

  return (
    <Shell fontClass={`${archivo.variable} ${pencil.variable}`}>
      {/* COMPOSE: who she is */}
      <section id="compose" className={`${s.station_} ${s.compose}`} aria-label="About Pragati">
        <div className={s.wrap}>
          <div className={s.hero}>
            <h1 className={s.name}>{profile.name}</h1>
            <div className={s.heroText}>
              <p className={s.role}>
                <strong>{profile.role}.</strong> {profile.focus}.
              </p>
              <p className={s.summary}>{profile.summary}</p>
              <Contact />
              <p className={s.heroFoot}>
                {profile.degree} · {profile.university} <span className={s.nowrap}>· {profile.years}</span>
              </p>
            </div>
            <div className={s.heroTray}>
              <Tray />
              <a href="#pull" className={s.pencilLink}>
                pull one yourself
                <Icon name="arrowDown" size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* EXPOSE: the internship */}
      <section id="expose" className={`${s.station_} ${s.g1}`} aria-labelledby="expose-title">
        <div className={s.wrap}>
          <StationHeading id="expose" station="Expose" plain="the internship" />
          <div className={s.expose}>
            <div className={s.measure}>
              <h3 className={s.h3}>{experience.role}</h3>
              <p className={s.meta}>
                <b>{experience.company}</b> · {experience.dates} · {experience.location} · {experience.product}
              </p>
              <p className={s.lead}>{experience.summary}</p>
              <ul className={s.points}>
                {experience.points.map((p, i) => (
                  <li key={p} className={i > 0 ? s.fullOnly : undefined}>
                    {p}
                  </li>
                ))}
              </ul>
              <ul className={s.labels} aria-label="Stack">
                {experience.stack.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
            <aside className={s.recipe} aria-labelledby="cloud9-title">
              <h4 id="cloud9-title" className={s.recipeTitle}>
                Cloud 9, in order
              </h4>
              <ol className={s.recipeSteps}>
                <li>
                  <b>Query in.</b> The Python pipeline on AWS EC2 receives it.
                </li>
                <li>
                  <b>Similarity search.</b> Its embedding is checked against Pinecone.
                </li>
                <li>
                  <b>Close match:</b> answered from Pinecone, no new API call.
                  <span className={s.fullOnly}> Fewer redundant external calls, lower latency.</span>
                </li>
                <li>
                  <b>No match:</b> routed to Google Gemini.
                </li>
                <li>
                  <b>Marked helpful:</b> stored as a vector embedding.
                  <span className={s.fullOnly}> Negative-feedback answers are discarded to keep the store clean.</span>
                </li>
              </ol>
            </aside>
          </div>
        </div>
      </section>

      {/* DEVELOP: the projects */}
      <section id="develop" className={`${s.station_} ${s.g2}`} aria-labelledby="develop-title">
        <div className={s.wrap}>
          <StationHeading id="develop" station="Develop" plain="three projects" />
          <Emerge className={s.prints}>
            {[lead, ...rest].map((p, i) => (
              <article
                key={p.slug}
                className={`${s.print} ${i === 0 ? s.printLead : ""}`}
                style={{ "--i": i } as CSSProperties}
                aria-labelledby={`p-${p.slug}`}
              >
                <div className={s.printInk}>
                  <div>
                    <h3 id={`p-${p.slug}`} className={s.printName}>
                      {p.name}
                    </h3>
                    <p className={s.printContext}>{p.context}</p>
                    <p className={s.printTag}>{p.tagline}</p>
                  </div>
                  <div>
                    <p className={`${s.fullOnly} ${s.printAim}`}>
                      <b>Aim.</b> {p.aim}
                    </p>
                    <ul className={s.points}>
                      {p.points.map((pt, k) => (
                        <li key={pt} className={k > 0 ? s.fullOnly : undefined}>
                          {pt}
                        </li>
                      ))}
                    </ul>
                    <ul className={s.labels} aria-label={`${p.name} stack`}>
                      {p.stack.map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                    <a href={p.link.url} className={s.evidence} target="_blank" rel="noreferrer">
                      {p.link.label}
                      <span className="sr-only"> for {p.name}</span>
                      <Icon name="arrowUpRight" size={16} />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </Emerge>
          <div id="pull" className={s.gameSlot}>
            <PullThePrint />
          </div>
        </div>
      </section>

      {/* FIX: merged open source */}
      <section id="fix" className={`${s.station_} ${s.g3}`} aria-labelledby="fix-title">
        <div className={s.wrap}>
          <StationHeading id="fix" station="Fix" plain="merged, so it stays" />
          <p className={s.repo}>
            Two pull requests merged into{" "}
            <a href={openSource.repoUrl} target="_blank" rel="noreferrer">
              {openSource.repo}
            </a>{" "}
            · {openSource.language} · {openSource.date}
          </p>
          <div className={s.prs}>
            {openSource.prs.map((pr) => (
              <article key={pr.number} className={s.pr} aria-labelledby={`pr-${pr.number}`}>
                <p className={s.prNum}>#{pr.number}</p>
                <div>
                  <h3 id={`pr-${pr.number}`} className={s.h3}>
                    {pr.title}
                    <span className={s.stamp}>{pr.status}</span>
                  </h3>
                  <p>{pr.summary}</p>
                  <p className={`${s.fullOnly} ${s.prDetail}`}>{pr.detail}</p>
                  <a href={pr.url} className={s.evidence} target="_blank" rel="noreferrer">
                    Read PR #{pr.number}
                    <Icon name="arrowUpRight" size={16} />
                  </a>
                </div>
              </article>
            ))}
          </div>
          <div className={s.gameSlot}>
            <PortBench />
          </div>
        </div>
      </section>

      {/* WASH: skills and education */}
      <section id="wash" className={`${s.station_} ${s.g2}`} aria-labelledby="wash-title">
        <div className={s.wrap}>
          <StationHeading id="wash" station="Wash" plain="skills and schooling" />
          <div className={s.wash}>
            <dl className={s.shelf}>
              {Object.entries(skills).map(([group, items]) => (
                <div key={group} className={s.shelfRow}>
                  <dt>{group}</dt>
                  <dd>
                    <ul>
                      {items.map((it) => (
                        <li key={it}>{it}</li>
                      ))}
                    </ul>
                  </dd>
                </div>
              ))}
            </dl>
            <div className={s.school}>
              <h3 className={s.h3}>{profile.degree}</h3>
              <p>{profile.university}</p>
              <dl className={s.readout}>
                <div>
                  <dt>Years</dt>
                  <dd>{profile.years}</dd>
                </div>
                <div>
                  <dt>CGPA</dt>
                  <dd>{profile.cgpa}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* DRY: recognition on the line */}
      <section id="dry" className={`${s.station_} ${s.g1}`} aria-labelledby="dry-title">
        <div className={s.wrap}>
          <StationHeading id="dry" station="Dry" plain="recognition, on the line" />
          <ul className={s.line}>
            {recognition.map((r, i) => (
              <li key={r.title} className={s.hung} style={{ "--i": i } as CSSProperties}>
                <Hanger />
                <div className={s.hungPrint}>
                  <h3 className={s.hungTitle}>{r.title}</h3>
                  <p>{r.detail}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className={s.gameSlot}>
            <ProofSheet />
          </div>
        </div>
      </section>

      {/* The finished print: contact */}
      <section id="contact" className={s.finish} aria-labelledby="contact-title">
        <div className={s.wrap}>
          <h2 id="contact-title" className={s.finishTitle}>
            The print is dry.
          </h2>
          <p className={s.finishText}>
            {profile.name}, {profile.role.toLowerCase()}: {profile.focus}. If the work holds up under the
            light, the next step is a conversation.
          </p>
          <Contact tone="dark" copy />
          <p className={s.colophon}>
            The portrait in the tray develops on a simulated paper curve. Nothing else on this page is
            staged.
          </p>
        </div>
      </section>
    </Shell>
  );
}
