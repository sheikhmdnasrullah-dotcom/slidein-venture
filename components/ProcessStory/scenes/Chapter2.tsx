/**
 * CHAPTER 2 SCENE — from shortlist to personalized draft (RADIAL & EVIDENCE)
 * ---------------------------------------------------------------------------
 * Pure function of peff (scrub-reversible, no time state).
 * Input: ShortlistArtifact (6 dots, 1 accent protagonist from Ch1).
 * Output: DraftArtifact (personalized draft card with evidence threads).
 *
 * Beat 1 (p 0..0.33): Protagonist enters center; research window opens;
 *   prospect card (260x160) expands with avatar and detail bars.
 * Beat 2 (p 0.33..0.66): 3 evidence streams converge (company data,
 *   social signals, video asset clip) into claim chips; offer pill snaps to card.
 * Beat 3 (p 0.66..1.0): Draft email card writes in; dotted threads link
 *   claims to sentences; signature thread turns accent (protagonist ownership);
 *   assembles into DraftArtifact.
 *
 * Strict single protagonist (G1): accent marker transitions cleanly.
 */

'use client';

import { motion, useTransform, type MotionValue } from 'framer-motion';
import type { SceneProps } from '../ChapterShell';
import { lerp, window01 } from '../geometry';
import { artInsets } from './util';
import { ACCENT, INK, SOFT, FAINT } from '../icons';

