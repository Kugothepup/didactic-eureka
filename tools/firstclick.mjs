// Predicted first clicks, drawn on the real screens. Replays a journey flow (read-only, reduced motion,
// cookie banners declined, stops at any bot check) and, at each stage's screen, boxes the candidate
// targets from the prediction: numbered in order, coloured by likelihood, the top one drawn heavier.
// Candidates below the first screen are listed in the caption instead of drawn.
//   node firstclick.mjs <spec.json> <outDir>
// spec: { flow: "path/flow.json", stages: [{ stage, at, file, contested, absent?, candidates: [
//   { name, link | button | text | css, exact?, nth?, likelihood: "likely"|"possible"|"unlikely" } ] }] }
// `at` is the index of the flow step after which the stage's screen is shown. The first candidate is
// the predicted first click.
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { detectBlock, BLOCKED } from "./blocked.mjs";

const [specFile, outDir] = process.argv.slice(2);
const spec = JSON.parse(fs.readFileSync(specFile, "utf8"));
const flow = JSON.parse(fs.readFileSync(path.resolve(path.dirname(specFile), spec.flow), "utf8"));
fs.mkdirSync(outDir, { recursive: true });
const COL = { likely: "#1D4ED8", possible: "#B45309", unlikely: "#6B7280" };

const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, locale: "en-GB", timezoneId: "Europe/London", reducedMotion: "reduce" });
const page = await ctx.newPage();
await page.route("**/*", (r) => (r.request().method() === "GET" ? r.continue() : r.abort()));

const decline = async () => {
  const name = /^(reject( all)?|decline( all)?|refuse( all)?|(only )?(strictly )?necessary( only)?)$/i;
  for (const f of page.frames()) { const btn = f.getByRole("button", { name }).first(); if (await btn.count().catch(() => 0)) { await btn.click({ timeout: 3000 }).catch(() => {}); await page.waitForTimeout(800); return; } }
};
const locate = (c) => {
  const l = c.css ? page.locator(c.css) : c.text ? page.getByText(c.text, { exact: !!c.exact })
    : page.getByRole(c.button ? "button" : "link", { name: c.button || c.link, exact: !!c.exact });
  return l.filter({ visible: true }).nth(c.nth || 0);
};
const target = (st) => locate(st.text ? { text: st.click, exact: st.exact } : st.button ? { button: st.click, exact: st.exact } : { link: st.click, exact: st.exact });

const results = [];
let blocked = null;
for (const [i, st] of flow.steps.entries()) {
  let resp = null;
  if (st.goto) { resp = await page.goto(st.goto, { waitUntil: "domcontentloaded", timeout: 45000 }); await page.waitForLoadState("networkidle", { timeout: 8000 }).catch(() => {}); await decline(); }
  if (st.click) { const t = target(st); await t.scrollIntoViewIfNeeded(); await Promise.all([page.waitForLoadState("domcontentloaded"), t.click()]); await page.waitForTimeout(1200); }
  const blk = await detectBlock(page, resp);
  if (blk) { blocked = { status: BLOCKED, step: i + 1, url: page.url(), reason: blk }; console.error(`${BLOCKED}: ${blk}`); break; }
  for (const sg of spec.stages.filter((x) => x.at === i)) {
    await page.waitForTimeout(600);
    const found = [];
    for (const [k, c] of (sg.candidates || []).entries()) {
      const el = locate(c);
      const box = (await el.count().catch(() => 0)) ? await el.boundingBox().catch(() => null) : null;
      const inView = !!box && box.y < 900 && box.y + box.height > 0 && box.width > 0;
      found.push({ rank: k + 1, name: c.name, likelihood: c.likelihood, side: c.side, found: !!box, inView, box: inView ? box : null });
    }
    await page.evaluate(({ items, COL }) => {
      const layer = document.createElement("div"); layer.id = "__fc"; layer.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:2147483647"; document.body.appendChild(layer);
      const placed = [];
      for (const it of items.filter((x) => x.inView)) {
        const { x, y, width: w, height: h } = it.box; const col = COL[it.likelihood]; const top = it.rank === 1;
        const bx = document.createElement("div");
        bx.style.cssText = `position:absolute;left:${x - 5}px;top:${y - 5}px;width:${w + 10}px;height:${h + 10}px;border:${top ? 5 : 3}px ${it.likelihood === "unlikely" ? "dashed" : "solid"} ${col};border-radius:6px;box-shadow:0 0 0 2px rgba(255,255,255,.85)`;
        layer.appendChild(bx);
        const lab = document.createElement("div"); lab.textContent = it.side === "right" ? `${it.rank}` : `${it.rank} · ${it.likelihood}${top ? " · predicted" : ""}`;
        lab.style.cssText = `position:absolute;background:${col};color:#fff;font:700 13px/1.2 system-ui,sans-serif;padding:3px 7px;border-radius:5px;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,.25)`;
        layer.appendChild(lab);
        const lw = lab.getBoundingClientRect().width, lh = lab.getBoundingClientRect().height;
        let lx = Math.min(Math.max(4, x - 5), innerWidth - lw - 4), ly = y - 5 - lh - 4; if (ly < 4) ly = y + h + 9;
        // On dense lists, a tag to the right of its box covers nothing it shouldn't.
        if (it.side === "right") {
          // Dense lists: a number tag to the right of the box, staggered sideways rather than downwards.
          lx = Math.min(x + w + 10, innerWidth - lw - 4); ly = y + h / 2 - lh / 2;
          for (const q of placed) if (Math.abs(q.y - ly) < lh + 3 && lx < q.x + q.w && lx + lw > q.x) lx = q.x + q.w + 6;
        } else for (const q of placed) if (Math.abs(q.y - ly) < lh + 3 && lx < q.x + q.w && lx + lw > q.x) ly = q.y + q.h + 4;
        lab.style.left = lx + "px"; lab.style.top = ly + "px"; placed.push({ x: lx, y: ly, w: lw, h: lh });
      }
    }, { items: found, COL });
    await page.screenshot({ path: path.join(outDir, sg.file), animations: "disabled" });
    await page.evaluate(() => document.getElementById("__fc")?.remove());
    results.push({ stage: sg.stage, file: sg.file, task: flow.steps.find((x) => x.stage === sg.stage)?.task, contested: !!sg.contested, absent: !!sg.absent, url: page.url(), candidates: found.map(({ box, ...r }) => r) });
    console.error(`stage ${sg.stage}: ${found.map((f) => `${f.rank}${f.inView ? "" : f.found ? "(below)" : "(missing)"}`).join(" ")}`);
  }
}
fs.writeFileSync(path.join(outDir, "firstclick.json"), JSON.stringify({ site: flow.site, capturedAt: new Date().toISOString(), blocked, stages: results }, null, 1));
await b.close();
