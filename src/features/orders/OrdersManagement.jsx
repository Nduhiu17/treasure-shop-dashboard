import React, { useEffect, useState } from "react";
import { Card } from "../../components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";
import { useAuth } from "../auth/AuthProvider";
import Loader from '../../components/ui/Loader';

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
	const { api } = useAuth();
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
		// Fetch writers from backend
		const jwt = localStorage.getItem('jwt_token');
		fetch("http://localhost:8080/api/admin/users?role=writer", {
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

	return (
		<Card className="m-1 xs:m-2 sm:m-4 p-1 xs:p-2 sm:p-6 shadow-lg border-0">
			{loading && <Loader />}
			<h2 className="text-base xs:text-lg sm:text-xl font-semibold mb-2 xs:mb-4 text-blue-900">All Orders</h2>
			<Tabs value={activeStatus} onValueChange={handleTabChange} className="mb-4 xs:mb-6">
				<TabsList className="flex w-full overflow-x-auto gap-1 xs:gap-2 bg-white/90 rounded-xl shadow border border-blue-100 p-1 xs:p-2">
					{ORDER_STATUSES.map((status) => (
						<TabsTrigger
							key={status.key}
							value={status.key}
							className={`capitalize px-3 xs:px-6 py-1 xs:py-2 rounded-lg text-xs xs:text-base font-semibold transition-all duration-150
                focus:outline-none focus:ring-2 focus:ring-blue-400
                data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-400 data-[state=active]:text-white data-[state=active]:shadow-lg
                data-[state=inactive]:bg-blue-50 data-[state=inactive]:text-blue-900 data-[state=inactive]:hover:bg-blue-100
              `}
							data-state={activeStatus === status.key ? "active" : "inactive"}
						>
							{status.label}
						</TabsTrigger>
					))}
				</TabsList>
				{ORDER_STATUSES.map((status) => (
					<TabsContent key={status.key} value={status.key}>
						{loading ? (
							<div className="text-center py-8 text-blue-700">Loading orders...</div>
						) : error ? (
							<div className="text-center py-8 text-red-600">{error}</div>
						) : (
							<>
								<div className="overflow-x-auto rounded-lg">
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>Title</TableHead>
												<TableHead>User ID</TableHead>
												<TableHead>Status</TableHead>
												<TableHead>Writer ID</TableHead>
												<TableHead>Price</TableHead>
												<TableHead>Actions</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{orders.length > 0 ? (
												orders.map((order) => (
													<TableRow key={order.id} className="hover:bg-blue-50">
														<TableCell className="max-w-[120px] truncate text-xs xs:text-sm sm:text-base">{order.title}</TableCell>
														<TableCell className="text-xs xs:text-sm sm:text-base">{order.user_id?.slice(-6)}</TableCell>
														<TableCell>
															<span className={`px-2 py-1 rounded text-xs font-semibold ${order.status === 'approved' ? 'bg-green-100 text-green-700' : order.status === 'feedback' ? 'bg-yellow-100 text-yellow-700' : order.status === 'pending_payment' ? 'bg-red-100 text-red-700' : order.status === 'paid' ? 'bg-blue-100 text-blue-700' : order.status === 'awaiting_assignment' ? 'bg-gray-100 text-gray-700' : order.status === 'assigned' ? 'bg-purple-100 text-purple-700' : order.status === 'in_progress' ? 'bg-orange-100 text-orange-700' : order.status === 'submitted_for_review' ? 'bg-cyan-100 text-cyan-700' : order.status === 'completed' ? 'bg-green-200 text-green-900' : 'bg-gray-100 text-gray-700'}`}>{order.status}</span>
														</TableCell>
														<TableCell className="text-xs xs:text-sm sm:text-base">{order.writer_id ? order.writer_id.slice(-6) : 'Unassigned'}</TableCell>
														<TableCell className="text-xs xs:text-sm sm:text-base">${order.price?.toFixed(2)}</TableCell>
														<TableCell>
															<Button onClick={() => handleAssignClick(order)} disabled={!(order.status === 'paid' || order.status === 'feedback' || order.status === 'awaiting_assignment')} className="w-full sm:w-auto text-xs xs:text-sm sm:text-base">
																Assign Writer
															</Button>
														</TableCell>
													</TableRow>
												))
											) : (
												<TableRow>
													<TableCell colSpan={6} className="text-center text-xs xs:text-sm sm:text-base">No orders found.</TableCell>
												</TableRow>
											)}
										</TableBody>
									</Table>
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
					</TabsContent>
				))}
			</Tabs>

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
															const res = await fetch(`http://localhost:8080/api/admin/orders/${selectedOrder.id}/assign`, {
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
		</Card>
	);
};

export default OrdersManagement;
