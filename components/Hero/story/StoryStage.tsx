/**
 * STORY STAGE — the markup of the hero scroll story, drawn on a fixed design
 * canvas (storyModel.geometry) that CSS scales to fit. Pure markup: it renders
 * the *finished* loop (what reduced-motion and no-JS visitors see). HeroStory
 * moves everything else into its starting state before first paint and then
 * scrubs it back to this.
 *
 * What the picture says: scattered business material is pulled into one
 * thread. ONE prospect walks it. A dossier card travels with the prospect and
 * gains a layer at each stage (who they are, the evidence, a fit score, a
 * written draft). A person approves at the gate. The card folds into a plane
 * and leaves; a reply comes back; a slot is booked; the line curls back to
 * configure and the next, empty card is ready.
 *
 * The only words are the seven stage names, one at a time, in a single
 * animated slot that follows the prospect (content/stages.ts vocabulary).
 *
 * Layers (so independent motion never fights): `.hs-layer--track` and
 * `.hs-layer--frags` each take their own pointer parallax. Fragments are three
 * nested boxes: outer = scroll scrub, mid = load intro, inner = idle float.
 */

import { STAGE_ICON_ID, STAGE_WORD } from '@/content/stages';
import { STAGE_GLYPH } from '@/components/StorySpine/icons';
import { RAW, RELATIONS } from '../convergence/layout';
import { RawFace } from '../convergence/Fragments';
import { STAGES, WORD_ORDER, dossierPos, geometry, type TrackMode } from './storyModel';

const px = (n: number) => `${n}px`;
/** per-fragment depth (parallax px at full pointer travel) */
const DEPTH = [14, -10, 8, -14, 11, -7, 13];
/** card tone per fragment: paper, ink or orange tint (black, white and orange only) */
const TONE = ['paper', 'ink', 'tint', 'paper', 'tint', 'ink', 'paper'] as const;

export function StoryStage({ mode }: { mode: TrackMode }) {
  const g = geometry(mode);
  const m = mode === 'h' ? 'wide' : 'narrow';
  const base = dossierPos(g, g.nodes[0].x, g.nodes[0].y);

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
            <path d={g.archPath} data-s="arch" className="hs-arch" />
            <path d={g.loopPath} pathLength={1} data-s="loop" className="hs-loop" />
            <path d={g.loopPath} data-s="loop-flow" className="hs-loop-flow" />
          </svg>

          {g.nodes.map((n, i) => {
            const stage = STAGES[i];
            const Glyph = STAGE_GLYPH[stage];
            return (
              <div
                key={stage}
                data-s="node"
                data-i={i}
                className="hs-node"
                style={{ left: px(n.x), top: px(n.y) }}
              >
                {Glyph && STAGE_ICON_ID[stage] ? (
                  <Glyph id={`hs-${stage}`} size={stage === 'discover' ? 26 : 22} />
                ) : null}
              </div>
            );
          })}

          {/* the one animated stage word: eight faces (the loop returns to configure) */}
          <div className="hs-words font-display-xl">
            {WORD_ORDER.map((stage, k) => (
              <span
                key={k}
                data-s="word"
                data-k={k}
                className="hs-w"
                style={{ top: px(g.word.y), left: px(g.word.x) }}
              >
                {Array.from(STAGE_WORD[stage]).map((ch, j) => (
                  <span key={j} className="hs-ch">
                    <i data-s="ch">{ch}</i>
                  </span>
                ))}
                <b data-s="wbar" className="hs-w__bar" />
              </span>
            ))}
          </div>

          <div
            data-s="gate"
            data-axis={g.gateAxis}
            className="hs-gate"
            style={{ left: px(g.gate.x), top: px(g.gate.y) }}
          >
            <i data-s="gate-bar" className="hs-gate__bar" />
          </div>
          <div data-s="ring" className="hs-ring" style={{ left: px(g.ring.x), top: px(g.ring.y) }}>
            {/* a person: the approval is human */}
            <svg viewBox="0 0 24 24" width="16" height="16" focusable="false">
              <circle cx="12" cy="8.5" r="3.6" fill="none" stroke="currentColor" strokeWidth="1.8" />
              <path d="M5 20c.8-4 3.7-6 7-6s6.2 2 7 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
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

          {/* the dossier: an empty card that fills as the prospect is worked */}
          <div
            data-s="doss"
            className="hs-doss"
            data-side={g.card.side}
            style={{ width: px(g.card.w), height: px(g.card.h), left: px(base.x), top: px(base.y) }}
          >
            <div data-s="d-ph" className="hs-doss__ph" />
            <div data-s="d-card" className="hs-doss__card">
              <span data-s="d-who" className="hs-d-who">
                <i className="hs-d-av" />
                <i className="hs-d-bar hs-d-bar--a" />
                <i className="hs-d-bar hs-d-bar--b" />
              </span>
              <svg data-s="d-gauge" className="hs-d-gauge" viewBox="0 0 32 32" focusable="false">
                <circle cx="16" cy="16" r="12" className="hs-d-gauge__trk" />
                <circle cx="16" cy="16" r="12" pathLength={1} data-s="d-arc" className="hs-d-gauge__arc" />
                <path d="M11 16.5l3.6 3.6L21.5 12" pathLength={1} data-s="d-gcheck" className="hs-d-gauge__ck" />
              </svg>
              <span className="hs-d-chips">
                <i data-s="d-chip" style={{ width: 38 }} />
                <i data-s="d-chip" style={{ width: 28 }} />
                <i data-s="d-chip" style={{ width: 42 }} />
              </span>
              <span data-s="d-quote" className="hs-d-quote">
                <b />
                <i style={{ width: 96 }} />
                <i style={{ width: 66 }} />
              </span>
              <span className="hs-d-draft">
                <i data-s="d-line" style={{ width: 142 }} />
                <i data-s="d-line" style={{ width: 118 }} />
                <i data-s="d-line" style={{ width: 84 }} />
                <em data-s="d-caret" className="hs-d-caret" />
              </span>
            </div>
            <div data-s="d-ok" className="hs-doss__ok" />
            <i data-s="d-badge" className="hs-doss__badge">
              <svg viewBox="0 0 24 24" width="12" height="12" focusable="false">
                <path d="M6 12.5l4 4 8-9" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </i>
          </div>

          <svg data-s="plane" className="hs-plane" viewBox="0 0 24 24" width="30" height="30" focusable="false">
            <path d="M2.5 11.3 21.5 3 14.2 21l-3.3-7.4-8.4-2.3Z" fill="currentColor" />
            <path d="m10.9 13.6 5.2-5.2" stroke="var(--scaffold-bg)" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          <div data-s="reply-token" className="hs-bubble">
            <i />
            <i />
          </div>
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
              data-tone={TONE[i]}
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
                  <RawFace kind={r.kind} label={r.label} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
