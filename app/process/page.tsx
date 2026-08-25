import type { Metadata } from 'next';
import Section from '@/components/Section';
import { MonoLabel, SectionRule, CornerBrackets } from '@/components/System/System';

export const metadata: Metadata = {
  title: 'Process · SlideIn Venture',
  description: 'The 90-day appointment-engine system: seven layers, five phases, one guarantee.',
};

const LAYERS = [
  {
    num: '01',
    title: 'Offer Engineering',
    body: 'Analyze the client\'s offer, market position, differentiators, objections, pricing, and target customer. Output a clearer, more commercially attractive offer that can be communicated consistently across landing pages, email, social content, AI agents, paid ads, and sales conversations.',
    items: [
      'Principle: do not scale weak positioning. If the offer is unclear or unattractive, the system identifies that before significant outreach is deployed.',
    ],
  },
  {
    num: '02',
    title: 'ICP & Prospect Research',
    body: 'Define the ideal customer profile across industry, company size, revenue, geography, role, buying authority, pain points, trigger events, and likely budget. Build a prospect database with full tracking on ICP fit, source, qualification status, outreach status, conversation status, appointment status, and notes.',
    items: [
      'Poor-fit, invalid, duplicate, or unusable records are excluded according to agreed data-quality rules.',
    ],
  },
  {
    num: '03',
    title: 'Outbound Acquisition Engine',
    body: 'Build campaigns around ICP segment, prospect pain, offer, value proposition, personalization, trigger event, CTA, and follow-up logic. Engineer the sending infrastructure for legitimate deliverability: domain configuration, SPF, DKIM, DMARC, warm-up, list hygiene, bounce management, suppression handling, sending-volume controls, and monitoring.',
    items: [
      'Objective is relevant conversations with qualified prospects, not the largest number of messages.',
    ],
  },
  {
    num: '04',
    title: 'Conversion Landing Page',
    body: 'Each client receives a conversion-focused landing page built around their offer. Sections: value proposition, problem, desired outcome, offer, how it works, proof and case studies, differentiators, objection handling, FAQ, AI interaction, lead capture, calendar booking, and a strong CTA.',
    items: [
      'Turns acquisition traffic into leads, qualified conversations, and booked appointments.',
    ],
  },
  {
    num: '05',
    title: 'AI Website Agent',
    body: 'Lives on the landing page. Answers common questions, explains the offer, handles basic objections, collects prospect information, qualifies prospects, directs qualified prospects toward booking, and escalates questions requiring human judgment. Operates only from an approved client knowledge base.',
    items: [
      'Does not invent unsupported claims.',
    ],
  },
  {
    num: '06',
    title: 'AI Phone Receptionist',
    body: 'Answers inbound calls, understands intent, answers FAQs, qualifies when appropriate, checks the client calendar, offers available times, books the meeting, and notifies the client. Escalates anything needing human judgment by offering a meeting, recording the interaction, and notifying the client.',
    items: [
      'Does not pretend to be human where disclosure is required.',
    ],
  },
  {
    num: '07',
    title: 'Content Acquisition Engine',
    body: '90 short-form videos over the 90-day engagement. Supports awareness, authority, trust, offer education, objection handling, demand generation, retargeting, and appointment generation. Distributed to whichever platforms fit the ICP.',
    items: [
      'Client picks one of four production paths. A. Client records raw footage, Tanim scripts, edits, captions, and publishes. B. AI avatar plus voice clone of the client. C. Synthetic fictional AI brand representative. D. Real human presenter, Tanim shoots and edits.',
    ],
  },
];

const PHASES = [
  {
    num: '01',
    title: 'Week 1 - Foundation',
    coordinate: 'Days 1-7',
    body: 'ICP research, offer analysis, positioning, messaging, and acquisition strategy. Domains, email infrastructure, authentication, tracking, calendar, CRM and data structure, client command center, and knowledge base. Landing page architecture, offer messaging, and AI agent knowledge.',
  },
  {
    num: '02',
    title: 'Week 2 - Launch Preparation',
    coordinate: 'Days 8-14',
    body: 'Prospect database, campaign creation, personalization framework, follow-up sequences, AI agent configuration, phone agent configuration where applicable, content strategy, first scripts, first content production, and analytics.',
  },
  {
    num: '03',
    title: 'Weeks 3-4 - Initial Launch',
    coordinate: 'Days 15-30',
    body: 'Launch outbound. Begin content publishing. Monitor responses, deliverability, and landing-page behavior. Improve messaging, refine AI responses, and fix operational issues.',
  },
  {
    num: '04',
    title: 'Month 2 - Optimization & Scale',
    coordinate: 'Days 31-60',
    body: 'Scale winning campaigns. Remove poor-performing segments. Improve messaging, expand content, improve conversion. Test paid acquisition where appropriate. Improve AI qualification and follow-up.',
  },
  {
    num: '05',
    title: 'Month 3 - Scale & Systemization',
    coordinate: 'Days 61-90',
    body: 'Double down on winning ICP segments. Optimize appointment conversion. Improve campaign economics and content performance. Refine agent workflows. Document successful systems. Prepare continuation and maintenance plan.',
  },
];

