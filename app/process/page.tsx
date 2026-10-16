import { Suspense } from 'react';
import type { Metadata } from 'next';
import ProcessDeck from '@/components/ProcessDeck/ProcessDeck';

export const metadata: Metadata = {
  title: 'Process · The Mortgage Growth System',
  description:
    'A complete 19-slide digital acquisition & email campaign presentation for mortgage companies: deliverability infrastructure, educational content engine, interactive resource hub, 5-touch email engine, and show-rate protected consultations.',
};

export default function ProcessPage() {
  return (
    <main className="w-full min-h-screen bg-[#f3f4f6]">
      <Suspense
        fallback={
          <div className="flex h-screen w-full items-center justify-center bg-[#f3f4f6]">
            <div className="flex flex-col items-center gap-3">
              <span className="h-6 w-6 rounded-full border-2 border-[#ea580c] border-t-transparent animate-spin" />
              <span className="font-mono text-[12px] font-bold text-[#525252] uppercase tracking-wider">
                Loading Growth System Presentation...
              </span>
            </div>
          </div>
        }
      >
        <ProcessDeck />
      </Suspense>
    </main>
  );
}
