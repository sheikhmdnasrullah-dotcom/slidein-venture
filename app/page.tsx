import Hero from '@/components/Hero/Hero';
import ProblemSection from '@/components/Sections/ProblemSection';
import WorkflowStages from '@/components/Sections/WorkflowStages';
import ServerBoundarySection from '@/components/Sections/ServerBoundarySection';
import SiteFooter from '@/components/Sections/SiteFooter';

/* Headline, then the playbook it all starts from, then the seven stages one
   by one, then where it runs. */
export default function Home() {
  return (
    <>
      <Hero />
      <ProblemSection />
      <WorkflowStages />
      <ServerBoundarySection />
      <SiteFooter />
    </>
  );
}
