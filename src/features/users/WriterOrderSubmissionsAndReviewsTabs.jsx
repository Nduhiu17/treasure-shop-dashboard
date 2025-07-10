
import React, { useState, useEffect } from "react";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export default function WriterOrderSubmissionsAndReviewsTabs({ orderId }) {
  const [tab, setTab] = useState("submissions");
  const [submissions, setSubmissions] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem("jwt_token");
    fetch(`${API_BASE_URL}/api/orders/${orderId}/submissions`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setSubmissions(data.submissions || data || []))
      .finally(() => setLoading(false));
  }, [orderId]);

  useEffect(() => {
    if (tab !== "reviews") return;
    setReviewsLoading(true);
    const token = localStorage.getItem("jwt_token");
    fetch(`${API_BASE_URL}/api/orders/${orderId}/feedbacks`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setReviews(data.feedbacks || []))
      .finally(() => setReviewsLoading(false));
  }, [tab, orderId]);

  return (
    <div className="mt-2">
      <div className="flex gap-2 border-b border-fuchsia-100 mb-2">
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
      <div className="mt-2">
        {tab === "submissions" && (
          <section>
            <h3 className="text-lg font-bold text-fuchsia-700 mb-2 mt-2">Writer Submissions</h3>
            {loading ? (
              <div className="text-slate-500 text-sm">Loading submissions...</div>
            ) : submissions && submissions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-cyan-200">
                  <thead className="bg-gradient-to-r from-fuchsia-50 to-cyan-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-bold text-fuchsia-700">Order Number</th>
                      <th className="px-4 py-2 text-left text-xs font-bold text-fuchsia-700">Description</th>
                      <th className="px-4 py-2 text-left text-xs font-bold text-fuchsia-700">File</th>
                      <th className="px-4 py-2 text-left text-xs font-bold text-fuchsia-700">Submitted At</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-cyan-100">
                    {submissions.map((sub, idx) => (
                      <tr key={idx}>
                        <td className="px-4 py-2 text-sm text-slate-700 font-mono">{sub.order_number || idx + 1}</td>
                        <td className="px-4 py-2 text-sm text-slate-700">{sub.description}</td>
                        <td className="px-4 py-2 text-sm">
                          {sub.submission_file ? (
                            <a
                              href={sub.submission_file}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1 rounded-lg bg-fuchsia-500 text-white font-bold text-xs hover:bg-fuchsia-600 transition-all flex items-center gap-1"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 4v12" /></svg>
                              Download
                            </a>
                          ) : (
                            <span className="text-xs text-slate-400">No file</span>
                          )}
                        </td>
                        <td className="px-4 py-2 text-xs text-slate-400">{new Date(sub.submission_date).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
                            className="px-3 py-1 rounded-lg bg-fuchsia-500 text-white font-bold text-xs hover:bg-fuchsia-600 transition-all flex items-center gap-1"
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

