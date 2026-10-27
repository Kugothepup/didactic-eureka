---
name: review-writeup
description: "House style for every review write-up: expert reviews, audits, competitor and inspiration reviews, study synthesis, critique notes, annotated screens, Notion review pages, and review summaries in chat. Sets the tone (calibrated, never absolute) and the shape (pluses and deltas: + what's working and why, Δ what we'd change and why). Use whenever writing up or rewriting findings about a design, site, product, prototype, case study or piece of writing, including when another skill (cognitive-design-review, ux-expert-assistant, study-synthesis, ogilvy-writing-coach, accessibility-audit) produces the findings. Also use when the user says 'write it up', 'pluses and deltas', 'plus/delta', 'tone it down', 'too absolute', or asks for a review in their voice."
---

# Review write-up: calibrated tone, pluses and deltas

Every review is written as **pluses and deltas**, in a tone that claims only what the evidence
supports. Other skills decide *what* the findings are. This skill decides *how they're written*.
When a sibling skill has its own output format (a severity table, an audit report), keep its
content and write it in this shape and tone.

## Pluses and deltas

- **+ Plus:** something that's working, with why it works, so it survives the next change.
  It must be specific and evidenced, never filler praise. "The case study's first screen states
  the role and the outcome" is a plus. "Nice design" isn't.
- **Δ Delta:** something we'd change. A delta means *change*, not *minus*: write it as the change
  to try, not as the fault. The title is a verb phrase ("Bring the reframe into the summary"),
  not a verdict ("The strongest evidence is buried").

Pluses come first. They tell the reader what to protect before they read what to change.

## Tone: calibrated, not absolute

The confidence of each sentence matches the evidence behind it. Calibrated isn't timid: a
measured fact is stated plainly, and only interpretation and prediction are hedged.

| Evidence | How to write it | Example |
|---|---|---|
| **measured** (counted by a tool, a test with people) | Plainly, with the number and the standard | "The label is 2.55:1, under the 4.5:1 WCAG AA asks for." |
| **inferred** (derived by a stated rule) | "suggests", "points to", "is consistent with" | "Three names for one section suggests the scent weakens between link and page." |
| **judgement** (expert or AI view) | "likely", "may", "could", "in our view", "worth testing" | "Skimmers may not reach the reframe; worth a 60-second skim test." |

**Words to swap:**

| Instead of | Write |
|---|---|
| fails, broken, wrong, bad, poor, weak | describe the behaviour: "crops with Reduce Motion on", "links to github.com, not a profile" |
| users will / visitors won't | visitors are likely to / may not |
| always, never, everyone, no one, all users | often, rarely, most, few, or the actual count |
| must, need to, should (as an order) | consider, we'd suggest, worth trying; keep "must" for legal or standards duties, and cite them |
| proves, confirms, guarantees | supports, is consistent with, points to |
| clearly, obviously, simply, just | drop the word |
| the problem is | the change that may help most is |
| critical (as a label) | High priority, then say what happens if it stays |

**Hold to these:**
- One hedge per claim, placed where the uncertainty is. Never stack them ("might possibly perhaps").
- Write about the work, not the person: "the page", "the case study", not "you forgot".
- The owner makes the taste and positioning calls. Offer options and say "your call" where it is.
- Name who is affected and when ("for someone skimming on a phone", "with Reduce Motion on").
  A condition makes a claim smaller and truer.
- Principles carry their status from cognitive-psychology-kb: robust ones can be cited plainly,
  qualified or contested ones get their caveat in the same sentence.
- British spelling, plain words, short sentences.

## Priority for deltas

Deltas carry a priority, not a severity: **High**, **Medium** or **Low**. When a sibling skill
rates severity, translate it:

| Sibling severity | Delta priority |
|---|---|
| 🔴 Critical, 🟠 Major | High |
| 🟡 Moderate | Medium |
| 🔵 Minor | Low |
| ⚪ Good / strength | a plus |

When in doubt, rank lower. A page that's all High teaches nobody what to do first.

## Shape of a review write-up

```
**Context:** what was reviewed, when, how (tools, conditions), and what the evidence can and
can't say.
**Overall read:** one or two sentences: the plus most worth keeping, and the delta that may help most.

### Pluses (+)
- **+1 · [what works]:** the evidence, and why it likely works (principle). Keep it through changes.

### Deltas (Δ), highest priority first
**Δ1 · High · measured: [the change, as a verb phrase]**
- **Seen:** what we observed, with the number, the screen or the quote.
- **Why it may matter:** the principle (researcher, year, caveat) and who it affects.
- **Change to try:** one or two options. Say "your call" where it's taste.
- **How we'd know:** the metric, or the smallest test that would settle it.

### To test with people
### Your calls (decisions only the owner can make)
### Not verified
```

**Short forms** (table cells, Notion properties, captions, chat):
- `+ One filled primary beside a quiet secondary; both labels name the visitor's goal`
- `Δ Give the primary label enough contrast to read without relying on colour (2.55:1 now)`

For a third-party site (competitor or inspiration), pluses are what's worth borrowing and deltas
are what we'd do differently if we borrowed it. Never write a delta as advice to the other site.

**Annotated screens** (`node ${CLAUDE_PLUGIN_ROOT}/tools/studio.mjs annotate <study.json> <shots.json>`): set `sev` to `plus`, `high`,
`medium`, `low` or `delta` (a delta with no priority, used for third-party sites). Start each note
with its ID (`+2 · …`, `Δ3 · …`) so the tag on the image matches the write-up. The script draws `+`,
`Δ3 · Medium` and so on, and writes the full wording to `captions.json`.

## Worked example

**Before** (absolute, fault-first):
> **F3 · 🟡 Moderate: your strongest evidence is buried.** Hiring managers won't scroll 12,838px.
> The Outcome box fails to mention the reframe. You must move it to the top.

**After** (calibrated, change-first):
> **Δ3 · Medium · judgement, page length measured: Bring the reframe into the summary**
> - **Seen:** the reframe (asked for a routing fix, implemented a redesign of how the AI behaves) is
>   in "07 — Outcome", at the end of a 12,838px page. The Outcome box at the top says the
>   specification was adopted.
> - **Why it may matter:** screeners tend to skim and stop early (Paradox of the Active User,
>   Carroll & Rosson, 1987). Many may not reach chapter 07, and the reframe is the kind of judgement
>   senior roles screen for.
> - **Change to try:** one line in the summary or the Outcome box. The wording is your call.
> - **How we'd know:** after a 60-second skim, testers can say what changed because of the work.

## Rewriting existing write-ups

Don't rewrite past pages unless asked. When asked:
- Keep every fact, ID, number and citation. Change only the shape and the tone.
- Add a dated line at the top saying the page was rewritten as pluses and deltas.
- Show each delta's old severity once, in brackets ("High (was Major)"), so nothing is quietly
  downgraded.
