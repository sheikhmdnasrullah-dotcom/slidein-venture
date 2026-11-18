import type { Metadata } from 'next';
import { TERMS_META } from '@/content/terms';
import TermsDocument from '@/components/Terms/TermsDocument';
import { SITE_ORIGIN } from '@/lib/site';

export const metadata: Metadata = {
  title: TERMS_META.title,
  description: TERMS_META.description,
  alternates: { canonical: `${SITE_ORIGIN}/terms` },
  openGraph: {
    title: TERMS_META.title,
    description: TERMS_META.description,
    url: `${SITE_ORIGIN}/terms`,
    type: 'website',
  },
};

export default function TermsPage() {
  return (
    <main>
      <TermsDocument />
    </main>
  );
}
