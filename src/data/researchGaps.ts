import type { ResearchGap } from "@/types";

export const recurringLimitations = [
  "Small datasets",
  "Limited languages",
  "High computational requirements",
  "Lack of real-world testing",
  "Limited explainability",
];

export const researchGaps: ResearchGap[] = [
  { title: "Multilingual Detection", description: "Most displayed studies evaluate English only; low-resource languages remain underexplored.", confidence: "High" },
  { title: "Explainable Detection", description: "Few studies validate whether explanations actually help end users make decisions.", confidence: "High" },
  { title: "Real-time Deployment", description: "Evaluations are mostly offline; streaming and early-detection settings are rarely tested.", confidence: "Medium" },
  { title: "Efficient Models", description: "Strong results rely on large models; distilled or edge-friendly variants are uncommon.", confidence: "Medium" },
  { title: "Evidence-grounded Verification", description: "Combining retrieval with classification could move beyond stylistic cues.", confidence: "Exploratory" },
];
