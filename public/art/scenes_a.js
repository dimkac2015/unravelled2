/* Unravelled — scenes part A (first 12 of 24 SCENES, in listed order).
   Each scene: seeded variants, 4–5 depth layers, one light, weather + time. */
(function () {
  const A = window.ART;
  const W = 800, H = 1000;

  function base(seed, pal, time, weather) {
    const c = A.sceneBase(seed + ':sky', pal, time, weather, W, H);
    A.celestial(c, time);
    return c;
  }
  function tints(c) { // atmospheric perspective: far → near
    const sky = c.T.sky[1];
    return {
      far: A.mix(c.P.mid, sky, 0.55), far2: A.mix(c.P.mid, sky, 0.3),
      mid: c.P.base, near: c.P.shadow, fore: c.P.ink
    };
  }
  function treeLine(c, y, x0, x1, n, col, hMin, hMax) {
    const id = c.d.p + 'tr';
    c.d.def(`<g id="${id}"><path d="M0 0 L-6 -18 L-2.5 -18 L-9 -34 L-3.5 -34 L0 -50 L3.5 -34 L9 -34 L2.5 -18 L6 -18 Z"/><rect x="-2" y="-3" width="4" height="6"/></g>`);
    let s = '';
    for (let i = 0; i < n; i++) {
      const x = c.rng.range(x0, x1), h = c.rng.range(hMin, hMax);
      s += `<use href="#${id}" x="${A.fmt(x)}" y="${A.fmt(y)}" transform="scale(${A.fmt(h / 50)})" fill="${col}" opacity="${A.fmt(c.rng.range(0.75, 1))}"/>`;
    }
    return s;
  }
  function birds(c, n, x0, x1, y0, y1, col) {
    let s = '';
    for (let i = 0; i < n; i++) {
      const x = c.rng.range(x0, x1), y = c.rng.range(y0, y1), w = c.rng.range(6, 13);
      s += `<path d="M ${A.fmt(x - w)} ${A.fmt(y)} Q ${A.fmt(x)} ${A.fmt(y - w * 0.7)} ${A.fmt(x)} ${A.fmt(y)} Q ${A.fmt(x)} ${A.fmt(y - w * 0.7)} ${A.fmt(x + w)} ${A.fmt(y)}" fill="none" stroke="${col}" stroke-width="2"/>`;
    }
    return s;
  }
  function finishScene(c, weather, opts) {
    A.mist(c.d, H * 0.52, 90, c.P.light, 0.12);
    A.mist(c.d, H * 0.68, 70, c.P.light, 0.1);
    A.weatherOverlay(c, weather);
    return A.finish(c.d, W, H, opts || { vig: 0.45 });
  }

  const scenes = {
    ocean_ship(seed, pal, time, weather) {
      const c = base(seed, pal, time, weather), t = tints(c);
      for (let i = 0; i < 3; i++) { // far → near waves
        const y = H * (0.62 + i * 0.12), amp = 8 + i * 7, col = [t.far, t.mid, t.near][i];
        c.d.add(`<path d="${A.wavePath(c.rng, y, amp, W, H, i * 2.1)} L ${W} ${H} L 0 ${H} Z" fill="${col}" class="${i === 2 ? 'drift' : ''}"/>`);
      }
      const sx = c.rng.range(W * 0.3, W * 0.7), sy = H * 0.58, sc = c.rng.range(0.8, 1.2);
      const ship = `<g transform="translate(${A.fmt(sx)} ${A.fmt(sy)}) scale(${A.fmt(sc)})">
        <path d="M -70 0 L 70 0 L 52 26 L -52 26 Z" fill="${c.P.ink}"/>
        <rect x="-4" y="-95" width="8" height="95" fill="${c.P.ink}"/>
        <path d="M 4 -92 L 52 -12 L 4 -12 Z" fill="${c.P.light}"/><path d="M -4 -80 L -46 -14 L -4 -14 Z" fill="${c.P.mid}"/>
        <path d="M 4 -95 L 30 -95 L 4 -86 Z" fill="${c.P.accent}"/>
        <circle cx="-20" cy="12" r="4" fill="${c.P.accent}"/><circle cx="0" cy="12" r="4" fill="${c.P.accent}"/><circle cx="20" cy="12" r="4" fill="${c.P.accent}"/></g>`;
      c.d.add(A.castShadow(`M -70 26 L 70 26 L 52 40 L -52 40 Z`, 26, 8, c.P.ink, 0.5) .replace('<path', `<path transform="translate(${A.fmt(sx)} ${A.fmt(sy)}) scale(${A.fmt(sc)})"`));
      c.d.add(ship);
      c.d.add(birds(c, c.rng.int(3, 6), 60, W - 60, H * 0.1, H * 0.3, c.P.ink));
      c.d.add(A.cloud(c, c.rng, W * 0.2, H * 0.12, 1.4, t.far2, 0.8) + A.cloud(c, c.rng, W * 0.7, H * 0.2, 1.1, t.far2, 0.7));
      return finishScene(c, weather);
    },
    river(seed, pal, time, weather) {
      const c = base(seed, pal, time, weather), t = tints(c);
      const hz = H * c.rng.range(0.55, 0.62);
      c.d.add(`<rect y="${A.fmt(hz)}" width="${W}" height="${A.fmt(H - hz)}" fill="${A.mix(c.P.shadow, c.T.sky[1], 0.25)}"/>`);
      c.d.add(`<path d="${A.wavePath(c.rng, hz + 30, 6, W, H, 1)} L ${W} ${H} L 0 ${H} Z" fill="${c.P.base}" opacity="0.85"/>`);
      const rx = W * 0.5;
      c.d.add(`<path d="${A.catmull([[rx - 130, hz + 10], [rx - 60, hz + 120], [rx + 20, hz + 260], [rx - 40, hz + 420], [rx + 10, H]])} L ${A.fmt(rx + 90)} ${H} L ${A.fmt(rx + 160)} ${A.fmt(hz + 260)} L ${A.fmt(rx + 90)} ${A.fmt(hz + 110)} L ${A.fmt(rx + 150)} ${A.fmt(hz + 10)} Z" fill="${A.mix(c.P.base, c.T.light, 0.25)}" opacity="0.9"/>`);
      c.d.add(A.layer(c.d, A.ridge(c.rng, -20, hz - 40, W + 20, hz - c.rng.range(30, 80), 30, 5), hz, H, t.far, 1));
      c.d.add(A.layer(c.d, A.ridge(c.rng, -20, hz + 30, W + 20, hz - c.rng.range(10, 40), 24, 5), hz + 40, H, t.mid, 1));
      c.d.add(treeLine(c, hz + 36, 20, W - 20, 9, t.mid, 40, 80));
      c.d.add(treeLine(c, H * 0.86, 10, W / 2, 6, t.near, 90, 150) + treeLine(c, H * 0.9, W / 2, W - 10, 6, t.fore, 110, 190));
      c.d.add(birds(c, c.rng.int(2, 5), 80, W - 80, H * 0.12, H * 0.3, c.P.ink));
      return finishScene(c, weather);
    },
    forest(seed, pal, time, weather) {
      const c = base(seed, pal, time, weather), t = tints(c);
      const hz = H * c.rng.range(0.58, 0.64);
      c.d.add(A.layer(c.d, A.ridge(c.rng, -20, hz - 120, W + 20, hz - c.rng.range(60, 140), 46, 5), hz, H, t.far, 1));
      c.d.add(A.layer(c.d, A.ridge(c.rng, -20, hz, W + 20, hz - c.rng.range(20, 60), 36, 5), hz + 60, H, t.far2, 1));
      c.d.add(treeLine(c, hz + 40, 0, W, c.rng.int(8, 12), t.mid, 90, 170));
      const gx = c.rng.range(W * 0.35, W * 0.65);
      c.d.add(`<path d="M ${A.fmt(gx - 26)} ${H * 0.9} L ${A.fmt(gx)} ${H * 0.52} L ${A.fmt(gx + 26)} ${H * 0.9} Z" fill="${A.mix(c.P.light, c.T.glow, 0.5)}" opacity="0.5" class="drift"/>`);
      c.d.add(treeLine(c, H * 0.82, 0, W, c.rng.int(7, 10), t.near, 130, 230));
      c.d.add(treeLine(c, H * 0.97, 0, W, c.rng.int(6, 9), t.fore, 200, 320));
      c.d.add(`<ellipse cx="${A.fmt(gx)}" cy="${A.fmt(H * 0.95)}" rx="180" ry="26" fill="${c.P.ink}" opacity="0.55"/>`);
      return finishScene(c, weather, { vig: 0.5 });
    },
    autumn_woods(seed, pal, time, weather) {
      const c = base(seed, pal, time, weather), t = tints(c);
      const hz = H * 0.6;
      c.d.add(A.layer(c.d, A.ridge(c.rng, -20, hz - 80, W + 20, hz - 40, 40, 5), hz, H, t.far, 1));
      c.d.add(treeLine(c, hz + 20, 0, W, 8, t.mid, 80, 150));
      const n = c.rng.int(40, 70);
      for (let i = 0; i < n; i++) c.d.add(`<circle cx="${A.fmt(c.rng.range(0, W))}" cy="${A.fmt(c.rng.range(hz, H))}" r="${A.fmt(c.rng.range(2, 5))}" fill="${c.rng.pick([c.P.accent, c.P.mid, c.P.light])}" opacity="${A.fmt(c.rng.range(0.5, 0.95))}" class="${c.rng.chance(0.4) ? 'snow' : ''}" style="animation-delay:${A.fmt(c.rng.range(0, 5))}s;animation-duration:${A.fmt(c.rng.range(6, 10))}s"/>`);
      c.d.add(treeLine(c, H * 0.8, 0, W, 6, t.near, 120, 200));
      c.d.add(treeLine(c, H * 0.96, 0, W, 6, t.fore, 180, 300));
      return finishScene(c, weather);
    },
    birch_forest(seed, pal, time, weather) {
      const c = base(seed, pal, time, weather), t = tints(c);
      const hz = H * 0.58;
      c.d.add(A.layer(c.d, A.ridge(c.rng, -20, hz - 60, W + 20, hz - 20, 30, 5), hz, H, t.far, 1));
      c.d.add(A.layer(c.d, A.ridge(c.rng, -20, hz + 60, W + 20, hz + 10, 26, 5), hz + 70, H, t.far2, 1));
      const n = c.rng.int(9, 13);
      for (let i = 0; i < n; i++) {
        const x = c.rng.range(30, W - 30), hgt = c.rng.range(H * 0.35, H * 0.6), wdt = c.rng.range(7, 12);
        c.d.add(`<rect x="${A.fmt(x)}" y="${A.fmt(hz - hgt)}" width="${A.fmt(wdt)}" height="${A.fmt(hgt + (H - hz))}" fill="${c.rng.chance(0.5) ? t.mid : t.near}"/>`);
        c.d.add(`<rect x="${A.fmt(x)}" y="${A.fmt(hz - hgt)}" width="${A.fmt(wdt)}" height="${A.fmt(hgt)}" fill="none" stroke="${c.P.ink}" stroke-width="2" stroke-dasharray="${A.fmt(c.rng.range(6, 14))} ${A.fmt(c.rng.range(4, 9))}" opacity="0.7"/>`);
      }
      c.d.add(A.mist(c.d, hz - 10, 60, c.P.light, 0.18));
      c.d.add(treeLine(c, H * 0.95, 0, W, 5, t.fore, 160, 260));
      return finishScene(c, weather);
    },
    desert(seed, pal, time, weather) {
      const c = base(seed, pal, time, weather), t = tints(c);
      const hz = H * 0.6;
      c.d.add(`<rect y="${A.fmt(hz)}" width="${W}" height="${A.fmt(H - hz)}" fill="${c.P.base}"/>`);
      for (let i = 0; i < 4; i++) c.d.add(`<path d="${A.wavePath(c.rng, hz + 40 + i * 90, 10 + i * 6, W, H, i)} L ${W} ${H} L 0 ${H} Z" fill="${A.mix(c.P.base, c.P.mid, i / 4)}" opacity="0.9"/>`);
      const px = c.rng.range(W * 0.3, W * 0.7), ph = c.rng.range(120, 200);
      c.d.add(A.castShadow(`M ${A.fmt(px - 30)} ${A.fmt(hz + 150)} L ${A.fmt(px + 30)} ${A.fmt(hz + 150)} L ${A.fmt(px + 16)} ${A.fmt(hz + 158)} L ${A.fmt(px - 44)} ${A.fmt(hz + 158)} Z`, 60, 10, c.P.ink, 0.5));
      c.d.add(`<path d="M ${A.fmt(px)} ${A.fmt(hz + 150 - ph)} L ${A.fmt(px + 26)} ${A.fmt(hz + 150)} L ${A.fmt(px)} ${A.fmt(hz + 150)} Z" fill="${c.P.ink}"/><rect x="${A.fmt(px - 5)}" y="${A.fmt(hz + 60)}" width="10" height="${A.fmt(ph - 60)}" fill="${c.P.ink}"/><ellipse cx="${A.fmt(px)}" cy="${A.fmt(hz + 152)}" rx="34" ry="7" fill="${c.P.shadow}"/>`);
      c.d.add(`<path d="M ${A.fmt(W * 0.15)} ${A.fmt(hz + 60)} q 18 -34 36 0" fill="none" stroke="${c.P.shadow}" stroke-width="7"/><path d="M ${A.fmt(W * 0.8)} ${A.fmt(hz + 110)} q 14 -26 28 0" fill="none" stroke="${c.P.shadow}" stroke-width="6"/>`);
      return finishScene(c, weather);
    },
    mountains(seed, pal, time, weather) {
      const c = base(seed, pal, time, weather), t = tints(c);
      const hz = H * 0.62;
      const pk = c.rng.range(W * 0.3, W * 0.7), ph = c.rng.range(H * 0.3, H * 0.42);
      c.d.add(A.layer(c.d, A.ridge(c.rng, -20, hz - 160, W + 20, hz - 60, 60, 5), hz, H, t.far, 1));
      c.d.add(`<path d="M ${A.fmt(pk - 260)} ${A.fmt(hz)} L ${A.fmt(pk)} ${A.fmt(hz - ph)} L ${A.fmt(pk + 260)} ${A.fmt(hz)} Z" fill="${t.mid}"/>`);
      c.d.add(`<path d="M ${A.fmt(pk - 70)} ${A.fmt(hz - ph + 78)} L ${A.fmt(pk)} ${A.fmt(hz - ph)} L ${A.fmt(pk + 70)} ${A.fmt(hz - ph + 78)} L ${A.fmt(pk + 34)} ${A.fmt(hz - ph + 52)} L ${A.fmt(pk)} ${A.fmt(hz - ph + 88)} L ${A.fmt(pk - 34)} ${A.fmt(hz - ph + 52)} Z" fill="${c.P.light}"/>`);
      c.d.add(A.layer(c.d, A.ridge(c.rng, -20, hz + 20, W + 20, hz - 10, 34, 5), hz + 30, H, t.mid, 1));
      c.d.add(treeLine(c, hz + 60, 0, W, 8, t.near, 60, 120));
      c.d.add(A.layer(c.d, A.ridge(c.rng, -20, hz + 160, W + 20, hz + 80, 26, 4), hz + 170, H, t.near, 1));
      c.d.add(treeLine(c, H * 0.98, 0, W, 5, t.fore, 140, 240));
      return finishScene(c, weather);
    },
    volcano(seed, pal, time, weather) {
      const c = base(seed, pal, time, weather, ), t = tints(c);
      const hz = H * 0.66, vx = W * c.rng.range(0.4, 0.6);
      c.d.add(A.layer(c.d, A.ridge(c.rng, -20, hz - 100, W + 20, hz - 40, 50, 5), hz, H, t.far, 1));
      c.d.add(`<path d="M ${A.fmt(vx - 300)} ${A.fmt(hz)} L ${A.fmt(vx - 60)} ${A.fmt(hz - 300)} L ${A.fmt(vx + 60)} ${A.fmt(hz - 300)} L ${A.fmt(vx + 300)} ${A.fmt(hz)} Z" fill="${t.mid}"/>`);
      c.d.add(`<path d="M ${A.fmt(vx - 60)} ${A.fmt(hz - 300)} L ${A.fmt(vx)} ${A.fmt(hz - 360)} L ${A.fmt(vx + 60)} ${A.fmt(hz - 300)} Z" fill="${c.P.accent}"/>`);
      c.d.add(`<path d="${A.catmull([[vx, hz - 350], [vx + c.rng.range(-30, 30), hz - 430], [vx + c.rng.range(-50, 50), hz - 520], [vx + c.rng.range(-40, 40), hz - 640]])}" fill="none" stroke="${c.P.shadow}" stroke-width="26" stroke-linecap="round" opacity="0.85"/>`);
      c.d.add(`<path d="${A.catmull([[vx, hz - 350], [vx + c.rng.range(-20, 20), hz - 440], [vx + c.rng.range(-30, 30), hz - 560]])}" fill="none" stroke="${c.P.accent}" stroke-width="9" stroke-linecap="round" opacity="0.9" class="drift"/>`);
      c.d.add(`<path d="M ${A.fmt(vx - 60)} ${A.fmt(hz - 300)} L ${A.fmt(vx - 130)} ${A.fmt(hz - 60)} L ${A.fmt(vx - 60)} ${A.fmt(hz - 120)} Z" fill="${c.P.accent}" opacity="0.9"/>`);
      c.d.add(A.layer(c.d, A.ridge(c.rng, -20, hz + 40, W + 20, hz, 30, 5), hz + 50, H, t.near, 1));
      for (let i = 0; i < 12; i++) c.d.add(`<circle cx="${A.fmt(c.rng.range(vx - 200, vx + 200))}" cy="${A.fmt(c.rng.range(hz + 60, H))}" r="${A.fmt(c.rng.range(3, 9))}" fill="${c.P.accent}" opacity="${A.fmt(c.rng.range(0.3, 0.8))}" class="tw" style="animation-delay:${A.fmt(c.rng.range(0, 6))}s"/>`);
      return finishScene(c, weather, { vig: 0.5 });
    },
    night_city(seed, pal, time, weather) {
      const c = base(seed, pal, time, weather), t = tints(c);
      const hz = H * 0.72;
      c.d.add(A.starField(c.d, c.rng, W, H * 0.5, 50, c.P.light, 1.6));
      const n = c.rng.int(9, 13);
      for (let i = 0; i < n; i++) {
        const bw = c.rng.range(50, 95), bh = c.rng.range(180, 420), bx = (W / n) * i + c.rng.range(-8, 8);
        c.d.add(`<rect x="${A.fmt(bx)}" y="${A.fmt(hz - bh)}" width="${A.fmt(bw)}" height="${A.fmt(bh)}" fill="${i % 3 === 0 ? t.mid : t.near}"/>`);
        for (let wy = hz - bh + 16; wy < hz - 20; wy += 26) for (let wx = bx + 8; wx < bx + bw - 10; wx += 18)
          if (c.rng.chance(0.4)) c.d.add(`<rect x="${A.fmt(wx)}" y="${A.fmt(wy)}" width="7" height="10" fill="${c.rng.chance(0.75) ? c.P.accent : c.P.light}" opacity="${A.fmt(c.rng.range(0.5, 1))}" class="${c.rng.chance(0.2) ? 'tw' : ''}"/>`);
      }
      c.d.add(`<rect y="${A.fmt(hz)}" width="${W}" height="${A.fmt(H - hz)}" fill="${c.P.ink}"/>`);
      c.d.add(`<rect x="0" y="${A.fmt(hz)}" width="${W}" height="6" fill="${c.P.accent}" opacity="0.5"/>`);
      for (let i = 0; i < 4; i++) c.d.add(`<circle cx="${A.fmt(c.rng.range(40, W - 40))}" cy="${A.fmt(hz - c.rng.range(60, 200))}" r="${A.fmt(c.rng.range(18, 40))}" fill="${c.P.light}" opacity="0.1"/>`);
      return finishScene(c, weather, { vig: 0.55 });
    },
    rainy_street(seed, pal, time, weather) {
      const c = base(seed, pal, time, weather || 'rain'), t = tints(c);
      const hz = H * 0.7;
      for (let i = 0; i < 5; i++) {
        const bw = c.rng.range(70, 130), bh = c.rng.range(150, 330), bx = i * (W / 5) - 20;
        c.d.add(`<rect x="${A.fmt(bx)}" y="${A.fmt(hz - bh)}" width="${A.fmt(bw)}" height="${A.fmt(bh)}" fill="${i % 2 ? t.near : t.mid}"/>`);
      }
      c.d.add(`<rect y="${A.fmt(hz)}" width="${W}" height="${A.fmt(H - hz)}" fill="${c.P.shadow}"/>`);
      c.d.add(`<rect y="${A.fmt(hz)}" width="${W}" height="${A.fmt(H - hz)}" fill="${c.P.ink}" opacity="0.35"/>`);
      const lx = W * c.rng.range(0.3, 0.7);
      c.d.add(`<rect x="${A.fmt(lx - 4)}" y="${A.fmt(H * 0.18)}" width="8" height="${A.fmt(hz - H * 0.18)}" fill="${c.P.ink}"/>`);
      c.d.add(A.cone(c.d, c.d.p, lx, H * 0.18, 90, hz - H * 0.18 + 60, c.P.accent, 0.28));
      c.d.add(`<circle cx="${A.fmt(lx)}" cy="${A.fmt(H * 0.18)}" r="10" fill="${c.P.accent}"/><ellipse cx="${A.fmt(lx)}" cy="${A.fmt(hz + 30)}" rx="90" ry="14" fill="${c.P.accent}" opacity="0.25"/>`);
      for (let i = 0; i < 10; i++) c.d.add(`<rect x="${A.fmt(c.rng.range(0, W))}" y="${A.fmt(hz + c.rng.range(10, H - hz - 10))}" width="${A.fmt(c.rng.range(14, 40))}" height="3" fill="${c.P.light}" opacity="0.25"/>`);
      return finishScene(c, weather || 'rain', { vig: 0.55 });
    },
    snowfield(seed, pal, time, weather) {
      const c = base(seed, pal, time, weather || 'snow'), t = tints(c);
      const hz = H * 0.6;
      c.d.add(A.layer(c.d, A.ridge(c.rng, -20, hz - 60, W + 20, hz - 20, 30, 5), hz, H, A.mix(c.P.light, '#ffffff', 0.35), 1));
      c.d.add(A.layer(c.d, A.ridge(c.rng, -20, hz + 90, W + 20, hz + 40, 24, 4), hz + 100, H, c.P.light, 0.9));
      const fx = c.rng.range(W * 0.3, W * 0.7);
      c.d.add(`<path d="M ${A.fmt(fx)} ${A.fmt(H * 0.82)} l -8 -34 l 8 -6 l 8 6 Z" fill="${c.P.ink}"/><rect x="${A.fmt(fx - 3)}" y="${A.fmt(H * 0.82 - 40)}" width="6" height="42" fill="${c.P.ink}"/>`);
      c.d.add(A.castShadow(`M ${A.fmt(fx - 10)} ${A.fmt(H * 0.82)} L ${A.fmt(fx + 10)} ${A.fmt(H * 0.82)} L ${A.fmt(fx + 60)} ${A.fmt(H * 0.82 + 8)} L ${A.fmt(fx - 30)} ${A.fmt(H * 0.82 + 8)} Z`, 50, 8, c.P.shadow, 0.5));
      c.d.add(treeLine(c, H * 0.98, 0, W, 4, A.mix(c.P.shadow, c.P.ink, 0.5), 120, 200));
      for (let i = 0; i < 14; i++) c.d.add(`<path d="M ${A.fmt(c.rng.range(0, W))} ${A.fmt(c.rng.range(hz, H))} l ${A.fmt(c.rng.range(-30, 30))} 0" stroke="${c.P.mid}" stroke-width="2" opacity="0.4"/>`);
      return finishScene(c, weather || 'snow', { vig: 0.4 });
    },
    meadow_summer(seed, pal, time, weather) {
      const c = base(seed, pal, time, weather), t = tints(c);
      const hz = H * 0.62;
      c.d.add(`<rect y="${A.fmt(hz)}" width="${W}" height="${A.fmt(H - hz)}" fill="${c.P.base}"/>`);
      c.d.add(A.layer(c.d, A.ridge(c.rng, -20, hz - 30, W + 20, hz - 60, 26, 5), hz, H, A.mix(c.P.base, c.P.mid, 0.5), 1));
      const n = c.rng.int(50, 90);
      for (let i = 0; i < n; i++) {
        const x = c.rng.range(0, W), y = c.rng.range(hz + 20, H), h = c.rng.range(8, 22);
        c.d.add(`<line x1="${A.fmt(x)}" y1="${A.fmt(y)}" x2="${A.fmt(x)}" y2="${A.fmt(y - h)}" stroke="${c.P.mid}" stroke-width="2"/><circle cx="${A.fmt(x)}" cy="${A.fmt(y - h)}" r="${A.fmt(c.rng.range(2.5, 5))}" fill="${c.rng.pick([c.P.light, c.P.accent, '#ffffff'])}" opacity="0.9"/>`);
      }
      const bx = c.rng.range(W * 0.2, W * 0.4), by = hz + 30;
      c.d.add(`<path d="M ${A.fmt(bx)} ${A.fmt(by)} q -14 -40 4 -58 q 18 18 4 58" fill="${c.P.accent}" opacity="0.9"/><circle cx="${A.fmt(bx + 4)}" cy="${A.fmt(by - 62)}" r="7" fill="${c.P.light}"/>`);
      c.d.add(birds(c, c.rng.int(3, 6), 100, W - 100, H * 0.1, H * 0.28, c.P.ink));
      c.d.add(A.cloud(c, c.rng, W * 0.25, H * 0.1, 1.5, '#ffffff', 0.85) + A.cloud(c, c.rng, W * 0.7, H * 0.18, 1.2, '#ffffff', 0.75));
      return finishScene(c, weather);
    },
    lavender_fields(seed, pal, time, weather) {
      const c = base(seed, pal, time, weather), t = tints(c);
      const hz = H * 0.55;
      c.d.add(A.layer(c.d, A.ridge(c.rng, -20, hz - 80, W + 20, hz - 30, 36, 5), hz, H, t.far, 1));
      for (let r = 0; r < 6; r++) {
        const y = hz + 20 + r * 75, col = A.mix(c.P.mid, r > 3 ? c.P.shadow : c.P.base, r / 6);
        c.d.add(`<path d="${A.wavePath(c.rng, y, 8 + r * 3, W, H, r)} L ${W} ${H} L 0 ${H} Z" fill="${col}"/>`);
        const n = 26 - r * 3;
        for (let i = 0; i < n; i++) {
          const x = c.rng.range(0, W), h = c.rng.range(10, 26) * (0.6 + r * 0.09);
          c.d.add(`<line x1="${A.fmt(x)}" y1="${A.fmt(y + 12)}" x2="${A.fmt(x)}" y2="${A.fmt(y + 12 - h)}" stroke="${A.mix(c.P.shadow, c.P.ink, 0.4)}" stroke-width="2.4"/><circle cx="${A.fmt(x)}" cy="${A.fmt(y + 10 - h)}" r="${A.fmt(c.rng.range(2, 4))}" fill="${c.rng.chance(0.8) ? c.P.light : c.P.accent}"/>`);
        }
      }
      return finishScene(c, weather);
    }
  };

  window.ART.scenes = Object.assign(window.ART.scenes || {}, scenes);
  window.ART.kit = { base, tints, treeLine, birds, finishScene, W, H };
})();
