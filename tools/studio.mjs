#!/usr/bin/env node
// Research Studio CLI: runs every capture step for a study from one config file (study.json).
// All tools are read-only: they navigate and click links, never sign in, submit a form or get past a
// bot check. A site that shows a bot check or rate limit stops at once and is marked
// "Blocked: manual review". See docs/config.md for the study.json format.
//
//   studio init <dir> --id ST-n --preset <name> [--title "..."]
//   studio status    <study.json>
//   studio flows     <study.json> [--round r] [--site s]
//   studio explore   <study.json> [--round r] [--site s]
//   studio capture   <study.json> [--round r] [--site s]
//   studio reference <study.json> [--round r] [--site s]
//   studio record    <study.json> [--round r] [--site s] [--tasks]
//   studio structure <study.json> [--round r] [--site s] [--max 15]
//   studio firstclick <study.json> [--round r] [--site s]
//   studio annotate  <study.json> <shots.json> [--round r] [--out dir]
//   studio summary   <study.json> [--round r]
//   studio report    <study.json> [--round r] [--embed] [--out file.html] [--reviews file.json]
// Any capture command takes --viewport 390x844 for a phone-width pass.
//   studio compare   <study.json> <roundA> <roundB>
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const TOOLS = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.dirname(TOOLS);
const [cmd, ...rest] = process.argv.slice(2);
const flags = {}; const args = [];
for (let i = 0; i < rest.length; i++) {
  if (rest[i].startsWith("--")) { const k = rest[i].slice(2); const v = rest[i + 1] && !rest[i + 1].startsWith("--") ? rest[++i] : true; flags[k] = v; }
  else args.push(rest[i]);
}
const die = (m, code = 2) => { console.error(m); process.exit(code); };
const readJSON = (f) => JSON.parse(fs.readFileSync(f, "utf8"));
const writeJSON = (f, o) => { fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, JSON.stringify(o, null, 1) + "\n"); };
const exists = (f) => fs.existsSync(f);

if (!cmd || cmd === "help" || cmd === "--help") {
  console.log(fs.readFileSync(fileURLToPath(import.meta.url), "utf8").split("\n").slice(1, 20).map((l) => l.replace(/^\/\/ ?/, "")).join("\n"));
  process.exit(0);
}

// ── init: a new study.json from a journey preset ──
if (cmd === "init") {
  const dir = args[0] || die("usage: studio init <dir> --id ST-n --preset <name> [--title ...]");
  const presetName = flags.preset || "portfolio";
  const presetFile = path.join(ROOT, "presets", `${presetName}.json`);
  if (!exists(presetFile)) die(`No preset "${presetName}". Available: ${fs.readdirSync(path.join(ROOT, "presets")).map((f) => f.replace(".json", "")).join(", ")}`);
  const preset = readJSON(presetFile);
  const out = path.join(dir, "study.json");
  if (exists(out) && !flags.force) die(`${out} already exists (use --force to overwrite)`);
  const today = new Date().toISOString().slice(0, 10);
  writeJSON(out, {
    id: flags.id || "ST-?", title: flags.title || "", preset: presetName,
    notion: { study: "", project: "", competitors: "", tests: "", forum: "" },
    conditions: { viewport: "1440x900", locale: "en-GB", timezone: "Europe/London" },
    rounds: [{ id: "r1", dir: "rounds/r1", started: today, note: "Baseline" }], currentRound: "r1",
    journey: preset.journey,
    sites: [{ slug: "own-site", name: "Your site (own site)", kind: "own", url: "https://example.com/", notion: "",
      route: preset.journey.stages.map((s, i) => (i === 0 ? { stage: s.n, goto: "https://example.com/" } : { stage: s.n, click: "TODO: link text" })) }],
    tasks: [],
  });
  console.log(`Wrote ${out} from the "${presetName}" preset. Next: fill in the sites and their routes, then run "studio flows".`);
  process.exit(0);
}

