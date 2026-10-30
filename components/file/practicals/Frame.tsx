"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import { Icon } from "@/components/icons";
import { links } from "@/lib/content";
import { s } from "../styles";

export function PracticalFrame({
  title,
  note,
  children,
  id,
}: {
  title: string;
  note?: string;
  children: ReactNode;
  id: string;
}) {
  return (
    <section
      aria-labelledby={id}
      data-local-keys
      className="relative border-t-[2.5px] border-double border-[var(--line)] pt-6"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3 id={id} className={`${s.printed} text-[1.6rem] sm:text-[1.9rem]`}>
          {title}
        </h3>
        {note && <p className="text-[0.78rem] text-[var(--print-soft)]">{note}</p>}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function EndCard({
  remark,
  detail,
  cta,
  onReplay,
}: {
  remark: string;
  detail?: ReactNode;
  cta: string;
  onReplay: () => void;
}) {
  return (
    <motion.div
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-4"
      role="status"
    >
      <p className={`${s.hand} -rotate-1 text-[1.45rem] leading-snug`} style={{ color: "var(--red-ink)" }}>
        {remark}
      </p>
      {detail && <div className="max-w-[62ch] text-[0.98rem] leading-relaxed">{detail}</div>}
      <div className="flex flex-wrap items-center gap-2.5">
        <a href={links.mailto} className={s.redStamp}>
          <Icon name="mail" size={18} strokeWidth={2} />
          {cta}
        </a>
        <button type="button" onClick={onReplay} className={s.btn}>
          <Icon name="replay" size={16} />
          Play again
        </button>
      </div>
    </motion.div>
  );
}
