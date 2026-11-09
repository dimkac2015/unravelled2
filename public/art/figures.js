/* Unravelled — parametric waist-up portrait builder (spec 6.9).
   One skeleton rig per pose; tapered polygons; noir chiaroscuro. */
(function () {
  const A = window.ART;
  const W = 800, H = 1000;
  const SKINS = { fair: '#d9b39a', light: '#c69a7d', olive: '#a8845e', tan: '#8a6244', brown: '#5f4028', dark: '#3a2417' };
  const BODY_SCALE = { slim: 0.9, average: 1, stocky: 1.14, tall: 1.06, small: 0.82 };

  function poseJoints(pose, s) { // s = body scale; figure centred at x=400
    const J = { head: [400, 235], neck: [400, 330], chest: [400, 470], waist: [400, 660] };
    const sh = { l: [400 - 130 * s, 350], r: [400 + 130 * s, 350] };
    switch (pose) {
      case 'three_quarter': J.head = [430, 240]; J.neck = [425, 332]; sh.l = [400 - 120 * s, 352]; sh.r = [455 + 105 * s, 348]; J.elbowL = [sh.l[0] - 40 * s, 500]; J.elbowR = [sh.r[0] + 50 * s, 490]; J.handL = [sh.l[0] - 20 * s, 640]; J.handR = [sh.r[0] + 70 * s, 630]; J.waist = [415, 665]; J.chest = [420, 472]; break;
      case 'leaning_wall': J.head = [370, 250]; J.neck = [378, 342]; sh.l = [330, 360]; sh.r = [500, 356]; J.elbowL = [300, 500]; J.elbowR = [540, 470]; J.handL = [310, 650]; J.handR = [520, 620]; break;
      case 'sitting': J.head = [400, 300]; J.neck = [400, 390]; J.chest = [400, 510]; J.waist = [400, 700]; sh.l = [400 - 135 * s, 410]; sh.r = [400 + 135 * s, 410]; J.elbowL = [sh.l[0] - 30 * s, 560]; J.elbowR = [sh.r[0] + 30 * s, 560]; J.handL = [sh.l[0] - 10 * s, 700]; J.handR = [sh.r[0] + 10 * s, 700]; break;
      case 'walking': J.head = [415, 240]; J.neck = [412, 332]; sh.l = [380, 352]; sh.r = [450, 348]; J.elbowL = [345, 500]; J.elbowR = [490, 505]; J.handL = [330, 645]; J.handR = [505, 640]; J.waist = [405, 665]; J.chest = [408, 472]; break;
      case 'looking_up': J.head = [400, 210]; J.neck = [400, 305]; sh.l = [400 - 125 * s, 325]; sh.r = [400 + 125 * s, 325]; J.elbowL = [sh.l[0] - 45 * s, 470]; J.elbowR = [sh.r[0] + 45 * s, 470]; J.handL = [sh.l[0] - 30 * s, 610]; J.handR = [sh.r[0] + 30 * s, 610]; break;
      case 'arms_crossed': J.head = [400, 240]; J.neck = [400, 332]; sh.l = [400 - 128 * s, 352]; sh.r = [400 + 128 * s, 352]; J.elbowL = [400 - 170 * s, 520]; J.elbowR = [400 + 170 * s, 520]; J.handL = [400 - 60 * s, 540]; J.handR = [400 + 60 * s, 545]; break;
      case 'hand_in_pocket': J.head = [400, 240]; J.neck = [400, 332]; sh.l = [400 - 128 * s, 352]; sh.r = [400 + 128 * s, 352]; J.elbowL = [sh.l[0] - 50 * s, 505]; J.elbowR = [sh.r[0] + 40 * s, 480]; J.handL = [sh.l[0] - 25 * s, 655]; J.handR = [sh.r[0] + 55 * s, 650]; break;
      default: sh.l = [400 - 130 * s, 350]; sh.r = [400 + 130 * s, 350]; J.elbowL = [sh.l[0] - 35 * s, 505]; J.elbowR = [sh.r[0] + 35 * s, 505]; J.handL = [sh.l[0] - 20 * s, 655]; J.handR = [sh.r[0] + 20 * s, 655];
    }
    return { J, sh };
  }
  function limb(d, a, b, wA, wB, fill) { // tapered rounded quad a→b
    const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len, ny = dx / len;
    const p = [[a[0] + nx * wA, a[1] + ny * wA], [b[0] + nx * wB, b[1] + ny * wB], [b[0] - nx * wB, b[1] - ny * wB], [a[0] - nx * wA, a[1] - ny * wA]];
    d.add(`<polygon points="${p.map(q => A.fmt(q[0]) + ',' + A.fmt(q[1])).join(' ')}" fill="${fill}"/>`);
  }
  function backgrounds(bg, c) {
    const { d, rng, P, w, h } = c, p = d.p;
    d.grad('bg', [[0, P.shadow], [1, P.ink]]);
    d.add(`<rect width="${w}" height="${h}" fill="url(#${p}bg)"/>`);
    const li = P.light, ac = P.accent, mi = P.mid;
    switch (bg) {
      case 'venetian_blinds': for (let i = 0; i < 7; i++) { const y = 40 + i * 130; d.grad('vb' + i, [[0, li, 0], [0.75, li, 0.22], [1, li, 0]], { x1: -100, y1: y, x2: w + 100, y2: y + 60, gradientUnits: 'userSpaceOnUse' }); d.add(`<rect x="-100" y="${y}" width="${w + 200}" height="58" fill="url(#${p}vb${i})" transform="rotate(-8 ${w / 2} ${y})"/>`); } break;
      case 'streetlamp_night': d.add(A.cone(d, p, w * rng.range(0.25, 0.75), h * 0.08, 190, h * 0.9, li, 0.3)); break;
      case 'doorway_light': d.add(`<rect x="${w * 0.55}" y="0" width="${w * 0.45}" height="${h}" fill="${A.mix(li, '#ffffff', 0.3)}" opacity="0.85"/>`); d.grad('doorfade', [[0, P.ink, 0], [1, P.ink, 0.85]], { x1: w * 0.45, y1: 0, x2: w * 0.62, y2: 0, gradientUnits: 'userSpaceOnUse' }); d.add(`<rect x="${w * 0.42}" width="${w * 0.25}" height="${h}" fill="url(#${p}doorfade)"/>`); break;
      case 'rainy_window': for (let i = 0; i < 26; i++) d.add(`<line x1="${A.fmt(rng.range(0, w))}" y1="${A.fmt(rng.range(0, h))}" x2="${A.fmt(rng.range(-8, 8))}" y2="${A.fmt(rng.range(60, 160))}" stroke="${li}" stroke-width="2" opacity="0.18" class="rain" style="animation-delay:${A.fmt(rng.range(0, 2))}s"/>`); d.add(`<rect width="${w}" height="${h}" fill="${P.ink}" opacity="0.25"/>`); break;
      case 'brick_wall': { let s = ''; for (let y = 0; y < h; y += 46) for (let x = ((y / 46) % 2) * 40; x < w; x += 80) s += `<rect x="${x}" y="${y}" width="76" height="42" fill="none" stroke="${P.shadow}" stroke-width="3" opacity="0.8"/>`; d.add(s); break; }
      case 'curtain': for (let i = 0; i < 6; i++) { const x = i * (w / 6); d.grad('cur' + i, [[0, mi, 0.55], [0.5, P.shadow, 0.85], [1, P.ink, 0.95]], { x1: x, y1: 0, x2: x + w / 6, y2: 0, gradientUnits: 'userSpaceOnUse' }); d.add(`<rect x="${x}" width="${w / 6}" height="${h}" fill="url(#${p}cur${i})"/>`); } break;
      case 'smoke_haze': A.mist(d, h * 0.3, h * 0.5, mi, 0.3); A.mist(d, h * 0.6, h * 0.4, li, 0.14); break;
      case 'spotlight': d.add(A.cone(d, p, w / 2, -40, w * 0.42, h * 1.05, li, 0.32)); break;
      default: A.mist(d, h * 0.5, h * 0.5, mi, 0.25);
    }
  }
  function headShape(d, head, cx, cy, s, fill) {
    const w = { oval: [150, 190], square_jaw: [160, 180], round: [170, 170], long: [140, 210], heart: [165, 185], wide: [185, 170] }[head] || [150, 190];
    const Wd = w[0] * s / 2, Ht = w[1] * s / 2;
    d.add(`<ellipse cx="${cx}" cy="${cy}" rx="${A.fmt(Wd)}" ry="${A.fmt(Ht)}" fill="${fill}"/>`);
    return [cx, cy, Wd, Ht];
  }
  function hairStyle(d, style, color, cx, cy, Wd, Ht) {
    const F = A.fmt, ink = color;
    const top = cy - Ht;
    switch (style) {
      case 'bald': break;
      case 'buzz': d.add(`<path d="M ${F(cx - Wd)} ${F(cy - Ht * 0.4)} A ${F(Wd)} ${F(Ht)} 0 0 1 ${F(cx + Wd)} ${F(cy - Ht * 0.4)} L ${F(cx + Wd * 0.92)} ${F(cy - Ht * 0.1)} A ${F(Wd * 0.95)} ${F(Ht * 0.98)} 0 0 0 ${F(cx - Wd * 0.92)} ${F(cy - Ht * 0.1)} Z" fill="${ink}"/>`); break;
      case 'short_side_part': d.add(`<path d="M ${F(cx - Wd)} ${F(cy - Ht * 0.2)} A ${F(Wd)} ${F(Ht)} 0 0 1 ${F(cx + Wd)} ${F(cy - Ht * 0.2)} L ${F(cx + Wd * 0.9)} ${F(cy - Ht * 0.55)} L ${F(cx - Wd * 0.4)} ${F(cy - Ht * 0.75)} L ${F(cx - Wd * 0.95)} ${F(cy - Ht * 0.4)} Z" fill="${ink}"/>`); break;
      case 'slick_back': d.add(`<path d="M ${F(cx - Wd)} ${F(cy - Ht * 0.3)} A ${F(Wd)} ${F(Ht)} 0 0 1 ${F(cx + Wd)} ${F(cy - Ht * 0.3)} L ${F(cx + Wd * 0.8)} ${F(cy - Ht * 0.7)} Q ${F(cx)} ${F(cy - Ht * 1.02)} ${F(cx - Wd * 0.8)} ${F(cy - Ht * 0.7)} Z" fill="${ink}"/>`); break;
      case 'long_straight': case 'long_wavy': d.add(`<path d="M ${F(cx - Wd * 1.15)} ${F(cy + Ht * 1.3)} L ${F(cx - Wd)} ${F(cy - Ht * 0.3)} A ${F(Wd)} ${F(Ht)} 0 0 1 ${F(cx + Wd)} ${F(cy - Ht * 0.3)} L ${F(cx + Wd * 1.15)} ${F(cy + Ht * 1.3)} Q ${F(cx)} ${F(cy + Ht * 0.6)} ${F(cx - Wd * 1.15)} ${F(cy + Ht * 1.3)} Z" fill="${ink}"/>`); if (style === 'long_wavy') d.add(`<path d="M ${F(cx - Wd * 1.1)} ${F(cy + Ht * 0.4)} q ${F(Wd * 0.3)} 30 0 ${F(Ht * 0.8)} M ${F(cx + Wd * 1.1)} ${F(cy + Ht * 0.4)} q ${F(-Wd * 0.3)} 30 0 ${F(Ht * 0.8)}" stroke="${A.mix(ink, '#000000', 0.3)}" stroke-width="5" fill="none"/>`); break;
      case 'curly': case 'afro': { const r = style === 'afro' ? Wd * 1.35 : Wd * 0.85; for (let i = 0; i < 9; i++) { const a = Math.PI + (i / 8) * Math.PI; d.add(`<circle cx="${F(cx + Math.cos(a) * r * 0.8)}" cy="${F(cy - Ht * 0.55 + Math.sin(a) * r * 0.55)}" r="${F(r * 0.42)}" fill="${ink}"/>`); } break; }
      case 'bob': d.add(`<path d="M ${F(cx - Wd * 1.1)} ${F(cy + Ht * 0.5)} L ${F(cx - Wd * 0.95)} ${F(cy - Ht * 0.6)} A ${F(Wd)} ${F(Ht)} 0 0 1 ${F(cx + Wd * 0.95)} ${F(cy - Ht * 0.6)} L ${F(cx + Wd * 1.1)} ${F(cy + Ht * 0.5)} Q ${F(cx)} ${F(cy + Ht * 0.75)} ${F(cx - Wd * 1.1)} ${F(cy + Ht * 0.5)} Z" fill="${ink}"/>`); break;
      case 'ponytail': d.add(`<path d="M ${F(cx - Wd)} ${F(cy - Ht * 0.3)} A ${F(Wd)} ${F(Ht)} 0 0 1 ${F(cx + Wd)} ${F(cy - Ht * 0.3)} L ${F(cx + Wd * 0.9)} ${F(cy - Ht * 0.8)} Q ${F(cx)} ${F(cy - Ht * 0.95)} ${F(cx - Wd * 0.9)} ${F(cy - Ht * 0.8)} Z" fill="${ink}"/><path d="M ${F(cx + Wd * 0.5)} ${F(cy - Ht * 0.7)} q ${F(Wd * 0.7)} 60 ${F(Wd * 0.4)} 150 q ${F(-Wd * 0.35)} -40 ${F(-Wd * 0.4)} -80 Z" fill="${ink}"/>`); break;
      case 'bun': d.add(`<path d="M ${F(cx - Wd)} ${F(cy - Ht * 0.25)} A ${F(Wd)} ${F(Ht)} 0 0 1 ${F(cx + Wd)} ${F(cy - Ht * 0.25)} L ${F(cx + Wd * 0.85)} ${F(cy - Ht * 0.75)} Q ${F(cx)} ${F(cy - Ht * 0.9)} ${F(cx - Wd * 0.85)} ${F(cy - Ht * 0.75)} Z" fill="${ink}"/><circle cx="${cx}" cy="${F(cy - Ht * 1.05)}" r="${F(Wd * 0.38)}" fill="${ink}"/>`); break;
      case 'braids': d.add(`<path d="M ${F(cx - Wd)} ${F(cy - Ht * 0.25)} A ${F(Wd)} ${F(Ht)} 0 0 1 ${F(cx + Wd)} ${F(cy - Ht * 0.25)} L ${F(cx + Wd * 0.85)} ${F(cy - Ht * 0.7)} Q ${F(cx)} ${F(cy - Ht * 0.9)} ${F(cx - Wd * 0.85)} ${F(cy - Ht * 0.7)} Z" fill="${ink}"/>`); for (const sx of [-1, 1]) for (let i = 0; i < 4; i++) d.add(`<circle cx="${F(cx + sx * Wd * (0.75 + i * 0.12))}" cy="${F(cy + Ht * (0.1 + i * 0.35))}" r="${F(Wd * 0.11)}" fill="${ink}"/>`); break;
      case 'mohawk': d.add(`<path d="M ${F(cx - Wd * 0.22)} ${F(cy - Ht * 0.2)} L ${F(cx - Wd * 0.3)} ${F(cy - Ht * 1.5)} L ${F(cx + Wd * 0.3)} ${F(cy - Ht * 1.5)} L ${F(cx + Wd * 0.22)} ${F(cy - Ht * 0.2)} Q ${F(cx)} ${F(cy - Ht * 0.6)} ${F(cx - Wd * 0.22)} ${F(cy - Ht * 0.2)} Z" fill="${ink}"/>`); break;
      case 'wild_spiky': { let s = `<path d="M ${F(cx - Wd)} ${F(cy - Ht * 0.1)}`; for (let i = 0; i <= 10; i++) { const a = Math.PI + (i / 10) * Math.PI; s += ` L ${F(cx + Math.cos(a) * Wd * 1.25)} ${F(cy - Ht * 0.5 + Math.sin(a) * Ht * 0.75 - (i % 2) * 26)}`; } s += ` Q ${F(cx)} ${F(cy - Ht * 0.3)} ${F(cx - Wd)} ${F(cy - Ht * 0.1)} Z`; d.add(s.replace(/"/, '" fill="' + ink + '"')); break; }
      default: d.add(`<path d="M ${F(cx - Wd)} ${F(cy - Ht * 0.2)} A ${F(Wd)} ${F(Ht)} 0 0 1 ${F(cx + Wd)} ${F(cy - Ht * 0.2)} L ${F(cx + Wd * 0.9)} ${F(cy - Ht * 0.6)} Q ${F(cx)} ${F(cy - Ht * 0.85)} ${F(cx - Wd * 0.9)} ${F(cy - Ht * 0.6)} Z" fill="${ink}"/>`);
    }
  }
  function face(d, c, look, cx, cy, Wd, Ht, skin) {
    const { P } = c, ink = P.ink, F = A.fmt;
    const eyeY = cy - Ht * 0.08, eyeDX = Wd * 0.38;
    d.add(`<path d="M ${F(cx - Wd * 0.55)} ${F(cy - Ht * 0.45)} L ${F(cx + Wd * 0.1)} ${F(cy - Ht * 0.55)} L ${F(cx - Wd * 0.2)} ${F(cy - Ht * 0.1)} Z" fill="${A.mix(skin, ink, 0.35)}"/>`); // forehead plane shadow
    d.add(`<path d="M ${F(cx + Wd * 0.1)} ${F(cy - Ht * 0.55)} L ${F(cx + Wd * 0.8)} ${F(cy - Ht * 0.1)} L ${F(cx + Wd * 0.25)} ${F(cy + Ht * 0.25)} L ${F(cx - Wd * 0.2)} ${F(cy - Ht * 0.1)} Z" fill="${A.mix(skin, ink, 0.55)}"/>`); // cheek shadow 40-60%
    for (const sx of [-1, 1]) {
      d.add(`<rect x="${F(cx + sx * eyeDX - 16)}" y="${F(eyeY - 4)}" width="32" height="7" rx="3" fill="${ink}"/>`);
      d.add(`<circle cx="${F(cx + sx * eyeDX + 4)}" cy="${F(eyeY - 1)}" r="1.6" fill="${P.light}"/>`);
      d.add(`<rect x="${F(cx + sx * eyeDX - 20)}" y="${F(eyeY - 18)}" width="40" height="8" fill="${ink}"/>`); // heavy brow
    }
    d.add(`<path d="M ${F(cx)} ${F(eyeY + 6)} L ${F(cx + 12)} ${F(cy + Ht * 0.28)} L ${F(cx - 10)} ${F(cy + Ht * 0.26)} Z" fill="${A.mix(skin, ink, 0.6)}"/>`); // nose triangle
    const my = cy + Ht * 0.55, expr = look.expression;
    const mouth = { neutral: `M ${F(cx - 22)} ${F(my)} L ${F(cx + 22)} ${F(my)}`, smirk: `M ${F(cx - 22)} ${F(my + 5)} Q ${F(cx + 8)} ${F(my - 2)} ${F(cx + 26)} ${F(my - 8)}`, sad: `M ${F(cx - 22)} ${F(my + 8)} Q ${F(cx)} ${F(my - 6)} ${F(cx + 22)} ${F(my + 8)}`, angry: `M ${F(cx - 24)} ${F(my - 4)} L ${F(cx + 24)} ${F(my + 2)}`, dreamy: `M ${F(cx - 18)} ${F(my)} Q ${F(cx)} ${F(my + 7)} ${F(cx + 18)} ${F(my)}`, surprised: `M ${F(cx)} ${F(my - 8)} a 9 8 0 1 0 0.1 0`, tired: `M ${F(cx - 22)} ${F(my + 2)} L ${F(cx + 22)} ${F(my)}`, determined: `M ${F(cx - 24)} ${F(my - 2)} L ${F(cx + 24)} ${F(my - 4)}` }[expr] || `M ${F(cx - 22)} ${F(my)} L ${F(cx + 22)} ${F(my)}`;
    d.add(`<path d="${mouth}" stroke="${ink}" stroke-width="5" fill="${expr === 'surprised' ? ink : 'none'}" stroke-linecap="round"/>`);
  }
  function facialHair(d, style, cx, cy, Wd, Ht, color) {
    const F = A.fmt, m = A.mix(color, '#000000', 0.25);
    switch (style) {
      case 'stubble': d.add(`<path d="M ${F(cx - Wd * 0.7)} ${F(cy + Ht * 0.3)} Q ${F(cx)} ${F(cy + Ht * 1.05)} ${F(cx + Wd * 0.7)} ${F(cy + Ht * 0.3)} L ${F(cx + Wd * 0.55)} ${F(cy + Ht * 0.45)} Q ${F(cx)} ${F(cy + Ht * 0.85)} ${F(cx - Wd * 0.55)} ${F(cy + Ht * 0.45)} Z" fill="${m}" opacity="0.55"/>`); break;
      case 'mustache': d.add(`<path d="M ${F(cx - 26)} ${F(cy + Ht * 0.42)} Q ${F(cx)} ${F(cy + Ht * 0.3)} ${F(cx + 26)} ${F(cy + Ht * 0.42)} Q ${F(cx)} ${F(cy + Ht * 0.56)} ${F(cx - 26)} ${F(cy + Ht * 0.42)} Z" fill="${m}"/>`); break;
      case 'full_beard': d.add(`<path d="M ${F(cx - Wd * 0.75)} ${F(cy + Ht * 0.2)} Q ${F(cx)} ${F(cy + Ht * 1.15)} ${F(cx + Wd * 0.75)} ${F(cy + Ht * 0.2)} L ${F(cx + Wd * 0.6)} ${F(cy + Ht * 0.5)} Q ${F(cx)} ${F(cy + Ht * 0.8)} ${F(cx - Wd * 0.6)} ${F(cy + Ht * 0.5)} Z" fill="${m}"/>`); break;
      case 'goatee': d.add(`<path d="M ${F(cx - 20)} ${F(cy + Ht * 0.5)} Q ${F(cx)} ${F(cy + Ht * 0.35)} ${F(cx + 20)} ${F(cy + Ht * 0.5)} Q ${F(cx + 12)} ${F(cy + Ht * 0.95)} ${F(cx)} ${F(cy + Ht * 1.0)} Q ${F(cx - 12)} ${F(cy + Ht * 0.95)} ${F(cx - 20)} ${F(cy + Ht * 0.5)} Z" fill="${m}"/>`); break;
      case 'sideburns': d.add(`<rect x="${F(cx - Wd * 0.82)}" y="${F(cy - Ht * 0.1)}" width="${F(Wd * 0.2)}" height="${F(Ht * 0.6)}" fill="${m}"/><rect x="${F(cx + Wd * 0.62)}" y="${F(cy - Ht * 0.1)}" width="${F(Wd * 0.2)}" height="${F(Ht * 0.6)}" fill="${m}"/>`); break;
    }
  }
  function outfitShape(d, J, sh, s, id, col, P) {
    const F = A.fmt, t = 26 * s;
    d.add(`<polygon points="${F(sh.l[0] - t)} ${F(sh.l[1] - 30)}, ${F(sh.r[0] + t)} ${F(sh.r[1] - 30)}, ${F(J.waist[0] + 95 * s)} ${F(J.waist[1] + 40)}, ${F(J.waist[0] - 95 * s)} ${F(J.waist[1] + 40)}" fill="${col}"/>`);
    d.add(`<path d="M ${F(J.neck[0] - 26)} ${F(J.neck[1] - 10)} L ${F(sh.l[0] - t)} ${F(sh.l[1] - 30)} L ${F(J.chest[0] - 80 * s)} ${F(J.chest[1] + 60)} L ${F(J.waist[0] - 95 * s)} ${F(J.waist[1] + 40)} L ${F(J.neck[0] + 26)} ${F(J.neck[1] - 10)} L ${F(J.chest[0] + 80 * s)} ${F(J.chest[1] + 60)} L ${F(sh.r[0] + t)} ${F(sh.r[1] - 30)} L ${F(J.neck[0] + 26)} ${F(J.neck[1] - 10)} Z" fill="${col}"/>`);
    d.add(`<path d="M ${F(J.chest[0])} ${F(J.chest[1] - 60)} L ${F(J.chest[0])} ${F(J.waist[1])}" stroke="${A.mix(col, P.ink, 0.45)}" stroke-width="4" opacity="0.8"/>`);
    d.add(`<path d="M ${F(sh.l[0])} ${F(sh.l[1] + 20)} L ${F(J.chest[0] - 40 * s)} ${F(J.chest[1] + 30)} M ${F(sh.r[0])} ${F(sh.r[1] + 20)} L ${F(J.chest[0] + 40 * s)} ${F(J.chest[1] + 30)}" stroke="${A.mix(col, P.ink, 0.4)}" stroke-width="4" fill="none" opacity="0.7"/>`);
  }
  function headwear(d, id, cx, cy, Wd, Ht, P) {
    const F = A.fmt, ink = P.ink, mi = P.mid, ac = P.accent, ba = P.base;
    switch (id) {
      case 'fedora': d.add(`<ellipse cx="${cx}" cy="${F(cy - Ht * 0.75)}" rx="${F(Wd * 1.25)}" ry="${F(Ht * 0.22)}" fill="${ba}"/><path d="M ${F(cx - Wd * 0.72)} ${F(cy - Ht * 0.7)} Q ${F(cx)} ${F(cy - Ht * 1.45)} ${F(cx + Wd * 0.72)} ${F(cy - Ht * 0.7)} L ${F(cx + Wd * 0.6)} ${F(cy - Ht * 0.95)} Q ${F(cx)} ${F(cy - Ht * 1.3)} ${F(cx - Wd * 0.6)} ${F(cy - Ht * 0.95)} Z" fill="${ba}"/><rect x="${F(cx - Wd * 0.72)}" y="${F(cy - Ht * 0.95)}" width="${F(Wd * 1.44)}" height="${F(Ht * 0.2)}" fill="${ink}"/>`); break;
      case 'top_hat': d.add(`<ellipse cx="${cx}" cy="${F(cy - Ht * 0.7)}" rx="${F(Wd * 1.3)}" ry="${F(Ht * 0.2)}" fill="${ink}"/><rect x="${F(cx - Wd * 0.62)}" y="${F(cy - Ht * 2.0)}" width="${F(Wd * 1.24)}" height="${F(Ht * 1.35)}" fill="${ink}"/><rect x="${F(cx - Wd * 0.62)}" y="${F(cy - Ht * 0.95)}" width="${F(Wd * 1.24)}" height="${F(Ht * 0.22)}" fill="${ac}"/>`); break;
      case 'beret': d.add(`<path d="M ${F(cx - Wd * 1.25)} ${F(cy - Ht * 0.8)} Q ${F(cx)} ${F(cy - Ht * 1.7)} ${F(cx + Wd * 1.25)} ${F(cy - Ht * 0.8)} Q ${F(cx)} ${F(cy - Ht * 0.55)} ${F(cx - Wd * 1.25)} ${F(cy - Ht * 0.8)} Z" fill="${ac}"/><circle cx="${cx}" cy="${F(cy - Ht * 1.62)}" r="6" fill="${ink}"/>`); break;
      case 'cap': d.add(`<path d="M ${F(cx - Wd)} ${F(cy - Ht * 0.75)} A ${F(Wd)} ${F(Ht)} 0 0 1 ${F(cx + Wd)} ${F(cy - Ht * 0.75)} L ${F(cx + Wd)} ${F(cy - Ht * 0.95)} Q ${F(cx)} ${F(cy - Ht * 1.15)} ${F(cx - Wd)} ${F(cy - Ht * 0.95)} Z" fill="${ba}"/><path d="M ${F(cx + Wd * 0.5)} ${F(cy - Ht * 0.8)} L ${F(cx + Wd * 1.6)} ${F(cy - Ht * 0.55)} L ${F(cx + Wd * 0.7)} ${F(cy - Ht * 0.55)} Z" fill="${ba}"/>`); break;
      case 'helmet': d.add(`<path d="M ${F(cx - Wd * 1.05)} ${F(cy + Ht * 0.1)} A ${F(Wd * 1.05)} ${F(Ht * 1.15)} 0 0 1 ${F(cx + Wd * 1.05)} ${F(cy + Ht * 0.1)} L ${F(cx + Wd * 1.05)} ${F(cy - Ht * 0.2)} Q ${F(cx)} ${F(cy - Ht * 1.2)} ${F(cx - Wd * 1.05)} ${F(cy - Ht * 0.2)} Z" fill="${mi}"/><rect x="${F(cx - Wd * 1.05)}" y="${F(cy - Ht * 0.25)}" width="${F(Wd * 2.1)}" height="${F(Ht * 0.18)}" fill="${ink}"/>`); break;
      case 'hood': d.add(`<path d="M ${F(cx - Wd * 1.5)} ${F(cy + Ht * 0.9)} Q ${F(cx - Wd * 1.6)} ${F(cy - Ht * 1.5)} ${F(cx)} ${F(cy - Ht * 1.6)} Q ${F(cx + Wd * 1.6)} ${F(cy - Ht * 1.5)} ${F(cx + Wd * 1.5)} ${F(cy + Ht * 0.9)} L ${F(cx + Wd * 0.8)} ${F(cy + Ht * 0.9)} Q ${F(cx + Wd * 0.9)} ${F(cy - Ht * 0.9)} ${F(cx)} ${F(cy - Ht * 1.0)} Q ${F(cx - Wd * 0.9)} ${F(cy - Ht * 0.9)} ${F(cx - Wd * 0.8)} ${F(cy + Ht * 0.9)} Z" fill="${P.shadow}"/>`); break;
      case 'cowboy_hat': d.add(`<path d="M ${F(cx - Wd * 1.6)} ${F(cy - Ht * 0.7)} Q ${F(cx)} ${F(cy - Ht * 0.45)} ${F(cx + Wd * 1.6)} ${F(cy - Ht * 0.7)} L ${F(cx + Wd * 1.3)} ${F(cy - Ht * 0.85)} Q ${F(cx)} ${F(cy - Ht * 0.65)} ${F(cx - Wd * 1.3)} ${F(cy - Ht * 0.85)} Z" fill="${ba}"/><path d="M ${F(cx - Wd * 0.8)} ${F(cy - Ht * 0.8)} Q ${F(cx)} ${F(cy - Ht * 1.5)} ${F(cx + Wd * 0.8)} ${F(cy - Ht * 0.8)} Q ${F(cx)} ${F(cy - Ht * 0.6)} ${F(cx - Wd * 0.8)} ${F(cy - Ht * 0.8)} Z" fill="${ba}"/>`); break;
      case 'crown': d.add(`<path d="M ${F(cx - Wd * 0.9)} ${F(cy - Ht * 0.8)} L ${F(cx - Wd * 0.9)} ${F(cy - Ht * 1.35)} L ${F(cx - Wd * 0.45)} ${F(cy - Ht * 1.05)} L ${F(cx)} ${F(cy - Ht * 1.5)} L ${F(cx + Wd * 0.45)} ${F(cy - Ht * 1.05)} L ${F(cx + Wd * 0.9)} ${F(cy - Ht * 1.35)} L ${F(cx + Wd * 0.9)} ${F(cy - Ht * 0.8)} Z" fill="${ac}"/><circle cx="${cx}" cy="${F(cy - Ht * 1.5)}" r="6" fill="${P.light}"/>`); break;
      case 'witch_hat': d.add(`<path d="M ${F(cx - Wd * 1.5)} ${F(cy - Ht * 0.7)} Q ${F(cx)} ${F(cy - Ht * 0.5)} ${F(cx + Wd * 1.5)} ${F(cy - Ht * 0.7)} L ${F(cx + Wd * 0.6)} ${F(cy - Ht * 0.9)} Z" fill="${ink}"/><path d="M ${F(cx)} ${F(cy - Ht * 2.4)} Q ${F(cx + Wd * 0.5)} ${F(cy - Ht * 1.2)} ${F(cx + Wd * 0.62)} ${F(cy - Ht * 0.85)} L ${F(cx - Wd * 0.62)} ${F(cy - Ht * 0.85)} Q ${F(cx - Wd * 0.5)} ${F(cy - Ht * 1.2)} ${F(cx)} ${F(cy - Ht * 2.4)} Z" fill="${ink}"/><rect x="${F(cx - Wd * 0.85)}" y="${F(cy - Ht * 1.0)}" width="${F(Wd * 1.7)}" height="${F(Ht * 0.18)}" fill="${ac}"/>`); break;
      case 'headband': d.add(`<rect x="${F(cx - Wd * 1.02)}" y="${F(cy - Ht * 0.55)}" width="${F(Wd * 2.04)}" height="${F(Ht * 0.22)}" fill="${ac}"/>`); break;
      case 'feather_hat': d.add(`<ellipse cx="${cx}" cy="${F(cy - Ht * 0.85)}" rx="${F(Wd * 1.2)}" ry="${F(Ht * 0.18)}" fill="${ba}"/><path d="M ${F(cx)} ${F(cy - Ht * 0.9)} Q ${F(cx + Wd * 0.9)} ${F(cy - Ht * 2.2)} ${F(cx + Wd * 1.1)} ${F(cy - Ht * 2.6)} Q ${F(cx + Wd * 0.4)} ${F(cy - Ht * 1.6)} ${F(cx)} ${F(cy - Ht * 0.9)} Z" fill="${ac}"/>`); break;
    }
  }
  function accessory(d, id, cx, cy, Wd, Ht, P) {
    const F = A.fmt;
    switch (id) {
      case 'glasses': d.add(`<rect x="${F(cx - Wd * 0.62)}" y="${F(cy - Ht * 0.18)}" width="${F(Wd * 0.5)}" height="${F(Ht * 0.22)}" fill="none" stroke="${P.ink}" stroke-width="6"/><rect x="${F(cx + Wd * 0.12)}" y="${F(cy - Ht * 0.18)}" width="${F(Wd * 0.5)}" height="${F(Ht * 0.22)}" fill="none" stroke="${P.ink}" stroke-width="6"/><line x1="${F(cx - Wd * 0.12)}" y1="${F(cy - Ht * 0.08)}" x2="${F(cx + Wd * 0.12)}" y2="${F(cy - Ht * 0.08)}" stroke="${P.ink}" stroke-width="6"/>`); break;
      case 'round_glasses': d.add(`<circle cx="${F(cx - Wd * 0.38)}" cy="${F(cy - Ht * 0.06)}" r="${F(Wd * 0.3)}" fill="none" stroke="${P.light}" stroke-width="5"/><circle cx="${F(cx + Wd * 0.38)}" cy="${F(cy - Ht * 0.06)}" r="${F(Wd * 0.3)}" fill="none" stroke="${P.light}" stroke-width="5"/><line x1="${F(cx - Wd * 0.08)}" y1="${F(cy - Ht * 0.06)}" x2="${F(cx + Wd * 0.08)}" y2="${F(cy - Ht * 0.06)}" stroke="${P.light}" stroke-width="5"/>`); break;
      case 'scarf': d.add(`<path d="M ${F(cx - Wd * 0.6)} ${F(cy + Ht * 0.9)} Q ${F(cx)} ${F(cy + Ht * 1.3)} ${F(cx + Wd * 0.6)} ${F(cy + Ht * 0.9)} L ${F(cx + Wd * 0.45)} ${F(cy + Ht * 0.7)} Q ${F(cx)} ${F(cy + Ht * 1.0)} ${F(cx - Wd * 0.45)} ${F(cy + Ht * 0.7)} Z" fill="${P.accent}"/>`); break;
      case 'tie': d.add(`<path d="M ${F(cx - 10)} ${F(cy + Ht * 1.0)} L ${F(cx + 10)} ${F(cy + Ht * 1.0)} L ${F(cx + 16)} ${F(cy + Ht * 1.5)} L ${F(cx)} ${F(cy + Ht * 2.3)} L ${F(cx - 16)} ${F(cy + Ht * 1.5)} Z" fill="${P.accent}" transform="translate(0 -260)"/>`); break;
      case 'eyepatch': d.add(`<circle cx="${F(cx + Wd * 0.38)}" cy="${F(cy - Ht * 0.06)}" r="${F(Wd * 0.3)}" fill="${P.ink}"/><line x1="${F(cx - Wd * 0.9)}" y1="${F(cy - Ht * 0.4)}" x2="${F(cx + Wd * 0.9)}" y2="${F(cy + Ht * 0.3)}" stroke="${P.ink}" stroke-width="6"/>`); break;
      case 'earring': d.add(`<circle cx="${F(cx - Wd * 0.95)}" cy="${F(cy + Ht * 0.35)}" r="7" fill="${P.accent}"/><circle cx="${F(cx + Wd * 0.95)}" cy="${F(cy + Ht * 0.35)}" r="7" fill="${P.accent}"/>`); break;
      case 'necklace': d.add(`<path d="M ${F(cx - Wd * 0.5)} ${F(cy + Ht * 1.05)} Q ${F(cx)} ${F(cy + Ht * 1.6)} ${F(cx + Wd * 0.5)} ${F(cy + Ht * 1.05)}" fill="none" stroke="${P.accent}" stroke-width="6"/><circle cx="${cx}" cy="${F(cy + Ht * 1.42)}" r="9" fill="${P.accent}"/>`); break;
      case 'goggles': d.add(`<rect x="${F(cx - Wd * 0.75)}" y="${F(cy - Ht * 0.28)}" width="${F(Wd * 1.5)}" height="${F(Ht * 0.3)}" rx="${F(Ht * 0.15)}" fill="${P.mid}"/><rect x="${F(cx - Wd * 0.62)}" y="${F(cy - Ht * 0.2)}" width="${F(Wd * 0.5)}" height="${F(Ht * 0.16)}" rx="8" fill="${P.ink}"/><rect x="${F(cx + Wd * 0.12)}" y="${F(cy - Ht * 0.2)}" width="${F(Wd * 0.5)}" height="${F(Ht * 0.16)}" rx="8" fill="${P.ink}"/><line x1="${F(cx - Wd * 0.75)}" y1="${F(cy - Ht * 0.1)}" x2="${F(cx - Wd * 1.05)}" y2="${F(cy - Ht * 0.1)}" stroke="${P.shadow}" stroke-width="8"/><line x1="${F(cx + Wd * 0.75)}" y1="${F(cy - Ht * 0.1)}" x2="${F(cx + Wd * 1.05)}" y2="${F(cy - Ht * 0.1)}" stroke="${P.shadow}" stroke-width="8"/>`); break;
      case 'mask': d.add(`<path d="M ${F(cx - Wd * 0.85)} ${F(cy - Ht * 0.15)} Q ${F(cx)} ${F(cy - Ht * 0.45)} ${F(cx + Wd * 0.85)} ${F(cy - Ht * 0.15)} L ${F(cx + Wd * 0.7)} ${F(cy + Ht * 0.5)} Q ${F(cx)} ${F(cy + Ht * 0.75)} ${F(cx - Wd * 0.7)} ${F(cy + Ht * 0.5)} Z" fill="${P.shadow}"/>`); break;
    }
  }

  function render(look, seedStr, palId, bgId) {
    const rng = A.makeRng(seedStr + ':figure');
    const P = A.PALETTES[palId] || A.PALETTES.copper_noir;
    const d = A.doc(W, H, 'fg' + Math.abs(A.hashStr(seedStr)) % 100000 + '_');
    const c = { d, rng, P, w: W, h: H };
    backgrounds(bgId || look.background || 'spotlight', c);
    const s = BODY_SCALE[look.body] || 1;
    const { J, sh } = poseJoints(look.pose || 'standing_front', s);
    const skin = A.mix(SKINS[look.skin] || SKINS.olive, P.ink, 0.18);
    const hairCol = P[look.hair_color] || P.ink;
    const outfitCol = P[look.outfit_color] || P.base;
    // cast shadow on wall
    d.add(`<ellipse cx="${J.waist[0] + 60}" cy="${J.waist[1] + 60}" rx="${260 * s}" ry="40" fill="${P.ink}" opacity="0.5"/>`);
    // back arm
    limb(d, sh.l, J.elbowL, 34 * s, 26 * s, A.mix(outfitCol, P.ink, 0.3)); limb(d, J.elbowL, J.handL, 26 * s, 20 * s, A.mix(outfitCol, P.ink, 0.3));
    // torso + outfit
    outfitShape(d, J, sh, s, look.outfit, outfitCol, P);
    // neck + head
    limb(d, J.neck, J.head, 34, 40, skin);
    let hx = J.head[0], hy = J.head[1], Wd, Ht;
    if (look.species === 'robot') {
      d.add(`<rect x="${A.fmt(hx - 95 * s)}" y="${A.fmt(hy - 105 * s)}" width="${A.fmt(190 * s)}" height="${A.fmt(210 * s)}" rx="26" fill="${A.mix(P.mid, P.shadow, 0.4)}"/>`);
      d.add(`<rect x="${A.fmt(hx - 78 * s)}" y="${A.fmt(hy - 55 * s)}" width="${A.fmt(156 * s)}" height="${A.fmt(60 * s)}" rx="12" fill="${P.ink}"/>`);
      d.add(`<rect x="${A.fmt(hx - 62 * s)}" y="${A.fmt(hy - 45 * s)}" width="${A.fmt(46 * s)}" height="${A.fmt(40 * s)}" rx="8" fill="${P.accent}" class="${A.REDUCED ? '' : 'tw'}"/><rect x="${A.fmt(hx + 16 * s)}" y="${A.fmt(hy - 45 * s)}" width="${A.fmt(46 * s)}" height="${A.fmt(40 * s)}" rx="8" fill="${P.accent}"/>`);
      d.add(`<line x1="${hx}" y1="${A.fmt(hy - 105 * s)}" x2="${hx}" y2="${A.fmt(hy - 150 * s)}" stroke="${P.shadow}" stroke-width="8"/><circle cx="${hx}" cy="${A.fmt(hy - 158 * s)}" r="9" fill="${P.accent}"/>`);
      Wd = 95 * s; Ht = 105 * s;
    } else if (look.species === 'animal') {
      [hx, hy, Wd, Ht] = headShape(d, look.head || 'round', hx, hy, s, skin);
      const at = look.animal_type || 'cat', ear = { cat: [[-0.7, -0.95, -0.35, -1.5], [0.7, -0.95, 0.35, -1.5]], dog: [[-0.75, -0.8, -1.05, -0.2], [0.75, -0.8, 1.05, -0.2]], fox: [[-0.7, -0.9, -0.3, -1.5], [0.7, -0.9, 0.3, -1.5]], bear: [[-0.75, -0.85, -0.45, -1.25], [0.75, -0.85, 0.45, -1.25]], rabbit: [[-0.35, -0.95, -0.25, -2.1], [0.35, -0.95, 0.25, -2.1]], bird: [[-0.5, -1.0, 0, -1.25], [0.5, -1.0, 0, -1.25]], mouse: [[-0.8, -0.8, -0.5, -1.3], [0.8, -0.8, 0.5, -1.3]], wolf: [[-0.65, -0.95, -0.3, -1.45], [0.65, -0.95, 0.3, -1.45]] }[at] || [[-0.7, -0.95, -0.35, -1.5], [0.7, -0.95, 0.35, -1.5]];
      for (const [ex, ey, tx, ty] of ear) d.add(`<path d="M ${A.fmt(hx + ex * Wd)} ${A.fmt(hy + ey * Ht)} L ${A.fmt(hx + tx * Wd)} ${A.fmt(hy + ty * Ht)} L ${A.fmt(hx - ex * Wd * 0.4)} ${A.fmt(hy + ey * Ht * 0.7)} Z" fill="${skin}"/>`);
      if (['cat', 'dog', 'fox', 'wolf', 'mouse', 'rabbit'].includes(at)) d.add(`<path d="M ${A.fmt(hx - Wd * 0.45)} ${A.fmt(hy + Ht * 0.25)} Q ${hx} ${A.fmt(hy + Ht * 0.75)} ${A.fmt(hx + Wd * 0.45)} ${A.fmt(hy + Ht * 0.25)} Q ${hx} ${A.fmt(hy + Ht * 0.5)} ${A.fmt(hx - Wd * 0.45)} ${A.fmt(hy + Ht * 0.25)} Z" fill="${A.mix(skin, P.light, 0.35)}"/><circle cx="${hx}" cy="${A.fmt(hy + Ht * 0.42)}" r="${A.fmt(Wd * 0.09)}" fill="${P.ink}"/>`);
      for (const sx of [-1, 1]) { d.add(`<ellipse cx="${A.fmt(hx + sx * Wd * 0.38)}" cy="${A.fmt(hy - Ht * 0.05)}" rx="${A.fmt(Wd * 0.16)}" ry="${A.fmt(Ht * 0.1)}" fill="${P.ink}"/><circle cx="${A.fmt(hx + sx * Wd * 0.38 + 3)}" cy="${A.fmt(hy - Ht * 0.05)}" r="2.4" fill="${P.light}"/>`); }
    } else {
      [hx, hy, Wd, Ht] = headShape(d, look.head || 'oval', hx, hy, s, skin);
      face(d, c, look, hx, hy, Wd, Ht, skin);
      facialHair(d, look.facial_hair || 'none', hx, hy, Wd, Ht, hairCol);
    }
    hairStyle(d, look.hair || 'short_side_part', hairCol, hx, hy, Wd, Ht);
    headwear(d, look.headwear || 'none', hx, hy, Wd, Ht, P);
    accessory(d, look.accessory || 'none', hx, hy, Wd, Ht, P);
    // front arm
    limb(d, sh.r, J.elbowR, 36 * s, 27 * s, outfitCol); limb(d, J.elbowR, J.handR, 27 * s, 22 * s, outfitCol);
    limb(d, [sh.r[0] + 6, sh.r[1] + 60], J.handR, 18 * s, 16 * s, skin);
    // light shaft + halftone + rim + grain
    d.add(A.cone(d, d.p, W * rng.range(0.2, 0.4), -30, 210, H * 1.05, P.light, 0.3));
    const ht = A.halftone(d, d.p, P.ink);
    d.add(`<rect width="${W}" height="${H}" fill="${ht}" opacity="0.12"/>`);
    A.vignette(d, d.p, W, H, 0.5);
    A.grain(d, d.p, W, H);
    return d.render(`0 0 ${W} ${H}`, 'preserveAspectRatio="xMidYMid slice" role="img" aria-hidden="true"' + (A.REDUCED ? ' class="reduced"' : ''));
  }

  window.ART.figures = { render, SKINS };
})();
