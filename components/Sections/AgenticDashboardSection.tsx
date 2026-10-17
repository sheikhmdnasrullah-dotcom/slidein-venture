'use client';

/**
 * AGENTIC DASHBOARD SECTION — the full-view autonomous workspace
 * ---------------------------------------------------------------------------
 * Positioned immediately following the Multi-Agent Fan-Out.
 * Gives the living Agentic Dashboard the full, compact, proper grand view
 * it deserves on the website screen, perfectly animated and interactive.
 */

import AgenticDashboard from '@/components/DashboardPreview/AgenticDashboard';
import { Band, Reveal } from '@/components/Sections/primitives';
import { useSettledStill } from '@/lib/useSettledStill';

export default function AgenticDashboardSection() {
  const calm = useSettledStill();

  return (
    <Band tone="flat" id="dashboard" className="relative py-12 md:py-20">
      <div className="mx-auto max-w-[1280px] px-2 sm:px-4">
        <Reveal y={20}>
          <div
            className="w-full overflow-hidden rounded-[24px] sm:rounded-[32px] border border-[var(--scaffold-hairline)] bg-white shadow-[var(--scaffold-shadow-object)]"
          >
            <AgenticDashboard still={calm} compact={false} />
          </div>
        </Reveal>
      </div>
    </Band>
  );
}
