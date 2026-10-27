# Changelog

## 0.3.0 · 2026-10-27

- **HTML report:** `studio report` builds one page per round from the capture output: measured counts,
  the journey, each site's screens, video and predicted first clicks, a stage-by-stage matrix, and the
  reviews and synthesis. `--embed` inlines the images into a single file.
- **Local mode:** Notion is now optional. Without it the commands work from the study folder, write
  judgement to `reviews.json` and finish with the report. Shape documented in `docs/config.md`.
- **Bundled knowledge skills:** `cognitive-psychology-kb` and `ux-business-impact`, so the method has
  everything it loads.

## 0.2.0 · 2026-10-25

- **New step:** `question`, an optional way to develop a hunch, topic or frustration into research
  questions before a study (or to rework one mid-study). Claude suggests questions and candidate
  answers; the user says yes, no or edit. Produces a Goal, RQs, beliefs, out of scope, an evidence
  plan, a version trail and a mind-map outline. Always skippable; `new` offers it in one line.
- **Preset:** `chatbot-first-moments`, an observe-only five-stage journey for chatbots and
  conversational agents (from study ST-5).
- **Capture:** `bypassCSP` so axe can run on pages with a strict script policy (Trusted Types). It
  doesn't change the browser identity, and the non-GET guard is unchanged.

## 0.1.0 · 2026-10-15

First version, extracted from a first portfolio study.

- **Plugin:** the `study-synthesis` method and `review-writeup` voice skills, and nine commands:
  `new`, `capture`, `review`, `tasks`, `synthesise`, `hub`, `round`, `promote`, `retro`.
- **Tools:** the `studio` CLI over capture (explore, run, reference, record), structure, first-click
  drawing, annotation, summary and round comparison, driven by one `study.json` per study.
- **Presets:** `portfolio`, `sign-up`, `service-enquiry`, `checkout`.
- **Notion:** the Project hub template; IDs and gotchas in `templates/notion.md`.
- **Safety:** read-only tools, decline-only cookie banners, and "Blocked: manual review" at the first
  bot check or rate limit.
