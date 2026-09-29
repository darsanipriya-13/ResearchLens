import { ChevronRight } from "lucide-react";
import type { MethodologyStep } from "@/types";

export function MethodologyFlow({ steps }: { steps: MethodologyStep[] }) {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        {steps.map((s, i) => (
          <div key={s.title} className="flex items-center gap-2">
            <div className="rounded-lg border border-primary/30 bg-accent px-3 py-2 text-sm font-medium text-accent-foreground">
              <span className="mr-1.5 text-xs opacity-60">{i + 1}</span>{s.title}
            </div>
            {i < steps.length - 1 && <ChevronRight className="size-4 text-muted-foreground" />}
          </div>
        ))}
      </div>
      <ol className="grid gap-3 md:grid-cols-2">
        {steps.map((s, i) => (
          <li key={s.title} className="rounded-lg border border-border p-3">
            <p className="text-sm font-semibold">{i + 1}. {s.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{s.description}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
