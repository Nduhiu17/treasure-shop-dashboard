import React, { useEffect, useState, useRef } from "react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { useAuth } from "../auth/AuthProvider";
import { Dialog } from "../../components/ui/dialog";
import { useToast } from "../../components/ui/toast";

const PAGE_SIZE = 10;

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
    if (!name) {
      showToast({ message: "Name is required", type: "error" });
      setCreating(false);
      return;
    }
    try {
      const jwt = localStorage.getItem("jwt_token");
      const res = await fetch("http://localhost:8080/api/admin/order-types", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: jwt ? `Bearer ${jwt}` : "",
        },
        body: JSON.stringify({ name, description }),
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
        <>
          <div className="rounded-2xl border border-blue-100 bg-white/90 shadow-lg w-full min-h-[320px]" style={{ height: '60vh' }}>
            <div className="overflow-x-auto h-full">
              <table className="w-full min-w-[1200px] text-xs xs:text-sm sm:text-base h-full">
                <thead className="sticky top-0 z-20 bg-gradient-to-r from-blue-50 via-blue-100 to-cyan-100/80 shadow-md border-b-2 border-blue-200">
                  <tr>
                    <th className="px-4 py-3 text-left font-extrabold text-blue-900 text-xs xs:text-sm sm:text-base tracking-wide uppercase bg-opacity-90 backdrop-blur-md border-r border-blue-100 last:border-r-0 whitespace-nowrap shadow-sm" style={{ letterSpacing: '0.04em', background: 'rgba(255,255,255,0.85)' }}>Name</th>
                    <th className="px-4 py-3 text-left font-extrabold text-blue-900 text-xs xs:text-sm sm:text-base tracking-wide uppercase bg-opacity-90 backdrop-blur-md border-r border-blue-100 last:border-r-0 whitespace-nowrap shadow-sm" style={{ letterSpacing: '0.04em', background: 'rgba(236,245,255,0.85)' }}>Description</th>
                    <th className="px-4 py-3 text-left font-extrabold text-blue-900 text-xs xs:text-sm sm:text-base tracking-wide uppercase bg-opacity-90 backdrop-blur-md border-r border-blue-100 last:border-r-0 whitespace-nowrap shadow-sm" style={{ letterSpacing: '0.04em', background: 'rgba(255,255,255,0.85)' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orderTypes.length > 0 ? orderTypes.map((type) => (
                    <tr key={type.id} className="hover:bg-blue-50">
                      <td className="max-w-[120px] truncate text-xs xs:text-sm sm:text-base px-4 py-2">{type.name}</td>
                      <td className="text-xs xs:text-sm sm:text-base px-4 py-2">{type.description}</td>
                      <td className="px-4 py-2">
                        <Button variant="destructive" disabled className="w-full sm:w-auto text-xs xs:text-sm sm:text-base">
                          Delete
                        </Button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={3} className="text-center text-xs xs:text-sm sm:text-base">No order types found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
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
                  className={`rounded-full px-3 py-1 text-xs xs:text-sm sm:text-base font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400 ${currentPage === i + 1 ? 'bg-blue-600 text-white shadow-md' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
                  aria-label={`Page ${i + 1}`}
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
      <Dialog isOpen={dialogOpen} onClose={() => setDialogOpen(false)} title="Create Order Type">
        <form onSubmit={handleCreateOrderType} className="flex flex-col gap-4 p-2 sm:p-4 w-full max-w-md mx-auto">
          <label className="font-semibold text-blue-900 text-sm sm:text-base">Name
            <input
              ref={nameRef}
              type="text"
              className="mt-1 w-full rounded-lg border border-blue-200 px-3 py-2 text-blue-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-150 shadow-sm"
              placeholder="e.g. Science and Engineering"
              required
              disabled={creating}
            />
          </label>
          <label className="font-semibold text-blue-900 text-sm sm:text-base">Description
            <textarea
              ref={descRef}
              className="mt-1 w-full rounded-lg border border-blue-200 px-3 py-2 text-blue-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-150 shadow-sm min-h-[80px] resize-y"
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
