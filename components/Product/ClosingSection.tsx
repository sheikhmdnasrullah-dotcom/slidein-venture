import Link from 'next/link';
import { Section } from '@/components/Section';
import Reveal from './Reveal';
import { CLOSING } from '@/content/product';

/**
 * CLOSING — the last band before the footer
 * ---------------------------------------------------------------------------
 * One statement, two doors: the software path and the managed path. The CTA
 * pair is the same pair the hero uses, which is deliberate — a visitor who
 * has read the page should not meet new verbs at the bottom of it. `tone="base"`
 * leaves the terminal value to the footer, so the page still ends on its
 * deepest paper.
 */
export default function ClosingSection() {
  return (
    <Section tone="base" pad="none" className="py-[clamp(5rem,10vw,9rem)]">
      <div className="mx-auto w-full max-w-[1040px] px-6 md:px-10">
        <Reveal>
          <div className="mx-auto flex max-w-[720px] flex-col items-center text-center">
            <h2 className="font-display-xl text-[clamp(2rem,4.2vw,3rem)] leading-[1.12] text-[var(--on-surface)]">
              {CLOSING.heading}
            </h2>
            <p className="font-body-lead mt-6 max-w-[56ch] text-[1.05rem] leading-[1.75] text-[var(--muted)]">
              {CLOSING.body}
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-3.5">
              <Link
                href={CLOSING.primaryCta.href}
                className="btn-premium group inline-flex items-center gap-2.5 rounded-[var(--radius-pill)] px-7 py-[17px] text-[15px] font-[600] tracking-[-0.01em]"
                style={{
                  background: 'linear-gradient(150deg, var(--color-ink) 0%, var(--color-ink-deep) 100%)',
                  color: 'var(--color-paper-25)',
                  boxShadow:
                    '0 1px 0 color-mix(in oklch, var(--color-paper-25) 18%, transparent) inset, 0 18px 40px -16px color-mix(in oklch, var(--color-ink) 55%, transparent)',
                }}
              >
                {CLOSING.primaryCta.label}
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  aria-hidden
                  className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
                >
                  <path
                    d="M3 7h8M7 3l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>

              <Link
                href={CLOSING.secondaryCta.href}
                className="group inline-flex items-center gap-2.5 rounded-[var(--radius-pill)] px-7 py-[17px] text-[15px] font-[600] tracking-[-0.01em] text-[var(--on-surface)] transition-colors duration-300 hover:bg-[var(--surface)]"
                style={{
                  background: 'var(--surface-glass)',
                  border: '1px solid var(--rule-strong)',
                  boxShadow: 'var(--shadow-inset-top)',
                }}
              >
                {CLOSING.secondaryCta.label}
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
