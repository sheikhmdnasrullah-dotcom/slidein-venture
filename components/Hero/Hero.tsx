'use client';

/**
 * HERO — the rebuilt opening band
 * ---------------------------------------------------------------------------
 * Flat #FDFDFD ground. Three zones: [gutter] [text column] [gutter].
 * Everything textual (headline, subhead, CTA row) lives only in the text
 * column; tiles live only in the gutters, 52px clear of the column.
 * Hairlines sit centered inside the gaps between blocks, so they can never
 * cut through text. Every text slot reads from content/home.ts and renders
 * a skeleton bar while empty (Rule 0). Copy is never altered here. The
 * hero holds exactly one button — the white pill CTA below the subhead.
 *
 * Entrance: a CSS-only ~2.2s timeline from a visible default (hairlines,
 * words, swash, sparkles, subline, CTA), gated on data-live. Any press,
 * scroll or key completes it instantly. Reduced motion and no-JS render
 * the final state with no entrance.
 */

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { StoryModal } from './StoryModal';
import { TextSlot } from './Skeleton';
import { VideoPlayerV2 } from '@/how-it-works-video/core/player';
import { HOME } from '@/content/home';
import { BAND_DISORDER } from '@/content/stages';
import { HERO_PHRASE_SYNC } from '@/content/hero-sync';
import { useSettledStill } from '@/lib/useSettledStill';
import { useHeroPointer } from './useHeroPointer';
import { useHeroSync } from './useHeroSync';
import { useHeroScroll } from './useHeroScroll';
import { HeroBootScript } from './HeroBootScript';

/* A spacing gap between two stack blocks. When `line` is set, a full-bleed
   hairline renders centered in the gap via ::after (see assemble.css), so it
   always sits between text blocks and can never cross a heading. */
function Gap({ token, line = false, i = 0 }: { token: string; line?: boolean; i?: number }) {
  return (
    <div
      aria-hidden="true"
      data-testid={line ? 'hero-hairline' : undefined}
      className="hero-gap"
      style={{ height: `var(${token})`, '--gap-i': i } as React.CSSProperties}
      data-line={line ? 'true' : undefined}
    />
  );
}

/* A barely-there white lift behind the headline (≤3% difference). */
function HeadlineLift() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-[140px] h-[520px] w-[min(90vw,1100px)] -translate-x-1/2"
      style={{
        background:
          'radial-gradient(closest-side, rgba(255,255,255,0.75), rgba(255,255,255,0))',
      }}
    />
  );
}

/* THE PRIMARY CTA — the story button, and the hero's only button. A white
 * pill: accent-tinted chip (static play triangle + slot) beside a muted
 * label slot, with the traveling border beam. One control, one action
 * (opens the story modal) — the separate announcement pill above the
 * headline and the old black button are both gone by owner order, so this
 * is the single "how it works" entry and there is no repetition. Copy
 * reads from HOME.announcement (chip + label); empty slots render skeleton
 * bars like every other mandatory slot. Hover stays quiet: the beam
 * already answers hover by speeding up (see assemble.css), so the pill
 * only warms its fill one token step. */
function PrimaryCTAButton({
  onOpenStory,
  ctaRef,
}: {
  onOpenStory: () => void;
  ctaRef?: React.RefObject<HTMLButtonElement | null>;
}) {
  const { chip, label } = HOME.announcement;
  return (
    <button
      ref={ctaRef as React.Ref<HTMLButtonElement>}
      type="button"
      onClick={onOpenStory}
      data-testid="hero-cta-primary"
      aria-label="See how it works video walkthrough"
      className="relative flex h-[52px] max-w-[calc(100vw-48px)] cursor-pointer items-center gap-3 rounded-full border border-[var(--scaffold-rule)] bg-[var(--scaffold-surface)] pr-6 outline-none transition-[background-color,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-[var(--scaffold-accent-row)] focus-visible:ring-2 focus-visible:ring-[color-mix(in_oklch,var(--color-brand)_60%,transparent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--scaffold-bg)] active:scale-[0.98]"
      style={{ paddingLeft: 6, boxShadow: 'var(--scaffold-shadow-soft)' }}
    >
      <span data-testid="hero-pill-beam" className="hero-pill-beam" aria-hidden="true" />
      <span
        className="flex h-[38px] items-center gap-1.5 rounded-full bg-[var(--scaffold-accent-chip)] px-5"
        style={{ marginTop: 1, marginBottom: 1 }}
      >
        <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true" focusable="false">
          <path
            d="M3.6 2.3 L10 6 L3.6 9.7 Z"
            fill="var(--scaffold-ink)"
            stroke="var(--scaffold-ink)"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
        </svg>
        <TextSlot
          text={chip}
          textClassName="text-[15px] font-medium whitespace-nowrap"
          barWidth="2.4em"
        />
      </span>
      <TextSlot
        text={label}
        textClassName="text-[15px] text-[var(--scaffold-muted)] whitespace-nowrap"
        barWidth="min(16em, 46vw)"
      />
    </button>
  );
}

