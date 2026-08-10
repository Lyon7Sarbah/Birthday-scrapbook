import {
  BANDAID_STICKER,
  FLOWER_STICKER,
  STAR_STICKER,
  HEART_STICKER,
  RIBBON_STICKER,
  CAT_STICKER,
  PUPPY_STICKER
} from "../utils/stickers.js";

// A few different scattered arrangements so consecutive blank pages don't
// look identical — each one numerous enough that an "empty" page still
// feels like part of a well-loved scrapbook, not a placeholder.
const LAYOUTS = [
  [
    { sticker: STAR_STICKER, top: "14%", left: "16%", rotate: "-10deg" },
    { sticker: HEART_STICKER, top: "20%", left: "72%", rotate: "12deg" },
    { sticker: FLOWER_STICKER, top: "58%", left: "20%", rotate: "6deg" },
    { sticker: BANDAID_STICKER, top: "68%", left: "66%", rotate: "-8deg" },
    { sticker: RIBBON_STICKER, top: "42%", left: "48%", rotate: "4deg" }
  ],
  [
    { sticker: CAT_STICKER, top: "18%", left: "58%", rotate: "-6deg" },
    { sticker: RIBBON_STICKER, top: "16%", left: "18%", rotate: "8deg" },
    { sticker: STAR_STICKER, top: "50%", left: "74%", rotate: "10deg" },
    { sticker: FLOWER_STICKER, top: "70%", left: "24%", rotate: "-9deg" },
    { sticker: HEART_STICKER, top: "66%", left: "56%", rotate: "5deg" }
  ],
  [
    { sticker: PUPPY_STICKER, top: "22%", left: "22%", rotate: "7deg" },
    { sticker: BANDAID_STICKER, top: "16%", left: "64%", rotate: "-11deg" },
    { sticker: HEART_STICKER, top: "56%", left: "68%", rotate: "9deg" },
    { sticker: STAR_STICKER, top: "72%", left: "30%", rotate: "-5deg" },
    { sticker: FLOWER_STICKER, top: "48%", left: "44%", rotate: "3deg" }
  ]
];

const TAPE_VARIANTS = ["washi-tape--blush", "washi-tape--mauve", ""];

let counter = 0;

function renderBlankPage(pageEl) {
  const layout = LAYOUTS[counter % LAYOUTS.length];
  const tapeA = TAPE_VARIANTS[counter % TAPE_VARIANTS.length];
  const tapeB = TAPE_VARIANTS[(counter + 1) % TAPE_VARIANTS.length];
  counter += 1;

  pageEl.innerHTML = `
    <span class="washi-tape ${tapeA} blank-page__tape" aria-hidden="true"></span>
    <span class="washi-tape ${tapeB}" aria-hidden="true" style="top:auto; bottom:-14px; left:70%; transform:translateX(-50%) rotate(5deg);"></span>
    ${layout
      .map(
        (item) => `
      <span class="sticker scatter-sticker" aria-hidden="true" style="top:${item.top}; left:${item.left}; transform:rotate(${item.rotate});">${item.sticker}</span>
    `
      )
      .join("")}
  `;

  return {};
}

export function makeBlankPage() {
  return { id: `blank-${counter}`, label: "", render: renderBlankPage };
}
