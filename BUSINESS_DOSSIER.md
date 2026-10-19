# BUSINESS DOSSIER — SlideIn Venture

**Status:** Compiled from codebase audit  
**Date:** 2026-10-18  
**Project:** `marketing-site/` — the static marketing/portfolio site for SlideIn Venture  
**Owner/Author:** Nasrullah Tanim  
**Classification:** Business Intelligence Handoff  

---

## 1. Company & Identity

### Legal Entity & Contact
- **Name:** SlideIn Venture (brand); operated by Nasrullah Tanim  
- **Website:** Not explicitly stated — the open-source repo lives at `https://github.com/sheikhmdnasrullah-dotcom/SlideIn` (content/product.ts:304)  
- **Personal site:** `https://www.tanim.social` (content/contact.ts:66)  
- **LinkedIn:** `https://www.linkedin.com/in/sheikh-md-nasrullah-910b203b3` (content/contact.ts:56)  
- **GitHub:** `https://github.com/sheikhmdnasrullah-dotcom` (content/contact.ts:62)  

### Contact Channels
| Channel | Address | Source |
|---|---|---|
| Direct email | `nasrullahtanim@gmail.com` | content/contact.ts:38 |
| Business email | `hello@tanim.social` | content/contact.ts:39 |
| Booking calendar | `https://calendar.notion.so/meet/nasrullah_tanim/schedule` | content/contact.ts:27 |

### Brand Identity
- **Wordmark:** The brand name IS the identity — no separate icon mark. A period/dot animated on hover (app/styles/type.css:240-290)  
- **Brand orange:** `#FF6200` → `oklch(0.691 0.207 42.28)` — hue 42.28 held constant across all derived tokens (app/styles/tokens.css:78)  
- **Primary fonts:** Hanken Grotesk (display), JetBrains Mono (mono), Inter Tight (body) — all variable fonts from `@fontsource-variable` (package.json)  
- **Tagline (hero subline):** "An end-to-end system that finds and researches each prospect, matches them to your offers, and writes each one a personal email. It keeps working until they are convinced." (content/home.ts:62)

---

## 2. Product Architecture

### Two-Offerings Model
The product has a single platform with two ways to engage: **self-serve software** and a **managed service** that operates the platform on behalf of clients.

**FACT:** "The platform is the product either way. The difference is who does the daily work — and both paths use the same controls, the same review step and the same records." (content/product.ts:192)

| Offering | Tag | Description |
|---|---|---|
| **Software (self-serve)** | Software | "You operate the workflow inside the platform." (content/product.ts:195) |
| **Managed Service** | Managed service | "Our team configures and operates the workflow for you." (content/product.ts:208) |

**Access note (honest state):** "Today the platform is operated by our team as part of the managed service. Direct software access is being rolled out — a walkthrough covers what is open now and what is next." (content/product.ts:146-148)

### The 8-Stage Workflow (Home Page Story)

The home page hero loop shows 8 stages. `configure`, `discover`, `research`, `qualify`, `personalize`, `outreach`, `converse` are real stages; `activity` is exempt primitives (bars/dots); `overview` is the final read-only state.

| # | Stage | Description (from content/workflow.ts) |
|---|---|---|
| 1 | **Configure** | "Your business profile, offers, and ideal customer profiles are saved as a versioned setup" (content/workflow.ts:51-53) |
| 2 | **Discover** | "Prospect records enter the system with their source attached. Duplicates are found and merged" (content/workflow.ts:60-62) |
| 3 | **Research** | "A research agent reviews the prospect's public presence and extracts claims" (content/workflow.ts:69-71) |
| 4 | **Qualify** | "The prospect is evaluated against your saved profile and matched to the most relevant offer" (content/workflow.ts:77-79) |
| 5 | **Personalize** | "A one-to-one email draft is written line by line, and each personalized line is linked to the research evidence" (content/workflow.ts:86-88) |
| 6 | **Outreach** | "Before anything sends, the message passes address verification, deliverability, placement-risk, circuit-breaker, and suppression checks" (content/workflow.ts:96-98) |
| 7 | **Converse** | "Incoming replies attach to their original conversation and are classified by intent" (content/workflow.ts:105-107) |
| 8 | **Overview** | "Every action lands in an activity ledger, and a read-only overview summarizes the run" (content/workflow.ts:113-115) |