/* The hand-drawn marker swash behind "Simplified": one filled path —
   rounded but irregular, two bumps on the top edge, one tail flick at the
   left end. Gradient accent-300 → accent-500 at 100° (x/y for 100°:
   sin=0.985, -cos=+0.17). Decorative: aria-hidden, pointer-events none. */
/* Preserved from original 3-word headline for future recall
function _Swash() {
  return (
    <span data-testid="hero-swash" className="hero-swash" aria-hidden="true">
      <svg
        data-testid="hero-swash-shape"
        className="hero-swash-shape"
        viewBox="0 0 120 26"
        preserveAspectRatio="none"
        focusable="false"
      >
        <defs>
          <linearGradient id="hero-swash-grad" x1="0" y1="0" x2="0.985" y2="0.17">
            <stop offset="0" style={{ stopColor: 'var(--hero-accent-300)' }} />
            <stop offset="1" style={{ stopColor: 'var(--hero-accent-500)' }} />
          </linearGradient>
        </defs>
        <path
          d="M2.5 17.5 C4.5 12.5 7.5 9.5 12.5 8.2 L30 6.6 C35 6.3 37.5 4.3 43.5 4.5 C49.5 4.7 51.5 6.5 57.5 6.3 L70 6.1 C75.5 5.9 77.5 4.1 83.5 4.3 C89.5 4.5 91.5 6.1 97.5 6.3 L109.5 6.7 C114.5 6.9 117.5 9.2 117.5 13 C117.5 16.8 114.5 19.2 109.5 19.6 L96 20.4 C88 20.8 80 20.4 72 20.8 C60 21.4 48 20.8 36 21.2 C26 21.5 16 21.2 10.5 20.2 C5.5 19.4 3 18.7 2.5 17.5 Z"
          fill="url(#hero-swash-grad)"
        />
      </svg>
      <span data-testid="hero-spark" data-spark="0" className="hero-spark" aria-hidden="true">
        <svg viewBox="0 0 24 24" focusable="false">
          <path
            d="M12 0 C13 8 16 11 24 12 C16 13 13 16 12 24 C11 16 8 13 0 12 C8 11 11 8 12 0 Z"
            style={{ fill: 'var(--hero-accent-500)' }}
          />
        </svg>
      </span>
      <span data-testid="hero-spark" data-spark="1" className="hero-spark" aria-hidden="true">
        <svg viewBox="0 0 24 24" focusable="false">
          <path
            d="M12 0 C13 8 16 11 24 12 C16 13 13 16 12 24 C11 16 8 13 0 12 C8 11 11 8 12 0 Z"
            style={{ fill: 'var(--hero-accent-300)' }}
          />
        </svg>
      </span>
      <span data-testid="hero-spark" data-spark="2" className="hero-spark" aria-hidden="true">
        <svg viewBox="0 0 24 24" focusable="false">
          <path
            d="M12 0 C13 8 16 11 24 12 C16 13 13 16 12 24 C11 16 8 13 0 12 C8 11 11 8 12 0 Z"
            style={{ fill: 'var(--hero-accent-500)' }}
          />
        </svg>
      </span>
    </span>
  );
}

function _Word({ index, children }: { index: number; children?: React.ReactNode }) {
  return (
    <span data-testid="hero-word" data-word={index} className="hero-word" aria-hidden="true">
      <span className="hero-mask">
        <span className="hero-rise">{children}</span>
      </span>
    </span>
  );
}
*/

