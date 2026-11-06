/**
 * STORY STAGE — the markup of the hero scroll story, drawn on a fixed design
 * canvas (storyModel.geometry) that CSS scales to fit. Pure markup: it renders
 * the *finished* loop (what reduced-motion and no-JS visitors see). HeroStory
 * moves everything else into its starting state before first paint and then
 * scrubs it back to this.
 *
 * NO WORDS. The visuals tell the story alone: stage glyphs, thread, gate,
 * slot. Fragment faces use bars where labels used to be, and each stage has a
 * pip that fills as the prospect arrives.
 *
 * Layers (so independent motion never fights): `.hs-layer--track` (rails,
 * nodes, gate, slot, tokens) and `.hs-layer--frags` each take their own
 * pointer parallax. Fragments are three nested boxes: outer = scroll scrub,
 * mid = load intro, inner = idle float + parallax.
 */

import { STAGE_ICON_ID } from '@/content/stages';
import { STAGE_GLYPH } from '@/components/StorySpine/icons';
import { RAW, RELATIONS } from '../convergence/layout';
import { RawFace } from '../convergence/Fragments';
import { STAGES, geometry, type TrackMode } from './storyModel';

const px = (n: number) => `${n}px`;
/** per-fragment depth (parallax px at full pointer travel) and float timing */
const DEPTH = [14, -10, 8, -14, 11, -7, 13];

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
      data-live="true"
      aria-hidden="true"
    >
      <div className="hs-canvas" style={{ width: px(g.W), height: px(g.H) }}>
        <div className="hs-layer hs-layer--track">
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
            {tangle.map((d, i) => (
              <path key={'p' + i} d={d} data-s="tangle-pulse" className="hs-tangle-pulse" style={{ animationDelay: `${i * -0.7}s` }} />
            ))}
            {RAW.map((r) => (
              <path key={r.id} data-s="pull" data-id={r.id} className="hs-pull" d="" />
            ))}
            <path d={g.trackPath} pathLength={1} data-s="rail" className="hs-rail" />
            <path d={g.trackPath} pathLength={1} data-s="fill" className="hs-fill" />
            <path data-s="flow" className="hs-flow" d="" />
            <path d={g.ringLink} pathLength={1} data-s="ring-link" className="hs-hair" />
            <path d={g.slotLink} pathLength={1} data-s="slot-link" className="hs-hair hs-hair--ink" />
            <path d={g.replyPath} pathLength={1} data-s="reply" className="hs-reply-line" />
            <path d={g.loopPath} pathLength={1} data-s="loop" className="hs-loop" />
            <path d={g.loopPath} data-s="loop-flow" className="hs-loop-flow" />
          </svg>

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
                  {Glyph && STAGE_ICON_ID[stage] ? (
                    <Glyph id={`hs-${stage}`} size={stage === 'discover' ? 26 : 22} />
                  ) : null}
                </div>
                <span
                  data-s="pip"
                  data-i={i}
                  className={`hs-pip hs-pip--${l.anchor}`}
                  style={{ left: px(l.x), top: px(l.y) }}
                >
                  <b data-s="pip-fill" className="hs-pip__fill" />
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
            <svg viewBox="0 0 24 24" width="18" height="18" focusable="false" className="hs-slot__check">
              <path
                d="M6 12.5l4 4 8-9"
                pathLength={1}
                data-s="slot-check"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <i data-s="reply-token" className="hs-reply-token" />
          <i
            data-s="token"
            className="hs-token"
            style={{ left: px(g.nodes[0].x), top: px(g.nodes[0].y) }}
          />
        </div>

        <div className="hs-layer hs-layer--frags">
          {RAW.map((r, i) => (
            <div
              key={r.id}
              data-s="frag"
              data-id={r.id}
              className="hs-frag"
              style={
                {
                  width: px(r.w[m]),
                  height: px(r.h),
                  '--d': DEPTH[i],
                  '--fd': `${5.2 + (i % 4) * 0.9}s`,
                  '--fl': `${-i * 0.8}s`,
                } as React.CSSProperties
              }
            >
              <div data-s="frag-mid" className="hs-frag__mid">
                <div className={`cv-card cv-raw${r.kind === 'doc' ? ' cv-raw--doc' : ''}`}>
                  <RawFace kind={r.kind} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
