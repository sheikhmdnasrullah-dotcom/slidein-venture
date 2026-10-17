# Step 0: Diagnosis and Repo Check

## 1. Problem Diagnosis of Existing Compare-Slider
1. **Wipe Metaphor Limitations**: The compare-slider metaphor merely wipes between two states via clip-path. It cannot communicate the temporal progression of gathering raw data, distilling it, or compiling it into a master brain destination.
2. **Homogeneous Scattered State**: The prior scattered state used near-identical cards with generic skeleton bars, failing to convey diverse business fragments (website, pricing, spreadsheets, review cards, call transcripts).
3. **Seam Artifacts**: Mid-slide, cards were clipped in half at arbitrary pixels, and the drag knob hovered awkwardly over partial card text.
4. **Unbalanced Column Geometry**: The organized state suffered from ~35% dead space above columns, column header labels colliding with card boundaries, and an orphaned completion checkmark badge disconnected from workflow data flow.
5. **De-emphasized ICP**: The ICP target was relegated to a tiny secondary glyph beside a text slot rather than standing as the strategic nucleus.
6. **Absence of Master Playbook Payoff**: The slider concluded with a static grid without producing any central payoff artifact representing the "Master Business Playbook" that feeds downstream autonomous agents.

## 2. Repo Check & Codebase Findings
- **Repository Examined**: Local unified workspace `../saas/workspace-app` and `../saas/slidein-api`.
- **Intake Flow in SaaS (`../saas/workspace-app/lib/intake/schema.ts`)**:
  - `BusinessProfileSchema`:
    - `businessName`, `website`, `contactEmail`, `description` (mapped directly to **profile**)
    - `offers`: array of `{ name, description, idealOutcome }` (mapped directly to **offers**)
    - `icp`: `{ titles, industries, companySizes, geographies, painPoints, disqualifiers }` (mapped directly to **icps** criteria & skip chips)
- **Contradiction Identified**:
  - In the SaaS codebase, business setup is currently an intake form (`/intake`) with structured fields and tag pickers, though it accepts a company `website` for discovery. The marketing animation visualizes a scan beam extracting facts from scattered digital artifacts (website, reviews, spreadsheets, brochures).
  - *Decision*: Retain the scan beam with configurable toggle `showBeam` (default `true`) and document this intake vs. scraper nuance for owner review.
- **Profile Versioning Check**:
  - `BusinessProfileSchema` stores `version: 1` and `updatedAt: string`. Single installations maintain one active profile file with atomic tmp/rename writes without a multi-commit version tree UI.
  - *Decision*: Provide subtle version layers behind the book and columns controlled by config flag `showVersions` (default `true`) to visually reflect the master profile's versioned architecture.

## 3. Library & Framework Decision
- **GSAP Version**: `3.15.0` (pinned in `package.json`).
- **React Adapter**: `@gsap/react` `2.1.2` installed with `useGSAP` hook for scoped cleanup.
- **License**: GreenSock Standard Commercial License (GSAP is 100% free for commercial use sponsored by Webflow, including ScrollTrigger, MotionPathPlugin, DrawSVGPlugin, ScrollToPlugin, SplitText, MorphSVG, etc.).
- **Smooth Scroll**: Native scroll preserved (Lenis not added, zero touch interception).
- **Dynamic Import**: GSAP and its plugins loaded lazily via IntersectionObserver when section is within 800px of viewport to preserve hero LCP.
