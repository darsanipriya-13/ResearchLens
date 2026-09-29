import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { SearchResult } from "@/types";
import { seedHistory } from "@/data/searchHistory";
import { analyzeProblem } from "@/services/aiService";

interface Store {
  current: SearchResult | null;
  history: SearchResult[];
  compare: string[];
  setCurrent: (s: SearchResult) => void;
  addSearch: (s: SearchResult) => void;
  deleteSearch: (id: string) => void;
  toggleCompare: (id: string) => void;
  removeCompare: (id: string) => void;
}

const Ctx = createContext<Store | null>(null);
const KEY = "researchlens:v1";

export function StoreProvider({ children }: { children: ReactNode }) {
  const [current, setCurrentState] = useState<SearchResult | null>(null);
  const [history, setHistory] = useState<SearchResult[]>(seedHistory);
  const [compare, setCompare] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const d = JSON.parse(raw);
        setHistory(d.history ?? seedHistory);
        setCompare(d.compare ?? []);
        setCurrentState(d.current ?? null);
      }
    } catch { /* ignore */ }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(KEY, JSON.stringify({ history, compare, current }));
  }, [history, compare, current, loaded]);

  // Default demo search so pages are never empty on first visit.
  useEffect(() => {
    if (loaded && !current) {
      analyzeProblem("Detect fake news using transformer-based AI models").then(setCurrentState);
    }
  }, [loaded, current]);

  const value: Store = {
    current,
    history,
    compare,
    setCurrent: setCurrentState,
    addSearch: (s) => { setHistory((h) => [s, ...h]); setCurrentState(s); },
    deleteSearch: (id) => setHistory((h) => h.filter((x) => x.id !== id)),
    toggleCompare: (id) => setCompare((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id])),
    removeCompare: (id) => setCompare((c) => c.filter((x) => x !== id)),
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error("useStore must be inside StoreProvider");
  return s;
}
