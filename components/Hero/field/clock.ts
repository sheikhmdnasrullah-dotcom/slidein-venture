/**
 * HERO FIELD CLOCK — the one animation clock in the hero field.
 * ---------------------------------------------------------------------------
 * 35 seconds per cycle:
 *   configure, discover, research, qualify, personalize, outreach  5s each
 *   converse and overview share the final 5s                        2.5s each
 *
 * 6 × 5000 + 5000 = 35000ms. The dot ARRIVES at the start of its slot; it
 * travels along the path during the last TRAVEL_MS of the previous slot, so
 * the arrival and the state change are the same instant by construction
 * rather than by two timers agreeing.
 *
 * There is no dashboard to share this with — the hero console was removed at
 * the owner's instruction — so this file IS the shared table. Anything that
 * later needs the same stage index reads `stageAt(t)`; it must not start a
 * second clock.
 */

export const CYCLE_MS = 35_000;
export const STANDARD_SLOT_MS = 5_000;
export const TRAVEL_MS = 600;
export const COUNT = 8;

/** Slot start times in ms, index-aligned with STAGE_ORDER. */
export const SLOT_START: number[] = (() => {
  const out: number[] = [];
  for (let k = 0; k < COUNT; k++) {
    // The first six get a full slot; the last two share one.
    out.push(k < 6 ? k * STANDARD_SLOT_MS : 6 * STANDARD_SLOT_MS);
  }
  return out;
})();

/** Slot duration in ms, index-aligned with STAGE_ORDER. */
export const SLOT_MS: number[] = (() => {
  const out: number[] = [];
  for (let k = 0; k < COUNT; k++) {
    out.push(k < 6 ? STANDARD_SLOT_MS : STANDARD_SLOT_MS / 2);
  }
  return out;
})();

/** Phase within the current slot, 0..1. */
export function slotPhase(t: number): number {
  const c = ((t % CYCLE_MS) + CYCLE_MS) % CYCLE_MS;
  for (let k = COUNT - 1; k >= 0; k--) {
    if (c >= SLOT_START[k]) {
      const span = SLOT_MS[k];
      return Math.min(1, Math.max(0, (c - SLOT_START[k]) / span));
    }
  }
  return 0;
}

/**
 * The active stage index at time `t` — the value that must agree across the
 * tile lift, the label weight, the path state and the protagonist.
 *
 * During the last TRAVEL_MS of a slot the PREVIOUS stage is still active:
 * the dot has not arrived yet. "Previous" is the slot containing `t` — the
 * dot travels toward the NEXT stage during this slot's tail and arrives
 * exactly at the boundary, so the active index is `k`, not `k - 1` (which
 * regressed the stage — and any consumer like the subline phrases — for
 * 600ms at every boundary).
 */
export function stageAt(t: number): number {
  const c = ((t % CYCLE_MS) + CYCLE_MS) % CYCLE_MS;
  for (let k = 0; k < COUNT; k++) {
    if (c < SLOT_START[k] + SLOT_MS[k]) {
      return k;
    }
  }
  return COUNT - 1;
}

/**
 * Progress along the segment leaving stage `k`, 0..1. Non-zero only during
 * the TRAVEL_MS tail of slot k, which is when the dot is on the path.
 */
export function travelAt(t: number): number {
  const c = ((t % CYCLE_MS) + CYCLE_MS) % CYCLE_MS;
  for (let k = 0; k < COUNT; k++) {
    const end = SLOT_START[k] + SLOT_MS[k];
    if (c >= end - TRAVEL_MS && c < end) {
      return Math.max(0, Math.min(1, (c - (end - TRAVEL_MS)) / TRAVEL_MS));
    }
  }
  return 0;
}

/** Which segment the dot is on at time `t`, or -1 when it is resting. */
export function segmentAt(t: number): number {
  const c = ((t % CYCLE_MS) + CYCLE_MS) % CYCLE_MS;
  for (let k = 0; k < COUNT; k++) {
    const end = SLOT_START[k] + SLOT_MS[k];
    if (c >= end - TRAVEL_MS && c < end) return k;
  }
  return -1;
}

/** True while the dot is travelling (segment in motion). */
export function isTraveling(t: number): boolean {
  return travelAt(t) > 0;
}

/** Serialisable clock state for tests and the debug overlay. */
export function clockState(t: number) {
  return {
    t: Math.round(t),
    cycle: Math.round(t / CYCLE_MS),
    stage: stageAt(t),
    segment: segmentAt(t),
    travel: Number(travelAt(t).toFixed(4)),
    phase: Number(slotPhase(t).toFixed(4)),
  };
}