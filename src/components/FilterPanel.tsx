import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

export interface Filters {
  years: string[];
  methods: string[];
  datasets: string[];
  availability: string[];
  sources: string[];
}
export const emptyFilters: Filters = { years: [], methods: [], datasets: [], availability: [], sources: [] };

const groups: { key: keyof Filters; label: string; options: { value: string; label: string }[] }[] = [
  { key: "years", label: "Publication Year", options: ["2026", "2025", "2024", "2023", "before"].map((v) => ({ value: v, label: v === "before" ? "Before 2023" : v })) },
  { key: "methods", label: "Method / Model", options: ["BERT", "LSTM", "CNN", "Transformer", "RAG", "SVM", "Random Forest"].map((v) => ({ value: v, label: v })) },
  { key: "datasets", label: "Dataset", options: ([["fakenewsnet", "FakeNewsNet"], ["liar", "LIAR"], ["isot", "ISOT"], ["custom", "Custom Dataset"]] as const).map(([value, label]) => ({ value: value as string, label: label as string })) },
  { key: "availability", label: "Availability", options: ["Open Access", "PDF Available", "GitHub Available", "Dataset Available"].map((v) => ({ value: v, label: v })) },
  { key: "sources", label: "Source", options: ["OpenAlex", "Semantic Scholar", "arXiv", "Crossref"].map((v) => ({ value: v, label: v })) },
];

export function FilterPanel({ filters, onChange }: { filters: Filters; onChange: (f: Filters) => void }) {
  const toggle = (key: keyof Filters, v: string) => {
    const cur = filters[key];
    onChange({ ...filters, [key]: cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v] });
  };
  const count = Object.values(filters).flat().length;
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-card">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-semibold">Filters {count > 0 && <span className="text-primary">({count})</span>}</h2>
        <Button size="sm" variant="ghost" onClick={() => onChange(emptyFilters)} disabled={count === 0}>Clear Filters</Button>
      </div>
      <div className="space-y-5">
        {groups.map((g) => (
          <div key={g.key}>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{g.label}</h3>
            <div className="space-y-2">
              {g.options.map((o) => (
                <label key={o.value} className="flex cursor-pointer items-center gap-2 text-sm">
                  <Checkbox checked={filters[g.key].includes(o.value)} onCheckedChange={() => toggle(g.key, o.value)} />
                  {o.label}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
