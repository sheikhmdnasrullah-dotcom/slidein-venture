'use client';

/**
 * S8 · CLOSING — archetype K: the loop visual + the final CTA panel
 * ---------------------------------------------------------------------------
 * Above the panel, the story's final visual: the loop. The loop-check
 * handoff from converse feeds a small activity ledger (stacked rows, each
 * with its before/after dots), which flows into the overview tile (an
 * anonymous bar-and-line mini), followed by the dashed return arc pointing
 * back up toward the spine. Static, straight, quiet: disorder 0.
 *
 * Below it the CTA panel stays as designed: radius-40 white, hairline,
 * edge-fading dot grid, pointer spotlight, three corner tiles (ledger,
 * chart, loop — straight, exempt marks only), title/lead slots, the pill.
 */

import { useEffect, useRef } from 'react';
import { HOME_CONTENT } from '@/content/home';
import { BAND_DISORDER } from '@/content/stages';
import { HandoffArtifact } from '@/components/StorySpine/artifacts';
import { ChartMark, LedgerMark } from '@/components/StorySpine/icons';
import {
  Band,
  GlossTile,
  Reveal,
  SectionHeader,
  WordTag,
} from '@/components/Sections/primitives';
import { TextSlot } from '@/components/Hero/Skeleton';

/* The pointer-follow spotlight: updates --mx / --my on the panel.
   Desktop fine pointers only; touch and reduced motion keep the rest
   state (the mask simply stays where it started). */
