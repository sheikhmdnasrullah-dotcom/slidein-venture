import type { Metadata } from 'next';
import ContactSurface from '@/components/Contact/ContactSurface';

export const metadata: Metadata = {
  title: 'Connect · SlideIn',
  description: 'Connect with SlideIn Venture.',
  alternates: { canonical: '/contact' },
  robots: { index: false, follow: true },
};

export default function ConnectPage() {
  return <ContactSurface />;
}
