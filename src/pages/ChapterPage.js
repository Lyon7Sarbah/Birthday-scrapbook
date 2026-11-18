import { staggerReveal } from "../utils/animation.js";
import { splitOverflow } from "../utils/paginate.js";
import { renderBlankPage, renderMarginStickers } from "./BlankPage.js";

const ROTATE_VARS = ["--rotate-1", "--rotate-3", "--rotate-2", "--rotate-4"];

function cardMarkup(card, i) {
  const rotateVar = `var(${ROTATE_VARS[i % ROTATE_VARS.length]})`;
  return `
    <article class="chapter-card reveal-item" style="--card-rotate:${rotateVar};">
      <p class="chapter-card__title">${card.title}</p>
      <p class="chapter-card__body">${card.body}</p>
    </article>
  `;
}

function renderStoryContent(pageEl, chapter, paragraphs) {
  pageEl.innerHTML = `
    <h1 class="page-title reveal-item" tabindex="-1">${chapter.heading}</h1>
    <div class="letter__body chapter-body reveal-item">
      ${paragraphs.map((p) => `<p>${p}</p>`).join("")}
    </div>
    ${chapter.annotation ? `<p class="handwritten chapter-annotation reveal-item">${chapter.annotation}</p>` : ""}
    ${chapter.sticker ? `<p class="handwritten chapter-sticker reveal-item">${chapter.sticker}</p>` : ""}
  `;
}

function renderContinuation(pageEl, chapter, paragraphs) {
  pageEl.innerHTML = `
    <div class="letter__body chapter-body reveal-item">
      ${paragraphs.map((p) => `<p>${p}</p>`).join("")}
    </div>
    ${chapter.annotation ? `<p class="handwritten chapter-annotation reveal-item">${chapter.annotation}</p>` : ""}
    ${chapter.sticker ? `<p class="handwritten chapter-sticker reveal-item">${chapter.sticker}</p>` : ""}
  `;
  renderMarginStickers(pageEl);
}

function renderCardsContent(pageEl, chapter, cards) {
  pageEl.innerHTML = `
    <h1 class="page-eyebrow reveal-item" tabindex="-1">${chapter.heading}</h1>
    <div class="chapter-cards">${cards.map(cardMarkup).join("")}</div>
    ${chapter.annotation ? `<p class="handwritten chapter-annotation reveal-item">${chapter.annotation}</p>` : ""}
  `;
}

function renderCardsContinuation(pageEl, cards) {
  pageEl.innerHTML = `<div class="chapter-cards">${cards.map(cardMarkup).join("")}</div>`;
  renderMarginStickers(pageEl);
}

// A chapter is two independently-mounted pages (left/right) that need to
// coordinate: if the content fits one page, the facing page stays a
// decorated blank; if it doesn't, the overflow continues there instead of
// the left page scrolling. Overflow can only be known after layout, so the
// left page measures itself after mount and — if needed — updates the
// (already-rendered, already-blank) right page. Works the same way for the
// prose chapters (splitting paragraphs) and the one cards chapter
// (splitting cards).
export function createChapterSpread(chapter) {
  const isCards = chapter.type === "cards";
  let pendingRightUpdate = null;

  function renderLeft(pageEl) {
    if (isCards) {
      renderCardsContent(pageEl, chapter, chapter.cards);
    } else {
      renderStoryContent(pageEl, chapter, chapter.paragraphs);
    }
    const headingEl = pageEl.querySelector("h1");

    splitOverflow(pageEl, {
      bodySelector: isCards ? ".chapter-cards" : ".chapter-body",
      itemSelector: isCards ? ".chapter-card" : "p",
      trailingSelectors: isCards ? [] : [".chapter-annotation", ".chapter-sticker"]
    }).then(({ overflowed, keptCount }) => {
      if (!overflowed) return;
      if (isCards) {
        pendingRightUpdate?.(chapter.cards.slice(keptCount));
      } else {
        pendingRightUpdate?.(chapter.paragraphs.slice(keptCount));
      }
    });

    staggerReveal(pageEl.querySelectorAll(".reveal-item"), { delayStep: 90 });
    return { focusTarget: headingEl };
  }

  function renderRight(pageEl) {
    renderBlankPage(pageEl);
    pendingRightUpdate = (overflowItems) => {
      if (isCards) {
        renderCardsContinuation(pageEl, overflowItems);
      } else {
        renderContinuation(pageEl, chapter, overflowItems);
      }
      staggerReveal(pageEl.querySelectorAll(".reveal-item"), { delayStep: 90 });
    };
    return {};
  }

  return { renderLeft, renderRight };
}
