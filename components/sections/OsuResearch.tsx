"use client";

import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { osuResearch as r } from "@/content/site";
import { CountUp, Reveal, ScaleMarker, SimBadge } from "@/components/ui/primitives";

type Play = "run" | "pass";

/** Offense (O) and defense (X) positions on a 400×260 board, line of scrimmage at y=150. */
const OFFENSE: [number, number][] = [[140, 160], [170, 160], [200, 160], [230, 160], [260, 160], [200, 185], [200, 215], [60, 160], [340, 165], [290, 168]];
const DEFENSE: [number, number][] = [[150, 135], [185, 135], [215, 135], [250, 135], [130, 110], [200, 105], [270, 110], [70, 95], [330, 95], [160, 55], [250, 55]];

const ROUTES: Record<Play, string[]> = {
  run: [
    "M200 215 C 205 190, 230 165, 250 130 S 262 80, 270 50",
    "M230 160 L 250 140", "M260 160 L 282 138", "M200 160 L 205 138", "M170 160 L 160 140",
    "M60 160 L 60 120 L 90 95",
  ],
  pass: [
    "M60 160 L 60 70 L 30 40",
    "M340 165 L 340 100 L 260 80",
    "M290 168 L 300 120 L 360 110",
    "M200 215 L 200 230",
    "M200 185 C 150 190, 120 175, 110 140",
  ],
};

