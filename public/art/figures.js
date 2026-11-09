/* Unravelled — character portraits (page 3), demo-style: gradient backdrop,
   waist-up silhouette figure built from the "look" slots, one accent. */
(function () {
  const A = window.ART, F = A.F;
  const SKINS = { fair: '#d9b39a', light: '#c69a7d', olive: '#a8845e', tan: '#8a6244', brown: '#5f4028', dark: '#3a2417' };

  function backdrop(d, r, p, id, W, H) {
    d.def(`<linearGradient id="${d.p}bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${p.stops[0]}"/><stop offset="100%" stop-color="${p.horizon}"/></linearGradient>`);
    d.add(`<rect width="${W}" height="${H}" fill="url(#${d.p}bg)"/>`);
    let s = '';
    const cx = W / 2;
    if (id === 'spotlight' || id === 'streetlamp_night' || id === 'doorway_light') {
      s += `<circle cx="${F(cx)}" cy="${F(H * 0.42)}" r="240" fill="url(#${d.p}glow)" opacity="0.5"/>`;
      s += `<path d="M${F(cx - 150)} 0 L ${F(cx + 150)} 0 L ${F(cx + 260)} ${H} L ${F(cx - 260)} ${H} Z" fill="${p.light}" opacity="0.07"/>`;
    }
    if (id === 'venetian_blinds') for (let i = 0; i < 6; i++) s += `<rect x="0" y="${F(40 + i * 90)}" width="${W}" height="${F(34)}" fill="${p.light}" opacity="0.08" transform="rotate(-6 ${cx} ${F(40 + i * 90)})"/>`;
    if (id === 'rainy_window') { s += `<rect x="${F(W * 0.15)}" y="${F(H * 0.08)}" width="${F(W * 0.7)}" height="${F(H * 0.7)}" fill="${p.light}" opacity="0.1"/>`; for (let i = 0; i < 18; i++) s += `<line x1="${F(r.f() * W)}" y1="${F(r.f() * H)}" x2="${F(r.f() * W - 5)}" y2="${F(r.f() * H + 60)}" stroke="${p.light}" stroke-width="1.4" opacity="0.2"/>`; }
    if (id === 'brick_wall') { for (let y = 0; y < H; y += 44) for (let x = (y / 44) % 2 * 40; x < W; x += 80) s += `<rect x="${x}" y="${y}" width="76" height="40" fill="none" stroke="${p.sil}" stroke-width="2.4" opacity="0.6"/>`; }
    if (id === 'curtain') for (let i = 0; i < 6; i++) s += `<path d="M${F(i * W / 6)} 0 Q ${F(i * W / 6 + W / 12)} ${F(H / 2)} ${F(i * W / 6)} ${H} L ${F((i + 1) * W / 6)} ${H} Q ${F((i + 1) * W / 6 - W / 12)} ${F(H / 2)} ${F((i + 1) * W / 6)} 0 Z" fill="${p.sil}" opacity="${F(0.25 + (i % 2) * 0.15)}"/>`;
    if (id === 'smoke_haze') for (let i = 0; i < 4; i++) s += `<ellipse cx="${F(r.f() * W)}" cy="${F(H * (0.3 + r.f() * 0.5))}" rx="${F(180 + r.f() * 160)}" ry="${F(30 + r.f() * 26)}" fill="${p.light}" opacity="0.08" filter="url(#${d.p}soft)"/>`;
    d.add(s);
  }

  function figure(d, r, p, look, W, H) {
    const s = { slim: 0.9, average: 1, stocky: 1.12, tall: 1.05, small: 0.82 }[look.body] || 1;
    const cx = W / 2 + (look.pose === 'three_quarter' ? 30 : look.pose === 'leaning_wall' ? -40 : 0);
    const headY = H * 0.3, shY = H * 0.46, waistY = H * 0.98;
    const shW = 120 * s, skin = A.mix(SKINS[look.skin] || SKINS.olive, p.sil, 0.25);
    const outfit = p.slots[look.outfit_color] || p.slots.base;
    const hair = p.slots[look.hair_color] || p.sil;
    let g = '';
    // torso
    g += `<path d="M${F(cx - shW)} ${F(shY)} Q ${F(cx)} ${F(shY - 34)} ${F(cx + shW)} ${F(shY)} L ${F(cx + shW * 0.82)} ${F(waistY)} L ${F(cx - shW * 0.82)} ${F(waistY)} Z" fill="${outfit}"/>`;
    // arms
    const lean = look.pose === 'leaning_wall' ? 26 : 0;
    g += `<path d="M${F(cx - shW)} ${F(shY + 8)} L ${F(cx - shW - 34 - lean)} ${F(shY + 130)} L ${F(cx - shW + 6)} ${F(shY + 150)} L ${F(cx - shW + 26)} ${F(shY + 30)} Z" fill="${A.mix(outfit, p.sil, 0.35)}"/>`;
    g += `<path d="M${F(cx + shW)} ${F(shY + 8)} L ${F(cx + shW + 34 + lean)} ${F(shY + 130)} L ${F(cx + shW - 6)} ${F(shY + 150)} L ${F(cx + shW - 26)} ${F(shY + 30)} Z" fill="${A.mix(outfit, p.sil, 0.2)}"/>`;
    // neck + head
    g += `<rect x="${F(cx - 14 * s)}" y="${F(headY + 34)}" width="${F(28 * s)}" height="${F(shY - headY - 20)}" fill="${skin}"/>`;
    const hr = 52 * s;
    g += `<circle cx="${F(cx)}" cy="${F(headY)}" r="${F(hr)}" fill="${skin}"/>`;
    // hair
    const hs = look.hair || 'short_side_part';
    if (hs !== 'bald') {
      if (['long_straight', 'long_wavy', 'bob', 'braids'].includes(hs)) g += `<path d="M${F(cx - hr - 12)} ${F(headY + hr)} Q ${F(cx - hr - 20)} ${F(headY - hr)} ${F(cx)} ${F(headY - hr - 16)} Q ${F(cx + hr + 20)} ${F(headY - hr)} ${F(cx + hr + 12)} ${F(headY + hr)} Q ${F(cx)} ${F(headY + hr * 0.4)} ${F(cx - hr - 12)} ${F(headY + hr)} Z" fill="${hair}"/>`;
      else if (hs === 'afro' || hs === 'curly') { for (let i = 0; i < 8; i++) { const a = Math.PI + i / 7 * Math.PI; g += `<circle cx="${F(cx + Math.cos(a) * hr * 0.95)}" cy="${F(headY - hr * 0.5 + Math.sin(a) * hr * 0.8)}" r="${F(hr * 0.42)}" fill="${hair}"/>`; } }
      else if (hs === 'mohawk') g += `<path d="M${F(cx - 10)} ${F(headY - hr * 0.6)} L ${F(cx - 14)} ${F(headY - hr * 1.7)} L ${F(cx + 14)} ${F(headY - hr * 1.7)} L ${F(cx + 10)} ${F(headY - hr * 0.6)} Z" fill="${hair}"/>`;
      else if (hs === 'ponytail' || hs === 'bun') g += `<path d="M${F(cx - hr)} ${F(headY - hr * 0.4)} A ${F(hr)} ${F(hr)} 0 0 1 ${F(cx + hr)} ${F(headY - hr * 0.4)} L ${F(cx + hr * 0.8)} ${F(headY - hr)} Q ${F(cx)} ${F(headY - hr * 1.2)} ${F(cx - hr * 0.8)} ${F(headY - hr)} Z" fill="${hair}"/>` + (hs === 'bun' ? `<circle cx="${F(cx)}" cy="${F(headY - hr * 1.25)}" r="${F(hr * 0.34)}" fill="${hair}"/>` : `<path d="M${F(cx + hr * 0.5)} ${F(headY - hr * 0.6)} q ${F(hr * 0.6)} 50 ${F(hr * 0.3)} 130 q ${F(-hr * 0.3)} -36 ${F(-hr * 0.3)} -70 Z" fill="${hair}"/>`);
      else g += `<path d="M${F(cx - hr)} ${F(headY - hr * 0.25)} A ${F(hr)} ${F(hr)} 0 0 1 ${F(cx + hr)} ${F(headY - hr * 0.25)} L ${F(cx + hr * 0.85)} ${F(headY - hr * 0.8)} Q ${F(cx)} ${F(headY - hr * 1.05)} ${F(cx - hr * 0.85)} ${F(headY - hr * 0.8)} Z" fill="${hair}"/>`;
    }
    // headwear
    const hw = look.headwear || 'none';
    if (hw === 'fedora' || hw === 'cowboy_hat') g += `<ellipse cx="${F(cx)}" cy="${F(headY - hr * 0.75)}" rx="${F(hr * 1.25)}" ry="${F(hr * 0.2)}" fill="${p.sil}"/><path d="M${F(cx - hr * 0.7)} ${F(headY - hr * 0.7)} Q ${F(cx)} ${F(headY - hr * 1.4)} ${F(cx + hr * 0.7)} ${F(headY - hr * 0.7)} L ${F(cx + hr * 0.55)} ${F(headY - hr * 0.95)} Q ${F(cx)} ${F(headY - hr * 1.25)} ${F(cx - hr * 0.55)} ${F(headY - hr * 0.95)} Z" fill="${p.sil}"/>`;
    if (hw === 'top_hat') g += `<ellipse cx="${F(cx)}" cy="${F(headY - hr * 0.7)}" rx="${F(hr * 1.3)}" ry="${F(hr * 0.2)}" fill="${p.sil}"/><rect x="${F(cx - hr * 0.6)}" y="${F(headY - hr * 1.9)}" width="${F(hr * 1.2)}" height="${F(hr * 1.25)}" fill="${p.sil}"/><rect x="${F(cx - hr * 0.6)}" y="${F(headY - hr * 0.95)}" width="${F(hr * 1.2)}" height="${F(hr * 0.2)}" fill="${p.accent}"/>`;
    if (hw === 'beret') g += `<path d="M${F(cx - hr * 1.2)} ${F(headY - hr * 0.8)} Q ${F(cx)} ${F(headY - hr * 1.6)} ${F(cx + hr * 1.2)} ${F(headY - hr * 0.8)} Q ${F(cx)} ${F(headY - hr * 0.5)} ${F(cx - hr * 1.2)} ${F(headY - hr * 0.8)} Z" fill="${p.accent}"/>`;
    if (hw === 'crown') g += `<path d="M${F(cx - hr * 0.8)} ${F(headY - hr * 0.7)} L${F(cx - hr * 0.8)} ${F(headY - hr * 1.15)} L${F(cx - hr * 0.4)} ${F(headY - hr * 0.88)} L${F(cx)} ${F(headY - hr * 1.3)} L${F(cx + hr * 0.4)} ${F(headY - hr * 0.88)} L${F(cx + hr * 0.8)} ${F(headY - hr * 1.15)} L${F(cx + hr * 0.8)} ${F(headY - hr * 0.7)} Z" fill="${p.accent}"/>`;
    if (hw === 'hood' || hw === 'witch_hat') g += `<path d="M${F(cx - hr * 1.4)} ${F(headY + hr)} Q ${F(cx - hr * 1.5)} ${F(headY - hr * 1.5)} ${F(cx)} ${F(headY - hr * 1.5)} Q ${F(cx + hr * 1.5)} ${F(headY - hr * 1.5)} ${F(cx + hr * 1.4)} ${F(headY + hr)} L ${F(cx + hr * 0.7)} ${F(headY + hr)} Q ${F(cx + hr * 0.8)} ${F(headY - hr * 0.8)} ${F(cx)} ${F(headY - hr * 0.9)} Q ${F(cx - hr * 0.8)} ${F(headY - hr * 0.8)} ${F(cx - hr * 0.7)} ${F(headY + hr)} Z" fill="${p.sil}"/>`;
    // face hints: eyes shadow + accent glint
    g += `<rect x="${F(cx - 26 * s)}" y="${F(headY - 6)}" width="${F(16 * s)}" height="5" rx="2" fill="${p.sil}"/><rect x="${F(cx + 10 * s)}" y="${F(headY - 6)}" width="${F(16 * s)}" height="5" rx="2" fill="${p.sil}"/>`;
    // accessory
    const ac = look.accessory || 'none';
    if (ac === 'glasses' || ac === 'round_glasses' || ac === 'goggles') {
      const rr = ac === 'round_glasses' ? 16 : 20;
      g += `<circle cx="${F(cx - 18 * s)}" cy="${F(headY)}" r="${F(rr * s * 0.8)}" fill="none" stroke="${p.accent}" stroke-width="4"/><circle cx="${F(cx + 18 * s)}" cy="${F(headY)}" r="${F(rr * s * 0.8)}" fill="none" stroke="${p.accent}" stroke-width="4"/><line x1="${F(cx - 4)}" y1="${F(headY)}" x2="${F(cx + 4)}" y2="${F(headY)}" stroke="${p.accent}" stroke-width="4"/>`;
    }
    if (ac === 'scarf') g += `<path d="M${F(cx - 30 * s)} ${F(headY + hr * 0.9)} L ${F(cx + 30 * s)} ${F(headY + hr * 0.9)} L ${F(cx + 22 * s)} ${F(shY - 10)} L ${F(cx - 22 * s)} ${F(shY - 10)} Z" fill="${p.accent}"/>`;
    if (ac === 'eyepatch') g += `<circle cx="${F(cx + 18 * s)}" cy="${F(headY - 4)}" r="${F(15 * s)}" fill="${p.sil}"/><line x1="${F(cx - hr)}" y1="${F(headY - hr * 0.5)}" x2="${F(cx + hr)}" y2="${F(headY + hr * 0.3)}" stroke="${p.sil}" stroke-width="5"/>`;
    return g;
  }

  function render(look, seedStr, palId) {
    const r = A.makeRng(seedStr + ':figure');
    const p = A.P(palId);
    const W = 800, H = 600, d = A.svgOpen(W, H, null, 'x' + (A.hashStr(seedStr) % 1000000) + '_');
    d.def(`<radialGradient id="${d.p}glow" cx="0.5" cy="0.5" r="0.5"><stop offset="0%" stop-color="${p.accent}" stop-opacity="0.8"/><stop offset="100%" stop-color="${p.accent}" stop-opacity="0"/></radialGradient>
      <filter id="${d.p}soft" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="8"/></filter>`);
    backdrop(d, r, p, look.background || 'spotlight', W, H);
    d.add(`<ellipse cx="${F(W / 2)}" cy="${F(H * 0.99)}" rx="240" ry="26" fill="${p.sil}" opacity="0.5"/>`);
    d.add(figure(d, r, p, look, W, H));
    d.add(A.celestial(d, r, p, 'night'));
    return d.render();
  }
  window.ART.figures = { render };
})();
