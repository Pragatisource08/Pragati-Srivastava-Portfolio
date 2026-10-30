"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { Icon } from "@/components/icons";
import { links, profile } from "@/lib/content";
import { useFile } from "./FileState";
import { Tick } from "./Ink";
import { records } from "./records";
import { s } from "./styles";

const PLACE = [0.16, 1, 0.3, 1] as const;

export const EXTRA_ROWS = [
  { no: 8, title: "Annexure: certificates & apparatus", href: "#annexure" },
  { no: 9, title: "Submit the file to Pragati", href: "#contact" },
];

const fields: { label: string; value: string; big?: boolean }[] = [
  { label: "Name", value: profile.name, big: true },
  { label: "Builds", value: `${profile.focus}` },
  { label: "Branch", value: `${profile.degree} · ${profile.years}` },
  { label: "College", value: `${profile.university} · CGPA ${profile.cgpa}` },
  { label: "Submitted to", value: "You, the examiner" },
];

export function Spread() {
  return (
    <section
      id="top"
      aria-label="Front page and index"
      className="mx-auto grid max-w-[1320px] scroll-mt-20 gap-8 px-4 pb-10 pt-6 sm:px-6 lg:grid-cols-[1fr_1.08fr] lg:gap-6 lg:pt-5"
    >
      <FrontPage />
      <IndexSheet />
    </section>
  );
}

