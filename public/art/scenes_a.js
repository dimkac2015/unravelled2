/* Unravelled — scenes part A (13 of 24), demo-style gradient + silhouettes. */
(function () {
  const A = window.ART, F = A.F;
  const reg = (id, fn) => { window.ART.scenes[id] = (seed, pal, time, weather) => A.scene(seed + ':' + id, pal, time, weather, fn); };
  window.ART.scenes = window.ART.scenes || {};

  reg('ocean_ship', (r, p, d) => {
    const bx = 200 + r.f() * 160, by = 350 + r.f() * 20;
    let s = `<rect x="0" y="340" width="800" height="160" fill="url(#${d.p}sea)"/>
      <ellipse cx="400" cy="345" rx="420" ry="18" fill="${p.accent}" opacity="0.08" filter="url(#${d.p}soft)"/>`;
    for (let i = 0; i < 3; i++) s += `<path d="M0 ${F(380 + i * 34)} q 60 -12 120 0 t 120 0 t 120 0 t 120 0 t 120 0 t 120 0" stroke="${p.accent}" stroke-width="1.5" fill="none" opacity="0.15"/>`;
    s += `<g><path d="M${F(bx - 70)} ${F(by)} L ${F(bx + 70)} ${F(by)} L ${F(bx + 46)} ${F(by + 22)} L ${F(bx - 46)} ${F(by + 22)} Z" fill="${p.sil}"/>
      <line x1="${F(bx)}" y1="${F(by - 95)}" x2="${F(bx)}" y2="${F(by)}" stroke="${p.sil}" stroke-width="4"/>
      <path d="M${F(bx + 3)} ${F(by - 90)} L ${F(bx + 62)} ${F(by - 18)} L ${F(bx + 3)} ${F(by - 18)} Z" fill="${p.sil}" opacity="0.9"/>
      <path d="M${F(bx - 3)} ${F(by - 84)} L ${F(bx - 46)} ${F(by - 20)} L ${F(bx - 3)} ${F(by - 20)} Z" fill="${p.sil}" opacity="0.75"/>
      <circle cx="${F(bx)}" cy="${F(by - 100)}" r="4" fill="${p.accent}"/></g>`;
    return s;
  });

  reg('river', (r, p, d) => {
    let s = `<rect x="0" y="330" width="800" height="170" fill="url(#${d.p}sea)"/>`;
    for (let i = 0; i < 4; i++) s += `<path d="M0 ${F(350 + i * 36)} q 100 ${F(-8 - i * 3)} 200 0 t 200 0 t 200 0 t 200 0" stroke="${p.accent}" stroke-width="1.4" fill="none" opacity="0.18"/>`;
    s += A.hills(d, r, p, [{ y: 330, amp: 60, op: 0.5 }, { y: 370, amp: 40, op: 0.8 }, { y: 430, amp: 26, op: 1 }]);
    for (let i = 0; i < 8; i++) s += A.pine(40 + i * 100 + r.f() * 30, 372 + r.f() * 8, 90, 150 + r.f() * 40, p.sil, 0.85);
    return s;
  });

  reg('forest', (r, p, d) => {
    let s = `<rect x="0" y="380" width="800" height="120" fill="${p.sil}"/>`;
    for (let i = 0; i < 9; i++) s += A.pine(40 + i * 95 + r.f() * 30, 360, 90, 170 + r.f() * 40, p.sil, 0.5);
    s += `<ellipse cx="400" cy="380" rx="420" ry="36" fill="${p.accent}" opacity="0.1" filter="url(#${d.p}soft)"/>`;
    for (let i = 0; i < 7; i++) s += A.pine(10 + i * 120 + r.f() * 40, 410, 120, 210 + r.f() * 50, p.sil, 0.8);
    for (let i = 0; i < 5; i++) s += A.pine(30 + i * 170 + r.f() * 50, 500, 150, 260 + r.f() * 60, p.sil, 1);
    return s;
  });

  reg('autumn_woods', (r, p, d) => {
    let s = A.hills(d, r, p, [{ y: 350, amp: 50, op: 0.55 }, { y: 420, amp: 30, op: 1 }]);
    for (let i = 0; i < 8; i++) {
      const x = 50 + i * 100 + r.f() * 30;
      s += `<rect x="${F(x)}" y="${F(300 + r.f() * 30)}" width="7" height="120" fill="${p.sil}" opacity="0.9"/>`;
      s += `<circle cx="${F(x + 3)}" cy="${F(280 + r.f() * 30)}" r="${F(34 + r.f() * 22)}" fill="${r.pick([p.accent, p.horizon, p.light])}" opacity="0.75"/>`;
    }
    for (let i = 0; i < 30; i++) s += `<circle cx="${F(r.f() * 800)}" cy="${F(360 + r.f() * 130)}" r="${F(2 + r.f() * 3)}" fill="${r.pick([p.accent, p.light])}" opacity="0.5"/>`;
    return s;
  });

  reg('birch_forest', (r, p, d) => {
    let s = A.hills(d, r, p, [{ y: 340, amp: 40, op: 0.4 }, { y: 400, amp: 26, op: 0.8 }, { y: 460, amp: 20, op: 1 }]);
    for (let i = 0; i < 11; i++) {
      const x = 30 + i * 70 + r.f() * 24, h = 200 + r.f() * 160;
      s += `<rect x="${F(x)}" y="${F(470 - h)}" width="${F(8 + r.f() * 4)}" height="${F(h + 30)}" fill="${p.light}" opacity="0.85"/>`;
      s += `<rect x="${F(x)}" y="${F(470 - h)}" width="${F(8 + r.f() * 4)}" height="${F(h)}" fill="none" stroke="${p.sil}" stroke-width="2.4" stroke-dasharray="${F(6 + r.f() * 10)} ${F(5 + r.f() * 8)}" opacity="0.8"/>`;
    }
    return s;
  });

  reg('desert', (r, p, d) => {
    let s = A.sun(d, p, 400, 300, 36);
    s += `<path d="M0 340 Q 200 290 420 340 T 800 330 L 800 500 L 0 500 Z" fill="${p.sil}" opacity="0.55"/>`;
    const cx = 180 + r.f() * 80;
    s += `<g fill="${p.sil}"><rect x="${F(cx)}" y="330" width="14" height="80" rx="7"/><rect x="${F(cx - 22)}" y="352" width="10" height="30" rx="5"/><rect x="${F(cx - 22)}" y="352" width="30" height="10" rx="5"/><rect x="${F(cx + 26)}" y="364" width="10" height="26" rx="5"/><rect x="${F(cx + 6)}" y="364" width="30" height="10" rx="5"/></g>`;
    s += `<path d="M0 390 Q 260 340 520 395 T 800 385 L 800 500 L 0 500 Z" fill="${p.sil}"/><ellipse cx="${F(560 + r.f() * 100)}" cy="445" rx="70" ry="24" fill="${p.sil}" opacity="0.85"/>`;
    return s;
  });

  reg('mountains', (r, p, d) => {
    let s = `<path d="M60 360 L 260 ${F(150 + r.f() * 30)} L 460 360 Z" fill="${p.sil}" opacity="0.8"/>
      <path d="M230 360 L 260 ${F(150 + r.f() * 30)} L 290 360 Z" fill="${p.horizon}" opacity="0.6"/>
      <path d="M340 360 L 540 210 L 740 360 Z" fill="${p.sil}" opacity="0.6"/>
      <rect x="0" y="360" width="800" height="140" fill="url(#${d.p}sea)"/>
      <path d="M260 380 L 240 490 L 280 490 Z" fill="${p.sil}" opacity="0.3"/>
      <line x1="140" y1="400" x2="240" y2="400" stroke="${p.accent}" stroke-width="1.4" opacity="0.25"/>
      <line x1="420" y1="430" x2="560" y2="430" stroke="${p.accent}" stroke-width="1.4" opacity="0.2"/>`;
    s += A.hills(d, r, p, [{ y: 470, amp: 18, op: 1 }]);
    return s;
  });

  reg('volcano', (r, p, d) => {
    const vx = 400 + r.f() * 60;
    let s = A.hills(d, r, p, [{ y: 380, amp: 50, op: 0.5 }]);
    s += `<path d="M${F(vx - 300)} 400 L ${F(vx - 80)} 170 L ${F(vx + 80)} 170 L ${F(vx + 300)} 400 Z" fill="${p.sil}"/>
      <path d="M${F(vx - 80)} 170 L ${F(vx)} 120 L ${F(vx + 80)} 170 Z" fill="${p.accent}"/>
      <path d="M${F(vx)} 130 Q ${F(vx + 30)} 60 ${F(vx - 10)} ${F(-30)}" stroke="${p.sil}" stroke-width="20" fill="none" opacity="0.7" stroke-linecap="round"/>
      <path d="M${F(vx)} 130 Q ${F(vx + 18)} 70 ${F(vx + 6)} 10" stroke="${p.accent}" stroke-width="8" fill="none" opacity="0.9" stroke-linecap="round"/>`;
    for (let i = 0; i < 14; i++) s += `<circle cx="${F(vx + (r.f() - 0.5) * 500)}" cy="${F(410 + r.f() * 80)}" r="${F(3 + r.f() * 6)}" fill="${p.accent}" opacity="${F(0.4 + r.f() * 0.5)}"/>`;
    s += A.hills(d, r, p, [{ y: 430, amp: 24, op: 1 }]);
    return s;
  });

  reg('night_city', (r, p, d) => {
    let s = `<path d="M-20 130 Q 400 200 820 120" stroke="${p.sil}" stroke-width="2" fill="none" opacity="0.7"/>`;
    for (let i = 0; i < 8; i++) {
      const x = i * 105 - 10, w = 70 + r.f() * 40, h = 120 + r.f() * 90;
      s += `<rect x="${F(x)}" y="${F(400 - h)}" width="${F(w)}" height="${F(h)}" fill="${p.sil}" opacity="0.6"/>`;
      for (let j = 0; j < 6; j++) if (r.f() > 0.6) s += `<rect x="${F(x + 6 + (j % 3) * 16)}" y="${F(408 - h + ((j / 3) | 0) * 20)}" width="7" height="10" fill="${p.accent}" opacity="0.55"/>`;
    }
    for (let i = 0; i < 5; i++) {
      const x = i * 170 + 20, w = 110 + r.f() * 50, h = 190 + r.f() * 110;
      s += `<rect x="${F(x)}" y="${F(500 - h)}" width="${F(w)}" height="${F(h)}" fill="${p.sil}"/>`;
      for (let j = 0; j < 8; j++) if (r.f() > 0.66) s += `<rect x="${F(x + 8 + (j % 4) * 20)}" y="${F(510 - h + ((j / 4) | 0) * 24)}" width="8" height="12" fill="${p.accent}" opacity="0.6"/>`;
    }
    return s + `<rect x="0" y="440" width="800" height="60" fill="${p.sil}"/>`;
  });

  reg('rainy_street', (r, p, d) => {
    let s = `<rect x="14" y="14" width="772" height="472" rx="10" fill="none" stroke="${p.sil}" stroke-width="14"/>`;
    for (let i = 0; i < 20; i++) s += `<circle cx="${F(r.f() * 800)}" cy="${F(r.f() * 460)}" r="${F(6 + r.f() * 22)}" fill="${r.pick([p.accent, p.light, p.horizon])}" opacity="${F(0.08 + r.f() * 0.18)}" filter="url(#${d.p}soft)"/>`;
    const lx = 120 + r.f() * 80;
    s += `<rect x="${F(lx)}" y="280" width="5" height="142" fill="${p.sil}"/><path d="M${F(lx + 2)} 282 q 0 -30 30 -30" stroke="${p.sil}" stroke-width="5" fill="none"/><circle cx="${F(lx + 32)}" cy="252" r="8" fill="${p.accent}"/><circle cx="${F(lx + 32)}" cy="252" r="44" fill="url(#${d.p}glow)"/>`;
    const px = 420 + r.f() * 120;
    s += `<g fill="${p.sil}"><circle cx="${F(px)}" cy="352" r="9"/><path d="M${F(px - 11)} 362 Q ${F(px)} 356 ${F(px + 11)} 362 L ${F(px + 13)} 426 L ${F(px - 13)} 426 Z"/></g>
      <path d="M${F(px - 30)} 344 A 30 30 0 0 1 ${F(px + 30)} 344 Q ${F(px)} 332 ${F(px - 30)} 344 Z" fill="${p.sil}"/>`;
    return s + `<rect x="0" y="430" width="800" height="70" fill="${p.sil}"/><ellipse cx="${F(px)}" cy="436" rx="60" ry="7" fill="${p.accent}" opacity="0.2"/>`;
  });

  reg('snowfield', (r, p, d) => {
    let s = A.hills(d, r, p, [{ y: 380, amp: 30, op: 0.7 }, { y: 440, amp: 22, op: 1 }]);
    s = s.replace(/fill="${p.sil}" opacity="0.7"/g, `fill="${p.light}" opacity="0.55"`).replace(/fill="${p.sil}" opacity="1"/g, `fill="${p.light}" opacity="0.9"`);
    const fx = 380 + r.f() * 60;
    s += `<g fill="${p.sil}"><rect x="${F(fx - 8)}" y="400" width="16" height="60" rx="6"/><path d="M${F(fx)} 402 L ${F(fx - 14)} 340 L ${F(fx + 4)} 348 Z"/></g>`;
    for (let i = 0; i < 5; i++) s += A.pine(80 + i * 150 + r.f() * 40, 470, 70, 110 + r.f() * 40, p.sil, 0.9);
    return s;
  });

  reg('meadow_summer', (r, p, d) => {
    let s = A.sun(d, p, 170, 130, 44);
    s += `<path d="M0 395 Q 400 370 800 395 L 800 500 L 0 500 Z" fill="${p.stops[1]}" opacity="0.5"/><path d="M0 430 Q 400 405 800 430 L 800 500 L 0 500 Z" fill="${p.sil}" opacity="0.35"/>`;
    for (let i = 0; i < 80; i++) {
      const x = r.f() * 800, y = 400 + r.f() * 95, h = 12 + r.f() * 24;
      s += `<line x1="${F(x)}" y1="${F(y)}" x2="${F(x + 5)}" y2="${F(y - h)}" stroke="${p.sil}" stroke-width="1.4" opacity="${F(0.35 + r.f() * 0.4)}"/>`;
      if (r.f() > 0.7) s += `<circle cx="${F(x + 5)}" cy="${F(y - h)}" r="2.6" fill="${r.pick([p.accent, p.light])}" opacity="0.9"/>`;
    }
    for (let i = 0; i < 5; i++) s += `<rect x="${F(40 + i * 180)}" y="392" width="4" height="34" fill="${p.sil}"/>`;
    return s + `<rect x="20" y="398" width="770" height="3" fill="${p.sil}" opacity="0.7"/><rect x="20" y="410" width="770" height="3" fill="${p.sil}" opacity="0.5"/>`;
  });

  reg('lavender_fields', (r, p, d) => {
    let s = A.hills(d, r, p, [{ y: 330, amp: 40, op: 0.5 }]);
    for (let row = 0; row < 6; row++) {
      const y = 350 + row * 25;
      for (let i = 0; i < 30 - row * 3; i++) {
        const x = r.f() * 800, h = 10 + r.f() * 14 + row * 2;
        s += `<line x1="${F(x)}" y1="${F(y)}" x2="${F(x + 3)}" y2="${F(y - h)}" stroke="${p.sil}" stroke-width="1.6" opacity="${F(0.5 + row * 0.08)}"/><circle cx="${F(x + 3)}" cy="${F(y - h)}" r="${F(2 + r.f() * 1.6)}" fill="${r.pick([p.light, p.accent])}" opacity="0.9"/>`;
      }
    }
    return s;
  });
})();
