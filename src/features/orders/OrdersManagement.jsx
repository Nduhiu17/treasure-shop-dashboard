import React, { useEffect, useState } from "react";
import { Card } from "../../components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { Select } from "../../components/ui/select";
import { useAuth } from "../auth/AuthProvider";
import Loader from '../../components/ui/Loader';
import AssignmentResponseButtons from "../../components/ui/AssignmentResponseButtons";
import { useToast } from "../../components/ui/toast";
import OrderSubmitDialog from "../../components/ui/OrderSubmitDialog";
import OrderSubmissionsDialog from "../../components/ui/OrderSubmissionsDialog";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const ORDER_STATUSES = [
	{ key: "pending_payment", label: "Pending Payment" },
	{ key: "paid", label: "Paid" },
	{ key: "awaiting_assignment", label: "Awaiting Assignment" },
	{ key: "assigned", label: "Assigned" },
	{ key: "in_progress", label: "In Progress" },
	{ key: "submitted_for_review", label: "Submitted for Review" },
	{ key: "approved", label: "Approved" },
	{ key: "feedback", label: "Feedback" },
	{ key: "completed", label: "Completed" },
];

const PAGE_SIZE = 10;

const OrdersManagement = () => {
	const { api, user } = useAuth();
	const { showToast } = useToast();
	const [activeStatus, setActiveStatus] = useState("pending_payment");
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
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
				<h2 className="text-base xs:text-lg sm:text-xl font-semibold text-blue-900">All Orders</h2>
				<div className="w-full sm:w-64">
					<label htmlFor="order-status-select" className="block text-blue-900 font-semibold mb-1 text-xs xs:text-sm">Filter by Status</label>
					<Select
						id="order-status-select"
						value={activeStatus}
						onChange={e => { setActiveStatus(e.target.value); setCurrentPage(1); }}
						className="bg-white border-blue-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-blue-900 font-medium shadow-sm transition-all duration-150"
					>
						{ORDER_STATUSES.map(status => (
							<option key={status.key} value={status.key}>{status.label}</option>
						))}
					</Select>
				</div>
			</div>
			{loading ? (
				<div className="text-center py-8 text-blue-700">Loading orders...</div>
			) : error ? (
				<div className="text-center py-8 text-red-600">{error}</div>
			) : (
				<>
					<div className="rounded-2xl border border-blue-100 bg-white/90 shadow-lg w-full" style={{ height: 'auto' }}>
						<div className="overflow-x-auto h-full">
							<table className="w-full min-w-[1200px] text-xs xs:text-sm sm:text-base h-full">
								<thead className="sticky top-0 z-20 bg-gradient-to-r from-blue-50 via-blue-100 to-cyan-100/80 shadow-md border-b-2 border-blue-200">
									<tr>
										<th className="px-4 py-1"></th>
										<th className="px-4 py-1 text-left font-extrabold text-blue-900 text-xs xs:text-sm sm:text-base tracking-wide uppercase bg-opacity-90 border-r border-blue-100 last:border-r-0 whitespace-nowrap shadow-sm" style={{ background: 'rgba(255,255,255,0.85)' }}>Title</th>
										<th className="px-4 py-1 text-left font-extrabold text-blue-900 text-xs xs:text-sm sm:text-base tracking-wide uppercase bg-opacity-90 border-r border-blue-100 last:border-r-0 whitespace-nowrap shadow-sm" style={{ background: 'rgba(236,245,255,0.85)' }}>Description</th>
										<th className="px-4 py-1 text-left font-extrabold text-blue-900 text-xs xs:text-sm sm:text-base tracking-wide uppercase bg-opacity-90 border-r border-blue-100 last:border-r-0 whitespace-nowrap shadow-sm" style={{ background: 'rgba(255,255,255,0.85)' }}>Status</th>
										<th className="px-4 py-1 text-left font-extrabold text-blue-900 text-xs xs:text-sm sm:text-base tracking-wide uppercase bg-opacity-90 border-r border-blue-100 last:border-r-0 whitespace-nowrap shadow-sm" style={{ background: 'rgba(255,255,255,0.85)' }}>Level</th>
										<th className="px-4 py-1 text-left font-extrabold text-blue-900 text-xs xs:text-sm sm:text-base tracking-wide uppercase bg-opacity-90 border-r border-blue-100 last:border-r-0 whitespace-nowrap shadow-sm" style={{ background: 'rgba(255,255,255,0.85)' }}>
											<span className="flex items-center gap-1">Order File
												<svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" /></svg>
											</span>
										</th>
									</tr>
								</thead>
								<tbody>
									{orders.length > 0 ? (
										orders.map(order => (
											<React.Fragment key={order.id}>
												<tr className="hover:bg-blue-50">
													<td className="px-4 py-1 text-center">
														<button
															onClick={() => setExpandedRow(expandedRow === order.id ? null : order.id)}
															className="focus:outline-none"
															title={expandedRow === order.id ? 'Collapse' : 'Expand'}
														>
															{expandedRow === order.id ? (
																<svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" /></svg>
															) : (
																<svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
															)}
														</button>
													</td>
													<td className="max-w-[120px] truncate text-xs xs:text-sm sm:text-base px-4 py-1">{order.title}</td>
													<td className="max-w-[200px] truncate text-xs xs:text-sm sm:text-base px-4 py-1">{order.description}</td>
													<td className="px-4 py-1">
														<span className={`px-2 py-1 rounded text-xs font-semibold ${order.status === 'approved' ? 'bg-green-100 text-green-700' : order.status === 'feedback' ? 'bg-yellow-100 text-yellow-700' : order.status === 'pending_payment' ? 'bg-red-100 text-red-700' : order.status === 'paid' ? 'bg-blue-100 text-blue-700' : order.status === 'awaiting_assignment' ? 'bg-gray-100 text-gray-700' : order.status === 'assigned' ? 'bg-purple-100 text-purple-700' : order.status === 'in_progress' ? 'bg-orange-100 text-orange-700' : order.status === 'submitted_for_review' ? 'bg-cyan-100 text-cyan-700' : order.status === 'completed' ? 'bg-green-200 text-green-900' : 'bg-gray-100 text-gray-700'}`}>{order.status}</span>
													</td>
													<td className="text-xs xs:text-sm sm:text-base px-4 py-1">{order.level_name}</td>
													<td className="px-4 py-1">
														{order.original_order_file ? (
															<a
																href={order.original_order_file}
																target="_blank"
																rel="noopener noreferrer"
																className="inline-flex items-center justify-center p-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow hover:from-blue-600 hover:to-blue-800 transition-all duration-150 border border-blue-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
																title="Open file in new tab"
															>
																<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
																	<path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
																</svg>
															</a>
														) : (
															<span className="text-gray-400 italic">No file</span>
														)}
													</td>
												</tr>
												{expandedRow === order.id && (
													<tr className="bg-blue-50">
														<td colSpan={6} className="px-6 py-2 text-xs xs:text-sm sm:text-base">
															<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
																<div><b>Writer Username:</b> {order.writer_username || '-'}</div>
																<div><b>Pages:</b> {order.order_pages_name}</div>
																<div><b>Urgency:</b> {order.order_urgency_name}</div>
																<div><b>Style:</b> {order.order_style_name}</div>
																<div><b>Language:</b> {order.order_language_name}</div>
																<div><b>Priority:</b> {order.is_high_priority ? 'Yes' : 'No'}</div>
																<div><b>Plagiarism:</b> {order.plagarism_report ? 'Yes' : 'No'}</div>
																<div><b>Summary:</b> {order.one_page_summary ? 'Yes' : 'No'}</div>
																<div><b>Quality:</b> {order.extra_quality_check ? 'Yes' : 'No'}</div>
																<div><b>Draft:</b> {order.initial_draft ? 'Yes' : 'No'}</div>
																<div><b>SMS:</b> {order.sms_update ? 'Yes' : 'No'}</div>
																<div><b>Sources:</b> {order.full_text_copy_sources ? 'Yes' : 'No'}</div>
																<div><b>Top Writer:</b> {order.top_writer ? 'Yes' : 'No'}</div>
																<div><b>Price:</b> ${order.price?.toFixed(2)}</div>
															</div>
															<div className="mt-2">
																<AssignmentResponseButtons order={order} user={user} onRespond={handleAssignmentResponse} />
																{order.status === "assigned" && user.roles?.includes("writer") ? (
																	<Button
																		className="flex items-center gap-2 px-3 py-1 rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold shadow hover:from-blue-600 hover:to-blue-800 transition-all duration-150 text-xs xs:text-sm sm:text-base"
																		onClick={() => { setSubmitOrderId(order.id); setSubmitDialogOpen(true); }}
																		title="Submit Order"
																	>
																		<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
																		Submit
																	</Button>
																) : null}
																{order.status === "submitted_for_review" && user.roles?.includes("user") ? (
																	<Button
																		className="flex items-center gap-2 px-3 py-1 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold shadow hover:from-cyan-600 hover:to-blue-700 transition-all duration-150 text-xs xs:text-sm sm:text-base"
																		onClick={() => { setSubmissionsOrderId(order.id); setSubmissionsDialogOpen(true); }}
																		title="View Submissions"
																	>
																		<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
																		View Submissions
																	</Button>
																) : null}
																{!(order.status === "awaiting_asign_acceptance" && user.roles?.includes("writer")) && order.status !== "assigned" && order.status !== "submitted_for_review" && (
																	<Button onClick={() => handleAssignClick(order)} disabled={!(order.status === 'paid' || order.status === 'feedback' || order.status === 'awaiting_assignment')} className="w-full sm:w-auto text-xs xs:text-sm sm:text-base">
																		Assign Writer
																	</Button>
																)}
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
							className="flex items-center justify-center rounded-full bg-white/80 shadow-sm border border-blue-100 px-2 xs:px-3 py-1 xs:py-2 gap-1"
							aria-label="Pagination"
						>
							<Button
								onClick={handlePrevPage}
								disabled={currentPage === 1}
								className="rounded-full px-2 xs:px-3 py-1 text-xs xs:text-sm sm:text-base font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 focus:ring-2 focus:ring-blue-400 disabled:opacity-50 border-none shadow-none"
								aria-label="Previous page"
							>
								&lt;
							</Button>
							{Array.from({ length: totalPages }, (_, i) => (
								<Button
									key={i + 1}
									onClick={() => setCurrentPage(i + 1)}
									className={`rounded-full px-3 py-1 text-xs xs:text-sm sm:text-base font-medium transition-all duration-150
						  focus:outline-none focus:ring-2 focus:ring-blue-400
						  ${currentPage === i + 1 ? 'bg-blue-600 text-white shadow-md' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}
						`}
									aria-label={`Page ${i + 1}`}
								>
									{i + 1}
								</Button>
							))}
							<Button
								onClick={handleNextPage}
								disabled={currentPage === totalPages}
								className="rounded-full px-2 xs:px-3 py-1 text-xs xs:text-sm sm:text-base font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 focus:ring-2 focus:ring-blue-400 disabled:opacity-50 border-none shadow-none"
								aria-label="Next page"
							>
								&gt;
							</Button>
						</nav>
					</div>
				</>
			)}

			{/* Assign Writer Modal */}
			{dialogOpen && !!selectedOrder && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-300">
					<div className="relative w-full max-w-lg mx-4 sm:mx-0 bg-white rounded-2xl shadow-2xl border border-blue-100 p-0 animate-fade-in-up">
						{/* Modal Header */}
						<div className="flex items-center justify-between px-6 py-4 border-b border-blue-100 rounded-t-2xl bg-gradient-to-r from-blue-50 to-blue-100">
							<h3 className="text-lg sm:text-xl font-bold text-blue-900">
								Assign Writer to Order
							</h3>
							<button
								className="text-2xl text-blue-400 hover:text-blue-700 font-bold focus:outline-none transition-colors"
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
								<span className="block text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">Order</span>
								<span className="block text-base font-medium text-blue-900 truncate">{selectedOrder.title}</span>
							</div>
							{/* Writers List */}
							{writersLoading ? (
								<div className="flex items-center justify-center py-8 text-blue-700">
									<svg className="animate-spin h-6 w-6 mr-2 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
									Loading writers...
								</div>
							) : writersError ? (
								<div className="text-center py-6 text-red-600 font-medium">{writersError}</div>
							) : (
								<ul className="divide-y divide-blue-100 max-h-64 overflow-y-auto">
									{writers.length === 0 ? (
										<li className="py-4 text-center text-gray-400">No writers found.</li>
									) : (
										writers.map(writer => (
											<li key={writer.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-3 px-1 hover:bg-blue-50 rounded-lg transition-colors">
												<div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
													<span className="text-base font-semibold text-blue-900">{writer.username}</span>
													<span className="text-sm text-gray-700">{writer.first_name} {writer.last_name}</span>
													<span className="text-xs text-gray-500">{writer.email || writer.id}</span>
												</div>
												<button
													className="mt-2 sm:mt-0 px-4 py-1.5 bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white text-xs font-semibold rounded-lg shadow transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
															alert(err.message || 'Failed to assign writer');
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
		</Card>
	);
};

export default OrdersManagement;
