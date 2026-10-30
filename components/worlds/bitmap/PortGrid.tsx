"use client";

import { useEffect, useRef, useState } from "react";
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
import { Icon } from "@/components/icons";
import { PixelText } from "./PixelText";
import { EmailButton } from "./Contact";
import { useVisibleLoop } from "./useVisibleLoop";

const SECONDS = TIME_LIMIT_MS / 1000;

function Pips({ n, of, label, kind }: { n: number; of: number; label: string; kind: "boot" | "crash" }) {
  return (
    <div className="bm-pips">
      <span className="bm-ctl-label">{label}</span>
      <span className={`bm-pips-row bm-pips-${kind}`} aria-hidden="true">
        {Array.from({ length: of }, (_, i) => (
          <span key={i} data-on={i < n} />
        ))}
      </span>
      <span className="num bm-pips-count">
        {n}/{of}
      </span>
    </div>
  );
}

export function PortGrid() {
  const rng = useRef<Rng>(createRng(906));
  const [game, setGame] = useState<PortHuntState>(() => createPortHunt(createRng(906)));
  const live = useRef(game);
  const [flash, setFlash] = useState<{ port: number; ok: boolean; n: number } | null>(null);
  const [assisted, setAssisted] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const result = useRef<HTMLHeadingElement>(null);
  const action = useRef<HTMLButtonElement>(null);

  const commit = (s: PortHuntState) => {
    live.current = s;
    setGame(s);
  };

  const running = game.status === "running";
  const ended = game.status === "won" || game.status === "lost";

  useVisibleLoop(panel, running, (dt) => commit(tickPortHunt(live.current, dt, rng.current)));

  useEffect(() => {
    if (ended) result.current?.focus({ preventScroll: true });
  }, [ended]);

  const start = () => {
    rng.current = createRng(Date.now());
    setAssisted(false);
    setFlash(null);
    commit(startPortHunt(createPortHunt(rng.current)));
    requestAnimationFrame(() => action.current?.focus());
  };

  const bind = (port: number) => {
    const { state, result: r } = bindPort(live.current, port, rng.current);
    commit(state);
    setFlash((f) => ({ port, ok: r === "bound", n: (f?.n ?? 0) + 1 }));
  };

  const fallback = () => {
    const port = autoFallback(live.current);
    if (port === null) return;
    setAssisted(true);
    bind(port);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (!running || e.altKey || e.ctrlKey || e.metaKey) return;
    if (/^[0-9]$/.test(e.key)) {
      const port = game.ports.find((p) => p.port % 10 === Number(e.key));
      if (port) {
        e.preventDefault();
        bind(port.port);
      }
    } else if (e.key === "f" || e.key === "F") {
      e.preventDefault();
      fallback();
    }
  };

  const remaining = Math.max(0, Math.ceil((TIME_LIMIT_MS - game.elapsedMs) / 1000));
  const lastLine = game.log[game.log.length - 1];
  const timedOut = game.status === "lost" && game.crashes < CRASHES_TO_LOSE;

  return (
    <div ref={panel} className="bm-game bm-ports" onKeyDown={onKey}>
      <div className="bm-game-head">
        <h3 className="bm-game-title">Boot the server</h3>
        <p className="bm-game-rules">
          PocketPaw needs one port in 8888–8897, and other processes grab and drop them every 0.65 s. Bind a free port{" "}
          {BOOTS_TO_WIN} times in {SECONDS} s. Bind a busy one and it crashes; {CRASHES_TO_LOSE} crashes ends the run.
          Keys: the port&rsquo;s last digit, or F for the fallback.
        </p>
      </div>

      <div className="bm-ports-status">
        <Pips n={game.boots} of={BOOTS_TO_WIN} label="Boots" kind="boot" />
        <Pips n={game.crashes} of={CRASHES_TO_LOSE} label="Crashes" kind="crash" />
        <div className="bm-timer">
          <span className="bm-ctl-label">Time</span>
          <span className="bm-timer-bar" aria-hidden="true">
            {Array.from({ length: SECONDS }, (_, i) => (
              <span key={i} data-on={i < remaining} />
            ))}
          </span>
          <span className="num bm-pips-count">{remaining}s</span>
        </div>
      </div>

      <ul className="bm-port-grid" aria-label="Ports 8888 to 8897">
        {game.ports.map((p) => {
          const f = flash && flash.port === p.port ? flash : null;
          return (
            <li key={p.port}>
              <button
                type="button"
                className="bm-port"
                data-busy={p.busy}
                data-flash={f ? (f.ok ? "ok" : "crash") : undefined}
                data-n={f ? f.n % 2 : undefined}
                disabled={!running}
                onClick={() => bind(p.port)}
                aria-label={`Port ${p.port}, ${p.busy ? `busy, held by ${p.owner}` : "free"}`}
              >
                <PixelText text={String(p.port)} size="bm-u-port" nowrap small />
                <span className="bm-port-owner">{p.busy ? p.owner : "free"}</span>
                <span className="bm-port-key num" aria-hidden="true">
                  {p.port % 10}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {ended ? (
        <div className="bm-end" data-outcome={game.status}>
          <h4 ref={result} tabIndex={-1} className="bm-end-title">
            <span className="sr-only">{game.status === "won" ? "Server booted." : "Server down."}</span>
            <PixelText text={game.status === "won" ? "BOOTED" : timedOut ? "TIMED OUT" : "EADDRINUSE"} size="bm-u-grade" gap={0.25} />
          </h4>
          <p className="bm-end-line" aria-live="polite">
            {game.status === "won"
              ? assisted
                ? "With the #906 fallback, every bind lands: it pre-checks each port with a socket and takes the first free one."
                : `${BOOTS_TO_WIN} clean binds by hand. PR #906 does this on every start, so nobody has to.`
              : timedOut
                ? `${game.boots} of ${BOOTS_TO_WIN} boots before the clock ran out. The fallback would not wait.`
                : "Three crashes on taken ports. That is the startup crash PR #906 removed, on Linux, macOS, and Windows."}
          </p>
          <div className="bm-end-actions">
            <EmailButton label={game.status === "won" ? "Email Pragati: bind a call" : "Email Pragati: ask how #906 works"} />
            <button type="button" className="bm-btn" onClick={start}>
              <Icon name="replay" size={18} />
              <span>Play again</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bm-ports-actions">
          {/* One button for both states, so keyboard focus stays in the game after Start. */}
          <button ref={action} type="button" className={`bm-btn${running ? "" : " bm-btn-primary"}`} onClick={running ? fallback : start}>
            <Icon name={running ? "check" : "play"} size={18} />
            <span>{running ? "Run the #906 fallback" : "Start the server"}</span>
          </button>
          <p className="bm-ports-msg" aria-live="polite">
            {running && lastLine ? lastLine.text : "Waiting for start."}
          </p>
        </div>
      )}

      <ol className="bm-log" aria-label="Server log">
        {game.log.slice(-4).map((l, i) => (
          <li key={`${l.at}-${i}`} data-kind={l.kind}>
            <span className="num">{(l.at / 1000).toFixed(1).padStart(4, "0")}</span> {l.text}
          </li>
        ))}
      </ol>
    </div>
  );
}
