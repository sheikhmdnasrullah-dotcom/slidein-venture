import Link from 'next/link';
import { Section } from '@/components/Section';
import { MonoLabel, SectionRule } from '@/components/System/System';
import { LogoWordmark } from '@/components/Brand/Logo';

/**
 * Only routes that actually exist are linked. Per docs/site-architecture.md the
 * rule is: a link ships when its route ships. The previous version declared 24
 * links, 22 of which 404'd.
 */
const LIVE_LINKS = [
  { label: 'Solutions', href: '/solutions' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'The Framework', href: '/steps#framework' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    /* The page ends on its darkest value. Nothing follows it, so it does not
       need a bleed — a seam is enough to keep the join from reading printed. */
    <Section as="footer" tone="terminal" pad="none" seam>
      <div className="mx-auto max-w-[1200px] px-6 py-16 md:px-10 md:py-20">
        <SectionRule index="04" label="Index" coordinate="SIV · FOOTER" />

        <div className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-[1.4fr_1fr]">
          {/* ── Brand ─────────────────────────────────────────────────── */}
          <div className="flex flex-col gap-5">
            <Link href="/" className="group inline-flex w-fit items-center">
              <LogoWordmark size="24px" />
            </Link>

            <p className="max-w-[34ch] text-[15px] leading-[1.7] text-[var(--muted)]">
              Full-cycle video production and cold outreach — built, run, and
              measured as one system.
            </p>
          </div>

          {/* ── Live navigation ───────────────────────────────────────── */}
          <nav className="flex flex-col gap-4" aria-label="Footer">
            <MonoLabel>Navigate</MonoLabel>
            <ul className="flex flex-col gap-3">
              {LIVE_LINKS.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="group inline-flex items-center gap-2.5 text-[15px] text-[var(--muted)] transition-colors duration-300 hover:text-[var(--on-surface)]"
                  >
                    <span
                      aria-hidden
                      className="h-px w-0 bg-[var(--accent)] transition-all duration-500 ease-out group-hover:w-4"
                    />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* ── System metadata row ─────────────────────────────────────── */}
        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--rule)] pt-6">
          <MonoLabel>© {year} SlideIn Venture</MonoLabel>
          <div className="flex items-center gap-5">
            <MonoLabel>Grid · 28px</MonoLabel>
            <span className="h-3 w-px bg-[var(--rule-strong)]" aria-hidden />
            <MonoLabel className="inline-flex items-center gap-2">
              <span
                className="pulse-dot h-1.5 w-1.5 rounded-full"
                style={{ background: 'var(--accent-vivid)' }}
                aria-hidden
              />
              Available
            </MonoLabel>
          </div>
        </div>
      </div>
    </Section>
  );
}
