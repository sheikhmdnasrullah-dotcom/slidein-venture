'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import LetsTalkButton from './LetsTalkButton';

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

const navLinks = [
  { label: 'Solutions', href: '/solutions' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Pricing', href: '/pricing' },
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

// ─── Main Navbar ──────────────────────────────────────────────────────────────
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
              <Link
                key={link.label}
                href={link.href}
                className="px-4 py-2 text-[15px] font-[500] text-white/85 rounded-full hover:text-white hover:bg-white/10 transition-all duration-150 whitespace-nowrap inline-flex items-center"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* ── CTA Button (right side, white pill) ──────────────────── */}
          <div className="hidden lg:block">
            <LetsTalkButton />
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
                  <Link
                    key={link.label}
                    href={link.href}
                    className="block px-4 py-3 text-[15px] font-[500] text-white/85 rounded-2xl hover:text-white hover:bg-white/10 transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
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
                    href="https://calendar.notion.so/meet/nasrullah_tanim/schedule"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center mt-1 py-3 text-[15px] font-[650] rounded-full transition-all duration-200"
                    style={{
                      background: 'white',
                      color: '#7A0A0E',
                    }}
                    onClick={() => setMobileOpen(false)}
                  >
                    Let&apos;s Talk
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
