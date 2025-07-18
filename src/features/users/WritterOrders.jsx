import React, { useEffect, useState } from "react";
import { ExpandableText } from "../../components/OrderDetailsPanel.jsx";
import { Card } from "../../components/ui/card";
import Loader from "../../components/ui/Loader";
import { useAuth } from "../auth/AuthProvider";
import { Button } from "../../components/ui/button";
import { Select } from "../../components/ui/select";
import { WideDialog } from "../../components/ui/wide-dialog";
// import PayPalModal from "../orders/PayPalModal"; // Removed: PayPal flow deprecated
import AssignmentResponseButtons from "../../components/ui/AssignmentResponseButtons";
import { useToast } from "../../components/ui/toast";
import OrderSubmitDialog from "../../components/ui/OrderSubmitDialog";
import OrderSubmissionsDialog from "../../components/ui/OrderSubmissionsDialog";
import { useNavigate } from "react-router-dom";
import WriterOrderSubmissionsAndReviewsTabs from "./WriterOrderSubmissionsAndReviewsTabs";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const ORDER_STATUSES = [
  { key: "", label: "All" },
  { key: "pending_payment", label: "Pending Payment" },
  { key: "paid", label: "Paid" },
  { key: "awaiting_assignment", label: "Awaiting Assignment" },
  { key: "assigned", label: "Assigned" },
  { key: "in_progress", label: "In Progress" },
  { key: "submitted_for_review", label: "Submitted for Review" },
  { key: "approved", label: "Approved" },
  { key: "feedback", label: "Feedback" },
];

