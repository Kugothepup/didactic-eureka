// Journey capture for a study's Competitors table.
// Read-only by construction: it only navigates and clicks links. It never types, submits a form,
// signs in or tries to get past a bot check. At the first sign of a bot check or rate limit it stops,
// writes blocked.json and the row is marked "Blocked: manual review" (see blocked.mjs).
//
//   node capture.mjs explore <url> <outDir>    map one page (links, first-screen actions, landmarks)
//   node capture.mjs run <flow.json> <outDir>  walk a flow; per step: fold + full-page stills,
//                                               page structure, axe-core, internal link check
//   node capture.mjs record <flow.json> <outDir>  replay a flow as a video (journey.webm + .mp4),
//                                               motion on by default (MOTION=reduce to match the stills),
//                                               with a drawn cursor and each stage's task as a caption
import { chromium } from "playwright";
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import { detectBlock, BLOCKED } from "./blocked.mjs";

const require = createRequire(import.meta.url);
const AXE = fs.readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");
// reducedMotion: cross-document view transitions started by a click stall screenshots in headless
// Chromium; reduced motion skips them. Stills therefore show the reduced-motion version of each page.
const VP = (process.env.VIEWPORT || "1440x900").split("x").map(Number);
// Locale and time zone come from the study config via the studio CLI (LOCALE, TIMEZONE); en-GB / London by default.
const CONDITIONS = { viewport: { width: VP[0], height: VP[1] }, locale: process.env.LOCALE || "en-GB", timezoneId: process.env.TIMEZONE || "Europe/London", reducedMotion: "reduce" };


const STUDIO_REF = fs.readFileSync(new URL("./studio-ref.js", import.meta.url), "utf8");

// Consent banners: only ever decline. Never accept, never fill anything in. Returns what happened.
async function declineConsent(page) {
  const name = /^(reject( all)?|decline( all)?|refuse( all)?|(use )?(only )?(strictly )?necessary( cookies)?( only)?|necessary only|deny)$/i;
  for (const frame of page.frames()) {
    const btn = frame.getByRole("button", { name }).first();
    if (await btn.count().catch(() => 0)) {
      const label = (await btn.innerText().catch(() => "")).trim();
      await btn.click({ timeout: 3000 }).catch(() => {});
      await page.waitForTimeout(800);
      return `declined via "${label}"`;
    }
  }
  const banner = await page.evaluate(() => !![...document.querySelectorAll("[id*=consent i],[class*=consent i],[id*=cookie i],[class*=cookie i]")].find((e) => { const r = e.getBoundingClientRect(); return r.height > 60 && getComputedStyle(e).display !== "none"; }));
  return banner ? "banner present, no decline option found: left open" : "no banner found";
}

