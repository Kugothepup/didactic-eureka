---
name: review
description: "Review every captured site in a Research Studio study: stage checks, the expert review of the user's own site, competitor and inspiration reviews in pluses and deltas, predicted first clicks drawn on the screens, and annotated screens, all written to Notion. Use when the user runs /research-studio:review or asks to review, score or annotate a study's sites."
argument-hint: "<ST-n or study.json> [site slug]"
---

# Review a study's sites

Arguments: $ARGUMENTS. Load `research-studio:study-synthesis` and `research-studio:review-writeup`
first, plus the knowledge skills the method names (cognitive-psychology-kb, cognitive-design-review,
ux-expert-assistant, ogilvy-writing-coach, ux-business-impact). `studio` is
`node ${CLAUDE_PLUGIN_ROOT}/tools/studio.mjs`.

**Local mode (no Notion):** write the stage checks, reviews and first-click predictions into
`reviews.json` and `study.json` instead of Notion, then run `studio report <study>`.

For each site with capture evidence (never from memory):
1. **Stage checks:** three yes/no checks per stage with one line of evidence each; Absent and Blocked
   are not zeros. Set the Stage selects.
2. **The review page:** for the user's own site, the full expert review (lenses, cognitive audit table,
   inclusive pass, business impact, vocabulary map, tests, your calls). For competitors and
   inspiration, pluses = worth borrowing, deltas = what we'd do differently if we borrowed it, plus a
   short cognitive analysis. Fill Take and Do differently on the row.
3. **First clicks:** predict per stage (label match, salience, affordance, competition), write the TK
   rows (Predicted (judgement), Contested where it applies), add the same candidates to the site's
   `firstClicks` in `study.json`, run `studio firstclick`, check the image by eye, upload it to a
   "First click (predicted)" section.
4. **Annotated screens:** a `shots.json` per site, `studio annotate`, check every tag by eye (no tag
   over the content it points at), upload with the caption lists.
5. Delete local copies of uploaded media once attached.

Then refresh the hub (`research-studio:hub`). Finish with Written / Needs you / Not verified.
