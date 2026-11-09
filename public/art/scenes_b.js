/* Unravelled — scenes part B (11 of 24), demo-style. */
(function () {
  const A = window.ART, F = A.F;
  const reg = (id, fn) => { window.ART.scenes[id] = (seed, pal, time, weather) => A.scene(seed + ':' + id, pal, time, weather, fn); };

  reg('thunderstorm', (r, p, d) => {
    let s = '';
    for (let i = 0; i < 6; i++) s += `<ellipse cx="${F(r.f() * 800)}" cy="${F(60 + r.f() * 120)}" rx="${F(200 + r.f() * 160)}" ry="${F(36 + r.f() * 26)}" fill="${p.sil}" opacity="0.75"/>`;
    s += `<path d="M${F(300 + r.f() * 200)} 90 L ${F(350 + r.f() * 180)} ${F(240)} L ${F(320)} 240 L ${F(390 + r.f() * 180)} ${F(360)}" stroke="${p.accent}" stroke-width="6" fill="none" opacity="0.95"/>`;
    s += A.hills(d, r, p, [{ y: 400, amp: 50, op: 0.7 }, { y: 450, amp: 26, op: 1 }]);
    for (let i = 0; i < 6; i++) s += A.pine(60 + i * 140 + r.f() * 40, 460, 90, 150 + r.f() * 40, p.sil, 1);
    return s;
  });

  reg('space', (r, p, d) => {
    const px = 520 + r.f() * 80, py = 200 + r.f() * 60, pr = 70 + r.f() * 30;
    let s = A.stars(d, r, p, 460, 110);
    s += `<line x1="${F(120 + r.f() * 200)}" y1="${F(50 + r.f() * 60)}" x2="${F(220 + r.f() * 220)}" y2="${F(110 + r.f() * 60)}" stroke="#e9e4d4" stroke-width="1.4" opacity="0.5"/>`;
    d.def(`<clipPath id="${d.p}pc"><circle cx="${F(px)}" cy="${F(py)}" r="${F(pr)}"/></clipPath>`);
    s += `<circle cx="${F(px)}" cy="${F(py)}" r="${F(pr)}" fill="${p.stops[1]}"/>
      <circle cx="${F(px - pr * 0.25)}" cy="${F(py - pr * 0.25)}" r="${F(pr)}" fill="${p.horizon}" opacity="0.3" clip-path="url(#${d.p}pc)"/>
      <ellipse cx="${F(px)}" cy="${F(py)}" rx="${F(pr * 1.7)}" ry="${F(pr * 0.4)}" fill="none" stroke="${p.accent}" stroke-width="3" opacity="0.5" transform="rotate(-14 ${F(px)} ${F(py)})"/>`;
    const ax = 180 + r.f() * 100, ay = 300 + r.f() * 60;
    s += `<g stroke="${p.sil}" stroke-width="4" fill="${p.sil}" opacity="0.9"><circle cx="${F(ax)}" cy="${F(ay)}" r="11" fill="none"/>
      <line x1="${F(ax)}" y1="${F(ay + 11)}" x2="${F(ax)}" y2="${F(ay + 38)}"/><line x1="${F(ax - 14)}" y1="${F(ay + 22)}" x2="${F(ax + 14)}" y2="${F(ay + 22)}"/>
      <line x1="${F(ax)}" y1="${F(ay + 38)}" x2="${F(ax - 10)}" y2="${F(ay + 58)}"/><line x1="${F(ax)}" y1="${F(ay + 38)}" x2="${F(ax + 12)}" y2="${F(ay + 56)}"/></g>
      <line x1="${F(ax - 60)}" y1="${F(ay + 80)}" x2="${F(ax - 20)}" y2="${F(ay + 66)}" stroke="${p.accent}" stroke-width="2" opacity="0.5"/>`;
    return s;
  });

  reg('swamp', (r, p, d) => {
    let s = `<rect x="0" y="360" width="800" height="140" fill="${p.stops[0]}" opacity="0.6"/>`;
    for (let i = 0; i < 10; i++) s += `<ellipse cx="${F(r.f() * 800)}" cy="${F(380 + r.f() * 100)}" rx="${F(40 + r.f() * 60)}" ry="${F(5 + r.f() * 6)}" fill="${p.horizon}" opacity="0.25"/>`;
    for (let i = 0; i < 8; i++) {
      const x = 60 + i * 95 + r.f() * 30, h = 130 + r.f() * 120;
      s += `<path d="M${F(x)} 380 L ${F(x + r.f() * 8 - 4)} ${F(380 - h)}" stroke="${p.sil}" stroke-width="${F(7 + r.f() * 5)}" fill="none"/>`;
      s += `<path d="M${F(x)} ${F(380 - h * 0.7)} q ${F(30 + r.f() * 30)} ${F(-10 - r.f() * 14)} ${F(55 + r.f() * 30)} 0" stroke="${p.sil}" stroke-width="4" fill="none"/>`;
    }
    const lx = 300 + r.f() * 200, ly = 250 + r.f() * 60;
    s += `<circle cx="${F(lx)}" cy="${F(ly)}" r="7" fill="${p.accent}"/><circle cx="${F(lx)}" cy="${F(ly)}" r="40" fill="url(#${d.p}glow)" opacity="0.6"/>`;
    return s + A.hills(d, r, p, [{ y: 430, amp: 20, op: 1 }]);
  });

  reg('sea_cliffs', (r, p, d) => {
    let s = `<rect x="0" y="330" width="800" height="170" fill="url(#${d.p}sea)"/>`;
    for (let i = 0; i < 3; i++) s += `<path d="M0 ${F(360 + i * 40)} q 100 -10 200 0 t 200 0 t 200 0 t 200 0" stroke="${p.accent}" stroke-width="1.5" fill="none" opacity="0.18"/>`;
    const cx = 480 + r.f() * 100;
    s += `<path d="M${F(cx - 160)} 340 L ${F(cx - 110)} 120 L ${F(cx + 20)} 90 L ${F(cx + 110)} 200 L ${F(cx + 170)} 340 Z" fill="${p.sil}"/>
      <path d="M${F(cx + 20)} 90 L ${F(cx + 40)} 160 L ${F(cx + 100)} 195 L ${F(cx + 20)} 90 Z" fill="${p.horizon}" opacity="0.6"/>
      <path d="M${F(cx + 30)} 336 q 26 20 52 0" stroke="${p.light}" stroke-width="3" fill="none" opacity="0.6"/>`;
    s += A.hills(d, r, p, [{ y: 420, amp: 24, op: 1 }]);
    return s;
  });

  reg('lighthouse', (r, p, d) => {
    let s = `<rect x="0" y="400" width="800" height="100" fill="url(#${d.p}sea)"/>`;
    s += `<path d="M520 430 Q 600 380 800 410 L 800 500 L 470 500 Q 500 460 520 430 Z" fill="${p.sil}"/>`;
    const lx = 640, ly = 170;
    s += `<g><path d="M${lx - 18} ${ly + 200} L ${lx + 18} ${ly + 200} L ${lx + 12} ${ly} L ${lx - 12} ${ly} Z" fill="${p.sil}"/>
      <rect x="${lx - 12}" y="${ly + 60}" width="24" height="12" fill="${p.accent}" opacity="0.7"/>
      <rect x="${lx - 11}" y="${ly + 120}" width="22" height="12" fill="${p.accent}" opacity="0.7"/>
      <circle cx="${lx}" cy="${ly - 10}" r="10" fill="${p.accent}"/><circle cx="${lx}" cy="${ly - 10}" r="40" fill="url(#${d.p}glow)"/>
      <path d="M${lx - 8} ${ly - 10} L 60 90 L 60 260 Z" fill="${p.accent}" opacity="0.12"/></g>`;
    return s;
  });

  reg('canyon', (r, p, d) => {
    let s = `<path d="M400 200 Q 380 330 410 500 L 370 500 Q 350 330 400 200 Z" fill="${p.horizon}" opacity="0.25"/>
      <path d="M400 220 Q 386 340 404 470" stroke="${p.accent}" stroke-width="2" fill="none" opacity="0.35"/>
      <path d="M0 0 L 260 0 Q 200 120 250 250 Q 300 380 190 500 L 0 500 Z" fill="${p.sil}" opacity="0.85"/>
      <path d="M0 0 L 170 0 Q 130 140 170 300 Q 200 420 120 500 L 0 500 Z" fill="${p.sil}"/>
      <path d="M800 0 L 540 0 Q 600 130 550 260 Q 500 390 620 500 L 800 500 Z" fill="${p.sil}" opacity="0.85"/>
      <path d="M800 0 L 640 0 Q 670 150 630 310 Q 600 430 690 500 L 800 500 Z" fill="${p.sil}"/>`;
    return s;
  });

  reg('northern_lights', (r, p, d) => {
    let s = A.stars(d, r, p, 460, 90);
    for (let i = 0; i < 3; i++) s += `<path d="M${F(-50 + i * 90)} ${F(140 + i * 30)} Q 250 ${F(40 + i * 40)} 480 ${F(120 + i * 20)} T 860 ${F(80 + i * 30)}" stroke="${p.accent}" stroke-width="${F(14 - i * 3)}" fill="none" opacity="0.12" filter="url(#${d.p}soft)"/>`;
    s += A.hills(d, r, p, [{ y: 410, amp: 40, op: 0.7 }, { y: 455, amp: 26, op: 1 }]);
    for (let i = 0; i < 12; i++) s += `<ellipse cx="${F(r.f() * 800)}" cy="${F(400 + r.f() * 80)}" rx="${F(8 + r.f() * 18)}" ry="${F(4 + r.f() * 6)}" fill="${p.sil}" opacity="0.7"/>`;
    return s;
  });

  reg('savanna_sunset', (r, p, d) => {
    let s = A.sun(d, p, 400, 310, 46);
    s += `<path d="M0 360 Q 400 330 800 360 L 800 500 L 0 500 Z" fill="${p.sil}" opacity="0.8"/>`;
    const tx = 300 + r.f() * 200;
    s += `<g fill="${p.sil}"><rect x="${F(tx - 3)}" y="300" width="6" height="70"/><ellipse cx="${F(tx)}" cy="292" rx="${F(60 + r.f() * 20)}" ry="13"/><path d="M${F(tx - 55)} 286 q 55 -20 110 0" stroke="${p.sil}" stroke-width="5" fill="none"/></g>`;
    for (let i = 0; i < 4; i++) s += `<path d="M${F(80 + i * 200 + r.f() * 60)} 400 q ${F(20 + r.f() * 20)} -12 ${F(50 + r.f() * 30)} 0" stroke="${p.sil}" stroke-width="3" fill="none" opacity="0.7"/>`;
    return s + A.hills(d, r, p, [{ y: 440, amp: 18, op: 1 }]);
  });

  reg('cherry_blossom_hill', (r, p, d) => {
    let s = A.hills(d, r, p, [{ y: 380, amp: 60, op: 0.6 }, { y: 440, amp: 30, op: 1 }]);
    const tx = 380 + r.f() * 120;
    s += `<path d="M${F(tx - 5)} 400 L ${F(tx)} 280 M ${F(tx)} 320 q -50 -26 -88 -8 M ${F(tx)} 300 q 48 -30 92 -14" stroke="${p.sil}" stroke-width="9" fill="none" stroke-linecap="round"/>`;
    for (let i = 0; i < 46; i++) {
      const a = r.f() * Math.PI * 2, rr = 20 + r.f() * 120;
      s += `<circle cx="${F(tx + Math.cos(a) * rr)}" cy="${F(270 + Math.sin(a) * rr * 0.55)}" r="${F(4 + r.f() * 8)}" fill="${r.pick([p.light, p.accent, '#ffffff'])}" opacity="${F(0.7 + r.f() * 0.3)}"/>`;
    }
    for (let i = 0; i < 26; i++) s += `<circle cx="${F(r.f() * 800)}" cy="${F(390 + r.f() * 100)}" r="${F(2 + r.f() * 3)}" fill="${r.pick([p.light, p.accent])}" opacity="0.6"/>`;
    return s;
  });

  reg('neon_highway', (r, p, d) => {
    let s = A.stars(d, r, p, 220, 40);
    s += `<path d="M0 500 L 340 260 L 460 260 L 800 500 Z" fill="${p.stops[0]}"/>
      <path d="M400 500 L 400 260" stroke="${p.accent}" stroke-width="4" stroke-dasharray="24 26" opacity="0.8"/>`;
    for (let i = 0; i < 6; i++) {
      const t = (i + 1) / 7, x = 400 + (i % 2 ? 1 : -1) * (60 + 300 * t), y = 260 + 240 * t * t;
      s += `<rect x="${F(x - 4 * t - 3)}" y="${F(y)}" width="${F(8 + 8 * t)}" height="${F(4 + 5 * t)}" fill="${p.accent}" opacity="${F(0.9 - t * 0.5)}"/>`;
    }
    for (let i = 0; i < 5; i++) {
      const bx = 30 + i * 160 + r.f() * 40, bh = 100 + r.f() * 140;
      s += `<rect x="${F(bx)}" y="${F(260 - bh)}" width="46" height="${F(bh)}" fill="${p.sil}"/>
      <rect x="${F(bx)}" y="${F(260 - bh)}" width="46" height="${F(bh)}" fill="none" stroke="${r.pick([p.accent, p.light])}" stroke-width="3" opacity="0.8"/>`;
    }
    return s + `<rect x="0" y="470" width="800" height="30" fill="${p.sil}"/>`;
  });

  reg('ruined_castle', (r, p, d) => {
    let s = A.hills(d, r, p, [{ y: 400, amp: 40, op: 0.5 }]);
    const cx = 400, bw = 260, bh = 240;
    s += `<rect x="${F(cx - bw / 2)}" y="${F(420 - bh)}" width="${F(bw)}" height="${F(bh)}" fill="${p.sil}"/>
      <path d="M${F(cx - bw / 2)} ${F(420 - bh)} L ${F(cx - bw / 2)} ${F(420 - bh - 56)} L ${F(cx - bw / 2 + 42)} ${F(420 - bh - 20)} L ${F(cx - bw / 2 + 74)} ${F(420 - bh - 66)} L ${F(cx - bw / 2 + 112)} ${F(420 - bh - 26)} L ${F(cx - bw / 2 + 112)} ${F(420 - bh)} Z" fill="${p.sil}"/>
      <rect x="${F(cx + bw / 2 - 70)}" y="${F(420 - bh - 120)}" width="70" height="${F(bh + 120)}" fill="${p.sil}"/>
      <path d="M${F(cx + bw / 2 - 70)} ${F(420 - bh - 120)} L ${F(cx + bw / 2 - 35)} ${F(420 - bh - 162)} L ${F(cx + bw / 2)} ${F(420 - bh - 120)} Z" fill="${p.sil}"/>`;
    for (let i = 0; i < 5; i++) {
      const wx = cx - bw / 2 + 24 + r.f() * (bw - 60), wy = 420 - bh + 30 + r.f() * (bh - 70);
      s += `<path d="M${F(wx)} ${F(wy)} L ${F(wx)} ${F(wy - 30)} L ${F(wx + 16)} ${F(wy - 30)} L ${F(wx + 16)} ${F(wy)} Z" fill="${p.stops[0]}"/>`;
      if (r.f() > 0.4) s += `<rect x="${F(wx + 5)}" y="${F(wy - 22)}" width="7" height="11" fill="${p.accent}" opacity="0.85"/>`;
    }
    return s + A.hills(d, r, p, [{ y: 460, amp: 20, op: 1 }]);
  });
})();
