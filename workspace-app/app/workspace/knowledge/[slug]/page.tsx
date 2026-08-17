import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser, createServiceClient } from "@/lib/supabase/server";

const dateFormat = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export default async function KnowledgeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await requireUser();
  const { slug } = await params;

  // ponytail: same RLS gap as the list page — see comment there.
  const supabase = createServiceClient();
  const { data: item, error } = await supabase
    .from("knowledge_items")
    .select(
      "id, type, title, status, source, author, tags, content_path, body, created_at, updated_at"
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    return (
      <div className="p-6 max-w-3xl">
        <p className="text-sm text-foreground/60">
          Couldn&apos;t load this item: {error.message}
        </p>
      </div>
    );
  }

  if (!item) {
    notFound();
  }

  const meta: { label: string; value: string }[] = [
    { label: "ID", value: item.id },
    { label: "Type", value: item.type },
    { label: "Status", value: item.status },
    { label: "Author", value: item.author },
    { label: "Source", value: item.source },
    { label: "Path", value: item.content_path },
    { label: "Created", value: dateFormat.format(new Date(item.created_at)) },
    { label: "Updated", value: dateFormat.format(new Date(item.updated_at)) },
  ];

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 max-w-3xl">
      <Link
        href="/workspace/knowledge"
        className="text-xs text-foreground/40 hover:text-foreground/60 hover:underline w-fit"
      >
        ← Knowledge
      </Link>

      <div className="flex flex-col gap-2">
        <h1 className="text-lg font-medium">{item.title}</h1>
        {item.tags?.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {item.tags.map((tag: string) => (
              <span
                key={tag}
                className="font-mono text-xs text-foreground/50 border border-foreground/15 rounded px-1.5 py-0.5"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <dl className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-1 text-sm border-y border-foreground/10 py-3">
        {meta.map(({ label, value }) => (
          <div key={label} className="contents">
            <dt className="text-foreground/40">{label}</dt>
            <dd className="font-mono text-xs self-center">{value}</dd>
          </div>
        ))}
      </dl>

      <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans">
        {item.body}
      </pre>
    </div>
  );
}