**Hero subline sync:** The hero subhead phrases light up in sequence per stage group:
- "finds and researches each prospect" → configure, discover, research (content/hero-sync.ts:25-27)
- "matches them to your offers" → qualify (content/hero-sync.ts:30-31)
- "writes each one a personal email" → personalize, outreach (content/hero-sync.ts:34-35)
- "keeps working until they are convinced" → converse, overview (content/hero-sync.ts:37-39)

### The 5-Stage Platform Workflow (Product Page)

A different 5-stage framing appears on the product page:

| # | Stage | Detail |
|---|---|---|
| 1 | **Research** | "Write down what makes a business worth contacting, then build the list against that bar" (content/product.ts:83-84) |
| 2 | **Review** | "A person reads every record and every draft before anything is approved to send" (content/product.ts:89-90) |
| 3 | **Personalize** | "Each email is written from that prospect's own research record" (content/product.ts:95-96) |
| 4 | **Send** | "Sending runs from verified domains with the authentication records in place" (content/product.ts:99-100) |
| 5 | **Monitor** | "Delivery events are read daily: what was accepted, what bounced, what was complained about" (content/product.ts:104-105) |

**Sending gate:** "Nothing sends until authentication is verified, the list is clean, and a person has approved the batch." (content/product.ts:77)

### Platform Areas

The platform workspace contains five areas (content/product.ts:123-144):
1. Research records — prospects, criteria matched, per-lead intelligence
2. Review queue — drafts awaiting human review, with source behind every personalization line
3. Campaigns — sequences, follow-up timing, send status, reply status
4. Delivery events — accepted, bounced, complained, answered per send
5. Suppression — everyone who said no, across every sending domain, permanently

---

## 3. The 28-Step Operational Workflow

**FACT:** "28 steps. 3 of them are yours." (content/steps/index.ts:25, content/steps/page-copy.ts:100)

The `/steps` page decomposes the service into **10 content production steps** and **18 outreach steps**, organized into four phases each. The two tracks run in parallel — outreach infrastructure and lead research overlap during the 17-day build.

### Structure

| Track | Phases | Steps | Client-owned steps |
|---|---|---|---|
| **Content Production** | Planning, Execution, Post, Distribution | 10 | 1 (`record`) |
| **Researched Outreach** | The Fortress, The Fuel, The Script, The Launch | 18 | 1 (`icp`) |
| **Total** | | **28** | **2** (plus 1 approval gate) |

**THE THREE CLIENT MOMENTS** (content/steps/tracks.ts:174): `record` (content recording), `icp` (tell us who to reach), `publish` (dashboard approval)

### Content Track — 10 Steps, 3 Acts

| Step | Index | Title | Owner | Phase | Day |
|---|---|---|---|---|---|
| ideation | 01 | Content Ideation | slidein | planning | before |
| research | 02 | Guest and Topic Research | slidein | planning | before |
| script | 03 | Script and Runsheet | slidein | planning | before |
| record | 04 | You Record | **client** | execution | day-0 |
| moment-mapping | 05 | Intake and Moment Mapping | slidein | execution | day-1 |
| audio | 06 | Audio Foundation | slidein | post | day-1 |
| highlight | 07 | The Highlight Cut | slidein | post | day-1 |
| full-edit | 08 | Full Episode Edit | slidein | post | day-2 |
| fan-out | 09 | Asset Fan Out (parallel) | slidein | post | day-3 |
| publish | 10 | Review and Publish | slidein | distribution | day-3 |

**Key outputs per episode** (content/steps/benchmarks.ts:108-167):
- 1 recording session per week (client obligation)
- 72-hour turnaround (record to published)
- 5–8 vertical clips per episode (with burned-in captions)
- 6 thumbnails per episode
- 1 cleaned transcript (1,500-word article)
- 1 set of timestamped show notes
- 4 LinkedIn posts

