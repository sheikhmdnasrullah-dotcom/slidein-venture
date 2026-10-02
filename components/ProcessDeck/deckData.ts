export interface FlowStep {
  num: string;
  title: string;
  desc: string;
}

export interface FunnelRow {
  step: string;
  phase: string;
  desc: string;
  isGoal?: boolean;
}

export interface RoadmapRow {
  timeline: string;
  phase: string;
  deliverables: string;
}

export interface SequenceStep {
  touch: string;
  day: string;
  purpose: string;
}

export interface SlideItem {
  id: number;
  phaseLabel: string;
  title: string;
  titleHighlight?: string;
  subtitle: string;
  layout:
    | 'title'
    | 'bottlenecks'
    | 'architecture'
    | 'infrastructure'
    | 'dashboard'
    | 'content-paths'
    | 'pitch-video'
    | 'resource-hub'
    | 'booking-system'
    | 'lead-magnets'
    | 'deliverability'
    | 'sourcing-sequence'
    | 'show-rate'
    | 'funnel'
    | 'division-of-work'
    | 'roadmap'
    | 'investment'
    | 'next-steps'
    | 'closing';
  speakerNotes: string;
  image?: string;
  imageCaption?: string;
  callout?: string;
  meta?: Record<string, unknown>;
}

export const SLIDES_DATA: SlideItem[] = [
  // ── Slide 1: Title
  {
    id: 1,
    phaseLabel: 'EXECUTIVE OVERVIEW',
    title: 'A Complete Digital Growth &',
    titleHighlight: 'Email Campaign System',
    subtitle: 'Engineered specifically for high-performance mortgage origination and loan advisor appointment generation.',
    layout: 'title',
    speakerNotes: "Hi Nick — I'm walking you through the full strategy I've put together for Finaya. This covers the email campaign, the lead generation system, and everything in between. Let's get into it.",
  },

  // ── Slide 2: The Problem
  {
    id: 2,
    phaseLabel: 'THE MARKET GAP',
    title: 'The Three Bottlenecks in',
    titleHighlight: 'Mortgage Client Acquisition',
    subtitle: 'Structural gaps that prevent consistent, predictable loan origination across branches.',
    layout: 'bottlenecks',
    speakerNotes: "Before I show you what I've built, let me show you the exact gap we're solving. Homebuyers research for months before calling an advisor, and without an automated system, competitors take those deals.",
    callout: 'Strategic Gap: While lenders navigate market shifts, every day without an automated system is a day competitors capture those borrowers.',
  },

  // ── Slide 3: 6-Phase Architecture
  {
    id: 3,
    phaseLabel: 'THE COMPOSABLE SYSTEM',
    title: 'The Growth Engine:',
    titleHighlight: '6-Phase Architecture',
    subtitle: 'A compounding system where each phase strengthens and accelerates the next.',
    layout: 'architecture',
    speakerNotes: "Here's the system at a high level. Six phases — each one builds on the previous. I'll walk you through each one in detail.",
    callout: 'Compounding Velocity: Each phase directly accelerates and protects the conversion rates of subsequent phases.',
  },

  // ── Slide 4: Phase 1: Foundation
  {
    id: 4,
    phaseLabel: 'PHASE 1 · FOUNDATION',
    title: 'Foundation & Technical',
    titleHighlight: 'Outreach Infrastructure',
    subtitle: 'Configuring deliverability protocols, scraping systems, and brand assets before launching outreach.',
    layout: 'infrastructure',
    speakerNotes: "Before a single email goes out, this foundation has to be in place. The most important thing here is the warm-up — sending from a cold domain gets you in spam. We start this immediately.",
    callout: 'Brand Foundation: Social media audits and Google Business advisor listings ensure institutional credibility before any cold outreach begins.',
  },

  // ── Slide 5: Phase 1: Agentic Dashboard
  {
    id: 5,
    phaseLabel: 'PHASE 1 · COMMAND CENTER',
    title: 'Agentic Command Center &',
    titleHighlight: 'Pipeline Dashboard',
    subtitle: 'Centralized operational visibility over prospect data, scraping tasks, and advisor pipelines.',
    layout: 'dashboard',
    image: '/slide-deck-assets/01_phase1_infrastructure_dashboard.png',
    imageCaption: 'Fig 1.1 — Central Command Center with real-time prospect pipeline and scraping task orchestration',
    speakerNotes: "This is what the central dashboard looks like. Every agent, every lead, every task — all live here. When a prospect replies to an email or books a meeting, it routes to the right EMA automatically.",
    callout: 'Operational Control: Branch leaders and advisors maintain 100% pipeline visibility with zero manual logging.',
  },

  // ── Slide 6: Phase 2: Content Engine
  {
    id: 6,
    phaseLabel: 'PHASE 2 · AUTHORITY CONTENT',
    title: 'Authority Content Engine —',
    titleHighlight: 'Two Production Paths',
    subtitle: 'Establishing loan advisors as trusted mortgage educators across social and search channels.',
    layout: 'content-paths',
    image: '/slide-deck-assets/02_phase2_content_engine.png',
    imageCaption: 'Fig 2.1 — 60-Day Mortgage Education Content Library & Multi-Platform Distribution Pipeline',
    speakerNotes: "We give you two options here. If your EMAs are willing to record — great, we make it easy. If they're camera-shy or too busy — we use AI to do it for them. Either way, 60 days of content is ready and scheduled.",
    callout: 'Authority Baseline: Multi-channel social distribution turns cold outreach prospects into warm, informed believers.',
  },

  // ── Slide 7: Phase 2C: Pitch Video
  {
    id: 7,
    phaseLabel: 'PHASE 2C · PERSONALIZED OUTREACH',
    title: 'The Advisor Pitch Video —',
    titleHighlight: 'Humanizing Outreach',
    subtitle: 'Embedding a personal video introduction directly into cold email campaigns to increase response rates.',
    layout: 'pitch-video',
    speakerNotes: "This is one of the highest-leverage things we're doing. Most cold emails are faceless text blocks. Ours aren't. The EMA is right there talking directly to the prospect.",
    callout: 'Proven Lift: A real human face in cold outreach increases reply rates by 3x to 5x. People borrow from people they trust.',
  },

  // ── Slide 8: Phase 3: Resource Hub
  {
    id: 8,
    phaseLabel: 'PHASE 3 · LEAD CAPTURE',
    title: 'The Resource Hub —',
    titleHighlight: 'Interactive Lead Capture',
    subtitle: 'A standalone digital property equipped with interactive financial tools that capture high-intent buyer data.',
    layout: 'resource-hub',
    image: '/slide-deck-assets/04_phase3_resource_hub_chatbot.png',
    imageCaption: 'Fig 3.1 — Interactive Financial Calculators & AI Lead Capture Interface',
    speakerNotes: "This is the marketing funnel idea I mentioned on our call. People are Googling mortgage stuff for months before they ever call anyone. This site captures them during that window.",
    callout: 'Strategic Deployment: Lives on a dedicated satellite domain — capturing top-of-funnel search traffic without risking primary domain equity.',
  },

  // ── Slide 9: Phase 3: Chatbot & Booking
  {
    id: 9,
    phaseLabel: 'PHASE 3 · QUALIFICATION & SCHEDULING',
    title: 'Automated Qualification &',
    titleHighlight: '1-Click Booking',
    subtitle: 'Engaging site visitors, qualifying loan criteria, and scheduling consultations 24/7.',
    layout: 'booking-system',
    speakerNotes: "This is the closer. By the time someone books a call, they've used a tool, talked to our chatbot, and told us what they need. The EMA isn't walking into a cold call.",
    callout: 'Zero Friction: Prospects transition seamlessly from calculator insights into confirmed advisor calendar bookings.',
  },

  // ── Slide 10: Phase 4: Lead Magnets
  {
    id: 10,
    phaseLabel: 'PHASE 4 · LEAD GENERATION',
    title: 'Free Tools as',
    titleHighlight: 'Lead Generation Magnets',
    subtitle: 'Driving social traffic into interactive tools to collect verified, high-intent financial data.',
    layout: 'lead-magnets',
    image: '/slide-deck-assets/03_phase4_free_tools_lead_magnets.png',
    imageCaption: 'Fig 4.1 — Social-to-Tool Lead Magnets with Intent Data Collection Gates',
    speakerNotes: "This is how we get warm leads without spending money on ads. We give away value, they tell us who they are in exchange, and then we reach out with full context.",
    callout: 'Verified Intent: We know the prospect budget, timeline, and city before the advisor ever dials or writes.',
  },

  // ── Slide 11: Phase 5: Deliverability
  {
    id: 11,
    phaseLabel: 'PHASE 5 · EMAIL INFRASTRUCTURE',
    title: 'Email Deliverability &',
    titleHighlight: 'Inbox Placement',
    subtitle: 'Proprietary sending architecture engineered to reach primary inboxes and bypass spam filters.',
    layout: 'deliverability',
    speakerNotes: "Here's the technical side of what I've built. Most cold email tools get blocked. This one doesn't — because of how the email header is constructed on the backend. I'll show you a live demo in a separate video.",
    callout: 'Deliverability Guarantee: Custom backend structures outbound messages with verified headers for 80%+ primary placement.',
  },

  // ── Slide 12: Phase 5: Sourcing & Sequence
  {
    id: 12,
    phaseLabel: 'PHASE 5 · CAMPAIGN CADENCE',
    title: 'Prospect Sourcing &',
    titleHighlight: '5-Step Email Sequence',
    subtitle: 'Multi-channel prospect identification paired with a structured, value-driven email campaign.',
    layout: 'sourcing-sequence',
    image: '/slide-deck-assets/05_phase5_6_outreach_booking.png',
    imageCaption: 'Fig 5.1 — Multi-Channel Sourcing Database and 5-Touch Conversational Outreach Workflow',
    speakerNotes: "Every email is unique and personalized. We don't blast 1000 identical emails. Each one is written around what we know about that specific person.",
    callout: 'Hyper-Personalization: Each sequence message incorporates specific local loan criteria, budget estimates, and personal video.',
  },

  // ── Slide 13: Phase 6: Show-Rate System
  {
    id: 13,
    phaseLabel: 'PHASE 6 · APPOINTMENT CONVERSION',
    title: 'Maximizing',
    titleHighlight: 'Meeting Show-Up Rates',
    subtitle: 'Automating preparation briefings, multi-channel reminders, and no-show recovery.',
    layout: 'show-rate',
    speakerNotes: "Most outreach systems stop at the booked meeting. This one doesn't. Show rates are where deals are won or lost — so we automate everything that makes someone more likely to actually show up.",
    callout: 'System Value: Eliminates manual chasing and ensures loan officers spend 100% of their time advising and closing mortgage applications.',
  },

  // ── Slide 14: The Complete Funnel
  {
    id: 14,
    phaseLabel: 'FULL PIPELINE ARCHITECTURE',
    title: 'The Complete',
    titleHighlight: 'Lead Generation Funnel',
    subtitle: 'A unified 7-step pipeline from initial brand awareness down to funded loan applications.',
    layout: 'funnel',
    speakerNotes: "This is the full picture. It's a machine — once it's running, it runs. Every month the content library grows, the email list grows, and the pipeline grows. It compounds.",
    callout: 'Compounding Revenue Engine: An automated pipeline that operates continuously without recurring paid ad spend.',
  },

  // ── Slide 15: Division of Work
  {
    id: 15,
    phaseLabel: 'OPERATIONAL EFFICIENCY',
    title: 'Division of Work:',
    titleHighlight: 'Managed Execution vs. Advisor Focus',
    subtitle: 'A fully managed growth system so Executive Mortgage Advisors focus entirely on closing deals.',
    layout: 'division-of-work',
    speakerNotes: "I want to be clear about what I'm taking off your EMAs' plates. They shouldn't be spending time on any of this technical marketing. That's my job.",
    callout: 'Guiding Principle: Advisors spend zero time prospecting, managing software, or warming domains. We build the pipeline; they close the loans.',
  },

  // ── Slide 16: Roadmap
  {
    id: 16,
    phaseLabel: 'ROLLOUT ROADMAP',
    title: 'System Rollout &',
    titleHighlight: 'Implementation Roadmap',
    subtitle: 'A structured implementation schedule ensuring deliverability warms while assets are built.',
    layout: 'roadmap',
    speakerNotes: "The warm-up period is the one thing we can't rush — it's technical and necessary. While that's running, we're building everything else. So by the time we're ready to send, everything else is in place.",
    callout: 'Parallel Acceleration: While mailboxes safely warm up, content calendars, tools, and scraping engines are fully prepared.',
  },

  // ── Slide 17: Investment & ROI
  {
    id: 17,
    phaseLabel: 'PARTNERSHIP ECONOMICS',
    title: 'Investment Structure &',
    titleHighlight: 'Return Economics',
    subtitle: 'A performance-aligned partnership tied directly to closed mortgage origination volume.',
    layout: 'investment',
    speakerNotes: "I want Nick to see this not as a cost but as the only system that actually scales without spending money on ads. One closed loan pays for the retainer 10 times over.",
    callout: 'Bottom Line: A self-sustaining revenue engine that directly accelerates advisor retention and corporate loan volume.',
  },

  // ── Slide 18: Next Steps
  {
    id: 18,
    phaseLabel: 'LAUNCH PROTOCOL',
    title: 'Immediate Next Steps:',
    titleHighlight: 'Launch Sequence',
    subtitle: 'Action items to establish infrastructure and maintain project momentum.',
    layout: 'next-steps',
    speakerNotes: "Here is what we need to get rolling. The faster the roster and compliance checklist arrive, the faster everything launches.",
    callout: 'Launch Readiness: Upon receiving the advisor roster and compliance parameters, Phase 1 warm-up and audits begin immediately.',
  },

  // ── Slide 19: Closing
  {
    id: 19,
    phaseLabel: 'CONCLUSION & ACTION',
    title: 'Building the System That Fills Your',
    titleHighlight: "Advisors' Calendars",
    subtitle: "Let's review the deliverability demo and discuss domain approval during our Monday check-in.",
    layout: 'closing',
    speakerNotes: "Thanks for watching Nick. Let's talk Monday and build this out.",
    callout: 'Original Intellectual Property: Growth Architecture Engineered Specifically for High-Growth Mortgage Companies.',
  },
];
