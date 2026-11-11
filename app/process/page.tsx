import type { Metadata } from 'next';

import ProcessTimeline from '@/components/ProcessBook/ProcessTimeline';

export const metadata: Metadata = {
  title: 'How it works · SlideIn',
  description: 'The complete step by step process for content production and outreach.',
};

/**
 * PROCESS — simplified. The scroll-scrubbed How It Works story stays at the
 * top; below it a plain read of the seven stages and the trust line, then
 * the closing call to action. The earlier chapter story, loop, planes and
 * dashboard sections are unmounted (files kept) because they were unfinished
 * skeleton frames.
 */
export default function ProcessPage() {
  return (
    <>
      <ProcessTimeline />
    </>
  );
}
