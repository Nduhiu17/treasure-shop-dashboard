import React, { useState } from "react";
import { Button } from "./button";
import { useToast } from "./toast";
import { FaUpload, FaFileAlt, FaPaperPlane } from "react-icons/fa";

export default function OrderSubmitDialog({ isOpen, onClose, orderId, onSubmitted }) {
  const { showToast } = useToast();
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      showToast({ type: "error", message: "Please select a file to upload." });
      return;
    }
    setUploading(true);
    try {
      // 1. Upload file (simulate or replace with your actual upload logic)
      const formData = new FormData();
      formData.append("file", file);
      const jwt = localStorage.getItem("jwt_token");
      const uploadRes = await fetch("http://localhost:8080/api/upload", {
        method: "POST",
        headers: {
          Authorization: jwt ? `Bearer ${jwt}` : "",
        },
        body: formData,
        credentials: "include",
      });
      if (!uploadRes.ok) throw new Error("File upload failed");
      const { url } = await uploadRes.json();
      // 2. Submit order
      const submitRes = await fetch(`http://localhost:8080/api/writer/orders/${orderId}/submit`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: jwt ? `Bearer ${jwt}` : "",
        },
        body: JSON.stringify({
          active_submission_file: url,
          active_submission_writer_note: description,
        }),
        credentials: "include",
      });
      if (!submitRes.ok) throw new Error("Submission failed");
      showToast({ type: "success", message: "Order submitted successfully!" });
      setFile(null);
      setDescription("");
      onSubmitted?.();
      onClose();
    } catch (err) {
      showToast({ type: "error", message: err.message || "Submission failed" });
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center min-h-screen bg-black bg-opacity-50 px-2 sm:px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-4 sm:p-8 relative flex flex-col animate-fade-in-up">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-blue-900 flex items-center gap-2">
            <FaFileAlt className="text-blue-500" /> Submit Order
          </h2>
          <button
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-blue-900 font-semibold mb-2 text-sm sm:text-base flex items-center gap-2">
              <FaUpload className="text-blue-400" /> Upload File
            </label>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt,.zip,.rar,.xlsx,.csv,.ppt,.pptx,.jpg,.png,.jpeg,.gif,.svg,.mp4,.mp3,.wav,.avi,.mov,.mkv"
              className="block w-full border border-blue-200 rounded-lg px-3 py-2 text-blue-900 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-150 shadow-sm bg-white"
              onChange={handleFileChange}
              required
              disabled={uploading}
            />
          </div>
          <div>
            <label className="block text-blue-900 font-semibold mb-2 text-sm sm:text-base flex items-center gap-2">
              <FaPaperPlane className="text-blue-400" /> Description
            </label>
            <textarea
              className="block w-full border border-blue-200 rounded-lg px-3 py-2 text-blue-900 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-150 shadow-sm bg-white min-h-[80px] resize-vertical"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe your submission..."
              required
              disabled={uploading}
            />
          </div>
          <Button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white font-bold shadow hover:from-green-600 hover:to-green-700 transition-all duration-150 text-base sm:text-lg"
            disabled={uploading}
          >
            <FaUpload className="text-lg" />
            {uploading ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </div>
    </div>
  );
}
