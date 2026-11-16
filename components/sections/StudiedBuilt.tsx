"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { builtWork, education as e, skills } from "@/content/site";
import { Reveal, ScaleMarker } from "@/components/ui/primitives";

type Path = { d: string; course: number; work: string };

/**
 * "Studied → Built": Ohio State coursework on the left, the work it shows up in on
 * the right, connected by curves. Hovering either side highlights its links.
 * On small screens the links render as chips under each course instead.
 */
export function StudiedBuilt() {
  const wrap = useRef<HTMLDivElement>(null);
  const courseRefs = useRef<(HTMLLIElement | null)[]>([]);
  const workRefs = useRef<Record<string, HTMLLIElement | null>>({});
  const [paths, setPaths] = useState<Path[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [hoverCourse, setHoverCourse] = useState<number | null>(null);
  const [hoverWork, setHoverWork] = useState<string | null>(null);

  const measure = useCallback(() => {
    const box = wrap.current?.getBoundingClientRect();
    if (!box) return;
    const out: Path[] = [];
    e.courses.forEach((c, i) => {
      const a = courseRefs.current[i]?.getBoundingClientRect();
      if (!a) return;
      c.built.forEach((id) => {
        const b = workRefs.current[id]?.getBoundingClientRect();
        if (!b) return;
        const x1 = a.right - box.left + 12, y1 = a.top + a.height / 2 - box.top;
        const x2 = b.left - box.left - 12, y2 = b.top + b.height / 2 - box.top;
        const mx = (x1 + x2) / 2;
        out.push({ d: `M${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`, course: i, work: id });
      });
    });
    setPaths(out);
    setSize({ w: box.width, h: box.height });
  }, []);

  useLayoutEffect(() => { measure(); }, [measure]);
  useEffect(() => {
    const ro = new ResizeObserver(measure);
    if (wrap.current) ro.observe(wrap.current);
    document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, [measure]);

  const active = (p: Path) =>
    (hoverCourse !== null && p.course === hoverCourse) || (hoverWork !== null && p.work === hoverWork);
  const anyHover = hoverCourse !== null || hoverWork !== null;
  const workLit = (id: string) =>
    hoverWork === id || (hoverCourse !== null && e.courses[hoverCourse].built.includes(id));
  const courseLit = (i: number) => hoverCourse === i || (hoverWork !== null && e.courses[i].built.includes(hoverWork));
  const workName = (id: string) => builtWork.find((w) => w.id === id)?.name ?? id;

  return (
    <section id="studied" data-tone="light" aria-labelledby="studied-title" className="grain relative bg-paper-2">
      <div className="relative z-[2] mx-auto max-w-6xl px-5 py-24 sm:px-8">
        <ScaleMarker index="09" scale="Foundation" tone="ink" />

        <div className="mt-10 flex flex-wrap items-end justify-between gap-6">
          <Reveal>
            <div className="label flex items-center gap-3 text-[11px] text-ink/55">
              <span className="h-3 w-3 bg-scarlet" />
              <span className="h-3 w-3 bg-gray-osu" />
              {e.school}
            </div>
            <h2 id="studied-title" className="mt-5 font-serif text-[clamp(2.8rem,6.5vw,5.4rem)] leading-[0.92] tracking-tight">
              Studied <span className="text-signal">→</span> <em>Built.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="max-w-sm text-[14.5px] leading-relaxed text-ink-2">
              {e.degree}, {e.minor.toLowerCase()}. Here&apos;s where the coursework turned into real work. Hover a course or a project.
            </p>
          </Reveal>
        </div>

        {/* desktop: connected columns */}
        <div ref={wrap} className="relative mt-14 hidden grid-cols-[1fr_1fr] gap-x-40 md:grid" onMouseLeave={() => { setHoverCourse(null); setHoverWork(null); }}>
          <svg aria-hidden className="pointer-events-none absolute inset-0" width={size.w} height={size.h}>
            {paths.map((p, i) => (
              <path
                key={i}
                d={p.d}
                fill="none"
                stroke={active(p) ? "#e8501f" : "#121212"}
                strokeOpacity={active(p) ? 0.9 : anyHover ? 0.05 : 0.14}
                strokeWidth={active(p) ? 1.6 : 1}
                style={{ transition: "stroke-opacity .3s, stroke .3s" }}
              />
            ))}
          </svg>
          <div>
            <div className="label mb-3 text-[10px] text-ink/45">Studied</div>
            <ul className="border-t border-ink/15">
              {e.courses.map((c, i) => (
                <li
                  key={c.name}
                  ref={(el) => { courseRefs.current[i] = el; }}
                  onMouseEnter={() => { setHoverCourse(i); setHoverWork(null); }}
                  className={`flex cursor-default items-baseline justify-between border-b border-ink/15 py-3 transition-colors ${courseLit(i) ? "text-signal" : anyHover ? "text-ink/35" : ""}`}
                >
                  <span className="font-serif text-[1.45rem] leading-none">{c.name}</span>
                  <span className="font-mono text-[10px] text-ink/35">{String(i + 1).padStart(2, "0")}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="self-center">
            <div className="label mb-3 text-[10px] text-ink/45">Built</div>
            <ul className="space-y-2">
              {builtWork.map((w) => (
                <li
                  key={w.id}
                  ref={(el) => { workRefs.current[w.id] = el; }}
                  onMouseEnter={() => { setHoverWork(w.id); setHoverCourse(null); }}
                >
                  <a
                    href={w.href}
                    className={`inline-flex rounded-full border px-4 py-2 text-[14px] transition-colors ${
                      workLit(w.id) ? "border-signal bg-signal text-white" : anyHover ? "border-ink/10 text-ink/35" : "border-ink/20 bg-paper"
                    }`}
                  >
                    {w.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* mobile: chips under each course */}
        <ul className="mt-10 border-t border-ink/15 md:hidden">
          {e.courses.map((c) => (
            <li key={c.name} className="border-b border-ink/15 py-4">
              <div className="font-serif text-[1.35rem] leading-tight">{c.name}</div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {c.built.map((id) => (
                  <span key={id} className="rounded-full border border-ink/15 px-2.5 py-0.5 text-[12px] text-ink/70">→ {workName(id)}</span>
                ))}
              </div>
            </li>
          ))}
        </ul>

        {/* toolkit */}
        <div className="mt-16 grid gap-6 border-t border-ink/15 pt-8 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(skills).map(([k, v]) => (
            <div key={k}>
              <div className="label text-[10px] text-ink/45">{k}</div>
              <div className="mt-2 text-[14px] leading-relaxed">{v.join(" · ")}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
