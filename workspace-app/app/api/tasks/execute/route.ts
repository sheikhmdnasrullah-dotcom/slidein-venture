import { createServiceClient } from "@/lib/supabase/server";
import { randomUUID } from "node:crypto";

type TaskType = "script" | "research" | "cold_email" | "automation" | "system";

type TaskRunInput = {
  task_type: TaskType;
  command?: string;
  triggered_by?: string;
  knowledge_item_id?: string;
  metadata?: Record<string, unknown>;
};

export async function POST(request: Request) {
  const supabase = createServiceClient();
  const body = (await request.json()) as TaskRunInput;
  const id = randomUUID();

  const { error } = await supabase.from("task_runs").insert({
    id,
    task_type: body.task_type,
    status: "running",
    command: body.command ?? null,
    triggered_by: body.triggered_by ?? null,
    knowledge_item_id: body.knowledge_item_id ?? null,
    metadata: body.metadata ?? {},
  });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ id, status: "running" }, { status: 201 });
}
