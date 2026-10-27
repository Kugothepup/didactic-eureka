# study.json

One file per study, in the study's folder (by default `~/Documents/studies/ST-n/study.json`). Every
`studio` command reads it. Start one with `studio init <dir> --id ST-n --preset <name>`; see
the preset files in `presets/` for starting points.

```jsonc
{
  "id": "ST-1",
  "title": "What do hiring managers need to see to shortlist an AI UX designer?",
  "preset": "portfolio",

  // Notion: the study page, its project, and the study's own three tables (from the study page)
  "notion": { "study": "<page id>", "project": "<page id>",
              "competitors": "collection://…", "tests": "collection://…", "forum": "collection://…" },

  "conditions": { "viewport": "1440x900", "locale": "en-GB", "timezone": "Europe/London" },

  // Rounds: each is one dated capture of every site. Output goes to rounds/<id>/<site>/ unless
  // the round sets "dir" (a study's first round uses "." because it predates rounds) or "siteDirs".
  "rounds": [ { "id": "r1", "dir": "rounds/r1", "started": "2026-10-13", "note": "Baseline" } ],
  "currentRound": "r1",

  // The journey every site is walked through (the Notion Brief has the same text)
  "journey": {
    "audience": "…", "endsAt": "…",
    "stages": [ { "n": 1, "slug": "arrive", "name": "Arrive and orient",
                  "task": "You're hiring … What do you do first?",
                  "checks": ["…", "…", "…"] } ]
  },

  "sites": [
    {
      "slug": "my-site",            // folder name
      "name": "example.com (own site)", // as in the Competitors table
      "kind": "own",                        // own | competitor | inspiration
      "url": "https://example.com/",
      "cp": 1,                              // the row's CP number
      "notion": "<row page id>",
      "stepsComparable": true,              // false when the route had to use goto (new-tab links)
      "maxPages": 15,                       // for the structure crawl

      // One step per stage. goto | click (a link by name), with button / text / exact,
      // goal (the contact step), read (scroll one screen in the video),
      // scrollTo (a CSS selector, for a same-page step: the video scrolls to it)
      "route": [
        { "stage": 1, "goto": "https://example.com/" },
        { "stage": 2, "click": "See the work" },
        { "stage": 3, "click": "View case study", "read": true },
        { "stage": 4, "click": "Contact", "exact": true, "goal": true },
        { "stage": 5, "click": "About", "exact": true }
      ],

      // Predicted first clicks to draw. "at" is the index of the route step whose screen the task
      // is asked on. Candidates in order (the first is the predicted first click). A locator is
      // one of link | button | text | css, with exact and nth; side: "right" for dense lists.
      "firstClicks": [
        { "stage": 1, "at": 0, "contested": false, "candidates": [
          { "name": "Work in the header", "link": "Work", "exact": true, "likelihood": "likely" },
          { "name": "See the work", "link": "See the work", "likelihood": "possible" } ] },
        { "stage": 3, "at": 2, "absent": true, "candidates": [] }
      ]
    }
  ],

  // "Find X" tasks, recorded with `studio record --tasks`
  "tasks": [
    { "slug": "t1-find-email", "site": "my-site",
      "task": "Find his email. You're reading one of his case studies.",
      "rightAnswer": "The contact section",
      "steps": [ { "slug": "start", "goto": "https://example.com/projects/…/" },
                 { "slug": "contact", "click": "Contact", "exact": true, "goal": true } ] }
  ],

  // shots.json files for `studio annotate`, relative to the study folder
  "annotations": [ "my-site/annotated/shots.json" ]
}
```

## Output, per site and round

| Path | From | What |
|---|---|---|
| `flow.json` | `flows` | the generated journey (route + stage tasks) |
| `explore/` | `explore` | the start page mapped |
| `01-…-fold.png`, `-full.png`, `01-….json`, `journey.json` | `capture` | stills, structure, axe and links per step; the run summary |
| `blocked.json` | any | written when a bot check or rate limit stopped the tool |
| `reference.json` | `reference` | inspiration capture: look, reading measures, axe |
| `video/journey.mp4`, `journey-video.json` | `record` | the journey video and its chapters |
| `tasks/<slug>/` | `record --tasks` | each "find X" video |
| `structure/structure.json` | `structure` | the page-structure crawl |
| `firstclick/` | `firstclick` | per-stage screens and the composed image |
| `<round>/summary.json` | `summary` | the counts for the Notion rows |
| `compare-<a>-<b>.md` | `compare` | measured changes between rounds |
| `report-<round>.html` | `report` | the whole round as one HTML page (no Notion needed) |

Uploaded media can be deleted locally once it's attached in Notion; keep the JSON so everything can
be rebuilt.

## reviews.json and the HTML report

`studio report <study.json> [--round r] [--embed] [--out file.html] [--reviews file.json]` builds one
HTML page from the capture output. With no `reviews.json` it shows measured evidence only. To add
judgement without Notion, write `reviews.json` beside `study.json`:

```jsonc
{
  "synthesis": {
    "status": "Draft: a proxy for user testing",       // optional
    "summary": "One or two sentences.",
    "pluses": [ { "title": "What to keep", "why": "Because…" } ],
    "deltas": [ { "title": "What to try", "why": "Because…" } ]
  },
  "sites": {
    "my-site": {                                        // the site's slug
      "take": "One-line take.",
      "stages": {
        "1": { "score": "Partly",                       // Yes | Partly | No | Absent | Blocked
               "checks": [ { "check": "…", "result": "yes", "evidence": "…" } ],  // yes | partly | no
               "note": "optional" }
      },
      "pluses": [ { "title": "…", "why": "…" } ],
      "deltas": [ { "title": "…", "why": "…" } ]
    }
  }
}
```

Images are linked by default, so keep the HTML where it can reach the study folder (the default is
the study folder itself). `--embed` inlines the images for a single file you can email; videos stay
linked.
