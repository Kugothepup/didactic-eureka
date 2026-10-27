// Builds a self-contained HTML report for one round of a study: measured counts, the journey, each
// site's stills, video and first clicks, and (when reviews.json exists) the reviews and synthesis.
// No dependencies. Called by `studio report`.
import fs from "node:fs";
import path from "node:path";

const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const exists = (f) => fs.existsSync(f);
const readJSON = (f) => JSON.parse(fs.readFileSync(f, "utf8"));
const MIME = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp" };

export function buildReport({ study, baseDir, round, summary, siteDir, reviews, themes, embed }) {
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
  const nameOf = (slug) => sites.find((x) => x.slug === slug)?.name || slug;
  const themesHtml = themes?.themes?.length ? `<section id="themes"><h2>Themes across sites</h2>
    <p class="note">The pluses and deltas, grouped where their wording overlaps (NetworkX). It is a first grouping by wording, not meaning: read each theme and correct it. “Worth borrowing” marks a theme where one site does something well and another could do it better.</p>
    ${themes.themes.map((t) => { const rep = t.findings.find((f) => f.id === t.representative) || t.findings[0];
      return `<article class="theme"><header><h3>${esc(rep.title)}</h3><p class="meta">${t.siteCount} sites · ${t.size} findings${t.transferable ? ` · <span class="chip chip-yes">Worth borrowing</span>` : ""}</p></header>
      ${t.transferable ? `<p class="note">Plus on ${esc(t.plusSites.map(nameOf).join(", "))}; delta on ${esc(t.deltaSites.map(nameOf).join(", "))}.</p>` : ""}
      <ul class="tf">${t.findings.map((f) => `<li><span class="sign ${f.kind}" aria-label="${f.kind === "plus" ? "plus" : "delta"}">${f.kind === "plus" ? "+" : "Δ"}</span><div><strong>${esc(nameOf(f.site))}</strong>: ${esc(f.title)}${f.why ? `<p>${esc(f.why)}</p>` : ""}</div></li>`).join("")}</ul></article>`; }).join("")}
    ${themes.oneOffs?.length ? `<details><summary>${themes.oneOffs.length} findings that didn't group</summary><ul class="tf">${themes.oneOffs.map((f) => `<li><span class="sign ${f.kind}">${f.kind === "plus" ? "+" : "Δ"}</span><div><strong>${esc(nameOf(f.site))}</strong>: ${esc(f.title)}${f.why ? `<p>${esc(f.why)}</p>` : ""}</div></li>`).join("")}</ul></details>` : ""}</section>` : "";
  const sum = (slug) => summary.sites.find((s) => s.slug === slug) || {};
  const rv = (slug) => reviews?.sites?.[slug];
  const stages = study.journey.stages;

  // Link graph (from `studio graph`): numbers and an inline SVG diagram.
  const graphOf = (s) => { const f = path.join(siteDir(s), "structure", "graph.json"); return exists(f) ? readJSON(f) : null; };
  const pathOf = (u) => { try { const x = new URL(u); return (x.pathname + x.search) || "/"; } catch { return u; } };
  const graphSvg = (g) => {
    const W = 640, H = 420, P = 36, ns = g.nodes;
    const xs = ns.map((n) => n.x), ys = ns.map((n) => n.y);
    const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
    const at = (n) => [P + ((n.x - x0) / ((x1 - x0) || 1)) * (W - 2 * P), P + ((n.y - y0) / ((y1 - y0) || 1)) * (H - 2 * P)];
    const by = Object.fromEntries(ns.map((n) => [n.url, n]));
    const maxPr = Math.max(...ns.map((n) => n.pagerank)) || 1;
    const hue = (c) => (c < 0 ? null : (c * 67 + 210) % 360);
    const hubs = new Set(g.hubsByPageRank.slice(0, 4).map((h) => h.url));
    const edges = g.edges.map(([a, b]) => { if (!by[a] || !by[b]) return ""; const [ax, ay] = at(by[a]), [bx, by_] = at(by[b]); return `<line x1="${ax.toFixed(1)}" y1="${ay.toFixed(1)}" x2="${bx.toFixed(1)}" y2="${by_.toFixed(1)}"/>`; }).join("");
    const dots = ns.map((n) => {
      const [x, y] = at(n); const r = 4 + 9 * Math.sqrt(n.pagerank / maxPr); const h = hue(n.community);
      const fill = n.menuOnly || h === null ? "var(--chip)" : `hsl(${h} 55% 52%)`;
      const isStart = n.url === g.start, isGoal = g.goal && n.url === g.goal.url;
      const label = isStart || isGoal || hubs.has(n.url) ? `<text x="${(x + r + 3).toFixed(1)}" y="${(y + 4).toFixed(1)}">${esc((isStart ? "start " : isGoal ? "goal " : "") + pathOf(n.url).slice(0, 28))}</text>` : "";
      return `<g><title>${esc(pathOf(n.url))}${n.title ? " · " + esc(n.title) : ""}${n.depth != null ? ` · ${n.depth} click(s) from start` : ""}</title><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="${fill}" stroke="${isStart || isGoal ? "var(--fg)" : "var(--line)"}" stroke-width="${isStart || isGoal ? 2.5 : 1}"${n.crawled ? "" : ' stroke-dasharray="2 2"'}/>${label}</g>`;
    }).join("");
    return `<svg class="graph" viewBox="0 0 ${W} ${H}" role="img" aria-label="Link graph of ${esc(g.site)}: ${g.pages} pages, ${g.edges.length} links outside the global menu"><g class="edges">${edges}</g>${dots}</svg>`;
  };
  const graphs = sites.map((s) => [s, graphOf(s)]).filter(([, g]) => g);
  const li = (items, n = 6) => items.slice(0, n).map((u) => `<code>${esc(pathOf(u.url || u))}</code>`).join(", ") + (items.length > n ? ` and ${items.length - n} more` : "");
  const structure = graphs.length ? `<section id="structure"><h2>Link structure</h2>
    <p class="note">Measured from the page crawl with NetworkX. “Menu links” are pages linked from at least 80% of crawled pages (navigation and footer): they make every page one click away, so depth and hubs are also shown without them. The crawl is capped, so these describe the pages reached, not the whole site.</p>
    <div class="scroll"><table><thead><tr><th>Site</th><th>Pages found</th><th>Crawled</th><th>Menu links</th><th>Deepest (all links)</th><th>Deepest (no menu)</th><th>Goal: clicks via links</th><th>Pages only in the menu</th><th>Dead ends</th><th>Clusters</th></tr></thead><tbody>
    ${graphs.map(([s, g]) => `<tr><th scope="row">${esc(s.name)}</th><td>${g.pages}</td><td>${g.crawled}</td><td>${g.globalLinks.length}</td><td>${cell(g.maxDepth)}</td><td>${cell(g.localMaxDepth)}</td><td>${g.goal ? cell(g.goal.localDepth ?? g.goal.linkDepth) : "—"}</td><td>${g.menuOnly.length}</td><td>${g.deadEnds.length}</td><td>${g.communities.length}</td></tr>`).join("")}
    </tbody></table></div></section>` : "";
  const graphBlock = (g) => `<h4>Link structure</h4><div class="graphwrap">${graphSvg(g)}<div class="gfacts">
      <p class="note">Each dot is a page, sized by how many links lead to it outside the menu and coloured by cluster. Grey dots are reachable only through the menu; dashed outlines were found but not crawled. Hover for the page.</p>
      <dl><dt>Most linked-to</dt><dd>${li(g.hubsByPageRank, 4) || "—"}</dd>
      <dt>Clusters</dt><dd>${g.communities.length ? g.communities.slice(0, 4).map((c) => `${c.size} pages around <code>${esc(pathOf(c.pages[0]))}</code>`).join("; ") : "none beyond the menu"}</dd>
      <dt>Only via the menu</dt><dd>${g.menuOnly.length ? li(g.menuOnly, 5) : "none"}</dd>
      <dt>Dead ends</dt><dd>${g.deadEnds.length ? li(g.deadEnds, 5) : "none"}</dd>${g.goal ? `<dt>Goal page</dt><dd><code>${esc(pathOf(g.goal.url))}</code>: ${g.goal.localDepth != null ? `${g.goal.localDepth} click(s) by page links` : g.goal.linkDepth != null ? `${g.goal.linkDepth} click(s), only through the menu` : "not reached by links in this crawl"}</dd>` : ""}</dl></div></div>`;

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
    const gr = graphOf(s);
    if (gr) parts.push(graphBlock(gr));
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

  const nav = [["measured", "Measured"], ["journey", "Journey"], ...(graphs.length ? [["structure", "Structure"]] : []), ...(scored.length ? [["stages", "Stages"]] : []), ...(themesHtml ? [["themes", "Themes"]] : []), ...(reviews?.synthesis ? [["synthesis", "Synthesis"]] : []), ["sites", "Sites"]];
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
svg.graph{width:100%;height:auto;background:var(--bg);border:1px solid var(--line);border-radius:10px}svg.graph line{stroke:var(--line);stroke-width:.7}svg.graph text{font:11px system-ui,sans-serif;fill:var(--fg);paint-order:stroke;stroke:var(--bg);stroke-width:3px}.graphwrap{display:grid;grid-template-columns:minmax(300px,1.4fr) 1fr;gap:18px}@media(max-width:760px){.graphwrap{grid-template-columns:1fr}}.gfacts dl{margin:0}.gfacts dt{font-weight:600;font-size:.85rem;color:var(--mute);margin-top:.6em}.gfacts dd{margin:.1em 0;overflow-wrap:anywhere}code{background:var(--chip);padding:0 4px;border-radius:4px;font-size:.85em}
.theme{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:14px 18px;margin:0 0 14px}.theme h3{font-size:1.05rem}.tf{list-style:none;margin:.4em 0 0;padding:0}.tf li{display:flex;gap:10px;margin:0 0 10px}.tf p{margin:.1em 0 0;color:var(--mute);font-size:.92rem}.tf .sign.plus{background:var(--plus);color:#fff}.tf .sign.delta{background:var(--delta);color:#fff}
img.wide,video{width:100%;max-width:100%;border:1px solid var(--line);border-radius:10px;display:block;background:#000}
footer{max-width:1100px;margin:0 auto;padding:24px 16px 60px;color:var(--mute);font-size:.85rem;border-top:1px solid var(--line)}
@media print{nav.toc{display:none}.site{break-inside:avoid-page}video{display:none}}`;

  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(study.id)} · ${esc(study.title || "Research Studio report")}</title><style>${css}</style></head><body>
<header class="top"><p class="eyebrow">Research Studio · ${esc(study.id)} · round ${esc(round.id)}${round.started ? ` · ${esc(round.started)}` : ""}</p><h1>${esc(study.title || study.id)}</h1>
<p class="note">${esc(study.conditions?.viewport || "")} ${esc(study.conditions?.locale || "")}${round.note ? ` · ${esc(round.note)}` : ""}${reviews ? "" : " · Measured evidence only: no reviews written yet."}</p></header>
<nav class="toc" aria-label="Sections"><ul>${nav.map(([id, l]) => `<li><a href="#${id}">${l}</a></li>`).join("")}</ul></nav>
<main>${measured}${journey}${structure}${matrix}${themesHtml}${synthesis}<section id="sites"><h2>Sites</h2>${sites.map(siteCard).join("")}</section></main>
<footer>Generated ${esc(new Date().toISOString().slice(0, 10))} by Research Studio. Counts are measured by the tools; stage scores, reviews and first clicks are judgement and a stand-in for user testing.</footer>
</body></html>`;
}
