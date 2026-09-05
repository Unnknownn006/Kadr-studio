/* Complete your room — a lightweight composition tool, not a recommender.
   Empty wall, a library, drag/resize, then one reviewed add-to-cart. */
(function (K) {
  'use strict';
  var D = K.data, S = K.store, U = K.ui, SR = K.search, VH = K.vh;
  var t = function (k, v) { return K.i18n.t(k, v); }, tc = function (o) { return K.i18n.tc(o); };
  K.views = K.views || {};

  var WALLS = [
    { id: 'bedroom', label: { en: 'Bedroom', hy: 'Ննջասենյակ', ru: 'Спальня' } },
    { id: 'living', label: { en: 'Living room', hy: 'Հյուրասենյակ', ru: 'Гостиная' } },
    { id: 'gaming', label: { en: 'Gaming', hy: 'Գեյմինգ', ru: 'Игровая' } },
    { id: 'office', label: { en: 'Office', hy: 'Գրասենյակ', ru: 'Офис' } },
    { id: 'dorm', label: { en: 'Dorm', hy: 'Հանրակացարան', ru: 'Общежитие' } },
    { id: 'cafe', label: { en: 'Café', hy: 'Սրճարան', ru: 'Кафе' } }
  ];

  var wall = null;   /* { room, items:[{pid,x,y,w,frame}] } */
  var selected = -1;

  function ensureWall() {
    wall = S.state.wall || { room: 'bedroom', items: [] };
    if (!wall.items) wall.items = [];
  }
  function persist() { S.setWall(wall); }

  function libraryProducts() {
    var favs = S.state.favorites.map(S.byId).filter(Boolean);
    var recent = S.state.recent.map(S.byId).filter(Boolean);
    var feed = SR.feed(0).slice(0, 24);
    var seen = {}, out = [];
    favs.concat(recent, feed).forEach(function (p) { if (p && !seen[p.id]) { seen[p.id] = 1; out.push(p); } });
    return out.slice(0, 30);
  }

  function itemHtml(it, i) {
    var p = S.byId(it.pid); if (!p) return '';
    var ratio = D.optionRatio(p, { size: '50x70' });
    return '<div class="witem' + (i === selected ? ' is-sel' : '') + '" data-i="' + i + '" style="left:' + it.x + '%;top:' + it.y + '%;width:' + it.w + '%;aspect-ratio:' + ratio.toFixed(3) + '">' +
      '<img src="' + K.art.url({ seed: p.id + it.frame, palette: p.palette, comp: p.comp, frame: it.frame, w: 300, h: Math.round(300 / ratio) }) + '" alt="' + U.esc(tc(p.title)) + '" draggable="false">' +
      (i === selected ? '<button class="witem__x" data-action="w-del" data-i="' + i + '" aria-label="' + t('ui.delete') + '">✕</button><span class="witem__h" data-action="w-resize" data-i="' + i + '"></span>' : '') +
      '</div>';
  }

  function wallTotal() {
    return wall.items.reduce(function (n, it) {
      var p = S.byId(it.pid); if (!p) return n;
      return n + D.price(p, Object.assign({}, D.PRODUCT_TYPES[p.typeId].defaults, it.frame !== 'none' ? { frame: it.frame } : {}));
    }, 0);
  }

  K.views.composer = {
    render: function () {
      ensureWall();
      selected = -1;
      U.setMeta({ title: t('room.title') + ' — KADR', description: 'Compose your wall before you buy.' });
      var lib = libraryProducts();
      return '<div class="wrap">' + VH.pageHead(t('room.title'), t('nav.builder')) +
        '<p class="lede" style="margin:-18px 0 24px">' + t('room.sub') + '</p>' +
        '<div class="composer">' +
        '<div><div class="wall" id="wall">' +
          '<img class="bg" src="' + K.art.sceneUrl({ room: wall.room, seed: 'composer-' + wall.room, w: 1200, h: 750, art: [] }) + '" alt="">' +
          wall.items.map(itemHtml).join('') +
        '</div>' +
        '<div class="pillrow" style="margin-top:14px;justify-content:space-between">' +
          '<span class="mono">' + t('room.hint') + '</span>' +
          '<span class="pillrow"><button class="chip" data-action="w-clear">' + t('room.clear') + '</button>' +
          '<button class="btn btn--sm btn--oxide" data-action="w-review" id="wcta"' + (wall.items.length ? '' : ' disabled') + '>' +
          t('room.addAll') + ' · <b id="wtotal">' + U.money(wallTotal()) + '</b></button></span>' +
        '</div></div>' +
        '<aside>' +
          '<p class="mono">' + t('room.pick') + '</p>' +
          '<div class="chips" style="margin:10px 0 20px">' + WALLS.map(function (w) {
            return '<button class="chip' + (wall.room === w.id ? ' is-on' : '') + '" data-action="w-room" data-k="' + w.id + '">' + U.esc(tc(w.label)) + '</button>';
          }).join('') + '</div>' +
          '<p class="mono">' + t('room.library') + '</p>' +
          '<div class="libbar" style="margin-top:10px">' + lib.map(function (p) {
            return '<img src="' + D.imageFor(p, null, 160) + '" alt="' + U.esc(tc(p.title)) + '" title="' + U.esc(tc(p.title)) + '" data-action="w-add" data-id="' + p.id + '" loading="lazy">';
          }).join('') + '</div>' +
          (wall.items.length ? '' : '<p class="mono" style="margin-top:16px;text-transform:none;letter-spacing:0">' + t('room.emptyWall') + '</p>') +
        '</aside></div></div>';
    },
    mount: function (root) {
      ensureWall();
      var wallEl = U.qs('#wall', root);
      if (!wallEl) return;

      function redraw() {
        U.qsa('.witem', wallEl).forEach(function (n) { n.remove(); });
        wallEl.insertAdjacentHTML('beforeend', wall.items.map(itemHtml).join(''));
        var cta = U.qs('#wcta', root);
        cta.disabled = !wall.items.length;
        U.qs('#wtotal', root).textContent = U.money(wallTotal());
        persist();
      }

      /* drag + resize with pointer events (works with touch and mouse alike) */
      var drag = null;
      wallEl.addEventListener('pointerdown', function (e) {
        var handle = e.target.closest('[data-action="w-resize"]');
        var item = e.target.closest('.witem');
        if (!item) { selected = -1; redraw(); return; }
        var i = parseInt(item.dataset.i, 10);
        selected = i; redraw();
        var node = U.qsa('.witem', wallEl)[i];
        var r = wallEl.getBoundingClientRect();
        drag = {
          i: i, mode: handle ? 'resize' : 'move', node: node,
          sx: e.clientX, sy: e.clientY,
          ox: wall.items[i].x, oy: wall.items[i].y, ow: wall.items[i].w,
          rw: r.width, rh: r.height
        };
        wallEl.setPointerCapture(e.pointerId);
        e.preventDefault();
      });
      wallEl.addEventListener('pointermove', function (e) {
        if (!drag) return;
        var dx = (e.clientX - drag.sx) / drag.rw * 100;
        var dy = (e.clientY - drag.sy) / drag.rh * 100;
        var it = wall.items[drag.i];
        if (drag.mode === 'move') {
          it.x = Math.max(-5, Math.min(95, drag.ox + dx));
          it.y = Math.max(-5, Math.min(85, drag.oy + dy));
          drag.node.style.left = it.x + '%'; drag.node.style.top = it.y + '%';
        } else {
          it.w = Math.max(6, Math.min(48, drag.ow + dx));
          drag.node.style.width = it.w + '%';
        }
      });
      wallEl.addEventListener('pointerup', function () { if (drag) { drag = null; persist(); } });
      wallEl.addEventListener('dblclick', function (e) {
        var item = e.target.closest('.witem'); if (!item) return;
        wall.items.splice(parseInt(item.dataset.i, 10), 1);
        selected = -1; redraw();
      });

      K.app.bind('click', function (e) {
        var b = e.target.closest('[data-action]'); if (!b) return;
        var a = b.dataset.action;
        if (a === 'w-add') {
          var p = S.byId(b.dataset.id);
          var frames = ['none', 'black', 'oak', 'white'];
          wall.items.push({ pid: p.id, x: 20 + (wall.items.length * 9) % 50, y: 14 + (wall.items.length * 7) % 26, w: 16, frame: frames[wall.items.length % 4] });
          selected = wall.items.length - 1;
          S.track('view', { productId: p.id });
          redraw();
        }
        if (a === 'w-del') { wall.items.splice(parseInt(b.dataset.i, 10), 1); selected = -1; redraw(); }
        if (a === 'w-clear') { wall.items = []; selected = -1; redraw(); }
        if (a === 'w-room') { wall.room = b.dataset.k; persist(); K.app.rerender(); }
        if (a === 'w-review') {
          var rows = wall.items.map(function (it, i) {
            var p = S.byId(it.pid);
            var opts = Object.assign({}, D.PRODUCT_TYPES[p.typeId].defaults);
            if (D.PRODUCT_TYPES[p.typeId].components.indexOf('frame') >= 0) opts.frame = it.frame;
            var price = D.price(p, opts);
            return '<div class="line">' + U.artImg(p, opts, 160) +
              '<div><b>' + U.esc(tc(p.title)) + '</b><div class="line__opts">' + U.optionSummary(p, opts) + '</div>' +
              '<div class="line__sku">' + S.skuFor(p, opts) + '</div></div>' +
              '<div class="num">' + U.money(price) + '</div></div>';
          }).join('');
          U.modal({
            title: t('scene.review'),
            body: rows + '<div class="srow srow--total"><span>' + t('cart.total') + '</span><span class="num">' + U.money(wallTotal()) + '</span></div>',
            footer: '<button class="btn btn--ghost" data-action="modal-close">' + t('ui.cancel') + '</button>' +
              '<button class="btn btn--oxide" data-action="w-confirm">' + t('scene.addAll', { n: wall.items.length, total: U.money(wallTotal()) }) + '</button>'
          });
        }
        if (a === 'w-confirm') {
          wall.items.forEach(function (it) {
            var p = S.byId(it.pid);
            var opts = Object.assign({}, D.PRODUCT_TYPES[p.typeId].defaults);
            if (D.PRODUCT_TYPES[p.typeId].components.indexOf('frame') >= 0) opts.frame = it.frame;
            S.addToCart(p.id, opts, 1);
          });
          U.closeModal();
          U.toast(t('p.added'), { href: '#/cart', cta: t('cart.checkout') });
        }
      });
    }
  };
})(window.KADR = window.KADR || {});
