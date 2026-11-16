"use client";

import { useEffect, useRef } from "react";
import { nvidia as n } from "@/content/site";
import { Reveal, ScaleMarker } from "@/components/ui/primitives";

/**
 * A grid of "streaming multiprocessors". Diagonal waves of work sweep across it;
 * the cursor launches extra ripples. Purely decorative.
 */
function SMGrid() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, raf = 0, visible = true;
    const ripples: { x: number; y: number; t: number }[] = [];
    const CELL = 18, GAP = 4;
    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      const r = c.getBoundingClientRect();
      w = r.width; h = r.height;
      c.width = w * dpr; c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      const cols = Math.ceil(w / (CELL + GAP)), rows = Math.ceil(h / (CELL + GAP));
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const x = i * (CELL + GAP), y = j * (CELL + GAP);
          const wave = Math.max(0, Math.sin((i + j) * 0.35 - t * 0.0022)) ** 6;
          let rip = 0;
          for (const r of ripples) {
            const d = Math.hypot(x - r.x, y - r.y);
            const front = (t - r.t) * 0.35;
            rip = Math.max(rip, Math.max(0, 1 - Math.abs(d - front) / 40) * Math.max(0, 1 - (t - r.t) / 2200));
          }
          const s = (Math.sin(i * 91.7 + j * 47.3) + 1) / 2; // static per-cell variance
          const a = 0.05 + s * 0.05 + wave * 0.55 + rip * 0.9;
          ctx.fillStyle = `rgba(118,185,0,${Math.min(1, a)})`;
          ctx.fillRect(x, y, CELL, CELL);
        }
      }
      while (ripples.length && t - ripples[0].t > 2200) ripples.shift();
      if (!reduce && visible) raf = requestAnimationFrame(draw);
    };
    const onMove = (e: PointerEvent) => {
      const r = c.getBoundingClientRect();
      const now = performance.now();
      if (!ripples.length || now - ripples[ripples.length - 1].t > 260) ripples.push({ x: e.clientX - r.left, y: e.clientY - r.top, t: now });
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !reduce) { cancelAnimationFrame(raf); raf = requestAnimationFrame(draw); }
    });
    resize(); draw(0); io.observe(c);
    window.addEventListener("resize", resize);
    c.addEventListener("pointermove", onMove);
    return () => { cancelAnimationFrame(raf); io.disconnect(); window.removeEventListener("resize", resize); c.removeEventListener("pointermove", onMove); };
  }, []);
  return <canvas ref={ref} aria-hidden className="h-full w-full" />;
}

export function Nvidia() {
  return (
    <section id="nvidia" data-tone="dark" aria-labelledby="nv-title" className="relative overflow-hidden bg-jet text-white">
      {/* angular accent */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -right-40 top-0 h-full w-[60%] skew-x-[-18deg] bg-gradient-to-b from-volt/[0.07] to-transparent" />
        <div className="absolute right-[12%] top-0 h-full w-px skew-x-[-18deg] bg-volt/30" />
      </div>

      <div className="relative mx-auto grid max-w-6xl gap-14 px-5 py-28 sm:px-8 lg:grid-cols-[1fr_1fr]">
        <div>
          <ScaleMarker index="04" scale="Silicon" tone="volt" />
          <Reveal delay={0.05}>
            <div className="label mt-10 flex items-center gap-3 text-[11px] text-white/60">
              <span className="h-0 w-0 border-y-[6px] border-l-[10px] border-y-transparent border-l-volt" />
              {n.org}
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 id="nv-title" className="mt-6 font-sans text-[clamp(2.6rem,5.4vw,4.4rem)] font-semibold leading-[0.98] tracking-[-0.03em]">
              {n.headline.a}{" "}
              <span className="font-serif font-normal italic text-volt">{n.headline.em}</span>
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-6 max-w-md text-[16px] leading-relaxed text-white/65">{n.intro}</p>
            <p className="label mt-5 text-[10px] text-white/40">{n.title} · {n.dates}</p>
          </Reveal>

          <ol className="mt-12 border-t border-white/10">
            {n.topics.map((t, i) => (
              <Reveal as="li" key={t.k} delay={i * 0.08}>
                <div className="group grid grid-cols-[3rem_1fr] gap-4 border-b border-white/10 py-5 transition-colors hover:bg-volt/[0.04]">
                  <span className="font-mono text-[12px] text-volt">{t.k}</span>
                  <div>
                    <div className="text-[17px] font-medium transition-colors group-hover:text-volt">{t.title}</div>
                    <p className="mt-1 text-[13.5px] text-white/55">{t.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>

        <Reveal delay={0.1} className="relative">
          <div className="relative h-full min-h-[420px] overflow-hidden rounded-2xl border border-volt/25 bg-black [clip-path:polygon(0_0,calc(100%-40px)_0,100%_40px,100%_100%,40px_100%,0_calc(100%-40px))]">
            <div className="absolute inset-4"><SMGrid /></div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/85 to-transparent p-6 pt-24">
              <div className="label text-[10px] text-volt">Why it matters</div>
              <p className="mt-2 max-w-sm text-[14px] leading-relaxed text-white/75">
                This is where the inference work started: understanding memory bandwidth, parallelism and
                precision well enough to write my own Triton kernel.
              </p>
            </div>
            <div className="label absolute left-6 top-6 text-[10px] text-white/50">Move across the grid ↘</div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
