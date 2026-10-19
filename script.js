/* KADR — a made-to-order poster and room-decor storefront.

   One file, plain JavaScript, no framework and no build step. Everything hangs
   off a single global (window.KADR); each block below is an IIFE that adds one
   piece to it, and the order they run in matters — i18n and art before data,
   data before store, store before the views, app.js last.

   Jump to a section by searching for its banner, e.g. "SEARCH —".
*/

/* ============================================================================
   LOCALISATION — every user-facing string, EN / HY / RU
   ============================================================================ */

/* KADR — localisation layer.
   All user-facing strings live here, never in markup, so translations can be
   managed (or exported to a TMS) without touching component code. */
(function (K) {
  'use strict';

  var LANGS = [
    { code: 'en', label: 'English', short: 'EN', dir: 'ltr' },
    { code: 'hy', label: 'Հայերեն', short: 'ՀԱՅ', dir: 'ltr' },
    { code: 'ru', label: 'Русский', short: 'RU', dir: 'ltr' }
  ];

  var S = {
    'brand.tag':            ['Studio for rooms', 'Ստուդիա սենյակների համար', 'Студия для комнат'],
    'nav.shop':             ['Shop', 'Խանութ', 'Магазин'],
    'nav.explore':          ['Explore', 'Բացահայտել', 'Исследовать'],
    'nav.collections':      ['Collections', 'Հավաքածուներ', 'Коллекции'],
    'nav.new':              ['New', 'Նոր', 'Новинки'],
    'nav.rooms':            ['Rooms', 'Սենյակներ', 'Комнаты'],
    'nav.builder':          ['Build a room', 'Կառուցել սենյակ', 'Собрать комнату'],
    'nav.search':           ['Search', 'Որոնում', 'Поиск'],
    'nav.favorites':        ['Favorites', 'Ընտրյալներ', 'Избранное'],
    'nav.cart':             ['Cart', 'Զամբյուղ', 'Корзина'],
    'nav.account':          ['Account', 'Հաշիվ', 'Аккаунт'],
    'nav.admin':            ['Admin', 'Ադմին', 'Админ'],
    'nav.about':            ['About', 'Մեր մասին', 'О нас'],
    'nav.contact':          ['Contact', 'Կապ', 'Контакты'],
    'nav.menu':             ['Menu', 'Մենյու', 'Меню'],
    'nav.close':            ['Close', 'Փակել', 'Закрыть'],
    'nav.theme':            ['Theme', 'Թեմա', 'Тема'],

    'home.hero.eyebrow':    ['Made to order in Yerevan', 'Պատրաստվում է Երևանում', 'Изготавливаем в Ереване'],
    'home.hero.title':      ['Your walls are unfinished sentences.',
                             'Քո պատերը անավարտ նախադասություններ են։',
                             'Твои стены — незаконченные фразы.'],
    'home.hero.sub':        ['Posters, frames, flags and objects for the room you actually live in — from a first dorm wall to a hotel lobby.',
                             'Պաստառներ, շրջանակներ, դրոշներ և առարկաներ այն սենյակի համար, որտեղ դու իրականում ապրում ես։',
                             'Постеры, рамы, флаги и предметы для комнаты, в которой ты действительно живёшь.'],
    'home.hero.cta1':       ['Start exploring', 'Սկսել բացահայտումը', 'Начать исследовать'],
    'home.hero.cta2':       ['Build your room', 'Կառուցել քո սենյակը', 'Собрать свою комнату'],
    'home.brand.title':     ['Not a shop. A room studio.', 'Ոչ թե խանութ։ Սենյակի ստուդիա։', 'Не магазин. Студия комнаты.'],
    'home.brand.body':      ['We print to order, so nothing sits in a warehouse and nothing limits the catalogue. One customer buys a 2,900 ֏ print for a dorm; the next orders forty framed pieces for a restaurant. Same studio, same care.',
                             'Մենք տպում ենք պատվերով՝ ոչինչ չի մնում պահեստում։ Մեկը գնում է 2,900 ֏ պաստառ, մյուսը՝ քառասուն շրջանակված գործ ռեստորանի համար։',
                             'Мы печатаем под заказ — ничего не лежит на складе. Один покупает постер за 2 900 ֏, другой — сорок работ в рамах для ресторана.'],
    'home.brand.p1':        ['Made to order', 'Պատվերով', 'Под заказ'],
    'home.brand.p1d':       ['Nothing is printed until you buy it.', 'Ոչինչ չի տպվում մինչև գնումը։', 'Ничего не печатается до покупки.'],
    'home.brand.p2':        ['Every budget', 'Ցանկացած բյուջե', 'Любой бюджет'],
    'home.brand.p2d':       ['Paper prints to museum canvas in oak.', 'Թղթից մինչև կտավ կաղնու շրջանակում։', 'От бумаги до холста в дубовой раме.'],
    'home.brand.p3':        ['Delivery across Armenia', 'Առաքում ամբողջ Հայաստանում', 'Доставка по всей Армении'],
    'home.brand.p3d':       ['Courier to your door. The delivery price is shown before you confirm.', 'Առաքիչը մինչև դուռ։ Առաքման գինը երևում է մինչև հաստատումը։', 'Курьер до двери. Цена доставки видна до подтверждения.'],
    'home.inspiration':     ['Rooms we made', 'Սենյակներ, որ մենք ստեղծել ենք', 'Комнаты, которые мы собрали'],
    'home.inspiration.sub': ['Every scene is shoppable — tap to see what is on the wall.', 'Յուրաքանչյուր տեսարան գնելի է։', 'Каждая сцена доступна к покупке.'],
    'home.new':             ['New this week', 'Այս շաբաթվա նորույթները', 'Новое на этой неделе'],
    'home.trending':        ['Moving fast', 'Ամենապահանջվածը', 'Разбирают быстро'],
    'home.collections':     ['Collections', 'Հավաքածուներ', 'Коллекции'],
    'home.personalize.t':   ['Let’s build your room', 'Եկեք կառուցենք քո սենյակը', 'Давай соберём твою комнату'],
    'home.personalize.b':   ['Six short questions. Your feed rearranges itself around your room, your colours and the things you actually like.',
                             'Վեց կարճ հարց, և հոսքը վերադասավորվում է քո ճաշակի շուրջ։',
                             'Шесть коротких вопросов — и лента перестроится под тебя.'],
    'home.personalize.cta': ['Answer six questions', 'Պատասխանել վեց հարցի', 'Ответить на шесть вопросов'],
    'home.personalize.re':  ['Update my preferences', 'Թարմացնել նախապատվությունները', 'Обновить предпочтения'],

    'shop.title':           ['Everything', 'Ամեն ինչ', 'Всё'],
    'shop.results':         ['{n} products', '{n} ապրանք', '{n} товаров'],
    'shop.filters':         ['Filters', 'Ֆիլտրեր', 'Фильтры'],
    'shop.sort':            ['Sort', 'Դասավորել', 'Сортировка'],
    'sort.recommended':     ['Recommended', 'Առաջարկվող', 'Рекомендуемые'],
    'sort.new':             ['Newest', 'Նորագույն', 'Новинки'],
    'sort.popular':         ['Popular', 'Հանրաճանաչ', 'Популярные'],
    'sort.priceAsc':        ['Price: low to high', 'Գին՝ աճման', 'Цена: по возрастанию'],
    'sort.priceDesc':       ['Price: high to low', 'Գին՝ նվազման', 'Цена: по убыванию'],
    'filter.category':      ['Category', 'Կատեգորիա', 'Категория'],
    'filter.price':         ['Price', 'Գին', 'Цена'],
    'filter.size':          ['Size', 'Չափս', 'Размер'],
    'filter.material':      ['Material', 'Նյութ', 'Материал'],
    'filter.frame':         ['Frame', 'Շրջանակ', 'Рама'],
    'filter.color':         ['Colour', 'Գույն', 'Цвет'],
    'filter.style':         ['Style', 'Ոճ', 'Стиль'],
    'filter.room':          ['Room', 'Սենյակ', 'Комната'],
    'filter.mood':          ['Mood', 'Տրամադրություն', 'Настроение'],
    'filter.collection':    ['Collection', 'Հավաքածու', 'Коллекция'],
    'filter.tag':           ['Tags', 'Թեգեր', 'Теги'],
    'filter.clear':         ['Clear all', 'Մաքրել', 'Сбросить'],
    'filter.apply':         ['Show results', 'Ցույց տալ', 'Показать'],

    'search.placeholder':   ['Search posters, tags, SKU…', 'Որոնել պաստառներ, թեգեր, SKU…', 'Искать постеры, теги, SKU…'],
    'search.did':           ['Did you mean', 'Միգուցե նկատի ունեիք', 'Возможно, вы имели в виду'],
    'search.none':          ['No products found.', 'Ապրանք չի գտնվել։', 'Ничего не найдено.'],
    'search.noneHint':      ['Try a shorter word, or browse by tag.', 'Փորձեք ավելի կարճ բառ կամ թեգ։', 'Попробуйте короче или ищите по тегу.'],
    'search.recent':        ['Recent searches', 'Վերջին որոնումները', 'Недавние запросы'],
    'search.popular':       ['Popular right now', 'Հանրաճանաչ հիմա', 'Популярно сейчас'],

    'p.sku':                ['SKU', 'SKU', 'Артикул'],
    'p.addToCart':          ['Add to cart', 'Ավելացնել զամբյուղ', 'В корзину'],
    'p.added':              ['Added to cart', 'Ավելացվեց զամբյուղում', 'Добавлено в корзину'],
    'p.fav':                ['Save', 'Պահել', 'Сохранить'],
    'p.faved':              ['Saved', 'Պահված է', 'Сохранено'],
    'p.from':               ['from', 'սկսած', 'от'],
    'p.madeToOrder':        ['Made to order', 'Պատրաստվում է պատվերով', 'Изготавливается под заказ'],
    'p.production':         ['Production', 'Արտադրություն', 'Производство'],
    'p.delivery':           ['Delivery', 'Առաքում', 'Доставка'],
    'p.inHands':            ['In your hands', 'Ձեր ձեռքում', 'У вас на руках'],
    'p.days':               ['business days', 'աշխատանքային օր', 'рабочих дня'],
    'p.free':               ['Delivery priced at checkout', 'Առաքման գինը՝ պատվերի ժամանակ', 'Доставка рассчитывается при оформлении'],
    'p.details':            ['Details', 'Մանրամասներ', 'Детали'],
    'p.spec':               ['Specification', 'Բնութագրեր', 'Характеристики'],
    'p.customise':          ['Customise this', 'Անհատականացնել', 'Настроить'],
    'p.builderOff':         ['Choose a ready option', 'Ընտրեք պատրաստի տարբերակ', 'Выберите готовый вариант'],
    'p.similar':            ['Similar pieces', 'Նմանատիպ գործեր', 'Похожие работы'],
    'p.moreStyle':          ['More from this style', 'Այս ոճից ավելին', 'Ещё в этом стиле'],
    'p.moreTag':            ['More tagged {tag}', 'Ավելին «{tag}» թեգով', 'Ещё с тегом «{tag}»'],
    'p.alsoLike':           ['You may also like', 'Ձեզ նույնպես կհավանի', 'Вам может понравиться'],
    'p.worksWith':          ['Works well with this', 'Լավ է համադրվում', 'Хорошо сочетается'],
    'p.unavailable':        ['Not available with your selection', 'Հասանելի չէ այս ընտրության դեպքում', 'Недоступно с этим выбором'],

    'scene.shop':           ['Shop this room', 'Գնել այս սենյակը', 'Купить эту комнату'],
    'scene.selected':       ['{n} selected', 'Ընտրված է {n}', 'Выбрано: {n}'],
    'scene.review':         ['Review selection', 'Ստուգել ընտրությունը', 'Проверить выбор'],
    'scene.addAll':         ['Add {n} items — {total}', 'Ավելացնել {n} ապրանք — {total}', 'Добавить {n} шт. — {total}'],
    'scene.in':             ['In this room', 'Այս սենյակում', 'В этой комнате'],

    'cart.title':           ['Cart', 'Զամբյուղ', 'Корзина'],
    'cart.empty':           ['Your cart is empty.', 'Զամբյուղը դատարկ է։', 'Корзина пуста.'],
    'cart.emptyCta':        ['Find something for the wall', 'Գտնել ինչ-որ բան պատի համար', 'Найти что-нибудь на стену'],
    'cart.subtotal':        ['Subtotal', 'Ենթագումար', 'Подытог'],
    'cart.delivery':        ['Delivery', 'Առաքում', 'Доставка'],
    'cart.total':           ['Total', 'Ընդամենը', 'Итого'],
    'cart.checkout':        ['Checkout', 'Ձևակերպել պատվերը', 'Оформить заказ'],
    'cart.remove':          ['Remove', 'Հեռացնել', 'Удалить'],
    'cart.qty':             ['Qty', 'Քանակ', 'Кол-во'],
    'cart.each':            ['each', 'հատը', 'за штуку'],
    'cart.continue':        ['Continue shopping', 'Շարունակել գնումները', 'Продолжить покупки'],

    'co.step.address':      ['Address', 'Հասցե', 'Адрес'],
    'co.step.delivery':     ['Delivery', 'Առաքում', 'Доставка'],
    'co.step.payment':      ['Payment', 'Վճարում', 'Оплата'],
    'co.step.review':       ['Review', 'Ստուգում', 'Проверка'],
    'co.contact':           ['Contact', 'Կոնտակտ', 'Контакт'],
    'co.name':              ['Full name', 'Անուն Ազգանուն', 'Имя и фамилия'],
    'co.email':             ['Email', 'Էլ. փոստ', 'Эл. почта'],
    'co.phone':             ['Phone', 'Հեռախոս', 'Телефон'],
    'co.useLocation':       ['Use my current location', 'Օգտագործել իմ տեղը', 'Определить моё место'],
    'co.searchAddress':     ['Search address', 'Որոնել հասցե', 'Найти адрес'],
    'co.pinHint':           ['Drag the pin to your entrance.', 'Տեղափոխեք կետը դեպի մուտք։', 'Перетащите точку ко входу.'],
    'co.building':          ['Building', 'Շենք', 'Дом'],
    'co.entrance':          ['Entrance', 'Մուտք', 'Подъезд'],
    'co.floor':             ['Floor', 'Հարկ', 'Этаж'],
    'co.apartment':         ['Apartment', 'Բնակարան', 'Квартира'],
    'co.intercom':          ['Intercom code', 'Դոմոֆոնի կոդ', 'Код домофона'],
    'co.elevator':          ['Elevator in building', 'Վերելակ կա', 'Есть лифт'],
    'co.courier':           ['Courier instructions', 'Ցուցումներ առաքիչին', 'Комментарий курьеру'],
    'co.saveAddress':       ['Save this address as', 'Պահել այս հասցեն որպես', 'Сохранить адрес как'],
    'co.saved':             ['Saved addresses', 'Պահված հասցեներ', 'Сохранённые адреса'],
    'co.slot':              ['Delivery window', 'Առաքման պատուհան', 'Окно доставки'],
    'co.slotAny':           ['Any time — we call before arriving', 'Ցանկացած ժամ', 'Любое время'],
    'co.payCard':           ['Card', 'Քարտ', 'Карта'],
    'co.payApple':          ['Apple Pay', 'Apple Pay', 'Apple Pay'],
    'co.payGoogle':         ['Google Pay', 'Google Pay', 'Google Pay'],
    'co.payManual':         ['Bank transfer', 'Բանկային փոխանցում', 'Банковский перевод'],
    'co.payOff':            ['Payment by bank transfer.', 'Վճարում բանկային փոխանցումով։', 'Оплата банковским переводом.'],
    'co.payOffBody':        ['Right after you place the order you get the bank details, the amount and your order code. Transfer the amount with the code in the purpose and send us a screenshot.',
                             'Պատվերից անմիջապես հետո կստանաք վճարման տվյալները, գումարը և պատվերի կոդը։ Փոխանցեք գումարը՝ նշելով կոդը, և ուղարկեք մեզ սքրինշոթը։',
                             'Сразу после заказа вы увидите реквизиты, сумму и код заказа. Переведите сумму с кодом в назначении платежа и пришлите нам скриншот.'],
    'co.placeOrder':        ['Place order', 'Հաստատել պատվերը', 'Подтвердить заказ'],
    'co.sendOrder':         ['Send order request', 'Ուղարկել պատվերի հարցում', 'Отправить заявку'],
    'co.confirmed':         ['Order received', 'Պատվերն ընդունված է', 'Заказ принят'],
    'co.orderNo':           ['Order number', 'Պատվերի համար', 'Номер заказа'],
    'co.thanks':            ['Thank you. Production starts as soon as the payment arrives — every status change comes to your email.', 'Շնորհակալություն։ Արտադրությունը սկսվում է վճարումը ստանալուն պես, կարգավիճակի յուրաքանչյուր փոփոխություն կգա ձեր էլ. փոստին։', 'Спасибо. Производство начнётся, как только придёт оплата, — о каждом изменении статуса мы напишем на почту.'],
    'co.track':             ['Track this order', 'Հետևել պատվերին', 'Отследить заказ'],
    'co.guest':             ['Continue as guest', 'Շարունակել որպես հյուր', 'Продолжить как гость'],
    'co.createAccount':     ['Create an account to track this order', 'Ստեղծեք հաշիվ պատվերին հետևելու համար', 'Создайте аккаунт, чтобы отслеживать заказ'],

    'acc.title':            ['Account', 'Հաշիվ', 'Аккаунт'],
    'acc.orders':           ['Orders', 'Պատվերներ', 'Заказы'],
    'acc.favorites':        ['Favorites', 'Ընտրյալներ', 'Избранное'],
    'acc.recent':           ['Recently viewed', 'Վերջերս դիտված', 'Недавно просмотренные'],
    'acc.addresses':        ['Saved addresses', 'Պահված հասցեներ', 'Адреса'],
    'acc.prefs':            ['Room preferences', 'Սենյակի նախապատվություններ', 'Предпочтения'],
    'acc.settings':         ['Settings', 'Կարգավորումներ', 'Настройки'],
    'acc.signIn':           ['Sign in', 'Մուտք', 'Войти'],
    'acc.signOut':          ['Sign out', 'Ելք', 'Выйти'],
    'acc.register':         ['Create account', 'Ստեղծել հաշիվ', 'Создать аккаунт'],
    'acc.password':         ['Password', 'Գաղտնաբառ', 'Пароль'],
    'acc.noOrders':         ['No orders yet.', 'Դեռ պատվերներ չկան։', 'Заказов пока нет.'],
    'acc.noAddr':           ['No saved addresses yet.', 'Պահված հասցեներ չկան։', 'Сохранённых адресов пока нет.'],
    'acc.noRecent':         ['Nothing viewed yet.', 'Դեռ ոչինչ չեք դիտել։', 'Вы пока ничего не смотрели.'],
    'acc.noFavs':           ['Your favorites are empty.', 'Ընտրյալները դատարկ են։', 'Избранное пусто.'],
    'acc.emptyCta':         ['Go to Explore', 'Անցնել բացահայտմանը', 'Перейти в ленту'],

    'pref.title':           ['Six questions', 'Վեց հարց', 'Шесть вопросов'],
    'pref.room':            ['Which room are we decorating?', 'Ո՞ր սենյակն ենք ձևավորում', 'Какую комнату оформляем?'],
    'pref.style':           ['Pick the styles you lean towards', 'Ընտրեք ձեր ոճերը', 'Выберите близкие стили'],
    'pref.colors':          ['Colours you want on the wall', 'Գույներ պատի համար', 'Цвета для стены'],
    'pref.interests':       ['What are you into?', 'Ինչո՞վ եք հետաքրքրված', 'Чем увлекаетесь?'],
    'pref.mood':            ['The room should feel…', 'Սենյակը պետք է լինի…', 'Комната должна ощущаться…'],
    'pref.budget':          ['Comfortable price for one piece', 'Հարմար գին մեկ գործի համար', 'Комфортная цена за работу'],
    'pref.save':            ['Save and see my feed', 'Պահել և տեսնել հոսքը', 'Сохранить и открыть ленту'],
    'pref.skip':            ['Skip for now', 'Բաց թողնել', 'Пропустить'],
    'pref.reset':           ['Reset preferences', 'Զրոյացնել', 'Сбросить предпочтения'],
    'pref.resetNote':       ['Resetting clears your answers. The feed keeps learning from what you view and save.',
                             'Զրոյացումը մաքրում է պատասխանները։ Հոսքը շարունակում է սովորել վարքից։',
                             'Сброс очищает ответы. Лента продолжит учиться на ваших действиях.'],

    'room.title':           ['Complete your room', 'Ամբողջացրու սենյակդ', 'Собери свою комнату'],
    'room.sub':             ['Drop pieces on the wall, move them, resize them. Nothing is bought until you say so.',
                             'Դրեք գործերը պատին, տեղափոխեք, չափափոխեք։',
                             'Разместите работы на стене, двигайте и меняйте размер.'],
    'room.pick':            ['Choose a wall', 'Ընտրեք պատը', 'Выберите стену'],
    'room.library':         ['Your library', 'Ձեր գրադարանը', 'Ваша библиотека'],
    'room.clear':           ['Clear wall', 'Մաքրել պատը', 'Очистить стену'],
    'room.addAll':          ['Add everything on this wall', 'Ավելացնել ամեն ինչ', 'Добавить всё со стены'],
    'room.hint':            ['Drag to move · corner to resize · double-click to remove', 'Քաշեք՝ տեղափոխելու համար', 'Тяните, чтобы двигать'],
    'room.emptyWall':       ['The wall is empty. Pick something from the library.', 'Պատը դատարկ է։', 'Стена пуста.'],

    'ui.currency':          ['Currency', 'Արժույթ', 'Валюта'],
    'ui.language':          ['Language', 'Լեզու', 'Язык'],
    'ui.loading':           ['Loading…', 'Բեռնվում է…', 'Загрузка…'],
    'ui.more':              ['Load more', 'Բեռնել ավելին', 'Показать ещё'],
    'ui.seeAll':            ['See all', 'Տեսնել բոլորը', 'Смотреть все'],
    'ui.back':              ['Back', 'Հետ', 'Назад'],
    'ui.next':              ['Next', 'Հաջորդ', 'Далее'],
    'ui.done':              ['Done', 'Պատրաստ է', 'Готово'],
    'ui.cancel':            ['Cancel', 'Չեղարկել', 'Отмена'],
    'ui.confirm':           ['Confirm', 'Հաստատել', 'Подтвердить'],
    'ui.save':              ['Save', 'Պահել', 'Сохранить'],
    'ui.edit':              ['Edit', 'Խմբագրել', 'Изменить'],
    'ui.delete':            ['Delete', 'Ջնջել', 'Удалить'],
    'ui.select':            ['Select', 'Ընտրել', 'Выбрать'],
    'ui.selected':          ['Selected', 'Ընտրված է', 'Выбрано'],
    'ui.items':             ['products', 'ապրանք', 'товаров'],
    'ui.copy':              ['Copy', 'Պատճենել', 'Копировать'],
    'ui.copied':            ['Copied', 'Պատճենված է', 'Скопировано'],
    'ui.of':                ['of', '/', 'из'],

    'foot.help':            ['Help', 'Օգնություն', 'Помощь'],
    'foot.legal':           ['Legal', 'Իրավական', 'Правовое'],
    'foot.privacy':         ['Privacy policy', 'Գաղտնիության քաղաքականություն', 'Политика конфиденциальности'],
    'foot.terms':           ['Terms & conditions', 'Պայմաններ', 'Условия'],
    'foot.deliveryPolicy':  ['Delivery policy', 'Առաքման քաղաքականություն', 'Условия доставки'],
    'foot.returns':         ['Returns & refunds', 'Վերադարձ', 'Возврат'],
    'foot.payment':         ['Payment information', 'Վճարման տեղեկություն', 'Информация об оплате'],
    'foot.rights':          ['Made to order in Armenia.', 'Պատրաստվում է Հայաստանում։', 'Изготовлено в Армении.'],

    'err.404':              ['This page does not exist.', 'Այս էջը գոյություն չունի։', 'Такой страницы нет.'],
    'err.404cta':           ['Back to the studio', 'Վերադառնալ ստուդիա', 'Вернуться в студию']
  };

  var idx = { en: 0, hy: 1, ru: 2 };
  var current = 'en';

  function t(key, vars) {
    var row = S[key];
    var out = row ? (row[idx[current]] || row[0]) : key;
    if (vars) {
      Object.keys(vars).forEach(function (k) {
        out = out.replace(new RegExp('\\{' + k + '\\}', 'g'), vars[k]);
      });
    }
    return out;
  }

  /* Content objects carry {en,hy,ru}; fall back to English then to the key. */
  function tc(obj) {
    if (obj == null) return '';
    if (typeof obj === 'string') return obj;
    return obj[current] || obj.en || '';
  }

  K.i18n = {
    langs: LANGS,
    get lang() { return current; },
    set: function (code) { if (idx[code] != null) current = code; },
    t: t,
    tc: tc,
    has: function (k) { return !!S[k]; }
  };
})(window.KADR = window.KADR || {});

