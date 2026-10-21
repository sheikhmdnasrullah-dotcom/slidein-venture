/**
 * DELIVERY BLUEPRINT — phases 1 and 3 with every step visible.
 * Phase 2 is paused and not rendered. Original numbers are kept.
 */

export interface PhaseStep {
  no: string;
  name: string;
  detail: string;
}

export interface PhaseCopy {
  id: string;
  phase: string;
  name: string;
  timing: string;
  summary: string;
  steps: PhaseStep[];
  footnote?: string;
}

export const PHASES_A: PhaseCopy[] = [
  {
    id: 'phase-1',
    phase: 'Phase 1',
    name: 'Foundation and Infrastructure',
    timing: 'Days 1 to 3. Everything else depends on this.',
    summary:
      'We set up the technical base, research your market, write the playbook every later step runs from, hand over the live dashboard, and launch your brand presence.',
    steps: [
      { no: '1.1', name: 'Accounts and infrastructure setup', detail: 'Domain, business email, API keys, VPS, Zoom. Output: working technical base.' },
      { no: '1.2', name: 'Deep market research', detail: 'A multi step research pass on your business, market, and competitors. Output: market map.' },
      { no: '1.3', name: 'ICP base plus master playbook', detail: 'Research the Ideal Client Profile and write the master playbook. Output: the ICP plus the playbook every later step runs from.' },
      { no: '1.4', name: 'Agentic dashboard handoff', detail: 'Agents, tasks, leads, and meetings, all live in one place. Output: client visible dashboard.' },
      { no: '1.5', name: 'Social accounts plus brand kit', detail: 'Create and launch all needed social accounts with the full brand kit. Output: brand presence ready.' },
    ],
  },
  {
    id: 'phase-3',
    phase: 'Phase 3',
    name: 'Micro SaaS, the Free Tool',
    timing: 'Builds in parallel with phases 4 and 5.',
    summary:
      'A genuinely useful free tool that pulls ideal buyers into your orbit and identifies them.',
    steps: [
      { no: '3.1', name: 'Design and build the tool', detail: 'Formats: calculators, assessments and quizzes, ROI and cost calculators, comparison tools, planning tools, personalized recommendation tools, industry specific analyzers, generators and checklists.' },
      { no: '3.2', name: 'Offer it free', detail: 'LinkedIn content offers the free solution so people try it.' },
      { no: '3.3', name: 'Drive traffic', detail: 'Strong calls to action move interested prospects from LinkedIn to the web app.' },
      { no: '3.4', name: 'Capture the lead', detail: 'Contact email plus business and customer data collected with developer tools on landing.' },
      { no: '3.5', name: 'Research and intake signals', detail: 'Name, email, location, budget, needs, preferences, timeline, problem and interest, tool usage.' },
      { no: '3.6', name: 'Feed qualified leads into outreach', detail: 'The captured data personalizes the outreach.' },
    ],
  },
];
