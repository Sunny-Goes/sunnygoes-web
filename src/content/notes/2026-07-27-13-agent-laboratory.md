---
title: "Agent Laboratory: Using LLM Agents as Research Assistants"
date: 2025-01-01
abstract: "A pipeline of role-specialized LLM agents (PhD, Postdoc, ML Engineer, Software Engineer, Professor) plus two solver tools (mle-solver, paper-solver) turns a human-provided research idea into a literature review, experiments, and a LaTeX report for as little as $2.33 per paper - an 84% cost decrease versus prior autonomous research methods - with optional human \"co-pilot\" checkpoints that measurably improve output quality."
tags: ["agents", "multi-agent", "automation"]
chapter: ai
paper: "https://arxiv.org/abs/2501.04227"
cover: "papers/2026-07-27-13-agent-laboratory.webp"
---

**2025** · [Paper](https://arxiv.org/abs/2501.04227)

---

## 1. Motivation

The AI Scientist showed end-to-end automation at ~\$15 per paper but with quality far below publishable work and no role for the human researcher.[^2] Agent Laboratory reframes the goal: LLM agents as **research assistants**, not replacements - "not meant to replace the paper writing process done by humans as it was in The AI Scientist." The gaps addressed are cost (an order of magnitude cheaper), modularity (replaceable solver tools), and controllability (co-pilot checkpoints where humans steer each phase).[^1]

---

## 2. Methodology

### 2.1 Search Structure

A **linear three-phase workflow** with per-subtask loops and optional human checkpoints after each subtask (co-pilot mode):

```
Phase 1 Literature Review : PhD agent loops {summary, full text, add paper}
                            over arXiv API (top-20 per query) until N=max texts
Phase 2 Experimentation   : PhD+Postdoc dialogue → plan; ML Engineer + SW Engineer
                            write data-prep code (HF dataset search) → compile-check;
                            mle-solver runs experiments
Phase 3 Report Writing    : paper-solver builds 8-section LaTeX report;
                            reviewer triad → revise-or-finalize loop
```

The PhD agent can loop back to earlier subtasks when review feedback demands it.[^1]

### 2.2 State Representation

State is per-run and structured by phase: a curated literature-review object (selected abstracts/full texts), a shared research-plan string, a **top-programs pool** of best-scoring code files, experimental notes and figures, and the LaTeX report scaffold with section placeholders. Critically, there is **no persistent cross-run memory** - each research idea starts cold (AgentRxiv later adds exactly this).[^1]

### 2.3 Generation Mechanism

**mle-solver** generates machine-learning code through two command types - REPLACE (rewrite the whole file) and EDIT (replace a line range) - sampled against the maintained pool of top-performing programs. It uses batch parallelization ($N$ simultaneous modifications, best replaces worst in the pool) and top-program sampling for diversity, with self-reflection after each success or failure. **paper-solver** generates section text via EDIT commands gated by LaTeX compilation, scaffolds an 8-section report, fills related work with arXiv-assisted search, and refines through a reviewer-feedback loop.[^1]

### 2.4 Evaluation & Grounding

Code is scored by an **LLM reward model** (0–1 alignment of plan, code, and output) - the authors liken this to Tree-of-Thoughts self-evaluated search over program space, and contrast it with AIDE's Kaggle-specific solution search, which "is simply extracting the accuracy rather than scoring the research code and outcomes." For MLE-Bench evaluation the LLM scorer is replaced by **real dev-set accuracy** (80/20 split; final score on the Kaggle test set). Reports are scored by an adapted version of The AI Scientist's NeurIPS-guideline automated reviewer plus three reviewer agents.[^1]

### 2.5 Memory / Information Flow

Within a run: the notes pool, the top-program pool (which stabilizes performance against drift), and the curated review object passed phase to phase. Across runs: nothing. The only external information injection is human feedback at co-pilot checkpoints. This absence of cumulative memory is the paper's main architectural boundary.[^1]

### 2.6 Selection & Propagation

Selection operates at two points: the top-program pool keeps best-scoring code variants (best-of-$N$ batch replacement), and the report-refinement loop is gated by reviewer scores, with the PhD agent deciding finalize versus revise. There is no cross-run propagation - nothing survives a run except the report itself.[^1]

### 2.7 Anti-Slop / Anti-Hallucination Mechanisms

Structural gates: compiler checks on code edits, LaTeX-compilation gating on paper edits, $N_{\text{rep}}=3$ repair attempts, self-reflection, performance-stabilization mechanisms, and a 5-try limit on arXiv queries. But the paper is unusually honest about residual slop: generated papers (especially with gpt-4o) contain **hallucinated experimental details**, and the automated reviewer inflates self-evaluation - it scores generated papers 6.1/10 on average where human reviewers score the same papers 3.8/10, a **−2.3 point gap**: "automated reviewers demonstrate notable discrepancies... with a tendency to highly over-estimate the contribution of self-evaluated work."[^1]

---

## 3. Results

- **Cost/runtime:** gpt-4o completes the full pipeline for **\$2.33 and 1,165 s** end-to-end (o1-mini \$7.51 / 3,617 s; o1-preview \$13.10 / 6,201 s) - versus ~\$15 for The AI Scientist ("6.4× more expensive"; an 84% decrease). Subtask success rates: 94.3% / 92.8% / 95.7% respectively; the literature-review phase fails 60–80% of the time and dominates failures.[^1]
- **Human evaluation** (10 PhD volunteers, 15 autonomous papers): gpt-4o experiment quality 2.6/5, report 3.0/5, usefulness 4.0/5; o1-preview best overall (2.9 / 3.4 / 4.4). NeurIPS-style human scores: 3.5–4.0/10 across backends versus ≈5.85–5.9 for accepted NeurIPS 2024 papers - "on average, papers produced in autonomous mode are below the acceptance threshold."[^1]
- **Automated-vs-human reviewer gap:** 6.1/10 vs 3.8/10 overall (−2.3); clarity 3.6/4 vs 2.4/4 - a direct quantitative contradiction of AI Scientist v1's near-human reviewer claim *for generated papers*.[^1][^2]
- **Co-pilot mode:** externally rated 4.38/10 vs 3.8/10 autonomous (+0.58; gains concentrated in quality/soundness/clarity); user satisfaction 3.63/5, usability 4.0/5.[^1]
- **mle-solver on a 10-task MLE-Bench subset:** 4 medals (2 gold, 1 silver, 1 bronze), above-median-human on 6/10 - versus OpenHands (gpt-4o) 2 medals, AIDE (o1-preview) 2 medals, MLAB 0 (caveat: invalid submissions were excluded from comparators' averages, which may flatter mle-solver).[^1]

---

## 4. Limitations & Assumptions

Self-evaluation is unreliable (LLM–human reviewer agreement 53.3%, no better than human–human 56.1%); reports are "less satisfying than research papers from The AI Scientist... lower quality figures" despite higher automated scores. Reports follow a fixed 8-section structure with at most 2 figures; there is no repository-level code management. Documented failure modes: `exit()` calls killing the pipeline, `subprocess.run()` host commands, a bias to edit line 0, uncorrected 0%-accuracy runs, token-limit overflows, and literature-review loops. Every run requires a human-supplied research idea.[^1]

---

## 5. Critical Analysis

- **Distinctive strength:** The cheapest, most transparent end-to-end pipeline in the theme - \$2.33/paper with an open-source MIT-licensed codebase (~5.8k GitHub stars) - and the only one to *quantify* automated-reviewer inflation (6.1 vs 3.8), providing the field's key counter-evidence to self-judged quality claims.
- **Structural weakness / trade-off:** It deliberately has no cross-run memory and a linear (non-tree, non-evolutionary) search, so it cannot compound progress across projects; mle-solver's best-of-$N$ pool is the only selection mechanism, and its LLM reward is hackable - a weakness its successor AgentRxiv inherits and documents.
- **Connections:** **The AI Scientist v1** (arXiv:2408.06292) is the cost and reviewer baseline: Agent Laboratory reuses its reviewer, undercuts its cost 6.4×, and refutes its reviewer-alignment claim on generated papers.[^2] **AgentRxiv** (arXiv:2503.18102) is built directly on this codebase's autonomous mode and adds the missing cumulative memory as a shared preprint server.[^3] Its mle-solver is benchmarked against **AIDE** - the same tree-search engine that inspired **The AI Scientist-v2** (arXiv:2504.08066) - and **Dolphin** (arXiv:2501.03916) uses Agent Laboratory templates as an MLE-Bench substrate.[^4]

---

## 6. References

- [Schmidgall et al., 2025] "Agent Laboratory: Using LLM Agents as Research Assistants" - https://arxiv.org/pdf/2501.04227 (abs: https://arxiv.org/abs/2501.04227)
- [Schmidgall et al., 2025] "Agent Laboratory code repository (MIT license)" - https://github.com/SamuelSchmidgall/AgentLaboratory
- [Lu et al., 2024] "The AI Scientist: Towards Fully Automated Open-Ended Scientific Discovery" - https://arxiv.org/pdf/2408.06292
- [Schmidgall & Moor, 2025] "AgentRxiv: Towards Collaborative Autonomous Research" - https://arxiv.org/pdf/2503.18102
- [Yamada et al., 2025] "The AI Scientist-v2: Workshop-Level Automated Scientific Discovery via Agentic Tree Search" - https://arxiv.org/pdf/2504.08066
- [Yuan et al., 2025] "Dolphin: Moving Towards Closed-loop Auto-research through Thinking, Practice, and Feedback" - https://arxiv.org/pdf/2501.03916

[^1]: Agent Laboratory v2 PDF, arXiv:2501.04227 - https://arxiv.org/pdf/2501.04227
[^2]: AI Scientist v1 PDF - https://arxiv.org/pdf/2408.06292
[^3]: AgentRxiv PDF - https://arxiv.org/pdf/2503.18102
[^4]: AI Scientist-v2 PDF - https://arxiv.org/pdf/2504.08066
