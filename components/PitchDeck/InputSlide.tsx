'use client';

/**
 * SLIDE 01 — THE INPUT
 * ---------------------------------------------------------------------------
 * One job: state the trade in one look. You show up for one session a week,
 * and that is the entire ask.
 *
 * The numeral "1" is by far the largest thing on the slide — set in the
 * display serif at ~240px in ink. A single serif "1" with real ink traps is
 * a beautiful shape. Let it carry the slide.
 *
 * COMPOSITION
 *   · Almost empty. Most minimal slide in the deck; it has to earn the click.
 *   · Block sits at 42%, not 50%. More space below than above — a decision,
 *     not a default. It makes the slide feel like it is looking up.
 *   · Nothing else. No eyebrow, no subhead, no button, no icon.
 *     Adding an icon makes it a stock slide; the number carries it.
 *
 * THE THREAD
 *   A thin horizontal rule sits under the line (~380px). On enter it draws
 *   left to right over 900ms in brand orange. A single dot then detaches from
 *   the right end and travels off the right edge — the recording entering the
 *   system. Every subsequent slide opens with that dot arriving from the left.
 *
 * CHROME (rendered here, not in the shell)
 *   · Bottom left, small mono: "45 MINUTES · EVERY MONDAY"
 *     Strongest fact on the slide, but as a footnote it reads as
 *     understatement rather than pitch — which is stronger.
 *   · Bottom right is intentionally empty. The emptiness is the point.
 *
 * TEST: cover everything except the "1". Is the slide still 80% as effective?
 * If yes, ship it. If no, the number is too small.
 */

export default function InputSlide() {
  return (
    <div className="relative h-full w-full">
      {/* 42%, not 50%. See the note above — this is the whole composition. */}
      <div className="absolute inset-x-0 top-[42%] flex -translate-y-1/2 flex-col items-center px-11 text-center sm:px-4">
        <p className="input-line font-display-md text-[var(--on-surface)] md:mt-3">
          The Framework
        </p>

        {/* The rule. Neutral gray so it blends with the page background. */}
        <span className="input-rule-track relative mt-7 block md:mt-9" aria-hidden>
          <span className="input-rule block h-px w-full bg-[var(--rule)]" />
        </span>
      </div>

      {/* Bottom left: the only supporting fact allowed on this slide.
          Bottom right stays empty on purpose — the emptiness is the point. */}
      <span className="input-footnote font-mono absolute bottom-0 left-0 text-[var(--muted)] uppercase tracking-widest">
        45 Minutes · Every Monday
      </span>

      <style>{`
         .input-line {
           font-size: clamp(0.875rem, 3.1vw, 2.5rem);
           letter-spacing: var(--tracking-display-md);
         }

         /* 380px as specified, but capped at 54vw so the rule clears the nav
            arrows on small screens. */
         .input-rule-track {
           width: min(380px, 54vw);
         }

         /* Rule draws left to right over 900ms in neutral gray. */
         @keyframes input-rule-draw {
           from { transform: scaleX(0); }
           to   { transform: scaleX(1); }
         }

         .input-rule {
           transform-origin: left center;
           animation: input-rule-draw var(--dur-reveal, 0.9s) var(--ease-expo, cubic-bezier(0.16,1,0.3,1)) var(--dur-base, 0.2s) both;
         }

         .input-footnote {
           font-size: 0.65rem;
           letter-spacing: 0.12em;
         }

         /* The global backstop collapses durations to 1ms, which leaves the
            rule drawn (correct end state). */
         @media (prefers-reduced-motion: reduce) {
           .input-rule { animation: none; transform: scaleX(1); }
         }
       `}</style>
    </div>
  );
}
