# Quantitative Laws

Reference for: Fitts's Law (canonical formulation for this skill suite), touch targets,
KLM/GOMS, power law of practice, response-time thresholds, the Doherty threshold (accurately
stated), steering law.

Status key: ✅ Robust · ⚠️ Revised/qualified · ❌ Contested.

---

## Fitts's Law (Paul Fitts, 1954)

Time to acquire a target grows with distance and shrinks with target width, logarithmically.

### Formulations — and the canonical one for this suite

```
Original / Welford form:   MT = a + b · log₂(2D/W)
Shannon form (MacKenzie):  MT = a + b · log₂(D/W + 1)      ← CANONICAL for this suite
```

**Use the Shannon formulation (MacKenzie, 1992) everywhere in this skill suite.** It is the
HCI standard (basis of ISO 9241-9 / ISO 9241-411 pointing-device evaluation), never yields a
negative index of difficulty, and fits empirical data at least as well. The
`goms-simulation-engine` skill is the implementation source of truth for calculations; its
default constants (a = 0.1s, b = 0.096s/bit for desktop pointing) are reasonable literature
values — but **constants are device-, population-, and posture-specific**. State the constants
and their source in any prediction.

**Status: ✅ One of the most robust quantitative laws in HCI.**

**Boundary conditions:**
- Models rapid aimed movement to a target — not decision time, visual search, or reading.
  A full interaction = search/decide (Hick, M operators) **+** point (Fitts).
- W is measured **along the axis of motion**; 2D targets need the smaller effective dimension
  or bivariate extensions (MacKenzie & Buxton, 1992).
- Screen edges and corners have effectively infinite W on desktop (cursor stops) — prime
  real estate. Does not apply on touch.
- Touch input follows Fitts imperfectly (occlusion, no cursor, ballistic taps — see FFitts law,
  Bi et al., 2013, for small-target touch).

**Practical implications:** big and near beats small and far; the cost of shrinking a target
grows sharply below ~1cm; distance matters less than width at typical screen scales; corner/edge
placement is free speed on desktop.

---

## Touch Target Minimums

| Source | Minimum | Notes |
|---|---|---|
| Empirical (Parhi, Karlson & Bederson, 2006) | ~9.2mm | Error rates rise steeply below this for thumb use |
| Apple HIG | 44×44 pt | Long-standing platform floor |
| Material Design | 48×48 dp (8dp spacing) | Platform floor |
| WCAG 2.2 — 2.5.8 (AA) | 24×24 CSS px | Legal-ish floor, NOT a design target |
| WCAG 2.2 — 2.5.5 (AAA) | 44×44 CSS px | Aligns with platform guidance |

**Status: ✅ Convergent evidence.** Treat 44–48px/pt/dp as the real design floor for touch;
24px is a compliance minimum only. Spacing between adjacent targets matters as much as size
(mis-hit cost): ≥8px absolute minimum, more for mobile-primary products.

---

## Hick–Hyman Law (Hick, 1952; Hyman, 1953)

RT = a + b·log₂(n) for simple, practiced choices among equally likely alternatives.
**Status: ✅ Robust in narrow domain — see processing_and_decisions.md for the boundary
conditions and common menu-design misapplications.** In KLM terms, choice complexity is
(crudely) absorbed by M operators, not modelled directly.

---

## KLM / GOMS (Card, Moran & Newell, 1980; 1983)

**GOMS** — Goals, Operators, Methods, Selection rules — a family of engineering models of
routine cognitive skill. **KLM** (Keystroke-Level Model) is the simplest member: sum operator
times (K keystroke, P point, H home, M mental preparation, R system response, D draw) for an
error-free expert executing a known method.

**Status: ✅ Robust and validated in its domain** — predictions typically within ±20% of
observed expert times; still used commercially (e.g. CogTool lineage).

**Boundary conditions (the honest small print):**
- Models **expert, error-free, routine** execution. It does not model novices, learning,
  problem-solving, errors and recovery, fatigue, or motivation.
- Best for **comparing design variants** (relative deltas are more trustworthy than absolute
  seconds) and finding mechanical friction.
- M ≈ 1.35s is an *average* over heterogeneous mental acts; M-placement heuristics
  (Kieras, 1993/2001) are rules of thumb, and placement choices can swing totals — document
  every placement decision.
