"use client";

import { useState, type ReactNode } from "react";
import { education, experience, links, openSource, profile, projects, recognition, skills } from "./content";
import { CACHE_DISCLAIMER, lookup, SEED_CACHE, THRESHOLD, type Lookup } from "@/lib/games/similarity";
import { Icon } from "@/components/icons";
import { LOGO_BIG, LOGO_SMALL, SURNAME_ART } from "./art";
import { useBoard, type ScreenId } from "./board";
import { Art, Box, Fill, Key, Portrait, Rule, TextLink } from "./grid";

const ROLE_LINE = "Backend engineer — Python, APIs, applied AI";
const FIRST_SENTENCE = profile.summary.split(". ")[0] + ".";

function Gap() {
  return <div className="bbs-gap" aria-hidden />;
}

function ModeKey() {
  const { full, toggleFull } = useBoard();
  return <Key k="Q" label={full ? "Full text: ON" : "Full text: OFF"} pressed={full} onClick={toggleFull} />;
}

function Exits({ back = "main", backLabel = "Main menu", children }: { back?: ScreenId; backLabel?: string; children?: ReactNode }) {
  const { go } = useBoard();
  return (
    <nav aria-label="Exits" className="bbs-exits">
      <Gap />
      <Rule label="Exits" color={8} labelColor={7} />
      <div className="bbs-keys">
        <Key k="Escape" label={backLabel} onClick={() => go(back)} />
        {children}
        <Key k="7" label="Leave mail for Pragati" onClick={() => go("mail")} />
        <ModeKey />
      </div>
    </nav>
  );
}

function ContactKeys({ withEmailKey = true }: { withEmailKey?: boolean }) {
  return (
    <div className="bbs-keys">
      <Key k={withEmailKey ? "E" : "Y"} href={links.mailto} icon="mail" tone="primary" label="Email Pragati" />
      <Key k="L" href={links.linkedin} external icon="linkedin" tone="plain" label="LinkedIn" />
      <Key k="H" href={links.github} external icon="github" tone="plain" label="GitHub" />
      <Key k="R" href={links.resume} external icon="resume" tone="plain" label="Resume" />
    </div>
  );
}

/* ------------------------------------------------------------------ title -- */

