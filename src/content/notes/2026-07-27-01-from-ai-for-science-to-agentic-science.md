---
title: "From AI for Science to Agentic Science: A Survey on Autonomous Scientific Discovery"
date: 2025-10-20
abstract: "The survey argues that \"Agentic Science\" - large language model (LLM) agents autonomously running the full hypothesis–experiment–analysis–refinement cycle - constitutes a distinct stage of AI for Science, and unifies the field through a three-layer framework of five foundational capabilities, four core processes, and four application domains."
tags: ["survey", "agents", "ai4science"]
chapter: ai
paper: "https://arxiv.org/abs/2508.14111"
cover: "papers/2026-07-27-01-from-ai-for-science-to-agentic-science.webp"
---

**20 Oct 2025** · [Paper](https://arxiv.org/abs/2508.14111)

---

## 1. Motivation

AI for Science has progressed from static predictive models ("computational oracles") to LLM-driven agents that plan, use tools, remember, collaborate, and self-improve. The authors contend that prior surveys are fragmented along three complementary axes - process-oriented (mapping LLM capabilities onto the research cycle), autonomy-oriented (grading systems by initiative), and mechanism-oriented (dissecting architectural primitives) - and treat workflows, autonomy scales, or architectures in isolation.[^3] The paper's contribution is a comprehensive framework connecting foundational capabilities, core processes, and domain realizations, positioned at autonomy "Level 3 (Full Agentic Discovery) with precursors at Level 2 (Partial Agentic Discovery)".[^3]

---

## 2. Methodology

### 2.1 Search Structure

The survey itself documents **no systematic literature-search protocol**: no databases, date ranges, or inclusion/exclusion criteria are stated, so its corpus (a ~60-page document with roughly 455 references) is expert-curated and unauditable; the companion GitHub list "Awesome-Agent-Scientists" functions as the de facto corpus.[^4] At the field level, the survey formalizes planning and hypothesis generation as explicit search problems. Its capability layer (Section 3.1) organizes reasoning engines into: linear decomposition (plan-and-solve, zero-shot chain-of-thought); robust linear planning (self-consistency, majority voting, multi-agent debate); non-linear exploration with backtracking (Tree-of-Thought); lookahead search (Monte Carlo Tree Search / Upper Confidence bounds applied to Trees, MCTS/UCT, for "uncertainty and long horizons"); and dynamic thought–act–observe adaptation (ReAct).[^2] Hypothesis generation is cast as search over a candidate set:

$$
h_{\text{new}} = \arg\max_{h \in H_{\text{cand}}} P(h \mid M(K))
$$

with an explicit exploration–exploitation trade-off in a "vast, unstructured search space of possible hypotheses".[^2]

### 2.2 State Representation

The four-level autonomy scale (Section 2) gives increasingly rich state definitions, each with a formal equation: Level 1 is empirical-risk minimization over a static model class; Level 2 is a finite-horizon policy over a tool set given a human-set goal; Level 3 is an infinite-horizon policy maximizing discounted expected information gain over an evolving hypothesis set, where the agent state $s_t$ includes a knowledge base $K_t$ and experimental evidence $E_t$, and the hypothesis set $H_t$ "itself can be modified by the agent's actions".[^2] The memory taxonomy (their Table 3) further differentiates state carriers: short-term/feedback memory (context windows, tool logs), episodic experience repositories (Reflexion[^5], ExpeL), reusable skill libraries (Voyager), and external knowledge hubs (retrieval-augmented generation (RAG), structured knowledge graphs, tiered MemGPT-style stores).[^2]

### 2.3 Generation Mechanism

The survey is not generative itself; it catalogs how reviewed systems produce candidates. Hypothesis generation proceeds through knowledge ingestion (RAG over corpora; LitLLM, ResearchAgent), structuring literature into taxonomies and knowledge graphs, then "exploratory pattern discovery and symbolic reasoning" (SciAgents over structure–property relationships; MOOSE-Chem over chemical reactivity).[^2] Their Table 7 classifies fully-autonomous pipelines into five paradigms: foundational end-to-end frameworks (The AI Scientist[^6], NovelSeek, Dolphin[^7], X-Master); domain-specific automation (Coscientist, Biomni, AI co-scientist); multi-agent collaborative structures (VirSci, AgentRxiv[^8], MDAgents); self-evolving systems (STELLA, AlphaEvolve[^9]); and human-in-the-loop designs (Agent Laboratory[^10]).[^2]

### 2.4 Evaluation & Grounding

Grounding mechanisms are organized in tiers: tool-based feedback as external validation (CRITIC validates and revises outputs via tools; Self Evolve debugs code from execution results); experimental and simulation tools as hypothesis validators (molecular docking, computational fluid dynamics, physics engines); and multi-agent debate emulating peer review for evidence synthesis.[^2] Benchmarks cited include SciCode and MLE-Bench for research coding, DiscoveryWorld as an evaluation environment, and ShortcutsBench for tool dependency.[^2] The analysis stage is framed as Bayesian belief updating, $P(h \mid R) \propto P(R \mid h) \cdot P(h)$ (their Eq. 7), and experimental planning as constrained optimization $\pi^* = \arg\min C(\pi)$ subject to $V(\pi, h) \geq \theta$ (Eq. 6).[^2] Wet-lab grounding claims are reported secondhand: OriGene's targets GPR160/ARG2 validated in patient-derived systems; Robin's ripasudil hypothesis for diabetic macular edema.[^2]

### 2.5 Memory / Information Flow

Memory is one of the five foundational capabilities (Section 3.3) and the survey's most dedicated architectural treatment: memory "for iterative task execution" supports in-context adaptation, while memory "as a knowledge hub" connects agents to external repositories.[^2] Information flow in the four-process workflow (observation/hypothesis → planning/execution → analysis → synthesis/validation/evolution) is non-linear - "execution order may be dynamically adjusted" - and adaptive refinement updates the policy over trajectories of past (hypothesis, plan, result) tuples: $\varphi_{t+1} \leftarrow L(\varphi_t, M_t)$ (their Eq. 8).[^2] Named bottlenecks include knowledge decay (validating memory against superseded facts), multimodal heterogeneity, and long-horizon causal dependence on early experimental results.[^2]

### 2.6 Selection & Propagation

The survey's own selection criteria are unstated. Field-level selection mechanisms cataloged include self-consistency and debate for plan selection; MCTS "to optimize hypothesis selection over an entire research campaign"; population-based co-evolution, both cooperative (CAMEL, ProAgent) and competitive (debate, red-teaming), as propagation of improved strategies; and ensemble/consensus aggregation (MARG, MedAgents).[^2]

### 2.7 Anti-Slop / Anti-Hallucination Mechanisms

Section 9 makes trustworthiness a first-class axis: (a) **agentic reproducibility** - unlike rerunnable code, "agentic discovery involves replicating a stochastic and context-sensitive discovery trajectory", with planning execution accuracy reported "as low as 39%" on state-of-the-art benchmarks;[^2] (b) **novelty validation** - distinguishing a genuine conceptual leap from "sophisticated interpolation or hallucination", which can produce fabricated findings, data, or references; (c) **transparency** - agents "interpretable by design" with structured internal logs; and (d) ethics, including dual-use risks. Remedies surveyed: provenance tracking of tool versions, parameters, and data lineage; automated reproducibility checks; formal verification of internal logic; and knowledge-graph consistency checking.[^2]

---

## 3. Results

As a survey, its outputs are taxonomic rather than experimental: the four-level autonomy scale, the five-capability × four-process × four-domain framework, and extensive system tables. Empirical anchors quoted from reviewed systems include OriGene's validated drug targets, Robin's repurposing hypothesis, CellVoyager's brain-aging link, and Virtual Lab's nanobodies.[^2] Its positioning claim - that it subsumes three fragmented prior perspectives - is its main comparative result.[^3]

---

## 4. Limitations & Assumptions

No corpus methodology means selection bias is unauditable; the autonomy levels and capability/process framework are the authors' construction, and the formal equations are pedagogical formalisms, not validated models. Coverage leans heavily on 2024–2025 preprints, many unpeer-reviewed, and the lead institution's own platforms (Intern-Discovery, Intern-S1) are promoted in the introduction. Level 4 ("Generative Architect") and the proposed "Nobel-Turing Test" are explicitly speculative.[^2]

---

## 5. Critical Analysis

- **Distinctive strength:** the most formal and most comprehensive of the recent agentic-science surveys - an explicit state/autonomy formalism plus a dedicated memory treatment that other surveys lack.
- **Structural weakness / trade-off:** breadth is bought with unauditable corpus construction and reliance on unreviewed preprints; its quantitative claims (e.g., the 39% execution accuracy) are inherited from cited benchmarks rather than re-run under matched conditions.
- **Connections:** it directly critiques and supersedes the autonomy taxonomy of Gridach et al. (paper 03 in this review) and subsumes the web-grounded pipeline of the Deep Research survey (paper 02); among reviewed systems it covers mission-list entries AlphaEvolve[^9] (paper 04) as a self-evolving exemplar, The AI Scientist[^6] (paper 09), Dolphin[^7] (paper 11), AgentRxiv[^8] (paper 14), and Agent Laboratory[^10] (paper 13), and builds its memory taxonomy on Reflexion[^5] (paper 21).

---

## 6. References

[^1]: Wei et al., arXiv:2508.14111 abstract page - https://arxiv.org/abs/2508.14111
[^2]: Wei et al., arXiv:2508.14111v2 PDF (full text) - https://arxiv.org/pdf/2508.14111v2.pdf
[^3]: Wei et al., arXiv:2508.14111v2 HTML - https://arxiv.org/html/2508.14111v2
[^4]: Awesome-Agent-Scientists companion repository - https://github.com/AgenticScience/Awesome-Agent-Scientists
[^5]: Shinn et al., Reflexion, arXiv:2303.11366 - https://arxiv.org/abs/2303.11366
[^6]: Lu et al., The AI Scientist, arXiv:2408.06292 - https://arxiv.org/abs/2408.06292
[^7]: Yuan et al., Dolphin, arXiv:2501.03916 - https://arxiv.org/abs/2501.03916
[^8]: Schmidgall et al., AgentRxiv, arXiv:2503.18102 - https://arxiv.org/abs/2503.18102
[^9]: Novikov et al., AlphaEvolve, arXiv:2506.13131 - https://arxiv.org/abs/2506.13131
[^10]: Schmidgall et al., Agent Laboratory, arXiv:2501.09727 - https://arxiv.org/abs/2501.09727
