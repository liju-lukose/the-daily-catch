import React, { createContext, useContext, useState, useCallback } from 'react';
import { CartItem, FishProduct, KitchenMenuItem, DeliverySlot, PaymentType } from './types';

interface CartContextType {
  items: CartItem[];
  addItem: (product: FishProduct | KitchenMenuItem, options?: { weight?: number; storeId?: string; cuttingType?: string; cuttingPrice?: number; deliveryInstructions?: string; customerNote?: string; quantity?: number }) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  deliverySlot: DeliverySlot | null;
  setDeliverySlot: (slot: DeliverySlot) => void;
  paymentType: PaymentType;
  setPaymentType: (type: PaymentType) => void;
  hasPreOrderItems: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [deliverySlot, setDeliverySlot] = useState<DeliverySlot | null>(null);
  const [paymentType, setPaymentType] = useState<PaymentType>('full');

  const addItem = useCallback((product: FishProduct | KitchenMenuItem, options?: { weight?: number; storeId?: string; cuttingType?: string; cuttingPrice?: number; deliveryInstructions?: string; customerNote?: string; quantity?: number }) => {
    const qty = options?.quantity ?? 1;
    setItems(prev => {
      const existing = prev.find(i => i.product.id === product.id && i.weight === options?.weight && i.cuttingType === options?.cuttingType);
      if (existing) {
        return prev.map(i =>
          i.product.id === product.id && i.weight === options?.weight && i.cuttingType === options?.cuttingType
            ? { ...i, quantity: i.quantity + qty }
            : i
        );
      }
      return [...prev, {
        product,
        quantity: qty,
        weight: options?.weight,
        storeId: options?.storeId,
        cuttingType: options?.cuttingType,
        cuttingPrice: options?.cuttingPrice,
        deliveryInstructions: options?.deliveryInstructions,
        customerNote: options?.customerNote,
      }];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems(prev => prev.filter(i => i.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems(prev => prev.filter(i => i.product.id !== productId));
    } else {
      setItems(prev => prev.map(i => i.product.id === productId ? { ...i, quantity } : i));
    }
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setDeliverySlot(null);
    setPaymentType('full');
  }, []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => {
    const basePrice = 'pricePerKg' in i.product
      ? (i.product.pricePerKg * (i.weight || 1000) / 1000)
      : i.product.price;
    const cuttingCharge = i.cuttingPrice ?? 0;
    return sum + (basePrice * i.quantity) + cuttingCharge;
  }, 0);

  const totalCuttingCharges = items.reduce((sum, i) => sum + (i.cuttingPrice ?? 0), 0);

  const hasPreOrderItems = items.some(i => 'isPreOrder' in i.product && (i.product as FishProduct).isPreOrder);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice, deliverySlot, setDeliverySlot, paymentType, setPaymentType, hasPreOrderItems }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
