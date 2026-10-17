/**
 * WORKFLOW ICONS — stroke glyphs for the loop visual
 * ---------------------------------------------------------------------------
 * 24×24 viewBox, 1.5px strokes, shapes only: no text, no numbers, no letters.
 * currentColor ink; the single accent dot uses --scaffold-accent, matching
 * the section icon vocabulary. Every consumer is aria-hidden.
 */

const INK = 'currentColor';

type P = { size?: number | string; className?: string };

function Svg({ size = '50%', className, children }: P & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={INK}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {children}
    </svg>
  );
}

/* sliders — configure */
export function SlidersIcon(p: P) {
  return (
    <Svg {...p}>
      <path d="M4 7 H20 M4 12 H20 M4 17 H20" />
      <circle cx="9" cy="7" r="2.2" />
      <circle cx="15" cy="12" r="2.2" />
      <circle cx="7" cy="17" r="2.2" />
    </Svg>
  );
}

/* radar — discover */
export function RadarIcon(p: P) {
  return (
    <Svg {...p}>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <path d="M12 12 L18 6" />
      <circle cx="12" cy="12" r="1" fill="var(--scaffold-accent)" stroke="none" />
    </Svg>
  );
}

/* magnifier over page — research */
export function ResearchIcon(p: P) {
  return (
    <Svg {...p}>
      <path d="M6 3 H15 L19 7 V21 H6 Z" />
      <path d="M15 3 V7 H19" />
      <circle cx="13.5" cy="13.5" r="3.5" />
      <path d="M16.2 16.2 L19.5 19.5" />
    </Svg>
  );
}

/* funnel — qualify */
export function FunnelIcon(p: P) {
  return (
    <Svg {...p}>
      <path d="M4 5 H20 L14 12.5 V19 L10 21 V12.5 Z" />
      <circle cx="12" cy="8" r="1" fill="var(--scaffold-accent)" stroke="none" />
    </Svg>
  );
}

/* pen on page — personalize */
export function PenPageIcon(p: P) {
  return (
    <Svg {...p}>
      <path d="M5 3 H14 L19 8 V21 H5 Z" />
      <path d="M14 3 V8 H19" />
      <path d="M13.5 12.5 L17 16.5 L10.5 18 L12 11.5 Z" />
    </Svg>
  );
}

/* paper plane — outreach */
export function PlaneIcon(p: P) {
  return (
    <Svg {...p}>
      <path d="M3 11.5 L21 4 L14 21 L11 14.5 Z" />
      <path d="M11 14.5 L21 4" />
      <circle cx="17.5" cy="7.5" r="1" fill="var(--scaffold-accent)" stroke="none" />
    </Svg>
  );
}

/* chat bubble — converse */
export function BubbleIcon(p: P) {
  return (
    <Svg {...p}>
      <path d="M4 5 H20 V15 H12 L8 19 V15 H4 Z" />
      <circle cx="9" cy="10" r="0.9" fill={INK} stroke="none" />
      <circle cx="12.5" cy="10" r="0.9" fill={INK} stroke="none" />
      <circle cx="16" cy="10" r="0.9" fill="var(--scaffold-accent)" stroke="none" />
    </Svg>
  );
}

/* bars + line chart — overview */
export function ChartIcon(p: P) {
  return (
    <Svg {...p}>
      <path d="M4 4 V20 H20" />
      <path d="M8 16 V12 M12 16 V8 M16 16 V13" />
      <path d="M8 10 L12 7 L16 9 L20 5" />
    </Svg>
  );
}

/* check in circle — verify gate */
export function CheckCircleIcon(p: P) {
  return (
    <Svg {...p}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8.5 12.2 L11 14.7 L15.8 9.5" />
    </Svg>
  );
}

/* shield — deliverability gate */
export function ShieldIcon(p: P) {
  return (
    <Svg {...p}>
      <path d="M12 3 L19 5.8 V11 C19 16 15.8 19.4 12 21 C8.2 19.4 5 16 5 11 V5.8 Z" />
      <path d="M9 11.8 L11.2 14 L15.2 9.8" />
    </Svg>
  );
}

/* gauge — placement risk */
export function GaugeIcon(p: P) {
  return (
    <Svg {...p}>
      <path d="M4 14 A8 8 0 1 1 20 14" />
      <path d="M12 14 L15.5 9.5" />
      <circle cx="12" cy="14" r="1.2" fill="var(--scaffold-accent)" stroke="none" />
    </Svg>
  );
}

/* switch — circuit breaker */
export function SwitchIcon(p: P) {
  return (
    <Svg {...p}>
      <rect x="4" y="8" width="16" height="8" rx="4" />
      <circle cx="9" cy="12" r="2" />
    </Svg>
  );
}

/* list with slash — suppression */
export function ListSlashIcon(p: P) {
  return (
    <Svg {...p}>
      <path d="M9 6 H19 M9 12 H19 M9 18 H19" />
      <path d="M4 6 H5.5 M4 12 H5.5 M4 18 H5.5" />
      <path d="M4 20 L20 4" />
    </Svg>
  );
}

/* envelope */
export function EnvelopeIcon(p: P) {
  return (
    <Svg {...p}>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2.5" />
      <path d="M4.5 8 L12 13.5 L19.5 8" />
    </Svg>
  );
}

/* stamp — signed authentication */
export function StampIcon(p: P) {
  return (
    <Svg {...p}>
      <path d="M9 10 H15 V13 H9 Z" />
      <path d="M12 13 V15" />
      <path d="M8 18 H16 M9 15.5 H15" />
      <circle cx="12" cy="6.5" r="1.6" />
    </Svg>
  );
}

