import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, getAuthToken, setAuthToken, clearAuthToken } from '../utils/api.js';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [progression, setProgression] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    const token = getAuthToken();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const data = await api.get('/auth/me');
      if (data.success) {
        setUser(data.user);
        setProgression(data.progression);
      } else {
        clearAuthToken();
      }
    } catch (err) {
      console.warn('[AuthContext] Session invalid or expired.');
      clearAuthToken();
      setUser(null);
      setProgression(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (email, password) => {
    const data = await api.post('/auth/login', { email, password });
    if (data.success) {
      setAuthToken(data.token);
      setUser(data.user);
      setProgression(data.progression);
      return data;
    }
    throw new Error(data.error || 'Login failed');
  };

  const register = async (userData) => {
    const data = await api.post('/auth/register', userData);
    if (data.success) {
      setAuthToken(data.token);
      setUser(data.user);
      setProgression(data.progression);
      return data;
    }
    throw new Error(data.error || 'Registration failed');
  };

  const logout = () => {
    clearAuthToken();
    setUser(null);
    setProgression(null);
  };

  const updateProgressionState = (newProgression) => {
    setProgression((prev) => ({
      ...prev,
      ...newProgression
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        progression,
        loading,
        login,
        register,
        logout,
        refreshUser: fetchCurrentUser,
        updateProgression: updateProgressionState
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
