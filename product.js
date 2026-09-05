/* Product page + Product Builder.
   Both drive the same option state; the builder is the same engine with the
   steps unrolled. Admin can switch the builder off and the PDP still sells. */
(function (K) {
  'use strict';
  var D = K.data, S = K.store, U = K.ui, SR = K.search, VH = K.vh;
  var t = function (k, v) { return K.i18n.t(k, v); }, tc = function (o) { return K.i18n.tc(o); };
  K.views = K.views || {};

  var sel = {};     /* current option selection */
  var qty = 1;
  var shot = 0;     /* gallery index */

  function gallery(p) {
    return [
      { k: 'product', url: D.imageFor(p, sel, 900) },
      { k: 'room', url: K.art.sceneUrl({ room: 'bedroom', seed: 'pdp' + p.id, w: 1000, h: 700,
          art: [{ x: .32, y: .14, w: .30, h: .40, seed: p.id, palette: p.palette, comp: p.comp, frame: sel.frame || 'none' }] }) },
      { k: 'detail', url: D.imageFor(p, sel, 1200), detail: true },
      { k: 'scale', url: K.art.sceneUrl({ room: 'office', seed: 'sc' + p.id, w: 1000, h: 700,
          art: [{ x: .20, y: .12, w: .22, h: .30, seed: p.id, palette: p.palette, comp: p.comp, frame: sel.frame || 'none' },
                { x: .48, y: .16, w: .18, h: .25, seed: p.id + 'b', palette: p.palette, comp: p.comp, frame: sel.frame || 'none' }] }) }
    ];
  }

  function optionBlock(p, compact) {
    var type = D.PRODUCT_TYPES[p.typeId];
    var dm = D.disabledMap(p, sel);
    return type.components.map(function (c) {
      var attr = D.ATTRIBUTES[c]; if (!attr) return '';
      var off = dm.disabled[c] || [];
      var current = D.valueOf(c, sel[c]);
      var whyShown = null;
      var vals = attr.values.map(function (v) {
        var isOff = off.indexOf(v.id) >= 0;
        if (isOff && dm.reasons[c + ':' + v.id]) whyShown = dm.reasons[c + ':' + v.id];
        var delta = '';
        if (!isOff && v.id !== sel[c]) {
          var probe = Object.assign({}, sel); probe[c] = v.id;
          var d = D.price(p, D.reconcile(p, probe, c)) - D.price(p, sel);
          if (d) delta = '<em class="add">' + (d > 0 ? '+' : '−') + U.money(Math.abs(d)) + '</em>';
        }
        return '<button class="oval' + (sel[c] === v.id ? ' is-on' : '') + '"' + (isOff ? ' disabled' : '') +
          ' data-action="opt" data-c="' + c + '" data-v="' + v.id + '"' +
          (isOff ? ' title="' + U.esc(tc(dm.reasons[c + ':' + v.id] || {})) + '"' : '') + '>' +
          (v.swatch ? '<i class="swatch" style="background:' + v.swatch + (v.swatch === 'transparent' ? ';border-style:dashed' : '') + '"></i>' : '') +
          U.esc(tc(v.label)) + delta + '</button>';
      }).join('');
      return '<div class="' + (compact ? 'step' : 'opt') + '">' +
        '<div class="' + (compact ? 'step__title' : 'opt__head') + '"><b>' + U.esc(tc(attr.name)) + '</b>' +
        (compact ? '<em>' + U.esc(current ? tc(current.label) : '') + '</em>' : '<span>' + U.esc(current ? tc(current.label) : '') + '</span>') + '</div>' +
        '<div class="opt__list">' + vals + '</div>' +
        (whyShown ? '<p class="mono" style="margin-top:9px;text-transform:none;letter-spacing:0">' + U.esc(tc(whyShown)) + '</p>' : '') +
        '</div>';
    }).join('');
  }

  function priceBlock(p) {
    var est = U.estimate(p);
    return '<div class="pdp__price" id="price">' + U.money(D.price(p, sel)) +
      '<small>' + t('p.free') + ' · ' + t('p.inHands') + ' ' + est.total[0] + '–' + est.total[1] + ' ' + t('p.days') + '</small></div>';
  }

  function facts(p) {
    var est = U.estimate(p);
    return '<div class="facts">' +
      '<div class="fact"><b>' + t('p.sku') + '</b><span class="num" id="sku">' + S.skuFor(p, sel) + '</span></div>' +
      '<div class="fact"><b>' + t('p.madeToOrder') + '</b><span>' + t('p.production') + ' ' + est.production[0] + '–' + est.production[1] + ' ' + t('p.days') + '</span></div>' +
      '<div class="fact"><b>' + t('p.delivery') + '</b><span>' + est.delivery[0] + '–' + est.delivery[1] + ' ' + t('p.days') + ' · ' + t('p.free') + '</span></div>' +
      '<div class="fact"><b>' + t('filter.category') + '</b><span><a class="link" href="#/shop?cat=' + p.categoryId + '">' + U.esc(tc(D.catById(p.categoryId).name)) + '</a></span></div>' +
      '</div>';
  }

  function recommendations(p) {
    var firstTag = p.tags.filter(function (id) { var g = D.tagById(id); return g && (g.group === 'theme' || g.group === 'brand'); })[0];
    var tg = firstTag ? D.tagById(firstTag) : null;
    return '<div class="wrap">' +
      U.rail(t('p.similar'), SR.similar(p, 8)) +
      U.rail(t('p.worksWith'), SR.worksWith(p, 8)) +
      U.rail(t('p.moreStyle'), SR.sameStyle(p, 8)) +
      (tg ? U.rail(t('p.moreTag', { tag: tc(tg.name) }), SR.byTag(tg.id, 8, p.id), '#/tag/' + tg.slug) : '') +
      U.rail(t('p.alsoLike'), SR.alsoLike(p, 8)) +
      '</div>';
  }

  function repaint(root, p) {
    var g = gallery(p);
    var stage = U.qs('#stage', root);
    if (stage) {
      stage.innerHTML = '<img src="' + g[shot].url + '" alt="' + U.esc(tc(p.title)) + '"' + (g[shot].detail ? ' style="transform:scale(1.8);transform-origin:28% 32%"' : '') + '>';
    }
    var th = U.qs('#thumbs', root);
    if (th) th.innerHTML = g.map(function (x, i) {
      return '<button class="pdp__thumb' + (i === shot ? ' is-on' : '') + '" data-action="shot" data-i="' + i + '"><img src="' + x.url + '" alt=""></button>';
    }).join('');
    var opts = U.qs('#opts', root);
    if (opts) opts.innerHTML = optionBlock(p, opts.dataset.compact === '1');
    var price = U.qs('#price', root);
    if (price) price.innerHTML = U.money(D.price(p, sel)) + price.querySelector('small').outerHTML;
    var sku = U.qs('#sku', root);
    if (sku) sku.textContent = S.skuFor(p, sel);
    var q = U.qs('#qtyv', root);
    if (q) q.textContent = qty;
    var bp = U.qs('#bprice', root);
    if (bp) bp.textContent = U.money(D.price(p, sel) * qty);
  }

  function bindOptions(root, p) {
    K.app.bind('click', function (e) {
      var b = e.target.closest('[data-action]'); if (!b) return;
      var a = b.dataset.action;
      if (a === 'opt') {
        sel[b.dataset.c] = b.dataset.v;
        sel = D.reconcile(p, sel, b.dataset.c);
        repaint(root, p);
      }
      if (a === 'shot') { shot = parseInt(b.dataset.i, 10); repaint(root, p); }
      if (a === 'zoom') { var st = U.qs('#stage', root); if (st) st.classList.toggle('is-zoom'); }
      if (a === 'qty') { qty = Math.max(1, qty + parseInt(b.dataset.d, 10)); repaint(root, p); }
      if (a === 'buy') {
        S.addToCart(p.id, Object.assign({}, sel), qty);
        U.toast(t('p.added') + ' · ' + U.money(D.price(p, sel) * qty), { href: '#/cart', cta: t('cart.checkout') });
        qty = 1; repaint(root, p);
      }
      if (a === 'swap') {
        /* builder step 1 — change the artwork without leaving the configurator */
        location.hash = '#/build/' + b.dataset.id;
      }
    });
  }

  /* ---------- product page ------------------------------------------------- */

  K.views.product = {
    render: function (params) {
      var p = S.byId(params.id);
      if (!p) return '<div class="wrap">' + U.empty('err.404', '#/shop', t('err.404cta')) + '</div>';
      sel = Object.assign({}, D.PRODUCT_TYPES[p.typeId].defaults);
      qty = 1; shot = 0;
      S.pushRecent(p.id);
      U.setMeta({
        title: tc(p.title) + ' — KADR', description: tc(p.description).slice(0, 155),
        jsonld: U.productLd(p)
      });
      var builderOn = S.state.settings.features.productBuilder;
      var g = gallery(p);
      return '<div class="wrap">' +
        U.crumbs([{ label: 'KADR', href: '#/' }, { label: tc(D.catById(p.categoryId).name), href: '#/shop?cat=' + p.categoryId }, { label: tc(p.title) }]) +
        '<div class="pdp">' +
        '<div class="pdp__gallery">' +
          '<div class="pdp__stage" id="stage" data-action="zoom"><img src="' + g[0].url + '" alt="' + U.esc(tc(p.title)) + '"></div>' +
          '<div class="pdp__thumbs" id="thumbs"></div>' +
        '</div>' +
        '<div>' +
          '<p class="eyebrow">' + U.esc(tc(D.PRODUCT_TYPES[p.typeId].name)) + ' · ' + t('p.madeToOrder') + '</p>' +
          '<h1 class="h2 pdp__title">' + U.esc(tc(p.title)) + '</h1>' +
          priceBlock(p) +
          '<div class="opts" id="opts" data-compact="0">' + optionBlock(p) + '</div>' +
          (builderOn ? '<a class="link" href="#/build/' + p.id + '">' + t('p.customise') + ' →</a>' :
            '<p class="mono" style="text-transform:none;letter-spacing:0">' + t('p.builderOff') + '</p>') +
          '<div class="buybar">' +
            '<span class="qty"><button data-action="qty" data-d="-1" aria-label="−">−</button><span id="qtyv">1</span><button data-action="qty" data-d="1" aria-label="+">+</button></span>' +
            '<button class="btn btn--oxide" style="flex:1" data-action="buy">' + t('p.addToCart') + ' · <b id="bprice">' + U.money(D.price(p, sel)) + '</b></button>' +
            '<button class="iconbtn" data-action="fav" data-id="' + p.id + '" aria-label="' + t('p.fav') + '" style="border:1px solid var(--line);border-radius:100px;width:48px">' + U.heart() + '</button>' +
          '</div>' +
          '<p style="color:var(--ink-2);font-size:14px">' + U.esc(tc(p.description)) + '</p>' +
          facts(p) +
          '<div class="chips" style="margin-top:22px">' + p.tags.slice(0, 8).map(function (id) { return U.tagChip(id); }).join('') + '</div>' +
        '</div></div></div>' + recommendations(p);
    },
    mount: function (root, params) {
      var p = S.byId(params.id); if (!p) return;
      repaint(root, p);
      bindOptions(root, p);
      U.hydrateImages(root);
    }
  };

  /* ---------- builder ------------------------------------------------------- */

  K.views.builder = {
    render: function (params) {
      var p = S.byId(params.id);
      if (!p) return '<div class="wrap">' + U.empty('err.404', '#/shop', t('err.404cta')) + '</div>';
      if (!S.state.settings.features.productBuilder) { location.hash = '#/p/' + p.id; return ''; }
      sel = Object.assign({}, D.PRODUCT_TYPES[p.typeId].defaults);
      qty = 1;
      U.setMeta({ title: t('p.customise') + ' — ' + tc(p.title), description: 'Configure your print.' });
      var swaps = SR.similar(p, 7);
      return '<div class="wrap">' +
        U.crumbs([{ label: 'KADR', href: '#/' }, { label: tc(p.title), href: '#/p/' + p.id }, { label: t('p.customise') }]) +
        '<div class="builder">' +
        '<div class="builder__preview"><img id="bimg" src="' + D.imageFor(p, sel, 700) + '" alt=""></div>' +
        '<div>' +
          '<p class="eyebrow">' + t('p.customise') + '</p>' +
          '<h1 class="h2" style="margin:14px 0 6px">' + U.esc(tc(p.title)) + '</h1>' +
          '<p class="lede" style="font-size:15px">' + tc({ en: 'Every step updates the preview and the price. Options that cannot be produced together switch themselves off.',
            hy: 'Յուրաքանչյուր քայլ թարմացնում է նախադիտումն ու գինը։', ru: 'Каждый шаг обновляет превью и цену.' }) + '</p>' +
          '<div class="steps">' +
            '<div class="step"><div class="step__title"><b>' + tc({ en: 'Artwork', hy: 'Գործ', ru: 'Работа' }) + '</b><em>' + U.esc(tc(p.title)) + '</em></div>' +
            '<div class="rail__track" style="grid-auto-columns:86px">' +
              swaps.map(function (o) { return '<button class="pdp__thumb" style="width:86px" data-action="swap" data-id="' + o.id + '">' + U.artImg(o, null, 180) + '</button>'; }).join('') +
            '</div></div>' +
            '<div id="opts" data-compact="1">' + optionBlock(p, true) + '</div>' +
          '</div>' +
          '<div class="summary" style="position:static;margin-top:26px">' +
            '<div class="srow"><span>' + t('p.sku') + '</span><span class="num" id="sku">' + S.skuFor(p, sel) + '</span></div>' +
            '<div class="srow srow--total"><span>' + t('cart.total') + '</span><span class="num" id="bprice">' + U.money(D.price(p, sel)) + '</span></div>' +
            '<div class="buybar" style="margin-bottom:0">' +
              '<span class="qty"><button data-action="qty" data-d="-1">−</button><span id="qtyv">1</span><button data-action="qty" data-d="1">+</button></span>' +
              '<button class="btn btn--oxide" style="flex:1" data-action="buy">' + t('p.addToCart') + '</button>' +
            '</div>' +
          '</div>' +
        '</div></div></div>';
    },
    mount: function (root, params) {
      var p = S.byId(params.id); if (!p) return;
      bindOptions(root, p);
      K.app.bind('click', function () {
        var img = U.qs('#bimg', root);
        if (img) img.src = D.imageFor(p, sel, 700);
      });
      U.hydrateImages(root);
    }
  };
})(window.KADR = window.KADR || {});