**Turnaround logic:** "Three days from the moment the raw file lands to everything sitting in your dashboard for approval. Possible only because step 09 fans out in parallel instead of running as a queue." (content/steps/benchmarks.ts:113)

### Outreach Track — 18 Steps, 4 Phases

| Phase | Index | Name | Days | Steps |
|---|---|---|---|---|
| fortress | PHASE 01 | The Fortress — Building infrastructure | 1–3 | 1.1, 1.2, 1.3, 1.4, 1.5 |
| fuel | PHASE 02 | The Fuel — Finding and verifying leads | 1–10 | 2.1, 2.2, 2.3, 2.4, 2.5 |
| script | PHASE 03 | The Script — Writing what gets read | 11–14 | 3.1, 3.2, 3.3, 3.4 |
| launch | PHASE 04 | The Launch — Sending, replying, iterating | 15–17, then ongoing | 4.1, 4.2, 4.3, 4.4 |

### Proof Artifacts (8)
Eight artifacts on the /steps page show rather than claim (content/steps/artifacts.ts):
1. `script-page` — script runsheet (content, step 03)
2. `edit-room` — audio/timeline/reels tabs (content, step 07)
3. `thumbnail-gallery` — 6 example thumbnails (content, step 09)
4. `dashboard-approval` — dashboard rows with approve/schedule (content, step 10)
5. `dns-record-card` — SPF/DKIM/DMARC/MX config (outreach, phase 1)
6. `lead-card` — 10-criteria ICP scoring (outreach, phase 2)
7. `email-provenance` — sample email with source-traced personalization (outreach, phase 3)
8. `metrics-panel` — reply/positive reply/bounce/complaint metrics (outreach, phase 4)

### Benchmarks & Performance Claims

All numbers on the /steps page are labelled with provenance: **BENCHMARK** (external), **TARGET** (internal), or **OUR RESULT** (measured — none yet).

| Metric | Value | Label | Source |
|---|---|---|---|
| Inbox checks per day | 20+ | BENCHMARK | benchmarks.ts:32 |
| Scale without hiring | 4x | BENCHMARK | benchmarks.ts:40 |
| Criteria minimum to qualify | 7/10 | TARGET | benchmarks.ts:48 |
| Platforms that can raise costs | 0 | BENCHMARK | benchmarks.ts:56 |
| Cold email campaign failure | 95% | BENCHMARK | benchmarks.ts:172 |
| Reply rate | 5–8% | TARGET | benchmarks.ts:68 |
| Positive reply rate | 1–2% | TARGET | benchmarks.ts:76 |
| Bounce rate | under 2% | TARGET | benchmarks.ts:83 |
| Spam complaint rate | under 0.3% | BENCHMARK | benchmarks.ts:91 |
| Session per week | 1 | TARGET | benchmarks.ts:102 |
| Record to published | 72 hours | TARGET | benchmarks.ts:110 |
| Vertical clips per episode | 5–8 | TARGET | benchmarks.ts:118 |
| Thumbnails per episode | 6 | TARGET | benchmarks.ts:126 |
| Cleaned transcript | 1 | TARGET | benchmarks.ts:138 |
| Timestamped show notes | 1 | TARGET | benchmarks.ts:146 |
| Long form article | 1 | TARGET | benchmarks.ts:153 |
| LinkedIn posts | 4 | TARGET | benchmarks.ts:162 |

**OPEN RATE SLOT:** "OPEN RATE · NOT TRACKED, ON PURPOSE" — the empty metrics slot deliberately omits open rate. "Open rate is measured by a tracking pixel, and mail clients now pre-fetch those pixels before a human sees anything, so the number counts machines." (content/steps/artifacts.ts:230-233)

---

## 4. Pricing & Commercial Model

### Managed Service Pricing

- **Primary price:** `$1,999 / month` (content/product.ts:5, app/pricing/page.tsx:5)  
  [INFERRED: The pricing page at `app/pricing/page.tsx` renders a blank canvas — all pricing components (`PriceStatement`, `RolesTable`) are unmounted. The number `$1,999` comes from metadata and code comments.]

