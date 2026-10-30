"use client";

import { useEffect, useRef, useState } from "react";
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
import { GameEnd } from "../Actions";
import { useLoopGate } from "./useLoopGate";

// "Boot the server" as a puzzle box: ten drawers, ports 8888–8897. Other processes
// take and empty drawers all the time. Slot the server into an empty one.
export function PortHuntGame() {
  const rootRef = useRef<HTMLDivElement>(null);
  const rngRef = useRef<Rng | null>(null);
  const [state, setState] = useState<PortHuntState | null>(null);
  const live = useLoopGate(rootRef);
  const running = state?.status === "running";

  useEffect(() => {
    if (!running || !live) return;
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(120, now - last);
      last = now;
      setState((s) => (s && rngRef.current ? tickPortHunt(s, dt, rngRef.current) : s));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [running, live]);

  const start = () => {
    const rng = createRng(Date.now());
    rngRef.current = rng;
    setState(startPortHunt(createPortHunt(rng)));
  };

  const bind = (port: number | null) => {
    if (port == null) return;
    setState((s) => (s && rngRef.current ? bindPort(s, port, rngRef.current).state : s));
  };

  const lastResult = state?.log.filter((l) => l.kind !== "info").at(-1);
  const secondsLeft = state ? Math.max(0, Math.ceil((TIME_LIMIT_MS - state.elapsedMs) / 1000)) : TIME_LIMIT_MS / 1000;
  const ended = state?.status === "won" || state?.status === "lost";

  return (
    <div
      ref={rootRef}
      className="shelf-game shelf-porthunt"
      onKeyDown={(e) => {
        if (!running || !/^[0-9]$/.test(e.key)) return;
        e.preventDefault();
        bind(PORTS[Number(e.key)]);
      }}
    >
      <p className="shelf-game-rules">
        Ten drawers, ports <span className="shelf-mono">8888–8897</span>. Other processes fill and empty them all the
        time. Put the server in an <strong>empty</strong> drawer {BOOTS_TO_WIN} times in{" "}
        {TIME_LIMIT_MS / 1000} seconds. A full drawer is an <span className="shelf-mono">EADDRINUSE</span> crash;{" "}
        {CRASHES_TO_LOSE} crashes and it is over. Keys <kbd>0</kbd>–<kbd>9</kbd> pick drawers.
      </p>

      {state && !ended ? (
        <p className="shelf-game-status shelf-num">
          <span>
            Boots <strong>{state.boots}</strong>/{BOOTS_TO_WIN}
          </span>
          <span>
            Crashes <strong>{state.crashes}</strong>/{CRASHES_TO_LOSE}
          </span>
          <span>
            <strong>{secondsLeft}</strong>s left
          </span>
        </p>
      ) : null}

      {!ended ? (
        <div className="shelf-drawers" role="group" aria-label="Ports 8888 to 8897">
          {(state?.ports ?? PORTS.map((port) => ({ port, busy: false, owner: null }))).map((p, i) => (
            <button
              key={p.port}
              type="button"
              className={`shelf-drawer${p.busy ? " is-held" : ""}`}
              disabled={!running}
              onClick={() => bind(p.port)}
              aria-label={`Port ${p.port}, ${!state ? "closed" : p.busy ? `held by ${p.owner}` : "empty"}. Key ${i}.`}
            >
              <span className="shelf-mono shelf-drawer-port">{p.port}</span>
              <span className="shelf-drawer-knob" aria-hidden="true" />
              <span className="shelf-drawer-tag">{!state ? "closed" : p.busy ? p.owner : "empty"}</span>
            </button>
          ))}
        </div>
      ) : null}

      <p className="shelf-mono shelf-game-log" aria-live="polite">
        {lastResult ? lastResult.text : ""}
      </p>

      {!state ? (
        <button type="button" className="shelf-btn shelf-btn-primary" onClick={start}>
          <Icon name="play" size={15} />
          <span>Start the server</span>
        </button>
      ) : null}

      {running ? (
        <button type="button" className="shelf-btn" onClick={() => bind(autoFallback(state))}>
          <Icon name="check" size={15} />
          <span>Let PR #906 pick: pre-check each port, take the first free one</span>
        </button>
      ) : null}

      {ended && state ? (
        <GameEnd
          headline={
            state.status === "won"
              ? `Listening. ${state.boots} boots in ${Math.round(state.elapsedMs / 1000)} seconds.`
              : state.crashes >= CRASHES_TO_LOSE
                ? `Three drawers were full. The server crashed ${state.crashes} times.`
                : `Time ran out at ${state.boots} of ${BOOTS_TO_WIN} boots.`
          }
          line="Pragati's merged PR #906 does this for pocketpaw on every start: a socket pre-check on each port in 8888–8897, then the first free one. No crash."
          ask="Write and ask her how it catches EADDRINUSE and WinError 10048."
          onReplay={start}
        />
      ) : null}
    </div>
  );
}
