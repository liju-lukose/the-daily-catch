import type { FishProduct, KitchenMenuItem, Store, Order, Expense, AdminFishProduct } from '@/lib/types';
import {
  mockCatchOfTheDay,
  mockUrbanFishProducts,
  mockPreOrderFish,
  mockKitchenMenu,
  mockStores,
  mockStoreProducts,
  mockOrders,
} from '@/lib/mock-data';

// Initial data for admin products & expenses
const initialExpenses: Expense[] = [
  { id: 'exp-1', name: 'Ice Purchase', description: 'Daily ice supply', amount: 2000, date: '2026-03-13', approverName: 'Admin', approverEmail: 'admin@test.com' },
  { id: 'exp-2', name: 'Supplier Payment', description: 'Fish supplier', amount: 8000, date: '2026-03-12', approverName: 'Admin', approverEmail: 'admin@test.com' },
  { id: 'exp-3', name: 'Fuel Expense', description: 'Delivery fuel', amount: 1200, date: '2026-03-11', approverName: 'Admin', approverEmail: 'admin@test.com' },
  { id: 'exp-4', name: 'Packaging Materials', description: 'Boxes and bags', amount: 900, date: '2026-03-10', approverName: 'Admin', approverEmail: 'admin@test.com' },
  { id: 'exp-5', name: 'Staff Salary', description: 'Monthly salary', amount: 5000, date: '2026-03-01', approverName: 'Admin', approverEmail: 'admin@test.com' },
  { id: 'exp-6', name: 'Electricity', description: 'Cold storage', amount: 1500, date: '2026-03-05', approverName: 'Admin', approverEmail: 'admin@test.com' },
  { id: 'exp-7', name: 'Rent', description: 'Shop rent', amount: 3000, date: '2026-03-01', approverName: 'Admin', approverEmail: 'admin@test.com' },
];

const initialAdminProducts: AdminFishProduct[] = [
  { id: 'ap-1', name: 'Seer Fish', batchId: 'B001', purchaseDate: '2026-03-10', purchasedPerson: 'Raju', approverName: 'Admin', approverEmail: 'admin@test.com', quantity: 25, purchaseRate: 400, sellingRate: 650, sellingUnit: 'kg', purchasePlace: 'Chennai Harbor', expectedProfit: 6250, expiryDate: '2026-05-12', isCatchOfTheDay: true },
  { id: 'ap-2', name: 'Pomfret', batchId: 'B002', purchaseDate: '2026-03-11', purchasedPerson: 'Suresh', approverName: 'Admin', approverEmail: 'admin@test.com', quantity: 40, purchaseRate: 300, sellingRate: 500, sellingUnit: 'kg', purchasePlace: 'Mumbai Dock', expectedProfit: 8000, expiryDate: '2026-05-15', isCatchOfTheDay: false },
  { id: 'ap-3', name: 'Prawns', batchId: 'B003', purchaseDate: '2026-03-12', purchasedPerson: 'Raju', approverName: 'Admin', approverEmail: 'admin@test.com', quantity: 100, purchaseRate: 8, sellingRate: 15, sellingUnit: 'count', purchasePlace: 'Kochi Market', expectedProfit: 700, expiryDate: '2026-04-20', isCatchOfTheDay: true },
];

// In-memory stores for mock mutation responses
let _expenses = [...initialExpenses];
let _adminProducts = [...initialAdminProducts];
let _stores = [...mockStores];
let _orders = [...mockOrders];
let _dishes = [...mockKitchenMenu];

// Helper to simulate network delay
const delay = (ms = 600) => new Promise(r => setTimeout(r, ms));

// ── Fish mock responses ──
export const fishMock = {
  async getAll(): Promise<FishProduct[]> {
    await delay();
    return [...mockUrbanFishProducts];
  },
  async getCatchOfTheDay(): Promise<FishProduct[]> {
    await delay();
    return [...mockCatchOfTheDay];
  },
  async getById(id: string): Promise<FishProduct | undefined> {
    await delay();
    const all = [...mockUrbanFishProducts, ...Object.values(mockStoreProducts).flat()];
    return all.find(p => p.id === id);
  },
  async getCuttingTypes(id: string) {
    await delay();
    const product = [...mockUrbanFishProducts, ...Object.values(mockStoreProducts).flat()].find(p => p.id === id);
    return product?.cuttingTypes ?? [];
  },
};

