"use client";

import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { links, openSource } from "./content";
import { createRng, type Rng } from "@/lib/games/rng";
import {
  autoFallback,
  bindPort,
  BOOTS_TO_WIN,
  CRASHES_TO_LOSE,
  createPortHunt,
  startPortHunt,
  tickPortHunt,
  TIME_LIMIT_MS,
  type PortHuntState,
} from "@/lib/games/portHunt";
import {
  correctCount,
  createCredibility,
  currentReport,
  DISCLAIMER,
  ILLUSTRATIVE_WEIGHTS,
  ROUNDS,
  SIGNALS,
  stamp,
  type CredibilityState,
  type Verdict,
} from "@/lib/games/credibility";
import { grade, VIVA } from "@/lib/games/viva";
import { useBoard } from "./board";
import { Box, Key, Meter, Rule } from "./grid";

function Gap() {
  return <div className="bbs-gap" aria-hidden />;
}

function DoorExits() {
  const { go, full, toggleFull } = useBoard();
  return (
    <nav aria-label="Exits">
      <Gap />
      <Rule label="Exits" color={8} labelColor={7} />
      <div className="bbs-keys">
        <Key k="Escape" label="Back to doors" onClick={() => go("doors")} />
        <Key k="7" label="Leave mail for Pragati" onClick={() => go("mail")} />
        <Key k="Q" label={full ? "Full text: ON" : "Full text: OFF"} pressed={full} onClick={toggleFull} />
      </div>
    </nav>
  );
}

// When a door closes, move focus to its mail exit so keyboard players land on the call to action.
function useEndFocus(ref: RefObject<HTMLElement | null>, ended: boolean) {
  useEffect(() => {
    if (!ended) return;
    const cta = ref.current?.querySelector<HTMLElement>('[data-key="M"]');
    cta?.focus({ preventScroll: true });
    cta?.scrollIntoView({ block: "center" });
  }, [ended, ref]);
}

function DoorEnd({ won, title, children, onReplay }: { won: boolean; title: string; children?: ReactNode; onReplay: () => void }) {
  return (
    <div>
      <Gap />
      <Rule label={won ? "Door closed: you won" : "Door closed"} color={won ? 10 : 12} labelColor={15} />
      <h3 className={won ? "bbs-c10" : "bbs-c12"}>{title}</h3>
      {children}
      <Gap />
      <p className="bbs-c15">Tell the sysop how you did. Mail goes straight to Pragati.</p>
      <div className="bbs-keys">
        <Key k="M" href={links.mailto} icon="mail" tone="primary" label="Leave mail for Pragati" />
        <Key k="R" icon="replay" label="Play again" onClick={onReplay} />
      </div>
    </div>
  );
}

const pad = (s: string | number, n: number) => String(s).padEnd(n, " ");

/* ------------------------------------------------------------- PORTHUNT -- */