// ── everything else needs a study ──
const studyFile = path.resolve(args[0] || die(`usage: studio ${cmd} <study.json> ...`));
const study = readJSON(studyFile);
const studyDir = path.dirname(studyFile);
const roundOf = (id) => study.rounds.find((r) => r.id === id) || die(`No round "${id}" in ${studyFile}`);
const round = roundOf(flags.round || study.currentRound);
const roundDir = (r) => path.resolve(studyDir, r.dir ?? path.join("rounds", r.id));
const siteDir = (site, r = round) => path.resolve(studyDir, r.siteDirs?.[site.slug] ?? path.join(r.dir ?? path.join("rounds", r.id), site.slug));
const pick = (pred) => study.sites.filter((s) => (!flags.site || s.slug === flags.site) && pred(s));
const journeySites = () => pick((s) => s.kind !== "inspiration" && s.route?.length);
const stageOf = (n) => study.journey.stages.find((s) => s.n === n);
const env = () => {
  const c = study.conditions || {};
  // --viewport 390x844 overrides the study's screen size for one run (e.g. the phone pass).
  return { ...process.env, VIEWPORT: flags.viewport || c.viewport || "1440x900", LOCALE: c.locale || "en-GB", TIMEZONE: c.timezone || "Europe/London" };
};
const needDeps = () => {
  if (!exists(path.join(TOOLS, "node_modules", "playwright"))) die(`Tools aren't installed yet. Run:\n  bash ${path.join(ROOT, "setup.sh")}`, 3);
};
const run = (script, scriptArgs, extraEnv = {}) => {
  console.error(`\n▶ ${script} ${scriptArgs.map((a) => (/^https?:/.test(a) || !path.isAbsolute(a) ? a : path.relative(process.cwd(), a) || a)).join(" ")}`);
  const r = spawnSync(script.endsWith(".py") ? "python3" : "node", [path.join(TOOLS, script), ...scriptArgs], { stdio: "inherit", cwd: TOOLS, env: { ...env(), ...extraEnv } });
  return r.status;
};
const blockedIn = (dir) => (exists(path.join(dir, "blocked.json")) ? readJSON(path.join(dir, "blocked.json")) : null);

// flow.json for each site's journey, from its route plus the journey's stage tasks
const writeFlows = () => {
  const written = [];
  for (const s of journeySites()) {
    const steps = s.route.map((st) => {
      const stage = stageOf(st.stage);
      return { ...(stage ? { stage: st.stage, slug: stage.slug, task: stage.task } : {}), ...st };
    });
    const f = path.join(siteDir(s), "flow.json");
    writeJSON(f, { site: s.name, start: s.url, steps });
    written.push(f);
  }
  for (const t of study.tasks || []) {
    const s = study.sites.find((x) => x.slug === t.site);
    if (!s || (flags.site && s.slug !== flags.site)) continue;
    const f = path.join(siteDir(s), "tasks", t.slug, "flow.json");
    writeJSON(f, { site: s.name, task: t.task, rightAnswer: t.rightAnswer, steps: t.steps });
    written.push(f);
  }
  return written;
};

