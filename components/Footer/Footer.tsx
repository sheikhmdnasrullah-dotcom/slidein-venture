import Link from 'next/link';
import { Section } from '@/components/Section';
import { LogoWordmark } from '@/components/Brand/Logo';
import { CornerBrackets } from '@/components/System/System';
import { Text, Eyebrow } from '@/components/Type/Type';

const CALENDAR_URL =
  'https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ1V3_WMuJIp2gvHKgyE0NG_acjZ4zVGaeOJrQU';

/**
 * FOOTER — the terminal band, now on every route
 * ---------------------------------------------------------------------------
 * Three REAL columns, mounted in app/layout.tsx so every page ends the same
 * way. It used to be mounted per page, and the homepage simply had none —
 * which is why the old page ended mid-sentence on the FrameworkEngines
 * section with no colophon under it.
 *
 *   · The brand column — the wordmark lockup, the one line of where this is
 *     going, and the single tagline that positions the product: outreach
 *     software with a managed-service layer.
 *   · NAV — the same product-oriented items the navbar carries, so the two
 *     navigations cannot disagree about what the site is.
 *   · CONTACT — the real CTA destination (the consultation booking link) with
 *     its promise spelled out, and the year.
 *
 * The copy no longer sells an agency retainer. The bottom line names the
 * managed-service relationship in one sentence, which is what the business
 * actually is: software first, operated-for-you second.
 */
export default function Footer() {
  return (
    <Section tone="terminal" pad="none" as="footer" className="relative px-6 md:px-10 pt-[clamp(3rem,6vw,5rem)] pb-[calc(env(safe-area-inset-bottom,0px)+clamp(1.25rem,2.5vw,2rem))]">
      <div className="mx-auto grid w-full max-w-[1100px] grid-cols-1 gap-10 md:grid-cols-[0.24fr_1fr_0.24fr] md:gap-6">
        {/* ── Wordmark + positioning line ───────────────────────────── */}
        <div className="flex flex-col gap-4">
          <Link
            href="/"
            className="inline-flex w-fit items-center rounded-sm outline-none transition-opacity duration-300 hover:opacity-80 focus-visible:ring-2 focus-visible:ring-[var(--accent-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-2)]"
          >
            <LogoWordmark size="20px" />
          </Link>
          <span
            aria-hidden
            className="block h-[1.5px] w-8 rounded-full bg-[var(--color-brand)]"
          />
          <Eyebrow as="span" text="Research-led outreach, run as software" />
        </div>

        {/* ── Nav: same items as the navbar ────────────────────────── */}
        <nav aria-label="Site" className="flex flex-col gap-4 md:items-center">
          <Eyebrow as="span" text="Platform" />
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2.5 md:justify-center">
            <li>
              <FooterLink href="/#platform">Software</FooterLink>
            </li>
            <li>
              <FooterLink href="/#managed">Managed service</FooterLink>
            </li>
            <li>
              <FooterLink href="/process">How it works</FooterLink>
            </li>
            <li>
              <FooterLink href="/pricing">Pricing</FooterLink>
            </li>
            <li>
              <FooterLink href="/insights">Insights</FooterLink>
            </li>
            <li>
              <FooterLink href="/contact">Contact</FooterLink>
            </li>
          </ul>
        </nav>

        {/* ── The real CTA + year ───────────────────────────────────── */}
        <div className="flex flex-col gap-3 md:items-end md:text-right">
          <Eyebrow as="span" text="Work with us" />
          <a
            href={CALENDAR_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 underline decoration-transparent underline-offset-4 transition-colors duration-300 hover:decoration-current focus-visible:decoration-current"
          >
            <Text as="span" variant="small" text="Book a walkthrough" />
            <span
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            >
              ↗
            </span>
          </a>
          <Text variant="small" text="Or run the platform yourself — the choice is yours." />
        </div>
      </div>

      {/* ── Bottom bar ─────────────────────────────────────────────── */}
      <div className="mx-auto mt-[clamp(2.5rem,5vw,4rem)] flex w-full max-w-[1100px] flex-col-reverse gap-6 border-t border-[var(--rule-strong)] pt-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2">
          <Text variant="small" text={`© ${new Date().getFullYear()} SlideIn Venture. All rights reserved.`} />
          <Text
            variant="small"
            text="We only contact people who match a brief you approve. Every email carries a working unsubscribe, and a no is permanent."
          />
        </div>

        <span
          aria-hidden
          className="hidden w-fit opacity-60 transition-all duration-500 hover:opacity-100 md:block"
        >
          <CornerBrackets />
        </span>
      </div>
    </Section>
  );
}

function FooterLink({ href, children }: { href: string; children: string }) {
  return (
    <Link
      href={href}
      className="underline decoration-transparent underline-offset-4 transition-colors duration-300 hover:decoration-current focus-visible:decoration-current"
    >
      <Text as="span" variant="small" text={children} />
    </Link>
  );
}