export function MainScreen() {
  const { go, headingRef } = useBoard();
  const item = (n: number, label: string, to: ScreenId, tone: "menu" | "primary" = "menu") => (
    <li className={`bbs-m${n}`}>
      <Key k={String(n)} label={label} tone={tone} onClick={() => go(to)} />
    </li>
  );
  return (
    <div className="bbs-title">
      <p className="bbs-connect bbs-c7">
        CONNECT 14400/ARQ/V42BIS<span className="bbs-only-wide">{"  ·  ANSI NIGHTBOARD  ·  NODE 1 OF 1"}</span>
      </p>
      <Art rows={LOGO_BIG} className="bbs-logo bbs-only-wide" />
      <Art rows={LOGO_SMALL} className="bbs-logo bbs-only-narrow" />
      <Art rows={SURNAME_ART} className="bbs-logo bbs-only-wide" />
      <p className="bbs-only-narrow bbs-c13 bbs-center" aria-hidden>
        S R I V A S T A V A
      </p>
      <Gap />
      <div className="bbs-title-grid">
        <Portrait className="bbs-title-portrait" />
        <div>
          <h1 ref={headingRef} tabIndex={-1} className="bbs-c15">
            {profile.name}
          </h1>
          <p className="bbs-c11">{ROLE_LINE}</p>
          <Gap />
          <p className="bbs-c7">{FIRST_SENTENCE}</p>
          <Gap />
          <ContactKeys />
          <Gap />
          <nav aria-label="Main menu">
            <ul className="bbs-menu-grid">
              {item(1, "Who is the sysop", "sysop")}
              {item(2, "Work log", "work")}
              {item(3, "Files area", "files")}
              {item(4, "Message base", "messages")}
              {item(5, "Hall of fame", "fame")}
              {item(6, "Door games", "doors")}
              {item(7, "Leave mail for Pragati", "mail", "primary")}
              {item(8, "Toolbox", "toolbox")}
              {item(9, "School records", "school")}
            </ul>
          </nav>
          <Gap />
          <div className="bbs-keys">
            <ModeKey />
            <Key k="P" label="Page sysop" onClick={() => go("letter")} />
            <Key k="G" label="Log off" onClick={() => go("goodbye")} />
          </div>
          <p className="bbs-c7">
            Command? <span className="bbs-cursor" aria-hidden />
          </p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ sysop -- */

export function SysopScreen() {
  const { go, headingRef, full } = useBoard();
  const [photo, setPhoto] = useState(false);
  return (
    <Box title="Who is the sysop" headingRef={headingRef}>
      <Gap />
      <div className="bbs-split">
        <div>
          {photo ? (
            <div className="bbs-photo-slot">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="bbs-photo" src={profile.photo} width={200} height={200} alt="Photo of Pragati Srivastava, smiling, in a light blazer" />
            </div>
          ) : (
            <Portrait />
          )}
          <Key
            k="V"
            pressed={photo}
            onClick={() => setPhoto((p) => !p)}
            label={photo ? "Back to the ANSI art" : "View the real photo"}
          />
          <div className="bbs-only-narrow">
            <Gap />
          </div>
        </div>
        <div>
          <p>
            <span className="bbs-c15">{profile.name}</span>
            <span className="bbs-c7">, sysop</span>
          </p>
          <p className="bbs-c11">
            {profile.role} {"—"} {profile.focus}.
          </p>
          <Gap />
          <p>{full ? profile.summary : FIRST_SENTENCE}</p>
          <Gap />
          <dl className="bbs-dl-tight">
            <dt>Study</dt>
            <dd>{profile.degree}</dd>
            <dt>At</dt>
            <dd>{profile.university}</dd>
            <dt>Years</dt>
            <dd>{profile.years}</dd>
            {full ? (
              <>
                <dt>Works</dt>
                <dd>{skills.Languages.join(" · ")}</dd>
              </>
            ) : null}
          </dl>
          <Gap />
          <ContactKeys />
        </div>
      </div>
      <Exits>
        <Key k="2" label="Work log" onClick={() => go("work")} />
        <Key k="8" label="Toolbox" onClick={() => go("toolbox")} />
        <Key k="9" label="School records" onClick={() => go("school")} />
      </Exits>
    </Box>
  );
}

/* ------------------------------------------------------------------- work -- */

function CacheTerminal() {
  const [q, setQ] = useState("");
  const [res, setRes] = useState<{ q: string; r: Lookup } | null>(null);
  const ask = (text: string) => {
    const t = text.trim();
    if (!t) return;
    setRes({ q: t, r: lookup(SEED_CACHE, t) });
  };
  return (
    <Box title="Query the Cloud 9 cache" single color={5} titleColor={13} level={3}>
      <p className="bbs-c7">{CACHE_DISCLAIMER}</p>
      <Gap />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(q);
        }}
      >
        <label htmlFor="bbs-cache-q" className="bbs-c11">
          Ask:
        </label>
        <input
          id="bbs-cache-q"
          className="bbs-field"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="how do I reset my password?"
          autoComplete="off"
        />
        <div className="bbs-keys">
          <button type="submit" className="bbs-btn bbs-btn-plain">
            <span className="bbs-key" aria-hidden>
              [<span className="bbs-key-k">Enter</span>]
            </span>{" "}
            <span className="bbs-key-label">Look it up</span>
          </button>
          <Key k="T" tone="plain" label="Try a near-repeat" onClick={() => { setQ("reset password"); ask("reset password"); }} />
        </div>
      </form>
      <div aria-live="polite">
        {res ? (
          <>
            <Gap />
            {res.r.kind === "hit" ? (
              <>
                <p>
                  <span className="bbs-c10">CACHE HIT</span>{" "}
                  <span className="bbs-c7">
                    similarity {res.r.score.toFixed(2)} {"≥"} {THRESHOLD}: answered from the store, no new API call.
                  </span>
                </p>
                <p className="bbs-c15">{res.r.entry.answer}</p>
              </>
            ) : (
              <p>
                <span className="bbs-c14">CACHE MISS</span>{" "}
                <span className="bbs-c7">
                  best match {res.r.score.toFixed(2)} {"<"} {THRESHOLD}: this one would go to Gemini, and be stored only if marked helpful.
                </span>
              </p>
            )}
          </>
        ) : null}
      </div>
    </Box>
  );
}

