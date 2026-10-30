# Shared brief: one portfolio, nine visual worlds

You are building ONE visual world of Pragati Srivastava's developer portfolio. Eight other worlds are being built at the same time by other agents in the same repo. The owner will compare all nine and choose one, so yours must be a complete, finished, working portfolio, committed fully to its world. Not a mockup, not a theme on a template.

The owner's words: "make the portfolio the best dev portfolio in the world", "use motion graphics and animation across the page but no AI slop", "why are we keeping this email address raw - why not use a mail icon", "add games in it whose CTA is contacting Pragati".

## Repo and environment

- Project root: `C:\Users\Admin\OneDrive\Desktop\PS Portfolio\Pragati-Srivastava-Portfolio` (Windows; Git Bash and PowerShell available).
- Next.js 16.4 App Router with Turbopack, React 19.3, Tailwind CSS v4 (`@import "tailwindcss"` in `app/globals.css`), TypeScript strict, `motion` 12 (`import { motion } from "motion/react"`).
- `next.config.ts` has `cacheComponents: true`. Never call `Math.random()`, `Date.now()`, or `new Date()` during render or in a server component. Seed game RNG in an event handler or `useEffect` (for example `createRng(Date.now())` on the Start click).
- Root layout (`app/layout.tsx`) already wraps everything in `<MotionConfig reducedMotion="user">` and renders a "Compare directions" switcher fixed at bottom-right. Keep the bottom-right 260x60 px corner free of important controls.
- A dev server is ALREADY running at http://localhost:3000. Do not start, stop, or restart it. Do not run `next build` (it fights the dev server over `.next`). Do not run `npm install` or change `package.json` (other agents share `node_modules`). If you need physics, a QR code, or similar, write it yourself.

## Your write boundary

