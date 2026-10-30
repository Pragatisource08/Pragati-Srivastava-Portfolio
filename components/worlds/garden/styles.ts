// Class names for garden.css (plain global CSS, every selector scoped under .garden-root).
import "./garden.css";

const styles = {
  root: "garden-root",
  display: "garden-display",
  num: "garden-num",
  mono: "garden-mono",
  bent: "garden-bent",
  bentText: "garden-bent-text",
  sky: "garden-sky",
  canvasWrap: "garden-canvas-wrap",
  river: "garden-river",
  pad: "garden-pad",
  press: "garden-press",
  range: "garden-range",
} as const;

export default styles;
