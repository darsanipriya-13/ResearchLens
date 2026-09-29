import { useState, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Home, Search, FileText, Github, Scale, Brain, History, Settings, Menu, Telescope } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { papers } from "@/data/papers";
import { repositories } from "@/data/repositories";
import { datasets } from "@/data/datasets";
import { useStore } from "@/lib/store";

const nav = [
  { to: "/", label: "Dashboard", icon: Home },
  { to: "/discover", label: "Discover", icon: Search },
  { to: "/papers", label: "Research Papers", icon: FileText },
  { to: "/github", label: "GitHub Projects", icon: Github },
  { to: "/compare", label: "Compare", icon: Scale },
  { to: "/gaps", label: "Research Gap", icon: Brain },
  { to: "/history", label: "Search History", icon: History },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5 px-2">
      <span className="grid size-9 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-lift">
        <Telescope className="size-5" />
      </span>
      <span className="font-display text-lg font-semibold">ResearchLens</span>
    </Link>
  );
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const { compare } = useStore();
  return (
    <nav className="flex flex-col gap-1">
      {nav.map((n) => (
        <Link
          key={n.to}
          to={n.to}
          onClick={onNavigate}
          activeOptions={{ exact: n.to === "/" }}
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent"
          activeProps={{ className: "bg-sidebar-accent text-sidebar-accent-foreground" }}
        >
          <n.icon className="size-4" />
          <span className="flex-1">{n.label}</span>
          {n.to === "/compare" && compare.length > 0 && (
            <span className="rounded-full bg-primary px-2 text-xs text-primary-foreground">{compare.length}</span>
          )}
        </Link>
      ))}
    </nav>
  );
}

function GlobalSearch({ open, setOpen }: { open: boolean; setOpen: (o: boolean) => void }) {
  const navigate = useNavigate();
  const authors = Array.from(new Set(papers.flatMap((p) => p.authors.map((a) => ({ a, id: p.id }))).map((x) => JSON.stringify(x)))).map((s) => JSON.parse(s) as { a: string; id: string });
  const go = (fn: () => void) => { setOpen(false); fn(); };
  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search papers, repositories, authors, datasets…" />
      <CommandList>
        <CommandEmpty>No matches. Try broader keywords.</CommandEmpty>
        <CommandGroup heading="Papers">
          {papers.map((p) => (
            <CommandItem key={p.id} value={`paper ${p.title}`} onSelect={() => go(() => navigate({ to: "/papers/$id", params: { id: p.id } }))}>
              <FileText className="size-4" /> {p.title}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="GitHub repositories">
          {repositories.map((r) => (
            <CommandItem key={r.id} value={`repo ${r.owner} ${r.name}`} onSelect={() => go(() => navigate({ to: "/github", search: { q: r.name } }))}>
              <Github className="size-4" /> {r.owner}/{r.name}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Authors">
          {authors.map((x) => (
            <CommandItem key={x.a + x.id} value={`author ${x.a} ${x.id}`} onSelect={() => go(() => navigate({ to: "/papers/$id", params: { id: x.id } }))}>
              {x.a}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Datasets">
          {datasets.map((d) => (
            <CommandItem key={d.id} value={`dataset ${d.name}`} onSelect={() => go(() => navigate({ to: "/papers" }))}>
              {d.name} · {d.samples.toLocaleString()} samples
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [mobile, setMobile] = useState(false);
  const [search, setSearch] = useState(false);
  return (
    <div className="flex min-h-screen w-full">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col gap-8 border-r border-sidebar-border bg-sidebar p-4 lg:flex">
        <Logo />
        <NavList />
        <p className="mt-auto rounded-lg bg-muted p-3 text-xs text-muted-foreground">
          Prototype mode — results use curated demo data.
        </p>
      </aside>
      <Sheet open={mobile} onOpenChange={setMobile}>
        <SheetContent side="left" className="w-72 p-4">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <div className="flex flex-col gap-8 pt-2"><Logo /><NavList onNavigate={() => setMobile(false)} /></div>
        </SheetContent>
      </Sheet>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur md:px-8">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobile(true)} aria-label="Open menu">
            <Menu className="size-5" />
          </Button>
          <button
            onClick={() => setSearch(true)}
            className="flex h-10 w-full max-w-md items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm text-muted-foreground transition-colors hover:border-primary/40"
          >
            <Search className="size-4" /> Search papers, repos, authors, datasets…
          </button>
        </header>
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8 animate-in fade-in duration-300">{children}</main>
        <footer className="border-t border-border px-8 py-4 text-xs text-muted-foreground">
          ResearchLens prototype · Demo data only · Verify findings against original sources.
        </footer>
      </div>
      <GlobalSearch open={search} setOpen={setSearch} />
    </div>
  );
}
