import { requireUser } from "@/lib/supabase/server";
import { ComingSoon } from "@/components/dashboard/coming-soon";

export default async function ContentPipelinePage() {
  await requireUser();

  return (
    <ComingSoon
      title="Content Pipeline"
      description="Video and content production stages will surface here once the pipeline automation is connected."
    />
  );
}
