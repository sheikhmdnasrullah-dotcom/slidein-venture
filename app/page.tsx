import Hero from "@/components/Hero/Hero";
import Section from "@/components/Section";
import { MonoLabel, CornerBrackets } from "@/components/System/System";

const LAYERS = [
  { num: "01", label: "Offer Engineering" },
  { num: "02", label: "ICP & Prospect Research" },
  { num: "03", label: "Outbound Acquisition Engine" },
  { num: "04", label: "Conversion Landing Page" },
  { num: "05", label: "AI Website Agent" },
  { num: "06", label: "AI Phone Receptionist" },
  { num: "07", label: "Content Acquisition Engine" },
];

export default function Home() {
  return (
    <>
      <Hero />

      <Section tone="base" pad="tall" bleed>
        <div className="mx-auto max-w-[1160px] px-6 md:px-10">
          <div className="flex flex-col items-center">
            <MonoLabel className="text-[var(--accent)]">The system</MonoLabel>
            <h2 className="mt-4 font-display-md max-w-[20ch] text-center text-[clamp(1.75rem,3.4vw,2.5rem)] leading-[1.1] text-[var(--on-surface)]">
              Seven layers. One acquisition engine.
            </h2>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {LAYERS.map((layer) => (
              <div
                key={layer.num}
                className="relative overflow-hidden rounded-[calc(var(--radius-md)*1.7)]"
                style={{
                  background: 'linear-gradient(180deg, var(--gloss), transparent 34%), var(--surface-glass)',
                  border: '1px solid var(--rule)',
                  boxShadow: 'var(--shadow-inset-top), var(--shadow-raised)',
                  backdropFilter: 'blur(22px) saturate(1.25)',
                  WebkitBackdropFilter: 'blur(22px) saturate(1.25)',
                }}
              >
                <CornerBrackets size={10} className="left-3 top-3" />
                <CornerBrackets size={10} className="right-3 top-3" />
                <CornerBrackets size={10} className="bottom-3 left-3" />
                <CornerBrackets size={10} className="bottom-3 right-3" />

                <div className="relative px-5 py-7">
                  <MonoLabel className="text-[var(--accent)]">{layer.num}</MonoLabel>
                  <p className="mt-2 font-display-sm text-[clamp(1rem,1.6vw,1.2rem)] leading-tight text-[var(--on-surface)]">
                    {layer.label}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 flex justify-center">
            <a
              href="/process"
              className="btn-premium group inline-flex items-center gap-2.5 rounded-[var(--radius-pill)] px-7 py-4 text-[15px] font-medium text-[var(--on-surface)] transition-[border-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-[var(--accent-ring)]"
              style={{ background: 'var(--surface)', border: '1px solid var(--rule-strong)' }}
            >
              See the full breakdown
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                aria-hidden
                className="text-[var(--accent)] transition-transform duration-500 ease-out group-hover:translate-x-1"
              >
                <path d="M3 7.5h9M8 3.5l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>
      </Section>
    </>
  );
}
