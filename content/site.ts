/**
 * All portfolio facts live here. Edit this file to change text, metrics and links;
 * components only handle presentation.
 *
 * Source of truth: Mohamed's resume, his LinkedIn,
 * and the RESULTS.md / README files in the two project repositories.
 */

export const profile = {
  name: "Mohamed Ali",
  initials: "MA",
  role: "Software Engineer",
  school: "The Ohio State University",
  degree: "B.S. Computer Science and Engineering",
  tagline: "CSE @ Ohio State · Prev. SWE Intern @ Visa",
  /** Hero headline. Words in `emphasis` are set in italic. */
  headline: {
    text: "Scale isn't a buzzword when it's 120 countries and 60,000 students.",
    emphasis: ["120 countries", "60,000 students."],
  },
  /** Short about-me shown next to the portrait in the hero. */
  about: [
    "I'm a Computer Science and Engineering student at Ohio State, and I like building the kind of software people never think twice about.",
    "At Visa, I built the backend behind airport lounge reservations across 800+ airports in 120+ countries. On my own time I build AI infrastructure — an LLM inference platform and an autonomous bug-fixing agent. And I founded Ohio State's Minorities in Technology chapter, which grew from 30 to 100+ members in its first year.",
  ],
  scale: [
    { value: "800+", label: "airports" },
    { value: "120+", label: "countries" },
    { value: "60,000+", label: "students" },
  ],
  email: "mo4amed.10@gmail.com",
  links: {
    linkedin: "https://www.linkedin.com/in/mohamed-ali-mo4amed/",
    github: "https://github.com/Mohamed101-4",
  },
  photo: "/mohamed.jpg",
  siteUrl: "https://mohamedali.dev", // change to your deployed domain
};

export const nav = [
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "leadership", label: "Leadership" },
  { id: "studied", label: "Education" },
  { id: "contact", label: "Contact" },
] as const;

/* ───────────────────────── Experience ───────────────────────── */

export const visa = {
  company: "Visa",
  title: "Software Engineer Intern",
  dates: "May 2026 – Aug 2026",
  location: "Foster City, CA",
  headline: { a: "Engineering a", em: "global", b: "travel experience." },
  intro:
    "I designed and built the backend that lets Visa's banking partners offer cardholders airport lounge reservations — real-time availability, booking and cancellation across 800+ airports in more than 120 countries.",
  hero: [
    { value: "800+", label: "Airports worldwide" },
    { value: "120+", label: "Countries reached" },
  ],
  board: [
    { code: "PRT", value: "12", label: "Banking partners" },
    { code: "P95", value: "<300ms", label: "at 5,000+ req/min" },
    { code: "ERR", value: "−85%", label: "Failed reservations" },
    { code: "COV", value: "90%", label: "Test coverage" },
    { code: "ONB", value: "−70%", label: "Partner onboarding time" },
  ],
  pillars: [
    {
      icon: "calendar",
      title: "Lounge reservations",
      body: "Real-time availability, booking and cancellation behind one partner-facing API.",
    },
    {
      icon: "layers",
      title: "DragonPass integration",
      body: "Unified DragonPass's third-party lounge inventory behind a single integration.",
    },
    {
      icon: "bolt",
      title: "Production at scale",
      body: "Idempotent booking, real-time capacity checks and circuit breakers for upstream outages.",
    },
  ],
  journey: [
    {
      method: "GET",
      path: "/v1/lounges/{airport}/availability",
      title: "Availability",
      body: "Real-time capacity from DragonPass, cached in Redis to hold p95 under 300 ms at 5,000+ requests/min.",
      tags: ["Spring Boot", "Redis", "OpenAPI"],
    },
    {
      method: "POST",
      path: "/v1/reservations",
      title: "Reservation",
      body: "Idempotent booking workflow with capacity checks — no double-bookings, 85% fewer failed reservations.",
      tags: ["Idempotency keys", "Kafka", "Resilience4j"],
    },
    {
      method: "DELETE",
      path: "/v1/reservations/{id}",
      title: "Cancellation",
      body: "Safe cancellation with circuit-breaker handling when the upstream partner is degraded.",
      tags: ["Circuit breaker", "Retries", "JUnit"],
    },
  ],
  contributions: [
    { icon: "code", title: "Backend development", body: "Java, Spring Boot" },
    { icon: "api", title: "API spec & REST", body: "Availability, reservations, cancellations" },
    { icon: "layers", title: "DragonPass", body: "Partner integration & reliability" },
    { icon: "doc", title: "Versioned contracts", body: "Swagger / OpenAPI + generated SDKs" },
    { icon: "shield", title: "Testing", body: "JUnit, Testcontainers — 90% coverage" },
  ],
};

