/** DELIVERY BLUEPRINT — phases 4, 5, 6 with every step visible. */
import type { PhaseCopy } from './process-phases-a';

export const PHASES_B: PhaseCopy[] = [
  {
    id: 'phase-4',
    phase: 'Phase 4',
    name: 'Lead Capture Website and Funnel',
    timing: 'Builds in parallel with phases 3 and 5.',
    summary: 'Say goodbye to the static website. This site is a capture asset.',
    steps: [
      { no: '4.1', name: 'Purpose built funnel site on a branded domain', detail: 'Not a brochure. A capture asset.' },
      { no: '4.2', name: 'Publish value content', detail: 'Articles, questions and answers, discussions, visual showcases, gated downloadable guides and checklists.' },
      { no: '4.3', name: 'Market the website', detail: 'Valuable LinkedIn content: educational posts, 10 things to know posts, industry insights, short guides, statistics, high quality visuals, problem solving content. Punch line posts drive clicks to the full piece on the site.' },
      { no: '4.4', name: 'Visitor deanonymization', detail: 'A system that identifies visiting companies and captures contact data, with browser cookies.' },
      { no: '4.5', name: 'Lead capture agent in dashboard', detail: 'Deanonymized visitors are researched, matched against the ICP, and fed into the CRM.' },
      { no: '4.6', name: 'Embedded booking calendar', detail: 'Prospects book directly on the site.' },
      { no: '4.7', name: 'Chatbot plus knowledge base', detail: 'Embedded on the website and the free tool. It qualifies visitors and books meetings. The knowledge base is built from the actual offer and FAQs.' },
    ],
  },
  {
    id: 'phase-5',
    phase: 'Phase 5',
    name: 'Outreach Infrastructure and Execution',
    timing: 'Builds in parallel with phases 3 and 4.',
    summary: 'This is the engine room. Sending is private, verified, and warmed before it ever touches a prospect.',
    steps: [
      { no: '5.1', name: 'Dedicated outreach domains', detail: 'Close variants of your brand, registered separately.' },
      { no: '5.2', name: 'SPF, DKIM, DMARC configuration', detail: 'Authentication on every sending domain before the first send.' },
      { no: '5.3', name: 'Mailbox warm up schedule', detail: 'Ramp from low volume. Sending is held if bounce, complaint, or reply quality degrades.' },
      { no: '5.4', name: 'Mail campaigns from the private sending system', detail: 'A reputable private server, engineered for authentication and inbox placement.' },
      { no: '5.5', name: 'Social selling', detail: 'Active group discussions, LinkedIn copywriting, Facebook and Instagram posting, connection growth plus DM outreach to convert to meetings.' },
    ],
    footnote:
      'Sending note: a private sending system engineered for authentication and inbox placement.',
  },
  {
    id: 'phase-6',
    phase: 'Phase 6',
    name: 'Meeting Booking, Confirmation and Show Rate',
    timing: 'Where the parallel builds converge.',
    summary: 'Leads become held meetings. Every meeting arrives with context, and no missed meeting is a lost lead.',
    steps: [
      { no: '6.1', name: 'Context handoff', detail: 'A brief on the prospect and their signals lands before every meeting.' },
      { no: '6.2', name: 'One click reschedule link', detail: 'Protects the meeting when calendars move.' },
      { no: '6.3', name: 'No show recovery', detail: 'A defined sequence so a missed meeting is not a lost lead.' },
    ],
  },
];