export function Chapter2Scene({ peff, inPin, surface, tileLocal }: SceneProps) {
  const { W, H } = surface;
  const insets = artInsets(W, H);

  // Center stage coordinates
  const cx = W / 2;
  const cy = H / 2;

  // Beat 1: Entrance of prospect card & research scanner
  const b1In = useTransform(peff, (p) => window01(p, 0, 0.25));
  const cardScale = useTransform(b1In, (v) => lerp(0.9, 1, v));
  const cardOpacity = b1In;

  // Beat 2: 3 Evidence sources & claim chips
  const b2In = useTransform(peff, (p) => window01(p, 0.32, 0.55));
  const claim1Travel = useTransform(b2In, (v) => lerp(-40, 0, v));
  const claim2Travel = useTransform(b2In, (v) => lerp(40, 0, v));
  const claimOpacity = b2In;

  // Matched offer pill snaps in
  const offerSnap = useTransform(peff, (p) => window01(p, 0.48, 0.62));
  const offerY = useTransform(offerSnap, (v) => lerp(12, 0, v));

  // Beat 3: Draft writing & signature evidence line turning accent
  const b3In = useTransform(peff, (p) => window01(p, 0.65, 0.88));
  const draftDraw = useTransform(b3In, (v) => 1 - v);
  const accentGate: MotionValue<number> = useTransform(peff, (p): number => (p >= 0.82 ? 1 : 0));
  const heroOpacity = useTransform([accentGate, inPin], ([ag, ip]) => (ag as number) * (ip as number));

  // Tile-waiting protagonist while p < 0.82
  const tileMarkOpacity = useTransform([peff, inPin], ([p, ip]) =>
    (ip as number) > 0.5 && (p as number) < 0.82 ? 1 : 0
  );

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div
        data-scene-art="ch2"
        style={{
          position: 'absolute',
          left: insets.ix,
          top: insets.iy,
          right: insets.ix,
          bottom: insets.iy,
        }}
      />
      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        fill="none"
        style={{ position: 'absolute', inset: 0, overflow: 'visible' }}
      >
        {/* Source Window 1: Web & Company Data (Left) */}
        <motion.g
          style={{
            opacity: cardOpacity,
            transformBox: 'fill-box',
            transformOrigin: 'center',
          }}
        >
          <rect
            x={cx - 240}
            y={cy - 110}
            width={120}
            height={80}
            rx={8}
            fill="rgba(255,255,255,0.95)"
            stroke="rgba(10,10,10,0.08)"
            strokeWidth={1}
          />
          <rect x={cx - 228} y={cy - 98} width={50} height={6} rx={3} fill={SOFT} />
          <rect x={cx - 228} y={cy - 84} width={96} height={4} rx={2} fill={FAINT} />
          <rect x={cx - 228} y={cy - 74} width={80} height={4} rx={2} fill={FAINT} />
          <rect x={cx - 228} y={cy - 64} width={88} height={4} rx={2} fill={FAINT} />
          {/* Source Ring 1 */}
          <circle cx={cx - 132} cy={cy - 98} r={4.5} stroke={INK} strokeWidth={1.2} fill="none" />
        </motion.g>

        {/* Source Window 2: Social/Video Asset Stream (Right) */}
        <motion.g
          style={{
            opacity: cardOpacity,
            transformBox: 'fill-box',
            transformOrigin: 'center',
          }}
        >
          <rect
            x={cx + 120}
            y={cy - 110}
            width={120}
            height={80}
            rx={8}
            fill="rgba(255,255,255,0.95)"
            stroke="rgba(10,10,10,0.08)"
            strokeWidth={1}
          />
          {/* Mini 16:9 Video Box */}
          <rect x={cx + 132} y={cy - 98} width={44} height={26} rx={4} fill={FAINT} />
          <polygon
            points={`${cx + 150},${cy - 89} ${cx + 150},${cy - 81} ${cx + 158},${cy - 85}`}
            fill={INK}
          />
          <rect x={cx + 184} y={cy - 96} width={44} height={5} rx={2.5} fill={SOFT} />
          <rect x={cx + 184} y={cy - 85} width={36} height={4} rx={2} fill={FAINT} />
          {/* Waveform audio ticks */}
          <line x1={cx + 134} y1={cy - 56} x2={cx + 134} y2={cy - 48} stroke={SOFT} strokeWidth={1.5} />
          <line x1={cx + 142} y1={cy - 60} x2={cx + 142} y2={cy - 44} stroke={SOFT} strokeWidth={1.5} />
          <line x1={cx + 150} y1={cy - 58} x2={cx + 150} y2={cy - 46} stroke={SOFT} strokeWidth={1.5} />
          <line x1={cx + 158} y1={cy - 62} x2={cx + 158} y2={cy - 42} stroke={SOFT} strokeWidth={1.5} />
          <line x1={cx + 166} y1={cy - 56} x2={cx + 166} y2={cy - 48} stroke={SOFT} strokeWidth={1.5} />
          {/* Source Square 2 */}
          <rect x={cx + 218} y={cy - 58} width={8} height={8} rx={1.5} stroke={INK} strokeWidth={1.2} fill="none" />
        </motion.g>

        {/* Center Prospect & Draft Synthesis Card */}
        <motion.g
          data-icon="ch2-card"
          style={{
            scale: cardScale,
            opacity: cardOpacity,
            transformBox: 'fill-box',
            transformOrigin: 'center',
          }}
        >
          {/* Main Card Shell (240 x 150) */}
          <rect
            x={cx - 110}
            y={cy - 75}
            width={220}
            height={150}
            rx={14}
            fill="#FFFFFF"
            stroke="rgba(10,10,10,0.08)"
            strokeWidth={1}
            style={{
              filter: 'drop-shadow(0 12px 28px rgba(0,0,0,0.05))',
            }}
          />

          {/* Header Row: Avatar + Name / Title bars */}
          <circle cx={cx - 82} cy={cy - 48} r={12} fill={FAINT} stroke="rgba(10,10,10,0.12)" strokeWidth={1} />
          <rect x={cx - 62} y={cy - 54} width={72} height={7} rx={3.5} fill={SOFT} />
          <rect x={cx - 62} y={cy - 42} width={50} height={5} rx={2.5} fill={FAINT} />

          {/* Divider hairline */}
          <line x1={cx - 96} y1={cy - 24} x2={cx + 96} y2={cy - 24} stroke="rgba(10,10,10,0.06)" strokeWidth={1} />

          {/* Evidence Claim Chips (landing in beat 2) */}
          <motion.g style={{ x: claim1Travel, opacity: claimOpacity }}>
            <rect x={cx - 96} y={cy - 12} width={84} height={18} rx={6} fill="rgba(10,10,10,0.04)" stroke="rgba(10,10,10,0.08)" strokeWidth={1} />
            <circle cx={cx - 86} cy={cy - 3} r={3} fill={SOFT} />
            <rect x={cx - 78} y={cy - 5} width={56} height={4} rx={2} fill={SOFT} />
          </motion.g>

          <motion.g style={{ x: claim2Travel, opacity: claimOpacity }}>
            <rect x={cx - 2} y={cy - 12} width={96} height={18} rx={6} fill="rgba(10,10,10,0.04)" stroke="rgba(10,10,10,0.08)" strokeWidth={1} />
            <rect x={cx + 8} y={cy - 6} width={7} height={7} rx={1.5} fill={SOFT} />
            <rect x={cx + 20} y={cy - 5} width={64} height={4} rx={2} fill={SOFT} />
          </motion.g>

          {/* Matched Offer Badge */}
          <motion.g style={{ y: offerY, opacity: offerSnap }}>
            <rect x={cx - 96} y={cy + 14} width={100} height={20} rx={10} fill="var(--scaffold-accent-chip)" stroke="rgba(10,10,10,0.06)" strokeWidth={1} />
            <circle cx={cx - 84} cy={cy + 24} r={3.5} fill={ACCENT} />
            <rect x={cx - 74} y={cy + 22} width={68} height={4} rx={2} fill="rgba(10,10,10,0.7)" />
          </motion.g>

          {/* Beat 3: Written Email Draft Lines */}
          <g>
            <motion.path
              d={`M${cx - 96} ${cy + 46} L${cx + 80} ${cy + 46}`}
              stroke={INK}
              strokeWidth={2}
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray={1}
              style={{ strokeDashoffset: draftDraw }}
            />
            <motion.path
              d={`M${cx - 96} ${cy + 56} L${cx + 50} ${cy + 56}`}
              stroke={INK}
              strokeWidth={2}
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray={1}
              style={{ strokeDashoffset: draftDraw }}
            />
          </g>

          {/* Signature Evidence Thread -> Protagonist Wax Seal Mark */}
          <motion.circle
            cx={cx + 86}
            cy={cy + 56}
            r={5}
            fill="rgba(10,10,10,0.08)"
            stroke="rgba(10,10,10,0.12)"
            strokeWidth={1}
          />
        </motion.g>

        {/* Local Protagonist dot on the draft card */}
        <motion.circle
          cx={cx + 86}
          cy={cy + 56}
          r={5}
          data-protagonist="ch2-local"
          data-accent="ch2-local"
          fill={ACCENT}
          style={{
            opacity: heroOpacity,
            transformBox: 'fill-box',
            transformOrigin: 'center',
          }}
        />

        {/* Tile-waiting protagonist while p < 0.82 */}
        {(tileLocal.x !== 0 || tileLocal.y !== 0) && (
          <motion.circle
            cx={tileLocal.x}
            cy={tileLocal.y}
            r={4}
            data-protagonist="ch2-tile"
            data-accent="ch2-tile"
            fill={ACCENT}
            style={{ opacity: tileMarkOpacity }}
          />
        )}
      </svg>
    </div>
  );
}
