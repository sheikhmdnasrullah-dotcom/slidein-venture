export const business = {
  name: "Tidewater Creative",
  line: "Video editing for B2B SaaS teams",
  offers: ["Short-form clips", "Podcast to shorts", "Launch videos"],
  icp: ["B2B software", "10 to 50 people", "Publishes a podcast or webinars", "US, UK, Canada"],
  profile: "Profile v3",
};

export const sources = ["csv", "directory", "conference"];

export const rawRecords = [
  { name: "Priya Raman", title: "Head of Marketing", org: "Calloway Systems", source: "csv", meta: "imported Oct 12 · row 214" },
  { name: "P. Raman", title: "Marketing Lead", org: "calloway.io", source: "directory", meta: "lookup" },
  { name: "Daniel Reyes", title: "Founder", org: "Fernhill AI", source: "conference", meta: "attendee list" },
];

export const findings = [
  { id: "F1", text: "Hosts a weekly podcast", source: "calloway.io/podcast", sourced: true },
  { id: "F2", text: "Episode 41: moving off spreadsheets", source: "calloway.io/podcast/41", sourced: true },
  { id: "F3", text: "Team of 38", source: "calloway.io/about", sourced: true },
  { id: "X1", text: "Raised a Series B", source: null, sourced: false },
];

export const criteria = [
  { label: "B2B software", pass: true, value: "yes" },
  { label: "10 to 50 people", pass: true, value: "38" },
  { label: "Publishes a podcast", pass: true, value: "weekly" },
  { label: "Target region", pass: true, value: "US" },
  { label: "Budget signal", pass: null, value: "unknown" },
];

export const match = {
  offer: "Podcast to shorts",
  reasons: ["Weekly podcast found", "38 people, inside 10 to 50", "Offer fits podcast publishers"],
};

export const email = {
  to: "priya@calloway.io",
  subject: "Three clips from episode 41",
  lines: [
    "Hi Priya,",
    "I've been listening to your weekly podcast, and episode 41 on moving off spreadsheets stayed with me.",
    "We turn podcast episodes into short clips your team can post the same week.",
    "Want me to cut three from episode 41?",
    "Sam, Tidewater Creative",
  ],
  personalized: [
    { span: "weekly podcast", finding: "F1" },
    { span: "episode 41 on moving off spreadsheets", finding: "F2" },
  ],
};

export const checks = ["Verify", "Deliver", "Placement", "Circuit", "Suppress", "Relay", "Inbox"];
export const warmup = { label: "Warmup", y: 330 };
export const held = { who: "Marcus Webb", reason: "Address failed verification" };

export const replies = [
  { from: "Priya Raman", text: "Sounds good, send the three clips.", intent: "Interested" },
  { from: "Daniel Reyes", text: "Please take me off your list.", intent: "Opt-out" },
];
export const intents = ["Interested", "Objection", "Away", "Opt-out"];

export const ledger = [
  ["08:02", "Profile v3 saved"],
  ["08:03", "2 records merged (csv, directory)"],
  ["08:05", "3 findings linked to sources"],
  ["08:06", "Matched: Podcast to shorts"],
  ["08:07", "Draft created: Priya Raman"],
  ["08:09", "Held: address failed verification"],
  ["08:41", "Reply classified: Interested"],
  ["09:12", "Suppressed: daniel@fernhill.ai"],
];

export const overview = {
  window: "Last 30 days, sample data",
  sentVsHeld: { sent: 214, held: 9 },
  intents: { Interested: 18, Objection: 11, Away: 7, "Opt-out": 6 },
  sources: { csv: 52, directory: 31, conference: 17 },
};
