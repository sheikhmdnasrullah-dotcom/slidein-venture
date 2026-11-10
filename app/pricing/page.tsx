import type { Metadata } from 'next';
import { META } from '@/content/pricing';
import VolumePrice from '@/components/Pricing/VolumePrice';

export const metadata: Metadata = {
  title: META.title,
  description: META.description,
};

export default function PricingPage() {
  return (
    <main className="min-h-svh">
      <section className="mx-auto flex min-h-svh w-full max-w-[900px] flex-col items-center justify-center px-6 text-center md:px-10">
        <VolumePrice />
      </section>
    </main>
  );
}
