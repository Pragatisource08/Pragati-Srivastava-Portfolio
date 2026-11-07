import type { GestureType } from "./gestureTypes";
import type { HandLandmarks } from "./landmarkTypes";

export type Gesture = Exclude<GestureType, "UNKNOWN">;

export const GESTURES: { type: Gesture; label: string }[] = [
  { type: "OPEN_PALM", label: "Open Palm" },
  { type: "PEACE", label: "Peace Sign" },
  { type: "THUMBS_UP", label: "Thumbs Up" },
  { type: "FIST", label: "Fist" },
];

// Hand-placed points on a 400 × 300 stage, in MediaPipe's landmark order.
type Point = [number, number];
const WRIST: Point = [200, 276];
const THUMB_ROOT: Point = [165, 250];

const THUMB_OUT: Point[] = [[135, 220], [112, 195], [95, 172]];
const THUMB_ACROSS: Point[] = [[150, 236], [156, 216], [176, 206]];
const THUMB_UP: Point[] = [[148, 200], [134, 158], [124, 118]];

const FINGERS_OUT: Point[][] = [
  [[170, 175], [162, 130], [157, 100], [153, 75]],
  [[198, 168], [198, 118], [198, 85], [198, 58]],
  [[226, 173], [232, 126], [236, 95], [240, 70]],
  [[250, 188], [262, 150], [270, 125], [277, 103]],
];

const FINGERS_CURLED: Point[][] = [
  [[170, 175], [164, 146], [172, 166], [178, 184]],
  [[198, 168], [196, 138], [202, 160], [206, 180]],
  [[226, 173], [226, 144], [228, 166], [228, 184]],
  [[250, 188], [254, 160], [250, 178], [246, 194]],
];

const toLandmarks = (thumb: Point[], fingers: Point[][]): HandLandmarks =>
  [WRIST, THUMB_ROOT, ...thumb, ...fingers.flat()].map(([x, y]) => ({ x: x / 400, y: y / 300, z: 0 }));

export const SAMPLE_POSES: Record<Gesture, HandLandmarks> = {
  OPEN_PALM: toLandmarks(THUMB_OUT, FINGERS_OUT),
  PEACE: toLandmarks(THUMB_ACROSS, [FINGERS_OUT[0], FINGERS_OUT[1], FINGERS_CURLED[2], FINGERS_CURLED[3]]),
  THUMBS_UP: toLandmarks(THUMB_UP, FINGERS_CURLED),
  FIST: toLandmarks(THUMB_ACROSS, FINGERS_CURLED),
};
