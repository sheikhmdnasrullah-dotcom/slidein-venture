import Link from 'next/link';
import { Section } from '@/components/Section';
import { MonoLabel } from '@/components/System/System';
import Reveal from './Reveal';
import SectionHead from './SectionHead';
import { TWO_WAYS } from '@/content/product';

/**
 * TWO WAYS TO WORK WITH IT — software, or software operated for you
 * ---------------------------------------------------------------------------
 * The section the whole positioning rests on. Two paths, one platform, the
 * same controls and the same review step on both. The cards are given equal
 * weight on purpose: the managed service is a way of using the product, not
 * the headline of the company, so neither path may out-shout the other. What
 * differs is written in the responsibilities and the "best for" lines, not in
 * colour or size.
 */
export default function TwoWaysSection() {
  return (
    <Section id="managed" tone="anchor" pad="none" className="py-[clamp(4.5rem,9vw,8rem)]" seam>
      <div className="mx-auto w-full max-w-[1040px] px-6 md:px-10">
        <SectionHead
          index="05"
          label={TWO_WAYS.eyebrow}
          heading={TWO_WAYS.heading}
          body={TWO_WAYS.body}
          coordinate="SOFTWARE · MANAGED SERVICE"
        />

        <div className="relative mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {/* The join between the two paths — one platform, drawn once */}
          <span
            aria-hidden
            className="absolute left-1/2 top-1/2 hidden h-px w-8 -translate-x-1/2 -translate-y-1/2 bg-[var(--rule-strong)] md:block"
          />

          {TWO_WAYS.paths.map((path, i) => (
            <Reveal key={path.name} delay={i * 0.1}>
              <article
                className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-md)*1.6)] p-7 md:p-10"
                style={{
                  background: 'linear-gradient(180deg, var(--gloss), transparent 26%), var(--surface)',
                  border: '1px solid var(--rule-strong)',
                  boxShadow: 'var(--shadow-inset-top), var(--shadow-raised)',
                }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="rounded-full px-3 py-1 font-label text-[10px]"
                    style={{
                      background: 'var(--surface-2)',
                      border: '1px solid var(--rule)',
                      color: 'var(--on-surface)',
                    }}
                  >
                    {path.tag}
                  </span>
                  <span className="h-px flex-1 bg-[var(--rule)]" aria-hidden />
                </div>

                <h3 className="font-display-md mt-6 text-[clamp(1.5rem,2.6vw,2rem)] leading-tight text-[var(--on-surface)]">
                  {path.name}
                </h3>
                <p className="mt-3 max-w-[40ch] text-[1.02rem] leading-[1.7] text-[var(--muted)]">
                  {path.summary}
                </p>

                <ul className="mt-8 flex flex-col gap-4">
                  {path.points.map((point) => (
                    <li key={point} className="flex items-start gap-3.5 text-[15px] leading-[1.65] text-[var(--on-surface)]">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden
                        className="mt-[4px] shrink-0"
                      >
                        <path
                          d="m5 12.5 4.5 4.5L19 7.5"
                          stroke="var(--accent)"
                          strokeWidth="2.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {point}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-9">
                  <span className="block h-px w-full bg-[var(--rule)]" aria-hidden />
                  <p className="mt-5 font-label text-[11px] leading-[1.7] text-[var(--muted)]">
                    {path.bestFor}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.16}>
          <div className="mt-10 flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
            <p className="max-w-[64ch] text-[14.5px] leading-[1.7] text-[var(--muted)]">
              {TWO_WAYS.footnote}
            </p>
            <Link
              href="/pricing"
              className="group inline-flex shrink-0 items-center gap-2 text-[15px] font-[600] text-[var(--on-surface)] transition-colors hover:text-[var(--accent)]"
            >
              See pricing
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden
                className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
              >
                <path
                  d="M3 7h8M7 3l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
