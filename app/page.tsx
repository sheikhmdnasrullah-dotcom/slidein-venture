import Hero from '@/components/Hero/Hero';
import ProblemSection from '@/components/Sections/ProblemSection';
import AgenticDashboardSection from '@/components/Sections/AgenticDashboardSection';
import CapabilitiesSection from '@/components/Sections/CapabilitiesSection';
import ManagedSection from '@/components/Sections/ManagedSection';
import ControlSection from '@/components/Sections/ControlSection';
import UseCasesSection from '@/components/Sections/UseCasesSection';
import ClosingSection from '@/components/Sections/ClosingSection';
import SiteFooter from '@/components/Sections/SiteFooter';

export default function Home() {
  return (
    <>
      <Hero />
      <ProblemSection />
      <AgenticDashboardSection />
      <CapabilitiesSection />
      <ManagedSection />
      <ControlSection />
      <UseCasesSection />
      <ClosingSection />
      <SiteFooter />
    </>
  );
}
