/* Unravelled — server. Only secret: MISTRAL_API_KEY in .env (server-side only).
   No Spotify API, no keys for Spotify: reads the public embed page. */
'use strict';
const fs = require('fs');
const path = require('path');
const express = require('express');
const LISTS = require('./public/art/lists.js');

// load .env if present (no dotenv dependency)
try {
  const env = fs.readFileSync(path.join(__dirname, '.env'), 'utf8');
  for (const line of env.split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (e) { /* no .env — fine */ }

const app = express();
app.use(express.json({ limit: '256kb' }));
app.use(express.static(path.join(__dirname, 'public')));
app.get('/gallery', (req, res) => res.sendFile(path.join(__dirname, 'public', 'gallery.html')));

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

/* ---------- POST /api/playlist ---------- */
function extractPlaylistId(link) {
  let m = String(link).match(/open\.spotify\.com\/playlist\/([A-Za-z0-9]+)/);
  if (m) return m[1];
  m = String(link).match(/spotify:playlist:([A-Za-z0-9]+)/);
  return m ? m[1] : null;
}
function collectTracks(node, out, seen) { // recursive walk: any object with a track title and an artist name
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) { node.forEach(n => collectTracks(n, out, seen)); return; }
  const title = node.title || (node.track && node.track.name) || (node.name && (node.artists || node.subtitle) ? node.name : null);
  let artist = null;
  const artists = node.artists || (node.track && node.track.artists);
  if (Array.isArray(artists) && artists.length) artist = artists.map(a => a && a.name).filter(Boolean).join(', ');
  if (!artist && typeof node.subtitle === 'string' && node.subtitle) artist = node.subtitle; // embed trackList format
  const isContainer = node.trackList || (Array.isArray(node.tracks) && typeof node.name === 'string');
  if (!isContainer && typeof title === 'string' && title && artist && !seen.has(title + '|' + artist)) {
    seen.add(title + '|' + artist);
    out.push({ title, artist });
  }
  for (const k of Object.keys(node)) collectTracks(node[k], out, seen);
}
app.post('/api/playlist', async (req, res) => {
  try {
    const id = extractPlaylistId(req.body && req.body.link || '');
    if (!id) return res.status(400).json({ error: 'invalid link' });
    const r = await fetch(`https://open.spotify.com/embed/playlist/${id}`, { headers: { 'User-Agent': UA, 'Accept': 'text/html' } });
    if (!r.ok) return res.status(502).json({ error: 'embed fetch failed', tracks: [] });
    const html = await r.text();
    const m = html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);
    if (!m) return res.status(502).json({ error: 'no data', tracks: [] });
    let data; try { data = JSON.parse(m[1]); } catch (e) { return res.status(502).json({ error: 'bad json', tracks: [] }); }
    const tracks = []; collectTracks(data, tracks, new Set());
    let playlistTitle = 'Playlist';
    (function findName(n) {
      if (!n || typeof n !== 'object' || playlistTitle !== 'Playlist') return;
      if (typeof n.name === 'string' && n.name && (n.trackList || n.tracks)) playlistTitle = n.name;
      else if (typeof n.title === 'string' && n.title && n.trackList) playlistTitle = n.title;
      for (const k of Object.keys(n)) findName(n[k]);
    })(data.props && data.props.pageProps);
    res.json({ playlistId: id, playlistTitle, tracks: tracks.slice(0, 100) });
  } catch (e) {
    res.status(502).json({ error: 'fetch failed', tracks: [] });
  }
});

