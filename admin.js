/* Admin panel. The point of the whole build: the company runs the site without
   developers. Every switch here changes the storefront immediately. */
(function (K) {
  'use strict';
  var D = K.data, S = K.store, U = K.ui, SR = K.search, VH = K.vh;
  var t = function (k, v) { return K.i18n.t(k, v); }, tc = function (o) { return K.i18n.tc(o); };
  K.views = K.views || {};

  var SECTIONS = [
    ['', 'Dashboard'], ['products', 'Products'], ['orders', 'Orders'], ['tags', 'Tags'],
    ['attributes', 'Attributes'], ['collections', 'Collections'], ['inspiration', 'Inspiration'],
    ['homepage', 'Homepage'], ['delivery', 'Delivery'], ['payments', 'Payments'],
    ['features', 'Features'], ['analytics', 'Analytics'], ['seo', 'SEO'], ['customers', 'Customers']
  ];

  var prodFilter = { q: '', status: 'all', page: 1 };
  var bulk = {};

  function nav(active) {
    return '<nav class="sidenav">' + SECTIONS.map(function (s) {
      return '<a href="#/admin' + (s[0] ? '/' + s[0] : '') + '" class="' + (active === s[0] ? 'is-active' : '') + '">' + s[1] + '</a>';
    }).join('') + '</nav>';
  }
  function tog(on, action, key) {
    return '<button class="tog' + (on ? ' is-on' : '') + '" data-action="' + action + '" data-k="' + key + '" role="switch" aria-checked="' + on + '"></button>';
  }
  function row(label, sub, control) {
    return '<div class="switch"><div><b>' + U.esc(label) + '</b>' + (sub ? '<small>' + U.esc(sub) + '</small>' : '') + '</div>' + control + '</div>';
  }

  /* ---------- dashboard ------------------------------------------------------ */

  function dashboard() {
    var ev = S.state.events;
    var since = Date.now() - 7 * 86400000;
    var recent = ev.filter(function (e) { return e.at > since; });
    var counts = {};
    recent.forEach(function (e) { counts[e.t] = (counts[e.t] || 0) + 1; });
    var open = S.state.orders.filter(function (o) { return ['new', 'confirmed', 'production'].indexOf(o.status) >= 0; });
    return '<div class="panel"><h3 class="h3">This week</h3><div class="stat">' +
      '<div><b class="num">' + (counts.view || 0) + '</b><span>product views</span></div>' +
      '<div><b class="num">' + (counts.search || 0) + '</b><span>searches</span></div>' +
      '<div><b class="num">' + (counts.cart || 0) + '</b><span>cart adds</span></div>' +
      '<div><b class="num">' + (counts.fav || 0) + '</b><span>favourites</span></div>' +
      '<div><b class="num">' + S.state.orders.length + '</b><span>orders</span></div>' +
      '<div><b class="num">' + open.length + '</b><span>need production</span></div>' +
      '</div></div>' +
      '<div class="panel"><h3 class="h3">Needs you now</h3>' +
      (open.length ? '<table class="tbl"><tr><th>Order</th><th>Items</th><th>Total</th><th>Status</th><th></th></tr>' +
        open.map(function (o) {
          return '<tr><td class="num">' + o.id + '</td><td>' + o.items.length + '</td><td class="num">' + U.money(o.total) + '</td>' +
            '<td><span class="status status--' + o.status + '">' + tc(S.STATUS_LABEL[o.status]) + '</span></td>' +
            '<td><button class="chip" data-action="ad-order" data-id="' + o.id + '">Open</button></td></tr>';
        }).join('') + '</table>'
        : '<p style="color:var(--ink-3)">No open orders. Place one on the storefront to see the production flow.</p>') + '</div>' +
      '<div class="panel"><h3 class="h3">Catalogue</h3><div class="stat">' +
      '<div><b class="num">' + S.products.length + '</b><span>products</span></div>' +
      '<div><b class="num">' + S.live().length + '</b><span>live</span></div>' +
      '<div><b class="num">' + D.TAGS.length + '</b><span>tags</span></div>' +
      '<div><b class="num">' + D.COLLECTIONS.length + '</b><span>collections</span></div>' +
      '<div><b class="num">' + D.SCENES.length + '</b><span>room scenes</span></div>' +
      '<div><b class="num">' + Object.keys(D.ATTRIBUTES).length + '</b><span>attributes</span></div>' +
      '</div></div>';
  }

  /* ---------- products -------------------------------------------------------- */

  function productList() {
    var list = S.products.filter(function (p) {
      if (prodFilter.status !== 'all' && p.status !== prodFilter.status) return false;
      if (!prodFilter.q) return true;
      var q = prodFilter.q.toLowerCase();
      return (p.sku + ' ' + tc(p.title)).toLowerCase().indexOf(q) >= 0;
    });
    var shown = list.slice(0, prodFilter.page * 25);
    var nBulk = Object.keys(bulk).filter(function (k) { return bulk[k]; }).length;
    return '<div class="panel">' +
      '<div class="toolbar" style="margin:0 0 14px">' +
        '<div class="pillrow">' +
          '<input class="select" id="pq" placeholder="Search SKU or title" value="' + U.esc(prodFilter.q) + '" style="padding:8px 14px;min-width:220px">' +
          '<select class="select" id="pstatus"><option value="all">All</option><option value="live"' + (prodFilter.status === 'live' ? ' selected' : '') + '>Live</option><option value="draft"' + (prodFilter.status === 'draft' ? ' selected' : '') + '>Draft</option></select>' +
        '</div>' +
        '<div class="pillrow"><button class="chip" data-action="ad-csv">Export CSV</button>' +
        '<button class="chip" data-action="ad-new">+ New product</button></div>' +
      '</div>' +
      (nBulk ? '<div class="note"><b>' + nBulk + ' selected</b> — ' +
        '<button class="chip" data-action="bulk-live">Publish</button> ' +
        '<button class="chip" data-action="bulk-draft">Unpublish</button> ' +
        '<button class="chip" data-action="bulk-price">Price ±10%</button> ' +
        '<button class="chip" data-action="bulk-tag">Add tag…</button> ' +
        '<button class="chip" data-action="bulk-clear">Clear</button></div>' : '') +
      '<div style="overflow-x:auto"><table class="tbl">' +
      '<tr><th><input type="checkbox" data-action="bulk-all"></th><th></th><th>SKU</th><th>Title</th><th>Type</th><th>Price from</th><th>Tags</th><th>Status</th><th></th></tr>' +
      shown.map(function (p) {
        return '<tr><td><input type="checkbox" class="bulkbox" data-id="' + p.id + '"' + (bulk[p.id] ? ' checked' : '') + '></td>' +
          '<td>' + U.artImg(p, null, 120) + '</td>' +
          '<td class="num">' + p.sku + '</td>' +
          '<td><b>' + U.esc(tc(p.title)) + '</b></td>' +
          '<td>' + U.esc(tc(D.PRODUCT_TYPES[p.typeId].name)) + '</td>' +
          '<td class="num">' + U.money(D.priceRange(p).min) + '</td>' +
          '<td>' + p.tags.slice(0, 3).map(function (id) { var g = D.tagById(id); return g ? U.esc(tc(g.name)) : ''; }).join(', ') + '</td>' +
          '<td><span class="status status--' + (p.status === 'live' ? 'delivered' : 'new') + '">' + p.status + '</span></td>' +
          '<td><button class="chip" data-action="ad-edit" data-id="' + p.id + '">Edit</button></td></tr>';
      }).join('') + '</table></div>' +
      (list.length > shown.length ? '<div style="text-align:center;margin-top:16px"><button class="btn btn--sm btn--ghost" data-action="ad-more">Load more (' + (list.length - shown.length) + ')</button></div>' : '') +
      '</div>';
  }

  function editModal(p) {
    U.modal({
      title: p.sku,
      body: '<div class="two"><div>' + U.artImg(p, null, 320) + '</div><div>' +
        '<label class="field"><span>Title (EN)</span><input id="e-en" value="' + U.esc(p.title.en) + '"></label>' +
        '<label class="field"><span>Title (HY)</span><input id="e-hy" value="' + U.esc(p.title.hy) + '"></label>' +
        '<label class="field"><span>Title (RU)</span><input id="e-ru" value="' + U.esc(p.title.ru) + '"></label>' +
        '<label class="field field--half"><span>Base price (AMD)</span><input id="e-price" type="number" value="' + p.basePrice + '"></label>' +
        '<label class="field field--half"><span>Status</span><select id="e-status"><option value="live"' + (p.status === 'live' ? ' selected' : '') + '>live</option><option value="draft"' + (p.status === 'draft' ? ' selected' : '') + '>draft</option></select></label>' +
        '<label class="field field--half"><span>Production days</span><input id="e-prod" value="' + p.productionDays.join('-') + '"></label>' +
        '<label class="field field--half"><span>Delivery days</span><input id="e-del" value="' + p.deliveryDays.join('-') + '"></label>' +
        '</div></div>' +
        '<p class="mono">Production files</p><ul style="font-size:13px;color:var(--ink-2)">' +
        p.files.map(function (f) { return '<li>' + U.esc(f.name) + ' — ' + f.kind + ', ' + f.size + '</li>'; }).join('') + '</ul>' +
        '<p class="mono">Variant SKUs generated automatically — e.g. ' + S.skuFor(p, D.PRODUCT_TYPES[p.typeId].defaults) + '</p>',
      footer: '<button class="btn btn--ghost" data-action="modal-close">' + t('ui.cancel') + '</button>' +
        '<button class="btn btn--oxide" data-action="ad-save" data-id="' + p.id + '">' + t('ui.save') + '</button>'
    });
  }

  /* ---------- orders / production --------------------------------------------- */

  function orderList() {
    if (!S.state.orders.length) return '<div class="panel"><p style="color:var(--ink-3)">No orders yet — place one on the storefront.</p></div>';
    return '<div class="panel"><table class="tbl"><tr><th>Order</th><th>Date</th><th>Customer</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th><th></th></tr>' +
      S.state.orders.map(function (o) {
        return '<tr><td class="num">' + o.id + '</td><td>' + new Date(o.at).toLocaleDateString() + '</td>' +
          '<td>' + U.esc(o.customer.name || '—') + '<br><span class="mono">' + U.esc(o.customer.phone || '') + '</span></td>' +
          '<td>' + o.items.length + '</td><td class="num">' + U.money(o.total) + '</td>' +
          '<td><span class="status">' + o.paymentStatus + '</span></td>' +
          '<td><span class="status status--' + o.status + '">' + tc(S.STATUS_LABEL[o.status]) + '</span></td>' +
          '<td><button class="chip" data-action="ad-order" data-id="' + o.id + '">Open</button></td></tr>';
      }).join('') + '</table></div>';
  }

  /* The production brief: everything the factory needs, nothing to look up. */
  function factoryBrief(o) {
    var lines = o.items.map(function (it) {
      var p = S.byId(it.productId);
      var file = (it.files && it.files[0] && it.files[0].name) || '—';
      return [
        'SKU        : ' + it.sku,
        'ITEM       : ' + tc(it.title),
        'SPEC       : ' + (p ? U.optionSummary(p, it.options) : ''),
        'QTY        : ' + it.qty,
        'PRINT FILE : ' + file
      ].join('\n');
    }).join('\n\n');
    return 'ORDER      : ' + o.id + '\n' +
      'DATE       : ' + new Date(o.at).toLocaleString() + '\n' +
      'DELIVER TO : ' + [o.address.street, o.address.building, o.address.apartment && ('apt ' + o.address.apartment)].filter(Boolean).join(', ') + '\n' +
      'CONTACT    : ' + (o.customer.name || '') + ' ' + (o.customer.phone || '') + '\n' +
      'WINDOW     : ' + (o.slot || 'any') + '\n' +
      '--------------------------------------------\n' + lines;
  }

  function orderModal(o) {
    U.modal({
      title: o.id,
      body: '<div class="pillrow" style="margin-bottom:14px">' + S.STATUSES.map(function (s) {
          return '<button class="chip' + (o.status === s ? ' is-on' : '') + '" data-action="ad-status" data-id="' + o.id + '" data-s="' + s + '">' + tc(S.STATUS_LABEL[s]) + '</button>';
        }).join('') + '</div>' +
        '<p class="mono">Production brief — copy straight to the factory</p>' +
        '<div class="factory" id="brief">' + U.esc(factoryBrief(o)) + '</div>' +
        '<div class="pillrow" style="margin-top:12px"><button class="chip" data-action="ad-copy">' + t('ui.copy') + '</button></div>' +
        '<hr class="hr"><p class="mono">Items</p>' +
        o.items.map(function (it) {
          var p = S.byId(it.productId);
          return '<div class="line">' + (p ? U.artImg(p, it.options, 160) : '<div></div>') +
            '<div><b>' + U.esc(tc(it.title)) + '</b><div class="line__sku">' + it.sku + '</div>' +
            '<div class="line__opts">' + (p ? U.optionSummary(p, it.options) : '') + '</div>' +
            '<div class="mono">' + (it.files || []).map(function (f) { return f.name; }).join(' · ') + '</div></div>' +
            '<div class="num">× ' + it.qty + '</div></div>';
        }).join(''),
      footer: '<button class="btn btn--ghost" data-action="modal-close">' + t('nav.close') + '</button>'
    });
  }

  /* ---------- other sections --------------------------------------------------- */

  function tagsPanel() {
    var counts = {};
    S.products.forEach(function (p) { p.tags.forEach(function (id) { counts[id] = (counts[id] || 0) + 1; }); });
    return '<div class="panel"><h3 class="h3">Tags</h3>' +
      '<div class="pillrow" style="margin-bottom:14px"><input class="select" id="newtag" placeholder="New tag name" style="padding:8px 14px">' +
      '<button class="chip" data-action="tag-new">Create</button>' +
      '<button class="chip" data-action="tag-merge">Merge two tags…</button></div>' +
      '<table class="tbl"><tr><th>Tag</th><th>Group</th><th>Products</th><th>Page</th></tr>' +
      D.TAGS.map(function (tg) {
        return '<tr><td><b>' + U.esc(tc(tg.name)) + '</b></td><td>' + tg.group + '</td><td class="num">' + (counts[tg.id] || 0) + '</td>' +
          '<td><a class="link" href="#/tag/' + tg.slug + '">/tags/' + tg.slug + '</a></td></tr>';
      }).join('') + '</table></div>';
  }

  function attributesPanel() {
    return Object.keys(D.ATTRIBUTES).map(function (k) {
      var a = D.ATTRIBUTES[k];
      return '<div class="panel"><div class="section__head" style="margin-bottom:10px"><h3 class="h3">' + U.esc(tc(a.name)) + '</h3>' +
        '<span class="mono">' + a.type + (a.filterable ? ' · filterable' : '') + '</span></div>' +
        '<table class="tbl"><tr><th>Value</th><th>Price effect</th><th>Used by</th></tr>' +
        a.values.map(function (v) {
          var used = Object.keys(D.PRODUCT_TYPES).filter(function (tk) { return D.PRODUCT_TYPES[tk].components.indexOf(k) >= 0; })
            .map(function (tk) { return tc(D.PRODUCT_TYPES[tk].name); }).join(', ');
          return '<tr><td>' + U.esc(tc(v.label)) + '</td><td class="num">' + (v.factor ? '× ' + v.factor : (v.add ? '+ ' + U.money(v.add) : '—')) + '</td><td>' + U.esc(used) + '</td></tr>';
        }).join('') + '</table></div>';
    }).join('') +
    '<div class="panel"><h3 class="h3">Rules</h3><table class="tbl"><tr><th>Type</th><th>When</th><th>Disables</th></tr>' +
    Object.keys(D.PRODUCT_TYPES).map(function (k) {
      return (D.PRODUCT_TYPES[k].rules || []).map(function (r) {
        return '<tr><td>' + tc(D.PRODUCT_TYPES[k].name) + '</td><td class="mono">' + U.esc(JSON.stringify(r.when)) + '</td><td class="mono">' + U.esc(JSON.stringify(r.disable)) + '</td></tr>';
      }).join('');
    }).join('') + '</table></div>';
  }

  function homepagePanel() {
    return '<div class="panel"><h3 class="h3">Homepage blocks</h3>' +
      '<p style="color:var(--ink-3);font-size:13px">Switch a block off and it disappears from the storefront — no empty space left behind.</p>' +
      S.state.settings.homepage.map(function (b, i) {
        return '<div class="switch"><div><b>' + U.esc(tc(b.label)) + '</b><small>' + b.id + '</small></div>' +
          '<div class="pillrow">' +
          '<button class="chip" data-action="hp-up" data-i="' + i + '">↑</button>' +
          '<button class="chip" data-action="hp-down" data-i="' + i + '">↓</button>' +
          tog(b.on, 'hp-toggle', b.id) + '</div></div>';
      }).join('') + '</div>';
  }

  function deliveryPanel() {
    var d = S.state.settings.delivery;
    return '<div class="panel"><h3 class="h3">Zones</h3>' +
      d.zones.map(function (z) {
        return row(tc(z.name), z.days[0] + '–' + z.days[1] + ' business days', tog(z.enabled, 'zone-toggle', z.id));
      }).join('') + '</div>' +
      '<div class="panel"><h3 class="h3">Time slots</h3>' +
      row('Let customers pick a delivery window', 'When off, the whole control disappears from checkout', tog(S.state.settings.features.deliverySlots, 'feature-toggle', 'deliverySlots')) +
      '<div class="chips" style="margin-top:12px">' + d.slots.map(function (s) { return '<span class="chip">' + s + '</span>'; }).join('') + '</div></div>' +
      '<div class="panel"><h3 class="h3">Production time</h3>' +
      '<label class="field field--half"><span>Min days</span><input id="pdmin" type="number" value="' + d.productionDays[0] + '"></label>' +
      '<label class="field field--half"><span>Max days</span><input id="pdmax" type="number" value="' + d.productionDays[1] + '"></label>' +
      '<button class="btn btn--sm" data-action="save-prod">' + t('ui.save') + '</button></div>';
  }

  function paymentsPanel() {
    var p = S.state.settings.payments;
    var on = S.paymentOn();
    return '<div class="panel"><h3 class="h3">Payment methods</h3>' +
      '<p style="color:var(--ink-3);font-size:13px">With every online method off, checkout switches to manual contact mode automatically.</p>' +
      row('Bank card', 'via payment provider', tog(p.card, 'pay-toggle', 'card')) +
      row('Apple Pay', '', tog(p.applePay, 'pay-toggle', 'applePay')) +
      row('Google Pay', '', tog(p.googlePay, 'pay-toggle', 'googlePay')) +
      row('Manual / contact us', 'Instagram, WhatsApp, email', tog(p.manual, 'pay-toggle', 'manual')) +
      '<div class="note" style="margin-top:16px">Checkout is currently in <b>' + (on ? 'online payment' : 'manual contact') + '</b> mode.</div></div>' +
      '<div class="panel"><h3 class="h3">Contacts shown when payment is off</h3>' +
      '<label class="field field--half"><span>Instagram</span><input id="c-ig" value="' + U.esc(S.state.settings.contact.instagram) + '"></label>' +
      '<label class="field field--half"><span>WhatsApp</span><input id="c-wa" value="' + U.esc(S.state.settings.contact.whatsapp) + '"></label>' +
      '<label class="field"><span>Email</span><input id="c-em" value="' + U.esc(S.state.settings.contact.email) + '"></label>' +
      '<button class="btn btn--sm" data-action="save-contact">' + t('ui.save') + '</button></div>';
  }

  function featuresPanel() {
    var f = S.state.settings.features;
    return '<div class="panel"><h3 class="h3">Features</h3>' +
      row('Product Builder', 'Full configurator. Off = predefined variants only.', tog(f.productBuilder, 'feature-toggle', 'productBuilder')) +
      row('Complete Your Room', 'The wall composition tool', tog(f.completeYourRoom, 'feature-toggle', 'completeYourRoom')) +
      row('Delivery time slots', '', tog(f.deliverySlots, 'feature-toggle', 'deliverySlots')) +
      row('Personalisation', 'Behavioural feed ranking', tog(f.personalization, 'feature-toggle', 'personalization')) +
      row('Guest checkout', '', tog(f.guestCheckout, 'feature-toggle', 'guestCheckout')) +
      '</div>' +
      '<div class="panel"><h3 class="h3">Languages</h3>' +
      K.i18n.langs.map(function (l) { return row(l.label, l.code, tog(S.state.settings.languages[l.code], 'lang-toggle', l.code)); }).join('') + '</div>' +
      '<div class="panel"><h3 class="h3">Currencies</h3>' +
      Object.keys(D.CURRENCIES).map(function (c) {
        return row(c, '1 AMD = ' + D.CURRENCIES[c].rate + ' ' + c, tog(S.state.settings.currencies[c], 'cur-toggle', c));
      }).join('') + '</div>' +
      '<div class="panel"><button class="btn btn--sm btn--ghost" data-action="reset-settings">Reset all settings to defaults</button></div>';
  }

  function analyticsPanel() {
    var ev = S.state.events;
    var byTag = {}, searches = {}, byType = {};
    ev.forEach(function (e) {
      byType[e.t] = (byType[e.t] || 0) + 1;
      if (e.t === 'search' && e.p.q) searches[e.p.q] = (searches[e.p.q] || 0) + 1;
      if (e.p.productId) {
        var p = S.byId(e.p.productId);
        if (p) p.tags.forEach(function (id) { byTag[id] = (byTag[id] || 0) + 1; });
      }
      if (e.p.tag) byTag[e.p.tag] = (byTag[e.p.tag] || 0) + 1;
    });
    var funnel = [['view', 'Product views'], ['fav', 'Favourites'], ['cart', 'Cart adds'], ['purchase', 'Purchases']];
    var maxF = Math.max(1, byType.view || 1);
    return '<div class="panel"><h3 class="h3">Funnel (this browser)</h3>' +
      funnel.map(function (f) {
        var v = byType[f[0]] || 0;
        return '<div style="margin:10px 0"><div class="switch" style="border:0;padding:2px 0"><b>' + f[1] + '</b><span class="num">' + v + '</span></div>' +
          '<div style="height:6px;background:var(--paper-3);border-radius:3px"><div style="height:6px;width:' + Math.round(v / maxF * 100) + '%;background:var(--oxide);border-radius:3px"></div></div></div>';
      }).join('') + '</div>' +
      '<div class="panel"><h3 class="h3">Top tags</h3><div class="chips">' +
      Object.keys(byTag).sort(function (a, b) { return byTag[b] - byTag[a]; }).slice(0, 14).map(function (id) {
        var g = D.tagById(id); return g ? '<span class="chip">' + U.esc(tc(g.name)) + ' <em class="mono">' + byTag[id] + '</em></span>' : '';
      }).join('') + '</div></div>' +
      '<div class="panel"><h3 class="h3">Searches</h3>' +
      (Object.keys(searches).length ? '<div class="chips">' + Object.keys(searches).map(function (q) {
        return '<a class="chip" href="#/shop?q=' + encodeURIComponent(q) + '">' + U.esc(q) + ' <em class="mono">' + searches[q] + '</em></a>';
      }).join('') + '</div>' : '<p style="color:var(--ink-3)">No searches recorded yet.</p>') + '</div>' +
      '<div class="panel"><h3 class="h3">Wire-up</h3><p style="color:var(--ink-2);font-size:13.5px">' +
      'These counters come from the same event stream that feeds personalisation. In production the same calls fan out to Google Analytics, Meta Pixel and TikTok Pixel.</p>' +
      '<div class="factory">track(' + "'view'" + ', { productId })\ntrack(' + "'search'" + ', { q })\ntrack(' + "'cart'" + ', { productId })\ntrack(' + "'purchase'" + ', { tags })</div></div>';
  }

  function seoPanel() {
    var s = S.state.settings.seo;
    return '<div class="panel"><h3 class="h3">Site metadata</h3>' +
      '<label class="field"><span>Title</span><input id="seo-t" value="' + U.esc(s.title) + '"></label>' +
      '<label class="field"><span>Meta description</span><textarea id="seo-d" rows="3">' + U.esc(s.description) + '</textarea></label>' +
      '<button class="btn btn--sm" data-action="save-seo">' + t('ui.save') + '</button></div>' +
      '<div class="panel"><h3 class="h3">Indexable URLs</h3><div class="factory">' +
      ['/products/{slug}', '/categories/{slug}', '/tags/{slug}', '/collections/{slug}', '/rooms/{slug}'].join('\n') +
      '\n\nsitemap.xml   ' + (S.live().length + D.TAGS.length + D.COLLECTIONS.length + D.SCENES.length + D.CATEGORIES.length) + ' URLs' +
      '\nrobots.txt    allow all, disallow /admin, /cart, /checkout' +
      '\nschema.org    Product · Organization · BreadcrumbList</div></div>';
  }

  function customersPanel() {
    var u = S.state.user;
    return '<div class="panel"><h3 class="h3">Customers</h3>' +
      (u ? '<table class="tbl"><tr><th>Email</th><th>Since</th><th>Orders</th><th>Favourites</th></tr>' +
        '<tr><td>' + U.esc(u.email) + '</td><td>' + new Date(u.since).toLocaleDateString() + '</td><td>' + S.state.orders.length + '</td><td>' + S.state.favorites.length + '</td></tr></table>'
        : '<p style="color:var(--ink-3)">No account signed in on this browser. Guests can order without registering.</p>') +
      '<p class="mono" style="margin-top:16px;text-transform:none;letter-spacing:0">Personal data access is role-gated in production: Owner and Order Manager see contact details, Content Manager does not.</p></div>' +
      '<div class="panel"><h3 class="h3">Roles</h3><table class="tbl"><tr><th>Role</th><th>Can</th></tr>' +
      [['Owner', 'everything, including settings and payments'],
       ['Administrator', 'catalogue, orders, content'],
       ['Content manager', 'products, images, tags, collections, inspiration'],
       ['Order manager', 'orders and production only'],
       ['Designer', 'images and room scenes']].map(function (r) {
        return '<tr><td><b>' + r[0] + '</b></td><td>' + r[1] + '</td></tr>';
      }).join('') + '</table></div>';
  }

  function collectionsPanel() {
    return '<div class="panel"><h3 class="h3">Collections</h3><table class="tbl"><tr><th>Name</th><th>Rule</th><th>Products</th><th>On homepage</th></tr>' +
      D.COLLECTIONS.map(function (c) {
        return '<tr><td><a class="link" href="#/collection/' + c.id + '">' + U.esc(tc(c.title)) + '</a></td>' +
          '<td class="mono">tags: ' + c.tags.join(', ') + (c.maxPrice ? ' · max ' + c.maxPrice : '') + '</td>' +
          '<td class="num">' + SR.collectionProducts(c.id).length + '</td>' +
          '<td>' + (c.featured ? '✓' : '—') + '</td></tr>';
      }).join('') + '</table>' +
      '<p class="mono" style="margin-top:12px;text-transform:none;letter-spacing:0">Collections are rule-based: assign a tag to a product and it joins every matching collection automatically.</p></div>';
  }

  function inspirationPanel() {
    return '<div class="panel"><h3 class="h3">Room scenes</h3><table class="tbl"><tr><th></th><th>Title</th><th>Room</th><th>Style</th><th>Linked products</th><th></th></tr>' +
      D.SCENES.map(function (s) {
        return '<tr><td><img src="' + VH.sceneUrl(s, 160, 110) + '" alt=""></td>' +
          '<td><b>' + U.esc(tc(s.title)) + '</b></td><td>' + s.room + '</td><td>' + s.style + '</td>' +
          '<td class="num">' + SR.sceneProducts(s).length + '</td>' +
          '<td><a class="chip" href="#/room/' + s.id + '">View</a></td></tr>';
      }).join('') + '</table></div>';
  }

  /* ---------- shell ------------------------------------------------------------ */

  K.views.admin = {
    render: function (params) {
      var sec = params.section || '';
      U.setMeta({ title: 'Admin — KADR', description: '' });
      var body =
        sec === 'products' ? productList() :
        sec === 'orders' ? orderList() :
        sec === 'tags' ? tagsPanel() :
        sec === 'attributes' ? attributesPanel() :
        sec === 'collections' ? collectionsPanel() :
        sec === 'inspiration' ? inspirationPanel() :
        sec === 'homepage' ? homepagePanel() :
        sec === 'delivery' ? deliveryPanel() :
        sec === 'payments' ? paymentsPanel() :
        sec === 'features' ? featuresPanel() :
        sec === 'analytics' ? analyticsPanel() :
        sec === 'seo' ? seoPanel() :
        sec === 'customers' ? customersPanel() : dashboard();
      return '<div class="wrap">' +
        '<header style="padding:34px 0 18px"><p class="eyebrow">Admin panel</p>' +
        '<h1 class="h2" style="margin-top:12px">' + (SECTIONS.filter(function (s) { return s[0] === sec; })[0] || SECTIONS[0])[1] + '</h1>' +
        '<p class="mono" style="text-transform:none;letter-spacing:0;margin-top:8px">Changes here take effect on the storefront immediately and persist in this browser.</p></header>' +
        '<div class="split">' + nav(sec) + '<div>' + body + '</div></div></div>';
    },
    mount: function (root) {
      K.app.bind('input', function (e) {
        if (e.target.id === 'pq') { prodFilter.q = e.target.value; prodFilter.page = 1; K.app.rerender(); }
      });
      K.app.bind('change', function (e) {
        if (e.target.id === 'pstatus') { prodFilter.status = e.target.value; K.app.rerender(); }
        if (e.target.classList.contains('bulkbox')) bulk[e.target.dataset.id] = e.target.checked;
        if (e.target.dataset.action === 'bulk-all') {
          U.qsa('.bulkbox', root).forEach(function (b) { b.checked = e.target.checked; bulk[b.dataset.id] = e.target.checked; });
          K.app.rerender();
        }
      });
      K.app.bind('click', function (e) {
        var b = e.target.closest('[data-action]'); if (!b) return;
        var a = b.dataset.action, k = b.dataset.k;
        var st = S.state.settings;

        if (a === 'feature-toggle') { var f = {}; f[k] = !st.features[k]; S.updateSettings({ features: f }); K.app.rerender(); }
        if (a === 'pay-toggle') { var p = {}; p[k] = !st.payments[k]; S.updateSettings({ payments: p }); K.app.rerender(); }
        if (a === 'cur-toggle') { var c = {}; c[k] = !st.currencies[k]; S.updateSettings({ currencies: c }); K.app.rerender(); }
        if (a === 'lang-toggle') { var l = {}; l[k] = !st.languages[k]; S.updateSettings({ languages: l }); K.app.rerender(); }
        if (a === 'zone-toggle') {
          var zones = st.delivery.zones.map(function (z) { return z.id === k ? Object.assign({}, z, { enabled: !z.enabled }) : z; });
          S.updateSettings({ delivery: { zones: zones } }); K.app.rerender();
        }
        if (a === 'hp-toggle') {
          var hp = st.homepage.map(function (x) { return x.id === k ? Object.assign({}, x, { on: !x.on }) : x; });
          S.updateSettings({ homepage: hp }); K.app.rerender();
        }
        if (a === 'hp-up' || a === 'hp-down') {
          var i = parseInt(b.dataset.i, 10), arr = st.homepage.slice();
          var j = a === 'hp-up' ? i - 1 : i + 1;
          if (j >= 0 && j < arr.length) { var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp; S.updateSettings({ homepage: arr }); K.app.rerender(); }
        }
        if (a === 'save-prod') {
          S.updateSettings({ delivery: { productionDays: [parseInt(U.qs('#pdmin', root).value, 10), parseInt(U.qs('#pdmax', root).value, 10)] } });
          U.toast('Saved');
        }
        if (a === 'save-contact') {
          S.updateSettings({ contact: { instagram: U.qs('#c-ig', root).value, whatsapp: U.qs('#c-wa', root).value, email: U.qs('#c-em', root).value } });
          U.toast('Saved');
        }
        if (a === 'save-seo') {
          S.updateSettings({ seo: { title: U.qs('#seo-t', root).value, description: U.qs('#seo-d', root).value } });
          U.toast('Saved');
        }
        if (a === 'reset-settings') { S.resetSettings(); U.toast('Settings reset'); K.app.rerender(); }

        if (a === 'ad-more') { prodFilter.page++; K.app.rerender(); }
        if (a === 'ad-edit') editModal(S.byId(b.dataset.id));
        if (a === 'ad-save') {
          var id = b.dataset.id;
          var prod = U.qs('#e-prod').value.split('-').map(Number);
          S.patchProduct(id, {
            title: { en: U.qs('#e-en').value, hy: U.qs('#e-hy').value, ru: U.qs('#e-ru').value },
            basePrice: parseInt(U.qs('#e-price').value, 10) || 0,
            status: U.qs('#e-status').value,
            productionDays: prod.length === 2 ? prod : [2, 4],
            deliveryDays: U.qs('#e-del').value.split('-').map(Number)
          });
          K.search.build();
          U.closeModal(); U.toast('Product saved'); K.app.rerender();
        }
        if (a === 'ad-new') {
          U.modal({ title: 'New product', body: '<p style="color:var(--ink-2)">In production this opens the full create form: title, images, category, tags, attributes, variants, production files, times. ' +
            'The prototype generates its catalogue, so use <b>Edit</b> on an existing row to see the field set and the CSV export for bulk import.</p>',
            footer: '<button class="btn btn--ghost" data-action="modal-close">' + t('nav.close') + '</button>' });
        }
        if (a === 'ad-csv') {
          var rows = [['sku', 'title_en', 'title_hy', 'title_ru', 'type', 'category', 'base_price_amd', 'tags', 'status', 'production_days']]
            .concat(S.products.map(function (p) {
              return [p.sku, p.title.en, p.title.hy, p.title.ru, p.typeId, p.categoryId, p.basePrice, p.tags.join('|'), p.status, p.productionDays.join('-')];
            }));
          var csv = rows.map(function (r) { return r.map(function (c) { return '"' + String(c).replace(/"/g, '""') + '"'; }).join(','); }).join('\n');
          U.modal({ title: 'CSV export — ' + S.products.length + ' products', body: '<div class="factory" style="max-height:340px;overflow:auto">' + U.esc(csv.slice(0, 4000)) + (csv.length > 4000 ? '\n… (' + (csv.length - 4000) + ' more characters)' : '') + '</div>',
            footer: '<button class="btn btn--ghost" data-action="modal-close">' + t('nav.close') + '</button>' });
        }
        if (a === 'bulk-clear') { bulk = {}; K.app.rerender(); }
        if (a === 'bulk-live' || a === 'bulk-draft') {
          Object.keys(bulk).filter(function (x) { return bulk[x]; }).forEach(function (id) {
            S.patchProduct(id, { status: a === 'bulk-live' ? 'live' : 'draft' });
          });
          bulk = {}; K.search.build(); U.toast('Updated'); K.app.rerender();
        }
        if (a === 'bulk-price') {
          Object.keys(bulk).filter(function (x) { return bulk[x]; }).forEach(function (id) {
            var pr = S.byId(id); S.patchProduct(id, { basePrice: Math.round(pr.basePrice * 1.1 / 50) * 50 });
          });
          bulk = {}; U.toast('Prices +10%'); K.app.rerender();
        }
        if (a === 'bulk-tag') {
          U.modal({ title: 'Add tag to selection', body: '<div class="chips">' + D.TAGS.slice(0, 24).map(function (tg) {
            return '<button class="chip" data-action="bulk-tag-do" data-id="' + tg.id + '">' + U.esc(tc(tg.name)) + '</button>';
          }).join('') + '</div>', footer: '<button class="btn btn--ghost" data-action="modal-close">' + t('ui.cancel') + '</button>' });
        }
        if (a === 'bulk-tag-do') {
          Object.keys(bulk).filter(function (x) { return bulk[x]; }).forEach(function (id) {
            var pr = S.byId(id);
            if (pr.tags.indexOf(b.dataset.id) < 0) S.patchProduct(id, { tags: pr.tags.concat([b.dataset.id]) });
          });
          bulk = {}; K.search.build(); U.closeModal(); U.toast('Tag applied'); K.app.rerender();
        }
        if (a === 'tag-new') {
          var name = U.qs('#newtag', root).value.trim();
          if (!name) return;
          var id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          D.TAGS.push({ id: id, slug: id, group: 'theme', name: { en: name, hy: name, ru: name } });
          K.search.build(); U.toast('Tag created'); K.app.rerender();
        }
        if (a === 'tag-merge') {
          U.modal({ title: 'Merge tags', body: '<p style="color:var(--ink-2)">Pick the tag to keep, then the duplicate to fold into it. Every product moves over and the old tag page redirects.</p>' +
            '<div class="two"><label class="field"><span>Keep</span><select id="mk">' + D.TAGS.map(function (g) { return '<option value="' + g.id + '">' + U.esc(tc(g.name)) + '</option>'; }).join('') + '</select></label>' +
            '<label class="field"><span>Merge & remove</span><select id="mr">' + D.TAGS.map(function (g) { return '<option value="' + g.id + '">' + U.esc(tc(g.name)) + '</option>'; }).join('') + '</select></label></div>',
            footer: '<button class="btn btn--ghost" data-action="modal-close">' + t('ui.cancel') + '</button><button class="btn btn--oxide" data-action="tag-merge-do">Merge</button>' });
        }
        if (a === 'tag-merge-do') {
          var keep = U.qs('#mk').value, drop = U.qs('#mr').value;
          if (keep !== drop) {
            S.products.forEach(function (pr) {
              if (pr.tags.indexOf(drop) >= 0) {
                var next = pr.tags.filter(function (x) { return x !== drop; });
                if (next.indexOf(keep) < 0) next.push(keep);
                S.patchProduct(pr.id, { tags: next });
              }
            });
            var i2 = D.TAGS.findIndex(function (g) { return g.id === drop; });
            if (i2 >= 0) D.TAGS.splice(i2, 1);
            K.search.build();
          }
          U.closeModal(); U.toast('Merged'); K.app.rerender();
        }
        if (a === 'ad-order') orderModal(S.state.orders.filter(function (o) { return o.id === b.dataset.id; })[0]);
        if (a === 'ad-status') {
          S.setOrderStatus(b.dataset.id, b.dataset.s);
          orderModal(S.state.orders.filter(function (o) { return o.id === b.dataset.id; })[0]);
          K.app.rerender();
        }
        if (a === 'ad-copy') {
          var text = U.qs('#brief').textContent;
          if (navigator.clipboard) navigator.clipboard.writeText(text).then(function () { U.toast(t('ui.copied')); }, function () { U.toast(text.slice(0, 40) + '…'); });
          else U.toast(t('ui.copied'));
        }
      });
    }
  };
})(window.KADR = window.KADR || {});
