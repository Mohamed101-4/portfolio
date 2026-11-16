"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { profile } from "@/content/site";
import { DotField } from "@/components/viz/DotField";
import { CountUp, Icon } from "@/components/ui/primitives";

const EASE = [0.16, 1, 0.3, 1] as const;

const index = [
  { n: "01", name: "Visa", scale: "Global", href: "#visa" },
  { n: "02", name: "llmserve", scale: "Cluster", href: "#inference" },
  { n: "03", name: "swe-agent", scale: "Codebase", href: "#agent" },
  { n: "04", name: "Minorities in Tech", scale: "Community", href: "#leadership" },
];

/** Sets the phrases listed in profile.headline.emphasis in italic. */
function Headline() {
  const { text, emphasis } = profile.headline;
  const pattern = new RegExp(`(${emphasis.map((e) => e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`);
  return (
    <>
      {text.split(pattern).map((part, i) =>
        emphasis.includes(part) ? (
          <em key={i} className="text-signal">{part}</em>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

export function Hero() {
  const reduce = useReducedMotion();
  const rise = (delay: number) =>
    reduce ? {} : { initial: { y: "105%" }, animate: { y: 0 }, transition: { duration: 1.2, ease: EASE, delay } };
  const fade = (delay: number) =>
    reduce ? {} : { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 1, ease: EASE, delay } };

  return (
    <section id="top" data-tone="light" aria-labelledby="hero-name" className="grain relative min-h-[100svh] overflow-hidden bg-paper">
      <DotField />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_35%_55%,rgba(242,238,230,.92),rgba(242,238,230,.4)_55%,transparent_80%)]" />

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl flex-col px-5 pb-8 pt-28 sm:px-8 sm:pt-32">
        <motion.div {...fade(0.1)} className="label flex flex-wrap items-center gap-x-6 gap-y-2 text-ink/55">
          <span>Mohamed Ali — Portfolio</span>
          <span className="hidden h-px w-12 bg-ink/30 sm:block" />
          <span>{profile.tagline}</span>
        </motion.div>

        <div className="mt-8 grid flex-1 items-center gap-12 lg:mt-10 lg:grid-cols-[1.35fr_1fr] lg:gap-16">
          {/* Text column */}
          <div className="min-w-0">
            <h1 id="hero-name" className="font-serif leading-[0.85] tracking-[-0.035em]">
              <span className="block overflow-hidden pb-[0.04em]">
                <motion.span {...rise(0.15)} className="block text-[clamp(4rem,11vw,9.5rem)]">
                  Mohamed <em>Ali</em><span className="text-signal">.</span>
                </motion.span>
              </span>
            </h1>

            <motion.p {...fade(0.45)} className="mt-7 max-w-[30ch] font-serif text-[clamp(1.75rem,3.2vw,2.6rem)] leading-[1.08] tracking-tight">
              <Headline />
            </motion.p>

            <motion.div {...fade(0.6)} className="mt-7 max-w-xl space-y-4 text-[15.5px] leading-relaxed text-ink-2">
              {profile.about.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </motion.div>

            <motion.div {...fade(0.75)} className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#experience"
                className="group inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm text-paper transition-transform hover:-translate-y-0.5"
              >
                See the work
                <Icon name="arrow" className="h-4 w-4 rotate-90 transition-transform group-hover:translate-y-0.5" />
              </a>
              {[
                { href: profile.links.linkedin, icon: "linkedin", label: "LinkedIn" },
                { href: profile.links.github, icon: "github", label: "GitHub" },
                { href: `mailto:${profile.email}`, icon: "mail", label: "Email" },
              ].map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  target={l.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-4 py-3 text-sm text-ink/80 transition-colors hover:border-ink hover:text-ink"
                >
                  <Icon name={l.icon} className="h-4 w-4" />
                  <span className="hidden sm:inline">{l.label}</span>
                  <span className="sr-only sm:hidden">{l.label}</span>
                </a>
              ))}
            </motion.div>
          </div>

          {/* Portrait column */}
          <motion.figure
            initial={reduce ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, ease: EASE, delay: 0.3 }}
            className="relative order-first w-full max-w-[240px] sm:max-w-[300px] lg:order-none lg:mx-auto lg:max-w-[380px]"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-t-[999px] bg-[#dfe6f5] shadow-[0_40px_80px_-40px_rgba(18,18,18,.45)]">
              <Image
                src={profile.photo}
                alt="Portrait of Mohamed Ali"
                fill
                priority
                sizes="(max-width: 1024px) 80vw, 380px"
                className="object-cover object-[50%_30%]"
              />
            </div>
            {/* scale readout */}
            <dl className="mt-4 grid grid-cols-3 border-t border-ink/20">
              {profile.scale.map((s) => (
                <div key={s.label} className="pt-3">
                  <dt className="sr-only">{s.label}</dt>
                  <dd>
                    <CountUp value={s.value} className="block font-serif text-[1.7rem] leading-none" />
                    <span className="label mt-1 block text-[9.5px] text-ink/50">{s.label}</span>
                  </dd>
                </div>
              ))}
            </dl>
            <span aria-hidden className="absolute -right-5 top-12 hidden rotate-90 font-mono text-[10px] tracking-[0.3em] text-ink/40 sm:block">
              COLUMBUS, OH
            </span>
          </motion.figure>
        </div>

        {/* selected work strip */}
        <motion.nav {...fade(0.9)} aria-label="Selected work" className="mt-14">
          <ul className="no-scrollbar -mx-5 flex overflow-x-auto border-t border-ink/15 px-5 sm:mx-0 sm:grid sm:grid-cols-4 sm:px-0">
            {index.map((item) => (
              <li key={item.n} className="min-w-[44%] sm:min-w-0">
                <a href={item.href} className="group flex items-baseline justify-between gap-3 py-4 pr-4 transition-colors hover:text-signal">
                  <span className="flex items-baseline gap-3">
                    <span className="font-mono text-[10.5px] text-ink/40">{item.n}</span>
                    <span className="font-serif text-xl leading-none group-hover:italic">{item.name}</span>
                  </span>
                  <span className="label hidden text-[9.5px] text-ink/45 lg:inline">{item.scale}</span>
                </a>
              </li>
            ))}
          </ul>
        </motion.nav>
      </div>
    </section>
  );
}