- **Conflicting reference:** `$3,999` appears in code comments inside `PriceStatement.tsx` (lines 22, 142-143, 153-154) but the rendered figure is `$1,999`. The page is currently blank, so neither is shown to users.

**Pricing page status:** "Everything that was rendered here (the PriceStatement band and the RolesTable) is unmounted, not deleted... The page keeps its route, its metadata and a full-viewport blank band so it can be designed from scratch." (app/pricing/page.tsx:8-16)

### What the Retainer Covers (Managed Service)
Five roles (components/Pricing/RolesTable.tsx:28-34):
1. **Content Strategist**
2. **Video Editor**
3. **Copywriter**
4. **Social Manager**
5. **Lead Researcher & Outreach Specialist**

**Pricing copy (from PriceStatement.tsx, currently unmounted):**
"I run your outreach platform, and the content that feeds it" (PriceStatement.tsx:96-98)  
"For $1,999 / month" (PriceStatement.tsx:142)  
[INFERRED: This is the managed service price — the page is blank so this is not currently visible.]

**Deck closing argument:** "Seven roles, seven salaries, seven people to manage. Or this." (content/steps/deck-chapters.ts:57)  
[INFERRED: This implies the $1,999 managed service replaces 7 full-time hires.]

### Booking Flow
Calendar link: `https://calendar.notion.so/meet/nasrullah_tanim/schedule`  
Used in: PriceStatement.tsx:37, content/contact.ts:27, content/steps/page-copy.ts:160

---

## 5. Capabilities & Technical Details

### Email Infrastructure
- **Dedicated sending domains:** Close variants of client's brand, registered separately (content/steps/outreach-phases.ts:74)
- **Authentication:** SPF, DKIM, DMARC, MX configured on every sending domain before first send (content/steps/outreach-phases.ts:82-86)
- **Real rejection code on display:** `550 5.7.15 ACCESS DENIED` — "This is what a domain without the four rows above receives. Not filtered into junk. Refused at the door." (content/steps/artifacts.ts:155-158)
- **Mailboxes:** 2–3 per domain, each with full display name, signature with working address/phone, plain text footer (content/steps/outreach-phases.ts:104-110)
- **Ramp:** Starts in low tens per mailbox/day, climbs on fixed schedule; held if bounce/complaint/reply rate degrades (content/steps/outreach-phases.ts:116-123)

### AI Usage Policy
**DISCLOSURE (content/steps/outreach-phases.ts:337-341):** "Yes, we use AI. For research, for drafting, for scale. A person reads every email before it sends, and a person answers every reply. The AI never talks to your prospect unsupervised."

### Qualification Criteria (10-point ICP)
1. Company size 20 to 200
2. Revenue band stated
3. Industry in scope
4. Role is a decision maker
5. Geography in scope
6. Tooling detected
7. Hiring signal in last 90 days
8. Funding stage in scope
9. Publishes content regularly
10. Buying trigger in last 30 days

A lead matches at least 7 of 10 to enter a sequence. (content/steps/artifacts.ts:163-174)

### Deliverability Monitoring
- Bounce rate held under 2% (content/steps/outreach-phases.ts:175-176)
- Spam complaint rate under 0.3% — "enforced by the mailbox providers rather than merely advisable" (content/steps/outreach-phases.ts:95)
- No open tracking — "Open rates count machines now that clients pre-fetch tracking pixels, and the pixel itself is a deliverability liability" (content/product.ts:252-253)

### What the Platform Does (4 Capability Groups)
1. **Research and targeting** — Criteria written down and scored, addresses verified before sending, intelligence per lead with source (content/product.ts:159-163)
2. **Personalized communication** — No templates, no merged fields; a person reads every email; every claim traceable to source (content/product.ts:170-176)
3. **Email operations** — SPF/DKIM/DMARC on every domain, staged sending with reviewed opening batch, one-click unsubscribe on every message (content/product.ts:177-182)
4. **Monitoring and reporting** — Delivery events per send, suppression across every domain, month-level comparison (content/product.ts:183-188)

