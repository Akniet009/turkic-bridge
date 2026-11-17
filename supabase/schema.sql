-- ==============================================================================
-- B2B ПЛАТФОРМА «ТЮРКСКИЙ МОСТ» (TURKIC BRIDGE)
-- База данных Supabase (PostgreSQL) с Row Level Security (RLS)
-- ==============================================================================

-- 1. ENUM ТИПЫ
CREATE TYPE user_role AS ENUM ('buyer', 'supplier', 'admin');

CREATE TYPE order_status AS ENUM (
  'new',
  'accepted_by_supplier',
  'paid_in_escrow',
  'in_production',
  'shipped',
  'delivered',
  'completed',
  'cancelled',
  'dispute'
);

-- 2. ТАБЛИЦА ПРОФИЛЕЙ (СВЯЗАНА С AUTH.USERS)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'buyer',
  name TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  country TEXT NOT NULL DEFAULT 'KZ', -- 'KZ' или 'TR'
  city TEXT NOT NULL DEFAULT 'Алматы',
  language TEXT NOT NULL DEFAULT 'ru', -- 'ru', 'tr', 'kk'
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. ТАБЛИЦА ПОСТАВЩИКОВ (ТУРЕЦКИЕ ФАБРИКИ)
CREATE TABLE IF NOT EXISTS suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  factory_name TEXT NOT NULL,
  description TEXT,
  city TEXT NOT NULL, -- Денизли, Бурса, Стамбул и т.д.
  address TEXT,
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  rating NUMERIC(3, 2) NOT NULL DEFAULT 5.00,
  banner_url TEXT,
  certificates TEXT[] DEFAULT ARRAY[]::TEXT[],
  founded_year INTEGER DEFAULT 2010,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. ТАБЛИЦА ТОВАРОВ (ТЕКСТИЛЬНАЯ ПРОДУКЦИЯ)
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
  title_tr TEXT NOT NULL,
  title_ru TEXT NOT NULL,
  title_kk TEXT,
  description_tr TEXT NOT NULL,
  description_ru TEXT NOT NULL,
  description_kk TEXT,
  category TEXT NOT NULL, -- 'bedding', 'towels', 'plaids', 'fabrics', 'apparel'
  price_usd NUMERIC(10, 2) NOT NULL CHECK (price_usd > 0),
  moq INTEGER NOT NULL DEFAULT 50 CHECK (moq > 0), -- Минимальный объем заказа
  lead_time_days INTEGER NOT NULL DEFAULT 14, -- Срок производства (в днях)
  images TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  composition TEXT, -- Состав ткани, напр. 100% Эгейский хлопок, Сатин 300ТС
  density_gsm INTEGER, -- Плотность (г/м²)
  in_stock BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. ДИАЛОГИ И РЕАЛТАЙМ ЧАТ (С АВТОПЕРЕВОДОМ)
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  last_message_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_buyer_supplier_product UNIQUE (buyer_id, supplier_id, product_id)
);

CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  original_text TEXT NOT NULL,
  original_lang TEXT NOT NULL DEFAULT 'ru', -- 'ru', 'tr', 'kk'
  translated_text TEXT NOT NULL, -- автоматический перевод на язык получателя
  attachment_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. ЗАКАЗЫ И БЕЗОПАСНАЯ СДЕЛКА (ESCROW) С КОМИССИЕЙ 5%
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL, -- Формат: 'TB-2026-XXXX'
  buyer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE RESTRICT,
  status order_status NOT NULL DEFAULT 'new',
  subtotal_usd NUMERIC(10, 2) NOT NULL CHECK (subtotal_usd >= 0),
  commission_usd NUMERIC(10, 2) NOT NULL CHECK (commission_usd >= 0), -- 5% комиссия платформы
  delivery_usd NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  total_usd NUMERIC(10, 2) NOT NULL CHECK (total_usd >= 0),
  fx_rate_kzt NUMERIC(10, 2) NOT NULL DEFAULT 500.00,
  total_kzt NUMERIC(12, 2) NOT NULL CHECK (total_kzt >= 0),
  delivery_address JSONB NOT NULL, -- {city, street, building, recipient_name, phone}
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price_usd NUMERIC(10, 2) NOT NULL CHECK (unit_price_usd > 0)
);

