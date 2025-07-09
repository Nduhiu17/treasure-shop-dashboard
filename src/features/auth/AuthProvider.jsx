import React, { useState, createContext, useContext, useCallback } from 'react';
import { useToast } from '../../components/ui/toast';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('jwt_token'));
  const { showToast } = useToast();

  const logout = useCallback(() => {
    setToken(null);
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user');
    localStorage.removeItem('roles');
  }, []);

  // Updated login to use API
  const login = useCallback(async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!response.ok) {
      if (response.status === 401) {
        showToast({ message: 'Invalid email or password', type: 'error' });
        throw new Error('Invalid email or password');
      }
      showToast({ message: 'Login failed', type: 'error' });
      throw new Error('Login failed');
    }
    const data = await response.json();
    const jwt = data.token || data.access_token || data.jwt || data.JWT || data.accessToken;
    if (!jwt) {
      showToast({ message: 'No token returned from API', type: 'error' });
      throw new Error('No token returned from API');
    }
    setToken(jwt);
    localStorage.setItem('jwt_token', jwt);
    // Save user details and roles to localStorage
    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
      if (data.user.roles) {
        localStorage.setItem('roles', JSON.stringify(data.user.roles));
      }
    }
    showToast({ message: 'Login successful!', type: 'success' });
  }, [showToast]);

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
    getAllOrders: (page = 1, pageSize = 6, status) => authFetcher(`/api/admin/orders?page=${page}&page_size=${pageSize}${status ? `&status=${status}` : ''}`),
    getAllWriterOrders: (page = 1, pageSize = 6, writer_id) => authFetcher(`/api/writers/orders?writer_id=${String(writer_id)}&page=${page}&page_size=${pageSize}$}`),

    assignOrder: (orderId, writerId) => authFetcher(`/api/admin/orders/${orderId}/assign`, {
      method: 'PUT',
      body: JSON.stringify({ writer_id: writerId }),
    }),
    getUsersByRole: (role, page = 1, pageSize = 6) => {
      let url = `/api/admin/users?page=${page}&page_size=${pageSize}`;
      if (role && role !== 'all') {
        url += `&role=${role}`;
      }
      return authFetcher(url);
    },
    getOrderTypes: (page = 1, pageSize = 6) => authFetcher(`/api/order-types?page=${page}&page_size=${pageSize}`),
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
