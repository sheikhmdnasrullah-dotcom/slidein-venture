'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { jsPDF } from 'jspdf';

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
    color: '#FFFFFF',
    textColor: '#DC2626',
  },
  {
    id: 'long-form',
    icon: '🎥',
    title: 'Long-Form Video',
    subtitle: 'Editing',
    description: 'Full-length YouTube videos, podcasts, webinars — polished from raw footage.',
    price: 499,
    color: '#FFFFFF',
    textColor: '#DC2626',
  },
  {
    id: 'thumbnail',
    icon: '🖼️',
    title: 'Thumbnail Design',
    subtitle: 'Creative',
    description: 'Eye-catching, click-worthy thumbnails that drive CTR on every platform.',
    price: 149,
    color: '#FFFFFF',
    textColor: '#DC2626',
  },
  {
    id: 'scheduling',
    icon: '📅',
    title: 'Scheduling',
    subtitle: 'Operations',
    description: 'Strategic content calendar management — every post planned and queued.',
    price: 99,
    color: '#FFFFFF',
    textColor: '#DC2626',
  },
  {
    id: 'publishing',
    icon: '🚀',
    title: 'Publishing',
    subtitle: 'Distribution',
    description: 'Multi-platform publishing with optimized captions, tags, and timing.',
    price: 79,
    color: '#FFFFFF',
    textColor: '#DC2626',
  },
  {
    id: 'articles',
    icon: '✍️',
    title: 'Article Writing',
    subtitle: 'Content',
    description: 'SEO-optimized long-form articles, LinkedIn posts, and blog content.',
    price: 249,
    color: '#FFFFFF',
    textColor: '#DC2626',
  },
  {
    id: 'cold-email',
    icon: '📧',
    title: 'Cold Email',
    subtitle: 'Outreach',
    description: 'High-converting cold email sequences that land in the inbox, not spam.',
    price: 199,
    color: '#FFFFFF',
    textColor: '#DC2626',
  },
  {
    id: 'cold-outreach',
    icon: '🤝',
    title: 'Cold Outreach',
    subtitle: 'LinkedIn & DMs',
    description: 'LinkedIn + DM outreach campaigns that book qualified calls on autopilot.',
    price: 299,
    tag: 'High ROI',
    color: '#FFFFFF',
    textColor: '#DC2626',
  },
  {
    id: 'repurposing',
    icon: '♻️',
    title: 'Content Repurposing',
    subtitle: 'Strategy',
    description: 'Turn one piece of content into 10+ assets across every channel.',
    price: 179,
    color: '#FFFFFF',
    textColor: '#DC2626',
  },
  {
    id: 'analytics',
    icon: '📊',
    title: 'Analytics & Reporting',
    subtitle: 'Insights',
    description: 'Monthly performance reports with actionable growth recommendations.',
    price: 129,
    color: '#FFFFFF',
    textColor: '#DC2626',
  },
  {
    id: 'brand-strategy',
    icon: '🎯',
    title: 'Brand Strategy',
    subtitle: 'Identity',
    description: 'Positioning, messaging, and visual identity for founders who want to stand out.',
    price: 399,
    color: '#FFFFFF',
    textColor: '#DC2626',
  },
  {
    id: 'ghostwriting',
    icon: '👻',
    title: 'Ghostwriting',
    subtitle: 'Thought Leadership',
    description: 'Twitter/X threads, newsletters, and founder stories written in your voice.',
    price: 349,
    tag: 'Premium',
    color: '#FFFFFF',
    textColor: '#DC2626',
  },
];

function getDiscount(count: number): number {
  if (count >= 8) return 0.30;
  if (count >= 5) return 0.20;
  if (count >= 3) return 0.10;
  return 0;
}

