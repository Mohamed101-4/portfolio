"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useMemo, useRef } from "react";
import { leadership as l } from "@/content/site";
import { CountUp, Reveal, ScaleMarker } from "@/components/ui/primitives";
import { stripeSet } from "@/components/viz/TigerStripes";

/**
 * "White Out": bold organic black stripes claw in from both edges as you scroll,
 * framing the leadership statement. Inspired by tiger-stripe uniforms, no branding.
 */
export function Leadership() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const left = useMemo(() => stripeSet("left", 11), []);
  const right = useMemo(() => stripeSet("right", 23), []);
  // portrait set for phones so blades still reach toward the statement
  const leftM = useMemo(() => stripeSet("left", 31, 420, 900, 8), []);
  const rightM = useMemo(() => stripeSet("right", 47, 420, 900, 8), []);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const lx = useTransform(scrollYProgress, [0, 0.55], reduce ? ["0%", "0%"] : ["-55%", "0%"]);
  const rx = useTransform(scrollYProgress, [0, 0.55], reduce ? ["0%", "0%"] : ["55%", "0%"]);
  const skew = useTransform(scrollYProgress, [0, 0.55], reduce ? [0, 0] : [-6, 0]);
  const textOpacity = useTransform(scrollYProgress, [0.25, 0.5], reduce ? [1, 1] : [0, 1]);
  const textScale = useTransform(scrollYProgress, [0.25, 0.6], reduce ? [1, 1] : [0.92, 1]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  return (
    <section id="leadership" data-tone="light" aria-labelledby="lead-title" className="relative bg-white text-black">
      {/* sticky stripe stage */}
      <div ref={ref} className="relative h-[220vh]">
        <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden">
          {[
            { vb: "0 0 1440 900", l: left, r: right, cls: "hidden md:block" },
            { vb: "0 0 420 900", l: leftM, r: rightM, cls: "md:hidden" },
          ].map((set) => (
            <svg key={set.vb} aria-hidden viewBox={set.vb} preserveAspectRatio="xMidYMid slice" className={`absolute inset-0 h-full w-full ${set.cls}`}>
              <motion.g style={{ x: lx, skewY: skew }}>
                {set.l.map((d, i) => <path key={i} d={d} fill="#0a0a0a" />)}
              </motion.g>
              <motion.g style={{ x: rx, skewY: skew }}>
                {set.r.map((d, i) => <path key={i} d={d} fill="#0a0a0a" />)}
              </motion.g>
            </svg>
          ))}

          {/* soft white bloom: stripe tips dissolve before reaching the statement */}
          <motion.div
            aria-hidden
            style={{ opacity: textOpacity }}
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_44%_38%_at_50%_50%,#fff_58%,rgba(255,255,255,.85)_72%,transparent_100%)]"
          />
          <motion.div style={{ opacity: textOpacity, scale: textScale }} className="relative z-10 px-6 text-center">
            <div className="mx-auto inline-block px-6 py-8 sm:px-10">
              <div className="label text-[11px] text-black/55">Leadership · {l.org}</div>
              <h2 id="lead-title" className="mt-5 font-serif text-[clamp(2.6rem,6.5vw,6rem)] leading-[0.95] tracking-tight">
                I started a chapter.
                <br />
                <em>We built a community.</em>
              </h2>
              <div className="mt-8 flex items-end justify-center gap-5 font-sans">
                <span className="text-[clamp(3rem,7vw,5.5rem)] font-black leading-none tracking-tight text-transparent [-webkit-text-stroke:2px_#0a0a0a]">{l.from}</span>
                <svg viewBox="0 0 60 20" className="mb-4 h-5 w-14" aria-hidden><path d="M0 10h54M46 3l8 7-8 7" fill="none" stroke="black" strokeWidth="2.5" /></svg>
                <span className="text-[clamp(3rem,7vw,5.5rem)] font-black leading-none tracking-tight">{l.to}+</span>
              </div>
              <div className="label mt-3 text-[10px] text-black/50">members in one year</div>
            </div>
          </motion.div>

          <motion.div style={{ opacity: hintOpacity }} className="label absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] text-black/45">
            Keep scrolling
          </motion.div>
          <div className="absolute left-5 top-24 sm:left-8">
            <ScaleMarker index="08" scale="Community" tone="ink" />
          </div>
        </div>
      </div>

      {/* details */}
      <div className="relative mx-auto max-w-6xl px-5 pb-28 sm:px-8">
        <div className="grid gap-12 border-t-[3px] border-black pt-10 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <Reveal>
              <p className="label text-[10.5px] text-black/55">{l.role} · {l.dates}</p>
              <p className="mt-5 font-serif text-[clamp(1.6rem,2.6vw,2.2rem)] leading-[1.15]">{l.body}</p>
            </Reveal>
            <div className="mt-10 flex items-baseline gap-4">
              <CountUp value="3×" className="font-sans text-[5rem] font-black leading-none tracking-tighter" />
              <span className="max-w-[10rem] text-[13px] leading-snug text-black/60">membership growth since founding</span>
            </div>
            <div className="mt-8">
              <div className="label mb-3 text-[10px] text-black/50">Hiring pipelines with</div>
              <div className="flex flex-wrap gap-x-6 gap-y-1 font-serif text-[1.9rem] italic">
                {l.partners.map((p) => <span key={p}>{p}</span>)}
              </div>
            </div>
          </div>
          <ol className="grid gap-px bg-black sm:grid-cols-2">
            {l.pillars.map((p, i) => (
              <Reveal as="li" key={p.title} delay={i * 0.06} className="group bg-white p-6 transition-colors hover:bg-black hover:text-white">
                <span className="font-mono text-[11px] text-black/40 group-hover:text-white/50">0{i + 1}</span>
                <h3 className="mt-4 text-[18px] font-semibold tracking-tight">{p.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-black/60 group-hover:text-white/65">{p.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
