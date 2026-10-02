import { Fragment } from 'react';
import { ArrowRight02Icon as ArrowRight } from 'hugeicons-react';
import { Rise } from '@/components/PitchDeck/ScrollReveal';
import { ARCHITECTURE } from '@/content/process';

/**
 * PHASE RAIL — the six phases as one line
 * ---------------------------------------------------------------------------
 * Foundation → Content → Resource hub → Lead tools → Email engine → Booked
 * calls. Each box is a real anchor to its own article further down the page,
 * so the rail is the page's table of contents rather than a diagram of one.
 *
 * The arrows only exist at lg and up. Below that the six boxes wrap to a
 * grid and a row of arrows between wrapped rows would be a lie about the
 * reading order.
 */
export function PhaseRail() {
  const steps = ARCHITECTURE.rail;

  return (
    <Rise delay={0.12}>
      <nav aria-label="Six phases" className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:flex lg:items-stretch">
        {steps.map((step, i) => (
          <Fragment key={step.num}>
            <a
              href={step.href}
              className="group flex flex-1 cursor-pointer flex-col rounded-[var(--radius-md)] border border-[var(--rule)] bg-[var(--surface)] px-4 py-4 transition-[border-color,box-shadow] duration-[var(--dur-base)] ease-[var(--ease-expo)] hover:border-[var(--accent-ring)] hover:shadow-[var(--shadow-raised)]"
            >
              <span className="font-label text-[var(--accent)]">{step.num}</span>
              <span className="mt-2 text-[15px] font-[600] leading-tight text-[var(--on-surface)]">
                {step.label}
              </span>
            </a>

            {i < steps.length - 1 && (
              <ArrowRight
                aria-hidden
                size={16}
                strokeWidth={2}
                className="hidden shrink-0 self-center text-[var(--accent)] lg:block"
              />
            )}
          </Fragment>
        ))}
      </nav>
    </Rise>
  );
}

export default PhaseRail;
