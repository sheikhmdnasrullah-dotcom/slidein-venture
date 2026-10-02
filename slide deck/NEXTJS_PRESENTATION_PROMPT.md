
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  THE MORTGAGE GROWTH SYSTEM
#  Master Engineering Prompt — Next.js Interactive Slide Deck
#  Built for the Mortgage & Home Loan Industry
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

> **COPY THIS ENTIRE DOCUMENT** into Cursor, Claude Code, Windsurf,
> or any AI coding tool. This is a fully self-contained engineering
> brief. Build the complete Next.js application without asking
> clarifying questions.

---

## ▸ WHO THIS IS FOR

This presentation is a **universal pitch deck** for any company in the
mortgage and home loan industry — regional lenders, multi-branch
mortgage companies, independent mortgage brokers, credit unions with
home loan divisions, direct-to-consumer lenders, and boutique
advisory firms.

Every slide, every pain point, every stat is written to resonate with
**any** mortgage decision-maker who watches it. The company name is
dynamically injected from a URL query parameter — so the same 19
slides serve as a personalized pitch for every company that visits.

---

## ▸ MISSION STATEMENT

Build a **cinematic, interactive 19-slide web presentation** — not a
slideshow library wrapper. A **purpose-built, pixel-perfect
presentation engine** with:

- Fluid blur-and-slide transitions (Framer Motion)
- Drag-to-navigate with real-time tilt feedback
- Keyboard + touch navigation
- Animated metric counters
- Fullscreen mode
- Slide overview grid
- Speaker notes drawer
- Dynamic `[Company Name]` via URL param

**Design target:** What happens when Stripe's design team and a senior
mortgage industry consultant build a deck together. Zero AI slop.
Zero clipart energy. Every element earns its position on screen.

---

## ▸ IDENTITY SYSTEM — DYNAMIC COMPANY NAME

The route `/presentation?company=Acme+Home+Loans` renders with
`"Acme Home Loans"` appearing everywhere a company name is referenced.

Fallback: `"your mortgage company"` when no param is provided.

```typescript
// components/presentation/CompanyContext.tsx
'use client';
import { createContext, useContext } from 'react';
import { useSearchParams } from 'next/navigation';

const CompanyContext = createContext<string>('your mortgage company');

export function CompanyProvider({ children }: { children: React.ReactNode }) {
  const params = useSearchParams();
  const company = params.get('company') ?? 'your mortgage company';
  return (
    <CompanyContext.Provider value={decodeURIComponent(company)}>
      {children}
    </CompanyContext.Provider>
  );
}

export const useCompany = () => useContext(CompanyContext);
```

Usage in any slide: `const company = useCompany();` then `{company}` inline.

---

## ▸ TECH STACK — EXACT VERSIONS

```bash
# Bootstrap
npx create-next-app@latest . \
  --typescript --tailwind --eslint --app --src-dir=false

# Dependencies
npm install \
  framer-motion@11 \
  lucide-react \
  clsx \
  class-variance-authority \
  @radix-ui/react-tooltip \
  @radix-ui/react-dialog \
  next-themes \
  use-debounce
```

| Layer       | Technology                        |
|-------------|-----------------------------------|
| Framework   | Next.js 14 — App Router, strict TS|
| Motion      | Framer Motion 11                  |
| Styling     | Tailwind CSS 3.4 (custom tokens)  |
| Icons       | lucide-react                      |
| Fonts       | Space Grotesk + Inter (next/font) |
| Utilities   | clsx, CVA                         |
| Theme       | next-themes (locked to dark)      |

---

## ▸ DESIGN SYSTEM

### Philosophy
Dark-first. Near-black backgrounds (not pure black — pure black reads cheap).
High-contrast orange used with surgical precision: active states, metrics,
callout bars, phase labels, hover edges. Never decorative. Never overused.
White text only for primary headings. Gray for everything else.

### Color Tokens — `tailwind.config.ts`

```typescript
colors: {
  bg: {
    deep:    '#080B12',  // slide stage — outermost layer
    base:    '#0D1117',  // slide background — primary surface
    surface: '#131920',  // card background — elevated surface
    muted:   '#1A2230',  // secondary card / table alternating row
    pop:     '#1F2A3C',  // hover / active card state
  },
  border: {
    dim:    '#1E2D42',   // default card border
    mid:    '#2A3F5A',   // elevated border
    bright: '#3B5B82',   // hovered / active border
  },
  text: {
    primary:   '#F0F4FF', // headings, key body
    secondary: '#8B9BB4', // captions, subtitles, labels
    muted:     '#4A5C75', // quiet annotations
    inverse:   '#080B12', // text on orange buttons
  },
  accent: {
    orange:       '#F97316',              // base accent
    orangeHot:    '#EA580C',              // hover / active
    orangeDim:    '#431407',              // subtle bg tints
    orangeGlow:   'rgba(249,115,22,0.12)',// ambient glow shadow
    orangeBorder: 'rgba(249,115,22,0.3)', // orange-tinted borders
  },
}
```

### Font Scale — `tailwind.config.ts`

```typescript
// Import via next/font/google:
// Space Grotesk: weights 600, 700, 800 → fontFamily.heading
// Inter: weights 400, 500, 600, 700 → fontFamily.body (default sans)

fontSize: {
  'hero':      ['3.2rem', { lineHeight:'1.1',  letterSpacing:'-0.04em', fontWeight:'800' }],
  'title':     ['2.1rem', { lineHeight:'1.15', letterSpacing:'-0.03em', fontWeight:'700' }],
  'sub':       ['1.05rem',{ lineHeight:'1.45', letterSpacing:'-0.01em', fontWeight:'500' }],
  'card-head': ['0.92rem',{ lineHeight:'1.3',  letterSpacing:'-0.01em', fontWeight:'700' }],
  'body':      ['0.85rem',{ lineHeight:'1.55', letterSpacing:'0',       fontWeight:'400' }],
  'label':     ['0.7rem', { lineHeight:'1',    letterSpacing:'0.1em',   fontWeight:'700' }],
  'metric':    ['3.8rem', { lineHeight:'1',    letterSpacing:'-0.05em', fontWeight:'800' }],
  'mono-tag':  ['0.72rem',{ lineHeight:'1',    letterSpacing:'0.06em',  fontWeight:'600' }],
}
```

### Recurring Design Motifs (must appear throughout)

