import { notFound } from 'next/navigation';
import ManagedSection from '@/components/Sections/ManagedSection';

export const dynamic = 'force-dynamic';

export default function Preview() {
  if (process.env.NODE_ENV === 'production') notFound();
  return <ManagedSection />;
}
