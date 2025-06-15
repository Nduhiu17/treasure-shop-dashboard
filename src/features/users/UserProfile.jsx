import React, { useEffect, useState } from "react";
import { Card } from "../../components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "../../components/ui/table";
import Loader from "../../components/ui/Loader";
import { useAuth } from "../auth/AuthProvider";

const UserProfile = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const PAGE_SIZE = 10;

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    setError("");
    const jwt = localStorage.getItem("jwt_token");
    const roles = user.roles || [];
    // Only run this effect when user or user.roles changes
    // Role-based filtering
    let url = `http://localhost:8080/api/admin/orders?page=${currentPage}&page_size=${PAGE_SIZE}`;
    if (roles.includes("super_admin") || roles.includes("admin")) {
      // No filter, show all orders
    } else if (roles.includes("writer")) {
      url = `http://localhost:8080/api/writer/orders/${user.id}?page=${currentPage}&page_size=${PAGE_SIZE}`;
    } else if (roles.length === 1 && roles[0] === "user") {
      url = `http://localhost:8080/api/orders/me?page=${currentPage}&page_size=${PAGE_SIZE}`;
    }
    fetch(url,
      {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Authorization": jwt ? `Bearer ${jwt}` : ""
        }
      }
    )
      .then(res => res.json())
      .then(data => {
        console.log('Orders API response:', data);
        // Handle both array and object response
        if (Array.isArray(data)) {
          setOrders(data);
          setTotal(data.length);
        } else {
          setOrders(data.orders || []);
          setTotal(data.total || (data.orders ? data.orders.length : 0));
        }
        setLoading(false);
      })
      .catch(err => {
        setError("Failed to fetch orders");
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user && user.id, user && JSON.stringify(user.roles), currentPage]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const handlePrevPage = () => setCurrentPage((p) => Math.max(1, p - 1));
  const handleNextPage = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  if (!user) {
    return <div className="flex justify-center items-center min-h-[40vh]"><Loader /></div>;
  }

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <Card className="p-6 mb-8 shadow-lg border-0">
        <h2 className="text-xl font-bold text-blue-900 mb-4">User Profile</h2>
        <div className="mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
            <span className="font-semibold text-blue-700 w-32">Username:</span>
            <span className="text-blue-900">{user?.username}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
            <span className="font-semibold text-blue-700 w-32">Email:</span>
            <span className="text-blue-900">{user?.email}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
            <span className="font-semibold text-blue-700 w-32">Password:</span>
            <span className="text-blue-900">********</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
            <span className="font-semibold text-blue-700 w-32">Role:</span>
            <span className="text-blue-900 capitalize">{user?.role}</span>
          </div>
        </div>
      </Card>
      <Card className="p-6 shadow-lg border-0">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Orders</h3>
        {loading ? (
          <Loader />
        ) : error ? (
          <div className="text-center text-red-600 py-8">{error}</div>
        ) : orders.length === 0 ? (
          <div className="text-center text-gray-500 py-8">No orders found.</div>
        ) : (
          <>
            <div className="overflow-x-auto rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Writer</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map(order => (
                    <TableRow key={order.id} className="hover:bg-blue-50">
                      <TableCell className="max-w-[120px] truncate text-xs xs:text-sm sm:text-base">{order.title}</TableCell>
                      <TableCell className="text-xs xs:text-sm sm:text-base">{order.status}</TableCell>
                      <TableCell className="text-xs xs:text-sm sm:text-base">{order.writer_id ? order.writer_id.slice(-6) : 'Unassigned'}</TableCell>
                      <TableCell className="text-xs xs:text-sm sm:text-base">${order.price?.toFixed(2)}</TableCell>
                      <TableCell>
                        {/* Writer actions based on order status */}
                        {user.roles.includes("writer") ? (
                          order.status === "awaiting_asign_acceptance" ? (
                            <div className="flex gap-2">
                              <button
                                className="px-3 py-1 rounded-lg bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold shadow hover:from-green-600 hover:to-green-800 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-green-400"
                                onClick={async () => {
                                  const jwt = localStorage.getItem("jwt_token");
                                  try {
                                    const res = await fetch(`http://localhost:8080/api/writer/orders/${order.id}/assignment-response`, {
                                      method: 'PUT',
                                      headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': jwt ? `Bearer ${jwt}` : ''
                                      },
                                      body: JSON.stringify({ accept: true })
                                    });
                                    if (!res.ok) throw new Error('Failed to accept assignment');
                                    setLoading(true);
                                    setCurrentPage(1);
                                  } catch (err) {
                                    alert(err.message || 'Failed to accept assignment');
                                  }
                                }}
                              >
                                Accept
                              </button>
                              <button
                                className="px-3 py-1 rounded-lg bg-gradient-to-r from-red-500 to-red-700 text-white font-semibold shadow hover:from-red-600 hover:to-red-800 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-red-400"
                                onClick={async () => {
                                  const jwt = localStorage.getItem("jwt_token");
                                  try {
                                    const res = await fetch(`http://localhost:8080/api/writer/orders/${order.id}/assignment-response`, {
                                      method: 'PUT',
                                      headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': jwt ? `Bearer ${jwt}` : ''
                                      },
                                      body: JSON.stringify({ accept: false })
                                    });
                                    if (!res.ok) throw new Error('Failed to decline assignment');
                                    setLoading(true);
                                    setCurrentPage(1);
                                  } catch (err) {
                                    alert(err.message || 'Failed to decline assignment');
                                  }
                                }}
                              >
                                Decline
                              </button>
                            </div>
                          ) : order.status === "assigned" ? (
                            <button
                              className="px-3 py-1 rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold shadow hover:from-blue-600 hover:to-blue-800 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400"
                              onClick={async () => {
                                const jwt = localStorage.getItem("jwt_token");
                                try {
                                  const res = await fetch(`http://localhost:8080/api/writer/orders/${order.id}/submit`, {
                                    method: 'POST',
                                    headers: {
                                      'Content-Type': 'application/json',
                                      'Authorization': jwt ? `Bearer ${jwt}` : ''
                                    },
                                    body: JSON.stringify({ content: "submission content" })
                                  });
                                  if (!res.ok) throw new Error('Failed to submit order');
                                  setLoading(true);
                                  setCurrentPage(1);
                                } catch (err) {
                                  alert(err.message || 'Failed to submit order');
                                }
                              }}
                            >
                              Submit
                            </button>
                          ) : order.status === "feedback" ? (
                            <button
                              className="px-3 py-1 rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-semibold shadow cursor-not-allowed opacity-70"
                              disabled
                              onClick={() => alert('Order was resubmitted for rework.')}
                            >
                              Rework Required
                            </button>
                          ) : order.status === "approved" ? (
                            <button
                              className="px-3 py-1 rounded-lg bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold shadow cursor-not-allowed opacity-70"
                              disabled
                            >
                              Completed
                            </button>
                          ) : order.status === "submitted_for_review" ? (
                            <button
                              className="px-3 py-1 rounded-lg bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold shadow cursor-not-allowed opacity-80"
                              disabled
                            >
                              Awaiting Approval
                            </button>
                          ) : null
                        ) : user.roles.length === 1 && user.roles[0] === "user" ? (
                          order.status === "awaiting_asign_acceptance" ? (
                            <button
                              className="px-3 py-1 rounded-lg bg-gradient-to-r from-blue-400 to-blue-700 text-white font-semibold shadow cursor-not-allowed opacity-80"
                              disabled
                            >
                              Awaiting Writer Assignment
                            </button>
                          ) : order.status === "assigned" ? (
                            <button
                              className="px-3 py-1 rounded-lg bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold shadow cursor-not-allowed opacity-80"
                              disabled
                            >
                              Order being worked on
                            </button>
                          ) : order.status === "submitted_for_review" ? (
                            <div className="flex gap-2">
                              <button
                                className="px-3 py-1 rounded-lg bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold shadow hover:from-green-600 hover:to-green-800 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-green-400"
                                onClick={async () => {
                                  const jwt = localStorage.getItem("jwt_token");
                                  try {
                                    const res = await fetch(`http://localhost:8080/api/orders/${order.id}/review/approve`, {
                                      method: 'PUT',
                                      headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': jwt ? `Bearer ${jwt}` : ''
                                      }
                                    });
                                    if (!res.ok) throw new Error('Failed to approve order');
                                    setLoading(true);
                                    setCurrentPage(1);
                                  } catch (err) {
                                    alert(err.message || 'Failed to approve order');
                                  }
                                }}
                              >
                                Approve
                              </button>
                              <button
                                className="px-3 py-1 rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-semibold shadow hover:from-yellow-500 hover:to-yellow-700 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                onClick={async () => {
                                  const jwt = localStorage.getItem("jwt_token");
                                  try {
                                    const res = await fetch(`http://localhost:8080/api/orders/${order.id}/review/feedback`, {
                                      method: 'PUT',
                                      headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': jwt ? `Bearer ${jwt}` : ''
                                      },
                                      body: JSON.stringify({ feedback: "Please review this order." })
                                    });
                                    if (!res.ok) throw new Error('Failed to request review');
                                    setLoading(true);
                                    setCurrentPage(1);
                                  } catch (err) {
                                    alert(err.message || 'Failed to request review');
                                  }
                                }}
                              >
                                Request Review
                              </button>
                            </div>
                          ) : order.status === "feedback" ? (
                            <button
                              className="px-3 py-1 rounded-lg bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold shadow cursor-not-allowed opacity-80"
                              disabled
                            >
                              Applying Feedback
                            </button>
                          ) : order.status === "approved" ? (
                            <button
                              className="px-3 py-1 rounded-lg bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold shadow cursor-not-allowed opacity-80"
                              disabled
                            >
                              Completed
                            </button>
                          ) : (
                            <span className="text-blue-700 font-semibold">View</span>
                          )
                        ) : null}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {/* Pagination */}
            <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-2">
              <nav className="flex items-center justify-center rounded-full bg-white/80 shadow-sm border border-blue-100 px-2 py-1 gap-1" aria-label="Pagination">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="rounded-full px-3 py-1 text-xs sm:text-base font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 focus:ring-2 focus:ring-blue-400 disabled:opacity-50 border-none shadow-none"
                  aria-label="Previous page"
                >
                  &lt;
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`rounded-full px-3 py-1 text-xs sm:text-base font-medium mx-0.5 border-none shadow-none transition-colors ${currentPage === i + 1 ? 'bg-blue-700 text-white ring-2 ring-blue-400' : 'bg-transparent text-blue-700 hover:bg-blue-100'}`}
                    aria-current={currentPage === i + 1 ? 'page' : undefined}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="rounded-full px-3 py-1 text-xs sm:text-base font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 focus:ring-2 focus:ring-blue-400 disabled:opacity-50 border-none shadow-none"
                  aria-label="Next page"
                >
                  &gt;
                </button>
              </nav>
              <span className="text-xs sm:text-base text-gray-600">Page {currentPage} of {totalPages}</span>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default UserProfile;
