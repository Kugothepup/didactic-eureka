# Processing & Decisions

Reference for: dual-process theory, heuristics and biases, prospect theory, Hick's Law,
choice overload, decision fatigue, defaults, nudges, and the ethics of persuasion.

Status key: ✅ Robust · ⚠️ Revised/qualified · ❌ Contested.

---

## Dual-Process Theory ("System 1 / System 2")

Fast, automatic, effortless processing vs slow, deliberate, effortful processing
(Wason & Evans, 1975; Stanovich & West, 2000; popularised by Kahneman, *Thinking, Fast and
Slow*, 2011).

**Status: ❌ Significantly contested — never present as settled fact.**
- The two-systems framing is criticised as unfalsifiable and descriptively wrong: processing is
  better described as continuous, with automatic and controlled components interacting throughout
  (Melnikoff & Bargh, 2018, "The mythical number two").
- Defenders (Evans & Stanovich, 2013) retreat to "Type 1/Type 2 *processing*" — properties of
  processes, not two agents in the head.
- Several findings associated with the System 1/2 literature failed replication (notably many
  social priming effects; Kahneman himself acknowledged the priming chapter overstated the
  evidence).

**How to talk about it:** Useful as a *heuristic vocabulary* ("this flow assumes deliberate
attention users won't give it"), not as mechanism. Avoid diagnosing errors as "System 1 took
over"; instead identify *what specifically* was automatic (habitual click-through, reading
shortcut, pattern match) and design for it.

**Design implication that survives the critique:** Users mostly act on habit, partial reading,
and pattern recognition — design for the skimming, satisficing reader (see Paradox of the Active
User in models_and_affordances.md), and add deliberate friction only at genuinely consequential
choices (destructive actions, payments, legal consent).

---

## Heuristics & Biases (Tversky & Kahneman, 1974)

### Anchoring
First numbers encountered bias subsequent estimates.
**Status: ✅ Robust** — one of the most replicated effects in the literature.
**Design relevance:** Price displays, "was/now" comparisons, default slider positions, suggested
donation amounts. **Ethics:** anchors that inform (typical amounts) vs anchors that distort
(inflated reference prices — illegal in many jurisdictions).

### Availability
Ease of recall inflates judged frequency/probability.
**Status: ✅ Robust.**
**Design relevance:** Vivid recent errors dominate users' model of a product; salient examples
in empty states and onboarding shape what users think the product is for.

### Framing Effects
Logically equivalent descriptions ("90% survival" vs "10% mortality") shift choices.
**Status: ✅ Robust** (large replication support, incl. Many Labs).
**Design relevance:** Error messages, plan comparisons, risk disclosures. Positive/negative
framing of the same setting ("Keep my data private" vs "Don't share my data") changes opt-in
rates — which is exactly why it needs an ethics check.

### Loss Aversion (Kahneman & Tversky, 1979 — Prospect Theory)
Losses loom larger than equivalent gains (canonical λ ≈ 2).
**Status: ⚠️ Qualified.** Robust for moderate-to-large stakes; contested as a universal
principle — for small stakes loss aversion often disappears, and critics argue it's less
fundamental than presented (Gal & Rucker, 2018). Prospect theory's core (reference dependence,
diminishing sensitivity, probability weighting) remains well supported.
**Design relevance:** "You'll lose your streak/progress/discount" framings are powerful and
therefore ethically loaded. Endowment framing ("your free trial features") leverages the same
mechanism.

---

## Hick's Law (Hick, 1952; Hyman, 1953)

Choice reaction time increases with the log of the number of equally probable alternatives:
RT = a + b·log₂(n).

