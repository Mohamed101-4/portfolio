import { mulberry32 } from "@/lib/inferenceSim";

/**
 * Procedural tiger stripes: bold, tapered, slightly wavy blades with jagged edges
 * and occasional forks, growing in from one edge. Deterministic (seeded) so server
 * and client render identically.
 */

type Pt = [number, number];

function blade(rnd: () => number, x0: number, y0: number, dir: 1 | -1, len: number, thick: number) {
  const N = 28;
  const amp = 18 + rnd() * 36;
  const freq = 0.6 + rnd() * 0.9;
  const phase = rnd() * Math.PI * 2;
  const tilt = (rnd() - 0.5) * 0.5;
  const center: Pt[] = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    center.push([x0 + dir * t * len, y0 + Math.sin(t * Math.PI * freq + phase) * amp * t + tilt * t * len]);
  }
  const widthAt = (t: number) => {
    const taper = Math.pow(1 - t, 0.9);
    const jag = 1 + (rnd() - 0.5) * 0.28; // ragged edge
    return thick * taper * jag;
  };
  const upper: Pt[] = [], lower: Pt[] = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const [x, y] = center[i];
    const [nx0, ny0] = center[Math.min(N, i + 1)];
    const [px0, py0] = center[Math.max(0, i - 1)];
    let dx = nx0 - px0, dy = ny0 - py0;
    const l = Math.hypot(dx, dy) || 1;
    dx /= l; dy /= l;
    const w = widthAt(t) / 2;
    // asymmetric edges make it feel organic rather than mechanical
    upper.push([x - dy * w * (1 + 0.25 * Math.sin(t * 9 + phase)), y + dx * w * (1 + 0.25 * Math.sin(t * 9 + phase))]);
    lower.push([x + dy * w, y - dx * w]);
  }
  const paths = [toPath([...upper, ...lower.reverse()])];

  // fork: a second prong peeling away from the blade
  if (rnd() > 0.45) {
    const k = Math.floor(N * (0.35 + rnd() * 0.25));
    const [fx, fy] = center[k];
    const forkLen = len * (0.25 + rnd() * 0.3);
    const ang = (rnd() > 0.5 ? 1 : -1) * (0.35 + rnd() * 0.4);
    const w0 = widthAt(k / N) * 0.75;
    const M = 12;
    const up: Pt[] = [], lo: Pt[] = [];
    for (let i = 0; i <= M; i++) {
      const t = i / M;
      const cx = fx + dir * Math.cos(ang) * forkLen * t;
      const cy = fy + Math.sin(ang) * forkLen * t + Math.sin(t * Math.PI) * 10;
      const w = (w0 * Math.pow(1 - t, 1.1)) / 2;
      up.push([cx, cy - w]);
      lo.push([cx, cy + w]);
    }
    paths.push(toPath([...up, ...lo.reverse()]));
  }
  return paths;
}

function toPath(pts: Pt[]) {
  // smooth with quadratic midpoints
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const mx = (pts[i][0] + pts[i + 1][0]) / 2;
    const my = (pts[i][1] + pts[i + 1][1]) / 2;
    d += `Q${pts[i][0].toFixed(1)} ${pts[i][1].toFixed(1)} ${mx.toFixed(1)} ${my.toFixed(1)}`;
  }
  return d + "Z";
}

export function stripeSet(side: "left" | "right", seed: number, W = 1440, H = 900, count = 9) {
  const rnd = mulberry32(seed);
  const dir = side === "left" ? 1 : -1;
  const x0 = side === "left" ? -60 : W + 60;
  const scale = Math.min(1, W / 900); // thinner blades on narrow canvases
  const out: string[] = [];
  for (let i = 0; i < count; i++) {
    const y = ((i + 0.5) / count) * H + (rnd() - 0.5) * 60;
    const len = W * (scale < 1 ? 0.35 + rnd() * 0.3 : 0.22 + rnd() * 0.3);
    const thick = (46 + rnd() * 52) * Math.max(0.6, scale);
    out.push(...blade(rnd, x0, y, dir as 1 | -1, len, thick));
  }
  return out;
}
