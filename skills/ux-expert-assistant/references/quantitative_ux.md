# Quantitative UX & Human Performance Laws

## 1. GOMS & KLM (Keystroke Level Model)
*Source: Card, Moran, Newell / Wikipedia*
Use for predicting **expert execution time** on routine tasks.

**The Operators (Standard Times):**
* **K (Keystroke):** 0.20s (Expert) - 0.28s (Average typist).
* **P (Point with Mouse):** 1.10s (Fitts's Law approximation).
* **H (Homing):** 0.40s (Hand from mouse to keyboard).
* **M (Mental Act):** 1.20s (Thinking/Decision moment).
* **R (System Response):** Variable.

**Formula:** `Task Time = Σ(K + P + H + M + R)`
*Note: "M" operators are the most critical to optimize. Reduce M to reduce cognitive load.*

## 2. Fitts’s Law
*Source: Paul Fitts / IxD Laws*
Predicts time to move a cursor to a target.

**Formula:** `MT = a + b * log2(D/W + 1)`
* **D:** Distance to target.
* **W:** Width of target (along axis of motion).
* **Implication:** Make buttons large (High W) and close to the starting pixel (Low D).
* **Infinite Width:** Edges of the screen have infinite width (impossible to overshoot), making them the fastest targets.

## 3. Survival Analysis in UX
*Source: Chandar et al. (Spotify Research)*
Instead of "Churn Rate" (binary), use **Time-to-Event** models.
* **Hazard Function:** The probability that a user drops off at time *t*, given they survived until *t*.
* **Application:** Identifying the specific "death moments" in a user journey (e.g., Day 7, or "After 3rd Search").