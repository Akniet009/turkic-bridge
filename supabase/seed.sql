-- ==============================================================================
-- ТЕСТОВЫЕ ДАННЫЕ (SEED): 3 ТУРЕЦКИЕ ФАБРИКИ, 15 ТОВАРОВ, 2 ПОКУПАТЕЛЯ ИЗ РК
-- ==============================================================================

-- 1. UUID ДЛЯ ДЕМО-ПОЛЬЗОВАТЕЛЕЙ
-- Поставщики:
-- aaaaaaaa-1111-1111-1111-111111111111 (Mehmet Demir, Denizli)
-- aaaaaaaa-2222-2222-2222-222222222222 (Emre Yılmaz, Bursa)
-- aaaaaaaa-3333-3333-3333-333333333333 (Zeynep Kaya, Istanbul)
-- Покупатели из Казахстана:
-- bbbbbbbb-1111-1111-1111-111111111111 (Асель Муканова, ТОО «SilkWay Home», Алматы)
-- bbbbbbbb-2222-2222-2222-222222222222 (Нурлан Сериков, ИП «Дала Текстиль», Астана)
-- Админ платформы:
-- cccccccc-9999-9999-9999-999999999999 (Администратор Тюркский Мост)

-- 2. ПРОФИЛИ
INSERT INTO profiles (id, role, name, company, phone, country, city, language)
VALUES
  ('aaaaaaaa-1111-1111-1111-111111111111', 'supplier', 'Mehmet Demir', 'Denizli Pamuk San. ve Tic. A.Ş.', '+90 258 296 1000', 'TR', 'Денизли', 'tr'),
  ('aaaaaaaa-2222-2222-2222-222222222222', 'supplier', 'Emre Yılmaz', 'Bursa Jakar & Dokuma Ltd.', '+90 224 219 2000', 'TR', 'Бурса', 'tr'),
  ('aaaaaaaa-3333-3333-3333-333333333333', 'supplier', 'Zeynep Kaya', 'Marmara Hotel & Home Textile', '+90 212 555 3000', 'TR', 'Стамбул', 'tr'),
  ('bbbbbbbb-1111-1111-1111-111111111111', 'buyer', 'Асель Муканова', 'ТОО «SilkWay Home KZ»', '+7 701 555 1234', 'KZ', 'Алматы', 'ru'),
  ('bbbbbbbb-2222-2222-2222-222222222222', 'buyer', 'Нурлан Сериков', 'ИП «Дала Текстиль Астана»', '+7 777 333 9876', 'KZ', 'Астана', 'kk'),
  ('cccccccc-9999-9999-9999-999999999999', 'admin', 'Ерлан Садыков', 'Turkic Bridge Marketplace HQ', '+7 727 300 0000', 'KZ', 'Алматы', 'ru')
ON CONFLICT (id) DO NOTHING;

-- 3. ПОСТАВЩИКИ (ФАБРИКИ)
INSERT INTO suppliers (id, profile_id, factory_name, description, city, verified, rating, banner_url, certificates, founded_year)
VALUES
  (
    '11111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'aaaaaaaa-1111-1111-1111-111111111111',
    'Denizli Pamuk Tekstil A.Ş.',
    'Крупнейшая фабрика в Денизли с 25-летней историей. Производим отельное постельное белье из 100% эгейского длинноволокнистого хлопка и махровые полотенца повышенной впитываемости. Прямые поставки контейнерами в СНГ.',
    'Денизли',
    TRUE,
    4.95,
    'https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?auto=format&fit=crop&w=1200&q=80',
    ARRAY['OEKO-TEX Standard 100', 'ISO 9001:2015', 'GOTS Organic Cotton'],
    1998
  ),
  (
    '22222222-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'aaaaaaaa-2222-2222-2222-222222222222',
    'Bursa Jakar & Dokuma Ltd.',
    'Традиционная ткацкая фабрика в Бурсе. Специализируемся на жаккардовом постельном белье премиум-класса, мягких вафельных покрывалах и шерстяных пледах. Высокая плотность плетения, устойчивость окраски.',
    'Бурса',
    TRUE,
    4.88,
    'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80',
    ARRAY['OEKO-TEX Standard 100', 'Sedex Smeta 4-Pillar', 'BSCI'],
    2005
  ),
  (
    '33333333-cccc-cccc-cccc-cccccccccccc',
    'aaaaaaaa-3333-3333-3333-333333333333',
    'Marmara Hotel & Home Textile',
    'Стамбульское производство текстиля для ритейла и 5-звездочных отелей. Быстрые сроки производства, адаптация дизайна под заказчика (white label), вышивка логотипа покупателя.',
    'Стамбул',
    TRUE,
    4.92,
    'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80',
    ARRAY['OEKO-TEX 100', 'ISO 14001', 'Cotton USA Licensee'],
    2012
  )
