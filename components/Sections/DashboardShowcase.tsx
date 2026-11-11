'use client';

/**
 * DASHBOARD SHOWCASE: the agentic dashboard, compact and still. No pinning, no
 * scroll-driven stages: it sits on the page like any other visual and is
 * explored by clicking its sidebar. Five screens, one sample run. The headline is the owner's dashboardTagline
 * (content/home.ts), set like the other section titles.
 */

import '@/app/styles/home-sections.css';
import Dashboard from '@/components/Dashboard/Dashboard';
import SplitTitle from '@/components/Sections/SplitTitle';
import { Band } from '@/components/Sections/primitives';
import { HOME } from '@/content/home';

export default function DashboardShowcase() {
  const { full, highlight } = HOME.dashboardTagline;
  const at = full.indexOf(highlight);
  const pre = at < 0 ? full : full.slice(0, at);
  const post = at < 0 ? '' : full.slice(at + highlight.length);

  return (
    <Band id="dashboard" tone="flat">
      <div className="dsh mx-auto max-w-[1272px]">
        <SplitTitle className="sb-h" parts={[pre, ...(at >= 0 ? [{ mark: highlight }] : []), post]} />
        <div className="dsh-card" data-testid="dashboard-card">
          <Dashboard />
        </div>
      </div>
    </Band>
  );
}
