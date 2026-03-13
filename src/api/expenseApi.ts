import apiClient from './apiClient';
import { expenseMock } from '@/services/mockData';
import type { Expense } from '@/lib/types';

const USE_MOCK = true;

export const expenseApi = {
  async getAll(): Promise<Expense[]> {
    if (USE_MOCK) return expenseMock.getAll();
    const { data } = await apiClient.get('/expenses');
    return data;
  },

  async create(expense: Omit<Expense, 'id'>): Promise<Expense> {
    if (USE_MOCK) return expenseMock.create(expense);
    const { data } = await apiClient.post('/expenses', expense);
    return data;
  },
};
