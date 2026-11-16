"use client";

import { useEffect, useRef } from "react";

/**
 * Hero background: a grid of ink dots with a slow wave running through it.
 * Dots near the cursor swell and turn signal-orange. Static under reduced motion.
 */
export function DotField({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, dpr = 1, raf = 0, visible = true;
    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 };
    const GAP = 26;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      mouse.x += (mouse.tx - mouse.x) * 0.12;
      mouse.y += (mouse.ty - mouse.y) * 0.12;
      const time = t * 0.00035;
      for (let y = GAP / 2; y < h; y += GAP) {
        for (let x = GAP / 2; x < w; x += GAP) {
          const wave = Math.sin(x * 0.006 + time * 2) * Math.cos(y * 0.008 - time * 1.4);
          const dx = x - mouse.x, dy = y - mouse.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          const near = Math.max(0, 1 - d / 180);
          const push = near * near * 14;
          const px = x + (d ? (dx / d) * push : 0);
          const py = y + (d ? (dy / d) * push : 0);
          const r = 0.7 + (wave + 1) * 0.35 + near * 2.2;
          // fade toward bottom so the type stays clean
          const fade = Math.min(1, 1.25 - y / h);
          if (near > 0.02) {
            ctx.fillStyle = `rgba(232,80,31,${(0.25 + near * 0.75) * fade})`;
          } else {
            ctx.fillStyle = `rgba(18,18,18,${(0.10 + (wave + 1) * 0.06) * fade})`;
          }
          ctx.beginPath();
          ctx.arc(px, py, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      if (!reduce && visible) raf = requestAnimationFrame(draw);
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.tx = e.clientX - r.left;
      mouse.ty = e.clientY - r.top;
    };
    const onLeave = () => { mouse.tx = -9999; mouse.ty = -9999; };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !reduce) { cancelAnimationFrame(raf); raf = requestAnimationFrame(draw); }
    });

    resize();
    draw(0);
    io.observe(canvas);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove);
    document.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className={`absolute inset-0 h-full w-full ${className}`} />;
}
