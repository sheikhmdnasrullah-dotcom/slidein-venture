import { gsap } from 'gsap';
import { CustomEase, DrawSVGPlugin, Flip, MorphSVGPlugin, MotionPathPlugin, SplitText, TextPlugin } from 'gsap/all';
gsap.registerPlugin(CustomEase, DrawSVGPlugin, Flip, MorphSVGPlugin, MotionPathPlugin, SplitText, TextPlugin);

import type {
  SceneContext,
  ThreadResult,
  ThreadConnectOpts,
  CursorOpts,
  CameraAPI,
  HudAPI,
  PersistAPI,
  CounterAPI,
  ThreadAPI,
  CursorAPI,
  GsapTween,
  GsapTimeline,
} from '../types';
import { scenes } from '../data/scenes.config';
import {
  business,
  rawRecords,
  findings,
  criteria,
  match,
  checks,
  replies,
  intents,
  ledger,
  overview,
  sources,
  email,
  held,
  warmup,
} from '../data/fixtures';

export function createEases() {
  return {
    out: 'power3.out',
    expo: 'expo.out',
    inout: 'power2.inOut',
    settle: CustomEase.create('settle', '0.22,1,0.36,1') as unknown as string,
  };
}

export function createThreadLayer(): SVGSVGElement {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 1280 720');
  svg.setAttribute('width', '1280');
  svg.setAttribute('height', '720');
  svg.setAttribute('class', 'vp-thread-svg');
  svg.style.cssText = 'position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; pointer-events: none;';
  return svg;
}

export function createCameraGroup(): HTMLDivElement {
  const group = document.createElement('div');
  group.id = 'camera';
  group.setAttribute('data-camera', 'true');
  group.style.cssText = `
    position: absolute;
    inset: 0;
    transform-origin: center top;
    transform: scale(1);
  `;
  return group;
}

