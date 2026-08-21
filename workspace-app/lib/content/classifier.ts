/**
 * Content Classifier — rule-based first, NVIDIA LLM later.
 *
 * Takes a raw artifact (file, text, metadata) and returns a classified
 * content object with `content_type` + extracted structure. No LLM codegen;
 * the classifier only emits the enum + extracted fields, which the registry
 * validates via Zod before persisting.
 */

import { AnyContent, ContentType, CONTENT_SCHEMAS, validateContent } from "./registry";

export type ClassifiedContent = AnyContent & { raw_payload?: unknown };

/**
 * Input artifact from an upload, agent output, import, or research.
 */
export type ArtifactInput =
  | { kind: "text"; text: string; filename?: string; mime_type?: string; metadata?: Record<string, unknown> }
  | { kind: "file"; buffer: Buffer; filename: string; mime_type: string; metadata?: Record<string, unknown> }
  | { kind: "research"; findings: string; sources: string[]; entities?: string[]; metadata?: Record<string, unknown> }
  | { kind: "agent_execution"; agent_type: string; output: string; task_id?: string; progress?: { current: number; total: number; current_item?: string }; metadata?: Record<string, unknown> }
  | { kind: "web_research"; queries: string[]; findings: string; sources: Array<{ url: string; title: string; snippet: string }>; metadata?: Record<string, unknown> }
  | { kind: "structured"; data: Record<string, unknown>; mime_type: string; filename?: string; metadata?: Record<string, unknown> };

/**
 * Result of classification.
 */
export type ClassificationResult =
  | { success: true; content: ClassifiedContent }
  | { success: false; error: string; fallback: ClassifiedContent };

/**
 * Detect content type from filename + mime type (rule-based, no LLM).
 */
function detectByMimeAndFilename(filename: string, mimeType: string): ContentType {
  const ext = filename.toLowerCase().split(".").pop() ?? "";

  if (ext === "csv" || mimeType === "text/csv") return ContentType.CSV;
  if (ext === "pdf" || mimeType === "application/pdf") return ContentType.PDF;
  if (mimeType.startsWith("image/")) return ContentType.IMAGE;
  if (ext === "md" || ext === "txt" || mimeType === "text/plain" || mimeType === "text/markdown") return ContentType.TEXT;
  if (ext === "json" || mimeType === "application/json") return ContentType.DOCUMENT;
  if (ext === "xlsx" || ext === "xls" || mimeType.includes("spreadsheet")) return ContentType.SPREADSHEET;

  return ContentType.UNKNOWN;
}

/**
 * Heuristic content analysis for text-based artifacts.
 */
function analyzeTextContent(text: string, hintType?: ContentType): { type: ContentType; extracted: Record<string, unknown> } {
  const lower = text.toLowerCase();
  const lines = text.split("\n").filter((l) => l.trim().length > 0);

  const hasFrontmatter = text.startsWith("---") && text.indexOf("---", 3) > 0;
  const hasCitations = /\[\d+\]|\(https?:\/\//.test(text);
  const hasFindings = /findings?|conclusion|evidence|source:/i.test(text);
  const hasSteps = /^(\d+\.|-\s|step\s*\d)/im.test(text);
  const hasDecision = /decision|resolved|agreed|chosen|we will/i.test(text);
  const looksLikeCSV = lines.length > 2 && lines[0].includes(",") && lines.every((l) => l.split(",").length === lines[0].split(",").length);
  const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text);
  const hasCompany = /company|organization|firm|startup/i.test(text);

  if (hintType && hintType !== ContentType.TEXT && hintType !== ContentType.DOCUMENT && hintType !== ContentType.UNKNOWN) {
    return { type: hintType, extracted: {} };
  }

  if (hasCitations && hasFindings && lines.length > 10) {
    return { type: ContentType.RESEARCH, extracted: {} };
  }
  if (hasSteps && /procedure|process|standard|operating/i.test(text)) {
    return { type: ContentType.SOP, extracted: {} };
  }
  if (hasDecision && lines.length < 50) {
    return { type: ContentType.DECISION, extracted: {} };
  }
  if (looksLikeCSV) {
    const headers = lines[0].split(",").map((h) => h.trim());
    const rows = lines.slice(1).map((l) => l.split(",").map((c) => c.trim()));
    return { type: ContentType.CSV, extracted: { headers, rows, row_count: rows.length } };
  }
  if (hasEmail && hasCompany && lines.length < 30) {
    return { type: ContentType.LEAD, extracted: {} };
  }
  return { type: ContentType.DOCUMENT, extracted: {} };
}

/**
 * Classify a text artifact.
 */
