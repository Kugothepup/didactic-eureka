# Attention & Perception

Reference for: selective attention, inattentional/change/banner blindness, preattentive
processing, salience, scanning patterns (F/Z), Gestalt principles, Von Restorff, serial position.

Status key: ✅ Robust · ⚠️ Revised/qualified · ❌ Contested.

---

## Selective Attention

Attention is a limited-capacity filter; unattended information gets shallow processing
(Broadbent, 1958; Treisman's attenuation revision, 1964). Two control modes interact:
**goal-directed (top-down)** — driven by the user's task — and **stimulus-driven (bottom-up)** —
captured by motion, abrupt onset, contrast, novelty.

**Status: ✅ Robust framework.**

**Design implications:**
- Bottom-up capture is a budget. Every animation, badge, and high-contrast element competes
  with the user's task. One primary visual emphasis per view.
- Abrupt onsets and motion are the strongest captures — which makes them right for genuine
  urgency and wrong for promotions.
- Users on a task develop *attentional set*: they see what matches their goal and filter the
  rest (the mechanism behind both banner blindness and missed system messages).

---

## Inattentional Blindness (Simons & Chabris, 1999 — "invisible gorilla")

People engaged in an attention-demanding task fail to notice salient unexpected events.
**Status: ✅ Robust and well replicated.**

**Design implications:** Users mid-task will not notice passive peripheral information —
however important. Critical information must interrupt the task path (inline, blocking where
justified) or be placed where the task's attention already is. "But we showed a message" is
not evidence users could see it.

## Change Blindness (Rensink et al., 1997)

Changes to a scene go unnoticed when the transient motion signal is masked (page reload,
scroll, blink, or simultaneous other changes).
**Status: ✅ Robust.**

**Design implications:** Silent state changes are invisible. If content updates without a
motion/highlight cue (a price recalculates, a validation state flips, an item is removed),
assume users didn't register it. Brief, purposeful animation is the *functional* fix here —
this is what motion tokens are for, not decoration.

## Banner Blindness (Benway & Lane, 1998; Nielsen Norman eyetracking)

Users learn to skip regions and formats that historically contained ads: right rails, top
banners, boxed/colourful graphics, anything ad-shaped.
**Status: ✅ Robust and repeatedly confirmed in eyetracking.**

**Design implications:** Important content styled like a promotion inherits promotion-level
attention (≈ none). Beware: legitimate CTAs in banner positions, help content in colourful
boxes, feature announcements that look like ads.

---

## Preattentive Processing & Salience

A small set of features is detected in parallel before focused attention: colour, orientation,
size, motion (Treisman & Gelade, 1980, feature integration theory; Healey's visualization work).
A target differing on **one** preattentive feature "pops out" regardless of distractor count;
conjunctions of features require serial search.

**Status: ✅ Robust.**

**Design implications:** Encode the one thing users must find with a single distinctive feature
(one accent colour for primary actions; one shape for errors). If everything is bold and
colourful, nothing pops out — salience is zero-sum.

---

## Scanning Patterns: F-Pattern and Z-Pattern

**F-pattern (Nielsen, 2006):** On text-heavy, unformatted pages, users' fixations cluster in an
F: two horizontal sweeps near the top, then a vertical skim down the left edge.
**Status: ⚠️ Heavily qualified.** It describes *default behaviour on walls of text when users
are skimming with low commitment* — it is not how users read well-structured pages, and NN/g's
own follow-ups stress it's a symptom to design *against* (with headings, front-loaded words,
visual anchors), not a template to design *for*. Layout, task, and language direction all
change the pattern.

**Z-pattern:** Claimed Z-shaped scan on sparse layouts. **Status: ❌ Design folklore** — little
direct empirical support; treat as a composition rule-of-thumb at best.

**How to talk about them:** Cite the F-pattern as evidence that users skim and that the first
words of headings/links carry disproportionate weight. Don't present either pattern as a law of
eye movement.

---

## Gestalt Principles (Wertheimer, 1923; Koffka; Palmer, 1992)

Perceptual grouping happens pre-attentively — users see structure before they read anything.

- **Proximity** — near things group. The workhorse: spacing *is* grouping. ✅
- **Similarity** — alike things (colour, shape, size) group. ✅
- **Common region** — shared enclosure groups (Palmer, 1992) — cards, panels, fieldsets. ✅
- **Continuity** — aligned elements read as related paths; alignment implies relationship. ✅
- **Closure** — incomplete forms are completed perceptually (truncated content signals "more"). ✅
- **Common fate** — things moving together group (drag previews, synced animations). ✅
- **Figure/ground** — one region reads as object, the rest as background; modals + scrims
  exploit this. ✅
- **Prägnanz** — perception resolves to the simplest stable organisation. ✅

**Status: ✅ Robust as perceptual phenomena.** (The original holistic Gestalt *theory* of brain
fields is dead; the grouping principles themselves are textbook vision science.)

**Design implications & priority order:** When principles conflict, **proximity and common
region usually dominate similarity**. Practical checks:
- Label-to-field gap must be smaller than field-to-field gap, or forms read as unrelated lists.
- Buttons that act on a region belong inside/adjacent to that region.
- Accidental grouping is the common bug: unrelated items packed tightly read as related.

---

## Von Restorff / Isolation Effect (von Restorff, 1933)

An item distinctive from its context is better remembered and noticed.
**Status: ✅ Robust** (memory effect; the attention version is essentially salience, above).
**Design implications:** Differentiate the one action that matters (primary CTA vs ghost
buttons). Zero-sum: one isolate per set.

## Serial Position Effect (Murdock, 1962)

In recall of a list, first items (primacy) and last items (recency) are remembered best.
**Status: ✅ Robust for memory tasks — ⚠️ commonly over-extended.** Menu positions on a visible
menu are recognition, not recall; the direct application is to *sequences users must remember*
(onboarding steps, spoken/voice menus — where recency dominates) and to experiences over time
(see peak-end in emotion_and_motivation.md).

---

## Visual Hierarchy — the synthesis

Hierarchy = deliberate ordering of salience (size, weight, contrast, position, isolation) to
match task priority. The empirical checks:
1. **The 2-second test:** would a first-time user scanning briefly find the primary action?
2. **Squint test:** blur the page — does the intended reading order survive?
3. Salience budget spent on user priorities, not business priorities (the misalignment behind
   banner blindness of "important" promos).

---

## Quick claims table

| Claim | Verdict |
|---|---|
| "Users don't notice things outside their task focus" | ✅ Inattentional blindness — robust |
| "Silent updates get missed" | ✅ Change blindness — robust; cue changes with motion |
| "Ad-shaped content is ignored" | ✅ Banner blindness — robust |
| "Users read in an F-pattern" | ⚠️ Skimming symptom on poor layouts, not a law |
| "Z-pattern guides layout" | ❌ Folklore |
| "Gestalt grouping shapes perception before reading" | ✅ Robust |
| "Make one thing distinctive and it will be noticed/remembered" | ✅ Von Restorff / pop-out — robust, zero-sum |
| "Put important menu items first and last (serial position)" | ⚠️ Only for remembered sequences (e.g. voice), not visible menus |
