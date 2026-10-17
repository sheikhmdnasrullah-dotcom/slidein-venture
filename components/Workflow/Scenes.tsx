/**
 * WORKFLOW SCENES — the eight staged stage visuals
 * ---------------------------------------------------------------------------
 * Each scene renders inside the fixed 680×400 canvas (scaled by the
 * viewport) as a small paper theatre: people, devices, documents and
 * instruments drawn from the scaffold tokens (paper, ink, hairlines, one
 * orange accent) plus the shared 1.5px stroke icon family. Every scene plays
 * three beats per loop — arrange (0–25%), the emphasis moment (20–55%),
 * resolve to a legible resting frame (55–100%) — so the visual peaks with
 * the caption's emphasis words at any loop duration.
 *
 * Words on stage: three, owner-authorized, each lifted verbatim from its
 * caption — MATCH (qualify), SENT and HELD (outreach). Nothing else is
 * written, counted or claimed. All motion is CSS (workflow.css +
 * scenes-rich.css); the base styles are each element's final state, so
 * reduced motion rests cleanly. Everything here is decorative (aria-hidden
 * via the Scene wrapper) — meaning lives in the captions and transcript.
 */

import { Fragment } from 'react';
import { anchor, makeRect, type Rect } from './geometry';
import {
  CalendarIcon,
  CheckCircleIcon,
  CheckIcon,
  DashIcon,
  EnvelopeIcon,
  FunnelIcon,
  GaugeIcon,
  HoldIcon,
  ListSlashIcon,
  LockIcon,
  MailWarmIcon,
  MoonIcon,
  QuestionIcon,
  RackIcon,
  ResearchIcon,
  SlashIcon,
  StampIcon,
  StopIcon,
} from './icons';

/* ── shared figures ─────────────────────────────────────────────────────────
   Person: an abstract bureau figure (head + shoulders), sized in px through
   fontSize. Tones: ink (default), soft, faint, accent. Tag: a micro-label
   chip — the only words on stage (see header). */

function Person({
  size = 10,
  tone = '',
  style,
}: {
  size?: number;
  tone?: '' | ' is-soft' | ' is-faint' | ' is-accent';
  style?: React.CSSProperties;
}) {
  return (
    <span className={`wf-person${tone}`} style={{ fontSize: size, ...style }}>
      <i className="wf-p-head" />
      <i className="wf-p-body" />
    </span>
  );
}

function Tag({ children, accent = false }: { children: string; accent?: boolean }) {
  return (
    <span className="wf-tag">
      <i className={accent ? 'is-accent' : ''} />
      {children}
    </span>
  );
}

/* ── 1 · configure — the team sets up, a version lands on the stack ─────── */

function ConfigureScene() {
  return (
    <div className="wf-scene-canvas wf-s-configure" data-scene="configure">
      <span className="wf-dots" style={{ left: 62, top: 116, width: 92, height: 152 }} />
      <span className="wf-plus" style={{ left: 560, top: 138 }} />
      <span className="wf-plus" style={{ left: 592, top: 182 }} />
      <span className="wf-plus" style={{ left: 566, top: 226 }} />
      <div className="wf-ver-layer wf-ver-layer-1" />
      <div className="wf-ver-layer wf-ver-layer-2" />
      <div className="wf-card wf-profile-card">
        <Person size={11} tone=" is-soft" style={{ left: 58, top: 46 }} />
        <Person size={19} style={{ left: 26, top: 28 }} />
        <div className="wf-card-bars">
          <span className="wf-bar" />
          <span className="wf-bar" />
        </div>
        <div className="wf-offer-row">
          <span className="wf-offer-tile" />
          <span className="wf-offer-tile" />
          <span className="wf-offer-tile" />
        </div>
        <div className="wf-icp-ring">
          <FunnelIcon size={20} />
        </div>
      </div>
      <div className="wf-ver-sheet">
        <div className="wf-ver-mini">
          <Person size={15} />
          <span className="wf-ver-mini-bars">
            <span className="wf-bar" />
            <span className="wf-bar" />
          </span>
        </div>
        <div className="wf-ver-mini-tiles">
          <span />
          <span />
        </div>
      </div>
      <div className="wf-ver-check">
        <CheckIcon size={20} />
      </div>
    </div>
  );
}

