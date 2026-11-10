---
name: design-system-diffusion-studio-ai-video-editor-for-agents
description: Creates implementation-ready design-system guidance with tokens, component behavior, and accessibility standards. Use when creating or updating UI rules, component specifications, or design-system documentation.
---

<!-- TYPEUI_SH_MANAGED_START -->

# Diffusion Studio: AI Video Editor for Agents

## Mission
Deliver implementation-ready design-system guidance for Diffusion Studio: AI Video Editor for Agents that can be applied consistently across marketing site interfaces.

## Brand
- Product/brand: Diffusion Studio: AI Video Editor for Agents
- URL: https://diffusion.studio/
- Audience: developers and technical teams
- Product surface: marketing site

## Style Foundations
- Visual style: structured, accessible, implementation-first
- Main font style: `font.family.primary=Geist Variable-0cf583679a4981ad`, `font.family.stack=Geist Variable-0cf583679a4981ad, Geist Variable-0cf583679a4981ad fallback: Arial, sans-serif`, `font.size.base=16px`, `font.weight.base=400`, `font.lineHeight.base=25.6px`
- Typography scale: `font.size.xs=10.4px`, `font.size.sm=12px`, `font.size.md=14px`, `font.size.lg=16px`, `font.size.xl=18px`, `font.size.2xl=30px`, `font.size.3xl=36px`, `font.size.4xl=52px`
- Color palette: `color.text.primary=oklch(1 0 0)`, `color.text.secondary=oklch(0.66 0 0)`, `color.text.tertiary=oklch(0.205 0 0)`, `color.text.inverse=oklab(0.66 0 0 / 0.8)`, `color.surface.base=#000000`, `color.surface.muted=oklch(0.21 0 0)`, `color.surface.raised=oklch(0.284 0 0.27)`, `color.surface.strong=oklch(0.946 0 0)`, `color.border.default=oklch(1 0 0 / 0.09)`, `color.focus.ring=oklab(0.556 0 0 / 0.5)`
- Spacing scale: `space.1=4px`, `space.2=6px`, `space.3=8px`, `space.4=10px`, `space.5=12px`, `space.6=16px`, `space.7=20px`, `space.8=24px`
- Radius/shadow/motion tokens: `radius.xs=6px`, `radius.sm=8px`, `radius.md=10px`, `radius.lg=16777200px` | `shadow.1=oklch(0.21 0 0) 0px 0px 0px 9999px inset` | `motion.duration.instant=100ms`, `motion.duration.fast=150ms`, `motion.duration.normal=2300ms`

## Accessibility
- Target: WCAG 2.2 AA
- Keyboard-first interactions required.
- Focus-visible rules required.
- Contrast constraints required.

## Writing Tone
concise, confident, implementation-focused

## Rules: Do
- Use semantic tokens, not raw hex values in component guidance.
- Every component must define required states: default, hover, focus-visible, active, disabled, loading, error.
- Responsive behavior and edge-case handling should be specified for every component family.
- Accessibility acceptance criteria must be testable in implementation.

## Rules: Don't
- Do not allow low-contrast text or hidden focus indicators.
- Do not introduce one-off spacing or typography exceptions.
- Do not use ambiguous labels or non-descriptive actions.

## Guideline Authoring Workflow
1. Restate design intent in one sentence.
2. Define foundations and tokens.
3. Define component anatomy, variants, and interactions.
4. Add accessibility acceptance criteria.
5. Add anti-patterns and migration notes.
6. End with QA checklist.

## Required Output Structure
- Context and goals
- Design tokens and foundations
- Component-level rules (anatomy, variants, states, responsive behavior)
- Accessibility requirements and testable acceptance criteria
- Content and tone standards with examples
- Anti-patterns and prohibited implementations
- QA checklist

## Component Rule Expectations
- Include keyboard, pointer, and touch behavior.
- Include spacing and typography token requirements.
- Include long-content, overflow, and empty-state handling.

## Quality Gates
- Every non-negotiable rule must use "must".
- Every recommendation should use "should".
- Every accessibility rule must be testable in implementation.
- Prefer system consistency over local visual exceptions.

<!-- TYPEUI_SH_MANAGED_END -->
