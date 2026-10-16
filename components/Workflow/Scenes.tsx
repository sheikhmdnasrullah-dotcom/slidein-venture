/**
 * WORKFLOW SCENES — the eight text-free stage visuals
 * ---------------------------------------------------------------------------
 * Each scene renders inside the fixed 680×400 canvas (scaled by the
 * viewport). Shapes, skeleton bars, dots and hairlines only — no text, no
 * digits, no labels. One focal moment per scene; at most two looping
 * animations visible at once. All motion is CSS (workflow.css); the base
 * styles are each element's final state, so reduced motion rests cleanly.
 * Everything here is decorative — the accessible name lives on the stage
 * slot in the content file.
 */

import {
  CalendarIcon,
  CheckCircleIcon,
  CheckIcon,
  DashIcon,
  EnvelopeIcon,
  GaugeIcon,
  HoldIcon,
  ListSlashIcon,
  MailWarmIcon,
  MoonIcon,
  QuestionIcon,
  RackIcon,
  SlashIcon,
  StampIcon,
  StopIcon,
  UserIcon,
} from './icons';

/* ── 1 · configure — a new version layer lands on the profile stack ─────── */

function ConfigureScene() {
  return (
    <div className="wf-scene-canvas wf-s-configure" data-scene="configure">
      <div className="wf-ver-layer wf-ver-layer-1" />
      <div className="wf-ver-layer wf-ver-layer-2" />
      <div className="wf-card wf-profile-card">
        <div className="wf-avatar" />
        <div className="wf-card-bars">
          <span className="wf-bar" />
          <span className="wf-bar" />
        </div>
        <div className="wf-offer-row">
          <span className="wf-offer-tile" />
          <span className="wf-offer-tile" />
          <span className="wf-offer-tile" />
        </div>
        <div className="wf-icp-ring" />
      </div>
      <div className="wf-ver-sheet" />
      <div className="wf-ver-check">
        <CheckIcon size={20} />
      </div>
    </div>
  );
}

/* ── 2 · discover — rows arrive, duplicates merge ───────────────────────── */

function DiscoverScene() {
  return (
    <div className="wf-scene-canvas wf-s-discover" data-scene="discover">
      <div className="wf-row wf-row-1">
        <span className="wf-src-dot" />
        <span className="wf-bar" />
        <span className="wf-bar" />
      </div>
      <div className="wf-row wf-row-2">
        <span className="wf-src-dot" />
        <span className="wf-bar" />
        <span className="wf-bar" />
      </div>
      <div className="wf-row wf-row-3">
        <span className="wf-src-dot" />
        <span className="wf-bar" />
        <span className="wf-bar" />
      </div>
    </div>
  );
}

/* ── 3 · research — scan the page, lift tethered claims ─────────────────── */

function ResearchScene() {
  return (
    <div className="wf-scene-canvas wf-s-research" data-scene="research">
      <div className="wf-card wf-page">
        <div className="wf-page-head" />
        <div className="wf-page-bar" />
        <div className="wf-page-bar" />
        <div className="wf-page-bar" />
        <div className="wf-page-bar" />
        <div className="wf-page-side" />
      </div>
      <div className="wf-scan-line" />
      <div className="wf-claim wf-claim-1">
        <span className="wf-claim-tether" />
      </div>
      <div className="wf-claim wf-claim-2">
        <span className="wf-claim-tether" />
      </div>
      <div className="wf-claim wf-claim-3">
        <span className="wf-claim-tether" />
      </div>
      <div className="wf-claim wf-claim-broken" />
    </div>
  );
}

/* ── 4 · qualify — the connector snaps to the best-fit offer ────────────── */

