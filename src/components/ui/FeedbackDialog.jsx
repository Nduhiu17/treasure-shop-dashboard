import React, { useState } from "react";
import { FaCommentDots, FaCheckCircle } from "react-icons/fa";
import { useToast } from "./toast";

export default function FeedbackDialog({ isOpen, onClose, onSubmit }) {
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(feedback);
      showToast({ type: "success", message: "Feedback sent successfully!" });
      setFeedback("");
      onClose();
    } catch (err) {
      showToast({ type: "error", message: "Failed to send feedback." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center min-h-screen bg-black bg-opacity-50 px-2 sm:px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 sm:p-8 relative flex flex-col animate-fade-in-up">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-yellow-700 flex items-center gap-2">
            <FaCommentDots className="text-yellow-500" /> Request Change
          </h2>
          <button
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <textarea
            className="w-full border border-yellow-300 rounded-lg p-3 text-base focus:outline-none focus:ring-2 focus:ring-yellow-400"
            rows={5}
            placeholder="Describe the changes you want..."
            value={feedback}
            onChange={e => setFeedback(e.target.value)}
            required
          />
          <button
            type="submit"
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-yellow-500 text-white font-bold shadow hover:bg-yellow-600 transition-all duration-150 disabled:opacity-60"
            disabled={loading}
          >
            <FaCheckCircle /> {loading ? "Sending..." : "Send Feedback"}
          </button>
        </form>
      </div>
    </div>
  );
}
