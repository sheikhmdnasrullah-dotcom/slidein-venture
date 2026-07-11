import type { Metadata } from 'next';
import Link from 'next/link';
import FeatureCarousel from '@/components/FeatureCarousel/FeatureCarousel';
import HorizontalCarousel from '@/components/HorizontalCarousel/HorizontalCarousel';
import CTABanner from '@/components/CTABanner/CTABanner';
import { VideoEmbedPlaceholder } from '@/components/VideoEmbed/VideoEmbed';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { CarouselTab } from '@/components/FeatureCarousel/FeatureCarousel';
import type { HSlide } from '@/components/HorizontalCarousel/HorizontalCarousel';

export const metadata: Metadata = {
  title: 'Docs | SlideIn Venture',
  description: 'The next gen of notes & docs. Simple. Powerful. Beautiful.',
};

// ─── Docs feature tabs ────────────────────────────────────────────────────────
const docsTabs: CarouselTab[] = [
  {
    id: 'write',
    label: 'Write',
    headline: 'Beautiful docs, effortlessly',
    description: 'A clean editor that gets out of your way. Write with slash commands, rich media, and AI assistance — all in one place.',
    badge: 'Write',
    badgeColor: '#0F8A8A',
    imageBg: 'linear-gradient(135deg, #D3EAE8 0%, #E8F5F4 100%)',
  },
  {
    id: 'organize',
    label: 'Organize',
    headline: 'Everything in its place',
    description: 'Nested pages, databases, and smart links let you organize knowledge exactly how your team thinks.',
    badge: 'Organize',
    badgeColor: '#2383E2',
    imageBg: 'linear-gradient(135deg, #EBF4FD 0%, #F0F8FF 100%)',
  },
  {
    id: 'collaborate',
    label: 'Collaborate',
    headline: 'Edit together, in real time',
    description: 'Live cursors, inline comments, and @mentions keep your whole team on the same page — literally.',
    badge: 'Collaborate',
    badgeColor: '#9065B0',
    imageBg: 'linear-gradient(135deg, #F4EEFC 0%, #F9F5FE 100%)',
  },
  {
    id: 'share',
    label: 'Share',
    headline: 'Share with anyone, anywhere',
    description: 'Publish docs to the web, share with guests, or keep internal. Granular permissions for every scenario.',
    badge: 'Share',
    badgeColor: '#CB912F',
    imageBg: 'linear-gradient(135deg, #FBF3DB 0%, #FFFBF0 100%)',
  },
];

// ─── Testimonials ─────────────────────────────────────────────────────────────
const testimonialSlides: HSlide[] = [
  {
    id: 't1',
    headline: '"SlideIn Venture replaced five tools for us overnight."',
    description: "Docs, wikis, project management — it's all here. Our team got 30% more done in the first month.",
    eyebrow: 'Engineering Lead, Startup',
    bg: 'linear-gradient(135deg, #0d1b2a 0%, #1e3a4b 100%)',
  },
  {
    id: 't2',
    headline: '"The best writing tool we\'ve ever used."',
    description: 'The editor is clean, fast, and beautiful. Our content team writes twice as fast with AI built in.',
    eyebrow: 'Content Director, SaaS',
    bg: 'linear-gradient(135deg, #1a0533 0%, #2d0b6e 100%)',
  },
  {
    id: 't3',
    headline: '"Our entire company knowledge lives here now."',
    description: 'From onboarding to ops runbooks — everything searchable, organized, and always up to date.',
    eyebrow: 'COO, Scale-up',
    bg: 'linear-gradient(135deg, #0a1628 0%, #243654 100%)',
  },
];

// ─── Writing Features ─────────────────────────────────────────────────────────
const writingTabs: CarouselTab[] = [
  {
    id: 'blocks',
    label: 'Block editor',
    headline: 'Every type of content, one editor',
    description: 'Text, tables, images, code, embeds, databases — everything in a single fluid document.',
    badge: 'Blocks',
    badgeColor: '#0F8A8A',
    imageBg: 'linear-gradient(135deg, #D3EAE8 0%, #E8F5F4 100%)',
  },
  {
    id: 'ai-writing',
    label: 'AI writing',
    headline: 'Write better, not harder',
    description: 'Ask AI to draft, improve, translate, or summarize any content. Works right inside your doc.',
    badge: 'AI',
    badgeColor: '#64473A',
    imageBg: 'linear-gradient(135deg, #EEE0DA 0%, #F5EDE8 100%)',
  },
  {
    id: 'templates',
    label: 'Templates',
    headline: 'Start fast, every time',
    description: 'Hundreds of templates for any workflow — PRDs, meeting notes, retrospectives, and more.',
    badge: 'Templates',
    badgeColor: '#CB912F',
    imageBg: 'linear-gradient(135deg, #FBF3DB 0%, #FFFBF0 100%)',
  },
];