function QualifyScene() {
  return (
    <div className="wf-scene-canvas wf-s-qualify" data-scene="qualify">
      <svg className="wf-q-connector" viewBox="0 0 680 400" aria-hidden="true">
        <path
          d="M 244 190 C 320 190, 360 200, 432 200"
          pathLength={100}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div className="wf-card wf-prospect">
        <div className="wf-avatar" />
        <span className="wf-bar" />
        <span className="wf-bar" />
      </div>
      <div className="wf-q-offer wf-q-offer-1" />
      <div className="wf-q-offer wf-q-offer-2">
        <span className="wf-offer-dot" />
      </div>
      <div className="wf-q-offer wf-q-offer-3" />
      <div className="wf-q-criteria">
        <span className="wf-q-chip"><CheckIcon size={15} /></span>
        <span className="wf-q-chip"><CheckIcon size={15} /></span>
        <span className="wf-q-chip"><CheckIcon size={15} /></span>
        <span className="wf-q-chip"><DashIcon size={15} /></span>
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

function PersonalizeScene() {
  return (
    <div className="wf-scene-canvas wf-s-personalize" data-scene="personalize">
      <svg className="wf-threads" viewBox="0 0 680 400" aria-hidden="true">
        <path d="M 172 89 C 214 89, 232 150, 268 150" pathLength={100} />
        <path d="M 172 199 C 214 199, 232 200, 268 200" pathLength={100} />
        <path d="M 172 309 C 214 309, 232 250, 268 250" pathLength={100} />
        <path className="wf-thread-hl wf-thread-hl-1" d="M 172 89 C 214 89, 232 150, 268 150" pathLength={100} />
        <path className="wf-thread-hl wf-thread-hl-2" d="M 172 199 C 214 199, 232 200, 268 200" pathLength={100} />
        <path className="wf-thread-hl wf-thread-hl-3" d="M 172 309 C 214 309, 232 250, 268 250" pathLength={100} />
      </svg>
      <div className="wf-draft-layer wf-draft-1" />
      <div className="wf-draft-layer wf-draft-2" />
      <div className="wf-ev-chip wf-ev-chip-1"><span className="wf-ev-ring" /></div>
      <div className="wf-ev-chip wf-ev-chip-2"><span className="wf-ev-ring" /></div>
      <div className="wf-ev-chip wf-ev-chip-3"><span className="wf-ev-ring" /></div>
      <div className="wf-card wf-email-card">
        <div className="wf-subject" />
        <div className="wf-email-line wf-email-line-1">
          <span className="wf-line-socket" />
          <span className="wf-bar" />
        </div>
        <div className="wf-email-line wf-email-line-2">
          <span className="wf-line-socket" />
          <span className="wf-bar" />
        </div>
        <div className="wf-email-line wf-email-line-3">
          <span className="wf-line-socket" />
          <span className="wf-bar" />
        </div>
        <div className="wf-signature" />
      </div>
    </div>
  );
}

/* ── 6 · outreach — the gate chain, and the fail-closed hold ─────────────── */

function OutreachScene() {
  return (
    <div className="wf-scene-canvas wf-s-outreach" data-scene="outreach">
      <div className="wf-lane" />
      <div className="wf-icon-chip wf-gate wf-gate-1">
        <CheckCircleIcon size={24} />
        <span className="wf-gate-dot" />
      </div>
      <div className="wf-icon-chip wf-gate wf-gate-2">
        <GaugeIcon size={24} />
        <span className="wf-gate-dot" />
      </div>
      <div className="wf-icon-chip wf-gate wf-gate-3">
        <ListSlashIcon size={24} />
        <span className="wf-gate-dot" />
      </div>
      <div className="wf-icon-chip wf-gate wf-gate-4">
        <span className="wf-switch" />
        <span className="wf-gate-dot" />
      </div>
      <div className="wf-icon-chip wf-gate wf-gate-5">
        <StopIcon size={24} />
        <span className="wf-gate-dot" />
      </div>
      <div className="wf-icon-chip wf-server">
        <RackIcon size={27} />
      </div>
      <div className="wf-icon-chip wf-recipient">
        <UserIcon size={22} />
      </div>
      <div className="wf-capsule wf-capsule-a">
        <EnvelopeIcon size={15} />
        <span className="wf-stamp"><StampIcon size={17} /></span>
      </div>
      <div className="wf-capsule wf-capsule-b">
        <EnvelopeIcon size={15} />
        <span className="wf-hold"><HoldIcon size={20} /></span>
      </div>
      <div className="wf-icon-chip wf-warm">
        <MailWarmIcon size={21} />
      </div>
    </div>
  );
}

/* ── 7 · converse — the reply is stitched in and sorted ─────────────────── */

function ConverseScene() {
  return (
    <div className="wf-scene-canvas wf-s-converse" data-scene="converse">
      <div className="wf-bubble wf-bubble-out wf-bubble-1">
        <span className="wf-bar" />
        <span className="wf-bar" />
      </div>
      <div className="wf-bubble wf-bubble-in wf-bubble-2">
        <span className="wf-bar" />
        <span className="wf-bar" />
      </div>
      <div className="wf-bubble wf-bubble-out wf-bubble-3">
        <span className="wf-bar" />
        <span className="wf-bar" />
      </div>
      <div className="wf-bubble wf-bubble-in wf-bubble-new">
        <span className="wf-bar" />
        <span className="wf-bar" />
      </div>
      <span className="wf-join-line" />
      <span className="wf-classifier" />
      <span className="wf-sort-dot" />
      <div className="wf-lane wf-lane-1"><CheckIcon size={19} /></div>
      <div className="wf-lane wf-lane-2"><QuestionIcon size={19} /></div>
      <div className="wf-lane wf-lane-3"><MoonIcon size={19} /></div>
      <div className="wf-lane wf-lane-4"><StopIcon size={19} /></div>
      <span className="wf-optout-line" />
      <div className="wf-icon-chip wf-suppress"><SlashIcon size={19} /></div>
      <div className="wf-ghost-cal"><CalendarIcon size={23} /></div>
    </div>
  );
}

/* ── 8 · overview — the ledger writes in, the cycle closes ───────────────── */

function OverviewScene() {
  return (
    <div className="wf-scene-canvas wf-s-overview" data-scene="overview">
      <div className="wf-ledger-stack">
        <div className="wf-ledger-row wf-ledger-row-1"><i /><i /><span /></div>
        <div className="wf-ledger-row wf-ledger-row-2"><i /><i /><span /></div>
        <div className="wf-ledger-row wf-ledger-row-3"><i /><i /><span /></div>
      </div>
      <span className="wf-flow-arrow" />
      <div className="wf-card wf-overview-card">
        <svg className="wf-chart-line" viewBox="0 0 170 62" aria-hidden="true">
          <polyline
            points="4,50 44,36 84,42 124,22 166,10"
            pathLength={100}
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <div className="wf-chart-bars"><i /><i /><i /><i /></div>
      </div>
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
