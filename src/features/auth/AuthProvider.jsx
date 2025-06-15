import React, { useState, createContext, useContext, useCallback } from 'react';

const API_BASE_URL = 'http://localhost:8080';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('jwt_token'));

  const logout = useCallback(() => {
    setToken(null);
    localStorage.removeItem('jwt_token');
  }, []);

  const login = async (email, password) => {
    const dummyToken = "your_dummy_jwt_token_here_for_bypass";
    setToken(dummyToken);
    localStorage.setItem('jwt_token', dummyToken);
  };

  const authFetcher = useCallback(async (url, options = {}) => {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });

    if (response.status === 401) {
      logout();
      throw new Error('Unauthorized: Please log in again.');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(errorData.message || 'An error occurred');
    }
    return response.json();
  }, [token, logout]);

  const apiWithAuth = React.useMemo(() => ({
    login,
    logout,
    getAllOrders: (page = 1, pageSize = 10) => authFetcher(`/api/admin/orders?page=${page}&page_size=${pageSize}`),
    assignOrder: (orderId, writerId) => authFetcher(`/api/admin/orders/${orderId}/assign`, {
      method: 'PUT',
      body: JSON.stringify({ writer_id: writerId }),
    }),
  }), [authFetcher, login, logout]);

  return (
    <AuthContext.Provider value={{ token, login, logout, api: apiWithAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  const api = context?.api || {};
  return { ...context, api };
};
