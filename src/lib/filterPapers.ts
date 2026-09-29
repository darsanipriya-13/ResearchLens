import type { Paper } from "@/types";
import type { Filters } from "@/components/FilterPanel";
import { getDataset } from "@/data/datasets";

export function filterPapers(list: Paper[], f: Filters) {
  return list.filter((p) => {
    if (f.years.length && !f.years.some((y) => (y === "before" ? p.year < 2023 : p.year === Number(y)))) return false;
    if (f.methods.length && !f.methods.some((m) => p.method === m || p.concepts.includes(m))) return false;
    if (f.datasets.length && !f.datasets.includes(p.datasetId)) return false;
    if (f.sources.length && !f.sources.includes(p.source)) return false;
    for (const a of f.availability) {
      if (a === "Open Access" && !p.openAccess) return false;
      if (a === "PDF Available" && !p.pdfAvailable) return false;
      if (a === "GitHub Available" && !p.repositoryId) return false;
      if (a === "Dataset Available" && getDataset(p.datasetId)?.availability !== "Public") return false;
    }
    return true;
  });
}
