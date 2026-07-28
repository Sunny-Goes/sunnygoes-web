---
title: "GigaEvo, ShinkaEvolve, and ThetaEvolve: Efficiency-Focused Derivatives of AlphaEvolve"
date: 2025-11-17
abstract: "Three independent open-source derivatives show that AlphaEvolve-style program evolution can be made reproducible and radically more sample-efficient - GigaEvo by engineering the unspecified infrastructure, ShinkaEvolve by principled parent/LLM selection (new circle-packing SOTA in 150 samples), and ThetaEvolve by batch generation plus test-time RL (new best-known bounds from a single 8B open model)."
tags: ["evolutionary", "open-source", "efficiency"]
chapter: ai
paper: "https://arxiv.org/abs/2511.17592"
cover: "papers/2026-07-27-08-gigaevo-shinkaevolve-thetaevolve.webp"
---

**2025** · [GigaEvo](https://arxiv.org/abs/2511.17592) · [ShinkaEvolve](https://arxiv.org/abs/2509.19349) · [ThetaEvolve](https://arxiv.org/abs/2511.23473)

---

## 1. Motivation

AlphaEvolve demonstrated frontier results but disclosed neither its database dynamics nor budgets, and its ~thousand-sample, ~100-compute-hour-per-candidate regime is out of reach for most labs.[^4] These three systems attack complementary bottlenecks: GigaEvo re-implements the missing machinery as a validated open framework;[^1] ShinkaEvolve asks how few samples suffice if selection and mutation are principled;[^2] ThetaEvolve asks whether a small open model can reach AlphaEvolve-level results when test-time compute is scaled via batch inference *and* the model is trained by RL during the run.[^3]

---

## 2. Methodology

### 2.1 Search Structure

**GigaEvo:** four components - a Redis database of `Program` units (UUID, source, lifecycle state, metrics, genealogical lineage) with optimistic concurrency control; an asyncio **DAG execution engine** (execution → validation → complexity analysis → LLM inference); an **evolution engine** implementing MAP-Elites over fitness × validity behavior cells, single- or multi-island with periodic migration; and a LangGraph **mutation agent**.[^1] **ShinkaEvolve:** a fixed-size archive of island subpopulations in a three-phase loop - (1) parent + inspiration sampling, (2) LLM mutation with novelty rejection, (3) execution + world feedback updating LLM-ensemble probabilities and a meta-scratchpad; islands evolve in parallel with occasional migration, but "we prevent the island-specific best-performing program from migrating" (following FunSearch/Tanese).[^2][^5] **ThetaEvolve:** a deliberately *simplified* loop built on OpenEvolve as the dynamic environment - one large program database ranked by score/diversity with eviction (MAP-Elites-style variants ablated), optionally wired into RL training (GRPO, asymmetric clipping 0.2/0.28, no KL regularization).[^3][^6]

### 2.2 State Representation

All three evolve whole programs with AlphaEvolve-style `EVOLVE-BLOCK-START/END` mutable regions (ShinkaEvolve programmatically protects immutable code).[^1][^2][^3] GigaEvo defines a problem as a directory - `task_description.txt`, declarative `metrics.yaml` (direction, discretization bounds, significance thresholds), `validate.py`, `initial_programs/` - making tasks versioned artifacts.[^1]

### 2.3 Generation Mechanism

**GigaEvo**'s LangGraph agent composes prompts from task description, parent code, metrics, generated insights, and lineage analyses, with **multi-model routing** (different models for insight generation vs. mutation) and both diff and rewrite modes; a key empirical finding: "many open-source models struggle to reliably produce syntactically correct diffs … the rewrite strategy produces robust, syntactically valid programs with low failure rates."[^1] **ShinkaEvolve** offers three mutation modes - AlphaEvolve-style SEARCH/REPLACE diffs, full rewrites with guaranteed immutable-block preservation, and **explicit crossover** (a second archive program is sampled and the LLM combines them; dedicated `prompts_cross.py`) - with invalid patches resampled via Reflexion parsing feedback; model and temperature are drawn per-mutation from a multi-provider pool.[^2][^6] **ThetaEvolve** uses a **single LLM** with prompts containing optionally only the parent, but generates in batches: $B{=}32$ parents × $n{=}16$ responses (temperature 1.0) per step, sized to saturate vLLM/SGLang batched inference, which AlphaEvolve's single-prompt async pipeline cannot exploit.[^3]

### 2.4 Evaluation & Grounding

**GigaEvo:** DAG ordering enforces metrics-before-insights; kissing-number validation uses exact integer arithmetic (arbitrary-precision squared norms, exhaustive pairwise distance checks).[^1] **ShinkaEvolve:** multi-objective assessment per program - scalar fitness, public metrics, and textual feedback, all archived and rendered into future prompts.[^2] **ThetaEvolve:** manually designed "unhackable evaluators"; for RL, rewards are shaped as $R(s) = k\cdot F(s)$ with $F(s) = \mathrm{clip}(H(s),0,1)^\alpha$, $H$ mapping task bounds $[L,U]\to[0,1]$ ($k{=}3$), because raw objective ranges (e.g., 0.90–0.96) cannot differentiate candidates.[^3]

### 2.5 Memory / Information Flow

**GigaEvo** adds two analysis layers: per-program **insights** (LLM-categorized by type, effect, severity) and **bidirectional lineage tracking** - how a program improved over ancestors *and* how descendants improved over it - aggregated into mutation prompts.[^1] **ShinkaEvolve** stores textual feedback per program and runs a **meta-scratchpad**: every $T$ generations a meta-agent distills recent evaluations into strategies and recommendations appended to mutation prompts.[^2] **ThetaEvolve** keeps the database as sole in-run memory, but the RL checkpoint itself becomes cross-task memory - trained checkpoints progress faster on unseen tasks.[^3]

### 2.6 Selection & Propagation

**GigaEvo:** fitness-proportional elite selection within MAP-Elites cells; multi-island = independent archives with periodic migration of top programs.[^1] **ShinkaEvolve** introduces two parent-selection rules - power-law sampling $p_i \propto r_i^{-\alpha}$ over fitness ranks, and weighted sampling $w_i = s_i \cdot h_i$ with sigmoid performance $s_i$ and offspring-count novelty $h_i = 1/(1+N(P_i))$ - plus a **UCB1 bandit over the LLM ensemble**, where each LLM's reward is the *relative improvement* $r_i^u = \exp(\max(r_i - r_i^b, 0)) - 1$ against baseline $r_i^b = \max(\text{parent}, \text{initial})$, promoting "bold, high-risk, high-reward mutations."[^2] **ThetaEvolve:** database ranking with eviction and OpenEvolve-inherited parent sampling.[^3]

### 2.7 Anti-Slop / Anti-Hallucination Mechanisms

**GigaEvo:** rewrite-mode robustness, significance thresholds, exact-integer validation, error traces captured into insight generation.[^1] **ShinkaEvolve:** **code-novelty rejection sampling** - embed mutable code, compute cosine similarity within the island, and if max similarity exceeds $\eta = 0.95$, query an LLM-as-novelty-judge; near-duplicates are never evaluated - plus immutable-block enforcement.[^2] **ThetaEvolve:** an **early check** rejecting responses missing SEARCH/REPLACE blocks; a **lazy penalty** discarding children equivalent (up to comment removal) to any program already in the database, stopping the model from repeating the current best program near best-known scores; and evaluator-integrity fixes - it documents OpenEvolve's 1e-6 circle-overlap tolerance (reporting strict results that survive radius shrinkage) and corrects "several typos" in AlphaEvolve's ThirdAutoCorrIneq verifier.[^3]

---

## 3. Results

- **GigaEvo** approximately reproduces AlphaEvolve: Heilbronn triangles ($n{=}11$) 0.0364 vs. 0.0365; circle packing $n{=}26$ 2.63598, $n{=}32$ 2.939 vs. prior SOTA 2.937; kissing $d{=}12$ reached the known bound 840 without improvement (authors speculate training-data contamination); FunSearch bin-packing SOTA replicated in ~200 LLM calls (Llama-3 7B + 70B, temperature 0.6).[^1]
- **ShinkaEvolve** sets a circle-packing ($n{=}26$) SOTA of ≈2.635983 in **150 samples**; +~2.3% average over ALE-Agent on ALE-Bench LITE (ahc039 would rank 2nd on AtCoder); an evolved MoE load-balancing loss (30 training iterations) transfers to a 2.7B-parameter model, beating global-batch LBL on perplexity and 7 downstream benchmarks. Ablations: weighted parent sampling > hill-climbing; bandit ensemble > fixed ensemble > single LLM; embedding rejection ≫ no rejection.[^2]
- **ThetaEvolve:** with one DeepSeek-R1-0528-Qwen3-8B model, new best-known bounds - circle packing 2.63598308 (vs. ShinkaEvolve 2.63598283, AlphaEvolve 2.63586276) and first autocorrelation inequality 1.503133 (vs. AlphaEvolve 1.503164); its discovered *program* finds the configuration in ~3 s vs. ~75 s for ShinkaEvolve's six-frontier-model program; RL-at-test-time beats inference-only across four tasks and transfers to unseen tasks.[^3]

These numbers come from each paper's own evaluators; tolerances and budgets differ (ThetaEvolve itself flags the tolerance issue), so cross-system comparisons are approximate.[^3]

---

## 4. Limitations & Assumptions

GigaEvo found "no clear benefit of multi-island MAP-Elites," and its report is not peer-reviewed.[^1] ShinkaEvolve's AIME gains are partly attributed by its own authors to training-data contamination, and dollar costs are figure-only.[^2] ThetaEvolve needs per-task reward-shaping bounds $(L, U, \alpha)$ and its RL cost is unquantified.[^3] All three inherit the AlphaEvolve premise: a hand-built, machine-checkable evaluator per task.

---

## 5. Critical Analysis

- **Distinctive strength:** collectively they turn AlphaEvolve from an unreproducible white paper into an engineering science - ShinkaEvolve's 150-sample SOTA shows selection/bandit/novelty mechanisms dominate raw sampling scale,[^2] and ThetaEvolve shows the loop itself is a trainable RL environment.[^3]
- **Structural weakness / trade-off:** all three validate mostly on the same small suite of AlphaEvolve math tasks (circle packing, autocorrelation, kissing numbers), risking benchmark fixation; and their evaluation protocols are not mutually calibrated, as ThetaEvolve's tolerance findings demonstrate.[^3]
- **Connections:** all three are derivatives of **AlphaEvolve (#4)** and inherit **FunSearch (#6)**-style island migration (ShinkaEvolve cites it directly; GigaEvo replicates its bin-packing result).[^1][^2][^5] ThetaEvolve is built on **OpenEvolve (#7)** code,[^3][^6] while ShinkaEvolve's explicit crossover is the documented contrast with OpenEvolve's inspirations-only design;[^6] all three appear in **MLEvolve (#5)**'s comparative tables, and their archives instantiate **MAP-Elites (#25)**.[^7]

---

## 6. References

[^1]: Khrulkov et al., "GigaEvo: An Open Source Optimization Framework Powered by LLMs and Evolution Algorithms," arXiv:2511.17592 - https://arxiv.org/abs/2511.17592 ; code: https://github.com/AIRI-Institute/gigaevo-core
[^2]: Lange, Imajuku & Cetin, "ShinkaEvolve: Towards Open-Ended and Sample-Efficient Program Evolution," arXiv:2509.19349 - https://arxiv.org/abs/2509.19349 ; code: https://github.com/SakanaAI/ShinkaEvolve
[^3]: Wang et al., "ThetaEvolve: Test-time Learning on Open Problems," arXiv:2511.23473 - https://arxiv.org/abs/2511.23473 ; code: https://github.com/ypwang61/ThetaEvolve
[^4]: Novikov et al., "AlphaEvolve: A coding agent for scientific and algorithmic discovery," arXiv:2506.13131 - https://arxiv.org/abs/2506.13131
[^5]: Romera-Paredes et al., "Mathematical discoveries from program search with large language models," *Nature* 625:468–475 - https://www.nature.com/articles/s41586-023-06924-6
[^6]: OpenEvolve repository and Discussion #412 (crossover contrast) - https://github.com/algorithmicsuperintelligence/openevolve ; https://github.com/algorithmicsuperintelligence/openevolve/discussions/412
[^7]: Du et al., "MLEvolve," arXiv:2606.06473 - https://arxiv.org/abs/2606.06473 ; Mouret & Clune, "MAP-Elites," arXiv:1504.04909 - https://arxiv.org/abs/1504.04909
