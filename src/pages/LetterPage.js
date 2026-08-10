export function renderLetterPage(pageEl, { letter }) {
  pageEl.innerHTML = `
    <h1 class="visually-hidden" tabindex="-1">The Letter</h1>
    <div class="letter__body">
      <span class="washi-tape" aria-hidden="true"></span>
      <p class="letter__salutation">${letter.salutation}</p>
      ${letter.paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join("")}
      <p class="letter__signoff">${letter.signoff}<br />${letter.name}</p>
    </div>
  `;

  const heading = pageEl.querySelector("h1");
  return { focusTarget: heading };
}
