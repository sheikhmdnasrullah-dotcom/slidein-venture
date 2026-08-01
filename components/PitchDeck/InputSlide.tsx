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
        {/* The numeral. By far the largest thing on the slide.
            A single serif "1" is a beautiful shape — let it carry it alone. */}
        <span className="input-numeral font-display-xl tnum block text-[var(--on-surface)]">1</span>

        <p className="input-line font-display-md mt-2 text-[var(--on-surface)] md:mt-3">
          session a week. That is your part.
        </p>

        {/* The rule and the departing dot. The dot is positioned on the rule's
            right end so it reads as detaching, not as a second object that
            appeared. The rule draws in over 900ms; the dot departs the moment
            the rule lands, then leaves the frame. */}
        <span className="input-rule-track relative mt-7 block md:mt-9" aria-hidden>
          <span className="input-rule block h-px w-full bg-[var(--accent-vivid)]" />
          <span className="input-dot" />
        </span>
      </div>

      {/* Bottom left: the only supporting fact allowed on this slide.
          Bottom right stays empty on purpose — the emptiness is the point. */}
      <span className="input-footnote font-mono absolute bottom-0 left-0 text-[var(--muted)] uppercase tracking-widest">
        45 Minutes · Every Monday
      </span>

      <style>{`
        /* ~240px at full size. A single "1" in serif has ink traps and elegant
           proportions — at this scale it is a shape, not just a character.
           The 7rem floor still reads as the loudest thing at 390px viewport. */
        .input-numeral {
          font-size: clamp(7rem, 20vw, 15rem);
          line-height: 0.84;
          font-variant-numeric: tabular-nums;
          /* Slight tighten for the display serif at this scale */
          letter-spacing: -0.02em;
        }

        /* 40px at full size. One line, never two — the sentence is the slide's
           single statement. Two lines would turn it into a paragraph. */
        .input-line {
          font-size: clamp(0.875rem, 3.1vw, 2.5rem);
          letter-spacing: var(--tracking-display-md);
        }

        /* 380px as specified, but capped at 54vw so the rule clears the nav
           arrows on small screens. */
        .input-rule-track {
          width: min(380px, 54vw);
        }

        /* Rule draws left to right over 900ms in brand orange. */
        @keyframes input-rule-draw {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }

        .input-rule {
          transform-origin: left center;
          animation: input-rule-draw var(--dur-reveal, 0.9s) var(--ease-expo, cubic-bezier(0.16,1,0.3,1)) var(--dur-base, 0.2s) both;
        }

        /* The dot detaches from the rule's right end the moment the rule lands,
           then leaves the frame to the right. 60vw guarantees it clears the
           stage at every breakpoint; the stage clips it. */
        @keyframes input-dot-depart {
          0%   { transform: translate(0, -50%) scale(0.4); opacity: 0; }
          10%  { transform: translate(0, -50%) scale(1);   opacity: 1; }
          22%  { transform: translate(0, -50%) scale(1);   opacity: 1; }
          100% { transform: translate(60vw, -50%) scale(1); opacity: 0; }
        }

        .input-dot {
          position: absolute;
          right: 0;
          top: 50%;
          width: 6px;
          height: 6px;
          border-radius: var(--radius-pill, 9999px);
          background: var(--accent-vivid);
          box-shadow: 0 0 10px color-mix(in oklch, var(--accent-vivid) 70%, transparent);
          animation: input-dot-depart calc(var(--dur-reveal, 0.9s) * 1.9) var(--ease-std, cubic-bezier(0.4,0,0.2,1))
                     calc(var(--dur-base, 0.2s) + var(--dur-reveal, 0.9s)) both;
        }

        .input-footnote {
          font-size: 0.65rem;
          letter-spacing: 0.12em;
        }

        /* The global backstop collapses durations to 1ms, which leaves the
           rule drawn (correct end state) and the dot already gone. */
        @media (prefers-reduced-motion: reduce) {
          .input-rule { animation: none; transform: scaleX(1); }
          .input-dot  { animation: none; opacity: 0; }
        }
      `}</style>
    </div>
  );
}
