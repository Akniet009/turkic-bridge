'use client';

import {
  MOCK_PROFILES,
  MOCK_SUPPLIERS,
  MOCK_PRODUCTS,
  MOCK_ORDERS,
  MOCK_CONVERSATIONS,
} from './mock-data';
import {
  Profile,
  Supplier,
  Product,
  Order,
  Conversation,
  Message,
  OrderStatus,
  UserRole,
} from './types';
import { calculateOrderSummary, DEFAULT_USD_KZT_RATE } from './currency';

const STORAGE_KEY_PRODUCTS = 'tb_products';
const STORAGE_KEY_ORDERS = 'tb_orders';
const STORAGE_KEY_CONVS = 'tb_conversations';
const STORAGE_KEY_SUPPLIERS = 'tb_suppliers';
const STORAGE_KEY_USER = 'tb_current_user';

export class AppStore {
  static getSuppliers(): Supplier[] {
    if (typeof window === 'undefined') return MOCK_SUPPLIERS;
    const raw = localStorage.getItem(STORAGE_KEY_SUPPLIERS);
    return raw ? JSON.parse(raw) : MOCK_SUPPLIERS;
  }

  static getSupplierById(id: string): Supplier | undefined {
    return this.getSuppliers().find((s) => s.id === id);
  }

  static getProducts(): Product[] {
    if (typeof window === 'undefined') return MOCK_PRODUCTS;
    const raw = localStorage.getItem(STORAGE_KEY_PRODUCTS);
    const products: Product[] = raw ? JSON.parse(raw) : MOCK_PRODUCTS;
    const suppliers = this.getSuppliers();
    return products.map((p) => ({
      ...p,
      supplier: suppliers.find((s) => s.id === p.supplier_id),
    }));
  }

  static getProductById(id: string): Product | undefined {
    return this.getProducts().find((p) => p.id === id);
  }

