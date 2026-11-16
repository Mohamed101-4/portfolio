"use client";

import { motion, useInView, useReducedMotion, useScroll, useTransform } from "motion/react";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { visa } from "@/content/site";
import { CountUp, Icon, Reveal, ScaleMarker } from "@/components/ui/primitives";
import { LoungeCard } from "@/components/viz/LoungeCard";

const GoldGlobe = dynamic(() => import("@/components/viz/GoldGlobe").then((m) => m.GoldGlobe), { ssr: false });

const CHARS = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+−<>%.,/";

/** Split-flap text that cycles through characters before settling. */
function Flap({ text, start }: { text: string; start: boolean }) {
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(reduce ? text : text.replace(/./g, " "));
  useEffect(() => {
    if (reduce) { setShown(text); return; }
    if (!start) return;
    let tick = 0;
    const id = setInterval(() => {
      tick++;
      setShown(text.split("").map((c, i) => (tick > 6 + i * 2 ? c : CHARS[Math.floor(Math.random() * CHARS.length)])).join(""));
      if (tick > 6 + text.length * 2) clearInterval(id);
    }, 55);
    return () => clearInterval(id);
  }, [start, text, reduce]);
  return (
    <span aria-label={text} className="inline-flex">
      {shown.split("").map((c, i) => (
        <span key={i} aria-hidden className="flap">{c === " " ? " " : c}</span>
      ))}
    </span>
  );
}

