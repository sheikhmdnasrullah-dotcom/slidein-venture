import type { Metadata } from 'next';
import Section from '@/components/Section';
import AmbientEnvironment from '@/components/AmbientEnvironment/AmbientEnvironment';
import { MonoLabel, SectionRule } from '@/components/System/System';
import { Rise } from '@/components/PitchDeck/ScrollReveal';
import LetsTalkButton from '@/components/Navbar/LetsTalkButton';
import { ProcessHead } from '@/components/Process/ProcessHead';
import { PhaseRail } from '@/components/Process/PhaseRail';
import { PhaseList } from '@/components/Process/PhaseList';
import { FunnelDiagram } from '@/components/Process/FunnelDiagram';
import ProcessTable from '@/components/Process/ProcessTable';
import { Callout, CardGrid, SpecCard } from '@/components/Process/ProcessUI';
import {
  ARCHITECTURE,
  CLOSING,
  FUNNEL,
  HERO,
  NEXT_STEPS,
  PHASES_HEAD,
  PROBLEM,
  TIMELINE,
  WORK,
} from '@/content/process';

export const metadata: Metadata = {
  title: 'Process · THE MORTGAGE GROWTH SYSTEM',
  description:
    'A six-phase digital growth and email campaign system for mortgage companies: deliverability infrastructure, educational content, an interactive lead hub, a five-touch email engine and booked consultations — built in 90 days.',
};

/* One width for every band. 1200 is the site's reading measure for prose and
   its grid for tables; nothing on this page needs to be wider. */
const WRAP = 'mx-auto w-full max-w-[1200px] px-6 md:px-10';

/**
 * PROCESS — the system, nine bands
 * ---------------------------------------------------------------------------
 * The page alternates two values and never a third: the page's own paper for
 * the argument (problem, phases, work, next steps) and the anchor paper for
 * the proof (architecture, funnel, timeline, close). Each change of value is
 * a seam, so the reader can count the chapters with their eyes before they
 * read them.
 *
 * Everything drawn here — cards, rail, funnel, tables, callouts — comes from
 * components/Process. The page itself only decides order, tone and air. All
 * of the words come from content/process.ts.
 *
 * Orange is set almost entirely by graphics: the hero's rule, the rail's
 * arrows, the funnel's goal marker, the callout's bar, and one accent phrase
 * per headline. The only solid orange that ever appears at size is the rail
 * and the ambient wash — never a fill behind type, which is the one thing
 * this palette cannot carry.
 */
