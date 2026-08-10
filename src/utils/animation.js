export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function staggerReveal(elements, { delayStep = 220, startDelay = 0 } = {}) {
  const reduced = prefersReducedMotion();
  elements.forEach((el, index) => {
    el.classList.add("reveal-item");
    if (reduced) {
      el.classList.add("is-visible");
      return;
    }
    const delay = startDelay + index * delayStep;
    el.style.transitionDelay = `${delay}ms`;
    requestAnimationFrame(() => {
      el.classList.add("is-visible");
    });
  });
}

export function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function nextFrame() {
  return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
}

export function waitForTransition(el, fallbackMs = 600) {
  return new Promise((resolve) => {
    if (prefersReducedMotion()) {
      resolve();
      return;
    }
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      el.removeEventListener("transitionend", finish);
      resolve();
    };
    el.addEventListener("transitionend", finish, { once: true });
    setTimeout(finish, fallbackMs);
  });
}
