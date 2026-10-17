# Process Story Visual Fixes

## Context
The marketing site has a Process Story page with significant visual gaps: only Chapter 1 renders a scene, Chapters 2-4 have `scene={() => null}` stubs; the Intro crowd field is empty despite having `poissonDisc` in geometry.ts.

## Current State
- ProcessStory.tsx line 192: `scene={i === 0 ? (props) => <Chapter1Scene {...props} /> : () => null}`
- Intro.tsx line 19: `<div className="story-crowd" data-crowd-field aria-hidden="true" />` (empty)
- Chapters 2-4: Missing scene files in `components/ProcessStory/scenes/`

## Solution
1. Create Chapter2.tsx, Chapter3.tsx, Chapter4.tsx following Chapter1 pattern (scrub-reversible, pure function of peff, use scene utilities)
2. Update Intro.tsx to populate crowd field with Poisson sampling
3. Update ProcessStory.tsx to render all four chapters' scenes
4. Validate with tests

## Implementation Steps
1. Implement Chapter2 scene (Research field → qualification badge)
2. Implement Chapter3 scene (Plane glyph → outreach draft)  
3. Implement Chapter4 scene (Calendar → schedule booking)
4. Populate Intro crowd field
5. Update ProcessStory
6. Run tests to validate