export function createContext(root: HTMLElement): SceneContext {
  const eases = createEases();

  // Root must be a positioned 1280x720 artboard (the real .vp-stage already is)
  if (getComputedStyle(root).position === 'static') root.style.position = 'relative';
  if (!root.classList.contains('vp-stage')) {
    root.style.width = '1280px';
    root.style.height = '720px';
    root.style.overflow = 'hidden';
  }

  // Background layer (bottom): dot grid + film grain
  let bgLayer = root.querySelector<HTMLElement>('[data-vp-bg]');
  if (!bgLayer) {
    bgLayer = document.createElement('div');
    bgLayer.setAttribute('data-vp-bg', 'true');
    bgLayer.className = 'vp-layer-bg';
    bgLayer.innerHTML = `
      <div class="vp-grid-overlay" data-vp-grid></div>
      <svg class="vp-grain-overlay" width="1280" height="720" aria-hidden="true">
        <filter id="vp-grain-filter"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch"/></filter>
        <rect width="1280" height="720" filter="url(#vp-grain-filter)"/>
      </svg>`;
    root.appendChild(bgLayer);
  }

  // Scenes layer holds the camera group; persist + threads live inside the
  // camera group so camera pushes scale scenes, kept objects and threads together.
  let scenesLayer = root.querySelector<HTMLElement>('[data-vp-scenes]');
  if (!scenesLayer) {
    scenesLayer = document.createElement('div');
    scenesLayer.setAttribute('data-vp-scenes', 'true');
    scenesLayer.className = 'vp-layer-scenes';
    root.appendChild(scenesLayer);
  }

  let cameraGroup = scenesLayer.querySelector<HTMLElement>('#camera');
  if (!cameraGroup) {
    cameraGroup = createCameraGroup();
    scenesLayer.appendChild(cameraGroup);
  }

  let persistLayer = root.querySelector<HTMLElement>('[data-vp-persist]');
  if (!persistLayer) {
    persistLayer = document.createElement('div');
    persistLayer.setAttribute('data-vp-persist', 'true');
    persistLayer.className = 'vp-layer-persist';
    cameraGroup.appendChild(persistLayer);
  }

  let threadLayer = root.querySelector<SVGSVGElement>('[data-vp-threads]');
  if (!threadLayer) {
    threadLayer = createThreadLayer();
    threadLayer.setAttribute('data-vp-threads', 'true');
    cameraGroup.appendChild(threadLayer);
  }

  let hudLayer = root.querySelector<HTMLElement>('[data-vp-hud]');
  if (!hudLayer) {
    hudLayer = document.createElement('div');
    hudLayer.setAttribute('data-vp-hud', 'true');
    hudLayer.className = 'vp-layer-hud';
    root.appendChild(hudLayer);
  }

  let cursorLayer = root.querySelector<HTMLElement>('[data-vp-cursor]');
  if (!cursorLayer) {
    cursorLayer = document.createElement('div');
    cursorLayer.setAttribute('data-vp-cursor', 'true');
    cursorLayer.className = 'vp-layer-cursor';
    root.appendChild(cursorLayer);
  }

  // Scene containers go inside the camera group (below persist + threads)
  const scenesContainer = cameraGroup;
  for (let i = 0; i < 8; i++) {
    const existing = scenesContainer.querySelector<HTMLElement>(`[data-vp-scene="${i + 1}"]`);
    if (!existing) {
      const sc = document.createElement('div');
      sc.setAttribute('data-vp-scene', String(i + 1));
      sc.className = 'vp-scene-container';
      sc.style.cssText = 'position: absolute; inset: 0; opacity: 0; visibility: hidden;';
      // insert before persist layer so scenes stay at the bottom
      scenesContainer.insertBefore(sc, persistLayer);
    }
  }

  const ctx: SceneContext = {
    eases,
    stage: { w: 1280, h: 720 },
    config: { scenes },
    fixtures: { business, rawRecords, findings, criteria, match, checks, replies, intents, ledger, overview, sources, email, held, warmup },
    root,
    layers: {
      bg: bgLayer,
      scenes: cameraGroup,
      persist: persistLayer,
      threads: threadLayer,
      hud: hudLayer,
      cursor: cursorLayer,
    },
    tl: {} as unknown,
    reducedMotion: false,
    cameraGroup,
    camera: {} as CameraAPI,
    hud: {} as HudAPI,
    persist: (() => ({} as HTMLElement)) as PersistAPI,
    counter: (() => ({}) as GsapTimeline) as CounterAPI,
    thread: {} as ThreadAPI,
    cursor: {} as CursorAPI,
  };

  // Attach utilities
  ctx.thread = createThreadUtil(ctx);
  ctx.cursor = createCursorUtil(ctx);
  ctx.camera = createCameraUtil(ctx);
  ctx.hud = createHudUtil(ctx);
  ctx.persist = createPersistUtil(ctx);
  ctx.counter = createCounterUtil(ctx);

  return ctx;
}

// --- Thread utility ---
interface ThreadOpts {
  route?: 'elbow' | 'curve';
  kind?: 'solid' | 'dashed';
  anchor?: boolean;
  bead?: boolean;
  radius?: number;
  fromSide?: 'left' | 'right' | 'top' | 'bottom';
  toSide?: 'left' | 'right' | 'top' | 'bottom';
}

// Element rect expressed in artboard coordinates (1280x720), relative to the
// stage root, correcting for any ResizeObserver scale on the root.
function artboardRect(ctx: SceneContext, el: HTMLElement) {
  const rootRect = ctx.root.getBoundingClientRect();
  const scale = rootRect.width / 1280 || 1;
  const r = el.getBoundingClientRect();
  const x = (r.left - rootRect.left) / scale;
  const y = (r.top - rootRect.top) / scale;
  return { x, y, w: r.width / scale, h: r.height / scale, cx: x + r.width / scale / 2, cy: y + r.height / scale / 2 };
}

