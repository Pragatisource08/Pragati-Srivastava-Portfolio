import { pick, type Rng } from "./rng";

// "Boot the server" — based on PR #906. Ports 8888–8897 are taken and released
// by other processes. Bind while a port is free; binding a busy port crashes.

export const PORTS = [8888, 8889, 8890, 8891, 8892, 8893, 8894, 8895, 8896, 8897] as const;
export const BOOTS_TO_WIN = 3;
export const CRASHES_TO_LOSE = 3;
export const TIME_LIMIT_MS = 30_000;

const OWNERS = ["jupyter", "vite", "docker", "uvicorn", "another pocketpaw", "ngrok", "streamlit"] as const;
const MIN_BUSY = 5;
const MIN_FREE = 1;

export type Port = { port: number; busy: boolean; owner: string | null; changedAt: number };

export type LogLine = { at: number; kind: "bound" | "crash" | "info"; text: string };

export type PortHuntStatus = "idle" | "running" | "won" | "lost";

export type PortHuntState = {
  ports: Port[];
  boots: number;
  crashes: number;
  elapsedMs: number;
  status: PortHuntStatus;
  log: LogLine[];
  sinceShuffleMs: number;
};

export function createPortHunt(rng: Rng): PortHuntState {
  const ports = PORTS.map((port) => ({ port, busy: false, owner: null, changedAt: 0 }));
  return reshuffle(
    { ports, boots: 0, crashes: 0, elapsedMs: 0, status: "idle", log: [], sinceShuffleMs: 0 },
    rng,
    true
  );
}

export function startPortHunt(state: PortHuntState): PortHuntState {
  return {
    ...state,
    status: "running",
    log: [{ at: 0, kind: "info", text: "$ python -m pocketpaw — needs a port in 8888–8897" }],
  };
}

// Advance the clock. Every ~650 ms, a few processes start or stop.
export function tickPortHunt(state: PortHuntState, dtMs: number, rng: Rng): PortHuntState {
  if (state.status !== "running") return state;
  const elapsedMs = state.elapsedMs + dtMs;
  if (elapsedMs >= TIME_LIMIT_MS) {
    return {
      ...state,
      elapsedMs: TIME_LIMIT_MS,
      status: state.boots >= BOOTS_TO_WIN ? "won" : "lost",
      log: [...state.log, { at: TIME_LIMIT_MS, kind: "info", text: "Timed out." }],
    };
  }
  let next: PortHuntState = { ...state, elapsedMs, sinceShuffleMs: state.sinceShuffleMs + dtMs };
  if (next.sinceShuffleMs >= 650) next = reshuffle({ ...next, sinceShuffleMs: 0 }, rng, false);
  return next;
}

function reshuffle(state: PortHuntState, rng: Rng, initial: boolean): PortHuntState {
  const ports = state.ports.map((p) => ({ ...p }));
  const flips = initial ? ports.length : 1 + Math.floor(rng() * 3);
  for (let i = 0; i < flips; i++) {
    const p = ports[Math.floor(rng() * ports.length)];
    const busy = initial ? rng() < 0.7 : !p.busy;
    p.busy = busy;
    p.owner = busy ? pick(rng, OWNERS) : null;
    p.changedAt = state.elapsedMs;
  }
  let busyCount = ports.filter((p) => p.busy).length;
  while (busyCount < MIN_BUSY) {
    const p = ports.find((x) => !x.busy)!;
    Object.assign(p, { busy: true, owner: pick(rng, OWNERS), changedAt: state.elapsedMs });
    busyCount++;
  }
  while (ports.length - busyCount < MIN_FREE) {
    const p = ports.find((x) => x.busy)!;
    Object.assign(p, { busy: false, owner: null, changedAt: state.elapsedMs });
    busyCount--;
  }
  return { ...state, ports };
}

export type BindResult = "bound" | "EADDRINUSE";

export function bindPort(
  state: PortHuntState,
  port: number,
  rng: Rng
): { state: PortHuntState; result: BindResult } {
  if (state.status !== "running") return { state, result: "EADDRINUSE" };
  const target = state.ports.find((p) => p.port === port);
  if (!target) return { state, result: "EADDRINUSE" };

  if (target.busy) {
    const crashes = state.crashes + 1;
    const line: LogLine = {
      at: state.elapsedMs,
      kind: "crash",
      text: `OSError: [Errno 98] EADDRINUSE — ${port} is held by ${target.owner}`,
    };
    return {
      result: "EADDRINUSE",
      state: {
        ...state,
        crashes,
        status: crashes >= CRASHES_TO_LOSE ? "lost" : state.status,
        log: [...state.log, line],
      },
    };
  }

  const boots = state.boots + 1;
  const line: LogLine = { at: state.elapsedMs, kind: "bound", text: `Listening on 127.0.0.1:${port}` };
  const won = boots >= BOOTS_TO_WIN;
  const next: PortHuntState = {
    ...state,
    boots,
    status: won ? "won" : state.status,
    log: [...state.log, line],
  };
  return { result: "bound", state: won ? next : reshuffle(next, rng, false) };
}

// What PR #906 does: pre-check each port with a socket, take the first free one.
export function autoFallback(state: PortHuntState): number | null {
  return state.ports.find((p) => !p.busy)?.port ?? null;
}
