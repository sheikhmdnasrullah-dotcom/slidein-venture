import Link from 'next/link';
import { MonoLabel, SectionRule } from '@/components/System/System';
import { LogoMark } from '@/components/Brand/Logo';

/**
 * Only routes that actually exist are linked. Per docs/site-architecture.md the
 * rule is: a link ships when its route ships. The previous version declared 24
 * links, 22 of which 404'd.
 */
const LIVE_LINKS = [
  { label: 'Solutions', href: '/solutions' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'The Framework', href: '/#framework' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-24 border-t border-black/[0.07]">
      <div className="mx-auto max-w-[1200px] px-6 py-14 md:px-10">
        <SectionRule index="04" label="Index" coordinate="SIV · FOOTER" />

        <div className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-[1.4fr_1fr]">
          {/* ── Brand ─────────────────────────────────────────────────── */}
          <div className="flex flex-col gap-5">
            <Link href="/" className="group inline-flex w-fit items-center gap-2.5">
              <LogoMark className="h-6 w-6 transition-transform duration-500 ease-out group-hover:-rotate-6" />
              <span
                className="text-[22px] leading-none tracking-[-0.01em] text-[var(--color-ink)]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                SlideIn
              </span>
              <span className="text-[18px] font-medium leading-none tracking-tight text-[var(--color-brand)]">
                Venture
              </span>
              <span className="sr-only">SlideIn Venture — home</span>
            </Link>

            <p className="max-w-[34ch] text-[15px] leading-[1.7] text-black/50">
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
                    className="group inline-flex items-center gap-2.5 text-[15px] text-black/60 transition-colors duration-300 hover:text-[var(--color-ink)]"
                  >
                    <span
                      aria-hidden
                      className="h-px w-0 bg-[var(--color-brand)] transition-all duration-500 ease-out group-hover:w-4"
                    />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* ── System metadata row ─────────────────────────────────────── */}
        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-black/[0.06] pt-6">
          <MonoLabel>© {year} SlideIn Venture</MonoLabel>
          <div className="flex items-center gap-5">
            <MonoLabel>Grid · 28px</MonoLabel>
            <span className="h-3 w-px bg-black/[0.12]" aria-hidden />
            <MonoLabel className="inline-flex items-center gap-2">
              <span
                className="pulse-dot h-1.5 w-1.5 rounded-full"
                style={{ background: 'var(--color-brand)' }}
                aria-hidden
              />
              Available
            </MonoLabel>
          </div>
        </div>
      </div>
    </footer>
  );
}
