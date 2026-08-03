/**
 * PROOF · THE THUMBNAIL SET
 * ---------------------------------------------------------------------------
 * Six frames, tight grid, minimal gaps, no captions. Six because the thumbnail
 * is the highest leverage asset in the set and one option is not a choice.
 *
 * THESE ARE DRAWN, NOT PHOTOGRAPHED, AND THAT IS TEMPORARY.
 * There are no real thumbnails in the repository yet. Rather than mock up six
 * fake screenshots of work that does not exist, each frame is an abstract
 * composition block carrying the shape of the shot it stands for, and the
 * description of that shot is on the frame as its accessible name. Swap in real
 * exports when there are some: the grid, the ratio and the gaps do not change,
 * only what is inside each cell.
 */

import { MonoLabel } from '@/components/System/System';
import { THUMBNAIL_SET } from '@/content/steps';

/* Each frame gets a different block arrangement so the grid does not read as
   six copies of one placeholder. Values are percentages inside the frame. */
const COMPOSITIONS = [
  { x: 8, y: 18, w: 42, h: 64 },
  { x: 18, y: 30, w: 64, h: 40 },
  { x: 10, y: 12, w: 80, h: 34 },
  { x: 30, y: 14, w: 40, h: 72 },
  { x: 12, y: 40, w: 76, h: 26 },
  { x: 22, y: 20, w: 56, h: 60 },
];

export default function ThumbnailGallery() {
  return (
    <div className="grid grid-cols-2 gap-1.5 md:grid-cols-3">
      {THUMBNAIL_SET.map((description, i) => {
        const c = COMPOSITIONS[i % COMPOSITIONS.length];
        return (
          <div
            key={description}
            role="img"
            aria-label={description}
            className="relative aspect-video overflow-hidden rounded-[var(--radius-sm)] border border-[var(--rule)] bg-[var(--surface-2)]"
          >
            <span
              aria-hidden
              className="absolute block rounded-[var(--radius-sm)] bg-[var(--rule-strong)]"
              style={{
                left: c.x + '%',
                top: c.y + '%',
                width: c.w + '%',
                height: c.h + '%',
              }}
            />
            <span
              aria-hidden
              className="absolute bottom-2 left-2 block h-1.5 w-1.5 rounded-full bg-[var(--accent-vivid)]"
            />
          </div>
        );
      })}
    </div>
  );
}

/** The count, stated once under the grid rather than captioned six times. */
export function ThumbnailGalleryNote() {
  return <MonoLabel>SIX OPTIONS · ONE EPISODE</MonoLabel>;
}
