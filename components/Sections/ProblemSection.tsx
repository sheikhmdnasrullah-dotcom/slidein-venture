'use client';

/**
 * S1 · PROBLEM — the organize slider (configure stage of the home story)
 * ---------------------------------------------------------------------------
 * The section keeps its shell, header, and ledger row. The blank compare
 * card is now the interactive "from scattered to organized" playbook: three
 * twin columns (profile | offers | icps) where dragging the handle RIGHT
 * organizes more of the board. See components/OrganizeSlider/OrganizeSlider.
 */

import { cn } from '@/lib/utils';
import { HOME_CONTENT } from '@/content/home';
import { BAND_DISORDER } from '@/content/stages';
import { PlaybookStory } from '@/components/Playbook/PlaybookStory';
import {
  Band,
  ItemSlot,
  Reveal,
} from '@/components/Sections/primitives';

export default function ProblemSection() {
  const section = HOME_CONTENT.sections[0];

  return (
    <Band id={section.id} disorder={BAND_DISORDER.problem}>
      <div className="section-visual w-full">
        <PlaybookStory />
      </div>

      {/* the five pain slots — one hairline-separated ledger row */}
      <Reveal className="mx-auto mt-16 max-w-[1080px]" y={12}>
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-5">
          {section.items.map((item, i) => (
            <div
              key={i}
              className={cn(
                'lg:border-l lg:border-[var(--scaffold-hairline)] lg:pl-6',
                i === 0 && 'lg:border-l-0 lg:pl-0',
              )}
            >
              <ItemSlot item={item} titleBar="min(8em, 100%)" bodyBar="100%" />
            </div>
          ))}
        </div>
      </Reveal>
    </Band>
  );
}
