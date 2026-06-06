# 💖 A Special Question

An interactive, animated proposal experience — a retro pixel boot-up, a typewriter love poem, the big question, a celebration, love letters, a photo gallery, an "our story" timeline, music, and a downloadable keepsake.

## Run it

Just open `index.html` in any modern web browser. No build step or server needed.

## Project structure

| File | Purpose |
|------|---------|
| `index.html` | Page structure and all screens |
| `style.css` | Original styling and animations |
| `enhancements.css` | Visual polish + new-feature styling |
| `script.js` | Core experience (boot, dialogue, question, celebration, love letters) |
| `enhancements.js` | New features: photo gallery, timeline, music, keepsake |

## Personalize it

Everything editable lives near the top of `enhancements.js`:

- **Photos** — drop `photo1.jpg … photo8.jpg` into this folder; they appear in the gallery automatically. Edit captions in `galleryPhotos`.
- **Timeline** — edit `timelineMilestones` with your real dates and moments.
- **Music** — add a song named `music.mp3` (or `music.ogg`); if none is found, a soft built-in melody plays.
- **Keepsake** — edit `keepsakeMessage`.

The love-letter text and opening poem live in `script.js` (`loveLetters` and `poemLines`).
