/**
 * HANDOFF ARTIFACTS — twin shapes shared by the spine and the sections.
 * ---------------------------------------------------------------------------
 * Each handoff renders the SAME component twice: once 32px on the spine at
 * the segment midpoint, once 32px as the input shape at the start of the
 * receiving visual. Twin equality holds by construction; the geometry suite
 * guards size (±2px) and spine centering. Ink only, no accent (transfer
 * marks are not result highlights, so the accent budget stays clean).
 */

import type { HandoffKind } from '@/content/stages';

const INK = 'rgba(10,10,10,0.30)';
const INK_DEEP = 'rgba(10,10,10,0.45)';

/** configure -> discover: concentric target ring (the saved ICP). */
export function IcpRing32() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="16" cy="16" r="13" fill="none" stroke={INK} strokeWidth="1.5" />
      <circle cx="16" cy="16" r="7.5" fill="none" stroke={INK} strokeWidth="1.5" />
      <circle cx="16" cy="16" r="2" fill={INK_DEEP} />
    </svg>
  );
}

/** research -> qualify: prospect card with tethered evidence chips. */
export function CardChips32() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
      <rect x="3" y="5" width="15" height="22" rx="3.5" fill="none" stroke={INK} strokeWidth="1.5" />
      <line x1="7" y1="11" x2="14" y2="11" stroke={INK} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="7" y1="15.5" x2="12" y2="15.5" stroke={INK} strokeWidth="1.5" strokeLinecap="round" />
      <line
        x1="18"
        y1="12"
        x2="21.5"
        y2="12"
        stroke={INK}
        strokeWidth="1"
        strokeDasharray="1.5 2"
      />
      <line
        x1="18"
        y1="20"
        x2="21.5"
        y2="20"
        stroke={INK}
        strokeWidth="1"
        strokeDasharray="1.5 2"
      />
      <rect x="22" y="9.5" width="7" height="5" rx="2.5" fill="none" stroke={INK} strokeWidth="1.25" />
      <rect x="22" y="17.5" width="7" height="5" rx="2.5" fill="none" stroke={INK} strokeWidth="1.25" />
    </svg>
  );
}

/** converse -> activity: loop arrow with a check (the closed reply loop). */
export function LoopCheck32() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
      <path
        d="M 26.5 16 A 10.5 10.5 0 1 1 16 5.5"
        fill="none"
        stroke={INK}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M 16 1.5 L 16 9.5 M 16 1.5 L 12.5 5 M 16 1.5 L 19.5 5"
        fill="none"
        stroke={INK}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.5 16.5 L15.2 19.2 L19.8 13.8"
        fill="none"
        stroke={INK_DEEP}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HandoffArtifact({ kind }: { kind: HandoffKind }) {
  if (kind === 'card-chips') return <CardChips32 />;
  if (kind === 'loop-check') return <LoopCheck32 />;
  // icp-ring, plus any future home kind (the 3 home handoffs use the above).
  return <IcpRing32 />;
}
