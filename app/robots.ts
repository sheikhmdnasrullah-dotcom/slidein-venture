import type { MetadataRoute } from 'next';
import { SITE_ORIGIN } from '@/lib/site';

/** robots.txt: the public pages are crawlable; internal and duplicate routes are not. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/video-lab', '/design-system', '/journey-check', '/preview-managed', '/workspace', '/process-delivery', '/connect'],
    },
    sitemap: `${SITE_ORIGIN}/sitemap.xml`,
  };
}
