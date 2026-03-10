import React, { createContext, useContext, useState, useCallback } from 'react';
import { User, UserRole } from './types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role?: UserRole) => void;
  register: (name: string, email: string, phone: string, password: string, role?: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback((email: string, _password: string, role: UserRole = 'customer') => {
    // Mock login
    setUser({
      id: 'user-' + Date.now(),
      name: email.split('@')[0],
      email,
      phone: '+91 9876543210',
      role,
      createdAt: new Date().toISOString(),
    });
  }, []);

  const register = useCallback((name: string, email: string, phone: string, _password: string, role: UserRole = 'customer') => {
    setUser({
      id: 'user-' + Date.now(),
      name,
      email,
      phone,
      role,
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