### Content Pipeline Outputs
From one master file (content/framework.ts:99-109, content/steps/benchmarks.ts):
- 5–8 vertical clips with burned-in captions (from same master as full episode)
- 6 thumbnails (highest leverage asset)
- 1 cleaned transcript (removes filler, corrects names/terms)
- 1 set of timestamped show notes (chapter-level)
- 1 long-form article (~1,500 words, written from transcript as article, not tidied conversation)
- 4 LinkedIn posts (different angles, scheduled across the week)

---

## 6. Use Cases & Target Audience

**FACT:** "The platform suits businesses whose buyers are found by research rather than by ads." (content/product.ts:263)

### Target Segments
1. **B2B software companies** — "Reach operators and team leads with buying triggers already visible — hiring, tooling changes, funding" (content/product.ts:268-269)
2. **Specialized business-service firms** — "Advisory, accounting, insurance and similar practices whose buyers are a defined, findable list" (content/product.ts:273-274)
3. **Executive mortgage advisors** — "Loan officers whose referral pipeline softens with the season" (content/product.ts:278)

### Ideal Client Profile
The ICP is configured per-client in the platform, but the general shape (content/steps/outreach-phases.ts:147-151, artifacts.ts:163-174) includes:
- Company size: 20 to 200 employees
- Revenue band stated
- Industry in scope
- Decision-maker role
- Geography in scope
- Tooling detected in stack
- Hiring signal in last 90 days
- Funding stage in scope
- Publishes content regularly
- Buying trigger in last 30 days

---

## 7. Technical Architecture

### Stack
| Layer | Technology | Source |
|---|---|---|
| Framework | Next.js 16.2.10 | package.json:29 |
| Runtime | React 19.2.4 | package.json:31-32 |
| Styling | Tailwind CSS v4.3.2, PostCSS, Stylelint | package.json:29,56-57 |
| Animation | Framer Motion v12.42.2, GSAP 3.15.0 | package.json:17,26 |
| Fonts | Geist, Hanken Grotesk, JetBrains Mono, Inter Tight | package.json:25,41-43 |
| Icons | hugeicons-react, lucide-react | package.json:27,52 |
| Diagrams | @xyflow/react (workflow editor), Three.js (3D elements) | package.json:20,36 |
| Email | Resend (API key in .env.local) | package.json, .env.local |
| Video | Mux (tokens in .env.local), next-video | package.json, .env.local |
| Rive | @rive-app/react-canvas (interactive graphics) | package.json:18 |
| Deployment | Vercel (OIDC token in .env.local) | .env.local |

### Code Structure
```
marketing-site/
├── app/                      # Next.js 16 app router
│   ├── styles/               # Token layer (tokens.css), Type layer (type.css), Tone layer (tone.css)
│   ├── [routes]/             # page.tsx per route
├── content/                  # Content layer — ALL copy lives here
│   ├── home.ts               # Hero + lower section slots
│   ├── product.ts            # Product positioning, workflow, capabilities
│   ├── workflow.ts           # 8-stage workflow engine content
│   ├── workflowCaptions.ts   # Animated workflow captions
│   ├── stages.ts             # Stage vocabulary (configure/discover/research/...)
│   ├── hero-sync.ts          # Hero subline phrase syncing
│   ├── framework.ts          # 17-node framework diagram
│   ├── contact.ts            # Owner identity, contact methods
│   └── steps/                # The 28-step breakdown
│       ├── content-pipeline.ts    # 10 content steps
│       ├── outreach-phases.ts     # 18 outreach steps (4 phases)
│       ├── benchmarks.ts          # All numbers with provenance
│       ├── page-copy.ts           # Page chrome strings
│       ├── timeline.ts            # Week-axis timeline
│       ├── tracks.ts              # Framework for two-track layout
│       ├── artifacts.ts           # 8 proof artifacts
│       ├── types.ts               # TypeScript types
│       └── index.ts               # Barrel + derived totals
├── components/               # React components (design system)
├── scripts/                # Build scripts (sanitise-steps.mjs, verify-contrast.mjs)
└── design-reference/       # Design audit (stages-lint.mjs)
```