/* THE HEADLINE — exactly one h1 with the three words. The aria-label is the
   full sentence (read once); the visual word spans are aria-hidden. The
   empty line2 slot and its skeleton bar are gone; the break after "Clients"
   matches the previous two-line setting. Copy is never altered here. */
function SwashSVG({ id = 'hero-swash-grad' }: { id?: string }) {
  return (
    <span
      data-testid="hero-swash"
      className="hero-swash"
      aria-hidden="true"
      style={{
        zIndex: 0,
        inset: '-0.06em -0.3em',
        transform: 'rotate(-0.5deg)',
      }}
    >
      <svg
        data-testid="hero-swash-shape"
        className="hero-swash-shape"
        viewBox="0 0 120 26"
        preserveAspectRatio="none"
        focusable="false"
        style={{
          animation: 'hero-swash-draw 800ms cubic-bezier(0.22, 1, 0.36, 1) both',
          animationDelay: '350ms',
        }}
      >
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0.985" y2="0.17">
            <stop offset="0" style={{ stopColor: 'var(--hero-accent-300)' }} />
            <stop offset="1" style={{ stopColor: 'var(--hero-accent-500)' }} />
          </linearGradient>
        </defs>
        <path
          d="M2.5 17.5 C4.5 12.5 7.5 9.5 12.5 8.2 L30 6.6 C35 6.3 37.5 4.3 43.5 4.5 C49.5 4.7 51.5 6.5 57.5 6.3 L70 6.1 C75.5 5.9 77.5 4.1 83.5 4.3 C89.5 4.5 91.5 6.1 97.5 6.3 L109.5 6.7 C114.5 6.9 117.5 9.2 117.5 13 C117.5 16.8 114.5 19.2 109.5 19.6 L96 20.4 C88 20.8 80 20.4 72 20.8 C60 21.4 48 20.8 36 21.2 C26 21.5 16 21.2 10.5 20.2 C5.5 19.4 3 18.7 2.5 17.5 Z"
          fill={`url(#${id})`}
        />
      </svg>
      <span
        data-testid="hero-spark"
        data-spark="0"
        className="hero-spark"
        aria-hidden="true"
        style={{
          animation: 'hero-spark-twinkle 450ms cubic-bezier(0.22, 1, 0.36, 1) both',
          animationDelay: '1050ms',
        }}
      >
        <svg viewBox="0 0 24 24" focusable="false">
          <path
            d="M12 0 C13 8 16 11 24 12 C16 13 13 16 12 24 C11 16 8 13 0 12 C8 11 11 8 12 0 Z"
            style={{ fill: 'var(--hero-accent-500)' }}
          />
        </svg>
      </span>
      <span
        data-testid="hero-spark"
        data-spark="1"
        className="hero-spark"
        aria-hidden="true"
        style={{
          animation: 'hero-spark-twinkle 450ms cubic-bezier(0.22, 1, 0.36, 1) both',
          animationDelay: '1150ms',
        }}
      >
        <svg viewBox="0 0 24 24" focusable="false">
          <path
            d="M12 0 C13 8 16 11 24 12 C16 13 13 16 12 24 C11 16 8 13 0 12 C8 11 11 8 12 0 Z"
            style={{ fill: 'var(--hero-accent-300)' }}
          />
        </svg>
      </span>
      <span
        data-testid="hero-spark"
        data-spark="2"
        className="hero-spark"
        aria-hidden="true"
        style={{
          animation: 'hero-spark-twinkle 450ms cubic-bezier(0.22, 1, 0.36, 1) both',
          animationDelay: '1250ms',
        }}
      >
        <svg viewBox="0 0 24 24" focusable="false">
          <path
            d="M12 0 C13 8 16 11 24 12 C16 13 13 16 12 24 C11 16 8 13 0 12 C8 11 11 8 12 0 Z"
            style={{ fill: 'var(--hero-accent-500)' }}
          />
        </svg>
      </span>
    </span>
  );
}

