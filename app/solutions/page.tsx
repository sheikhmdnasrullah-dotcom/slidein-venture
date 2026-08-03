'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight01Icon as ChevronRight, CheckmarkCircle01Icon as CheckCircle2, ArrowRight02Icon as ArrowRight, PlayIcon as Play, SparklesIcon as Sparkles, FlashIcon as Zap, GlobeIcon as Globe, Chart01Icon as BarChart3, Shield01Icon as Shield, RocketIcon as Rocket, GroupLayersIcon as Layers, Flowchart01Icon as Workflow } from 'hugeicons-react';
import DistributionSlide from '@/components/PitchDeck/DistributionSlide';

/* Two names for one orange, and the split is load-bearing:
   --accent       the instance that clears 4.5:1 as TEXT on the current band
   --accent-vivid the full-chroma instance, for FILLS, strokes and icons
   Setting type in --accent-vivid reaches only 2.73:1 on paper. Same hue, same
   Rule 1 — different lightness, because text and a filled chip are not the
   same contrast problem. */
const RED = 'var(--accent-vivid)';
const RED_TEXT = 'var(--accent)';
const BLACK = 'var(--on-surface)';
const STONE = 'var(--muted)';
const MIST = 'var(--muted)';
const FROST = 'var(--rule)';

const features = [
  {
    id: 'content',
    label: 'Content Production',
    headline: 'Record once. Publish everywhere.',
    description: 'Turn a single video recording into a full content ecosystem — podcasts, clips, blogs, and social posts — all polished and ready to publish.',
    badge: 'Content',
    badgeColor: RED_TEXT,
    gradient:
      'linear-gradient(135deg, color-mix(in oklch, var(--accent-vivid) 3%, transparent) 0%, color-mix(in oklch, var(--color-brand-pale) 3%, transparent) 100%)',
    borderColor: `color-mix(in oklch, var(--accent-vivid) 8%, transparent)`,
    icon: <Sparkles size={20} strokeWidth={2} style={{ color: RED_TEXT }} />,
    metrics: [
      { label: 'Clips per episode', value: '10+' },
      { label: 'SEO articles', value: '1,500+ words' },
      { label: 'Social posts', value: '3-5 per episode' },
    ],
    details: [
      'Audio & Video Editing',
      'Show Notes & Transcripts',
      'Short Form Clips',
      'Thumbnails & Cover Art',
      'Blog Articles',
      'LinkedIn & Social Posts',
      'Publishing & Scheduling',
    ],
  },
  {
    id: 'outreach',
    label: 'Manual Outreach',
    headline: 'Reach the right people, every time.',
    description: 'We build hand-curated prospect lists, write personalized sequences, and manage the entire outreach workflow — so you only talk to qualified leads.',
    badge: 'Outreach',
    badgeColor: RED_TEXT,
    gradient: `linear-gradient(135deg, color-mix(in oklch, var(--accent-vivid) 3%, transparent) 0%, color-mix(in oklch, var(--accent-vivid) 7%, transparent) 100%)`,
    borderColor: `color-mix(in oklch, var(--accent-vivid) 8%, transparent)`,
    icon: <Globe size={20} strokeWidth={2} style={{ color: RED_TEXT }} />,
    metrics: [
      { label: 'Prospect list size', value: '500-2,000/mo' },
      { label: 'Bounce rate', value: '< 2%' },
      { label: 'Reply sorting', value: '< 2 hours' },
    ],
    details: [
      'Ideal Client Research',
      'Hand-Built Prospect Lists',
      'Email Verification',
      'Email Writing',
      'Sending & Follow-Ups',
      'Reply Sorting & Handoff',
      'Performance Tracking',
    ],
  },
  {
    id: 'automation',
    label: 'AI Automation',
    headline: 'Let AI handle the busywork.',
    description: 'Automate repetitive tasks with custom AI agents that work across your entire stack — from data entry to client follow-ups.',
    badge: 'Automation',
    badgeColor: RED_TEXT,
    gradient: `linear-gradient(135deg, color-mix(in oklch, var(--accent-vivid) 3%, transparent) 0%, color-mix(in oklch, var(--accent-vivid) 7%, transparent) 100%)`,
    borderColor: `color-mix(in oklch, var(--accent-vivid) 8%, transparent)`,
    icon: <Zap size={20} strokeWidth={2} style={{ color: RED_TEXT }} />,
    metrics: [
      { label: 'Time saved', value: '10+ hrs/wk' },
      { label: 'Automation coverage', value: '100+ apps' },
      { label: 'Custom agents', value: 'Unlimited' },
    ],
    details: [
      'Custom AI Agents',
      'Workflow Automation',
      'Data Sync & Enrichment',
      'Smart Notifications',
      'Report Generation',
      'Client Follow-Up Sequences',
    ],
  },
  {
    id: 'analytics',
    label: 'Analytics & Insights',
    headline: 'Data-driven decisions, made simple.',
    description: 'Track performance across all your content and outreach with beautiful dashboards that surface the metrics that matter most.',
    badge: 'Analytics',
    badgeColor: RED_TEXT,
    gradient: `linear-gradient(135deg, color-mix(in oklch, var(--accent-vivid) 3%, transparent) 0%, color-mix(in oklch, var(--accent-vivid) 7%, transparent) 100%)`,
    borderColor: `color-mix(in oklch, var(--accent-vivid) 8%, transparent)`,
    icon: <BarChart3 size={20} strokeWidth={2} style={{ color: RED_TEXT }} />,
    metrics: [
      { label: 'Open rate', value: '45%+' },
      { label: 'Reply rate', value: '8%+' },
      { label: 'Reporting', value: 'Weekly' },
    ],
    details: [
      'Content Performance',
      'Outreach Analytics',
      'Pipeline Tracking',
      'ROI Reporting',
      'Custom Dashboards',
      'Weekly Insights',
    ],
  },
  {
    id: 'security',
    label: 'Security & Compliance',
    headline: 'Enterprise-grade security, built in.',
    description: 'Your data is protected with SOC 2 compliant infrastructure, end-to-end encryption, and role-based access controls.',
    badge: 'Security',
    badgeColor: RED_TEXT,
    gradient: `linear-gradient(135deg, color-mix(in oklch, var(--accent-vivid) 3%, transparent) 0%, color-mix(in oklch, var(--accent-vivid) 7%, transparent) 100%)`,
    borderColor: `color-mix(in oklch, var(--accent-vivid) 8%, transparent)`,
    icon: <Shield size={20} strokeWidth={2} style={{ color: RED_TEXT }} />,
    metrics: [
      { label: 'Compliance', value: 'SOC 2' },
      { label: 'Encryption', value: 'E2E' },
      { label: 'Uptime', value: '99.9%' },
    ],
    details: [
      'SOC 2 Compliant',
      'End-to-End Encryption',
      'Role-Based Access',
      'Audit Logs',
      'Data Residency',
      'GDPR Ready',
    ],
  },
  {
    id: 'integration',
    label: 'Integrations',
    headline: 'Connects with everything you use.',
    description: 'Native integrations with 100+ apps mean your data flows seamlessly between tools — no more copy-pasting or manual syncing.',
    badge: 'Integrations',
    badgeColor: RED_TEXT,
    gradient: `linear-gradient(135deg, color-mix(in oklch, var(--accent-vivid) 3%, transparent) 0%, color-mix(in oklch, var(--accent-vivid) 7%, transparent) 100%)`,
    borderColor: `color-mix(in oklch, var(--accent-vivid) 8%, transparent)`,
    icon: <Layers size={20} strokeWidth={2} style={{ color: RED_TEXT }} />,
    metrics: [
      { label: 'Integrations', value: '100+' },
      { label: 'Setup time', value: '< 5 min' },
      { label: 'API access', value: 'REST & GraphQL' },
    ],
    details: [
      'CRM Integration',
      'Email & Calendar',
      'Project Management',
      'Communication Tools',
      'Design Tools',
      'Custom Webhooks',
    ],
  },
];

