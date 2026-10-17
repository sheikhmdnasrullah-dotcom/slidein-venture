/**
 * CHAPTER 3 SCENE — Safety Checks & Deliverability Gates (LINEAR & INFRASTRUCTURE)
 * ---------------------------------------------------------------------------
 * Pure function of peff (scrub-reversible, no time state).
 * Input: DraftArtifact from Handoff 2.
 * Output: CapsuleArtifact (sealed delivery capsule).
 *
 * 4 Arch Gates along horizontal runway at y ≈ 45%:
 *   1. GateShield (Gate: authorization)
 *   2. GateArcs (Placement Risk: domain warmup & DNS handshake)
 *   3. GateSwitch (Circuit Breaker: rate limit throttle & fail-closed protection)
 *   4. GateSlash (Suppression: opt-out list enforcement)
 * Server block + Warm mailbox indicator + Recipient inbox.
 *
 * Strict single protagonist (G1): accent marker transitions cleanly.
 */

'use client';

import { motion, useTransform, type MotionValue } from 'framer-motion';
import type { SceneProps } from '../ChapterShell';
import { lerp, window01 } from '../geometry';
import { artInsets } from './util';
import {
  ACCENT,
  GateArcs,
  GateShield,
  GateSlash,
  GateSwitch,
  INK,
  SOFT,
  FAINT,
} from '../icons';

