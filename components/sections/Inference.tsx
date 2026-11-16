"use client";

import dynamic from "next/dynamic";
import { inference as p } from "@/content/site";
import { Icon, Reveal, RevealWords, ScaleMarker, SimBadge } from "@/components/ui/primitives";

const RoutingDuel = dynamic(() => import("@/components/viz/RoutingDuel").then((m) => m.RoutingDuel), {
  ssr: false,
  loading: () => <div className="h-[560px] animate-pulse rounded-2xl border border-white/10 bg-panel" />,
});

export function Inference() {
  return (
    <section id="inference" data-tone="dark" aria-labelledby="inf-title" className="relative overflow-hidden bg-graphite text-white">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="dot-grid absolute inset-0 text-white/[0.05]" />
        <div className="absolute left-1/2 top-0 h-[600px] w-[1100px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(124,108,255,.18),transparent)]" />
      </div>

      <div id="projects" className="relative mx-auto max-w-6xl px-5 py-28 sm:px-8">
        <ScaleMarker index="05" scale="Cluster" tone="light" />

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-end">
          <div>
            <Reveal>
              <div className="label flex items-center gap-3 text-[11px] text-white/55">
                <span className="rounded-md bg-violet/20 px-2 py-0.5 font-mono normal-case tracking-normal text-violet">{p.name}</span>
                Featured project
              </div>
            </Reveal>
            <h2 id="inf-title" className="mt-6 font-sans text-[clamp(2.6rem,5.8vw,4.8rem)] font-semibold leading-[0.95] tracking-[-0.04em]">
              <RevealWords text={p.headline.a} />{" "}
              <span className="font-serif font-normal italic text-violet"><RevealWords text={p.headline.em} delay={0.15} /></span>
            </h2>
            <p className="label mt-4 text-[11px] text-white/45">{p.title}</p>
          </div>
          <Reveal delay={0.1}>
            <p className="text-[15.5px] leading-relaxed text-white/65">{p.summary}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a href={p.repo} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[13px] font-medium text-graphite transition hover:bg-violet hover:text-white">
                <Icon name="github" className="h-4 w-4" /> Source
              </a>
              <a href={p.results} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-[13px] transition hover:border-white">
                Benchmarks <Icon name="arrowUpRight" className="h-3.5 w-3.5" />
              </a>
            </div>
          </Reveal>
        </div>

        {/* architecture strip */}
        <Reveal delay={0.05} className="mt-14">
          <div className="no-scrollbar -mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
            <ol className="flex min-w-[760px] items-stretch gap-2 font-mono text-[11.5px]">
              {[
                { k: "Load gen", v: "Poisson · shared prefixes" },
                { k: "Admission", v: "TTFT estimate vs SLO → 429" },
                { k: "Router", v: "round_robin · least_load · prefix_aware" },
                { k: "Prefill pool", v: "KV transfer params" },
                { k: "Decode pool", v: "vLLM workers · paged KV" },
                { k: "Telemetry", v: "Prometheus · OTel · Grafana" },
              ].map((s, i, a) => (
                <li key={s.k} className="flex flex-1 items-center gap-2">
                  <div className={`flex-1 rounded-xl border p-3 ${i === 2 ? "border-violet/60 bg-violet/10" : "border-white/10 bg-white/[0.02]"}`}>
                    <div className={i === 2 ? "text-violet" : "text-white"}>{s.k}</div>
                    <div className="mt-1 text-[10.5px] leading-snug text-white/45">{s.v}</div>
                  </div>
                  {i < a.length - 1 && <span className="text-white/25">→</span>}
                </li>
              ))}
            </ol>
          </div>
        </Reveal>

        {/* simulator */}
        <div className="mt-8">
          <RoutingDuel />
        </div>

        {/* measured results */}
        <div className="mt-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <Reveal>
              <h3 className="font-serif text-[clamp(2rem,3.6vw,2.8rem)] leading-tight">
                Measured, <em className="text-mint">not imagined.</em>
              </h3>
            </Reveal>
            <SimBadge className="text-mint">From RESULTS.md · each with its setup</SimBadge>
          </div>
          <div className="mt-8 grid gap-px overflow-hidden rounded-2xl bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {p.metrics.map((m, i) => (
              <Reveal key={m.label} delay={i * 0.06} className="bg-graphite p-6">
                <div className="font-sans text-[clamp(2.6rem,4.4vw,3.4rem)] font-semibold leading-none tracking-tight text-white">{m.value}</div>
                <div className="mt-3 text-[14px] text-white/80">{m.label}</div>
                <div className="mt-2 font-mono text-[10.5px] leading-relaxed text-white/40">{m.context}</div>
              </Reveal>
            ))}
          </div>
          <p className="mt-4 max-w-3xl text-[12.5px] text-white/40">{p.caveat}</p>
        </div>

        {/* features */}
        <ul className="mt-16 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {p.features.map((f, i) => (
            <Reveal as="li" key={f.title} delay={(i % 3) * 0.06} className="border-t border-white/10 pt-5">
              <div className="flex items-center gap-2 text-[15px] font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-violet" /> {f.title}
              </div>
              <p className="mt-2 text-[13.5px] leading-relaxed text-white/55">{f.body}</p>
            </Reveal>
          ))}
        </ul>

        <div className="mt-12 flex flex-wrap gap-2">
          {p.stack.map((s) => (
            <span key={s} className="rounded-full border border-white/10 px-3 py-1 font-mono text-[11px] text-white/55">{s}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
