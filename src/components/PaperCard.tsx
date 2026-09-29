import { Link } from "@tanstack/react-router";
import { Check, Minus, FileText, Github, Scale, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Paper } from "@/types";
import { getDataset } from "@/data/datasets";
import { useStore } from "@/lib/store";
import { SourceBadge } from "./common";
import { toast } from "sonner";

export function PaperCard({ paper }: { paper: Paper }) {
  const { compare, toggleCompare } = useStore();
  const inCompare = compare.includes(paper.id);
  const f1 = paper.metrics.find((m) => m.label === "F1 Score")?.value;
  return (
    <article className="rounded-xl border border-border bg-card p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-lift">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <Link to="/papers/$id" params={{ id: paper.id }} className="font-display text-lg font-semibold leading-snug hover:text-primary">
          {paper.title}
        </Link>
        {paper.repositoryId ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success"><Check className="size-3" /> GitHub Available</span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"><Minus className="size-3" /> No Implementation Found</span>
        )}
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{paper.authors.join(", ")} · {paper.year} · {paper.venue}</p>
      <p className="mt-3 text-sm leading-relaxed">{paper.abstract}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {paper.concepts.map((c) => <Badge key={c} variant="secondary">{c}</Badge>)}
        {paper.openAccess && <Badge variant="outline">Open Access</Badge>}
      </div>
      <div className="mt-4 grid gap-2 rounded-lg bg-muted/60 p-3 text-sm sm:grid-cols-3">
        <div><span className="text-muted-foreground">Method: </span><b>{paper.method}</b></div>
        <div><span className="text-muted-foreground">Dataset: </span><b>{getDataset(paper.datasetId)?.name}</b></div>
        <div><span className="text-muted-foreground">F1 Score: </span><b>{f1}%</b></div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Button size="sm" variant="outline" onClick={() => toast.info("Demo mode — full-text link will open once the paper API is connected.")}><FileText className="size-4" /> View Paper</Button>
        <Button size="sm" variant="outline" asChild><Link to="/papers/$id" params={{ id: paper.id }}><Eye className="size-4" /> View Details</Link></Button>
        <Button size="sm" variant="outline" asChild><Link to="/papers/$id" params={{ id: paper.id }} search={{ tab: "implementation" }}><Github className="size-4" /> Find Implementation</Link></Button>
        <Button size="sm" variant={inCompare ? "default" : "outline"} onClick={() => { toggleCompare(paper.id); toast.success(inCompare ? "Removed from comparison" : "Added to comparison"); }}>
          <Scale className="size-4" /> {inCompare ? "In Compare" : "Compare"}
        </Button>
        <span className="ml-auto"><SourceBadge source={paper.source} /></span>
      </div>
    </article>
  );
}
