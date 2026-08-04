import Hero from "@/components/Hero/Hero";
import Section from "@/components/Section";
import FrameworkHead from "@/components/Framework/FrameworkHead";
import FrameworkDiagram from "@/components/Framework/FrameworkDiagram";

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
 * The SHAPE variant, not the complete one. Seven objects: origin, two inputs,
 * two track headers, two outputs, the cross link, the outcome. The seventeen
 * service nodes live at the top of /steps, which is what the hero's primary
 * CTA points at. One drawing, two levels of detail, one visual system.
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
        <FrameworkDiagram variant="shape" className="mt-16 md:mt-24" />
      </Section>
    </>
  );
}
