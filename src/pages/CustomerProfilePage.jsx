import React, { useState } from "react";
import LandingNavbar from "../components/LandingNavbar";
import LandingFooter from "../components/LandingFooter";

// Hardcoded user and orders data for design/demo
const initialUser = {
  firstName: "Jane",
  lastName: "Doe",
  username: "janedoe123",
  email: "jane.doe@email.com",
};

const orders = [
  {
    id: "ORD-1001",
    title: "Research Paper on AI",
    status: "Completed",
    date: "2025-06-15",
    price: 120.5,
  },
  {
    id: "ORD-1002",
    title: "Essay: Climate Change",
    status: "In Progress",
    date: "2025-07-01",
    price: 75.0,
  },
  {
    id: "ORD-1003",
    title: "Book Review: 1984",
    status: "Completed",
    date: "2025-05-20",
    price: 60.0,
  },
];

export default function CustomerProfilePage() {
  const [user, setUser] = useState(initialUser);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState(user);

  // Order summary
  const totalOrders = orders.length;
  const completedOrders = orders.filter(o => o.status === "Completed").length;
  const inProgressOrders = orders.filter(o => o.status === "In Progress").length;
  const totalSpent = orders.reduce((sum, o) => sum + o.price, 0);

  const handleEdit = () => {
    setEditMode(true);
    setForm(user);
  };
  const handleCancel = () => setEditMode(false);
  const handleSave = () => {
    setUser(form);
    setEditMode(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-blue-100">
      <LandingNavbar user={user} />
      <main className="flex-1 w-full max-w-2xl mx-auto px-2 sm:px-4 py-6 sm:py-10 animate-fade-in">
        <div className="bg-white/90 rounded-3xl shadow-2xl border-2 border-fuchsia-100 p-4 sm:p-8 flex flex-col gap-8">
          {/* Profile header */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
            <div className="flex-shrink-0 w-20 h-20 rounded-full bg-gradient-to-br from-fuchsia-200 via-cyan-100 to-yellow-100 flex items-center justify-center text-4xl font-bold text-fuchsia-700 shadow-lg border-2 border-fuchsia-200">
              {user.firstName[0]}{user.lastName[0]}
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
                  <input className="input" value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} />
                ) : (
                  <div className="font-bold text-slate-800">{user.firstName}</div>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-500">Last Name</label>
                {editMode ? (
                  <input className="input" value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} />
                ) : (
                  <div className="font-bold text-slate-800">{user.lastName}</div>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-500">Username</label>
                {editMode ? (
                  <input className="input" value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} />
                ) : (
                  <div className="font-bold text-slate-800">{user.username}</div>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-500">Email</label>
                {editMode ? (
                  <input className="input" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
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

          {/* Orders list */}
          <div>
            <h3 className="text-lg font-bold text-fuchsia-700 mb-3">My Orders</h3>
            <div className="overflow-x-auto rounded-xl border border-fuchsia-100 bg-white shadow">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-fuchsia-50 to-cyan-50 text-fuchsia-700">
                    <th className="px-3 py-2 text-left font-bold">Order ID</th>
                    <th className="px-3 py-2 text-left font-bold">Title</th>
                    <th className="px-3 py-2 text-left font-bold">Status</th>
                    <th className="px-3 py-2 text-left font-bold">Date</th>
                    <th className="px-3 py-2 text-left font-bold">Price</th>
                    <th className="px-3 py-2 text-left font-bold">View Details</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id} className="border-b last:border-b-0 hover:bg-fuchsia-50/40">
                      <td className="px-3 py-2 font-mono text-xs text-slate-600">{order.id}</td>
                      <td className="px-3 py-2 font-semibold text-slate-800">{order.title}</td>
                      <td className="px-3 py-2">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${order.status === "Completed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-slate-500">{order.date}</td>
                      <td className="px-3 py-2 text-blue-700 font-bold">${order.price.toFixed(2)}</td>
                      <td className="px-3 py-2">
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
          </div>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}

// Add this to your global CSS for .input:
// .input { @apply bg-fuchsia-50 border-2 border-fuchsia-200 focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-200 text-fuchsia-800 font-bold placeholder-slate-400 rounded-xl shadow px-4 py-3 transition-all duration-150 w-full; }
