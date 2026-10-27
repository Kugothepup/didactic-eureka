---
name: retro
description: "Run a pluses-and-deltas retrospective on the Research Studio method itself after a project or round, log it, and propose concrete changes to the plugin's tools, skills, presets or templates on a branch. Use when the user runs /research-studio:retro or asks how the framework could improve."
argument-hint: "[ST-n] [notes]"
---

# Retro on the method

Arguments: $ARGUMENTS. The plugin's source is the git repo at `~/Documents/research-studio`
(GitHub: Kugothepup/turbo-barnacle). Always edit there, never in the installed plugin copy.

1. Look back over the study (and this conversation): where the tools failed or needed workarounds,
   where a check or preset didn't fit, what the user corrected, what took longest.
2. Write the retro in the `review-writeup` shape: **+** what worked (keep), **Δ** what to change, each
   with the evidence (an error, a workaround, a correction) and the change to try.
3. Append it to `docs/retro.md` with the date and study ID.
4. For each Δ the user agrees with: make the change on a branch (`retro/<date>`), note it in
   `CHANGELOG.md`, bump the version in `.claude-plugin/plugin.json` (minor for new behaviour, patch
   for fixes), test it on the study it came from, and open a pull request. Merging is the user's call.
