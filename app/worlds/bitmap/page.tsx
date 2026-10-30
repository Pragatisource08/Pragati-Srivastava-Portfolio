import { experience, links, openSource, profile, projects, recognition, skills } from "@/lib/content";
import { Icon } from "@/components/icons";
import { BitmapWorld } from "@/components/worlds/bitmap/BitmapWorld";
import { Headline } from "@/components/worlds/bitmap/Headline";
import { Portrait } from "@/components/worlds/bitmap/Portrait";
import { PixelText } from "@/components/worlds/bitmap/PixelText";
import { ContactLinks, CopyAddress, EmailButton } from "@/components/worlds/bitmap/Contact";
import { PortGrid } from "@/components/worlds/bitmap/PortGrid";
import { AnswerSheet } from "@/components/worlds/bitmap/AnswerSheet";
import { ProofDesk } from "@/components/worlds/bitmap/ProofDesk";

function SheetHead({ id, pixel, title, dek }: { id: string; pixel: string; title: string; dek: string }) {
  return (
    <div className="bm-sheethead">
      <h2 id={`${id}-h`} className="bm-h2 bm-u-h2">
        <span className="sr-only">{title}</span>
        <PixelText text={pixel} size="bm-u-h2" gap={0.25} className="bm-raster" />
      </h2>
      <p className="bm-dek">{dek}</p>
    </div>
  );
}

function Stack({ items, label = "Stack" }: { items: readonly string[]; label?: string }) {
  return (
    <div className="bm-stack">
      <span className="bm-ctl-label">{label}</span>
      <ul>
        {items.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
    </div>
  );
}

function OutLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="bm-out">
      <span>{children}</span>
      <Icon name="arrowUpRight" size={16} />
    </a>
  );
}

const skillRows = Object.entries(skills) as [string, readonly string[]][];

