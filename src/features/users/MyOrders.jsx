import React, { useEffect, useState } from "react";
import { Card } from "../../components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "../../components/ui/table";
import Loader from "../../components/ui/Loader";
import { useAuth } from "../auth/AuthProvider";
import { Button } from "../../components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";

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
			<Card className="p-1 xs:p-2 sm:p-6 shadow-lg border-0">
				<h2 className="text-base xs:text-lg sm:text-xl font-semibold mb-2 xs:mb-4 text-blue-900">
					My Orders
				</h2>
				<Tabs
					value={activeStatus}
					onValueChange={setActiveStatus}
					className="mb-4 xs:mb-6"
				>
					<TabsList className="flex w-full overflow-x-auto gap-1 xs:gap-2 bg-white/90 rounded-xl shadow border border-blue-100 p-1 xs:p-2">
						{ORDER_STATUSES.map((status) => (
							<TabsTrigger
								key={status.key}
								value={status.key}
								className={`capitalize px-3 xs:px-6 py-1 xs:py-2 rounded-lg text-xs xs:text-base font-semibold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-400 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=inactive]:bg-blue-50 data-[state=inactive]:text-blue-900 data-[state=inactive]:hover:bg-blue-100`}
								data-state={activeStatus === status.key ? "active" : "inactive"}
							>
								{status.label}
							</TabsTrigger>
						))}
					</TabsList>
					{ORDER_STATUSES.map((status) => (
						<TabsContent key={status.key} value={status.key}>
							{loading ? (
								<div className="text-center py-8 text-blue-700">
									<Loader />
								</div>
							) : error ? (
								<div className="text-center py-8 text-red-600">{error}</div>
							) : (
								<>
									<div className="overflow-x-auto rounded-lg">
										<Table>
											<TableHeader>
												<TableRow>
													<TableHead>Title</TableHead>
													<TableHead>Status</TableHead>
													<TableHead>Writer</TableHead>
													<TableHead>Price</TableHead>
													<TableHead>Actions</TableHead>
												</TableRow>
											</TableHeader>
											<TableBody>
												{orders.length > 0 ? (
													orders.map((order) => (
														<TableRow key={order.id} className="hover:bg-blue-50">
															<TableCell className="max-w-[120px] truncate text-xs xs:text-sm sm:text-base">
																{order.title}
															</TableCell>
															<TableCell>
																<span
																	className={`px-2 py-1 rounded text-xs font-semibold ${
																		order.status === "approved"
																			? "bg-green-100 text-green-700"
																			: order.status === "feedback"
																			? "bg-yellow-100 text-yellow-700"
																			: order.status === "pending_payment"
																			? "bg-red-100 text-red-700"
																			: order.status === "paid"
																			? "bg-blue-100 text-blue-700"
																			: order.status === "awaiting_assignment"
																			? "bg-gray-100 text-gray-700"
																			: order.status === "assigned"
																			? "bg-purple-100 text-purple-700"
																			: order.status === "in_progress"
																			? "bg-orange-100 text-orange-700"
																			: order.status === "submitted_for_review"
																			? "bg-cyan-100 text-cyan-700"
																			: order.status === "completed"
																			? "bg-green-200 text-green-900"
																			: "bg-gray-100 text-gray-700"
																	}`}
																>
																	{order.status}
																</span>
															</TableCell>
															<TableCell className="text-xs xs:text-sm sm:text-base">
																{order.writer_id
																	? order.writer_id.slice(-6)
																	: "Unassigned"}
															</TableCell>
															<TableCell className="text-xs xs:text-sm sm:text-base">
																${order.price?.toFixed(2)}
															</TableCell>
															<TableCell>
																{/* Writer actions based on order status */}
																{order.status === "pending_payment" ? (
																	<button
																		className="flex items-center gap-2 px-3 py-1 rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold shadow hover:from-blue-600 hover:to-blue-800 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400"
																		onClick={() => alert('Redirect to payment flow here.')}
																	>
																		<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
																		<span>Make Payment</span>
																	</button>
																) : user.roles.includes("writer") ? (
																	order.status === "awaiting_asign_acceptance" ? (
																		<div className="flex gap-2">
																			<button
																				className="px-3 py-1 rounded-lg bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold shadow hover:from-green-600 hover:to-green-800 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-green-400"
																				onClick={async () => {
																					const jwt = localStorage.getItem("jwt_token");
																					try {
																						const res = await fetch(
																							`http://localhost:8080/api/writer/orders/${order.id}/assignment-response`,
																							{
																								method: "PUT",
																								headers: {
																									"Content-Type": "application/json",
																									Authorization: jwt ? `Bearer ${jwt}` : "",
																								},
																								body: JSON.stringify({ accept: true }),
																							}
																						);
																						if (!res.ok) throw new Error("Failed to accept assignment");
																						setLoading(true);
																						setCurrentPage(1);
																					} catch (err) {
																						alert(err.message || "Failed to accept assignment");
																					}
																				}}
																			>
																				Accept
																			</button>
																			<button
																				className="px-3 py-1 rounded-lg bg-gradient-to-r from-red-500 to-red-700 text-white font-semibold shadow hover:from-red-600 hover:to-red-800 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-red-400"
																				onClick={async () => {
																					const jwt = localStorage.getItem("jwt_token");
																					try {
																						const res = await fetch(
																							`http://localhost:8080/api/writer/orders/${order.id}/assignment-response`,
																							{
																								method: "PUT",
																								headers: {
																									"Content-Type": "application/json",
																									Authorization: jwt ? `Bearer ${jwt}` : "",
																								},
																								body: JSON.stringify({ accept: false }),
																							}
																						);
																						if (!res.ok) throw new Error("Failed to decline assignment");
																						setLoading(true);
																						setCurrentPage(1);
																					} catch (err) {
																						alert(err.message || "Failed to decline assignment");
																					}
																				}}
																			>
																				Decline
																			</button>
																		</div>
																	) : order.status === "assigned" ? (
																		<button
																			className="px-3 py-1 rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold shadow hover:from-blue-600 hover:to-blue-800 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400"
																			onClick={async () => {
																				const jwt = localStorage.getItem("jwt_token");
																				try {
																					const res = await fetch(
																						`http://localhost:8080/api/writer/orders/${order.id}/submit`,
																						{
																							method: "POST",
																							headers: {
																								"Content-Type": "application/json",
																								Authorization: jwt ? `Bearer ${jwt}` : "",
																							},
																							body: JSON.stringify({ content: "submission content" }),
																						}
																					);
																					if (!res.ok) throw new Error("Failed to submit order");
																					setLoading(true);
																					setCurrentPage(1);
																				} catch (err) {
																					alert(err.message || "Failed to submit order");
																				}
																			}}
																		>
																			Submit
																		</button>
																	) : order.status === "feedback" ? (
																		<button
																			className="px-3 py-1 rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-semibold shadow cursor-not-allowed opacity-70"
																			disabled
																			onClick={() => alert("Order was resubmitted for rework.")}
																		>
																			Rework Required
																		</button>
																	) : order.status === "approved" ? (
																		<button
																			className="px-3 py-1 rounded-lg bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold shadow cursor-not-allowed opacity-70"
																			disabled
																		>
																			Completed
																		</button>
																	) : order.status === "submitted_for_review" ? (
																		<button
																			className="px-3 py-1 rounded-lg bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold shadow cursor-not-allowed opacity-80"
																			disabled
																		>
																			Awaiting Approval
																		</button>
																	) : null
																) : user.roles.length === 1 && user.roles[0] === "user" ? (
																	order.status === "awaiting_asign_acceptance" ? (
																		<button
																			className="px-3 py-1 rounded-lg bg-gradient-to-r from-blue-400 to-blue-700 text-white font-semibold shadow cursor-not-allowed opacity-80"
																			disabled
																		>
																			Awaiting Writer Assignment
																		</button>
																	) : order.status === "assigned" ? (
																		<button
																			className="px-3 py-1 rounded-lg bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold shadow cursor-not-allowed opacity-80"
																			disabled
																		>
																			Order being worked on
																		</button>
																	) : order.status === "submitted_for_review" ? (
																		<div className="flex gap-2">
																			<button
																				className="px-3 py-1 rounded-lg bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold shadow hover:from-green-600 hover:to-green-800 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-green-400"
																				onClick={async () => {
																					const jwt = localStorage.getItem("jwt_token");
																					try {
																						const res = await fetch(
																							`http://localhost:8080/api/orders/${order.id}/review/approve`,
																							{
																								method: "PUT",
																								headers: {
																									"Content-Type": "application/json",
																									Authorization: jwt ? `Bearer ${jwt}` : "",
																								},
																							}
																						);
																						if (!res.ok) throw new Error("Failed to approve order");
																						setLoading(true);
																						setCurrentPage(1);
																					} catch (err) {
																						alert(err.message || "Failed to approve order");
																					}
																				}}
																			>
																				Approve
																			</button>
																			<button
																				className="px-3 py-1 rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-semibold shadow hover:from-yellow-500 hover:to-yellow-700 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-yellow-400"
																				onClick={async () => {
																					const jwt = localStorage.getItem("jwt_token");
																					try {
																						const res = await fetch(
																							`http://localhost:8080/api/orders/${order.id}/review/feedback`,
																							{
																								method: "PUT",
																								headers: {
																									"Content-Type": "application/json",
																									Authorization: jwt ? `Bearer ${jwt}` : "",
																								},
																								body: JSON.stringify({ feedback: "Please review this order." }),
																							}
																						);
																						if (!res.ok) throw new Error("Failed to request review");
																						setLoading(true);
																						setCurrentPage(1);
																					} catch (err) {
																						alert(err.message || "Failed to request review");
																					}
																				}}
																			>
																				Request Review
																			</button>
																		</div>
																	) : order.status === "feedback" ? (
																		<button
																			className="px-3 py-1 rounded-lg bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold shadow cursor-not-allowed opacity-80"
																			disabled
																		>
																			Applying Feedback
																		</button>
																	) : order.status === "approved" ? (
																		<button
																			className="px-3 py-1 rounded-lg bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold shadow cursor-not-allowed opacity-80"
																			disabled
																		>
																			Completed
																		</button>
																	) : (
																		<span className="text-blue-700 font-semibold">View</span>
																	)
																) : null}
															</TableCell>
														</TableRow>
													))
												) : (
													<TableRow>
														<TableCell colSpan={5} className="text-center text-xs xs:text-sm sm:text-base">
															No orders found.
														</TableCell>
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
													className={`rounded-full px-3 py-1 text-xs xs:text-sm sm:text-base font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
														currentPage === i + 1
															? "bg-blue-600 text-white shadow-md"
															: "bg-blue-100 text-blue-700 hover:bg-blue-200"
													}`}
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
			</Card>
		</div>
	);
};

export default MyOrders;