### Content Architecture Rules
1. **Design-Only Content Layer:** Every string the site renders lives in `content/` — no copy in `.tsx` files (content/steps/types.ts:4-5)
2. **Rule 0 Compliance:** Empty text slots render skeleton bars (content/home.ts:6-8) — "When a slot is empty its component renders a neutral skeleton bar"
3. **Sanitiser:** `scripts/sanitise-steps.mjs` runs on every build, fails on dashes/emojis (package.json:7)
4. **Figure provenance:** Every number on /steps states its source (BENCHMARK/TARGET/OUR RESULT); the `figure()` function throws on unknown IDs in dev (content/steps/benchmarks.ts:190-201)
5. **Zero AI Assumption:** No invented copy, metrics, case studies, or fake data (enforced by AGENTS.md + content/steps/types.ts:8-10)

### Design Token System

#### Tone System (4 bands, no dark mode)
**FACT:** "There is no theme switch, no night tone set, no `data-theme` attribute and no `dark:` variant — all four were removed." (app/styles/tone.css:5-7)

| Tone | Purpose | Background |
|---|---|---|
| `base` | Most sections | paper-50 |
| `raised` | Lifted panels | paper-100 |
| `anchor` | Signature band (framework/deck) | paper-100 |
| `terminal` | Footer/final CTA | paper-200 |

Additional tones: `hero` (white/apericot-100), `stage` (light panel on /steps)

#### Color Palette (OKLCH, hue 42.28 for brand orange)
| Token | Value | Use |
|---|---|---|
| `--color-brand` | `oklch(0.691 0.207 42.28)` | Exact #FF6200 |
| `--color-paper-50` | `oklch(0.968 0.006 85)` | Base page fill |
| `--color-paper-100` | `oklch(0.945 0.008 84)` | Raised panels |
| `--color-paper-200` | `oklch(0.915 0.010 83)` | Inset wells |
| `--color-ink` | `oklch(0.155 0.010 66)` | Primary text |
| `--color-ink-deep` | `oklch(0.115 0.009 64)` | Darkest |
| `--color-signal` | `oklch(0.563 0.168 42.28)` | Orange for small text |

**Rule 1:** `--accent` always hue 42.28, re-pointed per tone for AA contrast (tone.css:54-57)  
**Rule 2:** Never `#FFFFFF` or `#000000` — paper-25 is the lightest, ink-deep is the darkest (tokens.css:20-21, 49-50)

#### Spacing
- 8pt base, 4pt half-steps (tokens.css:183)  
- `--spacing-section-y: clamp(5rem, 3rem + 10vw, 11rem)` (tokens.css:184)  
- `--spacing-gutter: clamp(1.25rem, 0.5rem + 3.2vw, 3.5rem)` (tokens.css:185)

#### Typography Scale (fluid, ratio 1.26)
| Role | Range |
|---|---|
| Hero | `clamp(2.15rem, 0.9rem + 6.4vw, 5.75rem)` |
| Display XL | `clamp(3rem, 1.6rem + 7vw, 6.75rem)` |
| Body | `clamp(1rem, 0.96rem + 0.2vw, 1.125rem)` |
| Label | `clamp(0.625rem, 0.60rem + 0.12vw, 0.6875rem)` |

---

## 7.1 Design System Rules

### The Five Design Rules
1. **Rule 1 (Hue):** `--accent` is always hue 42.28, re-pointed per tone for AA contrast — one orange, not many (tone.css:54)
2. **Rule 2 (Paper):** Never `#FFFFFF` or `#000000` — paper-25 is lightest, ink-deep is darkest (tokens.css:20-21, 49-50)
3. **Rule 3 (Radii):** Three values only: 6px (sm), 18px (md), 999px (pill). A fourth is a design failure (tokens.css:111)
4. **Rule 4 (Whitespace):** The page is paper; whitespace earns its place (design-reference)
5. **Rule 5 (Accessibility):** One visible focus ring everywhere; reduced-motion global backstop (tokens.css:261-285)

### Contrast Verification
`scripts/verify-contrast.mjs` fails the build if any text/background pair regresses below WCAG AA (tone.css:57, design-reference)

