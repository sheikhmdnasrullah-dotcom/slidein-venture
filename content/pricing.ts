export const META = {
  title: 'Pricing · SlideIn',
  description: "We'll manage your outreach emails per month.",
} as const;

/**
 * PRICING RULES — the only place the numbers live.
 * Anchor (founder): 500 outreach emails a month cost $750 a month = $1.50 per
 * email, with $750 as the monthly minimum.
 * Volume bands (pricing-strategy method: cost sets the floor, value the ceiling,
 * and bulk senders get a graduated, marginal discount — each band's rate applies
 * only to the emails inside that band, so a bigger volume never costs less).
 * The lowest band stays above 3x the heaviest AI cost per email in
 * pricing-strategy.md (about $0.06 for deep research), the floor rule used there.
 * Change the numbers here and the page follows; no UI code depends on them.
 */
export const PRICING = {
  /** Monthly fee, in US$, for the anchor volume. */
  baseUsd: 750,
  /** Outreach emails per month the base fee covers. */
  includedEmails: 500,
  /** Largest volume the input accepts. */
  maxEmails: 1_000_000,
} as const;

/** What one email costs at the anchor, in US$. */
export const PRICE_PER_EMAIL_USD = PRICING.baseUsd / PRICING.includedEmails;

/** Graduated bands: emails up to `upTo` in a month are charged `rate` times the anchor price. */
export const VOLUME_BANDS = [
  { upTo: 10_000, rate: 1 },
  { upTo: 50_000, rate: 0.5 },
  { upTo: 200_000, rate: 0.27 },
  { upTo: Infinity, rate: 0.13 },
] as const;

/** Monthly price in whole US$ for a monthly outreach-email volume. */
export function monthlyPriceUsd(emails: number): number {
  const volume = Number.isFinite(emails) ? Math.max(0, Math.min(emails, PRICING.maxEmails)) : 0;
  let price = 0;
  let from = 0;
  for (const band of VOLUME_BANDS) {
    if (volume <= from) break;
    price += (Math.min(volume, band.upTo) - from) * PRICE_PER_EMAIL_USD * band.rate;
    from = band.upTo;
  }
  return Math.round(Math.max(PRICING.baseUsd, price));
}
