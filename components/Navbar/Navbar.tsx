'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Notion Logo ──────────────────────────────────────────────────────────────
const NotionLogo = () => (
  <svg width="26" height="26" viewBox="0 0 33 34" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.8051 3.26755L20.5301 2.04319C22.5839 1.86808 23.1124 1.98538 24.4032 2.91756L29.7421 6.64773C30.623 7.28917 30.9165 7.46381 30.9165 8.16307V28.6217C30.9165 29.9038 30.4468 30.6622 28.804 30.7782L9.38138 31.9442C8.14825 32.0027 7.56135 31.8279 6.91556 31.0114L2.98395 25.9405C2.27947 25.0072 1.98651 24.3088 1.98651 23.4918V5.3068C1.98651 4.25826 2.45649 3.38366 3.8051 3.26755Z" fill="white"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M3.64643 1.29903L20.3723 0.0746037C22.5839 -0.0595444 24.141 0.353054 25.5578 1.31054L30.9002 5.04319C31.8354 5.71564 32.9031 7.45237 32.9031 8.16303V28.6217C32.9031 30.5442 31.967 31.4425 28.9448 32.7479L9.48857 33.916C8.01197 33.9383 6.41395 33.3586 5.35391 32.2318L1.40271 27.1359C0.55231 26.0092 0 24.8994 0 23.4918V5.30675C0 3.55089 1.51537 1.84231 3.6337 1.30013L3.64643 1.29903Z" fill="white"/>
    <path d="M20.5301 2.04318C22.5838 1.86808 23.1124 1.98541 24.4031 2.91757L29.7421 6.64778C30.623 7.28918 30.9167 7.46383 30.9167 8.16301V28.6217C30.9167 29.9039 30.4468 30.6622 28.804 30.7782L9.38127 31.944C8.14822 32.0025 7.56137 31.8279 6.9156 31.0114L2.98396 25.9405C2.27951 25.0072 1.98647 24.3088 1.98645 23.492V5.30687C1.98645 4.25835 2.45646 3.38365 3.80508 3.26754L20.5301 2.04318ZM28.9214 9.91165C28.9214 9.15462 28.6285 8.74625 27.9818 8.80449L8.91064 9.91165C8.20688 9.97045 7.9722 10.3204 7.9722 11.0779V28.4466C7.97222 29.3801 8.44147 29.7293 9.49759 29.6715L27.7471 28.6217C28.8037 28.5641 28.9214 27.922 28.9214 27.1636V9.91165ZM25.988 12.0096C26.1051 12.5347 25.988 13.0592 25.4588 13.1182L24.5795 13.2926V26.1151C23.816 26.5231 23.1122 26.7563 22.5256 26.7563C21.5863 26.7563 21.351 26.4646 20.6475 25.5908L14.8959 16.6149V25.2992L16.7158 25.7076C16.7158 25.7076 16.7159 26.7563 15.2475 26.7563L11.1994 26.9897C11.0818 26.7563 11.1995 26.1739 11.6101 26.0571L12.6664 25.7662V14.2837L11.1997 14.1668C11.0822 13.6417 11.3751 12.8847 12.1972 12.8259L16.5398 12.5349L22.5256 21.6277V13.5839L20.9993 13.4098C20.8821 12.7679 21.351 12.3018 21.9379 12.244L25.988 12.0096Z" fill="#37352F"/>
  </svg>
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
          ? 'bg-white/85 backdrop-blur-xl border-b border-black/[0.06] shadow-[0_1px_0_rgba(55,53,47,0.05),0_4px_16px_rgba(0,0,0,0.04)]'
          : 'bg-[#F7F6F3]/80 backdrop-blur-sm border-b border-transparent'
        }
      `}>
        <div className="max-w-[1200px] mx-auto px-5 md:px-10 h-full flex items-center gap-0">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 mr-6 flex-shrink-0 group" aria-label="SlideIn Venture">
            <NotionLogo />
            <span className="text-[15px] font-semibold text-[#191919] tracking-[-0.01em]">
              SlideIn Venture
            </span>
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
                    className="flex items-center gap-1 px-3 py-1.5 text-[14px] font-[450] text-[#37352F] rounded-[6px] hover:bg-black/[0.05] transition-colors duration-100 tracking-[-0.01em]"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <button
                    className={`flex items-center gap-1 px-3 py-1.5 text-[14px] font-[450] text-[#37352F] rounded-[6px] transition-colors duration-100 tracking-[-0.01em] ${activeDropdown === link.dropdown ? 'bg-black/[0.05]' : 'hover:bg-black/[0.05]'}`}
                    aria-expanded={activeDropdown === link.dropdown}
                  >
                    {link.label}
                    <svg
                      className={`w-2.5 h-2.5 text-[#9B9A97] transition-transform duration-200 ${activeDropdown === link.dropdown ? 'rotate-180' : ''}`}
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
              className="px-3.5 py-1.5 text-[14px] font-[450] text-[#37352F] rounded-[6px] hover:bg-black/[0.05] transition-colors duration-100 tracking-[-0.01em]"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-[13.5px] font-[550] text-white bg-[#191919] rounded-[6px] hover:bg-[#2d2d2d] transition-all duration-150 shadow-[0_1px_2px_rgba(0,0,0,0.20)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.25)] hover:-translate-y-px tracking-[-0.01em]"
            >
              Get started free
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="lg:hidden ml-auto p-2 rounded-lg hover:bg-black/[0.05] transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-5 flex flex-col gap-[5px]">
              <span className={`block h-[2px] bg-[#37352F] rounded transition-transform duration-200 ${mobileOpen ? 'translate-y-[7px] rotate-45' : ''}`} />
              <span className={`block h-[2px] bg-[#37352F] rounded transition-opacity duration-200 ${mobileOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-[2px] bg-[#37352F] rounded transition-transform duration-200 ${mobileOpen ? '-translate-y-[7px] -rotate-45' : ''}`} />
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