export const osuResearch = {
  org: "The Ohio State University · Department of Athletics",
  title: "Undergraduate Machine Learning Researcher",
  dates: "Sep 2025 – Feb 2026",
  location: "Columbus, OH",
  headline: "Reading the playbook before the snap.",
  intro:
    "I modeled Ohio State's offensive play-calling tendencies: engineering features from thousands of plays and training a model to predict run versus pass.",
  stats: [
    { value: "5,000+", label: "Plays analyzed" },
    { value: "40+", label: "Engineered features" },
  ],
  model: {
    name: "XGBoost",
    baselineName: "Logistic regression",
    baseline: 62,
    result: 73,
  },
  pipeline: ["Play-by-play data", "Feature engineering", "XGBoost classifier", "Run / Pass"],
  stack: ["Python", "pandas", "XGBoost", "scikit-learn"],
};

export const nvidia = {
  org: "NVIDIA Deep Learning Institute",
  title: "Independent Study",
  dates: "May 2025 – Mar 2026",
  headline: { a: "Learning to think", em: "in parallel." },
  intro:
    "Completed advanced deep learning training through NVIDIA's Deep Learning Institute — the groundwork behind the GPU scheduling, CUDA and Triton work in my inference platform.",
  topics: [
    { k: "01", title: "Neural network architectures", body: "How modern deep learning models are built, trained and evaluated." },
    { k: "02", title: "GPU-accelerated computing", body: "Thinking in threads, warps and memory bandwidth instead of loops." },
    { k: "03", title: "AI model optimization", body: "Making models faster and leaner to serve: precision, memory and throughput." },
  ],
};

export const buckeyeInvestment = {
  company: "Buckeye Investment Group",
  title: "Software Engineer Intern",
  dates: "May 2025 – Aug 2025",
  location: "Columbus, OH",
  headline: "Automation that pays engineers back in hours.",
  intro:
    "I replaced ad-hoc scripts with an event-driven automation platform and hardened the services underneath it.",
  lead: { value: "60+", unit: "hrs / month", label: "of engineering time reclaimed" },
  tickers: [
    { sym: "MANUAL", value: "−40%", label: "Manual engineering workflows" },
    { sym: "EXEC", value: "−30%", label: "Execution time · 15+ legacy services" },
    { sym: "INCDT", value: "−25%", label: "Recurring incidents · 30+ services" },
    { sym: "USERS", value: "20+", label: "Engineers served by the pipelines" },
  ],
  stories: [
    {
      kicker: "Automation",
      title: "An event-driven platform, not a folder of scripts",
      body: "Python, FastAPI and Kafka with idempotent consumers and retry/dead-letter handling, feeding schema-validated SQL data pipelines.",
    },
    {
      kicker: "Performance",
      title: "Provisioning, re-architected",
      body: "Parallel, dependency-aware task execution plus Redis caching of hot queries, shipped through zero-downtime Kubernetes rollouts on Azure DevOps CI/CD.",
    },
    {
      kicker: "Reliability",
      title: "Fixing incidents at the source",
      body: "Root-caused failures with distributed tracing and log correlation, then removed them with retry/timeout policies, connection-pool tuning and SLO-based alerting.",
    },
  ],
  stack: ["Python", "FastAPI", "Kafka", "Docker", "SQL", "Redis", "Kubernetes", "Azure DevOps"],
};

