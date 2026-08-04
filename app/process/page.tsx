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
        <ProcessFlowChart />
      </Section>
    </div>
  );
}
