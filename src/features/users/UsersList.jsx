import React, { useEffect, useState } from "react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Select } from "../../components/ui/select";
import { useAuth } from "../auth/AuthProvider";
import Loader from '../../components/ui/Loader';
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

const UsersList = () => {
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
			// Optionally refresh users
			setLoading(true);
			const userRes = await api.getUsersByRole(activeRole, currentPage, PAGE_SIZE);
			setUsers(userRes.users || []);
			setTotal(userRes.total || 0);
		} catch (err) {
			showToast({ message: err.message || "Failed to assign role", type: "error" });
		}
	};

	return (
		<Card className="w-full p-4">
			<div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-2">
				<h2 className="text-lg font-bold text-blue-900">Users</h2>
				<Select
					value={activeRole}
					onChange={e => { setActiveRole(e.target.value); setCurrentPage(1); }}
					className="w-40"
				>
					{ROLES.map(role => (
						<option key={role.key} value={role.key}>{role.label}</option>
					))}
				</Select>
			</div>
			{loading ? <Loader /> : error ? (
				<div className="text-red-500">{error}</div>
			) : (
				<div className="overflow-x-auto">
					<table className="min-w-full border-separate border-spacing-y-2">
						<thead className="sticky top-0 bg-blue-50 z-10">
							<tr>
								<th className="px-4 py-2 text-left text-xs font-semibold text-blue-700">Name</th>
								<th className="px-4 py-2 text-left text-xs font-semibold text-blue-700">Email</th>
								<th className="px-4 py-2 text-left text-xs font-semibold text-blue-700">Role</th>
								<th className="px-4 py-2 text-left text-xs font-semibold text-blue-700">Actions</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-blue-100">
							{users.map((user) => (
								<tr key={user.id} className="hover:bg-blue-50 transition">
									<td className="px-4 py-2 whitespace-nowrap">{user.name}</td>
									<td className="px-4 py-2 whitespace-nowrap">{user.email}</td>
									<td className="px-4 py-2 whitespace-nowrap capitalize">{Array.isArray(user.roles) ? user.roles.join(', ') : user.role}</td>
									<td className="px-4 py-2 whitespace-nowrap">
										<div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
											<RoleDropdown userId={user.id} onAssign={role => handleAssignRole(user.id, role)} />
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
			<div className="flex justify-between items-center mt-4">
				<Button onClick={handlePrevPage} disabled={currentPage === 1}>Previous</Button>
				<span className="text-xs text-blue-700">Page {currentPage} of {totalPages}</span>
				<Button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</Button>
			</div>
		</Card>
	);
};

export default UsersList;