| Motif | CSS | Purpose |
|-------|-----|---------|
| Orange left-bar | `border-l-[3px] border-accent-orange` | Importance marker on cards |
| Dot-grid stage | CSS `radial-gradient` repeated pattern | Background texture on stage |
| Glow halo | `shadow-[0_0_60px_rgba(249,115,22,0.12)]` | Featured metric cards |
| Frosted chrome | `backdrop-blur-xl bg-bg-base/80` | Header + footer bars |
| Mono phase label | `font-mono text-label text-accent-orange uppercase tracking-widest` | Phase identifiers |
| Gradient rule | `bg-gradient-to-r from-transparent via-accent-orangeBorder to-transparent h-[1px]` | Section dividers |
| Tech badge | `font-mono bg-bg-muted border border-border-dim rounded-md px-2 py-0.5 text-mono-tag text-accent-orange` | Infrastructure tags |

---

## ▸ APPLICATION ARCHITECTURE

```
app/
├── layout.tsx                     ← Root: fonts, dark theme, global CSS
├── page.tsx                       ← Homepage: embedded <PresentationViewer />
└── presentation/
    └── page.tsx                   ← Fullscreen mode (zero chrome)

components/
├── presentation/
│   ├── PresentationViewer.tsx     ← Root orchestrator + CompanyProvider
│   ├── SlideStage.tsx             ← 1440×900 viewport + scale system
│   ├── SlideRenderer.tsx          ← Lazy-loaded slide switcher
│   ├── ChromeHeader.tsx           ← Frosted top bar
│   ├── ChromeFooter.tsx           ← Frosted bottom bar with prev/next
│   ├── ProgressRail.tsx           ← 3px orange animated fill strip
│   ├── OverviewModal.tsx          ← 5-col thumbnail grid
│   ├── SpeakerNotesDrawer.tsx     ← Bottom slide-up panel
│   ├── LightboxModal.tsx          ← Full-screen image viewer
│   └── CompanyContext.tsx         ← Dynamic company name context
│
├── slides/
│   ├── Slide01.tsx   (Title)
│   ├── Slide02.tsx   (The Problem)
│   ├── Slide03.tsx   (6-Phase Architecture)
│   ├── Slide04.tsx   (Phase 1: Infrastructure)
│   ├── Slide05.tsx   (Phase 1: Agentic Dashboard)
│   ├── Slide06.tsx   (Phase 2: Content Engine)
│   ├── Slide07.tsx   (Phase 2C: Pitch Video)
│   ├── Slide08.tsx   (Phase 3: Resource Hub)
│   ├── Slide09.tsx   (Phase 3: Chatbot & Booking)
│   ├── Slide10.tsx   (Phase 4: LinkedIn-to-Lead Funnel)
│   ├── Slide11.tsx   (Phase 5: Deliverability Engine)
│   ├── Slide12.tsx   (Phase 5: Prospect Sourcing & Sequence)
│   ├── Slide13.tsx   (Phase 6: Show-Rate System)
│   ├── Slide14.tsx   (Full Funnel Diagram)
│   ├── Slide15.tsx   (Division of Work)
│   ├── Slide16.tsx   (Implementation Timeline)
│   ├── Slide17.tsx   (Investment & ROI)
│   ├── Slide18.tsx   (Next Steps)
│   └── Slide19.tsx   (Closing)
│
├── ui/
│   ├── Card.tsx            ← Base surface with variants
│   ├── PhaseFlowbar.tsx    ← 6-step horizontal flow
│   ├── FunnelDiagram.tsx   ← 7-stage vertical funnel
│   ├── DataTable.tsx       ← Dark-themed data table
│   ├── CalloutStrip.tsx    ← Orange-bordered emphasis bar
│   ├── MetricHero.tsx      ← Animated big-number display
│   ├── PointList.tsx       ← Dot-marked bullet list
│   ├── SectionLabel.tsx    ← Mono phase/section identifier
│   ├── OrangeDivider.tsx   ← Gradient horizontal rule
│   └── TechBadge.tsx       ← Monospace infrastructure tag
│
hooks/
├── useSlideNav.ts          ← Active slide state + navigation
├── useKeyboardNav.ts       ← Global keyboard shortcuts
├── useSwipeGesture.ts      ← Touch swipe detection
└── useScaleFactor.ts       ← Viewport → 1440×900 scale math

data/
├── slides.ts               ← All 19 slides typed as SlideData[]
└── speakerNotes.ts         ← Per-slide notes keyed by slide index

types/
└── slide.types.ts          ← All TypeScript interfaces
```

---

## ▸ MOTION ENGINE — FULL FRAMER MOTION SPECS

### 1 — Slide Transition (Primary)

```typescript
const EASE = [0.32, 0.72, 0, 1] as const; // Apple cinematic curve

const slideVariants: Variants = {
  enter: (dir: 'next' | 'prev') => ({
    x:      dir === 'next' ? '100%' : '-100%',
    opacity: 0,
    scale:   0.97,
    filter:  'blur(8px)',
  }),
  center: {
    x: 0, opacity: 1, scale: 1, filter: 'blur(0px)',
    transition: { duration: 0.5, ease: EASE },
  },
  exit: (dir: 'next' | 'prev') => ({
    x:      dir === 'next' ? '-55%' : '55%',
    opacity: 0,
    scale:   0.96,
    filter:  'blur(4px)',
    transition: { duration: 0.35, ease: EASE },
  }),
};
```

### 2 — Content Stagger (Per Slide)

```typescript
// Every slide wraps content in these two variants
const container: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.075, delayChildren: 0.15 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20, filter: 'blur(5px)' },
  visible: {
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { duration: 0.42, ease: EASE },
  },
};
```

### 3 — Drag-to-Navigate

```typescript
const dragX = useMotionValue(0);

<motion.div
  drag="x"
  dragConstraints={{ left: 0, right: 0 }}
  dragElastic={0.07}
  style={{
    rotateY: useTransform(dragX, [-300, 0, 300], [-5, 0, 5]),
    opacity: useTransform(dragX, [-300, 0, 300], [0.65, 1, 0.65]),
    x: dragX,
  }}
  onDragEnd={(_, { offset, velocity }) => {
    const swipe = Math.abs(offset.x) * velocity.x;
    if (swipe < -7000 || offset.x < -90) goNext();
    if (swipe >  7000 || offset.x >  90) goPrev();
  }}
/>
```

### 4 — Progress Rail

