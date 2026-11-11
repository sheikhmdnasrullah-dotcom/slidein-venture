import type { Metadata } from 'next';
import UseCasesSection from '@/components/Sections/UseCasesSection';

export const metadata: Metadata = {
  title: 'Use cases · SlideIn',
  description: 'How SlideIn fits each industry.',
};

/** USE CASES: its own page in the nav. One tile per industry; each opens a five-slide article. */
export default function UseCasesPage() {
  return (
    <>
      <div className="h-16" aria-hidden="true" />
      <UseCasesSection />
    </>
  );
}
