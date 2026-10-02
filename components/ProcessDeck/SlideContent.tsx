'use client';

import Image from 'next/image';
import { SlideItem } from './deckData';

interface SlideContentProps {
  slide: SlideItem;
  companyName: string;
  onOpenImage?: (src: string, caption: string) => void;
  onNext?: () => void;
}

export default function SlideContent({ slide, companyName, onOpenImage, onNext }: SlideContentProps) {
  // Replace dynamic tokens in strings if any
  const formatText = (text: string) => text.replaceAll('{company}', companyName);

  return (
    <div className="flex h-full flex-col">
      {/* ── Slide Header ─────────────────────────────────────────── */}
      <div className="flex-shrink-0 mb-4 md:mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-mono text-[10px] md:text-[11px] font-bold tracking-[0.2em] text-[#ea580c] uppercase">
            {slide.phaseLabel}
          </span>
          <span className="text-[#a3a3a3] text-[12px] font-mono">/</span>
          <span className="font-mono text-[10px] md:text-[11px] text-[#737373] tracking-wider uppercase">
            Slide {String(slide.id).padStart(2, '0')}
          </span>
        </div>

        <h1 className="font-heading text-[22px] sm:text-[26px] md:text-[32px] font-bold text-[#0a0a0a] leading-[1.15] tracking-tight">
          {formatText(slide.title)}{' '}
          {slide.titleHighlight && (
            <span className="text-[#ea580c]">{formatText(slide.titleHighlight)}</span>
          )}
        </h1>

        <p className="mt-1.5 text-[13px] sm:text-[14px] md:text-[15px] font-medium text-[#525252] leading-snug max-w-[900px]">
          {formatText(slide.subtitle)}
        </p>
      </div>

      {/* ── Slide Body ───────────────────────────────────────────── */}
      <div className="flex-1 min-h-0 flex flex-col justify-center">
        {/* ── Slide 1: Cover / Title ── */}
        {slide.layout === 'title' && (
          <div className="flex flex-col items-center justify-center text-center my-auto py-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#fed7aa] bg-[#fff7ed] mb-6">
              <span className="h-2 w-2 rounded-full bg-[#ea580c] animate-pulse" />
              <span className="font-mono text-[11px] font-bold text-[#ea580c] uppercase tracking-wider">
                Universal Growth Engine
              </span>
            </div>

            <h2 className="font-heading text-[32px] sm:text-[42px] md:text-[52px] font-extrabold text-[#0a0a0a] leading-[1.06] tracking-tight max-w-[18ch]">
              The Mortgage <span className="text-[#ea580c]">Growth System</span>
            </h2>

            <p className="mt-4 text-[16px] md:text-[18px] text-[#404040] max-w-[580px] leading-relaxed font-medium">
              A complete digital acquisition and high-deliverability email campaign system engineered specifically for {companyName}.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <span className="px-3.5 py-1.5 rounded-md border border-[#e5e5e5] bg-[#fafafa] font-mono text-[12px] font-semibold text-[#171717]">
                Built by Tanim · SlideIn Venture
              </span>
              <span className="px-3.5 py-1.5 rounded-md border border-[#e5e5e5] bg-[#fafafa] font-mono text-[12px] font-semibold text-[#171717]">
                6-Phase Architecture
              </span>
              <span className="px-3.5 py-1.5 rounded-md border border-[#e5e5e5] bg-[#fafafa] font-mono text-[12px] font-semibold text-[#171717]">
                October 2026
              </span>
            </div>

            {onNext && (
              <button
                type="button"
                onClick={onNext}
                className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-md bg-[#ea580c] text-white font-semibold text-[14px] hover:bg-[#c2410c] transition-colors shadow-sm"
              >
                Start Strategy Walkthrough
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* ── Slide 2: Bottlenecks ── */}
        {slide.layout === 'bottlenecks' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
            <div className="flex flex-col border border-[#171717] rounded-lg p-5 bg-white border-t-[4px] border-t-[#ea580c] shadow-sm">
              <div className="flex items-center gap-2.5 pb-3 border-b border-[#e5e5e5]">
                <span className="flex h-6 w-6 items-center justify-center rounded border border-[#fed7aa] bg-[#fff7ed] font-mono text-[11px] font-bold text-[#ea580c]">
                  01
                </span>
                <h3 className="font-heading font-bold text-[15px] text-[#0a0a0a]">Research Blindspot</h3>
              </div>
              <ul className="mt-3.5 space-y-2.5 text-[13px] leading-relaxed text-[#404040]">
                <li className="flex items-start gap-2">
                  <span className="text-[#ea580c] font-bold">•</span>
                  <span>Homebuyers research loan criteria 6 to 12 months before ever contacting a mortgage advisor.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#ea580c] font-bold">•</span>
                  <span>Without proactive digital presence, competitors capture high-intent borrowers during this critical research phase.</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col border border-[#171717] rounded-lg p-5 bg-white border-t-[4px] border-t-[#ea580c] shadow-sm">
              <div className="flex items-center gap-2.5 pb-3 border-b border-[#e5e5e5]">
                <span className="flex h-6 w-6 items-center justify-center rounded border border-[#fed7aa] bg-[#fff7ed] font-mono text-[11px] font-bold text-[#ea580c]">
                  02
                </span>
                <h3 className="font-heading font-bold text-[15px] text-[#0a0a0a]">The Referral Plateau</h3>
              </div>
              <ul className="mt-3.5 space-y-2.5 text-[13px] leading-relaxed text-[#404040]">
                <li className="flex items-start gap-2">
                  <span className="text-[#ea580c] font-bold">•</span>
                  <span>Most lenders rely entirely on past client referrals and realtor connections for new loan files.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#ea580c] font-bold">•</span>
                  <span>Lacks an automated outbound acquisition engine to generate qualified consultations on demand.</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col border border-[#171717] rounded-lg p-5 bg-white border-t-[4px] border-t-[#ea580c] shadow-sm">
              <div className="flex items-center gap-2.5 pb-3 border-b border-[#e5e5e5]">
                <span className="flex h-6 w-6 items-center justify-center rounded border border-[#fed7aa] bg-[#fff7ed] font-mono text-[11px] font-bold text-[#ea580c]">
                  03
                </span>
                <h3 className="font-heading font-bold text-[15px] text-[#0a0a0a]">Local Search Invisibility</h3>
              </div>
              <ul className="mt-3.5 space-y-2.5 text-[13px] leading-relaxed text-[#404040]">
                <li className="flex items-start gap-2">
                  <span className="text-[#ea580c] font-bold">•</span>
                  <span>When prospects search &quot;mortgage advisor near me&quot;, local Google and social search rankings lag behind.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#ea580c] font-bold">•</span>
                  <span>Loan officers fail to establish dominant educational authority across modern discovery channels.</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* ── Slide 3: 6-Phase Architecture ── */}
        {slide.layout === 'architecture' && (
          <div className="grid grid-cols-2 md:grid-cols-6 gap-2.5 md:gap-3">
            {[
              { num: 'P1', title: 'Foundation', desc: 'Deliverability, DNS, mailbox warmup & command center' },
              { num: 'P2', title: 'Content Engine', desc: '60-day authority video library (Real footage or AI avatar)' },
              { num: 'P3', title: 'Resource Hub', desc: 'Interactive loan calculators & AI buyer qualification' },
              { num: 'P4', title: 'Lead Magnets', desc: 'Social-to-tool funnels capturing verified financial intent' },
              { num: 'P5', title: 'Email Outreach', desc: 'Transactional-header outreach with embedded pitch video' },
              { num: 'P6', title: 'Show-Rate Protection', desc: 'Automated 1-click scheduling, pre-call dossier & reminders' },
            ].map((p, i) => (
              <div
                key={p.num}
                className="flex flex-col justify-between border border-[#171717] rounded-lg p-3.5 bg-white border-t-[3px] border-t-[#ea580c] shadow-sm"
              >
                <div>
                  <span className="font-mono text-[11px] font-bold text-[#ea580c] uppercase">
                    Phase 0{i + 1}
                  </span>
                  <h4 className="font-heading text-[14px] font-bold text-[#0a0a0a] mt-1 leading-snug">
                    {p.title}
                  </h4>
                  <p className="mt-2 text-[12px] text-[#525252] leading-relaxed">
                    {p.desc}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-[#f0f0f0] font-mono text-[10px] text-[#8a8a8a] text-right">
                  Phase 0{i + 1}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Slide 4: Phase 1 Infrastructure ── */}
        {slide.layout === 'infrastructure' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="border border-[#171717] rounded-lg p-5 bg-white border-t-[4px] border-t-[#ea580c]">
              <div className="flex items-center gap-2 pb-2.5 border-b border-[#e5e5e5] mb-3">
                <span className="font-mono text-[11px] font-bold text-[#ea580c] uppercase">Track A</span>
                <h3 className="font-heading font-bold text-[15px] text-[#0a0a0a]">Technical Deliverability Setup</h3>
              </div>
              <ul className="space-y-2.5 text-[13px] text-[#404040]">
                <li className="flex items-start gap-2">
                  <span className="text-[#ea580c] font-bold">✓</span>
                  <span><strong>Dedicated Outreach Domains:</strong> Clean secondary domains isolating primary corporate domain equity.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#ea580c] font-bold">✓</span>
                  <span><strong>Protocol Hardening:</strong> Full SPF, DKIM, DMARC, and custom MX record authentication.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#ea580c] font-bold">✓</span>
                  <span><strong>3–4 Week Warm-Up:</strong> Automated bi-directional peer sending to achieve pristine IP reputation.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#ea580c] font-bold">✓</span>
                  <span><strong>Private SMTP Infrastructure:</strong> Scalable sending servers with dedicated IP addresses.</span>
                </li>
              </ul>
            </div>

            <div className="border border-[#171717] rounded-lg p-5 bg-white border-t-[4px] border-t-[#ea580c]">
              <div className="flex items-center gap-2 pb-2.5 border-b border-[#e5e5e5] mb-3">
                <span className="font-mono text-[11px] font-bold text-[#ea580c] uppercase">Track B</span>
                <h3 className="font-heading font-bold text-[15px] text-[#0a0a0a]">Data &amp; Intelligence Setup</h3>
              </div>
              <ul className="space-y-2.5 text-[13px] text-[#404040]">
                <li className="flex items-start gap-2">
                  <span className="text-[#ea580c] font-bold">✓</span>
                  <span><strong>Agentic Pipeline Dashboard:</strong> Centralized interface configured for lead ingestion and tracking.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#ea580c] font-bold">✓</span>
                  <span><strong>Ideal Customer Profile (ICP):</strong> First-time buyers, relocations, and refinancers mapped out.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#ea580c] font-bold">✓</span>
                  <span><strong>Competitive Intelligence:</strong> Market gap analysis and unique mortgage positioning built.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#ea580c] font-bold">✓</span>
                  <span><strong>Compliance &amp; NMLS Staging:</strong> Required disclaimers and regulatory parameters integrated.</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* ── Slide 5: Phase 1 Dashboard ── */}
        {slide.layout === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            <div className="md:col-span-7 border border-[#171717] rounded-lg overflow-hidden bg-white shadow-sm">
              <div className="relative aspect-[16/10] w-full bg-[#0d1117] cursor-pointer group" onClick={() => onOpenImage && slide.image && onOpenImage(slide.image, slide.imageCaption || '')}>
                {slide.image && (
                  <Image
                    src={slide.image}
                    alt="Command Center Dashboard"
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                )}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="px-3 py-1.5 rounded-md bg-white/95 text-[12px] font-bold font-mono text-[#0a0a0a] shadow-lg flex items-center gap-1.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><path d="M11 8v6M8 11h6"/></svg>
                    Click to Zoom
                  </span>
                </div>
              </div>
              <div className="p-2.5 bg-[#fafafa] border-t border-[#e5e5e5] text-[11px] font-mono text-[#737373] text-center">
                {slide.imageCaption}
              </div>
            </div>

            <div className="md:col-span-5 flex flex-col gap-3">
              {[
                { num: '01', title: 'Unified Operational View', desc: 'All leads, scraping tasks, and booked appointments unified in one real-time dashboard.' },
                { num: '02', title: 'Autonomous Research Agents', desc: 'Background agents verify deliverables, score buyer intent, and enrich contact data 24/7.' },
                { num: '03', title: 'Instant Advisor Routing', desc: 'Inbound replies and booked meetings automatically route to the assigned loan officer.' },
              ].map((card) => (
                <div key={card.num} className="border border-[#171717] rounded-md p-3.5 bg-white border-l-[3px] border-l-[#ea580c]">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-bold text-[#ea580c]">{card.num}</span>
                    <h4 className="font-heading font-bold text-[14px] text-[#0a0a0a]">{card.title}</h4>
                  </div>
                  <p className="mt-1 text-[12px] text-[#525252] leading-snug">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Slide 6: Phase 2 Content Paths ── */}
        {slide.layout === 'content-paths' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            <div className="md:col-span-5 border border-[#171717] rounded-lg overflow-hidden bg-white shadow-sm">
              <div className="relative aspect-[16/10] w-full bg-[#0d1117] cursor-pointer group" onClick={() => onOpenImage && slide.image && onOpenImage(slide.image, slide.imageCaption || '')}>
                {slide.image && (
                  <Image
                    src={slide.image}
                    alt="Content Engine"
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                )}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="px-3 py-1.5 rounded-md bg-white/95 text-[12px] font-bold font-mono text-[#0a0a0a] shadow-lg flex items-center gap-1.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><path d="M11 8v6M8 11h6"/></svg>
                    Click to Zoom
                  </span>
                </div>
              </div>
              <div className="p-2.5 bg-[#fafafa] border-t border-[#e5e5e5] text-[11px] font-mono text-[#737373] text-center">
                {slide.imageCaption}
              </div>
            </div>

            <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border border-[#171717] rounded-lg p-4 bg-white border-t-[3px] border-t-[#ea580c]">
                <span className="px-2 py-0.5 rounded bg-[#fff7ed] border border-[#fed7aa] font-mono text-[10px] font-bold text-[#ea580c] uppercase">
                  Path A · Real Footage
                </span>
                <h4 className="font-heading font-bold text-[14px] text-[#0a0a0a] mt-2">Executive Producer Model</h4>
                <ul className="mt-2.5 space-y-1.5 text-[12px] text-[#404040]">
                  <li className="flex items-start gap-1.5"><span className="text-[#ea580c]">✓</span><span>Advisor records 60s scripted prompts</span></li>
                  <li className="flex items-start gap-1.5"><span className="text-[#ea580c]">✓</span><span>We edit, add captions &amp; custom thumbnails</span></li>
                  <li className="flex items-start gap-1.5"><span className="text-[#ea580c]">✓</span><span>Zero technical editing by the loan officer</span></li>
                </ul>
              </div>

              <div className="border border-[#171717] rounded-lg p-4 bg-white border-t-[3px] border-t-[#ea580c]">
                <span className="px-2 py-0.5 rounded bg-[#fff7ed] border border-[#fed7aa] font-mono text-[10px] font-bold text-[#ea580c] uppercase">
                  Path B · AI Digital Twin
                </span>
                <h4 className="font-heading font-bold text-[14px] text-[#0a0a0a] mt-2">Zero Camera Time</h4>
                <ul className="mt-2.5 space-y-1.5 text-[12px] text-[#404040]">
                  <li className="flex items-start gap-1.5"><span className="text-[#ea580c]">✓</span><span>Realistic avatar cloned from photo + voice</span></li>
                  <li className="flex items-start gap-1.5"><span className="text-[#ea580c]">✓</span><span>60-day mortgage script library pre-written</span></li>
                  <li className="flex items-start gap-1.5"><span className="text-[#ea580c]">✓</span><span>Entire calendar batch-rendered automatically</span></li>
                </ul>
              </div>

              <div className="sm:col-span-2 p-3 rounded-md bg-[#fafafa] border border-[#e5e5e5] flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-[11px] font-semibold text-[#171717]">Distribution Channels:</span>
                <div className="flex flex-wrap gap-2 text-[11px] font-mono text-[#525252]">
                  <span className="px-2 py-0.5 rounded bg-white border border-[#e5e5e5]">LinkedIn</span>
                  <span className="px-2 py-0.5 rounded bg-white border border-[#e5e5e5]">Facebook</span>
                  <span className="px-2 py-0.5 rounded bg-white border border-[#e5e5e5]">Instagram</span>
                  <span className="px-2 py-0.5 rounded bg-white border border-[#e5e5e5]">YouTube</span>
                  <span className="px-2 py-0.5 rounded bg-white border border-[#e5e5e5]">Google Business</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Slide 7: Phase 2C Pitch Video ── */}
        {slide.layout === 'pitch-video' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="border border-[#171717] rounded-lg p-5 bg-white border-t-[4px] border-t-[#ea580c]">
              <div className="flex items-center gap-2 pb-2.5 border-b border-[#e5e5e5] mb-3">
                <span className="font-mono text-[11px] font-bold text-[#ea580c]">01</span>
                <h3 className="font-heading font-bold text-[15px] text-[#0a0a0a]">60–90s Personal Pitch</h3>
              </div>
              <p className="text-[13px] text-[#404040] leading-relaxed">
                A custom personal video recorded by the licensed loan officer introducing themselves directly to the prospect.
              </p>
              <div className="mt-3 p-2.5 rounded bg-[#fafafa] border border-[#e5e5e5] text-[12px] text-[#525252]">
                Replaces faceless walls of corporate marketing text with genuine human authority.
              </div>
            </div>

            <div className="border border-[#171717] rounded-lg p-5 bg-white border-t-[4px] border-t-[#ea580c]">
              <div className="flex items-center gap-2 pb-2.5 border-b border-[#e5e5e5] mb-3">
                <span className="font-mono text-[11px] font-bold text-[#ea580c]">02</span>
                <h3 className="font-heading font-bold text-[15px] text-[#0a0a0a]">Embedded Animated Thumbnail</h3>
              </div>
              <p className="text-[13px] text-[#404040] leading-relaxed">
                Rendered as an engaging animated preview directly within the cold email body — not a bulky attachment that trips spam filters.
              </p>
              <div className="mt-3 p-2.5 rounded bg-[#fafafa] border border-[#e5e5e5] text-[12px] text-[#525252]">
                1-click play launches full-screen pitch with synchronized loan calculation insights.
              </div>
            </div>

            <div className="border border-[#171717] rounded-lg p-5 bg-white border-t-[4px] border-t-[#ea580c]">
              <div className="flex items-center gap-2 pb-2.5 border-b border-[#e5e5e5] mb-3">
                <span className="font-mono text-[11px] font-bold text-[#ea580c]">03</span>
                <h3 className="font-heading font-bold text-[15px] text-[#0a0a0a]">Viewer Telemetry &amp; Alerts</h3>
              </div>
              <p className="text-[13px] text-[#404040] leading-relaxed">
                Tracks exact view duration, completion percentages, and re-watches in real-time.
              </p>
              <div className="mt-3 p-2.5 rounded bg-[#fafafa] border border-[#e5e5e5] text-[12px] text-[#525252]">
                Advisors are alerted the moment a prospect watches 80%+, enabling perfect follow-up timing.
              </div>
            </div>
          </div>
        )}

        {/* ── Slide 8: Phase 3 Resource Hub ── */}
        {slide.layout === 'resource-hub' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            <div className="md:col-span-6 border border-[#171717] rounded-lg overflow-hidden bg-white shadow-sm">
              <div className="relative aspect-[16/10] w-full bg-[#0d1117] cursor-pointer group" onClick={() => onOpenImage && slide.image && onOpenImage(slide.image, slide.imageCaption || '')}>
                {slide.image && (
                  <Image
                    src={slide.image}
                    alt="Resource Hub"
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                )}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="px-3 py-1.5 rounded-md bg-white/95 text-[12px] font-bold font-mono text-[#0a0a0a] shadow-lg flex items-center gap-1.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><path d="M11 8v6M8 11h6"/></svg>
                    Click to Zoom
                  </span>
                </div>
              </div>
              <div className="p-2.5 bg-[#fafafa] border-t border-[#e5e5e5] text-[11px] font-mono text-[#737373] text-center">
                {slide.imageCaption}
              </div>
            </div>

            <div className="md:col-span-6 flex flex-col gap-4">
              <div className="border border-[#171717] rounded-lg p-4 bg-white border-t-[3px] border-t-[#ea580c]">
                <h4 className="font-heading font-bold text-[14px] text-[#0a0a0a]">Interactive Financial Tools</h4>
                <div className="mt-2.5 grid grid-cols-2 gap-2 text-[12px] text-[#404040]">
                  <span className="p-1.5 rounded bg-[#fafafa] border border-[#e5e5e5]">🧮 Mortgage Payment Calculator</span>
                  <span className="p-1.5 rounded bg-[#fafafa] border border-[#e5e5e5]">🏠 Affordability Quiz</span>
                  <span className="p-1.5 rounded bg-[#fafafa] border border-[#e5e5e5]">⚖️ Rent vs. Buy Analysis</span>
                  <span className="p-1.5 rounded bg-[#fafafa] border border-[#e5e5e5]">💰 Refinance Savings Tool</span>
                </div>
              </div>

              <div className="border border-[#171717] rounded-lg p-4 bg-white border-t-[3px] border-t-[#ea580c]">
                <h4 className="font-heading font-bold text-[14px] text-[#0a0a0a]">Intent Capture Mechanism</h4>
                <ul className="mt-2 space-y-1.5 text-[12px] text-[#404040]">
                  <li className="flex items-start gap-1.5"><span className="text-[#ea580c]">✓</span><span>Prospect self-selects purchase price, down payment &amp; timeline</span></li>
                  <li className="flex items-start gap-1.5"><span className="text-[#ea580c]">✓</span><span>Full analysis unlocked via verified work/personal email capture</span></li>
                  <li className="flex items-start gap-1.5"><span className="text-[#ea580c]">✓</span><span>Data tags immediately route to CRM for contextual outreach</span></li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ── Slide 9: Phase 3 Booking ── */}
        {slide.layout === 'booking-system' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="border border-[#171717] rounded-lg p-5 bg-white border-t-[4px] border-t-[#ea580c]">
              <div className="flex items-center gap-2 pb-2.5 border-b border-[#e5e5e5] mb-3">
                <span className="font-mono text-[11px] font-bold text-[#ea580c]">01</span>
                <h3 className="font-heading font-bold text-[15px] text-[#0a0a0a]">24/7 AI Qualification</h3>
              </div>
              <p className="text-[13px] text-[#404040] leading-relaxed">
                Intelligent conversational assistant engages visitors instantly, clarifying purchasing timeline, credit range, and loan program preference.
              </p>
              <div className="mt-3 p-2.5 rounded bg-[#fafafa] border border-[#e5e5e5] text-[12px] text-[#525252]">
                Operates strictly from pre-approved compliance guidelines.
              </div>
            </div>

            <div className="border border-[#171717] rounded-lg p-5 bg-white border-t-[4px] border-t-[#ea580c]">
              <div className="flex items-center gap-2 pb-2.5 border-b border-[#e5e5e5] mb-3">
                <span className="font-mono text-[11px] font-bold text-[#ea580c]">02</span>
                <h3 className="font-heading font-bold text-[15px] text-[#0a0a0a]">1-Click Calendar Booking</h3>
              </div>
              <p className="text-[13px] text-[#404040] leading-relaxed">
                Qualified buyers schedule directly into the assigned advisor&apos;s live calendar. Automatic timezone detection and zero back-and-forth emails.
              </p>
              <div className="mt-3 p-2.5 rounded bg-[#fafafa] border border-[#e5e5e5] text-[12px] text-[#525252]">
                Instant calendar invites and confirmation notices dispatched.
              </div>
            </div>

            <div className="border border-[#171717] rounded-lg p-5 bg-white border-t-[4px] border-t-[#ea580c]">
              <div className="flex items-center gap-2 pb-2.5 border-b border-[#e5e5e5] mb-3">
                <span className="font-mono text-[11px] font-bold text-[#ea580c]">03</span>
                <h3 className="font-heading font-bold text-[15px] text-[#0a0a0a]">Pre-Call Dossier Delivery</h3>
              </div>
              <p className="text-[13px] text-[#404040] leading-relaxed">
                Advisor receives a complete briefing dossier 15 minutes prior to the call with calculator inputs, target budget, and specific buyer questions.
              </p>
              <div className="mt-3 p-2.5 rounded bg-[#fafafa] border border-[#e5e5e5] text-[12px] text-[#525252]">
                No cold calls. Advisors enter consultations fully prepared to close.
              </div>
            </div>
          </div>
        )}

        {/* ── Slide 10: Phase 4 Lead Magnets ── */}
        {slide.layout === 'lead-magnets' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            <div className="md:col-span-5 border border-[#171717] rounded-lg overflow-hidden bg-white shadow-sm">
              <div className="relative aspect-[16/10] w-full bg-[#0d1117] cursor-pointer group" onClick={() => onOpenImage && slide.image && onOpenImage(slide.image, slide.imageCaption || '')}>
                {slide.image && (
                  <Image
                    src={slide.image}
                    alt="Lead Magnets"
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                )}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="px-3 py-1.5 rounded-md bg-white/95 text-[12px] font-bold font-mono text-[#0a0a0a] shadow-lg flex items-center gap-1.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><path d="M11 8v6M8 11h6"/></svg>
                    Click to Zoom
                  </span>
                </div>
              </div>
              <div className="p-2.5 bg-[#fafafa] border-t border-[#e5e5e5] text-[11px] font-mono text-[#737373] text-center">
                {slide.imageCaption}
              </div>
            </div>

            <div className="md:col-span-7 flex flex-col gap-3">
              <h4 className="font-heading font-bold text-[14px] text-[#0a0a0a]">The 6-Step LinkedIn-to-Lead Pipeline</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { step: '01', title: 'Social Post', desc: 'Educational rate & market analysis' },
                  { step: '02', title: 'Strong CTA', desc: 'Directs to interactive tool' },
                  { step: '03', title: 'Self-Service', desc: 'Prospect runs scenario numbers' },
                  { step: '04', title: 'Email Gated', desc: 'Verified contact unlocked' },
                  { step: '05', title: 'Intent Signals', desc: 'Budget & timeline captured' },
                  { step: '06', title: 'Warm Outreach', desc: 'Advisor reaches out with context' },
                ].map((s) => (
                  <div key={s.step} className="p-2.5 rounded-md border border-[#171717] bg-white">
                    <span className="font-mono text-[10px] font-bold text-[#ea580c]">{s.step}</span>
                    <h5 className="font-heading text-[12px] font-bold text-[#0a0a0a] mt-0.5">{s.title}</h5>
                    <p className="text-[11px] text-[#525252] mt-0.5 leading-snug">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Slide 11: Phase 5 Deliverability ── */}
        {slide.layout === 'deliverability' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            <div className="md:col-span-4 border border-[#171717] rounded-lg p-6 bg-[#0d1117] text-white flex flex-col justify-center items-center text-center">
              <span className="font-mono text-[11px] font-bold text-[#ea580c] uppercase tracking-wider">
                Inbox Placement Rate
              </span>
              <div className="mt-3 font-heading text-[54px] md:text-[62px] font-extrabold text-white leading-none tracking-tight">
                80<span className="text-[#ea580c]">%+</span>
              </div>
              <p className="mt-2 text-[13px] text-[#a3a3a3] font-medium max-w-[220px]">
                8 out of 10 emails land in Primary Inbox — not Spam, not Promotions.
              </p>
              <div className="mt-4 px-3 py-1 rounded bg-[#1f2a3c] border border-[#2a3f5a] font-mono text-[11px] text-[#fed7aa]">
                Tested on Gmail &amp; Outlook 365
              </div>
            </div>

            <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border border-[#171717] rounded-lg p-4 bg-white border-t-[3px] border-t-[#ea580c]">
                <h4 className="font-heading font-bold text-[14px] text-[#0a0a0a]">Technical Setup</h4>
                <ul className="mt-2.5 space-y-2 text-[12px] text-[#404040]">
                  <li className="flex items-start gap-1.5"><span className="text-[#ea580c] font-bold">•</span><span>Multi-domain cluster isolating reputation</span></li>
                  <li className="flex items-start gap-1.5"><span className="text-[#ea580c] font-bold">•</span><span>Automated bi-directional warmup networks</span></li>
                  <li className="flex items-start gap-1.5"><span className="text-[#ea580c] font-bold">•</span><span>Continuous SPF, DKIM, DMARC monitoring</span></li>
                </ul>
              </div>

              <div className="border border-[#171717] rounded-lg p-4 bg-white border-t-[3px] border-t-[#ea580c]">
                <h4 className="font-heading font-bold text-[14px] text-[#0a0a0a]">Proprietary Sending Engine</h4>
                <ul className="mt-2.5 space-y-2 text-[12px] text-[#404040]">
                  <li className="flex items-start gap-1.5"><span className="text-[#ea580c] font-bold">•</span><span>Marketing copy structured as transactional headers</span></li>
                  <li className="flex items-start gap-1.5"><span className="text-[#ea580c] font-bold">•</span><span>Bypasses automated promotional sorting</span></li>
                  <li className="flex items-start gap-1.5"><span className="text-[#ea580c] font-bold">•</span><span>Full compatibility: Mailgun, Mailchimp, HubSpot</span></li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ── Slide 12: Phase 5 Sourcing & Sequence ── */}
        {slide.layout === 'sourcing-sequence' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            <div className="md:col-span-5 border border-[#171717] rounded-lg overflow-hidden bg-white shadow-sm">
              <div className="relative aspect-[16/10] w-full bg-[#0d1117] cursor-pointer group" onClick={() => onOpenImage && slide.image && onOpenImage(slide.image, slide.imageCaption || '')}>
                {slide.image && (
                  <Image
                    src={slide.image}
                    alt="Outreach and Booking"
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                )}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="px-3 py-1.5 rounded-md bg-white/95 text-[12px] font-bold font-mono text-[#0a0a0a] shadow-lg flex items-center gap-1.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><path d="M11 8v6M8 11h6"/></svg>
                    Click to Zoom
                  </span>
                </div>
              </div>
              <div className="p-2.5 bg-[#fafafa] border-t border-[#e5e5e5] text-[11px] font-mono text-[#737373] text-center">
                {slide.imageCaption}
              </div>
            </div>

            <div className="md:col-span-7 flex flex-col gap-2">
              <h4 className="font-heading font-bold text-[14px] text-[#0a0a0a]">5-Step Structured Email Sequence</h4>
              <div className="space-y-1.5 text-[12px]">
                {[
                  { touch: 'Email 1', day: 'Day 0', title: 'Personal Intro + Pitch Video', desc: 'Soft conversation starter with embedded 60s video' },
                  { touch: 'Email 2', day: 'Day 3', title: 'Value Add', desc: 'Relevant neighborhood market tip & affordability insight' },
                  { touch: 'Email 3', day: 'Day 7', title: 'Social Proof', desc: 'Real case study of a recent funded homebuyer' },
                  { touch: 'Email 4', day: 'Day 14', title: 'Direct Ask', desc: 'Specific question tailored to their purchasing timeline' },
                  { touch: 'Email 5', day: 'Day 21', title: 'Re-engagement', desc: 'Friendly check-in with 1-click calendar access' },
                ].map((seq) => (
                  <div key={seq.touch} className="flex items-center gap-3 p-2 rounded border border-[#e5e5e5] bg-white">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-[#fff7ed] text-[#ea580c] border border-[#fed7aa] shrink-0">
                      {seq.day}
                    </span>
                    <span className="font-bold text-[#0a0a0a] w-[140px] shrink-0">{seq.title}</span>
                    <span className="text-[#525252] truncate">{seq.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Slide 13: Phase 6 Show-Rate ── */}
        {slide.layout === 'show-rate' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="border border-[#171717] rounded-lg p-5 bg-white border-t-[4px] border-t-[#ea580c]">
              <div className="flex items-center gap-2 pb-2.5 border-b border-[#e5e5e5] mb-3">
                <span className="font-mono text-[11px] font-bold text-[#ea580c]">01</span>
                <h3 className="font-heading font-bold text-[15px] text-[#0a0a0a]">Context Briefing</h3>
              </div>
              <ul className="space-y-2 text-[13px] text-[#404040]">
                <li className="flex items-start gap-1.5"><span className="text-[#ea580c]">•</span><span>Full prospect dossier delivered prior to call</span></li>
                <li className="flex items-start gap-1.5"><span className="text-[#ea580c]">•</span><span>Contains calculator data, budget &amp; email thread</span></li>
                <li className="flex items-start gap-1.5"><span className="text-[#ea580c]">•</span><span>Advisor enters prepared to structure loan options</span></li>
              </ul>
            </div>

            <div className="border border-[#171717] rounded-lg p-5 bg-white border-t-[4px] border-t-[#ea580c]">
              <div className="flex items-center gap-2 pb-2.5 border-b border-[#e5e5e5] mb-3">
                <span className="font-mono text-[11px] font-bold text-[#ea580c]">02</span>
                <h3 className="font-heading font-bold text-[15px] text-[#0a0a0a]">3-Tier Reminders</h3>
              </div>
              <ul className="space-y-2 text-[13px] text-[#404040]">
                <li className="flex items-start gap-1.5"><span className="text-[#ea580c]">•</span><span><strong>Immediate:</strong> Calendar invite + video confirmation</span></li>
                <li className="flex items-start gap-1.5"><span className="text-[#ea580c]">•</span><span><strong>24-Hour:</strong> Agenda &amp; pre-approval checklist</span></li>
                <li className="flex items-start gap-1.5"><span className="text-[#ea580c]">•</span><span><strong>1-Hour:</strong> Direct SMS with 1-click meeting link</span></li>
              </ul>
            </div>

            <div className="border border-[#171717] rounded-lg p-5 bg-white border-t-[4px] border-t-[#ea580c]">
              <div className="flex items-center gap-2 pb-2.5 border-b border-[#e5e5e5] mb-3">
                <span className="font-mono text-[11px] font-bold text-[#ea580c]">03</span>
                <h3 className="font-heading font-bold text-[15px] text-[#0a0a0a]">No-Show Recovery</h3>
              </div>
              <ul className="space-y-2 text-[13px] text-[#404040]">
                <li className="flex items-start gap-1.5"><span className="text-[#ea580c]">•</span><span>Automated check-in sent within 2h of missed slot</span></li>
                <li className="flex items-start gap-1.5"><span className="text-[#ea580c]">•</span><span>Frictionless 1-click rescheduling link provided</span></li>
                <li className="flex items-start gap-1.5"><span className="text-[#ea580c]">•</span><span>Recovers 35% to 45% of missed appointments</span></li>
              </ul>
            </div>
          </div>
        )}

        {/* ── Slide 14: Full Funnel ── */}
        {slide.layout === 'funnel' && (
          <div className="flex flex-col gap-1.5 max-w-[850px] mx-auto w-full">
            {[
              { step: '1. Awareness', phase: 'Phase 2 · Content', desc: 'Educational social video & local Google presence building brand recognition' },
              { step: '2. Interest', phase: 'Phase 3 · Resource Hub', desc: 'Homebuyers utilize interactive payment calculators & affordability tools' },
              { step: '3. Lead Capture', phase: 'Phase 3/4 · Lead Tools', desc: 'Buyer enters budget & timeline to unlock custom PDF scenario report' },
              { step: '4. Outreach', phase: 'Phase 5 · Email Engine', desc: 'Personalized email sequences with embedded advisor pitch video delivered to inbox' },
              { step: '5. Booking', phase: 'Phase 5/6 · 1-Click Scheduling', desc: 'Direct calendar booking + automated 3-tier email/SMS reminder flow' },
              { step: '6. Meeting', phase: 'Phase 6 · Consultation', desc: 'Advisor conducts consultation with pre-qualified borrower holding complete data' },
              { step: '7. Application', phase: 'FINAL GOAL', desc: 'Mortgage application submitted, approved, and funded. Revenue generated.', isGoal: true },
            ].map((row) => (
              <div
                key={row.step}
                className={`flex items-center gap-3 p-2.5 rounded-md border text-[13px] ${
                  row.isGoal
                    ? 'border-[#ea580c] bg-[#fff7ed] font-bold text-[#0a0a0a]'
                    : 'border-[#171717] bg-white text-[#404040]'
                }`}
              >
                <span className={`w-[110px] shrink-0 font-heading font-bold ${row.isGoal ? 'text-[#ea580c]' : 'text-[#0a0a0a]'}`}>
                  {row.step}
                </span>
                <span className={`px-2 py-0.5 rounded font-mono text-[10px] shrink-0 uppercase tracking-wider ${
                  row.isGoal
                    ? 'bg-[#ea580c] text-white'
                    : 'bg-[#fafafa] border border-[#e5e5e5] text-[#525252]'
                }`}>
                  {row.phase}
                </span>
                <span className="flex-1 text-[12px] leading-snug">{row.desc}</span>
              </div>
            ))}
          </div>
        )}

        {/* ── Slide 15: Division of Work ── */}
        {slide.layout === 'division-of-work' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="border border-[#171717] rounded-lg p-5 bg-white border-t-[4px] border-t-[#ea580c]">
              <div className="flex items-center gap-2 pb-2.5 border-b border-[#e5e5e5] mb-3">
                <span className="flex h-5 w-5 items-center justify-center rounded bg-[#ea580c] text-white font-mono text-[11px] font-bold">
                  T
                </span>
                <h3 className="font-heading font-bold text-[15px] text-[#0a0a0a]">Tanim&apos;s Responsibilities (Fully Managed)</h3>
              </div>
              <ul className="space-y-1.5 text-[12px] text-[#404040]">
                <li className="flex items-start gap-1.5"><span className="text-[#ea580c]">✓</span><span>Full technical configuration (domains, DNS, servers, warm-up)</span></li>
                <li className="flex items-start gap-1.5"><span className="text-[#ea580c]">✓</span><span>Prospect list building, data scraping, and financial intent enrichment</span></li>
                <li className="flex items-start gap-1.5"><span className="text-[#ea580c]">✓</span><span>Email copywriting, dynamic personalization, and inbox placement</span></li>
                <li className="flex items-start gap-1.5"><span className="text-[#ea580c]">✓</span><span>Content calendar creation, scripting, and post-production video editing</span></li>
                <li className="flex items-start gap-1.5"><span className="text-[#ea580c]">✓</span><span>AI likeness rendering and automated social publishing</span></li>
                <li className="flex items-start gap-1.5"><span className="text-[#ea580c]">✓</span><span>Resource Hub tool development and AI qualification training</span></li>
                <li className="flex items-start gap-1.5"><span className="text-[#ea580c]">✓</span><span>Monthly analytics, pipeline tracking, and executive reporting</span></li>
              </ul>
            </div>

            <div className="border border-[#171717] rounded-lg p-5 bg-white border-t-[4px] border-t-[#ea580c] flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 pb-2.5 border-b border-[#e5e5e5] mb-3">
                  <span className="flex h-5 w-5 items-center justify-center rounded bg-[#171717] text-white font-mono text-[11px] font-bold">
                    A
                  </span>
                  <h3 className="font-heading font-bold text-[15px] text-[#0a0a0a]">Advisor Responsibilities (Minimal Time)</h3>
                </div>
                <ul className="space-y-3 text-[13px] text-[#404040]">
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-[#ea580c]">1.</span>
                    <span><strong>Optional Video:</strong> Record 60-second video prompts (or utilize Path B AI digital twin).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-[#ea580c]">2.</span>
                    <span><strong>Consultations:</strong> Attend scheduled calendar appointments with pre-qualified buyers.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-[#ea580c]">3.</span>
                    <span><strong>Origination:</strong> Structure loan options, collect documentation, and close the application.</span>
                  </li>
                </ul>
              </div>

              <div className="mt-4 pt-3 border-t border-[#e5e5e5] text-[12px] font-semibold text-[#c2410c] bg-[#fff7ed] p-2.5 rounded">
                Advisors spend zero time prospecting, managing software, or warming domains.
              </div>
            </div>
          </div>
        )}

        {/* ── Slide 16: Roadmap ── */}
        {slide.layout === 'roadmap' && (
          <div className="border border-[#171717] rounded-lg overflow-hidden bg-white">
            <table className="w-full text-left text-[12px] md:text-[13px] border-collapse">
              <thead>
                <tr className="bg-[#fafafa] border-b border-[#171717]">
                  <th className="py-2.5 px-4 font-mono font-bold text-[#0a0a0a] uppercase tracking-wider text-[11px] w-[120px]">Timeline</th>
                  <th className="py-2.5 px-4 font-heading font-bold text-[#0a0a0a] w-[180px]">Phase</th>
                  <th className="py-2.5 px-4 font-heading font-bold text-[#0a0a0a]">Deliverables &amp; Milestones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e5e5]">
                {[
                  { timeline: 'Weeks 1–2', phase: 'Phase 1 Setup', deliverables: 'Domain registration, DNS authentication, and automated mailbox warm-up initiated.' },
                  { timeline: 'Weeks 2–3', phase: 'Brand Foundation', deliverables: 'Social media presence audit and Google Business listings finalized.' },
                  { timeline: 'Weeks 2–4', phase: 'Phase 2 Content', deliverables: '60-day content calendar finalized; first batch of videos / AI avatars scheduled.' },
                  { timeline: 'Weeks 3–5', phase: 'Phase 3 Hub', deliverables: 'Resource Hub deployed on satellite domain with interactive mortgage calculators.' },
                  { timeline: 'Week 4', phase: 'Warm-Up Ready', deliverables: 'Mailboxes achieve full warm status; inbox deliverability verified.' },
                  { timeline: 'Week 5+', phase: 'Phase 5 Outreach', deliverables: 'First cold email campaigns go live with embedded advisor pitch videos.' },
                  { timeline: 'Week 6+', phase: 'Phase 6 Booking', deliverables: 'First automated appointments booked on advisors\' calendars.' },
                  { timeline: 'Month 2+', phase: 'Full Scale', deliverables: 'Compounding growth engine operating continuously with monthly optimization reports.' },
                ].map((r) => (
                  <tr key={r.timeline} className="hover:bg-[#fafafa]/80">
                    <td className="py-2 px-4 font-mono font-bold text-[#ea580c] whitespace-nowrap">{r.timeline}</td>
                    <td className="py-2 px-4 font-bold text-[#0a0a0a]">{r.phase}</td>
                    <td className="py-2 px-4 text-[#525252] leading-snug">{r.deliverables}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Slide 17: Investment & ROI ── */}
        {slide.layout === 'investment' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="border border-[#171717] rounded-lg p-5 bg-white border-t-[4px] border-t-[#ea580c]">
              <div className="flex items-center gap-2 pb-2.5 border-b border-[#e5e5e5] mb-3">
                <span className="flex h-6 w-6 items-center justify-center rounded border border-[#fed7aa] bg-[#fff7ed] font-mono text-[12px] font-bold text-[#ea580c]">
                  $
                </span>
                <h3 className="font-heading font-bold text-[15px] text-[#0a0a0a]">Agreement Structure</h3>
              </div>
              <ul className="space-y-3 text-[13px] text-[#404040]">
                <li className="flex items-start gap-2">
                  <span className="text-[#ea580c] font-bold">•</span>
                  <span><strong>$750 / Month Retainer:</strong> Covers full technical infrastructure, tool building, content management, email operations, and reporting.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#ea580c] font-bold">•</span>
                  <span><strong>$50 Per Closed Deal:</strong> Performance-based success fee on funded loans originating directly from campaigns.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#ea580c] font-bold">•</span>
                  <span><strong>Zero Required Ad Spend:</strong> Capitalizes on owned digital assets, content authority, and targeted direct outreach.</span>
                </li>
              </ul>
            </div>

            <div className="border border-[#171717] rounded-lg p-5 bg-white border-t-[4px] border-t-[#ea580c]">
              <div className="flex items-center gap-2 pb-2.5 border-b border-[#e5e5e5] mb-3">
                <span className="flex h-6 w-6 items-center justify-center rounded border border-[#fed7aa] bg-[#fff7ed] font-mono text-[11px] font-bold text-[#ea580c]">
                  ROI
                </span>
                <h3 className="font-heading font-bold text-[15px] text-[#0a0a0a]">Economic Return for {companyName}</h3>
              </div>
              <ul className="space-y-3 text-[13px] text-[#404040]">
                <li className="flex items-start gap-2">
                  <span className="text-[#ea580c] font-bold">•</span>
                  <span><strong>High Value Per Deal:</strong> A single closed mortgage transaction generates thousands in gross commission revenue.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#ea580c] font-bold">•</span>
                  <span><strong>10x+ Retainer Payback:</strong> Just 1 to 2 closed deals per month pays for the entire monthly system 10 times over.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#ea580c] font-bold">•</span>
                  <span><strong>Permanent Enterprise Asset:</strong> {companyName} retains all interactive tools, video assets, and buyer databases permanently.</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* ── Slide 18: Next Steps ── */}
        {slide.layout === 'next-steps' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="border border-[#171717] rounded-lg p-5 bg-white border-t-[4px] border-t-[#ea580c]">
              <div className="flex items-center gap-2 pb-2.5 border-b border-[#e5e5e5] mb-3">
                <span className="font-mono text-[11px] font-bold text-[#ea580c]">01</span>
                <h3 className="font-heading font-bold text-[15px] text-[#0a0a0a]">{companyName} Team</h3>
              </div>
              <ul className="space-y-2 text-[13px] text-[#404040]">
                <li className="flex items-start gap-1.5"><span className="text-[#ea580c]">•</span><span>Send complete advisor roster &amp; branch market locations.</span></li>
                <li className="flex items-start gap-1.5"><span className="text-[#ea580c]">•</span><span>Provide compliance guidelines and individual NMLS numbers.</span></li>
                <li className="flex items-start gap-1.5"><span className="text-[#ea580c]">•</span><span>Share vector brand logos and color specifications.</span></li>
              </ul>
            </div>

            <div className="border border-[#171717] rounded-lg p-5 bg-white border-t-[4px] border-t-[#ea580c]">
              <div className="flex items-center gap-2 pb-2.5 border-b border-[#e5e5e5] mb-3">
                <span className="font-mono text-[11px] font-bold text-[#ea580c]">02</span>
                <h3 className="font-heading font-bold text-[15px] text-[#0a0a0a]">Tanim Deliverables</h3>
              </div>
              <ul className="space-y-2 text-[13px] text-[#404040]">
                <li className="flex items-start gap-1.5"><span className="text-[#ea580c]">•</span><span>Provide video demo of email deliverability tool.</span></li>
                <li className="flex items-start gap-1.5"><span className="text-[#ea580c]">•</span><span>Send marketing funnel proposal for executive review.</span></li>
                <li className="flex items-start gap-1.5"><span className="text-[#ea580c]">•</span><span>Begin social and Google Business audits upon roster delivery.</span></li>
              </ul>
            </div>

            <div className="border border-[#171717] rounded-lg p-5 bg-white border-t-[4px] border-t-[#ea580c]">
              <div className="flex items-center gap-2 pb-2.5 border-b border-[#e5e5e5] mb-3">
                <span className="font-mono text-[11px] font-bold text-[#ea580c]">03</span>
                <h3 className="font-heading font-bold text-[15px] text-[#0a0a0a]">Monday Check-In</h3>
              </div>
              <ul className="space-y-2 text-[13px] text-[#404040]">
                <li className="flex items-start gap-1.5"><span className="text-[#ea580c]">•</span><span>Review social audit progress and profile optimizations.</span></li>
                <li className="flex items-start gap-1.5"><span className="text-[#ea580c]">•</span><span>Confirm satellite domain selection for Resource Hub.</span></li>
                <li className="flex items-start gap-1.5"><span className="text-[#ea580c]">•</span><span>Finalize initial retainer disbursement and kickoff.</span></li>
              </ul>
            </div>
          </div>
        )}

        {/* ── Slide 19: Closing ── */}
        {slide.layout === 'closing' && (
          <div className="flex flex-col items-center justify-center text-center my-auto py-8">
            <h2 className="font-heading text-[28px] sm:text-[36px] md:text-[44px] font-bold text-[#0a0a0a] leading-tight max-w-[20ch]">
              Building the System That Fills Your <span className="text-[#ea580c]">Advisors&apos; Calendars</span>
            </h2>

            <p className="mt-3 text-[15px] md:text-[16px] text-[#525252] max-w-[540px]">
              Let&apos;s review the deliverability demo and finalize domain approval during our Monday check-in.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 p-4 rounded-lg border border-[#171717] bg-[#fafafa]">
              <div className="flex items-center gap-2 text-[13px] font-medium text-[#171717]">
                <span className="font-bold text-[#ea580c]">Tanim:</span>
                <a href="mailto:nasrullahtanim@gmail.com" className="hover:underline">nasrullahtanim@gmail.com</a>
              </div>
              <span className="hidden sm:inline text-[#a3a3a3]">•</span>
              <div className="flex items-center gap-2 text-[13px] font-medium text-[#171717]">
                <span className="font-bold text-[#ea580c]">SlideIn Venture:</span>
                <a href="https://www.slideinventure.com" target="_blank" rel="noopener noreferrer" className="hover:underline">www.slideinventure.com</a>
              </div>
            </div>

            <div className="mt-8 text-[11px] font-mono uppercase tracking-wider text-[#8a8a8a]">
              Growth Architecture Engineered Specifically for {companyName}
            </div>
          </div>
        )}
      </div>

      {/* ── Bottom Callout Strip ─────────────────────────────────── */}
      {slide.callout && (
        <div className="flex-shrink-0 mt-4 md:mt-5 p-3 rounded-md border border-[#fed7aa] bg-[#fff7ed] border-l-[4px] border-l-[#ea580c] flex items-center justify-between gap-3">
          <p className="text-[12px] sm:text-[13px] font-medium text-[#0a0a0a]">
            {formatText(slide.callout)}
          </p>
          <span className="hidden sm:inline-block font-mono text-[10px] uppercase tracking-wider text-[#ea580c] font-bold shrink-0">
            System Protocol
          </span>
        </div>
      )}
    </div>
  );
}
