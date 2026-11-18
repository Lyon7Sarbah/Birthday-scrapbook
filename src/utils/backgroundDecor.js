import {
  CAT_STICKER,
  PUPPY_STICKER,
  FLOWER_STICKER,
  STAR_STICKER,
  HEART_STICKER,
  RIBBON_STICKER,
  BALLOON_STICKER,
  GIFT_STICKER,
  MUSIC_NOTE_STICKER,
  CLOUD_STICKER
} from "./stickers.js";

// Scattered around the book, not on a page — purely decorative, so it's
// fixed/pointer-events:none and lives behind the book's z-index stack.
const ITEMS = [
  { sticker: STAR_STICKER, top: "8%", left: "6%", rotate: "-12deg", scale: 1 },
  { sticker: HEART_STICKER, top: "14%", left: "90%", rotate: "10deg", scale: 1.3 },
  { sticker: CLOUD_STICKER, top: "6%", left: "78%", rotate: "-4deg", scale: 1.2 },
  { sticker: BALLOON_STICKER, top: "72%", left: "4%", rotate: "-8deg", scale: 1.4 },
  { sticker: FLOWER_STICKER, top: "88%", left: "16%", rotate: "6deg", scale: 1 },
  { sticker: RIBBON_STICKER, top: "10%", left: "40%", rotate: "-6deg", scale: 0.9 },
  { sticker: GIFT_STICKER, top: "82%", left: "88%", rotate: "9deg", scale: 1.2 },
  { sticker: MUSIC_NOTE_STICKER, top: "60%", left: "92%", rotate: "-10deg", scale: 1 },
  { sticker: PUPPY_STICKER, top: "90%", left: "60%", rotate: "5deg", scale: 1 },
  { sticker: CAT_STICKER, top: "4%", left: "20%", rotate: "8deg", scale: 0.9 },
  { sticker: STAR_STICKER, top: "40%", left: "2%", rotate: "14deg", scale: 0.7 },
  { sticker: HEART_STICKER, top: "50%", left: "96%", rotate: "-8deg", scale: 0.7 }
];

export function renderBackgroundDecor() {
  const wrapper = document.createElement("div");
  wrapper.className = "bg-decor";
  wrapper.setAttribute("aria-hidden", "true");
  wrapper.innerHTML = ITEMS.map(
    (item) =>
      `<span class="bg-decor__item" style="top:${item.top}; left:${item.left}; transform:translate(-50%, -50%) rotate(${item.rotate}) scale(${item.scale});">${item.sticker}</span>`
  ).join("");
  return wrapper;
}
