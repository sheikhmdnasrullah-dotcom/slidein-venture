/** DELIVERY BLUEPRINT — lead flow, client work, audiences, numbers. */

export const LEAD_FLOW = {
  eyebrow: 'The 8 step lead flow',
  title: 'Two funnels. One outreach engine.',
  lead: 'The free tool path and the website path run side by side. Both converge into outreach, then into held meetings.',
  freeToolPath: {
    label: 'Free tool path, Phase 3',
    steps: [
      { no: '1', text: 'Create valuable LinkedIn content that attracts the ICP.' },
      { no: '2', text: 'Drive traffic. Punch line posts move prospects to the web app.' },
      { no: '3', text: 'Capture the lead. Email plus business data at signup.' },
      { no: '4', text: 'Research and intake signals. Budget, needs, timeline, tool usage.' },
      { no: '5', text: 'Feed qualified leads into personalized outreach.' },
    ],
  },
  websitePath: {
    label: 'Website path, Phase 4',
    steps: [
      { no: '1', text: 'Create valuable LinkedIn content that attracts the ICP.' },
      { no: '2', text: 'Drive traffic. Punch line posts move prospects to the website.' },
      { no: '6', text: 'Capture the lead. Deanonymization plus lead capture agent.' },
      { no: '7', text: 'Research leads and match against the ICP.' },
      { no: '8', text: 'Feed qualified leads into the CRM for personalized outreach.' },
    ],
  },
  convergeNote: 'Both paths converge into Phase 5 outreach, and Phase 6 converts to held meetings.',
} as const;

export const CLIENT_WORK = {
  eyebrow: 'What the client does',
  title: 'Three moments are yours. The rest is us.',
  lead: 'Twenty eight steps. Three of them are yours.',
  moments: [
    { no: '01', name: 'Confirm the ICP', detail: 'Tell us who to reach. We research the profile and write the playbook from it.' },
    { no: '02', name: 'Approve the batch', detail: 'Approve the publish and send batch in the dashboard. Nothing sends without your approval.' },
    { no: '03', name: 'Recording, paused for now', detail: 'The weekly recording session is paused while the Content Engine is paused. No camera time is needed to run the current machine.' },
  ],
  slideinNote:
    'Everything else is SlideIn: all infrastructure, all research, all execution across phases 1, 3, 4, 5, and 6.',
} as const;

export const WHO_FOR = {
  eyebrow: 'Who it is for',
  title: 'Built for businesses with a findable buyer.',
  audiences: [
    { no: '01', name: 'B2B software companies', detail: 'Buyers found by research, not ads. Triggers like hiring, tooling changes, and funding.' },
    { no: '02', name: 'Specialized business service firms', detail: 'Advisory, accounting, insurance. Buyers are a defined, findable list.' },
    { no: '03', name: 'Executive mortgage advisors', detail: 'Loan officers whose referral pipeline softens with the season.' },
  ],
  icpTitle: 'The ICP bar',
  icpLead: 'Seven of ten criteria to qualify. We confirm this with you before anything builds.',
  icpCriteria: [
    'Company size 20 to 200',
    'Revenue band stated',
    'Industry in scope',
    'Decision maker role',
    'Geography in scope',
    'Tooling detected',
    'Hiring signal in the last 90 days',
    'Funding stage in scope',
    'Publishes content regularly',
    'Buying trigger in the last 30 days',
  ],
  icpThreshold: '7 of 10 to qualify',
} as const;
