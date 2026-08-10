import { staggerReveal, prefersReducedMotion } from "../utils/animation.js";

const TAPE_VARIANTS = ["", "washi-tape--blush", "washi-tape--mauve"];
const ROTATE_VARS = ["--rotate-1", "--rotate-2", "--rotate-3", "--rotate-4"];
const STAR_DOODLE = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M12 3l1.9 5.8H20l-4.9 3.6 1.9 5.8L12 14.6l-4.9 3.6 1.9-5.8L4 8.8h6.1L12 3z" stroke-linejoin="round"/></svg>`;

export function renderMemoryPage(pageEl, { memory, index }) {
  const rotateVar = `var(${ROTATE_VARS[index % ROTATE_VARS.length]})`;
  const tapeVariant = TAPE_VARIANTS[index % TAPE_VARIANTS.length];

  pageEl.innerHTML = `
    <div class="memory-page">
      <button type="button" class="memory-page__backdrop" data-action="close" hidden aria-hidden="true"></button>
      <button type="button" class="polaroid reveal-item" data-action="lift" aria-expanded="false" style="--polaroid-rotate:${rotateVar};">
        <span class="washi-tape ${tapeVariant}" aria-hidden="true"></span>
        ${index % 2 === 0 ? `<span class="memory-doodle" aria-hidden="true">${STAR_DOODLE}</span>` : ""}
        <img class="polaroid__photo" src="${memory.image}" alt="${memory.alt}" loading="eager" data-fallback="true" />
        <span class="polaroid__caption">${memory.caption}</span>
        ${memory.date ? `<span class="polaroid__date">${memory.date}</span>` : ""}
      </button>
    </div>
  `;

  const trigger = pageEl.querySelector('[data-action="lift"]');
  const backdrop = pageEl.querySelector('[data-action="close"]');
  const img = pageEl.querySelector("img");

  img.addEventListener(
    "error",
    () => {
      trigger.innerHTML = `<span class="memory-placeholder">${memory.caption}</span>`;
    },
    { once: true }
  );

  function open() {
    trigger.classList.add("is-open");
    trigger.setAttribute("aria-expanded", "true");
    backdrop.hidden = false;
    if (!prefersReducedMotion()) backdrop.classList.add("fade-in");
  }

  function close() {
    trigger.classList.remove("is-open");
    trigger.setAttribute("aria-expanded", "false");
    backdrop.hidden = true;
    backdrop.classList.remove("fade-in");
    trigger.focus({ preventScroll: true });
  }

  trigger.addEventListener("click", () => {
    if (trigger.classList.contains("is-open")) close();
    else open();
  });

  backdrop.addEventListener("click", close);

  pageEl.addEventListener("keydown", (event) => {
    if (!trigger.classList.contains("is-open")) return;
    if (event.key === "Escape") close();
    // pause book navigation while the enlarged photo is open
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") event.stopPropagation();
  });

  staggerReveal(pageEl.querySelectorAll(".reveal-item"), { delayStep: 0 });

  return { focusTarget: trigger };
}