/* ── 2 · discover — prospect cards arrive, duplicates merge ───────────────── */

function DiscoverScene() {
  return (
    <div className="wf-scene-canvas wf-s-discover" data-scene="discover">
      <svg className="wf-d-arc" viewBox="0 0 680 400" aria-hidden="true">
        <path d="M 104 332 A 290 290 0 0 1 576 332" />
      </svg>
      <span className="wf-plus" style={{ left: 118, top: 120 }} />
      <span className="wf-plus" style={{ left: 548, top: 96 }} />
      <div className="wf-row wf-row-1">
        <Person size={9} />
        <span className="wf-bar" />
        <span className="wf-bar" />
        <span className="wf-src-dot" />
      </div>
      <div className="wf-row wf-row-2">
        <Person size={9} />
        <span className="wf-bar" />
        <span className="wf-bar" />
        <span className="wf-src-dot" />
      </div>
      <div className="wf-row wf-row-3">
        <Person size={9} tone=" is-soft" />
        <span className="wf-bar" />
        <span className="wf-bar" />
        <span className="wf-src-dot" />
      </div>
      <span className="wf-merge-check">
        <CheckIcon size={12} />
      </span>
    </div>
  );
}

/* ── scene geometry: rects + anchors ────────────────────────────────────────
   Every connector in a scene starts and ends on a 4px anchor dot placed on an
   element's edge with anchor(). Element positions come from the same rects
   (inline style), so a line can never drift from what it connects. Curves
   leave and enter on the axis of travel (horizontal tangents for left→right
   runs, vertical for top→bottom) with control offset max(40, d/2), capped at
   the distance so short runs do not overshoot. */

type Pt = { x: number; y: number };

const box = (r: Rect): React.CSSProperties => ({
  left: r.left,
  top: r.top,
  width: r.width,
  height: r.height,
});

function bez(a: Pt, b: Pt, dir: 'h' | 'v' = 'h'): string {
  const d = dir === 'h' ? Math.abs(b.x - a.x) : Math.abs(b.y - a.y);
  const o = Math.min(Math.max(40, d * 0.5), d);
  return dir === 'h'
    ? `M ${a.x} ${a.y} C ${a.x + o} ${a.y}, ${b.x - o} ${b.y}, ${b.x} ${b.y}`
    : `M ${a.x} ${a.y} C ${a.x} ${a.y + o}, ${b.x} ${b.y - o}, ${b.x} ${b.y}`;
}

/** Down, then a rounded turn toward +x, ending on b (a.y < b.y, a.x < b.x). */
function elbow(a: Pt, b: Pt, r = 20): string {
  return `M ${a.x} ${a.y} L ${a.x} ${b.y - r} A ${r} ${r} 0 0 0 ${a.x + r} ${b.y} L ${b.x} ${b.y}`;
}

function Anchors({ pts }: { pts: Pt[] }) {
  return (
    <>
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={2} className="wf-anchor" />
      ))}
    </>
  );
}

/* ── 3 · research — scan the page, lift tethered claims ─────────────────── */

const RS = {
  card: makeRect(50, 50, 460, 350),
  inset: 22, // card padding the bars and scanner respect
  barTop: 84, // first bar's top, relative to the card's padding box (below the browser chrome)
  barStep: 32,
  barH: 12,
  barWidths: [250, 280, 200, 270, 230, 260, 180],
  sources: [1, 3, 5], // bars whose claims lift off
  sideX: 340, // the sidebar column's left edge (abs); a divider precedes it
  sideW: 96,
  pillX: 500,
  pillW: 130,
  pillH: 34,
};
const rsBarY = (k: number) => RS.card.top + 1 + RS.barTop + RS.barStep * k + RS.barH / 2;
const RS_CLAIMS = RS.sources.map((k) => {
  const y = rsBarY(k);
  const pill = makeRect(RS.pillX, y - RS.pillH / 2, RS.pillX + RS.pillW, y + RS.pillH / 2);
  return { k, from: anchor(RS.card, 'right', (y - RS.card.top) / RS.card.height), to: anchor(pill, 'left'), pill };
});
const RS_BROKEN = makeRect(RS.pillX, 70, RS.pillX + RS.pillW, 70 + RS.pillH);
const RS_SIDE_ITEMS = [108, 150, 192].map((t) => makeRect(RS.sideX, t, RS.sideX + RS.sideW, t + 30));
const RS_SCAN = {
  left: RS.card.left + 1 + RS.inset,
  width: RS.card.width - 2 - RS.inset * 2,
  a: RS.card.top + 1 + RS.inset,
  b: RS.card.bottom - 1 - RS.inset - 2,
};

