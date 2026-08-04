import Hero from "@/components/Hero/Hero";
import Section from "@/components/Section";
import FrameworkHead from "@/components/Framework/FrameworkHead";
import FrameworkThread from "@/components/Framework/FrameworkThread";

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
 * THE THREAD, AND WHAT IT REPLACED TWICE. This band first rendered
 * FrameworkDiagram's `shape` variant — rounded cards on right-angle
 * connectors, the default output shape of every diagramming tool, which reads
 * as one before a single label is read. Then FrameworkWeave, which braided two
 * threads into one cord.
 *
 * It now renders FrameworkThread, which is the same business drawn to a
 * specification the braid could not meet: ONE drawing at TWO densities. Simple
 * shows four milestones a side; Complete threads seven detail nodes onto the
 * same strands and the thread grows to hold them. A braid has one length, so
 * there was nowhere for fourteen more nodes to go.
 *
 * NEITHER OF THE OTHER TWO IS DELETED. FrameworkDiagram's `variant="complete"`
 * still draws all seventeen service nodes at the top of /steps, which is where
 * the hero's primary CTA points. FrameworkWeave is no longer mounted anywhere
 * and is kept only so the decision to retire it can be reversed by changing
 * one import back. All three read content/framework.ts, so no two of them can
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
        <FrameworkThread className="mt-16 md:mt-20" />
      </Section>
    </>
  );
}
