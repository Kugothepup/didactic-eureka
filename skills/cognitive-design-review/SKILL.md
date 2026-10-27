---
name: cognitive-design-review
description: "Audit any UI, wireframe, user flow, or interface description against cognitive psychology principles. Use this skill when the user asks to review, audit, critique, or evaluate a design for cognitive issues, usability problems, or psychological friction. Also trigger when users ask 'what's wrong with this design,' 'why does this feel confusing,' 'review this wireframe,' 'audit this flow,' 'check this for usability,' or mention cognitive friction, mental load, confusing interfaces, or ask why users are struggling with a design. Produces structured audit reports with severity ratings, affected principles, and actionable recommendations. Can work from screenshots, descriptions, URLs, wireframes, or flow diagrams."
---

# Cognitive Design Review

## Purpose

This skill performs structured cognitive audits of user interfaces and interaction flows. It evaluates designs against established cognitive psychology principles and produces actionable reports with severity ratings and specific recommendations.

## Pre-Requisite

Before running any audit, load the `cognitive-psychology-kb` skill's relevant reference files to ensure all evaluations use current science. If the KB skill is not available, use the `references/audit_framework.md` in this skill as a fallback.

## Audit Workflow

### Step 1: Gather Input

Accept the design in any available format:
- **Screenshot/image** of a UI
- **Text description** of an interface or flow
- **Wireframe or mockup**
- **URL** (fetch and analyze)
- **User flow diagram** or step-by-step interaction description
- **Error report** ("users keep missing X" / "conversion drops at Y")

If the input is ambiguous, ask: "What is the primary task a user is trying to accomplish on this screen/in this flow?"

### Step 2: Identify the Context

Before auditing, establish:
1. **Primary user task:** What is the user trying to accomplish?
2. **User expertise level:** Novice, intermediate, expert, or mixed?
3. **Usage context:** Desktop, mobile, tablet? Focused or distracted? Time-pressured?
4. **Stakes level:** Low (browsing), medium (purchasing), high (medical, financial)?

These determine which principles are most relevant and how severely issues should be rated.

### Step 3: Run the Cognitive Audit

Evaluate the design across **seven audit dimensions**. For each dimension, assess whether the design supports or violates the relevant principles.

---

## The Seven Audit Dimensions

