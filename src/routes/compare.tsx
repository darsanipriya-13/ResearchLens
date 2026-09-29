import { createFileRoute, Link } from "@tanstack/react-router";
import { X, Download, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { EmptyState, PageHeader } from "@/components/common";
import { useStore } from "@/lib/store";
import { getPaper, papers } from "@/data/papers";
import { getDataset } from "@/data/datasets";
import { downloadCSV } from "@/lib/export";
import type { Paper } from "@/types";
import { toast } from "sonner";

export const Route = createFileRoute("/compare")({
  head: () => ({
    meta: [
      { title: "Compare Research — ResearchLens" },
      { name: "description", content: "Side-by-side comparison of methods, datasets and results." },
      { property: "og:title", content: "Compare Research — ResearchLens" },
      { property: "og:description", content: "Side-by-side comparison of methods, datasets and results." },
    ],
  }),
  component: ComparePage,
});

const metric = (p: Paper, l: string) => `${p.metrics.find((m) => m.label === l)?.value ?? "—"}%`;
const rows: [string, (p: Paper) => string][] = [
  ["Year", (p) => String(p.year)],
  ["Venue", (p) => p.venue],
  ["Method", (p) => p.method],
  ["Dataset", (p) => getDataset(p.datasetId)?.name ?? "—"],
  ["Accuracy", (p) => metric(p, "Accuracy")],
  ["Precision", (p) => metric(p, "Precision")],
  ["Recall", (p) => metric(p, "Recall")],
  ["F1 Score", (p) => metric(p, "F1 Score")],
  ["GitHub", (p) => (p.repositoryId ? "Available" : "Not found")],
  ["Open Access", (p) => (p.openAccess ? "Yes" : "No")],
  ["Source", (p) => p.source],
];

function ComparePage() {
  const { compare, removeCompare, toggleCompare, current } = useStore();
  const selected = compare.map(getPaper).filter(Boolean) as Paper[];
  const suggestions = (current ? current.paperIds.map(getPaper) : papers).filter((p): p is Paper => !!p);

  const exportIt = () => {
    downloadCSV("researchlens-comparison.csv", rows.map(([f, fn]) => Object.fromEntries([["Feature", f], ...selected.map((p, i) => [`Paper ${i + 1}: ${p.title}`, fn(p)])])));
    toast.success("Comparison exported");
  };

  return (
    <div>
      <PageHeader title="Compare Research" subtitle="Select 2–3 papers to compare methods, datasets and results." actions={<Button onClick={exportIt} disabled={!selected.length}><Download className="size-4" /> Export Comparison</Button>} />

      <div className="mb-6 rounded-xl border border-border bg-card p-4 shadow-card">
        <p className="mb-3 text-sm font-medium">Select papers</p>
        <div className="grid gap-2 md:grid-cols-2">
          {suggestions.map((p) => (
            <label key={p.id} className="flex cursor-pointer items-center gap-2 rounded-lg p-2 text-sm hover:bg-muted">
              <Checkbox checked={compare.includes(p.id)} onCheckedChange={() => toggleCompare(p.id)} />
              <span className="line-clamp-1">{p.title}</span>
            </label>
          ))}
        </div>
      </div>

      {selected.length === 0 ? (
        <EmptyState title="No papers selected" message="Pick papers above or use the Compare button on any paper card." action={<Button variant="outline" asChild><Link to="/discover"><Plus className="size-4" /> Browse results</Link></Button>} />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-card">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/60">
                <th className="w-36 p-3 text-left font-semibold">Feature</th>
                {selected.map((p, i) => (
                  <th key={p.id} className="p-3 text-left align-top font-normal">
                    <p className="text-xs text-muted-foreground">Paper {i + 1}</p>
                    <Link to="/papers/$id" params={{ id: p.id }} className="font-semibold hover:text-primary">{p.title}</Link>
                    <Button size="sm" variant="ghost" className="mt-1 h-7 px-2 text-xs" onClick={() => removeCompare(p.id)}><X className="size-3" /> Remove</Button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(([f, fn]) => (
                <tr key={f} className="border-b border-border last:border-0">
                  <td className="p-3 font-medium text-muted-foreground">{f}</td>
                  {selected.map((p) => <td key={p.id} className="p-3">{fn(p)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