/* rack — sending server */
export function RackIcon(p: P) {
  return (
    <Svg {...p}>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M4 9.3 H20 M4 14.6 H20" />
      <circle cx="7" cy="6.6" r="0.8" fill={INK} stroke="none" />
      <circle cx="7" cy="12" r="0.8" fill={INK} stroke="none" />
      <circle cx="7" cy="17.3" r="0.8" fill="var(--scaffold-accent)" stroke="none" />
    </Svg>
  );
}

/* user — recipient */
export function UserIcon(p: P) {
  return (
    <Svg {...p}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5.5 20 C7 15.5 9.5 14 12 14 C14.5 14 17 15.5 18.5 20" />
    </Svg>
  );
}

/* hold — two bars */
export function HoldIcon(p: P) {
  return (
    <Svg {...p}>
      <path d="M9 5 V19 M15 5 V19" />
    </Svg>
  );
}

/* mail — warmup */
export function MailWarmIcon(p: P) {
  return (
    <Svg {...p}>
      <rect x="3.5" y="6" width="17" height="12" rx="2.5" />
      <path d="M4.5 8.5 L12 13.5 L19.5 8.5" />
    </Svg>
  );
}

/* check */
export function CheckIcon(p: P) {
  return (
    <Svg {...p}>
      <path d="M5 12.5 L10 17.5 L19 7" />
    </Svg>
  );
}

/* question — objection */
export function QuestionIcon(p: P) {
  return (
    <Svg {...p}>
      <path d="M8.5 9 A3.5 3.5 0 1 1 12 12.5 V14" />
      <circle cx="12" cy="17.5" r="0.9" fill={INK} stroke="none" />
    </Svg>
  );
}

/* moon — out of office */
export function MoonIcon(p: P) {
  return (
    <Svg {...p}>
      <path d="M20 14.5 A8.5 8.5 0 1 1 9.5 4 A7 7 0 0 0 20 14.5 Z" />
    </Svg>
  );
}

/* stop — opt-out */
export function StopIcon(p: P) {
  return (
    <Svg {...p}>
      <rect x="6" y="6" width="12" height="12" rx="2" />
      <path d="M9.5 9.5 L14.5 14.5 M14.5 9.5 L9.5 14.5" />
    </Svg>
  );
}

/* slash — suppression */
export function SlashIcon(p: P) {
  return (
    <Svg {...p}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M6.5 17.5 L17.5 6.5" />
    </Svg>
  );
}

/* calendar — ghost (planned, not built) */
export function CalendarIcon(p: P) {
  return (
    <Svg {...p}>
      <rect x="4" y="5.5" width="16" height="15" rx="2.5" />
      <path d="M4 10 H20 M9 3.5 V7.5 M15 3.5 V7.5" />
      <circle cx="12" cy="15" r="1.4" fill="var(--scaffold-accent)" stroke="none" />
    </Svg>
  );
}

/* wrench — recovery */
export function WrenchIcon(p: P) {
  return (
    <Svg {...p}>
      <path d="M14.5 6.5 A4.5 4.5 0 0 0 8.8 12.2 L4 17 L7 20 L11.8 15.2 A4.5 4.5 0 0 0 17.5 9.5 L14.8 12.2 L11.8 9.2 Z" />
    </Svg>
  );
}

/* warning triangle — failure toggle */
export function WarningIcon(p: P) {
  return (
    <Svg {...p}>
      <path d="M12 4 L21.5 19.5 H2.5 Z" />
      <path d="M12 10 V14" />
      <circle cx="12" cy="16.8" r="0.9" fill={INK} stroke="none" />
    </Svg>
  );
}

/* play */
export function PlayIcon(p: P) {
  return (
    <Svg {...p}>
      <path d="M8 5.5 L19 12 L8 18.5 Z" fill={INK} stroke="none" />
    </Svg>
  );
}

/* pause */
export function PauseIcon(p: P) {
  return (
    <Svg {...p}>
      <path d="M9 5.5 V18.5 M15 5.5 V18.5" />
    </Svg>
  );
}

/* prev / next chevrons */
export function PrevIcon(p: P) {
  return (
    <Svg {...p}>
      <path d="M14.5 5.5 L8 12 L14.5 18.5" />
    </Svg>
  );
}

export function NextIcon(p: P) {
  return (
    <Svg {...p}>
      <path d="M9.5 5.5 L16 12 L9.5 18.5" />
    </Svg>
  );
}

/* arrow right — contract pill direction */
export function ArrowRightIcon(p: P) {
  return (
    <Svg {...p}>
      <path d="M4 12 H19 M13 6 L19 12 L13 18" />
    </Svg>
  );
}

/* dash — missing criterion */
export function DashIcon(p: P) {
  return (
    <Svg {...p}>
      <path d="M6 12 H18" />
    </Svg>
  );
}

/* eye — observability */
export function EyeIcon(p: P) {
  return (
    <Svg {...p}>
      <path d="M3.5 12 C6.5 7.5, 9.5 6, 12 6 C14.5 6, 17.5 7.5, 20.5 12 C17.5 16.5, 14.5 18, 12 18 C9.5 18, 6.5 16.5, 3.5 12 Z" />
      <circle cx="12" cy="12" r="2.6" />
      <circle cx="12.8" cy="11.2" r="0.8" fill="var(--scaffold-accent)" stroke="none" />
    </Svg>
  );
}

/* lock — read-only */
export function LockIcon(p: P) {
  return (
    <Svg {...p}>
      <rect x="6" y="10.5" width="12" height="9.5" rx="2.5" />
      <path d="M8.5 10.5 V8 A3.5 3.5 0 0 1 15.5 8 V10.5" />
      <circle cx="12" cy="15" r="1" fill={INK} stroke="none" />
    </Svg>
  );
}
