import apiClient from './apiClient';
import { dishMock } from '@/services/mockData';
import type { KitchenMenuItem } from '@/lib/types';

const USE_MOCK = true;

export const dishApi = {
  async getAll(): Promise<KitchenMenuItem[]> {
    if (USE_MOCK) return dishMock.getAll();
    const { data } = await apiClient.get('/dishes');
    return data;
  },

  async create(dish: Omit<KitchenMenuItem, 'id'>): Promise<KitchenMenuItem> {
    if (USE_MOCK) return dishMock.create(dish);
    const { data } = await apiClient.post('/dishes', dish);
    return data;
  },

  async update(id: string, dish: Partial<KitchenMenuItem>): Promise<KitchenMenuItem> {
    if (USE_MOCK) return dishMock.update(id, dish);
    const { data } = await apiClient.put(`/dishes/${id}`, dish);
    return data;
  },

  async delete(id: string): Promise<void> {
    if (USE_MOCK) return dishMock.delete(id);
    await apiClient.delete(`/dishes/${id}`);
  },
};
