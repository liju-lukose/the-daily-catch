import apiClient from './apiClient';
import { orderMock } from '@/services/mockData';
import type { Order } from '@/lib/types';

const USE_MOCK = true;

export const orderApi = {
  async getAll(): Promise<Order[]> {
    if (USE_MOCK) return orderMock.getAll();
    const { data } = await apiClient.get('/orders');
    return data;
  },

  async create(order: Omit<Order, 'id'>): Promise<Order> {
    if (USE_MOCK) return orderMock.create(order);
    const { data } = await apiClient.post('/orders', order);
    return data;
  },

  async updateStatus(id: string, status: Order['status']): Promise<Order> {
    if (USE_MOCK) return orderMock.updateStatus(id, status);
    const { data } = await apiClient.put(`/orders/${id}/status`, { status });
    return data;
  },

  async convertPreOrder(id: string): Promise<Order> {
    if (USE_MOCK) return orderMock.convertPreOrder(id);
    const { data } = await apiClient.put(`/orders/${id}/convert`);
    return data;
  },
};
