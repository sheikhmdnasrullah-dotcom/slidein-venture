# Old copy — preserved before the zero-text redesign (2026-10-16)

Every user-visible string that was removed from rendering on the marketing
site homepage/nav during the hero + scaffold rebuild, captured verbatim so
nothing is lost. The owner will re-enter text through `content/home.ts`
skeleton slots.

## From `content/product.ts` → `HERO` (was rendered by `components/Hero/Hero.tsx`)

```ts
export const HERO = {
  headline: {
    lead: 'An agentic system that',
    phrases: ['finds prospects.', 'captures leads.', 'reaches out to them.'],
    phraseMs: [2200, 2200, 2800],
  },
} as const;
```

## From `content/product.ts` → `NAV` (was rendered by `components/Navbar/Navbar.tsx`)

```ts
export const NAV = {
  links: [
    { label: 'Process', href: '/process' },
    { label: 'Insights', href: '/insights' },
    { label: 'Pricing', href: '/pricing' },
  ],
  cta: { label: 'Connect', href: '/contact' },
  openSource: {
    label: 'SlideIn on GitHub — open source',
    href: 'https://github.com/sheikhmdnasrullah-dotcom/SlideIn',
  },
} as const;
```

## Hardcoded in `components/Navbar/LetsTalkButton.tsx` (line 98)

```
Connect
```

## Note on the rejected screenshot (`current-hero.png`)

The copy visible in the rejected hero screenshot — "Outreach written from real
research.", "Researched by hand. Reviewed by a person.", "Every prospect found
and verified by hand…", the "Jane Doe" profile/review-queue cards, "Approved to
send", "Positive reply", "Your hiring plan, Jane" — does not exist verbatim in
this repository or its git history (searched with `git log -S` across all
branches, and the sibling `sv/` tree). Nothing of it could be preserved from
here; if a copy of that working tree surfaces, its strings belong in this file.

## Untouched

`content/product.ts` section copy (PROBLEM, WORKFLOW, PLATFORM, CAPABILITIES,
TWO_WAYS, CONTROL, USE_CASES, CLOSING), `content/steps/*`, `content/insights.ts`,
`content/contact.ts`, `content/framework.ts` — all remain in the codebase
verbatim; those sections are unmounted, not deleted, exactly as before this
redesign.
