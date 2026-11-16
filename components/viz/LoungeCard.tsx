"use client";

import { motion, useMotionValue, useSpring, useTransform, useReducedMotion, useMotionTemplate } from "motion/react";
import { useState } from "react";

/** Illustrated lounge at dusk: one-point perspective, glass wall, jet on the apron, warm lamps, floor reflections. */
function LoungeArt() {
  return (
    <svg viewBox="0 0 440 280" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id="la-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0a1433" />
          <stop offset="0.45" stopColor="#24305f" />
          <stop offset="0.72" stopColor="#8f5a4a" />
          <stop offset="0.86" stopColor="#e39b5c" />
          <stop offset="0.93" stopColor="#f6c27f" />
        </linearGradient>
        <linearGradient id="la-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a1d14" />
          <stop offset="1" stopColor="#0a0705" />
        </linearGradient>
        <linearGradient id="la-refl" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6c27f" stopOpacity="0.45" />
          <stop offset="1" stopColor="#f6c27f" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="la-ceil" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#07080d" />
          <stop offset="1" stopColor="#15131a" />
        </linearGradient>
        <radialGradient id="la-lamp" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffd59a" stopOpacity="0.85" />
          <stop offset="1" stopColor="#ffd59a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="la-sun" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fff1cf" />
          <stop offset="0.4" stopColor="#ffd08a" stopOpacity="0.9" />
          <stop offset="1" stopColor="#ffb36b" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* glass wall view */}
      <rect x="40" y="38" width="360" height="152" fill="url(#la-sky)" />
      <circle cx="318" cy="168" r="46" fill="url(#la-sun)" />
      <circle cx="318" cy="168" r="11" fill="#fff4da" />
      {/* distant skyline + runway */}
      <path d="M40 176 L60 176 L64 168 L70 168 L72 176 L110 176 L114 171 L130 171 L132 176 L400 176 L400 190 L40 190 Z" fill="#1a1626" opacity="0.8" />
      {Array.from({ length: 26 }).map((_, i) => (
        <circle key={i} cx={46 + i * 14} cy={183} r="0.9" fill="#ffe6b0" opacity={0.45 + (i % 3) * 0.2} />
      ))}
      {/* jet */}
      <g transform="translate(150 150)" fill="#0b0d18">
        <path d="M0 16 L78 12 L94 4 L101 4 L96 13 L118 12 Q128 13 118 16.5 L96 17 L101 26 L94 26 L78 18 Z" />
        <path d="M44 14 L64 -2 L71 -2 L60 14 Z" />
        <path d="M44 17 L64 32 L71 32 L60 17 Z" />
      </g>
      {/* mullions */}
      {[40, 100, 160, 220, 280, 340, 400].map((x) => (
        <rect key={x} x={x - 2} y="38" width="4" height="152" fill="#06070c" />
      ))}
      <rect x="40" y="108" width="360" height="2.5" fill="#06070c" opacity="0.9" />

      {/* ceiling with recessed lights */}
      <path d="M0 0 H440 L400 38 H40 Z" fill="url(#la-ceil)" />
      {[0.15, 0.32, 0.5, 0.68, 0.85].map((k, i) => (
        <g key={i}>
          <ellipse cx={40 + k * 360} cy="22" rx="10" ry="2" fill="#ffe2ad" opacity="0.9" />
          <ellipse cx={40 + k * 360} cy="26" rx="26" ry="8" fill="#ffd59a" opacity="0.08" />
        </g>
      ))}
      {/* side walls */}
      <path d="M0 0 L40 38 V190 L0 240 Z" fill="#100d10" />
      <path d="M440 0 L400 38 V190 L440 240 Z" fill="#100d10" />

      {/* floor + reflections */}
      <path d="M0 240 L40 190 H400 L440 240 V280 H0 Z" fill="url(#la-floor)" />
      <path d="M40 190 H400 L420 222 H20 Z" fill="url(#la-refl)" />
      <ellipse cx="318" cy="205" rx="40" ry="6" fill="#ffd59a" opacity="0.35" />

      {/* chairs: back row smaller, front row larger */}
      {[90, 170, 250, 330].map((x, i) => (
        <g key={`b${i}`} transform={`translate(${x} 196) scale(0.6)`}>
          <path d="M0 22 Q0 0 16 0 L44 0 Q56 0 56 12 L56 26 L0 26 Z" fill="#3a2a1d" />
          <rect x="4" y="14" width="48" height="9" rx="3" fill="#4c3726" />
        </g>
      ))}
      {[30, 160, 300].map((x, i) => (
        <g key={`f${i}`} transform={`translate(${x} 228)`}>
          <path d="M0 26 Q0 0 20 0 L58 0 Q72 0 72 14 L72 32 L0 32 Z" fill="#2c2016" />
          <rect x="5" y="16" width="62" height="12" rx="4" fill="#3e2d1f" />
          <ellipse cx="36" cy="34" rx="40" ry="3" fill="#000" opacity="0.4" />
        </g>
      ))}
      {/* lamps */}
      {[128, 268, 410].map((x, i) => (
        <g key={i}>
          <circle cx={x} cy="214" r="30" fill="url(#la-lamp)" />
          <path d={`M${x - 8} 206 L${x + 8} 206 L${x + 6} 216 L${x - 6} 216 Z`} fill="#ffcf85" />
          <rect x={x - 1} y="216" width="2" height="22" fill="#2b2117" />
        </g>
      ))}
      {/* palms */}
      <g stroke="#0e1611" strokeWidth="3.5" fill="none" strokeLinecap="round">
        <path d="M18 250 Q20 210 24 180" />
        <path d="M24 180 Q6 170 -4 186 M24 180 Q42 168 54 182 M24 180 Q16 160 4 162 M24 180 Q36 160 48 164" />
      </g>
    </svg>
  );
}