function useSpotlight<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - r.left}px`);
      el.style.setProperty('--my', `${e.clientY - r.top}px`);
    };
    el.addEventListener('pointermove', onMove, { passive: true });
    return () => el.removeEventListener('pointermove', onMove);
  }, []);
  return ref;
}

/* The activity ledger: three rows, each with before/after dots. */
function LedgerCard() {
  return (
    <div
      className="w-[172px] rounded-[16px] border border-[var(--scaffold-hairline)] bg-white p-4"
      style={{ boxShadow: 'var(--scaffold-shadow-soft)' }}
    >
      <div className="flex flex-col gap-3">
        {[92, 68, 80].map((w, i) => (
          <div key={i} className="flex items-center gap-2">
            <span
              className="block h-[6px] w-[6px] shrink-0 rounded-full"
              style={{ background: 'rgba(10,10,10,0.45)' }}
            />
            <span
              className="block h-[6px] w-[6px] shrink-0 rounded-full border"
              style={{ borderColor: 'rgba(10,10,10,0.25)' }}
            />
            <span
              className="block h-[7px] rounded-full"
              style={{ width: `${w}%`, background: 'var(--scaffold-skeleton)' }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/* The overview tile: anonymous bars with a trend line. No axes, no numbers. */
function OverviewTile() {
  return (
    <div
      className="w-[148px] rounded-[16px] border border-[var(--scaffold-hairline)] bg-white p-4"
      style={{ boxShadow: 'var(--scaffold-shadow-soft)' }}
    >
      <svg width="116" height="64" viewBox="0 0 116 64" aria-hidden="true">
        <rect x="8" y="34" width="12" height="22" rx="3" fill="rgba(10,10,10,0.10)" />
        <rect x="28" y="24" width="12" height="32" rx="3" fill="rgba(10,10,10,0.10)" />
        <rect x="48" y="30" width="12" height="26" rx="3" fill="rgba(10,10,10,0.10)" />
        <rect x="68" y="18" width="12" height="38" rx="3" fill="rgba(10,10,10,0.10)" />
        <path
          d="M6 44 L30 30 L54 35 L82 20 L110 26"
          fill="none"
          stroke="rgba(10,10,10,0.45)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="110" cy="26" r="2.5" fill="rgba(10,10,10,0.45)" />
      </svg>
    </div>
  );
}

/* Flow arrow between ledger and overview. */
function FlowArrow() {
  return (
    <svg width="30" height="12" viewBox="0 0 30 12" aria-hidden="true">
      <path
        d="M2 6 H25 M20 1.5 L25.5 6 L20 10.5"
        fill="none"
        stroke="rgba(10,10,10,0.30)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* The return arc: dashed, sweeping down then up-left toward the spine. */
function ReturnArc() {
  return (
    <svg width="56" height="72" viewBox="0 0 56 72" aria-hidden="true">
      <path
        d="M48 6 C48 44 40 62 8 62 M14 56 L7 62 L13 68"
        fill="none"
        stroke="rgba(10,10,10,0.30)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="3 4"
      />
    </svg>
  );
}

/* The loop-back tile glyph: a dashed arc rising up-left. Ink only. */
function LoopGlyph() {
  return (
    <svg width="46%" height="46%" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path
        d="M40 10 C40 34 32 40 12 40 M18 34 L11 40 L17 46"
        stroke="rgba(10,10,10,0.75)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="4 5"
      />
    </svg>
  );
}

/* THE LOOP: handoff in, ledger, overview, return. Static. */
function LoopVisual() {
  return (
    <div className="section-visual flex flex-col items-center gap-8 md:flex-row md:justify-center md:gap-6">
      <div className="flex items-center gap-6 md:gap-6">
        <span data-handoff-input="loop-check" className="block">
          <HandoffArtifact kind="loop-check" />
        </span>
        <span className="block h-px w-6" style={{ background: 'rgba(10,10,10,0.18)' }} />
        <div data-story-node="activity" className="flex flex-col items-center gap-3">
          <LedgerCard />
          <WordTag w="activity" />
        </div>
      </div>
      <div className="flex items-center gap-6">
        <span className="rotate-90 md:rotate-0">
          <FlowArrow />
        </span>
        <div data-story-node="overview" className="flex flex-col items-center gap-3 md:mt-16">
          <OverviewTile />
          <WordTag w="overview" />
        </div>
      </div>
      <div className="md:pb-8">
        <ReturnArc />
      </div>
    </div>
  );
}

export default function ClosingSection() {
  const section = HOME_CONTENT.sections[7];
  const panelRef = useSpotlight<HTMLDivElement>();

  return (
    <Band tone="soft" id={section.id} disorder={BAND_DISORDER.closing}>
      <Reveal y={16} className="mb-14 md:mb-20">
        <LoopVisual />
      </Reveal>
      <Reveal y={16}>
        <div
          ref={panelRef}
          className="spotlight relative mx-auto overflow-hidden rounded-[40px] border border-[var(--scaffold-hairline)] bg-[var(--scaffold-surface)] px-6 py-20 md:py-28"
          style={{ boxShadow: 'var(--scaffold-shadow-object)' }}
        >
          {/* the dot grid, masked to fade toward the edges */}
          <div className="dot-grid absolute inset-0" aria-hidden="true" />

          {/* corner tiles, partly clipped by the panel edge. Straight: disorder 0. */}
          <div className="absolute -left-8 -top-8" aria-hidden="true">
            <GlossTile size={120} icon={<LedgerMark />} shadow={false} />
          </div>
          <div className="absolute -right-10 -top-6" aria-hidden="true">
            <GlossTile size={104} icon={<ChartMark />} shadow={false} />
          </div>
          <div className="absolute -bottom-10 -right-8" aria-hidden="true">
            <GlossTile size={128} icon={<LoopGlyph />} shadow={false} />
          </div>

          {/* centre: title, lead, the pill */}
          <div className="relative flex flex-col items-center gap-5 px-4 text-center">
            <SectionHeader section={section} align="center" />
            <a
              href={section.cta?.href ?? '/contact'}
              data-testid="closing-cta"
              className="group mt-14 inline-flex h-[56px] items-center justify-center gap-3 rounded-full bg-[var(--scaffold-button)] px-10 text-[17px] font-medium text-white transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-px hover:shadow-[0_16px_32px_-12px_rgba(0,0,0,0.42)] active:scale-[0.98]"
              style={{
                boxShadow: 'var(--scaffold-shadow-button)',
                letterSpacing: '-0.01em',
              }}
            >
              <span
                className="h-2.5 w-2.5 rounded-full bg-[var(--scaffold-accent)]"
                aria-hidden="true"
              />
              <TextSlot
                text={section.cta?.label ?? ''}
                barWidth="5em"
                onDark
                textClassName="whitespace-nowrap"
              />
            </a>
          </div>
        </div>
      </Reveal>
    </Band>
  );
}
