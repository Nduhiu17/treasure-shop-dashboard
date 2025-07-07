import React, { useState } from "react";
import LandingNavbar from "../components/LandingNavbar";
import LandingFooter from "../components/LandingFooter";
// import OrderDetailsPanel from "../components/OrderDetailsPanel";





export default function CustomerProfilePage() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState(null);

  // Filtering & Pagination state
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4; // Mobile-first: fewer per page

  // Order details panel state
  // const [selectedOrderId, setSelectedOrderId] = useState(null);

  // Fetch user and orders on mount and when page/status changes
  React.useEffect(() => {
    const fetchUserAndOrders = async () => {
      try {
        const token = localStorage.getItem("jwt_token");
        const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "";
        // Only fetch user on first load
        if (!user) {
          const userRes = await fetch(`${API_BASE_URL}/api/users/me`, {
            headers: { "Authorization": `Bearer ${token}` }
          });
          if (!userRes.ok) throw new Error("Failed to fetch user");
          const data = await userRes.json();
          setUser(data.user || data);
          setForm(data.user || data);
        }
        // Fetch orders for this user (with pagination and filter)
        let url = `${API_BASE_URL}/api/orders/me?page=${currentPage}&page_size=${pageSize}`;
        if (statusFilter !== "all") {
          url += `&status=${statusFilter}`;
        }
        const ordersRes = await fetch(url, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (!ordersRes.ok) throw new Error("Failed to fetch orders");
        const ordersData = await ordersRes.json();
        if (Array.isArray(ordersData.orders)) {
          setOrders(ordersData.orders);
        } else if (Array.isArray(ordersData)) {
          setOrders(ordersData);
        } else {
          setOrders([]);
        }
      } catch (err) {
        // Optionally handle error
      }
    };
    fetchUserAndOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, statusFilter]);

  // Order summary
  const totalOrders = orders.length;
  const completedOrders = orders.filter(o => o.status === "approved").length;
  const inProgressOrders = orders.filter(o => o.status === "in_progress").length;
  const totalSpent = orders.reduce((sum, o) => sum + (o.price || 0), 0);

  // Filtering logic
  // Allowed statuses for filtering (must match backend and project-wide allowed set)
  const allowedStatuses = [
    "pending_payment",
    "paid",
    "awaiting_assignment",
    "assigned",
    "in_progress",
    "submitted_for_review",
    "approved",
    "feedback"
  ];

  // Orders are now paginated from backend
  const filteredOrders = orders;
  // Pagination: backend-driven, so we only show current page
  const paginatedOrders = filteredOrders;
  // Note: totalPages should ideally come from backend response for true pagination
  const totalPages = filteredOrders.length < pageSize ? currentPage : currentPage + 1;

  const handleEdit = () => {
    setEditMode(true);
    setForm(user);
  };
  const handleCancel = () => setEditMode(false);
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("jwt_token");
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error("Failed to update user");
      const updated = await res.json();
      setUser(updated.user || updated);
      setEditMode(false);
    } catch (err) {
      // Optionally handle error
    }
  };

  if (!user || !form) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="text-xl text-fuchsia-700 font-bold">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-blue-100">
      <LandingNavbar user={user} />
      <main className="flex-1 w-full max-w-2xl mx-auto px-2 sm:px-4 py-6 sm:py-10 animate-fade-in">
        <div className="bg-white/90 rounded-3xl shadow-2xl border-2 border-fuchsia-100 p-4 sm:p-8 flex flex-col gap-8">
          {/* Profile header */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
            <div className="flex-shrink-0 w-20 h-20 rounded-full bg-gradient-to-br from-fuchsia-200 via-cyan-100 to-yellow-100 flex items-center justify-center text-4xl font-bold text-fuchsia-700 shadow-lg border-2 border-fuchsia-200">
              {user.first_name?.[0]}{user.last_name?.[0]}
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-extrabold text-fuchsia-700">My Profile</h2>
                {!editMode && (
                  <button className="ml-2 px-3 py-1 text-xs font-bold rounded-lg bg-cyan-50 text-cyan-700 border border-cyan-200 hover:bg-cyan-100 transition-all" onClick={handleEdit}>Edit</button>
                )}
              </div>
              <div className="flex flex-col gap-1 mt-2">
                <label className="text-xs font-semibold text-slate-500">First Name</label>
                {editMode ? (
                  <input className="input" value={form.first_name || ""} onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))} />
                ) : (
                  <div className="font-bold text-slate-800">{user.first_name}</div>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-500">Last Name</label>
                {editMode ? (
                  <input className="input" value={form.last_name || ""} onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))} />
                ) : (
                  <div className="font-bold text-slate-800">{user.last_name}</div>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-500">Username</label>
                {editMode ? (
                  <input className="input" value={form.username || ""} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} />
                ) : (
                  <div className="font-bold text-slate-800">{user.username}</div>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-500">Email</label>
                {editMode ? (
                  <input className="input" value={form.email || ""} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                ) : (
                  <div className="font-bold text-slate-800">{user.email}</div>
                )}
              </div>
              {editMode && (
                <div className="flex gap-2 mt-2">
                  <button className="px-4 py-1 rounded-lg bg-fuchsia-500 text-white font-bold hover:bg-fuchsia-600 transition-all" onClick={handleSave}>Save</button>
                  <button className="px-4 py-1 rounded-lg bg-slate-100 text-slate-700 font-bold border border-slate-200 hover:bg-slate-200 transition-all" onClick={handleCancel}>Cancel</button>
                </div>
              )}
            </div>
          </div>

          {/* Order summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="bg-gradient-to-br from-fuchsia-50 to-cyan-50 rounded-xl p-4 shadow border border-fuchsia-100">
              <div className="text-2xl font-extrabold text-fuchsia-700">{totalOrders}</div>
              <div className="text-xs font-semibold text-slate-500 mt-1">Total Orders</div>
            </div>
            <div className="bg-gradient-to-br from-cyan-50 to-yellow-50 rounded-xl p-4 shadow border border-cyan-100">
              <div className="text-2xl font-extrabold text-cyan-700">{completedOrders}</div>
              <div className="text-xs font-semibold text-slate-500 mt-1">Completed</div>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-fuchsia-50 rounded-xl p-4 shadow border border-yellow-100">
              <div className="text-2xl font-extrabold text-yellow-600">{inProgressOrders}</div>
              <div className="text-xs font-semibold text-slate-500 mt-1">In Progress</div>
            </div>
            <div className="bg-gradient-to-br from-fuchsia-50 to-blue-50 rounded-xl p-4 shadow border border-blue-100">
              <div className="text-2xl font-extrabold text-blue-700">${totalSpent.toFixed(2)}</div>
              <div className="text-xs font-semibold text-slate-500 mt-1">Total Spent</div>
            </div>
          </div>

          {/* Orders list with filtering and pagination */}
          <div>
            <div className="flex flex-col sm:flex-row gap-2 items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-fuchsia-700">My Orders</h3>
              <select
                className="border border-fuchsia-200 rounded-lg px-3 py-2 text-fuchsia-700 shadow focus:ring-2 focus:ring-fuchsia-400"
                value={statusFilter}
                onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              >
                <option value="all">All Statuses</option>
                <option value="pending_payment">Pending Payment</option>
                <option value="paid">Paid</option>
                <option value="awaiting_assignment">Awaiting Assignment</option>
                <option value="assigned">Assigned</option>
                <option value="in_progress">In Progress</option>
                <option value="submitted_for_review">Submitted for Review</option>
                <option value="approved">Approved</option>
                <option value="feedback">Feedback</option>
              </select>
            </div>
            {/* Mobile-first card view */}
            <div className="flex flex-col gap-3 sm:hidden">
              {filteredOrders.map(order => (
                <div key={order.id} className="rounded-xl border border-fuchsia-100 bg-fuchsia-50/60 shadow p-3 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-slate-600">{order.id}</span>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${
                      order.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : order.status === "feedback"
                        ? "bg-yellow-100 text-yellow-700"
                        : order.status === "pending_payment"
                        ? "bg-fuchsia-100 text-fuchsia-700"
                        : order.status === "awaiting_assignment"
                        ? "bg-gray-100 text-gray-700"
                        : order.status === "assigned"
                        ? "bg-purple-100 text-purple-700"
                        : order.status === "in_progress"
                        ? "bg-orange-100 text-orange-700"
                        : order.status === "submitted_for_review"
                        ? "bg-cyan-100 text-cyan-700"
                        : "bg-slate-100 text-slate-700"
                    }`}>
                      {order.status.replace(/_/g, " ")}
                    </span>
                  </div>
                  <div className="font-semibold text-slate-800 truncate" title={order.title}>{order.title}</div>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{order.date}</span>
                    <span className="text-blue-700 font-bold">${order.price.toFixed(2)}</span>
                  </div>
                  <a
                    href={`/order/${order.id}`}
                    className="mt-2 inline-block px-3 py-1 rounded-lg bg-cyan-500 text-white font-bold text-xs hover:bg-cyan-600 transition-all shadow text-center"
                  >
                    View Details
                  </a>
                </div>
              ))}
            </div>
            {/* Desktop table view */}
            <div className="hidden sm:block">
              <table className="w-full bg-white rounded-xl shadow-lg overflow-hidden">
                <thead className="bg-gradient-to-r from-fuchsia-50 to-cyan-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-bold text-fuchsia-700">Order ID</th>
                    <th className="px-4 py-2 text-left text-xs font-bold text-fuchsia-700">Title</th>
                    <th className="px-4 py-2 text-left text-xs font-bold text-fuchsia-700">Status</th>
                    <th className="px-4 py-2 text-left text-xs font-bold text-fuchsia-700">Date</th>
                    <th className="px-4 py-2 text-left text-xs font-bold text-fuchsia-700">Price</th>
                    <th className="px-4 py-2 text-left text-xs font-bold text-fuchsia-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(order => (
                    <tr key={order.id} className="hover:bg-fuchsia-50 transition">
                      <td className="px-4 py-2 font-mono text-xs text-slate-600">{order.id}</td>
                      <td className="px-4 py-2 font-semibold text-slate-800">{order.title}</td>
                      <td className="px-4 py-2">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${
                          order.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : order.status === "feedback"
                            ? "bg-yellow-100 text-yellow-700"
                            : order.status === "pending_payment"
                            ? "bg-fuchsia-100 text-fuchsia-700"
                            : order.status === "awaiting_assignment"
                            ? "bg-gray-100 text-gray-700"
                            : order.status === "assigned"
                            ? "bg-purple-100 text-purple-700"
                            : order.status === "in_progress"
                            ? "bg-orange-100 text-orange-700"
                            : order.status === "submitted_for_review"
                            ? "bg-cyan-100 text-cyan-700"
                            : "bg-slate-100 text-slate-700"
                        }`}>
                          {order.status.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-xs text-slate-500">{order.date}</td>
                      <td className="px-4 py-2 text-blue-700 font-bold">${order.price.toFixed(2)}</td>
                      <td className="px-4 py-2">
                        <a
                          href={`/order/${order.id}`}
                          className="inline-block px-3 py-1 rounded-lg bg-cyan-500 text-white font-bold text-xs hover:bg-cyan-600 transition-all shadow"
                        >
                          View Details
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          {/* Order Details Panel (modal style overlay) */}
          {/* (removed by undo) */}
            {/* Pagination */}
            <div className="flex justify-center items-center gap-2 mt-4">
              <button
                className="px-3 py-1 rounded-full bg-fuchsia-100 text-fuchsia-700 hover:bg-fuchsia-200 font-bold shadow transition"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                &lt;
              </button>
              {[...Array(totalPages).keys()].map(i => (
                <button
                  key={i}
                  className={`px-3 py-1 rounded-full font-bold shadow transition
                    ${currentPage === i + 1
                      ? "bg-gradient-to-r from-fuchsia-500 to-cyan-500 text-white"
                      : "bg-fuchsia-100 text-fuchsia-700 hover:bg-fuchsia-200"}`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button
                className="px-3 py-1 rounded-full bg-fuchsia-100 text-fuchsia-700 hover:bg-fuchsia-200 font-bold shadow transition"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                &gt;
              </button>
            </div>
            {/* No orders message */}
            {filteredOrders.length === 0 && (
              <div className="text-center text-slate-500 mt-6">
                No orders found for this filter.
              </div>
            )}
          </div>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}

// Add this to your global CSS for .input:
// .input { @apply bg-fuchsia-50 border-2 border-fuchsia-200 focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-200 text-fuchsia-800 font-bold placeholder-slate-400 rounded-xl shadow px-4 py-3 transition-all duration-150 w-full; }
