import type { Metadata } from 'next';
import Section from '@/components/Section';
import AmbientEnvironment from '@/components/AmbientEnvironment/AmbientEnvironment';
import PriceStatement from '@/components/Pricing/PriceStatement';
import RolesTable from '@/components/Pricing/RolesTable';

export const metadata: Metadata = {
  title: 'Pricing · SlideIn Venture',
  description: 'We will handle your content and outreach operation for $3,999/month.',
};

/**
 * PRICING — two bands, and neither of them argues.
 *
 * The page used to close on AlternativeSlide: a seven-role ledger with market
 * rates, a $22,100 total and a side-by-side comparison against the retainer.
 * That slide is still in the codebase and still correct — it is just the wrong
 * instrument here. Itemising what the buyer would otherwise pay is a
 * justification move, and running it directly under the number turns a
 * confident price into a defended one.
 *
 * What replaced it is the same information without the arithmetic: the five
 * roles, set large, with nothing to add up. The claim is that you get these
 * people. The page lets that stand.
 *
 * Both bands are `tone="hero"` — the same band the homepage and /contact open
 * on — so pricing reads as another room in one building rather than as a
 * template with its own palette.
 */
export default function PricingPage() {
  return (
    <div id="top">
      {/* ── The statement ────────────────────────────────────────────── */}
      <Section
        tone="hero"
        pad="none"
        className="flex min-h-svh flex-col justify-center pb-[clamp(5rem,10vw,9rem)] pt-[calc(96px+clamp(3rem,7vw,7rem))]"
      >
        <AmbientEnvironment />
        <div className="relative z-10">
          <PriceStatement />
        </div>
      </Section>

      {/* ── What that covers ─────────────────────────────────────────── */}
      <Section tone="hero" pad="none" className="pb-[clamp(7rem,14vw,13rem)]">
        <div className="mx-auto w-full max-w-[1000px] px-6 md:px-10">
          <h2 className="font-display-xl mx-auto max-w-[20ch] text-center text-[clamp(1.9rem,4.4vw,3.1rem)] text-[var(--on-surface)]">
            What You&rsquo;re Getting With That Investment
          </h2>

          <div className="mt-14 md:mt-20">
            <RolesTable />
          </div>
        </div>
      </Section>
    </div>
  );
}
