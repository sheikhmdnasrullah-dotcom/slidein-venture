import type { MetadataRoute } from 'next';
import { getPublishedArticles } from '@/content/insights';
import { SITE_ORIGIN } from '@/lib/site';

/**
 * SITEMAP — every public route, plus one entry per published article.
 *
 * Drafts never appear: getPublishedArticles filters them, so an unfinished
 * article cannot be indexed before it ships. Article lastModified is the
 * publication date (or updatedAt when the piece has been revised) — the
 * content file owns both values.
 *
 * Internal verification routes (/journey-check, /preview-managed,
 * /video-lab) are tooling, not public pages, and are deliberately absent.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { path: '', changeFrequency: 'weekly', priority: 1 },
    { path: '/process', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/insights', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/pricing', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/portfolio', changeFrequency: 'monthly', priority: 0.6 },
    { path: '/contact', changeFrequency: 'yearly', priority: 0.6 },
    { path: '/connect', changeFrequency: 'yearly', priority: 0.6 },
  ].map(({ path, changeFrequency, priority }) => ({
    url: `${SITE_ORIGIN}${path}`,
    lastModified: new Date(),
    changeFrequency: changeFrequency as MetadataRoute.Sitemap[number]['changeFrequency'],
    priority,
  }));

  const articleRoutes: MetadataRoute.Sitemap = getPublishedArticles().map(
    (article) => ({
      url: `${SITE_ORIGIN}/insights/${article.slug}`,
      lastModified: new Date(article.updatedAt ?? article.date),
      changeFrequency: 'monthly',
      priority: 0.7,
    }),
  );

  return [...staticRoutes, ...articleRoutes];
}
