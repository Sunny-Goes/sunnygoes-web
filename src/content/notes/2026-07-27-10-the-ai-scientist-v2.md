---
title: "The AI Scientist-v2: Workshop-Level Automated Scientific Discovery via Agentic Tree Search"
date: 2025-04-01
abstract: "By removing human-authored code templates and adding a four-stage experiment manager with parallelized agentic tree search and vision-language model (VLM) feedback, The AI Scientist-v2 produced the first entirely AI-generated manuscript to pass genuine blind peer review (average score 6.33/10) at an ICLR 2025 workshop."
tags: ["agents", "tree-search", "automation"]
chapter: ai
paper: "https://arxiv.org/abs/2504.08066"
cover: "papers/2026-07-27-10-the-ai-scientist-v2.webp"
---

**2025** · [Paper](https://arxiv.org/abs/2504.08066)

---

## 1. Motivation

The AI Scientist-v1 demonstrated end-to-end automation but only inside narrow, human-built experiment templates, with a strictly linear pipeline and no visual grounding - it could not inspect its own figures and could not explore beyond the seed codebase.[^2] The v2 paper asks whether removing those scaffolds - template-free ideation, tree-structured experimentation, and VLM-based figure critique - lets an agent produce science credible enough to survive real external peer review rather than a simulated reviewer.[^1]

---

## 2. Methodology

### 2.1 Search Structure

The pipeline has two tiers. Tier 1 is generalized **template-free idea generation**: batches of ~20 grant-proposal-style abstracts with Semantic Scholar queries in the loop. Tier 2 is a **four-stage experiment manager** agent, each stage with explicit stopping criteria:[^1]

```
Stage 1 Preliminary investigation   (21 nodes)
Stage 2 Hyperparameter tuning       (12 nodes)
Stage 3 Research-agenda execution   (12 nodes)
Stage 4 Ablation studies            (12 nodes)
best node of stage k → root of stage k+1
```

Within each stage runs a parallelized **agentic tree search**: best-first expansion over non-buggy nodes; buggy nodes are selected with probability 1.0 for debugging (maximum debug depth 3); each node has a 1-hour runtime cap. After experimentation, a single-pass manuscript generator plus an o1-class reasoning-model reflection stage with VLM figure critique produces the paper, with compiled-PDF page-length prompting for format adherence.[^1]

### 2.2 State Representation

The unit of search is a **tree node**: {experiment script, textual high-level plan, error trace, runtime, performance metrics, LLM feedback, visualization script, figure paths, VLM figure feedback, buggy/non-buggy status}. All metrics are stored in structured numpy files; stage checkpoints persist; the best node of each stage seeds the next. Unlike v1's idea archive, state here is per-run search state rather than a cross-run memory.[^1]

### 2.3 Generation Mechanism

Per node, an LLM (Claude 3.5 Sonnet v2, temperature 0.5, 8,192 max tokens) generates a plan plus code, which is executed and plotted; a VLM then critiques the figures. Node types are specialized: **hyperparameter** and **ablation** nodes (both track tested configurations to avoid redundancy), **replication** nodes (multiple seeds, reported as mean ± std), and **aggregation** nodes (combined-statistics figures). Non-buggy nodes spawn refinement children; buggy nodes spawn debug children fed the recorded error trace. Datasets are loaded ad hoc via Hugging Face `datasets.load_dataset`.[^1]

### 2.4 Evaluation & Grounding

An LLM evaluator selects the best node per stage from metrics and training curves; replication nodes provide mean ± std statistics "to ensure scientific rigor and reproducibility"; the VLM flags unclear or misleading figures (marking the node buggy). The ultimate grounding is unprecedented in this theme: finished manuscripts were submitted to **genuine blind peer review** at the ICLR 2025 "I Can't Believe It's Not Better" (ICBINB) workshop - 43 submissions, reviewers warned some submissions might be AI-generated (opt-out allowed), under IRB protocol H24-02652.[^1]

### 2.5 Memory / Information Flow

The tree itself is the memory. Recorded error traces flow into debug children; tested hyperparameters and ablations are tracked to prevent redundant experiments; VLM feedback is stored per node "for future debugging"; stage checkpoints carry best-node state across stages. The v1-style cross-run idea archive is de-emphasized in favor of within-run search depth.[^1]

### 2.6 Selection & Propagation

Selection is best-first, LLM-guided, among non-buggy nodes; the single best node propagates across stages. Importantly, **humans perform meta-selection at two points**: choosing 3 ideas from ~40 generated, and choosing the best manuscript per idea across seeds. The authors frame this as "deciding which experiments to fund," not content intervention - but it means full autonomy holds only per run.[^1]

### 2.7 Anti-Slop / Anti-Hallucination Mechanisms

Structural gates: execution-based buggy/non-buggy classification; VLM figure review; replication nodes for statistical robustness; VLM checks of figure–caption alignment and duplication during manuscript reflection. Despite this, the authors' own internal review of the accepted paper found: citation inaccuracies, a Figure 3 caption that misinterpreted validation loss, a Figure 5 contradicting the paper's claims, a questionable 100%-accuracy claim, a missing Hochreiter & Schmidhuber citation, and **~57% overlap between training and test sets** in the auto-loaded dataset - a leakage failure no gate caught.[^1]

---

## 3. Results

- **Workshop submission:** 3 fully AI-generated papers submitted to ICBINB (ICLR 2025); 1 accepted with reviewer scores 6, 6, 7 (average **6.33/10**, "ranked among the top 45%"), above the workshop acceptance bar; 2 rejected. The accepted paper is a negative-result study of compositional/temporal-consistency regularization on LSTMs over synthetic arithmetic tasks. All AI submissions were withdrawn after review by prior agreement.[^1]
- **Context caveat (authors' own):** workshop acceptance rates run 60–80% versus 20–30% for main tracks; success was 1/3, so the system "does not yet consistently reach workshop-level," let alone top-tier conference standard.[^1]
- **Resources:** runtime from several hours up to a 15-hour limit per paper; Claude 3.5 Sonnet v2 for code generation, GPT-4o for LLM/VLM feedback and summary reports, an o1-class model for writing reflection. Dollar cost is not reported (v1 reported ~\$15/paper).[^1]
- Comparators are framing devices rather than re-run baselines: v1 (template-bound, linear), AIDE (tree search for MLE-Bench, the direct inspiration), and concurrent Agent Laboratory / AgentRxiv.[^1]

---

## 4. Limitations & Assumptions

Requires up to 15 GPU-hours per paper, proprietary frontier models at three pipeline points, and human meta-selection of ideas and seeds. Dataset handling is ad hoc (a Hugging Face one-liner), which directly caused the 57% train/test overlap. The accepted paper still contains citation errors, limited methodological rigor, and unsupported claims. No per-paper dollar cost is reported, and community norms for AI-generated submissions remain unresolved (papers were labeled and withdrawn).[^1]

---

## 5. Critical Analysis

- **Distinctive strength:** It is the only system in this theme validated by *genuine external blind peer review* rather than a simulated reviewer or self-built benchmark - the strongest grounding signal any end-to-end research agent has achieved, and its AIDE-style best-first tree search replaces v1's linear retry loop with structured exploration.
- **Structural weakness / trade-off:** Depth replaced breadth: the tree searches *within* one idea but the cross-run archive memory was dropped, and the dataset-leakage failure shows execution gating plus VLM critique cannot substitute for data-hygiene checks - a weakness MLE-focused frameworks (e.g., MLEvolve's leakage-review agents) address explicitly.
- **Connections:** It is the direct successor to **The AI Scientist-v1** (arXiv:2408.06292), removing its templates and linear pipeline.[^2] Its tree search is inspired by **AIDE** (the greedy/tree MLE agent evaluated on MLE-Bench), and **Dolphin** (arXiv:2501.03916) conversely wraps AIDE/Agent-Laboratory templates in its feedback loop on MLE-Bench.[^3] **AgentRxiv** (arXiv:2503.18102) cites this workshop acceptance as evidence that fully AI-generated papers can clear peer review, while adding the cross-laboratory cumulative memory that v2 lacks.[^4]

---

## 6. References

- [Yamada et al., 2025] "The AI Scientist-v2: Workshop-Level Automated Scientific Discovery via Agentic Tree Search" - https://arxiv.org/pdf/2504.08066 (abs: https://arxiv.org/abs/2504.08066)
- [Lu et al., 2024] "The AI Scientist: Towards Fully Automated Open-Ended Scientific Discovery" - https://arxiv.org/pdf/2408.06292
- [Yuan et al., 2025] "Dolphin: Moving Towards Closed-loop Auto-research through Thinking, Practice, and Feedback" - https://arxiv.org/pdf/2501.03916
- [Schmidgall & Moor, 2025] "AgentRxiv: Towards Collaborative Autonomous Research" - https://arxiv.org/pdf/2503.18102
- [Sakana AI, 2025] "AI-Scientist-v2 code repository" - https://github.com/SakanaAI/AI-Scientist-v2 (URL printed in the Sakana-hosted paper PDF: https://pub.sakana.ai/ai-scientist-v2/paper/paper.pdf)

[^1]: AI Scientist-v2 PDF, arXiv:2504.08066 - https://arxiv.org/pdf/2504.08066
[^2]: AI Scientist v1 PDF - https://arxiv.org/pdf/2408.06292
[^3]: Dolphin PDF - https://arxiv.org/pdf/2501.03916
[^4]: AgentRxiv PDF - https://arxiv.org/pdf/2503.18102
