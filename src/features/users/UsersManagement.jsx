import React, { useEffect, useState } from "react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Select } from "../../components/ui/select";
import { useAuth } from "../auth/AuthProvider";
import Loader from '../../components/ui/Loader';
import UsersList from "./UsersList";
import RoleDropdown from '../../components/ui/role-dropdown';
import { useToast } from '../../components/ui/toast';

const ROLES = [
	{ key: "user", label: "User" },
	{ key: "admin", label: "Admin" },
	{ key: "super_admin", label: "Super Admin" },
	{ key: "writer", label: "Writer" },
];

const PAGE_SIZE = 10;

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const UsersManagement = ({ currentSubPage }) => {
	const { api } = useAuth();
	const { showToast } = useToast();
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

	const handleAssignRole = async (userId, role) => {
		try {
			const res = await fetch(`${API_BASE_URL}/api/admin/user-roles/assign`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: localStorage.getItem("jwt_token") ? `Bearer ${localStorage.getItem("jwt_token")}` : ""
				},
				body: JSON.stringify({ user_id: userId, role_id: role.id })
			});
			if (!res.ok) throw new Error("Failed to assign role");
			showToast({ message: `Role '${role.name}' assigned successfully`, type: "success" });
			// After assigning, show users of the assigned role
			setActiveRole(role.name);
			setCurrentPage(1);
		} catch (err) {
			showToast({ message: err.message || "Failed to assign role", type: "error" });
		}
	};

	// Add more subpages as needed in the future
	switch (currentSubPage) {
		case 'users':
		default:
			return (
				<Card className="m-1 xs:m-2 sm:m-4 p-1 xs:p-2 sm:p-6 shadow-lg border-0 w-full max-w-none">
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2 sticky top-0 z-30 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
						<h2 className="text-base xs:text-lg sm:text-xl font-semibold text-blue-900">Users Management</h2>
						<div className="w-full sm:w-64">
							<label htmlFor="user-role-select" className="block text-blue-900 font-semibold mb-1 text-xs xs:text-sm">Filter by Role</label>
							<Select
								id="user-role-select"
								value={activeRole}
								onChange={e => { setActiveRole(e.target.value); setCurrentPage(1); }}
								className="bg-white border-blue-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-blue-900 font-medium shadow-sm transition-all duration-150"
							>
								{ROLES.map(role => (
									<option key={role.key} value={role.key}>{role.label}</option>
								))}
							</Select>
						</div>
					</div>
					{loading ? (
						<div className="text-center py-8 text-blue-700">Loading users...</div>
					) : error ? (
						<div className="text-center py-8 text-red-600">{error}</div>
					) : (
						<>
<div className="rounded-2xl border border-blue-100 bg-white/90 shadow-lg w-full min-h-[320px] overflow-x-auto mt-8 md:mt-12" style={{ height: '60vh', paddingTop: '90px' }}>
  <div className="h-full min-w-[700px]">
	<table className="w-full text-xs xs:text-sm sm:text-base bg-white">
	  <thead className="sticky top-0 z-20 bg-gradient-to-r from-blue-50 via-blue-100 to-cyan-100/80 shadow-md border-b-2 border-blue-200">
		<tr>
		  <th className="px-4 py-3 text-left font-extrabold text-blue-900 text-xs xs:text-sm sm:text-base tracking-wide uppercase bg-opacity-90 backdrop-blur-md border-r border-blue-100 last:border-r-0 whitespace-nowrap shadow-sm min-w-[160px]" style={{ letterSpacing: '0.04em', background: 'rgba(255,255,255,0.85)' }}>Email</th>
		  <th className="px-4 py-3 text-left font-extrabold text-blue-900 text-xs xs:text-sm sm:text-base tracking-wide uppercase bg-opacity-90 backdrop-blur-md border-r border-blue-100 last:border-r-0 whitespace-nowrap shadow-sm min-w-[120px]" style={{ letterSpacing: '0.04em', background: 'rgba(236,245,255,0.85)' }}>Username</th>
		  <th className="px-4 py-3 text-left font-extrabold text-blue-900 text-xs xs:text-sm sm:text-base tracking-wide uppercase bg-opacity-90 backdrop-blur-md border-r border-blue-100 last:border-r-0 whitespace-nowrap shadow-sm min-w-[120px]" style={{ letterSpacing: '0.04em', background: 'rgba(255,255,255,0.85)' }}>First Name</th>
		  <th className="px-4 py-3 text-left font-extrabold text-blue-900 text-xs xs:text-sm sm:text-base tracking-wide uppercase bg-opacity-90 backdrop-blur-md border-r border-blue-100 last:border-r-0 whitespace-nowrap shadow-sm min-w-[120px]" style={{ letterSpacing: '0.04em', background: 'rgba(236,245,255,0.85)' }}>Last Name</th>
		  <th className="px-4 py-3 text-left font-extrabold text-blue-900 text-xs xs:text-sm sm:text-base tracking-wide uppercase bg-opacity-90 backdrop-blur-md border-r border-blue-100 last:border-r-0 whitespace-nowrap shadow-sm min-w-[120px]" style={{ letterSpacing: '0.04em', background: 'rgba(255,255,255,0.85)' }}>Roles</th>
		  <th className="px-4 py-3 text-left font-extrabold text-blue-900 text-xs xs:text-sm sm:text-base tracking-wide uppercase bg-opacity-90 backdrop-blur-md border-r border-blue-100 last:border-r-0 whitespace-nowrap shadow-sm min-w-[120px]" style={{ letterSpacing: '0.04em', background: 'rgba(236,245,255,0.85)' }}>Actions</th>
		</tr>
	  </thead>
	  <tbody>
		{users.length > 0 ? (
		  users.map((user) => (
		<tr key={user.id} className="hover:bg-blue-50 bg-white">
			  <td className="truncate text-xs xs:text-sm sm:text-base px-4 py-2 max-w-[180px] whitespace-nowrap">{user.email}</td>
			  <td className="truncate text-xs xs:text-sm sm:text-base px-4 py-2 max-w-[120px] whitespace-nowrap">{user.username}</td>
			  <td className="truncate text-xs xs:text-sm sm:text-base px-4 py-2 max-w-[120px] whitespace-nowrap">{user.first_name}</td>
			  <td className="truncate text-xs xs:text-sm sm:text-base px-4 py-2 max-w-[120px] whitespace-nowrap">{user.last_name}</td>
			  <td className="px-4 py-2 max-w-[160px] whitespace-nowrap">
				<span className="inline-block px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs font-semibold truncate max-w-[140px]">
				  {user.roles.join(", ")}
				</span>
			  </td>
			  <td className="px-4 py-2 min-w-[120px]">
				<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
				  <RoleDropdown userId={user.id} onAssign={role => handleAssignRole(user.id, role)} />
				</div>
			  </td>
			</tr>
		  ))
		) : (
		  <tr>
			<td colSpan={6} className="text-center text-xs xs:text-sm sm:text-base">No users found.</td>
		  </tr>
		)}
	  </tbody>
	</table>
  </div>
</div>
// ...debug info removed...
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
			);
	}
};

export default UsersManagement;
