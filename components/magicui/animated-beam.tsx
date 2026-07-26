'use client';

import * as React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface AnimatedBeamProps {
  fromRef: React.RefObject<HTMLElement | null>;
  toRef: React.RefObject<HTMLElement | null>;
  containerRef?: React.RefObject<HTMLElement | null>;
  color?: string;
  width?: number;
  dashed?: boolean;
  duration?: number;
  delay?: number;
  className?: string;
}

export function AnimatedBeam({
  fromRef,
  toRef,
  containerRef,
  color = '#7A0A0E',
  width = 2,
  dashed = true,
  duration = 2,
  delay = 0,
  className = '',
}: AnimatedBeamProps) {
  const pathRef = React.useRef<SVGPathElement>(null);
  const pathLengthRef = React.useRef(0);
  const offset = useMotionValue(0);
  const springOffset = useSpring(offset, { stiffness: 100, damping: 30 });

  const strokeDashoffset = useTransform(springOffset, [0, 1], [0, () => -pathLengthRef.current * 2]);

  React.useEffect(() => {
    const fromEl = fromRef.current;
    const toEl = toRef.current;
    const container = containerRef?.current ?? document.body;

    if (!fromEl || !toEl) return;

    const updatePath = () => {
      const containerRect = container.getBoundingClientRect();
      const fromRect = fromEl.getBoundingClientRect();
      const toRect = toEl.getBoundingClientRect();

      const fromX = fromRect.left + fromRect.width / 2 - containerRect.left;
      const fromY = fromRect.top + fromRect.height / 2 - containerRect.top;
      const toX = toRect.left + toRect.width / 2 - containerRect.left;
      const toY = toRect.top + toRect.height / 2 - containerRect.top;

      const midX = (fromX + toX) / 2;
      const ctrlY = fromY - Math.abs(toX - fromX) * 0.25;

      const path = `M ${fromX} ${fromY} C ${midX} ${ctrlY}, ${midX} ${ctrlY}, ${toX} ${toY}`;

      if (pathRef.current) {
        pathRef.current.setAttribute('d', path);
        pathLengthRef.current = pathRef.current.getTotalLength();
        pathRef.current.style.strokeDasharray = `${pathLengthRef.current} ${pathLengthRef.current}`;
      }
    };

    updatePath();
    const ro = new ResizeObserver(updatePath);
    ro.observe(fromEl);
    ro.observe(toEl);
    window.addEventListener('resize', updatePath);
    window.addEventListener('scroll', updatePath, true);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updatePath);
      window.removeEventListener('scroll', updatePath, true);
    };
  }, [fromRef, toRef, containerRef]);

  React.useEffect(() => {
    let frame = 0;
    const animate = () => {
      frame += 1 / 60;
      offset.set((frame / duration) % 1);
      requestAnimationFrame(animate);
    };
    const timeout = setTimeout(() => {
      requestAnimationFrame(animate);
    }, delay * 1000);
    return () => clearTimeout(timeout);
  }, [duration, delay, offset]);

  const dashArray = dashed ? '12 8' : '0';

  return (
    <svg
      className={`absolute inset-0 pointer-events-none overflow-visible ${className}`}
      style={{ width: '100%', height: '100%' }}
      preserveAspectRatio="none"
    >
      <defs>
        <filter id="beam-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <motion.path
        ref={pathRef}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={dashArray}
        strokeDashoffset={strokeDashoffset}
        filter="url(#beam-glow)"
        style={{ opacity: 0.6 }}
        transition={{ duration: 0 }}
      />
      <motion.path
        ref={pathRef}
        fill="none"
        stroke={color}
        strokeWidth={width * 0.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={dashArray}
        strokeDashoffset={strokeDashoffset}
        style={{ opacity: 0.3 }}
        transition={{ duration: 0 }}
      />
    </svg>
  );
}

interface AnimatedBeamMultipleOutputProps {
  containerRef: React.RefObject<HTMLElement | null>;
  fromRef: React.RefObject<HTMLElement | null>;
  toRefs: React.RefObject<HTMLElement | null>[];
  color?: string;
  width?: number;
  dashed?: boolean;
  duration?: number;
  staggerDelay?: number;
  className?: string;
}

export function AnimatedBeamMultipleOutput({
  containerRef,
  fromRef,
  toRefs,
  color = '#7A0A0E',
  width = 2,
  dashed = true,
  duration = 2,
  staggerDelay = 0.1,
  className = '',
}: AnimatedBeamMultipleOutputProps) {
  return (
    <>
      {toRefs.map((toRef, index) => (
        <AnimatedBeam
          key={index}
          containerRef={containerRef}
          fromRef={fromRef}
          toRef={toRef}
          color={color}
          width={width}
          dashed={dashed}
          duration={duration}
          delay={index * staggerDelay}
          className={className}
        />
      ))}
    </>
  );
}