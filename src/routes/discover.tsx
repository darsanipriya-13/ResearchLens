import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, Github, Code2, Unlock, Layers, SlidersHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { FilterPanel, emptyFilters, type Filters } from "@/components/FilterPanel";
import { PaperCard } from "@/components/PaperCard";
import { EmptyState, ExportMenu, MetricCard, PageHeader } from "@/components/common";
import { useStore } from "@/lib/store";
import { getPaper } from "@/data/papers";
import { filterPapers } from "@/lib/filterPapers";
import type { Paper } from "@/types";

export const Route = createFileRoute("/discover")({
  head: () => ({
    meta: [
      { title: "Discover Results — ResearchLens" },
      { name: "description", content: "Related papers, implementations and approaches for your research problem." },
      { property: "og:title", content: "Discover Results — ResearchLens" },
      { property: "og:description", content: "Related papers, implementations and approaches for your research problem." },
    ],
  }),
  component: Discover,
});

function Discover() {
  const { current } = useStore();
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const all = useMemo(() => (current?.paperIds.map(getPaper).filter(Boolean) as Paper[]) ?? [], [current]);
  const visible = useMemo(() => filterPapers(all, filters), [all, filters]);

  if (!current) {
    return <div className="space-y-4"><Skeleton className="h-24" /><Skeleton className="h-40" /><Skeleton className="h-40" /></div>;
  }

  const approaches = new Set(all.map((p) => p.method)).size;
  const panel = <FilterPanel filters={filters} onChange={setFilters} />;

  return (
    <div>
      <PageHeader title="Discover Results" subtitle="Existing research mapped to your problem statement." actions={<ExportMenu search={current} />} />

      <div className="rounded-xl border border-border bg-card bg-gradient-soft p-5 shadow-card">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Problem statement</p>
        <p className="mt-1 font-display text-lg font-medium">{current.query}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {current.concepts.map((c) => <Badge key={c} className="bg-accent text-accent-foreground hover:bg-accent">{c}</Badge>)}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-5">
        <MetricCard label="Related Papers" value={all.length} icon={<FileText className="size-4" />} />
        <MetricCard label="GitHub Projects" value={current.repositoryIds.length} icon={<Github className="size-4" />} />
        <MetricCard label="Papers With Code" value={all.filter((p) => p.repositoryId).length} icon={<Code2 className="size-4" />} />
        <MetricCard label="Open Access" value={all.filter((p) => p.openAccess).length} icon={<Unlock className="size-4" />} />
        <MetricCard label="Major Approaches" value={approaches} icon={<Layers className="size-4" />} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block">{panel}</aside>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Showing {visible.length} of {all.length} papers</p>
            <Sheet>
              <SheetTrigger asChild><Button variant="outline" size="sm" className="lg:hidden"><SlidersHorizontal className="size-4" /> Filters</Button></SheetTrigger>
              <SheetContent side="left" className="overflow-y-auto p-4"><SheetTitle className="sr-only">Filters</SheetTitle>{panel}</SheetContent>
            </Sheet>
          </div>
          {visible.length === 0 ? (
            <EmptyState title="No research papers found" message="Try using broader keywords or clearing some filters." action={<Button variant="outline" onClick={() => setFilters(emptyFilters)}>Clear Filters</Button>} />
          ) : (
            visible.map((p) => <PaperCard key={p.id} paper={p} />)
          )}
          <p className="text-center text-sm text-muted-foreground">
            Want the full picture? <Link to="/gaps" className="text-primary hover:underline">Explore research gaps →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
