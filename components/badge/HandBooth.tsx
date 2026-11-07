"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icons";
import { links, projects } from "@/lib/content";
import { analyzeFingers } from "@/lib/hand/fingerAnalyzer";
import { classifyGesture } from "@/lib/hand/gestureClassifier";
import type { GestureType } from "@/lib/hand/gestureTypes";
import type { HandLandmarks } from "@/lib/hand/landmarkTypes";
import { GESTURES, SAMPLE_POSES, type Gesture } from "@/lib/hand/samplePoses";
import { useHandGestureRecognition } from "@/lib/hand/useHandGestureRecognition";

const HAND_CONNECTIONS: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [0, 9], [9, 10], [10, 11], [11, 12],
  [0, 13], [13, 14], [14, 15], [15, 16],
  [0, 17], [17, 18], [18, 19], [19, 20],
  [5, 9], [9, 13], [13, 17],
];

const FINGER_NAMES = [
  ["thumb", "Thumb"],
  ["index", "Index"],
  ["middle", "Middle"],
  ["ring", "Ring"],
  ["pinky", "Pinky"],
] as const;

const gestureLabel = (gesture: GestureType) => GESTURES.find((g) => g.type === gesture)?.label ?? null;

// A live overlay fills the video frame. With `fit`, the drawing crops to the hand itself.
export function HandSkeleton({
  landmarks,
  className,
  fit,
}: {
  landmarks: HandLandmarks;
  className: string;
  fit?: "start" | "center";
}) {
  let viewBox = "0 0 400 300";
  if (fit) {
    const xs = landmarks.map((p) => p.x * 400);
    const ys = landmarks.map((p) => p.y * 300);
    const left = Math.min(...xs) - 6;
    const top = Math.min(...ys) - 6;
    viewBox = `${left} ${top} ${Math.max(...xs) + 6 - left} ${Math.max(...ys) + 6 - top}`;
  }

  return (
    <svg
      className={`badge-hand ${className}`}
      viewBox={viewBox}
      preserveAspectRatio={fit ? `${fit === "start" ? "xMin" : "xMid"}YMid meet` : "none"}
      aria-hidden="true"
    >
      {HAND_CONNECTIONS.map(([from, to]) => (
        <line
          key={`${from}-${to}`}
          x1={landmarks[from].x * 400}
          y1={landmarks[from].y * 300}
          x2={landmarks[to].x * 400}
          y2={landmarks[to].y * 300}
        />
      ))}
      {landmarks.map((point, i) => (
        <circle key={i} cx={point.x * 400} cy={point.y * 300} r="3.5" />
      ))}
    </svg>
  );
}