// ─── Integrations ─────────────────────────────────────────────────────────────
const integrations = [
  { name: 'GitHub', icon: '⌥', bg: '#f6f8fa', color: '#24292e' },
  { name: 'Slack', icon: '#', bg: '#f5e8f7', color: '#4A154B' },
  { name: 'Figma', icon: '◈', bg: '#F5F5F5', color: '#1D1D1D' },
  { name: 'Google Drive', icon: '▲', bg: '#E8F0FE', color: '#1A73E8' },
  { name: 'Linear', icon: '◎', bg: '#EDEDFF', color: '#5E6AD2' },
  { name: 'Jira', icon: '◆', bg: '#E6F0FF', color: '#0052CC' },
  { name: 'Zapier', icon: '⚡', bg: '#FFF0EB', color: '#FF4A00' },
  { name: 'Loom', icon: '▶', bg: '#EFEEFD', color: '#625DF5' },
];

export default function SolutionsPage() {
  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-b from-[#E8F5F4] to-[#F7F6F3] pt-[calc(56px+72px)] pb-20 overflow-hidden">
        <div className="max-w-[1100px] mx-auto px-6 md:px-10 flex flex-col items-center text-center">

          <Badge className="mb-7 bg-[#0F8A8A]/10 text-[#0F8A8A] border-[#0F8A8A]/25 hover:bg-[#0F8A8A]/15 font-[600] tracking-[0.02em] rounded-full px-4 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0F8A8A] mr-2 inline-block" />
            Docs · Simple & Powerful
          </Badge>

          <h1 className="text-[clamp(2.75rem,7vw,5.25rem)] font-[700] leading-[1.04] tracking-[-0.03em] text-[#191919] max-w-[720px] mb-6">
            The next gen of<br />
            <span className="text-[#0F8A8A]">notes & docs.</span>
          </h1>

          <p className="text-[clamp(1rem,2vw,1.1875rem)] leading-[1.7] text-[#787774] max-w-[500px] mb-9">
            Simple. Powerful. Beautiful. Write everything from quick notes to company wikis — 
            with AI that writes alongside you.
          </p>

          <div className="flex items-center gap-3 flex-wrap justify-center mb-16">
            <Link href="/signup" className={buttonVariants({ size: "lg", className: "bg-[#191919] hover:bg-[#2d2d2d] text-white font-[600] tracking-[-0.01em] shadow-[0_1px_3px_rgba(0,0,0,0.22)] hover:shadow-[0_4px_14px_rgba(0,0,0,0.25)] hover:-translate-y-px transition-all duration-150 rounded-[7px] h-11 px-6" })}>
              Get started free
            </Link>
            <Link href="#features" className={buttonVariants({ variant: "outline", size: "lg", className: "font-[500] tracking-[-0.01em] rounded-[7px] h-11 px-6 border-[#E3E2E0] hover:bg-[#F7F6F3]" })}>
              See features ↓
            </Link>
          </div>

          {/* Hero Doc Visual */}
          <div className="w-full max-w-[680px]">
            <div className="bg-white rounded-2xl border border-black/[0.07] shadow-[0_20px_60px_rgba(0,0,0,0.12),0_4px_12px_rgba(0,0,0,0.06)] overflow-hidden relative">
              {/* Window chrome */}
              <div className="bg-[#F7F6F3] px-5 py-3.5 flex items-center gap-4 border-b border-[#E3E2E0]">
                <div className="flex gap-1.5">
                  {['#FF5F57','#FEBC2E','#28C840'].map(c => (
                    <span key={c} className="w-3 h-3 rounded-full block" style={{ background: c }} />
                  ))}
                </div>
                <div className="bg-white border border-[#E3E2E0] rounded-md px-3 py-1 text-[11.5px] font-[500] text-[#9B9A97]">
                  📄 Product Brief — Q3
                </div>
              </div>
              {/* Doc body */}
              <div className="p-6 md:p-8 text-left">
                <div className="text-3xl mb-3">📋</div>
                <h3 className="text-xl font-[700] text-[#191919] tracking-[-0.02em] mb-2">Q3 Product Brief</h3>
                <div className="flex gap-4 text-[11.5px] text-[#9B9A97] mb-5">
                  <span>🕐 Updated 2 hours ago</span>
                  <span>👤 Sarah, Marcus + 4</span>
                </div>
                {/* Content */}
                <div className="flex flex-col gap-2 mb-4">
                  {[100, 88, 72, 0, 100, 95, 80, 65].map((w, i) =>
                    w === 0 ? <div key={i} className="h-2" /> : (
                      <div key={i} className="h-[9px] rounded-full bg-black/[0.08]" style={{ width: `${w}%`, height: i === 0 ? 14 : 9 }} />
                    )
                  )}
                </div>
                {/* AI suggestion */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#FBF3DB] border border-[#F5E4B2] rounded-lg cursor-pointer hover:bg-[#F5E8C0] transition-colors">
                  <span className="text-sm">✨</span>
                  <span className="text-[12px] font-[600] text-[#64473A]">AI: Improve this section →</span>
                </div>
              </div>
              {/* Decorative pencil */}
              <div className="absolute top-0 right-4 text-4xl opacity-50 -translate-y-2 rotate-12 pointer-events-none select-none">✏️</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Feature Tabs ────────────────────────────────────────────── */}
      <div id="features">
        <FeatureCarousel
          eyebrow="Everything you need"
          title="Docs for every kind of work"
          subtitle="From quick personal notes to collaborative company wikis — one doc tool that does it all."
          tabs={docsTabs}
        />
      </div>

      {/* ── Video Slot #1 ────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-[960px] mx-auto px-6 md:px-10">
          <p className="text-center text-[11.5px] font-[700] tracking-[0.08em] uppercase text-[#0F8A8A] mb-3">
            Watch it work
          </p>
          <h2 className="text-center text-[clamp(1.875rem,3.5vw,2.75rem)] font-[700] leading-[1.1] tracking-[-0.025em] text-[#191919] mb-10">
            See Docs in action
          </h2>
          {/*
            ── Video Slot ──────────────────────────────────────────────────
            Replace with: <VideoEmbed src="your-docs-demo.mp4" />
            ────────────────────────────────────────────────────────────────
          */}
          <VideoEmbedPlaceholder label="Docs product demo video" aspectRatio="16/9" />
        </div>
      </section>

      {/* ── Writing Features ─────────────────────────────────────────── */}
      <FeatureCarousel
        eyebrow="Advanced writing"
        title="A doc editor unlike any other"
        subtitle="Blocks, AI, and templates — everything you need to create exceptional docs."
        tabs={writingTabs}
      />

      {/* ── Testimonials ─────────────────────────────────────────────── */}
      <HorizontalCarousel
        eyebrow="Loved by teams worldwide"
        title="What teams are saying"
        slides={testimonialSlides}
      />

      {/* ── AI Writing Split ─────────────────────────────────────────── */}
      <section className="py-20 bg-[#F7F6F3]">
        <div className="max-w-[1100px] mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[11.5px] font-[700] tracking-[0.08em] uppercase text-[#0F8A8A] mb-3">AI writing</p>
              <h2 className="text-[clamp(1.75rem,3vw,2.5rem)] font-[700] leading-[1.1] tracking-[-0.025em] text-[#191919] mb-4">
                Write 10× faster with AI
              </h2>
              <p className="text-[16px] text-[#787774] leading-[1.65] mb-7">
                Ask AI to draft, rewrite, translate, or summarize — right inside your doc, with full context of your workspace.
              </p>
              <Link href="/product/ai" className={buttonVariants({ className: "bg-[#191919] hover:bg-[#2d2d2d] text-white font-[600] rounded-[7px] h-10 px-5 hover:-translate-y-px transition-all duration-150" })}>
                Explore AI features →
              </Link>
            </div>
            {/*
              ── Video Slot ─────────────────────────────────────────────
              Replace with: <VideoEmbed src="your-ai-demo.mp4" />
              ──────────────────────────────────────────────────────────
            */}
            <VideoEmbedPlaceholder label="AI writing demo" aspectRatio="4/3" />
          </div>
        </div>
      </section>

      {/* ── Integrations Grid ────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-[900px] mx-auto px-6 md:px-10 text-center">
          <p className="text-[11.5px] font-[700] tracking-[0.08em] uppercase text-[#0F8A8A] mb-3">
            Works with everything
          </p>
          <h2 className="text-[clamp(1.875rem,3.5vw,3rem)] font-[700] leading-[1.1] tracking-[-0.025em] text-[#191919] mb-4">
            Connect your entire stack
          </h2>
          <p className="text-[16px] text-[#787774] leading-[1.65] max-w-[440px] mx-auto mb-12">
            SlideIn Venture connects with 100+ apps so your docs always have the context they need.
          </p>

          <div className="grid grid-cols-4 gap-4 mb-8">
            {integrations.map((app) => (
              <Card
                key={app.name}
                className="p-5 border-[#E3E2E0] flex flex-col items-center gap-3 hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer rounded-xl bg-[#F7F6F3] hover:bg-white"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-[1.25rem] font-[700]"
                  style={{ background: app.bg, color: app.color }}
                >
                  {app.icon}
                </div>
                <span className="text-[13px] font-[600] text-[#37352F]">{app.name}</span>
              </Card>
            ))}
          </div>

          <Link
            href="/connections"
            className="inline-flex items-center gap-1.5 text-[14.5px] font-[600] text-[#0F8A8A] hover:text-[#0a6a6a] transition-colors"
          >
            View all 100+ integrations
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M1 6.5H12M7 1.5L12 6.5L7 11.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <CTABanner
        eyebrow="Start writing today"
        headline="The last doc tool you'll ever need"
        subtext="Start free with SlideIn Venture Docs — no credit card, no limits on pages."
        primaryLabel="Start writing for free"
        primaryHref="/signup"
        secondaryLabel="See pricing"
        secondaryHref="/pricing"
      />
    </>
  );
}
