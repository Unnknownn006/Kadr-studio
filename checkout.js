/* Cart, checkout and order confirmation.
   Deliberately slow at the last step: nothing is bought without a full review. */
(function (K) {
  'use strict';
  var D = K.data, S = K.store, U = K.ui;
  var t = function (k, v) { return K.i18n.t(k, v); }, tc = function (o) { return K.i18n.tc(o); };
  K.views = K.views || {};

  /* ---------- cart ---------------------------------------------------------- */

  function lineRow(l) {
    var p = S.byId(l.productId); if (!p) return '';
    return '<div class="line">' +
      '<a href="#/p/' + p.id + '">' + U.artImg(p, l.options, 220) + '</a>' +
      '<div><a class="card__title" href="#/p/' + p.id + '">' + U.esc(tc(p.title)) + '</a>' +
        '<div class="line__opts">' + U.optionSummary(p, l.options) + '</div>' +
        '<div class="line__sku">' + S.skuFor(p, l.options) + '</div>' +
        '<div class="pillrow" style="margin-top:10px">' +
          '<span class="qty"><button data-action="line-qty" data-k="' + l.key + '" data-d="-1">−</button>' +
          '<span>' + l.qty + '</span><button data-action="line-qty" data-k="' + l.key + '" data-d="1">+</button></span>' +
          '<button class="chip" data-action="line-remove" data-k="' + l.key + '">' + t('cart.remove') + '</button>' +
        '</div></div>' +
      '<div style="text-align:right"><b class="num">' + U.money(S.linePrice(l)) + '</b>' +
      (l.qty > 1 ? '<div class="mono">' + U.money(S.linePrice(l) / l.qty) + ' ' + t('cart.each') + '</div>' : '') + '</div>' +
      '</div>';
  }

  function summary(showCta) {
    var total = S.cartTotal();
    return '<div class="summary">' +
      '<div class="srow"><span>' + t('cart.subtotal') + '</span><span class="num">' + U.money(total) + '</span></div>' +
      '<div class="srow"><span>' + t('cart.delivery') + '</span><span>' + t('home.brand.p3') + '</span></div>' +
      '<div class="srow srow--total"><span>' + t('cart.total') + '</span><span class="num">' + U.money(total) + '</span></div>' +
      (showCta ? '<a class="btn btn--oxide btn--full" style="margin-top:16px" href="#/checkout">' + t('cart.checkout') + '</a>' +
        '<a class="btn btn--ghost btn--full" style="margin-top:9px" href="#/shop">' + t('cart.continue') + '</a>' : '') +
      '<p class="mono" style="margin-top:14px;text-transform:none;letter-spacing:0">' + t('p.madeToOrder') + ' · ' + t('p.free') + '</p>' +
      '</div>';
  }

  K.views.cart = {
    render: function () {
      U.setMeta({ title: t('cart.title') + ' — KADR', description: 'Your cart.' });
      if (!S.state.cart.length) {
        return '<div class="wrap">' + K.vh.pageHead(t('cart.title')) +
          U.empty('cart.empty', '#/explore', t('cart.emptyCta')) + '</div>';
      }
      return '<div class="wrap">' + K.vh.pageHead(t('cart.title'), S.cartCount() + ' ' + tc({ en: 'items', hy: 'ապրանք', ru: 'товаров' })) +
        '<div class="cart"><div id="lines">' + S.state.cart.map(lineRow).join('') + '</div>' + summary(true) + '</div></div>';
    },
    mount: function (root) {
      K.app.bind('click', function (e) {
        var b = e.target.closest('[data-action]'); if (!b) return;
        if (b.dataset.action === 'line-qty') {
          var l = S.state.cart.filter(function (x) { return x.key === b.dataset.k; })[0];
          if (l) S.setQty(l.key, l.qty + parseInt(b.dataset.d, 10));
          K.app.rerender();
        }
        if (b.dataset.action === 'line-remove') { S.removeLine(b.dataset.k); K.app.rerender(); }
      });
    }
  };

  /* ---------- checkout ------------------------------------------------------ */

  var co = null;
  function freshCo() {
    var a = S.state.addresses[0];
    return {
      step: 0,
      customer: { name: (S.state.user && S.state.user.name) || '', email: (S.state.user && S.state.user.email) || '', phone: '' },
      address: a ? Object.assign({}, a) : { label: '', street: '', building: '', entrance: '', floor: '', apartment: '', intercom: '', elevator: true, courier: '', lat: 40.183, lng: 44.515, zone: 'yerevan' },
      slot: null, day: null, payment: null, saveAs: ''
    };
  }

  var STREETS = ['Abovyan', 'Saryan', 'Mashtots ave.', 'Tumanyan', 'Pushkin', 'Amiryan', 'Baghramyan ave.', 'Komitas ave.',
    'Nalbandyan', 'Teryan', 'Isahakyan', 'Koghbatsi', 'Arshakunyats ave.', 'Halabyan', 'Vardanants'];

  function mapSvg() {
    var g = '';
    for (var i = 1; i < 9; i++) g += '<line x1="' + i * 60 + '" y1="0" x2="' + (i * 60 - 30) + '" y2="300" stroke="var(--line)" stroke-width="1"/>';
    for (var j = 1; j < 6; j++) g += '<line x1="0" y1="' + j * 50 + '" x2="520" y2="' + (j * 50 + 8) + '" stroke="var(--line)" stroke-width="1"/>';
    return '<svg viewBox="0 0 520 300" preserveAspectRatio="none">' +
      '<rect width="520" height="300" fill="var(--paper-2)"/>' + g +
      '<circle cx="250" cy="150" r="46" fill="none" stroke="var(--line)" stroke-width="1"/>' +
      '<path d="M60 250 Q 200 210 460 240" fill="none" stroke="var(--line)" stroke-width="6" opacity=".6"/>' +
      '<text x="252" y="146" font-size="9" fill="var(--ink-3)" text-anchor="middle" letter-spacing="2">REPUBLIC SQ.</text></svg>';
  }

  function stepNav() {
    var labels = ['co.step.address', 'co.step.delivery', 'co.step.payment', 'co.step.review'];
    return '<div class="steps-nav">' + labels.map(function (k, i) {
      return '<i class="' + (i === co.step ? 'is-on' : (i < co.step ? 'is-done' : '')) + '">' + (i + 1) + ' · ' + t(k) + '</i>';
    }).join('') + '</div>';
  }

  function stepAddress() {
    var saved = S.state.addresses;
    return '<h2 class="h3" style="margin-bottom:18px">' + t('co.step.address') + '</h2>' +
      (saved.length ? '<p class="mono">' + t('co.saved') + '</p><div class="chips" style="margin:8px 0 22px">' +
        saved.map(function (a) { return '<button class="chip" data-action="use-addr" data-l="' + U.esc(a.label) + '">' + U.esc(a.label) + ' — ' + U.esc(a.street) + '</button>'; }).join('') + '</div>' : '') +
      '<label class="field"><span>' + t('co.name') + '</span><input id="cname" value="' + U.esc(co.customer.name) + '" autocomplete="name"></label>' +
      '<label class="field field--half"><span>' + t('co.email') + '</span><input id="cemail" type="email" value="' + U.esc(co.customer.email) + '" autocomplete="email"></label>' +
      '<label class="field field--half"><span>' + t('co.phone') + '</span><input id="cphone" type="tel" placeholder="+374 …" value="' + U.esc(co.customer.phone) + '" autocomplete="tel"></label>' +
      '<div class="pillrow" style="margin:10px 0 12px">' +
        '<button class="pill" data-action="geo">' + t('co.useLocation') + '</button>' +
        '<input class="select" id="astreet" list="streets" placeholder="' + t('co.searchAddress') + '" value="' + U.esc(co.address.street) + '" style="padding:8px 14px;min-width:220px">' +
        '<datalist id="streets">' + STREETS.map(function (s) { return '<option value="' + s + '">'; }).join('') + '</datalist>' +
      '</div>' +
      '<div class="map" id="map">' + mapSvg() +
        '<div class="map__pin" id="pin" style="left:50%;top:52%">' + U.icon('pin') + '</div>' +
        '<span class="map__hint">' + t('co.pinHint') + '</span></div>' +
      '<div style="margin-top:18px">' +
        '<label class="field field--half"><span>' + t('co.building') + '</span><input id="abuilding" value="' + U.esc(co.address.building) + '"></label>' +
        '<label class="field field--half"><span>' + t('co.entrance') + '</span><input id="aentrance" value="' + U.esc(co.address.entrance) + '"></label>' +
        '<label class="field field--half"><span>' + t('co.floor') + '</span><input id="afloor" value="' + U.esc(co.address.floor) + '"></label>' +
        '<label class="field field--half"><span>' + t('co.apartment') + '</span><input id="aapt" value="' + U.esc(co.address.apartment) + '"></label>' +
        '<label class="field field--half"><span>' + t('co.intercom') + '</span><input id="aintercom" value="' + U.esc(co.address.intercom) + '"></label>' +
        '<label class="field field--half"><span>' + t('co.saveAddress') + '</span><input id="asave" placeholder="Home / Work" value="' + U.esc(co.saveAs) + '"></label>' +
        '<label class="fopt"><input type="checkbox" id="aelev"' + (co.address.elevator ? ' checked' : '') + '> ' + t('co.elevator') + '</label>' +
        '<label class="field"><span>' + t('co.courier') + '</span><textarea id="acourier" rows="2">' + U.esc(co.address.courier) + '</textarea></label>' +
      '</div>';
  }

  function stepDelivery() {
    var s = S.state.settings.delivery;
    var zones = s.zones.filter(function (z) { return z.enabled; });
    var days = [];
    for (var i = 3; i < 8; i++) {
      var d = new Date(Date.now() + i * 86400000);
      days.push({ k: d.toISOString().slice(0, 10), label: d.toLocaleDateString(K.i18n.lang === 'ru' ? 'ru-RU' : 'en-GB', { weekday: 'short', day: 'numeric', month: 'short' }) });
    }
    return '<h2 class="h3" style="margin-bottom:18px">' + t('co.step.delivery') + '</h2>' +
      '<div class="fgroup"><div class="fgroup__title">' + tc({ en: 'Zone', hy: 'Գոտի', ru: 'Зона' }) + '</div>' +
        zones.map(function (z) {
          return '<label class="fopt"><input type="radio" name="zone" value="' + z.id + '"' + (co.address.zone === z.id ? ' checked' : '') + '>' +
            U.esc(tc(z.name)) + '<em class="n">' + z.days[0] + '–' + z.days[1] + ' ' + t('p.days') + '</em></label>';
        }).join('') + '</div>' +
      (S.state.settings.features.deliverySlots ?
        '<div style="margin-top:22px"><p class="mono">' + t('co.slot') + '</p>' +
        '<div class="chips" style="margin:10px 0 14px">' + days.map(function (d) {
          return '<button class="chip' + (co.day === d.k ? ' is-on' : '') + '" data-action="co-day" data-k="' + d.k + '">' + d.label + '</button>';
        }).join('') + '</div>' +
        '<div class="slots">' + S.state.settings.delivery.slots.map(function (sl) {
          return '<button class="slot' + (co.slot === sl ? ' is-on' : '') + '" data-action="co-slot" data-k="' + U.esc(sl) + '"><b>' + sl + '</b><span>' + t('p.free') + '</span></button>';
        }).join('') + '</div></div>'
        : '<p class="note">' + t('co.slotAny') + '</p>') +
      '<div class="note">' + t('p.madeToOrder') + ' — ' + t('p.production') + ' ' +
        S.state.settings.delivery.productionDays.join('–') + ' ' + t('p.days') + '.</div>';
  }

  function stepPayment() {
    var pm = S.state.settings.payments;
    var on = S.paymentOn();
    var c = S.state.settings.contact;
    if (!on) {
      /* Payment-disabled mode: no dead UI, a real route to a human instead. */
      return '<h2 class="h3" style="margin-bottom:18px">' + t('co.step.payment') + '</h2>' +
        '<div class="panel" style="border-color:var(--oxide)">' +
        '<h3 class="h3">' + t('co.payOff') + '</h3><p style="color:var(--ink-2)">' + t('co.payOffBody') + '</p>' +
        '<div class="contactrow">' +
          '<a class="btn btn--sm" href="https://instagram.com/" target="_blank" rel="noopener">Instagram ' + U.esc(c.instagram) + '</a>' +
          '<a class="btn btn--sm btn--ghost" href="https://wa.me/" target="_blank" rel="noopener">WhatsApp ' + U.esc(c.whatsapp) + '</a>' +
          '<a class="btn btn--sm btn--ghost" href="mailto:' + U.esc(c.email) + '">' + U.esc(c.email) + '</a>' +
        '</div></div>' +
        '<p class="mono" style="margin-top:16px;text-transform:none;letter-spacing:0">' +
        tc({ en: 'Your order is saved and sent to us as a request — we confirm payment personally.',
             hy: 'Ձեր պատվերը պահվում է որպես հարցում։', ru: 'Заказ сохраняется и отправляется нам как заявка.' }) + '</p>';
    }
    var opts = [];
    if (pm.card) opts.push(['card', t('co.payCard'), '•••• 4242']);
    if (pm.applePay) opts.push(['applePay', t('co.payApple'), '']);
    if (pm.googlePay) opts.push(['googlePay', t('co.payGoogle'), '']);
    if (pm.manual) opts.push(['manual', t('co.payManual'), '']);
    return '<h2 class="h3" style="margin-bottom:18px">' + t('co.step.payment') + '</h2>' +
      '<div class="pay">' + opts.map(function (o) {
        return '<label class="payopt' + (co.payment === o[0] ? ' is-on' : '') + '" data-action="co-pay" data-k="' + o[0] + '">' +
          '<input type="radio" name="pay"' + (co.payment === o[0] ? ' checked' : '') + '><b>' + o[1] + '</b>' +
          (o[2] ? '<span class="mono" style="margin-left:auto">' + o[2] + '</span>' : '') + '</label>';
      }).join('') + '</div>' +
      (co.payment === 'card' ? '<div class="panel" style="margin-top:16px"><p class="mono" style="text-transform:none;letter-spacing:0">' +
        tc({ en: 'Card details are entered on the payment provider’s page — this site never sees them.',
             hy: 'Քարտի տվյալները մուտքագրվում են վճարային համակարգի էջում։',
             ru: 'Данные карты вводятся на странице платёжного провайдера.' }) + '</p></div>' : '');
  }

  var PAY_LABEL = { card: 'co.payCard', applePay: 'co.payApple', googlePay: 'co.payGoogle', manual: 'co.payManual' };
  function paymentLabel(k) { return t(PAY_LABEL[k] || 'co.payManual'); }

  function stepReview() {
    var addr = co.address;
    return '<h2 class="h3" style="margin-bottom:18px">' + t('co.step.review') + '</h2>' +
      S.state.cart.map(lineRow).join('') +
      '<div class="panel" style="margin-top:20px">' +
        '<div class="srow"><span>' + t('co.name') + '</span><b>' + U.esc(co.customer.name || '—') + '</b></div>' +
        '<div class="srow"><span>' + t('co.phone') + '</span><b>' + U.esc(co.customer.phone || '—') + '</b></div>' +
        '<div class="srow"><span>' + t('co.step.address') + '</span><b style="text-align:right">' +
          U.esc([addr.street, addr.building, addr.apartment && ('#' + addr.apartment)].filter(Boolean).join(', ') || '—') + '</b></div>' +
        '<div class="srow"><span>' + t('co.slot') + '</span><b>' + U.esc(co.slot ? (co.day || '') + ' ' + co.slot : t('co.slotAny')) + '</b></div>' +
        '<div class="srow"><span>' + t('co.step.payment') + '</span><b>' + U.esc(paymentLabel(co.payment)) + '</b></div>' +
        '<div class="srow srow--total"><span>' + t('cart.total') + '</span><span class="num">' + U.money(S.cartTotal()) + '</span></div>' +
      '</div>' +
      '<button class="btn btn--oxide btn--full" style="margin-top:18px" data-action="co-place">' +
        (S.paymentOn() ? t('co.placeOrder') : t('co.sendOrder')) + ' · ' + U.money(S.cartTotal()) + '</button>' +
      '<p class="mono" style="margin-top:12px;text-transform:none;letter-spacing:0">' +
        tc({ en: 'This is the only button that charges you.', hy: 'Սա միակ կոճակն է, որ ավարտում է գնումը։', ru: 'Это единственная кнопка, которая завершает покупку.' }) + '</p>';
  }

  K.views.checkout = {
    render: function () {
      if (!S.state.cart.length) return '<div class="wrap">' + K.vh.pageHead(t('cart.title')) + U.empty('cart.empty', '#/explore', t('cart.emptyCta')) + '</div>';
      if (!co) co = freshCo();
      U.setMeta({ title: t('cart.checkout') + ' — KADR', description: 'Checkout' });
      var body = [stepAddress, stepDelivery, stepPayment, stepReview][co.step]();
      return '<div class="wrap" style="max-width:1100px">' + K.vh.pageHead(t('cart.checkout')) +
        '<div class="cart"><div>' + stepNav() + body +
        '<div class="pillrow" style="margin-top:26px">' +
          (co.step > 0 ? '<button class="btn btn--ghost" data-action="co-back">← ' + t('ui.back') + '</button>' : '<a class="btn btn--ghost" href="#/cart">← ' + t('cart.title') + '</a>') +
          (co.step < 3 ? '<button class="btn" data-action="co-next">' + t('ui.next') + ' →</button>' : '') +
        '</div></div>' + summary(false) + '</div></div>';
    },
    mount: function (root) {
      var map = U.qs('#map', root);
      if (map) {
        map.addEventListener('click', function (e) {
          var r = map.getBoundingClientRect();
          var x = ((e.clientX - r.left) / r.width * 100).toFixed(1);
          var y = ((e.clientY - r.top) / r.height * 100).toFixed(1);
          var pin = U.qs('#pin', root);
          pin.style.left = x + '%'; pin.style.top = y + '%';
          co.address.lat = 40.13 + (100 - y) / 100 * 0.12;
          co.address.lng = 44.44 + x / 100 * 0.14;
        });
      }
      function collect() {
        var g = function (id) { var n = U.qs('#' + id, root); return n ? n.value.trim() : ''; };
        if (U.qs('#cname', root)) {
          co.customer = { name: g('cname'), email: g('cemail'), phone: g('cphone') };
          co.address = Object.assign(co.address, {
            street: g('astreet'), building: g('abuilding'), entrance: g('aentrance'), floor: g('afloor'),
            apartment: g('aapt'), intercom: g('aintercom'), courier: g('acourier'),
            elevator: U.qs('#aelev', root) ? U.qs('#aelev', root).checked : true
          });
          co.saveAs = g('asave');
        }
      }
      K.app.bind('change', function (e) {
        if (e.target.name === 'zone') co.address.zone = e.target.value;
      });
      K.app.bind('click', function (e) {
        var b = e.target.closest('[data-action]'); if (!b) return;
        var a = b.dataset.action;
        if (a === 'co-next') {
          collect();
          if (co.step === 0 && (!co.customer.name || !co.customer.phone)) { U.toast(tc({ en: 'Name and phone, please.', hy: 'Անուն և հեռախոս։', ru: 'Имя и телефон, пожалуйста.' })); return; }
          if (co.step === 0 && co.saveAs) { S.saveAddress(Object.assign({}, co.address, { label: co.saveAs })); }
          if (co.step === 2 && S.paymentOn() && !co.payment) { U.toast(tc({ en: 'Choose a payment method.', hy: 'Ընտրեք վճարման եղանակ։', ru: 'Выберите способ оплаты.' })); return; }
          co.step++; K.app.rerender();
        }
        if (a === 'co-back') { collect(); co.step--; K.app.rerender(); }
        if (a === 'co-day') { co.day = b.dataset.k; K.app.rerender(); }
        if (a === 'co-slot') { co.slot = b.dataset.k; K.app.rerender(); }
        if (a === 'co-pay') { co.payment = b.dataset.k; K.app.rerender(); }
        if (a === 'use-addr') {
          var found = S.state.addresses.filter(function (x) { return x.label === b.dataset.l; })[0];
          if (found) { co.address = Object.assign({}, found); K.app.rerender(); }
        }
        if (a === 'geo') {
          if (!navigator.geolocation) { U.toast('Geolocation unavailable'); return; }
          navigator.geolocation.getCurrentPosition(function (pos) {
            co.address.lat = pos.coords.latitude; co.address.lng = pos.coords.longitude;
            U.toast(tc({ en: 'Location set — drag the pin to fine-tune.', hy: 'Տեղը սահմանված է։', ru: 'Местоположение получено.' }));
          }, function () { U.toast(tc({ en: 'Could not get location — place the pin manually.', hy: 'Չհաջողվեց։', ru: 'Не удалось — поставьте точку вручную.' })); });
        }
        if (a === 'co-place') {
          var order = S.createOrder({
            customer: co.customer, address: co.address,
            slot: co.slot ? (co.day || '') + ' ' + co.slot : null,
            paymentMethod: co.payment || 'manual',
            paymentStatus: S.paymentOn() && co.payment && co.payment !== 'manual' ? 'paid' : 'pending'
          });
          co = null;
          location.hash = '#/order/' + order.id;
        }
      });
    }
  };

  /* ---------- confirmation / tracking --------------------------------------- */

  K.views.order = {
    render: function (params) {
      var o = S.state.orders.filter(function (x) { return x.id === params.id; })[0];
      if (!o) return '<div class="wrap">' + U.empty('err.404', '#/', t('err.404cta')) + '</div>';
      U.setMeta({ title: o.id + ' — KADR', description: 'Order status' });
      var steps = ['new', 'confirmed', 'production', 'ready', 'shipped', 'out', 'delivered'];
      var at = steps.indexOf(o.status);
      return '<div class="wrap" style="max-width:900px">' +
        '<div style="text-align:center;padding:50px 0 26px">' +
          '<p class="eyebrow" style="justify-content:center">' + t('co.confirmed') + '</p>' +
          '<h1 class="h1" style="font-size:clamp(2rem,4vw,3rem);margin:16px 0 8px">' + o.id + '</h1>' +
          '<p class="lede" style="margin:0 auto">' + t('co.thanks') + '</p>' +
        '</div>' +
        (o.paymentStatus === 'pending' ? '<div class="note">' + t('co.payOff') + ' ' + t('co.payOffBody') + '</div>' : '') +
        '<div class="panel"><div class="steps-nav">' + steps.map(function (s, i) {
          return '<i class="' + (i === at ? 'is-on' : (i < at ? 'is-done' : '')) + '">' + tc(S.STATUS_LABEL[s]) + '</i>';
        }).join('') + '</div>' +
        o.items.map(function (it) {
          var p = S.byId(it.productId);
          return '<div class="line">' + (p ? U.artImg(p, it.options, 200) : '<div></div>') +
            '<div><b>' + U.esc(tc(it.title)) + '</b><div class="line__opts">' + (p ? U.optionSummary(p, it.options) : '') + '</div>' +
            '<div class="line__sku">' + it.sku + ' · × ' + it.qty + '</div></div>' +
            '<div class="num">' + U.money(it.unit * it.qty) + '</div></div>';
        }).join('') +
        '<div class="srow srow--total"><span>' + t('cart.total') + '</span><span class="num">' + U.money(o.total) + '</span></div></div>' +
        (!S.state.user ? '<div class="panel"><h3 class="h3">' + t('co.createAccount') + '</h3>' +
          '<div class="pillrow"><a class="btn btn--sm" href="#/account">' + t('acc.register') + '</a></div></div>' : '') +
        '<div class="pillrow" style="justify-content:center;margin-top:20px">' +
          '<a class="btn btn--ghost" href="#/account/orders">' + t('acc.orders') + '</a>' +
          '<a class="btn btn--ghost" href="#/explore">' + t('cart.continue') + '</a></div>' +
        '</div>';
    }
  };
})(window.KADR = window.KADR || {});
