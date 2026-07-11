import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api/client';
import { tokenStorage, userStorage } from '../utils/storage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      const token = tokenStorage.get();

      if (!token) {
        userStorage.clear();
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get('/auth/me');
        setUser(data.user || null);
        if (data.user) {
          userStorage.set(data.user);
        } else {
          tokenStorage.clear();
          userStorage.clear();
        }
      } catch (error) {
        tokenStorage.clear();
        userStorage.clear();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, []);

  const login = async (payload) => {
    const { data } = await api.post('/auth/login', payload);
    tokenStorage.set(data.token);
    userStorage.set(data.user);
    setUser(data.user);
  };

  const register = async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    tokenStorage.set(data.token);
    userStorage.set(data.user);
    setUser(data.user);
  };

  const logout = () => {
    tokenStorage.clear();
    userStorage.clear();
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      register,
      logout,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin',
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);