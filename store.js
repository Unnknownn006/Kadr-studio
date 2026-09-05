/* KADR — client state.
   Stands in for the API: everything here would be server-side in production
   (cart, orders, events, settings). Kept behind one interface so swapping in
   fetch() calls later touches only this file. */
(function (K) {
  'use strict';
  var D = K.data;

  /* localStorage can throw (private mode, file:// in some browsers) — never let
     persistence failure break the page. */
  var mem = {};
  var LS = (function () {
    try { window.localStorage.setItem('__k', '1'); window.localStorage.removeItem('__k'); return window.localStorage; }
    catch (e) { return { getItem: function (k) { return mem[k] || null; }, setItem: function (k, v) { mem[k] = v; }, removeItem: function (k) { delete mem[k]; } }; }
  })();

  var NS = 'kadr.v1.';
  function load(key, fallback) {
    try { var raw = LS.getItem(NS + key); return raw ? JSON.parse(raw) : fallback; }
    catch (e) { return fallback; }
  }
  function save(key, value) {
    try { LS.setItem(NS + key, JSON.stringify(value)); } catch (e) { /* quota / private mode */ }
  }
  function deepMerge(base, over) {
    var out = Array.isArray(base) ? base.slice() : Object.assign({}, base);
    Object.keys(over || {}).forEach(function (k) {
      if (over[k] && typeof over[k] === 'object' && !Array.isArray(over[k]) && base && typeof base[k] === 'object' && !Array.isArray(base[k])) {
        out[k] = deepMerge(base[k], over[k]);
      } else out[k] = over[k];
    });
    return out;
  }

  var listeners = [];
  function emit(what) { listeners.forEach(function (fn) { fn(what); }); }

  var now = Date.now();
  var products = D.makeProducts(now);
  var productIndex = {};
  products.forEach(function (p) { productIndex[p.id] = p; });

  var state = {
    lang: load('lang', 'en'),
    currency: load('currency', 'AMD'),
    theme: load('theme', null),   /* null = follow the OS / host until the user chooses */
    cart: load('cart', []),
    favorites: load('favorites', []),
    recent: load('recent', []),
    prefs: load('prefs', null),
    affinity: load('affinity', {}),
    orders: load('orders', []),
    addresses: load('addresses', []),
    user: load('user', null),
    events: load('events', []),
    searches: load('searches', []),
    settings: deepMerge(D.DEFAULT_SETTINGS, load('settings', {})),
    wall: load('wall', null),
    productPatch: load('productPatch', {})   /* admin edits over generated catalogue */
  };

  /* admin edits are applied on top of the generated catalogue */
  function applyPatches() {
    Object.keys(state.productPatch).forEach(function (id) {
      if (productIndex[id]) Object.assign(productIndex[id], state.productPatch[id]);
    });
  }
  applyPatches();

  /* ---------- money -------------------------------------------------------- */

  function money(amd, curCode) {
    var c = D.CURRENCIES[curCode || state.currency] || D.CURRENCIES.AMD;
    var v = amd * c.rate;
    var s = c.dec ? v.toFixed(c.dec) : Math.round(v).toLocaleString('en-US').replace(/,/g, ' ');
    if (c.dec) s = Number(v.toFixed(c.dec)).toLocaleString('en-US', { minimumFractionDigits: c.dec });
    return c.pos === 'before' ? c.symbol + s : s + ' ' + c.symbol;
  }

  /* ---------- analytics + behavioural personalisation ---------------------- */

  var AFFINITY_WEIGHT = { view: 1, tag: 2, search: 2, fav: 5, cart: 6, purchase: 10, scene: 2, collection: 2 };

  function track(type, payload) {
    var ev = { t: type, at: Date.now(), p: payload || {} };
    state.events.push(ev);
    if (state.events.length > 600) state.events = state.events.slice(-600);
    save('events', state.events);

    var w = AFFINITY_WEIGHT[type];
    if (w && payload) {
      var tags = payload.tags || (payload.tag ? [payload.tag] : []);
      if (payload.productId && productIndex[payload.productId]) tags = tags.concat(productIndex[payload.productId].tags);
      tags.forEach(function (t) { state.affinity[t] = (state.affinity[t] || 0) + w; });
      /* decay keeps the feed responsive to a change of taste */
      var keys = Object.keys(state.affinity);
      if (keys.length && Math.random() < 0.15) keys.forEach(function (k) { state.affinity[k] *= 0.985; });
      save('affinity', state.affinity);
    }
  }

  /* Preference answers count as a strong but *non-exclusive* signal: they seed
     affinity rather than filtering the catalogue, so behaviour can override. */
  function setPrefs(p) {
    state.prefs = p; save('prefs', p);
    var seed = [].concat(p.rooms || [], p.styles || [], p.colors || [], p.interests || [], p.moods || []);
    seed.forEach(function (t) { state.affinity[t] = (state.affinity[t] || 0) + 8; });
    save('affinity', state.affinity);
    emit('prefs');
  }
  function resetPrefs() {
    state.prefs = null; save('prefs', null);
    emit('prefs');   /* affinity deliberately survives: behaviour keeps learning */
  }

  function affinityScore(tags) {
    var s = 0;
    (tags || []).forEach(function (t) { s += state.affinity[t] || 0; });
    return s;
  }

  /* ---------- favorites / recent ------------------------------------------- */

  function isFav(id) { return state.favorites.indexOf(id) >= 0; }
  function toggleFav(id) {
    var i = state.favorites.indexOf(id);
    if (i >= 0) state.favorites.splice(i, 1);
    else { state.favorites.unshift(id); track('fav', { productId: id }); }
    save('favorites', state.favorites); emit('favorites');
    return isFav(id);
  }
  function pushRecent(id) {
    state.recent = [id].concat(state.recent.filter(function (x) { return x !== id; })).slice(0, 30);
    save('recent', state.recent);
    track('view', { productId: id });
  }

  /* ---------- cart ---------------------------------------------------------- */

  function lineKey(productId, options) {
    return productId + '|' + Object.keys(options || {}).sort().map(function (k) { return k + '=' + options[k]; }).join(',');
  }
  function addToCart(productId, options, qty) {
    var p = productIndex[productId]; if (!p) return;
    var opts = options || Object.assign({}, D.PRODUCT_TYPES[p.typeId].defaults);
    var key = lineKey(productId, opts);
    var line = state.cart.filter(function (l) { return l.key === key; })[0];
    if (line) line.qty += (qty || 1);
    else state.cart.push({ key: key, productId: productId, options: opts, qty: qty || 1, addedAt: Date.now() });
    save('cart', state.cart);
    track('cart', { productId: productId });
    emit('cart');
  }
  function setQty(key, qty) {
    state.cart = state.cart.map(function (l) { return l.key === key ? Object.assign({}, l, { qty: Math.max(1, qty) }) : l; });
    save('cart', state.cart); emit('cart');
  }
  function removeLine(key) {
    state.cart = state.cart.filter(function (l) { return l.key !== key; });
    save('cart', state.cart); emit('cart');
  }
  function clearCart() { state.cart = []; save('cart', state.cart); emit('cart'); }
  function cartCount() { return state.cart.reduce(function (n, l) { return n + l.qty; }, 0); }
  function linePrice(line) {
    var p = productIndex[line.productId]; if (!p) return 0;
    return D.price(p, line.options) * line.qty;
  }
  function cartTotal() { return state.cart.reduce(function (n, l) { return n + linePrice(l); }, 0); }

  /* ---------- orders -------------------------------------------------------- */

  var STATUSES = ['new', 'confirmed', 'production', 'ready', 'shipped', 'out', 'delivered', 'cancelled', 'refunded'];
  var STATUS_LABEL = {
    new:        { en: 'New', hy: 'Նոր', ru: 'Новый' },
    confirmed:  { en: 'Confirmed', hy: 'Հաստատված', ru: 'Подтверждён' },
    production: { en: 'In production', hy: 'Արտադրության մեջ', ru: 'В производстве' },
    ready:      { en: 'Ready', hy: 'Պատրաստ', ru: 'Готов' },
    shipped:    { en: 'Shipped', hy: 'Ուղարկված', ru: 'Отправлен' },
    out:        { en: 'Out for delivery', hy: 'Առաքման ճանապարհին', ru: 'Курьер в пути' },
    delivered:  { en: 'Delivered', hy: 'Առաքված', ru: 'Доставлен' },
    cancelled:  { en: 'Cancelled', hy: 'Չեղարկված', ru: 'Отменён' },
    refunded:   { en: 'Refunded', hy: 'Վերադարձված', ru: 'Возвращён' }
  };

  function nextOrderNo() {
    var year = new Date().getFullYear();
    var n = 183 + state.orders.length + 1;
    return 'ORD-' + year + '-' + String(n).padStart(6, '0');
  }
  function createOrder(payload) {
    var order = {
      id: nextOrderNo(),
      at: Date.now(),
      status: payload.paymentStatus === 'paid' ? 'confirmed' : 'new',
      paymentStatus: payload.paymentStatus,
      paymentMethod: payload.paymentMethod,
      customer: payload.customer,
      address: payload.address,
      slot: payload.slot || null,
      items: state.cart.map(function (l) {
        var p = productIndex[l.productId];
        return {
          productId: l.productId, sku: skuFor(p, l.options), title: p.title,
          options: l.options, qty: l.qty, unit: D.price(p, l.options),
          files: p.files, typeId: p.typeId
        };
      }),
      total: cartTotal(),
      currency: state.currency,
      history: [{ status: payload.paymentStatus === 'paid' ? 'confirmed' : 'new', at: Date.now() }]
    };
    state.orders.unshift(order);
    save('orders', state.orders);
    track('purchase', { tags: order.items.reduce(function (a, i) { return a.concat(productIndex[i.productId].tags); }, []) });
    clearCart();
    emit('orders');
    return order;
  }
  function setOrderStatus(id, status) {
    state.orders = state.orders.map(function (o) {
      if (o.id !== id) return o;
      return Object.assign({}, o, { status: status, history: o.history.concat([{ status: status, at: Date.now() }]) });
    });
    save('orders', state.orders); emit('orders');
  }

  /* Variant SKU: base SKU plus a deterministic option suffix, so the factory
     brief is unambiguous without a lookup. */
  function skuFor(product, options) {
    var type = D.PRODUCT_TYPES[product.typeId];
    var parts = type.components.map(function (c) {
      var v = options && options[c]; if (!v) return '';
      return String(v).replace(/[^a-z0-9]/gi, '').slice(0, 4).toUpperCase();
    }).filter(Boolean);
    return product.sku + (parts.length ? '-' + parts.join('-') : '');
  }

  /* ---------- addresses / auth (mock) -------------------------------------- */

  function saveAddress(addr) {
    var i = state.addresses.findIndex(function (a) { return a.label === addr.label; });
    if (i >= 0) state.addresses[i] = addr; else state.addresses.push(addr);
    save('addresses', state.addresses); emit('addresses');
  }
  function removeAddress(label) {
    state.addresses = state.addresses.filter(function (a) { return a.label !== label; });
    save('addresses', state.addresses); emit('addresses');
  }
  function signIn(email, name) {
    state.user = { email: email, name: name || email.split('@')[0], since: Date.now() };
    save('user', state.user); emit('user');
  }
  function signOut() { state.user = null; save('user', null); emit('user'); }

  /* ---------- settings (admin) --------------------------------------------- */

  function updateSettings(patch) {
    state.settings = deepMerge(state.settings, patch);
    save('settings', state.settings);
    emit('settings');
  }
  function resetSettings() {
    state.settings = JSON.parse(JSON.stringify(D.DEFAULT_SETTINGS));
    save('settings', {});
    emit('settings');
  }
  function patchProduct(id, patch) {
    state.productPatch[id] = Object.assign({}, state.productPatch[id], patch);
    save('productPatch', state.productPatch);
    Object.assign(productIndex[id], patch);
    emit('products');
  }
  function paymentOn() {
    var p = state.settings.payments;
    return !!(p.card || p.applePay || p.googlePay);
  }

  function setLang(l) { state.lang = l; save('lang', l); K.i18n.set(l); emit('lang'); }
  function setCurrency(c) { state.currency = c; save('currency', c); emit('currency'); }
  function setTheme(t) { state.theme = t; save('theme', t); document.documentElement.dataset.theme = t; emit('theme'); }
  function setWall(w) { state.wall = w; save('wall', w); }
  function rememberSearch(q) {
    if (!q || q.length < 2) return;
    state.searches = [q].concat(state.searches.filter(function (s) { return s !== q; })).slice(0, 8);
    save('searches', state.searches);
    track('search', { q: q });
  }

  K.store = {
    state: state,
    products: products,
    byId: function (id) { return productIndex[id]; },
    live: function () { return products.filter(function (p) { return p.status === 'live'; }); },
    on: function (fn) { listeners.push(fn); },
    emit: emit,
    money: money, track: track,
    setPrefs: setPrefs, resetPrefs: resetPrefs, affinityScore: affinityScore,
    isFav: isFav, toggleFav: toggleFav, pushRecent: pushRecent,
    addToCart: addToCart, setQty: setQty, removeLine: removeLine, clearCart: clearCart,
    cartCount: cartCount, cartTotal: cartTotal, linePrice: linePrice, lineKey: lineKey,
    createOrder: createOrder, setOrderStatus: setOrderStatus, STATUSES: STATUSES, STATUS_LABEL: STATUS_LABEL,
    skuFor: skuFor,
    saveAddress: saveAddress, removeAddress: removeAddress, signIn: signIn, signOut: signOut,
    updateSettings: updateSettings, resetSettings: resetSettings, patchProduct: patchProduct,
    paymentOn: paymentOn,
    setLang: setLang, setCurrency: setCurrency, setTheme: setTheme, setWall: setWall,
    rememberSearch: rememberSearch
  };
})(window.KADR = window.KADR || {});
