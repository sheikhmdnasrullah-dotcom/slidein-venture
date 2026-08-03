'use client';

/**
 * CHAPTER 02 — TWO SYSTEMS. ONE LOOP.
 * ---------------------------------------------------------------------------
 * The deck's thesis diagram, now read TOP TO BOTTOM:
 *
 *   SYS-01 CONTENT    Ideation & Script / You Record
 *                       ↓ Content Production
 *                       ↓ Multi-Platform Presence
 *   SYS-02 OUTREACH   We Discuss Your ICP / Ideal Client Research
 *                       ↓ Manual Outreach
 *                       ↓ Qualified Conversations
 *                          ↓ both tracks merge
 *                     MORE CLIENTS, FASTER
 *
 * WHY IT TURNED NINETY DEGREES
 * It was a 1240×620 SVG with every card, label and Bézier authored against a
 * fixed grid, read left to right. A page is read top to bottom, and a diagram
 * whose axis disagrees with the page's axis is a diagram nobody finishes. The
 * cards are DOM now and only the wires are SVG — see flow/FlowCanvas.tsx for
 * the seam between the two, and for why the connectors are real measured paths
 * rather than CSS borders.
 *
 * ONE COLUMN AT EVERY BREAKPOINT. Vertical is not the mobile mode here, it is
 * the layout. There is no second layout to keep in sync, which is the whole
 * reason this is cheaper to hold than what it replaced.
 *
 * THE MERGE IS THE ARGUMENT
 * The content track's output leaves sideways, runs down the left gutter past
 * the entire outreach track, and meets the outreach track's output at one
 * junction above the outcome card. That long run past a system it does not
 * belong to is the point: content keeps going while outreach works.
 */

import { useCallback, useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { anchorBus, hasDeckBeenSeen } from '@/components/PitchDeck/OutcomeAnchor';
import FlowCanvas, {
  useFlowNode,
  drop,
  elbow,
  type FlowNodes,
  type FlowPath,
} from '@/components/PitchDeck/flow/FlowCanvas';
import { useFlowSequence, type Wire, type Pop } from '@/components/PitchDeck/flow/useFlowSequence';

/* ------------------------------- icon set -------------------------------- */

type IconKind =
  | 'video'
  | 'layers'
  | 'broadcast'
  | 'target'
  | 'send'
  | 'inbox'
  | 'script'
  | 'tell'
  | 'check';

function Glyph({ kind, size = 20 }: { kind: IconKind; size?: number }) {
  const s = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  } as const;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      {kind === 'video' && (
        <g {...s}>
          <rect x={2.5} y={6} width={13.5} height={12} rx={2.5} />
          <path d="m16 10.5 5.5-3v9l-5.5-3" />
        </g>
      )}
      {kind === 'layers' && (
        <g {...s}>
          <path d="m12 3 9 5-9 5-9-5z" />
          <path d="m3 13 9 5 9-5" />
          <path d="m3 17.5 9 5 9-5" opacity={0.45} />
        </g>
      )}
      {kind === 'broadcast' && (
        <g {...s}>
          <circle cx={12} cy={12} r={2.2} />
          <path d="M7.5 7.5a6.4 6.4 0 0 0 0 9M16.5 7.5a6.4 6.4 0 0 1 0 9" />
          <path d="M4.6 4.6a10.5 10.5 0 0 0 0 14.8M19.4 4.6a10.5 10.5 0 0 1 0 14.8" opacity={0.45} />
        </g>
      )}
      {kind === 'target' && (
        <g {...s}>
          <circle cx={12} cy={12} r={9} />
          <circle cx={12} cy={12} r={5} />
          <circle cx={12} cy={12} r={1.2} fill="currentColor" stroke="none" />
        </g>
      )}
      {kind === 'send' && (
        <g {...s}>
          <path d="M21 3 10.5 13.5" />
          <path d="M21 3 14.2 21l-3.7-7.5L3 9.8z" />
        </g>
      )}
      {kind === 'script' && (
        <g {...s}>
          <path d="M6.5 3h7.5L19 8v12.5A1.5 1.5 0 0 1 17.5 22h-11A1.5 1.5 0 0 1 5 20.5v-16A1.5 1.5 0 0 1 6.5 3z" />
          <path d="M13.8 3v5h5" opacity={0.5} />
          <path d="M8.6 13h6.8M8.6 17h4.4" />
        </g>
      )}
      {kind === 'tell' && (
        <g {...s}>
          <path d="M21 12.4a7.5 7.5 0 0 1-7.5 7.5H9.2L4.5 23v-4.7A7.5 7.5 0 0 1 10.5 4.9h3A7.5 7.5 0 0 1 21 12.4z" />
          <path d="M9.4 12.4h6.2" opacity={0.55} />
        </g>
      )}
      {kind === 'inbox' && (
        <g {...s}>
          <path d="M3 13.5V18a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4.5" />
          <path d="M3 13.5h5l1.6 2.5h4.8l1.6-2.5h5" />
          <path d="M6.5 13.5 8 5.5h8l1.5 8" opacity={0.6} />
        </g>
      )}
      {kind === 'check' && (
        <g {...s} strokeWidth={2}>
          <circle cx={12} cy={12} r={9.5} />
          <path d="m8 12.2 2.8 2.8L16.2 9.4" />
        </g>
      )}
    </svg>
  );
}

