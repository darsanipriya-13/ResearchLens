import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Sparkles, Check, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { analyzeProblem } from "@/services/aiService";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ResearchLens — Discover what has already been built" },
      { name: "description", content: "Turn a problem statement into a map of existing research, implementations and research gaps." },
      { property: "og:title", content: "ResearchLens — Discover what has already been built" },
      { property: "og:description", content: "Turn a problem statement into a map of existing research, implementations and research gaps." },
    ],
  }),
  component: Dashboard,
});

const examples = [
  "AI-based fake news detection",
  "Personalized healthcare recommendation",
  "AI-powered student learning system",
  "Crop disease detection using deep learning",
  "RAG-based government scheme assistant",
];
const stages = [
  "Understanding problem",
  "Extracting keywords",
  "Finding research papers",
  "Finding GitHub implementations",
  "Comparing existing approaches",
  "Identifying research gaps",
];

function Dashboard() {
  const [text, setText] = useState("");
  const [stage, setStage] = useState(-1);
  const { addSearch, history, setCurrent } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (stage < 0) return;
    if (stage >= stages.length) {
      analyzeProblem(text.trim()).then((r) => {
        addSearch(r);
        navigate({ to: "/discover" });
      });
      return;
    }
    const t = setTimeout(() => setStage((s) => s + 1), 550);
    return () => clearTimeout(t);
  }, [stage]); // eslint-disable-line react-hooks/exhaustive-deps

  const running = stage >= 0;

  return (
    <div className="mx-auto max-w-4xl">
      <section className="relative overflow-hidden rounded-2xl border border-border bg-card bg-gradient-soft px-6 py-12 text-center shadow-card md:px-12">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-accent-foreground">
          <Sparkles className="size-3.5" /> Research discovery workspace
        </span>
        <h1 className="mt-5 text-3xl font-semibold md:text-5xl">
          Discover What Has <span className="text-gradient">Already Been Built.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground md:text-lg">
          Turn your problem statement into a map of existing research, implementations and potential research gaps.
        </p>

        <div className="mt-8 text-left">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={running}
            rows={5}
            placeholder="Example: Detect fake news using transformer-based AI models"
            className="resize-none bg-background text-base"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="self-center text-xs text-muted-foreground">Try an example:</span>
            {examples.map((e) => (
              <button key={e} disabled={running} onClick={() => setText(e)} className="rounded-full border border-border bg-background px-3 py-1 text-xs transition-colors hover:border-primary hover:text-primary">
                {e}
              </button>
            ))}
          </div>
          <Button size="lg" className="mt-5 w-full bg-gradient-primary md:w-auto" disabled={!text.trim() || running} onClick={() => setStage(0)}>
            {running ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />} Analyze Problem
          </Button>
        </div>

        {running && (
          <div className="mt-8 rounded-xl border border-border bg-background p-5 text-left animate-in fade-in slide-in-from-bottom-2">
            <Progress value={(Math.min(stage, stages.length) / stages.length) * 100} />
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {stages.map((s, i) => (
                <li key={s} className={`flex items-center gap-2 text-sm ${i > stage ? "text-muted-foreground/60" : ""}`}>
                  {i < stage ? <Check className="size-4 text-success" /> : i === stage ? <Loader2 className="size-4 animate-spin text-primary" /> : <span className="size-4 rounded-full border border-border" />}
                  {s}…
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {history.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 font-semibold">Recent searches</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {history.slice(0, 4).map((h) => (
              <button key={h.id} onClick={() => { addSearchView(h); }} className="group flex items-center justify-between rounded-xl border border-border bg-card p-4 text-left shadow-card transition-all hover:shadow-lift">
                <div>
                  <p className="font-medium">{h.query}</p>
                  <p className="text-xs text-muted-foreground">{h.paperIds.length} papers · {h.repositoryIds.length} repos</p>
                </div>
                <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );

  function addSearchView(h: (typeof history)[number]) {
    setCurrent(h);
    navigate({ to: "/discover" });
  }
}

