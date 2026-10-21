import type { Metadata } from 'next';
import Link from 'next/link';
import {
  META,
  HERO,
  PATHS,
  ROLES,
  GUARDRAILS,
  FAQ,
  CLOSING,
} from '@/content/pricing';

export const metadata: Metadata = {
  title: META.title,
  description: META.description,
};

/**
 * PRICING — type and whitespace, no motion
 * ---------------------------------------------------------------------------
 * A static server component on purpose. The brand rule from the earlier price
 * band still holds: typography is the design, the number is the largest thing
 * on the page, and whitespace does the rest. Framer-motion would add entrance
 * choreography to a page whose whole point is that it does not argue.
 *
 * Sections, top to bottom:
 *   hero      the sentence, the figure, the way to book (PriceStatement's
 *             treatment, fed from the content layer instead of hardcoded)
 *   paths     the self-hosted / managed comparison, a real table
 *   roles     the five roles the retainer covers, in one glass panel
 *   guardrails the three thresholds with their provenance labels
 *   faq       native details/summary, no JavaScript
 *   closing   the walkthrough CTA, restated once
 */

/* One hairline, short and centred, used the way PriceStatement used it: to
   separate a claim from what follows it, never to decorate a gap. */
function Hairline({ className = '' }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`block h-px w-[92px] ${className}`}
      style={{
        background:
          'linear-gradient(to right, transparent, var(--rule-strong) 30%, var(--rule-strong) 70%, transparent)',
      }}
    />
  );
}

function WalkthroughCta({ label, href }: { label: string; href: string }) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="btn-premium group inline-flex items-center gap-3 rounded-[var(--radius-pill)] px-9 py-[19px] text-[16px] font-bold tracking-[-0.01em] text-[var(--on-accent)]"
      style={{
        background:
          'linear-gradient(150deg, var(--color-brand-lift) 0%, var(--color-brand) 60%)',
        boxShadow:
          '0 1px 0 color-mix(in oklch, var(--color-paper-25) 34%, transparent) inset, 0 22px 50px -18px color-mix(in oklch, var(--color-brand) 72%, transparent)',
      }}
    >
      {label}
      <svg
        width="15"
        height="15"
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
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-label-wide text-[12px] tracking-[0.22em] text-[var(--muted)]">
      {children}
    </p>
  );
}

