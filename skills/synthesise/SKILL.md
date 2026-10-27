---
name: synthesise
description: "Write a Research Studio study's Synthesis section as a Draft: readiness check, evidence used, findings with sources and confidence, beliefs checked, compared by stage, recommendations as deltas, and open questions; then refresh the project hub. Use when the user runs /research-studio:synthesise or asks to synthesise a study."
argument-hint: "<ST-n or study page URL>"
---

# Synthesise

Arguments: $ARGUMENTS. Load `research-studio:study-synthesis` and `research-studio:review-writeup`,
then follow the method's **Check readiness** and **Synthesise** modes exactly. Discovery studies (no
beliefs) are fine: say so under Beliefs checked. Counts come from rows created or fetched in this
session and keyword searches of each table, stated in Evidence used.

**Local mode (no Notion):** write the Draft synthesis into `reviews.json` under `synthesis`, then run
`studio report <study>`; there is no hub to refresh.

Afterwards refresh the Project hub (`research-studio:hub`) with the synthesis in brief.
