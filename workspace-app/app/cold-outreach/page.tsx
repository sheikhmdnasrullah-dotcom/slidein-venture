import { requireUser } from "@/lib/supabase/server";
import { ComingSoon } from "@/components/dashboard/coming-soon";

export default async function ColdOutreachPage() {
  await requireUser();

  return (
    <ComingSoon
      title="Cold Outreach"
      description="Prospect pipeline and campaign management lands here once the n8n outreach workflow is wired in."
    />
  );
}
