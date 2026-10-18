# Handoff: "How it works" video player v2

## Status: COMPLETE

### What works
- Shell: frame, header (counter, controls), process rail, stage (1280x720 scaled via ResizeObserver), caption dock
- Timeline: one master GSAP timeline, 8 scenes placed at start times, labels scene-1 through scene-8
- Scene visibility: reversible set tweens at start-0.3 and end+0.3, no ghosting on scrub/jump
- Camera: per-scene slow push 1.00 to 1.035 with settle release
- Captions: driven by master timeline time, word states (upcoming/spoken/active), emphasis highlighter, fixed 2-line height, hidden `<ol>` transcript
- Reduced motion: camera moves and traveling beads disabled, scenes fade on 0.2s
- Keyboard: Space (play/pause), Left/Right (prev/next), Home/End (seek), F (fullscreen), Esc (close modal)
- Focus trap and return in modal, visible focus rings
- Mount flag: renders only when `?video=v2` is present
- Lab page: `/video-lab` with scene picker, time scrubber, speed controls, grid toggle, FPS readout
- Tooling: `npm run video:shots`, `npm run video:check`

### File map
```
how-it-works-video/
  types.ts                  -- interfaces (PlayerAPI, SceneContext, utility APIs)
  core/
    player.tsx              -- React component (frame, header, rail, stage, dock)
    usePlayer.ts            -- React hook (init, resize, autoplay, keyboard)
    createPlayer.ts         -- master timeline builder
    utils.ts                -- ctx factory + thread, cursor, camera, hud, persist, counter
    captionEngine.ts        -- caption rendering and timeline-synced state
  scenes/
    stub.ts                 -- generic stub scene builder
    s1-setup.tsx ...        -- 8 scene stubs (build exports)
  data/
    scenes.config.ts        -- scene config (id, label, caption, emphasis, dur, start)
    fixtures.ts             -- all sample data (business, sources, findings, etc.)
    generate-captions.ts    -- syllable-weighted word timing generator
    captions.json           -- generated caption data
    __tests__/generate-captions.test.ts  -- 5 unit tests
  styles/
    video-player.css        -- tokens + shell CSS (no Tailwind)
```

### ctx API reference

Each method returns a paused tween/timeline to be added to a scene timeline. None play themselves.

**ctx.eases** -- `{ out: 'power3.out', expo: 'expo.out', inout: 'power2.inOut', settle: CustomEase.create('0.22,1,0.36,1') }`

**ctx.thread.connect(fromEl, toEl, opts)** -- Returns `{ el, path, draw(dur, ease), travel(dur, ease), erase(dur) }`.
- opts: `{ route: 'elbow'|'curve', kind: 'solid'|'dashed', anchor: bool, bead: bool, radius: 12, fromSide, toSide }`
- Geometry computed in artboard coords, cached on ctx.
- Example: `const t = ctx.thread.connect(srcEl, dstEl, { route: 'elbow', bead: true }); tl.add(t.draw(1), 0);`

**ctx.cursor.moveTo(target, opts)** -- Returns timeline. `opts: { dur: 0.6, curve: false }`
**ctx.cursor.click()** -- Returns ripple timeline.
**ctx.cursor.hide()** -- Returns fade-out tween.

**ctx.camera.push(scale, x, y, dur=1.5, ease)** -- Push into a region.
**ctx.camera.release(dur=1.2)** -- Return to 1.0/0/0.

**ctx.hud.setProfile(label)** -- Shows profile chip.
**ctx.hud.pulse()** -- Bead pulse.
**ctx.hud.addTag(text)** -- Adds a tag to the chip.

**ctx.persist(el)** -- Reparents element into persist layer, preserving artboard position.

**ctx.counter(el, from, to, dur)** -- Rolls digits in tabular numerals.

### Scene stub replacement
Edit `how-it-works-video/scenes/s{N}-{id}.tsx`. Replace the body of `createStubScene(N)` return value. The builder receives `(ctx, sceneIndex)` and must return a paused `gsap.Timeline` whose duration equals `scenes[sceneIndex].duration`.

### Running
- Lab: `npm run dev`, visit `http://localhost:3000/video-lab`
- Freeze frame: `http://localhost:3000/video-lab/?scene=4&p=0.5`
- Fullscreen: `http://localhost:3000/?video=v2`
- Screenshots: `npm run video:shots` (requires dev server running)
- Checks: `npm run video:check`

### Known gaps
- Scene content is stubs (scene number + rail label + caption only). Scene art is TODO.
- `captions.json` timing is syllable-weighted heuristic, not voiceover-aligned.
- `@fontsource-variable` packages installed but not loaded via `app/fonts.ts`; CSS `@font-face` paths point to `/fonts/` which do not exist yet. Fonts will fall back to Hanken Grotesk (installed via npm). Wire up `app/fonts.ts` to self-host WOFF2.
- `video:shots` and `video:check` are ESM scripts using `playwright` and `sharp` -- dev dependencies are present.