export default function BitmapPage() {
  return (
    <BitmapWorld>
      {/* Sheet: the name, at five sizes */}
      <section id="pragati" className="bm-hero bm-wrap" aria-labelledby="pragati-h">
        <span id="pragati-h" className="sr-only">
          Pragati Srivastava, {profile.role}
        </span>
        <Headline />
        <div className="bm-hero-grid">
          <div className="bm-wf">
            <div className="bm-wf-row bm-u-sub">
              <span className="bm-cap num" aria-hidden="true" />
              <PixelText text="SRIVASTAVA" size="bm-u-sub" gap={0.25} develop delay={420} nowrap />
            </div>
            <div className="bm-wf-row bm-u-role">
              <span className="bm-cap num" aria-hidden="true" />
              <p>
                <span className="sr-only">{profile.role}</span>
                <PixelText text={profile.role} size="bm-u-role" develop delay={640} />
              </p>
            </div>
            <div className="bm-wf-row bm-u-focus">
              <span className="bm-cap num" aria-hidden="true" />
              <p>
                <span className="sr-only">{profile.focus}</span>
                <PixelText text={profile.focus} size="bm-u-focus" small />
              </p>
            </div>
            <div className="bm-wf-row bm-wf-smooth">
              <span className="bm-cap" aria-hidden="true">
                text
              </span>
              <div>
                <p className="bm-dissolve">{profile.summary}</p>
                <dl className="bm-facts">
                  <div>
                    <dt>Internship</dt>
                    <dd>
                      {experience.role}, {experience.company}, <span className="num">{experience.dates}</span>
                    </dd>
                  </div>
                  <div>
                    <dt>Degree</dt>
                    <dd>
                      {profile.degree}, <span className="num">{profile.years}</span>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
          <div className="bm-hero-side">
            <Portrait />
            <div className="bm-hero-actions">
              <EmailButton />
              <ContactLinks />
              <CopyAddress />
            </div>
          </div>
        </div>
        <p className="bm-howto">
          <span className="bm-short">Set for display: the short read.</span>
          <span className="bm-full">Set as text: every detail.</span> <strong>Full text</strong> shows every point;{" "}
          <strong>Smooth</strong> traces the pixels into outlines. Both switches sit at the top of the page.
        </p>
      </section>

      {/* Sheet: Work */}
      <section id="work" className="bm-sheet bm-wrap" aria-labelledby="work-h">
        <SheetHead id="work" pixel="WORK" title="Work" dek={`${experience.role}, ${experience.dates}`} />
        <div className="bm-twocol">
          <div className="bm-meta">
            <p className="bm-meta-name">
              <span className="sr-only">{experience.company}</span>
              <PixelText text={experience.company} size="bm-u-name" />
            </p>
            <p>{experience.role}</p>
            <p className="num">
              {experience.dates}, {experience.location}
            </p>
            <p>Product: {experience.product}</p>
          </div>
          <div className="bm-body">
            <p className="bm-lede">{experience.summary}</p>
            <div className="bm-full">
              <ul className="bm-cols">
                {experience.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
            <Stack items={experience.stack} />
          </div>
        </div>
      </section>

      {/* Sheet: Projects */}
      <section id="projects" className="bm-sheet bm-wrap" aria-labelledby="projects-h">
        <SheetHead id="projects" pixel="PROJECTS" title="Projects" dek="A credibility engine, a 3D air-quality globe, and a finance tracker." />
        <div className="bm-projects">
          {projects.map((p) => (
            <article key={p.slug} className="bm-project" aria-labelledby={`${p.slug}-h`}>
              <div className="bm-meta">
                <p>{p.context}</p>
                <OutLink href={p.link.url}>{p.link.label}</OutLink>
              </div>
              <div className="bm-body">
                <h3 id={`${p.slug}-h`} className="bm-project-name">
                  <span className="sr-only">{p.name}</span>
                  <PixelText text={p.name} size="bm-u-name" />
                </h3>
                <p className="bm-tagline">{p.tagline}</p>
                <div className="bm-full">
                  <p className="bm-aim">
                    <strong>Aim.</strong> {p.aim}
                  </p>
                  <ul className="bm-cols">
                    {p.points.map((pt) => (
                      <li key={pt}>{pt}</li>
                    ))}
                  </ul>
                </div>
                <Stack items={p.stack} />
              </div>
            </article>
          ))}
        </div>
        <ProofDesk />
      </section>

      {/* Sheet: Open source */}
      <section id="source" className="bm-sheet bm-wrap" aria-labelledby="source-h">
        <SheetHead id="source" pixel="SOURCE" title="Open source" dek={`Two merged pull requests to ${openSource.repo}, ${openSource.language}, ${openSource.date}.`} />
        <div className="bm-prs">
          {openSource.prs.map((pr) => (
            <article key={pr.number} className="bm-pr" aria-labelledby={`pr-${pr.number}`}>
              <p className="bm-pr-num">
                <span className="sr-only">Pull request {pr.number}</span>
                <PixelText text={`#${pr.number}`} size="bm-u-num" gap={0.25} nowrap />
              </p>
              <div className="bm-pr-body">
                <h3 id={`pr-${pr.number}`} className="bm-pr-title">
                  {pr.title} <span className="bm-merged">{pr.status}</span>
                </h3>
                <p>{pr.summary}</p>
                <p className="bm-full bm-pr-detail">{pr.detail}</p>
                <OutLink href={pr.url}>View PR #{pr.number}</OutLink>
              </div>
            </article>
          ))}
        </div>
        <p className="bm-repo">
          <OutLink href={openSource.repoUrl}>{openSource.repo} on GitHub</OutLink>
        </p>
        <PortGrid />
      </section>

      {/* Sheet: Record */}
      <section id="record" className="bm-sheet bm-wrap" aria-labelledby="record-h">
        <SheetHead id="record" pixel="RECORD" title="Recognition, skills, education" dek="Recognition, the character set, and the degree." />
        <div className="bm-record">
          <div>
            <h3 className="bm-h3">Recognition</h3>
            <ul className="bm-honors">
              {recognition.map((r) => (
                <li key={r.title}>
                  <span className="bm-honor-title">{r.title}</span>
                  <span className="bm-honor-detail">{r.detail}</span>
                </li>
              ))}
            </ul>
            <h3 className="bm-h3">Education</h3>
            <dl className="bm-edu">
              <div>
                <dt>Degree</dt>
                <dd>{profile.degree}</dd>
              </div>
              <div>
                <dt>University</dt>
                <dd>{profile.university}</dd>
              </div>
              <div>
                <dt>Years</dt>
                <dd className="num">{profile.years}</dd>
              </div>
              <div>
                <dt>CGPA</dt>
                <dd className="num">{profile.cgpa}</dd>
              </div>
            </dl>
          </div>
          <div>
            <h3 className="bm-h3">Character set</h3>
            <div className="bm-charset">
              {skillRows.map(([group, items]) => (
                <div key={group} className="bm-charset-row">
                  <h4>{group}</h4>
                  <ul>
                    {items.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sheet: Viva */}
      <section id="viva" className="bm-sheet bm-wrap" aria-labelledby="viva-h">
        <SheetHead id="viva" pixel="VIVA" title="Viva" dek="An answer sheet. You have read the page; mark it." />
        <AnswerSheet />
      </section>

      {/* Sheet: Contact, the colophon */}
      <section id="contact" className="bm-contact" aria-labelledby="contact-h">
        <div className="bm-wrap">
          <h2 id="contact-h" className="bm-h2 bm-u-h2">
            <span className="sr-only">Contact</span>
            <PixelText text="WRITE TO PRAGATI" size="bm-u-h2" gap={0.25} className="bm-raster" />
          </h2>
          <div className="bm-contact-grid">
            <div>
              <p className="bm-contact-lede">
                Backend roles, API work, applied AI, or a question about any sheet above: the fastest route is email.
              </p>
              <div className="bm-contact-actions">
                <EmailButton />
                <CopyAddress />
              </div>
            </div>
            <ContactLinks className="bm-links-inverse" />
          </div>
          <div className="bm-colophon">
            <h3 className="bm-h3">Colophon</h3>
            <p>
              Display set in PS 5x7, a bitmap face drawn on a seven-row grid for this page; interface in Silkscreen; text in Schibsted
              Grotesk. Pixels scale in whole multiples only, and nothing is smoothed until you ask. Portrait: an 8 x 8 ordered dither of a
              400 px photograph.
            </p>
            <p className="bm-foot">
              <span>{profile.name}</span>
              <a href="#pragati">
                <Icon name="arrowRight" size={16} className="bm-up" />
                <span>Back to the first sheet</span>
              </a>
              <a href={links.resume} target="_blank" rel="noopener noreferrer">
                Resume PDF
              </a>
            </p>
          </div>
        </div>
      </section>
    </BitmapWorld>
  );
}
