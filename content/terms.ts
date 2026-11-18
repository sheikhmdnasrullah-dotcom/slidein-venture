/**
 * TERMS AND CONDITIONS — the single source of truth for /terms.
 * ---------------------------------------------------------------------------
 * Every clause is drawn from how the business already works and what the site
 * already says: the pricing rules in content/pricing.ts (the $750 monthly
 * minimum for 500 emails, then volume bands), the approval gate ("nothing
 * sends until you approve it"), sending from the client's own domain, working
 * unsubscribes and permanent opt-outs, and the managed-service / software
 * split in content/product.ts.
 *
 * Two languages, one structure: `en` and `bn` hold the same sections in the
 * same order with the same ids, so the toggle swaps the text and nothing
 * else. When you change a clause, change it in BOTH languages.
 *
 * OWNER TO CONFIRM: the commercial specifics a lawyer would normally set are
 * sensible defaults, not facts the site previously stated: monthly billing in
 * advance, cancel any time effective at the end of the billing month, no
 * refund for a started month, liability capped at three months of fees, 30
 * days' notice if we end the service, and Bangladesh as governing law. Change
 * them here, in both languages, if the real policy differs.
 */

export interface TermsSection {
  id: string;
  heading: string;
  /** Paragraphs rendered before the list. */
  body?: string[];
  /** Bulleted points. */
  items?: string[];
  /** Paragraphs rendered after the list. */
  after?: string[];
}

export interface TermsLocale {
  /** Short language name shown on the toggle. */
  label: string;
  /** BCP 47 tag set on the content wrapper. */
  lang: string;
  title: string;
  updatedLabel: string;
  updated: string;
  intro: string;
  tocLabel: string;
  toggleLabel: string;
  sections: TermsSection[];
}

export const TERMS_META = {
  title: 'Terms and Conditions · SlideIn Venture',
  description:
    'The terms that apply when you use SlideIn Venture’s outreach platform or managed outreach service, in English and Bengali.',
} as const;

export const TERMS_EMAIL = 'hello@tanim.social';