export function PortHuntDoor() {
  const { headingRef, post } = useBoard();
  const rng = useRef<Rng>(createRng(906));
  const [st, setSt] = useState<PortHuntState>(() => createPortHunt(createRng(906)));
  const [flash, setFlash] = useState<{ port: number; ok: boolean; n: number } | null>(null);
  const [autoNote, setAutoNote] = useState("");
  const boxRef = useRef<HTMLDivElement>(null);
  const ended = st.status === "won" || st.status === "lost";

  const start = () => {
    rng.current = createRng(Date.now());
    setSt(startPortHunt(createPortHunt(rng.current)));
    setFlash(null);
    setAutoNote("");
  };

  // Game clock: 10 ticks a second, paused while the tab is hidden or the door is scrolled away.
  useEffect(() => {
    if (st.status !== "running") return;
    let last = performance.now();
    let visible = true;
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    });
    if (boxRef.current) io.observe(boxRef.current);
    const id = window.setInterval(() => {
      const now = performance.now();
      const dt = Math.min(250, now - last);
      last = now;
      if (document.hidden || !visible) return;
      setSt((s) => tickPortHunt(s, dt, rng.current));
    }, 100);
    return () => {
      window.clearInterval(id);
      io.disconnect();
    };
  }, [st.status]);

  useEndFocus(boxRef, ended);
  useEffect(() => {
    if (st.status === "won") post("post", `PORTHUNT: a caller booted the server ${st.boots} times.`);
    if (st.status === "lost") post("post", "PORTHUNT: a caller crashed out. PR #906 would have saved them.");
  }, [st.status, st.boots, post]);

  const bind = (port: number) => {
    if (st.status !== "running") return;
    const { state, result } = bindPort(st, port, rng.current);
    setSt(state);
    setFlash((f) => ({ port, ok: result === "bound", n: (f?.n ?? 0) + 1 }));
  };

  const auto = () => {
    if (st.status !== "running") return;
    const port = autoFallback(st);
    if (port === null) return;
    const checked: string[] = [];
    for (const p of st.ports) {
      checked.push(`${p.port} ${p.busy ? "busy" : "free"}`);
      if (!p.busy) break;
    }
    setAutoNote(`socket pre-check: ${checked.join(", ")}. Bind ${port}.`);
    bind(port);
  };

  const left = Math.max(0, Math.ceil((TIME_LIMIT_MS - st.elapsedMs) / 1000));
  const running = st.status === "running";

  return (
    <div ref={boxRef}>
      <Box title={"PORTHUNT · Boot the server"} headingRef={headingRef}>
        <p className="bbs-c7">
          Door 1 of 3. From merged PR #906 in {openSource.repo}.
        </p>
        <Gap />
        <p>
          The app needs one port in 8888{"–"}8897, and other processes keep taking and dropping them. Bind a free port{" "}
          {BOOTS_TO_WIN} times within {TIME_LIMIT_MS / 1000} seconds. Bind a busy one and the app crashes. {CRASHES_TO_LOSE} crashes
          and the door closes.
        </p>
        <p className="bbs-c7">Keys: the last digit of a port binds it, so 8 is 8888 and 0 is 8890.</p>
        <Gap />
        <p className="bbs-pre">
          <span className="bbs-c3">Time </span>
          <Meter value={(TIME_LIMIT_MS - st.elapsedMs) / TIME_LIMIT_MS} width={15} fg={left <= 8 ? 12 : 11} />
          <span className="bbs-c15">{` ${String(left).padStart(2, " ")} s`}</span>
          <span className="bbs-only-wide">{"   "}</span>
          <span className="bbs-only-narrow">{"\n"}</span>
          <span className="bbs-c3">Boots </span>
          <span className="bbs-c10">{`${st.boots}/${BOOTS_TO_WIN}`}</span>
          <span className="bbs-c3">{"   Crashes "}</span>
          <span className="bbs-c12">{`${st.crashes}/${CRASHES_TO_LOSE}`}</span>
        </p>
        <Gap />
        <div className="bbs-ports" role="group" aria-label="Ports 8888 to 8897">
          {st.ports.map((p) => {
            const hit = flash && flash.port === p.port;
            return (
              <Key
                key={hit ? `${p.port}-${flash.n}` : p.port}
                k={String(p.port % 10)}
                disabled={!running}
                onClick={() => bind(p.port)}
                className={hit ? (flash.ok ? "bbs-flash-good" : "bbs-flash-bad") : ""}
                label={
                  <>
                    <span className="bbs-c15">{p.port}</span>
                    {"  "}
                    {p.busy ? <span className="bbs-c12">BUSY</span> : <span className="bbs-c10">free</span>}
                    {"  "}
                    <span className="bbs-c7">{pad(p.owner ?? "", 17)}</span>
                  </>
                }
              />
            );
          })}
        </div>
        <Gap />
        {st.status === "idle" ? (
          <div className="bbs-keys">
            <Key k="S" icon="play" label="Start the server" onClick={start} />
          </div>
        ) : running ? (
          <div className="bbs-keys">
            <Key k="A" label="Auto-fallback: what PR #906 does" onClick={auto} />
          </div>
        ) : null}
        <p className="bbs-c13">{autoNote}</p>
        <div className="bbs-log" aria-live="polite">
          {st.log.slice(-4).map((l, i) => (
            <p key={`${l.at}-${i}-${l.text}`} className={l.kind === "crash" ? "bbs-c12" : l.kind === "bound" ? "bbs-c10" : "bbs-c7"}>
              {l.text}
            </p>
          ))}
        </div>
        {ended ? (
          <DoorEnd won={st.status === "won"} title={st.status === "won" ? "Server up. Listening." : "Crashed out."} onReplay={start}>
            <p>
              Boots {st.boots}/{BOOTS_TO_WIN} {"·"} crashes {st.crashes}/{CRASHES_TO_LOSE} {"·"}{" "}
              {Math.round(st.elapsedMs / 1000)} s
            </p>
            <p className="bbs-c11">
              PR #906 makes this boring on purpose: it pre-checks each port with a socket, takes the first free one in
              8888{"–"}8897, and catches EADDRINUSE and WinError 10048.
            </p>
          </DoorEnd>
        ) : null}
        <DoorExits />
      </Box>
    </div>
  );
}

