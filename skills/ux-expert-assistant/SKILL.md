---
name: ux-expert-assistant
description: Inclusive design auditor, conversational UX designer, and UX CLI toolbox. Use this skill whenever the user wants to audit a design for cognitive accessibility, exclusion, or neurodiversity support — trigger on "inclusive design", "cognitive accessibility", "exclusionary design", "neurodiversity", "stress cases", "anxiety", "mismatch", "who does this exclude", or any mention of designing for disability, situational impairment, or mental health states. Also use for designing voice or chat interfaces — trigger on "chatbot script", "conversation design", "voice UI", "chat flow", "dialogue design", "conversational repair", "system persona". Also use when the user wants to run quantitative UX calculations locally — trigger on "run the calculator", "Fitts calculator", "OAA complexity", "inclusion audit script". For full GOMS/KLM methodology use goms-simulation-engine; for general cognitive audits use cognitive-design-review; for persuasion ethics use hcai-copilot; for research planning use ux-research-planning.
---

# UX Expert Assistant — Inclusive Design, Conversational UX & CLI Toolbox

This skill is the home of two specialised workflows that no other skill in the suite covers —
**inclusive design / cognitive exclusion audits** and **conversational UX design** — plus a set
of standalone **CLI tools** any workflow (including sibling skills) can use.

## Routing — check this first

Several older responsibilities of this skill now live in dedicated skills. Route there:

| The user wants… | Use |
|---|---|
| GOMS/KLM task-time prediction, Fitts modelling, flow comparisons | **goms-simulation-engine** (methodology source of truth; the CLI calculators below are compatible utilities) |
| A general cognitive/usability audit of a UI | **cognitive-design-review** |
| Persuasion, nudges, dark-pattern ethics, behavioural economics | **hcai-copilot** (AI products) or **cognitive-psychology-kb** → `processing_and_decisions.md` (theory + ethics rules) |
| Planning user research | **ux-research-planning** |
| Inclusive design audit, conversational UX, or CLI tooling | **this skill** — continue below |

If a request spans this skill and a sibling (e.g. "make this checkout faster for elderly
users"), run the **inclusive lens first** — exclusion constraints override optimisation — then
hand the optimisation part to the sibling skill.

---

## Workflow 1 — Inclusive Design & Cognitive Exclusion Audit

*Goal: shift from "accessibility compliance" to mismatch resolution (Kat Holmes: disability is
a mismatch between a person and their environment, and it's often situational or temporary).*

1. **Define the human range.** For each interaction, identify the ability demands — Touch, See,
   Hear, Speak — and the **cognitive states** the design must survive: stress, anxiety,
   distraction, fatigue, low literacy, unfamiliarity. Use the persona spectrum: permanent
   (one arm) → temporary (arm injury) → situational (holding a baby).
2. **Check mismatches.** Walk the flow asking, for each demand: who cannot meet this demand,
   permanently or right now? That's an exclusion point.
3. **Mental-health pattern check.**
   - "Preserve" state (low energy, depression, burnout) → simplify: fewer steps, fewer
     decisions, save-and-resume, no punishing streaks.
   - Anxious state → provide clear undo, explicit consequences before actions, visible direct
     paths, no countdown pressure.
   - Distracted/stressed state → interruption-tolerant flows, state that survives abandonment.
4. **Output** a list of **Exclusion Points** and **Remedies** using
   `assets/inclusion_audit_checklist.md`. For interactive scoring run
   `scripts/inclusion_audit.py` (`--output report.md` to export).

Load `references/inclusive_design.md` before any audit — it holds the full Recognize-Exclusion
framework, WCAG cognitive-accessibility mappings, and the stress-case catalogue.

## Workflow 2 — Conversational UX Design

*Goal: apply the Natural Conversation Framework (Moore & Arar) to chat, voice, and AI dialogue.*

1. **Sequence analysis.** Break the dialogue into expandable sequences (adjacency pairs:
   question→answer, request→grant/deny), and design the expansions — clarifications,
   confirmations, detours — not just the happy path.
2. **Repair check.** Conversations fail constantly; competence is repair. Verify the system
   supports both self-initiated repair ("let me rephrase") and other-initiated repair
   ("what did you mean by X?"), plus graceful escalation when repair fails twice.
3. **Grice check.** Test system turns against the conversational maxims — quantity (no
   over-answering), quality (no invented certainty), relation (answer *this* question),
   manner (no ambiguity). Most chatbot failures are maxim violations.
4. **Persona consistency.** Define the system persona once (register, warmth, formality) and
   audit every message against it — including errors, which is where personas usually break.
5. **Sentiment adaptation.** Detect frustration signals in user inputs and adapt: shorten
   turns, drop personality, surface the human/escape hatch.

Load `references/conversational_ux.md` for the full NCF pattern library and worked scripts.

---

## CLI Toolbox (`scripts/`)

Standalone Python 3, no dependencies. These are utilities — they don't replace the methodology
skills. The GOMS/Fitts calculators implement the same Shannon-formulation Fitts model
(MT = a + b·log₂(D/W + 1)) that `goms-simulation-engine` uses, so their outputs can be dropped
into that skill's analyses.

| Script | Purpose | Usage |
|--------|---------|-------|
| `scripts/inclusion_audit.py` | Inclusive design audit walkthrough | interactive; `--output report.md` |
| `scripts/goms_calculator.py` | KLM operator-sum calculator | interactive or `--json <file>` |
| `scripts/fitts_law_calculator.py` | Fitts movement-time (Shannon form) | `--distance D --width W` or `--compare D:W D:W …` |
| `scripts/oaa_complexity_calculator.py` | OAA complexity scoring | `--csv assets/oaa_matrix.csv` or interactive |
| `scripts/dark_pattern_detector.py` | Heuristic dark-pattern scan of a UI description | `--text "…"` or interactive |
| `scripts/research_plan_generator.py` | Research plan scaffold (pair with ux-research-planning for methodology) | interactive; `--output plan.md` |
| `scripts/skill_validator.py` | This skill's integrity check | run from skill root |

`assets/goms_calculator_template.md` provides the operator-sum worksheet for manual KLM work.

## Reference files

- `references/inclusive_design.md` — Recognize-Exclusion framework, cognitive accessibility,
  mental-health patterns. **Read before Workflow 1.**
- `references/conversational_ux.md` — Natural Conversation Framework, repair patterns, persona
  design. **Read before Workflow 2.**
- `references/quantitative_ux.md`, `references/persuasion_mechanics.md`,
  `references/psychology_models.md`, `references/research_strategies.md`,
  `references/semantic_ixd.md` — legacy references kept for the CLI tools and archival depth;
  for methodology, prefer the dedicated sibling skills listed in the routing table.
