import Link from 'next/link';
import { CANVAS_MIN } from '@/components/PitchDeck/ChapterRun';
import AlternativeSlide from '@/components/PitchDeck/AlternativeSlide';

const RED = 'var(--accent-vivid)';
const RED_TEXT = 'var(--accent)';

export default function PricingPage() {
  return (
    <>
      {/* ── Hero / Price ───────────────────────────────────────────── */}
      <section className="relative pt-36 pb-24 overflow-hidden">
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
            One flat retainer
          </div>

          <h1
            className="display-headline text-[clamp(2.5rem,5vw,4rem)] mb-5"
            style={{ color: 'var(--on-surface)' }}
          >
            We will handle your
            <br />
            <span style={{ color: RED_TEXT }}>content and outreach.</span>
          </h1>

          <p className="body-copy text-base text-[var(--muted)] max-w-[520px] mx-auto">
            One system, one team, one number — no bundles to build and nothing to configure.
          </p>

          <div
            className="mt-12 mx-auto max-w-[420px] rounded-[var(--radius-md)] px-10 py-9"
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--rule)',
              boxShadow: 'var(--shadow-raised)',
            }}
          >
            <p className="text-[13px] font-[700] tracking-[0.06em] uppercase text-[var(--muted)] mb-3">
              Everything, monthly
            </p>
            <p className="tnum" style={{ color: 'var(--on-surface)' }}>
              <span className="font-display-md text-[clamp(3rem,7vw,4.5rem)] leading-none tracking-[-0.03em]">
                $3,999
              </span>
              <span className="text-[15px] font-[600] text-[var(--muted)] ml-2">/ month</span>
            </p>
            <p className="body-copy text-[14px] text-[var(--muted)] mt-4">
              We will handle your content and outreach operation for $3,999/month.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-5 mt-10">
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

          <Link
            href="https://calendar.notion.so/meet/nasrullah_tanim/schedule"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-10 px-7 py-3.5 rounded-full text-[15px] font-[700] transition-all duration-200 hover:-translate-y-px hover:shadow-lg"
            style={{ background: 'var(--accent-vivid)', color: 'var(--surface)' }}
          >
            Book a Call
            <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none">
              <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </section>

      {/* ── The Alternative ───────────────────────────────────────────
          Same comparison slide that used to close the /steps deck — moved
          here because "what would this cost any other way" is the argument
          a pricing page needs to make right under the number itself. */}
      <section className="pb-40">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <span className="font-label mb-6 block text-center text-[var(--accent)]">
            The Alternative
          </span>
          <h2 className="font-display-xl mx-auto max-w-[20ch] text-[clamp(2rem,5vw,4rem)] text-center text-[var(--on-surface)]">
            Or, piece it together yourself.
          </h2>
          <p className="font-body mx-auto mt-8 max-w-[52ch] text-center text-[var(--muted)]">
            Seven contracts, seven onboardings, and none of them talk to each other.
          </p>

          <div className={`${CANVAS_MIN} mt-14`}>
            <AlternativeSlide />
          </div>
        </div>
      </section>
    </>
  );
}
