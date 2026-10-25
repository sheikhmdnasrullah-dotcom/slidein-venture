import type { Metadata } from 'next';

/**
 * INSIGHTS — the article directory.
 *
 * Always a directory: the publication header, the featured spread and the
 * complete archive. The reader lives at /insights/[slug]; this page never
 * opens an article directly. Every article string comes out of
 * content/insights.ts; the one supporting line below the masthead is this
 * page's owner-approved metadata description, passed down so the visible
 * copy and the <meta> description can never drift apart.
 */

import InsightsIndex from '@/components/Insights/InsightsIndex';
import { getPublishedArticles } from '@/content/insights';
import { SITE_ORIGIN } from '@/lib/site';

const DESCRIPTION =
  'Architectural analysis, pipeline diagnostics, and strategic playbooks on content production and outreach systems.';

export const metadata: Metadata = {
  title: 'Insights · SlideIn Venture',
  description: DESCRIPTION,
  alternates: {
    canonical: `${SITE_ORIGIN}/insights`,
  },
  openGraph: {
    title: 'Insights · SlideIn Venture',
    description: DESCRIPTION,
    url: `${SITE_ORIGIN}/insights`,
    type: 'website',
  },
};

export default function InsightsPage() {
  return (
    <InsightsIndex
      articles={getPublishedArticles()}
      description={DESCRIPTION}
    />
  );
}
