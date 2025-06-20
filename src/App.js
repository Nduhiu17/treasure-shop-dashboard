import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Button } from "./components/ui/button";
import OrdersManagement from "./features/orders/OrdersManagement";
import UsersManagement from "./features/users/UsersManagement";
import { AuthProvider, useAuth } from "./features/auth/AuthProvider";
import { useNavigate, BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from "./features/auth/LoginPage";
import MyOrders from "./features/users/MyOrders";
import CreateOrder from "./features/orders/CreateOrder";
import LandingPage from "./pages/LandingPage";
import AboutPage from "./pages/AboutPage";
import GuaranteesPage from "./pages/GuaranteesPage";
import ReviewsPage from "./pages/ReviewsPage";
import ServiceDetailPage from "./pages/ServiceDetailPage";
import OrderTypes from "./features/orderConfigurations/OrderTypes";
import OrderStyles from "./features/orderConfigurations/OrderStyles";
import OrderPages from "./features/orderConfigurations/OrderPages";

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
    key: 'order-configurations',
    label: 'Order Configurations',
    icon: (
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a4 4 0 014-4h4a4 4 0 014 4v2M9 17H5a2 2 0 01-2-2v-5a2 2 0 012-2h4a2 2 0 012 2v5a2 2 0 01-2 2z" /></svg>
    ),
    children: [
      {
        key: 'order-types',
        label: 'Order Types',
        icon: (
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a4 4 0 014-4h4a4 4 0 014 4v2M9 17H5a2 2 0 01-2-2v-5a2 2 0 012-2h4a2 2 0 012 2v5a2 2 0 01-2 2z" /></svg>
        )
      },
      {
        key: 'order-styles',
        label: 'Order Styles',
        icon: (
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 19.5A2.5 2.5 0 006.5 22h11a2.5 2.5 0 002.5-2.5V6a2 2 0 00-2-2H6a2 2 0 00-2 2v13.5z" /></svg>
        )
      },
      {
        key: 'order-pages',
        label: 'Order Pages',
        icon: (
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8a2 2 0 002-2V6a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        )
      }
    ]
  },
  {
    key: 'my-orders',
    label: 'My Orders',
    icon: (
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 7V6a2 2 0 012-2h14a2 2 0 012 2v1M3 7v11a2 2 0 002 2h14a2 2 0 002-2V7M3 7h18" /></svg>
    )
  }
];