// Reading metrics for an article page. Characters per line are measured from rendered lines.
async function reading(page) {
  return page.evaluate(() => {
    const root = document.querySelector("article") || document.querySelector("main") || document.body;
    const paras = [...root.querySelectorAll("p")].filter((p) => p.innerText.trim().length > 120 && p.getBoundingClientRect().width > 200);
    if (!paras.length) return null;
    const perLine = [];
    for (const p of paras.slice(0, 12)) {
      const walker = document.createTreeWalker(p, NodeFilter.SHOW_TEXT); const lines = new Map();
      for (let n = walker.nextNode(); n; n = walker.nextNode()) {
        const re = /\S+\s*/g; let m;
        while ((m = re.exec(n.data))) { const r = document.createRange(); r.setStart(n, m.index); r.setEnd(n, m.index + m[0].length); const rect = r.getClientRects()[0]; if (!rect) continue; const k = Math.round(rect.top); lines.set(k, (lines.get(k) || 0) + m[0].length); }
      }
      const counts = [...lines.values()]; counts.pop(); perLine.push(...counts); // drop each paragraph's short last line
    }
    perLine.sort((a, b) => a - b);
    const median = perLine.length ? perLine[Math.floor(perLine.length / 2)] : null;
    const p0 = paras[0], cs = getComputedStyle(p0);
    const words = root.innerText.trim().split(/\s+/).length;
    const adHosts = /doubleclick|googlesyndication|adservice|amazon-adsystem|taboola|outbrain|adnxs|pubmatic|criteo|rubicon|openx|teads|mediavine|ezoic|playwire/i;
    const iframes = [...document.querySelectorAll("iframe")];
    const fixed = [...document.querySelectorAll("body *")].filter((e) => { const p = getComputedStyle(e).position; if (p !== "fixed" && p !== "sticky") return false; const r = e.getBoundingClientRect(); return r.width * r.height > 2000 && r.top < innerHeight && r.bottom > 0; });
    return {
      bodyFont: cs.fontFamily.split(",")[0].replace(/"/g, ""), bodySize: parseFloat(cs.fontSize), lineHeight: +(parseFloat(cs.lineHeight) / parseFloat(cs.fontSize)).toFixed(2), bodyColour: cs.color,
      columnWidth: Math.round(p0.getBoundingClientRect().width), charsPerLineMedian: median, linesMeasured: perLine.length,
      firstParagraphTop: Math.round(p0.getBoundingClientRect().top + scrollY), articleWords: words, paragraphs: paras.length,
      headings: root.querySelectorAll("h2, h3").length, imagesInArticle: root.querySelectorAll("img").length,
      byline: !!document.querySelector("[rel=author], .author, .byline, [itemprop=author]"), dateShown: !!document.querySelector("time, [itemprop=datePublished]"),
      iframes: iframes.length, adIframes: iframes.filter((f) => adHosts.test(f.src)).length, adSlots: document.querySelectorAll("[id*=google_ads], [class*=adsbygoogle], [id*=div-gpt-ad], [class*=ad-slot], [data-ad-slot]").length,
      fixedOrStickyInView: fixed.map((e) => `${e.tagName.toLowerCase()}${e.id ? "#" + e.id : ""} ${Math.round(e.getBoundingClientRect().height)}px`).slice(0, 8),
    };
  });
}

async function newPage(extra = {}, launch = {}) {
  const browser = await chromium.launch(launch);
  // bypassCSP lets our own measuring script (axe) run on pages whose script policy would refuse it; it doesn't change the browser identity.
  const context = await browser.newContext({ ...CONDITIONS, userAgent: undefined, bypassCSP: true, ...(VP[0] < 600 ? { isMobile: true, hasTouch: true, deviceScaleFactor: 3 } : {}), ...extra });
  const page = await context.newPage();
  // Read-only guard: block every form submission and every non-GET request the page tries to send.
  await page.route("**/*", (route) => (route.request().method() === "GET" ? route.continue() : route.abort()));
  return { browser, page };
}

// Scroll through the page so scroll-triggered fade-ins render, then return to the top.
async function settle(page) {
  await page.waitForLoadState("networkidle").catch(() => {});
  await page.evaluate(async () => {
    const start = window.scrollY;
    for (let y = 0; y < document.documentElement.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); }
    window.scrollTo(0, start);
  });
  await page.waitForTimeout(800);
}

