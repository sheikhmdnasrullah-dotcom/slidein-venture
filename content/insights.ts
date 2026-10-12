/**
 * INSIGHTS — verified user-authored articles and strategic analysis.
 *
 * Per AGENTS.md:
 * - Content Integrity & Zero AI Assumptions
 * - Only verified user-provided copy and data structures
 * - No fake metrics, no synthetic blog articles
 */

export interface SystemComponent {
  leadBold: string;
  body: string[];
}

export interface InsightSection {
  index: string;
  heading: string;
  paragraphs: string[];
  components?: SystemComponent[];
}

export interface InsightArticle {
  day: string;
  date: string;
  formattedDate: string;
  topic: string;
  slug: string;
  articleUrl: string;
  status: string;
  wordCount: string;
  readTime: string;
  title: string;
  excerpt: string;
  intro: string[];
  sections: InsightSection[];
  footerNote: string;
}

export const ARTICLES: InsightArticle[] = [
  {
    day: '01',
    date: '2026-10-13',
    formattedDate: 'October 13, 2026',
    topic: 'Building an AI-Powered Buyer Pipeline for Executive Mortgage Advisors',
    slug: 'ai-pipeline-emas',
    articleUrl: 'www.slideinventure.com/ai-pipeline-emas',
    status: 'FINAL',
    wordCount: '~1,580',
    readTime: '7 min read',
    title: 'You Have 6 Referrals This Month. Last Month It Was 11. The Month Before That, 14.',
    excerpt:
      'Marcus has been a loan officer for nine years. He is a good closer with strong agent relationships and a clear sense of his rates. Last quarter was his best in two years. This quarter has been different.',
    intro: [
      'Marcus has been a loan officer for nine years. He is a good closer with strong agent relationships and a clear sense of his rates. He knows the market in his area the way someone knows a neighborhood they grew up in. Last quarter was his best in two years.',
      'This quarter has been different.',
      'His referral count dropped for the third consecutive month. He is calling his real estate agent contacts more often, showing up at more networking events, refreshing his pipeline spreadsheet hoping numbers rearrange themselves into something better.',
      'They do not.',
      'This is not a story about a bad loan officer. Marcus is not a bad loan officer. He is an excellent one. The problem is structural and has nothing to do with his skill level. He built his business on a foundation that was never designed to be a system. Referrals are a reward for relationships, not a repeatable pipeline. They arrive when someone thinks of you, not when you need revenue. And referral networks are fragile in ways that only become obvious after a bad month.',
      'When the spring buying season softens, when a top-producing real estate agent retires or switches to a builder-affiliated lender, when broader economic anxiety causes buyers to pause, the referral-only pipeline does not slow down gradually. It stops.',
      'What Marcus actually needs is not another networking event. He needs a machine that finds buyers who are actively looking, surfaces them before they call a competitor, and gets a qualified meeting on his calendar without requiring him to personally chase every warm signal. That machine exists. It runs on a combination of targeted content, behavioral intelligence, and automated outreach. Here is how it works.',
    ],
    sections: [
      {
        index: '01',
        heading: 'The Problem Is Not That You Need More Leads',
        paragraphs: [
          'Most loan officers who come to us describe their situation as a lead problem. They need more leads. They are not getting enough introductions. They would pay for more referrals if referrals could be bought.',
          'The framing is almost always wrong.',
          'The actual problem is a structural one: their pipeline is entirely dependent on sources they cannot control, repeat, or scale. Industry data from NMLS tracking shows that the pool of actively producing loan officers contracted sharply between 2024 and 2025, not because these professionals were unqualified but because the referral model they relied on stopped performing consistently when purchase volume tightened. When your pipeline depends on three real estate agents sending you buyers, and those agents hit a slow patch or shift their loyalty to a lender offering rebates, you have no fallback. You have a streak, and the streak ends.',
          'The mortgage buying cycle makes this worse. A potential borrower has a narrow window of readiness. They go from researching to pre-qualified to under contract quickly, and during that window they will call whoever is most visible to them. If your visibility depends entirely on someone else recommending you at the right moment, you miss most of those windows by default.',
          'A pipeline system reverses this dependency. Instead of waiting for someone to remember your name, the system makes sure the right people see you consistently, before they are ready, so that when they are ready, you are the obvious call.',
        ],
      },
      {
        index: '02',
        heading: 'What the System Actually Looks Like',
        paragraphs: [
          'An AI-integrated pipeline for an EMA is not a CRM with color-coded stages. It is a set of interconnected systems that each do one specific job. Taken together, they move a stranger from "I don\'t know this advisor exists" to "I have a call booked with them."',
          'Here is the sequence as it actually runs.',
        ],
        components: [
          {
            leadBold: 'The content layer builds authority over time.',
            body: [
              'The EMA publishes specific, useful content on LinkedIn and on their website. Not generic rate commentary. Not "what is a mortgage" explainers aimed at beginners. Articles, short videos, and scenario breakdowns that speak directly to questions a real homebuyer is asking during the pre-qualification phase. The goal is not a viral post. The goal is that when someone in the target market searches or scrolls, the EMA\'s perspective is the one they keep encountering. This takes three to five weeks of consistent output before it compounds, and most professionals underestimate how specific the content needs to be to actually work.',
              'Content that addresses "can I buy a home if I am self-employed and my income varies" will reach and convert a specific buyer. Content that says "contact me for great rates" will reach no one.',
            ],
          },
          {
            leadBold: 'Signal intelligence identifies who is behaving like a ready buyer.',
            body: [
              'When content and any outreach send traffic to the EMA\'s website, a lightweight tracking layer identifies visitor behavior. Tools like RB2B or Warmly can identify, at the company or sometimes person level, who has spent meaningful time on the pre-qualification page, the calculator tool, or the rates section. This is not surveillance. It is behavioral data of the same type that banks, insurance companies, and real estate portals have used for a decade. The EMA is accessing information that larger institutions take for granted.',
              'A visitor who matches your buyer profile and spends four minutes on your pre-qualification page is not just a lead. It is a timed signal. The system logs it and triggers the next action automatically.',
              'One important note on match rates: real-world identification typically covers 30 to 40 percent of qualifying traffic, not the 80-plus percent that some vendors advertise. A system built with honest expectations handles this well. One built on inflated projections does not.',
            ],
          },
          {
            leadBold: 'Automated outreach handles the follow-up sequence.',
            body: [
              'The triggered action is a sequenced outreach, typically an email, a LinkedIn message, and in some cases a short personalized video message. Not a generic "I noticed you visited my site" note. A message calibrated to whatever the signal implied the prospect was evaluating. The sequence runs automatically, respecting opt-out requirements and timing windows. The EMA does not manually chase each signal. They check their dashboard, see who is warm and at what stage, and step in for the human parts: the phone call, the pre-qualification conversation, the relationship.',
              'Research on AI appointment-setting in mortgage contexts shows that inbound leads handled through automated AI engagement sequences convert to booked calls at 25 to 35 percent, compared to 8 to 12 percent for traditional manual follow-up. The difference is response speed and consistency. An automated system responds within 60 seconds at any hour. A busy loan officer responds when they get around to it, which is often too late.',
            ],
          },
          {
            leadBold: 'A qualifying booking layer filters who lands on the calendar.',
            body: [
              'When a prospect reaches a warm enough point in the sequence, they receive a link to a calendar booking page that asks two or three pre-qualification questions before a slot can be confirmed. Purchase timeline. General price range. Whether they are currently working with an agent. The EMA\'s calendar fills with people who have already self-selected as serious, not with unscreened curiosity calls.',
            ],
          },
        ],
      },
      {
        index: '03',
        heading: 'What Month One Looks Like, and What Month Three Looks Like',
        paragraphs: [
          'This is the part that most agencies selling lead generation services deliberately skip, because it complicates the pitch.',
          'Month one is infrastructure. The content layer is being built and published. The tracking tools are being connected to the website. The outreach sequences are being tested for reply rates. Bookings during month one are typically zero to a handful, mostly from LinkedIn content that gets traction early among existing connections who already know the EMA.',
          'Month two is where real data appears. You know which content topics drive traffic and which ones get ignored. You know which outreach messages generate replies and where in the sequence prospects stop responding. Everything gets adjusted based on what is actually happening, not what was projected in the setup meeting.',
          'Month three is when the system starts paying for itself. Content is compounding in search and on LinkedIn. The signal layer is identifying real prospects regularly. The outreach sequences are refined. Bookings increase because the system is working from real behavioral data rather than guesswork.',
          'The honest version: how quickly this curve arrives depends on the market the EMA operates in and how established their LinkedIn presence already is. Lenders in competitive metros with no existing content presence will ramp slower than those who already have a professional profile and some audience. What holds consistently, across the patterns I have watched, is the direction: every month the referral-dependent lender is at the mercy of relationships they cannot control, and every month the system-based lender\'s pipeline gets stronger because content and behavioral data compound.',
        ],
      },
      {
        index: '04',
        heading: 'What Changes When You Have a System',
        paragraphs: [
          'The referral-only lender checks their phone on Monday morning hoping something came in over the weekend.',
          'The lender with a system opens their dashboard Monday morning and sees eight prospects who engaged with content in the past week, three who are in active outreach sequences, and two who have booked calls for later in the week. They know who is warm, who is cooling, and who just scheduled. They spend their calls on conversations, not on prospecting.',
          'The difference is not effort. Marcus is already working hard. The difference is whether the business is built as a system or as a series of relationship bets.',
        ],
      },
      {
        index: '05',
        heading: 'One Thing to Do This Week',
        paragraphs: [
          'Take ten minutes and map where your last ten new clients came from. Write it down in plain terms. If more than six of those clients came from a source you cannot predict, repeat, or scale, you do not have a pipeline. You have a streak.',
          'That is not a criticism. It is the diagnostic. Streaks end. Systems do not have to.',
          'If you want to understand what a built pipeline system looks like for your specific firm size and target market, the full breakdown of how each component works together is on the site.',
        ],
      },
    ],
    footerNote: '*Full version published on www.slideinventure.com/ai-pipeline-emas*',
  },
];

export function getArticleBySlug(slug: string): InsightArticle | undefined {
  return ARTICLES.find((article) => article.slug === slug);
}
