/**
 * USE CASE EMAILS: one complete email per industry, written to SlideIn’s own
 * email framework (outreach-phases.ts "The Script", Client Acquisition System
 * Stage 5, slidein-cold-email skill):
 *   - the angle is the problem the offer removes for this person
 *   - the opening lines come from the person’s record or from public research,
 *     and every personalized line is traceable to where it came from
 *   - then the need, then the one matched offer
 *   - one low-friction ask, with a graceful way to say no
 *   - plain text, a real sender with a full signature, one-click unsubscribe
 *   - short, human rhythm, no em dashes, no hype
 * Consumers in regulated industries (banks, MFS, lenders, telecom, insurers,
 * hospitals) are written to only from what they did with that business.
 *
 * Markup: [[n|text]] marks a personalized phrase; n points at sources[n-1].
 * All companies, people, addresses and numbers are fictional illustrations.
 */

export type SourceKind = 'record' | 'research' | 'offer' | 'ask';

export type UseCaseEmail = {
  from: { name: string; role: string; company: string; address: string };
  to: { name: string; address: string };
  date: string;
  subject: string;
  paragraphs: string[];
  signature: string[];
  sources: { kind: SourceKind; note: string }[];
};

export const SOURCE_LABELS: Record<SourceKind, string> = {
  record: 'From your records',
  research: 'From public research',
  offer: 'The matched offer',
  ask: 'One clear ask',
};