function FrontPage() {
  return (
    <motion.article
      initial={{ y: 18, rotate: -1.6 }}
      animate={{ y: 0, rotate: -0.5 }}
      transition={{ duration: 0.9, ease: PLACE }}
      className={`${s.sheet} px-5 pb-7 pt-6 sm:px-9 sm:pb-9 sm:pt-8`}
    >
      <div className="pointer-events-none absolute inset-2.5 rounded-[2px] border border-[var(--line)] sm:inset-3.5" aria-hidden />
      <div className="pointer-events-none absolute inset-[13px] rounded-[2px] border-[2.5px] border-[var(--line)] sm:inset-[19px]" aria-hidden />

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className={`${s.printed} text-[clamp(2.5rem,5.4vw,5.4rem)] text-[var(--print)]`}>
              Practical
              <br />
              File
            </h1>
            <p className={`${s.label} mt-3 text-[0.8rem]`} style={{ color: "var(--print-soft)" }}>
              Backend systems &amp; applied AI
            </p>
          </div>

          <div className="relative mr-2 mt-3 shrink-0 sm:mr-4 sm:mt-4">
            <span className={`${s.tape} -left-5 -top-2 -rotate-[24deg]`} aria-hidden />
            <span className={`${s.tape} -bottom-2 -right-2 -rotate-[24deg] sm:-right-5`} aria-hidden />
            <Image
              src={profile.photo}
              alt={`Portrait of ${profile.name}`}
              width={140}
              height={168}
              priority
              className="h-[104px] w-[86px] rotate-[2deg] border-[1.5px] border-[var(--line)] object-cover object-[50%_30%] sm:h-[168px] sm:w-[140px]"
            />
          </div>
        </div>

        <dl className="mt-6 divide-y divide-[var(--rule)] border-y border-[var(--rule)]">
          {fields.map((f) => (
            <div key={f.label} className="grid grid-cols-[5.4rem_1fr] items-baseline gap-2.5 py-2 sm:grid-cols-[7.5rem_1fr] sm:gap-3">
              <dt className={s.label}>{f.label}</dt>
              <dd className={`${s.hand} ${f.big ? "whitespace-nowrap text-[clamp(1.3rem,6vw,2rem)] leading-tight" : "text-[1.12rem] leading-snug"}`}>
                {f.big ? <span className={s.writeOn}>{f.value}</span> : f.value}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-6 flex flex-wrap items-center gap-2.5">
          <motion.a
            href={links.mailto}
            className={s.redStamp}
            initial={{ scale: 1.25, rotate: -6 }}
            animate={{ scale: 1, rotate: -1.5 }}
            transition={{ delay: 1.2, type: "spring", stiffness: 520, damping: 22 }}
          >
            <Icon name="mail" size={18} strokeWidth={2} />
            Email Pragati
          </motion.a>
          <ContactIcons />
        </div>
      </div>
    </motion.article>
  );
}

export function ContactIcons({ compact = false }: { compact?: boolean }) {
  const items = [
    { href: links.linkedin, label: "LinkedIn", icon: "linkedin" as const, external: true },
    { href: links.github, label: "GitHub", icon: "github" as const, external: true },
    { href: links.resume, label: "Resume", icon: "resume" as const, external: true },
  ];
  return (
    <>
      {items.map((it) => (
        <a
          key={it.label}
          href={it.href}
          target="_blank"
          rel="noopener noreferrer"
          className={s.iconLink}
          aria-label={compact ? it.label : undefined}
        >
          <Icon name={it.icon} size={17} />
          {!compact && it.label}
        </a>
      ))}
    </>
  );
}

// One ruling for the whole Index: every band is one rule gap, and writing sits on the rule below it.
const ROW = "group h-[2.75rem] align-bottom";
const CELL_TEXT = "leading-[1.375rem]";

function IndexSheet() {
  const { checked, signed } = useFile();
  const complete = signed && records.every((r) => checked.has(r.no));
  return (
    <motion.article
      initial={{ y: 26, rotate: 1.4 }}
      animate={{ y: 0, rotate: 0.35 }}
      transition={{ duration: 0.95, delay: 0.12, ease: PLACE }}
      className={`${s.sheet} ${s.ruled} relative overflow-hidden pb-[5.5rem] pl-[4.25rem] pr-4 pt-0 [--margin-x:3.4rem] [--rule-gap:2.75rem] [--rule-offset:0rem] sm:pl-[5.25rem] sm:pr-8 sm:[--margin-x:4.25rem]`}
      aria-labelledby="index-title"
    >
      <span className={s.marginLine} aria-hidden />
      <div className="flex h-[5.5rem] items-end justify-between gap-3 pb-1">
        <h2 id="index-title" className={`${s.printed} text-[clamp(2.6rem,5vw,4rem)] leading-[0.8]`}>
          Index
        </h2>
        <p className={`${s.label} hidden sm:block`}>Press 1–9 to turn to a page</p>
      </div>

      <table className="w-full border-collapse text-left">
        <thead>
          <tr className={`${s.label} ${ROW}`}>
            <th scope="col" className="w-10 pb-1.5 font-semibold shadow-[inset_0_-2px_0_var(--line)]">No.</th>
            <th scope="col" className="pb-1.5 font-semibold shadow-[inset_0_-2px_0_var(--line)]">Experiment</th>
            <th scope="col" className="hidden w-36 pb-1.5 font-semibold shadow-[inset_0_-2px_0_var(--line)] sm:table-cell">Date</th>
            <th scope="col" className="w-14 pb-1.5 text-center font-semibold shadow-[inset_0_-2px_0_var(--line)]">Sign</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r) => (
            <tr key={r.id} className={ROW}>
              <td className={`${s.hand} ${CELL_TEXT} text-lg`}>{r.no}.</td>
              <td className={CELL_TEXT}>
                <a
                  href={`#${r.id}`}
                  className={`${s.hand} relative text-[1.18rem] sm:text-[1.28rem]`}
                >
                  <span className="bg-[linear-gradient(var(--highlight),var(--highlight))] bg-[length:0%_62%] bg-[position:0_78%] bg-no-repeat transition-[background-size] duration-300 ease-out group-hover:bg-[length:100%_62%] group-focus-within:bg-[length:100%_62%]">
                    {r.indexTitle}
                  </span>
                </a>
              </td>
              <td className={`${s.hand} ${CELL_TEXT} hidden text-[1.02rem] sm:table-cell`}>{r.date}</td>
              <td className="text-center leading-none">
                <span className="inline-flex justify-center">
                  <Tick show={checked.has(r.no)} label={`Record ${r.no} checked`} />
                </span>
              </td>
            </tr>
          ))}
          {EXTRA_ROWS.map((r) => (
            <tr key={r.href} className={ROW}>
              <td className={`${s.hand} ${CELL_TEXT} text-lg`}>{r.no}.</td>
              <td colSpan={3} className={CELL_TEXT}>
                <a href={r.href} className={`${s.hand} text-[1.18rem] sm:text-[1.28rem]`}>
                  <span className="bg-[linear-gradient(var(--highlight),var(--highlight))] bg-[length:0%_62%] bg-[position:0_78%] bg-no-repeat transition-[background-size] duration-300 ease-out group-hover:bg-[length:100%_62%] group-focus-within:bg-[length:100%_62%]">
                    {r.title}
                  </span>
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className={`${s.hand} text-[1.05rem] leading-[2.75rem]`} style={{ color: "var(--red-ink)" }}>
        {complete ? "Examiner: every record checked and signed." : "Examiner: read a record and it gets ticked here."}
      </p>

      <AnimatePresence>
        {complete && (
          <motion.a
            key="complete"
            href={links.mailto}
            initial={{ scale: 1.9, opacity: 0, rotate: -16 }}
            animate={{ scale: 1, opacity: 1, rotate: -6 }}
            transition={{ type: "spring", stiffness: 420, damping: 20, delay: 0.3 }}
            className={`${s.stamp} absolute bottom-[1.7rem] left-1/2 -ml-[8.5rem] w-[17rem] flex-col !gap-0.5 bg-[color-mix(in_srgb,var(--paper)_55%,transparent)] px-4 py-2 text-center text-[1.45rem] !leading-[0.95] hover:text-[var(--red)] sm:-ml-[10rem] sm:w-[20rem] sm:text-[1.7rem]`}
          >
            <span>Checked</span>
            <span className="text-[0.62em] tracking-[0.12em]">Call for interview</span>
          </motion.a>
        )}
      </AnimatePresence>
    </motion.article>
  );
}
