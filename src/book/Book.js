import { waitForTransition, nextFrame, prefersReducedMotion } from "../utils/animation.js";
import { makeBlankPage } from "../pages/BlankPage.js";

const MOBILE_QUERY = "(max-width: 767px)";
const SWIPE_THRESHOLD = 50;
// real duration is --duration-flip (~1100ms); fallback is a safety net only,
// with a generous margin so a throttled/slow device doesn't get its
// transitionend preempted mid-rotation, which would yank a leaf out and
// jump-cut the page
const FLIP_FALLBACK_MS = 1700;

// Any page without a partner (explicitly solo, or an odd one out) is paired
// with a blank facing page and always sits on the left — a diary doesn't
// fill both sides of every spread.
function buildDesktopSequence(pages) {
  const sequence = [];
  let i = 0;
  while (i < pages.length) {
    const page = pages[i];
    if (page.solo) {
      sequence.push({ kind: "spread", pages: [page, makeBlankPage()] });
      i += 1;
      continue;
    }
    const next = pages[i + 1];
    if (next && !next.solo) {
      sequence.push({ kind: "spread", pages: [page, next] });
      i += 2;
    } else {
      sequence.push({ kind: "spread", pages: [page, makeBlankPage()] });
      i += 1;
    }
  }
  return sequence;
}

function buildMobileSequence(pages) {
  return pages.map((page) => ({ kind: "solo", pages: [page] }));
}