/* ------------------------------------------------------------- CREDCHEK -- */

const STAMPS: { k: string; v: Verdict }[] = [
  { k: "V", v: "Verified" },
  { k: "U", v: "Under Review" },
  { k: "F", v: "Flagged" },
];

const verdictColor = (v: Verdict) => (v === "Verified" ? "bbs-c10" : v === "Under Review" ? "bbs-c14" : "bbs-c12");

export function CredchekDoor() {
  const { headingRef, full, post } = useBoard();
  const [st, setSt] = useState<CredibilityState | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const report = st ? currentReport(st) : null;
  const last = st && st.answers.length ? st.answers[st.answers.length - 1] : null;
  const ended = Boolean(st?.done);
  const correct = st ? correctCount(st) : 0;

  const start = () => setSt(createCredibility(createRng(Date.now())));
  useEndFocus(boxRef, ended);
  useEffect(() => {
    if (ended) post("post", `CREDCHEK: a caller matched the engine on ${correct} of ${ROUNDS} reports.`);
  }, [ended, correct, post]);

  return (
    <div ref={boxRef}>
      <Box title={"CREDCHEK · Verify the report"} headingRef={headingRef}>
        <p className="bbs-c7">Door 2 of 3. From BharatRitu, Smart India Hackathon 2026.</p>
        <Gap />
        <p>
          Citizens report weather. The engine weighs four signals and stamps each report Verified, Under Review, or Flagged.
          Read the signals and stamp {ROUNDS} reports the way the engine would.
        </p>
        <p className="bbs-c7">{DISCLAIMER}</p>
        <Gap />
        {!st ? (
          <div className="bbs-keys">
            <Key k="S" icon="play" label="Open the report queue" onClick={start} />
          </div>
        ) : null}
        {report ? (
          <section aria-label={`Report ${st!.index + 1} of ${ROUNDS}`}>
            <Rule label={`Report ${st!.index + 1} of ${ROUNDS}`} color={8} labelColor={7} />
            <dl className="bbs-dl-tight">
              <dt>Event</dt>
              <dd className="bbs-c15">{report.event}</dd>
              <dt>Place</dt>
              <dd>{report.place}</dd>
              <dt>Time</dt>
              <dd>{report.time}</dd>
            </dl>
            <Gap />
            {SIGNALS.map((s) => (
              <div key={s.key} className="bbs-signal">
                <span className="bbs-c11">{s.label}</span>
                <span className="bbs-pre">
                  <Meter value={report.signals[s.key]} width={20} fg={3} />
                  <span className="bbs-c15">{` ${report.signals[s.key].toFixed(2)}`}</span>
                </span>
                <span className="bbs-c7">{full ? `weight ${ILLUSTRATIVE_WEIGHTS[s.key].toFixed(2)}` : ""}</span>
              </div>
            ))}
            <Gap />
            <p className="bbs-c3">Stamp it:</p>
            <div className="bbs-keys">
              {STAMPS.map((s) => (
                <Key key={s.k} k={s.k} label={s.v} onClick={() => setSt((cur) => (cur ? stamp(cur, s.v) : cur))} />
              ))}
            </div>
          </section>
        ) : null}
        <div aria-live="polite">
          {last ? <Gap /> : null}
          {last ? (
            <p>
              <span className="bbs-c7">Last report: you stamped </span>
              <span className={verdictColor(last.guess)}>{last.guess}</span>
              <span className="bbs-c7">. Engine: </span>
              <span className={verdictColor(last.actual)}>{last.actual}</span>
              <span className="bbs-c7"> (score {last.score.toFixed(2)}). </span>
              <span className={last.guess === last.actual ? "bbs-c10" : "bbs-c12"}>
                {last.guess === last.actual ? "Match." : "Miss."}
              </span>
            </p>
          ) : null}
        </div>
        {ended && st ? (
          <DoorEnd won={correct >= 3} title={`${correct} of ${ROUNDS} verdicts matched the engine.`} onReplay={start}>
            <ul>
              {st.answers.map((a) => {
                const r = st.reports.find((x) => x.id === a.reportId);
                return (
                  <li key={a.reportId}>
                    <span className="bbs-c15">{r?.event}</span>
                    <span className="bbs-c7">: you </span>
                    <span className={verdictColor(a.guess)}>{a.guess}</span>
                    <span className="bbs-c7">, engine </span>
                    <span className={verdictColor(a.actual)}>{a.actual}</span>
                  </li>
                );
              })}
            </ul>
            <p className="bbs-c11">
              The real engine combines live-weather match, source trust, corroboration, and location confidence, with a
              5-second Open-Meteo timeout and a fail-soft fallback.
            </p>
          </DoorEnd>
        ) : null}
        <DoorExits />
      </Box>
    </div>
  );
}

