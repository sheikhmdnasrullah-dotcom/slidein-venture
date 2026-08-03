# PitchDeck — vertical scrollytelling + outcome anchor

## Done

- [x] **Stage 1 — vertical restructure.** All three diagrams flow top-to-bottom,
      single column at every breakpoint. `FrameworkFlowSlide` and `OrbitSlide`
      converted from fixed-viewBox SVG to DOM cards + a measured SVG connector
      overlay (`flow/FlowCanvas.tsx`); `OutreachOSSlide` restructured in place.
      `ChapterRun` gained `ChapterDef.flow` so a vertical diagram sets its own
      height instead of being clipped into the 660px stage box.
- [x] **Stage 2 — three-part animation split** on the Outreach diagram, via
      `flow/useFlowSequence.ts`: line draw and travelling pulse scrubbed 1:1
      against scroll, card pop-in as a discrete `back.out(1.7)` trigger.
      Verified un-drawing and un-popping on scroll-up.
- [x] **Stage 3 — resolved by dropping the pin.** See the header comment in
      `OutreachOSSlide.tsx`. The slide is ~2,000px tall in a ~900px viewport, so
      `pin: true` froze it with the whole diagram below the fold; the measured
      result was a blank viewport for the entire 1,500px pin window. Took the
      brief's documented fallback — plain sequential reveal — since the diagram
      is already vertical and native scrolling is the zoom.
- [x] **Stage 4 — outcome anchor.** `OutcomeAnchor.tsx`: docked chip, live
      tether with a 300ms dash draw-in, payoff state that holds a beat and then
      retires. Tether source is the hovered module card, else the tethered
      element nearest the middle of the viewport.
- [x] Mobile / reduced-motion fallbacks: no chip below `sm` or under
      `prefers-reduced-motion`; inline outcome card in both cases; connectors
      render fully drawn and panels fully visible under reduced motion.
- [x] Rail nav un-trapped — plain anchors again, no pins to escape.
- [x] Verified: `tsc --noEmit` clean, `eslint` clean, no console errors at 390 /
      768 / 1440, no horizontal overflow, `/solutions` unaffected.

- [x] **Stage 5 — sequence on the other two diagrams.** `FrameworkFlowSlide`
      (7 wires, 8 pops) and `OrbitSlide` (18 wires, 11 pops) now call
      `useFlowSequence`. Before this, 25 of the page's 27 connectors were static
      and only the last diagram animated — which is why the page read as "no
      animation at all". Verified progressive draw and symmetric reverse:
      complete-framework 0/7 → 7/7 → 0/7, content 0/18 → 18/18 → 0/18.
- [x] CSS/GSAP conflict on the engine module cards: they carried
      `transition-all duration-300` over the exact opacity/scale properties
      GSAP pops with `back.out(1.7)`, re-easing every frame and flattening the
      overshoot. CSS now transitions only colour and shadow.

- [x] **Stage 6 — return-to-overview payoff.** The master framework's outcome
      card takes an emphasized resting state (scale 1.03 via GSAP, brighter
      border/shadow/halo via CSS) once the reader has been through both systems
      and comes back up to it. Gated on `hasDeckBeenSeen()` in `OutcomeAnchor`,
      so a first downward pass gets the plain card and the emphasis is earned.
      A trailing spacer gives it the beat the brief asks for. Verified: first
      pass `payoff:false`, return `payoff:true` at scale 1.03, relaxes on
      scrolling above it.
- [x] All three space-broken Tailwind shadows in `OutreachOSSlide` fixed
      (module cards, output panel, reply cards) — they had never rendered.
- [x] Mount gate widened 30% → 55%. A whole vertical diagram is one large React
      render; at 4x CPU throttle that was a 152ms long task landing exactly as
      the chapter arrived. Now 117ms, and off-screen.
- [x] **Production build + Lighthouse.** Build passes. Desktop 96 (TBT 0ms,
      CLS 0, LCP 1.3s). Mobile 82 (TBT 130ms, CLS 0, LCP 4.7s). Scroll under
      4x CPU throttle at 390px: median frame 16.7ms, p95 33.1ms, 18/257 frames
      over 32ms. Desktop 1x: 1/265. The brief's TBT concern does not
      materialise — scroll-linked JS is not the bottleneck.

## Open

- [ ] Real mid-range phone test. Emulation + 4x CPU throttle only so far.
- [ ] Mobile LCP 4.7s on throttled 4G. Pre-existing (hero paint), not caused by
      the scrollytelling work, but it is what holds the mobile score at 82.
- [ ] Navbar links to `/portfolio`, which does not exist — the RSC prefetch
      404s on every page load. Pre-existing, unrelated to this work.
- [ ] Two latent ScrollTrigger hazards, both currently benign, both site-wide
      CSS decisions rather than deck ones, so left alone:
      `html { scroll-behavior: smooth }` (globals.css:129) is a documented GSAP
      hazard for anchor jumps, and `body { overflow-x: hidden; position:
      relative }` (globals.css:160) computes `overflow-y: auto`, which can
      promote body to the scroller. Measured: documentElement is still the
      scroller (`docScrollTop 7222 / bodyScrollTop 0`).
- [ ] `PipelineSlide` and `WeeklyCalendarSlide` (both /solutions, untouched by
      this work) still carry space-broken Tailwind shadow classes.
