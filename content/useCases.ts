/**
 * USE CASES: one short slide article per industry.
 * ---------------------------------------------------------------------------
 * Each article is four 16:9 slides that follow SlideIn's real workflow
 * (Business Playbook / knowledge.md):
 *   1. Why it fits      the situation in this industry, plus one sourced fact
 *   2. Read + research  SlideIn reads the records the business already holds,
 *                       inside its own server, then researches one person:
 *                       public presence and buying behaviour for businesses
 *                       that sell to companies or the public; for banks,
 *                       hospitals and other regulated businesses only what the
 *                       customer does with that business, with consent
 *   3. Match            it pairs that person's need and intent with an offer
 *                       the business really has; people who don't fit get
 *                       nothing
 *   4. Write + send     one email built on that intent, checked, sent from the
 *                       business's own domain once the campaign is approved
 *
 * Rules held from knowledge.md: the client approves each campaign (never "a
 * person approves every email"); SlideIn never makes credit decisions; no
 * promised results. Every fact carries its source and year. Names, places and
 * figures inside example emails are illustrations. No em dashes anywhere.
 */

export type Fact = {
  /** The headline figure, shown large. */
  stat: string;
  /** One plain sentence saying what the figure means. */
  text: string;
  /** Publisher and year, shown under the fact. */
  source: string;
  url: string;
};

export type UseCase = {
  slug: string;
  name: string;
  /** Slide 1: two or three plain sentences about the situation. */
  situation: string;
  fact?: Fact;
  /** Slide 2: records the business already holds. */
  data: string[];
  /** Slide 2: how SlideIn researches one person in this industry. */
  research: string;
  /** Slide 3: one worked example. */
  person: { who: string; signals: string[]; offer: string };
};

export const USE_CASES_TITLE = "Use Cases";

/** Slide titles, in order. */
export const SLIDE_TITLES = [
  "Why it fits",
  "It reads, then researches",
  "It matches need to offer",
  "It writes the email",
  "It sends it, safely",
] as const;

/** The rules that hold for every industry, shown on the last slide. */
export const SEND_RULES = [
  "Runs inside your own server. Your data stays with you.",
  "Writes only to people who agreed to hear from you, with a one-click opt-out.",
  "You approve each campaign. Every email is checked before it goes out.",
  "Sent slowly from your own domain, and it pauses itself if complaints rise.",
  "Replies go straight to the right person on your team, the same day.",
] as const;

