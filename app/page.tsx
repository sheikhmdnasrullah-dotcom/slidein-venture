import Hero from '@/components/Hero/Hero';
import FeatureCarousel from '@/components/FeatureCarousel/FeatureCarousel';
import HorizontalCarousel from '@/components/HorizontalCarousel/HorizontalCarousel';
import CTABanner from '@/components/CTABanner/CTABanner';
import BookingCalendar from '@/components/BookingCalendar/BookingCalendar';
import { VideoEmbedPlaceholder } from '@/components/VideoEmbed/VideoEmbed';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { CarouselTab } from '@/components/FeatureCarousel/FeatureCarousel';
import type { HSlide } from '@/components/HorizontalCarousel/HorizontalCarousel';
import Link from 'next/link';

// ─── Feature Carousel #1 ──────────────────────────────────────────────────────
const workspaceTabs: CarouselTab[] = [
  {
    id: 'engineering',
    label: 'Engineering',
    headline: 'Ship faster with connected docs',
    description: 'Link specs, tickets, and runbooks. Your codebase knowledge lives in one place — always up to date.',
    badge: 'Engineering',
    badgeColor: '#2383E2',
    imageBg: 'linear-gradient(135deg, #EBF4FD 0%, #F0F8FF 100%)',
  },
  {
    id: 'design',
    label: 'Design',
    headline: 'From brief to handoff in one doc',
    description: 'Brand guidelines, design reviews, and project retrospectives — beautifully organized and always accessible.',
    badge: 'Design',
    badgeColor: '#9065B0',
    imageBg: 'linear-gradient(135deg, #F4EEFC 0%, #F9F5FE 100%)',
  },
  {
    id: 'marketing',
    label: 'Marketing',
    headline: 'Launch campaigns at speed',
    description: 'Content calendars, campaign briefs, and performance docs — all your marketing intel in one workspace.',
    badge: 'Marketing',
    badgeColor: '#CB912F',
    imageBg: 'linear-gradient(135deg, #FBF3DB 0%, #FFFBF0 100%)',
  },
  {
    id: 'operations',
    label: 'Operations',
    headline: 'Run the business, effortlessly',
    description: 'SOPs, meeting notes, and cross-team projects — keep everyone aligned without the chaos.',
    badge: 'Operations',
    badgeColor: '#D9730D',
    imageBg: 'linear-gradient(135deg, #FDEFD4 0%, #FFF7ED 100%)',
  },
];

// ─── AI Horizontal Carousel ───────────────────────────────────────────────────
const aiSlides: HSlide[] = [
  {
    id: 'ai-write',
    headline: 'Write anything, instantly',
    description: 'Draft emails, docs, summaries and reports — AI that understands your context.',
    eyebrow: 'AI Writing',
    bg: 'linear-gradient(135deg, #0f1923 0%, #182842 50%, #1e3a5f 100%)',
  },
  {
    id: 'ai-search',
    headline: 'Find anything across every app',
    description: 'Enterprise Search connects your entire stack — Notion, Slack, Drive, GitHub and more.',
    eyebrow: 'Enterprise Search',
    bg: 'linear-gradient(135deg, #0d1b2a 0%, #1b3a4b 50%, #1e4d5a 100%)',
  },
  {
    id: 'ai-agents',
    headline: 'Agents that work for you',
    description: 'Build custom AI agents that automate repetitive workflows, research tasks, and more.',
    eyebrow: 'Agents',
    bg: 'linear-gradient(135deg, #1a0533 0%, #2d0b6e 50%, #3a0d8a 100%)',
  },
  {
    id: 'ai-meetings',
    headline: 'Perfect meeting notes, every time',
    description: 'AI captures, transcribes, and summarizes your meetings — so you can stay present.',
    eyebrow: 'AI Meeting Notes',
    bg: 'linear-gradient(135deg, #0a1628 0%, #1a2e4a 50%, #243654 100%)',
  },
];

// ─── Collaboration Carousel ───────────────────────────────────────────────────
const collabTabs: CarouselTab[] = [
  {
    id: 'realtime',
    label: 'Real-time editing',
    headline: 'Collaborate live, together',
    description: 'See edits as they happen. Every cursor, every change — collaboration without friction.',
    badge: 'Live',
    badgeColor: '#3DBE6A',
    imageBg: 'linear-gradient(135deg, #ECFDF5 0%, #F0FAF5 100%)',
  },
  {
    id: 'comments',
    label: 'Comments & mentions',
    headline: 'Conversations in context',
    description: 'Comment on anything, mention anyone. Feedback stays exactly where it belongs.',
    badge: 'Discussion',
    badgeColor: '#2383E2',
    imageBg: 'linear-gradient(135deg, #EBF4FD 0%, #F0F8FF 100%)',
  },
  {
    id: 'sharing',
    label: 'Sharing & permissions',
    headline: 'Share the right way',
    description: 'Granular permissions down to the page. Share publicly, with guests, or keep it internal.',
    badge: 'Permissions',
    badgeColor: '#9065B0',
    imageBg: 'linear-gradient(135deg, #F4EEFC 0%, #F9F5FE 100%)',
  },
];

