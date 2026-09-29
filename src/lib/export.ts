import type { SearchResult } from "@/types";
import { getPaper } from "@/data/papers";
import { getRepository } from "@/data/repositories";
import { getDataset } from "@/data/datasets";
import { researchGaps } from "@/data/researchGaps";

export function buildReport(s: SearchResult) {
  const papers = s.paperIds.map(getPaper).filter(Boolean).map((p) => ({
    title: p!.title, authors: p!.authors.join(", "), year: p!.year, venue: p!.venue,
    method: p!.method, dataset: getDataset(p!.datasetId)?.name ?? "",
    f1: p!.metrics.find((m) => m.label === "F1 Score")?.value ?? "", source: p!.source,
  }));
  const repos = s.repositoryIds.map(getRepository).filter(Boolean).map((r) => ({
    name: `${r!.owner}/${r!.name}`, stars: r!.stars, language: r!.language,
  }));
  return {
    problemStatement: s.query, generatedAt: new Date().toISOString(), note: "Demo data — sources not yet verified against live APIs.",
    concepts: s.concepts, papers, githubProjects: repos,
    researchGapHypotheses: researchGaps.map((g) => ({ title: g.title, description: g.description })),
  };
}

function download(name: string, content: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement("a");
  a.href = url; a.download = name; a.click();
  URL.revokeObjectURL(url);
}

export const exportJSON = (s: SearchResult) =>
  download("researchlens-report.json", JSON.stringify(buildReport(s), null, 2), "application/json");

export function toCSV(rows: Record<string, unknown>[]) {
  if (!rows.length) return "";
  const keys = Object.keys(rows[0]);
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  return [keys.join(","), ...rows.map((r) => keys.map((k) => esc(r[k])).join(","))].join("\n");
}

export const exportCSV = (s: SearchResult) =>
  download("researchlens-papers.csv", `Problem statement,${JSON.stringify(s.query)}\n\n` + toCSV(buildReport(s).papers), "text/csv");

export const downloadCSV = (name: string, rows: Record<string, unknown>[]) => download(name, toCSV(rows), "text/csv");

export function exportPDF(s: SearchResult) {
  const r = buildReport(s);
  const w = window.open("", "_blank");
  if (!w) return;
  w.document.write(`<html><head><title>ResearchLens Report</title><style>body{font-family:system-ui;padding:32px;color:#0f172a}h1{margin:0}table{border-collapse:collapse;width:100%;font-size:12px}td,th{border:1px solid #cbd5e1;padding:6px;text-align:left}</style></head><body>
<h1>ResearchLens Report</h1><p><i>${r.note}</i></p><h2>Problem statement</h2><p>${r.problemStatement}</p>
<h2>Concepts</h2><p>${r.concepts.join(", ")}</p>
<h2>Related papers</h2><table><tr><th>Title</th><th>Year</th><th>Method</th><th>Dataset</th><th>F1</th><th>Source</th></tr>${r.papers.map((p) => `<tr><td>${p.title}</td><td>${p.year}</td><td>${p.method}</td><td>${p.dataset}</td><td>${p.f1}</td><td>${p.source}</td></tr>`).join("")}</table>
<h2>GitHub projects</h2><ul>${r.githubProjects.map((g) => `<li>${g.name} — ${g.language}, ★${g.stars}</li>`).join("")}</ul>
<h2>Research gap hypotheses (AI-generated)</h2><ul>${r.researchGapHypotheses.map((g) => `<li><b>${g.title}</b>: ${g.description}</li>`).join("")}</ul>
</body></html>`);
  w.document.close();
  w.focus();
  w.print();
}