ON CONFLICT (id) DO NOTHING;

-- 4. ТОВАРЫ (15 ШТУК ПО 3 КАТЕГОРИЯМ: ПОСТЕЛЬНОЕ БЕЛЬЕ, ПОЛОТЕНЦА, ПЛЕДЫ)

-- Фабрика 1: Denizli Pamuk Tekstil (5 товаров)
INSERT INTO products (
  id, supplier_id, title_tr, title_ru, title_kk,
  description_tr, description_ru, description_kk,
  category, price_usd, moq, lead_time_days, images, composition, density_gsm
) VALUES
(
  'p101-1111-1111-1111-111111111111',
  '11111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'Ege Pamuğu Çift Kişilik Ranforce Nevresim Takımı',
  'Комплект постельного белья Ранфорс (Евро) из Эгейского хлопка',
  'Егей мақтасынан жасалған Ранфорс (Еуро) төсек-орын жиынтығы',
  '%100 Ege pamuğundan üretilmiş 57 tel ranforce kumaş. Yıkamalara karşı son derece dayanıklı, nefes alabilen doğal dokuma. Otel ve perakende mağazaları için ideal.',
  '100% натуральный эгейский хлопок, плетение Ранфорс 57 нитей/см². Выдерживает свыше 250 стирок без потери цвета и мягкости. Идеально для магазинов домашнего текстиля.',
  '100% табиғи Егей мақтасы, Ранфорс тоқу 57 жіп/см². Түсі мен жұмсақтығын жоғалтпай 250-ден астам жууға төзімді. Үй тоқыма дүкендері үшін өте қолайлы.',
  'bedding', 14.50, 50, 10,
  ARRAY['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80'],
  '100% Эгейский хлопок Ранфорс', 145
),
(
  'p102-1111-1111-1111-111111111111',
  '11111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'Otel Tipi 300TC Çizgili Saten Nevresim Seti',
  'Страйп-сатин 300ТС отельный комплект постельного белья',
  'Отельдерге арналған Страйп-сатин 300ТС төсек-орын жиынтығы',
  '1 cm çizgili parlak lüks saten kumaş. 300 TC iplik sıklığı ile pürüzsüz ipeksi dokunuş. 5 yıldızlı otel kalitesinde toptan üretim.',
  'Премиальный страйп-сатин с полосой 1 см. Плотность 300TC (нити на дюйм), благородный шелковистый блеск и мягкость. Популярный хит продаж в Казахстане.',
  'Ені 1 см жолақты премиум страйп-сатин. Тығыздығы 300TC, тегіс жібектей жылтыр. Қазақстан дүкендерінде ең көп сатылатын модель.',
  'bedding', 22.00, 30, 14,
  ARRAY['https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1540518614846-7ede433c4ef4?auto=format&fit=crop&w=800&q=80'],
  '100% Хлопок Страйп-Сатин 300TC', 140
),
(
  'p103-1111-1111-1111-111111111111',
  '11111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'Denizli Bukle Banyo Havlusu 70x140 cm (550 GSM)',
  'Махровое банное полотенце Денизли 70x140 см (550 г/м²)',
  'Денизли түкті монша сүлгісі 70x140 см (550 г/м²)',
  'Denizli menşeli çift bükümlü iplikle dokunmuş kalın ve ultra emici havlu. Dökülme yapmaz, renkleri solmaz.',
  'Плотное махровое полотенце из крученой хлопковой нити Денизли. Моментально впитывает влагу, не осыпается при стирке. Плотность 550 г/м².',
  'Денизли қаласының бұралған мақта жібінен тоқылған қалың түкті сүлгі. Ылғалды бірден сіңіреді, жуғанда жүні түспейді.',
  'towels', 4.80, 100, 7,
  ARRAY['https://images.unsplash.com/photo-1616627547584-bf28cee262db?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80'],
  '100% Длинноволокнистый хлопок', 550
),
(
  'p104-1111-1111-1111-111111111111',
  '11111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  '3''lü Premium El ve Yüz Havlu Seti 50x90 cm',
  'Набор махровых полотенец для лица и рук (3 шт, 50x90 см)',
  'Бет пен қолға арналған түкті сүлгілер жиынтығы (3 дана, 50x90 см)',
  'Pastel tonlarda 3 adet 50x90 cm jakarlı bordürlü havlu seti. Özel kraft hediye kutulu ambalajda sunulur.',
  'Набор из 3 полотенец в пастельной гамме с изящным жаккардовым бордюром. Поставляется в готовой подарочной крафт-упаковке со штрихкодом.',
  'Пастел реңкті 3 дана сүлгі жиынтығы, жаккард жиекпен безендірілген. Сыйлықтық крафт қорапта жеткізіледі.',
  'towels', 8.20, 60, 10,
  ARRAY['https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80'],
  '100% Эгейский хлопок', 500
),
(
  'p105-1111-1111-1111-111111111111',
  '11111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'Pamuklu Puf Waffle Pike Battaniye 200x220 cm',
  'Хлопковое вафельное покрывало-плед 200x220 см (Soft Waffle)',
  'Мақтадан жасалған вафельді жамылғы-плед 200x220 см',
  'Büyük petek dokuma, nefes alabilir hafif yapı. Yaz aylarında pike, kışın ekstra katman olarak kullanılır. Ön yıkamalı yumuşaklık.',
  'Крупная вафельная структура с эффектом Stonewash. Легкое, дышащее, не требует глажки. Идеально как покрывало на кровать или диван.',
  'Ірі вафельді тоқылған Stonewash пішіні. Жеңіл, ауа өткізгіш, үтіктеуді қажет етпейді. Төсекке немесе диванға өте ыңғайлы.',
  'plaids', 12.00, 40, 12,
  ARRAY['https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80'],
  '100% Вафельный хлопок Stonewashed', 320
);

