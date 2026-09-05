/* Home — brand first, catalogue second. Blocks are admin-controlled. */
(function (K) {
  'use strict';
  var D = K.data, S = K.store, U = K.ui, SR = K.search, VH = K.vh;
  var t = function (k, v) { return K.i18n.t(k, v); }, tc = function (o) { return K.i18n.tc(o); };

  function hero() {
    var scene = D.SCENES[0];
    return '<section class="hero"><div class="wrap"><div class="hero__grid">' +
      '<div class="rv rv-1">' +
        '<p class="eyebrow">' + t('home.hero.eyebrow') + '</p>' +
        '<h1 class="h1 hero__title">' + t('home.hero.title').replace(/(unfinished|անավարտ|незаконченные)/, '<em>$1</em>') + '</h1>' +
        '<p class="lede">' + t('home.hero.sub') + '</p>' +
        '<div class="hero__cta">' +
          '<a class="btn" href="#/explore">' + t('home.hero.cta1') + '</a>' +
          (S.state.settings.features.completeYourRoom ? '<a class="btn btn--ghost" href="#/composer">' + t('home.hero.cta2') + '</a>' : '') +
        '</div>' +
        '<div class="hero__facts">' +
          '<div class="hero__fact"><b class="num">' + S.live().length + '+</b><span>' + tc({ en: 'pieces ready to print', hy: 'գործ պատրաստ տպագրության', ru: 'работ готовы к печати' }) + '</span></div>' +
          '<div class="hero__fact"><b class="num">3–6</b><span>' + tc({ en: 'days to your wall', hy: 'օր մինչև պատը', ru: 'дней до стены' }) + '</span></div>' +
          '<div class="hero__fact"><b>' + U.money(2900) + '</b><span>' + tc({ en: 'first wall starts at', hy: 'առաջին պատը՝ սկսած', ru: 'первая стена от' }) + '</span></div>' +
        '</div>' +
      '</div>' +
      '<div class="hero__scene rv rv-2">' +
        '<img src="' + VH.sceneUrl(scene, 1100, 800) + '" alt="' + U.esc(tc(scene.title)) + '">' +
        '<span class="hero__tagline">' + t('brand.tag') + ' — Yerevan</span>' +
      '</div>' +
      '</div></div></section>';
  }

  function brand() {
    var pts = [1, 2, 3].map(function (i) {
      return '<div><h3 class="h3">' + t('home.brand.p' + i) + '</h3><p style="color:var(--ink-2);font-size:14px">' + t('home.brand.p' + i + 'd') + '</p></div>';
    }).join('');
    return '<section class="section"><div class="wrap two">' +
      '<div><p class="eyebrow">01 — ' + tc({ en: 'Who we are', hy: 'Ովքեր ենք մենք', ru: 'Кто мы' }) + '</p>' +
      '<h2 class="h2" style="margin:16px 0 18px">' + t('home.brand.title') + '</h2>' +
      '<p class="lede">' + t('home.brand.body') + '</p></div>' +
      '<div style="display:grid;gap:22px;align-content:center">' + pts + '</div>' +
      '</div></section>';
  }

  function inspiration() {
    var scenes = D.SCENES.slice(0, 5);
    return '<section class="section"><div class="wrap">' +
      VH.sectionHead(t('home.inspiration'), '02 — ' + t('nav.rooms'), '#/rooms') +
      '<p class="lede" style="margin:-12px 0 26px">' + t('home.inspiration.sub') + '</p>' +
      '<div class="scenes">' + scenes.map(function (s, i) { return VH.sceneCard(s, i === 0 ? 'scene--big' : ''); }).join('') + '</div>' +
      '</div></section>';
  }

  function personalize() {
    var has = !!S.state.prefs;
    return '<section class="section"><div class="wrap">' +
      '<div class="panel" style="display:grid;grid-template-columns:1fr auto;gap:26px;align-items:center;padding:clamp(24px,4vw,54px)">' +
      '<div><p class="eyebrow">03 — ' + tc({ en: 'Personal', hy: 'Անհատական', ru: 'Персонально' }) + '</p>' +
      '<h2 class="h2" style="margin:14px 0 12px">' + t('home.personalize.t') + '</h2>' +
      '<p class="lede" style="margin:0">' + t('home.personalize.b') + '</p></div>' +
      '<a class="btn btn--oxide" href="#/preferences">' + (has ? t('home.personalize.re') : t('home.personalize.cta')) + '</a>' +
      '</div></div></section>';
  }

  function newArrivals() {
    var list = S.live().slice().sort(function (a, b) { return b.createdAt - a.createdAt; }).slice(0, 10);
    return '<section class="section"><div class="wrap">' + VH.sectionHead(t('home.new'), '04 — ' + t('nav.new'), '#/shop?sort=new') +
      '<div class="rail__track">' + list.map(function (p) { return U.card(p, { w: 420 }); }).join('') + '</div></div></section>';
  }

  function collections() {
    var cols = D.COLLECTIONS.filter(function (c) { return c.featured; }).slice(0, 4);
    return '<section class="section"><div class="wrap">' + VH.sectionHead(t('home.collections'), '05 — ' + t('nav.collections'), '#/collections') +
      '<div class="scenes">' + cols.map(VH.collectionCard).join('') + '</div></div></section>';
  }

  function trending() {
    var list = S.live().slice().sort(function (a, b) { return SR.pop(b) - SR.pop(a); }).slice(0, 10);
    return '<section class="section"><div class="wrap">' + VH.sectionHead(t('home.trending'), '06 — ' + tc({ en: 'Popular', hy: 'Հանրաճանաչ', ru: 'Популярное' }), '#/shop?sort=popular') +
      '<div class="rail__track">' + list.map(function (p) { return U.card(p, { w: 420 }); }).join('') + '</div></div></section>';
  }

  function business() {
    return '<section class="section"><div class="wrap two" style="align-items:center">' +
      '<div><p class="eyebrow">' + tc({ en: 'For business', hy: 'Բիզնեսի համար', ru: 'Для бизнеса' }) + '</p>' +
      '<h2 class="h2" style="margin:14px 0">' + tc({ en: 'Forty pieces for a restaurant? Send us the floor plan.', hy: 'Քառասուն գործ ռեստորանի՞ համար։', ru: 'Сорок работ для ресторана? Пришлите план зала.' }) + '</h2>' +
      '<p class="lede">' + tc({ en: 'Volume pricing, consistent framing, one invoice, one delivery.', hy: 'Ծավալային գներ, մեկ հաշիվ, մեկ առաքում։', ru: 'Оптовые цены, один счёт, одна доставка.' }) + '</p>' +
      '<div style="margin-top:22px"><a class="btn btn--ghost" href="#/contact">' + t('nav.contact') + '</a></div></div>' +
      '<div>' + VH.sceneCard(D.SCENES[8]) + '</div></div></section>';
  }

  function recentlyViewed() {
    var list = S.state.recent.map(S.byId).filter(Boolean).slice(0, 10);
    if (list.length < 3) return '';
    return '<section class="section"><div class="wrap">' + VH.sectionHead(t('acc.recent'), '') +
      '<div class="rail__track">' + list.map(function (p) { return U.card(p, { w: 380 }); }).join('') + '</div></div></section>';
  }

  var BLOCKS = { hero: hero, brand: brand, inspiration: inspiration, personalize: personalize,
                 new: newArrivals, collections: collections, trending: trending, business: business };

  K.views = K.views || {};
  K.views.home = {
    render: function () {
      U.setMeta({
        title: S.state.settings.seo.title,
        description: S.state.settings.seo.description,
        jsonld: { '@context': 'https://schema.org', '@type': 'Organization', name: 'KADR', url: location.href, areaServed: 'AM' }
      });
      var out = '';
      S.state.settings.homepage.forEach(function (b) {
        if (b.on && BLOCKS[b.id]) out += BLOCKS[b.id]();
      });
      out += recentlyViewed();
      return out;
    }
  };
})(window.KADR = window.KADR || {});
