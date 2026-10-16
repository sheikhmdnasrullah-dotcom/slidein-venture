import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How it works · SlideIn',
  description: 'The complete step by step process for content production and outreach.',
};

/**
 * HOW IT WORKS — a blank canvas.
 *
 * Everything that was rendered here (the ProcessFlowChart drawing, mounted
 * inside a hero band) is unmounted, not deleted: components/Process/ and the
 * content in content/steps/ stay in the codebase. The page keeps its route,
 * its metadata and a full-viewport blank band so it can be designed from
 * scratch — the nav's "How it works" item already points here.
 */
export default function ProcessPage() {
  return <div className="min-h-svh" />;
}