```typescript
const scaleX = (current - 1) / (total - 1);

<motion.div
  className="absolute bottom-0 left-0 h-[3px] bg-accent-orange origin-left w-full"
  animate={{ scaleX }}
  transition={{ duration: 0.45, ease: EASE }}
/>
```

### 5 — Card Hover (Spring Physics)

```typescript
<motion.div
  whileHover={{
    scale: 1.018,
    borderColor: 'rgba(249,115,22,0.45)',
    boxShadow: '0 12px 40px rgba(249,115,22,0.10), 0 0 0 1px rgba(249,115,22,0.18)',
  }}
  transition={{ type: 'spring', stiffness: 420, damping: 26 }}
/>
```

### 6 — Phase Active Pulse

```typescript
<motion.div
  animate={{
    boxShadow: [
      '0 0 0 0px rgba(249,115,22,0)',
      '0 0 0 6px rgba(249,115,22,0.18)',
      '0 0 0 0px rgba(249,115,22,0)',
    ],
  }}
  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
/>
```

### 7 — Metric Counter (Counts Up on Entry)

```typescript
// On slide mount: animate motionValue from 0 → targetNumber over 1.2s ease-out
// Display via useTransform → Math.round → template string
import { useMotionValue, useTransform, animate } from 'framer-motion';

useEffect(() => {
  const controls = animate(motionVal, target, { duration: 1.2, ease: 'easeOut' });
  return controls.stop;
}, []);
const display = useTransform(motionVal, v => `${Math.round(v)}${suffix}`);
```

### 8 — Speaker Notes Spring

```typescript
// Slightly overshoots for physical feel
transition: { type: 'spring', stiffness: 300, damping: 20 }
```

---

## ▸ VIEWPORT SCALING SYSTEM

Fixed internal resolution: **1440 × 900 px**. Scale to fit any container:

```typescript
// hooks/useScaleFactor.ts
const scaleFactor = Math.min(
  containerWidth  / 1440,
  containerHeight / 900
);

// Applied to the inner 1440×900 div:
// transform: `scale(${scaleFactor})`
// transformOrigin: 'top center'
// width: 1440, height: 900 (fixed — never responsive internally)
```

---

## ▸ COMPONENT SPECS

### `<Card>` — Core Surface

```
Base:     bg-bg-surface border border-border-dim rounded-xl p-5 relative overflow-hidden
Variant orange-bar: absolute left-0 top-0 h-full w-[3px] bg-accent-orange
Variant featured:   shadow-[0_0_60px_rgba(249,115,22,0.12)] border-accent-orangeBorder
All cards: motion.div with spring hover (spec above)
```

### `<SectionLabel>` — Phase Identifier

```
font-mono text-label text-accent-orange uppercase tracking-widest
Appears above every slide title. Always enters first in stagger.
Examples: "PHASE 1 OF 6" · "THE PROBLEM" · "THE FULL SYSTEM"
```

### `<PointList>` — Bullet System

```
Each item: flex items-start gap-3
Marker:    w-[6px] h-[6px] rounded-full bg-accent-orange mt-[7px] flex-shrink-0
Bold:      text-text-primary font-semibold
Body:      text-text-secondary font-normal
Size:      text-body leading-relaxed
```

### `<CalloutStrip>` — Bottom Emphasis

```
bg-accent-orangeDim border border-accent-orangeBorder border-l-[3px]
border-l-accent-orange rounded-lg px-4 py-3
Text: text-body font-medium text-text-primary
Bold prefix: text-accent-orange font-bold
```

### `<MetricHero>` — Big Number

```
bg-bg-surface border border-border-dim rounded-xl p-6 flex flex-col items-center
featured: shadow-[0_0_70px_rgba(249,115,22,0.14)]
Value:    font-heading text-metric text-accent-orange (animated counter)
Label:    font-heading text-card-head text-text-primary mt-2
Sub:      text-label text-text-muted uppercase tracking-wider mt-1
```

### `<PhaseFlowbar>` — 6-Phase Horizontal

```
Container: flex items-stretch gap-2 w-full
Phase box: flex-1 rounded-lg border border-border-dim bg-bg-surface p-3 text-center
Active:    border-accent-orange bg-bg-pop + pulse animation
Arrow:     text-accent-orange font-bold text-sm px-1 self-center flex-shrink-0
Num label: font-mono text-label text-accent-orange uppercase tracking-widest
Title:     text-card-head font-bold text-text-primary mt-1
```

### `<FunnelDiagram>` — 7-Stage Vertical

```
7 rows, each: flex items-stretch border border-border-dim rounded-lg overflow-hidden mb-2
Stage col (w-36): bg-bg-muted font-mono text-label text-accent-orange px-3 py-2.5 border-r border-border-dim
Phase col (w-44): bg-bg-surface text-label text-text-secondary px-3 py-2.5 border-r border-border-dim
Desc col (flex-1): bg-bg-base text-body text-text-primary px-3 py-2.5
Goal row:  stage col → bg-accent-orange text-text-inverse; border → border-accent-orange
Connector: between rows: 20px centered column w/ 1px line + ChevronDown icon in accent-orange
Animation: each row enters with itemVariants, 0.08s stagger from previous
```

### `<DataTable>` — Email Sequence

```
border border-border-dim rounded-xl overflow-hidden w-full
thead:   bg-bg-muted
  th:    text-label text-text-secondary uppercase tracking-wider px-4 py-3 border-b border-border-dim
tbody tr:odd  → bg-bg-surface
tbody tr:even → bg-bg-base
  td:    text-body text-text-primary px-4 py-3 border-b border-border-dim last:border-b-0
  td:first → font-semibold text-accent-orange
Row hover: bg-bg-pop transition-colors duration-150
```

### `<TechBadge>` — Infrastructure Tags

```
font-mono bg-bg-muted border border-border-dim rounded-md px-2 py-0.5
text-mono-tag text-accent-orange tracking-wide inline-flex
Used for: SPF · DKIM · DMARC · VPS · API · SMTP · TLS
```

---

## ▸ ALL 19 SLIDES — CONTENT & LAYOUT SPECS

> **Language Rule:** Every company-specific reference uses `{company}` from `useCompany()`.
> Content is written to be directly relevant to ANY mortgage lender or home loan provider.
> No hardcoded company names. No placeholder text.

---

### ═══ SLIDE 1 — TITLE ═══

**Layout:** Full-center, no cards, `bg-bg-deep` with radial orange glow + dot-grid.