function elbowPath(x1: number, y1: number, x2: number, y2: number, radius: number): string {
  // Simple orthogonal routing with rounded corners
  const dx = x2 - x1;
  const dy = y2 - y1;

  if (Math.abs(dx) > Math.abs(dy)) {
    // Horizontal first
    const midX = x1 + dx;
    const corner1 = [x1 + dx * 0.25, y1];
    const corner2 = [x1 + dx * 0.75, y2];
    return `M${x1} ${y1}
            L${corner1[0] - radius} ${corner1[1]}
            a${radius} ${radius} 0 0 ${dy >= 0 ? 0 : 1} ${radius} ${dy >= 0 ? radius : -radius}
            L${corner2[0]} ${corner2[1]}
            a${radius} ${radius} 0 0 ${dy >= 0 ? 1 : 0} ${dy >= 0 ? -radius : radius} ${radius}
            L${x2} ${y2}`;
  } else {
    // Vertical first
    const corner1 = [x1, y1 + dy * 0.25];
    const corner2 = [x2, y1 + dy * 0.75];
    return `M${x1} ${y1}
            L${corner1[0]} ${corner1[1] - radius}
            a${radius} ${radius} 0 0 ${dx >= 0 ? 0 : 1} ${dx >= 0 ? radius : -radius} ${radius}
            L${corner2[0]} ${corner2[1]}
            a${radius} ${radius} 0 0 ${dx >= 0 ? 1 : 0} ${dx >= 0 ? -radius : radius} ${radius}
            L${x2} ${y2}`;
  }
}

function createThreadUtil(ctx: SceneContext): SceneContext['thread'] {
  let cached: Map<string, { path: string; scale: number }> = new Map();

  return {
    connect: (fromEl, toEl, opts: ThreadOpts = {}) => {
      const r = opts.radius || 12;

      const from = artboardRect(ctx, fromEl);
      const to = artboardRect(ctx, toEl);

      const sidePoint = (rect: typeof from, side?: ThreadOpts['fromSide']) => {
        switch (side) {
          case 'left': return { x: rect.x, y: rect.cy };
          case 'right': return { x: rect.x + rect.w, y: rect.cy };
          case 'top': return { x: rect.cx, y: rect.y };
          case 'bottom': return { x: rect.cx, y: rect.y + rect.h };
          default: return { x: rect.cx, y: rect.cy };
        }
      };
      const fp = sidePoint(from, opts.fromSide);
      const tp = sidePoint(to, opts.toSide);
      const fromX = fp.x;
      const fromY = fp.y;
      const toX = tp.x;
      const toY = tp.y;

      let path: string;
      if (opts.route === 'curve') {
        path = `M${fromX} ${fromY} C${fromX} ${toY} ${toX} ${fromY} ${toX} ${toY}`;
      } else {
        path = elbowPath(fromX, fromY, toX, toY, r);
      }

      const svg = ctx.layers.threads;
      const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      pathEl.setAttribute('d', path);
      pathEl.setAttribute('fill', 'none');

      if (opts.kind === 'dashed') {
        pathEl.setAttribute('stroke', 'var(--vp-ink-300)');
        pathEl.setAttribute('stroke-width', '2');
        pathEl.setAttribute('stroke-dasharray', '6 4');
      } else {
        pathEl.setAttribute('stroke', 'var(--vp-thread)');
        pathEl.setAttribute('stroke-width', '2');
        pathEl.setAttribute('stroke-linecap', 'round');
      }

      svg.appendChild(pathEl);

      // Anchor tick
      let bead: SVGCircleElement | null = null;
      if (opts.anchor) {
        const tick = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        tick.setAttribute('x', String(fromX - 1.5));
        tick.setAttribute('y', String(fromY - 4));
        tick.setAttribute('width', '3');
        tick.setAttribute('height', '8');
        tick.setAttribute('fill', 'var(--vp-thread)');
        svg.appendChild(tick);
      }

      if (opts.bead) {
        bead = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        bead.setAttribute('r', '8');
        bead.setAttribute('fill', 'var(--vp-thread)');
        bead.setAttribute('stroke', 'white');
        bead.setAttribute('stroke-width', '2');
        // Park at the path start, hidden until travel runs
        const start = path.match(/M(-?[\d.]+)[ ,](-?[\d.]+)/);
        if (start) {
          bead.setAttribute('cx', start[1]);
          bead.setAttribute('cy', start[2]);
        }
        bead.setAttribute('opacity', '0');
        svg.appendChild(bead);
      }

      const result: ThreadResult = {
        el: pathEl,
        path,
        draw: (dur = 1, ease = ctx.eases.expo): GsapTween => {
          return gsap.fromTo(pathEl, {
            drawSVG: '0% 0%',
          }, {
            drawSVG: '100% 0%',
            duration: dur,
            ease,
            paused: true,
          }) as unknown as GsapTween;
        },
        travel: (dur = 1, ease = ctx.eases.inout): GsapTween => {
          if (!bead) return gsap.timeline() as unknown as GsapTween;
          return gsap.to(bead, {
            motionPath: { path },
            autoAlpha: 1,
            duration: dur,
            ease,
            paused: true,
          }) as unknown as GsapTween;
        },
        erase: (dur = 0.4): GsapTween => {
          return gsap.to(pathEl, {
            drawSVG: '0% 0%',
            duration: dur,
            ease: ctx.eases.settle,
            paused: true,
          }) as unknown as GsapTween;
        },
      };

      return result;
    },
  };
}