/* ============================================================================
   ARTWORK — procedural SVG posters, frames and room scenes
   ============================================================================ */

/* KADR — procedural artwork.
   A stand-in for the real photo/print library: every product image, room scene
   and frame preview is generated as SVG from a seed, so the prototype can show
   thousands of distinct products with no asset pipeline. In production these
   become CDN images; the calling code only ever asks for a URL. */
(function (K) {
  'use strict';

  function rng(seed) {
    var s = seed >>> 0 || 1;
    return function () {
      s ^= s << 13; s >>>= 0;
      s ^= s >> 17;
      s ^= s << 5; s >>>= 0;
      return s / 4294967296;
    };
  }
  function hash(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function pick(r, arr) { return arr[Math.floor(r() * arr.length) % arr.length]; }
  function rint(r, a, b) { return Math.floor(a + r() * (b - a + 1)); }

  var GRAIN =
    '<filter id="g"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/>' +
    '<feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope="0.10"/></feComponentTransfer></filter>';

  /* ---- individual poster compositions ------------------------------------ */

  var COMPOSITIONS = {
    arch: function (r, p, w, h) {
      var cx = w / 2, top = h * (0.16 + r() * 0.1), rad = w * 0.34;
      var sun = h * (0.42 + r() * 0.12);
      return '<rect width="' + w + '" height="' + h + '" fill="' + p.bg + '"/>' +
        '<path d="M' + (cx - rad) + ' ' + h * 0.86 + ' L' + (cx - rad) + ' ' + (top + rad) +
        ' A' + rad + ' ' + rad + ' 0 0 1 ' + (cx + rad) + ' ' + (top + rad) +
        ' L' + (cx + rad) + ' ' + h * 0.86 + ' Z" fill="' + p.a + '"/>' +
        '<circle cx="' + cx + '" cy="' + sun + '" r="' + w * 0.17 + '" fill="' + p.b + '"/>' +
        '<rect x="' + (cx - rad) + '" y="' + h * 0.7 + '" width="' + rad * 2 + '" height="' + h * 0.16 + '" fill="' + p.c + '" opacity=".9"/>' +
        '<rect x="0" y="' + h * 0.86 + '" width="' + w + '" height="' + h * 0.14 + '" fill="' + p.ink + '"/>';
    },
    strata: function (r, p, w, h) {
      var out = '<rect width="' + w + '" height="' + h + '" fill="' + p.bg + '"/>';
      var y = h * 0.28, cols = [p.a, p.b, p.c, p.ink];
      for (var i = 0; i < 6; i++) {
        var band = h * (0.06 + r() * 0.09);
        var amp = h * 0.03 * r();
        out += '<path d="M0 ' + y + ' Q ' + w * 0.3 + ' ' + (y - amp) + ' ' + w * 0.55 + ' ' + y +
          ' T ' + w + ' ' + (y + amp * 0.4) + ' L' + w + ' ' + h + ' L0 ' + h + ' Z" fill="' + cols[i % cols.length] +
          '" opacity="' + (0.55 + i * 0.08).toFixed(2) + '"/>';
        y += band;
      }
      out += '<circle cx="' + w * (0.2 + r() * 0.6) + '" cy="' + h * 0.18 + '" r="' + w * 0.09 + '" fill="' + p.b + '"/>';
      return out;
    },
    grid: function (r, p, w, h) {
      var out = '<rect width="' + w + '" height="' + h + '" fill="' + p.bg + '"/>';
      var cols = 3 + Math.floor(r() * 2), rows = 4 + Math.floor(r() * 2);
      var cw = w / cols, ch = h / rows, palette = [p.a, p.b, p.c, p.bg, p.ink];
      for (var y = 0; y < rows; y++) for (var x = 0; x < cols; x++) {
        var f = pick(r, palette), k = r();
        if (k < 0.34) out += '<rect x="' + x * cw + '" y="' + y * ch + '" width="' + cw + '" height="' + ch + '" fill="' + f + '"/>';
        else if (k < 0.62) out += '<circle cx="' + (x * cw + cw / 2) + '" cy="' + (y * ch + ch / 2) + '" r="' + Math.min(cw, ch) * 0.44 + '" fill="' + f + '"/>';
        else if (k < 0.82) out += '<path d="M' + x * cw + ' ' + (y * ch + ch) + ' L' + (x * cw + cw) + ' ' + (y * ch + ch) + ' L' + (x * cw + cw) + ' ' + y * ch + ' Z" fill="' + f + '"/>';
      }
      return out;
    },
    orbit: function (r, p, w, h) {
      var out = '<rect width="' + w + '" height="' + h + '" fill="' + p.bg + '"/>';
      var cx = w * (0.4 + r() * 0.2), cy = h * (0.42 + r() * 0.12);
      for (var i = 6; i > 0; i--) {
        out += '<circle cx="' + cx + '" cy="' + cy + '" r="' + (w * 0.07 * i) + '" fill="none" stroke="' +
          (i % 2 ? p.a : p.c) + '" stroke-width="' + (1 + i * 0.6).toFixed(1) + '" opacity=".85"/>';
      }
      out += '<circle cx="' + cx + '" cy="' + cy + '" r="' + w * 0.1 + '" fill="' + p.b + '"/>';
      out += '<rect x="0" y="' + h * 0.88 + '" width="' + w + '" height="' + h * 0.12 + '" fill="' + p.ink + '"/>';
      return out;
    },
    horizon: function (r, p, w, h) {
      var hz = h * (0.55 + r() * 0.12);
      var out = '<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0" stop-color="' + p.a + '"/><stop offset="1" stop-color="' + p.b + '"/></linearGradient></defs>' +
        '<rect width="' + w + '" height="' + hz + '" fill="url(#sky)"/>' +
        '<rect y="' + hz + '" width="' + w + '" height="' + (h - hz) + '" fill="' + p.ink + '"/>' +
        '<circle cx="' + w * (0.25 + r() * 0.5) + '" cy="' + hz * 0.55 + '" r="' + w * 0.13 + '" fill="' + p.c + '"/>';
      for (var i = 0; i < 4; i++) {
        var x = w * r(), pw = w * (0.15 + r() * 0.3), ph = h * (0.06 + r() * 0.14);
        out += '<path d="M' + x + ' ' + hz + ' L' + (x + pw / 2) + ' ' + (hz - ph) + ' L' + (x + pw) + ' ' + hz + ' Z" fill="' + p.ink + '" opacity=".85"/>';
      }
      return out;
    },
    type: function (r, p, w, h, word) {
      var out = '<rect width="' + w + '" height="' + h + '" fill="' + p.bg + '"/>';
      out += '<rect x="' + w * 0.08 + '" y="' + h * 0.08 + '" width="' + w * 0.84 + '" height="' + h * 0.84 + '" fill="none" stroke="' + p.a + '" stroke-width="3"/>';
      var letters = (word || 'KADR').toUpperCase().slice(0, 8);
      out += '<text x="' + w / 2 + '" y="' + h * 0.52 + '" font-family="Georgia,serif" font-size="' + w * (0.9 / Math.max(3, letters.length)) +
        '" fill="' + p.ink + '" text-anchor="middle" letter-spacing="' + w * 0.008 + '">' + esc(letters) + '</text>';
      out += '<rect x="' + w * 0.08 + '" y="' + h * 0.6 + '" width="' + w * 0.84 + '" height="' + h * 0.012 + '" fill="' + p.b + '"/>';
      out += '<circle cx="' + w * 0.5 + '" cy="' + h * 0.75 + '" r="' + w * 0.06 + '" fill="' + p.c + '"/>';
      return out;
    },
    halftone: function (r, p, w, h) {
      var out = '<rect width="' + w + '" height="' + h + '" fill="' + p.bg + '"/>';
      var cols = 14, rows = Math.round(cols * h / w), cw = w / cols;
      for (var y = 0; y < rows; y++) for (var x = 0; x < cols; x++) {
        var t = y / rows, rr = cw * 0.5 * (0.15 + t * 0.85) * (0.7 + r() * 0.6);
        out += '<circle cx="' + (x * cw + cw / 2) + '" cy="' + (y * cw + cw / 2) + '" r="' + rr.toFixed(2) +
          '" fill="' + (y % 3 === 0 ? p.a : p.ink) + '"/>';
      }
      out += '<rect x="' + w * 0.12 + '" y="' + h * 0.4 + '" width="' + w * 0.76 + '" height="' + h * 0.14 + '" fill="' + p.b + '"/>';
      return out;
    },
    bloom: function (r, p, w, h) {
      var out = '<rect width="' + w + '" height="' + h + '" fill="' + p.bg + '"/>';
      var cx = w / 2, cy = h * 0.5, petals = rint(r, 6, 12);
      for (var i = 0; i < petals; i++) {
        var a = (i / petals) * Math.PI * 2, len = w * (0.26 + r() * 0.14);
        out += '<ellipse cx="' + (cx + Math.cos(a) * len * 0.5) + '" cy="' + (cy + Math.sin(a) * len * 0.5) +
          '" rx="' + len * 0.5 + '" ry="' + len * 0.16 + '" fill="' + (i % 2 ? p.a : p.c) +
          '" opacity=".8" transform="rotate(' + (a * 180 / Math.PI) + ' ' + (cx + Math.cos(a) * len * 0.5) + ' ' + (cy + Math.sin(a) * len * 0.5) + ')"/>';
      }
      out += '<circle cx="' + cx + '" cy="' + cy + '" r="' + w * 0.09 + '" fill="' + p.b + '"/>';
      return out;
    }
  };

  var COMP_KEYS = Object.keys(COMPOSITIONS);

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /* Frame chrome drawn around the artwork; `frame` is an option id. */
  var FRAMES = {
    none:   null,
    black:  { outer: '#15151a', inner: '#2a2a31', mat: null },
    white:  { outer: '#f2efe8', inner: '#d9d4c8', mat: '#faf8f3' },
    oak:    { outer: '#c9a273', inner: '#a37f52', mat: '#f7f2e6' },
    walnut: { outer: '#6c4327', inner: '#4a2c19', mat: '#efe6d5' }
  };

  /* Core: returns an <svg> string for one artwork. */
  function artSvg(opts) {
    var seed = typeof opts.seed === 'string' ? hash(opts.seed) : (opts.seed || 1);
    var r = rng(seed);
    var w = opts.w || 600, h = opts.h || 800;
    var p = opts.palette;
    var comp = COMPOSITIONS[opts.comp] || COMPOSITIONS[COMP_KEYS[seed % COMP_KEYS.length]];
    var f = FRAMES[opts.frame || 'none'];
    var pad = f ? Math.round(w * 0.055) : 0;
    var mat = f && f.mat ? Math.round(w * 0.05) : 0;
    var iw = w - (pad + mat) * 2, ih = h - (pad + mat) * 2;

    var body = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + w + ' ' + h + '" width="' + w + '" height="' + h + '">' +
      '<defs>' + GRAIN + '</defs>';
    if (f) {
      body += '<rect width="' + w + '" height="' + h + '" fill="' + f.outer + '"/>' +
        '<rect x="' + pad * 0.5 + '" y="' + pad * 0.5 + '" width="' + (w - pad) + '" height="' + (h - pad) + '" fill="none" stroke="' + f.inner + '" stroke-width="2"/>';
      if (f.mat) body += '<rect x="' + pad + '" y="' + pad + '" width="' + (w - pad * 2) + '" height="' + (h - pad * 2) + '" fill="' + f.mat + '"/>';
    }
    body += '<g transform="translate(' + (pad + mat) + ',' + (pad + mat) + ')">' +
      '<svg width="' + iw + '" height="' + ih + '" viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="none">' +
      comp(r, p, w, h, opts.word) +
      '<rect width="' + w + '" height="' + h + '" filter="url(#g)" opacity=".5"/>' +
      '</svg></g>';
    if (f) body += '<rect x="' + (pad + mat) + '" y="' + (pad + mat) + '" width="' + iw + '" height="' + ih + '" fill="none" stroke="rgba(0,0,0,.25)" stroke-width="1"/>';
    return body + '</svg>';
  }

  function toUrl(svg) {
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }

  /* ---- room scenes -------------------------------------------------------- */

  var ROOM_SHELLS = {
    bedroom:  { wall: '#e6ded1', floor: '#b9a288', trim: '#d5c9b7' },
    living:   { wall: '#e8e4dc', floor: '#a98f70', trim: '#d3ccc0' },
    gaming:   { wall: '#1d1f26', floor: '#14161b', trim: '#2b2f39' },
    office:   { wall: '#dfe0dc', floor: '#9a9c96', trim: '#c9cac4' },
    dorm:     { wall: '#efe7da', floor: '#c2ad92', trim: '#ded2c0' },
    cafe:     { wall: '#241d18', floor: '#3a2b21', trim: '#3d3128' }
  };

  /* A room scene: wall, floor, furniture silhouettes and framed art on the wall. */
  function sceneSvg(opts) {
    var w = opts.w || 900, h = opts.h || 620;
    var shell = ROOM_SHELLS[opts.room] || ROOM_SHELLS.bedroom;
    var r = rng(hash(opts.seed || 'scene'));
    var floorY = h * 0.72;
    var s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + w + ' ' + h + '" width="' + w + '" height="' + h + '">' +
      '<defs>' + GRAIN +
      '<linearGradient id="wl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + shell.wall + '"/>' +
      '<stop offset="1" stop-color="' + shade(shell.wall, -14) + '"/></linearGradient>' +
      '<radialGradient id="lt" cx="0.28" cy="0.18" r="0.9"><stop offset="0" stop-color="#fff" stop-opacity=".35"/>' +
      '<stop offset="1" stop-color="#000" stop-opacity=".22"/></radialGradient></defs>' +
      '<rect width="' + w + '" height="' + h + '" fill="url(#wl)"/>' +
      '<rect y="' + floorY + '" width="' + w + '" height="' + (h - floorY) + '" fill="' + shell.floor + '"/>' +
      '<rect y="' + (floorY - 10) + '" width="' + w + '" height="12" fill="' + shell.trim + '"/>';

    /* furniture silhouettes */
    var fk = opts.room === 'office' ? 'desk' : (opts.room === 'living' || opts.room === 'cafe' ? 'sofa' : 'bed');
    if (fk === 'bed') {
      s += '<rect x="' + w * 0.24 + '" y="' + (floorY - h * 0.1) + '" width="' + w * 0.52 + '" height="' + h * 0.2 + '" rx="8" fill="' + shade(shell.floor, -18) + '"/>' +
        '<rect x="' + w * 0.27 + '" y="' + (floorY - h * 0.14) + '" width="' + w * 0.2 + '" height="' + h * 0.06 + '" rx="10" fill="' + shade(shell.wall, 12) + '"/>';
    } else if (fk === 'sofa') {
      s += '<rect x="' + w * 0.2 + '" y="' + (floorY - h * 0.14) + '" width="' + w * 0.6 + '" height="' + h * 0.2 + '" rx="14" fill="' + shade(shell.floor, -22) + '"/>' +
        '<rect x="' + w * 0.24 + '" y="' + (floorY - h * 0.2) + '" width="' + w * 0.52 + '" height="' + h * 0.09 + '" rx="12" fill="' + shade(shell.floor, -8) + '"/>';
    } else {
      s += '<rect x="' + w * 0.22 + '" y="' + (floorY - h * 0.02) + '" width="' + w * 0.56 + '" height="' + h * 0.03 + '" fill="' + shade(shell.floor, -25) + '"/>' +
        '<rect x="' + w * 0.26 + '" y="' + (floorY + h * 0.01) + '" width="' + w * 0.02 + '" height="' + h * 0.16 + '" fill="' + shade(shell.floor, -30) + '"/>' +
        '<rect x="' + w * 0.72 + '" y="' + (floorY + h * 0.01) + '" width="' + w * 0.02 + '" height="' + h * 0.16 + '" fill="' + shade(shell.floor, -30) + '"/>';
    }
    /* plant */
    s += '<rect x="' + w * 0.86 + '" y="' + (floorY - h * 0.02) + '" width="' + w * 0.06 + '" height="' + h * 0.1 + '" rx="4" fill="' + shade(shell.floor, -30) + '"/>';
    for (var i = 0; i < 7; i++) {
      var a = -110 + i * 22 + r() * 10;
      s += '<ellipse cx="' + (w * 0.89) + '" cy="' + (floorY - h * 0.09) + '" rx="' + w * 0.045 + '" ry="' + w * 0.012 +
        '" fill="#5d7052" transform="rotate(' + a + ' ' + w * 0.89 + ' ' + (floorY - h * 0.02) + ')"/>';
    }

    /* art on the wall — each entry {x,y,w,h,palette,comp,frame} in 0..1 units */
    (opts.art || []).forEach(function (a) {
      var ax = a.x * w, ay = a.y * h, aw = a.w * w, ah = a.h * h;
      var inner = artSvg({ seed: a.seed, palette: a.palette, comp: a.comp, frame: a.frame, w: 300, h: Math.round(300 * (ah / aw)) })
        .replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
      s += '<g transform="translate(' + ax + ',' + ay + ')">' +
        '<rect x="6" y="8" width="' + aw + '" height="' + ah + '" fill="rgba(0,0,0,.22)" />' +
        '<svg width="' + aw + '" height="' + ah + '" viewBox="0 0 300 ' + Math.round(300 * (ah / aw)) + '" preserveAspectRatio="none">' +
        '<defs>' + GRAIN + '</defs>' + inner + '</svg></g>';
    });

    s += '<rect width="' + w + '" height="' + h + '" fill="url(#lt)"/>';
    s += '<rect width="' + w + '" height="' + h + '" filter="url(#g)" opacity=".35"/>';
    return s + '</svg>';
  }

  function shade(hex, amt) {
    var n = parseInt(hex.slice(1), 16);
    var r = Math.max(0, Math.min(255, (n >> 16) + amt));
    var g = Math.max(0, Math.min(255, ((n >> 8) & 255) + amt));
    var b = Math.max(0, Math.min(255, (n & 255) + amt));
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  K.art = {
    rng: rng, hash: hash, pick: pick, rint: rint, shade: shade,
    compositions: COMP_KEYS,
    frames: FRAMES,
    svg: artSvg,
    url: function (o) { return toUrl(artSvg(o)); },
    sceneSvg: sceneSvg,
    sceneUrl: function (o) { return toUrl(sceneSvg(o)); },
    toUrl: toUrl
  };
})(window.KADR = window.KADR || {});

/* ============================================================================
   CATALOGUE — filled from the KADR back office (products, options, prices…)
   ============================================================================ */

/* KADR — catalogue model.
   Everything a customer sees comes from the back office through one request
   (/api/public/bootstrap): products, their options, prices, categories, tags,
   collections, homepage blocks, delivery and contacts. Change it there and the
   site follows on the next page load. Prices depend only on the option
   combination, so one price table prices any configuration instantly. */
(function (K) {
  'use strict';
  var art = K.art;

  /* ---------- money -------------------------------------------------------- */

  /* rate = units of the currency per 1 AMD; replaced by the Central Bank rate */
  var CURRENCIES = {
    AMD: { code: 'AMD', symbol: '֏', rate: 1,        dec: 0, pos: 'after' },
    USD: { code: 'USD', symbol: '$', rate: 0.00258,  dec: 2, pos: 'before' },
    EUR: { code: 'EUR', symbol: '€', rate: 0.00238,  dec: 2, pos: 'before' },
    RUB: { code: 'RUB', symbol: '₽', rate: 0.205,    dec: 0, pos: 'after' }
  };

  var KINDS = ['size', 'material', 'frame', 'glass'];
  var KIND_NAMES = {
    size:     { en: 'Size', hy: 'Չափս', ru: 'Размер' },
    material: { en: 'Material', hy: 'Նյութ', ru: 'Материал' },
    frame:    { en: 'Frame', hy: 'Շրջանակ', ru: 'Рама' },
    glass:    { en: 'Glass', hy: 'Ապակի', ru: 'Стекло' }
  };

  /* Filled by load(); arrays are replaced in place so every module sees them. */
  var CATEGORIES = [];
  var ATTRIBUTES = {};
  var PRODUCT_TYPES = {};
  var TAGS = [];
  var TAG_COLORS = {};
  var COLLECTIONS = [];
  var PRICES = {};
  var HOME = [];
  var PAGES = {};
  var BACKOFFICE = { settings: null };

  /* ---------- themes: palettes for illustrations ---------------------------
     Room scenes and products without a picture are drawn procedurally; a
     product borrows the palette of the theme its tags match best. */

  var THEMES = [
    { id: 'anime',    tags: ['anime', 'cyber', 'energetic', 'bedroom', 'c-pink'],        palette: { bg: '#f4e6ee', a: '#e0538a', b: '#2b2350', c: '#f2b8c6', ink: '#1b1630' } },
    { id: 'cars',     tags: ['cars', 'bmw', 'minimal', 'energetic', 'gaming-room', 'c-red'], palette: { bg: '#ecebe8', a: '#b5372a', b: '#20242b', c: '#8b9199', ink: '#101318' } },
    { id: 'music',    tags: ['music', 'vinyl', 'vintage', 'cozy', 'living', 'c-gold'],   palette: { bg: '#f3e9d8', a: '#c08a2e', b: '#2a2018', c: '#8c6b3f', ink: '#191309' } },
    { id: 'gaming',   tags: ['gaming', 'cyber', 'energetic', 'gaming-room', 'c-black'],  palette: { bg: '#12141b', a: '#5ce1a0', b: '#7a4bd0', c: '#1f2430', ink: '#e7edf5' } },
    { id: 'cinema',   tags: ['cinema', 'dark-academia', 'moody', 'living', 'c-black'],   palette: { bg: '#14120f', a: '#c9b072', b: '#3a332a', c: '#7d6c50', ink: '#eee6d4' } },
    { id: 'nature',   tags: ['nature', 'botanical', 'calm', 'bedroom', 'c-green'],       palette: { bg: '#eae7dc', a: '#5b7355', b: '#2f3a2c', c: '#a8b09a', ink: '#1d231b' } },
    { id: 'space',    tags: ['space', 'retro-futurism', 'creative', 'office', 'c-blue'], palette: { bg: '#131a2b', a: '#e8863f', b: '#3d5a99', c: '#25314f', ink: '#e9eef7' } },
    { id: 'japandi',  tags: ['japandi', 'tokyo', 'minimal', 'calm', 'bedroom', 'c-beige'], palette: { bg: '#efe9df', a: '#c3452c', b: '#20211d', c: '#c7bda9', ink: '#191a16' } },
    { id: 'bauhaus',  tags: ['bauhaus', 'architecture', 'creative', 'office', 'c-red'],  palette: { bg: '#f0ece3', a: '#c8452b', b: '#20487a', c: '#e0b33c', ink: '#15161a' } },
    { id: 'brutal',   tags: ['brutalist', 'architecture', 'moody', 'office', 'c-white'], palette: { bg: '#d9d7d2', a: '#4b4d4f', b: '#8b8d8c', c: '#22242a', ink: '#111214' } },
    { id: 'sport',    tags: ['sport', 'minimal', 'energetic', 'dorm', 'c-blue'],         palette: { bg: '#eef1f4', a: '#1f4fa3', b: '#e8622a', c: '#2b3440', ink: '#111820' } },
    { id: 'yerevan',  tags: ['yerevan', 'ararat', 'vintage', 'calm', 'cafe', 'c-beige'], palette: { bg: '#f0e6d6', a: '#b2643a', b: '#5c7a86', c: '#d7c3a4', ink: '#241d16' } },
    { id: 'type',     tags: ['typography', 'minimal', 'creative', 'office', 'c-black'],  palette: { bg: '#f5f3ee', a: '#191919', b: '#b23a2e', c: '#c9c5bb', ink: '#0f0f0f' } },
    { id: 'lux',      tags: ['luxury', 'dark-academia', 'cinema', 'living', 'c-gold'],   palette: { bg: '#171512', a: '#c8a24d', b: '#2c2822', c: '#8a7550', ink: '#f0e8d8' } }
  ];

  function themeFor(tags) {
    var best = THEMES[0], score = -1;
    THEMES.forEach(function (th) {
      var s = th.tags.filter(function (x) { return tags.indexOf(x) >= 0; }).length;
      if (s > score) { score = s; best = th; }
    });
    return best;
  }

  /* ---------- room scenes (editorial illustrations) ------------------------ */

  var SCENES = [
    { id: 's1', room: 'bedroom', style: 'japandi', mood: 'calm', title: { en: 'Quiet bedroom, three prints', hy: 'Հանգիստ ննջասենյակ', ru: 'Тихая спальня' }, tags: ['japandi', 'bedroom', 'calm', 'c-beige'], themes: ['japandi', 'nature'] },
    { id: 's2', room: 'gaming', style: 'cyber', mood: 'energetic', title: { en: 'Setup that earns the desk', hy: 'Գեյմինգ անկյուն', ru: 'Игровой угол' }, tags: ['gaming', 'gaming-room', 'cyber', 'c-black'], themes: ['gaming', 'space'] },
    { id: 's3', room: 'living', style: 'dark-academia', mood: 'moody', title: { en: 'Living room after ten', hy: 'Հյուրասենյակ տասից հետո', ru: 'Гостиная после десяти' }, tags: ['dark-academia', 'living', 'moody', 'c-gold'], themes: ['cinema', 'lux'] },
    { id: 's4', room: 'office', style: 'bauhaus', mood: 'creative', title: { en: 'Studio wall, primary colours', hy: 'Ստուդիայի պատ', ru: 'Стена студии' }, tags: ['bauhaus', 'office', 'creative', 'c-red'], themes: ['bauhaus', 'type'] },
    { id: 's5', room: 'dorm', style: 'minimal', mood: 'cozy', title: { en: 'A first wall on a budget', hy: 'Առաջին պատը՝ խնայողաբար', ru: 'Первая стена без лишних трат' }, tags: ['dorm', 'minimal', 'cozy'], themes: ['sport', 'music'] },
    { id: 's6', room: 'cafe', style: 'vintage', mood: 'cozy', title: { en: 'Café on Saryan street', hy: 'Սրճարան Սարյան փողոցում', ru: 'Кафе на Сарьяна' }, tags: ['cafe', 'vintage', 'yerevan', 'cozy'], themes: ['yerevan', 'music'] },
    { id: 's7', room: 'bedroom', style: 'anime', mood: 'energetic', title: { en: 'Pink hour', hy: 'Վարդագույն ժամ', ru: 'Розовый час' }, tags: ['anime', 'bedroom', 'c-pink', 'energetic'], themes: ['anime'] },
    { id: 's8', room: 'living', style: 'brutalist', mood: 'calm', title: { en: 'Concrete and one plant', hy: 'Բետոն և մեկ բույս', ru: 'Бетон и одно растение' }, tags: ['brutalist', 'living', 'calm', 'c-white'], themes: ['brutal', 'nature'] },
    { id: 's9', room: 'office', style: 'minimal', mood: 'luxury', title: { en: 'Reception, four panels', hy: 'Ընդունարան', ru: 'Ресепшн' }, tags: ['office', 'luxury', 'minimal', 'architecture'], themes: ['type', 'brutal'] },
    { id: 's10', room: 'gaming', style: 'retro-futurism', mood: 'creative', title: { en: 'Second monitor, first flag', hy: 'Երկրորդ մոնիտոր', ru: 'Второй монитор' }, tags: ['gaming-room', 'retro-futurism', 'space'], themes: ['space', 'gaming'] }
  ];

  /* ---------- settings: storefront features + what the back office sends ---- */

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
      enabled: true, pickup: false, pickupAddress: '', freeAbove: null,
      zones: [],
      slots: ['10:00–13:00', '13:00–16:00', '16:00–19:00', '19:00–22:00'],
      productionDays: [2, 4]
    },
    contact: { instagram: '@kadr.studio', whatsapp: '', email: 'hello@kadr.am' },
    homepage: [],
    seo: {
      title: 'KADR — posters & room decor, made to order in Armenia',
      description: 'Made-to-order posters, framed prints, flags and objects. Explore rooms, customise your print, delivery across Armenia.'
    }
  };

  function same(text) { return { en: text, hy: text, ru: text }; }
  function replace(arr, items) { arr.length = 0; Array.prototype.push.apply(arr, items); }
  function replaceObj(obj, src) { Object.keys(obj).forEach(function (k) { delete obj[k]; }); Object.assign(obj, src); }

  /* ---------- load: back-office payload → storefront model ------------------ */

  function load(boot) {
    var S0 = boot.settings || {};
    BACKOFFICE.settings = S0;

    replace(CATEGORIES, (boot.categories || []).map(function (c) {
      return { id: c.id, slug: c.id, name: c.name, parent: null };
    }));
    replace(TAGS, (boot.tags || []).map(function (t) {
      return { id: t.id, slug: t.id, group: t.group || 'theme', name: t.name };
    }));
    var colors = {};
    (boot.tags || []).forEach(function (t) { if (t.color) colors[t.id] = t.color; });
    replaceObj(TAG_COLORS, colors);

    var attrs = {};
    KINDS.forEach(function (k) {
      var rows = (boot.options || {})[k] || [];
      attrs[k] = {
        id: k, type: 'select', filterable: k !== 'glass', name: KIND_NAMES[k],
        values: rows.map(function (o) {
          var v = { id: o.id, label: o.name };
          if (o.w && o.h) v.ratio = o.w / o.h;
          if (o.swatch) v.swatch = o.swatch;
          return v;
        })
      };
    });
    replaceObj(ATTRIBUTES, attrs);
    replaceObj(PRICES, boot.prices || {});

    var types = {};
    var products = (boot.products || []).map(function (bp) {
      var theme = themeFor(bp.tags || []);
      var typeId = 'pt:' + bp.id;
      var cat = CATEGORIES.filter(function (c) { return c.id === bp.category; })[0];
      types[typeId] = {
        id: typeId, categoryId: bp.category,
        name: cat ? cat.name : same('Print'),
        components: KINDS.filter(function (k) { return (bp.options[k] || []).length; }),
        defaults: Object.assign({}, bp['default']),
        rules: []
      };
      var r = art.rng(art.hash(bp.id));
      return {
        id: bp.id, sku: bp.id, typeId: typeId, categoryId: bp.category,
        themeId: theme.id, palette: theme.palette,
        comp: art.compositions[Math.floor(r() * art.compositions.length)],
        word: (bp.title.en || 'KADR').split(' ').pop().toUpperCase(),
        title: bp.title, description: bp.description,
        tags: bp.tags || [],
        optionSets: bp.options,
        images: bp.images || [],
        basePrice: bp.from, priceFrom: bp.from, priceTo: bp.to,
        createdAt: Date.parse(bp.added) || Date.now(),
        stats: { views: 0, favs: 0, carts: 0, orders: bp.sold || 0 },
        status: 'live',
        productionDays: null, deliveryDays: null,
        files: []
      };
    });
    replaceObj(PRODUCT_TYPES, types);

    /* collections and homepage order are managed in Settings → Site texts */
    HOME.length = 0;
    var cols = [];
    (boot.home || []).forEach(function (b) {
      if (b.kind === 'collection') {
        /* block titles are typed once in the back office; other languages fall back to the tag's translated name */
        var tg = TAGS.filter(function (x) { return x.id === b.tag; })[0];
        var title = tg && tg.name ? { en: b.title, hy: tg.name.hy || b.title, ru: tg.name.ru || b.title } : same(b.title);
        if (!cols.some(function (c) { return c.id === b.tag; })) cols.push({ id: b.tag, title: title, tags: [b.tag], featured: true });
        if (HOME.indexOf('collections') < 0) HOME.push('collections');
      } else {
        var id = { room_scenes: 'inspiration', new_arrivals: 'new', popular: 'trending' }[b.kind];
        if (id && HOME.indexOf(id) < 0) HOME.push(id);
      }
    });
    replace(COLLECTIONS, cols);
    replaceObj(PAGES, boot.pages || {});

    var rates = S0.rates || {};
    ['USD', 'EUR', 'RUB'].forEach(function (c) {
      var amdPerUnit = parseFloat(rates[c]);
      if (amdPerUnit > 0) CURRENCIES[c].rate = 1 / amdPerUnit;
    });
    return products;
  }

  /* Settings the storefront shows, taken from the back office. */
  function backofficeSettings() {
    var s = BACKOFFICE.settings || {};
    var d = s.delivery || {};
    var prod = s.production_days || 4;
    var out = {
      delivery: {
        enabled: d.enabled !== false, pickup: !!d.pickup, pickupAddress: d.pickup_address || '',
        freeAbove: d.free_above || null,
        zones: (d.zones || []).map(function (z) {
          return { id: String(z.id), backendId: z.id, name: same(z.name), enabled: true, price: z.price, days: [z.days, z.days + 1] };
        }),
        productionDays: [prod, prod + 1]
      },
      payments: { card: !!s.online_payment, applePay: false, googlePay: false, manual: true },
      onlinePayment: !!s.online_payment,
      homepage: ['hero', 'brand'].concat(HOME.slice(0, 1), ['personalize'], HOME.slice(1), ['business']).map(function (id) {
        return { id: id, on: true };
      })
    };
    if (s.contact) out.contact = s.contact;
    return out;
  }

  /* ---------- pricing over the back-office price table ---------------------- */

  function attrFor(compId) { return ATTRIBUTES[compId]; }
  function valueOf(compId, valId) {
    var a = ATTRIBUTES[compId]; if (!a) return null;
    for (var i = 0; i < a.values.length; i++) if (a.values[i].id === valId) return a.values[i];
    return null;
  }
  function typeOf(product) { return PRODUCT_TYPES[product.typeId] || { components: KINDS, defaults: {}, rules: [] }; }
  function keyOf(product, options) {
    var d = typeOf(product).defaults;
    return KINDS.map(function (k) { return (options && options[k]) || d[k] || ''; }).join('|');
  }
  function offers(product, kind, valId) {
    return ((product.optionSets || {})[kind] || []).indexOf(valId) >= 0;
  }

  /* exact price of a configuration; never typed by hand, computed in the back office */
  function price(product, options) {
    var v = PRICES[keyOf(product, options)];
    return v != null ? v : product.priceFrom;
  }
  function priceRange(product) { return { min: product.priceFrom, max: product.priceTo }; }

  function isAllowed(product, options) {
    var key = keyOf(product, options);
    if (PRICES[key] == null) return false;
    var parts = key.split('|');
    return KINDS.every(function (k, i) { return offers(product, k, parts[i]); });
  }

  /* All sellable combinations of one product (cached). */
  var comboCache = {};
  function combos(product) {
    if (comboCache[product.id]) return comboCache[product.id];
    var out = [{}];
    KINDS.forEach(function (k) {
      var next = [];
      out.forEach(function (base) {
        ((product.optionSets || {})[k] || []).forEach(function (v) { var o = Object.assign({}, base); o[k] = v; next.push(o); });
      });
      out = next;
    });
    out = out.filter(function (o) { return PRICES[keyOf(product, o)] != null; });
    comboCache[product.id] = out;
    return out;
  }

  var WHY = { en: 'Not available with the current selection.', hy: 'Հասանելի չէ ընթացիկ ընտրությամբ։', ru: 'Недоступно с текущим выбором.' };

  /* A value is off when no sellable combination has it together with the other current picks. */
  function disabledMap(product, options) {
    var out = {}, reasons = {};
    var all = combos(product);
    typeOf(product).components.forEach(function (c) {
      (product.optionSets[c] || []).forEach(function (v) {
        var ok = all.some(function (o) {
          if (o[c] !== v) return false;
          return KINDS.every(function (k) { return k === c || !options[k] || o[k] === options[k]; });
        });
        if (!ok) { (out[c] || (out[c] = [])).push(v); reasons[c + ':' + v] = WHY; }
      });
    });
    return { disabled: out, reasons: reasons };
  }

  /* Repair a selection after a change so the customer is never stuck on a dead combination. */
  function reconcile(product, options, changedKey) {
    if (isAllowed(product, options)) return Object.assign({}, options);
    var best = null, bestScore = -1;
    combos(product).forEach(function (o) {
      if (changedKey && options[changedKey] && o[changedKey] !== options[changedKey]) return;
      var score = KINDS.filter(function (k) { return o[k] === options[k]; }).length;
      if (score > bestScore) { bestScore = score; best = o; }
    });
    return Object.assign({}, best || typeOf(product).defaults);
  }

  function optionRatio(product, options) {
    var o = options || typeOf(product).defaults;
    var v = valueOf('size', o.size);
    return v && v.ratio ? v.ratio : 0.72;
  }

  /* the back office's catalogue images; procedural art only when a product has none */
  function imageFor(product, options, w) {
    var img = (product.images || [])[0];
    if (img) return (w || 600) <= 520 ? img.thumb : img.medium;
    var o = options || typeOf(product).defaults;
    var ratio = optionRatio(product, o);
    var width = w || 600;
    return art.url({ seed: product.id, palette: product.palette, comp: product.comp, word: product.word,
      frame: 'none', w: width, h: Math.round(width / ratio) });
  }
  function hasPhoto(product) { return !!(product.images && product.images.length); }

  /* CSS frame + passe-partout around a real photo, from the chosen frame's colour */
  function frameStyle(options) {
    var v = options && valueOf('frame', options.frame);
    if (!v || !v.swatch || v.swatch === 'transparent') return '';
    return 'border:clamp(8px,2.4vw,18px) solid ' + v.swatch + ';padding:clamp(6px,1.8vw,14px);background:#faf8f3;' +
      'box-shadow:0 18px 40px rgba(0,0,0,.18);box-sizing:border-box';
  }

  K.data = {
    CURRENCIES: CURRENCIES, CATEGORIES: CATEGORIES, ATTRIBUTES: ATTRIBUTES,
    PRODUCT_TYPES: PRODUCT_TYPES, TAGS: TAGS, TAG_COLORS: TAG_COLORS, THEMES: THEMES,
    COLLECTIONS: COLLECTIONS, SCENES: SCENES, DEFAULT_SETTINGS: DEFAULT_SETTINGS, PAGES: PAGES,
    KINDS: KINDS,
    load: load, backofficeSettings: backofficeSettings,
    price: price, priceRange: priceRange, disabledMap: disabledMap, isAllowed: isAllowed,
    reconcile: reconcile, valueOf: valueOf, attrFor: attrFor, imageFor: imageFor, optionRatio: optionRatio,
    offers: offers, hasPhoto: hasPhoto, frameStyle: frameStyle, combos: combos,
    resetCaches: function () { comboCache = {}; },
    defaultsFor: function (p) { return Object.assign({}, typeOf(p).defaults); },
    tagById: function (id) { for (var i = 0; i < TAGS.length; i++) if (TAGS[i].id === id) return TAGS[i]; return null; },
    catById: function (id) {
      for (var i = 0; i < CATEGORIES.length; i++) if (CATEGORIES[i].id === id) return CATEGORIES[i];
      return { id: id, slug: id, name: same(id || ''), parent: null };
    }
  };
})(window.KADR = window.KADR || {});

