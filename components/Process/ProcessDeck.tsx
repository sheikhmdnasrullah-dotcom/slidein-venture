'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1] as const;

const SLIDES = [
  {
    type: 'title',
    eyebrow: 'SlideIn Venture',
    title: '100 qualified sales calls in 90 days',
    subtitle: 'The system that runs the 90-day sprint.',
  },
  {
    type: 'problem',
    eyebrow: 'The gap',
    title: 'Three bottlenecks in predictable pipeline',
    items: [
      'Most outreach is mechanism-led — content, emails, automation — without a single number the client can hold you to.',
      'Fragmented tools and handoffs mean nothing is auditable end to end. The client cannot see what is happening.',
      'Competitors pitch the same retainer under different names. There is no transparent differentiator.',
    ],
  },
  {
    type: 'solution',
    eyebrow: 'The answer',
    title: 'One acquisition engine. Seven layers.',
    subtitle: 'Strategy, outbound, content, landing, AI agents, calendar, knowledge. All logged. All visible.',
  },
  {
    type: 'layer',
    num: '01',
    title: 'Offer Engineering',
    body: 'Analyze the offer, market position, differentiators, objections, pricing, and target customer. Output a clearer, more commercially attractive offer that can be communicated consistently across every channel.',
  },
  {
    type: 'layer',
    num: '02',
    title: 'ICP & Prospect Research',
    body: 'Define the ideal customer profile across industry, company size, revenue, geography, role, buying authority, pain points, trigger events, and likely budget. Build a prospect database with full tracking on ICP fit, source, qualification status, outreach status, conversation status, appointment status, and notes.',
  },
  {
    type: 'layer',
    num: '03',
    title: 'Outbound Acquisition Engine',
    body: 'Build campaigns around ICP segment, prospect pain, offer, value proposition, personalization, trigger event, CTA, and follow-up logic. Engineer the sending infrastructure for legitimate deliverability: domain configuration, SPF, DKIM, DMARC, warm-up, list hygiene, bounce management, suppression handling, sending-volume controls, and monitoring.',
  },
  {
    type: 'layer',
    num: '04',
    title: 'Conversion Landing Page',
    body: 'Each client receives a conversion-focused landing page built around their offer. Sections: value proposition, problem, desired outcome, offer, how it works, proof and case studies, differentiators, objection handling, FAQ, AI interaction, lead capture, calendar booking, and a strong CTA.',
  },
  {
    type: 'layer',
    num: '05',
    title: 'AI Website Agent',
    body: 'Lives on the landing page. Answers common questions, explains the offer, handles basic objections, collects prospect information, qualifies prospects, directs qualified prospects toward booking, and escalates questions requiring human judgment. Operates only from an approved client knowledge base.',
  },
  {
    type: 'layer',
    num: '06',
    title: 'AI Phone Receptionist',
    body: 'Answers inbound calls, understands intent, answers FAQs, qualifies when appropriate, checks the client calendar, offers available times, books the meeting, and notifies the client. Escalates anything needing human judgment by offering a meeting, recording the interaction, and notifying the client.',
  },
  {
    type: 'layer',
    num: '07',
    title: 'Content Acquisition Engine',
    body: '90 short-form videos over the 90-day engagement. Supports awareness, authority, trust, offer education, objection handling, demand generation, retargeting, and appointment generation. Distributed to whichever platforms fit the ICP.',
  },
  {
    type: 'timeline',
    eyebrow: '90-day sprint',
    title: 'Five phases. One guarantee.',
    phases: [
      { phase: 'Week 1', label: 'Foundation', body: 'ICP research, offer analysis, positioning, messaging, and acquisition strategy. Domains, email infrastructure, authentication, tracking, calendar, CRM and data structure, client command center, and knowledge base.' },
      { phase: 'Week 2', label: 'Launch Preparation', body: 'Prospect database, campaign creation, personalization framework, follow-up sequences, AI agent configuration, phone agent configuration where applicable, content strategy, first scripts, first content production, and analytics.' },
      { phase: 'Weeks 3-4', label: 'Initial Launch', body: 'Launch outbound. Begin content publishing. Monitor responses, deliverability, and landing-page behavior. Improve messaging, refine AI responses, and fix operational issues.' },
      { phase: 'Month 2', label: 'Optimization & Scale', body: 'Scale winning campaigns. Remove poor-performing segments. Improve messaging, expand content, improve conversion. Test paid acquisition where appropriate. Improve AI qualification and follow-up.' },
      { phase: 'Month 3', label: 'Scale & Systemization', body: 'Double down on winning ICP segments. Optimize appointment conversion. Improve campaign economics and content performance. Refine agent workflows. Document successful systems. Prepare continuation and maintenance plan.' },
    ],
  },
  {
    type: 'guarantee',
    eyebrow: 'The commitment',
    title: '100 qualified sales appointments in 90 days',
    subtitle: 'Or we keep working free until the number hits.',
  },
];

