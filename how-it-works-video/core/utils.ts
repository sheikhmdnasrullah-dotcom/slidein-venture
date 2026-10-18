import { gsap } from 'gsap';
import { CustomEase, DrawSVGPlugin, MorphSVGPlugin, MotionPathPlugin } from 'gsap/all';
gsap.registerPlugin(CustomEase, DrawSVGPlugin, MorphSVGPlugin, MotionPathPlugin);

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
  svg.style.cssText = 'position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible;';

  // Background grid for the SVG
  const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  bg.setAttribute('width', '1280');
  bg.setAttribute('height', '720');
  bg.setAttribute('fill', 'var(--vp-stage)');
  svg.appendChild(bg);

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

  // Find or create layers
  let scenesLayer = root.querySelector<HTMLElement>('[data-vp-scenes]');
  if (!scenesLayer) {
    scenesLayer = document.createElement('div');
    scenesLayer.setAttribute('data-vp-scenes', 'true');
    scenesLayer.className = 'vp-layer-scenes';
    root.appendChild(scenesLayer);
  }

  let bgLayer = root.querySelector<HTMLElement>('[data-vp-bg]');
  if (!bgLayer) {
    bgLayer = document.createElement('div');
    bgLayer.setAttribute('data-vp-bg', 'true');
    bgLayer.className = 'vp-layer-bg';
    root.appendChild(bgLayer);
  }

  let persistLayer = root.querySelector<HTMLElement>('[data-vp-persist]');
  if (!persistLayer) {
    persistLayer = document.createElement('div');
    persistLayer.setAttribute('data-vp-persist', 'true');
    persistLayer.className = 'vp-layer-persist';
    root.appendChild(persistLayer);
  }

  let threadLayer = root.querySelector<SVGSVGElement>('[data-vp-threads]');
  if (!threadLayer) {
    threadLayer = createThreadLayer();
    threadLayer.setAttribute('data-vp-threads', 'true');
    root.appendChild(threadLayer);
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

  // Create camera group inside scenes layer
  let cameraGroup = scenesLayer.querySelector<HTMLElement>('#camera');
  if (!cameraGroup) {
    cameraGroup = createCameraGroup();
    scenesLayer.appendChild(cameraGroup);
  }

  // Scene containers go inside the camera group
  const scenesContainer = cameraGroup;
  // Create 8 scene containers
  for (let i = 0; i < 8; i++) {
    const existing = scenesContainer.querySelector<HTMLElement>(`[data-vp-scene="${i + 1}"]`);
    if (!existing) {
      const sc = document.createElement('div');
      sc.setAttribute('data-vp-scene', String(i + 1));
      sc.className = 'vp-scene-container';
      sc.style.cssText = 'position: absolute; inset: 0; opacity: 0; visibility: hidden;';
      scenesContainer.appendChild(sc);
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

function getRect(el: HTMLElement): DOMRect {
  return el.getBoundingClientRect();
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

      const fromRect = getRect(fromEl);
      const toRect = getRect(toEl);

      const scale = 1280 / ctx.stage.w;
      const fromX = (fromRect.left + fromRect.width / 2) / scale;
      const fromY = (fromRect.top + fromRect.height / 2) / scale;
      const toX = (toRect.left + toRect.width / 2) / scale;
      const toY = (toRect.top + toRect.height / 2) / scale;

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
        svg.appendChild(bead);
      }

      const result: ThreadResult = {
        el: pathEl,
        path,
        draw: (dur = 1, ease = ctx.eases.expo): GsapTween => {
          return gsap.to(pathEl, {
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
            duration: dur,
            ease,
            paused: true,
          }) as unknown as GsapTween;
        },
        erase: (dur = 0.4): GsapTween => {
          return gsap.to(pathEl, {
            drawSVG: '0% 100%',
            duration: dur,
            ease: ctx.eases.settle,
            paused: true,
            onComplete: () => pathEl.remove(),
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
    cursorEl.innerHTML = `
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
        <path d="M5 17L12 5L14 9L17 4L19 8L15 12L19 16H5Z" fill="var(--vp-ink-950)" stroke="white" stroke-width="1.5" stroke-linejoin="round"/>
      </svg>
      <div class="vp-cursor-ripple" style="position:absolute;width:0;height:0;border-radius:50%;background:color-mix(in srgb, var(--vp-thread-tint) 40%, transparent);pointer-events:none;"></div>
    `;
    ctx.layers.cursor.appendChild(cursorEl);
    return cursorEl;
  }

  return {
    moveTo: (target: HTMLElement, opts: CursorOpts = {}): GsapTimeline => {
      const cursor = ensureCursor();
      const rect = target.getBoundingClientRect();
      const scale = 1280 / ctx.stage.w;
      const x = rect.left / scale + rect.width / (2 * scale);
      const y = rect.top / scale + rect.height / (2 * scale);

      const dur = opts.dur || 0.6;
      const ease = opts.curve ? ctx.eases.out : ctx.eases.inout;

      return gsap.timeline({ paused: true }).to(cursor, {
        x,
        y,
        duration: dur,
        ease,
        onUpdate: function () {
          const v = this.targets()[0] as { _gsap: { x: number; y: number } };
          cursor.style.transform = `translate3d(${v._gsap.x}px, ${v._gsap.y}px, 0)`;
        },
      }) as unknown as GsapTimeline;
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
      return gsap.to(cursor, { opacity: 0, duration: 0.2, ease: ctx.eases.out, onComplete: () => cursor.remove() }) as unknown as GsapTween;
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
    const rect = el.getBoundingClientRect();
    const scale = 1280 / ctx.stage.w;
    const x = rect.left / scale;
    const y = rect.top / scale;
    const w = rect.width / scale;
    const h = rect.height / scale;

    ctx.layers.persist.appendChild(el);
    el.style.position = 'absolute';
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.width = `${w}px`;
    el.style.height = `${h}px`;

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
