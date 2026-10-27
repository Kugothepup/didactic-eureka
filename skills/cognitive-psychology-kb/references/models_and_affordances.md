# Mental Models & Affordances

Reference for: mental models, Jakob's Law, affordances and signifiers, gulfs of execution and
evaluation, discoverability, learnability, consistency, the Paradox of the Active User.

Status key: ✅ Robust · ⚠️ Revised/qualified · ❌ Contested.

---

## Mental Models (Craik, 1943; Johnson-Laird, 1983; Norman, 1983)

Users act on an internal, simplified, often wrong model of how the system works — built from
prior experience, the interface's *system image*, and folk theories. Norman's key distinction:
the **designer's conceptual model** reaches the user only through the **system image** (UI, docs,
behaviour); if the system image is incoherent, users build the wrong model and errors follow.

**Status: ✅ Robust framework.**

**Design implications:**
- Errors that "make no sense" usually make perfect sense inside the user's model — diagnose the
  model, not the user.
- The interface is the only channel the model travels through: labels, groupings, and behaviour
  must consistently express one conceptual model (e.g. is it "folders" or "tags"? Pick one story).
- Match models users import from the domain and from other software (next entry) unless the
  mismatch buys something large — then scaffold the transition explicitly.

---

## Jakob's Law (Jakob Nielsen, 2000)

"Users spend most of their time on other sites; they expect your site to work like the sites
they already know."

**Status: ⚠️ A heuristic, not a law** — an application of transfer of learning and mental-model
research, not an empirical discovery with its own evidence base. Strongly useful; occasionally
wrong (conventions can embed bad patterns; genuinely novel interactions sometimes win — but they
pay a re-learning tax and need scaffolding).

**Design implications:** Deviate from convention only where differentiation is the point and the
value exceeds the learning cost. Navigation, forms, checkout, and settings are almost never the
right place to innovate.

---

## Affordances & Signifiers (Gibson, 1979; Norman, 1988; Norman, 2013 revision)

- **Gibson:** affordances are real action possibilities of the environment relative to an actor
  — they exist whether or not perceived.
- **Norman (1988)** imported "perceived affordances" into design — what users *believe* they
  can do.
- **Norman (2013, revised *Design of Everyday Things*)** corrected the drift in usage: what
  designers mostly manipulate are **signifiers** — perceivable cues (shading, borders, labels,
  cursors) that communicate the affordance. "The button affords clicking" conflates the two;
  precise usage is: the control affords activation; its styling *signifies* it.

**Status: ✅ Robust distinction — use the 2013 vocabulary.**

**Failure modes (both flag-worthy in audits):**
- **False affordance** — looks actionable, isn't (underlined non-link text, card that looks
  clickable but only its title is). Produces unrecoverable confusion and mistrust.
- **Hidden affordance** — actionable, doesn't look it (flat text that's secretly a button,
  hover-only controls, gesture-only actions with no visual hint, swipe actions). Produces
  missed capability; especially damaging in AI interfaces where the possibility space is
  already opaque.

**Flat design note:** The post-2013 flat aesthetic removed many signifiers; measurable costs to
click-target identification were documented (NN/g's flat-UI studies). The fix isn't skeuomorphism
— it's ensuring *some* consistent interactive signature (colour, weight, iconography, cursor,
placement) distinguishes interactive from static. See ux-principles-layer Lens 2.

---

## Gulf of Execution / Gulf of Evaluation (Hutchins, Hollan & Norman, 1986)

- **Gulf of execution:** the gap between the user's intention and the actions the system makes
  available — "I know what I want; how do I do it here?"
- **Gulf of evaluation:** the gap between the system's state and the user's ability to perceive
  and interpret it — "I did something; what happened?"

**Status: ✅ Robust framework** — arguably the most practically useful diagnostic pair in HCI.

**Design implications:**
- Execution side: visible options matching user vocabulary; recognition over recall; prominent
  next steps; constraint of invalid paths.
- Evaluation side: immediate, specific feedback for every action; visible system status
  (Nielsen heuristic #1); state changes cued against change blindness.
- In audits, classify each confusion point as an execution gulf (couldn't find/do) or an
  evaluation gulf (couldn't tell what happened) — the fixes differ.

---

## The Paradox of the Active User (Carroll & Rosson, 1987)

Users don't read manuals or complete tutorials; they act immediately, satisfice, and carry over
habits — even when this is objectively inefficient ("production bias": people are there to do
the task, not to learn the tool).

**Status: ✅ Robust and repeatedly observed.**

**Design implications:**
- Learnability must come through the doing path: safe exploration, undo everywhere, inline
  hints at the moment of relevance — not upfront instruction.
- If a feature requires reading documentation before first use, it has failed this test for a
  general audience (expert/professional tools get more slack, but still less than teams assume).
- Onboarding that front-loads tours is fighting the paradox; progressive, contextual onboarding
  works with it.

---

## Consistency & Transfer of Learning

**Internal consistency:** the same thing looks/behaves the same everywhere in the product;
different things look different. Every inconsistency taxes the user's model.
**External consistency:** alignment with platform conventions (iOS/Android/desktop/web) and
category conventions (what other tools in this domain do) — this is Jakob's Law's mechanism.

**Status: ✅ Robust** (transfer of learning is classic learning theory).

**Trade-off worth naming:** internal vs external consistency can conflict (your product's
established pattern vs the platform's). Resolve by user base: single-platform users → platform
wins; cross-platform daily users of *your* product → internal consistency may win. Document the
choice either way.

---

## Discoverability & Learnability

**Discoverability:** can users find out what's possible? Threatened by hidden affordances,
gesture-only actions, overloaded overflow menus, and over-aggressive progressive disclosure.
**Learnability:** how quickly do users become competent? Driven by consistency, feedback,
conceptual-model clarity, and safe exploration (undo).

**Measurement note:** first-use success rate and time-to-first-success are the honest metrics;
"users will learn it" claims should specify the mechanism (what teaches them, when).

---

## Quick claims table

| Claim | Verdict |
|---|---|
| "Users act on mental models built from other products" | ✅ Robust; Jakob's Law is the heuristic form |
| "Jakob's Law is a scientific law" | ⚠️ Heuristic — application of transfer research |
| "Affordance = visual cue" | ⚠️ Imprecise — the cue is the *signifier* (Norman 2013) |
| "Flat design harmed discoverability of interactive elements" | ✅ Documented; fix with consistent interactive signatures |
| "Users will read the tutorial" | ❌ Paradox of the Active User — design for immediate action |
| "Every action needs perceivable feedback" | ✅ Gulf of evaluation — robust |
