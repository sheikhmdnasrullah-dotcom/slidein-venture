import type { Metadata } from 'next';
import { META, STATEMENT } from '@/content/pricing';

export const metadata: Metadata = {
  title: META.title,
  description: META.description,
};

export default function PricingPage() {
  return (
    <main className="min-h-svh">
      <section className="mx-auto flex min-h-svh w-full max-w-[900px] flex-col items-center justify-center px-6 text-center md:px-10">
        <p className="font-display-xl max-w-[32ch] text-[clamp(2.2rem,5.4vw,4.1rem)] leading-[1.1] text-[var(--on-surface)]">
          {STATEMENT}
        </p>
      </section>
    </main>
  );
}