// A kiosk on the booth table. The sample poses and the camera go through the same
// analyzer and classifier, so the readout is real either way.
export function HandBooth() {
  const [pose, setPose] = useState<Gesture>("OPEN_PALM");
  const [stamped, setStamped] = useState<ReadonlySet<Gesture>>(new Set());
  const rootRef = useRef<HTMLDivElement>(null);
  const stopRef = useRef<() => void>(() => {});

  const hand = useHandGestureRecognition((gesture) => {
    const next = new Set(stamped).add(gesture as Gesture);
    setStamped(next);
    if (next.size === GESTURES.length) stopRef.current();
  });
  const { videoRef, status, error, history, start, stop } = hand;
  useEffect(() => {
    stopRef.current = stop;
  }, [stop]);

  // The camera never stays on behind the visitor's back.
  useEffect(() => {
    if (status === "idle") return;
    const onVisibility = () => {
      if (document.hidden) stop();
    };
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) stop();
    });
    if (rootRef.current) io.observe(rootRef.current);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [status, stop]);

  const live = status === "running";
  const sample = SAMPLE_POSES[pose];
  const landmarks = status === "idle" ? sample : hand.landmarks;
  const fingers = status === "idle" ? analyzeFingers(sample) : hand.fingers;
  const gesture = status === "idle" ? classifyGesture(analyzeFingers(sample)) : hand.currentGesture;
  const complete = stamped.size === GESTURES.length;
  const named = gestureLabel(gesture);

  const reading = named ?? (live && !hand.landmarks ? "Show one hand" : live ? "Hold a gesture" : "Waiting");
  const project = projects.find((p) => p.slug === "hand-gesture")!;

  return (
    <div className="badge-hands" ref={rootRef} data-status={status}>
      <div className="badge-booth-brief">
        <p>
          Hold your hand up to the camera. Pragati&rsquo;s recogniser finds 21 points on it, works out which fingers are
          extended, and names the gesture. Show all four to fill the stamp card.
        </p>
        <p className="badge-booth-source">
          From her{" "}
          <a href={project.link.url} target="_blank" rel="noreferrer">
            {project.name}
          </a>{" "}
          project. Your video stays in this browser: nothing is recorded or uploaded, and this site&rsquo;s security
          policy blocks connections to other servers.
        </p>
      </div>

      <div className="badge-booth-table badge-hands-table">
        <div className="badge-hands-kiosk">
          <div className="badge-hands-screen">
            <span className="badge-hands-tag" data-live={live}>
              <span aria-hidden="true" />
              {live ? "Live on this device" : status === "loading" ? "Starting" : "Sample pose"}
            </span>
            <div className="badge-hands-lens">
              <video
                ref={videoRef}
                className="badge-hands-video"
                autoPlay
                playsInline
                muted
                aria-label="Your camera, mirrored"
              />
              {landmarks ? <HandSkeleton landmarks={landmarks} className="badge-hands-overlay" /> : null}
            </div>
          </div>

          <div className="badge-hands-controls">
            {status === "idle" && !complete ? (
              <button type="button" className="badge-btn-primary" onClick={start}>
                <Icon name="play" size={16} />
                Turn on camera
              </button>
            ) : null}
            {status === "loading" ? (
              <>
                <button type="button" className="badge-btn-primary" disabled>
                  Loading the model
                </button>
                <button type="button" className="badge-btn-ghost" onClick={stop}>
                  Cancel
                </button>
              </>
            ) : null}
            {live ? (
              <button type="button" className="badge-btn-ghost" onClick={stop}>
                <Icon name="x" size={16} />
                Turn off camera
              </button>
            ) : null}
            {complete ? null : (
              <span className="badge-booth-keys">
                {live ? "It turns off when you leave this zone." : "The first start downloads about 22 MB."}
              </span>
            )}
          </div>

          {error ? (
            <p className="badge-hands-error" role="alert">
              {error} You can still try the sample poses.
            </p>
          ) : null}

          {status === "idle" ? (
            <div className="badge-hands-poses" role="group" aria-label="Sample poses">
              {GESTURES.map((g) => (
                <button key={g.type} type="button" aria-pressed={pose === g.type} onClick={() => setPose(g.type)}>
                  {g.label}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="badge-hands-side">
          <div className="badge-hands-reading">
            <span className="badge-meter-label">Recognised gesture</span>
            <strong data-named={named !== null}>{reading}</strong>
            <ul aria-label="Finger states">
              {FINGER_NAMES.map(([key, label]) => (
                <li key={key} data-on={fingers?.[key] ?? false}>
                  <span aria-hidden="true" />
                  {label}
                  <span className="badge-sr">: {fingers?.[key] ? "extended" : "folded"}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="badge-hands-card">
            <h3>Gesture stamp card</h3>
            <ul>
              {GESTURES.map((g) => (
                <li key={g.type} data-stamped={stamped.has(g.type)}>
                  <span className="badge-hands-stamp">
                    <HandSkeleton landmarks={SAMPLE_POSES[g.type]} className="badge-hands-stamp-art" fit="center" />
                  </span>
                  {g.label}
                  <span className="badge-sr">{stamped.has(g.type) ? ": stamped" : ": not stamped"}</span>
                </li>
              ))}
            </ul>
            {complete ? (
              <div className="badge-hands-done">
                <p>
                  <strong>Card complete.</strong> You just ran her recogniser on your own hand. The camera is off.
                </p>
                <div className="badge-end-actions">
                  <a className="badge-btn-primary" href={links.mailtoHandGesture}>
                    <Icon name="mail" size={18} />
                    Email Pragati about this project
                  </a>
                  <button type="button" className="badge-btn-ink-ghost" onClick={() => setStamped(new Set())}>
                    <Icon name="replay" size={16} />
                    Play again
                  </button>
                </div>
              </div>
            ) : (
              <a className="badge-hands-mail" href={links.mailtoHandGesture}>
                <Icon name="mail" size={18} />
                Email Pragati about this project
              </a>
            )}
          </div>
        </div>

        <div className="badge-all badge-hands-detail">
          <ol className="badge-log" aria-label="Gesture log">
            {history.length === 0 ? (
              <li data-kind="info">
                {live
                  ? "Waiting for a stable gesture. Each one must hold for 300 ms."
                  : "Turn on the camera to log gestures here."}
              </li>
            ) : (
              history.slice(0, 4).map((item) => (
                <li key={item.timestamp} data-kind="bound">
                  {new Date(item.timestamp).toLocaleTimeString()} {item.gesture}
                </li>
              ))
            )}
          </ol>
          <ul className="badge-points">
            {project.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>
      </div>

      <p className="badge-sr" aria-live="polite">
        {live ? (named ? `${named} recognised. ${stamped.size} of ${GESTURES.length} stamped.` : "") : ""}
      </p>
    </div>
  );
}
