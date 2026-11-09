/* Unravelled — the five dock cats (spec section 9). Flat silhouettes with
   rim light so dark cats read on the dark green dock; eyes always visible.
   Animation hooks: .tail (swish), .lid (blink), .ear (twitch), .pupil (follow). */
(function () {
  const A = window.ART;
  const VB = '0 0 220 200';
  const EYE = { yg: '#c9d64b', yo: '#f0a832' };

  function catBase(d, p, fur, rim) {
    // sitting cat silhouette: body + head + ears, facing left-ish
    d.add(`<g>
      <path class="body" d="M 60 190 Q 52 120 78 92 Q 70 70 84 52 L 96 30 L 112 48 Q 130 44 142 58 L 158 34 L 164 62 Q 178 84 168 110 Q 186 140 176 190 Z" fill="${fur}"/>
      <path class="rim" d="M 84 52 L 96 30 L 112 48 Q 130 44 142 58" fill="none" stroke="${rim}" stroke-width="4" stroke-linecap="round" opacity="0.9"/>
      <path class="rim" d="M 78 92 Q 70 70 84 52" fill="none" stroke="${rim}" stroke-width="3.4" stroke-linecap="round" opacity="0.7"/>
    </g>`);
  }
  function eyes(d, cx, cy, dx, col, sleepy) {
    const h = sleepy ? 3.4 : 8;
    for (const s of [-1, 1]) {
      d.add(`<g class="eye" transform="translate(${A.fmt(cx + s * dx)} ${A.fmt(cy)})">
        <ellipse class="pupil" rx="7" ry="${h}" fill="${col}"/>
        <ellipse class="lid" rx="8" ry="${h + 1}" fill="#0b3d2e" style="transform:scaleY(0);transform-origin:center;transform-box:fill-box"/>
        <circle cx="2.4" cy="${-h / 3}" r="1.7" fill="#ffffff" opacity="0.9"/>
      </g>`);
    }
  }
  function tail(d, x, y, col, rim, plume) {
    const w = plume ? 16 : 9;
    d.add(`<g class="tail" style="transform-origin:${x}px ${y}px;transform-box:view-box">
      <path d="M ${x} ${y} Q ${x + 52} ${y - 6} ${x + 66} ${y - 52}" stroke="${col}" stroke-width="${w}" fill="none" stroke-linecap="round"/>
      ${plume ? `<path d="M ${x + 66} ${y - 52} q 16 -10 20 6 q -14 8 -20 -6 Z" fill="${col}"/>` : `<circle cx="${x + 66}" cy="${y - 52}" r="${w / 1.6}" fill="${col}"/>`}
      <path d="M ${x + 8} ${y - 4} Q ${x + 52} ${y - 8} ${x + 64} ${y - 48}" stroke="${rim}" stroke-width="2.4" fill="none" stroke-linecap="round" opacity="0.8"/>
    </g>`);
  }

  const CATS = {
    chertyaka: (d, p) => {
      catBase(d, p, '#151210', '#8fbf8a');
      d.add(`<path d="M 96 190 Q 100 150 118 138 Q 136 152 138 190 Z" fill="#f2efe4" opacity="0.95"/>`); // chest patch
      eyes(d, 121, 84, 15, EYE.yg, false);
      tail(d, 168, 186, '#151210', '#8fbf8a', false);
    },
    didyuka: (d, p) => {
      catBase(d, p, '#0f0d0b', '#9fd0ff');
      d.add(`<path d="M 60 190 Q 56 132 76 96 Q 70 72 84 54" fill="none" stroke="#0f0d0b" stroke-width="0"/>`);
      d.add(`<path d="M 66 190 Q 60 128 80 94" stroke="#0f0d0b" stroke-width="26" fill="none" stroke-linecap="round" opacity="0"/>`);
      eyes(d, 121, 84, 14, EYE.yg, false);
      tail(d, 166, 188, '#0f0d0b', '#9fd0ff', false);
    },
    chernika: (d, p) => {
      catBase(d, p, '#1a1613', '#e8b23a');
      d.add(`<path d="M 92 190 Q 94 140 120 128 Q 146 142 146 190 Z" fill="#241f1a"/><circle cx="112" cy="160" r="16" fill="#241f1a"/><circle cx="130" cy="168" r="13" fill="#241f1a"/>`); // fluffy chest
      d.add(`<circle class="ear" cx="98" cy="34" r="4" fill="#1a1613"/><circle class="ear" cx="156" cy="38" r="4" fill="#1a1613"/>`);
      eyes(d, 121, 82, 16, EYE.yg, false);
      tail(d, 170, 184, '#1a1613', '#e8b23a', true);
    },
    ryzhik: (d, p) => {
      d.add(`<g><path class="body" d="M 52 190 Q 40 118 82 92 Q 74 68 88 50 L 100 28 L 114 46 Q 132 42 144 56 L 160 32 L 166 60 Q 182 86 172 116 Q 196 148 184 190 Z" fill="#d98e4a"/>
      <path class="rim" d="M 88 50 L 100 28 L 114 46 Q 132 42 144 56" fill="none" stroke="#ffe1b0" stroke-width="4" stroke-linecap="round" opacity="0.9"/></g>`);
      for (let i = 0; i < 4; i++) d.add(`<path d="M ${A.fmt(84 + i * 22)} ${A.fmt(120 + (i % 2) * 8)} q 8 14 0 26" stroke="#a05a20" stroke-width="5" fill="none" opacity="0.8"/>`); // stripes
      d.add(`<path d="M 96 44 l 6 -10 M 108 42 l 2 -12 M 120 42 l -2 -12 M 132 44 l -6 -10" stroke="#a05a20" stroke-width="4"/>`);
      eyes(d, 121, 84, 15, EYE.yg, true);
      tail(d, 176, 188, '#d98e4a', '#ffe1b0', false);
    },
    mysh: (d, p) => {
      d.add(`<g><path class="body" d="M 62 190 Q 50 122 80 94 Q 72 70 86 52 L 98 32 L 112 50 Q 130 46 142 60 L 158 36 L 164 64 Q 176 86 166 112 Q 184 142 174 190 Z" fill="#8fa3b8"/>
      <path class="rim" d="M 86 52 L 98 32 L 112 50 Q 130 46 142 60" fill="none" stroke="#e8f2ff" stroke-width="4" stroke-linecap="round" opacity="0.95"/>
      <circle cx="121" cy="86" r="52" fill="#8fa3b8" opacity="0"/></g>`);
      d.add(`<ellipse cx="121" cy="88" rx="46" ry="40" fill="#93a9bf"/>`); // round face
      eyes(d, 121, 86, 17, EYE.yo, false);
      d.add(`<path d="M 116 108 L 126 108 L 121 116 Z" fill="#5d7186"/>`);
      tail(d, 166, 186, '#8fa3b8', '#e8f2ff', false);
    }
  };
  const ORDER = ['chertyaka', 'didyuka', 'chernika', 'ryzhik', 'mysh'];
  const NAMES = { chertyaka: { ru: 'Чертяка', be: 'Чертяка', en: 'Chertyaka', fr: 'Chertyaka' }, didyuka: { ru: 'Дидюка', be: 'Дзідюка', en: 'Didyuka', fr: 'Didyuka' }, chernika: { ru: 'Черника', be: 'Чарніца', en: 'Chernika', fr: 'Chernika' }, ryzhik: { ru: 'Рыжик', be: 'Рыжык', en: 'Ryzhik', fr: 'Ryzhik' }, mysh: { ru: 'Мышь', be: 'Мыш', en: 'Mysh', fr: 'Mysh' } };

  function render(id) {
    const d = A.doc(220, 200, 'cat' + id + '_');
    (CATS[id] || CATS.chertyaka)(d, d.p);
    return d.render(VB, 'role="img" aria-hidden="true" class="cat-svg"');
  }
  window.ART.cats = { render, ORDER, NAMES };
})();
