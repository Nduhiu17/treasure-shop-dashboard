import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Button } from "./components/ui/button";
import OrdersManagement from "./features/orders/OrdersManagement";
import UsersManagement from "./features/users/UsersManagement";
import { AuthProvider, useAuth } from "./features/auth/AuthProvider";
import { useNavigate, BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from "./features/auth/LoginPage";
import WriterOrders from "./features/users/WritterOrders";
import CreateOrder from "./features/orders/CreateOrder";
import LandingPage from "./pages/LandingPage";
import AboutPage from "./pages/AboutPage";
import CustomerProfilePage from "./pages/CustomerProfilePage";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import GuaranteesPage from "./pages/GuaranteesPage";
import ReviewsPage from "./pages/ReviewsPage";
import ServiceDetailPage from "./pages/ServiceDetailPage";
import NewOrderPage from "./pages/NewOrderPage";
import OrderTypes from "./features/orderConfigurations/OrderTypes";
import OrderStyles from "./features/orderConfigurations/OrderStyles";
import OrderPages from "./features/orderConfigurations/OrderPages";
import OrderLevels from "./features/orderConfigurations/OrderLevels";
import OrderLanguages from "./features/orderConfigurations/OrderLanguages";
import OrderUrgency from "./features/orderConfigurations/OrderUrgency";
import RolesManagement from "./features/users/RolesManagement";

// --- Dashboard Layout ---
const menuItems = [
  {
    key: 'orders',
    label: 'All Orders',
    icon: (
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 7V6a2 2 0 012-2h14a2 2 0 012 2v1M3 7v11a2 2 0 002 2h14a2 2 0 002-2V7M3 7h18" /></svg>
    )
  },
  {
    key: 'users-management',
    label: 'Users Management',
    icon: (
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-4a4 4 0 11-8 0 4 4 0 018 0zm6 4v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
    ),
    children: [
      {
        key: 'users',
        label: 'Users',
        icon: (
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-4a4 4 0 11-8 0 4 4 0 018 0zm6 4v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
        )
      },
      {
        key: 'roles',
        label: 'Roles',
        icon: (
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M8 12h8M12 8v8" /></svg>
        )
      }
    ]
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
      },
      {
        key: 'order-levels',
        label: 'Order Levels',
        icon: (
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0v6m0 0H6m6 0h6" /></svg>
        )
      },
      {
        key: 'order-languages',
        label: 'Order Languages',
        icon: (
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" /></svg>
        )
      },
      {
        key: 'order-urgency',
        label: 'Order Urgency',
        icon: (
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
        )
      }
    ]
  },
  {
    key: 'writer-orders',
    label: 'Writter Orders',
    icon: (
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 7V6a2 2 0 012-2h14a2 2 0 012 2v1M3 7v11a2 2 0 002 2h14a2 2 0 002-2V7M3 7h18" /></svg>
    )
  }
];

