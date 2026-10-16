# ResearchLens Discovery
# 🔭 ResearchLens — AI-Powered Research to Software Explorer & Innovation Engine

[![Hackathon Project](https://img.shields.io/badge/Hackathon-24hr%20AI%20%26%20Smart%20Tech-blueviolet?style=for-the-badge&logo=codeforces)](https://github.com)
[![React 19](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20DB-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com)
[![Vite](https://img.shields.io/badge/Vite-Bundler-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev)

> **Built in 24 hours** for the **AI & Smart Tech Hackathon**.  
> ResearchLens bridges the gap between academic theory and real-world software by connecting research papers directly to live demos, official project websites, active GitHub repositories, and automated limitation analysis.

---

## 📌 The Problem
Millions of groundbreaking academic papers are published every year. However:
- Moving from paper theory to **working code** is slow and fragmented.
- Finding **official software demos, project pages, and repositories** requires tedious manual searching.
- Author-reported **limitations and technical bottlenecks** are hidden in dense text.
- Identifying **under-explored research gaps** to create differentiated solutions requires days of cross-paper analysis.

## ✨ Core Features

- 🔍 **Dynamic Academic Paper Discovery:** Aggregates real-time research papers from OpenAlex and arXiv with concise, structured 5–7 line takeaways (Problem, Method, Dataset, Key Findings, Limitations).
- 🔗 **Paper-to-Code Matching:** Automatically matches scientific papers to verified GitHub repositories, official demos, and project websites with dynamic relevance scoring.
- 🔬 **AI Limitation & Bottleneck Analyzer:** Synthesizes reported constraints, empirical trade-offs, and generates testing hypotheses to stress-test real-world software claims.
- 💡 **AI Solution Innovation Engine:** Maps existing approaches across the domain ecosystem, identifies unexplored combinations, and generates ranked, differentiated solution hypotheses.
- 🛡️ **Session Persistence & Cloud Sync:** Integrated with Supabase Auth and PostgreSQL database with Row Level Security (RLS) for multi-device research history continuity.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, TanStack Start & Router, Tailwind CSS, Lucide Icons
- **Backend / APIs:** Vite SSR Server Middleware, OpenAlex REST API, GitHub Search REST API
- **Database & Auth:** Supabase (PostgreSQL, Row Level Security, Auth Sessions)
- **Deployment & Tooling:** Nitro, Vite, ESLint, Prettier

---

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/darsanipriya-13/ResearchLens.git
cd ResearchLens
