"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type RefObject } from "react";
import { Icon } from "@/components/icons";
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
import { createRng, type Rng } from "@/lib/games/rng";
import { GameEnd, freshSeed, useLoopActive } from "./shared";

type Flash = { port: number; kind: "bound" | "crash"; key: number };

export function PortHunt() {
  const root = useRef<HTMLDivElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const rng = useRef<Rng>(createRng(906));
  const live = useRef<PortHuntState | null>(null);
  const [state, setState] = useState<PortHuntState>(() => createPortHunt(createRng(906)));
  const [flash, setFlash] = useState<Flash | null>(null);
  const active = useLoopActive(root);
  const running = state.status === "running";

  function commit(next: PortHuntState) {
    live.current = next;
    setState(next);
  }

  function start() {
    rng.current = createRng(freshSeed());
    commit(startPortHunt(createPortHunt(rng.current)));
    setFlash(null);
    requestAnimationFrame(() => grid.current?.focus({ preventScroll: true }));
  }

  function bind(port: number) {
    const current = live.current ?? state;
    if (current.status !== "running") return;
    const { state: next, result } = bindPort(current, port, rng.current);
    commit(next);
    setFlash({ port, kind: result === "bound" ? "bound" : "crash", key: (flash?.key ?? 0) + 1 });
  }

  // Game clock: runs only while playing, on screen, and in a visible tab.
  useEffect(() => {
    if (!running || !active) return;
    let raf = 0;
    let last = -1;
    const frame = (t: number) => {
      const dt = last < 0 ? 0 : Math.min(t - last, 100);
      last = t;
      const current = live.current;
      if (current) {
        const next = tickPortHunt(current, dt, rng.current);
        live.current = next;
        setState(next);
        if (next.status !== "running") return;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [running, active]);

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (!running || e.metaKey || e.ctrlKey || e.altKey) return;
    if (!/^[0-9]$/.test(e.key)) return;
    const port = PORTS.find((p) => p % 10 === Number(e.key));
    if (port) {
      e.preventDefault();
      bind(port);
    }
  }

  const remaining = Math.max(0, TIME_LIMIT_MS - state.elapsedMs);
  const log = state.log.slice(-3);
  const ended = state.status === "won" || state.status === "lost";

  return (
    <div ref={root} onKeyDown={onKeyDown}>
      {ended ? (
        <EndState state={state} onReplay={start} containerRef={root} />
      ) : (
        <>
          <p className="max-w-[58ch] text-[0.9375rem]">
            Other processes keep grabbing ports <span className="std-mono">8888–8897</span>. Bind a free one{" "}
            {BOOTS_TO_WIN} times in {TIME_LIMIT_MS / 1000} seconds. Bind a busy one and the server crashes with{" "}
            <span className="std-mono">EADDRINUSE</span>; {CRASHES_TO_LOSE} crashes ends the run.
          </p>

          <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
            <dl className="flex gap-6">
              <div className="std-stat">
                <dt>Boots</dt>
                <dd className="std-num">
                  {state.boots} / {BOOTS_TO_WIN}
                </dd>
              </div>
              <div className="std-stat">
                <dt>Crashes</dt>
                <dd className="std-num">
                  {state.crashes} / {CRASHES_TO_LOSE}
                </dd>
              </div>
              <div className="std-stat">
                <dt>Time left</dt>
                <dd className="std-num">{(remaining / 1000).toFixed(1)} s</dd>
              </div>
            </dl>
            {running ? (
              <span className="std-meta" aria-live="polite">
                {active ? "Running" : "Paused while out of view"}
              </span>
            ) : (
              <button type="button" onClick={start} className="std-btn std-btn-primary std-btn-sm">
                <Icon name="play" size={14} />
                Start the server
              </button>
            )}
          </div>
          <div className="std-track mt-3" aria-hidden="true">
            <span style={{ transform: `scaleX(${remaining / TIME_LIMIT_MS})` }} />
          </div>

          <div
            ref={grid}
            tabIndex={-1}
            role="group"
            aria-label="Ports 8888 to 8897. Press a port's last digit to bind it."
            className="std-ports mt-5 rounded-[10px]"
          >
            {state.ports.map((p) => (
              <button
                key={p.port}
                type="button"
                disabled={!running}
                onClick={() => bind(p.port)}
                data-free={running && !p.busy}
                aria-label={`Port ${p.port}, ${p.busy ? `held by ${p.owner}` : "free"}`}
                className="std-port"
              >
                <span className="std-port-num std-mono">{p.port}</span>
                <span className="std-port-state">{running ? (p.busy ? p.owner : "free") : "idle"}</span>
                {flash && flash.port === p.port ? (
                  <span key={flash.key} className="std-flash" data-kind={flash.kind} aria-hidden="true" />
                ) : null}
              </button>
            ))}
          </div>

          <div className="mt-4 grid gap-3">
            <div role="log" aria-live="polite" aria-label="Server log" className="std-log std-mono">
              {log.length === 0 ? (
                <p>$ python -m pocketpaw</p>
              ) : (
                log.map((l, i) => (
                  <p key={`${l.at}-${i}`} data-kind={l.kind} className="truncate">
                    {l.text}
                  </p>
                ))
              )}
            </div>
            <p className="std-meta flex flex-wrap items-center gap-1.5">
              Keys: <kbd className="std-kbd std-mono">8</kbd> binds 8888, <kbd className="std-kbd std-mono">0</kbd> binds
              8890
            </p>
          </div>
        </>
      )}
    </div>
  );
}

function EndState({
  state,
  onReplay,
  containerRef,
}: {
  state: PortHuntState;
  onReplay: () => void;
  containerRef: RefObject<HTMLDivElement | null>;
}) {
  const fallback = autoFallback(state);
  const won = state.status === "won";
  const crashedOut = state.crashes >= CRASHES_TO_LOSE;
  const title = won
    ? `Server up. ${state.boots} boots, ${state.crashes} ${state.crashes === 1 ? "crash" : "crashes"}.`
    : crashedOut
      ? "EADDRINUSE, three times."
      : `Out of time at ${state.boots} of ${BOOTS_TO_WIN} boots.`;

  return (
    <GameEnd title={title} onReplay={onReplay} containerRef={containerRef}>
      <p>
        {won
          ? "You did by hand what Pragati's PR #906 does on every start: check before you bind."
          : "That startup crash is exactly what Pragati's PR #906 removed from pocketpaw."}{" "}
        The fix pre-checks each port in <span className="std-mono">8888–8897</span> with a socket and takes the first free
        one, catching <span className="std-mono">EADDRINUSE</span> and <span className="std-mono">WinError 10048</span>.
      </p>
      {fallback ? (
        <p className="std-callout mt-4">
          When this run ended, the fallback would have bound{" "}
          <span className="std-mono text-[color:var(--accent)]">127.0.0.1:{fallback}</span> on the first try.
        </p>
      ) : null}
      <p className="mt-4">If your team needs that kind of care at startup, email her.</p>
    </GameEnd>
  );
}
