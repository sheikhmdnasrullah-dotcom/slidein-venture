'use client';

import { useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react';

/**
 * FitScale — scales its children down to fit entirely within the container,
 * so the content never overflows and no scrolling is needed.
 *
 * Usage:
 *   <div className="min-h-0 flex-1">
 *     <FitScale className="h-full">{content}</FitScale>
 *   </div>
 *
 * The component measures the natural (unscaled) size of its children and
 * applies a uniform scale transform so everything fits within the available
 * width and height. Transforms don't affect layout dimensions, so measuring
 * via scrollWidth/scrollHeight is safe regardless of the current scale.
 *
 * ── IT DOES NOTHING BELOW md, AND THAT IS THE POINT ────────────────────────
 * Uniform downscaling is the right tool for the /process slides' DESKTOP
 * artwork: a 1000×520 canvas authored once, with its geometry, type, stroke
 * weights and shadows all shrinking together. It is the wrong tool for a phone.
 *
 * Every slide already ships a real mobile layout behind `md:hidden` — a
 * vertical rail of full-width nodes. Those are authored to fit a phone, so
 * scaling them is never needed; but when one of them ran a little long, this
 * component would silently shrink the whole slide to 0.6 and the reader got
 * 8px type instead of a scroll. Worse, a SHORT mobile stack was absolutely
 * positioned at 50%/50% inside an 88dvh sheet, which is where the large dead
 * band under the header came from.
 *
 * So below 768px this renders a plain scrolling column instead. `my-auto` on
 * the inner div centres the content when it is shorter than the sheet and
 * yields to normal top-aligned scrolling when it is taller — `items-center`
 * on the flex parent would clip the top of anything that overflows.
 *
 * The breakpoint is read with useSyncExternalStore rather than an effect that
 * calls setState: the server snapshot is `false`, so SSR and first paint both
 * render the desktop branch and hydration cannot mismatch.
 */

const MOBILE_QUERY = '(max-width: 767px)';

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(MOBILE_QUERY);
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
}

export default function FitScale({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const isMobile = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(MOBILE_QUERY).matches,
    () => false
  );

  useLayoutEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    /* Refs are null on the mobile branch — it renders a different tree. */
    if (!container || !content) return;

    const update = () => {
      const cw = container.clientWidth;
      const ch = container.clientHeight;
      if (!cw || !ch) return;

      // Natural (layout) size of the content — transforms don't affect layout
      const nw = content.scrollWidth;
      const nh = content.scrollHeight;
      if (!nw || !nh) return;

      const s = Math.min(cw / nw, ch / nh, 1);
      setScale(s);
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(container);
    ro.observe(content);
    window.addEventListener('resize', update);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', update);
    };
  }, [children, isMobile]);

  if (isMobile) {
    return (
      <div className={`relative flex overflow-y-auto overscroll-contain ${className}`}>
        <div className="my-auto w-full">{children}</div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      <div
        ref={contentRef}
        className="absolute left-1/2 top-1/2 w-full"
        style={{
          transform: `translate(-50%, -50%) scale(${scale})`,
          transformOrigin: 'center center',
        }}
      >
        {children}
      </div>
    </div>
  );
}
