# Slidein — interactive prospect journey

## Preview now
Open **preview.html** in any modern browser. Everything (GSAP, styles, portraits, application code) is embedded. No server, CDN, build step, or network connection is needed.

Choose stages, replay a stage, or select **Play all**. The default is manual click-through, not scroll hijacking. This is a frontend simulation; it does not query real sources, send mail, or create calendar events.

## Add to a Next.js App Router website

1. Install the only additional dependency:
   ```sh
   npm install gsap@^3.13.0
   ```
2. Copy these three files into `components/prospect-journey/`:
   - `ProspectJourney.jsx`
   - `journey.js`
   - `journey.css`
3. Render the component:
   ```jsx
   import ProspectJourney from '@/components/prospect-journey/ProspectJourney';

   export default function Page() {
     return (
       <main style={{ padding: '32px 16px' }}>
         <ProspectJourney />
       </main>
     );
   }
   ```

`initialStage={0}` through `initialStage={5}` starts at a specific stage. No Tailwind, icon library, image host configuration, or GSAP plugins are required. The JSX file can be imported from a TypeScript App Router project as JavaScript.

For the **Pages Router**, move the `journey.css` import out of `ProspectJourney.jsx` into `pages/_app.jsx`, since global CSS imports must live there.

## What is included

- Discover: staggered source cards, measured SVG convergence, profile pulse and source tag.
- Research: branching SVG lines, four cascading insights, example source sidebar.
- Qualify: sequential green validation checks, qualified verdict, 92/100 score, rejected branch.
- Personalize: word-by-word email, three context-to-phrase connections and orange highlights.
- Outreach: queue, an SVG paper plane following a measured Bézier path, and a sent confirmation.
- Converse: dark inbox, positive reply, and delayed meeting-confirmation card.

GSAP timelines orchestrate the animation. SVG endpoints are derived from actual DOM geometry, not screenshot coordinates. ResizeObserver recalculates paths and completes the current sequence on width changes. Mobile layouts reflow vertically. Personalization connectors terminate just below their matching phrase, keeping the text readable. On mobile, connectors use side gutters to avoid crossing intervening cards.

The heading and active navigation update instantly when a stage changes, while its scene fades/slides in. This prototype uses freshly rendered scenes rather than morphing one persistent profile between stages. The email uses a word-opacity reveal, not character typing.

## Accessibility and lifecycle

- Keyboard tabs with Left/Right, Home/End; visible focus; labeled stage panel.
- `prefers-reduced-motion` renders each stage immediately. Autoplay is opt-in.
- Scoped CSS and scoped DOM selectors; unique instance IDs in the React wrapper.
- React cleanup kills the timeline, timers, observers and event listeners. Strict Mode compatible.
- Source portraits were cropped from the reference image you supplied, encoded as transparent PNGs. Confirm commercial usage rights before production.

## Customize

Edit `stages`, `names`, `sceneMarkup`, and `ASSETS` in `journey.js` for content and portraits. All CSS is prefixed with `.sj`; update variables in `journey.css` for your brand. The example uses fictional `acme.example` email addresses. The meeting card is illustrative, not a real booking.

For plain JavaScript, import `mountJourney` from `journey.js` and call `mountJourney(element, gsap, { initialStage: 0, id: 'unique-id' })`. It returns `goTo(index)`, `finish()`, and `destroy()`. For multiple vanilla instances, supply distinct IDs. Call `destroy()` before unmounting.

The `gsap.min.js` distribution is provided for the offline preview and retains its license header. For production, use the package manager dependency and review the upstream GSAP standard license.