export function Chapter3Scene({ peff, inPin, surface, tileLocal }: SceneProps) {
  const { W, H } = surface;
  const insets = artInsets(W, H);

  const laneY = H * 0.44;
  const startX = insets.ix + 40;
  const endX = W - insets.ix - 40;
  const laneWidth = endX - startX;

  // Gate X centers
  const g1X = startX + laneWidth * 0.22;
  const g2X = startX + laneWidth * 0.42;
  const g3X = startX + laneWidth * 0.62;
  const g4X = startX + laneWidth * 0.82;

  // Beat 1: Launch runway entrance & draft -> capsule fold
  const b1In = useTransform(peff, (p) => window01(p, 0, 0.28));
  const runwayOpacity = b1In;

  // Beat 2: Gate clearance & circuit breaker trip on fail capsule
  const b2In = useTransform(peff, (p) => window01(p, 0.32, 0.65));
  // Protagonist travels along main lane from startX to g4X
  const riderTravel = useTransform(peff, (p) => {
    if (p < 0.28) return startX;
    if (p < 0.65) return lerp(startX, g3X + 24, (p - 0.28) / (0.65 - 0.28));
    return lerp(g3X + 24, endX, (p - 0.65) / (1.0 - 0.65));
  });

  // Second test capsule that fails at the circuit breaker (g3X)
  const failCapsuleTravel = useTransform(peff, (p) => {
    if (p < 0.35) return startX;
    return lerp(startX, g3X - 20, window01(p, 0.35, 0.52));
  });
  const failCapsuleOpacity = useTransform(peff, (p) => window01(p, 0.32, 0.4));
  const switchOpen = useTransform(peff, (p) => p >= 0.52);

  // Beat 3: Server stamp & recipient inbox delivery
  const serverStamp = useTransform(peff, (p) => window01(p, 0.72, 0.86));
  const accentGate: MotionValue<number> = useTransform(peff, (p): number => (p >= 0.84 ? 1 : 0));
  const heroOpacity = useTransform([accentGate, inPin], ([ag, ip]) => (ag as number) * (ip as number));

  // Tile-waiting protagonist while p < 0.84
  const tileMarkOpacity = useTransform([peff, inPin], ([p, ip]) =>
    (ip as number) > 0.5 && (p as number) < 0.84 ? 1 : 0
  );

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div
        data-scene-art="ch3"
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
        {/* Main Delivery Runway (Solid Hairline) */}
        <motion.line
          x1={startX}
          y1={laneY}
          x2={endX}
          y2={laneY}
          stroke="rgba(10,10,10,0.18)"
          strokeWidth={1.5}
          style={{ opacity: runwayOpacity }}
        />

        {/* Lower Fail-Test Lane for circuit breaker demonstration */}
        <motion.line
          x1={startX}
          y1={laneY + 46}
          x2={g3X}
          y2={laneY + 46}
          stroke="rgba(10,10,10,0.08)"
          strokeWidth={1}
          strokeDasharray="4 4"
          style={{ opacity: runwayOpacity }}
        />

        {/* Gate 1: GateShield (Authorization) */}
        <g style={{ opacity: 1 }}>
          <rect
            x={g1X - 24}
            y={laneY - 60}
            width={48}
            height={76}
            rx={24}
            fill="rgba(255,255,255,0.92)"
            stroke="rgba(10,10,10,0.08)"
            strokeWidth={1}
          />
          <circle cx={g1X} cy={laneY - 48} r={3} fill={INK} />
          <foreignObject x={g1X - 17} y={laneY - 42} width={34} height={34}>
            <GateShield id="scene-g1-shield" />
          </foreignObject>
        </g>

        {/* Gate 2: GateArcs (Domain Warmup & DNS Handshake) */}
        <g style={{ opacity: 1 }}>
          <rect
            x={g2X - 24}
            y={laneY - 60}
            width={48}
            height={76}
            rx={24}
            fill="rgba(255,255,255,0.92)"
            stroke="rgba(10,10,10,0.08)"
            strokeWidth={1}
          />
          <circle cx={g2X} cy={laneY - 48} r={3} fill={INK} />
          <foreignObject x={g2X - 17} y={laneY - 42} width={34} height={34}>
            <GateArcs id="scene-g2-arcs" />
          </foreignObject>
        </g>

        {/* Gate 3: GateSwitch (Circuit Breaker) */}
        <g style={{ opacity: 1 }}>
          <rect
            x={g3X - 24}
            y={laneY - 60}
            width={48}
            height={116}
            rx={24}
            fill="rgba(255,255,255,0.92)"
            stroke="rgba(10,10,10,0.08)"
            strokeWidth={1}
          />
          <circle cx={g3X} cy={laneY - 48} r={3} fill={INK} />
          <foreignObject x={g3X - 17} y={laneY - 42} width={34} height={34}>
            <GateSwitch id="scene-g3-switch" open={switchOpen.get()} />
          </foreignObject>
        </g>

        {/* Gate 4: GateSlash (Suppression Filter) */}
        <g style={{ opacity: 1 }}>
          <rect
            x={g4X - 24}
            y={laneY - 60}
            width={48}
            height={76}
            rx={24}
            fill="rgba(255,255,255,0.92)"
            stroke="rgba(10,10,10,0.08)"
            strokeWidth={1}
          />
          <circle cx={g4X} cy={laneY - 48} r={3} fill={INK} />
          <foreignObject x={g4X - 17} y={laneY - 42} width={34} height={34}>
            <GateSlash id="scene-g4-slash" />
          </foreignObject>
        </g>

        {/* Sending Server Block (Three stacked rounded bars with status LEDs) */}
        <g style={{ opacity: 1 }}>
          <rect
            x={endX - 56}
            y={laneY - 74}
            width={72}
            height={56}
            rx={10}
            fill="#FFFFFF"
            stroke="rgba(10,10,10,0.1)"
            strokeWidth={1}
          />
          <rect x={endX - 48} y={laneY - 64} width={40} height={6} rx={3} fill={SOFT} />
          <rect x={endX - 48} y={laneY - 52} width={32} height={6} rx={3} fill={SOFT} />
          <rect x={endX - 48} y={laneY - 40} width={48} height={6} rx={3} fill={SOFT} />
          {/* LED dots */}
          <circle cx={endX + 4} cy={laneY - 61} r={2} fill={INK} />
          <circle cx={endX + 4} cy={laneY - 49} r={2} fill={INK} />
          <circle cx={endX + 4} cy={laneY - 37} r={2} fill="var(--scaffold-accent)" />
        </g>

        {/* Failed Test Capsule (Held at Gate 3 with stop bars) */}
        <motion.g
          style={{
            x: failCapsuleTravel,
            y: laneY + 46,
            opacity: failCapsuleOpacity,
          }}
        >
          <rect x={-14} y={-8} width={28} height={16} rx={8} fill="rgba(10,10,10,0.12)" stroke="rgba(10,10,10,0.2)" strokeWidth={1} />
          <circle cx={4} cy={0} r={2.5} fill="rgba(10,10,10,0.5)" />
        </motion.g>

        {/* Traveling Protagonist Capsule along Main Lane */}
        <motion.g
          style={{
            x: riderTravel,
            y: laneY,
            opacity: runwayOpacity,
          }}
        >
          {/* Outer delivery pill */}
          <rect
            x={-18}
            y={-10}
            width={36}
            height={20}
            rx={10}
            fill="#FFFFFF"
            stroke="rgba(10,10,10,0.25)"
            strokeWidth={1.5}
          />
          {/* Seal ring */}
          <circle cx={6} cy={0} r={4.5} fill="none" stroke={INK} strokeWidth={1.2} />
          {/* Local Protagonist accent mark */}
          <circle
            cx={6}
            cy={0}
            r={2}
            data-protagonist="ch3-local"
            data-accent="ch3-local"
            fill={ACCENT}
            style={{ opacity: 1 }}
          />
        </motion.g>

        {/* Tile-waiting protagonist while p < 0.84 */}
        {(tileLocal.x !== 0 || tileLocal.y !== 0) && (
          <motion.circle
            cx={tileLocal.x}
            cy={tileLocal.y}
            r={4}
            data-protagonist="ch3-tile"
            data-accent="ch3-tile"
            fill={ACCENT}
            style={{ opacity: tileMarkOpacity }}
          />
        )}
      </svg>
    </div>
  );
}