export function WorkScreen() {
  const { go, headingRef, full } = useBoard();
  return (
    <Box title="Work log" headingRef={headingRef}>
      <Gap />
      <div className="bbs-spread">
        <h3 className="bbs-c14">{experience.company}</h3>
        <p className="bbs-c7">{experience.dates}</p>
      </div>
      <p className="bbs-c15">{experience.role}</p>
      <p className="bbs-c7">
        {experience.location} {"·"} {experience.product}
      </p>
      <Gap />
      <p>{experience.summary}</p>
      {full ? (
        <>
          <Gap />
          <ul className="bbs-list">
            {experience.points.map((p) => (
              <li key={p}>
                <span className="bbs-c3" aria-hidden>
                  {"» "}
                </span>
                {p}
              </li>
            ))}
          </ul>
        </>
      ) : null}
      <Gap />
      <p>
        <span className="bbs-c3">Stack </span>
        <span className="bbs-c11">{experience.stack.join(" · ")}</span>
      </p>
      <Gap />
      <CacheTerminal />
      <Exits>
        <Key k="3" label="Files area" onClick={() => go("files")} />
        <Key k="4" label="Message base" onClick={() => go("messages")} />
      </Exits>
    </Box>
  );
}

/* ------------------------------------------------------------------ files -- */

const FILE_NAMES: Record<string, { file: string; key: string }> = {
  bharatritu: { file: "BHARATRU.ZIP", key: "B" },
  airquality: { file: "AIRQUAL.ZIP", key: "A" },
  finances: { file: "FINANCES.ZIP", key: "F" },
};