/* ---------- POST /api/analyze ---------- */
const MISTRAL_URL = 'https://api.mistral.ai/v1/chat/completions';
function systemPrompt(lang) {
  const langName = { en: 'English', ru: 'Russian', be: 'Belarusian', fr: 'French' }[lang] || 'English';
  return `You are the analysis engine of "Unravelled". Given a playlist's tracks, return EXACTLY one JSON object:
{
 "energy":0-1, "valence":0-1, "darkness":0-1, "aggression":0-1,
 "tempo":"slow|mid|fast|mixed",
 "scene": SCENES id, "scene_title": short poetic name,
 "palette": PALETTES id,
 "time_of_day": "dawn|day|golden|dusk|night",
 "weather": "clear|cloudy|rain|snow|fog|storm",
 "era": {"name":"...", "season":"...", "feel":"one sentence", "icon": ICONS id, "backdrop": BACKDROPS id},
 "character": {"name":"...", "source":"movie/cartoon title", "why":"max 20 words",
   "look": {"species":"human|robot|animal", "animal_type": ANIMALS id or null, "body": BODIES id, "skin": SKINS id, "head": HEADS id,
            "hair": HAIRS id, "hair_color": SLOT, "facial_hair": FACIAL id, "headwear": HEADWEAR id, "outfit": OUTFITS id,
            "outfit_color": SLOT, "accessory": ACCESSORIES id, "prop": PROPS id, "pose": POSES id,
            "expression": EXPRESSIONS id, "background": FIGURE_BACKGROUNDS id}},
 "movie": {"title":"...", "year": number or null, "why":"max 20 words",
   "art": {"composition": COMPOSITIONS id, "time_of_day": "dawn|day|golden|dusk|night", "elements": [1-3 ids from ELEMENTS]}},
 "activity": {"title":"...", "why":"max 20 words", "scene_id": ACTIVITIES id, "time_of_day": "dawn|day|golden|dusk|night"},
 "quote_candidates": [3 songs from the playlist that fit the mood: {"song":"...","artist":"..."}],
 "summary": "one line"
}
SLOT = one of ink, shadow, base, mid, light, accent.
Allowed ids — choose ONLY from these lists:
SCENES: ${LISTS.SCENES.join(',')}
PALETTES: ${LISTS.PALETTES.join(',')}
ICONS: ${LISTS.ICONS.join(',')}
BACKDROPS: ${LISTS.BACKDROPS.join(',')}
ANIMALS: ${LISTS.ANIMALS.join(',')}
BODIES: ${LISTS.BODIES.join(',')}
SKINS: ${LISTS.SKINS.join(',')}
HEADS: ${LISTS.HEADS.join(',')}
HAIRS: ${LISTS.HAIRS.join(',')}
FACIAL: ${LISTS.FACIAL.join(',')}
HEADWEAR: ${LISTS.HEADWEAR.join(',')}
OUTFITS: ${LISTS.OUTFITS.join(',')}
ACCESSORIES: ${LISTS.ACCESSORIES.join(',')}
PROPS: ${LISTS.PROPS.join(',')}
POSES: ${LISTS.POSES.join(',')}
EXPRESSIONS: ${LISTS.EXPRESSIONS.join(',')}
FIGURE_BACKGROUNDS: ${LISTS.FIGURE_BACKGROUNDS.join(',')}
COMPOSITIONS: ${LISTS.COMPOSITIONS.join(',')}
ELEMENTS: ${LISTS.ELEMENTS.join(',')}
ACTIVITIES: ${LISTS.ACTIVITIES.join(',')}
Rules:
- The character is a real character from an existing movie, cartoon, series or anime; the link to the playlist must feel natural. Describe the character as closely as the lists allow.
- The movie is a real existing film whose soundtrack could plausibly be this playlist. If unsure of the year, return null. Never invent a film.
- VARIETY: consider at least 10 candidates internally for character and movie, across decades, countries, live action and animation; avoid the single most obvious blockbuster unless it clearly fits best.
- The era is specific: a real historical period + place + season (e.g. "Paris, the 1920s, late spring") or a believable future/fantasy setting. Never generic.
- Activity = what a person could be doing while this music plays.
- Write all human-readable text fields in ${langName}. Keep all id fields in English exactly as listed.`;
}
function closest(valid, val, fallback) {
  if (valid.includes(val)) return val;
  if (typeof val === 'string') {
    const v = val.toLowerCase();
    const hit = valid.find(x => x.includes(v) || v.includes(x));
    if (hit) return hit;
  }
  return fallback;
}
function validate(a) { // never crash: replace invalid ids with closest valid
  const g = (v, list, fb) => closest(list, v, fb);
  a.tempo = g(a.tempo, LISTS.TEMPO, 'mixed');
  a.time_of_day = g(a.time_of_day, LISTS.TIMES, 'day');
  a.weather = g(a.weather, LISTS.WEATHERS, 'clear');
  a.scene = g(a.scene, LISTS.SCENES, 'meadow_summer');
  a.palette = g(a.palette, LISTS.PALETTES, 'golden_hour');
  const era = a.era || {};
  era.icon = g(era.icon, LISTS.ICONS, 'lantern');
  era.backdrop = g(era.backdrop, LISTS.BACKDROPS, 'sunburst');
  a.era = era;
  const ch = a.character || {};
  const look = ch.look || {};
  look.species = g(look.species, LISTS.SPECIES, 'human');
  look.animal_type = look.species === 'animal' ? g(look.animal_type, LISTS.ANIMALS, 'cat') : null;
  look.body = g(look.body, LISTS.BODIES, 'average');
  look.skin = g(look.skin, LISTS.SKINS, 'olive');
  look.head = g(look.head, LISTS.HEADS, 'oval');
  look.hair = g(look.hair, LISTS.HAIRS, 'short_side_part');
  look.hair_color = g(look.hair_color, LISTS.SLOTS, 'ink');
  look.facial_hair = g(look.facial_hair, LISTS.FACIAL, 'none');
  look.headwear = g(look.headwear, LISTS.HEADWEAR, 'none');
  look.outfit = g(look.outfit, LISTS.OUTFITS, 'trench_coat');
  look.outfit_color = g(look.outfit_color, LISTS.SLOTS, 'base');
  look.accessory = g(look.accessory, LISTS.ACCESSORIES, 'none');
  look.prop = g(look.prop, LISTS.PROPS, 'none');
  look.pose = g(look.pose, LISTS.POSES, 'standing_front');
  look.expression = g(look.expression, LISTS.EXPRESSIONS, 'neutral');
  look.background = g(look.background, LISTS.FIGURE_BACKGROUNDS, 'spotlight');
  ch.look = look; a.character = ch;
  const mv = a.movie || {};
  const art = mv.art || {};
  art.composition = g(art.composition, LISTS.COMPOSITIONS, 'lone_figure_road');
  art.time_of_day = g(art.time_of_day, LISTS.TIMES, a.time_of_day);
  art.elements = Array.isArray(art.elements) ? art.elements.slice(0, 3).map(e => g(e, LISTS.ELEMENTS, 'moon')) : ['moon'];
  mv.art = art; a.movie = mv;
  const ac = a.activity || {};
  ac.scene_id = g(ac.scene_id, LISTS.ACTIVITIES, 'wandering_old_city');
  ac.time_of_day = g(ac.time_of_day, LISTS.TIMES, a.time_of_day);
  a.activity = ac;
  if (!Array.isArray(a.quote_candidates)) a.quote_candidates = [];
  return a;
}
app.post('/api/analyze', async (req, res) => {
  const key = process.env.MISTRAL_API_KEY;
  const tracks = Array.isArray(req.body && req.body.tracks) ? req.body.tracks.slice(0, 100) : [];
  const lang = ['en', 'ru', 'be', 'fr'].includes(req.body && req.body.lang) ? req.body.lang : 'en';
  if (!key) return res.status(500).json({ error: 'MISTRAL_API_KEY is not configured on the server.' });
  if (!tracks.length) return res.status(400).json({ error: 'no tracks' });
  const trackList = tracks.map(t => `${t.artist} – ${t.title}`).join('\n');
  try {
    const r = await fetch(MISTRAL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: 'mistral-large-latest',
        temperature: 0.3,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemPrompt(lang) },
          { role: 'user', content: 'Playlist tracks:\n' + trackList }
        ]
      })
    });
    if (!r.ok) return res.status(502).json({ error: 'mistral error ' + r.status });
    const j = await r.json();
    const raw = j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content;
    let a; try { a = JSON.parse(raw); } catch (e) { return res.status(502).json({ error: 'bad json from model' }); }
    res.json({ analysis: validate(a) });
  } catch (e) {
    res.status(502).json({ error: 'analysis failed' });
  }
});

/* ---------- GET /api/quote ---------- */
app.get('/api/quote', async (req, res) => {
  try {
    const artist = String(req.query.artist || '').slice(0, 120);
    const title = String(req.query.title || '').slice(0, 120);
    if (!artist || !title) return res.status(400).json({ error: 'missing params' });
    const r = await fetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`, { headers: { 'User-Agent': UA } });
    if (!r.ok) return res.status(404).json({ error: 'no lyrics' });
    const j = await r.json();
    const lines = (j.lyrics || '').split('\n').map(l => l.trim()).filter(l => l && l.length > 4);
    const line = lines.find(l => l.split(/\s+/).length <= 12) || '';
    res.json({ line });
  } catch (e) {
    res.status(502).json({ error: 'quote failed' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Unravelled on http://localhost:${PORT}`));
