"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Icon } from "@/components/icons";
import { links } from "@/lib/content";
import {
  autoFallback,
  bindPort,
  BOOTS_TO_WIN,
  createPortHunt,
  CRASHES_TO_LOSE,
  startPortHunt,
  tickPortHunt,
  TIME_LIMIT_MS,
  type PortHuntState,
} from "@/lib/games/portHunt";
import { createRng, type Rng } from "@/lib/games/rng";
import { useActive } from "./hooks";
import s from "./cls";

/** "Boot the server", from PR #906, set at a shared darkroom sink with ten slots. */
export function PortBench() {
  const root = useRef<HTMLDivElement>(null);
  const rng = useRef<Rng | null>(null);
  const active = useActive(root);
  const [game, setGame] = useState<PortHuntState | null>(null);
  const [checked, setChecked] = useState(false);
  const [flash, setFlash] = useState<{ port: number; ok: boolean } | null>(null);

  const running = game?.status === "running" && active;

  useEffect(() => {
    if (!running) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(100, now - last);
      last = now;
      setGame((g) => (g && rng.current ? tickPortHunt(g, dt, rng.current) : g));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running]);

  const start = () => {
    rng.current = createRng(Date.now());
    setGame(startPortHunt(createPortHunt(rng.current)));
    setChecked(false);
    setFlash(null);
  };

  const bind = (port: number) => {
    if (!game || game.status !== "running" || !rng.current) return;
    const r = bindPort(game, port, rng.current);
    setGame(r.state);
    setFlash({ port, ok: r.result === "bound" });
  };

  const precheck = () => {
    if (!game || checked) return;
    const port = autoFallback(game);
    setChecked(true);
    if (port !== null) bind(port);
  };

  const onKey = (e: KeyboardEvent) => {
    if (!game || game.status !== "running") return;
    if (/^[0-9]$/.test(e.key)) {
      const d = Number(e.key);
      const port = game.ports.find((p) => p.port % 10 === d);
      if (port) {
        e.preventDefault();
        bind(port.port);
      }
    }
  };

  const left = game ? Math.max(0, (TIME_LIMIT_MS - game.elapsedMs) / 1000) : TIME_LIMIT_MS / 1000;
  const status = game?.status ?? "idle";
  const last = game?.log.slice(-4) ?? [];

  return (
    <div ref={root} className={s.game} aria-labelledby="port-title" onKeyDown={onKey}>
      <div className={s.gameHead}>
        <h3 id="port-title" className={s.gameTitle}>
          Boot the server
        </h3>
        <p className={s.gameLede}>
          The club sink has ten slots, ports 8888 to 8897. Other people&rsquo;s prints come and go. Slide
          pocketpaw into a free slot three times in 30 seconds; a held slot spills with{" "}
          <code>EADDRINUSE</code>, and three spills end the session. PR #906 does this check for you, so
          you get one socket pre-check per run.
        </p>
      </div>

      <div className={s.portStatus}>
        <span>
          Booted <b className={s.num}>{game?.boots ?? 0}</b>/{BOOTS_TO_WIN}
        </span>
        <span>
          Spills <b className={s.num}>{game?.crashes ?? 0}</b>/{CRASHES_TO_LOSE}
        </span>
        <span>
          Time <b className={s.num}>{left.toFixed(1)} s</b>
        </span>
      </div>

      <ul className={s.sink} aria-label="Ports 8888 to 8897">
        {(game?.ports ?? []).map((p) => (
          <li key={p.port}>
            <button
              type="button"
              className={s.slot}
              data-busy={p.busy ? "true" : undefined}
              data-flash={flash?.port === p.port ? (flash.ok ? "ok" : "bad") : undefined}
              disabled={status !== "running"}
              onClick={() => bind(p.port)}
              aria-label={`Port ${p.port}, ${p.busy ? `held by ${p.owner}` : "free"}`}
            >
              <span className={s.slotPort}>{p.port}</span>
              <span className={s.slotOwner}>{p.busy ? p.owner : "free"}</span>
            </button>
          </li>
        ))}
        {!game &&
          Array.from({ length: 10 }, (_, i) => (
            <li key={i}>
              <span className={s.slot} data-idle="true">
                <span className={s.slotPort}>{8888 + i}</span>
                <span className={s.slotOwner}>?</span>
              </span>
            </li>
          ))}
      </ul>

      <div className={s.portControls}>
        {status === "idle" && (
          <button type="button" className={s.btnInk} onClick={start}>
            <Icon name="play" size={16} />
            Start the server
          </button>
        )}
        {status === "running" && (
          <>
            <button type="button" className={s.btnEnamel} onClick={precheck} disabled={checked}>
              {checked ? "Pre-check used" : "Socket pre-check (PR #906)"}
            </button>
            <span className={s.small}>Keys: the last digit of a port binds it.</span>
          </>
        )}
      </div>

      <ol className={s.log} aria-label="Server log">
        {last.map((l, i) => (
          <li key={`${l.at}-${i}`} data-kind={l.kind}>
            {l.text}
          </li>
        ))}
      </ol>

      <div aria-live="polite" className={s.stack}>
        {(status === "won" || status === "lost") && game && (
          <>
            <p className={s.verdict}>{status === "won" ? "Server up." : "Session spilled."}</p>
            <p>
              {status === "won"
                ? `Booted ${game.boots} times. Her merged fix makes every start this calm: check each socket, take the first free port.`
                : "That is the crash PR #906 removed: catch EADDRINUSE and WinError 10048, then fall back to the next free port."}
            </p>
            <div className={s.actions}>
              <a href={links.mailto} className={s.btnInk}>
                <Icon name="mail" size={18} />
                Email Pragati
              </a>
              <button type="button" className={s.btnEnamel} onClick={start}>
                <Icon name="replay" size={16} />
                Play again
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
