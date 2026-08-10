import { staggerReveal } from "../utils/animation.js";

const PLUS_ICON = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 5v14M5 12h14" stroke-linecap="round"/></svg>`;

export function renderLoveNotesPage(pageEl, { notes }) {
  pageEl.innerHTML = `
    <h1 class="visually-hidden" tabindex="-1">Things I Love About You</h1>
    <p class="page-eyebrow reveal-item">The little things</p>
    <div class="love-notes-grid">
      ${notes
        .map(
          (note, i) => `
        <article class="love-note reveal-item" data-open="false">
          <button
            type="button"
            class="love-note__trigger"
            data-index="${i}"
            aria-expanded="false"
            aria-controls="note-message-${i}"
          >
            <span class="love-note__title">${note.title}</span>
            <span class="love-note__icon" aria-hidden="true">${PLUS_ICON}</span>
          </button>
          <div class="love-note__message" id="note-message-${i}">
            <div><p>${note.message}</p></div>
          </div>
        </article>
      `
        )
        .join("")}
    </div>
  `;

  const heading = pageEl.querySelector("h1");
  const triggers = pageEl.querySelectorAll(".love-note__trigger");

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const card = trigger.closest(".love-note");
      const isOpen = card.dataset.open === "true";
      card.dataset.open = String(!isOpen);
      trigger.setAttribute("aria-expanded", String(!isOpen));
    });
  });

  staggerReveal(pageEl.querySelectorAll(".reveal-item"), { delayStep: 100 });

  return { focusTarget: heading };
}
