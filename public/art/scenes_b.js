/* Unravelled — scenes part B (remaining 11 of 24 SCENES). */
(function () {
  const A = window.ART, K = A.kit, W = K.W, H = K.H;
  const base = K.base, tints = K.tints, treeLine = K.treeLine, birds = K.birds, finishScene = K.finishScene;

  const scenes = {
    thunderstorm(seed, pal, time, weather) {
      const c = base(seed, pal, 'night', 'storm'), t = tints(c);
      c.d.add(A.starField(c.d, c.rng, W, H * 0.4, 20, c.P.light, 1.2));
      for (let i = 0; i < 7; i++) c.d.add(A.cloud(c, c.rng, c.rng.range(0, W), c.rng.range(H * 0.04, H * 0.26), c.rng.range(1.4, 2.4), c.P.shadow, 0.9));
      const hz = H * 0.68;
      c.d.add(A.layer(c.d, A.ridge(c.rng, -20, hz - 40, W + 20, hz - 90, 50, 5), hz, H, t.near, 1));
      c.d.add(treeLine(c, H * 0.94, 0, W, 6, t.fore, 120, 220));
      c.d.add(A.layer(c.d, A.ridge(c.rng, -20, hz + 120, W + 20, hz + 60, 30, 4), hz + 130, H, c.P.ink, 1));
      return finishScene(c, 'storm', { vig: 0.55 });
    },
    space(seed, pal, time, weather) {
      const c = A.sceneBase(seed, pal, 'night', weather, W, H);
      c.d.def(`<rect width="${W}" height="${H}" fill="${c.P.ink}"/>`); c.d.add(`<rect width="${W}" height="${H}" fill="${c.P.ink}"/>`);
      c.d.add(A.starField(c.d, c.rng, W, H, 160, c.P.light, 2.2));
      const px = c.rng.range(W * 0.3, W * 0.7), py = c.rng.range(H * 0.3, H * 0.45), pr = c.rng.range(90, 130);
      c.d.rgrad('pl', [[0, c.P.mid], [0.75, c.P.base], [1, c.P.shadow]], { cx: '38%', cy: '35%', r: '75%' });
      c.d.add(`<circle cx="${A.fmt(px)}" cy="${A.fmt(py)}" r="${A.fmt(pr)}" fill="url(#${c.d.p}pl)"/>`);
      c.d.add(`<ellipse cx="${A.fmt(px)}" cy="${A.fmt(py)}" rx="${A.fmt(pr * 1.9)}" ry="${A.fmt(pr * 0.4)}" fill="none" stroke="${c.P.accent}" stroke-width="7" opacity="0.85" transform="rotate(-18 ${A.fmt(px)} ${A.fmt(py)})"/>`);
      for (let i = 0; i < 4; i++) c.d.add(`<circle cx="${A.fmt(c.rng.range(0, W))}" cy="${A.fmt(c.rng.range(0, H))}" r="${A.fmt(c.rng.range(6, 22))}" fill="${c.rng.pick([c.P.mid, c.P.shadow])}" opacity="0.9"/>`);
      const sx = c.rng.range(W * 0.15, W * 0.85);
      c.d.add(`<path d="M ${A.fmt(sx - 14)} ${A.fmt(H * 0.8)} L ${A.fmt(sx)} ${A.fmt(H * 0.66)} L ${A.fmt(sx + 14)} ${A.fmt(H * 0.8)} Z" fill="${c.P.light}"/><circle cx="${A.fmt(sx)}" cy="${A.fmt(H * 0.69)}" r="5" fill="${c.P.ink}"/><path d="M ${A.fmt(sx - 8)} ${A.fmt(H * 0.8)} L ${A.fmt(sx)} ${A.fmt(H * 0.9)} L ${A.fmt(sx + 8)} ${A.fmt(H * 0.8)} Z" fill="${c.P.accent}" class="tw"/>`);
      A.weatherOverlay(c, weather || 'clear');
      return A.finish(c.d, W, H, { vig: 0.35 });
    },
    swamp(seed, pal, time, weather) {
      const c = base(seed, pal, weather === 'clear' ? 'dusk' : time, weather), t = tints(c);
      const hz = H * 0.66;
      c.d.add(`<rect y="${A.fmt(hz)}" width="${W}" height="${A.fmt(H - hz)}" fill="${A.mix(c.P.shadow, c.P.ink, 0.4)}"/>`);
      for (let i = 0; i < 8; i++) c.d.add(`<ellipse cx="${A.fmt(c.rng.range(0, W))}" cy="${A.fmt(c.rng.range(hz + 10, H))}" rx="${A.fmt(c.rng.range(30, 90))}" ry="${A.fmt(c.rng.range(4, 10))}" fill="${c.P.base}" opacity="0.5"/>`);
      const n = c.rng.int(7, 10);
      for (let i = 0; i < n; i++) {
        const x = c.rng.range(40, W - 40), hgt = c.rng.range(120, 260);
        c.d.add(`<path d="M ${A.fmt(x)} ${A.fmt(hz)} L ${A.fmt(x + c.rng.range(-8, 8))} ${A.fmt(hz - hgt)}" stroke="${c.P.ink}" stroke-width="${A.fmt(c.rng.range(6, 10))}" fill="none"/>`);
        for (let b = 0; b < 3; b++) c.d.add(`<path d="M ${A.fmt(x)} ${A.fmt(hz - hgt * c.rng.range(0.3, 0.9))} q ${A.fmt(c.rng.range(20, 50))} ${A.fmt(-c.rng.range(6, 20))} ${A.fmt(c.rng.range(34, 70))} ${A.fmt(c.rng.range(0, 12))}" stroke="${c.P.ink}" stroke-width="4" fill="none"/>`);
      }
      const lx = c.rng.range(W * 0.2, W * 0.8), ly = c.rng.range(H * 0.5, H * 0.6);
      c.d.add(`<circle cx="${A.fmt(lx)}" cy="${A.fmt(ly)}" r="7" fill="${c.P.accent}" class="tw"/><ellipse cx="${A.fmt(lx)}" cy="${A.fmt(hz + 24)}" rx="40" ry="8" fill="${c.P.accent}" opacity="0.25"/>`);
      c.d.add(birds(c, c.rng.int(2, 4), 80, W - 80, H * 0.1, H * 0.25, c.P.ink));
      return finishScene(c, weather, { vig: 0.55 });
    },
    sea_cliffs(seed, pal, time, weather) {
      const c = base(seed, pal, time, weather), t = tints(c);
      const hz = H * 0.6;
      for (let i = 0; i < 3; i++) c.d.add(`<path d="${A.wavePath(c.rng, hz + 20 + i * 70, 10 + i * 8, W, H, i * 1.7)} L ${W} ${H} L 0 ${H} Z" fill="${[t.far, t.mid, t.near][i]}"/>`);
      const cx = W * c.rng.range(0.55, 0.8);
      c.d.add(`<path d="M ${A.fmt(cx - 190)} ${A.fmt(hz + 10)} L ${A.fmt(cx - 120)} ${A.fmt(hz - 260)} L ${A.fmt(cx + 40)} ${A.fmt(hz - 300)} L ${A.fmt(cx + 120)} ${A.fmt(hz - 180)} L ${A.fmt(cx + 190)} ${A.fmt(hz + 10)} Z" fill="${t.mid}"/>`);
      c.d.add(`<path d="M ${A.fmt(cx + 40)} ${A.fmt(hz - 300)} L ${A.fmt(cx + 60)} ${A.fmt(hz - 230)} L ${A.fmt(cx + 110)} ${A.fmt(hz - 170)} L ${A.fmt(cx + 40)} ${A.fmt(hz - 300)} Z" fill="${c.P.light}" opacity="0.8"/>`);
      c.d.add(`<path d="M ${A.fmt(cx + 30)} ${A.fmt(hz + 4)} q 30 26 60 0 q -30 16 -60 0" fill="${c.P.light}" opacity="0.7"/>`);
      c.d.add(birds(c, c.rng.int(4, 7), 60, W * 0.5, H * 0.12, H * 0.3, c.P.ink));
      return finishScene(c, weather);
    },
    lighthouse(seed, pal, time, weather) {
      const c = base(seed, pal, time, weather), t = tints(c);
      const hz = H * 0.62;
      for (let i = 0; i < 3; i++) c.d.add(`<path d="${A.wavePath(c.rng, hz + 16 + i * 64, 9 + i * 7, W, H, i * 2.4)} L ${W} ${H} L 0 ${H} Z" fill="${[t.far, t.mid, t.near][i]}"/>`);
      c.d.add(A.layer(c.d, A.ridge(c.rng, -20, hz - 30, W * 0.45, hz - 10, 20, 4), hz, H, t.mid, 1));
      const lx = W * c.rng.range(0.62, 0.78), top = H * 0.24;
      c.d.add(A.castShadow(`M ${A.fmt(lx - 26)} ${A.fmt(hz)} L ${A.fmt(lx + 26)} ${A.fmt(hz)} L ${A.fmt(lx + 120)} ${A.fmt(hz + 22)} L ${A.fmt(lx - 60)} ${A.fmt(hz + 22)} Z`, 95, 22, c.P.ink, 0.5));
      c.d.add(`<path d="M ${A.fmt(lx - 26)} ${A.fmt(hz)} L ${A.fmt(lx - 14)} ${A.fmt(top)} L ${A.fmt(lx + 14)} ${A.fmt(top)} L ${A.fmt(lx + 26)} ${A.fmt(hz)} Z" fill="${c.P.light}"/>`);
      for (let i = 0; i < 3; i++) c.d.add(`<rect x="${A.fmt(lx - 22 + i * 2)}" y="${A.fmt(hz - 40 - i * 70)}" width="${A.fmt(44 - i * 4)}" height="12" fill="${c.P.accent}" opacity="0.9"/>`);
      c.d.add(`<rect x="${A.fmt(lx - 18)}" y="${A.fmt(top - 26)}" width="36" height="26" fill="${c.P.ink}"/><circle cx="${A.fmt(lx)}" cy="${A.fmt(top - 13)}" r="8" fill="${c.P.accent}" class="tw"/>`);
      const ang = c.rng.range(-0.5, 0.5);
      c.d.grad('beam', [[0, c.P.accent, 0.5], [1, c.P.accent, 0]], { x1: lx, y1: top - 13, x2: lx - 420, y2: top - 13 + 420 * Math.tan(ang), gradientUnits: 'userSpaceOnUse' });
      c.d.add(`<path d="M ${A.fmt(lx)} ${A.fmt(top - 13)} L ${A.fmt(lx - 430)} ${A.fmt(top - 13 + 430 * Math.tan(ang) - 70)} L ${A.fmt(lx - 430)} ${A.fmt(top - 13 + 430 * Math.tan(ang) + 70)} Z" fill="url(#${c.d.p}beam)" class="drift"/>`);
      return finishScene(c, weather);
    },
    canyon(seed, pal, time, weather) {
      const c = base(seed, pal, time, weather), t = tints(c);
      const hz = H * 0.7;
      c.d.add(`<rect y="${A.fmt(hz - 40)}" width="${W}" height="${A.fmt(H - hz + 40)}" fill="${c.P.base}"/>`);
      const lw = W * 0.34, lx = W * 0.12, rx = W * 0.54;
      c.d.add(`<path d="M 0 ${A.fmt(hz - 260)} L ${A.fmt(lx)} ${A.fmt(hz - 200)} L ${A.fmt(lx + lw * 0.3)} ${A.fmt(H)} L 0 ${H} Z" fill="${t.near}"/>`);
      c.d.add(`<path d="M ${A.fmt(rx)} ${A.fmt(hz - 160)} L ${A.fmt(W)} ${A.fmt(hz - 240)} L ${W} ${H} L ${A.fmt(rx + lw * 0.4)} ${A.fmt(H)} Z" fill="${t.mid}"/>`);
      for (let i = 0; i < 5; i++) {
        c.d.add(`<path d="M ${A.fmt(lx - 10)} ${A.fmt(hz - 200 + i * 90)} L ${A.fmt(lx + lw * 0.32)} ${A.fmt(hz - 180 + i * 95)}" stroke="${A.mix(c.P.mid, c.P.light, i / 5)}" stroke-width="${A.fmt(10 - i)}" opacity="0.7" fill="none"/>`);
        c.d.add(`<path d="M ${A.fmt(W - 12)} ${A.fmt(hz - 230 + i * 95)} L ${A.fmt(rx + lw * 0.42)} ${A.fmt(hz - 200 + i * 90)}" stroke="${A.mix(c.P.shadow, c.P.base, i / 5)}" stroke-width="${A.fmt(9 - i)}" opacity="0.8" fill="none"/>`);
      }
      c.d.add(`<path d="${A.catmull([[W * 0.5, hz - 20], [W * 0.47, hz + 120], [W * 0.53, hz + 260], [W * 0.5, H]])}" fill="none" stroke="${c.P.accent}" stroke-width="4" opacity="0.7"/>`);
      c.d.add(birds(c, 3, W * 0.3, W * 0.7, H * 0.15, H * 0.3, c.P.ink));
      return finishScene(c, weather, { vig: 0.5 });
    },
    northern_lights(seed, pal, time, weather) {
      const c = A.sceneBase(seed, pal, 'night', weather, W, H);
      c.d.add(A.starField(c.d, c.rng, W, H, 120, c.P.light, 1.8));
      for (let i = 0; i < 3; i++) {
        const y = c.rng.range(H * 0.1, H * 0.4), col = c.rng.pick([c.P.accent, c.P.light, c.P.mid]);
        c.d.grad('aur' + i, [[0, col, 0], [0.5, col, 0.4], [1, col, 0]], { x1: 0, y1: y, x2: 0, y2: y + H * 0.5, gradientUnits: 'userSpaceOnUse' });
        c.d.add(`<path d="${A.catmull([[0, y], [W * 0.25, y + c.rng.range(-40, 60)], [W * 0.5, y + c.rng.range(-60, 40)], [W * 0.75, y + c.rng.range(-30, 70)], [W, y + c.rng.range(-50, 50)]])} L ${W} ${A.fmt(y + H * 0.4)} ${A.catmull([[W, y + H * 0.34], [W * 0.75, y + H * 0.3], [W * 0.5, y + H * 0.42], [W * 0.25, y + H * 0.32], [0, y + H * 0.38]]).slice(1)} Z" fill="url(#${c.d.p}aur${i})" class="drift" style="animation-duration:${A.fmt(c.rng.range(8, 12))}s"/>`);
      }
      const hz = H * 0.78;
      c.d.add(A.layer(c.d, A.ridge(c.rng, -20, hz, W + 20, hz - c.rng.range(30, 80), 30, 5), hz, H, c.P.ink, 1));
      c.d.add(treeLine(c, H * 0.98, 0, W, 6, c.P.ink, 100, 180));
      return A.finish(c.d, W, H, { vig: 0.4 });
    },
    savanna_sunset(seed, pal, time, weather) {
      const c = base(seed, pal, 'golden', weather), t = tints(c);
      const hz = H * 0.68;
      c.d.add(`<rect y="${A.fmt(hz)}" width="${W}" height="${A.fmt(H - hz)}" fill="${c.P.base}"/>`);
      c.d.add(`<path d="${A.wavePath(c.rng, hz + 60, 8, W, H, 3)} L ${W} ${H} L 0 ${H} Z" fill="${A.mix(c.P.base, c.P.mid, 0.5)}"/>`);
      for (let i = 0; i < 4; i++) c.d.add(`<path d="M ${A.fmt(c.rng.range(0, W))} ${A.fmt(hz + 20 + i * 30)} q ${A.fmt(c.rng.range(30, 70))} ${A.fmt(-c.rng.range(4, 10))} ${A.fmt(c.rng.range(70, 140))} 0" stroke="${A.mix(c.P.shadow, c.P.ink, i / 4)}" stroke-width="${A.fmt(3 + i)}" fill="none" opacity="0.8"/>`);
      const tx = c.rng.range(W * 0.25, W * 0.75);
      c.d.add(A.castShadow(`M ${A.fmt(tx - 40)} ${A.fmt(hz + 40)} L ${A.fmt(tx + 40)} ${A.fmt(hz + 40)} L ${A.fmt(tx + 110)} ${A.fmt(hz + 52)} L ${A.fmt(tx - 90)} ${A.fmt(hz + 52)} Z`, 70, 12, c.P.ink, 0.55));
      c.d.add(`<rect x="${A.fmt(tx - 3)}" y="${A.fmt(hz - 70)}" width="6" height="${A.fmt(110)}" fill="${c.P.ink}"/><ellipse cx="${A.fmt(tx)}" cy="${A.fmt(hz - 78)}" rx="${A.fmt(c.rng.range(60, 90))}" ry="16" fill="${c.P.ink}"/><path d="M ${A.fmt(tx - 55)} ${A.fmt(hz - 84)} q 55 -22 110 0" stroke="${c.P.ink}" stroke-width="5" fill="none"/>`);
      c.d.add(birds(c, c.rng.int(3, 6), 80, W - 80, H * 0.1, H * 0.25, c.P.ink));
      return finishScene(c, weather, { vig: 0.45 });
    },
    cherry_blossom_hill(seed, pal, time, weather) {
      const c = base(seed, pal, time, weather), t = tints(c);
      const hz = H * 0.6;
      c.d.add(A.layer(c.d, A.ridge(c.rng, -20, hz - 40, W + 20, hz - 90, 40, 5), hz, H, A.mix(c.P.mid, c.P.light, 0.4), 1));
      const tx = c.rng.range(W * 0.35, W * 0.65);
      c.d.add(`<path d="M ${A.fmt(tx - 6)} ${A.fmt(hz)} L ${A.fmt(tx - 3)} ${A.fmt(hz - 150)} M ${A.fmt(tx - 3)} ${A.fmt(hz - 120)} q -50 -30 -90 -10 M ${A.fmt(tx - 3)} ${A.fmt(hz - 90)} q 50 -34 95 -16" stroke="${c.P.ink}" stroke-width="9" fill="none" stroke-linecap="round"/>`);
      for (let i = 0; i < 40; i++) {
        const a = c.rng.range(0, Math.PI * 2), r = c.rng.range(20, 130);
        c.d.add(`<circle cx="${A.fmt(tx + Math.cos(a) * r)}" cy="${A.fmt(hz - 130 + Math.sin(a) * r * 0.6)}" r="${A.fmt(c.rng.range(4, 11))}" fill="${c.rng.pick([c.P.light, c.P.accent, '#ffffff'])}" opacity="${A.fmt(c.rng.range(0.7, 1))}"/>`);
      }
      const n = c.rng.int(40, 70);
      for (let i = 0; i < n; i++) c.d.add(`<circle cx="${A.fmt(c.rng.range(0, W))}" cy="${A.fmt(c.rng.range(hz, H))}" r="${A.fmt(c.rng.range(2, 5))}" fill="${c.rng.pick([c.P.light, c.P.accent])}" opacity="${A.fmt(c.rng.range(0.5, 0.9))}" class="snow" style="animation-delay:${A.fmt(c.rng.range(0, 5))}s;animation-duration:${A.fmt(c.rng.range(6, 11))}s"/>`);
      c.d.add(treeLine(c, H * 0.97, 0, W, 4, t.near, 120, 200));
      return finishScene(c, weather);
    },
    neon_highway(seed, pal, time, weather) {
      const c = A.sceneBase(seed, pal, 'night', weather || 'rain', W, H);
      const hz = H * 0.55, vp = W / 2;
      c.d.add(A.starField(c.d, c.rng, W, hz, 30, c.P.light, 1.2));
      c.d.add(`<path d="M 0 ${H} L ${A.fmt(vp - 60)} ${A.fmt(hz)} L ${A.fmt(vp + 60)} ${A.fmt(hz)} L ${W} ${H} Z" fill="${c.P.shadow}"/>`);
      c.d.add(`<path d="M ${A.fmt(vp)} ${H} L ${A.fmt(vp)} ${A.fmt(hz)}" stroke="${c.P.accent}" stroke-width="5" stroke-dasharray="26 30" opacity="0.9"/>`);
      for (let i = 0; i < 2; i++) {
        const off = i === 0 ? -1 : 1;
        for (let s = 0; s < 7; s++) {
          const t = s / 7, x = vp + off * (60 + (W / 2 - 60) * t), y = hz + (H - hz) * t * t;
          c.d.add(`<rect x="${A.fmt(x - 3 * t - 3)}" y="${A.fmt(y)}" width="${A.fmt(6 + 8 * t)}" height="${A.fmt(4 + 5 * t)}" fill="${c.P.light}" opacity="${A.fmt(0.9 - t * 0.6)}"/>`);
        }
      }
      for (let i = 0; i < 6; i++) {
        const bx = c.rng.range(30, W - 30), bh = c.rng.range(120, 300);
        c.d.add(`<rect x="${A.fmt(bx - 24)}" y="${A.fmt(hz - bh)}" width="48" height="${A.fmt(bh)}" fill="${c.P.ink}"/>`);
        c.d.add(`<rect x="${A.fmt(bx - 24)}" y="${A.fmt(hz - bh)}" width="48" height="${A.fmt(bh)}" fill="none" stroke="${c.rng.pick([c.P.accent, c.P.light])}" stroke-width="3" opacity="0.9" class="tw" style="animation-delay:${A.fmt(c.rng.range(0, 5))}s"/>`);
      }
      A.weatherOverlay(c, weather || 'rain');
      return A.finish(c.d, W, H, { vig: 0.5 });
    },
    ruined_castle(seed, pal, time, weather) {
      const c = base(seed, pal, weather === 'clear' ? 'dusk' : time, weather), t = tints(c);
      const hz = H * 0.72;
      c.d.add(A.layer(c.d, A.ridge(c.rng, -20, hz - 60, W + 20, hz - 20, 30, 5), hz, H, t.far, 1));
      const cx = W * 0.5, bw = W * 0.3, bh = c.rng.range(220, 320);
      c.d.add(`<rect x="${A.fmt(cx - bw / 2)}" y="${A.fmt(hz - bh)}" width="${A.fmt(bw)}" height="${A.fmt(bh)}" fill="${t.mid}"/>`);
      c.d.add(`<path d="M ${A.fmt(cx - bw / 2)} ${A.fmt(hz - bh)} L ${A.fmt(cx - bw / 2)} ${A.fmt(hz - bh - 60)} L ${A.fmt(cx - bw / 2 + 40)} ${A.fmt(hz - bh - 20)} L ${A.fmt(cx - bw / 2 + 70)} ${A.fmt(hz - bh - 70)} L ${A.fmt(cx - bw / 2 + 110)} ${A.fmt(hz - bh - 30)} L ${A.fmt(cx - bw / 2 + 110)} ${A.fmt(hz - bh)} Z" fill="${t.mid}"/>`);
      c.d.add(`<rect x="${A.fmt(cx + bw / 2 - 70)}" y="${A.fmt(hz - bh - 130)}" width="70" height="${A.fmt(bh + 130)}" fill="${t.near}"/>`);
      c.d.add(`<path d="M ${A.fmt(cx + bw / 2 - 70)} ${A.fmt(hz - bh - 130)} L ${A.fmt(cx + bw / 2 - 35)} ${A.fmt(hz - bh - 175)} L ${A.fmt(cx + bw / 2)} ${A.fmt(hz - bh - 130)} Z" fill="${t.near}"/>`);
      for (let i = 0; i < 5; i++) {
        const wx = c.rng.range(cx - bw / 2 + 20, cx + bw / 2 - 30), wy = c.rng.range(hz - bh + 30, hz - 60);
        c.d.add(`<path d="M ${A.fmt(wx)} ${A.fmt(wy)} L ${A.fmt(wx)} ${A.fmt(wy - 34)} L ${A.fmt(wx + 18)} ${A.fmt(wy - 34)} L ${A.fmt(wx + 18)} ${A.fmt(wy)} Z" fill="${c.P.ink}"/>`);
        if (c.rng.chance(0.6)) c.d.add(`<rect x="${A.fmt(wx + 5)}" y="${A.fmt(wy - 26)}" width="8" height="12" fill="${c.P.accent}" opacity="0.9" class="tw"/>`);
      }
      c.d.add(`<rect y="${A.fmt(hz)}" width="${W}" height="${A.fmt(H - hz)}" fill="${c.P.shadow}"/>`);
      c.d.add(A.layer(c.d, A.ridge(c.rng, -20, hz + 60, W + 20, hz + 20, 24, 4), hz + 70, H, c.P.ink, 1));
      return finishScene(c, weather, { vig: 0.55 });
    }
  };

  window.ART.scenes = Object.assign(window.ART.scenes || {}, scenes);
})();