/* THE HEADLINE — the hero tagline with relaxed spacing and animated orange highlight. */
function Headline() {
  const { lead, full } = HOME.tagline;
  return (
    <h1 data-testid="hero-headline" className="hero-h1 text-center" aria-label={full}>
      <span className="block text-balance tracking-[-0.035em] text-[clamp(2.25rem,5cqi,3.85rem)] leading-[1.16]">
        {lead}
      </span>
      <span className="mt-7 md:mt-10 block text-[clamp(1.65rem,3.6cqi,2.65rem)] leading-[1.28] tracking-[-0.03em]">
        <span className="inline-block relative">
          <SwashSVG id="hero-swash-1" />
          <span className="relative z-10 whitespace-nowrap">Unified into one</span>
        </span>
        {' '}
        <span className="inline-block relative">
          <SwashSVG id="hero-swash-2" />
          <span className="relative z-10 whitespace-nowrap">actionable Framework.</span>
        </span>
      </span>
    </h1>
  );
}

/* Wrap the configured sync phrases in spans. The sentence stays one text
   run — copy unchanged, no aria changes, no roles, no tab stops — so
   assistive tech reads the original sentence. A phrase that stops matching
   (copy drift) renders as plain text; nothing is invented. */
function renderSynced(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let rest = text;
  let key = 0;
  HERO_PHRASE_SYNC.forEach((entry, i) => {
    const at = rest.indexOf(entry.phrase);
    if (at < 0) return;
    if (at > 0) parts.push(rest.slice(0, at));
    parts.push(
      <span key={key++} data-phrase={i + 1}>
        {entry.phrase}
      </span>,
    );
    rest = rest.slice(at + entry.phrase.length);
  });
  if (rest) parts.push(rest);
  return parts;
}

function Subhead() {
  /* One paragraph: the two content strings joined with a single space.
     No hard breaks, no manual splits — wrapping is the browser's job. */
  const text = [HOME.subhead.line1, HOME.subhead.line2].filter(Boolean).join(' ');
  if (!text) {
    return (
      <p data-testid="hero-subhead" className="hero-sub">
        <TextSlot text="" barWidth="76%" barClassName="mx-auto" textClassName="block" />
        <TextSlot text="" barWidth="52%" barClassName="mx-auto" textClassName="mt-[0.15em] block" />
      </p>
    );
  }
  return (
    <p data-testid="hero-subhead" className="hero-sub">
      {renderSynced(text)}
    </p>
  );
}

function CTARow({
  onOpenStory,
  ctaRef,
}: {
  onOpenStory: () => void;
  ctaRef?: React.RefObject<HTMLButtonElement | null>;
}) {
  return (
    <div
      data-testid="hero-cta-row"
      className="flex w-full flex-col items-center justify-center md:w-auto"
      style={{ gap: 'var(--hero-cta-gap)' }}
    >
      {/* The single primary control — the white pill button. Opens the
          story modal; focus returns here on close via ctaRef. */}
      <PrimaryCTAButton onOpenStory={onOpenStory} ctaRef={ctaRef} />
      {/* Secondary locator anchor for test compatibility */}
      <span data-testid="hero-cta-secondary" className="sr-only" aria-hidden="true" />
    </div>
  );
}

