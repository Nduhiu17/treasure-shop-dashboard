import React, { useEffect, useState, useRef } from "react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { useAuth } from "../auth/AuthProvider";
import { Dialog } from "../../components/ui/dialog";
import { useToast } from "../../components/ui/toast";

const PAGE_SIZE = 10;
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const OrderTypesManagement = () => {
  const { api } = useAuth();
  const { showToast } = useToast();
  const [orderTypes, setOrderTypes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const nameRef = useRef();
  const descRef = useRef();
  const basePriceRef = useRef();

  useEffect(() => {
    setLoading(true);
    setError("");
    api.getOrderTypes(currentPage, PAGE_SIZE)
      .then((res) => {
        setOrderTypes(res.order_types || []);
        setTotal(res.total || 0);
      })
      .catch((err) => setError(err.message || "Failed to fetch order types"))
      .finally(() => setLoading(false));
  }, [api, currentPage]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const handlePrevPage = () => setCurrentPage((p) => Math.max(1, p - 1));
  const handleNextPage = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  const handleCreateOrderType = async (e) => {
    e.preventDefault();
    setCreating(true);
    const name = nameRef.current.value.trim();
    const description = descRef.current.value.trim();
    const basePrice = parseFloat(basePriceRef.current.value);
    if (!name) {
      showToast({ message: "Name is required", type: "error" });
      setCreating(false);
      return;
    }
    if (isNaN(basePrice) || basePrice <= 0) {
      showToast({ message: "Base price per page is required and must be a positive number", type: "error" });
      setCreating(false);
      return;
    }
    try {
      const jwt = localStorage.getItem("jwt_token");
      const res = await fetch(`${API_BASE_URL}/api/admin/order-types`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: jwt ? `Bearer ${jwt}` : "",
        },
        body: JSON.stringify({ name, description, base_price_per_page: basePrice }),
      });
      if (!res.ok) throw new Error("Failed to create order type");
      showToast({ message: "Order type created successfully", type: "success" });
      setDialogOpen(false);
      setCurrentPage(1);
      // Refresh list
      setLoading(true);
      api.getOrderTypes(1, PAGE_SIZE)
        .then((res) => {
          setOrderTypes(res.order_types || []);
          setTotal(res.total || 0);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    } catch (err) {
      showToast({ message: err.message || "Failed to create order type", type: "error" });
    } finally {
      setCreating(false);
    }
  };

  return (
    <Card className="m-1 xs:m-2 sm:m-4 p-1 xs:p-2 sm:p-6 shadow-lg border-0 w-full max-w-none">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
        <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-blue-900">Order Types Management</h2>
        <Button
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold shadow hover:from-blue-700 hover:to-cyan-600 transition-all duration-150"
          onClick={() => setDialogOpen(true)}
        >
          + Create Order Type
        </Button>
      </div>
      {loading ? (
        <div className="text-center py-8 text-blue-700">Loading order types...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-600">{error}</div>
      ) : (
        <div className="rounded-2xl border border-blue-100 bg-white/90 shadow-lg w-full min-h-[320px]" style={{ height: '60vh' }}>
          <div className="overflow-x-auto h-full">
            <table className="w-full min-w-[800px] text-xs xs:text-sm sm:text-base table-fixed">
              <thead className="sticky top-0 z-20 bg-gradient-to-r from-blue-50 via-blue-100 to-cyan-100/80 shadow-md border-b-2 border-blue-200">
                <tr>
                  <th className="px-4 py-3 w-1/5 text-left font-extrabold text-blue-900 text-xs xs:text-sm sm:text-base tracking-wide uppercase bg-opacity-90 backdrop-blur-md border-r border-blue-100 last:border-r-0 whitespace-nowrap shadow-sm" style={{ letterSpacing: '0.04em', background: 'rgba(255,255,255,0.85)' }}>Name</th>
                  <th className="px-4 py-3 w-2/5 text-left font-extrabold text-blue-900 text-xs xs:text-sm sm:text-base tracking-wide uppercase bg-opacity-90 backdrop-blur-md border-r border-blue-100 last:border-r-0 whitespace-nowrap shadow-sm" style={{ letterSpacing: '0.04em', background: 'rgba(236,245,255,0.85)' }}>Description</th>
                  <th className="px-4 py-3 w-1/5 text-left font-extrabold text-blue-900 text-xs xs:text-sm sm:text-base tracking-wide uppercase bg-opacity-90 backdrop-blur-md border-r border-blue-100 last:border-r-0 whitespace-nowrap shadow-sm" style={{ letterSpacing: '0.04em', background: 'rgba(255,255,255,0.85)' }}>Base Price/Page</th>
                  <th className="px-4 py-3 w-1/5 text-left font-extrabold text-blue-900 text-xs xs:text-sm sm:text-base tracking-wide uppercase bg-opacity-90 backdrop-blur-md border-r border-blue-100 last:border-r-0 whitespace-nowrap shadow-sm" style={{ letterSpacing: '0.04em', background: 'rgba(255,255,255,0.85)' }}>Actions</th>
                </tr>
              </thead>
            </table>
            <div className="overflow-y-auto" style={{ maxHeight: 'calc(60vh - 56px)' }}>
              <table className="w-full min-w-[800px] text-xs xs:text-sm sm:text-base table-fixed">
                <tbody>
                  {orderTypes.length > 0 ? orderTypes.map((type) => (
                    <tr key={type.id} className="hover:bg-blue-50 h-10">
                      <td className="max-w-[120px] truncate text-xs xs:text-sm sm:text-base px-4 py-1 align-middle w-1/5">{type.name}</td>
                      <td className="text-xs xs:text-sm sm:text-base px-4 py-1 align-middle w-2/5">{type.description}</td>
                      <td className="text-xs xs:text-sm sm:text-base px-4 py-1 align-middle w-1/5">{type.base_price_per_page?.toFixed(2)}</td>
                      <td className="px-4 py-1 align-middle w-1/5">
                        <Button
                          variant="destructive"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold shadow-md hover:from-red-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition-all duration-150 text-xs xs:text-sm sm:text-base"
                          title="Delete Order Type"
                          onClick={async () => {
                            if (!window.confirm(`Are you sure you want to delete order type '${type.name}'? This action cannot be undone.`)) return;
                            try {
                              const jwt = localStorage.getItem("jwt_token");
                              const res = await fetch(`${API_BASE_URL}/api/admin/order-types/${type.id}`, {
                                method: "DELETE",
                                headers: {
                                  "Content-Type": "application/json",
                                  Authorization: jwt ? `Bearer ${jwt}` : "",
                                },
                              });
                              if (!res.ok) throw new Error("Failed to delete order type");
                              showToast({ message: `Order type '${type.name}' deleted successfully`, type: "success" });
                              // Remove from UI
                              setOrderTypes(orderTypes => orderTypes.filter(ot => ot.id !== type.id));
                              setTotal(t => t - 1);
                            } catch (err) {
                              showToast({ message: err.message || "Failed to delete order type", type: "error" });
                            }
                          }}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                          Delete
                        </Button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="text-center text-xs xs:text-sm sm:text-base px-4 py-1">No order types found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      <Dialog isOpen={dialogOpen} onClose={() => setDialogOpen(false)} title="Create Order Type">
        <form onSubmit={handleCreateOrderType} className="flex flex-col gap-6 p-4 w-full max-w-lg mx-auto bg-white rounded-2xl shadow-xl border border-blue-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <label className="font-semibold text-blue-900 text-sm sm:text-base flex flex-col gap-1">
              Name
              <input
                ref={nameRef}
                type="text"
                className="rounded-lg border border-blue-200 px-3 py-2 text-blue-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-150 shadow-sm"
                placeholder="e.g. Science and Engineering"
                required
                disabled={creating}
              />
            </label>
            <label className="font-semibold text-blue-900 text-sm sm:text-base flex flex-col gap-1">
              Base Price Per Page ($)
              <input
                ref={basePriceRef}
                type="number"
                step="0.01"
                min="0.01"
                className="rounded-lg border border-blue-200 px-3 py-2 text-blue-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-150 shadow-sm"
                placeholder="e.g. 12.50"
                required
                disabled={creating}
              />
            </label>
          </div>
          <label className="font-semibold text-blue-900 text-sm sm:text-base flex flex-col gap-1">
            Description
            <textarea
              ref={descRef}
              className="rounded-lg border border-blue-200 px-3 py-2 text-blue-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-150 shadow-sm min-h-[80px] resize-y"
              placeholder="e.g. STEM projects"
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
      </Dialog>
    </Card>
  );
};

export default OrderTypesManagement;
