/* KADR — router, chrome and global actions. */
(function (K) {
  'use strict';
  var D = K.data, S = K.store, U = K.ui;
  var t = function (k, v) { return K.i18n.t(k, v); }, tc = function (o) { return K.i18n.tc(o); };

  var ROUTES = [
    [/^\/?$/, 'home'],
    [/^\/explore$/, 'explore'],
    [/^\/shop$/, 'shop'],
    [/^\/search$/, 'search'],
    [/^\/p\/([^/]+)$/, 'product', ['id']],
    [/^\/build\/([^/]+)$/, 'builder', ['id']],
    [/^\/tag\/([^/]+)$/, 'tag', ['id']],
    [/^\/collections$/, 'collections'],
    [/^\/collection\/([^/]+)$/, 'collection', ['id']],
    [/^\/rooms$/, 'rooms'],
    [/^\/room\/([^/]+)$/, 'scene', ['id']],
    [/^\/composer$/, 'composer'],
    [/^\/favorites$/, 'favorites'],
    [/^\/cart$/, 'cart'],
    [/^\/checkout$/, 'checkout'],
    [/^\/order\/([^/]+)$/, 'order', ['id']],
    [/^\/preferences$/, 'preferences'],
    [/^\/account(?:\/([^/]+))?$/, 'account', ['tab']],
    [/^\/about$/, 'about'],
    [/^\/contact$/, 'contact'],
    [/^\/legal\/([^/]+)$/, 'legal', ['id']],
    [/^\/admin(?:\/([^/]+))?$/, 'admin', ['section']]
  ];

  var current = { name: 'home', params: {} };

  /* View listeners live on `document` (so modals and drawers are covered) and
     are torn down on every render, so nothing accumulates across navigations. */
  var viewHandlers = [];
  function bind(type, fn) {
    document.addEventListener(type, fn);
    viewHandlers.push({ type: type, fn: fn });
  }
  function unbindAll() {
    viewHandlers.forEach(function (h) { document.removeEventListener(h.type, h.fn); });
    viewHandlers = [];
  }

  function parse() {
    var raw = location.hash.replace(/^#/, '') || '/';
    var qi = raw.indexOf('?');
    var path = qi >= 0 ? raw.slice(0, qi) : raw;
    var qs = qi >= 0 ? raw.slice(qi + 1) : '';
    var params = {};
    qs.split('&').filter(Boolean).forEach(function (kv) {
      var p = kv.split('=');
      params[decodeURIComponent(p[0])] = decodeURIComponent((p[1] || '').replace(/\+/g, ' '));
    });
    for (var i = 0; i < ROUTES.length; i++) {
      var m = path.match(ROUTES[i][0]);
      if (m) {
        (ROUTES[i][2] || []).forEach(function (name, ix) { if (m[ix + 1] != null) params[name] = m[ix + 1]; });
        return { name: ROUTES[i][1], params: params };
      }
    }
    return { name: '404', params: params };
  }

  /* ---------- chrome ---------------------------------------------------------- */

  function header() {
    var cart = S.cartCount();
    var favs = S.state.favorites.length;
    var langs = K.i18n.langs.filter(function (l) { return S.state.settings.languages[l.code]; });
    var curs = Object.keys(D.CURRENCIES).filter(function (c) { return S.state.settings.currencies[c]; });
    var nav = [['#/shop', 'nav.shop'], ['#/explore', 'nav.explore'], ['#/collections', 'nav.collections'],
      ['#/rooms', 'nav.rooms'], ['#/shop?sort=new', 'nav.new']];
    if (S.state.settings.features.completeYourRoom) nav.push(['#/composer', 'nav.builder']);
    var hash = location.hash;
    return '<div class="head__in">' +
      '<button class="iconbtn nav--mob" data-action="menu" aria-label="' + t('nav.menu') + '">' + U.icon('menu') + '</button>' +
      '<a class="logo" href="#/">KADR<sup>studio</sup></a>' +
      '<nav class="nav">' + nav.map(function (n) {
        return '<a href="' + n[0] + '" class="' + (hash === n[0] ? 'is-active' : '') + '">' + t(n[1]) + '</a>';
      }).join('') + '</nav>' +
      '<div class="head__tools">' +
        '<select class="pill" data-action="lang-sel" aria-label="' + t('ui.language') + '">' +
          langs.map(function (l) { return '<option value="' + l.code + '"' + (K.i18n.lang === l.code ? ' selected' : '') + '>' + l.short + '</option>'; }).join('') + '</select>' +
        '<select class="pill" data-action="cur-sel" aria-label="' + t('ui.currency') + '">' +
          curs.map(function (c) { return '<option value="' + c + '"' + (S.state.currency === c ? ' selected' : '') + '>' + c + '</option>'; }).join('') + '</select>' +
        '<button class="iconbtn" data-action="theme" aria-label="' + t('nav.theme') + '">' + U.icon(S.state.theme === 'dark' ? 'sun' : 'moon') + '</button>' +
        '<a class="iconbtn" href="#/search" aria-label="' + t('nav.search') + '">' + U.icon('search') + '</a>' +
        '<a class="iconbtn" href="#/favorites" aria-label="' + t('nav.favorites') + '">' + U.heart() +
          (favs ? '<span class="count">' + favs + '</span>' : '') + '</a>' +
        '<a class="iconbtn" href="#/account" aria-label="' + t('nav.account') + '">' + U.icon('user') + '</a>' +
        '<a class="iconbtn" href="#/cart" aria-label="' + t('nav.cart') + '">' + U.icon('cart') +
          (cart ? '<span class="count">' + cart + '</span>' : '') + '</a>' +
      '</div></div>';
  }

  function menuDrawer() {
    var links = [['#/shop', 'nav.shop'], ['#/explore', 'nav.explore'], ['#/collections', 'nav.collections'],
      ['#/rooms', 'nav.rooms'], ['#/composer', 'nav.builder'], ['#/favorites', 'nav.favorites'],
      ['#/account', 'nav.account'], ['#/about', 'nav.about'], ['#/contact', 'nav.contact'], ['#/admin', 'nav.admin']];
    return '<div class="drawer__scrim" data-action="menu-close"></div><div class="drawer__panel">' +
      '<div class="drawer__head"><span class="logo">KADR</span>' +
      '<button class="iconbtn" data-action="menu-close" aria-label="' + t('nav.close') + '">' + U.icon('close') + '</button></div>' +
      '<div class="drawer__body">' + links.map(function (l) {
        return '<a href="' + l[0] + '" data-action="menu-close" style="display:block;padding:13px 0;border-bottom:1px solid var(--line-soft);font-family:var(--fd);font-size:20px">' + t(l[1]) + '</a>';
      }).join('') + '</div></div>';
  }

  function footer() {
    var c = S.state.settings.contact;
    return '<footer class="foot"><div class="wrap"><div class="foot__grid">' +
      '<div><a class="logo" href="#/">KADR<sup>studio</sup></a>' +
      '<p class="lede" style="font-size:14px;margin-top:14px;max-width:34ch">' + t('home.hero.sub') + '</p>' +
      '<div class="pillrow" style="margin-top:16px">' +
        '<a class="chip" href="https://instagram.com/" target="_blank" rel="noopener">' + U.esc(c.instagram) + '</a>' +
        '<a class="chip" href="mailto:' + U.esc(c.email) + '">' + U.esc(c.email) + '</a></div></div>' +
      '<div><h4>' + t('nav.shop') + '</h4>' +
        '<a href="#/shop?cat=posters">' + tc(D.catById('posters').name) + '</a>' +
        '<a href="#/shop?cat=framed">' + tc(D.catById('framed').name) + '</a>' +
        '<a href="#/shop?cat=flags">' + tc(D.catById('flags').name) + '</a>' +
        '<a href="#/shop?cat=objects">' + tc(D.catById('objects').name) + '</a>' +
        '<a href="#/collections">' + t('nav.collections') + '</a></div>' +
      '<div><h4>' + t('foot.help') + '</h4>' +
        '<a href="#/about">' + t('nav.about') + '</a>' +
        '<a href="#/contact">' + t('nav.contact') + '</a>' +
        '<a href="#/account/orders">' + t('acc.orders') + '</a>' +
        '<a href="#/legal/delivery">' + t('foot.deliveryPolicy') + '</a>' +
        '<a href="#/legal/returns">' + t('foot.returns') + '</a></div>' +
      '<div><h4>' + t('foot.legal') + '</h4>' +
        '<a href="#/legal/privacy">' + t('foot.privacy') + '</a>' +
        '<a href="#/legal/terms">' + t('foot.terms') + '</a>' +
        '<a href="#/legal/payment">' + t('foot.payment') + '</a>' +
        '<a href="#/admin">' + t('nav.admin') + '</a></div>' +
      '</div><div class="foot__bottom"><span>© ' + new Date().getFullYear() + ' KADR — ' + t('foot.rights') + '</span>' +
      '<span>' + (S.paymentOn() ? 'Online payment enabled' : t('co.payOff')) + '</span></div></div></footer>';
  }

  /* ---------- render ---------------------------------------------------------- */

  function render() {
    unbindAll();
    var r = parse();
    current = r;
    var view = K.views[r.name];
    var root = U.qs('#app');
    U.qs('#head').innerHTML = header();

    if (!view) {
      root.innerHTML = '<div class="wrap">' + U.empty('err.404', '#/', t('err.404cta')) + '</div>';
    } else {
      root.innerHTML = view.render(r.params) || '';
      if (view.mount) view.mount(root, r.params);
    }
    U.qs('#foot').innerHTML = footer();
    U.hydrateImages(document);
    document.documentElement.lang = K.i18n.lang;
  }

  function rerender() {
    var y = window.scrollY;
    render();
    window.scrollTo(0, y);
  }

  /* ---------- global actions --------------------------------------------------- */

  function bindGlobal() {
    document.addEventListener('click', function (e) {
      var b = e.target.closest('[data-action]');
      if (!b) return;
      var a = b.dataset.action;
      if (a === 'fav') {
        var on = S.toggleFav(b.dataset.id);
        b.classList.toggle('is-on', on);
        b.setAttribute('aria-pressed', String(on));
        U.qs('#head').innerHTML = header();
        U.toast(on ? t('p.faved') : t('p.fav'));
        e.preventDefault();
      }
      if (a === 'menu') U.drawer('menu', true);
      if (a === 'menu-close') U.drawer('menu', false);
      if (a === 'modal-close') U.closeModal();
      if (a === 'theme') { S.setTheme(S.state.theme === 'dark' ? 'light' : 'dark'); U.qs('#head').innerHTML = header(); }
      if (a === 'lang') { S.setLang(b.dataset.k); render(); }
      if (a === 'cur') { S.setCurrency(b.dataset.k); render(); }
      if (a === 'tagclick') S.track('tag', { tag: b.dataset.id });
      if (a === 'card') S.track('view', { productId: b.dataset.pid });
    });

    document.addEventListener('change', function (e) {
      var a = e.target.dataset ? e.target.dataset.action : null;
      if (a === 'lang-sel') { S.setLang(e.target.value); render(); }
      if (a === 'cur-sel') { S.setCurrency(e.target.value); render(); }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        U.closeModal();
        U.drawer('menu', false);
      }
      if (e.key === '/' && !/input|textarea|select/i.test(e.target.tagName)) {
        e.preventDefault();
        location.hash = '#/search';
      }
    });

    window.addEventListener('hashchange', function () {
      render();
      window.scrollTo(0, 0);
    });
  }

  /* ---------- boot -------------------------------------------------------------- */

  function boot() {
    K.i18n.set(S.state.lang);
    if (!S.state.theme) {
      /* No stored choice: follow the host page, then the OS. */
      S.state.theme = document.documentElement.dataset.theme ||
        (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    }
    document.documentElement.dataset.theme = S.state.theme;
    U.qs('#menu').innerHTML = menuDrawer();
    K.search.build();
    bindGlobal();
    render();

    /* the storefront reflects admin changes without a reload */
    S.on(function (what) {
      if (what === 'settings' || what === 'lang' || what === 'currency') U.qs('#head').innerHTML = header();
      if (what === 'cart' || what === 'favorites') U.qs('#head').innerHTML = header();
    });
  }

  K.app = { render: render, rerender: rerender, boot: boot, bind: bind, get route() { return current; } };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})(window.KADR = window.KADR || {});
