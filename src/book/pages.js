import { birthday } from "../data/birthday.js";
import { memories } from "../data/memories.js";
import { loveNotes } from "../data/loveNotes.js";
import { surprises } from "../data/surprises.js";
import { letter } from "../data/letter.js";

import { renderCover } from "../pages/Cover.js";
import { renderBirthdayDeco, renderBirthdayMain } from "../pages/BirthdayPage.js";
import { renderMemoryPage } from "../pages/MemoryPage.js";
import { renderLoveNotesPage } from "../pages/LoveNotesPage.js";
import { renderSurprisesPage } from "../pages/SurprisesPage.js";
import { renderLetterPage } from "../pages/LetterPage.js";
import { createFinalSpread } from "../pages/FinalPage.js";

// The cover lives on the closed book's outer shell, not inside the page
// sequence — it's mounted separately by Book.js.
export function buildCoverPage({ onBegin } = {}) {
  return {
    id: "cover",
    label: "Cover",
    render: (pageEl, ctx) => renderCover(pageEl, { content: birthday, next: ctx.next, onBegin })
  };
}

export function buildPages() {
  const finalSpread = createFinalSpread({ content: birthday, memories });

  return [
    {
      id: "birthday-deco",
      type: "decorative",
      label: "Birthday",
      render: (pageEl) => renderBirthdayDeco(pageEl)
    },
    {
      id: "birthday-main",
      type: "birthday",
      label: "Birthday",
      render: (pageEl) => renderBirthdayMain(pageEl, { content: birthday })
    },
    ...memories.map((memory, index) => ({
      id: `memory-${index}`,
      type: "memory",
      label: "Memories",
      render: (pageEl) => renderMemoryPage(pageEl, { memory, index })
    })),
    {
      id: "love-notes",
      type: "love-notes",
      label: "Things I Love About You",
      render: (pageEl) => renderLoveNotesPage(pageEl, { notes: loveNotes })
    },
    {
      id: "surprises",
      type: "surprises",
      label: "Little Surprises",
      render: (pageEl) => renderSurprisesPage(pageEl, { surprises })
    },
    {
      id: "letter",
      type: "letter",
      solo: true,
      label: "The Letter",
      render: (pageEl) => renderLetterPage(pageEl, { letter })
    },
    {
      id: "final-text",
      type: "final",
      label: "One More Thing",
      render: (pageEl) => finalSpread.renderFinalText(pageEl)
    },
    {
      id: "final-collage",
      type: "final-collage",
      label: "One More Thing",
      render: (pageEl) => finalSpread.renderFinalCollage(pageEl)
    }
  ];
}
