import type { ReactNode } from "react";
import { ExternalLink, SearchX, AlertTriangle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { ConnectionStatus, SearchResult } from "@/types";
import { exportCSV, exportJSON, exportPDF } from "@/lib/export";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="text-2xl font-semibold md:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 max-w-2xl text-muted-foreground">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function MetricCard({ label, value, icon, hint }: { label: string; value: ReactNode; icon?: ReactNode; hint?: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-card transition-shadow hover:shadow-lift">
      <div className="flex items-center justify-between text-sm text-muted-foreground">{label}{icon}</div>
      <div className="mt-2 font-display text-2xl font-semibold">{value}</div>
      {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
    </div>
  );
}

const sourceUrl: Record<string, string> = {
  OpenAlex: "https://openalex.org",
  "Semantic Scholar": "https://www.semanticscholar.org",
  arXiv: "https://arxiv.org",
  Crossref: "https://search.crossref.org",
  GitHub: "https://github.com",
};

export function SourceBadge({ source }: { source: string }) {
  return (
    <a
      href={sourceUrl[source] ?? "#"}
      target="_blank"
      rel="noreferrer"
      title="Demo link — opens the source homepage; record-level link not connected yet"
      className="inline-flex items-center gap-1 rounded-md border border-border bg-muted px-2 py-0.5 text-xs text-muted-foreground hover:text-foreground"
    >
      Source: {source} <span className="text-[10px] uppercase tracking-wide opacity-70">demo</span>
      <ExternalLink className="size-3" />
    </a>
  );
}

const statusMeta: Record<ConnectionStatus, { label: string; cls: string }> = {
  direct: { label: "Directly linked", cls: "bg-success" },
  possible: { label: "Possibly related", cls: "bg-warning" },
  unverified: { label: "Not verified", cls: "bg-muted-foreground/40" },
};

export function ConnectionBadge({ status }: { status: ConnectionStatus }) {
  const m = statusMeta[status];
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium">
      <span className={cn("size-2 rounded-full", m.cls)} /> {m.label}
    </span>
  );
}

export function EmptyState({ title, message, action }: { title: string; message: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed border-border bg-card px-6 py-14 text-center">
      <SearchX className="size-8 text-muted-foreground" />
      <h3 className="mt-3 font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{message}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-destructive/30 bg-card px-6 py-10 text-center">
      <AlertTriangle className="size-8 text-destructive" />
      <p className="mt-3 text-sm">Something went wrong. We couldn't load this section. Please try again.</p>
      <Button variant="outline" className="mt-4" onClick={onRetry}>Retry</Button>
    </div>
  );
}

export function ExportMenu({ search }: { search: SearchResult | null }) {
  const run = (fn: (s: SearchResult) => void, label: string) => {
    if (!search) return;
    fn(search);
    toast.success(`${label} export ready`);
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={!search}><Download className="size-4" /> Export</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => run(exportPDF, "PDF")}>Export PDF</DropdownMenuItem>
        <DropdownMenuItem onClick={() => run(exportCSV, "CSV")}>Export CSV</DropdownMenuItem>
        <DropdownMenuItem onClick={() => run(exportJSON, "JSON")}>Export JSON</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
