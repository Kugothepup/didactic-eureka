// Evidence for the copy, semantics and IA lenses: section text and every action label per page.
// Read-only (GET only, no clicks); stops at the first bot check or rate limit.
//   node copy.mjs <out.json> <url> [<url> ...]
import { chromium } from "playwright"; import fs from "node:fs";
import { detectBlock, BLOCKED } from "./blocked.mjs";
const pages = process.argv.slice(3); const out = process.argv[2];
const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce", locale: process.env.LOCALE || "en-GB" })).newPage();
await p.route("**/*", (r) => (r.request().method() === "GET" ? r.continue() : r.abort()));
const result = {};
for (const u of pages) {
  const resp = await p.goto(u, { waitUntil: "networkidle" }).catch(() => null);
  const blk = await detectBlock(p, resp);
  if (blk) { result[u] = { blocked: BLOCKED, reason: blk }; console.error(`${BLOCKED}: ${blk} at ${u}`); break; }
  result[u] = await p.evaluate(() => {
    const clean = (s) => (s || "").replace(/\s+/g, " ").trim();
    const vis = (e) => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.width > 0 && r.height > 0 && s.visibility !== "hidden" && s.display !== "none"; };
    const sections = [...document.querySelectorAll("header, section, article, aside, footer")].filter((s) => !s.parentElement.closest("section, article")).map((s) => ({
      tag: s.tagName.toLowerCase(), id: s.id, heading: clean(s.querySelector("h1,h2,h3")?.innerText),
      text: clean(s.innerText).slice(0, 1500) }));
    const labels = [...document.querySelectorAll("a[href], button")].filter(vis).map((a) => ({ label: clean(a.innerText || a.getAttribute("aria-label") || a.title), aria: a.getAttribute("aria-label"), href: a.getAttribute("href"), region: a.closest("header,nav") ? "nav/header" : a.closest("footer") ? "footer" : "main" }));
    const headings = [...document.querySelectorAll("h1,h2,h3")].filter(vis).map((h) => `${h.tagName} ${clean(h.innerText)}`);
    return { title: document.title, metaDescription: document.querySelector("meta[name=description]")?.content, headings, sections, labels };
  });
}
fs.writeFileSync(out, JSON.stringify(result, null, 1)); console.log("pages:", Object.keys(result).length);
await b.close();
