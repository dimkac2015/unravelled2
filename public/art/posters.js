/* Unravelled — movie posters (spec 6.10): 14 compositions, 20 elements.
   Portrait frame, thin inner border, empty bottom band (title is HTML). */
(function () {
  const A = window.ART;
  const W = 800, H = 1200, BAND = 190;

  function elements(c, ids, groundY) {
    const { d, rng, P } = c, F = A.fmt, ink = P.ink, mi = P.mid, li = P.light, ac = P.accent;
    const gy = groundY;
    for (const id of ids) {
      const x = rng.range(W * 0.15, W * 0.85), s = rng.range(0.8, 1.3);
      switch (id) {
        case 'streetlamp': d.add(`<rect x="${F(x - 5)}" y="${F(gy - 300 * s)}" width="10" height="${F(300 * s)}" fill="${ink}"/><circle cx="${F(x)}" cy="${F(gy - 306 * s)}" r="12" fill="${ac}" class="${A.REDUCED ? '' : 'tw'}"/><ellipse cx="${F(x)}" cy="${F(gy + 6)}" rx="60" ry="10" fill="${ac}" opacity="0.25"/>`); break;
        case 'moon': d.add(`<circle cx="${F(x)}" cy="${F(gy - 620 * s)}" r="${F(70 * s)}" fill="${li}" opacity="0.95"/><circle cx="${F(x + 24 * s)}" cy="${F(gy - 632 * s)}" r="${F(60 * s)}" fill="${P.shadow}"/>`); break;
        case 'car': d.add(`<g transform="translate(${F(x)} ${F(gy)}) scale(${F(s)})"><path d="M -110 0 L -95 -34 L -40 -38 L -15 -66 L 45 -66 L 70 -36 L 100 -32 L 112 0 Z" fill="${ink}"/><circle cx="-55" cy="2" r="18" fill="${mi}"/><circle cx="60" cy="2" r="18" fill="${mi}"/><rect x="-8" y="-58" width="46" height="22" fill="${li}" opacity="0.5"/><ellipse cx="0" cy="14" rx="120" ry="8" fill="${ink}" opacity="0.5"/></g>`); break;
        case 'train': d.add(`<g transform="translate(${F(x)} ${F(gy)}) scale(${F(s)})"><rect x="-130" y="-120" width="260" height="110" rx="14" fill="${ink}"/><rect x="-110" y="-100" width="50" height="40" fill="${li}" opacity="0.6"/><rect x="-40" y="-100" width="50" height="40" fill="${li}" opacity="0.6"/><rect x="30" y="-100" width="50" height="40" fill="${li}" opacity="0.6"/><circle cx="-70" cy="-4" r="20" fill="${mi}"/><circle cx="70" cy="-4" r="20" fill="${mi}"/><path d="M -30 -120 q 10 -40 -20 -70" stroke="${li}" stroke-width="12" fill="none" opacity="0.4"/></g>`); break;
        case 'house': d.add(`<g transform="translate(${F(x)} ${F(gy)}) scale(${F(s)})"><rect x="-70" y="-80" width="140" height="80" fill="${mi}"/><path d="M -84 -80 L 0 -140 L 84 -80 Z" fill="${ink}"/><rect x="-16" y="-42" width="32" height="42" fill="${ac}" class="${A.REDUCED ? '' : 'tw'}"/><rect x="-52" y="-62" width="24" height="20" fill="${li}" opacity="0.7"/><rect x="28" y="-62" width="24" height="20" fill="${li}" opacity="0.7"/></g>`); break;
        case 'tree': d.add(`<g transform="translate(${F(x)} ${F(gy)}) scale(${F(s)})"><rect x="-8" y="-60" width="16" height="60" fill="${ink}"/><circle cx="0" cy="-95" r="55" fill="${mi}"/><circle cx="-35" cy="-70" r="35" fill="${ink}"/><circle cx="35" cy="-72" r="38" fill="${ink}"/></g>`); break;
        case 'umbrella': d.add(`<g transform="translate(${F(x)} ${F(gy)}) scale(${F(s)})"><path d="M -70 0 A 70 70 0 0 1 70 0 Q 35 -14 0 0 Q -35 -14 -70 0 Z" fill="${ac}"/><line x1="0" y1="0" x2="0" y2="70" stroke="${ink}" stroke-width="7"/><path d="M 0 70 q 0 14 -14 14" stroke="${ink}" stroke-width="7" fill="none"/></g>`); break;
        case 'ship': d.add(`<g transform="translate(${F(x)} ${F(gy)}) scale(${F(s)})"><path d="M -90 0 L 90 0 L 66 26 L -66 26 Z" fill="${ink}"/><rect x="-4" y="-110" width="8" height="110" fill="${ink}"/><path d="M 4 -106 L 60 -14 L 4 -14 Z" fill="${li}" opacity="0.85"/><path d="M -4 -92 L -52 -16 L -4 -16 Z" fill="${mi}"/></g>`); break;
        case 'bridge': d.add(`<g transform="translate(${F(x)} ${F(gy)})"><path d="M -160 0 L 160 0" stroke="${ink}" stroke-width="14"/><path d="M -150 0 A 150 110 0 0 1 150 0" stroke="${mi}" stroke-width="10" fill="none"/><line x1="-100" y1="-52" x2="-100" y2="0" stroke="${mi}" stroke-width="5"/><line x1="0" y1="-78" x2="0" y2="0" stroke="${mi}" stroke-width="5"/><line x1="100" y1="-52" x2="100" y2="0" stroke="${mi}" stroke-width="5"/></g>`); break;
        case 'tower': d.add(`<g transform="translate(${F(x)} ${F(gy)}) scale(${F(s)})"><rect x="-30" y="-320" width="60" height="320" fill="${mi}"/><rect x="-38" y="-360" width="76" height="44" fill="${ink}"/><path d="M -38 -360 L 0 -410 L 38 -360 Z" fill="${ink}"/><rect x="-12" y="-280" width="24" height="34" fill="${ac}" class="${A.REDUCED ? '' : 'tw'}"/></g>`); break;
        case 'birds': for (let i = 0; i < 5; i++) { const bx = x + rng.range(-90, 90), by = gy - rng.range(320, 560); d.add(`<path d="M ${F(bx - 12)} ${F(by)} Q ${F(bx)} ${F(by - 10)} ${F(bx)} ${F(by)} Q ${F(bx)} ${F(by - 10)} ${F(bx + 12)} ${F(by)}" stroke="${ink}" stroke-width="3.4" fill="none"/>`); } break;
        case 'clock': d.add(`<g transform="translate(${F(x)} ${F(gy - 380 * s)}) scale(${F(s)})"><circle r="64" fill="${mi}"/><circle r="64" fill="none" stroke="${ink}" stroke-width="8"/><path d="M 0 0 L 0 -36 M 0 0 L 24 14" stroke="${ink}" stroke-width="7" stroke-linecap="round"/><circle r="7" fill="${ac}"/></g>`); break;
        case 'bicycle': d.add(`<g transform="translate(${F(x)} ${F(gy)}) scale(${F(s)})"><circle cx="-45" cy="-20" r="30" fill="none" stroke="${ink}" stroke-width="8"/><circle cx="45" cy="-20" r="30" fill="none" stroke="${ink}" stroke-width="8"/><path d="M -45 -20 L -5 -70 L 45 -20 M -5 -70 L 20 -70 M -5 -70 L -18 -20" stroke="${ink}" stroke-width="7" fill="none"/></g>`); break;
        case 'balloon': d.add(`<g transform="translate(${F(x)} ${F(gy - 480 * s)})"><ellipse rx="42" ry="54" fill="${ac}" opacity="0.9"/><path d="M 0 54 q 6 30 -4 60" stroke="${li}" stroke-width="3" fill="none"/></g>`); break;
        case 'lighthouse': d.add(`<g transform="translate(${F(x)} ${F(gy)}) scale(${F(s)})"><path d="M -22 0 L -12 -220 L 12 -220 L 22 0 Z" fill="${li}"/><rect x="-16" y="-160" width="32" height="12" fill="${ac}"/><rect x="-14" y="-110" width="28" height="10" fill="${ac}"/><rect x="-15" y="-238" width="30" height="20" fill="${ink}"/><circle cy="-228" r="7" fill="${ac}" class="${A.REDUCED ? '' : 'tw'}"/></g>`); break;
        case 'campfire': d.add(`<g transform="translate(${F(x)} ${F(gy)})"><path d="M -40 0 L 40 0 M -30 -14 L 30 -14" stroke="${ink}" stroke-width="9"/><path d="M 0 -8 Q 22 -44 0 -84 Q -22 -44 0 -8 Z" fill="${ac}" class="${A.REDUCED ? '' : 'tw'}"/><ellipse cx="0" cy="6" rx="46" ry="9" fill="${ac}" opacity="0.3"/></g>`); break;
        case 'bench': d.add(`<g transform="translate(${F(x)} ${F(gy)})"><rect x="-80" y="-46" width="160" height="10" fill="${ink}"/><rect x="-80" y="-30" width="160" height="8" fill="${ink}"/><rect x="-70" y="-22" width="10" height="22" fill="${ink}"/><rect x="60" y="-22" width="10" height="22" fill="${ink}"/><rect x="-84" y="-70" width="10" height="26" fill="${ink}"/><rect x="74" y="-70" width="10" height="26" fill="${ink}"/></g>`); break;
        case 'suitcase': d.add(`<g transform="translate(${F(x)} ${F(gy)})"><rect x="-34" y="-52" width="68" height="52" rx="8" fill="${mi}"/><rect x="-34" y="-52" width="68" height="52" rx="8" fill="none" stroke="${ink}" stroke-width="5"/><path d="M -14 -52 q 14 -16 28 0" stroke="${ink}" stroke-width="6" fill="none"/></g>`); break;
        case 'telescope': d.add(`<g transform="translate(${F(x)} ${F(gy)}) rotate(-32)"><rect x="0" y="-14" width="130" height="28" rx="12" fill="${mi}"/><rect x="118" y="-18" width="26" height="36" rx="8" fill="${ac}"/><line x1="40" y1="10" x2="20" y2="52" stroke="${ink}" stroke-width="7"/><line x1="70" y1="12" x2="80" y2="52" stroke="${ink}" stroke-width="7"/></g>`); break;
        case 'cat': d.add(`<g transform="translate(${F(x)} ${F(gy)}) scale(${F(s)})"><ellipse cx="0" cy="-24" rx="26" ry="22" fill="${ink}"/><circle cx="0" cy="-56" r="17" fill="${ink}"/><path d="M -14 -66 L -18 -84 L -4 -70 Z M 14 -66 L 18 -84 L 4 -70 Z" fill="${ink}"/><path d="M 24 -30 q 22 -6 18 -28" stroke="${ink}" stroke-width="8" fill="none" stroke-linecap="round"/><circle cx="-6" cy="-58" r="3" fill="${ac}"/><circle cx="6" cy="-58" r="3" fill="${ac}"/></g>`); break;
      }
    }
  }
  function silhouetteFigure(d, x, y, s, col) {
    const F = A.fmt;
    d.add(`<g transform="translate(${F(x)} ${F(y)}) scale(${F(s)})"><circle cx="0" cy="-190" r="26" fill="${col}"/><path d="M -34 -160 Q 0 -178 34 -160 L 40 0 L -40 0 Z" fill="${col}"/></g>`);
  }
  function frame(c, inner) {
    const { d, P } = c;
    d.add(inner);
    d.add(`<rect x="26" y="26" width="${W - 52}" height="${H - 52}" fill="none" stroke="${P.light}" stroke-width="4" opacity="0.85"/>`);
    d.add(`<rect x="26" y="${H - BAND}" width="${W - 52}" height="${BAND - 26}" fill="${P.ink}" opacity="0.55"/>`);
  }
  function render(art, seedStr, palId, time) {
    const rng = A.makeRng(seedStr + ':poster:' + art.composition);
    const P = A.PALETTES[palId] || A.PALETTES.midnight_blue;
    const c = A.sceneBase(seedStr + ':p', palId, time || art.time_of_day || 'night', 'clear', W, H);
    A.celestial(c, time || art.time_of_day || 'night');
    const t = K_tints(c), gy = H - BAND - 60;
    const F = A.fmt;
    const comp = {
      lone_figure_road: () => { c.d.add(`<path d="M ${F(W / 2 - 50)} ${gy} L ${F(W / 2 - 14)} ${gy - 420} L ${F(W / 2 + 14)} ${gy - 420} L ${F(W / 2 + 50)} ${gy} Z" fill="${t.near}"/>`); silhouetteFigure(c.d, W / 2, gy, 1.15, c.P.ink); },
      two_silhouettes_facing: () => { silhouetteFigure(c.d, W * 0.34, gy, 1.2, c.P.ink); silhouetteFigure(c.d, W * 0.66, gy, 1.2, c.P.shadow); c.d.add(`<circle cx="${W / 2}" cy="${gy - 500}" r="60" fill="${c.P.accent}" opacity="0.9" class="${A.REDUCED ? '' : 'tw'}"/>`); },
      skyline_with_moon: () => { for (let i = 0; i < 8; i++) { const bw = rng.range(60, 110), bh = rng.range(150, 420), bx = i * 100; c.d.add(`<rect x="${F(bx)}" y="${F(gy - bh)}" width="${F(bw)}" height="${F(bh)}" fill="${i % 2 ? t.near : t.mid}"/>`); } },
      ship_at_sea: () => { c.d.add(`<path d="${A.wavePath(rng, gy - 40, 12, W, H, 1)} L ${W} ${H} L 0 ${H} Z" fill="${t.mid}"/>`); elements(c, ['ship'], gy - 60); },
      car_at_night: () => { c.d.add(`<rect y="${gy - 20}" width="${W}" height="${H - gy + 20}" fill="${c.P.shadow}"/>`); elements(c, ['car'], gy); c.d.add(`<path d="M 0 ${gy - 60} L ${W} ${gy - 260}" stroke="${c.P.light}" stroke-width="4" opacity="0.3"/>`); },
      window_view: () => { c.d.add(`<rect x="${W * 0.22}" y="${H * 0.12}" width="${W * 0.56}" height="${gy - H * 0.12}" fill="${A.mix(c.P.light, c.T.sky[1], 0.4)}" opacity="0.8"/>`); c.d.add(`<rect x="${W * 0.22}" y="${H * 0.12}" width="${W * 0.56}" height="${gy - H * 0.12}" fill="none" stroke="${c.P.ink}" stroke-width="14"/><line x1="${W / 2}" y1="${H * 0.12}" x2="${W / 2}" y2="${gy}" stroke="${c.P.ink}" stroke-width="10"/><line x1="${W * 0.22}" y1="${(H * 0.12 + gy) / 2}" x2="${W * 0.78}" y2="${(H * 0.12 + gy) / 2}" stroke="${c.P.ink}" stroke-width="10"/>`); silhouetteFigure(c.d, W * 0.5, gy, 0.9, c.P.ink); },
      doorway_light: () => { c.d.add(`<rect x="${W * 0.3}" y="${H * 0.1}" width="${W * 0.4}" height="${gy - H * 0.1}" fill="${A.mix(c.P.light, '#ffffff', 0.35)}"/>`); silhouetteFigure(c.d, W * 0.5, gy, 1.25, c.P.ink); },
      rooftop: () => { c.d.add(`<rect y="${gy}" width="${W}" height="${H - gy}" fill="${c.P.shadow}"/>`); for (let i = 0; i < 6; i++) { const bh = rng.range(120, 300); c.d.add(`<rect x="${i * 140 - 20}" y="${F(gy - bh - 90)}" width="120" height="${F(bh)}" fill="${t.near}" opacity="0.8"/>`); } silhouetteFigure(c.d, W * 0.7, gy, 1.1, c.P.ink); },
      train_station: () => { c.d.add(`<rect y="${gy - 30}" width="${W}" height="30" fill="${c.P.ink}"/>`); elements(c, ['train'], gy - 30); silhouetteFigure(c.d, W * 0.2, gy, 1, c.P.ink); },
      forest_path: () => { K_treeLine(c, gy, 0, W, 10, t.near, 100, 190); c.d.add(`<path d="M ${F(W / 2 - 60)} ${gy} L ${F(W / 2 - 16)} ${gy - 380} L ${F(W / 2 + 16)} ${gy - 380} L ${F(W / 2 + 60)} ${gy} Z" fill="${A.mix(c.P.light, c.T.glow, 0.5)}" opacity="0.55"/>`); silhouetteFigure(c.d, W / 2, gy, 1, c.P.ink); },
      crowd_figure: () => { for (let i = 0; i < 9; i++) silhouetteFigure(c.d, W * (0.12 + i * 0.095), gy + rng.range(-14, 14), rng.range(0.8, 1.1), i % 3 ? c.P.shadow : c.P.ink); silhouetteFigure(c.d, W * 0.5, gy - 40, 1.3, c.P.ink); },
      empty_chair_room: () => { c.d.add(`<g transform="translate(${W * 0.5} ${gy})"><rect x="-60" y="-150" width="120" height="16" fill="${t.mid}"/><rect x="-60" y="-134" width="14" height="134" fill="${t.mid}"/><rect x="46" y="-134" width="14" height="134" fill="${t.mid}"/><rect x="-60" y="-60" width="120" height="14" fill="${t.mid}"/><rect x="-52" y="-46" width="12" height="46" fill="${t.mid}"/><rect x="40" y="-46" width="12" height="46" fill="${t.mid}"/></g>`); c.d.add(A.cone(c.d, c.d.p, W * 0.5, -20, 200, gy + 40, c.P.light, 0.25)); },
      mountain_climb: () => { const pk = W * 0.6; c.d.add(`<path d="M ${F(pk - 320)} ${gy} L ${pk} ${F(gy - 520)} L ${F(pk + 320)} ${gy} Z" fill="${t.mid}"/><path d="M ${F(pk - 80)} ${F(gy - 440)} L ${pk} ${F(gy - 520)} L ${F(pk + 80)} ${F(gy - 440)} L ${F(pk + 30)} ${F(gy - 470)} L ${pk} ${F(gy - 500)} L ${F(pk - 34)} ${F(gy - 468)} Z" fill="${c.P.light}"/>`); silhouetteFigure(c.d, pk - 60, gy - 160, 0.85, c.P.ink); },
      ocean_wave: () => { for (let i = 0; i < 4; i++) c.d.add(`<path d="${A.wavePath(rng, gy - 120 + i * 70, 22 + i * 12, W, H, i * 1.9)} L ${W} ${H} L 0 ${H} Z" fill="${[t.far, t.mid, t.near, c.P.ink][i]}" opacity="0.95"/>`); elements(c, ['ship'], gy - 160); }
    }[art.composition] || (() => silhouetteFigure(c.d, W / 2, gy, 1.2, c.P.ink));
    comp();
    elements(c, (art.elements || []).slice(0, 3), gy);
    A.weatherOverlay(c, 'clear');
    frame(c, '');
    A.vignette(c.d, c.d.p, W, H, 0.5);
    const ht = A.halftone(c.d, c.d.p, c.P.ink); c.d.add(`<rect width="${W}" height="${H}" fill="${ht}" opacity="0.1"/>`);
    A.grain(c.d, c.d.p, W, H);
    return c.d.render(`0 0 ${W} ${H}`, 'preserveAspectRatio="xMidYMid slice" role="img" aria-hidden="true"' + (A.REDUCED ? ' class="reduced"' : ''));
  }
  function K_tints(c) { const sky = c.T.sky[1]; return { far: A.mix(c.P.mid, sky, 0.55), mid: c.P.base, near: c.P.shadow, fore: c.P.ink }; }
  function K_treeLine(c, y, x0, x1, n, col, hMin, hMax) { return A.kit.treeLine(c, y, x0, x1, n, col, hMin, hMax); }

  window.ART.posters = { render, ELEMENTS: A.L.ELEMENTS, COMPOSITIONS: A.L.COMPOSITIONS };
})();
