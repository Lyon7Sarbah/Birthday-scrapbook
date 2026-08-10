import { staggerReveal } from "../utils/animation.js";
import { PUPPY_STICKER } from "../utils/stickers.js";

const PLUS_ICON = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 5v14M5 12h14" stroke-linecap="round"/></svg>`;

const TYPE_ICONS = {
  envelope: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 6l9 7 9-7" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  note: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 3h10l4 4v14H5z" stroke-linejoin="round"/><path d="M15 3v4h4" stroke-linejoin="round"/><path d="M8 12h8M8 16h5" stroke-linecap="round"/></svg>`,
  sticker: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 4l1.8 5.4H19l-4.6 3.3 1.8 5.3L12 14.7l-4.2 3.3 1.8-5.3L5 9.4h5.2L12 4z" stroke-linejoin="round"/></svg>`
};

const TAPE_VARIANTS = ["", "washi-tape--blush", "washi-tape--mauve"];
const ROTATE_VARS = ["--rotate-2", "--rotate-3", "--rotate-1", "--rotate-4"];

export function renderSurprisesPage(pageEl, { surprises }) {
  pageEl.innerHTML = `
    <h1 class="visually-hidden" tabindex="-1">Little Surprises</h1>
    <p class="page-eyebrow reveal-item">A few little things</p>
    <div class="surprises-grid">
      ${surprises
        .map((surprise, i) => {
          const rotateVar = `var(${ROTATE_VARS[i % ROTATE_VARS.length]})`;
          const tapeVariant = TAPE_VARIANTS[i % TAPE_VARIANTS.length];
          return `
        <article class="surprise-card reveal-item" data-open="false" style="--card-rotate:${rotateVar};">
          <span class="washi-tape ${tapeVariant}" aria-hidden="true"></span>
          ${i === 0 ? `<span class="sticker surprise-card__pet" aria-hidden="true">${PUPPY_STICKER}</span>` : ""}
          <button
            type="button"
            class="surprise-card__trigger"
            data-index="${i}"
            aria-expanded="false"
            aria-controls="surprise-message-${i}"
          >
            <span class="surprise-card__prompt">${surprise.prompt}</span>
            <span class="surprise-card__icon" aria-hidden="true">${TYPE_ICONS[surprise.type] || PLUS_ICON}</span>
          </button>
          <div class="surprise-card__reveal" id="surprise-message-${i}">
            <div><p>${surprise.reveal}</p></div>
          </div>
        </article>
      `;
        })
        .join("")}
    </div>
  `;

  const heading = pageEl.querySelector("h1");
  const triggers = pageEl.querySelectorAll(".surprise-card__trigger");

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const card = trigger.closest(".surprise-card");
      const isOpen = card.dataset.open === "true";
      card.dataset.open = String(!isOpen);
      trigger.setAttribute("aria-expanded", String(!isOpen));
    });
  });

  staggerReveal(pageEl.querySelectorAll(".reveal-item"), { delayStep: 100 });

  return { focusTarget: heading };
}
