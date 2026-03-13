import apiClient from './apiClient';
import { authMock } from '@/services/mockData';

const USE_MOCK = true;

export const authApi = {
  async login(email: string, password: string) {
    if (USE_MOCK) return authMock.login(email, password);
    const { data } = await apiClient.post('/auth/login', { email, password });
    return data;
  },
};
