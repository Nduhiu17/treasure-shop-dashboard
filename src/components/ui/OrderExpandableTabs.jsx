import React, { useEffect, useState } from "react";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function OrderExpandableTabs({ order }) {
  const [tab, setTab] = useState("submissions");
  const [submissions, setSubmissions] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem("jwt_token");
    fetch(`${API_BASE_URL}/api/orders/${order.id}/submissions`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setSubmissions(data.submissions || data || []))
      .finally(() => setLoading(false));
  }, [order.id]);

  useEffect(() => {
    if (tab !== "reviews") return;
    setReviewsLoading(true);
    const token = localStorage.getItem("jwt_token");
    fetch(`${API_BASE_URL}/api/orders/${order.id}/feedbacks`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setReviews(data.feedbacks || []))
      .finally(() => setReviewsLoading(false));
  }, [tab, order.id]);

  return (
    <div className="mt-2">
      {/* Order Details Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2 mb-2"><svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg><span className="font-semibold text-blue-900">Writer Username:</span><span className="text-blue-800">{order.writer_username || '-'}</span></div>
        <div className="flex items-center gap-2 mb-2"><svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" /></svg><span className="font-semibold text-blue-900">Pages:</span><span className="text-blue-800">{order.order_pages_name}</span></div>
        <div className="flex items-center gap-2 mb-2"><svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" /></svg><span className="font-semibold text-blue-900">Urgency:</span><span className="text-blue-800">{order.order_urgency_name}</span></div>
        <div className="flex items-center gap-2 mb-2"><svg className="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg><span className="font-semibold text-blue-900">Style:</span><span className="text-blue-800">{order.order_style_name}</span></div>
        <div className="flex items-center gap-2 mb-2"><svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /></svg><span className="font-semibold text-blue-900">Language:</span><span className="text-blue-800">{order.order_language_name}</span></div>
        <div className="flex items-center gap-2 mb-2"><svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg><span className="font-semibold text-blue-900">Priority:</span><span className="text-blue-800">{order.is_high_priority ? 'Yes' : 'No'}</span></div>
        <div className="flex items-center gap-2 mb-2"><svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a4 4 0 014-4h4a4 4 0 014 4v2M9 17H5a2 2 0 01-2-2v-5a2 2 0 012-2h4a2 2 0 012 2v5a2 2 0 01-2 2z" /></svg><span className="font-semibold text-blue-900">Plagiarism:</span><span className="text-blue-800">{order.plagarism_report ? 'Yes' : 'No'}</span></div>
        <div className="flex items-center gap-2 mb-2"><svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h8M12 8v8" /></svg><span className="font-semibold text-blue-900">Summary:</span><span className="text-blue-800">{order.one_page_summary ? 'Yes' : 'No'}</span></div>
        <div className="flex items-center gap-2 mb-2"><svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg><span className="font-semibold text-blue-900">Quality:</span><span className="text-blue-800">{order.extra_quality_check ? 'Yes' : 'No'}</span></div>
        <div className="flex items-center gap-2 mb-2"><svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" /></svg><span className="font-semibold text-blue-900">Draft:</span><span className="text-blue-800">{order.initial_draft ? 'Yes' : 'No'}</span></div>
        <div className="flex items-center gap-2 mb-2"><svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" /></svg><span className="font-semibold text-blue-900">SMS:</span><span className="text-blue-800">{order.sms_update ? 'Yes' : 'No'}</span></div>
        <div className="flex items-center gap-2 mb-2"><svg className="w-5 h-5 text-blue-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" /></svg><span className="font-semibold text-blue-900">Sources:</span><span className="text-blue-800">{order.full_text_copy_sources ? 'Yes' : 'No'}</span></div>
        <div className="flex items-center gap-2 mb-2"><svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /></svg><span className="font-semibold text-blue-900">Top Writer:</span><span className="text-blue-800">{order.top_writer ? 'Yes' : 'No'}</span></div>
        <div className="flex items-center gap-2 mb-2"><svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" /></svg><span className="font-semibold text-blue-900">Price:</span><span className="text-blue-800">${order.price?.toFixed(2)}</span></div>
      </div>
      {/* Tabs Section */}
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
              <div className="flex flex-col gap-4">
                {submissions.map((sub, idx) => (
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
                  </div>
                ))}
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

export default OrderExpandableTabs;
