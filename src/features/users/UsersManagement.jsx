import React, { useState } from "react";
import { Card } from "../../components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";

const ROLES = [
	{ key: "user", label: "User" },
	{ key: "admin", label: "Admin" },
	{ key: "super_admin", label: "Super Admin" },
	{ key: "writer", label: "Writer" },
];

// Hardcoded users data
const HARDCODED_USERS = [
	// Users
	{ id: "u1", email: "user1@example.com", username: "user1", first_name: "User", last_name: "One", roles: ["user"] },
	{ id: "u2", email: "user2@example.com", username: "user2", first_name: "User", last_name: "Two", roles: ["user"] },
	{ id: "u3", email: "user3@example.com", username: "user3", first_name: "User", last_name: "Three", roles: ["user"] },
	{ id: "u4", email: "user4@example.com", username: "user4", first_name: "User", last_name: "Four", roles: ["user"] },
	{ id: "u5", email: "user5@example.com", username: "user5", first_name: "User", last_name: "Five", roles: ["user"] },
	{ id: "u6", email: "user6@example.com", username: "user6", first_name: "User", last_name: "Six", roles: ["user"] },
	{ id: "u7", email: "user7@example.com", username: "user7", first_name: "User", last_name: "Seven", roles: ["user"] },
	{ id: "u8", email: "user8@example.com", username: "user8", first_name: "User", last_name: "Eight", roles: ["user"] },
	{ id: "u9", email: "user9@example.com", username: "user9", first_name: "User", last_name: "Nine", roles: ["user"] },
	{ id: "u10", email: "user10@example.com", username: "user10", first_name: "User", last_name: "Ten", roles: ["user"] },
	{ id: "u11", email: "user11@example.com", username: "user11", first_name: "User", last_name: "Eleven", roles: ["user"] },
	{ id: "u12", email: "user12@example.com", username: "user12", first_name: "User", last_name: "Twelve", roles: ["user"] },
	// Admins
	{ id: "a1", email: "admin1@example.com", username: "admin1", first_name: "Alice", last_name: "Admin", roles: ["admin"] },
	{ id: "a2", email: "admin2@example.com", username: "admin2", first_name: "Bob", last_name: "Admin", roles: ["admin"] },
	{ id: "a3", email: "admin3@example.com", username: "admin3", first_name: "Carol", last_name: "Admin", roles: ["admin"] },
	// Super Admins
	{ id: "s1", email: "superadmin1@example.com", username: "superadmin1", first_name: "Sam", last_name: "Superadmin", roles: ["super_admin"] },
	{ id: "s2", email: "superadmin2@example.com", username: "superadmin2", first_name: "Sue", last_name: "Superadmin", roles: ["super_admin"] },
	// Writers
	{ id: "w1", email: "writer1@example.com", username: "writer1", first_name: "Will", last_name: "Writer", roles: ["writer"] },
	{ id: "w2", email: "writer2@example.com", username: "writer2", first_name: "Wendy", last_name: "Writer", roles: ["writer"] },
	{ id: "w3", email: "writer3@example.com", username: "writer3", first_name: "Walt", last_name: "Writer", roles: ["writer"] },
	// Mixed roles
	{ id: "mix1", email: "nduhiu1@gmail.com", username: "nduhi1", first_name: "Cheche", last_name: "Marley", roles: ["user"] },
	{ id: "mix2", email: "nduhiu@gmail.com", username: "nduhiu", first_name: "Cheche", last_name: "Marley", roles: ["super_admin", "user", "writer"] },
];

const PAGE_SIZE = 10;

const UsersManagement = () => {
	const [activeRole, setActiveRole] = useState("user");
	const [currentPage, setCurrentPage] = useState(1);

	// Filter users by role
	const filteredUsers = HARDCODED_USERS.filter((user) =>
		user.roles.includes(activeRole)
	);
	const totalUsers = filteredUsers.length;
	const totalPages = Math.max(1, Math.ceil(totalUsers / PAGE_SIZE));
	const paginatedUsers = filteredUsers.slice(
		(currentPage - 1) * PAGE_SIZE,
		currentPage * PAGE_SIZE
	);

	// Pagination handlers
	const handlePrevPage = () => setCurrentPage((p) => Math.max(1, p - 1));
	const handleNextPage = () => setCurrentPage((p) => Math.min(totalPages, p + 1));
	const handleTabChange = (role) => {
		setActiveRole(role);
		setCurrentPage(1);
	};

	return (
		<Card className="m-1 xs:m-2 sm:m-4 p-1 xs:p-2 sm:p-6 shadow-lg border-0">
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
									{paginatedUsers.length > 0 ? (
										paginatedUsers.map((user) => (
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
					</TabsContent>
				))}
			</Tabs>
		</Card>
	);
};

export default UsersManagement;
