# Unravelled

Paste a public Spotify playlist link and Unravelled unspools it into a six-page
illustrated story: Scenery → Era → Character → Movie → Overall impression → Finale.
A ball of yarn shrinks page by page while a thread runs through five cats in the dock.

## Running

```bash
npm install
cp .env.example .env   # put your MISTRAL_API_KEY there (server-side only)
npm start              # http://localhost:3000
```

Art quality gate: open `/gallery` (all scenes × 3 seeds, icons × backdrops,
sample characters, compositions, activities, cats, with palette/seed pickers).

## How it works — no Spotify keys

1. **Track list** — `POST /api/playlist` fetches `https://open.spotify.com/embed/playlist/{id}`
   with a normal browser User-Agent, parses the JSON inside `<script id="__NEXT_DATA__">`
   and recursively collects every object with a track title + artist. Accepts
   `open.spotify.com/playlist/{id}` (with or without `?si=…`) and `spotify:playlist:{id}`.
   If the fetch fails or yields fewer than 5 tracks, the front page shows a manual
   track-paste textarea and the flow continues from that list (stable id = hash of text).
2. **Mood** — `POST /api/analyze` sends the tracks to the Mistral API
   (`mistral-large-latest`, JSON mode, temperature 0.3) and validates every id field
   server-side against the libraries in `public/art/lists.js` (invalid ids are replaced
   with the closest valid one — never a crash). Human-readable text is written in the
   chosen language (en/ru/be/fr); song titles, artists and the lyric quote stay original.
3. **Quote** — `GET /api/quote?artist=&title=` calls the free `api.lyrics.ovh` API;
   one line, max 12 words, tried over 3 candidates. Never invented.

The only secret is `MISTRAL_API_KEY` in `.env`, used on the server only.
No Spotify Web API, no client id/secret, no OAuth, no image-generation APIs:
all art is inline SVG + CSS drawn by JS in `public/art/`.

## Structure

```
server.js               Express backend: /api/playlist, /api/analyze, /api/quote, static
public/index.html       app shell (header / stage / controls / dock)
public/style.css        grid layout, dock, responsive rules
public/app.js           CONFIG, page flow, ball/thread/cats logic
public/i18n.js          exact UI strings for en, ru, be, fr
public/gallery.html     /gallery art review page
public/art/lists.js     all id libraries (shared client + server validation)
public/art/engine.js    seeded PRNG, 16 palettes, lighting, textures, generators
public/art/scenes_a.js  13 scenes        public/art/scenes_b.js  11 scenes
public/art/icons.js     24 era icons + 8 backdrops
public/art/figures.js   parametric waist-up portrait builder
public/art/posters.js   14 poster compositions + 20 elements
public/art/activities.js 25 activity illustrations
public/art/cats.js      the 5 dock cats
```

Not affiliated with Spotify. All artwork is original SVG generated in the browser.
