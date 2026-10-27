// Page-structure inventory for a site: crawls same-host links from a start page (GET only, no
// clicks, no forms) and stops at the first bot check or rate limit ("Blocked: manual review"). It records each page's heading outline, landmarks, sections in order with
// their position and word count, navigation systems, and current-location markers.
//   node structure.mjs <startUrl> <outDir> [maxPages]
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { detectBlock, BLOCKED } from "./blocked.mjs";
const [start, outDir, maxArg] = process.argv.slice(2);
const MAX = +maxArg || 25;
const VP = (process.env.VIEWPORT || "1440x900").split("x").map(Number);
fs.mkdirSync(outDir, { recursive: true });
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: VP[0], height: VP[1] }, locale: "en-GB", timezoneId: "Europe/London", reducedMotion: "reduce", ...(VP[0] < 600 ? { isMobile: true, hasTouch: true } : {}) });
const p = await ctx.newPage();
await p.route("**/*", (r) => (r.request().method() === "GET" ? r.continue() : r.abort()));
const host = new URL(start).host;
const queue = [new URL(start).origin + new URL(start).pathname], seen = new Set(queue), pages = [];
let blocked = null;
while (queue.length && pages.length < MAX) {
  const url = queue.shift();
  const resp = await p.goto(url, { waitUntil: "networkidle", timeout: 45000 }).catch(() => null);
  const status = resp?.status() ?? "error";
  await p.waitForTimeout(800);
  const blk = await detectBlock(p, resp);
  if (blk) { blocked = { status: BLOCKED, url, reason: blk, at: new Date().toISOString() }; console.error(`${BLOCKED}: ${blk} at ${url}`); break; }
  const s = await p.evaluate(() => {
    const vis = (e) => { const r = e.getBoundingClientRect(); const c = getComputedStyle(e); return r.width > 0 && r.height > 0 && c.visibility !== "hidden" && c.display !== "none"; };
    const txt = (e) => (e.innerText || e.getAttribute("aria-label") || "").replace(/\s+/g, " ").trim();
    const words = (e) => (e.innerText || "").trim().split(/\s+/).filter(Boolean).length;
    const top = (e) => Math.round(e.getBoundingClientRect().top + scrollY);
    const H = document.documentElement.scrollHeight, vh = innerHeight;
    const heads = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].map((h) => ({ level: +h.tagName[1], text: txt(h).slice(0, 90), y: top(h), visible: vis(h) }));
    const skips = []; let prev = 0;
    for (const h of heads) { if (prev && h.level > prev + 1) skips.push(`h${prev} → h${h.level} at "${h.text}"`); prev = h.level; }
    const main = document.querySelector("main") || document.body;
    const sections = [...main.querySelectorAll(":scope > section, :scope > article, :scope > div > section, section[id], article")]
      .filter((e, i, a) => vis(e) && !a.some((o) => o !== e && o.contains(e)))
      .map((e) => ({ id: e.id || null, heading: txt(e.querySelector("h1,h2,h3") || e).slice(0, 70), y: top(e), height: Math.round(e.getBoundingClientRect().height), words: words(e), onFirstScreen: top(e) < vh }));
    const navs = [...document.querySelectorAll("nav")].map((n) => ({ label: n.getAttribute("aria-label"), visible: vis(n), position: getComputedStyle(n).position, links: [...n.querySelectorAll("a")].map((a) => ({ text: txt(a).slice(0, 40), href: a.getAttribute("href"), current: a.getAttribute("aria-current") || (a.className.match(/active|current/) ? "class" : null) })) }));
    const meta = (n) => document.querySelector(`meta[property="${n}"], meta[name="${n}"]`)?.content || null;
    return { title: document.title, h1Count: heads.filter((h) => h.level === 1).length, headings: heads, skips,
      landmarks: { header: document.querySelectorAll("header").length, nav: document.querySelectorAll("nav").length, main: document.querySelectorAll("main").length, footer: document.querySelectorAll("footer").length, skipLink: !!document.querySelector("a[href^='#'][class*=skip], a.skip-link, a[href='#main'], a[href='#main-content']") },
      breadcrumb: !!document.querySelector("[aria-label*=readcrumb i], nav.breadcrumb, .breadcrumbs"),
      sections, navs, pageHeight: H, words: words(main), firstScreenHeadings: heads.filter((h) => h.y < vh && h.visible).map((h) => `h${h.level} ${h.text}`),
      og: { title: meta("og:title"), description: meta("og:description"), image: meta("og:image") }, description: meta("description"), canonical: document.querySelector("link[rel=canonical]")?.href || null,
      links: [...document.querySelectorAll("a[href]")].map((a) => a.href) };
  });
  // Same-host pages this one links to, in the crawl's own URL form: the edges for `studio graph`.
  const internal = [...new Set(s.links.map((l) => { try { const u = new URL(l); if (u.host !== host || !/^https?:/.test(u.protocol)) return null; const k = u.origin + u.pathname; return /\.(png|jpe?g|svg|webp|pdf|xml|ico)$/i.test(k) ? null : k; } catch { return null; } }).filter(Boolean))];
  pages.push({ url, status, ...s, links: undefined, linksTo: internal });
  for (const k of internal) if (!seen.has(k)) { seen.add(k); queue.push(k); }
  console.error(`${status} ${url}`);
}
// Probe parent paths that the URL scheme implies (e.g. /projects/), since visitors may trim the address.
const parents = [...new Set(pages.map((x) => new URL(x.url).pathname.split("/").filter(Boolean)).filter((s) => s.length > 1).map((s) => `/${s[0]}/`))];
const parentStatus = {};
for (const pp of blocked ? [] : parents) { const r = await p.request.get(new URL(pp, start).href).catch(() => null); parentStatus[pp] = r ? r.status() : "error"; if (r && [403, 429].includes(r.status())) break; }
fs.writeFileSync(path.join(outDir, "structure.json"), JSON.stringify({ start, capturedAt: new Date().toISOString(), viewport: VP, blocked, pages, parentStatus }, null, 1));
console.log(JSON.stringify({ blocked, pages: pages.map((x) => `${x.status} ${x.url}`), parentStatus }, null, 1));
await b.close();
