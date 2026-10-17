/**
 * HANDOFF ZONE — the contract pod between chapters (160px, not pinned)
 * ---------------------------------------------------------------------------
 * The spine passes through a contract pod (56×28 pill, input dots, ring,
 * output dots). Above sits the finished chapter's OUTPUT artifact, below
 * the identical artifact as the next chapter's INPUT — same shape, same
 * size, both centered on the spine (G4). The rider docks at each in turn;
 * twin accent dots light only near the rider (G6).
 *
 * Twins carry data-handoff ids for the geometry test (w/h/x within 2px,
 * same pod) and data-twin-dot for the engine's proximity accents.
 */

'use client';

import {
  CapsuleArtifact,
  ContractPod,
  DraftArtifact,
  LoopCheckArtifact,
  ShortlistArtifact,
} from './icons';

function Twin({ n, slot }: { n: number; slot: 'out' | 'in' }) {
  const id = `h${n}-${slot}`;
  const twinDot = `${id}-dot`;
  switch (n) {
    case 1:
      return <ShortlistArtifact id={id} twinDot={twinDot} />;
    case 2:
      return <DraftArtifact id={id} twinDot={twinDot} />;
    case 3:
      return <CapsuleArtifact id={id} twinDot={twinDot} />;
    default:
      return <LoopCheckArtifact id={id} twinDot={twinDot} />;
  }
}

export function HandoffZone({ n }: { n: number }) {
  return (
    <div className="story-handoff" aria-hidden="true">
      <div className="story-container" style={{ height: '100%' }}>
        {/* Rail mirrors the chapter spine column so the pod sits on the
            spine x (96px desktop; pulled to 20px below 1024 like the grid). */}
        <div
          className="handoff-rail"
          style={{
            width: 96,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
          }}
        >
          <div
            data-handoff={`h${n}-out`}
            style={{ height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Twin n={n} slot="out" />
          </div>
          <div data-spine-node={`pod-${n}`} style={{ position: 'relative', zIndex: 2 }}>
            <ContractPod id={`pod-${n}`} />
          </div>
          <div
            data-handoff={`h${n}-in`}
            style={{ height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Twin n={n} slot="in" />
          </div>
        </div>
      </div>
    </div>
  );
}
