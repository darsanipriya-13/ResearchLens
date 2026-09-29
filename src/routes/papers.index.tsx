import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { PaperCard } from "@/components/PaperCard";
import { FilterPanel, emptyFilters, type Filters } from "@/components/FilterPanel";
import { EmptyState, PageHeader } from "@/components/common";
import { papers } from "@/data/papers";
import { filterPapers } from "@/lib/filterPapers";

export const Route = createFileRoute("/papers/")({
  head: () => ({
    meta: [
      { title: "Research Papers — ResearchLens" },
      { name: "description", content: "Browse the full library of indexed research papers." },
      { property: "og:title", content: "Research Papers — ResearchLens" },
      { property: "og:description", content: "Browse the full library of indexed research papers." },
    ],
  }),
  component: PapersPage,
});

function PapersPage() {
  const [q, setQ] = useState("");
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const list = useMemo(() => {
    const s = q.toLowerCase();
    return filterPapers(papers, filters).filter((p) => !s || `${p.title} ${p.abstract} ${p.authors.join(" ")} ${p.concepts.join(" ")}`.toLowerCase().includes(s));
  }, [q, filters]);
  return (
    <div>
      <PageHeader title="Research Papers" subtitle="Every paper in the current library, across topics." />
      <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter by title, author or concept…" className="mb-5 max-w-lg bg-card" />
      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block"><FilterPanel filters={filters} onChange={setFilters} /></aside>
        <div className="space-y-4">
          {list.length ? list.map((p) => <PaperCard key={p.id} paper={p} />) : <EmptyState title="No research papers found" message="Try using broader keywords." />}
        </div>
      </div>
    </div>
  );
}