**Status: ✅ Robust in its original domain — ⚠️ narrow domain.** It describes *simple,
practiced stimulus–response choices*. It does **not** describe:
- Complex decisions requiring evaluation (choosing a mortgage isn't log-time).
- Visual search through menus — search through an *ordered/grouped* list is roughly logarithmic
  anyway, and Landauer & Nachbar (1985) showed broad-shallow menus can beat deep-narrow ones,
  the opposite of a naive Hick reading.
- Expert users with automated responses.

**How to talk about it:** "More options slow simple choices, roughly logarithmically" is fine;
"reduce menu items because Hick's Law" usually isn't the real justification — grouping,
ordering, and information scent matter more. Reserve Hick's Law for genuine reaction-time
contexts (toolbars, game controls, alarm responses).

---

## Choice Overload / "Paradox of Choice"

Famous jam study: 24 jams attracted more browsers, 6 jams sold more (Iyengar & Lepper, 2000).

**Status: ⚠️ Heavily qualified.** Scheibehenne, Greifeneder & Todd's 2010 meta-analysis found a
mean effect close to **zero** across studies. Choice overload is real but **conditional**
(Chernev et al., 2015): it appears with high decision difficulty (no dominant option, hard
trade-offs), unfamiliar/complex options, no clear preferences, and choice-set complexity.
With clear preferences, good defaults, or easy comparison, more choice is neutral or positive.

**Design implication:** Don't cite "paradox of choice" to justify cutting options. Instead make
large sets navigable: defaults, recommendations ("most popular"), meaningful sort/filter,
comparison support. That's what actually resolves overload.

---

## Decision Fatigue & Ego Depletion

Claim: making decisions depletes a limited resource, degrading later decisions.

**Status: ❌ Contested.** The underlying ego-depletion effect largely failed large-scale
registered replication (Hagger et al., 2016 RRR ≈ null). The famous "hungry judges" study has
serious confounds. Some decision-fatigue-adjacent findings persist, but the strong resource
model should not be asserted.

**How to talk about it:** Frame as "long sequences of choices reduce engagement and increase
reliance on defaults/satisficing" — an observation about attention and motivation, not a
depleted glucose tank. The design advice (reduce unnecessary decision points, defer optional
choices, provide defaults) is still sound on other grounds.

---

## Defaults

Preset options that hold unless changed.

**Status: ✅ Robust — among the largest effects in behavioural science.** (Organ donation
consent, Johnson & Goldstein, 2003; retirement auto-enrolment, Madrian & Shea, 2001.)
Mechanisms: effort, implied endorsement, reference-point/loss framing.

**Design relevance:** The single most powerful decision-architecture tool available. Which is
why default-setting is the sharpest ethics question in a product: a default is a decision the
designer makes *for* the user.

---

## Social Proof (Cialdini, 1984)

People infer correct behaviour from others' behaviour, especially under uncertainty.
**Status: ✅ Robust as a phenomenon;** effect sizes vary. **Design relevance:** reviews,
"X people are viewing", usage counts. Fabricated or pressure-framed social proof
("3 rooms left!" when false) is deception, not persuasion — see ethics below.

---

## Nudges (Thaler & Sunstein, 2008)

Choice-architecture interventions that steer behaviour without removing options.

**Status: ⚠️ Qualified.** Mertens et al.'s 2022 meta-analysis reported a moderate average
effect, but Maier et al. (2022) showed that after publication-bias correction the average
effect is indistinguishable from zero — *while* specific interventions (especially defaults)
remain reliably effective. Translation: "nudging" as a category is heterogeneous; defaults and
friction changes work; many framing/priming nudges are weak or unreliable.

---

## Ethics: Persuasion, Dark Patterns, and Sludge

This section governs every recommendation involving the mechanisms above.

### The line
A technique is a legitimate nudge when it (a) serves the user's own goals as they would
endorse them, (b) is transparent — it would survive the user understanding exactly how it
works, and (c) preserves easy reversal and refusal. It is a **dark pattern** when it relies on
deception, obstruction, or exploiting known biases *against* the user's interests
(Brignull, 2010; Gray et al., 2018 taxonomy: nagging, obstruction, sneaking, interface
interference, forced action).

### Sludge (Thaler, 2018)
Friction that impedes action in the user's interest (cancellation mazes, hidden opt-outs) —
the mirror image of a nudge. Audit asymmetries: is signing up one click and cancelling five?

### Named patterns to flag
- **Confirmshaming** — guilt-framed decline options ("No thanks, I hate saving money").
- **Roach motel / forced continuity** — easy in, hard out; silent trial-to-paid conversion.
- **Manufactured urgency/scarcity** — fake timers, false stock counts. If genuine, must be
  verifiable; if fake, it's fraud in several jurisdictions (and now regulated: FTC dark-pattern
  enforcement, EU DSA Art. 25, UK DMCC).
- **Preselection** — pre-checked add-ons and consents (unlawful for consent under GDPR;
  *Planet49* ruling).
- **Misdirection & visual interference** — styling the company-preferred choice as the only
  apparent path.

### Vulnerability test
Evaluate the pattern against the least-resourced plausible user (stressed, low literacy,
time-pressured, cognitively impaired), not the median user. A pattern that's "fine for savvy
users" and harmful for vulnerable ones fails.

### Rule for this KB
Never recommend a persuasion mechanism without (1) naming the mechanism, (2) stating the
user-alignment case, and (3) noting the abuse mode to avoid.

---

## Quick claims table

| Claim | Verdict |
|---|---|
| "System 1 caused this error" | ❌ Contested framing — name the specific automatic behaviour instead |
| "Anchoring/framing effects are reliable" | ✅ Robust |
| "Loss aversion is universal, λ≈2" | ⚠️ Robust at stakes; contested as universal |
| "More choices always reduce conversion" | ❌ Conditional (meta-analytic mean ≈ 0) |
| "Decision fatigue depletes willpower" | ❌ Ego depletion failed replication; reframe as attention/satisficing |
| "Defaults are the strongest lever" | ✅ Robust |
| "Nudges reliably work" | ⚠️ Category too broad; defaults yes, many framings no |
| "Hick's Law: cut menu items" | ⚠️ Usually a misapplication — applies to simple reaction choices |
