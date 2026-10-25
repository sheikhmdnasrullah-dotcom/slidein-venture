import type { MetadataRoute } from 'next';
import { SITE_ORIGIN } from '@/lib/site';

/** robots.txt — everything crawlable, one sitemap pointer. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${SITE_ORIGIN}/sitemap.xml`,
  };
}
