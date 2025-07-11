import React, { useState } from "react";
import { useToast } from "./ui/toast";

/**
 * ExpandableText
 * @param {string} text - The text to display
 * @param {number} maxLength - The max length before truncation (default: 100)
 * @param {string} [className] - Optional className for styling
 */

// Exported as named export only
export function ExpandableText({ text = "", maxLength = 100, className = "" }) {
  const [expanded, setExpanded] = useState(false);
  if (!text) return null;
  const isLong = text.length > maxLength;
  const displayText = !expanded && isLong ? text.slice(0, maxLength) + "..." : text;
  return (
    <span className={className}>
      {displayText}
      {isLong && (
        <button
          type="button"
          className="ml-2 text-xs text-fuchsia-700 underline hover:text-fuchsia-900 focus:outline-none"
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      )}
    </span>
  );


}


const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Default export for the main panel
export default function OrderDetailsPanel({ order, submissions = [], reviews = [], submissionsLoading = false, reviewsLoading = false, onClose }) {
  const { showToast } = useToast();
  const [localOrder, setLocalOrder] = useState(order);
  const [feedbackOpen, setFeedbackOpen] = useState(null);
  const [feedback, setFeedback] = useState({ description: "", original_order_file: null });
  const [actionLoading, setActionLoading] = useState(false);
  const [tab, setTab] = useState("submissions");

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
      const res = await fetch(`${API_BASE_URL}/api/orders/${localOrder.id}/review/approve`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to approve order");
      setLocalOrder(o => ({ ...o, status: "approved" }));
    } catch (err) {
      showToast({ type: "error", message: err.message || "Failed to approve order" });
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
      const res = await fetch(`${API_BASE_URL}/api/orders/${localOrder.id}/review/feedback`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Failed to submit feedback");
      setFeedbackOpen(null);
      showToast({ type: "success", message: "Feedback submitted!" });
    } catch (err) {
      showToast({ type: "error", message: err.message || "Failed to submit feedback" });
    } finally {
      setActionLoading(false);
    }
  };

  if (!localOrder) return null;

  return (
    <div className="bg-white/90 rounded-3xl shadow-2xl border-2 border-fuchsia-100 p-4 sm:p-8 flex flex-col gap-8 mt-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-extrabold text-fuchsia-700">Order Details</h2>
        <button onClick={onClose} className="px-3 py-1 rounded-lg bg-cyan-500 text-white font-bold hover:bg-cyan-600 transition-all">Close</button>
      </div>
      {/* Order Info Section */}
      <section className="flex flex-col gap-6 text-sm">
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Main Details Card */}
          <div className="col-span-2 bg-gradient-to-br from-blue-50 to-fuchsia-50 rounded-2xl border border-fuchsia-100 shadow-lg p-4 flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="font-bold text-slate-700">Order Number:</span>
              <span className="font-mono text-xs text-slate-500 bg-slate-100 rounded px-2 py-1">{localOrder.order_number}</span>
              <span className="font-bold text-slate-700 ml-4">Status:</span>
              <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${localOrder.status === "completed" ? "bg-green-100 text-green-700" : localOrder.status === "pending_payment" ? "bg-yellow-100 text-yellow-700" : localOrder.status === "submitted_for_review" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-700"}`}>{localOrder.status.replace(/_/g, " ")}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-bold text-slate-700">Title:</span>
              <span className="mb-2 text-lg font-semibold text-fuchsia-700 block" style={{ wordBreak: 'break-word', whiteSpace: 'normal', maxWidth: '16rem' }}>
                <ExpandableText text={localOrder.title} maxLength={32} />
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-bold text-slate-700">Description:</span>
              <span className="mb-2 text-slate-700 text-base block" style={{ wordBreak: 'break-word', whiteSpace: 'normal', maxWidth: '24rem' }}>
                <ExpandableText text={localOrder.description} maxLength={64} />
              </span>
            </div>
            <div className="flex flex-wrap gap-4 mt-2">
              <div>
                <span className="font-bold text-slate-700">Created:</span>
                <span className="ml-1 text-xs text-slate-500">{new Date(localOrder.created_at).toLocaleString()}</span>
              </div>
              <div>
                <span className="font-bold text-slate-700">Updated:</span>
                <span className="ml-1 text-xs text-slate-500">{new Date(localOrder.updated_at).toLocaleString()}</span>
              </div>
            </div>
          </div>
          {/* Quick Info Card */}
          <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl border border-cyan-100 shadow-lg p-4 flex flex-col gap-2">
            <div className="flex flex-wrap gap-x-4 gap-y-2 items-center justify-between w-full">
              <div className="flex items-center gap-1 min-w-[90px]">
                <span className="font-bold text-slate-700">Level:</span>
                <span className="text-slate-700">{localOrder.level_name}</span>
              </div>
              <div className="flex items-center gap-1 min-w-[90px]">
                <span className="font-bold text-slate-700">Style:</span>
                <span className="text-slate-700">{localOrder.order_style_name}</span>
              </div>
              <div className="flex items-center gap-1 min-w-[90px]">
                <span className="font-bold text-slate-700">Language:</span>
                <span className="text-slate-700">{localOrder.order_language_name}</span>
              </div>
              <div className="flex items-center gap-1 min-w-[90px]">
                <span className="font-bold text-slate-700">Pages:</span>
                <span className="text-slate-700">{localOrder.order_pages_name}</span>
              </div>
              <div className="flex items-center gap-1 min-w-[90px]">
                <span className="font-bold text-slate-700">Urgency:</span>
                <span className="text-slate-700">{localOrder.order_urgency_name}</span>
              </div>
              <div className="flex items-center gap-1 min-w-[90px]">
                <span className="font-bold text-slate-700">Sources:</span>
                <span className="text-slate-700">{localOrder.no_of_sources}</span>
              </div>
              <div className="flex items-center gap-1 min-w-[90px]">
                <span className="font-bold text-slate-700">Price:</span>
                <span className="text-blue-700 font-bold">${localOrder.price?.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
        {/* Feature Chips Row */}
        <div className="flex flex-wrap gap-2 justify-center md:justify-start mt-2">
          <div className="bg-gradient-to-br from-fuchsia-50 to-cyan-50 rounded-xl p-2 text-xs text-center border border-fuchsia-100 min-w-[120px]">
            <span className="font-bold">Top Writer:</span> {localOrder.top_writer ? "Yes" : "No"}
          </div>
          <div className="bg-gradient-to-br from-cyan-50 to-yellow-50 rounded-xl p-2 text-xs text-center border border-cyan-100 min-w-[120px]">
            <span className="font-bold">Plagiarism Report:</span> {localOrder.plagarism_report ? "Yes" : "No"}
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-fuchsia-50 rounded-xl p-2 text-xs text-center border border-yellow-100 min-w-[120px]">
            <span className="font-bold">SMS Update:</span> {localOrder.sms_update ? "Yes" : "No"}
          </div>
          <div className="bg-gradient-to-br from-fuchsia-50 to-blue-50 rounded-xl p-2 text-xs text-center border border-blue-100 min-w-[120px]">
            <span className="font-bold">One Page Summary:</span> {localOrder.one_page_summary ? "Yes" : "No"}
          </div>
        </div>
      </section>

      {/* Tabs for Submissions and Reviews */}
      <div className="flex gap-2 mt-8 border-b border-fuchsia-100">
        <button
          className={`px-4 py-2 font-bold rounded-t-lg transition-all ${tab === "submissions" ? "bg-fuchsia-100 text-fuchsia-700 border-x border-t border-fuchsia-200 -mb-px" : "bg-transparent text-slate-500 hover:text-fuchsia-700"}`}
          onClick={() => setTab("submissions")}
        >
          Submissions
        </button>
        <button
          className={`px-4 py-2 font-bold rounded-t-lg transition-all ${tab === "reviews" ? "bg-fuchsia-100 text-fuchsia-700 border-x border-t border-fuchsia-200 -mb-px" : "bg-transparent text-slate-500 hover:text-fuchsia-700"}`}
          onClick={() => setTab("reviews")}
        >
          Order Reviews
        </button>
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {tab === "submissions" && (
          <section>
            <h3 className="text-lg font-bold text-fuchsia-700 mb-2 mt-2">Writer Submissions</h3>
            {submissionsLoading ? (
              <div className="text-slate-500 text-sm">Loading submissions...</div>
            ) : submissions && submissions.length > 0 ? (
              <div className="flex flex-col gap-4">
                {submissions.map((sub, idx) => {
                  const isLatest = idx === 0;
                  return (
                    <div key={idx} className="rounded-xl border border-cyan-100 bg-cyan-50/40 p-4 flex flex-col gap-2 shadow">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-between">
                        <div className="font-semibold text-slate-700">{sub.description}</div>
                        <div className="flex items-center gap-2 flex-wrap">
                          {sub.submission_file && (
                            <a
                              href={sub.submission_file}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1 rounded-lg bg-fuchsia-500 text-white font-bold text-xs hover:bg-fuchsia-600 transition-all flex items-center gap-1"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 4v12" /></svg>
                              Download
                            </a>
                          )}
                          <span className="text-xs text-slate-400">{new Date(sub.submission_date).toLocaleString()}</span>
                        </div>
                      </div>
                      {localOrder.status === "submitted_for_review" && isLatest && (
                        <div className="flex flex-col sm:flex-row gap-2 mt-2">
                          <button
                            className="px-4 py-1 rounded-lg bg-green-500 text-white font-bold hover:bg-green-600 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                            onClick={handleAcceptOrder}
                            disabled={actionLoading || localOrder.status === "approved"}
                          >
                            {actionLoading ? "Processing..." : localOrder.status === "approved" ? "Approved" : "Accept Submission"}
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
                              <button type="submit" className="px-4 py-1 rounded-lg bg-fuchsia-500 text-white font-bold hover:bg-fuchsia-600 transition-all disabled:opacity-60 disabled:cursor-not-allowed" disabled={actionLoading}>{actionLoading ? "Submitting..." : "Submit"}</button>
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
        )}
        {tab === "reviews" && (
          <section>
            <h3 className="text-lg font-bold text-fuchsia-700 mb-2 mt-2">Order Reviews</h3>
            {reviewsLoading ? (
              <div className="text-slate-500 text-sm">Loading reviews...</div>
            ) : reviews && reviews.length > 0 ? (
              <div className="flex flex-col gap-4">
                {reviews.map((review) => (
                  <div key={review.id} className="rounded-xl border border-fuchsia-100 bg-fuchsia-50/40 p-4 flex flex-col gap-2 shadow">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-between">
                      <div className="font-semibold text-slate-700">{review.feedback}</div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {review.feedback_file && (
                          <a
                            href={review.feedback_file}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 rounded-lg bg-cyan-500 text-white font-bold text-xs hover:bg-cyan-600 transition-all flex items-center gap-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 4v12" /></svg>
                            Download
                          </a>
                        )}
                        <span className="text-xs text-slate-400">{new Date(review.created_at).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-slate-500 text-sm">No reviews yet.</div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
