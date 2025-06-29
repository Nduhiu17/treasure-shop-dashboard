import React, { useState } from "react";
import { FaFileAlt, FaRegClock, FaCheckCircle, FaCommentDots, FaAward, FaCloudDownloadAlt, FaFilePdf, FaFileWord, FaFile } from "react-icons/fa";
import FeedbackDialog from "./FeedbackDialog";
import { useToast } from "./toast";
import { useAuth } from "../../features/auth/AuthProvider";
import { WideDialog } from "./wide-dialog";

// Helper for avatar
function getInitials(name) {
  if (!name) return "W";
  const parts = name.split(" ");
  return parts.length > 1 ? parts[0][0] + parts[1][0] : parts[0][0];
}

// Helper for file icon
function getFileIcon(fileUrl) {
  if (!fileUrl) return <FaFile className="text-gray-400 text-2xl" />;
  if (fileUrl.endsWith(".pdf")) return <FaFilePdf className="text-red-500 text-2xl" />;
  if (fileUrl.endsWith(".doc") || fileUrl.endsWith(".docx")) return <FaFileWord className="text-blue-600 text-2xl" />;
  return <FaFile className="text-green-500 text-2xl" />;
}

// Helper for status chip
function StatusChip({ status }) {
  let color = "bg-blue-100 text-blue-700";
  let label = status;
  if (status === "approved") {
    color = "bg-green-100 text-green-700";
    label = "Approved";
  } else if (status === "change_requested") {
    color = "bg-yellow-100 text-yellow-700";
    label = "Change Requested";
  } else if (status === "pending_review") {
    color = "bg-blue-100 text-blue-700";
    label = "Pending Review";
  }
  return <span className={`px-3 py-1 rounded-full text-xs font-bold ${color}`}>{label}</span>;
}

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export default function OrderSubmissionsDialog({ isOpen, onClose, writerSubmissions = [], onAction }) {
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [loadingId, setLoadingId] = useState(null);
  const { showToast } = useToast();
  const { user } = useAuth();
  const isWriter = user?.roles?.includes("writer");

  // Approve handler
  const handleApprove = async (sub) => {
    if (!sub.order_id) {
      showToast({ type: "error", message: "Order ID missing for this submission." });
      return;
    }
    setLoadingId(sub.id);
    try {
      const jwt = localStorage.getItem("jwt_token");
      const res = await fetch(`${API_BASE_URL}/api/orders/${sub.order_id}/review/approve`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: jwt ? `Bearer ${jwt}` : "",
        },
      });
      if (!res.ok) {
        const errText = await res.text();
        console.error("Approve error:", errText);
        throw new Error("Failed to approve submission");
      }
      showToast({ type: "success", message: "Submission approved successfully!" });
      onClose && onClose();
      onAction && onAction();
    } catch (err) {
      showToast({ type: "error", message: "Failed to approve submission." });
      console.error(err);
    } finally {
      setLoadingId(null);
    }
  };

  // Request change handler
  const handleRequestChange = (sub) => {
    setSelectedSubmission(sub);
    setFeedbackOpen(true);
  };

  // Feedback submit
  const handleFeedbackSubmit = async (feedback) => {
    if (!selectedSubmission || !selectedSubmission.order_id) {
      showToast({ type: "error", message: "Order ID missing for this submission." });
      return;
    }
    setLoadingId(selectedSubmission.id);
    try {
      const jwt = localStorage.getItem("jwt_token");
      const res = await fetch(`${API_BASE_URL}/api/orders/${selectedSubmission.order_id}/review/feedback`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: jwt ? `Bearer ${jwt}` : "",
        },
        body: JSON.stringify({ feedback }),
      });
      if (!res.ok) {
        const errText = await res.text();
        console.error("Feedback error:", errText);
        throw new Error("Failed to send feedback");
      }
      showToast({ type: "success", message: "Feedback sent successfully!" });
      setFeedbackOpen(false);
      setSelectedSubmission(null);
      onClose && onClose();
      onAction && onAction();
    } catch (err) {
      showToast({ type: "error", message: "Failed to send feedback." });
      console.error(err);
    } finally {
      setLoadingId(null);
    }
  };

  // Find latest submission
  const latestIdx = writerSubmissions.length > 0 ? writerSubmissions.reduce((maxIdx, sub, idx, arr) => {
    return new Date(sub.submission_date) > new Date(arr[maxIdx].submission_date) ? idx : maxIdx;
  }, 0) : -1;

  if (!isOpen) return null;
  return (
    <>
      <WideDialog isOpen={isOpen} onClose={onClose} title={
        <div className="flex flex-col items-center w-full">
          <div className="w-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-t-2xl flex flex-col items-center py-6 mb-6 animate-fade-in-up">
            <FaAward className="text-yellow-400 text-5xl mb-2 animate-bounce" />
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight drop-shadow-lg">Writer Submissions</h2>
            <span className="text-blue-100 text-lg mt-2">All submissions for your order are shown below</span>
          </div>
        </div>
      }>
        <div className="w-full flex flex-col gap-10 px-2 md:px-6">
          {(!writerSubmissions || writerSubmissions.length === 0) ? (
            <div className="text-center py-20 text-2xl text-gray-400 font-semibold flex flex-col items-center gap-4 animate-fade-in-up">
              <FaCloudDownloadAlt className="text-6xl text-blue-200 animate-pulse" />
              No submissions found for this order.
            </div>
          ) : (
            writerSubmissions.length === 1 ? (
              <div className="flex justify-center animate-fade-in-up">
                {/* Single submission card, same as grid card but centered */}
                {(() => {
                  const sub = writerSubmissions[0];
                  return (
                    <div className={`relative border-2 border-blue-200 rounded-2xl p-8 bg-gradient-to-br from-white via-blue-50 to-blue-100 shadow-xl flex flex-col gap-5 hover:shadow-2xl transition-all duration-200 animate-fade-in-up ring-2 ring-yellow-400`} style={{ minWidth: 340, minHeight: 320 }}>
                      <span className="absolute top-4 right-4 bg-yellow-400 text-white px-3 py-1 rounded-full text-xs font-bold shadow animate-bounce">Latest</span>
                      <div className="flex items-center gap-4 mb-2">
                        <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center text-2xl font-bold text-blue-700 shadow-lg">
                          {getInitials(sub.writer_name || sub.writer_id || "Writer")}
                        </div>
                        <span className="font-bold text-xl text-blue-900 tracking-wide drop-shadow">{sub.writer_name || sub.writer_id || "Writer"}</span>
                      </div>
                      <StatusChip status={sub.status || "pending_review"} />
                      <span className="text-xs text-blue-700 flex items-center gap-2"><FaRegClock className="text-blue-300" /> {new Date(sub.submission_date).toLocaleString()}</span>
                      <span className="text-base text-blue-800 mt-1 italic">{sub.description}</span>
                      <div className="flex items-center gap-3 mt-2">
                        {getFileIcon(sub.submission_file)}
                        <a
                          href={sub.submission_file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-bold shadow hover:from-green-600 hover:to-green-700 transition-all duration-150 text-lg"
                        >
                          <FaFileAlt className="text-white text-xl" /> View File
                        </a>
                      </div>
                      <div className="flex gap-3 mt-4">
                        <button
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-60 text-base shadow"
                          onClick={() => handleApprove(sub)}
                          disabled={isWriter || loadingId === sub.id}
                          aria-label="Approve Submission"
                        >
                          <FaCheckCircle /> {loadingId === sub.id ? "Approving..." : "Approve"}
                        </button>
                        <button
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-500 text-white font-semibold hover:bg-yellow-600 transition text-base shadow"
                          onClick={() => handleRequestChange(sub)}
                          disabled={isWriter}
                          aria-label="Request Change"
                        >
                          <FaCommentDots /> Request Change
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-fade-in-up">
                {writerSubmissions.map((sub, idx) => (
                  <div key={sub.id || idx} className={`relative border-2 border-blue-200 rounded-2xl p-8 bg-gradient-to-br from-white via-blue-50 to-blue-100 shadow-xl flex flex-col gap-5 hover:shadow-2xl transition-all duration-200 animate-fade-in-up ${idx === latestIdx ? 'ring-2 ring-yellow-400' : ''}`} style={{ minHeight: 320 }}>
                    {/* Badge for latest */}
                    {idx === latestIdx && (
                      <span className="absolute top-4 right-4 bg-yellow-400 text-white px-3 py-1 rounded-full text-xs font-bold shadow animate-bounce">Latest</span>
                    )}
                    <div className="flex items-center gap-4 mb-2">
                      <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center text-2xl font-bold text-blue-700 shadow-lg">
                        {getInitials(sub.writer_name || sub.writer_id || "Writer")}
                      </div>
                      <span className="font-bold text-xl text-blue-900 tracking-wide drop-shadow">{sub.writer_name || sub.writer_id || "Writer"}</span>
                    </div>
                    <StatusChip status={sub.status || "pending_review"} />
                    <span className="text-xs text-blue-700 flex items-center gap-2"><FaRegClock className="text-blue-300" /> {new Date(sub.submission_date).toLocaleString()}</span>
                    <span className="text-base text-blue-800 mt-1 italic">{sub.description}</span>
                    <div className="flex items-center gap-3 mt-2">
                      {getFileIcon(sub.submission_file)}
                      <a
                        href={sub.submission_file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-bold shadow hover:from-green-600 hover:to-green-700 transition-all duration-150 text-lg"
                      >
                        <FaFileAlt className="text-white text-xl" /> View File
                      </a>
                    </div>
                    <div className="flex gap-3 mt-4">
                      <button
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-60 text-base shadow"
                        onClick={() => handleApprove(sub)}
                        disabled={isWriter || loadingId === sub.id}
                        aria-label="Approve Submission"
                      >
                        <FaCheckCircle /> {loadingId === sub.id ? "Approving..." : "Approve"}
                      </button>
                      <button
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-500 text-white font-semibold hover:bg-yellow-600 transition text-base shadow"
                        onClick={() => handleRequestChange(sub)}
                        disabled={isWriter}
                        aria-label="Request Change"
                      >
                        <FaCommentDots /> Request Change
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </WideDialog>
      <FeedbackDialog
        isOpen={feedbackOpen}
        onClose={() => { setFeedbackOpen(false); setSelectedSubmission(null); }}
        onSubmit={handleFeedbackSubmit}
      />
    </>
  );
}
