@AGENTS.md

# Project: sv-tanim.social (Slidein Venture)

Marketing/portfolio site for Tanim's video editing + cold email outreach business. Single Next.js app, no backend/database — content is authored in TypeScript files and rendered statically/client-side.

## Tech stack

- **Framework:** Next.js 16 (App Router, Turbopack), React 19, TypeScript
- **Styling:** Tailwind CSS v4 (`@tailwindcss/postcss`, CSS-first config — no `tailwind.config.js`), `tailwind-merge`, `class-variance-authority`, `clsx`
- **Design tokens:** single source of truth in `app/styles/tokens.css`, imported by `app/globals.css` alongside `type.css` (type roles) and `tone.css` (section tone/background contract). See `design-system.md` at repo root for the written spec.
- **Animation:** Framer Motion (`framer-motion`) for component-level motion, GSAP for anything timeline-driven
- **Components:** shadcn (`components.json`, style `base-nova`, icon lib `lucide`) generating into `components/ui/`; `@base-ui/react` primitives; `magicui` for a few decorative components
- **Diagrams/flows:** `@xyflow/react` (React Flow) powers the node-based flow diagrams (`components/CompleteFramework/flow`, `components/PitchDeck/flow`)
- **Fonts:** self-hosted variable font "Switzer" (`app/fonts/`, wired in `app/fonts.ts`)
- **Testing:** Playwright (`tests/`, `playwright.config.ts`) for visual/theme/tone specs; `@axe-core/playwright` for accessibility
- **Linting:** ESLint (`eslint-config-next`) + Stylelint (`.stylelintrc.json`)

## Folder layout

```
app/                  Next.js App Router routes (pages only: /, /contact, /insights, /pricing, /process)
  fonts/               Self-hosted Switzer font files + license
  styles/              tokens.css (design tokens), type.css, tone.css — imported by globals.css
components/            All React components, grouped by feature/section
  Framework/            "The Framework" homepage diagram (FrameworkEngines.tsx is the one currently mounted on `/`)
  Process/               ProcessFlowChart.tsx, the flow diagram mounted on /process
  PitchDeck/             Pitch deck flow diagrams
  Hero/, Navbar/, Footer/, Pricing/, Process/, Contact/, ...  section-specific components
  ui/                    shadcn-generated primitives
  magicui/               decorative/animated components
content/               Copy and structured content as TypeScript modules (framework.ts, contact.ts, steps/) — the single source of truth the components read from, so copy changes happen here, not in JSX
lib/utils.ts           Shared helpers (`cn()` classname merge, etc.)
public/                Static assets (images, videos, icons)
scripts/               Node maintenance scripts (sanitise-steps.mjs runs pre-build, plus icon/color-migration/contrast tools)
tests/                 Playwright specs
docs/                  Misc project docs
```

Root-level `*.png` / `audit-*.txt` files are one-off design-audit artifacts from past sessions (contrast/radius/font audits, squint tests) — not build inputs, safe to ignore unless doing a similar audit.

## Deployment: GitHub → Vercel

- **Git remote:** `origin` → `https://github.com/sheikhmdnasrullah-dotcom/sv-tanim.social.git`, default branch `main`.
- **Hosting:** Vercel, connected directly to the GitHub repo via Vercel's native Git integration — there is no GitHub Actions CI in `.github/`; Vercel's own webhook builds and deploys on every push.
  - Push to `main` → Vercel builds it as the **Production** deployment.
  - Push to any other branch, or open a PR → Vercel builds a **Preview** deployment with its own URL.
- No `vercel.json` in the repo, so the project uses Vercel's Next.js auto-detection (build command `next build`, framework preset "Next.js") rather than custom build config.
- `.vercel` is git-ignored — a maintainer has run `vercel link` locally to connect this working copy to the Vercel project, but that link is machine-local and not checked in.
- `next.config.ts` stamps the deployed commit SHA into `NEXT_PUBLIC_BUILD_SHA` (via `git rev-parse` at build time, falling back to the env var Vercel sets) so the site's own footer/corner label can show which commit is live.
- `scripts/sanitise-steps.mjs` runs as the `prebuild` npm script — Vercel's build always runs `npm run build`, which triggers this automatically before `next build`.

## Everyday commands

```bash
npm run dev      # Turbopack dev server, localhost:3000
npm run build    # prebuild (sanitise-steps.mjs) + next build
npm run start    # serve the production build
npm run lint     # ESLint
ANALYZE=true npm run build   # bundle analyzer report
```
