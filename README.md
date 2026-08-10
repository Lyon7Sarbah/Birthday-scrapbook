# Birthday Experience

A single-page, cinematic birthday story built with Vite + vanilla JS. No framework, no backend.

## Run locally

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

## Editing content

All personal copy lives in `src/data/`:

- `birthday.js` — name, intro line, reveal lines, final message
- `memories.js` — photo memories (image path, caption, alt text, date)
- `loveNotes.js` — tappable note cards (title + message)
- `surprises.js` — the Little Surprises page (type, prompt, reveal)
- `letter.js` — the letter scene (salutation, paragraphs, sign-off)

Replace the `[bracketed placeholders]` with real content. No component code needs to change.

## Adding real photos

Drop optimized `.webp`/`.avif` images into `public/images/memories/` and point each memory's `image` field at the path (e.g. `/images/memories/01.webp`). If an image is missing or fails to load, the scene shows an elegant text placeholder instead of a broken image icon.

## Adding music

Drop an MP3 at `public/audio/birthday.mp3`. Playback starts on the "Begin" tap (browsers block autoplay without a user gesture). If the file is missing, the experience continues silently — no error is shown.

## Adding scrapbook decorations

Drop illustration assets into `public/images/decorations/` (birthday decor), `public/images/stickers/` (recurring sticker-style characters), or `public/images/backgrounds/` (paper textures). Prefer SVG for simple illustrations, WebP/AVIF for anything painterly. Keep every asset in one consistent illustration style — see `architecture.md` §20.

## Design tokens

Colors, type, spacing, and motion timing are all CSS custom properties in `src/styles/variables.css`. Change the palette or fonts there without touching any component.
