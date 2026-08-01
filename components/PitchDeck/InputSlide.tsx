'use client';

/**
 * SLIDE 01 — THE INPUT
 * ---------------------------------------------------------------------------
 * One job: state the trade in one look. You give 45 minutes a week, and that
 * is the entire ask.
 *
 * This is the most minimal slide in the deck, and it is the one that has to
 * earn the next click. Everything here is a subtraction that was argued for:
 *
 *   · No eyebrow, no subhead, no button, no icon. A microphone or a waveform
 *     would make it a stock slide — the number has to carry it alone. Cover
 *     everything except the "45": if the slide is still ~80% as effective, the
 *     numeral is big enough.
 *   · The block sits at 42% of the canvas height, not 50%. Perfect vertical
 *     centring is what you get when nobody made a decision; more space below
 *     than above is a decision, and it makes the slide feel like it is looking
 *     up rather than floating.
 *   · The six-stage pipeline that used to open the deck moved to slide 06. At
 *     position 1 it was a status readout for a system nobody had been
 *     introduced to yet, which reads as ornament.
 *
 * THE THREAD
 * The rule draws left to right, then a single dot detaches from its right end
 * and travels off the right edge of the frame. That dot is the recording
 * entering the system, and it is the one continuous idea the deck is built on:
 * every slide after this one opens with the same dot arriving from the left
 * (see ThreadArrival in PitchDeck.tsx).
 */

export default function InputSlide() {
  return (
    <div className="relative h-full w-full">
      {/* 42%, not 50%. See the note above — this is the whole composition. */}
      <div className="absolute inset-x-0 top-[42%] flex -translate-y-1/2 flex-col items-center px-11 text-center sm:px-4">
        {/* The numeral. By far the largest thing on the slide, and deliberately
            larger than anything else in the entire deck. */}
        <span className="input-45 font-display-xl tnum block text-[var(--on-surface)]">45</span>

        <p className="input-line font-display-md mt-2 text-[var(--on-surface)] md:mt-3">
          minutes a week. That is your part.
        </p>

        {/* The rule and the departing dot. The dot is positioned on the rule's
            right end, so it reads as detaching rather than as a second object
            that happened to appear. */}
        <span className="input-rule-track relative mt-7 block md:mt-9" aria-hidden>
          <span className="input-rule block h-px w-full bg-[var(--accent-vivid)]" />
          <span className="input-dot" />
        </span>
      </div>

      {/* The only supporting fact allowed on this slide. Bottom right stays
          empty on purpose — the emptiness is the point. */}
      <span className="font-label absolute bottom-0 left-0 text-[var(--muted)]">
        One session · Every Monday
      </span>

      <style>{`
        /* ~240px at full size, with a floor that still reads as the loudest
           thing on the slide at 390px. */
        .input-45 {
          font-size: clamp(6.5rem, 17vw, 15rem);
          line-height: 0.84;
        }

        /* 40px at full size. One line, never two — the reserver is the measure
           itself, so it is allowed to wrap only below 480px. */
        /* 40px at full size. The 0.875rem floor is measured, not chosen: the
           arrow-safe measure at 390px is 220px, and this sentence sets at 211px
           at 14px and 226px at 15px — so 14px is the largest size that still
           holds ONE line. Two lines would turn the slide's single statement
           into a paragraph, and the whole composition is that it is one. */
        .input-line {
          font-size: clamp(0.875rem, 3.1vw, 2.5rem);
          letter-spacing: var(--tracking-display-md);
        }

        /* 380px as specified, but capped at 54vw so the rule stops short of the
           deck's nav arrows on small screens. At 62vw it ran three pixels under
           the left one, which reads as a mistake rather than as a layer. */
        .input-rule-track {
          width: min(380px, 54vw);
        }

        @keyframes input-rule-draw {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }

        .input-rule {
          transform-origin: left center;
          animation: input-rule-draw var(--dur-reveal) var(--ease-expo) var(--dur-base) both;
        }

        /* The dot detaches from the rule's right end the moment the rule lands,
           then leaves the frame. 60vw guarantees it clears the stage at every
           breakpoint; the stage clips it. */
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
          border-radius: var(--radius-pill);
          background: var(--accent-vivid);
          box-shadow: 0 0 10px color-mix(in oklch, var(--accent-vivid) 70%, transparent);
          animation: input-dot-depart calc(var(--dur-reveal) * 1.9) var(--ease-std)
                     calc(var(--dur-base) + var(--dur-reveal)) both;
        }

        /* The global backstop collapses durations to 1ms, which leaves the rule
           drawn (correct end state) and the dot already gone. Stated explicitly
           so it survives anyone rewriting the backstop, and so the rule is not
           left at scaleX(0) if the fill mode ever changes. */
        @media (prefers-reduced-motion: reduce) {
          .input-rule { animation: none; transform: scaleX(1); }
          .input-dot  { animation: none; opacity: 0; }
        }
      `}</style>
    </div>
  );
}