function Barcode() {
  const bars = [2, 1, 1, 3, 1, 2, 1, 1, 2, 3, 1, 1, 2, 1, 3, 1, 2, 2, 1, 1, 3, 1, 2, 1, 1, 2, 1, 3];
  return (
    <div className="flex h-full flex-col justify-between gap-[2px]" aria-hidden>
      {bars.map((b, i) => (
        <span key={i} className="block w-full bg-white/70" style={{ height: b }} />
      ))}
    </div>
  );
}

/**
 * Layered 3D boarding-pass credential. Image, foil and type sit on separate planes
 * so they parallax as the card tilts; a holographic sheen follows the cursor.
 * Click (or Enter) flips it to an engineering manifest.
 */
export function LoungeCard() {
  const reduce = useReducedMotion();
  const [flipped, setFlipped] = useState(false);
  const mx = useMotionValue(0.32);
  const my = useMotionValue(0.42);
  const rx = useSpring(useTransform(my, [0, 1], [12, -12]), { stiffness: 140, damping: 18 });
  const ry = useSpring(useTransform(mx, [0, 1], [-16, 16]), { stiffness: 140, damping: 18 });
  const px = useTransform(mx, [0, 1], [0, 100]);
  const py = useTransform(my, [0, 1], [0, 100]);
  const glare = useMotionTemplate`radial-gradient(520px circle at ${px}% ${py}%, rgba(255,240,205,.22), transparent 42%)`;
  const holo = useMotionTemplate`linear-gradient(${useTransform(mx, [0, 1], [100, 160])}deg, transparent 20%, rgba(120,170,255,.10) 35%, rgba(255,200,140,.14) 45%, rgba(170,255,220,.08) 55%, transparent 70%)`;

  const plane = (z: number) => ({ transform: reduce ? undefined : `translateZ(${z}px)` });

  return (
    <div
      className="relative [perspective:1400px]"
      onPointerMove={(e) => {
        if (reduce) return;
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width);
        my.set((e.clientY - r.top) / r.height);
      }}
      onPointerLeave={() => { mx.set(0.32); my.set(0.42); }}
    >
      {/* floor glow under the card */}
      <div aria-hidden className="absolute inset-x-[10%] -bottom-8 h-16 rounded-[50%] bg-gold/20 blur-3xl" />
      <motion.button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        aria-pressed={flipped}
        aria-label={flipped ? "Lounge pass, back: engineering manifest. Click to flip." : "Lounge pass: Global Lounge Network, 800+ airports, 120+ countries. Click to flip."}
        style={{ rotateX: reduce ? 0 : rx, rotateY: reduce ? 0 : ry, transformStyle: "preserve-3d" }}
        className="relative block w-full text-left"
      >
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: reduce ? 0 : 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformStyle: "preserve-3d" }}
          className="relative aspect-[1.9/1] w-full"
        >
          {/* FRONT */}
          <div
            style={{ transformStyle: "preserve-3d" }}
            className="absolute inset-0 rounded-[24px] [backface-visibility:hidden]"
          >
            {/* base plate */}
            <div className="absolute inset-0 overflow-hidden rounded-[24px] bg-gradient-to-br from-[#16264f] via-navy to-[#03050c] shadow-[0_50px_120px_-30px_rgba(0,0,0,.95)]">
              <div className="guilloche absolute inset-0" />
              {/* image window */}
              <div className="absolute inset-y-0 left-0 w-[55%] overflow-hidden">
                <LoungeArt />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0b1633]" />
              </div>
              <motion.div className="pointer-events-none absolute inset-0 mix-blend-screen" style={{ background: holo }} />
            </div>
            {/* foil frame on its own plane */}
            <div style={plane(18)} className="pointer-events-none absolute inset-0 rounded-[24px] border border-gold/50 shadow-[inset_0_0_0_1px_rgba(255,236,190,.08)]" />
            {/* perforation */}
            <div style={plane(10)} className="absolute inset-y-0 left-[55%] w-0">
              <span className="absolute -top-3 left-0 h-6 w-6 -translate-x-1/2 rounded-full bg-midnight" />
              <span className="absolute -bottom-3 left-0 h-6 w-6 -translate-x-1/2 rounded-full bg-midnight" />
              <span className="absolute inset-y-5 left-0 border-l border-dashed border-gold/45" />
            </div>
            {/* type plane */}
            <div style={plane(40)} className="absolute inset-0">
              <span className="absolute left-[5%] top-[9%] text-[clamp(1rem,2.4vw,1.55rem)] font-black italic tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,.6)]">
                VISA
              </span>
              <div className="absolute inset-y-0 left-[58%] right-[4%] flex flex-col justify-between py-[6%]">
                <div className="flex items-start justify-between gap-2">
                  <span className="label text-[8px] leading-tight text-gold sm:text-[9.5px]">Global lounge<br />network</span>
                  <span className="label text-right text-[8px] leading-tight text-white/45 sm:text-[9.5px]">Lounge<br />access</span>
                </div>
                <div className="flex items-center gap-2 text-[clamp(.95rem,2.2vw,1.45rem)] tracking-wide text-white sm:gap-3">
                  VISA
                  <svg viewBox="0 0 40 12" className="h-3 w-7 text-gold" aria-hidden>
                    <path d="M0 6h36M30 1l6 5-6 5" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                  WORLD
                </div>
                <div className="grid grid-cols-[1fr_auto_1fr_auto] items-end gap-2 sm:gap-3">
                  <div>
                    <div className="label text-[7.5px] text-white/45 sm:text-[9px]">Airports</div>
                    <div className="foil shimmer font-serif text-[clamp(1.3rem,3.2vw,2.3rem)] leading-none">800+</div>
                  </div>
                  <span className="h-7 w-px bg-white/15" />
                  <div>
                    <div className="label text-[7.5px] text-white/45 sm:text-[9px]">Countries</div>
                    <div className="foil shimmer font-serif text-[clamp(1.3rem,3.2vw,2.3rem)] leading-none">120+</div>
                  </div>
                  <div className="h-[clamp(2rem,4.6vw,3.3rem)] w-4 sm:w-5"><Barcode /></div>
                </div>
              </div>
            </div>
            <motion.div aria-hidden style={{ background: glare, ...plane(50) }} className="pointer-events-none absolute inset-0 rounded-[24px]" />
          </div>

          {/* BACK */}
          <div className="absolute inset-0 overflow-hidden rounded-[24px] border border-gold/45 bg-gradient-to-br from-[#03050c] via-navy to-[#16264f] p-[5%] [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <div className="guilloche absolute inset-0" />
            <div className="relative flex h-full flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="label text-[10px] text-gold">Engineering manifest</span>
                <span className="label text-[10px] text-white/40">SWE Intern · 2026</span>
              </div>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-[3%] font-mono text-[clamp(9px,1.2vw,12px)] text-white/80">
                {[
                  ["Service", "Java · Spring Boot"],
                  ["Partner", "DragonPass"],
                  ["Contract", "OpenAPI · Swagger"],
                  ["Resilience", "Resilience4j · Kafka"],
                  ["Cache", "Redis"],
                  ["Tests", "JUnit · Testcontainers"],
                ].map(([k, v]) => (
                  <div key={k} className="border-b border-white/10 pb-1">
                    <dt className="text-gold/70">{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="label text-[9px] text-white/40">Tap to flip back</div>
            </div>
          </div>
        </motion.div>
      </motion.button>
      <p className="label mt-6 text-center text-[10px] text-white/35">Move to tilt · click to flip</p>
    </div>
  );
}
