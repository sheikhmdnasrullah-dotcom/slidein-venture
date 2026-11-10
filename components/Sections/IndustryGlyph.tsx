/**
 * One small line mark per industry, drawn on a 48 x 48 grid with a 1.5 stroke.
 * Ink paths carry the shape; the accent path is the one thing that matters
 * for that business (the roof, the cross, the flag). Every path has
 * pathLength 1 so the same CSS can draw any of them in.
 */
import type { CSSProperties } from 'react';

const circ = (cx: number, cy: number, r: number) =>
  `M${cx - r} ${cy} a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0`;

const hex = (cx: number, cy: number, r: number) =>
  Array.from({ length: 6 }, (_, k) => {
    const a = ((-90 + 60 * k) * Math.PI) / 180;
    return `${k ? 'L' : 'M'}${(cx + r * Math.cos(a)).toFixed(2)} ${(cy + r * Math.sin(a)).toFixed(2)}`;
  }).join(' ') + ' Z';

type Mark = { ink: string[]; accent: string[] };

const MARKS: Record<string, Mark> = {
  'us-home-lenders': {
    ink: ['M12 25 V39 H36 V25', 'M21 39 V30 H27 V39'],
    accent: ['M7 28 L24 12 L41 28'],
  },
  'mortgage-brokers': {
    ink: ['M6 31 L14 24 L22 31 V41 H6 Z', 'M26 31 L34 24 L42 31 V41 H26 Z'],
    accent: ['M14 19 C17 11 31 11 34 19'],
  },
  'mid-sized-companies': {
    ink: ['M6 41 H42', 'M9 41 V29 H17 V41', 'M20 41 V21 H28 V41'],
    accent: ['M31 41 V12 H39 V41'],
  },
  'insurance-agencies': {
    ink: ['M24 7 L38 12 V24 C38 33 31 38 24 41 C17 38 10 33 10 24 V12 Z'],
    accent: ['M18 24 L22.5 28.5 L31 20'],
  },
  'real-estate-firms': {
    ink: ['M6 41 H42', 'M10 41 V11 H26 V41', 'M26 41 V21 H38 V41', 'M15 28 H21 V34 H15 Z', 'M30 27 H34 V32 H30 Z'],
    accent: ['M15 16 H21 V22 H15 Z'],
  },
  'e-commerce-brands': {
    ink: ['M11 18 H37 L34.5 41 H13.5 Z'],
    accent: ['M18.5 18 V14.5 C18.5 8 29.5 8 29.5 14.5 V18'],
  },
  'tech-startups': {
    ink: ['M24 6 L34 31 H14 Z', circ(24, 21, 3)],
    accent: ['M19.5 35 L24 43 L28.5 35'],
  },
  'corporate-agencies': {
    ink: ['M8 17 H28 V37 H8 Z'],
    accent: ['M20 11 H40 V31 H20 Z'],
  },
  'commercial-banks': {
    ink: ['M13 22 V36', 'M20 22 V36', 'M28 22 V36', 'M35 22 V36', 'M8 40 H40'],
    accent: ['M8 18 L24 9 L40 18 Z'],
  },
  'national-banks': {
    ink: ['M10 22 C10 13 38 13 38 22', 'M8 22 H40', 'M14 26 V36', 'M24 26 V36', 'M34 26 V36', 'M8 40 H40'],
    accent: ['M24 13.5 V4 L31 6.5 L24 9'],
  },
  'mfs-providers': {
    ink: ['M11 7 H27 V41 H11 Z', 'M16.5 36 H21.5'],
    accent: ['M32 16 C35 19.5 35 26.5 32 30', 'M37 11 C42.5 17 42.5 29 37 35'],
  },
  'consumer-lenders': {
    ink: ['M6 13 H42 V37 H6 Z', 'M6 19.5 H42', 'M27 30 H36'],
    accent: ['M11 25 H19 V31 H11 Z'],
  },
  'telecom-companies': {
    ink: ['M24 22 L18 42', 'M24 22 L30 42', 'M20.2 35 H27.8', circ(24, 19, 2.5)],
    accent: ['M17 11 C12.5 15.5 12.5 22.5 17 27', 'M31 11 C35.5 15.5 35.5 22.5 31 27'],
  },
  'large-insurers': {
    ink: ['M24 24 V37 C24 42 18 42 18 37'],
    accent: ['M6 24 C6 11 42 11 42 24 C39 21 36 21 33 24 C30 21 27 21 24 24 C21 21 18 21 15 24 C12 21 9 21 6 24 Z'],
  },
  'private-hospitals': {
    ink: [circ(24, 24, 17)],
    accent: ['M21 15 H27 V21 H33 V27 H27 V33 H21 V27 H15 V21 H21 Z'],
  },
  'superstore-chains': {
    ink: ['M5 10 H10.5 L15 31 H36 L40.5 17 H12.5', circ(18, 37.5, 2.5), circ(33, 37.5, 2.5)],
    accent: ['M18 11 H24 V17 H18 Z', 'M27 8 H34 V17 H27 Z'],
  },
  'diagnostic-centers': {
    ink: [circ(20, 20, 12.5), 'M29.5 29.5 L41 41'],
    accent: ['M11 20 H15.5 L17.5 14.5 L22 25.5 L24 20 H29'],
  },
  'export-houses': {
    ink: ['M6 30 H42 L37 38 H11 Z', 'M11 22 H21 V30 H11 Z', 'M6 43 C10 41 14 41 18 43 C22 45 26 45 30 43 C34 41 38 41 42 43'],
    accent: ['M21 17 H34 V30 H21 Z'],
  },
  'restaurant-chains': {
    ink: [circ(24, 26, 13.5), 'M6 11 V41', 'M42 11 V41'],
    accent: [circ(24, 26, 7.5)],
  },
  'local-conglomerates': {
    ink: [hex(17, 18, 8), hex(31, 18, 8)],
    accent: [hex(24, 30.5, 8)],
  },
};

const FALLBACK: Mark = { ink: [circ(24, 24, 16)], accent: [circ(24, 24, 5)] };

export function IndustryGlyph({ slug, className }: { slug: string; className?: string }) {
  const m = MARKS[slug] ?? FALLBACK;
  let k = 0;
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className={`ig ${className ?? ''}`}>
      {m.ink.map((d) => (
        <path key={`i${k}`} d={d} pathLength={1} className="ig-p" style={{ '--k': k++ } as CSSProperties} />
      ))}
      {m.accent.map((d) => (
        <path key={`a${k}`} d={d} pathLength={1} className="ig-p ig-a" style={{ '--k': k++ } as CSSProperties} />
      ))}
    </svg>
  );
}

export default IndustryGlyph;