/* --------------------------------- data ----------------------------------- */

type StageDef = { id: string; title: string; desc: string; icon: IconKind };

/* `mine` is the client's row, and it is the only orange thing in the top two
   thirds of the diagram. The eye lands on the one strip of the system that is
   actually the reader's job, and reads the point without being told. */
type SplitRow = { owner: string; title: string; icon: IconKind; mine?: boolean };

const CONTENT_INPUT: { id: string; rows: [SplitRow, SplitRow] } = {
  id: 'c-input',
  rows: [
    { owner: 'SlideIn', title: 'Ideation & Script', icon: 'script' },
    { owner: 'You', title: 'You Record', icon: 'video', mine: true },
  ],
};

const CONTENT_STAGES: StageDef[] = [
  { id: 'c-production', title: 'Content Production', desc: 'Edited, clipped, written for you', icon: 'layers' },
  { id: 'c-presence', title: 'Multi-Platform Presence', desc: 'Published everywhere, weekly', icon: 'broadcast' },
];

const OUTREACH_INPUT: { id: string; rows: [SplitRow, SplitRow] } = {
  id: 'o-input',
  rows: [
    { owner: 'You', title: 'We Discuss Your ICP', icon: 'tell', mine: true },
    { owner: 'SlideIn', title: 'Ideal Client Research', icon: 'target' },
  ],
};

const OUTREACH_STAGES: StageDef[] = [
  { id: 'o-outreach', title: 'Manual Outreach', desc: 'Researched and written by hand', icon: 'send' },
  { id: 'o-convos', title: 'Qualified Conversations', desc: 'Real replies, sorted for you', icon: 'inbox' },
];

/* ------------------------------- the wires -------------------------------- */

/* Pure arithmetic over measured rects. The gutter sits at 45% of the stack's
   left padding — far enough off the cards to read as its own channel, close
   enough that the elbow's radius still fits beside it. */
function framePaths(n: FlowNodes): FlowPath[] {
  const out: FlowPath[] = [];

  const link = (a: string, b: string, hot = false) => {
    const from = n[a];
    const to = n[b];
    if (!from || !to) return;
    out.push({ id: `${a}~${b}`, d: drop(from.cx, from.bottom, to.top), hot });
  };

  link('c-input', 'c-production');
  link('c-production', 'c-presence');
  link('o-input', 'o-outreach');
  link('o-outreach', 'o-convos');

  const presence = n['c-presence'];
  const junction = n.junction;
  const outcome = n.outcome;

  if (presence && junction) {
    const pad = presence.left;
    const gutterX = Math.max(6, pad * 0.45);
    const r = Math.min(20, Math.max(10, pad * 0.42));
    out.push({
      id: 'merge-content',
      d: elbow({ x: presence.left, y: presence.cy }, gutterX, { x: junction.left, y: junction.cy }, r),
      hot: true,
    });
  }

  link('o-convos', 'junction', true);

  if (junction && outcome) {
    out.push({
      id: 'junction~outcome',
      d: drop(junction.cx, junction.bottom, outcome.top),
      hot: true,
      width: 1.8,
    });
  }

  return out;
}

/* --------------------------------- parts ---------------------------------- */

/** A track's identifier plus the aside that used to float over the diagram.
 *  Still a hover state: available on demand, silent by default. */
function SysLabel({ id, note }: { id: string; note: string }) {
  return (
    <div className="vf-sys group mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
      <span className="vf-sys-id">{id}</span>
      <span className="vf-sys-note">{note}</span>
    </div>
  );
}

