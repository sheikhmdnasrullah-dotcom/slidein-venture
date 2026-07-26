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
    label: 'You Record Once',
    caption: 'One raw video file',
    icon: 'video',
    group: 'content',
  },
  {
    id: 'in-targets',
    label: 'You Name the Targets',
    caption: 'Who you want to reach',
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
          'We take your raw recording and produce a polished, publish-ready episode — cleaned audio, colour-corrected video, branded intro and outro, all handled.',
      },
      {
        id: 'c-notes',
        label: 'Show Notes',
        description:
          'SEO-optimised episode summaries with chapter timestamps, guest bios, and resource links — written to drive organic discovery.',
      },
      {
        id: 'c-transcripts',
        label: 'Transcripts',
        description:
          'Speaker-labeled transcripts in multiple formats, opening your content to search engines and unlocking repurposing workflows.',
      },
      {
        id: 'c-clips',
        label: 'Short Form Clips',
        description:
          'Up to 10 vertical clips per episode, hook-first edited with auto-captions — sized and styled for TikTok, Reels, and Shorts.',
      },
      {
        id: 'c-thumbnails',
        label: 'Thumbnails & Cover Art',
        description:
          'Custom-designed episode artwork matching your brand system, with A/B test variants included for every episode.',
      },
      {
        id: 'c-blog',
        label: 'Blog Articles',
        description:
          'Each episode becomes a 1,500+ word SEO article with keyword targeting, internal linking, and embedded calls-to-action.',
      },
      {
        id: 'c-social',
        label: 'LinkedIn & Social Posts',
        description:
          'Three to five native posts per episode — carousels, text hooks, and conversation starters written for each platform.',
      },
      {
        id: 'c-publish',
        label: 'Publishing & Scheduling',
        description:
          'We handle distribution across all podcast platforms and schedule your social content. Nothing publishes without your approval.',
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
        id: 'o-research',
        label: 'Ideal Client Research',
        description:
          'Deep-dive ICP profiling with industry mapping, role filtering, and pain-point validation so every message hits the right person.',
      },
      {
        id: 'o-lists',
        label: 'Hand-Built Prospect Lists',
        description:
          'Manually curated lists of verified decision-makers — 500 to 2,000 contacts per month, triple-verified for accuracy.',
      },
      {
        id: 'o-verify',
        label: 'Email Verification',
        description:
          'Every address validated with real-time SMTP checks before sending. Bounce rates stay below 2%, always.',
      },
      {
        id: 'o-write',
        label: 'Email Writing',
        description:
          'Human-written sequences that feel personal, not templated. Personalised first lines, A/B subject testing, single-action CTAs.',
      },
      {
        id: 'o-send',
        label: 'Sending & Follow-Ups',
        description:
          'Timezone-optimised sending with automated follow-up cadence. Volume limits respected, out-of-office replies handled automatically.',
      },
      {
        id: 'o-sort',
        label: 'Reply Sorting & Handoff',
        description:
          'Every reply categorised within hours. Hot leads get same-day alerts with booking links ready to go.',
      },
      {
        id: 'o-perf',
        label: 'Performance Tracking',
        description:
          'Weekly reporting on open rates, reply rates, and pipeline. We adjust messaging, targeting, and timing based on real data.',
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