// ─── PDF Generator ──────────────────────────────────────────────────────────
function generateQuotePdf(services: Service[], customerName: string): jsPDF {
  const doc = new jsPDF({ format: 'a4', unit: 'mm' });
  const pageW = 210;
  const margin = 20;
  const contentW = pageW - margin * 2;
  let y = margin;

  const count = services.length;
  const subtotal = services.reduce((s, sv) => s + sv.price, 0);
  const discount = getDiscount(count);
  const savings = Math.round(subtotal * discount);
  const total = subtotal - savings;

  // Accent bar at top
  doc.setFillColor(220, 38, 38);
  doc.rect(0, 0, pageW, 4, 'F');

  // Brand / Header
  doc.setTextColor(10, 10, 10);
  doc.setFontSize(26);
  doc.setFont('helvetica', 'bold');
  doc.text('SlideIn Venture', margin, y + 14);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120, 119, 116);
  doc.text('Content creation & growth services', margin, y + 22);

  // Separator
  doc.setDrawColor(220, 38, 38);
  doc.setLineWidth(0.5);
  doc.line(margin, y + 28, pageW - margin, y + 28);

  y = 42;

  // Customer name
  doc.setTextColor(10, 10, 10);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Quoted for:', margin, y);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120, 119, 116);
  doc.text(customerName || '—', margin + 30, y);
  y += 8;

  // Quote info
  doc.setTextColor(120, 119, 116);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, margin, y);
  y += 10;

  // Table header
  doc.setFillColor(245, 245, 245);
  doc.rect(margin, y - 5, contentW, 8, 'F');
  doc.setTextColor(10, 10, 10);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Service', margin + 3, y + 1);
  doc.text('Price/mo', margin + contentW - 25, y + 1, { align: 'right' });
  y += 10;

  // Table rows
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  services.forEach((sv, i) => {
    if (i % 2 === 0) {
      doc.setFillColor(250, 250, 250);
      doc.rect(margin, y - 4, contentW, 9, 'F');
    }
    doc.setTextColor(10, 10, 10);
    doc.text(sv.title, margin + 3, y + 1);
    doc.setTextColor(220, 38, 38);
    doc.setFont('helvetica', 'bold');
    doc.text(`$${sv.price}`, margin + contentW - 25, y + 1, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    y += 9;
  });

  // Separator
  y += 4;
  doc.setDrawColor(220, 38, 38);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageW - margin, y);

  y += 8;

  // Discount
  if (discount > 0) {
    doc.setTextColor(120, 119, 116);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Subtotal', margin, y);
    doc.setTextColor(120, 119, 116);
    doc.setFont('helvetica', 'normal');
    doc.text(`$${subtotal.toLocaleString()}`, margin + contentW - 25, y, { align: 'right' });
    y += 7;

    doc.setTextColor(220, 38, 38);
    doc.setFont('helvetica', 'normal');
    doc.text(`Bundle discount (${Math.round(discount * 100)}% off)`, margin, y);
    doc.setTextColor(220, 38, 38);
    doc.setFont('helvetica', 'normal');
    doc.text(`-$${savings.toLocaleString()}`, margin + contentW - 25, y, { align: 'right' });
    y += 7;
  }

  // Total
  doc.setFillColor(10, 10, 10);
  doc.rect(margin, y - 4, contentW, 10, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Total (per month)', margin + 3, y + 2);
  doc.text(`$${total.toLocaleString()}`, margin + contentW - 3, y + 2, { align: 'right' });

  y += 20;

  // Footer
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(155, 154, 151);
  doc.text('SlideIn Venture — Content Creation & Growth', margin, 285);
  doc.text(`Generated ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, margin, 290);

  return doc;
}

// ─── PriceSummary (bottom bar) ──────────────────────────────────────────────
function PriceSummary({
  selected,
  services,
  onClear,
  onBookCall,
  sending,
}: {
  selected: Set<string>;
  services: Service[];
  onClear: () => void;
  onBookCall: () => void;
  sending: boolean;
}) {
  const count = selected.size;
  const subtotal = [...selected].reduce((sum, id) => {
    const s = services.find((s) => s.id === id);
    return sum + (s?.price ?? 0);
  }, 0);
  const discount = getDiscount(count);
  const savings = Math.round(subtotal * discount);
  const total = subtotal - savings;

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
            background: 'rgba(10,10,10,0.97)',
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div className="max-w-[1100px] mx-auto px-6 md:px-10 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[13px] font-[800]"
                style={{ background: '#DC2626', color: '#FFF' }}
              >
                {count}
              </div>
              <div>
                <p className="text-[13px] font-[600] text-white leading-tight">
                  {count} service{count !== 1 ? 's' : ''} selected
                </p>
                {discount > 0 && (
                  <p className="text-[11.5px] font-[500]" style={{ color: '#DC2626' }}>
                    🎉 {Math.round(discount * 100)}% bundle discount applied — saving ${savings}
                  </p>
                )}
              </div>
            </div>

            <div className="hidden md:flex items-center gap-5 text-center">
              {discount > 0 && (
                <div>
                  <p className="text-[11px] text-[#787774] uppercase tracking-[0.06em] font-[600]">Subtotal</p>
                  <p className="text-[15px] font-[700] text-[#9B9A97] line-through">${subtotal.toLocaleString()}</p>
                </div>
              )}
              <div>
                <p className="text-[11px] text-[#787774] uppercase tracking-[0.06em] font-[600]">Total / mo</p>
                <p className="text-[22px] font-[800] text-white">${total.toLocaleString()}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onClear}
                className="text-[13px] text-[#787774] hover:text-white transition-colors px-3 py-2"
              >
                Clear all
              </button>
              <button
                onClick={onBookCall}
                disabled={sending}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-[14px] font-[700] transition-all duration-200 hover:-translate-y-px hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: '#DC2626', color: '#FFF' }}
              >
                {sending ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.3"/>
                      <path d="M12 2a10 10 0 019.95 9" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                    </svg>
                    Generating...
                  </span>
                ) : (
                  <>
                    Book a Call
                    <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none">
                      <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="sm:hidden border-t border-white/5 px-6 py-3 flex items-center justify-between">
            <span className="text-[12px] text-[#787774]">
              {discount > 0 ? <span className="line-through mr-2">${subtotal}</span> : null}
              Total/mo
            </span>
            <span className="text-[20px] font-[800] text-white">${total.toLocaleString()}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── ServiceCard ────────────────────────────────────────────────────────────
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
        background: '#FFFFFF',
        border: selected ? '2px solid #DC2626' : '1px solid #E5E5E5',
        boxShadow: selected
          ? '0 0 0 4px rgba(220,38,38,0.08), 0 8px 24px rgba(0,0,0,0.06)'
          : '0 1px 4px rgba(0,0,0,0.04)',
      }}
    >
      {service.tag && (
        <span
          className="absolute top-4 right-4 text-[10px] font-[700] tracking-[0.06em] uppercase px-2 py-0.5 rounded-full"
          style={{
            background: selected ? '#DC2626' : '#F5F5F5',
            color: selected ? '#FFF' : '#0A0A0A',
          }}
        >
          {service.tag}
        </span>
      )}

      <div className="text-3xl mb-3 leading-none">{service.icon}</div>

      <p
        className="text-[13px] font-[600] tracking-[0.04em] uppercase mb-0.5"
        style={{ color: selected ? '#DC2626' : '#9B9A97', opacity: 0.7 }}
      >
        {service.subtitle}
      </p>
      <h3
        className="text-[17px] font-[750] leading-tight tracking-[-0.02em] mb-2"
        style={{ color: '#0A0A0A' }}
      >
        {service.title}
      </h3>
      <p
        className="text-[13px] leading-[1.55]"
        style={{ color: '#78716C' }}
      >
        {service.description}
      </p>

      <div
        className="flex items-end justify-between mt-4 pt-4"
        style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}
      >
        <div>
          <span
            className="text-[24px] font-[800] tracking-[-0.03em]"
            style={{ color: selected ? '#DC2626' : '#0A0A0A' }}
          >
            ${service.price}
          </span>
          <span
            className="text-[12px] font-[500] ml-1"
            style={{ color: '#9B9A97' }}
          >
            /mo
          </span>
        </div>

        <div
          className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200"
          style={{
            background: selected ? '#DC2626' : 'rgba(0,0,0,0.08)',
            boxShadow: selected ? '0 2px 8px rgba(220,38,38,0.4)' : 'none',
          }}
        >
          {selected ? (
            <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none">
              <path d="M2.5 7L5.5 10L11.5 4" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none">
              <path d="M7 3v8M3 7h8" stroke="#9B9A97" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          )}
        </div>
      </div>
    </motion.button>
  );
}

// ─── DiscountHint ───────────────────────────────────────────────────────────
function DiscountHint({ count }: { count: number }) {
  const tiers = [
    { min: 3, pct: '10%' },
    { min: 5, pct: '20%' },
    { min: 8, pct: '30%' },
  ];
  const next = tiers.find((t) => count < t.min);

  return (
    <div
      className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-5 py-3.5 rounded-xl mb-8"
      style={{ background: '#FFFFFF', border: '1px solid #E5E5E5' }}
    >
      <div className="flex items-center gap-2">
        <span className="text-xl">💡</span>
        <span className="text-[13px] font-[600] text-[#0A0A0A]">Bundle discounts:</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {tiers.map((t) => (
          <span
            key={t.min}
            className="text-[12px] font-[650] px-2.5 py-1 rounded-lg transition-all duration-200"
            style={{
              background: count >= t.min ? '#DC2626' : 'rgba(0,0,0,0.05)',
              color: count >= t.min ? '#FFF' : '#0A0A0A',
            }}
          >
            {t.min}+ services → {t.pct} off
          </span>
        ))}
      </div>
      {next && (
        <span className="text-[12px] text-[#DC2626] ml-auto hidden sm:block">
          Pick {next.min - count} more for {next.pct} off
        </span>
      )}
      {!next && (
        <span className="text-[12px] font-[600] text-[#DC2626] ml-auto hidden sm:block">
          🎉 Max discount unlocked!
        </span>
      )}
    </div>
  );
}

// ─── Name Modal ─────────────────────────────────────────────────────────────
function NameModal({
  open,
  onClose,
  onConfirm,
  sending,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: (name: string) => void;
  sending: boolean;
}) {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onConfirm(name.trim());
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-6"
            onClick={(e) => e.target === e.currentTarget && onClose()}
          >
            <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[17px] font-[800] text-[#0A0A0A]">Almost there!</h2>
                <button
                  onClick={onClose}
                  className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[#F5F5F5] transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                    <path d="M4 4l8 8M12 4l-8 8" stroke="#9B9A97" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>

              <p className="text-[13px] text-[#78716C] mb-6 leading-[1.6]">
                Just let us know your name so we can prepare for our call.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-[12px] font-[600] text-[#787774] uppercase tracking-[0.04em] mb-1.5 block">
                    Your full name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. John Doe"
                    required
                    autoFocus
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E5E5E5] text-[14px] text-[#0A0A0A] placeholder:text-[#C4BDB6] focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626] transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full py-3 rounded-xl text-[14px] font-[700] transition-all duration-200 hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: '#DC2626', color: '#FFF' }}
                >
                  {sending ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.3"/>
                        <path d="M12 2a10 10 0 019.95 9" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                      </svg>
                      Generating...
                    </span>
                  ) : (
                    'Get Quote & Book a Call'
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────
export default function PricingPage() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showNameModal, setShowNameModal] = useState(false);
  const [sending, setSending] = useState(false);

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

  const selectedServices = SERVICES.filter((s) => selected.has(s.id));

  const handleBookCall = useCallback(async (name: string) => {
    if (selectedServices.length === 0) return;
    setSending(true);

    try {
      // 1. Generate PDF with customer name
      const doc = generateQuotePdf(selectedServices, name);
      const pdfBase64 = doc.output('datauristring').split(',')[1];

      // 2. Auto-download PDF for the user
      doc.save(`SlideIn-Venture-Quote-${Date.now()}.pdf`);

      // 3. Send email to me with the PDF + customer name
      const count = selectedServices.length;
      const subtotal = selectedServices.reduce((s, sv) => s + sv.price, 0);
      const discount = getDiscount(count);
      const total = subtotal - Math.round(subtotal * discount);

      await fetch('/api/send-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pdfBase64,
          customerName: name,
          services: selectedServices,
          total,
          discount,
        }),
      });

      // 4. Close modal
      setShowNameModal(false);

      // 5. Open calendar booking link
      window.open('https://calendar.notion.so/meet/nasrullah_tanim/schedule', '_blank');
    } catch (err) {
      console.error('Quote error:', err);
      setShowNameModal(false);
      window.open('https://calendar.notion.so/meet/nasrullah_tanim/schedule', '_blank');
    } finally {
      setSending(false);
    }
  }, [selectedServices]);

  return (
    <>
      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section className="relative pt-36 pb-16 overflow-hidden" style={{ background: '#FAFAF8' }}>
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full opacity-20 blur-[120px]"
            style={{ background: 'radial-gradient(ellipse, rgba(220,38,38,0.15) 0%, transparent 70%)' }}
          />
        </div>

        <div className="relative max-w-[760px] mx-auto px-6 md:px-10 text-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11.5px] font-[700] tracking-[0.06em] uppercase mb-6"
            style={{ background: '#F5F5F5', color: '#0A0A0A', border: '1px solid #E5E5E5' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626]" />
            Build your own bundle
          </div>

          <h1
            className="text-[clamp(2.5rem,5vw,4rem)] font-[900] leading-[1.0] tracking-[-0.04em] mb-5"
            style={{ color: '#0A0A0A' }}
          >
            Pay only for what
            <br />
            <span
              style={{
                background: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 60%, #7F1D1D 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              you actually need.
            </span>
          </h1>

          <p className="text-[17px] text-[#78716C] max-w-[520px] mx-auto leading-[1.7]">
            Select the services below. Your custom price is calculated instantly — and the more you pick, the more you save.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-5 mt-8">
            {[
              { label: 'Monthly rolling contract', icon: '🔄' },
              { label: 'Cancel anytime', icon: '🚫' },
              { label: 'Dedicated Slack channel', icon: '💬' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-1.5 text-[12.5px] text-[#9B9A97] font-[500]">
                <span>{item.icon}</span>
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services Grid ─────────────────────────────────────────── */}
      <section className="pb-40" style={{ background: '#FAFAF8' }}>
        <div className="max-w-[1100px] mx-auto px-6 md:px-10">
          <DiscountHint count={count} />

          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[13px] font-[700] tracking-[0.06em] uppercase text-[#9B9A97]">
              {SERVICES.length} services available
            </h2>
            {count > 0 && (
              <button
                onClick={clear}
                className="text-[12.5px] font-[600] text-[#9B9A97] hover:text-[#0A0A0A] transition-colors"
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
              style={{ background: '#F5F4F1', border: '1px dashed #D6D3CD' }}
            >
              <p className="text-[15px] font-[600] text-[#9B9A97] mb-1">
                👆 Click any service card to build your bundle
              </p>
              <p className="text-[13px] text-[#C4BDB6]">Select 3+ services for a bundle discount</p>
            </motion.div>
          )}

          <div className="mt-12 text-center">
            <p className="text-[13.5px] text-[#9B9A97]">
              Need something custom?{' '}
              <Link
                href="https://calendar.notion.so/meet/nasrullah_tanim/schedule"
                target="_blank"
                rel="noopener noreferrer"
                className="font-[600] underline underline-offset-2 transition-colors"
                style={{ color: '#DC2626' }}
              >
                Book a call for a custom quote →
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* ── Name Modal ──────────────────────────────────────────── */}
      <NameModal
        open={showNameModal}
        onClose={() => setShowNameModal(false)}
        onConfirm={handleBookCall}
        sending={sending}
      />

      {/* ── Bottom Bar ───────────────────────────────────────────── */}
      <PriceSummary
        selected={selected}
        services={SERVICES}
        onClear={clear}
        onBookCall={() => {
          if (selected.size > 0) {
            setShowNameModal(true);
          }
        }}
        sending={sending}
      />
    </>
  );
}