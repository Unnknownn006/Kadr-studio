/* KADR — search, filtering and recommendations.
   An in-memory inverted index with fuzzy matching. It is deliberately shaped
   like a search *service*: documents in, ranked ids out. Swapping this for
   Meilisearch / Typesense / OpenSearch later means reimplementing query() only. */
(function (K) {
  'use strict';
  var D = K.data, S = K.store;

  /* ---------- normalisation ------------------------------------------------ */

  function norm(s) {
    return String(s || '').toLowerCase()
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^\p{L}\p{N}]+/gu, ' ')
      .trim();
  }
  function tokens(s) { return norm(s).split(' ').filter(function (t) { return t.length > 1; }); }

  /* Cross-language synonyms: the query language need not match the data. */
  var SYNONYMS = {
    poster: ['print', 'wallart', 'artwork', 'plakat', 'постер', 'плакат', 'принт', 'պաստառ', 'poster'],
    frame: ['framed', 'framing', 'рама', 'рамка', 'շրջանակ'],
    canvas: ['холст', 'кտав', 'кտավ', 'canvas'],
    flag: ['banner', 'флаг', 'баннер', 'դրոշ'],
    bedroom: ['bed', 'спальня', 'ննջասենյակ'],
    gaming: ['gamer', 'game', 'игровая', 'гейминг', 'геймер'],
    minimal: ['minimalist', 'minimalism', 'минимализм', 'минимал'],
    dark: ['black', 'noir', 'тёмный', 'темный', 'чёрный', 'черный', 'մուգ'],
    car: ['cars', 'auto', 'машина', 'машины', 'авто'],
    anime: ['manga', 'аниме', 'манга'],
    cheap: ['budget', 'affordable', 'дешево', 'недорого'],
    office: ['work', 'офис', 'кабинет'],
    plant: ['plants', 'botanical', 'растения', 'цветы'],
    gold: ['golden', 'brass', 'золотой', 'ոսկե']
  };
  var SYN_LOOKUP = {};
  Object.keys(SYNONYMS).forEach(function (canon) {
    SYN_LOOKUP[canon] = canon;
    SYNONYMS[canon].forEach(function (v) { SYN_LOOKUP[norm(v)] = canon; });
  });

  /* ---------- index -------------------------------------------------------- */

  var postings = {};      /* token -> { pid: weight } */
  var vocab = [];         /* for fuzzy candidate generation */
  var vocabByLen = {};
  var aliases = {};       /* synonym-only term -> canonical term (never indexed itself) */
  var built = false;
  var hotCut = Infinity;  /* 90th percentile popularity, for the "trending" badge */

  var FIELD_WEIGHT = { sku: 30, title: 12, tag: 7, theme: 5, category: 5, type: 4, attr: 3, desc: 1 };

  function addToken(tok, pid, weight) {
    if (!tok || tok.length < 2) return;
    var row = postings[tok] || (postings[tok] = {});
    row[pid] = Math.max(row[pid] || 0, weight);
  }

  function build() {
    postings = {}; vocab = []; vocabByLen = {};
    var langs = ['en', 'hy', 'ru'];
    S.products.forEach(function (p) {
      addToken(norm(p.sku), p.id, FIELD_WEIGHT.sku);
      norm(p.sku).split(' ').forEach(function (t) { addToken(t, p.id, FIELD_WEIGHT.sku * 0.5); });
      langs.forEach(function (l) {
        tokens(p.title[l]).forEach(function (t) { addToken(t, p.id, FIELD_WEIGHT.title); });
        tokens(p.description[l]).slice(0, 24).forEach(function (t) { addToken(t, p.id, FIELD_WEIGHT.desc); });
      });
      p.tags.forEach(function (id) {
        addToken(norm(id), p.id, FIELD_WEIGHT.tag);
        var tg = D.tagById(id);
        if (tg) langs.forEach(function (l) { tokens(tg.name[l]).forEach(function (t) { addToken(t, p.id, FIELD_WEIGHT.tag); }); });
      });
      addToken(norm(p.themeId), p.id, FIELD_WEIGHT.theme);
      var cat = D.catById(p.categoryId);
      if (cat) langs.forEach(function (l) { tokens(cat.name[l]).forEach(function (t) { addToken(t, p.id, FIELD_WEIGHT.category); }); });
      var ty = D.PRODUCT_TYPES[p.typeId];
      if (ty) langs.forEach(function (l) { tokens(ty.name[l]).forEach(function (t) { addToken(t, p.id, FIELD_WEIGHT.type); }); });
      /* attributes and their values are searchable: "oak frame", "холст", "60x90" */
      (ty ? ty.components : []).forEach(function (c) {
        var a = D.ATTRIBUTES[c]; if (!a) return;
        langs.forEach(function (l) {
          tokens(a.name[l]).forEach(function (t) { addToken(t, p.id, FIELD_WEIGHT.attr); });
          a.values.forEach(function (v) {
            tokens(v.label[l]).forEach(function (t) { addToken(t, p.id, FIELD_WEIGHT.attr); });
            addToken(norm(v.id), p.id, FIELD_WEIGHT.attr);
          });
        });
      });
    });
    vocab = Object.keys(postings);
    /* Synonyms join the fuzzy vocabulary as aliases, so "minimalizm" can reach
       "minimalism" -> "minimal" even though nobody typed the indexed word. */
    aliases = {};
    Object.keys(SYN_LOOKUP).forEach(function (term) {
      if (!postings[term] && term.length > 2) aliases[term] = SYN_LOOKUP[term];
    });
    vocab.concat(Object.keys(aliases)).forEach(function (t) {
      (vocabByLen[t.length] || (vocabByLen[t.length] = [])).push(t);
    });
    var pops = S.live().map(pop).sort(function (a, b) { return a - b; });
    hotCut = pops.length ? pops[Math.floor(pops.length * 0.9)] : Infinity;
    built = true;
  }

  /* Damerau–Levenshtein, capped — cheap enough over a bucketed candidate set. */
  function editDistance(a, b, max) {
    var al = a.length, bl = b.length;
    if (Math.abs(al - bl) > max) return max + 1;
    var prev2 = [], prev = [], cur = [], i, j;
    for (j = 0; j <= bl; j++) prev[j] = j;
    for (i = 1; i <= al; i++) {
      cur = [i]; var best = i;
      for (j = 1; j <= bl; j++) {
        var cost = a[i - 1] === b[j - 1] ? 0 : 1;
        var v = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
        if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) v = Math.min(v, prev2[j - 2] + 1);
        cur[j] = v; if (v < best) best = v;
      }
      if (best > max) return max + 1;
      prev2 = prev; prev = cur;
    }
    return prev[bl];
  }

  function fuzzyCandidates(tok) {
    var max = tok.length <= 4 ? 1 : 2;
    var best = null, bestD = 99;
    for (var l = tok.length - max; l <= tok.length + max; l++) {
      var bucket = vocabByLen[l]; if (!bucket) continue;
      for (var i = 0; i < bucket.length; i++) {
        var cand = bucket[i];
        if (cand[0] !== tok[0] && cand[1] !== tok[1]) continue;   /* prune */
        var d = editDistance(tok, cand, max);
        if (d < bestD) { bestD = d; best = cand; if (d === 1) break; }
      }
      if (bestD === 1) break;
    }
    return bestD <= max ? { token: best, distance: bestD } : null;
  }

  /* Resolve any term — indexed word or synonym alias — to a postings map. */
  function postingsFor(term) {
    if (postings[term]) return postings[term];
    var canon = aliases[term];
    if (!canon) return null;
    var merged = null;
    expand(canon).forEach(function (v) {
      if (!postings[v]) return;
      merged = merged || {};
      Object.keys(postings[v]).forEach(function (pid) {
        merged[pid] = Math.max(merged[pid] || 0, postings[v][pid] * 0.8);
      });
    });
    return merged;
  }

  function expand(tok) {
    var canon = SYN_LOOKUP[tok];
    if (!canon) return [tok];
    var list = [tok, canon].concat(SYNONYMS[canon].map(norm));
    return list.filter(function (v, i, a) { return a.indexOf(v) === i; });
  }

  /* ---------- query -------------------------------------------------------- */

  function query(q, opts) {
    if (!built) build();
    opts = opts || {};
    var qt = tokens(q);
    if (!qt.length) return { ids: [], scores: {}, suggestion: null, corrected: [] };

    var scores = {}, corrected = [], usedCorrection = false;

    qt.forEach(function (tok) {
      var variants = expand(tok), matched = false;
      var termScores = {};

      variants.forEach(function (v) {
        if (postings[v]) {
          matched = true;
          Object.keys(postings[v]).forEach(function (pid) {
            termScores[pid] = Math.max(termScores[pid] || 0, postings[v][pid] * (v === tok ? 1 : 0.8));
          });
        }
      });

      /* prefix match — "post" finds "poster" while typing */
      if (tok.length >= 3) {
        for (var i = 0; i < vocab.length; i++) {
          var t = vocab[i];
          if (t.length > tok.length && t.indexOf(tok) === 0) {
            matched = true;
            Object.keys(postings[t]).forEach(function (pid) {
              termScores[pid] = Math.max(termScores[pid] || 0, postings[t][pid] * 0.7);
            });
          }
        }
      }

      /* typo tolerance — only when nothing matched exactly */
      if (!matched) {
        var f = fuzzyCandidates(tok);
        var fp = f ? postingsFor(f.token) : null;
        if (fp) {
          usedCorrection = true;
          corrected.push({ from: tok, to: f.token });
          Object.keys(fp).forEach(function (pid) {
            termScores[pid] = Math.max(termScores[pid] || 0, fp[pid] * (f.distance === 1 ? 0.85 : 0.6));
          });
        } else {
          corrected.push({ from: tok, to: null });
        }
      }

      Object.keys(termScores).forEach(function (pid) {
        scores[pid] = (scores[pid] || 0) + termScores[pid];
      });
    });

    /* every query token should ideally hit — reward documents that match more */
    var ids = Object.keys(scores);
    ids.forEach(function (pid) {
      var p = S.byId(pid);
      if (!p || p.status !== 'live') { delete scores[pid]; return; }
      scores[pid] += Math.log1p(p.stats.views + p.stats.orders * 8) * 0.9;                 /* popularity */
      scores[pid] += Math.max(0, 1 - (Date.now() - p.createdAt) / (90 * 86400000)) * 2;    /* freshness */
      if (S.state.settings.features.personalization) scores[pid] += Math.min(6, S.affinityScore(p.tags) * 0.05);
    });

    ids = Object.keys(scores).sort(function (a, b) { return scores[b] - scores[a]; });
    var suggestion = null;
    if (usedCorrection) {
      suggestion = qt.map(function (tok) {
        var c = corrected.filter(function (x) { return x.from === tok; })[0];
        return c && c.to ? c.to : tok;
      }).join(' ');
      if (norm(suggestion) === norm(q)) suggestion = null;
    }
    return { ids: ids, scores: scores, suggestion: suggestion, corrected: corrected };
  }

  /* ---------- filtering, faceting, sorting --------------------------------- */

  var FILTERABLE_TAG_GROUPS = ['style', 'mood', 'room', 'color', 'theme', 'brand', 'place'];

  function matches(p, f) {
    if (!f) return true;
    if (f.category && f.category !== 'all') {
      var cat = D.catById(f.category);
      var kids = D.CATEGORIES.filter(function (c) { return c.parent === f.category; }).map(function (c) { return c.id; });
      if (p.categoryId !== f.category && kids.indexOf(p.categoryId) < 0) return false;
      if (!cat) return false;
    }
    if (f.type && f.type !== 'all' && p.typeId !== f.type) return false;
    if (f.tags && f.tags.length) {
      /* tags within a group are OR, across groups AND — the behaviour shoppers expect */
      var byGroup = {};
      f.tags.forEach(function (id) {
        var t = D.tagById(id); var g = t ? t.group : 'theme';
        (byGroup[g] || (byGroup[g] = [])).push(id);
      });
      var ok = Object.keys(byGroup).every(function (g) {
        return byGroup[g].some(function (id) { return p.tags.indexOf(id) >= 0; });
      });
      if (!ok) return false;
    }
    if (f.collection) {
      var col = D.COLLECTIONS.filter(function (c) { return c.id === f.collection; })[0];
      if (col && !inCollection(p, col)) return false;
    }
    if (f.price) {
      var r = D.priceRange(p);
      if (f.price[0] != null && r.max < f.price[0]) return false;
      if (f.price[1] != null && r.min > f.price[1]) return false;
    }
    if (f.sizes && f.sizes.length) {
      var type = D.PRODUCT_TYPES[p.typeId];
      var sizeComp = type.components.indexOf('size') >= 0 ? 'size' : (type.components.indexOf('flagSize') >= 0 ? 'flagSize' : null);
      if (!sizeComp) return false;
      var avail = D.ATTRIBUTES[sizeComp].values.map(function (v) { return v.id; });
      if (!f.sizes.some(function (s) { return avail.indexOf(s) >= 0; })) return false;
    }
    if (f.materials && f.materials.length) {
      var t2 = D.PRODUCT_TYPES[p.typeId];
      var mc = ['material', 'flagMaterial', 'panelMaterial'].filter(function (c) { return t2.components.indexOf(c) >= 0; })[0];
      if (!mc) return false;
      var av = D.ATTRIBUTES[mc].values.map(function (v) { return v.id; });
      if (!f.materials.some(function (s) { return av.indexOf(s) >= 0; })) return false;
    }
    return true;
  }

  function inCollection(p, col) {
    var tagHit = !col.tags || col.tags.some(function (t) { return p.tags.indexOf(t) >= 0; });
    var priceOk = !col.maxPrice || D.priceRange(p).min <= col.maxPrice;
    return tagHit && priceOk;
  }

  function collectionProducts(colId) {
    var col = D.COLLECTIONS.filter(function (c) { return c.id === colId; })[0];
    if (!col) return [];
    return S.live().filter(function (p) { return inCollection(p, col); });
  }

  function facets(list) {
    var out = { tags: {}, types: {}, categories: {} };
    list.forEach(function (p) {
      p.tags.forEach(function (t) { out.tags[t] = (out.tags[t] || 0) + 1; });
      out.types[p.typeId] = (out.types[p.typeId] || 0) + 1;
      out.categories[p.categoryId] = (out.categories[p.categoryId] || 0) + 1;
    });
    return out;
  }

  function sortList(list, mode, scores) {
    var arr = list.slice();
    switch (mode) {
      case 'new': return arr.sort(function (a, b) { return b.createdAt - a.createdAt; });
      case 'popular': return arr.sort(function (a, b) { return pop(b) - pop(a); });
      case 'priceAsc': return arr.sort(function (a, b) { return D.priceRange(a).min - D.priceRange(b).min; });
      case 'priceDesc': return arr.sort(function (a, b) { return D.priceRange(b).min - D.priceRange(a).min; });
      case 'relevance': return arr.sort(function (a, b) { return (scores[b.id] || 0) - (scores[a.id] || 0); });
      default: return arr.sort(function (a, b) { return recommendScore(b) - recommendScore(a); });
    }
  }
  function pop(p) { return p.stats.views + p.stats.favs * 4 + p.stats.carts * 6 + p.stats.orders * 12; }

  function recommendScore(p) {
    var s = 0;
    if (S.state.settings.features.personalization) s += S.affinityScore(p.tags) * 1.2;
    s += Math.log1p(pop(p)) * 3;
    s += Math.max(0, 1 - (Date.now() - p.createdAt) / (120 * 86400000)) * 8;
    return s;
  }

  /* Personalised feed: affinity-ranked with deliberate exploration, so the feed
     never collapses into a single taste. */
  function feed(seedOffset) {
    var list = S.live();
    var scored = list.map(function (p) {
      var r = ((K.art.hash(p.id + '|' + (seedOffset || 0)) % 1000) / 1000);
      return { p: p, s: recommendScore(p) + r * 14 };
    });
    return scored.sort(function (a, b) { return b.s - a.s; }).map(function (x) { return x.p; });
  }

  /* ---------- recommendations ---------------------------------------------- */

  function overlap(a, b) {
    var n = 0;
    a.forEach(function (t) { if (b.indexOf(t) >= 0) n++; });
    return n / Math.sqrt(a.length * b.length);
  }
  function similar(p, n) {
    return S.live().filter(function (o) { return o.id !== p.id; })
      .map(function (o) {
        var s = overlap(p.tags, o.tags) * 10 + (o.themeId === p.themeId ? 6 : 0) + (o.typeId === p.typeId ? 2 : 0);
        return { o: o, s: s };
      })
      .sort(function (a, b) { return b.s - a.s; }).slice(0, n || 8).map(function (x) { return x.o; });
  }
  function sameStyle(p, n) {
    var style = p.tags.filter(function (t) { var tg = D.tagById(t); return tg && tg.group === 'style'; })[0];
    if (!style) return [];
    return S.live().filter(function (o) { return o.id !== p.id && o.tags.indexOf(style) >= 0; })
      .sort(function (a, b) { return pop(b) - pop(a); }).slice(0, n || 8);
  }
  function byTag(tagId, n, excludeId) {
    return S.live().filter(function (o) { return o.tags.indexOf(tagId) >= 0 && o.id !== excludeId; })
      .sort(function (a, b) { return recommendScore(b) - recommendScore(a); }).slice(0, n || 200);
  }
  function alsoLike(p, n) {
    return S.live().filter(function (o) { return o.id !== p.id; })
      .map(function (o) { return { o: o, s: S.affinityScore(o.tags) * 1.5 + overlap(p.tags, o.tags) * 4 + Math.log1p(pop(o)) }; })
      .sort(function (a, b) { return b.s - a.s; }).slice(0, n || 8).map(function (x) { return x.o; });
  }
  /* Complementary: a different product type that shares mood/colour — what an
     interior person would put next to it, not another version of it. */
  function worksWith(p, n) {
    var moodColor = p.tags.filter(function (t) {
      var tg = D.tagById(t); return tg && (tg.group === 'mood' || tg.group === 'color' || tg.group === 'room');
    });
    return S.live().filter(function (o) { return o.typeId !== p.typeId; })
      .map(function (o) { return { o: o, s: overlap(moodColor, o.tags) * 10 + (o.themeId === p.themeId ? 3 : 0) + Math.log1p(pop(o)) * 0.5 }; })
      .sort(function (a, b) { return b.s - a.s; }).slice(0, n || 6).map(function (x) { return x.o; });
  }
  function sceneProducts(scene) {
    var list = S.live().filter(function (p) { return scene.themes.indexOf(p.themeId) >= 0; });
    var byType = {};
    list.forEach(function (p) { (byType[p.typeId] || (byType[p.typeId] = [])).push(p); });
    var out = [];
    Object.keys(byType).forEach(function (t) {
      byType[t].sort(function (a, b) { return K.art.hash(scene.id + a.id) - K.art.hash(scene.id + b.id); });
      out = out.concat(byType[t].slice(0, t === 'poster' ? 3 : 1));
    });
    return out.slice(0, 6);
  }

  K.search = {
    build: build, query: query, matches: matches, facets: facets, sortList: sortList,
    feed: feed, similar: similar, sameStyle: sameStyle, byTag: byTag, alsoLike: alsoLike,
    worksWith: worksWith, sceneProducts: sceneProducts, collectionProducts: collectionProducts,
    inCollection: inCollection, recommendScore: recommendScore, pop: pop,
    isHot: function (p) { return pop(p) >= hotCut; },
    FILTERABLE_TAG_GROUPS: FILTERABLE_TAG_GROUPS, norm: norm, tokens: tokens
  };
})(window.KADR = window.KADR || {});