export default function ProcessDeck() {
  const [index, setIndex] = useState(0);
  const total = SLIDES.length;

  const next = useCallback(() => setIndex((i) => Math.min(i + 1, total - 1)), [total]);
  const prev = useCallback(() => setIndex((i) => Math.max(i - 1, 0)), []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); next(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
      else if (e.key === 'Home') { e.preventDefault(); setIndex(0); }
      else if (e.key === 'End') { e.preventDefault(); setIndex(total - 1); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [next, prev, total]);

  const slide = SLIDES[index];

  return (
    <div className="flex flex-col items-center">
      {/* Viewport */}
      <div className="relative w-full max-w-[1200px] aspect-[16/9] bg-white border border-[#171717] rounded-lg overflow-hidden shadow-[0_16px_36px_rgba(0,0,0,0.08)]">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="absolute inset-0 flex flex-col p-8 md:p-12"
          >
            {slide.type === 'title' && (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#ea580c]">{slide.eyebrow}</p>
                <h1 className="mt-5 font-display-xl max-w-[14ch] text-[clamp(1.75rem,4.5vw,3.25rem)] font-bold leading-[1.05] tracking-tight text-[#0a0a0a]">
                  {slide.title}
                </h1>
                <p className="mt-5 max-w-[48ch] font-body text-[15px] leading-relaxed text-[#404040]">{slide.subtitle}</p>
              </div>
            )}

            {slide.type === 'problem' && (
              <div className="flex h-full flex-col">
                <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#ea580c]">{slide.eyebrow}</p>
                <h2 className="mt-3 font-display-md max-w-[22ch] text-[clamp(1.25rem,3vw,2rem)] font-bold leading-[1.1] tracking-tight text-[#0a0a0a]">{slide.title}</h2>
                <div className="mt-6 grid flex-1 grid-cols-1 gap-4 md:grid-cols-3">
                  {slide.items?.map((item, i) => (
                    <div key={i} className="flex flex-col rounded-md border border-[#171717] bg-white p-5">
                      <div className="flex items-center gap-2.5 border-b border-[#e5e5e5] pb-2.5">
                        <span className="flex h-6 w-6 items-center justify-center rounded border border-[#fed7aa] bg-[#fff7ed] font-mono text-[11px] font-bold text-[#ea580c]">{String(i + 1).padStart(2, '0')}</span>
                        <span className="font-display-sm text-[13px] font-bold text-[#0a0a0a]">Bottleneck {i + 1}</span>
                      </div>
                      <p className="mt-3 font-body text-[13px] leading-[1.6] text-[#404040]">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {slide.type === 'solution' && (
              <div className="flex h-full flex-col">
                <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#ea580c]">{slide.eyebrow}</p>
                <h2 className="mt-3 font-display-md max-w-[20ch] text-[clamp(1.25rem,3vw,2rem)] font-bold leading-[1.1] tracking-tight text-[#0a0a0a]">{slide.title}</h2>
                <p className="mt-2 max-w-[56ch] font-body text-[14px] leading-relaxed text-[#404040]">{slide.subtitle}</p>
                <div className="mt-auto grid grid-cols-2 gap-3 md:grid-cols-4">
                  {['Offer & ICP', 'Outbound Engine', 'Landing + AI', 'Content Engine'].map((label, i) => (
                    <div key={label} className="flex flex-col rounded-md border border-[#171717] bg-white p-4">
                      <span className="font-mono text-[11px] font-bold text-[#ea580c]">0{i + 1}</span>
                      <span className="mt-1.5 font-display-sm text-[13px] font-bold text-[#0a0a0a]">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {slide.type === 'layer' && (
              <div className="flex h-full flex-col">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[11px] font-bold text-[#ea580c]">{slide.num}</span>
                  <div className="h-px flex-1 bg-gradient-to-r from-[#ea580c] to-transparent" aria-hidden />
                </div>
                <h2 className="mt-4 font-display-md text-[clamp(1.25rem,2.8vw,1.85rem)] font-bold leading-[1.1] tracking-tight text-[#0a0a0a]">{slide.title}</h2>
                <p className="mt-4 max-w-[68ch] font-body text-[14px] leading-[1.7] text-[#404040]">{slide.body}</p>
              </div>
            )}

            {slide.type === 'timeline' && (
              <div className="flex h-full flex-col">
                <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#ea580c]">{slide.eyebrow}</p>
                <h2 className="mt-3 font-display-md max-w-[20ch] text-[clamp(1.25rem,3vw,2rem)] font-bold leading-[1.1] tracking-tight text-[#0a0a0a]">{slide.title}</h2>
                <div className="mt-5 flex flex-1 flex-col gap-2.5">
                  {slide.phases?.map((p, i) => (
                    <div key={p.phase} className="flex items-stretch gap-4">
                      <div className="flex w-20 shrink-0 flex-col justify-center">
                        <span className="font-mono text-[11px] font-bold text-[#ea580c]">{p.phase}</span>
                        <span className="font-display-sm text-[13px] font-bold text-[#0a0a0a]">{p.label}</span>
                      </div>
                      <div className="h-px w-6 bg-[#e5e5e5] shrink-0" aria-hidden />
                      <p className="font-body text-[13px] leading-[1.6] text-[#404040]">{p.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {slide.type === 'guarantee' && (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#ea580c]">{slide.eyebrow}</p>
                <h2 className="mt-5 font-display-xl max-w-[16ch] text-[clamp(1.5rem,4.2vw,3rem)] font-bold leading-[1.05] tracking-tight text-[#0a0a0a]">{slide.title}</h2>
                <p className="mt-4 max-w-[44ch] font-body text-[15px] leading-relaxed text-[#404040]">{slide.subtitle}</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Progress */}
        <div className="absolute bottom-0 left-0 h-[3px] w-full bg-[#e5e5e5]">
          <div className="h-full bg-[#ea580c] transition-all duration-300 ease-out" style={{ width: `${((index + 1) / total) * 100}%` }} />
        </div>
      </div>

      {/* Controls */}
      <div className="mt-5 flex w-full max-w-[1200px] items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={prev} disabled={index === 0} className="btn-premium rounded-md border border-[#171717] bg-white px-3 py-1.5 text-[13px] font-semibold text-[#0a0a0a] transition-colors hover:bg-[#0a0a0a] hover:text-white disabled:opacity-30">Previous</button>
          <button onClick={next} disabled={index === total - 1} className="btn-premium rounded-md border border-[#171717] bg-white px-3 py-1.5 text-[13px] font-semibold text-[#0a0a0a] transition-colors hover:bg-[#0a0a0a] hover:text-white disabled:opacity-30">Next</button>
        </div>
        <div className="font-mono text-[12px] text-[#737373]">
          <span className="text-[#0a0a0a]">{index + 1}</span> / {total}
        </div>
      </div>
    </div>
  );
}
