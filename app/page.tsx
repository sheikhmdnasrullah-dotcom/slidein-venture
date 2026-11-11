import Hero from '@/components/Hero/Hero';
import ProblemSection from '@/components/Sections/ProblemSection';
import WorkflowStages from '@/components/Sections/WorkflowStages';
import UseCasesTeaser from '@/components/Sections/UseCasesTeaser';
import DashboardShowcase from '@/components/Sections/DashboardShowcase';
import ServerBoundarySection from '@/components/Sections/ServerBoundarySection';
import ClosingLoop from '@/components/Sections/ClosingLoop';

/* THE STORY, in order:
   1  Hero            what it is
   2  Playbook        it starts with preparation
   3  Seven steps     then it runs, one person at a time
   4  Who it's for    is this for me
   5  Dashboard       and you stay in control
   6  Privacy         and your data never leaves
   7  Closing loop    every run feeds the next, and how to start */
export default function Home() {
  return (
    <>
      <Hero />
      <ProblemSection />
      <WorkflowStages />
      <UseCasesTeaser />
      <DashboardShowcase />
      <ServerBoundarySection />
      <ClosingLoop />
    </>
  );
}