export function FilesScreen() {
  const { go, headingRef, full } = useBoard();
  return (
    <Box title="Files area" headingRef={headingRef}>
      <p className="bbs-c7">
        Area 3: projects {"·"} {projects.length} files {"·"} descriptions from FILE_ID.DIZ
      </p>
      {projects.map((p) => {
        const f = FILE_NAMES[p.slug];
        return (
          <article key={p.slug}>
            <Gap />
            <Rule color={8} />
            <h3>
              <span className="bbs-c14">{f.file}</span>
              <span aria-hidden>{"  "}</span>
              <span className="bbs-c15">{p.name}</span>
            </h3>
            <p className="bbs-c11">{p.context}</p>
            <p>{p.tagline}</p>
            {full ? (
              <>
                <Gap />
                <p>
                  <span className="bbs-c3">Aim </span>
                  {p.aim}
                </p>
                <ul className="bbs-list">
                  {p.points.map((pt) => (
                    <li key={pt}>
                      <span className="bbs-c3" aria-hidden>
                        {"» "}
                      </span>
                      {pt}
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
            <p>
              <span className="bbs-c3">Stack </span>
              <span className="bbs-c7">{p.stack.join(" · ")}</span>
            </p>
            <div className="bbs-keys">
              <Key k={f.key} href={p.link.url} external tone="plain" label={`${p.link.label}: ${p.name}`} />
              {p.slug === "bharatritu" ? (
                <Key k="V" label="Door: Verify the report" onClick={() => go("credchek")} />
              ) : null}
            </div>
          </article>
        );
      })}
      <Exits>
        <Key k="4" label="Message base" onClick={() => go("messages")} />
        <Key k="6" label="Door games" onClick={() => go("doors")} />
      </Exits>
    </Box>
  );
}

/* --------------------------------------------------------------- messages -- */

export function MessagesScreen() {
  const { go, headingRef, full } = useBoard();
  const prs = openSource.prs;
  return (
    <Box title="Message base" headingRef={headingRef}>
      <p>
        <span className="bbs-c3">Conference </span>
        <span className="bbs-c15">{openSource.repo}</span>
        <span className="bbs-c7">
          {" "}
          {"·"} {openSource.language} {"·"} {openSource.date}
        </span>
      </p>
      <p className="bbs-c7">
        Scanning for new messages{"…"} <span className="bbs-live"><span className="bbs-blink">{prs.length} NEW</span></span>
      </p>
      {prs.map((pr, i) => (
        <article key={pr.number}>
          <Gap />
          <Rule label={`Msg ${i + 1} of ${prs.length}`} color={8} labelColor={7} />
          <dl className="bbs-dl-tight">
            <dt>From</dt>
            <dd className="bbs-c15">{profile.name}</dd>
            <dt>To</dt>
            <dd>All</dd>
            <dt>Subj</dt>
            <dd>
              <h3 className="bbs-c14">
                #{pr.number} {pr.title}
              </h3>
            </dd>
            <dt>State</dt>
            <dd className="bbs-c10">{pr.status.toUpperCase()}</dd>
          </dl>
          <Gap />
          <p>{pr.summary}</p>
          {full ? <p className="bbs-c11">{pr.detail}</p> : null}
          <div className="bbs-keys">
            <Key k={i === 0 ? "R" : "D"} href={pr.url} external tone="plain" label={`Read PR #${pr.number} on GitHub`} />
            {pr.number === 906 ? <Key k="B" label="Door: Boot the server" onClick={() => go("porthunt")} /> : null}
          </div>
        </article>
      ))}
      <Gap />
      <p className="bbs-c7">
        Whole conference: <TextLink href={openSource.repoUrl}>{openSource.repo}</TextLink>
      </p>
      <Exits>
        <Key k="3" label="Files area" onClick={() => go("files")} />
        <Key k="5" label="Hall of fame" onClick={() => go("fame")} />
      </Exits>
    </Box>
  );
}

/* ------------------------------------------------------------------- fame -- */

export function FameScreen() {
  const { go, headingRef } = useBoard();
  return (
    <Box title="Hall of fame" headingRef={headingRef} color={5} titleColor={13}>
      <div className="bbs-edge bbs-c5" aria-hidden>
        <Fill ch={"▄▀"} />
      </div>
      {recognition.map((r) => (
        <article key={r.title}>
          <Gap />
          <h3 className="bbs-c14">{r.title}</h3>
          <p>{r.detail}</p>
        </article>
      ))}
      <Exits>
        <Key k="3" label="Files area" onClick={() => go("files")} />
        <Key k="6" label="Door games" onClick={() => go("doors")} />
      </Exits>
    </Box>
  );
}

/* ------------------------------------------------------------------ doors -- */

export function DoorsScreen() {
  const { go, headingRef } = useBoard();
  const door = (k: string, file: string, name: string, from: string, to: ScreenId) => (
    <li>
      <Key k={k} label={<><span className="bbs-c14">{file}</span> <span className="bbs-c15">{name}</span></>} onClick={() => go(to)} />
      <p className="bbs-c7" style={{ paddingLeft: "calc(4 * var(--cw))" }}>
        {from}
      </p>
    </li>
  );
  return (
    <Box title="Door games" headingRef={headingRef}>
      <Gap />
      <p>Three doors, each built from Pragati{"’"}s real work. Every door ends at the mail exit.</p>
      <Gap />
      <ul className="bbs-keys-stack" style={{ rowGap: "1em" }}>
        {door("1", "PORTHUNT", "Boot the server", "From merged PR #906: bind a free port before the app crashes.", "porthunt")}
        {door("2", "CREDCHEK", "Verify the report", "From BharatRitu: stamp citizen weather reports like the credibility engine.", "credchek")}
        {door("3", "VIVA", "The viva voce", "Six questions. Every answer is somewhere on this board.", "viva")}
      </ul>
      <Exits />
    </Box>
  );
}

/* ------------------------------------------------------------------- mail -- */

export function MailScreen() {
  const { headingRef } = useBoard();
  const [subj, setSubj] = useState("Hello Pragati — from your portfolio");
  const [body, setBody] = useState("");
  const [copied, setCopied] = useState("");
  const composed = `mailto:${links.email}?subject=${encodeURIComponent(subj)}${body ? `&body=${encodeURIComponent(body)}` : ""}`;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(links.email);
      setCopied("Address copied to the clipboard.");
    } catch {
      setCopied(`Copy failed. The address is ${links.email}`);
    }
  };
  return (
    <Box title="Leave mail for Pragati" headingRef={headingRef} color={9} titleColor={15}>
      <Gap />
      <dl className="bbs-dl-tight">
        <dt>To</dt>
        <dd className="bbs-c15">{profile.name} (sysop)</dd>
      </dl>
      <Gap />
      <div className="bbs-keys">
        <Key k="E" href={links.mailto} icon="mail" tone="primary" label="Email Pragati" />
      </div>
      <p className="bbs-c7">Opens your mail app with the subject line filled in.</p>
      <Gap />
      <Rule label="Or write it here first" color={8} labelColor={7} />
      <label htmlFor="bbs-subj" className="bbs-c3">
        Subj
      </label>
      <input id="bbs-subj" className="bbs-field" value={subj} onChange={(e) => setSubj(e.target.value)} autoComplete="off" />
      <label htmlFor="bbs-body" className="bbs-c3">
        Message
      </label>
      <textarea
        id="bbs-body"
        className="bbs-field"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Say hello, ask about a project, or offer an interview."
      />
      <div className="bbs-keys">
        <a className="bbs-btn bbs-btn-plain" href={composed}>
          <Icon name="mail" className="bbs-icon" strokeWidth={2.25} /> <span className="bbs-key-label">Send it (opens your mail app)</span>
        </a>
      </div>
      <Gap />
      <Rule label="Other lines" color={8} labelColor={7} />
      <div className="bbs-keys">
        <Key k="L" href={links.linkedin} external icon="linkedin" tone="plain" label="LinkedIn" />
        <Key k="H" href={links.github} external icon="github" tone="plain" label="GitHub" />
        <Key k="R" href={links.resume} external icon="resume" tone="plain" label="Resume (PDF)" />
        <Key k="C" icon="copy" tone="plain" label="Copy address" onClick={copy} />
      </div>
      <p className="bbs-c10" aria-live="polite">
        {copied}
      </p>
      <Exits />
    </Box>
  );
}

/* ---------------------------------------------------------------- toolbox -- */

export function ToolboxScreen() {
  const { go, headingRef } = useBoard();
  return (
    <Box title="Toolbox" headingRef={headingRef}>
      <Gap />
      <p className="bbs-c7">The sysop{"’"}s tools, drawer by drawer.</p>
      <Gap />
      <dl className="bbs-dl" style={{ rowGap: "1em" }}>
        {Object.entries(skills).map(([group, items]) => (
          <div key={group} style={{ display: "contents" }}>
            <dt>{group}</dt>
            <dd className="bbs-c15">{items.join(" · ")}</dd>
          </div>
        ))}
      </dl>
      <Exits>
        <Key k="3" label="Files area" onClick={() => go("files")} />
        <Key k="9" label="School records" onClick={() => go("school")} />
      </Exits>
    </Box>
  );
}

/* ----------------------------------------------------------------- school -- */

export function SchoolScreen() {
  const { go, headingRef } = useBoard();
  return (
    <Box title="School records" headingRef={headingRef}>
      <Gap />
      <dl className="bbs-dl">
        {education.map(([k, v]) => (
          <div key={k} style={{ display: "contents" }}>
            <dt>{k}</dt>
            <dd className="bbs-c15">{v}</dd>
          </div>
        ))}
      </dl>
      <Exits>
        <Key k="1" label="Who is the sysop" onClick={() => go("sysop")} />
        <Key k="8" label="Toolbox" onClick={() => go("toolbox")} />
      </Exits>
    </Box>
  );
}

/* ------------------------------------------------------- mail from sysop -- */

export function LetterScreen() {
  const { headingRef } = useBoard();
  return (
    <Box title="Mail from the sysop" headingRef={headingRef} color={9}>
      <p className="bbs-c7">The sysop is not at the keyboard. She left this for you.</p>
      <Gap />
      <dl className="bbs-dl-tight">
        <dt>From</dt>
        <dd className="bbs-c15">Pragati (sysop)</dd>
        <dt>To</dt>
        <dd>You, node 1</dd>
        <dt>Subj</dt>
        <dd className="bbs-c14">Thanks for calling</dd>
      </dl>
      <Rule color={8} />
      <p>Thanks for dialling in.</p>
      <Gap />
      <p>
        This board is my portfolio. The work log is my CSRBOX internship, the files area holds three projects with
        their source, and the message base has my two merged pull requests. The door games are built from that same work.
      </p>
      <Gap />
      <p>If something here is useful to your team, reply. It lands in my inbox.</p>
      <Gap />
      <p className="bbs-c11">{"—"} Pragati</p>
      <Gap />
      <div className="bbs-keys">
        <Key k="Y" href={links.mailto} icon="mail" tone="primary" label="Reply to Pragati" />
      </div>
      <Exits />
    </Box>
  );
}

/* ---------------------------------------------------------------- goodbye -- */

export function GoodbyeScreen() {
  const { go, headingRef } = useBoard();
  return (
    <div>
      <Gap />
      <h2 ref={headingRef} tabIndex={-1} className="bbs-c11">
        Thanks for calling ANSI Nightboard.
      </h2>
      <Gap />
      <p>Before you hang up:</p>
      <div className="bbs-keys">
        <Key k="E" href={links.mailto} icon="mail" tone="primary" label="Leave mail for Pragati" />
      </div>
      <Gap />
      <p className="bbs-c7">+++</p>
      <p className="bbs-c7">ATH0</p>
      <p className="bbs-c15">NO CARRIER</p>
      <Gap />
      <div className="bbs-keys">
        <Key k="C" label="Call again" onClick={() => go("main")} />
      </div>
      <Gap />
      <p className="bbs-c7">
        Typeface: IBM VGA 8x16 from{" "}
        <TextLink href="https://int10h.org/oldschool-pc-fonts/">The Ultimate Oldschool PC Font Pack</TextLink> by VileR,
        CC BY-SA 4.0.
      </p>
    </div>
  );
}
