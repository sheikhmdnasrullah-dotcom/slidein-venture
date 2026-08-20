import { requireUser } from "@/lib/supabase/server";
import { DashboardContent } from "@/components/dashboard/dashboard-content";

export default async function WorkspacePage() {
  await requireUser();

  return <DashboardContent />;
}
