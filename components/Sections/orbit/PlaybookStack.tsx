'use client';

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import type { CSSProperties } from 'react';

/**
 * PLAYBOOK STACK — the central object.
 * ---------------------------------------------------------------------------
 * Three machined slabs, exploded along Z in an isometric pose: a graphite
 * base, a darker ivory plate, and an ivory top plate carrying the only orange
 * on the object (one small inlay). Each slab is a few stacked layers so the
 * edge reads as a real thickness. Pure CSS 3D: no WebGL, no extra dependency.
 *
 * `tiltX` / `tiltY` are pointer offsets in -0.5..0.5 supplied by the stage;
 * the object turns at most 4deg, so the geometry never distorts. `gap` is the
 * slab separation in design units, driven by scroll.
 */
const LAYERS = [0, 1, 2, 3, 4, 5];

export function PlaybookStack({
  tiltX,
  tiltY,
  gap,
}: {
  tiltX?: ReturnType<typeof useMotionValue<number>>;
  tiltY?: ReturnType<typeof useMotionValue<number>>;
  gap?: ReturnType<typeof useMotionValue<number>>;
}) {
  const still = useReducedMotion();
  const zero = useMotionValue(0);
  const sx = useSpring(tiltX ?? zero, { stiffness: 90, damping: 18, mass: 0.6 });
  const sy = useSpring(tiltY ?? zero, { stiffness: 90, damping: 18, mass: 0.6 });
  const rotateY = useTransform(sx, [-0.5, 0.5], still ? [0, 0] : [-4, 4]);
  const rotateX = useTransform(sy, [-0.5, 0.5], still ? [0, 0] : [4, -4]);
  const fixedGap = useMotionValue(32);
  const g = gap ?? fixedGap;

  return (
    <motion.div className="ps" style={{ '--gap': g } as unknown as CSSProperties}>
      <i className="ps-ground" aria-hidden="true" />
      <motion.div className="ps-tilt" style={{ rotateX, rotateY }}>
        <div className="ps-rig">
          {[0, 1, 2].map((i) => (
            <div key={i} className={`ps-slab ps-slab--${i}`} style={{ '--i': i } as CSSProperties}>
              {LAYERS.map((k) => (
                <b key={k} style={{ '--k': k } as CSSProperties} />
              ))}
              {i === 2 ? (
                <>
                  <i className="ps-inset" />
                  <i className="ps-inlay" />
                </>
              ) : null}
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
