import apiClient from './apiClient';
import { productMock } from '@/services/mockData';
import type { AdminFishProduct } from '@/lib/types';

const USE_MOCK = true;

export const productApi = {
  async getAll(): Promise<AdminFishProduct[]> {
    if (USE_MOCK) return productMock.getAll();
    const { data } = await apiClient.get('/products');
    return data;
  },

  async create(product: Omit<AdminFishProduct, 'id'>): Promise<AdminFishProduct> {
    if (USE_MOCK) return productMock.create(product);
    const { data } = await apiClient.post('/products', product);
    return data;
  },
};
