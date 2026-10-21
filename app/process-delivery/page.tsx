import type { Metadata } from 'next';

import { DELIVERY_META } from '@/content/process-delivery-a';
import { DeliveryClose, DeliveryHero } from '@/components/Delivery/DeliveryHeroClose';
import MachineDiagram from '@/components/Delivery/MachineDiagram';
import PhaseSections from '@/components/Delivery/PhaseSections';
import LeadFlow from '@/components/Delivery/LeadFlow';
import { ClientWork, Guardrails, Numbers, WhoFor } from '@/components/Delivery/DeliveryRest';

export const metadata: Metadata = {
  title: 'How We Build It · SlideIn',
  description: DELIVERY_META.description,
};

/**
 * DELIVERY BLUEPRINT — client facing walkthrough of the full workflow.
 * Content lives in content/process-delivery-a, process-phases-a/b,
 * process-sections-c/d. Phase 2 is paused and never rendered.
 */
export default function DeliveryPage() {
  return (
    <>
      <DeliveryHero />
      <MachineDiagram />
      <PhaseSections />
      <LeadFlow />
      <ClientWork />
      <WhoFor />
      <Numbers />
      <Guardrails />
      <DeliveryClose />
    </>
  );
}
