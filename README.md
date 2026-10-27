# Research Studio

A Claude Code plugin for evidence-led UX reviews. It captures your site and your competitors along the
same journey, records what a visitor sees, predicts and draws first clicks, writes reviews in pluses
and deltas, synthesises the evidence in Notion, and re-runs in rounds so you can show what changed.

It works for any project: pick a journey preset, list
the sites, and run the commands.

## What's in it

| Part | Where | What it does |
|---|---|---|
| Commands | `skills/<command>/` | `/research-studio:new`, `question` (optional), `capture`, `review`, `tasks`, `synthesise`, `hub`, `round`, `promote`, `retro` |
| Method | `skills/study-synthesis/` | the rules and steps every command follows |
| Voice | `skills/review-writeup/` | pluses before deltas, calibrated not absolute |
| Tools | `tools/` | the `studio` CLI: capture, record, structure, first clicks, annotations, summary, compare |
| Presets | `presets/` | journeys for `portfolio`, `sign-up`, `service-enquiry`, `checkout` |
| Templates | `templates/` | Notion IDs to fill in, and gotchas |
| Docs | `docs/` | the config format, the method in brief, and the retro log |

## Install

```bash
git clone git@github.com:Kugothepup/didactic-eureka.git ~/Documents/research-studio
bash ~/Documents/research-studio/setup.sh                 # Node packages and Playwright's Chromium
claude plugin marketplace add ~/Documents/research-studio  # this repo is its own marketplace
claude plugin install research-studio@research-studio
```

To work on the plugin itself, start Claude Code with the repo loaded directly, so edits apply
without reinstalling: `claude --plugin-dir ~/Documents/research-studio`. After changing the repo,
`claude plugin marketplace update research-studio` refreshes the installed copy.

The commands also need the Notion connector, and the knowledge skills the method loads
(cognitive-psychology-kb, cognitive-design-review, ux-expert-assistant, ogilvy-writing-coach,
ux-business-impact).

## A project, start to finish

```text
/research-studio:new "What do buyers need to see before booking a demo?" https://mysite.com https://rival-a.com https://rival-b.com
/research-studio:capture ST-4        # routes, journey runs, videos, structure, counts on the Notion rows
/research-studio:review ST-4         # stage checks, reviews, first clicks drawn, annotated screens
/research-studio:tasks ST-4          # optional: "find X" tasks, recorded
/research-studio:synthesise ST-4     # the Draft synthesis, then the project hub
/research-studio:promote ST-4        # after you tick the findings you accept
… make changes …
/research-studio:round ST-4 r2       # re-capture and compare with round 1
/research-studio:retro ST-4          # pluses and deltas on the method; changes go on a branch
```

You can also talk to Claude normally ("review these three sites for ST-4"); the commands make the
steps repeatable.

## Rules the tools keep

- Read-only: they navigate and click links, never sign in, submit a form or send anything.
- Never get past a bot check, and never disguise the tools to avoid one. A blocked site stops at
  once and is marked **Blocked: manual review** for you to visit.
- Cookie banners are declined, never accepted. Each link is checked once per run, with a pause.
- Numbers on the Notion rows come from `studio summary`, never from reading screenshots.

## The CLI

```bash
node tools/studio.mjs help
node tools/studio.mjs status ~/Documents/studies/ST-1/study.json
```

See `docs/config.md` for `study.json`.
