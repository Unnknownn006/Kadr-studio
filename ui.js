/* KADR — DOM toolkit. Small on purpose: templates return HTML strings, one
   delegated click handler runs [data-action], images render only when seen. */
(function (K) {
  'use strict';
  var D = K.data, S = K.store, t = function (k, v) { return K.i18n.t(k, v); }, tc = function (o) { return K.i18n.tc(o); };

  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function qs(sel, root) { return (root || document).querySelector(sel); }
  function qsa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function money(a) { return S.money(a); }

  /* ---------- lazy artwork -------------------------------------------------- */

  var io = null;
  function ensureObserver() {
    if (io || !('IntersectionObserver' in window)) return;
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        paint(e.target);
        io.unobserve(e.target);
      });
    }, { rootMargin: '400px 0px' });
  }
  function paint(img) {
    if (img.dataset.painted) return;
    var p = S.byId(img.dataset.pid);
    if (!p) return;
    var opts = img.dataset.opts ? JSON.parse(img.dataset.opts) : null;
    img.src = D.imageFor(p, opts, parseInt(img.dataset.w, 10) || 520);
    img.dataset.painted = '1';
    img.classList.add('is-loaded');
  }
  function hydrateImages(root) {
    ensureObserver();
    qsa('img[data-pid]:not([data-painted])', root || document).forEach(function (img) {
      if (io) io.observe(img); else paint(img);
    });
  }
  function artImg(p, opts, w, cls) {
    var ratio = D.optionRatio(p, opts || D.PRODUCT_TYPES[p.typeId].defaults);
    return '<img class="art ' + (cls || '') + '" alt="' + esc(tc(p.title)) + '" loading="lazy" decoding="async"' +
      ' data-pid="' + p.id + '" data-w="' + (w || 520) + '"' +
      (opts ? ' data-opts=\'' + esc(JSON.stringify(opts)) + '\'' : '') +
      ' style="aspect-ratio:' + ratio.toFixed(3) + '">';
  }

  /* ---------- pieces -------------------------------------------------------- */

  function priceLabel(p) {
    var r = D.priceRange(p);
    return r.min === r.max ? money(r.min) : t('p.from') + ' ' + money(r.min);
  }

  function card(p, opt) {
    opt = opt || {};
    var fav = S.isFav(p.id);
    var badges = [];
    if (Date.now() - p.createdAt < 21 * 86400000) badges.push('<span class="badge">' + t('nav.new') + '</span>');
    if (K.search.isHot(p)) badges.push('<span class="badge badge--hot">' + t('home.trending') + '</span>');
    return '<article class="card' + (opt.wide ? ' card--wide' : '') + '">' +
      '<a class="card__media" href="#/p/' + p.id + '" data-track="card" data-pid="' + p.id + '">' +
        artImg(p, null, opt.w || 520) +
        (badges.length ? '<div class="card__badges">' + badges.join('') + '</div>' : '') +
      '</a>' +
      '<button class="card__fav' + (fav ? ' is-on' : '') + '" data-action="fav" data-id="' + p.id + '"' +
        ' aria-pressed="' + fav + '" aria-label="' + t('p.fav') + '">' + heart() + '</button>' +
      '<div class="card__body">' +
        '<a class="card__title" href="#/p/' + p.id + '">' + esc(tc(p.title)) + '</a>' +
        '<div class="card__meta"><span class="card__price">' + priceLabel(p) + '</span>' +
        '<span class="card__type">' + esc(tc(D.PRODUCT_TYPES[p.typeId].name)) + '</span></div>' +
      '</div></article>';
  }

  function heart() {
    return '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M12 20s-7.5-4.7-7.5-9.6A4.4 4.4 0 0 1 12 7.6a4.4 4.4 0 0 1 7.5 2.8C19.5 15.3 12 20 12 20z"/></svg>';
  }
  function icon(name) {
    var paths = {
      search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
      cart: '<path d="M4 6h16l-1.6 10.4a2 2 0 0 1-2 1.6H7.6a2 2 0 0 1-2-1.6L4 6z"/><path d="M9 6a3 3 0 0 1 6 0"/>',
      user: '<circle cx="12" cy="8.5" r="3.5"/><path d="M5 20c1.2-3.6 4-5.2 7-5.2s5.8 1.6 7 5.2"/>',
      menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
      close: '<path d="M6 6l12 12M18 6L6 18"/>',
      chev: '<path d="M9 6l6 6-6 6"/>',
      sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"/>',
      moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>',
      trash: '<path d="M5 7h14M10 7V5h4v2M7 7l1 12h8l1-12"/>',
      plus: '<path d="M12 5v14M5 12h14"/>',
      check: '<path d="M4 12l5 5L20 6"/>',
      pin: '<path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>'
    };
    return '<svg class="ic" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (paths[name] || '') + '</svg>';
  }

  function grid(products, opt) {
    if (!products.length) return empty(opt && opt.emptyKey);
    return '<div class="grid' + (opt && opt.dense ? ' grid--dense' : '') + '">' +
      products.map(function (p) { return card(p, opt); }).join('') + '</div>';
  }

  function rail(title, products, href) {
    if (!products.length) return '';
    return '<section class="rail">' +
      '<div class="rail__head"><h2 class="h2">' + esc(title) + '</h2>' +
      (href ? '<a class="link" href="' + href + '">' + t('ui.seeAll') + ' →</a>' : '') + '</div>' +
      '<div class="rail__track">' + products.map(function (p) { return card(p, { w: 420 }); }).join('') + '</div>' +
      '</section>';
  }

  function empty(key, ctaHref, ctaLabel, hint) {
    return '<div class="empty">' +
      '<p class="empty__title">' + esc(key ? t(key) : t('search.none')) + '</p>' +
      (hint ? '<p class="lede" style="margin:0 auto 18px">' + esc(hint) + '</p>' : '') +
      (ctaHref ? '<a class="btn btn--ghost" href="' + ctaHref + '">' + esc(ctaLabel) + '</a>' : '') +
      '</div>';
  }

  function tagChip(id, active) {
    var tg = D.tagById(id); if (!tg) return '';
    var color = D.TAG_COLORS[id];
    return '<a class="chip' + (active ? ' is-on' : '') + '" href="#/tag/' + tg.slug + '" data-action="tagclick" data-id="' + id + '">' +
      (color ? '<i class="swatch" style="background:' + color + '"></i>' : '') + esc(tc(tg.name)) + '</a>';
  }

  function crumbs(items) {
    return '<nav class="crumbs" aria-label="Breadcrumb">' + items.map(function (i, ix) {
      return (i.href ? '<a href="' + i.href + '">' + esc(i.label) + '</a>' : '<span>' + esc(i.label) + '</span>') +
        (ix < items.length - 1 ? '<span class="crumbs__sep">/</span>' : '');
    }).join('') + '</nav>';
  }

  /* ---------- feedback ------------------------------------------------------ */

  var toastTimer = null;
  function toast(msg, opts) {
    var host = qs('#toasts');
    if (!host) return;
    host.innerHTML = '<div class="toast' + (opts && opts.kind ? ' toast--' + opts.kind : '') + '" role="status">' +
      '<span>' + esc(msg) + '</span>' +
      (opts && opts.href ? '<a class="toast__cta" href="' + opts.href + '">' + esc(opts.cta || t('nav.cart')) + '</a>' : '') + '</div>';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { host.innerHTML = ''; }, opts && opts.ms || 3200);
  }

  var modalCloser = null;
  function modal(opts) {
    var host = qs('#modal');
    host.innerHTML =
      '<div class="modal__scrim" data-action="modal-close"></div>' +
      '<div class="modal__panel" role="dialog" aria-modal="true" aria-label="' + esc(opts.title || '') + '">' +
        '<header class="modal__head"><h2>' + esc(opts.title || '') + '</h2>' +
        '<button class="iconbtn" data-action="modal-close" aria-label="' + t('nav.close') + '">' + icon('close') + '</button></header>' +
        '<div class="modal__body">' + opts.body + '</div>' +
        (opts.footer ? '<footer class="modal__foot">' + opts.footer + '</footer>' : '') +
      '</div>';
    host.hidden = false;
    document.body.classList.add('is-locked');
    hydrateImages(host);
    modalCloser = opts.onClose || null;
    var f = host.querySelector('.modal__panel [autofocus], .modal__panel button, .modal__panel a');
    if (f) f.focus();
  }
  function closeModal() {
    var host = qs('#modal');
    host.hidden = true; host.innerHTML = '';
    document.body.classList.remove('is-locked');
    if (modalCloser) { var f = modalCloser; modalCloser = null; f(); }
  }

  function drawer(id, open) {
    var d = qs('#' + id);
    if (!d) return;
    d.classList.toggle('is-open', open);
    d.hidden = !open;
    document.body.classList.toggle('is-locked', open);
  }

  /* ---------- head / SEO ---------------------------------------------------- */

  function setMeta(o) {
    document.title = o.title;
    setTag('meta[name="description"]', 'content', o.description || '');
    setTag('meta[property="og:title"]', 'content', o.ogTitle || o.title);
    setTag('meta[property="og:description"]', 'content', o.description || '');
    setTag('link[rel="canonical"]', 'href', location.href.split('#')[0] + (o.path || ''));
    var ld = qs('#ld-json');
    if (ld) ld.textContent = o.jsonld ? JSON.stringify(o.jsonld) : '';
  }
  function setTag(sel, attr, val) {
    var n = qs(sel);
    if (n) n.setAttribute(attr, val);
  }
  function productLd(p) {
    var r = D.priceRange(p);
    return {
      '@context': 'https://schema.org', '@type': 'Product',
      name: tc(p.title), sku: p.sku, description: tc(p.description),
      category: tc(D.catById(p.categoryId).name),
      brand: { '@type': 'Brand', name: 'KADR' },
      offers: { '@type': 'AggregateOffer', priceCurrency: 'AMD', lowPrice: r.min, highPrice: r.max, availability: 'https://schema.org/MadeToOrder' }
    };
  }

  /* ---------- misc ---------------------------------------------------------- */

  function estimate(p) {
    var s = S.state.settings.delivery;
    var prod = p && p.productionDays || s.productionDays;
    var zone = s.zones.filter(function (z) { return z.enabled; })[0] || { days: [1, 2] };
    return {
      production: prod, delivery: zone.days,
      total: [prod[0] + zone.days[0], prod[1] + zone.days[1]]
    };
  }
  function optionSummary(p, options) {
    var type = D.PRODUCT_TYPES[p.typeId];
    return type.components.map(function (c) {
      var v = D.valueOf(c, options[c]);
      return v ? tc(v.label) : null;
    }).filter(Boolean).join(' · ');
  }
  function skeleton(n) {
    var out = '';
    for (var i = 0; i < (n || 8); i++) out += '<div class="card card--skel"><div class="skel"></div></div>';
    return '<div class="grid">' + out + '</div>';
  }

  K.ui = {
    esc: esc, qs: qs, qsa: qsa, money: money, card: card, grid: grid, rail: rail,
    artImg: artImg, hydrateImages: hydrateImages, paint: paint, icon: icon, heart: heart,
    empty: empty, tagChip: tagChip, crumbs: crumbs, toast: toast, modal: modal,
    closeModal: closeModal, drawer: drawer, setMeta: setMeta, productLd: productLd,
    priceLabel: priceLabel, estimate: estimate, optionSummary: optionSummary, skeleton: skeleton
  };
})(window.KADR = window.KADR || {});
