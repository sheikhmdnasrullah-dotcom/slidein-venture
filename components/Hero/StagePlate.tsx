import { LOOP_STAGE_ORDER, STAGE_ICON_ID, STAGE_WORD } from '@/content/stages';
import { STAGE_GLYPH } from '@/components/StorySpine/icons';

/* The seven stages that carry a registry glyph; `overview` closes the loop
   but is an exempt primitive, so the plate leaves it out (design spec). */
const PLATE_STAGES = LOOP_STAGE_ORDER.filter((id) => STAGE_ICON_ID[id] !== null);

/**
 * STAGE PLATE — the hero's one visual. A layered, hairline-bordered sheet that
 * lists the loop stages in reading order; each cell holds its glyph above its
 * word. Words come only from the fixed stage vocabulary (content/stages.ts);
 * nothing is added. Cell order drives the entrance stagger via --n.
 */
export function StagePlate() {
  return (
    <ul data-testid="hero-stage-plate" className="hm-plate" aria-label="Workflow stages">
      {PLATE_STAGES.map((id, n) => {
        const Glyph = STAGE_GLYPH[id];
        return (
          <li
            key={id}
            className="hm-plate__item"
            style={{ '--n': n } as React.CSSProperties}
          >
            {Glyph ? <Glyph id={`hero-${id}`} size={18} /> : null}
            <span>{STAGE_WORD[id]}</span>
          </li>
        );
      })}
    </ul>
  );
}