const WriterOrders = ({ writerId: propWriterId }) => {
	const { user } = useAuth();
	const { showToast } = useToast();
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [total, setTotal] = useState(0);
	const [activeStatus, setActiveStatus] = useState("");
	const [payPalOrderId, setPayPalOrderId] = useState(null);
	const [payPalAmount, setPayPalAmount] = useState(null);
	const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
	const [submitOrderId, setSubmitOrderId] = useState(null);
	const [submissionsDialogOpen, setSubmissionsDialogOpen] = useState(false);
	const [submissionsOrderId, setSubmissionsOrderId] = useState(null);
	const [expandedRow, setExpandedRow] = useState(null);
	const PAGE_SIZE = 6;
	const navigate = useNavigate();

	useEffect(() => {
		if (!user) return;
		setLoading(true);
		setError("");
		const jwt = localStorage.getItem("jwt_token");
		const roles = user.roles || [];
		let url = `${API_BASE_URL}/api/admin/orders?page=${currentPage}&page_size=${PAGE_SIZE}`;
		if (roles.includes("super_admin") || roles.includes("admin")) {
			if (activeStatus) {
				url += `&status=${activeStatus}`;
			}
		} else if (roles.includes("writer")) {
			// Use propWriterId if provided, else fallback to user.id
			const writerId = propWriterId || user.id;
			url = `${API_BASE_URL}/api/writer/orders/${writerId}?page=${currentPage}&page_size=${PAGE_SIZE}`;
			if (activeStatus) {
				url += `&status=${activeStatus}`;
			}
		} else if (roles.length === 1 && roles[0] === "user") {
			url = `${API_BASE_URL}/api/orders/me?page=${currentPage}&page_size=${PAGE_SIZE}`;
			if (activeStatus) {
				url += `&status=${activeStatus}`;
			}
		}
		fetch(url, {
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
				Authorization: jwt ? `Bearer ${jwt}` : "",
			},
		})
			.then((res) => res.json())
			.then((data) => {
				if (Array.isArray(data)) {
					setOrders(data);
					setTotal(data.length);
				} else {
					setOrders(data.orders || []);
					setTotal(data.total || (data.orders ? data.orders.length : 0));
				}
				setLoading(false);
			})
			.catch((err) => {
				setError("Failed to fetch orders");
				setLoading(false);
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user && user.id, user && JSON.stringify(user.roles), currentPage, activeStatus, propWriterId]);

	const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
	const handlePrevPage = () => setCurrentPage((p) => Math.max(1, p - 1));
	const handleNextPage = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

	const handleAssignmentResponse = async (orderId, accept) => {
		const jwt = localStorage.getItem("jwt_token");
		try {
			const res = await fetch(`${API_BASE_URL}/api/writer/orders/${orderId}/assignment-response`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: jwt ? `Bearer ${jwt}` : "",
				},
				body: JSON.stringify({ accept }),
				credentials: "include",
			});
			if (!res.ok) throw new Error("Failed to submit response");
			setOrders((prev) => prev.map(o => o.id === orderId ? { ...o, status: accept ? "assigned" : "awaiting_assignment_rejected" } : o));
			showToast({ type: "success", message: accept ? "Assignment accepted!" : "Assignment rejected!" });
		} catch (err) {
			showToast({ type: "error", message: "Failed to submit response" });
		}
	};

	if (!user) {
		return (
			<div className="flex justify-center items-center min-h-[40vh]">
				<Loader />
			</div>
		);
	}

	return (
		<Card className="m-1 xs:m-2 sm:m-4 p-1 xs:p-2 sm:p-6 shadow-lg border-0 w-full max-w-none">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
				<h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-900">My Orders</h2>
				{/* Removed Create Order button for writers */}
			</div>
			<div className="w-full sm:w-64 mb-4 xs:mb-6">
				<label htmlFor="order-status-select" className="block text-gray-900 font-semibold mb-1 text-xs xs:text-sm">Filter by Status</label>
				<Select
					id="order-status-select"
					value={activeStatus}
					onChange={e => { setActiveStatus(e.target.value); setCurrentPage(1); }}
					className="bg-white border-gray-200 focus:ring-2 focus:ring-gray-400 focus:border-gray-400 text-gray-900 font-medium shadow-sm transition-all duration-150"
				>
					{ORDER_STATUSES.map(status => (
						<option key={status.key} value={status.key}>{status.label}</option>
					))}
				</Select>
			</div>
			{loading ? (
				<div className="text-center py-8 text-gray-500">
					<Loader />
				</div>
			) : error ? (
				<div className="text-center py-8 text-red-600">{error}</div>
			) : (
				<>
					{/* Mobile Card View */}
					<div className="block md:hidden space-y-4">
						{orders.length > 0 ? orders.map(order => (
							<div key={order.id} className="rounded-xl border border-gray-200 bg-white/90 shadow p-4 flex flex-col gap-2">
								<div className="flex justify-between items-center mb-1">
									<span className="font-bold text-gray-900 text-base truncate">{order.title}</span>
									<span className={`px-2 py-1 rounded text-xs font-semibold ${order.status === 'approved' ? 'bg-green-100 text-green-700' : order.status === 'feedback' ? 'bg-yellow-100 text-yellow-700' : order.status === 'pending_payment' ? 'bg-red-100 text-red-700' : order.status === 'paid' ? 'bg-blue-100 text-blue-700' : order.status === 'awaiting_assignment' ? 'bg-gray-100 text-gray-700' : order.status === 'assigned' ? 'bg-purple-100 text-purple-700' : order.status === 'in_progress' ? 'bg-orange-100 text-orange-700' : order.status === 'submitted_for_review' ? 'bg-cyan-100 text-cyan-700' : order.status === 'completed' ? 'bg-green-200 text-green-900' : 'bg-gray-100 text-gray-700'}`}>{order.status}</span>
								</div>
								<div className="text-xs text-gray-700 truncate mb-1">{order.description}</div>
								<div className="flex flex-wrap gap-2 text-xs">
									<span><b>Writer:</b> {order.writer_username || '-'}</span>
									<span><b>Level:</b> {order.level_name}</span>
									<span><b>Pages:</b> {order.order_pages_name}</span>
									<span><b>Urgency:</b> {order.order_urgency_name}</span>
									<span><b>Style:</b> {order.order_style_name}</span>
									<span><b>Language:</b> {order.order_language_name}</span>
									<span><b>Price:</b> ${order.price?.toFixed(2)}</span>
								</div>
								<div className="flex gap-2 mt-2">
									{order.original_order_file ? (
									<a href={order.original_order_file} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center p-2 rounded-full bg-gradient-to-r from-gray-700 via-gray-500 to-gray-400 text-white shadow hover:from-gray-800 hover:to-gray-600 transition-all duration-150 border border-gray-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-400" title="Open file in new tab">
											<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
												<path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
											</svg>
										</a>
									) : (
										<span className="text-gray-400 italic">No file</span>
									)}
									<span className="text-gray-700 font-semibold">View</span>
								</div>
							</div>
						)) : (
						  <div className="flex flex-col items-center justify-center py-8">
							<div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 via-cyan-100 to-green-100 mb-2">
							  <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a4 4 0 014-4h4a4 4 0 014 4v2M9 17H5a2 2 0 01-2-2v-5a2 2 0 012-2h4a2 2 0 012 2v5a2 2 0 01-2 2z" /></svg>
							</div>
							<div className="text-center text-base font-semibold text-blue-700">No orders found</div>
				<span className="text-center text-xs text-slate-500 mt-1">Try adjusting your filters or check back later.</span>
			  </div>
			)}
		  </div>
		  {/* Desktop Table View - Unified Modern Style */}
  <div className="hidden md:block rounded-2xl border border-gray-200 bg-white/90 shadow-lg w-full" style={{ height: 'auto' }}>
	<div className="overflow-x-auto h-full">
  <table className="w-full border-separate border-spacing-y-0 rounded-2xl overflow-hidden shadow-xl bg-white min-w-[1200px]">
	<thead className="sticky top-0 bg-gradient-to-r from-white via-gray-100 to-gray-200 z-10">
	  <tr>
		<th className="px-4 py-3"></th>
		<th className="px-2 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider border-b border-gray-200">Order #</th>
		<th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider border-b border-gray-200">Title</th>
		<th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider border-b border-gray-200">Status</th>
		<th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider border-b border-gray-200">Level</th>
		<th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider border-b border-gray-200">Order Date</th>
		<th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider border-b border-gray-200">Order File</th>
	  </tr>
	</thead>
	<tbody className="divide-y divide-gray-100">
	  {orders.length > 0 ? (
		orders.map((order, idx) => (
		  <React.Fragment key={order.id}>
			<tr
			  className={`transition group ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100`}
			  style={{ boxShadow: '0 1px 4px 0 rgba(30, 41, 59, 0.04)' }}
			>
			  <td className="px-4 py-4 text-center">
				<button
				  onClick={() => setExpandedRow(expandedRow === order.id ? null : order.id)}
				  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 focus:outline-none shadow-sm transition"
				  title={expandedRow === order.id ? 'Collapse' : 'Expand'}
				>
				  {expandedRow === order.id ? (
					<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" /></svg>
				  ) : (
					<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
				  )}
				</button>
			  </td>
			  {/* Order Number */}
			  <td className="px-6 py-4 align-middle text-xs xs:text-sm sm:text-base text-gray-700 font-mono">{order.order_number || order.id}</td>
			  {/* Title field */}
			<td className="max-w-[120px] truncate px-6 py-4 font-semibold text-gray-900 capitalize align-middle">{order.title}</td>
			  <td className="px-6 py-4 align-middle">
				<span className={`px-2 py-1 rounded text-xs font-semibold ${order.status === 'approved' ? 'bg-green-100 text-green-700' : order.status === 'feedback' ? 'bg-yellow-100 text-yellow-700' : order.status === 'pending_payment' ? 'bg-red-100 text-red-700' : order.status === 'paid' ? 'bg-gray-200 text-gray-700' : order.status === 'awaiting_assignment' ? 'bg-gray-100 text-gray-700' : order.status === 'assigned' ? 'bg-gray-200 text-gray-700' : order.status === 'in_progress' ? 'bg-orange-100 text-orange-700' : order.status === 'submitted_for_review' ? 'bg-gray-100 text-gray-700' : order.status === 'completed' ? 'bg-green-200 text-green-900' : 'bg-gray-100 text-gray-700'}`}>{order.status}</span>
			  </td>
			  <td className="px-6 py-4 text-xs xs:text-sm sm:text-base align-middle">{order.level_name}</td>
			  {/* Order Date */}
			  <td className="px-6 py-4 align-middle text-xs xs:text-sm sm:text-base text-gray-700">{order.created_at ? new Date(order.created_at).toLocaleDateString() : '-'}</td>
			  <td className="px-6 py-4 align-middle">
				{order.original_order_file ? (
				  <a
					href={order.original_order_file}
					target="_blank"
					rel="noopener noreferrer"
					className="inline-flex items-center justify-center p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 shadow-sm transition border border-gray-200"
					title="Open file in new tab"
				  >
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
					  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
					</svg>
				  </a>
				) : (
				  <span className="text-gray-400 italic">No file</span>
				)}
			  </td>
			</tr>
			{expandedRow === order.id && (
			  <tr>
				<td colSpan={4} className="py-0 px-2">
				  <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-white via-gray-50 to-gray-100 shadow-lg p-4 my-2 animate-fade-in-up w-full">
					{/* Title and Description in expanded row */}
					<div className="mb-4 flex flex-col xs:flex-row gap-4 w-full max-w-full">
					  <div className="flex-1 min-w-0">
						<span className="font-bold text-fuchsia-700 text-base sm:text-lg mb-1 block">Title:</span>
						<div className="text-gray-900 text-base sm:text-lg whitespace-pre-line break-words w-full min-h-[1.5em]">
						  {order.title ? (
							<ExpandableText text={order.title} maxLength={48} />
						  ) : (
							<span className="italic text-gray-400">No title provided.</span>
						  )}
						</div>
					  </div>
					  <div className="flex-1 min-w-0">
						<span className="font-bold text-fuchsia-700 text-base sm:text-lg mb-1 block">Description:</span>
						<div className="text-gray-700 text-base sm:text-lg whitespace-pre-line break-words w-full min-h-[1.5em]">
						  {order.description ? (
							<ExpandableText text={order.description} maxLength={96} />
						  ) : (
							<span className="italic text-gray-400">No description provided.</span>
						  )}
						</div>
					  </div>
					</div>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
						  {/* Assignment Acceptance (writer) */}
						  {user && ((Array.isArray(user.roles) ? user.roles.includes('writer') : user.role === 'writer')) && order.status === 'awaiting_asign_acceptance' && (
							<div className="my-4 flex flex-col items-end col-span-2">
							  <div className="mb-2 text-sm font-semibold text-gray-700">This order has been assigned to you. Do you accept?</div>
							  <div className="flex gap-2">
								<button
								  className="px-4 py-1.5 rounded-lg bg-green-600 text-white font-bold hover:bg-green-700 transition-all shadow"
								  onClick={() => handleAssignmentResponse(order.id, true)}
								>
								  Accept
								</button>
								<button
								  className="px-4 py-1.5 rounded-lg bg-red-500 text-white font-bold hover:bg-red-600 transition-all shadow"
								  onClick={() => handleAssignmentResponse(order.id, false)}
								>
								  Reject
								</button>
							  </div>
							</div>
						  )}
						  {/* Submission button for assigned orders (writer) */}
						  {user && ((Array.isArray(user.roles) ? user.roles.includes('writer') : user.role === 'writer')) && order.status === 'assigned' && (
							<div className="my-4 flex flex-col items-end col-span-2">
							  <button
								className="px-5 py-2 rounded-lg bg-fuchsia-600 text-white font-bold hover:bg-fuchsia-700 transition-all shadow-lg focus:ring-2 focus:ring-fuchsia-400"
								onClick={() => {
								  setSubmitOrderId(order.id);
								  setSubmitDialogOpen(true);
								}}
							  >
								Submit Work
							  </button>
							</div>
						  )}
						  <div className="flex items-center gap-2 mb-2"><svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg><span className="font-semibold text-gray-900">Writer Username:</span><span className="text-gray-700">{order.writer_username || '-'}</span></div>
						  <div className="flex items-center gap-2 mb-2"><svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" /></svg><span className="font-semibold text-gray-900">Pages:</span><span className="text-gray-700">{order.order_pages_name}</span></div>
						  <div className="flex items-center gap-2 mb-2"><svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" /></svg><span className="font-semibold text-gray-900">Urgency:</span><span className="text-gray-700">{order.order_urgency_name}</span></div>
						  <div className="flex items-center gap-2 mb-2"><svg className="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg><span className="font-semibold text-gray-900">Style:</span><span className="text-gray-700">{order.order_style_name}</span></div>
						  <div className="flex items-center gap-2 mb-2"><svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /></svg><span className="font-semibold text-gray-900">Language:</span><span className="text-gray-700">{order.order_language_name}</span></div>
						  <div className="flex items-center gap-2 mb-2"><svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg><span className="font-semibold text-gray-900">Priority:</span><span className="text-gray-700">{order.is_high_priority ? 'Yes' : 'No'}</span></div>
						  <div className="flex items-center gap-2 mb-2"><svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a4 4 0 014-4h4a4 4 0 014 4v2M9 17H5a2 2 0 01-2-2v-5a2 2 0 012-2h4a2 2 0 012 2v5a2 2 0 01-2 2z" /></svg><span className="font-semibold text-gray-900">Plagiarism:</span><span className="text-gray-700">{order.plagarism_report ? 'Yes' : 'No'}</span></div>
						  <div className="flex items-center gap-2 mb-2"><svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h8M12 8v8" /></svg><span className="font-semibold text-gray-900">Summary:</span><span className="text-gray-700">{order.one_page_summary ? 'Yes' : 'No'}</span></div>
						  <div className="flex items-center gap-2 mb-2"><svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg><span className="font-semibold text-gray-900">Quality:</span><span className="text-gray-700">{order.extra_quality_check ? 'Yes' : 'No'}</span></div>
						  <div className="flex items-center gap-2 mb-2"><svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" /></svg><span className="font-semibold text-gray-900">Draft:</span><span className="text-gray-700">{order.initial_draft ? 'Yes' : 'No'}</span></div>
						  <div className="flex items-center gap-2 mb-2"><svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" /></svg><span className="font-semibold text-gray-900">SMS:</span><span className="text-gray-700">{order.sms_update ? 'Yes' : 'No'}</span></div>
						  <div className="flex items-center gap-2 mb-2"><svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" /></svg><span className="font-semibold text-gray-900">Sources:</span><span className="text-gray-700">{order.full_text_copy_sources ? 'Yes' : 'No'}</span></div>
						  <div className="flex items-center gap-2 mb-2"><svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /></svg><span className="font-semibold text-gray-900">Top Writer:</span><span className="text-gray-700">{order.top_writer ? 'Yes' : 'No'}</span></div>
						  <div className="flex items-center gap-2 mb-2"><svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" /></svg><span className="font-semibold text-gray-900">Price:</span><span className="text-gray-700">${order.price?.toFixed(2)}</span></div>
						</div>
						{/* Tabs Section */}
						<WriterOrderSubmissionsAndReviewsTabs orderId={order.id} />
					  </div>
					</td>
					<td className="px-6 py-4 text-center">
					</td>
				  </tr>
				)}
			  </React.Fragment>
			))
		  ) : (
			<tr>
			  <td colSpan={6} className="text-center text-xs xs:text-sm sm:text-base">No orders found.</td>
			</tr>
		  )}
		</tbody>
	  </table>
	</div>
  </div>
					{/* Pagination */}
<div className="flex flex-col sm:flex-row justify-between items-center mt-4 xs:mt-6 gap-2">
	<nav
		className="flex items-center justify-center rounded-full bg-white/80 shadow-sm border border-gray-200 px-2 xs:px-3 py-1 xs:py-2 gap-1"
		aria-label="Pagination"
	>
		<Button
			onClick={handlePrevPage}
			disabled={currentPage === 1}
			className="rounded-full px-2 xs:px-3 py-1 text-xs xs:text-sm sm:text-base font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-2 focus:ring-gray-400 disabled:opacity-50 border-none shadow-none"
			aria-label="Previous page"
		>
			&lt;
		</Button>
		{Array.from({ length: totalPages }, (_, i) => (
			<Button
				key={i + 1}
				onClick={() => setCurrentPage(i + 1)}
				className={`rounded-full px-3 py-1 text-xs xs:text-sm sm:text-base font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-gray-400 ${currentPage === i + 1 ? 'bg-gray-900 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
				aria-label={`Page ${i + 1}`}
			>
				{i + 1}
			</Button>
		))}
		<Button
			onClick={handleNextPage}
			disabled={currentPage === totalPages}
			className="rounded-full px-2 xs:px-3 py-1 text-xs xs:text-sm sm:text-base font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-2 focus:ring-gray-400 disabled:opacity-50 border-none shadow-none"
			aria-label="Next page"
		>
			&gt;
		</Button>
	</nav>
</div>
					{/* PayPalModal removed: PayPal flow deprecated */}
					<OrderSubmitDialog
						isOpen={submitDialogOpen}
						onClose={() => setSubmitDialogOpen(false)}
						orderId={submitOrderId}
						onSubmitted={() => setSubmitDialogOpen(false)}
					/>
					<OrderSubmissionsDialog
						isOpen={submissionsDialogOpen}
						onClose={() => setSubmissionsDialogOpen(false)}
						writerSubmissions={orders.find(o => o.id === submissionsOrderId)?.writer_submissions || []}
						onAction={() => {
							// refetch orders after approve or feedback
							const jwt = localStorage.getItem("jwt_token");
							const roles = user.roles || [];
							let url = `${API_BASE_URL}/api/admin/orders?page=${currentPage}&page_size=${PAGE_SIZE}`;
							if (roles.includes("super_admin") || roles.includes("admin")) {
								if (activeStatus) {
									url += `&status=${activeStatus}`;
								}
							} else if (roles.includes("writer")) {
								url = `${API_BASE_URL}/api/writer/orders/${user.id}?page=${currentPage}&page_size=${PAGE_SIZE}`;
								if (activeStatus) {
									url += `&status=${activeStatus}`;
								}
							} else if (roles.length === 1 && roles[0] === "user") {
								url = `${API_BASE_URL}/api/orders/me?page=${currentPage}&page_size=${PAGE_SIZE}`;
								if (activeStatus) {
									url += `&status=${activeStatus}`;
								}
							}
							fetch(url, {
								credentials: "include",
								headers: {
									"Content-Type": "application/json",
									Authorization: jwt ? `Bearer ${jwt}` : "",
								},
							})
								.then((res) => res.json())
								.then((data) => {
									if (Array.isArray(data)) {
										setOrders(data);
										setTotal(data.length);
									} else {
										setOrders(data.orders || []);
										setTotal(data.total || (data.orders ? data.orders.length : 0));
									}
								});
						}}
					/>
				</>
			)}
		</Card>
	);
};

export default WriterOrders;

function OrderExpandableTabs({ orderId }) {
  const [tab, setTab] = useState("submissions");
  const [submissions, setSubmissions] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

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
