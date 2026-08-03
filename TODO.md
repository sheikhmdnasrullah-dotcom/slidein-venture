# PitchDeck — Stage 3+ Build (Outcome Anchor, Tether, Payoff)

Scope confirmed: **Option B** — build the stage 3+ sequence on the already-vertical
Outreach diagram only. `FrameworkFlowSlide` and `DistributionSlide` stay horizontal.

- [x] Confirm scope (Option B) with user
- [x] Read deck architecture (`PitchDeck`, `ChapterRun`, `OutreachOSSlide`, slides)
- [x] Confirm stack (GSAP 3.15 + ScrollTrigger present; no new deps)
- [x] Create `components/PitchDeck/OutcomeAnchor.tsx` (chip + tether + store)
- [x] Wire `OutreachOSSlide` dock / tether / payoff lifecycle into the stage-3 pin window
- [x] Gate pin-zoom to ≥ 640px; add mobile sequential fallback + inline outcome card
- [x] Add IndexRail nav-click escape (disable / re-enable ScrollTriggers during jump)
- [x] Mount `<OutcomeAnchor />` once at the `PitchDeck` root
- [ ] Verify: `npx tsc --noEmit` + `npx playwright test tests/deck.spec.ts` + manual scroll check
