// Shared builders for the eight video scenes.
// Every scene uses these helpers so the system (type, color, motion) stays identical.
import { gsap } from 'gsap';
import type { SceneContext, GsapTimeline, ThreadResult } from '../types';
import { scenes } from '../data/scenes.config';
import captionsData from '../data/captions.json';
import { icon } from './icons';

export { icon };

// --- DOM helpers ---

export function h(tag: string, className = '', text = ''): HTMLElement {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text) el.textContent = text;
  return el;
}

export function htmlEl(tag: string, className: string, html: string): HTMLElement {
  const el = document.createElement(tag);
  el.className = className;
  el.innerHTML = html;
  return el;
}

// A white card positioned on the artboard. variant: e1 | e2 | e3
export function card(className: string, x: number, y: number, w: number, ht: number, variant: 'e1' | 'e2' | 'e3' = 'e2', radius: 'md' | 'lg' = 'lg'): HTMLElement {
  const el = h('div', `vps-card vps-card--${variant} vps-card--r${radius} ${className}`.trim());
  el.style.cssText = `left:${x}px;top:${y}px;width:${w}px;height:${ht}px;`;
  return el;
}

export function monoLabel(text: string): HTMLElement {
  return h('div', 'vp-mono-label', text);
}

export function avatar(initials: string, size = 36): HTMLElement {
  const el = h('div', 'vps-avatar', initials);
  el.style.width = `${size}px`;
  el.style.height = `${size}px`;
  el.style.fontSize = `${Math.round(size * 0.38)}px`;
  return el;
}

// Chip variants: mono (source chips, lowercase mono) | tag (uppercase status) |
// pass (sent) | tint (thread tint) | hatch (held, never red) | plain
export function chip(text: string, variant: 'mono' | 'tag' | 'pass' | 'tint' | 'hatch' | 'plain' = 'mono', iconName?: string): HTMLElement {
  const el = h('span', `vps-chip vps-chip--${variant}`, text);
  if (iconName) el.prepend(htmlEl('span', 'vps-chip-icon', icon(iconName, 12)));
  return el;
}

export function tickSvg(size = 16, cls = ''): SVGSVGElement {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('width', String(size));
  svg.setAttribute('height', String(size));
  svg.setAttribute('class', `vps-tick ${cls}`.trim());
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', 'M20 6 9 17l-5-5');
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke', 'currentColor');
  path.setAttribute('stroke-width', '2.5');
  path.setAttribute('stroke-linecap', 'round');
  path.setAttribute('stroke-linejoin', 'round');
  svg.appendChild(path);
  return svg;
}

export function caret(): HTMLElement {
  return h('span', 'vps-caret');
}

// --- Caption timing (word timings come from captions.json) ---

interface CaptionWord { word: string; start: number; end: number; emphasized: boolean }

export function sceneWords(sceneIndex: number): CaptionWord[] {
  const sc = (captionsData as { scenes: { sceneId: string; words: CaptionWord[] }[] }).scenes[sceneIndex];
  return sc ? sc.words : [];
}

// Start time of the first emphasized word (relative to scene start)
export function emphasisAt(sceneIndex: number): number {
  const w = sceneWords(sceneIndex).find((wd) => wd.emphasized);
  return w ? w.start : sceneWords(sceneIndex).length ? sceneWords(sceneIndex)[0].start : 2.5;
}

// Timing of a word or phrase (returns range of first match)
export function phraseAt(sceneIndex: number, matcher: string): { start: number; end: number } {
  const words = sceneWords(sceneIndex);
  const idx = words.findIndex((wd) => wd.word.toLowerCase().includes(matcher.toLowerCase()));
  if (idx < 0) return { start: 2.5, end: 3.0 };
  return { start: words[idx].start, end: words[idx].end };
}

// --- Scene scaffolding ---

export interface SceneSetup {
  root: HTMLElement;
  scene: (typeof scenes)[number];
  tl: GsapTimeline;
  reduced: boolean;
}

export function setupScene(ctx: SceneContext, sceneIndex: number): SceneSetup {
  const root = ctx.layers.scenes.querySelector<HTMLElement>(`[data-vp-scene="${sceneIndex + 1}"]`);
  if (!root) throw new Error(`scene container ${sceneIndex + 1} missing`);
  root.innerHTML = '';
  const tl = gsap.timeline({ paused: true, defaults: { overwrite: 'auto' } }) as unknown as GsapTimeline;
  return { root, scene: scenes[sceneIndex], tl, reduced: ctx.reducedMotion };
}

// Standard entrance: 8 to 16px rise + opacity. Only transform/opacity.
export function enter(tl: GsapTimeline, target: unknown, at: number, opts: { y?: number; dur?: number; ease?: string; stagger?: number } = {}): void {
  tl.fromTo(target,
    { autoAlpha: 0, y: opts.y ?? 12 },
    { autoAlpha: 1, y: 0, duration: opts.dur ?? 0.6, ease: opts.ease ?? 'power3.out', stagger: opts.stagger ?? 0 },
    at);
}

export function exitUp(tl: GsapTimeline, target: unknown, at: number, dur = 0.35): void {
  tl.to(target, { autoAlpha: 0, y: -12, duration: dur, ease: 'power2.inOut', stagger: 0.04 }, at);
}

// --- Thread choreography ---

export function drawOn(tl: GsapTimeline, t: ThreadResult, at: number, dur = 0.7, ease?: string): void {
  tl.add(t.draw(dur, ease) as never, at);
}

export function travelOn(tl: GsapTimeline, t: ThreadResult, at: number, dur = 0.8): void {
  tl.add(t.travel(dur) as never, at);
}

export function eraseOn(tl: GsapTimeline, t: ThreadResult, at: number, dur = 0.4): void {
  tl.add(t.erase(dur) as never, at);
}

// Reduced motion: thread appears fully drawn, no travel
export function settledThread(tl: GsapTimeline, t: ThreadResult, at: number): void {
  tl.set(t.el, { drawSVG: '100% 0%' }, at);
}

// Draw a check path with DrawSVG (returns nothing; adds to tl)
export function drawTick(tl: GsapTimeline, path: SVGPathElement, at: number, dur = 0.35): void {
  tl.fromTo(path, { drawSVG: '0% 0%' }, { drawSVG: '100% 0%', duration: dur, ease: 'power3.out' }, at);
}

// --- Persisted cross-scene elements (match-cut handoffs) ---

export function keep(el: HTMLElement, key: string): HTMLElement {
  el.setAttribute('data-vp-keep', key);
  return el;
}

export function findKept(ctx: SceneContext, key: string): HTMLElement | null {
  return ctx.layers.persist.querySelector<HTMLElement>(`[data-vp-keep="${key}"]`);
}

export function findAllKept(ctx: SceneContext, key: string): HTMLElement[] {
  return Array.from(ctx.layers.persist.querySelectorAll<HTMLElement>(`[data-vp-keep="${key}"]`));
}
