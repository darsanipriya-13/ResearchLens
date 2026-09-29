import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ArrowLeft, BookOpen, Link2, Github, AlertCircle, Lightbulb, FileText, ArrowRight, ShieldCheck, Scale } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getPaper, papers } from "@/data/papers";
import { getDataset } from "@/data/datasets";
import { getRepository } from "@/data/repositories";
import { MethodologyFlow } from "@/components/MethodologyFlow";
import { ConnectionBadge, MetricCard, SourceBadge } from "@/components/common";
import { useStore } from "@/lib/store";
import { toast } from "sonner";

const tabs = ["overview", "methodology", "dataset", "results", "limitations", "future", "implementation", "sources"] as const;

export const Route = createFileRoute("/papers/$id")({
  validateSearch: z.object({ tab: z.enum(tabs).optional() }),
  loader: ({ params }) => {
    const paper = getPaper(params.id);
    if (!paper) throw notFound();
    return { paper };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Paper not found — ResearchLens" }, { name: "robots", content: "noindex" }] };
    const t = `${loaderData.paper.title} — ResearchLens`;
    return { meta: [{ title: t }, { name: "description", content: loaderData.paper.abstract }, { property: "og:title", content: t }, { property: "og:description", content: loaderData.paper.abstract }] };
  },
  notFoundComponent: () => (
    <div className="py-20 text-center"><p>That paper isn't in the library.</p><Link to="/papers" className="text-primary">Browse papers</Link></div>
  ),
  component: PaperDetails,
});

const chartColors = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)", "var(--primary-glow)"];