  static addProduct(productData: Omit<Product, 'id' | 'supplier'>): Product {
    const products = this.getProducts();
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
    };
    const updated = [newProduct, ...products];
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(updated));
    }
    return newProduct;
  }

  static updateSupplierVerification(supplierId: string, verified: boolean): void {
    const suppliers = this.getSuppliers();
    const updated = suppliers.map((s) =>
      s.id === supplierId ? { ...s, verified } : s
    );
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_SUPPLIERS, JSON.stringify(updated));
    }
  }

  static getOrders(): Order[] {
    if (typeof window === 'undefined') return MOCK_ORDERS;
    const raw = localStorage.getItem(STORAGE_KEY_ORDERS);
    const orders: Order[] = raw ? JSON.parse(raw) : MOCK_ORDERS;
    const suppliers = this.getSuppliers();
    const products = this.getProducts();

    return orders.map((o) => ({
      ...o,
      supplier: suppliers.find((s) => s.id === o.supplier_id),
      buyer: MOCK_PROFILES.find((p) => p.id === o.buyer_id),
      items: o.items?.map((item) => ({
        ...item,
        product: products.find((p) => p.id === item.product_id),
      })),
    }));
  }

  static getOrderById(id: string): Order | undefined {
    return this.getOrders().find((o) => o.id === id);
  }

  static createOrder(params: {
    buyerId: string;
    supplierId: string;
    productId: string;
    quantity: number;
    deliveryAddress: Order['delivery_address'];
    notes?: string;
  }): Order {
    const product = this.getProductById(params.productId);
    if (!product) throw new Error('Product not found');

    const subtotalUsd = Number((product.price_usd * params.quantity).toFixed(2));
    const deliveryUsd = 120.0; // Flat estimation for air/truck shipment to KZ
    const summary = calculateOrderSummary(subtotalUsd, deliveryUsd, DEFAULT_USD_KZT_RATE);

    const now = new Date().toISOString();
    const orderNumber = `TB-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      order_number: orderNumber,
      buyer_id: params.buyerId,
      supplier_id: params.supplierId,
      status: 'new',
      subtotal_usd: summary.subtotalUsd,
      commission_usd: summary.commissionUsd,
      delivery_usd: summary.deliveryUsd,
      total_usd: summary.totalUsd,
      fx_rate_kzt: summary.fxRate,
      total_kzt: summary.totalKzt,
      delivery_address: params.deliveryAddress,
      notes: params.notes,
      created_at: now,
      updated_at: now,
      items: [
        {
          id: `item-${Date.now()}`,
          order_id: `ord-${Date.now()}`,
          product_id: params.productId,
          quantity: params.quantity,
          unit_price_usd: product.price_usd,
        },
      ],
      events: [
        {
          id: `ev-${Date.now()}`,
          order_id: `ord-${Date.now()}`,
          status: 'new',
          note: `Оптовый заказ оформлен. Ожидает подтверждения фабрикой.`,
          created_at: now,
        },
      ],
    };

    const orders = this.getOrders();
    const updated = [newOrder, ...orders];
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(updated));
    }
    return newOrder;
  }

  static updateOrderStatus(orderId: string, newStatus: OrderStatus, note?: string): Order | undefined {
    const orders = this.getOrders();
    const now = new Date().toISOString();

    const updated = orders.map((o) => {
      if (o.id !== orderId) return o;
      const newEvent = {
        id: `ev-${Date.now()}`,
        order_id: o.id,
        status: newStatus,
        note: note || `Статус заказа обновлен на: ${newStatus}`,
        created_at: now,
      };
      return {
        ...o,
        status: newStatus,
        updated_at: now,
        events: [...(o.events || []), newEvent],
      };
    });

    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(updated));
    }
    return updated.find((o) => o.id === orderId);
  }

  static getConversations(): Conversation[] {
    if (typeof window === 'undefined') return MOCK_CONVERSATIONS;
    const raw = localStorage.getItem(STORAGE_KEY_CONVS);
    const convs: Conversation[] = raw ? JSON.parse(raw) : MOCK_CONVERSATIONS;
    const suppliers = this.getSuppliers();
    const products = this.getProducts();

    return convs.map((c) => ({
      ...c,
      supplier: suppliers.find((s) => s.id === c.supplier_id),
      buyer: MOCK_PROFILES.find((p) => p.id === c.buyer_id),
      product: products.find((p) => p.id === c.product_id),
    }));
  }

  static getConversationById(id: string): Conversation | undefined {
    return this.getConversations().find((c) => c.id === id);
  }

  static getOrCreateConversation(buyerId: string, supplierId: string, productId?: string): Conversation {
    const convs = this.getConversations();
    const existing = convs.find(
      (c) => c.buyer_id === buyerId && c.supplier_id === supplierId && (productId ? c.product_id === productId : true)
    );
    if (existing) return existing;

    const newConv: Conversation = {
      id: `conv-${Date.now()}`,
      buyer_id: buyerId,
      supplier_id: supplierId,
      product_id: productId,
      last_message_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      messages: [],
    };

    const updated = [newConv, ...convs];
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_CONVS, JSON.stringify(updated));
    }
    return newConv;
  }

  static addMessage(conversationId: string, message: Omit<Message, 'id' | 'conversation_id' | 'created_at'>): Message {
    const convs = this.getConversations();
    const now = new Date().toISOString();
    const newMsg: Message = {
      ...message,
      id: `msg-${Date.now()}`,
      conversation_id: conversationId,
      created_at: now,
    };

    const updated = convs.map((c) => {
      if (c.id !== conversationId) return c;
      return {
        ...c,
        last_message_at: now,
        messages: [...(c.messages || []), newMsg],
      };
    });

    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_CONVS, JSON.stringify(updated));
    }
    return newMsg;
  }

  // Current User management for instant role switching (Buyer / Supplier / Admin)
  static getCurrentUser(): Profile {
    if (typeof window === 'undefined') return MOCK_PROFILES[3]; // Default to Buyer (Асель Муканова)
    const raw = localStorage.getItem(STORAGE_KEY_USER);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        // fallback
      }
    }
    return MOCK_PROFILES[3];
  }

  static setCurrentUser(profile: Profile): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(profile));
    }
  }

  static switchRole(role: UserRole): Profile {
    const found = MOCK_PROFILES.find((p) => p.role === role) || MOCK_PROFILES[0];
    this.setCurrentUser(found);
    return found;
  }
}