export function mountBook(root, { pages, coverPage }) {
  const mql = window.matchMedia(MOBILE_QUERY);
  let isMobile = mql.matches;
  let sequence = isMobile ? buildMobileSequence(pages) : buildDesktopSequence(pages);

  const book = document.createElement("div");
  book.className = "book is-closed";

  const frame = document.createElement("div");
  frame.className = "book__frame";

  const spine = document.createElement("div");
  spine.className = "book__spine";
  spine.setAttribute("aria-hidden", "true");

  const stage = document.createElement("div");
  stage.className = "book__stage";

  frame.appendChild(spine);
  frame.appendChild(stage);

  const controls = document.createElement("div");
  controls.className = "book__controls";
  controls.hidden = true; // revealed once the cover opens

  const prevBtn = document.createElement("button");
  prevBtn.type = "button";
  prevBtn.className = "book__nav book__nav--prev";
  prevBtn.setAttribute("aria-label", "Previous page");
  prevBtn.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M15 5l-7 7 7 7" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  const status = document.createElement("p");
  status.className = "book__status sr-live";
  status.setAttribute("aria-live", "polite");

  const nextBtn = document.createElement("button");
  nextBtn.type = "button";
  nextBtn.className = "book__nav book__nav--next";
  nextBtn.setAttribute("aria-label", "Next page");
  nextBtn.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  controls.appendChild(prevBtn);
  controls.appendChild(status);
  controls.appendChild(nextBtn);

  book.appendChild(frame);
  book.appendChild(controls);
  root.appendChild(book);

  let index = 0;
  let isTurning = false;
  let baseEl = null;
  let lastFocusTarget = null;

  function mountPage(page, side) {
    const pageEl = document.createElement("section");
    pageEl.className = `book__page book__page--${side}`;
    pageEl.setAttribute("aria-label", page.label || "");
    const controller = page.render(pageEl, { next, prev });
    return { el: pageEl, focusTarget: controller?.focusTarget || null };
  }

  function mountBase(group) {
    const spreadEl = document.createElement("div");
    spreadEl.className = `book__spread book__spread--${group.kind}`;
    let focusTarget = null;
    group.pages.forEach((page, i) => {
      const side = group.kind === "solo" ? "solo" : i === 0 ? "left" : "right";
      const { el, focusTarget: ft } = mountPage(page, side);
      spreadEl.appendChild(el);
      if (ft) focusTarget = ft;
    });
    spreadEl._focusTarget = focusTarget;
    return spreadEl;
  }

  function makeLeaf(placement, originSide) {
    const leaf = document.createElement("div");
    leaf.className = `book__leaf book__leaf--${placement}`;
    leaf.style.transformOrigin = originSide === "left" ? "0% 50%" : "100% 50%";
    return leaf;
  }

  async function settleLeaf(leaf, deg) {
    await nextFrame();
    leaf.style.transform = `rotateY(${deg}deg)`;
    await waitForTransition(leaf, FLIP_FALLBACK_MS);
  }

  // Only the turning page (a single leaf) flips, pivoting at the spine; the
  // facing page never moves. On desktop every group is spread-kind now
  // (solo pages pair with a blank), so this is the only path used there.
  async function turnPartial(newGroup, direction) {
    const flipSide = direction === "next" ? "right" : "left";
    const stillSide = direction === "next" ? "left" : "right";
    const revealedPage = direction === "next" ? newGroup.pages[1] : newGroup.pages[0];
    const backPage = direction === "next" ? newGroup.pages[0] : newGroup.pages[1];

    const flippingEl = baseEl.querySelector(`.book__page--${flipSide}`);
    const revealed = mountPage(revealedPage, flipSide);
    baseEl.replaceChild(revealed.el, flippingEl);

    const leaf = makeLeaf(flipSide, flipSide === "right" ? "left" : "right");
    flippingEl.classList.add("book__leaf__face", "book__leaf__face--front");
    leaf.appendChild(flippingEl);

    const back = mountPage(backPage, stillSide);
    back.el.classList.add("book__leaf__face", "book__leaf__face--back");
    leaf.appendChild(back.el);

    stage.appendChild(leaf);
    await settleLeaf(leaf, direction === "next" ? -180 : 180);

    const stillEl = baseEl.querySelector(`.book__page--${stillSide}`);
    baseEl.replaceChild(back.el, stillEl);
    back.el.classList.remove("book__leaf__face", "book__leaf__face--back");
    leaf.remove();

    lastFocusTarget = back.focusTarget || revealed.focusTarget;
  }

  // Mobile only: the whole visible page flips as one leaf.
  async function turnFull(newGroup, direction) {
    const oldBaseEl = baseEl;
    const newBaseEl = mountBase(newGroup);

    const leaf = makeLeaf("full", direction === "next" ? "right" : "left");
    oldBaseEl.classList.add("book__leaf__face", "book__leaf__face--front");
    leaf.appendChild(oldBaseEl);

    newBaseEl.classList.add("book__leaf__face", "book__leaf__face--back");
    leaf.appendChild(newBaseEl);

    stage.appendChild(leaf);
    await settleLeaf(leaf, direction === "next" ? -180 : 180);

    newBaseEl.classList.remove("book__leaf__face", "book__leaf__face--back");
    stage.appendChild(newBaseEl);
    leaf.remove();
    baseEl = newBaseEl;

    lastFocusTarget = newBaseEl._focusTarget;
  }

  async function turn(targetIndex, direction) {
    if (isTurning) return;
    if (targetIndex < 0 || targetIndex >= sequence.length) return;
    isTurning = true;
    updateNavState();

    const newGroup = sequence[targetIndex];

    if (!isMobile) {
      await turnPartial(newGroup, direction);
    } else {
      await turnFull(newGroup, direction);
    }

    index = targetIndex;
    isTurning = false;
    updateNavState();
    announce(newGroup);
    focusCurrent();
  }

  function next() {
    turn(index + 1, "next");
  }

  function prev() {
    turn(index - 1, "prev");
  }

  function updateNavState() {
    prevBtn.disabled = isTurning || index <= 0;
    nextBtn.disabled = isTurning || index >= sequence.length - 1;
  }

  function announce(group) {
    const labels = group.pages.map((p) => p.label).filter(Boolean);
    const unique = [...new Set(labels)];
    status.textContent = `${unique.join(" / ")}, page ${index + 1} of ${sequence.length}`;
  }

  function focusCurrent() {
    if (!lastFocusTarget) return;
    lastFocusTarget.setAttribute("tabindex", "-1");
    lastFocusTarget.focus({ preventScroll: true });
  }

  prevBtn.addEventListener("click", prev);
  nextBtn.addEventListener("click", next);

  window.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") next();
    if (event.key === "ArrowLeft") prev();
  });

  stage.addEventListener("click", (event) => {
    if (event.target.closest("button, a, input, textarea, select, [role='button']")) return;
    const leftPage = event.target.closest(".book__page--left");
    const rightPage = event.target.closest(".book__page--right");
    if (leftPage) prev();
    if (rightPage) next();
  });

  let touchStartX = null;
  stage.addEventListener(
    "touchstart",
    (event) => {
      touchStartX = event.touches[0].clientX;
    },
    { passive: true }
  );
  stage.addEventListener(
    "touchend",
    (event) => {
      if (touchStartX === null) return;
      const delta = event.changedTouches[0].clientX - touchStartX;
      if (Math.abs(delta) > SWIPE_THRESHOLD) {
        if (delta < 0) next();
        else prev();
      }
      touchStartX = null;
    },
    { passive: true }
  );

  mql.addEventListener("change", (event) => {
    isMobile = event.matches;
    sequence = isMobile ? buildMobileSequence(pages) : buildDesktopSequence(pages);
    index = 0;
    isTurning = false;
    if (baseEl) baseEl.remove();
    baseEl = mountBase(sequence[0]);
    stage.appendChild(baseEl);
    updateNavState();
    announce(sequence[0]);
  });

  baseEl = mountBase(sequence[0]);
  stage.appendChild(baseEl);
  lastFocusTarget = baseEl._focusTarget;
  updateNavState();
  announce(sequence[0]);

  // Closed cover sits on the book's outer shell, above the frame and
  // controls, showing the real first spread only once it's opened.
  const bookCover = document.createElement("div");
  bookCover.className = "book__cover";
  book.appendChild(bookCover);

  function openCover() {
    bookCover.style.transformOrigin = "0% 50%";
    requestAnimationFrame(() => {
      bookCover.classList.add("is-opening");
      bookCover.style.transform = "rotateY(-115deg)";
      bookCover.style.opacity = "0";
    });
    // The cover is already edge-on/invisible (backface-visibility: hidden,
    // foreshortened past ~90deg) well before the flip finishes, thanks to
    // the ease-out curve front-loading the rotation — so widening the book
    // from single-page to full-spread here happens while nothing is
    // visible to show the resize, instead of after the flip completes.
    // Under reduced motion the cover is removed almost immediately (no
    // rotation to wait out), so resize right away instead of leaving a
    // stale narrow frame briefly visible before a delayed jump.
    if (prefersReducedMotion()) {
      book.classList.remove("is-closed");
    } else {
      setTimeout(() => book.classList.remove("is-closed"), 420);
    }
    waitForTransition(bookCover, FLIP_FALLBACK_MS).then(() => {
      bookCover.remove();
      controls.hidden = false;
      updateNavState();
      focusCurrent();
    });
  }

  const coverController = coverPage.render(bookCover, { next: openCover, prev: () => {} });
  if (coverController?.focusTarget) {
    coverController.focusTarget.setAttribute("tabindex", "-1");
    coverController.focusTarget.focus({ preventScroll: true });
  }

  return { next, prev };
}