const workflowSteps = [
  {
    step: '01',
    title: 'Record',
    description: 'You record one video. That\'s it. We handle everything else from here.',
    icon: <Play size={24} strokeWidth={2} style={{ color: RED_TEXT }} />,
  },
  {
    step: '02',
    title: 'Target',
    description: 'Tell us who you want to reach. We build a hand-curated list of decision-makers.',
    icon: <Globe size={24} strokeWidth={2} style={{ color: RED_TEXT }} />,
  },
  {
    step: '03',
    title: 'Create',
    description: 'We produce polished content, write personalized outreach, and schedule everything.',
    icon: <Sparkles size={24} strokeWidth={2} style={{ color: RED_TEXT }} />,
  },
  {
    step: '04',
    title: 'Convert',
    description: 'Sit back as qualified leads book calls, engage with your content, and become clients.',
    icon: <Rocket size={24} strokeWidth={2} style={{ color: RED_TEXT }} />,
  },
];

export default function SolutionsPage() {
  const [activeFeature, setActiveFeature] = useState(features[0].id);

  return (
    <div className="min-h-screen">
      {/* ── Hero Section ─────────────────────────────────────────────── */}
      <section className="relative pt-[calc(56px+80px)] pb-24 overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full opacity-30" style={{ background: `radial-gradient(circle, color-mix(in oklch, var(--accent-vivid) 3%, transparent) 0%, transparent 70%)` }} />
          <div className="absolute top-40 right-20 w-96 h-96 rounded-full opacity-20" style={{ background: `radial-gradient(circle, color-mix(in oklch, var(--status-info) 3%, transparent) 0%, transparent 70%)` }} />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px" style={{ background: `linear-gradient(90deg, transparent, ${FROST}, transparent)` }} />
        </div>

        <div className="relative max-w-[1100px] mx-auto px-6 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-16"
          >
            <Badge className="mb-6 bg-[var(--accent-vivid)]/[0.06] text-[var(--accent)] border-[var(--accent-vivid)]/[0.15] hover:bg-[var(--accent-vivid)]/[0.08] font-[600] tracking-[0.02em] rounded-full px-4 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-vivid)] mr-2 inline-block" />
              Solutions
            </Badge>

            <h1 className="display-headline text-[clamp(2.75rem,7vw,5.25rem)] text-[var(--on-surface)] max-w-[900px] mx-auto mb-6">
              Everything you need to
              <br />
              <span style={{ color: RED_TEXT }}>grow your business</span>
            </h1>

            <p className="body-copy text-base text-[var(--muted)] max-w-[600px] mx-auto">
              From content production to manual outreach — one unified system that helps you reach more clients and close more deals.
            </p>
          </motion.div>

          {/* Hero Visual */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="relative max-w-[900px] mx-auto"
          >
            <div className="bg-[var(--surface)] rounded-3xl border border-[var(--rule)] shadow-[0_20px_60px_color-mix(in oklch, var(--on-surface) 8%, transparent),0_4px_12px_color-mix(in oklch, var(--on-surface) 4%, transparent)] overflow-hidden">
              {/* Window chrome */}
              <div className="bg-[var(--surface-2)] px-6 py-4 flex items-center gap-4 border-b border-[var(--rule)]">
                <div className="flex gap-2">
                  {/* macOS traffic lights. A deliberate skeuomorphic quote of a real window
                      chrome, so these are fixed the way a third-party logo colour is —
                      recoloured to the palette they would stop reading as the reference. */}
                  {['#FF5F57', '#FEBC2E', '#28C840'].map(c => (
                    <span key={c} className="w-3 h-3 rounded-full block" style={{ background: c }} />
                  ))}
                </div>
                <div className="bg-[var(--surface)] border border-[var(--rule)] rounded-lg px-4 py-1.5 text-[12px] font-[500] text-[var(--muted)]">
                  📊 SlideIn Venture — Solutions Overview
                </div>
              </div>

              {/* Dashboard mockup */}
              <div className="p-8 md:p-12">
                <div className="grid grid-cols-3 gap-6 mb-8">
                  {[
                    { label: 'Content Produced', value: '128', change: '+12%' },
                    { label: 'Outreach Sent', value: '2.4K', change: '+8%' },
                    { label: 'Leads Generated', value: '47', change: '+23%' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-[var(--surface)] rounded-2xl p-5 border border-[var(--rule)]">
                      <p className="text-[11px] font-[600] uppercase tracking-[0.08em] text-[var(--muted)] mb-2">{stat.label}</p>
                      <p className="text-[28px] font-[700] text-[var(--on-surface)] tracking-[-0.02em]">{stat.value}</p>
                      <p className="text-[12px] font-[600] text-[var(--status-live)] mt-1">{stat.change} this month</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-[var(--accent-vivid)]/[0.03] rounded-2xl p-6 border border-[var(--accent-vivid)]/[0.08]">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `color-mix(in oklch, var(--accent-vivid) 7%, transparent)`, color: RED_TEXT }}>
                        <Sparkles size={20} strokeWidth={2} />
                      </div>
                      <div>
                        <p className="text-[13px] font-[600] text-[var(--on-surface)]">Content Engine</p>
                        <p className="text-[11px] text-[var(--muted)]">8 services active</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {['Audio & Video Editing', 'Show Notes', 'Transcripts', 'Short Form Clips'].map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-[12px] text-[var(--muted)]">
                          <CheckCircle2 size={14} style={{ color: RED_TEXT }} />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-[var(--status-info)]/[0.03] rounded-2xl p-6 border border-[var(--status-info)]/[0.08]">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'color-mix(in oklch, var(--status-info) 7%, transparent)', color: 'var(--status-info)' }}>
                        <Globe size={20} strokeWidth={2} />
                      </div>
                      <div>
                        <p className="text-[13px] font-[600] text-[var(--on-surface)]">Outreach Engine</p>
                        <p className="text-[11px] text-[var(--muted)]">7 services active</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {['Ideal Client Research', 'Hand-Built Lists', 'Email Writing', 'Sending & Follow-Ups'].map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-[12px] text-[var(--muted)]">
                          <CheckCircle2 size={14} style={{ color: 'var(--status-info)' }} />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Distribution Visual ──────────────────────────────────────── */}
      <section className="py-24 bg-[var(--surface-2)] overflow-hidden border-y border-[var(--rule)]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-12"
          >
            <h2 className="section-headline text-[clamp(2rem,4vw,3rem)] text-[var(--on-surface)] mb-4">
              Publishing, automated
            </h2>
            <p className="body-copy text-base text-[var(--muted)] max-w-[600px] mx-auto">
              Smart routing puts your content everywhere it needs to be.
            </p>
          </motion.div>
          <div className="w-full flex justify-center">
            <div className="w-full max-w-[1200px]">
              <DistributionSlide />
            </div>
          </div>
        </div>
      </section>

      {/* ── Solutions Grid ───────────────────────────────────────────── */}
      <section className="py-24">
        <div className="max-w-[1100px] mx-auto px-6 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-16"
          >
            <h2 className="section-headline text-[clamp(2rem,4vw,3rem)] text-[var(--on-surface)] mb-4">
              Built for modern teams
            </h2>
            <p className="body-copy text-base text-[var(--muted)] max-w-[500px] mx-auto">
              Six powerful solutions that work together to help you create, reach, and convert — all in one place.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
                <Card
                  className="group relative overflow-hidden border-[var(--rule)] bg-[var(--surface)] hover:shadow-[0_12px_40px_color-mix(in oklch, var(--on-surface) 8%, transparent)] transition-all duration-300 cursor-pointer rounded-2xl"
                  onClick={() => setActiveFeature(feature.id)}
                >
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: feature.gradient }}
                  />

                  <div className="relative p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center"
                        style={{ backgroundColor: 'var(--accent-wash)', color: feature.badgeColor }}
                      >
                        {feature.icon}
                      </div>
                      <Badge
                        className="font-[600] tracking-[0.02em] rounded-full px-3 py-1"
                        style={{
                          backgroundColor: 'var(--accent-wash)',
                          color: feature.badgeColor,
                          borderColor: 'var(--accent-ring)',
                        }}
                      >
                        {feature.badge}
                      </Badge>
                    </div>

                    <h3 className="text-[22px] font-[700] tracking-[-0.02em] text-[var(--on-surface)] mb-3">
                      {feature.headline}
                    </h3>
                    <p className="text-[14px] leading-[1.7] text-[var(--muted)] mb-6">
                      {feature.description}
                    </p>

                    {/* Metrics */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {feature.metrics.map((metric, i) => (
                        <div key={i} className="text-center">
                          <p className="text-[18px] font-[700] tracking-[-0.01em]" style={{ color: feature.badgeColor }}>
                            {metric.value}
                          </p>
                          <p className="text-[10px] font-[600] uppercase tracking-[0.06em] text-[var(--muted)] mt-1">
                            {metric.label}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Details list */}
                    <div className="space-y-2.5">
                      {feature.details.map((detail, i) => (
                        <div key={i} className="flex items-center gap-2.5 text-[13px] text-[var(--muted)]">
                          <CheckCircle2 size={16} style={{ color: feature.badgeColor }} />
                          <span>{detail}</span>
                        </div>
                      ))}
                    </div>

                    {/* Hover arrow */}
                    <motion.div
                      className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      style={{ color: feature.badgeColor }}
                    >
                      <ArrowRight size={20} strokeWidth={2} />
                    </motion.div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Workflow Section ─────────────────────────────────────────── */}
      <section className="py-24">
        <div className="max-w-[1100px] mx-auto px-6 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-16"
          >
            <h2 className="section-headline text-[clamp(2rem,4vw,3rem)] text-[var(--on-surface)] mb-4">
              How it works
            </h2>
            <p className="body-copy text-base text-[var(--muted)] max-w-[500px] mx-auto">
              Four simple steps to transform your content and outreach workflow.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {workflowSteps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-[var(--surface)] border border-[var(--rule)] shadow-[0_4px_12px_color-mix(in oklch, var(--on-surface) 6%, transparent)]">
                    {step.icon}
                  </div>
                  <div className="text-[11px] font-[700] uppercase tracking-[0.1em] text-[var(--muted)] mb-2">
                    Step {step.step}
                  </div>
                  <h3 className="text-[20px] font-[700] tracking-[-0.015em] text-[var(--on-surface)] mb-3">
                    {step.title}
                  </h3>
                  <p className="text-[13px] leading-[1.7] text-[var(--muted)]">
                    {step.description}
                  </p>
                </div>

                {index < workflowSteps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px" style={{ background: `linear-gradient(90deg, ${FROST}, color-mix(in oklch, var(--accent-vivid) 19%, transparent), ${FROST})` }} />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── The Steps ────────────────────────────────────────────────────
          MOVED to /steps. The five chapter run that used to close this page is
          now the last section of /steps, which is where the site's Steps
          navigation points and where the argument belongs: after the reader has
          been through the 28 steps of how the work is actually done.

          Its copy lives in content/steps/deck-chapters.ts and it renders from
          components/Steps/DeckChapters.tsx. The slide components themselves are
          untouched. Do not re add it here. */}

      {/* ── CTA Section ─────────────────────────────────────────────── */}
      <section className="py-24">
        <div className="max-w-[800px] mx-auto px-6 md:px-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-8" style={{ backgroundColor: `color-mix(in oklch, var(--accent-vivid) 7%, transparent)`, color: RED_TEXT }}>
              <Rocket size={28} strokeWidth={2} />
            </div>

          <h2 className="section-headline text-xl font-[700] text-[var(--on-surface)] mb-4">
            Ready to get started?
          </h2>
          <p className="body-copy text-sm text-[var(--muted)] max-w-[500px] mx-auto mb-10">
              Join hundreds of founders who are already using SlideIn Venture to grow their business.
            </p>

            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link
                href="/signup"
                className={buttonVariants({
                  size: "lg",
                  className: "bg-[var(--accent-vivid)] hover:bg-[var(--color-ember)] text-[var(--on-accent)] font-[600] tracking-[-0.01em] shadow-[0_4px_14px_color-mix(in oklch, var(--accent-vivid) 25%, transparent)] hover:shadow-[0_6px_20px_color-mix(in oklch, var(--accent-vivid) 35%, transparent)] hover:-translate-y-px transition-all duration-150 rounded-[7px] h-12 px-8",
                })}
              >
                Start for free
                <ArrowRight size={16} strokeWidth={2} className="ml-2" />
              </Link>
              <Link
                href="/pricing"
                className={buttonVariants({
                  variant: "outline",
                  size: "lg",
                  className: "font-[500] tracking-[-0.01em] rounded-[7px] h-12 px-8 border-[var(--rule)] hover:bg-[var(--surface-2)] hover:border-[var(--rule)]",
                })}
              >
                View pricing
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
