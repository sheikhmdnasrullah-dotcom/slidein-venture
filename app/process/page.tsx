import type { Metadata } from 'next';

import HowItWorks from '@/components/HowItWorks/HowItWorks';
import { ProcessStory } from '@/components/ProcessStory/ProcessStory';
import WorkflowSection from '@/components/Workflow/WorkflowSection';
import Planes from '@/components/Workflow/Planes';
import AgenticDashboardSection from '@/components/Sections/AgenticDashboardSection';

export const metadata: Metadata = {
  title: 'How it works · SlideIn',
  description: 'The complete step by step process for content production and outreach.',
};

/**
 * PROCESS — the eight-phase How It Works story first (moved here from the
 * home page unchanged), then the chapter story and the visuals below it.
 *
 * HowItWorks is a pinned, scroll-scrubbed section (its own ScrollTrigger
 * pin); ProcessStory's chapters use CSS sticky, not ScrollTrigger pins, so
 * the two cannot fight over the same pin. The component, its CSS, its
 * timeline and its copy are untouched by the move — only its mount point
 * changed.
 *
 * Below the story: the SlideIn loop visual (pinned rail + inspector) and
 * the six-planes architecture visual. Both render their own <section> shells
 * with their spacing; no wrapper styling needed.
 *
 * The agentic dashboard section (moved here from the home page; to be reworked
 * with the rest of this page) closes the page.
 *
 * The older step-frame build (components/Floating/ProcessSteps) stays in the
 * codebase unmounted.
 */

export default function ProcessPage() {
  return (
    <>
      <HowItWorks />
      <ProcessStory />
      <WorkflowSection />
      <Planes />
      <AgenticDashboardSection />
    </>
  );
}
