# Retro log

Pluses and deltas on the method itself, after each study or round (`/research-studio:retro`).
Newest first. Each Δ either became a change (with its version) or stays open.

## 2026-10-15 · the first study, which the plugin was built from

**+ Keep**
- **One journey for every site, with three yes/no checks per stage.** Scores are comparable and each
  one traces back to a still.
- **Pluses before deltas, calibrated tone.** The user asked for it, and it made reviews about changes
  to try rather than faults.
- **Code counts, you label.** `studio summary` reproduced every number already on the Notion rows.
- **Recordings and drawn first clicks** made the reviews concrete; the user asked for both.
- **Blocked means manual review.** No evasion, and the tools stop at once.

**Δ Changed (in 0.1.0)**
- Hand-written flow and spec files per site → one `study.json` per study (`studio flows`, `firstclick`).
- Playwright turns off PaintHolding and RenderDocument, which froze cross-page view transitions →
  record mode turns them back on.
- `mouse.wheel` hung on a site with scripted smooth scrolling → scroll from inside the page.
- Links that open a new tab can't be followed → `goto` plus `stepsComparable: false`.
- Same-page contact steps showed nothing in the video → `scrollTo`.
- Link checks hit a rate limit (429) → each link once per run, a pause, stop at the first 403/429.

**Δ Open**
- No query tool on the Notion plan, so row counts come from the session's own rows and keyword search.
- Notion file uploads expire within the hour if not attached: write pages promptly after uploading.
- A second, non-portfolio project hasn't been run yet: the presets other than `portfolio` are untested.
- Stage checks and predictions are judgement; nothing has been tested with people yet.
