'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Dropdown Data ────────────────────────────────────────────────────────────
const productItems = [
  { group: 'AI', items: [
    { label: 'Notion AI', caption: 'AI tools for work', href: '/product/ai', color: '#64473A', bg: '#EEE0DA', icon: '🤖' },
    { label: 'Agents', caption: 'Automate busywork', href: '/product/agents', color: '#D9730D', bg: '#FDEFD4', icon: '⚡' },
    { label: 'AI Meeting Notes', caption: 'Perfectly written by AI', href: '/product/ai-meeting-notes', color: '#B90B0F', bg: '#FFE8E8', icon: '🎙️' },
    { label: 'Enterprise Search', caption: 'Find answers instantly', href: '/product/enterprise-search', color: '#9065B0', bg: '#F4EEFC', icon: '🔍' },
  ]},
  { group: 'Core', items: [
    { label: 'Knowledge Base', caption: 'Centralize your knowledge', href: '/product/wikis', color: '#37352F', bg: '#F1F1EF', icon: '📚' },
    { label: 'Docs', caption: 'Simple and powerful', href: '/solutions', color: '#0F8A8A', bg: '#D3EAE8', icon: '📄' },
    { label: 'Projects', caption: 'Manage any project', href: '/product/projects', color: '#CB912F', bg: '#FBF3DB', icon: '🎯' },
  ]},
  { group: 'More', items: [
    { label: 'Connections', caption: 'Connect your apps', href: '/connections', color: '#787774', bg: '#F1F1EF', icon: '🔗' },
    { label: 'Security', caption: 'Safe and scalable', href: '/security', color: '#787774', bg: '#F1F1EF', icon: '🔒' },
    { label: 'Calendar', caption: 'Manage your time', href: '/product/calendar', color: '#37352F', bg: '#F1F1EF', icon: '📅' },
  ]},
];

const solutionsItems = [
  { label: 'Docs', caption: 'Next-gen notes & docs', href: '/solutions', color: '#0F8A8A', bg: '#D3EAE8', icon: '📄' },
  { label: 'Engineering', caption: 'Build better, faster', href: '/solutions/engineering', color: '#2383E2', bg: '#E8F3FC', icon: '⚙️' },
  { label: 'Design', caption: 'Beautiful products', href: '/solutions/design', color: '#9065B0', bg: '#F4EEFC', icon: '🎨' },
  { label: 'Marketing', caption: 'Launch & grow', href: '/solutions/marketing', color: '#CB912F', bg: '#FBF3DB', icon: '📣' },
  { label: 'Operations', caption: 'Run the business', href: '/solutions/operations', color: '#D9730D', bg: '#FDEFD4', icon: '📊' },
  { label: 'HR & People', caption: 'Build great teams', href: '/solutions/hr', color: '#B90B0F', bg: '#FFE8E8', icon: '👥' },
];

