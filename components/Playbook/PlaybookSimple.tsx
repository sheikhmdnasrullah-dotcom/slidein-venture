'use client';

/**
 * PLAYBOOK — the four steps of the Master Business Playbook idea as a bento:
 * scattered information (tall), structured context (wide), the playbook (dark),
 * persistent knowledge (rings). Each card has its own ground; the words are the
 * owner's playbookHeadlines / playbookCaptions in content/home.ts.
 */

import '@/app/styles/home-sections.css';
import { ArrowRight } from 'lucide-react';
import { HOME } from '@/content/home';
import { Reveal, SectionHeader } from '@/components/Sections/primitives';
import {
  PersistentDiagram,
  PlaybookDiagram,
  ScatteredDiagram,
  StructuredDiagram,
} from '@/components/Visuals/GeometryDiagrams';

const CARDS = [
  { key: 'scene1', k: 'scatter', Diagram: ScatteredDiagram },
  { key: 'scene2', k: 'sorted', Diagram: StructuredDiagram },
  { key: 'scene3', k: 'book', Diagram: PlaybookDiagram },
  { key: 'scene4', k: 'rings', Diagram: PersistentDiagram },
] as const;

export function PlaybookSimple() {
  return (
    <div className="mx-auto w-full max-w-[1272px]">
      <SectionHeader
        align="center"
        section={{
          eyebrow: '',
          title: HOME.icpTagline,
          emphasis: 'Master Business Playbook',
          lead: '',
        }}
      />
      <Reveal y={12}>
        <ol className="pbx-flow">
          {CARDS.map(({ key, k, Diagram }, i) => (
            <li key={key} className="pbx-step" style={{ '--i': i } as React.CSSProperties}>
              <article className="pbx-card" data-k={k}>
                {/* how far along: four dots, filled up to this step */}
                <span className="pbx-dots" aria-hidden="true">
                  {CARDS.map((_, d) => (
                    <i key={d} data-on={d <= i} />
                  ))}
                </span>
                <div className="pbx-art">
                  <Diagram />
                </div>
                <div className="pbx-copy">
                  <h3>{HOME.playbookHeadlines[key]}</h3>
                  <p>{HOME.playbookCaptions[key]}</p>
                </div>
              </article>
              {i < CARDS.length - 1 ? (
                <span className="pbx-arrow" aria-hidden="true">
                  <ArrowRight size={16} strokeWidth={2} />
                </span>
              ) : null}
            </li>
          ))}
        </ol>
      </Reveal>
    </div>
  );
}
