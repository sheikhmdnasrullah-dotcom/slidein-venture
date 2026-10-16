/**
 * UI FRAGMENTS — text-free miniature interface pieces
 * ---------------------------------------------------------------------------
 * White surface, 1px hairline, radius 20, soft shadow. Shapes, skeleton
 * bars, dots and hairlines only — no text, no digits, no initials.
 * Aria-hidden throughout.
 *
 * Attention kinds (typing, toggle, progress) animate only while the
 * attention budget grants them a slot; offscreen or tab-hidden they freeze
 * in place via animation controls (pause, not reset).
 */

'use client';

import { useEffect, useRef } from 'react';
import { motion, useAnimationControls, useReducedMotion } from 'framer-motion';
import type { FragmentKind } from './config';
import { useAttentionSlot } from './attention';
import { DoubleCheckIcon } from './icons';

const HAIRLINE = '1px solid rgba(10,10,10,0.06)';
const SURFACE = 'rgba(255,255,255,1)';
const SKELETON = 'var(--scaffold-skeleton)';
const ACCENT = 'var(--scaffold-accent)';
const DOT = 'rgba(10,10,10,0.35)';

function Shell({
  width,
  children,
  radius = 20,
}: {
  width: number;
  children: React.ReactNode;
  radius?: number;
}) {
  return (
    <div
      aria-hidden="true"
      data-floating-face=""
      style={{
        width,
        background: SURFACE,
        border: HAIRLINE,
        borderRadius: radius,
        boxShadow: 'var(--scaffold-shadow-soft)',
        padding: 12,
      }}
    >
      {children}
    </div>
  );
}

function Bar({ width, height = 8 }: { width: number | string; height?: number }) {
  return (
    <span
      aria-hidden="true"
      style={{
        display: 'block',
        width,
        height,
        borderRadius: 999,
        background: SKELETON,
      }}
    />
  );
}

/* ─── Typing bubble: three dots pulse in sequence (6s loop) ─────────── */

