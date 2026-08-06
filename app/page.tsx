import Hero from "@/components/Hero/Hero";
import Section from "@/components/Section";
import FrameworkEngines from "@/components/Framework/FrameworkEngines";
import InputSlide from "@/components/PitchDeck/InputSlide";

/**
 * HOME — the hero, then the shape of the business.
 *
 * The framework band is `tone="raised"` — paper-100, one step in from the
 * page's own value, so it reads as a panel lifted off the page rather than as
 * more page. It is NOT `tone="stage"`, and that is a contrast decision rather
 * than a taste one: the stage tone re-points --accent to --color-brand, which
 * measures 2.73:1 on paper and fails as text at any size, and this drawing sets
 * type in --accent in four places (the two YOU tags and the two cross link
 * statements). `raised` re-points it to signal-deeper, which clears AA.
 *
 * WHAT THIS BAND HAS RENDERED, AND WHY EACH ONE MOVED ON. First
 * FrameworkDiagram's `shape` variant — rounded cards on right-angle
 * connectors, the default output shape of every diagramming tool, which reads
 * as one before a single label is read. Then FrameworkWeave, which braided two
 * threads into one cord. Then FrameworkThread: one drawing at two densities,
 * four milestones a side by default with fourteen detail nodes behind a
 * toggle. The toggle was the problem — the thing a visitor could see without
 * clicking was an outline, not the business.
 *
 * It now renders FrameworkEngines: both engines' full node lists, always
 * visible, as two cards a reader just reads top to bottom. The cross-link
 * (content builds trust / outreach expands reach) shown once, centred between
 * them, instead of duplicated as an accent row at the foot of each strand.
 *
 * NONE OF THE EARLIER THREE IS DELETED. FrameworkDiagram's `variant="complete"`
 * still draws all seventeen service nodes at the top of /steps, which is where
 * the hero's primary CTA points. FrameworkWeave and FrameworkThread are no
 * longer mounted anywhere and are kept only so a decision here can be reversed
 * by changing one import back. All four read content/framework.ts, so no two
 * of them can describe different businesses.
 */
export default function Home() {
  return (
    <>
      <Hero />

      <Section
        id="framework"
        tone="raised"
        pad="tall"
        seam
        bleed
        className="scroll-mt-[120px]"
      >
        <FrameworkEngines className="mt-4 md:mt-6" />
      </Section>

      <section className="mt-20">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <h2 className="font-display-md text-center text-[clamp(1.5rem,3vw,2.25rem)] text-[var(--on-surface)]">
            The Framework
          </h2>
        </div>
        <div className="relative mt-10 min-h-[640px] overflow-hidden">
          <InputSlide />
        </div>
      </section>
    </>
  );
}
