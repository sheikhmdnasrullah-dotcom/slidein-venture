import type { Metadata } from 'next';
import ContactSurface from '@/components/Contact/ContactSurface';

export const metadata: Metadata = {
  title: 'Book a walkthrough · SlideIn Venture',
  description: 'A walkthrough covers how the workflow would run for your business.',
};

export default function ContactPage() {
  return (
    <div>
      <ContactSurface />
    </div>
  );
}
