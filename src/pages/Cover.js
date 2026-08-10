import { staggerReveal } from "../utils/animation.js";
import { FLOWER_STICKER } from "../utils/stickers.js";

export function renderCover(pageEl, { content, next, onBegin }) {
  pageEl.innerHTML = `
    <span class="sticker cover__flower reveal-item" aria-hidden="true">${FLOWER_STICKER}</span>
    <p class="cover-eyebrow reveal-item">A little book</p>
    <h1 class="cover-title reveal-item" tabindex="-1">about you</h1>
    <p class="cover-name reveal-item">${content.name}</p>
    <p class="reveal-item" aria-hidden="true">❤️</p>
    <div class="scene__actions reveal-item">
      <button type="button" class="btn btn--on-cover" data-action="open">Open the book</button>
    </div>
  `;

  const heading = pageEl.querySelector("h1");
  const openBtn = pageEl.querySelector('[data-action="open"]');
  openBtn.addEventListener("click", () => {
    onBegin?.();
    next();
  });

  staggerReveal(pageEl.querySelectorAll(".reveal-item"), { delayStep: 200 });

  return { focusTarget: heading };
}
