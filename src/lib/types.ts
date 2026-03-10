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
  freshnessTags: string[];
  origin?: string;
  isUrbanFish: boolean;
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

export interface CartItem {
  product: FishProduct | KitchenMenuItem;
  quantity: number;
  weight?: number;
  storeId?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'packed' | 'out_for_delivery' | 'delivered' | 'cancelled';
  deliveryAddress: Address;
  createdAt: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
}

export interface Address {
  id: string;
  userId: string;
  label: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
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
