import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing · SlideIn',
  description: 'The managed service: we run your outreach platform for $1,999 a month.',
};

/**
 * PRICING — a blank canvas.
 *
 * Everything that was rendered here (the PriceStatement band and the
 * RolesTable) is unmounted, not deleted: components/Pricing/ stays in the
 * codebase. The page keeps its route, its metadata and a full-viewport blank
 * band so it can be designed from scratch — the nav's "Pricing" item already
 * points here.
 */
export default function PricingPage() {
  return <div className="min-h-svh" />;
}