/* ----------------------------------------------------------------- VIVA -- */

const LETTERS = ["A", "B", "C", "D"];

export function VivaDoor() {
  const { headingRef, post } = useBoard();
  const [i, setI] = useState(-1);
  const [picked, setPicked] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const boxRef = useRef<HTMLDivElement>(null);
  const qRef = useRef<HTMLHeadingElement>(null);
  const ended = i >= VIVA.length;
  const q = i >= 0 && !ended ? VIVA[i] : null;
  const g = grade(correct);

  const start = () => {
    setI(0);
    setPicked(null);
    setCorrect(0);
  };
  const answer = (n: number) => {
    if (!q || picked !== null) return;
    setPicked(n);
    if (n === q.answer) setCorrect((c) => c + 1);
  };
  const next = () => {
    setI((x) => x + 1);
    setPicked(null);
  };

  useEffect(() => {
    if (i >= 0 && i < VIVA.length) qRef.current?.focus();
  }, [i]);
  useEffect(() => {
    if (picked !== null) boxRef.current?.querySelector<HTMLElement>('[data-key="N"]')?.focus();
  }, [picked]);
  useEndFocus(boxRef, ended);
  useEffect(() => {
    if (ended) post("post", `VIVA: a caller scored ${correct} of ${VIVA.length}.`);
  }, [ended, correct, post]);

  return (
    <div ref={boxRef}>
      <Box title={"VIVA · The viva voce"} headingRef={headingRef}>
        <p className="bbs-c7">Door 3 of 3. Six questions from the sysop{"’"}s own record.</p>
        <Gap />
        <p>Every answer is somewhere on this board: the work log, the files area, and the message base.</p>
        <Gap />
        {i < 0 ? (
          <div className="bbs-keys">
            <Key k="S" icon="play" label="Begin the viva" onClick={start} />
          </div>
        ) : null}
        {q ? (
          <section aria-label={`Question ${i + 1} of ${VIVA.length}`}>
            <Rule label={`Question ${i + 1} of ${VIVA.length}`} color={8} labelColor={7} />
            <h3 ref={qRef} tabIndex={-1} className="bbs-c15">
              {q.prompt}
            </h3>
            <Gap />
            {picked === null ? (
              <div className="bbs-keys-stack">
                {q.options.map((opt, n) => (
                  <Key key={opt} k={LETTERS[n]} onClick={() => answer(n)} label={opt} />
                ))}
              </div>
            ) : (
              <ul>
                {q.options.map((opt, n) => {
                  const tone = n === q.answer ? "bbs-c10" : n === picked ? "bbs-c12" : "bbs-c7";
                  const mark = n === q.answer ? "  (correct)" : n === picked ? "  (your answer)" : "";
                  return (
                    <li key={opt} className={tone}>
                      <span aria-hidden>[{LETTERS[n]}] </span>
                      {opt}
                      {mark}
                    </li>
                  );
                })}
              </ul>
            )}
            <div aria-live="polite">
              {picked !== null ? (
                <>
                  <Gap />
                  <p>
                    <span className={picked === q.answer ? "bbs-c10" : "bbs-c12"}>
                      {picked === q.answer ? "Correct. " : `Not quite. The answer is ${LETTERS[q.answer]}. `}
                    </span>
                    <span className="bbs-c11">{q.explain}</span>
                  </p>
                </>
              ) : null}
            </div>
            {picked !== null ? (
              <div className="bbs-keys">
                <Key k="N" label={i === VIVA.length - 1 ? "See your grade" : "Next question"} onClick={next} />
              </div>
            ) : null}
          </section>
        ) : null}
        {ended ? (
          <DoorEnd won={correct >= 4} title={`${g.label}: ${correct} of ${VIVA.length}.`} onReplay={start}>
            <p className="bbs-c11">{g.line}</p>
          </DoorEnd>
        ) : null}
        <DoorExits />
      </Box>
    </div>
  );
}
