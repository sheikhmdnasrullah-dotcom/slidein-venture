import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Insights · SlideIn',
  description:
    'Architectural analysis, pipeline diagnostics, and strategic playbooks on content production and outreach systems.',
};

/**
 * INSIGHTS — the article directory.
 *
 * The index was previously a blank canvas: the article directory was
 * unmounted pending a redesign, which left the articles unreachable except
 * by typing their slug. The articles themselves were never at risk —
 * content/insights.ts holds every one in full and /insights/[slug] renders
 * them.
 *
 * ── WHAT IS ON THIS PAGE ───────────────────────────────────────────��──────
 * Every word here comes from content/insights.ts. The cards are composed
 * from fields that already existed in the data file and were previously only
 * used on the article page itself:
 *
 *   article.title          the headline, unedited
 *   article.topic          the topic line
 *   article.formattedDate  the date
 *   article.excerpt        the excerpt (first sentences of the article)
 *   article.sections.length + intro.length   the reading length, derived,
 *                                            never written
 *
 * There is deliberately no "Read more", no category label, no author byline
 * and no blurb written for the card — none of those strings exist in the
 * content file, and inventing them here would put words on the site that
 * nobody approved. The whole card is the link; the affordance is an arrow
 * glyph, not a label.
 *
 * The one chrome word is the page heading. It reuses the string already
 * present in the nav and in this page's metadata rather than introducing a
 * new one, and it is trivially changeable in JSX below.
 */

import Link from 'next/link';
import { ARTICLES } from '@/content/insights';
import InsightsIndex from '@/components/Insights/InsightsIndex';

export default function InsightsPage() {
  return <InsightsIndex articles={ARTICLES} />;
}