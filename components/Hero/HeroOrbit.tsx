/**
 * HERO ORBIT — a decorative geometric field behind the headline: three
 * concentric hairline rings, seven nodes on the outer ring (one per loop
 * stage, unlabelled) and a few satellites on the inner rings. It turns slowly
 * on its own and a touch faster with page scroll (`--scroll-y`, published by
 * SmoothScroll). Pure SVG + CSS transforms; no text, no numbers.
 * Purely ornamental: aria-hidden, pointer-events none.
 */

const C = 320; // viewBox centre
const RINGS = [112, 196, 280] as const;
const STAGES = 7;

function onRing(r: number, i: number, n: number, phase = 0) {
  const a = ((i / n) * 360 + phase - 90) * (Math.PI / 180);
  return { x: C + r * Math.cos(a), y: C + r * Math.sin(a) };
}

export function HeroOrbit() {
  return (
    <div className="hm-orbit" aria-hidden="true" data-testid="hero-orbit">
      <div className="hm-orbit__turn">
        <svg viewBox="0 0 640 640" width="100%" height="100%" focusable="false">
          {RINGS.map((r) => (
            <circle key={r} cx={C} cy={C} r={r} className="hm-orbit__ring" />
          ))}
          {/* axis ticks: the plate's seven rows, drawn as spokes */}
          {Array.from({ length: STAGES }, (_, i) => {
            const a = onRing(RINGS[0], i, STAGES);
            const b = onRing(RINGS[2], i, STAGES);
            return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} className="hm-orbit__spoke" />;
          })}
          {Array.from({ length: STAGES }, (_, i) => {
            const p = onRing(RINGS[2], i, STAGES);
            return (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r={i === 0 ? 6 : 4}
                className={i === 0 ? 'hm-orbit__node hm-orbit__node--hot' : 'hm-orbit__node'}
              />
            );
          })}
          {Array.from({ length: 3 }, (_, i) => {
            const p = onRing(RINGS[1], i, 3, 40);
            return <circle key={'m' + i} cx={p.x} cy={p.y} r={3} className="hm-orbit__node" />;
          })}
          {Array.from({ length: 2 }, (_, i) => {
            const p = onRing(RINGS[0], i, 2, 110);
            return <circle key={'s' + i} cx={p.x} cy={p.y} r={2.5} className="hm-orbit__node" />;
          })}
        </svg>
      </div>
    </div>
  );
}
