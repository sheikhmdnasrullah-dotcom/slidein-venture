## Design System: SlideIn Venture

> This file previously specified pink `#EC4899` + Calistoga + "Kinetic Brutalism".
> None of that was ever in the code. It has been rewritten to match what actually
> ships. Treat this file as the source of truth for visual decisions.

### Feeling

Minimal · premium · editorial · technical · architectural · systematic.

Reference points: Linear, Apple, Stripe, Raycast, Vercel, Attio, Arc.
The site should read like a product blueprint, not a marketing page.

**Not:** startup template, generic SaaS, glassmorphism everywhere, neon,
excessive gradients.

### Colour — two axes, one contract

Colour is never named in a component. Components read the **tone contract**, and
two independent axes decide what those names resolve to:

| Axis | Values | Set on | Meaning |
|------|--------|--------|---------|
| **Theme** | `day` · `night` | `data-theme` on `<html>` | What the site is made of — paper or graphite. A user choice, remembered. |
| **Tone** | `base` · `raised` · `anchor` · `terminal` | `<Section tone="…">` | How deep this band sits in the page's value rhythm. A per-section choice. |

`tone="anchor"` does **not** mean "dark". It means "the band that anchors the
page". In day that is `paper-100` over a `paper-200` well; in night it is
`ink-deep`. The section never learns which — that is the whole point, and it is
why there is no `dark:` variant anywhere in this codebase.

**The contract.** These are the only colour names a component may consume:

| Name | Job |
|------|-----|
| `--surface` | raised card fill on this band |
| `--surface-2` | inset / nested well inside a card |
| `--on-surface` | primary text and hairline ink |
| `--muted` | secondary text |
| `--faint` | **not text.** Icons, ticks, disabled, decorative hairlines |
| `--rule` / `--rule-strong` | hairline / visible divider |
| `--accent` | the orange that clears 4.5:1 **as text** on this band |
| `--accent-vivid` | the full-chroma orange, for **fills and strokes only** |
| `--accent-wash` / `--accent-ring` | low-alpha orange fill / mid-alpha border |
| `--on-accent` | text sitting on a solid orange fill |
| `--surface-glass` / `--gloss` | translucent surface / top sheen |
| `--status-live` / `--status-info` | the green / blue that is legible here |

Defined in `app/styles/tone.css`. Primitives in `app/styles/tokens.css`.

**The two rules that catch people out:**

1. **`--accent` vs `--accent-vivid` is not a style choice.** The full-chroma
   brand orange reaches only 2.73:1 on paper — it fails as text at *any* size,
   including 64px display. If you are setting type, you want `--accent`.
2. **`--faint` is not a text tier.** On `paper-50` it reaches 1.76:1. There is
   no room for a third legible text tier between `--muted` (4.52:1) and AA, so
   there isn't one. Setting type in `--faint` means you wanted `--muted`.

Orange is still ~1% of any viewport and is never a large surface. Rule 1 holds
on both axes: every orange instance is hue 42.28. A night band does not get a
different orange — it gets the same one read at a legible lightness.

**Never** `#FFFFFF` or `#000000`, anywhere, including inside a 10% hairline.
`paper-25` is the lightest value on the site; `ink-deep` is the darkest.

### Bands and the value rhythm

A page is composed of `<Section>` bands, not one continuous surface. The rhythm
is the single biggest reason a page reads as designed rather than generated:

```tsx
<Section tone="base">        {/* hero, most sections */}
<Section tone="anchor"       {/* the signature band */}
         seam bleed />
<Section as="footer"         {/* terminal weight */}
         tone="terminal" seam />
```

`seam` draws a 1px optical line at the join — brighter than either side on
graphite, darker on paper, because a bright hairline on white is invisible.
`bleed` runs a short gradient *above* the band so it emerges rather than starts.
Both live in `tone.css`; neither is decoration you can drop.

### Brand mark — there isn't one

The identity is a **wordmark**, not a logo. The drawn two-tone "S" was removed
from the navbar, the footer and the browser tab. Do not reintroduce an icon mark
without making that decision again on purpose.

`components/Brand/Logo.tsx` exports one thing: `<LogoWordmark size="20px" />`.
It is **live text**, not an SVG outline — kernable, selectable, searchable, and
it inverts with the theme for free because it reads `--on-surface` / `--accent`.

