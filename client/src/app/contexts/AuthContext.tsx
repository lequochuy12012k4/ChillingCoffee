'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { signOut } from 'next-auth/react';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string, email: string) => void;
  logout: () => void;
  updateUser: (userData: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('authToken');
      const email = localStorage.getItem('userEmail');
      
      if (token && email) {
        setToken(token);
        try {
          const response = await fetch('/api/auth/profile', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            // Token is invalid, clear storage
            localStorage.removeItem('authToken');
            localStorage.removeItem('userEmail');
            setToken(null);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          localStorage.removeItem('authToken');
          localStorage.removeItem('userEmail');
          setToken(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (token: string, email: string) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userEmail', email);
    setToken(token);
    // Fetch user profile and set user state
    fetchUserProfile(token);
  };

  const logout = async () => {
    // Clear custom authentication
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    setUser(null);
    setToken(null);
    
    // Also sign out from NextAuth.js to clear Google session
    try {
      await signOut({ redirect: false });
    } catch (error) {
      console.error('Error signing out from NextAuth:', error);
    }
  };

  const updateUser = (userData: User) => {
    setUser(userData);
  };

  const fetchUserProfile = async (token: string) => {
    try {
      const response = await fetch('/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    loading,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
