import Hero from '@/components/Hero/Hero';
import ProblemSection from '@/components/Sections/ProblemSection';
import WorkflowSection from '@/components/Sections/WorkflowSection';
import LoopWorkflow from '@/components/Workflow/WorkflowSection';
import Planes from '@/components/Workflow/Planes';

export default function Home() {
  return (
    <>
      <Hero />
      <ProblemSection />
      <WorkflowSection />
      <LoopWorkflow />
      <Planes />
    </>
  );
}
