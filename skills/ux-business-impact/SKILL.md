---
name: ux-business-impact
description: "Authoritative reference for translating UX work into measurable business impact, using the 41-impact / 99-skill taxonomy from UX Skills for Business Strategy (Podmajersky, Joseph-Goteiner, Mats Mats). Consult this skill whenever UX work needs to be justified, prioritised, measured, or explained to anyone outside design — including ROI, business cases, stakeholder communication, executive readouts, performance reviews, promotion packets, portfolio narratives, budget or headcount requests, OKRs, metrics selection, and project prioritisation. Also trigger on 'so what', 'why does this matter', 'how do I prove this worked', 'what should I measure', 'how do I sell this in', 'what's the business case', 'leadership doesn't get it', or any question about the value of design. Use this skill even when the user is mid-way through craft work and has not asked about business value — if the work produces an outcome someone could pay for, the impact framing belongs in the answer. Prevents vague value claims, unmeasurable assertions, and output-language ('I designed X') where outcome-language ('this reduced Y') is required."
---

# UX Business Impact

## Purpose

This is a persistent reference layer, not a workflow. When triggered, read the relevant reference file(s) below BEFORE responding. The goal is that every claim about the value of UX work names a specific impact, a specific metric, and an honest evidence tier — instead of the vague value language that gets design excluded from strategic conversations.

The core move this skill enables: converting **output language** ("I designed a new onboarding flow") into **outcome language** ("this cut time-to-first-value by 40% [U4], which reduced setup-related support contacts by 18% [F1]").

## When to Load Which Reference

| Situation | Load this file |
|---|---|
| Money: revenue, cost, ROI, budget, headcount, spend | `references/impacts-financial-and-risk.md` |
| Downside: legal, accessibility exposure, brand risk, rework, viability | `references/impacts-financial-and-risk.md` |
| User outcomes, comprehension, confidence, time, satisfaction, CSAT | `references/impacts-user-and-product.md` |
| Product performance: quality, adoption, PMF, loyalty, market expansion, brand | `references/impacts-user-and-product.md` |
| Internal: cycle time, redundant effort, productivity, design ops, release speed | `references/impacts-operational-and-management.md` |
| Team: alignment, employee satisfaction, inclusion, hiring | `references/impacts-operational-and-management.md` |
| "Which skill produces this impact?" or "what impact does this skill produce?" | `references/skills-index.md` |
| Building a claim, choosing a metric, judging evidence strength, writing a readout | `references/translation-playbook.md` |
| Deciding how this skill feeds another skill in the library | `references/wiring.md` |

Load multiple files when the question spans categories — most real impacts cascade across three or four. When in doubt, load rather than guess: the codes and definitions are specific and must not be improvised.

## The Two Entry Points

Everything this skill does starts from one of two directions. Identify which before proceeding.

**Start with the impact.** The organisation has a goal. Work backwards to the skills most likely to move it.
> "We need to cut support costs." → F1 → S12 Audit Content, S61 Create How-To Content, S37 Design Content for Usability, S63 Evaluate Design Solutions.

The question that unlocks this direction, asked of a manager or product owner: *"What does the business need from this product?"* If the user hasn't asked it, tell them to.

**Start with the skill.** Work is already underway or complete. Work forwards to the impacts it can credibly claim.
> "I ran a content audit." → S12 → F5 Reduce Cost of Maintenance, U3 Increase User Understanding, P1 Increase Quality.

## Critical Rules

1. **Never claim an impact without naming its metric.** An impact with no metric attached is an opinion. If no metric is available, say the claim is directional and label it as such — see the evidence tiers in `translation-playbook.md`.

2. **Never invent codes, names, or categories.** The taxonomy is fixed: F1–F8, U1–U5, P1–P11, R1–R4, O1–O9, M1–M4, and S01–S99. If something doesn't fit, say so plainly rather than bending a code to cover it.

3. **Distinguish measured, modelled, and inferred claims.** A GOMS prediction is modelled, not measured. A pre/post ticket count is measured. "Users will probably find this easier" is inferred. Mixing tiers without labelling them is how UX loses credibility the first time someone checks.

4. **Impacts cascade — but attribution decays as it travels.** U1 genuinely leads to F1, F3, P4 and P11. That does not mean you can claim all four with equal confidence. Claim the near link strongly; name the far ones as expected downstream effects.

5. **Check conditions for success before promising an impact.** Most skills fail for lack of scope, authority, or resources — not lack of expertise. If the user lacks the authority to act on a content audit, the audit will not reduce maintenance cost. Say so before they commit to the claim.

6. **Baselines beat everything.** A claim without a before-measurement is unfalsifiable and therefore worthless in a room with a finance person. If no baseline exists, the first recommendation is always to establish one (S50 Identify Metrics) before the work starts, not after.

7. **Users and customers are different people.** A user interacts with the experience; a customer pays for it. In B2B they are frequently not the same person, and impacts land differently on each. Never blur them in a claim.

8. **Match the register to the audience.** Financial and Risk impacts speak to executives and finance. Product and User impacts speak to product and marketing. Operational and Management impacts speak to engineering leads and design managers. The same piece of work is described differently to each — this is translation, not spin.

## Output Formats

**Impact claim (the atomic unit).** Use this shape everywhere:
> [Work done] → [Impact name and code] → [Metric] → [Evidence tier and figure]
>
> Rewriting the error states → Increase User Understanding [U3] → rate of "what does this mean" support contacts → measured, down 31% over 8 weeks against a 6-week baseline.

**Impact map.** For a single piece of work touching several impacts, list them in cascade order: direct user effect first, then direct financial effect, then downstream product effects. Mark evidence tier on each.

**Readout.** Lead with the impact, not the method. The method is a footnote unless someone asks. Full structure in `translation-playbook.md`.

## What This Skill Does Not Do

It does not plan research (`ux-research-planning`), synthesise findings (`ux-discovery-deep-think`), or audit interfaces (`cognitive-design-review`). It is the layer those skills consult when they need to answer "so what". See `references/wiring.md` for the handoffs.
