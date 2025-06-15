import React, { useState } from "react";
import { Card } from "../../components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "../../components/ui/table";
import { Button } from "../../components/ui/button";

const UsersManagement = () => {
  // Updated hardcoded users data mimicking API response
  const hardcodedUsersData = {
    page: 1,
    page_size: 10,
    total: 2,
    users: [
      {
        id: "684c889e37e82bd77c72e3ec",
        email: "nduhiu1@gmail.com",
        username: "nduhi1",
        first_name: "Cheche",
        last_name: "Marley",
        roles: ["user"]
      },
      {
        id: "684c85f3d040e5e18d58ba80",
        email: "nduhiu@gmail.com",
        username: "nduhiu",
        first_name: "Cheche",
        last_name: "Marley",
        roles: ["super_admin", "user", "writer"]
      }
    ]
  };

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = hardcodedUsersData.page_size;
  const totalUsers = hardcodedUsersData.total;
  const totalPages = Math.ceil(totalUsers / pageSize);

  // For demonstration, slice the users array for pagination
  const paginatedUsers = hardcodedUsersData.users.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // State for add/delete dialogs (disabled for hardcoded)
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const handleDeleteUser = (userId) => {
    setUserToDelete(userId);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteUser = () => {
    if (userToDelete) {
      alert(`Simulating user deletion: ${userToDelete.slice(-6)}. (API is hardcoded)`);
      setUserToDelete(null);
      setShowDeleteConfirm(false);
    }
  };

  const cancelDeleteUser = () => {
    setUserToDelete(null);
    setShowDeleteConfirm(false);
  };

  return (
    <Card className="m-2 sm:m-4 p-2 sm:p-6 shadow-lg border-0">
      <h2 className="text-lg sm:text-xl font-semibold mb-4 text-blue-900">Users Management (Hardcoded)</h2>
      <Button onClick={() => setShowAddUserDialog(true)} className="mb-4 w-full sm:w-auto" disabled>Add New User (Disabled)</Button>
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
            {paginatedUsers.map((user) => (
              <TableRow key={user.id} className="hover:bg-blue-50">
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.first_name}</TableCell>
                <TableCell>{user.last_name}</TableCell>
                <TableCell>
                  <span className="inline-block px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs font-semibold">
                    {user.roles.join(", ")}
                  </span>
                </TableCell>
                <TableCell>
                  <Button variant="destructive" onClick={() => handleDeleteUser(user.id)} disabled className="w-full sm:w-auto text-xs sm:text-sm">
                    Delete (Disabled)
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {/* Pagination (reuse the same style as orders) */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-2">
        <nav
          className="flex items-center justify-center rounded-full bg-white/80 shadow-sm border border-blue-100 px-3 py-2 gap-1"
          aria-label="Pagination"
        >
          <Button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="rounded-full px-3 py-1 text-base font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 focus:ring-2 focus:ring-blue-400 disabled:opacity-50 border-none shadow-none"
            aria-label="Previous page"
          >
            &lt;
          </Button>
          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`rounded-full px-3 py-1 text-base font-semibold mx-0.5 border-none shadow-none transition-colors
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
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="rounded-full px-3 py-1 text-base font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 focus:ring-2 focus:ring-blue-400 disabled:opacity-50 border-none shadow-none"
            aria-label="Next page"
          >
            &gt;
          </Button>
        </nav>
        <span className="text-sm text-gray-600">Page {currentPage} of {totalPages}</span>
      </div>
    </Card>
  );
};

export default UsersManagement;