```
[SectionLabel]
DIGITAL GROWTH & EMAIL CAMPAIGN SYSTEM

[H1 — text-hero font-heading, word-by-word stagger animation]
The System That Fills
[span text-accent-orange] Mortgage Advisors' Calendars

[Subtitle — text-sub text-text-secondary mt-5 max-w-2xl text-center]
A complete, done-for-you lead generation and outreach infrastructure
engineered to give {company}'s advisors a predictable pipeline of
qualified homebuyers — month after month, without paid advertising.

[OrangeDivider — mt-10 mb-8]

[Meta row — flex items-center gap-5 justify-center text-label text-text-muted uppercase tracking-wider]
6-Phase Architecture  ·  Done-For-You System  ·  Mortgage Industry Specific
```

**Motion:** Title words split on spaces — each enters with `y: 28→0, opacity: 0→1` at 0.05s stagger. Glow radial pulse animates continuously at 3s cycle.

---

### ═══ SLIDE 2 — THE PROBLEM ═══

**Layout:** SectionLabel + H1 + 3-column card grid + CalloutStrip

```
[SectionLabel] THE PROBLEM

[H1] Why Most Mortgage Companies
[orange] Bleed Leads Every Month

[Subtitle]
Three structural gaps in how the industry acquires homebuyer clients — and why fixing them is
the highest-leverage move any mortgage company can make right now.

[3 Cards — equal width, orange-bar variant, spring hover]

CARD 1 | "The 6 to 12 Month Invisible Window"
- Homebuyers actively research loan options, rates, and affordability for 6 to 12 months
  before ever contacting an advisor.
- Most mortgage companies have zero capture points during this high-intent research window.
- Competitors who appear during this window own the relationship before you say a word.

CARD 2 | "The Referral Dependency Trap"
- Pipelines built entirely on realtor referrals fluctuate with market cycles and personal
  relationships that can evaporate overnight.
- No owned marketing engine means no predictable lead flow — only hope and waiting.
- A single referral source going quiet can collapse 30% of a branch's pipeline instantly.

CARD 3 | "Local Search Invisibility"
- When a homebuyer searches for advisors in their city, most lenders simply do not rank.
- No optimized Google Business profiles. No local content. No search authority.
- The prospect calls whoever appears — and without a system, that is not {company}.

[CalloutStrip]
Bold: "Core Reality:"
Text: Every day without a structured digital acquisition engine is a day competitors capture
the high-value loan transactions that should belong to {company}'s advisors.
```

---

### ═══ SLIDE 3 — THE 6-PHASE ARCHITECTURE ═══

**Layout:** SectionLabel + H1 + PhaseFlowbar + 3-column summary cards + CalloutStrip

```
[SectionLabel] THE SOLUTION

[H1] The Mortgage Growth Engine:
[orange] 6-Phase Architecture

[Subtitle]
A compounding, interconnected system where each phase feeds and amplifies the next.

[PhaseFlowbar — Phase 1 active]
Phase 1: Foundation → Phase 2: Content → Phase 3: Resource Hub →
Phase 4: Lead Tools → Phase 5: Email Engine → Phase 6: Booked Calls

[3 Summary Cards]

CARD 1 | "Owned Infrastructure"
Technical deliverability setup, brand foundations, and advisor social presence that generate
warm inbound interest passively — 24 hours a day, 7 days a week.

CARD 2 | "Interactive Lead Capture"
Free mortgage calculators and financial tools that collect verified buyer budgets, timelines,
and intent data before a single outreach message is sent.

CARD 3 | "Precision Direct Outreach"
Hyper-personalized email sequences with embedded advisor video introductions, delivered to
primary inboxes at 80%+ placement rates — not spam, not promotions.

[CalloutStrip]
Bold: "End Result:"
Text: {company}'s advisors receive warm, pre-qualified consultation bookings with the buyer's
full financial profile already in hand before the first call.
```

---

### ═══ SLIDE 4 — PHASE 1: INFRASTRUCTURE ═══

**Layout:** SectionLabel + H1 + 2-column card layout + CalloutStrip

```
[SectionLabel] PHASE 1 OF 6

[H1] Building the
[orange] Engine Room

[Subtitle]
Configuring all technical deliverability infrastructure, brand footprints, and data
systems — before a single email is sent or a single prospect is contacted.

[Left Card — orange-bar] "Technical Setup"
- [TechBadge SPF] [TechBadge DKIM] [TechBadge DMARC] DNS authentication fully configured
- Dedicated outreach sending domains (primary {company} domain never touched)
- Automated mailbox warm-up protocol running over 2 to 4 weeks
- Private VPS server and email sending API deployed and tested
- Bounce, complaint, and unsubscribe handling fully automated

[Right Card — orange-bar] "Strategy & Brand Footprint"
- Ideal Client Profile (ICP) built: loan type, geography, income band, purchase timeline
- Life-event trigger mapping: lease expirations, job changes, city relocations, promotions
- Full social media audit across LinkedIn, Facebook, and Instagram
- Individual Google Business profile creation and optimization per licensed advisor
- Local SEO keyword mapping by city and metro market

[CalloutStrip]
Bold: "Why This Comes First:"
Text: Sending cold email without proper authentication or domain warm-up guarantees spam
placement. This phase ensures every subsequent outreach dollar actually reaches a real inbox.
```

---

### ═══ SLIDE 5 — PHASE 1: AGENTIC DASHBOARD ═══

**Layout:** Left = zoomable image (lightbox on click). Right = 3 stacked info cards.

```
[SectionLabel] PHASE 1 — OPERATIONS

[H1] Your Pipeline Command Center:
[orange] Every Lead. Every Advisor. One View.

[Subtitle]
A centralized dashboard where every prospect, task, and conversation is tracked,
enriched, and routed to the right advisor — automatically.

[Left: Zoomable Image]
src: /assets/01_phase1_infrastructure_dashboard.png
Click → LightboxModal with scale-in animation

[Right: 3 Stacked Info Cards]

CARD 1 | "Unified Prospect Database"
All inbound data from calculator completions, social interactions, email replies, and chatbot
conversations aggregates into a single master record per prospect.

CARD 2 | "Autonomous Data Enrichment"
Background AI agents continuously enrich each record with estimated purchase budget, target
city, loan program eligibility, and readiness timeline — before any outreach begins.

CARD 3 | "Intelligent Advisor Routing"
When a prospect qualifies, the system automatically assigns them to the licensed advisor
covering that geographic territory — zero manual routing.
```

