// Shared, API-ready domain types for ResearchLens.
export type SourceName = "OpenAlex" | "Semantic Scholar" | "arXiv" | "Crossref";
export type ConnectionStatus = "direct" | "possible" | "unverified";

export interface Metric {
  label: string;
  value: number; // percentage
}

export interface MethodologyStep {
  title: string;
  description: string;
}

export interface Paper {
  id: string;
  title: string;
  authors: string[];
  year: number;
  venue: string;
  abstract: string;
  concepts: string[];
  method: string;
  datasetId: string;
  metrics: Metric[]; // Accuracy, Precision, Recall, F1
  openAccess: boolean;
  pdfAvailable: boolean;
  repositoryId?: string;
  connection: ConnectionStatus;
  source: SourceName;
  topic: string;
  problem: string;
  objective: string;
  contribution: string;
  methodology: MethodologyStep[];
  limitations: string[];
  futureWork: string[];
}

export interface Repository {
  id: string;
  name: string;
  owner: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  updated: string;
  topics: string[];
  paperId?: string;
}

export interface Dataset {
  id: string;
  name: string;
  samples: number;
  dataType: string;
  source: string;
  availability: "Public" | "On request" | "Private";
  distribution: { label: string; value: number }[];
  description: string;
}

export interface ResearchGap {
  title: string;
  description: string;
  confidence: "High" | "Medium" | "Exploratory";
}

export interface SearchResult {
  id: string;
  query: string;
  date: string;
  topic: string;
  concepts: string[];
  paperIds: string[];
  repositoryIds: string[];
  gapCount: number;
}

export interface ComparisonItem {
  paperId: string;
  addedAt: string;
}
