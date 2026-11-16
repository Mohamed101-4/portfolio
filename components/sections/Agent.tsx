"use client";

import dynamic from "next/dynamic";
import { agent as p } from "@/content/site";
import { Icon, Reveal, RevealWords, ScaleMarker } from "@/components/ui/primitives";

const AgentIDE = dynamic(() => import("@/components/viz/AgentIDE").then((m) => m.AgentIDE), {
  ssr: false,
  loading: () => <div className="h-[620px] animate-pulse rounded-2xl border border-ink/10 bg-white" />,
});

export function Agent() {
  return (
    <section id="agent" data-tone="light" aria-labelledby="agent-title" className="relative overflow-hidden bg-[#eef0f7] text-ink">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-20 h-[500px] w-[700px] rounded-full bg-[radial-gradient(closest-side,rgba(109,94,245,.16),transparent)]" />
        <div className="absolute -right-40 bottom-0 h-[500px] w-[700px] rounded-full bg-[radial-gradient(closest-side,rgba(14,165,164,.14),transparent)]" />
        <svg className="absolute inset-0 h-full w-full opacity-[0.35]" aria-hidden>
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M40 0H0V40" fill="none" stroke="rgba(18,18,18,.06)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative mx-auto max-w-6xl px-5 py-28 sm:px-8">
        <ScaleMarker index="06" scale="Codebase" tone="ink" />

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <div>
            <Reveal>
              <div className="label flex items-center gap-3 text-[11px] text-ink/55">
                <span className="rounded-md bg-[#6D5EF5]/10 px-2 py-0.5 font-mono normal-case tracking-normal text-[#6D5EF5]">{p.name}</span>
                Featured project
              </div>
            </Reveal>
            <h2 id="agent-title" className="mt-6 font-serif text-[clamp(2.8rem,6vw,5rem)] leading-[0.95] tracking-tight">
              <RevealWords text={p.headline.a} />{" "}
              <em className="bg-gradient-to-r from-[#6D5EF5] via-[#0EA5A4] to-[#2B8A3E] bg-clip-text text-transparent">
                <RevealWords text={p.headline.em} delay={0.15} />
              </em>
            </h2>
            <p className="label mt-4 text-[11px] text-ink/45">{p.title}</p>
          </div>
          <Reveal delay={0.1}>
            <p className="text-[15.5px] leading-relaxed text-ink/70">{p.summary}</p>
            <a href={p.repo} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-[13px] font-medium text-white transition hover:bg-[#6D5EF5]">
              <Icon name="github" className="h-4 w-4" /> Source
            </a>
          </Reveal>
        </div>

        <div className="mt-14">
          <AgentIDE />
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <div className="label mb-4 text-[10.5px] text-ink/50">Verified in the repository</div>
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-ink/10 lg:grid-cols-4">
              {p.facts.map((f, i) => (
                <Reveal key={f.label} delay={i * 0.05} className="bg-[#f6f7fb] p-5">
                  <div className="font-serif text-[2.6rem] leading-none">{f.value}</div>
                  <div className="mt-2 text-[12.5px] leading-snug text-ink/60">{f.label}</div>
                </Reveal>
              ))}
            </div>
            <p className="mt-4 text-[12.5px] text-ink/45">{p.caveat}</p>
          </div>
          <div>
            <div className="label mb-4 text-[10.5px] text-ink/50">Sandbox — every patch runs in</div>
            <div className="flex flex-wrap gap-2">
              {p.sandbox.map((s) => (
                <span key={s} className="rounded-lg border border-ink/10 bg-white px-3 py-1.5 font-mono text-[11.5px] text-ink/70">{s}</span>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {p.stack.map((s) => (
                <span key={s} className="rounded-full bg-ink/5 px-3 py-1 font-mono text-[11px] text-ink/60">{s}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
