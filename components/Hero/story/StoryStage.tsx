/**
 * STORY STAGE — the markup of the hero scroll story, drawn on a fixed design
 * canvas (storyModel.geometry) that CSS scales to fit. Pure markup: it renders
 * the *finished* loop (what reduced-motion and no-JS visitors see). HeroStory
 * moves everything else into its starting state before first paint and then
 * scrubs it back to this.
 *
 * Words are limited to the stage vocabulary (content/stages.ts): the seven
 * stage words. Everything else is geometry.
 */

import { STAGE_ICON_ID, STAGE_WORD } from '@/content/stages';
import { STAGE_GLYPH } from '@/components/StorySpine/icons';
import { RAW, RELATIONS } from '../convergence/layout';
import { RawFace } from '../convergence/Fragments';
import { STAGES, geometry, type TrackMode } from './storyModel';

const px = (n: number) => `${n}px`;

export function StoryStage({ mode }: { mode: TrackMode }) {
  const g = geometry(mode);
  const m = mode === 'h' ? 'wide' : 'narrow';

  const centre = (id: string) => {
    const i = RAW.findIndex((r) => r.id === id);
    return { x: g.scatter[i].x + RAW[i].w[m] / 2, y: g.scatter[i].y + RAW[i].h / 2 };
  };
  const tangle = RELATIONS.map(([a, b]) => {
    const p = centre(a);
    const q = centre(b);
    const mx = (p.x + q.x) / 2 + (q.y - p.y) * 0.18;
    const my = (p.y + q.y) / 2 - (q.x - p.x) * 0.18;
    return `M${p.x.toFixed(1)} ${p.y.toFixed(1)}Q${mx.toFixed(1)} ${my.toFixed(1)} ${q.x.toFixed(1)} ${q.y.toFixed(1)}`;
  });

  return (
    <div
      className="hs"
      data-testid="hero-story"
      data-mode={m}
      data-act="mess"
      data-ready="false"
      aria-hidden="true"
    >
      <div className="hs-canvas" style={{ width: px(g.W), height: px(g.H) }}>
        <svg
          className="hs-svg"
          width={g.W}
          height={g.H}
          viewBox={`0 0 ${g.W} ${g.H}`}
          focusable="false"
        >
          {tangle.map((d, i) => (
            <path key={i} d={d} pathLength={1} data-s="tangle" className="hs-tangle" />
          ))}
          {RAW.map((r) => (
            <path key={r.id} data-s="pull" data-id={r.id} className="hs-pull" d="" />
          ))}
          <path d={g.trackPath} pathLength={1} data-s="rail" className="hs-rail" />
          <path d={g.trackPath} pathLength={1} data-s="fill" className="hs-fill" />
          <path d={g.ringLink} pathLength={1} data-s="ring-link" className="hs-hair" />
          <path d={g.slotLink} pathLength={1} data-s="slot-link" className="hs-hair hs-hair--ink" />
          <path d={g.replyPath} pathLength={1} data-s="reply" className="hs-reply-line" />
          <path d={g.loopPath} pathLength={1} data-s="loop" className="hs-loop" />
        </svg>

        {RAW.map((r, i) => (
          <div
            key={r.id}
            data-s="frag"
            data-id={r.id}
            className={`cv-card cv-raw hs-frag${r.kind === 'doc' ? ' cv-raw--doc' : ''}`}
            style={{ width: px(r.w[m]), height: px(r.h) }}
            data-x={g.scatter[i].x}
            data-y={g.scatter[i].y}
            data-r={g.scatter[i].r}
          >
            <RawFace kind={r.kind} label={r.label} />
          </div>
        ))}

        {g.nodes.map((n, i) => {
          const stage = STAGES[i];
          const Glyph = STAGE_GLYPH[stage];
          const l = g.labels[i];
          return (
            <div key={stage}>
              <div
                data-s="node"
                data-i={i}
                className="hs-node"
                style={{ left: px(n.x), top: px(n.y) }}
              >
                {Glyph && STAGE_ICON_ID[stage] ? <Glyph id={`hs-${stage}`} size={stage === 'discover' ? 22 : 18} /> : null}
              </div>
              <span
                data-s="word"
                data-i={i}
                className={`hs-word hs-word--${l.anchor}`}
                style={{ left: px(l.x), top: px(l.y) }}
              >
                {STAGE_WORD[stage]}
              </span>
            </div>
          );
        })}

        <div
          data-s="gate"
          data-axis={g.gateAxis}
          className="hs-gate"
          style={{ left: px(g.gate.x), top: px(g.gate.y) }}
        >
          <i data-s="gate-bar" className="hs-gate__bar" />
        </div>
        <div data-s="ring" className="hs-ring" style={{ left: px(g.ring.x), top: px(g.ring.y) }}>
          <svg viewBox="0 0 24 24" width="14" height="14" focusable="false">
            <path
              d="M6 12.5l4 4 8-9"
              pathLength={1}
              data-s="check"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div data-s="slot" className="hs-slot" style={{ left: px(g.slot.x), top: px(g.slot.y) }}>
          <i data-s="slot-fill" className="hs-slot__fill" />
        </div>
        <i data-s="reply-token" className="hs-reply-token" />
        <i data-s="token" className="hs-token" style={{ left: px(g.nodes[0].x), top: px(g.nodes[0].y) }} />
      </div>
    </div>
  );
}
