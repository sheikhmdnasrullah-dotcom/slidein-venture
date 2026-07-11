import Link from 'next/link';

const footerLinks = {
  Product: [
    { label: 'AI', href: '/product/ai' },
    { label: 'Agents', href: '/product/agents' },
    { label: 'Docs', href: '/solutions' },
    { label: 'Projects', href: '/product/projects' },
    { label: 'Knowledge Base', href: '/product/wikis' },
    { label: 'Calendar', href: '/product/calendar' },
  ],
  Solutions: [
    { label: 'Engineering', href: '/solutions/engineering' },
    { label: 'Design', href: '/solutions/design' },
    { label: 'Marketing', href: '/solutions/marketing' },
    { label: 'Operations', href: '/solutions/operations' },
    { label: 'HR & People', href: '/solutions/hr' },
    { label: 'Enterprise', href: '/enterprise' },
  ],
  Resources: [
    { label: 'Blog', href: '/blog' },
    { label: 'Templates', href: '/templates' },
    { label: 'Help Center', href: '/help' },
    { label: 'Community', href: '/community' },
    { label: 'Changelog', href: '/releases' },
    { label: 'Download', href: '/download' },
  ],
  Company: [
    { label: 'About', href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Security', href: '/security' },
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
  ],
};

const NotionLogoSm = () => (
  <svg width="22" height="22" viewBox="0 0 33 34" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.5301 2.04318C22.5838 1.86808 23.1124 1.98541 24.4031 2.91757L29.7421 6.64778C30.623 7.28918 30.9167 7.46383 30.9167 8.16301V28.6217C30.9167 29.9039 30.4468 30.6622 28.804 30.7782L9.38127 31.944C8.14822 32.0025 7.56137 31.8279 6.9156 31.0114L2.98396 25.9405C2.27951 25.0072 1.98647 24.3088 1.98645 23.492V5.30687C1.98645 4.25835 2.45646 3.38365 3.80508 3.26754L20.5301 2.04318ZM28.9214 9.91165C28.9214 9.15462 28.6285 8.74625 27.9818 8.80449L8.91064 9.91165C8.20688 9.97045 7.9722 10.3204 7.9722 11.0779V28.4466C7.97222 29.3801 8.44147 29.7293 9.49759 29.6715L27.7471 28.6217C28.8037 28.5641 28.9214 27.922 28.9214 27.1636V9.91165ZM25.988 12.0096C26.1051 12.5347 25.988 13.0592 25.4588 13.1182L24.5795 13.2926V26.1151C23.816 26.5231 23.1122 26.7563 22.5256 26.7563C21.5863 26.7563 21.351 26.4646 20.6475 25.5908L14.8959 16.6149V25.2992L16.7158 25.7076C16.7158 25.7076 16.7159 26.7563 15.2475 26.7563L11.1994 26.9897C11.0818 26.7563 11.1995 26.1739 11.6101 26.0571L12.6664 25.7662V14.2837L11.1997 14.1668C11.0822 13.6417 11.3751 12.8847 12.1972 12.8259L16.5398 12.5349L22.5256 21.6277V13.5839L20.9993 13.4098C20.8821 12.7679 21.351 12.3018 21.9379 12.244L25.988 12.0096Z" fill="#37352F"/>
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-[#F7F6F3] border-t border-[#E3E2E0] pt-16">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10">

        {/* Top grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-12 lg:gap-16 pb-12">

          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2 group">
              <NotionLogoSm />
              <span className="text-[14.5px] font-[650] text-[#191919] tracking-[-0.01em]">SlideIn Venture</span>
            </Link>
            <p className="text-[13.5px] text-[#9B9A97] leading-[1.65] max-w-[180px]">
              The AI workspace that works for you.
            </p>
            <div className="flex gap-2">
              {[
                { label: 'X', icon: '𝕏', href: '#' },
                { label: 'LinkedIn', icon: 'in', href: '#' },
                { label: 'YouTube', icon: '▶', href: '#' },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-8 h-8 rounded-lg border border-[#E3E2E0] bg-white flex items-center justify-center text-[12.5px] font-[700] text-[#9B9A97] hover:text-[#191919] hover:border-[#9B9A97] transition-all duration-150"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {Object.entries(footerLinks).map(([group, links]) => (
              <div key={group} className="flex flex-col gap-3">
                <p className="text-[11px] font-[700] tracking-[0.06em] uppercase text-[#191919] mb-1">
                  {group}
                </p>
                {links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-[13.5px] text-[#9B9A97] hover:text-[#191919] transition-colors duration-120 leading-tight"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 py-5 border-t border-[#E3E2E0]">
          <p className="text-[12.5px] text-[#9B9A97]">
            © {new Date().getFullYear()} SlideIn Venture, Inc.
          </p>
          <div className="flex gap-5">
            {['Privacy Policy', 'Terms', 'Cookies'].map((l) => (
              <Link key={l} href={`/${l.toLowerCase().replace(/ /g, '-')}`}
                className="text-[12.5px] text-[#9B9A97] hover:text-[#787774] transition-colors">
                {l}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