The typographic decisions live in the `.wordmark*` role in `app/styles/type.css`
and are worth reading before touching it: display optical size (not the face's
14pt text default), wordmark-tight tracking, two registers (serif name + mono
qualifier, mirroring the site's headline/`.font-label` relationship), the mono
word optically raised onto the serif's x-height rather than its baseline, and a
hair of negative left margin so the round `S` hangs.

Everything is in `em`, so `size` scales the whole lockup — name, qualifier, gap
and optical corrections together.

**The browser tab** is a solid brand-orange chip, `logos/mark/tab-chip.svg` —
no letterform, because a letterform is what stops reading at 16px in a crowded
tab strip. Regenerate `app/icon.svg`, `app/favicon.ico` and `app/apple-icon.png`
with `node scripts/build-icons.mjs`. That SVG is the one file in the repo where
a literal brand hex is correct: a favicon has no CSS cascade to read a token
from.

### Typography — three levels

| Level | Face | CSS | Use |
|-------|------|-----|-----|
| Editorial display | Fraunces (variable) | `.font-display-xl/-md/-sm` | Hero + section headlines |
| UI / body | Switzer (variable) | `.font-body` | Body copy, buttons, nav |
| Technical metadata | mono | `.font-label` | Labels, coordinates, indexes |

Pick a **role class**, never a family plus a tracking value. The roles carry
optical sizing (Fraunces `opsz`), the inverse tracking relationship, and
`text-wrap` — see `app/styles/type.css`.

Mono labels take `.font-label` and `text-[var(--muted)]`. Never a literal size.

### Background — layered, in `AmbientEnvironment.tsx`

Mounted **inside the hero only**, not in the root layout. A single wash running
the full height of the document is the texture equivalent of one value from top
to bottom — it flattened every band it crossed. Ambient light belongs to the
section that is the light source.

Layers, all nearly invisible: paper grain → 28px engineering dot grid →
drifting radial light → blueprint construction guides → floating particles →
cursor-following ambient light. Noticed after 20 seconds, not immediately.

### System primitives — `components/System/System.tsx`

`MonoLabel` · `SectionRule` · `CornerBrackets` · `Ticks`.
Compose sections from these rather than hand-rolling labels and rules.

Section rules follow `NN — Label` on the left, hairline, coordinate on the right.

### Motion

Easing is always `cubic-bezier(0.16, 1, 0.3, 1)`. Slow, confident, never flashy.
Nothing bounces. Nothing overshoots.

- Headlines reveal **by line**, never by character
- Durations 0.7–1.1s for reveals, 0.3–0.5s for hovers
- Magnetic buttons track the cursor via spring, mouse pointers only
- Every motion path must collapse under `prefers-reduced-motion`

### Buttons

`.btn-premium` in `globals.css` provides the light sweep, elevation and physical
press. Primary = ink gradient slab. Secondary = white/70 with a hairline border.
Radius `rounded-2xl` — rounded, never pill, never a plain rectangle.

### Pre-delivery checklist

- [ ] No emoji as icons — one icon family only (hugeicons is what ships today)
- [ ] `cursor-pointer` on everything clickable
- [ ] Orange stays ~1% of the viewport
- [ ] No raw hex, px or ms literal in any `.tsx` — every value comes from a token
- [ ] No `dark:` variant — tone is inherited from `<Section>`
- [ ] Type is set in `--accent` / `--muted`, never `--accent-vivid` / `--faint`
- [ ] `prefers-reduced-motion` respected
- [ ] Responsive at 390 / 768 / 1440 / 1920
- [ ] No link points at a route that does not exist (see `docs/site-architecture.md`)

### Verification — run these, do not eyeball

```bash
node scripts/verify-contrast.mjs   # static token pairs, both themes
npx playwright test                # screenshots + tone audit + axe, both themes
node scripts/squint.mjs screenshots/day_desktop_.png day-squint.png
```

`tests/tone.spec.ts` is the one that matters: it walks every text element on
every route in both themes, composites through opacity, and fails if anything
drops under 4.5:1 or if any element paints pure black or white. It also asserts
the page still *has* a value rhythm — measured in OKLab lightness, because WCAG
luminance is quadratic near black and reports a perfectly visible
graphite→ink-deep step as "flat".
