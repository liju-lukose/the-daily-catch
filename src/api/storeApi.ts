import apiClient from './apiClient';
import { storeMock } from '@/services/mockData';
import type { Store, FishProduct } from '@/lib/types';

const USE_MOCK = true;

export const storeApi = {
  async getAll(): Promise<Store[]> {
    if (USE_MOCK) return storeMock.getAll();
    const { data } = await apiClient.get('/stores');
    return data;
  },

  async create(store: Omit<Store, 'id'>): Promise<Store> {
    if (USE_MOCK) return storeMock.create(store);
    const { data } = await apiClient.post('/stores', store);
    return data;
  },

  async getProducts(storeId: string): Promise<FishProduct[]> {
    if (USE_MOCK) return storeMock.getProducts(storeId);
    const { data } = await apiClient.get(`/stores/${storeId}/products`);
    return data;
  },
};
