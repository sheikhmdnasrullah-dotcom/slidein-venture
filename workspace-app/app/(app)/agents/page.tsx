import { requireUser } from "@/lib/supabase/server";
import { ComingSoon } from "@/components/dashboard/coming-soon";

export default async function AgentsPage() {
  await requireUser();
  return (
    <ComingSoon
      title="Agents"
      description="Live + historical agent runs from task_runs. Progress reporting (43/100) appears here once task_run_events lands. Realtime via Supabase Realtime — same channel the execution panel already uses."
    />
  );
}
