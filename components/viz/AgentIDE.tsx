"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { agent } from "@/content/site";
import { Icon, SimBadge } from "@/components/ui/primitives";

/**
 * Scripted replay of the repository's offline demo (examples/buggy_app,
 * swe_agent/demo.py). The planner/patcher replies are the hand-written ones from
 * the repo; this is a visual walkthrough, not a live agent run.
 */

type Line = { n: number; code: string; kind?: "add" | "del" | "hl" };

const BASE: Line[] = [
  { n: 30, code: "" },
  { n: 31, code: "" },
  { n: 32, code: "def login(store: UserStore, data: dict) -> LoginResult:" },
  { n: 33, code: '    # BUG: assumes "email" is always present and is a string.' },
  { n: 34, code: '    email = normalize_email(data["email"])' },
  { n: 35, code: '    password = data.get("password") or ""' },
  { n: 36, code: "" },
  { n: 37, code: "    user = store.get(email)" },
  { n: 38, code: "    if user is None:" },
  { n: 39, code: '        return LoginResult(ok=False, error="invalid credentials")' },
  { n: 40, code: "    if hash_password(password, user.salt) != user.password_hash:" },
  { n: 41, code: '        return LoginResult(ok=False, error="invalid credentials")' },
  { n: 42, code: "    return LoginResult(ok=True, email=email)" },
];

const withHighlight = BASE.map((l) => (l.n === 32 || l.n === 34 ? { ...l, kind: "hl" as const } : l));
const patch1: Line[] = BASE.flatMap((l) =>
  l.n === 34
    ? [{ ...l, kind: "del" as const }, { n: 34, code: '    email = normalize_email(data.get("email", ""))', kind: "add" as const }]
    : [l]
);
const patch2: Line[] = BASE.flatMap((l) =>
  l.n === 34
    ? [
        { ...l, kind: "del" as const },
        { n: 34, code: '    email = data.get("email")', kind: "add" as const },
        { n: 35, code: "    if not email:", kind: "add" as const },
        { n: 36, code: '        return LoginResult(ok=False, error="email is required")', kind: "add" as const },
        { n: 37, code: "    email = normalize_email(email)", kind: "add" as const },
      ]
    : [l]
);

type Step = {
  agent: string | null;
  title: string;
  message: string;
  lines: Line[];
  term: { t: string; c?: string }[];
  result?: "fail" | "pass";
};

const STEPS: Step[] = [
  {
    agent: null,
    title: "Issue filed",
    message: "Login crashes when email is missing",
    lines: BASE,
    term: [
      { t: "$ swe-agent --repo ./examples/buggy_app \\", c: "text-ink" },
      { t: '    --issue "Login crashes when email is missing"', c: "text-ink" },
      { t: "loading repo · building AST index…", c: "text-ink/50" },
    ],
  },
  {
    agent: "planner",
    title: "Planner",
    message: "login() raises when the email field is missing. Hypothesis: login indexes data['email'] without checking it exists.",
    lines: BASE,
    term: [{ t: "planner: login() raises when the email field is missing", c: "text-[#6D5EF5]" }],
  },
  {
    agent: "localizer",
    title: "Localizer",
    message: "Searched 12 symbols with keyword + embedding retrieval. Top hit: app/auth.py:32 login",
    lines: withHighlight,
    term: [
      { t: "localizer: searched 12 symbols (keyword+embedding)", c: "text-[#0EA5A4]" },
      { t: "localizer:   app/auth.py:32 login", c: "text-[#0EA5A4]" },
    ],
  },
  {
    agent: "patcher",
    title: "Patcher · attempt 1",
    message: "Use .get (still crashes on None).",
    lines: patch1,
    term: [{ t: "patcher: attempt 1: Use .get (still crashes on None).", c: "text-[#E8590C]" }],
  },
  {
    agent: "verifier",
    title: "Verifier",
    message: "6 passed, 2 failed. Feedback sent to patcher: missing and None email must return 'email is required'.",
    lines: patch1,
    result: "fail",
    term: [
      { t: "docker run --network none --read-only … pytest", c: "text-ink/50" },
      { t: "FAILED tests/test_auth.py::test_login_missing_email", c: "text-rose-600" },
      { t: "FAILED tests/test_auth.py::test_login_none_email", c: "text-rose-600" },
      { t: "verifier: 6 passed, 2 failed, 0 errors in 0.54s -> FAIL", c: "text-[#2B8A3E]" },
    ],
  },
  {
    agent: "patcher",
    title: "Patcher · attempt 2",
    message: "Return an error when email is missing or empty.",
    lines: patch2,
    term: [{ t: "patcher: attempt 2: Return an error when email is missing or empty.", c: "text-[#E8590C]" }],
  },
  {
    agent: "verifier",
    title: "Verifier",
    message: "8 passed, 0 failed. Resolved after 2 patch attempts.",
    lines: patch2,
    result: "pass",
    term: [
      { t: "docker run --network none --read-only … pytest", c: "text-ink/50" },
      { t: "verifier: 8 passed, 0 failed, 0 errors in 0.29s -> PASS", c: "text-[#2B8A3E]" },
      { t: "report: RESOLVED after 2 patch attempt(s)", c: "text-ink font-semibold" },
    ],
  },
];

