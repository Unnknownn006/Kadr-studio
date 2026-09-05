/* Shared view helpers. */
(function (K) {
  'use strict';
  var D = K.data, S = K.store, U = K.ui, SR = K.search;
  var t = function (k, v) { return K.i18n.t(k, v); }, tc = function (o) { return K.i18n.tc(o); };

  /* Wall layouts by piece count — hand-set so scenes look composed, not random */
  var LAYOUTS = {
    1: [{ x: .38, y: .16, w: .24, h: .34 }],
    2: [{ x: .26, y: .15, w: .21, h: .30 }, { x: .53, y: .19, w: .19, h: .26 }],
    3: [{ x: .18, y: .14, w: .20, h: .29 }, { x: .41, y: .12, w: .22, h: .32 }, { x: .66, y: .18, w: .17, h: .24 }],
    4: [{ x: .14, y: .12, w: .19, h: .27 }, { x: .35, y: .10, w: .20, h: .29 }, { x: .57, y: .14, w: .17, h: .25 }, { x: .76, y: .20, w: .14, h: .20 }],
    5: [{ x: .10, y: .13, w: .17, h: .25 }, { x: .29, y: .09, w: .19, h: .28 }, { x: .50, y: .13, w: .16, h: .23 }, { x: .68, y: .10, w: .15, h: .22 }, { x: .68, y: .35, w: .15, h: .16 }],
    6: [{ x: .08, y: .12, w: .16, h: .23 }, { x: .26, y: .08, w: .18, h: .27 }, { x: .46, y: .12, w: .15, h: .22 }, { x: .63, y: .09, w: .14, h: .21 }, { x: .63, y: .33, w: .14, h: .15 }, { x: .79, y: .16, w: .13, h: .19 }]
  };

  function sceneArt(scene, products) {
    var list = products || SR.sceneProducts(scene);
    var lay = LAYOUTS[Math.min(6, Math.max(1, list.length))] || LAYOUTS[3];
    return lay.map(function (pos, i) {
      var p = list[i % list.length];
      return {
        x: pos.x, y: pos.y, w: pos.w, h: pos.h, seed: scene.id + p.id,
        palette: p.palette, comp: p.comp,
        frame: p.typeId === 'poster' ? ['black', 'oak', 'white', 'none'][i % 4] : 'none'
      };
    });
  }
  function sceneUrl(scene, w, h) {
    return K.art.sceneUrl({ room: scene.room, seed: scene.id, w: w || 900, h: h || 620, art: sceneArt(scene) });
  }
  function sceneCard(scene, cls) {
    return '<a class="scene ' + (cls || '') + '" href="#/room/' + scene.id + '" data-action="scene" data-id="' + scene.id + '">' +
      '<img src="' + sceneUrl(scene, 900, 620) + '" alt="' + U.esc(tc(scene.title)) + '" loading="lazy" decoding="async">' +
      '<div class="scene__cap"><span>' + U.esc(tc(D.tagById(scene.tags[0]) ? D.tagById(scene.tags[0]).name : { en: scene.room })) + '</span>' +
      '<h3>' + U.esc(tc(scene.title)) + '</h3></div></a>';
  }
  function collectionCard(col) {
    var all = SR.collectionProducts(col.id);
    var items = all.slice(0, 3);
    if (!items.length) return '';
    return '<a class="scene" href="#/collection/' + col.id + '">' +
      '<img src="' + K.art.sceneUrl({ room: 'living', seed: 'col' + col.id, w: 760, h: 520, art: sceneArt({ id: col.id }, items) }) +
      '" alt="' + U.esc(tc(col.title)) + '" loading="lazy" decoding="async">' +
      '<div class="scene__cap"><span>' + all.length + ' ' + t('ui.items') + '</span>' +
      '<h3>' + U.esc(tc(col.title)) + '</h3></div></a>';
  }
  function sectionHead(title, sub, href, label) {
    return '<div class="section__head"><div>' +
      (sub ? '<p class="eyebrow">' + U.esc(sub) + '</p>' : '') +
      '<h2 class="h2">' + U.esc(title) + '</h2></div>' +
      (href ? '<a class="link" href="' + href + '">' + U.esc(label || t('ui.seeAll')) + ' →</a>' : '') + '</div>';
  }
  function pageHead(title, sub) {
    return '<header class="section section--tight" style="border:0;padding-bottom:14px">' +
      (sub ? '<p class="eyebrow">' + U.esc(sub) + '</p>' : '') +
      '<h1 class="h1" style="font-size:clamp(2rem,4.4vw,3.6rem);margin-top:12px">' + U.esc(title) + '</h1></header>';
  }
  function homeOn(id) {
    var b = S.state.settings.homepage.filter(function (x) { return x.id === id; })[0];
    return b ? b.on : false;
  }

  K.vh = { sceneArt: sceneArt, sceneUrl: sceneUrl, sceneCard: sceneCard, collectionCard: collectionCard,
           sectionHead: sectionHead, pageHead: pageHead, homeOn: homeOn, LAYOUTS: LAYOUTS };
})(window.KADR = window.KADR || {});