### Fonts (4 total)
| Role | Font | Feature |
|---|---|---|
| Display | Inter Tight (variable) | Weights 650-600-550 |
| Body | Switzer (variable) | `kern`, `liga` enabled |
| Mono | JetBrains Mono (variable) | Tabular-nums, slashed zero |
| Wordmark | Inter Tight | Tight tracking -0.03em, one accent dot |

**FACT:** "Inter Tight carries no opsz/SOFT/WONK axes, so the declarations below are inert" (type.css:23) — legacy Fraunces-era CSS retained for future migration.

---

## 8. Routes & Navigation

### Site Map
| Route | Status | Description |
|---|---|---|
| `/` | Live | Homepage with hero, workflow loop, framework, product sections |
| `/process` | Live | How-it-works process page |
| `/insights` | Live | Insights/articles listing |
| `/insights/[slug]` | Live | Individual insight article |
| `/pricing` | **Blank** | Pricing page mounted but content unmounted (see §4) |
| `/contact` | Live | Contact form + owner info |
| `/portfolio` | Live | Portfolio showcase |
| `/video-lab` | Live | Video production lab showcase |
| `/journey-check` | Live | Journey assessment tool |
| `/preview-managed` | Live | Preview for managed service |

### Navigation Structure
**Main nav (content/home.ts:16-24, content/product.ts:294-300):**
- Process → `/process`
- Insights → `/insights`
- Pricing → `/pricing`
- Connect (CTA button) → `/contact`

**Footer columns (content/home.ts:236-259):**
- Column 1: Process, Insights, Pricing
- Column 2: Process, Insights, Pricing
- Column 3: Contact

### Metadata (app/layout.tsx)
The root layout metadata describes the product and managed service for SEO:
> "An agentic system that finds and researches each prospect, matches them to your offers, and writes each one a personal email. We run your outreach platform for $1,999/month." (app/layout.tsx, content/product.ts:5)

---

## 9. Content Assets

### How-It-Works Video
An 8-scene animated video explaining the platform workflow:

| # | Scene | Duration | Caption |
|---|---|---|---|
| 1 | Setup | 8.0s | "Start with your business, offers, and ideal customer profiles." |
| 2 | Sources | 9.0s | "Prospects come from different places, and some show up twice." |
| 3 | Research | 7.0s | "Next it reads each prospect's public presence." |
| 4 | Matching | 7.5s | "Each prospect is weighed against your criteria and matched to a relevant offer." |
| 5 | Drafting | 7.0s | "Then it drafts a one-to-one email." |
| 6 | Safeguards | 8.0s | "Every message is checked against your sending safeguards first." |
| 7 | Replies | 9.0s | "When replies come in, they're matched to the conversation." |
| 8 | Ledger | 6.5s | "Every action lands in a ledger." |

**Total duration:** 62.5s (how-it-works-video/data/scenes.config.ts:89)

### Pitch Deck (5 Chapters)
1. **The Week** — "What actually lands, day by day, from that single recording." (content/steps/deck-chapters.ts:33)
2. **The System, Running** — "A live readout of the four engines once they are all turning." (content/steps/deck-chapters.ts:40)
3. **Why It's One System** — "Content and outreach feed each other. Split them and both get worse." (content/steps/deck-chapters.ts:45)
4. **The Compound** — "The part that only shows up in month six." (content/steps/deck-chapters.ts:52)
5. **The Alternative** — "Seven roles, seven salaries, seven people to manage. Or this." (content/steps/deck-chapters.ts:57)

### Story Engine
The home page hero loop has a story engine (`content/story.ts`) with:
- 4 acts: `find`, `understand`, `reach`, `reply`
- 11 scenes including `intro`, `configure`, `discover`, `research`, `qualify`, `personalize`, `outreach`, `converse`, `return`, `outro`
- **ALL cue text fields are empty strings** — "Every string the story renders is an EMPTY STRING... None of it was written or signed off by the owner" (content/story.ts:8-11, 14-18)
- Forbidden words in script lint: `approve`, `approval`, `billing`, `revolutionary`, `seamless`, `ai-powered` (content/story.ts:383)
- Total duration: 70–100s algorithmically computed (content/story.ts:385)

