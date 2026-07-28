---
title: "Agentic AI for Scientific Discovery: A Survey of Progress, Challenges, and Future Directions"
date: 2025-03-12
abstract: "This 13-page survey argues that agentic AI - LLM systems capable of reasoning, planning, and autonomous decision-making - is transforming every stage of scientific research, but that the field's near-term value lies in augmenting rather than replacing human researchers, with literature review empirically the weakest and most failure-prone stage of current autonomous pipelines."
tags: ["survey", "agents", "ai4science"]
chapter: ai
paper: "https://arxiv.org/abs/2503.08979"
cover: "papers/2026-07-27-03-agentic-ai-for-scientific-discovery-survey.webp"
---

**12 Mar 2025** · [Paper](https://arxiv.org/abs/2503.08979)

---

## 1. Motivation

Agentic AI systems "are transforming how scientists perform literature review, generate hypotheses, conduct experiments, and analyze results", yet progress is scattered across domains and autonomy levels.[^1] The survey's motivation is to consolidate this landscape along the research lifecycle, classify systems by autonomy and collaboration mode, inventory the supporting tools, datasets, and metrics, and foreground trustworthiness, ethics, and risk. Its stated thesis is deliberately conservative: "the true power of Agentic AI lies in its ability to augment human expertise rather than replace it."[^2]

---

## 2. Methodology

### 2.1 Search Structure

The survey itself reports **no systematic literature-search protocol** - no databases, date ranges, or inclusion/exclusion criteria - so its coverage (roughly 200 references, skewed to 2023–early-2025 systems) is expert-curated and unauditable.[^2] Its structural backbone is the **research lifecycle** (Section 5): Ideation → Experiment design & execution → Data analysis & interpretation → Paper writing & dissemination, with domain case studies attached (chemistry, biology, materials, general science, machine learning). Overlaid is a Section 3 taxonomy by autonomy: **fully autonomous systems** (Coscientist; ChemCrow with GPT-4 plus "18 expert-designed tools"; ProtAgents; LLaMP) versus **human-AI collaborative systems** (Virtual Lab, BioPlanner, CALMS, Agent Laboratory[^5]).[^1] Literature search itself is treated as a benchmarked retrieval problem: LitSearch as a standardized retrieval-assessment framework and ResearchArena's three-stage pipeline (information discovery, selection, organization) position literature review as the foundational bottleneck of the lifecycle.[^2]

### 2.2 State Representation

State representation is lightweight compared with later surveys. A single agent is defined as "an agent with an LLM backbone capable of handling multiple tasks and domains … able to perform reasoning, planning and tool execution on their own"; multi-agent state reduces to communication and interoperability - "multi-agents require a careful interoperability among various agents, specifically in their communications and information sharing".[^2] Persistent state appears mainly through frameworks: Letta, "based on the recent MemGPT paper", is singled out as "the framework explicitly incorporating cognitive architecture principles".[^1]

### 2.3 Generation Mechanism

The survey catalogs generation at each lifecycle stage. **Ideation**: agents "analyzing existing literature, identifying gaps, and proposing novel hypotheses" - exemplified by ResearchAgent's iterative idea generation over scientific literature.[^2] **Experiment/protocol generation**: BioPlanner converts scientific goals into pseudocode-like protocol steps; LLM-RDF orchestrates six LLM agents covering literature search, experimental design, reaction optimization, and analysis. **Report generation**: Agent Laboratory's literature-review → experimentation → report-writing pipeline and The AI Scientist's[^6] automated paper writing are the canonical cases.[^2]

### 2.4 Evaluation & Grounding

Grounding is dominated by retrieval-augmented generation (RAG) against curated scientific stores. The flagship example is LLaMP, which "significantly reduces hallucination in material informatics by grounding predictions in high-fidelity datasets from the Materials Project and running atomistic simulations", outperforming standard LLMs on bulk-modulus, formation-energy, and bandgap retrieval.[^2] The evaluation inventory (Section 6) spans benchmarks (LAB-Bench for biological reasoning/planning, MoleculeNet, MaScQA, MLE-BENCH, MLAgentBench), implementation frameworks (AutoGen, MetaGPT, Letta/MemGPT, CAMEL, LangChain), and a metrics taxonomy: accuracy, task completion, coherence, precision/recall, plus Agent Laboratory's NeurIPS-style review criteria (quality, significance, clarity, soundness, presentation, contribution) with human-versus-automated reviewer comparisons.[^1] A key gap is flagged: "in emerging areas like materials discovery and entire research process automation, there is still a need for comprehensive benchmarks that assess the agents' real-world impact and adaptability."[^1]

### 2.5 Memory / Information Flow

Memory receives no dedicated section; the evidence is scattered but consistent. RAG is the dominant external-knowledge mechanism (LLaMP, SciLitLLM's continual pretraining plus fine-tuning); Letta/MemGPT supplies persistent agent memory; CellAgent implements a "self-iterative optimization mechanism" as experience feedback; TAIS adds "self-learning mechanisms".[^1][^2] On information flow, the survey emphasizes **error propagation** as the dual of memory: "flawed or incomplete data can propagate errors, leading to incorrect findings or irreproducible results."[^2]

### 2.6 Selection & Propagation

Selection and propagation appear as closed-loop optimization case studies rather than as an abstract taxonomy: Coscientist's closed-loop optimization of a palladium-catalyzed cross-coupling reaction; LLM-RDF's reaction-optimization agent loop; ProtAgents autonomously "generate, test, and refine protein sequences" via LLMs plus reinforcement learning; Organa's parallel electrochemistry workflows, "reducing execution time by over 20%" relative to human chemists; and CellAgent's Planner/Executor/Evaluator role specialization, reported at a 92% task-completion rate on single-cell RNA-sequencing analysis, as a propagation-of-judgment pattern.[^1][^2]

### 2.7 Anti-Slop / Anti-Hallucination Mechanisms

Trustworthiness (Section 7) is a first-class concern. Named hazards: hallucination - LLMs "pose risks in generating misleading, fabricated, or contextually inappropriate responses … particularly detrimental in critical domains like healthcare"; compounding errors under low human oversight; agent misalignment; multi-agent coordination failure; safety-protocol deviation in automated experimentation; and the "**blast radius**" of agents integrated with robotic labs, which "must be well-defined".[^2] Prescribed mitigations: robust benchmarking with "cost-controlled evaluations and the joint optimization of performance metrics such as accuracy, cost, speed, throughput, and reliability (e.g., task failure rates, recovery upon failure)"; human-in-the-loop architectures; bias detection (adversarial debiasing, reweighting); explainability; and calibration - ensuring "the system's confidence in its predictions aligns with their actual correctness".[^2] The survey's recurring empirical caution is that Agent Laboratory's "performance dropped significantly in the literature review phase", with literature review exhibiting "the highest failure rate" among its pipeline phases.[^2]

---

## 3. Results

The survey's outputs are taxonomic: the autonomy/collaboration split, the lifecycle staging, and the resources tables. Reported quantitative anchors (inherited from cited systems, not re-run): CellAgent's 92% task completion, Organa's >20% execution-time reduction, and LLaMP's grounded-property-retrieval gains over standard LLMs.[^1][^2] Its most consequential comparative claim - repeated in the introduction, Section 4, and conclusion - is that **literature review is the hardest stage to automate**: ResearchAgent "lacks the capability to perform structured literature reviews" and "the same limitation was observed in The AI Scientist framework".[^2]

---

## 4. Limitations & Assumptions

There is no systematic corpus protocol, and the March 2025 cutoff predates much of the current wave (AI Scientist-v2, AI co-scientist, Robin, Biomni). All five authors are from IQVIA, a healthcare-data company; the biomedical emphasis and "compliance-driven rigor" framing reflect that lens. Several secondary claims (e.g., Agent Laboratory's phase failure rates) are reported from the cited papers rather than independently verified. It is a workshop paper with lighter formal apparatus than later surveys - no formal definitions or equations - and its "conference paper at ICLR 2025" banner overstates the venue.[^2][^3]

---

## 5. Critical Analysis

- **Distinctive strength:** the clearest lifecycle-level diagnosis in the survey trio - its repeated, evidence-backed finding that literature review is the weakest pipeline stage gave the field a concrete target, and its risk vocabulary ("blast radius", calibration, cost-controlled evaluation) remains distinctive.
- **Structural weakness / trade-off:** breadth across domains is bought with shallow mechanism formalism and a fast-expiring corpus; as a workshop-length narrative review it cannot support fine-grained architectural comparison.
- **Connections:** it is the direct predecessor that the Agentic Science survey (paper 01) critiques as fragmented and whose autonomous-versus-collaborative split that survey formalizes as Level 2 versus Level 3 autonomy; its literature-review failure-mode finding is exactly the stage the Deep Research survey (paper 02) mechanizes with its planning → query → web-exploration → report pipeline. Among mission-list systems it reviews The AI Scientist[^6] (paper 09) and Agent Laboratory[^5] (paper 13) as central case studies, and evaluates against MLE-BENCH-adjacent agent benchmarks also used by this review's MLE-agent papers (15–20).

---

## 6. References

[^1]: Gridach et al., arXiv:2503.08979 abstract page - https://arxiv.org/abs/2503.08979
[^2]: Gridach et al., arXiv:2503.08979 PDF (full text) - https://arxiv.org/pdf/2503.08979.pdf
[^3]: ICLR 2025 Workshop "Towards Agentic AI for Science", OpenReview group (lists the paper) - https://openreview.net/group?id=ICLR.cc/2025/Workshop/AgenticAI
[^4]: ICLR 2025 AgenticAI workshop website (CFP, dates, scope) - https://iclragenticai.github.io/
[^5]: Schmidgall et al., Agent Laboratory, arXiv:2501.09727 - https://arxiv.org/abs/2501.09727
[^6]: Lu et al., The AI Scientist, arXiv:2408.06292 - https://arxiv.org/abs/2408.06292