export const USE_CASES: UseCase[] = [
  {
    slug: "us-home-lenders",
    name: "US home lenders",
    situation:
      "When rates move, your borrowers start shopping. Most of them end up refinancing with someone else, even though you already knew they were looking.",
    fact: {
      stat: "32%",
      text: "of refinancing borrowers stayed with their mortgage servicer in early 2026. The rest went elsewhere.",
      source: "ICE Mortgage Monitor, Q1 2026",
      url: "https://www.mortgagenewsdaily.com/news/05152026-service-retention-ice-mortgage-monitor",
    },
    data: ["Loan files and current rates", "Refinance calculator visits", "Applications that stopped halfway", "Loan anniversaries"],
    research:
      "For each borrower, SlideIn checks their public presence for a life change that matters to a loan: a new job, a bigger family, a home they listed.",
    person: {
      who: "Sarah, a borrower in Ohio",
      signals: ["Used your refinance calculator three times this week", "Her loan is four years old", "Recently posted about a new job"],
      offer: "A rate-and-term refinance review",
    },
  },
  {
    slug: "mortgage-brokers",
    name: "Mortgage brokers",
    situation:
      "You know every client's deal. What slips is the timing. A term ends, a client moves on, and the first person they hear from is a lender's mass email.",
    fact: {
      stat: "65%",
      text: "of UK mortgage holders said they could not have bought their home without a broker.",
      source: "Mortgage Solutions, December 2025",
      url: "https://www.mortgagesolutions.co.uk/news/2025/12/10/nearly-two-thirds-of-borrowers-say-brokers-are-vital-to-get-through-home-buying-process-survey-finds/",
    },
    data: ["Your CRM and past deals", "Fixed-term end dates", "Lender panel and current products", "Notes from client calls"],
    research:
      "SlideIn looks at each client's public presence for changes a lender would care about: a move, a new business, a second property.",
    person: {
      who: "David, a past client",
      signals: ["His fixed term ends in March", "He registered a new limited company last month", "He asked about buy-to-let on your last call"],
      offer: "A remortgage plus a buy-to-let conversation",
    },
  },
  {
    slug: "mid-sized-companies",
    name: "Mid-sized companies",
    situation:
      "You have a product, a customer list and a few offers. You don't have the hours to write to each customer properly, so everyone gets the same newsletter.",
    fact: {
      stat: "71%",
      text: "of consumers expect companies to deliver personalized interactions, and 76% get frustrated when it doesn't happen.",
      source: "McKinsey & Company, 2021",
      url: "https://www.mckinsey.com/capabilities/growth-marketing-and-sales/our-insights/the-value-of-getting-personalization-right-or-wrong-is-multiplying",
    },
    data: ["Customer and account records", "Purchase history", "Product usage", "Support tickets"],
    research:
      "SlideIn looks up each customer's company and role in public: hiring, new offices, launches, recent news.",
    person: {
      who: "Priya, operations lead at a client company",
      signals: ["Her team opened a second office this month", "Seat count up 40% since spring", "Two support tickets about user setup"],
      offer: "The multi-site admin add-on",
    },
  },
  {
    slug: "insurance-agencies",
    name: "Insurance agencies",
    situation:
      "Life changes are when cover stops fitting. A new house, a new driver, a new business. Your clients rarely call to tell you, but they do shop around.",
    fact: {
      stat: "57%",
      text: "of auto insurance customers shopped for a new policy in 2025, a record high.",
      source: "J.D. Power U.S. Insurance Shopping Study, 2025",
      url: "https://kiplinger.com/personal-finance/car-insurance/jdpower-car-insurance-study",
    },
    data: ["Policies and renewal dates", "Claims history", "Household details clients shared", "Quotes that never closed"],
    research:
      "SlideIn checks each client's public presence for a life change: a home they bought, a new business, a teenager who just started driving.",
    person: {
      who: "Maria, a client for six years",
      signals: ["Her home policy renews on the 14th", "Her address changed on a public record", "She added a teenage driver last month"],
      offer: "A combined home and auto review",
    },
  },
  {
    slug: "real-estate-firms",
    name: "Real estate firms",
    situation:
      "Buyers and sellers leave signals everywhere: saved searches, viewings, a listing gone quiet. Your agents can't follow every one by hand.",
    fact: {
      stat: "88%",
      text: "of US home buyers worked with an agent, and 91% of them would recommend that agent.",
      source: "NAR Profile of Home Buyers and Sellers, 2025",
      url: "https://www.nar.realtor/newsroom/first-time-home-buyer-share-falls-to-historic-low-of-21-median-age-rises-to-40",
    },
    data: ["Leads and enquiries", "Saved searches and viewings", "Past clients and sale dates", "Current listings"],
    research:
      "SlideIn looks at each person's public presence for intent: a job move to the area, a growing family, a home they listed with someone else.",
    person: {
      who: "James and Lena, buyers",
      signals: ["Saved two homes near Oak Park last month", "Asked about gardens on a viewing", "James started a job nearby in September"],
      offer: "A new 3-bed listing near Oak Park",
    },
  },
  {
    slug: "e-commerce-brands",
    name: "E-commerce brands",
    situation:
      "Your store already knows who browsed, who bought and who left something in the cart. Then the same sale email goes to all of them.",
    fact: {
      stat: "70.22%",
      text: "of online shopping carts are abandoned before checkout, averaged across 50 studies.",
      source: "Baymard Institute, 2025",
      url: "https://baymard.com/lists/cart-abandonment-rate",
    },
    data: ["Orders and returns", "Carts and wishlists", "Browsing on your store", "Reviews customers left"],
    research:
      "SlideIn studies each shopper's buying behaviour and the public reviews they've written to understand their taste and size.",
    person: {
      who: "Tom, a repeat customer",
      signals: ["Left the olive jacket in medium in his cart", "Bought two jackets from you last winter", "Reviewed one as 'runs small'"],
      offer: "The olive jacket, back in stock, sized up",
    },
  },
  {
    slug: "tech-startups",
    name: "Tech startups",
    situation:
      "Signups come in, and most go quiet before they pay. Each one stopped for a reason, and the reason is usually sitting in your product data.",
    fact: {
      stat: "18%",
      text: "is a common benchmark for B2B trials that convert to paid when no card is asked for upfront.",
      source: "First Page Sage, 2025",
      url: "https://userpilot.com/blog/free-trial-conversion-rate/",
    },
    data: ["Signups and trial data", "Product events", "Plan history", "Support threads"],
    research:
      "SlideIn looks up each user's company and role in public to understand what they're building and why they signed up.",
    person: {
      who: "Leo, CTO at a 20-person agency",
      signals: ["Started a data import on Tuesday and stopped at step two", "His agency just announced a CRM migration", "Trial ends in five days"],
      offer: "Guided import plus a trial extension",
    },
  },
  {
    slug: "corporate-agencies",
    name: "Corporate agencies",
    situation:
      "Clients stay with agencies that remember them. After a project ends, most clients only hear from you again when you need something.",
    fact: {
      stat: "61%",
      text: "of B2B buyers prefer to buy without talking to a sales rep. They want useful information, not pressure.",
      source: "Gartner, June 2025",
      url: "https://www.gartner.com/en/newsroom/press-releases/2025-06-25-gartner-sales-survey-finds-61-percent-of-b2b-buyers-prefer-a-rep-free-buying-experience",
    },
    data: ["Client accounts and contracts", "Past projects and results", "Meeting notes", "Contract end dates"],
    research:
      "SlideIn follows each client's public news: product launches, funding, new leadership, new markets.",
    person: {
      who: "A retail client you ran a campaign for in spring",
      signals: ["Announced a new product line this week", "Your spring campaign wrapped last month", "Their new marketing head started in October"],
      offer: "A launch campaign for the new line",
    },
  },
  {
    slug: "commercial-banks",
    name: "Commercial banks",
    situation:
      "Business clients hold several products with you, but each team sees only its own. So the payroll team never learns the client just hired fifty people.",
    fact: {
      stat: "0.3%",
      text: "is the spam complaint rate Google and Yahoo tell bulk senders to stay under. Mass email to everyone puts that at risk.",
      source: "Google and Yahoo sender requirements, 2024",
      url: "https://help.close.com/docs/requirements-for-bulk-email-senders",
    },
    data: ["Accounts and product holdings", "Transaction patterns", "Relationship manager notes", "Contact consent"],
    research:
      "Running on your own servers, SlideIn reviews each business client's public footprint: expansion, hiring, new markets. Customer data never leaves your bank.",
    person: {
      who: "A garment exporter banking with you",
      signals: ["Payroll runs doubled since spring", "Opened a second factory, per public filings", "Pays suppliers abroad every month"],
      offer: "Payroll automation and trade services. SlideIn never makes credit decisions.",
    },
  },
  {
    slug: "national-banks",
    name: "National banks",
    situation:
      "Millions of customers, many products, and most people only ever hear from you in bulk. A student gets the same car-loan email as a business owner.",
    fact: {
      stat: "2025",
      text: "Bangladesh's Personal Data Protection Ordinance made explicit consent the rule, and keeps confidential data inside the country.",
      source: "The Daily Star, 2025",
      url: "https://www.thedailystar.net/tech-startup/news/bangladeshs-personal-data-protection-ordinance-2025-key-takeaways-4015401",
    },
    data: ["Core banking records", "Product holdings", "App, card and branch activity", "Consent records"],
    research:
      "SlideIn looks only at what each customer does with your bank, with their consent: app, card, website and branch. It never tracks people across the internet.",
    person: {
      who: "A salaried customer in Dhaka",
      signals: ["Checked car loans around Tk 15 lakh last week", "Salary has arrived on time for a year", "Agreed to product emails"],
      offer: "A car loan conversation, and nothing else",
    },
  },
  {
    slug: "mfs-providers",
    name: "MFS providers",
    situation:
      "Every top-up, transfer and bill payment shows what a user needs next. Most users still only get promo SMS that has nothing to do with their habits.",
    fact: {
      stat: "89M",
      text: "active mobile financial service accounts in Bangladesh as of January 2025.",
      source: "Future Startup, May 2025",
      url: "https://futurestartup.com/2025/05/06/the-state-of-mobile-financial-services-mfs-industry-in-bangladesh/",
    },
    data: ["Transactions and top-ups", "Bill payments", "Merchant payments", "Consent records"],
    research:
      "SlideIn studies each user's routine inside your app, and only that, to find a feature that would save them time or money.",
    person: {
      who: "Rina, a user in Chattogram",
      signals: ["Pays the same electricity bill by hand every month", "Pays a day late about half the time", "Has never used scheduled payments"],
      offer: "Scheduled bill payments",
    },
  },
  {
    slug: "consumer-lenders",
    name: "Consumer lenders",
    situation:
      "Good repayers and half-finished applications are already in your records. Both deserve a careful, honest next step, not a blast.",
    data: ["Loan and repayment history", "Unfinished applications", "Customer service notes", "Consent records"],
    research:
      "SlideIn looks at each person's activity with you, with consent, to understand what they were trying to do and where they stopped.",
    person: {
      who: "Rahim, an applicant",
      signals: ["Stopped at the documents step on Monday", "Opened the app twice since", "Applied for a laptop loan"],
      offer: "Help finishing the application. Your rules and your team decide who gets credit.",
    },
  },
  {
    slug: "telecom-companies",
    name: "Telecom companies",
    situation:
      "Usage tells you who is outgrowing a plan and who is about to leave. The offer they get is usually the same one everyone gets.",
    data: ["Plans and bills", "Data and minute usage", "Top-ups", "Contract end dates"],
    research:
      "SlideIn studies each customer's usage with you, with consent, and finds the plan that actually fits how they use their phone.",
    person: {
      who: "Arif, a prepaid customer",
      signals: ["Topped up data four times this month", "Uses most data on weekday evenings", "Has been with you for three years"],
      offer: "A bigger monthly plan that costs less than his top-ups",
    },
  },
  {
    slug: "large-insurers",
    name: "Large insurers",
    situation:
      "One customer can hold three policies with you and get three unrelated letters. Then they switch all three at renewal.",
    fact: {
      stat: "29%",
      text: "of insurance customers switched insurers in 2025, even as satisfaction held steady.",
      source: "J.D. Power, 2026 Insurance Outlook",
      url: "https://www.crowdfundinsider.com/2026/01/258333-insurers-face-digital-pressures-in-2026-j-d-power/",
    },
    data: ["Policies across lines", "Claims and renewals", "Service history", "Consent records"],
    research:
      "Inside your environment, SlideIn reviews each policyholder's activity with you for a life change, like a new address or a new car on file.",
    person: {
      who: "A customer with car cover only",
      signals: ["Updated their address last month", "Car policy renews in six weeks", "No home cover on file"],
      offer: "A combined car and home review",
    },
  },
  {
    slug: "private-hospitals",
    name: "Private hospitals",
    situation:
      "Patients don't ignore their care. They forget it. A generic reminder is easy to miss, and a missed follow-up is a gap in someone's treatment.",
    fact: {
      stat: "23.1% to 13.6%",
      text: "In one randomized clinic trial, missed visits fell from 23.1% with no reminder to 13.6% with a personal reminder from staff.",
      source: "Randomized clinic trial, reported in AJMC",
      url: "https://www.ajmc.com/pubMed.php?pii=85599",
    },
    data: ["Appointment history", "Departments visited", "Follow-up schedules", "Consent records"],
    research:
      "SlideIn reviews each patient's visits with you, with consent. Medical records never leave your servers, and it never targets anyone by a sensitive condition.",
    person: {
      who: "Mr. Hossain, an outpatient",
      signals: ["Last check-up was in May", "His doctor asked for a six-month follow-up", "Prefers morning appointments"],
      offer: "A follow-up check-up slot",
    },
  },
  {
    slug: "superstore-chains",
    name: "Superstore chains",
    situation:
      "Your loyalty data knows each household's shopping list. The weekly flyer still sends everyone the same offers.",
    fact: {
      stat: "76%",
      text: "of consumers say they get frustrated when a company's offers aren't personalized to them.",
      source: "McKinsey & Company, 2021",
      url: "https://www.mckinsey.com/capabilities/growth-marketing-and-sales/our-insights/the-value-of-getting-personalization-right-or-wrong-is-multiplying",
    },
    data: ["Loyalty purchases", "Store visits", "Basket patterns", "Consent records"],
    research:
      "SlideIn reads each member's buying rhythm with you: what they buy, how often, and at which branch.",
    person: {
      who: "A family in Gulshan",
      signals: ["Buys the 5 kg rice bag about once a month", "Shops at the Gulshan branch on Fridays", "Last rice purchase was 26 days ago"],
      offer: "This week's rice offer at their branch",
    },
  },
  {
    slug: "diagnostic-centers",
    name: "Diagnostic centers",
    situation:
      "One test often leads to another. When the repeat test is months away, patients forget, and the reminder they get looks like an ad.",
    fact: {
      stat: "39%",
      text: "fewer missed appointments after manual reminders, in a systematic review of reminder studies.",
      source: "Systematic review, cited in AJMC",
      url: "https://www.ajmc.com/pubMed.php?pii=85599",
    },
    data: ["Test history and report dates", "Referring doctors", "Home collection requests", "Consent records"],
    research:
      "SlideIn reviews each patient's tests with you, with consent, to see what their doctor asked for and when it's due.",
    person: {
      who: "A patient referred by Dr. Rahman",
      signals: ["Doctor asked for a repeat test after three months", "First test was three months ago this week", "Used home sample collection last time"],
      offer: "A home sample collection slot",
    },
  },
  {
    slug: "export-houses",
    name: "Export houses",
    situation:
      "A few large buyers, each across a border, each on their own season. Miss one buyer's reorder window and the order goes to someone else.",
    data: ["Buyer accounts", "Order and shipment history", "Product specs and costings", "Production capacity"],
    research:
      "SlideIn follows each buyer's public news: new stores, new seasons, sourcing announcements.",
    person: {
      who: "A European fashion buyer",
      signals: ["Reordered knit tops in early September last year", "Announced new stores opening in October", "Your knitwear line has slots this month"],
      offer: "Early production slots for the autumn knit order",
    },
  },
  {
    slug: "restaurant-chains",
    name: "Restaurant chains",
    situation:
      "A small group of regulars keeps your tables full. The messages they get are the same discount everyone else gets.",
    fact: {
      stat: "7%",
      text: "of a restaurant's guests, its regulars, can drive up to half of all orders.",
      source: "Toast and Resy Regulars Report, 2026",
      url: "https://pos.toasttab.com/blog/data/restaurant-regular-customer-report",
    },
    data: ["Orders and reservations", "Delivery history", "Feedback", "Consent records"],
    research:
      "SlideIn reads each guest's habits with you and the public reviews they've written to learn what they love.",
    person: {
      who: "Nadia, a regular",
      signals: ["Booked Friday dinner most weeks this month", "Always orders the grilled fish", "Wrote a review praising the window tables"],
      offer: "A held window table and this week's fish special",
    },
  },
  {
    slug: "local-conglomerates",
    name: "Local conglomerates",
    situation:
      "Many companies under one group, and customers who know only one of them. The introduction that would help them never gets made.",
    fact: {
      stat: "2025",
      text: "Bangladesh's data protection ordinance treats companies as custodians of personal data, not owners. Sharing needs consent.",
      source: "The Daily Star, 2025",
      url: "https://www.thedailystar.net/tech-startup/news/bangladeshs-personal-data-protection-ordinance-2025-key-takeaways-4015401",
    },
    data: ["Customer records across group companies, where sharing is allowed", "Purchases and contracts", "Service history", "Consent records"],
    research:
      "SlideIn looks at each customer's activity across the group, with consent, to find a need another group company can meet.",
    person: {
      who: "A customer of your housing company",
      signals: ["Financed a flat with your housing company", "Handover is next month", "No home insurance on file anywhere in the group"],
      offer: "Home cover from your insurance company",
    },
  },
];