switch (cmd) {
  case "flows": {
    const w = writeFlows();
    console.log(w.map((f) => "wrote " + path.relative(studyDir, f)).join("\n") || "No sites with a route (add a route to each site in study.json).");
    break;
  }
  case "explore": {
    needDeps();
    for (const s of pick(() => true)) run("capture.mjs", ["explore", s.url, path.join(siteDir(s), "explore")]);
    break;
  }
  case "capture": {
    needDeps(); writeFlows();
    for (const s of journeySites()) {
      const d = siteDir(s);
      const code = run("capture.mjs", ["run", path.join(d, "flow.json"), d]);
      const b = blockedIn(d);
      console.log(`${s.slug}: ${b ? `${b.status} (${b.reason})` : code === 0 ? "captured" : `failed (exit ${code})`}`);
    }
    break;
  }
  case "reference": {
    needDeps();
    for (const s of pick((x) => x.kind === "inspiration")) run("capture.mjs", ["reference", s.url, siteDir(s)]);
    break;
  }
  case "record": {
    needDeps(); writeFlows();
    for (const s of journeySites()) run("capture.mjs", ["record", path.join(siteDir(s), "flow.json"), path.join(siteDir(s), "video")]);
    if (flags.tasks) for (const t of study.tasks || []) {
      const s = study.sites.find((x) => x.slug === t.site); if (!s || (flags.site && s.slug !== flags.site)) continue;
      const d = path.join(siteDir(s), "tasks", t.slug);
      run("capture.mjs", ["record", path.join(d, "flow.json"), d]);
    }
    break;
  }
  case "structure": {
    needDeps();
    for (const s of pick(() => true)) run("structure.mjs", [s.url, path.join(siteDir(s), "structure"), String(flags.max || s.maxPages || 15)]);
    break;
  }
  case "firstclick": {
    needDeps(); writeFlows();
    for (const s of journeySites().filter((x) => x.firstClicks?.length)) {
      const d = path.join(siteDir(s), "firstclick");
      writeJSON(path.join(d, "spec.json"), { flow: "../flow.json", stages: s.firstClicks.map((st) => ({ file: `stage${st.stage}.png`, ...st })) });
      if (run("firstclick.mjs", [path.join(d, "spec.json"), d]) === 0) run("compose_firstclick.py", [siteDir(s)]);
    }
    break;
  }
  case "annotate": {
    needDeps();
    const shots = path.resolve(args[1] || die("usage: studio annotate <study.json> <shots.json> [--out dir]"));
    run("annotate.mjs", [path.resolve(flags.out || path.dirname(shots)), shots]);
    break;
  }
  case "summary": {
    const out = summarise(round);
    writeJSON(path.join(roundDir(round), "summary.json"), out);
    console.log(table(out.sites, ["slug", "kind", "capture", "reachedGoal", "stepsToGoal", "deadEnds", "fieldsAsked", "requiredFields", "axeSeriousCritical", "pagesCrawled"]));
    console.log(`\nwrote ${path.relative(studyDir, path.join(roundDir(round), "summary.json"))}`);
    break;
  }
  case "report": {
    // One HTML file for the round: no Notion needed. Judgement (reviews, stage scores) comes from
    // reviews.json beside study.json when it exists; otherwise the report is measured evidence only.
    const summary = summarise(round);
    writeJSON(path.join(roundDir(round), "summary.json"), summary);
    const rf = path.resolve(typeof flags.reviews === "string" ? flags.reviews : path.join(studyDir, "reviews.json"));
    const out = path.resolve(typeof flags.out === "string" ? flags.out : path.join(studyDir, `report-${round.id}.html`));
    const { buildReport } = await import("./report.mjs");
    const html = buildReport({ study, baseDir: path.dirname(out), round, summary, siteDir: (s) => siteDir(s), reviews: exists(rf) ? readJSON(rf) : null, embed: !!flags.embed });
    fs.writeFileSync(out, html);
    console.log(`wrote ${path.relative(process.cwd(), out)} (${(html.length / 1024).toFixed(0)} KB${flags.embed ? ", images embedded" : ", images linked: keep it beside the study folder"})${exists(rf) ? "" : "\nNo reviews.json found: measured evidence only."}`);
    break;
  }
  case "compare": {
    const [a, b] = [roundOf(args[1] || die("usage: studio compare <study.json> <roundA> <roundB>")), roundOf(args[2] || die("usage: studio compare <study.json> <roundA> <roundB>"))];
    const A = summarise(a), B = summarise(b);
    const rows = [];
    for (const s of study.sites) {
      const x = A.sites.find((r) => r.slug === s.slug) || {}, y = B.sites.find((r) => r.slug === s.slug) || {};
      for (const k of ["reachedGoal", "stepsToGoal", "deadEnds", "fieldsAsked", "axeSeriousCritical", "pagesCrawled"]) {
        if (JSON.stringify(x[k]) !== JSON.stringify(y[k])) rows.push({ site: s.slug, measure: k, [a.id]: x[k] ?? "—", [b.id]: y[k] ?? "—" });
      }
    }
    const md = `# ${study.id}: ${a.id} → ${b.id} (measured)\n\nOnly what changed. Stage scores are judgement and live in Notion.\n\n${rows.length ? table(rows, ["site", "measure", a.id, b.id], true) : "No measured differences."}\n`;
    const f = path.join(studyDir, `compare-${a.id}-${b.id}.md`); fs.writeFileSync(f, md);
    console.log(md + `\nwrote ${path.relative(studyDir, f)}`);
    break;
  }
  case "status": {
    for (const r of study.rounds) {
      console.log(`\n${r.id}${r.id === study.currentRound ? " (current)" : ""}: ${path.relative(studyDir, roundDir(r)) || "."}`);
      const rows = study.sites.map((s) => {
        const d = siteDir(s, r); const has = (f) => (exists(path.join(d, f)) ? "✓" : "·");
        return { site: s.slug, kind: s.kind, flow: has("flow.json"), run: has("journey.json"), reference: has("reference.json"), video: has("video/journey-video.json"), structure: has("structure/structure.json"), firstclick: has("firstclick/firstclick.json"), blocked: blockedIn(d) ? "BLOCKED" : "" };
      });
      console.log(table(rows, ["site", "kind", "flow", "run", "reference", "video", "structure", "firstclick", "blocked"]));
    }
    break;
  }
  default: die(`Unknown command "${cmd}". Run "studio help".`);
}

