---
name: hub
description: "Build or refresh a Research Studio project's hub page in Notion: where everything is, the side-by-side stage table with pluses and deltas, the synthesis in brief, every journey video and first-click image, and next steps. Use when the user runs /research-studio:hub or asks to pull a project together in one place."
argument-hint: "<ST-n or project name>"
---

# Project hub

Arguments: $ARGUMENTS. The hub is the study's Project page (`notion.project` in `study.json`). Load
`research-studio:review-writeup`. Sections, in order:

1. **Where everything is:** the study, the user's site (review and page structure), competitors,
   inspiration, and code (repo, open pull requests).
2. **Side by side:** stage scores per site (from the rows' Stage selects), and one + and one Δ per site.
3. **What the comparison suggests:** keep / gaps / changes to try, from the synthesis (say it's Draft).
4. **Journey recordings** and **Predicted first clicks:** every site. Re-embed media by copying the
   `notion-file-block://` references from the review pages (fetch them); Notion copies the file.
5. **Next steps:** the user's calls, accepting findings, tests with people, open pull requests.
6. **Rounds** (once there's more than one): what changed between rounds, from `studio compare`.

Replace the page content when building it the first time; afterwards update sections in place.
Fetch the page after writing to check the media attached.
