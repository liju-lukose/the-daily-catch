export type UserRole = 'customer' | 'seller' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
}

export interface Store {
  id: string;
  sellerId: string;
  name: string;
  description: string;
  logo?: string;
  rating: number;
  reviewCount: number;
  deliveryRadius: number;
  operatingHours: string;
  isApproved: boolean;
  isActive: boolean;
  contactPerson?: string;
  phone?: string;
  email?: string;
  address?: string;
  profilePhoto?: string;
  yearStarted?: number;
}

export interface Expense {
  id: string;
  name: string;
  description: string;
  amount: number;
  date: string;
  approverName: string;
  approverEmail: string;
}

export interface AdminFishProduct {
  id: string;
  name: string;
  batchId: string;
  purchaseDate: string;
  purchasedPerson: string;
  approverName: string;
  approverEmail: string;
  quantity: number;
  purchaseRate: number;
  sellingRate: number;
  sellingUnit: 'count' | 'kg';
  purchasePlace: string;
  expectedProfit: number;
  expiryDate: string;
  isCatchOfTheDay: boolean;
}

export interface CuttingType {
  id: string;
  name: string;
  image: string;
  description?: string;
}

export interface FishProduct {
  id: string;
  storeId?: string;
  name: string;
  description: string;
  category: string;
  image: string;
  pricePerKg: number;
  weightOptions: number[];
  stock: number;
  isCatchOfTheDay: boolean;
  isPreOrder: boolean;
  freshnessTags: string[];
  origin?: string;
  isUrbanFish: boolean;
  cuttingTypes?: CuttingType[];
}

export interface KitchenMenuItem {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  category: string;
  isAvailable: boolean;
  preparationTime: number;
  calories?: number;
  tags: string[];
}

export type DeliverySlot = 'morning' | 'evening';
export type PaymentType = 'full' | 'partial';

export interface CartItem {
  product: FishProduct | KitchenMenuItem;
  quantity: number;
  weight?: number;
  storeId?: string;
  cuttingType?: string;
  deliveryInstructions?: string;
  customerNote?: string;
}

export interface OrderConfirmation {
  orderId: string;
  items: CartItem[];
  total: number;
  deliverySlot: DeliverySlot;
  paymentType: PaymentType;
  address: Address;
  createdAt: string;
}

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  items: CartItem[];
  total: number;
  status: 'pre_order' | 'order_received' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  deliveryAddress: Address;
  createdAt: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
  isPreOrder?: boolean;
  convertedFromPreOrder?: boolean;
  deliverySlot?: DeliverySlot;
  paymentType?: PaymentType;
}

export interface Address {
  id: string;
  userId: string;
  label: string;
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  lat?: number;
  lng?: number;
  isDefault: boolean;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  productId?: string;
  storeId?: string;
  rating: number;
  comment: string;
  createdAt: string;
}
