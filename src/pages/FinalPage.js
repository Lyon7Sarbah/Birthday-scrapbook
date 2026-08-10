import { prefersReducedMotion, wait, staggerReveal } from "../utils/animation.js";

function buildScatterLayout(count) {
  const cols = Math.ceil(Math.sqrt(count));
  const rows = Math.ceil(count / cols);
  const cellW = 100 / cols;
  const cellH = 100 / rows;
  const tileWidth = Math.min(cellW * 0.92, 46);

  return Array.from({ length: count }, (_, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const jitterX = (Math.random() - 0.5) * cellW * 0.5;
    const jitterY = (Math.random() - 0.5) * cellH * 0.5;
    return {
      left: col * cellW + cellW / 2 + jitterX,
      top: row * cellH + cellH / 2 + jitterY,
      rotate: (Math.random() - 0.5) * 16,
      scale: 0.94 + Math.random() * 0.12,
      width: tileWidth,
      z: Math.round(Math.random() * count)
    };
  });
}

// The final beat is a real two-page spread: the message stays free of
// clutter on the left, the photo collage gets the whole right page to
// itself. Both live on separate DOM elements (mounted independently by the
// book engine) but must reveal together on the one "Open" tap, so this
// factory closes over shared state — `opened` and a `revealCollage`
// callback the text page can call once the collage page has been mounted.
export function createFinalSpread({ content, memories = [] }) {
  const layout = buildScatterLayout(memories.length);
  let opened = false;
  let revealCollage = null;

  function renderFinalText(pageEl) {
    pageEl.innerHTML = `
      <h1 class="page-title" tabindex="-1">${content.finalTitle}</h1>
      <div class="scene__actions" data-final-actions>
        <button type="button" class="btn" data-action="open">Open</button>
      </div>
      <div class="final-suspense" data-final-suspense hidden aria-hidden="true">
        <span></span><span></span><span></span>
      </div>
      <div class="scene-final__message" data-final-message hidden>
        ${content.finalMessage.map((line) => `<p class="reveal-item">${line}</p>`).join("")}
      </div>
    `;

    const heading = pageEl.querySelector(".page-title");
    const actions = pageEl.querySelector("[data-final-actions]");
    const openBtn = pageEl.querySelector('[data-action="open"]');
    const suspense = pageEl.querySelector("[data-final-suspense]");
    const message = pageEl.querySelector("[data-final-message]");

    if (opened) {
      actions.hidden = true;
      message.hidden = false;
      message.setAttribute("aria-hidden", "false");
      message.querySelectorAll(".reveal-item").forEach((el) => el.classList.add("is-visible"));
    } else {
      openBtn.addEventListener("click", async () => {
        openBtn.disabled = true;
        actions.hidden = true;

        suspense.hidden = false;
        await wait(prefersReducedMotion() ? 150 : 1600);
        suspense.hidden = true;

        opened = true;
        revealCollage?.();

        message.hidden = false;
        message.setAttribute("aria-hidden", "false");
        message.setAttribute("tabindex", "-1");
        staggerReveal(message.querySelectorAll(".reveal-item"), { delayStep: 220, startDelay: 150 });
        message.focus();
      });
    }

    return { focusTarget: heading };
  }

  function renderFinalCollage(pageEl) {
    pageEl.innerHTML = `
      <div class="final-collage" data-final-collage ${opened ? "" : "hidden"} aria-hidden="${opened ? "false" : "true"}">
        ${memories
          .map(
            (memory, i) => `
          <div
            class="final-collage__tile"
            style="--left:${layout[i].left}%; --top:${layout[i].top}%; --rotate:${layout[i].rotate}deg; --scale:${layout[i].scale}; --width:${layout[i].width}%; --z:${layout[i].z};"
          >
            <img src="${memory.image}" alt="" loading="lazy" data-fallback="true" />
          </div>
        `
          )
          .join("")}
      </div>
    `;

    pageEl.querySelectorAll('img[data-fallback="true"]').forEach((img) => {
      img.addEventListener(
        "error",
        () => {
          img.closest(".final-collage__tile").classList.add("is-fallback");
        },
        { once: true }
      );
    });

    if (!opened) {
      const collage = pageEl.querySelector("[data-final-collage]");
      revealCollage = () => {
        collage.hidden = false;
        collage.setAttribute("aria-hidden", "false");
        if (!prefersReducedMotion()) collage.classList.add("fade-in");
      };
    }

    return {};
  }

  return { renderFinalText, renderFinalCollage };
}
