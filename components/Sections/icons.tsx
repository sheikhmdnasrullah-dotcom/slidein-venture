/**
 * SECTION ICONS — stroke glyphs in the hero tile style
 * ---------------------------------------------------------------------------
 * 48×48 viewBox, ink strokes, at most one accent moment per icon. Shapes
 * only: no text, no numbers, no letters. Every consumer is aria-hidden.
 */

const INK = 'rgba(10,10,10,1)';
const SOFT = 'rgba(10,10,10,0.16)';

type P = { size?: number | string };

function Svg({ size = '50%', children }: P & { children: React.ReactNode }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      {children}
    </svg>
  );
}

/* search — research */
export function SearchIcon(p: P) {
  return (
    <Svg {...p}>
      <circle cx="21" cy="21" r="11" stroke={INK} strokeWidth="3.2" />
      <path d="M29.5 29.5 L39 39" stroke={INK} strokeWidth="3.2" strokeLinecap="round" />
      <circle cx="17.5" cy="17.5" r="2.2" fill="var(--scaffold-accent)" stroke="none" />
    </Svg>
  );
}

/* eye — review */
export function EyeIcon(p: P) {
  return (
    <Svg {...p}>
      <path
        d="M5 24 C11 14, 18 11, 24 11 C30 11, 37 14, 43 24 C37 34, 30 37, 24 37 C18 37, 11 34, 5 24 Z"
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <circle cx="24" cy="24" r="6.5" stroke={INK} strokeWidth="3" />
      <circle cx="26" cy="22" r="2" fill="var(--scaffold-accent)" stroke="none" />
    </Svg>
  );
}

/* pen — personalize */
export function PenIcon(p: P) {
  return (
    <Svg {...p}>
      <path
        d="M31 8 L40 17 L20 37 L9 40 L12 29 Z"
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M27 12 L36 21" stroke={SOFT} strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="10.5" cy="38.5" r="2.4" fill="var(--scaffold-accent)" stroke="none" />
    </Svg>
  );
}

/* paper plane — send */
export function SendIcon(p: P) {
  return (
    <Svg {...p}>
      <path
        d="M9 25.5 L39 10 L27 39 L22.5 28.5 Z"
        fill={INK}
        stroke={INK}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <circle cx="33" cy="15" r="2.4" fill="var(--scaffold-accent)" stroke="none" />
    </Svg>
  );
}

/* pulse line — monitor */
export function PulseIcon(p: P) {
  return (
    <Svg {...p}>
      <path
        d="M6 26 H15 L19 15 L25 34 L30 22 H42"
        stroke={INK}
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="25" cy="34" r="2.4" fill="var(--scaffold-accent)" stroke="none" />
    </Svg>
  );
}

/* inbox — replies */
export function InboxIcon(p: P) {
  return (
    <Svg {...p}>
      <path
        d="M8 12 H40 L40 36 H8 Z M8 27 H18 C18 31, 21 33, 24 33 C27 33, 30 31, 30 27 H40"
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <circle cx="24" cy="19" r="2.4" fill="var(--scaffold-accent)" stroke="none" />
    </Svg>
  );
}

/* calendar */
export function CalendarIcon(p: P) {
  return (
    <Svg {...p}>
      <rect x="8" y="11" width="32" height="28" rx="5" stroke={INK} strokeWidth="3" />
      <path d="M8 20 H40" stroke={INK} strokeWidth="3" />
      <path d="M16 7 V14 M32 7 V14" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      <circle cx="24" cy="28" r="3" fill="var(--scaffold-accent)" stroke="none" />
    </Svg>
  );
}

/* document */
export function DocIcon(p: P) {
  return (
    <Svg {...p}>
      <path
        d="M13 6 H29 L37 14 V42 H13 Z"
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M29 6 V14 H37" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M19 22 H29 M19 28 H29" stroke={SOFT} strokeWidth="2.6" strokeLinecap="round" />
      <circle cx="19" cy="35" r="2.2" fill="var(--scaffold-accent)" stroke="none" />
    </Svg>
  );
}

