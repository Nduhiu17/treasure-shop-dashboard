import React, { useState } from "react";
import { Card } from "../../components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { Dialog } from "../../components/ui/dialog";
import { Select } from "../../components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";

const ORDER_STATUSES = [
  { key: "pending_payment", label: "Pending Payment" },
  { key: "paid", label: "Paid" },
  { key: "awaiting_assignment", label: "Awaiting Assignment" },
  { key: "assigned", label: "Assigned" },
  { key: "in_progress", label: "In Progress" },
  { key: "submitted_for_review", label: "Submitted for Review" },
  { key: "approved", label: "Approved" },
  { key: "feedback", label: "Feedback" },
  { key: "completed", label: "Completed" },
];

const OrdersManagement = () => {
  // Hardcoded orders data mimicking API response
  const hardcodedOrdersData = {
    orders: [
      {
        id: "684ca991e724b1d7f1ee8c30",
        user_id: "684c85f3d040e5e18d58ba80",
        order_type_id: "684c3c2c670dd03bd9e6cf03",
        title: "Research Paper on Civil Engin",
        description: "A comprehensive research paper exploring the ethical implications of artificial intelligence in modern society.",
        price: 109.5,
        status: "approved",
        writer_id: "684c85f3d040e5e18d58ba80",
        submission_date: "2025-06-13T23:54:47.32Z",
        feedback: "rework the theme.make it green",
        created_at: "2024-06-13T16:09:00Z",
        updated_at: "2024-06-13T16:09:00Z",
        apply_feedback_requests: 0
      },
      {
        id: "684cbd3c90ca6b208a995245",
        user_id: "684c85f3d040e5e18d58ba80",
        order_type_id: "684c3c2c670dd03bd9e6cf03",
        title: "Research Paper on Medicine",
        description: "A comprehensive research paper exploring the ethical implications of artificial intelligence in modern society.",
        price: 1009.5,
        status: "feedback",
        writer_id: "684c85f3d040e5e18d58ba80",
        submission_date: "2025-06-14T00:16:02.113Z",
        feedback: "rework the theme.make it green",
        created_at: "2024-06-13T16:09:00Z",
        updated_at: "2024-06-13T16:09:00Z",
        apply_feedback_requests: 2
      }
    ],
    page: 1,
    page_size: 10,
    total: 2
  };

  const [activeStatus, setActiveStatus] = useState("pending_payment");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Add more mock orders for demonstration and pagination
  const allOrders = [
    ...hardcodedOrdersData.orders,
    // Add more orders with different statuses for demo
    {
      id: "684cbd3c90ca6b208a995246",
      user_id: "684c85f3d040e5e18d58ba80",
      order_type_id: "684c3c2c670dd03bd9e6cf03",
      title: "Essay on History",
      description: "History essay.",
      price: 50,
      status: "pending_payment",
      writer_id: null,
      submission_date: null,
      feedback: null,
      created_at: "2024-06-13T16:09:00Z",
      updated_at: "2024-06-13T16:09:00Z",
      apply_feedback_requests: 0
    },
    {
      id: "684cbd3c90ca6b208a995247",
      user_id: "684c85f3d040e5e18d58ba80",
      order_type_id: "684c3c2c670dd03bd9e6cf03",
      title: "Business Plan",
      description: "Business plan assignment.",
      price: 200,
      status: "paid",
      writer_id: null,
      submission_date: null,
      feedback: null,
      created_at: "2024-06-13T16:09:00Z",
      updated_at: "2024-06-13T16:09:00Z",
      apply_feedback_requests: 0
    },
    {
      id: "684cbd3c90ca6b208a995248",
      user_id: "684c85f3d040e5e18d58ba80",
      order_type_id: "684c3c2c670dd03bd9e6cf03",
      title: "Assignment for Writer",
      description: "Assignment for writer.",
      price: 120,
      status: "awaiting_assignment",
      writer_id: null,
      submission_date: null,
      feedback: null,
      created_at: "2024-06-13T16:09:00Z",
      updated_at: "2024-06-13T16:09:00Z",
      apply_feedback_requests: 0
    },
    {
      id: "684cbd3c90ca6b208a995249",
      user_id: "684c85f3d040e5e18d58ba80",
      order_type_id: "684c3c2c670dd03bd9e6cf03",
      title: "Ongoing Project",
      description: "Ongoing project.",
      price: 300,
      status: "in_progress",
      writer_id: "684c721a74e0e1d9989f6f55",
      submission_date: null,
      feedback: null,
      created_at: "2024-06-13T16:09:00Z",
      updated_at: "2024-06-13T16:09:00Z",
      apply_feedback_requests: 0
    },
    {
      id: "684cbd3c90ca6b208a995250",
      user_id: "684c85f3d040e5e18d58ba80",
      order_type_id: "684c3c2c670dd03bd9e6cf03",
      title: "Submitted Essay",
      description: "Essay submitted for review.",
      price: 80,
      status: "submitted_for_review",
      writer_id: "684c721a74e0e1d9989f6f55",
      submission_date: "2025-06-14T00:16:02.113Z",
      feedback: null,
      created_at: "2024-06-13T16:09:00Z",
      updated_at: "2024-06-13T16:09:00Z",
      apply_feedback_requests: 0
    },
    {
      id: "684cbd3c90ca6b208a995251",
      user_id: "684c85f3d040e5e18d58ba80",
      order_type_id: "684c3c2c670dd03bd9e6cf03",
      title: "Completed Order",
      description: "Completed order.",
      price: 150,
      status: "completed",
      writer_id: "684c721a74e0e1d9989f6f55",
      submission_date: "2025-06-14T00:16:02.113Z",
      feedback: null,
      created_at: "2024-06-13T16:09:00Z",
      updated_at: "2024-06-13T16:09:00Z",
      apply_feedback_requests: 0
    },
    // ...add more if needed for pagination demo
  ];

  // Filter orders by status
  const filteredOrders = allOrders.filter((order) => order.status === activeStatus);
  const totalOrders = filteredOrders.length;
  const totalPages = Math.max(1, Math.ceil(totalOrders / pageSize));
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Hardcoded writers for assignment dropdown
  const writers = [
    { id: "684c721a74e0e1d9989f6f55", email: "nduhiu1@example.com" },
    { id: "684c722374e0e1d9989f6f56", email: "nduhiu2@example.com" }
  ];

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedWriterId, setSelectedWriterId] = useState("");

  const handleAssignClick = (order) => {
    setSelectedOrder(order);
    setSelectedWriterId("");
  };

  const handleAssignConfirm = () => {
    if (selectedOrder && selectedWriterId) {
      alert(`Order ${selectedOrder.id} assigned to writer ${selectedWriterId} (simulated)`);
      setSelectedOrder(null);
      setSelectedWriterId("");
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

  // Reset page when status changes
  const handleTabChange = (status) => {
    setActiveStatus(status);
    setCurrentPage(1);
  };

  return (
    <Card className="m-2 sm:m-4 p-2 sm:p-6 shadow-lg border-0">
      <h2 className="text-lg sm:text-xl font-semibold mb-4 text-blue-900">Orders Management</h2>
      <Tabs value={activeStatus} onValueChange={handleTabChange} className="mb-6">
        <TabsList className="flex w-full overflow-x-auto gap-2 bg-white/90 rounded-xl shadow border border-blue-100 p-2">
          {ORDER_STATUSES.map((status) => (
            <TabsTrigger
              key={status.key}
              value={status.key}
              className={`capitalize px-6 py-2 rounded-lg text-base font-semibold transition-all duration-150
                focus:outline-none focus:ring-2 focus:ring-blue-400
                data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-400 data-[state=active]:text-white data-[state=active]:shadow-lg
                data-[state=inactive]:bg-blue-50 data-[state=inactive]:text-blue-900 data-[state=inactive]:hover:bg-blue-100
              `}
              data-state={activeStatus === status.key ? "active" : "inactive"}
            >
              {status.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {ORDER_STATUSES.map((status) => (
          <TabsContent key={status.key} value={status.key}>
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
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${order.status === 'approved' ? 'bg-green-100 text-green-700' : order.status === 'feedback' ? 'bg-yellow-100 text-yellow-700' : order.status === 'pending_payment' ? 'bg-red-100 text-red-700' : order.status === 'paid' ? 'bg-blue-100 text-blue-700' : order.status === 'awaiting_assignment' ? 'bg-gray-100 text-gray-700' : order.status === 'assigned' ? 'bg-purple-100 text-purple-700' : order.status === 'in_progress' ? 'bg-orange-100 text-orange-700' : order.status === 'submitted_for_review' ? 'bg-cyan-100 text-cyan-700' : order.status === 'completed' ? 'bg-green-200 text-green-900' : 'bg-gray-100 text-gray-700'}`}>{order.status}</span>
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
            {/* Pagination */}
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
          </TabsContent>
        ))}
      </Tabs>
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

export default OrdersManagement;
