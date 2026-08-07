'use client';

/**
 * ROLES TABLE — what the retainer covers
 * ---------------------------------------------------------------------------
 * Five rows. No rates, no totals, no comparison column, no summary line — the
 * page that used to live here made the argument by arithmetic, and arithmetic
 * on a premium price reads as justification. A list of the people you get,
 * set large with air around it, makes the same point by not arguing.
 *
 * WHY IT IS BUILT AS A REAL <table>
 * It is tabular data with one column, and a screen reader announcing "table,
 * 5 rows" is more useful than a <ul> of divs. The visual work is done with
 * border-collapse off and generous cell padding rather than by abandoning the
 * semantics.
 *
 * THE GLYPHS ARE NOT NEW. They are imported from AlternativeSlide, which
 * already drew exactly these five roles at exactly this stroke weight. A
 * second icon set for the same five nouns is how a design system starts to
 * drift.
 */

import { motion, useReducedMotion } from 'framer-motion';
import { Glyph, type IconKind } from '@/components/PitchDeck/AlternativeSlide';

const EASE = [0.16, 1, 0.3, 1] as const;

const ROLES: { label: string; icon: IconKind }[] = [
  { label: 'Content Strategist', icon: 'strategy' },
  { label: 'Video Editor', icon: 'film' },
  { label: 'Copywriter', icon: 'pen' },
  { label: 'Social Manager', icon: 'share' },
  { label: 'Lead Researcher & Outreach Specialist', icon: 'send' },
];

export default function RolesTable() {
  const still = !!useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-70px' }}
      transition={still ? { duration: 0 } : { duration: 0.85, ease: EASE }}
      className="relative mx-auto w-full max-w-[820px] overflow-hidden rounded-[calc(var(--radius-md)*1.7)]"
      style={{
        background: 'linear-gradient(180deg, var(--gloss), transparent 30%), var(--surface-glass)',
        border: '1px solid var(--rule)',
        boxShadow: 'var(--shadow-inset-top), var(--shadow-float)',
        backdropFilter: 'blur(22px) saturate(1.25)',
        WebkitBackdropFilter: 'blur(22px) saturate(1.25)',
      }}
    >
      {/* Floor light. One soft brand wash under the panel so it sits on the
          page rather than being pasted onto it. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-16 -bottom-24 h-40 opacity-30 blur-3xl"
        style={{ background: 'color-mix(in oklch, var(--accent-vivid) 22%, transparent)' }}
      />

      <table className="relative w-full border-separate border-spacing-0 text-left">
        <tbody>
          {ROLES.map((role, i) => (
            <motion.tr
              key={role.label}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={still ? { duration: 0 } : { duration: 0.6, delay: 0.12 + i * 0.08, ease: EASE }}
              className="group/row"
            >
              <td
                className="relative"
                /* The divider is a cell border rather than a wrapper element,
                   so the first row has no rule above it and the last has none
                   below without a single :first-child override. */
                style={{ borderTop: i === 0 ? 'none' : '1px solid var(--rule)' }}
              >
                <div className="relative flex items-center gap-5 overflow-hidden px-6 py-6 transition-[padding] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:gap-7 sm:px-10 sm:py-8">
                  {/* Left accent bar — grows from the row's own top edge, so
                      the hover reads as the row being selected rather than as
                      a border being switched on. */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-y-0 left-0 w-[3px] origin-center scale-y-0 rounded-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/row:scale-y-100"
                    style={{
                      background: 'linear-gradient(180deg, var(--color-brand-lift), var(--color-brand))',
                      boxShadow: '0 0 14px color-mix(in oklch, var(--accent-vivid) 55%, transparent)',
                    }}
                  />

                  {/* Wash wiping in from the left. */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 origin-left scale-x-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/row:scale-x-100"
                    style={{
                      background:
                        'linear-gradient(90deg, color-mix(in oklch, var(--accent-vivid) 8%, transparent), transparent 68%)',
                    }}
                  />

                  <span
                    className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius-md)] text-[var(--muted)] transition-colors duration-[420ms] group-hover/row:text-[var(--on-accent)] sm:h-14 sm:w-14"
                    style={{ background: 'var(--surface-2)', border: '1px solid var(--rule)' }}
                  >
                    <span
                      aria-hidden
                      className="absolute inset-0 scale-90 rounded-[var(--radius-md)] opacity-0 transition-all duration-[420ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/row:scale-100 group-hover/row:opacity-100"
                      style={{ background: 'linear-gradient(160deg, var(--color-brand-lift), var(--color-brand))' }}
                    />
                    <svg width={21} height={21} viewBox="0 0 24 24" className="relative">
                      <Glyph kind={role.icon} />
                    </svg>
                  </span>

                  <span className="font-display-sm relative text-[clamp(1.05rem,2.2vw,1.4rem)] leading-[1.25] text-[var(--on-surface)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/row:translate-x-1">
                    {role.label}
                  </span>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}
