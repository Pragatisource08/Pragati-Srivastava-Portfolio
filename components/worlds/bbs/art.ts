// Textmode art helpers for ANSI Nightboard.
// A segment is a run of characters with one ANSI foreground and background colour (0–15, or -1 for none).

export type Seg = [text: string, fg: number, bg: number];

// 6-pixel-tall block letters. Two pixel rows share one text row through the half-block glyphs.
const GLYPHS: Record<string, string[]> = {
  P: ["###.", "#..#", "#..#", "###.", "#...", "#..."],
  R: ["###.", "#..#", "#..#", "###.", "#.#.", "#..#"],
  A: [".##.", "#..#", "#..#", "####", "#..#", "#..#"],
  G: [".###", "#...", "#...", "#.##", "#..#", ".##."],
  T: ["###", ".#.", ".#.", ".#.", ".#.", ".#."],
  I: ["###", ".#.", ".#.", ".#.", ".#.", "###"],
  S: [".###", "#...", ".##.", "...#", "...#", "###."],
  V: ["#...#", "#...#", "#...#", ".#.#.", ".#.#.", "..#.."],
};

function wordBitmap(word: string, gap: number): boolean[][] {
  const rows: boolean[][] = Array.from({ length: 6 }, () => []);
  [...word].forEach((ch, i) => {
    const g = GLYPHS[ch];
    for (let y = 0; y < 6; y++) {
      if (i > 0) for (let k = 0; k < gap; k++) rows[y].push(false);
      for (const p of g[y]) rows[y].push(p === "#");
    }
  });
  return rows;
}

type Grid = (number | null)[][];

// Build a colour grid at half-row resolution, scaled, with a one-step drop shadow.
function logoGrid(word: string, scale: number, colors: number[], shadow: number | null): Grid {
  const bmp = wordBitmap(word, 1);
  const w = bmp[0].length * scale + (shadow === null ? 0 : 1);
  let h = 6 * scale + (shadow === null ? 0 : 1);
  if (h % 2) h++;
  const grid: Grid = Array.from({ length: h }, () => Array<number | null>(w).fill(null));
  const lit = (x: number, y: number) => {
    const bx = Math.floor(x / scale), by = Math.floor(y / scale);
    return by >= 0 && by < 6 && bx >= 0 && bx < bmp[0].length && bmp[by][bx];
  };
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (y < 6 * scale && lit(x, y)) grid[y][x] = colors[Math.min(colors.length - 1, y)];
      else if (shadow !== null && lit(x - 1, y - 1)) grid[y][x] = shadow;
    }
  }
  return grid;
}

function pushSeg(segs: Seg[], text: string, fg: number, bg: number) {
  const last = segs[segs.length - 1];
  if (last && last[1] === fg && last[2] === bg) last[0] += text;
  else segs.push([text, fg, bg]);
}

export function halfBlocks(grid: Grid): Seg[][] {
  const out: Seg[][] = [];
  for (let r = 0; r < grid.length; r += 2) {
    const top = grid[r];
    const bot = grid[r + 1] ?? [];
    const segs: Seg[] = [];
    for (let c = 0; c < top.length; c++) {
      const t = top[c] ?? null;
      const b = bot[c] ?? null;
      if (t === null && b === null) pushSeg(segs, " ", -1, -1);
      else if (t === b) pushSeg(segs, "█", t as number, -1);
      else if (b === null) pushSeg(segs, "▀", t as number, -1);
      else if (t === null) pushSeg(segs, "▄", b, -1);
      else pushSeg(segs, "▀", t, b);
    }
    out.push(segs);
  }
  return out;
}

// Title art. A one-pixel white highlight into bright cyan, then cyan; magenta drop shadow.
export const LOGO_BIG = halfBlocks(
  logoGrid("PRAGATI", 2, [15, 11, 11, 11, 11, 11, 3, 3, 3, 3, 3, 3], 5)
);
export const LOGO_SMALL = halfBlocks(logoGrid("PRAGATI", 1, [15, 11, 11, 3, 3, 3], 5));
export const SURNAME_ART = halfBlocks(logoGrid("SRIVASTAVA", 1, [15, 13, 13, 13, 5, 5], null));

export function segWidth(row: Seg[]): number {
  return row.reduce((n, s) => n + s[0].length, 0);
}

export const ANSI_HEX = [
  "#000000", "#0000AA", "#00AA00", "#00AAAA", "#AA0000", "#AA00AA", "#AA5500", "#AAAAAA",
  "#555555", "#5555FF", "#55FF55", "#55FFFF", "#FF5555", "#FF55FF", "#FFFF55", "#FFFFFF",
];
