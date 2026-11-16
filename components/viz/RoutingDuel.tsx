"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Lane, makeWorkload, SIM, type Policy } from "@/lib/inferenceSim";
import { Icon, SimBadge } from "@/components/ui/primitives";

const color = (p: number) => `hsl(${(p * 137.5) % 360} 75% 64%)`;
const LANES: { policy: Policy; title: string; sub: string }[] = [
  { policy: "round_robin", title: "Round-robin", sub: "baseline · ignores cache & load" },
  { policy: "prefix_aware", title: "Prefix-aware + load", sub: "llmserve policy · home worker per prompt" },
];
const DURATION = 22000;

type Stats = ReturnType<Lane["stats"]>;

function drawLane(ctx: CanvasRenderingContext2D, w: number, h: number, lane: Lane, now: number) {
  ctx.clearRect(0, 0, w, h);
  const routerX = w * 0.3, routerY = h / 2;
  const clientX = w * 0.05;
  const wx = w * 0.56, ww = w * 0.4;
  const rowH = h / SIM.workers;

  // wires
  ctx.strokeStyle = "rgba(124,108,255,.18)";
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(clientX, routerY); ctx.lineTo(routerX - 34, routerY); ctx.stroke();
  for (let i = 0; i < SIM.workers; i++) {
    const y = rowH * i + rowH / 2;
    ctx.beginPath();
    ctx.moveTo(routerX + 34, routerY);
    ctx.bezierCurveTo(routerX + 90, routerY, wx - 60, y, wx, y);
    ctx.stroke();
  }

  // clients
  ctx.fillStyle = "rgba(255,255,255,.45)";
  ctx.font = "10px var(--font-geist-mono), monospace";
  ctx.textAlign = "left";
  ctx.fillText("clients", clientX - 4, routerY - 12);

  // particles
  for (const ev of lane.events) {
    const age = now - ev.at;
    if (age > 700) continue;
    const r = ev.req;
    if (ev.kind === "shed") {
      const k = age / 700;
      ctx.fillStyle = `rgba(255,90,90,${1 - k})`;
      ctx.beginPath(); ctx.arc(routerX - 40 - k * 60, routerY - k * 30, 3, 0, 7); ctx.fill();
      ctx.fillText("429", routerX - 52 - k * 60, routerY - 10 - k * 30);
      continue;
    }
    const y = rowH * r.worker! + rowH / 2;
    const k = Math.min(1, age / 420);
    const e = 1 - Math.pow(1 - k, 3);
    const t = e;
    const x0 = routerX + 34, x3 = wx;
    const bx = (1 - t) ** 3 * x0 + 3 * (1 - t) ** 2 * t * (x0 + 56) + 3 * (1 - t) * t * t * (x3 - 60) + t ** 3 * x3;
    const by = (1 - t) ** 3 * routerY + 3 * (1 - t) ** 2 * t * routerY + 3 * (1 - t) * t * t * y + t ** 3 * y;
    if (k < 1) {
      ctx.fillStyle = color(r.prefix);
      ctx.shadowColor = color(r.prefix); ctx.shadowBlur = 8;
      ctx.beginPath(); ctx.arc(bx, by, 3, 0, 7); ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  // router
  ctx.fillStyle = "#171827";
  ctx.strokeStyle = "rgba(124,108,255,.7)";
  ctx.lineWidth = 1;
  roundRect(ctx, routerX - 34, routerY - 18, 68, 36, 8);
  ctx.fill(); ctx.stroke();
  ctx.fillStyle = "#e7e5ff";
  ctx.textAlign = "center";
  ctx.font = "11px var(--font-geist-sans), sans-serif";
  ctx.fillText("router", routerX, routerY + 4);

  // workers
  lane.workers.forEach((wk, i) => {
    const y = rowH * i + 6, bh = rowH - 12;
    ctx.fillStyle = "#12131c";
    ctx.strokeStyle = "rgba(255,255,255,.08)";
    roundRect(ctx, wx, y, ww, bh, 8); ctx.fill(); ctx.stroke();
    ctx.textAlign = "left";
    ctx.fillStyle = "rgba(255,255,255,.55)";
    ctx.font = "10px var(--font-geist-mono), monospace";
    ctx.fillText(`gpu${i}`, wx + 8, y + 14);

    // slots
    const sw = Math.min(16, (ww - 60) / 12);
    for (let s = 0; s < SIM.slots; s++) {
      const r = wk.active[s];
      ctx.fillStyle = r ? color(r.prefix) : "rgba(255,255,255,.06)";
      roundRect(ctx, wx + 44 + s * (sw + 3), y + 5, sw, 11, 2); ctx.fill();
    }
    // queue
    const qx = wx + 44 + SIM.slots * (sw + 3) + 8;
    const maxQ = Math.floor((wx + ww - 8 - qx) / 6);
    wk.queue.slice(0, maxQ).forEach((r, q) => {
      ctx.fillStyle = color(r.prefix);
      ctx.globalAlpha = 0.65;
      ctx.beginPath(); ctx.arc(qx + q * 6, y + 10.5, 2.2, 0, 7); ctx.fill();
      ctx.globalAlpha = 1;
    });
    if (wk.queue.length > maxQ) {
      ctx.fillStyle = "#ff8a7a";
      ctx.fillText(`+${wk.queue.length - maxQ}`, wx + ww - 26, y + 14);
    }
    // cache chips
    if (bh > 30) {
      ctx.fillStyle = "rgba(255,255,255,.3)";
      ctx.fillText("kv$", wx + 8, y + bh - 6);
      wk.cache.forEach((p, c) => {
        ctx.fillStyle = color(p);
        ctx.globalAlpha = 0.85;
        roundRect(ctx, wx + 44 + c * 12, y + bh - 14, 9, 9, 2); ctx.fill();
        ctx.globalAlpha = 1;
      });
    }
  });
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export function RoutingDuel() {
  const canvases = useRef<(HTMLCanvasElement | null)[]>([]);
  const lanes = useRef<Lane[]>([]);
  const clock = useRef({ start: 0, running: false });
  const raf = useRef(0);
  const [rps, setRps] = useState(10);
  const [admission, setAdmission] = useState(false);
  const [state, setState] = useState<"idle" | "running" | "done">("idle");
  const [stats, setStats] = useState<Stats[]>([]);
  const [elapsed, setElapsed] = useState(0);

  const setup = useCallback((rate: number, adm: boolean, seed = Math.floor(Math.random() * 1e6)) => {
    const wl = makeWorkload(rate, DURATION, seed);
    lanes.current = LANES.map((l) => new Lane(l.policy, wl, adm));
  }, []);

  const loop = useCallback((t: number) => {
    const c = clock.current;
    const now = c.running ? t - c.start : 0;
    lanes.current.forEach((lane, i) => {
      if (c.running) lane.step(now);
      const cv = canvases.current[i];
      if (!cv) return;
      const ctx = cv.getContext("2d")!;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      const r = cv.getBoundingClientRect();
      if (cv.width !== Math.round(r.width * dpr)) { cv.width = r.width * dpr; cv.height = r.height * dpr; }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawLane(ctx, r.width, r.height, lane, now);
    });
    if (c.running) {
      if (Math.floor(now / 250) !== Math.floor((now - 16) / 250)) {
        setStats(lanes.current.map((l) => l.stats()));
        setElapsed(Math.min(now, DURATION));
      }
      if (lanes.current.every((l) => l.finished)) {
        c.running = false;
        setStats(lanes.current.map((l) => l.stats()));
        setState("done");
      }
    }
    raf.current = requestAnimationFrame(loop);
  }, []);

  useEffect(() => {
    setup(10, false, 7);
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, [setup, loop]);

  const run = () => {
    setup(rps, admission);
    clock.current = { start: performance.now(), running: true };
    setStats([]);
    setElapsed(0);
    setState("running");
  };

  const s0 = stats[0], s1 = stats[1];
  const delta = s0 && s1 && s0.p95 > 0 ? Math.round(((s1.p95 - s0.p95) / s0.p95) * 100) : null;

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-panel shadow-[0_40px_120px_-40px_rgba(124,108,255,.35)]">
      {/* toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-4 py-3 sm:px-5">
        <div className="flex items-center gap-3">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-violet/20 text-violet"><Icon name="bolt" className="h-4 w-4" /></span>
          <span className="text-[14px] font-medium text-white">Routing lab</span>
          <SimBadge className="text-amber-300/90">Simulation · illustrative</SimBadge>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-3 font-mono text-[11px] text-white/60">
            load
            <input
              type="range" min={5} max={16} value={rps}
              onChange={(e) => setRps(+e.target.value)}
              disabled={state === "running"}
              className="w-24 accent-[#7c6cff]"
              aria-label="Requests per second"
            />
            <span className="w-12 text-white">{rps} rps</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2 font-mono text-[11px] text-white/60">
            <input type="checkbox" checked={admission} onChange={(e) => setAdmission(e.target.checked)} disabled={state === "running"} className="accent-[#7c6cff]" />
            admission (SLO {SIM.slo} ms)
          </label>
          <button
            onClick={run}
            disabled={state === "running"}
            className="inline-flex items-center gap-2 rounded-full bg-violet px-4 py-2 text-[13px] font-medium text-white transition hover:brightness-110 disabled:opacity-50"
          >
            <Icon name={state === "done" ? "reset" : "play"} className="h-3.5 w-3.5" />
            {state === "idle" ? "Run workload" : state === "running" ? "Running…" : "Run again"}
          </button>
        </div>
      </div>

      {/* progress */}
      <div className="h-px bg-white/5">
        <div className="h-px bg-violet transition-[width] duration-200" style={{ width: `${(elapsed / DURATION) * 100}%` }} />
      </div>

      <div className="grid divide-y divide-white/10">
        {LANES.map((l, i) => {
          const s = stats[i];
          return (
            <div key={l.policy} className="grid gap-4 p-4 sm:p-5 lg:grid-cols-[1fr_15rem]">
              <div>
                <div className="mb-2 flex items-baseline gap-3">
                  <span className={`text-[14px] font-medium ${i ? "text-mint" : "text-white/80"}`}>{l.title}</span>
                  <span className="font-mono text-[11px] text-white/40">{l.sub}</span>
                </div>
                <canvas ref={(el) => { canvases.current[i] = el; }} className="h-[190px] w-full sm:h-[210px]" aria-label={`${l.title} lane visualization`} />
              </div>
              <dl className="grid grid-cols-2 gap-px self-center overflow-hidden rounded-xl bg-white/10 text-white">
                {[
                  { k: "TTFT p95", v: s ? `${Math.round(s.p95)} ms` : "—" },
                  { k: "Cache hit", v: s ? `${Math.round(s.hitRate * 100)}%` : "—" },
                  { k: "Served", v: s ? s.served : "—" },
                  { k: admission ? "Shed (429)" : "Queued", v: s ? (admission ? s.shed : s.queued) : "—" },
                ].map((m) => (
                  <div key={m.k} className="bg-panel p-3">
                    <dt className="font-mono text-[10px] uppercase tracking-wider text-white/40">{m.k}</dt>
                    <dd className={`mt-1 font-mono text-[18px] ${i ? "text-mint" : ""}`}>{m.v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-4 py-3 text-[12.5px] text-white/55 sm:px-5" aria-live="polite">
        <span>
          {state === "idle" && "Same Poisson workload, same seed, two routers. Colours are shared system prompts; squares under each GPU are its KV prefix cache."}
          {state === "running" && "Watch round-robin scatter each prompt across every GPU while prefix-aware keeps them home."}
          {state === "done" && delta !== null && (
            <>This run: prefix-aware p95 TTFT <span className="font-semibold text-mint">{delta > 0 ? "+" : ""}{delta}%</span> vs round-robin. Try another load, or turn on admission control to shed instead of queue.</>
          )}
        </span>
        <span className="font-mono text-[11px] text-white/35">{SIM.workers} workers × {SIM.slots} slots</span>
      </div>
    </div>
  );
}
