'use client';

/**
 * HERO CONVERGENCE — scattered intelligence → one framework → organized work.
 * ---------------------------------------------------------------------------
 * Left: seven raw fragments (profile, prospects, evidence, icps, offers,
 * policy, replies), each a different kind of business material, loosely piled.
 * Centre: one orange plate whose seven rows are the loop stages. Right: five
 * organised outputs, each leaving from the stage row that produces it.
 *
 * ONE GSAP timeline, played once, then it rests (no idle motion):
 *   0.0  fragments appear, scattered              (A · scattered)
 *   0.9  hairline relationships between them draw
 *   1.8  plate unfolds, fragments travel to their rows on rubber-band
 *        threads that straighten as they dock    (B · one framework)
 *   3.2  output threads leave the plate, outputs land (C · organised)
 *   ~4.6 settled. Hover traces any fragment/output through its stage row.
 *
 * Everything is drawn on a fixed canvas and scaled as a unit (transform only,
 * the outer box reserves its height with aspect-ratio, so no layout shift).
 * Reduced motion renders the resting state with no timeline at all.
 */

import { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useSettledStill } from '@/lib/useSettledStill';
import {
  FRAMES,
  OUT,
  PLATE_WORDS,
  RAW,
  RELATIONS,
  ROW,
  ROWS,
  outFinal,
  rawFinal,
  rowY,
  threadPath,
  type Mode,
} from './layout';
import { OutFace, RawFace } from './Fragments';

const WIDE_MQ = '(min-width: 960px)';

