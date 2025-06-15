import React, { useEffect, useState } from "react";
import { Card } from "../../components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";
import { useAuth } from "../auth/AuthProvider";
import Loader from '../../components/ui/Loader';

const ROLES = [
	{ key: "user", label: "User" },
	{ key: "admin", label: "Admin" },
	{ key: "super_admin", label: "Super Admin" },
	{ key: "writer", label: "Writer" },
];

const PAGE_SIZE = 10;

const UsersManagement = () => {
	const { api } = useAuth();
	const [activeRole, setActiveRole] = useState("user");
	const [currentPage, setCurrentPage] = useState(1);
	const [users, setUsers] = useState([]);
	const [total, setTotal] = useState(0);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		setLoading(true);
		setError("");
		api.getUsersByRole(activeRole, currentPage, PAGE_SIZE)
			.then((res) => {
				setUsers(res.users || []);
				setTotal(res.total || 0);
			})
			.catch((err) => setError(err.message || "Failed to fetch users"))
			.finally(() => setLoading(false));
	}, [api, activeRole, currentPage]);

	const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

	const handlePrevPage = () => setCurrentPage((p) => Math.max(1, p - 1));
	const handleNextPage = () => setCurrentPage((p) => Math.min(totalPages, p + 1));
	const handleTabChange = (role) => {
		setActiveRole(role);
		setCurrentPage(1);
	};

	return (
		<Card className="m-1 xs:m-2 sm:m-4 p-1 xs:p-2 sm:p-6 shadow-lg border-0">
			{loading && <Loader />}
			<h2 className="text-base xs:text-lg sm:text-xl font-semibold mb-2 xs:mb-4 text-blue-900">
				Users Management
			</h2>
			<Tabs
				value={activeRole}
				onValueChange={handleTabChange}
				className="mb-4 xs:mb-6"
			>
				<TabsList className="flex w-full justify-center gap-1 xs:gap-2 bg-white/90 rounded-xl shadow border border-blue-100 p-1 xs:p-2">
					{ROLES.map((role) => (
						<TabsTrigger
							key={role.key}
							value={role.key}
							className={`capitalize px-3 xs:px-6 py-1 xs:py-2 rounded-lg text-xs xs:text-base font-semibold transition-all duration-150
          focus:outline-none focus:ring-2 focus:ring-blue-400
          data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-400 data-[state=active]:text-white data-[state=active]:shadow-lg
          data-[state=inactive]:bg-blue-50 data-[state=inactive]:text-blue-900 data-[state=inactive]:hover:bg-blue-100
        `}
							data-state={activeRole === role.key ? "active" : "inactive"}
						>
							{role.label}
						</TabsTrigger>
					))}
				</TabsList>
				{ROLES.map((role) => (
					<TabsContent key={role.key} value={role.key}>
						{loading ? (
							<div className="text-center py-8 text-blue-700">Loading users...</div>
						) : error ? (
							<div className="text-center py-8 text-red-600">{error}</div>
						) : (
							<>
								<div className="overflow-x-auto rounded-lg">
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>Email</TableHead>
												<TableHead>Username</TableHead>
												<TableHead>First Name</TableHead>
												<TableHead>Last Name</TableHead>
												<TableHead>Roles</TableHead>
												<TableHead>Actions</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{users.length > 0 ? (
												users.map((user) => (
													<TableRow key={user.id} className="hover:bg-blue-50">
														<TableCell className="max-w-[120px] truncate text-xs xs:text-sm sm:text-base">{user.email}</TableCell>
														<TableCell className="text-xs xs:text-sm sm:text-base">{user.username}</TableCell>
														<TableCell className="text-xs xs:text-sm sm:text-base">{user.first_name}</TableCell>
														<TableCell className="text-xs xs:text-sm sm:text-base">{user.last_name}</TableCell>
														<TableCell>
															<span className="inline-block px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs font-semibold">
																{user.roles.join(", ")}
															</span>
														</TableCell>
														<TableCell>
															<Button
																variant="destructive"
																disabled
																className="w-full sm:w-auto text-xs xs:text-sm sm:text-base"
															>
																Delete (Disabled)
															</Button>
														</TableCell>
													</TableRow>
												))
											) : (
												<TableRow>
													<TableCell
														colSpan={6}
														className="text-center text-xs xs:text-sm sm:text-base"
													>
														No users found.
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
												className={`rounded-full px-2 xs:px-3 py-1 text-xs xs:text-sm sm:text-base font-semibold mx-0.5 border-none shadow-none transition-colors
                          ${currentPage === i + 1
													? 'bg-blue-700 text-white ring-2 ring-blue-400'
													: 'bg-transparent text-blue-700 hover:bg-blue-100'}
                        `}
												aria-current={currentPage === i + 1 ? 'page' : undefined}
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
									<span className="text-xs xs:text-sm sm:text-base text-gray-600">
										Page {currentPage} of {totalPages}
									</span>
								</div>
							</>
						)}
					</TabsContent>
				))}
			</Tabs>
		</Card>
	);
};

export default UsersManagement;
