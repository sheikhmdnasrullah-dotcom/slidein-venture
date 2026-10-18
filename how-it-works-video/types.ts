export interface VideoPlayerOptions {
  autoPlay?: boolean;
  reducedMotion?: boolean;
  onSceneChange?: (index: number) => void;
  onPlay?: () => void;
  onPause?: () => void;
}

// Lightweight GSAP type aliases
export type GsapTween = {
  duration: number;
  progress: (value?: number) => number;
  pause: () => void;
  play: () => void;
  restart: () => void;
  kill: () => void;
};

export type GsapTimeline = {
  duration: () => number;
  progress: (value?: number) => number;
  time: (value?: number) => number;
  seek: (position: number | string, suppressEvents?: boolean) => GsapTimeline;
  play: (from?: number, suppressEvents?: boolean) => GsapTimeline;
  pause: (atTime?: number) => GsapTimeline;
  restart: (from?: number, suppressEvents?: boolean) => GsapTimeline;
  add: (child: unknown, position?: number | string, align?: string, stagger?: number) => GsapTimeline;
  set: (target: unknown, vars: Record<string, unknown>, position?: number | string) => GsapTimeline;
  to: (target: unknown, vars: Record<string, unknown>, position?: number | string) => GsapTimeline;
  from: (target: unknown, vars: Record<string, unknown>, position?: number | string) => GsapTimeline;
  fromTo: (target: unknown, fromVars: Record<string, unknown>, toVars: Record<string, unknown>, position?: number | string) => GsapTimeline;
  addLabel: (label: string, position?: number) => GsapTimeline;
  addPause: (position?: number, callback?: () => void, params?: unknown[], scope?: unknown) => GsapTimeline;
  timeScale: (value?: number) => number;
  eventCallback: (type: string, callback?: () => void, params?: unknown[], scope?: unknown) => GsapTimeline;
  isActive: () => boolean;
  remove: () => GsapTimeline;
  vars: Record<string, unknown>;
};

export interface PlayerAPI {
  timeline: GsapTimeline | null;
  play: () => void;
  pause: () => void;
  seek: (seconds: number) => void;
  goToScene: (index: number) => void;
  next: () => void;
  prev: () => void;
  destroy: () => void;
  on: (event: string, cb: (payload?: any) => void) => void;
}

export interface ThreadResult {
  el: SVGPathElement;
  path: string;
  draw: (dur?: number, ease?: string) => GsapTween;
  travel: (dur?: number, ease?: string) => GsapTween;
  erase: (dur?: number) => GsapTween;
}

export interface ThreadConnectOpts {
  route?: 'elbow' | 'curve';
  kind?: 'solid' | 'dashed';
  anchor?: boolean;
  bead?: boolean;
  radius?: number;
  fromSide?: 'left' | 'right' | 'top' | 'bottom';
  toSide?: 'left' | 'right' | 'top' | 'bottom';
}

export interface CursorOpts {
  dur?: number;
  curve?: boolean;
}

export interface CameraAPI {
  push: (scale: number, x: number, y: number, dur?: number, ease?: string) => GsapTimeline;
  release: (dur?: number) => GsapTimeline;
}

export interface HudAPI {
  setProfile: (label: string) => GsapTween;
  pulse: () => GsapTimeline;
  addTag: (text: string) => GsapTween;
}

export interface PersistAPI {
  (el: HTMLElement): HTMLElement;
}

export interface CounterAPI {
  (el: HTMLElement, from: number, to: number, dur?: number): GsapTimeline;
}

export interface ThreadAPI {
  connect: (fromEl: HTMLElement, toEl: HTMLElement, opts?: ThreadConnectOpts) => ThreadResult;
}

export interface CursorAPI {
  moveTo: (target: HTMLElement, opts?: CursorOpts) => GsapTimeline;
  click: () => GsapTimeline;
  hide: () => GsapTween;
}

export interface SceneContext {
  eases: {
    out: string;
    expo: string;
    inout: string;
    settle: string;
  };
  stage: { w: number; h: number };
  config: {
    scenes: Array<{
      id: string;
      index: number;
      railLabel: string;
      caption: string;
      emphasis: string[];
      duration: number;
      start: number;
    }>;
  };
  fixtures: Record<string, unknown>;
  root: HTMLElement;
  layers: {
    bg: HTMLElement;
    scenes: HTMLElement;
    persist: HTMLElement;
    threads: SVGSVGElement;
    hud: HTMLElement;
    cursor: HTMLElement;
  };
  tl: unknown;
  cameraGroup: HTMLElement;
  camera: CameraAPI;
  hud: HudAPI;
  persist: PersistAPI;
  counter: CounterAPI;
  thread: ThreadAPI;
  cursor: CursorAPI;
}

export type SceneBuilder = (ctx: SceneContext, sceneIndex: number) => GsapTimeline;