CREATE TABLE IF NOT EXISTS order_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status order_status NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. ROW LEVEL SECURITY (RLS) ПОЛИТИКИ

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_events ENABLE ROW LEVEL SECURITY;

-- Profiles: чтение открыто (для просмотра имен), редактирование только своего
CREATE POLICY "Profiles readable by authenticated users" ON profiles
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Suppliers: общедоступны для чтения в каталоге
CREATE POLICY "Suppliers publicly readable" ON suppliers
  FOR SELECT TO public USING (true);

CREATE POLICY "Suppliers managed by owner" ON suppliers
  FOR ALL TO authenticated USING (profile_id = auth.uid());

CREATE POLICY "Admin manages all suppliers" ON suppliers
  FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Products: каталог доступен всем
CREATE POLICY "Products publicly readable" ON products
  FOR SELECT TO public USING (true);

CREATE POLICY "Suppliers manage their own products" ON products
  FOR ALL TO authenticated USING (
    supplier_id IN (SELECT id FROM suppliers WHERE profile_id = auth.uid())
  );

-- Conversations & Messages: только участники и админ
CREATE POLICY "Conversations viewable by participants and admin" ON conversations
  FOR SELECT TO authenticated USING (
    buyer_id = auth.uid() OR
    supplier_id IN (SELECT id FROM suppliers WHERE profile_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Conversations insertable by buyers" ON conversations
  FOR INSERT TO authenticated WITH CHECK (
    buyer_id = auth.uid() OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Messages viewable by conversation participants" ON messages
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM conversations c
      WHERE c.id = messages.conversation_id
      AND (
        c.buyer_id = auth.uid() OR
        c.supplier_id IN (SELECT id FROM suppliers WHERE profile_id = auth.uid()) OR
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
      )
    )
  );

CREATE POLICY "Messages insertable by conversation participants" ON messages
  FOR INSERT TO authenticated WITH CHECK (
    sender_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM conversations c
      WHERE c.id = messages.conversation_id
      AND (
        c.buyer_id = auth.uid() OR
        c.supplier_id IN (SELECT id FROM suppliers WHERE profile_id = auth.uid()) OR
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
      )
    )
  );

-- Orders: покупатель видит свои, поставщик видит входящие, админ видит всё
CREATE POLICY "Orders viewable by participants and admin" ON orders
  FOR SELECT TO authenticated USING (
    buyer_id = auth.uid() OR
    supplier_id IN (SELECT id FROM suppliers WHERE profile_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Buyers can create orders" ON orders
  FOR INSERT TO authenticated WITH CHECK (buyer_id = auth.uid());

CREATE POLICY "Participants can update order status" ON orders
  FOR UPDATE TO authenticated USING (
    buyer_id = auth.uid() OR
    supplier_id IN (SELECT id FROM suppliers WHERE profile_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Order items viewable by order participants" ON order_items
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM orders o
      WHERE o.id = order_items.order_id
      AND (
        o.buyer_id = auth.uid() OR
        o.supplier_id IN (SELECT id FROM suppliers WHERE profile_id = auth.uid()) OR
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
      )
    )
  );

CREATE POLICY "Order items insertable with order" ON order_items
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM orders o WHERE o.id = order_items.order_id AND o.buyer_id = auth.uid())
  );

CREATE POLICY "Order events viewable by order participants" ON order_events
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM orders o
      WHERE o.id = order_events.order_id
      AND (
        o.buyer_id = auth.uid() OR
        o.supplier_id IN (SELECT id FROM suppliers WHERE profile_id = auth.uid()) OR
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
      )
    )
  );

CREATE POLICY "Order events insertable by participants" ON order_events
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders o
      WHERE o.id = order_events.order_id
      AND (
        o.buyer_id = auth.uid() OR
        o.supplier_id IN (SELECT id FROM suppliers WHERE profile_id = auth.uid()) OR
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
      )
    )
  );
