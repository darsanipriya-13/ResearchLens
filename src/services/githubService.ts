// MOCK SERVICE — not connected to the GitHub API yet.
import type { Repository } from "@/types";
import { repositories } from "@/data/repositories";

export async function findImplementations(paperId: string): Promise<Repository[]> {
  return repositories.filter((r) => r.paperId === paperId);
}