function ResearchScene() {
  const ticks = ['wf-claim-1', 'wf-claim-2', 'wf-claim-3'];
  return (
    <div className="wf-scene-canvas wf-s-research" data-scene="research">
      <svg className="wf-tethers" viewBox="0 0 680 400" aria-hidden="true">
        {RS_CLAIMS.map((c, i) => (
          <g key={c.k} className={`wf-tether wf-tether-${i + 1}`}>
            <path className="wf-ants" d={bez(c.from, c.to)} />
            <Anchors pts={[c.from, c.to]} />
          </g>
        ))}
      </svg>
      <div className="wf-card wf-page" style={box(RS.card)}>
        <div className="wf-browser-bar">
          <i />
          <i />
          <i />
          <span className="wf-url" />
        </div>
        <div className="wf-page-head" style={{ left: RS.inset, top: 44 }} />
        <Person size={8} style={{ left: 152, top: 42 }} />
        {RS.barWidths.map((w, k) => (
          <div
            key={k}
            className={`wf-page-bar${RS.sources.includes(k) ? ' is-src' : ''}`}
            style={{ left: RS.inset, top: RS.barTop + RS.barStep * k, width: w, height: RS.barH }}
          />
        ))}
        <div className="wf-page-side">
          <span className="wf-side-head" />
          {RS_SIDE_ITEMS.map((r, i) => (
            <div key={i} className="wf-side-item" style={{
              left: 0,
              top: r.top - RS.card.top - 1,
              width: r.width,
              height: r.height,
            }}>
              <i />
              <span className="wf-bar" />
            </div>
          ))}
        </div>
      </div>
      <div
        className="wf-scan-line"
        style={
          {
            left: RS_SCAN.left,
            width: RS_SCAN.width,
            ['--scan-a' as string]: `${RS_SCAN.a}px`,
            ['--scan-b' as string]: `${RS_SCAN.b}px`,
          } as React.CSSProperties
        }
      />
      <span className="wf-mag-badge">
        <ResearchIcon size={15} />
      </span>
      {RS_CLAIMS.map((c, i) => (
        <div key={c.k} className={`wf-claim ${ticks[i]}`} style={box(c.pill)}>
          <span className="wf-tick">
            <CheckIcon size={10} />
          </span>
        </div>
      ))}
      <div className="wf-claim wf-claim-broken" style={box(RS_BROKEN)}>
        <SlashIcon size={12} />
      </div>
    </div>
  );
}

/* ── 4 · qualify — the connector snaps to the best-fit offer ────────────── */

const Q = {
  prospect: makeRect(40, 90, 240, 290),
  offers: [55, 165, 275].map((t) => makeRect(440, t, 610, t + 70)),
};
const Q_FROM = anchor(Q.prospect, 'right');
const Q_TO = anchor(Q.offers[1], 'left');

