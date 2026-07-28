---
title: "Deep Research: A Survey of Autonomous Research Agents"
date: 2025-08-18
abstract: "The survey defines \"deep research\" as a paradigm beyond retrieval-augmented generation (RAG), in which agents iteratively plan, retrieve, and synthesize web-grounded analytical reports, and organizes the field by a capability-centric four-stage pipeline - planning, question developing, web exploration, report generation - rather than by whole-system enumeration."
tags: ["survey", "agents", "deep-research"]
chapter: ai
paper: "https://arxiv.org/abs/2508.12752"
cover: "papers/2026-07-27-02-deep-research-survey-autonomous-research-agents.webp"
---

**18 Aug 2025** · [Paper](https://arxiv.org/abs/2508.12752)

---

## 1. Motivation

Commercial "deep research" products (OpenAI Deep Research, Gemini Deep Research, Perplexity, Grok DeepSearch) and a growing academic literature have made autonomous web-scale report generation a distinct workload: agents "actively engage in planning, retrieval, and synthesis to generate comprehensive and faithful analytical reports grounded in web-based evidence".[^3] The authors argue prior surveys either emphasize system architecture and roadmaps (Huang et al.) or give broad enumerative overviews of tasks and tools (Xu et al.); their differentiator is that the "taxonomy centers on capability formation and integration, aiming to reveal deeper connections between methods".[^3]

---

## 2. Methodology

### 2.1 Search Structure

The survey states **no systematic corpus-construction protocol** (no databases, date ranges, or inclusion criteria); it is an expert-curated, v1-only narrative survey. Its field-level treatment of search is its richest component (Sections 3–4). Web exploration is framed as fundamentally iterative and agent-driven - "unlike single-shot retrieval in traditional RAG pipelines … enabling deeper coverage of sparse or scattered evidence" - and split into two families:[^3]

```
Web exploration families
├── Browser/web-agent-based: WebGPT (text browser), Agent-E
│   (accessibility-tree compaction), WebVoyager, MM-ReAct, Sightseer
└── API-based: OpenAI DeepResearch (Bing), Grok DeepSearch (own
    crawler + X data), Gemini DeepResearch, Perplexity
    (BM25 + keyword + dense-vector reranking)
```

A third strand trains search behavior directly with reinforcement learning (RL): Search-R1 (format-templated PPO/GRPO with exact-match reward), R1-Searcher (staged format-then-answer rewards), ZeroSearch (a learned simulator giving "curriculum rollout without any real querying cost"), DeepRetrieval (Recall@K/NDCG@K rewards), and DeepResearcher (GRPO against real search APIs).[^3]

### 2.2 State Representation

The pipeline is formalized with definitional equations. The plan is $P = M^{\text{plan}}(q_0, K; \theta)$, a sequence of subgoals; each query is generated conditioned on plan, current subgoal, and accumulated evidence, $Q_i = M^{\text{ask}}(P, s_i, E; \theta)$; retrieval operates over the open-web corpus, $D = M^{\text{web}}(R, Q_i, H; \theta)$; and the report is $Y = M_\theta(q_0, P, Q, D)$.[^3] The central state object is thus the **evidence set $E$** - information retrieved from previous queries - which grows over the iterative search loop. Planning-side state also includes LLMs as "implicit world models", "Simulate Before Act" mental rollouts, and knowledge-graph-grounded reasoning paths.[^3]

### 2.3 Generation Mechanism

Two generation stages are taxonomized separately. **Question developing** (query generation) divides into reward-optimized (RL-trained) versus supervision-driven (SFT, rule-based, multi-agent) approaches; examples include ManuSearch's transparent open multi-agent framework and ReasonRAG, which combines MCTS trajectory exploration with direct preference optimization (DPO) ranking to replace "sparse, outcome-only supervision with fine-grained feedback over intermediate steps".[^3] **Report generation** divides into structure control versus factual integrity. Structure-control methods include paragraph-level planning (Agent Laboratory[^4]), "recursive tree-structured planning" (AI Scientist v2[^5]), outline-then-section decomposition (LongWriter), and critique-augmented steps (LongDPO); constraint-guided methods include WebThinker's section-aware decomposition and Suri's multi-constraint instruction tuning.[^3]

### 2.4 Evaluation & Grounding

Section 7 splits benchmarks into **search-oriented** (Mind2Web 2 with Agent-as-a-Judge; BrowseComp/BrowseComp-Zh with accuracy plus calibration error; WebArena) and **research-oriented** (DeepResearch Bench measuring report fidelity and citation accuracy; DeepResearchGym measuring clarity and knowledge precision/recall; MedBrowseComp; GAIA; Humanity's Last Exam; GPQA), with a module-coverage matrix (their Table 5) marking which pipeline stages each benchmark exercises.[^3] The survey's key structural finding: search-oriented benchmarks "rarely involve final content generation, leaving report generation under-evaluated".[^3] Grounding evaluation work cited includes FaithJudge, RAG-QA Arena, contextual attribution (SFR-RAG), and the "Correctness is not Faithfulness" argument.[^3]

### 2.5 Memory / Information Flow

Information flow is explicit in the formalism: the evidence set $E$ is updated on each web-exploration iteration and feeds back into question developing (the "Iterative Search" loop in their Figure 1).[^3] Persistent cross-task memory is identified as an open gap - "many systems treat each research question as an isolated problem, without leveraging shared structures or transferable strategies, which limits the agent's ability to accumulate generalizable planning knowledge across tasks" - and personalization ("persistent user modeling and dynamic adaptation") is listed as an open direction.[^3]

### 2.6 Selection & Propagation

Selection among plans, queries, and tool calls is driven by reward shaping, surveyed along a progression from format-plus-accuracy rewards toward richer multi-dimensional signals: InForage (information gain plus efficiency penalty), OTC-PO (cost-aware tool-use penalty), IKEA (a "knowledge boundary-aware reward" that rewards internal-knowledge solutions and penalizes "unnecessary or unproductive external searches"), AutoRefine (intermediate-refinement completeness), and R-Search/MMSearch-R1 (correctness + evidence quality + format).[^3] Propagation of capability across the field occurs via curriculum training (AI Scientist v2, SimpleDeepSearcher), internet-scale training, and meta-plan optimization (MPO).[^3]

### 2.7 Anti-Slop / Anti-Hallucination Mechanisms

Factual integrity is a first-class taxonomic axis of report generation, not an afterthought. Cataloged controls include: **faithful modeling** - RAGSynth synthetic supervision, BRIDGE's "verification layer between retrieval and generation to assess factual adequacy", and context-aware decoding to reduce hallucinated completions; and **conflict resolution** - FaithfulRAG's fact-level conflict modeling, DRAGged's inter-source conflict detection and intervention, and entropy-based decoding under uncertainty.[^3] Failure modes are named at each stage: brittle plans whose "hallucinated steps can propagate errors downstream", and report-stage risks that agents "may inadvertently introduce factual inaccuracies, outdated claims, or unsupported assertions, especially when aggregating content from inconsistent sources". The prescribed remedies are "explicit grounding mechanisms, such as source attribution, factuality-aware reward functions, and post-hoc verification modules".[^3]

---

## 3. Results

The survey reports no experiments of its own; its comparative outputs are the capability-centric taxonomy, the per-module method tables, and the benchmark module-coverage matrix. Quotable comparative facts: WebVoyager achieves 59% task success on real-world web benchmarks, "significantly outperforming text-only baselines"; and a workflow-level observation that single-agent systems (DeepResearcher, WebThinker, Search-R1) favor end-to-end RL while multi-agent systems (AgentRxiv, AI Scientist, OpenResearcher) favor modular specialization.[^3] Named open challenges: multi-tool integration beyond search engines, factuality, multimodal reasoning (pipelines are "almost exclusively textual"), workflow generalization, and personalization.[^3]

---

## 4. Limitations & Assumptions

This is a v1-only preprint with unfilled ACM camera-ready boilerplate, no peer review, and no stated corpus methodology; author affiliations are not verifiable from the primary source. Its scope is **web-grounded report generation**, not wet-lab discovery: autonomous-experimentation systems appear only as report-generation or multi-agent examples, so physical-science coverage is thin relative to the other surveys in this review. The formal equations are definitional, not validated. Product descriptions (OpenAI/Gemini/Perplexity/Grok) are secondhand and frozen at mid-2025.[^2][^3]

---

## 5. Critical Analysis

- **Distinctive strength:** the deepest mechanism-level decomposition of deep-research pipelines available - formal stage definitions, reward-design taxonomy, and a benchmark coverage matrix that makes the "report generation is under-evaluated" gap concrete.
- **Structural weakness / trade-off:** capability-centric modularity buys analytical clarity at the cost of whole-system realism, and the survey's web-only scope plus stale product snapshot limit its shelf life in a fast-moving market.
- **Connections:** its four stages are a web-scale analogue of the four core processes in the Agentic Science survey (paper 01), and its factual-integrity machinery directly services that survey's hallucination challenge; it supplies precisely the literature-review/search machinery that Gridach et al. (paper 03) identify as the weakest stage of autonomous pipelines. Among mission-list systems it discusses AI Scientist v2[^5] (paper 10), Agent Laboratory[^4] (paper 13), and AgentRxiv[^6] (paper 14) as report-generation or multi-agent exemplars.

---

## 6. References

[^1]: Zhang et al., arXiv:2508.12752 abstract page - https://arxiv.org/abs/2508.12752
[^2]: Zhang et al., arXiv:2508.12752 PDF (v1, ACM template with placeholder conference line) - https://arxiv.org/pdf/2508.12752.pdf
[^3]: Zhang et al., arXiv:2508.12752v1 HTML (full text) - https://arxiv.org/html/2508.12752v1
[^4]: Schmidgall et al., Agent Laboratory, arXiv:2501.09727 - https://arxiv.org/abs/2501.09727
[^5]: Yamada et al., The AI Scientist-v2, arXiv:2504.08066 - https://arxiv.org/abs/2504.08066
[^6]: Schmidgall et al., AgentRxiv, arXiv:2503.18102 - https://arxiv.org/abs/2503.18102