/* ============================================================================
   API — the KADR back office (catalogue, orders, pages)
   ============================================================================ */

/* KADR — back-office client. One small fetch wrapper: timeouts, JSON errors,
   and a base URL that defaults to the same site (the host proxies /api/public
   to the back office) or comes from <meta name="kadr-api" content="https://…">. */
(function (K) {
  'use strict';
  var meta = document.querySelector('meta[name="kadr-api"]');
  var BASE = ((meta && meta.content) || '').replace(/\/$/, '') + '/api/public';

  function request(method, path, body, timeoutMs) {
    var ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var timer = ctrl ? setTimeout(function () { ctrl.abort(); }, timeoutMs || 15000) : null;
    return fetch(BASE + path, {
      method: method,
      headers: body ? { 'Content-Type': 'application/json' } : {},
      body: body ? JSON.stringify(body) : undefined,
      signal: ctrl ? ctrl.signal : undefined,
      cache: 'no-cache',
      credentials: 'omit'
    }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (data) {
        if (!r.ok) {
          var err = { code: data.error || (r.status === 422 ? 'invalid' : 'http'), status: r.status, detail: data.detail, data: data };
          throw err;
        }
        return data;
      });
    }, function () {
      throw { code: 'network' };
    }).finally(function () { if (timer) clearTimeout(timer); });
  }

  K.api = {
    base: BASE,
    get: function (path) { return request('GET', path); },
    post: function (path, body) { return request('POST', path, body); },
    bootstrap: function () { return request('GET', '/bootstrap'); }
  };
})(window.KADR = window.KADR || {});