function QualifyScene() {
  return (
    <div className="wf-scene-canvas wf-s-qualify" data-scene="qualify">
      <span className="wf-dots" style={{ left: 268, top: 62, width: 140, height: 84 }} />
      <svg className="wf-q-connector" viewBox="0 0 680 400" aria-hidden="true">
        <path d={bez(Q_FROM, Q_TO)} pathLength={100} vectorEffect="non-scaling-stroke" />
        <Anchors pts={[Q_FROM, Q_TO]} />
      </svg>
      <div className="wf-card wf-prospect" style={box(Q.prospect)}>
        <Person size={17} />
        <span className="wf-bar" />
        <span className="wf-bar" />
        <span className="wf-bar" />
        <span className="wf-prospect-divider" />
        <div className="wf-prospect-stats">
          <span className="wf-bar" />
          <span className="wf-bar" />
        </div>
      </div>
      <div className="wf-q-offer wf-q-offer-1" style={box(Q.offers[0])}>
        <span className="wf-offer-lines"><i /><i /></span>
      </div>
      <div className="wf-q-offer wf-q-offer-2" style={box(Q.offers[1])}>
        <span className="wf-offer-lines"><i /><i /></span>
        <span className="wf-offer-dot" />
        <span className="wf-match">
          <Tag accent>MATCH</Tag>
        </span>
      </div>
      <div className="wf-q-offer wf-q-offer-3" style={box(Q.offers[2])}>
        <span className="wf-offer-lines"><i /><i /></span>
      </div>
      <div className="wf-q-criteria">
        <span className="wf-q-chip"><CheckIcon size={15} /></span>
        <span className="wf-q-chip"><CheckIcon size={15} /></span>
        <span className="wf-q-chip"><CheckIcon size={15} /></span>
        <span className="wf-q-chip"><DashIcon size={15} /></span>
      </div>
      <div className="wf-receipt">
        <span className="wf-receipt-head" />
        <span className="wf-bar" />
        <span className="wf-bar" />
        <span className="wf-bar" />
      </div>
      <div className="wf-q-meter">
        <span className="wf-q-tick is-on" />
        <span className="wf-q-tick is-on" />
        <span className="wf-q-tick is-on" />
        <span className="wf-q-tick is-on" />
        <span className="wf-q-tick is-on" />
        <span className="wf-q-tick is-on" />
        <span className="wf-q-tick is-on" />
        <span className="wf-q-tick" />
        <span className="wf-q-tick" />
        <span className="wf-q-tick" />
        <span className="wf-q-tick" />
        <span className="wf-q-tick" />
      </div>
    </div>
  );
}

/* ── 5 · personalize — every line tethered to its evidence ──────────────── */

const P = {
  chips: [111, 181, 251].map((t) => makeRect(40, t, 172, t + 38)), // centred on the line rows
  card: makeRect(240, 50, 600, 350),
  lineY: [130, 200, 270], // email line centres (abs)
  socket: 6,
};
/* a socket straddles the card's left edge; its left edge is the thread's end */
const P_SOCKETS = P.lineY.map((y) => makeRect(P.card.left - 3, y - 3, P.card.left + 3, y + 3));
const P_THREADS = P.chips.map((chip, i) => ({
  from: anchor(chip, 'right'),
  to: anchor(P_SOCKETS[i], 'left'),
}));

function PersonalizeScene() {
  return (
    <div className="wf-scene-canvas wf-s-personalize" data-scene="personalize">
      <svg className="wf-threads" viewBox="0 0 680 400" aria-hidden="true">
        {P_THREADS.map((t, i) => (
          <path key={`b${i}`} className="wf-ants" d={bez(t.from, t.to)} pathLength={100} />
        ))}
        {P_THREADS.map((t, i) => (
          <path
            key={`h${i}`}
            className={`wf-thread-hl wf-thread-hl-${i + 1}`}
            d={bez(t.from, t.to)}
            pathLength={100}
          />
        ))}
        <Anchors pts={P_THREADS.flatMap((t) => [t.from, t.to])} />
      </svg>
      <div className="wf-draft-layer wf-draft-1" />
      <div className="wf-draft-layer wf-draft-2" />
      {P.chips.map((c, i) => (
        <div key={i} className={`wf-ev-chip wf-ev-chip-${i + 1}`} style={box(c)}>
          <span className="wf-ev-ring" />
        </div>
      ))}
      <div className="wf-card wf-email-card" style={box(P.card)}>
        <div className="wf-subject" />
        <div className="wf-recipient-row">
          <Person size={8} tone=" is-soft" />
          <span className="wf-bar wf-recipient-bar" />
          <span className="wf-to-dot" />
        </div>
        {P.lineY.map((y, i) => (
          <Fragment key={i}>
            <span
              className="wf-line-socket"
              style={{ left: P_SOCKETS[i].left - P.card.left - 1, top: P_SOCKETS[i].top - P.card.top - 1 }}
            />
            <span
              className={`wf-bar wf-email-bar wf-email-bar-${i + 1}`}
              style={{ left: 28, top: y - 5 - P.card.top - 1 }}
            />
          </Fragment>
        ))}
        <div className="wf-signature" />
        <span className="wf-seal">
          <CheckIcon size={10} />
        </span>
      </div>
      <Person size={10} style={{ left: 622, top: 300 }} />
    </div>
  );
}