// ── Dish mock responses ──
export const dishMock = {
  async getAll(): Promise<KitchenMenuItem[]> {
    await delay();
    return [..._dishes];
  },
  async create(dish: Omit<KitchenMenuItem, 'id'>): Promise<KitchenMenuItem> {
    await delay();
    const newDish = { ...dish, id: `km-${Date.now()}` } as KitchenMenuItem;
    _dishes = [newDish, ..._dishes];
    return newDish;
  },
  async update(id: string, data: Partial<KitchenMenuItem>): Promise<KitchenMenuItem> {
    await delay();
    _dishes = _dishes.map(d => d.id === id ? { ...d, ...data } : d);
    return _dishes.find(d => d.id === id)!;
  },
  async delete(id: string): Promise<void> {
    await delay();
    _dishes = _dishes.filter(d => d.id !== id);
  },
};

// ── Order mock responses ──
export const orderMock = {
  async getAll(): Promise<Order[]> {
    await delay();
    return [..._orders];
  },
  async create(order: Omit<Order, 'id'>): Promise<Order> {
    await delay();
    const newOrder = { ...order, id: `ORD-${Date.now()}` } as Order;
    _orders = [newOrder, ..._orders];
    return newOrder;
  },
  async updateStatus(id: string, status: Order['status']): Promise<Order> {
    await delay();
    _orders = _orders.map(o => o.id === id ? { ...o, status } : o);
    return _orders.find(o => o.id === id)!;
  },
  async convertPreOrder(id: string): Promise<Order> {
    await delay();
    _orders = _orders.map(o => o.id === id ? { ...o, status: 'order_received' as const, isPreOrder: false, convertedFromPreOrder: true } : o);
    return _orders.find(o => o.id === id)!;
  },
};

// ── Admin Product mock responses ──
export const productMock = {
  async getAll(): Promise<AdminFishProduct[]> {
    await delay();
    return [..._adminProducts];
  },
  async create(product: Omit<AdminFishProduct, 'id'>): Promise<AdminFishProduct> {
    await delay();
    const newProd = { ...product, id: `ap-${Date.now()}` } as AdminFishProduct;
    _adminProducts = [newProd, ..._adminProducts];
    return newProd;
  },
};

// ── Store mock responses ──
export const storeMock = {
  async getAll(): Promise<Store[]> {
    await delay();
    return [..._stores];
  },
  async create(store: Omit<Store, 'id'>): Promise<Store> {
    await delay();
    const newStore = { ...store, id: `store-${Date.now()}` } as Store;
    _stores = [newStore, ..._stores];
    return newStore;
  },
  async getProducts(storeId: string): Promise<FishProduct[]> {
    await delay();
    return mockStoreProducts[storeId] ?? [];
  },
};

// ── Expense mock responses ──
export const expenseMock = {
  async getAll(): Promise<Expense[]> {
    await delay();
    return [..._expenses];
  },
  async create(expense: Omit<Expense, 'id'>): Promise<Expense> {
    await delay();
    const newExp = { ...expense, id: `exp-${Date.now()}` } as Expense;
    _expenses = [newExp, ..._expenses];
    return newExp;
  },
};

// ── Auth mock responses ──
export const authMock = {
  async login(email: string, password: string) {
    await delay(400);
    const users = [
      { email: 'customer@test.com', password: '123456', user: { id: 'user-customer', name: 'Test Customer', email: 'customer@test.com', phone: '+91 9876543210', role: 'customer' as const, createdAt: '2024-01-01T00:00:00Z' } },
      { email: 'seller@test.com', password: '123456', user: { id: 'user-seller', name: 'Test Seller', email: 'seller@test.com', phone: '+91 9876543211', role: 'seller' as const, createdAt: '2024-01-01T00:00:00Z' } },
      { email: 'admin@test.com', password: '123456', user: { id: 'user-admin', name: 'Test Admin', email: 'admin@test.com', phone: '+91 9876543212', role: 'admin' as const, createdAt: '2024-01-01T00:00:00Z' } },
    ];
    const found = users.find(u => u.email === email.toLowerCase() && u.password === password);
    if (found) return { success: true, user: found.user, token: 'mock-jwt-token' };
    return { success: false, error: 'Invalid email or password' };
  },
};
