"use client";

import { useRef, useState, type ReactNode } from "react";
import { motion, useInView } from "motion/react";
import { Icon } from "@/components/icons";
import { links, profile, recognition, skills } from "@/lib/content";
import { Staple } from "./Ink";
import { PunchHoles } from "./Record";
import { ContactIcons } from "./Spread";
import { s } from "./styles";

const EASE = [0.16, 1, 0.3, 1] as const;

function Attached({
  seen,
  delay,
  rotate,
  className,
  children,
}: {
  seen: boolean;
  delay: number;
  rotate: number;
  className: string;
  children: ReactNode;
}) {
  return (
    <motion.li
      initial={false}
      animate={seen ? { y: 0, rotate } : { y: 28, rotate: 0 }}
      transition={{ duration: 0.7, delay, ease: EASE }}
      className={`relative border-[1.5px] border-[var(--line)] ${className}`}
    >
      <Staple className="absolute left-1/2 top-1.5 -translate-x-1/2" />
      {children}
    </motion.li>
  );
}

export function Annexure() {
  const ref = useRef<HTMLElement | null>(null);
  const seen = useInView(ref, { once: true, margin: "-15% 0px" });
  const [nasa, sih, leet] = recognition;

  return (
    <section ref={ref} id="annexure" tabIndex={-1} aria-labelledby="annexure-title" className="scroll-mt-20">
    <article className={`${s.sheet} mx-auto w-full max-w-[1040px] pb-16 pl-12 pr-5 pt-8 sm:pl-16 sm:pr-10`}>
      <PunchHoles />
      <h2 id="annexure-title" className={`${s.printed} text-[clamp(2.1rem,4.6vw,3.6rem)]`}>
        Annexure
      </h2>
      <p className="mt-2 max-w-[60ch] text-[1.02rem] text-[var(--print-soft)]">The apparatus she works with. Certificates are attached below.</p>

      <h3 className={`${s.printed} mt-8 text-[1.9rem]`}>List of apparatus</h3>
      <table className="mt-3 w-full border-collapse text-left text-[0.98rem]">
        <tbody>
          {Object.entries(skills).map(([group, items]) => (
            <tr key={group} className="border-b border-[var(--rule)] align-top">
              <th scope="row" className={`${s.label} w-[9.5rem] py-3 pr-4 font-semibold sm:w-[11rem]`}>
                {group}
              </th>
              <td className="py-2.5">
                <ul className="flex flex-wrap gap-1.5">
                  {items.map((it) => (
                    <li key={it} className={s.chip}>
                      {it}
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
          <tr className="align-top">
            <th scope="row" className={`${s.label} py-3 pr-4 font-semibold`}>
              Education
            </th>
            <td className="py-3 leading-snug">
              {profile.degree}, {profile.university} · {profile.years} · CGPA {profile.cgpa}
            </td>
          </tr>
        </tbody>
      </table>
    </article>

    <ul aria-label="Certificates" className="relative z-10 mx-auto -mt-10 grid max-w-[1000px] items-start gap-5 px-3 sm:px-6 md:grid-cols-12">
      {/* NASA: a certificate on graph paper, the largest document */}
      <Attached seen={seen} delay={0.15} rotate={-1.4} className={`${s.graph} md:col-span-5 rounded-[3px] p-6 pt-8`}>
        <div className="pointer-events-none absolute inset-2 rounded-[2px] border-2 border-double border-[var(--line)]" aria-hidden />
        <h3 className={`${s.printed} text-[1.9rem] leading-[0.95]`}>{nasa.title}</h3>
        <p className="mt-3 max-w-[30ch] text-[1rem] leading-snug">{nasa.detail}</p>
        <p className={`${s.stamp} mt-5 -rotate-6 text-[1.1rem]`}>Global Nominee</p>
      </Attached>

      {/* SIH: a ruled team-lead slip */}
      <Attached seen={seen} delay={0.24} rotate={1.2} className={`${s.ruled} md:col-span-4 rounded-[2px] bg-[var(--paper)] p-5 pt-8 [--rule-gap:1.75rem]`}>
        <h3 className={`${s.printed} text-[1.55rem] leading-[0.95]`}>{sih.title}</h3>
        <p className={`${s.hand} mt-2 text-[1.2rem] leading-[1.75rem]`}>{sih.detail}</p>
        <p className={`${s.stamp} mt-3 rotate-3 text-[0.95rem]`}>
          Team Lead
        </p>
      </Attached>

      {/* LeetCode: a small torn chit */}
      <Attached seen={seen} delay={0.33} rotate={-2.6} className="max-w-[17rem] border-t-2 border-dashed bg-[#fffbe8] p-4 pt-7 md:col-span-3">
        <h3 className={`${s.printed} text-[1.25rem]`}>{leet.title}</h3>
        <p className={`${s.hand} mt-1 text-[1.1rem] leading-snug`}>{leet.detail}</p>
      </Attached>
    </ul>
    </section>
  );
}

export function BackCover() {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(links.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  }

  return (
    <footer id="contact" tabIndex={-1} className="mx-auto w-full max-w-[1040px] scroll-mt-20 px-4 pb-24 pt-6 sm:px-6">
      <div className="relative mx-auto max-w-[640px] rotate-[-0.6deg] rounded-[4px] border-[2.5px] border-[var(--line)] bg-[var(--paper)] p-6 sm:p-8">
        <div className="pointer-events-none absolute inset-1.5 rounded-[2px] border border-[var(--line)]" aria-hidden />
        <p className={s.label}>Submitted by</p>
        <p className={`${s.hand} text-[2rem] leading-tight`}>{profile.name}</p>
        <p className="mt-2 text-[1.02rem]">
          The file is complete. Your remarks go straight to her inbox.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-2.5">
          <a href={links.mailto} className={s.redStamp}>
            <Icon name="mail" size={18} strokeWidth={2} />
            Email Pragati
          </a>
          <ContactIcons />
        </div>
        <button type="button" onClick={copy} className="mt-4 inline-flex items-center gap-1.5 text-[0.9rem] text-[var(--print-soft)] hover:text-[var(--ink)]" aria-live="polite">
          <Icon name={copied ? "check" : "copy"} size={15} />
          {copied ? "Address copied" : "Copy email address"}
        </button>
      </div>
      <p className={`${s.label} mt-10 text-center`} style={{ color: "var(--kraft-ink)" }}>
        © 2026 {profile.name}
      </p>
    </footer>
  );
}
