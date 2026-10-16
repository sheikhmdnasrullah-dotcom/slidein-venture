import { Section } from '@/components/Section';
import Reveal from './Reveal';
import SectionHead from './SectionHead';
import { Heading, Text, Eyebrow } from '@/components/Type/Type';
import { CAPABILITIES } from '@/content/product';

/**
 * CAPABILITIES — four areas, not a card wall
 * ---------------------------------------------------------------------------
 * The brief for this section is explicit: group features into a small number
 * of understandable product areas, explain the benefit rather than the
 * mechanism, and do not fill the page with repetitive feature cards. So: four
 * panels in a two-by-two, each with a one-line statement of what it does for
 * the operator and three specifics under it. The specifics are the checks the
 * platform actually runs, not adjectives.
 */
export default function CapabilitiesSection() {
  return (
    <Section tone="raised" pad="none" className="py-[clamp(4.5rem,9vw,8rem)]" seam>
      <div className="mx-auto w-full max-w-[1040px] px-6 md:px-10">
        <SectionHead
          label={CAPABILITIES.eyebrow}
          heading={CAPABILITIES.heading}
          body={CAPABILITIES.body}
        />

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {CAPABILITIES.groups.map((group, i) => (
            <Reveal key={group.name} delay={(i % 2) * 0.08}>
              <article
                className="group/cap relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-md)*1.5)] p-7 transition-shadow duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:shadow-[var(--shadow-float)] md:p-9"
                style={{
                  background: 'linear-gradient(180deg, var(--gloss), transparent 30%), var(--surface)',
                  border: '1px solid var(--rule)',
                  boxShadow: 'var(--shadow-inset-top)',
                }}
              >
                {/* Floor light, present at rest and warming on hover */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-10 -bottom-20 h-32 opacity-20 blur-3xl transition-opacity duration-700 group-hover/cap:opacity-70"
                  style={{ background: 'color-mix(in oklch, var(--accent-vivid) 20%, transparent)' }}
                />

                <div className="relative flex items-center gap-3">
                  <Eyebrow as="span" text={String(i + 1).padStart(2, '0')} />
                  <span className="h-px flex-1 bg-[var(--rule)]" aria-hidden />
                </div>

                <Heading variant="h3" text={group.name} className="relative mt-5" />
                <Text
                  variant="body"
                  text={group.detail}
                  className="relative mt-3 max-w-[46ch]"
                />

                <ul className="relative mt-6 flex flex-col gap-2.5 border-t border-[var(--rule)] pt-6">
                  {group.points.map((point) => (
                    <li key={point} className="flex items-start gap-3">
                      <span
                        aria-hidden
                        className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[var(--accent-vivid)]"
                      />
                      <Text as="span" variant="small" text={point} />
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
