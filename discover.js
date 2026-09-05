/* Explore, Shop, Search, Tag, Collection, Rooms, Scene. */
(function (K) {
  'use strict';
  var D = K.data, S = K.store, U = K.ui, SR = K.search, VH = K.vh;
  var t = function (k, v) { return K.i18n.t(k, v); }, tc = function (o) { return K.i18n.tc(o); };
  K.views = K.views || {};

  /* =================== EXPLORE ============================================= */

  var feedPage = 0, feedFilter = null, feedItems = [];

  function feedTile(item, i) {
    if (item.kind === 'scene') return VH.sceneCard(item.scene);
    if (item.kind === 'collection') {
      var c = item.col;
      return '<a class="mas-note" href="#/collection/' + c.id + '">' +
        '<p class="eyebrow">' + t('nav.collections') + '</p><h3 class="h3" style="margin:10px 0">' + U.esc(tc(c.title)) + '</h3>' +
        '<span class="link">' + t('ui.seeAll') + ' →</span></a>';
    }
    return U.card(item.p, { w: 460 });
  }

  function buildFeed(page) {
    var products = SR.feed(page);
    if (feedFilter && feedFilter.length) {
      products = products.filter(function (p) { return SR.matches(p, { tags: feedFilter }); });
    }
    var slice = products.slice(page * 28, page * 28 + 28);
    var items = slice.map(function (p) { return { kind: 'product', p: p }; });
    /* seed inspiration into the feed so discovery is not only products */
    if (D.SCENES[page % D.SCENES.length]) items.splice(4, 0, { kind: 'scene', scene: D.SCENES[page % D.SCENES.length] });
    if (D.SCENES[(page + 3) % D.SCENES.length]) items.splice(17, 0, { kind: 'scene', scene: D.SCENES[(page + 3) % D.SCENES.length] });
    if (page % 2 === 0) items.splice(11, 0, { kind: 'collection', col: D.COLLECTIONS[page % D.COLLECTIONS.length] });
    return items;
  }

  function exploreFilters() {
    var groups = ['room', 'style', 'mood', 'color'];
    return '<div class="chips" style="margin-bottom:26px">' +
      groups.map(function (g) {
        return D.TAGS.filter(function (x) { return x.group === g; }).slice(0, 6).map(function (tg) {
          var on = feedFilter && feedFilter.indexOf(tg.id) >= 0;
          return '<button class="chip' + (on ? ' is-on' : '') + '" data-action="feed-filter" data-id="' + tg.id + '">' +
            (D.TAG_COLORS[tg.id] ? '<i class="swatch" style="background:' + D.TAG_COLORS[tg.id] + '"></i>' : '') +
            U.esc(tc(tg.name)) + '</button>';
        }).join('');
      }).join('') +
      (feedFilter && feedFilter.length ? '<button class="chip" data-action="feed-clear">✕ ' + t('filter.clear') + '</button>' : '') +
      '</div>';
  }

  K.views.explore = {
    render: function (params) {
      U.setMeta({ title: 'Explore — KADR', description: 'A visual feed of rooms, prints and ideas.' });
      feedPage = 0;
      feedFilter = params.tags ? params.tags.split(',') : null;
      feedItems = buildFeed(0);
      var personal = S.state.prefs || Object.keys(S.state.affinity).length > 4;
      return '<div class="wrap">' +
        VH.pageHead(t('nav.explore'), personal ? tc({ en: 'Tuned to what you look at', hy: 'Ձեր դիտածի հիման վրա', ru: 'Подстроено под ваши просмотры' }) : tc({ en: 'Everything, loosely arranged', hy: 'Ամեն ինչ', ru: 'Всё подряд' })) +
        exploreFilters() +
        '<div class="masonry" id="feed">' + feedItems.map(feedTile).join('') + '</div>' +
        '<div id="sentinel" style="height:60px"></div></div>';
    },
    mount: function (root) {
      var host = U.qs('#feed', root), sent = U.qs('#sentinel', root);
      if (!host || !sent) return;
      var busy = false;
      var io = new IntersectionObserver(function (es) {
        if (!es[0].isIntersecting || busy) return;
        busy = true;
        feedPage++;
        var more = buildFeed(feedPage);
        if (!more.length) { io.disconnect(); busy = false; return; }
        host.insertAdjacentHTML('beforeend', more.map(feedTile).join(''));
        U.hydrateImages(host);
        setTimeout(function () { busy = false; }, 120);
      }, { rootMargin: '900px' });
      io.observe(sent);
      K.app.bind('click', function (e) {
        var b = e.target.closest('[data-action="feed-filter"],[data-action="feed-clear"]');
        if (!b) return;
        var set = feedFilter ? feedFilter.slice() : [];
        if (b.dataset.action === 'feed-clear') set = [];
        else {
          var id = b.dataset.id, i = set.indexOf(id);
          if (i >= 0) set.splice(i, 1); else { set.push(id); S.track('tag', { tag: id }); }
        }
        location.hash = '#/explore' + (set.length ? '?tags=' + set.join(',') : '');
      });
    }
  };

  /* =================== SHOP / results ====================================== */

  var shopState = null;

  function readShopParams(params) {
    return {
      q: params.q || '',
      category: params.cat || 'all',
      type: params.type || 'all',
      tags: params.tags ? params.tags.split(',') : [],
      collection: params.collection || '',
      sort: params.sort || (params.q ? 'relevance' : 'recommended'),
      max: params.max ? parseInt(params.max, 10) : null,
      page: 1
    };
  }
  function shopHash(st) {
    var q = [];
    if (st.q) q.push('q=' + encodeURIComponent(st.q));
    if (st.category !== 'all') q.push('cat=' + st.category);
    if (st.type !== 'all') q.push('type=' + st.type);
    if (st.tags.length) q.push('tags=' + st.tags.join(','));
    if (st.collection) q.push('collection=' + st.collection);
    if (st.sort) q.push('sort=' + st.sort);
    if (st.max) q.push('max=' + st.max);
    return '#/shop' + (q.length ? '?' + q.join('&') : '');
  }

  function resolve(st) {
    var base = S.live(), scores = {}, suggestion = null;
    if (st.q) {
      var r = SR.query(st.q);
      scores = r.scores; suggestion = r.suggestion;
      base = r.ids.map(S.byId).filter(Boolean);
    }
    var filtered = base.filter(function (p) {
      return SR.matches(p, { category: st.category, type: st.type, tags: st.tags, collection: st.collection, price: st.max ? [null, st.max] : null });
    });
    return { list: SR.sortList(filtered, st.sort, scores), scores: scores, suggestion: suggestion, all: base };
  }

  function filterPanel(st, facets) {
    var out = '';
    /* category */
    var roots = D.CATEGORIES.filter(function (c) { return !c.parent; });
    out += '<div class="fgroup"><div class="fgroup__title">' + t('filter.category') + '</div>';
    out += '<label class="fopt"><input type="radio" name="cat" value="all"' + (st.category === 'all' ? ' checked' : '') + '>' + tc({ en: 'Everything', hy: 'Ամեն ինչ', ru: 'Всё' }) + '</label>';
    roots.forEach(function (c) {
      out += '<label class="fopt"><input type="radio" name="cat" value="' + c.id + '"' + (st.category === c.id ? ' checked' : '') + '>' + U.esc(tc(c.name)) + '</label>';
      D.CATEGORIES.filter(function (k) { return k.parent === c.id; }).forEach(function (k) {
        out += '<label class="fopt" style="padding-left:22px"><input type="radio" name="cat" value="' + k.id + '"' + (st.category === k.id ? ' checked' : '') + '>' + U.esc(tc(k.name)) +
          '<em class="n">' + (facets.categories[k.id] || 0) + '</em></label>';
      });
    });
    out += '</div>';
    /* price */
    var max = st.max || 40000;
    out += '<div class="fgroup"><div class="fgroup__title">' + t('filter.price') + '<span>' + U.money(max) + '</span></div>' +
      '<div class="range"><input type="range" id="fprice" min="2000" max="40000" step="500" value="' + max + '"></div></div>';
    /* tag groups */
    SR.FILTERABLE_TAG_GROUPS.forEach(function (g) {
      var tags = D.TAGS.filter(function (x) { return x.group === g && facets.tags[x.id]; }).sort(function (a, b) { return facets.tags[b.id] - facets.tags[a.id]; }).slice(0, 8);
      if (!tags.length) return;
      var label = { style: 'filter.style', mood: 'filter.mood', room: 'filter.room', color: 'filter.color', theme: 'filter.tag', brand: 'filter.tag', place: 'filter.tag' }[g];
      out += '<div class="fgroup"><div class="fgroup__title">' + t(label) + '</div>' +
        tags.map(function (tg) {
          return '<label class="fopt"><input type="checkbox" class="ftag" value="' + tg.id + '"' + (st.tags.indexOf(tg.id) >= 0 ? ' checked' : '') + '>' +
            (D.TAG_COLORS[tg.id] ? '<i class="swatch" style="background:' + D.TAG_COLORS[tg.id] + '"></i>' : '') +
            U.esc(tc(tg.name)) + '<em class="n">' + facets.tags[tg.id] + '</em></label>';
        }).join('') + '</div>';
    });
    out += '<div style="padding:18px 0"><button class="btn btn--ghost btn--sm btn--full" data-action="shop-clear">' + t('filter.clear') + '</button></div>';
    return out;
  }

  function resultsBlock(res, st) {
    var shown = res.list.slice(0, st.page * 24);
    return (res.suggestion ? '<div class="note">' + t('search.did') + ' <a class="link" href="' + shopHash(Object.assign({}, st, { q: res.suggestion })) + '">' + U.esc(res.suggestion) + '</a></div>' : '') +
      (shown.length ? U.grid(shown) : U.empty('search.none', '#/explore', t('nav.explore'), t('search.noneHint'))) +
      (res.list.length > shown.length ? '<div style="text-align:center;margin-top:40px"><button class="btn btn--ghost" data-action="shop-more">' + t('ui.more') + '</button></div>' : '');
  }

  function renderShop(st, title, sub) {
    var res = resolve(st);
    var facets = SR.facets(res.all);
    shopState = st;
    return '<div class="wrap">' +
      VH.pageHead(title || (st.q ? '“' + st.q + '”' : t('shop.title')), sub || t('shop.results', { n: res.list.length })) +
      '<div class="shop">' +
      '<aside class="filters" id="filters">' + filterPanel(st, facets) + '</aside>' +
      '<div><div class="toolbar">' +
        '<div class="pillrow">' +
          '<button class="pill" data-action="filters-open" style="display:none" id="fbtn">' + t('shop.filters') + '</button>' +
          (st.tags.map(function (id) {
            var tg = D.tagById(id);
            return tg ? '<button class="chip is-on" data-action="shop-untag" data-id="' + id + '">' + U.esc(tc(tg.name)) + ' ✕</button>' : '';
          }).join('')) +
        '</div>' +
        '<select class="select" id="sortsel">' +
          ['recommended', 'new', 'popular', 'priceAsc', 'priceDesc'].concat(st.q ? ['relevance'] : []).map(function (m) {
            return '<option value="' + m + '"' + (st.sort === m ? ' selected' : '') + '>' + t('sort.' + (m === 'relevance' ? 'recommended' : m)) + (m === 'relevance' ? ' ✦' : '') + '</option>';
          }).join('') +
        '</select>' +
      '</div><div id="results">' + resultsBlock(res, st) + '</div></div></div></div>';
  }

  function mountShop(root) {
    function refresh() { location.hash = shopHash(shopState); }
    K.app.bind('change', function (e) {
      if (e.target.name === 'cat') { shopState.category = e.target.value; refresh(); }
      if (e.target.classList.contains('ftag')) {
        var id = e.target.value, i = shopState.tags.indexOf(id);
        if (e.target.checked && i < 0) { shopState.tags.push(id); S.track('tag', { tag: id }); }
        if (!e.target.checked && i >= 0) shopState.tags.splice(i, 1);
        refresh();
      }
      if (e.target.id === 'sortsel') { shopState.sort = e.target.value; refresh(); }
      if (e.target.id === 'fprice') { shopState.max = parseInt(e.target.value, 10); refresh(); }
    });
    K.app.bind('click', function (e) {
      var b = e.target.closest('[data-action]'); if (!b) return;
      var a = b.dataset.action;
      if (a === 'shop-more') {
        shopState.page++;
        var res = resolve(shopState);
        U.qs('#results', root).innerHTML = resultsBlock(res, shopState);
        U.hydrateImages(root);
      }
      if (a === 'shop-clear') { shopState.tags = []; shopState.category = 'all'; shopState.max = null; refresh(); }
      if (a === 'shop-untag') { shopState.tags = shopState.tags.filter(function (x) { return x !== b.dataset.id; }); refresh(); }
      if (a === 'filters-open') U.qs('#filters', root).classList.toggle('is-open');
    });
    var fb = U.qs('#fbtn', root);
    if (fb && window.matchMedia('(max-width:980px)').matches) fb.style.display = '';
  }

  K.views.shop = {
    render: function (params) {
      var st = readShopParams(params);
      U.setMeta({
        title: (st.q ? st.q + ' — ' : '') + 'Shop — KADR',
        description: 'Browse ' + S.live().length + ' made-to-order pieces.'
      });
      if (st.q) S.rememberSearch(st.q);
      return renderShop(st);
    },
    mount: mountShop
  };

  K.views.tag = {
    render: function (params) {
      var tg = D.tagById(params.id);
      if (!tg) return U.empty('err.404', '#/', t('err.404cta'));
      S.track('tag', { tag: tg.id });
      var st = readShopParams({ tags: tg.id, sort: params.sort });
      U.setMeta({
        title: tc(tg.name) + ' — KADR',
        description: 'Everything tagged ' + tc(tg.name) + '.',
        jsonld: { '@context': 'https://schema.org', '@type': 'CollectionPage', name: tc(tg.name) }
      });
      return U.crumbs([{ label: 'KADR', href: '#/' }, { label: t('nav.shop'), href: '#/shop' }, { label: tc(tg.name) }]) +
        renderShop(st, tc(tg.name), tc({ en: 'Tag', hy: 'Թեգ', ru: 'Тег' }));
    },
    mount: mountShop
  };

  K.views.collection = {
    render: function (params) {
      var col = D.COLLECTIONS.filter(function (c) { return c.id === params.id; })[0];
      if (!col) return U.empty('err.404', '#/', t('err.404cta'));
      S.track('collection', { tags: col.tags });
      var st = readShopParams({ collection: col.id, sort: params.sort });
      U.setMeta({ title: tc(col.title) + ' — KADR', description: 'Collection: ' + tc(col.title) });
      return U.crumbs([{ label: 'KADR', href: '#/' }, { label: t('nav.collections'), href: '#/collections' }, { label: tc(col.title) }]) +
        renderShop(st, tc(col.title), t('nav.collections'));
    },
    mount: mountShop
  };

  K.views.collections = {
    render: function () {
      U.setMeta({ title: 'Collections — KADR', description: 'Curated groups of prints and rooms.' });
      return '<div class="wrap">' + VH.pageHead(t('nav.collections'), tc({ en: 'Curated', hy: 'Ընտրված', ru: 'Кураторские' })) +
        '<div class="scenes">' + D.COLLECTIONS.map(VH.collectionCard).join('') + '</div></div>';
    }
  };

  K.views.rooms = {
    render: function () {
      U.setMeta({ title: 'Rooms — KADR', description: 'Shoppable room scenes.' });
      return '<div class="wrap">' + VH.pageHead(t('nav.rooms'), t('home.inspiration.sub')) +
        '<div class="scenes">' + D.SCENES.map(function (s, i) { return VH.sceneCard(s, i % 5 === 0 ? 'scene--big' : ''); }).join('') + '</div></div>';
    }
  };

  /* =================== SCENE / shop this room ============================== */

  var sceneSel = {};

  function sceneTotal(products) {
    return Object.keys(sceneSel).reduce(function (n, id) {
      var p = S.byId(id); if (!p || !sceneSel[id]) return n;
      return n + D.price(p, D.PRODUCT_TYPES[p.typeId].defaults) * sceneSel[id];
    }, 0);
  }
  function sceneRow(p) {
    var qty = sceneSel[p.id] || 0;
    var price = D.price(p, D.PRODUCT_TYPES[p.typeId].defaults);
    return '<div class="line" data-id="' + p.id + '">' +
      '<label style="cursor:pointer">' + U.artImg(p, null, 200) +
      '</label>' +
      '<div><a class="card__title" href="#/p/' + p.id + '">' + U.esc(tc(p.title)) + '</a>' +
      '<div class="line__opts">' + U.optionSummary(p, D.PRODUCT_TYPES[p.typeId].defaults) + '</div>' +
      '<div class="line__sku">' + p.sku + '</div>' +
      '<div style="margin-top:10px" class="pillrow">' +
        '<button class="chip' + (qty ? ' is-on' : '') + '" data-action="scene-toggle" data-id="' + p.id + '">' +
        (qty ? '✓ ' + t('ui.selected') : '+ ' + t('ui.select')) + '</button>' +
        (qty ? '<span class="qty"><button data-action="scene-qty" data-id="' + p.id + '" data-d="-1">−</button><span>' + qty + '</span>' +
               '<button data-action="scene-qty" data-id="' + p.id + '" data-d="1">+</button></span>' : '') +
      '</div></div>' +
      '<div style="text-align:right"><b class="num">' + U.money(price) + '</b></div></div>';
  }

  K.views.scene = {
    render: function (params) {
      var scene = D.SCENES.filter(function (s) { return s.id === params.id; })[0];
      if (!scene) return U.empty('err.404', '#/rooms', t('err.404cta'));
      sceneSel = {};
      S.track('scene', { tags: scene.tags });
      var products = SR.sceneProducts(scene);
      U.setMeta({ title: tc(scene.title) + ' — KADR', description: 'Shop this room: ' + tc(scene.title) });
      return '<div class="wrap">' +
        U.crumbs([{ label: 'KADR', href: '#/' }, { label: t('nav.rooms'), href: '#/rooms' }, { label: tc(scene.title) }]) +
        '<div class="pdp">' +
        '<div class="pdp__gallery"><div class="pdp__stage"><img src="' + VH.sceneUrl(scene, 1200, 840) + '" alt="' + U.esc(tc(scene.title)) + '"></div>' +
        '<div class="chips">' + scene.tags.map(function (id) { return U.tagChip(id); }).join('') + '</div></div>' +
        '<div><p class="eyebrow">' + t('scene.shop') + '</p>' +
        '<h1 class="h2" style="margin:14px 0 10px">' + U.esc(tc(scene.title)) + '</h1>' +
        '<p class="lede">' + tc({ en: 'Pick the pieces you want. Nothing goes in the cart until you confirm the list.',
                                   hy: 'Ընտրեք ցանկալի գործերը։ Ոչինչ չի ավելացվում առանց հաստատման։',
                                   ru: 'Выберите работы. Ничего не попадёт в корзину без подтверждения.' }) + '</p>' +
        '<h3 class="h3" style="margin:26px 0 4px">' + t('scene.in') + '</h3>' +
        '<div id="scenelist">' + products.map(sceneRow).join('') + '</div>' +
        '<div class="summary" style="margin-top:22px;position:static">' +
          '<div class="srow"><span id="selcount">' + t('scene.selected', { n: 0 }) + '</span><span id="seltotal" class="num">' + U.money(0) + '</span></div>' +
          '<button class="btn btn--full btn--oxide" data-action="scene-review" disabled id="sceneCta">' + t('scene.review') + '</button>' +
        '</div></div></div></div>';
    },
    mount: function (root, params) {
      var scene = D.SCENES.filter(function (s) { return s.id === params.id; })[0];
      var products = SR.sceneProducts(scene);
      function sync() {
        var n = Object.keys(sceneSel).reduce(function (a, id) { return a + (sceneSel[id] || 0); }, 0);
        U.qs('#selcount', root).textContent = t('scene.selected', { n: n });
        U.qs('#seltotal', root).textContent = U.money(sceneTotal());
        U.qs('#sceneCta', root).disabled = n === 0;
        U.qs('#scenelist', root).innerHTML = products.map(sceneRow).join('');
        U.hydrateImages(root);
      }
      K.app.bind('click', function (e) {
        var b = e.target.closest('[data-action]'); if (!b) return;
        if (b.dataset.action === 'scene-toggle') {
          var id = b.dataset.id;
          sceneSel[id] = sceneSel[id] ? 0 : 1;
          if (!sceneSel[id]) delete sceneSel[id];
          sync();
        }
        if (b.dataset.action === 'scene-qty') {
          var id2 = b.dataset.id;
          sceneSel[id2] = Math.max(0, (sceneSel[id2] || 0) + parseInt(b.dataset.d, 10));
          if (!sceneSel[id2]) delete sceneSel[id2];
          sync();
        }
        if (b.dataset.action === 'scene-review') {
          /* Explicit confirmation step — spec's guard against accidental bulk adds */
          var ids = Object.keys(sceneSel);
          var rows = ids.map(function (id) {
            var p = S.byId(id), price = D.price(p, D.PRODUCT_TYPES[p.typeId].defaults);
            return '<div class="line"><div>' + U.artImg(p, null, 160) + '</div>' +
              '<div><b>' + U.esc(tc(p.title)) + '</b><div class="line__opts">' + U.optionSummary(p, D.PRODUCT_TYPES[p.typeId].defaults) + '</div>' +
              '<div class="line__sku">' + S.skuFor(p, D.PRODUCT_TYPES[p.typeId].defaults) + ' · × ' + sceneSel[id] + '</div></div>' +
              '<div class="num">' + U.money(price * sceneSel[id]) + '</div></div>';
          }).join('');
          var total = sceneTotal();
          U.modal({
            title: t('scene.review'),
            body: rows + '<div class="srow srow--total"><span>' + t('cart.total') + '</span><span class="num">' + U.money(total) + '</span></div>',
            footer: '<button class="btn btn--ghost" data-action="modal-close">' + t('ui.cancel') + '</button>' +
              '<button class="btn btn--oxide" data-action="scene-confirm">' + t('scene.addAll', { n: ids.length, total: U.money(total) }) + '</button>'
          });
        }
        if (b.dataset.action === 'scene-confirm') {
          Object.keys(sceneSel).forEach(function (id) {
            S.addToCart(id, Object.assign({}, D.PRODUCT_TYPES[S.byId(id).typeId].defaults), sceneSel[id]);
          });
          sceneSel = {};
          U.closeModal(); sync();
          U.toast(t('p.added'), { href: '#/cart', cta: t('nav.cart') });
        }
      });
    }
  };

  /* =================== SEARCH overlay page ================================= */

  K.views.search = {
    render: function (params) {
      var q = params.q || '';
      var popular = D.TAGS.filter(function (x) { return x.group === 'theme'; }).slice(0, 8);
      return '<div class="wrap" style="max-width:900px">' +
        '<div style="padding:40px 0 10px"><div class="searchbar">' + U.icon('search') +
        '<input id="q" value="' + U.esc(q) + '" placeholder="' + t('search.placeholder') + '" autofocus autocomplete="off"></div></div>' +
        (S.state.searches.length ? '<p class="mono" style="margin-top:22px">' + t('search.recent') + '</p><div class="sugg">' +
          S.state.searches.map(function (s) { return '<a class="chip" href="#/shop?q=' + encodeURIComponent(s) + '">' + U.esc(s) + '</a>'; }).join('') + '</div>' : '') +
        '<p class="mono" style="margin-top:26px">' + t('search.popular') + '</p>' +
        '<div class="sugg">' + popular.map(function (tg) { return U.tagChip(tg.id); }).join('') + '</div>' +
        '<div id="live" style="margin-top:34px"></div></div>';
    },
    mount: function (root) {
      var input = U.qs('#q', root), live = U.qs('#live', root), timer = null;
      function run() {
        var q = input.value.trim();
        if (q.length < 2) { live.innerHTML = ''; return; }
        var r = SR.query(q);
        var list = r.ids.slice(0, 12).map(S.byId).filter(Boolean);
        live.innerHTML = (r.suggestion ? '<div class="note">' + t('search.did') + ' <b>' + U.esc(r.suggestion) + '</b></div>' : '') +
          (list.length ? U.grid(list, { dense: true }) +
            '<div style="text-align:center;margin-top:26px"><a class="btn btn--ghost" href="#/shop?q=' + encodeURIComponent(q) + '">' +
            t('shop.results', { n: r.ids.length }) + ' →</a></div>'
            : U.empty('search.none'));
        U.hydrateImages(live);
      }
      input.addEventListener('input', function () { clearTimeout(timer); timer = setTimeout(run, 140); });
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && input.value.trim()) location.hash = '#/shop?q=' + encodeURIComponent(input.value.trim());
      });
      if (input.value) run();
      input.focus();
    }
  };
})(window.KADR = window.KADR || {});
