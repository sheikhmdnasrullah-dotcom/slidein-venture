---
type: project
description: Owner-ordered permanent removal of hero preview slot
---

# CLOSED: hero preview / dashboard below the CTA (owner order 2026-10-17)

## Rule
The hero preview block (`data-testid="hero-preview"` in `components/Hero/Hero.tsx`)
and `components/Hero/ProductPreview.tsx` are REMOVED by explicit owner decision.
No session may re-add them:

- Do NOT re-create `components/Hero/ProductPreview.tsx`.
- Do NOT re-add the `ProductPreview` import or the `hero-preview` render block in `Hero.tsx`.
- Do NOT change `tests/hero-layout.spec.ts` back to presence assertions — it must
  assert `previewPx === -1` (absence) at every width, including the PASS-column computation.

## Background
The owner twice ordered removal of the dashboard below the "See How It Works" CTA
(a generic/irrelevant panel), then adjudicated KEEP REMOVED against a peer's rebuilt
two-pane console, then ordered "force him to stop adding it." The peer console work is
fully preserved at `/tmp/peer-console-backup/` (Hero.tsx, ProductPreview.tsx,
screenshot.png) — nothing was lost. Only the owner can reopen this slot.

## All other hero work is unaffected
StoryModal, CTARow, TextSlot, gutter tiles, tokens, and layout remain peer-owned
and editable. This rule covers ONLY the preview/console slot + its spec assertions.
