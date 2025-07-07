import React, { useState, useEffect } from "react";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export default function OrderDetailsPanel({ orderId, onClose }) {
  const [order, setOrder] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedbackOpen, setFeedbackOpen] = useState(null);
  const [feedback, setFeedback] = useState({ description: "", original_order_file: null });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!orderId) return;
    const fetchOrderDetails = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("jwt_token");
        const orderRes = await fetch(`${API_BASE_URL}/api/orders/${orderId}/details`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (!orderRes.ok) throw new Error("Failed to fetch order details");
        const orderData = await orderRes.json();
        setOrder(orderData.order || orderData);

        const submissionsRes = await fetch(`${API_BASE_URL}/api/orders/${orderId}/submissions`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (!submissionsRes.ok) throw new Error("Failed to fetch submissions");
        const submissionsData = await submissionsRes.json();
        setSubmissions(submissionsData.submissions || submissionsData || []);
      } catch (err) {
        setError(err.message || "Failed to load order");
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [orderId]);

  const handleFeedbackOpen = idx => {
    setFeedbackOpen(idx);
    setFeedback({ description: "", original_order_file: null });
  };
  const handleFeedbackClose = () => setFeedbackOpen(null);
  const handleFeedbackChange = e => setFeedback(f => ({ ...f, description: e.target.value }));
  const handleFileChange = e => setFeedback(f => ({ ...f, original_order_file: e.target.files[0] }));

  const handleAcceptOrder = async () => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem("jwt_token");
      const res = await fetch(`${API_BASE_URL}/api/orders/${order.id}/review/approve`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to approve order");
      setOrder(o => ({ ...o, status: "approved" }));
    } catch (err) {
      alert(err.message || "Failed to approve order");
    } finally {
      setActionLoading(false);
    }
  };

  const uploadFile = async (file) => {
    const token = localStorage.getItem("jwt_token");
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${API_BASE_URL}/api/upload`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}` },
      body: formData
    });
    if (!res.ok) throw new Error("File upload failed");
    const data = await res.json();
    return data.url || data.file_url || data.path || "";
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const token = localStorage.getItem("jwt_token");
      let feedback_file = "";
      if (feedback.original_order_file) {
        feedback_file = await uploadFile(feedback.original_order_file);
      }
      const payload = {
        feedback_file,
        feedback: feedback.description
      };
      const res = await fetch(`${API_BASE_URL}/api/orders/${order.id}/review/feedback`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Failed to submit feedback");
      setFeedbackOpen(null);
      alert("Feedback submitted!");
    } catch (err) {
      alert(err.message || "Failed to submit feedback");
    } finally {
      setActionLoading(false);
    }
  };

  if (!orderId) return null;
  if (loading) {
    return (
      <div className="min-h-[300px] flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl">
        <div className="text-xl text-fuchsia-700 font-bold">Loading order details...</div>
      </div>
    );
  }
  if (error || !order) {
    return (
      <div className="min-h-[300px] flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl">
        <div className="text-xl text-red-600 font-bold">{error || "Order not found."}</div>
      </div>
    );
  }

  return (
    <div className="bg-white/90 rounded-3xl shadow-2xl border-2 border-fuchsia-100 p-4 sm:p-8 flex flex-col gap-8 mt-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-extrabold text-fuchsia-700">Order Details</h2>
        <button onClick={onClose} className="px-3 py-1 rounded-lg bg-cyan-500 text-white font-bold hover:bg-cyan-600 transition-all">Close</button>
      </div>
      {/* ...copy the rest of the order details and submissions UI from OrderDetailsPage.jsx... */}
    </div>
  );
}
