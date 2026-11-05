'use client';

/**
 * HERO — type-first, asymmetric. Headline, subhead, one primary action (the
 * story pill), one quiet text link, and a static stage plate, all hung on one
 * vertical axis (hero.css). Flat #FDFDFD ground. Copy is read from
 * content/home.ts and never altered here; empty slots render skeleton bars
 * (Rule 0). Entrance is a CSS-only settle (hero.css), disabled under
 * prefers-reduced-motion.
 */

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { StoryModal } from './StoryModal';
import { StagePlate } from './StagePlate';
import { TextSlot } from './Skeleton';
import { VideoPlayerV2 } from '@/how-it-works-video/core/player';
import { HOME, NAV_SLOTS } from '@/content/home';
import { BAND_DISORDER } from '@/content/stages';

const PRICING = NAV_SLOTS.links.find((l) => l.href === '/pricing');

function Headline() {
  const { lead, highlight, full } = HOME.tagline;
  return (
    <h1 data-testid="hero-headline" className="hm-h1 font-display-xl" aria-label={full}>
      <span className="hm-h1__lead hm-in" style={{ '--i': 0 } as React.CSSProperties}>
        {lead}
      </span>{' '}
      <span className="hm-h1__tail hm-in" style={{ '--i': 1 } as React.CSSProperties}>
        <span className="hm-h1__mark">{highlight}</span>
      </span>
    </h1>
  );
}

function Subhead() {
  const text = [HOME.subhead.line1, HOME.subhead.line2].filter(Boolean).join(' ');
  return (
    <p data-testid="hero-subhead" className="hm-sub">
      <TextSlot text={text} barWidth="min(32em, 80vw)" textClassName="block" />
    </p>
  );
}

function StoryPill({
  onOpen,
  btnRef,
}: {
  onOpen: () => void;
  btnRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const { chip, label } = HOME.announcement;
  return (
    <button
      ref={btnRef}
      type="button"
      onClick={onOpen}
      data-testid="hero-cta-primary"
      aria-label="See how it works video walkthrough"
      className="hm-pill"
    >
      <span className="hm-pill__chip">
        <svg viewBox="0 0 12 12" width="11" height="11" aria-hidden="true" focusable="false">
          <path
            d="M3.6 2.3 L10 6 L3.6 9.7 Z"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
        </svg>
        <TextSlot text={chip} textClassName="whitespace-nowrap" barWidth="2.4em" />
      </span>
      <TextSlot
        text={label}
        textClassName="hm-pill__label whitespace-nowrap"
        barWidth="min(10em, 40vw)"
      />
    </button>
  );
}

export default function Hero() {
  const [storyOpen, setStoryOpen] = useState(false);
  const [videoV2Open, setVideoV2Open] = useState(false);
  const storyBtnRef = useRef<HTMLButtonElement>(null);

  // Deep links run post-hydration (a lazy useState init would mismatch SSR).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('story') === '1') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStoryOpen(true);
    }
    if (params.get('video') === 'v2') {
      setVideoV2Open(true);
    }
  }, []);

  return (
    <section
      data-testid="hero"
      data-disorder={BAND_DISORDER.hero}
      className="hm-hero bg-[var(--scaffold-bg)]"
    >
      <div className="hm-hero__grid">
        <Headline />
        <div className="hm-hero__copy hm-in" style={{ '--i': 2 } as React.CSSProperties}>
          <Subhead />
          <div className="hm-actions">
            <StoryPill onOpen={() => setStoryOpen(true)} btnRef={storyBtnRef} />
            {PRICING ? (
              <Link href={PRICING.href} className="hm-link">
                {PRICING.label}{' '}
                <svg
                  className="hm-link__arrow"
                  viewBox="0 0 16 10"
                  width="14"
                  height="9"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path
                    d="M1 5h13M10 1l4 4-4 4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            ) : null}
          </div>
        </div>
        <div className="hm-hero__plate hm-in" style={{ '--i': 3 } as React.CSSProperties}>
          <StagePlate />
        </div>
      </div>

      <StoryModal
        open={storyOpen}
        onClose={() => setStoryOpen(false)}
        triggerRef={storyBtnRef}
      />

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
            <VideoPlayerV2 inline={false} autoPlay={true} onClose={() => setVideoV2Open(false)} />
          </div>
        </div>
      )}
    </section>
  );
}