const Dashboard = () => {
  const { logout, user } = useAuth();
  const [currentPage, setCurrentPage] = useState('orders');
  const [hoveredMenu, setHoveredMenu] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Determine menu items based on user roles
  let filteredMenuItems = menuItems;
  let writerId = null;
  if (user && user.roles) {
    const roles = user.roles;
    const isAdmin = roles.includes('admin') || roles.includes('super_admin');
    const isWriter = roles.includes('writer') && !isAdmin;
    const isUserOnly = roles.length === 1 && roles[0] === 'user';
    if (isAdmin) {
      // Show all menu items for admin/super_admin
      filteredMenuItems = menuItems;
    } else if (isWriter) {
      // Only show writer orders for writers
      filteredMenuItems = menuItems.filter(item => item.key === 'writer-orders');
      writerId = user.id;
      if (currentPage !== 'writer-orders') setCurrentPage('writer-orders');
    } else if (isUserOnly) {
      // If just user role, redirect to /profile
      navigate('/profile', { replace: true });
      return null;
    }
  }

  const renderContent = () => {
    switch (currentPage) {
      case 'orders':
        return <OrdersManagement />;
      case 'users':
        return <UsersManagement currentSubPage="users" />;
      case 'roles':
        return <RolesManagement />;
      case 'users-management':
        // Default to users subpage
        return <UsersManagement currentSubPage="users" />;
      case 'order-types':
        return <OrderTypes />;
      case 'order-styles':
        return <OrderStyles />;
      case 'order-pages':
        return <OrderPages />;
      case 'order-levels':
        return <OrderLevels />;
      case 'order-languages':
        return <OrderLanguages />;
      case 'order-urgency':
        return <OrderUrgency />;
      case 'writer-orders':
        // Pass writerId as prop for WriterOrders to fetch data from endpoint
        return <WriterOrders writerId={writerId} />;
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
    <div className="h-screen flex flex-col bg-gradient-to-br from-white to-gray-100 text-gray-900 overflow-hidden">
      {/* Header */}
      <header className="bg-white shadow-sm py-1 px-2 xs:px-4 sm:px-6 flex items-center justify-between sticky top-0 z-50 w-full border-b border-gray-200">
        <div className="flex items-center gap-2 w-full">
          {/* Mobile menu button */}
          <button
            className="sm:hidden flex items-center justify-center p-2 rounded-lg text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 mr-2"
            onClick={() => setMobileMenuOpen(v => !v)}
            aria-label="Open menu"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <h1 className="flex items-center gap-2 text-base xs:text-lg sm:text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight truncate whitespace-nowrap drop-shadow-sm px-2 py-1 rounded-xl bg-gradient-to-r from-white via-gray-100 to-gray-200 border border-gray-200/60 shadow-md">
            <button
              onClick={() => window.location.href = '/'}
              className="flex items-center gap-2 px-3 py-1 rounded-xl bg-gradient-to-r from-gray-800 via-gray-600 to-gray-400 text-white font-bold shadow hover:from-gray-900 hover:to-gray-700 transition-all text-xs xs:text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-gray-400"
              aria-label="Go back to main page"
            >
              <svg className="w-6 h-6 md:w-7 md:h-7 text-white drop-shadow" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Go To Website
            </button>
            <span className="hidden xs:inline-block align-middle text-gray-900 font-extrabold tracking-tight drop-shadow-sm">Academic Codebase</span>
          </h1>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 text-gray-900">
          <a
            href="/"
            className="hidden xs:flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-gray-700 via-gray-500 to-gray-400 text-white font-bold shadow-lg hover:from-gray-800 hover:to-gray-600 transition-all duration-200 border-0 focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm xs:text-base md:text-lg"
            style={{ letterSpacing: '0.01em', boxShadow: '0 4px 24px 0 rgba(30, 41, 59, 0.10)' }}
            aria-label="Go to Home"
          >
            <svg className="w-5 h-5 xs:w-6 xs:h-6 text-white drop-shadow" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7m-9 2v8m4-8v8m-4 0h4" />
            </svg>
            Home
          </a>
          <Button
            onClick={handleDashboardLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-gray-900 via-gray-700 to-gray-500 text-white font-bold shadow-lg hover:from-gray-800 hover:to-gray-600 transition-all duration-200 border-0 focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm xs:text-base md:text-lg"
            style={{ letterSpacing: '0.01em', boxShadow: '0 4px 24px 0 rgba(30, 41, 59, 0.10)' }}
            aria-label="Logout"
          >
            <svg className="w-5 h-5 xs:w-6 xs:h-6 text-white drop-shadow" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" />
            </svg>
            Logout
          </Button>
        </div>
      </header>
      {/* Mobile Sidebar Drawer */}
      <div className={`fixed inset-0 z-40 bg-black/20 transition-opacity duration-200 ${mobileMenuOpen ? 'block sm:hidden' : 'hidden'}`} onClick={() => setMobileMenuOpen(false)} />
      <aside className={`fixed top-0 left-0 z-50 h-full w-64 bg-white text-gray-900 p-4 shadow-2xl transform transition-transform duration-200 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} sm:hidden`}> 
        <nav aria-label="Mobile menu">
          <ul className="flex flex-col gap-2">
            {filteredMenuItems.map((item) => (
              <li key={item.key} className="relative group">
                <Button
                  onClick={() => { setCurrentPage(item.key); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 transition-all duration-200 text-left text-base font-semibold focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 focus:ring-offset-white
                    bg-white text-gray-900 hover:bg-gray-100 hover:text-gray-900 shadow-sm
                    ${currentPage === item.key ? 'ring-2 ring-gray-700 font-bold shadow-md bg-gray-100' : ''}
                  `}
                  aria-current={currentPage === item.key ? 'page' : undefined}
                >
                  <span className="mr-1 flex items-center">{React.cloneElement(item.icon, { className: 'w-5 h-5 mr-1 text-gray-700' })}</span>
                  <span>{item.label}</span>
                </Button>
                {/* Dropdown submenu for mobile */}
                {item.children && (
                  <ul className="ml-4 mt-1 bg-white text-gray-900 rounded-xl shadow-lg border border-gray-200 py-1 px-0 animate-fade-in-down">
                    {item.children.map((child) => (
                      <li key={child.key}>
                        <Button
                          onClick={() => { setCurrentPage(child.key); setMobileMenuOpen(false); }}
                          className={`w-full flex items-center gap-2 px-4 py-1 rounded-xl border border-transparent transition-all duration-200 text-left text-base font-semibold focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 focus:ring-offset-white
                            bg-transparent text-gray-900 hover:bg-gray-100 hover:text-gray-900 hover:shadow-md
                            ${currentPage === child.key ? 'ring-2 ring-gray-700 font-bold shadow-md bg-gray-100' : ''}
                          `}
                          aria-current={currentPage === child.key ? 'page' : undefined}
                        >
                          <span className="mr-1 flex items-center">{React.cloneElement(child.icon, { className: 'w-5 h-5 mr-1 text-gray-700' })}</span>
                          <span>{child.label}</span>
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      {/* Main Content Area */}
      <div className="flex flex-1 flex-col sm:flex-row h-[calc(100vh-64px)] w-full bg-gradient-to-br from-white to-gray-100 text-gray-900">
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden sm:block w-full sm:w-56 md:w-64 bg-gradient-to-br from-white to-gray-100 text-gray-900 p-2 xs:p-4 sm:p-6 flex-shrink-0 h-screen z-30 overflow-hidden border-r border-gray-200">
          <nav aria-label="Main menu">
            <ul className="flex flex-row sm:flex-col gap-1 xs:gap-2 w-full">
              {filteredMenuItems.map((item) => (
                <li key={item.key} className="relative group">
                  <Button
                    onClick={() => setCurrentPage(item.key)}
                    onMouseEnter={() => setHoveredMenu(item.key)}
                    onMouseLeave={() => setHoveredMenu(null)}
                    className={`w-full flex items-center gap-2 px-2 xs:px-3 py-2 rounded-lg border border-gray-200 transition-all duration-200 text-left text-xs xs:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 focus:ring-offset-white
                      bg-white text-gray-900 hover:bg-gray-100 hover:text-gray-900 shadow-sm
                      ${currentPage === item.key ? 'ring-2 ring-gray-700 font-bold shadow-md bg-gray-100' : ''}
                    `}
                    aria-current={currentPage === item.key ? 'page' : undefined}
                  >
                    <span className="mr-1 flex items-center">{React.cloneElement(item.icon, { className: 'w-4 h-4 xs:w-5 xs:h-5 mr-1 text-gray-700' })}</span>
                    <span>{item.label}</span>
                    {item.children && (
                      <svg className="w-3 h-3 ml-auto text-gray-400 group-hover:text-gray-700 transition" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
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
                          {item.children.map((child, idx) => (
                            <li key={child.key} className={idx !== item.children.length - 1 ? 'mb-1' : ''}>
                          <Button
                            onClick={() => setCurrentPage(child.key)}
                            className={`w-full flex items-center gap-2 px-4 py-1 rounded-xl border border-transparent transition-all duration-200 text-left text-xs xs:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 focus:ring-offset-white
                              bg-transparent text-gray-900 hover:bg-gray-100 hover:text-gray-900 hover:shadow-md
                              ${currentPage === child.key ? 'ring-2 ring-gray-700 font-bold shadow-md bg-gray-100' : ''}
                            `}
                            aria-current={currentPage === child.key ? 'page' : undefined}
                          >
                            <span className="mr-1 flex items-center">{React.cloneElement(child.icon, { className: 'w-4 h-4 mr-1 text-gray-700' })}</span>
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
        <main className="flex-1 p-1 xs:p-2 sm:p-6 min-w-0 w-full overflow-x-hidden bg-white/90 rounded-2xl shadow-xl border border-gray-200">
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
      <Route path="/order/new" element={<NewOrderPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/create-order" element={<CreateOrder />} />
      <Route path="/profile" element={<CustomerProfilePage />} />
      <Route path="/order/:orderId" element={<OrderDetailsPage />} />
      <Route path="/admin/dashboard" element={<AppContent />} />
      <Route path="/*" element={<LandingPage user={user} onLogout={logout} />} />

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
