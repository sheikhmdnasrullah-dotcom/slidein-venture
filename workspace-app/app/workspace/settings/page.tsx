import { requireUser } from "@/lib/supabase/server";
import { ComingSoon } from "@/components/dashboard/coming-soon";

export default async function SettingsPage() {
  await requireUser();

  return <ComingSoon title="Settings" description="Account and workspace settings will live here." />;
}
