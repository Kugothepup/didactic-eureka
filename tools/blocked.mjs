// Bot checks and rate limits: the tools never try to get past them. When a page looks like a
// challenge, a block or a rate limit, the capture stops there and the row is marked
// "Blocked: manual review" for a person to visit by hand.
export const BLOCKED = "Blocked: manual review";

const PHRASES = /just a moment|attention required|verify you are (a )?human|are you a robot|checking your browser|unusual traffic|access denied|request blocked|too many requests|press (and|&) hold|complete the security check/i;
const SELECTORS = "iframe[src*='captcha'], iframe[src*='challenges.cloudflare.com'], #challenge-form, #cf-challenge-running, .g-recaptcha, .h-captcha, [id^='px-captcha'], #sec-if-cpt-container";

// Returns a short reason when the page is a block, or null. `resp` may be null after a click.
export async function detectBlock(page, resp) {
  const status = resp?.status?.();
  if (status === 429) return "429 Too Many Requests (rate limited)";
  const seen = await page.evaluate(([sel]) => ({
    title: document.title || "",
    text: (document.body?.innerText || "").slice(0, 1500),
    widget: !!document.querySelector(sel),
  }), [SELECTORS]).catch(() => null);
  if (!seen) return null;
  if (seen.widget) return "bot-check widget on the page";
  if (PHRASES.test(seen.title)) return `challenge page ("${seen.title.slice(0, 60)}")`;
  // Short pages only: a real article that mentions "access denied" shouldn't count.
  if (seen.text.length < 1200 && PHRASES.test(seen.text)) return `challenge text ("${(seen.text.match(PHRASES) || [""])[0]}")`;
  if (status === 403 || status === 503) return `${status} response`;
  return null;
}
