---
title: "MARS / MARS+: Modular Agent with Reflective Search for Automated AI Research"
date: 2026-05-19
abstract: "MARS treats automated AI research as cost-constrained search over a space of whole software repositories, combining budget-aware MCTS with an efficiency-shaped reward, a Design-Decompose-Implement modular construction pipeline, and a comparative reflective memory whose lessons are distilled from diffs against the previous best solution."
tags: ["agents", "mcts", "automation"]
chapter: ai
paper: "https://arxiv.org/abs/2602.02660"
cover: "papers/2026-07-27-17-mars-mars-plus.webp"
---

**19 May 2026** · [Paper](https://arxiv.org/abs/2602.02660)

---

## 1. Motivation

Machine learning engineering (MLE) differs from general software engineering in two ways that break naive agent loops: evaluation is **computationally expensive** (each candidate requires training), and **performance attribution is opaque** (it is hard to say which edit caused a metric shift).[^1] Greedy agents such as AIDE ignore both issues - they select the best node without accounting for evaluation cost and summarize history without isolating causes.[^4] MARS therefore formalizes the problem as $s^* = \arg\max_s O(s, E)$ subject to $\mathrm{Cost}(s) \le B$, and designs every mechanism - reward, memory, state granularity - around cost-awareness and causal attribution.[^1] **MARS+** is not a separate paper: it appears only in v3 as "a variant configured to execute two concurrent search trees with increased compute (2×H100 GPUs and 48 vCPUs)."[^1]

---

## 2. Methodology

### 2.1 Search Structure

Budget-aware **Monte Carlo Tree Search** with the standard four phases over a tree whose nodes are **entire software repositories**, not single scripts. (The "simulation" of an executed ML pipeline is simply the real evaluation - there is no learned rollout policy.) One iteration runs:

```
Selection:    descend by UCT until a not-fully-expanded node
Expansion:    Draft / Improve / Debug child via specialized agents
Simulation:   execute the repository; score with efficiency-guided reward
Backprop:     propagate reward along the path; update visit statistics
```

A root re-activation rule restarts drafting when traversal bottoms out at a fully-expanded leaf, so the tree keeps acquiring new lineages instead of stalling.[^1]

### 2.2 State Representation

A problem is a tuple $P = (I, E, O)$ (Instruction, Environment, Objective). Each node state is a modular **multi-file repository** plus score, execution cost, and defect status. Fully-expanded bookkeeping: buggy nodes are always fully expanded; valid nodes after $\ge N_i = 2$ improve-children; the root unless it is childless or the best solution has not improved after $n_s$ valid nodes.[^1]

### 2.3 Generation Mechanism

A **"Design-Decompose-Implement"** pipeline with three specialized agents:[^1]

```
Idea agent    -> proposes a research direction
Modular agent -> architects it into independent, testable modules
Coding agent  -> implements the modules + main script
```

Updates use **Diff-Based Refinement** - specific logic blocks are patched without regenerating the whole codebase. Expansion operators: **Drafting** (root expansion, new solution from scratch), **Improvement** (modify modules + main script of a valid node), **Debugging** (inherit structure, fix failing modules; buggy children enter an automatic debug loop of up to $N_d = 10$ actions).[^1]

### 2.4 Evaluation & Grounding

**Efficiency-Guided Reward.** Let $G(v)$ be the min–max-normalized validation metric over explored history (0.5 if $M_{\max} = M_{\min}$). Then

$$
R(v) = G(v)\cdot\left[\frac{t(v)}{L(v)}\right]^{w}, \quad w = -0.07
$$

where $t(v)$ is execution time, $L(v)$ the time limit, and the penalty weight follows Tan et al.[^1][^10] Two candidates with equal accuracy but different runtime therefore receive different rewards - the reward, not the selection rule, carries budget awareness. Task preparation uses a multi-agent metadata extractor plus an EDA agent whose prompt mandates "Ensure all analysis is strictly performed on the training set to prevent data leakage."[^1]

### 2.5 Memory / Information Flow

The memory object is a **Comparative Reflective Memory**: a bounded pool of structured, causally attributed lessons. For each valid solution, a two-stage distillation runs: an **Empirical Analysis Agent** extracts objective findings from logs, then a **Lesson Distillation Agent** performs *comparative reflection on the delta between the current solution and the previous best-known solution*, emitting structured lessons: (1) the isolated causal change, (2) comparative impact analysis, (3) a generalized rule. Failures get a dedicated debugging-lesson agent (fix efficacy, failure logic, preemptive guidelines). A **Review Agent** filters redundancy; the $K_m = 30$ most recent lessons stay in context, and the agent must **explicitly cite lessons when applying them**.[^1]

### 2.6 Selection & Propagation

Standard **UCT child selection** descends until a not-fully-expanded node; the efficiency-shaped reward is backpropagated along the path. Budget-awareness thus enters *through the reward signal* rather than a modified selection formula - a deliberately simple budget controller. MARS+ scales this by running **two concurrent search trees** (2×H100, 48 vCPUs).[^1]

### 2.7 Anti-Slop / Anti-Hallucination Mechanisms

(a) Comparative delta analysis grounds lessons in concrete code diffs, mitigating misattribution; (b) a **lesson audit**: Claude 4.6 Sonnet audited all **3,611 solution lessons** generated by Gemini-3-Pro-Preview - **88.34%** correctly attributed metric shifts to specific code changes "rather than relying on hallucinated narratives," with a manual 20-lesson check giving 90% causal accuracy; (c) mandatory lesson citation; (d) anti-leakage EDA prompt rules; (e) modular testability replacing fragile monoliths.[^1]

---

## 3. Results

Controlled environment (1×A100-40GB, 12 vCPUs, 220 GB RAM; no warm-up; **baselines re-run identically**; mean ± SEM, 3 runs, 24-h limit) on MLE-Bench:[^1]

| Agent (model) | Valid | Above med. | Gold | Any medal |
|---|---|---|---|---|
| AIDE (Gemini-2.5-Pro) | 84.4 | 40.0 | 12.4 | 23.1 |
| AIDE (Gemini-3-Pro-Preview) | 82.7 | 48.0 | 16.4 | 32.4 |
| AIRA-dojo (Gemini-3-Pro-Preview) | 98.2 | 55.6 | 24.0 | 37.8 |
| **MARS (Gemini-2.5-Pro)** | 94.2 | 52.4 | 19.1 | **43.1** |
| **MARS (Gemini-3-Pro-Preview)** | 98.7 | 65.8 | 31.1 | **56.0** |
| **MARS+ (Gemini-3-Pro-Preview, 2 trees)** | **100.0** | **74.2** | **33.8** | **62.7** |

Quoted official-leaderboard comparators (not re-run by MARS; different models/budgets): ML-Master 29.3, R&D-Agent (GPT-5) 35.1, InternAgent 36.4, "Famou-Agent" - a v3 typographical alias for **FM Agent** - 43.6, Leeroo 50.7, ML-Master 2.0 56.4.[^1][^7] MARS+ at 62.7% exceeds all; standard MARS's 31.1% gold is the highest gold rate among agents without leaderboard-scale resources. **Ablations (MLE-Bench-Lite, 22 competitions):** removing modular decomposition, removing memory, or using greedy (= AIDE-style) or vanilla MCTS ($w = 0$) all degrade performance; $w = -0.07$ is optimal, while $w = -0.15$ biases toward trivial fast nodes. Lesson-utilization rate 65.8% ± 1.1; **cross-branch lesson-transfer rate 63.0% ± 1.8**. Best solutions average 1103.9 ± 35.9 LOC / 6.7 files with decomposition vs. 474.8 LOC / 1.0 file without. Cross-model generality confirmed with Claude 4.6 Sonnet.[^1]

---

## 4. Limitations & Assumptions

- Scope is MLE-Bench-style tasks only - no literature synthesis or unconstrained research.[^1]
- High API cost for tree search plus comparative distillation; proposed mitigations (caching, early stopping, model routing) are not yet implemented.[^1]
- The authors concede lessons "remain susceptible to hallucinations or misattributions … comparative 'delta' analysis significantly mitigates this risk … it does not entirely eliminate it."[^1]
- Comparability: unlike ML-Master 2.0 (warmed on 407 competitions), MARS/MARS+ use no prior-wisdom warm-up; leaderboard comparator numbers were not re-run under matched conditions.[^1][^6]

---

## 5. Critical Analysis

- **Distinctive strength:** the only system in this theme that makes *execution cost a first-class search signal* (latency-exponent reward) and *audits its own memory for causal accuracy* (88.34% of 3,611 lessons verified) - credit assignment as an engineered, measured component rather than an assumption.
- **Structural weakness / trade-off:** the machinery is expensive (three construction agents plus four memory agents per node) and its controlled-environment advantage depends on re-running baselines on modest hardware; MARS+'s headline 62.7% is partly a compute-scaling result (2 trees, 2×H100).
- **Connections:** MARS keeps the MCTS skeleton of ML-Master but replaces its scalar reward with a cost-shaped one and its parent/sibling memory with comparative lesson distillation; MARS+ (62.7%) is positioned directly against ML-Master 2.0 (56.4%), whose 407-competition warm-up MARS flags as a setup disparity.[^5][^6] AIDE's greedy policy survives as MARS's greedy-search ablation arm, and MARS's repository-level states answer AIDE's single-file limitation.[^4] FormulaCode's cost-weighted advantage is the benchmark-side formalization of the same performance-vs-execution-cost trade-off MARS encodes agent-side in $R(v)$.[^9]

---

## 6. References

[^1]: Chen et al., 2026, "MARS: Modular Agent with Reflective Search for Automated AI Research" - https://arxiv.org/abs/2602.02660 (PDF: https://arxiv.org/pdf/2602.02660)
[^2]: MARS code - https://github.com/jfc43/MARS
[^3]: MARS ICML 2026 poster - https://icml.cc/virtual/2026/poster/61408
[^4]: Jiang et al., 2025, "AIDE: AI-Driven Exploration in the Space of Code" - https://arxiv.org/abs/2502.13138
[^5]: Liu et al., 2025, "ML-Master: Towards AI-for-AI via Integration of Exploration and Reasoning" - https://arxiv.org/abs/2506.16499
[^6]: Zhu et al., 2026, "Toward Ultra-Long-Horizon Agentic Science: Cognitive Accumulation for Machine Learning Engineering" (ML-Master 2.0) - https://arxiv.org/abs/2601.10402
[^7]: FM Agent Team (Baidu AI Cloud), 2025, "The FM Agent" - https://arxiv.org/abs/2510.26144
[^8]: Yang et al., 2025, "R&D-Agent" - https://arxiv.org/abs/2505.14738
[^9]: Sehgal et al., 2026, "FormulaCode: Evaluating Agentic Optimization on Large Codebases" - https://arxiv.org/abs/2603.16011
[^10]: Tan & Le, 2019, "EfficientNet: Rethinking Model Scaling for Convolutional Neural Networks" (source of the efficiency-penalty weighting) - https://arxiv.org/abs/1905.11946
