/* Account, preferences questionnaire, favorites, static pages. */
(function (K) {
  'use strict';
  var D = K.data, S = K.store, U = K.ui, SR = K.search, VH = K.vh;
  var t = function (k, v) { return K.i18n.t(k, v); }, tc = function (o) { return K.i18n.tc(o); };
  K.views = K.views || {};

  function sidenav(active) {
    var items = [['', 'acc.title'], ['orders', 'acc.orders'], ['favorites', 'acc.favorites'], ['recent', 'acc.recent'],
      ['addresses', 'acc.addresses'], ['prefs', 'acc.prefs'], ['settings', 'acc.settings']];
    return '<nav class="sidenav">' + items.map(function (i) {
      return '<a href="#/account' + (i[0] ? '/' + i[0] : '') + '" class="' + (active === i[0] ? 'is-active' : '') + '">' + t(i[1]) + '</a>';
    }).join('') + '</nav>';
  }

  function signInPanel() {
    return '<div class="panel" style="max-width:420px">' +
      '<h3 class="h3">' + t('acc.signIn') + '</h3>' +
      '<p style="color:var(--ink-2);font-size:14px">' + tc({ en: 'Email and password today; Google and Apple sign-in slot in later without touching your data.',
        hy: 'Էլ. փոստ և գաղտնաբառ. Google/Apple-ը կավելացվի հետո։', ru: 'Почта и пароль; вход через Google и Apple добавится позже.' }) + '</p>' +
      '<label class="field"><span>' + t('co.email') + '</span><input id="sie" type="email" placeholder="you@mail.com"></label>' +
      '<label class="field"><span>' + t('acc.password') + '</span><input id="sip" type="password" placeholder="••••••••"></label>' +
      '<button class="btn btn--full" data-action="signin">' + t('acc.signIn') + '</button>' +
      '<p class="mono" style="margin-top:12px;text-transform:none;letter-spacing:0">' + t('co.guest') + ' — ' +
        tc({ en: 'you can buy without an account.', hy: 'կարող եք գնել առանց հաշվի։', ru: 'можно купить без аккаунта.' }) + '</p></div>';
  }

  function ordersPanel() {
    if (!S.state.orders.length) return U.empty('acc.noOrders', '#/shop', t('cart.emptyCta'));
    return S.state.orders.map(function (o) {
      return '<div class="panel"><div class="section__head" style="margin-bottom:12px">' +
        '<div><p class="mono">' + new Date(o.at).toLocaleDateString() + '</p><h3 class="h3">' + o.id + '</h3></div>' +
        '<span class="status status--' + o.status + '">' + tc(S.STATUS_LABEL[o.status]) + '</span></div>' +
        o.items.map(function (it) {
          var p = S.byId(it.productId);
          return '<div class="line">' + (p ? U.artImg(p, it.options, 180) : '<div></div>') +
            '<div><b>' + U.esc(tc(it.title)) + '</b><div class="line__sku">' + it.sku + ' · × ' + it.qty + '</div></div>' +
            '<div class="num">' + U.money(it.unit * it.qty) + '</div></div>';
        }).join('') +
        '<div class="srow srow--total"><span>' + t('cart.total') + '</span><span class="num">' + U.money(o.total) + '</span></div>' +
        '<div class="pillrow" style="margin-top:12px"><a class="btn btn--sm btn--ghost" href="#/order/' + o.id + '">' + t('co.track') + '</a></div></div>';
    }).join('');
  }

  function addressPanel() {
    if (!S.state.addresses.length) return U.empty('acc.noAddr', '#/checkout', t('cart.checkout'));
    return S.state.addresses.map(function (a) {
      return '<div class="panel"><div class="section__head" style="margin-bottom:8px"><h3 class="h3">' + U.esc(a.label) + '</h3>' +
        '<button class="chip" data-action="addr-del" data-l="' + U.esc(a.label) + '">' + t('ui.delete') + '</button></div>' +
        '<p style="color:var(--ink-2);font-size:14px;margin:0">' +
        U.esc([a.street, a.building, a.entrance && (t('co.entrance') + ' ' + a.entrance), a.floor && (t('co.floor') + ' ' + a.floor), a.apartment && ('#' + a.apartment)].filter(Boolean).join(', ')) +
        '</p></div>';
    }).join('');
  }

  K.views.account = {
    render: function (params) {
      var tab = params.tab || '';
      U.setMeta({ title: t('acc.title') + ' — KADR', description: 'Your account' });
      var body;
      if (tab === 'orders') body = ordersPanel();
      else if (tab === 'favorites') {
        var favs = S.state.favorites.map(S.byId).filter(Boolean);
        body = favs.length ? U.grid(favs) : U.empty('acc.noFavs', '#/explore', t('acc.emptyCta'));
      } else if (tab === 'recent') {
        var rec = S.state.recent.map(S.byId).filter(Boolean);
        body = rec.length ? U.grid(rec) : U.empty('acc.noRecent', '#/explore', t('acc.emptyCta'));
      } else if (tab === 'addresses') body = addressPanel();
      else if (tab === 'prefs') body = prefsSummary();
      else if (tab === 'settings') body = settingsPanel();
      else body = dashboard();
      return '<div class="wrap">' + VH.pageHead(t('acc.title'), S.state.user ? S.state.user.email : t('co.guest')) +
        '<div class="split">' + sidenav(tab) + '<div>' + body + '</div></div></div>';
    },
    mount: function (root) {
      K.app.bind('click', function (e) {
        var b = e.target.closest('[data-action]'); if (!b) return;
        if (b.dataset.action === 'signin') {
          var em = U.qs('#sie', root).value.trim();
          if (!em) { U.toast(t('co.email')); return; }
          S.signIn(em); U.toast(tc({ en: 'Signed in', hy: 'Մուտք գործեցիք', ru: 'Вы вошли' })); K.app.rerender();
        }
        if (b.dataset.action === 'signout') { S.signOut(); K.app.rerender(); }
        if (b.dataset.action === 'addr-del') { S.removeAddress(b.dataset.l); K.app.rerender(); }
        if (b.dataset.action === 'prefs-reset') { S.resetPrefs(); U.toast(t('pref.reset')); K.app.rerender(); }
      });
    }
  };

  function dashboard() {
    var favs = S.state.favorites.map(S.byId).filter(Boolean).slice(0, 6);
    var rec = S.state.recent.map(S.byId).filter(Boolean).slice(0, 6);
    return (S.state.user ? '<div class="panel"><div class="section__head" style="margin:0">' +
        '<div><p class="mono">' + t('acc.title') + '</p><h3 class="h3">' + U.esc(S.state.user.name) + '</h3></div>' +
        '<button class="chip" data-action="signout">' + t('acc.signOut') + '</button></div></div>' : signInPanel()) +
      '<div class="panel"><div class="stat">' +
        '<div><b class="num">' + S.state.orders.length + '</b><span>' + t('acc.orders') + '</span></div>' +
        '<div><b class="num">' + S.state.favorites.length + '</b><span>' + t('acc.favorites') + '</span></div>' +
        '<div><b class="num">' + S.state.recent.length + '</b><span>' + t('acc.recent') + '</span></div>' +
        '<div><b class="num">' + S.state.addresses.length + '</b><span>' + t('acc.addresses') + '</span></div>' +
      '</div></div>' +
      (favs.length ? '<div class="panel"><h3 class="h3">' + t('acc.favorites') + '</h3>' + U.grid(favs, { dense: true }) + '</div>' : '') +
      (rec.length ? '<div class="panel"><h3 class="h3">' + t('acc.recent') + '</h3>' + U.grid(rec, { dense: true }) + '</div>' : '');
  }

  function settingsPanel() {
    return '<div class="panel"><h3 class="h3">' + t('ui.language') + ' & ' + t('ui.currency') + '</h3>' +
      '<div class="pillrow">' + K.i18n.langs.filter(function (l) { return S.state.settings.languages[l.code]; }).map(function (l) {
        return '<button class="chip' + (K.i18n.lang === l.code ? ' is-on' : '') + '" data-action="lang" data-k="' + l.code + '">' + l.label + '</button>';
      }).join('') + '</div>' +
      '<div class="pillrow" style="margin-top:12px">' + Object.keys(D.CURRENCIES).filter(function (c) { return S.state.settings.currencies[c]; }).map(function (c) {
        return '<button class="chip' + (S.state.currency === c ? ' is-on' : '') + '" data-action="cur" data-k="' + c + '">' + c + '</button>';
      }).join('') + '</div>' +
      '<hr class="hr"><h3 class="h3">' + t('acc.prefs') + '</h3>' + prefsSummary() + '</div>';
  }

  function prefsSummary() {
    var p = S.state.prefs;
    var top = Object.keys(S.state.affinity).sort(function (a, b) { return S.state.affinity[b] - S.state.affinity[a]; }).slice(0, 8);
    return '<div class="panel">' +
      (p ? '<p class="mono">' + t('acc.prefs') + '</p><div class="chips" style="margin:10px 0 18px">' +
        [].concat(p.rooms || [], p.styles || [], p.colors || [], p.interests || [], p.moods || []).map(function (id) {
          var tg = D.tagById(id); return tg ? '<span class="chip">' + U.esc(tc(tg.name)) + '</span>' : '';
        }).join('') + '</div>'
        : '<p style="color:var(--ink-2)">' + t('home.personalize.b') + '</p>') +
      (top.length ? '<p class="mono">' + tc({ en: 'Learned from your behaviour', hy: 'Սովորած ձեր վարքից', ru: 'Выучено из поведения' }) + '</p>' +
        '<div class="chips" style="margin-top:10px">' + top.map(function (id) {
          var tg = D.tagById(id); return tg ? '<span class="chip">' + U.esc(tc(tg.name)) + ' <em class="mono">' + Math.round(S.state.affinity[id]) + '</em></span>' : '';
        }).join('') + '</div>' : '') +
      '<div class="pillrow" style="margin-top:18px"><a class="btn btn--sm" href="#/preferences">' + (p ? t('home.personalize.re') : t('home.personalize.cta')) + '</a>' +
      (p ? '<button class="btn btn--sm btn--ghost" data-action="prefs-reset">' + t('pref.reset') + '</button>' : '') + '</div>' +
      '<p class="mono" style="margin-top:12px;text-transform:none;letter-spacing:0">' + t('pref.resetNote') + '</p></div>';
  }

  /* ---------- questionnaire -------------------------------------------------- */

  var draft = null;
  var QUESTIONS = [
    { key: 'rooms', title: 'pref.room', group: 'room', multi: false },
    { key: 'styles', title: 'pref.style', group: 'style', multi: true },
    { key: 'colors', title: 'pref.colors', group: 'color', multi: true },
    { key: 'interests', title: 'pref.interests', group: 'theme', multi: true },
    { key: 'moods', title: 'pref.mood', group: 'mood', multi: true }
  ];

  K.views.preferences = {
    render: function () {
      draft = draft || Object.assign({ rooms: [], styles: [], colors: [], interests: [], moods: [], budget: 12000 }, S.state.prefs || {});
      U.setMeta({ title: t('pref.title') + ' — KADR', description: 'Personalise your feed' });
      return '<div class="wrap" style="max-width:820px">' + VH.pageHead(t('home.personalize.t'), t('pref.title')) +
        QUESTIONS.map(function (q, i) {
          var tags = D.TAGS.filter(function (x) { return x.group === q.group; });
          if (q.group === 'theme') tags = tags.slice(0, 11);
          return '<div class="fgroup"><div class="fgroup__title">' + String(i + 1).padStart(2, '0') + ' — ' + t(q.title) + '</div>' +
            '<div class="chips">' + tags.map(function (tg) {
              var on = draft[q.key].indexOf(tg.id) >= 0;
              return '<button class="chip' + (on ? ' is-on' : '') + '" data-action="pref" data-k="' + q.key + '" data-id="' + tg.id + '" data-multi="' + q.multi + '">' +
                (D.TAG_COLORS[tg.id] ? '<i class="swatch" style="background:' + D.TAG_COLORS[tg.id] + '"></i>' : '') + U.esc(tc(tg.name)) + '</button>';
            }).join('') + '</div></div>';
        }).join('') +
        '<div class="fgroup"><div class="fgroup__title">06 — ' + t('pref.budget') + '<span id="bl">' + U.money(draft.budget) + '</span></div>' +
        '<input type="range" id="budget" min="3000" max="40000" step="500" value="' + draft.budget + '" style="width:100%;accent-color:var(--oxide)"></div>' +
        '<div class="pillrow" style="margin-top:26px"><button class="btn btn--oxide" data-action="pref-save">' + t('pref.save') + '</button>' +
        '<a class="btn btn--ghost" href="#/explore">' + t('pref.skip') + '</a></div>' +
        '<p class="mono" style="margin-top:14px;text-transform:none;letter-spacing:0">' + t('pref.resetNote') + '</p></div>';
    },
    mount: function (root) {
      K.app.bind('input', function (e) {
        if (e.target.id === 'budget') { draft.budget = parseInt(e.target.value, 10); U.qs('#bl', root).textContent = U.money(draft.budget); }
      });
      K.app.bind('click', function (e) {
        var b = e.target.closest('[data-action]'); if (!b) return;
        if (b.dataset.action === 'pref') {
          var k = b.dataset.k, id = b.dataset.id, multi = b.dataset.multi === 'true';
          var i = draft[k].indexOf(id);
          if (i >= 0) draft[k].splice(i, 1);
          else if (multi) draft[k].push(id);
          else draft[k] = [id];
          K.app.rerender();
        }
        if (b.dataset.action === 'pref-save') {
          S.setPrefs(draft);
          draft = null;
          U.toast(tc({ en: 'Feed updated', hy: 'Հոսքը թարմացվեց', ru: 'Лента обновлена' }));
          location.hash = '#/explore';
        }
      });
    }
  };

  /* ---------- favorites shortcut --------------------------------------------- */

  K.views.favorites = {
    render: function () {
      var favs = S.state.favorites.map(S.byId).filter(Boolean);
      U.setMeta({ title: t('nav.favorites') + ' — KADR', description: 'Saved pieces' });
      return '<div class="wrap">' + VH.pageHead(t('nav.favorites'), favs.length + '') +
        (favs.length ? U.grid(favs) : U.empty('acc.noFavs', '#/explore', t('acc.emptyCta'))) + '</div>';
    }
  };

  /* ---------- static pages ---------------------------------------------------- */

  var LEGAL = {
    privacy: { title: 'foot.privacy', body: { en: 'We store your order details, delivery address and the behaviour that personalises your feed. You can reset preferences at any time from your account. Payment card data never reaches this site — it is handled by the payment provider.', hy: 'Մենք պահում ենք պատվերի տվյալները և հասցեն։ Քարտի տվյալները չեն պահվում կայքում։', ru: 'Мы храним данные заказа и адрес доставки. Данные карты на сайте не хранятся.' } },
    terms: { title: 'foot.terms', body: { en: 'Products are made to order. An order is a request to manufacture; production starts after payment is confirmed.', hy: 'Ապրանքները պատրաստվում են պատվերով։', ru: 'Товары изготавливаются под заказ.' } },
    delivery: { title: 'foot.deliveryPolicy', body: { en: 'Delivery is included in the price across Armenia. Production takes 2–4 business days, delivery 1–2 more in Yerevan.', hy: 'Առաքումը ներառված է գնի մեջ Հայաստանում։', ru: 'Доставка включена в цену по Армении.' } },
    returns: { title: 'foot.returns', body: { en: 'Because every piece is produced for one customer, returns apply to defects and shipping damage. Send a photo within 14 days and we reprint.', hy: 'Յուրաքանչյուր գործ պատրաստվում է անհատապես։', ru: 'Каждая работа печатается индивидуально.' } },
    payment: { title: 'foot.payment', body: { en: 'Card payments are processed by our provider. While online payment is switched off, orders are confirmed manually over Instagram, WhatsApp or email.', hy: 'Վճարումները մշակվում են մատակարարի կողմից։', ru: 'Платежи обрабатывает провайдер.' } }
  };

  K.views.legal = {
    render: function (params) {
      var doc = LEGAL[params.id] || LEGAL.privacy;
      U.setMeta({ title: t(doc.title) + ' — KADR', description: tc(doc.body).slice(0, 150) });
      return '<div class="wrap">' + VH.pageHead(t(doc.title), t('foot.legal')) +
        '<div class="prose"><p class="lede">' + U.esc(tc(doc.body)) + '</p>' +
        '<p class="mono" style="text-transform:none;letter-spacing:0;margin-top:26px">' +
        tc({ en: 'Placeholder text — final legal copy is supplied and approved by the company.',
             hy: 'Ժամանակավոր տեքստ։', ru: 'Черновой текст — финальные тексты предоставляет компания.' }) + '</p></div></div>';
    }
  };

  K.views.about = {
    render: function () {
      U.setMeta({ title: 'About — KADR', description: 'A made-to-order print studio in Yerevan.' });
      return '<div class="wrap">' + VH.pageHead(t('nav.about'), 'KADR') +
        '<div class="two"><div class="prose"><p class="lede">' + t('home.brand.body') + '</p>' +
        '<h3 class="h3">' + tc({ en: 'How it works', hy: 'Ինչպես է աշխատում', ru: 'Как это работает' }) + '</h3>' +
        '<p>' + tc({ en: 'You order, we print, a courier brings it. Nothing sits in a warehouse, which is why the catalogue can grow to fifty thousand pieces without a single shelf.',
          hy: 'Դուք պատվիրում եք, մենք տպում ենք, առաքիչը բերում է։', ru: 'Вы заказываете, мы печатаем, курьер привозит.' }) + '</p></div>' +
        '<div>' + VH.sceneCard(D.SCENES[5]) + '</div></div></div>';
    }
  };

  K.views.contact = {
    render: function () {
      var c = S.state.settings.contact;
      U.setMeta({ title: 'Contact — KADR', description: 'Talk to the studio.' });
      return '<div class="wrap" style="max-width:760px">' + VH.pageHead(t('nav.contact'), 'Yerevan, Armenia') +
        '<div class="panel"><h3 class="h3">' + tc({ en: 'Fastest routes', hy: 'Ամենաարագ ուղիները', ru: 'Быстрее всего' }) + '</h3>' +
        '<div class="contactrow">' +
          '<a class="btn btn--sm" href="https://instagram.com/" target="_blank" rel="noopener">Instagram ' + U.esc(c.instagram) + '</a>' +
          '<a class="btn btn--sm btn--ghost" href="https://wa.me/" target="_blank" rel="noopener">WhatsApp ' + U.esc(c.whatsapp) + '</a>' +
          '<a class="btn btn--sm btn--ghost" href="mailto:' + U.esc(c.email) + '">' + U.esc(c.email) + '</a>' +
        '</div></div>' +
        '<div class="panel"><h3 class="h3">' + tc({ en: 'Business & bulk orders', hy: 'Բիզնես պատվերներ', ru: 'Корпоративные заказы' }) + '</h3>' +
        '<label class="field"><span>' + t('co.name') + '</span><input placeholder="…"></label>' +
        '<label class="field"><span>' + t('co.email') + '</span><input type="email" placeholder="…"></label>' +
        '<label class="field"><span>' + tc({ en: 'What do you need?', hy: 'Ի՞նչ է ձեզ պետք', ru: 'Что нужно?' }) + '</span><textarea rows="4"></textarea></label>' +
        '<button class="btn" data-action="contact-send">' + tc({ en: 'Send', hy: 'Ուղարկել', ru: 'Отправить' }) + '</button></div></div>';
    },
    mount: function (root) {
      K.app.bind('click', function (e) {
        if (e.target.closest('[data-action="contact-send"]')) {
          U.toast(tc({ en: 'Thanks — we reply within a day.', hy: 'Շնորհակալություն։', ru: 'Спасибо — ответим в течение дня.' }));
        }
      });
    }
  };
})(window.KADR = window.KADR || {});
