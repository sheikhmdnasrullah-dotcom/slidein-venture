import type { Metadata } from 'next';
import ContactSurface from '@/components/Contact/ContactSurface';

export const metadata: Metadata = {
  title: "Let's Talk · SlideIn Venture",
  description: 'Book a call, or just email — whichever is easier.',
};

export default function ContactPage() {
  return (
    <div>
      <ContactSurface />
    </div>
  );
}
