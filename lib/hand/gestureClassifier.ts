import type { FingerStates } from "./fingerAnalyzer";
import type { GestureType } from "./gestureTypes";

export function classifyGesture(fingers: FingerStates): GestureType {
  const { thumb, thumbRaised, index, middle, ring, pinky } = fingers;

  if (!thumb && !index && !middle && !ring && !pinky) return "FIST";
  if (thumb && index && middle && ring && pinky) return "OPEN_PALM";
  // A thumb pointing down is not a thumbs up.
  if (thumb && thumbRaised && !index && !middle && !ring && !pinky) return "THUMBS_UP";
  if (!thumb && index && middle && !ring && !pinky) return "PEACE";

  return "UNKNOWN";
}
