import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";
import type { HandLandmarks, Handedness } from "./landmarkTypes";
import { HAND_LANDMARKER_CONFIG, WASM_FILES_PATH } from "./visionConfig";

export async function createHandLandmarker(): Promise<HandLandmarker> {
  const vision = await FilesetResolver.forVisionTasks(WASM_FILES_PATH);

  try {
    return await HandLandmarker.createFromOptions(vision, {
      ...HAND_LANDMARKER_CONFIG,
      baseOptions: { ...HAND_LANDMARKER_CONFIG.baseOptions, delegate: "GPU" },
    });
  } catch (gpuError) {
    console.warn("GPU initialization failed. Trying CPU.", gpuError);
    return await HandLandmarker.createFromOptions(vision, {
      ...HAND_LANDMARKER_CONFIG,
      baseOptions: { ...HAND_LANDMARKER_CONFIG.baseOptions, delegate: "CPU" },
    });
  }
}

export function detectHandLandmarks(
  detector: HandLandmarker,
  video: HTMLVideoElement,
  timestamp: number
): { landmarks: HandLandmarks | null; handedness: Handedness | null } {
  if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
    return { landmarks: null, handedness: null };
  }

  const result = detector.detectForVideo(video, timestamp);
  const detected = result.landmarks[0];
  if (!detected) return { landmarks: null, handedness: null };

  const label = result.handednesses[0]?.[0]?.categoryName;
  return {
    landmarks: detected.map((point) => ({ x: point.x, y: point.y, z: point.z })),
    handedness: label === "Left" || label === "Right" ? label : null,
  };
}
