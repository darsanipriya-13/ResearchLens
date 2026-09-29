import type { Repository } from "@/types";

export const repositories: Repository[] = [
  { id: "r1", name: "fake-news-transformer", owner: "research-lab", description: "BERT and RoBERTa fine-tuning pipeline for fake news classification on FakeNewsNet.", stars: 245, forks: 38, language: "Python", updated: "2026-08-14", topics: ["BERT", "NLP", "Fake News", "Transformers"], paperId: "p1" },
  { id: "r2", name: "liar-hybrid-lstm", owner: "nlp-group-iit", description: "Hybrid CNN-LSTM with speaker metadata for the LIAR benchmark.", stars: 112, forks: 21, language: "Python", updated: "2025-11-02", topics: ["LSTM", "CNN", "LIAR"], paperId: "p3" },
  { id: "r3", name: "xfact-explain", owner: "trustml", description: "Explainable fake news detection with attention attribution and SHAP.", stars: 389, forks: 64, language: "Python", updated: "2026-07-21", topics: ["Explainability", "Transformers", "SHAP"], paperId: "p4" },
  { id: "r4", name: "multilingual-misinfo", owner: "globalnlp", description: "XLM-R baselines for misinformation detection across 12 languages.", stars: 176, forks: 29, language: "Python", updated: "2026-05-09", topics: ["XLM-R", "Multilingual", "Fake News"], paperId: "p5" },
  { id: "r5", name: "classic-fakenews-ml", owner: "ds-students", description: "TF-IDF with SVM and Random Forest baselines on ISOT.", stars: 58, forks: 17, language: "Jupyter Notebook", updated: "2024-03-18", topics: ["SVM", "Random Forest", "TF-IDF"], paperId: "p6" },
  { id: "r6", name: "rag-factcheck", owner: "open-verify", description: "Retrieval-augmented claim verification using evidence from news archives.", stars: 421, forks: 73, language: "TypeScript", updated: "2026-09-01", topics: ["RAG", "LLM", "Fact Checking"], paperId: "p7" },
  { id: "r7", name: "leafnet-efficient", owner: "agri-vision", description: "EfficientNet models for on-device crop disease detection.", stars: 302, forks: 55, language: "Python", updated: "2026-04-11", topics: ["CNN", "PlantVillage", "Edge AI"], paperId: "p9" },
  { id: "r8", name: "scheme-rag-assistant", owner: "civic-ai", description: "RAG chatbot answering questions on public welfare schemes.", stars: 134, forks: 26, language: "Python", updated: "2026-06-30", topics: ["RAG", "LLM", "GovTech"], paperId: "p12" },
];

export const getRepository = (id?: string) => repositories.find((r) => r.id === id);
