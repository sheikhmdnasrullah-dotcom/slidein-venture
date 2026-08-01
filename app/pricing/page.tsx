'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Service Data ─────────────────────────────────────────────────────────────
interface Service {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  price: number;
  tag?: string;
  color: string;
  textColor: string;
}

const SERVICES: Service[] = [
  {
    id: 'short-reels',
    icon: '🎬',
    title: 'Short-Form Reels',
    subtitle: 'Editing',
    description: 'Punchy, scroll-stopping reels & shorts cut for Instagram, TikTok, and YouTube.',
    price: 299,
    tag: 'Most Popular',
    color: 'var(--accent-wash)',
    textColor: 'var(--accent)',
  },
  {
    id: 'long-form',
    icon: '🎥',
    title: 'Long-Form Video',
    subtitle: 'Editing',
    description: 'Full-length YouTube videos, podcasts, webinars — polished from raw footage.',
    price: 499,
    color: 'var(--accent-wash)',
    textColor: 'var(--accent)',
  },
  {
    id: 'thumbnail',
    icon: '🖼️',
    title: 'Thumbnail Design',
    subtitle: 'Creative',
    description: 'Eye-catching, click-worthy thumbnails that drive CTR on every platform.',
    price: 149,
    color: 'var(--accent-wash)',
    textColor: 'var(--accent)',
  },
  {
    id: 'scheduling',
    icon: '📅',
    title: 'Scheduling',
    subtitle: 'Operations',
    description: 'Strategic content calendar management — every post planned and queued.',
    price: 99,
    color: 'var(--accent-wash)',
    textColor: 'var(--accent)',
  },
  {
    id: 'publishing',
    icon: '🚀',
    title: 'Publishing',
    subtitle: 'Distribution',
    description: 'Multi-platform publishing with optimized captions, tags, and timing.',
    price: 79,
    color: 'var(--accent-wash)',
    textColor: 'var(--accent)',
  },
  {
    id: 'articles',
    icon: '✍️',
    title: 'Article Writing',
    subtitle: 'Content',
    description: 'SEO-optimized long-form articles, LinkedIn posts, and blog content.',
    price: 249,
    color: 'var(--accent-wash)',
    textColor: 'var(--accent)',
  },
  {
    id: 'cold-email',
    icon: '📧',
    title: 'Cold Email',
    subtitle: 'Outreach',
    description: 'High-converting cold email sequences that land in the inbox, not spam.',
    price: 199,
    color: 'var(--accent-wash)',
    textColor: 'var(--accent)',
  },
  {
    id: 'cold-outreach',
    icon: '🤝',
    title: 'Cold Outreach',
    subtitle: 'LinkedIn & DMs',
    description: 'LinkedIn + DM outreach campaigns that book qualified calls on autopilot.',
    price: 299,
    tag: 'High ROI',
    color: 'var(--accent-wash)',
    textColor: 'var(--accent)',
  },
  {
    id: 'repurposing',
    icon: '♻️',
    title: 'Content Repurposing',
    subtitle: 'Strategy',
    description: 'Turn one piece of content into 10+ assets across every channel.',
    price: 179,
    color: 'var(--accent-wash)',
    textColor: 'var(--accent)',
  },
  {
    id: 'analytics',
    icon: '📊',
    title: 'Analytics & Reporting',
    subtitle: 'Insights',
    description: 'Monthly performance reports with actionable growth recommendations.',
    price: 129,
    color: 'var(--accent-wash)',
    textColor: 'var(--accent)',
  },
  {
    id: 'brand-strategy',
    icon: '🎯',
    title: 'Brand Strategy',
    subtitle: 'Identity',
    description: 'Positioning, messaging, and visual identity for founders who want to stand out.',
    price: 399,
    color: 'var(--accent-wash)',
    textColor: 'var(--accent)',
  },
  {
    id: 'ghostwriting',
    icon: '👻',
    title: 'Ghostwriting',
    subtitle: 'Thought Leadership',
    description: 'Twitter/X threads, newsletters, and founder stories written in your voice.',
    price: 349,
    tag: 'Premium',
    color: 'var(--accent-wash)',
    textColor: 'var(--accent)',
  },
];

