import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Button } from "./components/ui/button";
import OrdersManagement from "./features/orders/OrdersManagement";
import UsersManagement from "./features/users/UsersManagement";
import OrderTypesManagement from "./features/orderTypes/OrderTypesManagement";
import { AuthProvider, useAuth } from "./features/auth/AuthProvider";
import LoginPage from "./features/auth/LoginPage";

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
    key: 'users',
    label: 'Users',
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
      case 'users':
        return <UsersManagement />;
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
