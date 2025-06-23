import React, { useState } from "react";
import { Button } from "./button";
import { FaFileAlt, FaUser, FaRegClock } from "react-icons/fa";

export default function OrderSubmissionsDialog({ isOpen, onClose, writerSubmissions = [] }) {
  const [submissions] = useState(writerSubmissions || []);
  const [loading] = useState(false);
  const [error] = useState("");

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center min-h-screen bg-black bg-opacity-50 px-2 sm:px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-4 sm:p-8 relative flex flex-col animate-fade-in-up">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-blue-900 flex items-center gap-2">
            <FaFileAlt className="text-blue-500" /> Writer Submissions
          </h2>
          <button
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        {loading ? (
          <div className="text-center py-8 text-blue-700">Loading submissions...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-600">{error}</div>
        ) : !submissions || submissions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No submissions found for this order.</div>
        ) : (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {submissions.map((sub, idx) => (
              <div key={sub.id || idx} className="border border-blue-100 rounded-xl p-4 bg-gradient-to-br from-white via-blue-50 to-blue-100 shadow flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <span className="font-semibold text-blue-900 flex items-center gap-2"><FaUser className="text-blue-400" /> {sub.writer_name || sub.writer_id || "Writer"}</span>
                  <span className="text-xs text-blue-700 flex items-center gap-2"><FaRegClock className="text-blue-300" /> {new Date(sub.submission_date).toLocaleString()}</span>
                  <span className="text-sm text-blue-800 mt-1">{sub.description}</span>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <a
                    href={sub.submission_file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white font-bold shadow hover:from-green-600 hover:to-green-700 transition-all duration-150"
                  >
                    <FaFileAlt className="text-white" /> View File
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