/* check */
export function CheckIcon(p: P) {
  return (
    <Svg {...p}>
      <circle cx="24" cy="24" r="14" stroke={INK} strokeWidth="3" />
      <path
        d="M17.5 24.5 L22 29 L30.5 19.5"
        stroke={INK}
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/* shield — configured, verified */
export function ShieldIcon(p: P) {
  return (
    <Svg {...p}>
      <path
        d="M24 6 L39 12 V23 C39 32, 32 38.5, 24 42 C16 38.5, 9 32, 9 23 V12 Z"
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M17.5 23.5 L22 28 L30.5 18.5"
        stroke={INK}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/* slash — what we do not do */
export function SlashIcon(p: P) {
  return (
    <Svg {...p}>
      <circle cx="24" cy="24" r="15" stroke={INK} strokeWidth="3" />
      <path d="M14 34 L34 14" stroke={INK} strokeWidth="3.4" strokeLinecap="round" />
      <circle cx="24" cy="24" r="2.2" fill="var(--scaffold-accent)" stroke="none" />
    </Svg>
  );
}

/* person — a human in the loop */
export function UserIcon(p: P) {
  return (
    <Svg {...p}>
      <circle cx="24" cy="17" r="8" stroke={INK} strokeWidth="3" />
      <path
        d="M9 41 C11 32, 17 29, 24 29 C31 29, 37 32, 39 41"
        stroke={INK}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="26.5" cy="15" r="2" fill="var(--scaffold-accent)" stroke="none" />
    </Svg>
  );
}

/* chat bubble — questions */
export function ChatIcon(p: P) {
  return (
    <Svg {...p}>
      <path
        d="M8 12 H40 V31 H22 L14 39 V31 H8 Z"
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <circle cx="17" cy="21.5" r="2" fill={SOFT} stroke="none" />
      <circle cx="24" cy="21.5" r="2" fill={SOFT} stroke="none" />
      <circle cx="31" cy="21.5" r="2.4" fill="var(--scaffold-accent)" stroke="none" />
    </Svg>
  );
}

/* stack — records */
export function StackIcon(p: P) {
  return (
    <Svg {...p}>
      <rect x="16" y="8" width="22" height="28" rx="4" fill="rgba(10,10,10,0.07)" stroke={SOFT} strokeWidth="1.5" />
      <rect x="9" y="14" width="24" height="27" rx="4" fill="rgba(255,255,255,1)" stroke="rgba(10,10,10,0.18)" strokeWidth="1.8" />
      <path d="M14 22 h14 M14 28 h14 M14 34 h9" stroke={SOFT} strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="28" cy="34" r="2.4" fill="var(--scaffold-accent)" stroke="none" />
    </Svg>
  );
}

/* magnifier over list — review queue */
export function QueueIcon(p: P) {
  return (
    <Svg {...p}>
      <path d="M8 12 H28 M8 20 H24 M8 28 H26" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      <circle cx="33" cy="31" r="8" stroke={INK} strokeWidth="3" />
      <path d="M39.5 37.5 L44 42" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      <circle cx="30.5" cy="28.5" r="2" fill="var(--scaffold-accent)" stroke="none" />
    </Svg>
  );
}

/* people — audiences */
export function UsersIcon(p: P) {
  return (
    <Svg {...p}>
      <circle cx="18" cy="18" r="7" stroke={INK} strokeWidth="3" />
      <path d="M6 39 C8 31, 13 29, 18 29 C23 29, 28 31, 30 39" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      <circle cx="33" cy="19" r="6" stroke={SOFT} strokeWidth="2.6" />
      <path d="M30 29 C36 29, 41 32, 42.5 39" stroke={SOFT} strokeWidth="2.6" strokeLinecap="round" />
      <circle cx="20.5" cy="16.5" r="2" fill="var(--scaffold-accent)" stroke="none" />
    </Svg>
  );
}

/* envelope */
export function EnvelopeIcon(p: P) {
  return (
    <Svg {...p}>
      <rect x="8" y="13" width="32" height="23" rx="5" stroke={INK} strokeWidth="3" />
      <path d="M9 17.5 L24 28 L39 17.5" stroke={INK} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="24" cy="28.5" r="3" fill="var(--scaffold-accent)" stroke="none" />
    </Svg>
  );
}

/* gear — operations */
export function GearIcon(p: P) {
  return (
    <Svg {...p}>
      <circle cx="24" cy="24" r="7" stroke={INK} strokeWidth="3" />
      <path
        d="M24 8 V13 M24 35 V40 M8 24 H13 M35 24 H40 M12.7 12.7 L16.2 16.2 M31.8 31.8 L35.3 35.3 M35.3 12.7 L31.8 16.2 M16.2 31.8 L12.7 35.3"
        stroke={INK}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="24" cy="24" r="2.4" fill="var(--scaffold-accent)" stroke="none" />
    </Svg>
  );
}
