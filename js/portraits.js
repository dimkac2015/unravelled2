// Character portraits drawn in the style of "This Is The Police":
// flat vector shapes, hard side-lighting, strong silhouette, limited palette,
// heavy shadow across half the face, minimal but not empty detail.

(function () {

  // cfg: { bg, skin, skinShadow, coat, coatShadow, shirt, hair, accent,
  //        hat: 'fedora'|'cap'|'none'|'hood'|'crown'|'helmet',
  //        glasses: bool, beard: bool, earring: bool, scarf: color|null }
  function portrait(cfg) {
    const C = Object.assign({
      bg: "#1b2430", skin: "#e6b98c", skinShadow: "#a97a54",
      coat: "#2c3644", coatShadow: "#1c242e", shirt: "#d9d2c0",
      hair: "#2b2119", accent: "#c34a36", hat: "none",
      glasses: false, beard: false, scarf: null
    }, cfg);

    let hatSVG = "";
    const hatY = 96;
    if (C.hat === "fedora") {
      hatSVG = `
        <path d="M118 104 Q130 66 200 66 Q270 66 282 104 L300 112 Q200 100 100 112 Z" fill="${C.coat}"/>
        <path d="M100 112 h200 v14 h-200 Z" fill="${C.coatShadow}"/>
        <path d="M200 66 L200 104" stroke="${C.coatShadow}" stroke-width="3"/>`;
    } else if (C.hat === "cap") {
      hatSVG = `
        <path d="M130 100 Q200 52 270 100 L270 112 L130 112 Z" fill="${C.coat}"/>
        <path d="M268 100 q42 4 44 14 l-44 2 Z" fill="${C.coatShadow}"/>
        <circle cx="200" cy="62" r="5" fill="${C.accent}"/>`;
    } else if (C.hat === "hood") {
      hatSVG = `
        <path d="M120 190 Q100 60 200 52 Q300 60 280 190 L250 180 Q270 100 200 92 Q130 100 150 180 Z" fill="${C.coat}"/>
        <path d="M150 96 Q200 74 250 96 L250 120 Q200 100 150 120 Z" fill="${C.coatShadow}"/>`;
    } else if (C.hat === "crown") {
      hatSVG = `
        <path d="M140 100 L150 64 L175 84 L200 56 L225 84 L250 64 L260 100 Z" fill="${C.accent}"/>
        <rect x="140" y="100" width="120" height="10" fill="${C.accent}" opacity=".85"/>`;
    } else if (C.hat === "helmet") {
      hatSVG = `
        <path d="M136 104 Q136 58 200 58 Q264 58 264 104 Z" fill="${C.coat}"/>
        <rect x="130" y="102" width="140" height="12" rx="4" fill="${C.coatShadow}"/>
        <path d="M196 58 h8 v46 h-8 Z" fill="${C.accent}" opacity=".8"/>`;
    }

    const glassesSVG = C.glasses ? `
      <g fill="none" stroke="#12161d" stroke-width="5">
        <rect x="158" y="150" width="34" height="22" rx="4" fill="#12161d" opacity=".9"/>
        <rect x="210" y="150" width="34" height="22" rx="4" fill="#12161d" opacity=".9"/>
        <path d="M192 160 h18"/>
      </g>` : "";

    const beardSVG = C.beard ? `
      <path d="M158 190 Q200 236 242 190 L242 206 Q200 250 158 206 Z" fill="${C.hair}"/>` : "";

    const scarfSVG = C.scarf ? `
      <path d="M150 262 Q200 284 250 262 L250 276 Q200 298 150 276 Z" fill="${C.scarf}"/>
      <path d="M236 272 l16 40 l-14 6 l-16 -40 Z" fill="${C.scarf}" opacity=".85"/>` : "";

    return `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" role="img">
  <rect width="400" height="400" fill="${C.bg}"/>
  <circle cx="200" cy="180" r="150" fill="${C.bg}" opacity="0"/>
  <path d="M400 0 L400 400 L240 400 Q340 220 400 0 Z" fill="#000" opacity=".28"/>

  <path d="M60 400 Q80 320 130 292 L200 268 L270 292 Q320 320 340 400 Z" fill="${C.coat}"/>
  <path d="M200 268 L270 292 Q320 320 340 400 L240 400 Q280 300 200 268 Z" fill="${C.coatShadow}"/>
  <path d="M200 272 L176 400 L224 400 Z" fill="${C.shirt}"/>
  <path d="M200 272 L224 400 L200 400 Z" fill="${C.shirt}" opacity=".6"/>
  ${scarfSVG}

  <rect x="168" y="238" width="64" height="52" rx="14" fill="${C.skin}"/>
  <path d="M200 238 h32 v52 h-32 Z" fill="${C.skinShadow}"/>
  <path d="M136 130 Q136 66 200 66 Q264 66 264 130 L264 176 Q264 226 200 226 Q136 226 136 176 Z" fill="${C.skin}"/>
  <path d="M200 66 Q264 66 264 130 L264 176 Q264 226 200 226 Z" fill="${C.skinShadow}"/>
  <path d="M136 150 Q160 138 178 150 L178 166 Q158 172 136 162 Z" fill="${C.hair}"/>
  <path d="M222 150 Q242 138 264 150 L264 164 Q242 172 222 166 Z" fill="${C.hair}"/>

  <g fill="#12161d">
    <ellipse cx="176" cy="160" rx="6" ry="8"/>
    <ellipse cx="226" cy="160" rx="5" ry="7"/>
  </g>
  <path d="M186 184 Q200 196 216 184" stroke="#12161d" stroke-width="5" fill="none" stroke-linecap="round"/>
  ${glassesSVG}
  ${beardSVG}

  <path d="M136 130 Q140 74 200 72 Q258 74 264 130 L258 128 Q252 84 200 82 Q150 84 144 128 Z" fill="${C.hair}"/>
  ${hatSVG}

  <rect x="0" y="376" width="400" height="24" fill="#000" opacity=".35"/>
</svg>`;
  }

  window.UNRAVELLED_PORTRAIT = portrait;
})();
