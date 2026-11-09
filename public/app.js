/* Unravelled — app logic. All durations, angles, names, orders in CONFIG. */
(function () {
  'use strict';
  const CONFIG = {
    PAGE_NAMES: ['scenery', 'era', 'character', 'movie', 'impression', 'finale'],
    BALL_SIZES: [1, 0.85, 0.68, 0.51, 0.34, 0.17, 0],
    BALL_ROTATE_DEG: 52,
    TRANSITION_MS: 900,
    PAGE_FADE_MS: 500,
    CAT_ENTER_MS: 900,
    CAT_LEAVE_STAGGER_MS: 600,
    CAT_LEAVE_MS: 1200,
    CAT_BACK_LANE_SCALE: 0.9,
    CATS: [
      { id: 'chertyaka', leaveDir: 'right' },
      { id: 'didyuka',  leaveDir: 'right' },
      { id: 'chernika', leaveDir: 'left'  },
      { id: 'ryzhik',   leaveDir: 'right', yawnFirst: true },
      { id: 'mysh',     leaveDir: 'left'  }
    ],
    LEAVE_ORDER: ['chernika', 'chertyaka', 'mysh', 'didyuka', 'ryzhik'],
    THREAD_COLOR: '#e8dfc8',
    DOCK_BASE_RATIO: 0.8
  };
  const $ = (s) => document.querySelector(s);
  const A = window.ART;
  const state = { lang: 'en', page: 0, playlistId: null, analysis: null, quote: null, cats: [] };

  /* ---------- toast ---------- */
  let toastTimer = null;
  function toast(msg) {
    const el = $('#toast'); el.textContent = msg; el.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('show'), 2400);
  }

  /* ---------- i18n ---------- */
  function detectLang() {
    const saved = localStorage.getItem('unravelled-lang');
    if (saved && window.I18N[saved]) return saved;
    const b = (navigator.language || 'en').slice(0, 2);
    return window.I18N[b] ? b : 'en';
  }
  const t = () => window.I18N[state.lang];
  function applyLang() {
    document.documentElement.lang = state.lang;
    const s = t();
    $('#linkInput').placeholder = s.placeholder;
    $('#unravelBtn').textContent = s.unravel;
    $('#nextBtn').textContent = s.next;
    $('#backBtn').textContent = s.back;
    $('#retryBtn').textContent = s.retry;
    $('#anotherBtn').textContent = s.another;
    $('#manualText').textContent = s.manual;
    $('#manualBtn').textContent = s.continue;
    $('#loadingLine').textContent = s.loading;
    $('#langBtn').textContent = state.lang.toUpperCase();
    document.querySelectorAll('.story .card-label').forEach((el, i) => { el.textContent = s[['pageScenery','pageEra','pageCharacter','pageMovie','pageImpression','finale'][i]]; });
    buildLangMenu(); renderDots();
    if (state.analysis) renderAllPages();
  }
  function buildLangMenu() {
    const m = $('#langMenu'); m.innerHTML = '';
    for (const l of window.LANGS) {
      const b = document.createElement('button');
      b.textContent = l.label;
      if (l.id === state.lang) b.classList.add('active');
      b.addEventListener('click', () => { state.lang = l.id; localStorage.setItem('unravelled-lang', l.id); m.hidden = true; applyLang(); });
      m.appendChild(b);
    }
  }
  $('#langBtn').addEventListener('click', () => { const m = $('#langMenu'); m.hidden = !m.hidden; $('#langBtn').setAttribute('aria-expanded', String(!m.hidden)); });
  document.addEventListener('click', (e) => { if (!e.target.closest('#langWrap')) $('#langMenu').hidden = true; });

  /* ---------- the ball of yarn (single element, demo SVG) ---------- */
  function ballSvg() {
    return `<svg viewBox="0 0 240 240" role="img" aria-label="ball of yarn">
      <defs>
        <clipPath id="ballClip"><circle cx="120" cy="104" r="54"/></clipPath>
        <radialGradient id="ballShade" cx="0.35" cy="0.3" r="0.95">
          <stop offset="0%" stop-color="#f2ead2"/><stop offset="100%" stop-color="#d3c096"/>
        </radialGradient>
      </defs>
      <g id="ballSpin">
        <circle cx="120" cy="104" r="54" fill="url(#ballShade)"/>
        <g clip-path="url(#ballClip)" stroke="#b9a67a" stroke-width="3" fill="none" opacity="0.85">
          <ellipse cx="120" cy="104" rx="54" ry="15"/>
          <ellipse cx="120" cy="104" rx="54" ry="28" transform="rotate(32 120 104)"/>
          <ellipse cx="120" cy="104" rx="54" ry="20" transform="rotate(-42 120 104)"/>
          <ellipse cx="120" cy="104" rx="48" ry="13" transform="rotate(74 120 104)"/>
          <ellipse cx="120" cy="104" rx="44" ry="10" transform="rotate(-14 120 104)"/>
        </g>
      </g>
      <g id="ballTail"><path d="M168 122 q 26 18 19 36 q -6 15 9 20" stroke="#e8dfc8" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="196" cy="178" r="7" fill="#e8dfc8"/></g>
    </svg>`;
  }
  const ball = document.createElement('div');
  ball.id = 'ball';
  ball.innerHTML = ballSvg();
  $('#frontBallSlot').appendChild(ball);
  function setBallScale(frac, animate) {
    const dock = ball.parentElement.id !== 'frontBallSlot';
    const target = (dock ? 104 : $('#frontBallSlot').clientWidth) * frac;
    ball.style.width = target + 'px'; ball.style.height = target + 'px';
    ball.style.position = dock ? '' : 'absolute';
    ball.style.left = dock ? '' : '50%'; ball.style.top = dock ? '' : '50%';
    ball.style.transform = dock ? `scale(${frac})` : `translate(-50%,-50%) scale(${frac})`;
    ball.style.transition = animate ? `transform ${CONFIG.TRANSITION_MS}ms ease, width ${CONFIG.TRANSITION_MS}ms ease, height ${CONFIG.TRANSITION_MS}ms ease` : 'none';
  }
  function rotateBall() {
    const g = ball.querySelector('#ballSpin');
    g.dataset.rot = (parseFloat(g.dataset.rot || '0') + CONFIG.BALL_ROTATE_DEG);
    g.style.transform = `rotate(${g.dataset.rot}deg)`;
  }
  function moveBallToDock() { // FLIP
    const from = ball.getBoundingClientRect(), to = $('#ballSlot').getBoundingClientRect();
    ball.style.position = 'fixed'; ball.style.zIndex = '35'; ball.style.margin = '0';
    ball.style.left = from.left + 'px'; ball.style.top = from.top + 'px';
    ball.style.width = from.width + 'px'; ball.style.height = from.height + 'px';
    ball.style.transform = 'none'; ball.style.transformOrigin = '50% 100%';
    requestAnimationFrame(() => {
      const s = (to.width * CONFIG.BALL_SIZES[1]) / from.width;
      ball.style.transition = `transform ${CONFIG.TRANSITION_MS}ms ease`;
      ball.style.transform = `translate(${to.left - from.left}px, ${to.top - from.top}px) scale(${s})`;
    });
    setTimeout(() => {
      ball.style.cssText = '';
      $('#ballSlot').appendChild(ball);
      setBallScale(CONFIG.BALL_SIZES[1], false);
    }, CONFIG.TRANSITION_MS + 30);
  }
  ball.querySelector('#ballTail').addEventListener('click', () => { if (state.page === 0) $('#unravelBtn').click(); });

  /* ---------- thread ---------- */
  const threadSvg = $('#threadSvg');
  function catSlots() {
    const row = $('#catRow').getBoundingClientRect();
    const vis = state.cats.filter(c => c.visible), n = Math.max(1, vis.length);
    const step = Math.min(110, row.width / Math.max(n, 1)) * 0.92;
    return vis.map((c, i) => ({ x: row.left + row.width - (n - i) * step + 16, y: row.bottom - 12 }));
  }
  function threadPathFor(page) {
    const dock = $('#dock').getBoundingClientRect();
    const ballW = $('#ballSlot').clientWidth * parseFloat(ball.dataset.scale || '1');
    const x0 = 14 + ballW + 6, y0 = dock.height * CONFIG.DOCK_BASE_RATIO;
    const slots = catSlots();
    if (page <= 0 || !slots.length) return `M ${x0} ${y0} L ${x0 + 8} ${y0}`;
    let d = `M ${x0} ${y0}`;
    for (let i = 0; i < Math.min(page, slots.length); i++) {
      const s = slots[i], px = i === 0 ? x0 : slots[i - 1].x;
      d += ` Q ${A.F((px + s.x) / 2)} ${A.F(y0 + 12 + (i % 2) * 5)} ${A.F(s.x)} ${A.F(s.y - 4)} q 9 -9 18 -2 q -8 8 -15 4`;
    }
    return d;
  }
  function pilePath() {
    const dock = $('#dock').getBoundingClientRect();
    const cx = 14 + 52, cy = dock.height * CONFIG.DOCK_BASE_RATIO;
    let d = `M ${A.F(cx - 26)} ${A.F(cy + 6)}`;
    for (let i = 0; i < 7; i++) d += ` c ${16 + (i % 3) * 8} ${-16 - (i % 2) * 10} ${28 + (i % 2) * 10} 4 ${7 + (i % 3) * 6} ${9 + (i % 2) * 6}`;
    return d;
  }
  function drawThread(page, animate) {
    const d = page === 6 ? pilePath() : threadPathFor(page);
    threadSvg.setAttribute('viewBox', `0 0 ${$('#dock').clientWidth} ${$('#dock').clientHeight}`);
    threadSvg.innerHTML = `<path id="threadPath" d="${d}" fill="none" stroke="${CONFIG.THREAD_COLOR}" stroke-width="3.4" stroke-linecap="round"/>`;
    const p = threadSvg.querySelector('#threadPath');
    const len = p.getTotalLength();
    p.style.strokeDasharray = String(len);
    p.style.strokeDashoffset = animate ? String(len) : '0';
    if (animate) requestAnimationFrame(() => requestAnimationFrame(() => {
      p.style.transition = `stroke-dashoffset ${CONFIG.TRANSITION_MS}ms ease-in-out`;
      p.style.strokeDashoffset = '0';
    }));
    positionCats(); updatePupils();
  }

  /* ---------- cats ---------- */
  function ensureCat(i) {
    if (state.cats[i] && state.cats[i].el) return state.cats[i];
    const cfg = CONFIG.CATS[i];
    const el = document.createElement('div');
    el.className = 'cat'; el.dataset.id = cfg.id;
    el.style.setProperty('--tail-speed', (2.6 + i * 0.55) + 's');
    el.style.setProperty('--blink-every', (3 + i * 0.7) + 's');
    el.style.setProperty('--ear-every', (5.5 + i * 1.1) + 's');
    el.innerHTML = A.cats.render(cfg.id) + `<span class="name">${(A.cats.NAMES[cfg.id][state.lang] || A.cats.NAMES[cfg.id].en)}</span>`;
    el.addEventListener('click', () => { const n = el.querySelector('.name'); n.style.opacity = n.style.opacity === '1' ? '0' : '1'; });
    $('#catRow').appendChild(el);
    state.cats[i] = { ...cfg, el, visible: false };
    return state.cats[i];
  }
  function positionCats() {
    const row = $('#catRow').getBoundingClientRect();
    catSlots().forEach((s, i) => {
      const c = state.cats.filter(c => c.visible)[i];
      if (c && c.el) { c.el.style.left = (s.x - row.left - c.el.clientWidth / 2) + 'px'; c.el.style.opacity = '1'; }
    });
  }
  function enterCat(i) {
    const c = ensureCat(i);
    if (c.visible) return;
    c.visible = true;
    c.el.style.transform = 'translateX(60vw)'; c.el.style.opacity = '0';
    requestAnimationFrame(() => requestAnimationFrame(() => {
      c.el.style.transition = `transform ${CONFIG.CAT_ENTER_MS}ms ease, opacity ${CONFIG.CAT_ENTER_MS}ms ease`;
      c.el.style.transform = 'translateX(0)'; c.el.style.opacity = '1';
    }));
    setTimeout(positionCats, CONFIG.CAT_ENTER_MS + 50);
  }
  function updatePupils() {
    const tipX = 14 + $('#ballSlot').clientWidth * parseFloat(ball.dataset.scale || '1') + 6;
    document.querySelectorAll('.cat .eye').forEach((eye) => {
      const r = eye.getBoundingClientRect();
      eye.querySelector('.pupil').style.transform = `translateX(${Math.max(-4, Math.min(4, (tipX - (r.left + r.width / 2)) / 30))}px)`;
    });
  }
  function leaveAllCats(done) {
    const rowW = $('#catRow').clientWidth;
    CONFIG.LEAVE_ORDER.forEach((id, idx) => {
      const c = state.cats.find(c => c && c.id === id);
      if (!c) return;
      setTimeout(() => {
        const backLane = c.leaveDir === 'left';
        c.el.classList.add('leaving');
        if (backLane) c.el.classList.add('back-lane');
        setTimeout(() => {
          c.el.style.transition = `transform ${CONFIG.CAT_LEAVE_MS}ms linear, opacity ${CONFIG.CAT_LEAVE_MS}ms linear`;
          const shift = c.leaveDir === 'left' ? -(rowW + 160) : rowW + 160;
          c.el.style.transform = `translateX(${shift}px) scale(${backLane ? CONFIG.CAT_BACK_LANE_SCALE : 1}) translateY(${backLane ? -24 : 0}px)`;
          c.el.style.opacity = '0.9';
        }, c.yawnFirst ? 700 : 0);
      }, idx * CONFIG.CAT_LEAVE_STAGGER_MS);
    });
    setTimeout(done, CONFIG.LEAVE_ORDER.length * CONFIG.CAT_LEAVE_STAGGER_MS + CONFIG.CAT_LEAVE_MS + 200);
  }

  /* ---------- pages ---------- */
  function renderDots() {
    const d = $('#dots'); d.innerHTML = '';
    if (state.page === 0) return;
    const names = ['pageScenery', 'pageEra', 'pageCharacter', 'pageMovie', 'pageImpression', 'finale'];
    for (let i = 1; i <= 6; i++) {
      const b = document.createElement('button');
      b.className = 'dot' + (i === state.page ? ' current' : '');
      b.setAttribute('aria-label', t()[names[i - 1]] || String(i));
      b.addEventListener('click', () => goTo(i));
      d.appendChild(b);
    }
  }
  function goTo(page) {
    if (page < 1 || page > 6 || page === state.page) return;
    document.querySelectorAll('.screen').forEach(p => p.classList.remove('active'));
    state.page = page;
    $('#page' + page).classList.add('active');
    $('#controls').style.visibility = 'visible';
    $('#backBtn').disabled = page === 1;
    $('#nextBtn').style.display = page === 6 ? 'none' : '';
    renderDots(); setBallScale(CONFIG.BALL_SIZES[page], true); rotateBall();
    for (let i = 0; i < Math.min(page, 5); i++) enterCat(i);
    drawThread(page, true);
    if (page === 6) leaveAllCats(() => {});
    updatePupils();
  }
  $('#nextBtn').addEventListener('click', () => goTo(state.page + 1));
  $('#backBtn').addEventListener('click', () => goTo(state.page - 1));
  $('#anotherBtn').addEventListener('click', resetToFront);
  function resetToFront() {
    state.page = 0; state.analysis = null; state.playlistId = null;
    document.querySelectorAll('.screen').forEach(p => p.classList.remove('active'));
    $('#frontPage').classList.add('active');
    $('#controls').style.visibility = 'hidden';
    $('#manualWrap').hidden = $('#frontError').hidden = $('#loadingLine').hidden = true;
    $('#linkInput').value = '';
    state.cats.forEach(c => c && c.el && c.el.remove());
    state.cats = [];
    ball.dataset.scale = '1';
    $('#frontBallSlot').appendChild(ball);
    setBallScale(1, false);
    const g = ball.querySelector('#ballSpin'); g.dataset.rot = '0'; g.style.transform = 'rotate(0deg)';
    threadSvg.innerHTML = '';
    renderDots();
  }

  /* ---------- render analysis ---------- */
  const seedFor = (name) => (state.playlistId || 'manual') + ':' + name;
  function renderAllPages() {
    const a = state.analysis, s = t(), q = state.quote;
    $('#page1 .art').innerHTML = A.scenes[a.scene](seedFor('scenery'), a.palette, a.time_of_day, a.weather);
    $('#page1 .scene-title').textContent = a.scene_title;
    $('#page1 .quote').textContent = q && q.line ? '“' + q.line + '”' : (q ? q.song + ' — ' + q.artist : '');
    $('#page1 .quote-attr').textContent = q && q.line ? q.song + ' — ' + q.artist : '';
    $('#page2 .art').innerHTML = A.icons.render(a.era.icon, a.era.backdrop, seedFor('era'), a.palette);
    $('#page2 .scene-title').textContent = a.era.name;
    $('#page2 .era-season').textContent = a.era.season;
    $('#page2 .era-feel').textContent = a.era.feel;
    $('#page3 .art').innerHTML = A.figures.render(a.character.look, seedFor('character'), a.palette);
    $('#page3 .twin-name').textContent = a.character.name;
    $('#page3 .src').textContent = a.character.source;
    $('#page3 .why').textContent = a.character.why;
    $('#page4 .art').innerHTML = A.posters.render(a.movie.art, seedFor('movie'), a.palette, a.movie.art.time_of_day);
    $('#page4 .twin-name').textContent = a.movie.title + (a.movie.year ? ' (' + a.movie.year + ')' : '');
    $('#page4 .why').textContent = a.movie.why;
    $('#page5 .art').innerHTML = A.activities.render(a.activity.scene_id, seedFor('impression'), a.palette, a.activity.time_of_day);
    $('#page5 .twin-name').textContent = a.activity.title;
    $('#page5 .why').textContent = a.activity.why;
    $('#page6 .scene-title').textContent = s.finale;
  }

  /* ---------- API flow ---------- */
  const extractId = (link) => (String(link).match(/open\.spotify\.com\/playlist\/([A-Za-z0-9]+)/) || String(link).match(/spotify:playlist:([A-Za-z0-9]+)/) || [])[1] || null;
  function hashText(txt) {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < txt.length; i++) { h ^= txt.charCodeAt(i); h = Math.imul(h, 16777619); }
    return 'manual-' + (h >>> 0).toString(36);
  }
  const parseManual = (text) => text.split('\n').map(l => l.trim()).filter(Boolean).map(l => {
    const p = l.split(/\s+[–—-]\s+/);
    return p.length >= 2 ? { artist: p[0].trim(), title: p.slice(1).join(' – ').trim() } : { artist: '', title: l };
  }).filter(x => x.title);
  async function startWithTracks(playlistId, tracks) {
    state.playlistId = playlistId;
    $('#loadingLine').hidden = false; $('#unravelBtn').disabled = true;
    moveBallToDock(); drawThread(1, true); rotateBall();
    try {
      const res = await fetch('/api/analyze', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tracks: tracks.slice(0, 100), lang: state.lang }) });
      const data = await res.json();
      if (!res.ok || !data.analysis) throw new Error('analyze failed');
      state.analysis = data.analysis;
      state.quote = await fetchQuote(data.analysis.quote_candidates || []);
      renderAllPages();
      document.querySelectorAll('.screen').forEach(p => p.classList.remove('active'));
      state.page = 1;
      $('#page1').classList.add('active');
      $('#controls').style.visibility = 'visible';
      $('#backBtn').disabled = true; $('#nextBtn').style.display = '';
      renderDots(); setBallScale(CONFIG.BALL_SIZES[1], false);
      enterCat(0); drawThread(1, false);
    } catch (e) {
      resetToFront();
      $('#frontErrorText').textContent = t().error;
      $('#frontError').hidden = false;
    } finally {
      $('#loadingLine').hidden = true; $('#unravelBtn').disabled = false;
    }
  }
  async function fetchQuote(candidates) {
    for (const c of candidates.slice(0, 3)) {
      try {
        const r = await fetch('/api/quote?artist=' + encodeURIComponent(c.artist) + '&title=' + encodeURIComponent(c.song));
        const j = await r.json();
        if (r.ok && j.line) return { line: j.line, song: c.song, artist: c.artist };
      } catch (e) { /* next candidate */ }
    }
    const c = candidates[0];
    return c ? { line: '', song: c.song, artist: c.artist } : null;
  }
  $('#unravelBtn').addEventListener('click', async () => {
    const link = $('#linkInput').value.trim();
    const id = extractId(link);
    $('#frontError').hidden = true; $('#manualWrap').hidden = true;
    if (!id) { $('#frontErrorText').textContent = t().invalidLink; $('#frontError').hidden = false; return; }
    $('#loadingLine').hidden = false;
    try {
      const r = await fetch('/api/playlist', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ link }) });
      const j = await r.json();
      if (r.ok && j.tracks && j.tracks.length >= 5) { await startWithTracks(j.playlistId, j.tracks); return; }
    } catch (err) { /* fall through to manual */ }
    $('#manualWrap').hidden = false; $('#loadingLine').hidden = true;
  });
  $('#manualBtn').addEventListener('click', () => {
    const tracks = parseManual($('#manualInput').value);
    if (!tracks.length) return;
    $('#manualWrap').hidden = true;
    startWithTracks(hashText($('#manualInput').value), tracks);
  });
  $('#retryBtn').addEventListener('click', () => { $('#frontError').hidden = true; $('#unravelBtn').click(); });
  window.addEventListener('resize', () => { if (state.page > 0) drawThread(state.page, false); });

  state.lang = detectLang();
  applyLang();
  $('#controls').style.visibility = 'hidden';
  setBallScale(1, false);
})();
