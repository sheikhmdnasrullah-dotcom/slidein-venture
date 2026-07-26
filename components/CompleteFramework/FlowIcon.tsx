'use client';

import type { IconKey } from './framework.data';

/**
 * Thin, uniform line icons — 1.6px stroke, 24px grid — so every chip in the
 * diagram reads as one family. Replaced by custom artwork whenever a data
 * entry supplies a `logo` path.
 */
const PATHS: Record<IconKey, React.ReactNode> = {
  video: (
    <>
      <rect x="2.5" y="6" width="13" height="12" rx="2.5" />
      <path d="M15.5 11.2l5-2.7v7l-5-2.7z" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="0.6" fill="currentColor" />
    </>
  ),
  film: (
    <>
      <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
      <path d="M2.5 9h19M2.5 15h19M8 4.5v15M16 4.5v15" />
    </>
  ),
  mic: (
    <>
      <rect x="9" y="2.5" width="6" height="11" rx="3" />
      <path d="M5.5 11.5a6.5 6.5 0 0013 0M12 18v3.5M8.5 21.5h7" />
    </>
  ),
  shorts: (
    <>
      <rect x="6" y="2.5" width="12" height="19" rx="3" />
      <path d="M10.5 9.5l4.5 2.5-4.5 2.5z" />
    </>
  ),
  linkedin: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M7.5 10.5v6M7.5 7.6v.1M11.5 16.5v-6M11.5 13a2.5 2.5 0 015 0v3.5" />
    </>
  ),
  article: (
    <>
      <path d="M5 3.5h9l5 5v12a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 015 20.5z" />
      <path d="M14 3.5v5h5M8.5 13h7M8.5 17h4.5" />
    </>
  ),
  inbox: (
    <>
      <path d="M3 12.5V19a2 2 0 002 2h14a2 2 0 002-2v-6.5" />
      <path d="M3 12.5l3-8.5h12l3 8.5h-5.5a2.5 2.5 0 01-5 0z" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2.5" />
      <path d="M3 10h18M8 3v4M16 3v4" />
      <path d="M9.5 15l1.8 1.8 3.4-3.6" />
    </>
  ),
  layers: (
    <>
      <path d="M12 3l8.5 4.5L12 12 3.5 7.5z" />
      <path d="M3.5 12.5L12 17l8.5-4.5M3.5 16.8L12 21.3l8.5-4.5" />
    </>
  ),
  send: (
    <>
      <path d="M21 3.5L10.5 14" />
      <path d="M21 3.5l-6.8 17.5-3.7-7-7-3.7z" />
    </>
  ),
};

export function FlowIcon({
  name,
  size = 20,
  className,
}: {
  name: IconKey;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  );
}

/** Custom artwork when provided, line icon otherwise. */
export function Artwork({
  logo,
  icon,
  label,
  size = 20,
}: {
  logo?: string;
  icon: IconKey;
  label: string;
  size?: number;
}) {
  if (logo) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={logo}
        alt={label}
        width={size}
        height={size}
        loading="lazy"
        decoding="async"
        className="object-contain"
        style={{ width: size, height: size }}
      />
    );
  }
  return <FlowIcon name={icon} size={size} />;
}