---

### ═══ SLIDE 6 — PHASE 2: CONTENT ENGINE ═══

**Layout:** SectionLabel + H1 + 2-column cards + icon distribution row + CalloutStrip

```
[SectionLabel] PHASE 2 OF 6

[H1] Becoming the Trusted Voice
[orange] Before Asking for Anything

[Subtitle]
Establishing {company}'s advisors as the go-to local mortgage authorities through
consistent educational content — without demanding their time.

[Left Card] "Path A — Real Advisor Footage"
- 60-day script library created: rate explainers, homebuying FAQs, loan program breakdowns
- Advisors record 60-second answers using done-for-you written prompts
- Full post-production: captions, graphics, thumbnail design, and scheduling handled entirely
- All content positioned as education — zero sales pressure in the content itself

[Right Card] "Path B — AI Avatar (Zero Recording Time)"
- AI avatar built from advisor headshot + 2-minute voice sample
- 60 educational video assets generated and rendered in advance
- Automated publishing calendar across all channels
- Advisor appears consistently posting authority content without a single recording session

[Distribution Row — icon list, centered]
LinkedIn · Facebook · Instagram · YouTube · TikTok

[CalloutStrip]
Bold: "Authority Compound Effect:"
Text: Consistent educational content during a buyer's 6 to 12 month research window means
{company}'s advisors are the known, trusted face before a prospect ever picks up the phone.
```

---

### ═══ SLIDE 7 — PHASE 2C: THE PITCH VIDEO ═══

**Layout:** Left = MetricHero (featured, glow). Right = 3 stacked info cards + CalloutStrip.

```
[SectionLabel] PHASE 2C — VIDEO OUTREACH

[H1] Every Cold Email Gets
[orange] A Real Human Face

[Subtitle]
Embedding a personal advisor video introduction inside email outreach — generating 3x to 5x
higher reply rates compared to text-only cold email campaigns.

[Left: MetricHero — featured with glow]
Metric:  3–5×  (animated counter)
Label:   Higher Reply Rates
Sub:     Video thumbnail vs. text-only cold email

[Right: 3 Cards]

CARD 1 | "60 to 90 Second Personal Introduction"
Each advisor records — or the AI avatar renders — a personal introduction delivered as an
animated GIF thumbnail embedded inside Email #1 of every outbound campaign sequence.

CARD 2 | "Real-Time Video Engagement Tracking"
The system tracks every click, measures view duration in real-time, and immediately flags
advisors when a prospect watches — enabling perfectly timed follow-up calls.

CARD 3 | "Hyper-Localized Messaging"
Each video references the prospect's specific city, current local market conditions, and their
exact loan type interest — nothing generic, nothing templated.

[CalloutStrip]
Bold: "Industry Reality:"
Text: Homebuyers do not respond to email templates. They respond to a licensed professional
looking them in the eye and explaining precisely how they can help — right now.
```

---

### ═══ SLIDE 8 — PHASE 3: RESOURCE HUB ═══

**Layout:** SectionLabel + H1 + 2-column layout + CalloutStrip

```
[SectionLabel] PHASE 3 OF 6

[H1] The Interactive
[orange] Mortgage Resource Hub

[Subtitle]
A standalone digital property with free financial tools that capture high-intent homebuyer
data around the clock — no ads, no cold outreach required.

[Left Card — numbered list] "Interactive Tool Suite"
01  Mortgage Payment Calculator — real-time P&I, taxes, and insurance breakdown
02  Home Affordability Quiz — purchasing power based on income and existing debts
03  Rent vs. Buy Comparison — 5-year equity and net worth accumulation model
04  First-Time Homebuyer Checklist — downloadable loan readiness assessment guide
05  Refinance Savings Estimator — monthly and lifetime interest savings projection
06  VA Loan Eligibility Screener — instant service-member qualification check

[Right Card] "How It Captures Leads"
Step 1:  Prospect discovers the tool via social content or organic search
Step 2:  They input real financial parameters — income, debts, savings, city, timeline
Step 3:  Email required to unlock the complete personalized report
Step 4:  Captured data: name · email · location · purchase price · down payment · timeline · loan type
Step 5:  Data auto-syncs to advisor CRM and triggers territory routing

[CalloutStrip]
Bold: "Satellite Architecture:"
Text: Hosted on a dedicated satellite domain — moves quickly without touching the main
{company} website or requiring IT department involvement.
```

---

### ═══ SLIDE 9 — PHASE 3: CHATBOT & BOOKING ═══

**Layout:** Left = zoomable image. Right = 3 stacked info cards.

```
[SectionLabel] PHASE 3 — CONVERSION

[H1] Qualifying Visitors &
[orange] Booking Consultations Automatically

[Subtitle]
An AI-guided qualification flow and embedded booking system that fills advisor calendars
24 hours a day — no human scheduling required.

[Left: Zoomable Image]
src: /assets/04_phase3_resource_hub_chatbot.png

[Right: 3 Cards]

CARD 1 | "2-Minute Qualification Flow"
An AI-guided conversation gathers buying timeline, approximate credit tier, target home price,
loan type interest, and primary city — before connecting the prospect to a licensed advisor.

CARD 2 | "Direct Calendar Booking"
Qualified visitors select available slots synced directly to the assigned advisor's calendar.
No back-and-forth emails. No phone tag. One click to book.

CARD 3 | "Pre-Brief Advisor Dossier"
Before every consultation, the advisor receives the complete prospect profile: tool inputs,
chatbot responses, financial estimates, and timeline — the conversation starts fully informed.
```

---

### ═══ SLIDE 10 — PHASE 4: LEAD MAGNET FUNNEL ═══

**Layout:** Left = zoomable image. Right = tall Card with PointList + CalloutStrip.

```
[SectionLabel] PHASE 4 OF 6

[H1] Social Content as
[orange] High-Intent Lead Generation

[Subtitle]
Driving social audiences into mortgage tools that collect verified financial data —
before a single outreach message is composed.

[Left: Zoomable Image]
src: /assets/03_phase4_free_tools_lead_magnets.png

[Right: Tall Card — orange-bar]
Title: "What We Know Before Email #1 Is Sent"

- Full name and verified personal email address
- Phone number and preferred contact time
- Target city, metro area, or relocation destination
- Estimated purchase price range and available down payment
- Current rent amount and lease expiration date
- Buying urgency: immediate, 3 to 6 months, or still planning
- Loan program interest: conventional, FHA, VA, jumbo, or refinance

[CalloutStrip — below right card]
Bold: "The Strategic Difference:"
Text: Every outreach message references the exact numbers and property parameters the buyer
entered themselves. Not cold. Hyper-relevant. Impossible to ignore.
```

