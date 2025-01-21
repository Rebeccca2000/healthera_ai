// src/contexts/AuthContext.tsx
'use client';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// Demo credentials for development
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

interface User {
  id: string;
  email: string;
  userType: 'lender' | 'applicant';
}

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: string | null;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  // Function to check if we're in development mode
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedAuth = localStorage.getItem('isAuthenticated');
    const storedRole = localStorage.getItem('userRole');
    const storedUser = localStorage.getItem('user');
    
    if (storedAuth === 'true' && storedRole) {
      setIsAuthenticated(true);
      setUserRole(storedRole);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // For development, use test credentials
      if (isDevelopment) {
        if (email === TEST_CREDENTIALS.lender.email && 
            password === TEST_CREDENTIALS.lender.password) {
          setIsAuthenticated(true);
          setUserRole('lender');
          const demoUser = {
            id: '1',
            email: TEST_CREDENTIALS.lender.email,
            userType: 'lender' as const
          };
          setUser(demoUser);
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('userRole', 'lender');
          localStorage.setItem('user', JSON.stringify(demoUser));
          router.push('/lender-dashboard');
          return;
        } 
        
        if (email === TEST_CREDENTIALS.applicant.email && 
            password === TEST_CREDENTIALS.applicant.password) {
          setIsAuthenticated(true);
          setUserRole('applicant');
          const demoUser = {
            id: '2',
            email: TEST_CREDENTIALS.applicant.email,
            userType: 'applicant' as const
          };
          setUser(demoUser);
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('userRole', 'applicant');
          localStorage.setItem('user', JSON.stringify(demoUser));
          router.push('/applicant-dashboard');
          return;
        }
      }

      // For production, use the API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const data = await response.json();
      
      setIsAuthenticated(true);
      setUserRole(data.user.type);
      setUser({
        id: data.user.id,
        email: data.user.email,
        userType: data.user.type
      });

      // Store auth state
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', data.user.type);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Redirect based on user type
      if (data.user.type === 'lender') {
        router.push('/lender-dashboard');
      } else {
        router.push('/applicant-dashboard');
      }

    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Invalid credentials');
    }
  };

  const logout = useCallback(async () => {
    try {
      if (!isDevelopment) {
        // Call logout API in production
        await fetch('/api/auth/logout', {
          method: 'POST',
          credentials: 'include'
        });
      }

      // Clear auth state
      setIsAuthenticated(false);
      setUserRole(null);
      setUser(null);
      
      // Clear localStorage
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userRole');
      localStorage.removeItem('user');

      // Redirect to home
      router.push('/');
      
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local state even if API call fails
      setIsAuthenticated(false);
      setUserRole(null);
      setUser(null);
      localStorage.clear();
      router.push('/');
    }
  }, [router, isDevelopment]);

  // Middleware for protected routes
  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated) {
        const currentPath = window.location.pathname;
        if (currentPath.includes('dashboard')) {
          router.push('/');
        }
      }
    };

    checkAuth();
  }, [isAuthenticated, router]);

  const value = {
    isAuthenticated,
    userRole,
    user,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}