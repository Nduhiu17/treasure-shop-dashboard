import React, { useEffect, useState, useRef } from "react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { useToast } from "../../components/ui/toast";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const OrderLanguages = () => {
  const { showToast } = useToast();
  const [orderLanguages, setOrderLanguages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const nameRef = useRef();
  const descRef = useRef();

  const fetchOrderLanguages = () => {
    setLoading(true);
    setError("");
    fetch(`${API_BASE_URL}/api/order-languages`)
      .then((res) => res.json())
      .then((data) => setOrderLanguages(data))
      .catch((err) => setError("Failed to fetch order languages"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrderLanguages();
  }, []);

  const handleCreateOrderLanguage = async (e) => {
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
      const res = await fetch(`${API_BASE_URL}/api/admin/order-languages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: jwt ? `Bearer ${jwt}` : "",
        },
        body: JSON.stringify({ name, description }),
      });
      if (!res.ok) throw new Error("Failed to create order language");
      showToast({ message: "Order language created successfully", type: "success" });
      setDialogOpen(false);
      fetchOrderLanguages();
    } catch (err) {
      showToast({ message: err.message || "Failed to create order language", type: "error" });
    } finally {
      setCreating(false);
    }
  };

  return (
    <Card className="m-1 xs:m-2 sm:m-4 p-1 xs:p-2 sm:p-6 shadow-lg border-0 w-full max-w-none">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
        <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-blue-900">Order Languages Management</h2>
        <Button
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold shadow hover:from-blue-700 hover:to-cyan-600 transition-all duration-150"
          onClick={() => setDialogOpen(true)}
        >
          + Create Order Language
        </Button>
      </div>
      {loading ? (
        <div className="text-center py-8 text-blue-700">Loading order languages...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-600">{error}</div>
      ) : (
        <div className="rounded-2xl border border-blue-100 bg-white/90 shadow-lg w-full min-h-[320px]" style={{ height: '60vh' }}>
          <div className="overflow-x-auto h-full">
            <table className="w-full min-w-[800px] text-xs xs:text-sm sm:text-base table-fixed">
              <thead className="sticky top-0 z-20 bg-gradient-to-r from-blue-50 via-blue-100 to-cyan-100/80 shadow-md border-b-2 border-blue-200">
                <tr>
                  <th className="px-4 py-3 w-1/4 text-left font-extrabold text-blue-900 text-xs xs:text-sm sm:text-base tracking-wide uppercase bg-opacity-90 backdrop-blur-md border-r border-blue-100 last:border-r-0 whitespace-nowrap shadow-sm" style={{ letterSpacing: '0.04em', background: 'rgba(255,255,255,0.85)' }}>Name</th>
                  <th className="px-4 py-3 w-2/4 text-left font-extrabold text-blue-900 text-xs xs:text-sm sm:text-base tracking-wide uppercase bg-opacity-90 backdrop-blur-md border-r border-blue-100 last:border-r-0 whitespace-nowrap shadow-sm" style={{ letterSpacing: '0.04em', background: 'rgba(236,245,255,0.85)' }}>Description</th>
                  <th className="px-4 py-3 w-1/4 text-left font-extrabold text-blue-900 text-xs xs:text-sm sm:text-base tracking-wide uppercase bg-opacity-90 backdrop-blur-md border-r border-blue-100 last:border-r-0 whitespace-nowrap shadow-sm" style={{ letterSpacing: '0.04em', background: 'rgba(255,255,255,0.85)' }}>Actions</th>
                </tr>
              </thead>
            </table>
            <div className="overflow-y-auto" style={{ maxHeight: 'calc(60vh - 56px)' }}>
              <table className="w-full min-w-[800px] text-xs xs:text-sm sm:text-base table-fixed">
                <tbody>
                  {orderLanguages.length > 0 ? orderLanguages.map((lang) => (
                    <tr key={lang.id} className="hover:bg-blue-50 h-10">
                      <td className="max-w-[120px] truncate text-xs xs:text-sm sm:text-base px-4 py-1 align-middle w-1/4">{lang.name}</td>
                      <td className="text-xs xs:text-sm sm:text-base px-4 py-1 align-middle w-2/4">{lang.description}</td>
                      <td className="px-4 py-1 align-middle w-1/4">
                        <Button
                          variant="destructive"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold shadow-md hover:from-red-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition-all duration-150 text-xs xs:text-sm sm:text-base"
                          title="Delete or Deactivate"
                          onClick={() => showToast({ message: 'Delete/Deactivate not implemented', type: 'info' })}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                          Delete
                        </Button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={3} className="text-center text-xs xs:text-sm sm:text-base px-4 py-1">No order languages found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      {/* Create Order Language Dialog */}
      {dialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-auto">
            <h3 className="text-lg font-bold mb-4 text-blue-900">Create Order Language</h3>
            <form onSubmit={handleCreateOrderLanguage} className="flex flex-col gap-4">
              <label className="font-semibold text-blue-900 text-sm sm:text-base">Name
                <input
                  ref={nameRef}
                  type="text"
                  className="mt-1 w-full rounded-lg border border-blue-200 px-3 py-2 text-blue-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-150 shadow-sm"
                  placeholder="e.g. English"
                  required
                  disabled={creating}
                />
              </label>
              <label className="font-semibold text-blue-900 text-sm sm:text-base">Description
                <textarea
                  ref={descRef}
                  className="mt-1 w-full rounded-lg border border-blue-200 px-3 py-2 text-blue-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-150 shadow-sm min-h-[60px] resize-y"
                  placeholder="e.g. English language"
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
    </Card>
  );
};

export default OrderLanguages;