---

### ═══ SLIDE 11 — PHASE 5: DELIVERABILITY ENGINE ═══

**Layout:** Left = MetricHero (featured, glow). Right = Card with TechBadge-tagged PointList + CalloutStrip.

```
[SectionLabel] PHASE 5 OF 6

[H1] Email Infrastructure That
[orange] Actually Reaches the Inbox

[Subtitle]
Proprietary sending architecture structuring outreach with transactional-grade headers —
achieving primary inbox placement across all major email providers.

[Left: MetricHero — featured/glow]
Metric:  ~80%  (animated counter from 0)
Label:   Primary Inbox Placement Rate
Sub:     Gmail · Outlook · Yahoo · Corporate Mail

Detail line below metric box:
"8 out of every 10 emails reach the prospect's primary inbox — not promotions, not spam."

[Right Card — orange-bar] "Deliverability Architecture"
[TechBadge TRANSACTIONAL HEADERS] Prevents promotional or spam folder classification
[TechBadge DYNAMIC SPINTAX]       Every message carries a unique cryptographic signature
[TechBadge MULTI-PROVIDER ROUTING] Compatible: Mailgun · HubSpot SMTP · Dedicated VPS
[TechBadge DOMAIN SEPARATION]     Primary {company} domain never touched or put at risk
[TechBadge AUTO-COMPLIANCE]       Bounce, unsubscribe, and complaint handling built in

[CalloutStrip]
Bold: "Live Demonstration:"
Text: A technical screen recording showing the backend deliverability engine and inbox
placement verification is available on request.
```

---

### ═══ SLIDE 12 — PHASE 5: SEQUENCE ═══

**Layout:** 2-column. Left = Card + PointList. Right = DataTable.

```
[SectionLabel] PHASE 5 — OUTREACH

[H1] Where We Find Buyers &
[orange] What We Send Them

[Subtitle]
Multi-channel prospect identification combined with a structured 5-touch email campaign
personalized to each prospect's financial profile.

[Left Card — orange-bar] "Prospect Sourcing Channels"
- Tool users from the Resource Hub (Phase 3 & 4 warm, high-intent leads)
- Facebook and community groups: "First Time Home Buyers [City]", "Moving to [City]"
- LinkedIn signals: job changes, promotions, relocation announcements, lease references
- Reddit: r/FirstTimeHomeBuyer, r/personalfinance, city-specific housing threads
- Lease renewal trigger data from public and semi-public community sources

[Right: DataTable]
Headers: Touch | Timing | Core Objective

Email 1 | Day 0   | Advisor introduction + embedded pitch video + soft consultation CTA
Email 2 | Day 3   | Personalized value-add based on their specific city and budget inputs
Email 3 | Day 7   | Local homebuyer case study + current rate environment context
Email 4 | Day 14  | Direct consultation invite referencing their stated buying timeline
Email 5 | Day 21  | Re-engagement with 1-click self-service mortgage tool link

[CalloutStrip]
Bold: "Dual CTA in Every Email:"
Text: Book a consultation directly on the advisor's calendar OR complete a 2-minute secure
mortgage pre-qualification online. Two paths. Zero friction.
```

---

### ═══ SLIDE 13 — PHASE 6: SHOW-RATE SYSTEM ═══

**Layout:** SectionLabel + H1 + 3-column cards + CalloutStrip

```
[SectionLabel] PHASE 6 OF 6

[H1] Booked Meetings Are Only Valuable
[orange] When Prospects Show Up

[Subtitle]
Automated preparation briefings, 3-tier reminder sequences, and no-show recovery
workflows that protect every consultation slot on {company}'s advisors' calendars.

[3 Cards — orange-bar, spring hover]

CARD 1 | "Advisor Context Briefing"
- Full prospect dossier delivered before every consultation
- Includes: calculator inputs, loan program interest, budget, timeline, complete email history
- Advisor enters every call fully informed — not asking basic questions, not starting cold
- Positions the advisor as already understanding the buyer's situation before "hello"

CARD 2 | "3-Tier Reminder Sequence"
Immediate: Calendar invite + personalized video confirmation message
24 Hours:  Meeting agenda + documents needed for pre-approval discussion
1 Hour:    Direct SMS + email with single-click access link and advisor's direct line

CARD 3 | "No-Show Recovery Protocol"
- Automated follow-up triggered within 2 hours of any missed consultation
- Frictionless 1-click rescheduling link with 3 available time slot options
- Recovers 35% to 45% of missed appointments back onto the calendar automatically
- Unrecovered prospects re-enter email nurture sequence with zero manual intervention

[CalloutStrip]
Bold: "System Purpose:"
Text: {company}'s advisors spend 100% of their time advising and closing mortgage
applications — not chasing, confirming, or managing any scheduling logistics.
```

---

### ═══ SLIDE 14 — THE FULL FUNNEL ═══

**Layout:** Full-width FunnelDiagram with per-row stagger animation.

```
[SectionLabel] THE COMPLETE SYSTEM

[H1] The Full Mortgage
[orange] Lead Generation Funnel

[Subtitle]
A unified 7-stage pipeline from initial brand awareness to funded loan application —
with automation handling every stage except the advisor consultation itself.

[FunnelDiagram — 7 rows, each enters staggered]

Stage 1 | AWARENESS    | Phase 2: Content Engine      | Educational advisor videos during the 6–12 month homebuyer research window.
Stage 2 | INTEREST     | Phase 3: Resource Hub         | Homebuyer uses interactive mortgage calculators, affordability tools, and guides.
Stage 3 | CAPTURE      | Phase 3/4: Lead Tools         | Buyer inputs financial data; contact, budget, timeline, and loan type captured.
Stage 4 | OUTREACH     | Phase 5: Email Engine         | 5-email personalized sequence with embedded advisor pitch video to primary inbox.
Stage 5 | BOOKING      | Phase 5/6: 1-Click Calendar   | Direct calendar booking + automated 3-tier email and SMS reminder sequence.
Stage 6 | MEETING      | Phase 6: Consultation         | Advisor meets a pre-qualified, informed buyer with full financial context in hand.
Stage 7 | APPLICATION  | GOAL: Funded Mortgage         | Mortgage application submitted, approved, and funded. Revenue generated.  [isGoal: true]

[CalloutStrip — below funnel]
Bold: "It Compounds:"
Text: Every month — the content library grows, the email list grows, the tool traffic grows,
and the pipeline grows. This system gets more powerful the longer it runs.
```

