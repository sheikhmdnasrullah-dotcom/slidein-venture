import { SupabaseClient } from "@supabase/supabase-js";
import { chunkBody } from "./chunking";

// Rebuilds knowledge_chunks for one item from its current body. Call after
// every successful knowledge_items insert/update — same wiring shape as
// recordVersion(), so chunks never drift out of sync with content.
export async function reindexChunks(
  supabase: SupabaseClient,
  knowledgeItemId: string,
  body: string
) {
  const { error: deleteError } = await supabase
    .from("knowledge_chunks")
    .delete()
    .eq("knowledge_item_id", knowledgeItemId);
  if (deleteError) {
    throw new Error(`chunk reindex for '${knowledgeItemId}' failed: ${deleteError.message}`);
  }

  const chunks = chunkBody(body);
  if (chunks.length === 0) return;

  const { error: insertError } = await supabase.from("knowledge_chunks").insert(
    chunks.map((chunk) => ({
      knowledge_item_id: knowledgeItemId,
      chunk_index: chunk.chunkIndex,
      heading: chunk.heading,
      text: chunk.text,
      start_offset: chunk.startOffset,
      end_offset: chunk.endOffset,
    }))
  );
  if (insertError) {
    throw new Error(`chunk reindex for '${knowledgeItemId}' failed: ${insertError.message}`);
  }
}
