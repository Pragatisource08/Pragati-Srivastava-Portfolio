"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icons";
import {
  autoFallback,
  bindPort,
  BOOTS_TO_WIN,
  CRASHES_TO_LOSE,
  createPortHunt,
  PORTS,
  startPortHunt,
  tickPortHunt,
  TIME_LIMIT_MS,
  type PortHuntState,
} from "@/lib/games/portHunt";
import { createRng, type Rng } from "@/lib/games/rng";
import { GameEnd } from "./Contact";
import styles from "./styles";

// Ten lily pads float on the port pond: 8888 to 8897. Some are sat on by other
// processes. Your drop (the server) must land on a dry, empty pad.

export function PortPond() {
  const [state, setState] = useState<PortHuntState>(() => createPortHunt(createRng(906)));
  const [splash, setSplash] = useState<{ port: number; ok: boolean; n: number } | null>(null);
  const rngRef = useRef<Rng>(createRng(906));
  const box = useRef<HTMLDivElement>(null);
  const stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const running = state.status === "running";

  // Clock: runs only while the game is live, visible, and the tab is shown.
  useEffect(() => {
    if (!running) return;
    const el = box.current;
    let visible = true;
    let raf = 0;
    let last = 0;
    const loop = (t: number) => {
      raf = 0;
      if (!visible || document.hidden) {
        last = 0;
        return;
      }
      const dt = last ? Math.min(100, t - last) : 16;
      last = t;
      setState((s) => tickPortHunt(s, dt, rngRef.current));
      raf = requestAnimationFrame(loop);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) kick();
    });
    if (el) io.observe(el);
    const onVis = () => !document.hidden && kick();
    document.addEventListener("visibilitychange", onVis);
    kick();
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [running]);

  const start = () => {
    rngRef.current = createRng(Date.now());
    setSplash(null);
    setState(startPortHunt(createPortHunt(rngRef.current)));
  };

  const bind = (port: number) => {
    const s = stateRef.current;
    if (s.status !== "running") return;
    const { state: next, result } = bindPort(s, port, rngRef.current);
    stateRef.current = next;
    setState(next);
    setSplash((p) => ({ port, ok: result === "bound", n: (p?.n ?? 0) + 1 }));
  };

  const fallback = () => {
    const p = autoFallback(stateRef.current);
    if (p != null) bind(p);
  };

  // Number keys 0 to 9 land on 8888 to 8897 while the pond has focus.
  const onKey = (e: React.KeyboardEvent) => {
    if (!running) return;
    if (/^[0-9]$/.test(e.key)) {
      e.preventDefault();
      bind(PORTS[Number(e.key)]);
    } else if (e.key.toLowerCase() === "f") {
      e.preventDefault();
      fallback();
    }
  };

  const remaining = Math.max(0, TIME_LIMIT_MS - state.elapsedMs);
  const ended = state.status === "won" || state.status === "lost";
  const lastLines = state.log.slice(-4);

  return (
    <div ref={box} onKeyDown={onKey} className="rounded-[26px] border border-[var(--g-mist)] bg-[var(--g-ground-deep)] p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className={`${styles.display} text-2xl font-semibold`}>Find a dry lily pad</h3>
        <p className={`${styles.num} text-sm text-[var(--g-ink-faint)]`}>
          {running || ended ? `${(remaining / 1000).toFixed(1)} s left` : "30 s"} · landed {state.boots}/{BOOTS_TO_WIN} · splashed {state.crashes}/{CRASHES_TO_LOSE}
        </p>
      </div>
      <p className="mt-1 max-w-[62ch] text-[var(--g-ink-soft)]">
        Your server is a drop that needs one free pad between 8888 and 8897. Other processes hop on and off the pads. Land on a taken pad and it splashes: <span className={styles.mono}>EADDRINUSE</span>. Land {BOOTS_TO_WIN} times before {CRASHES_TO_LOSE} splashes or the clock runs out. Keys 0 to 9 pick a pad, F lets PR #906 pick.
      </p>

      <div className="relative mt-5 overflow-hidden rounded-[999px/70%] bg-[radial-gradient(ellipse_at_50%_40%,#4f86b4_0%,#2f5677_70%,#264760_100%)] px-4 py-7 sm:px-10 sm:py-9">
        <ul className="relative grid grid-cols-5 gap-x-2 gap-y-4 sm:gap-x-4" aria-label="Ports 8888 to 8897">
          {state.ports.map((p, i) => {
            const hit = splash && splash.port === p.port;
            return (
              <li key={p.port} className={i % 2 ? "translate-y-2" : ""}>
                <button
                  type="button"
                  disabled={!running}
                  onClick={() => bind(p.port)}
                  aria-label={`Port ${p.port}, ${p.busy ? `taken by ${p.owner}` : "free"}`}
                  className={`${styles.pad} relative flex aspect-[5/4] w-full flex-col items-center justify-center rounded-[50%_50%_46%_54%] border text-center disabled:cursor-default ${
                    p.busy
                      ? "border-[#7b8f83] bg-[#3f5a49] text-[var(--g-ink-soft)]"
                      : "border-[#b4cf9f] bg-[#6f9a63] text-[#0f1a10] enabled:hover:bg-[#82ad74]"
                  } ${hit ? (splash.ok ? "ring-2 ring-[var(--g-clear)]" : "ring-2 ring-[var(--g-red)]") : ""}`}
                >
                  <span className={`${styles.mono} text-[11px] font-semibold sm:text-sm`}>{p.port}</span>
                  <span className="mt-0.5 max-w-full truncate px-1 text-[10px] leading-tight sm:text-xs">
                    {running || ended ? (p.busy ? p.owner : "free") : ""}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {!running && !ended && (
          <button
            type="button"
            onClick={start}
            className={`${styles.press} inline-flex items-center gap-2 rounded-full bg-[var(--g-clear)] px-5 py-3 font-semibold text-[var(--g-black)] hover:bg-white`}
          >
            <Icon name="play" size={16} />
            Start the server
          </button>
        )}
        {running && (
          <button
            type="button"
            onClick={fallback}
            className={`${styles.press} inline-flex items-center gap-2 rounded-full border border-[var(--g-blue)] px-4 py-2.5 font-semibold text-[var(--g-blue)] hover:bg-[var(--g-blue)]/10`}
          >
            <Icon name="check" size={16} />
            Let PR #906 choose
          </button>
        )}
      </div>

      <ol aria-live="polite" className={`${styles.mono} mt-4 min-h-[5.5rem] rounded-2xl bg-black/25 p-3 text-[12px] leading-relaxed sm:text-[13px]`}>
        {lastLines.length === 0 ? (
          <li className="text-[var(--g-ink-faint)]">$ python -m pocketpaw (waiting for you to start)</li>
        ) : (
          lastLines.map((l, i) => (
            <li
              key={`${l.at}-${i}-${l.text}`}
              className={l.kind === "crash" ? "text-[var(--g-red)]" : l.kind === "bound" ? "text-[var(--g-seed)]" : "text-[var(--g-ink-soft)]"}
            >
              {l.text}
            </li>
          ))
        )}
      </ol>

      {ended && (
        <div className="mt-5 border-t border-[var(--g-mist)] pt-5">
          <GameEnd
            title={state.status === "won" ? `Server up, ${state.boots} clean landings.` : "The pond threw you off."}
            line={
              state.status === "won"
                ? "Pragati's merged PR #906 does this for pocketpaw on every start: a socket pre-check on each port, then the first free one. Ask her about it."
                : "That crash is what PR #906 removed: it pre-checks each port with a socket and catches EADDRINUSE and WinError 10048. Ask her how."
            }
            cta="Email Pragati about PR #906"
            onAgain={start}
          />
        </div>
      )}
    </div>
  );
}
