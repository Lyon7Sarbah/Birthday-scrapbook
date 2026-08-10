import "./styles/reset.css";
import "./styles/variables.css";
import "./styles/global.css";
import "./styles/book.css";
import "./styles/components.css";
import "./styles/scrapbook.css";
import "./styles/animations.css";

import { mountBook } from "./book/Book.js";
import { buildCoverPage, buildPages } from "./book/pages.js";
import { AudioController } from "./utils/audio.js";

const app = document.getElementById("app");
const audio = new AudioController();

const audioToggle = createAudioToggle();
app.appendChild(audioToggle);

const coverPage = buildCoverPage({
  onBegin: () => {
    audio.play().finally(() => {
      audioToggle.classList.toggle("is-visible", audio.available);
    });
  }
});
const pages = buildPages();

mountBook(app, { pages, coverPage });

function createAudioToggle() {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "audio-toggle";
  button.setAttribute("aria-label", "Toggle music");
  button.setAttribute("aria-pressed", "false");
  button.innerHTML =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  button.addEventListener("click", async () => {
    const enabled = await audio.toggle();
    button.setAttribute("aria-pressed", String(enabled));
  });
  return button;
}