const en: TermsLocale = {
  label: 'English',
  lang: 'en',
  title: 'Terms and Conditions',
  updatedLabel: 'Last updated',
  updated: '18 November 2026',
  intro:
    'These terms are the agreement between you and SlideIn Venture. They explain what we provide, what we ask of you, how billing works, and what happens if something goes wrong. Please read them before you use our platform or ask us to run outreach for you. The Bengali version is a translation of the English version; if the two ever differ, the English version is the one that applies.',
  tocLabel: 'On this page',
  toggleLabel: 'Language',
  sections: [
    {
      id: 'agreement',
      heading: 'Who we are and what these terms cover',
      body: [
        '“SlideIn Venture”, “we”, “us” and “our” mean the business that operates slideinventure.com. “You” and “your” mean the person or company that uses our services.',
        'These terms apply to our website, our outreach platform, and our managed outreach service. By booking a walkthrough, creating an account, paying an invoice, or letting us run outreach for you, you agree to these terms. If you are agreeing for a company, you confirm you have the authority to bind it.',
      ],
    },
    {
      id: 'services',
      heading: 'What we provide',
      body: [
        'SlideIn Venture provides research-led email outreach. Depending on what you choose, this is one of two things:',
      ],
      items: [
        'The platform: software that finds and researches prospects, matches them to your offers, writes a personal email for each one, and sends from your own domain.',
        'The managed service: the same platform, operated for you by us, month to month.',
      ],
      after: [
        'The work follows the same sequence every time: research, review, personalize, send, monitor. We may improve, change or retire features over time, and we will not make a change that removes something you have already paid for without telling you first.',
      ],
    },
    {
      id: 'approval',
      heading: 'Your brief and your approval',
      body: [
        'You tell us who is worth contacting and what you offer. We build the campaign from that brief.',
      ],
      items: [
        'Nothing is sent to prospects until you approve the campaign in the dashboard.',
        'Every run starts as a dry run. Real sending begins only after your approval.',
        'Any claim we cannot source is dropped from the email. You are responsible for checking that what you offer, and what you ask us to say about it, is accurate.',
        'You may withdraw approval at any time, and we will stop sending as soon as we reasonably can.',
      ],
    },
    {
      id: 'your-responsibilities',
      heading: 'Your responsibilities',
      body: ['You agree that you will:'],
      items: [
        'Give us accurate information, and keep your domain, mailbox and account details up to date.',
        'Use our services only for lawful business outreach, and follow the email, anti-spam, privacy and consumer laws that apply to you and to the people you contact, including requirements such as CAN-SPAM, GDPR and local equivalents.',
        'Not use our services to send anything deceptive, abusive, illegal, or misleading, including false sender details, fake urgency, or content that misrepresents who you are or what you sell.',
        'Not ask us to contact people who have asked not to be contacted, or to bypass an unsubscribe.',
        'Keep your login details private and tell us promptly if you think someone else has used your account.',
      ],
    },
    {
      id: 'sending',
      heading: 'Sending, unsubscribes and deliverability',
      body: [
        'Emails go out from your own verified domain on a staged schedule. We set up and expect proper email authentication (SPF, DKIM and DMARC), warm sending up gradually, and keep lists clean.',
        'Every email carries a working unsubscribe. When someone says no, that is permanent: we suppress that address and do not contact it again. Anyone who replies leaves the sequence at once. We read bounces, complaints and replies every day.',
        'We do not use tricks that disguise where an email comes from or how it is routed, and we will not carry out any request that depends on them.',
        'If complaints or bounces rise, we may slow down or pause sending on your domain to protect its reputation. We will tell you when we do.',
      ],
    },
    {
      id: 'no-guarantee',
      heading: 'No guarantee of results',
      body: [
        'We do our work carefully, but we cannot promise any particular number of replies, meetings, sales or revenue. Results depend on things outside our control, including your offer, your market, your domain’s reputation, the quality of the prospects’ own inboxes, and the decisions of the people you contact. We also cannot guarantee that every email reaches the inbox, because mailbox providers make their own decisions.',
      ],
    },
    {
      id: 'fees',
      heading: 'Fees and payment',
      body: [
        'Our fee follows your monthly outreach volume. The monthly minimum is US$750, which covers up to 500 outreach emails, or US$1.50 per email. Above that, the price per email steps down in bands as your volume grows, and the bands apply only to the emails inside each band, so a larger volume never costs less than a smaller one. The pricing page shows the current rates and calculates your price from your volume.',
      ],
      items: [
        'All prices are in US dollars. Taxes, bank charges and currency-conversion costs are your responsibility unless we say otherwise in writing.',
        'Fees are invoiced monthly in advance.',
        'If an invoice is not paid by its due date, we may pause the service until it is. Pausing does not cancel the fee that is owed.',
        'We may change our prices. A change applies from your next billing period, and we will give you notice before it takes effect.',
      ],
    },
    {
      id: 'cancellation',
      heading: 'Cancelling and refunds',
      body: [
        'There is no long-term lock-in. You can cancel at any time by writing to us.',
      ],
      items: [
        'Cancellation takes effect at the end of the billing month you are in. Sending stops at that point, or sooner if you ask.',
        'Fees for a month that has already started are not refundable, because the research and setup for that month are done up front.',
        'If we fail to deliver the service you paid for, tell us. We will either put it right or refund the part we did not deliver.',
      ],
    },
    {
      id: 'data',
      heading: 'Your data and prospect data',
      body: [
        'To do the work we handle two kinds of information: what you give us (your brief, offers, domain and, where relevant, your own customer records), and information about prospects, which we research from publicly available sources.',
      ],
      items: [
        'We use your information only to provide the service to you, to keep it secure, and to meet our legal duties.',
        'We do not sell your information, and we do not use one client’s confidential information to serve another.',
        'You are responsible for having the right to give us any customer or contact data you provide, including any consent the law requires.',
        'Opt-out records are kept even after you cancel, so that a person who said no is never contacted again.',
        'When the service ends, we will delete or return your data on request, except what we must keep by law or for opt-out suppression.',
      ],
    },
    {
      id: 'ip',
      heading: 'Ownership and intellectual property',
      body: [
        'We own the platform, its software, workflows, design and our website. These terms give you the right to use them while you are a client, and nothing more.',
        'You own your brand, your offers, your lists of your own customers, and the emails written for you once you have paid for them. You give us permission to use these only to provide the service. We may mention that you are a client only if you agree.',
      ],
    },
    {
      id: 'third-parties',
      heading: 'Third-party services',
      body: [
        'Our service relies on other providers, such as email and domain providers, data sources and software tools. They have their own terms and may change, fail or be unavailable. We are not responsible for outages or decisions made by those providers, such as a mailbox provider blocking a message.',
      ],
    },
    {
      id: 'warranties',
      heading: 'Disclaimer',
      body: [
        'We provide the service with reasonable care and skill. Beyond that, it is provided “as is” and “as available”. We do not promise that it will be uninterrupted or free of errors.',
      ],
    },
    {
      id: 'liability',
      heading: 'Limit of our liability',
      body: [
        'To the fullest extent the law allows, we are not liable for indirect or consequential loss, such as lost profit, lost business, lost opportunity or damage to reputation. Our total liability to you for any claim arising from the service is limited to the fees you paid us in the three months before the event that gave rise to the claim.',
        'Nothing in these terms limits liability that cannot be limited by law.',
      ],
    },
    {
      id: 'suspension',
      heading: 'Suspension and termination by us',
      body: [
        'We may suspend or end the service, with notice where we reasonably can, if you break these terms, ask us to send something unlawful or deceptive, put our sending reputation or other clients at risk, or do not pay. We may also end the service for any other reason with 30 days’ written notice, and refund any fee you have paid for service we did not provide.',
      ],
    },
    {
      id: 'changes',
      heading: 'Changes to these terms',
      body: [
        'We may update these terms. The “Last updated” date at the top shows the current version. If a change is significant, we will tell you before it applies. If you keep using the service after a change takes effect, you accept the updated terms.',
      ],
    },
    {
      id: 'law',
      heading: 'Governing law and disputes',
      body: [
        'These terms are governed by the laws of Bangladesh. If a disagreement arises, please write to us first and we will try in good faith to resolve it. If we cannot, the courts of Bangladesh have jurisdiction.',
      ],
    },
    {
      id: 'contact',
      heading: 'Contact',
      body: [
        `Questions about these terms? Write to us at ${TERMS_EMAIL}, or use the Connect page on this website.`,
      ],
    },
  ],
};

