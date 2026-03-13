import apiClient from './apiClient';
import { fishMock } from '@/services/mockData';
import type { FishProduct } from '@/lib/types';

const USE_MOCK = true; // Toggle to false when backend is ready

export const fishApi = {
  async getAll(): Promise<FishProduct[]> {
    if (USE_MOCK) return fishMock.getAll();
    const { data } = await apiClient.get('/fish');
    return data;
  },

  async getCatchOfTheDay(): Promise<FishProduct[]> {
    if (USE_MOCK) return fishMock.getCatchOfTheDay();
    const { data } = await apiClient.get('/fish?catchOfTheDay=true');
    return data;
  },

  async getById(id: string): Promise<FishProduct | undefined> {
    if (USE_MOCK) return fishMock.getById(id);
    const { data } = await apiClient.get(`/fish/${id}`);
    return data;
  },

  async getCuttingTypes(id: string) {
    if (USE_MOCK) return fishMock.getCuttingTypes(id);
    const { data } = await apiClient.get(`/fish/${id}/cutting-types`);
    return data;
  },
};