/* ── 6 · outreach — the gate chain, and the fail-closed hold ─────────────── */

/* The lane runs on y = LANE_Y under all seven stations: five gates, then the
   server (stamp), then the recipient — left to right. Stations hang above
   the lane on 30px ticks; capsules ride the lane itself, so a capsule can
   never cover a station icon. */
const O = {
  laneY: 190,
  gate: 52, // station tile size (gates + recipient)
  gateTop: 108, // gates + recipient share a baseline above the lane
  gateCx: [96, 192, 288, 384, 480],
  server: makeRect(520, 96, 584, 160),
  recipient: makeRect(602, 108, 654, 160),
  warm: makeRect(44, 262, 104, 322),
  stationBottom: 160,
  laneX1: 44,
  laneX2: 664,
};
const O_CENTERS = [...O.gateCx, O.server.cx, O.recipient.cx];
const O_CAPSULE = { w: 40, h: 22, top: O.laneY - 11 };
/* capsule A rides from before the first gate to the recipient's slot */
const O_A_START = 16;
const O_A_END = O.recipient.cx - O_CAPSULE.w / 2; // 608
/* capsule B is held 12px short of the circuit-breaker station (gate-4) */
const O_B_REST = O.gateCx[3] - O.gate / 2 - 12 - O_CAPSULE.w; // 306

function OutreachScene() {
  return (
    <div className="wf-scene-canvas wf-s-outreach" data-scene="outreach">
      <span className="wf-dots" style={{ left: 310, top: 276, width: 170, height: 80 }} />
      <div
        className="wf-lane"
        style={{ left: O.laneX1, top: O.laneY, width: O.laneX2 - O.laneX1 }}
      />
      {O_CENTERS.map((cx, i) => (
        <div
          key={i}
          className="wf-station-tick"
          style={{ left: cx, top: O.stationBottom, height: O.laneY - O.stationBottom }}
        />
      ))}
      <span className="wf-sender">
        <Person size={11} />
      </span>
      <div className="wf-icon-chip wf-gate wf-gate-1">
        <CheckCircleIcon size={22} />
        <span className="wf-gate-dot" />
      </div>
      <div className="wf-icon-chip wf-gate wf-gate-2">
        <GaugeIcon size={22} />
        <span className="wf-gate-dot" />
      </div>
      <div className="wf-icon-chip wf-gate wf-gate-3">
        <ListSlashIcon size={22} />
        <span className="wf-gate-dot" />
      </div>
      <div className="wf-icon-chip wf-gate wf-gate-4">
        <span className="wf-switch" />
        <span className="wf-gate-dot" />
      </div>
      <div className="wf-icon-chip wf-gate wf-gate-5">
        <StopIcon size={22} />
        <span className="wf-gate-dot" />
      </div>
      <div className="wf-icon-chip wf-server" style={box(O.server)}>
        <RackIcon size={26} />
      </div>
      <div className="wf-icon-chip wf-recipient" style={box(O.recipient)}>
        <Person size={15} />
      </div>
      <span className="wf-burst" aria-hidden="true">
        <i /><i /><i /><i /><i /><i /><i /><i />
      </span>
      <div className="wf-capsule wf-capsule-a">
        <EnvelopeIcon size={13} />
        <span className="wf-stamp"><StampIcon size={15} /></span>
        <span className="wf-capsule-tag"><Tag accent>SENT</Tag></span>
      </div>
      <div className="wf-capsule wf-capsule-b">
        <EnvelopeIcon size={13} />
        <span className="wf-hold"><HoldIcon size={17} /></span>
        <span className="wf-capsule-tag"><Tag>HELD</Tag></span>
      </div>
      <div className="wf-icon-chip wf-warm" style={box(O.warm)}>
        <MailWarmIcon size={20} />
      </div>
      <div className="wf-queue">
        <span className="wf-queue-env"><EnvelopeIcon size={15} /></span>
        <span className="wf-queue-env"><EnvelopeIcon size={15} /></span>
        <span className="wf-queue-env"><EnvelopeIcon size={15} /></span>
      </div>
    </div>
  );
}

