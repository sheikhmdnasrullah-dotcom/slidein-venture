'use client';

/**
 * THE FRAMEWORK — a scroll narrative
 * ---------------------------------------------------------------------------
 * This was a ten-slide carousel: one 660px stage, arrows, a progress bar, a
 * fullscreen button and nine of the ten visuals hidden at any moment. It is now
 * four chapters laid down the page, read by scrolling.
 *
 * Every slide component is untouched. Each one still renders into a box with
 * exactly the geometry the old stage gave it (see CANVAS_MIN and the absolutely
 * positioned inner frame in Chapter) — that is deliberate, and it is what keeps
 * the diagrams pixel-identical instead of reflowing into a shape nobody
 * designed them for.
 *
 * WHAT CHANGED, AND WHY
 *
 *  · Slides became chapters. A chapter has a heading, so the argument is
 *    legible from the page outline rather than from a kicker that changed as
 *    you clicked. The headings were already written — they were the carousel's
 *    `kicker` strings doing the job at 11px.
 *  · Five chapters left. See the note under CHAPTERS: the back half of the deck
 *    moved to /solutions, because it answers a different question than the
 *    homepage is asking.
 *  · The frame went. See the note on the canvas in Chapter — the rounded card
 *    around each diagram was deck furniture, and down a page it read as a
 *    screenshot pasted into a document.
 *  · Deferred mount. A chapter renders its visual only once it has come near
 *    the viewport. Every slide carries its own entrance animation keyed to
 *    mount; render them all at page load and they all play to an empty room,
 *    and the reader arrives at four finished diagrams. Height is reserved up
 *    front, so nothing shifts.
 *  · The thread. In the carousel a dot flew in from the left on every slide
 *    change. Down a page the same idea is literal: a dashed rule runs between
 *    chapters and a dot sits on each join. It is the same thread the hero
 *    releases, and it is what makes separate diagrams read as one system.
 *  · The index rail. The progress segments became a fixed rail on the left at
 *    xl and up: one tick per chapter, the current one lit, each a jump link.
 *    Below xl it is not rendered at all rather than being squeezed — the
 *    headings already do the wayfinding on a narrow screen.
 */

import { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useReducedMotion } from 'framer-motion';
import { ArrowRight02Icon as ArrowIcon } from 'hugeicons-react';
import { Section } from '@/components/Section';
import ServiceDetailModal from '@/components/ServiceDetailModal/ServiceDetailModal';
import ScrollReveal, { Rise } from '@/components/PitchDeck/ScrollReveal';
import ChapterRun, { type ChapterDef } from '@/components/PitchDeck/ChapterRun';
import FrameworkFlowSlide from '@/components/PitchDeck/FrameworkFlowSlide';
import OrbitSlide from '@/components/PitchDeck/OrbitSlide';
import OutreachOSSlide from '@/components/PitchDeck/OutreachOSSlide';
import InputSlide from '@/components/PitchDeck/InputSlide';

const CHAPTERS: ChapterDef[] = [
  {
    id: 'input',
    number: '01',
    kicker: 'The Input',
    lead: 'Everything downstream starts with one recording. That is the whole ask.',
  },
  {
    /* NOT `framework` — that id belongs to the band, and the hero's primary CTA
       plus its scroll cue both point at it. */
    id: 'complete-framework',
    number: '02',
    kicker: 'The Complete Framework',
    lead: 'Two systems, one loop. Content earns attention, outreach converts it.',
  },
  {
    id: 'content',
    number: '03',
    kicker: 'The Content System',
    lead: 'One asset in, routed out to every surface it belongs on.',
  },
  {
    id: 'outreach',
    number: '04',
    kicker: 'The Outreach System',
    lead: 'Research, write, send, sort. The pipeline runs whether or not you do.',
  },
];

/* WHERE THE OTHER FIVE WENT
   The Week, The System Running, Why It's One System, The Compound and The
   Alternative now live on /solutions — the "Steps" page. The homepage answers
   "what is this", and four chapters do that: what you give us, how the two
   halves fit, and one chapter per half. The other five answer "what does a week
   look like, what does it cost, and what happens over a year", which is a
   second conversation and was making the front page a 12,000px commitment.

   They are RENUMBERED, not renumbered-and-cross-referenced: this page runs
   01–04 and /solutions runs its own 01–05. A page that shows 01, 02, 04, 05
   reads as a bug, and no external link depends on the old numbering. */

/* ── The close ─────────────────────────────────────────────────────────────
   Was slide 10 and a "start again" button that rewound the carousel. The page
   has no state to rewind, so the loop art now simply draws itself and the
   secondary action goes where the reader actually wants to go: back to the top
   of the argument. Ink band — the only one on the page, and the reason the
   ending lands. */