function StageCard({ s }: { s: StageDef }) {
  return (
    <div ref={useFlowNode(s.id)} data-flow-node={s.id} className="vf-card group">
      <span className="vf-chip">
        <Glyph kind={s.icon} />
      </span>
      <div className="min-w-0">
        <p className="vf-card-title">{s.title}</p>
        <p className="vf-card-desc">{s.desc}</p>
      </div>
      <span className="vf-blink vf-card-dot" aria-hidden />
    </div>
  );
}

/** The input cell. Same outer box as every other card, divided by one
 *  hairline — keeping the box identical is what lets it hold the head of a
 *  track without becoming a different kind of object. */
function SplitCard({ def }: { def: { id: string; rows: [SplitRow, SplitRow] } }) {
  return (
    <div ref={useFlowNode(def.id)} data-flow-node={def.id} className="vf-card vf-card-split group">
      {def.rows.map((r, i) => (
        <div key={r.title} className={i === 1 ? 'vf-row vf-row-second' : 'vf-row'} data-mine={r.mine ? '' : undefined}>
          <span className="vf-chip vf-chip-sm">
            <Glyph kind={r.icon} size={15} />
          </span>
          <div className="min-w-0">
            <p className="vf-row-owner">
              <span className="vf-row-dot" aria-hidden />
              {r.owner.toUpperCase()}
            </p>
            <p className="vf-row-title">{r.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/** Where the two systems meet. A horizontal bar rather than a dot, so the
 *  merge reads as a junction point — both tracks feed into the same place
 *  before the outcome card. */
function Junction() {
  return (
    <div className="flex items-center justify-center py-6">
      <span ref={useFlowNode('junction')} data-flow-node="junction" className="vf-junction-bar" aria-hidden>
        <span className="vf-junction-ring" />
        <span className="vf-junction-core" />
        <span className="vf-junction-label">MERGE</span>
      </span>
    </div>
  );
}

/**
 * The outcome. Full width — it breaks out of the gutter every other card sits
 * inside — and the only saturated orange on the canvas. It earns that by
 * carrying the number as well as the claim: six stages between the recording
 * and the reply, none of which the reader touches.
 */
function Outcome() {
  return (
    <div
      ref={useFlowNode('outcome')}
      data-flow-node="outcome"
      className="vf-outcome"
    >
      <span className="vf-halo" aria-hidden />
      <div className="relative flex flex-wrap items-center gap-x-5 gap-y-4 px-5 py-5 md:px-7 md:py-6">
        <span className="vf-outcome-chip" aria-hidden>
          <Glyph kind="check" size={22} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="vf-outcome-title">More Clients, Faster</p>
          <p className="vf-outcome-sub">
            <span className="vf-outcome-num">6</span> stages, hands off
          </p>
        </div>
        <span className="vf-outcome-live">
          <span className="vf-blink vf-live-dot" aria-hidden />
          LIVE
        </span>
      </div>
    </div>
  );
}

/* --------------------------------- slide ----------------------------------- */

/* ------------------------------ choreography ------------------------------
   Module-level so the arrays keep a stable identity across renders —
   `useFlowSequence` takes them as effect dependencies.

   The reading order is the argument: the content track builds top to bottom,
   the outreach track builds beneath it, then both merge and the outcome lands
   last. Each card's threshold sits exactly where its connector arrives, so the
   wire hands off to the bounce rather than the two playing over each other. */

const WIRES: Wire[] = [
  { id: 'c-input~c-production', from: 0.04, to: 0.13 },
  { id: 'c-production~c-presence', from: 0.15, to: 0.24 },
  { id: 'o-input~o-outreach', from: 0.36, to: 0.45 },
  { id: 'o-outreach~o-convos', from: 0.47, to: 0.56 },
  /* The two merges run together — they are one gesture, not two events. */
  { id: 'merge-content', from: 0.62, to: 0.76 },
  { id: 'o-convos~junction', from: 0.66, to: 0.76 },
  { id: 'junction~outcome', from: 0.82, to: 0.9 },
];

const POPS: Pop[] = [
  { id: 'c-input', at: 0.01 },
  { id: 'c-production', at: 0.13 },
  { id: 'c-presence', at: 0.24 },
  { id: 'o-input', at: 0.32 },
  { id: 'o-outreach', at: 0.45 },
  { id: 'o-convos', at: 0.56 },
  { id: 'junction', at: 0.77 },
  { id: 'outcome', at: 0.9 },
];

export default function FrameworkFlowSlide() {
  const rootRef = useRef<HTMLDivElement>(null);
  const still = !!useReducedMotion();
  const paths = useCallback((n: FlowNodes) => framePaths(n), []);

  useFlowSequence({
    root: rootRef,
    scope: rootRef,
    wires: WIRES,
    pops: POPS,
    start: 'top 88%',
    end: 'bottom 60%',
  });

  /* ── Stage 6 — the return-to-overview payoff ──────────────────────────────
     "More Clients, Faster" sits at the bottom of this chapter, two chapters
     above the detail. Once the reader has been down through the content and
     outreach systems and comes back up to the whole map, the card takes an
     emphasized resting state — this is the thing the two systems were adding
     up to, and it should look different on the way back than it did on the way
     down.

     Gated on `hasDeckBeenSeen()`, so a first-time downward pass gets the plain
     card and the emphasis is genuinely earned rather than being the default.

     The scale is animated by GSAP, not CSS. `useFlowSequence` also writes
     `transform` on this element for its pop-in, and two owners of one property
     is the bug that flattened the module cards' bounce — so everything
     transform-shaped goes through GSAP and CSS keeps the border, shadow and
     halo, which it owns alone. */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const card = root.querySelector<HTMLElement>('[data-flow-node="outcome"]');
    if (!card) return;

    if (still) {
      if (hasDeckBeenSeen()) card.setAttribute('data-payoff', '');
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const emphasise = () => {
      if (!hasDeckBeenSeen()) return;
      /* The chip and the card are the same object in two places. If the chip is
         still docked when the card comes back into view, it un-docks into it. */
      anchorBus.emit({ type: 'undock' });
      card.setAttribute('data-payoff', '');
      gsap.to(card, { scale: 1.03, duration: 0.6, ease: 'back.out(1.4)', overwrite: 'auto' });
    };

    const relax = () => {
      card.removeAttribute('data-payoff');
      gsap.to(card, { scale: 1, duration: 0.3, overwrite: 'auto' });
    };

    const st = ScrollTrigger.create({
      trigger: card,
      start: 'top 90%',
      end: 'bottom 10%',
      onEnter: emphasise, // a second downward read
      onEnterBack: emphasise, // the actual return-to-overview
      onLeaveBack: relax,
    });

    return () => {
      st.kill();
      card.removeAttribute('data-payoff');
    };
  }, [still]);

  return (
    <div ref={rootRef} className="vf w-full max-w-165">
      <h3 className="font-display-md mb-8 text-[clamp(1.6rem,4vw,2.4rem)] text-(--on-surface)">
        Two systems. One loop.
      </h3>

      <FlowCanvas paths={paths} stackClassName="pl-8 sm:pl-12 md:pl-16">
        {/* ── SYS-01 · CONTENT ─────────────────────────────────────────── */}
        <SysLabel id="SYS-01 · CONTENT" note="Builds trust before you ever reach out." />
        <div className="flex flex-col gap-13">
          <SplitCard def={CONTENT_INPUT} />
          {CONTENT_STAGES.map((s) => (
            <StageCard key={s.id} s={s} />
          ))}
        </div>

        {/* ── SYS-02 · OUTREACH ────────────────────────────────────────── */}
        <div className="mt-24">
          <SysLabel id="SYS-02 · OUTREACH" note="Starts conversations while content compounds." />
          <div className="flex flex-col gap-13">
            <SplitCard def={OUTREACH_INPUT} />
            {OUTREACH_STAGES.map((s) => (
              <StageCard key={s.id} s={s} />
            ))}
          </div>
        </div>

        <Junction />
        <Outcome />

        {/* The beat. The payoff needs scroll distance after it with nothing
            else moving — the brief asks for it explicitly, and the card cannot
            read as an arrival if the next chapter's heading is already on
            screen beside it. */}
        <div className="h-24 md:h-32" aria-hidden />
      </FlowCanvas>

      <style>{`
        /* ── cards ──────────────────────────────────────────────────────── */
        .vf .vf-card {
          position: relative;
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px 18px;
          border-radius: var(--radius-md);
          background: var(--surface);
          border: 1px solid color-mix(in oklch, var(--on-surface) 11%, transparent);
          box-shadow: 0 4px 12px color-mix(in oklch, var(--on-surface) 6%, transparent);
          transition: border-color var(--dur-base) var(--ease-expo),
                      box-shadow var(--dur-base) var(--ease-expo);
        }
        .vf .vf-card::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: linear-gradient(to bottom, var(--gloss), transparent 45%);
          opacity: .7;
          pointer-events: none;
        }
        .vf .vf-card:hover {
          border-color: color-mix(in oklch, var(--accent-vivid) 50%, transparent);
          box-shadow: 0 8px 22px color-mix(in oklch, var(--accent-vivid) 10%, transparent);
        }

        .vf .vf-chip {
          display: grid;
          place-items: center;
          flex: none;
          width: 46px;
          height: 46px;
          border-radius: 14px;
          background: color-mix(in oklch, var(--on-surface) 3.5%, transparent);
          color: color-mix(in oklch, var(--on-surface) 68%, transparent);
          transition: background var(--dur-base) var(--ease-expo), color var(--dur-base) var(--ease-expo);
        }
        .vf .vf-chip-sm { width: 34px; height: 34px; border-radius: 11px; }
        .vf .vf-card:hover .vf-chip {
          background: color-mix(in oklch, var(--accent-vivid) 9%, transparent);
          color: var(--accent-vivid);
        }

        .vf .vf-card-title {
          font-size: 15.5px;
          font-weight: 800;
          letter-spacing: -0.014em;
          color: var(--on-surface);
        }
        .vf .vf-card-desc {
          margin-top: 2px;
          font-size: 11.5px;
          font-weight: 500;
          color: color-mix(in oklch, var(--on-surface) 45%, transparent);
        }
        .vf .vf-card-dot {
          position: absolute;
          top: 14px;
          right: 14px;
          width: 5px;
          height: 5px;
          border-radius: var(--radius-pill);
          background: var(--accent-vivid);
        }

        /* ── the split input card ───────────────────────────────────────── */
        .vf .vf-card-split { flex-direction: column; align-items: stretch; gap: 0; padding: 6px 14px; }
        .vf .vf-row { display: flex; align-items: center; gap: 12px; padding: 12px 4px; }
        .vf .vf-row-second { border-top: 1px solid color-mix(in oklch, var(--on-surface) 10%, transparent); }
        .vf .vf-row-owner {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 8px;
          font-weight: 700;
          letter-spacing: .18em;
          color: color-mix(in oklch, var(--on-surface) 38%, transparent);
        }
        .vf .vf-row-dot {
          width: 4px;
          height: 4px;
          border-radius: var(--radius-pill);
          background: color-mix(in oklch, var(--on-surface) 30%, transparent);
        }
        .vf .vf-row-title {
          margin-top: 3px;
          font-size: 14px;
          font-weight: 800;
          letter-spacing: -0.012em;
          color: var(--on-surface);
        }
        .vf .vf-row[data-mine] .vf-row-owner { color: var(--accent); }
        .vf .vf-row[data-mine] .vf-row-dot { background: var(--accent-vivid); }
        .vf .vf-row[data-mine] .vf-chip { background: var(--accent-wash); color: var(--accent-vivid); }

        /* ── system labels ──────────────────────────────────────────────── */
        .vf .vf-sys-id {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: .24em;
          color: color-mix(in oklch, var(--on-surface) 30%, transparent);
          transition: color var(--dur-base) var(--ease-expo);
        }
        .vf .vf-sys-note {
          font-family: ui-serif, Georgia, serif;
          font-size: 11.5px;
          font-style: italic;
          color: color-mix(in oklch, var(--on-surface) 40%, transparent);
          opacity: 0;
          transition: opacity var(--dur-base) var(--ease-expo);
        }
        .vf .vf-sys:hover .vf-sys-note { opacity: 1; }
        .vf .vf-sys:hover .vf-sys-id { color: color-mix(in oklch, var(--on-surface) 52%, transparent); }

         /* ── junction ───────────────────────────────────────────────────── */
        .vf .vf-junction-bar {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 8px 18px;
          border-radius: var(--radius-pill);
          background: var(--surface);
          border: 1px dashed color-mix(in oklch, var(--accent-vivid) 40%, transparent);
        }
        .vf .vf-junction-ring {
          display: none;
        }
        .vf .vf-junction-core {
          position: relative;
          width: 9px;
          height: 9px;
          border-radius: var(--radius-pill);
          background: var(--accent-vivid);
          filter: drop-shadow(0 0 3px color-mix(in oklch, var(--accent-vivid) 55%, transparent));
        }
        .vf .vf-junction-label {
          font-size: 8px;
          font-weight: 800;
          letter-spacing: .22em;
          color: color-mix(in oklch, var(--on-surface) 38%, transparent);
        }

        /* ── the outcome ────────────────────────────────────────────────── */
        .vf .vf-outcome {
          position: relative;
          border-radius: var(--radius-md);
          background: var(--surface);
          border: 1px solid color-mix(in oklch, var(--accent-vivid) 45%, transparent);
          box-shadow: 0 14px 34px color-mix(in oklch, var(--color-ember) 18%, transparent),
                      0 0 0 4px color-mix(in oklch, var(--accent-vivid) 7%, transparent);
        }
        /* ── stage 6: the earned resting state ────────────────────────────
           Set only after the reader has been through both systems and come
           back — see the payoff effect in the component. Colour, border and
           shadow only: the scale belongs to GSAP, which also owns transform on
           this element for its pop-in. Two owners of one property is the bug
           that flattened the module cards' bounce. */
        .vf .vf-outcome[data-payoff] {
          border-color: var(--accent-vivid);
          box-shadow: 0 22px 52px color-mix(in oklch, var(--color-ember) 30%, transparent),
                      0 0 0 6px color-mix(in oklch, var(--accent-vivid) 12%, transparent);
        }
        .vf .vf-outcome-title,
        .vf .vf-outcome-sub,
        .vf .vf-outcome-live { transition: color var(--dur-slow) var(--ease-expo); }
        .vf .vf-outcome[data-payoff] .vf-outcome-sub { color: color-mix(in oklch, var(--on-surface) 70%, transparent); }

        .vf .vf-halo {
          position: absolute;
          inset: -18px;
          border-radius: calc(var(--radius-md) + 18px);
          background: radial-gradient(circle, color-mix(in oklch, var(--accent-vivid) 12%, transparent), transparent 70%);
          filter: blur(10px);
          pointer-events: none;
          animation: vfHalo 4.4s ease-in-out infinite;
          transition: background var(--dur-slow) var(--ease-expo);
        }
        .vf .vf-outcome[data-payoff] .vf-halo {
          background: radial-gradient(circle, color-mix(in oklch, var(--accent-vivid) 24%, transparent), transparent 72%);
        }
        .vf .vf-outcome-chip {
          display: grid;
          place-items: center;
          flex: none;
          width: 50px;
          height: 50px;
          border-radius: 15px;
          background: var(--accent-vivid);
          color: var(--on-accent);
          box-shadow: 0 5px 14px color-mix(in oklch, var(--color-ember) 40%, transparent);
        }
        .vf .vf-outcome-title {
          font-family: var(--font-display);
          font-size: clamp(1.15rem, 3.4vw, 1.6rem);
          font-weight: var(--font-weight-display-sm);
          letter-spacing: var(--tracking-display-sm);
          font-variation-settings: 'opsz' var(--opsz-display-sm), 'SOFT' 22, 'WONK' 0;
          color: var(--on-surface);
        }
        .vf .vf-outcome-sub {
          margin-top: 4px;
          font-size: 11.5px;
          font-weight: 700;
          color: color-mix(in oklch, var(--on-surface) 52%, transparent);
        }
        .vf .vf-outcome-num {
          font-family: var(--font-display);
          font-size: 22px;
          font-weight: var(--font-weight-display-sm);
          font-variation-settings: 'opsz' var(--opsz-display-sm), 'SOFT' 22, 'WONK' 0;
          font-feature-settings: 'tnum' 1;
          color: var(--accent-vivid);
          margin-right: 4px;
        }
        .vf .vf-outcome-live {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 8px;
          font-weight: 700;
          letter-spacing: .2em;
          color: color-mix(in oklch, var(--on-surface) 35%, transparent);
        }
        .vf .vf-live-dot {
          width: 5px;
          height: 5px;
          border-radius: var(--radius-pill);
          background: var(--color-live);
        }

        .vf .vf-blink { animation: vfBlink 2.2s ease-in-out infinite; }
        @keyframes vfBlink { 0%,100% { opacity: 1; } 50% { opacity: .25; } }
        @keyframes vfHalo { 0%,100% { opacity: .8; transform: scale(1); } 50% { opacity: 1; transform: scale(1.04); } }
        @keyframes vfSpin { to { transform: rotate(360deg); } }

        @media (prefers-reduced-motion: reduce) {
          .vf .vf-blink, .vf .vf-halo, .vf .vf-junction-ring { animation: none; }
        }
      `}</style>
    </div>
  );
}