export async function classifyTextArtifact(
  text: string,
  filename?: string,
  metadata?: Record<string, unknown>
): Promise<ClassificationResult> {
  const { type, extracted } = analyzeTextContent(text);
  const title = filename?.replace(/\.[^.]+$/, "") || "Untitled";

  const base = {
    content_type: type,
    title,
    source: metadata?.source as string | undefined,
    author: metadata?.author as string | undefined,
    tags: (metadata?.tags as string[]) ?? [],
    metadata: { ...metadata, ...extracted },
  } as ClassifiedContent;

  let content: ClassifiedContent;

  switch (type) {
    case ContentType.RESEARCH:
      content = { ...base, body: text, findings: [], entities: [] };
      break;
    case ContentType.SOP:
      content = { ...base, body: text, version: "1.0" };
      break;
    case ContentType.DECISION:
      content = { ...base, body: text, status: "proposed", related: [] };
      break;
    case ContentType.CSV:
      content = { ...base, headers: extracted.headers as string[], rows: extracted.rows as string[][], row_count: extracted.row_count as number, delimiter: "," };
      break;
    case ContentType.LEAD:
      content = { ...base, email: text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)?.[0] };
      break;
    case ContentType.SOP:
      content = { ...base, body: text, version: "1.0" };
      break;
    case ContentType.DECISION:
      content = { ...base, body: text, status: "proposed", related: [] };
      break;
    case ContentType.INSIGHT:
      content = { ...base, body: text, evidence_refs: [], confidence: 0.8 };
      break;
    default:
      content = { ...base, body: text };
  }

  const validation = validateContent(content);
  if (validation.success) return { success: true, content: validation.data! };
  return { success: false, error: validation.error!, fallback: validation.fallback! };
}

/**
 * Classify a file artifact (PDF, image, spreadsheet, etc.).
 */
export async function classifyFileArtifact(
  buffer: Buffer,
  filename: string,
  mimeType: string,
  metadata?: Record<string, unknown>
): Promise<ClassificationResult> {
  const hintType = detectByMimeAndFilename(filename, mimeType);

  if (hintType === ContentType.PDF) {
    return classifyPDF(buffer, filename, metadata);
  }
  if (hintType === ContentType.IMAGE) {
    return classifyImage(buffer, filename, metadata);
  }
  if (hintType === ContentType.SPREADSHEET) {
    return classifySpreadsheet(buffer, filename, metadata);
  }
  if (hintType === ContentType.CSV) {
    return classifyCSV(buffer, filename, metadata);
  }

  // Fallback: try to read as text
  try {
    const text = buffer.toString("utf-8");
    return classifyTextArtifact(text, filename, metadata);
  } catch {
    return {
      success: false,
      error: "Unable to decode file as text",
      fallback: {
        content_type: ContentType.UNKNOWN,
        title: filename,
        tags: [],
        metadata,
        raw_payload: { filename, mimeType, size: buffer.length },
      },
    };
  }
}

/**
 * Classify PDF — extract text + metadata using pdf-parse.
 */
async function classifyPDF(buffer: Buffer, filename: string, metadata?: Record<string, unknown>): Promise<ClassificationResult> {
  try {
    const pdfParse = await import("pdf-parse");
    const data = await pdfParse.default(buffer);
    const text = data.text || "";
    const pageCount = data.numpages || 0;

    const { type } = analyzeTextContent(text, ContentType.PDF);

    const content: ClassifiedContent = {
      content_type: ContentType.PDF,
      title: filename.replace(/\.pdf$/i, ""),
      source: metadata?.source as string | undefined,
      author: metadata?.author as string | undefined,
      tags: (metadata?.tags as string[]) ?? [],
      metadata: { ...metadata, page_count: pageCount, extracted_text_length: text.length },
      body: text.substring(0, 10000),
      page_count: pageCount,
      extracted_text: text.length > 10000 ? text.substring(0, 10000) + "…" : text,
    };

    const validation = validateContent(content);
    if (validation.success) return { success: true, content: validation.data! };
    return { success: false, error: validation.error!, fallback: validation.fallback! };
  } catch (error) {
    return {
      success: false,
      error: `PDF parsing failed: ${error}`,
      fallback: {
        content_type: ContentType.PDF,
        title: filename.replace(/\.pdf$/i, ""),
        tags: [],
        metadata: { ...metadata, error: String(error) },
        page_count: 0,
      },
    };
  }
}

/**
 * Classify image — metadata only (OCR later).
 */
async function classifyImage(buffer: Buffer, filename: string, metadata?: Record<string, unknown>): Promise<ClassificationResult> {
  const content: ClassifiedContent = {
    content_type: ContentType.IMAGE,
    title: filename.replace(/\.[^.]+$/, ""),
    source: metadata?.source as string | undefined,
    author: metadata?.author as string | undefined,
    tags: (metadata?.tags as string[]) ?? [],
    metadata: { ...metadata, file_size: buffer.length },
    file_size: buffer.length,
  };

  const validation = validateContent(content);
  return validation.success
    ? { success: true, content: validation.data! }
    : { success: false, error: validation.error!, fallback: validation.fallback! };
}