const COMMAND_CENTER_SECTIONS = [
  {
    label: 'Overview',
    descriptor:
      'Appointments booked, upcoming, qualified prospects, outreach volume, positive replies, conversion rates, content and campaign performance, AI activity, important alerts.',
  },
  {
    label: 'Leads',
    descriptor:
      'Prospect database, ICP score, qualification, conversation history, source, campaign, status, appointment status, notes.',
  },
  {
    label: 'Outbound',
    descriptor:
      'Campaigns, sending status, prospects contacted, replies, positive and negative replies, bounce rate, appointments.',
  },
  {
    label: 'Content',
    descriptor:
      'Strategy, scripts, production status, scheduled and published content, performance, platform, CTA, content to appointment attribution.',
  },
  {
    label: 'AI Agents',
    descriptor:
      'Website agent, phone agent, qualification agent, follow-up agents, status, recent activity, escalations, errors, human interventions.',
  },
  {
    label: 'Calendar',
    descriptor:
      'Availability, upcoming appointments, booked meetings, meeting source, prospect information.',
  },
  {
    label: 'Knowledge Base',
    descriptor:
      'Company information, services, pricing, FAQs, case studies, brand voice, ICP, objections, approved claims, policies, sales messaging.',
  },
];

function Slide({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative w-full aspect-[16/9] ${className}`}>
      <div
        className="absolute inset-0 rounded-[calc(var(--radius-md)*1.7)]"
        style={{
          background: 'linear-gradient(180deg, var(--gloss), transparent 34%), var(--surface-glass)',
          border: '1px solid var(--rule)',
          boxShadow: 'var(--shadow-inset-top), var(--shadow-raised)',
          backdropFilter: 'blur(22px) saturate(1.25)',
          WebkitBackdropFilter: 'blur(22px) saturate(1.25)',
        }}
      >
        <CornerBrackets size={12} className="left-3.5 top-3.5" />
        <CornerBrackets size={12} className="right-3.5 top-3.5" />
        <CornerBrackets size={12} className="bottom-3.5 left-3.5" />
        <CornerBrackets size={12} className="bottom-3.5 right-3.5" />
        <div className="relative h-full flex flex-col justify-center px-6 py-8 sm:px-8 sm:py-10">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function ProcessPage() {
  return (
    <>
      <Section tone="hero" pad="base" className="pt-[calc(96px+clamp(3rem,6vw,6rem))]">
        <div className="mx-auto max-w-[1160px] px-6 md:px-10">
          <SectionRule index="09" label="Process" className="mb-6" />
          <MonoLabel>The system that runs the 90-day sprint</MonoLabel>
        </div>
      </Section>

      <Section tone="base" pad="tall" seam>
        <div className="mx-auto max-w-[1160px] flex flex-col gap-5 px-6 md:px-10">
          {LAYERS.map((layer) => (
            <Slide key={layer.num}>
              <MonoLabel className="text-[var(--accent)]">Layer {layer.num} - {layer.title}</MonoLabel>
              <p className="mt-4 font-body text-[14px] leading-[1.7] text-[var(--muted)] sm:text-[15px]">
                {layer.body}
              </p>
              {layer.items && (
                <ul className="mt-5 flex flex-col gap-2">
                  {layer.items.map((item) => (
                    <li key={item} className="font-body text-[13px] leading-snug text-[var(--muted)]">
                      - {item}
                    </li>
                  ))}
                </ul>
              )}
            </Slide>
          ))}
        </div>
      </Section>

      <Section tone="raised" pad="tall" seam>
        <div className="mx-auto max-w-[1160px] flex flex-col gap-5 px-6 md:px-10">
          {PHASES.map((phase) => (
            <Slide key={phase.num}>
              <div className="flex flex-col justify-center h-full gap-3">
                <SectionRule index={phase.num} label={phase.title} coordinate={phase.coordinate} />
                <p className="font-body text-[14px] leading-[1.7] text-[var(--muted)] sm:text-[15px]">
                  {phase.body}
                </p>
              </div>
            </Slide>
          ))}
        </div>
      </Section>

      <Section tone="anchor" pad="tall" seam bleed>
        <div className="mx-auto max-w-[1160px] flex flex-col gap-5 px-6 md:px-10">
          {COMMAND_CENTER_SECTIONS.map((section) => (
            <Slide key={section.label}>
              <div className="flex flex-col justify-center h-full gap-3">
                <MonoLabel className="text-[var(--accent)]">{section.label}</MonoLabel>
                <p className="font-body text-[14px] leading-[1.7] text-[var(--muted)] sm:text-[15px]">
                  {section.descriptor}
                </p>
              </div>
            </Slide>
          ))}
        </div>
      </Section>

      <Section tone="base" pad="tall" seam>
        <div className="mx-auto max-w-[700px] px-6 md:px-10">
          <p className="font-body text-[15px] leading-[1.8] text-[var(--muted)]">
            This is not a dashboard where you store information. It is a command center where your AI agents can help execute work.
          </p>
        </div>
      </Section>

      <Section tone="terminal" pad="base" seam>
        <div className="mx-auto max-w-[900px] px-6 py-16 text-center md:px-10 md:py-20">
          <SectionRule index="10" label="The guarantee" className="mb-6" />
          <MonoLabel className="block">100 qualified sales appointments in 90 days, or we keep working free until we hit it.</MonoLabel>
        </div>
      </Section>
    </>
  );
}
