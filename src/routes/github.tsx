import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RepositoryCard } from "@/components/RepositoryCard";
import { EmptyState, PageHeader } from "@/components/common";
import { repositories } from "@/data/repositories";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/github")({
  validateSearch: z.object({ q: z.string().optional(), all: z.boolean().optional() }),
  head: () => ({
    meta: [
      { title: "Existing Implementations — ResearchLens" },
      { name: "description", content: "GitHub repositories implementing related research." },
      { property: "og:title", content: "Existing Implementations — ResearchLens" },
      { property: "og:description", content: "GitHub repositories implementing related research." },
    ],
  }),
  component: GithubPage,
});

function GithubPage() {
  const { q = "", all = false } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const { current } = useStore();
  const base = all || !current ? repositories : repositories.filter((r) => current.repositoryIds.includes(r.id));
  const s = q.toLowerCase();
  const list = base.filter((r) => !s || `${r.name} ${r.owner} ${r.description} ${r.topics.join(" ")}`.toLowerCase().includes(s));
  return (
    <div>
      <PageHeader
        title="Existing Implementations"
        subtitle={all || !current ? "All repositories in the library." : `Repositories related to “${current.query}”.`}
        actions={<Button variant="outline" onClick={() => navigate({ search: (p) => ({ ...p, all: !all }) })}>{all ? "Show current search only" : "Show all repositories"}</Button>}
      />
      <Input value={q} onChange={(e) => navigate({ search: (p) => ({ ...p, q: e.target.value || undefined }), replace: true })} placeholder="Search repositories or topics…" className="mb-5 max-w-lg bg-card" />
      {list.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{list.map((r) => <RepositoryCard key={r.id} repo={r} />)}</div>
      ) : (
        <EmptyState title="No repositories found" message="Try broader keywords or show all repositories." />
      )}
    </div>
  );
}
