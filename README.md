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

## Spotify & Genius keys (optional)

The site runs entirely in your browser. To unravel **real** playlists, it needs
Client Credentials from your own [Spotify app](https://developer.spotify.com/dashboard):

1. Create an app in the Spotify dashboard (no redirect URIs needed).
2. Open **"spotify & genius keys"** on the front page and paste the Client ID and Client Secret.
3. Keys are stored only in your browser's `localStorage` and sent directly to Spotify.

Optionally add a Genius API token to attach a "full lyrics" link to the quoted song.

**No keys? No problem** — use **"try a demo playlist"** on the front page to see the full
experience with three built-in sample playlists (dark & heavy, sunny & nostalgic, lush & slow).

## How the mood analysis works

For each track, Unravelled reads Spotify's audio features (energy, valence, tempo,
acousticness, instrumentalness, danceability), averages them across the playlist, and maps
the result to one of twelve mood profiles — each with its own scenery, color palette,
era, character and movie. If Spotify's audio-features endpoint is unavailable for your app,
rough features are estimated from track durations and title keywords instead.

## Structure

```
index.html        — page shell and yarn ball
css/styles.css    — deep-green theme, responsive layout
js/app.js         — Spotify API, mood analysis, page flow
js/scenes.js       — 11 minimalist SVG sceneries
js/portraits.js    — "This Is The Police"-style portrait generator
js/cats.js         — the finale cats & thread pile
js/demo-data.js    — demo playlists with embedded audio features
```

Not affiliated with Spotify or Genius. All artwork is original SVG generated in the browser.
