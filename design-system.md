## Design System: SlideIn Venture

### Pattern
- **Name:** Storytelling + Feature-Rich
- **CTA Placement:** Above fold
- **Sections:** Hero > Features > CTA

### Style
- **Name:** Kinetic Brutalism (Mobile)
- **Mode Support:** Light ✓ Dark Primary | Dark ◐ Dark only (inverted sections)
- **Keywords:** kinetic, brutalism, motion, marquee, acid yellow, uppercase, oversized, aggressive typography, street, zine, high contrast, scroll-driven, haptic, reanimated
- **Best For:** Immersive storytelling apps, brand flagship mobile, music/culture platforms, sports apps, underground zines, limited-edition product drops, performance dashboards
- **Performance:** ⚡ Excellent (native driver required) | **Accessibility:** ⚠ WCAG AA (verify zinc body text on dark bg)

### Colors
| Role | Hex | CSS Variable |
|------|-----|--------------|
| Primary | `#EC4899` | `--color-primary` |
| On Primary | `#FFFFFF` | `--color-on-primary` |
| Secondary | `#F472B6` | `--color-secondary` |
| Accent/CTA | `#0891B2` | `--color-accent` |
| Background | `#FDF2F8` | `--color-background` |
| Foreground | `#831843` | `--color-foreground` |
| Muted | `#F1EEF5` | `--color-muted` |
| Border | `#FBCFE8` | `--color-border` |
| Destructive | `#DC2626` | `--color-destructive` |
| Ring | `#EC4899` | `--color-ring` |

*Notes: Bold pink + creative cyan [Accent adjusted from #06B6D4 for WCAG 3:1]*

### Typography
- **Heading:** Calistoga
- **Body:** Inter
- **Mood:** saas, boutique, electric, warm, editorial, bold, premium, fintech, business, dual font, human warmth
- **Best For:** B2B SaaS mobile, fintech apps, analytics dashboards, marketing tools, operations platforms
- **Google Fonts:** https://fonts.googleapis.com/css2?family=Calistoga:ital@0;1&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap
- **CSS Import:**
```css
@import url('https://fonts.googleapis.com/css2?family=Calistoga:ital@0;1&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
```

### Key Effects
Infinite marquee (Reanimated, Linear easing, 5s loop, hard clip), hero parallax (scale 1.0→1.3 + fade), sticky section header push, card flood inversion on press (bg→#DFE104, text→#000000), haptic Medium on every press, scroll-triggered interpolate transforms, 0px radius, 2px borders, 100ms color transitions

### Avoid (Anti-patterns)
- Boring design
- Hidden work

### Pre-Delivery Checklist
- [ ] No emojis as icons (use SVG: Heroicons/Lucide)
- [ ] cursor-pointer on all clickable elements
- [ ] Hover states with smooth transitions (150-300ms)
- [ ] Light mode: text contrast 4.5:1 minimum
- [ ] Focus states visible for keyboard nav
- [ ] prefers-reduced-motion respected
- [ ] Responsive: 375px, 768px, 1024px, 1440px

