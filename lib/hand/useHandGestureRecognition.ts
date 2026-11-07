"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { HandLandmarker } from "@mediapipe/tasks-vision";
import { analyzeFingers, type FingerStates } from "./fingerAnalyzer";
import { classifyGesture } from "./gestureClassifier";
import type { GestureType } from "./gestureTypes";
import type { HandLandmarks } from "./landmarkTypes";

export interface GestureHistoryItem {
  gesture: GestureType;
  timestamp: number;
}

export type CameraStatus = "idle" | "loading" | "running";

const STABILITY_DURATION = 300;
const HISTORY_LENGTH = 20;

function describeStartError(error: unknown): string {
  const name = error instanceof DOMException ? error.name : "";
  if (name === "NotAllowedError" || name === "SecurityError") {
    return "Camera access is off. Allow the camera for this site, then try again.";
  }
  if (name === "NotFoundError" || name === "OverconstrainedError") return "No camera was found on this device.";
  if (name === "NotReadableError") return "Another app is using the camera. Close it, then try again.";
  return "The hand model could not start in this browser.";
}

export function useHandGestureRecognition(onStableGesture?: (gesture: GestureType) => void) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const detectorRef = useRef<HandLandmarker | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  // Every start or stop takes a new run id, so a start that was overtaken cleans up after itself.
  const runRef = useRef(0);
  const startingRef = useRef(false);

  const lastVideoTimeRef = useRef(-1);
  const pendingGestureRef = useRef<GestureType>("UNKNOWN");
  const pendingSinceRef = useRef(0);
  const stableGestureRef = useRef<GestureType>("UNKNOWN");

  const onStableGestureRef = useRef(onStableGesture);
  useEffect(() => {
    onStableGestureRef.current = onStableGesture;
  });

  const [status, setStatus] = useState<CameraStatus>("idle");
  const [landmarks, setLandmarks] = useState<HandLandmarks | null>(null);
  const [fingers, setFingers] = useState<FingerStates | null>(null);
  const [currentGesture, setCurrentGesture] = useState<GestureType>("UNKNOWN");
  const [history, setHistory] = useState<GestureHistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const stop = useCallback(() => {
    runRef.current += 1;
    startingRef.current = false;

    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;

    detectorRef.current?.close();
    detectorRef.current = null;

    if (videoRef.current) videoRef.current.srcObject = null;

    lastVideoTimeRef.current = -1;
    pendingGestureRef.current = "UNKNOWN";
    pendingSinceRef.current = 0;
    stableGestureRef.current = "UNKNOWN";

    setStatus("idle");
    setLandmarks(null);
    setFingers(null);
    setCurrentGesture("UNKNOWN");
  }, []);

  const start = useCallback(async () => {
    if (streamRef.current || startingRef.current) return;
    startingRef.current = true;
    const run = ++runRef.current;
    const isStale = () => runRef.current !== run;

    try {
      setError(null);
      setStatus("loading");

      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Camera access is not supported by this browser.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
      if (isStale()) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }
      streamRef.current = stream;

      const video = videoRef.current;
      if (!video) throw new Error("Video element is not available.");
      video.srcObject = stream;

      if (video.readyState < HTMLMediaElement.HAVE_METADATA) {
        await new Promise<void>((resolve, reject) => {
          video.onloadedmetadata = () => resolve();
          video.onerror = () => reject(new Error("Unable to load camera video."));
        });
      }
      await video.play();

      const { createHandLandmarker, detectHandLandmarks } = await import("./handDetector");
      const detector = await createHandLandmarker();
      if (isStale()) {
        detector.close();
        return;
      }
      detectorRef.current = detector;
      startingRef.current = false;
      setStatus("running");

      const processFrame = () => {
        const currentVideo = videoRef.current;
        const currentDetector = detectorRef.current;
        if (!currentVideo || !currentDetector) return;

        if (
          currentVideo.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA &&
          currentVideo.currentTime !== lastVideoTimeRef.current
        ) {
          lastVideoTimeRef.current = currentVideo.currentTime;

          try {
            const now = performance.now();
            const result = detectHandLandmarks(currentDetector, currentVideo, now);
            const nextFingers = result.landmarks ? analyzeFingers(result.landmarks) : null;
            const detectedGesture = nextFingers ? classifyGesture(nextFingers) : "UNKNOWN";

            setLandmarks(result.landmarks);
            setFingers(nextFingers);

            if (detectedGesture !== pendingGestureRef.current) {
              pendingGestureRef.current = detectedGesture;
              pendingSinceRef.current = now;
            } else if (
              now - pendingSinceRef.current >= STABILITY_DURATION &&
              detectedGesture !== stableGestureRef.current
            ) {
              stableGestureRef.current = detectedGesture;
              setCurrentGesture(detectedGesture);

              if (detectedGesture !== "UNKNOWN") {
                onStableGestureRef.current?.(detectedGesture);
                setHistory((previous) =>
                  [{ gesture: detectedGesture, timestamp: Date.now() }, ...previous].slice(0, HISTORY_LENGTH)
                );
              }
            }
          } catch (frameError) {
            console.error("Frame processing failed:", frameError);
          }
        }

        animationFrameRef.current = requestAnimationFrame(processFrame);
      };

      animationFrameRef.current = requestAnimationFrame(processFrame);
    } catch (startError) {
      if (isStale()) return;
      console.error("Hand recognition failed to start:", startError);
      setError(describeStartError(startError));
      stop();
    }
  }, [stop]);

  useEffect(() => stop, [stop]);

  return { videoRef, status, landmarks, fingers, currentGesture, history, error, start, stop };
}