const Dashboard = () => {
  const { logout, user } = useAuth();
  const [currentPage, setCurrentPage] = useState('orders');
  const [hoveredMenu, setHoveredMenu] = useState(null);
  const navigate = useNavigate();

  // Determine menu items based on user roles
  let filteredMenuItems = menuItems;
  if (user && user.roles) {
    const roles = user.roles;
    const isAdmin = roles.includes('admin') || roles.includes('super_admin');
    const isWriterOrUser = (roles.includes('writer') || roles.includes('user')) && !isAdmin;
    if (isWriterOrUser) {
      filteredMenuItems = menuItems.filter(item => item.key === 'my-orders');
      if (currentPage !== 'my-orders') setCurrentPage('my-orders');
    }
  }

  const renderContent = () => {
    switch (currentPage) {
      case 'orders':
        return <OrdersManagement />;
      case 'users':
        return <UsersManagement />;
      case 'order-types':
        return <OrderTypes />;
      case 'order-styles':
        return <OrderStyles />;
      case 'order-pages':
        return <OrderPages />;
      case 'my-orders':
        return <MyOrders />;
      default:
        return <OrdersManagement />;
    }
  };

  const handleDashboardLogout = () => {
    // Clear all relevant localStorage
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user');
    localStorage.removeItem('roles');
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header */}
      <header className="bg-white shadow-sm py-3 px-2 xs:px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-2 sticky top-0 z-40">
        <h1 className="text-xl xs:text-2xl sm:text-3xl font-bold text-blue-900 text-center sm:text-left">Academic Codebase Dashboard</h1>
        <div className="flex items-center gap-2">
          <a
            href="/"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-green-400 text-white font-bold shadow-lg hover:from-blue-700 hover:to-cyan-600 hover:to-green-500 transition-all duration-200 border-0 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base md:text-lg"
            style={{ letterSpacing: '0.01em', boxShadow: '0 4px 24px 0 rgba(30, 64, 175, 0.10)' }}
            aria-label="Go to Home"
          >
            <svg className="w-6 h-6 text-white drop-shadow" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7m-9 2v8m4-8v8m-4 0h4" />
            </svg>
            Home
          </a>
          <Button onClick={handleDashboardLogout} variant="destructive" className="w-full sm:w-auto text-xs xs:text-sm sm:text-base">Logout</Button>
        </div>
      </header>
      {/* Main Content Area */}
      <div className="flex flex-1 flex-col sm:flex-row h-[calc(100vh-64px)]">
        {/* Sidebar Navigation */}
        <aside className="w-full sm:w-56 md:w-64 bg-blue-900 text-white p-2 xs:p-4 sm:p-6 flex-shrink-0 sticky top-[64px] h-[calc(100vh-64px)] z-30">
          <nav aria-label="Main menu">
            <ul className="flex flex-row sm:flex-col gap-1 xs:gap-2">
              {filteredMenuItems.map((item) => (
                <li key={item.key} className="relative group">
                  <Button
                    onClick={() => setCurrentPage(item.key)}
                    onMouseEnter={() => setHoveredMenu(item.key)}
                    onMouseLeave={() => setHoveredMenu(null)}
                    className={`w-full flex items-center gap-2 px-2 xs:px-3 py-2 rounded-lg border border-blue-100 transition-all duration-200 text-left text-xs xs:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 focus:ring-offset-blue-900
                      bg-white text-blue-900 hover:bg-blue-50 hover:text-blue-900 shadow-sm
                      ${currentPage === item.key ? 'ring-2 ring-blue-400 font-bold shadow-md' : ''}
                    `}
                    aria-current={currentPage === item.key ? 'page' : undefined}
                  >
                    <span className="mr-1 flex items-center">{React.cloneElement(item.icon, { className: 'w-4 h-4 xs:w-5 xs:h-5 mr-1' })}</span>
                    <span>{item.label}</span>
                    {item.children && (
                      <svg className="w-3 h-3 ml-auto text-blue-400 group-hover:text-blue-700 transition" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                    )}
                  </Button>
                  {/* Dropdown submenu on hover */}
                  {item.children && (
                    <div
                      className={`w-full flex transition-all duration-200 ${hoveredMenu === item.key ? 'max-h-[500px] opacity-100 mt-1' : 'max-h-0 opacity-0 overflow-hidden'} gap-1`}
                      onMouseEnter={() => setHoveredMenu(item.key)}
                      onMouseLeave={() => setHoveredMenu(null)}
                      style={{ zIndex: 50 }}
                    >
                      <div className="ml-auto min-w-[140px] max-w-[180px] w-[60%]">
                        <ul className="bg-white text-blue-900 rounded-2xl shadow-2xl border border-blue-100 py-1 px-0 animate-fade-in-down">
                          {item.children.map((child) => (
                            <li key={child.key}>
                              <Button
                                onClick={() => setCurrentPage(child.key)}
                                className={`w-full flex items-center gap-2 px-4 py-1 rounded-xl border border-transparent transition-all duration-200 text-left text-xs xs:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 focus:ring-offset-white
                                  bg-white text-blue-900 hover:bg-blue-50 hover:text-blue-900 hover:shadow-md
                                  ${currentPage === child.key ? 'ring-2 ring-blue-400 font-bold shadow-md bg-blue-50' : ''}
                                `}
                                aria-current={currentPage === child.key ? 'page' : undefined}
                              >
                                <span className="mr-1 flex items-center">{React.cloneElement(child.icon, { className: 'w-4 h-4 mr-1' })}</span>
                                <span>{child.label}</span>
                              </Button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        {/* Content */}
        <main className="flex-1 p-1 xs:p-2 sm:p-6 min-w-0 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};


// --- Main App Component ---
function AppContent() {
  const { token } = useAuth();
  const navigate = useNavigate();

  // Redirect to / (home) if not authenticated and not on home/marketing pages
  useEffect(() => {
    if (!token) {
      // If the current path is not "/" (home), redirect to home
      if (window.location.pathname !== "/") {
        navigate('/', { replace: true });
      }
      // Otherwise, stay on the landing page
    }
  }, [token, navigate]);

  return (
    <div className="font-sans antialiased">
      {token ? <Dashboard /> : null}
    </div>
  );
}

function AppRoutes() {
  // Get user and logout from AuthProvider for landing/marketing pages
  const { user, logout } = useAuth();
  return (
    <Routes>
      <Route path="/" element={<LandingPage user={user} onLogout={logout} />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/guarantees" element={<GuaranteesPage />} />
      <Route path="/reviews" element={<ReviewsPage />} />
      <Route path="/services/:serviceSlug" element={<ServiceDetailPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/create-order" element={<CreateOrder />} />
      <Route path="/*" element={<AppContent />} />
    </Routes>
  );
}

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
