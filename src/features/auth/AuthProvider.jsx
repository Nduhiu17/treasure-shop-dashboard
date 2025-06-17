import React, { useState, createContext, useContext, useCallback } from 'react';

const API_BASE_URL = 'http://localhost:8080';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('jwt_token'));

  const logout = useCallback(() => {
    setToken(null);
    localStorage.removeItem('jwt_token');
  }, []);

  // Updated login to use API
  const login = async (email, password) => {
    const response = await fetch('http://localhost:8080/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!response.ok) {
      if (response.status === 401) throw new Error('Invalid email or password');
      throw new Error('Login failed');
    }
    const data = await response.json();
    const jwt = data.token || data.access_token || data.jwt || data.JWT || data.accessToken;
    if (!jwt) throw new Error('No token returned from API');
    setToken(jwt);
    localStorage.setItem('jwt_token', jwt);
    // Save user details and roles to localStorage
    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
      if (data.user.roles) {
        localStorage.setItem('roles', JSON.stringify(data.user.roles));
      }
    }
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
    getAllOrders: (page = 1, pageSize = 10, status) => authFetcher(`/api/admin/orders?page=${page}&page_size=${pageSize}${status ? `&status=${status}` : ''}`),
    getAllWriterOrders: (page = 1, pageSize = 10, writer_id) => authFetcher(`/api/writers/orders?writer_id=${String(writer_id)}&page=${page}&page_size=${pageSize}$}`),

    assignOrder: (orderId, writerId) => authFetcher(`/api/admin/orders/${orderId}/assign`, {
      method: 'PUT',
      body: JSON.stringify({ writer_id: writerId }),
    }),
    getUsersByRole: (role, page = 1, pageSize = 10) => authFetcher(`/api/admin/users?role=${role}&page=${page}&page_size=${pageSize}`),
    getOrderTypes: (page = 1, pageSize = 10) => authFetcher(`/api/order-types?page=${page}&page_size=${pageSize}`),
    getWriters: (page = 1, pageSize = 100) => authFetcher(`/api/writers?page=${page}&page_size=${pageSize}`),
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
  // Get user from context or localStorage
  let user = null;
  try {
    user = context?.user || JSON.parse(localStorage.getItem('user'));
  } catch (e) {
    user = null;
  }
  return { ...context, api, user };
};
