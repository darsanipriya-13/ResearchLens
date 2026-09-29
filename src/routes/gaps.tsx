import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, AlertCircle, Database, Cpu, Compass, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ExportMenu, PageHeader } from "@/components/common";
import { useStore } from "@/lib/store";
import { getPaper, papers } from "@/data/papers";
import { getDataset } from "@/data/datasets";
import { recurringLimitations, researchGaps } from "@/data/researchGaps";
import type { Paper } from "@/types";

export const Route = createFileRoute("/gaps")({
  head: () => ({
    meta: [
      { title: "Research Gap Explorer — ResearchLens" },
      { name: "description", content: "Understand what existing research has covered and what may still need investigation." },
      { property: "og:title", content: "Research Gap Explorer — ResearchLens" },
      { property: "og:description", content: "Understand what existing research has covered and what may still need investigation." },
    ],
  }),
  component: GapsPage,
});

function GapsPage() {
  const { current } = useStore();
  const set = (current?.paperIds.map(getPaper).filter(Boolean) as Paper[]) ?? papers;
  const count = (arr: string[]) => Object.entries(arr.reduce<Record<string, number>>((a, k) => ((a[k] = (a[k] ?? 0) + 1), a), {})).sort((a, b) => b[1] - a[1]);
  const methods = count(set.map((p) => p.method));
  const ds = count(set.map((p) => p.datasetId));
  const flow = [
    { label: "Existing Research", detail: `${set.length} papers`, icon: Database },
    { label: "Common Methods", detail: methods.slice(0, 2).map((m) => m[0]).join(", "), icon: Cpu },
    { label: "Common Limitations", detail: recurringLimitations[0], icon: AlertCircle },
    { label: "Underexplored Areas", detail: researchGaps[0].title, icon: Compass },
    { label: "Potential Direction", detail: researchGaps[1].title, icon: Sparkles },
  ];

  return (
    <div>
      <PageHeader title="Research Gap Explorer" subtitle="Understand what existing research has covered — and what may still need investigation." actions={<ExportMenu search={current} />} />

      <div className="mb-6 flex gap-3 rounded-xl border border-primary/30 bg-accent p-4 text-sm text-accent-foreground">
        <Info className="size-5 shrink-0" />
        <p><b>AI-generated research gap hypotheses.</b> These are suggestions based on the currently displayed research set and should be verified against original papers.</p>
      </div>

      <section className="mb-8 rounded-xl border border-border bg-card bg-gradient-soft p-6 shadow-card">
        <div className="flex flex-col items-stretch gap-0 md:flex-row md:items-center">
          {flow.map((f, i) => (
            <div key={f.label} className="flex flex-1 flex-col items-center md:flex-row">
              <div className="flex w-full flex-col items-center rounded-xl border border-border bg-background p-4 text-center">
                <span className="grid size-10 place-items-center rounded-full bg-gradient-primary text-primary-foreground"><f.icon className="size-5" /></span>
                <p className="mt-2 text-sm font-semibold">{f.label}</p>
                <p className="text-xs text-muted-foreground">{f.detail}</p>
              </div>
              {i < flow.length - 1 && <div className="h-6 w-0.5 bg-gradient-primary md:h-0.5 md:w-6 md:shrink-0" />}
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section>
          <h2 className="mb-3 font-semibold">Commonly Used Approaches</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {methods.map(([m, n]) => (
              <div key={m} className="rounded-xl border border-border bg-card p-4 shadow-card">
                <Cpu className="size-4 text-primary" /><p className="mt-2 font-semibold">{m}</p><p className="text-xs text-muted-foreground">{n} paper{n > 1 ? "s" : ""}</p>
              </div>
            ))}
          </div>
        </section>
        <section>
          <h2 className="mb-3 font-semibold">Common Datasets</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {ds.map(([id, n]) => {
              const d = getDataset(id);
              return (
                <div key={id} className="rounded-xl border border-border bg-card p-4 shadow-card">
                  <Database className="size-4 text-primary" /><p className="mt-2 font-semibold">{d?.name}</p><p className="text-xs text-muted-foreground">Used in {n} · {d?.availability}</p>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <section className="mt-8">
        <h2 className="mb-3 font-semibold">Recurring Limitations</h2>
        <ul className="grid gap-2 md:grid-cols-2">
          {recurringLimitations.map((l) => (
            <li key={l} className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 text-sm"><AlertCircle className="size-4 text-warning" /> {l}</li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="mb-3 font-semibold">Potential Research Directions</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {researchGaps.map((g) => (
            <div key={g.title} className="rounded-xl border border-border bg-card p-5 shadow-card transition-shadow hover:shadow-lift">
              <div className="flex items-center justify-between"><Sparkles className="size-5 text-primary-glow" /><Badge variant="outline">{g.confidence}</Badge></div>
              <h3 className="mt-3 font-semibold">{g.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{g.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
