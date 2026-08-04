import type { Metadata } from 'next';
import Section from '@/components/Section';
import SectionHead from '@/components/Steps/SectionHead';
import StepsHero from '@/components/Steps/StepsHero';
import StepsNav from '@/components/Steps/StepsNav';
import ShapeTimeline from '@/components/Steps/ShapeTimeline';
import ContentActs from '@/components/Steps/ContentActs';
import ActThree from '@/components/Steps/ActThree';
import WhyColdEmail from '@/components/Steps/WhyColdEmail';
import PhaseRail from '@/components/Steps/PhaseRail';
import YourPart from '@/components/Steps/YourPart';
import StepsCta from '@/components/Steps/StepsCta';
import DeckChapters from '@/components/Steps/DeckChapters';
import PitchDeck from '@/components/PitchDeck/PitchDeck';
import FrameworkHead from '@/components/Framework/FrameworkHead';
import FrameworkDiagram from '@/components/Framework/FrameworkDiagram';
import { DisclosureProvider } from '@/components/Steps/Disclosure';
import { META, SECTIONS } from '@/content/steps';
import { frameworkTallyLine } from '@/content/framework';

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
 *   05 chapters raised      paper-100, the five chapter run
 *   cta         terminal    paper-200, the last band
 *
 * Every band carries its own `seam` where it meets a band of a different
 * value, and the two ink bands `bleed` so they emerge rather than start.
 *
 * SECTION 05 WAS SOMEWHERE ELSE
 * The five chapter run at the end used to close /solutions, which is where the
 * navigation's Steps link pointed before this page existed. It is an argument
 * rather than a mechanism, so it reads correctly only after the 28 steps above
 * it. /solutions keeps everything else it had and is now reachable only by
 * direct link.
 */

export const metadata: Metadata = {
  title: META.title,
  description: META.description,
};

const [shape, content, whyEmail, outreach, yourPart] = SECTIONS;

export default function StepsPage() {
  return (
    /* One provider for the whole page, because the tier 3 rule is "one open at
       a time" page wide rather than per section. See Disclosure.tsx. */
    <DisclosureProvider>
    <div id="top">
      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <Section tone="hero" pad="base" className="pt-[calc(96px+clamp(3rem,6vw,6rem))]">
        <StepsHero />
      </Section>

      {/* The switch sits between the hero and the first band so it is already
          stuck to the top by the time the reader is inside a section. */}
      <StepsNav />

      {/* ── THE COMPLETE FRAMEWORK ───────────────────────────────────────
          The whole page as one drawing, before the page starts. It carries no
          section index: the five bands below are numbered 00 to 05 and this
          sits above 00, so numbering it would mean renumbering all of them.
          It is the contents page, not a chapter.

          `base` — the page's own value, paper-50. NOT paper-100: section 00
          directly below is `stage`, which on this site is a paper-100 panel,
          and two adjacent bands at the same value is no rhythm at all. This
          band is the lighter one so the step down into 00 still reads.

          `id="framework"` is what the homepage hero's CTA and the footer's
          "The Framework" link both resolve to. Neither had a target before. */}
      <Section
        id="framework"
        tone="base"
        pad="tall"
        seam
        className="scroll-mt-[120px]"
      >
        <FrameworkHead
          eyebrow="Every moving part"
          title="The Complete Framework"
          lead={`${frameworkTallyLine()} Everything below is this same picture, one step at a time.`}
          coordinate="Framework"
        />
        <FrameworkDiagram variant="complete" className="mt-16 md:mt-24" />
      </Section>

      {/* ── 00 · THE SHAPE ───────────────────────────────────────────────
          `chromeOnly`: the index rule and then the drawing. No headline on the
          canvas — see the note in SectionHead. */}
      <Section id={shape.id} tone="stage" pad="tall" seam bleed className="scroll-mt-[120px]">
        <SectionHead {...shape} chromeOnly />
        <ShapeTimeline className="mt-14 md:mt-20" />
      </Section>

      {/* ── 01 · CONTENT PRODUCTION ────────────────────────────────────── */}
      <Section id={content.id} tone="base" pad="tall" seam className="scroll-mt-[120px]">
        <SectionHead {...content} />
        <ContentActs className="mt-16 md:mt-24" />
        <ActThree className="mt-[clamp(5rem,10vw,9rem)]" />
      </Section>

      {/* ── 02 · WHY COLD EMAIL ────────────────────────────────────────── */}
      <Section id={whyEmail.id} tone="raised" pad="base" seam className="scroll-mt-[120px]">
        <SectionHead {...whyEmail} />
        <WhyColdEmail className="mt-16 md:mt-20" />
      </Section>

      {/* ── 03 · COLD OUTREACH ─────────────────────────────────────────── */}
      <Section id={outreach.id} tone="stage" pad="tall" seam bleed className="scroll-mt-[120px]">
        <SectionHead {...outreach} />
        <PhaseRail className="mt-10 md:mt-14" />
      </Section>

      {/* ── 04 · YOUR PART ─────────────────────────────────────────────── */}
      <Section id={yourPart.id} tone="base" pad="tall" seam className="scroll-mt-[120px]">
        <SectionHead {...yourPart} />
        <YourPart className="mt-16 md:mt-20" />
      </Section>

      {/* ── 05 · THE WEEK, AND THE YEAR ──────────────────────────────────
          The five chapter run that used to close /solutions, which is where the
          nav's Steps link pointed. It reads as the answer to "and then what",
          so it belongs after the mechanism rather than before it. It brings its
          own heading and its own index rail — see DeckChapters. */}
      <Section id="chapters" tone="raised" pad="tall" seam className="scroll-mt-[120px]">
        <DeckChapters />
      </Section>

      {/* ── CTA ────────────────────────────────────────────────────────── */}
      <Section tone="terminal" pad="base" seam>
        <StepsCta />
      </Section>

      {/* ── FRAMEWORK (moved from homepage) ───────────────────────────── */}
      <PitchDeck />
    </div>
    </DisclosureProvider>
  );
}
