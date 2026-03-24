import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fishApi } from '@/api/fishApi';
import { dishApi } from '@/api/dishApi';
import { orderApi } from '@/api/orderApi';
import { productApi } from '@/api/productApi';
import { storeApi } from '@/api/storeApi';
import { expenseApi } from '@/api/expenseApi';
import type { KitchenMenuItem, Order, AdminFishProduct, Store, Expense } from '@/lib/types';

// ── Fish Hooks ──
export const useFishList = () =>
  useQuery({ queryKey: ['fish'], queryFn: fishApi.getAll });

export const useCatchOfTheDay = () =>
  useQuery({ queryKey: ['fish', 'catchOfTheDay'], queryFn: fishApi.getCatchOfTheDay });

export const useFishDetail = (id: string) =>
  useQuery({ queryKey: ['fish', id], queryFn: () => fishApi.getById(id), enabled: !!id });

export const useFishCuttingTypes = (id: string) =>
  useQuery({ queryKey: ['fish', id, 'cuttingTypes'], queryFn: () => fishApi.getCuttingTypes(id), enabled: !!id });

// ── Dish Hooks ──
export const useDishes = () =>
  useQuery({ queryKey: ['dishes'], queryFn: dishApi.getAll });

export const useCreateDish = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dish: Omit<KitchenMenuItem, 'id'>) => dishApi.create(dish),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['dishes'] }),
  });
};

export const useDeleteDish = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => dishApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['dishes'] }),
  });
};

// ── Order Hooks ──
export const useOrders = () =>
  useQuery({ queryKey: ['orders'], queryFn: orderApi.getAll });

export const useCreateOrder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (order: Omit<Order, 'id'>) => orderApi.create(order),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['orders'] }),
  });
};

export const useUpdateOrderStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Order['status'] }) => orderApi.updateStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['orders'] }),
  });
};

export const useConvertPreOrder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => orderApi.convertPreOrder(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['orders'] }),
  });
};

// ── Admin Product Hooks ──
export const useAdminProducts = () =>
  useQuery({ queryKey: ['adminProducts'], queryFn: productApi.getAll });

export const useCreateProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (product: Omit<AdminFishProduct, 'id'>) => productApi.create(product),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['adminProducts'] }),
  });
};

// ── Store Hooks ──
export const useStores = () =>
  useQuery({ queryKey: ['stores'], queryFn: storeApi.getAll });

export const useCreateStore = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (store: Omit<Store, 'id'>) => storeApi.create(store),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['stores'] }),
  });
};

export const useStoreProducts = (storeId: string) =>
  useQuery({ queryKey: ['stores', storeId, 'products'], queryFn: () => storeApi.getProducts(storeId), enabled: !!storeId });

// ── Expense Hooks ──
export const useExpenses = () =>
  useQuery({ queryKey: ['expenses'], queryFn: expenseApi.getAll });

export const useCreateExpense = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (expense: Omit<Expense, 'id'>) => expenseApi.create(expense),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['expenses'] }),
  });
};
