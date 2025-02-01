// src/contexts/AuthContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { APP_CONFIG } from '@/config/urls';

// Add type for credentials
type TestCredentials = {
  [key: string]: {
    password: string;
    type: string;
  }
};

const TEST_CREDENTIALS: TestCredentials = {
  'lender@healthera.ai': {
    password: 'lender0101',
    type: 'lender'
  },
  'applicant@healthera.ai': {
    password: 'applicant0101',
    type: 'applicant'
  }
};

interface User {
  id: string;
  email: string;
  userType: 'lender' | 'applicant';
  type?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: string | null;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const isDevelopment = process.env.NODE_ENV === 'development';

const getInitialAuthState = () => {
  if (typeof window !== 'undefined') {
    try {
      const storedAuth = localStorage.getItem('isAuthenticated');
      const storedRole = localStorage.getItem('userRole');
      const storedUser = localStorage.getItem('user');
      
      if (storedAuth === 'true' && storedRole) {
        return {
          isAuthenticated: true,
          userRole: storedRole,
          user: storedUser ? JSON.parse(storedUser) : null
        };
      }
    } catch (error) {
      console.error('Error restoring auth state:', error);
    }
  }
  return {
    isAuthenticated: false,
    userRole: null,
    user: null
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initialState = getInitialAuthState();
  const [isAuthenticated, setIsAuthenticated] = useState(initialState.isAuthenticated);
  const [userRole, setUserRole] = useState<string | null>(initialState.userRole);
  const [user, setUser] = useState<User | null>(initialState.user);
  const router = useRouter();

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${APP_CONFIG.baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Login failed');
      }

      const data = await response.json();
      
      setIsAuthenticated(true);
      setUserRole(data.user.type);
      setUser(data.user);

      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', data.user.type);
      localStorage.setItem('user', JSON.stringify(data.user));

      router.push(userRole === 'lender' ? '/lender-dashboard' : '/applicant-dashboard');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = useCallback(async () => {
    try {
      if (!isDevelopment) {
        await fetch(`${APP_CONFIG.baseUrl}/api/auth/logout`, {
          method: 'POST',
          credentials: 'include'
        });
      }

      setIsAuthenticated(false);
      setUserRole(null);
      setUser(null);
      localStorage.clear();
      router.push(`${APP_CONFIG.baseUrl}/`);
      
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear state on error
      setIsAuthenticated(false);
      setUserRole(null);
      setUser(null);
      localStorage.clear();
      router.push(`${APP_CONFIG.baseUrl}/`);
    }
  }, [router]);

  // Route protection
  useEffect(() => {
    if (!isAuthenticated) {
      const currentPath = window.location.pathname;
      if (currentPath.includes('dashboard')) {
        router.push(`${APP_CONFIG.baseUrl}/`);
      }
    }
  }, [isAuthenticated, router]);

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      userRole,
      user,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;