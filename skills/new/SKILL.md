---
name: new
description: "Start a new Research Studio study: the Notion project and study from the templates, the competitor rows, and a local study folder with study.json from a journey preset. Use when the user runs /research-studio:new or asks to set up a new study, project or competitor review from scratch."
argument-hint: "<study question or project name> [own site URL] [competitor URLs…]"
---

# New study

Arguments: $ARGUMENTS

Load `research-studio:study-synthesis` (the method) first. Ask only for what's missing, in one go:

1. **Project:** an existing Project in Notion, or a new one (name, client, goal).
2. **The study question** (it becomes the study's title), and draft Goal and RQs you can propose.
   First offer the optional `research-studio:question` step in one line ("I have my questions", "a
   topic" or "a hunch"). If they have their questions, or say skip, carry on at once. If they used
   it, take the Goal, RQs, beliefs, out of scope and evidence plan from it and skip drafting.
3. **Preset:** `portfolio`, `sign-up`, `service-enquiry` or `checkout` (`ls ${CLAUDE_PLUGIN_ROOT}/presets`).
   Show the preset's five stages, task prompts and checks, and say they can be edited before the first capture.
4. **Sites:** the user's own site, competitors (3 to 5 is a good number), and any inspiration sites.
5. **Beliefs going in,** or confirm it's a discovery study (no beliefs).

**No Notion?** Use local mode (see the method's **Local mode**): skip the Notion section below, run
`studio init`, and add the sites to `study.json`.

## Notion (IDs in `${CLAUDE_PLUGIN_ROOT}/templates/notion.md`)
- **Project:** if new, duplicate the Project hub template into Projects and fill Name, Client, Goal.
- **Study:** duplicate the Study template, rename it to the question, link the Project, set Goal and RQs
  (drafts), write the Brief (who, beliefs or "none stated: discovery study", out of scope) and replace
  the journey table with the preset's stages.
- Fetch the new study page and take its three tables' data-source IDs from it (never from memory).
- **Competitors rows:** one per site. Kind (Own site, Competitor, Inspiration), URL, Own site ticked
  for the user's, Capture = To capture, Status Draft, Proposed by AI.

## Local
- `node ${CLAUDE_PLUGIN_ROOT}/tools/studio.mjs init ~/Documents/studies/<ST-n> --id <ST-n> --preset <name> --title "<question>"`
- Fill `study.json`: the `notion` IDs (study, project, the three data sources), and `sites` (slug,
  name, kind, url, the row's page ID as `notion`, its CP number as `cp`). Leave routes empty; the
  capture command writes them. Copy the journey's final wording from the Notion Brief if it was edited.

## Finish
Links to the project, the study and the folder, and the next step: `/research-studio:capture <ST-n>`.
Record the new study in memory (project, study ID, folder).
