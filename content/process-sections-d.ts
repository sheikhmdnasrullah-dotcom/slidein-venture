/** DELIVERY BLUEPRINT — numbers, guardrails, close. */

export interface Benchmark {
  metric: string;
  value: string;
  provenance: 'BENCHMARK' | 'TARGET' | 'POLICY';
}

export const NUMBERS = {
  eyebrow: 'The numbers',
  title: 'Targets with labels. Benchmarks with labels.',
  lead: 'Every number below carries its provenance. A benchmark describes the market. A target is what we aim the machine at. A policy is how we work.',
  benchmarks: [
    { metric: 'Cold email campaigns that fail', value: '95 percent', provenance: 'BENCHMARK' },
    { metric: 'Reply rate', value: '5 to 8 percent', provenance: 'TARGET' },
    { metric: 'Positive reply rate', value: '1 to 2 percent', provenance: 'TARGET' },
    { metric: 'Bounce rate ceiling', value: 'Under 2 percent', provenance: 'TARGET' },
    { metric: 'Spam complaint ceiling', value: 'Under 0.3 percent', provenance: 'BENCHMARK' },
    { metric: 'Open rate', value: 'Deliberately not tracked', provenance: 'POLICY' },
  ] as Benchmark[],
  policyNote:
    'Open rate is deliberately not tracked. Tracking pixels count machines, not people. We aim at replies, not opens.',
} as const;

export const GUARDRAILS = {
  eyebrow: 'Guardrails',
  title: 'Nothing sends until three things are true.',
  rule: 'Nothing sends until authentication is verified, the list is clean, and a person has approved the batch.',
  points: [
    'Authentication is verified: SPF, DKIM, and DMARC on every sending domain.',
    'The list is clean: bounce under 2 percent, spam complaints under 0.3 percent.',
    'A person has approved the batch: your approval in the dashboard.',
  ],
} as const;

export const CLOSE = {
  eyebrow: 'Two ways to engage',
  title: 'Run it yourself, or have us run it.',
  options: [
    { no: '01', name: 'Self hosted, open source, free', detail: 'You operate the workflow inside the platform yourself. Same controls, same review step, same records.' },
    { no: '02', name: 'Managed service, 1999 dollars per month', detail: 'Our team configures and operates the whole machine for you. Today the platform is operated by our team as part of the managed service. Direct access is being rolled out, and a walkthrough covers what is open now.' },
  ],
  ctaLabel: 'Book a walkthrough',
  ctaNote: 'A live walkthrough of the machine, phase by phase, on a video call.',
} as const;