---

### ═══ SLIDE 15 — DIVISION OF WORK ═══

**Layout:** 2-column Cards + CalloutStrip

```
[SectionLabel] HOW IT WORKS

[H1] What We Manage vs.
[orange] What Advisors Focus On

[Subtitle]
A fully managed infrastructure so {company}'s advisors spend their time where they
create the most value — advising clients and closing loan applications.

[Left Card — orange-bar] "Fully Managed — No Advisor Time Required"
- All technical infrastructure: domains, servers, DNS authentication, mailbox warm-up
- Prospect sourcing, data scraping, and financial intent enrichment per record
- Email copywriting, dynamic personalization, A/B testing, and deliverability monitoring
- Content calendar creation, scripting, and full video editing
- AI avatar content generation and automated social media publishing
- Resource hub tool development, maintenance, and conversion rate optimization
- Chatbot training, qualification flow management, and booking system configuration
- Monthly analytics, pipeline performance reporting, and executive-level summaries

[Right Card — orange-bar] "Advisor Responsibilities — Minimal Time"
Bold "Optional:"      Record 60-second video prompts (or use Path B AI avatar — zero recording)
Bold "Consultations:" Attend scheduled calendar appointments with pre-qualified buyers
Bold "Origination:"   Structure loan options, collect documentation, and close the application

Inner footer strip:
"Zero prospecting. Zero software management. Zero domain logistics. Advisors focus on closing."

[CalloutStrip]
Bold: "The Model:"
Text: This is a done-for-you system. The advisor's only job is to show up and close.
```

---

### ═══ SLIDE 16 — IMPLEMENTATION TIMELINE ═══

**Layout:** Full-width DataTable (3 cols) + CalloutStrip

```
[SectionLabel] ROLLOUT SCHEDULE

[H1] System Rollout &
[orange] Implementation Roadmap

[Subtitle]
A structured deployment schedule ensuring deliverability infrastructure warms in parallel
with all asset development — so everything is ready at the same time.

[DataTable]
Headers: Timeline | Phase | Deliverables & Milestones

Week 1–2  | Phase 1: Technical Setup    | Domain registration, DNS auth, VPS deploy, and mailbox warm-up initiated.
Week 2–3  | Brand Foundation            | Social audits complete. Google Business listings created and advisor-verified.
Week 2–4  | Phase 2: Content Engine     | 60-day calendar final. First video batch recorded or AI assets scheduled.
Week 3–5  | Phase 3: Resource Hub       | Mortgage tool suite live. Chatbot trained. Booking system operational.
Week 4    | Warm-Up Complete            | Mailboxes reach full warm status. Inbox placement verified across all providers.
Week 5+   | Phase 5: Email Campaigns    | First outbound sequences live with embedded pitch videos and personalization.
Week 6+   | Phase 6: Calendar Filling   | First automated consultation bookings appear on {company} advisor calendars.
Month 2+  | Full Scale                  | Compounding growth engine operational. Monthly optimization reports delivered.

[CalloutStrip]
Bold: "Critical Path:"
Text: The warm-up period cannot be compressed — it is a technical requirement for inbox
placement. While it runs, all other assets are built in parallel so nothing is delayed.
```

---

### ═══ SLIDE 17 — INVESTMENT & ROI ═══

**Layout:** 2-column Cards + CalloutStrip

```
[SectionLabel] INVESTMENT STRUCTURE

[H1] What This Costs vs.
[orange] What It Returns

[Subtitle]
A performance-aligned engagement tied directly to funded loan volume — not ad spend,
not platform subscriptions, not impression counts.

[Left Card — orange-bar] "Investment Structure"
Bold "Monthly Retainer:"   Covers all technical infrastructure, tool development, content
management, email campaign operations, lead sourcing, and monthly reporting.

Bold "Performance Bonus:"  A per-deal fee on funded loans originating from campaign activity
— paid only when actual revenue is generated by the system.

Bold "Zero Ad Spend:"      No Facebook Ads. No Google Ads. No paid placements. This runs
entirely on owned assets and direct, targeted outreach.

[Right Card — orange-bar] "Return Economics"
Bold "High Commission Value:"   A single funded mortgage generates thousands in gross commission
for the advisor and corresponding revenue for {company}.

Bold "Retainer Payback:"        Just 1 to 2 deals closed per month from outreach campaigns
covers the entire monthly investment 10 times over or more.

Bold "Permanent Enterprise Asset:" The tool suite, content library, email database, and social
authority remain permanently owned by {company} — long after the engagement.

[CalloutStrip]
Bold: "Strategic Framing:"
Text: This is not an expense. It is the only growth infrastructure that compounds in value
every month, requires zero ad spend, and creates a permanently owned lead generation engine.
```

---

### ═══ SLIDE 18 — NEXT STEPS ═══

**Layout:** 3-column Cards + CalloutStrip

```
[SectionLabel] LAUNCH SEQUENCE

[H1] What Happens Next:
[orange] Immediate Action Items

[Subtitle]
Everything required to initiate Phase 1 infrastructure and maintain launch momentum
toward the first advisor calendar bookings.

[Card 1] "From {company}'s Team"
- Complete advisor roster with individual branch markets and territories
- Compliance guidelines and individual NMLS license numbers per advisor
- Brand assets: vector logos, hex color codes, and approved messaging guidelines

[Card 2] "From Our Side"
- Live technical screen recording demonstrating the email deliverability engine
- Full resource hub architecture proposal for review with technical leadership
- Social media and Google Business audit initiated immediately on roster receipt

[Card 3] "First Check-In"
- Review social media audit results and advisor profile optimization status
- Confirm satellite domain selection for the mortgage resource hub
- Align on Phase 1 launch date and official warm-up initiation

[CalloutStrip]
Bold: "Launch Dependency:"
Text: The faster the advisor roster and compliance checklist arrive, the faster Phase 1
warm-up begins — and the sooner the first calendar bookings appear for {company}'s advisors.
```

---

### ═══ SLIDE 19 — CLOSING ═══

