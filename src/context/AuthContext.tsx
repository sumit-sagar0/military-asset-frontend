
import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthState {
  token: string | null;
  role: string | null;
  name: string | null;
  baseId: number | null;
}

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({
    token: localStorage.getItem('token'),
    role: localStorage.getItem('role'),
    name: localStorage.getItem('name'),
    baseId: localStorage.getItem('baseId') ? Number(localStorage.getItem('baseId')) : null,
  });

  const login = (data: any) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('role', data.role);
    localStorage.setItem('name', data.name);
    if (data.baseId) localStorage.setItem('baseId', data.baseId);
    setAuth({ token: data.token, role: data.role, name: data.name, baseId: data.baseId });
  };

  const logout = () => {
    localStorage.clear();
    setAuth({ token: null, role: null, name: null, baseId: null });
  };

  return <AuthContext.Provider value={{ auth, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