/* ── 7 · converse — the reply is stitched in and sorted ─────────────────── */

const CV = {
  out: [14, 154].map((t) => makeRect(60, t, 260, t + 60)),
  inn: [84, 224].map((t) => makeRect(240, t, 440, t + 60)), // [existing, new]
  classifier: { x: 340, y: 320, half: 10.6 }, // 15px square rotated 45deg
  laneTop: 362,
  laneCx: [214, 298, 382, 466],
  icon: 19,
};
const CV_JOIN = { from: anchor(CV.out[1], 'bottom'), to: anchor(CV.inn[1], 'left') };
const CV_FEED = { from: anchor(CV.inn[1], 'bottom'), to: { x: CV.classifier.x, y: CV.classifier.y - CV.classifier.half } };
const CV_FAN = CV.laneCx.map((cx) => ({
  from: { x: CV.classifier.x, y: CV.classifier.y + CV.classifier.half },
  to: { x: cx, y: CV.laneTop },
}));
const CV_LANE_Y = CV.laneTop + CV.icon / 2;
const CV_SUPPRESS = makeRect(520, CV_LANE_Y - 23, 580, CV_LANE_Y + 23);
const CV_OPTOUT = {
  from: { x: CV.laneCx[3] + CV.icon / 2, y: CV_LANE_Y },
  to: anchor(CV_SUPPRESS, 'left'),
};
const CV_GHOST = makeRect(CV.laneCx[0] - CV.icon / 2 - 30 - 66, CV_LANE_Y - 26, CV.laneCx[0] - CV.icon / 2 - 30, CV_LANE_Y + 26);

function ConverseScene() {
  const lanes = [CheckIcon, QuestionIcon, MoonIcon, StopIcon];
  return (
    <div className="wf-scene-canvas wf-s-converse" data-scene="converse">
      <svg className="wf-links" viewBox="0 0 680 400" aria-hidden="true">
        <path className="wf-join-path" d={elbow(CV_JOIN.from, CV_JOIN.to)} pathLength={100} />
        <path className="wf-feed-path" d={bez(CV_FEED.from, CV_FEED.to, 'v')} pathLength={100} />
        {CV_FAN.map((f, i) => (
          <path key={i} className="wf-fan-path" d={bez(f.from, f.to, 'v')} />
        ))}
        <path className="wf-optout-path wf-ants" d={bez(CV_OPTOUT.from, CV_OPTOUT.to)} />
        <Anchors
          pts={[
            CV_JOIN.from,
            CV_JOIN.to,
            CV_FEED.from,
            CV_FEED.to,
            CV_FAN[0].from,
            ...CV_FAN.map((f) => f.to),
            CV_OPTOUT.from,
            CV_OPTOUT.to,
          ]}
        />
      </svg>
      <div className="wf-bubble wf-bubble-out wf-bubble-1" style={box(CV.out[0])}>
        <Person size={7} style={{ left: -15, top: 21 }} />
        <span className="wf-bar" />
        <span className="wf-bar" />
      </div>
      <div className="wf-bubble wf-bubble-in wf-bubble-2" style={box(CV.inn[0])}>
        <Person size={7} tone=" is-soft" style={{ right: -15, top: 21 }} />
        <span className="wf-bar" />
        <span className="wf-bar" />
      </div>
      <div className="wf-bubble wf-bubble-out wf-bubble-3" style={box(CV.out[1])}>
        <Person size={7} style={{ left: -15, top: 21 }} />
        <span className="wf-bar" />
        <span className="wf-bar" />
      </div>
      <div className="wf-bubble wf-bubble-in wf-bubble-new" style={box(CV.inn[1])}>
        <Person size={7} tone=" is-soft" style={{ right: -15, top: 21 }} />
        <span className="wf-typing"><i /><i /><i /></span>
        <span className="wf-bar" />
        <span className="wf-bar" />
      </div>
      <span
        className="wf-classifier"
        style={{ left: CV.classifier.x - 7.5, top: CV.classifier.y - 7.5 }}
      />
      <span
        className="wf-sort-dot"
        style={
          {
            ['--sort-path' as string]: `path('${bez(CV_FAN[0].from, CV_FAN[0].to, 'v')}')`,
          } as React.CSSProperties
        }
      />
      {lanes.map((Icon, i) => (
        <div
          key={i}
          className={`wf-lane wf-lane-${i + 1}`}
          style={{ left: CV.laneCx[i] - 22, top: CV.laneTop - 13 }}
        >
          <Icon size={CV.icon} />
        </div>
      ))}
      <div className="wf-icon-chip wf-suppress" style={box(CV_SUPPRESS)}>
        <span className="wf-vault-lid" />
        <SlashIcon size={19} />
      </div>
      <div className="wf-ghost-cal" style={box(CV_GHOST)}><CalendarIcon size={23} /></div>
    </div>
  );
}

