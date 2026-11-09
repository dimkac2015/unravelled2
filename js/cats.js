// Cats that watch the ball unravel, then wander off.
// Simple flat SVG cats + a thread-pile illustration for the finale.

(function () {

  function cat(bodyColor, eyeColor, x, flip, pose) {
    const sitting = pose === "sit";
    const body = sitting
      ? `<path d="M0 90 Q0 30 34 30 Q68 30 68 90 Z" fill="${bodyColor}"/>`
      : `<ellipse cx="40" cy="72" rx="42" ry="20" fill="${bodyColor}"/>`;
    const legs = sitting ? "" : `
      <rect x="14" y="80" width="9" height="18" rx="4" fill="${bodyColor}"/>
      <rect x="58" y="80" width="9" height="18" rx="4" fill="${bodyColor}"/>`;
    const tail = sitting
      ? `<path d="M66 88 Q92 84 88 60" stroke="${bodyColor}" stroke-width="9" fill="none" stroke-linecap="round"/>`
      : `<path d="M78 70 Q102 66 98 44" stroke="${bodyColor}" stroke-width="8" fill="none" stroke-linecap="round"/>`;
    return `
<g transform="translate(${x} 0) ${flip ? "scale(-1 1) translate(-80 0)" : ""}">
  ${body}${legs}${tail}
  <circle cx="34" cy="26" r="20" fill="${bodyColor}"/>
  <path d="M18 14 L14 -2 L26 8 Z" fill="${bodyColor}"/>
  <path d="M50 14 L54 -2 L42 8 Z" fill="${bodyColor}"/>
  <circle cx="27" cy="24" r="3.4" fill="${eyeColor}"/>
  <circle cx="41" cy="24" r="3.4" fill="${eyeColor}"/>
  <path d="M29 33 Q34 37 39 33" stroke="#12161d" stroke-width="2" fill="none" stroke-linecap="round"/>
</g>`;
  }

  function catsWatching() {
    return `<svg viewBox="0 0 560 150" xmlns="http://www.w3.org/2000/svg" role="img">
      <g transform="translate(60 40)">${cat("#2b2b33", "#d9a441", 0, false, "sit")}</g>
      <g transform="translate(190 60)">${cat("#e8dcc8", "#4a7d5c", 0, false, "sit")}</g>
      <g transform="translate(330 70)">${cat("#8a6a4a", "#d9a441", 0, false, "sit")}</g>
    </svg>`;
  }

  function catsLeaving() {
    return `<svg viewBox="0 0 560 150" xmlns="http://www.w3.org/2000/svg" role="img">
      <g transform="translate(360 50)">${cat("#2b2b33", "#d9a441", 0, true, "walk")}</g>
      <g transform="translate(230 66)">${cat("#e8dcc8", "#4a7d5c", 0, true, "walk")}</g>
      <g transform="translate(100 74)">${cat("#8a6a4a", "#d9a441", 0, true, "walk")}</g>
    </svg>`;
  }

  function threadPile() {
    return `<svg viewBox="0 0 480 220" xmlns="http://www.w3.org/2000/svg" role="img">
      <ellipse cx="240" cy="182" rx="190" ry="26" fill="#000" opacity=".25"/>
      <path d="M70 170 Q120 120 200 150 Q300 110 340 160 Q400 130 420 172"
            stroke="#e8dcc8" stroke-width="7" fill="none" stroke-linecap="round"/>
      <path d="M60 178 Q160 150 250 176 Q330 156 424 180"
            stroke="#cdbd9e" stroke-width="5" fill="none" stroke-linecap="round" opacity=".9"/>
      <path d="M90 186 Q180 168 300 186 Q360 178 410 190"
            stroke="#b3a281" stroke-width="4" fill="none" stroke-linecap="round" opacity=".8"/>
      <path d="M330 160 q60 -40 90 -10 q-30 30 -60 22" fill="#e8dcc8" opacity=".95"/>
      <path d="M340 158 q44 -26 66 -6 q-22 20 -44 16" stroke="#8a7a5c" stroke-width="2.5" fill="none"/>
      <path d="M420 152 q30 10 24 34" stroke="#e8dcc8" stroke-width="4" fill="none" stroke-linecap="round"/>
    </svg>`;
  }

  window.UNRAVELLED_CATS = { catsWatching, catsLeaving, threadPile };
})();
