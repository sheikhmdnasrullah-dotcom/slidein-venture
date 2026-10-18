import { gsap } from 'gsap';
import { SceneContext, SceneBuilder, GsapTimeline } from '../types';
import { scenes } from '../data/scenes.config';

export function createStubScene(sceneIndex: number): SceneBuilder {
  return (ctx: SceneContext): any => {
    const scene = scenes[sceneIndex];
    const tl = gsap.timeline({ paused: true, defaults: { overwrite: true } }) as unknown as GsapTimeline;

    // Create scene container
    const sceneContainer = document.createElement('div');
    sceneContainer.className = 'vp-scene';
    sceneContainer.setAttribute('data-scene', String(sceneIndex + 1));
    ctx.layers.scenes.appendChild(sceneContainer);

    // Stage background
    const bg = document.createElement('div');
    bg.className = 'vp-stub-bg';
    bg.style.cssText = `
      position: absolute;
      inset: 0;
      background: var(--vp-stage);
      border-radius: var(--vp-radius-lg);
    `;
    sceneContainer.appendChild(bg);

    // Grid overlay
    const grid = document.createElement('div');
    grid.className = 'vp-grid-overlay';
    bg.appendChild(grid);

    // Content area
    const content = document.createElement('div');
    content.className = 'vp-stub-content';
    content.style.cssText = `
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 64px;
    `;
    sceneContainer.appendChild(content);

    // Scene number
    const number = document.createElement('div');
    number.className = 'vp-stub-number';
    number.textContent = String(sceneIndex + 1).padStart(2, '0');
    number.style.cssText = `
      font-family: 'JetBrains Mono', monospace;
      font-size: 80px;
      font-weight: 600;
      color: var(--vp-ink-950);
      font-variant-numeric: tabular-nums;
      opacity: 0.15;
      line-height: 1;
    `;
    content.appendChild(number);

    // Rail label
    const label = document.createElement('div');
    label.className = 'vp-stub-label';
    label.textContent = scene.railLabel;
    label.style.cssText = `
      font-family: 'Mona Sans', sans-serif;
      font-size: 32px;
      font-weight: 600;
      color: var(--vp-ink-700);
      margin: 16px 0;
    `;
    content.appendChild(label);

    // Caption
    const cap = document.createElement('div');
    cap.className = 'vp-stub-caption';
    cap.textContent = scene.caption;
    cap.style.cssText = `
      font-family: 'Mona Sans', sans-serif;
      font-size: 20px;
      font-weight: 500;
      color: var(--vp-ink-500);
      max-width: 560px;
      line-height: 1.5;
    `;
    content.appendChild(cap);

    // Fixtures hint (for scene context)
    const hint = document.createElement('div');
    hint.className = 'vp-stub-hint';
    const hintText = getHintForScene(sceneIndex);
    hint.textContent = hintText;
    hint.style.cssText = `
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      color: var(--vp-ink-500);
      margin-top: 24px;
      padding: 8px 16px;
      border-radius: var(--vp-radius-sm);
      background: color-mix(in srgb, var(--vp-ink-100) 60%, transparent);
    `;
    content.appendChild(hint);

    // Entrance
    tl.set(content, { opacity: 0, y: 16 });
    tl.to(
      content,
      { opacity: 1, y: 0, duration: 0.6, ease: ctx.eases.out },
      0,
    );

    // Highlight number briefly
    tl.to(
      number,
      { opacity: 0.35, duration: 0.4, ease: ctx.eases.settle },
      0.3,
    );
    tl.to(
      number,
      { opacity: 0.15, duration: 0.4, ease: ctx.eases.settle },
      0.8,
    );

    // Subtle pulse on the label as the emphasis word is spoken
    const emphasisTime = scene.start + calcEmphasisTime(sceneIndex, ctx);
    tl.to(
      label,
      { color: 'var(--vp-thread-deep)', duration: 0.4, ease: ctx.eases.settle },
      emphasisTime,
    );
    tl.to(
      label,
      { color: 'var(--vp-ink-700)', duration: 0.4, ease: ctx.eases.inout },
      emphasisTime + 1.2,
    );

    // Exit
    tl.to(
      content,
      { opacity: 0, y: -16, duration: 0.35, ease: ctx.eases.settle },
      scene.duration - 0.9,
    );

    return tl;
  };
}

function calcEmphasisTime(sceneIndex: number, ctx: SceneContext): number {
  const scene = ctx.config.scenes[sceneIndex] as { caption: string; emphasis: string[]; duration: number };
  const emphasisWord = scene?.emphasis?.[0];
  if (!emphasisWord) return 2.5;
  const words = scene.caption.split(/\s+/);
  const idx = words.findIndex((w: string) => w.includes(emphasisWord.split(';')[0].trim()));
  if (idx < 0) return 2.5;
  const progress = (idx + 1) / words.length;
  const windowLen = scene.duration - 0.9 - 0.6;
  return 0.6 + progress * windowLen;
}

function getHintForScene(sceneIndex: number): string {
  const hints = [
    'fixtures: business, offers, icp',
    'fixtures: rawRecords, sources',
    'fixtures: findings, rawRecords',
    'fixtures: criteria, match, rawRecords',
    'fixtures: email, match',
    'fixtures: checks, held',
    'fixtures: replies, intents',
    'fixtures: ledger, overview',
  ];
  return hints[sceneIndex] || 'stub';
}

export default createStubScene;
