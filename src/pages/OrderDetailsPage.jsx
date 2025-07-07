import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LandingNavbar from "../components/LandingNavbar";
import LandingFooter from "../components/LandingFooter";
import PayWithPayPal from "../features/orders/PayWithPayPal";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;



function OrderDetailsPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedbackOpen, setFeedbackOpen] = useState(null); // index of submission for feedback
  const [feedback, setFeedback] = useState({ description: "", original_order_file: null });
  const [showPayPal, setShowPayPal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
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
  const handleFeedbackSubmit = e => {
    e.preventDefault();
    // TODO: Implement feedback submission to backend
    setFeedbackOpen(null);
    alert("Feedback submitted!");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="text-xl text-fuchsia-700 font-bold">Loading order details...</div>
      </div>
    );
  }
  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="text-xl text-red-600 font-bold">{error || "Order not found."}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-blue-100">
      <LandingNavbar />
      <main className="flex-1 w-full max-w-2xl mx-auto px-2 sm:px-4 py-6 sm:py-10 animate-fade-in">
        <div className="bg-white/90 rounded-3xl shadow-2xl border-2 border-fuchsia-100 p-4 sm:p-8 flex flex-col gap-8">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => navigate('/profile')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 text-white font-bold shadow hover:bg-cyan-600 transition-all text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
              Go Back
            </button>
            <h2 className="text-2xl font-extrabold text-fuchsia-700">Order Details</h2>
            <div className="w-20" />
          </div>
          {/* Pay Now Button for pending_payment */}
          {order.status === "pending_payment" && (
            <div className="flex justify-center my-4">
              <button
                className="animate-bounce px-8 py-3 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-cyan-500 text-white text-lg font-extrabold shadow-lg border-4 border-fuchsia-200 hover:from-fuchsia-600 hover:to-cyan-600 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-fuchsia-200"
                onClick={() => setShowPayPal(true)}
              >
                💳 Pay Now
              </button>
              {showPayPal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                  <div className="bg-white rounded-2xl shadow-2xl border-2 border-fuchsia-100 p-6 w-[95vw] max-w-md flex flex-col gap-4 animate-fade-in">
                    <PayWithPayPal
                      orderId={order.id}
                      amount={order.price}
                      onSuccess={() => {
                        setShowPayPal(false);
                        navigate(`/order/${order.id}`);
                      }}
                      onCancel={() => setShowPayPal(false)}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
          {/* Order Info Section */}
          <section className="flex flex-col gap-4 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <span className="font-bold text-slate-700">Order ID:</span>
                <span className="font-mono text-xs text-slate-500 mb-2">{order.id}</span>
                <span className="font-bold text-slate-700">Title:</span>
                <span className="mb-2">{order.title}</span>
                <span className="font-bold text-slate-700">Status:</span>
                <span className="mb-2 capitalize">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${order.status === "completed" ? "bg-green-100 text-green-700" : order.status === "pending_payment" ? "bg-yellow-100 text-yellow-700" : order.status === "submitted_for_review" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-700"}`}>{order.status.replace(/_/g, " ")}</span>
                </span>
                <span className="font-bold text-slate-700">Created At:</span>
                <span className="mb-2">{new Date(order.created_at).toLocaleString()}</span>
                <span className="font-bold text-slate-700">Last Updated:</span>
                <span className="mb-2">{new Date(order.updated_at).toLocaleString()}</span>
                <span className="font-bold text-slate-700">Description:</span>
                <span className="mb-2">{order.description}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-bold text-slate-700">Level:</span>
                <span className="mb-2">{order.level_name}</span>
                <span className="font-bold text-slate-700">Style:</span>
                <span className="mb-2">{order.order_style_name}</span>
                <span className="font-bold text-slate-700">Language:</span>
                <span className="mb-2">{order.order_language_name}</span>
                <span className="font-bold text-slate-700">Pages:</span>
                <span className="mb-2">{order.order_pages_name}</span>
                <span className="font-bold text-slate-700">Urgency:</span>
                <span className="mb-2">{order.order_urgency_name}</span>
                <span className="font-bold text-slate-700">Sources:</span>
                <span className="mb-2">{order.no_of_sources}</span>
                <span className="font-bold text-slate-700">Price:</span>
                <span className="mb-2 text-blue-700 font-bold">${order.price?.toFixed(2)}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
              <div className="bg-gradient-to-br from-fuchsia-50 to-cyan-50 rounded-xl p-2 text-xs text-center border border-fuchsia-100">
                <span className="font-bold">Top Writer:</span> {order.top_writer ? "Yes" : "No"}
              </div>
              <div className="bg-gradient-to-br from-cyan-50 to-yellow-50 rounded-xl p-2 text-xs text-center border border-cyan-100">
                <span className="font-bold">Plagiarism Report:</span> {order.plagarism_report ? "Yes" : "No"}
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-fuchsia-50 rounded-xl p-2 text-xs text-center border border-yellow-100">
                <span className="font-bold">SMS Update:</span> {order.sms_update ? "Yes" : "No"}
              </div>
              <div className="bg-gradient-to-br from-fuchsia-50 to-blue-50 rounded-xl p-2 text-xs text-center border border-blue-100">
                <span className="font-bold">One Page Summary:</span> {order.one_page_summary ? "Yes" : "No"}
              </div>
            </div>
          </section>

          {/* Writer Submissions */}
          <section>
            <h3 className="text-lg font-bold text-fuchsia-700 mb-2 mt-6">Writer Submissions</h3>
            {submissions && submissions.length > 0 ? (
              <div className="flex flex-col gap-4">
                {submissions.map((sub, idx) => {
                  // Backend returns submissions sorted by date descending, so first item is latest
                  const isLatest = idx === 0;
                  return (
                    <div key={idx} className="rounded-xl border border-cyan-100 bg-cyan-50/40 p-4 flex flex-col gap-2 shadow">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-between">
                        <div className="font-semibold text-slate-700">{sub.description}</div>
                        <div className="flex items-center gap-2 flex-wrap">
                          {sub.file && sub.file.url && (
                            <a href={sub.file.url} download className="px-3 py-1 rounded-lg bg-fuchsia-500 text-white font-bold text-xs hover:bg-fuchsia-600 transition-all flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 4v12" /></svg>
                              Download {sub.file.name}
                            </a>
                          )}
                          <span className="text-xs text-slate-400">{new Date(sub.submitted_at).toLocaleString()}</span>
                        </div>
                      </div>
                      {order.status === "submitted_for_review" && isLatest && (
                        <div className="flex flex-col sm:flex-row gap-2 mt-2">
                          <button
                            className="px-4 py-1 rounded-lg bg-green-500 text-white font-bold hover:bg-green-600 transition-all"
                            onClick={() => alert('Submission accepted! (demo)')}
                          >
                            Accept Submission
                          </button>
                          <button
                            className="px-4 py-1 rounded-lg bg-yellow-400 text-white font-bold hover:bg-yellow-500 transition-all"
                            onClick={() => handleFeedbackOpen(idx)}
                          >
                            Request Feedback
                          </button>
                        </div>
                      )}
                      {/* Feedback Modal */}
                      {feedbackOpen === idx && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                          <form
                            className="bg-white rounded-2xl shadow-2xl border-2 border-fuchsia-100 p-6 w-[95vw] max-w-md flex flex-col gap-4 animate-fade-in"
                            onSubmit={handleFeedbackSubmit}
                          >
                            <h4 className="text-lg font-bold text-fuchsia-700">Request Feedback</h4>
                            <label className="text-xs font-semibold text-slate-500">Description</label>
                            <textarea
                              className="input min-h-[80px]"
                              value={feedback.description}
                              onChange={handleFeedbackChange}
                              placeholder="Describe your feedback request..."
                              required
                            />
                            <label className="text-xs font-semibold text-slate-500">Attach File (optional)</label>
                            <input
                              type="file"
                              className="input"
                              onChange={handleFileChange}
                            />
                            <div className="flex gap-2 mt-2">
                              <button type="submit" className="px-4 py-1 rounded-lg bg-fuchsia-500 text-white font-bold hover:bg-fuchsia-600 transition-all">Submit</button>
                              <button type="button" className="px-4 py-1 rounded-lg bg-slate-100 text-slate-700 font-bold border border-slate-200 hover:bg-slate-200 transition-all" onClick={handleFeedbackClose}>Cancel</button>
                            </div>
                          </form>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-slate-500 text-sm">No submissions yet.</div>
            )}
          </section>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
export default OrderDetailsPage;
