import { LOOP_STAGE_ORDER, STAGE_ICON_ID, STAGE_WORD } from '@/content/stages';
import { STAGE_GLYPH } from '@/components/StorySpine/icons';

/**
 * STAGE PLATE — the hero's one visual. A flat, hairline-bordered strip that
 * lists the loop stages in order. Words come only from the fixed stage
 * vocabulary (content/stages.ts); nothing is added. Static: no motion.
 */
export function StagePlate() {
  return (
    <ul data-testid="hero-stage-plate" className="hm-plate" aria-label="Workflow stages">
      {LOOP_STAGE_ORDER.map((id) => {
        const Glyph = STAGE_ICON_ID[id] ? STAGE_GLYPH[id] : null;
        return (
          <li key={id} className="hm-plate__item">
            {Glyph ? <Glyph id={`hero-${id}`} size={18} /> : null}
            <span>{STAGE_WORD[id]}</span>
          </li>
        );
      })}
    </ul>
  );
}