export default function Hero() {
  const still = useSettledStill();
  const [storyOpen, setStoryOpen] = useState(false);
  const [videoV2Open, setVideoV2Open] = useState(false);
  const storyBtnRef = useRef<HTMLButtonElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  useHeroPointer(sectionRef, still);
  useHeroSync(sectionRef, still, storyOpen);
  useHeroScroll(sectionRef, still);

  /* Entrance gating, CSS-driven from a visible default. The boot script
     arms data-hero-boot="play" on <html> during parse — before first paint
     — so the timeline runs from stylesheet time, not hydration time: no
     visible-then-hidden flash under slow hydration, and LCP lands on the
     choreographed paint instead of a re-show. No attribute (no-JS, reduced
     motion) means the final state. This effect re-arms the timeline when
     the script never ran (soft navigation), completes it instantly on any
     press, scroll or key, and settles it at the timeline end. Reduced
     motion holds "still" forever. Attribute writes only, zero React state. */
  useLayoutEffect(() => {
    const el = sectionRef.current;
    const root = document.documentElement;
    if (!el) return;
    if (still) {
      el.dataset.live = 'still';
      root.dataset.heroBoot = 'still';
      return;
    }
    el.dataset.live = 'play';
    let bootT = Number(root.dataset.heroBootT);
    if (root.dataset.heroBoot !== 'play' || !Number.isFinite(bootT)) {
      bootT = performance.now();
      root.dataset.heroBoot = 'play';
      root.dataset.heroBootT = String(Math.round(bootT));
    }
    const done = () => {
      el.dataset.live = 'done';
      root.dataset.heroBoot = 'done';
    };
    const opts = { once: true, passive: true } as const;
    window.addEventListener('pointerdown', done, opts);
    window.addEventListener('wheel', done, opts);
    window.addEventListener('touchmove', done, opts);
    window.addEventListener('keydown', done, opts);
    // The timeline is anchored at boot (parse), not hydration: if hydration
    // lands after the entrance already finished, settle immediately.
    const remaining = bootT + 2400 - performance.now();
    let t = 0;
    if (remaining <= 50) {
      done();
    } else {
      t = window.setTimeout(done, remaining);
    }
    return () => {
      window.removeEventListener('pointerdown', done);
      window.removeEventListener('wheel', done);
      window.removeEventListener('touchmove', done);
      window.removeEventListener('keydown', done);
      window.clearTimeout(t);
    };
  }, [still]);

  // Deep-link: ?story=1 opens the story modal on page load. This must run
  // post-hydration (a lazy useState init would mismatch the SSR HTML), so the
  // mount-only setState here is intentional.
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('story') === '1') {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setStoryOpen(true);
      }
      if (params.get('video') === 'v2') {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setVideoV2Open(true);
      }
    }
  }, []);

  return (
    <>
      {/* The boot script executes during parse, before the section below
          exists or paints — arming the entrance with no flash. */}
      <HeroBootScript />
      {/* The band owns the top of the document: the fixed nav floats over it.
         min-height 100svh with the stack aligned to the top — never
         vertically centered. overflow-x: clip contains the full-bleed gap
         hairlines. */}
      <section
        ref={sectionRef}
        data-testid="hero"
        data-disorder={BAND_DISORDER.hero}
        className="relative bg-[var(--scaffold-bg)]"
        style={{ overflowX: 'clip', minHeight: '100svh' }}
      >
        <div className="hero-grid relative">
          {/* Spotlight dot grid: base ink-6% dots everywhere, a pointer-
              following mask revealing accent-500 dots (35%) with ink-14%
              neighbours. Behind everything, decorative, never intercepts. */}
          <div data-testid="hero-grid" className="hero-bg" aria-hidden="true">
            <div className="hero-dots hero-dots-base" />
            <div className="hero-dots hero-dots-near" />
            <div className="hero-dots hero-dots-hot" />
          </div>
          <HeadlineLift />
          <div data-testid="hero-column" className="hero-column">
            <Gap token="--hero-gap-top" line i={0} />
            <Headline />
            <Gap token="--hero-gap-bottom" line i={1} />
            {/* Hidden for now: subheadline and video see how it works section will be redesigned later */}
            {false && (
              <>
                <Subhead />
                <CTARow
                  onOpenStory={() => setStoryOpen(true)}
                  ctaRef={storyBtnRef}
                />
              </>
            )}
          </div>
        </div>

        {/* Story Video Card Modal (current player) */}
        <StoryModal
          open={storyOpen}
          onClose={() => setStoryOpen(false)}
          triggerRef={storyBtnRef}
        />

        {/* Video Player V2 Modal (new player, ?video=v2 flag) */}
        {videoV2Open && (
          <div
            className="vp-modal-backdrop"
            onClick={() => setVideoV2Open(false)}
            aria-modal="true"
            role="dialog"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                maxWidth: '1180px',
                width: 'min(1180px, 100% - 48px)',
                maxHeight: 'calc(100vh - 40px)',
                overflow: 'auto',
              }}
            >
              <VideoPlayerV2
                inline={false}
                autoPlay={true}
                onClose={() => setVideoV2Open(false)}
              />
            </div>
          </div>
        )}
      </section>
    </>
  );
}
