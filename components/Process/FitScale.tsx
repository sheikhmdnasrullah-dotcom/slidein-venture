'use client';

import { useLayoutEffect, useRef, useState } from 'react';

/**
 * FitScale — scales its children down to fit entirely within the container,
 * so the content never overflows and no scrolling is needed. The scaled
 * content is centered within the container.
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
 */
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

  useLayoutEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
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
  }, [children]);

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