const navLinks = [
  { label: 'Product', dropdown: 'product' },
  { label: 'Solutions', dropdown: 'solutions' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Download', href: '/download' },
];

// ─── Product Mega-Dropdown ────────────────────────────────────────────────────
function ProductDropdown() {
  return (
    <div className="p-4 min-w-[560px]">
      <div className="grid grid-cols-3 gap-2">
        {productItems.map((group) => (
          <div key={group.group} className="flex flex-col">
            <p className="text-[10px] font-[700] tracking-[0.1em] uppercase text-[#9B9A97] px-2 py-1 mb-1">
              {group.group}
            </p>
            {group.items.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-[#F7F6F3] transition-colors duration-150 group"
              >
                <span
                  className="w-8 h-8 rounded-[8px] flex items-center justify-center text-sm flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
                  style={{ background: item.bg }}
                >
                  {item.icon}
                </span>
                <span className="flex flex-col gap-px">
                  <span className="text-[13px] font-[560] text-[#191919] leading-tight">{item.label}</span>
                  <span className="text-[11px] text-[#9B9A97] leading-tight">{item.caption}</span>
                </span>
              </Link>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Solutions Dropdown ───────────────────────────────────────────────────────
function SolutionsDropdown() {
  return (
    <div className="p-4 min-w-[360px]">
      <div className="grid grid-cols-2 gap-1">
        {solutionsItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-[#F7F6F3] transition-colors duration-150 group"
          >
            <span
              className="w-8 h-8 rounded-[8px] flex items-center justify-center text-sm flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
              style={{ background: item.bg }}
            >
              {item.icon}
            </span>
            <span className="flex flex-col gap-px">
              <span className="text-[13px] font-[560] text-[#191919] leading-tight">{item.label}</span>
              <span className="text-[11px] text-[#9B9A97] leading-tight">{item.caption}</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ─── Main Navbar ──────────────────────────────────────────────────────────────
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [ctaState, setCtaState] = useState<'idle' | 'copied'>('idle');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ctaTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const open = (name: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(name);
  };
  const close = () => {
    timeoutRef.current = setTimeout(() => setActiveDropdown(null), 120);
  };
  const keep = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  // CTA interaction — click triggers "copied" state (like the Dribbble reference)
  const handleCtaClick = useCallback(() => {
    setCtaState('copied');
    if (ctaTimeoutRef.current) clearTimeout(ctaTimeoutRef.current);
    ctaTimeoutRef.current = setTimeout(() => setCtaState('idle'), 2000);
  }, []);

  return (
    <>
      {/* Spacer to push content below the floating navbar area */}
      <div className="h-[80px]" />

      {/* ── Floating Pill Navbar ─────────────────────────────────────────── */}
      <nav
        className="fixed top-4 left-1/2 z-[1000] -translate-x-1/2"
        style={{ width: 'auto' }}
      >
        <motion.div
          className="flex items-center gap-1 pl-2 pr-2 py-2"
          style={{
            background: '#7A0A0E',
            borderRadius: '9999px',
            boxShadow: scrolled
              ? '0 8px 40px rgba(122,10,14,0.35), 0 2px 8px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.08)'
              : '0 4px 24px rgba(122,10,14,0.25), 0 1px 4px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.08)',
          }}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* ── Logo Pill ──────────────────────────────────────────────── */}
          <Link
            href="/"
            className="flex items-center gap-1 h-[44px] px-4 rounded-full flex-shrink-0 transition-transform duration-200 hover:scale-[1.02]"
            style={{
              background: 'white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}
            aria-label="SlideIn Venture"
          >
            <span
              className="font-[800] text-[15px] leading-none select-none"
              style={{
                color: '#7A0A0E',
                fontFamily: "'Geist', system-ui, sans-serif",
                letterSpacing: '-0.03em',
              }}
            >
              SlideIn
            </span>
            <span
              className="font-[600] text-[15px] leading-none select-none"
              style={{
                color: '#7A0A0E',
                fontFamily: "'Geist', system-ui, sans-serif",
                letterSpacing: '-0.03em',
                opacity: 0.65,
              }}
            >
              Venture
            </span>
          </Link>

          {/* ── Desktop Nav Links ─────────────────────────────────────── */}
          <div className="hidden lg:flex items-center gap-0.5 px-3">
            {navLinks.map((link) => (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => link.dropdown && open(link.dropdown)}
                onMouseLeave={() => link.dropdown && close()}
              >
                {link.href ? (
                  <Link
                    href={link.href}
                    className="px-4 py-2 text-[15px] font-[500] text-white/85 rounded-full hover:text-white hover:bg-white/10 transition-all duration-150 whitespace-nowrap inline-flex items-center"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <button
                    className={`px-4 py-2 text-[15px] font-[500] rounded-full transition-all duration-150 whitespace-nowrap inline-flex items-center gap-1 ${
                      activeDropdown === link.dropdown
                        ? 'text-white bg-white/10'
                        : 'text-white/85 hover:text-white hover:bg-white/10'
                    }`}
                    aria-expanded={activeDropdown === link.dropdown}
                  >
                    {link.label}
                    <svg
                      className={`w-2.5 h-2.5 opacity-60 transition-transform duration-200 ${activeDropdown === link.dropdown ? 'rotate-180' : ''}`}
                      viewBox="0 0 10 6" fill="none"
                    >
                      <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                )}

                {/* Dropdown */}
                <AnimatePresence>
                  {link.dropdown && activeDropdown === link.dropdown && (
                    <motion.div
                      className="absolute top-[calc(100%+12px)] left-1/2 -translate-x-1/2 bg-white rounded-2xl overflow-hidden"
                      style={{
                        boxShadow: '0 12px 48px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)',
                      }}
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                      onMouseEnter={keep}
                      onMouseLeave={close}
                    >
                      {link.dropdown === 'product' ? <ProductDropdown /> : <SolutionsDropdown />}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* ── CTA Button (right side, white pill) ──────────────────── */}
          <div className="hidden lg:block">
            <Link
              href="/signup"
              onClick={(e) => {
                // If you want the copy interaction like the Dribbble ref, uncomment below:
                // e.preventDefault();
                // handleCtaClick();
              }}
              className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[14px] font-[600] transition-all duration-200 whitespace-nowrap overflow-hidden"
              style={{
                background: 'white',
                color: '#7A0A0E',
                boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                letterSpacing: '-0.01em',
              }}
            >
              <AnimatePresence mode="wait">
                {ctaState === 'idle' ? (
                  <motion.span
                    key="idle"
                    className="inline-flex items-center gap-1.5"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    Get started free
                  </motion.span>
                ) : (
                  <motion.span
                    key="copied"
                    className="inline-flex items-center gap-1.5"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <svg className="w-4 h-4 text-emerald-500" viewBox="0 0 20 20" fill="none">
                      <path d="M4 10l4 4 8-8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Signed up!
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          </div>

          {/* ── Mobile Hamburger ─────────────────────────────────────── */}
          <button
            className="lg:hidden flex items-center justify-center w-[44px] h-[44px] rounded-full transition-colors duration-150"
            style={{ background: mobileOpen ? 'rgba(255,255,255,0.15)' : 'transparent' }}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-[18px] flex flex-col gap-[4px]">
              <span
                className="block h-[2px] bg-white rounded-full origin-center transition-transform duration-200"
                style={{ transform: mobileOpen ? 'translateY(6px) rotate(45deg)' : 'none' }}
              />
              <span
                className="block h-[2px] bg-white rounded-full transition-opacity duration-200"
                style={{ opacity: mobileOpen ? 0 : 1 }}
              />
              <span
                className="block h-[2px] bg-white rounded-full origin-center transition-transform duration-200"
                style={{ transform: mobileOpen ? 'translateY(-6px) rotate(-45deg)' : 'none' }}
              />
            </div>
          </button>
        </motion.div>

        {/* ── Mobile Menu ──────────────────────────────────────────────── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              className="lg:hidden mt-2 overflow-hidden"
              style={{
                background: '#7A0A0E',
                borderRadius: '24px',
                boxShadow: '0 12px 48px rgba(122,10,14,0.35), 0 2px 8px rgba(0,0,0,0.15)',
              }}
              initial={{ opacity: 0, height: 0, scale: 0.95 }}
              animate={{ opacity: 1, height: 'auto', scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.95 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="px-4 py-4 flex flex-col gap-0.5 max-h-[calc(100vh-120px)] overflow-y-auto">
                {navLinks.map((link) => (
                  <div key={link.label}>
                    {link.href ? (
                      <Link
                        href={link.href}
                        className="block px-4 py-3 text-[15px] font-[500] text-white/85 rounded-2xl hover:text-white hover:bg-white/10 transition-colors"
                        onClick={() => setMobileOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <>
                        <p className="text-[10px] font-[700] tracking-[0.12em] uppercase text-white/40 px-4 pt-4 pb-1">
                          {link.label}
                        </p>
                        {(link.dropdown === 'product'
                          ? productItems.flatMap(g => g.items)
                          : solutionsItems
                        ).map((item) => (
                          <Link
                            key={item.label}
                            href={item.href}
                            className="flex items-center gap-3 px-4 py-2.5 rounded-2xl hover:bg-white/10 transition-colors"
                            onClick={() => setMobileOpen(false)}
                          >
                            <span
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                              style={{ background: 'rgba(255,255,255,0.15)' }}
                            >
                              {item.icon}
                            </span>
                            <span className="text-[14px] font-[450] text-white/90">{item.label}</span>
                          </Link>
                        ))}
                      </>
                    )}
                  </div>
                ))}

                {/* Mobile CTA */}
                <div className="pt-3 mt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                  <Link
                    href="/login"
                    className="block text-center py-3 text-[15px] font-[500] text-white/85 rounded-2xl hover:bg-white/10 transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    Log in
                  </Link>
                  <Link
                    href="/signup"
                    className="block text-center mt-1 py-3 text-[15px] font-[650] rounded-full transition-all duration-200"
                    style={{
                      background: 'white',
                      color: '#7A0A0E',
                    }}
                    onClick={() => setMobileOpen(false)}
                  >
                    Get started free
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