/* ============================================================================
   STATE — cart, favourites, orders, events, settings (stands in for the API)
   ============================================================================ */

/* KADR — client state.
   Products, prices and settings come from the back office (K.api); the cart,
   favourites, taste profile and the list of your own order codes stay in the
   browser. Orders themselves live in the back office. */
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

  var products = [];
  var productIndex = {};

  /* Replace the catalogue with what the back office just sent. */
  var catalogLoaded = false;   /* until then no cart line can be judged, so none is dropped */
  function setCatalog(list) {
    catalogLoaded = true;
    products.length = 0;
    Array.prototype.push.apply(products, list);
    productIndex = {};
    products.forEach(function (p) { productIndex[p.id] = p; });
    D.resetCaches();
    state.settings = deepMerge(JSON.parse(JSON.stringify(D.DEFAULT_SETTINGS)), D.backofficeSettings());
    emit('products');
  }

  var state = {
    lang: load('lang', 'en'),
    currency: load('currency', 'AMD'),
    theme: load('theme', null),   /* null = follow the OS / host until the user chooses */
    cart: load('cart', []),
    favorites: load('favorites', []),
    recent: load('recent', []),
    prefs: load('prefs', null),
    affinity: load('affinity', {}),
    orders: load('orders', []).filter(function (o) { return o && o.token; }),  /* only orders the back office knows */
    addresses: load('addresses', []),
    user: load('user', null),
    events: load('events', []),
    searches: load('searches', []),
    settings: JSON.parse(JSON.stringify(D.DEFAULT_SETTINGS)),
    wall: load('wall', null)
  };

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
    var opts = options || D.defaultsFor(p);
    var key = lineKey(productId, opts);
    var line = state.cart.filter(function (l) { return l.key === key; })[0];
    if (line) line.qty += (qty || 1);
    /* `unit` remembers the price the customer saw, so a later change is shown, never hidden */
    else state.cart.push({ key: key, productId: productId, options: opts, qty: qty || 1, addedAt: Date.now(), unit: D.price(p, opts), title: p.title });
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
  /* a line can stop being sellable: the product was hidden or an option switched off */
  function lineValid(line) {
    var p = productIndex[line.productId];
    return !!p && D.isAllowed(p, line.options);
  }
  function linePrice(line) {
    var p = productIndex[line.productId]; if (!p || !lineValid(line)) return 0;
    return D.price(p, line.options) * line.qty;
  }
  function cartTotal() { return state.cart.reduce(function (n, l) { return n + linePrice(l); }, 0); }
  /* lines whose price moved since they were added — shown explicitly before paying */
  function priceChanges() {
    return state.cart.filter(lineValid).map(function (l) {
      var now = D.price(productIndex[l.productId], l.options);
      return { line: l, was: l.unit, now: now };
    }).filter(function (c) { return c.was != null && c.was !== c.now; });
  }
  function ackPrices() {
    state.cart.forEach(function (l) { if (lineValid(l)) l.unit = D.price(productIndex[l.productId], l.options); });
    save('cart', state.cart);
  }
  function dropInvalid() {
    if (!catalogLoaded) return 0;
    var before = state.cart.length;
    state.cart = state.cart.filter(lineValid);
    if (state.cart.length !== before) { save('cart', state.cart); emit('cart'); }
    return before - state.cart.length;
  }

  /* ---------- orders (stored in the back office) ---------------------------- */

  var STATUSES = ['awaiting_payment', 'paid', 'accepted', 'in_production', 'ready', 'in_delivery', 'delivered', 'cancelled'];
  var STATUS_LABEL = {
    awaiting_payment: { en: 'Awaiting payment', hy: 'Սպասում է վճարման', ru: 'Ожидает оплаты' },
    paid:          { en: 'Paid', hy: 'Վճարված', ru: 'Оплачен' },
    accepted:      { en: 'Order accepted', hy: 'Պատվերն ընդունված է', ru: 'Заказ принят' },
    in_production: { en: 'In production', hy: 'Արտադրության մեջ', ru: 'В производстве' },
    ready:         { en: 'Ready', hy: 'Պատրաստ է', ru: 'Готов' },
    in_delivery:   { en: 'In delivery', hy: 'Առաքման մեջ', ru: 'В доставке' },
    delivered:     { en: 'Delivered', hy: 'Առաքված', ru: 'Доставлен' },
    cancelled:     { en: 'Cancelled', hy: 'Չեղարկված', ru: 'Отменён' }
  };

  /* Sends the cart to the back office. Resolves with the saved order, or rejects with
     {code:'price_changed'|'invalid'|'network', ...} so checkout can explain what happened. */
  function createOrder(payload) {
    var lines = state.cart.filter(lineValid);
    if (!catalogLoaded || !lines.length || lines.length !== state.cart.length) return Promise.reject({ code: 'cart_invalid' });
    var body = {
      lines: lines.map(function (l) {
        var o = l.options;
        /* the price the customer was shown; if the back office changed it since, the server answers 409 */
        var seen = l.unit != null ? l.unit : D.price(productIndex[l.productId], o);
        return { code: l.productId, size: o.size, material: o.material, frame: o.frame, glass: o.glass,
                 qty: l.qty, expected_price: seen };
      }),
      name: payload.customer.name, phone: payload.customer.phone, email: payload.customer.email,
      language: K.i18n.lang, delivery: payload.delivery, zone_id: payload.zoneId,
      address: payload.address, delivery_window: payload.slot || '',
      consent_contact: !!payload.consent,
      currency: ['AMD', 'USD', 'RUB'].indexOf(state.currency) >= 0 ? state.currency : 'AMD',
      client_ref: payload.ref
    };
    return K.api.post('/orders', body).then(function (r) {
      var order = {
        id: r.code, token: r.token, at: Date.now(), status: r.status,
        total: r.total, delivery: r.delivery, itemsTotal: r.items_total,
        promised: r.promised_date, bank: r.bank_details, online: r.online_payment,
        items: lines.map(function (l) {
          var p = productIndex[l.productId];
          return { productId: l.productId, sku: skuFor(p, l.options), title: p.title, options: l.options, qty: l.qty,
                   unit: D.price(p, l.options) };
        })
      };
      state.orders.unshift(order);
      save('orders', state.orders);
      track('purchase', { tags: order.items.reduce(function (a, i) { return a.concat((productIndex[i.productId] || { tags: [] }).tags); }, []) });
      clearCart();
      emit('orders');
      return order;
    });
  }
  /* Refresh one of your orders from the back office (status, promised date, bank details). */
  function refreshOrder(code) {
    var o = state.orders.filter(function (x) { return x.id === code; })[0];
    if (!o || !o.token) return Promise.reject({ code: 'unknown' });
    return K.api.get('/orders/' + encodeURIComponent(o.token) + '?lang=' + K.i18n.lang).then(function (r) {
      Object.assign(o, { status: r.status, statusLabel: r.status_label, steps: r.steps, promised: r.promised_date,
        total: r.total, delivery: r.delivery, itemsTotal: r.items_total, bank: r.bank_details, online: r.online_payment, page: r.page, remote: r.items });
      save('orders', state.orders);
      return o;
    });
  }

  /* Variant SKU: base SKU plus a deterministic option suffix, so the factory
     brief is unambiguous without a lookup. */
  function skuFor(product, options) {
    if (!product) return '';
    var o = Object.assign(D.defaultsFor(product), options || {});
    return [product.sku].concat(D.KINDS.map(function (k) { return o[k]; }).filter(Boolean)).join('-');
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

  function paymentOn() { return !!state.settings.onlinePayment; }

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
    cartCount: cartCount, cartTotal: cartTotal, linePrice: linePrice, lineKey: lineKey, lineValid: lineValid,
    priceChanges: priceChanges, ackPrices: ackPrices, dropInvalid: dropInvalid,
    createOrder: createOrder, refreshOrder: refreshOrder, STATUSES: STATUSES, STATUS_LABEL: STATUS_LABEL,
    skuFor: skuFor, setCatalog: setCatalog,
    saveAddress: saveAddress, removeAddress: removeAddress, signIn: signIn, signOut: signOut,
    paymentOn: paymentOn,
    setLang: setLang, setCurrency: setCurrency, setTheme: setTheme, setWall: setWall,
    rememberSearch: rememberSearch
  };
})(window.KADR = window.KADR || {});

/* ============================================================================
   SEARCH — index, typo tolerance, filters, sorting, recommendations
   ============================================================================ */

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
            if (!D.offers(p, c, v.id)) return;
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
    /* a product matches when it is actually offered in one of the chosen sizes / materials */
    if (f.sizes && f.sizes.length && !f.sizes.some(function (v) { return D.offers(p, 'size', v); })) return false;
    if (f.materials && f.materials.length && !f.materials.some(function (v) { return D.offers(p, 'material', v); })) return false;
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
        var s = overlap(p.tags, o.tags) * 10 + (o.themeId === p.themeId ? 6 : 0) + (o.categoryId === p.categoryId ? 2 : 0);
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
    return S.live().filter(function (o) { return o.id !== p.id && o.themeId !== p.themeId; })
      .map(function (o) { return { o: o, s: overlap(moodColor, o.tags) * 10 + (o.categoryId !== p.categoryId ? 3 : 0) + Math.log1p(pop(o)) * 0.5 }; })
      .sort(function (a, b) { return b.s - a.s; }).slice(0, n || 6).map(function (x) { return x.o; });
  }
  function sceneProducts(scene) {
    var list = S.live().filter(function (p) { return scene.themes.indexOf(p.themeId) >= 0; });
    var byType = {};
    list.forEach(function (p) { (byType[p.categoryId] || (byType[p.categoryId] = [])).push(p); });
    var out = [];
    Object.keys(byType).forEach(function (t) {
      byType[t].sort(function (a, b) { return K.art.hash(scene.id + a.id) - K.art.hash(scene.id + b.id); });
      out = out.concat(byType[t].slice(0, t === 'posters' ? 4 : 1));
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

/* ============================================================================
   UI TOOLKIT — cards, lazy images, modals, toasts, SEO head
   ============================================================================ */

/* KADR — DOM toolkit. Small on purpose: templates return HTML strings, one
   delegated click handler runs [data-action], images render only when seen. */
(function (K) {
  'use strict';
  var D = K.data, S = K.store, t = function (k, v) { return K.i18n.t(k, v); }, tc = function (o) { return K.i18n.tc(o); };

  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function qs(sel, root) { return (root || document).querySelector(sel); }
  function qsa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function money(a) { return S.money(a); }

  /* ---------- lazy artwork -------------------------------------------------- */

  var io = null;
  function ensureObserver() {
    if (io || !('IntersectionObserver' in window)) return;
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        paint(e.target);
        io.unobserve(e.target);
      });
    }, { rootMargin: '400px 0px' });
  }
  function paint(img) {
    if (img.dataset.painted) return;
    var p = S.byId(img.dataset.pid);
    if (!p) return;
    var opts = img.dataset.opts ? JSON.parse(img.dataset.opts) : null;
    img.src = D.imageFor(p, opts, parseInt(img.dataset.w, 10) || 520);
    img.dataset.painted = '1';
    img.classList.add('is-loaded');
  }
  function hydrateImages(root) {
    ensureObserver();
    qsa('img[data-pid]:not([data-painted])', root || document).forEach(function (img) {
      if (io) io.observe(img); else paint(img);
    });
  }
  function artImg(p, opts, w, cls) {
    var ratio = D.optionRatio(p, opts || D.PRODUCT_TYPES[p.typeId].defaults);
    return '<img class="art ' + (cls || '') + '" alt="' + esc(tc(p.title)) + '" loading="lazy" decoding="async"' +
      ' data-pid="' + p.id + '" data-w="' + (w || 520) + '"' +
      (opts ? ' data-opts=\'' + esc(JSON.stringify(opts)) + '\'' : '') +
      ' style="aspect-ratio:' + ratio.toFixed(3) + ';object-fit:cover">';
  }

  /* ---------- pieces -------------------------------------------------------- */

  function priceLabel(p) {
    var r = D.priceRange(p);
    return r.min === r.max ? money(r.min) : t('p.from') + ' ' + money(r.min);
  }

  function card(p, opt) {
    opt = opt || {};
    var fav = S.isFav(p.id);
    var badges = [];
    if (Date.now() - p.createdAt < 21 * 86400000) badges.push('<span class="badge">' + t('nav.new') + '</span>');
    if (K.search.isHot(p)) badges.push('<span class="badge badge--hot">' + t('home.trending') + '</span>');
    return '<article class="card' + (opt.wide ? ' card--wide' : '') + '">' +
      '<a class="card__media" href="#/p/' + p.id + '" data-track="card" data-pid="' + p.id + '">' +
        artImg(p, null, opt.w || 520) +
        (badges.length ? '<div class="card__badges">' + badges.join('') + '</div>' : '') +
      '</a>' +
      '<button class="card__fav' + (fav ? ' is-on' : '') + '" data-action="fav" data-id="' + p.id + '"' +
        ' aria-pressed="' + fav + '" aria-label="' + t('p.fav') + '">' + heart() + '</button>' +
      '<div class="card__body">' +
        '<a class="card__title" href="#/p/' + p.id + '">' + esc(tc(p.title)) + '</a>' +
        '<div class="card__meta"><span class="card__price">' + priceLabel(p) + '</span>' +
        '<span class="card__type">' + esc(tc(D.PRODUCT_TYPES[p.typeId].name)) + '</span></div>' +
      '</div></article>';
  }

  function heart() {
    return '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M12 20s-7.5-4.7-7.5-9.6A4.4 4.4 0 0 1 12 7.6a4.4 4.4 0 0 1 7.5 2.8C19.5 15.3 12 20 12 20z"/></svg>';
  }
  function icon(name) {
    var paths = {
      search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
      cart: '<path d="M4 6h16l-1.6 10.4a2 2 0 0 1-2 1.6H7.6a2 2 0 0 1-2-1.6L4 6z"/><path d="M9 6a3 3 0 0 1 6 0"/>',
      user: '<circle cx="12" cy="8.5" r="3.5"/><path d="M5 20c1.2-3.6 4-5.2 7-5.2s5.8 1.6 7 5.2"/>',
      menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
      close: '<path d="M6 6l12 12M18 6L6 18"/>',
      chev: '<path d="M9 6l6 6-6 6"/>',
      sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"/>',
      moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>',
      trash: '<path d="M5 7h14M10 7V5h4v2M7 7l1 12h8l1-12"/>',
      plus: '<path d="M12 5v14M5 12h14"/>',
      check: '<path d="M4 12l5 5L20 6"/>',
      pin: '<path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>'
    };
    return '<svg class="ic" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (paths[name] || '') + '</svg>';
  }

  function grid(products, opt) {
    if (!products.length) return empty(opt && opt.emptyKey);
    return '<div class="grid' + (opt && opt.dense ? ' grid--dense' : '') + '">' +
      products.map(function (p) { return card(p, opt); }).join('') + '</div>';
  }

  function rail(title, products, href) {
    if (!products.length) return '';
    return '<section class="rail">' +
      '<div class="rail__head"><h2 class="h2">' + esc(title) + '</h2>' +
      (href ? '<a class="link" href="' + href + '">' + t('ui.seeAll') + ' →</a>' : '') + '</div>' +
      '<div class="rail__track">' + products.map(function (p) { return card(p, { w: 420 }); }).join('') + '</div>' +
      '</section>';
  }

  function empty(key, ctaHref, ctaLabel, hint) {
    return '<div class="empty">' +
      '<p class="empty__title">' + esc(key ? t(key) : t('search.none')) + '</p>' +
      (hint ? '<p class="lede" style="margin:0 auto 18px">' + esc(hint) + '</p>' : '') +
      (ctaHref ? '<a class="btn btn--ghost" href="' + ctaHref + '">' + esc(ctaLabel) + '</a>' : '') +
      '</div>';
  }

  function tagChip(id, active) {
    var tg = D.tagById(id); if (!tg) return '';
    var color = D.TAG_COLORS[id];
    return '<a class="chip' + (active ? ' is-on' : '') + '" href="#/tag/' + tg.slug + '" data-action="tagclick" data-id="' + id + '">' +
      (color ? '<i class="swatch" style="background:' + color + '"></i>' : '') + esc(tc(tg.name)) + '</a>';
  }

  function crumbs(items) {
    return '<nav class="crumbs" aria-label="Breadcrumb">' + items.map(function (i, ix) {
      return (i.href ? '<a href="' + i.href + '">' + esc(i.label) + '</a>' : '<span>' + esc(i.label) + '</span>') +
        (ix < items.length - 1 ? '<span class="crumbs__sep">/</span>' : '');
    }).join('') + '</nav>';
  }

  /* ---------- feedback ------------------------------------------------------ */

  var toastTimer = null;
  function toast(msg, opts) {
    var host = qs('#toasts');
    if (!host) return;
    host.innerHTML = '<div class="toast' + (opts && opts.kind ? ' toast--' + opts.kind : '') + '" role="status">' +
      '<span>' + esc(msg) + '</span>' +
      (opts && opts.href ? '<a class="toast__cta" href="' + opts.href + '">' + esc(opts.cta || t('nav.cart')) + '</a>' : '') + '</div>';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { host.innerHTML = ''; }, opts && opts.ms || 3200);
  }

  var modalCloser = null;
  function modal(opts) {
    var host = qs('#modal');
    host.innerHTML =
      '<div class="modal__scrim" data-action="modal-close"></div>' +
      '<div class="modal__panel" role="dialog" aria-modal="true" aria-label="' + esc(opts.title || '') + '">' +
        '<header class="modal__head"><h2>' + esc(opts.title || '') + '</h2>' +
        '<button class="iconbtn" data-action="modal-close" aria-label="' + t('nav.close') + '">' + icon('close') + '</button></header>' +
        '<div class="modal__body">' + opts.body + '</div>' +
        (opts.footer ? '<footer class="modal__foot">' + opts.footer + '</footer>' : '') +
      '</div>';
    host.hidden = false;
    document.body.classList.add('is-locked');
    hydrateImages(host);
    modalCloser = opts.onClose || null;
    var f = host.querySelector('.modal__panel [autofocus], .modal__panel button, .modal__panel a');
    if (f) f.focus();
  }
  function closeModal() {
    var host = qs('#modal');
    host.hidden = true; host.innerHTML = '';
    document.body.classList.remove('is-locked');
    if (modalCloser) { var f = modalCloser; modalCloser = null; f(); }
  }

  function drawer(id, open) {
    var d = qs('#' + id);
    if (!d) return;
    d.classList.toggle('is-open', open);
    d.hidden = !open;
    document.body.classList.toggle('is-locked', open);
  }

  /* ---------- head / SEO ---------------------------------------------------- */

  function setMeta(o) {
    document.title = o.title;
    setTag('meta[name="description"]', 'content', o.description || '');
    setTag('meta[property="og:title"]', 'content', o.ogTitle || o.title);
    setTag('meta[property="og:description"]', 'content', o.description || '');
    setTag('link[rel="canonical"]', 'href', location.href.split('#')[0] + (o.path || ''));
    var ld = qs('#ld-json');
    if (ld) ld.textContent = o.jsonld ? JSON.stringify(o.jsonld) : '';
  }
  function setTag(sel, attr, val) {
    var n = qs(sel);
    if (n) n.setAttribute(attr, val);
  }
  function productLd(p) {
    var r = D.priceRange(p);
    return {
      '@context': 'https://schema.org', '@type': 'Product',
      name: tc(p.title), sku: p.sku, description: tc(p.description),
      category: tc(D.catById(p.categoryId).name),
      brand: { '@type': 'Brand', name: 'KADR' },
      offers: { '@type': 'AggregateOffer', priceCurrency: 'AMD', lowPrice: r.min, highPrice: r.max, availability: 'https://schema.org/MadeToOrder' }
    };
  }

  /* ---------- misc ---------------------------------------------------------- */

  function estimate(p) {
    var s = S.state.settings.delivery;
    var prod = p && p.productionDays || s.productionDays;
    var zone = s.zones.filter(function (z) { return z.enabled; })[0] || { days: [1, 2] };
    return {
      production: prod, delivery: zone.days,
      total: [prod[0] + zone.days[0], prod[1] + zone.days[1]]
    };
  }
  /* "Delivery from 1 000 ֏" / "Free delivery above …" — from the back office's zones */
  function deliveryNote() {
    var d = S.state.settings.delivery;
    if (!d.enabled && d.pickup) return tc({ en: 'Self-pickup', hy: 'Ինքնաառաքում', ru: 'Самовывоз' });
    var prices = d.zones.map(function (z) { return z.price; });
    if (!prices.length) return t('p.free');
    var min = Math.min.apply(null, prices);
    if (min === 0) return tc({ en: 'Free delivery', hy: 'Անվճար առաքում', ru: 'Бесплатная доставка' });
    var s = tc({ en: 'Delivery from ', hy: 'Առաքում՝ սկսած ', ru: 'Доставка от ' }) + money(min);
    if (d.freeAbove) s += ' · ' + tc({ en: 'free above ', hy: 'անվճար՝ սկսած ', ru: 'бесплатно от ' }) + money(d.freeAbove);
    return s;
  }
  function optionSummary(p, options) {
    var type = D.PRODUCT_TYPES[p.typeId];
    return type.components.map(function (c) {
      var v = D.valueOf(c, options[c]);
      return v ? esc(tc(v.label)) : null;   /* names are free text in the back office */
    }).filter(Boolean).join(' · ');
  }
  function skeleton(n) {
    var out = '';
    for (var i = 0; i < (n || 8); i++) out += '<div class="card card--skel"><div class="skel"></div></div>';
    return '<div class="grid">' + out + '</div>';
  }

  K.ui = {
    esc: esc, qs: qs, qsa: qsa, money: money, card: card, grid: grid, rail: rail,
    artImg: artImg, hydrateImages: hydrateImages, paint: paint, icon: icon, heart: heart,
    empty: empty, tagChip: tagChip, crumbs: crumbs, toast: toast, modal: modal,
    closeModal: closeModal, drawer: drawer, setMeta: setMeta, productLd: productLd,
    priceLabel: priceLabel, estimate: estimate, optionSummary: optionSummary, skeleton: skeleton,
    deliveryNote: deliveryNote
  };
})(window.KADR = window.KADR || {});

