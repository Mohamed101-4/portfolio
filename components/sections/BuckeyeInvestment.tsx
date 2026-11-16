"use client";

import { motion } from "motion/react";
import { buckeyeInvestment as b } from "@/content/site";
import { CountUp, Reveal, ScaleMarker } from "@/components/ui/primitives";

/** Before/after bars indexed to 100, derived directly from the reported percentages. */
function IndexBars() {
  const rows = [
    { k: "Manual workflows", after: 60 },
    { k: "Execution time", after: 70 },
    { k: "Recurring incidents", after: 75 },
  ];
  return (
    <div>
      <div className="label mb-3 flex justify-between text-[9.5px] text-forest/60">
        <span>Indexed · before = 100</span>
        <span className="flex gap-4"><span>▪ before</span><span className="text-forest">▪ after</span></span>
      </div>
      {rows.map((r) => (
        <div key={r.k} className="mb-4">
          <div className="mb-1 flex justify-between text-[12.5px]">
            <span>{r.k}</span>
            <span className="font-mono">{r.after}</span>
          </div>
          <div className="relative h-2.5 bg-forest/10">
            <div className="absolute inset-y-0 left-0 w-full bg-forest/15" />
            <motion.div
              className="absolute inset-y-0 left-0 bg-forest"
              initial={{ width: "100%" }}
              whileInView={{ width: `${r.after}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function BuckeyeInvestment() {
  const ticker = [...b.tickers, ...b.tickers];
  return (
    <section id="big" data-tone="light" aria-labelledby="big-title" className="grain relative bg-salmon text-forest">
      {/* ticker tape */}
      <div className="overflow-hidden border-y border-forest/25 bg-forest py-2.5 text-salmon" aria-hidden>
        <div className="marquee flex w-max gap-10 whitespace-nowrap font-mono text-[12px]">
          {[...ticker, ...ticker].map((t, i) => (
            <span key={i} className="flex items-center gap-2">
              <span className="font-semibold">{t.sym}</span>
              <span className="text-[#9be3b3]">{t.value.startsWith("−") ? "▼" : "▲"} {t.value.replace("−", "")}</span>
              <span className="opacity-60">{t.label}</span>
            </span>
          ))}
        </div>
      </div>

      <div className="relative z-[2] mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <ScaleMarker index="02" scale="Platform" tone="ink" />

        {/* masthead */}
        <div className="mt-10 border-b-4 border-double border-forest/70 pb-4">
          <div className="label flex flex-wrap justify-between gap-2 text-[10px] text-forest/70">
            <span>Experience / 02 — {b.company}</span>
            <span>{b.location} · {b.dates}</span>
          </div>
          <Reveal>
            <h2 id="big-title" className="mt-4 font-serif text-[clamp(2.6rem,6.4vw,5.4rem)] leading-[0.95] tracking-tight">
              {b.headline.split(" in ")[0]} <em>in hours.</em>
            </h2>
          </Reveal>
        </div>

        <div className="grid gap-10 pt-8 lg:grid-cols-[1.1fr_2fr]">
          {/* lead figure */}
          <div className="lg:border-r lg:border-forest/20 lg:pr-10">
            <p className="text-[15px] leading-relaxed text-forest/80">
              <span className="float-left mr-2 font-serif text-[3.6rem] leading-[0.8]">I</span>
              {b.intro.slice(2)}
            </p>
            <div className="mt-8">
              <CountUp value={b.lead.value} className="block font-serif text-[clamp(5rem,10vw,8rem)] leading-[0.85]" />
              <div className="label mt-2 text-[10.5px]">{b.lead.unit} — {b.lead.label}</div>
            </div>
            <div className="mt-10"><IndexBars /></div>
            <p className="label mt-6 text-[10px] text-forest/60">{b.title}</p>
          </div>

          {/* columns */}
          <div className="grid gap-8 md:grid-cols-3">
            {b.stories.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.08} className={`md:pl-6 ${i ? "md:border-l md:border-forest/20" : ""}`}>
                <article>
                  <div className="label text-[10px] text-signal">{s.kicker}</div>
                  <h3 className="mt-2 font-serif text-[1.6rem] leading-[1.05]">{s.title}</h3>
                  <p className="mt-3 text-[14px] leading-relaxed text-forest/75">{s.body}</p>
                </article>
              </Reveal>
            ))}
            <div className="md:col-span-3">
              <div className="mt-2 flex flex-wrap gap-2">
                {b.stack.map((s) => (
                  <span key={s} className="rounded-full border border-forest/25 px-3 py-1 font-mono text-[11px]">{s}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