const bn: TermsLocale = {
  label: 'বাংলা',
  lang: 'bn',
  title: 'শর্তাবলি',
  updatedLabel: 'সর্বশেষ হালনাগাদ',
  updated: '১৮ নভেম্বর ২০২৬',
  intro:
    'এই শর্তাবলি আপনার ও স্লাইডইন ভেঞ্চারের মধ্যকার চুক্তি। আমরা কী সেবা দিই, আপনার কাছে কী প্রত্যাশা করি, বিলিং কীভাবে কাজ করে এবং কোনো সমস্যা হলে কী হবে, তা এখানে ব্যাখ্যা করা হয়েছে। আমাদের প্ল্যাটফর্ম ব্যবহার করার আগে, বা আপনার হয়ে আউটরিচ চালাতে বলার আগে অনুগ্রহ করে এগুলো পড়ে নিন। বাংলা সংস্করণটি ইংরেজি সংস্করণের অনুবাদ। দুটির মধ্যে কোনো অমিল থাকলে ইংরেজি সংস্করণই প্রযোজ্য হবে।',
  tocLabel: 'এই পাতায়',
  toggleLabel: 'ভাষা',
  sections: [
    {
      id: 'agreement',
      heading: 'আমরা কারা এবং এই শর্তাবলি কী কী বিষয়ে প্রযোজ্য',
      body: [
        '“স্লাইডইন ভেঞ্চার”, “আমরা”, “আমাদের” বলতে slideinventure.com পরিচালনাকারী প্রতিষ্ঠানকে বোঝায়। “আপনি” ও “আপনার” বলতে যে ব্যক্তি বা প্রতিষ্ঠান আমাদের সেবা ব্যবহার করে তাকে বোঝায়।',
        'এই শর্তাবলি আমাদের ওয়েবসাইট, আউটরিচ প্ল্যাটফর্ম এবং ম্যানেজড আউটরিচ সেবার ক্ষেত্রে প্রযোজ্য। ওয়াকথ্রুর জন্য বুকিং করলে, অ্যাকাউন্ট খুললে, ইনভয়েস পরিশোধ করলে বা আপনার হয়ে আউটরিচ চালাতে আমাদের অনুমতি দিলে আপনি এই শর্তাবলিতে সম্মত হচ্ছেন। কোনো প্রতিষ্ঠানের পক্ষে সম্মতি দিলে আপনি নিশ্চিত করছেন যে সেই প্রতিষ্ঠানকে বাধ্য করার ক্ষমতা আপনার আছে।',
      ],
    },
    {
      id: 'services',
      heading: 'আমরা কী সেবা দিই',
      body: [
        'স্লাইডইন ভেঞ্চার গবেষণাভিত্তিক ইমেইল আউটরিচ সেবা দেয়। আপনার পছন্দ অনুযায়ী এটি দুইটির যেকোনো একটি হবে:',
      ],
      items: [
        'প্ল্যাটফর্ম: যে সফটওয়্যার সম্ভাব্য ক্লায়েন্ট খুঁজে বের করে ও তাদের নিয়ে গবেষণা করে, তাদের আপনার অফারের সঙ্গে মেলায়, প্রত্যেকের জন্য আলাদা ব্যক্তিগত ইমেইল লেখে এবং আপনার নিজের ডোমেইন থেকে পাঠায়।',
        'ম্যানেজড সেবা: একই প্ল্যাটফর্ম, যা আমরা প্রতি মাসে আপনার হয়ে পরিচালনা করি।',
      ],
      after: [
        'কাজটি প্রতিবার একই ধারায় চলে: গবেষণা, পর্যালোচনা, ব্যক্তিগতকরণ, পাঠানো এবং পর্যবেক্ষণ। সময়ের সঙ্গে আমরা ফিচার উন্নত, পরিবর্তন বা বন্ধ করতে পারি। তবে আপনি যার জন্য ইতোমধ্যে অর্থ দিয়েছেন, আপনাকে আগে না জানিয়ে তা সরিয়ে দেওয়ার মতো পরিবর্তন আমরা করব না।',
      ],
    },
    {
      id: 'approval',
      heading: 'আপনার ব্রিফ ও আপনার অনুমোদন',
      body: [
        'কাদের সঙ্গে যোগাযোগ করা সার্থক এবং আপনি কী অফার করেন, তা আপনি আমাদের জানান। সেই ব্রিফ থেকেই আমরা ক্যাম্পেইন তৈরি করি।',
      ],
      items: [
        'আপনি ড্যাশবোর্ডে ক্যাম্পেইন অনুমোদন না করা পর্যন্ত সম্ভাব্য ক্লায়েন্টদের কাছে কিছুই পাঠানো হয় না।',
        'প্রতিটি রান শুরু হয় ড্রাই রান হিসেবে। আপনার অনুমোদনের পরেই প্রকৃত পাঠানো শুরু হয়।',
        'যে দাবির উৎস আমরা যাচাই করতে পারি না, তা ইমেইল থেকে বাদ দেওয়া হয়। আপনি যা অফার করেন এবং সে বিষয়ে আমাদের যা বলতে বলেন, তা সঠিক কি না তা দেখার দায়িত্ব আপনার।',
        'আপনি যেকোনো সময় অনুমোদন প্রত্যাহার করতে পারেন। আমরা যত দ্রুত যুক্তিসংগতভাবে সম্ভব, পাঠানো বন্ধ করব।',
      ],
    },
    {
      id: 'your-responsibilities',
      heading: 'আপনার দায়িত্ব',
      body: ['আপনি সম্মত হচ্ছেন যে আপনি:'],
      items: [
        'আমাদের সঠিক তথ্য দেবেন এবং আপনার ডোমেইন, মেইলবক্স ও অ্যাকাউন্টের তথ্য হালনাগাদ রাখবেন।',
        'আমাদের সেবা কেবল বৈধ ব্যবসায়িক আউটরিচের জন্য ব্যবহার করবেন এবং আপনার ও যাদের সঙ্গে যোগাযোগ করা হচ্ছে তাদের ক্ষেত্রে প্রযোজ্য ইমেইল, স্প্যামবিরোধী, গোপনীয়তা ও ভোক্তা-সুরক্ষা আইন মানবেন। এর মধ্যে CAN-SPAM, GDPR ও স্থানীয় সমতুল্য বিধিও রয়েছে।',
        'প্রতারণামূলক, আপত্তিকর, বেআইনি বা বিভ্রান্তিকর কিছু পাঠাতে আমাদের সেবা ব্যবহার করবেন না। এর মধ্যে ভুয়া প্রেরকের তথ্য, কৃত্রিম তাড়া, কিংবা আপনি কে বা কী বিক্রি করেন সে বিষয়ে ভুল ধারণা দেওয়া বিষয়বস্তুও পড়ে।',
        'যারা যোগাযোগ না করতে বলেছেন তাদের সঙ্গে যোগাযোগ করতে, অথবা কোনো আনসাবস্ক্রাইব এড়িয়ে যেতে আমাদের অনুরোধ করবেন না।',
        'আপনার লগইনের তথ্য গোপন রাখবেন এবং অন্য কেউ আপনার অ্যাকাউন্ট ব্যবহার করেছে বলে সন্দেহ হলে দ্রুত আমাদের জানাবেন।',
      ],
    },
    {
      id: 'sending',
      heading: 'পাঠানো, আনসাবস্ক্রাইব ও ডেলিভারেবিলিটি',
      body: [
        'ইমেইল আপনার নিজের যাচাইকৃত ডোমেইন থেকে ধাপে ধাপে নির্ধারিত সময়সূচিতে পাঠানো হয়। আমরা সঠিক ইমেইল অথেন্টিকেশন (SPF, DKIM ও DMARC) সেট করি ও আশা করি, ধীরে ধীরে ওয়ার্ম-আপ করি এবং তালিকা পরিষ্কার রাখি।',
        'প্রতিটি ইমেইলে একটি কার্যকর আনসাবস্ক্রাইব থাকে। কেউ “না” বললে সেটি চূড়ান্ত: আমরা সেই ঠিকানা সাপ্রেস করি এবং আর কখনো যোগাযোগ করি না। যিনি উত্তর দেন, তিনি সঙ্গে সঙ্গে সিকোয়েন্স থেকে বেরিয়ে যান। আমরা প্রতিদিন বাউন্স, অভিযোগ ও উত্তর পর্যালোচনা করি।',
        'ইমেইল কোথা থেকে এসেছে বা কোন পথে গেছে তা আড়াল করার কোনো কৌশল আমরা ব্যবহার করি না, এবং এমন কৌশলের ওপর নির্ভর করে করা কোনো অনুরোধও আমরা রাখব না।',
        'অভিযোগ বা বাউন্স বেড়ে গেলে আপনার ডোমেইনের সুনাম রক্ষায় আমরা পাঠানোর গতি কমাতে বা সাময়িকভাবে বন্ধ করতে পারি। তা করলে আমরা আপনাকে জানাব।',
      ],
    },
    {
      id: 'no-guarantee',
      heading: 'ফলাফলের নিশ্চয়তা নেই',
      body: [
        'আমরা যত্নসহকারে কাজ করি, কিন্তু নির্দিষ্ট সংখ্যক উত্তর, মিটিং, বিক্রি বা আয়ের প্রতিশ্রুতি দিতে পারি না। ফলাফল এমন বিষয়ের ওপর নির্ভর করে যা আমাদের নিয়ন্ত্রণের বাইরে, যেমন আপনার অফার, আপনার বাজার, আপনার ডোমেইনের সুনাম, প্রাপকদের ইনবক্সের মান এবং যাদের সঙ্গে যোগাযোগ করা হচ্ছে তাদের সিদ্ধান্ত। প্রতিটি ইমেইল ইনবক্সে পৌঁছাবে, এই নিশ্চয়তাও আমরা দিতে পারি না, কারণ মেইলবক্স প্রদানকারীরা নিজেদের সিদ্ধান্ত নেয়।',
      ],
    },
    {
      id: 'fees',
      heading: 'ফি ও পরিশোধ',
      body: [
        'আমাদের ফি আপনার মাসিক আউটরিচের পরিমাণ অনুযায়ী নির্ধারিত হয়। মাসিক ন্যূনতম ফি ৭৫০ মার্কিন ডলার, যাতে সর্বোচ্চ ৫০০টি আউটরিচ ইমেইল অন্তর্ভুক্ত, অর্থাৎ প্রতি ইমেইল ১.৫০ মার্কিন ডলার। এর ওপরে পরিমাণ বাড়লে প্রতি ইমেইলের দাম ধাপে ধাপে কমে, এবং প্রতিটি ধাপের হার কেবল সেই ধাপের ভেতরের ইমেইলের ওপর প্রযোজ্য। তাই বেশি পরিমাণ কখনো কম পরিমাণের চেয়ে কম খরচ হয় না। বর্তমান হার এবং আপনার পরিমাণ অনুযায়ী দাম প্রাইসিং পাতায় দেখা যায়।',
      ],
      items: [
        'সব দাম মার্কিন ডলারে। আমরা লিখিতভাবে অন্য কিছু না বললে কর, ব্যাংক চার্জ ও মুদ্রা রূপান্তরের খরচ আপনার।',
        'ফি প্রতি মাসের শুরুতে অগ্রিম ইনভয়েস করা হয়।',
        'নির্ধারিত তারিখের মধ্যে ইনভয়েস পরিশোধ না হলে পরিশোধ না হওয়া পর্যন্ত আমরা সেবা স্থগিত রাখতে পারি। সেবা স্থগিত হলেও পাওনা ফি বাতিল হয় না।',
        'আমরা দাম পরিবর্তন করতে পারি। পরিবর্তন আপনার পরবর্তী বিলিং মাস থেকে কার্যকর হবে এবং কার্যকর হওয়ার আগে আমরা আপনাকে জানাব।',
      ],
    },
    {
      id: 'cancellation',
      heading: 'বাতিল করা ও ফেরত',
      body: [
        'দীর্ঘমেয়াদি কোনো বাধ্যবাধকতা নেই। আপনি যেকোনো সময় আমাদের লিখে সেবা বাতিল করতে পারেন।',
      ],
      items: [
        'বাতিল কার্যকর হয় আপনার চলতি বিলিং মাসের শেষে। তখন বা আপনি চাইলে তার আগেই পাঠানো বন্ধ হয়ে যায়।',
        'যে মাস শুরু হয়ে গেছে তার ফি ফেরতযোগ্য নয়, কারণ সেই মাসের গবেষণা ও প্রস্তুতি আগেই সম্পন্ন হয়ে যায়।',
        'আপনি যে সেবার জন্য অর্থ দিয়েছেন তা আমরা দিতে ব্যর্থ হলে আমাদের জানান। আমরা হয় সেটি ঠিক করে দেব, নয়তো যে অংশ দিতে পারিনি তার অর্থ ফেরত দেব।',
      ],
    },
    {
      id: 'data',
      heading: 'আপনার তথ্য ও সম্ভাব্য ক্লায়েন্টদের তথ্য',
      body: [
        'কাজ করতে গিয়ে আমরা দুই ধরনের তথ্য নিয়ে কাজ করি: আপনি আমাদের যা দেন (আপনার ব্রিফ, অফার, ডোমেইন এবং প্রয়োজনে আপনার নিজের গ্রাহকের তথ্য), এবং সম্ভাব্য ক্লায়েন্টদের তথ্য, যা আমরা প্রকাশ্যে পাওয়া উৎস থেকে গবেষণা করে সংগ্রহ করি।',
      ],
      items: [
        'আপনার তথ্য আমরা কেবল আপনাকে সেবা দিতে, তা নিরাপদ রাখতে এবং আইনি দায়িত্ব পালনে ব্যবহার করি।',
        'আমরা আপনার তথ্য বিক্রি করি না এবং এক ক্লায়েন্টের গোপন তথ্য অন্য ক্লায়েন্টের সেবায় ব্যবহার করি না।',
        'আপনি আমাদের যে গ্রাহক বা যোগাযোগের তথ্য দেন, তা দেওয়ার অধিকার, এবং আইন যে সম্মতি চায় তা আপনার আছে কি না, সে দায়িত্ব আপনার।',
        'আপনি সেবা বাতিল করার পরেও অপট-আউটের রেকর্ড রাখা হয়, যাতে যিনি “না” বলেছেন তার সঙ্গে আর কখনো যোগাযোগ না হয়।',
        'সেবা শেষ হলে অনুরোধে আমরা আপনার তথ্য মুছে দেব বা ফেরত দেব। আইনের কারণে বা অপট-আউট সাপ্রেশনের জন্য যা রাখা বাধ্যতামূলক, তা বাদে।',
      ],
    },
    {
      id: 'ip',
      heading: 'মালিকানা ও মেধাস্বত্ব',
      body: [
        'প্ল্যাটফর্ম, এর সফটওয়্যার, ওয়ার্কফ্লো, ডিজাইন এবং আমাদের ওয়েবসাইটের মালিক আমরা। এই শর্তাবলি আপনাকে ক্লায়েন্ট থাকাকালীন সেগুলো ব্যবহারের অধিকার দেয়, এর বেশি কিছু নয়।',
        'আপনার ব্র্যান্ড, অফার, আপনার নিজের গ্রাহকদের তালিকা এবং আপনার জন্য লেখা ইমেইলের মালিক আপনি, যখন সেগুলোর মূল্য পরিশোধ হয়ে যায়। সেবা দেওয়ার প্রয়োজন ছাড়া এগুলো ব্যবহারের অনুমতি আপনি আমাদের দেন না। আপনি সম্মত হলেই কেবল আমরা আপনাকে ক্লায়েন্ট হিসেবে উল্লেখ করতে পারব।',
      ],
    },
    {
      id: 'third-parties',
      heading: 'তৃতীয় পক্ষের সেবা',
      body: [
        'আমাদের সেবা অন্য প্রদানকারীর ওপর নির্ভর করে, যেমন ইমেইল ও ডোমেইন প্রদানকারী, তথ্যের উৎস এবং সফটওয়্যার টুল। তাদের নিজস্ব শর্ত আছে এবং তারা বদলাতে, বিকল হতে বা অনুপলব্ধ হতে পারে। তাদের সেবা বন্ধ থাকা বা তাদের সিদ্ধান্ত, যেমন কোনো মেইলবক্স প্রদানকারীর একটি বার্তা আটকে দেওয়া, এর দায় আমাদের নয়।',
      ],
    },
    {
      id: 'warranties',
      heading: 'দায় অস্বীকার',
      body: [
        'আমরা যুক্তিসংগত যত্ন ও দক্ষতার সঙ্গে সেবা দিই। এর বাইরে সেবাটি “যেমন আছে” এবং “যেমন পাওয়া যায়” ভিত্তিতে দেওয়া হয়। এটি নিরবচ্ছিন্ন বা ত্রুটিমুক্ত হবে, এমন প্রতিশ্রুতি আমরা দিই না।',
      ],
    },
    {
      id: 'liability',
      heading: 'আমাদের দায়ের সীমা',
      body: [
        'আইন যতটা অনুমতি দেয়, ততটা পর্যন্ত পরোক্ষ বা পরিণামজনিত ক্ষতির জন্য আমরা দায়ী নই, যেমন হারানো মুনাফা, হারানো ব্যবসা, হারানো সুযোগ বা সুনামের ক্ষতি। সেবা থেকে উদ্ভূত যেকোনো দাবির ক্ষেত্রে আপনার প্রতি আমাদের মোট দায় দাবির কারণ ঘটার আগের তিন মাসে আপনার পরিশোধ করা ফির মধ্যে সীমাবদ্ধ।',
        'আইনে যে দায় সীমিত করা যায় না, এই শর্তাবলির কোনো কিছু তা সীমিত করে না।',
      ],
    },
    {
      id: 'suspension',
      heading: 'আমাদের পক্ষ থেকে স্থগিত বা বাতিল',
      body: [
        'আপনি এই শর্তাবলি ভাঙলে, বেআইনি বা প্রতারণামূলক কিছু পাঠাতে বললে, আমাদের পাঠানোর সুনাম বা অন্য ক্লায়েন্টদের ঝুঁকিতে ফেললে, অথবা অর্থ পরিশোধ না করলে আমরা সেবা স্থগিত বা শেষ করতে পারি। যুক্তিসংগতভাবে সম্ভব হলে আগে জানানো হবে। অন্য যেকোনো কারণেও আমরা ৩০ দিনের লিখিত নোটিশ দিয়ে সেবা শেষ করতে পারি এবং যে সেবা আমরা দিইনি তার জন্য আপনার পরিশোধ করা ফি ফেরত দেব।',
      ],
    },
    {
      id: 'changes',
      heading: 'এই শর্তাবলির পরিবর্তন',
      body: [
        'আমরা এই শর্তাবলি হালনাগাদ করতে পারি। উপরের “সর্বশেষ হালনাগাদ” তারিখ বর্তমান সংস্করণ নির্দেশ করে। কোনো পরিবর্তন উল্লেখযোগ্য হলে কার্যকর হওয়ার আগে আমরা আপনাকে জানাব। পরিবর্তন কার্যকর হওয়ার পরেও সেবা ব্যবহার চালিয়ে গেলে আপনি হালনাগাদ শর্তাবলি মেনে নিচ্ছেন।',
      ],
    },
    {
      id: 'law',
      heading: 'প্রযোজ্য আইন ও বিরোধ নিষ্পত্তি',
      body: [
        'এই শর্তাবলি বাংলাদেশের আইন দ্বারা পরিচালিত হবে। কোনো মতবিরোধ দেখা দিলে অনুগ্রহ করে প্রথমে আমাদের লিখুন; আমরা সদিচ্ছায় তা মেটানোর চেষ্টা করব। না মিটলে বাংলাদেশের আদালতের এখতিয়ার থাকবে।',
      ],
    },
    {
      id: 'contact',
      heading: 'যোগাযোগ',
      body: [
        `এই শর্তাবলি নিয়ে প্রশ্ন আছে? ${TERMS_EMAIL} ঠিকানায় আমাদের লিখুন, অথবা এই ওয়েবসাইটের কানেক্ট পাতা ব্যবহার করুন।`,
      ],
    },
  ],
};

export const TERMS = { en, bn } as const;
export type TermsLang = keyof typeof TERMS;
