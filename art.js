/* KADR — procedural artwork.
   A stand-in for the real photo/print library: every product image, room scene
   and frame preview is generated as SVG from a seed, so the prototype can show
   thousands of distinct products with no asset pipeline. In production these
   become CDN images; the calling code only ever asks for a URL. */
(function (K) {
  'use strict';

  function rng(seed) {
    var s = seed >>> 0 || 1;
    return function () {
      s ^= s << 13; s >>>= 0;
      s ^= s >> 17;
      s ^= s << 5; s >>>= 0;
      return s / 4294967296;
    };
  }
  function hash(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function pick(r, arr) { return arr[Math.floor(r() * arr.length) % arr.length]; }
  function rint(r, a, b) { return Math.floor(a + r() * (b - a + 1)); }

  var GRAIN =
    '<filter id="g"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/>' +
    '<feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope="0.10"/></feComponentTransfer></filter>';

  /* ---- individual poster compositions ------------------------------------ */

  var COMPOSITIONS = {
    arch: function (r, p, w, h) {
      var cx = w / 2, top = h * (0.16 + r() * 0.1), rad = w * 0.34;
      var sun = h * (0.42 + r() * 0.12);
      return '<rect width="' + w + '" height="' + h + '" fill="' + p.bg + '"/>' +
        '<path d="M' + (cx - rad) + ' ' + h * 0.86 + ' L' + (cx - rad) + ' ' + (top + rad) +
        ' A' + rad + ' ' + rad + ' 0 0 1 ' + (cx + rad) + ' ' + (top + rad) +
        ' L' + (cx + rad) + ' ' + h * 0.86 + ' Z" fill="' + p.a + '"/>' +
        '<circle cx="' + cx + '" cy="' + sun + '" r="' + w * 0.17 + '" fill="' + p.b + '"/>' +
        '<rect x="' + (cx - rad) + '" y="' + h * 0.7 + '" width="' + rad * 2 + '" height="' + h * 0.16 + '" fill="' + p.c + '" opacity=".9"/>' +
        '<rect x="0" y="' + h * 0.86 + '" width="' + w + '" height="' + h * 0.14 + '" fill="' + p.ink + '"/>';
    },
    strata: function (r, p, w, h) {
      var out = '<rect width="' + w + '" height="' + h + '" fill="' + p.bg + '"/>';
      var y = h * 0.28, cols = [p.a, p.b, p.c, p.ink];
      for (var i = 0; i < 6; i++) {
        var band = h * (0.06 + r() * 0.09);
        var amp = h * 0.03 * r();
        out += '<path d="M0 ' + y + ' Q ' + w * 0.3 + ' ' + (y - amp) + ' ' + w * 0.55 + ' ' + y +
          ' T ' + w + ' ' + (y + amp * 0.4) + ' L' + w + ' ' + h + ' L0 ' + h + ' Z" fill="' + cols[i % cols.length] +
          '" opacity="' + (0.55 + i * 0.08).toFixed(2) + '"/>';
        y += band;
      }
      out += '<circle cx="' + w * (0.2 + r() * 0.6) + '" cy="' + h * 0.18 + '" r="' + w * 0.09 + '" fill="' + p.b + '"/>';
      return out;
    },
    grid: function (r, p, w, h) {
      var out = '<rect width="' + w + '" height="' + h + '" fill="' + p.bg + '"/>';
      var cols = 3 + Math.floor(r() * 2), rows = 4 + Math.floor(r() * 2);
      var cw = w / cols, ch = h / rows, palette = [p.a, p.b, p.c, p.bg, p.ink];
      for (var y = 0; y < rows; y++) for (var x = 0; x < cols; x++) {
        var f = pick(r, palette), k = r();
        if (k < 0.34) out += '<rect x="' + x * cw + '" y="' + y * ch + '" width="' + cw + '" height="' + ch + '" fill="' + f + '"/>';
        else if (k < 0.62) out += '<circle cx="' + (x * cw + cw / 2) + '" cy="' + (y * ch + ch / 2) + '" r="' + Math.min(cw, ch) * 0.44 + '" fill="' + f + '"/>';
        else if (k < 0.82) out += '<path d="M' + x * cw + ' ' + (y * ch + ch) + ' L' + (x * cw + cw) + ' ' + (y * ch + ch) + ' L' + (x * cw + cw) + ' ' + y * ch + ' Z" fill="' + f + '"/>';
      }
      return out;
    },
    orbit: function (r, p, w, h) {
      var out = '<rect width="' + w + '" height="' + h + '" fill="' + p.bg + '"/>';
      var cx = w * (0.4 + r() * 0.2), cy = h * (0.42 + r() * 0.12);
      for (var i = 6; i > 0; i--) {
        out += '<circle cx="' + cx + '" cy="' + cy + '" r="' + (w * 0.07 * i) + '" fill="none" stroke="' +
          (i % 2 ? p.a : p.c) + '" stroke-width="' + (1 + i * 0.6).toFixed(1) + '" opacity=".85"/>';
      }
      out += '<circle cx="' + cx + '" cy="' + cy + '" r="' + w * 0.1 + '" fill="' + p.b + '"/>';
      out += '<rect x="0" y="' + h * 0.88 + '" width="' + w + '" height="' + h * 0.12 + '" fill="' + p.ink + '"/>';
      return out;
    },
    horizon: function (r, p, w, h) {
      var hz = h * (0.55 + r() * 0.12);
      var out = '<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0" stop-color="' + p.a + '"/><stop offset="1" stop-color="' + p.b + '"/></linearGradient></defs>' +
        '<rect width="' + w + '" height="' + hz + '" fill="url(#sky)"/>' +
        '<rect y="' + hz + '" width="' + w + '" height="' + (h - hz) + '" fill="' + p.ink + '"/>' +
        '<circle cx="' + w * (0.25 + r() * 0.5) + '" cy="' + hz * 0.55 + '" r="' + w * 0.13 + '" fill="' + p.c + '"/>';
      for (var i = 0; i < 4; i++) {
        var x = w * r(), pw = w * (0.15 + r() * 0.3), ph = h * (0.06 + r() * 0.14);
        out += '<path d="M' + x + ' ' + hz + ' L' + (x + pw / 2) + ' ' + (hz - ph) + ' L' + (x + pw) + ' ' + hz + ' Z" fill="' + p.ink + '" opacity=".85"/>';
      }
      return out;
    },
    type: function (r, p, w, h, word) {
      var out = '<rect width="' + w + '" height="' + h + '" fill="' + p.bg + '"/>';
      out += '<rect x="' + w * 0.08 + '" y="' + h * 0.08 + '" width="' + w * 0.84 + '" height="' + h * 0.84 + '" fill="none" stroke="' + p.a + '" stroke-width="3"/>';
      var letters = (word || 'KADR').toUpperCase().slice(0, 8);
      out += '<text x="' + w / 2 + '" y="' + h * 0.52 + '" font-family="Georgia,serif" font-size="' + w * (0.9 / Math.max(3, letters.length)) +
        '" fill="' + p.ink + '" text-anchor="middle" letter-spacing="' + w * 0.008 + '">' + esc(letters) + '</text>';
      out += '<rect x="' + w * 0.08 + '" y="' + h * 0.6 + '" width="' + w * 0.84 + '" height="' + h * 0.012 + '" fill="' + p.b + '"/>';
      out += '<circle cx="' + w * 0.5 + '" cy="' + h * 0.75 + '" r="' + w * 0.06 + '" fill="' + p.c + '"/>';
      return out;
    },
    halftone: function (r, p, w, h) {
      var out = '<rect width="' + w + '" height="' + h + '" fill="' + p.bg + '"/>';
      var cols = 14, rows = Math.round(cols * h / w), cw = w / cols;
      for (var y = 0; y < rows; y++) for (var x = 0; x < cols; x++) {
        var t = y / rows, rr = cw * 0.5 * (0.15 + t * 0.85) * (0.7 + r() * 0.6);
        out += '<circle cx="' + (x * cw + cw / 2) + '" cy="' + (y * cw + cw / 2) + '" r="' + rr.toFixed(2) +
          '" fill="' + (y % 3 === 0 ? p.a : p.ink) + '"/>';
      }
      out += '<rect x="' + w * 0.12 + '" y="' + h * 0.4 + '" width="' + w * 0.76 + '" height="' + h * 0.14 + '" fill="' + p.b + '"/>';
      return out;
    },
    bloom: function (r, p, w, h) {
      var out = '<rect width="' + w + '" height="' + h + '" fill="' + p.bg + '"/>';
      var cx = w / 2, cy = h * 0.5, petals = rint(r, 6, 12);
      for (var i = 0; i < petals; i++) {
        var a = (i / petals) * Math.PI * 2, len = w * (0.26 + r() * 0.14);
        out += '<ellipse cx="' + (cx + Math.cos(a) * len * 0.5) + '" cy="' + (cy + Math.sin(a) * len * 0.5) +
          '" rx="' + len * 0.5 + '" ry="' + len * 0.16 + '" fill="' + (i % 2 ? p.a : p.c) +
          '" opacity=".8" transform="rotate(' + (a * 180 / Math.PI) + ' ' + (cx + Math.cos(a) * len * 0.5) + ' ' + (cy + Math.sin(a) * len * 0.5) + ')"/>';
      }
      out += '<circle cx="' + cx + '" cy="' + cy + '" r="' + w * 0.09 + '" fill="' + p.b + '"/>';
      return out;
    }
  };

  var COMP_KEYS = Object.keys(COMPOSITIONS);

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /* Frame chrome drawn around the artwork; `frame` is an option id. */
  var FRAMES = {
    none:   null,
    black:  { outer: '#15151a', inner: '#2a2a31', mat: null },
    white:  { outer: '#f2efe8', inner: '#d9d4c8', mat: '#faf8f3' },
    oak:    { outer: '#c9a273', inner: '#a37f52', mat: '#f7f2e6' },
    walnut: { outer: '#6c4327', inner: '#4a2c19', mat: '#efe6d5' }
  };

  /* Core: returns an <svg> string for one artwork. */
  function artSvg(opts) {
    var seed = typeof opts.seed === 'string' ? hash(opts.seed) : (opts.seed || 1);
    var r = rng(seed);
    var w = opts.w || 600, h = opts.h || 800;
    var p = opts.palette;
    var comp = COMPOSITIONS[opts.comp] || COMPOSITIONS[COMP_KEYS[seed % COMP_KEYS.length]];
    var f = FRAMES[opts.frame || 'none'];
    var pad = f ? Math.round(w * 0.055) : 0;
    var mat = f && f.mat ? Math.round(w * 0.05) : 0;
    var iw = w - (pad + mat) * 2, ih = h - (pad + mat) * 2;

    var body = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + w + ' ' + h + '" width="' + w + '" height="' + h + '">' +
      '<defs>' + GRAIN + '</defs>';
    if (f) {
      body += '<rect width="' + w + '" height="' + h + '" fill="' + f.outer + '"/>' +
        '<rect x="' + pad * 0.5 + '" y="' + pad * 0.5 + '" width="' + (w - pad) + '" height="' + (h - pad) + '" fill="none" stroke="' + f.inner + '" stroke-width="2"/>';
      if (f.mat) body += '<rect x="' + pad + '" y="' + pad + '" width="' + (w - pad * 2) + '" height="' + (h - pad * 2) + '" fill="' + f.mat + '"/>';
    }
    body += '<g transform="translate(' + (pad + mat) + ',' + (pad + mat) + ')">' +
      '<svg width="' + iw + '" height="' + ih + '" viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="none">' +
      comp(r, p, w, h, opts.word) +
      '<rect width="' + w + '" height="' + h + '" filter="url(#g)" opacity=".5"/>' +
      '</svg></g>';
    if (f) body += '<rect x="' + (pad + mat) + '" y="' + (pad + mat) + '" width="' + iw + '" height="' + ih + '" fill="none" stroke="rgba(0,0,0,.25)" stroke-width="1"/>';
    return body + '</svg>';
  }

  function toUrl(svg) {
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }

  /* ---- room scenes -------------------------------------------------------- */

  var ROOM_SHELLS = {
    bedroom:  { wall: '#e6ded1', floor: '#b9a288', trim: '#d5c9b7' },
    living:   { wall: '#e8e4dc', floor: '#a98f70', trim: '#d3ccc0' },
    gaming:   { wall: '#1d1f26', floor: '#14161b', trim: '#2b2f39' },
    office:   { wall: '#dfe0dc', floor: '#9a9c96', trim: '#c9cac4' },
    dorm:     { wall: '#efe7da', floor: '#c2ad92', trim: '#ded2c0' },
    cafe:     { wall: '#241d18', floor: '#3a2b21', trim: '#3d3128' }
  };

  /* A room scene: wall, floor, furniture silhouettes and framed art on the wall. */
  function sceneSvg(opts) {
    var w = opts.w || 900, h = opts.h || 620;
    var shell = ROOM_SHELLS[opts.room] || ROOM_SHELLS.bedroom;
    var r = rng(hash(opts.seed || 'scene'));
    var floorY = h * 0.72;
    var s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + w + ' ' + h + '" width="' + w + '" height="' + h + '">' +
      '<defs>' + GRAIN +
      '<linearGradient id="wl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + shell.wall + '"/>' +
      '<stop offset="1" stop-color="' + shade(shell.wall, -14) + '"/></linearGradient>' +
      '<radialGradient id="lt" cx="0.28" cy="0.18" r="0.9"><stop offset="0" stop-color="#fff" stop-opacity=".35"/>' +
      '<stop offset="1" stop-color="#000" stop-opacity=".22"/></radialGradient></defs>' +
      '<rect width="' + w + '" height="' + h + '" fill="url(#wl)"/>' +
      '<rect y="' + floorY + '" width="' + w + '" height="' + (h - floorY) + '" fill="' + shell.floor + '"/>' +
      '<rect y="' + (floorY - 10) + '" width="' + w + '" height="12" fill="' + shell.trim + '"/>';

    /* furniture silhouettes */
    var fk = opts.room === 'office' ? 'desk' : (opts.room === 'living' || opts.room === 'cafe' ? 'sofa' : 'bed');
    if (fk === 'bed') {
      s += '<rect x="' + w * 0.24 + '" y="' + (floorY - h * 0.1) + '" width="' + w * 0.52 + '" height="' + h * 0.2 + '" rx="8" fill="' + shade(shell.floor, -18) + '"/>' +
        '<rect x="' + w * 0.27 + '" y="' + (floorY - h * 0.14) + '" width="' + w * 0.2 + '" height="' + h * 0.06 + '" rx="10" fill="' + shade(shell.wall, 12) + '"/>';
    } else if (fk === 'sofa') {
      s += '<rect x="' + w * 0.2 + '" y="' + (floorY - h * 0.14) + '" width="' + w * 0.6 + '" height="' + h * 0.2 + '" rx="14" fill="' + shade(shell.floor, -22) + '"/>' +
        '<rect x="' + w * 0.24 + '" y="' + (floorY - h * 0.2) + '" width="' + w * 0.52 + '" height="' + h * 0.09 + '" rx="12" fill="' + shade(shell.floor, -8) + '"/>';
    } else {
      s += '<rect x="' + w * 0.22 + '" y="' + (floorY - h * 0.02) + '" width="' + w * 0.56 + '" height="' + h * 0.03 + '" fill="' + shade(shell.floor, -25) + '"/>' +
        '<rect x="' + w * 0.26 + '" y="' + (floorY + h * 0.01) + '" width="' + w * 0.02 + '" height="' + h * 0.16 + '" fill="' + shade(shell.floor, -30) + '"/>' +
        '<rect x="' + w * 0.72 + '" y="' + (floorY + h * 0.01) + '" width="' + w * 0.02 + '" height="' + h * 0.16 + '" fill="' + shade(shell.floor, -30) + '"/>';
    }
    /* plant */
    s += '<rect x="' + w * 0.86 + '" y="' + (floorY - h * 0.02) + '" width="' + w * 0.06 + '" height="' + h * 0.1 + '" rx="4" fill="' + shade(shell.floor, -30) + '"/>';
    for (var i = 0; i < 7; i++) {
      var a = -110 + i * 22 + r() * 10;
      s += '<ellipse cx="' + (w * 0.89) + '" cy="' + (floorY - h * 0.09) + '" rx="' + w * 0.045 + '" ry="' + w * 0.012 +
        '" fill="#5d7052" transform="rotate(' + a + ' ' + w * 0.89 + ' ' + (floorY - h * 0.02) + ')"/>';
    }

    /* art on the wall — each entry {x,y,w,h,palette,comp,frame} in 0..1 units */
    (opts.art || []).forEach(function (a) {
      var ax = a.x * w, ay = a.y * h, aw = a.w * w, ah = a.h * h;
      var inner = artSvg({ seed: a.seed, palette: a.palette, comp: a.comp, frame: a.frame, w: 300, h: Math.round(300 * (ah / aw)) })
        .replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
      s += '<g transform="translate(' + ax + ',' + ay + ')">' +
        '<rect x="6" y="8" width="' + aw + '" height="' + ah + '" fill="rgba(0,0,0,.22)" />' +
        '<svg width="' + aw + '" height="' + ah + '" viewBox="0 0 300 ' + Math.round(300 * (ah / aw)) + '" preserveAspectRatio="none">' +
        '<defs>' + GRAIN + '</defs>' + inner + '</svg></g>';
    });

    s += '<rect width="' + w + '" height="' + h + '" fill="url(#lt)"/>';
    s += '<rect width="' + w + '" height="' + h + '" filter="url(#g)" opacity=".35"/>';
    return s + '</svg>';
  }

  function shade(hex, amt) {
    var n = parseInt(hex.slice(1), 16);
    var r = Math.max(0, Math.min(255, (n >> 16) + amt));
    var g = Math.max(0, Math.min(255, ((n >> 8) & 255) + amt));
    var b = Math.max(0, Math.min(255, (n & 255) + amt));
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  K.art = {
    rng: rng, hash: hash, pick: pick, rint: rint, shade: shade,
    compositions: COMP_KEYS,
    frames: FRAMES,
    svg: artSvg,
    url: function (o) { return toUrl(artSvg(o)); },
    sceneSvg: sceneSvg,
    sceneUrl: function (o) { return toUrl(sceneSvg(o)); },
    toUrl: toUrl
  };
})(window.KADR = window.KADR || {});
