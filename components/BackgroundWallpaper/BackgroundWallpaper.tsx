'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';

const StudioScene3D = dynamic(() => import('./StudioScene3D'), {
  ssr: false,
});

function resolveBackdropRoute(pathname: string | null): string {
  if (!pathname || pathname === '/') return 'home';
  if (pathname.startsWith('/process')) return 'process';
  if (pathname.startsWith('/insights')) return 'insights';
  if (pathname.startsWith('/pricing')) return 'pricing';
  if (pathname.startsWith('/connect') || pathname.startsWith('/contact')) return 'connect';
  if (pathname.startsWith('/portfolio')) return 'portfolio';
  return 'default';
}

function detectWebGLSupport(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl');
    return Boolean(gl);
  } catch {
    return false;
  }
}

/**
 * BackgroundWallpaper (GlobalBackdrop)
 *
 * Persistent 3D Industrial-Design Studio Environment for SlideIn:
 *  - Layer 1: Tactile cold-press paper micro-grain & peripheral calibration grid
 *  - Layer 2: Diffused studio illumination lobes, pointer key-light & caustic beam
 *  - Layer 3: Precision architectural orbital meridians & registration junctions
 *  - Layer 4: React Three Fiber (R3F + Three.js + Drei) 3D sculptural scene
 *             featuring 6 custom-modelled communication & research objects with
 *             physical ceramic, matte porcelain, soft-touch paper, satin brass,
 *             and brand-orange wax materials (with graceful non-WebGL fallback)
 *  - Layer 5: Central reading sanctuary & peripheral studio framing
 */
