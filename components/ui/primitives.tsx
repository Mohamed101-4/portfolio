"use client";

import { motion, useInView, useReducedMotion, animate } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Fades + lifts children into view once. Static when reduced motion is on. */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "span" | "p" | "h2" | "h3";
}) {
  const reduce = useReducedMotion();
  const M = motion[as];
  return (
    <M
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </M>
  );
}

/** Splits a line into words that rise from a mask. */
export function RevealWords({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  return (
    <span className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.12em] align-bottom">
          <motion.span
            className="inline-block"
            initial={reduce ? false : { y: "110%" }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: EASE, delay: delay + i * 0.06 }}
          >
            {w}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/** Counts up to a number when it scrolls into view. Keeps prefix/suffix (e.g. "−", "+", "%"). */
export function CountUp({ value, className, duration = 1.6 }: { value: string; className?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();
  const match = value.match(/^([^\d]*)([\d,.]+)(.*)$/);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (!match || !inView || reduce) return;
    const [, pre, num, post] = match;
    const target = parseFloat(num.replace(/,/g, ""));
    const decimals = num.includes(".") ? num.split(".")[1].length : 0;
    const commas = num.includes(",");
    const c = animate(0, target, {
      duration,
      ease: EASE,
      onUpdate: (v) => {
        const n = decimals ? v.toFixed(decimals) : Math.round(v).toString();
        setDisplay(pre + (commas ? Number(n).toLocaleString("en-US") : n) + post);
      },
    });
    return () => c.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduce, value]);

  return (
    <span ref={ref} className={className} aria-label={value}>
      <span aria-hidden>{display}</span>
    </span>
  );
}

/** Map-legend style section marker: "SCALE · GLOBAL ———— 02". */
export function ScaleMarker({ scale, index, tone = "ink" }: { scale: string; index: string; tone?: "ink" | "light" | "gold" | "volt" }) {
  const color = {
    ink: "text-ink/60",
    light: "text-white/55",
    gold: "text-gold",
    volt: "text-volt",
  }[tone];
  return (
    <div className={`label flex items-center gap-4 ${color}`}>
      <span>{index}</span>
      <span className="flex items-end gap-[3px]" aria-hidden>
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={i} className={`w-px bg-current ${i % 2 ? "h-1.5" : "h-2.5"}`} />
        ))}
        <span className="h-px w-16 bg-current opacity-60" />
      </span>
      <span>Scale · {scale}</span>
    </div>
  );
}

/** Small honest badge for simulations / conceptual UIs. */
export function SimBadge({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`label inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-current/30 px-3 py-1 text-[10px] ${className}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}

/** Line icons (24px grid, currentColor). */
export function Icon({ name, className = "h-5 w-5" }: { name: string; className?: string }) {
  const p = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const paths: Record<string, ReactNode> = {
    calendar: (<><rect x="3.5" y="5" width="17" height="15" rx="2" {...p} /><path d="M3.5 9.5h17M8 3v4M16 3v4M8 13h.01M12 13h.01M16 13h.01M8 16.5h.01M12 16.5h.01" {...p} /></>),
    layers: (<><path d="M12 3 3 8l9 5 9-5-9-5Z" {...p} /><path d="m3 12.5 9 5 9-5M3 16.5l9 5 9-5" {...p} /></>),
    bolt: <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" {...p} />,
    code: <path d="m8 8-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14" {...p} />,
    api: (<><path d="M4 7h16M4 12h10M4 17h7" {...p} /><circle cx="18" cy="16" r="3" {...p} /></>),
    doc: (<><path d="M6 3h8l4 4v14H6V3Z" {...p} /><path d="M14 3v4h4M9 12h6M9 16h6" {...p} /></>),
    shield: (<><path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Z" {...p} /><path d="m9 12 2 2 4-4" {...p} /></>),
    arrow: <path d="M5 12h14M13 6l6 6-6 6" {...p} />,
    arrowUpRight: <path d="M7 17 17 7M8 7h9v9" {...p} />,
    download: <path d="M12 4v11M7 10l5 5 5-5M5 20h14" {...p} />,
    github: (
      <path
        fill="currentColor"
        d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.6 9.6 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"
      />
    ),
    linkedin: (
      <path
        fill="currentColor"
        d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4V21H3V9.75Zm6.5 0h3.83v1.54h.06c.53-1 1.84-2.06 3.79-2.06 4.05 0 4.8 2.67 4.8 6.13V21h-4v-5c0-1.2-.02-2.73-1.66-2.73-1.67 0-1.92 1.3-1.92 2.65V21h-4V9.75Z"
      />
    ),
    mail: (<><rect x="3" y="5" width="18" height="14" rx="2" {...p} /><path d="m3.5 6.5 8.5 6.5 8.5-6.5" {...p} /></>),
    copy: (<><rect x="8" y="8" width="12" height="12" rx="2" {...p} /><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3" {...p} /></>),
    check: <path d="m5 12.5 4.5 4.5L19 7.5" {...p} />,
    play: <path d="M7 5v14l12-7L7 5Z" {...p} />,
    pause: <path d="M8 5v14M16 5v14" {...p} />,
    step: <path d="M6 5v14l9-7-9-7ZM18 5v14" {...p} />,
    reset: <path d="M4 12a8 8 0 1 0 2.34-5.66M4 4v4h4" {...p} />,
    chip: (<><rect x="6" y="6" width="12" height="12" rx="1.5" {...p} /><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4" {...p} /></>),
    plane: <path d="M10.5 13.5 4 12l-1-2 7 .5L14 4h2l-2 7 6 .5 2 2-8 .5-3 6h-2l1.5-6.5Z" {...p} />,
  };
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      {paths[name] ?? null}
    </svg>
  );
}
