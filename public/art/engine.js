/* Unravelled — art engine, demo-style: seeded PRNG, gradient skies,
   silhouette layers, one accent. Palette ids keep the 6-slot contract
   (ink/shadow/base/mid/light/accent) and map onto scene colours. */
(function () {
  const L = window.ART_LISTS;

  function hashStr(s) {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function makeRng(seedStr) {
    const r = mulberry32(hashStr(String(seedStr)));
    return {
      f: r,
      range: (a, b) => a + r() * (b - a),
      int: (a, b) => Math.floor(a + r() * (b - a + 1)),
      pick: (arr) => arr[Math.floor(r() * arr.length)],
      chance: (p) => r() < p
    };
  }

  /* 6-slot palettes (server contract) → scene colours */
  const SLOTS = {
    ember:        { ink:'#160b08', shadow:'#3a1c12', base:'#7a3b1e', mid:'#c97a3a', light:'#f2b96d', accent:'#ff5d2a' },
    deep_forest:  { ink:'#0a1a12', shadow:'#14301f', base:'#1f4d33', mid:'#3f7a52', light:'#8fbf8a', accent:'#e8b23a' },
    golden_hour:  { ink:'#1c130a', shadow:'#4a2f14', base:'#8a5a22', mid:'#d99a3d', light:'#f7cf7a', accent:'#fff1c2' },
    midnight_blue:{ ink:'#070d1f', shadow:'#101c3d', base:'#1d3160', mid:'#3c5a99', light:'#7fa0d9', accent:'#9fd0ff' },
    neon_night:   { ink:'#0b0714', shadow:'#1d1030', base:'#33195c', mid:'#7a3fd1', light:'#c48bff', accent:'#00ffc8' },
    dusty_sand:   { ink:'#1c1509', shadow:'#40321c', base:'#7d6134', mid:'#c2a05e', light:'#ecd9a8', accent:'#c96f2e' },
    ice:          { ink:'#0a1420', shadow:'#1c3247', base:'#33566e', mid:'#6d9ab5', light:'#c2e0ee', accent:'#ffffff' },
    storm_grey:   { ink:'#0d1014', shadow:'#232a33', base:'#3d4854', mid:'#6b7887', light:'#a9b6c4', accent:'#ffd23e' },
    violet_dusk:  { ink:'#150a24', shadow:'#2a1547', base:'#472470', mid:'#7a4fb0', light:'#b48ae0', accent:'#ff8ad8' },
    sea_teal:     { ink:'#04181a', shadow:'#0b3234', base:'#14565a', mid:'#2b8f8c', light:'#6fd0c4', accent:'#ffd27a' },
    rose_dawn:    { ink:'#200d16', shadow:'#451c30', base:'#7c3050', mid:'#c25a7d', light:'#f2a5b8', accent:'#ffe3ea' },
    moss_amber:   { ink:'#141407', shadow:'#2c2c12', base:'#4d4d20', mid:'#8a8438', light:'#c9c06a', accent:'#ff9d2e' },
    copper_noir:  { ink:'#120c0a', shadow:'#2a1a16', base:'#4d2c22', mid:'#8a5238', light:'#c98a5e', accent:'#ffb347' },
    lavender_haze:{ ink:'#120e1e', shadow:'#261c3d', base:'#443066', mid:'#7a5aa3', light:'#b9a0e0', accent:'#e8ffb0' },
    blood_moon:   { ink:'#160607', shadow:'#33100f', base:'#5c1a17', mid:'#a03428', light:'#e06a4a', accent:'#ff2e2e' },
    mint_cool:    { ink:'#081512', shadow:'#14302a', base:'#23584c', mid:'#4a9480', light:'#8fd8c4', accent:'#f4ffd0' }
  };
  function hexRgb(h) { return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]; }
  function mix(c1, c2, t) {
    const a = hexRgb(c1), b = hexRgb(c2);
    return '#' + a.map((v, i) => Math.round(v + (b[i] - v) * t).toString(16).padStart(2, '0')).join('');
  }
  function lum(h) { const [r, g, b] = hexRgb(h); return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255; }
  /* scene-facing palette derived from the 6 slots */
  function P(palId) {
    const s = SLOTS[palId] || SLOTS.golden_hour;
    return { slots: s, stops: [s.shadow, s.base], horizon: s.mid, sil: s.ink, accent: s.accent, light: s.light };
  }

  /* svg helpers with unique prefixes */
  let uid = 0;
  function svgOpen(w, h, vb, prefix) {
    uid++;
    return { p: prefix || ('a' + uid + '_'), w, h, defs: [], body: [],
      def(s) { this.defs.push(s); },
      add(s) { this.body.push(s); },
      render(extra) {
        return `<svg viewBox="${vb || '0 0 ' + this.w + ' ' + this.h}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" role="img" aria-hidden="true"${extra || ''}>` +
          (this.defs.length ? `<defs>${this.defs.join('')}</defs>` : '') + this.body.join('') + '</svg>';
      } };
  }
  const F = (n) => Math.round(n * 100) / 100;

  /* shared scene pieces (demo style) */
  function skyDefs(d, p) {
    d.def(`<linearGradient id="${d.p}sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${p.stops[0]}"/><stop offset="82%" stop-color="${p.stops[1]}"/><stop offset="100%" stop-color="${p.horizon}"/></linearGradient>
      <linearGradient id="${d.p}sea" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${p.horizon}"/><stop offset="100%" stop-color="${p.stops[0]}"/></linearGradient>
      <radialGradient id="${d.p}glow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0%" stop-color="${p.accent}" stop-opacity="0.8"/><stop offset="100%" stop-color="${p.accent}" stop-opacity="0"/></radialGradient>
      <filter id="${d.p}soft" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="8"/></filter>`);
  }
  function stars(d, r, p, maxY, n) {
    let s = '';
    for (let i = 0; i < n; i++) s += `<circle cx="${F(r.f() * 800)}" cy="${F(r.f() * maxY)}" r="${F(0.5 + r.f() * 1.1)}" fill="#e9e4d4" opacity="${F(0.2 + r.f() * 0.5)}"/>`;
    return s;
  }
  function moon(d, r, p, x, y) {
    const cx = x == null ? 560 + r.f() * 160 : x, cy = y == null ? 60 + r.f() * 60 : y;
    return `<circle cx="${F(cx)}" cy="${F(cy)}" r="66" fill="url(#${d.p}glow)"/><circle cx="${F(cx)}" cy="${F(cy)}" r="22" fill="${p.light}"/>`;
  }
  function sun(d, p, x, y, rIn) {
    return `<circle cx="${F(x)}" cy="${F(y)}" r="${F(rIn * 2.6)}" fill="url(#${d.p}glow)"/><circle cx="${F(x)}" cy="${F(y)}" r="${F(rIn)}" fill="${p.accent}" opacity="0.95"/>`;
  }
  function pine(x, base, w, h, fill, op) {
    let s = `<rect x="${F(x - 2)}" y="${F(base - h * 0.18)}" width="4" height="${F(h * 0.18)}" fill="${fill}" opacity="${op == null ? 1 : op}"/>`;
    for (let i = 0; i < 3; i++) {
      const tw = w * (1 - i * 0.24), ty = base - h * (0.22 + i * 0.26), th = h * 0.36;
      s += `<path d="M${F(x)} ${F(ty - th)} L${F(x - tw / 2)} ${F(ty)} L${F(x + tw / 2)} ${F(ty)} Z" fill="${fill}" opacity="${op == null ? 1 : op}"/>`;
    }
    return s;
  }
  function hills(d, r, p, layers) { // layered silhouette hills
    let s = '';
    layers.forEach((L, i) => {
      const y = L.y, amp = L.amp;
      s += `<path d="M0 ${F(y)} Q ${F(200 + r.f() * 120)} ${F(y - amp)} ${F(400 + r.f() * 100)} ${F(y - amp * 0.4 + r.f() * 20)} T 800 ${F(y - amp * 0.3)} L 800 500 L 0 500 Z" fill="${p.sil}" opacity="${L.op}"/>`;
    });
    return s;
  }
  function weatherOverlay(d, r, p, weather, w, h) {
    let s = '';
    if (weather === 'rain' || weather === 'storm') {
      const n = weather === 'storm' ? 40 : 24;
      for (let i = 0; i < n; i++) {
        const x = r.f() * w, y = r.f() * h * 0.8, l = 24 + r.f() * 60;
        s += `<line x1="${F(x)}" y1="${F(y)}" x2="${F(x - 6)}" y2="${F(y + l)}" stroke="#e9e4d4" stroke-width="1.3" opacity="${F(0.15 + r.f() * 0.3)}"/>`;
      }
      if (weather === 'storm') s += `<path d="M${F(300 + r.f() * 200)} 0 L ${F(340 + r.f() * 200)} ${F(h * 0.3)} L ${F(310 + r.f() * 200)} ${F(h * 0.3)} L ${F(370 + r.f() * 200)} ${F(h * 0.55)}" stroke="${p.accent}" stroke-width="5" fill="none" opacity="0.9"/>`;
    }
    if (weather === 'snow') for (let i = 0; i < 60; i++) s += `<circle cx="${F(r.f() * w)}" cy="${F(r.f() * h)}" r="${F(1 + r.f() * 2.2)}" fill="#e9e4d4" opacity="${F(0.3 + r.f() * 0.5)}"/>`;
    if (weather === 'fog' || weather === 'cloudy') for (let i = 0; i < 5; i++) s += `<ellipse cx="${F(r.f() * w)}" cy="${F(h * (0.3 + r.f() * 0.5))}" rx="${F(160 + r.f() * 200)}" ry="${F(24 + r.f() * 30)}" fill="${p.light}" opacity="0.1" filter="url(#${d.p}soft)"/>`;
    return s;
  }
  function celestial(d, r, p, time) {
    if (time === 'night' || time === 'dusk') return stars(d, r, p, 200, 46) + moon(d, r, p);
    if (time === 'dawn' || time === 'golden') return sun(d, p, 180 + r.f() * 120, 300 + r.f() * 40, 36);
    if (time === 'day') return sun(d, p, 560 + r.f() * 120, 90 + r.f() * 60, 40);
    return '';
  }
  /* standard scene wrapper: 800x500, sky + celestial + painter + weather */
  function scene(seedStr, palId, time, weather, painter) {
    const r = makeRng(seedStr);
    const p = P(palId);
    const d = svgOpen(800, 500, '0 0 800 500', 's' + (hashStr(seedStr) % 1000000) + '_');
    skyDefs(d, p);
    d.add(`<rect width="800" height="500" fill="url(#${d.p}sky)"/>`);
    d.add(celestial(d, r, p, time || 'day'));
    d.add(painter(r, p, d));
    d.add(weatherOverlay(d, r, p, weather || 'clear', 800, 500));
    return d.render();
  }
  const REDUCED = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

  window.ART = window.ART || {};
  Object.assign(window.ART, {
    L, hashStr, mulberry32, makeRng, SLOTS, P, mix, lum, hexRgb, svgOpen, F,
    skyDefs, stars, moon, sun, pine, hills, weatherOverlay, celestial, scene, REDUCED
  });
})();
