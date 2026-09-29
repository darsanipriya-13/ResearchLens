// MOCK SERVICE — not connected to the real Semantic Scholar API yet.
// Swap the body of searchPapers for a fetch call; the UI depends only on the Paper type.
import type { Paper } from "@/types";
import { papers } from "@/data/papers";

export async function searchPapers(query: string): Promise<Paper[]> {
  const q = query.toLowerCase();
  return papers.filter((p) => p.source === "Semantic Scholar" && (p.title.toLowerCase().includes(q) || q.length === 0));
}
