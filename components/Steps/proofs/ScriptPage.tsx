/**
 * PROOF · THE RUNSHEET
 * ---------------------------------------------------------------------------
 * The artifact behind step 03, and the only visual for the front half of the
 * pipeline — the half nobody expects a production company to do at all.
 *
 * It is a DOCUMENT, not a screenshot. No device frame, no browser chrome, no
 * traffic lights: those all say "here is our software", and the claim being
 * made is "here is the thing we hand you before you sit down". So it is one
 * column of type on paper stock, rotated a degree and a half, and cropped by
 * its container at the bottom so it continues past the edge the way a real page
 * on a real desk does.
 *
 * The crop is the whole trick. A document that fits entirely inside its frame
 * reads as an image of a document. One that runs out of the frame reads as a
 * document.
 */

import { MonoLabel } from '@/components/System/System';
import { SCRIPT_RUNSHEET } from '@/content/steps';

export default function ScriptPage() {
  return (
    <div className="relative h-[520px] overflow-hidden">
      <div
        className="absolute inset-x-0 top-0 rounded-[var(--radius-sm)] border border-[var(--rule)] bg-[var(--surface)] px-8 py-9 shadow-[var(--shadow-float)]"
        style={{ transform: 'rotate(-1.5deg)' }}
      >
        <MonoLabel className="text-[var(--on-surface)]">
          {SCRIPT_RUNSHEET.documentTitle}
        </MonoLabel>

        <dl className="mt-5 flex flex-col gap-1.5 border-y border-[var(--rule)] py-4">
          {SCRIPT_RUNSHEET.meta.map((row) => (
            <div key={row.label} className="flex gap-3">
              {/* Wide enough for DELIVERED, which is the longest of the three
                  and was printing into its own value at 92px. */}
              <dt className="w-[116px] shrink-0">
                <MonoLabel>{row.label}</MonoLabel>
              </dt>
              <dd className="font-body text-[var(--muted)]">{row.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-6 flex flex-col gap-6">
          {SCRIPT_RUNSHEET.blocks.map((block) => (
            <div key={block.cue} className="flex flex-col gap-2">
              <MonoLabel className="text-[var(--accent)]">{block.cue}</MonoLabel>
              {block.lines.map((line) => (
                <p key={line} className="font-body text-[var(--on-surface)]">
                  {line}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* The page runs out of the bottom of its container rather than stopping
          at it. A gradient does the last few pixels so the cut is a fade into
          the band rather than a hard horizontal line, which would read as a
          crop mark. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-28"
        style={{
          background:
            'linear-gradient(to bottom, transparent, var(--color-paper-50))',
        }}
      />
    </div>
  );
}
