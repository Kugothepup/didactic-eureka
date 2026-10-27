---
name: round
description: "Run a new capture round on a Research Studio study after changes, and compare it with the last round: re-capture, re-record, re-crawl, measured differences, re-judged stage checks, and the hub updated. Use when the user runs /research-studio:round or asks to re-check sites after changes or measure whether a change worked."
argument-hint: "<ST-n or study.json> [round id, e.g. r2] [site slug]"
---

# New round

Arguments: $ARGUMENTS. Load `research-studio:study-synthesis` (see its Rounds section). `studio` is
`node ${CLAUDE_PLUGIN_ROOT}/tools/studio.mjs`.

1. Add the round to `study.json` (`{"id": "r2", "started": "<today>", "note": "<what changed>"}`) and
   set `currentRound`. Ask what changed since the last round if the user hasn't said (a merged pull
   request, a redesign, a competitor relaunch).
2. `studio capture`, `studio record`, `studio structure`, `studio firstclick` for the sites that
   matter (all, or `--site`).
3. `studio compare <study> <previous> <new>`: the measured differences. Check by eye what the numbers
   can't show (the stills and videos side by side).
4. Re-judge the stage checks against the new evidence; on each row say which round its scores come
   from, and keep the previous round's lines under a "Round rN" heading rather than deleting them.
5. Check each recommendation's "How we'd know" against the new evidence, and say plainly whether the
   measure moved, didn't, or can't be told without tests with people.
6. Add a "Rounds" section to the hub. Finish with Written / Needs you / Not verified.
