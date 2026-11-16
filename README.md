# Mohamed Ali — Portfolio

Personal portfolio built with Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4 and Motion.

## Concept: "Every Scale"

Each section is a different scale of engineering, marked by a map-legend style `SCALE · …` label, and each has its own colour climate:

| # | Section | Scale | Look |
|---|---|---|---|
| — | Hero | — | Ivory paper, portrait, scale headline, short about-me, cursor-reactive dot field |
| 01 | Visa | Global | Midnight navy, champagne gold, layered 3D lounge pass, globe horizon, boarding-gate timeline, split-flap board |
| 02 | Buckeye Investment Group | Platform | Salmon broadsheet, forest-green ink, ticker tape |
| 03 | OSU Athletics research | Stadium | Charcoal turf, scarlet & gray, play diagram |
| 04 | NVIDIA DLI | Silicon | Black & NVIDIA green, SM grid |
| 05 | llmserve | Cluster | Graphite control room, routing simulator |
| 06 | swe-agent | Codebase | Light IDE, scripted replay of the repo demo |
| 07 | BuckeyePlanner | Campus | Paper, conceptual planner UI |
| 08 | Leadership | Community | White Out tiger-stripe scroll scene |
| 09 | Studied → Built | Foundation | Coursework connected to the work it shows up in, plus toolkit |
| — | Contact | — | Ink with signal orange |

## Editing content

All facts, metrics and links live in **`content/site.ts`**. Components never hard-code résumé facts, so to update a role, a metric or a link, edit that file only.

- Portrait: `public/mohamed.jpg`
- Deployed domain: `profile.siteUrl` in `content/site.ts` (used for SEO metadata and the sitemap)

### Honesty rules baked into the content

- Inference metrics come from `llm-serving-platform/RESULTS.md`, and each one shows the setup it was measured on.
- The routing lab (`lib/inferenceSim.ts`) is a small illustrative simulator and is labelled as one.
- The agent demo replays the repository's own offline demo (scripted LLM replies) and is labelled as one.
- The globe's arcs connect major world cities for illustration; they are not Visa network data.
- BuckeyePlanner states the population it is designed to support, not active users.

## Develop

```bash
npm install
npm run dev
```

## Deploy

Push to GitHub and import the repository in Vercel. No environment variables are needed.

## Structure

```
app/                 layout (fonts, SEO, JSON-LD), page, robots, sitemap
content/site.ts      every fact on the site
components/Nav.tsx   floating nav that adapts to each section's tone
components/sections/ one file per section
components/viz/      canvas/SVG visualizations (globe, lounge card, routing lab, IDE, stripes)
                     (no résumé is hosted on the site; LinkedIn covers it)
components/ui/       shared primitives (Reveal, CountUp, ScaleMarker, Icon)
lib/inferenceSim.ts  illustrative serving simulator
```

Animations respect `prefers-reduced-motion`, and canvases pause when they are off screen.