You may create and edit ONLY:
- `app/worlds/<slug>/**` (your route: `page.tsx`, optional `layout.tsx` for fonts/metadata, optional route CSS module)
- `components/worlds/<slug>/**`
- `public/worlds/<slug>/**` (assets you author or download; keep a `SOURCES.md` there with origin and license of anything downloaded)
- Your own scratch folder for scripts and screenshots: `C:\Users\Admin\AppData\Local\Temp\claude\C--Users-Admin-OneDrive-Desktop-PS-Portfolio\ec7890c1-0888-43b8-a6b6-2f247e37aad7\scratchpad\worlds\<slug>\`

Read-only for you (import from them, never edit): `lib/content.ts`, `lib/games/*`, `lib/worlds.ts`, `components/icons.tsx`, `PRODUCT.md`, everything else. If shared code has a real bug, describe it in your report instead of editing it.

## Content (all facts come from `lib/content.ts`)

Read `PRODUCT.md` and `lib/content.ts` first. Every fact on the page comes from `lib/content.ts`. You may rewrite phrasing to fit your world's voice, but never add a fact, metric, quote, date, testimonial, employer, user count, star count, or claim that is not there. Demo data inside games is fine when labeled with the disclaimer constants from `lib/games/*`.

Required coverage, all findable within seconds:
- Who she is, what she builds, and the email action, all inside the first viewport at 1440x900 and at 390x844. Recruiters decide in about ten seconds; engineers dig deeper afterwards.
- Portrait `/pragati.jpg` (400x400 source). Never render it larger than 200 CSS px on any side. Use `next/image` or `<img>` with explicit width and height.
- Experience (CSRBOX internship), all three projects, both merged PRs, recognition, skills, education.
- Contact as icons with labels: mail (primary: "Email Pragati", `links.mailto`), LinkedIn, GitHub, Resume PDF (`links.resume`). Use `<Icon name="mail" />` etc. from `components/icons.tsx`. The email address must not be a raw text headline or a bare text link as the main contact. Offering a small "copy address" control is fine.
- A depth control for the two audiences is encouraged: a short recruiter read by default and a detailed engineer read on demand, as an honest whole-page state (not a hidden accordion per item). Name it in your world's own vocabulary.

## Games (required)

Build at least TWO games, each drawn in your world's own vocabulary, using the logic in `lib/games/`:
- `portHunt.ts` — "Boot the server", from PR #906. Call `createPortHunt(rng)`, `startPortHunt`, `tickPortHunt(state, dt, rng)` from a `requestAnimationFrame` or interval loop, `bindPort(state, port, rng)` on click/keypress, `autoFallback` to show what the PR does.
- `credibility.ts` — "Verify the report", from BharatRitu. `createCredibility`, `currentReport`, `stamp(state, verdict)`, `verdictFor`, `score`, `correctCount`. Show `DISCLAIMER`.
- `viva.ts` — a six-question quiz whose answers are on the page. `VIVA`, `grade`.
- `similarity.ts` — Cloud 9 cache demo. `lookup(cache, query)`, `SEED_CACHE`, `THRESHOLD`, show `CACHE_DISCLAIMER`.
- `rng.ts` — `createRng(seed)`, `pick`, `shuffle`.
- A world-native game of your own is welcome in addition, if it is grounded in her real work.

Every game:
- ends (win AND lose) on a clear call to action that emails Pragati (`links.mailto`), worded in your world's voice, plus "Play again";
- is fully keyboard playable with visible focus, and has a screen-reader-sensible structure (buttons are buttons, live results in `aria-live="polite"`);
- pauses its loop when off-screen or the tab is hidden, and has a calm static state under `prefers-reduced-motion`;
- never blocks reading the rest of the page and never traps focus.

## Design quality (Impeccable)

Read these before writing UI, and follow them:
- `.claude/skills/impeccable/reference/craft-floor.md` (quality floor and bans)
- `.claude/skills/impeccable/reference/mode-persuade.md` (mode rules; this surface is Experience mode: the work itself leads from the first viewport)
- `.claude/skills/impeccable/reference/animate.md` and `.claude/skills/impeccable/reference/delight.md` (motion and personality)

Hard rules:
- No eyebrow/kicker labels above headings. No gradient text. No glass/blur as decoration. No emoji or Unicode glyphs (arrows, checkmarks, stars) as icons: use `components/icons.tsx` or authored SVG. No hard offset block shadows unless your world truly is neobrutalist. No colored thick side-borders on cards. Monospace only for code, data, ports, error names, or where the world's medium is literally a character grid. No identical icon-heading-text card grids as the page structure. No "X+ years" hero-metric template.
- Display faces: self-host through `next/font/google` (or `next/font/local` with files in `public/worlds/<slug>/`). Avoid these overused defaults unless your world demands them and you can say why: Fraunces, Playfair Display, Cormorant, Lora, Crimson, Newsreader, Syne, Space Grotesk, Space Mono, IBM Plex, Inter as display, DM Sans, DM Serif, Outfit, Plus Jakarta Sans, Instrument Sans.
- Theme the browser surfaces from your palette: `::selection`, focus rings, caret, scrollbar, link underline offset, tabular numerals in data. Scope these to your page root (a class on your top-level element), never globally.
- Contrast: body text at least 4.5:1, large text at least 3:1.
- Motion: one authored signature moment plus a coherent motion grammar, not the same fade-up on every section. Exponential ease-out. Content visible by default.
- Responsive from 360 px to 1920 px wide with no horizontal overflow.

## Verify (required before you report)

1. `npx tsc --noEmit` from the project root. Fix every error in YOUR files; ignore errors in other agents' folders (they are mid-build).
2. `npx eslint app/worlds/<slug> components/worlds/<slug>` — zero errors.
3. `./.claude/skills/impeccable/scripts/impeccable detect app/worlds/<slug> components/worlds/<slug>` and `./.claude/skills/impeccable/scripts/impeccable detect http://localhost:3000/worlds/<slug>` — fix findings that are real.
4. Screenshots with the shared script (Playwright + Chromium are installed there):
   `node "C:\Users\Admin\AppData\Local\Temp\claude\C--Users-Admin-OneDrive-Desktop-PS-Portfolio\ec7890c1-0888-43b8-a6b6-2f247e37aad7\scratchpad\shots\capture.mjs" <url> <out.png> <width> <height> [--full] [--motion] [--wait=ms] [--click=css-selector ...]`
   It emulates reduced motion unless you pass `--motion`, reports page errors, and warns on horizontal overflow. Capture at least: 1440x900 first viewport, 1440 full page, 390x844 first viewport, 390 full page. Run it from the `shots` folder or pass the full path to node; Playwright resolves from that folder's `node_modules`, so `cd` into `...\scratchpad\shots` first.
   Open every screenshot with your image-reading tool and actually look. Fix what is broken, then capture again. Two inspection rounds maximum.
5. Drive each game at least once with a small Playwright script in your scratch folder (click Start, play, reach an end state, screenshot the end state with its email CTA).

## Report (under 300 words)

What you built (world, signature interaction, games), the files you created, the screenshot paths (absolute), the check results (tsc, eslint, detect), and any known issue or shared-code bug. Do not paste code.