// --- Cursor utility ---
interface CursorOptions {
  dur?: number;
  curve?: boolean;
}

function createCursorUtil(ctx: SceneContext): SceneContext['cursor'] {
  let cursorEl: HTMLElement | null = null;

  function ensureCursor(): HTMLElement {
    if (cursorEl) return cursorEl;
    cursorEl = document.createElement('div');
    cursorEl.className = 'vp-cursor';
    cursorEl.setAttribute('aria-hidden', 'true');
    cursorEl.style.opacity = '0';
    cursorEl.innerHTML = `
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
        <path d="M5 17L12 5L14 9L17 4L19 8L15 12L19 16H5Z" fill="var(--vp-ink-950)" stroke="white" stroke-width="1.5" stroke-linejoin="round"/>
      </svg>
      <div class="vp-cursor-ripple" style="position:absolute;width:0;height:0;border-radius:50%;background:color-mix(in srgb, var(--vp-thread-tint) 70%, transparent);pointer-events:none;"></div>
    `;
    ctx.layers.cursor.appendChild(cursorEl);
    return cursorEl;
  }

  return {
    moveTo: (target: HTMLElement, opts: CursorOpts = {}): GsapTimeline => {
      const cursor = ensureCursor();
      const rect = artboardRect(ctx, target);
      const x = rect.cx;
      const y = rect.cy;

      const dur = opts.dur || 0.6;
      const ease = opts.curve ? ctx.eases.out : ctx.eases.inout;

      const tl = gsap.timeline({ paused: true });
      if (opts.from) {
        tl.set(cursor, { x: opts.from.x, y: opts.from.y, opacity: 0 });
      }
      tl.to(cursor, {
        x,
        y,
        autoAlpha: 1,
        duration: dur,
        ease,
      }) as unknown as GsapTimeline;
      return tl as unknown as GsapTimeline;
    },
    click: (): GsapTimeline => {
      const cursor = ensureCursor();
      const ripple = cursor.querySelector('.vp-cursor-ripple');
      if (ripple) {
        const tl = gsap.timeline({ paused: true });
        tl.set(ripple, { width: 0, height: 0, x: 0, y: 0, opacity: 0.6 });
        tl.to(ripple, { width: 32, height: 32, x: -16, y: -16, opacity: 0, duration: 0.5, ease: ctx.eases.out });
        return tl as unknown as GsapTimeline;
      }
      return gsap.timeline() as unknown as GsapTimeline;
    },
    hide: (): GsapTween => {
      const cursor = ensureCursor();
      return gsap.to(cursor, { autoAlpha: 0, duration: 0.2, ease: ctx.eases.out }) as unknown as GsapTween;
    },
  };
}

