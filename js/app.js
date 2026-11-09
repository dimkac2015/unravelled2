// Unravelled — main application.

(function () {
  "use strict";

  const SP_TOKEN_URL = "https://accounts.spotify.com/api/token";
  const SP_API = "https://api.spotify.com/v1";
  const GENIUS_API = "https://api.genius.com";

  const els = {};
  ["playlist-input", "input-error", "status-msg", "unravel-btn", "yarn-ball",
   "thread-line", "settings-toggle", "settings-panel", "settings-save",
   "settings-saved", "demo-toggle", "demo-list", "sp-client-id",
   "sp-client-secret", "genius-token", "scene-stage", "scenery-body",
   "era-body", "character-body", "movie-body", "end-body"]
    .forEach(id => {
      const el = document.getElementById(id);
      els[id.replace(/-/g, "_")] = el;
    });

  const pages = ["page-home", "page-scenery", "page-era", "page-character", "page-movie", "page-end"];
  const BALL_SCALE = { "page-home": 1, "page-scenery": 0.78, "page-era": 0.58,
                       "page-character": 0.38, "page-movie": 0.18, "page-end": 0 };

  let state = null; // { profile, playlistName, track, quote, quoteSource, geniusUrl }

  // ---------- storage ----------

  function loadSettings() {
    try {
      const s = JSON.parse(localStorage.getItem("unravelled-keys") || "{}");
      els.sp_client_id.value = s.cid || "";
      els.sp_client_secret.value = s.csecret || "";
      els.genius_token.value = s.genius || "";
    } catch (e) { /* ignore */ }
  }

  function saveSettings() {
    localStorage.setItem("unravelled-keys", JSON.stringify({
      cid: els.sp_client_id.value.trim(),
      csecret: els.sp_client_secret.value.trim(),
      genius: els.genius_token.value.trim()
    }));
    els.settings_saved.hidden = false;
    setTimeout(() => { els.settings_saved.hidden = true; }, 2000);
  }

  // ---------- spotify ----------

  function parsePlaylistId(input) {
    const m = String(input).match(/playlist[/:]([A-Za-z0-9]+)/);
    return m ? m[1] : null;
  }

  async function spotifyToken() {
    const cid = els.sp_client_id.value.trim();
    const csecret = els.sp_client_secret.value.trim();
    if (!cid || !csecret) throw new Error("no-keys");
    const res = await fetch(SP_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "grant_type=client_credentials&client_id=" + encodeURIComponent(cid) +
            "&client_secret=" + encodeURIComponent(csecret)
    });
    if (!res.ok) throw new Error("Spotify auth failed (" + res.status + ")");
    const data = await res.json();
    return data.access_token;
  }

  async function fetchPlaylist(id, token) {
    const metaRes = await fetch(SP_API + "/playlists/" + id + "?fields=name,tracks(total)", {
      headers: { Authorization: "Bearer " + token }
    });
    if (metaRes.status === 404) throw new Error("That playlist doesn't exist (or is private).");
    if (metaRes.status === 401) throw new Error("Spotify rejected the keys — check your Client ID/Secret.");
    if (!metaRes.ok) throw new Error("Spotify error (" + metaRes.status + ")");
    const meta = await metaRes.json();

    const tracks = [];
    let url = SP_API + "/playlists/" + id + "/tracks?limit=100&fields=next,items(track(name,artists(name),duration_ms))";
    while (url && tracks.length < 300) {
      const r = await fetch(url, { headers: { Authorization: "Bearer " + token } });
      if (!r.ok) throw new Error("Spotify error (" + r.status + ")");
      const d = await r.json();
      (d.items || []).forEach(it => {
        if (it.track && it.track.name) {
          tracks.push({
            name: it.track.name,
            artists: (it.track.artists || []).map(a => a.name),
            duration_ms: it.track.duration_ms
          });
        }
      });
      url = d.next;
    }
    if (!tracks.length) throw new Error("That playlist is empty.");
    return { name: meta.name, tracks };
  }

  async function fetchAudioFeatures(tracks, token) {
    const ids = tracks.map(t => t.id).filter(Boolean);
    const feats = new Map();
    for (let i = 0; i < ids.length; i += 100) {
      const batch = ids.slice(i, i + 100).join(",");
      try {
        const r = await fetch(SP_API + "/audio-features?ids=" + batch,
          { headers: { Authorization: "Bearer " + token } });
        if (!r.ok) return null;
        const d = await r.json();
        (d.audio_features || []).forEach(f => { if (f) feats.set(f.id, f); });
      } catch (e) { return null; }
    }
    return feats;
  }

  // Fallback when Spotify audio-features is unavailable (newer apps):
  // derive rough pseudo-features from track duration + title keywords.
  function pseudoFeatures(track) {
    const title = track.name.toLowerCase();
    const dur = (track.duration_ms || 210000) / 1000;
    let energy = clamp(0.9 - Math.abs(dur - 200) / 260, 0.15, 0.9);
    let valence = 0.5, acoustic = 0.4, tempo = clamp(90 + (220 - dur) * 0.6, 70, 175);
    const kw = [
      [/love|sun|summer|happy|dance|smile|gold|day|shine/, () => { valence = 0.85; energy += 0.08; }],
      [/rain|grey|alone|night|cold|winter|gone|goodbye|lost|dark/, () => { valence = 0.2; acoustic += 0.15; }],
      [/acoustic|unplugged|piano|strings|folk|forest|river/, () => { acoustic = 0.85; energy -= 0.1; tempo -= 15; }],
      [/fire|storm|thunder|war|iron|blood|wolf|metal|rage|burn/, () => { energy = 0.9; valence = 0.1; tempo += 25; }],
      [/run|fast|speed|light|electric|neon/, () => { energy = 0.8; tempo += 10; }]
    ];
    kw.forEach(([re, fn]) => { if (re.test(title)) fn(); });
    return {
      energy: clamp(energy, 0.05, 1), valence: clamp(valence, 0, 1),
      acousticness: clamp(acoustic, 0, 1), instrumentalness: 0.1,
      danceability: 0.5, tempo: clamp(tempo, 60, 190)
    };
  }

  function clamp(v, lo, hi) { return Math.min(hi, Math.max(lo, v)); }

  // ---------- genius (optional) ----------

  async function geniusLink(track) {
    const token = els.genius_token.value.trim();
    if (!token) return null;
    try {
      const q = encodeURIComponent(track.name + " " + (track.artists[0] || ""));
      const r = await fetch(GENIUS_API + "/search?q=" + q,
        { headers: { Authorization: "Bearer " + token } });
      if (!r.ok) return null;
      const d = await r.json();
      const hit = d.response && d.response.hits && d.response.hits[0];
      return hit ? hit.result.url : null;
    } catch (e) { return null; }
  }

  // ---------- mood analysis ----------

  function averageFeatures(tracks) {
    const keys = ["energy", "valence", "acousticness", "instrumentalness", "danceability", "tempo"];
    const avg = {};
    keys.forEach(k => {
      avg[k] = tracks.reduce((s, t) => s + (t.features[k] || 0), 0) / tracks.length;
    });
    return avg;
  }

  function pickProfile(avg) {
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

  // The quoted track: the one closest to the playlist's average mood.
  function pickTrack(tracks, avg) {
    let best = tracks[0], bestD = Infinity;
    tracks.forEach(t => {
      if (!t.features) return;
      const d = Math.abs(t.features.valence - avg.valence) +
                Math.abs(t.features.energy - avg.energy) * 1.2 +
                Math.abs(t.features.tempo - avg.tempo) / 200;
      if (d < bestD) { bestD = d; best = t; }
    });
    return best;
  }

  // ---------- content profiles ----------

  const PROFILES = {

    inferno: {
      label: "molten & merciless",
      scene: "volcano", sceneName: "The Volcano at Dusk",
      sceneText: "Your playlist doesn't simmer — it erupts. Drums like falling rock, guitars like lava finding the shortest way downhill. This is music that clears the room and then owns it.",
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
      sceneText: "Fast, heavy, and under a black sky. Your playlist is a ship that refuses to come about — every song another wave over the bow, taken head-on.",
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
      sceneText: "Slow-burning and suspicious. Your playlist walks with its collar up under streetlights, and every song knows something it isn't telling you.",
      era: {
        title: "Film-Noir Autumn, 1947",
        text: "Smoke in the offices, rain on the glass, jazz from a room you weren't invited into. The war was over; nobody said the peace had started.",
        icon: "film"
      },
      character: {
        name: "Rorschach", from: "Watchmen",
        text: "Never compromises, never blinks. He keeps a journal of everything wrong with the city — set to your tracklist, it would sound like this.",
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
      sceneText: "Cold, hushed, and enormous. Your playlist is a walk through snowed-over pines — beautiful precisely because nothing in it raises its voice.",
      era: {
        title: "A Futuristic Winter, 2077",
        text: "The cities went quiet, the winters got long, and people started keeping warm with stories. Minimal machines, maximal silence.",
        icon: "snowflake"
      },
      character: {
        name: "San", from: "Princess Mononoke",
        text: "Raised by wolves, fluent in forest, allergic to cities. She fights for the quiet places — and your playlist sounds like her footsteps.",
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
      sceneText: "Your playlist drives with the windows down through a city that refuses to sleep. Chrome, bass, and every traffic light turning green on approach.",
      era: {
        title: "Neon Summer, 1984",
        text: "Synthesizers, arcades, convertibles with the top down. The future looked like chrome and it looked like fun.",
        icon: "bolt"
      },
      character: {
        name: "Jareth, the Goblin King", from: "Labyrinth",
        text: "Caped, dramatic, chronically theatrical. He treats every hallway like a music video — your playlist is his walking speed.",
        cfg: { bg: "#14101f", coat: "#2c2440", coatShadow: "#191328", shirt: "#d9cfe8", skin: "#e6d4c0", hair: "#e8d9a0", accent: "#b06ff0", hat: "none" }
      },
      movie: {
        title: "Drive", year: "2011",
        text: "A getaway driver, a gold jacket, and a synthwave heartbeat. The night drive your playlist has been rehearsing for.",
        cfg: { bg: "#101426", coat: "#26262c", coatShadow: "#141419", shirt: "#e8c56e", skin: "#e6b98c", hair: "#241c12", accent: "#e8c56e", hat: "cap", glasses: true }
      }
    },

    summer: {
      label: "sun-warm & nostalgic",
      scene: "summerBeach", sceneName: "The Last Week of Summer",
      sceneText: "Bright, fast, and secretly a little sad — the good kind. Your playlist is a beach day you already know is ending, played at full volume anyway.",
      era: {
        title: "Gold Rush Summer, 1849",
        text: "Everything felt possible and slightly unlawful. Dust, optimism, and the strong suspicion that the good times were temporary — they were.",
        icon: "sun"
      },
      character: {
        name: "Ferris Bueller", from: "Ferris Bueller's Day Off",
        text: "Charms teachers, borrows cars, treats life like a parade he's hosting. Your playlist is his kind of day off.",
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
      sceneText: "Layered, patient, and overgrown in the best way. Your playlist is a cathedral of strings and moss — Hozier would feel at home here.",
      era: {
        title: "Victorian Autumn, 1873",
        text: "Gaslight, greenhouses, letters that took a month. An era of luxurious slowness, when even the sadness was beautifully upholstered.",
        icon: "leaf"
      },
      character: {
        name: "Sophie Hatter", from: "Howl's Moving Castle",
        text: "Cursed into patience and blooming anyway. She cleans up after wizards the way your playlist tidies a room: gently, completely.",
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
      sceneText: "Warm, acoustic, and easy to breathe in. Your playlist is a slow current on a long afternoon — it doesn't rush anywhere, and it doesn't need to.",
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
        text: "Paris in warm focus, small kindnesses, an accordion with good intentions. Your playlist is its daydreaming cousin.",
        cfg: { bg: "#241c14", coat: "#4a3a26", coatShadow: "#302414", shirt: "#e8dcc8", skin: "#e6b98c", hair: "#241a10", accent: "#c34a36", hat: "none" }
      }
    },

    meadow: {
      label: "open-hearted & bright",
      scene: "meadow", sceneName: "The Meadow at First Light",
      sceneText: "Sunny without being naive. Your playlist is a morning that actually keeps its promises — open sky, warm wind, somewhere to be.",
      era: {
        title: "Belle Époque Morning, 1899",
        text: "Café terraces, new art on every wall, and the unshakable belief that the century would be kind. It wasn't, but the mornings were.",
        icon: "sun"
      },
      character: {
        name: "Moana", from: "Moana",
        text: "Stubbornly hopeful, constitutionally incapable of staying on the Island. She'd sail straight into your playlist's horizon.",
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
      sceneText: "Wide-open and unhurried, built on space rather than noise. Your playlist is a horizon you can hear — long thoughts, long shadows.",
      era: {
        title: "Space Age Dusk, 1969",
        text: "The desert test sites went quiet and everyone looked up instead. Analog consoles, infinite skies, and no urgency to come home.",
        icon: "star"
      },
      character: {
        name: "The Man With No Name", from: "The Good, the Bad and the Ugly",
        text: "Speaks roughly nine words per film, all of them load-bearing. He rides through your playlist without once changing expression.",
        cfg: { bg: "#20180e", coat: "#5c4a2c", coatShadow: "#3a2e18", shirt: "#c9bfa8", skin: "#d8b48e", hair: "#2b1d12", accent: "#c34a36", hat: "none", beard: true }
      },
      movie: {
        title: "Dune", year: "2021",
        text: "Sand to the edges of the screen and a score that hums like a planet. Epic minimalism — your playlist, but with more sandworms.",
        cfg: { bg: "#241a10", coat: "#4a3a26", coatShadow: "#2e2416", shirt: "#d9cfa8", skin: "#e6b98c", hair: "#2b1d12", accent: "#e8823c", hat: "none" }
      }
    },

    winter: {
      label: "cold & aching",
      scene: "snowMountains", sceneName: "The Frozen Range",
      sceneText: "Slow, spacious, and quietly devastating. Your playlist is breath in cold air — beautiful things said softly, at altitude.",
      era: {
        title: "A Futuristic Winter, 2077",
        text: "Long nights, warm rooms, and music that plays from somewhere far away. The future turned out to be mostly weather.",
        icon: "snowflake"
      },
      character: {
        name: "Elsa", from: "Frozen",
        text: "Elegant, guarded, and one chorus away from building something enormous out of ice. Your playlist is her quieter, sadder solo.",
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
      sceneText: "Restless, rhythmic, and best after dark. Your playlist is a skyline from a moving window — every song another block, none of them boring.",
      era: {
        title: "Roaring Twenties Night, 1926",
        text: "Jazz at full volume, rules at full discount. An era that treated staying out late as a form of art.",
        icon: "film"
      },
      character: {
        name: "Nick Wilde", from: "Zootopia",
        text: "Fast-talking, sharp-dressed, allergic to sincerity — until he isn't. He'd hustle effortlessly to your playlist.",
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
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
    location.hash = pageId.replace("page-", "");
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, c =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  function quoteBlock(state) {
    const cite = esc(state.track.name) + " — " +
      esc((state.track.artists || []).join(", "));
    const link = state.geniusUrl
      ? ' <a class="genius-link" href="' + esc(state.geniusUrl) + '" target="_blank" rel="noopener">full lyrics ↗</a>'
      : "";
    return '<div class="song-quote"><blockquote>“' + esc(state.quote) +
           '”</blockquote><cite>' + cite + link + "</cite></div>";
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
    const tracks = demo.tracks.map(t => Object.assign({}, t, { features: t }));
    await analyze({ name: demo.name, tracks });
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
      const token = await spotifyToken();
      status("reading the playlist…");
      const pl = await fetchPlaylist(id, token);
      status("listening closely…");

      // fetch full track objects for ids, then audio features
      const idRes = await fetch(SP_API + "/playlists/" + id +
        "/tracks?limit=100&fields=next,items(track(id))",
        { headers: { Authorization: "Bearer " + token } });
      let url = idRes.ok ? idRes.url : null;
      const ids = [];
      while (url) {
        const r = await fetch(url, { headers: { Authorization: "Bearer " + token } });
        if (!r.ok) break;
        const d = await r.json();
        (d.items || []).forEach(it => { if (it.track && it.track.id) ids.push(it.track.id); });
        url = d.next;
      }
      tracksWithIds(pl.tracks, ids);
      const feats = await fetchAudioFeatures(pl.tracks, token);
      pl.tracks.forEach(t => {
        t.features = (feats && feats.get(t.id)) || pseudoFeatures(t);
      });
      await analyze(pl);
    } catch (err) {
      if (err.message === "no-keys") {
        els.input_error.hidden = false;
        els.input_error.innerHTML =
          "To unravel a real playlist, add your Spotify keys below — or try a demo.";
        els.settings_panel.hidden = false;
      } else {
        els.input_error.hidden = false;
        els.input_error.textContent = err.message;
      }
    } finally {
      els.status_msg.hidden = true;
      els.unravel_btn.disabled = false;
    }
  }

  function tracksWithIds(tracks, ids) {
    // ids come from a parallel fetch in the same order
    tracks.forEach((t, i) => { if (ids[i]) t.id = ids[i]; });
  }

  async function analyze(playlist) {
    const avg = averageFeatures(playlist.tracks);
    const profile = pickProfile(avg);
    const track = pickTrack(playlist.tracks, avg);
    let quote = track.quote || null;
    let geniusUrl = null;
    if (!quote) {
      geniusUrl = await geniusLink(track);
      // Without a lyrics license we quote the track's own title line.
      quote = track.name;
    }
    state = { profile, playlistName: playlist.name, track, quote, geniusUrl };
    status("");
    renderScenery();
  }

  // ---------- wiring ----------

  els.unravel_btn.addEventListener("click", () => runPlaylist(els.playlist_input.value));
  els.playlist_input.addEventListener("keydown", e => {
    if (e.key === "Enter") runPlaylist(els.playlist_input.value);
  });
  els.playlist_input.addEventListener("input", () => { els.input_error.hidden = true; });

  els.settings_toggle.addEventListener("click", () => {
    els.settings_panel.hidden = !els.settings_panel.hidden;
    if (!els.settings_panel.hidden) els.demo_list.hidden = true;
  });
  els.demo_toggle.addEventListener("click", () => {
    els.demo_list.hidden = !els.demo_list.hidden;
    if (!els.demo_list.hidden) els.settings_panel.hidden = true;
  });
  els.settings_save.addEventListener("click", saveSettings);

  document.querySelectorAll(".demo-btn").forEach(btn => {
    btn.addEventListener("click", () => runDemo(btn.dataset.demo));
  });

  loadSettings();
  show("page-home");
})();
