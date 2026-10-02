import ProcessDeck from '@/components/Process/ProcessDeck';

/*
 * /process/deck — the process argument as a fixed 16:9 stage.
 *
 * The deck owns its own chrome (counter, progress hairline, controls) and
 * fills the space below the floating navbar. The page is just a frame that
 * hands the viewport to the stage; it decides no values itself.
 */
export default function DeckPage() {
  return (
    <div className="flex w-full flex-col px-5 pb-6 pt-[88px] md:px-8">
      <ProcessDeck />
    </div>
  );
}