export default function ProcessPage() {
  return (
    <div>
      {/* ── 01 · The system ─────────────────────────────────────────────── */}
      <Section
        tone="hero"
        pad="none"
        id="process"
        className="relative flex min-h-[86svh] flex-col justify-end pb-[clamp(3.5rem,7vw,6rem)] pt-[calc(96px+clamp(3rem,6vw,6rem))]"
      >
        <AmbientEnvironment />

        <div className="relative z-10 mx-auto w-full max-w-[1200px] px-6 md:px-10">
          <Rise>
            <SectionRule
              index={HERO.rule.index}
              label={HERO.rule.label}
              coordinate={HERO.rule.coordinate}
            />
          </Rise>

          <Rise delay={0.06}>
            <span aria-hidden className="mt-[clamp(2.5rem,5vw,4.5rem)] block h-[3px] w-12 bg-[var(--accent-vivid)]" />

            <MonoLabel className="mt-5 block text-[var(--on-surface)]/70">{HERO.kicker}</MonoLabel>

            <h1 className="font-display-xl mt-6 max-w-[24ch] text-[clamp(2.1rem,4.8vw,4.25rem)] leading-[1.05] text-[var(--on-surface)]">
              {HERO.line1}
              <br />
              {HERO.line2}
            </h1>

            <p className="font-body mt-7 max-w-[58ch] text-[17px] leading-[1.6] text-[var(--muted)]">
              {HERO.lead}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2">
              {HERO.meta.map((item, i) => (
                <span key={item} className="flex items-center gap-3">
                  {i > 0 && (
                    <span aria-hidden className="text-[var(--on-surface)]/45">
                      ·
                    </span>
                  )}
                  <MonoLabel className="text-[var(--on-surface)]/75">{item}</MonoLabel>
                </span>
              ))}
            </div>
          </Rise>
        </div>
      </Section>

      {/* ── 02 · The problem ────────────────────────────────────────────── */}
      <Section tone="base" pad="tall">
        <div className={WRAP}>
          <ProcessHead
            index={PROBLEM.rule.index}
            label={PROBLEM.rule.label}
            coordinate={PROBLEM.rule.coordinate}
            title={PROBLEM.title}
            titleAccent={PROBLEM.titleAccent}
            lead={PROBLEM.lead}
          />

          <Rise delay={0.12}>
            <div className="mt-10">
              <CardGrid cards={PROBLEM.cards} cols={3} />
            </div>
          </Rise>

          <Callout lead={PROBLEM.callout.lead} body={PROBLEM.callout.body} className="mt-6" />
        </div>
      </Section>

      {/* ── 03 · The architecture ───────────────────────────────────────── */}
      <Section tone="anchor" pad="tall" seam bleed>
        <div className={WRAP}>
          <ProcessHead
            index={ARCHITECTURE.rule.index}
            label={ARCHITECTURE.rule.label}
            coordinate={ARCHITECTURE.rule.coordinate}
            title={ARCHITECTURE.title}
            titleAccent={ARCHITECTURE.titleAccent}
            lead={ARCHITECTURE.lead}
          />

          <div className="mt-10">
            <PhaseRail />
          </div>

          <Rise delay={0.16}>
            <div className="mt-6">
              <CardGrid cards={ARCHITECTURE.cards} cols={3} />
            </div>
          </Rise>

          <Callout lead={ARCHITECTURE.callout.lead} body={ARCHITECTURE.callout.body} className="mt-6" />
        </div>
      </Section>

      {/* ── 04 · The six phases ─────────────────────────────────────────── */}
      <Section tone="base" pad="tall" seam>
        <div className={WRAP}>
          <ProcessHead
            index={PHASES_HEAD.rule.index}
            label={PHASES_HEAD.rule.label}
            coordinate={PHASES_HEAD.rule.coordinate}
            title={PHASES_HEAD.title}
            titleAccent={PHASES_HEAD.titleAccent}
            lead={PHASES_HEAD.lead}
          />

          <PhaseList />
        </div>
      </Section>

      {/* ── 05 · The complete system ────────────────────────────────────── */}
      <Section tone="anchor" pad="tall" seam bleed>
        <div className={WRAP}>
          <ProcessHead
            index={FUNNEL.rule.index}
            label={FUNNEL.rule.label}
            coordinate={FUNNEL.rule.coordinate}
            title={FUNNEL.title}
            titleAccent={FUNNEL.titleAccent}
            lead={FUNNEL.lead}
          />

          <div className="mt-10">
            <FunnelDiagram />
          </div>

          <Callout lead={FUNNEL.callout.lead} body={FUNNEL.callout.body} className="mt-6" />
        </div>
      </Section>

      {/* ── 06 · How it works ───────────────────────────────────────────── */}
      <Section tone="base" pad="tall" seam>
        <div className={WRAP}>
          <ProcessHead
            index={WORK.rule.index}
            label={WORK.rule.label}
            coordinate={WORK.rule.coordinate}
            title={WORK.title}
            titleAccent={WORK.titleAccent}
            lead={WORK.lead}
          />

          <Rise delay={0.1}>
            <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
              <SpecCard spec={WORK.left} />
              <SpecCard spec={WORK.right} />
            </div>
          </Rise>

          <Callout lead={WORK.callout.lead} body={WORK.callout.body} className="mt-6" />
        </div>
      </Section>

      {/* ── 07 · Rollout schedule ───────────────────────────────────────── */}
      <Section tone="anchor" pad="tall" seam bleed>
        <div className={WRAP}>
          <ProcessHead
            index={TIMELINE.rule.index}
            label={TIMELINE.rule.label}
            coordinate={TIMELINE.rule.coordinate}
            title={TIMELINE.title}
            titleAccent={TIMELINE.titleAccent}
            lead={TIMELINE.lead}
          />

          <ProcessTable spec={TIMELINE.table} className="mt-10" />

          <Callout lead={TIMELINE.callout.lead} body={TIMELINE.callout.body} className="mt-6" />
        </div>
      </Section>

      {/* ── 08 · Launch sequence ────────────────────────────────────────── */}
      <Section tone="base" pad="tall" seam>
        <div className={WRAP}>
          <ProcessHead
            index={NEXT_STEPS.rule.index}
            label={NEXT_STEPS.rule.label}
            coordinate={NEXT_STEPS.rule.coordinate}
            title={NEXT_STEPS.title}
            titleAccent={NEXT_STEPS.titleAccent}
            lead={NEXT_STEPS.lead}
          />

          <Rise delay={0.1}>
            <div className="mt-10">
              <CardGrid cards={NEXT_STEPS.cards} cols={3} />
            </div>
          </Rise>

          <Callout lead={NEXT_STEPS.callout.lead} body={NEXT_STEPS.callout.body} className="mt-6" />
        </div>
      </Section>

      {/* ── 09 · The guarantee ──────────────────────────────────────────── */}
      <Section tone="anchor" pad="tall" seam bleed>
        <div className={WRAP}>
          <Rise>
            <SectionRule
              index={CLOSING.rule.index}
              label={CLOSING.rule.label}
              coordinate={CLOSING.rule.coordinate}
            />
          </Rise>

          <Rise delay={0.06}>
            <MonoLabel className="mt-10 block text-[var(--accent)]">{CLOSING.kicker}</MonoLabel>

            <h2 className="font-display-md mt-5 max-w-[20ch] text-[clamp(1.9rem,3.6vw,3rem)] text-[var(--on-surface)]">
              {CLOSING.title} <span className="text-[var(--accent)]">{CLOSING.titleAccent}</span>
            </h2>

            <p className="font-display-sm mt-7 max-w-[46ch] text-[clamp(1.2rem,2.2vw,1.6rem)] leading-[1.35] text-[var(--on-surface)]">
              {CLOSING.guarantee}
            </p>

            <p className="font-body mt-5 max-w-[58ch] text-[17px] leading-[1.6] text-[var(--muted)]">
              {CLOSING.body}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2">
              {CLOSING.meta.map((item, i) => (
                <span key={item} className="flex items-center gap-3">
                  {i > 0 && (
                    <span aria-hidden className="text-[var(--faint)]">
                      ·
                    </span>
                  )}
                  <MonoLabel className="text-[var(--muted)]">{item}</MonoLabel>
                </span>
              ))}
            </div>

            <div className="mt-9">
              <LetsTalkButton />
            </div>
          </Rise>
        </div>
      </Section>
    </div>
  );
}
