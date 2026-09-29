import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Trash2, ArrowRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState, PageHeader } from "@/components/common";
import { useStore } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Search History — ResearchLens" },
      { name: "description", content: "Revisit previous research discovery searches." },
      { property: "og:title", content: "Search History — ResearchLens" },
      { property: "og:description", content: "Revisit previous research discovery searches." },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const { history, deleteSearch, setCurrent } = useStore();
  const navigate = useNavigate();
  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader title="Search History" subtitle="Saved on this device." />
      {history.length === 0 ? (
        <EmptyState title="No searches yet" message="Analyze a problem statement to start building your history." action={<Button asChild><Link to="/">New search</Link></Button>} />
      ) : (
        <div className="space-y-3">
          {history.map((h) => (
            <div key={h.id} className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 shadow-card md:flex-row md:items-center">
              <div className="flex-1">
                <p className="font-medium">{h.query}</p>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><Calendar className="size-3" /> {new Date(h.date).toLocaleString()}</span>
                  <span>{h.paperIds.length} papers</span>
                  <span>{h.repositoryIds.length} GitHub projects</span>
                  <span>{h.gapCount} research gaps</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => { setCurrent(h); navigate({ to: "/discover" }); }}>View Results <ArrowRight className="size-4" /></Button>
                <Button size="sm" variant="outline" onClick={() => { deleteSearch(h.id); toast.success("Search deleted"); }} aria-label="Delete"><Trash2 className="size-4" /> Delete</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
