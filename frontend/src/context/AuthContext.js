import React, { createContext, useState, useEffect } from 'react';
import { setAuthToken, getUserProfile } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (token) {
      setAuthToken(token);
      localStorage.setItem('token', token);
      getUserProfile()
        .then((response) => setUser(response.data.user))
        .catch(() => {
          setUser(null);
          setToken(null);
          localStorage.removeItem('token');
          setAuthToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    setAuthToken(null);
  };

  const login = (tokenValue, userData) => {
    setToken(tokenValue);
    setUser(userData);
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, error, setError }}>
      {children}
    </AuthContext.Provider>
  );
};
