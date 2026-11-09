# Unravelled

Unravelled analyzes a Spotify playlist and unspools it into a small visual story:

1. **The Scenery** — a minimalist SVG landscape matched to the playlist's mood, with a quote from the song that best represents it.
2. **The Era** — a period of history (and its feel) that fits the sound, with an icon.
3. **The Character** — a movie/cartoon character who would own this playlist, drawn in the flat, hard-lit style of *This Is The Police*.
4. **The Movie** — an existing film that could carry this playlist as its soundtrack, in the same art style.
5. **The Finale** — the yarn ball is fully unravelled into a pile of thread, watched by cats who then lose interest and wander off.

A ball of yarn sits in the corner of every page and gets smaller as you progress, leaving a trailing thread behind.

## Running

It's a fully static site — open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
```

## How it works — no keys, no accounts

Paste a Spotify playlist link and Unravelled does everything in your browser:

1. **Track list** — read from Spotify's public embed page (relayed through open
   CORS proxies, since Spotify doesn't send CORS headers on it).
2. **Mood** — up to six 30-second audio previews are decoded with the Web Audio
   API and measured (energy, brightness, punchiness, rough tempo).
3. **Cover colours** — the playlist's cover art is read via Spotify's oEmbed
   endpoint and its palette analyzed on a canvas.
4. **Lyric quote** — pulled from the free lyrics.ovh API for the song that best
   matches the playlist's average mood.

These three signals (audio → name keywords → cover colours) are combined into one
of twelve mood profiles, each with its own scenery, colour palette, era, character
and movie. If some sources are unreachable, the site degrades gracefully to the
next signal. No accounts, no API keys, nothing stored.

**No link handy?** Use **"try a demo playlist"** on the front page — three built-in
sample playlists (dark & heavy, sunny & nostalgic, lush & slow) with the full experience.

## Structure

```
index.html        — page shell and yarn ball
css/styles.css    — deep-green theme, responsive layout
js/app.js         — keyless pipeline (embed page, previews, lyrics, colours), mood analysis, page flow
js/scenes.js       — 11 minimalist SVG sceneries
js/portraits.js    — "This Is The Police"-style portrait generator
js/cats.js         — the finale cats & thread pile
js/demo-data.js    — demo playlists with embedded audio features
```

Not affiliated with Spotify or Genius. All artwork is original SVG generated in the browser.
