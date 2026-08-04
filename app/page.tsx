import Hero from "@/components/Hero/Hero";
import Section from "@/components/Section";
import FrameworkHead from "@/components/Framework/FrameworkHead";
import FrameworkWeave from "@/components/Framework/FrameworkWeave";

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
 * THE WEAVE, NOT THE DIAGRAM. This band used to render FrameworkDiagram's
 * `shape` variant — rounded cards on right-angle connectors, which is the
 * default output shape of every diagramming tool and reads as one before a
 * single label is read. FrameworkWeave states the same seven things (origin,
 * two inputs, two stages, two outputs, the cross link, the outcome, the tally)
 * as two threads that physically braid into one cord, which is the literal
 * picture of "two systems, one loop" instead of a caption claiming it.
 *
 * FrameworkDiagram is NOT deleted: `variant="complete"` still draws all
 * seventeen service nodes at the top of /steps, which is where the hero's
 * primary CTA points. Both read content/framework.ts, so the two cannot
 * describe different businesses.
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
        <FrameworkHead
          eyebrow="How it works"
          title="The Framework"
          coordinate="01 · Framework"
        />
        <FrameworkWeave className="mt-24 md:mt-32" />
      </Section>
    </>
  );
}