/* ============================================================================
   VIEW HELPERS — room scenes and section headers
   ============================================================================ */

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
    if (!list.length) return [];   /* nothing in the catalogue fits this room yet */
    var lay = LAYOUTS[Math.min(6, Math.max(1, list.length))] || LAYOUTS[3];
    return lay.map(function (pos, i) {
      var p = list[i % list.length];
      return {
        x: pos.x, y: pos.y, w: pos.w, h: pos.h, seed: scene.id + p.id,
        palette: p.palette, comp: p.comp,
        frame: (p.optionSets.frame || []).length > 1 ? ['black', 'oak', 'white', 'none'][i % 4] : 'none'
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

/* ============================================================================
   VIEW — home
   ============================================================================ */

/* Home — brand first, catalogue second. Blocks are admin-controlled. */
(function (K) {
  'use strict';
  var D = K.data, S = K.store, U = K.ui, SR = K.search, VH = K.vh;
  var t = function (k, v) { return K.i18n.t(k, v); }, tc = function (o) { return K.i18n.tc(o); };

  function cheapest() {
    var min = S.live().reduce(function (m, p) { return Math.min(m, p.priceFrom); }, Infinity);
    return min === Infinity ? 0 : min;
  }

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
          '<div class="hero__fact"><b class="num">' + U.estimate(null).total.join('–') + '</b><span>' + tc({ en: 'days to your wall', hy: 'օր մինչև պատը', ru: 'дней до стены' }) + '</span></div>' +
          '<div class="hero__fact"><b>' + U.money(cheapest()) + '</b><span>' + tc({ en: 'first wall starts at', hy: 'առաջին պատը՝ սկսած', ru: 'первая стена от' }) + '</span></div>' +
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

/* ============================================================================
   VIEW — explore, shop, search, tag, collection, room scene
   ============================================================================ */

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
    if (!slice.length) return [];
    var items = slice.map(function (p) { return { kind: 'product', p: p }; });
    /* seed inspiration into the feed so discovery is not only products */
    if (D.SCENES[page % D.SCENES.length]) items.splice(4, 0, { kind: 'scene', scene: D.SCENES[page % D.SCENES.length] });
    if (D.SCENES[(page + 3) % D.SCENES.length]) items.splice(17, 0, { kind: 'scene', scene: D.SCENES[(page + 3) % D.SCENES.length] });
    if (page % 2 === 0 && D.COLLECTIONS.length) items.splice(11, 0, { kind: 'collection', col: D.COLLECTIONS[page % D.COLLECTIONS.length] });
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

/* ============================================================================
   VIEW — product page and product builder
   ============================================================================ */

/* Product page + Product Builder.
   Both drive the same option state; the builder is the same engine with the
   steps unrolled. Admin can switch the builder off and the PDP still sells. */
(function (K) {
  'use strict';
  var D = K.data, S = K.store, U = K.ui, SR = K.search, VH = K.vh;
  var t = function (k, v) { return K.i18n.t(k, v); }, tc = function (o) { return K.i18n.tc(o); };
  K.views = K.views || {};

  var sel = {};     /* current option selection */
  var qty = 1;
  var shot = 0;     /* gallery index */

  function gallery(p) {
    /* the back office's photos first; a stylised room view only for products without photos */
    if (D.hasPhoto(p)) {
      var shots = p.images.map(function (im) { return { k: 'product', url: im.medium, framed: true }; });
      shots.push({ k: 'detail', url: p.images[0].medium, detail: true });
      return shots;
    }
    return [
      { k: 'product', url: D.imageFor(p, sel, 900) },
      { k: 'room', url: K.art.sceneUrl({ room: 'bedroom', seed: 'pdp' + p.id, w: 1000, h: 700,
          art: [{ x: .32, y: .14, w: .30, h: .40, seed: p.id, palette: p.palette, comp: p.comp, frame: sel.frame || 'none' }] }) },
      { k: 'detail', url: D.imageFor(p, sel, 1200), detail: true },
      { k: 'scale', url: K.art.sceneUrl({ room: 'office', seed: 'sc' + p.id, w: 1000, h: 700,
          art: [{ x: .20, y: .12, w: .22, h: .30, seed: p.id, palette: p.palette, comp: p.comp, frame: sel.frame || 'none' },
                { x: .48, y: .16, w: .18, h: .25, seed: p.id + 'b', palette: p.palette, comp: p.comp, frame: sel.frame || 'none' }] }) }
    ];
  }

  function optionBlock(p, compact) {
    var type = D.PRODUCT_TYPES[p.typeId];
    var dm = D.disabledMap(p, sel);
    return type.components.map(function (c) {
      var attr = D.ATTRIBUTES[c]; if (!attr) return '';
      var off = dm.disabled[c] || [];
      var current = D.valueOf(c, sel[c]);
      var whyShown = null;
      var vals = attr.values.filter(function (v) { return D.offers(p, c, v.id); }).map(function (v) {
        var isOff = off.indexOf(v.id) >= 0;
        if (isOff && dm.reasons[c + ':' + v.id]) whyShown = dm.reasons[c + ':' + v.id];
        var delta = '';
        if (!isOff && v.id !== sel[c]) {
          var probe = Object.assign({}, sel); probe[c] = v.id;
          var d = D.price(p, D.reconcile(p, probe, c)) - D.price(p, sel);
          if (d) delta = '<em class="add">' + (d > 0 ? '+' : '−') + U.money(Math.abs(d)) + '</em>';
        }
        return '<button class="oval' + (sel[c] === v.id ? ' is-on' : '') + '"' + (isOff ? ' disabled' : '') +
          ' data-action="opt" data-c="' + c + '" data-v="' + v.id + '"' +
          (isOff ? ' title="' + U.esc(tc(dm.reasons[c + ':' + v.id] || {})) + '"' : '') + '>' +
          (v.swatch ? '<i class="swatch" style="background:' + v.swatch + (v.swatch === 'transparent' ? ';border-style:dashed' : '') + '"></i>' : '') +
          U.esc(tc(v.label)) + delta + '</button>';
      }).join('');
      return '<div class="' + (compact ? 'step' : 'opt') + '">' +
        '<div class="' + (compact ? 'step__title' : 'opt__head') + '"><b>' + U.esc(tc(attr.name)) + '</b>' +
        (compact ? '<em>' + U.esc(current ? tc(current.label) : '') + '</em>' : '<span>' + U.esc(current ? tc(current.label) : '') + '</span>') + '</div>' +
        '<div class="opt__list">' + vals + '</div>' +
        (whyShown ? '<p class="mono" style="margin-top:9px;text-transform:none;letter-spacing:0">' + U.esc(tc(whyShown)) + '</p>' : '') +
        '</div>';
    }).join('');
  }

  function priceBlock(p) {
    var est = U.estimate(p);
    return '<div class="pdp__price" id="price">' + U.money(D.price(p, sel)) +
      '<small>' + U.deliveryNote() + ' · ' + t('p.inHands') + ' ' + est.total[0] + '–' + est.total[1] + ' ' + t('p.days') + '</small></div>';
  }

  function facts(p) {
    var est = U.estimate(p);
    return '<div class="facts">' +
      '<div class="fact"><b>' + t('p.sku') + '</b><span class="num" id="sku">' + S.skuFor(p, sel) + '</span></div>' +
      '<div class="fact"><b>' + t('p.madeToOrder') + '</b><span>' + t('p.production') + ' ' + est.production[0] + '–' + est.production[1] + ' ' + t('p.days') + '</span></div>' +
      '<div class="fact"><b>' + t('p.delivery') + '</b><span>' + est.delivery[0] + '–' + est.delivery[1] + ' ' + t('p.days') + ' · ' + U.deliveryNote() + '</span></div>' +
      '<div class="fact"><b>' + t('filter.category') + '</b><span><a class="link" href="#/shop?cat=' + p.categoryId + '">' + U.esc(tc(D.catById(p.categoryId).name)) + '</a></span></div>' +
      '</div>';
  }

  function recommendations(p) {
    var firstTag = p.tags.filter(function (id) { var g = D.tagById(id); return g && (g.group === 'theme' || g.group === 'brand'); })[0];
    var tg = firstTag ? D.tagById(firstTag) : null;
    return '<div class="wrap">' +
      U.rail(t('p.similar'), SR.similar(p, 8)) +
      U.rail(t('p.worksWith'), SR.worksWith(p, 8)) +
      U.rail(t('p.moreStyle'), SR.sameStyle(p, 8)) +
      (tg ? U.rail(t('p.moreTag', { tag: tc(tg.name) }), SR.byTag(tg.id, 8, p.id), '#/tag/' + tg.slug) : '') +
      U.rail(t('p.alsoLike'), SR.alsoLike(p, 8)) +
      '</div>';
  }

  function repaint(root, p) {
    var g = gallery(p);
    var stage = U.qs('#stage', root);
    if (stage) {
      if (shot >= g.length) shot = 0;
      var st = g[shot].detail ? 'transform:scale(1.8);transform-origin:28% 32%' : (g[shot].framed ? D.frameStyle(sel) : '');
      stage.innerHTML = '<img src="' + g[shot].url + '" alt="' + U.esc(tc(p.title)) + '"' + (st ? ' style="' + st + '"' : '') + '>';
    }
    var th = U.qs('#thumbs', root);
    if (th) th.innerHTML = g.map(function (x, i) {
      return '<button class="pdp__thumb' + (i === shot ? ' is-on' : '') + '" data-action="shot" data-i="' + i + '"><img src="' + x.url + '" alt=""></button>';
    }).join('');
    var opts = U.qs('#opts', root);
    if (opts) opts.innerHTML = optionBlock(p, opts.dataset.compact === '1');
    var price = U.qs('#price', root);
    if (price) price.innerHTML = U.money(D.price(p, sel)) + price.querySelector('small').outerHTML;
    var sku = U.qs('#sku', root);
    if (sku) sku.textContent = S.skuFor(p, sel);
    var q = U.qs('#qtyv', root);
    if (q) q.textContent = qty;
    var bp = U.qs('#bprice', root);
    if (bp) bp.textContent = U.money(D.price(p, sel) * qty);
  }

  function bindOptions(root, p) {
    K.app.bind('click', function (e) {
      var b = e.target.closest('[data-action]'); if (!b) return;
      var a = b.dataset.action;
      if (a === 'opt') {
        sel[b.dataset.c] = b.dataset.v;
        sel = D.reconcile(p, sel, b.dataset.c);
        repaint(root, p);
      }
      if (a === 'shot') { shot = parseInt(b.dataset.i, 10); repaint(root, p); }
      if (a === 'zoom') { var st = U.qs('#stage', root); if (st) st.classList.toggle('is-zoom'); }
      if (a === 'qty') { qty = Math.max(1, qty + parseInt(b.dataset.d, 10)); repaint(root, p); }
      if (a === 'buy') {
        if (!D.isAllowed(p, sel)) { sel = D.reconcile(p, sel); repaint(root, p); return; }
        S.addToCart(p.id, Object.assign({}, sel), qty);
        U.toast(t('p.added') + ' · ' + U.money(D.price(p, sel) * qty), { href: '#/cart', cta: t('cart.checkout') });
        qty = 1; repaint(root, p);
      }
      if (a === 'swap') {
        /* builder step 1 — change the artwork without leaving the configurator */
        location.hash = '#/build/' + b.dataset.id;
      }
    });
  }

  /* ---------- product page ------------------------------------------------- */

  K.views.product = {
    render: function (params) {
      var p = S.byId(params.id);
      if (!p) return '<div class="wrap">' + U.empty('err.404', '#/shop', t('err.404cta')) + '</div>';
      sel = Object.assign({}, D.PRODUCT_TYPES[p.typeId].defaults);
      qty = 1; shot = 0;
      S.pushRecent(p.id);
      U.setMeta({
        title: tc(p.title) + ' — KADR', description: tc(p.description).slice(0, 155),
        jsonld: U.productLd(p)
      });
      var builderOn = S.state.settings.features.productBuilder;
      var g = gallery(p);
      return '<div class="wrap">' +
        U.crumbs([{ label: 'KADR', href: '#/' }, { label: tc(D.catById(p.categoryId).name), href: '#/shop?cat=' + p.categoryId }, { label: tc(p.title) }]) +
        '<div class="pdp">' +
        '<div class="pdp__gallery">' +
          '<div class="pdp__stage" id="stage" data-action="zoom"><img src="' + g[0].url + '" alt="' + U.esc(tc(p.title)) + '"></div>' +
          '<div class="pdp__thumbs" id="thumbs"></div>' +
        '</div>' +
        '<div>' +
          '<p class="eyebrow">' + U.esc(tc(D.PRODUCT_TYPES[p.typeId].name)) + ' · ' + t('p.madeToOrder') + '</p>' +
          '<h1 class="h2 pdp__title">' + U.esc(tc(p.title)) + '</h1>' +
          priceBlock(p) +
          '<div class="opts" id="opts" data-compact="0">' + optionBlock(p) + '</div>' +
          (builderOn ? '<a class="link" href="#/build/' + p.id + '">' + t('p.customise') + ' →</a>' :
            '<p class="mono" style="text-transform:none;letter-spacing:0">' + t('p.builderOff') + '</p>') +
          '<div class="buybar">' +
            '<span class="qty"><button data-action="qty" data-d="-1" aria-label="−">−</button><span id="qtyv">1</span><button data-action="qty" data-d="1" aria-label="+">+</button></span>' +
            '<button class="btn btn--oxide" style="flex:1" data-action="buy">' + t('p.addToCart') + ' · <b id="bprice">' + U.money(D.price(p, sel)) + '</b></button>' +
            '<button class="iconbtn" data-action="fav" data-id="' + p.id + '" aria-label="' + t('p.fav') + '" style="border:1px solid var(--line);border-radius:100px;width:48px">' + U.heart() + '</button>' +
          '</div>' +
          '<p style="color:var(--ink-2);font-size:14px">' + U.esc(tc(p.description)) + '</p>' +
          facts(p) +
          '<div class="chips" style="margin-top:22px">' + p.tags.slice(0, 8).map(function (id) { return U.tagChip(id); }).join('') + '</div>' +
        '</div></div></div>' + recommendations(p);
    },
    mount: function (root, params) {
      var p = S.byId(params.id); if (!p) return;
      repaint(root, p);
      bindOptions(root, p);
      U.hydrateImages(root);
    }
  };

  /* ---------- builder ------------------------------------------------------- */

  K.views.builder = {
    render: function (params) {
      var p = S.byId(params.id);
      if (!p) return '<div class="wrap">' + U.empty('err.404', '#/shop', t('err.404cta')) + '</div>';
      if (!S.state.settings.features.productBuilder) { location.hash = '#/p/' + p.id; return ''; }
      sel = Object.assign({}, D.PRODUCT_TYPES[p.typeId].defaults);
      qty = 1;
      U.setMeta({ title: t('p.customise') + ' — ' + tc(p.title), description: 'Configure your print.' });
      var swaps = SR.similar(p, 7);
      return '<div class="wrap">' +
        U.crumbs([{ label: 'KADR', href: '#/' }, { label: tc(p.title), href: '#/p/' + p.id }, { label: t('p.customise') }]) +
        '<div class="builder">' +
        '<div class="builder__preview"><img id="bimg" src="' + D.imageFor(p, sel, 700) + '" alt="" style="' + D.frameStyle(sel) + '"></div>' +
        '<div>' +
          '<p class="eyebrow">' + t('p.customise') + '</p>' +
          '<h1 class="h2" style="margin:14px 0 6px">' + U.esc(tc(p.title)) + '</h1>' +
          '<p class="lede" style="font-size:15px">' + tc({ en: 'Every step updates the preview and the price. Options that cannot be produced together switch themselves off.',
            hy: 'Յուրաքանչյուր քայլ թարմացնում է նախադիտումն ու գինը։', ru: 'Каждый шаг обновляет превью и цену.' }) + '</p>' +
          '<div class="steps">' +
            '<div class="step"><div class="step__title"><b>' + tc({ en: 'Artwork', hy: 'Գործ', ru: 'Работа' }) + '</b><em>' + U.esc(tc(p.title)) + '</em></div>' +
            '<div class="rail__track" style="grid-auto-columns:86px">' +
              swaps.map(function (o) { return '<button class="pdp__thumb" style="width:86px" data-action="swap" data-id="' + o.id + '">' + U.artImg(o, null, 180) + '</button>'; }).join('') +
            '</div></div>' +
            '<div id="opts" data-compact="1">' + optionBlock(p, true) + '</div>' +
          '</div>' +
          '<div class="summary" style="position:static;margin-top:26px">' +
            '<div class="srow"><span>' + t('p.sku') + '</span><span class="num" id="sku">' + S.skuFor(p, sel) + '</span></div>' +
            '<div class="srow srow--total"><span>' + t('cart.total') + '</span><span class="num" id="bprice">' + U.money(D.price(p, sel)) + '</span></div>' +
            '<div class="buybar" style="margin-bottom:0">' +
              '<span class="qty"><button data-action="qty" data-d="-1">−</button><span id="qtyv">1</span><button data-action="qty" data-d="1">+</button></span>' +
              '<button class="btn btn--oxide" style="flex:1" data-action="buy">' + t('p.addToCart') + '</button>' +
            '</div>' +
          '</div>' +
        '</div></div></div>';
    },
    mount: function (root, params) {
      var p = S.byId(params.id); if (!p) return;
      bindOptions(root, p);
      K.app.bind('click', function () {
        var img = U.qs('#bimg', root);
        if (img) { img.src = D.imageFor(p, sel, 700); img.setAttribute('style', D.frameStyle(sel)); }
      });
      U.hydrateImages(root);
    }
  };
})(window.KADR = window.KADR || {});

/* ============================================================================
   VIEW — complete your room
   ============================================================================ */

/* Complete your room — a lightweight composition tool, not a recommender.
   Empty wall, a library, drag/resize, then one reviewed add-to-cart. */
(function (K) {
  'use strict';
  var D = K.data, S = K.store, U = K.ui, SR = K.search, VH = K.vh;
  var t = function (k, v) { return K.i18n.t(k, v); }, tc = function (o) { return K.i18n.tc(o); };
  K.views = K.views || {};

  var WALLS = [
    { id: 'bedroom', label: { en: 'Bedroom', hy: 'Ննջասենյակ', ru: 'Спальня' } },
    { id: 'living', label: { en: 'Living room', hy: 'Հյուրասենյակ', ru: 'Гостиная' } },
    { id: 'gaming', label: { en: 'Gaming', hy: 'Գեյմինգ', ru: 'Игровая' } },
    { id: 'office', label: { en: 'Office', hy: 'Գրասենյակ', ru: 'Офис' } },
    { id: 'dorm', label: { en: 'Dorm', hy: 'Հանրակացարան', ru: 'Общежитие' } },
    { id: 'cafe', label: { en: 'Café', hy: 'Սրճարան', ru: 'Кафе' } }
  ];

  var wall = null;   /* { room, items:[{pid,x,y,w,frame}] } */
  var selected = -1;

  function ensureWall() {
    wall = S.state.wall || { room: 'bedroom', items: [] };
    if (!wall.items) wall.items = [];
  }
  function persist() { S.setWall(wall); }

  function libraryProducts() {
    var favs = S.state.favorites.map(S.byId).filter(Boolean);
    var recent = S.state.recent.map(S.byId).filter(Boolean);
    var feed = SR.feed(0).slice(0, 24);
    var seen = {}, out = [];
    favs.concat(recent, feed).forEach(function (p) { if (p && !seen[p.id]) { seen[p.id] = 1; out.push(p); } });
    return out.slice(0, 30);
  }

  /* the configuration a wall item is bought in: product defaults + the frame chosen on the wall */
  function itemOpts(p, it) {
    var o = D.defaultsFor(p);
    if (it.frame && D.offers(p, 'frame', it.frame)) o.frame = it.frame;
    return D.reconcile(p, o, 'frame');
  }

  function itemHtml(it, i) {
    var p = S.byId(it.pid); if (!p) return '';
    var opts = itemOpts(p, it);
    var ratio = D.optionRatio(p, opts);
    return '<div class="witem' + (i === selected ? ' is-sel' : '') + '" data-i="' + i + '" style="left:' + it.x + '%;top:' + it.y + '%;width:' + it.w + '%;aspect-ratio:' + ratio.toFixed(3) + '">' +
      '<img src="' + D.imageFor(p, opts, 300) + '" alt="' + U.esc(tc(p.title)) + '" draggable="false" style="width:100%;height:100%;object-fit:cover;' + D.frameStyle(opts) + '">' +
      (i === selected ? '<button class="witem__x" data-action="w-del" data-i="' + i + '" aria-label="' + t('ui.delete') + '">✕</button><span class="witem__h" data-action="w-resize" data-i="' + i + '"></span>' : '') +
      '</div>';
  }

  function wallTotal() {
    return wall.items.reduce(function (n, it) {
      var p = S.byId(it.pid); if (!p) return n;
      return n + D.price(p, itemOpts(p, it));
    }, 0);
  }

  K.views.composer = {
    render: function () {
      ensureWall();
      selected = -1;
      U.setMeta({ title: t('room.title') + ' — KADR', description: 'Compose your wall before you buy.' });
      var lib = libraryProducts();
      return '<div class="wrap">' + VH.pageHead(t('room.title'), t('nav.builder')) +
        '<p class="lede" style="margin:-18px 0 24px">' + t('room.sub') + '</p>' +
        '<div class="composer">' +
        '<div><div class="wall" id="wall">' +
          '<img class="bg" src="' + K.art.sceneUrl({ room: wall.room, seed: 'composer-' + wall.room, w: 1200, h: 750, art: [] }) + '" alt="">' +
          wall.items.map(itemHtml).join('') +
        '</div>' +
        '<div class="pillrow" style="margin-top:14px;justify-content:space-between">' +
          '<span class="mono">' + t('room.hint') + '</span>' +
          '<span class="pillrow"><button class="chip" data-action="w-clear">' + t('room.clear') + '</button>' +
          '<button class="btn btn--sm btn--oxide" data-action="w-review" id="wcta"' + (wall.items.length ? '' : ' disabled') + '>' +
          t('room.addAll') + ' · <b id="wtotal">' + U.money(wallTotal()) + '</b></button></span>' +
        '</div></div>' +
        '<aside>' +
          '<p class="mono">' + t('room.pick') + '</p>' +
          '<div class="chips" style="margin:10px 0 20px">' + WALLS.map(function (w) {
            return '<button class="chip' + (wall.room === w.id ? ' is-on' : '') + '" data-action="w-room" data-k="' + w.id + '">' + U.esc(tc(w.label)) + '</button>';
          }).join('') + '</div>' +
          '<p class="mono">' + t('room.library') + '</p>' +
          '<div class="libbar" style="margin-top:10px">' + lib.map(function (p) {
            return '<img src="' + D.imageFor(p, null, 160) + '" alt="' + U.esc(tc(p.title)) + '" title="' + U.esc(tc(p.title)) + '" data-action="w-add" data-id="' + p.id + '" loading="lazy">';
          }).join('') + '</div>' +
          (wall.items.length ? '' : '<p class="mono" style="margin-top:16px;text-transform:none;letter-spacing:0">' + t('room.emptyWall') + '</p>') +
        '</aside></div></div>';
    },
    mount: function (root) {
      ensureWall();
      var wallEl = U.qs('#wall', root);
      if (!wallEl) return;

      function redraw() {
        U.qsa('.witem', wallEl).forEach(function (n) { n.remove(); });
        wallEl.insertAdjacentHTML('beforeend', wall.items.map(itemHtml).join(''));
        var cta = U.qs('#wcta', root);
        cta.disabled = !wall.items.length;
        U.qs('#wtotal', root).textContent = U.money(wallTotal());
        persist();
      }

      /* drag + resize with pointer events (works with touch and mouse alike) */
      var drag = null;
      wallEl.addEventListener('pointerdown', function (e) {
        var handle = e.target.closest('[data-action="w-resize"]');
        var item = e.target.closest('.witem');
        if (!item) { selected = -1; redraw(); return; }
        var i = parseInt(item.dataset.i, 10);
        selected = i; redraw();
        var node = U.qsa('.witem', wallEl)[i];
        var r = wallEl.getBoundingClientRect();
        drag = {
          i: i, mode: handle ? 'resize' : 'move', node: node,
          sx: e.clientX, sy: e.clientY,
          ox: wall.items[i].x, oy: wall.items[i].y, ow: wall.items[i].w,
          rw: r.width, rh: r.height
        };
        wallEl.setPointerCapture(e.pointerId);
        e.preventDefault();
      });
      wallEl.addEventListener('pointermove', function (e) {
        if (!drag) return;
        var dx = (e.clientX - drag.sx) / drag.rw * 100;
        var dy = (e.clientY - drag.sy) / drag.rh * 100;
        var it = wall.items[drag.i];
        if (drag.mode === 'move') {
          it.x = Math.max(-5, Math.min(95, drag.ox + dx));
          it.y = Math.max(-5, Math.min(85, drag.oy + dy));
          drag.node.style.left = it.x + '%'; drag.node.style.top = it.y + '%';
        } else {
          it.w = Math.max(6, Math.min(48, drag.ow + dx));
          drag.node.style.width = it.w + '%';
        }
      });
      wallEl.addEventListener('pointerup', function () { if (drag) { drag = null; persist(); } });
      wallEl.addEventListener('dblclick', function (e) {
        var item = e.target.closest('.witem'); if (!item) return;
        wall.items.splice(parseInt(item.dataset.i, 10), 1);
        selected = -1; redraw();
      });

      K.app.bind('click', function (e) {
        var b = e.target.closest('[data-action]'); if (!b) return;
        var a = b.dataset.action;
        if (a === 'w-add') {
          var p = S.byId(b.dataset.id);
          var frames = p.optionSets.frame && p.optionSets.frame.length ? p.optionSets.frame : [null];
          wall.items.push({ pid: p.id, x: 20 + (wall.items.length * 9) % 50, y: 14 + (wall.items.length * 7) % 26, w: 16, frame: frames[wall.items.length % frames.length] });
          selected = wall.items.length - 1;
          S.track('view', { productId: p.id });
          redraw();
        }
        if (a === 'w-del') { wall.items.splice(parseInt(b.dataset.i, 10), 1); selected = -1; redraw(); }
        if (a === 'w-clear') { wall.items = []; selected = -1; redraw(); }
        if (a === 'w-room') { wall.room = b.dataset.k; persist(); K.app.rerender(); }
        if (a === 'w-review') {
          var rows = wall.items.map(function (it, i) {
            var p = S.byId(it.pid);
            var opts = itemOpts(p, it);
            var price = D.price(p, opts);
            return '<div class="line">' + U.artImg(p, opts, 160) +
              '<div><b>' + U.esc(tc(p.title)) + '</b><div class="line__opts">' + U.optionSummary(p, opts) + '</div>' +
              '<div class="line__sku">' + S.skuFor(p, opts) + '</div></div>' +
              '<div class="num">' + U.money(price) + '</div></div>';
          }).join('');
          U.modal({
            title: t('scene.review'),
            body: rows + '<div class="srow srow--total"><span>' + t('cart.total') + '</span><span class="num">' + U.money(wallTotal()) + '</span></div>',
            footer: '<button class="btn btn--ghost" data-action="modal-close">' + t('ui.cancel') + '</button>' +
              '<button class="btn btn--oxide" data-action="w-confirm">' + t('scene.addAll', { n: wall.items.length, total: U.money(wallTotal()) }) + '</button>'
          });
        }
        if (a === 'w-confirm') {
          wall.items.forEach(function (it) {
            var p = S.byId(it.pid);
            var opts = itemOpts(p, it);
            S.addToCart(p.id, opts, 1);
          });
          U.closeModal();
          U.toast(t('p.added'), { href: '#/cart', cta: t('cart.checkout') });
        }
      });
    }
  };
})(window.KADR = window.KADR || {});

/* ============================================================================
   VIEW — cart, checkout, order
   ============================================================================ */

/* Cart, checkout and order confirmation.
   Deliberately slow at the last step: nothing is bought without a full review.
   The order is created in the back office; prices are re-checked there and a
   changed price is shown to the customer, never charged silently. */
(function (K) {
  'use strict';
  var D = K.data, S = K.store, U = K.ui;
  var t = function (k, v) { return K.i18n.t(k, v); }, tc = function (o) { return K.i18n.tc(o); };
  K.views = K.views || {};

  /* ---------- cart ---------------------------------------------------------- */

  function lineRow(l, readOnly) {
    var p = S.byId(l.productId);
    if (!p || !S.lineValid(l)) {
      return '<div class="line"><div></div><div><b>' + U.esc(p ? tc(p.title) : (l.title ? tc(l.title) : l.productId)) + '</b>' +
        '<div class="note" style="margin-top:8px">' + tc({ en: 'No longer available in this configuration.', hy: 'Այս տարբերակով այլևս հասանելի չէ։', ru: 'Больше не доступно в этой конфигурации.' }) + '</div>' +
        (readOnly ? '' : '<button class="chip" style="margin-top:10px" data-action="line-remove" data-k="' + l.key + '">' + t('cart.remove') + '</button>') +
        '</div><div></div></div>';
    }
    return '<div class="line">' +
      '<a href="#/p/' + p.id + '">' + U.artImg(p, l.options, 220) + '</a>' +
      '<div><a class="card__title" href="#/p/' + p.id + '">' + U.esc(tc(p.title)) + '</a>' +
        '<div class="line__opts">' + U.optionSummary(p, l.options) + '</div>' +
        '<div class="line__sku">' + S.skuFor(p, l.options) + '</div>' +
        (readOnly ? '<div class="line__sku">× ' + l.qty + '</div>' :
        '<div class="pillrow" style="margin-top:10px">' +
          '<span class="qty"><button data-action="line-qty" data-k="' + l.key + '" data-d="-1">−</button>' +
          '<span>' + l.qty + '</span><button data-action="line-qty" data-k="' + l.key + '" data-d="1">+</button></span>' +
          '<button class="chip" data-action="line-remove" data-k="' + l.key + '">' + t('cart.remove') + '</button>' +
        '</div>') + '</div>' +
      '<div style="text-align:right"><b class="num">' + U.money(S.linePrice(l)) + '</b>' +
      (l.qty > 1 ? '<div class="mono">' + U.money(S.linePrice(l) / l.qty) + ' ' + t('cart.each') + '</div>' : '') + '</div>' +
      '</div>';
  }

  /* "It was X, it is now Y" — shown once, then the new price is accepted */
  function priceNotice() {
    var ch = S.priceChanges();
    if (!ch.length) return '';
    var html = '<div class="note" role="status" style="margin-bottom:18px"><b>' +
      tc({ en: 'Prices changed since you added these:', hy: 'Գները փոխվել են ավելացնելուց հետո՝', ru: 'Цены изменились с момента добавления:' }) + '</b><br>' +
      ch.map(function (c) {
        var p = S.byId(c.line.productId);
        return U.esc(tc(p.title)) + ' — ' + tc({ en: 'was', hy: 'էր', ru: 'было' }) + ' ' + U.money(c.was) + ', ' +
          tc({ en: 'now', hy: 'հիմա', ru: 'стало' }) + ' ' + U.money(c.now);
      }).join('<br>') + '</div>';
    S.ackPrices();
    return html;
  }

  function deliveryCost() {
    var d = S.state.settings.delivery;
    if (!co || co.delivery !== 'courier') return 0;
    var z = d.zones.filter(function (x) { return x.id === co.address.zone; })[0];
    if (!z) return null;
    if (d.freeAbove && S.cartTotal() >= d.freeAbove) return 0;
    return z.price;
  }

  function summary(showCta) {
    var total = S.cartTotal();
    var dc = showCta ? null : deliveryCost();
    var delivRow = dc == null ? U.deliveryNote() : (dc === 0 ? tc({ en: 'Free', hy: 'Անվճար', ru: 'Бесплатно' }) : U.money(dc));
    return '<div class="summary">' +
      '<div class="srow"><span>' + t('cart.subtotal') + '</span><span class="num">' + U.money(total) + '</span></div>' +
      '<div class="srow"><span>' + t('cart.delivery') + '</span><span>' + U.esc(delivRow) + '</span></div>' +
      '<div class="srow srow--total"><span>' + t('cart.total') + '</span><span class="num">' + U.money(total + (dc || 0)) + '</span></div>' +
      (showCta ? '<a class="btn btn--oxide btn--full" style="margin-top:16px" href="#/checkout">' + t('cart.checkout') + '</a>' +
        '<a class="btn btn--ghost btn--full" style="margin-top:9px" href="#/shop">' + t('cart.continue') + '</a>' : '') +
      '<p class="mono" style="margin-top:14px;text-transform:none;letter-spacing:0">' + t('p.madeToOrder') + ' · ' +
        tc({ en: 'charged in AMD', hy: 'վճարումը՝ դրամով', ru: 'оплата в драмах' }) + '</p>' +
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
        priceNotice() +
        '<div class="cart"><div id="lines">' + S.state.cart.map(function (l) { return lineRow(l); }).join('') + '</div>' + summary(true) + '</div></div>';
    },
    mount: function () {
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
  var placing = false;
  var EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

  function newRef() {
    var a = new Uint8Array(12);
    (window.crypto || window.msCrypto).getRandomValues(a);
    return Array.prototype.map.call(a, function (b) { return ('0' + b.toString(16)).slice(-2); }).join('');
  }

  function freshCo() {
    var a = S.state.addresses[0];
    var zones = S.state.settings.delivery.zones;
    var address = a ? Object.assign({}, a) : { label: '', city: 'Yerevan', street: '', building: '', entrance: '', floor: '', apartment: '', intercom: '', elevator: true, courier: '', zone: '' };
    /* a saved address may name a zone the back office has since removed */
    if (!zones.some(function (z) { return z.id === address.zone; })) address.zone = '';
    return {
      ref: newRef(),   /* one per checkout: a resend after a timeout can never create a second order */
      step: 0,
      customer: { name: (S.state.user && S.state.user.name) || '', email: (S.state.user && S.state.user.email) || '', phone: '' },
      address: address,
      delivery: S.state.settings.delivery.enabled ? 'courier' : 'pickup',
      slot: null, day: null, payment: null, saveAs: '', consent: false, error: ''
    };
  }

  var STREETS = ['Abovyan', 'Saryan', 'Mashtots ave.', 'Tumanyan', 'Pushkin', 'Amiryan', 'Baghramyan ave.', 'Komitas ave.',
    'Nalbandyan', 'Teryan', 'Isahakyan', 'Koghbatsi', 'Arshakunyats ave.', 'Halabyan', 'Vardanants'];

  function stepNav() {
    var labels = ['co.step.address', 'co.step.delivery', 'co.step.payment', 'co.step.review'];
    return '<div class="steps-nav">' + labels.map(function (k, i) {
      return '<i class="' + (i === co.step ? 'is-on' : (i < co.step ? 'is-done' : '')) + '">' + (i + 1) + ' · ' + t(k) + '</i>';
    }).join('') + '</div>';
  }

  function stepAddress() {
    var saved = S.state.addresses;
    var courier = co.delivery === 'courier';
    return '<h2 class="h3" style="margin-bottom:18px">' + t('co.step.address') + '</h2>' +
      (saved.length ? '<p class="mono">' + t('co.saved') + '</p><div class="chips" style="margin:8px 0 22px">' +
        saved.map(function (a) { return '<button class="chip" data-action="use-addr" data-l="' + U.esc(a.label) + '">' + U.esc(a.label) + ' — ' + U.esc(a.street) + '</button>'; }).join('') + '</div>' : '') +
      '<label class="field"><span>' + t('co.name') + ' *</span><input id="cname" value="' + U.esc(co.customer.name) + '" autocomplete="name" required></label>' +
      '<label class="field field--half"><span>' + t('co.email') + ' *</span><input id="cemail" type="email" value="' + U.esc(co.customer.email) + '" autocomplete="email" required></label>' +
      '<label class="field field--half"><span>' + t('co.phone') + ' *</span><input id="cphone" type="tel" placeholder="+374 …" value="' + U.esc(co.customer.phone) + '" autocomplete="tel" required></label>' +
      '<p class="mono" style="text-transform:none;letter-spacing:0;margin:-4px 0 16px">' +
        tc({ en: 'Every status change of your order is sent to this email.', hy: 'Պատվերի կարգավիճակի յուրաքանչյուր փոփոխություն կուղարկվի այս էլ. հասցեին։', ru: 'О каждом изменении статуса заказа мы напишем на эту почту.' }) + '</p>' +
      (courier ?
      '<div style="margin-top:6px">' +
        '<label class="field"><span>' + tc({ en: 'City', hy: 'Քաղաք', ru: 'Город' }) + '</span><input id="acity" value="' + U.esc(co.address.city || '') + '"></label>' +
        '<label class="field"><span>' + tc({ en: 'Street', hy: 'Փողոց', ru: 'Улица' }) + ' *</span><input id="astreet" list="streets" value="' + U.esc(co.address.street) + '" autocomplete="address-line1"></label>' +
        '<datalist id="streets">' + STREETS.map(function (s) { return '<option value="' + s + '">'; }).join('') + '</datalist>' +
        '<label class="field field--half"><span>' + t('co.building') + '</span><input id="abuilding" value="' + U.esc(co.address.building) + '"></label>' +
        '<label class="field field--half"><span>' + t('co.entrance') + '</span><input id="aentrance" value="' + U.esc(co.address.entrance) + '"></label>' +
        '<label class="field field--half"><span>' + t('co.floor') + '</span><input id="afloor" value="' + U.esc(co.address.floor) + '"></label>' +
        '<label class="field field--half"><span>' + t('co.apartment') + '</span><input id="aapt" value="' + U.esc(co.address.apartment) + '"></label>' +
        '<label class="field field--half"><span>' + t('co.intercom') + '</span><input id="aintercom" value="' + U.esc(co.address.intercom) + '"></label>' +
        '<label class="field field--half"><span>' + t('co.saveAddress') + '</span><input id="asave" placeholder="Home / Work" value="' + U.esc(co.saveAs) + '"></label>' +
        '<label class="fopt"><input type="checkbox" id="aelev"' + (co.address.elevator ? ' checked' : '') + '> ' + t('co.elevator') + '</label>' +
        '<label class="field"><span>' + t('co.courier') + '</span><textarea id="acourier" rows="2">' + U.esc(co.address.courier) + '</textarea></label>' +
      '</div>' : '') +
      '<label class="fopt" style="margin-top:12px"><input type="checkbox" id="cconsent"' + (co.consent ? ' checked' : '') + '> ' +
        tc({ en: 'You may contact me if I do not finish this purchase.', hy: 'Կարող եք կապվել ինձ հետ, եթե չավարտեմ գնումը։', ru: 'Можно связаться со мной, если я не завершу покупку.' }) + '</label>';
  }

  function stepDelivery() {
    var d = S.state.settings.delivery;
    var days = [];
    var first = (d.productionDays[1] || 3) + 1;   /* nothing can arrive before it is made */
    for (var i = first; i < first + 5; i++) {
      var dt = new Date(Date.now() + i * 86400000);
      days.push({ k: dt.toISOString().slice(0, 10), label: dt.toLocaleDateString(K.i18n.lang === 'ru' ? 'ru-RU' : (K.i18n.lang === 'hy' ? 'hy-AM' : 'en-GB'), { weekday: 'short', day: 'numeric', month: 'short' }) });
    }
    var methods = '';
    if (d.enabled && d.pickup) {
      methods = '<div class="fgroup"><div class="fgroup__title">' + tc({ en: 'How to receive it', hy: 'Ինչպես ստանալ', ru: 'Как получить' }) + '</div>' +
        '<label class="fopt"><input type="radio" name="dmethod" value="courier"' + (co.delivery === 'courier' ? ' checked' : '') + '>' + tc({ en: 'Courier', hy: 'Առաքիչ', ru: 'Курьер' }) + '</label>' +
        '<label class="fopt"><input type="radio" name="dmethod" value="pickup"' + (co.delivery === 'pickup' ? ' checked' : '') + '>' + tc({ en: 'Self-pickup', hy: 'Ինքնաառաքում', ru: 'Самовывоз' }) +
        (d.pickupAddress ? '<em class="n">' + U.esc(d.pickupAddress) + '</em>' : '') + '</label></div>';
    }
    var zones = co.delivery === 'courier' ?
      '<div class="fgroup"><div class="fgroup__title">' + tc({ en: 'Zone', hy: 'Գոտի', ru: 'Зона' }) + '</div>' +
        d.zones.map(function (z) {
          var free = d.freeAbove && S.cartTotal() >= d.freeAbove;
          return '<label class="fopt"><input type="radio" name="zone" value="' + z.id + '"' + (co.address.zone === z.id ? ' checked' : '') + '>' +
            U.esc(tc(z.name)) + '<em class="n">' + (free ? tc({ en: 'free', hy: 'անվճար', ru: 'бесплатно' }) : U.money(z.price)) + ' · ' + z.days[0] + '–' + z.days[1] + ' ' + t('p.days') + '</em></label>';
        }).join('') + '</div>' : '';
    return '<h2 class="h3" style="margin-bottom:18px">' + t('co.step.delivery') + '</h2>' + methods + zones +
      (co.delivery === 'courier' && S.state.settings.features.deliverySlots ?
        '<div style="margin-top:22px"><p class="mono">' + t('co.slot') + '</p>' +
        '<div class="chips" style="margin:10px 0 14px">' + days.map(function (x) {
          return '<button class="chip' + (co.day === x.k ? ' is-on' : '') + '" data-action="co-day" data-k="' + x.k + '">' + x.label + '</button>';
        }).join('') + '</div>' +
        '<div class="slots">' + d.slots.map(function (sl) {
          return '<button class="slot' + (co.slot === sl ? ' is-on' : '') + '" data-action="co-slot" data-k="' + U.esc(sl) + '"><b>' + sl + '</b></button>';
        }).join('') + '</div></div>'
        : (co.delivery === 'courier' ? '<p class="note">' + t('co.slotAny') + '</p>' : '')) +
      '<div class="note">' + t('p.madeToOrder') + ' — ' + t('p.production') + ' ' + d.productionDays.join('–') + ' ' + t('p.days') + '.</div>';
  }

  var PAY_ONLINE = { en: 'Card payment online', hy: 'Քարտով վճարում առցանց', ru: 'Оплата картой онлайн' };
  var PAY_ONLINE_BODY = { en: 'Place the order and we send a secure payment link to your email. Production starts once it is paid.',
    hy: 'Ձևակերպեք պատվերը, և մենք ձեր էլ. հասցեին կուղարկենք վճարման անվտանգ հղում։ Արտադրությունը սկսվում է վճարումից հետո։',
    ru: 'Оформите заказ — мы пришлём на почту защищённую ссылку для оплаты. Производство начнётся после оплаты.' };

  function stepPayment() {
    var c = S.state.settings.contact;
    var online = S.paymentOn();
    return '<h2 class="h3" style="margin-bottom:18px">' + t('co.step.payment') + '</h2>' +
      '<div class="panel" style="border-color:var(--oxide)">' +
      (online ? '<h3 class="h3">' + tc(PAY_ONLINE) + '</h3><p style="color:var(--ink-2)">' + tc(PAY_ONLINE_BODY) + '</p>'
        : '<h3 class="h3">' + t('co.payOff') + '</h3><p style="color:var(--ink-2)">' + t('co.payOffBody') + '</p>') +
      '<div class="contactrow">' +
        (c.instagram ? '<a class="btn btn--sm" href="https://instagram.com/' + encodeURIComponent(String(c.instagram).replace(/^@/, '')) + '" target="_blank" rel="noopener">Instagram ' + U.esc(c.instagram) + '</a>' : '') +
        (c.whatsapp ? '<a class="btn btn--sm btn--ghost" href="https://wa.me/' + String(c.whatsapp).replace(/\D/g, '') + '" target="_blank" rel="noopener">WhatsApp ' + U.esc(c.whatsapp) + '</a>' : '') +
        (c.email ? '<a class="btn btn--sm btn--ghost" href="mailto:' + U.esc(c.email) + '">' + U.esc(c.email) + '</a>' : '') +
      '</div></div>';
  }

  function stepReview() {
    var addr = co.address;
    var dc = deliveryCost();
    var where = co.delivery === 'pickup' ? tc({ en: 'Self-pickup', hy: 'Ինքնաառաքում', ru: 'Самовывоз' }) :
      [addr.city, addr.street, addr.building, addr.apartment && ('#' + addr.apartment)].filter(Boolean).join(', ');
    return '<h2 class="h3" style="margin-bottom:18px">' + t('co.step.review') + '</h2>' +
      S.state.cart.map(function (l) { return lineRow(l, true); }).join('') +
      '<div class="panel" style="margin-top:20px">' +
        '<div class="srow"><span>' + t('co.name') + '</span><b>' + U.esc(co.customer.name || '—') + '</b></div>' +
        '<div class="srow"><span>' + t('co.email') + '</span><b>' + U.esc(co.customer.email || '—') + '</b></div>' +
        '<div class="srow"><span>' + t('co.phone') + '</span><b>' + U.esc(co.customer.phone || '—') + '</b></div>' +
        '<div class="srow"><span>' + t('co.step.address') + '</span><b style="text-align:right">' + U.esc(where || '—') + '</b></div>' +
        (co.delivery === 'courier' ? '<div class="srow"><span>' + t('co.slot') + '</span><b>' + U.esc(co.slot ? [co.day, co.slot].filter(Boolean).join(' ') : t('co.slotAny')) + '</b></div>' : '') +
        '<div class="srow"><span>' + t('cart.delivery') + '</span><b>' + (dc === null ? tc({ en: 'choose a zone', hy: 'ընտրեք գոտին', ru: 'выберите зону' }) : (dc ? U.money(dc) : tc({ en: 'Free', hy: 'Անվճար', ru: 'Бесплатно' }))) + '</b></div>' +
        '<div class="srow"><span>' + t('co.step.payment') + '</span><b>' + (S.paymentOn() ? tc(PAY_ONLINE) : t('co.payManual')) + '</b></div>' +
        '<div class="srow srow--total"><span>' + t('cart.total') + '</span><span class="num">' + U.money(S.cartTotal() + (dc || 0)) + '</span></div>' +
      '</div>' +
      (co.error ? '<div class="note" role="alert" style="margin-top:16px;border-color:var(--oxide)">' + U.esc(co.error) + '</div>' : '') +
      '<button class="btn btn--oxide btn--full" style="margin-top:18px" data-action="co-place"' + (placing ? ' disabled' : '') + '>' +
        (placing ? tc({ en: 'Sending…', hy: 'Ուղարկվում է…', ru: 'Отправляем…' }) : t('co.sendOrder') + ' · ' + U.money(S.cartTotal() + (dc || 0))) + '</button>' +
      '<p class="mono" style="margin-top:12px;text-transform:none;letter-spacing:0">' +
        (S.paymentOn() ? tc(PAY_ONLINE_BODY) : tc({ en: 'Nothing is charged now: you pay by transfer after you see the bank details.', hy: 'Հիմա ոչինչ չի գանձվում. վճարում եք փոխանցումով՝ տեսնելով տվյալները։', ru: 'Сейчас ничего не списывается: вы оплачиваете переводом, увидев реквизиты.' })) + '</p>';
  }

  /* Someone who reached checkout and left — recorded for the owners, with consent noted (File 2). */
  var attemptSent = false;
  function reportAttempt() {
    if (attemptSent || !co || !S.state.cart.length) return;
    var email = co.customer.email, phone = co.customer.phone;
    if (!email && !phone) return;
    attemptSent = true;
    var body = JSON.stringify({
      name: co.customer.name, email: email, phone: phone, language: K.i18n.lang, consent_contact: !!co.consent,
      lines: S.state.cart.filter(S.lineValid).map(function (l) {
        return { code: l.productId, size: l.options.size, material: l.options.material, frame: l.options.frame, glass: l.options.glass, qty: l.qty };
      })
    });
    try {
      if (navigator.sendBeacon) navigator.sendBeacon(K.api.base + '/checkout-attempts', new Blob([body], { type: 'application/json' }));
      else K.api.post('/checkout-attempts', JSON.parse(body)).catch(function () {});
    } catch (e) { /* best effort */ }
  }
  window.addEventListener('pagehide', reportAttempt);

  function validate(step) {
    if (step === 0) {
      if (!co.customer.name || !co.customer.phone) return tc({ en: 'Name and phone, please.', hy: 'Անուն և հեռախոս։', ru: 'Имя и телефон, пожалуйста.' });
      if (!EMAIL.test(co.customer.email || '')) return tc({ en: 'A valid email, please — order updates go there.', hy: 'Գրեք ճիշտ էլ. հասցե։', ru: 'Укажите корректный email — туда приходят статусы заказа.' });
      if (co.delivery === 'courier' && !co.address.street) return tc({ en: 'The street, please.', hy: 'Նշեք փողոցը։', ru: 'Укажите улицу.' });
    }
    if (step === 1 && co.delivery === 'courier' && deliveryCost() === null) return tc({ en: 'Choose a delivery zone.', hy: 'Ընտրեք առաքման գոտին։', ru: 'Выберите зону доставки.' });
    return '';
  }

  function failure(err) {
    if (err && err.code === 'price_changed') {
      return tc({ en: 'Prices changed a moment ago. The cart now shows the new prices — please check and send again.',
        hy: 'Գները հենց նոր փոխվել են։ Զամբյուղում արդեն նոր գներն են, ստուգեք և ուղարկեք կրկին։',
        ru: 'Цены только что изменились. В корзине уже новые цены — проверьте и отправьте снова.' });
    }
    if (err && err.code === 'network') return tc({ en: 'No connection to the studio. Check your internet and try again.', hy: 'Կապ չկա։ Փորձեք կրկին։', ru: 'Нет связи. Проверьте интернет и попробуйте снова.' });
    if (err && err.status === 429) return tc({ en: 'Too many attempts. Please wait a minute and try again.', hy: 'Չափազանց շատ փորձեր։ Սպասեք մեկ րոպե։', ru: 'Слишком много попыток. Подождите минуту и попробуйте снова.' });
    var bad = err && err.data && err.data.errors && err.data.errors[0] && err.data.errors[0].loc;
    var field = bad ? String(bad[1] || '') : '';
    if (field === 'email') return tc({ en: 'This email cannot receive mail. Please check it.', hy: 'Այս էլ. հասցեն չի աշխատում։ Ստուգեք։', ru: 'На этот email нельзя отправить письмо. Проверьте адрес.' });
    if (field === 'phone') return tc({ en: 'Please check the phone number.', hy: 'Ստուգեք հեռախոսահամարը։', ru: 'Проверьте номер телефона.' });
    if (field === 'name' || field === 'address') return tc({ en: 'Please check your name and address.', hy: 'Ստուգեք անունը և հասցեն։', ru: 'Проверьте имя и адрес.' });
    if (err && err.code === 'cart_invalid') return tc({ en: 'Something in your cart is no longer available. Please check the cart.', hy: 'Զամբյուղի ինչ-որ ապրանք այլևս հասանելի չէ։', ru: 'Что-то из корзины больше недоступно. Проверьте корзину.' });
    if (err && err.code === 'invalid_order' && err.data && err.data.reason === 'delivery') {
      return tc({ en: 'This delivery option is not available right now. Please choose another one.', hy: 'Առաքման այս տարբերակը հիմա հասանելի չէ։ Ընտրեք այլ տարբերակ։', ru: 'Этот способ доставки сейчас недоступен. Выберите другой.' });
    }
    if (err && (err.code === 'invalid_order' || /product|available|combination/i.test(String(err.detail || '')))) {
      return tc({ en: 'Something in your cart is no longer available. Please check the cart.', hy: 'Զամբյուղի ինչ-որ ապրանք այլևս հասանելի չէ։', ru: 'Что-то из корзины больше недоступно. Проверьте корзину.' });
    }
    if (err && err.status === 422) return tc({ en: 'Some details are missing or invalid.', hy: 'Որոշ տվյալներ սխալ են։', ru: 'Некоторые данные заполнены неверно.' });
    return tc({ en: 'The order could not be sent. Please try again.', hy: 'Պատվերը չուղարկվեց։ Փորձեք կրկին։', ru: 'Заказ не отправился. Попробуйте ещё раз.' });
  }

  K.views.checkout = {
    render: function () {
      if (!S.state.cart.length) return '<div class="wrap">' + K.vh.pageHead(t('cart.title')) + U.empty('cart.empty', '#/explore', t('cart.emptyCta')) + '</div>';
      if (S.dropInvalid()) U.toast(tc({ en: 'Items that are no longer available were removed.', hy: 'Անհասանելի ապրանքները հեռացվեցին։', ru: 'Недоступные товары убраны из корзины.' }));
      if (!S.state.cart.length) return '<div class="wrap">' + K.vh.pageHead(t('cart.title')) + U.empty('cart.empty', '#/explore', t('cart.emptyCta')) + '</div>';
      if (!co) co = freshCo();
      if (!S.state.settings.delivery.enabled) co.delivery = 'pickup';
      U.setMeta({ title: t('cart.checkout') + ' — KADR', description: 'Checkout' });
      var body = [stepAddress, stepDelivery, stepPayment, stepReview][co.step]();
      return '<div class="wrap" style="max-width:1100px">' + K.vh.pageHead(t('cart.checkout')) + priceNotice() +
        '<div class="cart"><div>' + stepNav() + body +
        '<div class="pillrow" style="margin-top:26px">' +
          (co.step > 0 ? '<button class="btn btn--ghost" data-action="co-back">← ' + t('ui.back') + '</button>' : '<a class="btn btn--ghost" href="#/cart">← ' + t('cart.title') + '</a>') +
          (co.step < 3 ? '<button class="btn" data-action="co-next">' + t('ui.next') + ' →</button>' : '') +
        '</div></div>' + summary(false) + '</div></div>';
    },
    mount: function (root) {
      function collect() {
        var g = function (id) { var n = U.qs('#' + id, root); return n ? n.value.trim() : null; };
        if (U.qs('#cname', root)) {
          co.customer = { name: g('cname'), email: g('cemail'), phone: g('cphone') };
          if (U.qs('#astreet', root)) {
            co.address = Object.assign(co.address, {
              city: g('acity'), street: g('astreet'), building: g('abuilding'), entrance: g('aentrance'), floor: g('afloor'),
              apartment: g('aapt'), intercom: g('aintercom'), courier: g('acourier'),
              elevator: U.qs('#aelev', root) ? U.qs('#aelev', root).checked : true
            });
            co.saveAs = g('asave') || '';
          }
          co.consent = !!(U.qs('#cconsent', root) && U.qs('#cconsent', root).checked);
        }
      }
      K.app.bind('change', function (e) {
        if (e.target.name === 'zone') co.address.zone = e.target.value;
        if (e.target.name === 'dmethod') { co.delivery = e.target.value; K.app.rerender(); }
        if (e.target.id === 'cconsent') co.consent = e.target.checked;
      });
      K.app.bind('input', function (e) {
        if (e.target.id === 'cemail') co.customer.email = e.target.value.trim();
        if (e.target.id === 'cphone') co.customer.phone = e.target.value.trim();
        if (e.target.id === 'cname') co.customer.name = e.target.value.trim();
      });
      K.app.bind('click', function (e) {
        var b = e.target.closest('[data-action]'); if (!b) return;
        var a = b.dataset.action;
        if (a === 'co-next') {
          collect();
          var msg = validate(co.step);
          if (msg) { U.toast(msg); return; }
          if (co.step === 0 && co.saveAs) { S.saveAddress(Object.assign({}, co.address, { label: co.saveAs })); }
          co.step++; K.app.rerender();
        }
        if (a === 'co-back') { collect(); co.step--; co.error = ''; K.app.rerender(); }
        if (a === 'co-day') { co.day = b.dataset.k; K.app.rerender(); }
        if (a === 'co-slot') { co.slot = b.dataset.k; K.app.rerender(); }
        if (a === 'use-addr') {
          var found = S.state.addresses.filter(function (x) { return x.label === b.dataset.l; })[0];
          if (found) { co.address = Object.assign({}, found); K.app.rerender(); }
        }
        if (a === 'co-place' && !placing) {
          var zone = S.state.settings.delivery.zones.filter(function (z) { return z.id === co.address.zone; })[0];
          if (co.delivery === 'courier' && !zone) { co.step = 1; co.error = ''; U.toast(validate(1) || ''); K.app.rerender(); return; }
          placing = true; co.error = ''; K.app.rerender();
          S.createOrder({
            ref: co.ref, customer: co.customer, consent: co.consent,
            delivery: co.delivery, zoneId: zone ? zone.backendId : null,
            address: co.delivery === 'courier' ? {
              city: co.address.city || '', street: co.address.street || '', building: co.address.building || '',
              entrance: co.address.entrance || '', floor: co.address.floor || '', apartment: co.address.apartment || '',
              intercom: co.address.intercom || '', lift: co.address.elevator !== false, courier_note: co.address.courier || ''
            } : {},
            slot: co.slot ? [co.day, co.slot].filter(Boolean).join(' ') : ''
          }).then(function (order) {
            placing = false; co = null; attemptSent = true;
            location.hash = '#/order/' + order.id;
          }, function (err) {
            placing = false;
            co.error = failure(err);
            if (err && (err.code === 'price_changed' || err.code === 'invalid_order' || err.code === 'cart_invalid')) {
              /* reload the catalogue so the cart shows the new prices, then let the customer confirm */
              K.app.reloadCatalog().then(function () { K.app.rerender(); }, function () { K.app.rerender(); });
            } else K.app.rerender();
          });
        }
      });
    }
  };

  /* ---------- confirmation / tracking --------------------------------------- */

  function orderBody(o) {
    var steps = o.steps || ['awaiting_payment', 'paid', 'in_production', 'ready', 'in_delivery', 'delivered'].map(function (id) {
      return { id: id, label: tc(S.STATUS_LABEL[id]) };
    });
    var at = o.status === 'accepted' ? 1 : steps.map(function (s) { return s.id; }).indexOf(o.status);
    var awaiting = o.status === 'awaiting_payment';
    return '<div style="text-align:center;padding:50px 0 26px">' +
        '<p class="eyebrow" style="justify-content:center">' + (o.status === 'cancelled' ? tc(S.STATUS_LABEL.cancelled) : t('co.confirmed')) + '</p>' +
        '<h1 class="h1" style="font-size:clamp(2rem,4vw,3rem);margin:16px 0 8px">' + U.esc(o.id) + '</h1>' +
        '<p class="lede" style="margin:0 auto">' + (awaiting ? t('co.thanks') : U.esc(o.statusLabel || tc(S.STATUS_LABEL[o.status] || {}))) + '</p>' +
        (o.promised && o.status !== 'cancelled' && o.status !== 'delivered' ? '<p class="mono" style="margin-top:12px">' +
          tc({ en: 'Expected', hy: 'Ակնկալվում է', ru: 'Ожидаемая дата' }) + ': ' +
          new Date(o.promised + 'T12:00:00').toLocaleDateString(K.i18n.lang === 'ru' ? 'ru-RU' : (K.i18n.lang === 'hy' ? 'hy-AM' : 'en-GB'), { day: 'numeric', month: 'long', year: 'numeric' }) + '</p>' : '') +
      '</div>' +
      (awaiting && o.bank ? '<div class="panel" style="border-color:var(--oxide)"><h3 class="h3">' +
        tc({ en: 'To pay', hy: 'Վճարման ենթակա', ru: 'К оплате' }) + ': ' + U.money(o.total) + '</h3>' +
        '<pre style="white-space:pre-wrap;font-family:var(--fm,monospace);font-size:13px;margin:10px 0">' + U.esc(o.bank) + '</pre>' +
        '<p style="color:var(--ink-2)">' + tc({ en: 'Put the order code ', hy: 'Վճարման նպատակում նշեք կոդը՝ ', ru: 'Укажите код заказа ' }) +
        '<b>' + U.esc(o.id) + '</b>' + tc({ en: ' in the payment purpose and send us a screenshot of the transfer.', hy: ', և ուղարկեք մեզ սքրինշոթը։', ru: ' в назначении платежа и пришлите нам скриншот перевода.' }) + '</p></div>' : '') +
      (awaiting && !o.bank && o.online ? '<div class="panel" style="border-color:var(--oxide)"><h3 class="h3">' +
        tc({ en: 'To pay', hy: 'Վճարման ենթակա', ru: 'К оплате' }) + ': ' + U.money(o.total) + '</h3><p style="color:var(--ink-2)">' + tc(PAY_ONLINE_BODY) + '</p></div>' : '') +
      (o.status !== 'cancelled' ? '<div class="panel"><div class="steps-nav">' + steps.map(function (s, i) {
        return '<i class="' + (i === at ? 'is-on' : (i < at ? 'is-done' : '')) + '">' + U.esc(s.label) + '</i>';
      }).join('') + '</div>' : '<div class="panel">') +
      (o.items || []).map(function (it) {
        var p = S.byId(it.productId);
        return '<div class="line">' + (p ? U.artImg(p, it.options, 200) : '<div></div>') +
          '<div><b>' + U.esc(tc(it.title)) + '</b><div class="line__opts">' + (p ? U.optionSummary(p, it.options) : '') + '</div>' +
          '<div class="line__sku">' + U.esc(it.sku) + ' · × ' + it.qty + '</div></div>' +
          '<div class="num">' + U.money(it.unit * it.qty) + '</div></div>';
      }).join('') +
      (o.delivery ? '<div class="srow"><span>' + t('cart.delivery') + '</span><span class="num">' + U.money(o.delivery) + '</span></div>' : '') +
      '<div class="srow srow--total"><span>' + t('cart.total') + '</span><span class="num">' + U.money(o.total) + '</span></div></div>' +
      '<div class="pillrow" style="justify-content:center;margin-top:20px">' +
        '<a class="btn btn--ghost" href="#/account/orders">' + t('acc.orders') + '</a>' +
        '<a class="btn btn--ghost" href="#/explore">' + t('cart.continue') + '</a></div>';
  }

  K.views.order = {
    render: function (params) {
      var o = S.state.orders.filter(function (x) { return x.id === params.id; })[0];
      if (!o) return '<div class="wrap">' + U.empty('err.404', '#/', t('err.404cta')) + '</div>';
      U.setMeta({ title: o.id + ' — KADR', description: 'Order status' });
      return '<div class="wrap" style="max-width:900px" id="orderview">' + orderBody(o) + '</div>';
    },
    mount: function (root, params) {
      /* the live status comes from the back office */
      S.refreshOrder(params.id).then(function (o) {
        var host = U.qs('#orderview', root);
        if (host && K.app.route.name === 'order') { host.innerHTML = orderBody(o); U.hydrateImages(host); }
      }, function () { /* keep the saved copy */ });
    }
  };
})(window.KADR = window.KADR || {});

/* ============================================================================
   VIEW — account, preferences, static pages
   ============================================================================ */

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
        '<div><p class="mono">' + new Date(o.at).toLocaleDateString(K.i18n.lang === 'ru' ? 'ru-RU' : (K.i18n.lang === 'hy' ? 'hy-AM' : 'en-GB'), { day: 'numeric', month: 'long', year: 'numeric' }) + '</p><h3 class="h3">' + o.id + '</h3></div>' +
        '<span class="status status--' + o.status + '">' + U.esc(o.statusLabel || tc(S.STATUS_LABEL[o.status] || {})) + '</span></div>' +
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
      if (tab === 'orders') body = '<div id="ordershost">' + ordersPanel() + '</div>';
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
    mount: function (root, params) {
      if (params.tab === 'orders' && S.state.orders.length) {
        /* statuses come from the back office */
        Promise.all(S.state.orders.slice(0, 20).map(function (o) { return S.refreshOrder(o.id).catch(function () {}); }))
          .then(function () {
            var host = U.qs('#ordershost', root);
            if (host && K.app.route.name === 'account') { host.innerHTML = ordersPanel(); U.hydrateImages(host); }
          });
      }
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

  /* Pages are written in the back office (Settings → Site & email texts). A language
     marked "final" there replaces the built-in placeholder here. */
  var PAGE_SLUG = { privacy: 'privacy', terms: 'terms', delivery: 'delivery-returns', returns: 'delivery-returns', payment: 'payment', about: 'about' };

  function backofficeText(slug) {
    var pg = D.PAGES[slug];
    if (!pg || !(pg.done[K.i18n.lang] || pg.done.en)) return null;
    return K.api.get('/pages/' + slug + '?lang=' + K.i18n.lang).then(function (r) { return r.body || null; });
  }
  function paragraphs(text) {
    return String(text).split(/\n\s*\n/).map(function (p) { return '<p>' + U.esc(p).replace(/\n/g, '<br>') + '</p>'; }).join('');
  }
  function fillFromBackoffice(root, slug, sel) {
    var pr = backofficeText(slug);
    if (!pr) return;
    var hash = location.hash;
    pr.then(function (body) {
      if (location.hash !== hash) return;   /* the customer already moved to another page */
      var host = U.qs(sel, root);
      if (body && host) host.innerHTML = paragraphs(body);
    }, function () { /* keep the built-in text */ });
  }

  K.views.legal = {
    render: function (params) {
      var doc = LEGAL[params.id] || LEGAL.privacy;
      U.setMeta({ title: t(doc.title) + ' — KADR', description: tc(doc.body).slice(0, 150) });
      return '<div class="wrap">' + VH.pageHead(t(doc.title), t('foot.legal')) +
        '<div class="prose" id="pagebody"><p class="lede">' + U.esc(tc(doc.body)) + '</p>' +
        '<p class="mono" style="text-transform:none;letter-spacing:0;margin-top:26px">' +
        tc({ en: 'Placeholder text — final legal copy is supplied and approved by the company.',
             hy: 'Ժամանակավոր տեքստ։', ru: 'Черновой текст — финальные тексты предоставляет компания.' }) + '</p></div></div>';
    },
    mount: function (root, params) { fillFromBackoffice(root, PAGE_SLUG[params.id] || 'privacy', '#pagebody'); }
  };

  K.views.about = {
    render: function () {
      U.setMeta({ title: 'About — KADR', description: 'A made-to-order print studio in Yerevan.' });
      return '<div class="wrap">' + VH.pageHead(t('nav.about'), 'KADR') +
        '<div class="two"><div class="prose" id="pagebody"><p class="lede">' + t('home.brand.body') + '</p>' +
        '<h3 class="h3">' + tc({ en: 'How it works', hy: 'Ինչպես է աշխատում', ru: 'Как это работает' }) + '</h3>' +
        '<p>' + tc({ en: 'You order, we print, a courier brings it. Nothing sits in a warehouse, which is why the catalogue can grow to fifty thousand pieces without a single shelf.',
          hy: 'Դուք պատվիրում եք, մենք տպում ենք, առաքիչը բերում է։', ru: 'Вы заказываете, мы печатаем, курьер привозит.' }) + '</p></div>' +
        '<div>' + VH.sceneCard(D.SCENES[5]) + '</div></div></div>';
    },
    mount: function (root) { fillFromBackoffice(root, 'about', '#pagebody'); }
  };

  K.views.contact = {
    render: function () {
      var c = S.state.settings.contact;
      U.setMeta({ title: 'Contact — KADR', description: 'Talk to the studio.' });
      return '<div class="wrap" style="max-width:760px">' + VH.pageHead(t('nav.contact'), 'Yerevan, Armenia') +
        '<div class="panel"><h3 class="h3">' + tc({ en: 'Fastest routes', hy: 'Ամենաարագ ուղիները', ru: 'Быстрее всего' }) + '</h3>' +
        '<div class="contactrow">' +
          (c.instagram ? '<a class="btn btn--sm" href="https://instagram.com/' + encodeURIComponent(String(c.instagram).replace(/^@/, '')) + '" target="_blank" rel="noopener">Instagram ' + U.esc(c.instagram) + '</a>' : '') +
          (c.whatsapp ? '<a class="btn btn--sm btn--ghost" href="https://wa.me/' + String(c.whatsapp).replace(/\D/g, '') + '" target="_blank" rel="noopener">WhatsApp ' + U.esc(c.whatsapp) + '</a>' : '') +
          (c.email ? '<a class="btn btn--sm btn--ghost" href="mailto:' + U.esc(c.email) + '">' + U.esc(c.email) + '</a>' : '') +
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

/* ============================================================================
   ROUTER — routes, header, footer, global actions, boot
   ============================================================================ */

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
    [/^\/legal\/([^/]+)$/, 'legal', ['id']]
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

  /* Language, currency and theme: in the header on wide screens, in the menu drawer on phones. */
  function prefControls(cls) {
    var langs = K.i18n.langs.filter(function (l) { return S.state.settings.languages[l.code]; });
    var curs = Object.keys(D.CURRENCIES).filter(function (c) { return S.state.settings.currencies[c]; });
    return '<select class="pill ' + cls + '" data-action="lang-sel" aria-label="' + t('ui.language') + '">' +
        langs.map(function (l) { return '<option value="' + l.code + '"' + (K.i18n.lang === l.code ? ' selected' : '') + '>' + l.short + '</option>'; }).join('') + '</select>' +
      '<select class="pill ' + cls + '" data-action="cur-sel" aria-label="' + t('ui.currency') + '">' +
        curs.map(function (c) { return '<option value="' + c + '"' + (S.state.currency === c ? ' selected' : '') + '>' + c + '</option>'; }).join('') + '</select>' +
      '<button class="iconbtn ' + cls + '" data-action="theme" aria-label="' + t('nav.theme') + '">' + U.icon(S.state.theme === 'dark' ? 'sun' : 'moon') + '</button>';
  }

  function header() {
    var cart = S.cartCount();
    var favs = S.state.favorites.length;
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
      '<div class="head__tools">' + prefControls('head__opt') +
        '<a class="iconbtn" href="#/search" aria-label="' + t('nav.search') + '">' + U.icon('search') + '</a>' +
        '<a class="iconbtn head__opt" href="#/favorites" aria-label="' + t('nav.favorites') + '">' + U.heart() +
          (favs ? '<span class="count">' + favs + '</span>' : '') + '</a>' +
        '<a class="iconbtn" href="#/account" aria-label="' + t('nav.account') + '">' + U.icon('user') + '</a>' +
        '<a class="iconbtn" href="#/cart" aria-label="' + t('nav.cart') + '">' + U.icon('cart') +
          (cart ? '<span class="count">' + cart + '</span>' : '') + '</a>' +
      '</div></div>';
  }

  function menuDrawer() {
    var links = [['#/shop', 'nav.shop'], ['#/explore', 'nav.explore'], ['#/collections', 'nav.collections'],
      ['#/rooms', 'nav.rooms'], ['#/composer', 'nav.builder'], ['#/favorites', 'nav.favorites'],
      ['#/account', 'nav.account'], ['#/about', 'nav.about'], ['#/contact', 'nav.contact']];
    return '<div class="drawer__scrim" data-action="menu-close"></div><div class="drawer__panel">' +
      '<div class="drawer__head"><span class="logo">KADR</span>' +
      '<button class="iconbtn" data-action="menu-close" aria-label="' + t('nav.close') + '">' + U.icon('close') + '</button></div>' +
      '<div class="drawer__body">' + links.map(function (l) {
        return '<a href="' + l[0] + '" data-action="menu-close" style="display:block;padding:13px 0;border-bottom:1px solid var(--line-soft);font-family:var(--fd);font-size:20px">' + t(l[1]) + '</a>';
      }).join('') +
      '<div class="pillrow drawer__prefs" style="margin-top:20px;align-items:center">' + prefControls('') + '</div></div></div>';
  }

  function footer() {
    var c = S.state.settings.contact;
    return '<footer class="foot"><div class="wrap"><div class="foot__grid">' +
      '<div><a class="logo" href="#/">KADR<sup>studio</sup></a>' +
      '<p class="lede" style="font-size:14px;margin-top:14px;max-width:34ch">' + t('home.hero.sub') + '</p>' +
      '<div class="pillrow" style="margin-top:16px">' +
        (c.instagram ? '<a class="chip" href="https://instagram.com/' + encodeURIComponent(String(c.instagram).replace(/^@/, '')) + '" target="_blank" rel="noopener">' + U.esc(c.instagram) + '</a>' : '') +
        (c.email ? '<a class="chip" href="mailto:' + U.esc(c.email) + '">' + U.esc(c.email) + '</a>' : '') + '</div></div>' +
      '<div><h4>' + t('nav.shop') + '</h4>' +
        D.CATEGORIES.map(function (cat) { return '<a href="#/shop?cat=' + encodeURIComponent(cat.id) + '">' + U.esc(tc(cat.name)) + '</a>'; }).join('') +
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
        '<a href="#/legal/payment">' + t('foot.payment') + '</a></div>' +
      '</div><div class="foot__bottom"><span>© ' + new Date().getFullYear() + ' KADR — ' + t('foot.rights') + '</span>' +
      '<span>' + (S.paymentOn() ? tc({ en: 'Card payment available', hy: 'Քարտով վճարում', ru: 'Оплата картой доступна' }) : t('co.payOff')) + '</span></div></div></footer>';
  }

  /* ---------- render ---------------------------------------------------------- */

  function render() {
    unbindAll();
    var r = parse();
    current = r;
    var view = K.views[r.name];
    var root = U.qs('#app');
    U.qs('#head').innerHTML = header();
    U.qs('#menu').innerHTML = menuDrawer();   /* language may have changed */

    if (!view) {
      root.innerHTML = '<div class="wrap">' + U.empty('err.404', '#/', t('err.404cta')) + '</div>';
    } else {
      try {
        root.innerHTML = view.render(r.params) || '';
        if (view.mount) view.mount(root, r.params);
      } catch (e) {
        /* one broken block must never leave the customer on a blank page */
        if (window.console) console.error(e);
        root.innerHTML = '<div class="wrap">' + U.empty('err.404', '#/', t('err.404cta')) + '</div>';
      }
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
      if (a === 'theme') { S.setTheme(S.state.theme === 'dark' ? 'light' : 'dark'); U.qs('#head').innerHTML = header(); U.qs('#menu').innerHTML = menuDrawer(); }
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

  /* ---------- catalogue from the back office ------------------------------------ */

  var lastLoad = 0;
  function loadCatalog() {
    return K.api.bootstrap().then(function (boot) {
      S.setCatalog(D.load(boot));
      K.search.build();
      lastLoad = Date.now();
    });
  }
  function loadingScreen() {
    U.qs('#app').innerHTML = '<div class="wrap" style="padding:80px 0">' + U.skeleton(8) + '</div>';
  }
  function errorScreen() {
    U.qs('#app').innerHTML = '<div class="wrap"><div class="empty">' +
      '<p class="empty__title">' + tc({ en: 'The shop could not load.', hy: 'Խանութը չբեռնվեց։', ru: 'Магазин не загрузился.' }) + '</p>' +
      '<p class="lede" style="margin:0 auto 18px">' + tc({ en: 'Check your connection and try again.', hy: 'Ստուգեք կապը և փորձեք կրկին։', ru: 'Проверьте подключение и попробуйте снова.' }) + '</p>' +
      '<button class="btn btn--ghost" data-action="retry-load">' + tc({ en: 'Try again', hy: 'Կրկին', ru: 'Повторить' }) + '</button></div></div>';
  }
  function start() {
    loadingScreen();
    loadCatalog().then(render, errorScreen);
  }
  /* Back-office changes reach an open tab too: refresh when the customer comes back to it. */
  function refreshIfStale() {
    if (document.visibilityState !== 'visible' || !lastLoad || Date.now() - lastLoad < 60000) return;
    loadCatalog().then(function () {
      if (['checkout', 'builder', 'composer'].indexOf(current.name) < 0) rerender();
      else U.qs('#head').innerHTML = header();
    }, function () { /* keep what is on screen */ });
  }

  function boot() {
    K.i18n.set(S.state.lang);
    if (!S.state.theme) {
      /* No stored choice: follow the host page, then the OS. */
      S.state.theme = document.documentElement.dataset.theme ||
        (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    }
    document.documentElement.dataset.theme = S.state.theme;
    U.qs('#menu').innerHTML = menuDrawer();
    bindGlobal();
    document.addEventListener('click', function (e) { if (e.target.closest('[data-action="retry-load"]')) start(); });
    document.addEventListener('visibilitychange', refreshIfStale);
    start();

    /* the storefront reflects admin changes without a reload */
    S.on(function (what) {
      if (what === 'settings' || what === 'lang' || what === 'currency') U.qs('#head').innerHTML = header();
      if (what === 'cart' || what === 'favorites') U.qs('#head').innerHTML = header();
    });
  }

  K.app = { render: render, rerender: rerender, boot: boot, bind: bind, reloadCatalog: loadCatalog, get route() { return current; } };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})(window.KADR = window.KADR || {});
