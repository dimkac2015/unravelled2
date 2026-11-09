/* Unravelled — app logic. All durations, angles, names, orders in CONFIG. */
(function () {
  'use strict';
  const CONFIG = {
    PAGE_NAMES: ['scenery', 'era', 'character', 'movie', 'impression', 'finale'],
    BALL_SIZES: [1, 0.85, 0.68, 0.51, 0.34, 0.17, 0], // front, pages 1..6
    BALL_ROTATE_DEG: 52,          // clockwise per page change
    TRANSITION_MS: 900,           // ball move / thread draw / rotation
    PAGE_FADE_MS: 500,
    CAT_ENTER_MS: 900,
    CAT_LEAVE_STAGGER_MS: 600,    // cats leave one by one
    CAT_LEAVE_MS: 1200,           // each walks off-screen
    CAT_BACK_LANE_SCALE: 0.9,
    CATS: [
      { id: 'chertyaka', leaveDir: 'right' },
      { id: 'didyuka',  leaveDir: 'right' },
      { id: 'chernika', leaveDir: 'left'  },
      { id: 'ryzhik',   leaveDir: 'right', yawnFirst: true },
      { id: 'mysh',     leaveDir: 'left'  }
    ],
    // finale leave order per spec: Chernika L, Chertyaka R, Mysh L, Didyuka R, Ryzhik R
    LEAVE_ORDER: ['chernika', 'chertyaka', 'mysh', 'didyuka', 'ryzhik'],
    THREAD_COLOR: '#e8dfc8',
    DOCK_BASE_RATIO: 0.82
  };
  const $ = (s) => document.querySelector(s);
  const A = window.ART, L = window.ART_LISTS;
  const state = { lang: 'en', page: 0, playlistId: null, analysis: null, quote: null, tracks: null, cats: [], threadLen: 0 };

  /* ---------- i18n ---------- */
  function detectLang() {
    const saved = localStorage.getItem('unravelled-lang');
    if (saved && window.I18N[saved]) return saved;
    const b = (navigator.language || 'en').slice(0, 2);
    return window.I18N[b] ? b : 'en';
  }
  function t() { return window.I18N[state.lang]; }
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
    buildLangMenu();
    renderDots();
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
  $('#langBtn').addEventListener('click', () => {
    const m = $('#langMenu'); m.hidden = !m.hidden;
    $('#langBtn').setAttribute('aria-expanded', String(!m.hidden));
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#langWrap')) $('#langMenu').hidden = true;
  });

  /* ---------- ball of yarn (single element) ---------- */
  function ballSvg() {
    const strands = [];
    for (let i = 0; i < 9; i++) {
      const y = 14 + i * 9.5, rx = Math.sqrt(Math.max(0, 80 * 80 - (y - 50) * (y - 50)));
      strands.push(`<path d="M ${50 - rx} ${y} Q 50 ${y + 10} ${50 + rx} ${y}" fill="none" stroke="rgba(11,61,46,0.35)" stroke-width="3"/>`);
    }
    return `<svg viewBox="0 0 100 100"><g id="ballSpin"><circle cx="50" cy="50" r="46" fill="#e8dfc8"/>${strands.join('')}<circle cx="50" cy="50" r="46" fill="none" stroke="rgba(11,61,46,0.4)" stroke-width="2"/></g></svg>`;
  }
  const ball = document.createElement('div');
  ball.id = 'ball';
  ball.innerHTML = ballSvg();
  $('#frontBallSlot').appendChild(ball);
  function setBallScale(frac, animate) {
    const slot = ball.parentElement, dock = slot.id !== 'frontBallSlot';
    const target = (dock ? 110 : slot.clientWidth) * frac;
    ball.style.width = target + 'px'; ball.style.height = target + 'px';
    ball.style.position = dock ? '' : 'absolute';
    ball.style.left = dock ? '' : '50%'; ball.style.top = dock ? '' : '50%';
    ball.style.transform = dock ? `scale(${frac})` : `translate(-50%,-50%) scale(${frac})`;
    ball.style.transition = animate ? `transform ${CONFIG.TRANSITION_MS}ms ease, width ${CONFIG.TRANSITION_MS}ms ease, height ${CONFIG.TRANSITION_MS}ms ease` : 'none';
  }
  function rotateBall() {
    const g = ball.querySelector('#ballSpin');
    const cur = parseFloat(g.dataset.rot || '0');
    g.dataset.rot = cur + CONFIG.BALL_ROTATE_DEG;
    g.style.transform = `rotate(${cur + CONFIG.BALL_ROTATE_DEG}deg)`;
  }
  function moveBallToDock() { // FLIP: measure, fix, animate, re-parent
    const from = ball.getBoundingClientRect(), to = $('#ballSlot').getBoundingClientRect();
    const curScale = parseFloat(ball.dataset.scale || '1');
    ball.dataset.scale = String(CONFIG.BALL_SIZES[1]);
    ball.style.position = 'fixed'; ball.style.zIndex = '35';
    ball.style.left = from.left + 'px'; ball.style.top = from.top + 'px';
    ball.style.width = from.width + 'px'; ball.style.height = from.height + 'px';
    ball.style.transform = 'none'; ball.style.margin = '0';
    requestAnimationFrame(() => {
      const dx = to.left - from.left, dy = to.top - from.top;
      const s = (to.width * CONFIG.BALL_SIZES[1]) / from.width;
      ball.style.transition = `transform ${CONFIG.TRANSITION_MS}ms ease`;
      ball.style.transform = `translate(${dx}px, ${dy}px) scale(${s})`;
      ball.style.transformOrigin = '50% 100%';
    });
    setTimeout(() => {
      ball.style.cssText = '';
      $('#ballSlot').appendChild(ball);
      setBallScale(CONFIG.BALL_SIZES[1], false);
    }, CONFIG.TRANSITION_MS + 30);
  }

  /* ---------- thread ---------- */
  const threadSvg = $('#threadSvg');
  function catSlots() {
    const row = $('#catRow').getBoundingClientRect();
    const vis = state.cats.filter(c => c.visible), n = Math.max(1, vis.length);
    const step = Math.min(120, row.width / Math.max(n, 1)) * 0.92;
    return vis.map((c, i) => ({ x: row.left + row.width - (n - i) * step + 20, y: row.bottom - 14 }));
  }
  function threadPathFor(page) {
    const dock = $('#dock').getBoundingClientRect();
    const svgW = dock.width, svgH = dock.height;
    const ballR = ($('#ballSlot').clientWidth * parseFloat(ball.dataset.scale || '1')) / 2;
    const x0 = 12 + ballR * 2 + 4, y0 = svgH * CONFIG.DOCK_BASE_RATIO;
    const slots = catSlots();
    if (page <= 0 || slots.length === 0) return `M ${x0} ${y0} L ${x0 + 10} ${y0}`;
    let d = `M ${x0} ${y0}`;
    const upto = Math.min(page, slots.length);
    for (let i = 0; i < upto; i++) {
      const s = slots[i], prevX = i === 0 ? x0 : slots[i - 1].x;
      const midX = (prevX + s.x) / 2, sag = 12 + (i % 2) * 5;
      d += ` Q ${midX} ${y0 + sag} ${s.x} ${s.y - 6}`;       // sag between cats
      d += ` q 10 -10 20 -2 q -8 8 -16 4`;                  // small loop around front paws
    }
    return d;
  }
  function pilePath() {
    const dock = $('#dock').getBoundingClientRect();
    const cx = 12 + 55, cy = dock.height * CONFIG.DOCK_BASE_RATIO;
    let d = `M ${cx - 30} ${cy + 8}`;
    for (let i = 0; i < 7; i++) d += ` c ${18 + (i % 3) * 8} ${-16 - (i % 2) * 10} ${30 + (i % 2) * 10} ${6} ${8 + (i % 3) * 6} ${10 + (i % 2) * 6}`;
    return d;
  }
  function drawThread(page, animate) {
    const d = page === 6 ? pilePath() : threadPathFor(page);
    threadSvg.setAttribute('viewBox', `0 0 ${$('#dock').clientWidth} ${$('#dock').clientHeight}`);
    threadSvg.innerHTML = `<path id="threadPath" d="${d}" fill="none" stroke="${CONFIG.THREAD_COLOR}" stroke-width="3.4" stroke-linecap="round"/>`;
    const p = threadSvg.querySelector('#threadPath');
    const len = p.getTotalLength();
    state.threadLen = len;
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
    el.className = 'cat';
    el.dataset.id = cfg.id;
    el.style.setProperty('--tail-speed', (2.6 + i * 0.55) + 's');
    el.style.setProperty('--blink-every', (3 + i * 0.7) + 's');
    el.style.setProperty('--ear-every', (5.5 + i * 1.1) + 's');
    el.innerHTML = A.cats.render(cfg.id) + `<span class="name">${(A.cats.NAMES[cfg.id][state.lang] || A.cats.NAMES[cfg.id].en)}</span>`;
    el.addEventListener('click', () => {
      const n = el.querySelector('.name');
      n.style.opacity = n.style.opacity === '1' ? '0' : '1';
    });
    $('#catRow').appendChild(el);
    state.cats[i] = { ...cfg, el, visible: false };
    return state.cats[i];
  }
  function positionCats() {
    const slots = catSlots();
    state.cats.forEach((c, i) => {
      if (!c.el) return;
      if (c.visible && slots[i]) {
        c.el.style.left = (slots[i].x - $('#catRow').getBoundingClientRect().left - c.el.clientWidth / 2) + 'px';
        c.el.style.opacity = '1';
      }
    });
  }
  function enterCat(i) {
    const c = ensureCat(i);
    if (c.visible) return;
    c.visible = true;
    c.el.style.transform = 'translateX(60vw)';
    c.el.style.opacity = '0';
    requestAnimationFrame(() => requestAnimationFrame(() => {
      c.el.style.transition = `transform ${CONFIG.CAT_ENTER_MS}ms ease, opacity ${CONFIG.CAT_ENTER_MS}ms ease`;
      c.el.style.transform = 'translateX(0)';
      c.el.style.opacity = '1';
    }));
    setTimeout(positionCats, CONFIG.CAT_ENTER_MS + 50);
  }
  function updatePupils() {
    const tipX = 12 + ($('#ballSlot').clientWidth * parseFloat(ball.dataset.scale || '1')) + 6;
    document.querySelectorAll('.cat .eye').forEach((eye) => {
      const r = eye.getBoundingClientRect();
      const dx = Math.max(-4, Math.min(4, (tipX - (r.left + r.width / 2)) / 30));
      eye.querySelector('.pupil').style.transform = `translateX(${dx}px)`;
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
          c.el.style.transform = `translateX(${shift}px) scale(${backLane ? CONFIG.CAT_BACK_LANE_SCALE : 1}) translateY(${backLane ? -26 : 0}px)`;
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
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
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
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
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

  /* ---------- rendering analysis into pages ---------- */
  function seedFor(name) { return (state.playlistId || 'manual') + ':' + name; }
  function renderAllPages() {
    const a = state.analysis, s = t();
    $('#page1 .art').innerHTML = A.scenes[a.scene](seedFor('scenery'), a.palette, a.time_of_day, a.weather);
    $('#page1 .art-title').textContent = a.scene_title;
    const q = state.quote;
    $('#page1 .quote').textContent = q && q.line ? '“' + q.line + '”' : (q ? q.song + ' — ' + q.artist : '');
    $('#page1 .quote-attr').textContent = q && q.line ? q.song + ' — ' + q.artist : '';
    $('#page2 .art').innerHTML = A.icons.render(a.era.icon, a.era.backdrop, seedFor('era'), a.palette);
    $('#page2 .art-title').textContent = a.era.name;
    $('#page2 .era-season').textContent = a.era.season;
    $('#page2 .era-feel').textContent = a.era.feel;
    $('#page3 .art').innerHTML = A.figures.render(a.character.look, seedFor('character'), a.palette, a.character.look.background);
    $('#page3 .art-title').textContent = a.character.name;
    $('#page3 .src').textContent = a.character.source;
    $('#page3 .why').textContent = a.character.why;
    $('#page4 .art').innerHTML = A.posters.render(a.movie.art, seedFor('movie'), a.palette, a.movie.art.time_of_day);
    $('#page4 .art-title').textContent = a.movie.title + (a.movie.year ? ' (' + a.movie.year + ')' : '');
    $('#page4 .why').textContent = a.movie.why;
    $('#page5 .art').innerHTML = A.activities.render(a.activity.scene_id, seedFor('impression'), a.palette, a.activity.time_of_day);
    $('#page5 .art-title').textContent = a.activity.title;
    $('#page5 .why').textContent = a.activity.why;
    $('#page6 .art-title').textContent = s.finale;
  }

  /* ---------- API flow ---------- */
  function extractId(link) {
    let m = link.match(/open\.spotify\.com\/playlist\/([A-Za-z0-9]+)/);
    if (m) return m[1];
    m = link.match(/spotify:playlist:([A-Za-z0-9]+)/);
    if (m) return m[1];
    return null;
  }
  function hashText(txt) {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < txt.length; i++) { h ^= txt.charCodeAt(i); h = Math.imul(h, 16777619); }
    return 'manual-' + (h >>> 0).toString(36);
  }
  function parseManual(text) {
    return text.split('\n').map(l => l.trim()).filter(Boolean).map(l => {
      const parts = l.split(/\s+[–—-]\s+/);
      return parts.length >= 2 ? { artist: parts[0].trim(), title: parts.slice(1).join(' – ').trim() } : { artist: '', title: l };
    }).filter(x => x.title);
  }
  async function startWithTracks(playlistId, tracks) {
    state.playlistId = playlistId; state.tracks = tracks;
    $('#loadingLine').hidden = false; $('#loadingLine').textContent = t().loading;
    $('#unravelBtn').disabled = true;
    moveBallToDock(); drawThread(1, true);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tracks: tracks.slice(0, 100), lang: state.lang })
      });
      const data = await res.json();
      if (!res.ok || !data.analysis) throw new Error(data.error || 'analyze failed');
      state.analysis = data.analysis;
      state.quote = await fetchQuote(data.analysis.quote_candidates || []);
      renderAllPages();
      document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
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
      $('#loadingLine').hidden = true;
      $('#unravelBtn').disabled = false;
    }
  }
  async function fetchQuote(candidates) {
    for (const c of candidates.slice(0, 3)) {
      try {
        const r = await fetch('/api/quote?artist=' + encodeURIComponent(c.artist) + '&title=' + encodeURIComponent(c.song));
        const j = await r.json();
        if (r.ok && j.line) return { line: j.line, song: c.song, artist: c.artist };
      } catch (e) { /* try next candidate */ }
    }
    const c = candidates[0];
    return c ? { line: '', song: c.song, artist: c.artist } : null;
  }
  $('#linkForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const link = $('#linkInput').value.trim();
    const id = extractId(link);
    $('#frontError').hidden = true; $('#manualWrap').hidden = true;
    if (!id) { $('#frontErrorText').textContent = t().invalidLink; $('#frontError').hidden = false; return; }
    $('#loadingLine').hidden = false; $('#loadingLine').textContent = t().loading;
    try {
      const r = await fetch('/api/playlist', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ link }) });
      const j = await r.json();
      if (r.ok && j.tracks && j.tracks.length >= 5) { await startWithTracks(j.playlistId, j.tracks); return; }
    } catch (err) { /* fall through to manual */ }
    $('#manualWrap').hidden = false; $('#loadingLine').hidden = true;
  });
  $('#manualBtn').addEventListener('click', () => {
    const tracks = parseManual($('#manualInput').value);
    if (tracks.length < 1) return;
    $('#manualWrap').hidden = true;
    startWithTracks(hashText($('#manualInput').value), tracks);
  });
  $('#retryBtn').addEventListener('click', () => { $('#frontError').hidden = true; $('#linkForm').dispatchEvent(new Event('submit')); });
  window.addEventListener('resize', () => { if (state.page > 0) drawThread(state.page, false); });

  state.lang = detectLang();
  applyLang();
  $('#controls').style.visibility = 'hidden';
  setBallScale(1, false);
})();
