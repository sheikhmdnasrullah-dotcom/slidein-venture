import type { Metadata } from 'next';
import Section from '@/components/Section';
import ProcessFlowChart from '@/components/Process/ProcessFlowChart';

export const metadata: Metadata = {
  title: 'Process · SlideIn Venture',
  description: 'The complete step by step process for content production and outreach.',
};

export default function ProcessPage() {
  return (
    <div id="top">
      <Section tone="hero" pad="base" className="pt-[calc(96px+clamp(3rem,6vw,6rem))]">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <div className="flex flex-col items-center text-center">
            <span className="font-label mb-4 block text-[var(--accent)]">Process</span>
            <h1 className="font-display-xl max-w-[18ch] text-[clamp(2rem,5vw,3.5rem)] text-[var(--on-surface)]">
              The Complete Step by Step Process
            </h1>
            <p className="mt-4 max-w-[52ch] font-body text-[var(--muted)]">
              Two parallel tracks. Content ships every week while outreach builds in the background. Click to explore each stage.
            </p>
          </div>
        </div>
      </Section>

      <Section tone="base" pad="tall" seam>
        <ProcessFlowChart />
      </Section>
    </div>
  );
}
