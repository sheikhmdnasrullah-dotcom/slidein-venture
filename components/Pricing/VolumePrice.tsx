'use client';

/**
 * The pricing headline: "We'll manage your [volume] outreach emails per month
 * for $[price]/month". The blank is a real input styled as part of the line.
 * On load the default number is typed in once, the underline draws left to
 * right and a caret blinks after it; any interaction ends the intro at once.
 * Prices come from monthlyPriceUsd() in content/pricing.ts.
 */

import { useEffect, useState } from 'react';
import { PRICING, monthlyPriceUsd } from '@/content/pricing';

const fmt = (n: number) => n.toLocaleString('en-US');
const TYPE_DELAY_MS = 700; // underline draws first
const TYPE_STEP_MS = 170;

export default function VolumePrice() {
  const [emails, setEmails] = useState<number>(PRICING.includedEmails);
  const [typed, setTyped] = useState<number | null>(0); // null = intro over

  const value = emails === 0 ? '' : fmt(emails);
  const shown = typed === null ? value : value.slice(0, typed);

  /* intro: type the default number once; skipped under reduced motion */
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const skip = setTimeout(() => setTyped(null), 0);
      return () => clearTimeout(skip);
    }
    const full = fmt(PRICING.includedEmails).length;
    let n = 0;
    let timer: ReturnType<typeof setTimeout>;
    const step = () => {
      n += 1;
      setTyped(n >= full ? null : n);
      if (n < full) timer = setTimeout(step, TYPE_STEP_MS);
    };
    timer = setTimeout(step, TYPE_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  const endIntro = () => setTyped(null);

  const onChange = (raw: string) => {
    endIntro();
    const digits = raw.replace(/\D/g, '').slice(0, 7);
    setEmails(digits === '' ? 0 : Math.min(Number(digits), PRICING.maxEmails));
  };

  return (
    <h1 className="font-display-xl text-[clamp(2.2rem,5.4vw,4.1rem)] leading-[1.1] text-[var(--on-surface)]">
      <style>{`
        .vp-field{position:relative;display:inline-block;padding:0 .08em;max-width:85vw;cursor:text}
        .vp-field::after{content:'';position:absolute;left:0;right:0;bottom:-.02em;height:.06em;background:var(--color-brand);transform-origin:left;transition:height .2s ease}
        .vp-field:hover::after,.vp-field:focus-within::after{height:.1em}
        .vp-size{visibility:hidden;white-space:pre}
        .vp-input{position:absolute;inset:0;width:100%;height:100%;padding:0 .08em;border:0;background:transparent;font:inherit;letter-spacing:inherit;line-height:inherit;color:inherit;text-align:left;caret-color:var(--color-brand);outline:none;cursor:text}
        .vp-input::placeholder{color:color-mix(in oklch,currentColor 30%,transparent)}
        .vp-ghost{position:absolute;inset:0;padding:0 .08em;white-space:pre;text-align:left;pointer-events:none}
        .vp-ghost span{visibility:hidden}
        .vp-caret{display:inline-block;width:.045em;height:.82em;margin-left:.02em;vertical-align:-.08em;background:var(--color-brand);animation:vp-blink 1.1s steps(1) infinite}
        .vp-field:focus-within .vp-caret{display:none}
        .vp-intro::after{animation:vp-draw .7s cubic-bezier(.22,1,.36,1) both}
        @keyframes vp-blink{50%{opacity:0}}
        @keyframes vp-draw{from{transform:scaleX(0)}to{transform:scaleX(1)}}
        @media (prefers-reduced-motion:reduce){.vp-caret{animation:none}.vp-intro::after{animation:none}}
      `}</style>
      <span className="block">
        We&rsquo;ll manage your{' '}
        <span className="vp-field vp-intro">
          <span className="vp-size" aria-hidden="true">
            {value || '0'}
          </span>
          <input
            value={shown}
            onChange={(e) => onChange(e.target.value)}
            onPointerDown={endIntro}
            onClick={(e) => e.currentTarget.select()}
            onKeyDown={endIntro}
            onFocus={(e) => {
              endIntro();
              const el = e.currentTarget;
              setTimeout(() => el.select(), 0);
            }}
            inputMode="numeric"
            autoComplete="off"
            placeholder="0"
            aria-label="Outreach emails per month"
            className="vp-input"
          />
          <span className="vp-ghost" aria-hidden="true">
            <span>{shown}</span>
            <i className="vp-caret" />
          </span>
        </span>
      </span>
      <span className="block">outreach emails per month</span>
      <span className="block" aria-live="polite">
        for ${fmt(monthlyPriceUsd(emails))}/month
      </span>
    </h1>
  );
}