// Page structure: what a reviewer and the lenses read. Facts only.
async function structure(page) {
  return page.evaluate(() => {
    const vh = window.innerHeight;
    const vis = (el) => { const s = getComputedStyle(el); const r = el.getBoundingClientRect(); return s.visibility !== "hidden" && s.display !== "none" && +s.opacity > 0.05 && r.width > 0 && r.height > 0; };
    const region = (el) => el.closest("header, nav") ? "header" : el.closest("footer") ? "footer" : "main";
    const text = (el) => (el.innerText || el.getAttribute("aria-label") || el.getAttribute("title") || "").replace(/\s+/g, " ").trim();
    const luminance = (rgb) => { const m = rgb.match(/\d+(\.\d+)?/g); if (!m) return null; const [r, g, b] = m.slice(0, 3).map((v) => { v = +v / 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
    const bgOf = (el) => { for (let n = el; n; n = n.parentElement) { const s = getComputedStyle(n); if (s.backgroundImage !== "none") return null; const a = s.backgroundColor.match(/[\d.]+/g); if (a && (a.length < 4 || +a[3] > 0.95)) return s.backgroundColor; } return "rgb(255,255,255)"; };
    const contrast = (el) => { const bg = bgOf(el); if (!bg) return null; const a = luminance(getComputedStyle(el).color), b = luminance(bg); if (a == null || b == null) return null; return +((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)).toFixed(2); };
    const actions = [...document.querySelectorAll("a[href], button, [role=button]")].filter(vis).map((el, i) => {
      const r = el.getBoundingClientRect(); const s = getComputedStyle(el);
      return { role: el.tagName === "A" ? "link" : "button", name: text(el).slice(0, 80), href: el.getAttribute("href"), region: region(el),
        inFold: r.top < vh && r.bottom > 0, bbox: [Math.round(r.x), Math.round(r.y + window.scrollY), Math.round(r.width), Math.round(r.height)],
        fontSize: parseFloat(s.fontSize), contrast: contrast(el), filled: !/rgba?\(0, 0, 0, 0\)|transparent/.test(s.backgroundColor), domIndex: i };
    });
    const forms = [...document.querySelectorAll("form")].map((f) => ({ fields: [...f.querySelectorAll("input, select, textarea")].filter((i) => !["hidden", "submit", "button"].includes(i.type)).map((i) => ({ label: (i.labels?.[0]?.innerText || i.getAttribute("aria-label") || i.name || "").trim(), type: i.type || i.tagName.toLowerCase(), required: i.required })), submitLabel: text(f.querySelector("[type=submit], button") || f).slice(0, 40) }));
    const foldText = [...document.querySelectorAll("h1, h2, h3, p, li, span, a")].filter((el) => { const r = el.getBoundingClientRect(); return vis(el) && r.top < vh && r.bottom > 0 && el.childElementCount === 0; }).map(text).filter(Boolean);
    return {
      url: location.href, title: document.title, lang: document.documentElement.lang,
      h1: [...document.querySelectorAll("h1")].map(text),
      outline: [...document.querySelectorAll("h2, h3")].filter(vis).map((h) => ({ level: +h.tagName[1], text: text(h).slice(0, 100) })),
      landmarks: { header: !!document.querySelector("header"), nav: document.querySelectorAll("nav").length, main: !!document.querySelector("main"), footer: !!document.querySelector("footer") },
      actions, forms,
      foldText: [...new Set(foldText)].slice(0, 60),
      images: [...document.querySelectorAll("img")].filter(vis).map((i) => { const r = i.getBoundingClientRect(); return { alt: i.alt, inFold: r.top < vh && r.bottom > 0 }; }),
      metrics: { interactiveInFold: actions.filter((a) => a.inFold).length, pageHeight: document.documentElement.scrollHeight },
    };
  });
}

async function axe(page) {
  await page.addScriptTag({ content: AXE });
  const res = await page.evaluate(async () => await window.axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"] } }));
  const v = res.violations.map((x) => ({ id: x.id, impact: x.impact, nodes: x.nodes.length, help: x.help }));
  return { violations: v, seriousOrCritical: v.filter((x) => ["serious", "critical"].includes(x.impact)).reduce((n, x) => n + x.nodes, 0) };
}

// A step's click target: a link by name (default), a button (`button: true`) or visible text (`text: true`).
// Only visible matches count: some sites keep a hidden duplicate of their navigation.
const targetFor = (page, st) => (st.text ? page.getByText(st.click, { exact: !!st.exact })
  : page.getByRole(st.button ? "button" : "link", { name: st.click, exact: !!st.exact })).filter({ visible: true }).first();

function recordBlock(outDir, info) {
  const out = { status: BLOCKED, ...info, at: new Date().toISOString(), note: "The capture stopped here and didn't retry. Visit the site by hand." };
  fs.writeFileSync(path.join(outDir, "blocked.json"), JSON.stringify(out, null, 1));
  console.error(`${BLOCKED}: ${info.reason} at ${info.url}`);
  return out;
}

// Status of the page's internal links (same host), as dead-end evidence. GET only. Stops at the first
// 429 or 403: that's the site asking us to back off, not a dead end.
const CHECKED = new Map();
async function linkCheck(page, s) {
  const host = new URL(s.url).host;
  const hrefs = [...new Set(s.actions.map((a) => a.href).filter(Boolean).map((h) => { try { return new URL(h, s.url); } catch { return null; } }).filter((u) => u && u.host === host && /^https?:$/.test(u.protocol)).map((u) => u.origin + u.pathname))].slice(0, 60);
  const out = [];
  let stopped = null;
  for (const h of hrefs) {
    // Each address is checked once per run, with a short pause between requests.
    if (CHECKED.has(h)) { out.push({ url: h, status: CHECKED.get(h), cached: true }); continue; }
    try { const r = await page.request.get(h, { maxRedirects: 5, timeout: 15000 }); CHECKED.set(h, r.status()); out.push({ url: h, status: r.status() }); if ([403, 429].includes(r.status())) { stopped = `${r.status()} at ${h}: ${BLOCKED}`; break; } }
    catch (e) { CHECKED.set(h, "error"); out.push({ url: h, status: "error" }); }
    await page.waitForTimeout(300);
  }
  return { checked: out.length, broken: out.filter((o) => o.status === "error" || (o.status >= 400 && ![403, 429].includes(o.status))), stopped };
}

async function capture(page, outDir, n, slug) {
  await settle(page);
  const base = path.join(outDir, `${String(n).padStart(2, "0")}-${slug}`);
  console.error(`step ${n}: ${page.url()}`);
  await page.screenshot({ path: `${base}-fold.png`, animations: "disabled", timeout: 90000 });
  await page.screenshot({ path: `${base}-full.png`, fullPage: true, animations: "disabled", timeout: 120000 }).catch((e) => console.error(`  full-page still failed: ${e.message.split("\n")[0]}`));
  const s = await structure(page);
  const a11y = await axe(page);
  const links = await linkCheck(page, s);
  const record = { ...s, capturedAt: new Date().toISOString(), conditions: CONDITIONS, axe: a11y, links };
  fs.writeFileSync(`${base}.json`, JSON.stringify(record, null, 1));
  return record;
}

// Video only: a drawn cursor (headless video has none) and a caption bar. Both live in our browser
// only; nothing is sent to the site.
const CURSOR = `(() => {
  const put = () => {
    if (document.getElementById("__cur")) return;
    const c = document.createElement("div"); c.id = "__cur";
    c.style.cssText = "position:fixed;z-index:2147483647;pointer-events:none;width:22px;height:22px;margin:-11px 0 0 -11px;border-radius:50%;background:rgba(220,38,38,.35);border:2px solid #dc2626;transition:transform .15s;left:-50px;top:-50px";
    const last = JSON.parse(sessionStorage.getItem("__cur") || "null"); if (last) { c.style.left = last[0] + "px"; c.style.top = last[1] + "px"; }
    document.documentElement.appendChild(c);
    addEventListener("mousemove", (e) => { c.style.left = e.clientX + "px"; c.style.top = e.clientY + "px"; sessionStorage.setItem("__cur", JSON.stringify([e.clientX, e.clientY])); }, true);
    addEventListener("mousedown", () => { c.style.transform = "scale(1.8)"; setTimeout(() => (c.style.transform = ""), 250); }, true);
  };
  document.readyState === "loading" ? addEventListener("DOMContentLoaded", put) : put();
})()`;
async function caption(page, text) {
  await page.evaluate((t) => {
    let b = document.getElementById("__cap");
    if (!b) { b = document.createElement("div"); b.id = "__cap"; b.style.cssText = "position:fixed;z-index:2147483646;pointer-events:none;left:50%;bottom:24px;transform:translateX(-50%);max-width:min(92vw,980px);padding:10px 16px;border-radius:8px;background:rgba(17,17,17,.88);color:#fff;font:500 17px/1.4 system-ui,sans-serif;box-shadow:0 4px 16px rgba(0,0,0,.3)"; document.documentElement.appendChild(b); }
    b.textContent = t;
  }, text).catch(() => {});
}
async function glide(page, from, to, ms = 900) {
  const n = Math.max(12, Math.round(ms / 30));
  for (let i = 1; i <= n; i++) { const k = i / n, e = k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2; await page.mouse.move(from[0] + (to[0] - from[0]) * e, from[1] + (to[1] - from[1]) * e); await page.waitForTimeout(ms / n); }
}

const [mode, arg, outDir] = process.argv.slice(2);
fs.mkdirSync(outDir, { recursive: true });
const MOTION = process.env.MOTION || (mode === "record" ? "no-preference" : "reduce");
if (mode === "record") CONDITIONS.reducedMotion = MOTION;
const vidDir = path.join(outDir, ".video-tmp");
// Record mode turns two Chromium features back on that Playwright disables by default: PaintHolding and
// RenderDocument. Without them a cross-document view transition never finishes, the page freezes and
// input hangs. That is a test-harness artefact, not a site bug (checked 14 Oct 2026, Playwright 1.61.1).
// Keep this list in step with playwright-core's chromiumSwitches.ts.
const PW_DISABLED = ["AvoidUnnecessaryBeforeUnloadCheckSync", "BoundaryEventDispatchTracksNodeRemoval", "DestroyProfileOnBrowserClose", "DialMediaRouteProvider", "GlobalMediaControls", "HttpsUpgrades", "LensOverlay", "MediaRouter", "PaintHolding", "ThirdPartyStoragePartitioning", "Translate", "AutoDeElevate", "RenderDocument", "OptimizationHints", "msForceBrowserSignIn", "msEdgeUpdateLaunchServicesPreferredVersion"];
const REAL_TRANSITIONS = { channel: "chromium", ignoreDefaultArgs: ["--disable-features=" + PW_DISABLED.join(",")], args: ["--disable-features=" + PW_DISABLED.filter((f) => !["PaintHolding", "RenderDocument"].includes(f)).join(",")] };
const { browser, page } = await newPage(mode === "record" ? { recordVideo: { dir: vidDir, size: { width: VP[0], height: VP[1] } } } : {}, mode === "record" ? REAL_TRANSITIONS : {});
const t0 = Date.now();
try {
  if (mode === "explore") {
    const resp = await page.goto(arg, { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => {});
    const blk = await detectBlock(page, resp);
    if (blk) { console.log(JSON.stringify(recordBlock(outDir, { mode, url: arg, reason: blk }), null, 1)); process.exitCode = 3; }
    else {
    const consent = await declineConsent(page); console.error("consent: " + consent);
    const r = await capture(page, outDir, 0, "explore");
    console.log(JSON.stringify({ status: resp?.status(), title: r.title, h1: r.h1, landmarks: r.landmarks, foldText: r.foldText.slice(0, 25),
      foldActions: r.actions.filter((a) => a.inFold).map((a) => `${a.region} | ${a.name} -> ${a.href}`),
      caseStudyLinks: r.actions.filter((a) => /project|case|work/i.test(a.href || "")).map((a) => `${a.inFold ? "FOLD" : "    "} ${a.name} -> ${a.href}`),
      contactLinks: r.actions.filter((a) => /contact|mailto|linkedin/i.test((a.href || "") + a.name)).map((a) => `${a.region} ${a.name} -> ${a.href}`),
      axeSeriousCritical: r.axe.seriousOrCritical, broken: r.links.broken }, null, 1));
    }
  } else if (mode === "run") {
    const flow = JSON.parse(fs.readFileSync(arg, "utf8"));
    const steps = [];
    let loads = 0, blocked = null; const consentLog = [];
    page.on("framenavigated", (f) => { if (f === page.mainFrame()) loads++; });
    for (const [i, st] of flow.steps.entries()) {
      let resp = null;
      if (st.goto) { resp = await page.goto(st.goto, { waitUntil: "domcontentloaded", timeout: 45000 }); await page.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => {}); consentLog.push(await declineConsent(page)); }
      if (st.click) {
        const target = targetFor(page, st);
        await target.scrollIntoViewIfNeeded();
        await Promise.all([page.waitForLoadState("domcontentloaded"), target.click()]);
        await page.waitForTimeout(600);
      }
      const blk = await detectBlock(page, resp);
      if (blk) { blocked = recordBlock(outDir, { mode, step: i + 1, stage: st.stage, slug: st.slug, url: page.url(), reason: blk }); break; }
      if (st.scrollTo) { await page.locator(st.scrollTo).first().scrollIntoViewIfNeeded(); }
      const r = await capture(page, outDir, i + 1, st.slug);
      steps.push({ step: i + 1, stage: st.stage, slug: st.slug, task: st.task, how: st.click ? `click "${st.click}"` : st.goto ? `open ${st.goto}` : "same page", url: r.url, title: r.title,
        axeSeriousCritical: r.axe.seriousOrCritical, broken: r.links.broken, forms: r.forms, interactiveInFold: r.metrics.interactiveInFold });
    }
    const summary = { site: flow.site, start: flow.start, capturedAt: new Date().toISOString(), conditions: CONDITIONS,
      clicksToGoal: flow.steps.slice(0, flow.steps.findIndex((s) => s.goal) + 1).filter((s) => s.click).length, navigations: loads,
      goalStep: flow.steps.findIndex((s) => s.goal) + 1,
      fieldsAsked: steps.reduce((n, s) => n + s.forms.reduce((m, f) => m + f.fields.length, 0), 0),
      requiredFields: steps.reduce((n, s) => n + s.forms.reduce((m, f) => m + f.fields.filter((x) => x.required).length, 0), 0),
      deadEnds: [...new Set(steps.flatMap((s) => s.broken.map((b) => b.url)))],
      consent: consentLog, reachedGoal: blocked ? BLOCKED : steps.length >= flow.steps.findIndex((s) => s.goal) + 1 ? "Yes" : "No", blocked,
      axeSeriousCriticalByStep: steps.map((s) => s.axeSeriousCritical), steps };
    fs.writeFileSync(path.join(outDir, "journey.json"), JSON.stringify(summary, null, 1));
    console.log(JSON.stringify(summary, null, 1));
  } else if (mode === "record") {
    const flow = JSON.parse(fs.readFileSync(arg, "utf8"));
    await page.addInitScript(CURSOR);
    const marks = []; let pos = [VP[0] / 2, VP[1] / 2]; let start = null, blocked = null;
    // On a bot check or rate limit: show it on the video for a moment, record it, stop. No retries.
    const halt = async (i, st, resp) => {
      const blk = await detectBlock(page, resp);
      if (!blk) return false;
      await caption(page, `${BLOCKED}: ${blk}`); await page.waitForTimeout(2500);
      blocked = recordBlock(outDir, { mode, step: i + 1, slug: st.slug, url: page.url(), reason: blk });
      return true;
    };
    const stageName = (st) => st.slug.replace(/-/g, " ").replace(/^./, (c) => c.toUpperCase());
    for (const [i, st] of flow.steps.entries()) {
      // Journey flows caption each stage; task flows ("find X") caption the one task throughout.
      const label = st.stage ? `Stage ${st.stage} · ${stageName(st)}: ${st.task}` : `Task: ${flow.task}`;
      const log = (m) => console.error(`[${((Date.now() - t0) / 1000).toFixed(1)}s] step ${i + 1} ${m}`);
      log("start");
      if (st.goto) {
        start ??= (Date.now() - t0) / 1000;
        const resp = await page.goto(st.goto, { waitUntil: "domcontentloaded", timeout: 45000 });
        // Short idle wait: some sites stream audio or animation and never go idle.
        await page.waitForLoadState("networkidle", { timeout: 5000 }).catch(() => {});
        if (await halt(i, st, resp)) break;
        await page.mouse.move(...pos);
        marks.push({ step: i + 1, stage: st.stage, slug: st.slug, at: +((Date.now() - t0) / 1000 - start).toFixed(1), url: page.url() });
        await caption(page, label); await page.waitForTimeout(3500);
      }
      if (st.click) {
        marks.push({ step: i + 1, stage: st.stage, slug: st.slug, at: +((Date.now() - t0) / 1000 - start).toFixed(1), click: st.click });
        await caption(page, label); await page.waitForTimeout(2200);
        const target = targetFor(page, st);
        const inView = await target.evaluate((el) => { const r = el.getBoundingClientRect(); return r.top >= 0 && r.bottom <= innerHeight; });
        if (!inView) { await target.evaluate((el) => el.scrollIntoView({ behavior: "smooth", block: "center" })); await page.waitForTimeout(1200); }
        const b = await target.boundingBox();
        const to = [b.x + b.width / 2, b.y + b.height / 2];
        await glide(page, pos, to); pos = to;
        await page.waitForTimeout(500);
        const before = page.url();
        await page.mouse.click(...to);
        // A link to another page changes the URL; an in-page link may not, so don't wait long for it.
        await page.waitForURL((u) => u.href !== before, { timeout: 4000, waitUntil: "domcontentloaded" }).catch(() => {});
        await page.waitForLoadState("networkidle", { timeout: 5000 }).catch(() => {});
        log("at " + page.url());
        marks[marks.length - 1].url = page.url();
        if (await halt(i, st, null)) break;
        await caption(page, label); await page.waitForTimeout(3500);
        // Scroll from inside the page: Playwright's mouse.wheel hangs on sites with scripted smooth scrolling.
        if (st.read) { await page.evaluate((h) => window.scrollBy({ top: h, behavior: "smooth" }), VP[1] * 0.8).catch(() => {}); await page.waitForTimeout(2500); }
      }
      // A same-page step that points at something further down (e.g. a footer contact link).
      if (st.scrollTo && !st.click) {
        marks.push({ step: i + 1, stage: st.stage, slug: st.slug, at: +((Date.now() - t0) / 1000 - start).toFixed(1), scrollTo: st.scrollTo });
        await caption(page, label); await page.waitForTimeout(1500);
        const el = page.locator(st.scrollTo).filter({ visible: true }).last();
        await el.evaluate((e) => e.scrollIntoView({ behavior: "smooth", block: "center" })).catch(() => log("scrollTo target not found"));
        await page.waitForTimeout(1500);
        const b = await el.boundingBox().catch(() => null);
        if (b) { const to = [b.x + b.width / 2, b.y + b.height / 2]; await glide(page, pos, to); pos = to; }
        await page.waitForTimeout(2500);
      }
    }
    const end = (Date.now() - t0) / 1000 - start;
    const video = page.video();
    await page.context().close();
    const webm = path.join(outDir, "journey.webm"), mp4 = path.join(outDir, "journey.mp4");
    fs.renameSync(await video.path(), webm); fs.rmSync(vidDir, { recursive: true, force: true });
    // Trim the blank page before the first load; H.264 MP4 plays in Notion and most browsers.
    const { execFileSync } = await import("node:child_process");
    try { execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-ss", String(start), "-i", webm, "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "23", "-movflags", "+faststart", mp4]); } catch (e) { console.error("mp4 conversion failed: " + e.message); }
    const goalIdx = flow.steps.findIndex((x) => x.goal);
    const clicksToGoal = goalIdx < 0 ? null : flow.steps.slice(0, goalIdx + 1).filter((x) => x.click).length;
    const out = { site: flow.site, task: flow.task || null, rightAnswer: flow.rightAnswer || null, recordedAt: new Date().toISOString(), conditions: CONDITIONS, seconds: +end.toFixed(1), clicksToGoal: blocked ? null : clicksToGoal, endedAt: page.url(), blocked, chapters: marks, files: ["journey.webm", "journey.mp4"] };
    fs.writeFileSync(path.join(outDir, "journey-video.json"), JSON.stringify(out, null, 1));
    console.log(JSON.stringify(out, null, 1));
  } else if (mode === "reference") {
    const resp = await page.goto(arg, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => {});
    const blk = await detectBlock(page, resp);
    if (blk) {
      const info = recordBlock(outDir, { mode, url: arg, reason: blk });
      fs.writeFileSync(path.join(outDir, "reference.json"), JSON.stringify({ url: arg, status: resp?.status(), blocked: info }, null, 1));
      console.log(JSON.stringify(info, null, 1)); process.exitCode = 3;
    } else {
    const consent = await declineConsent(page);
    const r = await capture(page, outDir, 1, "page");
    await page.addScriptTag({ content: STUDIO_REF }).catch(() => {});
    const look = await page.evaluate(() => window.studioRef ? window.studioRef.summary() : "studioRef unavailable").catch((e) => "summary failed: " + e.message);
    const read = await reading(page);
    const out = { url: arg, status: resp?.status(), consent, title: r.title, capturedAt: r.capturedAt, conditions: r.conditions,
      h1: r.h1, foldText: r.foldText.slice(0, 30), foldActions: r.actions.filter((a) => a.inFold).map((a) => `${a.region} | ${a.name} | ${a.fontSize}px | contrast ${a.contrast} | filled ${a.filled}`),
      interactiveInFold: r.metrics.interactiveInFold, pageHeight: r.metrics.pageHeight, axe: r.axe, brokenLinks: r.links.broken, look, reading: read };
    fs.writeFileSync(path.join(outDir, "reference.json"), JSON.stringify(out, null, 1));
    console.log(JSON.stringify(out, null, 1));
    }
  }
} finally { await browser.close(); }
