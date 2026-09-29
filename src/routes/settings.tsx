import { createFileRoute } from "@tanstack/react-router";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — ResearchLens" },
      { name: "description", content: "Configure data sources and local data for ResearchLens." },
      { property: "og:title", content: "Settings — ResearchLens" },
      { property: "og:description", content: "Configure data sources and local data for ResearchLens." },
    ],
  }),
  component: SettingsPage,
});

const sources = ["OpenAlex", "Semantic Scholar", "arXiv", "Crossref", "GitHub"];

function SettingsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader title="Settings" subtitle="Data sources and local data." />
      <section className="rounded-xl border border-border bg-card p-5 shadow-card">
        <h2 className="font-semibold">Data sources</h2>
        <p className="text-sm text-muted-foreground">Live connections aren't enabled yet — every source currently uses demo data.</p>
        <ul className="mt-4 divide-y divide-border">
          {sources.map((s) => (
            <li key={s} className="flex items-center justify-between py-3 text-sm">
              <span>{s} <span className="ml-2 rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">Demo</span></span>
              <Switch defaultChecked onCheckedChange={(v) => toast.info(`${s} ${v ? "included in" : "excluded from"} future searches (demo)`)} />
            </li>
          ))}
        </ul>
      </section>
      <section className="rounded-xl border border-border bg-card p-5 shadow-card">
        <h2 className="font-semibold">Local data</h2>
        <p className="text-sm text-muted-foreground">Clear saved searches and comparison selections from this browser.</p>
        <Button variant="destructive" className="mt-4" onClick={() => { localStorage.removeItem("researchlens:v1"); window.location.reload(); }}>Reset local data</Button>
      </section>
    </div>
  );
}