function TypingDots({ specId }: { specId: string }) {
  const still = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const running = useAttentionSlot(`attn-${specId}`, 10, ref);
  const controls = [useAnimationControls(), useAnimationControls(), useAnimationControls()];

  useEffect(() => {
    if (still) return;
    if (running) {
      controls.forEach((c, i) =>
        c.start({
          opacity: [0.25, 1, 0.25],
          scale: [0.85, 1.15, 0.85],
          transition: { duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 },
        }),
      );
    } else {
      controls.forEach((c) => c.stop());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, still]);

  return (
    <div ref={ref} aria-hidden="true" style={{ display: 'flex', gap: 7, alignItems: 'center', padding: '6px 4px' }}>
      {controls.map((c, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          animate={c}
          initial={false}
          style={{ width: 9, height: 9, borderRadius: 999, background: DOT, opacity: 0.55 }}
        />
      ))}
    </div>
  );
}

/* ─── Toggle: flips to the on state (accent track) every 8s ─────────── */

function ToggleSwitch({ specId }: { specId: string }) {
  const still = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const running = useAttentionSlot(`attn-${specId}`, 20, ref);
  const knob = useAnimationControls();
  const track = useAnimationControls();

  useEffect(() => {
    if (still) return;
    if (running) {
      const loop = { duration: 8, repeat: Infinity, ease: 'easeInOut' as const, times: [0, 0.5, 0.55, 0.95, 1] };
      knob.start({ x: [0, 0, 24, 24, 0], transition: loop });
      track.start({
        backgroundColor: [
          'rgba(10,10,10,0.10)',
          'rgba(10,10,10,0.10)',
          'var(--scaffold-accent)',
          'var(--scaffold-accent)',
          'rgba(10,10,10,0.10)',
        ],
        transition: loop,
      });
    } else {
      knob.stop();
      track.stop();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, still]);

  return (
    <div ref={ref} aria-hidden="true" style={{ padding: 6 }}>
      <motion.span
        aria-hidden="true"
        animate={track}
        initial={false}
        style={{
          display: 'block',
          width: 56,
          height: 32,
          borderRadius: 999,
          background: 'rgba(10,10,10,0.10)',
          position: 'relative',
        }}
      >
        <motion.span
          aria-hidden="true"
          animate={knob}
          initial={false}
          style={{
            position: 'absolute',
            left: 4,
            top: 4,
            width: 24,
            height: 24,
            borderRadius: 999,
            background: SURFACE,
            boxShadow: '0 1px 3px rgba(0,0,0,0.22)',
          }}
        />
      </motion.span>
    </div>
  );
}

/* ─── Progress pill: bar fills, then restarts ───────────────────────── */

function ProgressFill({ specId }: { specId: string }) {
  const still = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const running = useAttentionSlot(`attn-${specId}`, 60, ref);
  const fill = useAnimationControls();

  useEffect(() => {
    if (still) return;
    if (running) {
      fill.start({
        scaleX: [0, 1, 1, 0],
        transition: { duration: 6, repeat: Infinity, ease: 'easeInOut', times: [0, 0.7, 0.85, 1] },
      });
    } else {
      fill.stop();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, still]);

  return (
    <div ref={ref} aria-hidden="true" style={{ padding: 6 }}>
      <span
        aria-hidden="true"
        style={{
          display: 'block',
          width: 108,
          height: 14,
          borderRadius: 999,
          border: HAIRLINE,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <motion.span
          aria-hidden="true"
          animate={fill}
          initial={false}
          style={{
            position: 'absolute',
            inset: 2,
            borderRadius: 999,
            background: ACCENT,
            transformOrigin: 'left center',
            scaleX: 0.35,
          }}
        />
      </span>
    </div>
  );
}

/* ─── Static fragments ─────────────────────────────────────────────── */

function Slider() {
  return (
    <div aria-hidden="true" style={{ padding: '14px 10px', position: 'relative', width: 116 }}>
      <span aria-hidden="true" style={{ display: 'block', height: 2, borderRadius: 2, background: 'rgba(10,10,10,0.10)', position: 'relative' }}>
        <span aria-hidden="true" style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '62%', borderRadius: 2, background: ACCENT }} />
      </span>
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: 'calc(62% - 10px)',
          top: '50%',
          marginTop: -10,
          width: 20,
          height: 20,
          borderRadius: 999,
          background: 'linear-gradient(145deg, rgba(255,255,255,1) 0%, rgba(244,244,245,1) 100%)',
          border: HAIRLINE,
          boxShadow: '0 2px 5px rgba(0,0,0,0.16)',
        }}
      />
    </div>
  );
}

function Receipt() {
  return (
    <div aria-hidden="true" style={{ padding: '2px 12px 2px 4px', display: 'flex', alignItems: 'center', gap: 8 }}>
      <DoubleCheckIcon size={22} />
      <Bar width={44} />
    </div>
  );
}

function AvatarStack() {
  const tints = ['rgba(10,10,10,0.06)', 'rgba(10,10,10,0.10)', 'rgba(10,10,10,0.14)'];
  return (
    <div aria-hidden="true" style={{ display: 'flex', alignItems: 'center', padding: 4 }}>
      {tints.map((t, i) => (
        <span
          key={i}
          aria-hidden="true"
          style={{
            width: 30,
            height: 30,
            borderRadius: 999,
            background: t,
            border: '2px solid rgba(255,255,255,1)',
            marginLeft: i === 0 ? 0 : -10,
            zIndex: 3 - i,
          }}
        />
      ))}
      <span
        aria-hidden="true"
        style={{
          width: 30,
          height: 30,
          borderRadius: 999,
          background: SURFACE,
          border: HAIRLINE,
          marginLeft: -10,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M6 2v8M2 6h8" stroke="rgba(10,10,10,0.5)" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </span>
    </div>
  );
}

function Toast() {
  return (
    <div aria-hidden="true" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 2 }}>
      <span aria-hidden="true" style={{ width: 30, height: 30, borderRadius: 999, background: 'rgba(10,10,10,0.08)', flex: 'none' }} />
      <span aria-hidden="true" style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
        <Bar width="82%" />
        <Bar width="54%" />
      </span>
      <span aria-hidden="true" style={{ width: 8, height: 8, borderRadius: 999, background: ACCENT, flex: 'none' }} />
    </div>
  );
}

function Message() {
  return (
    <div aria-hidden="true" style={{ display: 'flex', gap: 10, padding: 2 }}>
      <span aria-hidden="true" style={{ width: 28, height: 28, borderRadius: 999, background: 'rgba(10,10,10,0.08)', flex: 'none' }} />
      <span aria-hidden="true" style={{ display: 'flex', flexDirection: 'column', gap: 7, flex: 1, paddingTop: 4 }}>
        <Bar width="92%" />
        <Bar width="68%" />
        <span aria-hidden="true" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Bar width={40} height={6} />
          <span aria-hidden="true" style={{ width: 6, height: 6, borderRadius: 999, background: ACCENT }} />
        </span>
      </span>
    </div>
  );
}

function Quote() {
  return (
    <div aria-hidden="true" style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 4 }}>
      <Bar width="88%" />
      <Bar width="72%" />
      <span aria-hidden="true" style={{ width: 26, height: 6, borderRadius: 999, background: 'rgba(10,10,10,0.14)' }} />
    </div>
  );
}

/* ─── Fragment root ────────────────────────────────────────────────── */

export function UiFragment({
  frag,
  specId,
  width,
}: {
  frag: FragmentKind;
  specId: string;
  width: number;
}) {
  switch (frag) {
    case 'typing':
      return (
        <Shell width={width}>
          <TypingDots specId={specId} />
        </Shell>
      );
    case 'toggle':
      return (
        <Shell width={width} radius={24}>
          <ToggleSwitch specId={specId} />
        </Shell>
      );
    case 'slider':
      return (
        <Shell width={width} radius={16}>
          <Slider />
        </Shell>
      );
    case 'receipt':
      return (
        <Shell width={width} radius={999}>
          <Receipt />
        </Shell>
      );
    case 'avatars':
      return (
        <Shell width={width} radius={999}>
          <AvatarStack />
        </Shell>
      );
    case 'toast':
      return (
        <Shell width={width} radius={16}>
          <Toast />
        </Shell>
      );
    case 'progress':
      return (
        <Shell width={width} radius={999}>
          <ProgressFill specId={specId} />
        </Shell>
      );
    case 'message':
      return (
        <Shell width={width}>
          <Message />
        </Shell>
      );
    case 'quote':
      return (
        <Shell width={width}>
          <Quote />
        </Shell>
      );
  }
}
