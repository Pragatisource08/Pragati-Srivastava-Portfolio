"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { Icon } from "@/components/icons";
import {
  BOOTS_TO_WIN,
  CRASHES_TO_LOSE,
  TIME_LIMIT_MS,
  autoFallback,
  bindPort,
  createPortHunt,
  startPortHunt,
  tickPortHunt,
  type PortHuntState,
} from "@/lib/games/portHunt";
import { createRng, type Rng } from "@/lib/games/rng";
import { Cross, Tick } from "../Ink";
import { EndCard, PracticalFrame } from "./Frame";
import { s } from "../styles";

export function PortsPractical() {
  const [game, setGame] = useState<PortHuntState | null>(null);
  const [flash, setFlash] = useState<{ port: number; ok: boolean } | null>(null);
  const rng = useRef<Rng | null>(null);
  const box = useRef<HTMLDivElement>(null);
  const visible = useInView(box, { amount: 0.3 });

  function start() {
    rng.current = createRng(Date.now());
    setGame(startPortHunt(createPortHunt(rng.current)));
    setFlash(null);
  }

  function bind(port: number) {
    if (!game || !rng.current || game.status !== "running") return;
    const { state, result } = bindPort(game, port, rng.current);
    setGame(state);
    setFlash({ port, ok: result === "bound" });
  }

  const running = game?.status === "running";

  useEffect(() => {
    if (!running || !visible) return;
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(100, now - last);
      last = now;
      if (!document.hidden && rng.current) setGame((g) => (g ? tickPortHunt(g, dt, rng.current!) : g));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [running, visible]);

  useEffect(() => {
    if (!running) return;
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (!el.closest?.("#ports-game") || e.metaKey || e.ctrlKey || e.altKey) return;
      if (/^[0-9]$/.test(e.key) && game) {
        const p = game.ports.find((x) => String(x.port).endsWith(e.key));
        if (p) {
          e.preventDefault();
          bind(p.port);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const timeLeft = game ? Math.max(0, TIME_LIMIT_MS - game.elapsedMs) : TIME_LIMIT_MS;
  const fallback = game ? autoFallback(game) : null;

  return (
    <PracticalFrame id="ports-title" title="Perform it: boot the server" note="Ports and owners are simulated.">
      <div id="ports-game" ref={box}>
        {!game ? (
          <div className="space-y-3">
            <p className="max-w-[62ch] text-[0.98rem] leading-relaxed">
              pocketpaw needs one port in 8888–8897, and other apps keep grabbing them. Click a free port (or press its last
              digit) to bind it. Boot {BOOTS_TO_WIN} times before {CRASHES_TO_LOSE} crashes or {TIME_LIMIT_MS / 1000} seconds.
            </p>
            <button type="button" onClick={start} className={`${s.btn} ${s.btnInk}`}>
              <Icon name="play" size={15} />
              Start the server
            </button>
          </div>
        ) : game.status === "won" || game.status === "lost" ? (
          <EndCard
            remark={game.status === "won" ? `Booted ${game.boots} times. Clean hands.` : `Crashed ${game.crashes} times. EADDRINUSE wins.`}
            detail={
              <>
                PR #906 does this every startup: it pre-checks each port with a socket and takes the first free one
                {fallback ? (
                  <>
                    {" "}
                    — right now that is <span className={s.code}>{fallback}</span>
                  </>
                ) : null}
                . No guessing, no crash.
              </>
            }
            cta="Email Pragati, she fixed it for real"
            onReplay={start}
          />
        ) : (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.92rem]">
              <p className="flex items-center gap-1" aria-label={`${game.boots} of ${BOOTS_TO_WIN} boots`}>
                <span className={s.label}>Boots</span>
                {Array.from({ length: BOOTS_TO_WIN }, (_, i) => (
                  <span key={i} className="grid h-7 w-7 place-items-center rounded-[3px] border border-dashed border-[var(--print-soft)]">
                    <Tick show={i < game.boots} size={22} />
                  </span>
                ))}
              </p>
              <p className="flex items-center gap-1" aria-label={`${game.crashes} of ${CRASHES_TO_LOSE} crashes`}>
                <span className={s.label}>Crashes</span>
                {Array.from({ length: CRASHES_TO_LOSE }, (_, i) => (
                  <span key={i} className="grid h-7 w-7 place-items-center rounded-[3px] border border-dashed border-[var(--print-soft)]">
                    <Cross show={i < game.crashes} size={20} />
                  </span>
                ))}
              </p>
              <p className="tabular-nums">
                <span className={s.label}>Time</span> {(timeLeft / 1000).toFixed(1)}s
              </p>
            </div>

            <div className="h-1.5 w-full border border-[var(--line)] bg-white" aria-hidden>
              <div className="h-full bg-[var(--margin)]" style={{ width: `${(timeLeft / TIME_LIMIT_MS) * 100}%` }} />
            </div>

            <ul className="grid grid-cols-5 gap-2 lg:grid-cols-10">
              {game.ports.map((p) => {
                const flashed = flash?.port === p.port;
                return (
                  <li key={p.port}>
                    <motion.button
                      type="button"
                      onClick={() => bind(p.port)}
                      aria-label={`Port ${p.port}, ${p.busy ? `held by ${p.owner}` : "free"}`}
                      animate={flashed ? { x: flash.ok ? 0 : [0, -4, 4, -2, 0] } : { x: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`relative flex h-[4.5rem] w-full flex-col items-center justify-center rounded-[3px] border-[1.5px] px-1 transition-colors ${
                        p.busy
                          ? "border-[var(--line)] bg-[#efe9f7] text-[var(--violet)]"
                          : "border-[var(--ink)] bg-white text-[var(--ink)] hover:bg-[#eef3fc]"
                      }`}
                    >
                      <span className={`${s.code} text-[0.95rem] font-semibold`}>{p.port}</span>
                      <span className="mt-0.5 max-w-full truncate text-[0.72rem]">{p.busy ? p.owner : "free"}</span>
                      {p.busy && (
                        <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
                          <path d="M8 88 L92 12" stroke="var(--margin)" strokeOpacity="0.55" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                        </svg>
                      )}
                    </motion.button>
                  </li>
                );
              })}
            </ul>

            <div className="border-y-[1.5px] border-dashed border-[var(--line)] bg-white py-2">
              <p className={`${s.label} px-3`}>Printout</p>
              <ol className={`${s.code} min-h-[5.25rem] px-3 text-[0.82rem] leading-relaxed text-[var(--print)]`} aria-live="polite">
                {game.log.slice(-4).map((l, i) => (
                  <li
                    key={`${l.at}-${i}`}
                    className={l.kind === "crash" ? "text-[var(--red)]" : l.kind === "bound" ? "text-[var(--ink)]" : ""}
                  >
                    {l.text}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}
      </div>
    </PracticalFrame>
  );
}
