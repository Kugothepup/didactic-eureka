// Reference capture helpers. Paste into the browser console on the reference
// page (or run through any agent's "execute JavaScript in page" tool). Nothing
// here is specific to one agent or browser.
//
//   studioRef.summary()                      look, type, libraries, gradients, transitions
//   await studioRef.sample(fn, els, [ms...]) run fn (e.g. a click), then sample the
//                                            elements' opacity, transform and box at each time
//   studioRef.states(el)                     the :hover / :active / :focus-visible rules for el
//
// Output is plain text with URLs and query strings stripped, so it pastes cleanly
// into a reference.md. Browser-extension styles (the agent's own overlay) are skipped.
// Keep the tab visible: browsers pause script-driven animation in hidden tabs, so
// sample() would report nothing moving.

(() => {
  const EXTENSION = /claude|extension|grammarly/i;
  const clean = (s) => String(s).replace(/url\([^)]*\)/g, "url(…)").replace(/https?:\/\/\S+/g, "[url]").replace(/[?&]/g, "·");
  const name = (el) => {
    if (!el?.tagName) return String(el);
    const cls = String(el.className?.baseVal ?? el.className ?? "").trim().split(/\s+/).filter(Boolean).slice(0, 2);
    const text = el.childElementCount ? "" : ` "${el.textContent.trim().slice(0, 20)}"`;
    return `${el.tagName.toLowerCase()}${cls.length ? "." + cls.join(".") : ""}${text}`;
  };
  const sheets = () => {
    const rules = [];
    for (const sheet of document.styleSheets) {
      if (EXTENSION.test(sheet.ownerNode?.id ?? "") || EXTENSION.test(sheet.href ?? "")) continue;
      let list;
      try { list = sheet.cssRules; } catch { continue; }
      const walk = (items) => { for (const r of items) { rules.push(r); if (r.cssRules && r.type !== CSSRule.KEYFRAMES_RULE) walk(r.cssRules); } };
      walk(list);
    }
    return rules;
  };
  const type = (el) => {
    if (!el) return null;
    const c = getComputedStyle(el);
    return `${name(el)}: ${c.fontFamily.split(",")[0]} ${c.fontWeight} ${c.fontSize}/${c.lineHeight} tracking ${c.letterSpacing} ${c.color}`;
  };

  const summary = () => {
    const rules = sheets();
    const transitions = {};
    for (const el of document.querySelectorAll("body *")) {
      const c = getComputedStyle(el);
      if (c.transitionDuration === "0s") continue;
      const key = `${c.transitionDuration} ${c.transitionTimingFunction} (${c.transitionProperty.split(",").length} props)`;
      transitions[key] = (transitions[key] ?? 0) + 1;
    }
    const gradients = [];
    for (const el of document.querySelectorAll("body *")) {
      const bg = getComputedStyle(el).backgroundImage;
      if (bg.includes("gradient") && gradients.length < 8) gradients.push(`${name(el)}: ${bg} on ${getComputedStyle(el).backgroundColor}`);
    }
    const libs = Object.entries({
      gsap: !!window.gsap, ScrollTrigger: !!window.ScrollTrigger, Lenis: !!(window.Lenis || window.lenis), lottie: !!(window.lottie || window.bodymovin),
      three: !!window.THREE, next: !!document.querySelector('script[src*="/_next/"]'), webflow: !!document.documentElement.dataset.wfPage,
      framer: !!document.querySelector("[data-framer-name]"),
    }).filter(([, on]) => on).map(([lib]) => lib);
    return clean([
      `Page: ${location.host}${location.pathname}  visible ${document.visibilityState === "visible"}  viewport ${innerWidth}x${innerHeight}  page ${document.documentElement.scrollHeight}px`,
      `Libraries: ${libs.join(", ") || "none detected"}`,
      `Fonts loaded: ${[...new Set([...document.fonts].filter((f) => f.status === "loaded").map((f) => f.family))].join(", ")}`,
      `Type: ${["h1", "h2", "p"].map((t) => type(document.querySelector(t))).join(" | ")}`,
      `Gradients:\n  ${gradients.join("\n  ") || "none"}`,
      `Running animations: ${document.getAnimations().length}`,
      `Transitions (duration easing → element count):\n  ${Object.entries(transitions).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([k, n]) => `${k} → ${n}`).join("\n  ")}`,
      `@keyframes: ${rules.filter((r) => r.type === CSSRule.KEYFRAMES_RULE && !EXTENSION.test(r.name)).map((r) => r.name).join(", ") || "none"}`,
      `Reduced-motion rules: ${rules.filter((r) => /prefers-reduced-motion/.test(r.media?.mediaText ?? "") && !EXTENSION.test(r.cssText)).length}`,
    ].join("\n"));
  };

  // Run an action, then sample what changes. Times are ms after the action.
  const sample = async (action, elements, times = [30, 100, 200, 300, 450, 700]) => {
    const els = typeof elements === "function" ? elements : () => elements;
    const read = () => els().map((el) => {
      const c = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return `${name(el)} op ${c.opacity.slice(0, 4)} x ${Math.round(r.x)} w ${Math.round(r.width)} tf ${c.transform.slice(0, 40)}`;
    }).join(" ; ");
    const rows = [`before: ${read()}`];
    await action();
    let t = 0;
    for (const at of times) { await new Promise((r) => setTimeout(r, at - t)); t = at; rows.push(`${at}ms: ${read()}`); }
    const running = document.getAnimations().map((a) => { const tm = a.effect.getTiming(); return `${tm.duration}ms ${tm.easing} on ${name(a.effect.target)}`; });
    return clean(rows.concat(running.length ? [`still running: ${running.slice(0, 6).join(" ; ")}`] : []).join("\n"));
  };

  const states = (el) => clean(sheets()
    .filter((r) => r.selectorText && /:(hover|active|focus-visible)/.test(r.selectorText))
    .filter((r) => { try { return el.matches(r.selectorText.replace(/:(hover|active|focus-visible)/g, "")); } catch { return false; } })
    .map((r) => `${r.selectorText.replace(/\\/g, "").slice(0, 60)} { ${r.style.cssText.slice(0, 160)} }`)
    .join("\n") || "no state rules found (check utility classes on the element)");

  window.studioRef = { summary, sample, states };
  return "studioRef ready: summary(), sample(action, elements, times), states(el)";
})();
