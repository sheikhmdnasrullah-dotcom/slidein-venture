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

### Color

Orange is the brand colour and appears **only where attention is needed** —
roughly 1% of any given viewport. Never as a large surface.

| Role | Hex | Use |
|------|-----|-----|
| Ink | `#0A0A0A` | Headlines, primary buttons |
| Ink light | `#4A4A4A` | Secondary text |
| Mist | `#787774` | Muted text |
| Frost | `#E8E8E4` | Hairlines, dividers |
| Paper | `#FFFFFF` | Base surface |
| Orange | `#FF6200` | Interaction, accents, eye-guidance |

**Never:** solid orange buttons, orange section backgrounds, orange blocks.
The primary CTA is an ink slab with an orange arrow and an orange hover glow.

### Typography — three levels

| Level | Face | CSS | Use |
|-------|------|-----|-----|
| Editorial display | Instrument Serif (400 only) | `var(--font-display)` | Hero + section headlines |
| UI / body | Inter | `var(--font-sans)` | Body copy, buttons, nav |
| Technical metadata | JetBrains Mono | `var(--font-mono)` | Labels, coordinates, indexes |

Instrument Serif ships **weight 400 only** — never apply a bold weight to it or
the browser synthesises faux bold.

Mono labels are always `10px`, `uppercase`, `tracking-[0.2em]`, `text-black/40`.

### Background — layered, in `AmbientEnvironment.tsx`

Seven layers, all nearly invisible: white base → paper grain → 28px engineering
dot grid → drifting radial light → blueprint construction guides → floating
particles → cursor-following ambient light. Noticed after 20 seconds, not
immediately.

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
- [ ] Instrument Serif never bolded
- [ ] `prefers-reduced-motion` respected
- [ ] Responsive at 375 / 768 / 1024 / 1440
- [ ] No link points at a route that does not exist (see `docs/site-architecture.md`)
