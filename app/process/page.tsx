import type { Metadata } from 'next';

import { ProcessStory } from '@/components/ProcessStory/ProcessStory';
import WorkflowSection from '@/components/Workflow/WorkflowSection';
import Planes from '@/components/Workflow/Planes';

export const metadata: Metadata = {
  title: 'How it works · SlideIn',
  description: 'The complete step by step process for content production and outreach.',
};

/**
 * HOW IT WORKS — a textless story: crowd, spine, four pinned chapters,
 * handoff zones, recap. All copy slots live in content/process.ts as empty
 * strings and render as skeleton bars until text exists.
 *
 * Below the story: the SlideIn loop visual (pinned rail + inspector) and
 * the six-planes architecture visual. Both render their own <section> shells
 * with their spacing; no wrapper styling needed.
 *
 * The older step-frame build (components/Floating/ProcessSteps) stays in the
 * codebase unmounted.
 */
export default function ProcessPage() {
  return (
    <>
      <ProcessStory />
      <WorkflowSection />
      <Planes />
    </>
  );
}
