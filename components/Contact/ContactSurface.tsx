'use client';

/**
 * CONTACT — the full-page replacement for the Let's Talk panel
 * ---------------------------------------------------------------------------
 * The panel was a dialog that opened on hover from the nav, which meant the
 * single most important moment on the site was something a visitor could only
 * reach by hovering a button and only keep by not scrolling. It is a page now:
 * /contact, linked from the same nav button.
 *
 * WHAT IS ACTUALLY DIFFERENT, BEYOND "BIGGER"
 *
 * 1. IT IS AN EDITORIAL SPREAD, NOT A CARD. Two columns on a real grid — a
 *    portrait plate on the left, a contact rail on the right — with the type
 *    hierarchy running name → address → platform rather than everything at
 *    13px inside a 310px box. The left column goes sticky above `lg` so the
 *    portrait holds the page while the rail scrolls past it.
 *
 * 2. EVERY VALUE COMES FROM THE TONE CONTRACT. The band is `tone="hero"`, the
 *    same one the homepage opens on, so the contact page reads as the far end
 *    of the same environment rather than as a separate template. Not one hex
 *    literal in this file.
 *
 * 3. MOTION IS POINTER-LED, NOT DECORATIVE. The portrait tilts toward the
 *    cursor on a spring; the CTA is magnetic; cards lift on a single shared
 *    expo curve. Every one of those paths is disabled under
 *    prefers-reduced-motion, and the entrance stagger collapses to zero rather
 *    than replaying instantly.
 *
 * 4. NO NEW WORDS. Every string rendered here comes from content/contact.ts,
 *    and every one of those already existed in the panel. Social cards carry
 *    the platform name and nothing else.
 */

import { useRef, type ReactNode } from 'react';
import Link from 'next/link';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from 'framer-motion';
import { Section } from '@/components/Section';
import AmbientEnvironment from '@/components/AmbientEnvironment/AmbientEnvironment';
import { SocialGlyph, SOCIAL_BRAND } from './SocialGlyphs';
import type { SocialEntry } from '@/content/contact';
import {
  PROFILE,
  EMAILS,
  SOCIALS,
  CALENDAR_URL,
  BOOK_LABEL,
  SEND_LABEL,
} from '@/content/contact';

const EASE = [0.16, 1, 0.3, 1] as const;

/* ─── Entrance ────────────────────────────────────────────────────────────
   One helper, one curve. Every reveal on this page is the same 0.75s expo
   rise at a different delay, which is what makes a staggered page read as
   choreography instead of as eight components each doing their own thing. */
function rise(delay: number, still: boolean, y = 18) {
  return {
    initial: { opacity: 0, y },
    animate: { opacity: 1, y: 0 },
    transition: still ? { duration: 0 } : { duration: 0.75, delay, ease: EASE },
  };
}

/* ─── Magnetic wrapper ────────────────────────────────────────────────────
   Mouse pointers only, and the springs are always mounted — a conditional
   `undefined` style is a hydration mismatch, because useReducedMotion is
   false on the server for everyone. Same lesson as Hero.tsx. */
function Magnetic({
  children,
  strength = 0.24,
  disabled,
  className = 'inline-block',
}: {
  children: ReactNode;
  strength?: number;
  disabled: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 190, damping: 17, mass: 0.35 });
  const y = useSpring(my, { stiffness: 190, damping: 17, mass: 0.35 });

  return (
    <motion.div
      ref={ref}
      className={className}
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

/* ─── Verified badge ──────────────────────────────────────────────────────
   Same path the panel carried. The blue is a platform mark rather than a
   brand colour, so it stays a literal here and nowhere else. */
function VerifiedBadge({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 29 29" fill="none" aria-hidden="true">
      <path
        d="M18.38 0l2.37 3.666 4.364.214.221 4.364L29 10.613l-1.989 3.887L29 18.38l-3.666 2.369-.214 4.364-4.364.221L18.387 29 14.5 27.011 10.62 29l-2.369-3.666-4.364-.214-.221-4.364L0 18.387l1.989-3.887L0 10.62l3.666-2.369.214-4.363 4.364-.221L10.613 0 14.5 1.989z"
        fill="#42A5F5"
      />
      <path
        d="M12.7 19.994L8.22 15.512l1.464-1.463 3.045 3.038 6.601-6.401 1.443 1.484z"
        fill="var(--color-paper-25)"
      />
    </svg>
  );
}

function MailIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="4.5" width="20" height="15" rx="3" />
      <path d="m3 7 8.4 5.6a1 1 0 0 0 1.2 0L21 7" />
    </svg>
  );
}

function CalendarIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4.5" width="18" height="17" rx="3.5" />
      <path d="M3 9.5h18M8 2.5v4M16 2.5v4" />
    </svg>
  );
}

function ArrowIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 15 15" fill="none" aria-hidden="true">
      <path d="M3 7.5h9M8 3.5l4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ─── Portrait plate ──────────────────────────────────────────────────────
   The image gets a plate, not a border: a soft orange bloom behind it, a
   paper frame with an inset gloss on top, and a 3D tilt that tracks the
   pointer across the whole plate rather than the image alone — tilting the
   frame and its shadow together is what stops it reading as a CSS trick.

   perspective lives on the OUTER element and the rotation on the inner one.
   Putting both on one node makes the element its own perspective origin, and
   the tilt flattens out to a shear. */
function Portrait({ still }: { still: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 120, damping: 18, mass: 0.4 });
  const sy = useSpring(py, { stiffness: 120, damping: 18, mass: 0.4 });
  const rotateY = useTransform(sx, [-0.5, 0.5], ['7deg', '-7deg']);
  const rotateX = useTransform(sy, [-0.5, 0.5], ['-7deg', '7deg']);
  const glowX = useTransform(sx, [-0.5, 0.5], [32, 68]);
  const glowY = useTransform(sy, [-0.5, 0.5], [30, 70]);
  /* Composed at the top level, never inside the returned JSX — a hook called
     from inside a render expression is one conditional away from a reorder. */
  const sheen = useTransform(
    [glowX, glowY],
    ([gx, gy]: number[]) =>
      `radial-gradient(42% 38% at ${gx}% ${gy}%, color-mix(in oklch, var(--color-paper-25) 26%, transparent), transparent 70%)`
  );

  return (
    <div
      ref={ref}
      className="relative w-full max-w-[420px] [perspective:1400px]"
      onPointerMove={(e) => {
        if (still || e.pointerType !== 'mouse' || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        px.set((e.clientX - r.left) / r.width - 0.5);
        py.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onPointerLeave={() => {
        px.set(0);
        py.set(0);
      }}
    >
      {/* Bloom. Sits behind the plate and drifts with it, so the light reads
          as coming off the portrait rather than as a blob pinned to the page. */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -inset-10 -z-10 rounded-[64px] blur-3xl"
        style={{
          background:
            'radial-gradient(58% 52% at 30% 24%, color-mix(in oklch, var(--accent-vivid) 26%, transparent), transparent 72%), radial-gradient(52% 48% at 78% 82%, color-mix(in oklch, var(--accent-vivid) 16%, transparent), transparent 74%)',
        }}
        animate={still ? undefined : { opacity: [0.55, 0.85, 0.55], scale: [1, 1.04, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        animate={still ? undefined : { y: [0, -9, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="relative"
      >
        {/* The plate. A hairline frame with padding, so the image sits INSIDE
            a mount the way a print does, instead of bleeding to the edge. */}
        <div
          className="relative overflow-hidden rounded-[32px] p-2.5"
          style={{
            background:
              'linear-gradient(160deg, var(--gloss), transparent 42%), var(--surface-glass)',
            border: '1px solid var(--rule)',
            boxShadow: 'var(--shadow-inset-top), var(--shadow-float)',
            backdropFilter: 'blur(18px) saturate(1.3)',
            WebkitBackdropFilter: 'blur(18px) saturate(1.3)',
          }}
        >
          <div className="relative overflow-hidden rounded-[24px]" style={{ border: '1px solid var(--rule)' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={PROFILE.image}
              alt={PROFILE.name}
              className="block aspect-[4/5] w-full object-cover"
            />

            {/* Specular sheen that follows the pointer across the image. Very
                low alpha — it should be felt, not seen. */}
            <motion.span
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{ background: sheen }}
            />

            {/* Grounding wash at the foot of the plate, so the badge below has
                something to sit against on a light photograph. */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3"
              style={{
                background:
                  'linear-gradient(to top, color-mix(in oklch, var(--color-ink) 24%, transparent), transparent)',
              }}
            />
          </div>
        </div>

        {/* Badge rides forward in Z so it detaches from the plate as it tilts. */}
        <span
          className="absolute -bottom-3 -right-3 flex items-center justify-center rounded-full p-1"
          style={{
            background: 'var(--surface)',
            boxShadow: 'var(--shadow-raised)',
            transform: 'translateZ(48px)',
          }}
        >
          <VerifiedBadge size={30} />
        </span>
      </motion.div>
    </div>
  );
}

/* ─── Email card ──────────────────────────────────────────────────────────
   The whole card is the link. The old panel put the only target inside a
   13px "Send" chip; the address is the thing being read, so the address is
   the thing being clicked. The chip stays as an affordance, not as the hit
   area. */
function EmailCard({ address, delay, still }: { address: string; delay: number; still: boolean }) {
  return (
    <motion.div {...rise(delay, still, 14)}>
      <Link
        href={`mailto:${address}`}
        className="group relative flex items-center gap-4 overflow-hidden rounded-[var(--radius-md)] px-5 py-5 transition-[transform,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-[var(--accent-ring)] sm:px-6 sm:py-6"
        style={{
          background: 'linear-gradient(180deg, var(--gloss), transparent 46%), var(--surface-glass)',
          border: '1px solid var(--rule)',
          boxShadow: 'var(--shadow-inset-top), var(--shadow-raised)',
        }}
      >
        {/* Orange wash that wipes in from the left edge on hover. Transform,
            not width — a width transition on a card this size drops frames. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 origin-left scale-x-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
          style={{
            background:
              'linear-gradient(90deg, color-mix(in oklch, var(--accent-vivid) 9%, transparent), transparent 62%)',
          }}
        />

        <span
          className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[var(--accent)] transition-colors duration-300 group-hover:text-[var(--on-accent)]"
          style={{ background: 'var(--accent-wash)', border: '1px solid var(--accent-ring)' }}
        >
          <span
            aria-hidden
            className="absolute inset-0 scale-50 rounded-full opacity-0 transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-100 group-hover:opacity-100"
            style={{ background: 'var(--accent-vivid)' }}
          />
          <span className="relative">
            <MailIcon size={17} />
          </span>
        </span>

        <span className="relative flex min-w-0 flex-1 items-center">
          <span className="truncate text-[16px] font-semibold tracking-[-0.012em] text-[var(--on-surface)] sm:text-[19px]">
            {address}
          </span>
        </span>

        <span
          className="relative hidden shrink-0 items-center gap-1.5 rounded-full px-4 py-2.5 text-[13px] font-semibold transition-colors duration-300 group-hover:bg-[var(--on-surface)] group-hover:text-[var(--surface)] sm:inline-flex"
          style={{ background: 'var(--surface-2)', color: 'var(--on-surface)' }}
        >
          {SEND_LABEL}
          <span className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1">
            <ArrowIcon size={13} />
          </span>
        </span>

        {/* Phone: the chip is gone, so the arrow carries the affordance. */}
        <span className="relative shrink-0 text-[var(--faint)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 group-hover:text-[var(--accent)] sm:hidden">
          <ArrowIcon size={16} />
        </span>
      </Link>
    </motion.div>
  );
}

/* ─── Social card ─────────────────────────────────────────────────────────
   A tile per platform: the mark over its name.

   THE MARK IS ITS OWN COLOUR, at rest and on hover. An earlier pass drew all
   of these in --on-surface and filled the plate with brand orange on hover,
   which is consistent but wrong: it turned a row of recognisable logos into a
   row of identical orange chips, and recognition is the entire job of a social
   icon. So the glyph sits in LinkedIn blue / GitHub near-black from the start,
   and hover fills the plate with that SAME colour while the glyph flips to
   paper — the platform's own two-tone, not the site's.

   The lift, the bloom and the border are still the page's shared hover
   language; only the hue is the platform's. `--brand` / `--on-brand` are set
   per card as custom properties so the Tailwind hover variants can reach them
   without a style object per state. */
function SocialCard({
  entry,
  delay,
  still,
}: {
  entry: SocialEntry;
  delay: number;
  still: boolean;
}) {
  const { brand, on } = SOCIAL_BRAND[entry.id];

  return (
    <motion.div {...rise(delay, still, 12)}>
      <Link
        href={entry.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={entry.label}
        className="group relative flex h-full flex-col items-center justify-center gap-3 overflow-hidden rounded-[var(--radius-md)] px-3 py-5 transition-[transform,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5"
        style={{
          background: 'linear-gradient(180deg, var(--gloss), transparent 50%), var(--surface-glass)',
          border: '1px solid var(--rule)',
          boxShadow: 'var(--shadow-inset-top), var(--shadow-contact)',
          ['--brand' as string]: brand,
          ['--on-brand' as string]: on,
        }}
      >
        {/* Floor bloom, in the platform's colour rather than orange. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -bottom-8 h-16 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: 'color-mix(in oklch, var(--brand) 40%, transparent)' }}
        />
        {/* Border tints to the platform colour on hover. A second layer rather
            than a border-color transition, so the base hairline never flickers
            through at low alpha mid-transition. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[var(--radius-md)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ border: '1px solid color-mix(in oklch, var(--brand) 55%, transparent)' }}
        />

        <span
          className="relative flex h-11 w-11 items-center justify-center rounded-full transition-[color,transform] duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-0.5"
          style={{
            background: 'color-mix(in oklch, var(--brand) 10%, var(--surface-2))',
            border: '1px solid color-mix(in oklch, var(--brand) 22%, var(--rule))',
            color: 'var(--brand)',
          }}
        >
          <span
            aria-hidden
            className="absolute inset-0 scale-[0.4] rounded-full opacity-0 transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-100 group-hover:opacity-100"
            style={{ background: 'var(--brand)' }}
          />
          {/* Two stacked glyphs cross-fade: the coloured one out, the paper one
              in, both in the same box. Animating `color` through the midpoint
              would pass the mark through a muddy blend of blue and paper. */}
          <span className="relative transition-opacity duration-[400ms] group-hover:opacity-0">
            <SocialGlyph id={entry.id} size={19} />
          </span>
          <span
            className="absolute opacity-0 transition-opacity duration-[400ms] group-hover:opacity-100"
            style={{ color: 'var(--on-brand)' }}
          >
            <SocialGlyph id={entry.id} size={19} />
          </span>
        </span>

        <span className="relative text-[13px] font-medium tracking-[-0.005em] text-[var(--muted)] transition-colors duration-300 group-hover:text-[var(--on-surface)]">
          {entry.label}
        </span>
      </Link>
    </motion.div>
  );
}

/* ─── Page ────────────────────────────────────────────────────────────────── */
export default function ContactSurface() {
  const still = !!useReducedMotion();
  const socials = SOCIALS.filter((s) => s.href.trim().length > 0);

  return (
    <Section tone="hero" pad="none" className="flex min-h-svh flex-col">
      <AmbientEnvironment />

      {/* pt clears the floating nav pill (bottom edge at 96px) the way every
          other first-band-on-a-page does. */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1200px] flex-1 flex-col justify-center px-6 pb-[clamp(4rem,8vw,8rem)] pt-[calc(96px+clamp(2.5rem,6vw,5.5rem))] md:px-10">
        {/* `lg:items-center` rather than `items-start`, and the left column is
            NOT sticky. Sticky needs a taller container than its own content to
            have anywhere to travel; here the portrait column is the taller of
            the two, so it had none — it just pinned in place and left the two
            columns top-aligned with a long dead run under the shorter one.
            Centring the two against each other is what balances the spread. */}
        <div className="grid grid-cols-1 items-start gap-14 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:items-center lg:gap-16 xl:gap-24">
          {/* ── Left: who ──────────────────────────────────────────────── */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <motion.div {...rise(0.05, still, 24)} className="flex w-full justify-center lg:justify-start">
              <Portrait still={still} />
            </motion.div>

            <motion.h1
              {...rise(0.3, still)}
              className="font-display-xl mt-9 text-[clamp(2.1rem,4.4vw,3.4rem)] text-[var(--on-surface)]"
            >
              {PROFILE.name}
            </motion.h1>

            <motion.p {...rise(0.38, still)} className="font-body mt-2 text-[16px] text-[var(--muted)]">
              {PROFILE.role}
            </motion.p>
          </div>

          {/* ── Right: how ─────────────────────────────────────────────── */}
          <div className="flex flex-col">
            {/* Primary action. The one solid orange object on the page, so it
                is unambiguously the thing to do first. */}
            <motion.div {...rise(0.44, still)} className="flex">
              <Magnetic disabled={still} className="block w-full sm:inline-block sm:w-auto">
                <Link
                  href={CALENDAR_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-premium group relative flex w-full items-center justify-center gap-3 rounded-[var(--radius-pill)] px-8 py-[18px] text-[16px] font-bold tracking-[-0.01em] text-[var(--on-accent)] sm:inline-flex sm:w-auto"
                  style={{
                    background:
                      'linear-gradient(160deg, var(--color-brand-lift) 0%, var(--color-brand) 62%)',
                    boxShadow:
                      '0 1px 0 var(--gloss) inset, 0 18px 40px -14px color-mix(in oklch, var(--color-brand) 65%, transparent)',
                  }}
                >
                  <CalendarIcon size={17} />
                  {BOOK_LABEL}
                  <span className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1">
                    <ArrowIcon size={15} />
                  </span>
                </Link>
              </Magnetic>
            </motion.div>

            {/* Hairline. The page's only divider — the grid does the rest. */}
            <motion.span
              {...rise(0.52, still, 0)}
              aria-hidden
              className="mt-11 block h-px w-full"
              style={{
                background:
                  'linear-gradient(to right, var(--rule-strong), color-mix(in oklch, var(--rule) 40%, transparent) 65%, transparent)',
              }}
            />

            {/* Emails */}
            <div className="mt-8 flex flex-col gap-3.5">
              {EMAILS.map((entry, i) => (
                <EmailCard
                  key={entry.id}
                  address={entry.address}
                  delay={0.58 + i * 0.08}
                  still={still}
                />
              ))}
            </div>

            {/* Socials. Renders nothing at all until content/contact.ts has
                real URLs — a contact page with dead links is worse than one
                without the row. */}
            {socials.length > 0 && (
              <>
                <motion.span
                  {...rise(0.72, still, 0)}
                  aria-hidden
                  className="mt-11 block h-px w-full"
                  style={{
                    background:
                      'linear-gradient(to right, var(--rule-strong), color-mix(in oklch, var(--rule) 40%, transparent) 65%, transparent)',
                  }}
                />
                {/* Capped at three columns. `lg:grid-cols-5` left two empty
                    tracks and squeezed three cards into 60% of the rail; the
                    row should fill its width whatever the count. */}
                <div className="mt-8 grid grid-cols-3 gap-3 sm:gap-4">
                  {socials.map((entry, i) => (
                    <SocialCard key={entry.id} entry={entry} delay={0.78 + i * 0.06} still={still} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
}