function Close() {
  const still = !!useReducedMotion();
  return (
    <Section tone="stage" pad="tall" seam className="text-center">
      <div className="mx-auto flex max-w-[1400px] flex-col items-center gap-6 px-6 md:px-10">
        <Rise>
          <svg viewBox="0 0 400 300" className="h-auto w-24 md:w-32" fill="none" aria-hidden>
            <defs>
              <filter id="closeGlow">
                <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="var(--accent-vivid)" floodOpacity="0.6" />
              </filter>
            </defs>
            <path
              d="M 200 80 C 280 80, 280 220, 200 220 C 120 220, 120 80, 200 80"
              fill="none"
              stroke="var(--on-surface)"
              strokeOpacity="0.34"
              strokeWidth="1.2"
            />
            {!still && (
              <circle r={3.5} fill="var(--accent-vivid)" filter="url(#closeGlow)">
                <animateMotion
                  path="M 200 80 C 280 80, 280 220, 200 220 C 120 220, 120 80, 200 80"
                  dur="5s"
                  repeatCount="indefinite"
                />
              </circle>
            )}
          </svg>
        </Rise>

        <ScrollReveal
          as="h2"
          className="font-display-xl max-w-[16ch] text-[clamp(2.1rem,5.4vw,4.25rem)] text-[var(--on-surface)]"
        >
          Record once. Let momentum do the rest.
        </ScrollReveal>

        <Rise delay={0.1}>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
            <Link href="/pricing">
              <button
                type="button"
                className="btn-premium inline-flex cursor-pointer items-center gap-2 rounded-full px-7 py-4 text-[15px] font-bold"
                style={{ background: 'var(--accent-vivid)', color: 'var(--on-accent)' }}
              >
                Talk to us
                <ArrowIcon size={16} />
              </button>
            </Link>
            <a
              href="#input"
              className="inline-flex items-center gap-1.5 px-4 py-4 text-[15px] font-bold text-[var(--muted)] transition-colors duration-300 hover:text-[var(--on-surface)]"
            >
              Read it again
            </a>
          </div>
        </Rise>
      </div>
    </Section>
  );
}

/* ── The deck ──────────────────────────────────────────────────────────── */
export default function PitchDeck() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalServiceId, setModalServiceId] = useState<string | undefined>(undefined);

  const openService = useCallback((id: string) => {
    setModalServiceId(id);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setTimeout(() => setModalServiceId(undefined), 300);
  }, []);

  /* Order matches CHAPTERS exactly. Kept as one array rather than a `render`
     field on each chapter so the visuals and their copy stay separable — the
     copy is edited far more often than the diagrams are. */
  /* Order matches CHAPTERS exactly. Kept as one array rather than a `render`
     field on each chapter so the visuals and their copy stay separable — the
     copy is edited far more often than the diagrams are. */
  const visuals = useMemo(
    () => [
      <InputSlide key="input" />,
      <FrameworkFlowSlide key="framework" />,
      <OrbitSlide key="orbit" onOpenService={openService} />,
      <OutreachOSSlide key="outreach" />,
    ],
    [openService]
  );

  return (
    <>
      <Section id="framework" tone="base" pad="base" seam>
        {/* ── The opening statement ───────────────────────────────────────
            The one thing the carousel could never do: state the argument in
            full before showing a single diagram. It inks in as you scroll. */}
        <div className="mx-auto mb-[clamp(4rem,8vw,9rem)] max-w-[1400px] px-6 md:px-10">
          <Rise>
            <span className="font-label mb-6 block text-[var(--accent)]">The Framework</span>
          </Rise>
          <ScrollReveal
            as="h2"
            className="font-display-xl max-w-[20ch] text-[clamp(2rem,5vw,4rem)] text-[var(--on-surface)]"
          >
            You record once a week. Everything after that is ours.
          </ScrollReveal>
          <Rise delay={0.1}>
            <p className="font-body mt-8 max-w-[52ch] text-[var(--muted)]">
              Nine chapters, in order. Content and outreach as one loop, the week
              it produces, the pipeline it fills, and what the same result costs
              if you build it out of hires instead.
            </p>
          </Rise>
        </div>

        <ChapterRun chapters={CHAPTERS} visuals={visuals} eyebrow="Framework" />
      </Section>

      <Close />

      <ServiceDetailModal open={modalOpen} onClose={closeModal} serviceId={modalServiceId} onChange={setModalServiceId} />
    </>
  );
}
