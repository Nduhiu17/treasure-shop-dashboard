import React, { useState, createContext, useContext, useCallback } from 'react';
import { QueryClient, QueryClientProvider, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// --- Shadcn UI Components (Simplified for demonstration) ---
// In a real project, you would install and import these properly.
// For this example, we'll use basic HTML elements styled with Tailwind,
// or simple custom components to represent Shadcn functionality.

const Button = ({ children, onClick, variant = 'default', className = '', ...props }) => {
  let bgColor = 'bg-blue-500 hover:bg-blue-600';
  let textColor = 'text-white';
  let padding = 'px-4 py-2';
  let rounded = 'rounded-md';

  if (variant === 'outline') {
    bgColor = 'bg-white hover:bg-gray-100 border border-gray-300';
    textColor = 'text-gray-700';
  } else if (variant === 'destructive') {
    bgColor = 'bg-red-500 hover:bg-red-600';
  } else if (variant === 'secondary') {
    bgColor = 'bg-gray-200 hover:bg-gray-300';
    textColor = 'text-gray-800';
  }

  return (
    <button
      className={`${bgColor} ${textColor} ${padding} ${rounded} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200 ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

const Input = ({ type = 'text', placeholder, value, onChange, className = '', ...props }) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className={`w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
    {...props}
  />
);

const Card = ({ children, className = '' }) => (
  <div className={`bg-white p-6 rounded-lg shadow-md ${className}`}>
    {children}
  </div>
);

const Table = ({ children, className = '' }) => (
  <div className={`overflow-x-auto rounded-lg border border-gray-200 ${className}`}>
    <table className="min-w-full divide-y divide-gray-200">
      {children}
    </table>
  </div>
);

const TableHeader = ({ children }) => (
  <thead className="bg-gray-50">
    {children}
  </thead>
);

const TableBody = ({ children }) => (
  <tbody className="bg-white divide-y divide-gray-200">
    {children}
  </tbody>
);

const TableHead = ({ children, className = '' }) => (
  <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${className}`}>
    {children}
  </th>
);

const TableRow = ({ children }) => (
  <tr>{children}</tr>
);

const TableCell = ({ children, className = '' }) => (
  <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${className}`}>
    {children}
  </td>
);

const Select = ({ children, value, onChange, className = '', ...props }) => (
  <select
    value={value}
    onChange={onChange}
    className={`w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
    {...props}
  >
    {children}
  </select>
);

const Dialog = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none bg-black bg-opacity-50">
      <div className="relative w-auto my-6 mx-auto max-w-lg">
        <Card className="relative flex flex-col w-full outline-none focus:outline-none">
          <div className="flex items-start justify-between p-5 border-b border-solid border-gray-200 rounded-t">
            <h3 className="text-2xl font-semibold">{title}</h3>
            <button
              className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
              onClick={onClose}
            >
              <span className="text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                ×
              </span>
            </button>
          </div>
          <div className="relative p-6 flex-auto">
            {children}
          </div>
          <div className="flex items-center justify-end p-6 border-t border-solid border-gray-200 rounded-b">
            <Button variant="secondary" onClick={onClose}>Close</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};


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
  const [email, setEmail] = useState(''); // Keep state for input fields, though not used for login bypass
  const [password, setPassword] = useState(''); // Keep state for input fields, though not used for login bypass
  const [loading, setLoading] = useState(false); // Keep loading state for visual feedback

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Directly call login, which now bypasses the API
    await login(); // No arguments needed for the bypassed login
    setLoading(false);
    // No error handling here since login is always successful for bypass
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Admin Login (Bypass Active)</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email (ignored)
            </label>
            <Input
              id="email"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password (ignored)
            </label>
            <Input
              id="password"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Redirecting...' : 'Enter Dashboard'}
          </Button>
          <p className="text-center text-sm text-gray-500 mt-4">Login is currently bypassed for quick access.</p>
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
    <Card className="m-4 p-6">
      <h2 className="text-xl font-semibold mb-4">All Orders</h2>
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
              <TableRow key={order.id}>
                <TableCell>{order.title}</TableCell>
                <TableCell>{order.user_id.slice(-6)}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>{order.writer_id ? order.writer_id.slice(-6) : 'Unassigned'}</TableCell>
                <TableCell>${order.price.toFixed(2)}</TableCell>
                <TableCell>
                  <Button onClick={() => handleAssignClick(order)} disabled={order.status !== 'awaiting_assignment'}>
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

      <div className="flex justify-between items-center mt-4">
        <Button onClick={handlePrevPage} disabled={currentPage === 1}>
          Previous
        </Button>
        <span>Page {currentPage} of {totalPages}</span>
        <Button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next
        </Button>
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
          >
            <option value="">Choose a writer</option>
            {writers.map((writer) => (
              <option key={writer.id} value={writer.id}>
                {writer.email}
              </option>
            ))}
          </Select>
        </div>
        <Button onClick={handleAssignConfirm} disabled={!selectedWriterId}>
          Confirm Assignment
        </Button>
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
    <Card className="m-4 p-6">
      <h2 className="text-xl font-semibold mb-4">Writers Management (Hardcoded)</h2>
      <Button onClick={() => setShowAddWriterDialog(true)} className="mb-4">Add New Writer (Disabled)</Button>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {writers.map((writer) => (
            <TableRow key={writer.id}>
              <TableCell>{writer.email}</TableCell>
              <TableCell>
                <Button variant="destructive" onClick={() => handleDeleteWriter(writer.id)} disabled={true}>
                  Delete (Disabled)
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

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
          />
        </div>
        <Button onClick={handleCreateWriter} disabled={true}>
          Create Writer (Disabled)
        </Button>
      </Dialog>

      <Dialog
        isOpen={showDeleteConfirm}
        onClose={cancelDeleteWriter}
        title="Confirm Delete Writer"
      >
        <div className="mb-4">Are you sure you want to delete this writer?</div>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={cancelDeleteWriter}>Cancel</Button>
          <Button variant="destructive" onClick={confirmDeleteWriter}>Delete</Button>
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
    <Card className="m-4 p-6">
      <h2 className="text-xl font-semibold mb-4">Order Types Management (Hardcoded)</h2>
      {/* Button to add new order type is hidden or disabled */}
      {/* <Button onClick={() => setShowAddOrderTypeDialog(true)} className="mb-4">Add New Order Type</Button> */}
      <Table>
        <TableHeader>
          {/* Ensure TableRow is directly inside TableHeader */}
          <TableRow>
            {/* Removed TableHead for ID */}
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orderTypes.map((type) => (
            <TableRow key={type.id}>
              {/* Removed TableCell for ID */}
              <TableCell>{type.name}</TableCell>
              <TableCell>{type.description}</TableCell>
              <TableCell>
                {/* Delete button is disabled for hardcoded data */}
                <Button variant="destructive" onClick={() => handleDeleteOrderType(type.id)} disabled={true}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

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
          />
        </div>
        <Button onClick={handleCreateOrderType} disabled={true}>
          Create Order Type (Disabled)
        </Button>
      </Dialog>
    </Card>
  );
};


// --- Dashboard Layout ---
const Dashboard = () => {
  const { logout } = useAuth();
  const [currentPage, setCurrentPage] = useState('orders'); // 'orders', 'writers', 'order-types'

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
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Treasure Shop Admin</h1>
        <Button onClick={logout} variant="destructive">Logout</Button>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-gray-800 text-white p-6">
          <nav>
            <ul>
              <li className="mb-4">
                <Button
                  onClick={() => setCurrentPage('orders')}
                  className={`w-full justify-start ${currentPage === 'orders' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                >
                  Orders
                </Button>
              </li>
              <li className="mb-4">
                <Button
                  onClick={() => setCurrentPage('writers')}
                  className={`w-full justify-start ${currentPage === 'writers' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                >
                  Writers
                </Button>
              </li>
              <li className="mb-4">
                <Button
                  onClick={() => setCurrentPage('order-types')}
                  className={`w-full justify-start ${currentPage === 'order-types' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                >
                  Order Types
                </Button>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 p-6">
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
