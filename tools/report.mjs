// Builds a self-contained HTML report for one round of a study: measured counts, the journey, each
// site's stills, video and first clicks, and (when reviews.json exists) the reviews and synthesis.
// No dependencies. Called by `studio report`.
import fs from "node:fs";
import path from "node:path";

const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const exists = (f) => fs.existsSync(f);
const readJSON = (f) => JSON.parse(fs.readFileSync(f, "utf8"));
const MIME = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp" };

export function buildReport({ study, baseDir, round, summary, siteDir, reviews, embed }) {
  const rel = (f) => path.relative(baseDir, f).split(path.sep).map(encodeURIComponent).join("/");
  const img = (f, alt, cls = "") => {
    const src = embed ? `data:${MIME[path.extname(f)] || "image/png"};base64,${fs.readFileSync(f).toString("base64")}` : rel(f);
    return `<img${cls ? ` class="${cls}"` : ""} src="${src}" alt="${esc(alt)}" loading="lazy">`;
  };
  const cell = (v) => (v === undefined || v === null ? "—" : esc(v));
  const pd = (items, sign) => (items?.length ? `<ul class="${sign === "+" ? "plus" : "delta"}">${items.map((i) => {
    const o = typeof i === "string" ? { title: i } : i;
    return `<li><span class="sign" aria-hidden="true">${sign === "+" ? "+" : "Δ"}</span><div><strong>${esc(o.title)}</strong>${o.why ? `<p>${esc(o.why)}</p>` : ""}</div></li>`;
  }).join("")}</ul>` : "");
  const pdBlock = (r) => (r && (r.pluses?.length || r.deltas?.length) ? `<div class="pd"><div><h4>Pluses</h4>${pd(r.pluses, "+")}</div><div><h4>Deltas</h4>${pd(r.deltas, "Δ")}</div></div>` : "");

  const sites = study.sites;
  const sum = (slug) => summary.sites.find((s) => s.slug === slug) || {};
  const rv = (slug) => reviews?.sites?.[slug];
  const stages = study.journey.stages;

  // Stage matrix: rows are stages, columns are sites (only when reviews carry stage scores).
  const scored = sites.filter((s) => rv(s.slug)?.stages);
  const chip = (score) => `<span class="chip chip-${esc(String(score || "none").toLowerCase().replace(/[^a-z]/g, ""))}">${esc(score || "—")}</span>`;
  const matrix = scored.length ? `<section id="stages"><h2>Stage by stage</h2>
    <p class="note">Scores are judgement, from three yes/no checks per stage. “Absent” and “Blocked” are not zeros.</p>
    <div class="scroll"><table><thead><tr><th>Stage</th>${scored.map((s) => `<th>${esc(s.name)}</th>`).join("")}</tr></thead><tbody>
    ${stages.map((st) => `<tr><th scope="row">${st.n}. ${esc(st.name)}</th>${scored.map((s) => `<td>${chip(rv(s.slug).stages[st.n]?.score)}</td>`).join("")}</tr>`).join("")}
    </tbody></table></div></section>` : "";

  const measured = `<section id="measured"><h2>What was measured</h2>
    <p class="note">Counted by the tools from the captured pages, not read from screenshots.</p>
    <div class="scroll"><table><thead><tr><th>Site</th><th>Kind</th><th>Capture</th><th>Reached goal</th><th>Clicks to goal</th><th>Dead ends</th><th>Fields asked</th><th>Required</th><th>Serious/critical a11y</th><th>Pages crawled</th></tr></thead><tbody>
    ${sites.map((s) => { const m = sum(s.slug); return `<tr><th scope="row">${esc(s.name)}</th><td>${cell(s.kind)}</td><td>${cell(m.capture)}</td><td>${cell(m.reachedGoal)}</td><td>${cell(m.stepsToGoal)}</td><td>${cell(m.deadEnds)}</td><td>${cell(m.fieldsAsked)}</td><td>${cell(m.requiredFields)}</td><td>${cell(m.axeSeriousCritical)}</td><td>${cell(m.pagesCrawled)}</td></tr>`; }).join("")}
    </tbody></table></div></section>`;

  const journey = `<section id="journey"><h2>The journey</h2>
    <p class="note">Every site is walked through the same stages${study.journey.audience ? `, as ${esc(study.journey.audience)}` : ""}${study.journey.endsAt ? `. It ends at: ${esc(study.journey.endsAt)}` : ""}.</p>
    <ol class="stages">${stages.map((st) => `<li><h3>${esc(st.name)}</h3><p>${esc(st.task)}</p>${st.checks?.length ? `<ul>${st.checks.map((c) => `<li>${esc(c)}</li>`).join("")}</ul>` : ""}</li>`).join("")}</ol></section>`;

  const synthesis = reviews?.synthesis ? `<section id="synthesis"><h2>Synthesis</h2>
    ${reviews.synthesis.status ? `<p class="status">${esc(reviews.synthesis.status)}</p>` : `<p class="status">Draft: a proxy for user testing, to be checked with real users.</p>`}
    ${reviews.synthesis.summary ? `<p class="lede">${esc(reviews.synthesis.summary)}</p>` : ""}${pdBlock(reviews.synthesis)}</section>` : "";

  const siteCard = (s) => {
    const d = siteDir(s); const m = sum(s.slug); const r = rv(s.slug);
    const blocked = exists(path.join(d, "blocked.json")) ? readJSON(path.join(d, "blocked.json")) : null;
    const parts = [];
    const stills = exists(d) ? fs.readdirSync(d).filter((f) => /^\d\d-.*-fold\.png$/.test(f)).sort() : [];
    if (stills.length) {
      parts.push(`<h4>Screens along the journey</h4><div class="stills">${stills.map((f) => {
        const n = Number(f.slice(0, 2)); const full = f.replace("-fold.png", "-full.png");
        const st = stages.find((x) => x.n === s.route?.[n - 1]?.stage) || stages[n - 1];
        const fig = `<figure>${img(path.join(d, f), `${s.name}, step ${n}`)}<figcaption>${n}. ${esc(st?.name || f)}</figcaption></figure>`;
        return exists(path.join(d, full)) ? `<a href="${rel(path.join(d, full))}" title="Open the full page still">${fig}</a>` : fig;
      }).join("")}</div>`);
    }
    const mp4 = path.join(d, "video", "journey.mp4"), webm = path.join(d, "video", "journey.webm");
    const vid = exists(mp4) ? mp4 : exists(webm) ? webm : null;
    if (vid) parts.push(`<h4>Journey video</h4><video controls preload="metadata" src="${rel(vid)}"></video>`);
    const fc = exists(path.join(d, "firstclick")) ? fs.readdirSync(path.join(d, "firstclick")).find((f) => /^firstclick-.*\.png$/.test(f)) : null;
    if (fc) parts.push(`<h4>Predicted first clicks</h4><p class="note">Drawn on the screen where each task is asked. Judgement, as triage before testing.</p>${img(path.join(d, "firstclick", fc), `Predicted first clicks for ${s.name}`, "wide")}`);
    const ann = exists(path.join(d, "annotated")) ? fs.readdirSync(path.join(d, "annotated")).filter((f) => /\.png$/.test(f)).sort() : [];
    if (ann.length) parts.push(`<h4>Annotated screens</h4><div class="stills">${ann.map((f) => `<a href="${rel(path.join(d, "annotated", f))}"><figure>${img(path.join(d, "annotated", f), f)}<figcaption>${esc(f.replace(/\.png$/, ""))}</figcaption></figure></a>`).join("")}</div>`);
    const checks = r?.stages ? `<h4>Stage checks</h4>${stages.filter((st) => r.stages[st.n]).map((st) => { const x = r.stages[st.n]; return `<details><summary>${st.n}. ${esc(st.name)} ${chip(x.score)}</summary>${x.checks?.length ? `<ul class="checks">${x.checks.map((c) => `<li><span class="res res-${esc(c.result)}">${esc(c.result)}</span> ${esc(c.check)}${c.evidence ? `<span class="ev"> — ${esc(c.evidence)}</span>` : ""}</li>`).join("")}</ul>` : ""}${x.note ? `<p>${esc(x.note)}</p>` : ""}</details>`; }).join("")}` : "";
    return `<article class="site" id="site-${esc(s.slug)}">
      <header><h3>${esc(s.name)}</h3><p class="meta"><span class="kind">${esc(s.kind)}</span> <a href="${esc(s.url)}" rel="noopener">${esc(s.url)}</a></p></header>
      ${blocked ? `<p class="blocked"><strong>Blocked: manual review.</strong> ${esc(blocked.reason || blocked.status || "")} The tools stopped at once and did not try to get past it. Visit this site by hand.</p>` : ""}
      ${r?.take ? `<p class="lede">${esc(r.take)}</p>` : ""}${pdBlock(r)}${checks}
      ${m.capture === "To capture" && !stills.length ? `<p class="note">Not captured yet.</p>` : ""}${parts.join("")}
    </article>`;
  };

  const nav = [["measured", "Measured"], ["journey", "Journey"], ...(scored.length ? [["stages", "Stages"]] : []), ...(reviews?.synthesis ? [["synthesis", "Synthesis"]] : []), ["sites", "Sites"]];
  const css = `
:root{--bg:#faf8f3;--fg:#1d1d1f;--mute:#5f5b52;--line:#ddd7c9;--card:#fff;--accent:#1f4fd1;--plus:#1b7a4b;--delta:#a05a00;--bad:#b3261e;--chip:#eee9dc}
@media (prefers-color-scheme:dark){:root{--bg:#15161a;--fg:#ececef;--mute:#a4a2ab;--line:#2c2e35;--card:#1d1f25;--accent:#8fb0ff;--plus:#5fcf97;--delta:#ffb454;--bad:#ff8a80;--chip:#2a2c34}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--fg);font:16px/1.55 system-ui,-apple-system,"Segoe UI",sans-serif}
a{color:var(--accent)}main,header.top{max-width:1100px;margin:0 auto;padding:0 16px}
header.top{padding-top:40px;padding-bottom:8px}h1{font-size:clamp(1.6rem,4vw,2.4rem);line-height:1.15;margin:.2em 0}
.eyebrow{color:var(--mute);font-size:.85rem;letter-spacing:.06em;text-transform:uppercase;margin:0}
nav.toc{position:sticky;top:0;background:var(--bg);border-bottom:1px solid var(--line);z-index:5}nav.toc ul{display:flex;gap:16px;list-style:none;margin:0 auto;padding:10px 16px;max-width:1100px;overflow-x:auto}
section{margin:40px 0}h2{font-size:1.4rem;margin:0 0 .3em}h3{margin:.2em 0}h4{margin:1.4em 0 .5em;font-size:.95rem;color:var(--mute);text-transform:uppercase;letter-spacing:.05em}
.note{color:var(--mute);font-size:.92rem;margin:.2em 0 .8em}.lede{font-size:1.1rem}.status{display:inline-block;background:var(--chip);padding:2px 10px;border-radius:99px;font-size:.85rem}
.scroll{overflow-x:auto;border:1px solid var(--line);border-radius:10px;background:var(--card)}table{border-collapse:collapse;width:100%;font-size:.9rem}
th[scope=row]{min-width:150px}th,td{padding:8px 12px;text-align:left;border-bottom:1px solid var(--line);vertical-align:top}thead th{color:var(--mute);font-weight:600;white-space:nowrap}tbody tr:last-child>*{border-bottom:0}
.stages{padding-left:1.2em}.stages>li{margin:0 0 14px}.stages h3{font-size:1.02rem}.stages p{margin:.1em 0}.stages ul{margin:.3em 0;color:var(--mute);font-size:.9rem}
.site{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:20px;margin:0 0 24px}.site header{border-bottom:1px solid var(--line);padding-bottom:8px;margin-bottom:8px}
.meta{margin:0;color:var(--mute);font-size:.9rem;overflow-wrap:anywhere}.kind{background:var(--chip);padding:1px 8px;border-radius:99px;margin-right:6px;text-transform:capitalize}
.blocked{border-left:4px solid var(--bad);padding:6px 12px;background:var(--chip)}
.pd{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:20px}.pd ul{list-style:none;margin:0;padding:0}.pd li{display:flex;gap:10px;margin:0 0 12px}.pd p{margin:.15em 0 0;color:var(--mute);font-size:.93rem}
.sign{flex:none;width:1.5em;height:1.5em;border-radius:6px;display:grid;place-items:center;font-weight:700;font-size:.85rem}.plus .sign{background:var(--plus);color:#fff}.delta .sign{background:var(--delta);color:#fff}
.chip{display:inline-block;padding:1px 9px;border-radius:99px;background:var(--chip);font-size:.8rem;font-weight:600}.chip-yes{background:var(--plus);color:#fff}.chip-partly{background:var(--delta);color:#fff}.chip-no{background:var(--bad);color:#fff}
details{border-top:1px solid var(--line);padding:6px 0}summary{cursor:pointer;font-weight:600}.checks{margin:.4em 0;padding-left:1.1em}.ev{color:var(--mute)}.res{font-size:.75rem;text-transform:uppercase;font-weight:700;color:var(--mute)}.res-yes{color:var(--plus)}.res-no{color:var(--bad)}.res-partly{color:var(--delta)}
.stills{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:12px}.stills figure{margin:0}.stills img{width:100%;border:1px solid var(--line);border-radius:8px;display:block}.stills figcaption{font-size:.82rem;color:var(--mute);margin-top:4px}
img.wide,video{width:100%;max-width:100%;border:1px solid var(--line);border-radius:10px;display:block;background:#000}
footer{max-width:1100px;margin:0 auto;padding:24px 16px 60px;color:var(--mute);font-size:.85rem;border-top:1px solid var(--line)}
@media print{nav.toc{display:none}.site{break-inside:avoid-page}video{display:none}}`;

  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(study.id)} · ${esc(study.title || "Research Studio report")}</title><style>${css}</style></head><body>
<header class="top"><p class="eyebrow">Research Studio · ${esc(study.id)} · round ${esc(round.id)}${round.started ? ` · ${esc(round.started)}` : ""}</p><h1>${esc(study.title || study.id)}</h1>
<p class="note">${esc(study.conditions?.viewport || "")} ${esc(study.conditions?.locale || "")}${round.note ? ` · ${esc(round.note)}` : ""}${reviews ? "" : " · Measured evidence only: no reviews written yet."}</p></header>
<nav class="toc" aria-label="Sections"><ul>${nav.map(([id, l]) => `<li><a href="#${id}">${l}</a></li>`).join("")}</ul></nav>
<main>${measured}${journey}${matrix}${synthesis}<section id="sites"><h2>Sites</h2>${sites.map(siteCard).join("")}</section></main>
<footer>Generated ${esc(new Date().toISOString().slice(0, 10))} by Research Studio. Counts are measured by the tools; stage scores, reviews and first clicks are judgement and a stand-in for user testing.</footer>
</body></html>`;
}
