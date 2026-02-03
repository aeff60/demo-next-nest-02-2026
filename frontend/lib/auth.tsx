'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { User, AuthResponse } from '@/lib/types';
import { authAPI } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginLdap: (username: string, password: string) => Promise<void>;
  logout: () => void;
  refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  // Load user from cookie on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = Cookies.get('access_token');
        if (token) {
          const userData = await authAPI.getProfile();
          setUser(userData);
        }
      } catch (error) {
        console.error('Failed to load user:', error);
        // Clear invalid token
        Cookies.remove('access_token');
        Cookies.remove('user');
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response: AuthResponse = await authAPI.login(email, password);
      
      // Save token and user to cookies
      Cookies.set('access_token', response.access_token, { expires: 7 });
      Cookies.set('user', JSON.stringify(response.user), { expires: 7 });
      
      setUser(response.user);
    } catch (error) {
      throw error;
    }
  };

  const loginLdap = async (username: string, password: string) => {
    try {
      const response: AuthResponse = await authAPI.loginLdap(username, password);
      
      // Save token and user to cookies
      Cookies.set('access_token', response.access_token, { expires: 7 });
      Cookies.set('user', JSON.stringify(response.user), { expires: 7 });
      
      setUser(response.user);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    Cookies.remove('access_token');
    Cookies.remove('user');
    setUser(null);
  };

  const refetchUser = async () => {
    try {
      const userData = await authAPI.getProfile();
      setUser(userData);
    } catch (error) {
      console.error('Failed to refetch user:', error);
      logout();
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    loginLdap,
    logout,
    refetchUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}