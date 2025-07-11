import { ExpandableText } from "../../components/OrderDetailsPanel.jsx";
import React, { useEffect, useState } from "react";
import OrderDetailsFetcher from "./OrderDetailsFetcher";
import { Card } from "../../components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { Select } from "../../components/ui/select";
import { useAuth } from "../auth/AuthProvider";
import Loader from '../../components/ui/Loader';
import AssignmentResponseButtons from "../../components/ui/AssignmentResponseButtons";
import { useToast } from "../../components/ui/toast";
import OrderSubmitDialog from "../../components/ui/OrderSubmitDialog";

import WriterOrderSubmissionsAndReviewsTabs from "../users/WriterOrderSubmissionsAndReviewsTabs";
import OrderSubmissionsDialog from "../../components/ui/OrderSubmissionsDialog";

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
  { key: "feedback", label: "Feedback" }
];

const PAGE_SIZE = 6;

const OrdersManagement = () => {
	const { api, user } = useAuth();
	const { showToast } = useToast();
	const [activeStatus, setActiveStatus] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [orders, setOrders] = useState([]);
	const [total, setTotal] = useState(0);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [selectedOrder, setSelectedOrder] = useState(null);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [writers, setWriters] = useState([]);
	const [writersLoading, setWritersLoading] = useState(false);
	const [writersError, setWritersError] = useState("");
	const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
	const [submitOrderId, setSubmitOrderId] = useState(null);
	// Add missing state for submissions dialog
	const [submissionsDialogOpen, setSubmissionsDialogOpen] = useState(false);
	const [submissionsOrderId, setSubmissionsOrderId] = useState(null);
	const [expandedRow, setExpandedRow] = useState(null);

	useEffect(() => {
		setLoading(true);
		setError("");
		api.getAllOrders(currentPage, PAGE_SIZE, activeStatus)
			.then((res) => {
				setOrders(res.orders || []);
				setTotal(res.total || 0);
			})
			.catch((err) => setError(err.message || "Failed to fetch orders"))
			.finally(() => setLoading(false));
	}, [api, currentPage, activeStatus]);

	const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

	const handlePrevPage = () => setCurrentPage((p) => Math.max(1, p - 1));
	const handleNextPage = () => setCurrentPage((p) => Math.min(totalPages, p + 1));
	const handleTabChange = (status) => {
		setActiveStatus(status);
		setCurrentPage(1);
	};

	const handleAssignClick = (order) => {
	setSelectedOrder(order);
	setDialogOpen(true);
	setWriters([]);
	setWritersError("");
	setWritersLoading(true);
	// Fetch writers from backend using GET method
	const jwt = localStorage.getItem('jwt_token');
	fetch(`${API_BASE_URL}/api/admin/users?role=writer`, {
		method: 'GET',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': jwt ? `Bearer ${jwt}` : ''
		}
	})
		.then(res => res.json())
		.then(data => {
			setWriters(data.users || []);
			setWritersLoading(false);
		})
		.catch(err => {
			setWritersError("Failed to fetch writers");
			setWritersLoading(false);
		});
	};

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

	return (
		<Card className="m-1 xs:m-2 sm:m-4 p-1 xs:p-2 sm:p-6 shadow-lg border-0">
			<div>
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
					<h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-900">Orders Management</h2>
					<div className="w-full sm:w-64">
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
				</div>
				{loading ? (
					<div className="text-center py-8 text-gray-500">Loading orders...</div>
				) : error ? (
					<div className="text-center py-8 text-red-600">{error}</div>
				) : (
					<div>
						<div className="rounded-2xl border border-gray-200 bg-white/90 shadow-lg w-full" style={{ height: 'auto' }}>
							<div className="overflow-x-auto h-full">
								{/* ...existing code for table, tbody, expandable rows... */}
								<table className="w-full border-separate border-spacing-y-0 rounded-2xl overflow-hidden shadow-xl bg-white min-w-[1200px]">
<thead className="sticky top-0 bg-gradient-to-r from-gray-100 to-gray-50 z-10">
  <tr>
   <th className="px-4 py-3"></th>
   <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider border-b border-gray-200">Order Number</th>
   <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider border-b border-gray-200">Title</th>
   <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider border-b border-gray-200">Order Date</th>
   <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider border-b border-gray-200">Status</th>
   <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider border-b border-gray-200">Level</th>
   <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider border-b border-gray-200">Order File</th>
   {/* Add more headers as needed */}
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
		  <td className="px-6 py-4 font-mono text-xs text-gray-600 align-middle">{order.order_number}</td>
		  <td className="max-w-[120px] truncate px-6 py-4 font-semibold text-gray-900 capitalize align-middle">{order.title}</td>
		  <td className="px-6 py-4 text-xs xs:text-sm sm:text-base align-middle text-gray-700">{order.created_at ? new Date(order.created_at).toLocaleDateString() : '-'}</td>
		  <td className="px-6 py-4 align-middle">
		   <span className={`px-2 py-1 rounded text-xs font-semibold
			 ${order.status === 'approved' ? 'bg-gray-200 text-gray-900 border border-gray-300' :
			 order.status === 'feedback' ? 'bg-gray-100 text-gray-700 border border-gray-200' :
			 order.status === 'pending_payment' ? 'bg-gray-100 text-gray-700 border border-gray-200' :
			 order.status === 'paid' ? 'bg-gray-100 text-gray-700 border border-gray-200' :
			 order.status === 'awaiting_assignment' ? 'bg-gray-100 text-gray-700 border border-gray-200' :
			 order.status === 'assigned' ? 'bg-gray-100 text-gray-700 border border-gray-200' :
			 order.status === 'in_progress' ? 'bg-gray-100 text-gray-700 border border-gray-200' :
			 order.status === 'submitted_for_review' ? 'bg-gray-100 text-gray-700 border border-gray-200' :
			 order.status === 'completed' ? 'bg-gray-300 text-gray-900 border border-gray-400' :
			 'bg-gray-100 text-gray-700 border border-gray-200'}
		   `}>{order.status}</span>
		  </td>
		  <td className="px-6 py-4 text-xs xs:text-sm sm:text-base align-middle">{order.level_name}</td>
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
														{/* Add more cells as needed */}
													</tr>
			  {expandedRow === order.id && (
				<tr>
				  <td colSpan={6} className="py-0 px-2">
					<div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-white via-fuchsia-50 to-gray-100 shadow-lg p-4 my-2 animate-fade-in-up">
					  {/* Title and Description at the top, always visible */}
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
				<div className="text-gray-700 text-base sm:text-lg break-words max-w-full min-h-[1.5em]">
		  {order.description ? (
			<ExpandableText text={order.description} maxLength={96} />
		  ) : (
			<span className="italic text-gray-400">No description provided.</span>
		  )}
				</div>
			  </div>
			</div>
																	<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
																		<div className="flex items-center gap-2 mb-2"><svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg><span className="font-semibold text-gray-900">Writer Username:</span><span className="text-gray-800">{order.writer_username || '-'}</span></div>
																		<div className="flex items-center gap-2 mb-2"><svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" /></svg><span className="font-semibold text-gray-900">Pages:</span><span className="text-gray-800">{order.order_pages_name}</span></div>
																		<div className="flex items-center gap-2 mb-2"><svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" /></svg><span className="font-semibold text-gray-900">Urgency:</span><span className="text-gray-800">{order.order_urgency_name}</span></div>
																		<div className="flex items-center gap-2 mb-2"><svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg><span className="font-semibold text-gray-900">Style:</span><span className="text-gray-800">{order.order_style_name}</span></div>
																		<div className="flex items-center gap-2 mb-2"><svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /></svg><span className="font-semibold text-gray-900">Language:</span><span className="text-gray-800">{order.order_language_name}</span></div>
																		<div className="flex items-center gap-2 mb-2"><svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg><span className="font-semibold text-gray-900">Priority:</span><span className="text-gray-800">{order.is_high_priority ? 'Yes' : 'No'}</span></div>
																		<div className="flex items-center gap-2 mb-2"><svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a4 4 0 014-4h4a4 4 0 014 4v2M9 17H5a2 2 0 01-2-2v-5a2 2 0 012-2h4a2 2 0 012 2v5a2 2 0 01-2 2z" /></svg><span className="font-semibold text-gray-900">Plagiarism:</span><span className="text-gray-800">{order.plagarism_report ? 'Yes' : 'No'}</span></div>
																		<div className="flex items-center gap-2 mb-2"><svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h8M12 8v8" /></svg><span className="font-semibold text-gray-900">Summary:</span><span className="text-gray-800">{order.one_page_summary ? 'Yes' : 'No'}</span></div>
																		<div className="flex items-center gap-2 mb-2"><svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg><span className="font-semibold text-gray-900">Quality:</span><span className="text-gray-800">{order.extra_quality_check ? 'Yes' : 'No'}</span></div>
																		<div className="flex items-center gap-2 mb-2"><svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" /></svg><span className="font-semibold text-gray-900">Draft:</span><span className="text-gray-800">{order.initial_draft ? 'Yes' : 'No'}</span></div>
																		<div className="flex items-center gap-2 mb-2"><svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" /></svg><span className="font-semibold text-gray-900">SMS:</span><span className="text-gray-800">{order.sms_update ? 'Yes' : 'No'}</span></div>
																		<div className="flex items-center gap-2 mb-2"><svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" /></svg><span className="font-semibold text-gray-900">Sources:</span><span className="text-gray-800">{order.full_text_copy_sources ? 'Yes' : 'No'}</span></div>
																		<div className="flex items-center gap-2 mb-2"><svg className="w-5 h-5 text-purple-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /></svg><span className="font-semibold text-gray-900">Top Writer:</span><span className="text-gray-800">{order.top_writer ? 'Yes' : 'No'}</span></div>
																		<div className="flex items-center gap-2 mb-2"><svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" /></svg><span className="font-semibold text-gray-900">Price:</span><span className="text-gray-800">${order.price?.toFixed(2)}</span></div>
																	</div>
																	{/* Tabs Section */}
																	{/* Assign Writer Button (admin only, visible for all except pending_payment, submitted_for_review, approved) */}
																	{user && ((Array.isArray(user.roles) ? user.roles.includes('admin') : user.role === 'admin')) && !['pending_payment', 'submitted_for_review', 'approved'].includes(order.status) && (
																	<div className="mt-4 flex justify-end">
																		<button
																		className="px-4 py-2 rounded-lg bg-fuchsia-600 text-white font-bold hover:bg-fuchsia-700 transition-all shadow"
																		onClick={() => handleAssignClick(order)}
																		>
																		Assign Writer
																		</button>
																	</div>
																	)}

																	{/* Assignment Acceptance (writer) */}
																	{user && ((Array.isArray(user.roles) ? user.roles.includes('writer') : user.role === 'writer')) && order.status === 'awaiting_asign_acceptance' && (
																	  <div className="my-4 flex flex-col items-end">
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
																<WriterOrderSubmissionsAndReviewsTabs orderId={order.id} />
						
																</div>
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
					</div>
				)}
			   {/* Assign Writer Modal */}
			   {dialogOpen && !!selectedOrder && (
				   <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-300">
					   <div className="relative w-full max-w-lg mx-4 sm:mx-0 bg-white rounded-2xl shadow-2xl border border-gray-200 p-0 animate-fade-in-up">
						   {/* Modal Header */}
						   <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 rounded-t-2xl bg-gradient-to-r from-gray-50 to-gray-100">
							   <h3 className="text-lg sm:text-xl font-bold text-gray-900">
								   Assign Writer to Order
							   </h3>
							   <button
								   className="text-2xl text-gray-400 hover:text-gray-700 font-bold focus:outline-none transition-colors"
								   onClick={() => {
									   setDialogOpen(false);
									   setSelectedOrder(null);
								   }}
								   aria-label="Close"
							   >
								   &times;
							   </button>
						   </div>
						   {/* Modal Body */}
						   <div className="px-6 py-5">
							   <div className="mb-4">
								   <span className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Order</span>
								   <span className="block text-base font-medium text-gray-900 truncate">{selectedOrder.title}</span>
							   </div>
							   {/* Writers List */}
							   {writersLoading ? (
								   <div className="flex items-center justify-center py-8 text-gray-700">
									   <svg className="animate-spin h-6 w-6 mr-2 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
									   Loading writers...
								   </div>
							   ) : writersError ? (
								   <div className="text-center py-6 text-red-600 font-medium">{writersError}</div>
							   ) : (
								   <ul className="divide-y divide-gray-100 max-h-64 overflow-y-auto">
									   {writers.length === 0 ? (
										   <li className="py-4 text-center text-gray-400">No writers found.</li>
									   ) : (
										   writers.map(writer => (
											   <li key={writer.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-3 px-1 hover:bg-gray-50 rounded-lg transition-colors">
												   <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
													   <span className="text-base font-semibold text-gray-900">{writer.username}</span>
													   <span className="text-sm text-gray-700">{writer.first_name} {writer.last_name}</span>
													   <span className="text-xs text-gray-500">{writer.email || writer.id}</span>
												   </div>
												   <button
													   className="mt-2 sm:mt-0 px-4 py-1.5 bg-gray-900 hover:bg-gray-700 text-white text-xs font-semibold rounded-lg shadow transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-gray-400"
													   disabled={writersLoading}
													   onClick={async () => {
														   const jwt = localStorage.getItem('jwt_token');
														   try {
															   const res = await fetch(`${API_BASE_URL}/api/admin/orders/${selectedOrder.id}/assign`, {
																   method: 'PUT',
																   headers: {
																	   'Content-Type': 'application/json',
																	   'Authorization': jwt ? `Bearer ${jwt}` : ''
																   },
																   body: JSON.stringify({ writer_id: writer.id })
															   });
															   if (!res.ok) throw new Error('Failed to assign writer');
															   setDialogOpen(false);
															   setSelectedOrder(null);
															   setLoading(true);
															   api.getAllOrders(currentPage, PAGE_SIZE, activeStatus)
																   .then((res) => {
																	   setOrders(res.orders || []);
																	   setTotal(res.total || 0);
																   })
																   .catch((err) => setError(err.message || "Failed to fetch orders"))
																   .finally(() => setLoading(false));
														   } catch (err) {
															   showToast({ type: "error", message: err.message || 'Failed to assign writer' });
														   }
													   }}
												   >
													   Assign
												   </button>
											   </li>
										   ))
									   )}
								   </ul>
							   )}
						   </div>
					   </div>
				   </div>
			   )}
				{/* Submit Order Dialog */}
				<OrderSubmitDialog
					isOpen={submitDialogOpen}
					onClose={() => setSubmitDialogOpen(false)}
					orderId={submitOrderId}
					onSubmitted={() => setSubmitDialogOpen(false)}
				/>
				{/* Submissions Dialog (for View Submissions action) */}
				<OrderSubmissionsDialog
					isOpen={submissionsDialogOpen}
					onClose={() => setSubmissionsDialogOpen(false)}
					writerSubmissions={orders.find(o => o.id === submissionsOrderId)?.writer_submissions || []}
					onAction={() => {
						// refetch orders after approve or feedback
						setLoading(true);
						api.getAllOrders(currentPage, PAGE_SIZE, activeStatus)
							.then((res) => {
								setOrders(res.orders || []);
								setTotal(res.total || 0);
							})
							.catch((err) => setError(err.message || "Failed to fetch orders"))
							.finally(() => setLoading(false));
					}}
				/>
			</div>
		</Card>
	);
};

export default OrdersManagement;
