---
name: cognitive-psychology-kb
description: "Authoritative cognitive psychology reference for UX, HCI, and behavioural design. Consult this skill whenever discussing cognitive load, working memory, attention, perception, heuristics, biases, mental models, Gestalt principles, dual-process theory, emotional design, decision-making psychology, or any Laws of UX (Miller's, Hick's, Fitts's, Jakob's, etc.). Also trigger when the user mentions nudges, dark patterns, persuasion ethics, loss aversion, prospect theory, framing effects, or asks about the psychological basis of any design decision. This skill ensures all claims reflect current scientific consensus, including revisions to classic theories (e.g., Cowan's revision of Miller's Law, contested status of System 1/2). Use this skill even for casual mentions of these topics — it prevents outdated or oversimplified claims from entering responses."
---

# Cognitive Psychology Knowledge Base for UX & HCI

## Purpose

This skill is a persistent reference layer. When triggered, read the relevant reference file(s) below BEFORE responding. The goal is to ensure every claim about cognitive psychology in a UX/HCI context reflects current scientific consensus, with proper caveats on contested or revised theories.

## When to Load Which Reference

| User's Topic | Load This File |
|---|---|
| Working memory, chunking, Miller's Law, information capacity, "magic number 7" | `references/memory_and_load.md` |
| Cognitive load, intrinsic/extraneous/germane load, progressive disclosure | `references/memory_and_load.md` |
| System 1/2, dual-process theory, automatic vs. controlled processing, fast/slow thinking | `references/processing_and_decisions.md` |
| Heuristics, biases, prospect theory, loss aversion, anchoring, framing, social proof | `references/processing_and_decisions.md` |
| Hick's Law, decision fatigue, paradox of choice | `references/processing_and_decisions.md` |
| Attention, selective attention, change blindness, banner blindness, inattentional blindness | `references/attention_and_perception.md` |
| Gestalt principles, proximity, similarity, closure, figure/ground, visual grouping | `references/attention_and_perception.md` |
| Visual hierarchy, F-pattern, Z-pattern, eye tracking, salience | `references/attention_and_perception.md` |
| Mental models, affordances, signifiers, recognition vs. recall, Jakob's Law | `references/models_and_affordances.md` |
| Familiarity, conventions, learnability, discoverability | `references/models_and_affordances.md` |
| Emotional design, aesthetics, Norman's 3 levels, aesthetic-usability effect | `references/emotion_and_motivation.md` |
| Zeigarnik effect, goal gradient, peak-end rule, motivation, engagement | `references/emotion_and_motivation.md` |
| Fitts's Law, target acquisition, motor performance, touch targets | `references/quantitative_laws.md` |
| Doherty threshold, response time, perceived performance | `references/quantitative_laws.md` |
| Dark patterns, nudges, persuasion ethics, behavioural economics ethics | `references/processing_and_decisions.md` (ethics section) |

If the topic spans multiple areas, load multiple files. When in doubt, load rather than guess.

## Critical Rules

1. **Never present contested theories as settled fact.** Dual-process theory (System 1/2) is a useful heuristic but is significantly contested. Always caveat.
2. **Use Cowan's revised figure (3–4 chunks) as the primary working memory estimate,** not Miller's 7±2. Explain the relationship if needed.
3. **Distinguish between robust findings and popular simplifications.** Many "Laws of UX" are heuristics, not laws in the scientific sense.
4. **Always note when a principle has boundary conditions.** Hick's Law breaks down with expert users; Fitts's Law has specific mathematical preconditions; the aesthetic-usability effect has limits.
5. **Never recommend persuasion techniques without noting ethical considerations.**
6. **Cite original researchers by name and date** when introducing a principle for the first time in a conversation.
