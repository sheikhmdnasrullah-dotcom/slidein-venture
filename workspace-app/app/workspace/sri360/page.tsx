import { requireUser } from "@/lib/supabase/server";
import { ComingSoon } from "@/components/dashboard/coming-soon";

export default async function Sri360Page() {
  await requireUser();

  return (
    <ComingSoon
      title="SRI360 Articles"
      description="Article drafts, review status, and publish tracking will live here once SRI360 is connected."
    />
  );
}
