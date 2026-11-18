import { nextFrame } from "./animation.js";

const BUFFER_PX = 24;

// Some content is longer than a single page. Rather than let a page scroll
// internally, trim it to what actually fits and hand the rest back to the
// caller so it can be continued on the facing page — the way a real letter
// spills onto the next sheet instead of being crammed smaller.
//
// Must run after the page element is attached to the live DOM (it measures
// real layout). Waits for web fonts to finish loading first — measuring
// against a fallback font before Cormorant Garamond/Caveat swap in would
// under-count height and leave a few stray pixels of overflow after the
// swap. `itemSelector` picks the trimmable unit (paragraphs by default;
// pass e.g. ".chapter-card" for a card grid).
export async function splitOverflow(pageEl, { bodySelector, itemSelector = "p", trailingSelectors = [] }) {
  if (document.fonts?.ready) {
    await document.fonts.ready;
  }
  await nextFrame();

  const fits = pageEl.scrollHeight <= pageEl.clientHeight + BUFFER_PX;
  if (fits) return { overflowed: false, keptCount: null };

  trailingSelectors.forEach((selector) => pageEl.querySelector(selector)?.remove());

  const body = pageEl.querySelector(bodySelector);
  const itemEls = body ? [...body.querySelectorAll(itemSelector)] : [];
  let kept = itemEls.length;

  while (pageEl.scrollHeight > pageEl.clientHeight + BUFFER_PX && kept > 1) {
    itemEls[kept - 1].remove();
    kept -= 1;
  }

  return { overflowed: true, keptCount: kept };
}