function getDiscount(count: number): number {
  if (count >= 8) return 0.30;
  if (count >= 5) return 0.20;
  if (count >= 3) return 0.10;
  return 0;
}

function PriceSummary({
  selected,
  services,
  onClear,
}: {
  selected: Set<string>;
  services: Service[];
  onClear: () => void;
}) {
  const count = selected.size;
  const subtotal = [...selected].reduce((sum, id) => {
    const s = services.find((s) => s.id === id);
    return sum + (s?.price ?? 0);
  }, 0);
  const discount = getDiscount(count);
  const savings = Math.round(subtotal * discount);
  const total = subtotal - savings;

  const RED_PRICING = 'var(--accent-vivid)';
  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 80 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50"
          style={{
            background: 'color-mix(in oklch, var(--on-surface) 97%, transparent)',
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid color-mix(in oklch, var(--surface) 8%, transparent)',
          }}
        >
          <div className="max-w-[1100px] mx-auto px-6 md:px-10 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[13px] font-[800]"
                style={{ background: RED_PRICING, color: 'var(--surface)' }}
              >
                {count}
              </div>
              <div>
                <p className="text-[13px] font-[600] text-[var(--on-accent)] leading-tight">
                  {count} service{count !== 1 ? 's' : ''} selected
                </p>
                {discount > 0 && (
                  <p className="text-[11.5px] font-[500]" style={{ color: RED_PRICING }}>
                    🎉 {Math.round(discount * 100)}% bundle discount applied — saving ${savings}
                  </p>
                )}
              </div>
            </div>

            <div className="hidden md:flex items-center gap-5 text-center">
              {discount > 0 && (
                <div>
                  <p className="text-[11px] text-[var(--muted)] uppercase tracking-[0.06em] font-[600]">Subtotal</p>
                  <p className="text-[15px] font-[700] text-[var(--muted)] line-through">${subtotal.toLocaleString()}</p>
                </div>
              )}
              <div>
                <p className="text-[11px] text-[var(--muted)] uppercase tracking-[0.06em] font-[600]">Total / mo</p>
                <p className="text-[22px] font-[800] text-[var(--on-accent)]">${total.toLocaleString()}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onClear}
                className="text-[13px] text-[var(--muted)] hover:text-[var(--on-accent)] transition-colors px-3 py-2"
              >
                Clear all
              </button>
              <Link
                href="https://calendar.notion.so/meet/nasrullah_tanim/schedule"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-[14px] font-[700] transition-all duration-200 hover:-translate-y-px hover:shadow-lg"
                style={{ background: 'var(--accent-vivid)', color: 'var(--surface)' }}
              >
                Book a Call
                <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none">
                  <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          </div>

          <div className="sm:hidden border-t border-[var(--rule)] px-6 py-3 flex items-center justify-between">
            <span className="text-[12px] text-[var(--muted)]">
              {discount > 0 ? <span className="line-through mr-2">${subtotal}</span> : null}
              Total/mo
            </span>
            <span className="text-[20px] font-[800] text-[var(--on-accent)]">${total.toLocaleString()}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ServiceCard({
  service,
  selected,
  onToggle,
}: {
  service: Service;
  selected: boolean;
  onToggle: (id: string) => void;
}) {
  return (
    <motion.button
      layout
      onClick={() => onToggle(service.id)}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="relative w-full text-left rounded-2xl p-5 transition-all duration-200 group focus:outline-none"
      style={{
        background: selected ? 'var(--on-surface)' : service.color,
        border: selected ? '2px solid var(--accent-vivid)' : '2px solid transparent',
        boxShadow: selected
          ? '0 0 0 3px color-mix(in oklch, var(--accent-vivid) 15%, transparent), 0 8px 32px color-mix(in oklch, var(--on-surface) 12%, transparent)'
          : '0 1px 4px color-mix(in oklch, var(--on-surface) 4%, transparent)',
      }}
    >
      {service.tag && (
        <span
          className="absolute top-4 right-4 text-[10px] font-[700] tracking-[0.06em] uppercase px-2 py-0.5 rounded-full"
          style={{
            background: selected ? 'var(--accent-vivid)' : service.textColor,
            color: 'var(--on-accent)',
          }}
        >
          {service.tag}
        </span>
      )}

      <div className="text-3xl mb-3 leading-none">{service.icon}</div>

      <p
        className="text-[13px] font-[600] tracking-[0.04em] uppercase mb-0.5"
        /* The opacity: 0.7 that used to live here dropped this label to 3.49:1.
           Recession is the token's job — --muted already recedes by exactly the
           right amount and stays legible; fading a legible colour does not. */
        style={{ color: selected ? 'var(--accent)' : 'var(--muted)' }}
      >
        {service.subtitle}
      </p>
      <h3
        className="text-[17px] font-[750] leading-tight tracking-[-0.02em] mb-2"
        style={{ color: selected ? 'var(--surface)' : 'var(--on-surface)' }}
      >
        {service.title}
      </h3>
      <p
        className="text-[13px] leading-[1.55]"
        style={{ color: selected ? 'color-mix(in oklch, var(--surface) 60%, transparent)' : 'var(--muted)' }}
      >
        {service.description}
      </p>

      <div
        className="flex items-end justify-between mt-4 pt-4"
        style={{ borderTop: selected ? '1px solid color-mix(in oklch, var(--surface) 8%, transparent)' : '1px solid color-mix(in oklch, var(--on-surface) 6%, transparent)' }}
      >
        <div>
          <span
            className="text-[24px] font-[800] tracking-[-0.03em]"
            style={{ color: selected ? 'var(--accent)' : 'var(--on-surface)' }}
          >
            ${service.price}
          </span>
          <span
            className="text-[12px] font-[500] ml-1"
            style={{ color: selected ? 'var(--on-accent)' : 'var(--muted)' }}
          >
            /mo
          </span>
        </div>

        <div
          className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200"
          style={{
            background: selected ? 'var(--accent-vivid)' : 'color-mix(in oklch, var(--on-surface) 8%, transparent)',
            boxShadow: selected ? '0 2px 8px color-mix(in oklch, var(--accent-vivid) 40%, transparent)' : 'none',
          }}
        >
          {selected ? (
            <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none">
              <path d="M2.5 7L5.5 10L11.5 4" stroke="var(--on-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none">
              <path d="M7 3v8M3 7h8" stroke="var(--faint)" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          )}
        </div>
      </div>
    </motion.button>
  );
}

