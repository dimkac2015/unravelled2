/* Unravelled — art engine (spec section 6). Everything drawn with this:
   seeded PRNG, 6-slot palettes, one light source, textures, generators. */
(function () {
  const L = window.ART_LISTS;
  let uidCounter = 0;

  /* ---------- 6.1 determinism ---------- */
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
      chance: (p) => r() < p,
      jitter: (v, amt) => v + (r() - 0.5) * 2 * amt
    };
  }

  /* ---------- 6.2 colour ---------- */
  const PALETTES = {
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
  const SLOTS = ['ink','shadow','base','mid','light','accent'];
  function slot(pal, name) { return PALETTES[pal][name]; }

  /* ---------- svg document with unique id prefixes ---------- */
  function doc(w, h, prefix) {
    uidCounter++;
    const p = prefix || ('u' + uidCounter + '_');
    return {
      p, w, h, defs: [], body: [],
      def(s) { this.defs.push(s); },
      add(s) { this.body.push(s); },
      grad(id, stops, attrs) {
        const a = attrs ? ' ' + Object.entries(attrs).map(([k, v]) => `${k}="${v}"`).join(' ') : '';
        this.def(`<linearGradient id="${this.p}${id}"${a}>` + stops.map(s => `<stop offset="${s[0]}" stop-color="${s[1]}"${s[2] ? ` stop-opacity="${s[2]}"` : ''}/>`).join('') + '</linearGradient>');
      },
      rgrad(id, stops, attrs) {
        const a = attrs ? ' ' + Object.entries(attrs).map(([k, v]) => `${k}="${v}"`).join(' ') : '';
        this.def(`<radialGradient id="${this.p}${id}"${a}>` + stops.map(s => `<stop offset="${s[0]}" stop-color="${s[1]}"${s[2] ? ` stop-opacity="${s[2]}"` : ''}/>`).join('') + '</radialGradient>');
      },
      render(viewBox, extraAttrs) {
        const vb = viewBox || `0 0 ${this.w} ${this.h}`;
        const a = extraAttrs || '';
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" width="${this.w}" height="${this.h}"${a}>` +
          (this.defs.length ? `<defs>${this.defs.join('')}</defs>` : '') + this.body.join('') + '</svg>';
      }
    };
  }
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  const fmt = (n) => Math.round(n * 100) / 100;

  /* ---------- geometry generators ---------- */
  function catmull(points) { // → smooth cubic bezier path through points
    if (points.length < 2) return '';
    let d = `M ${fmt(points[0][0])} ${fmt(points[0][1])}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[Math.max(0, i - 1)], p1 = points[i], p2 = points[i + 1], p3 = points[Math.min(points.length - 1, i + 2)];
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
      const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += ` C ${fmt(c1[0])} ${fmt(c1[1])}, ${fmt(c2[0])} ${fmt(c2[1])}, ${fmt(p2[0])} ${fmt(p2[1])}`;
    }
    return d;
  }
  function ridge(rng, x0, y0, x1, y1, rough, segs) {
    let pts = [[x0, y0], [x1, y1]];
    for (let s = 0; s < segs; s++) {
      const next = [];
      for (let i = 0; i < pts.length - 1; i++) {
        const mx = (pts[i][0] + pts[i + 1][0]) / 2, my = (pts[i][1] + pts[i + 1][1]) / 2;
        next.push(pts[i], [mx, my - rng.range(0, rough) * (s === 0 ? 1 : 0.5)]);
      }
      next.push(pts[pts.length - 1]); pts = next; rough *= 0.55;
    }
    return pts;
  }
  function wavePath(rng, y, amp, w, h, phase) {
    const pts = [];
    const n = 8;
    for (let i = 0; i <= n; i++) {
      const x = (w * i) / n;
      pts.push([x, y + Math.sin(phase + (i / n) * Math.PI * 2 * rng.range(1, 2.4)) * amp * (0.6 + rng.f() * 0.4)]);
    }
    return catmull(pts);
  }
  function starField(d, rng, w, h, n, col, maxR) {
    let s = '';
    for (let i = 0; i < n; i++) {
      const x = rng.range(0, w), y = rng.range(0, h * 0.7), r = rng.range(0.6, maxR || 2);
      const o = rng.range(0.3, 1);
      const tw = rng.chance(0.35) ? ` class="tw" style="animation-delay:${fmt(rng.range(0, 6))}s"` : '';
      s += `<circle cx="${fmt(x)}" cy="${fmt(y)}" r="${fmt(r)}" fill="${col}" opacity="${fmt(o)}"${tw}/>`;
    }
    return s;
  }
  function cloud(d, rng, x, y, s, col, o) {
    let g = `<g opacity="${o}" fill="${col}">`;
    const n = rng.int(3, 5);
    for (let i = 0; i < n; i++) {
      g += `<ellipse cx="${fmt(x + rng.range(-40, 40) * s)}" cy="${fmt(y + rng.range(-10, 10) * s)}" rx="${fmt(rng.range(22, 48) * s)}" ry="${fmt(rng.range(12, 20) * s)}"/>`;
    }
    return g + '</g>';
  }
  function rainStreaks(rng, w, h, n, col) {
    let s = '<g>';
    for (let i = 0; i < n; i++) {
      const x = rng.range(0, w), y = rng.range(-h * 0.2, h), l = rng.range(14, 34);
      s += `<line x1="${fmt(x)}" y1="${fmt(y)}" x2="${fmt(x - l * 0.18)}" y2="${fmt(y + l)}" stroke="${col}" stroke-width="1.4" opacity="${fmt(rng.range(0.15, 0.4))}" class="rain" style="animation-delay:${fmt(rng.range(0, 1.5))}s"/>`;
    }
    return s + '</g>';
  }
  function snowFall(rng, w, h, n, col) {
    let s = '<g>';
    for (let i = 0; i < n; i++) {
      s += `<circle cx="${fmt(rng.range(0, w))}" cy="${fmt(rng.range(0, h))}" r="${fmt(rng.range(1.2, 3))}" fill="${col}" opacity="${fmt(rng.range(0.4, 0.9))}" class="snow" style="animation-delay:${fmt(rng.range(0, 4))}s;animation-duration:${fmt(rng.range(6, 11))}s"/>`;
    }
    return s + '</g>';
  }

  /* ---------- 6.3 lighting ---------- */
  const TIME_LIGHT = {
    dawn:   { sky: ['#2a3350', '#c98a6a'], light: '#ffd9a8', glow: '#ffb37a' },
    day:    { sky: ['#9fd4e8', '#e8f4e8'], light: '#fff6dd', glow: '#ffffff' },
    golden: { sky: ['#4a3a6a', '#e8a05a'], light: '#ffd27a', glow: '#ff9a4a' },
    dusk:   { sky: ['#1c2450', '#8a4a6a'], light: '#e8a0c0', glow: '#c86a9a' },
    night:  { sky: ['#050a1c', '#14264a'], light: '#b8d4ff', glow: '#8ab0ff' }
  };
  function lightShaft(d, x, y, w, h, angle, col, o) {
    const dx = Math.cos(angle) * w, dy = Math.sin(angle) * h;
    d.grad('shaft', [[0, col, o], [1, col, 0]], { x1: 0, y1: 0, x2: dx, y2: dy, gradientUnits: 'userSpaceOnUse' });
    return '';
  }
  function cone(d, p, cx, cy, spread, len, col, o) {
    const a = Math.atan2(spread, len);
    const base = Math.atan2(0, 1);
    d.rgrad('cone', [[0, col, o], [1, col, 0]]);
    return `<path d="M ${fmt(cx)} ${fmt(cy)} L ${fmt(cx - spread)} ${fmt(cy + len)} L ${fmt(cx + spread)} ${fmt(cy + len)} Z" fill="url(#${p}cone)"/>`;
  }
  function castShadow(shapeD, dx, dy, col, o) {
    return `<path d="${shapeD}" transform="translate(${fmt(dx)} ${fmt(dy)}) skewX(${fmt(Math.atan2(dy, dx) * 57.29 > 0 ? 18 : -18)})" fill="${col}" opacity="${o}"/>`;
  }
  function rim(d, shapeD, side, col, wdt) {
    return `<path d="${shapeD}" fill="none" stroke="${col}" stroke-width="${wdt}" stroke-linecap="round" stroke-dasharray="9999" stroke-dashoffset="0" opacity="0.9" clip-path="none" transform="translate(${side === 'l' ? -wdt / 2 : wdt / 2} 0)"/>`;
  }

  /* ---------- 6.5 texture ---------- */
  function grain(d, p, w, h) {
    d.def(`<filter id="${p}grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.6 0"/></filter>`);
    d.add(`<rect width="${w}" height="${h}" filter="url(#${p}grain)" opacity="0.12" style="mix-blend-mode:multiply"/>`);
  }
  function roughEdge(d, p) {
    d.def(`<filter id="${p}rough"><feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="1.5"/></filter>`);
    return p + 'rough';
  }
  function halftone(d, p, col) {
    d.def(`<pattern id="${p}dots" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(18)"><circle cx="2.4" cy="2.4" r="1.7" fill="${col}"/></pattern>`);
    return `url(#${p}dots)`;
  }
  function vignette(d, p, w, h, o) {
    d.rgrad('vig', [[0, '#000000', 0], [0.72, '#000000', 0], [1, '#000000', o || 0.42]], { cx: '50%', cy: '46%', r: '72%' });
    d.add(`<rect width="${w}" height="${h}" fill="url(#${p}vig)"/>`);
  }

  /* ---------- 6.4/6.6 scene framework ---------- */
  const REDUCED = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  function sceneBase(seedStr, palId, time, weather, w, h) {
    const rng = makeRng(seedStr);
    const P = PALETTES[palId];
    const T = TIME_LIGHT[time] || TIME_LIGHT.day;
    const d = doc(w, h, 's' + (hashStr(seedStr) % 100000) + '_');
    d.grad('sky', [[0, T.sky[0]], [0.62, mix(T.sky[0], T.sky[1], 0.75)], [1, T.sky[1]]]);
    d.add(`<rect width="${w}" height="${h}" fill="url(#${d.p}sky)"/>`);
    return { rng, P, T, d, w, h };
  }
  function layer(d, pts, yBase, h, fill, o) { // filled silhouette from ridgeline points
    const w = d.w;
    const dPath = catmull(pts) + ` L ${w} ${h} L 0 ${h} Z`;
    d.add(`<path d="${dPath}" fill="${fill}" opacity="${o == null ? 1 : o}"/>`);
    return dPath;
  }
  function mist(d, y, hgt, col, o) {
    d.grad('mist' + fmt(y), [[0, col, 0], [0.5, col, o], [1, col, 0]], { x1: 0, y1: y, x2: 0, y2: y + hgt, gradientUnits: 'userSpaceOnUse' });
    d.add(`<rect x="0" y="${fmt(y)}" width="${d.w}" height="${fmt(hgt)}" fill="url(#${d.p}mist${fmt(y)})"/>`);
  }
  function weatherOverlay(ctx, weather) {
    const { d, rng, P, w, h } = ctx;
    if (weather === 'rain' || weather === 'storm') d.add(rainStreaks(rng, w, h, weather === 'storm' ? 90 : 55, P.light));
    if (weather === 'snow') d.add(snowFall(rng, w, h, 70, P.light));
    if (weather === 'fog') { for (let i = 0; i < 4; i++) mist(d, h * rng.range(0.3, 0.8), h * 0.14, P.light, 0.16); }
    if (weather === 'storm') {
      const x = rng.range(w * 0.2, w * 0.8);
      d.add(`<path d="M ${fmt(x)} 0 L ${fmt(x + 26)} ${fmt(h * 0.22)} L ${fmt(x - 6)} ${fmt(h * 0.22)} L ${fmt(x + 30)} ${fmt(h * 0.45)}" fill="${P.accent}" opacity="0.85" class="bolt"/>`);
      d.add(`<rect width="${w}" height="${h}" fill="${P.light}" opacity="0.12" class="flash"/>`);
    }
    if (weather === 'cloudy') for (let i = 0; i < 5; i++) d.add(cloud(d, rng, rng.range(0, w), rng.range(h * 0.05, h * 0.3), rng.range(0.8, 1.6), mix(P.ink, P.shadow, 0.4), 0.5));
  }
  function celestial(ctx, time) {
    const { d, rng, P, T, w, h } = ctx;
    if (time === 'night' || time === 'dusk') {
      const mx = rng.range(w * 0.15, w * 0.85), my = rng.range(h * 0.08, h * 0.3);
      d.rgrad('moon', [[0, T.glow, 1], [0.75, T.light, 0.95], [1, T.light, 0]], { cx: '50%', cy: '50%', r: '50%' });
      d.add(`<circle cx="${fmt(mx)}" cy="${fmt(my)}" r="${fmt(h * 0.055)}" fill="url(#${d.p}moon)"/>`);
      d.add(starField(d, rng, w, h, 60, P.light, 1.8));
    } else if (time === 'day' || time === 'golden' || time === 'dawn') {
      const sx = rng.range(w * 0.2, w * 0.8), sy = rng.range(h * 0.06, h * 0.24);
      d.rgrad('sun', [[0, '#ffffff', 1], [0.4, T.glow, 0.95], [1, T.glow, 0]], { cx: '50%', cy: '50%', r: '50%' });
      d.add(`<circle cx="${fmt(sx)}" cy="${fmt(sy)}" r="${fmt(h * (time === 'golden' ? 0.085 : 0.06))}" fill="url(#${d.p}sun)"/>`);
    }
  }
  function finish(d, w, h, opts) {
    const o = opts || {};
    if (o.halftoneCol) { const ht = halftone(d, d.p, o.halftoneCol); d.add(`<rect width="${w}" height="${h}" fill="${ht}" opacity="0.1"/>`); }
    vignette(d, d.p, w, h, o.vig);
    grain(d, d.p, w, h);
    return d.render(`0 0 ${w} ${h}`, 'preserveAspectRatio="xMidYMid slice" role="img" aria-hidden="true"' + (REDUCED ? ' class="reduced"' : ''));
  }
  function ambientStyles() {
    if (REDUCED) return '<style>.reduced *{animation:none !important}</style>';
    return `<style>
      @keyframes twk{0%,100%{opacity:.25}50%{opacity:1}}
      @keyframes drft{0%{transform:translateX(-14px)}100%{transform:translateX(14px)}}
      @keyframes rainfall{0%{transform:translateY(-30px);opacity:0}12%{opacity:.5}100%{transform:translateY(60px);opacity:0}}
      @keyframes snowfall{0%{transform:translate(0,-10px)}100%{transform:translate(-16px,70px)}}
      @keyframes flsh{0%,92%,100%{opacity:0}94%{opacity:.5}96%{opacity:.1}}
      .tw{animation:twk 7s ease-in-out infinite}
      .drift{animation:drft 9s ease-in-out infinite alternate}
      .rain{animation:rainfall 1.1s linear infinite}
      .snow{animation:snowfall 8s linear infinite}
      .flash{animation:flsh 6s linear infinite}
      .bolt{animation:flsh 6s linear infinite}
      @media (prefers-reduced-motion: reduce){*{animation:none !important}}
    </style>`;
  }

  window.ART = window.ART || {};
  Object.assign(window.ART, {
    L, PALETTES, hashStr, mulberry32, makeRng, doc, esc, fmt, mix, lum, slot, SLOTS,
    catmull, ridge, wavePath, starField, cloud, rainStreaks, snowFall,
    TIME_LIGHT, cone, castShadow, rim, grain, roughEdge, halftone, vignette,
    sceneBase, layer, mist, weatherOverlay, celestial, finish, ambientStyles, REDUCED
  });
})();
