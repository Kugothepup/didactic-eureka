# Wiring

This skill is a reference layer, like `cognitive-psychology-kb`. It does not run workflows — it is consulted by the skills that do, at the moment they need to answer "so what".

Below: for each skill in the library, the trigger point and the impacts it most credibly claims. Read the relevant row when that skill is active.

---

## The general rule

Any skill that produces a recommendation, an audit finding, a research insight, or a design artefact should end by naming the impacts it plausibly moves and the metric that would evidence each. Not as a bolted-on paragraph — as the last column of whatever the skill already outputs.

If the skill's output is a table of findings, add an impact column. If it is a narrative, close with the impact map. If it is an artefact, state what the artefact is *for* in impact terms.

---

## Stage 1 skills

### `ux-research-planning`
**Trigger.** During Stage 1 (define the research question) and Stage 5 (scope to reality).

**What to add.** Convert "what decision will this research inform?" into "what impact is the organisation trying to move?" A study with no target impact is usually a study nobody will act on — which the skill already flags as a reason not to run it.

Then, before fieldwork: establish the baseline. This is the highest-value moment in the entire library for impact work, because it is the last point at which a baseline can still be captured cheaply. Prompt for it explicitly.

**Claims.** S02, S05, S07 → P3 Extract Insights to Inform Strategy, R3 Reduce Risk in Development, F4 Reduce Cost of UX Work.

---

### `ux-discovery-deep-think`
**Trigger.** At the "check insights for actionability" stage — the desirable / viable / feasible test.

**What to add.** Viability is an impact question. For each insight, ask which impact acting on it would move, and how much. Insights that map to no impact are interesting, not actionable — and saying so is more useful than adding them to a wall.

**Claims.** S14, S15 → P3, M1 Enable Organizational Clarity, R3.

---

### `ux-define-artifacts`
**Trigger.** When producing any artefact — journey map, blueprint, persona, opportunity solution tree.

**What to add.** The evidence-labelling this skill already does maps directly onto the evidence tiers here. Extend it: label what is validated, what is assumed, *and* what impact the artefact is meant to move.

Note the pattern where an artefact's real value is not its stated purpose — a journey map's genuine impact is often M1 Enable Organizational Clarity, because six teams finally saw one picture. Say the real thing, not the nominal one.

**Claims.** S16, S21, S22 → M1, O3 Reduce Redundant Effort, U1 Improve User Outcomes, P11 Increase User Loyalty.

---

### `ux-design-critique`
**Trigger.** When framing opportunities and writing How Might We statements.

**What to add.** The HMW formula already ends with "so that [improved outcome for the business]" — that final clause is an impact, and it should be named with its code. An HMW whose business clause is vague produces a vague opportunity.

> How might we [entice] a customer who needs [to set up advertising] in such a way that [they get more sales leads] so that [they set monthly advertising goals] → **F3 Increase Sales Volume**, measured by trial-to-paid conversion.

**Claims.** S17 → whichever impact the HMW names. S83 → P1 Increase Quality, M2 Increase Employee Satisfaction.

---

## Stage 2 and 3 skills

### `cognitive-design-review`
**Trigger.** On every finding in the audit output.

**What to add.** An impact column alongside the severity rating. Severity says how bad it is for the user; the impact says what it costs the business. A high-severity finding with an F1 attached gets fixed; the same finding without one waits.

**Claims.** S63, S64 → U2, U3, U4, P1, F1, R2.

---

### `goms-simulation-engine`
**Trigger.** Every time it outputs a predicted time.

**What to add.** This is the strongest quantification asset in the library and it currently stops one step short. Seconds are the input to a monetisation calculation, not the output.

> predicted seconds saved × frequency × user count × loaded hourly rate

Label the result **modelled**, never measured — the prediction is from a validated model, but it is still a prediction. Then hand off: U4 Save User Time for the user-facing claim, O8 Increase Productivity for internal tools, F1 or F6 where the users are support or sales staff.

**Claims.** S63, S23 → U4 (direct), O8, F1, F6 (modelled cascade).

---

