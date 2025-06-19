import React, { useEffect, useState } from "react";
import { Card } from "../../components/ui/card";
import Loader from "../../components/ui/Loader";
import { useAuth } from "../auth/AuthProvider";
import { Button } from "../../components/ui/button";
import { Select } from "../../components/ui/select";
import CreateOrder from "../orders/CreateOrder";
import { Dialog } from "../../components/ui/dialog";

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
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [total, setTotal] = useState(0);
	const [activeStatus, setActiveStatus] = useState("pending_payment");
	const [createOrderModalOpen, setCreateOrderModalOpen] = useState(false);
	const PAGE_SIZE = 10;

	useEffect(() => {
		if (!user) return;
		setLoading(true);
		setError("");
		const jwt = localStorage.getItem("jwt_token");
		const roles = user.roles || [];
		let url = `http://localhost:8080/api/admin/orders?page=${currentPage}&page_size=${PAGE_SIZE}`;
		if (roles.includes("super_admin") || roles.includes("admin")) {
			if (activeStatus) {
				url += `&status=${activeStatus}`;
			}
		} else if (roles.includes("writer")) {
			url = `http://localhost:8080/api/writer/orders/${user.id}?page=${currentPage}&page_size=${PAGE_SIZE}`;
			if (activeStatus) {
				url += `&status=${activeStatus}`;
			}
		} else if (roles.length === 1 && roles[0] === "user") {
			url = `http://localhost:8080/api/orders/me?page=${currentPage}&page_size=${PAGE_SIZE}`;
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

	if (!user) {
		return (
			<div className="flex justify-center items-center min-h-[40vh]">
				<Loader />
			</div>
		);
	}

	return (
		<div className="m-1 xs:m-2 sm:m-4 p-1 xs:p-2 sm:p-6 max-w-5xl mx-auto">
			<Card className="m-1 xs:m-2 sm:m-4 p-1 xs:p-2 sm:p-6 shadow-lg border-0 w-full max-w-none">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
					<h2 className="text-base xs:text-lg sm:text-xl font-semibold text-blue-900">My Orders</h2>
					<Button
						className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white font-bold shadow hover:from-green-600 hover:to-green-700 transition-all duration-150"
						onClick={() => setCreateOrderModalOpen(true)}
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
						<div className="rounded-2xl border border-blue-100 bg-white/90 shadow-lg w-full min-h-[320px]" style={{ height: '60vh' }}>
							<div className="overflow-x-auto h-full">
								<table className="w-full min-w-[1200px] text-xs xs:text-sm sm:text-base h-full">
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
														{/* Actions: You can add user-specific actions here if needed */}
														<span className="text-blue-700 font-semibold">View</span>
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
					</>
				)}
			</Card>
			<Dialog isOpen={createOrderModalOpen} onClose={() => setCreateOrderModalOpen(false)} title="Create Order">
				<CreateOrder />
			</Dialog>
		</div>
	);
};

export default MyOrders;
