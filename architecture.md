# Birthday Experience — Architecture & Product Specification

## 1. Project Vision

This is **not a conventional website**.

It is a lightweight, interactive digital birthday experience designed for one person: the birthday girl.

The experience is a **handcrafted digital scrapbook made specifically for her** — and, concretely, it takes the form of an actual book: a centered scrapbook the user opens and pages through, not a sequence of full-screen website sections that happen to have scrapbook decoration on them.

Think:

> **digital scrapbook + personal photo album + handwritten love letter + birthday celebration**

The user should feel like they are genuinely **holding and flipping through a little birthday scrapbook made just for them** — not scrolling a page, not clicking through a slideshow.

It should **not** feel like:

* a generic romantic website
* a corporate or editorial landing page
* an old-fashioned skeuomorphic website "pretending" to be a book
* a template anyone could have bought

There should be:

* No traditional navbar
* No Home / About / Contact pages
* No conventional multi-page routing
* No backend
* No database
* No authentication
* No unnecessary framework complexity
* No excessive visual effects

The guiding principle is:

> **The technology should disappear and leave only the feeling.**

The experience should be beautiful enough to feel special, handmade enough to feel personal, and simple enough that the content — the memories, writing, photographs, and personal details — remains the focus.

---

# 2. Experience Model

The scrapbook itself is the primary interface. The browser viewport contains one centered book. Everything happens inside it.

```text
        ┌──────────────────────────────┐
        │                              │
        │        SCRAPBOOK             │
        │                              │
        │   ┌────────┬────────┐        │
        │   │        │        │        │
        │   │ PAGE   │ PAGE   │        │
        │   │   L    │   R    │        │
        │   │        │        │        │
        │   └────────┴────────┘        │
        │                              │
        └──────────────────────────────┘
```

The user progresses by **turning pages**, not by scrolling or fading between full-screen scenes.

```text
Scrapbook spread
       ↓
physical page turn
       ↓
new scrapbook spread
       ↓
physical page turn
       ↓
new scrapbook spread
```

This is explicitly **not**:

```text
Scene 1 → fade → Scene 2 → fade → Scene 3
```

The book remains visually present throughout the entire experience — it is never replaced by a different layout. Content lives inside the book.

Conceptual spread sequence:

```text
        ┌───────────────┐
        │     COVER     │   (closed book — solo)
        └───────┬───────┘
             [Open]
                ▼
        ┌───────────────┐
        │   BIRTHDAY     │   (spread: decoration | reveal + cake)
        └───────┬───────┘
                ▼
        ┌───────────────┐
        │   MEMORIES     │   (spreads: one photo per page, paired 2-up)
        └───────┬───────┘
                ▼
        ┌────────────────────────┐
        │ THINGS I LOVE ABOUT YOU│   (single page, auto-pairs with a neighbor)
        └───────┬────────────────┘
                ▼
        ┌───────────────┐
        │LITTLE SURPRISES│   (single page, auto-pairs with a neighbor)
        └───────┬───────┘
                ▼
        ┌───────────────┐
        │    LETTER      │   (solo — quiet, centered)
        └───────┬───────┘
                ▼
        ┌───────────────┐
        │  FINAL PAGE    │   (solo — closing the book)
        └───────────────┘
```

There is one URL and one continuous experience — the spread sequence above is state inside a single page, not a set of routes.

---

# 3. Core Interaction Philosophy

### Page turning is the primary navigation mechanism

The user can:

* tap/click the right page (or a subtle Next control) to turn forward
* tap/click the left page (or a subtle Back control) to turn back
* swipe left/right on mobile
* use ArrowRight / ArrowLeft on desktop
* interact with objects placed **on** the pages, independent of turning

A page turn is a physical-feeling rotation, not a fade. See Section 16 for the mechanism.

### Objects belong to the book

The user should feel that objects belong to the scrapbook, not to a UI kit:

* A photograph can be tapped, lifted, and enlarged in place.
* An envelope or note can be opened.
* The cake can be tapped.
* A sticker can wiggle.

**Do not make every object clickable.** Interaction should feel intentional, not gamified. The user should intuitively understand what is interactive through subtle affordances rather than obvious UI chrome scattered everywhere.

### Interactive photographs stay in the book

Tapping a photograph lifts/enlarges it and shows its caption **in place**, on the same page. It never navigates away from the book. Closing it returns to the spread exactly as it was.

### Reveals happen in place

Notes, cards, and little surprises reveal their content on the same page they live on (accordion/expand-style). They never trigger a page turn or route change as a side effect of being opened.

### Animation

Animations should communicate transitions, emotional emphasis, and the physical metaphor of a scrapbook.

Good examples:

* the page-turn rotation itself
* a Polaroid gently lifting when tapped
* tape subtly moving with a photo
* an envelope opening
* handwritten text appearing
* a sticker wobbling slightly
* cake candles lighting
* a confetti burst (brief)

Avoid:

* excessive 3D page-turn complexity (see Section 16 — the illusion only needs to be convincing)
* constant floating elements
* aggressive parallax
* excessive bouncing
* flashy transitions
* continuous confetti
* excessive particle systems
* anything that feels like a template or an animation demo

Rule:

> If the animation gets more attention than the message, reduce the animation.
> The book should feel alive, not like an animation demo.

---

# 4. Technical Stack

Use:

* Vite
* Vanilla JavaScript
* HTML5
* CSS3
* ES modules

Do NOT introduce React, Vue, Svelte, Next.js, Tailwind, Redux, or another application framework unless there is a genuinely compelling technical reason. The book/page-turn system is built from CSS 3D transforms (`perspective`, `transform-style: preserve-3d`, `rotateY()`) and vanilla JS state management — no page-turn library, no animation framework, no large dependency.

The project should remain extremely lightweight.

### Dependencies

Keep dependencies close to zero.

Prefer:

```text
CSS
Vanilla JS
Native browser APIs (pointer/touch events, matchMedia, IntersectionObserver where useful)
Inline SVG
Canvas 2D (for confetti only)
```

Do not add a page-turn library, a 3D/animation framework, or a confetti library — hand-roll all of it (Sections 16, 20).

---

# 5. Project Structure

```text
birthday/
│
├── public/
│   ├── images/
│   │   ├── memories/       (real photographs, used as scrapbook objects)
│   │   ├── decorations/    (birthday decorations: balloons, cake, ribbons, etc.)
│   │   ├── stickers/       (recurring sticker-style illustrations: cats, puppies, hearts, stars…)
│   │   └── backgrounds/    (paper textures, background art)
│   │
│   ├── audio/
│   │   └── birthday.mp3
│   │
│   └── favicon.svg
│
├── src/
│   ├── book/
│   │   ├── Book.js          (the reusable page-turn engine — shell, state machine, gestures, a11y)
│   │   └── pages.js         (builds the flat, data-driven `pages` array from src/data/)
│   │
│   ├── pages/                (one render function per page "type" — mounts content into a page element)
│   │   ├── Cover.js
│   │   ├── BirthdayPage.js   (reveal + cake/candle interaction + confetti)
│   │   ├── MemoryPage.js     (single photo as a scrapbook object)
│   │   ├── LoveNotesPage.js
│   │   ├── SurprisesPage.js
│   │   ├── LetterPage.js
│   │   └── FinalPage.js
│   │
│   ├── data/
│   │   ├── birthday.js
│   │   ├── memories.js
│   │   ├── loveNotes.js
│   │   ├── surprises.js
│   │   └── letter.js
│   │
│   ├── styles/
│   │   ├── reset.css
│   │   ├── variables.css
│   │   ├── global.css
│   │   ├── book.css           (spine, page surfaces, 3D flip animation, responsive book shell)
│   │   ├── components.css
│   │   ├── scrapbook.css      (paper/tape/Polaroid/sticker primitives — reused inside pages)
│   │   ├── animations.css
│   │   └── responsive.css
│   │
│   ├── utils/
│   │   ├── animation.js
│   │   ├── audio.js
│   │   ├── confetti.js
│   │   └── stickers.js
│   │
│   └── main.js
│
├── index.html
├── package.json
├── vite.config.js
├── README.md
└── .gitignore
```

