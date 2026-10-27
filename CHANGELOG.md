# Changelog

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

First version, extracted from study ST-3.

- **Plugin:** the `study-synthesis` method and `review-writeup` voice skills, and nine commands:
  `new`, `capture`, `review`, `tasks`, `synthesise`, `hub`, `round`, `promote`, `retro`.
- **Tools:** the `studio` CLI over capture (explore, run, reference, record), structure, first-click
  drawing, annotation, summary and round comparison, driven by one `study.json` per study.
- **Presets:** `portfolio`, `sign-up`, `service-enquiry`, `checkout`.
- **Notion:** the Project hub template; IDs and gotchas in `templates/notion.md`.
- **Safety:** read-only tools, decline-only cookie banners, and "Blocked: manual review" at the first
  bot check or rate limit.