function DiscountHint({ count }: { count: number }) {
  /* Two names for one orange, and the split is load-bearing:
   --accent       the instance that clears 4.5:1 as TEXT on the current band
   --accent-vivid the full-chroma instance, for FILLS, strokes and icons
   Setting type in --accent-vivid reaches only 2.73:1 on paper. Same hue, same
   Rule 1 — different lightness, because text and a filled chip are not the
   same contrast problem. */
const RED = 'var(--accent-vivid)';
const RED_TEXT = 'var(--accent)';
  const tiers = [
    { min: 3, pct: '10%' },
    { min: 5, pct: '20%' },
    { min: 8, pct: '30%' },
  ];
  const next = tiers.find((t) => count < t.min);

  return (
    <div
      className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-5 py-3.5 rounded-xl mb-8"
      style={{ background: 'var(--accent-wash)', border: `1px solid color-mix(in oklch, var(--accent-vivid) 19%, transparent)` }}
    >
      <div className="flex items-center gap-2">
        <span className="text-xl">💡</span>
        <span className="text-[13px] font-[600]" style={{ color: RED_TEXT }}>Bundle discounts:</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {tiers.map((t) => (
          <span
            key={t.min}
            className="text-[12px] font-[650] px-2.5 py-1 rounded-lg transition-all duration-200"
            style={{
              background: count >= t.min ? RED : 'color-mix(in oklch, var(--on-surface) 5%, transparent)',
              color: count >= t.min ? 'var(--on-accent)' : 'var(--muted)',
            }}
          >
            {t.min}+ services → {t.pct} off
          </span>
        ))}
      </div>
      {next && (
        <span className="text-[12px] text-[var(--muted)] ml-auto hidden sm:block">
          Pick {next.min - count} more for {next.pct} off
        </span>
      )}
      {!next && (
        <span className="text-[12px] font-[600] ml-auto hidden sm:block" style={{ color: RED_TEXT }}>
          🎉 Max discount unlocked!
        </span>
      )}
    </div>
  );
}

