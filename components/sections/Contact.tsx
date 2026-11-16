"use client";

import { useState } from "react";
import { agent, inference, profile } from "@/content/site";
import { Icon, RevealWords } from "@/components/ui/primitives";

export function Contact() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  const links = [
    { label: "LinkedIn", sub: "mohamed-ali-mo4amed", href: profile.links.linkedin, icon: "linkedin" },
    { label: "GitHub", sub: "Mohamed101-4", href: profile.links.github, icon: "github" },
    { label: "llmserve", sub: "Inference platform repo", href: inference.repo, icon: "code" },
    { label: "swe-agent", sub: "Autonomous agent repo", href: agent.repo, icon: "code" },
  ];

  return (
    <section id="contact" data-tone="dark" aria-labelledby="contact-title" className="relative overflow-hidden bg-ink text-paper">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -bottom-40 left-1/2 h-[600px] w-[1200px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(232,80,31,.22),transparent)]" />
      </div>
      <div className="relative mx-auto max-w-6xl px-5 pb-10 pt-32 sm:px-8">
        <div className="label text-[11px] text-paper/50">Contact</div>
        <h2 id="contact-title" className="mt-6 font-serif text-[clamp(3.2rem,10vw,9rem)] leading-[0.88] tracking-[-0.03em]">
          <RevealWords text="Let's build something" />
          <br />
          <em className="text-signal"><RevealWords text="that scales." delay={0.2} /></em>
        </h2>
        <div className="mt-12 flex flex-wrap items-center gap-3">
          <a href={`mailto:${profile.email}`} className="group inline-flex items-center gap-3 rounded-full bg-paper px-6 py-4 text-[15px] font-medium text-ink transition hover:bg-signal hover:text-white">
            <Icon name="mail" className="h-4 w-4" />
            {profile.email}
            <Icon name="arrowUpRight" className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
          <button onClick={copy} className="inline-flex items-center gap-2 rounded-full border border-paper/25 px-5 py-4 text-[14px] transition hover:border-paper" aria-live="polite">
            <Icon name={copied ? "check" : "copy"} className="h-4 w-4" />
            {copied ? "Copied" : "Copy email"}
          </button>
        </div>

        <ul className="mt-20 grid border-t border-paper/15 sm:grid-cols-2 lg:grid-cols-4">
          {links.map((l) => (
            <li key={l.label} className="border-b border-paper/15 lg:border-b-0 lg:border-r lg:last:border-r-0">
              <a
                href={l.href}
                target="_blank"
                rel="noreferrer"
                className="group flex h-full items-center justify-between gap-3 py-6 transition-colors hover:text-signal lg:flex-col lg:items-start lg:px-5 lg:first:pl-0"
              >
                <span className="flex items-center gap-3">
                  <Icon name={l.icon} className="h-5 w-5" />
                  <span>
                    <span className="block text-[15px] font-medium">{l.label}</span>
                    <span className="block font-mono text-[11px] text-paper/45">{l.sub}</span>
                  </span>
                </span>
                <Icon name="arrowUpRight" className="h-4 w-4 opacity-40 transition group-hover:opacity-100" />
              </a>
            </li>
          ))}
        </ul>

        <footer className="label mt-24 flex flex-col justify-between gap-3 text-[10px] text-paper/40 sm:flex-row">
          <span>© 2026 Mohamed Ali</span>
          <span>Designed & built by hand · Next.js · Motion</span>
          <a href="#top" className="hover:text-paper">Back to top ↑</a>
        </footer>
      </div>
    </section>
  );
}
