/**
 * Tiny, illustrative serving simulator used by the portfolio's routing demo.
 * It mirrors the *ideas* in llmserve (shared-prefix workload, prefix cache per worker,
 * rendezvous-hash home workers, TTFT-based admission) — it is not the real system
 * and its numbers are not benchmarks.
 */

export type Policy = "round_robin" | "prefix_aware";

export type Req = {
  id: number;
  t: number; // arrival (ms)
  prefix: number;
  decode: number; // decode duration (ms)
  worker?: number;
  start?: number;
  end?: number;
  ttft?: number;
  hit?: boolean;
  shed?: boolean;
  assignedAt?: number;
};

export const SIM = {
  workers: 4,
  slots: 4,
  prefixes: 24,
  cacheSize: 5,
  prefillMiss: 520,
  prefillHit: 60,
  slo: 1600,
};

/** Seeded PRNG so both lanes see an identical workload. */
export function mulberry32(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function makeWorkload(rps: number, durationMs: number, seed = 7): Req[] {
  const rnd = mulberry32(seed);
  // Zipf popularity over shared system prompts
  const weights = Array.from({ length: SIM.prefixes }, (_, i) => 1 / Math.pow(i + 1, 0.9));
  const total = weights.reduce((a, b) => a + b, 0);
  const pick = () => {
    let x = rnd() * total;
    for (let i = 0; i < weights.length; i++) { x -= weights[i]; if (x <= 0) return i; }
    return weights.length - 1;
  };
  const out: Req[] = [];
  let t = 0, id = 0;
  while (true) {
    t += -Math.log(1 - rnd()) * (1000 / rps); // Poisson arrivals
    if (t > durationMs) break;
    out.push({ id: id++, t, prefix: pick(), decode: 700 + rnd() * 1500 });
  }
  return out;
}

function hash(a: number, b: number) {
  let h = (a * 374761393 + b * 668265263) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return (h ^ (h >>> 16)) >>> 0;
}

type Worker = { active: Req[]; queue: Req[]; cache: number[] };

export class Lane {
  policy: Policy;
  admission: boolean;
  workers: Worker[];
  rr = 0;
  pending: Req[];
  done: Req[] = [];
  shed: Req[] = [];
  events: { kind: "assign" | "shed"; req: Req; at: number }[] = [];
  ewma = 1500;

  constructor(policy: Policy, workload: Req[], admission: boolean) {
    this.policy = policy;
    this.admission = admission;
    this.pending = workload.map((r) => ({ ...r }));
    this.workers = Array.from({ length: SIM.workers }, () => ({ active: [], queue: [], cache: [] }));
  }

  load(w: Worker) { return w.active.length + w.queue.length; }

  choose(req: Req): number {
    if (this.policy === "round_robin") return this.rr++ % SIM.workers;
    // prefix-aware: rendezvous-hash home worker gets a bonus worth 2 load units
    let home = 0, best = -1;
    for (let i = 0; i < SIM.workers; i++) {
      const h = hash(req.prefix, i);
      if (h > best) { best = h; home = i; }
    }
    let pickIdx = 0, score = Infinity;
    this.workers.forEach((w, i) => {
      const s = this.load(w) - (i === home ? 2 : 0) - (w.cache.includes(req.prefix) ? 1 : 0);
      if (s < score) { score = s; pickIdx = i; }
    });
    return pickIdx;
  }

  estimateTTFT(w: Worker, req: Req) {
    const ahead = Math.max(0, w.active.length + w.queue.length - SIM.slots + 1);
    const wait = (ahead / SIM.slots) * this.ewma;
    return wait + (w.cache.includes(req.prefix) ? SIM.prefillHit : SIM.prefillMiss);
  }

  step(now: number) {
    // arrivals
    while (this.pending.length && this.pending[0].t <= now) {
      const req = this.pending.shift()!;
      const wi = this.choose(req);
      const w = this.workers[wi];
      if (this.admission && this.estimateTTFT(w, req) > SIM.slo) {
        req.shed = true;
        this.shed.push(req);
        this.events.push({ kind: "shed", req, at: now });
        continue;
      }
      req.worker = wi;
      req.assignedAt = now;
      w.queue.push(req);
      this.events.push({ kind: "assign", req, at: now });
    }
    // service
    for (const w of this.workers) {
      for (let i = w.active.length - 1; i >= 0; i--) {
        if (w.active[i].end! <= now) {
          const r = w.active.splice(i, 1)[0];
          this.ewma = this.ewma * 0.9 + (r.end! - r.start!) * 0.1;
          this.done.push(r);
        }
      }
      while (w.active.length < SIM.slots && w.queue.length) {
        const r = w.queue.shift()!;
        const hit = w.cache.includes(r.prefix);
        const prefill = hit ? SIM.prefillHit : SIM.prefillMiss;
        // LRU update
        w.cache = [r.prefix, ...w.cache.filter((p) => p !== r.prefix)].slice(0, SIM.cacheSize);
        r.start = Math.max(now, r.t);
        r.hit = hit;
        r.ttft = r.start + prefill - r.t;
        r.end = r.start + prefill + r.decode;
        w.active.push(r);
      }
    }
  }

  stats() {
    const served = [...this.done, ...this.workers.flatMap((w) => w.active)].filter((r) => r.ttft !== undefined);
    const ttfts = served.map((r) => r.ttft!).sort((a, b) => a - b);
    const p = (q: number) => (ttfts.length ? ttfts[Math.min(ttfts.length - 1, Math.floor(q * ttfts.length))] : 0);
    const hits = served.filter((r) => r.hit).length;
    return {
      p50: p(0.5),
      p95: p(0.95),
      hitRate: served.length ? hits / served.length : 0,
      served: served.length,
      shed: this.shed.length,
      queued: this.workers.reduce((a, w) => a + w.queue.length, 0),
    };
  }

  get finished() {
    return !this.pending.length && this.workers.every((w) => !w.active.length && !w.queue.length);
  }
}