**Layout:** Full-center, no cards, `bg-bg-deep` with radial orange glow + dot-grid.
Mirrors Slide 1 for bookend symmetry. Word-by-word stagger animation on H1.

```
[SectionLabel] LET'S BUILD THIS

[H1 — word-by-word stagger, same as Slide 1]
Building the System That
[orange] Fills Your Advisors' Calendars

[Subtitle — text-sub text-text-secondary mt-5 max-w-xl text-center]
An automated, compounding lead generation infrastructure built for the mortgage industry.
It works while {company}'s advisors are focused on what they do best — closing loans.

[OrangeDivider — mt-10 mb-8]

[Flex row — items-center justify-center gap-6 text-label text-text-muted uppercase tracking-wider]
Available for Review  ·  Pilot Program Offered  ·  Start Immediately

[Footer — mt-10 text-label text-text-muted text-center]
Growth Architecture Engineered for the Mortgage & Home Loan Industry
```

---

## ▸ NAVIGATION SYSTEM

### `useSlideNav` Hook State

```typescript
interface SlideNavState {
  current:        number;           // 1-indexed (1–19)
  total:          number;           // 19
  direction:      'next' | 'prev'; // for framer-motion custom prop
  isOverviewOpen: boolean;
  isNotesOpen:    boolean;
  lightbox:       { open: boolean; src: string | null };
}

// Actions: goNext · goPrev · goTo(n) · toggleOverview · toggleNotes · openLightbox(src) · closeLightbox
```

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `→` / `Space` / `PageDown` | Next slide |
| `←` / `PageUp` | Previous slide |
| `Home` | Jump to Slide 1 |
| `End` | Jump to Slide 19 |
| `N` | Toggle speaker notes |
| `O` or `G` | Toggle overview grid |
| `F` | Toggle fullscreen |
| `Escape` | Close all modals |

### Touch / Mobile

- Horizontal swipe ≥ 80px triggers navigation
- `rotateY` and `opacity` transforms give real-time drag feedback
- All Framer Motion spring physics work identically on touch

---

## ▸ CHROME HEADER & FOOTER

### `<ChromeHeader>` — Top Bar

```
Height:  52px
Style:   bg-bg-base/80 backdrop-blur-xl border-b border-border-dim

Left:    Two stacked orange lines (logo mark) + "Mortgage Growth System" text-label text-text-secondary
Right:   "{current} / {total}" counter (text-label text-text-muted)
         · Notes button (BookOpen icon, ghost)
         · Grid button (LayoutGrid icon, ghost)
         · "Present" button (orange fill, rounded-lg)

Bottom:  Absolutely positioned <ProgressRail /> at very bottom edge of header
```

### `<ChromeFooter>` — Bottom Bar

```
Height:  48px
Style:   bg-bg-base/80 backdrop-blur-xl border-t border-border-dim

Left:    "← → Navigate  ·  N Notes  ·  O Overview" — text-label text-text-muted
Right:   ChevronLeft (ghost button) + ChevronRight (orange fill, rounded-lg, px-4)
```

---

## ▸ MODALS

### Overview Grid Modal

```
Trigger:     Key O · Key G · Grid button in header
Animation:   AnimatePresence — backdrop fades in with blur, then grid tiles scale up 0.88→1
Layout:      5-column grid, p-8, overflow-y-auto, max-h-screen
bg:          bg-bg-deep/92

Each thumbnail:
  bg-bg-surface border border-border-dim rounded-xl p-3 cursor-pointer overflow-hidden
  Active:  border-2 border-accent-orange ring-2 ring-accent-orange/20
  Hover:   border-border-bright + scale(1.04) spring
  Content: Slide number badge (accent-orange, font-mono) + slide title text (truncated)

Backdrop click: close modal
```

### Lightbox Modal

```
Trigger:    Click any slide image
Animation:  AnimatePresence — scale 0.86→1 + opacity 0→1, ease EASE
Container:  fixed inset-0 bg-black/94 flex items-center justify-center z-[100]
Image:      max-w-[88vw] max-h-[88vh] object-contain rounded-xl border border-accent-orangeBorder
Close:      Click backdrop or Escape
```

### Speaker Notes Drawer

```
Trigger:    Key N · Notes button in header
Position:   fixed bottom-[48px] left-0 right-0 (sits above footer)
Max-height: 32vh, overflow-y-auto
Animation:  y: '100%' → 0, spring { stiffness: 300, damping: 20 } (slight overshoot)
bg:         bg-bg-surface border-t-2 border-accent-orange shadow-[0_-16px_48px_rgba(0,0,0,0.35)]
Header:     "Speaker Notes" font-mono text-label text-accent-orange uppercase + X close button
Body:       italic text-body text-text-secondary px-6 py-4
```

---

## ▸ ROUTE STRUCTURE

```
/                              Homepage: embedded <PresentationViewer /> in page layout
/presentation                  Fullscreen: zero chrome, fills 100vw × 100vh exactly
/presentation?company=X        Replaces {company} throughout all 19 slides
/presentation?slide=5          Deep-links to specific slide on load
/presentation?company=X&slide=5 Both params together
```

---

## ▸ FINAL QUALITY BARS

Every one of these must be true before the app is considered done:

```
01  Slide transitions BLUR on exit and UN-BLUR on entrance — depth, not just movement
02  Card hover is spring physics — alive, not a linear CSS transition
03  The progress rail is the most satisfying UI element in the app — silky orange fill
04  SectionLabels are ALWAYS monospace, ALWAYS uppercase, ALWAYS orange — no exceptions
05  TechBadges look like terminal tags — signals credibility, not decoration
06  FunnelDiagram rows animate in staggered — each stage drops in 0.08s after previous
07  MetricHero numbers count up from 0 to target on slide entry — never render static
08  Dot-grid stage background is 8% opacity MAX — texture, never distraction
09  Speaker notes drawer overshoots on spring — feels physical, not digital
10  Overview modal backdrop blurs in BEFORE grid tiles appear — not simultaneously
11  Zero placeholder text — every slide contains the exact copy defined in this document
12  Zero emoji in rendered slides — no lucide icon used purely decoratively
13  {company} appears via useCompany() hook — no hardcoded company names anywhere
14  Mobile swipe navigation works identically smooth as keyboard on desktop
15  Fullscreen /presentation route: zero scrollbars, zero browser chrome, pure 100vw × 100vh
```
