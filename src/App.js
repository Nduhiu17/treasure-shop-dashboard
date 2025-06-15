import React, { useState, createContext, useContext, useCallback } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Button } from "./components/ui/button";
import { Card } from "./components/ui/card";
import { Input } from "./components/ui/input";
import OrdersManagement from "./features/orders/OrdersManagement";
import WritersManagement from "./features/writers/WritersManagement";
import OrderTypesManagement from "./features/orderTypes/OrderTypesManagement";

// --- API Client ---
const API_BASE_URL = 'http://localhost:8080'; // From openapi.yaml

const AuthContext = createContext(null);

// --- Auth Provider ---
const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('jwt_token'));

  // Memoize logout to avoid unnecessary re-renders
  const logout = useCallback(() => {
    setToken(null);
    localStorage.removeItem('jwt_token');
  }, []);

  // Modified login to bypass API call for now
  const login = async (email, password) => {
    // For demonstration, bypass actual API login and directly set a token
    const dummyToken = "your_dummy_jwt_token_here_for_bypass"; // Replace with a real token from your backend if needed for other API calls
    setToken(dummyToken);
    localStorage.setItem('jwt_token', dummyToken);
  };

  const authFetcher = useCallback(async (url, options = {}) => {
    // Check for 401 response and logout
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });

    if (response.status === 401) {
        // Automatically log out if token is expired or invalid
        logout();
        throw new Error('Unauthorized: Please log in again.');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(errorData.message || 'An error occurred');
    }
    return response.json();
  }, [token, logout]);

  // Create a memoized API object using the authFetcher
  const apiWithAuth = React.useMemo(() => ({
    login, // Use the bypassed login function
    logout,
    getAllOrders: (page = 1, pageSize = 10) => authFetcher(`/api/admin/orders?page=${page}&page_size=${pageSize}`),
    assignOrder: (orderId, writerId) => authFetcher(`/api/admin/orders/${orderId}/assign`, {
      method: 'PUT',
      body: JSON.stringify({ writer_id: writerId }),
    }),
    // Commenting out original API calls for writers as they are now hardcoded
    // getAllWriters: () => authFetcher('/api/writers'), // Keep this if Writers is not hardcoded
    // createWriter: (writerData) => authFetcher('/api/writers', {
    //   method: 'POST',
    //   body: JSON.stringify(writerData),
    // }),
    // updateWriter: (id, writerData) => authFetcher(`/api/writers/${id}`, {
    //   method: 'PUT',
    //   body: JSON.stringify(writerData),
    // }),
    // deleteWriter: (id) => authFetcher('/api/writers/${id}', {
    //   method: 'DELETE',
    // }),
  }), [authFetcher, login, logout]);

  return (
    <AuthContext.Provider value={{ token, login, logout, api: apiWithAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

// Modified useAuth to ensure 'api' is always an object, even if the context is initially null
const useAuth = () => {
  const context = useContext(AuthContext);
  // Ensure that api is always an object, even if context is null initially
  const api = context?.api || {};
  return { ...context, api };
};

// --- Login Page ---
const LoginPage = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await login();
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-2 sm:p-4">
      <Card className="w-full max-w-md mx-auto p-6 sm:p-8 shadow-xl border-0">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-blue-900">Admin Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email (ignored)
            </label>
            <Input
              id="email"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password (ignored)
            </label>
            <Input
              id="password"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white"
            />
          </div>
          <Button type="submit" className="w-full py-2 text-base" disabled={loading}>
            {loading ? "Redirecting..." : "Enter Dashboard"}
          </Button>
          <p className="text-center text-xs text-gray-500 mt-2">Login is currently bypassed for quick access.</p>
        </form>
      </Card>
    </div>
  );
};


// --- Dashboard Layout ---
const menuItems = [
  {
    key: 'orders',
    label: 'Orders',
    icon: (
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 7V6a2 2 0 012-2h14a2 2 0 012 2v1M3 7v11a2 2 0 002 2h14a2 2 0 002-2V7M3 7h18" /></svg>
    )
  },
  {
    key: 'writers',
    label: 'Writers',
    icon: (
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-4a4 4 0 11-8 0 4 4 0 018 0zm6 4v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
    )
  },
  {
    key: 'order-types',
    label: 'Order Types',
    icon: (
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a4 4 0 014-4h4a4 4 0 014 4v2M9 17H5a2 2 0 01-2-2v-5a2 2 0 012-2h4a2 2 0 012 2v5a2 2 0 01-2 2z" /></svg>
    )
  }
];

const Dashboard = () => {
  const { logout } = useAuth();
  const [currentPage, setCurrentPage] = useState('orders');

  const renderContent = () => {
    switch (currentPage) {
      case 'orders':
        return <OrdersManagement />;
      case 'writers':
        return <WritersManagement />;
      case 'order-types':
        return <OrderTypesManagement />;
      default:
        return <OrdersManagement />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-900">Treasure Shop Admin</h1>
        <Button onClick={logout} variant="destructive" className="w-full sm:w-auto">Logout</Button>
      </header>
      {/* Main Content Area */}
      <div className="flex flex-1 flex-col sm:flex-row">
        {/* Sidebar Navigation */}
        <aside className="w-full sm:w-64 bg-blue-900 text-white p-4 sm:p-6 flex-shrink-0">
          <nav aria-label="Main menu">
            <ul className="flex flex-row sm:flex-col gap-2">
              {menuItems.map((item) => (
                <li key={item.key}>
                  <Button
                    onClick={() => setCurrentPage(item.key)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-blue-100 transition-all duration-200 text-left text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 focus:ring-offset-blue-900
                      bg-white text-blue-900 hover:bg-blue-50 hover:text-blue-900 shadow-sm
                      ${currentPage === item.key ? 'ring-2 ring-blue-400 font-bold shadow-md' : ''}
                    `}
                    aria-current={currentPage === item.key ? 'page' : undefined}
                  >
                    <span className="mr-1 flex items-center">{React.cloneElement(item.icon, { className: 'w-5 h-5 mr-1' })}</span>
                    <span>{item.label}</span>
                  </Button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        {/* Content */}
        <main className="flex-1 p-2 sm:p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};


// --- Main App Component ---
const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </QueryClientProvider>
  );
}

function AppContent() {
  const { token } = useAuth();

  return (
    <div className="font-sans antialiased">
      {token ? <Dashboard /> : <LoginPage />}
    </div>
  );
}
