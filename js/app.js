// Unravelled — main application.
// Fully keyless: the only input is a playlist link. Unravelled reads the
// track list from Spotify's public embed page (relayed through open CORS
// proxies since Spotify doesn't send CORS headers), analyzes 30-second
// audio previews with the Web Audio API, reads the cover's colours via
// oEmbed, and pulls lyric quotes from the free lyrics.ovh API.
// No accounts, no keys, nothing stored.

(function () {
  "use strict";

  const OEMBED_URL = "https://open.spotify.com/oembed?url=";
  const EMBED_URL = "https://open.spotify.com/embed/playlist/";
  const LYRICS_URL = "https://api.lyrics.ovh/v1/";
  const CORS_PROXIES = [
    u => u,
    u => "https://corsproxy.io/?url=" + encodeURIComponent(u),
    u => "https://api.allorigins.win/raw?url=" + encodeURIComponent(u),
    u => "https://api.codetabs.com/v1/proxy?quest=" + encodeURIComponent(u)
  ];

  const els = {};
  ["playlist-input", "input-error", "status-msg", "unravel-btn", "yarn-ball",
   "thread-line", "demo-toggle", "demo-list", "scene-stage", "scenery-body",
   "era-body", "character-body", "movie-body", "end-body"]
    .forEach(id => {
      const el = document.getElementById(id);
      els[id.replace(/-/g, "_")] = el;
    });

  const pages = ["page-home", "page-scenery", "page-era", "page-character", "page-movie", "page-end"];
  const BALL_SCALE = { "page-home": 1, "page-scenery": 0.78, "page-era": 0.58,
                       "page-character": 0.38, "page-movie": 0.18, "page-end": 0 };

  const MAX_AUDIO_TRACKS = 6;

  let state = null; // { profile, playlistName, track, quote, swatches, nTracks }

  // ---------- link parsing ----------

  function parsePlaylistId(input) {
    const m = String(input).match(/playlist[/:]([A-Za-z0-9]+)/);
    return m ? m[1] : null;
  }

  // ---------- keyless fetching ----------

  async function fetchWithProxies(url) {
    let lastErr = null;
    for (const proxy of CORS_PROXIES) {
      try {
        const res = await fetch(proxy(url));
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res;
      } catch (e) { lastErr = e; }
    }
    throw new Error("Couldn't reach Spotify right now — try again in a moment, or try a demo playlist.");
  }

  async function fetchPlaylistMeta(id) {
    const url = OEMBED_URL + encodeURIComponent("https://open.spotify.com/playlist/" + id);
    const res = await fetch(url);
    if (!res.ok) throw new Error("Couldn't read that playlist — is the link correct and public?");
    const data = await res.json();
    if (!data || !data.title) throw new Error("Couldn't read that playlist — is the link correct and public?");
    return { name: data.title, coverUrl: data.thumbnail_url || null };
  }

  async function fetchTrackList(id) {
    const res = await fetchWithProxies(EMBED_URL + id);
    const html = await res.text();
    const m = html.match(/<script id="__NEXT_DATA__" type="application\/json">(.*?)<\/script>/s);
    if (!m) throw new Error("Spotify's answer didn't include the track list — try again, or try a demo playlist.");
    const data = JSON.parse(m[1]);
    const entity = (((data.props || {}).pageProps || {}).state || {}).data || {};
    const ent = entity.entity || null;
    if (!ent || !Array.isArray(ent.trackList) || !ent.trackList.length) {
      throw new Error("Couldn't read that playlist — is the link correct and public?");
    }
    const tracks = ent.trackList.map(t => ({
      title: t.title,
      artist: (t.subtitle || "").replace(/\s*,\s*/g, ", "),
      duration_ms: t.duration || 0,
      previewUrl: (t.audioPreview && t.audioPreview.url) || null
    }));
    return { name: ent.name || null, tracks };
  }

  // ---------- lyrics (free, no key) ----------

  async function fetchLyrics(track) {
    try {
      const url = LYRICS_URL + encodeURIComponent(track.artist.split(",")[0].trim()) +
                  "/" + encodeURIComponent(cleanTitle(track.title));
      const res = await fetch(url);
      if (!res.ok) return null;
      const data = await res.json();
      if (!data || !data.lyrics) return null;
      return pickLyricLine(data.lyrics);
    } catch (e) { return null; }
  }

  function cleanTitle(t) {
    return t.replace(/\s*[-–(]\s*(feat\.?|with)\s.*$/i, "")
            .replace(/\s*\[.*?\]\s*/g, " ").replace(/\s*\(.*?\)\s*/g, " ").trim();
  }

  // Pick a quotable line: mid-song, reasonable length, not a repetition.
  function pickLyricLine(lyrics) {
    const lines = lyrics.split(/\r?\n/).map(l => l.trim())
      .filter(l => l.length >= 18 && l.length <= 70 && l.split(/\s+/).length >= 3);
    if (!lines.length) return null;
    const seen = new Set();
    const unique = lines.filter(l => {
      const key = l.toLowerCase().replace(/[^a-z]/g, "");
      if (seen.has(key)) return false;
      seen.add(key); return true;
    });
    const pool = unique.length ? unique : lines;
    return pool[Math.floor(pool.length / 2)];
  }

  // ---------- audio analysis (30s previews, Web Audio) ----------

  async function analyzePreviews(tracks, onStatus) {
    const withPreviews = tracks.filter(t => t.previewUrl);
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!withPreviews.length || !AC) return null;
    const sample = spreadSample(withPreviews, MAX_AUDIO_TRACKS);
    const ctx = new AC();
    const stats = [];
    for (let i = 0; i < sample.length; i++) {
      onStatus("listening to the songs… (" + (i + 1) + "/" + sample.length + ")");
      try {
        const res = await fetch(sample[i].previewUrl);
        if (!res.ok) continue;
        const buf = await res.arrayBuffer();
        const audio = await ctx.decodeAudioData(buf);
        stats.push({ track: sample[i], features: audioFeatures(audio) });
      } catch (e) { /* skip unplayable preview */ }
    }
    if (ctx.close) ctx.close();
    if (!stats.length) return null;
    const keys = ["energy", "brightness", "pulse", "tempo"];
    const avg = {};
    keys.forEach(k => { avg[k] = stats.reduce((s, x) => s + x.features[k], 0) / stats.length; });
    return { avg, perTrack: stats };
  }

  function spreadSample(arr, n) {
    if (arr.length <= n) return arr.slice();
    const out = [];
    for (let i = 0; i < n; i++) out.push(arr[Math.floor(i * arr.length / n)]);
    return out;
  }

  function audioFeatures(audioBuffer) {
    const ch = audioBuffer.getChannelData(0);
    const sr = audioBuffer.sampleRate;
    // analyze the middle 20 seconds (preview intros/outros skew energy)
    const start = Math.floor(ch.length * 0.15);
    const len = Math.min(Math.floor(sr * 20), ch.length - start);
    const x = ch.subarray(start, start + len);

    let sumSq = 0, zc = 0;
    for (let i = 0; i < len; i++) {
      sumSq += x[i] * x[i];
      if (i > 0 && ((x[i - 1] < 0 && x[i] >= 0) || (x[i - 1] >= 0 && x[i] < 0))) zc++;
    }
    const rms = Math.sqrt(sumSq / len);
    const zcr = zc / len;

    // energy flux in 50ms windows → pulse & rough tempo
    const win = Math.floor(sr * 0.05);
    const nWin = Math.floor(len / win);
    const energies = new Array(nWin);
    for (let w = 0; w < nWin; w++) {
      let s = 0;
      for (let i = w * win; i < (w + 1) * win; i++) s += x[i] * x[i];
      energies[w] = Math.sqrt(s / win);
    }
    let flux = 0, fluxCount = 0;
    const onsets = [];
    for (let w = 1; w < nWin; w++) {
      const d = energies[w] - energies[w - 1];
      if (d > 0) { flux += d; fluxCount++; }
      if (d > 0.02 && (onsets.length === 0 || w - onsets[onsets.length - 1] > 3)) onsets.push(w);
    }
    const pulse = fluxCount ? (flux / fluxCount) * 40 : 0; // punchiness
    let tempo = 110;
    if (onsets.length > 4) {
      const gaps = [];
      for (let i = 1; i < onsets.length; i++) gaps.push(onsets[i] - onsets[i - 1]);
      gaps.sort((a, b) => a - b);
      const med = gaps[Math.floor(gaps.length / 2)] * 0.05; // seconds
      if (med > 0.15) {
        let bpm = 60 / med;
        while (bpm < 70) bpm *= 2;
        while (bpm > 180) bpm /= 2;
        tempo = bpm;
      }
    }

    return {
      energy: Math.min(1, rms * 7),
      brightness: Math.min(1, zcr * 45),
      pulse: Math.min(1, pulse),
      tempo
    };
  }

  // ---------- cover colour analysis ----------

  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("cover-load-failed"));
      img.src = src;
    });
  }

  function analyzeCover(img) {
    const size = 48;
    const canvas = document.createElement("canvas");
    canvas.width = size; canvas.height = size;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, size, size);
    let pixels;
    try {
      pixels = ctx.getImageData(0, 0, size, size).data;
    } catch (e) { return null; }

    const buckets = { red: 0, orange: 0, yellow: 0, green: 0, teal: 0,
                      blue: 0, purple: 0, pink: 0, dark: 0, light: 0, gray: 0 };
    let sumL = 0, sumS = 0, n = 0;
    const swatches = [];

    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i], g = pixels[i + 1], b = pixels[i + 2];
      const { h, s, l } = rgbToHsl(r, g, b);
      sumL += l; sumS += s; n++;
      if (s < 0.14) {
        if (l < 0.22) buckets.dark++;
        else if (l > 0.78) buckets.light++;
        else buckets.gray++;
      } else if (l < 0.2) buckets.dark++;
      else if (h < 12) buckets.red++;
      else if (h < 40) buckets.orange++;
      else if (h < 65) buckets.yellow++;
      else if (h < 160) buckets.green++;
      else if (h < 195) buckets.teal++;
      else if (h < 250) buckets.blue++;
      else if (h < 290) buckets.purple++;
      else if (h < 335) buckets.pink++;
      else buckets.red++;
      if (i % 16 === 0 && swatches.length < 6) swatches.push([r, g, b]);
    }

    return { buckets, avgL: sumL / n, avgS: sumS / n, swatches };
  }

  function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const l = (max + min) / 2;
    let h = 0, s = 0;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
      else if (max === g) h = ((b - r) / d + 2) * 60;
      else h = ((r - g) / d + 4) * 60;
    }
    return { h, s, l };
  }

  // ---------- mood classification ----------
  // Combines three signals, strongest first:
  //   1. audio previews (energy / brightness / pulse / tempo)
  //   2. playlist + track name keywords
  //   3. cover colours

  const NAME_HINTS = [
    [/metal|death|doom|slayer|rage|angry|heavy|brutal|hardcore|scream|war|distort/i, "inferno"],
    [/dark|goth|black|storm|grave|evil|horror|haunt/i, "tempest"],
    [/sad|heartbreak|cry|lonely|melanchol|blue|miss|tears|grief/i, "noir"],
    [/chill|acoustic|folk|soft|calm|slow|quiet|cozy|rainy day|indie folk|moss|forest/i, "lush"],
    [/party|dance|club|edm|techno|workout|running|hype|energy|banger/i, "neon"],
    [/summer|beach|sun|happy|road trip|vacation|feel good|sunny|pop hits/i, "summer"],
    [/morning|coffee|peace|nature|garden|spring|flower|walk/i, "meadow"],
    [/focus|study|ambient|instrumental|space|cosmic|drone|minimal|post-rock|explore/i, "desert"],
    [/winter|cold|snow|ice|frozen|december|xmas|christmas/i, "winter"],
    [/night|midnight|lo-?fi|city|urban|jazz|late/i, "nightcity"],
    [/river|water|flow|lake|sea|ocean|sail/i, "river"]
  ];

  function classify(playlistName, tracks, audio, palette) {
    // --- signal 1: audio ---
    if (audio) {
      const f = audio.avg;
      const hot = f.energy > 0.45 || f.pulse > 0.4;
      const gentle = f.energy < 0.28 && f.brightness < 0.35;
      const bright = f.brightness > 0.45;
      if (hot && bright && f.tempo > 130) return PROFILES.inferno;
      if (hot && !bright && f.energy > 0.5) return PROFILES.tempest;
      if (hot && bright) return PROFILES.neon;
      if (hot && f.pulse > 0.25) return PROFILES.nightcity;
      if (gentle && f.tempo < 95) return PROFILES.lush;
      if (gentle) return PROFILES.winter;
      if (bright && f.energy > 0.3) return PROFILES.summer;
      if (bright) return PROFILES.meadow;
      if (f.energy < 0.35) return PROFILES.desert;
      if (f.tempo > 125) return PROFILES.neon;
      return PROFILES.nightcity;
    }

    // --- signal 2: name keywords (playlist + tracks) ---
    const names = [playlistName].concat(tracks.map(t => t.title)).join(" | ");
    for (const [re, key] of NAME_HINTS) {
      if (re.test(names)) return PROFILES[key];
    }

    // --- signal 3: cover colours ---
    if (palette) {
      const b = palette.buckets, total = Object.values(b).reduce((s, v) => s + v, 0) || 1;
      const share = k => b[k] / total;
      const warm = share("red") + share("orange") + share("yellow");
      const cool = share("blue") + share("teal");
      const green = share("green");
      const purple = share("purple") + share("pink");
      const dark = share("dark");
      const light = share("light");

      if (share("red") > 0.3 && dark > 0.2) return PROFILES.inferno;
      if (dark > 0.5 && warm > 0.2) return PROFILES.tempest;
      if (dark > 0.45 && cool > 0.2) return PROFILES.noir;
      if (dark > 0.45) return PROFILES.winterwood;
      if (purple > 0.25) return PROFILES.neon;
      if (warm > 0.4 && palette.avgL > 0.45) return PROFILES.summer;
      if (warm > 0.3) return PROFILES.desert;
      if (green > 0.3) return PROFILES.lush;
      if (cool > 0.35 && palette.avgL > 0.5) return PROFILES.river;
      if (cool > 0.35) return PROFILES.winter;
      if (light > 0.35) return PROFILES.meadow;
      if (dark > 0.3) return PROFILES.nightcity;
    }
    return PROFILES.nightcity;
  }

  // The quoted song: the analyzed track closest to the playlist's average mood.
  function pickQuoteTrack(audio, tracks) {
    if (!audio || !audio.perTrack.length) {
      return Object.assign({}, tracks[Math.floor(tracks.length / 2)]);
    }
    let best = audio.perTrack[0].track, bestD = Infinity;
    audio.perTrack.forEach(pt => {
      const f = pt.features, a = audio.avg;
      const d = Math.abs(f.energy - a.energy) * 2 +
                Math.abs(f.brightness - a.brightness) +
                Math.abs(f.tempo - a.tempo) / 120;
      if (d < bestD) { bestD = d; best = pt.track; }
    });
    return Object.assign({}, best);
  }

  function quoteBlock(state) {
    if (state.quote) {
      const cite = esc(state.track.title) +
        (state.track.artist ? " — " + esc(state.track.artist) : "");
      return '<div class="song-quote"><blockquote>“' + esc(state.quote) +
             '”</blockquote><cite>' + cite + "</cite></div>";
    }
    const swatches = (state.swatches || []).map(c =>
      '<span class="swatch" style="background:rgb(' + c.join(",") + ')"></span>').join("");
    return '<div class="song-quote"><blockquote>“' + esc(state.playlistName) +
           '”</blockquote><cite>' + esc(state.nTracks) + " songs, read through their sound, their names and the colours of the cover" +
           (swatches ? ' <span class="swatches">' + swatches + "</span>" : "") +
           "</cite></div>";
  }

  // ---------- content profiles ----------

  const PROFILES = {

    inferno: {
      label: "molten & merciless",
      scene: "volcano", sceneName: "The Volcano at Dusk",
      sceneText: "This playlist doesn't simmer — it erupts. Drums like falling rock, guitars like lava finding the shortest way downhill. Music that clears the room and then owns it.",
      era: {
        title: "The Bronze Age, 1200 BC",
        text: "An era of forge-fire and empire — when metal meant both swords and songs, and everything worth building was built loud.",
        icon: "flame"
      },
      character: {
        name: "Beatrix Kiddo", from: "Kill Bill",
        text: "Relentless, wronged, and incapable of walking away from a fight. She doesn't enter rooms — she cuts through them.",
        cfg: { bg: "#20100e", coat: "#26262c", coatShadow: "#141419", shirt: "#c34a36", hair: "#e8d9a0", accent: "#c34a36", hat: "none" }
      },
      movie: {
        title: "Mad Max: Fury Road", year: "2015",
        text: "A two-hour chase rendered in fire-orange and chrome. Every frame is a drum hit; the soundtrack is basically a war drum with a V8 attached.",
        cfg: { bg: "#1c0f0a", coat: "#3a2418", coatShadow: "#241509", shirt: "#e0662e", hair: "#2b1a10", accent: "#ff8c42", hat: "none", glasses: true }
      }
    },

    tempest: {
      label: "storm-dark & driving",
      scene: "stormOcean", sceneName: "The Ship in the Storm",
      sceneText: "Fast, heavy, and under a black sky. This playlist is a ship that refuses to come about — every song another wave over the bow, taken head-on.",
      era: {
        title: "The Age of Sail, 1780s",
        text: "Rum, ropes, and mutiny. An era when the horizon was the only law that held, and every voyage was a gamble with the sea.",
        icon: "compass"
      },
      character: {
        name: "Marv", from: "Sin City",
        text: "Built like a wall, gentle exactly once, terrifying always. He narrates his own storms and never checks the weather first.",
        cfg: { bg: "#14181f", coat: "#232a35", coatShadow: "#12161d", shirt: "#d9d2c0", skin: "#d8b48e", skinShadow: "#8f6b48", hair: "#1a1a1a", accent: "#c34a36", hat: "none" }
      },
      movie: {
        title: "The Lighthouse", year: "2019",
        text: "Two men, one storm, zero mercy. Black-and-white, blaring, and soaked — a horror film that moves like your heaviest track.",
        cfg: { bg: "#0e1116", coat: "#2b313d", coatShadow: "#171c25", shirt: "#e8e2d0", hair: "#3a2f22", accent: "#d9a441", hat: "cap", beard: true }
      }
    },

    noir: {
      label: "rain-slick & unresolved",
      scene: "rainyStreet", sceneName: "The Street After Midnight",
      sceneText: "Slow-burning and suspicious. This playlist walks with its collar up under streetlights, and every song knows something it isn't telling you.",
      era: {
        title: "Film-Noir Autumn, 1947",
        text: "Smoke in the offices, rain on the glass, jazz from a room you weren't invited into. The war was over; nobody said the peace had started.",
        icon: "film"
      },
      character: {
        name: "Rorschach", from: "Watchmen",
        text: "Never compromises, never blinks. He keeps a journal of everything wrong with the city — set to this tracklist, it would sound exactly like this.",
        cfg: { bg: "#161a22", coat: "#26211c", coatShadow: "#15100c", shirt: "#c9c2b2", hair: "#a83c2e", accent: "#a83c2e", hat: "fedora" }
      },
      movie: {
        title: "Blade Runner", year: "1982",
        text: "Neon reflected in puddles, saxophone smoke, questions with no answers. The definitive playlist for rain that never quite stops.",
        cfg: { bg: "#0f1420", coat: "#232c3a", coatShadow: "#121826", shirt: "#d9d2c0", hair: "#101418", accent: "#4dd6c1", hat: "none", glasses: true }
      }
    },

    winterwood: {
      label: "dark & moss-quiet",
      scene: "snowMountains", sceneName: "The Silent Pass",
      sceneText: "Cold, hushed, and enormous. This playlist is a walk through snowed-over pines — beautiful precisely because nothing in it raises its voice.",
      era: {
        title: "A Futuristic Winter, 2077",
        text: "The cities went quiet, the winters got long, and people started keeping warm with stories. Minimal machines, maximal silence.",
        icon: "snowflake"
      },
      character: {
        name: "San", from: "Princess Mononoke",
        text: "Raised by wolves, fluent in forest, allergic to cities. She fights for the quiet places — and this playlist sounds like her footsteps.",
        cfg: { bg: "#101a1f", coat: "#2a333a", coatShadow: "#161d22", shirt: "#d9d2c0", skin: "#e6b98c", hair: "#221a14", accent: "#c34a36", hat: "none" }
      },
      movie: {
        title: "The Revenant", year: "2015",
        text: "Frost, breath, and survival measured in hours. A soundtrack of strings and wind that trusts silence to do the heavy lifting.",
        cfg: { bg: "#131c22", coat: "#3a2f22", coatShadow: "#241c12", shirt: "#c9bfa8", hair: "#241a10", accent: "#7fa8c9", hat: "hood", beard: true }
      }
    },

    neon: {
      label: "electric & after-midnight",
      scene: "cityNight", sceneName: "The City at 2 AM",
      sceneText: "This playlist drives with the windows down through a city that refuses to sleep. Chrome, bass, and every traffic light turning green on approach.",
      era: {
        title: "Neon Summer, 1984",
        text: "Synthesizers, arcades, convertibles with the top down. The future looked like chrome and it looked like fun.",
        icon: "bolt"
      },
      character: {
        name: "Jareth, the Goblin King", from: "Labyrinth",
        text: "Caped, dramatic, chronically theatrical. He treats every hallway like a music video — this playlist is his walking speed.",
        cfg: { bg: "#14101f", coat: "#2c2440", coatShadow: "#191328", shirt: "#d9cfe8", skin: "#e6d4c0", hair: "#e8d9a0", accent: "#b06ff0", hat: "none" }
      },
      movie: {
        title: "Drive", year: "2011",
        text: "A getaway driver, a gold jacket, and a synthwave heartbeat. The night drive this playlist has been rehearsing for.",
        cfg: { bg: "#101426", coat: "#26262c", coatShadow: "#141419", shirt: "#e8c56e", skin: "#e6b98c", hair: "#241c12", accent: "#e8c56e", hat: "cap", glasses: true }
      }
    },

    summer: {
      label: "sun-warm & nostalgic",
      scene: "summerBeach", sceneName: "The Last Week of Summer",
      sceneText: "Bright, fast, and secretly a little sad — the good kind. This playlist is a beach day you already know is ending, played at full volume anyway.",
      era: {
        title: "Gold Rush Summer, 1849",
        text: "Everything felt possible and slightly unlawful. Dust, optimism, and the strong suspicion that the good times were temporary — they were.",
        icon: "sun"
      },
      character: {
        name: "Ferris Bueller", from: "Ferris Bueller's Day Off",
        text: "Charms teachers, borrows cars, treats life like a parade he's hosting. This playlist is his kind of day off.",
        cfg: { bg: "#1a2620", coat: "#2c3e34", coatShadow: "#1a281f", shirt: "#e8dcc8", skin: "#e6b98c", hair: "#3a2a16", accent: "#d9a441", hat: "none" }
      },
      movie: {
        title: "The Sandlot", year: "1993",
        text: "Endless afternoons, questionable legends about dogs, and a soundtrack that smells like sunscreen. Pure remembered summer.",
        cfg: { bg: "#20281c", coat: "#3a4a34", coatShadow: "#26321f", shirt: "#f2e6c8", skin: "#e6b98c", hair: "#4a3418", accent: "#e8823c", hat: "cap" }
      }
    },

    lush: {
      label: "lush & unhurried",
      scene: "forest", sceneName: "The Deep Green Wood",
      sceneText: "Layered, patient, and overgrown in the best way. This playlist is a cathedral of strings and moss — Hozier would feel at home here.",
      era: {
        title: "Victorian Autumn, 1873",
        text: "Gaslight, greenhouses, letters that took a month. An era of luxurious slowness, when even the sadness was beautifully upholstered.",
        icon: "leaf"
      },
      character: {
        name: "Sophie Hatter", from: "Howl's Moving Castle",
        text: "Cursed into patience and blooming anyway. She cleans up after wizards the way this playlist tidies a room: gently, completely.",
        cfg: { bg: "#16221a", coat: "#2e4a34", coatShadow: "#1c3024", shirt: "#d9cfa8", skin: "#e6b98c", hair: "#8a5a3a", accent: "#7ab661", hat: "none", scarf: "#a83c2e" }
      },
      movie: {
        title: "Pride & Prejudice", year: "2005",
        text: "Dawn fog, piano at a distance, fields that go on forever. A soundtrack so green you can practically smell the rain on it.",
        cfg: { bg: "#182016", coat: "#3a4232", coatShadow: "#232a1c", shirt: "#e8e2d0", skin: "#e6b98c", hair: "#4a3418", accent: "#7ab661", hat: "none" }
      }
    },

    river: {
      label: "clear & kind",
      scene: "river", sceneName: "The River Valley",
      sceneText: "Warm, acoustic, and easy to breathe in. This playlist is a slow current on a long afternoon — it doesn't rush anywhere, and it doesn't need to.",
      era: {
        title: "Renaissance Spring, 1504",
        text: "Lutes, frescoes, and the general feeling that the world had just been re-invented politely. Optimism with good manners.",
        icon: "flower"
      },
      character: {
        name: "Totoro", from: "My Neighbor Totoro",
        text: "Enormous, gentle, and outstanding at napping. He would absolutely fall asleep to this playlist, and that is a compliment.",
        cfg: { bg: "#1c2a20", coat: "#3e5c48", coatShadow: "#2a4032", shirt: "#d9d2c0", skin: "#8a9a86", skinShadow: "#5c6e5c", hair: "#3e5c48", accent: "#d9a441", hat: "none" }
      },
      movie: {
        title: "Amélie", year: "2001",
        text: "Paris in warm focus, small kindnesses, an accordion with good intentions. This playlist is its daydreaming cousin.",
        cfg: { bg: "#241c14", coat: "#4a3a26", coatShadow: "#302414", shirt: "#e8dcc8", skin: "#e6b98c", hair: "#241a10", accent: "#c34a36", hat: "none" }
      }
    },

    meadow: {
      label: "open-hearted & bright",
      scene: "meadow", sceneName: "The Meadow at First Light",
      sceneText: "Sunny without being naive. This playlist is a morning that actually keeps its promises — open sky, warm wind, somewhere to be.",
      era: {
        title: "Belle Époque Morning, 1899",
        text: "Café terraces, new art on every wall, and the unshakable belief that the century would be kind. It wasn't, but the mornings were.",
        icon: "sun"
      },
      character: {
        name: "Moana", from: "Moana",
        text: "Stubbornly hopeful, constitutionally incapable of staying on the Island. She'd sail straight into this playlist's horizon.",
        cfg: { bg: "#152830", coat: "#c34a36", coatShadow: "#8a2f26", shirt: "#e8dcc8", skin: "#c98a5c", skinShadow: "#8f5c3a", hair: "#241a10", accent: "#d9a441", hat: "none" }
      },
      movie: {
        title: "Little Women", year: "2019",
        text: "Sun-drenched childhood, bittersweet growing-up, and a piano theme that feels like a scarf knitted by someone who loves you.",
        cfg: { bg: "#1e2620", coat: "#3e4a44", coatShadow: "#28322c", shirt: "#e8dcc8", skin: "#e6b98c", hair: "#4a3418", accent: "#d9a441", hat: "none" }
      }
    },

    desert: {
      label: "vast & sparse",
      scene: "desert", sceneName: "The High Desert",
      sceneText: "Wide-open and unhurried, built on space rather than noise. This playlist is a horizon you can hear — long thoughts, long shadows.",
      era: {
        title: "Space Age Dusk, 1969",
        text: "The desert test sites went quiet and everyone looked up instead. Analog consoles, infinite skies, and no urgency to come home.",
        icon: "star"
      },
      character: {
        name: "The Man With No Name", from: "The Good, the Bad and the Ugly",
        text: "Speaks roughly nine words per film, all of them load-bearing. He rides through this playlist without once changing expression.",
        cfg: { bg: "#20180e", coat: "#5c4a2c", coatShadow: "#3a2e18", shirt: "#c9bfa8", skin: "#d8b48e", hair: "#2b1d12", accent: "#c34a36", hat: "none", beard: true }
      },
      movie: {
        title: "Dune", year: "2021",
        text: "Sand to the edges of the screen and a score that hums like a planet. Epic minimalism — this playlist, but with more sandworms.",
        cfg: { bg: "#241a10", coat: "#4a3a26", coatShadow: "#2e2416", shirt: "#d9cfa8", skin: "#e6b98c", hair: "#2b1d12", accent: "#e8823c", hat: "none" }
      }
    },

    winter: {
      label: "cold & aching",
      scene: "snowMountains", sceneName: "The Frozen Range",
      sceneText: "Slow, spacious, and quietly devastating. This playlist is breath in cold air — beautiful things said softly, at altitude.",
      era: {
        title: "A Futuristic Winter, 2077",
        text: "Long nights, warm rooms, and music that plays from somewhere far away. The future turned out to be mostly weather.",
        icon: "snowflake"
      },
      character: {
        name: "Elsa", from: "Frozen",
        text: "Elegant, guarded, and one chorus away from building something enormous out of ice. This playlist is her quieter, sadder solo.",
        cfg: { bg: "#141c28", coat: "#2c3e5c", coatShadow: "#1a283f", shirt: "#d9e4f0", skin: "#e6d4c0", hair: "#e8dcC8", accent: "#7fc4e8", hat: "none" }
      },
      movie: {
        title: "Arrival", year: "2016",
        text: "Time folds, strings swell, and grief is treated with dignity. A soundtrack that understands that slow is not the same as empty.",
        cfg: { bg: "#101822", coat: "#2a3240", coatShadow: "#181f2c", shirt: "#c9d4e0", skin: "#e6b98c", hair: "#241a10", accent: "#7fc4e8", hat: "none", glasses: true }
      }
    },

    nightcity: {
      label: "restless & glowing",
      scene: "cityNight", sceneName: "The City, Lights On",
      sceneText: "Restless, rhythmic, and best after dark. This playlist is a skyline from a moving window — every song another block, none of them boring.",
      era: {
        title: "Roaring Twenties Night, 1926",
        text: "Jazz at full volume, rules at full discount. An era that treated staying out late as a form of art.",
        icon: "film"
      },
      character: {
        name: "Nick Wilde", from: "Zootopia",
        text: "Fast-talking, sharp-dressed, allergic to sincerity — until he isn't. He'd hustle effortlessly to this playlist.",
        cfg: { bg: "#1a1420", coat: "#8a5a2c", coatShadow: "#5c3a18", shirt: "#e8dcc8", skin: "#e0985c", skinShadow: "#a86a34", hair: "#8a5a2c", accent: "#d9a441", hat: "none", glasses: true }
      },
      movie: {
        title: "Baby Driver", year: "2017",
        text: "Every scene cut to the beat, every getaway choreographed. The ultimate argument that a playlist can be a plot.",
        cfg: { bg: "#141824", coat: "#26262c", coatShadow: "#141419", shirt: "#c9d4e0", skin: "#e6b98c", hair: "#241a10", accent: "#c34a36", hat: "cap", glasses: true }
      }
    }
  };

  // ---------- era icons ----------

  const ERA_ICONS = {
    flame: '<path d="M50 8 Q70 34 58 52 Q72 48 76 34 Q88 62 62 82 Q40 96 26 78 Q12 62 26 44 Q30 60 42 60 Q34 40 50 8 Z" fill="{c}"/>',
    compass: '<circle cx="50" cy="50" r="40" fill="none" stroke="{c}" stroke-width="6"/><path d="M50 26 L62 62 L50 54 L38 62 Z" fill="{c}"/>',
    film: '<circle cx="50" cy="50" r="38" fill="none" stroke="{c}" stroke-width="6"/><circle cx="50" cy="50" r="10" fill="{c}"/><g fill="{c}"><circle cx="50" cy="24" r="4"/><circle cx="68" cy="63" r="4"/><circle cx="32" cy="63" r="4"/></g>',
    snowflake: '<g stroke="{c}" stroke-width="6" stroke-linecap="round"><path d="M50 10 V90"/><path d="M20 27 L80 73"/><path d="M80 27 L20 73"/><path d="M50 24 L40 14"/><path d="M50 24 L60 14"/><path d="M50 76 L40 86"/><path d="M50 76 L60 86"/></g>',
    bolt: '<path d="M56 6 L26 54 L46 54 L38 94 L76 42 L54 42 Z" fill="{c}"/>',
    sun: '<circle cx="50" cy="50" r="20" fill="{c}"/><g stroke="{c}" stroke-width="6" stroke-linecap="round"><path d="M50 8 V20"/><path d="M50 80 V92"/><path d="M8 50 H20"/><path d="M80 50 H92"/><path d="M20 20 L29 29"/><path d="M71 71 L80 80"/><path d="M80 20 L71 29"/><path d="M29 71 L20 80"/></g>',
    leaf: '<path d="M50 10 Q84 30 78 66 Q72 90 50 90 Q28 90 22 66 Q16 30 50 10 Z" fill="{c}"/><path d="M50 22 V84" stroke="#14351f" stroke-width="5"/>',
    flower: '<g fill="{c}"><circle cx="50" cy="30" r="12"/><circle cx="70" cy="50" r="12"/><circle cx="50" cy="70" r="12"/><circle cx="30" cy="50" r="12"/></g><circle cx="50" cy="50" r="10" fill="#14351f"/>',
    star: '<path d="M50 8 L62 40 L94 42 L68 62 L76 92 L50 74 L24 92 L32 62 L6 42 L38 40 Z" fill="{c}"/>'
  };

  function eraIcon(name, color) {
    return '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">' +
      (ERA_ICONS[name] || ERA_ICONS.star).replace(/\{c\}/g, color) + "</svg>";
  }

  // ---------- rendering ----------

  function show(pageId) {
    pages.forEach(p => {
      const el = document.getElementById(p);
      el.hidden = (p !== pageId);
    });
    const scale = BALL_SCALE[pageId];
    const ball = els.yarn_ball;
    if (scale === 0) {
      ball.style.opacity = "0";
      els.thread_line.classList.remove("visible");
    } else {
      ball.style.opacity = "1";
      ball.style.transform = "scale(" + scale + ")";
      if (pageId !== "page-home") els.thread_line.classList.add("visible");
    }
    ball.classList.remove("wobble");
    void ball.offsetWidth;
    ball.classList.add("wobble");
    window.scrollTo(0, 0);
    location.hash = pageId.replace("page-", "");
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, c =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  function renderScenery() {
    const p = state.profile;
    els.scene_stage.innerHTML = window.UNRAVELLED_SCENES[p.scene]();
    els.scenery_body.innerHTML =
      '<p class="kicker">page i — the scenery</p>' +
      "<h2>" + esc(p.sceneName) + "</h2>" +
      '<p class="prose">' + esc(p.sceneText) + "</p>" +
      quoteBlock(state) +
      '<p class="prose" style="margin-top:1.4rem;opacity:.7;font-size:.85rem">' +
      esc(state.playlistName) + " reads as <em>" + esc(p.label) + "</em>.</p>" +
      '<button class="next-btn" data-next="era">pull the thread <span aria-hidden="true">→</span></button>';
    show("page-scenery");
  }

  function renderEra() {
    const p = state.profile;
    els.era_body.innerHTML =
      '<div class="era-card">' +
      '<div class="era-icon">' + eraIcon(p.era.icon, "#d9a441") + "</div>" +
      "<div><p class=\"kicker\">page ii — the era</p>" +
      "<h2>" + esc(p.era.title) + "</h2>" +
      '<p class="prose">' + esc(p.era.text) + "</p></div></div>" +
      '<button class="next-btn" data-next="character">pull the thread <span aria-hidden="true">→</span></button>';
    show("page-era");
  }

  function renderCharacter() {
    const c = state.profile.character;
    els.character_body.innerHTML =
      '<p class="kicker">page iii — the character</p>' +
      "<h2>" + esc(c.name) + "</h2>" +
      '<div class="layout"><div class="portrait-frame">' +
      window.UNRAVELLED_PORTRAIT(c.cfg) + "</div><div>" +
      '<p class="prose">' + esc(c.text) + "</p>" +
      '<p class="prose" style="margin-top:1rem;opacity:.7;font-size:.85rem">from <em>' + esc(c.from) + "</em></p></div></div>" +
      '<button class="next-btn" data-next="movie">pull the thread <span aria-hidden="true">→</span></button>';
    show("page-character");
  }

  function renderMovie() {
    const m = state.profile.movie;
    els.movie_body.innerHTML =
      '<p class="kicker">page iv — the movie</p>' +
      "<h2>" + esc(m.title) + " <span style=\"opacity:.5;font-weight:300\">(" + esc(m.year) + ")</span></h2>" +
      '<div class="layout"><div class="portrait-frame">' +
      window.UNRAVELLED_PORTRAIT(m.cfg) + "</div><div>" +
      '<p class="prose">' + esc(m.text) + "</p></div></div>" +
      '<button class="next-btn" data-next="end">the last of the thread <span aria-hidden="true">→</span></button>';
    show("page-movie");
  }

  function renderEnd() {
    els.end_body.innerHTML =
      '<p class="kicker">the ball is unravelled</p>' +
      "<h2>Nothing left but the thread.</h2>" +
      '<p class="prose" style="margin-inline:auto">' +
      esc(state.playlistName) + " — unspooled into a " + esc(state.profile.label) +
      " place, a " + esc(state.profile.era.title.toLowerCase()) +
      ", and a story worth telling.</p>" +
      '<div class="thread-pile">' + window.UNRAVELLED_CATS.threadPile() + "</div>" +
      '<div class="cats-stage" id="cats-stage">' + window.UNRAVELLED_CATS.catsWatching() + "</div>" +
      '<p class="prose" id="cats-caption" style="margin-top:1rem;opacity:.7">the cats watched the whole thing. now they are leaving — the ball is gone.</p>' +
      '<button class="restart-btn" data-next="home">unravel another playlist</button>';
    show("page-end");
    setTimeout(() => {
      const stage = document.getElementById("cats-stage");
      const cap = document.getElementById("cats-caption");
      if (stage) {
        stage.style.transition = "opacity 1.6s ease";
        stage.innerHTML = window.UNRAVELLED_CATS.catsLeaving();
        stage.style.opacity = "0.85";
      }
      if (cap) cap.textContent = "…and they're off. cats have no sentiment. bring them a new ball.";
    }, 2600);
  }

  // ---------- flow ----------

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-next]");
    if (!btn) return;
    const next = btn.dataset.next;
    if (next === "era") renderEra();
    else if (next === "character") renderCharacter();
    else if (next === "movie") renderMovie();
    else if (next === "end") renderEnd();
    else if (next === "home") { state = null; show("page-home"); }
  });

  function status(msg, isError) {
    els.status_msg.hidden = false;
    els.status_msg.textContent = msg;
    els.status_msg.style.color = isError ? "#ff9d8a" : "";
  }

  async function runDemo(demoKey) {
    const demo = window.UNRAVELLED_DEMO[demoKey];
    status("unravelling…");
    await new Promise(r => setTimeout(r, 700));
    state = {
      profile: null,
      playlistName: demo.name,
      track: { title: demo.tracks[0].name, artist: demo.tracks[0].artists.join(", ") },
      quote: demo.tracks[0].quote,
      swatches: null,
      nTracks: demo.tracks.length
    };
    const avg = averageFeatures(demo.tracks.map(t => Object.assign({}, t, { features: t })));
    state.profile = pickProfileByFeatures(avg);
    status("");
    renderScenery();
  }

  function averageFeatures(tracks) {
    const keys = ["energy", "valence", "acousticness", "instrumentalness", "danceability", "tempo"];
    const avg = {};
    keys.forEach(k => {
      avg[k] = tracks.reduce((s, t) => s + (t.features[k] || 0), 0) / tracks.length;
    });
    return avg;
  }

  function pickProfileByFeatures(avg) {
    const { energy, valence, acousticness, instrumentalness, danceability, tempo } = avg;
    const dark = valence < 0.32;
    const bright = valence > 0.62;
    const hot = energy > 0.78;
    const slow = tempo < 95 && energy < 0.55;
    const lush = acousticness > 0.55;

    if (hot && dark && energy > 0.85) return PROFILES.inferno;
    if (hot && dark) return PROFILES.tempest;
    if (dark && energy < 0.5 && acousticness < 0.5) return PROFILES.noir;
    if (dark && lush) return PROFILES.winterwood;
    if (bright && energy > 0.6) return PROFILES.summer;
    if (hot && danceability > 0.6) return PROFILES.neon;
    if (lush && slow) return PROFILES.lush;
    if (lush && bright) return PROFILES.river;
    if (bright) return PROFILES.meadow;
    if (instrumentalness > 0.35 || (energy < 0.45 && valence < 0.5)) return PROFILES.desert;
    if (tempo < 90) return PROFILES.winter;
    return PROFILES.nightcity;
  }

  async function runPlaylist(raw) {
    const id = parsePlaylistId(raw);
    if (!id) {
      els.input_error.hidden = false;
      els.input_error.textContent = "That doesn't look like a Spotify playlist link.";
      return;
    }
    els.input_error.hidden = true;
    els.unravel_btn.disabled = true;
    try {
      status("spinning the thread…");
      let meta = null, trackData = null;
      try {
        meta = await fetchPlaylistMeta(id);
      } catch (e) { meta = { name: null, coverUrl: null }; }
      status("reading the track list…");
      try {
        trackData = await fetchTrackList(id);
      } catch (e) {
        if (!meta.name) throw e; // both sources failed → real error
      }

      const playlistName = (trackData && trackData.name) || meta.name || "your playlist";
      const tracks = (trackData && trackData.tracks) || [];

      if (!tracks.length) {
        // track list unreachable → cover-only mode
        status("reading the cover…");
        let palette = null;
        if (meta.coverUrl) {
          try { palette = analyzeCover(await loadImage(meta.coverUrl)); } catch (e) {}
        }
        finish({ profile: classify(playlistName, [], null, palette),
                 playlistName, tracks: [], quote: null, swatches: palette ? palette.swatches : null });
        return;
      }

      status("listening to the songs…");
      const audio = await analyzePreviews(tracks, status);

      let palette = null;
      if (meta.coverUrl) {
        try { palette = analyzeCover(await loadImage(meta.coverUrl)); } catch (e) {}
      }

      status("finding the right song to quote…");
      const quoteTrack = pickQuoteTrack(audio, tracks);
      let quote = await fetchLyrics(quoteTrack);
      if (!quote) {
        // try a couple more tracks before giving up on lyrics
        for (const t of spreadSample(tracks, 3)) {
          quote = await fetchLyrics(t);
          if (quote) { quoteTrack.title = t.title; quoteTrack.artist = t.artist; break; }
        }
      }
      finish({ profile: classify(playlistName, tracks, audio, palette),
               playlistName, tracks, quote,
               track: quoteTrack, swatches: palette ? palette.swatches : null });
    } catch (err) {
      els.input_error.hidden = false;
      els.input_error.textContent = err.message;
    } finally {
      els.status_msg.hidden = true;
      els.unravel_btn.disabled = false;
    }
  }

  function finish(result) {
    state = {
      profile: result.profile,
      playlistName: result.playlistName,
      track: result.track || { title: result.playlistName, artist: "" },
      quote: result.quote,
      swatches: result.swatches,
      nTracks: result.tracks.length
    };
    status("");
    renderScenery();
  }

  // ---------- wiring ----------

  els.unravel_btn.addEventListener("click", () => runPlaylist(els.playlist_input.value));
  els.playlist_input.addEventListener("keydown", e => {
    if (e.key === "Enter") runPlaylist(els.playlist_input.value);
  });
  els.playlist_input.addEventListener("input", () => { els.input_error.hidden = true; });

  els.demo_toggle.addEventListener("click", () => {
    els.demo_list.hidden = !els.demo_list.hidden;
  });

  document.querySelectorAll(".demo-btn").forEach(btn => {
    btn.addEventListener("click", () => runDemo(btn.dataset.demo));
  });

  window.UNRAVELLED_LOADED = 3;
  show("page-home");
})();
