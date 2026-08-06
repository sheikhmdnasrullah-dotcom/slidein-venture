import Hero from "@/components/Hero/Hero";
import Section from "@/components/Section";
import FrameworkEngines from "@/components/Framework/FrameworkEngines";

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
 * still draws all seventeen service nodes at the top of /steps (currently
 * pulled from navigation, see that page's own header). FrameworkWeave and
 * FrameworkThread are no longer mounted anywhere and are kept only so a
 * decision here can be reversed by changing one import back. All four read
 * content/framework.ts, so no two of them can describe different businesses.
 *
 * THE PAGE ENDS HERE. A second section used to follow — an "The Framework"
 * heading over InputSlide, a standalone deck slide — but that repeated the
 * headline a beat after FrameworkEngines' own origin line already said it,
 * and added nothing past the outcome card. The origin line now reads "The
 * Framework" directly and the page ends on FrameworkEngines' outcome card.
 */
export default function Home() {
  return (
    <>
      <Hero />

      {/* NO SEAM, AND THAT IS THE FIX FOR THE "ORANGE BAND" COMPLAINT.
          This band is `tone="base"` — the page's own value — so there is no
          value change to mark, and a `seam` hairline across the full width was
          drawing a horizontal line where nothing actually joins. That line,
          plus FrameworkEngines' own decorative glow, was what made the section
          read as a separate warm panel dropped onto a white page.

          The glow is now a low-alpha wash masked to nothing at its edges (see
          FrameworkEngines), the seam is gone, and `bleed` stays because its
          gradient runs to --bleed-to, which on this tone IS the page fill — an
          invisible run-up rather than a join. The warmth survives; the edge
          does not. */}
      <Section
        id="framework"
        tone="base"
        pad="tall"
        bleed
        className="scroll-mt-[120px]"
      >
        <FrameworkEngines className="mt-4 md:mt-6" />

        {/* Secondary action, directly under the outcome plate the band ends
            on. Deliberately NOT a second orange object: the outcome card above
            it is the only filled orange in this band, so this one is paper with
            an orange edge that arrives on hover. `group` is on the anchor —
            without it the arrow's `group-hover:translate-x-1` had no group to
            hang off and the glyph never moved. */}
        <div className="mt-12 flex justify-center">
          <a
            href="/process"
            className="btn-premium group inline-flex items-center gap-2.5 rounded-[var(--radius-pill)] px-7 py-4 text-[15px] font-medium text-[var(--on-surface)] transition-[border-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-[var(--accent-ring)]"
            style={{ background: 'var(--surface)', border: '1px solid var(--rule-strong)' }}
          >
            See the whole process
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              aria-hidden
              className="text-[var(--accent)] transition-transform duration-500 ease-out group-hover:translate-x-1"
            >
              <path d="M3 7.5h9M8 3.5l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </Section>
    </>
  );
}
