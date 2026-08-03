'use client';

/**
 * THE FIVE CHAPTERS, AT THE END OF /steps
 * ---------------------------------------------------------------------------
 * Moved here from /solutions, where the site's Steps navigation used to land.
 * See content/steps/deck-chapters.ts for why they belong last rather than
 * first.
 *
 * The visuals are the original slide components, untouched: same files, same
 * fixed geometry, rendered through the shared ChapterRun so this run behaves
 * exactly like the homepage's — heading, lead, frameless canvas, thread down to
 * the next one, index rail pinned to the left.
 *
 * ChapterRun mounts its own fixed index rail at the xl breakpoint. That is the
 * only reason this is a separate component rather than markup inside the page:
 * the rail belongs to the run, and a run that is one of several sections should
 * own its own chrome.
 */

import { useEffect, useRef, useState } from 'react';
import ChapterRun, { type ChapterDef } from '@/components/PitchDeck/ChapterRun';
import ScrollReveal, { Rise } from '@/components/PitchDeck/ScrollReveal';
import TheWeekSlide from '@/components/PitchDeck/TheWeekSlide';
import PipelineSlide from '@/components/PitchDeck/PipelineSlide';
import GrowthLoopSlide from '@/components/PitchDeck/GrowthLoopSlide';
import CompoundSlide from '@/components/PitchDeck/CompoundSlide';
import AlternativeSlide from '@/components/PitchDeck/AlternativeSlide';
import { DECK_CHAPTERS, DECK_INTRO } from '@/content/steps';
import { cn } from '@/lib/utils';

const CHAPTERS = DECK_CHAPTERS as ChapterDef[];

export default function DeckChapters({ className }: { className?: string }) {
  /**
   * ChapterRun mounts a FIXED index rail. On the homepage that is correct: the
   * run is the page. Here it is the last section of seven, and a fixed rail
   * renders from the first pixel of the document — five chapter ticks sitting
   * in the left gutter of the hero, the timeline and every step list above,
   * pointing at content the reader has not reached.
   *
   * So the rail is faded out whenever this section is not on screen. Hidden by
   * opacity rather than unmounted, because ChapterRun's chapters each hold
   * their own mount gate and tearing the run down would replay every entrance
   * the next time the reader scrolls back into it.
   */
  const wrap = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      /* No margin: the rail should appear as the section does, not before. */
      { threshold: 0 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={wrap}
      className={cn(
        className,
        '[&_nav]:transition-opacity [&_nav]:duration-500',
        !inView && '[&_nav]:pointer-events-none [&_nav]:opacity-0',
      )}
    >
      <div className="mx-auto mb-[clamp(4rem,8vw,9rem)] max-w-[1400px] px-6 md:px-10">
        <Rise>
          <span className="font-label mb-6 block text-[var(--accent)]">
            {DECK_INTRO.eyebrow}
          </span>
        </Rise>
        <ScrollReveal
          as="h2"
          className="font-display-xl max-w-[20ch] text-[clamp(2rem,5vw,4rem)] text-[var(--on-surface)]"
        >
          {DECK_INTRO.headline}
        </ScrollReveal>
        <Rise delay={0.1}>
          <p className="font-body mt-8 max-w-[52ch] text-[var(--muted)]">
            {DECK_INTRO.lead}
          </p>
        </Rise>
      </div>

      <ChapterRun
        chapters={CHAPTERS}
        visuals={[
          <TheWeekSlide key="week" />,
          <PipelineSlide key="pipeline" />,
          <GrowthLoopSlide key="loop" />,
          <CompoundSlide key="compound" />,
          <AlternativeSlide key="alternative" />,
        ]}
        eyebrow="Steps"
      />
    </div>
  );
}
