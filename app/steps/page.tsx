import type { Metadata } from 'next';
import Section from '@/components/Section';
import SectionHead from '@/components/Steps/SectionHead';
import StepsHero from '@/components/Steps/StepsHero';
import StepsNav from '@/components/Steps/StepsNav';
import { META, SECTIONS } from '@/content/steps';

/**
 * /steps — EVERYTHING THAT HAPPENS AFTER YOU SAY YES
 * ---------------------------------------------------------------------------
 * Two services, 28 steps, one page. This file is the band structure and
 * nothing else: no copy, no layout inside a band, no numbers. Copy comes from
 * content/steps/ and each band's interior is its own component under
 * components/Steps/.
 *
 * THE VALUE RHYTHM, AND WHY IT IS NOT WHAT THE BRIEF SAID
 * The brief specified rungs called "anchor (dark)", "recessed" and "deep". This
 * site has no dark theme — it was removed, see the header of tone.css — and
 * `tone="anchor"` explicitly does not mean dark. So the brief's INTENT (two
 * deep bands, non adjacent, plus a deeper close) is mapped onto the tones that
 * actually exist, on the paper ramp the rest of the site is built from:
 *
 *   hero        apricot     the opening band
 *   00 shape    stage       ink. The thesis of the page, and the first of the
 *                           two places it stops being paper.
 *   01 content  base        paper-50
 *   02 why      raised      paper-100, a well between two larger sections
 *   03 outreach stage       ink. The second one, and non adjacent to the first.
 *   04 your part base       paper-50, back to the page's own value for the
 *                           payoff, which should feel like daylight after the
 *                           densest band on the site.
 *   cta         terminal    paper-200, the last band
 *
 * Every band carries its own `seam` where it meets a band of a different
 * value, and the two ink bands `bleed` so they emerge rather than start.
 *
 * WHAT IS NOT HERE YET
 * The five section bodies. They arrive one stage at a time and mount inside
 * these bands; the heads, anchors, rhythm and navigation are complete and
 * correct now, so each one drops in without touching this file's structure.
 */

export const metadata: Metadata = {
  title: META.title,
  description: META.description,
};

const [shape, content, whyEmail, outreach, yourPart] = SECTIONS;

export default function StepsPage() {
  return (
    <div id="top">
      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <Section tone="hero" pad="base" className="pt-[calc(96px+clamp(3rem,6vw,6rem))]">
        <StepsHero />
      </Section>

      {/* The switch sits between the hero and the first band so it is already
          stuck to the top by the time the reader is inside a section. */}
      <StepsNav />

      {/* ── 00 · THE SHAPE ─────────────────────────────────────────────── */}
      <Section id={shape.id} tone="stage" pad="tall" seam bleed className="scroll-mt-[120px]">
        <SectionHead {...shape} />
      </Section>

      {/* ── 01 · CONTENT PRODUCTION ────────────────────────────────────── */}
      <Section id={content.id} tone="base" pad="tall" seam className="scroll-mt-[120px]">
        <SectionHead {...content} />
      </Section>

      {/* ── 02 · WHY COLD EMAIL ────────────────────────────────────────── */}
      <Section id={whyEmail.id} tone="raised" pad="base" seam className="scroll-mt-[120px]">
        <SectionHead {...whyEmail} />
      </Section>

      {/* ── 03 · COLD OUTREACH ─────────────────────────────────────────── */}
      <Section id={outreach.id} tone="stage" pad="tall" seam bleed className="scroll-mt-[120px]">
        <SectionHead {...outreach} />
      </Section>

      {/* ── 04 · YOUR PART ─────────────────────────────────────────────── */}
      <Section id={yourPart.id} tone="base" pad="tall" seam className="scroll-mt-[120px]">
        <SectionHead {...yourPart} />
      </Section>

      {/* ── CTA ────────────────────────────────────────────────────────── */}
      <Section tone="terminal" pad="base" seam />
    </div>
  );
}
