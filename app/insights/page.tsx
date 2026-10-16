import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Insights · SlideIn',
  description:
    'Architectural analysis, pipeline diagnostics, and strategic playbooks on content production and outreach systems.',
};

/**
 * INSIGHTS — a blank canvas.
 *
 * The index page is blank by decision: the hero band and the article
 * directory that were rendered here are unmounted so the page can be
 * redesigned from scratch. NOTHING WAS DELETED — content/insights.ts still
 * holds every article in full (the referral-pipeline dispatch and any that
 * follow it), and the article routes at /insights/[slug] still render them.
 * The nav's "Insights" item already points here.
 */
export default function InsightsPage() {
  return <div className="min-h-svh" />;
}
