import { SiteHeader } from "@/components/dashboard/site-header";
import { Card, CardContent } from "@/components/ui/card";

export function ComingSoon({ title, description }: { title: string; description: string }) {
  return (
    <>
      <SiteHeader title={title} />
      <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        <Card className="[--card-spacing:1.5rem]">
          <CardContent className="flex flex-col items-start gap-2">
            <span className="text-sm font-medium text-foreground">Coming soon</span>
            <p className="text-sm text-muted-foreground">{description}</p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
