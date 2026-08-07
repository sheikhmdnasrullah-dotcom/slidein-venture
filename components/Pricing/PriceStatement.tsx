'use client';

/**
 * PRICE STATEMENT — the whole pricing hero
 * ---------------------------------------------------------------------------
 * WHAT WAS REMOVED, AND WHY. This band used to carry a "One flat retainer"
 * pill, a supporting paragraph, a bordered price card with an "Everything,
 * monthly" eyebrow, a restatement of the same sentence INSIDE that card, and
 * a row of three emoji reassurances. Six UI elements arranged around one
 * number. Every one of them was arguing, and a premium price that argues
 * reads as a price that needs defending.
 *
 * What is left is the sentence, the number, and the way to book. The number is
 * the largest thing on the page — larger than the headline — because it is the
 * page's actual subject. Whitespace does the rest.
 *
 * TYPOGRAPHY IS THE DESIGN HERE. Three sizes, one accent:
 *   · the sentence, display-md, ink, with its second line in the orange that
 *     clears AA as text on this band (--accent, never --accent-vivid)
 *   · the figure, display-xl at hero scale, tabular, with the currency mark
 *     and the interval set as smaller optical satellites so "$3,999" reads as
 *     one shape rather than as five characters of equal weight
 *   · the interval, mono, at label scale
 *
 * The `$` is deliberately NOT full size. At display-xl a currency glyph is a
 * tall thin rectangle that pushes the numerals off centre and makes the whole
 * figure read left-heavy; setting it at ~0.42em and raising it off the
 * baseline is the standard fix and is what makes the number look set rather
 * than typed.
 */

import { useRef, type ReactNode } from 'react';
import Link from 'next/link';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1] as const;
const CALENDAR_URL = 'https://calendar.notion.so/meet/nasrullah_tanim/schedule';

function rise(delay: number, still: boolean, y = 20) {
  return {
    initial: { opacity: 0, y },
    animate: { opacity: 1, y: 0 },
    transition: still ? { duration: 0 } : { duration: 0.85, delay, ease: EASE },
  };
}

/* Pointer-tracked spring. Mouse only; the springs are always mounted, because
   a conditional style object is a hydration mismatch for every reduced-motion
   visitor (useReducedMotion is false during SSR for everyone). */
function Magnetic({
  children,
  disabled,
  strength = 0.26,
}: {
  children: ReactNode;
  disabled: boolean;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 190, damping: 17, mass: 0.35 });
  const y = useSpring(my, { stiffness: 190, damping: 17, mass: 0.35 });

  return (
    <motion.div
      ref={ref}
      className="inline-block"
      style={{ x, y }}
      onPointerMove={(e) => {
        if (disabled || e.pointerType !== 'mouse' || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        mx.set((e.clientX - (r.left + r.width / 2)) * strength);
        my.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

export default function PriceStatement() {
  const still = !!useReducedMotion();

  return (
    <div className="relative mx-auto flex w-full max-w-[900px] flex-col items-center px-6 text-center md:px-10">
      {/* ── The sentence ─────────────────────────────────────────────── */}
      <motion.h1
        {...rise(0.05, still)}
        className="font-display-xl max-w-[16ch] text-[clamp(2.2rem,5.4vw,4.1rem)] text-[var(--on-surface)]"
      >
        We will handle your
        <br />
        <span className="text-[var(--accent)]">content and outreach.</span>
      </motion.h1>

      {/* Hairline. Short and centred — the only divider in the band, and it
          exists to separate the claim from the number rather than to decorate
          the gap between them. */}
      <motion.span
        {...rise(0.16, still, 0)}
        aria-hidden
        className="mt-12 block h-px w-[92px]"
        style={{
          background:
            'linear-gradient(to right, transparent, var(--rule-strong) 30%, var(--rule-strong) 70%, transparent)',
        }}
      />

      {/* ── The number ───────────────────────────────────────────────── */}
      <motion.div {...rise(0.24, still)} className="relative mt-12">
        {/* Bloom behind the figure. Very low alpha — this is the light the
            number sits in, not a highlight on it. */}
        <span
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[150%] w-[190%] -translate-x-1/2 -translate-y-1/2 blur-3xl"
          style={{
            background:
              'radial-gradient(50% 50% at 50% 50%, color-mix(in oklch, var(--accent-vivid) 15%, transparent), transparent 72%)',
          }}
        />

        <p className="tnum flex items-baseline justify-center gap-3 leading-none text-[var(--on-surface)]">
          <span className="font-display-xl inline-flex items-baseline text-[clamp(3.6rem,12vw,8rem)] leading-[0.86]">
            <span
              aria-hidden
              className="relative text-[0.44em] text-[var(--muted)]"
              style={{ top: '-0.52em', marginRight: '0.05em' }}
            >
              $
            </span>
            3,999
          </span>
          {/* Lowercase, as it has always been. `font-label` would uppercase it
              to "/ MONTH", and a CSS text-transform is still a change to what
              the page says. */}
          <span className="translate-y-[-0.4em] text-[15px] font-semibold tracking-[0.02em] text-[var(--muted)]">
            / month
          </span>
        </p>
        {/* The `$` is aria-hidden above and restored here, so assistive tech
            reads "$3,999 / month" as one string instead of announcing a
            floating dollar sign ahead of the figure. */}
        <span className="sr-only">$3,999 / month</span>
      </motion.div>

      {/* ── The way to book ──────────────────────────────────────────── */}
      <motion.div {...rise(0.36, still)} className="mt-14">
        <Magnetic disabled={still}>
          <Link
            href={CALENDAR_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-premium group inline-flex items-center gap-3 rounded-[var(--radius-pill)] px-9 py-[19px] text-[16px] font-bold tracking-[-0.01em] text-[var(--on-accent)]"
            style={{
              background: 'linear-gradient(150deg, var(--color-brand-lift) 0%, var(--color-brand) 60%)',
              boxShadow:
                '0 1px 0 color-mix(in oklch, var(--color-paper-25) 34%, transparent) inset, 0 22px 50px -18px color-mix(in oklch, var(--color-brand) 72%, transparent)',
            }}
          >
            Book a Call
            <svg
              width="15"
              height="15"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden
              className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
            >
              <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </Magnetic>
      </motion.div>
    </div>
  );
}
