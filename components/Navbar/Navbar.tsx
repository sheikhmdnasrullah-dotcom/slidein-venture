'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Brand Red Palette ────────────────────────────────────────────────────────
const RED = '#B90B0F';
const RED_DARK = '#8E0810';
const RED_GLOW = 'rgba(185,11,15,0.35)';

// ─── SlideIn Logo ─────────────────────────────────────────────────────────────
const SlideInLogo = () => (
  <div className="flex items-center gap-2">
    {/* Icon mark */}
    <div
      className="relative w-8 h-8 rounded-[8px] flex items-center justify-center overflow-hidden flex-shrink-0"
      style={{
        background: 'white',
        boxShadow: '0 0 0 1px rgba(255,255,255,0.15), 0 2px 8px rgba(0,0,0,0.25)',
      }}
    >
      {/* Diagonal slide accent */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${RED} 0%, ${RED_DARK} 100%)`,
          clipPath: 'polygon(0 0, 60% 0, 100% 100%, 40% 100%)',
          opacity: 0.15,
        }}
      />
      <span
        className="relative font-black text-[15px] leading-none"
        style={{ color: RED, fontFamily: "'Geist', sans-serif", letterSpacing: '-0.04em' }}
      >
        S
      </span>
    </div>

    {/* Wordmark */}
    <div className="flex flex-col leading-none">
      <span
        className="font-black text-[16px] text-white tracking-[-0.04em] leading-none"
        style={{ fontFamily: "'Geist', sans-serif" }}
      >
        SlideIn
      </span>
      <span
        className="text-[8.5px] font-bold tracking-[0.22em] uppercase leading-none mt-[3px]"
        style={{ color: 'rgba(255,255,255,0.55)' }}
      >
        Venture
      </span>
    </div>
  </div>
);

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
    <div className="p-4 min-w-[580px]">
      {/* Red accent top bar */}
      <div
        className="h-[3px] w-10 rounded-full mb-4"
        style={{ background: `linear-gradient(90deg, ${RED}, transparent)` }}
      />
      <div className="grid grid-cols-3 gap-2">
        {productItems.map((group) => (
          <div key={group.group} className="flex flex-col">
            <p
              className="text-[9.5px] font-[700] tracking-[0.1em] uppercase mb-2 px-1"
              style={{ color: RED, opacity: 0.7 }}
            >
              {group.group}
            </p>
            {group.items.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-2.5 px-2 py-2 rounded-lg transition-all duration-150 group"
                style={{}}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = '#FDF2F2';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                }}
              >
                <span
                  className="w-8 h-8 rounded-[7px] flex items-center justify-center text-sm flex-shrink-0 transition-transform duration-150 group-hover:scale-110"
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
      {/* Bottom CTA */}
      <div
        className="mt-4 pt-3 flex items-center justify-between"
        style={{ borderTop: '1px solid rgba(185,11,15,0.1)' }}
      >
        <span className="text-[11.5px] text-[#9B9A97]">Explore all features →</span>
        <Link
          href="/product"
          className="text-[11.5px] font-[600] px-3 py-1 rounded-md transition-all duration-150"
          style={{ color: RED, background: '#FFF0F0' }}
        >
          View all products
        </Link>
      </div>
    </div>
  );
}

// ─── Solutions Dropdown ───────────────────────────────────────────────────────
function SolutionsDropdown() {
  return (
    <div className="p-4 min-w-[360px]">
      <div
        className="h-[3px] w-10 rounded-full mb-4"
        style={{ background: `linear-gradient(90deg, ${RED}, transparent)` }}
      />
      <div className="grid grid-cols-2 gap-1">
        {solutionsItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center gap-2.5 px-2 py-2 rounded-lg transition-all duration-150 group"
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = '#FDF2F2';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = 'transparent';
            }}
          >
            <span
              className="w-8 h-8 rounded-[7px] flex items-center justify-center text-sm flex-shrink-0 transition-transform duration-150 group-hover:scale-110"
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
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
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
      <style>{`
        @keyframes navSlideDown {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .nav-animate { animation: navSlideDown 0.3s cubic-bezier(0.16,1,0.3,1) both; }

        .nav-link-pill {
          position: relative;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          color: rgba(255,255,255,0.82);
          transition: color 0.15s, background 0.15s;
          letter-spacing: -0.01em;
          cursor: pointer;
          background: transparent;
          border: none;
          display: flex;
          align-items: center;
          gap: 4px;
          white-space: nowrap;
        }
        .nav-link-pill:hover,
        .nav-link-pill.active {
          color: #fff;
          background: rgba(255,255,255,0.12);
        }
        .nav-link-pill::after {
          content: '';
          position: absolute;
          bottom: 4px;
          left: 50%;
          transform: translateX(-50%) scaleX(0);
          width: calc(100% - 24px);
          height: 1.5px;
          border-radius: 9999px;
          background: rgba(255,255,255,0.7);
          transition: transform 0.2s cubic-bezier(0.16,1,0.3,1);
        }
        .nav-link-pill:hover::after,
        .nav-link-pill.active::after {
          transform: translateX(-50%) scaleX(1);
        }

        .caret-icon {
          width: 8px;
          height: 5px;
          transition: transform 0.2s;
        }
        .caret-icon.open {
          transform: rotate(180deg);
        }

        /* Shimmer on the navbar border */
        @keyframes shimmerBorder {
          0%   { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .navbar-shimmer-border::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg,
            transparent 0%,
            rgba(255,255,255,0.18) 30%,
            rgba(255,255,255,0.45) 50%,
            rgba(255,255,255,0.18) 70%,
            transparent 100%
          );
          background-size: 200% 100%;
          animation: shimmerBorder 3s linear infinite;
        }
      `}</style>

      {/* ── Nav Bar ──────────────────────────────────────────────────────── */}
      <nav
        className={`navbar-shimmer-border fixed top-0 left-0 right-0 z-[1000] h-[60px] relative transition-all duration-300`}
        style={{
          background: scrolled
            ? `linear-gradient(90deg, ${RED_DARK} 0%, ${RED} 50%, ${RED_DARK} 100%)`
            : `linear-gradient(90deg, ${RED_DARK} 0%, ${RED} 50%, ${RED_DARK} 100%)`,
          boxShadow: scrolled
            ? `0 4px 24px ${RED_GLOW}, 0 1px 0 rgba(255,255,255,0.08) inset`
            : `0 2px 12px ${RED_GLOW}`,
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
        }}
      >
        {/* Subtle noise texture overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
            opacity: 0.4,
          }}
        />

        <div className="relative max-w-[1240px] mx-auto px-5 md:px-8 h-full flex items-center gap-0">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center mr-6 flex-shrink-0 transition-opacity duration-150 hover:opacity-90"
            aria-label="SlideIn Venture"
          >
            <SlideInLogo />
          </Link>

          {/* Divider */}
          <div
            className="hidden lg:block w-px h-5 mr-5 flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.18)' }}
          />

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-0.5 flex-1">
            {navLinks.map((link) => (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => { link.dropdown && open(link.dropdown); setHoveredLink(link.label); }}
                onMouseLeave={() => { link.dropdown && close(); setHoveredLink(null); }}
              >
                {link.href ? (
                  <Link
                    href={link.href}
                    className={`nav-link-pill ${hoveredLink === link.label ? 'active' : ''}`}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <button
                    className={`nav-link-pill ${activeDropdown === link.dropdown ? 'active' : ''}`}
                    aria-expanded={activeDropdown === link.dropdown}
                  >
                    {link.label}
                    <svg
                      className={`caret-icon ${activeDropdown === link.dropdown ? 'open' : ''}`}
                      viewBox="0 0 8 5" fill="none"
                    >
                      <path d="M1 1L4 4L7 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                )}

                {/* Dropdown panel */}
                <AnimatePresence>
                  {link.dropdown && activeDropdown === link.dropdown && (
                    <motion.div
                      className="absolute top-[calc(100%+10px)] left-0 bg-white rounded-2xl overflow-hidden"
                      style={{
                        border: `1px solid rgba(185,11,15,0.12)`,
                        boxShadow: `0 8px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(185,11,15,0.08), 0 0 0 1px rgba(0,0,0,0.04)`,
                      }}
                      initial={{ opacity: 0, y: -8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.97 }}
                      transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                      onMouseEnter={keep}
                      onMouseLeave={close}
                    >
                      {/* Top red accent stripe */}
                      <div
                        className="h-[2px] w-full"
                        style={{ background: `linear-gradient(90deg, ${RED} 0%, transparent 60%)` }}
                      />
                      {link.dropdown === 'product' ? <ProductDropdown /> : <SolutionsDropdown />}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden lg:flex items-center gap-2 ml-auto">
            {/* Log in */}
            <Link
              href="/login"
              className="nav-link-pill"
            >
              Log in
            </Link>

            {/* Get started CTA */}
            <Link
              href="/signup"
              className="group relative inline-flex items-center gap-1.5 px-5 py-2 rounded-[8px] font-[650] text-[13.5px] overflow-hidden transition-all duration-200"
              style={{
                color: RED,
                background: 'white',
                boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 0 0 1px rgba(255,255,255,0.6)',
                letterSpacing: '-0.01em',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
                (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 16px ${RED_GLOW}, 0 1px 3px rgba(0,0,0,0.12)`;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.12), 0 0 0 1px rgba(255,255,255,0.6)';
              }}
            >
              {/* Shimmer shine */}
              <span
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.5) 50%, transparent 70%)',
                  backgroundSize: '200% 100%',
                }}
              />
              <span className="relative">Get started free</span>
              <svg className="relative w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" viewBox="0 0 14 14" fill="none">
                <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="lg:hidden ml-auto p-2 rounded-lg transition-colors duration-150"
            style={{ background: mobileOpen ? 'rgba(255,255,255,0.15)' : 'transparent' }}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-5 flex flex-col gap-[5px]">
              <span
                className="block h-[2px] bg-white rounded-full"
                style={{
                  transition: 'transform 0.2s, opacity 0.2s',
                  transform: mobileOpen ? 'translateY(7px) rotate(45deg)' : 'none',
                }}
              />
              <span
                className="block h-[2px] bg-white rounded-full"
                style={{
                  transition: 'opacity 0.2s',
                  opacity: mobileOpen ? 0 : 1,
                }}
              />
              <span
                className="block h-[2px] bg-white rounded-full"
                style={{
                  transition: 'transform 0.2s, opacity 0.2s',
                  transform: mobileOpen ? 'translateY(-7px) rotate(-45deg)' : 'none',
                }}
              />
            </div>
          </button>
        </div>
      </nav>

      {/* ── Mobile Menu ────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="lg:hidden fixed top-[60px] left-0 right-0 z-[999] overflow-hidden"
            style={{
              background: 'white',
              borderBottom: `2px solid ${RED}`,
              boxShadow: `0 12px 40px rgba(0,0,0,0.12), 0 4px 8px ${RED_GLOW}`,
            }}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Red top stripe */}
            <div className="h-[3px]" style={{ background: `linear-gradient(90deg, ${RED} 0%, ${RED_DARK} 100%)` }} />

            <div className="px-5 py-4 flex flex-col gap-1 max-h-[calc(100vh-60px)] overflow-y-auto">
              {navLinks.map((link) => (
                <div key={link.label}>
                  {link.href ? (
                    <Link
                      href={link.href}
                      className="block px-3 py-2.5 text-[15px] font-[500] text-[#191919] rounded-xl transition-all duration-150"
                      style={{ letterSpacing: '-0.01em' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#FDF2F2'; (e.currentTarget as HTMLElement).style.color = RED; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#191919'; }}
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <>
                      <div
                        className="flex items-center gap-1.5 px-3 pt-4 pb-2"
                      >
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: RED }} />
                        <p className="text-[10.5px] font-[700] tracking-[0.1em] uppercase" style={{ color: RED }}>
                          {link.label}
                        </p>
                      </div>
                      {(link.dropdown === 'product'
                        ? productItems.flatMap(g => g.items)
                        : solutionsItems
                      ).map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          className="flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-150"
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#FDF2F2'; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                          onClick={() => setMobileOpen(false)}
                        >
                          <span
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                            style={{ background: item.bg }}
                          >
                            {item.icon}
                          </span>
                          <span className="text-[13.5px] font-[470] text-[#37352F]">{item.label}</span>
                        </Link>
                      ))}
                    </>
                  )}
                </div>
              ))}

              {/* Mobile CTA buttons */}
              <div
                className="flex flex-col gap-2 pt-4 mt-2"
                style={{ borderTop: `1px solid rgba(185,11,15,0.12)` }}
              >
                <Link
                  href="/login"
                  className="flex items-center justify-center py-2.5 text-[15px] font-[500] rounded-xl transition-all duration-150"
                  style={{
                    color: RED,
                    border: `1.5px solid rgba(185,11,15,0.25)`,
                    background: '#FFF5F5',
                  }}
                  onClick={() => setMobileOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="flex items-center justify-center gap-2 py-2.5 text-[15px] font-[650] text-white rounded-xl transition-all duration-150"
                  style={{ background: `linear-gradient(135deg, ${RED} 0%, ${RED_DARK} 100%)` }}
                  onClick={() => setMobileOpen(false)}
                >
                  Get started free
                  <svg className="w-4 h-4" viewBox="0 0 14 14" fill="none">
                    <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
