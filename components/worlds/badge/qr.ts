// Minimal QR Code encoder: byte mode, error-correction level M, versions 1–5.
// Written for the badge's "scan to email" square. Follows the ISO/IEC 18004
// layout; algorithm structure after Project Nayuki's reference encoder (MIT).

const EC_M: Record<number, { ecPerBlock: number; blocks: number; dataPerBlock: number }> = {
  1: { ecPerBlock: 10, blocks: 1, dataPerBlock: 16 },
  2: { ecPerBlock: 16, blocks: 1, dataPerBlock: 28 },
  3: { ecPerBlock: 26, blocks: 1, dataPerBlock: 44 },
  4: { ecPerBlock: 18, blocks: 2, dataPerBlock: 32 },
  5: { ecPerBlock: 24, blocks: 2, dataPerBlock: 43 },
};

const ALIGN: Record<number, number[]> = { 1: [], 2: [6, 18], 3: [6, 22], 4: [6, 26], 5: [6, 30] };

function gfMul(x: number, y: number): number {
  let z = 0;
  for (let i = 7; i >= 0; i--) {
    z = (z << 1) ^ ((z >>> 7) * 0x11d);
    z ^= ((y >>> i) & 1) * x;
  }
  return z & 0xff;
}

function rsDivisor(degree: number): number[] {
  const result = new Array<number>(degree).fill(0);
  result[degree - 1] = 1;
  let root = 1;
  for (let i = 0; i < degree; i++) {
    for (let j = 0; j < degree; j++) {
      result[j] = gfMul(result[j], root);
      if (j + 1 < degree) result[j] ^= result[j + 1];
    }
    root = gfMul(root, 0x02);
  }
  return result;
}

export function rsRemainder(data: number[], degree: number): number[] {
  const divisor = rsDivisor(degree);
  const result = new Array<number>(degree).fill(0);
  for (const b of data) {
    const factor = b ^ (result.shift() as number);
    result.push(0);
    divisor.forEach((coef, i) => {
      result[i] ^= gfMul(coef, factor);
    });
  }
  return result;
}

