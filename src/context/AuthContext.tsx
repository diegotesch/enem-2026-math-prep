import React, { createContext, useContext, useState, ReactNode } from 'react';

type AuthContextType = {
  token: string | null;
  user: any | null;
  login: (token: string, user: any) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);

  const login = (token: string, user: any) => {
    setToken(token);
    setUser(user);
    // Optionally store in AsyncStorage or secure storage
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    // Optionally clear storage
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}