- Operator values were calibrated on 1980s desktop hardware; mobile operators (tap, swipe) are
  later community extensions with weaker canonical grounding — state values used.

**Suite rule:** `goms-simulation-engine` owns KLM/GOMS methodology and the operator table.
Other skills should defer calculations to it rather than restating values.

---

## Power Law of Practice (Newell & Rosenbloom, 1981)

Task time decreases as a power function of practice trials (log-log linear); improvement is
steep early, then diminishing forever.

**Status: ✅ Robust at the aggregate level** (⚠️ later work, Heathcote et al. 2000, shows
individual learning curves are often better fit by exponentials; the design-relevant shape —
fast early gains, long diminishing tail — is unaffected).

**Design implications:** Early experience dominates perceived difficulty; efficiency features
for experts (shortcuts, batch actions) pay off only after the practice curve flattens — provide
both the learnable path and the fast path.

---

## Response-Time Thresholds (Miller, 1968; Card, Robertson & Mackinlay, 1991; Nielsen, 1993)

```
~0.1s  — perceived as instantaneous; direct-manipulation feel
~1s    — flow of thought preserved; delay noticed but tolerated without feedback
~10s   — attention limit; beyond this users task-switch; needs progress + escape
```

**Status: ✅ Robust as order-of-magnitude bands** (they are thresholds of *perception and
attention*, not precise constants).

**Feedback rules derived from them:** <100ms: show nothing (a flashed spinner is pure noise);
100ms–1s: subtle indicator ok; >1s: clear activity indicator; >10s (arguably >4–5s in modern
web contexts): progress with magnitude, time estimate if honest, and a way to do something else.

---

## Doherty Threshold (Doherty & Thadhani, 1982) — stated accurately

**What the work actually showed:** an IBM systems-economics finding that as **system response
time** dropped below ~400ms, user productivity rose disproportionately — users stayed engaged,
worked faster than the raw time savings predicted, and (per associated IBM work, Barber &
Lucas) errors decreased. It argued fast computing pays for itself.

**What it is NOT:** a study of animation durations, task completion rates for slow animations,
or a 400ms "disengagement cliff". Popular UX-law summaries routinely over-extend it.

**Status: ✅ Directionally robust (faster response → better engagement/productivity);
⚠️ the 400ms figure is a 1982 mainframe-context economic threshold, not a perceptual constant.**

**Legitimate design application:** total perceived response time (system latency **+** any
entry animation) should stay comfortably inside the ~1s flow band, and snappy (<400ms) for
high-frequency operations. It is fair to note a 500ms animation *contributes* to response time
and therefore needs to earn its cost with orientation value — but cite the response-time bands
above for that argument, not a fictional completion-rate drop.

---

## Steering Law (Accot & Zhai, 1997)

Time to steer through a constrained path (nested menus, sliders, tunnels) is proportional to
path length / width — much harsher than Fitts for narrow paths.
**Status: ✅ Robust.** Design relevance: hover-nested menus with narrow corridors are
mechanically punishing; widen paths, add hover-intent delays, or avoid nesting.

---

## Weber–Fechner / Just Noticeable Difference

Perceived difference scales with ratio, not absolute difference — the basis for geometric type
scales and the heuristic that adjacent hierarchy levels need ~20%+ size difference to read as
distinct levels at a glance.
**Status: ✅ Robust psychophysics; the specific 20% figure for type is a ⚠️ design heuristic,
not a measured constant — verify visually and differentiate with weight/colour when steps are
close.**

---

## Quick claims table

| Claim | Verdict |
|---|---|
| "Fitts: MT = a + b·log₂(D/W + 1)" | ✅ Canonical Shannon form for this suite |
| "Fitts predicts total interaction time" | ❌ Pointing only — add decision/search time |
| "KLM predicts expert routine task time within ~±20%" | ✅ In-domain; use for comparisons |
| "KLM works for novices" | ❌ Out of domain |
| "0.1s / 1s / 10s response bands" | ✅ Robust order-of-magnitude thresholds |
| "Doherty: animations >400ms drop task completion" | ❌ Misstatement — it's about system response time and productivity |
| "24px touch targets are fine" | ⚠️ Compliance floor only; design to 44–48 |
| "Type steps need ~20% size difference to read as levels" | ⚠️ Useful heuristic grounded in JND; not a constant |
