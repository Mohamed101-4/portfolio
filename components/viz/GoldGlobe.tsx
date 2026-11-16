"use client";

import { useEffect, useRef } from "react";
import { geoOrthographic, geoEquirectangular, geoPath, geoInterpolate, geoDistance } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import land110 from "world-atlas/land-110m.json";

/** Illustrative hubs only: major world cities, not Visa network data. */
const HUBS: [number, number][] = [
  [-74.0, 40.7], [-122.4, 37.8], [-0.1, 51.5], [55.3, 25.2], [103.8, 1.35],
  [139.7, 35.7], [-46.6, -23.5], [28.0, -26.2], [151.2, -33.9], [77.1, 28.6],
  [2.35, 48.86], [-99.1, 19.4], [114.2, 22.3], [-87.6, 41.9], [31.2, 30.0],
];
const ROUTES: [number, number][] = [
  [0, 2], [1, 5], [2, 3], [3, 4], [4, 8], [0, 6], [2, 7], [3, 9], [5, 12], [10, 3], [11, 0], [13, 10], [12, 4], [1, 11], [14, 9], [6, 7],
];

/** Deterministic hash → [0,1). */
const h2 = (x: number, y: number) => {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
};
/** Smooth value noise, used to cluster "city lights" into metro regions. */
function noise(x: number, y: number) {
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = x - xi, yf = y - yi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const a = h2(xi, yi), b = h2(xi + 1, yi), c = h2(xi, yi + 1), d = h2(xi + 1, yi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

/**
 * Night-side Earth rising like a horizon. Clustered gold city lights, travelling
 * arcs between illustrative hubs, atmospheric rim. Drag horizontally to spin.
 */
export function GoldGlobe({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // rasterize land once to test points against
    const topo = land110 as unknown as Topology<{ land: GeometryCollection }>;
    const land = feature(topo, topo.objects.land);
    const W = 1440, H = 720;
    const off = document.createElement("canvas");
    off.width = W; off.height = H;
    const octx = off.getContext("2d", { willReadFrequently: true })!;
    const eq = geoEquirectangular().scale(W / (2 * Math.PI)).translate([W / 2, H / 2]);
    octx.fillStyle = "#fff";
    octx.beginPath();
    geoPath(eq, octx)(land);
    octx.fill();
    const data = octx.getImageData(0, 0, W, H).data;

    const dots: { ll: [number, number]; a: number; big: boolean }[] = [];
    const STEP = 0.9;
    for (let lat = -56; lat <= 74; lat += STEP) {
      const lonStep = STEP / Math.max(0.3, Math.cos((lat * Math.PI) / 180));
      for (let lon = -180; lon < 180; lon += lonStep) {
        const [x, y] = eq([lon, lat])!;
        if (data[(Math.floor(y) * W + Math.floor(x)) * 4] < 128) continue;
        const density = Math.pow(noise(lon / 9 + 40, lat / 9 + 40), 1.6);
        const fine = h2(lon, lat);
        const a = 0.14 + density * 1.1 * (0.45 + fine * 0.55);
        dots.push({ ll: [lon, lat], a, big: density > 0.4 && fine > 0.78 });
      }
    }
    const routes = ROUTES.map(([a, b], i) => ({ interp: geoInterpolate(HUBS[a], HUBS[b]), offset: i / ROUTES.length }));

    let w = 0, h = 0, raf = 0, visible = true;
    const proj = geoOrthographic().clipAngle(90);
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const R = Math.max(380, w * 0.52);
      proj.scale(R).translate([w / 2, h + R * 0.42]);
    };

    let rot = 10;
    const tilt = -32;
    let drag: { x: number; rot: number } | null = null;

    const frame = (t: number) => {
      if (!drag && !reduce) rot += 0.035;
      proj.rotate([rot, tilt]);
      const center: [number, number] = [-rot, -tilt];
      const R = proj.scale();
      const [cx, cy] = proj.translate();
      ctx.clearRect(0, 0, w, h);

      // outer atmosphere
      const atm = ctx.createRadialGradient(cx, cy, R * 0.96, cx, cy, R * 1.14);
      atm.addColorStop(0, "rgba(90,130,255,0.32)");
      atm.addColorStop(0.35, "rgba(70,100,230,0.12)");
      atm.addColorStop(1, "rgba(70,100,230,0)");
      ctx.fillStyle = atm;
      ctx.beginPath(); ctx.arc(cx, cy, R * 1.14, 0, Math.PI * 2); ctx.fill();

      // planet body
      const body = ctx.createRadialGradient(cx, cy - R * 0.9, R * 0.1, cx, cy, R);
      body.addColorStop(0, "#132657");
      body.addColorStop(0.55, "#091534");
      body.addColorStop(1, "#04081a");
      ctx.fillStyle = body;
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();

      // city lights
      for (const d of dots) {
        const dist = geoDistance(d.ll, center);
        if (dist > 1.56) continue;
        const p = proj(d.ll);
        if (!p || p[1] > h + 4) continue;
        const limb = Math.max(0, 1 - dist / 1.6);
        ctx.fillStyle = d.big ? `rgba(255,222,160,${0.55 + limb * 0.45})` : `rgba(224,190,122,${d.a * (0.35 + limb * 0.65)})`;
        const s = d.big ? 2 : 1.3;
        ctx.fillRect(p[0] - s / 2, p[1] - s / 2, s, s);
      }

      // arcs
      const time = t * 0.00012;
      for (const r of routes) {
        const N = 56;
        const pts: ([number, number] | null)[] = [];
        for (let i = 0; i <= N; i++) {
          const ll = r.interp(i / N);
          if (geoDistance(ll, center) > 1.5) { pts.push(null); continue; }
          const p = proj(ll)!;
          const lift = Math.sin((i / N) * Math.PI) * 0.14;
          pts.push([cx + (p[0] - cx) * (1 + lift), cy + (p[1] - cy) * (1 + lift)]);
        }
        const k = (time + r.offset) % 1;
        const head = Math.floor(k * N);
        // faint full path
        ctx.strokeStyle = "rgba(200,169,106,0.18)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        let pen = false;
        for (const p of pts) {
          if (!p) { pen = false; continue; }
          if (!pen) { ctx.moveTo(p[0], p[1]); pen = true; } else ctx.lineTo(p[0], p[1]);
        }
        ctx.stroke();
        // bright travelling segment
        ctx.lineWidth = 1.6;
        for (let i = Math.max(1, head - 10); i <= head; i++) {
          const a = pts[i - 1], b = pts[i];
          if (!a || !b) continue;
          ctx.strokeStyle = `rgba(246,226,176,${((i - head + 10) / 10) * 0.9})`;
          ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
        }
        const hp = pts[head];
        if (hp) {
          const g = ctx.createRadialGradient(hp[0], hp[1], 0, hp[0], hp[1], 7);
          g.addColorStop(0, "rgba(255,236,190,1)");
          g.addColorStop(1, "rgba(255,236,190,0)");
          ctx.fillStyle = g;
          ctx.beginPath(); ctx.arc(hp[0], hp[1], 7, 0, Math.PI * 2); ctx.fill();
        }
      }

      // hubs
      for (const hub of HUBS) {
        if (geoDistance(hub, center) > 1.5) continue;
        const p = proj(hub)!;
        const phase = (((t * 0.0005 + hub[0] * 0.013) % 1) + 1) % 1;
        ctx.strokeStyle = `rgba(233,211,161,${0.55 * (1 - phase)})`;
        ctx.beginPath(); ctx.arc(p[0], p[1], 3 + phase * 10, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = "#f6e7c3";
        ctx.beginPath(); ctx.arc(p[0], p[1], 2, 0, Math.PI * 2); ctx.fill();
      }

      // limb light: thin bright rim where night meets atmosphere
      const rim = ctx.createRadialGradient(cx, cy, R * 0.94, cx, cy, R * 1.005);
      rim.addColorStop(0, "rgba(120,160,255,0)");
      rim.addColorStop(0.85, "rgba(140,175,255,0.25)");
      rim.addColorStop(1, "rgba(220,230,255,0.75)");
      ctx.fillStyle = rim;
      ctx.beginPath(); ctx.arc(cx, cy, R * 1.005, 0, Math.PI * 2); ctx.fill();

      if (visible && !reduce) raf = requestAnimationFrame(frame);
    };

    const onDown = (e: PointerEvent) => { drag = { x: e.clientX, rot }; };
    const onMove = (e: PointerEvent) => {
      if (!drag) return;
      rot = drag.rot + (e.clientX - drag.x) * 0.25;
      if (reduce) frame(performance.now());
    };
    const onUp = () => { drag = null; };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !reduce) { cancelAnimationFrame(raf); raf = requestAnimationFrame(frame); }
    });

    resize();
    frame(0);
    io.observe(canvas);
    window.addEventListener("resize", resize);
    canvas.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      role="img"
      aria-label="Night-side globe with illustrative gold flight paths between major world cities"
      className={`h-full w-full cursor-grab touch-pan-y active:cursor-grabbing ${className}`}
    />
  );
}
