/* Unravelled — movie posters (page 4): 14 compositions + 20 elements,
   demo-style silhouette scenes, title stays as HTML text. */
(function () {
  const A = window.ART, F = A.F;

  function element(d, r, p, id, gy) {
    const x = r.range(120, 680), s = r.range(0.8, 1.25);
    switch (id) {
      case 'streetlamp': return `<rect x="${F(x - 4)}" y="${F(gy - 250 * s)}" width="8" height="${F(250 * s)}" fill="${p.sil}"/><circle cx="${F(x)}" cy="${F(gy - 256 * s)}" r="10" fill="${p.accent}"/><circle cx="${F(x)}" cy="${F(gy - 256 * s)}" r="42" fill="url(#${d.p}glow)"/>`;
      case 'moon': return `<circle cx="${F(x)}" cy="${F(gy - 330 * s)}" r="${F(46 * s)}" fill="${p.light}"/><circle cx="${F(x)}" cy="${F(gy - 330 * s)}" r="${F(120 * s)}" fill="url(#${d.p}glow)"/>`;
      case 'car': return `<g transform="translate(${F(x)} ${F(gy)}) scale(${F(s)})"><path d="M-92 0 L-80 -28 L-34 -32 L-12 -55 L 38 -55 L 58 -30 L 84 -26 L 94 0 Z" fill="${p.sil}"/><circle cx="-46" cy="2" r="15" fill="${p.stops[0]}"/><circle cx="50" cy="2" r="15" fill="${p.stops[0]}"/><rect x="-6" y="-48" width="38" height="18" fill="${p.light}" opacity="0.5"/></g>`;
      case 'train': return `<g transform="translate(${F(x)} ${F(gy)}) scale(${F(s)})"><rect x="-110" y="-100" width="220" height="92" rx="12" fill="${p.sil}"/>${[-88, -30, 28].map(wx => `<rect x="${wx}" y="-84" width="42" height="34" fill="${p.light}" opacity="0.55"/>`).join('')}<circle cx="-58" cy="-4" r="17" fill="${p.stops[0]}"/><circle cx="58" cy="-4" r="17" fill="${p.stops[0]}"/><path d="M-24 -100 q 8 -34 -16 -58" stroke="${p.light}" stroke-width="10" fill="none" opacity="0.35"/></g>`;
      case 'house': return `<g transform="translate(${F(x)} ${F(gy)}) scale(${F(s)})"><rect x="-58" y="-66" width="116" height="66" fill="${p.sil}"/><path d="M-70 -66 L 0 -116 L 70 -66 Z" fill="${p.sil}"/><rect x="-13" y="-34" width="26" height="34" fill="${p.accent}" opacity="0.9"/><rect x="-44" y="-52" width="20" height="16" fill="${p.light}" opacity="0.6"/><rect x="24" y="-52" width="20" height="16" fill="${p.light}" opacity="0.6"/></g>`;
      case 'tree': return `<g transform="translate(${F(x)} ${F(gy)}) scale(${F(s)})"><rect x="-7" y="-50" width="14" height="50" fill="${p.sil}"/><circle cx="0" cy="-80" r="46" fill="${p.sil}"/><circle cx="-30" cy="-60" r="30" fill="${p.sil}"/><circle cx="30" cy="-62" r="32" fill="${p.sil}"/></g>`;
      case 'umbrella': return `<g transform="translate(${F(x)} ${F(gy)}) scale(${F(s)})"><path d="M-58 0 A 58 58 0 0 1 58 0 Q 29 -12 0 0 Q -29 -12 -58 0 Z" fill="${p.accent}"/><line x1="0" y1="0" x2="0" y2="58" stroke="${p.sil}" stroke-width="6"/><path d="M0 58 q 0 12 -12 12" stroke="${p.sil}" stroke-width="6" fill="none"/></g>`;
      case 'ship': return `<g transform="translate(${F(x)} ${F(gy)}) scale(${F(s)})"><path d="M-75 0 L 75 0 L 55 22 L -55 22 Z" fill="${p.sil}"/><rect x="-4" y="-92" width="8" height="92" fill="${p.sil}"/><path d="M4 -88 L 52 -12 L 4 -12 Z" fill="${p.light}" opacity="0.85"/><path d="M-4 -78 L -44 -14 L -4 -14 Z" fill="${p.light}" opacity="0.6"/></g>`;
      case 'bridge': return `<path d="M${F(x - 160)} ${F(gy)} L ${F(x + 160)} ${F(gy)}" stroke="${p.sil}" stroke-width="12"/><path d="M${F(x - 150)} ${F(gy)} A 150 100 0 0 1 ${F(x + 150)} ${F(gy)}" stroke="${p.sil}" stroke-width="9" fill="none"/>`;
      case 'tower': return `<g transform="translate(${F(x)} ${F(gy)}) scale(${F(s)})"><rect x="-25" y="-270" width="50" height="270" fill="${p.sil}"/><rect x="-32" y="-305" width="64" height="38" fill="${p.sil}"/><path d="M-32 -305 L 0 -345 L 32 -305 Z" fill="${p.sil}"/><rect x="-10" y="-236" width="20" height="28" fill="${p.accent}" opacity="0.8"/></g>`;
      case 'birds': { let s = ''; for (let i = 0; i < 5; i++) { const bx = x + r.range(-80, 80), by = gy - r.range(260, 380); s += `<path d="M${F(bx - 10)} ${F(by)} Q ${F(bx)} ${F(by - 8)} ${F(bx)} ${F(by)} Q ${F(bx)} ${F(by - 8)} ${F(bx + 10)} ${F(by)}" stroke="${p.sil}" stroke-width="3" fill="none"/>`; } return s; }
      case 'clock': return `<g transform="translate(${F(x)} ${F(gy - 320 * s)}) scale(${F(s)})"><circle r="54" fill="${p.light}" opacity="0.9"/><circle r="54" fill="none" stroke="${p.sil}" stroke-width="7"/><path d="M0 0 L 0 -30 M 0 0 L 20 12" stroke="${p.sil}" stroke-width="6" stroke-linecap="round"/><circle r="6" fill="${p.accent}"/></g>`;
      case 'bicycle': return `<g transform="translate(${F(x)} ${F(gy)}) scale(${F(s)})"><circle cx="-38" cy="-16" r="25" fill="none" stroke="${p.sil}" stroke-width="7"/><circle cx="38" cy="-16" r="25" fill="none" stroke="${p.sil}" stroke-width="7"/><path d="M-38 -16 L-4 -58 L38 -16 M-4 -58 L16 -58 M-4 -58 L-14 -16" stroke="${p.sil}" stroke-width="6" fill="none"/></g>`;
      case 'balloon': return `<g transform="translate(${F(x)} ${F(gy - 400 * s)})"><ellipse rx="36" ry="46" fill="${p.accent}" opacity="0.9"/><path d="M0 46 q 5 26 -4 50" stroke="${p.light}" stroke-width="2.6" fill="none"/></g>`;
      case 'lighthouse': return `<g transform="translate(${F(x)} ${F(gy)}) scale(${F(s)})"><path d="M-18 0 L-10 -185 L10 -185 L18 0 Z" fill="${p.light}" opacity="0.9"/><rect x="-13" y="-135" width="26" height="10" fill="${p.accent}"/><rect x="-11" y="-92" width="22" height="8" fill="${p.accent}"/><rect x="-12" y="-200" width="24" height="17" fill="${p.sil}"/><circle cy="-191" r="6" fill="${p.accent}"/></g>`;
      case 'campfire': return `<g transform="translate(${F(x)} ${F(gy)})"><path d="M-34 0 L34 0 M-24 -12 L24 -12" stroke="${p.sil}" stroke-width="8"/><path d="M0 -6 Q 18 -38 0 -84 Q -18 -38 0 -6 Z" fill="${p.accent}"/><circle cy="-40" r="40" fill="url(#${d.p}glow)" opacity="0.5"/></g>`;
      case 'bench': return `<g transform="translate(${F(x)} ${F(gy)})"><rect x="-66" y="-38" width="132" height="9" fill="${p.sil}"/><rect x="-66" y="-25" width="132" height="7" fill="${p.sil}"/><rect x="-58" y="-18" width="9" height="18" fill="${p.sil}"/><rect x="49" y="-18" width="9" height="18" fill="${p.sil}"/><rect x="-70" y="-58" width="9" height="22" fill="${p.sil}"/><rect x="61" y="-58" width="9" height="22" fill="${p.sil}"/></g>`;
      case 'suitcase': return `<g transform="translate(${F(x)} ${F(gy)})"><rect x="-28" y="-44" width="56" height="44" rx="7" fill="${p.light}" opacity="0.85"/><rect x="-28" y="-44" width="56" height="44" rx="7" fill="none" stroke="${p.sil}" stroke-width="4"/><path d="M-12 -44 q 12 -14 24 0" stroke="${p.sil}" stroke-width="5" fill="none"/></g>`;
      case 'telescope': return `<g transform="translate(${F(x)} ${F(gy)}) rotate(-30)"><rect x="0" y="-12" width="110" height="24" rx="10" fill="${p.light}" opacity="0.9"/><rect x="100" y="-16" width="22" height="32" rx="7" fill="${p.accent}"/><line x1="34" y1="9" x2="18" y2="44" stroke="${p.sil}" stroke-width="6"/><line x1="58" y1="11" x2="66" y2="44" stroke="${p.sil}" stroke-width="6"/></g>`;
      case 'cat': return `<g transform="translate(${F(x)} ${F(gy)}) scale(${F(s)})"><ellipse cx="0" cy="-20" rx="22" ry="18" fill="${p.sil}"/><circle cx="0" cy="-46" r="14" fill="${p.sil}"/><path d="M-11 -54 L-14 -70 L-3 -58 Z M11 -54 L14 -70 L3 -58 Z" fill="${p.sil}"/><path d="M20 -25 q 18 -5 15 -24" stroke="${p.sil}" stroke-width="7" fill="none" stroke-linecap="round"/><circle cx="-5" cy="-48" r="2.6" fill="${p.accent}"/><circle cx="5" cy="-48" r="2.6" fill="${p.accent}"/></g>`;
    }
    return '';
  }
  function figureSil(d, x, y, s, col) {
    return `<g transform="translate(${F(x)} ${F(y)}) scale(${F(s)})"><circle cx="0" cy="-158" r="22" fill="${col}"/><path d="M-28 -134 Q 0 -148 28 -134 L 33 0 L -33 0 Z" fill="${col}"/></g>`;
  }
  const COMPS = {
    lone_figure_road: (d, r, p, gy) => `<path d="M${F(400 - 42)} ${F(gy)} L ${F(400 - 12)} ${F(gy - 260)} L ${F(400 + 12)} ${F(gy - 260)} L ${F(400 + 42)} ${F(gy)} Z" fill="${p.light}" opacity="0.12"/>` + figureSil(d, 400, gy, 1.05, p.sil) + `<path d="M0 ${F(gy)} L 800 ${F(gy)}" stroke="${p.sil}" stroke-width="6"/>`,
    two_silhouettes_facing: (d, r, p, gy) => figureSil(d, 300, gy, 1.1, p.sil) + figureSil(d, 500, gy, 1.1, A.mix(p.sil, p.light, 0.25)) + `<circle cx="400" cy="${F(gy - 300)}" r="40" fill="${p.accent}"/><circle cx="400" cy="${F(gy - 300)}" r="110" fill="url(#${d.p}glow)"/>`,
    skyline_with_moon: (d, r, p, gy) => { let s = `<circle cx="${F(600 + r.f() * 80)}" cy="${F(gy - 330)}" r="44" fill="${p.light}"/>`; for (let i = 0; i < 8; i++) { const w = 60 + r.f() * 50, h = 120 + r.f() * 220, x = i * 100; s += `<rect x="${F(x)}" y="${F(gy - h)}" width="${F(w)}" height="${F(h)}" fill="${p.sil}" opacity="${F(0.6 + (i % 3) * 0.13)}"/>`; } return s; },
    ship_at_sea: (d, r, p, gy) => `<rect x="0" y="${F(gy - 60)}" width="800" height="${F(500 - gy + 60)}" fill="url(#${d.p}sea)"/>` + element(d, r, p, 'ship', gy - 40),
    car_at_night: (d, r, p, gy) => `<rect x="0" y="${F(gy - 16)}" width="800" height="${F(500 - gy + 16)}" fill="${p.sil}"/>` + element(d, r, p, 'car', gy) + `<path d="M0 ${F(gy - 50)} L 800 ${F(gy - 220)}" stroke="${p.light}" stroke-width="3" opacity="0.15"/>`,
    window_view: (d, r, p, gy) => { let s = `<rect x="${F(220)}" y="40" width="360" height="${F(gy - 40)}" fill="${p.light}" opacity="0.14"/><rect x="220" y="40" width="360" height="${F(gy - 40)}" fill="none" stroke="${p.sil}" stroke-width="12"/><line x1="400" y1="40" x2="400" y2="${F(gy)}" stroke="${p.sil}" stroke-width="9"/><line x1="220" y1="${F((40 + gy) / 2)}" x2="580" y2="${F((40 + gy) / 2)}" stroke="${p.sil}" stroke-width="9"/>`; return s + figureSil(d, 400, gy, 0.95, p.sil); },
    doorway_light: (d, r, p, gy) => `<rect x="${F(300)}" y="30" width="200" height="${F(gy - 30)}" fill="${p.light}" opacity="0.75"/>` + figureSil(d, 400, gy, 1.15, p.sil),
    rooftop: (d, r, p, gy) => { let s = `<rect x="0" y="${F(gy)}" width="800" height="${F(500 - gy)}" fill="${p.sil}"/>`; for (let i = 0; i < 6; i++) { const h = 90 + r.f() * 160; s += `<rect x="${F(i * 140 - 20)}" y="${F(gy - h - 70)}" width="110" height="${F(h)}" fill="${p.sil}" opacity="0.75"/>`; } return s + figureSil(d, 560, gy, 1.0, p.sil); },
    train_station: (d, r, p, gy) => `<rect x="0" y="${F(gy - 24)}" width="800" height="24" fill="${p.sil}"/>` + element(d, r, p, 'train', gy - 20) + figureSil(d, 160, gy, 0.9, p.sil),
    forest_path: (d, r, p, gy) => { let s = `<path d="M${F(400 - 50)} ${F(gy)} L ${F(400 - 14)} ${F(gy - 240)} L ${F(400 + 14)} ${F(gy - 240)} L ${F(400 + 50)} ${F(gy)} Z" fill="${p.light}" opacity="0.14"/>`; for (let i = 0; i < 9; i++) s += A.pine(40 + i * 90 + r.f() * 26, gy + 10, 80, 150 + r.f() * 50, p.sil, 0.9); return s + figureSil(d, 400, gy, 0.95, p.sil); },
    crowd_figure: (d, r, p, gy) => { let s = ''; for (let i = 0; i < 8; i++) s += figureSil(d, 90 + i * 90, gy + r.range(-10, 10), r.range(0.75, 1.0), i % 3 ? A.mix(p.sil, p.light, 0.2) : p.sil); return s + figureSil(d, 400, gy - 30, 1.2, p.sil); },
    empty_chair_room: (d, r, p, gy) => `<g transform="translate(400 ${F(gy)})"><rect x="-50" y="-126" width="100" height="13" fill="${p.light}" opacity="0.8"/><rect x="-50" y="-113" width="12" height="113" fill="${p.light}" opacity="0.8"/><rect x="38" y="-113" width="12" height="113" fill="${p.light}" opacity="0.8"/><rect x="-50" y="-50" width="100" height="12" fill="${p.light}" opacity="0.8"/><rect x="-43" y="-38" width="10" height="38" fill="${p.light}" opacity="0.8"/><rect x="33" y="-38" width="10" height="38" fill="${p.light}" opacity="0.8"/></g><circle cx="400" cy="120" r="200" fill="url(#${d.p}glow)" opacity="0.4"/>`,
    mountain_climb: (d, r, p, gy) => `<path d="M${F(400 - 280)} ${F(gy)} L 400 ${F(gy - 300)} L ${F(400 + 280)} ${F(gy)} Z" fill="${p.sil}"/><path d="M${F(400 - 70)} ${F(gy - 220)} L 400 ${F(gy - 300)} L ${F(400 + 70)} ${F(gy - 220)} L ${F(400 + 26)} ${F(gy - 250)} L 400 ${F(gy - 282)} L ${F(400 - 28)} ${F(gy - 248)} Z" fill="${p.light}" opacity="0.85"/>` + figureSil(d, 350, gy - 130, 0.8, p.sil),
    ocean_wave: (d, r, p, gy) => { let s = ''; for (let i = 0; i < 4; i++) s += `<path d="M0 ${F(gy - 140 + i * 60)} q 100 ${F(-26 - i * 8)} 200 0 t 200 0 t 200 0 t 200 0 L 800 500 L 0 500 Z" fill="${i % 2 ? p.sil : p.stops[0]}" opacity="${F(0.7 + i * 0.08)}"/>`; return s + element(d, r, p, 'ship', gy - 120); }
  };

  function render(art, seedStr, palId, time) {
    const compId = art.composition || 'lone_figure_road';
    const r = A.makeRng(seedStr + ':poster:' + compId);
    const p = A.P(palId);
    const W = 800, H = 500, d = A.svgOpen(W, H, null, 'x' + (A.hashStr(seedStr) % 1000000) + '_');
    A.skyDefs(d, p);
    d.def(`<radialGradient id="${d.p}glow" cx="0.5" cy="0.5" r="0.5"><stop offset="0%" stop-color="${p.accent}" stop-opacity="0.8"/><stop offset="100%" stop-color="${p.accent}" stop-opacity="0"/></radialGradient>`);
    d.add(`<rect width="${W}" height="${H}" fill="url(#${d.p}sky)"/>`);
    d.add(A.celestial(d, r, p, art.time_of_day || time || 'night'));
    const gy = H - 40;
    d.add((COMPS[compId] || COMPS.lone_figure_road)(d, r, p, gy));
    (art.elements || []).slice(0, 3).forEach(e => d.add(element(d, r, p, e, gy)));
    d.add(A.weatherOverlay(d, r, p, 'clear', W, H));
    d.add(`<rect x="10" y="10" width="780" height="480" fill="none" stroke="${p.light}" stroke-width="3" opacity="0.5"/>`);
    return d.render();
  }
  window.ART.posters = { render, ELEMENTS: A.L.ELEMENTS };
})();