function PlayBoard({ play }: { play: Play }) {
  const reduce = useReducedMotion();
  return (
    <svg viewBox="0 0 400 260" className="h-full w-full" role="img" aria-label={`Illustrative ${play} play diagram`}>
      {/* yard lines */}
      {[40, 80, 120, 160, 200, 240].map((y) => (
        <line key={y} x1="0" x2="400" y1={y - 10} y2={y - 10} stroke="rgba(255,255,255,.07)" />
      ))}
      {Array.from({ length: 40 }).map((_, i) => (
        <g key={i} stroke="rgba(255,255,255,.08)">
          <line x1={i * 10 + 5} x2={i * 10 + 5} y1="0" y2="4" />
          <line x1={i * 10 + 5} x2={i * 10 + 5} y1="256" y2="260" />
        </g>
      ))}
      <line x1="0" x2="400" y1="148" y2="148" stroke="rgba(167,177,183,.45)" strokeDasharray="4 5" />
      {/* routes */}
      {ROUTES[play].map((d, i) => (
        <motion.path
          key={`${play}-${i}`}
          d={d}
          fill="none"
          stroke={i === 0 ? "#ff3355" : "#e9ecef"}
          strokeWidth={i === 0 ? 2.6 : 1.6}
          strokeLinecap="round"
          markerEnd="url(#arrowhead)"
          initial={reduce ? false : { pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.1, delay: 0.15 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
        />
      ))}
      <defs>
        <marker id="arrowhead" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10z" fill="#e9ecef" />
        </marker>
      </defs>
      {/* players */}
      {OFFENSE.map(([x, y], i) => (
        <circle key={`o${i}`} cx={x} cy={y} r="8" fill="none" stroke="#e9ecef" strokeWidth="2" />
      ))}
      {DEFENSE.map(([x, y], i) => (
        <g key={`x${i}`} stroke="#a7b1b7" strokeWidth="2" strokeLinecap="round">
          <line x1={x - 6} x2={x + 6} y1={y - 6} y2={y + 6} />
          <line x1={x + 6} x2={x - 6} y1={y - 6} y2={y + 6} />
        </g>
      ))}
    </svg>
  );
}

export function OsuResearch() {
  const [play, setPlay] = useState<Play>("pass");

  return (
    <section id="research" data-tone="dark" aria-labelledby="osu-title" className="relative overflow-hidden bg-[#141617] text-white">
      {/* scarlet stripe + giant jersey numeral */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="field-lines absolute inset-0 opacity-60" />
        <div className="absolute left-0 top-0 h-full w-2 bg-scarlet" />
        <div className="absolute left-3 top-0 h-full w-px bg-gray-osu/40" />
        <span
          className="absolute -right-6 bottom-[-6rem] select-none text-[clamp(16rem,38vw,32rem)] font-black italic leading-none tracking-[-0.06em] text-transparent"
          style={{ WebkitTextStroke: "2px rgba(186,12,47,.35)" }}
        >
          73
        </span>
      </div>

      <div className="relative mx-auto max-w-6xl px-5 py-28 sm:px-8">
        <ScaleMarker index="03" scale="Stadium" tone="light" />

        <div className="mt-10 grid gap-14 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <Reveal>
              <div className="label flex items-center gap-3 text-[11px] text-gray-osu">
                <span className="inline-block h-3 w-3 bg-scarlet" />
                Research &amp; learning / Ohio State Athletics
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 id="osu-title" className="mt-6 font-serif text-[clamp(2.6rem,5.4vw,4.4rem)] leading-[0.98] tracking-tight">
                Reading the playbook <em className="text-[#ff3355]">before the snap.</em>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-lg text-[16px] leading-relaxed text-white/70">{r.intro}</p>
              <p className="label mt-5 text-[10px] text-white/45">{r.title} · {r.dates}</p>
            </Reveal>

            <div className="mt-10 grid grid-cols-2 gap-6">
              {r.stats.map((s) => (
                <div key={s.label} className="border-t-2 border-scarlet pt-3">
                  <CountUp value={s.value} className="block text-[clamp(2.6rem,5vw,3.6rem)] font-black italic leading-none tracking-tight" />
                  <div className="label mt-2 text-[10px] text-gray-osu">{s.label}</div>
                </div>
              ))}
            </div>

            {/* model comparison */}
            <Reveal delay={0.1} className="mt-10">
              <div className="label mb-4 text-[10px] text-gray-osu">Run vs. pass prediction accuracy</div>
              {[
                { name: r.model.baselineName, v: r.model.baseline, c: "bg-gray-osu/60" },
                { name: r.model.name, v: r.model.result, c: "bg-scarlet" },
              ].map((m) => (
                <div key={m.name} className="mb-3 grid grid-cols-[8.5rem_1fr_3rem] items-center gap-3 text-[13px]">
                  <span className="text-white/70">{m.name}</span>
                  <span className="h-3 overflow-hidden rounded-sm bg-white/5">
                    <motion.span
                      className={`block h-full ${m.c}`}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${m.v}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </span>
                  <span className="text-right font-mono">{m.v}%</span>
                </div>
              ))}
              <p className="mt-2 text-[13px] text-white/55">
                <span className="font-semibold text-white">+11 points</span> over the logistic-regression baseline.
              </p>
            </Reveal>
          </div>

          {/* chalkboard */}
          <Reveal delay={0.15}>
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d0f10] shadow-2xl">
              <div className="flex items-center justify-between bg-scarlet px-4 py-2.5">
                <span className="label text-[10px] font-semibold text-white">Tendency board</span>
                <div role="tablist" aria-label="Play type" className="flex rounded-full bg-black/25 p-0.5">
                  {(["pass", "run"] as Play[]).map((p) => (
                    <button
                      key={p}
                      role="tab"
                      aria-selected={play === p}
                      onClick={() => setPlay(p)}
                      className={`label rounded-full px-3 py-1 text-[10px] transition-colors ${play === p ? "bg-white text-scarlet" : "text-white/80"}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div className="aspect-[400/260] p-3">
                <PlayBoard play={play} />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-4 py-3">
                <SimBadge className="text-gray-osu">Illustrative diagram — not real play data</SimBadge>
                <span className="font-mono text-[11px] text-white/45">O offense · X defense</span>
              </div>
            </div>

            {/* pipeline */}
            <ol className="mt-6 flex flex-wrap items-center gap-2 font-mono text-[11.5px]">
              {r.pipeline.map((s, i) => (
                <li key={s} className="flex items-center gap-2">
                  <span className={`rounded-md border px-2.5 py-1 ${i === r.pipeline.length - 1 ? "border-scarlet bg-scarlet/15 text-white" : "border-white/15 text-white/70"}`}>{s}</span>
                  {i < r.pipeline.length - 1 && <span className="text-scarlet">→</span>}
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
