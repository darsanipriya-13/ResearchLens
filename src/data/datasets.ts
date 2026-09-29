import type { Dataset } from "@/types";

export const datasets: Dataset[] = [
  { id: "fakenewsnet", name: "FakeNewsNet", samples: 23196, dataType: "News articles + social context", source: "PolitiFact & GossipCop", availability: "Public", description: "News content paired with social engagement signals from Twitter.", distribution: [{ label: "Real", value: 17441 }, { label: "Fake", value: 5755 }] },
  { id: "liar", name: "LIAR", samples: 12836, dataType: "Short political statements", source: "PolitiFact", availability: "Public", description: "Six-way labelled short statements with speaker metadata.", distribution: [{ label: "True", value: 2063 }, { label: "Mostly true", value: 2466 }, { label: "Half true", value: 2638 }, { label: "Barely true", value: 2108 }, { label: "False", value: 2511 }, { label: "Pants on fire", value: 1050 }] },
  { id: "isot", name: "ISOT", samples: 44898, dataType: "Full news articles", source: "University of Victoria", availability: "Public", description: "Balanced corpus of Reuters articles and flagged unreliable sites.", distribution: [{ label: "Real", value: 21417 }, { label: "Fake", value: 23481 }] },
  { id: "custom", name: "Custom Dataset", samples: 8200, dataType: "Mixed multilingual posts", source: "Author-collected", availability: "On request", description: "Dataset assembled by the authors; not publicly released.", distribution: [{ label: "Real", value: 4700 }, { label: "Fake", value: 3500 }] },
  { id: "plantvillage", name: "PlantVillage", samples: 54305, dataType: "Leaf images", source: "Penn State", availability: "Public", description: "Labelled leaf images across 38 crop–disease classes.", distribution: [{ label: "Healthy", value: 15084 }, { label: "Fungal", value: 24500 }, { label: "Bacterial", value: 8900 }, { label: "Viral", value: 5821 }] },
  { id: "mimic", name: "MIMIC-IV", samples: 299712, dataType: "Clinical records", source: "PhysioNet", availability: "On request", description: "De-identified ICU and hospital records, credentialed access.", distribution: [{ label: "ICU", value: 73181 }, { label: "Ward", value: 226531 }] },
  { id: "ednet", name: "EdNet", samples: 131441, dataType: "Student interaction logs", source: "Riiid", availability: "Public", description: "Hierarchical student learning interactions for knowledge tracing.", distribution: [{ label: "Correct", value: 86000 }, { label: "Incorrect", value: 45441 }] },
];

export const getDataset = (id: string) => datasets.find((d) => d.id === id);
