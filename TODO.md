# Implementation Plan

## ✅ Step 1: PitchDeck - Add Full-Screen Feature
- [x] Import full-screen related icons (MaximizeIcon, MinimizeIcon)
- [x] Add `isFullscreen` state and full-screen toggle logic
- [x] Add full-screen button in top-right area (next to pause button)
- [x] Add exit full-screen button when in full-screen mode
- [x] Style buttons to match design theme

## ✅ Step 2: PitchDeck - Make Slide Content Bigger
- [x] Increase container width: `max-w-[1200px]` → `max-w-[1400px]`
- [x] Increase slide stage height: `min-h-[600px]` → `min-h-[680px]` (and responsive variants)
- [x] Reduce content padding: `p-5 sm:p-8 md:p-10 lg:p-12` → `p-4 sm:p-6 md:p-8 lg:p-10`
- [x] Increase card shell widths: `max-w-3xl` → `max-w-4xl`, `max-w-4xl` → `max-w-5xl`

## ✅ Step 3: Navbar - Resize
- [x] Increase logo pill height: `h-[44px]` → `h-[48px]`
- [x] Increase logo text sizes: `text-[16px]` → `text-[18px]`, `text-[14px]` → `text-[16px]`
- [x] Increase nav link padding: `px-4 py-2` → `px-5 py-2.5`
- [x] Increase nav link text: `text-[15px]` → `text-[16px]`
- [x] Adjust spacer height: `h-[80px]` → `h-[88px]`
- [x] Adjust overall navbar padding: `pl-2 pr-2 py-2` → `pl-3 pr-3 py-2.5`
