// Minimalist SVG sceneries. Each builder returns an SVG string (800x450).
// Colours are used deliberately: aggressive moods get reds/blacks,
// sunny moods get warm golds, lush moods get deep greens.

(function () {
  const W = 800, H = 450;

  function wrap(inner) {
    return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img">` + inner + `</svg>`;
  }

  function waves(y, color, amp, step, phase) {
    let d = `M0 ${y}`;
    for (let x = 0; x <= W; x += step) {
      d += ` Q ${x + step / 2} ${y + (phase ? -amp : amp)}, ${x + step} ${y}`;
      phase = !phase;
    }
    return `<path d="${d} L ${W} ${H} L 0 ${H} Z" fill="${color}"/>`;
  }

  const scenes = {

    // dark & aggressive — storm ocean, ship against black waves
    stormOcean: () => wrap(`
      <rect width="${W}" height="${H}" fill="#0b0e14"/>
      <circle cx="620" cy="90" r="34" fill="#3a2f2a" opacity=".9"/>
      <path d="M520 60 L560 130 L600 60 Z" fill="#171c26"/>
      <path d="M600 60 L640 130 L680 60 Z" fill="#171c26"/>
      ${waves(280, "#101623", 14, 80, 0)}
      <g fill="#e0dcd0">
        <path d="M340 250 l60 -14 v14 z" opacity=".85"/>
        <rect x="392" y="196" width="4" height="54" fill="#7a6a52"/>
        <path d="M396 200 l44 46 h-44 z" fill="#c9c2b2"/>
        <path d="M330 250 h130 l-14 20 h-102 z" fill="#232a38"/>
        <rect x="388" y="244" width="6" height="8" fill="#c34a36"/>
      </g>
      ${waves(330, "#0a0d12", 18, 90, 1)}
      <path d="M0 420 Q 200 390 400 420 T 800 415 L 800 450 L 0 450 Z" fill="#070a0e"/>
      <g stroke="#8f2f26" stroke-width="3" stroke-linecap="round" opacity=".8">
        <path d="M120 80 l-14 34"/><path d="M118 80 l14 34"/>
        <path d="M690 150 l-12 30"/><path d="M692 150 l12 30"/>
      </g>
    `),

    // aggressive & hot — volcano
    volcano: () => wrap(`
      <rect width="${W}" height="${H}" fill="#1a0f0d"/>
      <circle cx="150" cy="80" r="40" fill="#e04a2a" opacity=".85"/>
      <path d="M0 300 L200 120 L300 220 L420 90 L560 240 L680 160 L800 280 L800 450 L0 450 Z" fill="#241312"/>
      <path d="M420 90 L520 450 L320 450 Z" fill="#160b0a"/>
      <path d="M400 130 Q420 180 432 220 Q445 175 462 150 Q470 200 480 250 L445 260 Q425 200 400 130 Z" fill="#ff5a2a"/>
      <path d="M0 380 Q 200 350 400 380 T 800 372 L800 450 L0 450 Z" fill="#0d0705"/>
      <g fill="#ffb066" opacity=".9">
        <circle cx="430" cy="300" r="4"/><circle cx="460" cy="340" r="3"/><circle cx="410" cy="360" r="3"/>
      </g>
    `),

    // sunny & nostalgic — summer beach
    summerBeach: () => wrap(`
      <rect width="${W}" height="${H}" fill="#ffd98e"/>
      <circle cx="640" cy="100" r="52" fill="#ff9d4d"/>
      ${waves(240, "#f2b56b", 8, 60, 0)}
      ${waves(270, "#ef9f55", 8, 60, 1)}
      <rect x="0" y="300" width="${W}" height="150" fill="#f7c987"/>
      <path d="M0 300 Q 200 288 400 300 T 800 296 L800 320 L0 324 Z" fill="#fff1c9"/>
      <g fill="#2c6b5f">
        <path d="M120 300 q10 -60 4 -84 q26 34 20 84 z"/>
        <path d="M150 300 q18 -50 40 -66 q-4 40 -12 66 z" opacity=".85"/>
      </g>
      <g stroke="#2c6b5f" stroke-width="5" stroke-linecap="round">
        <path d="M560 300 v-40"/><path d="M560 275 l-24 -18"/><path d="M560 268 l26 -20"/>
      </g>
    `),

    // lush & slow — deep forest
    forest: () => wrap(`
      <rect width="${W}" height="${H}" fill="#0f3d2b"/>
      <g fill="#0a2e1f">
        <path d="M60 450 L170 90 L280 450 Z"/>
        <path d="M240 450 L360 130 L480 450 Z"/>
        <path d="M430 450 L560 80 L690 450 Z"/>
        <path d="M620 450 L720 170 L820 450 Z"/>
      </g>
      <g fill="#1a5c3d" opacity=".9">
        <path d="M150 450 L170 140 L190 450 Z"/>
        <path d="M330 450 L360 180 L390 450 Z"/>
        <path d="M530 450 L560 120 L590 450 Z"/>
      </g>
      <g fill="#e8dcc8" opacity=".22">
        <circle cx="170" cy="120" r="26"/><circle cx="360" cy="165" r="20"/><circle cx="560" cy="110" r="30"/>
      </g>
      <rect x="0" y="400" width="${W}" height="50" fill="#07281a"/>
      <path d="M0 420 Q 400 400 800 424 L800 450 L0 450 Z" fill="#052014"/>
    `),

    // calm flowing — river valley
    river: () => wrap(`
      <rect width="${W}" height="${H}" fill="#cfe6d8"/>
      <circle cx="120" cy="90" r="36" fill="#f5e9c8"/>
      <path d="M0 260 L140 140 L260 240 L400 120 L540 250 L680 160 L800 250 L800 450 L0 450 Z" fill="#2f7a55"/>
      <path d="M0 450 L800 450 L800 300 Q 600 340 460 300 Q 300 260 200 310 Q 90 360 0 330 Z" fill="#3c9468"/>
      <path d="M330 450 Q 380 380 340 330 Q 300 285 380 250 Q 470 300 440 360 Q 420 410 470 450 Z" fill="#7cc9a5"/>
      <path d="M352 450 Q 400 390 366 340 Q 336 300 396 268 Q 450 310 424 362 Q 406 408 452 450 Z" fill="#a7dcc2"/>
      <g fill="#1d5c3a">
        <circle cx="140" cy="250" r="18"/><rect x="136" y="268" width="8" height="26"/>
        <circle cx="640" cy="245" r="22"/><rect x="635" y="267" width="10" height="30"/>
      </g>
    `),

    // vast & instrumental — desert dunes
    desert: () => wrap(`
      <rect width="${W}" height="${H}" fill="#f6d7a3"/>
      <circle cx="660" cy="110" r="46" fill="#e8823c"/>
      <path d="M0 280 Q 200 210 400 280 T 800 265 L800 450 L0 450 Z" fill="#e0a95e"/>
      <path d="M0 350 Q 250 290 500 350 T 800 340 L800 450 L0 450 Z" fill="#c98a45"/>
      <path d="M0 410 Q 300 370 600 412 T 800 405 L800 450 L0 450 Z" fill="#a56b32"/>
      <g fill="#6d4a24">
        <rect x="150" y="330" width="10" height="46" rx="4"/>
        <circle cx="155" cy="318" r="16"/>
        <rect x="172" y="342" width="8" height="30" rx="4"/>
        <circle cx="176" cy="334" r="11"/>
      </g>
    `),

    // cold & melancholy — snowy mountains
    snowMountains: () => wrap(`
      <rect width="${W}" height="${H}" fill="#dfe9f2"/>
      <circle cx="640" cy="90" r="30" fill="#f4f7fa" opacity=".9"/>
      <path d="M0 320 L160 130 L300 320 Z" fill="#8aa3bd"/>
      <path d="M160 130 L205 190 L185 200 L160 175 L135 200 L115 190 Z" fill="#f4f7fa"/>
      <path d="M240 320 L430 110 L620 320 Z" fill="#6e8aa8"/>
      <path d="M430 110 L485 185 L455 200 L430 165 L405 200 L378 185 Z" fill="#ffffff"/>
      <path d="M520 320 L660 180 L800 320 Z" fill="#8aa3bd"/>
      <rect x="0" y="318" width="${W}" height="132" fill="#eef3f8"/>
      <path d="M0 380 Q 200 360 400 380 T 800 375 L800 450 L0 450 Z" fill="#ffffff"/>
      <g fill="#3d5a75"><rect x="380" y="330" width="8" height="30"/><circle cx="384" cy="322" r="12"/></g>
    `),

    // urban night — neon city
    cityNight: () => wrap(`
      <rect width="${W}" height="${H}" fill="#0c1022"/>
      <circle cx="140" cy="80" r="28" fill="#f2e6b8" opacity=".9"/>
      <g fill="#141a33">
        <rect x="20" y="200" width="70" height="250"/><rect x="100" y="160" width="60" height="290"/>
        <rect x="170" y="230" width="80" height="220"/><rect x="260" y="130" width="70" height="320"/>
        <rect x="560" y="180" width="70" height="270"/><rect x="640" y="220" width="80" height="230"/>
        <rect x="730" y="150" width="60" height="300"/>
      </g>
      <g fill="#e8567a" opacity=".9">
        <rect x="118" y="180" width="10" height="6"/><rect x="136" y="196" width="10" height="6"/>
        <rect x="284" y="150" width="10" height="6"/><rect x="302" y="170" width="10" height="6"/>
      </g>
      <g fill="#4dd6c1" opacity=".85">
        <rect x="580" y="210" width="10" height="6"/><rect x="600" y="230" width="10" height="6"/>
        <rect x="744" y="180" width="10" height="6"/>
      </g>
      <g fill="#f2c14e" opacity=".8">
        <rect x="40" y="230" width="10" height="6"/><rect x="58" y="250" width="10" height="6"/>
        <rect x="660" y="250" width="10" height="6"/>
      </g>
      <rect x="0" y="430" width="${W}" height="20" fill="#080b16"/>
      <path d="M0 430 L800 430 L800 450 L0 450 Z" fill="#080b16"/>
      <path d="M380 450 L420 450 L410 415 L390 415 Z" fill="#1a2138"/>
    `),

    // rainy street — melancholy evening
    rainyStreet: () => wrap(`
      <rect width="${W}" height="${H}" fill="#2b3648"/>
      <circle cx="180" cy="100" r="34" fill="#c9d4e0" opacity=".35"/>
      <g fill="#1d2635">
        <rect x="40" y="170" width="120" height="280"/><rect x="180" y="210" width="100" height="240"/>
        <rect x="560" y="150" width="130" height="300"/><rect x="700" y="200" width="80" height="250"/>
      </g>
      <g fill="#e8c56e" opacity=".85">
        <rect x="70" y="200" width="16" height="20"/><rect x="110" y="260" width="16" height="20"/>
        <rect x="600" y="190" width="16" height="20"/><rect x="660" y="250" width="16" height="20"/>
        <rect x="724" y="240" width="14" height="18"/>
      </g>
      <rect x="0" y="430" width="${W}" height="20" fill="#151c28"/>
      <path d="M0 430 L800 430 L800 450 L0 450 Z" fill="#151c28"/>
      <ellipse cx="410" cy="436" rx="120" ry="8" fill="#e8c56e" opacity=".15"/>
      <g stroke="#9fb4cc" stroke-width="2" stroke-linecap="round" opacity=".5">
        <path d="M100 60 l-8 26"/><path d="M300 40 l-8 26"/><path d="M520 70 l-8 26"/><path d="M700 50 l-8 26"/>
        <path d="M200 120 l-8 26"/><path d="M620 130 l-8 26"/><path d="M420 100 l-8 26"/>
      </g>
      <g fill="#0f1620">
        <circle cx="410" cy="380" r="16"/><rect x="398" y="398" width="24" height="34" rx="8"/>
      </g>
    `),

    // hopeful dawn — meadow morning
    meadow: () => wrap(`
      <rect width="${W}" height="${H}" fill="#ffe9b8"/>
      <circle cx="400" cy="150" r="56" fill="#ffd166"/>
      <path d="M0 300 Q 200 250 400 290 T 800 280 L800 450 L0 450 Z" fill="#7ab661"/>
      <path d="M0 360 Q 300 320 600 362 T 800 350 L800 450 L0 450 Z" fill="#5c9a4a"/>
      <g fill="#f2f7e2">
        <circle cx="140" cy="330" r="9"/><circle cx="180" cy="344" r="7"/>
        <circle cx="600" cy="336" r="9"/><circle cx="640" cy="350" r="7"/>
        <circle cx="420" cy="326" r="8"/>
      </g>
      <g stroke="#3d6e33" stroke-width="4" stroke-linecap="round">
        <path d="M300 450 v-60"/><path d="M300 400 q-20 -14 -34 -12"/>
        <path d="M500 450 v-70"/><path d="M500 390 q18 -16 34 -14"/>
      </g>
    `),

    // futuristic winter — aurora towers
    futureWinter: () => wrap(`
      <rect width="${W}" height="${H}" fill="#0a1226"/>
      <g opacity=".7">
        <path d="M100 40 Q 300 140 500 40 Q 700 140 800 60 L800 90 Q 600 190 400 90 Q 200 190 100 90 Z" fill="#3ddad4" opacity=".35"/>
        <path d="M200 60 Q 400 160 600 60 L600 100 Q 400 200 200 100 Z" fill="#7c6ff0" opacity=".3"/>
      </g>
      <g fill="#e8f1f8">
        <circle cx="700" cy="80" r="24"/>
      </g>
      <g fill="#16223f">
        <path d="M180 450 L220 200 L260 450 Z"/><path d="M300 450 L360 140 L420 450 Z"/>
        <path d="M480 450 L510 240 L560 450 Z"/><path d="M620 450 L690 170 L760 450 Z"/>
      </g>
      <g fill="#4dd6c1" opacity=".8">
        <path d="M220 200 h8 v30 h-8 Z"/><path d="M360 140 h8 v40 h-8 Z"/><path d="M690 170 h8 v40 h-8 Z"/>
      </g>
      <rect x="0" y="400" width="${W}" height="50" fill="#dfe9f2"/>
      <path d="M0 415 Q 200 395 400 415 T 800 410 L800 450 L0 450 Z" fill="#f2f7fa"/>
    `)
  };

  window.UNRAVELLED_SCENES = scenes;
})();