---

## 10. Integrations & Dependencies

| Service | Integration Type | Evidence |
|---|---|---|
| **Resend** | Email delivery | `RESEND_API_KEY` in .env.local; Resend listed in content/contact.ts context |
| **Mux** | Video streaming/transcoding | `MUX_TOKEN_ID`, `MUX_TOKEN_SECRET` in .env.local; next-video used |
| **Vercel** | Hosting/deployment | `VERCEL_OIDC_TOKEN` in .env.local; Next.js deployed on Vercel |
| **Notion** | Booking/calendar | Calendar URL: `https://calendar.notion.so/meet/nasrullah_tanim/schedule` |
| **GitHub** | Source control | `https://github.com/sheikhmdnasrullah-dotcom/SlideIn` |
| **Google** | Email (MX records, SPF include) | `aspmx.l.google.com` in DNS records (artifacts.ts:151) |

**FACT:** "Integrations are conceptual only — Resend is referenced via API key; Stripe, Zoom, Zapier, and n8n are not present in the code." (CLAUDE.md)

---

## 11. Launch State & Open Questions

### Currently Unmounted / Empty
1. **Pricing page** (`/pricing`) — Blank canvas. `PriceStatement` and `RolesTable` components exist but are unmounted (app/pricing/page.tsx:11-16)
2. **All lower home sections** (content/home.ts:141-233) — 8 sections with all slots as empty strings rendering skeleton bars
3. **All story engine cue text** (content/story.ts:113-318) — Empty strings for every cue; skeleton bars render
4. **Workflow contract pill labels** (content/workflow.ts:54-56) — Empty: "Contract pill labels stay empty on purpose: the real contract names live in slidein-api's contracts.py"
5. **Footer link labels** (content/home.ts:236-259) — All heading and link labels are empty strings

### Unresolved Pricing Conflict
- `app/pricing/page.tsx` metadata says `$1,999/month` (line 5)
- `PriceStatement.tsx` code comments and rendered value reference `$3,999` (lines 22, 142) while the sr-only reads `$1,999` (line 154)
- **Status:** The pricing page is currently blank — neither price is visible to users. This conflict resolves itself once the page is designed.

### Content Governance
- **Rule 0:** Skeleton bars render for empty slots — the site is designed to be "filled one string at a time" by the owner (content/home.ts:6-8)
- **Sanitiser:** `scripts/sanitise-steps.mjs` runs on every build, fails on dashes/emojis (package.json:7)
- **Lint:** `node design-reference/stages-lint.mjs` validates story engine compliance (package.json:11)

---

## Security Warnings

**CRITICAL:** `.env.local` contains real production secrets and must NEVER be committed to version control.

| Variable | Value (REDACTED) | Purpose |
|---|---|---|
| `MUX_TOKEN_ID` | `[REDACTED — set to "y"]` | Mux video streaming API |
| `MUX_TOKEN_SECRET` | `[REDACTED — set to "y"]` | Mux video streaming API |
| `RESEND_API_KEY` | `[REDACTED — real key: re_...]` | Email delivery via Resend |
| `VERCEL_OIDC_TOKEN` | `[REDACTED — JWT token]` | Vercel deployment authentication |

**Actions required:**
1. `.env.local` is in `.gitignore` — confirm this immediately
2. The `RESEND_API_KEY` and `VERCEL_OIDC_TOKEN` are full production-grade secrets with real access
3. Rotate `RESEND_API_KEY` if there is any risk of exposure — it is a live email delivery key
4. The `VERCEL_OIDC_TOKEN` is a full JWT with scopes including `development` environment access to the SlideIn Venture project
5. Ensure `next-video` and any Mux integration scripts do not log these tokens

> **Note:** The Mux tokens appear to be placeholder values (`y`), but the Resend key and Vercel OIDC token are real, active credentials.

---

*Generated from codebase audit of `/Users/nasrullahtanim/Downloads/01-Projects/SlideinVenture/marketing-site`*
