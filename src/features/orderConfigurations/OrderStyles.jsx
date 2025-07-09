import React, { useEffect, useState, useRef } from "react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { useToast } from "../../components/ui/toast";
import ConfirmDialog from "../../components/ui/ConfirmDialog";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const OrderStyles = () => {
  const { showToast } = useToast();
  const [orderStyles, setOrderStyles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', description: '' });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const nameRef = useRef();
  const descRef = useRef();

  const fetchOrderStyles = () => {
    setLoading(true);
    setError("");
    fetch(`${API_BASE_URL}/api/order-styles`)
      .then((res) => res.json())
      .then((data) => setOrderStyles(data))
      .catch((err) => setError("Failed to fetch order styles"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrderStyles();
  }, []);

  const handleCreateOrderStyle = async (e) => {
    e.preventDefault();
    setCreating(true);
    const name = nameRef.current.value.trim();
    const description = descRef.current.value.trim();
    if (!name) {
      showToast({ message: "Name is required", type: "error" });
      setCreating(false);
      return;
    }
    try {
      const jwt = localStorage.getItem("jwt_token");
      const res = await fetch(`${API_BASE_URL}/api/admin/order-styles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: jwt ? `Bearer ${jwt}` : "",
        },
        body: JSON.stringify({ name, description }),
      });
      if (!res.ok) throw new Error("Failed to create order style");
      showToast({ message: "Order style created successfully", type: "success" });
      setDialogOpen(false);
      fetchOrderStyles();
    } catch (err) {
      showToast({ message: err.message || "Failed to create order style", type: "error" });
    } finally {
      setCreating(false);
    }
  };

  // Delete Order Style
  const handleDeleteOrderStyle = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const jwt = localStorage.getItem("jwt_token");
      const res = await fetch(`${API_BASE_URL}/api/admin/order-styles/${deleteTarget.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: jwt ? `Bearer ${jwt}` : "",
        },
      });
      if (!res.ok) throw new Error("Failed to delete order style");
      showToast({ message: `Order style '${deleteTarget.name}' deleted successfully`, type: "success" });
      setOrderStyles(orderStyles => orderStyles.filter(os => os.id !== deleteTarget.id));
      setConfirmOpen(false);
      setDeleteTarget(null);
    } catch (err) {
      showToast({ message: err.message || "Failed to delete order style", type: "error" });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <ConfirmDialog
        isOpen={confirmOpen}
        title="Delete Order Style"
        message={deleteTarget ? `Are you sure you want to delete order style '${deleteTarget.name}'? This action cannot be undone.` : ''}
        confirmText={deleting ? "Deleting..." : "Delete"}
        cancelText="Cancel"
        loading={deleting}
        onCancel={() => { setConfirmOpen(false); setDeleteTarget(null); }}
        onConfirm={handleDeleteOrderStyle}
      />
      <Card className="m-1 xs:m-2 sm:m-4 p-1 xs:p-2 sm:p-6 shadow-lg border-0 w-full max-w-none">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
          <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-blue-900">Order Styles Management</h2>
          <Button
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold shadow hover:from-blue-700 hover:to-cyan-600 transition-all duration-150"
            onClick={() => setDialogOpen(true)}
          >
            + Create Order Style
          </Button>
        </div>
        {loading ? (
          <div className="text-center py-8 text-blue-700">Loading order styles...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-600">{error}</div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full border-separate border-spacing-y-0 rounded-2xl overflow-hidden shadow-xl bg-white">
              <thead className="sticky top-0 bg-gradient-to-r from-blue-100 to-blue-50 z-10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-blue-800 uppercase tracking-wider border-b border-blue-200">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-blue-800 uppercase tracking-wider border-b border-blue-200">Description</th>
                  <th className="px-6 py-3 text-right text-xs font-bold text-blue-800 uppercase tracking-wider border-b border-blue-200">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-100">
                {orderStyles.length > 0 ? orderStyles.map((style, idx) => (
                  <tr key={style.id} className={`transition group ${idx % 2 === 0 ? 'bg-white' : 'bg-blue-50'} hover:bg-blue-100`} style={{ boxShadow: '0 1px 4px 0 rgba(30, 64, 175, 0.04)' }}>
                    <td className="px-6 py-4 font-semibold text-blue-900 capitalize align-middle">{style.name}</td>
                    <td className="px-6 py-4 text-gray-700 align-middle">{style.description}</td>
                    <td className="px-6 py-4 text-right align-middle">
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-600 hover:text-blue-800 focus:outline-none shadow-sm transition"
                          title="Edit order style"
                          onClick={e => {
                            e.preventDefault();
                            setEditTarget(style);
                            setEditForm({ name: style.name, description: style.description || '' });
                            setEditOpen(true);
                          }}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 11l6 6M3 17v4h4l10.293-10.293a1 1 0 0 0 0-1.414l-3.586-3.586a1 1 0 0 0-1.414 0L3 17z" />
                          </svg>
                        </button>
                        <Button
                          variant="destructive"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold shadow-md hover:from-red-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition-all duration-150 text-xs xs:text-sm sm:text-base"
                          title="Delete Order Style"
                          onClick={() => {
                            setDeleteTarget(style);
                            setConfirmOpen(true);
                          }}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={3} className="text-center text-xs xs:text-sm sm:text-base px-4 py-1">No order styles found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      {/* Edit Order Style Dialog (outside Card/table) */}
      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-auto">
            <h3 className="text-lg font-bold mb-4 text-blue-900">Edit Order Style</h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!editTarget) return;
                setEditing(true);
                try {
                  const jwt = localStorage.getItem("jwt_token");
                  const res = await fetch(`${API_BASE_URL}/api/admin/order-styles/${editTarget.id}`, {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: jwt ? `Bearer ${jwt}` : "",
                    },
                    body: JSON.stringify({ name: editForm.name, description: editForm.description }),
                  });
                  if (!res.ok) throw new Error("Failed to update order style");
                  showToast({ message: "Order style updated successfully", type: "success" });
                  setEditOpen(false);
                  setEditTarget(null);
                  fetchOrderStyles();
                } catch (err) {
                  showToast({ message: err.message || "Failed to update order style", type: "error" });
                } finally {
                  setEditing(false);
                }
              }}
              className="flex flex-col gap-4"
            >
              <label className="font-semibold text-blue-900 text-sm sm:text-base">Name
                <input
                  type="text"
                  className="mt-1 w-full rounded-lg border border-blue-200 px-3 py-2 text-blue-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-150 shadow-sm"
                  placeholder="e.g. APA"
                  required
                  value={editForm.name}
                  onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                  disabled={editing}
                />
              </label>
              <label className="font-semibold text-blue-900 text-sm sm:text-base">Description
                <textarea
                  className="mt-1 w-full rounded-lg border border-blue-200 px-3 py-2 text-blue-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-150 shadow-sm min-h-[60px] resize-y"
                  placeholder="e.g. American Psychological Association style"
                  value={editForm.description}
                  onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))}
                  disabled={editing}
                />
              </label>
              <div className="flex flex-row justify-end gap-2 mt-2">
                <Button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-gray-200 text-blue-900 font-semibold shadow hover:bg-gray-300 transition-all duration-150"
                  onClick={() => setEditOpen(false)}
                  disabled={editing}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold shadow hover:from-blue-700 hover:to-cyan-600 transition-all duration-150 flex items-center gap-2"
                  disabled={editing}
                >
                  {editing && <span className="loader border-white border-t-blue-400 mr-2 w-4 h-4 rounded-full border-2 border-solid animate-spin"></span>}
                  Update
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Create Order Style Dialog (outside Card/table) */}
      {dialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-auto">
            <h3 className="text-lg font-bold mb-4 text-blue-900">Create Order Style</h3>
            <form onSubmit={handleCreateOrderStyle} className="flex flex-col gap-4">
              <label className="font-semibold text-blue-900 text-sm sm:text-base">Name
                <input
                  ref={nameRef}
                  type="text"
                  className="mt-1 w-full rounded-lg border border-blue-200 px-3 py-2 text-blue-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-150 shadow-sm"
                  placeholder="e.g. APA"
                  required
                  disabled={creating}
                />
              </label>
              <label className="font-semibold text-blue-900 text-sm sm:text-base">Description
                <textarea
                  ref={descRef}
                  className="mt-1 w-full rounded-lg border border-blue-200 px-3 py-2 text-blue-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-150 shadow-sm min-h-[60px] resize-y"
                  placeholder="e.g. American Psychological Association style"
                  disabled={creating}
                />
              </label>
              <div className="flex flex-row justify-end gap-2 mt-2">
                <Button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-gray-200 text-blue-900 font-semibold shadow hover:bg-gray-300 transition-all duration-150"
                  onClick={() => setDialogOpen(false)}
                  disabled={creating}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold shadow hover:from-blue-700 hover:to-cyan-600 transition-all duration-150 flex items-center gap-2"
                  disabled={creating}
                >
                  {creating && <span className="loader border-white border-t-blue-400 mr-2 w-4 h-4 rounded-full border-2 border-solid animate-spin"></span>}
                  Create
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderStyles;
