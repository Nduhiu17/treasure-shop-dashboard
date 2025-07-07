import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "../../components/ui/card";
import Loader from "../../components/ui/Loader";
import { Button } from "../../components/ui/button";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

export default function OrderDetailsDashboard() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE_URL}/api/orders/${orderId}/details`, {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => setOrder(data))
      .catch(() => setError("Failed to fetch order details."))
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) return <Loader />;
  if (error) return <div className="text-center text-red-600 py-8">{error}</div>;
  if (!order) return null;

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-2 xs:p-4 sm:p-8">
      <Card className="w-full max-w-3xl mx-auto p-4 xs:p-6 sm:p-10 rounded-2xl shadow-2xl border-0 bg-white/90 mt-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-blue-900">Order Details</h2>
          <Button onClick={() => navigate(-1)} className="bg-blue-100 text-blue-900 font-semibold px-4 py-2 rounded-lg border border-blue-200 hover:bg-blue-200">Back</Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <div className="font-bold text-blue-700">Title</div>
            <div className="text-blue-900 text-lg break-words">{order.title}</div>
          </div>
          <div>
            <div className="font-bold text-blue-700">Status</div>
            <div className="text-blue-900 text-lg">{order.status}</div>
          </div>
          <div className="sm:col-span-2">
            <div className="font-bold text-blue-700">Description</div>
            <div className="text-blue-900 whitespace-pre-line break-words">{order.description}</div>
          </div>
          <div>
            <div className="font-bold text-blue-700">Date Created</div>
            <div className="text-blue-900">{new Date(order.created_at).toLocaleString()}</div>
          </div>
          <div>
            <div className="font-bold text-blue-700">Order File</div>
            {order.original_order_file ? (
              <a href={order.original_order_file} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Open File</a>
            ) : (
              <span className="text-gray-400 italic">No file</span>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <div className="font-bold text-blue-700">Level</div>
            <div className="text-blue-900">{order.level_name}</div>
          </div>
          <div>
            <div className="font-bold text-blue-700">Pages</div>
            <div className="text-blue-900">{order.order_pages_name}</div>
          </div>
          <div>
            <div className="font-bold text-blue-700">Urgency</div>
            <div className="text-blue-900">{order.order_urgency_name}</div>
          </div>
          <div>
            <div className="font-bold text-blue-700">Style</div>
            <div className="text-blue-900">{order.order_style_name}</div>
          </div>
          <div>
            <div className="font-bold text-blue-700">Language</div>
            <div className="text-blue-900">{order.order_language_name}</div>
          </div>
          <div>
            <div className="font-bold text-blue-700">Writer</div>
            <div className="text-blue-900">{order.writer_name || order.writer_username || '-'}</div>
          </div>
          <div>
            <div className="font-bold text-blue-700">Writer Number</div>
            <div className="text-blue-900">{order.writer_number || '-'}</div>
          </div>
          <div>
            <div className="font-bold text-blue-700">Price</div>
            <div className="text-blue-900">${order.price?.toFixed(2)}</div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <div className="font-bold text-blue-700">Plagiarism Report</div>
            <div className="text-blue-900">{order.plagarism_report ? 'Yes' : 'No'}</div>
          </div>
          <div>
            <div className="font-bold text-blue-700">High Priority</div>
            <div className="text-blue-900">{order.is_high_priority ? 'Yes' : 'No'}</div>
          </div>
          <div>
            <div className="font-bold text-blue-700">One Page Summary</div>
            <div className="text-blue-900">{order.one_page_summary ? 'Yes' : 'No'}</div>
          </div>
          <div>
            <div className="font-bold text-blue-700">Extra Quality Check</div>
            <div className="text-blue-900">{order.extra_quality_check ? 'Yes' : 'No'}</div>
          </div>
          <div>
            <div className="font-bold text-blue-700">Initial Draft</div>
            <div className="text-blue-900">{order.initial_draft ? 'Yes' : 'No'}</div>
          </div>
          <div>
            <div className="font-bold text-blue-700">SMS Update</div>
            <div className="text-blue-900">{order.sms_update ? 'Yes' : 'No'}</div>
          </div>
          <div>
            <div className="font-bold text-blue-700">Full Text Copy Sources</div>
            <div className="text-blue-900">{order.full_text_copy_sources ? 'Yes' : 'No'}</div>
          </div>
          <div>
            <div className="font-bold text-blue-700">Top Writer</div>
            <div className="text-blue-900">{order.top_writer ? 'Yes' : 'No'}</div>
          </div>
        </div>
        <div className="mb-6">
          <div className="font-bold text-blue-700 mb-2">Writer Submissions</div>
          {order.writer_submissions && order.writer_submissions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-blue-100 rounded-xl">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="px-4 py-2 text-left font-bold text-blue-900">Submission Date</th>
                    <th className="px-4 py-2 text-left font-bold text-blue-900">Description</th>
                    <th className="px-4 py-2 text-left font-bold text-blue-900">File</th>
                  </tr>
                </thead>
                <tbody>
                  {order.writer_submissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-blue-100">
                      <td className="px-4 py-2">{new Date(sub.submission_date).toLocaleString()}</td>
                      <td className="px-4 py-2">{sub.description}</td>
                      <td className="px-4 py-2">
                        {sub.submission_file ? (
                          <a href={sub.submission_file} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Download</a>
                        ) : (
                          <span className="text-gray-400 italic">No file</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-gray-500 italic">No submissions yet.</div>
          )}
        </div>
      </Card>
    </div>
  );
}