export default function PricingPage() {
  return (
    <main className="min-h-svh">
      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="relative mx-auto flex w-full max-w-[900px] flex-col items-center px-6 pt-28 text-center md:px-10 md:pt-36">
        <Eyebrow>{HERO.eyebrow}</Eyebrow>

        <h1 className="font-display-xl mt-8 max-w-[18ch] text-[clamp(2.2rem,5.4vw,4.1rem)] text-[var(--on-surface)]">
          {HERO.titleLead}
          <br />
          <span className="text-[var(--accent)]">{HERO.titleAccent}</span>
        </h1>

        <Hairline className="mt-12" />

        <div className="relative mt-12">
          {/* The light the number sits in, not a highlight on it. */}
          <span
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[150%] w-[190%] -translate-x-1/2 -translate-y-1/2 blur-3xl"
            style={{
              background:
                'radial-gradient(50% 50% at 50% 50%, color-mix(in oklch, var(--accent-vivid) 15%, transparent), transparent 72%)',
            }}
          />
          <p className="tnum flex items-baseline justify-center gap-3 leading-none text-[var(--on-surface)]">
            {/* The prefix and interval are optical satellites, set smaller so
                the figure reads as one shape rather than five equal glyphs.
                Lowercase interval, as it has always been. */}
            <span className="translate-y-[-0.4em] text-[15px] font-semibold tracking-[0.02em] text-[var(--muted)]">
              {HERO.figure.prefix}
            </span>
            <span className="font-display-xl inline-flex items-baseline text-[clamp(3.6rem,12vw,8rem)] leading-[0.86]">
              <span
                aria-hidden
                className="relative text-[0.44em] text-[var(--muted)]"
                style={{ top: '-0.52em', marginRight: '0.05em' }}
              >
                {HERO.figure.currency}
              </span>
              {HERO.figure.amount}
            </span>
            <span className="translate-y-[-0.4em] text-[15px] font-semibold tracking-[0.02em] text-[var(--muted)]">
              {HERO.figure.interval}
            </span>
          </p>
          <span className="sr-only">{HERO.figure.srOnly}</span>
        </div>

        <div className="mt-14">
          <WalkthroughCta label={HERO.cta.label} href={HERO.cta.href} />
        </div>

        <p className="mt-8 max-w-[46ch] text-[15px] leading-relaxed text-[var(--muted)]">
          {HERO.alternate}
        </p>
      </section>

      {/* ── Two paths ──────────────────────────────────────────────────── */}
      <section
        id={PATHS.id}
        className="mx-auto w-full max-w-[980px] scroll-mt-24 px-6 pt-32 md:px-10"
      >
        <Eyebrow>{PATHS.eyebrow}</Eyebrow>
        <h2 className="font-display-md mt-4 max-w-[22ch] text-[clamp(1.7rem,3.6vw,2.6rem)] text-[var(--on-surface)]">
          {PATHS.heading}
        </h2>
        <p className="mt-4 max-w-[58ch] text-[16px] leading-relaxed text-[var(--muted)]">
          {PATHS.lead}
        </p>

        <div className="mt-14 overflow-x-auto">
          <table className="w-full min-w-[680px] border-separate border-spacing-0 text-left">
            <thead>
              <tr>
                <th className="w-[26%] pb-5 align-bottom">
                  <span className="sr-only">{PATHS.columns.label}</span>
                </th>
                <th className="w-[37%] pb-5 align-bottom pr-8">
                  <span className="font-label-wide text-[12px] tracking-[0.22em] text-[var(--muted)]">
                    {PATHS.columns.self}
                  </span>
                </th>
                <th className="w-[37%] pb-5 align-bottom">
                  <span className="font-label-wide text-[12px] tracking-[0.22em] text-[var(--accent)]">
                    {PATHS.columns.managed}
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {PATHS.rows.map((row, i) => (
                <tr key={row.label}>
                  <th
                    scope="row"
                    className="py-6 pr-8 align-top text-[14px] font-semibold tracking-[0.02em] text-[var(--on-surface)]"
                    style={{
                      borderTop: i === 0 ? 'none' : '1px solid var(--rule)',
                    }}
                  >
                    {row.label}
                  </th>
                  <td
                    className="py-6 pr-8 align-top text-[15px] leading-relaxed text-[var(--muted)]"
                    style={{
                      borderTop: i === 0 ? 'none' : '1px solid var(--rule)',
                    }}
                  >
                    {row.self}
                  </td>
                  <td
                    className="py-6 align-top text-[15px] leading-relaxed text-[var(--on-surface)]"
                    style={{
                      borderTop: i === 0 ? 'none' : '1px solid var(--rule)',
                    }}
                  >
                    {row.managed}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-10">
          <Link
            href={PATHS.repo.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[14px] font-semibold text-[var(--accent)] underline decoration-[var(--rule-strong)] underline-offset-4 transition-colors hover:text-[var(--accent-vivid)]"
          >
            {PATHS.repo.label}
          </Link>
        </p>
      </section>

      {/* ── What the retainer covers ───────────────────────────────────── */}
      <section id={ROLES.id} className="mx-auto w-full max-w-[900px] scroll-mt-24 px-6 pt-32 md:px-10">
        <Eyebrow>{ROLES.eyebrow}</Eyebrow>
        <h2 className="font-display-md mt-4 max-w-[22ch] text-[clamp(1.7rem,3.6vw,2.6rem)] text-[var(--on-surface)]">
          {ROLES.heading}
        </h2>
        <p className="mt-4 max-w-[58ch] text-[16px] leading-relaxed text-[var(--muted)]">
          {ROLES.lead}
        </p>

        <div
          className="relative mt-14 overflow-hidden rounded-[calc(var(--radius-md)*1.7)]"
          style={{
            background:
              'linear-gradient(180deg, var(--gloss), transparent 30%), var(--surface-glass)',
            border: '1px solid var(--rule)',
            boxShadow: 'var(--shadow-inset-top), var(--shadow-float)',
            backdropFilter: 'blur(22px) saturate(1.25)',
            WebkitBackdropFilter: 'blur(22px) saturate(1.25)',
          }}
        >
          <table className="relative w-full border-separate border-spacing-0 text-left">
            <tbody>
              {ROLES.roles.map((role, i) => (
                <tr key={role}>
                  <td
                    className="px-6 py-6 sm:px-10 sm:py-7"
                    style={{
                      borderTop: i === 0 ? 'none' : '1px solid var(--rule)',
                    }}
                  >
                    <span className="font-display-sm text-[clamp(1.05rem,2.2vw,1.4rem)] leading-[1.25] text-[var(--on-surface)]">
                      {role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="font-display-sm mt-10 max-w-[34ch] text-[clamp(1.05rem,2.2vw,1.4rem)] leading-[1.35] text-[var(--muted)]">
          {ROLES.closing}
        </p>
      </section>

      {/* ── The numbers we answer to ───────────────────────────────────── */}
      <section
        id={GUARDRAILS.id}
        className="mx-auto w-full max-w-[980px] scroll-mt-24 px-6 pt-32 md:px-10"
      >
        <Eyebrow>{GUARDRAILS.eyebrow}</Eyebrow>
        <h2 className="font-display-md mt-4 max-w-[22ch] text-[clamp(1.7rem,3.6vw,2.6rem)] text-[var(--on-surface)]">
          {GUARDRAILS.heading}
        </h2>
        <p className="mt-4 max-w-[58ch] text-[16px] leading-relaxed text-[var(--muted)]">
          {GUARDRAILS.lead}
        </p>

        <div className="mt-14 grid gap-10 sm:grid-cols-3 sm:gap-6">
          {GUARDRAILS.figures.map((f) => (
            <div
              key={f.label}
              className="border-t pt-6"
              style={{ borderColor: 'var(--rule-strong)' }}
            >
              <p className="tnum font-display-xl text-[clamp(2rem,4.5vw,3rem)] leading-none text-[var(--on-surface)]">
                {f.value}
              </p>
              <p className="font-label-wide mt-4 text-[11px] tracking-[0.18em] text-[var(--muted)]">
                {f.label}
              </p>
              <p className="mt-2 text-[11px] font-semibold tracking-[0.14em] text-[var(--accent)]">
                {f.sourceLabel}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-14 max-w-[62ch] text-[15px] leading-relaxed text-[var(--muted)]">
          {GUARDRAILS.openRates}
        </p>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────────────── */}
      <section id={FAQ.id} className="mx-auto w-full max-w-[820px] scroll-mt-24 px-6 pt-32 md:px-10">
        <Eyebrow>{FAQ.eyebrow}</Eyebrow>
        <h2 className="font-display-md mt-4 max-w-[22ch] text-[clamp(1.7rem,3.6vw,2.6rem)] text-[var(--on-surface)]">
          {FAQ.heading}
        </h2>

        <div className="mt-12">
          {FAQ.items.map((item, i) => (
            <details
              key={item.q}
              className="group border-t py-6 [&:last-child]:border-b"
              style={{ borderColor: 'var(--rule)' }}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-left [&::-webkit-details-marker]:hidden">
                <span className="text-[16px] font-semibold tracking-[-0.01em] text-[var(--on-surface)]">
                  {item.q}
                </span>
                <span
                  aria-hidden
                  className="relative h-3 w-3 shrink-0 text-[var(--muted)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-open:rotate-45"
                >
                  {/* A plus that becomes an x when open. No icon font, no JS. */}
                  <span className="absolute left-1/2 top-0 h-full w-[1.5px] -translate-x-1/2 bg-current" />
                  <span className="absolute left-0 top-1/2 h-[1.5px] w-full -translate-y-1/2 bg-current" />
                </span>
              </summary>
              <p className="mt-4 max-w-[62ch] text-[15px] leading-relaxed text-[var(--muted)]">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* ── Closing ────────────────────────────────────────────────────── */}
      <section className="mx-auto flex w-full max-w-[900px] flex-col items-center px-6 pb-32 pt-32 text-center md:px-10 md:pb-40">
        <h2 className="font-display-md max-w-[20ch] text-[clamp(1.7rem,3.6vw,2.6rem)] text-[var(--on-surface)]">
          {CLOSING.heading}
        </h2>
        <p className="mt-4 max-w-[48ch] text-[16px] leading-relaxed text-[var(--muted)]">
          {CLOSING.body}
        </p>
        <div className="mt-12">
          <WalkthroughCta label={CLOSING.cta.label} href={CLOSING.cta.href} />
        </div>
      </section>
    </main>
  );
}