export const EMAILS: Record<string, UseCaseEmail> = {
  'us-home-lenders': {
    from: { name: 'Mike Alvarez', role: 'Senior Loan Officer', company: 'Harbor Home Loans', address: 'mike.alvarez@harborhomeloans.com' },
    to: { name: 'Sarah Mitchell', address: 'sarah.mitchell@gmail.com' },
    date: 'Tue, 9:42 AM',
    subject: 'Your refinance question, Sarah',
    paragraphs: [
      'Hi Sarah,',
      'I noticed you [[1|ran our refinance calculator three times this week]], so I pulled up your loan before writing. [[2|You’re four years into a 30-year fixed at 7.1%]], and rates have moved since then.',
      'Based on the numbers you entered, [[3|a rate-and-term refinance could lower your monthly payment]]. I can show you the real figures side by side, closing costs included, so you can decide if it’s worth it.',
      '[[4|Would a 15-minute call on Thursday work?]] If now isn’t the right time, just reply "later" and I’ll leave it there.',
    ],
    signature: ['Mike Alvarez', 'Senior Loan Officer, Harbor Home Loans', '(614) 555-0142'],
    sources: [
      { kind: 'record', note: 'Calculator visits logged on your website' },
      { kind: 'record', note: 'Loan file: start date and current rate' },
      { kind: 'offer', note: 'Rate-and-term refinance review' },
      { kind: 'ask', note: 'A short call, with an easy way to say not now' },
    ],
  },
  'mortgage-brokers': {
    from: { name: 'Rachel Green', role: 'Mortgage Adviser', company: 'Northgate Mortgages', address: 'rachel@northgatemortgages.co.uk' },
    to: { name: 'David Clarke', address: 'david.clarke@outlook.com' },
    date: 'Mon, 10:05 AM',
    subject: 'Your fixed rate ends in March',
    paragraphs: [
      'Hi David,',
      '[[1|Your five-year fix on Elm Street ends in March]]. After that you move onto the lender’s standard rate, which is usually a lot higher, unless we switch you first.',
      'I also saw [[2|you set up Clarke Joinery Ltd last month]], congratulations. And since [[3|you asked about buy-to-let on our last call]], it may make sense to plan both together: [[4|a remortgage on your home, and a first look at what a buy-to-let would need]].',
      'I’ve pulled three lenders worth comparing. [[5|Want me to send them over, side by side?]] If you’ve already sorted it, no problem at all, just let me know.',
    ],
    signature: ['Rachel Green', 'Mortgage Adviser, Northgate Mortgages', '0161 555 0187'],
    sources: [
      { kind: 'record', note: 'Fixed-term end date in your CRM' },
      { kind: 'research', note: 'New company listed on the public company register' },
      { kind: 'record', note: 'Notes from your last call with David' },
      { kind: 'offer', note: 'Remortgage plus a buy-to-let review' },
      { kind: 'ask', note: 'A reply, not a meeting' },
    ],
  },
  'mid-sized-companies': {
    from: { name: 'Sam Carter', role: 'Account Manager', company: 'Ledgerly', address: 'sam@ledgerly.io' },
    to: { name: 'Natalie Ross', address: 'natalie.ross@brightwell-logistics.com' },
    date: 'Wed, 11:20 AM',
    subject: 'Two offices, one admin screen',
    paragraphs: [
      'Hi Natalie,',
      'Congratulations on [[1|opening the Leeds office]]. I saw the announcement this week.',
      'Your team has also [[2|grown from 25 to 35 seats since spring]], and [[3|your last two support tickets were about setting up new users]]. That is usually the point where running two sites from one admin screen starts to get painful.',
      '[[4|Our multi-site admin view]] lets you manage users, permissions and billing per office from one place. I can switch it on for your account for a month, free, so you can see if it helps before deciding anything.',
      '[[5|Shall I turn it on this week?]] If it isn’t a priority right now, just say so.',
    ],
    signature: ['Sam Carter', 'Account Manager, Ledgerly', '+44 20 5550 0119'],
    sources: [
      { kind: 'research', note: 'Company announcement, posted publicly' },
      { kind: 'record', note: 'Seat count in your billing system' },
      { kind: 'record', note: 'Support tickets from Natalie’s team' },
      { kind: 'offer', note: 'Multi-site admin add-on, one-month trial' },
      { kind: 'ask', note: 'Yes or no, in one reply' },
    ],
  },
  'insurance-agencies': {
    from: { name: 'Linda Park', role: 'Account Manager', company: 'Brookfield Insurance Agency', address: 'linda@brookfieldagency.com' },
    to: { name: 'Maria Lopez', address: 'maria.lopez@gmail.com' },
    date: 'Thu, 2:10 PM',
    subject: 'Your new home and your renewal',
    paragraphs: [
      'Hi Maria,',
      'Congratulations on [[1|your new home on Maple Avenue]]. [[2|Your home policy still lists the old address]], and it renews on the 14th.',
      'You also [[3|added Daniel as a driver on your auto policy last month]]. When the house and the car change in the same year, it’s worth looking at both together, because the cover and the discounts often shift.',
      '[[4|I’d like to review your home and auto cover in one short call]], so the new house is properly covered before the renewal. [[5|Does Wednesday afternoon work?]] If you’d rather handle it by email, that’s fine too.',
    ],
    signature: ['Linda Park', 'Account Manager, Brookfield Insurance Agency', '(512) 555-0176'],
    sources: [
      { kind: 'research', note: 'Public property record' },
      { kind: 'record', note: 'Address on the current home policy' },
      { kind: 'record', note: 'Auto policy change last month' },
      { kind: 'offer', note: 'Combined home and auto review' },
      { kind: 'ask', note: 'A call, or email if she prefers' },
    ],
  },
  'real-estate-firms': {
    from: { name: 'Jordan Lee', role: 'Sales Agent', company: 'Oakline Realty', address: 'jordan@oaklinerealty.com' },
    to: { name: 'James and Lena Park', address: 'parkfamily@gmail.com' },
    date: 'Fri, 8:55 AM',
    subject: 'A garden near Oak Park',
    paragraphs: [
      'Hi James and Lena,',
      'You [[1|saved two homes near Oak Park last month]], and at the Linden Street viewing [[2|you asked whether there was room for a vegetable garden]].',
      '[[3|A 3-bedroom on Birch Lane just came on the market]]. It has a south-facing back garden, it’s two streets from the homes you saved, and it sits inside the budget you mentioned.',
      'Viewings start Saturday. [[4|Would 11 AM suit you?]] If you’ve already found something, congratulations, and just let me know so I stop sending listings.',
    ],
    signature: ['Jordan Lee', 'Sales Agent, Oakline Realty', '(312) 555-0163'],
    sources: [
      { kind: 'record', note: 'Saved searches on your listings site' },
      { kind: 'record', note: 'Agent notes from the last viewing' },
      { kind: 'offer', note: 'New listing that matches all three' },
      { kind: 'ask', note: 'One viewing time, easy to decline' },
    ],
  },
  'e-commerce-brands': {
    from: { name: 'Ava Brooks', role: 'Customer Care', company: 'Northpeak Outfitters', address: 'ava@northpeak.co' },
    to: { name: 'Tom Bennett', address: 'tom.bennett@gmail.com' },
    date: 'Mon, 7:30 PM',
    subject: 'The olive jacket is back, Tom',
    paragraphs: [
      'Hi Tom,',
      '[[1|The olive field jacket you left in your cart]] is back in stock this week.',
      'Before you order: [[2|in your review last winter you said our jackets run small]], so I’d go for a large instead of the medium in your cart. [[3|I’ve put the large in your cart for you]], and returns are free if the fit is still off.',
      '[[4|Want me to keep the large?]] Just reply "yes". If you’ve changed your mind about the jacket, no worries at all.',
    ],
    signature: ['Ava Brooks', 'Customer Care, Northpeak Outfitters', 'northpeak.co'],
    sources: [
      { kind: 'record', note: 'Abandoned cart on your store' },
      { kind: 'record', note: 'Tom’s own product review' },
      { kind: 'offer', note: 'Same jacket, one size up' },
      { kind: 'ask', note: 'A one-word reply' },
    ],
  },
  'tech-startups': {
    from: { name: 'Maya Chen', role: 'Co-founder', company: 'Pipelane', address: 'maya@pipelane.app' },
    to: { name: 'Leo Martins', address: 'leo@fieldworkstudio.com' },
    date: 'Wed, 4:15 PM',
    subject: 'Stuck on the import, Leo?',
    paragraphs: [
      'Hi Leo,',
      'I saw [[1|Fieldwork announced it’s moving off its old CRM this month]], and [[2|your data import stopped at step two on Tuesday]].',
      'That step trips up most teams coming from older CRMs, because the field names don’t match. [[3|I’ve attached a mapping file built for exactly that move]]. It should take you straight through.',
      'Your trial ends Friday, so [[4|I’ve added another week]] to give you time to finish properly. [[5|If it helps, I can join a 10-minute call and run the import with you.]] If not, the file should be enough.',
    ],
    signature: ['Maya Chen', 'Co-founder, Pipelane', 'pipelane.app'],
    sources: [
      { kind: 'research', note: 'Public post from Leo’s company' },
      { kind: 'record', note: 'Product event: import stopped at step 2' },
      { kind: 'offer', note: 'Ready-made mapping file' },
      { kind: 'offer', note: 'One-week trial extension' },
      { kind: 'ask', note: 'An optional call, the file works without it' },
    ],
  },
  'corporate-agencies': {
    from: { name: 'Nora Hayes', role: 'Client Partner', company: 'Fable & Field', address: 'nora@fableandfield.com' },
    to: { name: 'Tom Reid', address: 'tom.reid@harlowhome.com' },
    date: 'Tue, 10:40 AM',
    subject: 'The new Outdoor line',
    paragraphs: [
      'Hi Tom,',
      'Congratulations on [[1|launching the Harlow Outdoor line this week]], and welcome aboard. I believe [[2|you joined as head of marketing in October]].',
      'We [[3|ran Harlow’s spring campaign]], which wrapped last month, so we already know the brand, the audience and what worked. [[4|Much of that campaign could carry the new line with a few changes]].',
      'I’ve put together a one-page sketch of how. [[5|Would you like me to send it over?]] If you’re planning the launch in-house, that’s completely fine, just let me know.',
    ],
    signature: ['Nora Hayes', 'Client Partner, Fable & Field', '(646) 555-0128'],
    sources: [
      { kind: 'research', note: 'Launch announcement in the news' },
      { kind: 'research', note: 'Public role change on a professional profile' },
      { kind: 'record', note: 'Past project in your client records' },
      { kind: 'offer', note: 'Launch campaign built on the spring work' },
      { kind: 'ask', note: 'Send a one-pager, nothing more' },
    ],
  },
  'commercial-banks': {
    from: { name: 'Jessica Hall', role: 'Relationship Manager', company: 'Meridian Bank', address: 'jessica.hall@meridianbank.com.bd' },
    to: { name: 'Mr. Warren, Rupali Knit Ltd', address: 'md@rupaliknit.com' },
    date: 'Sun, 10:00 AM',
    subject: 'Payroll for your second factory',
    paragraphs: [
      'Dear Mr. Warren,',
      '[[1|Rupali Knit’s payroll runs have doubled since March]], and [[2|your new factory in Gazipur was registered last month]]. Congratulations on the expansion.',
      'With two sites, payroll gets harder to manage by hand. [[3|We can run payroll automatically from your current account, and schedule your monthly supplier payments abroad]] at the same time, so both run on dates you approve.',
      'This doesn’t involve any new credit. [[4|Could I take 20 minutes this week to walk you through it?]] If the timing isn’t right, just reply and I’ll check back next quarter.',
    ],
    signature: ['Jessica Hall', 'Relationship Manager, Meridian Bank, Gulshan', '+880 2 5555 0142'],
    sources: [
      { kind: 'record', note: 'Transaction patterns, read inside the bank' },
      { kind: 'research', note: 'Public business registration' },
      { kind: 'offer', note: 'Payroll automation and supplier payments' },
      { kind: 'ask', note: 'A short meeting, or a check-in later' },
    ],
  },
  'national-banks': {
    from: { name: 'Hannah Coleman', role: 'Relationship Officer', company: 'Meridian Bank', address: 'hannah.coleman@meridianbank.com.bd' },
    to: { name: 'Brian Turner', address: 'brian.turner@gmail.com' },
    date: 'Sun, 11:30 AM',
    subject: 'The car loan you were looking at',
    paragraphs: [
      'Dear Mr. Turner,',
      'You [[1|looked at car loans around Tk 15 lakh in our app last week]], so I wanted to write to you personally instead of sending a general offer.',
      'Because [[2|your salary has arrived in your account with us every month for the past year]], [[3|our salaried car loan may suit you]]. The final decision depends on the bank’s standard checks, but I can show you the monthly payment, the documents you’d need and how long approval usually takes.',
      '[[4|Could you visit the Gulshan branch on Sunday, or would a phone call suit you better?]] If you’re no longer looking for a car, just tell me and I’ll not contact you about it again.',
    ],
    signature: ['Hannah Coleman', 'Relationship Officer, Meridian Bank, Gulshan', '+880 2 5555 0177'],
    sources: [
      { kind: 'record', note: 'Car loan pages viewed in the bank’s app' },
      { kind: 'record', note: 'Salary credits, read inside the bank' },
      { kind: 'offer', note: 'Salaried car loan, decided by the bank' },
      { kind: 'ask', note: 'Branch visit or phone, his choice' },
    ],
  },
  'mfs-providers': {
    from: { name: 'Olivia Grant', role: 'Customer Care', company: 'TakaPay', address: 'care@takapay.com.bd' },
    to: { name: 'Emma Walsh', address: 'emma.walsh@gmail.com' },
    date: 'Sat, 6:20 PM',
    subject: 'Pay your electricity bill on time, automatically',
    paragraphs: [
      'Hi Emma,',
      'You [[1|pay your electricity bill by hand in the app every month]], and [[2|a few payments went through a day after the due date]].',
      '[[3|With scheduled bill pay, you set it once]] and the bill is paid on time every month. We remind you two days before each payment, and you can pause or cancel it anytime.',
      '[[4|Want to set it up? It takes about a minute: open Bills, then Schedule.]] If you prefer paying by hand, that’s completely fine, and we’ll not remind you about this again.',
    ],
    signature: ['Olivia Grant', 'Customer Care, TakaPay', 'Helpline 16000'],
    sources: [
      { kind: 'record', note: 'Bill payments inside the app' },
      { kind: 'record', note: 'Payment dates against due dates' },
      { kind: 'offer', note: 'Scheduled bill pay' },
      { kind: 'ask', note: 'One-minute setup, or nothing' },
    ],
  },
  'consumer-lenders': {
    from: { name: 'Megan Powell', role: 'Customer Support', company: 'BrightCredit', address: 'megan@brightcredit.com.bd' },
    to: { name: 'Kevin Doyle', address: 'kevin.doyle@gmail.com' },
    date: 'Wed, 12:05 PM',
    subject: 'Finish your application, Kevin',
    paragraphs: [
      'Hi Kevin,',
      'You [[1|started a laptop loan application on Monday]] and [[2|stopped at the documents step]]. I wanted to make sure nothing went wrong.',
      'You only need [[3|two documents: your NID and your latest salary slip]]. Take a photo of each with your phone and upload them in a few minutes. Our team reviews applications the same day, and the decision follows our standard checks.',
      '[[4|Would it help if I called you to walk through the upload?]] If you’ve decided not to go ahead, just reply and I’ll close the application.',
    ],
    signature: ['Megan Powell', 'Customer Support, BrightCredit', '+880 9 6555 0110'],
    sources: [
      { kind: 'record', note: 'Application started in your system' },
      { kind: 'record', note: 'The step where it stopped' },
      { kind: 'offer', note: 'The two documents needed, nothing more' },
      { kind: 'ask', note: 'A helping call, or a clean close' },
    ],
  },
  'telecom-companies': {
    from: { name: 'Ryan Cooper', role: 'Customer Care', company: 'Brightline Mobile', address: 'care@brightline.com.bd' },
    to: { name: 'Jason Miller', address: 'jason.miller@gmail.com' },
    date: 'Fri, 7:45 PM',
    subject: 'A plan that costs less than your top-ups',
    paragraphs: [
      'Hi Jason,',
      'You [[1|topped up 10 GB of data four times this month]], mostly [[2|on weekday evenings]].',
      'Those four top-ups cost more than [[3|our 40 GB monthly plan]], which would cover how you use your phone now and leave some room. You keep your number and your current balance.',
      '[[4|Want me to switch you from your next bill?]] Reply "yes" and it’s done. You can switch back anytime, and if you’re happy with top-ups, there’s nothing you need to do.',
    ],
    signature: ['Ryan Cooper', 'Customer Care, Brightline Mobile', 'Dial 121'],
    sources: [
      { kind: 'record', note: 'Top-up history on the account' },
      { kind: 'record', note: 'Usage pattern by time of day' },
      { kind: 'offer', note: 'A plan cheaper than his top-ups' },
      { kind: 'ask', note: 'A one-word reply, reversible' },
    ],
  },
  'large-insurers': {
    from: { name: 'Greg Sullivan', role: 'Customer Advisor', company: 'Greenshield Insurance', address: 'greg.sullivan@greenshield.com.bd' },
    to: { name: 'Laura Hughes', address: 'laura.hughes@gmail.com' },
    date: 'Tue, 3:30 PM',
    subject: 'Your car renewal and your new home',
    paragraphs: [
      'Dear Ms. Hughes,',
      'You [[1|updated your address with us last month]], so congratulations on the move. [[2|Your car insurance renews in six weeks]], and we don’t have home cover for you on file.',
      '[[3|We could review your car cover and look at home cover for the new place in one short call]], and set both to renew on the same date, so there’s one renewal to think about instead of two.',
      '[[4|Would a 15-minute call this Thursday work?]] If your home is already insured elsewhere, that’s fine, just let me know and I’ll only handle your car renewal.',
    ],
    signature: ['Greg Sullivan', 'Customer Advisor, Greenshield Insurance', '+880 2 5555 0155'],
    sources: [
      { kind: 'record', note: 'Address change on her policy' },
      { kind: 'record', note: 'Car policy renewal date' },
      { kind: 'offer', note: 'One review, one renewal date' },
      { kind: 'ask', note: 'A short call, or car only' },
    ],
  },
  'private-hospitals': {
    from: { name: 'Appointments Desk', role: 'Department of Medicine', company: 'Lakeview Hospital', address: 'appointments@lakeviewhospital.com.bd' },
    to: { name: 'Mr. Dawson', address: 'm.dawson@gmail.com' },
    date: 'Mon, 9:10 AM',
    subject: 'Your follow-up with Dr. Patterson',
    paragraphs: [
      'Dear Mr. Marsh,',
      '[[1|Dr. Patterson asked to see you again six months after your visit in May]], and that time has come.',
      'We have [[2|morning slots]] open next week, which we know you prefer. [[3|The follow-up takes about 20 minutes]], and you only need to bring your previous report.',
      '[[4|Reply with a day that suits you and we’ll confirm the time.]] If you’ve already booked or seen another doctor, just let us know and we’ll update your record.',
    ],
    signature: ['Appointments Desk', 'Department of Medicine, Lakeview Hospital', '+880 2 5555 0100'],
    sources: [
      { kind: 'record', note: 'Follow-up schedule set by his doctor' },
      { kind: 'record', note: 'Booking history: prefers mornings' },
      { kind: 'offer', note: 'A follow-up slot next week' },
      { kind: 'ask', note: 'Pick a day, or tell us it’s done' },
    ],
  },
  'superstore-chains': {
    from: { name: 'DailyMart Gulshan', role: 'Member Services', company: 'DailyMart', address: 'members@dailymart.com.bd' },
    to: { name: 'Karen Whitfield', address: 'karen.whitfield@gmail.com' },
    date: 'Wed, 5:00 PM',
    subject: 'Your usual rice is on offer this week',
    paragraphs: [
      'Hi Karen,',
      'You usually [[1|pick up the 5 kg Miniket rice bag about once a month]], and [[2|your last one was 26 days ago]].',
      '[[3|It’s on offer at the Gulshan branch until Sunday]], so if your Friday shop is coming up, it’s a good week to stock up. [[4|Your loyalty points also cover home delivery]] if you’d rather order from the app.',
      '[[5|Want us to set one aside for Friday?]] Just reply and we’ll keep it at the counter. If you’re stocked up, there’s nothing you need to do.',
    ],
    signature: ['Member Services, DailyMart', 'Gulshan Avenue branch', 'dailymart.com.bd'],
    sources: [
      { kind: 'record', note: 'Loyalty purchase history' },
      { kind: 'record', note: 'Date of last rice purchase' },
      { kind: 'offer', note: 'This week’s offer at her branch' },
      { kind: 'offer', note: 'Loyalty points balance' },
      { kind: 'ask', note: 'Hold one at the counter, or skip' },
    ],
  },
  'diagnostic-centers': {
    from: { name: 'Home Collection Team', role: 'Patient Services', company: 'ClearPath Diagnostics', address: 'homecollection@clearpath.com.bd' },
    to: { name: 'Mr. Gordon', address: 'r.gordon@gmail.com' },
    date: 'Mon, 8:30 AM',
    subject: 'Your follow-up test is due this week',
    paragraphs: [
      'Dear Mr. Gordon,',
      '[[1|Dr. Mercer suggested a repeat test three months after your first one]], and that falls this week.',
      'Last time you [[2|used our home sample collection]], so we can do the same again. [[3|A collector can visit between 7 and 10 AM]], and the report goes to you and to Dr. Mercer.',
      '[[4|Reply with a morning that suits you and we’ll book it.]] If you’ve already had the test done somewhere else, just let us know.',
    ],
    signature: ['Home Collection Team', 'ClearPath Diagnostics', '+880 2 5555 0199'],
    sources: [
      { kind: 'record', note: 'Repeat date from the doctor’s referral' },
      { kind: 'record', note: 'He chose home collection last time' },
      { kind: 'offer', note: 'A morning home collection slot' },
      { kind: 'ask', note: 'Pick a morning, or tell us it’s done' },
    ],
  },
  'export-houses': {
    from: { name: 'Dennis Parker', role: 'Merchandising Manager', company: 'Meghna Knit Composite', address: 'dennis@meghnaknit.com' },
    to: { name: 'Anna Becker, Nordlicht Fashion', address: 'a.becker@nordlicht-fashion.de' },
    date: 'Thu, 11:00 AM',
    subject: 'Your autumn knitwear window',
    paragraphs: [
      'Dear Anna,',
      'Congratulations on [[1|the three new Nordlicht stores opening in Hamburg in October]]. I saw the announcement last week.',
      'Last year, [[2|your knit top reorder came in on 6 September]]. With new stores opening, the autumn volume may be larger, so I wanted to flag that [[3|our production slots for the knit line open this month]]. Booking now keeps last year’s ship date, with room for extra quantity.',
      '[[4|Shall I hold capacity for you while you finalize numbers?]] If you’re sourcing this season elsewhere, just let me know.',
    ],
    signature: ['Dennis Parker', 'Merchandising Manager, Meghna Knit Composite', '+880 1555 010 233'],
    sources: [
      { kind: 'research', note: 'The buyer’s public store announcement' },
      { kind: 'record', note: 'Order history: last year’s reorder date' },
      { kind: 'offer', note: 'Early production slots' },
      { kind: 'ask', note: 'Hold capacity, no commitment yet' },
    ],
  },
  'restaurant-chains': {
    from: { name: 'Chris Dalton', role: 'Manager', company: 'Saffron Table, Banani', address: 'chris@saffrontable.com.bd' },
    to: { name: 'Jenna Morgan', address: 'jenna.morgan@gmail.com' },
    date: 'Wed, 1:15 PM',
    subject: 'A table for Friday, Jenna?',
    paragraphs: [
      'Hi Jenna,',
      'You’ve [[1|booked dinner with us most Fridays this month]], and [[2|you almost always go for the grilled fish]].',
      'This Friday [[3|the chef is serving a grilled hilsa special]] that we think you will like. And since your review [[4|mentioned the window tables]], we would be happy to keep one for you.',
      '[[5|Shall we hold a window table for two at 8 PM?]] Just reply "yes". If you’ve other plans, see you another week.',
    ],
    signature: ['Chris Dalton', 'Manager, Saffron Table, Banani', '+880 1555 010 456'],
    sources: [
      { kind: 'record', note: 'Reservation history' },
      { kind: 'record', note: 'Her usual order' },
      { kind: 'offer', note: 'This week’s special' },
      { kind: 'research', note: 'Her own public review' },
      { kind: 'ask', note: 'A one-word reply' },
    ],
  },
  'local-conglomerates': {
    from: { name: 'Rebecca Shaw', role: 'Customer Advisor', company: 'Northstar Insurance', address: 'rebecca@northstarinsurance.com.bd' },
    to: { name: 'Steven Marsh', address: 'steven.marsh@gmail.com' },
    date: 'Tue, 12:40 PM',
    subject: 'Cover for your new flat',
    paragraphs: [
      'Dear Mr. Marsh,',
      'You [[1|financed your flat with Northstar Homes in Bashundhara]], and [[2|your handover is scheduled for next month]]. Congratulations.',
      'We’re writing from Northstar Insurance, part of the same group, because [[3|we have no home cover on file for your flat]]. [[4|We can cover it from the day you get the keys]], and since your documents are already with Northstar Homes, there’s very little paperwork.',
      '[[5|Would you like a short call to go through the options?]] If you’ve already arranged insurance, that’s fine, just reply and we’ll not contact you about it again.',
    ],
    signature: ['Rebecca Shaw', 'Customer Advisor, Northstar Insurance', '+880 2 5555 0166'],
    sources: [
      { kind: 'record', note: 'Group record, shared with his consent' },
      { kind: 'record', note: 'Handover date from the housing company' },
      { kind: 'record', note: 'No home policy anywhere in the group' },
      { kind: 'offer', note: 'Home cover from day one' },
      { kind: 'ask', note: 'A short call, or a clean no' },
    ],
  },
};

/** Footer line under every email (plain text, one-click opt-out). */
export const emailFooter = (company: string) =>
  `You’re getting this because you’re a ${company} customer and agreed to hear from us.`;
