// Annotated stills: draws plus/delta-coloured boxes and numbered labels over the real elements, then
// screenshots the first screen. Read-only: navigates and scrolls only.
import { chromium } from "playwright";
import { detectBlock, BLOCKED } from "./blocked.mjs";
const OUT = process.argv[2];
// Pluses and deltas (see the review-writeup skill). Deltas carry a priority; "delta" alone is for
// third-party sites. The old severity names still work and map onto the new ones.
const SEV = { high: ["#C2410C", "High"], medium: ["#B45309", "Medium"], low: ["#1D4ED8", "Low"], plus: ["#15803D", ""], delta: ["#B91C1C", ""] };
Object.assign(SEV, { major: SEV.high, moderate: SEV.medium, minor: SEV.low, keep: SEV.plus, avoid: SEV.delta });
const KIND = { keep: "plus", avoid: "delta" };
// The tag drawn on the image: "+2", "Δ" or "Δ3 · Medium". Legacy "✓ "/"✗ " prefixes become + and Δ.
const tagOf = (n) => {
  const kind = KIND[n.sev] || n.sev, id = n.text.split(" · ")[0].trim();
  if (kind === "plus") return /^\+\d*$/.test(id) ? id : "+";
  if (kind === "delta") return /^Δ\d*$/.test(id) ? id : "Δ";
  return `${id} · ${SEV[n.sev][1]}`;
};
const captionOf = (n) => {
  const kind = KIND[n.sev] || n.sev;
  const t = n.text.replace(/^✓ /, "+ ").replace(/^✗ /, "Δ ");
  return kind === "plus" || kind === "delta" ? t : t.replace(/^([^·]+?) · /, (m, id) => `${id} · ${SEV[n.sev][1]} · `);
};
const shotsFile = process.argv[3];
// Shots come from a study's shots.json (see docs/config.md); there are no built-in defaults.

if (!shotsFile) { console.error("usage: node annotate.mjs <outDir> <shots.json>"); process.exit(2); }
const shots = JSON.parse((await import("node:fs")).readFileSync(shotsFile, "utf8"));
const b = await chromium.launch();
const missing = [];
for (const s of shots) {
  const ctx = await b.newContext({ viewport: s.phone ? { width: 390, height: 844 } : { width: 1440, height: 900 }, reducedMotion: s.rm, ...(s.phone ? { isMobile: true, hasTouch: true, deviceScaleFactor: 2 } : {}) });
  const p = await ctx.newPage();
  const resp = await p.goto(s.url, { waitUntil: "networkidle" });
  // A bot check or rate limit: skip this shot, don't retry.
  const blk = await detectBlock(p, resp);
  if (blk) { missing.push(`${s.file}: ${BLOCKED} (${blk})`); console.log("blocked", s.file); await ctx.close(); continue; }
  if (s.consent) { for (const f of p.frames()) { const btn = f.getByRole("button", { name: /^(reject( all)?|decline( all)?|refuse( all)?|(only )?(strictly )?necessary( only)?)$/i }).first(); if (await btn.count().catch(() => 0)) { await btn.click({ timeout: 3000 }).catch(() => {}); await p.waitForTimeout(800); break; } } }
  await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(2500);
  if (s.preScroll) { const H = await p.evaluate(() => document.documentElement.scrollHeight); for (let y = 0; y <= H; y += 300) { await p.evaluate((v) => window.scrollTo(0, v), y); await p.waitForTimeout(200); } await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(1000); }
  // Scroll to the smallest element containing some text, when there's no handy selector.
  if (s.scrollToText) { await p.evaluate((t) => [...document.querySelectorAll("body *")].filter((e) => e.childElementCount === 0 && (e.innerText || "").includes(t))[0]?.scrollIntoView({ block: "center" }), s.scrollToText); await p.waitForTimeout(800); }
  if (s.scrollTo) { await p.evaluate((sel) => document.querySelector(sel)?.scrollIntoView({ block: "center" }), s.scrollTo); await p.waitForTimeout(800); }
  const res = await p.evaluate(({ notes, SEV, TAGS }) => {
    const vis = (e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(e).visibility !== "hidden"; };
    const all = [...document.querySelectorAll("body *")].filter(vis);
    const find = (n) => {
      if (n.css) return [...document.querySelectorAll(n.css)].find(vis);
      const t = (e) => (e.innerText || "").replace(/\s+/g, " ").trim();
      const cands = all.filter((e) => n.textIs ? t(e) === n.textIs : t(e).includes(n.textIncludes));
      return n.leaf || n.textIs ? cands.sort((a, b) => t(a).length - t(b).length)[0] : cands[0];
    };
    const layer = document.createElement("div"); layer.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:2147483647"; document.body.appendChild(layer);
    const W = innerWidth, H = innerHeight, placed = [], miss = [];
    const items = [];
    for (const n of notes) {
      let el = find(n); if (!el) { miss.push(n.text); continue; }
      for (let i = 0; i < (n.up || 0) && el.parentElement; i++) el = el.parentElement;
      const r = el.getBoundingClientRect(); const [col, word] = SEV[n.sev];
      const x = Math.max(4, r.left - 6), y = Math.max(4, r.top - 6), w = Math.min(W - x - 4, r.width + 12), h = Math.min(H - y - 4, r.height + 12);
      const box = document.createElement("div"); box.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;border:3px solid ${col};border-radius:6px;box-shadow:0 0 0 2px rgba(255,255,255,.85)`; layer.appendChild(box);
      items.push({ n, x, y, w, h, col, word, tag: TAGS[notes.indexOf(n)] });
    }
    for (const { n, x, y, w, h, col, word, tag } of items) {
      const lab = document.createElement("div"); lab.textContent = tag;
      lab.style.cssText = `position:absolute;max-width:${Math.min(460, W - 16)}px;background:${col};color:#fff;font:700 ${W < 600 ? 13 : 14}px/1.2 system-ui,sans-serif;padding:4px 8px;white-space:nowrap;border-radius:6px;box-shadow:0 2px 8px rgba(0,0,0,.25)`;
      layer.appendChild(lab);
      const lh = lab.getBoundingClientRect().height, lw = lab.getBoundingClientRect().width;
      let ly = n.place === "below" ? y + h + 6 : y - lh - 6; if (ly < 4) ly = y + h + 6; if (ly + lh > H - 4) ly = Math.max(4, y + 8);
      let lx = Math.min(Math.max(4, n.align === "right" ? x + w - lw : x), W - lw - 4);
      for (const q of placed) if (Math.abs(q.y - ly) < lh + 4 && lx < q.x + q.w && lx + lw > q.x) ly = q.y + q.h + 6;
      lab.style.left = lx + "px"; lab.style.top = ly + "px"; placed.push({ x: lx, y: ly, w: lw, h: lh });
    }
    return miss;
  }, { notes: s.notes, SEV, TAGS: s.notes.map(tagOf) });
  await p.screenshot({ path: `${OUT}/${s.file}`, animations: "disabled", timeout: 60000 });
  if (res.length) missing.push(`${s.file}: ${res.join(" | ")}`);
  console.log("done", s.file);
  await ctx.close();
}
await b.close();
import("node:fs").then((fs) => fs.writeFileSync(`${OUT}/captions.json`, JSON.stringify(Object.fromEntries(shots.map((x) => [x.file, x.notes.map(captionOf)])), null, 1)));
console.log(missing.length ? "NOT PLACED:\n" + missing.join("\n") : "all annotations placed");
