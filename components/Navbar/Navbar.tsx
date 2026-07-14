'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

// ─── SlideIn Logo ──────────────────────────────────────────────────────────────
const SlideInLogo = () => (
  <div className="flex flex-col items-center justify-center">
    <span className="font-[800] text-[22px] leading-none text-white tracking-tight">
      SlideIn
    </span>
    <span className="font-[700] text-[9px] leading-none text-[#191919] tracking-[0.2em] mt-[3px] ml-[2px]">
      VENTURE
    </span>
  </div>
);

// ─── Dropdown Data ────────────────────────────────────────────────────────────
const productItems = [
  { group: 'AI', items: [
    { label: 'Notion AI', caption: 'AI tools for work', href: '/product/ai', color: '#64473A', bg: '#EEE0DA', icon: '🤖' },
    { label: 'Agents', caption: 'Automate busywork', href: '/product/agents', color: '#D9730D', bg: '#FDEFD4', icon: '⚡' },
    { label: 'AI Meeting Notes', caption: 'Perfectly written by AI', href: '/product/ai-meeting-notes', color: '#E03E3E', bg: '#FFE2E2', icon: '🎙️' },
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
  { label: 'HR & People', caption: 'Build great teams', href: '/solutions/hr', color: '#E03E3E', bg: '#FFE2E2', icon: '👥' },
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
    <div className="grid grid-cols-3 gap-1 p-3 min-w-[560px]">
      {productItems.map((group) => (
        <div key={group.group} className="flex flex-col">
          <p className="text-[10px] font-semibold tracking-[0.06em] uppercase text-[#9B9A97] px-2.5 py-1 mb-1">
            {group.group}
          </p>
          {group.items.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-[#F7F6F3] transition-colors duration-100 group"
            >
              <span
                className="w-8 h-8 rounded-[6px] flex items-center justify-center text-sm flex-shrink-0"
                style={{ background: item.bg, color: item.color }}
              >
                {item.icon}
              </span>
              <span className="flex flex-col gap-px">
                <span className="text-[13.5px] font-[500] text-[#191919] leading-tight">{item.label}</span>
                <span className="text-[11.5px] text-[#9B9A97] leading-tight">{item.caption}</span>
              </span>
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── Solutions Dropdown ───────────────────────────────────────────────────────
function SolutionsDropdown() {
  return (
    <div className="grid grid-cols-2 gap-1 p-3 min-w-[340px]">
      {solutionsItems.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-[#F7F6F3] transition-colors duration-100"
        >
          <span
            className="w-8 h-8 rounded-[6px] flex items-center justify-center text-sm flex-shrink-0"
            style={{ background: item.bg, color: item.color }}
          >
            {item.icon}
          </span>
          <span className="flex flex-col gap-px">
            <span className="text-[13.5px] font-[500] text-[#191919] leading-tight">{item.label}</span>
            <span className="text-[11.5px] text-[#9B9A97] leading-tight">{item.caption}</span>
          </span>
        </Link>
      ))}
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
    timeoutRef.current = setTimeout(() => setActiveDropdown(null), 100);
  };
  const keep = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  return (
    <>
      {/* ── Nav Bar ───────────────────────────────────────────────────── */}
      <nav className={`
        fixed top-0 left-0 right-0 z-[1000] h-14
        transition-all duration-200 ease-out
        ${scrolled
          ? 'bg-[#B90B0F]/95 backdrop-blur-xl shadow-[0_4px_16px_rgba(185,11,15,0.2)]'
          : 'bg-[#B90B0F] border-b border-transparent'
        }
      `}>
        <div className="max-w-[1200px] mx-auto px-5 md:px-10 h-full flex items-center gap-0">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 mr-6 flex-shrink-0 group" aria-label="SlideIn Venture">
            <SlideInLogo />
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-0.5 flex-1">
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
                    className="flex items-center gap-1 px-3 py-1.5 text-[14px] font-[500] text-white/90 rounded-[6px] hover:text-white hover:bg-white/10 transition-colors duration-100 tracking-[-0.01em]"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <button
                    className={`flex items-center gap-1 px-3 py-1.5 text-[14px] font-[500] text-white/90 rounded-[6px] transition-colors duration-100 tracking-[-0.01em] ${activeDropdown === link.dropdown ? 'bg-white/10 text-white' : 'hover:bg-white/10 hover:text-white'}`}
                    aria-expanded={activeDropdown === link.dropdown}
                  >
                    {link.label}
                    <svg
                      className={`w-2.5 h-2.5 opacity-70 transition-transform duration-200 ${activeDropdown === link.dropdown ? 'rotate-180' : ''}`}
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
                      className="absolute top-[calc(100%+6px)] left-0 bg-white border border-black/[0.07] rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.10),0_1px_4px_rgba(0,0,0,0.05)] z-50 overflow-hidden"
                      initial={{ opacity: 0, y: -6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.98 }}
                      transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
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

          {/* Actions */}
          <div className="hidden lg:flex items-center gap-2 ml-auto">
            <Link
              href="/login"
              className="px-3.5 py-1.5 text-[14px] font-[500] text-white/90 rounded-[6px] hover:text-white hover:bg-white/10 transition-colors duration-100 tracking-[-0.01em]"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-[13.5px] font-[600] text-[#B90B0F] bg-white rounded-[6px] hover:bg-white/95 transition-all duration-150 shadow-[0_1px_2px_rgba(0,0,0,0.1)] hover:shadow-[0_2px_8px_rgba(255,255,255,0.25)] hover:-translate-y-px tracking-[-0.01em]"
            >
              Get started free
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="lg:hidden ml-auto p-2 rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-5 flex flex-col gap-[5px]">
              <span className={`block h-[2px] bg-white rounded transition-transform duration-200 ${mobileOpen ? 'translate-y-[7px] rotate-45' : ''}`} />
              <span className={`block h-[2px] bg-white rounded transition-opacity duration-200 ${mobileOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-[2px] bg-white rounded transition-transform duration-200 ${mobileOpen ? '-translate-y-[7px] -rotate-45' : ''}`} />
            </div>
          </button>
        </div>
      </nav>

      {/* ── Mobile Menu ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="lg:hidden fixed top-14 left-0 right-0 z-[999] bg-white border-b border-[#E3E2E0] shadow-lg overflow-hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="px-5 py-4 flex flex-col gap-1 max-h-[calc(100vh-56px)] overflow-y-auto">
              {navLinks.map((link) => (
                <div key={link.label}>
                  {link.href ? (
                    <Link
                      href={link.href}
                      className="block px-3 py-2.5 text-[15px] font-[500] text-[#191919] rounded-lg hover:bg-[#F7F6F3] transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <>
                      <p className="text-[11px] font-[700] tracking-[0.07em] uppercase text-[#9B9A97] px-3 pt-4 pb-2">
                        {link.label}
                      </p>
                      {(link.dropdown === 'product'
                        ? productItems.flatMap(g => g.items)
                        : solutionsItems
                      ).map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#F7F6F3] transition-colors"
                          onClick={() => setMobileOpen(false)}
                        >
                          <span className="w-7 h-7 rounded-md flex items-center justify-center text-sm" style={{ background: item.bg }}>
                            {item.icon}
                          </span>
                          <span className="text-[14px] font-[450] text-[#37352F]">{item.label}</span>
                        </Link>
                      ))}
                    </>
                  )}
                </div>
              ))}

              <div className="flex flex-col gap-2 pt-4 mt-2 border-t border-[#E3E2E0]">
                <Link
                  href="/login"
                  className="flex items-center justify-center py-2.5 text-[15px] font-[500] text-[#37352F] border border-[#E3E2E0] rounded-lg hover:bg-[#F7F6F3] transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="flex items-center justify-center py-2.5 text-[15px] font-[600] text-white bg-[#191919] rounded-lg hover:bg-[#2d2d2d] transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Get started free
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