/**
 * Classify spreadsheet (xlsx/xls) — basic extraction without xlsx dep.
 * For now, falls back to UNKNOWN with metadata.
 */
async function classifySpreadsheet(buffer: Buffer, filename: string, metadata?: Record<string, unknown>): Promise<ClassificationResult> {
  return {
    success: false,
    error: "Spreadsheet parsing requires 'xlsx' package (not installed due to security advisories). Use CSV instead.",
    fallback: {
      content_type: ContentType.UNKNOWN,
      title: filename,
      tags: [],
      metadata: { ...metadata, error: "xlsx not installed", original_type: "spreadsheet" },
      raw_payload: { filename, size: buffer.length },
    },
  };
}

/**
 * Classify CSV — parse headers + rows.
 */
async function classifyCSV(buffer: Buffer, filename: string, metadata?: Record<string, unknown>): Promise<ClassificationResult> {
  try {
    const text = buffer.toString("utf-8");
    const lines = text.split("\n").filter((l) => l.trim().length > 0);
    const delimiter = text.includes("\t") ? "\t" : ",";
    const headers = lines[0]?.split(delimiter).map((h) => h.trim()) || [];
    const rows = lines.slice(1).map((l) => l.split(delimiter).map((c) => c.trim()));

    const content: ClassifiedContent = {
      content_type: ContentType.CSV,
      title: filename.replace(/\.csv$/i, ""),
      source: metadata?.source as string | undefined,
      author: metadata?.author as string | undefined,
      tags: (metadata?.tags as string[]) ?? [],
      metadata: { ...metadata, row_count: rows.length, delimiter },
      headers,
      rows,
      row_count: rows.length,
    };

    const validation = validateContent(content);
    return validation.success
      ? { success: true, content: validation.data! }
      : { success: false, error: validation.error!, fallback: validation.fallback! };
  } catch (error) {
    return {
      success: false,
      error: `CSV parsing failed: ${error}`,
      fallback: {
        content_type: ContentType.UNKNOWN,
        title: filename,
        tags: [],
        metadata: { ...metadata, error: String(error) },
      },
    };
  }
}

/**
 * Classify agent execution output.
 */
export function classifyAgentExecution(
  agentType: string,
  output: string,
  taskId?: string,
  progress?: { current: number; total: number; current_item?: string },
  metadata?: Record<string, unknown>
): ClassificationResult {
  const content: ClassifiedContent = {
    content_type: ContentType.AGENT_EXECUTION,
    title: `${agentType} execution${taskId ? ` — ${taskId}` : ""}`,
    source: "agent",
    author: "system",
    tags: ["agent", agentType],
    metadata: { ...metadata, agent_type: agentType, task_id: taskId },
    body: output,
    agent_type: agentType,
    task_id: taskId,
    status: progress ? (progress.current >= progress.total ? "completed" : "running") : "completed",
    progress,
  };

  const validation = validateContent(content);
  return validation.success
    ? { success: true, content: validation.data! }
    : { success: false, error: validation.error!, fallback: validation.fallback! };
}

/**
 * Classify web research output.
 */
export function classifyWebResearch(
  queries: string[],
  findings: string,
  sources: Array<{ url: string; title: string; snippet: string }>,
  metadata?: Record<string, unknown>
): ClassificationResult {
  const content: ClassifiedContent = {
    content_type: ContentType.WEB_RESEARCH,
    title: `Web research: ${queries.slice(0, 3).join(", ")}`,
    source: "web",
    author: "system",
    tags: ["research", "web"],
    metadata: { ...metadata, queries },
    body: findings,
    queries,
    sources,
  };

  const validation = validateContent(content);
  return validation.success
    ? { success: true, content: validation.data! }
    : { success: false, error: validation.error!, fallback: validation.fallback! };
}

/**
 * Main classify entry point — routes by artifact kind.
 */
export async function classifyArtifact(input: ArtifactInput): Promise<ClassificationResult> {
  switch (input.kind) {
    case "text":
      return classifyTextArtifact(input.text, input.filename, input.metadata);
    case "file":
      return classifyFileArtifact(input.buffer, input.filename, input.mime_type, input.metadata);
    case "research":
      return classifyTextArtifact(input.findings, undefined, {
        ...input.metadata,
        source: "research",
        sources: input.sources,
      });
    case "agent_execution":
      return classifyAgentExecution(
        input.agent_type,
        input.output,
        input.task_id,
        input.progress,
        input.metadata
      );
    case "web_research":
      return classifyWebResearch(
        input.queries,
        input.findings,
        input.sources,
        input.metadata
      );
    case "structured":
      return classifyTextArtifact(JSON.stringify(input.data, null, 2), input.filename, {
        ...input.metadata,
        source: "structured",
      });
    default:
      return {
        success: false,
        error: "Unknown artifact kind",
        fallback: {
          content_type: ContentType.UNKNOWN,
          title: "Unknown",
          tags: [],
          raw_payload: input,
        },
      };
  }
}