export function HeroConvergence() {
  const still = useSettledStill();
  const outerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Mode | null>(null);

  /* Mode + scale. The canvas is a fixed design size; scale is derived from
     the reserved outer box, so resize never reflows anything. */
  useLayoutEffect(() => {
    const outer = outerRef.current;
    if (!outer) return;
    const mq = window.matchMedia(WIDE_MQ);
    const apply = () => {
      const m: Mode = mq.matches ? 'wide' : 'narrow';
      outer.style.setProperty('--cv-s', String(outer.clientWidth / FRAMES[m].W));
      setMode(m);
    };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(outer);
    mq.addEventListener('change', apply);
    return () => {
      ro.disconnect();
      mq.removeEventListener('change', apply);
    };
  }, []);

  /* The sequence. Layout effect: initial (hidden) states are written before
     the first paint, so there is no flash of the resting state. */
  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !mode) return;
    if (still) {
      canvas.dataset.state = 'done';
      return;
    }
    canvas.dataset.state = 'play';
    const f = FRAMES[mode];
    const q = gsap.utils.selector(canvas);
    let tl: gsap.core.Timeline | undefined;
    const raws: { el: HTMLElement }[] = [];

    const ctx = gsap.context(() => {
      const items = RAW.map((spec) => {
        const fin = rawFinal(spec, mode);
        const sc = spec.scatter[mode];
        const el = q(`[data-raw="${spec.id}"]`)[0] as HTMLElement;
        const path = q(`[data-lthread="${spec.id}"]`)[0] as unknown as SVGPathElement;
        const st = { ox: sc.x - fin.x, oy: sc.y - fin.y, r: sc.r, ay: 14, p: 0 };
        const apply = () => {
          el.style.transform = `translate3d(${st.ox}px,${st.oy + st.ay}px,0) rotate(${st.r}deg)`;
          const sx = Math.min(fin.x + st.ox + fin.w, f.plateX - 8);
          const sy = fin.y + st.oy + fin.h / 2;
          path.setAttribute('d', threadPath(sx, sy, f.plateX, rowY(spec.row)));
          path.style.opacity = String(Math.min(1, Math.max(0, (st.p - 0.3) / 0.5)));
        };
        apply();
        raws.push({ el });
        return { spec, el, st, apply };
      });

      const rels = q('[data-rel]');
      const ghosts = q('[data-ghost]');
      const plate = q('[data-plate]');
      const pwords = q('[data-pword]');
      const rules = q('[data-rule]');
      const marks = q('[data-marks]');
      const docksL = q('[data-dock="l"]');
      const docksR = q('[data-dock="r"]');
      const locks = q('[data-lock]');
      const rthreads = q('[data-rthread]');
      const outs = q('[data-out]');
      const slots = q('[data-slot]');

      gsap.set(q('[data-raw]'), { opacity: 0 });
      gsap.set(rels, { strokeDashoffset: 1, opacity: 1 });
      gsap.set(ghosts, { opacity: 0 });
      gsap.set(plate, { clipPath: 'inset(50% 0% 50% 0%)' });
      gsap.set([pwords, rules, marks], { opacity: 0 });
      gsap.set([docksL, docksR], { scale: 0 });
      gsap.set(locks, { '--lk': 0 });
      gsap.set(rthreads, { strokeDashoffset: 1 });
      gsap.set(outs, { opacity: 0, x: -14 });
      gsap.set(slots, { opacity: 0 });

      tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        onComplete: () => {
          raws.forEach((r) => (r.el.style.transform = ''));
          canvas.dataset.state = 'done';
        },
      });

      /* A — scattered */
      items.forEach((it, i) => {
        const at = 0.05 + i * 0.07;
        tl!.to(it.el, { opacity: 1, duration: 0.5, ease: 'power2.out' }, at);
        tl!.to(it.st, { ay: 0, duration: 0.8, onUpdate: it.apply }, at);
      });
      tl.to(ghosts, { opacity: 1, duration: 0.7, ease: 'power2.out' }, 0.35);
      tl.to(slots, { opacity: 1, duration: 0.7, ease: 'power2.out' }, 0.6);
      tl.to(rels, { strokeDashoffset: 0, duration: 0.8, stagger: 0.09, ease: 'power2.inOut' }, 0.9);

      /* B — one framework */
      const C = 1.8;
      tl.to(rels, { opacity: 0, duration: 0.45, ease: 'power1.in' }, C - 0.1);
      tl.to(ghosts, { opacity: 0, duration: 0.4, ease: 'power1.in' }, C);
      tl.to(plate, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: 'power3.inOut' }, C - 0.3);
      tl.to(rules, { opacity: 1, duration: 0.8, stagger: 0.05, ease: 'power2.out' }, C);
      tl.to(pwords, { opacity: 1, duration: 0.5, stagger: 0.06 }, C + 0.3);
      tl.to(marks, { opacity: 1, duration: 0.5 }, C + 0.5);
      items.forEach((it, i) => {
        const at = C + i * 0.055;
        tl!.to(
          it.st,
          { ox: 0, oy: 0, r: 0, p: 1, duration: 1, ease: 'power3.inOut', onUpdate: it.apply },
          at,
        );
        tl!.to(docksL[it.spec.row], { scale: 1, duration: 0.35 }, at + 0.7);
        tl!.to(locks[it.spec.row], { '--lk': 1, duration: 0.3, ease: 'power2.out' }, at + 0.85);
      });

      /* C — organised outputs */
      const R = C + 0.055 * (RAW.length - 1) + 1.05;
      tl.to(rthreads, { strokeDashoffset: 0, duration: 0.5, stagger: 0.1, ease: 'power2.inOut' }, R);
      tl.to(docksR, { scale: 1, duration: 0.35, stagger: 0.1 }, R);
      tl.to(slots, { opacity: 0, duration: 0.4, ease: 'power1.in' }, R + 0.3);
      tl.to(outs, { opacity: 1, x: 0, duration: 0.6, stagger: 0.1 }, R + 0.35);
    }, canvas);

    return () => {
      tl?.kill();
      raws.forEach((r) => (r.el.style.transform = ''));
      ctx.revert();
    };
  }, [mode, still]);

  /* Hover traces a fragment (or output) through its stage row — attribute
     writes only, no React state. */
  const trace = (row: number | null) => {
    const canvas = canvasRef.current;
    if (!canvas || canvas.dataset.state !== 'done') return;
    if (row === null) delete canvas.dataset.hot;
    else canvas.dataset.hot = String(row);
    canvas.querySelectorAll<HTMLElement | SVGElement>('[data-row]').forEach((el) => {
      const r = Number(el.getAttribute('data-row'));
      if (row === null || r === row) el.removeAttribute('data-dim');
      else el.setAttribute('data-dim', '');
    });
  };

  const f = mode ? FRAMES[mode] : null;
  const plateEnd = f ? f.plateX + f.plateW : 0;

  return (
    <div ref={outerRef} className="cv-outer" data-testid="hero-convergence" aria-hidden="true">
      {mode && f && (
        <div
          key={mode}
          ref={canvasRef}
          className="cv"
          data-mode={mode}
          data-state="play"
          style={{ width: f.W, height: f.H }}
          onPointerLeave={() => trace(null)}
        >
          {/* faint ruled lines — the stage rows continue across the page */}
          <svg className="cv-svg" width={f.W} height={f.H}>
            {Array.from({ length: ROWS + 1 }, (_, i) => (
              <line key={i} data-rule x1={0} x2={f.W} y1={i * ROW} y2={i * ROW} className="cv-rule" />
            ))}
          </svg>

          {/* relationships between the scattered fragments */}
          <svg className="cv-svg" width={f.W} height={f.H}>
            {RELATIONS.map(([a, b]) => {
              const A = RAW.find((r) => r.id === a)!;
              const B = RAW.find((r) => r.id === b)!;
              const pa = A.scatter[mode];
              const pb = B.scatter[mode];
              return (
                <path
                  key={a + b}
                  data-rel
                  pathLength={1}
                  className="cv-rel"
                  d={`M${pa.x + A.w[mode] / 2} ${pa.y + A.h / 2}L${pb.x + B.w[mode] / 2} ${pb.y + B.h / 2}`}
                />
              );
            })}
          </svg>

          {/* empty output slots, then the ghost of the framework */}
          {OUT.map((o) => {
            const r = outFinal(o, mode);
            return (
              <div key={o.id} data-slot className="cv-slot" style={{ left: r.x, top: r.y, width: r.w, height: r.h }} />
            );
          })}
          <div data-ghost className="cv-ghost" style={{ left: f.plateX, width: f.plateW, height: f.H }} />

          {/* threads */}
          <svg className="cv-svg" width={f.W} height={f.H}>
            {RAW.map((s) => {
              const r = rawFinal(s, mode);
              return (
                <path
                  key={s.id}
                  data-lthread={s.id}
                  data-row={s.row}
                  className="cv-thread"
                  d={threadPath(r.x + r.w, rowY(s.row), f.plateX, rowY(s.row))}
                />
              );
            })}
            {OUT.map((o) => (
              <path
                key={o.id}
                data-rthread
                data-row={o.row}
                pathLength={1}
                className="cv-thread cv-thread--out"
                d={`M${plateEnd} ${rowY(o.row)}H${f.outLeft}`}
              />
            ))}
          </svg>

          {/* the framework */}
          <div data-plate className="cv-plate" style={{ left: f.plateX, width: f.plateW, height: f.H }}>
            {PLATE_WORDS.map((w, i) => (
              <div key={w} data-row={i} className="cv-prow" style={{ top: i * ROW, height: ROW }}>
                <span data-pword className="cv-pword">
                  {w}
                </span>
                <i data-lock className="cv-lock" />
              </div>
            ))}
          </div>
          <svg
            data-marks
            className="cv-svg cv-marks"
            width={f.W}
            height={f.H}
            style={{ overflow: 'visible' }}
          >
            {[
              [f.plateX, 0, -1, -1],
              [plateEnd, 0, 1, -1],
              [f.plateX, f.H, -1, 1],
              [plateEnd, f.H, 1, 1],
            ].map(([x, y, sx, sy], i) => (
              <path
                key={i}
                d={`M${x + sx * 7} ${y + sy * 7}h${sx * 12}M${x + sx * 7} ${y + sy * 7}v${sy * 12}`}
                className="cv-mark"
              />
            ))}
          </svg>

          {/* docks */}
          {RAW.map((s) => (
            <i key={'l' + s.id} data-dock="l" data-row={s.row} className="cv-dock" style={{ left: f.plateX, top: rowY(s.row) }} />
          ))}
          {OUT.map((o) => (
            <i key={'r' + o.id} data-dock="r" data-row={o.row} className="cv-dock" style={{ left: plateEnd, top: rowY(o.row) }} />
          ))}

          {/* raw fragments */}
          {RAW.map((s) => {
            const r = rawFinal(s, mode);
            return (
              <div
                key={s.id}
                data-raw={s.id}
                data-row={s.row}
                className={`cv-card cv-raw cv-raw--${s.kind}`}
                style={{ left: r.x, top: r.y, width: r.w, height: r.h }}
                onPointerEnter={() => trace(s.row)}
              >
                <RawFace kind={s.kind} label={s.label} />
              </div>
            );
          })}

          {/* organised outputs */}
          {OUT.map((o) => {
            const r = outFinal(o, mode);
            return (
              <div
                key={o.id}
                data-out
                data-row={o.row}
                className={`cv-card cv-out cv-out--${o.kind}`}
                style={{ left: r.x, top: r.y, width: r.w, height: r.h }}
                onPointerEnter={() => trace(o.row)}
              >
                <OutFace kind={o.kind} label={o.label} chip={o.chip} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
