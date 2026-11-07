export const WASM_FILES_PATH = "/vision/wasm";

export const HAND_LANDMARKER_CONFIG = {
  baseOptions: {
    modelAssetPath: "/vision/hand_landmarker.task",
  },
  runningMode: "VIDEO" as const,
  numHands: 1,
  minHandDetectionConfidence: 0.5,
  minHandPresenceConfidence: 0.5,
  minTrackingConfidence: 0.5,
};
