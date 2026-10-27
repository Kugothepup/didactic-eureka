# Audit Framework — Condensed Principle Reference

Fallback science reference for the seven audit dimensions, for use when the
`cognitive-psychology-kb` skill is unavailable. Where the KB *is* available, prefer its
reference files — they carry fuller citations, boundary conditions, and contested-status notes.

Status key: ✅ Robust · ⚠️ Qualified · ❌ Contested. Never present ⚠️/❌ items as settled fact.

---

## Dimension 1 — Memory & Load

- **Working memory ≈ 3–4 chunks** (Cowan, 2001 — the modern revision of Miller's 7±2). ✅
  Applies to what users must *hold in mind*, especially **across screens/steps** — not to
  items merely visible on screen. Chunks, not items: meaningful units, expertise-dependent.
- **Cognitive load** (Sweller): intrinsic (the task) vs extraneous (the presentation). ✅ for
  this two-way split; "germane load" as a third type is ⚠️ contested. Audit goal: eliminate
  extraneous load; don't promise to eliminate intrinsic load without changing the task.
- **Split-attention**: mutually-referring info separated in space (field ↔ its error) = load. ✅
- **Recognition > recall** ✅ — visible options beat blank fields; carry entered data forward.
- ❌ Do not cite "max 7 menu items" — visible menus are recognition/search, not memory.

## Dimension 2 — Attention & Perception

- **Inattentional blindness** (Simons & Chabris, 1999) ✅ — task-engaged users miss passive
  peripheral info, however important. Critical info goes in the task path.
- **Change blindness** (Rensink, 1997) ✅ — un-cued state changes are invisible; motion/highlight
  cues are functional, not decorative.
- **Banner blindness** (Benway & Lane, 1998; NN/g eyetracking) ✅ — ad-shaped/ad-positioned
  content is skipped, including your important content.
- **Pop-out / preattentive features** (Treisman & Gelade, 1980) ✅ — one distinctive feature is
  found in parallel; salience is zero-sum, so one primary emphasis per view.
- **F-pattern** ⚠️ — a symptom of skimming on poorly structured pages, not a law; design against
  it (front-loaded headings, anchors). Z-pattern ❌ folklore.

## Dimension 3 — Gestalt & Visual Structure

Grouping precedes reading (Wertheimer, 1923; Palmer, 1992 common region). All ✅:
proximity, similarity, common region, continuity/alignment, closure, figure/ground.
Priority when in conflict: proximity/common region usually dominate similarity.
Canonical checks: label-to-field gap < field-to-field gap; controls sit with the region they
act on; no accidental grouping of unrelated items; visual structure mirrors logical structure.

## Dimension 4 — Mental Models & Affordances

- **Mental models / system image** (Norman) ✅ — users act on a simplified model built from the
  UI; incoherent system image → wrong model → "senseless" errors that make sense internally.
- **Jakob's Law** ⚠️ heuristic (transfer of learning): follow convention unless deviation buys
  more than the relearning tax.
- **Affordances vs signifiers** (Gibson 1979; Norman 1988, revised 2013) ✅ — designers
  manipulate *signifiers*. Flag **false affordances** (looks clickable, isn't) and **hidden
  affordances** (clickable, doesn't look it).
- **Gulfs of execution/evaluation** (Hutchins, Hollan & Norman, 1986) ✅ — classify each
  confusion: couldn't find/do (execution) vs couldn't tell what happened (evaluation).
- **Paradox of the Active User** (Carroll & Rosson, 1987) ✅ — users act, don't read; require
  learnability through safe exploration + undo, not instructions.

## Dimension 5 — Decision Architecture

- **Defaults** ✅ — the strongest lever in behavioural science; also the sharpest ethics point.
- **Anchoring, framing** ✅ robust; **loss aversion** ⚠️ robust at stakes, contested as
  universal; **prospect theory core** ✅.
- **Hick's Law** ⚠️ — simple practiced choices only; for menus, grouping/ordering/scent matter
  more than count.
- **Choice overload** ⚠️ conditional (meta-analytic mean ≈ 0; appears under hard trade-offs,
  unfamiliar options, no defaults). Fix with defaults/recommendations/comparison support, not
  reflexive option-cutting.
- **"Decision fatigue"** ❌ as depletion (ego-depletion replication failure) — reframe as
  attention/satisficing; the advice (fewer forced decisions, defer optional ones) survives.

## Dimension 6 — Emotion & Experience Arc

- **Aesthetic-usability effect** (Kurosu & Kashimura, 1995; Tractinsky, 2000) ✅ for
  *perceived* usability — buys tolerance of minor flaws; masks problems in testing; does not
  survive severe failure.
- **Peak-end rule** (Kahneman, 1993) ✅ in origin domains, ⚠️ UX extension is inference — audit
  worst moment (usually errors) and the ending (confirmations, offboarding, cancellation).
- **Goal gradient** (Hull; Kivetz, 2006) ✅ and **endowed progress** (Nunes & Drèze, 2006) ✅ —
  late-stage progress visibility motivates; fictional progress is an ethics flag.
- **Zeigarnik effect** ❌ mixed replications — name as hypothesis only.
- **Norman's visceral/behavioural/reflective levels** ✅ as framework vocabulary.

## Dimension 7 — Ethics & Manipulation

Legitimacy test: serves the user's own goals (a) as they'd endorse them, (b) transparently —
survives the user understanding the mechanism, (c) with easy reversal/refusal.
Flag (Brignull; Gray et al., 2018): confirmshaming, roach motel/forced continuity,
manufactured urgency or scarcity (fraud if false; regulated — FTC, EU DSA Art. 25),
preselection (unlawful for consent under GDPR — *Planet49*), misdirection, hidden costs,
**sludge** (Thaler, 2018: friction against the user's interest — compare signup vs cancel
effort). Evaluate against the most vulnerable plausible user, not the median.

---

## Cross-dimension quantitative anchors

- Touch targets: 44–48 px/pt/dp real floor (Apple/Google/Parhi 2006); WCAG 2.2 §2.5.8's 24px
  is compliance-only. ≥8px between adjacent targets.
- Fitts's Law (Shannon form, MacKenzie 1992): MT = a + b·log₂(D/W + 1) — pointing only; use
  the `goms-simulation-engine` skill for calculations.
- Response bands (Miller 1968; Nielsen 1993): ~0.1s instantaneous / ~1s flow limit / ~10s
  attention limit. <100ms: show no spinner; >1s: activity indicator; long waits: progress.
- Doherty threshold (1982): fast **system response** (<~400ms) boosts productivity — it is not
  an animation-duration rule; keep latency + animation inside the flow band.

## Severity calibration reminders

- Rate against **context established in Step 2** (stakes, expertise, usage setting): the same
  violation is 🔴 in a medical dosage flow and 🟡 in a casual browsing context.
- A violation of a ⚠️/❌ principle cannot outrank a violation of a ✅ principle at equal impact
  — evidence strength feeds severity.
- Every 🔴/🟠 finding needs a mechanism sentence ("this fails *because* [principle]: …"), not
  just a label.
