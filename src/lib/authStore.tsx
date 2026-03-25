import React, { createContext, useContext, useState, useEffect } from 'react';

export type AccountType = 'Customer' | 'Helper';

export interface User {
  fullName: string;
  email: string;
  phone: string;
  accountType: AccountType;
  selectedServices?: string[];
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('blitzwerk_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error('Failed to parse blitzwerk_user from localStorage', e);
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('blitzwerk_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('blitzwerk_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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
