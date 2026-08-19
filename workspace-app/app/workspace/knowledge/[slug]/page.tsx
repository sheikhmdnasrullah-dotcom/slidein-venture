import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser, createServiceClient } from "@/lib/supabase/server";
import { AnimatedSection } from "@/components/knowledge/animated-section";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

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
      "id, type, title, status, source, author, tags, content_path, file_path, content_type, body, created_at, updated_at"
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

  // Relation endpoints are entity ids, which for vault notes are set equal
  // to the note's own knowledge_items.id by the sync script — so this
  // catches links pointing at or away from this item.
  const { data: relations } = await supabase
    .from("relations")
    .select("from_entity_id, to_entity_id, relation_type")
    .or(`from_entity_id.eq.${item.id},to_entity_id.eq.${item.id}`);

  const linkedNotes: {
    direction: "outgoing" | "incoming";
    relationType: string;
    entityId: string;
    title: string;
    slug: string | null;
  }[] = [];

  if (relations && relations.length > 0) {
    const otherIds = [
      ...new Set(
        relations.map((r) => (r.from_entity_id === item.id ? r.to_entity_id : r.from_entity_id))
      ),
    ];

    const [{ data: entities }, { data: linkedItems }] = await Promise.all([
      supabase.from("entities").select("id, name").in("id", otherIds),
      supabase.from("knowledge_items").select("id, slug, title").in("id", otherIds),
    ]);

    const entityNames = new Map((entities ?? []).map((e) => [e.id, e.name]));
    const knowledgeBySlug = new Map((linkedItems ?? []).map((k) => [k.id, k]));

    for (const r of relations) {
      const otherId = r.from_entity_id === item.id ? r.to_entity_id : r.from_entity_id;
      const linkedItem = knowledgeBySlug.get(otherId);
      linkedNotes.push({
        direction: r.from_entity_id === item.id ? "outgoing" : "incoming",
        relationType: r.relation_type,
        entityId: otherId,
        title: linkedItem?.title ?? entityNames.get(otherId) ?? otherId,
        slug: linkedItem?.slug ?? null,
      });
    }
  }

  const outgoing = linkedNotes.filter((n) => n.direction === "outgoing");
  const incoming = linkedNotes.filter((n) => n.direction === "incoming");

  const meta: { label: string; value: string }[] = [
    { label: "ID", value: item.id },
    { label: "Type", value: item.type },
    { label: "Status", value: item.status },
    { label: "Author", value: item.author },
    { label: "Source", value: item.source },
    { label: "Path", value: item.content_path },
    { label: "Content type", value: item.content_type },
    ...(item.file_path ? [{ label: "File", value: item.file_path }] : []),
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

      <AnimatedSection className="flex flex-col gap-2">
        <h1 className="text-lg font-medium">{item.title}</h1>
        {item.tags?.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {item.tags.map((tag: string) => (
              <Badge
                key={tag}
                variant="outline"
                className="border-brand/30 bg-brand-soft font-mono text-signal"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </AnimatedSection>

      <AnimatedSection delay={0.05}>
        <Card>
          <CardContent>
            <dl className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-1 text-sm">
              {meta.map(({ label, value }) => (
                <div key={label} className="contents">
                  <dt className="text-foreground/40">{label}</dt>
                  <dd className="font-mono text-xs self-center">{value}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>
      </AnimatedSection>

      <AnimatedSection delay={0.1}>
        <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans">
          {item.body}
        </pre>
      </AnimatedSection>

      {linkedNotes.length > 0 && (
        <AnimatedSection delay={0.15}>
          <Card>
            <CardContent className="flex flex-col gap-3">
              <h2 className="text-sm font-medium text-foreground/60">Linked notes</h2>
              {outgoing.length > 0 && (
                <div className="flex flex-col gap-1">
                  <p className="text-xs text-foreground/40">Links to</p>
                  {outgoing.map((n) => (
                    <LinkedNoteRow key={`out-${n.entityId}`} note={n} />
                  ))}
                </div>
              )}
              {incoming.length > 0 && (
                <div className="flex flex-col gap-1">
                  <p className="text-xs text-foreground/40">Linked from</p>
                  {incoming.map((n) => (
                    <LinkedNoteRow key={`in-${n.entityId}`} note={n} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </AnimatedSection>
      )}
    </div>
  );
}

function LinkedNoteRow({
  note,
}: {
  note: { relationType: string; title: string; slug: string | null };
}) {
  return (
    <div className="flex items-center gap-2 text-sm">
      {note.slug ? (
        <Link
          href={`/workspace/knowledge/${note.slug}`}
          className="hover:underline hover:text-signal"
        >
          {note.title}
        </Link>
      ) : (
        <span className="text-foreground/60">{note.title}</span>
      )}
      <span className="text-xs font-mono text-foreground/30">{note.relationType}</span>
    </div>
  );
}
