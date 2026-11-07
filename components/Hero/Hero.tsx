'use client';

/**
 * HERO — the headline and the pinned scroll story (story/HeroStory): scattered
 * work becomes one loop that runs for the client. No buttons, no video: the
 * headline and the story carry the page. The subhead is retired from the hero
 * (it stays in content/home.ts). Copy is read from content/home.ts and never
 * altered here. Headline motion is CSS-only (hero.css + emphasis.css); each animated element
 * drops its animation class when it ends so pinning (which re-parents the
 * hero) can never replay it.
 */

import { useEffect, useRef } from 'react';
import { HeroStory } from './story/HeroStory';
import { HandRule } from '@/components/Typography/HandRule';
import { HOME } from '@/content/home';
import { BAND_DISORDER } from '@/content/stages';

type Css = React.CSSProperties;

/** One word, in its own rising mask. */
function Word({ text, w }: { text: string; w: number }) {
  return (
    <span className="hm-w hm-rise" style={{ '--w': w } as Css}>
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
        <span className="hm-em em-draw" key={`em-${i}`}>
          <Word text={leadWords[i]} w={i} />
          <HandRule />
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
        {/* one continuous marker stroke behind the whole phrase */}
        <span className="hm-mark em-mark em-paint">
          {tailWords.map((t, i) => (
            <span key={i}>
              <Word text={t} w={leadWords.length + i} />
              {i < tailWords.length - 1 ? ' ' : null}
            </span>
          ))}
        </span>
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
      // marker: the animation runs on the wrapper's ::before
      if (e.animationName === 'em-paint') el.classList.remove('em-paint');
      // underline: the hairline is drawn last, so it releases the class
      if (e.animationName === 'em-draw' && el.classList.contains('em-rule__wipe--hair')) {
        el.closest('.em-draw')?.classList.remove('em-draw');
      }
    };
    hero.addEventListener('animationend', done);
    return () => hero.removeEventListener('animationend', done);
  }, []);

  return (
    <section
      ref={heroRef}
      data-testid="hero"
      data-disorder={BAND_DISORDER.hero}
      className="hm-hero"
    >
      <div className="hm-hero__grid">
        <Headline />
      </div>

      <HeroStory />
    </section>
  );
}
