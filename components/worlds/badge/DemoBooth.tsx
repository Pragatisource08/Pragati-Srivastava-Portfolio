"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Icon } from "@/components/icons";
import { links } from "@/lib/content";
import { createRng, type Rng } from "@/lib/games/rng";
import {
  BOOTS_TO_WIN,
  CRASHES_TO_LOSE,
  PORTS,
  TIME_LIMIT_MS,
  autoFallback,
  bindPort,
  createPortHunt,
  startPortHunt,
  tickPortHunt,
  type PortHuntState,
} from "@/lib/games/portHunt";

const SECONDS = TIME_LIMIT_MS / 1000;

// A booth table with a network switch on it. Judges arrive when the clock runs out;
// your demo server needs a free port in 8888–8897 three times before then.
export function DemoBooth() {
  const [game, setGame] = useState<PortHuntState | null>(null);
  const [announce, setAnnounce] = useState("");
  const [lastPort, setLastPort] = useState<{ port: number; ok: boolean } | null>(null);
  const rngRef = useRef<Rng | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLHeadingElement>(null);
  const status = game?.status ?? "idle";

  // Loop: only while running, on screen, and in a visible tab.
  useEffect(() => {
    if (status !== "running") return;
    let raf = 0;
    let last = performance.now();
    let onScreen = true;
    const loop = (now: number) => {
      const dt = Math.min(100, now - last);
      last = now;
      if (onScreen && !document.hidden) {
        setGame((g) => (g && rngRef.current ? tickPortHunt(g, dt, rngRef.current) : g));
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting;
    });
    if (rootRef.current) io.observe(rootRef.current);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [status]);

  useEffect(() => {
    if (status === "won" || status === "lost") endRef.current?.focus({ preventScroll: true });
  }, [status]);

  const start = useCallback(() => {
    const rng = createRng(Date.now());
    rngRef.current = rng;
    setLastPort(null);
    setGame(startPortHunt(createPortHunt(rng)));
    setAnnounce(`Clock started. ${SECONDS} seconds until the judges arrive.`);
  }, []);

  const bind = useCallback(
    (port: number) => {
      if (!game || game.status !== "running" || !rngRef.current) return;
      const { state, result } = bindPort(game, port, rngRef.current);
      setGame(state);
      setLastPort({ port, ok: result === "bound" });
      setAnnounce(
        result === "bound"
          ? `Bound ${port}. Boot ${state.boots} of ${BOOTS_TO_WIN}.`
          : `EADDRINUSE on ${port}. Crash ${state.crashes} of ${CRASHES_TO_LOSE}.`
      );
    },
    [game]
  );

  const letPrPick = () => {
    if (!game) return;
    const port = autoFallback(game);
    if (port !== null) bind(port);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (status !== "running") return;
    if (/^[0-9]$/.test(e.key)) {
      e.preventDefault();
      bind(PORTS[Number(e.key)]);
    }
  };

  const remaining = game ? Math.max(0, (TIME_LIMIT_MS - game.elapsedMs) / 1000) : SECONDS;
  const suggestion = game && game.status === "running" ? autoFallback(game) : null;
  const ports = game?.ports ?? PORTS.map((port) => ({ port, busy: false, owner: null, changedAt: 0 }));
  const ended = status === "won" || status === "lost";

  return (
    <div className="badge-booth" ref={rootRef} onKeyDown={onKeyDown} data-status={status}>
      <div className="badge-booth-brief">
        <p>
          The judges reach your table in {SECONDS} seconds. Your demo server needs a port in 8888&ndash;8897, and
          other processes keep grabbing them. Bind a free port {BOOTS_TO_WIN} times. {CRASHES_TO_LOSE} crashes and the
          booth goes dark.
        </p>
        <p className="badge-booth-source">
          From Pragati&rsquo;s merged{" "}
          <a href="https://github.com/pocketpaw/pocketpaw/pull/906" target="_blank" rel="noreferrer">
            PR #906
          </a>
          , which does this for real: socket pre-checks, then the first free port.
        </p>
      </div>

      <div className="badge-booth-table">
        <div className="badge-booth-meters" aria-hidden={status === "idle"}>
          <div className="badge-meter">
            <span className="badge-meter-label">Judges arrive in</span>
            <span className="badge-meter-value badge-num">{remaining.toFixed(1)} s</span>
            <span className="badge-meter-bar">
              <span style={{ transform: `scaleX(${remaining / SECONDS})` }} />
            </span>
          </div>
          <div className="badge-meter">
            <span className="badge-meter-label">Boots</span>
            <span className="badge-tally" aria-label={`${game?.boots ?? 0} of ${BOOTS_TO_WIN}`}>
              {Array.from({ length: BOOTS_TO_WIN }, (_, i) => (
                <span key={i} data-on={(game?.boots ?? 0) > i} data-kind="boot" />
              ))}
            </span>
          </div>
          <div className="badge-meter">
            <span className="badge-meter-label">Crashes</span>
            <span className="badge-tally" aria-label={`${game?.crashes ?? 0} of ${CRASHES_TO_LOSE}`}>
              {Array.from({ length: CRASHES_TO_LOSE }, (_, i) => (
                <span key={i} data-on={(game?.crashes ?? 0) > i} data-kind="crash" />
              ))}
            </span>
          </div>
        </div>

        <div className="badge-switch" role="group" aria-label="Ports 8888 to 8897 on the booth switch">
          {ports.map((p, i) => (
            <button
              key={p.port}
              type="button"
              className="badge-port"
              data-busy={status === "idle" ? undefined : p.busy}
              data-flash={lastPort?.port === p.port ? (lastPort.ok ? "ok" : "bad") : undefined}
              disabled={status !== "running"}
              onClick={() => bind(p.port)}
              aria-label={`Port ${p.port}, ${status === "idle" ? "not started" : p.busy ? `taken by ${p.owner}` : "free"}. Key ${i}.`}
            >
              <span className="badge-port-led" aria-hidden="true" />
              <span className="badge-port-jack" aria-hidden="true">
                {status !== "idle" && p.busy ? <span className="badge-port-plug" /> : null}
              </span>
              <span className="badge-port-num badge-num">{p.port}</span>
              <span className="badge-port-owner">{status !== "idle" && p.busy ? p.owner : status === "idle" ? "" : "free"}</span>
            </button>
          ))}
        </div>

        <div className="badge-booth-controls">
          {status === "idle" ? (
            <button type="button" className="badge-btn-primary" onClick={start}>
              <Icon name="play" size={16} />
              Open the booth
            </button>
          ) : null}
          {status === "running" ? (
            <>
              <button type="button" className="badge-btn-ghost" onClick={letPrPick}>
                Let PR #906 pick{suggestion !== null ? ` (${suggestion})` : ""}
              </button>
              <span className="badge-booth-keys">Keys 0&ndash;9 bind 8888&ndash;8897</span>
            </>
          ) : null}
        </div>

        <ol className="badge-log" aria-label="Server log">
          {(game?.log ?? [{ at: 0, kind: "info" as const, text: "$ python -m pocketpaw  (waiting for the booth to open)" }])
            .slice(-4)
            .map((line, i) => (
              <li key={`${line.at}-${i}`} data-kind={line.kind}>
                {line.text}
              </li>
            ))}
        </ol>

        {ended ? (
          <div className="badge-booth-end" data-result={status}>
            <h3 ref={endRef} tabIndex={-1}>
              {status === "won" ? "Demo running. The judges saw it." : "Booth down before the judges arrived."}
            </h3>
            <p>
              {status === "won"
                ? "You found free ports by hand. Pragati's PR #906 does it automatically on every start. Ask her how."
                : "Picking ports by hand under pressure is how servers crash. Pragati's PR #906 makes the fallback automatic."}
            </p>
            <div className="badge-end-actions">
              <a className="badge-btn-primary" href={links.mailto}>
                <Icon name="mail" size={18} />
                Email Pragati about the fix
              </a>
              <button type="button" className="badge-btn-ghost" onClick={start}>
                <Icon name="replay" size={16} />
                Play again
              </button>
            </div>
          </div>
        ) : null}
      </div>
      <p className="badge-sr" aria-live="polite">
        {status === "won"
          ? "Server is up three times. The judges saw the demo."
          : status === "lost"
            ? "The booth is down. Game over."
            : announce}
      </p>
    </div>
  );
}
