# Translation Playbook

How to turn a piece of UX work into a claim that survives contact with a finance person.

---

## Evidence tiers

Every claim sits in exactly one tier. Label it. Mixing tiers without saying so is the fastest way to lose credibility permanently — one unlabelled inference discredits every measured number sitting next to it.

**Measured.** A real before and a real after, from instrumentation or a study. The baseline existed before the work started.
> "Setup-related support contacts fell 31% over eight weeks against a six-week pre-launch baseline."

**Modelled.** A calculation from a validated model, not an observation. GOMS/KLM predictions, cost-per-contact multiplications, reach estimates.
> "GOMS modelling predicts 14 seconds saved per submission; at 400 submissions a day that is roughly 1.5 staff hours daily."
> Always say "predicts" or "models", never "saved".

**Inferred.** Reasoned from principle or precedent, with no number.
> "Removing the contradictory terminology should reduce misinterpretation, though we have no comprehension baseline to confirm it."

**Anecdotal.** A quote, an observation, a single participant. Useful for colour, never as the load-bearing claim. Attach it to a measured or modelled claim; never send it out alone.

**The rule.** Lead with your strongest tier and disclose the rest. A single measured claim with two honest inferences beats five confident-sounding assertions, because the first survives scrutiny and the second does not.

---

## The cascade

Impacts are not discrete. One intervention triggers a systemic chain, and this interconnectedness is the strongest structural argument for UX investment. The canonical chain:

**Improve User Outcomes [U1]** — a direct user effect — reliably produces:
- **Reduce Cost of Support [F1]** — fewer people need help
- **Increase Sales Volume [F3]** — more renewals, less abandonment
- **Increase Adoption and Usage [P4]** — the thing works, so people use it
- **Increase User Loyalty [P11]** — the thing worked, so people return

**But attribution decays with distance.** Claim the near link at full strength and name the far links as expected downstream effects, with the mechanism stated:

> "Task success on the benefits application rose from 61% to 88% [U1, measured]. We expect this to reduce application-support contacts [F1] — that category is currently 34% of ticket volume — and to lift completed-application rate [F3]. Both will be visible in the Q3 numbers; neither is confirmed yet."

That is a stronger claim than asserting all four, because it tells the reader exactly what to check and when.

---

## Constructing a claim

Four elements, in this order. If any is missing, the claim is incomplete.

1. **The work** — what you actually did, in one clause. Not the method's history, not the tooling.
2. **The impact** — name and code from the taxonomy.
3. **The metric** — the specific measure, with its baseline state.
4. **The tier and figure** — measured, modelled, inferred, and the number if there is one.

> Rewrote 40 error messages against a controlled terminology list → **Increase User Understanding [U3]** → rate of "what does this mean" support contacts → **measured**, down 31% over eight weeks against a six-week baseline.

### Getting the baseline

The single highest-value intervention in this entire skill is to establish the baseline *before* the work starts. If a user is about to begin work and has no baseline:

> Stop. What number will be different when this is done, and what is it today? If nobody knows, that measurement is the first task — otherwise the work will be unprovable no matter how good it is.

This is S50 Identify Metrics, and it is a universal skill for exactly this reason.

---

## Register by audience

The same work, translated for who is listening. This is translation, not spin — the underlying work does not change.

| Audience | Lead with | Language |
|---|---|---|
| CEO, CFO, board | Financial, Risk | Cost, revenue, exposure, runway |
| Product leadership | Product, User | Adoption, retention, quality, fit |
| Sales and marketing | Financial, Product | Conversion, cycle length, differentiation |
| Engineering leadership | Operational, Risk | Cycle time, rework, defects, rebuild avoidance |
| Design management | Operational, Management | Capacity, redundancy, alignment, team health |
| Your manager, in a review | Operational, Management, plus one Financial | Specific, attributable, evidenced |

---

## Situational patterns

### The performance review / promotion packet
The problem: a portfolio of many small unconnected projects that reads as busy rather than valuable.

The move: find the impact that connects them. Multiple site maps, journeys and blueprints across separate teams is not twelve projects — it is **Reduce Redundant Effort [O3]** and **Enable Organizational Clarity [M1]** delivered twelve times. Name the duplication found, the teams unblocked, and the hours released.

Structure: one sentence of aggregate impact, then three evidenced examples, then the list.

### The headcount or budget request
The move: map missed business opportunity to absent UX capacity. Quantify demand you could not serve — an intake or ticketing system (S98 Establish Design Operations) makes this concrete. Then attach the unserved demand to the impacts it would have produced.

Argue in the language of the goal being missed, not the workload being carried.

### The internal tool
The most underclaimed surface in most organisations. Salaried staff using a bad tool costs money every single day, which makes the arithmetic unusually clean:

> seconds saved × frequency per day × number of users × loaded hourly rate

That converts **Save User Time [U4]** into **Increase Productivity [O8]** and, for support-facing tools, **Reduce Cost of Support [F1]**. Say "released capacity" rather than "saved money" unless the capacity was actually redeployed.

### The killed project
The most persuasive and least recorded UX outcome. Work stopped before spend is **Reduce Risk in Development [R3]**, and the avoided build estimate is a real number that engineering can corroborate. Keep a running log of concepts killed and what they would have cost. Almost nobody does this.

### The accessibility case
Make both arguments, always. Compliance alone (**R2**) is a floor argument that invites minimum-viable responses. Pair it with **Expand Market and Potential Audience [P10]** and the reach numbers, and it becomes a growth argument.

---

## Failure modes to catch

**Output language.** "I designed a new flow", "I ran eight interviews", "I delivered a component library." These describe activity. Convert to what changed.

**The unfalsifiable claim.** "This improved the user experience." Nothing can disprove it, so nothing can support it. Demand a metric.

**Task success standing in for real outcomes.** "94% completed the form" is not **U1**. **U1** is whether they got the thing the form was for. If you cannot see past the screen, say you are measuring interface success, not user outcome.

**Aggregate metrics for segmented effects.** A 4% move in total tickets is weak; a 20% move in the specific contact reason you addressed is strong. Segment to the thing you touched.

**Claiming the whole delta.** Sales, pricing, marketing and design all moved conversion in the same quarter. Claim contribution, or run a controlled comparison, but do not claim the total.

**Usage as proxy for value.** More time in product can mean engagement or confusion. For a utility, longer sessions are usually a failure. State which reading applies.

**Ignoring blocked conditions.** Promising an impact the person lacks the authority, scope or resources to deliver. Check first; name the blocker instead.

**Sanding off the caveat to make the slide cleaner.** The caveat is what makes the number believable. Keep it, and keep it short.

---

## Readout structure

Impact first. Method last, and only if asked.

1. **The headline** — one sentence, one impact, one number.
2. **What changed for users** — the user impact, with its measure.
3. **What that means for the business** — the financial or product cascade, tiers labelled.
4. **What we do not yet know** — the honest gaps. This paragraph buys credibility for the three above it.
5. **What happens next** — the decision you are asking for.
6. **Method** — an appendix, not an act.

Most UX readouts invert this entirely, spending their strongest minutes on process. The audience decides whether to keep listening during the first sentence.