-- Фабрика 2: Bursa Jakar & Dokuma Ltd. (5 товаров)
INSERT INTO products (
  id, supplier_id, title_tr, title_ru, title_kk,
  description_tr, description_ru, description_kk,
  category, price_usd, moq, lead_time_days, images, composition, density_gsm
) VALUES
(
  'p201-2222-2222-2222-222222222222',
  '22222222-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'Bursa Jakarlı Lüks Saten Nevresim Takımı (Euro)',
  'Жаккардовый люкс-сатин комплект постельного белья (Евро)',
  'Жаккард люкс-сатин төсек-орын жиынтығы (Еуро)',
  'Özel dokuma jakar desenli ipeksi saten. Çeyizlik ve lüks mağaza segmenti için en çok tercih edilen koleksiyonumuz.',
  'Эксклюзивный рельефный жаккардовый узор на шелковом сатине. Премиум-сегмент для свадебных подарков и элитных текстильных бутиков.',
  'Жібек сатинге тоқылған эксклюзивті бедерлі жаккард өрнегі. Үйлену тойына арналған және элиталық бутиктік жиынтық.',
  'bedding', 28.50, 25, 14,
  ARRAY['https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80'],
  '100% Мако-Сатин Жаккард', 150
),
(
  'p202-2222-2222-2222-222222222222',
  '22222222-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'Yıkanmış Keten-Pamuk Karışımlı Nevresim Takımı',
  'Комплект из вареного льна и хлопка (Linen-Cotton Blend)',
  'Жуылған зығыр мен мақтадан жасалған төсек-орын жиынтығы',
  '%50 keten %50 pamuk harmanı. Doğal kırışık görünümlü, terletmeyen vintage hava katan bohem seri.',
  '50% французский лен, 50% анатолийский хлопок. Стильный небрежный помятый вид, гипоаллергенный, дарит прохладу летом и тепло зимой.',
  '50% зығыр, 50% мақта қоспасы. Заманауи сәнді винтаж стилінде, жазда салқын, қыста жылы сақтайды.',
  'bedding', 34.00, 20, 18,
  ARRAY['https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80'],
  '50% Лён, 50% Хлопок', 165
),
(
  'p203-2222-2222-2222-222222222222',
  '22222222-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'Doğal Yün Karışımlı Püsküllü İskoç Ekose Battaniye',
  'Шерстяной плед с бахромой «Шотландская клетка» 150x200 см',
  'Шашақты табиғи жүн плед «Шотланд торкөзі» 150x200 см',
  '%70 Anadolu yünü, %30 yumuşak akrilik. Kış aylarında sıcak tutan geleneksel ekose dokuma.',
  '70% натуральная овечья шерсть, 30% эко-акрил для прочности. Теплый, плотный, согревающий плед с классическим узором тартан.',
  '70% табиғи қой жүні, 30% эко-акрил. Суық күндерде жылу сыйлайтын классикалық торкөзді қалың плед.',
  'plaids', 16.80, 30, 10,
  ARRAY['https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80'],
  '70% Шерсть, 30% Акрил', 400
),
(
  'p204-2222-2222-2222-222222222222',
  '22222222-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'Kadife Dokulu Çift Taraflı Jakarlı Koltuk Şalı 130x170 cm',
  'Жаккардовый интерьерный плед-накидка 130x170 см',
  'Жаккард интерьерлік плед-жапқыш 130x170 см',
  'Şık geometrik desenli, çift taraflı kullanılabilir dekoratif şal. Kanepe ve yatak üstü için ideal.',
  'Двусторонний жаккардовый плед с геометрическим орнаментом. Добавляет уют в гостиную или спальню, не образует катышков.',
  'Екі жақты геометриялық өрнекті жаккард плед. Қонақ бөлме мен жатын бөлмеге ерекше жайлылық береді.',
  'plaids', 9.50, 50, 8,
  ARRAY['https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=800&q=80'],
  '60% Хлопок, 40% Поликоттон', 350
),
(
  'p205-2222-2222-2222-222222222222',
  '22222222-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'Bursa Hamam Peştemal Seti (2 Adet, Organik Pamuk)',
  'Турецкие аутентичные пештемали для хаммама и пляжа (2 шт)',
  'Хаммам мен жағажайға арналған түрік пештемалі (2 дана)',
  'Geleneksel tezgahlarda dokunmuş ultra hafif ve hızlı kuruyan %100 organik pamuklu peştemal.',
  'Традиционные легкие полотенца-пештемали ручной сборки. Быстро сохнут, занимают минимум места, популярны в СПА, банях и на пляжах.',
  'Дәстүрлі жеңіл мақта пештемаль сүлгілер. Тез кебеді, СПА, монша және жағажай үшін өте танымал.',
  'towels', 5.90, 80, 5,
  ARRAY['https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=800&q=80'],
  '100% Органический хлопок', 220
);

