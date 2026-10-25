'use client';

/**
 * S7 · USE CASES — archetype F: the inbox fan stack
 * ---------------------------------------------------------------------------
 * One system, three audiences. A glossy envelope tile rests above three
 * skeleton email cards that fan out in a shallow arc as the section
 * scrolls into view — rotate -2 / 0 / +2 degrees, spreading horizontally.
 * Each card carries a blank tinted avatar circle, skeleton lines and (on
 * the middle card, the one the accent belongs to) a tiny accent dot.
 * Beneath each card sits its item slot: the audience and what changes
 * for them.
 *
 * The fan is a one-time entrance (once: true). Under reduced motion the
 * cards render already fanned. Mobile: the fan stacks vertically with a
 * gentle alternating tilt — no horizontal overflow. The shallow ±2 arc
 * sits on this band's tilt budget: nearly calm, one step from the close.
 */

import { motion, useReducedMotion } from 'framer-motion';
import { HOME_CONTENT } from '@/content/home';
import { BAND_DISORDER } from '@/content/stages';
import {
  Band,
  EASE,
  GlossTile,
  ItemSlot,
  Reveal,
  Scene,
  SectionHeader,
} from '@/components/Sections/primitives';
import { EnvelopeIcon } from '@/components/Sections/icons';

const FAN = [
  { rotate: -2, x: -64, y: 26 },
  { rotate: 0, x: 0, y: 0 },
  { rotate: 2, x: 64, y: 26 },
];

/* One skeleton email card in the fan. Lifts gently on hover — rest state
   is identical to the reference frame. */
function FanCard({ accent }: { accent?: boolean }) {
  return (
    <div
      className="relative w-[300px] rounded-[20px] border border-[var(--scaffold-hairline)] bg-white p-5 shadow-[var(--scaffold-shadow-object)] transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-[var(--scaffold-shadow-float)]"
    >
      <div className="flex items-center gap-3">
        {/* blank tinted avatar — no initials, ever */}
        <span
          className="h-[34px] w-[34px] shrink-0 rounded-full"
          style={{
            background:
              'color-mix(in oklch, var(--color-brand) 10%, rgba(255,255,255,1))',
          }}
        />
        <span className="flex flex-col gap-1.5">
          <span className="block h-[9px] w-24 rounded-full bg-[var(--scaffold-skeleton)]" />
          <span className="block h-[7px] w-16 rounded-full bg-[var(--scaffold-skeleton)]" />
        </span>
        {accent ? (
          <span className="ml-auto h-[6px] w-[6px] rounded-full bg-[var(--scaffold-accent)]" />
        ) : null}
      </div>
      <div className="mt-4 flex flex-col gap-2.5">
        <span className="block h-[8px] w-[92%] rounded-full bg-[var(--scaffold-skeleton)]" />
        <span className="block h-[8px] w-[78%] rounded-full bg-[var(--scaffold-skeleton)]" />
        <span className="block h-[8px] w-[56%] rounded-full bg-[var(--scaffold-skeleton)]" />
      </div>
    </div>
  );
}

export default function UseCasesSection() {
  const section = HOME_CONTENT.sections[6];
  const still = !!useReducedMotion();

  return (
    <Band tone="flat" id={section.id} disorder={BAND_DISORDER['use-cases']}>
      <SectionHeader section={section} align="center" />

      <Reveal className="section-visual" y={16}>
        <div className="mx-auto max-w-[1080px]">
          {/* the envelope the fan rises from. Static by story rule. */}
          <Scene className="relative z-[2] mx-auto w-fit">
            <GlossTile size={92} icon={<EnvelopeIcon />} rotate={-2} />
          </Scene>

          {/* the fan — desktop arc, small screens stack */}
          <div className="relative mt-10 hidden justify-center lg:flex">
            {FAN.map((f, i) => (
              <motion.div
                key={i}
                className={i === 1 ? 'relative z-[1]' : 'relative'}
                style={{ marginLeft: i === 0 ? 0 : -56, zIndex: i === 1 ? 2 : 1 }}
                initial={{ opacity: 0, rotate: 0, x: 0, y: 34 }}
                whileInView={{ opacity: 1, rotate: f.rotate, x: f.x, y: f.y }}
                viewport={{ once: true, amount: 0.4 }}
                transition={still ? { duration: 0 } : { duration: 0.8, ease: EASE, delay: 0.12 * i }}
              >
                <FanCard accent={i === 1} />
              </motion.div>
            ))}
          </div>
          <div className="mt-10 flex flex-col items-center gap-6 lg:hidden">
            {FAN.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0, rotate: i === 1 ? 0 : f.rotate / 2 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={still ? { duration: 0 } : { duration: 0.7, ease: EASE, delay: 0.1 * i }}
              >
                <FanCard accent={i === 1} />
              </motion.div>
            ))}
          </div>

          {/* the three audience slots */}
          <div className="mt-16 grid grid-cols-1 gap-x-10 gap-y-10 md:grid-cols-3">
            {section.items.map((item, i) => (
              <div
                key={i}
                className="md:border-l md:border-[var(--scaffold-hairline)] md:pl-8 md:first:border-l-0 md:first:pl-0"
              >
                <ItemSlot item={item} titleBar="min(9em, 100%)" bodyBar="min(32ch, 100%)" />
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </Band>
  );
}
