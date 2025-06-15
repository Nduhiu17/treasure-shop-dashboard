import React, { useState, createContext, useContext, useCallback } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Button } from "./components/ui/button";
import { Card } from "./components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "./components/ui/table";
import { Dialog } from "./components/ui/dialog";
import { Input } from "./components/ui/input";
import { Select } from "./components/ui/select";

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

// --- Orders Management Component ---
const OrdersManagement = () => {
  // Hardcoded orders data mimicking API response
  const hardcodedOrdersData = {
    orders: [
      {
        "id": "684ca991e724b1d7f1ee8c30",
        "user_id": "684c85f3d040e5e18d58ba80",
        "order_type_id": "684c3c2c670dd03bd9e6cf03",
        "title": "Research Paper on Civil Engin",
        "description": "A comprehensive research paper exploring the ethical implications of artificial intelligence in modern society.",
        "price": 109.5,
        "status": "approved",
        "writer_id": "684c85f3d040e5e18d58ba80",
        "submission_date": "2025-06-13T23:54:47.32Z",
        "feedback": "rework the theme.make it green",
        "created_at": "2024-06-13T16:09:00Z",
        "updated_at": "2024-06-13T16:09:00Z",
        "apply_feedback_requests": 0
      },
      {
        "id": "684cbd3c90ca6b208a995245",
        "user_id": "684c85f3d040e5e18d58ba80",
        "order_type_id": "684c3c2c670dd03bd9e6cf03",
        "title": "Research Paper on Medicine",
        "description": "A comprehensive research paper exploring the ethical implications of artificial intelligence in modern society.",
        "price": 1009.5,
        "status": "feedback",
        "writer_id": "684c85f3d040e5e18d58ba80",
        "submission_date": "2025-06-14T00:16:02.113Z",
        "feedback": "rework the theme.make it green",
        "created_at": "2024-06-13T16:09:00Z",
        "updated_at": "2024-06-13T16:09:00Z",
        "apply_feedback_requests": 2
      }
    ],
    page: 1,
    page_size: 10,
    total: 2
  };

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalOrders = hardcodedOrdersData.total;
  const totalPages = Math.ceil(totalOrders / pageSize);

  // For demonstration, slice the orders array for pagination (though only 2 orders exist)
  const paginatedOrders = hardcodedOrdersData.orders.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Hardcoded writers for assignment dropdown
  const writers = [
    { id: '684c721a74e0e1d9989f6f55', email: 'nduhiu1@example.com' },
    { id: '684c722374e0e1d9989f6f56', email: 'nduhiu2@example.com' }
  ];

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedWriterId, setSelectedWriterId] = useState('');

  const handleAssignClick = (order) => {
    setSelectedOrder(order);
    setSelectedWriterId('');
  };

  const handleAssignConfirm = () => {
    if (selectedOrder && selectedWriterId) {
      alert(`Order ${selectedOrder.id} assigned to writer ${selectedWriterId} (simulated)`);
      setSelectedOrder(null);
      setSelectedWriterId('');
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <Card className="m-2 sm:m-4 p-2 sm:p-6 shadow-lg border-0">
      <h2 className="text-lg sm:text-xl font-semibold mb-4 text-blue-900">All Orders</h2>
      <div className="overflow-x-auto rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>User ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Writer ID</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedOrders.length > 0 ? (
              paginatedOrders.map((order) => (
                <TableRow key={order.id} className="hover:bg-blue-50">
                  <TableCell className="max-w-[120px] truncate">{order.title}</TableCell>
                  <TableCell>{order.user_id.slice(-6)}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${order.status === 'approved' ? 'bg-green-100 text-green-700' : order.status === 'feedback' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>{order.status}</span>
                  </TableCell>
                  <TableCell>{order.writer_id ? order.writer_id.slice(-6) : 'Unassigned'}</TableCell>
                  <TableCell>${order.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleAssignClick(order)} disabled={order.status !== 'awaiting_assignment'} className="w-full sm:w-auto text-xs sm:text-sm">
                      Assign Writer
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center">No orders found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-2">
        <nav
          className="flex items-center justify-center rounded-full bg-white/80 shadow-sm border border-blue-100 px-3 py-2 gap-1"
          aria-label="Pagination"
        >
          <Button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="rounded-full px-3 py-1 text-base font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 focus:ring-2 focus:ring-blue-400 disabled:opacity-50 border-none shadow-none"
            aria-label="Previous page"
          >
            &lt;
          </Button>
          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`rounded-full px-3 py-1 text-base font-semibold mx-0.5 border-none shadow-none transition-colors
                ${currentPage === i + 1
                  ? 'bg-blue-700 text-white ring-2 ring-blue-400'
                  : 'bg-transparent text-blue-700 hover:bg-blue-100'}
              `}
              aria-current={currentPage === i + 1 ? 'page' : undefined}
            >
              {i + 1}
            </Button>
          ))}
          <Button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="rounded-full px-3 py-1 text-base font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 focus:ring-2 focus:ring-blue-400 disabled:opacity-50 border-none shadow-none"
            aria-label="Next page"
          >
            &gt;
          </Button>
        </nav>
        <span className="text-sm text-gray-600">Page {currentPage} of {totalPages}</span>
      </div>
      <Dialog
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Assign Writer to Order: ${selectedOrder?.title}`}
      >
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Select Writer:
          </label>
          <Select
            value={selectedWriterId}
            onChange={(e) => setSelectedWriterId(e.target.value)}
            className="bg-white"
          >
            <option value="">Choose a writer</option>
            {writers.map((writer) => (
              <option key={writer.id} value={writer.id}>
                {writer.email}
              </option>
            ))}
          </Select>
        </div>
        <Button onClick={handleAssignConfirm} disabled={!selectedWriterId} className="w-full sm:w-auto">Confirm Assignment</Button>
      </Dialog>
    </Card>
  );
};

// --- Writers Management Component ---
const WritersManagement = () => {
  // Hardcoded writers data
  const hardcodedWriters = [
    {
      "id": "684c721a74e0e1d9989f6f55",
      "email": "nduhiu1@example.com",
      "password": "$2a$10$k4DEV8qFfWJTqAr6qHjmIeeZiLGO0OxMwBKaMWfySMMGW6wW86rs2",
      "roles": ["writer"]
    },
    {
      "id": "684c722374e0e1d9989f6f56",
      "email": "nduhiu2@example.com",
      "password": "$2a$10$8.0yzx6dXZ4iIJO8tD.TRehUiHQwMkFG3juwRHcDiz3WD8EJmnDRy",
      "roles": ["writer"]
    },
    {
      "id": "684c72ca74e0e1d9989f6f57",
      "email": "nduhiu206@example.com",
      "password": "$2a$10$yNN6n5kXwz2WrV9qoYWlfOs3NQ.h7yAZY29QODi7.qHJSFTxDqZaO",
      "roles": ["writer"]
    },
    {
      "id": "684c72ca74e0e1d9989f6f58",
      "email": "writer_alpha@example.com",
      "password": "$2a$10$yNN6n5kXwz2WrV9qoYWlfOs3NQ.h7yAZY29QODi7.qHJSFTxDqZaO",
      "roles": ["writer"]
    },
    {
      "id": "684c72ca74e0e1d9989f6f59",
      "email": "writer_beta@example.com",
      "password": "$2a$10$yNN6n5kXwz2WrV9qoYWlfOs3NQ.h7yAZY29QODi7.qHJSFTxDqZaO",
      "roles": ["writer"]
    }
  ];

  const writers = hardcodedWriters;
  const isLoading = false;
  const isError = false;
  const error = null;

  // Mock functions for create/delete
  const createWriterMutation = {
    mutate: (writerData) => {
      alert(`Simulating writer creation: ${writerData.email}. (API is hardcoded)`);
      setShowAddWriterDialog(false);
      setNewWriterEmail('');
      setNewWriterPassword('');
    },
    isLoading: false,
  };

  const deleteWriterMutation = {
    mutate: (writerId) => {
      alert(`Simulating writer deletion: ${writerId.slice(-6)}. (API is hardcoded)`);
    },
    isLoading: false,
  };

  const [showAddWriterDialog, setShowAddWriterDialog] = useState(false);
  const [newWriterEmail, setNewWriterEmail] = useState('');
  const [newWriterPassword, setNewWriterPassword] = useState('');

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [writerToDelete, setWriterToDelete] = useState(null);

  const handleCreateWriter = () => {
    if (newWriterEmail && newWriterPassword) {
      createWriterMutation.mutate({ email: newWriterEmail, password: newWriterPassword });
    } else {
      alert("Please enter both email and password for the new writer.");
    }
  };

  const handleDeleteWriter = (writerId) => {
    setWriterToDelete(writerId);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteWriter = () => {
    if (writerToDelete) {
      deleteWriterMutation.mutate(writerToDelete);
      setWriterToDelete(null);
      setShowDeleteConfirm(false);
    }
  };

  const cancelDeleteWriter = () => {
    setWriterToDelete(null);
    setShowDeleteConfirm(false);
  };

  if (isLoading) return <div className="text-center py-8">Loading writers...</div>;
  if (isError) return <div className="text-red-500 text-center py-8">Error: {error.message}</div>;

  return (
    <Card className="m-2 sm:m-4 p-2 sm:p-6 shadow-lg border-0">
      <h2 className="text-lg sm:text-xl font-semibold mb-4 text-blue-900">Writers Management (Hardcoded)</h2>
      <Button onClick={() => setShowAddWriterDialog(true)} className="mb-4 w-full sm:w-auto">Add New Writer (Disabled)</Button>
      <div className="overflow-x-auto rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {writers.map((writer) => (
              <TableRow key={writer.id} className="hover:bg-blue-50">
                <TableCell>{writer.email}</TableCell>
                <TableCell>
                  <Button variant="destructive" onClick={() => handleDeleteWriter(writer.id)} disabled className="w-full sm:w-auto text-xs sm:text-sm">
                    Delete (Disabled)
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Dialog
        isOpen={showAddWriterDialog}
        onClose={() => setShowAddWriterDialog(false)}
        title="Add New Writer"
      >
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="writer-email">
            Email
          </label>
          <Input
            id="writer-email"
            type="email"
            placeholder="writer@example.com"
            value={newWriterEmail}
            onChange={(e) => setNewWriterEmail(e.target.value)}
            required
            className="bg-white"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="writer-password">
            Password
          </label>
          <Input
            id="writer-password"
            type="password"
            placeholder="********"
            value={newWriterPassword}
            onChange={(e) => setNewWriterPassword(e.target.value)}
            required
            className="bg-white"
          />
        </div>
        <Button onClick={handleCreateWriter} disabled className="w-full sm:w-auto">Create Writer (Disabled)</Button>
      </Dialog>
      <Dialog
        isOpen={showDeleteConfirm}
        onClose={cancelDeleteWriter}
        title="Confirm Delete Writer"
      >
        <div className="mb-4">Are you sure you want to delete this writer?</div>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={cancelDeleteWriter} className="w-full sm:w-auto">Cancel</Button>
          <Button variant="destructive" onClick={confirmDeleteWriter} className="w-full sm:w-auto">Delete</Button>
        </div>
      </Dialog>
    </Card>
  );
};

// --- Order Types Management Component ---
const OrderTypesManagement = () => {
  // Hardcoded order types
  const hardcodedOrderTypes = [
    {
      "id": "684c3c2c670dd03bd9e6cf03",
      "name": "Science and Engineering",
      "description": "STEM projects",
      "created_by": "684c3b4bca82dae8451e1c5f",
      "created_at": "2025-06-13T14:56:44.471Z",
      "updated_at": "2025-06-13T14:56:44.471Z"
    },
    {
      "id": "684c3c2c670dd03bd9e6cf04",
      "name": "Humanities",
      "description": "Literature, History, Philosophy, etc.",
      "created_by": "684c3b4bca82dae8451e1c5f",
      "created_at": "2025-06-13T15:00:00.000Z",
      "updated_at": "2025-06-13T15:00:00.000Z"
    },
    {
      "id": "684c3c2c670dd03bd9e6cf05",
      "name": "Business and Economics",
      "description": "Marketing, Finance, Accounting, Micro/Macro Economics",
      "created_by": "684c3b4bca82dae8451e1c5f",
      "created_at": "2025-06-13T15:05:00.000Z",
      "updated_at": "2025-06-13T15:05:00.000Z"
    },
    {
      "id": "684c3c2c670dd03bd9e6cf06",
      "name": "Medical and Health Sciences",
      "description": "Nursing, Medicine, Public Health, Pharmacy",
      "created_by": "684c3b4bca82dae8451e1c5f",
      "created_at": "2025-06-13T15:10:00.000Z",
      "updated_at": "2025-06-13T15:10:00.000Z"
    }
  ];

  // No need for useQuery or mutations when hardcoding
  const orderTypes = hardcodedOrderTypes;
  const isLoading = false; // Always false since data is hardcoded
  const isError = false;   // Always false
  const error = null;      // Always null

  // State and handlers for adding/deleting are no longer relevant for hardcoded data
  const [showAddOrderTypeDialog, setShowAddOrderTypeDialog] = useState(false);
  const [newOrderTypeName, setNewOrderTypeName] = useState('');
  const [newOrderTypeDescription, setNewOrderTypeDescription] = useState('');

  // Mock functions for create/delete to prevent errors if accidentally called
  const handleCreateOrderType = () => {
    alert("Adding new order types is disabled in hardcoded mode.");
    setShowAddOrderTypeDialog(false);
    setNewOrderTypeName('');
    setNewOrderTypeDescription('');
  };

  const handleDeleteOrderType = (orderTypeId) => {
    alert("Deleting order types is disabled in hardcoded mode.");
  };

  if (isLoading) return <div className="text-center py-8">Loading order types...</div>;
  if (isError) return <div className="text-red-500 text-center py-8">Error: {error.message}</div>;

  return (
    <Card className="m-2 sm:m-4 p-2 sm:p-6 shadow-lg border-0">
      <h2 className="text-lg sm:text-xl font-semibold mb-4 text-blue-900">Order Types Management (Hardcoded)</h2>
      <div className="overflow-x-auto rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderTypes.map((type) => (
              <TableRow key={type.id} className="hover:bg-blue-50">
                <TableCell>{type.name}</TableCell>
                <TableCell>{type.description}</TableCell>
                <TableCell>
                  <Button variant="destructive" onClick={() => handleDeleteOrderType(type.id)} disabled className="w-full sm:w-auto text-xs sm:text-sm">
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Dialog
        isOpen={showAddOrderTypeDialog}
        onClose={() => setShowAddOrderTypeDialog(false)}
        title="Add New Order Type"
      >
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="order-type-name">
            Name
          </label>
          <Input
            id="order-type-name"
            placeholder="Essay"
            value={newOrderTypeName}
            onChange={(e) => setNewOrderTypeName(e.target.value)}
            required
            className="bg-white"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="order-type-description">
            Description
          </label>
          <Input
            id="order-type-description"
            placeholder="Description of the order type"
            value={newOrderTypeDescription}
            onChange={(e) => setNewOrderTypeDescription(e.target.value)}
            required
            className="bg-white"
          />
        </div>
        <Button onClick={handleCreateOrderType} disabled className="w-full sm:w-auto">Create Order Type (Disabled)</Button>
      </Dialog>
    </Card>
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
                    className={`w-full flex items-center gap-3 px-5 py-3 rounded-xl border border-blue-800 transition-all duration-200 text-left text-base font-semibold focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 focus:ring-offset-blue-900
                      bg-blue-800/90 text-white hover:bg-blue-700/90 hover:shadow-lg hover:scale-[1.03] shadow-sm
                      ${currentPage === item.key ? 'bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 text-white font-extrabold shadow-xl border-blue-400 scale-[1.04]' : ''}
                    `}
                    aria-current={currentPage === item.key ? 'page' : undefined}
                  >
                    <span className="mr-2 flex items-center">{React.cloneElement(item.icon, { className: 'w-6 h-6 mr-2' })}</span>
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