-- Фабрика 3: Marmara Hotel & Home Textile (5 товаров)
INSERT INTO products (
  id, supplier_id, title_tr, title_ru, title_kk,
  description_tr, description_ru, description_kk,
  category, price_usd, moq, lead_time_days, images, composition, density_gsm
) VALUES
(
  'p301-3333-3333-3333-333333333333',
  '33333333-cccc-cccc-cccc-cccccccccccc',
  '5 Yıldızlı Otel Tipi Ağır Gramajlı Banyo Havlusu 650 GSM',
  'Отельное банное полотенце сверхвысокой плотности 650 г/м²',
  'Қонақүйлерге арналған аса қалың монша сүлгісі 650 г/м²',
  'Yüksek emicilik ve dayanıklılık için özel çift dikişli kenarlar. Ağır endüstriyel yıkamaya uygun.',
  'Экстра-тяжелое отельное полотенце (650 г/м²) с двойной закрепленной строчкой по краям. Рассчитано на ежедневную жесткую стирку в прачечных.',
  'Қос тігісті жиектері бар аса тығыз қонақүй сүлгісі (650 г/м²). Күнделікті қарқынды жууға төзімді.',
  'towels', 6.20, 100, 7,
  ARRAY['https://images.unsplash.com/photo-1616627547584-bf28cee262db?auto=format&fit=crop&w=800&q=80'],
  '100% Эгейский хлопок Ring Spun', 650
),
(
  'p302-3333-3333-3333-333333333333',
  '33333333-cccc-cccc-cccc-cccccccccccc',
  'Otel Ayak Havlusu (Paspas) 50x70 cm 750 GSM',
  'Махровый коврик для ног (полотенце для ног) 50x70 см 750 г/м²',
  'Аяққа арналған түкті төсеніш-сүлгі 50x70 см 750 г/м²',
  'Kaymayı önleyen jakarlı ayak izi bordürlü, ultra kalın otel ayak havlusu.',
  'Плотный коврик под ноги в ванную комнату с жаккардовой рамкой "стопы". Высочайшая прочность и впитываемость.',
  'Жуынатын бөлмеге арналған қалың аяқ сүлгісі. Аса жоғары төзімділік пен ылғал сіңіргіштік.',
  'towels', 3.10, 150, 5,
  ARRAY['https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80'],
  '100% Хлопок', 750
),
(
  'p303-3333-3333-3333-333333333333',
  '33333333-cccc-cccc-cccc-cccccccccccc',
  'Şal Yaka Lüks Otel Bornozu (Unisex, %100 Pamuk)',
  'Махровый гостиничный халат с шалевым воротником (Унисекс)',
  'Шалфей жағалы қонақүй түкті халаты (Унисекс)',
  'İçi ve dışı yumuşacık bukle havlu, derin cepli ve kemerli lüks otel bornozu.',
  'Классический белый гостиничный халат из стриженной мягкой махры. Удобный глубокий запах, прочный пояс, вышивка логотипа под заказ.',
  'Классикалық ақ түсті қонақүй халаты. Ыңғайлы белбеу, тапсырыспен логотип кестелеу мүмкіндігі.',
  'towels', 18.90, 40, 14,
  ARRAY['https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=800&q=80'],
  '100% Хлопок 400 г/м²', 400
),
(
  'p304-3333-3333-3333-333333333333',
  '33333333-cccc-cccc-cccc-cccccccccccc',
  'Bambu & Pamuk Karışımlı İpeksi Çift Kişilik Nevresim Takımı',
  'Бамбуково-хлопковый шелковистый комплект белья (Евро)',
  'Бамбук пен мақтадан жасалған жібектей төсек-орын жиынтығы',
  '%60 Bambu %40 Pamuk. Doğal antibakteriyel, serinletici ve ekstra yumuşak lüks kumaş.',
  '60% натуральный бамбук, 40% хлопок. Обладает природными антибактериальными свойствами, шелковистый на ощупь, идеален для лета.',
  '60% табиғи бамбук, 40% мақта. Табиғи бактерияға қарсы қасиетке ие, ұстағанда жібектей жұмсақ.',
  'bedding', 26.00, 30, 12,
  ARRAY['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80'],
  '60% Бамбуковое волокно, 40% Хлопок', 145
),
(
  'p305-3333-3333-3333-333333333333',
  '33333333-cccc-cccc-cccc-cccccccccccc',
  'Nordic Kabartmalı Polar Sherpa Battaniye 200x220 cm',
  'Утепленный двухслойный плед Шерпа 200x220 см (Flannel + Lambswool)',
  'Жылытылған екі қабатты Шерпа пледі 200x220 см',
  'Bir yüzü kadife dokulu flanel, diğer yüzü sıcacık kuzu tüyü taklidi sherpa. Kış sezonunun en popüler toptan ürünü.',
  'Двусторонний зимний плед: сверху мягкий велюровый фланель, снизу густая овечья шерпа. Хит оптовых продаж в Казахстане в осенне-зимний сезон.',
  'Екі қабатты қысқы плед: үсті жұмсақ фланель, асты қалың қой жүні (шерпа). Қазақстанда қыс маусымында өте сұранысқа ие.',
  'plaids', 15.50, 35, 10,
  ARRAY['https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80'],
  '100% Микрофибра Flannel/Sherpa', 460
);
