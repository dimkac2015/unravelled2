/* Unravelled — era icons (24) on backdrops (8), in a circular badge frame.
   Each icon is lit by one light with rim light and a cast shadow (spec 6.8). */
(function () {
  const A = window.ART;
  const W = 800, H = 800;

  function backdrops(bId, c) {
    const { d, rng, P } = c, p = d.p;
    const bg = (inner) => {
      d.grad('bg', [[0, P.base], [1, P.shadow]]);
      d.add(`<rect width="${W}" height="${H}" fill="url(#${p}bg)"/>`);
      d.add(inner);
    };
    switch (bId) {
      case 'sunburst': {
        let s = '';
        for (let i = 0; i < 24; i++) {
          const a = (i / 24) * Math.PI * 2;
          s += `<path d="M ${W / 2} ${H / 2} L ${A.fmt(W / 2 + Math.cos(a) * 460)} ${A.fmt(H / 2 + Math.sin(a) * 460)} L ${A.fmt(W / 2 + Math.cos(a + 0.13) * 460)} ${A.fmt(H / 2 + Math.sin(a + 0.13) * 460)} Z" fill="${i % 2 ? P.mid : P.shadow}" opacity="0.55"/>`;
        }
        return bg(s);
      }
      case 'art_deco_fan': {
        let s = '';
        for (let i = 0; i < 7; i++) {
          const a = -Math.PI / 2 + (i - 3) * 0.24;
          s += `<path d="M ${W / 2} ${H * 0.85} L ${A.fmt(W / 2 + Math.cos(a) * 520)} ${A.fmt(H * 0.85 + Math.sin(a) * 520)} L ${A.fmt(W / 2 + Math.cos(a + 0.09) * 520)} ${A.fmt(H * 0.85 + Math.sin(a + 0.09) * 520)} Z" fill="${P.mid}" opacity="${0.25 + i * 0.07}"/>`;
        }
        return bg(s);
      }
      case 'blueprint_grid': {
        let s = '';
        for (let x = 0; x <= W; x += 40) s += `<line x1="${x}" y1="0" x2="${x}" y2="${H}" stroke="${P.light}" stroke-width="1" opacity="0.25"/>`;
        for (let y = 0; y <= H; y += 40) s += `<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="${P.light}" stroke-width="1" opacity="0.25"/>`;
        return bg(s);
      }
      case 'damask': {
        let s = '';
        for (let y = 0; y < 5; y++) for (let x = 0; x < 5; x++) {
          const cx = 80 + x * 160, cy = 80 + y * 160;
          s += `<path d="M ${cx} ${cy - 34} q 22 22 0 44 q -22 -22 0 -44 Z M ${cx - 20} ${cy} q 20 -18 40 0 q -20 18 -40 0 Z" fill="${P.mid}" opacity="0.4"/>`;
        }
        return bg(s);
      }
      case 'halftone': return bg(`<rect width="${W}" height="${H}" fill="${A.halftone(d, p, P.shadow)}" opacity="0.5"/>`);
      case 'starfield': return bg(A.starField(d, rng, W, H, 90, P.light, 2.4));
      case 'waves': {
        let s = '';
        for (let i = 0; i < 8; i++) s += `<path d="${A.wavePath(rng, 90 + i * 95, 16, W, H, i)} L ${W} ${H} L 0 ${H} Z" fill="${i % 2 ? P.mid : P.shadow}" opacity="0.5"/>`;
        return bg(s);
      }
      case 'parchment': {
        let s = '';
        for (let i = 0; i < 26; i++) s += `<ellipse cx="${A.fmt(rng.range(0, W))}" cy="${A.fmt(rng.range(0, H))}" rx="${A.fmt(rng.range(30, 90))}" ry="${A.fmt(rng.range(16, 40))}" fill="${P.light}" opacity="0.08"/>`;
        return bg(s);
      }
    }
  }

  function icon(id, c) {
    const { d, rng, P } = c, p = d.p, cx = W / 2, cy = H / 2 + 20;
    const ink = P.ink, sh = P.shadow, ba = P.base, mi = P.mid, li = P.light, ac = P.accent;
    const F = A.fmt;
    const g = (inner) => {
      d.add(A.castShadow(inner.replace(/<(path|rect|circle|ellipse|g)[^>]*>/g, (m) => m), 46, 34, ink, 0.5));
      d.add(inner);
      d.add(`<path d="M 0 0" stroke="${li}" stroke-width="4" opacity="0.85"/>`); // placeholder rim replaced below
    };
    // simple per-icon painters; each returns svg string drawn around (cx,cy)
    const P_ = {
      top_hat: `<g transform="translate(${cx} ${cy})"><ellipse cx="0" cy="52" rx="86" ry="20" fill="${ink}"/><path d="M -52 50 L -44 -58 L 44 -58 L 52 50 Z" fill="${ba}"/><rect x="-48" y="18" width="96" height="16" fill="${ac}"/><path d="M -44 -58 L 44 -58 L 38 -70 L -38 -70 Z" fill="${mi}"/></g>`,
      pickaxe: `<g transform="translate(${cx} ${cy}) rotate(-24)"><rect x="-6" y="-110" width="12" height="200" rx="6" fill="${mi}"/><path d="M -95 -80 Q 0 -140 95 -80 L 78 -58 Q 0 -108 -78 -58 Z" fill="${ba}"/><path d="M -95 -80 Q 0 -140 95 -80 L 88 -70 Q 0 -126 -88 -70 Z" fill="${li}" opacity="0.5"/></g>`,
      rocket: `<g transform="translate(${cx} ${cy})"><path d="M 0 -130 Q 46 -60 34 40 L -34 40 Q -46 -60 0 -130 Z" fill="${ba}"/><path d="M 0 -130 Q 20 -96 24 -40 L 0 -40 Z" fill="${li}" opacity="0.7"/><circle cx="0" cy="-40" r="16" fill="${ink}"/><circle cx="0" cy="-40" r="9" fill="${ac}"/><path d="M -34 10 L -66 62 L -30 48 Z" fill="${sh}"/><path d="M 34 10 L 66 62 L 30 48 Z" fill="${sh}"/><path d="M -10 42 Q 0 96 10 42 Z" fill="${ac}" class="tw"/></g>`,
      gramophone: `<g transform="translate(${cx} ${cy})"><ellipse cx="-30" cy="40" rx="70" ry="24" fill="${ba}"/><ellipse cx="-30" cy="34" rx="70" ry="24" fill="${mi}"/><ellipse cx="-30" cy="34" rx="44" ry="14" fill="${ink}"/><circle cx="-30" cy="34" r="7" fill="${ac}"/><rect x="18" y="-40" width="10" height="76" fill="${ink}"/><path d="M 23 -40 L 78 -88 L 96 -72 L 40 -24 Z" fill="${sh}"/><path d="M 78 -88 q 26 -6 30 18 q 3 20 -18 22 q -16 1 -18 -14 Z" fill="${ba}"/></g>`,
      sailing_ship: `<g transform="translate(${cx} ${cy})"><path d="M -90 30 L 90 30 L 66 66 L -66 66 Z" fill="${ink}"/><rect x="-5" y="-120" width="10" height="150" fill="${ink}"/><path d="M 5 -116 L 82 -22 L 5 -22 Z" fill="${li}"/><path d="M -5 -100 L -72 -26 L -5 -26 Z" fill="${mi}"/><path d="M 5 -120 L 34 -120 L 5 -108 Z" fill="${ac}"/><path d="M -100 78 q 25 12 50 0 q 25 -12 50 0 q 25 12 50 0 q 25 -12 50 0" stroke="${mi}" stroke-width="6" fill="none" opacity="0.8"/></g>`,
      castle: `<g transform="translate(${cx} ${cy})"><rect x="-110" y="-40" width="220" height="120" fill="${ba}"/><rect x="-110" y="-40" width="220" height="120" fill="none" stroke="${sh}" stroke-width="6"/><path d="M -110 -40 L -110 -96 L -78 -66 L -46 -96 L -14 -66 L 18 -96 L 50 -66 L 82 -96 L 110 -66 L 110 -40 Z" fill="${ba}"/><rect x="-46" y="-150" width="92" height="210" fill="${mi}"/><path d="M -46 -150 L -46 -196 L -23 -172 L 0 -196 L 23 -172 L 46 -196 L 46 -150 Z" fill="${mi}"/><path d="M -14 80 L -14 20 L 0 4 L 14 20 L 14 80 Z" fill="${ink}"/><rect x="-90" y="-16" width="20" height="28" fill="${ink}"/><rect x="70" y="-16" width="20" height="28" fill="${ink}"/></g>`,
      lantern: `<g transform="translate(${cx} ${cy})"><path d="M -26 -96 q 26 -26 52 0" fill="none" stroke="${ink}" stroke-width="8"/><rect x="-34" y="-96" width="68" height="14" rx="6" fill="${ink}"/><path d="M -40 -82 L 40 -82 L 30 60 L -30 60 Z" fill="${sh}"/><rect x="-26" y="-70" width="52" height="118" rx="8" fill="${ac}" opacity="0.9" class="tw"/><circle cx="0" cy="-10" r="16" fill="#fff" opacity="0.9"/><rect x="-36" y="60" width="72" height="14" rx="6" fill="${ink}"/></g>`,
      steam_train: `<g transform="translate(${cx} ${cy})"><rect x="-110" y="-10" width="150" height="70" rx="10" fill="${ba}"/><rect x="40" y="-46" width="80" height="106" rx="8" fill="${mi}"/><rect x="-96" y="-58" width="34" height="50" fill="${sh}"/><circle cx="-70" cy="72" r="30" fill="${ink}"/><circle cx="-70" cy="72" r="12" fill="${ac}"/><circle cx="10" cy="72" r="24" fill="${ink}"/><circle cx="10" cy="72" r="9" fill="${li}"/><circle cx="80" cy="72" r="24" fill="${ink}"/><circle cx="80" cy="72" r="9" fill="${li}"/><path d="${A.catmull([[-80, -60], [-60, -110], [-90, -150], [-50, -190]])}" stroke="${li}" stroke-width="14" fill="none" opacity="0.5" stroke-linecap="round"/></g>`,
      compass: `<g transform="translate(${cx} ${cy})"><circle r="96" fill="${ba}"/><circle r="96" fill="none" stroke="${sh}" stroke-width="8"/><circle r="76" fill="${mi}"/><path d="M 0 -62 L 16 0 L 0 62 L -16 0 Z" fill="${ac}"/><path d="M 0 -62 L 16 0 L 0 0 Z" fill="#fff" opacity="0.85"/><path d="M -62 0 L 0 -16 L 62 0 L 0 16 Z" fill="${li}" opacity="0.7"/><circle r="10" fill="${ink}"/></g>`,
      typewriter: `<g transform="translate(${cx} ${cy})"><rect x="-100" y="-20" width="200" height="80" rx="14" fill="${ba}"/><rect x="-70" y="-58" width="140" height="42" rx="8" fill="${sh}"/><rect x="-58" y="-50" width="116" height="26" rx="4" fill="${li}" opacity="0.9"/><circle cx="-78" cy="44" r="10" fill="${ac}"/><circle cx="-46" cy="44" r="10" fill="${mi}"/><circle cx="-14" cy="44" r="10" fill="${mi}"/><circle cx="18" cy="44" r="10" fill="${mi}"/><circle cx="50" cy="44" r="10" fill="${mi}"/><circle cx="78" cy="44" r="10" fill="${ac}"/><rect x="-30" y="-96" width="60" height="10" rx="4" fill="${ink}"/><rect x="-20" y="-106" width="40" height="12" rx="3" fill="${li}"/></g>`,
      vinyl_record: `<g transform="translate(${cx} ${cy})"><circle r="100" fill="${ink}"/><circle r="100" fill="none" stroke="${sh}" stroke-width="4"/><circle r="72" fill="none" stroke="${mi}" stroke-width="2" opacity="0.8"/><circle r="56" fill="none" stroke="${mi}" stroke-width="2" opacity="0.6"/><circle r="34" fill="${ba}"/><circle r="34" fill="none" stroke="${ac}" stroke-width="3"/><circle r="7" fill="${ac}"/><path d="M -70 -70 A 99 99 0 0 1 20 -97" stroke="${li}" stroke-width="6" fill="none" opacity="0.6" stroke-linecap="round"/></g>`,
      rotary_phone: `<g transform="translate(${cx} ${cy})"><path d="M -100 60 L 100 60 L 76 -10 L -76 -10 Z" fill="${ba}"/><path d="M -76 -10 q 0 -70 76 -70 q 76 0 76 70 Z" fill="${sh}"/><circle cy="8" r="44" fill="${ink}"/><circle cy="8" r="30" fill="${mi}"/><g fill="${li}">${Array.from({ length: 10 }, (_, i) => { const a = i / 10 * Math.PI * 2; return `<circle cx="${A.fmt(Math.cos(a) * 21)}" cy="${A.fmt(8 + Math.sin(a) * 21)}" r="4.6"/>`; }).join('')}</g><circle cy="8" r="8" fill="${ac}"/></g>`,
      radio_tube: `<g transform="translate(${cx} ${cy})"><rect x="-36" y="-110" width="72" height="150" rx="30" fill="${mi}" opacity="0.9"/><rect x="-36" y="-110" width="72" height="150" rx="30" fill="none" stroke="${sh}" stroke-width="6"/><path d="M -14 -70 q 14 -20 28 0 q -14 40 -28 0 Z" fill="${ac}" class="tw"/><rect x="-20" y="-30" width="40" height="46" rx="8" fill="${ink}"/><path d="M -14 30 L -14 60 M 14 30 L 14 60 M 0 32 L 0 62" stroke="${ink}" stroke-width="7"/><rect x="-46" y="40" width="92" height="34" rx="8" fill="${ba}"/><circle cx="-24" cy="57" r="7" fill="${ac}"/><rect x="-8" y="50" width="40" height="4" fill="${li}"/><rect x="-8" y="58" width="30" height="4" fill="${li}" opacity="0.7"/><rect x="-8" y="66" width="36" height="4" fill="${li}" opacity="0.5"/></g>`,
      windmill: `<g transform="translate(${cx} ${cy})"><path d="M -34 80 L -12 -60 L 12 -60 L 34 80 Z" fill="${ba}"/><rect x="-8" y="-30" width="16" height="30" fill="${ink}"/><g transform="translate(0 -66)">${[0, 90, 180, 270].map(a => `<path d="M 0 0 L ${A.fmt(16 * Math.cos(a * Math.PI / 180))} ${A.fmt(16 * Math.sin(a * Math.PI / 180))} L ${A.fmt(96 * Math.cos(a * Math.PI / 180))} ${A.fmt(96 * Math.sin(a * Math.PI / 180))} L ${A.fmt(88 * Math.cos((a + 24) * Math.PI / 180))} ${A.fmt(88 * Math.sin((a + 24) * Math.PI / 180))} Z" fill="${mi}" opacity="0.95"/>`).join('')}<circle r="12" fill="${ink}"/><circle r="5" fill="${ac}"/></g></g>`,
      knight_helmet: `<g transform="translate(${cx} ${cy})"><path d="M -70 40 Q -78 -70 0 -84 Q 78 -70 70 40 L 40 40 L 40 10 Q 40 -30 0 -34 Q -40 -30 -40 10 L -40 40 Z" fill="${ba}"/><path d="M -70 40 Q -78 -70 0 -84 Q 30 -80 44 -58 L 20 30 L -40 10 L -40 40 Z" fill="${mi}" opacity="0.8"/><rect x="-34" y="-6" width="68" height="10" fill="${ink}"/><path d="M 0 -84 L 0 -110 M -12 -100 L 12 -100" stroke="${sh}" stroke-width="7"/><circle cx="0" cy="-40" r="6" fill="${ac}"/></g>`,
      pagoda: `<g transform="translate(${cx} ${cy})">${[0, 1, 2].map(i => { const w = 190 - i * 50, y = 70 - i * 62; return `<g><path d="M ${A.fmt(-w / 2 - 26)} ${A.fmt(y)} L 0 ${A.fmt(y - 34)} L ${A.fmt(w / 2 + 26)} ${A.fmt(y)} Q 0 ${A.fmt(y + 12)} ${A.fmt(-w / 2 - 26)} ${A.fmt(y)} Z" fill="${i % 2 ? sh : mi}"/><rect x="${A.fmt(-w / 2 + 14)}" y="${A.fmt(y)}" width="${A.fmt(w - 28)}" height="52" fill="${ba}"/></g>`; }).join('')}<path d="M 0 -128 L 0 -158" stroke="${sh}" stroke-width="6"/><circle cx="0" cy="-164" r="7" fill="${ac}"/></g>`,
      pyramid: `<g transform="translate(${cx} ${cy})"><path d="M 0 -130 L 120 80 L -120 80 Z" fill="${ba}"/><path d="M 0 -130 L 120 80 L 10 80 Z" fill="${sh}"/><path d="M 0 -130 L 30 -80 L -20 80 L -60 80 Z" fill="${mi}" opacity="0.5"/><path d="M -120 80 L 120 80 L 150 100 L -150 100 Z" fill="${sh}"/></g>`,
      longship: `<g transform="translate(${cx} ${cy})"><path d="M -110 10 Q 0 66 110 10 L 92 -22 Q 0 22 -92 -22 Z" fill="${ba}"/><path d="M 92 -22 Q 128 -34 138 -6 Q 120 2 96 -4 Z" fill="${ba}"/><path d="M -92 -22 Q -128 -34 -138 -6 Q -120 2 -96 -4 Z" fill="${sh}"/><rect x="-6" y="-120" width="12" height="120" fill="${ink}"/><path d="M 6 -116 Q 60 -60 6 -6 Z" fill="${ac}"/><path d="M -100 20 q 25 10 50 0 q 25 -10 50 0 q 25 10 50 0" stroke="${mi}" stroke-width="6" fill="none" opacity="0.8"/></g>`,
      cassette: `<g transform="translate(${cx} ${cy})"><rect x="-110" y="-70" width="220" height="140" rx="14" fill="${ba}"/><rect x="-110" y="-70" width="220" height="140" rx="14" fill="none" stroke="${sh}" stroke-width="6"/><rect x="-84" y="-42" width="168" height="70" rx="6" fill="${li}" opacity="0.92"/><circle cx="-40" cy="-7" r="17" fill="${ink}"/><circle cx="40" cy="-7" r="17" fill="${ink}"/><circle cx="-40" cy="-7" r="6" fill="${ba}"/><circle cx="40" cy="-7" r="6" fill="${ba}"/><path d="M -84 28 L 84 28 L 64 52 L -64 52 Z" fill="${sh}"/><circle cx="-70" cy="40" r="4" fill="${ac}"/><circle cx="70" cy="40" r="4" fill="${ac}"/></g>`,
      neon_sign: `<g transform="translate(${cx} ${cy})"><rect x="-120" y="-90" width="240" height="180" rx="18" fill="${ink}"/><rect x="-120" y="-90" width="240" height="180" rx="18" fill="none" stroke="${ac}" stroke-width="6" class="tw"/><path d="M -70 50 L -70 -40 L -30 50 L -30 -40 M 10 -40 L 10 50 M 10 5 L 52 5 M 52 -40 L 52 50 L 84 -40" stroke="${li}" stroke-width="12" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0.95"/><path d="M -70 50 L -70 -40 L -30 50 L -30 -40 M 10 -40 L 10 50 M 10 5 L 52 5 M 52 -40 L 52 50 L 84 -40" stroke="${ac}" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round" class="tw"/></g>`,
      robot_head: `<g transform="translate(${cx} ${cy})"><rect x="-80" y="-80" width="160" height="140" rx="22" fill="${ba}"/><rect x="-80" y="-80" width="160" height="140" rx="22" fill="none" stroke="${sh}" stroke-width="7"/><rect x="-58" y="-46" width="116" height="34" rx="10" fill="${ink}"/><rect x="-48" y="-40" width="40" height="22" rx="6" fill="${ac}" class="tw"/><rect x="8" y="-40" width="40" height="22" rx="6" fill="${ac}" class="tw"/><rect x="-40" y="14" width="80" height="10" rx="5" fill="${sh}"/><rect x="-30" y="34" width="14" height="10" fill="${mi}"/><rect x="16" y="34" width="14" height="10" fill="${mi}"/><line x1="0" y1="-80" x2="0" y2="-116" stroke="${sh}" stroke-width="8"/><circle cy="-124" r="9" fill="${ac}" class="tw"/></g>`,
      hot_air_balloon: `<g transform="translate(${cx} ${cy})"><path d="M 0 -120 Q 95 -60 62 40 Q 30 78 0 78 Q -30 78 -62 40 Q -95 -60 0 -120 Z" fill="${ba}"/><path d="M 0 -120 Q 40 -50 26 60 L 0 78 Z" fill="${ac}" opacity="0.85"/><path d="M -30 -100 Q -52 -20 -22 52" stroke="${sh}" stroke-width="5" fill="none" opacity="0.7"/><path d="M 30 -100 Q 52 -20 22 52" stroke="${sh}" stroke-width="5" fill="none" opacity="0.7"/><path d="M -26 78 L -18 108 L 18 108 L 26 78 Z" fill="${sh}"/><rect x="-20" y="106" width="40" height="26" rx="5" fill="${mi}"/></g>`,
      spyglass: `<g transform="translate(${cx} ${cy}) rotate(-28)"><rect x="-100" y="-22" width="150" height="44" rx="20" fill="${ba}"/><rect x="40" y="-30" width="70" height="60" rx="16" fill="${mi}"/><circle cx="110" cy="0" r="22" fill="${ac}"/><circle cx="110" cy="0" r="12" fill="${li}" opacity="0.9"/><rect x="-100" y="-22" width="150" height="44" rx="20" fill="none" stroke="${sh}" stroke-width="6"/></g>`,
      clock_gears: `<g transform="translate(${cx} ${cy})"><circle r="88" fill="${ba}"/><circle r="88" fill="none" stroke="${sh}" stroke-width="8"/><circle r="66" fill="${mi}"/>${Array.from({ length: 12 }, (_, i) => { const a = i / 12 * Math.PI * 2; return `<rect x="${A.fmt(Math.cos(a) * 58 - 4)}" y="${A.fmt(Math.sin(a) * 58 - 4)}" width="8" height="16" fill="${ink}" transform="rotate(${i * 30} ${A.fmt(Math.cos(a) * 58)} ${A.fmt(Math.sin(a) * 58)})"/>`; }).join('')}<path d="M 0 0 L 0 -44" stroke="${ink}" stroke-width="9" stroke-linecap="round"/><path d="M 0 0 L 30 18" stroke="${ink}" stroke-width="7" stroke-linecap="round"/><circle r="9" fill="${ac}"/></g>`
    };
    return P_[id] || P_.top_hat;
  }

  function render(iconId, backdropId, seedStr, palId) {
    const rng = A.makeRng(seedStr + ':' + iconId);
    const P = A.PALETTES[palId] || A.PALETTES.golden_hour;
    const d = A.doc(W, H, 'ic' + iconId + '_');
    const c = { d, rng, P, w: W, h: H };
    backdrops(backdropId, c);
    // badge frame
    d.add(`<circle cx="${W / 2}" cy="${H / 2}" r="300" fill="${A.mix(P.base, P.shadow, 0.5)}"/>`);
    d.add(`<circle cx="${W / 2}" cy="${H / 2}" r="300" fill="none" stroke="${P.light}" stroke-width="6" opacity="0.8"/>`);
    d.add(`<circle cx="${W / 2}" cy="${H / 2}" r="282" fill="none" stroke="${P.accent}" stroke-width="3" opacity="0.6"/>`);
    // icon with cast shadow + rim
    const inner = icon(iconId, c);
    d.add(inner);
    d.add(`<circle cx="${W / 2}" cy="${H / 2}" r="300" fill="none" stroke="${P.ink}" stroke-width="10" opacity="0.35"/>`);
    A.vignette(d, d.p, W, H, 0.4);
    A.grain(d, d.p, W, H);
    return d.render(`0 0 ${W} ${H}`, 'role="img" aria-hidden="true"' + (A.REDUCED ? ' class="reduced"' : ''));
  }

  window.ART.icons = { render, BACKDROPS: A.L.BACKDROPS, ICONS: A.L.ICONS };
})();