Do not create files simply to satisfy the structure. If a file does not need to exist, do not create it.

---

# 6. Content Architecture

Content stays separated from presentation, in `src/data/`. The `src/book/pages.js` module reads this content and produces the flat, data-driven `pages` array the Book engine renders — no personal content is hardcoded into `src/book/` or `src/pages/`.

```js
export const birthday = {
  name: "Her Name",
  introLine: "A little book about you.",
  revealLines: ["Today is a little different.", "Her Name", "Happy Birthday."],
  finalTitle: "There's one more thing.",
  finalMessage: ["..."]
};
```

```js
export const memories = [
  { image: "/images/memories/01.webp", caption: "...", alt: "...", date: "..." }
];

export const loveNotes = [{ title: "...", message: "..." }];

export const surprises = [{ type: "envelope", prompt: "...", reveal: "..." }];

export const letter = { salutation: "...", paragraphs: ["..."], signoff: "...", name: "..." };
```

Do not invent relationship-specific content (favorite animal, inside jokes, specific memories) — leave placeholders until supplied.

---

# 7. Page Architecture (data-driven)

The book renders from one flat array of page definitions, not a hand-authored spread-by-spread layout. This is the important part: **the scrapbook page content is data-driven**, assembled once in `src/book/pages.js`:

```js
const pages = [
  { id: "birthday-deco", type: "decorative", label: "Birthday", render },
  { id: "birthday-main", type: "birthday", label: "Birthday", render },
  { id: "memory-01", type: "memory", label: "Memories", render },
  // ...one entry per memory
  { id: "love-notes", type: "love-notes", label: "Things I Love About You", render },
  { id: "surprises", type: "surprises", label: "Little Surprises", render },
  { id: "letter", type: "letter", solo: true, label: "The Letter", render },
  { id: "final-text", type: "final", label: "One More Thing", render },
  { id: "final-collage", type: "final-collage", label: "One More Thing", render }
];
```

`final-text` and `final-collage` are two ordinary consecutive non-solo entries, not a `solo` page — they pair into a real spread automatically: the message stays uncluttered on the left, the photo collage gets the whole right page. Both are mounted independently by the engine but must reveal on the same "Open" tap, so `src/pages/FinalPage.js` closes over a small shared `opened` flag and a `revealCollage` callback between the two — the only page pair that needs to coordinate across the left/right boundary.

Each entry's `render(pageEl)` mounts that page's content and wiring (identical in spirit to the old per-scene `mount*` functions), and may return `{ focusTarget }` for accessibility.

The Cover is not in this array — it lives on the book's closed outer shell (Section 8.0), built separately by `buildCoverPage()` and mounted straight into `Book.js`, since it isn't a page you turn to, it's the object you open.

`solo: true` (Letter) means the page always sits alone with no content partner. Everything else — including the `final-text`/`final-collage` pair — is a normal page the Book engine pairs two-at-a-time into left/right spreads on desktop, or shows one at a time on mobile.

The Book engine does not know or care what a "birthday" or "memory" page contains — it only knows how to lay out and turn solo vs. paired pages. This keeps content changes (adding a memory, editing a note) a pure data change with zero engine code touched.

---

# 8. The Book Engine

## 8.0 The closed cover

