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
| Tools | `tools/` | the `studio` CLI: capture, record, structure, first clicks, annotations, summary, compare, **graph** (link structure), **themes** (findings across sites), **report** (HTML) |
| Presets | `presets/` | journeys for `portfolio`, `sign-up`, `service-enquiry`, `checkout`, `chatbot-first-moments`, `impact-forecast` |
| Templates | `templates/` | Notion IDs to fill in, and gotchas |
| Docs | `docs/` | the config format, the method in brief, and the retro log |

## Install

```bash
git clone https://github.com/Kugothepup/didactic-eureka.git ~/Documents/research-studio
bash ~/Documents/research-studio/setup.sh                 # Node packages and Playwright's Chromium
claude plugin marketplace add ~/Documents/research-studio  # this repo is its own marketplace
claude plugin install research-studio@research-studio
```

To work on the plugin itself, start Claude Code with the repo loaded directly, so edits apply
without reinstalling: `claude --plugin-dir ~/Documents/research-studio`. After changing the repo,
`claude plugin marketplace update research-studio` refreshes the installed copy.

The knowledge skills the method loads (cognitive-psychology-kb, cognitive-design-review,
ux-expert-assistant, ogilvy-writing-coach, ux-business-impact) are bundled in `skills/`.

**Notion is optional.** With the Notion connector the studio keeps a shared record (study pages, review
pages, a project hub). Without it, run in *local mode*: the commands work from the study folder and
end with a single HTML report (`studio report`). Local mode is the quickest way to try it or demo it.
Setting up Notion means building your own Research Studio hub and filling in `templates/notion.md`.

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

## Local mode: a report with no Notion

```text
/research-studio:new "What do buyers need to see before booking a demo?" https://mysite.com https://rival-a.com   # say "local, no Notion"
/research-studio:capture ST-1
/research-studio:review ST-1         # writes reviews.json instead of Notion pages
/research-studio:synthesise ST-1
node tools/studio.mjs report ~/Documents/studies/ST-1/study.json --embed   # → report-r1.html
```

The report has the measured counts, the journey, every site's screens, video and predicted first
clicks, a stage-by-stage matrix, and the reviews and synthesis in pluses and deltas.

## Link structure (NetworkX)

`studio structure` crawls each site; `studio graph` turns the crawl into a link graph and measures it:
how many clicks from the start page, the goal page's distance by page links, the most-linked-to pages,
clusters, dead ends, and pages you can only reach through the menu. It separates the global menu and
footer from content links, because on a mega-menu site everything is one click from everything. The
report draws it. These are measurements of the pages the crawl reached, not the whole site.

## Themes across sites

`studio themes` groups the pluses and deltas you wrote for each site (`reviews.json`) into themes and
flags the ones worth borrowing: a plus on one site and a delta on another about the same thing. It
matches by wording, not meaning (no ML model to install), so treat it as a first grouping to read and
correct. The report shows it.

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
