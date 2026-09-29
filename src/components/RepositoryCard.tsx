import { Link } from "@tanstack/react-router";
import { Star, GitFork, Github, Info, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { Repository } from "@/types";
import { getPaper } from "@/data/papers";
import { SourceBadge } from "./common";

export function RepositoryCard({ repo }: { repo: Repository }) {
  const paper = repo.paperId ? getPaper(repo.paperId) : undefined;
  return (
    <article className="flex flex-col rounded-xl border border-border bg-card p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-lift">
      <div className="flex items-center gap-2 text-sm text-muted-foreground"><Github className="size-4" /> @{repo.owner}</div>
      <h3 className="mt-1 font-mono text-base font-semibold">{repo.name}</h3>
      <p className="mt-2 flex-1 text-sm text-muted-foreground">{repo.description}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">{repo.topics.map((t) => <Badge key={t} variant="secondary">{t}</Badge>)}</div>
      <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
        <span className="inline-flex items-center gap-1"><Star className="size-4 text-warning" /> {repo.stars}</span>
        <span className="inline-flex items-center gap-1"><GitFork className="size-4" /> {repo.forks}</span>
        <span>{repo.language}</span>
        <span className="text-muted-foreground">Updated {new Date(repo.updated).toLocaleDateString()}</span>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button size="sm" variant="outline" asChild>
          <a href={`https://github.com/search?q=${encodeURIComponent(repo.name)}&type=repositories`} target="_blank" rel="noreferrer"><Github className="size-4" /> View GitHub</a>
        </Button>
        <Dialog>
          <DialogTrigger asChild><Button size="sm" variant="outline"><Info className="size-4" /> Repository Details</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-mono">{repo.owner}/{repo.name}</DialogTitle>
              <DialogDescription>{repo.description}</DialogDescription>
            </DialogHeader>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <dt className="text-muted-foreground">Language</dt><dd>{repo.language}</dd>
              <dt className="text-muted-foreground">Stars / Forks</dt><dd>{repo.stars} / {repo.forks}</dd>
              <dt className="text-muted-foreground">Last updated</dt><dd>{new Date(repo.updated).toLocaleDateString()}</dd>
              <dt className="text-muted-foreground">Linked paper</dt><dd>{paper?.title ?? "None found"}</dd>
            </dl>
            <p className="text-xs text-muted-foreground">Demo metadata. "View GitHub" runs a GitHub search since live repository links aren't verified yet.</p>
          </DialogContent>
        </Dialog>
        {paper && (
          <Button size="sm" variant="outline" asChild><Link to="/papers/$id" params={{ id: paper.id }}><FileText className="size-4" /> Related Paper</Link></Button>
        )}
        <span className="ml-auto self-center"><SourceBadge source="GitHub" /></span>
      </div>
    </article>
  );
}