// ─── Stats Section ────────────────────────────────────────────────────────────
const stats = [
  { value: '10M+', label: 'Teams worldwide', color: '#2383E2' },
  { value: '100+', label: 'Integrations', color: '#0F8A8A' },
  { value: '30%', label: 'Productivity boost', color: '#9065B0' },
  { value: '99.9%', label: 'Uptime SLA', color: '#D9730D' },
];

function StatsSection() {
  return (
    <section className="py-20 bg-white border-y border-[#E3E2E0]">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-[clamp(2rem,4vw,3rem)] font-[800] tracking-[-0.04em] leading-none mb-2"
                style={{ color: stat.color }}>
                {stat.value}
              </p>
              <p className="text-[14px] text-[#787774] font-[500]">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Video Section ────────────────────────────────────────────────────────────
function VideoSection() {
  return (
    <section className="py-24 bg-[#F7F6F3]">
      <div className="max-w-[860px] mx-auto px-6 md:px-10">
        <p className="text-center text-[11.5px] font-[700] tracking-[0.08em] uppercase text-[#0F8A8A] mb-3">
          See it in action
        </p>
        <h2 className="text-center text-[clamp(1.875rem,3.5vw,3rem)] font-[700] leading-[1.1] tracking-[-0.025em] text-[#191919] mb-3">
          Your workspace, your way
        </h2>
        <p className="text-center text-[16px] text-[#787774] mb-10 max-w-[440px] mx-auto leading-[1.65]">
          See how teams use SlideIn Venture to collaborate, ship, and scale.
        </p>
        {/*
          ── Video Slot ─────────────────────────────────────────────────────
          Replace with: <VideoEmbed src="https://your-framer-video.mp4" />
          or:           <VideoEmbed src="https://www.youtube.com/watch?v=..." />
          ───────────────────────────────────────────────────────────────────
        */}
        <VideoEmbedPlaceholder label="Add your Framer / product demo video here" aspectRatio="16/9" />
      </div>
    </section>
  );
}

// ─── Feature Grid ─────────────────────────────────────────────────────────────
const features = [
  { icon: '🤖', title: 'Built-in AI', desc: 'Write, edit, and automate with AI that lives inside your docs.', color: '#EEE0DA' },
  { icon: '⚡', title: 'Instant agents', desc: 'Build agents in minutes. Connect to any tool, run any workflow.', color: '#FDEFD4' },
  { icon: '🔍', title: 'Enterprise search', desc: 'Search across Slack, Drive, GitHub, email — all in one place.', color: '#F4EEFC' },
  { icon: '📄', title: 'Rich docs', desc: 'The most expressive editor for notes, wikis, and documents.', color: '#D3EAE8' },
  { icon: '🎯', title: 'Project tracking', desc: 'Timelines, boards, and sprints — all linked to your docs.', color: '#FBF3DB' },
  { icon: '🔗', title: '100+ connections', desc: 'Connect every tool your team already uses.', color: '#E8F3FC' },
];

function FeatureGrid() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10">
        <p className="text-center text-[11.5px] font-[700] tracking-[0.08em] uppercase text-[#0F8A8A] mb-3">
          Everything you need
        </p>
        <h2 className="text-center text-[clamp(1.875rem,3.5vw,3rem)] font-[700] leading-[1.1] tracking-[-0.025em] text-[#191919] mb-12">
          One workspace to replace them all
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => (
            <Card
              key={f.title}
              className="p-6 border-[#E3E2E0] bg-[#F7F6F3] hover:bg-white hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-200 cursor-default rounded-xl"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-4"
                style={{ background: f.color }}
              >
                {f.icon}
              </div>
              <h3 className="text-[15px] font-[650] text-[#191919] tracking-[-0.01em] mb-2">{f.title}</h3>
              <p className="text-[13.5px] text-[#787774] leading-[1.6]">{f.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsSection />
      <FeatureCarousel
        eyebrow="One workspace, every team"
        title="Built for the way your team works"
        subtitle="Whether you're shipping code, launching campaigns, or running operations — SlideIn Venture adapts to you."
        tabs={workspaceTabs}
      />
      <HorizontalCarousel
        eyebrow="AI built for work"
        title="The smartest workspace you've ever used"
        slides={aiSlides}
      />
      <VideoSection />
      <FeatureGrid />
      <FeatureCarousel
        eyebrow="Collaborate seamlessly"
        title="Your team, always in sync"
        subtitle="Real-time collaboration that feels effortless. No more chasing updates or juggling tools."
        tabs={collabTabs}
      />
      <CTABanner
        eyebrow="Get started today"
        headline="Start with SlideIn Venture, free"
        subtext="Join millions of teams who use SlideIn Venture to do their best work. No credit card required."
        primaryLabel="Get SlideIn Venture free"
        secondaryLabel="Request a demo"
      />

      {/* ── Book a Call Section ─────────────────────────────────────────── */}
      <BookingCalendar />
    </>
  );
}
