---
type: project
description: Owner-ordered quiet CTA design, restore spec
---

# Owner-ordered quiet hero CTA (2026-10-17, still in force)

## Rule
The hero "See How It Works" CTA is a QUIET dark brand pill per explicit owner
order ("overly designed... should match brand theme"). No session may replace
it with an animated or glassy treatment:

- Dark pill `bg-[var(--scaffold-button)]`, white text, static accent ring +
  white triangle play mark. No progress arc, no glow halo, no bloom wash,
  no hover lift/shadow, no text-color hover, no sliding icon.
- Hover does ONE thing: slight lighten
  (`hover:bg-[color-mix(in_oklch,var(--scaffold-button)_88%,white)]`).
- Focus ring required: nav-pattern 2px accent 60% + offset; base shadow MUST
  be the `shadow-[var(--scaffold-shadow-button)]` class (an inline box-shadow
  swallows the ring — this was debugged already).
- Banned on this button (project hard-no list applies): backdrop-blur /
  glassmorphism, custom orange rgba values (use `var(--color-brand)` /
  `var(--scaffold-accent)` tokens only), hover glow halos.
- `app/styles/assemble.css` must NOT contain `.hero-cta-arc` /
  `.hero-cta-tri` rules (deleted by owner order).

## Background
A peer's animated CTA (arc + glow + bloom + lift) was simplified per owner
order, verified (tsc/eslint clean, spec 6/6, screenshots), then overwritten
~09:19 by a white glass pill with backdrop-blur, custom rgba(255,85,0)
orange, and hover glow. Exact restorable spec (code blocks + verification
record) is preserved at `/tmp/owner-cta-quiet/restore-note.md`. Only the
owner can approve a different CTA design.
