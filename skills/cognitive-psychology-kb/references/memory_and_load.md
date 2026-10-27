# Memory & Cognitive Load

Reference for: working memory, chunking, Miller's Law, Cowan's revision, cognitive load theory,
progressive disclosure, recognition vs recall, external memory.

Entry format: what it says → current status → boundary conditions → design implications → common misapplications.
Status key: ✅ Robust · ⚠️ Revised/qualified · ❌ Contested.

---

## Working Memory Capacity

### Miller's "Magical Number Seven" (George Miller, 1956)
Miller's paper reviewed limits on absolute judgment and immediate memory span, landing on
"seven, plus or minus two" — a figure Miller himself framed half-rhetorically.

**Status: ⚠️ Revised.** The modern consensus estimate is **Cowan's 3–4 chunks** (Nelson Cowan,
2001, "The magical number 4 in short-term memory"). Miller's 7±2 reflected span tasks where
rehearsal and chunking inflate the apparent capacity; when those strategies are controlled,
the underlying capacity of the focus of attention is about 4 chunks (range 3–5).

**How to talk about it:** Use 3–4 chunks as the primary figure. If the user cites 7±2, explain
the relationship: Miller measured performance with rehearsal/chunking available; Cowan isolated
the core capacity. Both are about *chunks*, not items — a chunk is a meaningful unit, so capacity
in items varies enormously with expertise (Chase & Simon, 1973: chess masters chunk whole
board configurations).

**Common misapplications:**
- "Navigation menus must have ≤7 items." False. Scanning a visible menu is a **recognition/visual
  search task, not a memory task** — nothing is held in working memory. Menu length should be
  driven by scannability, grouping, and information scent, not Miller.
- Treating the limit as items rather than chunks. "1-800-FLOWERS" is one chunk, not 12.
- Applying it to information *displayed* on screen. The limit applies to what users must
  **hold in mind**, especially across screens or steps.

### Working Memory Architecture (Baddeley & Hitch, 1974; Baddeley, 2000)
Working memory is multi-component: phonological loop (verbal), visuospatial sketchpad (visual),
central executive (control), episodic buffer (integration, added 2000).

**Status: ✅ Robust as a framework** (details still researched).

**Design implication:** Verbal and visual channels are partly separate — this underpins the
**modality effect**: information split sensibly across speech/text and visuals can exceed what
either channel handles alone, while redundant identical text + narration can *hurt*
(the redundancy effect; Sweller; Mayer's multimedia principles).

---

## Cognitive Load Theory (John Sweller, 1988; reconceptualised 2010)

Three load types in the classic formulation:
- **Intrinsic load** — inherent complexity of the task/material (element interactivity).
- **Extraneous load** — load imposed by presentation, not the task (poor layout, ambiguous
  labels, inconsistent patterns, split attention).
- **Germane load** — effort devoted to schema construction (learning the system).

**Status: ⚠️ Revised.** The three-part model is widely used, but germane load is contested as an
independent category — Sweller's own 2010 reconceptualisation folds germane resources into how
intrinsic load is handled, partly because a three-way model is hard to falsify (any result can be
attributed to some mix). Load is also difficult to measure directly; most measures are indirect
(secondary tasks, self-report like NASA-TLX, pupillometry).

**How to talk about it:** The intrinsic/extraneous distinction is the load-bearing part (and the
practically useful one): **you cannot remove intrinsic load without changing the task, so the
design goal is ruthless elimination of extraneous load.** Treat "germane load" as a caveat-worthy
term, useful shorthand for productive effort, not settled taxonomy.

**Design implications:**
- Split-attention effect: separating mutually-referring information (diagram here, legend there;
  field here, error message elsewhere) creates extraneous load. Integrate them spatially.
- Consistency is load management: every deviation from an established pattern is a small
  extraneous cost that compounds.
- Some friction is functional: for systems users must build a mental model of (including AI
  systems), removing *all* effort can prevent learning and produce miscalibrated trust.

**Common misapplication:** "Minimise cognitive load" as an absolute. The goal is minimising
*extraneous* load; intrinsic load is the task, and productive effort is how users learn.

---

## Chunking & Progressive Disclosure

### Chunking (Miller, 1956; Chase & Simon, 1973)
Grouping items into meaningful units expands effective capacity.

**Status: ✅ Robust.**

**Design implications:** Format long strings in conventional groups (card numbers 4-4-4-4,
phone numbers by region convention); group form fields into labelled sections; present options
in 3–5 item clusters rather than flat lists of 12.

### Progressive Disclosure (popularised by Jack Carroll & John Nielsen)
Show only what's needed now; defer secondary information/options behind an explicit step.

**Status: ✅ Robust as a technique**, with a trade-off: every disclosure step hides information
and adds an interaction cost. Misjudged staging buries things users need (see *hidden
affordances* in models_and_affordances.md).

**Boundary conditions:** Works when there's a clear frequency split (common vs advanced). Fails
when users can't predict what's behind the disclosure or when experts need everything at once
(dense professional tools legitimately favour density).

---

## Recognition vs Recall

Recognition (seeing an option and knowing it) is dramatically easier than recall (generating it
from memory). Grounded in classic memory research; enshrined as Nielsen heuristic #6.

**Status: ✅ Robust.**

**Design implications:** Menus over command lines for novices; suggestions and recent items over
blank fields; visible state over remembered state; show previously entered data at confirmation
steps rather than expecting users to remember it.

**Boundary condition:** Experts with automated command knowledge can be *faster* with
recall-based interfaces (keyboard shortcuts, command palettes). Provide both paths.

---

## External Memory & Cognitive Offloading

People use the environment as memory (Scaife & Rogers, "external cognition"; distributed
cognition, Hutchins). Interfaces that externalise state — visible progress, persistent carts,
breadcrumbs, drafts that save — remove the need to hold state internally.

**Status: ✅ Robust.**

**Design implications:**
- Never require users to remember information from a previous screen (this is where the 3–4
  chunk limit genuinely bites). Carry information forward: show the plan they picked on the
  payment screen, the email they entered on the verify screen.
- Multi-step flows need visible progress and reviewable earlier answers.
- Auto-save and draft persistence are memory prosthetics, not conveniences.

---

## Quick claims table

| Claim | Verdict |
|---|---|
| "Working memory holds 7±2 items" | ⚠️ Use 3–4 chunks (Cowan 2001); 7±2 is the historical figure with rehearsal/chunking |
| "Menus should have max 7 items" | ❌ Misapplication — menus are recognition tasks |
| "Minimise all cognitive load" | ⚠️ Minimise *extraneous* load; intrinsic load is the task |
| "Germane load is a distinct third load type" | ❌ Contested; caveat it |
| "Recognition beats recall" | ✅ Robust (with expert-shortcut caveat) |
| "Don't make users remember info across screens" | ✅ Robust — this is the real Miller/Cowan implication |