// --- Camera utility ---
function createCameraUtil(ctx: SceneContext): SceneContext['camera'] {
  return {
    push: (scale: number, x: number, y: number, dur: number = 1.5, ease?: string): GsapTimeline => {
      const group = ctx.cameraGroup;
      return gsap.timeline({ paused: true }).to(group, {
        scale,
        x,
        y,
        duration: dur,
        ease: ease || ctx.eases.inout,
        overwrite: true,
      }) as unknown as GsapTimeline;
    },
    release: (dur: number = 1.2): GsapTimeline => {
      const group = ctx.cameraGroup;
      return gsap.timeline({ paused: true }).to(group, {
        scale: 1,
        x: 0,
        y: 0,
        duration: dur,
        ease: ctx.eases.inout,
        overwrite: true,
      }) as unknown as GsapTimeline;
    },
  };
}

// --- HUD utility ---
function createHudUtil(ctx: SceneContext): SceneContext['hud'] {
  let chip: HTMLElement | null = null;

  function ensureChip(): HTMLElement {
    if (chip) return chip;
    chip = document.createElement('div');
    chip.className = 'vp-hud';
    chip.setAttribute('aria-hidden', 'true');
    ctx.layers.hud.appendChild(chip);
    return chip;
  }

  return {
    setProfile: (label: string): GsapTween => {
      const hud = ensureChip();
      if (hud) {
        hud.innerHTML = `
          <span class="vp-hud-bead"></span>
          <span class="vp-tag">${label}</span>
        `;
        return gsap.fromTo(hud, { opacity: 0, y: -8 }, { opacity: 1, y: 0, duration: 0.5, ease: ctx.eases.settle, paused: true }) as unknown as GsapTween;
      }
      return gsap.timeline() as unknown as GsapTween;
    },
    ensure: (): GsapTween => {
      const hud = ensureChip();
      if (hud && !hud.querySelector('.vp-tag')) {
        hud.innerHTML = `
          <span class="vp-hud-bead"></span>
          <span class="vp-tag">Profile v3</span>
        `;
      }
      return gsap.to(hud, { opacity: 1, y: 0, duration: 0.01, paused: true }) as unknown as GsapTween;
    },
    pulse: (): GsapTimeline => {
      const hud = ensureChip();
      if (hud) {
        return gsap.timeline({ paused: true })
          .to(hud.querySelector('.vp-hud-bead'), { scale: 1.3, duration: 0.3, ease: ctx.eases.out })
          .to(hud.querySelector('.vp-hud-bead'), { scale: 1, duration: 0.4, ease: ctx.eases.settle }) as unknown as GsapTimeline;
      }
      return gsap.timeline() as unknown as GsapTimeline;
    },
    addTag: (text: string): GsapTween => {
      const hud = ensureChip();
      if (hud) {
        const tag = document.createElement('span');
        tag.className = 'vp-tag';
        tag.textContent = text;
        hud.appendChild(tag);
        return gsap.fromTo(tag, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.3, ease: ctx.eases.settle, paused: true }) as unknown as GsapTween;
      }
      return gsap.timeline() as unknown as GsapTween;
    },
  };
}

// --- Persist utility ---
function createPersistUtil(ctx: SceneContext): PersistAPI {
  const fn: PersistAPI = (el: HTMLElement) => {
    // Reparent element into persist layer while keeping artboard position
    const r = artboardRect(ctx, el);
    ctx.layers.persist.appendChild(el);
    el.style.position = 'absolute';
    el.style.left = `${r.x}px`;
    el.style.top = `${r.y}px`;
    el.style.width = `${r.w}px`;
    el.style.height = `${r.h}px`;
    el.style.margin = '0';

    return el;
  };
  return fn;
}

// --- Counter utility ---
function createCounterUtil(ctx: SceneContext): CounterAPI {
  const fn: CounterAPI = (el: HTMLElement, from: number, to: number, dur: number = 0.8): GsapTimeline => {
    const obj = { val: from };
    return gsap.timeline({ paused: true }).to(obj, {
      val: to,
      duration: dur,
      ease: 'none',
      onUpdate: () => {
        el.textContent = Math.round(obj.val).toString().padStart(String(to).length, '0');
      },
    }) as unknown as GsapTimeline;
  };
  return fn;
}
