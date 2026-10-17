import type { Metadata } from 'next';
import ContactSurface from '@/components/Contact/ContactSurface';

export const metadata: Metadata = {
  title: 'Connect · SlideIn',
  description: 'Connect with SlideIn Venture.',
};

export default function ContactPage() {
  return (
    <div>
      <ContactSurface />
    </div>
  );
}
