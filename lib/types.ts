export type UserRole = 'buyer' | 'supplier' | 'admin';

export type Language = 'ru' | 'tr' | 'kk';

export type OrderStatus =
  | 'new'
  | 'accepted_by_supplier'
  | 'paid_in_escrow'
  | 'in_production'
  | 'shipped'
  | 'delivered'
  | 'completed'
  | 'cancelled'
  | 'dispute';

export interface Profile {
  id: string;
  role: UserRole;
  name: string;
  company?: string;
  phone?: string;
  country: 'KZ' | 'TR';
  city: string;
  language: Language;
  avatar_url?: string;
}

export interface Supplier {
  id: string;
  profile_id: string;
  factory_name: string;
  description: string;
  city: string;
  address?: string;
  verified: boolean;
  rating: number;
  banner_url?: string;
  certificates: string[];
  founded_year?: number;
}

export type ProductCategory = 'bedding' | 'towels' | 'plaids' | 'fabrics' | 'apparel';

export interface Product {
  id: string;
  supplier_id: string;
  title_tr: string;
  title_ru: string;
  title_kk?: string;
  description_tr: string;
  description_ru: string;
  description_kk?: string;
  category: ProductCategory;
  price_usd: number;
  moq: number; // Minimum order quantity
  lead_time_days: number;
  images: string[];
  composition?: string;
  density_gsm?: number;
  in_stock: boolean;
  supplier?: Supplier;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price_usd: number;
  product?: Product;
}

export interface DeliveryAddress {
  city: string;
  street: string;
  building: string;
  postal_code?: string;
  recipient_name: string;
  recipient_phone: string;
}

export interface OrderEvent {
  id: string;
  order_id: string;
  status: OrderStatus;
  note?: string;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  buyer_id: string;
  supplier_id: string;
  status: OrderStatus;
  subtotal_usd: number;
  commission_usd: number; // 5%
  delivery_usd: number;
  total_usd: number;
  fx_rate_kzt: number;
  total_kzt: number;
  delivery_address: DeliveryAddress;
  notes?: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
  buyer?: Profile;
  supplier?: Supplier;
  events?: OrderEvent[];
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  original_text: string;
  original_lang: Language;
  translated_text: string;
  attachment_url?: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  buyer_id: string;
  supplier_id: string;
  product_id?: string;
  last_message_at: string;
  created_at: string;
  buyer?: Profile;
  supplier?: Supplier;
  product?: Product;
  messages?: Message[];
}
