// src/contexts/AuthContext.tsx
'use client';  
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: 'lender' | 'applicant' | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TEST_CREDENTIALS = {
  lender: {
    email: 'lender@healthera.ai',
    password: 'lender0101'
  },
  applicant: {
    email: 'applicant@healthera.ai',
    password: 'applicant0101'
  }
};

// Helper function to check if auth cookie exists
const checkAuthCookie = (): { isAuthenticated: boolean; userRole: 'lender' | 'applicant' | null } => {
  const cookies = document.cookie.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = value;
    return acc;
  }, {} as { [key: string]: string });

  return {
    isAuthenticated: cookies.auth === 'true',
    userRole: cookies.userRole as 'lender' | 'applicant' | null
  };
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<'lender' | 'applicant' | null>(null);
  const router = useRouter();

  useEffect(() => {
    const { isAuthenticated: authStatus, userRole: role } = checkAuthCookie();
    setIsAuthenticated(authStatus);
    setUserRole(role);
  }, []);

  const login = async (email: string, password: string) => {
    if (email === TEST_CREDENTIALS.lender.email && password === TEST_CREDENTIALS.lender.password) {
      document.cookie = `auth=true; path=/; max-age=86400; samesite=strict`;
      document.cookie = `userRole=lender; path=/; max-age=86400; samesite=strict`;
      setIsAuthenticated(true);
      setUserRole('lender');
      router.push('/dashboard');
    } else if (email === TEST_CREDENTIALS.applicant.email && password === TEST_CREDENTIALS.applicant.password) {
      document.cookie = `auth=true; path=/; max-age=86400; samesite=strict`;
      document.cookie = `userRole=applicant; path=/; max-age=86400; samesite=strict`;
      setIsAuthenticated(true);
      setUserRole('applicant');
      router.push('/applicant-dashboard');
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const logout = useCallback(async () => {
    try {
      document.cookie = 'auth=; path=/healthera_ai; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=strict';
      document.cookie = 'userRole=; path=/healthera_ai; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=strict';
      setIsAuthenticated(false);
      setUserRole(null);
      window.location.href = '/healthera_ai';
      sessionStorage.clear();
      localStorage.clear();
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, login, logout }}>
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