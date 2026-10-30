"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { BoardContext, isScreen, type Board, type BoardEvent, type BoardEventKind, type ScreenId } from "./board";
import { Key } from "./grid";
import {
  FameScreen,
  FilesScreen,
  GoodbyeScreen,
  LetterScreen,
  MailScreen,
  MainScreen,
  MessagesScreen,
  SchoolScreen,
  SysopScreen,
  ToolboxScreen,
  WorkScreen,
  DoorsScreen,
} from "./screens";
import { CredchekDoor, PortHuntDoor, VivaDoor } from "./doors";

// Any keypress or tap completes the screen that is still pouring in.
const skipBus = new EventTarget();

function Stream({ boot, children }: { boot: boolean; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || boot) return;
    // Client-side arrival: measure the screen in rows, then pour it at modem speed before first paint.
    const cell = parseFloat(getComputedStyle(el).fontSize) || 16;
    const rows = Math.max(1, Math.ceil(el.scrollHeight / cell));
    el.style.setProperty("--rows", String(rows));
    el.style.setProperty("--row-ms", `${Math.min(22, Math.round(720 / rows))}ms`);
    el.dataset.run = "";
  }, [boot]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const done = () => {
      el.dataset.done = "";
    };
    const onEnd = (e: AnimationEvent) => {
      if (e.target === el && e.animationName === "bbs-pour") done();
    };
    skipBus.addEventListener("skip", done);
    el.addEventListener("animationend", onEnd);
    return () => {
      skipBus.removeEventListener("skip", done);
      el.removeEventListener("animationend", onEnd);
    };
  }, []);

  return (
    <div ref={ref} className="bbs-stream" data-boot={boot ? "" : undefined}>
      {children}
    </div>
  );
}

function StatusBar({ full }: { full: boolean }) {
  const [secs, setSecs] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => {
      if (!document.hidden) setSecs((s) => s + 1);
    }, 1000);
    return () => window.clearInterval(id);
  }, []);
  const hh = String(Math.floor(secs / 3600)).padStart(2, "0");
  const mm = String(Math.floor((secs % 3600) / 60)).padStart(2, "0");
  const ss = String(secs % 60).padStart(2, "0");
  return (
    <div className="bbs-status">
      <span className="bbs-live">
        <span className="bbs-blink">1 CALLER: YOU</span>
      </span>
      <span className="bbs-only-wide"> NODE 1 </span>
      <span aria-hidden>{"│"}</span>
      <span> {full ? "FULL TEXT" : "QUICKSCAN"} </span>
      <span aria-hidden>{"│"}</span>
      <span aria-hidden> {`${hh}:${mm}:${ss}`} </span>
      <span className="bbs-only-wide" aria-hidden>
        {"│ 14400 8N1 ANSI │ ESC BACK │ 1-9 MENU "}
      </span>
    </div>
  );
}

function EventLine({ ev, onRead }: { ev: BoardEvent; onRead: () => void }) {
  if (ev.kind === "mail") {
    return (
      <p className="bbs-event">
        <span className="bbs-live">
          <span className="bbs-blink">NEW MAIL</span>
        </span>{" "}
        <span className="bbs-c15">{ev.text}</span>{" "}
        <Key k="M" label="Read it" tone="plain" onClick={onRead} />
      </p>
    );
  }
  if (ev.kind === "presence") {
    return (
      <p className="bbs-event">
        <span className="bbs-live">
          <span className="bbs-blink">LIVE</span>
        </span>{" "}
        <span className="bbs-c15">{ev.text}</span>
      </p>
    );
  }
  return (
    <p className="bbs-event">
      <span className={ev.kind === "post" ? "bbs-c13" : "bbs-c3"}>{ev.kind === "post" ? "NEW POST" : "SYSOP"}</span>{" "}
      <span className="bbs-c7">{ev.text}</span>
    </p>
  );
}