The book mounts closed: a single, half-width object (the same width as one page — not the full two-page spread) with the cover art/title on its outer shell, page-turn controls hidden. Tapping "Open the book" plays a cover-opening flip (distinct from a page turn — no back face reveal needed, it just rotates away and disappears) revealing the Birthday spread, which is already mounted underneath and waiting. Partway through that flip — once the cover has rotated past ~90° and is already edge-on/invisible via `backface-visibility: hidden` — the book widens from single-page to full-spread width. The resize is a hard CSS state swap (`.book.is-closed` toggled off), not an animated width tween (`aspect-ratio` transitions aren't reliably animatable across browsers); timing it to land while the cover is already invisible is what makes it read as seamless instead of a jump cut.

## 8.1 Solo pages vs. paired spreads

On desktop, every page always has a partner. Consecutive non-solo pages pair two-at-a-time into spreads (`{ left, right }`) — this is how `final-text`/`final-collage` naturally become a real spread with no special-casing. A `solo` page (only the Letter) or an odd one left over from pairing doesn't get centered alone — it pairs with a generated blank facing page instead, and always sits on the **left**, the way a diary entry doesn't fill both sides of a spread. The blank page isn't empty for its own sake — it carries several scattered decorative stickers (Section 12), giving the "empty" side of the spread a reason to exist instead of looking bare.

## 8.2 Desktop vs. mobile

* **Desktop** (`≥768px`): two-page spreads, side by side, with a spine down the middle. Every group is spread-kind (solo content always has its blank partner), so the single-leaf partial flip (Section 9) is the only turn animation used here.
* **Mobile** (`<768px`): one physical page at a time, no blank partner inserted (a single visible page already matches the "one thing at a time" diary feeling without needing a facing blank). A `spread`-shaped page pair is walked one page at a time instead of two — the same underlying `pages` array, just stepped through differently.

Layout mode is read once via `matchMedia` at mount. If the viewport crosses the breakpoint mid-session (e.g. rotating a tablet), the book resets to the nearest safe boundary rather than attempting to preserve an exact position across two different pagination schemes — a deliberate simplicity tradeoff (Section 16).

## 8.3 Book state

```js
const state = {
  index,       // current position in the sequence of spreads/solo-pages
  isTurning,   // true while a turn animation is in flight
  direction    // "next" | "prev", drives which edge the page pivots from
};
```

No state-management library. A page turn is rejected outright while `isTurning` is true — this is what prevents rapid repeated clicks/swipes from corrupting the page state or double-advancing.

## 8.4 Page-turn behavior

```text
User initiates turn (click, swipe, arrow key)
        ↓
reject if isTurning or index out of range
        ↓
lock navigation (isTurning = true)
        ↓
mount new spread/page off-axis (pre-rotated, hidden behind current)
        ↓
animate current spread rotating away
        ↓
animate new spread rotating to rest
        ↓
remove old spread, unlock navigation
        ↓
move focus to new spread's heading, update the live-region label
```

---

# 9. Page-Turn Animation

**Chosen technique: whole-spread rotation, not a full physical page-engine.**

Rather than modeling every leaf of the book independently (front/back faces per page, independent pivot points, physics), each **spread** (or solo page) is one rotating unit. Turning "next" rotates the current spread away around its vertical axis while the new spread rotates in from the opposite angle — both using `perspective`, `transform-style: preserve-3d`, and `rotateY()`, with `backface-visibility: hidden` so a spread never shows mirrored/backwards content mid-rotation.

* **Desktop spreads** pivot at the spine (center) — the whole visible leaf appears to turn over the spine.
* **Solo / mobile single-page** turns pivot at the leading edge (right edge for "next", left edge for "prev") — closer to a single page turning.
* A brief shadow intensifies mid-turn (`box-shadow` transition) to sell the sense of a lifting page.

This was chosen deliberately over a true multi-face physical page-engine:

> A convincing CSS 3D page turn is preferable to a huge dependency or a complicated 3D book engine — the illusion only needs to be convincing, not physically exact.

Duration matches the rest of the app's `--duration-base`/`--duration-slow` tokens — no new timing system.

### Reduced motion

When `prefers-reduced-motion: reduce` is active, the 3D rotation is skipped entirely. Pages swap with the existing short fade (`.fade-in`/`.fade-out`, already used elsewhere in the app). The book metaphor remains understandable — content still changes discretely, page by page — even with zero rotation.

---

# 10. Navigation Controls

No traditional navbar. Controls are part of the book object itself:

```text
← Previous                         Next →
```

Subtle, visually integrated with the book (not a floating website toolbar). On mobile, swipe is the primary interaction; the controls remain present and accessible for anyone who can't or doesn't want to swipe.

Clicking a page turns the book **only** when the click lands on the page's own background — a click on any real interactive element inside the page (a button, a photo, a note trigger, the cake) does its own thing and must not also trigger a page turn.

---

# 11. Spread Content

## Cover (solo)

```text
A little book
about you

[Name]

❤️
```

Small, restrained decoration (a ribbon, a tiny flower, one sticker). A clear `Open the book` interaction. Opening transitions into the Birthday spread. This is the first impression — restraint matters most here.

## Birthday (spread: decoration | reveal + cake)

Left page: a photograph, illustration, or decorative composition. Right page:

```text
Happy Birthday

[Her Name]

I made a little something
for you.
```

The cake is a real interactive object living on the page, not a website button:

```text
Tap cake
   ↓
candles light
   ↓
small glow
   ↓
short confetti burst
   ↓
"Make a wish."
```

No microphone access, no candle-blowing interaction, in this phase (Section 20).

## Memories (one photo per page, auto-paired into spreads)

Not a gallery grid. Each photo is its own page, composed as a physical object: Polaroid frame, tape, a few degrees of rotation, a handwritten caption, a date, an occasional small doodle/sticker. Two consecutive memory pages naturally form a spread — two photographs facing each other, exactly like a real album.

Tapping a photo lifts and enlarges it in place, shows its caption, and can be closed to return to the spread — never a navigation away from the book.

## Things I Love About You (single page)

Small scrapbook notes rather than generic cards — a folded note, a sticky note, a tiny tag. Tapping one reveals its message on the same page (no route change). Content stays specific, never generic ("You're beautiful" etc.).

## Little Surprises (single page)

A handful (3–5) of small discoveries — an envelope, a folded note, a hidden photograph, a tiny cat/puppy sticker. Not a game: no scoring, no "find all N" mechanic. A few meaningful things to notice while paging through.

## The Letter (solo)

The quietest spread. Looks like a real letter placed inside the book — serif body text, generous margins, minimal animation, no facing page competing for attention. A subtle handwritten treatment is fine for a signature/annotation, never for the paragraphs themselves (readability wins).

## Final Page (spread: message | photo collage)

Closing the book, not another burst of activity. Left page carries the message, kept uncluttered:

```text
One more thing...

      🎁

   [Open]
```

Right page is reserved entirely for the scattered photo collage — no text competing with it for space. A single tap reveals both sides together: the message on the left and the collage on the right settle in at the same moment, even though they're two separate pages.

Opening reveals the final message — a gift box, envelope, final photograph, or folded note as the trigger object. Placeholder copy only; the real message is supplied later.

---

# 12. Cute Decorations & Illustration System

Birthday decorations are used as **scrapbook stickers/illustrations**, not repeated emoji scattered across the page.

* Prefer cohesive illustrated/sticker-style assets over emoji or mixed clip-art.
* Choose **one** consistent visual language and apply it to every decorative asset. Do not mix unrelated illustration styles.
* Decorations live in `public/images/decorations/` and `public/images/stickers/`, referenced by path from `src/data/` or the relevant `src/pages/*.js` — never hardcoded as inline emoji-heavy strings sprinkled through copy.
* A missing/unavailable decorative asset degrades gracefully — decorations are enhancement, not structure.
* Decorative images use empty `alt=""` and/or `aria-hidden="true"`.

### Cats and puppies

Recurring scrapbook stickers, small characters that live inside the book: a cat peeking behind a photograph, a puppy beside the cake, a cat holding a heart, a puppy next to the letter, a tiny animal on the final spread. Occasional tiny interactions are fine; never distracting.

**Do not invent a specific favorite animal or breed.** Use generic, easily-replaceable placeholder character assets — swappable by path once real information is supplied.

---

# 13. Confetti

Used sparingly, at meaningful moments only — primarily the cake/candle interaction.

```text
Tap cake
   ↓
Candles light
   ↓
Short confetti burst
   ↓
Birthday message revealed
```

Confetti must:

* be a small hand-rolled implementation (`src/utils/confetti.js`), not a library
* run once, briefly (well under 2 seconds), then fully clean itself up
* never block scrolling/tapping (`pointer-events: none`)
* never interfere with an in-progress page turn
* respect `prefers-reduced-motion` — skip entirely under reduced motion
* never run automatically on page load or on a page turn — only on the specific tap interaction it's attached to

---

# 14. Responsive Design

Mobile is the primary target. Design first for approximately `390 × 844`, then support `768px / 1024px / 1440px+`.

* Desktop: two-page spread, side by side, with a spine.
* Mobile: one physical page at a time (Section 8.2) — never a normal vertically-scrolling website. The book metaphor is preserved even when only one leaf is visible.
* Large tap targets, safe-area padding, no horizontal overflow, no tiny controls.
* Avoid viewport-height assumptions that break mobile browser chrome — use dynamic viewport units (`dvh`).
* Decorative stickers/tape must stay within the bounds of their parent page/photo, never via large negative offsets that widen the scrollable area.
* A page's own content (e.g. a long letter) may scroll internally within that page if it doesn't fit — the book shell itself never causes page-level scroll.

---

# 15. Accessibility

* Semantic HTML, proper heading hierarchy per page.
* Page-turn controls are real, labeled buttons — never a bare clickable `<div>`.
* Visible focus states throughout.
* Meaningful page labels; a visually-hidden `aria-live="polite"` status region announces the current spread on each turn (e.g. "Memories, page 3 of 9") without requiring the user to move focus themselves.
* After a turn completes, focus moves to the new spread's heading — deliberately, once per turn, not repeatedly or unpredictably ("avoid trapping keyboard users," "avoid a frustrating focus experience").
* Keyboard users can reach every page via ArrowRight/ArrowLeft and the Previous/Next buttons — swipe is not the only way to progress.
* Reduced motion is respected everywhere (Section 9).
* No information is communicated only through animation or only through a decorative sticker (e.g. the cake's lit/unlit state is reflected in text, not visuals alone).
* Image alt text for meaningful photographs; empty `alt=""` for decorative-only images/stickers.
* Buttons for actions rather than clickable generic elements.

---

# 16. Performance

* Minimal JavaScript and CSS.
* The book renders pages on demand as the user turns them — it does not need to mount the entire book's DOM at once.
* Optimized images (photographs and decorative/sticker assets); lazy-load images not needed immediately (a page one turn away can load eagerly, pages further out lazily).
* No page-turn library, no 3D/animation framework, no confetti library, no analytics, no API requests, no runtime data fetching.
* Prefer SVG for simple decorative illustrations (stickers, doodles, tape shapes); raster (WebP/AVIF) only for photographic/painterly detail.
* The first meaningful content (the closed cover) should appear immediately — no artificial loading screen.

---

# 17. Privacy

Assume the deployed URL is publicly accessible. Do not describe a secret URL as secure. Do not add authentication merely because it sounds sophisticated.

---

# 18. SEO / Metadata

```html
<title>Happy Birthday, [Name]</title>
<meta name="description" content="A little something I made for your birthday." />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="theme-color" content="..." />
```

Favicon and Open Graph metadata (`og:image` once a real hero/preview image exists — see the TODO in `index.html`). SEO is secondary to the actual experience.

---

# 19. Visual Direction

**Handcrafted Digital Scrapbook.** Think handmade, playful, warm, cute, personal — not a generic romantic website, not a corporate landing page, not an old-fashioned website pretending to be a book. Aim for **modern cute scrapbook**, not **skeuomorphism for its own sake**.

Visual characteristics, now applied to an actual physical book object:

* warm paper texture on every page
* subtle page shadows and page edges
* a suggested spine/binding
* slight paper variation, layered pages
* Polaroid-style photographs, masking/washi tape
* handwritten annotations, doodles, stickers, paper scraps, ribbons
* tiny hearts, stars, flowers, birthday decorations
* subtle shadows, occasional rotation of elements by a few degrees
* imperfect positioning that feels intentionally handmade

It should feel **designed**, not randomly messy.

### Important design constraint

Do NOT interpret "scrapbook" as permission to make everything visually chaotic. The design must have clear hierarchy, strong typography, intentional whitespace, readable text, controlled decoration, consistent illustration style, coherent spacing.

Think **beautifully assembled scrapbook**, not **Pinterest exploded onto the screen**. A page earns at most a handful of decorative elements (a piece of tape, one sticker, a rotated frame), not a dozen.

Color palette, spacing, and motion timing remain CSS custom properties in `src/styles/variables.css`.

### Color direction: pink

The palette is built entirely from shades of pink — soft blush paper, a deeper rose/berry book cover, rose-pink accent, pink-toned washi tape. This is a deliberate, explicit choice (not the generic "avoid excessive pink" default many romantic-themed briefs default to) — chosen and validated via a romantic/elegant reference palette (deep rose primary, pale pink background, berry foreground for contrast), not an arbitrary hot pink. Keep shades varied enough (pale blush paper vs. deep berry cover vs. mid-tone rose accent) that the page still reads with clear hierarchy — an all-one-pink page would flatten it.

---

# 20. Typography

* A refined **serif** for important emotional text (the letter body, the birthday name reveal) — Cormorant Garamond.
* A clean **sans-serif** for UI (buttons, labels, captions) — Inter.
* **One** handwritten/display font (Caveat), used only for occasional short annotations — never for paragraphs of body text.

Three font families total is the ceiling — do not add a fourth. Actual handwritten-annotation copy comes later and must not be invented ahead of time.

---

# 21. Component Responsibilities

### `src/book/Book.js`

The reusable engine: builds the spread/solo groupings from `pages`, owns `{ index, isTurning, direction }`, renders the book shell, drives the 3D page-turn animation (and its reduced-motion fallback), wires click/swipe/keyboard navigation, manages focus and the live-region announcement. Knows nothing about birthdays, cake, or love notes.

### `src/book/pages.js`

Assembles the flat, data-driven `pages` array from `src/data/*.js`, mapping each content type to its `src/pages/*.js` render function.

### `src/pages/*.js`

One render function per page type (Cover, BirthdayPage, MemoryPage, LoveNotesPage, SurprisesPage, LetterPage, FinalPage). Each mounts its own markup and interaction logic into the page element it's given and returns an optional `{ focusTarget }`. No page type knows about page-turning — that's the Book engine's job.

### `src/utils/*.js`

* `animation.js` — reduced-motion detection, stagger/fade helpers, transition waiting.
* `audio.js` — audio lifecycle (init/play/pause/toggle/failure).
* `confetti.js` — the small dependency-free confetti burst.
* `stickers.js` — shared inline-SVG sticker markup (cat, puppy, …).

---

# 22. Error Philosophy

The experience should degrade gracefully. If an optional image fails, a decorative sticker/texture fails to load, audio fails, or a non-critical JS error occurs, the book remains fully usable — never a stack trace or technical language shown to the recipient. A single failed page still renders its surrounding book correctly; a turn is never blocked by a content error on the page being turned to.

---

# 23. Testing Checklist

### Functional

* Cover opens into the Birthday spread
* every page reachable via Next/Prev, swipe, and keyboard
* rapid repeated clicks/swipes cannot corrupt the page state or skip pages
* cake/candle interaction works and triggers confetti once
* photographs lift/enlarge in place and close without leaving the book
* notes and surprises reveal in place, no route change
* letter and final page render correctly
* audio can be disabled; experience works without audio

### Book-specific

* desktop shows a genuine two-page spread with a spine
* mobile shows one page at a time without becoming a scrolling website
* page turn reads as a physical rotation, not a fade
* decorative stickers/tape never cause horizontal overflow
* a long page's own content scrolls internally rather than breaking the book shell

### Accessibility

* keyboard navigation reaches every page
* reduced motion replaces the 3D turn with a short fade and preserves all functionality
* screen reader-friendly structure; live-region announces the current spread
* focus moves once, predictably, after each turn

### Performance

* production build succeeds
* image optimization (photographs and decorative assets)
* no unnecessary third-party scripts

---

# 24. Development Rules for Claude

1. Do not over-engineer.
2. Do not add a framework unless explicitly requested.
3. Do not add a page-turn library, 3D framework, or confetti library — hand-roll it.
4. Do not create traditional website navigation.
5. Do not turn the project into multiple HTML pages or routes.
6. Keep personal content separate from presentation, in `src/data/`.
7. Prefer CSS over JavaScript for visual effects.
8. Prefer native browser APIs over libraries.
9. Mobile-first.
10. Keep animations subtle; the book should feel alive, not like a demo reel.
11. Keep the experience functional without audio.
12. Optimize images, including decorative/sticker assets.
13. Respect reduced motion — including the page turn itself, confetti, candle lighting, and sticker wobble.
14. Keep `Book.js` generic — it must not know about birthdays, cake, or any specific content type.
15. Do not invent personal details about the birthday girl (including a favorite animal).
16. Use placeholders where personal content has not yet been supplied.
17. Do not finalize emotional copy without the owner's input.
18. Do not add unnecessary features just because they are technically possible.
19. Do not make every scrapbook object interactive — interaction should feel intentional.
20. Do not mix unrelated illustration styles.
21. Do not add microphone access or a candle-blowing interaction in this phase.
22. Do not add decorative assets to the repository just to demonstrate the concept.
23. Do not build a complicated multi-face physical 3D book engine — a convincing whole-spread rotation is enough (Section 9).
24. Do not let a page turn be interruptible mid-animation into a corrupted state — always guard with `isTurning`.

---

# 25. Definition of Done

* The project runs locally with Vite; production build succeeds.
* The experience is one centered book; the browser is never scrolled through a sequence of full-screen sections.
* Cover → Birthday (with working cake/confetti) → Memories → Things I Love About You → Little Surprises → Letter → Final Page all reachable purely by turning pages.
* Desktop shows real two-page spreads; mobile shows one page at a time; both feel like the same book.
* Page turns rotate convincingly in 3D and cannot be spammed into a broken state.
* Swipe, click, and keyboard navigation all work.
* Reduced motion replaces the 3D turn with a short fade and preserves full functionality.
* Photographs, notes, and surprises reveal in place without leaving the book.
* Decorative elements follow one consistent illustration style, without clutter or horizontal overflow.
* Audio is optional; no unnecessary dependencies exist.
* No console errors; no broken imports.
* The project is easy to continue editing — content changes stay confined to `src/data/`.

The project is **not** considered emotionally finished until the real photographs, memories, writing, illustration/sticker assets, and personal details have been added.

---

# 26. Guiding Principle

The ideal reaction is:

> "You made this for me?"

Not "wow, that's a cool website" — and now, specifically: "wait, is this an actual little book you made?" That distinction should guide every design and technical decision.
