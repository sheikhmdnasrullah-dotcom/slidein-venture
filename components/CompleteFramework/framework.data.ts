/**
 * Framework content + artwork slots.
 *
 * ── Adding your own logo or image ────────────────────────────────────────────
 * Drop the file in `public/logos/` and point `logo` at it:
 *
 *   { id: 'youtube', label: 'YouTube', logo: '/logos/youtube.svg' }
 *
 * Anything works — SVG, PNG, WebP, JPG. Square art looks best; it renders
 * inside a rounded chip with `object-contain`, so nothing gets cropped.
 * If `logo` is omitted, the built-in line icon (`icon`) is used instead.
 * `logo` also accepts a full https:// URL if the domain is allowed in
 * next.config.ts — local files need no configuration.
 */

export const BRAND = {
  /** Centre hub artwork. e.g. '/logos/slidein-mark.svg' */
  logo: undefined as string | undefined,
  name: 'SlideIn Venture',
};

export type IconKey =
  | 'video'
  | 'target'
  | 'film'
  | 'mic'
  | 'shorts'
  | 'linkedin'
  | 'article'
  | 'inbox'
  | 'calendar'
  | 'layers'
  | 'send';

export interface FlowItem {
  id: string;
  label: string;
  /** Path or URL to custom artwork. Overrides `icon`. */
  logo?: string;
  icon: IconKey;
  caption?: string;
  /** Which engine this output belongs to — drives the hover highlight. */
  group?: 'content' | 'outreach';
}

/** Left column — what the client hands over. Once. */
export const INPUTS: FlowItem[] = [
  {
    id: 'in-record',
    label: 'You Record the Video Once',
    icon: 'video',
    group: 'content',
  },
  {
    id: 'in-targets',
    label: 'We Discuss Your Ideal Client Profile',
    icon: 'target',
    group: 'outreach',
  },
];

/** The two engines. */
export interface Engine {
  id: 'content' | 'outreach';
  label: string;
  tagline: string;
  icon: IconKey;
  logo?: string;
  items: { id: string; label: string; description: string; logo?: string }[];
  outcome: { label: string; caption: string; icon: IconKey };
}

export const ENGINES: Engine[] = [
  {
    id: 'content',
    label: 'Content Production',
    tagline: 'One recording becomes everything you publish this month.',
    icon: 'film',
    items: [
      {
        id: 'c-audio',
        label: 'Audio & Video Editing',
        description:
          'You send the raw file, I send back a finished episode. The stumbles, the dead air, all of that gets trimmed. The audio gets balanced and cleaned. Then the video gets edited properly. Cuts, visuals, references, captions, whatever the moment calls for to keep the audience engaged.',
      },
      {
        id: 'c-notes',
        label: 'Show Notes',
        description:
          'Show notes pulled straight from the episode, broken down by topic with timestamps. Makes it easy to jump to the exact part you want in a long episode. Works for YouTube, podcast apps, and your website.',
      },
      {
        id: 'c-transcripts',
        label: 'Transcripts',
        description:
          'Clean, timestamped transcript of the finished episode, every speaker labeled, every name spelled right. Easy to read, easy to search, and ready to pull articles and posts from later.',
      },
      {
        id: 'c-clips',
        label: 'Short Form Clips',
        description:
          'The best 30 to 60 second clips from every episode, captioned so they play fine with the sound off. B-roll, text overlays, whatever it takes to stop the scroll. Sized right for LinkedIn, YouTube Shorts, and Instagram Reels.',
      },
      {
        id: 'c-thumbnails',
        label: 'Thumbnails & Cover Art',
        description:
          "Custom thumbnail designed for every episode according to your brand's tone. If you don't have a visual style yet, I build one and keep it consistent going forward.",
      },
      {
        id: 'c-blog',
        label: 'Blog Articles',
        description:
          'The conversations throughout the whole video turned into written articles that perfectly imitate and reflect your voice, with proper research, real structure, and real opinions in them. Perfect for dropping into blogs or newsletters.',
      },
      {
        id: 'c-social',
        label: 'LinkedIn & Social Posts',
        description:
          'Every episode becomes several LinkedIn posts, pulled from what you actually said, in the way you actually talk.',
      },
      {
        id: 'c-publish',
        label: 'Publishing & Scheduling',
        description:
          'Everything goes out on a real schedule after getting your final approval. Titles, descriptions, and tags get filled in properly without your continuous supervision.',
      },
    ],
    outcome: {
      label: 'Consistent Multi-Platform Presence',
      caption: 'builds trust',
      icon: 'layers',
    },
  },
  {
    id: 'outreach',
    label: 'Manual Outreach',
    tagline: 'Hand-built lists, human-written emails, replies sorted for you.',
    icon: 'send',
    items: [
      {
        id: 'o-icp',
        label: 'ICP Mapping',
        description: "Nail down exactly who's worth reaching out to: industry, company size, job title, budget, location. This becomes the filter for everything after."
      },
      {
        id: 'o-lists',
        label: 'Hand-Built Prospect Lists',
        description:
          "Before a single email goes out, we sit down and define exactly who's worth reaching out to. We build a real filter based on industry, company size, role, and whether they actually have the budget and the need. Everything after this step is judged against it.",
      },
      {
        id: 'o-build',
        label: 'Manual List Building',
        description:
          "Every person on your list is found and verified by hand using LinkedIn, YouTube, and their own website. We avoid relying on generic lead databases, then read what they've actually said publicly first, so every email copy gets a real context for personalization.",
      },
      {
        id: 'o-verify',
        label: 'Email Verification',
        description:
          "Every address gets checked before it's ever used to make sure it won't bounce, so dead or fake emails never hurt your sender reputation.",
      },
      {
        id: 'o-pain',
        label: 'Pain Point Intelligence',
        description:
          "Messages built around what we actually found on them, episode titles, quotes, recent launches.",
      },
      {
        id: 'o-write',
        label: 'Email Writing',
        description:
          "We'll make sure every email references something real about that person, or a problem they've talked about publicly, then naturally position your service/product as a solution without sounding like a marketing pitch or a generic sales email. The writing will follow a strict humanizer pass. Also, no two email topics will be the same.",
      },
      {
        id: 'o-send',
        label: 'Sending & Follow-Ups',
        description:
          'Emails will go out in a real sequence, spaced and timed the way a person would send them, aligned with each prospect\'s local working hours.',
      },
      {
        id: 'o-sort',
        label: 'Reply Sorting & Handoff',
        description:
          "You don't have to dig through your inbox looking for the ten people who actually said yes. Every reply gets read and sorted, and the ones worth your time land in front of you with the context already attached.",
      },
    ],
    outcome: {
      label: 'Qualified Conversations',
      caption: 'expands reach',
      icon: 'inbox',
    },
  },
];

/** Right column — what lands in the world. Swap in real platform logos here. */
export const OUTPUTS: FlowItem[] = [
  { id: 'out-video', label: 'Long-Form Video', icon: 'film', group: 'content' },
  { id: 'out-podcast', label: 'Podcast Episodes', icon: 'mic', group: 'content' },
  { id: 'out-shorts', label: 'Shorts & Reels', icon: 'shorts', group: 'content' },
  { id: 'out-social', label: 'LinkedIn Posts', icon: 'linkedin', group: 'content' },
  { id: 'out-blog', label: 'SEO Articles', icon: 'article', group: 'content' },
  { id: 'out-inbox', label: 'Warm Replies', icon: 'inbox', group: 'outreach' },
  { id: 'out-calls', label: 'Booked Calls', icon: 'calendar', group: 'outreach' },
];
