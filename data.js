/* KADR — catalogue model.
   Deliberately shaped like the real thing: attributes, options and rules are
   DATA, not code, so an admin can add a product type the front end has never
   heard of and the builder/filters/pricing keep working. */
(function (K) {
  'use strict';
  var art = K.art;

  /* ---------- money -------------------------------------------------------- */

  var CURRENCIES = {
    AMD: { code: 'AMD', symbol: '֏', rate: 1,        dec: 0, pos: 'after' },
    USD: { code: 'USD', symbol: '$', rate: 0.00258,  dec: 2, pos: 'before' },
    EUR: { code: 'EUR', symbol: '€', rate: 0.00238,  dec: 2, pos: 'before' },
    RUB: { code: 'RUB', symbol: '₽', rate: 0.205,    dec: 0, pos: 'after' }
  };

  /* ---------- categories --------------------------------------------------- */

  var CATEGORIES = [
    { id: 'wall-decor', slug: 'wall-decor', name: { en: 'Wall decor', hy: 'Պատի ձևավորում', ru: 'Декор стен' }, parent: null },
    { id: 'posters',    slug: 'posters',    name: { en: 'Posters', hy: 'Պաստառներ', ru: 'Постеры' }, parent: 'wall-decor' },
    { id: 'framed',     slug: 'framed-prints', name: { en: 'Framed prints', hy: 'Շրջանակված տպագրություն', ru: 'Постеры в раме' }, parent: 'wall-decor' },
    { id: 'canvas',     slug: 'canvas',     name: { en: 'Canvas', hy: 'Կտավ', ru: 'Холст' }, parent: 'wall-decor' },
    { id: 'flags',      slug: 'flags',      name: { en: 'Flags & banners', hy: 'Դրոշներ', ru: 'Флаги и баннеры' }, parent: 'wall-decor' },
    { id: 'room-decor', slug: 'room-decor', name: { en: 'Room decor', hy: 'Սենյակի դեկոր', ru: 'Декор комнаты' }, parent: null },
    { id: 'objects',    slug: 'objects',    name: { en: 'Decorative objects', hy: 'Դեկորատիվ առարկաներ', ru: 'Декоративные объекты' }, parent: 'room-decor' }
  ];

  /* ---------- dynamic attributes ------------------------------------------
     type: select | multi | number | bool | text. Values carry their own price
     effect and preview hints; nothing here is poster-specific. */

  var ATTRIBUTES = {
    size: {
      id: 'size', type: 'select', filterable: true,
      name: { en: 'Size', hy: 'Չափս', ru: 'Размер' },
      values: [
        { id: '30x40', label: { en: '30 × 40 cm', hy: '30 × 40 սմ', ru: '30 × 40 см' }, factor: 1,    ratio: 0.75 },
        { id: '50x70', label: { en: '50 × 70 cm', hy: '50 × 70 սմ', ru: '50 × 70 см' }, factor: 1.55, ratio: 0.714 },
        { id: '61x91', label: { en: '61 × 91 cm', hy: '61 × 91 սմ', ru: '61 × 91 см' }, factor: 2.05, ratio: 0.67 },
        { id: '70x100', label: { en: '70 × 100 cm', hy: '70 × 100 սմ', ru: '70 × 100 см' }, factor: 2.6, ratio: 0.7 }
      ]
    },
    material: {
      id: 'material', type: 'select', filterable: true,
      name: { en: 'Material', hy: 'Նյութ', ru: 'Материал' },
      values: [
        { id: 'paper',    label: { en: 'Matte paper 200g', hy: 'Փայլատ թուղթ 200գ', ru: 'Матовая бумага 200г' }, add: 0 },
        { id: 'premium',  label: { en: 'Museum paper 250g', hy: 'Թանգարանային թուղթ 250գ', ru: 'Музейная бумага 250г' }, add: 1400 },
        { id: 'canvas',   label: { en: 'Canvas, stretched', hy: 'Կտավ, ձգված', ru: 'Холст на подрамнике' }, add: 3600 },
        { id: 'pcanvas',  label: { en: 'Premium canvas', hy: 'Պրեմիում կտավ', ru: 'Премиум холст' }, add: 6200 }
      ]
    },
    frame: {
      id: 'frame', type: 'select', filterable: true,
      name: { en: 'Frame', hy: 'Շրջանակ', ru: 'Рама' },
      values: [
        { id: 'none',   label: { en: 'No frame', hy: 'Առանց շրջանակի', ru: 'Без рамы' }, add: 0, swatch: 'transparent' },
        { id: 'black',  label: { en: 'Black', hy: 'Սև', ru: 'Чёрная' }, add: 4200, swatch: '#15151a' },
        { id: 'white',  label: { en: 'White', hy: 'Սպիտակ', ru: 'Белая' }, add: 4200, swatch: '#f2efe8' },
        { id: 'oak',    label: { en: 'Oak', hy: 'Կաղնի', ru: 'Дуб' }, add: 6800, swatch: '#c9a273' },
        { id: 'walnut', label: { en: 'Walnut', hy: 'Ընկուզենի', ru: 'Орех' }, add: 8400, swatch: '#6c4327' }
      ]
    },
    finish: {
      id: 'finish', type: 'select', filterable: false,
      name: { en: 'Finish', hy: 'Մակերես', ru: 'Покрытие' },
      values: [
        { id: 'matte', label: { en: 'Matte', hy: 'Փայլատ', ru: 'Матовое' }, add: 0 },
        { id: 'satin', label: { en: 'Satin', hy: 'Սատին', ru: 'Сатин' }, add: 800 }
      ]
    },
    flagSize: {
      id: 'flagSize', type: 'select', filterable: true,
      name: { en: 'Size', hy: 'Չափս', ru: 'Размер' },
      values: [
        { id: '90x150',  label: { en: '90 × 150 cm', hy: '90 × 150 սմ', ru: '90 × 150 см' }, factor: 1, ratio: 0.6 },
        { id: '150x240', label: { en: '150 × 240 cm', hy: '150 × 240 սմ', ru: '150 × 240 см' }, factor: 1.9, ratio: 0.62 }
      ]
    },
    flagMaterial: {
      id: 'flagMaterial', type: 'select', filterable: true,
      name: { en: 'Material', hy: 'Նյութ', ru: 'Материал' },
      values: [
        { id: 'poly',    label: { en: 'Polyester 110g', hy: 'Պոլիեսթեր 110գ', ru: 'Полиэстер 110г' }, add: 0 },
        { id: 'blockout', label: { en: 'Blockout, double-sided', hy: 'Երկկողմանի', ru: 'Двусторонний блокаут' }, add: 5200 }
      ]
    },
    mounting: {
      id: 'mounting', type: 'select', filterable: false,
      name: { en: 'Mounting', hy: 'Ամրացում', ru: 'Крепление' },
      values: [
        { id: 'grommets', label: { en: 'Metal grommets', hy: 'Մետաղյա օղակներ', ru: 'Металлические люверсы' }, add: 0 },
        { id: 'sleeve',   label: { en: 'Pole sleeve', hy: 'Ձողի պատյան', ru: 'Карман для древка' }, add: 900 },
        { id: 'hidden',   label: { en: 'Hidden rail', hy: 'Թաքնված ռելս', ru: 'Скрытая планка' }, add: 2400 }
      ]
    },
    placement: {
      id: 'placement', type: 'select', filterable: true,
      name: { en: 'Placement', hy: 'Տեղադրում', ru: 'Размещение' },
      values: [
        { id: 'indoor',  label: { en: 'Indoor', hy: 'Ներսում', ru: 'В помещении' }, add: 0 },
        { id: 'outdoor', label: { en: 'Outdoor, UV coated', hy: 'Դրսում, UV', ru: 'Улица, UV' }, add: 3100 }
      ]
    },
    panelMaterial: {
      id: 'panelMaterial', type: 'select', filterable: true,
      name: { en: 'Material', hy: 'Նյութ', ru: 'Материал' },
      values: [
        { id: 'alu',  label: { en: 'Brushed aluminium', hy: 'Ալյումին', ru: 'Шлифованный алюминий' }, add: 0 },
        { id: 'birch', label: { en: 'Birch ply', hy: 'Կեչի', ru: 'Берёзовая фанера' }, add: 2600 },
        { id: 'acryl', label: { en: 'Acrylic, backlit-ready', hy: 'Ակրիլ', ru: 'Акрил' }, add: 7400 }
      ]
    },
    objectFinish: {
      id: 'objectFinish', type: 'select', filterable: true,
      name: { en: 'Finish', hy: 'Հարդարանք', ru: 'Отделка' },
      values: [
        { id: 'sand',  label: { en: 'Sand', hy: 'Ավազ', ru: 'Песочный' }, add: 0, swatch: '#d8c9ae' },
        { id: 'ink',   label: { en: 'Ink', hy: 'Թանաք', ru: 'Чернильный' }, add: 0, swatch: '#1f2229' },
        { id: 'clay',  label: { en: 'Clay', hy: 'Կավ', ru: 'Терракота' }, add: 1200, swatch: '#b4634a' },
        { id: 'brass', label: { en: 'Brass', hy: 'Արույր', ru: 'Латунь' }, add: 5400, swatch: '#b98f3e' }
      ]
    }
  };

  /* ---------- product types = builder blueprints ---------------------------
     Each type lists its components (ordered builder steps) and the rules that
     make options depend on each other. Adding a type needs no code change. */

  var PRODUCT_TYPES = {
    poster: {
      id: 'poster', categoryId: 'posters',
      name: { en: 'Poster', hy: 'Պաստառ', ru: 'Постер' },
      components: ['size', 'material', 'frame', 'finish'],
      defaults: { size: '50x70', material: 'paper', frame: 'none', finish: 'matte' },
      rules: [
        { when: { size: '30x40' }, disable: { material: ['canvas', 'pcanvas'], frame: ['walnut'] },
          why: { en: 'Canvas and walnut start at 50 × 70.', hy: 'Կտավը սկսվում է 50 × 70-ից։', ru: 'Холст и орех — от 50 × 70.' } },
        { when: { material: ['canvas', 'pcanvas'] }, disable: { frame: ['black', 'white', 'oak', 'walnut'] },
          why: { en: 'Stretched canvas ships ready to hang, without a frame.', hy: 'Ձգված կտավը գալիս է առանց շրջանակի։', ru: 'Холст на подрамнике поставляется без рамы.' } },
        { when: { material: 'pcanvas' }, disable: { size: ['30x40', '50x70'] },
          why: { en: 'Premium canvas is made from 61 × 91 up.', hy: 'Պրեմիում կտավը՝ 61 × 91-ից։', ru: 'Премиум холст — от 61 × 91.' } }
      ]
    },
    flag: {
      id: 'flag', categoryId: 'flags',
      name: { en: 'Flag', hy: 'Դրոշ', ru: 'Флаг' },
      components: ['flagSize', 'flagMaterial', 'mounting', 'placement'],
      defaults: { flagSize: '90x150', flagMaterial: 'poly', mounting: 'grommets', placement: 'indoor' },
      rules: [
        { when: { placement: 'outdoor' }, disable: { flagMaterial: ['poly'], mounting: ['hidden'] },
          why: { en: 'Outdoor flags need the heavier double-sided fabric.', hy: 'Դրսի դրոշները պահանջում են ավելի ծանր գործվածք։', ru: 'Уличным флагам нужна плотная двусторонняя ткань.' } }
      ]
    },
    panel: {
      id: 'panel', categoryId: 'wall-decor',
      name: { en: 'Wall panel', hy: 'Պատի վահանակ', ru: 'Настенная панель' },
      components: ['size', 'panelMaterial', 'mounting'],
      defaults: { size: '50x70', panelMaterial: 'alu', mounting: 'hidden' },
      rules: [
        { when: { panelMaterial: 'acryl' }, disable: { size: ['30x40'] },
          why: { en: 'Acrylic starts at 50 × 70.', hy: 'Ակրիլը սկսվում է 50 × 70-ից։', ru: 'Акрил — от 50 × 70.' } }
      ]
    },
    object: {
      id: 'object', categoryId: 'objects',
      name: { en: 'Object', hy: 'Առարկա', ru: 'Объект' },
      components: ['objectFinish'],
      defaults: { objectFinish: 'sand' },
      rules: []
    }
  };

  /* ---------- tags: first-class entities, not strings ---------------------- */

  function tag(id, en, hy, ru, group) {
    return { id: id, slug: id, group: group || 'theme', name: { en: en, hy: hy, ru: ru } };
  }
  var TAGS = [
    tag('anime', 'Anime', 'Անիմե', 'Аниме'), tag('cars', 'Cars', 'Մեքենաներ', 'Машины'),
    tag('music', 'Music', 'Երաժշտություն', 'Музыка'), tag('gaming', 'Gaming', 'Գեյմինգ', 'Гейминг'),
    tag('cinema', 'Cinema', 'Կինո', 'Кино'), tag('nature', 'Nature', 'Բնություն', 'Природа'),
    tag('space', 'Space', 'Տիեզերք', 'Космос'), tag('sport', 'Sport', 'Սպորտ', 'Спорт'),
    tag('architecture', 'Architecture', 'Ճարտարապետություն', 'Архитектура'),
    tag('typography', 'Typography', 'Տիպոգրաֆիա', 'Типографика'),
    tag('botanical', 'Botanical', 'Բուսական', 'Ботаника'),
    tag('bmw', 'BMW', 'BMW', 'BMW', 'brand'), tag('porsche', 'Porsche', 'Porsche', 'Porsche', 'brand'),
    tag('vinyl', 'Vinyl', 'Վինիլ', 'Винил', 'brand'), tag('yerevan', 'Yerevan', 'Երևան', 'Ереван', 'place'),
    tag('tokyo', 'Tokyo', 'Տոկիո', 'Токио', 'place'), tag('ararat', 'Ararat', 'Արարատ', 'Арарат', 'place'),
    /* styles */
    tag('minimal', 'Minimal', 'Մինիմալ', 'Минимализм', 'style'),
    tag('dark-academia', 'Dark academia', 'Մուգ ակադեմիա', 'Dark academia', 'style'),
    tag('japandi', 'Japandi', 'Ճապանդի', 'Джапанди', 'style'),
    tag('vintage', 'Vintage', 'Վինտաժ', 'Винтаж', 'style'),
    tag('bauhaus', 'Bauhaus', 'Բաուհաուս', 'Баухаус', 'style'),
    tag('brutalist', 'Brutalist', 'Բրուտալիզմ', 'Брутализм', 'style'),
    tag('retro-futurism', 'Retro-futurism', 'Ռետրո-ֆուտուրիզմ', 'Ретрофутуризм', 'style'),
    tag('cyber', 'Cyber', 'Կիբեր', 'Кибер', 'style'),
    /* moods */
    tag('calm', 'Calm', 'Հանգիստ', 'Спокойное', 'mood'), tag('cozy', 'Cozy', 'Հարմարավետ', 'Уютное', 'mood'),
    tag('energetic', 'Energetic', 'Եռանդուն', 'Энергичное', 'mood'), tag('luxury', 'Luxury', 'Շքեղ', 'Роскошное', 'mood'),
    tag('creative', 'Creative', 'Ստեղծագործ', 'Творческое', 'mood'), tag('moody', 'Moody', 'Մռայլ', 'Мрачное', 'mood'),
    /* rooms */
    tag('bedroom', 'Bedroom', 'Ննջասենյակ', 'Спальня', 'room'), tag('living', 'Living room', 'Հյուրասենյակ', 'Гостиная', 'room'),
    tag('gaming-room', 'Gaming room', 'Գեյմինգ սենյակ', 'Игровая', 'room'), tag('office', 'Office', 'Գրասենյակ', 'Офис', 'room'),
    tag('dorm', 'Dorm', 'Հանրակացարան', 'Общежитие', 'room'), tag('cafe', 'Café & bar', 'Սրճարան', 'Кафе и бар', 'room'),
    /* colours */
    tag('c-black', 'Black', 'Սև', 'Чёрный', 'color'), tag('c-white', 'White', 'Սպիտակ', 'Белый', 'color'),
    tag('c-beige', 'Beige', 'Բեժ', 'Бежевый', 'color'), tag('c-green', 'Green', 'Կանաչ', 'Зелёный', 'color'),
    tag('c-blue', 'Blue', 'Կապույտ', 'Синий', 'color'), tag('c-red', 'Red', 'Կարմիր', 'Красный', 'color'),
    tag('c-gold', 'Gold', 'Ոսկեգույն', 'Золотой', 'color'), tag('c-pink', 'Pink', 'Վարդագույն', 'Розовый', 'color')
  ];
  var TAG_COLORS = {
    'c-black': '#191919', 'c-white': '#f3f0e9', 'c-beige': '#ded0b6', 'c-green': '#4d6b4f',
    'c-blue': '#2f4a73', 'c-red': '#b5372a', 'c-gold': '#c19a3d', 'c-pink': '#d99aa6'
  };

  /* ---------- themes: palette + tag DNA for generated products ------------- */

  var THEMES = [
    { id: 'anime',    tags: ['anime', 'cyber', 'energetic', 'bedroom', 'c-pink'],        tier: 1, palette: { bg: '#f4e6ee', a: '#e0538a', b: '#2b2350', c: '#f2b8c6', ink: '#1b1630' } },
    { id: 'cars',     tags: ['cars', 'bmw', 'minimal', 'energetic', 'gaming-room', 'c-red'], tier: 2, palette: { bg: '#ecebe8', a: '#b5372a', b: '#20242b', c: '#8b9199', ink: '#101318' } },
    { id: 'music',    tags: ['music', 'vinyl', 'vintage', 'cozy', 'living', 'c-gold'],   tier: 1, palette: { bg: '#f3e9d8', a: '#c08a2e', b: '#2a2018', c: '#8c6b3f', ink: '#191309' } },
    { id: 'gaming',   tags: ['gaming', 'cyber', 'energetic', 'gaming-room', 'c-black'],  tier: 1, palette: { bg: '#12141b', a: '#5ce1a0', b: '#7a4bd0', c: '#1f2430', ink: '#e7edf5' } },
    { id: 'cinema',   tags: ['cinema', 'dark-academia', 'moody', 'living', 'c-black'],   tier: 2, palette: { bg: '#14120f', a: '#c9b072', b: '#3a332a', c: '#7d6c50', ink: '#eee6d4' } },
    { id: 'nature',   tags: ['nature', 'botanical', 'calm', 'bedroom', 'c-green'],       tier: 1, palette: { bg: '#eae7dc', a: '#5b7355', b: '#2f3a2c', c: '#a8b09a', ink: '#1d231b' } },
    { id: 'space',    tags: ['space', 'retro-futurism', 'creative', 'office', 'c-blue'], tier: 2, palette: { bg: '#131a2b', a: '#e8863f', b: '#3d5a99', c: '#25314f', ink: '#e9eef7' } },
    { id: 'japandi',  tags: ['japandi', 'tokyo', 'minimal', 'calm', 'bedroom', 'c-beige'], tier: 3, palette: { bg: '#efe9df', a: '#c3452c', b: '#20211d', c: '#c7bda9', ink: '#191a16' } },
    { id: 'bauhaus',  tags: ['bauhaus', 'architecture', 'creative', 'office', 'c-red'],  tier: 2, palette: { bg: '#f0ece3', a: '#c8452b', b: '#20487a', c: '#e0b33c', ink: '#15161a' } },
    { id: 'brutal',   tags: ['brutalist', 'architecture', 'moody', 'office', 'c-white'], tier: 3, palette: { bg: '#d9d7d2', a: '#4b4d4f', b: '#8b8d8c', c: '#22242a', ink: '#111214' } },
    { id: 'sport',    tags: ['sport', 'minimal', 'energetic', 'dorm', 'c-blue'],         tier: 1, palette: { bg: '#eef1f4', a: '#1f4fa3', b: '#e8622a', c: '#2b3440', ink: '#111820' } },
    { id: 'yerevan',  tags: ['yerevan', 'ararat', 'vintage', 'calm', 'cafe', 'c-beige'], tier: 3, palette: { bg: '#f0e6d6', a: '#b2643a', b: '#5c7a86', c: '#d7c3a4', ink: '#241d16' } },
    { id: 'type',     tags: ['typography', 'minimal', 'creative', 'office', 'c-black'],  tier: 2, palette: { bg: '#f5f3ee', a: '#191919', b: '#b23a2e', c: '#c9c5bb', ink: '#0f0f0f' } },
    { id: 'lux',      tags: ['luxury', 'dark-academia', 'cinema', 'living', 'c-gold'],   tier: 4, palette: { bg: '#171512', a: '#c8a24d', b: '#2c2822', c: '#8a7550', ink: '#f0e8d8' } }
  ];

  /* ---------- title word banks (3 languages) ------------------------------- */

  var ADJ = [
    { en: 'Quiet',   hy: 'Հանգիստ',   ru: 'Тихий' },
    { en: 'Midnight', hy: 'Կեսգիշեր',  ru: 'Полночный' },
    { en: 'Paper',   hy: 'Թղթե',      ru: 'Бумажный' },
    { en: 'Golden',  hy: 'Ոսկե',      ru: 'Золотой' },
    { en: 'Second',  hy: 'Երկրորդ',   ru: 'Второй' },
    { en: 'Slow',    hy: 'Դանդաղ',    ru: 'Медленный' },
    { en: 'Electric', hy: 'Էլեկտրական', ru: 'Электрический' },
    { en: 'Northern', hy: 'Հյուսիսային', ru: 'Северный' },
    { en: 'Small',   hy: 'Փոքր',      ru: 'Малый' },
    { en: 'Faded',   hy: 'Խամրած',    ru: 'Выцветший' },
    { en: 'Loud',    hy: 'Բարձր',     ru: 'Громкий' },
    { en: 'Late',    hy: 'Ուշ',       ru: 'Поздний' },
    { en: 'Concrete', hy: 'Բետոնե',   ru: 'Бетонный' },
    { en: 'Velvet',  hy: 'Թավշյա',    ru: 'Бархатный' }
  ];
  var NOUN = [
    { en: 'Horizon', hy: 'Հորիզոն',  ru: 'Горизонт' },
    { en: 'Signal',  hy: 'Ազդանշան', ru: 'Сигнал' },
    { en: 'Garden',  hy: 'Այգի',     ru: 'Сад' },
    { en: 'Engine',  hy: 'Շարժիչ',   ru: 'Двигатель' },
    { en: 'Chorus',  hy: 'Երգչախումբ', ru: 'Хор' },
    { en: 'Window',  hy: 'Պատուհան', ru: 'Окно' },
    { en: 'Orbit',   hy: 'Ուղեծիր',  ru: 'Орбита' },
    { en: 'Street',  hy: 'Փողոց',    ru: 'Улица' },
    { en: 'Archive', hy: 'Արխիվ',    ru: 'Архив' },
    { en: 'Mountain', hy: 'Լեռ',     ru: 'Гора' },
    { en: 'Room',    hy: 'Սենյակ',   ru: 'Комната' },
    { en: 'Machine', hy: 'Մեքենա',   ru: 'Машина' },
    { en: 'Letter',  hy: 'Նամակ',    ru: 'Письмо' },
    { en: 'Season',  hy: 'Եղանակ',   ru: 'Сезон' },
    { en: 'Shadow',  hy: 'Ստվեր',    ru: 'Тень' },
    { en: 'Balcony', hy: 'Պատշգամբ', ru: 'Балкон' },
    { en: 'Silence', hy: 'Լռություն', ru: 'Тишина' },
    { en: 'Voltage', hy: 'Լարում',   ru: 'Напряжение' }
  ];

  /* ---------- catalogue generator ------------------------------------------ */

  var CATALOG_SIZE = 260;          /* raise freely — the UI never loads it all */
  var TYPE_MIX = ['poster', 'poster', 'poster', 'poster', 'poster', 'poster', 'flag', 'panel', 'object'];
  var DAY = 86400000;

  function makeProducts(now) {
    var out = [];
    for (var i = 0; i < CATALOG_SIZE; i++) {
      var r = art.rng(art.hash('kadr-product-' + i));
      var theme = THEMES[Math.floor(r() * THEMES.length)];
      var type = PRODUCT_TYPES[TYPE_MIX[Math.floor(r() * TYPE_MIX.length)]];
      var adj = ADJ[Math.floor(r() * ADJ.length)], noun = NOUN[Math.floor(r() * NOUN.length)];
      var comp = art.compositions[Math.floor(r() * art.compositions.length)];
      var num = String(i + 1).padStart(4, '0');
      var base = Math.round((2400 + theme.tier * 900 + r() * 3600) / 50) * 50;
      if (type.id === 'object') base = Math.round((7800 + r() * 12000) / 50) * 50;
      if (type.id === 'panel') base = Math.round((9200 + r() * 9000) / 50) * 50;

      var extraTags = [];
      var pool = TAGS.filter(function (t) { return t.group === 'theme' || t.group === 'style'; });
      for (var k = 0; k < 2; k++) { var t = pool[Math.floor(r() * pool.length)]; if (theme.tags.indexOf(t.id) < 0) extraTags.push(t.id); }

      out.push({
        id: 'p' + i,
        sku: 'KDR-' + type.id.slice(0, 3).toUpperCase() + '-' + theme.id.slice(0, 3).toUpperCase() + '-' + num,
        typeId: type.id,
        categoryId: type.categoryId,
        themeId: theme.id,
        comp: comp,
        word: noun.en.toUpperCase(),
        palette: theme.palette,
        title: { en: adj.en + ' ' + noun.en, hy: adj.hy + ' ' + noun.hy, ru: adj.ru + ' ' + noun.ru },
        description: {
          en: 'Printed to order on archival stock, colour-matched by hand before it leaves the studio. ' +
              'Part of the ' + theme.id + ' line — it sits well in a room that is already half-finished.',
          hy: 'Տպվում է պատվերով արխիվային հիմքի վրա՝ ձեռքով գունային ստուգումով։',
          ru: 'Печатается под заказ на архивной основе, цвет проверяется вручную перед отправкой.'
        },
        tags: theme.tags.concat(extraTags).filter(function (v, ix, a) { return a.indexOf(v) === ix; }),
        basePrice: base,
        createdAt: now - Math.floor(r() * 120) * DAY,
        stats: { views: Math.floor(r() * 900), favs: Math.floor(r() * 120), carts: Math.floor(r() * 60), orders: Math.floor(r() * 30) },
        status: r() < 0.03 ? 'draft' : 'live',
        productionDays: [2, 4],
        deliveryDays: [1, 2],
        images: null,        /* generated lazily */
        files: [
          { name: 'print-' + num + '-CMYK.pdf', kind: 'print', size: (8 + Math.floor(r() * 40)) + ' MB' },
          { name: 'proof-' + num + '.jpg', kind: 'proof', size: (1 + Math.floor(r() * 3)) + ' MB' }
        ]
      });
    }
    return out;
  }

  /* ---------- collections --------------------------------------------------- */

  var COLLECTIONS = [
    { id: 'dark-academia', title: { en: 'Dark Academia', hy: 'Մուգ ակադեմիա', ru: 'Dark Academia' }, tags: ['dark-academia', 'cinema'], featured: true },
    { id: 'japandi',       title: { en: 'Japandi Calm', hy: 'Ճապանդի հանգիստ', ru: 'Джапанди' }, tags: ['japandi', 'calm'], featured: true },
    { id: 'garage',        title: { en: 'The Garage', hy: 'Ավտոտնակ', ru: 'Гараж' }, tags: ['cars', 'bmw'], featured: true },
    { id: 'night-shift',   title: { en: 'Night Shift', hy: 'Գիշերային հերթափոխ', ru: 'Ночная смена' }, tags: ['gaming', 'cyber'], featured: true },
    { id: 'sound-system',  title: { en: 'Sound System', hy: 'Ձայնային համակարգ', ru: 'Sound System' }, tags: ['music', 'vinyl'], featured: true },
    { id: 'green-room',    title: { en: 'Green Room', hy: 'Կանաչ սենյակ', ru: 'Зелёная комната' }, tags: ['botanical', 'nature'], featured: true },
    { id: 'first-wall',    title: { en: 'First Wall — under 6,000 ֏', hy: 'Առաջին պատը', ru: 'Первая стена' }, tags: ['minimal'], maxPrice: 6000, featured: true },
    { id: 'for-business',  title: { en: 'For cafés & offices', hy: 'Սրճարանների համար', ru: 'Для кафе и офисов' }, tags: ['architecture', 'brutalist'], featured: false },
    { id: 'yerevan',       title: { en: 'Made in Yerevan', hy: 'Պատրաստված Երևանում', ru: 'Сделано в Ереване' }, tags: ['yerevan', 'ararat'], featured: true },
    { id: 'type-only',     title: { en: 'Words Only', hy: 'Միայն բառեր', ru: 'Только слова' }, tags: ['typography'], featured: false }
  ];

  /* ---------- room scenes --------------------------------------------------- */

  var SCENES = [
    { id: 's1', room: 'bedroom', style: 'japandi', mood: 'calm', title: { en: 'Quiet bedroom, three prints', hy: 'Հանգիստ ննջասենյակ', ru: 'Тихая спальня' }, tags: ['japandi', 'bedroom', 'calm', 'c-beige'], themes: ['japandi', 'nature'] },
    { id: 's2', room: 'gaming', style: 'cyber', mood: 'energetic', title: { en: 'Setup that earns the desk', hy: 'Գեյմինգ անկյուն', ru: 'Игровой угол' }, tags: ['gaming', 'gaming-room', 'cyber', 'c-black'], themes: ['gaming', 'space'] },
    { id: 's3', room: 'living', style: 'dark-academia', mood: 'moody', title: { en: 'Living room after ten', hy: 'Հյուրասենյակ տասից հետո', ru: 'Гостиная после десяти' }, tags: ['dark-academia', 'living', 'moody', 'c-gold'], themes: ['cinema', 'lux'] },
    { id: 's4', room: 'office', style: 'bauhaus', mood: 'creative', title: { en: 'Studio wall, primary colours', hy: 'Ստուդիայի պատ', ru: 'Стена студии' }, tags: ['bauhaus', 'office', 'creative', 'c-red'], themes: ['bauhaus', 'type'] },
    { id: 's5', room: 'dorm', style: 'minimal', mood: 'cozy', title: { en: 'Dorm wall for 12,000 ֏', hy: 'Հանրակացարանի պատ', ru: 'Стена в общежитии' }, tags: ['dorm', 'minimal', 'cozy'], themes: ['sport', 'music'] },
    { id: 's6', room: 'cafe', style: 'vintage', mood: 'cozy', title: { en: 'Café on Saryan street', hy: 'Սրճարան Սարյան փողոցում', ru: 'Кафе на Сарьяна' }, tags: ['cafe', 'vintage', 'yerevan', 'cozy'], themes: ['yerevan', 'music'] },
    { id: 's7', room: 'bedroom', style: 'anime', mood: 'energetic', title: { en: 'Pink hour', hy: 'Վարդագույն ժամ', ru: 'Розовый час' }, tags: ['anime', 'bedroom', 'c-pink', 'energetic'], themes: ['anime'] },
    { id: 's8', room: 'living', style: 'brutalist', mood: 'calm', title: { en: 'Concrete and one plant', hy: 'Բետոն և մեկ բույս', ru: 'Бетон и одно растение' }, tags: ['brutalist', 'living', 'calm', 'c-white'], themes: ['brutal', 'nature'] },
    { id: 's9', room: 'office', style: 'minimal', mood: 'luxury', title: { en: 'Reception, four panels', hy: 'Ընդունարան', ru: 'Ресепшн' }, tags: ['office', 'luxury', 'minimal', 'architecture'], themes: ['type', 'brutal'] },
    { id: 's10', room: 'gaming', style: 'retro-futurism', mood: 'creative', title: { en: 'Second monitor, first flag', hy: 'Երկրորդ մոնիտոր', ru: 'Второй монитор' }, tags: ['gaming-room', 'retro-futurism', 'space'], themes: ['space', 'gaming'] }
  ];

  /* ---------- default settings (everything the admin can flip) ------------- */

  var DEFAULT_SETTINGS = {
    features: {
      productBuilder: true,
      completeYourRoom: true,
      deliverySlots: true,
      personalization: true,
      guestCheckout: true
    },
    payments: { card: false, applePay: false, googlePay: false, manual: true },
    currencies: { AMD: true, USD: true, EUR: false, RUB: true },
    languages: { en: true, hy: true, ru: true },
    delivery: {
      zones: [
        { id: 'yerevan', name: { en: 'Yerevan', hy: 'Երևան', ru: 'Ереван' }, enabled: true, days: [1, 2] },
        { id: 'armenia', name: { en: 'Armenia — regions', hy: 'Հայաստան՝ մարզեր', ru: 'Армения — регионы' }, enabled: true, days: [2, 4] },
        { id: 'ru', name: { en: 'Russia', hy: 'Ռուսաստան', ru: 'Россия' }, enabled: false, days: [7, 12] },
        { id: 'cis', name: { en: 'CIS', hy: 'ԱՊՀ', ru: 'СНГ' }, enabled: false, days: [10, 18] }
      ],
      slots: ['10:00–13:00', '13:00–16:00', '16:00–19:00', '19:00–22:00'],
      productionDays: [2, 4]
    },
    contact: { instagram: '@kadr.studio', whatsapp: '+374 00 000000', email: 'hello@kadr.studio' },
    homepage: [
      { id: 'hero',        on: true,  label: { en: 'Hero', hy: 'Հերո', ru: 'Первый экран' } },
      { id: 'brand',       on: true,  label: { en: 'Brand intro', hy: 'Բրենդի ներկայացում', ru: 'О бренде' } },
      { id: 'inspiration', on: true,  label: { en: 'Room scenes', hy: 'Սենյակների տեսարաններ', ru: 'Сцены комнат' } },
      { id: 'personalize', on: true,  label: { en: 'Build your room CTA', hy: 'Կառուցիր սենյակդ', ru: 'Собери комнату' } },
      { id: 'new',         on: true,  label: { en: 'New arrivals', hy: 'Նոր ժամանածներ', ru: 'Новинки' } },
      { id: 'collections', on: true,  label: { en: 'Collections', hy: 'Հավաքածուներ', ru: 'Коллекции' } },
      { id: 'trending',    on: true,  label: { en: 'Trending', hy: 'Թրենդային', ru: 'Популярное' } },
      { id: 'business',    on: false, label: { en: 'For business', hy: 'Բիզնեսի համար', ru: 'Для бизнеса' } }
    ],
    seo: {
      title: 'KADR — posters & room decor, made to order in Armenia',
      description: 'Made-to-order posters, framed prints, flags and objects. Explore rooms, customise your print, free delivery across Armenia.'
    }
  };

  /* ---------- pricing ------------------------------------------------------- */

  function attrFor(compId) { return ATTRIBUTES[compId]; }
  function valueOf(compId, valId) {
    var a = ATTRIBUTES[compId]; if (!a) return null;
    for (var i = 0; i < a.values.length; i++) if (a.values[i].id === valId) return a.values[i];
    return null;
  }

  /* price = (base × size factor) + option adds (scaled by size) */
  function price(product, options) {
    var type = PRODUCT_TYPES[product.typeId];
    var opts = options || type.defaults;
    var factor = 1, add = 0;
    type.components.forEach(function (c) {
      var v = valueOf(c, opts[c]);
      if (!v) return;
      if (v.factor) factor = v.factor;
    });
    type.components.forEach(function (c) {
      var v = valueOf(c, opts[c]);
      if (v && v.add) add += v.add * (0.6 + factor * 0.4);
    });
    return Math.round((product.basePrice * factor + add) / 50) * 50;
  }

  function priceRange(product) {
    var type = PRODUCT_TYPES[product.typeId];
    var min = price(product, type.defaults);
    var max = min;
    /* cheapest / dearest legal combination, honouring rules */
    var combos = [type.defaults];
    type.components.forEach(function (c) {
      var a = ATTRIBUTES[c]; if (!a) return;
      var next = [];
      combos.forEach(function (base) {
        a.values.forEach(function (v) {
          var o = Object.assign({}, base); o[c] = v.id;
          if (isAllowed(product, o)) next.push(o);
        });
      });
      combos = next.length ? next.slice(0, 40) : combos;
    });
    combos.forEach(function (o) { var p = price(product, o); if (p < min) min = p; if (p > max) max = p; });
    return { min: min, max: max };
  }

  /* Rule engine: returns the set of disabled values given a partial selection */
  function disabledMap(product, options) {
    var type = PRODUCT_TYPES[product.typeId];
    var out = {}, reasons = {};
    (type.rules || []).forEach(function (rule) {
      var hit = Object.keys(rule.when).every(function (k) {
        var want = rule.when[k];
        return Array.isArray(want) ? want.indexOf(options[k]) >= 0 : options[k] === want;
      });
      if (!hit) return;
      Object.keys(rule.disable).forEach(function (k) {
        out[k] = (out[k] || []).concat(rule.disable[k]);
        rule.disable[k].forEach(function (v) { reasons[k + ':' + v] = rule.why; });
      });
    });
    return { disabled: out, reasons: reasons };
  }
  function isAllowed(product, options) {
    var d = disabledMap(product, options).disabled;
    return Object.keys(d).every(function (k) { return d[k].indexOf(options[k]) < 0; });
  }
  /* Repair a selection after a change so the user is never stuck on a dead combo */
  function reconcile(product, options, changedKey) {
    var type = PRODUCT_TYPES[product.typeId];
    var o = Object.assign({}, options);
    for (var pass = 0; pass < 4; pass++) {
      var d = disabledMap(product, o).disabled;
      var fixed = true;
      type.components.forEach(function (c) {
        if (c === changedKey) return;
        if (d[c] && d[c].indexOf(o[c]) >= 0) {
          var a = ATTRIBUTES[c];
          for (var i = 0; i < a.values.length; i++) {
            if (d[c].indexOf(a.values[i].id) < 0) { o[c] = a.values[i].id; fixed = false; break; }
          }
        }
      });
      if (fixed) break;
    }
    return o;
  }

  function optionRatio(product, options) {
    var type = PRODUCT_TYPES[product.typeId];
    for (var i = 0; i < type.components.length; i++) {
      var v = valueOf(type.components[i], options[type.components[i]]);
      if (v && v.ratio) return v.ratio;
    }
    return product.typeId === 'object' ? 1 : 0.72;
  }

  function imageFor(product, options, w) {
    var o = options || PRODUCT_TYPES[product.typeId].defaults;
    var ratio = optionRatio(product, o);
    var width = w || 600;
    return art.url({
      seed: product.id + (o.frame || '') + (o.material || ''),
      palette: product.palette,
      comp: product.comp,
      word: product.word,
      frame: product.typeId === 'poster' ? (o.frame || 'none') : 'none',
      w: width, h: Math.round(width / ratio)
    });
  }

  K.data = {
    CURRENCIES: CURRENCIES, CATEGORIES: CATEGORIES, ATTRIBUTES: ATTRIBUTES,
    PRODUCT_TYPES: PRODUCT_TYPES, TAGS: TAGS, TAG_COLORS: TAG_COLORS, THEMES: THEMES,
    COLLECTIONS: COLLECTIONS, SCENES: SCENES, DEFAULT_SETTINGS: DEFAULT_SETTINGS,
    CATALOG_SIZE: CATALOG_SIZE,
    makeProducts: makeProducts,
    price: price, priceRange: priceRange, disabledMap: disabledMap, isAllowed: isAllowed,
    reconcile: reconcile, valueOf: valueOf, attrFor: attrFor, imageFor: imageFor, optionRatio: optionRatio,
    tagById: function (id) { for (var i = 0; i < TAGS.length; i++) if (TAGS[i].id === id) return TAGS[i]; return null; },
    catById: function (id) { for (var i = 0; i < CATEGORIES.length; i++) if (CATEGORIES[i].id === id) return CATEGORIES[i]; return null; }
  };
})(window.KADR = window.KADR || {});
