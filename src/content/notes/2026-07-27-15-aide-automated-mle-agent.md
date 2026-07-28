---
title: "AIDE: AI-Driven Exploration in the Space of Code"
date: 2025-02-18
abstract: "AIDE frames machine learning engineering (MLE) as a code optimization problem over Python scripts and operationalizes trial-and-error as a greedy best-first tree search whose every node is grounded in an executed validation metric."
tags: ["agents", "automl", "tree-search"]
chapter: ai
paper: "https://arxiv.org/abs/2502.13138"
cover: "papers/2026-07-27-15-aide-automated-mle-agent.webp"
---

**18 Feb 2025** · [Paper](https://arxiv.org/abs/2502.13138)

---

## 1. Motivation

Automating MLE - going from a task description to a working, well-tuned pipeline - requires iterative trial and error over code, something ReAct-style agents handle poorly: they append every observation to an ever-growing context and treat the whole episode as one long partially observable decision process, which dilutes attention and makes credit assignment opaque.[^1] AIDE instead poses the problem explicitly as $s^* = \arg\max_{s \in S} h(s)$, where $S$ is a space of candidate solution scripts and $h$ is a stateless objective (a validation metric) - turning "agent behavior" into an explicit, inspectable search over solutions.[^1] The system was first released as a Weco AI technical report in April 2024 (the 2024 date in many citations) and formalized in the February 2025 paper.[^1][^3]

---

## 2. Methodology

### 2.1 Search Structure

AIDE maintains a solution **tree** $T$: nodes are candidate scripts and edges are single improvement attempts. It is a **greedy / best-first tree search - not MCTS**: there are no rollouts and no UCT statistics. The main loop (paper Algorithm 1) is:

```
s0 <- empty solution; T0 <- {s0}
for n = 1..N:
    s_n   <- f(s, Sigma(T_{n-1}))   # coding operator proposes next script
    v_n   <- h(s_n)                 # execute and score
    T_n   <- T_{n-1} + (node s_n, edge s -> s_n)
    s     <- pi(T_n)                # hard-coded policy picks next base node
return argmax over nodes of h
```

Later work explicitly treats this policy as the reference "greedy search" baseline: MARS implements an AIDE-style greedy arm in its ablations, and ML-Master reuses AIDE's action triplet inside UCT-MCTS.[^6][^7]

### 2.2 State Representation

A state *is* the code: each node stores a single-file Python program plus its scalar score and a defect flag. Evaluation is deliberately stateless - every candidate can be scored independently via $h(s)$ - which lets the tree be explored in any order without unrolling a long-horizon episode.[^1]

### 2.3 Generation Mechanism

A coding operator $f$ with three prompt-specialized entry points generates children:[^1]

- **Drafting:** the LLM outlines a short plan (architecture, feature-engineering idea), then emits a complete single-file program.
- **Debugging:** given a buggy node, the LLM repairs it from error logs / execution traces while preserving the overall approach.
- **Improving:** the LLM proposes **exactly one "atomic" change** - e.g., switching optimizers or adding a regularization technique - "so that its effect on performance is directly measurable," an early, simple credit-assignment device.[^1]

### 2.4 Evaluation & Grounding

The evaluator $h$ executes the script and returns a scalar validation metric (accuracy, AUC-ROC, loss). Scripts that throw errors are marked buggy, not scored. On the authors' Weco-Kaggle suite, AIDE is prompted to emit a `submission.csv` that is scored against a manually constructed holdout mimicking Kaggle's private test set; performance is expressed as a leaderboard quantile ("Exceeds % of Human" = \$100(1-q)$).[^1] Grounding is therefore exclusively in executed numbers, never in LLM self-assessment.

### 2.5 Memory / Information Flow

A summarization operator $\Sigma(T)$ compresses the tree's history into only three things: performance metrics, hyperparameter settings (when a sweep occurred), and debugging hints (e.g., misaligned shapes in tracebacks). A **static data preview** (row counts, column names, splits) is injected into every coding prompt.[^1] The design goal is to avoid ReAct-style unbounded context growth: the LLM sees a distilled summary of the whole tree plus the full code of the one node being edited.

### 2.6 Selection & Propagation

The policy $\pi$ is a **simple hard-coded rule**, with no learned or value-guided selection:[^1]

1. If fewer than the target number of initial drafts exist → **Draft**.
2. Else if a buggy node remains within a debug-depth cap → **Debug** it.
3. Else → **Improve** the best valid node.

The tree grows incrementally; the best-scoring node ever evaluated is returned at budget end.

### 2.7 Anti-Slop / Anti-Hallucination Mechanisms

Four structural gates: (a) scoring only from executed validation metrics; (b) the one-atomic-change constraint, which makes each node's performance delta attributable to a single edit; (c) the debug-depth cap, which prevents infinite repair loops on broken code; and (d) an explicit contamination check - the authors correlate performance with competition recency (finding no significant effect) and note that live-competition submission is the only complete fix for pretraining leakage.[^1]

---

## 3. Results

- **Weco-Kaggle Lite (16 tabular competitions):** average "Exceeds % of Humans" of **51.38%**, above-median in 50% of tasks; baselines H2O AutoML 35.34% and LangChain AutoGPT 32.34%. Full Weco-Kaggle (63 competitions): 48.23% average.[^1]
- **MLE-Bench (OpenAI-reported, pass@1):** AIDE + o1-preview earns **16.9% any-medal**, about 4× OpenHands (4.4%); AIDE + GPT-4o 8.7%.[^1][^4] On MLE-Bench Lite, o1-preview + AIDE vs. raw o1-preview: valid submissions 92.4% ± 2.6 vs. 63.6% ± 4.5; above median 59.1% vs. 13.6%; any medal 36.4% vs. 7.6% (p < 0.01 on all metrics, two-tailed t-test).[^1] Later leaderboard entries (24 h): 17.12% ± 0.61 (o1-preview), 8.63% (GPT-4o).[^5]
- **RE-Bench (METR):** AIDE outpaces human AI R&D experts in ~2-hour windows; humans overtake by ~8 hours; on Triton-kernel optimization AIDE's final solution surpasses the human expert solution even with extended human time.[^1]
- Medal-rate figures above were reported by OpenAI's MLE-Bench team, not re-run by the AIDE authors; hardware and budget match the MLE-Bench reference setup (24 h).[^4]

---

## 4. Limitations & Assumptions

- The Weco-Kaggle holdout is not the official Kaggle private test set, so percentile estimates carry variance; pretraining contamination cannot be fully excluded.[^1]
- The hard-coded policy has no principled exploration/exploitation trade-off - the central critique later addressed by UCT-based ML-Master and budget-aware MARS.[^6][^7]
- Single-file solutions cap complexity: MARS later shows monolithic scripts average 474.8 LOC / 1.0 file versus 1103.9 LOC / 6.7 files with modular decomposition.[^7]
- Greedy best-node exploitation can stagnate at local optima.

---

## 5. Critical Analysis

- **Distinctive strength:** AIDE made the search object *legible* - a tree of independently scored scripts with one-atomic-change edges - converting MLE agency from an opaque transcript into a measurable optimization trace. This is why it became the field's reference baseline.
- **Structural weakness / trade-off:** the stateless, greedy, single-file design buys simplicity at the cost of exploration control, solution modularity, and cross-task memory; nearly every successor keeps AIDE's Draft/Debug/Improve vocabulary while replacing its selection and state machinery.
- **Connections:** ML-Master re-implements AIDE's action triplet inside UCT-MCTS and beats it under the same LLM (29.3% vs. 14.7% any-medal with DeepSeek-R1).[^6] MARS re-runs AIDE in a controlled identical environment (23.1% vs. 43.1% any-medal, Gemini-2.5-Pro) and uses a greedy AIDE-style arm as an ablation.[^7] R&D-Agent positions itself against AIDE as "the previous public best performer."[^8] FormulaCode represents the opposite evaluation philosophy - continuous multi-workload speedups instead of single-metric leaderboard medals.[^9]

---

## 6. References

[^1]: Jiang et al., 2025, "AIDE: AI-Driven Exploration in the Space of Code" - https://arxiv.org/abs/2502.13138 (full text: https://arxiv.org/html/2502.13138v1)
[^2]: Weco AI, AIDE code - https://github.com/WecoAI/aideml
[^3]: Weco AI, "AIDE: Data Science Automation Technical Report," April 2024 - https://www.weco.ai/blog/technical-report
[^4]: Chan et al., 2024, "MLE-Bench: Evaluating Machine Learning Agents on Machine Learning Engineering" - https://arxiv.org/abs/2410.07095 ; https://github.com/openai/mle-bench
[^5]: MLE-Bench leaderboard results table - https://github.com/openai/mle-bench/issues/138
[^6]: Liu et al., 2025, "ML-Master: Towards AI-for-AI via Integration of Exploration and Reasoning" - https://arxiv.org/abs/2506.16499
[^7]: Chen et al., 2026, "MARS: Modular Agent with Reflective Search for Automated AI Research" - https://arxiv.org/abs/2602.02660
[^8]: Yang et al., 2025, "R&D-Agent: Automating Data-Driven AI Solution Building Through LLM-Powered Automated Research, Development, and Evolution" - https://arxiv.org/abs/2505.14738
[^9]: Sehgal et al., 2026, "FormulaCode: Evaluating Agentic Optimization on Large Codebases" - https://arxiv.org/abs/2603.16011
