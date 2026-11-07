import { notFound } from 'next/navigation';
import AgenticDashboardSection from '@/components/Sections/AgenticDashboardSection';

// Verification route for the journey rework.
export default function JourneyCheck() {
  if (process.env.NODE_ENV === 'production') notFound();
  return (
    <main>
      <div style={{ height: '90vh' }} />
      <AgenticDashboardSection />
      <div style={{ height: '120vh' }} />
    </main>
  );
}
