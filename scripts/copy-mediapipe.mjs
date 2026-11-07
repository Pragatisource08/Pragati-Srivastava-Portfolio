import { cpSync, mkdirSync } from "node:fs";

// Serve MediaPipe's runtime from this site, at the exact version in package-lock.json.
const from = "node_modules/@mediapipe/tasks-vision/wasm";
const to = "public/vision/wasm";

mkdirSync(to, { recursive: true });
for (const file of ["vision_wasm_internal.js", "vision_wasm_internal.wasm"]) {
  cpSync(`${from}/${file}`, `${to}/${file}`);
}
