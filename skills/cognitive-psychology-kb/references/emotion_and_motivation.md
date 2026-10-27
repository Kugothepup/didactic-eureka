# Emotion & Motivation

Reference for: Norman's emotional levels, aesthetic-usability effect, peak-end rule, Zeigarnik
effect, goal gradient, endowed progress, flow, self-determination theory, variable rewards.

Status key: ✅ Robust · ⚠️ Revised/qualified · ❌ Contested.

---

## Norman's Three Levels of Emotional Design (*Emotional Design*, 2004)

- **Visceral** — immediate, pre-cognitive aesthetic reaction (first 50ms impressions;
  cf. Lindgaard et al., 2006: visual appeal judgments form in ~50ms and are stable).
- **Behavioural** — the feeling of use: control, competence, responsiveness.
- **Reflective** — the story after use: identity, meaning, "am I the kind of person who uses
  this?"

**Status: ✅ Robust as a design framework** (a synthesis of emotion research, not itself a
tested theory — treat as vocabulary, and it's excellent vocabulary).

**Design implications:** Audit all three separately: a product can win viscerally (beautiful),
fail behaviourally (laggy, opaque), and still be defended reflectively (status brand) — or the
reverse. Error and success moments are where behavioural and reflective levels meet.

---

## Aesthetic-Usability Effect (Kurosu & Kashimura, 1995; Tractinsky, Katz & Ikar, 2000)

More attractive interfaces are *perceived* as more usable; the perception is remarkably stable
even when objective usability is held constant ("what is beautiful is usable").

**Status: ✅ Robust for perceived usability — ⚠️ with sharp boundary conditions:**
- The effect is on **perception and tolerance**, not objective performance. Later work
  (e.g. Thielsch and colleagues) shows the halo buffers *minor* problems and first impressions;
  it does not survive severe usability failure.
- Testing hazard: attractive prototypes suppress reported problems in usability tests — users
  blame themselves. Probe behaviour, not just satisfaction ratings.

**Design implications:** Visual polish is not decoration; it buys trust, patience, and
forgiveness of small flaws. But it can *mask* problems from your own research — never use
satisfaction scores alone on a beautiful product.

---

## Peak-End Rule (Kahneman et al., 1993; Redelmeier & Kahneman, 1996)

Retrospective evaluation of an experience is predicted by its most intense moment (peak) and
its final moment (end), largely ignoring duration ("duration neglect").

**Status: ✅ Robust in its original domains** (pain/affect episodes) — **⚠️ extension to UX is
plausible inference, not directly established at the same strength.** Say "suggests", not
"proves", when applying to product journeys.

**Design implications (as applied heuristic):**
- The peaks in most products are **error moments** (negative peak candidates) and **completion
  moments**; ends are confirmations, empty "done" screens, offboarding, cancellation.
- Under-designed endings (anticlimactic confirmation, abrupt logout, punitive cancellation) do
  outsized damage to memory of the whole experience; cancellations handled generously are a
  reflective-level investment.
- Fix the worst moment before polishing the average — averages aren't what's remembered.

---

## Zeigarnik Effect (Zeigarnik, 1927)

Interrupted/incomplete tasks are remembered better than completed ones; incompleteness
creates cognitive tension.

**Status: ❌ Contested — replications are decidedly mixed** from the 1960s onward; the effect
appears sensitive to motivation and conditions and is unreliable as a general law.

**How to talk about it:** Fine as a *named hypothesis* behind progress-bar and
incomplete-profile patterns ("the design leans on a Zeigarnik-style incompleteness tension —
note the effect's replication record is mixed"). Don't cite it as established mechanism. The
ethics question is independent of the science: manufactured incompleteness to compel return
visits is an engagement dark pattern whether or not Zeigarnik holds.

---

## Goal-Gradient Effect (Hull, 1932; Kivetz, Urminsky & Zheng, 2006)

Effort accelerates as the goal nears — demonstrated in loyalty programs (coffee-card purchases
speed up approaching the free reward).

**Status: ✅ Robust** (field and lab evidence).

## Endowed Progress Effect (Nunes & Drèze, 2006)

Artificial head-start toward a goal (10-stamp card with 2 pre-stamped vs 8-stamp card empty)
increases completion and speed.

**Status: ✅ Robust** in its demonstrations.

**Design implications for both:** Progress indicators genuinely motivate near the end — put
effort into making late-stage progress visible ("1 step left"). Endowed progress
("profile 20% complete" for merely signing up) works but sits on the ethics line: it's benign
when the goal serves the user, manipulative when the "progress" is fictional pressure toward a
business goal. Apply the transparency test from processing_and_decisions.md.

---

## Flow (Csikszentmihalyi, 1975/1990)

Full absorption when challenge and skill are balanced, goals are clear, and feedback is
immediate.

**Status: ✅ Robust as a well-studied psychological construct** (measurement debates exist).

**Design implications:** The preconditions are actionable: clear goals, immediate feedback,
challenge matched to skill (adaptive difficulty, progressive complexity), and minimal
interruption. Notification and interruption design is flow design: every interruption ejects
the user and re-entry is expensive.

---

## Self-Determination Theory (Deci & Ryan, 1985; 2000)

Intrinsic motivation rests on three needs: **autonomy** (volition), **competence** (mastery,
optimal challenge), **relatedness** (connection). External rewards can *undermine* intrinsic
motivation for already-interesting activities (overjustification effect — meta-analytic support,
Deci, Koestner & Ryan, 1999, with ongoing debate about scope).

**Status: ✅ One of the better-supported motivation frameworks.**

**Design implications:** This is the correct lens for gamification. Points/badges/leaderboards
bolted onto an experience target none of the three needs and can crowd out intrinsic interest;
durable engagement comes from competence signals (meaningful progress, skill growth), autonomy
(real choices), and relatedness (genuine social features). Cite SDT, not "dopamine".

---

## Variable Rewards & Compulsion

Variable-ratio reinforcement schedules (Skinner) produce high, extinction-resistant response
rates; pull-to-refresh and infinite feeds are commonly analysed in these terms
(popularised by Eyal's *Hooked*, 2014).

**Status: ✅ The conditioning science is robust; ⚠️ direct equivalence of feeds to operant
schedules is an analogy, argued not established.**

**Ethics (non-optional):** Deliberately engineering compulsive checking loops fails the
autonomy and transparency tests. Distinguish *engagement* (users return because value recurs)
from *compulsion* (users return despite regretting it). A workable audit signal: would usage
survive the user seeing their own usage statistics? Design that fears its own analytics being
shown to users is on the wrong side.

---

## Quick claims table

| Claim | Verdict |
|---|---|
| "First impressions form in ~50ms and persist" | ✅ Lindgaard et al. — robust |
| "Beautiful products are perceived as more usable" | ✅ Robust — perception only; masks problems in testing |
| "Experiences are judged by peak and end" | ✅ In origin domains; ⚠️ UX extension is inference |
| "Incomplete tasks nag at memory (Zeigarnik)" | ❌ Mixed replications — hypothesis, not law |
| "Motivation accelerates near the goal" | ✅ Goal gradient — robust |
| "Head-start progress increases completion" | ✅ Endowed progress — robust; ethics-check it |
| "Gamification works via points and badges" | ⚠️ SDT says needs, not tokens; rewards can backfire |
| "Feeds are slot machines" | ⚠️ Analogy with real mechanism behind it — argue, don't assert |
