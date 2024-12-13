// src/contexts/AuthContext.tsx
'use client';  
'use client';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TEST_CREDENTIALS = {
  email: 'test@healthera.ai',
  password: 'password0101'
};

// Helper function to check if auth cookie exists
const checkAuthCookie = (): boolean => {
  return document.cookie.split(';').some(item => item.trim().startsWith('auth='));
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // Check auth status on mount
  useEffect(() => {
    setIsAuthenticated(checkAuthCookie());
  }, []);

  const login = async (email: string, password: string) => {
    if (email === TEST_CREDENTIALS.email && password === TEST_CREDENTIALS.password) {
      // Set cookie with a specific expiry and secure flags
      document.cookie = `auth=true; path=/; max-age=86400; samesite=strict`;
      setIsAuthenticated(true);
      router.push('/dashboard');
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const logout = useCallback(async () => {
    try {
      // Clear the auth cookie with proper flags
      document.cookie = 'auth=; path=/healthera_ai; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=strict';
      setIsAuthenticated(false);
      
      // Force a hard navigation and clear any cached state
      window.location.href = '/healthera_ai';
      sessionStorage.clear();
      localStorage.clear();
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};