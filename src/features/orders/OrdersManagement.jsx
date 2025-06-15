import React, { useEffect, useState } from "react";
import { Card } from "../../components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { Select } from "../../components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";
import { Dialog } from "../../components/ui/dialog";
import { useAuth } from "../auth/AuthProvider";
import Loader from '../../components/ui/Loader';

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

const PAGE_SIZE = 10;

const OrdersManagement = () => {
  const { api } = useAuth();
  const [activeStatus, setActiveStatus] = useState("pending_payment");
  const [currentPage, setCurrentPage] = useState(1);
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedWriterId, setSelectedWriterId] = useState("");
  const [writers, setWriters] = useState([]);
  const [assignLoading, setAssignLoading] = useState(false);
  const [assignError, setAssignError] = useState("");
  const [assignSuccess, setAssignSuccess] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    api.getAllOrders(currentPage, PAGE_SIZE, activeStatus)
      .then((res) => {
        setOrders(res.orders || []);
        setTotal(res.total || 0);
      })
      .catch((err) => setError(err.message || "Failed to fetch orders"))
      .finally(() => setLoading(false));
  }, [api, currentPage, activeStatus]);

  useEffect(() => {
    // Fetch writers for assignment dropdown
    if (!api.getWriters) return;
    api.getWriters()
      .then((res) => setWriters(res.writers || res || []))
      .catch(() => setWriters([]));
  }, [api]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const handlePrevPage = () => setCurrentPage((p) => Math.max(1, p - 1));
  const handleNextPage = () => setCurrentPage((p) => Math.min(totalPages, p + 1));
  const handleTabChange = (status) => {
    setActiveStatus(status);
    setCurrentPage(1);
  };

  const handleAssignClick = (order) => {
    setSelectedOrder(order);
    setSelectedWriterId("");
    setAssignError("");
    setAssignSuccess("");
  };

  const handleAssignConfirm = async () => {
    if (!selectedOrder || !selectedWriterId) return;
    setAssignLoading(true);
    setAssignError("");
    setAssignSuccess("");
    try {
      await api.assignOrder(selectedOrder.id, selectedWriterId);
      setAssignSuccess("Order assigned successfully.");
      setSelectedOrder(null);
      setSelectedWriterId("");
      // Refresh orders
      setLoading(true);
      api.getAllOrders(currentPage, PAGE_SIZE, activeStatus)
        .then((res) => {
          setOrders(res.orders || []);
          setTotal(res.total || 0);
        })
        .catch((err) => setError(err.message || "Failed to fetch orders"))
        .finally(() => setLoading(false));
    } catch (err) {
      setAssignError(err.message || "Failed to assign order");
    }
    setAssignLoading(false);
  };

  return (
    <Card className="m-1 xs:m-2 sm:m-4 p-1 xs:p-2 sm:p-6 shadow-lg border-0">
      {loading && <Loader />}
      <h2 className="text-base xs:text-lg sm:text-xl font-semibold mb-2 xs:mb-4 text-blue-900">All Orders</h2>
      <Tabs value={activeStatus} onValueChange={handleTabChange} className="mb-4 xs:mb-6">
        <TabsList className="flex w-full overflow-x-auto gap-1 xs:gap-2 bg-white/90 rounded-xl shadow border border-blue-100 p-1 xs:p-2">
          {ORDER_STATUSES.map((status) => (
            <TabsTrigger
              key={status.key}
              value={status.key}
              className={`capitalize px-3 xs:px-6 py-1 xs:py-2 rounded-lg text-xs xs:text-base font-semibold transition-all duration-150
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
            {loading ? (
              <div className="text-center py-8 text-blue-700">Loading orders...</div>
            ) : error ? (
              <div className="text-center py-8 text-red-600">{error}</div>
            ) : (
              <>
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
                      {orders.length > 0 ? (
                        orders.map((order) => (
                          <TableRow key={order.id} className="hover:bg-blue-50">
                            <TableCell className="max-w-[120px] truncate text-xs xs:text-sm sm:text-base">{order.title}</TableCell>
                            <TableCell className="text-xs xs:text-sm sm:text-base">{order.user_id?.slice(-6)}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded text-xs font-semibold ${order.status === 'approved' ? 'bg-green-100 text-green-700' : order.status === 'feedback' ? 'bg-yellow-100 text-yellow-700' : order.status === 'pending_payment' ? 'bg-red-100 text-red-700' : order.status === 'paid' ? 'bg-blue-100 text-blue-700' : order.status === 'awaiting_assignment' ? 'bg-gray-100 text-gray-700' : order.status === 'assigned' ? 'bg-purple-100 text-purple-700' : order.status === 'in_progress' ? 'bg-orange-100 text-orange-700' : order.status === 'submitted_for_review' ? 'bg-cyan-100 text-cyan-700' : order.status === 'completed' ? 'bg-green-200 text-green-900' : 'bg-gray-100 text-gray-700'}`}>{order.status}</span>
                            </TableCell>
                            <TableCell className="text-xs xs:text-sm sm:text-base">{order.writer_id ? order.writer_id.slice(-6) : 'Unassigned'}</TableCell>
                            <TableCell className="text-xs xs:text-sm sm:text-base">${order.price?.toFixed(2)}</TableCell>
                            <TableCell>
                              <Button onClick={() => handleAssignClick(order)} disabled={order.status !== 'awaiting_assignment'} className="w-full sm:w-auto text-xs xs:text-sm sm:text-base">
                                Assign Writer
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-xs xs:text-sm sm:text-base">No orders found.</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                {/* Pagination */}
                <div className="flex flex-col sm:flex-row justify-between items-center mt-4 xs:mt-6 gap-2">
                  <nav
                    className="flex items-center justify-center rounded-full bg-white/80 shadow-sm border border-blue-100 px-2 xs:px-3 py-1 xs:py-2 gap-1"
                    aria-label="Pagination"
                  >
                    <Button
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                      className="rounded-full px-2 xs:px-3 py-1 text-xs xs:text-sm sm:text-base font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 focus:ring-2 focus:ring-blue-400 disabled:opacity-50 border-none shadow-none"
                      aria-label="Previous page"
                    >
                      &lt;
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <Button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`rounded-full px-2 xs:px-3 py-1 text-xs xs:text-sm sm:text-base font-semibold mx-0.5 border-none shadow-none transition-colors
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
                      className="rounded-full px-2 xs:px-3 py-1 text-xs xs:text-sm sm:text-base font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 focus:ring-2 focus:ring-blue-400 disabled:opacity-50 border-none shadow-none"
                      aria-label="Next page"
                    >
                      &gt;
                    </Button>
                  </nav>
                  <span className="text-xs xs:text-sm sm:text-base text-gray-600">Page {currentPage} of {totalPages}</span>
                </div>
              </>
            )}
          </TabsContent>
        ))}
      </Tabs>
      <Dialog
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Assign Writer to Order: ${selectedOrder?.title}`}
      >
        <div className="mb-4">
          <label className="block text-gray-700 text-xs xs:text-sm font-bold mb-2">
            Select Writer:
          </label>
          <Select
            value={selectedWriterId}
            onChange={(e) => setSelectedWriterId(e.target.value)}
            className="bg-white text-xs xs:text-sm sm:text-base"
          >
            <option value="">Choose a writer</option>
            {writers.map((writer) => (
              <option key={writer.id} value={writer.id}>
                {writer.email || writer.username || writer.id}
              </option>
            ))}
          </Select>
        </div>
        {assignError && <div className="text-red-600 text-xs xs:text-sm text-center mb-2">{assignError}</div>}
        {assignSuccess && <div className="text-green-600 text-xs xs:text-sm text-center mb-2">{assignSuccess}</div>}
        <Button onClick={handleAssignConfirm} disabled={!selectedWriterId || assignLoading} className="w-full sm:w-auto text-xs xs:text-sm sm:text-base">
          {assignLoading ? "Assigning..." : "Confirm Assignment"}
        </Button>
      </Dialog>
    </Card>
  );
};

export default OrdersManagement;
