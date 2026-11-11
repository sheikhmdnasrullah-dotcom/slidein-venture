import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portfolio · SlideIn',
  description: 'Full podcast productions, guest appearances and short-form cuts.',
};

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
