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

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HOME } from '@/content/home';
import { BAND_DISORDER } from '@/content/stages';

const WORDS = ['needs', 'behavior', 'intent'] as const;
const EASE_WORD = [0.65, 0, 0.35, 1] as const; // ease-in-out
const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const MOVE_S = 0.45;
const HOLD_MS = 2000;
const FIRST_CHANGE_MS = 3000; // entrance (~1.6s) + one full hold

/** Entrance for a line: small rise + fade. */
const rise = (delay: number, reduce: boolean | null) => ({
  initial: reduce ? false : { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: EASE_OUT },
});

/**
 * Inline vertical word rotator. The slot is as wide as "behavior" so nothing
 * around it moves; the word is the one orange thing on the first line pair.
 */
function Rotator() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduce) return;
    let timer: ReturnType<typeof setTimeout>;
    const next = (delay: number) => {
      timer = setTimeout(() => {
        setI((n) => (n + 1) % WORDS.length);
        next(HOLD_MS + MOVE_S * 1000);
      }, delay);
    };
    next(FIRST_CHANGE_MS);
    return () => clearTimeout(timer);
  }, [reduce]);

  return (
    <span
      className="relative inline-block overflow-hidden align-bottom"
      style={{ padding: '0.04em 0.02em 0.16em', margin: '-0.04em -0.02em -0.16em' }}
    >
      <span className="invisible" aria-hidden="true">
        behavior
      </span>
      <AnimatePresence initial={true}>
        <motion.span
          key={WORDS[i]}
          className="absolute left-0"
          style={{ top: '0.04em', color: 'var(--color-brand)' }}
          initial={reduce ? false : { y: '110%' }}
          animate={{ y: 0, transition: { duration: MOVE_S, ease: EASE_WORD, delay: i === 0 && !reduce ? 0.35 : 0 } }}
          exit={{ y: '-110%', transition: { duration: MOVE_S, ease: EASE_WORD, delay: 0 } }}
        >
          {WORDS[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

const EASE_EXPO = [0.16, 1, 0.3, 1] as const;

/** One word, rising out of its own line box (the .hm-w mask clips it). */
function W({ children, delay, reduce }: { children: React.ReactNode; delay: number; reduce: boolean | null }) {
  return (
    <span className="hm-w" aria-hidden="true">
      <motion.span
        className="hm-w__in"
        initial={reduce ? false : { y: '118%' }}
        animate={{ y: 0 }}
        transition={{ duration: 0.95, delay, ease: EASE_EXPO }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/** A run of plain words, each on its own stagger. */
function Run({ text, start, reduce }: { text: string; start: number; reduce: boolean | null }) {
  return (
    <>
      {text
        .trim()
        .split(/\s+/)
        .map((w, i) => (
          <span key={`${w}-${i}`}>
            <W delay={start + i * 0.07} reduce={reduce}>
              {w}
            </W>{' '}
          </span>
        ))}
    </>
  );
}

/* Three lines, one idea each. Every word rises on its own beat; the rotating word is the one
   orange thing in the first pair; the promise ends on "hyper-personalized", whose letters
   ripple once on arrival and again whenever the pointer crosses it. */
function Headline() {
  const reduce = useReducedMotion();
  const { line1, line2, line3 } = HOME.heroLines;
  const marked = line3.match(/^(.*?)(hyper-personalized)(.*)$/);
  const n1 = line1.trim().split(/\s+/).length;
  const l2 = 0.12 + n1 * 0.07;
  const n2 = line2.trim().split(/\s+/).length;
  const l3 = l2 + (n2 + 1) * 0.07 + 0.1;
  const pre = marked ? marked[1].trim().split(/\s+/).length : 0;

  return (
    <h1
      data-testid="hero-headline"
      className="hm-h1 font-display-xl"
      aria-label={`${line1} ${line2} ${WORDS[0]} ${line3}`}
      style={{ lineHeight: 1.1, maxWidth: '20em', marginInline: 'auto' }}
    >
      <span className="hm-h1__lead" aria-hidden="true">
        <Run text={line1} start={0.1} reduce={reduce} />
      </span>
      <span className="hm-h1__lead" aria-hidden="true">
        <Run text={line2} start={l2} reduce={reduce} />
        <W delay={l2 + n2 * 0.07} reduce={reduce}>
          <Rotator />
        </W>
      </span>
      <span className="hm-h1__lead" aria-hidden="true" style={{ marginTop: '0.22em' }}>
        {marked ? (
          <>
            <Run text={marked[1]} start={l3} reduce={reduce} />
            <W delay={l3 + pre * 0.07} reduce={reduce}>
              <span className="hm-mark em-mark em-paint hm-hyper" style={{ ['--em-delay' as string]: `${l3 + 0.9}s` }}>
                {[...marked[2]].map((c, i) => (
                  <i key={i} className="hm-l" style={{ ['--i' as string]: i }}>
                    {c}
                  </i>
                ))}
              </span>
            </W>{' '}
            <Run text={marked[3]} start={l3 + (pre + 1) * 0.07} reduce={reduce} />
          </>
        ) : (
          <Run text={line3} start={l3} reduce={reduce} />
        )}
      </span>
    </h1>
  );
}

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
    e.currentTarget.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
  };

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
      onPointerMove={onMove}
    >
      <div className="hm-aurora" aria-hidden="true">
        <i className="hm-aurora__a" />
        <i className="hm-aurora__b" />
        <i className="hm-aurora__c" />
        <i className="hm-aurora__grid" />
        <i className="hm-aurora__spot" />
      </div>
      <div className="hm-hero__grid">
        <Headline />
      </div>
      <span className="hm-cue" aria-hidden="true" />

    </section>
  );
}
