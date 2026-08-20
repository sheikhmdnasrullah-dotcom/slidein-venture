import { createServiceClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("task_runs")
    .select("id, task_type, status, command, exit_code, started_at, completed_at, triggered_by, knowledge_item_id")
    .order("started_at", { ascending: false })
    .limit(100);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data ?? []);
}
