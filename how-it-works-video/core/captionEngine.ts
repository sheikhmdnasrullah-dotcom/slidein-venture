import { gsap } from 'gsap';
import { scenes } from '../data/scenes.config';
import type { SceneContext } from '../types';

export interface CaptionWord {
  word: string;
  start: number;
  end: number;
  emphasized: boolean;
}

export interface CaptionScene {
  sceneId: string;
  words: CaptionWord[];
}

export interface CaptionsData {
  scenes: CaptionScene[];
}

export interface CaptionEngineAPI {
  update: (time: number) => void;
  goToScene: (sceneIndex: number) => void;
  destroy: () => void;
}

interface RenderedWord {
  el: HTMLElement;
  data: CaptionWord;
  sceneIndex: number;
  lineIndex: number;
  emphasisEl?: HTMLElement;
}

export function loadCaptions(): CaptionsData {
  // In a real build, this would be imported from captions.json
  // For now, use a dynamic import
  return null as unknown as CaptionsData;
}

export function initCaptions(
  dock: HTMLElement,
  data: CaptionsData,
  ctx: SceneContext,
  master: gsap.core.Timeline,
): CaptionEngineAPI {
  const words: RenderedWord[] = [];
  const sceneBoundaries: { start: number; end: number; sceneIndex: number }[] = [];

  // Calculate scene boundaries
  scenes.forEach((scene, i) => {
    const capScene = data.scenes[i];
    if (!capScene) return;
    const lastWord = capScene.words[capScene.words.length - 1];
    const firstWord = capScene.words[0];
    sceneBoundaries.push({
      start: scene.start + (firstWord?.start || 0),
      end: scene.start + (lastWord?.end || scene.duration),
      sceneIndex: i,
    });
  });

  // Render all words invisibly first
  // Split words into lines of max ~12 words per line (approximate 2 lines)
  data.scenes.forEach((scene, sceneIndex) => {
    const sceneWords = scene.words;
    const totalWords = sceneWords.length;
    const halfPoint = Math.ceil(totalWords / 2);

    const sceneDiv = document.createElement('div');
    sceneDiv.className = 'vp-caption-scene';
    sceneDiv.style.cssText = `
      position: absolute;
      inset: 0;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.35s, visibility 0.35s;
    `;

    const line1 = document.createElement('div');
    line1.className = 'vp-caption-line';
    const line2 = document.createElement('div');
    line2.className = 'vp-caption-line vp-caption-line-2';

    sceneWords.slice(0, halfPoint).forEach((w, idx) => {
      const span = createWordSpan(w);
      line1.appendChild(span);
      words.push({ el: span, data: w, sceneIndex, lineIndex: 0 });
    });

    sceneWords.slice(halfPoint).forEach((w, idx) => {
      const span = createWordSpan(w);
      line2.appendChild(span);
      words.push({ el: span, data: w, sceneIndex, lineIndex: 1 });
    });

    sceneDiv.appendChild(line1);
    sceneDiv.appendChild(line2);
    dock.appendChild(sceneDiv);

    // Add scene transition tweens to master timeline
    const sceneStart = scenes[sceneIndex].start;
    const transitionIn = sceneStart;
    const transitionOut = sceneStart + scenes[sceneIndex].duration - 0.9;

    master.set(sceneDiv, { opacity: 1, visibility: 'visible' }, transitionIn);
    master.to(sceneDiv, { opacity: 0, visibility: 'hidden', duration: 0.35, ease: ctx.eases.inout }, transitionOut);

    // Dim line 1 when line 2 starts
    const line2Words = words.filter((w) => w.sceneIndex === sceneIndex && w.lineIndex === 1);
    if (line2Words.length > 0) {
      const line2StartTime = line2Words[0].data.start + sceneStart;
      master.to(line1, { opacity: 0.6, duration: 0.35, ease: ctx.eases.inout }, line2StartTime);
    }
  });

  // Add word state tweens to master timeline
  words.forEach((rw) => {
    const absStart = scenes[rw.sceneIndex].start + rw.data.start;
    const absEnd = scenes[rw.sceneIndex].start + rw.data.end;

    // Active state: underline draws
    master.set(rw.el, { className: '+=vp-word-active' }, absStart);
    const underline = rw.el.querySelector('.vp-word-underline') as HTMLElement;
    if (underline) {
      master.set(underline, { scaleX: 1 }, absStart);
    }
    // Wait, we need to draw the underline FROM 0 to 1
    master.fromTo(underline, { scaleX: 0 }, { scaleX: 1, duration: absEnd - absStart, ease: 'none' }, absStart);

    // After word is spoken: remove active, keep spoken
    master.set(rw.el, { className: '-=vp-word-active' }, absEnd);
  });

  // Emphasis highlighter
  words.forEach((rw) => {
    if (rw.data.emphasized) {
      const absEnd = scenes[rw.sceneIndex].start + rw.data.end;
      const highlightEl = createEmphasisHighlight();
      rw.el.appendChild(highlightEl);
      rw.emphasisEl = highlightEl;

      master.set(highlightEl, { opacity: 0, scaleX: 0 }, absEnd - (rw.data.end - rw.data.start));
      master.to(highlightEl, {
        opacity: 1,
        scaleX: 1,
        duration: 0.35,
        ease: ctx.eases.out,
        transformOrigin: 'left center',
      }, absEnd);
    }
  });

  // Manual update function (for reduced motion and direct calls)
  let lastSceneIndex = 0;

  function update(time: number) {
    // Find current scene based on time
    let sceneIdx = 0;
    for (let i = 0; i < scenes.length; i++) {
      if (time >= scenes[i].start && time < scenes[i].start + scenes[i].duration) {
        sceneIdx = i;
        break;
      }
      if (time >= scenes[i].start + scenes[i].duration) {
        sceneIdx = i;
      }
    }

    if (sceneIdx !== lastSceneIndex) {
      // Scene transition: mask slide
      const prevScene = dock.children[lastSceneIndex] as HTMLElement;
      const nextScene = dock.children[sceneIdx] as HTMLElement;

      if (prevScene) {
        master.set(prevScene, { opacity: 0, visibility: 'hidden' }, time);
      }
      if (nextScene) {
        master.set(nextScene, { opacity: 1, visibility: 'visible' }, time);
      }
      lastSceneIndex = sceneIdx;
    }
  }

  return {
    update,
    goToScene: (sceneIndex: number) => {
      const target = dock.children[sceneIndex] as HTMLElement;
      if (target) {
        Array.from(dock.children).forEach((child) => {
          (child as HTMLElement).style.opacity = '0';
          (child as HTMLElement).style.visibility = 'hidden';
        });
        target.style.opacity = '1';
        target.style.visibility = 'visible';
      }
      lastSceneIndex = sceneIndex;
    },
    destroy: () => {
      dock.innerHTML = '';
    },
  };
}

function createWordSpan(w: CaptionWord): HTMLElement {
  const span = document.createElement('span');
  span.className = 'vp-word vp-word-upcoming';
  span.setAttribute('aria-hidden', 'true');
  span.textContent = w.word;

  // Underline (draws left to right)
  const underline = document.createElement('span');
  underline.className = 'vp-word-underline';
  underline.style.cssText = `
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 2px;
    background: var(--vp-thread);
    transform: scaleX(0);
    transform-origin: left center;
  `;
  span.appendChild(underline);

  return span;
}

function createEmphasisHighlight(): HTMLElement {
  const el = document.createElement('span');
  el.className = 'vp-emphasis-highlight';
  el.style.cssText = `
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 45%;
    background: var(--vp-thread-tint);
    border-radius: 2px;
    opacity: 0;
    transform: scaleX(0);
    transform-origin: left center;
  `;
  return el;
}