const SCREEN_VIEWS: Record<ScreenId, () => ReactNode> = {
  main: () => <MainScreen />,
  sysop: () => <SysopScreen />,
  work: () => <WorkScreen />,
  files: () => <FilesScreen />,
  messages: () => <MessagesScreen />,
  fame: () => <FameScreen />,
  doors: () => <DoorsScreen />,
  mail: () => <MailScreen />,
  toolbox: () => <ToolboxScreen />,
  school: () => <SchoolScreen />,
  letter: () => <LetterScreen />,
  goodbye: () => <GoodbyeScreen />,
  porthunt: () => <PortHuntDoor />,
  credchek: () => <CredchekDoor />,
  viva: () => <VivaDoor />,
};

export function Nightboard() {
  const [screen, setScreen] = useState<ScreenId>("main");
  const [full, setFull] = useState(false);
  const [events, setEvents] = useState<BoardEvent[]>([]);
  const [visits, setVisits] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const eventId = useRef(0);

  const show = useCallback((id: ScreenId, push: boolean) => {
    setScreen(id);
    setVisits((v) => v + 1);
    if (push) {
      const url = id === "main" ? window.location.pathname + window.location.search : `#${id}`;
      window.history.pushState({ bbs: id }, "", url);
    }
  }, []);

  const go = useCallback((id: ScreenId) => show(id, true), [show]);

  const post = useCallback((kind: BoardEventKind, text: string) => {
    eventId.current += 1;
    const ev = { id: eventId.current, kind, text };
    setEvents((list) => [...list.filter((e) => !(e.kind === kind && e.text === text)), ev].slice(-2));
  }, []);

  const toggleFull = useCallback(() => setFull((f) => !f), []);

  // Deep links (#files) and the browser's back button map onto screens.
  useEffect(() => {
    const fromHash = () => {
      const h = window.location.hash.slice(1);
      show(isScreen(h) ? h : "main", false);
    };
    if (window.location.hash) fromHash();
    window.addEventListener("popstate", fromHash);
    return () => window.removeEventListener("popstate", fromHash);
  }, [show]);

  // After every move, put focus on the new screen's heading and return to the top of the grid.
  useEffect(() => {
    if (visits === 0) return;
    headingRef.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0 });
  }, [visits]);

  // Textmode events land after the title has poured in: presence first, then the sysop's mail.
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t1 = window.setTimeout(() => post("presence", "You are the only caller online. Node 1 of 1 is yours."), reduce ? 0 : 1900);
    const t2 = window.setTimeout(() => post("mail", "1 message from the sysop."), reduce ? 0 : 3200);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [post]);

  // Complete keyboard operation: every control carries data-key, so the DOM is the key map.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey || e.isComposing) return;
      const root = rootRef.current;
      const t = e.target as HTMLElement | null;
      if (!root || (t && t !== document.body && !root.contains(t))) return;
      skipBus.dispatchEvent(new Event("skip"));
      if (t && t.closest("input, textarea, select, [contenteditable='true']")) {
        if (e.key === "Escape") t.blur();
        return;
      }
      if (e.key.length !== 1 && e.key !== "Escape") return;
      if (e.key === " ") return;
      const key = e.key.length === 1 ? e.key.toUpperCase() : e.key;
      const el = root.querySelector<HTMLElement>(`[data-key="${CSS.escape(key)}"]:not([disabled])`);
      if (el) {
        e.preventDefault();
        el.click();
      }
    };
    const onPointer = () => skipBus.dispatchEvent(new Event("skip"));
    window.addEventListener("keydown", onKey);
    rootRef.current?.addEventListener("pointerdown", onPointer);
    const root = rootRef.current;
    return () => {
      window.removeEventListener("keydown", onKey);
      root?.removeEventListener("pointerdown", onPointer);
    };
  }, []);

  const board: Board = useMemo(
    () => ({ screen, go, full, toggleFull, post, headingRef }),
    [screen, go, full, toggleFull, post]
  );

  return (
    <BoardContext.Provider value={board}>
      <div ref={rootRef} className="bbs-root">
        <main className="bbs-term">
          <Stream key={`${screen}-${visits}`} boot={visits === 0 && screen === "main"}>
            {SCREEN_VIEWS[screen]()}
          </Stream>
          <div className="bbs-events" aria-live="polite">
            {events.map((ev) => (
              <EventLine key={ev.id} ev={ev} onRead={() => go("letter")} />
            ))}
          </div>
          <StatusBar full={full} />
        </main>
      </div>
    </BoardContext.Provider>
  );
}