function PaperDetails() {
  const { paper } = Route.useLoaderData();
  const { tab } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const { compare, toggleCompare } = useStore();
  const dataset = getDataset(paper.datasetId);
  const repo = getRepository(paper.repositoryId);
  const f1 = (id: string) => getPaper(id)?.metrics.find((m) => m.label === "F1 Score")?.value ?? 0;
  const peers = papers.filter((p) => p.topic === paper.topic).slice(0, 5).map((p) => ({ name: p.method + (p.id === paper.id ? " (this)" : ""), f1: f1(p.id), self: p.id === paper.id }));

  return (
    <div className="mx-auto max-w-5xl">
      <Link to="/discover" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" /> Back to results</Link>
      <header className="rounded-xl border border-border bg-card bg-gradient-soft p-6 shadow-card">
        <div className="flex flex-wrap gap-1.5">{paper.concepts.map((c) => <Badge key={c} variant="secondary">{c}</Badge>)}</div>
        <h1 className="mt-3 text-2xl font-semibold md:text-3xl">{paper.title}</h1>
        <p className="mt-2 text-muted-foreground">{paper.authors.join(", ")} · {paper.year} · {paper.venue}</p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Button onClick={() => toast.info("Demo mode — full text opens once the paper API is connected.")}><BookOpen className="size-4" /> Read Paper</Button>
          <Button variant="outline" onClick={() => toast.info("Demo mode — DOI not resolved for sample papers.")}><Link2 className="size-4" /> View DOI</Button>
          <Button variant="outline" onClick={() => navigate({ search: { tab: "implementation" } })}><Github className="size-4" /> Find GitHub</Button>
          <Button variant="outline" onClick={() => toggleCompare(paper.id)}><Scale className="size-4" /> {compare.includes(paper.id) ? "Remove from Compare" : "Add to Compare"}</Button>
          <SourceBadge source={paper.source} />
        </div>
      </header>

      <Tabs value={tab ?? "overview"} onValueChange={(v) => navigate({ search: { tab: v as (typeof tabs)[number] }, replace: true })} className="mt-6">
        <TabsList className="flex h-auto w-full flex-wrap justify-start">
          {[["overview", "Overview"], ["methodology", "Methodology"], ["dataset", "Dataset"], ["results", "Results"], ["limitations", "Limitations"], ["future", "Future Work"], ["implementation", "Implementation"], ["sources", "Sources"]].map(([v, l]) => (
            <TabsTrigger key={v} value={v!}>{l}</TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview" className="mt-4 grid gap-4 md:grid-cols-3">
          {[["Problem Addressed", paper.problem], ["Objective", paper.objective], ["Key Contribution", paper.contribution]].map(([t, d]) => (
            <div key={t} className="rounded-xl border border-border bg-card p-5 shadow-card"><h3 className="font-semibold">{t}</h3><p className="mt-2 text-sm text-muted-foreground">{d}</p></div>
          ))}
          <div className="rounded-xl border border-border bg-card p-5 shadow-card md:col-span-3"><h3 className="font-semibold">Abstract</h3><p className="mt-2 text-sm leading-relaxed">{paper.abstract}</p></div>
        </TabsContent>

        <TabsContent value="methodology" className="mt-4 rounded-xl border border-border bg-card p-5 shadow-card">
          <MethodologyFlow steps={paper.methodology} />
        </TabsContent>

        <TabsContent value="dataset" className="mt-4 grid gap-4 md:grid-cols-2">
          {dataset && (
            <>
              <div className="rounded-xl border border-border bg-card p-5 shadow-card">
                <h3 className="font-display text-lg font-semibold">{dataset.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{dataset.description}</p>
                <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <dt className="text-muted-foreground">Samples</dt><dd className="font-medium">{dataset.samples.toLocaleString()}</dd>
                  <dt className="text-muted-foreground">Data type</dt><dd className="font-medium">{dataset.dataType}</dd>
                  <dt className="text-muted-foreground">Source</dt><dd className="font-medium">{dataset.source}</dd>
                  <dt className="text-muted-foreground">Availability</dt><dd className="font-medium">{dataset.availability}</dd>
                </dl>
              </div>
              <div className="rounded-xl border border-border bg-card p-5 shadow-card">
                <h3 className="font-semibold">Label distribution <span className="text-xs font-normal text-muted-foreground">(sample data)</span></h3>
                <div className="mt-3 h-56">
                  <ResponsiveContainer>
                    <BarChart data={dataset.distribution}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]}>{dataset.distribution.map((_, i) => <Cell key={i} fill={chartColors[i % chartColors.length]} />)}</Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="results" className="mt-4 space-y-4">
          <p className="text-xs text-muted-foreground">Sample data — values are illustrative until connected to the source paper.</p>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">{paper.metrics.map((m) => <MetricCard key={m.label} label={m.label} value={`${m.value}%`} />)}</div>
          <div className="rounded-xl border border-border bg-card p-5 shadow-card">
            <h3 className="font-semibold">F1 score vs. related approaches</h3>
            <div className="mt-3 h-64">
              <ResponsiveContainer>
                <BarChart data={peers}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="f1" radius={[6, 6, 0, 0]}>{peers.map((p, i) => <Cell key={i} fill={p.self ? "var(--primary)" : "var(--chart-3)"} />)}</Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="limitations" className="mt-4 grid gap-3 md:grid-cols-2">
          {paper.limitations.map((l) => (
            <div key={l} className="flex gap-3 rounded-xl border border-border bg-card p-4 shadow-card"><AlertCircle className="size-5 shrink-0 text-warning" /><p className="text-sm font-medium">{l}</p></div>
          ))}
        </TabsContent>

        <TabsContent value="future" className="mt-4 grid gap-3 md:grid-cols-2">
          {paper.futureWork.map((l) => (
            <div key={l} className="flex gap-3 rounded-xl border border-border bg-card p-4 shadow-card"><Lightbulb className="size-5 shrink-0 text-primary" /><p className="text-sm font-medium">{l}</p></div>
          ))}
        </TabsContent>

        <TabsContent value="implementation" className="mt-4 rounded-xl border border-border bg-card p-6 shadow-card">
          <h3 className="font-semibold">Paper-to-Code Connection</h3>
          <div className="mt-5 flex flex-col items-stretch gap-3 md:flex-row md:items-center">
            <div className="flex-1 rounded-lg border border-border p-4"><FileText className="size-5 text-primary" /><p className="mt-2 text-xs text-muted-foreground">Research Paper</p><p className="text-sm font-medium">{paper.title}</p></div>
            <ArrowRight className="mx-auto size-5 rotate-90 text-muted-foreground md:rotate-0" />
            <div className={`flex-1 rounded-lg border p-4 ${repo ? "border-primary/40 bg-accent" : "border-dashed border-border"}`}>
              <Github className="size-5" /><p className="mt-2 text-xs text-muted-foreground">GitHub Repository</p>
              <p className="font-mono text-sm font-medium">{repo ? `${repo.owner}/${repo.name}` : "No implementation found"}</p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <span className="text-sm text-muted-foreground">Status:</span>
            <ConnectionBadge status={repo ? paper.connection : "unverified"} />
            {repo && <Button size="sm" variant="outline" asChild><Link to="/github" search={{ q: repo.name }}>Open in GitHub Projects</Link></Button>}
          </div>
          <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
            <ConnectionBadge status="direct" /><ConnectionBadge status="possible" /><ConnectionBadge status="unverified" />
          </div>
          <p className="mt-4 rounded-lg bg-muted p-3 text-xs text-muted-foreground">Connection status is based on available metadata and repository references. Do not claim official implementation without backend verification.</p>
        </TabsContent>

        <TabsContent value="sources" className="mt-4 rounded-xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-center gap-2"><ShieldCheck className="size-5 text-success" /><h3 className="font-semibold">Source verification</h3></div>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex flex-wrap items-center justify-between gap-2"><span>Paper metadata</span><SourceBadge source={paper.source} /></li>
            <li className="flex flex-wrap items-center justify-between gap-2"><span>Dataset reference</span><span className="text-muted-foreground">{dataset?.source}</span></li>
            <li className="flex flex-wrap items-center justify-between gap-2"><span>Implementation</span>{repo ? <SourceBadge source="GitHub" /> : <span className="text-muted-foreground">Not found</span>}</li>
          </ul>
          <p className="mt-4 text-xs text-muted-foreground">Links marked "demo" open the provider's homepage — record-level URLs appear once live APIs are connected.</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