/* ───────────────────────── Projects ───────────────────────── */

export type Metric = { value: string; label: string; context: string };

export const inference = {
  slug: "llm-inference-platform",
  name: "llmserve",
  title: "Distributed LLM Inference Platform",
  headline: { a: "Every request,", em: "routed on purpose." },
  summary:
    "An OpenAI-compatible router in front of a pool of inference workers. It decides where each request goes using live queue depth, KV-cache pressure and prompt-prefix locality, sheds load before it hurts latency, and fails over when a worker dies.",
  stack: ["Python", "FastAPI", "vLLM", "Ray", "Kubernetes", "Triton", "CUDA", "Prometheus", "OpenTelemetry"],
  repo: "https://github.com/Mohamed101-4/llm-serving-platform",
  results: "https://github.com/Mohamed101-4/llm-serving-platform/blob/main/RESULTS.md",
  /** Measured numbers from RESULTS.md. Each carries the setup it was measured on. */
  metrics: [
    { value: "−31%", label: "p95 time-to-first-token", context: "prefix-aware vs round-robin · 22 RPS · 4 mock workers" },
    { value: "−98%", label: "p95 TTFT under 2× overload", context: "SLO-aware admission control on vs off · 44 RPS" },
    { value: "−14%", label: "p95 end-to-end latency", context: "real model · llama.cpp Qwen2.5-0.5B · 2 workers" },
    { value: "2→6", label: "workers in 32 s", context: "KEDA autoscaling on queue depth · kind cluster" },
  ] satisfies Metric[],
  features: [
    { title: "Prefix-aware routing", body: "Rendezvous hashing gives each shared prompt a home worker, balanced against live load." },
    { title: "SLO-aware admission", body: "Estimates TTFT per worker and returns 429 + Retry-After only when nobody can meet the SLO." },
    { title: "Disaggregated prefill / decode", body: "Separate worker pools speaking vLLM's KV-transfer protocol." },
    { title: "Failover before first byte", body: "Dead workers are detected by the scraper and retried elsewhere." },
    { title: "Triton INT8 kernel", body: "Weight-only W8A16 matmul validated against a PyTorch reference." },
    { title: "Observability", body: "Prometheus counters on every routing decision, traces on every stage." },
  ],
  caveat:
    "Routing and admission numbers were measured on simulated workers that expose vLLM's metrics; the latency number is from a real small model on a laptop. GPU benchmarks are next.",
};

export const agent = {
  slug: "autonomous-swe-agent",
  name: "swe-agent",
  title: "Autonomous AI Software Engineering Agent",
  headline: { a: "Four agents.", em: "One green test suite." },
  summary:
    "A LangGraph pipeline that takes a Python repo and a bug report, plans an investigation, localizes the faulty code with AST indexing and hybrid retrieval, writes a patch, and proves it by running the tests in a locked-down Docker sandbox — retrying with feedback when the patch fails.",
  stack: ["Python", "LangGraph", "PyTorch", "Docker", "PostgreSQL", "Claude API"],
  repo: "https://github.com/Mohamed101-4/autonomous-swe-agent",
  agents: [
    { id: "planner", name: "Planner", color: "#6D5EF5", body: "Reads the issue and decides what to investigate: hypotheses, search terms, suspects." },
    { id: "localizer", name: "Localizer", color: "#0EA5A4", body: "Ranks functions from a Python AST index with BM25 + sentence-embedding retrieval." },
    { id: "patcher", name: "Patcher", color: "#E8590C", body: "Writes exact search/replace edits on an isolated copy and produces a diff." },
    { id: "verifier", name: "Verifier", color: "#2B8A3E", body: "Runs pytest in a no-network, read-only sandbox and turns failures into feedback." },
  ],
  /** Verified facts from the repository README (measured 2026-11-14). */
  facts: [
    { value: "68", label: "tests passing in CI" },
    { value: "10/10", label: "eval bugs reproduce with hidden tests" },
    { value: "11/12", label: "SWE-bench Verified pytest instances runnable" },
    { value: "6", label: "configs: full system, baseline, 4 ablations" },
  ],
  sandbox: ["--network none", "non-root", "read-only FS", "512 MB · 1 CPU", "caps dropped", "timeout kill"],
  caveat:
    "The demo replays the repository's offline scenario with scripted LLM replies. Real-model evaluation results will be added once the eval has run.",
};