/* ── 8 · overview — the ledger writes in, the cycle closes ───────────────── */

const OV = {
  ledger: makeRect(60, 50, 300, 350),
  card: makeRect(380, 50, 620, 350),
  rows: 7,
  rowPitch: 32,
  inset: 22,
};
const OV_FLOW = { from: anchor(OV.ledger, 'right'), to: anchor(OV.card, 'left') };

function OverviewScene() {
  return (
    <div className="wf-scene-canvas wf-s-overview" data-scene="overview">
      <svg className="wf-flow" viewBox="0 0 680 400" aria-hidden="true">
        <path className="wf-ants" d={`M ${OV_FLOW.from.x} ${OV_FLOW.from.y} L ${OV_FLOW.to.x - 5} ${OV_FLOW.to.y}`} />
        <path
          className="wf-flow-head"
          d={`M ${OV_FLOW.to.x - 9} ${OV_FLOW.to.y - 4.5} L ${OV_FLOW.to.x - 1} ${OV_FLOW.to.y} L ${OV_FLOW.to.x - 9} ${OV_FLOW.to.y + 4.5}`}
        />
        <path className="wf-gaze-path" d="M 336 298 L 380 260" />
        <Anchors pts={[OV_FLOW.from, OV_FLOW.to]} />
      </svg>
      <div className="wf-card wf-ledger-panel" style={box(OV.ledger)}>
        <div className="wf-ledger-head">
          <span className="wf-bar" />
          <span className="wf-ledger-dots"><i /><i /><i /></span>
        </div>
        <div className="wf-ledger-stack">
          {Array.from({ length: OV.rows }).map((_, i) => (
            <div key={i} className={`wf-ledger-row wf-ledger-row-${Math.min(i + 1, 4)}`}>
              <i />
              <i />
              <span />
            </div>
          ))}
        </div>
      </div>
      <div className="wf-card wf-overview-card" style={box(OV.card)}>
        <svg className="wf-chart-line" viewBox="0 0 170 62" preserveAspectRatio="none" aria-hidden="true">
          <polyline
            points="4,50 44,36 84,42 124,22 166,10"
            pathLength={100}
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <div className="wf-chart-bars"><i /><i /><i /><i /></div>
      </div>
      <span
        className="wf-flow-dot"
        style={
          {
            ['--flow-path' as string]: `path('M ${OV_FLOW.from.x} ${OV_FLOW.from.y} L ${OV_FLOW.to.x - 5} ${OV_FLOW.to.y}')`,
          } as React.CSSProperties
        }
      />
      <Person size={13} style={{ left: 318, top: 292 }} />
      <span className="wf-lock-badge">
        <LockIcon size={14} />
      </span>
    </div>
  );
}

export const STAGE_SCENES = {
  configure: <ConfigureScene />,
  discover: <DiscoverScene />,
  research: <ResearchScene />,
  qualify: <QualifyScene />,
  personalize: <PersonalizeScene />,
  outreach: <OutreachScene />,
  converse: <ConverseScene />,
  overview: <OverviewScene />,
} as const;
