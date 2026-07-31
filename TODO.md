# Redesign Orbit - Progress Tracker

## Steps

- [x] Step 0: Analyze codebase and create plan (done)
- [x] Step 1: Rewrite `OrbitSlide.tsx` — New workflow-based orbit layout
  - [x] New node positions based on production sequence
  - [x] Orange animated path connecting nodes in order
  - [x] LinkedIn Posts pointing toward next slide
  - [x] Export constants for Distribution slide
- [x] Step 2: Create `DistributionSlide.tsx` — New Content Distribution slide
  - [x] Same visual language as orbit
  - [x] Platform nodes: YouTube, Spotify, Apple Podcasts, Instagram, TikTok, LinkedIn, X, Newsletter, Website
  - [x] Animated flow from center to platforms
- [x] Step 3: Update `PitchDeck.tsx` — Add distribution slide, update indices
  - [x] Add DistributionSlide after Orbit slide
  - [x] Update SLIDE_META
  - [x] Update slide indices
- [x] Step 4: Test build (compiled successfully)

