import type { Metadata } from 'next';

import { ProcessSteps } from '@/components/Floating/ProcessSteps';

export const metadata: Metadata = {
  title: 'How it works · SlideIn',
  description: 'The complete step by step process for content production and outreach.',
};

/**
 * HOW IT WORKS — four step frames with floating props.
 *
 * Each step is a minimal structural frame (marker + empty scene panel) with
 * config-driven floating props in its gutters and one traveling tile riding
 * the left rail. No step names, no copy, no digits anywhere in the new
 * objects — the frames stay pristine until real content exists.
 *
 * The older unmounted design (components/Process/, content/steps/) stays in
 * the codebase untouched.
 */
export default function ProcessPage() {
  return <ProcessSteps />;
}
