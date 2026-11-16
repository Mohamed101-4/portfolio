"use client";

import { motion } from "motion/react";
import { buckeyePlanner as b } from "@/content/site";
import { CountUp, Reveal, ScaleMarker, SimBadge } from "@/components/ui/primitives";

/** Conceptual planner preview: progress ring + a prerequisite chain. Not a screenshot. */
function PlannerPreview() {
  const chain = [
    { code: "CSE 2221", done: true },
    { code: "CSE 2231", done: true },
    { code: "CSE 2421", done: true },
    { code: "CSE 3461", next: true },
  ];
  const pct = 0.68;
  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-[0_30px_80px_-40px_rgba(0,0,0,.35)]">
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-semibold">Degree progress</span>
        <SimBadge className="text-ink/45">Conceptual preview</SimBadge>
      </div>
      <div className="mt-5 flex items-center gap-4 sm:gap-6">
        <svg viewBox="0 0 100 100" className="h-20 w-20 shrink-0 -rotate-90 sm:h-28 sm:w-28" aria-hidden>
          <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(18,18,18,.07)" strokeWidth="9" />
          <motion.circle
            cx="50" cy="50" r="42" fill="none" stroke="#ba0c2f" strokeWidth="9" strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 42}
            initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
            whileInView={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - pct) }}
            viewport={{ once: true }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          />
        </svg>
        <div className="min-w-0 space-y-2 text-[12px] sm:text-[12.5px]">
          {[
            { k: "Core", v: "complete", c: "bg-emerald-500" },
            { k: "Math & science", v: "on track", c: "bg-emerald-500" },
            { k: "Technical electives", v: "2 remaining", c: "bg-amber-400" },
            { k: "Prerequisites", v: "validated", c: "bg-emerald-500" },
          ].map((r) => (
            <div key={r.k} className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${r.c}`} />
              <span className="w-28 text-ink/60 sm:w-32">{r.k}</span>
              <span className="font-medium">{r.v}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6 border-t border-ink/10 pt-4">
        <div className="label mb-3 text-[9.5px] text-ink/45">Prerequisite path</div>
        <ol className="flex flex-wrap items-center gap-1.5 font-mono text-[11px]">
          {chain.map((c, i) => (
            <li key={c.code} className="flex items-center gap-1.5">
              <span className={`rounded-md px-2 py-1 ${c.next ? "bg-scarlet text-white" : "bg-ink/5 text-ink/70"}`}>
                {c.code}{c.done ? " ✓" : ""}
              </span>
              {i < chain.length - 1 && <span className="text-ink/30">→</span>}
            </li>
          ))}
        </ol>
        <p className="mt-3 text-[12px] text-ink/55">Recommended next: unlocks networking electives.</p>
      </div>
    </div>
  );
}

export function AlsoBuilt() {
  return (
    <section id="buckeyeplanner" data-tone="light" aria-labelledby="bp-title" className="grain relative bg-paper">
      <div className="relative z-[2] mx-auto max-w-6xl px-5 py-24 sm:px-8">
        <ScaleMarker index="07" scale="Campus" tone="ink" />
        <div className="mt-10 grid items-center gap-12 lg:grid-cols-[1.2fr_1fr]">
          <div className="min-w-0">
            <Reveal>
              <p className="font-serif text-[clamp(1.6rem,3vw,2.3rem)] leading-[1.15] tracking-tight text-ink-2">
                I also built <span id="bp-title" className="text-ink">{b.name}</span> — a degree audit platform for Ohio State.
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <div className="mt-8">
                <CountUp value={b.scale} className="block font-serif text-[clamp(3.6rem,17vw,10.5rem)] leading-[0.9] tracking-[-0.04em]" />
                <span className="label mt-3 block text-[11px] text-ink-2">{b.scaleLabel}</span>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-ink-2">{b.summary}</p>
              <dl className="mt-8 grid max-w-lg grid-cols-3 border-t border-ink/15">
                {b.metrics.map((m) => (
                  <div key={m.label} className="border-r border-ink/15 py-4 pr-4 last:border-0 [&:not(:first-child)]:pl-4">
                    <dt className="sr-only">{m.label}</dt>
                    <dd>
                      <span className="block font-serif text-[2.2rem] leading-none">{m.value}</span>
                      <span className="mt-1 block text-[12px] text-ink/55">{m.label}</span>
                    </dd>
                  </div>
                ))}
              </dl>
              <div className="mt-4 flex flex-wrap gap-2">
                {b.stack.map((s) => (
                  <span key={s} className="rounded-full border border-ink/15 px-3 py-1 font-mono text-[11px] text-ink/60">{s}</span>
                ))}
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.15} className="min-w-0"><PlannerPreview /></Reveal>
        </div>
      </div>
    </section>
  );
}
