import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // FIX C1: Check both storages on boot
    const storedToken = localStorage.getItem('token') || sessionStorage.getItem('token');
    const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.clear();
        sessionStorage.clear();
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback((userData, authToken, rememberMe = true) => {
    const storage = rememberMe ? localStorage : sessionStorage; // Key line

    storage.setItem('token', authToken);
    storage.setItem('user', JSON.stringify(userData));
    setToken(authToken);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    // FIX C1: Clear both
    localStorage.clear();
    sessionStorage.clear();
    setToken(null);
    setUser(null);
  }, []);

  const hasRole = useCallback((role) => user?.role === role, [user]);

  const value = { user, token, loading, isAuthenticated: !!token && !!user, login, logout, hasRole };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};