const FILES = [
  { name: "app/", dir: true },
  { name: "auth.py", active: true },
  { name: "storage.py" },
  { name: "validators.py" },
  { name: "tests/", dir: true },
  { name: "test_auth.py" },
  { name: "test_validators.py" },
];

function highlight(code: string) {
  // tiny Python tokenizer for display
  const parts = code.split(/("[^"]*"|#.*$|\b(?:def|return|if|not|is|None|True|False)\b)/g);
  return parts.map((p, i) => {
    if (!p) return null;
    if (p.startsWith("#")) return <span key={i} className="italic text-ink/40">{p}</span>;
    if (p.startsWith('"')) return <span key={i} className="text-[#2B8A3E]">{p}</span>;
    if (/^(def|return|if|not|is)$/.test(p)) return <span key={i} className="text-[#6D5EF5]">{p}</span>;
    if (/^(None|True|False)$/.test(p)) return <span key={i} className="text-[#E8590C]">{p}</span>;
    return <span key={i}>{p}</span>;
  });
}

export function AgentIDE() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-20% 0px" });
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(true);
  const step = STEPS[i];
  const termLines = STEPS.slice(0, i + 1).flatMap((s) => s.term);
  const termRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!playing || !inView || reduce) return;
    const id = setTimeout(() => setI((x) => (x + 1) % STEPS.length), i === STEPS.length - 1 ? 5200 : 2800);
    return () => clearTimeout(id);
  }, [i, playing, inView, reduce]);

  useEffect(() => {
    termRef.current?.scrollTo({ top: termRef.current.scrollHeight, behavior: reduce ? "auto" : "smooth" });
  }, [i, reduce]);

  const visited = (id: string) => STEPS.slice(0, i + 1).some((s) => s.agent === id);

  return (
    <div ref={ref} className="overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-[0_50px_120px_-50px_rgba(40,30,120,.45)]">
      {/* window chrome */}
      <div className="flex items-center justify-between gap-3 border-b border-ink/10 bg-[#f7f7fb] px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          <span className="ml-3 hidden font-mono text-[11.5px] text-ink/50 sm:inline">swe-agent — examples/buggy_app</span>
        </div>
        <div className="flex items-center gap-2">
          <SimBadge className="hidden text-[#6D5EF5] sm:inline-flex">Scripted replay of repo demo</SimBadge>
          <SimBadge className="text-[#6D5EF5] sm:hidden">Scripted replay</SimBadge>
          <div className="flex items-center rounded-full border border-ink/10 bg-white">
            <button onClick={() => setPlaying((p) => !p)} aria-label={playing ? "Pause" : "Play"} className="grid h-8 w-8 place-items-center rounded-full hover:bg-ink/5">
              <Icon name={playing ? "pause" : "play"} className="h-3.5 w-3.5" />
            </button>
            <button onClick={() => { setPlaying(false); setI((x) => Math.min(STEPS.length - 1, x + 1)); }} aria-label="Next step" className="grid h-8 w-8 place-items-center rounded-full hover:bg-ink/5">
              <Icon name="step" className="h-3.5 w-3.5" />
            </button>
            <button onClick={() => { setI(0); setPlaying(true); }} aria-label="Restart" className="grid h-8 w-8 place-items-center rounded-full hover:bg-ink/5">
              <Icon name="reset" className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* issue bar */}
      <div className="flex flex-wrap items-center gap-3 border-b border-ink/10 bg-[#fffaf5] px-4 py-2 text-[12.5px]">
        <span className="rounded-full bg-rose-100 px-2 py-0.5 font-mono text-[10.5px] text-rose-700">issue</span>
        <span className="font-medium">Login crashes when email is missing</span>
        <span className="font-mono text-[11px] text-ink/40">KeyError: &apos;email&apos;</span>
      </div>

      <div className="grid lg:grid-cols-[11rem_1fr_19rem]">
        {/* file tree */}
        <aside className="hidden border-r border-ink/10 bg-[#fafafc] py-3 font-mono text-[12px] lg:block" aria-label="Files">
          {FILES.map((f) => (
            <div
              key={f.name}
              className={`px-4 py-1 ${f.dir ? "text-ink/40" : "pl-7"} ${
                f.active ? "bg-[#6D5EF5]/10 text-[#6D5EF5]" : ""
              } ${f.name === "test_auth.py" && step.agent === "verifier" ? "bg-[#2B8A3E]/10 text-[#2B8A3E]" : ""}`}
            >
              {f.name}
            </div>
          ))}
        </aside>

        {/* editor + terminal */}
        <div className="min-w-0">
          <div className="flex border-b border-ink/10 font-mono text-[11.5px]">
            <span className="border-r border-ink/10 bg-white px-4 py-2 text-ink">auth.py</span>
            <span className="px-4 py-2 text-ink/40">test_auth.py</span>
          </div>
          <div className="relative h-[300px] overflow-auto bg-white py-3 font-mono text-[12px] leading-[1.75] sm:text-[12.5px]" aria-label="Editor: app/auth.py">
            <AnimatePresence initial={false} mode="popLayout">
              {step.lines.map((l, k) => (
                <motion.div
                  layout={!reduce}
                  key={`${l.n}-${l.kind}-${l.code}`}
                  initial={reduce ? false : { opacity: 0, x: l.kind === "add" ? -8 : 0 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, delay: l.kind === "add" ? k * 0.03 : 0 }}
                  className={`flex whitespace-pre pr-4 ${
                    l.kind === "add" ? "bg-emerald-50" : l.kind === "del" ? "bg-rose-50 line-through decoration-rose-300" : l.kind === "hl" ? "bg-[#0EA5A4]/10" : ""
                  }`}
                >
                  <span className="w-12 shrink-0 select-none pr-3 text-right text-ink/25">
                    {l.kind === "del" ? "" : 30 + step.lines.slice(0, k).filter((x) => x.kind !== "del").length}
                  </span>
                  <span className={`w-4 shrink-0 select-none ${l.kind === "add" ? "text-emerald-600" : l.kind === "del" ? "text-rose-500" : ""}`}>
                    {l.kind === "add" ? "+" : l.kind === "del" ? "−" : ""}
                  </span>
                  <span>{highlight(l.code)}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <div className="border-t border-ink/10 bg-[#fbfbfd]">
            <div className="flex items-center justify-between border-b border-ink/5 px-4 py-1.5 font-mono text-[10.5px] text-ink/45">
              <span>TERMINAL</span>
              {step.result && (
                <span className={`rounded-full px-2 py-0.5 ${step.result === "pass" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                  {step.result === "pass" ? "8 / 8 passed" : "6 / 8 passed"}
                </span>
              )}
            </div>
            <div ref={termRef} className="h-[150px] overflow-auto px-4 py-2 font-mono text-[11.5px] leading-[1.7]" aria-live="polite">
              {termLines.map((l, k) => (
                <motion.div key={k} initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} className={`whitespace-pre-wrap ${l.c ?? ""}`}>
                  {l.t}
                </motion.div>
              ))}
              <span className="caret inline-block h-3.5 w-1.5 translate-y-0.5 bg-ink/60" />
            </div>
          </div>
        </div>

        {/* agent rail */}
        <aside className="border-t border-ink/10 bg-[#f7f7fb] p-4 lg:border-l lg:border-t-0" aria-label="Agents">
          <div className="label mb-3 text-[10px] text-ink/45">LangGraph · agents</div>
          <ol className="relative space-y-3">
            <span aria-hidden className="absolute bottom-6 left-[15px] top-6 w-px bg-ink/10" />
            {agent.agents.map((a) => {
              const active = step.agent === a.id;
              const done = !active && visited(a.id);
              return (
                <li key={a.id} className="relative flex gap-3">
                  <span
                    className="relative z-10 mt-1 grid h-[31px] w-[31px] shrink-0 place-items-center rounded-full border-2 bg-white font-mono text-[11px] font-semibold transition-colors"
                    style={{ borderColor: active || done ? a.color : "rgba(18,18,18,.12)", color: a.color }}
                  >
                    {active && !reduce && (
                      <motion.span className="absolute inset-[-5px] rounded-full border" style={{ borderColor: a.color }} animate={{ scale: [1, 1.25], opacity: [0.8, 0] }} transition={{ duration: 1.2, repeat: Infinity }} />
                    )}
                    {done ? <Icon name="check" className="h-3.5 w-3.5" /> : a.name[0]}
                  </span>
                  <div className={`flex-1 rounded-xl border p-3 transition-all ${active ? "border-transparent bg-white shadow-md" : "border-ink/5 bg-transparent"}`}
                    style={active ? { boxShadow: `0 8px 24px -12px ${a.color}66, 0 0 0 1px ${a.color}33` } : undefined}
                  >
                    <div className="text-[13px] font-semibold" style={{ color: active ? a.color : undefined }}>{a.name}</div>
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={active ? step.message : "idle"}
                        initial={reduce ? false : { opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mt-1 text-[12px] leading-snug text-ink/60"
                      >
                        {active ? step.message : a.body}
                      </motion.p>
                    </AnimatePresence>
                  </div>
                </li>
              );
            })}
          </ol>
          {step.agent === "verifier" && step.result === "fail" && (
            <div className="mt-3 rounded-lg border border-dashed border-[#E8590C]/50 px-3 py-2 font-mono text-[11px] text-[#E8590C]">↺ retry with test feedback</div>
          )}
        </aside>
      </div>

      {/* timeline */}
      <div className="flex items-center gap-1.5 border-t border-ink/10 bg-[#fafafc] px-4 py-3">
        {STEPS.map((s, k) => (
          <button
            key={k}
            onClick={() => { setPlaying(false); setI(k); }}
            aria-label={`Step ${k + 1}: ${s.title}`}
            aria-current={k === i ? "step" : undefined}
            className="group flex-1 py-1"
          >
            <span className={`block h-1 rounded-full transition-colors ${k <= i ? "bg-[#6D5EF5]" : "bg-ink/10 group-hover:bg-ink/20"}`} />
          </button>
        ))}
        <span className="ml-3 shrink-0 font-mono text-[11px] text-ink/50">{i + 1}/{STEPS.length} · {step.title}</span>
      </div>
    </div>
  );
}