function DepartureBoard() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  return (
    <div ref={ref} className="overflow-hidden rounded-xl bg-[#060a16] ring-1 ring-white/[0.07]">
      <div className="label flex items-center justify-between border-b border-white/[0.07] bg-gradient-to-r from-gold/[0.08] to-transparent px-5 py-3 text-[10px] text-white/45">
        <span className="flex items-center gap-2 text-gold"><Icon name="plane" className="h-3.5 w-3.5" /> Departures — impact</span>
        <span className="hidden sm:inline">Status</span>
      </div>
      <ul>
        {visa.board.map((row) => (
          <li key={row.code} className="grid grid-cols-[3rem_1fr] items-center gap-x-3 gap-y-1 border-b border-white/[0.05] px-5 py-3 last:border-0 sm:grid-cols-[3.2rem_8.5rem_1fr_auto]">
            <span className="font-mono text-[11px] text-white/35">{row.code}</span>
            <span className="font-mono text-lg text-gold-2 sm:text-xl"><Flap text={row.value.toUpperCase()} start={inView} /></span>
            <span className="col-start-2 text-[13px] text-white/60 sm:col-start-auto">{row.label}</span>
            <span className="label hidden text-[10px] text-emerald-300/75 sm:inline">{inView ? "Landed" : ""}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** The three API steps as boarding gates joined by a flight path; the plane advances with scroll. */
function GateTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 55%"] });
  const planeX = useTransform(scrollYProgress, [0, 1], reduce ? ["100%", "100%"] : ["0%", "100%"]);
  const methodColor: Record<string, string> = { GET: "text-sky-300", POST: "text-emerald-300", DELETE: "text-rose-300" };

  return (
    <div ref={ref}>
      {/* flight path (desktop) */}
      <div className="relative mb-8 hidden h-6 md:block" aria-hidden>
        <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-gold/30" />
        <motion.div className="absolute inset-y-0 left-0 origin-left" style={{ width: planeX }}>
          <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-gold/70 to-gold" />
          <Icon name="plane" className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rotate-45 text-gold-2" />
        </motion.div>
      </div>
      <ol className="grid gap-10 md:grid-cols-3 md:gap-8">
        {visa.journey.map((g, i) => (
          <Reveal as="li" key={g.path} delay={i * 0.1}>
            <div className="flex items-baseline justify-between border-b border-gold/25 pb-3">
              <span className="label text-[10px] text-gold">Gate A{i + 1}</span>
              <span className="font-serif text-[2.4rem] leading-none text-white/90">{g.title}</span>
            </div>
            <div className="mt-4 font-mono text-[12px]">
              <span className={`mr-2 font-semibold ${methodColor[g.method]}`}>{g.method}</span>
              <span className="break-all text-white/70">{g.path}</span>
            </div>
            <p className="mt-3 text-[14px] leading-relaxed text-white/60">{g.body}</p>
            <p className="mt-3 font-mono text-[11px] text-white/35">{g.tags.join("  ·  ")}</p>
          </Reveal>
        ))}
      </ol>
    </div>
  );
}

export function Visa() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start start"] });
  const inset = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["5%", "0%"]);
  const radius = useTransform(scrollYProgress, [0, 1], reduce ? ["0px", "0px"] : ["48px", "0px"]);
  const clip = useTransform([inset, radius], ([i, r]) => `inset(0 ${i} 0 ${i} round ${r})`);

  return (
    <section ref={ref} id="visa" data-tone="dark" aria-labelledby="visa-title" className="relative bg-paper">
      <motion.div style={{ clipPath: clip }} className="relative overflow-hidden bg-midnight text-white">
        {/* lighting */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -left-60 -top-40 h-[800px] w-[1000px] rounded-full bg-[radial-gradient(closest-side,rgba(38,64,160,.38),transparent)]" />
          <div className="absolute -right-40 top-0 h-[600px] w-[700px] rounded-full bg-[radial-gradient(closest-side,rgba(200,169,106,.10),transparent)]" />
          <svg className="absolute right-0 top-0 h-[560px] w-[1000px] opacity-60" viewBox="0 0 1000 560" fill="none">
            <defs>
              <linearGradient id="silk" x1="0" x2="1">
                <stop offset="0" stopColor="#c8a96a" stopOpacity="0" />
                <stop offset="0.65" stopColor="#f0dcae" stopOpacity="0.75" />
                <stop offset="1" stopColor="#c8a96a" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[0, 12, 26, 44, 60].map((o, i) => (
              <path key={i} d={`M160 ${-30 + o} C 460 ${170 + o}, 680 ${30 + o}, 1020 ${240 + o * 1.3}`} stroke="url(#silk)" strokeWidth={i === 1 ? 1.3 : 0.6} />
            ))}
          </svg>
        </div>

        <div id="experience" className="relative mx-auto max-w-6xl px-5 pt-32 sm:px-8">
          <ScaleMarker index="01" scale="Global" tone="gold" />

          {/* Opener */}
          <div className="mt-12 grid items-center gap-14 lg:grid-cols-[1fr_1.1fr]">
            <div>
              <Reveal>
                <div className="label flex items-center gap-3 text-[11px] text-white/55">
                  Experience <span className="text-gold">/</span> 01
                  <span className="h-px w-16 bg-gradient-to-r from-gold/60 to-transparent" />
                </div>
              </Reveal>
              <Reveal delay={0.05}>
                <div className="mt-6 flex items-end gap-4">
                  <span className="sweep text-[clamp(4.2rem,10vw,7.5rem)] font-black italic leading-[0.8] tracking-[-0.045em]">VISA</span>
                  <span className="foil font-serif text-[clamp(4.2rem,10vw,7.5rem)] leading-[0.8]">/</span>
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <h2 id="visa-title" className="mt-8 font-serif text-[clamp(2.5rem,5vw,4.2rem)] leading-[0.98] tracking-tight">
                  {visa.headline.a} <em className="foil shimmer">{visa.headline.em}</em>
                  <br />
                  {visa.headline.b}
                </h2>
              </Reveal>
              <Reveal delay={0.15}>
                <p className="mt-6 max-w-md text-[16px] leading-relaxed text-white/65">{visa.intro}</p>
                <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[11px] text-white/45">
                  <span className="text-gold-2">{visa.title}</span>
                  <span className="h-3 w-px bg-white/20" />
                  <span>{visa.dates}</span>
                  <span className="h-3 w-px bg-white/20" />
                  <span>{visa.location}</span>
                </div>
              </Reveal>
            </div>
            <Reveal delay={0.2}>
              <LoungeCard />
            </Reveal>
          </div>
        </div>

        {/* Horizon */}
        <div className="relative mt-16 h-[420px] sm:h-[500px]">
          <div className="absolute inset-0"><GoldGlobe /></div>
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-midnight to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-[#04081a]" />
          <div className="pointer-events-none relative mx-auto flex h-full max-w-6xl items-start justify-between px-5 pt-6 sm:px-8">
            {visa.hero.map((m, i) => (
              <div key={m.label} className={i ? "text-right" : ""}>
                <CountUp value={m.value} className="foil block font-serif text-[clamp(3.6rem,9vw,7rem)] leading-[0.9] drop-shadow-[0_4px_30px_rgba(0,0,0,.6)]" />
                <div className="label mt-2 text-[10.5px] text-white/60">{m.label}</div>
              </div>
            ))}
          </div>
          <p className="label absolute bottom-3 left-1/2 w-full -translate-x-1/2 px-5 text-center text-[9px] text-white/35">
            Illustrative flight paths between major cities — not Visa network data · drag to rotate
          </p>
        </div>

        {/* Gates + board */}
        <div className="relative bg-gradient-to-b from-[#04081a] to-midnight">
          <div className="mx-auto max-w-6xl px-5 pb-28 pt-20 sm:px-8">
            <Reveal>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <h3 className="font-serif text-[clamp(2rem,3.8vw,3rem)] leading-tight">
                  One booking, <em className="text-gold-2">three promises.</em>
                </h3>
                <p className="max-w-sm text-[14px] text-white/55">
                  I authored the API spec and built the services behind every step of a cardholder&apos;s reservation.
                </p>
              </div>
            </Reveal>
            <div className="mt-12"><GateTimeline /></div>

            <div className="mt-24 grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:items-start">
              <Reveal><DepartureBoard /></Reveal>
              <div>
                <ul className="space-y-6">
                  {visa.pillars.map((p, i) => (
                    <Reveal as="li" key={p.title} delay={i * 0.07} className="grid grid-cols-[2.5rem_1fr] gap-4 border-b border-white/[0.08] pb-6 last:border-0">
                      <span className="text-gold"><Icon name={p.icon} className="h-6 w-6" /></span>
                      <div>
                        <div className="text-[16px] font-medium">{p.title}</div>
                        <p className="mt-1 text-[13.5px] leading-relaxed text-white/55">{p.body}</p>
                      </div>
                    </Reveal>
                  ))}
                </ul>
                <div className="mt-8">
                  <div className="label mb-3 text-[10px] text-white/40">Built with</div>
                  <p className="font-mono text-[12px] leading-relaxed text-white/60">
                    Java · Spring Boot · DragonPass API · OpenAPI / Swagger · Redis · Kafka · Resilience4j · JUnit · Testcontainers
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="hairline-gold" />
      </motion.div>
    </section>
  );
}