export default function PricingPage() {
  const RED = 'var(--accent-vivid)';
  const RED_TEXT = 'var(--accent)';
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const clear = () => setSelected(new Set());
  const count = selected.size;

  return (
    <>
      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section className="relative pt-36 pb-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full opacity-20 blur-[120px]"
            style={{ background: `radial-gradient(ellipse, ${RED} 0%, transparent 70%)` }}
          />
        </div>

        <div className="relative max-w-[760px] mx-auto px-6 md:px-10 text-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11.5px] font-[700] tracking-[0.06em] uppercase mb-6"
            style={{ background: 'var(--accent-wash)', color: RED_TEXT, border: '1px solid color-mix(in oklch, var(--accent-vivid) 15%, transparent)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: RED }} />
            Build your own bundle
          </div>

          <h1
            className="display-headline text-[clamp(2.5rem,5vw,4rem)] mb-5"
            style={{ color: 'var(--on-surface)' }}
          >
            Pay only for what
            <br />
            <span style={{ color: RED_TEXT }}>
              you actually need.
            </span>
          </h1>

          <p className="body-copy text-base text-[var(--muted)] max-w-[520px] mx-auto">
            Select the services below. Your custom price is calculated instantly — and the more you pick, the more you save.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-5 mt-8">
            {[
              { label: 'Monthly rolling contract', icon: '🔄' },
              { label: 'Cancel anytime', icon: '🚫' },
              { label: 'Dedicated Slack channel', icon: '💬' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-1.5 text-[12.5px] text-[var(--muted)] font-[500]">
                <span>{item.icon}</span>
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services Grid ─────────────────────────────────────────── */}
      <section className="pb-40">
        <div className="max-w-[1100px] mx-auto px-6 md:px-10">
          <DiscountHint count={count} />

          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[13px] font-[700] tracking-[0.06em] uppercase text-[var(--muted)]">
              {SERVICES.length} services available
            </h2>
            {count > 0 && (
              <button
                onClick={clear}
                className="text-[12.5px] font-[600] text-[var(--muted)] hover:text-[var(--on-surface)] transition-colors"
              >
                Clear selection ({count})
              </button>
            )}
          </div>

          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {SERVICES.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                selected={selected.has(service.id)}
                onToggle={toggle}
              />
            ))}
          </motion.div>

          {count === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mt-10 py-8 rounded-2xl"
              style={{ background: 'var(--surface)', border: '1px dashed var(--rule)' }}
            >
              <p className="text-[15px] font-[600] text-[var(--muted)] mb-1">
                👆 Click any service card to build your bundle
              </p>
              <p className="text-[13px] text-[var(--muted)]">Select 3+ services for a bundle discount</p>
            </motion.div>
          )}

          <div className="mt-12 text-center">
            <p className="text-[13.5px] text-[var(--muted)]">
              Need something custom?{' '}
              <Link
                href="https://calendar.notion.so/meet/nasrullah_tanim/schedule"
                target="_blank"
                rel="noopener noreferrer"
                className="font-[600] underline underline-offset-2 hover:text-[var(--on-surface)] transition-colors"
                style={{ color: 'var(--accent)' }}
              >
                Book a call for a custom quote →
              </Link>
            </p>
          </div>
        </div>
      </section>

      <PriceSummary selected={selected} services={SERVICES} onClear={clear} />
    </>
  );
}
