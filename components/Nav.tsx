"use client";

import { motion, useScroll, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import { nav, profile } from "@/content/site";
import { Icon } from "@/components/ui/primitives";

/**
 * Floating nav. Reads data-tone ("light" | "dark") from whichever section sits
 * under it and swaps its palette to match that section's climate.
 */
export function Nav() {
  const [tone, setTone] = useState<"light" | "dark">("light");
  const [active, setActive] = useState<string>("");
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });

  useEffect(() => {
    const onScroll = () => {
      const probe = 36;
      const els = document.querySelectorAll<HTMLElement>("[data-tone]");
      for (const el of els) {
        const r = el.getBoundingClientRect();
        if (r.top <= probe && r.bottom > probe) {
          setTone((el.dataset.tone as "light" | "dark") ?? "light");
          break;
        }
      }
      const mid = window.innerHeight * 0.35;
      let current = "";
      for (const item of nav) {
        const el = document.getElementById(item.id);
        if (el && el.getBoundingClientRect().top <= mid) current = item.id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const dark = tone === "dark";
  const shell = dark
    ? "bg-black/35 text-white border-white/10"
    : "bg-paper/70 text-ink border-ink/10";

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6">
      <nav
        aria-label="Primary"
        className={`pointer-events-auto relative mx-auto flex max-w-6xl items-center justify-between overflow-hidden rounded-full border px-4 py-2.5 backdrop-blur-xl transition-colors duration-500 sm:px-5 ${shell}`}
      >
        <a href="#top" className="font-serif text-2xl leading-none tracking-tight" aria-label="Mohamed Ali — back to top">
          M<span className="italic">A</span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={`relative rounded-full px-3.5 py-1.5 text-[13px] transition-opacity ${
                  active === item.id ? "opacity-100" : "opacity-60 hover:opacity-100"
                }`}
              >
                {active === item.id && (
                  <motion.span
                    layoutId="nav-pill"
                    className={`absolute inset-0 -z-10 rounded-full ${dark ? "bg-white/10" : "bg-ink/[0.07]"}`}
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href={`mailto:${profile.email}`}
            className={`hidden items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[13px] transition-colors sm:inline-flex ${
              dark ? "border-gold/50 text-gold-2 hover:bg-gold/10" : "border-ink/20 hover:bg-ink hover:text-paper"
            }`}
          >
            Say hi <Icon name="arrowUpRight" className="h-3.5 w-3.5" />
          </a>
          <button
            className="rounded-full p-2 md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
          >
            <span className={`block h-px w-5 bg-current transition-transform ${open ? "translate-y-[3px] rotate-45" : ""}`} />
            <span className={`mt-1.5 block h-px w-5 bg-current transition-transform ${open ? "-translate-y-[4px] -rotate-45" : ""}`} />
          </button>
        </div>

        <motion.span
          aria-hidden
          className={`absolute bottom-0 left-0 h-px w-full origin-left ${dark ? "bg-gold" : "bg-signal"}`}
          style={{ scaleX: progress }}
        />
      </nav>

      {open && (
        <div
          id="mobile-menu"
          className={`pointer-events-auto mx-auto mt-2 max-w-6xl rounded-3xl border p-3 backdrop-blur-xl md:hidden ${shell}`}
        >
          {nav.map((item) => (
            <a key={item.id} href={`#${item.id}`} onClick={() => setOpen(false)} className="block rounded-2xl px-4 py-3 font-serif text-2xl">
              {item.label}
            </a>
          ))}
          <a href={`mailto:${profile.email}`} className="label block px-4 py-3">
            Say hi ↗
          </a>
        </div>
      )}
    </header>
  );
}
