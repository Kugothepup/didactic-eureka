---
name: tasks
description: "Set up and record 'find X' tasks on a Research Studio study's sites: task flows with right answers, recordings with clicks counted, and predicted-journey rows. Use when the user runs /research-studio:tasks or asks whether visitors can find something on a site."
argument-hint: "<ST-n or study.json> [\"find …\" tasks]"
---

# "Find X" tasks

Arguments: $ARGUMENTS. Load `research-studio:study-synthesis` first. `studio` is
`node ${CLAUDE_PLUGIN_ROOT}/tools/studio.mjs`.

1. **Tasks:** take them from the arguments, or propose 3 to 5 from the study question and the preset's
   `exampleTasks`. Each needs a start page, the right answer (the user's call; propose one) and the
   route a visitor would most likely take.
2. Add them to `study.json` under `tasks` (slug, site, task, rightAnswer, steps), then
   `studio record <study> --tasks`. Check each video's last frame by eye: did the route reach the
   answer, and is the answer actually there?
3. Write one TK row per task: Type Journey, Evidence Predicted (judgement), Success looks like = the
   right answer, the predicted route and its alternatives, and the scripted result in Notes (clicks
   from `journey-video.json`). Recording length includes pauses, so it isn't a task time.
4. Add a "Scripted routes" section (table plus videos) to the site's page-structure or review page,
   and say plainly these show the designed path works, not what people would do.
