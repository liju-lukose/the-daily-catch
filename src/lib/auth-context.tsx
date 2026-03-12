import React, { createContext, useContext, useState, useCallback } from 'react';
import { User, UserRole } from './types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => { success: boolean; error?: string };
  register: (name: string, email: string, phone: string, password: string) => void;
  logout: () => void;
}

// Hardcoded users
const HARDCODED_USERS: { email: string; password: string; user: User }[] = [
  {
    email: 'customer@test.com',
    password: '123456',
    user: {
      id: 'user-customer',
      name: 'Test Customer',
      email: 'customer@test.com',
      phone: '+91 9876543210',
      role: 'customer',
      createdAt: '2024-01-01T00:00:00Z',
    },
  },
  {
    email: 'seller@test.com',
    password: '123456',
    user: {
      id: 'user-seller',
      name: 'Test Seller',
      email: 'seller@test.com',
      phone: '+91 9876543211',
      role: 'seller',
      createdAt: '2024-01-01T00:00:00Z',
    },
  },
  {
    email: 'admin@test.com',
    password: '123456',
    user: {
      id: 'user-admin',
      name: 'Test Admin',
      email: 'admin@test.com',
      phone: '+91 9876543212',
      role: 'admin',
      createdAt: '2024-01-01T00:00:00Z',
    },
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback((email: string, password: string): { success: boolean; error?: string } => {
    const found = HARDCODED_USERS.find(u => u.email === email.toLowerCase() && u.password === password);
    if (found) {
      setUser(found.user);
      return { success: true };
    }
    return { success: false, error: 'Invalid email or password' };
  }, []);

  const register = useCallback((name: string, email: string, phone: string, _password: string) => {
    setUser({
      id: 'user-' + Date.now(),
      name,
      email,
      phone,
      role: 'customer',
      createdAt: new Date().toISOString(),
    });
  }, []);

  const logout = useCallback(() => setUser(null), []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
