import type { Metadata } from 'next';
import UseCasesSection from '@/components/Sections/UseCasesSection';
import SiteFooter from '@/components/Sections/SiteFooter';

export const metadata: Metadata = {
  title: 'Use Cases · SlideIn',
  description: 'How SlideIn fits each industry.',
};

/** USE CASES: its own page in the nav. One tile per industry; each opens a five-slide article. */
export default function UseCasesPage() {
  return (
    <>
      <div className="h-16" aria-hidden="true" />
      <UseCasesSection />
      <SiteFooter />
    </>
  );
}
