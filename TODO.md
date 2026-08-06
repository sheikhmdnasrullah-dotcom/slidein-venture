# TODO: Redesign Process Modals with Toggle Navigation

## Steps
- [x] Update `content/steps/outreach-phases.ts` — renumber phase 1 steps sequentially (remove 1.2b)
- [x] Create `components/Process/FlipCard.tsx` — reusable 3D flip card for outreach steps
- [x] Create `components/Process/OutreachProcessModal.tsx` — unified carousel for 4 outreach phases
- [x] Create `components/Process/ContentProcessModal.tsx` — unified carousel for 4 content phases
- [x] Update `components/Process/ProcessFlowChart.tsx` — use 2 unified modals
- [ ] Verify all 8 buttons open slides with content fully on screen, arrows navigate correctly (blocked: node_modules missing, npm unavailable)
- [x] Explore files (ProcessFlowChart, DistributionSlide, Solutions page)
- [x] Create `components/Process/DistributionModal.tsx` (16:9 slide, merged distribution system + dashboard, scrolling reveal animation)
- [x] Wire `distributionOpen` state & button in `ProcessFlowChart.tsx`
- [x] Render `<DistributionModal>` in ProcessFlowChart
- [x] Verify with build/dev server
- [x] Create 16:9 outreach slide modals for The Infrastructure, The Fuel, The Script, The Launch importing steps-page proof artifacts (DnsRecordCard, LeadCard, EmailProvenance, MetricsPanel)
