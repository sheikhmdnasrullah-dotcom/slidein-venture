import type { DashboardResponse, ChartPoint, ActivityRow, KpiCard } from "@/lib/dashboard/types";

const DAY_MS = 24 * 60 * 60 * 1000;

function buildChart(days: number): ChartPoint[] {
  const points: ChartPoint[] = [];
  const today = new Date("2026-08-18T00:00:00Z");

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today.getTime() - i * DAY_MS);
    const weekday = date.getUTCDay();
    const isWeekend = weekday === 0 || weekday === 6;
    const wave = Math.sin(i / 6) * 14 + Math.sin(i / 21) * 8;
    const sent = Math.round(Math.max(0, (isWeekend ? 12 : 48) + wave));
    const replies = Math.round(Math.max(0, sent * 0.11 + Math.sin(i / 9) * 2));

    points.push({
      date: date.toISOString().slice(0, 10),
      sent,
      replies,
    });
  }

  return points;
}

const KPIS: KpiCard[] = [
  {
    id: "emails-sent",
    label: "Emails Sent (7d)",
    value: "342",
    trend: { direction: "up", label: "+8.4% reply rate" },
    context: "vs. 315 the week prior",
    subline: "26 sequences active across 4 lists",
  },
  {
    id: "active-prospects",
    label: "Active Prospects in Pipeline",
    value: "128",
    trend: { direction: "up", label: "+11 moved stage" },
    context: "19 in discovery call stage",
    subline: "6 proposals sent this week",
  },
  {
    id: "articles-production",
    label: "Articles in Production (SRI360)",
    value: "14",
    trend: { direction: "flat", label: "no change" },
    context: "9 in review · 5 published",
    subline: "2 awaiting founder edit",
  },
  {
    id: "deliverability",
    label: "Deliverability Health",
    value: "97.2%",
    trend: { direction: "down", label: "-0.6pt bounce" },
    context: "sender reputation: good",
    subline: "0.4% bounce rate this week",
  },
];

const ACTIVITY: ActivityRow[] = [
  {
    id: "act-1",
    item: "Cold email reply-rate benchmarks 2026",
    type: "research",
    status: "active",
    source: "Knowledge base",
    updatedAt: "2026-08-18T01:22:00Z",
  },
  {
    id: "act-2",
    item: "Q3 outreach sequence — creator vertical",
    type: "prospects",
    status: "proposed",
    source: "Cold outreach pipeline",
    updatedAt: "2026-08-17T22:10:00Z",
  },
  {
    id: "act-3",
    item: "PDF ingestion SOP for knowledge uploads",
    type: "sops",
    status: "active",
    source: "Knowledge base",
    updatedAt: "2026-08-17T15:44:00Z",
  },
  {
    id: "act-4",
    item: "Switch SRI360 review to two-pass edit",
    type: "decisions",
    status: "ai_inferred",
    source: "Strategy board",
    updatedAt: "2026-08-16T19:05:00Z",
  },
  {
    id: "act-5",
    item: "Supabase full-text search index config",
    type: "system",
    status: "active",
    source: "Ops log",
    updatedAt: "2026-08-15T09:30:00Z",
  },
];

export async function GET() {
  const response: DashboardResponse = {
    kpis: KPIS,
    chart: buildChart(90),
    activity: ACTIVITY,
    syncedAt: new Date().toISOString(),
  };

  return Response.json(response);
}
