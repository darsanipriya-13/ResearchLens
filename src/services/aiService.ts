// MOCK SERVICE — replace internals with a real LLM call later; keep the signature.
import type { SearchResult } from "@/types";
import { papers, topicKeywords } from "@/data/papers";
import { repositories } from "@/data/repositories";
import { researchGaps } from "@/data/researchGaps";

const conceptMap: Record<string, string[]> = {
  "fake-news": ["Fake News", "NLP", "Transformers", "Text Classification", "BERT", "Deep Learning"],
  crop: ["Crop Disease", "Computer Vision", "CNN", "Deep Learning", "Edge AI"],
  health: ["Healthcare", "Recommendation", "EHR", "Transformers"],
  education: ["Education", "Knowledge Tracing", "Personalisation", "LSTM"],
  "rag-gov": ["RAG", "LLM", "GovTech", "Question Answering"],
};

export function detectTopic(query: string): string {
  const q = query.toLowerCase();
  let best = "fake-news";
  let score = 0;
  for (const [topic, words] of Object.entries(topicKeywords)) {
    const s = words.filter((w) => q.includes(w)).length;
    if (s > score) { score = s; best = topic; }
  }
  return best;
}

export async function analyzeProblem(query: string): Promise<SearchResult> {
  const topic = detectTopic(query);
  const matched = papers.filter((p) => p.topic === topic);
  const paperIds = matched.map((p) => p.id);
  return {
    id: `s-${Date.now()}`,
    query,
    date: new Date().toISOString(),
    topic,
    concepts: conceptMap[topic] ?? [],
    paperIds,
    repositoryIds: repositories.filter((r) => r.paperId && paperIds.includes(r.paperId)).map((r) => r.id),
    gapCount: researchGaps.length,
  };
}
