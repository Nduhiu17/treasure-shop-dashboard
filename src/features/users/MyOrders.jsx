import React, { useEffect, useState } from "react";
import { Card } from "../../components/ui/card";
import Loader from "../../components/ui/Loader";
import { useAuth } from "../auth/AuthProvider";
import { Button } from "../../components/ui/button";
import { Select } from "../../components/ui/select";
import CreateOrder from "../orders/CreateOrder";
import { WideDialog } from "../../components/ui/wide-dialog";
import PayPalModal from "../orders/PayPalModal";
import AssignmentResponseButtons from "../../components/ui/AssignmentResponseButtons";
import { useToast } from "../../components/ui/toast";
import OrderSubmitDialog from "../../components/ui/OrderSubmitDialog";
import OrderSubmissionsDialog from "../../components/ui/OrderSubmissionsDialog";
import { useNavigate } from "react-router-dom";

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

const MyOrders = () => {
	const { user } = useAuth();
	const { showToast } = useToast();
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [total, setTotal] = useState(0);
	const [activeStatus, setActiveStatus] = useState("pending_payment");
	const [createOrderModalOpen, setCreateOrderModalOpen] = useState(false);
	const [payPalModalOpen, setPayPalModalOpen] = useState(false);
	const [payPalOrderId, setPayPalOrderId] = useState(null);
	const [payPalAmount, setPayPalAmount] = useState(null);
	const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
	const [submitOrderId, setSubmitOrderId] = useState(null);
	const [submissionsDialogOpen, setSubmissionsDialogOpen] = useState(false);
	const [submissionsOrderId, setSubmissionsOrderId] = useState(null);
	const PAGE_SIZE = 10;
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
				setLoading(false);
			})
			.catch((err) => {
				setError("Failed to fetch orders");
				setLoading(false);
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user && user.id, user && JSON.stringify(user.roles), currentPage, activeStatus]);

	const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
	const handlePrevPage = () => setCurrentPage((p) => Math.max(1, p - 1));
	const handleNextPage = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

	const handleOrderButton = (e) => {
		e?.preventDefault?.();
		setCreateOrderModalOpen(true);
	};

	const handleOrderCreated = (orderId, amount) => {
		setCreateOrderModalOpen(false);
		setTimeout(() => {
			setPayPalOrderId(orderId);
			setPayPalAmount(amount);
			setPayPalModalOpen(true);
		}, 300);
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
				<h2 className="text-base xs:text-lg sm:text-xl font-semibold text-blue-900">My Orders</h2>
				<Button
					className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white font-bold shadow hover:from-green-600 hover:to-green-700 transition-all duration-150"
					onClick={handleOrderButton}
				>
					+ Create Order
				</Button>
			</div>
			<div className="w-full sm:w-64 mb-4 xs:mb-6">
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
			{loading ? (
				<div className="text-center py-8 text-blue-700">
					<Loader />
				</div>
			) : error ? (
				<div className="text-center py-8 text-red-600">{error}</div>
			) : (
				<>
					{/* Mobile Card View */}
					<div className="block md:hidden space-y-4">
						{orders.length > 0 ? orders.map(order => (
							<div key={order.id} className="rounded-xl border border-blue-100 bg-white/90 shadow p-4 flex flex-col gap-2">
								<div className="flex justify-between items-center mb-1">
									<span className="font-bold text-blue-900 text-base truncate">{order.title}</span>
									<span className={`px-2 py-1 rounded text-xs font-semibold ${order.status === 'approved' ? 'bg-green-100 text-green-700' : order.status === 'feedback' ? 'bg-yellow-100 text-yellow-700' : order.status === 'pending_payment' ? 'bg-red-100 text-red-700' : order.status === 'paid' ? 'bg-blue-100 text-blue-700' : order.status === 'awaiting_assignment' ? 'bg-gray-100 text-gray-700' : order.status === 'assigned' ? 'bg-purple-100 text-purple-700' : order.status === 'in_progress' ? 'bg-orange-100 text-orange-700' : order.status === 'submitted_for_review' ? 'bg-cyan-100 text-cyan-700' : order.status === 'completed' ? 'bg-green-200 text-green-900' : 'bg-gray-100 text-gray-700'}`}>{order.status}</span>
								</div>
								<div className="text-xs text-blue-800 truncate mb-1">{order.description}</div>
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
										<a href={order.original_order_file} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center p-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow hover:from-blue-600 hover:to-blue-800 transition-all duration-150 border border-blue-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400" title="Open file in new tab">
											<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
												<path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
											</svg>
										</a>
									) : (
										<span className="text-gray-400 italic">No file</span>
									)}
									<span className="text-blue-700 font-semibold">View</span>
								</div>
							</div>
						)) : <div className="text-center text-xs xs:text-sm sm:text-base">No orders found.</div>}
					</div>
					{/* Desktop Table View */}
					<div className="hidden md:block rounded-2xl border border-blue-100 bg-white/90 shadow-lg w-full min-h-[320px]" style={{ height: '60vh' }}>
						<div className="overflow-x-auto h-full">
							<div style={{ maxHeight: 'calc(60vh - 56px)', overflowY: 'auto' }}>
								<table className="w-full min-w-[1200px] text-xs xs:text-sm sm:text-base">
									<thead className="sticky top-0 z-20 bg-gradient-to-r from-blue-50 via-blue-100 to-cyan-100/80 shadow-md border-b-2 border-blue-200">
										<tr>
											<th className="px-4 py-3 text-left font-extrabold text-blue-900 text-xs xs:text-sm sm:text-base tracking-wide uppercase bg-opacity-90 backdrop-blur-md border-r border-blue-100 last:border-r-0 whitespace-nowrap shadow-sm" style={{ letterSpacing: '0.04em', background: 'rgba(255,255,255,0.85)' }}>
												<span className="flex items-center gap-1">Title</span>
											</th>
											<th className="px-4 py-3 text-left font-extrabold text-blue-900 text-xs xs:text-sm sm:text-base tracking-wide uppercase bg-opacity-90 backdrop-blur-md border-r border-blue-100 last:border-r-0 whitespace-nowrap shadow-sm" style={{ letterSpacing: '0.04em', background: 'rgba(236,245,255,0.85)' }}>
												<span className="flex items-center gap-1">Description</span>
											</th>
											<th className="px-4 py-3 text-left font-extrabold text-blue-900 text-xs xs:text-sm sm:text-base tracking-wide uppercase bg-opacity-90 backdrop-blur-md border-r border-blue-100 last:border-r-0 whitespace-nowrap shadow-sm" style={{ letterSpacing: '0.04em', background: 'rgba(255,255,255,0.85)' }}>
												<span className="flex items-center gap-1">Status</span>
											</th>
											<th className="px-4 py-3 text-left font-extrabold text-blue-900 text-xs xs:text-sm sm:text-base tracking-wide uppercase bg-opacity-90 backdrop-blur-md border-r border-blue-100 last:border-r-0 whitespace-nowrap shadow-sm" style={{ letterSpacing: '0.04em', background: 'rgba(236,245,255,0.85)' }}>
												<span className="flex items-center gap-1">Writer Username</span>
											</th>
											<th className="px-4 py-3 text-left font-extrabold text-blue-900 text-xs xs:text-sm sm:text-base tracking-wide uppercase bg-opacity-90 backdrop-blur-md border-r border-blue-100 last:border-r-0 whitespace-nowrap shadow-sm" style={{ letterSpacing: '0.04em', background: 'rgba(255,255,255,0.85)' }}>
												<span className="flex items-center gap-1">Level</span>
											</th>
											<th className="px-4 py-3 text-left font-extrabold text-blue-900 text-xs xs:text-sm sm:text-base tracking-wide uppercase bg-opacity-90 backdrop-blur-md border-r border-blue-100 last:border-r-0 whitespace-nowrap shadow-sm" style={{ letterSpacing: '0.04em', background: 'rgba(236,245,255,0.85)' }}>
												<span className="flex items-center gap-1">Pages</span>
											</th>
											<th className="px-4 py-3 text-left font-extrabold text-blue-900 text-xs xs:text-sm sm:text-base tracking-wide uppercase bg-opacity-90 backdrop-blur-md border-r border-blue-100 last:border-r-0 whitespace-nowrap shadow-sm" style={{ letterSpacing: '0.04em', background: 'rgba(255,255,255,0.85)' }}>
												<span className="flex items-center gap-1">Urgency</span>
											</th>
											<th className="px-4 py-3 text-left font-extrabold text-blue-900 text-xs xs:text-sm sm:text-base tracking-wide uppercase bg-opacity-90 backdrop-blur-md border-r border-blue-100 last:border-r-0 whitespace-nowrap shadow-sm" style={{ letterSpacing: '0.04em', background: 'rgba(236,245,255,0.85)' }}>
												<span className="flex items-center gap-1">Style</span>
											</th>
											<th className="px-4 py-3 text-left font-extrabold text-blue-900 text-xs xs:text-sm sm:text-base tracking-wide uppercase bg-opacity-90 backdrop-blur-md border-r border-blue-100 last:border-r-0 whitespace-nowrap shadow-sm" style={{ letterSpacing: '0.04em', background: 'rgba(255,255,255,0.85)' }}>
												<span className="flex items-center gap-1">Language</span>
											</th>
											<th className="px-4 py-3 text-left font-extrabold text-blue-900 text-xs xs:text-sm sm:text-base tracking-wide uppercase bg-opacity-90 backdrop-blur-md border-r border-blue-100 last:border-r-0 whitespace-nowrap shadow-sm" style={{ letterSpacing: '0.04em', background: 'rgba(236,245,255,0.85)' }}>
												<span className="flex items-center gap-1">Priority</span>
											</th>
											<th className="px-4 py-3 text-left font-extrabold text-blue-900 text-xs xs:text-sm sm:text-base tracking-wide uppercase bg-opacity-90 backdrop-blur-md border-r border-blue-100 last:border-r-0 whitespace-nowrap shadow-sm" style={{ letterSpacing: '0.04em', background: 'rgba(255,255,255,0.85)' }}>
												<span className="flex items-center gap-1">Plagiarism</span>
											</th>
											<th className="px-4 py-3 text-left font-extrabold text-blue-900 text-xs xs:text-sm sm:text-base tracking-wide uppercase bg-opacity-90 backdrop-blur-md border-r border-blue-100 last:border-r-0 whitespace-nowrap shadow-sm" style={{ letterSpacing: '0.04em', background: 'rgba(236,245,255,0.85)' }}>
												<span className="flex items-center gap-1">Summary</span>
											</th>
											<th className="px-4 py-3 text-left font-extrabold text-blue-900 text-xs xs:text-sm sm:text-base tracking-wide uppercase bg-opacity-90 backdrop-blur-md border-r border-blue-100 last:border-r-0 whitespace-nowrap shadow-sm" style={{ letterSpacing: '0.04em', background: 'rgba(255,255,255,0.85)' }}>
												<span className="flex items-center gap-1">Quality</span>
											</th>
											<th className="px-4 py-3 text-left font-extrabold text-blue-900 text-xs xs:text-sm sm:text-base tracking-wide uppercase bg-opacity-90 backdrop-blur-md border-r border-blue-100 last:border-r-0 whitespace-nowrap shadow-sm" style={{ letterSpacing: '0.04em', background: 'rgba(236,245,255,0.85)' }}>
												<span className="flex items-center gap-1">Draft</span>
											</th>
											<th className="px-4 py-3 text-left font-extrabold text-blue-900 text-xs xs:text-sm sm:text-base tracking-wide uppercase bg-opacity-90 backdrop-blur-md border-r border-blue-100 last:border-r-0 whitespace-nowrap shadow-sm" style={{ letterSpacing: '0.04em', background: 'rgba(255,255,255,0.85)' }}>
												<span className="flex items-center gap-1">SMS</span>
											</th>
											<th className="px-4 py-3 text-left font-extrabold text-blue-900 text-xs xs:text-sm sm:text-base tracking-wide uppercase bg-opacity-90 backdrop-blur-md border-r border-blue-100 last:border-r-0 whitespace-nowrap shadow-sm" style={{ letterSpacing: '0.04em', background: 'rgba(236,245,255,0.85)' }}>
												<span className="flex items-center gap-1">Sources</span>
											</th>
											<th className="px-4 py-3 text-left font-extrabold text-blue-900 text-xs xs:text-sm sm:text-base tracking-wide uppercase bg-opacity-90 backdrop-blur-md border-r border-blue-100 last:border-r-0 whitespace-nowrap shadow-sm" style={{ letterSpacing: '0.04em', background: 'rgba(255,255,255,0.85)' }}>
												<span className="flex items-center gap-1">Top Writer</span>
											</th>
											<th className="px-4 py-3 text-left font-extrabold text-blue-900 text-xs xs:text-sm sm:text-base tracking-wide uppercase bg-opacity-90 backdrop-blur-md border-r border-blue-100 last:border-r-0 whitespace-nowrap shadow-sm" style={{ letterSpacing: '0.04em', background: 'rgba(236,245,255,0.85)' }}>
												<span className="flex items-center gap-1">Price</span>
											</th>
											<th className="px-4 py-3 text-left font-extrabold text-blue-900 text-xs xs:text-sm sm:text-base tracking-wide uppercase bg-opacity-90 backdrop-blur-md border-r border-blue-100 last:border-r-0 whitespace-nowrap shadow-sm" style={{ letterSpacing: '0.04em', background: 'rgba(255,255,255,0.85)' }}>
												<span className="flex items-center gap-1">Order File
													<svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" /></svg>
												</span>
											</th>
											<th className="px-4 py-3 text-left font-extrabold text-blue-900 text-xs xs:text-sm sm:text-base tracking-wide uppercase bg-opacity-90 backdrop-blur-md border-r border-blue-100 last:border-r-0 whitespace-nowrap shadow-sm" style={{ letterSpacing: '0.04em', background: 'rgba(236,245,255,0.85)' }}>
												<span className="flex items-center gap-1">Actions</span>
											</th>
										</tr>
									</thead>
									<tbody>
										{orders.length > 0 ? (
											orders.map((order) => (
												<tr key={order.id} className="hover:bg-blue-50">
													<td className="max-w-[120px] truncate text-xs xs:text-sm sm:text-base px-4 py-2">{order.title}</td>
													<td className="max-w-[200px] truncate text-xs xs:text-sm sm:text-base px-4 py-2">{order.description}</td>
													<td className="px-4 py-2">
														<span className={`px-2 py-1 rounded text-xs font-semibold ${order.status === 'approved' ? 'bg-green-100 text-green-700' : order.status === 'feedback' ? 'bg-yellow-100 text-yellow-700' : order.status === 'pending_payment' ? 'bg-red-100 text-red-700' : order.status === 'paid' ? 'bg-blue-100 text-blue-700' : order.status === 'awaiting_assignment' ? 'bg-gray-100 text-gray-700' : order.status === 'assigned' ? 'bg-purple-100 text-purple-700' : order.status === 'in_progress' ? 'bg-orange-100 text-orange-700' : order.status === 'submitted_for_review' ? 'bg-cyan-100 text-cyan-700' : order.status === 'completed' ? 'bg-green-200 text-green-900' : 'bg-gray-100 text-gray-700'}`}>{order.status}</span>
													</td>
													<td className="text-xs xs:text-sm sm:text-base px-4 py-2">{order.writer_username || '-'}</td>
													<td className="text-xs xs:text-sm sm:text-base px-4 py-2">{order.level_name}</td>
													<td className="max-w-[60px] truncate whitespace-nowrap text-xs xs:text-sm sm:text-base px-4 py-2">{order.order_pages_name}</td>
													<td className="text-xs xs:text-sm sm:text-base px-4 py-2">{order.order_urgency_name}</td>
													<td className="text-xs xs:text-sm sm:text-base px-4 py-2">{order.order_style_name}</td>
													<td className="text-xs xs:text-sm sm:text-base px-4 py-2">{order.order_language_name}</td>
													<td className="text-xs xs:text-sm sm:text-base px-4 py-2">{order.is_high_priority ? 'Yes' : 'No'}</td>
													<td className="text-xs xs:text-sm sm:text-base px-4 py-2">{order.plagarism_report ? 'Yes' : 'No'}</td>
													<td className="text-xs xs:text-sm sm:text-base px-4 py-2">{order.one_page_summary ? 'Yes' : 'No'}</td>
													<td className="text-xs xs:text-sm sm:text-base px-4 py-2">{order.extra_quality_check ? 'Yes' : 'No'}</td>
													<td className="text-xs xs:text-sm sm:text-base px-4 py-2">{order.initial_draft ? 'Yes' : 'No'}</td>
													<td className="text-xs xs:text-sm sm:text-base px-4 py-2">{order.sms_update ? 'Yes' : 'No'}</td>
													<td className="text-xs xs:text-sm sm:text-base px-4 py-2">{order.full_text_copy_sources ? 'Yes' : 'No'}</td>
													<td className="text-xs xs:text-sm sm:text-base px-4 py-2">{order.top_writer ? 'Yes' : 'No'}</td>
													<td className="text-xs xs:text-sm sm:text-base px-4 py-2">${order.price?.toFixed(2)}</td>
													<td className="px-4 py-2">
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
													<td className="px-4 py-2">
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
															<span className="text-blue-700 font-semibold">View</span>
														)}
													</td>
												</tr>
											))
										) : (
											<tr>
												<td colSpan={21} className="text-center text-xs xs:text-sm sm:text-base">No orders found.</td>
											</tr>
										)}
									</tbody>
								</table>
							</div>
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
									className={`rounded-full px-3 py-1 text-xs xs:text-sm sm:text-base font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400 ${currentPage === i + 1 ? 'bg-blue-600 text-white shadow-md' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
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
					<WideDialog isOpen={createOrderModalOpen} onClose={() => setCreateOrderModalOpen(false)} title="Create Order">
						<CreateOrder onClose={() => setCreateOrderModalOpen(false)} onOrderCreated={handleOrderCreated} />
					</WideDialog>
					<PayPalModal
						isOpen={payPalModalOpen}
						onClose={() => setPayPalModalOpen(false)}
						orderId={payPalOrderId}
						amount={payPalAmount}
						onSuccess={() => { setPayPalModalOpen(false); navigate('/my-orders'); }}
					/>
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

export default MyOrders;
