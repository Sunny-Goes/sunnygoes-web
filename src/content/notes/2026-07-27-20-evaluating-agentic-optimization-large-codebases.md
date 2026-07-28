---
title: "FormulaCode: Evaluating Agentic Optimization on Large Codebases"
date: 2026-07-17
abstract: "FormulaCode is a live, repository-scale benchmark that evaluates agentic performance engineering against human-expert patches on 957 real bottlenecks mined from 245,477 PRs across 70 ASV-instrumented scientific-Python repositories, using correctness rollback, statistical significance testing, and an expert-relative Advantage metric with a built-in contamination probe."
tags: ["benchmark", "code-optimization", "evals"]
chapter: ai
paper: "https://arxiv.org/abs/2603.16011"
cover: "papers/2026-07-27-20-evaluating-agentic-optimization-large-codebases.webp"
---

**17 Jul 2026** · [Paper](https://arxiv.org/abs/2603.16011)

---

## 1. Motivation

Existing code benchmarks rely on synthetic tasks, binary correctness, or single-objective evaluation, and medal-style MLE benchmarks (e.g., MLE-Bench) score one leaderboard metric per task, ignoring execution cost, workload diversity, and whether a "win" exceeds what a human expert already achieved.[^1][^8] FormulaCode asks a stricter question: can agents perform **holistic, repository-level, multi-objective performance optimization** on real codebases, measured against the expert patches that actually fixed each bottleneck? The benchmark is live-updating (~27 new tasks/month in 2025).[^1][^2] (The v1 title, "Evaluating Agentic Optimization on Large Codebases," matches how the work is often cited; v3 adds the FormulaCode name.)

---

## 2. Methodology

This is a benchmark/evaluator paper, so the machinery below describes the evaluation harness and task-construction pipeline rather than a search algorithm.

### 2.1 Search Structure

Because this is a benchmark, the relevant "search structure" is that of the evaluated agents: they get unrestricted bash access over a baseline repository snapshot $\mathrm{Code}_0$ and may make arbitrary repo-level edits. The agents tested are **generic scaffolds - Terminus 2 and OpenHands** - not bespoke search trees: FormulaCode deliberately probes off-the-shelf agentic loops rather than specialized MLE search.[^1]

### 2.2 State Representation

A task is a tuple: a problem description of a real performance regression from GitHub, a Dockerized baseline repository snapshot, a workload suite, and correctness tests. Workloads are hierarchically organized (module / class / function), enabling stratified analysis; tasks average **264.6 workloads** each.[^1]

### 2.3 Generation Mechanism

Agent-produced candidate patches with no constraint on edit scope, from function- to module-level. Generation behavior is itself an object of study: full interactive traces, token usage, and tool-call distributions (editing / search / view / bench / test, classified by gpt-oss-120b) are recorded for post-hoc analysis.[^1]

### 2.4 Evaluation & Grounding

This is the benchmark's core machinery, in three layers:[^1]

**(a) Correctness.** The upstream PyTest suite plus **snapshot tests** verifying that each workload's local variables are preserved. Any failure → the patch is **rolled back** and its speedup set to 1: "all reported speedups are strictly correctness-preserving."

**(b) Performance measurement.** ASV (airspeed velocity) warm-up + multi-sample timing with adaptive stopping (2–40 samples per workload), with statistical-significance validation per the ASV protocol on isolated AWS EC2 hardware. Baseline, expert, and agent code are measured **sequentially in fresh containers on the same instance** - statistically matched by construction.

**(c) Metrics.** Let $\mathrm{speedup}_{agent}$ be the geometric mean over workloads of $\mathrm{workload}(\mathrm{Code}_0)/\mathrm{workload}(\mathrm{Code}_{agent})$.

$$
\mathrm{Adv} = \mathrm{speedup}_{agent} - \mathrm{speedup}_{expert}, \qquad \tilde{\mathrm{Adv}} = \frac{\mathrm{Adv}}{\sqrt{\sigma^2_{agent} + \sigma^2_{expert}}}
$$

- **Advantage (Adv)** is expert-relative: $\mathrm{Adv} = 0$ implies the agent merely reproduced the expert solution - a **built-in contamination probe**; super-human optimization requires Adv > 0.
- **Stratified advantage** $\mathrm{Adv}(\ell)$ is reported over code-hierarchy levels (function/class/module).
- **Normalized advantage** $\tilde{\mathrm{Adv}}$ is a signal-to-noise ratio rewarding measurement consistency.
- **Cost-weighted advantage** $\mathrm{Adv}/\mathrm{cost}$ incorporates token accounting.
- Aggregation across agent configurations uses **Ranked Pairs (Tideman)**.[^1]

### 2.5 Memory / Information Flow

Not applicable to the benchmark itself - memory is a property of evaluated agents. The harness's contribution is archival: full traces, token counts, and tool-call logs per task, plus a live public dashboard.[^1][^2]

### 2.6 Selection & Propagation

"Selection" here is the task-construction pipeline that decides which candidate bottlenecks enter the benchmark, in four stages:[^1][^2]

```
Discover -> repos with asv.conf.json, >100 stars, mergeable PRs (245,477 PRs)
Judge    -> rule-based + LLM filters for genuine performance PRs
Build    -> reproducible Docker environments
Verify   -> correctness + statistically significant EXPERT speedup required
```

Agent evaluation ran on **FormulaCode-V (108 tasks)**, a subset preserving repository and difficulty distribution, owing to compute constraints.[^1]

### 2.7 Anti-Slop / Anti-Hallucination Mechanisms

(a) correctness rollback prevents reward hacking via broken "speedups"; (b) expert-relative advantage neutralizes easy-task inflation and memorization; (c) a leakage analysis finds "minimal effects from data leakage"; (d) ASV significance testing plus normalized advantage controls measurement noise; (e) behavioral auditing: on average **~48.5% of agent trajectories are rejected for correctness violations** - mostly PyTest failures - showing agents over-allocate tool calls to performance validation relative to correctness validation.[^1]

---

## 3. Results

**Global leaderboard on FormulaCode-V (108 tasks):**[^1]

| Configuration | RP rank (Adv) | Adv | $\tilde{\mathrm{Adv}}$ | Speedup |
|---|---|---|---|---|
| OpenHands + Claude 4.0 Sonnet | **1** | **−0.0112** | −0.0483 | 1.0539 |
| OpenHands + GPT-5 | 3 | −0.0209 | −0.0702 | 1.0825 |
| Terminus 2 + Claude 4.0 Sonnet | 4 | −0.0410 | −0.1065 | 1.0987 |
| Terminus 2 + GPT-5 | 7 | −0.0504 | −0.1387 | 1.0585 |
| **Human expert** | - | 0.0000 | 0.0000 | **1.1040** |

Every configuration achieves speedup > 1, but **all advantages are negative** - "a fundamental performance gap" versus expert patches.[^1] Agents are stronger at function-level than module-level optimization (except OpenHands + Claude, which inverts the profile); they can beat experts on parallelizing and batching but struggle with **vectorized operations**. Experts achieve the best global speedup while tolerating large single-workload regressions; agents negotiate such multi-workload trade-offs less effectively. Frontier models are more cost-effective than open-weights models despite higher per-call prices. Trajectory lengths are highly skewed (e.g., Terminus 2 + GPT-5: mean 295.5 vs. median 198.5 interactions), and scaffold choice changes the same model's behavior substantially. Qualitatively, an agent found a Fenwick-tree $O(n \log n)$ fix in Optuna but missed the expert's holistic vectorized rewrite (−0.036 advantage), while beating the expert on NetworkX BFS early-termination (+0.0132).[^1]

---

## 4. Limitations & Assumptions

- Scope is restricted to scientific-Python repositories that ship ASV benchmarks; web frameworks, distributed systems, and other languages are out of scope.[^1]
- The performance signal is bounded by workload coverage of exercised code paths.
- Full-agent evaluation covers only the 108/957-task FormulaCode-V subset.
- Absolute timings are hardware-specific (single AWS configuration); the advantage metric mitigates, but cross-platform robustness is untested.[^1]

---

## 5. Critical Analysis

- **Distinctive strength:** the expert-relative Advantage with its zero-point contamination probe, combined with correctness rollback and ASV significance testing - the first evaluation stack in this theme where a memorized or broken "win" is structurally impossible to count.
- **Structural weakness / trade-off:** ecological validity of the evaluated population: only generic scaffolds (Terminus 2, OpenHands) are tested, so results characterize off-the-shelf agents, not the specialized search machinery (MCTS, islands, trace fusion) that MLE-focused papers build; and the ASV requirement narrows coverage to one ecosystem.
- **Connections:** FormulaCode's evaluation philosophy (continuous multi-workload speedups, expert-relative advantage, cost weighting) is the benchmark-side counterpart to the single-metric medal paradigm that AIDE, ML-Master, and MARS optimize on MLE-Bench.[^6][^8] Its **cost-weighted advantage** formalizes the same performance-vs-execution-cost trade-off that MARS encodes agent-side in its efficiency-guided reward $R(v) = G(v)\,[t/L]^w$, and its rollback + significance machinery is exactly the measurement infrastructure needed to make such cost signals trustworthy.[^5] Like FM-Agent's execution-grounded evaluators on KernelBench/ALE-Bench, it demonstrates that execution feedback, not LLM judging, is the credible substrate for optimization claims.[^7]

---

## 6. References

[^1]: Sehgal et al., 2026, "FormulaCode: Evaluating Agentic Optimization on Large Codebases" - https://arxiv.org/abs/2603.16011 (full text: https://arxiv.org/html/2603.16011v3 ; PDF: https://arxiv.org/pdf/2603.16011)
[^2]: FormulaCode project site (pipeline, ICML 2026 acceptance, live dashboard) - https://formulacode.org/
[^3]: FormulaCode evaluation harness - https://github.com/formula-code/fc-eval
[^4]: FormulaCode dataset - https://huggingface.co/datasets/formulacode/formulacode-all
[^5]: Chen et al., 2026, "MARS: Modular Agent with Reflective Search for Automated AI Research" - https://arxiv.org/abs/2602.02660
[^6]: Jiang et al., 2025, "AIDE: AI-Driven Exploration in the Space of Code" - https://arxiv.org/abs/2502.13138
[^7]: FM Agent Team (Baidu AI Cloud), 2025, "The FM Agent" - https://arxiv.org/abs/2510.26144
[^8]: Chan et al., 2024, "MLE-Bench: Evaluating Machine Learning Agents on Machine Learning Engineering" - https://arxiv.org/abs/2410.07095
[^9]: Jimenez et al., 2024, "SWE-bench: Can Language Models Resolve Real-World GitHub Issues?" (benchmark lineage) - https://arxiv.org/abs/2310.06770