function maskBit(mask: number, x: number, y: number): boolean {
  switch (mask) {
    case 0: return (x + y) % 2 === 0;
    case 1: return y % 2 === 0;
    case 2: return x % 3 === 0;
    case 3: return (x + y) % 3 === 0;
    case 4: return (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0;
    case 5: return ((x * y) % 2) + ((x * y) % 3) === 0;
    case 6: return (((x * y) % 2) + ((x * y) % 3)) % 2 === 0;
    default: return (((x + y) % 2) + ((x * y) % 3)) % 2 === 0;
  }
}

/** Returns a square matrix of booleans (true = dark), indexed [row][col]. */
export function encodeQr(text: string): boolean[][] {
  const bytes = Array.from(new TextEncoder().encode(text));
  let version = 1;
  while (version <= 5) {
    const spec = EC_M[version];
    if (4 + 8 + bytes.length * 8 <= spec.blocks * spec.dataPerBlock * 8) break;
    version++;
  }
  if (version > 5) throw new Error("QR payload too long for versions 1–5");
  const spec = EC_M[version];
  const capacityBits = spec.blocks * spec.dataPerBlock * 8;

  // Bit stream: mode 0100, 8-bit count, data, terminator, byte pad, pad codewords.
  const bits: number[] = [];
  const push = (val: number, len: number) => {
    for (let i = len - 1; i >= 0; i--) bits.push((val >>> i) & 1);
  };
  push(0b0100, 4);
  push(bytes.length, 8);
  bytes.forEach((b) => push(b, 8));
  push(0, Math.min(4, capacityBits - bits.length));
  push(0, (8 - (bits.length % 8)) % 8);
  for (let pad = 0xec; bits.length < capacityBits; pad ^= 0xec ^ 0x11) push(pad, 8);

  const data: number[] = [];
  for (let i = 0; i < bits.length; i += 8) {
    let v = 0;
    for (let j = 0; j < 8; j++) v = (v << 1) | bits[i + j];
    data.push(v);
  }

  // Split into blocks, add EC, interleave.
  const blocks: number[][] = [];
  const ecs: number[][] = [];
  for (let b = 0; b < spec.blocks; b++) {
    const block = data.slice(b * spec.dataPerBlock, (b + 1) * spec.dataPerBlock);
    blocks.push(block);
    ecs.push(rsRemainder(block, spec.ecPerBlock));
  }
  const codewords: number[] = [];
  for (let i = 0; i < spec.dataPerBlock; i++) blocks.forEach((bl) => codewords.push(bl[i]));
  for (let i = 0; i < spec.ecPerBlock; i++) ecs.forEach((ec) => codewords.push(ec[i]));

  const size = 17 + version * 4;
  const modules: boolean[][] = Array.from({ length: size }, () => new Array<boolean>(size).fill(false));
  const isFn: boolean[][] = Array.from({ length: size }, () => new Array<boolean>(size).fill(false));
  const set = (x: number, y: number, dark: boolean) => {
    modules[y][x] = dark;
    isFn[y][x] = true;
  };

  // Timing patterns.
  for (let i = 0; i < size; i++) {
    set(6, i, i % 2 === 0);
    set(i, 6, i % 2 === 0);
  }
  // Finder patterns with separators.
  const finder = (cx: number, cy: number) => {
    for (let dy = -4; dy <= 4; dy++) {
      for (let dx = -4; dx <= 4; dx++) {
        const x = cx + dx;
        const y = cy + dy;
        if (x < 0 || y < 0 || x >= size || y >= size) continue;
        const dist = Math.max(Math.abs(dx), Math.abs(dy));
        set(x, y, dist !== 2 && dist !== 4);
      }
    }
  };
  finder(3, 3);
  finder(size - 4, 3);
  finder(3, size - 4);
  // Alignment patterns.
  const pos = ALIGN[version];
  pos.forEach((ay, i) =>
    pos.forEach((ax, j) => {
      const corner = (i === 0 && j === 0) || (i === 0 && j === pos.length - 1) || (i === pos.length - 1 && j === 0);
      if (corner) return;
      for (let dy = -2; dy <= 2; dy++)
        for (let dx = -2; dx <= 2; dx++) set(ax + dx, ay + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
    })
  );
  // Reserve format areas (filled later) and the dark module.
  const drawFormat = (mask: number) => {
    const fdata = (0 << 3) | mask; // level M = 0b00
    let rem = fdata;
    for (let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
    const fbits = ((fdata << 10) | rem) ^ 0x5412;
    const bit = (i: number) => ((fbits >>> i) & 1) === 1;
    for (let i = 0; i <= 5; i++) set(8, i, bit(i));
    set(8, 7, bit(6));
    set(8, 8, bit(7));
    set(7, 8, bit(8));
    for (let i = 9; i < 15; i++) set(14 - i, 8, bit(i));
    for (let i = 0; i < 8; i++) set(size - 1 - i, 8, bit(i));
    for (let i = 8; i < 15; i++) set(8, size - 15 + i, bit(i));
    set(8, size - 8, true);
  };
  drawFormat(0);

  // Place codeword bits in the zigzag.
  const allBits: number[] = [];
  codewords.forEach((cw) => {
    for (let i = 7; i >= 0; i--) allBits.push((cw >>> i) & 1);
  });
  let k = 0;
  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5;
    for (let vert = 0; vert < size; vert++) {
      for (let j = 0; j < 2; j++) {
        const x = right - j;
        const upward = ((right + 1) & 2) === 0;
        const y = upward ? size - 1 - vert : vert;
        if (!isFn[y][x]) {
          modules[y][x] = k < allBits.length ? allBits[k] === 1 : false;
          k++;
        }
      }
    }
  }

  // Choose the mask with the lowest penalty.
  const applyMask = (mask: number) => {
    for (let y = 0; y < size; y++)
      for (let x = 0; x < size; x++) if (!isFn[y][x] && maskBit(mask, x, y)) modules[y][x] = !modules[y][x];
  };
  let best = 0;
  let bestScore = Infinity;
  for (let mask = 0; mask < 8; mask++) {
    applyMask(mask);
    drawFormat(mask);
    const s = penalty(modules);
    if (s < bestScore) {
      bestScore = s;
      best = mask;
    }
    applyMask(mask);
  }
  applyMask(best);
  drawFormat(best);
  return modules;
}

function penalty(m: boolean[][]): number {
  const n = m.length;
  let score = 0;
  const line = (get: (i: number, j: number) => boolean) => {
    for (let i = 0; i < n; i++) {
      let run = 1;
      for (let j = 1; j <= n; j++) {
        if (j < n && get(i, j) === get(i, j - 1)) run++;
        else {
          if (run >= 5) score += 3 + (run - 5);
          run = 1;
        }
      }
      const seq = Array.from({ length: n }, (_, j) => (get(i, j) ? "1" : "0")).join("");
      for (const pat of ["10111010000", "00001011101"]) {
        let at = seq.indexOf(pat);
        while (at !== -1) {
          score += 40;
          at = seq.indexOf(pat, at + 1);
        }
      }
    }
  };
  line((i, j) => m[i][j]);
  line((i, j) => m[j][i]);
  let dark = 0;
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      if (m[y][x]) dark++;
      if (y < n - 1 && x < n - 1) {
        const c = m[y][x];
        if (c === m[y][x + 1] && c === m[y + 1][x] && c === m[y + 1][x + 1]) score += 3;
      }
    }
  }
  const k = Math.ceil(Math.abs(dark * 20 - n * n * 10) / (n * n)) - 1;
  return score + Math.max(0, k) * 10;
}

/** SVG path data for the dark modules, one unit per module. */
export function qrPath(m: boolean[][]): string {
  let d = "";
  m.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      if (!row[x]) {
        x++;
        continue;
      }
      let w = 1;
      while (x + w < row.length && row[x + w]) w++;
      d += `M${x} ${y}h${w}v1h-${w}z`;
      x += w;
    }
  });
  return d;
}
