'use client';

/**
 * HERO — the headline and the pinned scroll story (story/HeroStory): scattered
 * work becomes one loop that runs for the client. No buttons, no video: the
 * headline and the story carry the page. The subhead is retired from the hero
 * (it stays in content/home.ts). Copy is read from content/home.ts and never
 * altered here. Headline motion is CSS-only (hero.css); each animated element
 * drops its animation class when it ends so pinning (which re-parents the
 * hero) can never replay it.
 */

import { useEffect, useRef } from 'react';
import { HeroStory } from './story/HeroStory';
import { HOME } from '@/content/home';
import { BAND_DISORDER } from '@/content/stages';

type Css = React.CSSProperties;

/** One word, in its own rising mask. `m` chains the marker. */
function Word({ text, w, m }: { text: string; w: number; m?: number }) {
  const marked = m !== undefined;
  return (
    <span
      className={`hm-w hm-rise${marked ? ' hm-w--mark hm-lay' : ''}`}
      style={{ '--w': w, ...(marked ? { '--m': m } : {}) } as Css}
    >
      <span className="hm-w__in">{text}</span>
    </span>
  );
}

function Headline() {
  const { lead, highlight, full } = HOME.tagline;
  const leadWords = lead.split(' ');
  const tailWords = highlight.split(' ');
  // The first word of the lead carries the hand-drawn underline.
  const emFrom = 0;

  const leadNodes: React.ReactNode[] = [];
  for (let i = 0; i < leadWords.length; i++) {
    if (i === emFrom) {
      leadNodes.push(
        <span className="hm-em" key={`em-${i}`}>
          <Word text={leadWords[i]} w={i} />
          <svg className="hm-em__line hm-strike" viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden="true" focusable="false">
            <path d="M2 8 C 40 2, 70 11, 108 6 S 170 3, 198 7" pathLength={1} />
          </svg>
        </span>,
      );
    } else {
      leadNodes.push(<Word key={i} text={leadWords[i]} w={i} />);
    }
    if (i < leadWords.length - 1) leadNodes.push(' ');
  }

  return (
    <h1 data-testid="hero-headline" className="hm-h1 font-display-xl" aria-label={full}>
      <span className="hm-h1__lead" aria-hidden="true">
        {leadNodes}
      </span>{' '}
      <span className="hm-h1__tail" aria-hidden="true">
        {tailWords.map((t, i) => (
          <span key={i}>
            <Word text={t} w={leadWords.length + i} m={i} />
            {i < tailWords.length - 1 ? ' ' : null}
          </span>
        ))}
      </span>
    </h1>
  );
}

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);

  /* Each animated element drops its class the moment its animation ends; its
     resting state is its natural one. Pinning re-parents the hero, which would
     otherwise replay every CSS animation. */
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const done = (e: AnimationEvent) => {
      const el = e.target as HTMLElement;
      if (e.animationName === 'hm-settle') el.classList.remove('hm-in');
      if (e.animationName === 'hm-rise') el.classList.remove('hm-rise');
      if (e.animationName === 'hm-lay') el.classList.remove('hm-lay');
      // the stroke animates the <path>, but the class lives on its <svg>
      if (e.animationName === 'hm-strike') el.closest('.hm-strike')?.classList.remove('hm-strike');
    };
    hero.addEventListener('animationend', done);
    return () => hero.removeEventListener('animationend', done);
  }, []);

  return (
    <section
      ref={heroRef}
      data-testid="hero"
      data-disorder={BAND_DISORDER.hero}
      className="hm-hero bg-[var(--scaffold-bg)]"
    >
      <div className="hm-hero__grid">
        <Headline />
      </div>

      <HeroStory />
    </section>
  );
}
