import type { CSSProperties, ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * ARTIFACT TILE — one member of the orbit's object family.
 * ---------------------------------------------------------------------------
 * A machined slab: graphite edge plate (the thickness), ivory face, 1px
 * specular top edge, near-black Lucide glyph, and a contact shadow that sits
 * on the ground below the floating object. One light source (upper left) for
 * every object: shadows fall down and slightly right.
 *
 * Sizes are in design units; `--u` (set by the stage) turns a unit into
 * pixels, so the whole composition scales together with its container.
 */
export function ArtifactTile({
  size,
  x,
  y,
  icon,
  pip = false,
  phase = 0,
  period = 8,
  className,
  children,
}: {
  size: number;
  /** Centre position in the stage's design units. Omit for in-flow use. */
  x?: number;
  y?: number;
  icon: ReactNode;
  /** A single orange detail, reserved for the two run-mode anchors. */
  pip?: boolean;
  /** Seconds, negative start so the objects never move in unison. */
  phase?: number;
  period?: number;
  className?: string;
  children?: ReactNode;
}) {
  const placed = x !== undefined && y !== undefined;
  return (
    <div
      data-orbit-object
      className={cn('ao', placed && 'ao--placed', className)}
      style={
        {
          '--s': size,
          ...(placed ? { '--x': x, '--y': y } : null),
        } as CSSProperties
      }
    >
      <div
        className="ao-float"
        style={{ '--fp': `${period}s`, '--fd': `${-phase}s` } as CSSProperties}
      >
        <i className="ao-shadow" aria-hidden="true" />
        <i className="ao-edge" aria-hidden="true" />
        <div className="ao-face">
          <span className="ao-glyph" aria-hidden="true">
            {icon}
          </span>
          {pip ? <i className="ao-pip" aria-hidden="true" /> : null}
        </div>
        {children}
      </div>
    </div>
  );
}