// Counts for the Notion rows, computed from the capture output (code counts, you label).
function summarise(r) {
  const sites = [];
  for (const s of study.sites) {
    const d = siteDir(s, r); const row = { slug: s.slug, kind: s.kind };
    const b = blockedIn(d);
    if (exists(path.join(d, "journey.json"))) {
      const j = readJSON(path.join(d, "journey.json"));
      row.reachedGoal = j.reachedGoal || (j.goalStep ? "Yes" : null);
      row.stepsToGoal = s.stepsComparable === false ? null : j.clicksToGoal;
      row.deadEnds = (j.deadEnds || []).length;
      const forms = new Map(); let axe = new Map();
      for (const f of fs.readdirSync(d).filter((x) => /^\d\d-.*\.json$/.test(x))) {
        const st = readJSON(path.join(d, f)); const url = (st.url || "").split("#")[0].replace(/\/$/, "");
        for (const fm of st.forms || []) for (const fl of fm.fields) forms.set(`${url}|${fl.label}|${fl.type}`, fl.required);
        axe.set(url, Math.max(axe.get(url) || 0, st.axe?.seriousOrCritical || 0));
      }
      row.fieldsAsked = forms.size; row.requiredFields = [...forms.values()].filter(Boolean).length;
      row.axeSeriousCritical = [...axe.values()].reduce((a, v) => a + v, 0);
      row.capture = b ? b.status : "Captured";
    } else if (exists(path.join(d, "reference.json"))) {
      const ref = readJSON(path.join(d, "reference.json"));
      row.capture = ref.blocked ? ref.blocked.status : "Captured";
      row.axeSeriousCritical = ref.axe?.seriousOrCritical ?? null;
    } else row.capture = b ? b.status : "To capture";
    if (exists(path.join(d, "structure", "structure.json"))) {
      const st = readJSON(path.join(d, "structure", "structure.json"));
      row.pagesCrawled = new Set(st.pages.map((p) => p.url.replace(/\/$/, ""))).size;
      if (st.blocked) row.capture = st.blocked.status;
    }
    sites.push(row);
  }
  return { study: study.id, round: r.id, summarisedAt: new Date().toISOString(), sites };
}
function table(rows, cols, md = false) {
  const cell = (v) => (v === undefined || v === null ? "—" : String(v));
  if (md) return [`| ${cols.join(" | ")} |`, `|${cols.map(() => "---").join("|")}|`, ...rows.map((r) => `| ${cols.map((c) => cell(r[c])).join(" | ")} |`)].join("\n");
  const w = cols.map((c) => Math.max(c.length, ...rows.map((r) => cell(r[c]).length)));
  const line = (vals) => vals.map((v, i) => v.padEnd(w[i])).join("  ");
  return [line(cols), line(w.map((n) => "─".repeat(n))), ...rows.map((r) => line(cols.map((c) => cell(r[c]))))].join("\n");
}