### 1. MEMORY & LOAD
*Working memory capacity (Cowan's 3–4 chunks), cognitive load theory (intrinsic/extraneous/germane), chunking, progressive disclosure*

**Evaluate:**
- How many distinct items/options/decisions does the user face simultaneously?
- Is information chunked into meaningful groups of 3–4?
- Is extraneous load present (decorative complexity, unclear labels, inconsistent patterns)?
- Does the design force memorisation across screens, or externalise state?
- Is progressive disclosure used where appropriate, or is everything dumped at once?

**Red flags:** >5 ungrouped options at once, information the user must remember across steps, redundant/decorative elements that don't serve the task, no visual hierarchy.

### 2. ATTENTION & PERCEPTION
*Selective attention, banner/change/inattentional blindness, visual hierarchy, Von Restorff effect, serial position effect*

**Evaluate:**
- Is the primary action visually dominant? Would a user scanning for 2 seconds find it?
- Are there competing attention demands (multiple CTAs, animations, visual noise)?
- Could critical information suffer from change blindness (state changes without motion cues)?
- Is important content placed where users actually look (not in attentional dead zones)?
- Does any important element resemble an ad (banner blindness risk)?

**Red flags:** Multiple equal-weight CTAs, critical state changes without visual cues, important information in banner-like positions, cluttered layouts with no clear focal point.

### 3. GESTALT & VISUAL STRUCTURE
*Proximity, similarity, closure, common region, continuity, figure/ground, Prägnanz*

**Evaluate:**
- Are related elements visually grouped (proximity, common region)?
- Are similar functions styled consistently (similarity)?
- Could any grouping be misinterpreted (unrelated items too close, related items too far)?
- Is figure/ground clear (foreground content distinct from background)?
- Does the visual structure match the logical structure of the content?

**Red flags:** Unrelated items visually grouped by accident, related items visually separated, ambiguous figure/ground, inconsistent styling for same-function elements.

### 4. MENTAL MODELS & AFFORDANCES
*Jakob's Law, affordances/signifiers, recognition over recall, gulf of execution/evaluation, familiarity*

**Evaluate:**
- Does the design follow conventions users expect from similar products (Jakob's Law)?
- Are interactive elements clearly signified (buttons look clickable, links look tappable)?
- Is the interface recognition-based (menus, suggestions, visible options) or recall-based (blank fields, hidden commands)?
- After each action, does the user receive clear feedback on what happened (gulf of evaluation)?
- Would a user know what to do next without instructions (gulf of execution)?

**Red flags:** Non-standard interaction patterns without scaffolding, flat/ambiguous interactive elements, blank text fields where menus would work, no feedback after user actions, hidden navigation.

### 5. DECISION ARCHITECTURE
*Hick's Law, prospect theory, anchoring, framing, decision fatigue, defaults*

**Evaluate:**
- How many decisions does the user face per screen/step?
- Are defaults provided for common choices?
- Is information framed to support good decisions (clear comparison, highlighted recommendations)?
- Are there unnecessary decision points that could be eliminated or deferred?
- Is anchoring being used (and if so, ethically)?

**Red flags:** >3 undifferentiated choices without guidance, no defaults, required decisions that could be optional, decision points that could be merged or eliminated.

### 6. EMOTION & EXPERIENCE ARC
*Aesthetic-usability effect, peak-end rule, Zeigarnik effect, goal gradient, Norman's emotional levels*

**Evaluate:**
- Does the visual design support positive emotional state (aesthetic-usability)?
- Is there a clear "peak" moment in the experience?
- Does the flow end on a positive note (peak-end rule)?
- Is progress visible where appropriate (goal gradient, Zeigarnik)?
- Does the design address all three of Norman's levels (visceral, behavioural, reflective)?

**Red flags:** Bland or anxiety-inducing visual design, flows that end on error states or anticlimactic confirmations, no progress indicators in multi-step flows, missed opportunities for delight.

### 7. ETHICS & MANIPULATION
*Dark patterns, sludge, loss aversion misuse, manufactured urgency, confirmshaming*

**Evaluate:**
- Are persuasion techniques aligned with user interests?
- Is scarcity/urgency genuine or manufactured?
- Can the user easily reverse decisions (undo, cancel, go back)?
- Is the design transparent about what happens next?
- Would the user feel helped or manipulated if they understood the design choices?

**Red flags:** Artificial scarcity, confirmshaming, roach motel patterns, hidden costs, misdirection, forced continuity, pre-checked upsells.

---

## Step 4: Produce the Report

### Severity Rating Scale

| Level | Label | Definition |
|---|---|---|
| 🔴 | **Critical** | Likely causes task failure, abandonment, or significant user harm. Fix immediately. |
| 🟠 | **Major** | Causes substantial friction, confusion, or error. High-priority fix. |
| 🟡 | **Moderate** | Creates unnecessary effort or mild confusion. Should be addressed. |
| 🔵 | **Minor** | Suboptimal but functional. Improvement opportunity. |
| ⚪ | **Good** | Principle is well-supported. Note as a strength. |

### Report Structure

For each finding:
1. **Dimension** (which of the 7 audit dimensions)
2. **Severity** (🔴🟠🟡🔵⚪)
3. **Principle violated/supported** (specific cognitive principle with brief explanation)
4. **Observation** (what was found in the design)
5. **Impact** (how this affects the user's cognition/behaviour)
6. **Recommendation** (specific, actionable design change)

### Report Format

Begin with an **Executive Summary**: 2–3 sentences on overall cognitive health of the design, top issues, and strongest aspects.

Then present findings grouped by severity (critical first, then major, etc.), not by dimension. This ensures the most impactful issues surface first.

End with a **Strengths** section noting what the design does well — this provides balance and highlights principles to preserve during redesign.

### Output Options

Based on user preference, output as:
- **Conversational response** (default — structured findings in chat)
- **Markdown report** (if user wants a file they can share)
- **Docx report** (if user requests a formal document — use the docx skill)

---

## Quick Audit Mode

If the user asks for a fast/quick review rather than a full audit, run a focused check on only these three dimensions:
1. **Memory & Load** (the most common source of friction)
2. **Attention & Perception** (the most common source of missed information)
3. **Mental Models & Affordances** (the most common source of confusion)

Label the output as "Quick Cognitive Check" and note that a full audit covers additional dimensions.