export const buckeyePlanner = {
  name: "BuckeyePlanner",
  title: "Degree audit platform",
  scale: "60,000+",
  scaleLabel: "students the platform is designed to support",
  summary:
    "A degree audit engine for Ohio State: a Java/Spring Boot graph traversal engine validates prerequisites across 200+ programs and recommends what to take next.",
  metrics: [
    { value: "200+", label: "Academic programs" },
    { value: "+25%", label: "Recommendation accuracy" },
    { value: "−80%", label: "Deployment time" },
  ],
  stack: ["Java", "Spring Boot", "PostgreSQL", "Docker", "AWS EKS", "CI/CD"],
};

/* ───────────────────────── Leadership & education ───────────────────────── */

export const leadership = {
  org: "Minorities in Technology at Ohio State",
  role: "Chapter Founder & President",
  dates: "Aug 2025 – Present",
  from: 30,
  to: 100,
  statement: "I started a chapter. We built a community.",
  body:
    "I founded Ohio State's Minorities in Technology chapter to give students who don't always see themselves in tech a room full of people who do. We tripled in a year.",
  pillars: [
    { title: "Weekly technical workshops", body: "Hands-on sessions every week, from first commits to interview prep." },
    { title: "Hiring pipelines", body: "Connections with recruiters and engineers at Microsoft, Google and LinkedIn." },
    { title: "A real engineering community", body: "Peers who review each other's code, résumés and plans." },
    { title: "Professional development", body: "Career support for students pursuing roles in technology." },
  ],
  partners: ["Microsoft", "Google", "LinkedIn"],
};

export const education = {
  school: "The Ohio State University",
  degree: "B.S. Computer Science and Engineering",
  minor: "Minor in Mathematics",
  location: "Columbus, OH",
  /** Coursework mapped to the work it shows up in (ids match `builtWork`). */
  courses: [
    { name: "Distributed Systems", built: ["llmserve", "visa"] },
    { name: "Operating Systems", built: ["llmserve", "nvidia"] },
    { name: "Computer Architecture", built: ["nvidia", "llmserve"] },
    { name: "Applied Machine Learning", built: ["research", "agent"] },
    { name: "Database Systems", built: ["planner", "big"] },
    { name: "Data Structures & Algorithms", built: ["planner", "agent"] },
    { name: "Computer Networking", built: ["visa", "big"] },
    { name: "Discrete Structures", built: ["planner"] },
  ],
};

export const builtWork = [
  { id: "visa", name: "Visa lounge platform", href: "#visa" },
  { id: "big", name: "BIG automation platform", href: "#big" },
  { id: "llmserve", name: "llmserve", href: "#inference" },
  { id: "agent", name: "swe-agent", href: "#agent" },
  { id: "research", name: "Play-calling model", href: "#research" },
  { id: "nvidia", name: "GPU computing (NVIDIA DLI)", href: "#nvidia" },
  { id: "planner", name: "BuckeyePlanner", href: "#buckeyeplanner" },
];

export const skills = {
  Languages: ["Python", "Java", "TypeScript", "Go", "C++", "Kotlin", "C#", "SQL"],
  Systems: ["Kubernetes", "Docker", "Kafka", "Redis", "PostgreSQL", "AWS", "Azure"],
  "AI & GPU": ["vLLM", "PyTorch", "CUDA", "Triton", "TensorRT", "LangGraph"],
  Frameworks: ["Spring Boot", "FastAPI", "React", "Node.js", "JUnit"],
};