### `information-architecture` / `content-hierarchy`
**Trigger.** When delivering a sitemap, taxonomy, navigation system, or page structure. Also on card sort and tree test analysis.

**What to add.** Findability changes are measurable — search exits, time to locate, tree-test success rate. Name them. Structural work also has a durability claim most IA practitioners never make.

**Claims.** S47, S48, S24, S34 → U3, U4, P7 Increase Durability, O3, F5 Reduce Cost of Maintenance.

---

### `ux-writing`
**Trigger.** On copy audits particularly, and on any terminology work.

**What to add.** Content work has the cleanest line to F1 of anything in the taxonomy, because contact reasons are already categorised in most support systems. A terminology fix that reduces one contact category is a directly countable saving.

**Claims.** S37, S54, S45, S38 → U3, U2, F1, P2 Increase Consistency, P1.

---

### `design-system-agent`, `design-tokens-foundation`, `token-component-mapper`, `ux-principles-layer`
**Trigger.** At the end of the four-stage pipeline, and in any governance or adoption conversation.

**What to add.** Design systems have a double-sided claim that teams routinely half-make: they cut cost through reuse *and* raise learnability through consistency. Claim both. The cost half alone undersells the work and invites the system to be judged purely on component count.

Also available and rarely claimed: O7 Enable Nonspecialists to Create Design Artifacts. Frame it as moving designers off low-value requests, not as replacing them.

**Claims.** S90, S92, S87 → P2, F2 Leverage Existing Investments, F5, F8, O2 Reduce Time to Design, O4, O7, U3.

---

### `ux-expert-assistant`
**Trigger.** On any inclusive design or accessibility audit, and on conversational design work.

**What to add.** Always make both accessibility arguments. R2 Reduce Regulatory and Legal Risk is the floor; P10 Expand Market and Potential Audience is the growth case. Teams that argue compliance alone get compliance-minimum budgets.

**Claims.** S88 → R2, P10, M3 Create an Inclusive Work Environment, U1. S40 → U2, F1.

---

### `hcai-copilot`
**Trigger.** On the ethical audit lens particularly.

**What to add.** Harm anticipation and dark-pattern findings are risk impacts with real financial exposure. Overtrust and calibration failures in AI products are R1 and R2 exposure, not just design critique.

**Claims.** S32, S31, S85 → R1 Reduce Risk to Brand Perception, R2, P1, U2.

---

## Data and communication skills

### `data-scientist-agent`
**Trigger.** When choosing what to analyse, not only when analysing.

**What to add.** This skill currently analyses data that already exists. Point it at S50 Identify Metrics — deciding what to instrument before the work starts. That is the baseline problem, and it is the single most common reason good UX work cannot be evidenced afterwards.

**Claims.** S65, S50, S33 → P3, and it enables the measured tier for every other claim in the library.

---

### `sentiment-analysis`
**Trigger.** On review, NPS and support-feedback corpora.

**What to add.** Aspect-level output maps cleanly onto impact categories — aspects are effectively impact candidates. Theme volumes give R1 Reduce Risk to Brand Perception a measurable form, and contact-reason clustering feeds F1 directly.

**Claims.** S78, S14, S65 → U5, R1, F1, P3.

---

### `ogilvy-writing-coach`
**Trigger.** On any stakeholder readout, exec summary or research presentation.

**What to add.** This skill is currently orphaned — nothing else in the library references it. Point it at the readout structure in `translation-playbook.md` and it becomes the delivery end of this skill: impact first, method in the appendix. Ogilvy's rules about cutting jargon and leading with the point are already exactly right for an exec readout; they just need the impact structure underneath.

**Claims.** S68 Present UX Work, S70 Storytelling, S67 Advocate for User Insights → P3, M1.

---

## What is still missing after this skill exists

This skill covers translation and evidence. It does not cover the Stage 4 organisational skills that make the translation land in a real company — S67 Advocate for User Insights, S73 Identify Priorities, S74 Align on Success, S79 Stay Abreast of the Business, S80 Understand Organizational Perspectives.

Nor does it cover S13 Investigate Comparable Experiences or S75 Track Trends and Signals, which remain uncovered in the library.

Those are the next two builds. This one is the prerequisite for both.