export function BackgroundWallpaper() {
  const rootRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const routeProfile = resolveBackdropRoute(pathname);

  const [webglReady, setWebglReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onMqChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', onMqChange);

    setWebglReady(detectWebGLSupport());

    return () => mq.removeEventListener('change', onMqChange);
  }, []);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) {
      el.style.setProperty('--bw-scroll-y', '0px');
      el.style.setProperty('--bw-scroll-x', '0px');
      el.style.setProperty('--bw-scroll-progress', '0');
      el.style.setProperty('--bw-pointer-x', '0');
      el.style.setProperty('--bw-pointer-y', '0');
      return;
    }

    let rafId = 0;
    let isRunning = false;

    let targetScroll = window.scrollY;
    let currentScroll = targetScroll;

    let targetPointerX = 0;
    let targetPointerY = 0;
    let currentPointerX = 0;
    let currentPointerY = 0;

    const compressScrollY = (rawY: number) => {
      return Math.tanh(rawY / 2400) * 1350 + Math.sin(rawY / 900) * 165;
    };

    const compressScrollX = (rawY: number) => {
      return Math.sin(rawY / 1150) * 22;
    };

    const tick = () => {
      if (document.hidden) {
        isRunning = false;
        return;
      }

      const scrollDiff = targetScroll - currentScroll;
      const pxDiff = targetPointerX - currentPointerX;
      const pyDiff = targetPointerY - currentPointerY;

      currentScroll += scrollDiff * 0.085;
      currentPointerX += pxDiff * 0.065;
      currentPointerY += pyDiff * 0.065;

      const effectiveScrollY = compressScrollY(currentScroll);
      const effectiveScrollX = compressScrollX(currentScroll);
      const docHeight = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      const progress = Math.min(1, Math.max(0, currentScroll / docHeight));

      el.style.setProperty('--bw-scroll-y', `${effectiveScrollY.toFixed(1)}px`);
      el.style.setProperty('--bw-scroll-x', `${effectiveScrollX.toFixed(1)}px`);
      el.style.setProperty('--bw-scroll-progress', progress.toFixed(3));
      el.style.setProperty('--bw-pointer-x', currentPointerX.toFixed(3));
      el.style.setProperty('--bw-pointer-y', currentPointerY.toFixed(3));

      if (
        Math.abs(scrollDiff) > 0.35 ||
        Math.abs(pxDiff) > 0.003 ||
        Math.abs(pyDiff) > 0.003
      ) {
        rafId = window.requestAnimationFrame(tick);
      } else {
        isRunning = false;
      }
    };

    const requestTick = () => {
      if (!isRunning && !document.hidden) {
        isRunning = true;
        rafId = window.requestAnimationFrame(tick);
      }
    };

    const onScroll = () => {
      targetScroll = window.scrollY;
      requestTick();
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      const nx = (e.clientX / Math.max(1, window.innerWidth) - 0.5) * 2;
      const ny = (e.clientY / Math.max(1, window.innerHeight) - 0.5) * 2;
      targetPointerX = Math.max(-1, Math.min(1, nx));
      targetPointerY = Math.max(-1, Math.min(1, ny));
      requestTick();
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        el.setAttribute('data-paused', 'true');
        if (rafId) {
          window.cancelAnimationFrame(rafId);
          isRunning = false;
        }
      } else {
        el.removeAttribute('data-paused');
        targetScroll = window.scrollY;
        requestTick();
      }
    };

    const initialEffectiveY = compressScrollY(window.scrollY);
    const initialEffectiveX = compressScrollX(window.scrollY);
    el.style.setProperty('--bw-scroll-y', `${initialEffectiveY.toFixed(1)}px`);
    el.style.setProperty('--bw-scroll-x', `${initialEffectiveX.toFixed(1)}px`);

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      data-testid="background-wallpaper"
      className="bw-root bg-wallpaper"
      data-backdrop-route={routeProfile}
      data-webgl-active={webglReady ? 'true' : 'false'}
      aria-hidden="true"
    >
      {/* ── LAYER 1: Tactile Cold-Press Paper Micro-Grain & Studio Grid ───── */}
      <div className="bw-grain-layer" />
      <div className="bw-studio-grid" />

      {/* ── LAYER 2: Atmospheric Studio Illumination & Caustic Diffusion ──── */}
      <div className="bw-atmosphere">
        <div className="bw-lobe bw-lobe-1" />
        <div className="bw-lobe bw-lobe-2" />
        <div className="bw-lobe bw-lobe-3" />
        <div className="bw-lobe bw-lobe-4" />
        <div className="bw-keylight" />
        <div className="bw-caustic-beam" />
      </div>

      {/* ── LAYER 3: Fine Architectural Orbital Meridians & Junctions ────── */}
      <svg
        className="bw-trajectories"
        viewBox="0 0 1600 1000"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <defs>
          <linearGradient id="bw-arc-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgb(255, 98, 0)" stopOpacity="0" />
            <stop offset="28%" stopColor="rgb(255, 98, 0)" stopOpacity="0.18" />
            <stop offset="72%" stopColor="rgb(10, 10, 10)" stopOpacity="0.09" />
            <stop offset="100%" stopColor="rgb(255, 98, 0)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="bw-arc-grad-2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgb(10, 10, 10)" stopOpacity="0" />
            <stop offset="35%" stopColor="rgb(10, 10, 10)" stopOpacity="0.09" />
            <stop offset="70%" stopColor="rgb(255, 98, 0)" stopOpacity="0.16" />
            <stop offset="100%" stopColor="rgb(255, 98, 0)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="bw-pulse-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgb(255, 98, 0)" stopOpacity="0" />
            <stop offset="50%" stopColor="rgb(255, 98, 0)" stopOpacity="0.48" />
            <stop offset="100%" stopColor="rgb(255, 138, 61)" stopOpacity="0" />
          </linearGradient>
        </defs>

        <ellipse
          cx="800"
          cy="500"
          rx="690"
          ry="340"
          transform="rotate(-8 800 500)"
          stroke="url(#bw-arc-grad-1)"
          strokeWidth="1"
          strokeDasharray="3 9"
        />
        <ellipse
          cx="800"
          cy="520"
          rx="540"
          ry="245"
          transform="rotate(6 800 520)"
          stroke="url(#bw-arc-grad-2)"
          strokeWidth="1"
          strokeDasharray="2 12"
        />

        <path
          d="M 110 240 C 460 30, 1060 70, 1490 290"
          stroke="url(#bw-arc-grad-1)"
          strokeWidth="1.35"
          strokeDasharray="6 10"
        />
        <path
          className="bw-signal-pulse"
          d="M 110 240 C 460 30, 1060 70, 1490 290"
          stroke="url(#bw-pulse-grad)"
          strokeWidth="2"
          strokeLinecap="round"
        />

        <path
          d="M 1460 540 C 1060 830, 540 850, 130 610"
          stroke="url(#bw-arc-grad-2)"
          strokeWidth="1.25"
          strokeDasharray="5 12"
        />
        <path
          className="bw-signal-pulse--reverse"
          d="M 1460 540 C 1060 830, 540 850, 130 610"
          stroke="url(#bw-pulse-grad)"
          strokeWidth="1.9"
          strokeLinecap="round"
        />
      </svg>

      {/* ── LAYER 4: Primary React Three Fiber 3D Studio Environment ─────── */}
      {webglReady ? (
        <div className="bw-webgl-stage">
          <StudioScene3D routeProfile={routeProfile} reducedMotion={reducedMotion} />
        </div>
      ) : (
        /* Static Fallback for Devices Without WebGL Support */
        <div className="bw-fallback-stage" />
      )}

      {/* ── LAYER 5: Central Reading Sanctuary & Peripheral Vignette ─────── */}
      <div className="bw-vignette-layer" />
    </div>
  );
}

export { BackgroundWallpaper as GlobalBackdrop };
export default BackgroundWallpaper;
