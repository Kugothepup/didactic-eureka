---
name: capture
description: "Capture every site in a Research Studio study: routes, journey runs, videos, structure crawls and reference captures, then the measured counts on each Notion row. Use when the user runs /research-studio:capture or asks to capture, record or crawl a study's sites."
argument-hint: "<ST-n or path/to/study.json> [site slug]"
---

# Capture a study

Arguments: $ARGUMENTS. `ST-n` means `~/Documents/studies/ST-n/study.json`. Below, `studio` is
`node ${CLAUDE_PLUGIN_ROOT}/tools/studio.mjs`. Load `research-studio:study-synthesis` first and keep
its rules, especially rule 8 (never sign in, submit or get past a bot check).

1. **Routes.** For each journey site without a `route`: `studio explore <study> --site <s>`, look at
   the first-screen still and the explore JSON, and write the route into `study.json`: one step per
   stage, the click a visitor would most likely make, `goal: true` on the contact step. Note any
   departure from the Brief's journey for the row's Route notes. Show the routes to the user if any
   choice is a judgement call.
2. **Capture:** `studio capture <study>`, `studio reference <study>` (inspiration), `studio record
   <study>`, `studio structure <study>`. Check each video's frames and a few stills by eye before
   trusting them (a contact sheet with ffmpeg is quickest).
3. **Blocked sites:** if a site wrote `blocked.json`, set its row's Capture to
   **Blocked: manual review**, its Stage n to Blocked from the blocked step on, and tell the user.
   Never retry it.
4. **Counts:** `studio summary <study>`, then set each row's Reached goal, Steps to goal, Dead ends,
   Fields asked, Required fields, axe serious + critical, Capture = Captured, Captured on and Repo
   path from the summary. Never type a number that isn't in the summary.
5. **Videos:** upload each journey video and add a "Journey recording" section to the row's page
   with chapter times from `video/journey-video.json`.
6. Delete local copies of uploaded media once they're attached in Notion (keep the JSON).

Finish with Written / Needs you / Not verified, and the next step: `/research-studio:review`.
