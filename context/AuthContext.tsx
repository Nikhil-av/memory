// context/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
// 1. IMPORT the new library
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../api/client';

interface User {
  _id: string;
  username: string;
  email: string;
  // Add other user fields as needed
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  login: (email, password) => Promise<void>;
  register: (userData) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      try {
        // 2. USE the new library's method
        const token = await AsyncStorage.getItem('access_token');
        if (token) {
          setAccessToken(token);
          const response = await apiClient.get('/api/users/me');
          setUser(response.data.user);
        }
      } catch (e) {
        console.error('Failed to load token or user', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadToken();
  }, []);

  const login = async (email, password) => {
    const response = await apiClient.post('/api/auth/login', { email, password });
    const { tokens, user: userData } = response.data;
    // 3. USE the new library's method
    await AsyncStorage.setItem('access_token', tokens.access_token);
    setAccessToken(tokens.access_token);
    setUser(userData);
  };

  const register = async (userData) => {
    const response = await apiClient.post('/api/auth/register', userData);
    const { tokens, user: newUser } = response.data;
    // 4. USE the new library's method
    await AsyncStorage.setItem('access_token', tokens.access_token);
    setAccessToken(tokens.access_token);
    setUser(newUser);
  };

  const logout = async () => {
    // 5. USE the new library's method (note the name change)
    await AsyncStorage.removeItem('access_token');
    setAccessToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};