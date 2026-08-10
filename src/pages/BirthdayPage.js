import { staggerReveal } from "../utils/animation.js";
import { burst } from "../utils/confetti.js";
import { CAT_STICKER, STAR_STICKER, HEART_STICKER, RIBBON_STICKER } from "../utils/stickers.js";

export function renderBirthdayDeco(pageEl) {
  pageEl.innerHTML = `
    <span class="washi-tape washi-tape--blush" aria-hidden="true"></span>
    <span class="sticker scatter-sticker" aria-hidden="true" style="top:18%; left:74%; transform:rotate(11deg);">${HEART_STICKER}</span>
    <span class="sticker scatter-sticker" aria-hidden="true" style="top:66%; left:14%; transform:rotate(-9deg);">${STAR_STICKER}</span>
    <span class="sticker scatter-sticker" aria-hidden="true" style="top:72%; left:70%; transform:rotate(6deg);">${RIBBON_STICKER}</span>
    <p class="page-eyebrow reveal-item" tabindex="-1">Today is a little different</p>
    <span class="sticker" aria-hidden="true" style="color:var(--color-accent);">${CAT_STICKER}</span>
    <p class="page-text reveal-item">A page just for celebrating you.</p>
  `;
  const focusTarget = pageEl.querySelector(".page-eyebrow");
  staggerReveal(pageEl.querySelectorAll(".reveal-item"), { delayStep: 180 });
  return { focusTarget };
}

export function renderBirthdayMain(pageEl, { content }) {
  const [, name, greeting] = content.revealLines;

  pageEl.innerHTML = `
    <h1 class="page-title reveal-item" tabindex="-1">Happy Birthday</h1>
    <p class="page-name reveal-item">${name}</p>
    <p class="page-text reveal-item">${greeting}</p>
    <button type="button" class="cake reveal-item" data-action="cake" aria-pressed="false">
      <span class="cake__icon" aria-hidden="true">🎂</span>
      <span class="cake__sparkles" aria-hidden="true" hidden>✨ ✨ ✨</span>
      <span class="cake__label" data-cake-label>Make a wish.</span>
    </button>
  `;

  const heading = pageEl.querySelector(".page-title");
  const cakeBtn = pageEl.querySelector('[data-action="cake"]');
  const sparkles = pageEl.querySelector(".cake__sparkles");
  const cakeLabel = pageEl.querySelector("[data-cake-label]");

  let lit = false;
  cakeBtn.addEventListener("click", () => {
    if (lit) return;
    lit = true;
    cakeBtn.classList.add("is-lit");
    cakeBtn.setAttribute("aria-pressed", "true");
    sparkles.hidden = false;
    cakeLabel.textContent = "Wish made.";
    burst(cakeBtn);
  });

  staggerReveal(pageEl.querySelectorAll(".reveal-item"), { delayStep: 280 });

  return { focusTarget: heading };
}
