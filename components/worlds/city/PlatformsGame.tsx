"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
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
import { Icon } from "@/components/icons";
import { EndCall, useActive, useFrame } from "./shared";
import { s } from "./cls";

type Flash = { port: number; kind: "bound" | "EADDRINUSE"; n: number };

export function PlatformsGame() {
  const boxRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLHeadingElement>(null);
  const rng = useRef<Rng>(createRng(906));
  const [game, setGame] = useState<PortHuntState>(() => createPortHunt(createRng(906)));
  const [flash, setFlash] = useState<Flash | null>(null);
  const [usedAuto, setUsedAuto] = useState(false);
  const onScreen = useActive(boxRef, "0px");
  const running = game.status === "running";
  const acc = useRef(0);

  useFrame(running && onScreen, (dt) => {
    acc.current += dt;
    if (acc.current < 90) return;
    const step = acc.current;
    acc.current = 0;
    setGame((g) => tickPortHunt(g, step, rng.current));
  });

  const ended = game.status === "won" || game.status === "lost";
  useEffect(() => {
    if (ended) endRef.current?.focus();
  }, [ended]);

  const start = () => {
    rng.current = createRng(Date.now());
    acc.current = 0;
    setFlash(null);
    setUsedAuto(false);
    setGame(startPortHunt(createPortHunt(rng.current)));
  };

  const dock = (port: number) => {
    if (game.status !== "running") return;
    const { state, result } = bindPort(game, port, rng.current);
    setGame(state);
    setFlash((f) => ({ port, kind: result, n: (f?.n ?? 0) + 1 }));
  };

  const auto = () => {
    const port = autoFallback(game);
    setUsedAuto(true);
    if (port !== null) dock(port);
  };

  const onKey = (e: KeyboardEvent) => {
    if (!running || e.altKey || e.ctrlKey || e.metaKey) return;
    if (/^[0-9]$/.test(e.key)) {
      e.preventDefault();
      dock(PORTS[Number(e.key)]);
    }
  };

  const left = Math.max(0, (TIME_LIMIT_MS - game.elapsedMs) / 1000);
  const lastLine = game.log[game.log.length - 1];
  const freeNow = autoFallback(game);

  return (
    <div className={s.game} ref={boxRef} onKeyDown={onKey} aria-labelledby="platforms-h">
      <div className={s.gameHead}>
        <h3 id="platforms-h" className={s.h4}>
          Dock your train on a free platform
        </h3>
        <p>
          Other trains (jupyter, vite, docker, uvicorn…) take and leave platforms 8888–8897 all the time. Dock{" "}
          {BOOTS_TO_WIN} times in {TIME_LIMIT_MS / 1000} seconds. Pull into an occupied platform {CRASHES_TO_LOSE}{" "}
          times and the line closes. Keys <kbd>0</kbd>–<kbd>9</kbd> pick a platform.
        </p>
      </div>

      <dl className={s.gameStats}>
        <div>
          <dt>Docked</dt>
          <dd className={s.num}>
            {game.boots}/{BOOTS_TO_WIN}
          </dd>
        </div>
        <div>
          <dt>Collisions</dt>
          <dd className={s.num}>
            {game.crashes}/{CRASHES_TO_LOSE}
          </dd>
        </div>
        <div>
          <dt>Time left</dt>
          <dd className={s.num}>{left.toFixed(1)} s</dd>
        </div>
      </dl>

      {!ended && (
        <>
          <ul className={s.platforms} aria-label="Platforms">
            {game.ports.map((p, i) => {
              const f = flash && flash.port === p.port ? flash : null;
              return (
                <li key={p.port}>
                  <button
                    type="button"
                    className={s.platform}
                    data-busy={p.busy ? "" : undefined}
                    data-flash={f ? f.kind : undefined}
                    key={f ? `${p.port}-${f.n}` : p.port}
                    disabled={!running}
                    onClick={() => dock(p.port)}
                    aria-label={`Platform ${p.port}, key ${i}, ${p.busy ? `held by ${p.owner}` : "free"}`}
                  >
                    <span className={s.pNum}>{p.port}</span>
                    <span className={s.rail} aria-hidden="true">
                      {p.busy ? (
                        <span className={s.otherTrain} />
                      ) : (
                        <span className={s.freeEdge} />
                      )}
                      {f && f.kind === "bound" && <span className={s.yourTrain} />}
                    </span>
                    <span className={s.pState} aria-hidden="true">
                      {f && f.kind === "EADDRINUSE" ? "EADDRINUSE" : f && f.kind === "bound" ? "docked" : p.busy ? p.owner : "free"}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className={s.gameActions}>
            {!running ? (
              <button type="button" className={s.btnAmber} onClick={start}>
                <Icon name="play" size={16} />
                Start the timetable
              </button>
            ) : (
              <button type="button" className={s.btnGhost} onClick={auto}>
                <Icon name="arrowRight" size={18} />
                Let PR #906 choose
              </button>
            )}
            <p className={s.gameNote}>
              {running && usedAuto
                ? `PR #906 checks each platform with a socket first and takes the first free one${freeNow ? `: ${freeNow} right now` : ""}.`
                : (
                    <>
                      PR #906 does this for pocketpaw at start-up: socket pre-checks across{" "}
                      <span className={s.nowrap}>8888–8897</span>.
                    </>
                  )}
            </p>
          </div>
        </>
      )}

      <ol className={s.log} aria-label="Signal log">
        {game.log.slice(-3).map((l, k) => (
          <li key={`${l.at}-${k}`} data-kind={l.kind}>
            {l.text}
          </li>
        ))}
      </ol>
      <p className={s.srOnly} aria-live="polite">
        {lastLine ? lastLine.text : ""}
      </p>

      {ended && (
        <div className={s.gameEnd}>
          <h4 ref={endRef} tabIndex={-1} className={s.endHead}>
            {game.status === "won"
              ? `All ${BOOTS_TO_WIN} trains docked.`
              : game.crashes >= CRASHES_TO_LOSE
                ? "Line closed: three trains hit occupied platforms."
                : `The timetable ran out at ${game.boots} of ${BOOTS_TO_WIN}.`}
          </h4>
          <EndCall
            line={
              game.status === "won"
                ? `${game.crashes} collisions on the way. PR #906 makes this automatic, so pocketpaw never crashes on a taken port. Ask her how she found it.`
                : "PR #906 would have checked each platform with a socket and taken the first free one. Ask her how she built it."
            }
            onAgain={start}
          />
        </div>
      )}
    </div>
  );
}
